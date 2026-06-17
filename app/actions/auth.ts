"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createUserSession, destroyUserSession, hashPassword, requireUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { formatGivenName, formatFamilyName, isEnsMatricule, ENS_MATRICULE_EXAMPLE } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
  callbackUrl: z.string().optional(),
  org: z.string().optional(),
});

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    callbackUrl: formData.get("callbackUrl") || undefined,
    org: formData.get("org") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Données invalides." };
  }

  const { email, password, callbackUrl, org } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { roles: { include: { role: true } }, organization: true },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-mail ou mot de passe incorrect." };
  }
  if (user.status === "PENDING") {
    return { error: "Votre compte est en attente de validation par un administrateur de votre institution." };
  }
  if (user.status === "SUSPENDED" || user.status === "INACTIVE") {
    return { error: "Ce compte est désactivé. Contactez votre administrateur." };
  }

  // Connexion ciblée sur un espace institution : le compte doit appartenir à cette institution
  // (le super administrateur EduWeb fait exception).
  const isSuperAdmin = user.roles.some((r) => r.role.key === "SUPER_ADMIN");
  if (org && !isSuperAdmin) {
    const institution = await prisma.organization.findUnique({ where: { slug: org }, select: { id: true, name: true } });
    if (institution && user.organizationId !== institution.id) {
      return { error: `Ce compte n'appartient pas à l'institution « ${institution.name} ».` };
    }
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "auth.login", entityType: "User", entityId: user.id });

  await createUserSession({
    sub: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    roles: user.roles.map((r) => r.role.key),
    organizationId: user.organizationId,
  });

  const dest = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
  redirect(dest);
}

export async function logoutAction() {
  await destroyUserSession();
  redirect("/login");
}

/* ----------------------------- Changer son propre mot de passe (self-service) ----------------------------- */
const ACCOUNT_PATH = "/dashboard/account";
const changePasswordSchema = z.object({
  current: z.string().min(1, "Le mot de passe actuel est requis."),
  password: z.string().min(8, "Le nouveau mot de passe doit comporter au moins 8 caractères."),
  confirm: z.string().min(1, "Confirmez le nouveau mot de passe."),
});

export async function changeOwnPassword(formData: FormData) {
  const me = await requireUser();
  const parsed = changePasswordSchema.safeParse({
    current: formData.get("current"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) redirect(`${ACCOUNT_PATH}?error=${encodeURIComponent(parsed.error.errors[0]?.message ?? "Données invalides.")}`);
  const d = parsed.data;
  if (d.password !== d.confirm) redirect(`${ACCOUNT_PATH}?error=${encodeURIComponent("Les deux mots de passe ne correspondent pas.")}`);

  const user = await prisma.user.findUnique({ where: { id: me.id } });
  if (!user || !(await verifyPassword(d.current, user.passwordHash))) {
    redirect(`${ACCOUNT_PATH}?error=${encodeURIComponent("Mot de passe actuel incorrect.")}`);
  }
  await prisma.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(d.password) } });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "auth.password_change", entityType: "User", entityId: user.id });
  redirect(`${ACCOUNT_PATH}?changed=1`);
}

/* ----------------------------- Auto-inscription (avec validation) ----------------------------- */
const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName: z.string().min(1, "Le nom est requis."),
  email: z.string().email("Adresse e-mail invalide."),
  functionTitle: z.string().optional(),
  org: z.string().min(1, "Sélectionnez votre institution."),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
  confirm: z.string().min(1, "Confirmez le mot de passe."),
  accept: z.union([z.literal("on"), z.string()]).optional(),
  isStudent: z.string().optional(),
  matricule: z.string().optional(),
});

export interface RegisterState {
  error?: string;
  success?: boolean;
}

export async function registerAccount(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    functionTitle: formData.get("functionTitle") || undefined,
    org: formData.get("org"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    accept: formData.get("accept") || undefined,
    isStudent: formData.get("isStudent") || undefined,
    matricule: formData.get("matricule") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides." };
  const d = parsed.data;

  if (d.password !== d.confirm) return { error: "Les deux mots de passe ne correspondent pas." };
  if (d.accept !== "on") return { error: "Vous devez accepter que votre compte soit soumis à validation." };

  const org = await prisma.organization.findFirst({ where: { slug: d.org, isPlatform: false, status: "ACTIVE" } });
  if (!org) return { error: "Institution introuvable." };

  // Étudiant de l'ENS d'Abidjan : matricule conservé comme paramètre de vérification.
  let matricule: string | null = null;
  if (org.slug === "ens-abidjan" && d.isStudent === "on") {
    const m = (d.matricule ?? "").trim().toUpperCase();
    if (!isEnsMatricule(m)) return { error: `Matricule étudiant invalide (format attendu : ${ENS_MATRICULE_EXAMPLE}).` };
    matricule = m;
  }

  const existing = await prisma.user.findUnique({ where: { email: d.email.toLowerCase().trim() } });
  if (existing) return { error: "Un compte existe déjà avec cette adresse e-mail." };

  const role = await prisma.role.findFirst({ where: { organizationId: org.id, key: "REQUESTER" } });
  const passwordHash = await hashPassword(d.password);

  const user = await prisma.user.create({
    data: {
      email: d.email.toLowerCase().trim(),
      passwordHash,
      firstName: formatGivenName(d.firstName),
      lastName: formatFamilyName(d.lastName),
      functionTitle: d.functionTitle?.trim() || null,
      matricule,
      organizationId: org.id,
      status: "PENDING",
      roles: role ? { create: { roleId: role.id } } : undefined,
    },
  });

  // Notifie les administrateurs de l'institution
  const admins = await prisma.user.findMany({
    where: { organizationId: org.id, status: "ACTIVE", roles: { some: { role: { key: "ORG_ADMIN" } } } },
    select: { id: true, email: true },
  });
  for (const a of admins) {
    await sendNotification({
      userId: a.id, to: a.email, type: "ACCOUNT_REQUEST",
      subject: `Nouvelle demande de compte — ${d.firstName} ${d.lastName}`,
      text: `${d.firstName} ${d.lastName} (${d.email}) demande un compte sur ${org.name}.`,
      html: renderEmail({
        title: "Nouvelle demande de compte",
        intro: `${d.firstName} ${d.lastName} souhaite rejoindre « ${org.name} ».`,
        rows: [["Nom", `${d.firstName} ${d.lastName}`], ["E-mail", d.email], ["Fonction", d.functionTitle || "—"]],
        cta: { label: "Examiner la demande", href: `${APP_URL}/dashboard/admin/account-requests` },
      }),
    });
  }
  await audit({ organizationId: org.id, userId: user.id, action: "account.request", entityType: "User", entityId: user.id });

  return { success: true };
}
