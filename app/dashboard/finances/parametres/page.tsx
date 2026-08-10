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
} from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveFinanceScope } from "@/lib/finances/scope";
import { CASHBOX_KINDS, type CashboxKind } from "@/lib/finances/constants";
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
