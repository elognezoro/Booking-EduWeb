"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission, ACTIVE_ORG_COOKIE } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";

/* ----------------------------- Sélecteur d'institution (super admin) ----------------------------- */
export async function switchInstitution(formData: FormData) {
  await requirePermission("platform.manage"); // réservé au super administrateur
  const orgId = String(formData.get("orgId") || "");
  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { id: true } });
  if (org) {
    cookies().set(ACTIVE_ORG_COOKIE, org.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  revalidatePath("/dashboard", "layout");
}
import { stringifyJson } from "@/lib/json";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { parseCsv, findColumn, normalizeKey } from "@/lib/csv";
import { formatGivenName, formatFamilyName, isEnsMatricule } from "@/lib/utils";

/* ----------------------------- Organisation ----------------------------- */
export async function updateOrganization(formData: FormData) {
  const user = await requirePermission("organization.manage");
  const data = z
    .object({ name: z.string().min(2), acronym: z.string().optional(), city: z.string().optional(), address: z.string().optional(), primaryColor: z.string().optional() })
    .parse({
      name: formData.get("name"),
      acronym: formData.get("acronym") || undefined,
      city: formData.get("city") || undefined,
      address: formData.get("address") || undefined,
      primaryColor: formData.get("primaryColor") || undefined,
    });
  await prisma.organization.update({ where: { id: user.organizationId! }, data });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "organization.update", entityType: "Organization", entityId: user.organizationId, newValue: data });
  revalidatePath("/dashboard/admin/organization");
  redirect("/dashboard/admin/organization?saved=1");
}

/* ----------------------------- Sites & services ----------------------------- */
export async function createSite(formData: FormData) {
  const user = await requirePermission("sites.manage");
  const data = z.object({ name: z.string().min(2), code: z.string().optional(), city: z.string().optional() }).parse({
    name: formData.get("name"), code: formData.get("code") || undefined, city: formData.get("city") || undefined,
  });
  await prisma.site.create({ data: { ...data, organizationId: user.organizationId! } });
  revalidatePath("/dashboard/admin/sites");
  redirect("/dashboard/admin/sites");
}

export async function createDepartment(formData: FormData) {
  const user = await requirePermission("departments.manage");
  const data = z.object({ name: z.string().min(2), code: z.string().optional(), siteId: z.string().optional() }).parse({
    name: formData.get("name"), code: formData.get("code") || undefined, siteId: formData.get("siteId") || undefined,
  });
  await prisma.department.create({ data: { name: data.name, code: data.code ?? null, siteId: data.siteId || null, organizationId: user.organizationId! } });
  revalidatePath("/dashboard/admin/sites");
  redirect("/dashboard/admin/sites");
}

export async function deleteSite(formData: FormData) {
  const user = await requirePermission("sites.manage");
  const id = String(formData.get("id"));
  const count = await prisma.resource.count({ where: { siteId: id } });
  if (count === 0) await prisma.site.delete({ where: { id } });
  revalidatePath("/dashboard/admin/sites");
  redirect("/dashboard/admin/sites");
}

/* ----------------------------- Utilisateurs ----------------------------- */
export async function createUser(formData: FormData) {
  const user = await requirePermission("users.manage");
  const data = z
    .object({
      email: z.string().email(), firstName: z.string().min(1), lastName: z.string().min(1),
      functionTitle: z.string().optional(), roleKey: z.string().min(1), departmentId: z.string().optional(),
      matricule: z.string().optional(),
    })
    .parse({
      email: formData.get("email"), firstName: formData.get("firstName"), lastName: formData.get("lastName"),
      functionTitle: formData.get("functionTitle") || undefined, roleKey: formData.get("roleKey"), departmentId: formData.get("departmentId") || undefined,
      matricule: formData.get("matricule") || undefined,
    });

  // Accès Super Administrateur réservé à l'Admin système (compte d'amorçage / script).
  // Jamais attribuable via ce formulaire, quel que soit l'auteur de la requête.
  if (data.roleKey === "SUPER_ADMIN") redirect("/dashboard/admin/users?error=role");

  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) redirect("/dashboard/admin/users?error=exists");

  // Matricule étudiant ENS (optionnel) : validé au format réel s'il est renseigné.
  let matricule: string | null = null;
  if (data.matricule && data.matricule.trim()) {
    const m = data.matricule.trim().toUpperCase();
    if (!isEnsMatricule(m)) redirect("/dashboard/admin/users?error=matricule");
    matricule = m;
  }

  const role = await prisma.role.findFirst({ where: { key: data.roleKey, OR: [{ organizationId: user.organizationId }, { organizationId: null }] } });

  // Mot de passe par défaut (démo) : password123
  const passwordHash = await hashPassword("password123");

  const created = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      firstName: formatGivenName(data.firstName),
      lastName: formatFamilyName(data.lastName),
      functionTitle: data.functionTitle ?? null,
      matricule,
      organizationId: user.organizationId,
      departmentId: data.departmentId || null,
      status: "ACTIVE",
      passwordHash,
      roles: role ? { create: { roleId: role.id } } : undefined,
    },
  });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "user.create", entityType: "User", entityId: created.id });
  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users?created=1");
}

export async function toggleUserStatus(formData: FormData) {
  await requirePermission("users.manage");
  const id = String(formData.get("id"));
  const u = await prisma.user.findUnique({ where: { id } });
  if (u) {
    await prisma.user.update({ where: { id }, data: { status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" } });
  }
  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users");
}

/** Réinitialise le mot de passe d'un utilisateur au mot de passe par défaut (password123). */
export async function resetUserPassword(formData: FormData) {
  const me = await requirePermission("users.manage");
  const id = String(formData.get("id"));
  const u = await prisma.user.findUnique({ where: { id } });
  // Périmètre : même organisation, et pas son propre compte (qui passe par « Mon compte »).
  if (u && u.organizationId === me.organizationId && u.id !== me.id) {
    await prisma.user.update({ where: { id }, data: { passwordHash: await hashPassword("password123") } });
    revalidatePath("/dashboard/admin/users");
    redirect(`/dashboard/admin/users?reset=${encodeURIComponent(u.email)}`);
  }
  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users");
}

/* ----------------------------- Import de comptes par CSV (cohorte) ----------------------------- */
export interface ImportState {
  error?: string;
  ok?: boolean;
  created?: number;
  skipped?: number;
  errors?: string[];
}

export async function importUsersCsv(_prev: ImportState, formData: FormData): Promise<ImportState> {
  const user = await requirePermission("users.manage");
  const organizationId = user.organizationId!;
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Veuillez sélectionner un fichier CSV." };

  let rows: string[][];
  try {
    rows = parseCsv(await file.text());
  } catch {
    return { error: "Fichier illisible. Vérifiez qu'il s'agit bien d'un CSV." };
  }
  if (rows.length < 2) return { error: "Le fichier ne contient aucune ligne de données (en-tête + lignes attendus)." };

  const header = rows[0];
  const col = {
    prenom: findColumn(header, ["prenom", "prénom", "firstname", "first name"]),
    nom: findColumn(header, ["nom", "lastname", "last name"]),
    email: findColumn(header, ["email", "e-mail", "mail", "courriel"]),
    fonction: findColumn(header, ["fonction", "function", "titre", "poste"]),
    role: findColumn(header, ["role", "rôle", "profil"]),
    matricule: findColumn(header, ["matricule", "matricule etudiant", "matricule étudiant", "numero etudiant", "student id"]),
  };
  if (col.email < 0) return { error: "Colonne « email » introuvable dans l'en-tête du fichier." };

  const roles = await prisma.role.findMany({ where: { organizationId } });
  const roleByKey = new Map(roles.map((r) => [r.key, r.id]));
  const roleByName = new Map(roles.map((r) => [normalizeKey(r.name), r.id]));
  const requesterId = roleByKey.get("REQUESTER");
  const passwordHash = await hashPassword("password123");

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const get = (idx: number) => (idx >= 0 ? (cells[idx] ?? "").trim() : "");
    const email = get(col.email).toLowerCase();
    const prenom = get(col.prenom);
    const nom = get(col.nom);
    const line = i + 1;

    if (!email) { skipped++; errors.push(`Ligne ${line} : e-mail manquant.`); continue; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { skipped++; errors.push(`Ligne ${line} : e-mail invalide (${email}).`); continue; }
    if (!prenom || !nom) { skipped++; errors.push(`Ligne ${line} : prénom ou nom manquant (${email}).`); continue; }
    if (seen.has(email)) { skipped++; errors.push(`Ligne ${line} : doublon dans le fichier (${email}).`); continue; }
    seen.add(email);

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) { skipped++; errors.push(`Ligne ${line} : un compte existe déjà (${email}).`); continue; }

    // Résolution du rôle : clé (ex. RESOURCE_MANAGER), libellé, sinon Demandeur. SUPER_ADMIN interdit.
    const roleRaw = get(col.role);
    let roleId = requesterId;
    if (roleRaw) {
      const asKey = roleRaw.toUpperCase().replace(/[^A-Z_]/g, "");
      const resolved = (asKey !== "SUPER_ADMIN" && roleByKey.get(asKey)) || roleByName.get(normalizeKey(roleRaw));
      if (resolved) roleId = resolved;
    }

    const matricule = get(col.matricule).toUpperCase() || null;
    await prisma.user.create({
      data: {
        email, passwordHash, firstName: formatGivenName(prenom), lastName: formatFamilyName(nom),
        functionTitle: get(col.fonction) || null,
        matricule,
        organizationId, status: "ACTIVE",
        roles: roleId ? { create: { roleId } } : undefined,
      },
    });
    created++;
  }

  await audit({ organizationId, userId: user.id, action: "users.import", entityType: "User", newValue: { created, skipped } });
  revalidatePath("/dashboard/admin/users");
  return { ok: true, created, skipped, errors: errors.slice(0, 25) };
}

/* ----------------------------- Validation des demandes de compte ----------------------------- */
export async function approveAccount(formData: FormData) {
  const admin = await requirePermission("users.manage");
  const id = String(formData.get("id"));
  const u = await prisma.user.findFirst({ where: { id, organizationId: admin.organizationId } });
  if (u && u.status === "PENDING") {
    await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
    await sendNotification({
      userId: u.id, to: u.email, type: "ACCOUNT_APPROVED",
      subject: "Votre compte EduWeb Booking a été validé",
      text: "Votre compte a été validé. Vous pouvez désormais vous connecter.",
      html: renderEmail({ title: "Compte validé ✅", intro: "Bonne nouvelle, votre compte a été validé par votre administrateur.", cta: { label: "Se connecter", href: `${APP_URL}/login` } }),
    });
    await audit({ organizationId: admin.organizationId, userId: admin.id, action: "account.approve", entityType: "User", entityId: id });
  }
  revalidatePath("/dashboard/admin/account-requests");
  redirect("/dashboard/admin/account-requests?approved=1");
}

export async function rejectAccount(formData: FormData) {
  const admin = await requirePermission("users.manage");
  const id = String(formData.get("id"));
  const u = await prisma.user.findUnique({ where: { id } });
  const isSuper = admin.permissions.has("platform.manage");
  // Périmètre : compte de l'organisation de l'admin, OU compte sans organisation (file du super admin).
  if (u && u.status === "PENDING" && (u.organizationId === admin.organizationId || (u.organizationId === null && isSuper))) {
    await sendNotification({
      to: u.email, type: "ACCOUNT_REJECTED",
      subject: "Votre demande de compte n'a pas été retenue",
      text: "Votre demande de compte n'a pas été validée. Contactez votre institution pour plus d'informations.",
      html: renderEmail({ title: "Demande de compte refusée", intro: "Votre demande de compte n'a pas été retenue. Rapprochez-vous de votre institution si nécessaire." }),
    });
    await prisma.userRole.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
    await audit({ organizationId: admin.organizationId, userId: admin.id, action: "account.reject", entityType: "User", entityId: id });
  }
  revalidatePath("/dashboard/admin/account-requests");
  redirect("/dashboard/admin/account-requests?rejected=1");
}

/** Affecte un compte en attente (sans établissement) à un établissement + rôle, puis l'active. Réservé au super admin. */
export async function assignAndApproveAccount(formData: FormData) {
  const me = await requirePermission("platform.manage");
  const id = String(formData.get("id"));
  const organizationId = String(formData.get("organizationId") || "");
  const roleKey = String(formData.get("roleKey") || "REQUESTER");
  // L'accès Super Administrateur n'est jamais attribuable ici (réservé à l'Admin système).
  if (roleKey === "SUPER_ADMIN") redirect("/dashboard/admin/account-requests?error=role");

  const u = await prisma.user.findUnique({ where: { id } });
  if (!u || u.status !== "PENDING") redirect("/dashboard/admin/account-requests?error=notfound");

  const org = await prisma.organization.findFirst({
    where: { id: organizationId, isPlatform: false, status: "ACTIVE" },
    select: { id: true, name: true },
  });
  if (!org) redirect("/dashboard/admin/account-requests?error=org");

  const role = await prisma.role.findFirst({ where: { organizationId: org.id, key: roleKey } });
  await prisma.user.update({
    where: { id },
    data: {
      organizationId: org.id,
      status: "ACTIVE",
      roles: role ? { create: { roleId: role.id } } : undefined,
    },
  });
  await sendNotification({
    userId: u.id, to: u.email, type: "ACCOUNT_APPROVED",
    subject: "Votre compte EduWeb Booking a été validé",
    text: `Votre compte a été validé et rattaché à ${org.name}. Vous pouvez vous connecter.`,
    html: renderEmail({ title: "Compte validé ✅", intro: `Votre compte a été validé et rattaché à « ${org.name} ». Vous pouvez désormais vous connecter.`, cta: { label: "Se connecter", href: `${APP_URL}/login` } }),
  });
  await audit({ organizationId: org.id, userId: me.id, action: "account.assign_approve", entityType: "User", entityId: id, newValue: { organizationId: org.id, roleKey } });
  revalidatePath("/dashboard/admin/account-requests");
  redirect("/dashboard/admin/account-requests?approved=1");
}

/* ----------------------------- Paramètres ----------------------------- */
export async function updateSettings(formData: FormData) {
  const user = await requirePermission("settings.manage");
  const language = String(formData.get("language") || "fr");
  const timezone = String(formData.get("timezone") || "Africa/Abidjan");
  const allowAutoValidation = formData.get("allowAutoValidation") === "on";
  const openStart = String(formData.get("openStart") || "07:30");
  const openEnd = String(formData.get("openEnd") || "19:00");
  const workingDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].filter((d) => formData.get(`day_${d}`) === "on");

  await prisma.organizationSetting.upsert({
    where: { organizationId: user.organizationId! },
    update: { language, timezone, allowAutoValidation, openingHours: stringifyJson({ start: openStart, end: openEnd }), workingDays: stringifyJson(workingDays) },
    create: { organizationId: user.organizationId!, language, timezone, allowAutoValidation, openingHours: stringifyJson({ start: openStart, end: openEnd }), workingDays: stringifyJson(workingDays) },
  });
  revalidatePath("/dashboard/admin/settings");
  redirect("/dashboard/admin/settings?saved=1");
}
