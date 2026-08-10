import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Filter, Scale, ScrollText, Trash2, TrendingDown, TrendingUp, XCircle } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveFinanceScope } from "@/lib/finances/scope";
import { ENTRY_KINDS, ENTRY_SOURCES, PAYMENT_METHODS, type EntryKind, type PaymentMethod } from "@/lib/finances/constants";
import { fmtMoney } from "@/lib/money";
import { PageHeader } from "@/components/dashboard/page-header";
import { SpacePicker } from "@/components/finances/space-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function FinanceJournalPage({
  searchParams,
}: {
  searchParams: { espace?: string; saved?: string; deleted?: string; error?: string; [k: string]: string | undefined };
}) {
  const user = await requirePermission("finances.read");
  const scope = await resolveFinanceScope(user, searchParams.espace);

  if (scope === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-10 text-center">
            <span className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
              <ScrollText className="size-7" />
            </span>
            <h2 className="text-base font-bold text-foreground">Aucun espace financier accessible.</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Votre compte n'est rattaché à aucune sous-direction disposant d'un espace financier.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ----- Filtres (GET) : type, mode de paiement, mois -----
  const kind: EntryKind | null =
    searchParams.kind === "INCOME" || searchParams.kind === "EXPENSE" ? searchParams.kind : null;
  const method: PaymentMethod | null =
    searchParams.method && searchParams.method in PAYMENT_METHODS ? (searchParams.method as PaymentMethod) : null;
  let monthRange: { gte: Date; lt: Date } | null = null;
  let moisValue = "";
  const mois = /^(\d{4})-(\d{2})$/.exec(searchParams.mois ?? "");
  if (mois) {
    const y = Number(mois[1]);
    const mo = Number(mois[2]);
    if (mo >= 1 && mo <= 12) {
      monthRange = { gte: new Date(y, mo - 1, 1), lt: new Date(y, mo, 1) };
      moisValue = mois[0];
    }
  }

  // Cloisonnement STRICT : chaque requête inclut le filtre de l'espace courant.
  const where = {
    ...scope.filter,
    ...(kind && { kind }),
    ...(method && { method }),
    ...(monthRange && { date: monthRange }),
  };

  const [entries, sums] = await Promise.all([
    prisma.financeEntry.findMany({
      where,
      orderBy: { date: "desc" },
      take: 200,
    }),
    prisma.financeEntry.groupBy({ by: ["kind"], where, _sum: { amount: true } }),
  ]);

  const totalIncome = sums.find((s) => s.kind === "INCOME")?._sum.amount ?? 0;
  const totalExpense = sums.find((s) => s.kind === "EXPENSE")?._sum.amount ?? 0;
  const net = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/finances?espace=${encodeURIComponent(scope.space.key)}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Espace financier
      </Link>
      <PageHeader
        title="Journal recettes-dépenses"
        description="Consultation chronologique de toutes les écritures de l'espace sélectionné (lecture seule)."
        icon={
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <BookOpen className="size-6" />
          </span>
        }
        actions={<SpacePicker spaces={scope.spaces} current={scope.space.key} />}
      />

      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Enregistré.
        </div>
      )}
      {searchParams.deleted && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <Trash2 className="size-5" /> Supprimé.
        </div>
      )}
      {searchParams.error && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <XCircle className="size-5" /> Une erreur est survenue. Vérifiez votre saisie puis réessayez.
        </div>
      )}

      {/* ===================== FILTRES (GET) ===================== */}
      <Card>
        <CardContent className="py-5">
          <form method="get" className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input type="hidden" name="espace" value={scope.space.key} />
            <div>
              <Label htmlFor="kind">Type d'écriture</Label>
              <Select id="kind" name="kind" defaultValue={kind ?? ""}>
                <option value="">Tous</option>
                <option value="INCOME">Encaissements</option>
                <option value="EXPENSE">Dépenses</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="method">Mode de paiement</Label>
              <Select id="method" name="method" defaultValue={method ?? ""}>
                <option value="">Tous</option>
                {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="mois">Mois</Label>
              <Input id="mois" name="mois" type="month" defaultValue={moisValue} />
            </div>
            <Button type="submit" variant="secondary">
              <Filter className="size-4" /> Filtrer
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ===================== TOTAUX DU JEU FILTRÉ ===================== */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-available-soft text-available-fg">
              <TrendingUp className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Recettes</p>
              <p className="text-xl font-extrabold text-available-fg">{fmtMoney(totalIncome)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-unavailable-soft text-unavailable-fg">
              <TrendingDown className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Dépenses</p>
              <p className="text-xl font-extrabold text-unavailable-fg">{fmtMoney(totalExpense)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary">
              <Scale className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Solde</p>
              <p className={`text-xl font-extrabold ${net < 0 ? "text-unavailable-fg" : "text-foreground"}`}>{fmtMoney(net)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===================== JOURNAL ===================== */}
      {entries.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aucune écriture"
          description="Aucune écriture ne correspond aux filtres choisis dans cet espace financier."
        />
      ) : (
        <Card>
          <CardContent className="px-0 py-0 sm:px-0 sm:py-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">N°</th>
                    <th className="px-4 py-3">Libellé</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entries.map((e) => {
                    const k: EntryKind = e.kind === "EXPENSE" ? "EXPENSE" : "INCOME";
                    return (
                      <tr key={e.id} className="align-top">
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{DATE_FMT.format(e.date)}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">{e.number}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-foreground">{e.label}</span>
                          {e.thirdParty && <span className="block text-xs text-muted-foreground">{e.thirdParty}</span>}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <Badge tone={ENTRY_KINDS[k].tone}>{ENTRY_KINDS[k].label}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {e.method in PAYMENT_METHODS ? PAYMENT_METHODS[e.method as PaymentMethod] : e.method}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{ENTRY_SOURCES[e.source] ?? e.source}</td>
                        <td
                          className={`whitespace-nowrap px-4 py-3 text-right font-bold ${
                            k === "INCOME" ? "text-available-fg" : "text-unavailable-fg"
                          }`}
                        >
                          {k === "INCOME" ? "+" : "−"} {fmtMoney(e.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {entries.length === 200 && (
        <p className="text-xs text-muted-foreground">
          Affichage limité aux 200 écritures les plus récentes — affinez les filtres pour consulter le reste.
        </p>
      )}
    </div>
  );
}
