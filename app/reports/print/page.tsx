import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BrandLogo } from "@/components/brand/logo";
import { PrintButton } from "@/components/reports/print-button";
import { bookingStatusMeta, BOOKING_STATUS_META, type BookingStatus } from "@/lib/enums";
import { fmtDateTime } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function ReportPrintPage({ searchParams }: { searchParams: { status?: string; from?: string; to?: string } }) {
  await requirePermission("reports.export");
  const user = await getCurrentUser();

  const where: any = { organizationId: user!.organizationId ?? "" };
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.from || searchParams.to) {
    where.startAt = {};
    if (searchParams.from) where.startAt.gte = new Date(searchParams.from);
    if (searchParams.to) where.startAt.lte = new Date(`${searchParams.to}T23:59:59`);
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startAt: "desc" },
    include: { resource: { include: { category: true } }, requester: true },
  });

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-start justify-between border-b border-border pb-5">
        <div>
          <BrandLogo />
          <h1 className="mt-3 text-2xl font-extrabold text-foreground">Rapport de réservations</h1>
          <p className="text-sm text-muted-foreground">{user!.organizationName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {searchParams.status ? `Statut : ${BOOKING_STATUS_META[searchParams.status as BookingStatus]?.label}` : "Tous statuts"}
            {searchParams.from && ` · du ${searchParams.from}`}
            {searchParams.to && ` au ${searchParams.to}`}
            {" · généré le "}{new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
        <PrintButton />
      </div>

      <p className="mb-3 text-sm font-semibold text-foreground">{bookings.length} réservation(s)</p>

      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-foreground/20 text-xs uppercase text-muted-foreground">
            <th className="py-2 pr-3">Code</th>
            <th className="py-2 pr-3">Ressource</th>
            <th className="py-2 pr-3">Demandeur</th>
            <th className="py-2 pr-3">Créneau</th>
            <th className="py-2 pr-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-border">
              <td className="py-2 pr-3 font-mono text-xs">{b.code}</td>
              <td className="py-2 pr-3 font-semibold text-foreground">{b.resource.name}</td>
              <td className="py-2 pr-3">{b.requester.firstName} {b.requester.lastName}</td>
              <td className="py-2 pr-3 text-xs">{fmtDateTime(b.startAt)} → {fmtDateTime(b.endAt)}</td>
              <td className="py-2 pr-3">{bookingStatusMeta(b.status).label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        EduWeb Booking — Plateforme intelligente de réservation des ressources · Document généré automatiquement.
      </p>
    </div>
  );
}
