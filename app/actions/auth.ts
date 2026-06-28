"use server";

import { z } from "zod";
import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createUserSession, destroyUserSession, hashPassword, requireUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { formatGivenName, formatFamilyName } from "@/lib/utils";

const VERIFY_TTL_MS = 48 * 60 * 60 * 1000; // 48 h
const RESEND_COOLDOWN_MS = 90 * 1000; // anti-spam : 1 envoi / 90 s max par adresse

/** Renvoi possible si aucun e-mail n'a été émis dans la fenêtre de cooldown. */
function canResend(emailVerifyExpires: Date | null): boolean {
  if (!emailVerifyExpires) return true;
  const issuedAt = emailVerifyExpires.getTime() - VERIFY_TTL_MS;
  return Date.now() - issuedAt >= RESEND_COOLDOWN_MS;
}

/** Construit et envoie l'e-mail de confirmation de compte (Resend). */
async function sendVerificationEmail(u: { id: string; email: string; firstName: string; token: string }) {
  const link = `${APP_URL}/api/auth/verify-email?token=${u.token}`;
  await sendNotification({
    userId: u.id,
    to: u.email,
    type: "ACCOUNT_VERIFY",
    subject: "Confirmez votre compte EduWeb Booking",
    text: `Bonjour ${u.firstName}, confirmez votre adresse e-mail pour activer votre compte EduWeb Booking : ${link} (lien valable 48 heures).`,
    html: renderEmail({
      title: "Confirmez votre adresse e-mail",
      intro: `Bonjour ${u.firstName}, bienvenue sur EduWeb Booking. Pour activer votre compte, confirmez votre adresse e-mail en cliquant sur le bouton ci-dessous. Ce lien est valable 48 heures.`,
      cta: { label: "Confirmer mon compte", href: link },
      footer: "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.",
    }),
  });
}

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
    return { error: "Votre compte n'est pas encore confirmé. Ouvrez le lien de confirmation reçu par e-mail (vérifiez vos indésirables)." };
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

/* ----------------------------- Auto-inscription (confirmation par e-mail) ----------------------------- */
const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName: z.string().min(1, "Le nom est requis."),
  email: z.string().email("Adresse e-mail invalide."),
  functionTitle: z.string().optional(),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères."),
  confirm: z.string().min(1, "Confirmez le mot de passe."),
  accept: z.union([z.literal("on"), z.string()]).optional(),
});

export interface RegisterState {
  error?: string;
  success?: boolean;
  email?: string;
}

export async function registerAccount(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    functionTitle: formData.get("functionTitle") || undefined,
    password: formData.get("password"),
    confirm: formData.get("confirm"),
    accept: formData.get("accept") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides." };
  const d = parsed.data;

  if (d.password !== d.confirm) return { error: "Les deux mots de passe ne correspondent pas." };
  if (d.accept !== "on") return { error: "Vous devez accepter les conditions d'utilisation pour créer un compte." };

  const email = d.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Compte non confirmé (sans établissement) : on renvoie un nouveau lien, avec cooldown anti-spam.
    if (existing.status === "PENDING" && !existing.organizationId) {
      if (canResend(existing.emailVerifyExpires)) {
        const token = randomBytes(32).toString("hex");
        await prisma.user.update({ where: { id: existing.id }, data: { emailVerifyToken: token, emailVerifyExpires: new Date(Date.now() + VERIFY_TTL_MS) } });
        await sendVerificationEmail({ id: existing.id, email, firstName: existing.firstName, token });
      }
      return { success: true, email };
    }
    return { error: "Un compte existe déjà avec cette adresse e-mail." };
  }

  // Compte créé en attente de CONFIRMATION D'E-MAIL (puis actif automatiquement à la confirmation).
  const token = randomBytes(32).toString("hex");
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(d.password),
      firstName: formatGivenName(d.firstName),
      lastName: formatFamilyName(d.lastName),
      functionTitle: d.functionTitle?.trim() || null,
      organizationId: null,
      status: "PENDING",
      emailVerifyToken: token,
      emailVerifyExpires: new Date(Date.now() + VERIFY_TTL_MS),
    },
  });

  await sendVerificationEmail({ id: user.id, email, firstName: user.firstName, token });
  await audit({ userId: user.id, action: "account.register", entityType: "User", entityId: user.id });

  return { success: true, email };
}

export interface ResendState {
  error?: string;
  sent?: boolean;
}

/** Renvoie l'e-mail de confirmation. Réponse uniforme (anti-énumération de comptes). */
export async function resendVerificationEmail(_prev: ResendState, formData: FormData): Promise<ResendState> {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  if (!email || !/.+@.+\..+/.test(email)) return { error: "Adresse e-mail invalide." };
  const user = await prisma.user.findUnique({ where: { email } });
  // Uniquement un compte non confirmé SANS établissement (ne pas contourner la validation manuelle
  // d'un compte rattaché à une institution), et seulement hors fenêtre de cooldown.
  if (user && user.status === "PENDING" && !user.organizationId && canResend(user.emailVerifyExpires)) {
    const token = randomBytes(32).toString("hex");
    await prisma.user.update({ where: { id: user.id }, data: { emailVerifyToken: token, emailVerifyExpires: new Date(Date.now() + VERIFY_TTL_MS) } });
    await sendVerificationEmail({ id: user.id, email: user.email, firstName: user.firstName, token });
  }
  return { sent: true };
}
