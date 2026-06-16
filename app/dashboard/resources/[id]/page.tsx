import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Users, Boxes, CalendarPlus, Pencil, ArrowLeft, ShieldCheck, Clock4,
  CheckCircle2, QrCode, Wrench, User as UserIcon,
} from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/json";
import { DEFAULT_RESOURCE_RULES, type ResourceRules, BLOCKING_BOOKING_STATUS } from "@/lib/enums";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/misc";
import { CategoryIcon } from "@/components/category-icon";
import { ResourceStatusBadge } from "@/components/status-badges";
import { fmtRange, fmtDateTime } from "@/lib/dates";
import { ResourceDeleteButton } from "@/components/resources/resource-delete-button";

export const dynamic = "force-dynamic";

const BOOKING_MODE_LABEL: Record<string, string> = { exclusive: "Exclusive", partial: "Partagée", mixed: "Mixte" };

export default async function ResourceDetailPage({ params }: { params: { id: string } }) {
  await requirePermission("resources.read");
  const user = await getCurrentUser();
  const canManage = user!.permissions.has("resources.update");
  const canDelete = user!.permissions.has("resources.delete");
  const canBook = user!.permissions.has("bookings.create");

  const resource = await prisma.resource.findFirst({
    where: { id: params.id, organizationId: user!.organizationId ?? undefined },
    include: { category: true, site: true, department: true, manager: true },
  });
  if (!resource) notFound();

  const now = new Date();
  const [upcoming, ongoing, totalBookings, maintenances] = await Promise.all([
    prisma.booking.findMany({
      where: { resourceId: resource.id, status: { in: BLOCKING_BOOKING_STATUS }, endAt: { gte: now } },
      orderBy: { startAt: "asc" },
      take: 6,
      include: { requester: true },
    }),
    prisma.booking.findFirst({ where: { resourceId: resource.id, status: { in: BLOCKING_BOOKING_STATUS }, startAt: { lte: now }, endAt: { gte: now } } }),
    prisma.booking.count({ where: { resourceId: resource.id } }),
    prisma.maintenance.findMany({ where: { resourceId: resource.id, status: { in: ["PLANNED", "IN_PROGRESS"] }, endAt: { gte: now } }, orderBy: { startAt: "asc" } }),
  ]);

  const equipment = parseJson<string[]>(resource.equipment, []);
  const customFields = parseJson<Record<string, unknown>>(resource.customFields, {});
  const rules: ResourceRules = { ...DEFAULT_RESOURCE_RULES, ...parseJson<Partial<ResourceRules>>(resource.rules, {}) };
  const bookable = ["AVAILABLE", "PARTIALLY_AVAILABLE", "RESERVED"].includes(resource.status);
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const resourceUrl = `${appUrl}/dashboard/resources/${resource.id}`;

  return (
    <div className="space-y-5">
      <Link href="/dashboard/resources" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour aux ressources
      </Link>

      {/* En-tête */}
      <Card>
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <CategoryIcon icon={resource.category.icon} color={resource.category.color} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{resource.name}</h1>
                <ResourceStatusBadge status={resource.status} />
              </div>
              <p className="font-mono text-sm text-muted-foreground">{resource.code}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {resource.category.name}
                {resource.site && ` · ${resource.site.name}`}
                {resource.department && ` · ${resource.department.name}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canManage && (
              <Button asChild variant="outline" size="sm"><Link href={`/dashboard/resources/${resource.id}/edit`}><Pencil className="size-4" /> Modifier</Link></Button>
            )}
            {canDelete && <ResourceDeleteButton id={resource.id} name={resource.name} />}
            {canBook && bookable && (
              <Button asChild size="sm"><Link href={`/dashboard/bookings/new?resourceId=${resource.id}`}><CalendarPlus className="size-4" /> Réserver</Link></Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {resource.description && (
            <Card>
              <CardHeader><CardTitle>Description</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p></CardContent>
            </Card>
          )}

          {/* Caractéristiques */}
          <Card>
            <CardHeader><CardTitle>Caractéristiques</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {resource.capacity != null && <Spec icon={Users} label="Capacité" value={`${resource.capacity} places`} />}
              {resource.quantityTotal != null && <Spec icon={Boxes} label="Quantité" value={`${resource.quantityAvailable}/${resource.quantityTotal} disponibles`} />}
              {resource.location && <Spec icon={MapPin} label="Localisation" value={resource.location} />}
              {resource.manager && <Spec icon={UserIcon} label="Responsable" value={`${resource.manager.firstName} ${resource.manager.lastName}`} />}
              <Spec icon={ShieldCheck} label="Mode de réservation" value={BOOKING_MODE_LABEL[rules.bookingMode] ?? rules.bookingMode} />
              <Spec icon={Clock4} label="Durée max." value={`${Math.round((rules.maxDurationMinutes ?? 0) / 60)}h · préavis ${rules.minNoticeHours ?? 0}h`} />
              {Object.entries(customFields).map(([k, v]) => (
                <Spec key={k} icon={CheckCircle2} label={k} value={String(typeof v === "boolean" ? (v ? "Oui" : "Non") : v)} />
              ))}
            </CardContent>
          </Card>

          {equipment.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Équipements</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {equipment.map((e) => <Badge key={e} tone="info">{e}</Badge>)}
              </CardContent>
            </Card>
          )}

          {/* Prochaines réservations */}
          <Card>
            <CardHeader><CardTitle>Prochaines réservations</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {upcoming.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Aucune réservation à venir — la ressource est libre.</p>
              ) : (
                upcoming.map((b) => (
                  <Link key={b.id} href={`/dashboard/bookings/${b.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 hover:bg-muted">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{b.title || b.purpose}</p>
                      <p className="text-xs text-muted-foreground">{fmtRange(b.startAt, b.endAt)} · {b.requester.firstName} {b.requester.lastName}</p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-5">
          {/* Disponibilité */}
          <Card className={ongoing ? "border-pending/30" : "border-available/30"}>
            <CardContent className="py-5 text-center">
              {ongoing ? (
                <>
                  <Badge tone="pending" dot className="mb-2">Occupée actuellement</Badge>
                  <p className="text-sm text-muted-foreground">Libre à partir de</p>
                  <p className="text-lg font-bold text-foreground">{fmtDateTime(ongoing.endAt)}</p>
                </>
              ) : bookable ? (
                <>
                  <span className="mx-auto mb-2 inline-flex size-12 items-center justify-center rounded-2xl bg-available-soft text-available-fg"><CheckCircle2 className="size-6" /></span>
                  <p className="font-bold text-foreground">Disponible maintenant</p>
                  <p className="text-sm text-muted-foreground">Aucune réservation en cours.</p>
                </>
              ) : (
                <>
                  <span className="mx-auto mb-2 inline-flex size-12 items-center justify-center rounded-2xl bg-unavailable-soft text-unavailable-fg"><Wrench className="size-6" /></span>
                  <p className="font-bold text-foreground">Non réservable</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Maintenance */}
          {maintenances.length > 0 && (
            <Card className="border-advanced/30 bg-advanced-soft/30">
              <CardHeader><CardTitle className="text-base">Maintenance planifiée</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {maintenances.map((m) => (
                  <div key={m.id}>
                    <p className="font-semibold text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{fmtRange(m.startAt, m.endAt)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* QR code */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><QrCode className="size-4" /> QR code</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=064B3A&data=${encodeURIComponent(resourceUrl)}`}
                alt={`QR code de ${resource.name}`}
                width={160}
                height={160}
                className="rounded-xl border border-border bg-white p-2"
              />
              <p className="text-center text-xs text-muted-foreground">Scannez pour accéder à la ressource.</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-extrabold text-foreground">{totalBookings}</p>
              <p className="text-sm text-muted-foreground">réservations au total</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border p-3">
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs capitalize text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
