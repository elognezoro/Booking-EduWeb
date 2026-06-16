import Link from "next/link";
import { BarChart3, FileStack, Eye, Download, BookMarked, CheckCircle2, Clock, Layers } from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { getLibraryOverview } from "@/lib/library/stats";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MiniBarChart } from "@/components/dashboard/mini-bar-chart";
import { ActivityChart, TopResourcesChart, CategoryDonut } from "@/components/statistics/charts";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentTypeIcon } from "@/components/library/document-type-icon";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@/lib/library/enums";

export const dynamic = "force-dynamic";

const PALETTE = ["#064B3A", "#0B5A45", "#22C55E", "#0891B2", "#6D5DF5", "#F97316", "#172554", "#DC2626"];

export default async function LibraryStatisticsPage() {
  const user = await requirePermission("library.statistics");
  await getCurrentUser();
  const o = await getLibraryOverview(user.organizationId ?? "");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistiques de la bibliothèque"
        description="Consultation, dépôts, validation et popularité des ressources."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><BarChart3 className="size-6" /></span>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Documents" value={o.total} icon={FileStack} tone="info" />
        <KpiCard label="Publiés" value={o.published} icon={CheckCircle2} tone="available" />
        <KpiCard label="En attente" value={o.pending} icon={Clock} tone="pending" />
        <KpiCard label="Réservations" value={o.reservations} icon={BookMarked} tone="advanced" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Consultations" value={o.consultations} icon={Eye} tone="info" />
        <KpiCard label="Téléchargements" value={o.downloads} icon={Download} tone="available" />
        <KpiCard label="Emprunts en cours" value={o.loans} icon={BookMarked} tone="advanced" />
        <KpiCard label="Domaines couverts" value={o.byDomain.length} icon={Layers} tone="neutral" />
      </div>

      {o.total === 0 ? (
        <EmptyState icon={BarChart3} title="Pas encore de données" description="Les statistiques apparaîtront dès les premiers dépôts." />
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle>Dépôts mensuels</CardTitle><p className="text-sm text-muted-foreground">6 derniers mois</p></CardHeader>
            <CardContent><ActivityChart data={o.monthly.map((m) => ({ day: m.label, count: m.value }))} /></CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Par type de document</CardTitle></CardHeader>
              <CardContent>
                <TopResourcesChart data={o.byType.map((t) => ({ name: DOCUMENT_TYPE_LABELS[t.label as DocumentType] ?? t.label, count: t.value }))} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Par domaine</CardTitle></CardHeader>
              <CardContent>
                <CategoryDonut data={o.byDomain.slice(0, 8).map((d, i) => ({ name: d.label, color: PALETTE[i % PALETTE.length], count: d.value }))} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Par année</CardTitle></CardHeader>
              <CardContent>
                {o.byYear.length ? <MiniBarChart data={o.byYear.map((y) => ({ label: y.label, value: y.value }))} barClassName="bg-primary" /> : <p className="py-8 text-center text-sm text-muted-foreground">Aucune donnée.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Documents les plus consultés</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {o.topConsulted.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Aucune consultation.</p> : o.topConsulted.map((d, i) => (
                  <Link key={d.id} href={`/dashboard/library/documents/${d.id}`} className="flex items-center gap-3 rounded-lg border border-border p-2.5 hover:bg-muted">
                    <span className="w-5 text-center text-sm font-bold text-muted-foreground">{i + 1}</span>
                    <DocumentTypeIcon type={d.documentType} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{d.title}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Eye className="size-3.5" /> {d.consultationCount}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
