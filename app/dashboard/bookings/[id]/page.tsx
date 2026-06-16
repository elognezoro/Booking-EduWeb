import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Clock, Users, FileText, MessageSquare, CheckCircle2, XCircle,
  LogIn, Flag, History as HistoryIcon, User as UserIcon, MapPin, Wrench,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/category-icon";
import { BookingStatusBadge } from "@/components/status-badges";
import { BookingTimeline } from "@/components/bookings/booking-timeline";
import { ValidationActions } from "@/components/bookings/validation-panel";
import { ConfirmActionButton } from "@/components/confirm-action";
import { cancelBooking, checkInBooking, completeBooking } from "@/app/actions/bookings";
import { fmtRange, durationLabel } from "@/lib/dates";
import { USAGE_TYPE_LABELS, type UsageType } from "@/lib/enums";
import { parseJson } from "@/lib/json";
import { Armchair } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params, searchParams,
}: { params: { id: string }; searchParams: { created?: string } }) {
  const user = await requireUser();

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      resource: { include: { category: true, site: true, department: true } },
      requester: true,
      history: { orderBy: { createdAt: "desc" } },
      validations: { include: { validator: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!booking || (user.organizationId && booking.organizationId !== user.organizationId)) notFound();

  const isOwner = booking.requesterId === user.id;
  const canValidate = user.permissions.has("bookings.validate") && !isOwner;
  const isPending = ["SUBMITTED", "PENDING_VALIDATION"].includes(booking.status);
  const canCancel = (isOwner && user.permissions.has("bookings.cancel_own")) || user.permissions.has("bookings.cancel_all");
  const cancellable = ["SUBMITTED", "PENDING_VALIDATION", "APPROVED", "RESCHEDULED"].includes(booking.status);
  const canCheckIn = isOwner && booking.status === "APPROVED";
  const canComplete = isOwner && booking.status === "IN_PROGRESS";

  return (
    <div className="space-y-5">
      <Link href={isOwner ? "/dashboard/bookings/my" : "/dashboard/bookings"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour
      </Link>

      {searchParams.created && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Votre demande de réservation a été enregistrée.
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <CategoryIcon icon={booking.resource.category.icon} color={booking.resource.category.color} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{booking.title || booking.purpose}</h1>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="font-mono text-sm text-muted-foreground">{booking.code}</p>
              <Link href={`/dashboard/resources/${booking.resourceId}`} className="mt-1 inline-block text-sm font-semibold text-primary hover:underline">{booking.resource.name}</Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Détails */}
          <Card>
            <CardHeader><CardTitle>Détails de la réservation</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Info icon={Clock} label="Créneau" value={fmtRange(booking.startAt, booking.endAt)} />
              <Info icon={HistoryIcon} label="Durée" value={durationLabel(booking.startAt, booking.endAt)} />
              <Info icon={FileText} label="Type d'usage" value={USAGE_TYPE_LABELS[booking.usageType as UsageType] ?? booking.usageType} />
              {booking.participantCount != null && <Info icon={Users} label="Effectif" value={`${booking.participantCount} personnes`} />}
              {!booking.seatNumbers && booking.quantityRequested != null && booking.quantityRequested > 1 && <Info icon={Users} label="Quantité" value={String(booking.quantityRequested)} />}
              {booking.seatNumbers && (() => {
                const arr = parseJson<number[]>(booking.seatNumbers, []);
                return arr.length ? <Info icon={Armchair} label="Postes réservés" value={arr.slice().sort((a, b) => a - b).join(", ")} /> : null;
              })()}
              {booking.resource.location && <Info icon={MapPin} label="Lieu" value={booking.resource.location} />}
            </CardContent>
          </Card>

          {/* Motif et besoins */}
          <Card>
            <CardHeader><CardTitle>Motif & besoins</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-foreground">Motif</p>
                <p className="text-muted-foreground">{booking.purpose}</p>
              </div>
              {booking.specialNeeds && (
                <div>
                  <p className="font-semibold text-foreground">Besoins particuliers</p>
                  <p className="text-muted-foreground">{booking.specialNeeds}</p>
                </div>
              )}
              {booking.needsSupport && <Badge tone="advanced"><Wrench className="size-3.5" /> Assistance technique demandée</Badge>}
              {booking.requesterNote && (
                <div className="rounded-lg bg-secondary/60 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground"><MessageSquare className="size-3.5" /> Note du demandeur</p>
                  <p className="text-muted-foreground">{booking.requesterNote}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Motif de refus */}
          {booking.status === "REJECTED" && booking.rejectionReason && (
            <Card className="border-unavailable/30 bg-unavailable-soft/40">
              <CardContent className="py-4">
                <p className="flex items-center gap-2 font-bold text-unavailable-fg"><XCircle className="size-5" /> Demande refusée</p>
                <p className="mt-1 text-sm text-foreground">{booking.rejectionReason}</p>
              </CardContent>
            </Card>
          )}

          {/* Historique */}
          <Card>
            <CardHeader><CardTitle>Suivi de la demande</CardTitle></CardHeader>
            <CardContent><BookingTimeline history={booking.history} /></CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-5">
          {/* Actions */}
          {(canValidate && isPending) || canCheckIn || canComplete || (canCancel && cancellable) ? (
            <Card>
              <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {canValidate && isPending && <ValidationActions bookingId={booking.id} />}
                {canCheckIn && (
                  <form action={checkInBooking}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <Button type="submit" variant="success" className="w-full"><LogIn className="size-4" /> Je suis arrivé</Button>
                  </form>
                )}
                {canComplete && (
                  <form action={completeBooking}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <Button type="submit" className="w-full"><Flag className="size-4" /> Activité terminée</Button>
                  </form>
                )}
                {canCancel && cancellable && (
                  <ConfirmActionButton
                    action={cancelBooking}
                    hidden={{ bookingId: booking.id }}
                    triggerLabel="Annuler la réservation"
                    triggerVariant="ghost"
                    fullWidthTrigger
                    title="Annuler cette réservation ?"
                    description="Cette action libère le créneau. Le demandeur en sera informé."
                    confirmLabel="Annuler la réservation"
                    confirmVariant="destructive"
                  />
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Demandeur */}
          <Card>
            <CardHeader><CardTitle className="text-base">Demandeur</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary">
                {booking.requester.firstName[0]}{booking.requester.lastName[0]}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{booking.requester.firstName} {booking.requester.lastName}</p>
                <p className="truncate text-xs text-muted-foreground">{booking.requester.functionTitle ?? booking.requester.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Validations */}
          {booking.validations.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Validation</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {booking.validations.map((v) => (
                  <div key={v.id} className="rounded-lg border border-border p-2.5">
                    <div className="flex items-center gap-2">
                      {v.status === "APPROVED" ? <CheckCircle2 className="size-4 text-available" /> : <XCircle className="size-4 text-unavailable" />}
                      <span className="font-semibold text-foreground">{v.validator.firstName} {v.validator.lastName}</span>
                    </div>
                    {v.comment && <p className="mt-1 text-muted-foreground">{v.comment}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
