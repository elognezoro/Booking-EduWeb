"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { getManagedScope, getGrantableRoleKeys, NON_DELEGABLE_ROLES } from "@/lib/habilitations";
import { ROLE_META, type RoleKey } from "@/lib/enums";

const PAGE = "/dashboard/habilitations";

/** Échappe une valeur interpolée dans le HTML d'un e-mail (noms saisis librement). */
function esc(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Charge le membre visé et vérifie le périmètre du responsable :
 * même établissement, service dans le sous-arbre d'une entité dirigée,
 * jamais soi-même ni un compte protégé (Super admin / Admin d'établissement).
 */
async function requireManagedMember(formData: FormData) {
  const user = await requireUser();
  const scope = await getManagedScope(user);
  if (scope.entities.length === 0) redirect("/dashboard?denied=1");

  const targetId = String(formData.get("userId") || "");
  const roleKey = String(formData.get("roleKey") || "") as RoleKey;
  if (!targetId || !roleKey) redirect(`${PAGE}?error=invalide`);
  if (targetId === user.id) redirect(`${PAGE}?error=soi`);

  const target = await prisma.user.findFirst({
    where: { id: targetId, organizationId: user.organizationId!, departmentId: { in: [...scope.allIds] } },
    include: { roles: { include: { role: true } } },
  });
  if (!target) redirect(`${PAGE}?error=perimetre`);

  const targetKeys = target.roles.map((r) => r.role.key as RoleKey);
  if (targetKeys.some((k) => NON_DELEGABLE_ROLES.includes(k))) redirect(`${PAGE}?error=protege`);

  // Pas d'élévation : le responsable ne manipule que des rôles dont il détient tous les droits.
  const grantable = await getGrantableRoleKeys(user);
  if (!grantable.includes(roleKey)) redirect(`${PAGE}?error=role`);

  // Rôle de l'établissement en priorité, repli sur un éventuel rôle global.
  const roleRows = await prisma.role.findMany({
    where: { key: roleKey, OR: [{ organizationId: user.organizationId! }, { organizationId: null }] },
  });
  const role = roleRows.find((r) => r.organizationId) ?? roleRows[0];
  if (!role) redirect(`${PAGE}?error=role`);

  // Entité DIRIGÉE couvrant le membre (pour les libellés « responsable de … »)
  // + service propre du membre (affichage).
  const entite =
    scope.entities.find((e) => target.departmentId && e.subtreeIds.includes(target.departmentId))?.name ?? "—";
  const service = (target.departmentId && scope.nameById.get(target.departmentId)) || "—";
  return { user, target, role, roleKey, entite, service };
}

/* ----------------------------- Attribuer une habilitation ----------------------------- */
export async function grantHabilitation(formData: FormData) {
  const { user, target, role, roleKey, entite, service } = await requireManagedMember(formData);

  // Transaction : verrou sur les rôles du membre puis re-vérification (anti-course).
  const outcome = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "roleId" FROM "UserRole" WHERE "userId" = ${target.id} FOR UPDATE`;
    const rows = await tx.userRole.findMany({ where: { userId: target.id }, include: { role: true } });
    const keys = rows.map((r) => r.role.key as RoleKey);
    if (keys.some((k) => NON_DELEGABLE_ROLES.includes(k))) return "protege" as const;
    if (rows.some((r) => r.roleId === role.id) || keys.includes(roleKey)) return "deja" as const;
    await tx.userRole.create({ data: { userId: target.id, roleId: role.id } });
    return "ok" as const;
  });
  if (outcome === "protege") redirect(`${PAGE}?error=protege`);
  if (outcome === "deja") redirect(`${PAGE}?rien=1`);

  const label = ROLE_META[roleKey].label;
  const memberName = `${target.firstName} ${target.lastName}`.trim();
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "HABILITATION_GRANT",
    entityType: "User",
    entityId: target.id,
    newValue: { role: label, roleKey, membre: memberName, entite, service, responsable: user.fullName },
  });
  await sendNotification({
    userId: target.id,
    to: target.email,
    subject: `Nouvelle habilitation : ${label}`,
    html: renderEmail({
      title: "Nouvelle habilitation ✅",
      intro: `${esc(user.fullName)}, responsable de « ${esc(entite)} », vient de vous attribuer le rôle « ${label} » sur EduWeb Booking. Les menus et actions correspondants sont disponibles dès votre prochaine navigation.`,
      rows: [["Rôle attribué", label], ["Entité", esc(entite)], ["Votre service", esc(service)], ["Attribué par", esc(user.fullName)]],
      cta: { label: "Ouvrir mon tableau de bord", href: `${APP_URL}/dashboard` },
    }),
    text: `Le rôle « ${label} » vous a été attribué par ${user.fullName} (${entite}).`,
    type: "INFO",
  });

  revalidatePath(PAGE);
  redirect(`${PAGE}?granted=1`);
}

/* ----------------------------- Retirer une habilitation ----------------------------- */
export async function revokeHabilitation(formData: FormData) {
  const { user, target, role, roleKey, entite, service } = await requireManagedMember(formData);

  // Transaction : verrou sur les rôles du membre puis re-vérification (anti-course :
  // deux retraits simultanés ne peuvent pas laisser le membre sans aucun rôle).
  const outcome = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "roleId" FROM "UserRole" WHERE "userId" = ${target.id} FOR UPDATE`;
    const rows = await tx.userRole.findMany({ where: { userId: target.id }, include: { role: true } });
    const keys = rows.map((r) => r.role.key as RoleKey);
    if (keys.some((k) => NON_DELEGABLE_ROLES.includes(k))) return "protege" as const;
    if (!rows.some((r) => r.roleId === role.id)) return "absent" as const;
    if (rows.length <= 1) return "dernier" as const;
    const res = await tx.userRole.deleteMany({ where: { userId: target.id, roleId: role.id } });
    return res.count === 1 ? ("ok" as const) : ("absent" as const);
  });
  if (outcome === "protege") redirect(`${PAGE}?error=protege`);
  if (outcome === "dernier") redirect(`${PAGE}?error=dernier`);
  if (outcome === "absent") redirect(`${PAGE}?rien=1`);

  const label = ROLE_META[roleKey].label;
  const memberName = `${target.firstName} ${target.lastName}`.trim();
  await audit({
    organizationId: user.organizationId,
    userId: user.id,
    action: "HABILITATION_REVOKE",
    entityType: "User",
    entityId: target.id,
    oldValue: { role: label, roleKey, membre: memberName, entite, service, responsable: user.fullName },
  });
  await sendNotification({
    userId: target.id,
    to: target.email,
    subject: `Habilitation retirée : ${label}`,
    html: renderEmail({
      title: "Habilitation retirée",
      intro: `${esc(user.fullName)}, responsable de « ${esc(entite)} », a retiré votre rôle « ${label} » sur EduWeb Booking. Vos autres rôles restent inchangés.`,
      rows: [["Rôle retiré", label], ["Entité", esc(entite)], ["Votre service", esc(service)], ["Retiré par", esc(user.fullName)]],
      cta: { label: "Ouvrir mon tableau de bord", href: `${APP_URL}/dashboard` },
    }),
    text: `Le rôle « ${label} » vous a été retiré par ${user.fullName} (${entite}).`,
    type: "INFO",
  });

  revalidatePath(PAGE);
  redirect(`${PAGE}?revoked=1`);
}
