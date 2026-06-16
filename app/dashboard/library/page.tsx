import Link from "next/link";
import {
  Library, FileStack, Clock, CheckCircle2, Eye, Download, BookMarked, Plus,
  Search, ClipboardCheck, ArrowRight, AlertTriangle, TrendingUp,
} from "lucide-react";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { getLibraryOverview } from "@/lib/library/stats";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MiniBarChart } from "@/components/dashboard/mini-bar-chart";
import { ActivityChart } from "@/components/statistics/charts";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentTypeIcon } from "@/components/library/document-type-icon";
import { DocumentStatusBadge } from "@/components/library/document-badges";
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "@/lib/library/enums";
import { fromNow } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function LibraryDashboardPage() {
  const user = await requirePermission("documents.read");
  await getCurrentUser();
  const o = await getLibraryOverview(user.organizationId ?? "");
  const canReview = user.permissions.has("documents.review");
  const canDeposit = user.permissions.has("documents.create");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bibliothèque numérique"
        description="Déposez, codifiez, validez et valorisez vos ressources documentaires."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Library className="size-6" /></span>}
        actions={
          <>
            <Button asChild variant="outline"><Link href="/dashboard/library/explore"><Search className="size-4" /> Explorer</Link></Button>
            {canDeposit && <Button asChild><Link href="/dashboard/library/deposit"><Plus className="size-4" /> Déposer</Link></Button>}
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Documents" value={o.total} icon={FileStack} tone="info" hint={`${o.published} publiés`} />
        <KpiCard label="En attente de validation" value={o.pending} icon={Clock} tone="pending" hint="À vérifier" />
        <KpiCard label="Consultations" value={o.consultations} icon={Eye} tone="advanced" />
        <KpiCard label="Téléchargements" value={o.downloads} icon={Download} tone="available" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div><CardTitle>Dépôts mensuels</CardTitle><p className="text-sm text-muted-foreground">6 derniers mois</p></div>
              <Badge tone="available"><TrendingUp className="size-3.5" /> {o.validated + o.published} validés</Badge>
            </CardHeader>
            <CardContent><ActivityChart data={o.monthly.map((m) => ({ day: m.label, count: m.value }))} /></CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Répartition par type</CardTitle></CardHeader>
              <CardContent>
                {o.byType.length ? <MiniBarChart data={o.byType.slice(0, 6).map((t) => ({ label: t.label, value: t.value }))} barClassName="bg-primary" /> : <Empty />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Répartition par domaine</CardTitle></CardHeader>
              <CardContent>
                {o.byDomain.length ? <MiniBarChart data={o.byDomain.slice(0, 6).map((t) => ({ label: t.label.slice(0, 6), value: t.value }))} barClassName="bg-advanced" /> : <Empty />}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Derniers dépôts</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link href="/dashboard/library/documents">Tout voir <ArrowRight className="size-4" /></Link></Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {o.latest.length === 0 ? (
                <EmptyState icon={BookMarked} title="Aucun document" description="Déposez votre première ressource documentaire." />
              ) : (
                o.latest.map((d) => (
                  <Link key={d.id} href={`/dashboard/library/documents/${d.id}`} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary/30 hover:bg-muted">
                    <DocumentTypeIcon type={d.documentType} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{d.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{DOCUMENT_TYPE_LABELS[d.documentType as DocumentType]} · {d.domain.name} · {fromNow(d.createdAt)}</p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {canReview && o.pending > 0 && (
            <Card className="border-pending/30 bg-pending-soft/30">
              <CardContent className="py-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-pending-soft text-pending-fg"><ClipboardCheck className="size-5" /></span>
                  <div><p className="font-bold text-foreground">{o.pending} dépôt(s) à vérifier</p><p className="text-xs text-muted-foreground">Validation documentaire en attente.</p></div>
                </div>
                <Button asChild className="mt-4 w-full"><Link href="/dashboard/library/review">Vérifier maintenant</Link></Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">État du fonds</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Stat label="Publiés" value={o.published} tone="available" />
              <Stat label="Validés" value={o.validated} tone="available" />
              <Stat label="Confidentiels" value={o.confidential} tone="unavailable" />
              <Stat label="Sous embargo" value={o.embargoed} tone="advanced" />
              <Stat label="Réservations" value={o.reservations} tone="info" />
              <Stat label="Emprunts en cours" value={o.loans} tone="info" />
            </CardContent>
          </Card>

          {(o.alerts.missingFile > 0 || o.alerts.incomplete > 0 || o.alerts.duplicates > 0) && (
            <Card className="border-pending/30">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-4 text-pending" /> Alertes</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {o.alerts.missingFile > 0 && <p className="text-muted-foreground">{o.alerts.missingFile} document(s) sans fichier</p>}
                {o.alerts.incomplete > 0 && <p className="text-muted-foreground">{o.alerts.incomplete} document(s) à métadonnées incomplètes</p>}
                {o.alerts.duplicates > 0 && <p className="text-muted-foreground">{o.alerts.duplicates} doublon(s) potentiel(s)</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Empty() {
  return <p className="py-8 text-center text-sm text-muted-foreground">Pas encore de données.</p>;
}
function Stat({ label, value, tone }: { label: string; value: number; tone: any }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <Badge tone={tone}>{value}</Badge>
    </div>
  );
}
