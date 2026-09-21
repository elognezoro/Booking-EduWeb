import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardList, LogOut, Printer, CheckCircle2, Users, MonitorPlay, BarChart3, Clock3, UserRound, DoorOpen, MapPin } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { closeRoomVisit } from "@/app/actions/room-attendance";
import { VISIT_STATUT_LABELS, VISIT_TIME, type VisitStatut } from "@/lib/rooms/attendance";
import { computeVisitStats, supervisedRoomIds } from "@/lib/rooms/visit-stats";
import { OpenCloseRoomButton } from "@/components/rooms/open-close-room";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

function todayIso() {
  return new Date().toISOString().slice(0, 10); // Africa/Abidjan = UTC
}
function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 3600 * 1000).toISOString().slice(0, 10);
}
function duree(from: Date, to: Date) {
  const min = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60000));
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
}
function fmtMinutes(min: number) {
  return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
}
const isIsoDay = (v?: string) => /^\d{4}-\d{2}-\d{2}$/.test(v ?? "");

/**
 * Registre & statistiques d'exploitation des salles multimédias.
 * Accès : droits `resources.update` (gestionnaires, admins) OU surveillant affecté
 * à au moins une salle — un surveillant ne voit que SES salles.
 */
export default async function RegistreSallesPage({
  searchParams,
}: {
  searchParams: { salle?: string; date?: string; du?: string; au?: string; closed?: string; opened?: string; closedroom?: string; dejaouverte?: string };
}) {
  const user = await requireUser();
  const orgId = user.organizationId ?? "";
  const isManager = user.permissions.has("resources.update");
  const supervised = await supervisedRoomIds(user);
  if (!isManager && supervised.length === 0) redirect("/dashboard?denied=1");

  const salles = await prisma.resource.findMany({
    where: {
      organizationId: orgId,
      category: { code: "SM" },
      status: { not: "ARCHIVED" },
      ...(isManager ? {} : { id: { in: supervised } }),
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const scopeIds = salles.map((s) => s.id);
  const salleFilter = salles.some((s) => s.id === searchParams.salle) ? searchParams.salle : undefined;
  const date = isIsoDay(searchParams.date) ? searchParams.date! : todayIso();
  const dayStart = new Date(`${date}T00:00:00Z`);
  const dayEnd = new Date(dayStart.getTime() + 24 * 3600 * 1000);

  // Période des statistiques (par défaut : 30 derniers jours).
  const du = isIsoDay(searchParams.du) ? searchParams.du! : isoDaysAgo(30);
  const au = isIsoDay(searchParams.au) ? searchParams.au! : todayIso();
  const statsFrom = new Date(`${du}T00:00:00Z`);
  const statsTo = new Date(new Date(`${au}T00:00:00Z`).getTime() + 24 * 3600 * 1000);

  const [presents, journal, stats, ouvertures, sessionsJour] = await Promise.all([
    prisma.roomVisit.findMany({
      // Une arrivée jamais pointée sort de la liste après 24 h (elle reste au journal).
      where: { organizationId: orgId, leftAt: null, arrivedAt: { gt: new Date(Date.now() - 24 * 3600 * 1000) }, resourceId: { in: salleFilter ? [salleFilter] : scopeIds } },
      include: { resource: { select: { name: true } } },
      orderBy: { arrivedAt: "asc" },
      take: 400,
    }),
    prisma.roomVisit.findMany({
      where: { organizationId: orgId, arrivedAt: { gte: dayStart, lt: dayEnd }, resourceId: { in: salleFilter ? [salleFilter] : scopeIds } },
      include: { resource: { select: { name: true } } },
      orderBy: { arrivedAt: "desc" },
      take: 400,
    }),
    computeVisitStats({ organizationId: orgId, resourceIds: salleFilter ? [salleFilter] : scopeIds, from: statsFrom, to: statsTo }),
    prisma.roomOpening.findMany({
      where: { resourceId: { in: scopeIds }, closedAt: null },
      orderBy: { openedAt: "desc" },
    }),
    prisma.roomOpening.findMany({
      where: { resourceId: { in: salleFilter ? [salleFilter] : scopeIds }, openedAt: { gte: dayStart, lt: dayEnd } },
      include: { resource: { select: { name: true } } },
      orderBy: { openedAt: "desc" },
      take: 100,
    }),
  ]);

  // Noms des surveillants ayant ouvert/fermé (affichage).
  const operatorIds = [...new Set([...ouvertures, ...sessionsJour].flatMap((o) => [o.openedById, o.closedById]).filter((x): x is string => !!x))];
  const operators = operatorIds.length
    ? await prisma.user.findMany({ where: { id: { in: operatorIds } }, select: { id: true, firstName: true, lastName: true } })
    : [];
  const operatorName = (id: string | null) => {
    const u = operators.find((o) => o.id === id);
    return u ? `${u.firstName} ${u.lastName}` : "—";
  };
  const openByRoom = new Map(ouvertures.map((o) => [o.resourceId, o]));
  const gpsLink = (lat: number | null, lng: number | null, acc: number | null) =>
    lat != null && lng != null ? (
      <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold text-primary hover:underline">
        <MapPin className="size-3" /> position{acc != null ? ` (±${Math.round(acc)} m)` : ""}
      </a>
    ) : (
      <span className="text-muted-foreground">position non fournie</span>
    );

  const peakHour = stats.byHour.reduce((best, n, h) => (n > stats.byHour[best] ? h : best), 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Registre & statistiques des salles"
        description={
          isManager
            ? "Arrivées par QR, départs pointés ici, et statistiques d'exploitation des salles multimédias."
            : "Vos salles surveillées : arrivées par QR, départs à pointer, statistiques d'exploitation."
        }
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><ClipboardList className="size-6" /></span>}
        actions={
          <div className="flex flex-wrap gap-2">
            {isManager && (
              <Button asChild variant="outline"><a href="/salles/affiches" target="_blank" rel="noopener noreferrer"><Printer className="size-4" /> Affiches QR</a></Button>
            )}
            <Button asChild variant="outline"><Link href="/dashboard/rooms"><MonitorPlay className="size-4" /> Plan des postes</Link></Button>
          </div>
        }
      />

      {searchParams.closed && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Heure de départ enregistrée.
        </div>
      )}
      {searchParams.opened && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Salle ouverte — heure et position enregistrées.
        </div>
      )}
      {searchParams.closedroom && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Salle fermée — heure et position enregistrées.
        </div>
      )}
      {searchParams.dejaouverte && (
        <div className="flex items-center gap-2 rounded-xl border border-pending/30 bg-pending-soft px-4 py-3 text-sm font-semibold text-foreground">
          Cette salle est déjà ouverte.
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="py-4">
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="f-salle" className="mb-1 block text-xs font-semibold text-muted-foreground">Salle</label>
              <Select id="f-salle" name="salle" defaultValue={salleFilter ?? ""} className="w-52">
                <option value="">{isManager ? "Toutes les salles" : "Toutes mes salles"}</option>
                {salles.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </div>
            <div>
              <label htmlFor="f-date" className="mb-1 block text-xs font-semibold text-muted-foreground">Journal du</label>
              <Input id="f-date" name="date" type="date" defaultValue={date} className="w-40" />
            </div>
            <div>
              <label htmlFor="f-du" className="mb-1 block text-xs font-semibold text-muted-foreground">Statistiques du</label>
              <Input id="f-du" name="du" type="date" defaultValue={du} className="w-40" />
            </div>
            <div>
              <label htmlFor="f-au" className="mb-1 block text-xs font-semibold text-muted-foreground">au</label>
              <Input id="f-au" name="au" type="date" defaultValue={au} className="w-40" />
            </div>
            <Button type="submit" variant="outline">Appliquer</Button>
          </form>
        </CardContent>
      </Card>

      {/* Ouverture / fermeture des salles (surveillants, avec position GPS) */}
      <Card>
        <CardContent className="py-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-foreground">
            <DoorOpen className="size-4 text-primary" /> Ouverture & fermeture des salles
          </h2>
          <ul className="divide-y divide-border">
            {salles.map((s) => {
              const open = openByRoom.get(s.id);
              return (
                <li key={s.id} className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {open ? (
                        <>Ouverte à <strong className="text-foreground">{VISIT_TIME.format(open.openedAt)}</strong> par {operatorName(open.openedById)} · {gpsLink(open.openLat, open.openLng, open.openAccuracy)}</>
                      ) : (
                        "Fermée"
                      )}
                    </p>
                  </div>
                  <OpenCloseRoomButton roomId={s.id} isOpen={!!open} />
                </li>
              );
            })}
          </ul>
          {sessionsJour.length > 0 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Sessions du {date.split("-").reverse().join("/")}</p>
              <ul className="divide-y divide-border text-sm">
                {sessionsJour.map((o) => (
                  <li key={o.id} className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold text-foreground">{o.resource.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Ouverte {VISIT_TIME.format(o.openedAt)} ({operatorName(o.openedById)} · {gpsLink(o.openLat, o.openLng, o.openAccuracy)})
                      {o.closedAt ? (
                        <> — fermée {VISIT_TIME.format(o.closedAt)} ({operatorName(o.closedById)} · {gpsLink(o.closeLat, o.closeLng, o.closeAccuracy)})</>
                      ) : (
                        <> — <Badge tone="available" dot>ouverte</Badge></>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques d'exploitation */}
      <Card>
        <CardContent className="py-5">
          <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
            <BarChart3 className="size-4 text-primary" /> Statistiques d'exploitation
            <span className="text-sm font-normal text-muted-foreground">— du {du.split("-").reverse().join("/")} au {au.split("-").reverse().join("/")}</span>
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<ClipboardList className="size-4" />} label="Passages" value={String(stats.total)} />
            <StatCard icon={<UserRound className="size-4" />} label="Visiteurs uniques" value={String(stats.uniques)} />
            <StatCard icon={<Clock3 className="size-4" />} label="Durée moyenne" value={stats.closed > 0 ? fmtMinutes(stats.avgMinutes) : "—"} hint={`${stats.closed} visite(s) clôturée(s)`} />
            <StatCard icon={<Users className="size-4" />} label="Temps de présence cumulé" value={fmtMinutes(stats.totalMinutes)} hint={stats.total > 0 ? `pic d'affluence : ${String(peakHour).padStart(2, "0")} h` : undefined} />
          </div>

          {(stats.byStatut.length > 0 || stats.byFiliere.length > 0) && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {stats.byStatut.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Par statut</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.byStatut.map((s) => (
                      <Badge key={s.statut} tone="info">{VISIT_STATUT_LABELS[s.statut as VisitStatut] ?? s.statut} · {s.n}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {stats.byFiliere.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Filières les plus représentées</p>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.byFiliere.map((f) => <Badge key={f.filiere} tone="neutral">{f.filiere} · {f.n}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {stats.bySalle.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3">Salle</th>
                    <th className="py-2 pr-3">Passages</th>
                    <th className="py-2 pr-3">Visiteurs uniques</th>
                    <th className="py-2 pr-3">Présence cumulée</th>
                    <th className="py-2">En salle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.bySalle.map((s) => (
                    <tr key={s.resourceId}>
                      <td className="py-2 pr-3 font-semibold text-foreground">{s.name}</td>
                      <td className="py-2 pr-3">{s.total}</td>
                      <td className="py-2 pr-3">{s.uniques}</td>
                      <td className="py-2 pr-3">{fmtMinutes(s.minutes)}</td>
                      <td className="py-2">{s.open > 0 ? <Badge tone="available" dot>{s.open}</Badge> : "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Présents actuellement */}
      <Card>
        <CardContent className="py-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-foreground">
            <Users className="size-4 text-primary" /> Présents actuellement
            <Badge tone={presents.length > 0 ? "available" : "neutral"} dot>{presents.length}</Badge>
          </h2>
          {presents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Personne en salle pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {presents.map((v) => (
                <li key={v.id} className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{v.lastName} {v.firstName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[VISIT_STATUT_LABELS[v.statut as VisitStatut] ?? v.statut, [v.filiere, v.section].filter(Boolean).join(" · ") || null, v.matricule].filter(Boolean).join(" — ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{v.resource.name} · arrivé(e) à <strong className="text-foreground">{VISIT_TIME.format(v.arrivedAt)}</strong> ({duree(v.arrivedAt, new Date())})</span>
                    <form action={closeRoomVisit}>
                      <input type="hidden" name="id" value={v.id} />
                      <Button type="submit" size="sm"><LogOut className="size-4" /> Départ</Button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Journal de la journée */}
      <Card>
        <CardContent className="py-5">
          <h2 className="mb-3 font-bold text-foreground">Journal du {date.split("-").reverse().join("/")} <span className="text-sm font-normal text-muted-foreground">— {journal.length} passage{journal.length > 1 ? "s" : ""}</span></h2>
          {journal.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Aucun passage" description="Aucune arrivée enregistrée sur cette journée (et ce filtre)." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3">Nom & prénoms</th>
                    <th className="py-2 pr-3">Statut</th>
                    <th className="py-2 pr-3">Filière</th>
                    <th className="py-2 pr-3">Salle</th>
                    <th className="py-2 pr-3">Arrivée</th>
                    <th className="py-2 pr-3">Départ</th>
                    <th className="py-2">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {journal.map((v) => (
                    <tr key={v.id}>
                      <td className="py-2 pr-3 font-semibold text-foreground">{v.lastName} {v.firstName}{v.matricule ? <span className="block text-xs font-normal text-muted-foreground">{v.matricule}</span> : null}</td>
                      <td className="py-2 pr-3">{VISIT_STATUT_LABELS[v.statut as VisitStatut] ?? v.statut}</td>
                      <td className="py-2 pr-3">{[v.filiere, v.section].filter(Boolean).join(" · ") || "—"}</td>
                      <td className="py-2 pr-3">{v.resource.name}</td>
                      <td className="py-2 pr-3">{VISIT_TIME.format(v.arrivedAt)}</td>
                      <td className="py-2 pr-3">
                        {v.leftAt ? (
                          VISIT_TIME.format(v.leftAt)
                        ) : (
                          <form action={closeRoomVisit} className="inline-flex items-center gap-1.5">
                            <input type="hidden" name="id" value={v.id} />
                            <Badge tone="available" dot>en salle</Badge>
                            <Button type="submit" size="sm" variant="ghost" aria-label={`Pointer le départ de ${v.lastName} ${v.firstName}`} title="Pointer le départ"><LogOut className="size-4" /></Button>
                          </form>
                        )}
                      </td>
                      <td className="py-2">{v.leftAt ? duree(v.arrivedAt, v.leftAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/40 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">{icon} {label}</p>
      <p className="mt-1 text-2xl font-extrabold text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
