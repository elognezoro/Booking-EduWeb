import "server-only";
import { prisma } from "./prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { BLOCKING_BOOKING_STATUS } from "./enums";

export interface OrgOverview {
  totalBookings: number;
  todayBookings: number;
  weekBookings: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  noShow: number;
  resourcesTotal: number;
  resourcesAvailable: number;
  resourcesMaintenance: number;
  occupancyRate: number;
  activeUsers: number;
  validationRate: number;
  cancellationRate: number;
  topResources: { name: string; code: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  bookingsByDay: { day: string; count: number }[];
  byCategory: { name: string; color: string; count: number }[];
}

export async function getOrgOverview(organizationId: string): Promise<OrgOverview> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const where = { organizationId };

  const [
    totalBookings,
    todayBookings,
    weekBookings,
    pending,
    approved,
    rejected,
    cancelled,
    noShow,
    resourcesTotal,
    resourcesAvailable,
    resourcesMaintenance,
    activeUsers,
    bookings,
    resources,
  ] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.count({ where: { ...where, startAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.booking.count({ where: { ...where, startAt: { gte: weekStart, lte: weekEnd } } }),
    prisma.booking.count({ where: { ...where, status: { in: ["SUBMITTED", "PENDING_VALIDATION"] } } }),
    prisma.booking.count({ where: { ...where, status: { in: ["APPROVED", "IN_PROGRESS", "COMPLETED", "CLOSED_WITHOUT_INCIDENT"] } } }),
    prisma.booking.count({ where: { ...where, status: "REJECTED" } }),
    prisma.booking.count({ where: { ...where, status: { in: ["CANCELLED_BY_USER", "CANCELLED_BY_ADMIN"] } } }),
    prisma.booking.count({ where: { ...where, status: "NO_SHOW" } }),
    prisma.resource.count({ where: { ...where, status: { not: "ARCHIVED" } } }),
    prisma.resource.count({ where: { ...where, status: "AVAILABLE" } }),
    prisma.resource.count({ where: { ...where, status: "MAINTENANCE" } }),
    prisma.user.count({ where: { organizationId, status: "ACTIVE" } }),
    prisma.booking.findMany({
      where,
      select: { status: true, startAt: true, resource: { select: { name: true, code: true, category: { select: { name: true, color: true } } } } },
    }),
    prisma.resource.findMany({ where: { ...where, status: { not: "ARCHIVED" } }, select: { id: true } }),
  ]);

  // Occupation : ressources réservées (statut bloquant) aujourd'hui / total
  const bookedTodayResources = await prisma.booking.findMany({
    where: { ...where, status: { in: BLOCKING_BOOKING_STATUS }, startAt: { lte: todayEnd }, endAt: { gte: todayStart } },
    select: { resourceId: true },
    distinct: ["resourceId"],
  });
  const occupancyRate = resources.length ? Math.round((bookedTodayResources.length / resources.length) * 100) : 0;

  // Top ressources
  const resourceCount = new Map<string, { name: string; code: string; count: number }>();
  for (const b of bookings) {
    const key = b.resource.code;
    const e = resourceCount.get(key) ?? { name: b.resource.name, code: b.resource.code, count: 0 };
    e.count++;
    resourceCount.set(key, e);
  }
  const topResources = [...resourceCount.values()].sort((a, b) => b.count - a.count).slice(0, 5);

  // Distribution par statut
  const statusMap = new Map<string, number>();
  for (const b of bookings) statusMap.set(b.status, (statusMap.get(b.status) ?? 0) + 1);
  const statusDistribution = [...statusMap.entries()].map(([status, count]) => ({ status, count }));

  // Par catégorie
  const catMap = new Map<string, { name: string; color: string; count: number }>();
  for (const b of bookings) {
    const c = b.resource.category;
    const e = catMap.get(c.name) ?? { name: c.name, color: c.color ?? "#064B3A", count: 0 };
    e.count++;
    catMap.set(c.name, e);
  }
  const byCategory = [...catMap.values()].sort((a, b) => b.count - a.count);

  // Réservations par jour (14 derniers jours)
  const days: { day: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = startOfDay(d).getTime();
    const de = endOfDay(d).getTime();
    const count = bookings.filter((b) => {
      const t = new Date(b.startAt).getTime();
      return t >= ds && t <= de;
    }).length;
    days.push({ day: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }), count });
  }

  const decided = approved + rejected;
  const validationRate = decided ? Math.round((approved / decided) * 100) : 0;
  const cancellationRate = totalBookings ? Math.round((cancelled / totalBookings) * 100) : 0;

  return {
    totalBookings,
    todayBookings,
    weekBookings,
    pending,
    approved,
    rejected,
    cancelled,
    noShow,
    resourcesTotal,
    resourcesAvailable,
    resourcesMaintenance,
    occupancyRate,
    activeUsers,
    validationRate,
    cancellationRate,
    topResources,
    statusDistribution,
    bookingsByDay: days,
    byCategory,
  };
}

export async function getPersonalOverview(userId: string) {
  const now = new Date();
  const [next, pendingCount, approvedCount, pastCount, recent] = await Promise.all([
    prisma.booking.findFirst({
      where: { requesterId: userId, startAt: { gte: now }, status: { in: ["APPROVED", "PENDING_VALIDATION", "SUBMITTED", "IN_PROGRESS"] } },
      orderBy: { startAt: "asc" },
      include: { resource: { include: { category: true } } },
    }),
    prisma.booking.count({ where: { requesterId: userId, status: { in: ["SUBMITTED", "PENDING_VALIDATION"] } } }),
    prisma.booking.count({ where: { requesterId: userId, status: { in: ["APPROVED", "IN_PROGRESS"] } } }),
    prisma.booking.count({ where: { requesterId: userId, status: { in: ["COMPLETED", "CLOSED_WITHOUT_INCIDENT", "CLOSED_WITH_INCIDENT"] } } }),
    prisma.booking.findMany({
      where: { requesterId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { resource: { include: { category: true } } },
    }),
  ]);

  const total = await prisma.booking.count({ where: { requesterId: userId } });
  return { next, pendingCount, approvedCount, pastCount, recent, total };
}
