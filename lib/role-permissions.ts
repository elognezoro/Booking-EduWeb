import "server-only";
import { prisma } from "./prisma";
import { ROLES, type RoleKey } from "./enums";
import { PERMISSIONS, ROLE_PERMISSIONS, type Permission } from "./permissions";

const ALL: Permission[] = [...PERMISSIONS];
const VALID = new Set<string>(PERMISSIONS);

function parsePerms(json: string): Permission[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? (arr.filter((p) => VALID.has(p)) as Permission[]) : [];
  } catch {
    return [];
  }
}

/**
 * Droits effectifs par rôle : personnalisation enregistrée (RolePermissionSet) si présente,
 * sinon valeurs par défaut. SUPER_ADMIN a toujours tous les droits (non modifiable).
 */
export async function getEffectiveRolePermissions(): Promise<Record<RoleKey, Permission[]>> {
  const rows = await prisma.rolePermissionSet.findMany();
  const overrides = new Map(rows.map((r) => [r.roleKey, parsePerms(r.permissions)]));
  const out = {} as Record<RoleKey, Permission[]>;
  for (const role of ROLES) {
    if (role === "SUPER_ADMIN") { out[role] = ALL; continue; }
    const ov = overrides.get(role);
    out[role] = ov ? ov.filter((p) => p !== "platform.manage") : (ROLE_PERMISSIONS[role] ?? []);
  }
  return out;
}

/** Ensemble de permissions d'un utilisateur d'après ses rôles (avec personnalisations). */
export async function resolveUserPermissions(roleKeys: string[]): Promise<Set<Permission>> {
  if (roleKeys.includes("SUPER_ADMIN")) return new Set(ALL);
  const eff = await getEffectiveRolePermissions();
  const set = new Set<Permission>();
  for (const key of roleKeys) {
    const perms = eff[key as RoleKey];
    if (perms) perms.forEach((p) => set.add(p));
  }
  return set;
}
