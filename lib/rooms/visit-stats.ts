import "server-only";
import { prisma } from "@/lib/prisma";
import type { CurrentUser } from "@/lib/auth";

/**
 * Statistiques d'exploitation des salles multimédias, calculées depuis le registre
 * de présence (RoomVisit). Le périmètre (`resourceIds`) permet de borner un
 * surveillant à ses seules salles ; sans borne, toute l'organisation.
 */

export interface SalleStat {
  resourceId: string;
  name: string;
  total: number;
  uniques: number;
  minutes: number; // temps de présence cumulé (visites clôturées)
  open: number; // actuellement en salle
}

export interface VisitStats {
  total: number;
  uniques: number;
  open: number;
  closed: number;
  totalMinutes: number;
  avgMinutes: number;
  byStatut: { statut: string; n: number }[];
  byFiliere: { filiere: string; n: number }[];
  byHour: number[]; // arrivées par heure (0-23, Africa/Abidjan = UTC)
  bySalle: SalleStat[];
}

const visitorKey = (v: { matricule: string | null; userId: string | null; lastName: string; firstName: string }) =>
  v.userId || v.matricule || `${v.lastName}|${v.firstName}`.toUpperCase();

const minutesBetween = (from: Date, to: Date) => Math.max(0, Math.round((to.getTime() - from.getTime()) / 60000));

export async function computeVisitStats(opts: {
  organizationId: string;
  resourceIds?: string[];
  from: Date;
  to: Date;
}): Promise<VisitStats> {
  const visits = await prisma.roomVisit.findMany({
    where: {
      organizationId: opts.organizationId,
      arrivedAt: { gte: opts.from, lt: opts.to },
      ...(opts.resourceIds ? { resourceId: { in: opts.resourceIds } } : {}),
    },
    select: {
      resourceId: true,
      userId: true,
      matricule: true,
      lastName: true,
      firstName: true,
      statut: true,
      filiere: true,
      arrivedAt: true,
      leftAt: true,
      resource: { select: { name: true } },
    },
  });

  const uniq = new Set<string>();
  const statut = new Map<string, number>();
  const filiere = new Map<string, number>();
  const byHour = Array.from({ length: 24 }, () => 0);
  const salles = new Map<string, SalleStat & { uniq: Set<string> }>();
  let open = 0;
  let closed = 0;
  let totalMinutes = 0;

  for (const v of visits) {
    const key = visitorKey(v);
    uniq.add(key);
    statut.set(v.statut, (statut.get(v.statut) ?? 0) + 1);
    if (v.filiere) filiere.set(v.filiere, (filiere.get(v.filiere) ?? 0) + 1);
    byHour[v.arrivedAt.getUTCHours()]++;

    let s = salles.get(v.resourceId);
    if (!s) {
      s = { resourceId: v.resourceId, name: v.resource.name, total: 0, uniques: 0, minutes: 0, open: 0, uniq: new Set() };
      salles.set(v.resourceId, s);
    }
    s.total++;
    s.uniq.add(key);
    if (v.leftAt) {
      closed++;
      const min = minutesBetween(v.arrivedAt, v.leftAt);
      totalMinutes += min;
      s.minutes += min;
    } else {
      open++;
      s.open++;
    }
  }

  return {
    total: visits.length,
    uniques: uniq.size,
    open,
    closed,
    totalMinutes,
    avgMinutes: closed > 0 ? Math.round(totalMinutes / closed) : 0,
    byStatut: [...statut.entries()].map(([s, n]) => ({ statut: s, n })).sort((a, b) => b.n - a.n),
    byFiliere: [...filiere.entries()].map(([f, n]) => ({ filiere: f, n })).sort((a, b) => b.n - a.n).slice(0, 6),
    byHour,
    bySalle: [...salles.values()]
      .map(({ uniq: u, ...rest }) => ({ ...rest, uniques: u.size }))
      .sort((a, b) => b.total - a.total),
  };
}

/** Salles dont l'utilisateur est surveillant (ids) — périmètre du registre pour un agent. */
export async function supervisedRoomIds(user: Pick<CurrentUser, "id">): Promise<string[]> {
  const rows = await prisma.roomSupervisor.findMany({ where: { userId: user.id }, select: { resourceId: true } });
  return rows.map((r) => r.resourceId);
}

export interface MyVisits {
  total: number;
  totalMinutes: number;
  topSalle: string | null;
  last: { salle: string; arrivedAt: Date; leftAt: Date | null; minutes: number | null }[];
}

/**
 * Statistiques personnelles : les passages de l'utilisateur — son compte connecté et,
 * s'il a une fiche étudiante LIÉE, les visites rattachées à cette fiche (le matricule
 * brut n'est jamais apparié à l'échelle de la plateforme : pas de fuite inter-établissements).
 */
export async function computeMyVisits(user: Pick<CurrentUser, "id">): Promise<MyVisits> {
  const fiche = await prisma.student.findFirst({ where: { userId: user.id }, select: { id: true } });
  const visits = await prisma.roomVisit.findMany({
    where: { OR: [{ userId: user.id }, ...(fiche ? [{ studentId: fiche.id }] : [])] },
    orderBy: { arrivedAt: "desc" },
    select: { arrivedAt: true, leftAt: true, resource: { select: { name: true } } },
  });
  let totalMinutes = 0;
  const perSalle = new Map<string, number>();
  for (const v of visits) {
    perSalle.set(v.resource.name, (perSalle.get(v.resource.name) ?? 0) + 1);
    if (v.leftAt) totalMinutes += minutesBetween(v.arrivedAt, v.leftAt);
  }
  const topSalle = [...perSalle.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return {
    total: visits.length,
    totalMinutes,
    topSalle,
    last: visits.slice(0, 5).map((v) => ({
      salle: v.resource.name,
      arrivedAt: v.arrivedAt,
      leftAt: v.leftAt,
      minutes: v.leftAt ? minutesBetween(v.arrivedAt, v.leftAt) : null,
    })),
  };
}
