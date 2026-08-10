import Link from "next/link";
import {
  Wallet, Coins, Receipt, Scale, FileStack, AlertTriangle, ArrowRight, RefreshCw, Activity, PieChart,
} from "lucide-react";
import { requirePermission, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SpacePicker } from "@/components/finances/space-picker";
import { FinanceMonthlyChart, ExpenseDonut } from "@/components/finances/finance-chart";
import { resolveFinanceScope } from "@/lib/finances/scope";
import { getFinanceDashboard } from "@/lib/finances/stats";
import { ENTRY_KINDS, PAYMENT_METHODS, type EntryKind, type PaymentMethod } from "@/lib/finances/constants";
import { syncCertelFinance } from "@/app/actions/finances";
import { fmtMoney } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata = { title: "Finances · EduWeb Booking" };

export default async function FinancesDashboardPage({ searchParams }: { searchParams: { espace?: string; certel?: string } }) {
  const user = await requirePermission("finances.read");
  const scope = await resolveFinanceScope(user, searchParams.espace);

  if (!scope) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Finances"
          description="Espace financier de votre périmètre."
          icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Wallet className="size-6" /></span>}
        />
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Aucun espace financier accessible. Votre compte n'est rattaché à aucune sous-direction disposant d'un espace financier.
          </CardContent>
        </Card>
      </div>
    );
  }

  const [d, org] = await Promise.all([
    getFinanceDashboard(scope.filter),
    prisma.organization.findUnique({ where: { id: scope.organizationId }, select: { isPlatform: true } }),
  ]);
  const showCertelSync = !!org?.isPlatform && scope.space.departmentId === null && hasPermission(user, "platform.manage");
  const empty = d.totalIncome === 0 && d.totalExpense === 0 && d.invoiceCount === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finances"
        description={`Encaissements, dépenses, facturation et rapports — ${scope.space.label}.`}
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Wallet className="size-6" /></span>}
        actions={<SpacePicker spaces={scope.spaces} current={scope.space.key} />}
      />

      {searchParams.certel !== undefined && (
        <div className="rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          Synchronisation CERTEL : {searchParams.certel} encaissement(s) importé(s).
        </div>
      )}

      {/* Santé + KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-primary">{d.health}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Activity className="size-3.5" /> Santé globale</p>
          </div>
        </Card>
        <KpiCard label="Encaissé" value={fmtMoney(d.totalIncome)} icon={Coins} tone="available" />
        <KpiCard label="Dépenses" value={fmtMoney(d.totalExpense)} icon={Receipt} tone="unavailable" />
        <KpiCard label="Solde net" value={fmtMoney(d.net)} icon={Scale} tone={d.net >= 0 ? "available" : "unavailable"} />
        <KpiCard
          label="Reste à recouvrer"
          value={fmtMoney(d.unpaidTotal)}
          icon={FileStack}
          tone="pending"
          hint={d.recoveryRate !== null ? `Taux de recouvrement : ${d.recoveryRate} %` : "Aucune facture émise"}
        />
      </div>

      {/* Centre d'alertes */}
      {d.alerts.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-4 text-pending" /> Centre d'alertes ({d.alerts.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {d.alerts.map((a, i) => (
              <div key={i} className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-sm ${a.tone === "unavailable" ? "border-unavailable/30 bg-unavailable-soft" : "border-pending/30 bg-pending-soft"}`}>
                <span><span className="font-bold">{a.title}</span> — {a.detail}</span>
                <Button asChild variant="outline" size="sm"><Link href={`/dashboard/finances/facturation?espace=${scope.space.key}`}>Voir <ArrowRight className="size-4" /></Link></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {empty ? (
        <Card>
          <CardContent className="py-6">
            <EmptyState
              icon={Wallet}
              title="Espace financier vide"
              description={scope.canManage
                ? "Commencez par enregistrer un encaissement ou une dépense, ou émettez une première facture."
                : "Aucune écriture enregistrée pour le moment."}
              action={scope.canManage ? (
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild><Link href={`/dashboard/finances/encaissements?espace=${scope.space.key}`}><Coins className="size-4" /> Premier encaissement</Link></Button>
                  <Button asChild variant="outline"><Link href={`/dashboard/finances/parametres?espace=${scope.space.key}`}>Configurer caisses & catégories</Link></Button>
                </div>
              ) : undefined}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Courbe 12 mois + répartition des dépenses */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="size-4 text-primary" /> Évolution sur 12 mois</CardTitle></CardHeader>
              <CardContent><FinanceMonthlyChart data={d.months} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><PieChart className="size-4 text-primary" /> Répartition des dépenses</CardTitle></CardHeader>
              <CardContent>
                {d.expenseByCategory.length > 0 ? (
                  <ExpenseDonut data={d.expenseByCategory} />
                ) : (
                  <p className="py-10 text-center text-sm text-muted-foreground">Aucune dépense catégorisée.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Soldes par mode + derniers mouvements */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Soldes par mode de paiement</CardTitle></CardHeader>
              <CardContent className="space-y-2.5">
                {d.byMethod.map((m) => (
                  <div key={m.method} className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 text-sm last:border-0 last:pb-0">
                    <span className="font-medium text-foreground">{PAYMENT_METHODS[m.method as PaymentMethod]}</span>
                    <span className="flex items-center gap-3 font-semibold">
                      <span className="text-available-fg">+{fmtMoney(m.income)}</span>
                      <span className="text-unavailable-fg">−{fmtMoney(m.expense)}</span>
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Derniers mouvements</CardTitle>
                <Button asChild variant="ghost" size="sm"><Link href={`/dashboard/finances/journal?espace=${scope.space.key}`}>Journal complet <ArrowRight className="size-4" /></Link></Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {d.recentEntries.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Aucun mouvement enregistré.</p>
                ) : (
                  d.recentEntries.map((e) => (
                    <div key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm">
                      <span className="min-w-0">
                        <Badge tone={ENTRY_KINDS[e.kind as EntryKind]?.tone ?? "neutral"} className="mr-2">{ENTRY_KINDS[e.kind as EntryKind]?.label ?? e.kind}</Badge>
                        <span className="font-medium text-foreground">{e.label}</span>
                        <span className="ml-2 font-mono text-xs text-muted-foreground">{e.number}</span>
                      </span>
                      <span className={`shrink-0 font-bold ${e.kind === "INCOME" ? "text-available-fg" : "text-unavailable-fg"}`}>
                        {e.kind === "INCOME" ? "+" : "−"}{fmtMoney(e.amount)}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Synchronisation des recettes CERTEL (espace plateforme uniquement) */}
      {showCertelSync && (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Recettes CERTEL</span> — les paiements CinetPay confirmés sont comptabilisés
              automatiquement ; cet import rattrape l'historique éventuel.
            </p>
            <form action={syncCertelFinance}>
              <input type="hidden" name="espace" value={scope.space.key} />
              <Button type="submit" variant="outline" size="sm"><RefreshCw className="size-4" /> Synchroniser</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
