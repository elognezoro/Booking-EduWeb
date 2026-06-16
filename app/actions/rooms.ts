"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { stringifyJson, parseJson } from "@/lib/json";
import { audit } from "@/lib/audit";
import { BLOCKING_BOOKING_STATUS } from "@/lib/enums";

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

  const room = await prisma.resource.create({
    data: {
      organizationId, categoryId: cat.id, name, code, status: "AVAILABLE",
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

/* ----------------------------- Retirer une salle ----------------------------- */
export async function deleteRoom(formData: FormData) {
  const user = await requirePermission("resources.delete");
  const id = String(formData.get("id"));
  const room = await prisma.resource.findFirst({ where: { id, organizationId: user.organizationId ?? undefined } });
  if (!room) redirect("/dashboard/rooms");

  const bookings = await prisma.booking.count({ where: { resourceId: id } });
  if (bookings > 0) {
    // Archivage pour préserver l'historique des réservations.
    await prisma.resource.update({ where: { id }, data: { status: "ARCHIVED" } });
  } else {
    await prisma.resource.delete({ where: { id } });
  }
  await audit({ organizationId: user.organizationId, userId: user.id, action: "room.delete", entityType: "Resource", entityId: id });
  revalidatePath("/dashboard/rooms");
  redirect("/dashboard/rooms?removed=1");
}
