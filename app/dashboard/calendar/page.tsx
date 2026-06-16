import { CalendarDays } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { CalendarView } from "@/components/calendar/calendar-view";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  await requirePermission("calendar.read");
  const user = await getCurrentUser();

  // Les demandeurs purs ne voient que leurs réservations ; les autres voient l'organisation.
  const canSeeAll = user!.permissions.has("bookings.read_all");
  const where: any = canSeeAll
    ? { organizationId: user!.organizationId ?? "" }
    : { requesterId: user!.id };

  const bookings = await prisma.booking.findMany({
    where: { ...where, status: { notIn: ["DRAFT"] } },
    include: { resource: true },
    orderBy: { startAt: "asc" },
    take: 500,
  });

  const events = bookings.map((b) => ({
    id: b.id,
    title: b.title || b.purpose,
    start: b.startAt.toISOString(),
    end: b.endAt.toISOString(),
    status: b.status,
    resourceName: b.resource.name,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Calendrier"
        description={canSeeAll ? "Vue d'ensemble des réservations de l'organisation." : "Vos réservations dans le temps."}
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><CalendarDays className="size-6" /></span>}
      />
      <CalendarView events={events} />
    </div>
  );
}
