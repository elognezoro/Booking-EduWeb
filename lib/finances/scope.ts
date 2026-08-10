import "server-only";
import { prisma } from "@/lib/prisma";
import { hasPermission, type CurrentUser } from "@/lib/auth";

/**
 * Espace financier = périmètre de gestion ISOLÉ :
 * - l'espace « institution » (departmentId = null) ;
 * - ou l'espace d'une sous-direction / d'un service (departmentId).
 * Une écriture appartient à UN SEUL espace ; aucun espace ne voit les données d'un autre.
 *
 * Accès (v1) :
 * - super admin / platform.manage / organization.manage → tous les espaces de l'institution ;
 * - sinon (finances.read|manage) → l'espace de sa sous-direction + ceux de ses services descendants ;
 * - sans affectation ni droit → aucun espace.
 */
export interface FinanceSpace {
  key: string; // "org" | departmentId — identifiant d'URL (?espace=)
  departmentId: string | null;
  label: string;
  depth: number; // 0 = institution, sinon profondeur du service (indentation du sélecteur)
}

export interface FinanceScope {
  space: FinanceSpace;
  spaces: FinanceSpace[]; // tous les espaces accessibles (sélecteur)
  organizationId: string;
  /** Filtre Prisma STRICT de l'espace courant — à inclure dans CHAQUE lecture/écriture. */
  filter: { organizationId: string; departmentId: string | null };
  canManage: boolean;
}

interface DeptRow {
  id: string;
  name: string;
  parentId: string | null;
}

/** Profondeur + tri hiérarchique (parents avant enfants) des services d'une institution. */
function orderDepartments(rows: DeptRow[]): { row: DeptRow; depth: number }[] {
  const byParent = new Map<string | null, DeptRow[]>();
  for (const r of rows) {
    const list = byParent.get(r.parentId) ?? [];
    list.push(r);
    byParent.set(r.parentId, list);
  }
  const out: { row: DeptRow; depth: number }[] = [];
  const walk = (parentId: string | null, depth: number) => {
    for (const r of (byParent.get(parentId) ?? []).sort((a, b) => a.name.localeCompare(b.name, "fr"))) {
      out.push({ row: r, depth });
      walk(r.id, depth + 1);
    }
  };
  walk(null, 1);
  // Sécurité : services dont le parent n'est pas dans la liste (données incohérentes) → à plat.
  const seen = new Set(out.map((o) => o.row.id));
  for (const r of rows) if (!seen.has(r.id)) out.push({ row: r, depth: 1 });
  return out;
}

/** Ids du sous-arbre d'un service (lui-même + tous ses descendants). */
function subtreeIds(rows: DeptRow[], rootId: string): Set<string> {
  const byParent = new Map<string | null, string[]>();
  for (const r of rows) {
    const list = byParent.get(r.parentId) ?? [];
    list.push(r.id);
    byParent.set(r.parentId, list);
  }
  const out = new Set<string>([rootId]);
  const stack = [rootId];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const child of byParent.get(cur) ?? []) {
      if (!out.has(child)) {
        out.add(child);
        stack.push(child);
      }
    }
  }
  return out;
}

/** Liste les espaces financiers accessibles à l'utilisateur (dans son institution). */
export async function listFinanceSpaces(user: CurrentUser): Promise<FinanceSpace[]> {
  if (!user.organizationId) return [];
  if (!hasPermission(user, "finances.read") && !hasPermission(user, "finances.manage")) return [];

  const rows: DeptRow[] = await prisma.department.findMany({
    where: { organizationId: user.organizationId },
    select: { id: true, name: true, parentId: true },
  });
  const ordered = orderDepartments(rows);

  const orgWide =
    hasPermission(user, "platform.manage") ||
    hasPermission(user, "organization.manage");

  if (orgWide) {
    return [
      { key: "org", departmentId: null, label: "Institution (espace global)", depth: 0 },
      ...ordered.map(({ row, depth }) => ({ key: row.id, departmentId: row.id, label: row.name, depth })),
    ];
  }

  // Gestionnaire de sous-direction : son service + ses descendants.
  if (!user.departmentId) return [];
  const allowed = subtreeIds(rows, user.departmentId);
  return ordered
    .filter(({ row }) => allowed.has(row.id))
    .map(({ row, depth }) => ({ key: row.id, departmentId: row.id, label: row.name, depth }));
}

/**
 * Résout l'espace courant depuis le paramètre d'URL `?espace=` et VÉRIFIE le droit d'accès.
 * Renvoie null si l'utilisateur n'a accès à aucun espace.
 */
export async function resolveFinanceScope(user: CurrentUser, espaceParam?: string): Promise<FinanceScope | null> {
  const spaces = await listFinanceSpaces(user);
  if (spaces.length === 0 || !user.organizationId) return null;
  const space = spaces.find((s) => s.key === (espaceParam || spaces[0].key)) ?? spaces[0];
  return {
    space,
    spaces,
    organizationId: user.organizationId,
    filter: { organizationId: user.organizationId, departmentId: space.departmentId },
    canManage: hasPermission(user, "finances.manage"),
  };
}
