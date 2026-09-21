"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { normalizeEnsMatricule } from "@/lib/utils";
import { VISIT_STATUTS, VISIT_STATUT_LABELS as STATUT_LABELS, VISIT_TIME as HEURE, type VisitStatut } from "@/lib/rooms/attendance";
import { campusOf, checkWithinPerimeter } from "@/lib/rooms/geofence";

const PAGE_REGISTRE = "/dashboard/rooms/registre";

export interface RoomArrivalState {
  error?: string;
  success?: boolean;
  salle?: string;
  heure?: string;
}

function esc(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** IP de la requête (signal serveur indépendant du client, pour la détection a posteriori). */
function requestIp(): string | null {
  try {
    return headers().get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  } catch {
    return null;
  }
}

/**
 * Émargement à l'ARRIVÉE dans une salle multimédia (QR code flashé dans la salle).
 * Public : un étudiant connecté est pré-rempli côté page ; un visiteur renseigne les
 * champs du formulaire APRID. L'heure d'arrivée est horodatée par le serveur et les
 * surveillants de la salle sont notifiés. Garde-fous anti-abus : dédoublonnage d'une
 * visite ouverte ou récente, plafond d'arrivées par salle et par minute, notifications
 * bornées et tolérantes aux pannes.
 */
export async function registerRoomArrival(_prev: RoomArrivalState, formData: FormData): Promise<RoomArrivalState> {
  const roomId = String(formData.get("roomId") || "");
  const lastName = String(formData.get("lastName") || "").trim().slice(0, 80).toUpperCase();
  const firstName = String(formData.get("firstName") || "").trim().slice(0, 80);
  const gender = String(formData.get("gender") || "");
  const statut = String(formData.get("statut") || "") as VisitStatut;
  const filiere = String(formData.get("filiere") || "").trim().slice(0, 120);
  const section = String(formData.get("section") || "").trim().slice(0, 120);
  const matricule = normalizeEnsMatricule(String(formData.get("matricule") || "").slice(0, 40));

  if (!roomId) return { error: "Salle inconnue — flashez à nouveau le QR code affiché dans la salle." };
  if (!lastName || !firstName) return { error: "Renseignez votre nom et vos prénoms." };
  if (gender !== "HOMME" && gender !== "FEMME") return { error: "Sélectionnez votre genre." };
  if (!VISIT_STATUTS.includes(statut)) return { error: "Sélectionnez votre statut." };

  const salle = await prisma.resource.findFirst({
    where: { id: roomId, category: { code: "SM" }, status: { not: "ARCHIVED" } },
    include: { manager: true, supervisors: { include: { user: true } } },
  });
  if (!salle) return { error: "Cette salle n'existe plus. Rapprochez-vous du surveillant." };

  const user = await getCurrentUser();

  // Anti-abus 1 — dédoublonnage : une visite OUVERTE (ou < 10 min) du même visiteur dans
  // cette salle vaut succès, sans nouvelle écriture ni nouvelle notification.
  const dupe = await prisma.roomVisit.findFirst({
    where: {
      resourceId: salle.id,
      AND: [
        { OR: [{ lastName, firstName }, ...(user ? [{ userId: user.id }] : [])] },
        { OR: [{ leftAt: null }, { arrivedAt: { gt: new Date(Date.now() - 10 * 60_000) } }] },
      ],
    },
    orderBy: { arrivedAt: "desc" },
  });
  if (dupe) return { success: true, salle: salle.name, heure: HEURE.format(dupe.arrivedAt) };

  // Anti-abus 2 — plafond par salle : au-delà de 20 arrivées dans la minute, succès
  // générique silencieux (ni écriture, ni notification) pour casser toute inondation.
  const lastMinute = await prisma.roomVisit.count({
    where: { resourceId: salle.id, arrivedAt: { gt: new Date(Date.now() - 60_000) } },
  });
  if (lastMinute >= 20) return { success: true, salle: salle.name, heure: HEURE.format(new Date()) };

  // Fiche étudiante : d'abord le compte connecté, sinon le matricule borné à l'établissement.
  let studentId: string | null = null;
  if (statut === "ETUDIANT") {
    const byUser = user ? await prisma.student.findFirst({ where: { userId: user.id } }) : null;
    const fiche =
      byUser ?? (matricule ? await prisma.student.findFirst({ where: { organizationId: salle.organizationId, matricule } }) : null);
    studentId = fiche?.id ?? null;
  }

  const visit = await prisma.roomVisit.create({
    data: {
      organizationId: salle.organizationId,
      resourceId: salle.id,
      userId: user?.id ?? null,
      studentId,
      lastName,
      firstName,
      gender,
      statut,
      matricule: matricule || null,
      filiere: filiere || null,
      section: section || null,
    },
  });
  const heure = HEURE.format(visit.arrivedAt);

  await audit({
    organizationId: salle.organizationId,
    userId: user?.id ?? null,
    action: "room.visit",
    entityType: "Resource",
    entityId: salle.id,
    newValue: { salle: salle.name, nom: `${lastName} ${firstName}`, statut, filiere: filiere || null, heure },
  });

  // Notification : surveillants affectés → responsable de la salle → responsables de
  // ressources → admins (jamais plus de 5 destinataires, envois parallèles tolérants).
  let surveillants = salle.supervisors.map((s) => s.user).filter((u) => u.status === "ACTIVE");
  if (surveillants.length === 0 && salle.manager && salle.manager.status === "ACTIVE") surveillants = [salle.manager];
  if (surveillants.length === 0) {
    surveillants = await prisma.user.findMany({
      where: { organizationId: salle.organizationId, status: "ACTIVE", roles: { some: { role: { key: "RESOURCE_MANAGER" } } } },
      take: 5,
    });
  }
  if (surveillants.length === 0) {
    surveillants = await prisma.user.findMany({
      where: { organizationId: salle.organizationId, status: "ACTIVE", roles: { some: { role: { key: "ORG_ADMIN" } } } },
      take: 5,
    });
  }
  const fullName = `${firstName} ${lastName}`.trim();
  const shortName = fullName.slice(0, 60);
  await Promise.allSettled(
    surveillants.slice(0, 5).map((s) =>
      sendNotification({
        userId: s.id,
        to: s.email,
        subject: `Arrivée en salle ${salle.name} : ${shortName} (${heure})`,
        html: renderEmail({
          title: `Arrivée — salle ${esc(salle.name)}`,
          intro: `${esc(fullName)} vient d'émarger à l'entrée de la salle « ${esc(salle.name)} ». Pensez à enregistrer son heure de départ dans le registre lorsque la personne quittera la salle.`,
          rows: [
            ["Salle", esc(salle.name)],
            ["Heure d'arrivée", heure],
            ["Statut", STATUT_LABELS[statut]],
            ...(filiere ? ([["Filière", esc(filiere + (section ? ` · ${section}` : ""))]] as [string, string][]) : []),
            ...(matricule ? ([["Matricule", esc(matricule)]] as [string, string][]) : []),
          ],
          cta: { label: "Ouvrir le registre de présence", href: `${APP_URL}${PAGE_REGISTRE}` },
        }),
        text: `${fullName} est arrivé(e) en salle ${salle.name} à ${heure}. Enregistrez son heure de départ dans le registre.`,
        type: "INFO",
      })
    )
  );

  revalidatePath(PAGE_REGISTRE);
  return { success: true, salle: salle.name, heure };
}

/** Habilité sur cette salle : gestionnaire (resources.update) OU surveillant affecté. */
async function canOperateRoom(user: Awaited<ReturnType<typeof requireUser>>, resourceId: string) {
  if (user.permissions.has("resources.update")) return true;
  const sup = await prisma.roomSupervisor.findFirst({ where: { resourceId, userId: user.id } });
  return !!sup;
}

/* ------------------- Départ pointé par le surveillant ------------------- */
export async function closeRoomVisit(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const back = PAGE_REGISTRE;
  if (!id || !user.organizationId) redirect(back);

  const visit = await prisma.roomVisit.findFirst({
    where: { id, organizationId: user.organizationId },
    include: { resource: { select: { name: true } } },
  });
  if (!visit) redirect(back);
  if (!(await canOperateRoom(user, visit.resourceId))) redirect("/dashboard?denied=1");

  const res = await prisma.roomVisit.updateMany({
    where: { id, leftAt: null },
    data: { leftAt: new Date(), recordedById: user.id },
  });
  if (res.count === 1) {
    await audit({
      organizationId: user.organizationId,
      userId: user.id,
      action: "room.visit_close",
      entityType: "Resource",
      entityId: visit.resourceId,
      newValue: { salle: visit.resource.name, nom: `${visit.lastName} ${visit.firstName}`, arrivee: HEURE.format(visit.arrivedAt), depart: HEURE.format(new Date()) },
    });
  }
  revalidatePath(back);
  redirect(res.count === 1 ? `${back}?closed=1` : back);
}

/* ------------------- Ouverture / fermeture de la salle (GPS) ------------------- */

function parseCoord(v: FormDataEntryValue | null, min: number, max: number): number | null {
  const n = Number.parseFloat(String(v ?? ""));
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

/**
 * Position GPS OBLIGATOIRE (anti-fraude) : sans coordonnées, l'action est refusée ;
 * si le périmètre institutionnel est configuré (page Organisation), une position
 * hors zone est refusée et la tentative est journalisée.
 */
async function requireCampusPosition(
  user: { id: string; organizationId: string | null },
  salle: { id: string; name: string },
  formData: FormData,
  back: string
): Promise<{ lat: number; lng: number; accuracy: number | null }> {
  const lat = parseCoord(formData.get("lat"), -90, 90);
  const lng = parseCoord(formData.get("lng"), -180, 180);
  const accuracy = parseCoord(formData.get("accuracy"), 0, 100_000);
  if (lat == null || lng == null) redirect(`${back}?gps=1`);

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId! },
    select: { campusLat: true, campusLng: true, campusRadiusM: true },
  });
  const campus = org ? campusOf(org) : null;
  if (campus) {
    const check = checkWithinPerimeter({ lat, lng, accuracy }, campus);
    if (!check.ok) {
      await audit({
        organizationId: user.organizationId,
        userId: user.id,
        action: "room.geofence_denied",
        entityType: "Resource",
        entityId: salle.id,
        newValue: { salle: salle.name, distanceM: check.distanceM, rayonM: campus.radiusM, position: `${lat},${lng}`, ip: requestIp() },
      });
      redirect(`${back}?horszone=${check.distanceM}`);
    }
  }
  return { lat, lng, accuracy };
}

/**
 * Le surveillant « ouvre » la salle : horodatage serveur + position GPS captée par
 * son téléphone au moment de l'action (OBLIGATOIRE : refusée = action bloquée ; hors périmètre institutionnel = refus consigné).
 */
export async function openRoom(formData: FormData) {
  const user = await requireUser();
  const back = PAGE_REGISTRE;
  const roomId = String(formData.get("roomId") || "");
  if (!roomId || !user.organizationId) redirect(back);

  const salle = await prisma.resource.findFirst({
    where: { id: roomId, organizationId: user.organizationId, category: { code: "SM" }, status: { not: "ARCHIVED" } },
    select: { id: true, name: true },
  });
  if (!salle) redirect(back);
  if (!(await canOperateRoom(user, salle.id))) redirect("/dashboard?denied=1");

  const { lat, lng, accuracy } = await requireCampusPosition(user, salle, formData, back);

  // Transaction avec verrou sur la salle : deux « Ouvrir » simultanés ne créent qu'une session.
  const opening = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Resource" WHERE "id" = ${salle.id} FOR UPDATE`;
    const deja = await tx.roomOpening.findFirst({ where: { resourceId: salle.id, closedAt: null } });
    if (deja) return null;
    return tx.roomOpening.create({
      data: { organizationId: user.organizationId!, resourceId: salle.id, openedById: user.id, openLat: lat, openLng: lng, openAccuracy: accuracy },
    });
  });
  if (!opening) redirect(`${back}?dejaouverte=1`);
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "room.open",
    entityType: "Resource",
    entityId: salle.id,
    newValue: { salle: salle.name, heure: HEURE.format(opening.openedAt), position: `${lat},${lng} (±${Math.round(accuracy ?? 0)} m)`, ip: requestIp() },
  });
  revalidatePath(back);
  redirect(`${back}?opened=1`);
}

/** Le surveillant « ferme » la salle : horodatage + position GPS de fermeture. */
export async function closeRoom(formData: FormData) {
  const user = await requireUser();
  const back = PAGE_REGISTRE;
  const roomId = String(formData.get("roomId") || "");
  if (!roomId || !user.organizationId) redirect(back);

  const salle = await prisma.resource.findFirst({
    where: { id: roomId, organizationId: user.organizationId, category: { code: "SM" } },
    select: { id: true, name: true },
  });
  if (!salle) redirect(back);
  if (!(await canOperateRoom(user, salle.id))) redirect("/dashboard?denied=1");

  const { lat, lng, accuracy } = await requireCampusPosition(user, salle, formData, back);

  // Transaction avec verrou sur la salle : deux « Fermer » simultanés ne clôturent qu'une fois.
  const ouverte = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Resource" WHERE "id" = ${salle.id} FOR UPDATE`;
    const session = await tx.roomOpening.findFirst({
      where: { resourceId: salle.id, closedAt: null },
      orderBy: { openedAt: "desc" },
    });
    if (!session) return null;
    await tx.roomOpening.update({
      where: { id: session.id },
      data: { closedById: user.id, closedAt: new Date(), closeLat: lat, closeLng: lng, closeAccuracy: accuracy },
    });
    return session;
  });
  if (!ouverte) redirect(back);
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "room.close",
    entityType: "Resource",
    entityId: salle.id,
    newValue: { salle: salle.name, ouverture: HEURE.format(ouverte.openedAt), fermeture: HEURE.format(new Date()), position: `${lat},${lng} (±${Math.round(accuracy ?? 0)} m)`, ip: requestIp() },
  });
  revalidatePath(back);
  redirect(`${back}?closedroom=1`);
}
