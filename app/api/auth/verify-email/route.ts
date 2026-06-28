import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { SESSION_COOKIE, signSession } from "@/lib/jwt";

export const dynamic = "force-dynamic";

/**
 * Confirmation d'adresse e-mail (auto-inscription) : valide le jeton, active le compte,
 * connecte automatiquement l'utilisateur et le redirige vers son tableau de bord.
 * Lien à usage unique (le jeton est consommé) et expirant (48 h).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const fail = (reason: "invalid" | "expired") => NextResponse.redirect(new URL(`/login?verify=${reason}`, req.url));
  if (!token) return fail("invalid");

  const user = await prisma.user.findUnique({
    where: { emailVerifyToken: token },
    include: { roles: { include: { role: true } } },
  });
  if (!user) return fail("invalid");
  if (user.emailVerifyExpires && user.emailVerifyExpires.getTime() < Date.now()) return fail("expired");

  // Active le compte et consomme le jeton (usage unique).
  await prisma.user.update({
    where: { id: user.id },
    data: { status: "ACTIVE", emailVerifyToken: null, emailVerifyExpires: null, lastLoginAt: new Date() },
  });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "account.email_verified", entityType: "User", entityId: user.id });

  // Compte confirmé sans établissement : prévenir les super administrateurs pour l'affectation.
  if (!user.organizationId) {
    const supers = await prisma.user.findMany({
      where: { status: "ACTIVE", roles: { some: { role: { key: "SUPER_ADMIN" } } } },
      select: { id: true, email: true },
    });
    for (const a of supers) {
      await sendNotification({
        userId: a.id, to: a.email, type: "ACCOUNT_TO_ASSIGN",
        subject: `Compte confirmé à affecter — ${user.firstName} ${user.lastName}`,
        text: `${user.firstName} ${user.lastName} (${user.email}) a confirmé son adresse e-mail ; à affecter à un établissement.`,
        html: renderEmail({
          title: "Compte confirmé",
          intro: `${user.firstName} ${user.lastName} a confirmé son adresse e-mail. Affectez-le à un établissement et à un rôle.`,
          rows: [["Nom", `${user.firstName} ${user.lastName}`], ["E-mail", user.email]],
          cta: { label: "Affecter le compte", href: `${APP_URL}/dashboard/admin/account-requests` },
        }),
      });
    }
  }

  // Connexion automatique : on pose le cookie de session sur la réponse de redirection.
  const sessionToken = await signSession({
    sub: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim(),
    roles: user.roles.map((r) => r.role.key),
    organizationId: user.organizationId,
  });
  const res = NextResponse.redirect(new URL("/dashboard?welcome=1", req.url));
  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
