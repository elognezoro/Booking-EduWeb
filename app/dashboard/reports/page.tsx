import { FileDown, CalendarRange, Boxes, Tags, Building2, Users } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ReportExportPanel } from "@/components/reports/report-export-panel";

export const dynamic = "force-dynamic";

const REPORT_TYPES = [
  { icon: CalendarRange, t: "Par période", d: "Journalier, hebdomadaire, mensuel, trimestriel, annuel." },
  { icon: Boxes, t: "Par ressource", d: "Usage et occupation de chaque ressource." },
  { icon: Tags, t: "Par catégorie", d: "Répartition des réservations par catégorie." },
  { icon: Building2, t: "Par site / service", d: "Activité ventilée par site et service." },
  { icon: Users, t: "Par utilisateur", d: "Réservations par demandeur." },
  { icon: FileDown, t: "Par statut", d: "Validées, refusées, annulées, no-show." },
];

export default async function ReportsPage() {
  await requirePermission("reports.export");
  return (
    <div className="space-y-5">
      <PageHeader
        title="Rapports"
        description="Exportez vos données de réservation au format CSV ou PDF."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><FileDown className="size-6" /></span>}
      />
      <ReportExportPanel />
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Types de rapports disponibles</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPORT_TYPES.map((r) => (
            <Card key={r.t} className="card-hover">
              <CardContent className="flex items-start gap-3 py-5">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary"><r.icon className="size-5" /></span>
                <div>
                  <p className="font-bold text-foreground">{r.t}</p>
                  <p className="text-sm text-muted-foreground">{r.d}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
