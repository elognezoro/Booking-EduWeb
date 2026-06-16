import { BarChart3, CalendarDays, Clock, Percent, CheckCircle2, XCircle, Ban, UserX, TrendingUp } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { getOrgOverview } from "@/lib/stats";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ActivityChart, StatusDonut, TopResourcesChart, CategoryDonut } from "@/components/statistics/charts";

export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  await requirePermission("statistics.read");
  const user = await getCurrentUser();
  const o = await getOrgOverview(user!.organizationId ?? "");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistiques & pilotage"
        description="Analysez l'usage de vos ressources et la performance des validations."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><BarChart3 className="size-6" /></span>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total réservations" value={o.totalBookings} icon={CalendarDays} tone="info" />
        <KpiCard label="Cette semaine" value={o.weekBookings} icon={TrendingUp} tone="available" />
        <KpiCard label="En attente" value={o.pending} icon={Clock} tone="pending" />
        <KpiCard label="Taux d'occupation" value={`${o.occupancyRate}%`} icon={Percent} tone="advanced" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Taux de validation" value={`${o.validationRate}%`} icon={CheckCircle2} tone="available" />
        <KpiCard label="Refusées" value={o.rejected} icon={XCircle} tone="unavailable" />
        <KpiCard label="Taux d'annulation" value={`${o.cancellationRate}%`} icon={Ban} tone="neutral" />
        <KpiCard label="Non honorées" value={o.noShow} icon={UserX} tone="unavailable" />
      </div>

      {o.totalBookings === 0 ? (
        <EmptyState icon={BarChart3} title="Pas encore de données" description="Les statistiques apparaîtront dès les premières réservations." />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Évolution des réservations</CardTitle>
              <p className="text-sm text-muted-foreground">14 derniers jours</p>
            </CardHeader>
            <CardContent><ActivityChart data={o.bookingsByDay} /></CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Répartition par statut</CardTitle></CardHeader>
              <CardContent><StatusDonut data={o.statusDistribution} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Répartition par catégorie</CardTitle></CardHeader>
              <CardContent>
                {o.byCategory.length ? <CategoryDonut data={o.byCategory} /> : <p className="py-10 text-center text-sm text-muted-foreground">Aucune donnée.</p>}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Ressources les plus réservées</CardTitle></CardHeader>
            <CardContent>
              {o.topResources.length ? <TopResourcesChart data={o.topResources.map((r) => ({ name: r.name, count: r.count }))} /> : <p className="py-10 text-center text-sm text-muted-foreground">Aucune donnée.</p>}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
