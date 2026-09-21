import "server-only";
import { prisma } from "./prisma";
import { getEffectiveRolePermissions } from "./role-permissions";
import { ROLES, type RoleKey } from "./enums";
import type { CurrentUser } from "./auth";

/**
 * Habilitations déléguées aux responsables d'entité : tout utilisateur désigné
 * responsable (Department.headId) d'une entité — sous-direction, service, filière… —
 * peut attribuer ou retirer des rôles aux membres de son périmètre (l'entité et
 * toute sa descendance), sans élévation de privilèges.
 */

/** Rôles jamais délégables par un responsable d'entité (réservés à l'admin / au super admin). */
export const NON_DELEGABLE_ROLES: RoleKey[] = ["SUPER_ADMIN", "ORG_ADMIN"];

export interface ManagedEntity {
  id: string;
  name: string;
  code: string | null;
  /** Entité dirigée + ids de toute sa descendance (elle-même incluse). */
  subtreeIds: string[];
}

export interface ManagedScope {
  /** Entités dont l'utilisateur est le responsable désigné. */
  entities: ManagedEntity[];
  /** Union des sous-arbres (ids de Department) couverts par le responsable. */
  allIds: Set<string>;
  /** Nom de chaque service du périmètre (affichage). */
  nameById: Map<string, string>;
}

/** Périmètre d'un responsable : ses entités (headId) et toute leur descendance. */
export async function getManagedScope(user: Pick<CurrentUser, "id" | "organizationId">): Promise<ManagedScope> {
  if (!user.organizationId) return { entities: [], allIds: new Set(), nameById: new Map() };
  const depts = await prisma.department.findMany({
    where: { organizationId: user.organizationId },
    select: { id: true, parentId: true, headId: true, name: true, code: true },
    orderBy: { id: "asc" },
  });
  const childrenOf = new Map<string, string[]>();
  for (const d of depts) {
    if (!d.parentId) continue;
    const list = childrenOf.get(d.parentId) ?? [];
    list.push(d.id);
    childrenOf.set(d.parentId, list);
  }
  const nameById = new Map(depts.map((d) => [d.id, d.name]));
  const entities: ManagedEntity[] = [];
  const allIds = new Set<string>();
  for (const d of depts) {
    if (d.headId !== user.id) continue;
    const subtree: string[] = [];
    const queue = [d.id];
    while (queue.length) {
      const id = queue.shift()!;
      if (subtree.includes(id)) continue;
      subtree.push(id);
      queue.push(...(childrenOf.get(id) ?? []));
    }
    subtree.forEach((id) => allIds.add(id));
    entities.push({ id: d.id, name: d.name, code: d.code, subtreeIds: subtree });
  }
  return { entities, allIds, nameById };
}

/**
 * Rôles qu'un responsable peut déléguer : jamais Super admin / Admin d'établissement,
 * et uniquement des rôles dont TOUTES les permissions effectives (overrides compris)
 * sont déjà détenues par le responsable — aucun membre ne peut recevoir un droit
 * que son responsable ne possède pas (pas d'élévation).
 */
export async function getGrantableRoleKeys(user: Pick<CurrentUser, "organizationId" | "permissions">): Promise<RoleKey[]> {
  const effective = await getEffectiveRolePermissions(user.organizationId);
  return ROLES.filter(
    (key) => !NON_DELEGABLE_ROLES.includes(key) && (effective[key] ?? []).every((p) => user.permissions.has(p))
  );
}
