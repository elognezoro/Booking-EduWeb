import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "./prisma";
import { SESSION_COOKIE, signSession, verifySession, type SessionPayload } from "./jwt";
import { type Permission } from "./permissions";
import { resolveUserPermissions } from "./role-permissions";
import type { RoleKey } from "./enums";

// Cookie de l'institution active sélectionnée par le super administrateur.
export const ACTIVE_ORG_COOKIE = "eduweb_active_org";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string | null | undefined) {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function createUserSession(payload: SessionPayload) {
  const token = await signSession(payload);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyUserSession() {
  cookies().delete(SESSION_COOKIE);
}

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string | null;
  functionTitle: string | null;
  organizationId: string | null;
  organizationName: string | null;
  departmentName: string | null;
  roles: RoleKey[];
  permissions: Set<Permission>;
}

// Mis en cache par requête pour éviter de multiplier les requêtes DB.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const payload = await verifySession(token);
  if (!payload?.sub) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: {
      roles: { include: { role: true } },
      organization: true,
      department: true,
    },
  });

  if (!user || user.status === "SUSPENDED" || user.status === "INACTIVE") return null;

  const roles = user.roles.map((r) => r.role.key) as RoleKey[];

  // Établissement suspendu par le super admin → accès coupé (sauf super admin, qui est global).
  if (user.organization?.status === "SUSPENDED" && !roles.includes("SUPER_ADMIN")) return null;

  let organizationId = user.organizationId;
  let organizationName = user.organization?.name ?? null;
  let departmentName = user.department?.name ?? null;

  // Super administrateur : sélecteur d'institution. Si une « organisation active » valide
  // est choisie (cookie), tout le périmètre de données bascule sur cette institution.
  if (roles.includes("SUPER_ADMIN")) {
    const activeOrgId = cookies().get(ACTIVE_ORG_COOKIE)?.value;
    if (activeOrgId && activeOrgId !== user.organizationId) {
      const org = await prisma.organization.findUnique({ where: { id: activeOrgId }, select: { id: true, name: true } });
      if (org) {
        organizationId = org.id;
        organizationName = org.name;
        departmentName = null;
      }
    }
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    imageUrl: user.imageUrl,
    functionTitle: user.functionTitle,
    organizationId,
    organizationName,
    departmentName,
    roles,
    permissions: await resolveUserPermissions(roles, organizationId),
  };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  // Jeton absent OU valide mais sans utilisateur correspondant (compte supprimé / base réinitialisée) :
  // on passe par /api/auth/clear qui efface le cookie puis renvoie vers /login (pas de boucle).
  if (!user) redirect("/api/auth/clear");
  return user;
}

export async function requirePermission(permission: Permission): Promise<CurrentUser> {
  const user = await requireUser();
  if (!user.permissions.has(permission)) redirect("/dashboard?denied=1");
  return user;
}

export function hasPermission(user: CurrentUser | null, permission: Permission) {
  return !!user?.permissions.has(permission);
}

export function isSuperAdmin(user: CurrentUser | null) {
  return !!user?.roles.includes("SUPER_ADMIN");
}
