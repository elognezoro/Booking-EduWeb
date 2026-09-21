import Link from "next/link";
import {
  CalendarDays, Clock, CheckCircle2, ClipboardList, Boxes, Percent, Users, TrendingUp,
  Plus, ArrowRight, Building2, Globe2, AlertTriangle, History, CalendarCheck2,
  GraduationCap, UserPlus, UserCheck, Wallet,
} from "lucide-react";
import { requireUser, type CurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrgOverview, getPersonalOverview } from "@/lib/stats";
import { fmtMoney } from "@/lib/money";
import { startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/misc";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MiniBarChart } from "@/components/dashboard/mini-bar-chart";
import { BookingListItem } from "@/components/bookings/booking-list-item";
import { EmptyState } from "@/components/ui/empty-state";
import { fmtDayLong, fmtRange } from "@/lib/dates";
import { BLOCKING_BOOKING_STATUS } from "@/lib/enums";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const isManager = user.permissions.has("bookings.read_all");
  const isSuperAdmin = user.roles.includes("SUPER_ADMIN");

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold capitalize text-primary">{fmtDayLong(new Date())}</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {greeting()}, {user.firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isManager ? "Voici l'activité de votre organisation aujourd'hui." : "Voici un aperçu de vos réservations."}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/bookings/new"><Plus className="size-4" /> Nouvelle réservation</Link>
        </Button>
      </div>

      {isSuperAdmin && <SuperAdminSection />}
      <PilotageSection user={user} />
      {isManager ? <ManagerDashboard organizationId={user.organizationId!} /> : <RequesterDashboard userId={user.id} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pilotage : activation étudiante, comptes, recettes du mois          */
/* ------------------------------------------------------------------ */
async function PilotageSection({ user }: { user: CurrentUser }) {
  const orgId = user.organizationId;
  const canScolarite = user.permissions.has("scolarite.read");
  const canUsers = user.permissions.has("users.manage");
  const canFinances = user.permissions.has("finances.read");
  if (!orgId || (!canScolarite && !canUsers && !canFinances)) return null;

  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * 864e5);
  const d30 = new Date(now.getTime() - 30 * 864e5);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const isPlatform = user.permissions.has("platform.manage");

  const [actifs, actives, annee1, annee2, new7, new30, pending, recettes] = await Promise.all([
    canScolarite ? prisma.student.count({ where: { organizationId: orgId, status: "ACTIVE" } }) : 0,
    canScolarite ? prisma.student.count({ where: { organizationId: orgId, status: "ACTIVE", userId: { not: null } } }) : 0,
    canScolarite ? prisma.student.count({ where: { organizationId: orgId, status: "ACTIVE", year: 1 } }) : 0,
    canScolarite ? prisma.student.count({ where: { organizationId: orgId, status: "ACTIVE", year: 2 } }) : 0,
    canUsers ? prisma.user.count({ where: { organizationId: orgId, createdAt: { gte: d7 } } }) : 0,
    canUsers ? prisma.user.count({ where: { organizationId: orgId, createdAt: { gte: d30 } } }) : 0,
    // Comptes en attente de validation : périmètre global pour la plateforme, sinon l'institution.
    canUsers ? prisma.user.count({ where: { status: "PENDING", ...(isPlatform ? {} : { organizationId: orgId }) } }) : 0,
    canFinances
      ? prisma.financeEntry.aggregate({
          where: { organizationId: orgId, kind: "INCOME", date: { gte: monthStart } },
          _sum: { amount: true },
          _count: true,
        })
      : null,
  ]);
  const taux = actifs > 0 ? Math.round((actives / actifs) * 100) : 0;

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Pilotage</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {canScolarite && (
          <Card className="flex flex-col p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted-foreground">Activation des comptes étudiants</p>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary"><GraduationCap className="size-5" /></span>
            </div>
            <p className="mt-1 text-3xl font-black text-foreground">{taux}%</p>
            <Progress value={taux} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {actives} compte(s) activé(s) sur {actifs} étudiant(s) actif(s) · 1ʳᵉ année : {annee1} · 2ᵉ année : {annee2}
            </p>
            <Link href="/dashboard/scolarite" className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-primary hover:underline">
              Ouvrir la Scolarité <ArrowRight className="size-3.5" />
            </Link>
          </Card>
        )}
        {canUsers && (
          <Card className="flex flex-col p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted-foreground">Nouveaux comptes créés</p>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700"><UserPlus className="size-5" /></span>
            </div>
            <p className="mt-1 text-3xl font-black text-foreground">{new7}</p>
            <p className="text-xs text-muted-foreground">ces 7 derniers jours · {new30} sur 30 jours</p>
            <Link href="/dashboard/admin/users" className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-primary hover:underline">
              Voir les utilisateurs <ArrowRight className="size-3.5" />
            </Link>
          </Card>
        )}
        {canUsers && (
          <Card className={`flex flex-col p-5 ${pending > 0 ? "border-pending/40 bg-pending-soft/30" : ""}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted-foreground">Comptes en attente de validation</p>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-pending-soft text-pending-fg"><UserCheck className="size-5" /></span>
            </div>
            <p className="mt-1 text-3xl font-black text-foreground">{pending}</p>
            <p className="text-xs text-muted-foreground">{pending > 0 ? "Action requise : affectez ou refusez ces demandes." : "Aucune demande en attente."}</p>
            <Link href="/dashboard/admin/account-requests" className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-primary hover:underline">
              Demandes de comptes <ArrowRight className="size-3.5" />
            </Link>
          </Card>
        )}
        {canFinances && (
          <Card className="flex flex-col p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted-foreground">Recettes du mois</p>
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-available-soft text-available-fg"><Wallet className="size-5" /></span>
            </div>
            <p className="mt-1 text-2xl font-black text-foreground">{fmtMoney(recettes?._sum.amount ?? 0)}</p>
            <p className="text-xs text-muted-foreground">{recettes?._count ?? 0} encaissement(s) ce mois-ci, tous espaces confondus</p>
            <Link href="/dashboard/finances" className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-primary hover:underline">
              Ouvrir les Finances <ArrowRight className="size-3.5" />
            </Link>
          </Card>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tableau de bord responsable / administrateur                        */
/* ------------------------------------------------------------------ */
async function ManagerDashboard({ organizationId }: { organizationId: string }) {
  const overview = await getOrgOverview(organizationId);
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [todayBookings, pendingBookings, openIncidents] = await Promise.all([
    prisma.booking.findMany({
      where: { organizationId, startAt: { gte: todayStart, lte: todayEnd }, status: { in: BLOCKING_BOOKING_STATUS } },
      orderBy: { startAt: "asc" },
      take: 6,
      include: { resource: { include: { category: true } }, requester: true },
    }),
    prisma.booking.findMany({
      where: { organizationId, status: { in: ["SUBMITTED", "PENDING_VALIDATION"] } },
      orderBy: { startAt: "asc" },
      take: 5,
      include: { resource: { include: { category: true } }, requester: true },
    }),
    prisma.incident.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] }, resource: { organizationId } } }),
  ]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Réservations du jour" value={overview.todayBookings} icon={CalendarDays} tone="info" hint={`${overview.weekBookings} cette semaine`} />
        <KpiCard label="En attente de validation" value={overview.pending} icon={Clock} tone="pending" hint="Action requise" />
        <KpiCard label="Ressources disponibles" value={`${overview.resourcesAvailable}/${overview.resourcesTotal}`} icon={Boxes} tone="available" hint={`${overview.resourcesMaintenance} en maintenance`} />
        <KpiCard label="Taux d'occupation" value={`${overview.occupancyRate}%`} icon={Percent} tone="advanced" hint="Ressources réservées aujourd'hui" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* Graphique d'activité */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Activité des réservations</CardTitle>
                <p className="text-sm text-muted-foreground">14 derniers jours</p>
              </div>
              <Badge tone="available"><TrendingUp className="size-3.5" /> {overview.validationRate}% validées</Badge>
            </CardHeader>
            <CardContent>
              <MiniBarChart data={overview.bookingsByDay.map((d) => ({ label: d.day, value: d.count }))} barClassName="bg-primary" />
            </CardContent>
          </Card>

          {/* À valider */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Demandes à valider</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link href="/dashboard/bookings/pending">Tout voir <ArrowRight className="size-4" /></Link></Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingBookings.length === 0 ? (
                <EmptyState icon={CheckCircle2} title="Aucune demande en attente" description="Toutes les demandes ont été traitées. Beau travail !" />
              ) : (
                pendingBookings.map((b) => <BookingListItem key={b.id} booking={b} showRequester />)
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Planning du jour */}
          <Card>
            <CardHeader><CardTitle>Planning du jour</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {todayBookings.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Aucune activité programmée aujourd'hui.</p>
              ) : (
                todayBookings.map((b) => (
                  <Link key={b.id} href={`/dashboard/bookings/${b.id}`} className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted">
                    <span className="text-xs font-bold text-primary">{fmtRange(b.startAt, b.endAt).split("·")[1]?.trim() ?? ""}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{b.title || b.purpose}</span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Ressources populaires */}
          <Card>
            <CardHeader><CardTitle>Ressources les plus utilisées</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {overview.topResources.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Pas encore de données.</p>
              ) : (
                overview.topResources.map((r, i) => (
                  <div key={r.code}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="truncate font-semibold text-foreground">{i + 1}. {r.name}</span>
                      <span className="text-muted-foreground">{r.count}</span>
                    </div>
                    <Progress value={(r.count / overview.topResources[0].count) * 100} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Alertes */}
          {openIncidents > 0 && (
            <Card className="border-pending/30 bg-pending-soft/40">
              <CardContent className="flex items-center gap-3 py-4">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-pending-soft text-pending-fg"><AlertTriangle className="size-5" /></span>
                <div>
                  <p className="text-sm font-bold text-foreground">{openIncidents} incident(s) ouvert(s)</p>
                  <p className="text-xs text-muted-foreground">Des ressources nécessitent une intervention.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tableau de bord utilisateur demandeur                               */
/* ------------------------------------------------------------------ */
async function RequesterDashboard({ userId }: { userId: string }) {
  const { next, pendingCount, approvedCount, pastCount, recent, total } = await getPersonalOverview(userId);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Demandes en attente" value={pendingCount} icon={Clock} tone="pending" />
        <KpiCard label="Réservations validées" value={approvedCount} icon={CheckCircle2} tone="available" />
        <KpiCard label="Réservations passées" value={pastCount} icon={History} tone="neutral" />
        <KpiCard label="Total" value={total} icon={ClipboardList} tone="info" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* Prochaine réservation */}
          <Card className="overflow-hidden">
            <CardHeader><CardTitle>Votre prochaine réservation</CardTitle></CardHeader>
            <CardContent>
              {next ? (
                <Link href={`/dashboard/bookings/${next.id}`} className="block rounded-2xl border border-primary/20 bg-primary-50/50 p-5 transition hover:border-primary/40">
                  <div className="flex items-center justify-between">
                    <Badge tone="available" dot>Prochainement</Badge>
                    <span className="font-mono text-xs text-muted-foreground">{next.code}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-foreground">{next.title || next.purpose}</h3>
                  <p className="text-sm text-muted-foreground">{next.resource.name}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary">
                    <CalendarCheck2 className="size-4" /> {fmtRange(next.startAt, next.endAt)}
                  </div>
                </Link>
              ) : (
                <EmptyState
                  icon={CalendarDays}
                  title="Aucune réservation à venir"
                  description="Réservez une ressource pour la voir apparaître ici."
                  action={<Button asChild><Link href="/dashboard/bookings/new"><Plus className="size-4" /> Réserver maintenant</Link></Button>}
                />
              )}
            </CardContent>
          </Card>

          {/* Historique récent */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Activité récente</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link href="/dashboard/bookings/my">Tout voir <ArrowRight className="size-4" /></Link></Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recent.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Aucune réservation pour le moment.</p>
              ) : (
                recent.map((b) => <BookingListItem key={b.id} booking={b} />)
              )}
            </CardContent>
          </Card>
        </div>

        {/* Accès rapides */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Accès rapides</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <QuickLink href="/dashboard/bookings/new" icon={Plus} label="Nouvelle réservation" tone="text-available" />
              <QuickLink href="/dashboard/resources" icon={Boxes} label="Parcourir les ressources" tone="text-primary" />
              <QuickLink href="/dashboard/calendar" icon={CalendarDays} label="Voir le calendrier" tone="text-advanced" />
              <QuickLink href="/dashboard/bookings/my" icon={ClipboardList} label="Mes réservations" tone="text-pending" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function QuickLink({ href, icon: Icon, label, tone }: { href: string; icon: typeof Plus; label: string; tone: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-primary/30 hover:shadow-soft">
      <Icon className={`size-5 ${tone}`} />
      <span className="flex-1 text-sm font-semibold text-foreground">{label}</span>
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Bandeau Super Admin EduWeb                                          */
/* ------------------------------------------------------------------ */
async function SuperAdminSection() {
  const [orgs, users, bookings, resources] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.resource.count(),
  ]);
  return (
    <Card className="border-0 bg-advanced-night text-white shadow-glow">
      <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10"><Globe2 className="size-6" /></span>
          <div>
            <p className="font-bold">EduWeb Booking</p>
            <p className="text-sm text-white/70">Vue globale de toutes les organisations abonnées.</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[{ n: orgs, l: "Organisations", i: Building2 }, { n: users, l: "Utilisateurs", i: Users }, { n: resources, l: "Ressources", i: Boxes }, { n: bookings, l: "Réservations", i: CalendarDays }].map((k) => (
            <div key={k.l}>
              <p className="text-2xl font-extrabold">{k.n}</p>
              <p className="text-xs text-white/60">{k.l}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
