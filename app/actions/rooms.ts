"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { stringifyJson, parseJson } from "@/lib/json";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { BLOCKING_BOOKING_STATUS } from "@/lib/enums";

/** Échappe une valeur interpolée dans le HTML d'un e-mail. */
function esc(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const SEAT_ROOM_RULES = {
  bookingMode: "partial" as const,
  seatBased: true,
  maxDurationMinutes: 240,
  minNoticeHours: 1,
  requiresValidation: true,
};

/** Récupère (ou crée) la catégorie « Salles multimédias » (code SM) de l'organisation. */
async function getOrCreateMmCategory(organizationId: string) {
  let cat = await prisma.resourceCategory.findFirst({ where: { organizationId, code: "SM" } });
  if (!cat) {
    cat = await prisma.resourceCategory.create({
      data: {
        organizationId, name: "Salles multimédias", code: "SM", icon: "MonitorPlay", color: "#064B3A",
        description: "Salles équipées de postes informatiques (réservation poste par poste).", validationMode: "SIMPLE",
      },
    });
  }
  return cat;
}

/** Génère le prochain code SM-NN disponible. */
async function nextRoomCode(organizationId: string, categoryId: string) {
  const rooms = await prisma.resource.findMany({ where: { organizationId, categoryId }, select: { code: true } });
  let max = 0;
  for (const r of rooms) {
    const m = /^SM-(\d+)$/.exec(r.code);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `SM-${String(max + 1).padStart(2, "0")}`;
}

/* ----------------------------- Ajouter une salle ----------------------------- */
export async function createRoom(formData: FormData) {
  const user = await requirePermission("resources.create");
  const data = z
    .object({ name: z.string().min(2, "Nom requis."), capacity: z.coerce.number().int().min(1).max(500) })
    .parse({ name: formData.get("name"), capacity: formData.get("capacity") });

  const organizationId = user.organizationId!;
  const cat = await getOrCreateMmCategory(organizationId);
  const code = await nextRoomCode(organizationId, cat.id);
  const name = data.name.trim().toUpperCase();
  // Rattachement à la sous-direction en charge des salles (périmètre des surveillants).
  const aprid = await prisma.department.findFirst({ where: { organizationId, code: "APRID" }, select: { id: true } });

  const room = await prisma.resource.create({
    data: {
      organizationId, categoryId: cat.id, name, code, status: "AVAILABLE", departmentId: aprid?.id ?? null,
      capacity: data.capacity, quantityTotal: data.capacity, quantityAvailable: data.capacity,
      location: "Sous-Direction APRID",
      description: `Salle multimédia « ${name} » — ${data.capacity} postes informatiques. Réservation poste par poste.`,
      equipment: stringifyJson([`${data.capacity} postes informatiques`, "Vidéoprojecteur", "Climatisation"]),
      rules: stringifyJson(SEAT_ROOM_RULES),
    },
  });
  await audit({ organizationId, userId: user.id, action: "room.create", entityType: "Resource", entityId: room.id, newValue: { name, capacity: data.capacity } });
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/rooms?added=1");
}

/* ----------------------------- Régler la capacité (postes) ----------------------------- */
export async function setRoomCapacity(formData: FormData) {
  const user = await requirePermission("resources.update");
  const id = String(formData.get("id"));
  const capacity = z.coerce.number().int().min(1).max(500).parse(formData.get("capacity"));

  const room = await prisma.resource.findFirst({ where: { id, organizationId: user.organizationId ?? undefined } });
  if (!room) redirect("/dashboard/rooms");

  // On ne peut pas réduire la capacité en dessous d'un poste déjà réservé (réservations actives).
  const now = new Date();
  const active = await prisma.booking.findMany({
    where: { resourceId: id, status: { in: BLOCKING_BOOKING_STATUS }, endAt: { gte: now }, seatNumbers: { not: null } },
    select: { seatNumbers: true },
  });
  let maxSeat = 0;
  for (const b of active) for (const s of parseJson<number[]>(b.seatNumbers, [])) maxSeat = Math.max(maxSeat, s);
  if (capacity < maxSeat) redirect(`/dashboard/rooms?capError=${encodeURIComponent(room.name)}&min=${maxSeat}`);

  await prisma.resource.update({ where: { id }, data: { capacity, quantityTotal: capacity, quantityAvailable: capacity } });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "room.capacity", entityType: "Resource", entityId: id, newValue: { capacity } });
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/rooms?saved=1");
}

/* ----------------------------- Surveillants d'une salle ----------------------------- */

/** Sous-arbre d'un service (lui-même + descendance) — périmètre des agents éligibles. */
async function departmentSubtreeIds(organizationId: string, rootId: string): Promise<Set<string>> {
  const rows = await prisma.department.findMany({ where: { organizationId }, select: { id: true, parentId: true } });
  const byParent = new Map<string | null, string[]>();
  for (const r of rows) {
    const list = byParent.get(r.parentId) ?? [];
    list.push(r.id);
    byParent.set(r.parentId, list);
  }
  const out = new Set<string>([rootId]);
  const stack = [rootId];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const child of byParent.get(cur) ?? []) {
      if (!out.has(child)) { out.add(child); stack.push(child); }
    }
  }
  return out;
}

/**
 * Affecte un ou plusieurs surveillants à une salle multimédia, parmi les agents
 * de la sous-direction de rattachement de la salle (toute l'organisation si la
 * salle n'est rattachée à aucun service). Chaque surveillant est notifié.
 */
export async function addRoomSupervisors(input: { roomId: string; userIds: string[] }) {
  const user = await requirePermission("resources.update");
  const roomId = input?.roomId || "";
  const userIds = Array.isArray(input?.userIds) ? input.userIds.filter(Boolean) : [];
  if (!roomId || userIds.length === 0 || !user.organizationId) return;

  const salle = await prisma.resource.findFirst({
    where: { id: roomId, organizationId: user.organizationId ?? undefined, category: { code: "SM" } },
    select: { id: true, name: true, organizationId: true, departmentId: true },
  });
  if (!salle) return;

  // Éligibilité : agents actifs de la sous-direction de rattachement (et ses services).
  const scope = salle.departmentId ? await departmentSubtreeIds(salle.organizationId, salle.departmentId) : null;
  const candidates = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      organizationId: salle.organizationId,
      status: "ACTIVE",
      ...(scope ? { departmentId: { in: [...scope] } } : {}),
    },
    select: { id: true, email: true, firstName: true, lastName: true },
  });
  if (candidates.length === 0) return;

  for (const c of candidates) {
    await prisma.roomSupervisor.upsert({
      where: { resourceId_userId: { resourceId: salle.id, userId: c.id } },
      create: { resourceId: salle.id, userId: c.id },
      update: {},
    });
    await sendNotification({
      userId: c.id,
      to: c.email,
      subject: `Vous êtes surveillant de la salle ${salle.name}`,
      html: renderEmail({
        title: `Surveillance — salle ${esc(salle.name)}`,
        intro: `${esc(user.fullName)} vous a désigné(e) surveillant(e) de la salle multimédia « ${esc(salle.name)} ». Vous recevrez une notification à chaque arrivée (émargement par QR code) et pointerez les heures de départ dans le registre de présence.`,
        cta: { label: "Ouvrir le registre de présence", href: `${APP_URL}/dashboard/rooms/registre` },
      }),
      text: `Vous êtes désigné(e) surveillant(e) de la salle ${salle.name}. Registre : ${APP_URL}/dashboard/rooms/registre`,
      type: "INFO",
    });
  }
  await audit({
    organizationId: salle.organizationId,
    userId: user.id,
    action: "room.supervisor_add",
    entityType: "Resource",
    entityId: salle.id,
    newValue: { salle: salle.name, surveillants: candidates.map((c) => `${c.firstName} ${c.lastName}`) },
  });
  revalidatePath("/dashboard/rooms");
}

/** Retire un surveillant d'une salle. */
export async function removeRoomSupervisor(formData: FormData) {
  const user = await requirePermission("resources.update");
  const roomId = String(formData.get("roomId") || "");
  const userId = String(formData.get("userId") || "");
  if (!user.organizationId) return;
  const salle = await prisma.resource.findFirst({
    where: { id: roomId, organizationId: user.organizationId ?? undefined },
    select: { id: true, name: true, organizationId: true },
  });
  if (!salle) return;
  const removed = await prisma.roomSupervisor.deleteMany({ where: { resourceId: salle.id, userId } });
  if (removed.count > 0) {
    await audit({
      organizationId: salle.organizationId,
      userId: user.id,
      action: "room.supervisor_remove",
      entityType: "Resource",
      entityId: salle.id,
      newValue: { salle: salle.name, userId },
    });
  }
  revalidatePath("/dashboard/rooms");
}

/* ----------------------------- Retirer une salle ----------------------------- */
export async function deleteRoom(formData: FormData) {
  const user = await requirePermission("resources.delete");
  const id = String(formData.get("id"));
  const room = await prisma.resource.findFirst({ where: { id, organizationId: user.organizationId ?? undefined } });
  if (!room) redirect("/dashboard/rooms");

  const [bookings, visites, ouvertures] = await Promise.all([
    prisma.booking.count({ where: { resourceId: id } }),
    prisma.roomVisit.count({ where: { resourceId: id } }),
    prisma.roomOpening.count({ where: { resourceId: id } }),
  ]);
  if (bookings > 0 || visites > 0 || ouvertures > 0) {
    // Archivage pour préserver l'historique (réservations, registre de présence, ouvertures GPS).
    await prisma.resource.update({ where: { id }, data: { status: "ARCHIVED" } });
  } else {
    await prisma.resource.delete({ where: { id } });
  }
  await audit({ organizationId: user.organizationId, userId: user.id, action: "room.delete", entityType: "Resource", entityId: id });
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/rooms?removed=1");
}
