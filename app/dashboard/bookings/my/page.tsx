import Link from "next/link";
import { CalendarCheck2, Plus } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { BookingListItem } from "@/components/bookings/booking-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { BOOKING_STATUS, BOOKING_STATUS_META } from "@/lib/enums";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  await requirePermission("bookings.read_own");
  const user = await getCurrentUser();

  const where: any = { requesterId: user!.id };
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.q) {
    where.OR = [
      { code: { contains: searchParams.q } },
      { title: { contains: searchParams.q } },
      { purpose: { contains: searchParams.q } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startAt: "desc" },
    include: { resource: { include: { category: true } } },
  });

  const now = new Date();
  const upcoming = bookings.filter((b) => new Date(b.startAt) >= now);
  const past = bookings.filter((b) => new Date(b.startAt) < now);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mes réservations"
        description="Suivez le statut de toutes vos demandes."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><CalendarCheck2 className="size-6" /></span>}
        actions={<Button asChild><Link href="/dashboard/bookings/new"><Plus className="size-4" /> Nouvelle réservation</Link></Button>}
      />
      <SearchFilterBar
        searchPlaceholder="Rechercher dans mes réservations…"
        filters={[{ name: "status", label: "Tous les statuts", options: BOOKING_STATUS.map((s) => ({ value: s, label: BOOKING_STATUS_META[s].label })) }]}
      />

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck2}
          title="Aucune réservation"
          description="Vous n'avez pas encore de réservation. Lancez-vous !"
          action={<Button asChild><Link href="/dashboard/bookings/new"><Plus className="size-4" /> Réserver une ressource</Link></Button>}
        />
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <Card>
              <CardHeader><CardTitle>À venir ({upcoming.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2">{upcoming.map((b) => <BookingListItem key={b.id} booking={b} />)}</CardContent>
            </Card>
          )}
          {past.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Historique ({past.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2">{past.map((b) => <BookingListItem key={b.id} booking={b} />)}</CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
