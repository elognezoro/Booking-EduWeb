import { ClipboardList } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { BookingListItem } from "@/components/bookings/booking-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { BOOKING_STATUS, BOOKING_STATUS_META } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function AllBookingsPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  await requirePermission("bookings.read_all");
  const user = await getCurrentUser();

  const where: any = { organizationId: user!.organizationId ?? "" };
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.q) {
    where.OR = [
      { code: { contains: searchParams.q } },
      { title: { contains: searchParams.q } },
      { purpose: { contains: searchParams.q } },
      { resource: { name: { contains: searchParams.q } } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startAt: "desc" },
    take: 100,
    include: { resource: { include: { category: true } }, requester: true },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Toutes les réservations"
        description="Suivez l'ensemble des réservations de votre organisation."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><ClipboardList className="size-6" /></span>}
      />
      <SearchFilterBar
        searchPlaceholder="Rechercher par code, motif, ressource…"
        filters={[{ name: "status", label: "Tous les statuts", options: BOOKING_STATUS.map((s) => ({ value: s, label: BOOKING_STATUS_META[s].label })) }]}
      />
      <p className="text-sm text-muted-foreground">{bookings.length} réservation(s)</p>
      {bookings.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Aucune réservation" description="Aucune réservation ne correspond aux filtres." />
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => <BookingListItem key={b.id} booking={b} showRequester />)}
        </div>
      )}
    </div>
  );
}
