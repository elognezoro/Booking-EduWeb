import Link from "next/link";
import { BookMarked, Check, X, User, Clock } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { decideReservation } from "@/app/actions/library";
import { RESERVATION_TYPE_LABELS, RESERVATION_STATUS_META, type ReservationType, type ReservationStatus } from "@/lib/library/enums";
import { fmtRange, fromNow } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const user = await requirePermission("documents.reserve");
  const canDecide = user.permissions.has("documents.review");

  const reservations = await prisma.documentReservation.findMany({
    where: canDecide
      ? { document: { organizationId: user.organizationId ?? "" } }
      : { requesterId: user.id },
    orderBy: { createdAt: "desc" },
    include: { document: { select: { id: true, title: true } } },
  });

  const requesterIds = Array.from(new Set(reservations.map((r) => r.requesterId)));
  const users = requesterIds.length ? await prisma.user.findMany({ where: { id: { in: requesterIds } }, select: { id: true, firstName: true, lastName: true } }) : [];
  const name = (id: string) => { const u = users.find((x) => x.id === id); return u ? `${u.firstName} ${u.lastName}` : "—"; };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Réservations documentaires"
        description={canDecide ? "Demandes de consultation, d'emprunt et d'accès." : "Vos demandes documentaires."}
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><BookMarked className="size-6" /></span>}
      />

      {reservations.length === 0 ? (
        <EmptyState icon={BookMarked} title="Aucune demande" description="Aucune réservation ou demande d'accès pour le moment." />
      ) : (
        <div className="space-y-2">
          {reservations.map((r) => {
            const status = RESERVATION_STATUS_META[r.status as ReservationStatus] ?? { label: r.status, tone: "neutral" as const };
            return (
              <Card key={r.id}>
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link href={`/dashboard/library/documents/${r.document.id}`} className="truncate font-bold text-foreground hover:text-primary">{r.document.title}</Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <Badge tone="info">{RESERVATION_TYPE_LABELS[r.type as ReservationType] ?? r.type}</Badge>
                      {canDecide && <span className="inline-flex items-center gap-1"><User className="size-3" /> {name(r.requesterId)}</span>}
                      {r.slotStart && r.slotEnd && <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {fmtRange(r.slotStart, r.slotEnd)}</span>}
                      <span>· {fromNow(r.createdAt)}</span>
                    </div>
                    {r.note && <p className="mt-1 text-sm text-muted-foreground">{r.note}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={status.tone} dot>{status.label}</Badge>
                    {canDecide && r.status === "PENDING" && (
                      <>
                        <form action={decideReservation}>
                          <input type="hidden" name="reservationId" value={r.id} />
                          <input type="hidden" name="decision" value="approve" />
                          <Button type="submit" size="sm" variant="success"><Check className="size-4" /></Button>
                        </form>
                        <form action={decideReservation}>
                          <input type="hidden" name="reservationId" value={r.id} />
                          <input type="hidden" name="decision" value="reject" />
                          <Button type="submit" size="sm" variant="outline" className="border-unavailable/40 text-unavailable-fg"><X className="size-4" /></Button>
                        </form>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
