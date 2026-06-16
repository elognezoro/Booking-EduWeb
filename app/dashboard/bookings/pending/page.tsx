import { ClipboardCheck, CheckCircle2 } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PendingBookingCard } from "@/components/bookings/pending-booking-card";

export const dynamic = "force-dynamic";

export default async function PendingBookingsPage() {
  await requirePermission("bookings.validate");
  const user = await getCurrentUser();

  const bookings = await prisma.booking.findMany({
    where: { organizationId: user!.organizationId ?? "", status: { in: ["SUBMITTED", "PENDING_VALIDATION"] } },
    orderBy: { startAt: "asc" },
    include: { resource: { include: { category: true } }, requester: true },
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Demandes à valider"
        description="Approuvez ou refusez les demandes en attente."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-pending-soft text-pending-fg"><ClipboardCheck className="size-6" /></span>}
      />
      {bookings.length === 0 ? (
        <EmptyState icon={CheckCircle2} title="Tout est à jour 🎉" description="Aucune demande n'est en attente de validation." />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{bookings.length} demande(s) en attente</p>
          <div className="grid gap-4 lg:grid-cols-2">
            {bookings.map((b) => <PendingBookingCard key={b.id} booking={b} />)}
          </div>
        </>
      )}
    </div>
  );
}
