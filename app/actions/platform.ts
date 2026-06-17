"use server";

import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";
import { provisionInstitution } from "@/lib/platform/provision";
import { setGamesGating } from "@/lib/platform/settings";
import { parseCsv, findColumn, normalizeKey } from "@/lib/csv";
import { CI_MINISTRIES } from "@/lib/ci-ministries";

const ORG_PATH = "/dashboard/platform/organizations";
const GAMES_PATH = "/dashboard/platform/jeux";
const PLANS = ["PILOTE", "STANDARD", "PREMIUM", "NATIONAL"];
const SUB_STATUS = ["ACTIVE", "SUSPENDED", "CANCELLED"];

/** Crée (provisionne) un nouvel établissement avec son administrateur. */
export async function createInstitution(formData: FormData) {
  await requirePermission("platform.manage");
  const name = String(formData.get("name") || "").trim();
  const acronym = String(formData.get("acronym") || "").trim().toUpperCase();
  const city = String(formData.get("city") || "").trim();
  const plan = PLANS.includes(String(formData.get("plan"))) ? String(formData.get("plan")) : "STANDARD";
  const seats = Math.max(1, Math.min(100000, Number(formData.get("seats")) || 100));
  const adminFirst = String(formData.get("adminFirst") || "").trim();
  const adminLast = String(formData.get("adminLast") || "").trim();
  const adminEmail = String(formData.get("adminEmail") || "").trim().toLowerCase();
  const slug = String(formData.get("slug") || "").trim() || slugify(acronym || name);
  const ministryId = String(formData.get("ministryId") || "").trim() || undefined;

  if (!name || !acronym || !adminFirst || !adminLast || !adminEmail) redirect(`${ORG_PATH}?error=champs`);

  const [orgExists, emailExists] = await Promise.all([
    prisma.organization.findFirst({ where: { OR: [{ slug }, { name }] } }),
    prisma.user.findFirst({ where: { email: adminEmail } }),
  ]);
  if (orgExists) redirect(`${ORG_PATH}?error=slug`);
  if (emailExists) redirect(`${ORG_PATH}?error=email`);

  await provisionInstitution({ name, acronym, slug, city, plan, seats, adminEmail, adminFirst, adminLast, ministryId });
  revalidatePath(ORG_PATH);
  redirect(`${ORG_PATH}?created=${encodeURIComponent(name)}`);
}

/** Import en lot d'établissements depuis un CSV (provisionne chaque ligne). */
export async function importInstitutionsCsv(formData: FormData) {
  await requirePermission("platform.manage");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect(`${ORG_PATH}?error=csv`);
  let rows: string[][];
  try {
    rows = parseCsv(await (file as File).text());
  } catch {
    redirect(`${ORG_PATH}?error=csv`);
  }
  rows = rows!;
  if (rows.length < 2) redirect(`${ORG_PATH}?error=csv`);

  const header = rows[0];
  const col = {
    nom: findColumn(header, ["nom", "name", "etablissement", "établissement"]),
    sigle: findColumn(header, ["sigle", "acronym", "acronyme"]),
    slug: findColumn(header, ["slug", "identifiant"]),
    ville: findColumn(header, ["ville", "city"]),
    ministere: findColumn(header, ["ministere", "ministère", "tutelle"]),
    formule: findColumn(header, ["formule", "plan"]),
    sieges: findColumn(header, ["sieges", "sièges", "seats"]),
    aprenom: findColumn(header, ["admin_prenom", "prenom admin", "prenom", "prénom"]),
    anom: findColumn(header, ["admin_nom", "nom admin", "nom"]),
    aemail: findColumn(header, ["admin_email", "email admin", "email", "e-mail"]),
  };
  const ministries = await prisma.ministry.findMany();
  let created = 0;
  let skipped = 0;
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const get = (idx: number) => (idx >= 0 ? (cells[idx] ?? "").trim() : "");
    const name = get(col.nom);
    const acronym = get(col.sigle).toUpperCase();
    const adminEmail = get(col.aemail).toLowerCase();
    const adminFirst = get(col.aprenom);
    const adminLast = get(col.anom);
    if (!name || !acronym || !adminEmail || !adminFirst || !adminLast) {
      skipped++;
      continue;
    }
    const slug = get(col.slug) || slugify(acronym || name);
    const [orgEx, emailEx] = await Promise.all([
      prisma.organization.findFirst({ where: { OR: [{ slug }, { name }] } }),
      prisma.user.findFirst({ where: { email: adminEmail } }),
    ]);
    if (orgEx || emailEx) {
      skipped++;
      continue;
    }
    const planRaw = get(col.formule).toUpperCase();
    const plan = PLANS.includes(planRaw) ? planRaw : "STANDARD";
    const seats = Math.max(1, Math.min(100000, Number(get(col.sieges)) || 100));
    const minKey = normalizeKey(get(col.ministere));
    const ministry = minKey ? ministries.find((m) => normalizeKey(m.acronym || "") === minKey || normalizeKey(m.name) === minKey) : null;
    try {
      await provisionInstitution({ name, acronym, slug, city: get(col.ville), plan, seats, adminEmail, adminFirst, adminLast, ministryId: ministry?.id });
      created++;
    } catch {
      skipped++;
    }
  }
  revalidatePath(ORG_PATH);
  redirect(`${ORG_PATH}?imported=${created}&skipped=${skipped}`);
}

/** Met à jour l'abonnement d'un établissement (formule, statut, sièges, renouvellement). */
export async function updateSubscription(formData: FormData) {
  await requirePermission("platform.manage");
  const organizationId = String(formData.get("organizationId"));
  const plan = PLANS.includes(String(formData.get("plan"))) ? String(formData.get("plan")) : "PILOTE";
  const status = SUB_STATUS.includes(String(formData.get("status"))) ? String(formData.get("status")) : "ACTIVE";
  const seats = Math.max(0, Math.min(100000, Number(formData.get("seats")) || 0));
  const raw = String(formData.get("renewsAt") || "").trim();
  const d = raw ? new Date(raw) : null;
  const renewsAt = d && !isNaN(d.getTime()) ? d : null;
  const ministryId = String(formData.get("ministryId") || "").trim() || null;

  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (org && !org.isPlatform) {
    await prisma.subscription.upsert({
      where: { organizationId },
      create: { organizationId, plan, status, seats, renewsAt },
      update: { plan, status, seats, renewsAt },
    });
    await prisma.organization.update({ where: { id: organizationId }, data: { ministryId } });
  }
  revalidatePath(ORG_PATH);
  redirect(`${ORG_PATH}?saved=1`);
}

/**
 * Supprime DÉFINITIVEMENT un établissement et toutes ses données dépendantes
 * (utilisateurs, rôles, sites/services, ressources, réservations, bibliothèque, jeux…).
 * Opération transactionnelle (tout ou rien). Réservée au super admin ; l'espace plateforme est protégé.
 */
export async function deleteOrganization(formData: FormData) {
  await requirePermission("platform.manage");
  const organizationId = String(formData.get("organizationId") || "");
  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (!org || org.isPlatform) {
    revalidatePath(ORG_PATH);
    redirect(ORG_PATH);
  }
  const oid = org.id;

  const [users, resources, bookings] = await Promise.all([
    prisma.user.findMany({ where: { organizationId: oid }, select: { id: true } }),
    prisma.resource.findMany({ where: { organizationId: oid }, select: { id: true } }),
    prisma.booking.findMany({ where: { organizationId: oid }, select: { id: true } }),
  ]);
  const uids = users.map((u) => u.id);
  const rids = resources.map((r) => r.id);
  const bids = bookings.map((b) => b.id);

  try {
    await prisma.$transaction([
      prisma.notification.deleteMany({ where: { OR: [{ userId: { in: uids } }, { bookingId: { in: bids } }] } }),
      prisma.booking.deleteMany({ where: { organizationId: oid } }), // cascade : validations, historiques, participants, avis
      prisma.incident.deleteMany({ where: { resourceId: { in: rids } } }),
      prisma.maintenance.deleteMany({ where: { resourceId: { in: rids } } }),
      prisma.brainSportAttempt.deleteMany({ where: { userId: { in: uids } } }),
      prisma.brainSportBadge.deleteMany({ where: { userId: { in: uids } } }),
      prisma.documentResource.deleteMany({ where: { organizationId: oid } }), // cascade : auteurs, avis, consultations, téléchargements, achats, réservations, prêts, doublons
      prisma.documentDomain.deleteMany({ where: { organizationId: oid } }),
      prisma.documentCollection.deleteMany({ where: { organizationId: oid } }),
      prisma.digitalLibrary.deleteMany({ where: { organizationId: oid } }),
      prisma.competition.deleteMany({ where: { organizationId: oid } }), // cascade : participants
      prisma.auditLog.deleteMany({ where: { organizationId: oid } }),
      prisma.resource.deleteMany({ where: { organizationId: oid } }),
      prisma.resourceCategory.deleteMany({ where: { organizationId: oid } }),
      prisma.department.deleteMany({ where: { organizationId: oid, NOT: { parentId: null } } }),
      prisma.department.deleteMany({ where: { organizationId: oid } }),
      prisma.site.deleteMany({ where: { organizationId: oid } }),
      prisma.user.deleteMany({ where: { organizationId: oid } }), // cascade : UserRole
      prisma.role.deleteMany({ where: { organizationId: oid } }), // cascade : RolePermission
      prisma.organization.delete({ where: { id: oid } }), // cascade : abonnement, paramètres
    ]);
  } catch {
    redirect(`${ORG_PATH}?error=delete`);
  }
  revalidatePath(ORG_PATH);
  redirect(`${ORG_PATH}?deleted=${encodeURIComponent(org.name)}`);
}

/** Active ou suspend un établissement (les utilisateurs d'un établissement suspendu ne peuvent plus accéder). */
export async function setOrganizationStatus(formData: FormData) {
  await requirePermission("platform.manage");
  const organizationId = String(formData.get("organizationId"));
  const status = String(formData.get("status")) === "SUSPENDED" ? "SUSPENDED" : "ACTIVE";
  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  if (org && !org.isPlatform) await prisma.organization.update({ where: { id: organizationId }, data: { status } });
  revalidatePath(ORG_PATH);
  redirect(`${ORG_PATH}?saved=1`);
}

/** Enregistre les réglages globaux du verrouillage des jeux « Sport cérébral ». */
export async function saveGamesGating(formData: FormData) {
  await requirePermission("platform.manage");
  const enabled = formData.get("enabled") === "on" || formData.get("enabled") === "true";
  const freeCount = Math.max(0, Math.min(20, Number(formData.get("freeCount")) || 3));
  const mode = String(formData.get("mode")) === "fixed" ? "fixed" : "random";
  const freeSlugs = formData.getAll("freeSlugs").map(String);
  await setGamesGating({ enabled, freeCount, mode, freeSlugs });
  revalidatePath(GAMES_PATH);
  revalidatePath("/sport-cerebral");
  redirect(`${GAMES_PATH}?saved=1`);
}

/* ----------------------------- Gouvernement & ministères ----------------------------- */
const GOV_PATH = "/dashboard/platform/government";

/** Enregistre / met à jour le gouvernement (entité unique). */
export async function saveGovernment(formData: FormData) {
  await requirePermission("platform.manage");
  const name = String(formData.get("name") || "").trim();
  const country = String(formData.get("country") || "").trim() || "Côte d'Ivoire";
  if (!name) redirect(`${GOV_PATH}?error=champs`);
  const existing = await prisma.government.findFirst();
  if (existing) await prisma.government.update({ where: { id: existing.id }, data: { name, country } });
  else await prisma.government.create({ data: { name, country } });
  revalidatePath(GOV_PATH);
  redirect(`${GOV_PATH}?saved=1`);
}

export async function createMinistry(formData: FormData) {
  await requirePermission("platform.manage");
  const governmentId = String(formData.get("governmentId") || "");
  const name = String(formData.get("name") || "").trim();
  const acronym = String(formData.get("acronym") || "").trim().toUpperCase() || null;
  if (governmentId && name) await prisma.ministry.create({ data: { governmentId, name, acronym } });
  revalidatePath(GOV_PATH);
  redirect(`${GOV_PATH}?saved=1`);
}

export async function updateMinistry(formData: FormData) {
  await requirePermission("platform.manage");
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const acronym = String(formData.get("acronym") || "").trim().toUpperCase() || null;
  if (id && name) await prisma.ministry.update({ where: { id }, data: { name, acronym } });
  revalidatePath(GOV_PATH);
  redirect(`${GOV_PATH}?saved=1`);
}

export async function deleteMinistry(formData: FormData) {
  await requirePermission("platform.manage");
  const id = String(formData.get("id") || "");
  // les établissements rattachés voient leur tutelle remise à zéro (FK optionnelle).
  await prisma.organization.updateMany({ where: { ministryId: id }, data: { ministryId: null } });
  await prisma.ministry.delete({ where: { id } }).catch(() => {});
  revalidatePath(GOV_PATH);
  redirect(`${GOV_PATH}?saved=1`);
}

/** Import en lot de ministères depuis un CSV (colonnes : nom, sigle), pour le gouvernement courant. */
export async function importMinistriesCsv(formData: FormData) {
  await requirePermission("platform.manage");
  const governmentId = String(formData.get("governmentId") || "");
  const gov = governmentId ? await prisma.government.findUnique({ where: { id: governmentId } }) : await prisma.government.findFirst();
  if (!gov) redirect(`${GOV_PATH}?error=champs`);
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect(`${GOV_PATH}?error=csv`);
  let rows: string[][];
  try {
    rows = parseCsv(await (file as File).text());
  } catch {
    redirect(`${GOV_PATH}?error=csv`);
  }
  rows = rows!;
  if (rows.length < 2) redirect(`${GOV_PATH}?error=csv`);
  const header = rows[0];
  const col = {
    nom: findColumn(header, ["nom", "name", "ministere", "ministère", "intitule", "intitulé"]),
    sigle: findColumn(header, ["sigle", "acronym", "acronyme", "abreviation"]),
  };
  const existing = await prisma.ministry.findMany({ where: { governmentId: gov.id }, select: { name: true } });
  const have = new Set(existing.map((m) => normalizeKey(m.name)));
  let created = 0;
  let skipped = 0;
  for (let i = 1; i < rows.length; i++) {
    const get = (idx: number) => (idx >= 0 ? (rows[i][idx] ?? "").trim() : "");
    const name = get(col.nom);
    if (name.length < 2) {
      skipped++;
      continue;
    }
    if (have.has(normalizeKey(name))) {
      skipped++;
      continue;
    }
    have.add(normalizeKey(name));
    await prisma.ministry.create({ data: { governmentId: gov.id, name, acronym: get(col.sigle).toUpperCase() || null } });
    created++;
  }
  revalidatePath(GOV_PATH);
  redirect(`${GOV_PATH}?imported=${created}&skipped=${skipped}`);
}

/** Pré-remplit les ministères du gouvernement actuel de Côte d'Ivoire (idempotent, ignore les doublons). */
export async function seedCiMinistries(formData: FormData) {
  await requirePermission("platform.manage");
  const governmentId = String(formData.get("governmentId") || "");
  const gov = governmentId ? await prisma.government.findUnique({ where: { id: governmentId } }) : await prisma.government.findFirst();
  if (!gov) redirect(`${GOV_PATH}?error=champs`);
  const existing = await prisma.ministry.findMany({ where: { governmentId: gov.id }, select: { name: true } });
  const have = new Set(existing.map((m) => normalizeKey(m.name)));
  let created = 0;
  for (const m of CI_MINISTRIES) {
    if (have.has(normalizeKey(m.name))) continue;
    await prisma.ministry.create({ data: { governmentId: gov.id, name: m.name, acronym: m.acronym ?? null } });
    created++;
  }
  revalidatePath(GOV_PATH);
  redirect(`${GOV_PATH}?seeded=${created}`);
}
