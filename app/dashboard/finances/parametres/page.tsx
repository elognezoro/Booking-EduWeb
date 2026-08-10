import Link from "next/link";
import {
  ArrowLeft,
  Settings2,
  Landmark,
  Tags,
  Plus,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Info,
  WalletCards,
  Lightbulb,
  Rocket,
} from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveFinanceScope } from "@/lib/finances/scope";
import { CASHBOX_KINDS, type CashboxKind } from "@/lib/finances/constants";
import { CASHBOX_PRESETS, CATEGORY_PRESETS, remainingPresets } from "@/lib/finances/presets";
import { createFinanceCashbox, toggleFinanceCashbox, createFinanceCategory, toggleFinanceCategory } from "@/app/actions/finances";
import { PageHeader } from "@/components/dashboard/page-header";
import { SpacePicker } from "@/components/finances/space-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

const BACK = "/dashboard/finances/parametres";

export default async function Page({
  searchParams,
}: {
  searchParams: { espace?: string; saved?: string; deleted?: string; error?: string; [k: string]: string | undefined };
}) {
  const user = await requirePermission("finances.manage");
  const scope = await resolveFinanceScope(user, searchParams.espace);

  if (scope === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
              <WalletCards className="size-7" />
            </span>
            <h1 className="text-lg font-bold text-foreground">Aucun espace financier accessible.</h1>
            <p className="text-sm text-muted-foreground">
              Votre compte n'est rattaché à aucune sous-direction disposant d'un espace financier.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Cloisonnement strict : chaque requête inclut le filtre de l'espace courant.
  const [cashboxes, incomeCategories, expenseCategories] = await Promise.all([
    prisma.financeCashbox.findMany({ where: { ...scope.filter }, orderBy: { createdAt: "asc" } }),
    prisma.financeCategory.findMany({ where: { ...scope.filter, kind: "INCOME" }, orderBy: { name: "asc" } }),
    prisma.financeCategory.findMany({ where: { ...scope.filter, kind: "EXPENSE" }, orderBy: { name: "asc" } }),
  ]);

  const hiddenScope = (
    <>
      <input type="hidden" name="espace" value={scope.space.key} />
      <input type="hidden" name="back" value={BACK} />
    </>
  );

  const categoryBlocks: { kind: "INCOME" | "EXPENSE"; title: string; rows: typeof incomeCategories }[] = [
    { kind: "INCOME", title: "Catégories de recettes", rows: incomeCategories },
    { kind: "EXPENSE", title: "Catégories de dépenses", rows: expenseCategories },
  ];

  // Suggestions restantes (les exemples déjà créés dans cet espace ne sont plus proposés).
  const cashboxSuggestions = remainingPresets(CASHBOX_PRESETS, cashboxes.map((c) => c.name));
  const categorySuggestions = {
    INCOME: remainingPresets(CATEGORY_PRESETS.INCOME, incomeCategories.map((c) => c.name)),
    EXPENSE: remainingPresets(CATEGORY_PRESETS.EXPENSE, expenseCategories.map((c) => c.name)),
  };
  const setupIncomplete = cashboxes.length === 0 || incomeCategories.length + expenseCategories.length === 0;

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/finances?espace=${encodeURIComponent(scope.space.key)}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Finances
      </Link>
      <PageHeader
        title="Paramètres financiers"
        description="Caisses, comptes et catégories de recettes / dépenses de cet espace."
        icon={
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Settings2 className="size-6" />
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
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
          <AlertCircle className="size-5" /> Une erreur est survenue. Vérifiez la saisie puis réessayez.
        </div>
      )}

      {/* ===================== GUIDE DE DÉMARRAGE (tant que l'espace n'est pas configuré) ===================== */}
      {setupIncomplete && scope.canManage && (
        <Card className="border-primary/20 bg-primary-50/40">
          <CardContent className="space-y-3 py-5">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Rocket className="size-4 text-primary" /> Guide de démarrage — 3 étapes avec des exemples concrets
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Créez vos caisses &amp; comptes</strong> — là où l'argent entre et
                sort. Ex. : <em>« Caisse principale »</em> (espèces), <em>« Compte bancaire principal »</em>,{" "}
                <em>« Orange Money »</em> ou <em>« Wave »</em> (Mobile Money).
              </li>
              <li>
                <strong className="text-foreground">Créez vos catégories</strong> — pour classer les mouvements.
                Recettes : <em>« Scolarité &amp; inscriptions »</em>, <em>« Location de salles &amp; équipements »</em>,{" "}
                <em>« Subventions &amp; dotations »</em>… Dépenses : <em>« Fournitures de bureau »</em>,{" "}
                <em>« Eau &amp; électricité »</em>, <em>« Carburant &amp; déplacements »</em>…
              </li>
              <li>
                <strong className="text-foreground">Saisissez vos premières écritures</strong> — ex. un encaissement de{" "}
                <em>50 000 F</em> « Scolarité — KOUASSI Aya » en espèces dans « Caisse principale », ou une facture{" "}
                <em>« Location amphithéâtre — ONG Partenaire »</em> de <em>150 000 F</em> à recouvrer (réglable en
                plusieurs fois depuis la page Facturation).
              </li>
            </ol>
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" />
              Le plus rapide : cliquez sur les suggestions ci-dessous — chaque clic crée l'élément dans cet espace.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ===================== CAISSES & COMPTES ===================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="size-4" /> Caisses & comptes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cashboxes.length === 0 ? (
              <EmptyState
                icon={Landmark}
                title="Aucune caisse pour cet espace"
                description="Créez une première caisse ou un compte pour rattacher vos écritures."
                className="py-8"
              />
            ) : (
              <div className="divide-y divide-border rounded-xl border border-border">
                {cashboxes.map((box) => (
                  <div key={box.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{box.name}</span>
                      <Badge tone="info">{CASHBOX_KINDS[box.kind as CashboxKind] ?? box.kind}</Badge>
                      <Badge tone={box.active ? "available" : "neutral"} dot>
                        {box.active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    {scope.canManage && (
                      <form action={toggleFinanceCashbox}>
                        {hiddenScope}
                        <input type="hidden" name="id" value={box.id} />
                        <Button type="submit" size="sm" variant="outline">
                          {box.active ? "Désactiver" : "Réactiver"}
                        </Button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}

            {scope.canManage && cashboxSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  <Lightbulb className="size-3.5 text-primary" /> Suggestions — cliquez pour créer
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cashboxSuggestions.map((p) => (
                    <form key={p.name} action={createFinanceCashbox}>
                      {hiddenScope}
                      <input type="hidden" name="name" value={p.name} />
                      <input type="hidden" name="cashboxKind" value={p.kind} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary-50"
                      >
                        <Plus className="size-3" /> {p.name}
                        <span className="text-muted-foreground">· {CASHBOX_KINDS[p.kind]}</span>
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            )}

            {scope.canManage && (
              <form action={createFinanceCashbox} className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
                {hiddenScope}
                <p className="text-sm font-bold text-foreground">Nouvelle caisse ou nouveau compte</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cashbox-name" required>
                      Nom
                    </Label>
                    <Input id="cashbox-name" name="name" required maxLength={80} placeholder="Ex. Caisse principale" />
                  </div>
                  <div>
                    <Label htmlFor="cashbox-kind">Type</Label>
                    <Select id="cashbox-kind" name="cashboxKind" defaultValue="CASH">
                      {(Object.keys(CASHBOX_KINDS) as CashboxKind[]).map((k) => (
                        <option key={k} value={k}>
                          {CASHBOX_KINDS[k]}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <Button type="submit" size="sm">
                  <Plus className="size-4" /> Ajouter
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ===================== CATÉGORIES ===================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tags className="size-4" /> Catégories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {categoryBlocks.map(({ kind, title, rows }) => (
              <div key={kind} className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                  {title}
                  <Badge tone={kind === "INCOME" ? "available" : "unavailable"}>
                    {kind === "INCOME" ? "Recettes" : "Dépenses"}
                  </Badge>
                </p>
                {rows.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
                    Aucune catégorie pour l'instant.
                  </p>
                ) : (
                  <div className="divide-y divide-border rounded-xl border border-border">
                    {rows.map((cat) => (
                      <div key={cat.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-foreground">{cat.name}</span>
                          <Badge tone={cat.active ? "available" : "neutral"} dot>
                            {cat.active ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        {scope.canManage && (
                          <form action={toggleFinanceCategory}>
                            {hiddenScope}
                            <input type="hidden" name="id" value={cat.id} />
                            <Button type="submit" size="sm" variant="outline">
                              {cat.active ? "Désactiver" : "Réactiver"}
                            </Button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {scope.canManage && categorySuggestions[kind].length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {categorySuggestions[kind].map((name) => (
                      <form key={name} action={createFinanceCategory}>
                        {hiddenScope}
                        <input type="hidden" name="kind" value={kind} />
                        <input type="hidden" name="name" value={name} />
                        <button
                          type="submit"
                          title="Cliquez pour créer cette catégorie"
                          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary-50 hover:text-primary"
                        >
                          <Plus className="size-3" /> {name}
                        </button>
                      </form>
                    ))}
                  </div>
                )}
                {scope.canManage && (
                  <form action={createFinanceCategory} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    {hiddenScope}
                    <input type="hidden" name="kind" value={kind} />
                    <Input
                      name="name"
                      required
                      maxLength={80}
                      placeholder="Nouvelle catégorie"
                      aria-label={`Nouvelle catégorie — ${kind === "INCOME" ? "recettes" : "dépenses"}`}
                    />
                    <Button type="submit" size="sm" variant="outline" className="h-10">
                      <Plus className="size-4" /> Ajouter
                    </Button>
                  </form>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          Les caisses et les catégories ci-dessus appartiennent à <strong>cet espace financier uniquement</strong> (
          {scope.space.label}). Chaque espace — institution ou sous-direction — gère les siennes, sans aucun partage
          entre espaces.
        </span>
      </div>
    </div>
  );
}
