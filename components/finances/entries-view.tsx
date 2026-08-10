import Link from "next/link";
import { Coins, Receipt, Plus, Trash2, CheckCircle2, AlertTriangle, Wallet, ReceiptText } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { SpacePicker } from "@/components/finances/space-picker";
import { resolveFinanceScope } from "@/lib/finances/scope";
import { createFinanceEntry, deleteFinanceEntry } from "@/app/actions/finances";
import { PAYMENT_METHODS, PAYMENT_METHOD_KEYS, ENTRY_SOURCES, type EntryKind } from "@/lib/finances/constants";
import { fmtMoney } from "@/lib/money";

const COPY: Record<EntryKind, { title: string; description: string; new: string; empty: string; slug: string }> = {
  INCOME: {
    title: "Encaissements",
    description: "Recettes enregistrées dans cet espace : frais de service, locations, ventes, subventions…",
    new: "Nouvel encaissement",
    empty: "Aucun encaissement enregistré.",
    slug: "encaissements",
  },
  EXPENSE: {
    title: "Dépenses",
    description: "Dépenses de cet espace : achats, fournitures, prestations, charges…",
    new: "Nouvelle dépense",
    empty: "Aucune dépense enregistrée.",
    slug: "depenses",
  },
};

/** Page partagée des écritures (encaissements OU dépenses) d'un espace financier. */
export async function EntriesView({
  kind,
  searchParams,
}: {
  kind: EntryKind;
  searchParams: { espace?: string; saved?: string; deleted?: string; error?: string };
}) {
  const c = COPY[kind];
  const Icon = kind === "INCOME" ? Coins : Receipt;
  const user = await requirePermission("finances.read");
  const scope = await resolveFinanceScope(user, searchParams.espace);

  if (!scope) {
    return (
      <div className="space-y-6">
        <PageHeader title={c.title} description={c.description} icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Icon className="size-6" /></span>} />
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">
          Aucun espace financier accessible. Votre compte n'est rattaché à aucune sous-direction disposant d'un espace financier.
        </CardContent></Card>
      </div>
    );
  }

  const back = `/dashboard/finances/${c.slug}`;
  const [entries, cashboxes, categories] = await Promise.all([
    prisma.financeEntry.findMany({ where: { ...scope.filter, kind }, orderBy: { date: "desc" }, take: 100 }),
    prisma.financeCashbox.findMany({ where: { ...scope.filter, active: true }, orderBy: { name: "asc" } }),
    prisma.financeCategory.findMany({ where: { ...scope.filter, kind, active: true }, orderBy: { name: "asc" } }),
  ]);
  const cashboxName = new Map(cashboxes.map((x) => [x.id, x.name]));
  const categoryName = new Map(categories.map((x) => [x.id, x.name]));
  const total = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={c.title}
        description={`${c.description} — ${scope.space.label}.`}
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Icon className="size-6" /></span>}
        actions={<SpacePicker spaces={scope.spaces} current={scope.space.key} />}
      />

      {searchParams.saved && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Écriture enregistrée.
        </div>
      )}
      {searchParams.deleted && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Écriture supprimée.
        </div>
      )}
      {searchParams.error && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5" /> Opération impossible (saisie invalide ou élément d'un autre espace).
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Liste */}
        <Card className="overflow-hidden">
          <CardHeader><CardTitle className="text-base">{entries.length} écriture(s) · {fmtMoney(total)}</CardTitle></CardHeader>
          <div className="divide-y divide-border">
            {entries.length === 0 ? (
              <div className="px-5 py-8"><EmptyState icon={Wallet} title={c.empty} description={scope.canManage ? "Utilisez le formulaire pour enregistrer la première écriture." : undefined} /></div>
            ) : (
              entries.map((e) => (
                <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-muted-foreground">{e.number}</span>
                      <span className="font-semibold text-foreground">{e.label}</span>
                      {e.source !== "MANUAL" && <Badge tone="info">{ENTRY_SOURCES[e.source] ?? e.source}</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {e.date.toLocaleDateString("fr-FR")} · {PAYMENT_METHODS[e.method as keyof typeof PAYMENT_METHODS] ?? e.method}
                      {e.thirdParty ? ` · ${e.thirdParty}` : ""}
                      {e.cashboxId && cashboxName.has(e.cashboxId) ? ` · ${cashboxName.get(e.cashboxId)}` : ""}
                      {e.categoryId && categoryName.has(e.categoryId) ? ` · ${categoryName.get(e.categoryId)}` : ""}
                      {e.reference ? ` · pièce ${e.reference}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`font-bold ${kind === "INCOME" ? "text-available-fg" : "text-unavailable-fg"}`}>
                      {kind === "INCOME" ? "+" : "−"}{fmtMoney(e.amount)}
                    </span>
                    {kind === "INCOME" && (
                      <Button asChild variant="outline" size="sm" title="Ouvrir le reçu imprimable">
                        <Link href={`/finances/recu/${e.id}`} target="_blank"><ReceiptText className="size-4" /> Reçu</Link>
                      </Button>
                    )}
                    {scope.canManage && e.source !== "CERTEL" && (
                      <form action={deleteFinanceEntry}>
                        <input type="hidden" name="espace" value={scope.space.key} />
                        <input type="hidden" name="back" value={back} />
                        <input type="hidden" name="id" value={e.id} />
                        <Button type="submit" variant="ghost" size="icon-sm" title="Supprimer"><Trash2 className="size-4 text-unavailable" /></Button>
                      </form>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Saisie */}
        {scope.canManage && (
          <Card className="lg:sticky lg:top-20 lg:self-start">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" /> {c.new}</CardTitle></CardHeader>
            <CardContent>
              <form action={createFinanceEntry} className="space-y-3">
                <input type="hidden" name="espace" value={scope.space.key} />
                <input type="hidden" name="back" value={back} />
                <input type="hidden" name="kind" value={kind} />
                <div><Label htmlFor="label" required>Libellé</Label><Input id="label" name="label" required placeholder={kind === "INCOME" ? "Ex. Location salle A — atelier" : "Ex. Achat de fournitures"} /></div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div><Label htmlFor="amount" required>Montant (FCFA)</Label><Input id="amount" name="amount" type="number" min={1} required /></div>
                  <div><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></div>
                </div>
                <div>
                  <Label htmlFor="method">Mode de paiement</Label>
                  <Select id="method" name="method" defaultValue="CASH">
                    {PAYMENT_METHOD_KEYS.map((m) => <option key={m} value={m}>{PAYMENT_METHODS[m]}</option>)}
                  </Select>
                </div>
                {cashboxes.length > 0 && (
                  <div>
                    <Label htmlFor="cashboxId">Caisse / compte</Label>
                    <Select id="cashboxId" name="cashboxId" defaultValue="">
                      <option value="">— Sans caisse —</option>
                      {cashboxes.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                    </Select>
                  </div>
                )}
                {categories.length > 0 && (
                  <div>
                    <Label htmlFor="categoryId">Catégorie</Label>
                    <Select id="categoryId" name="categoryId" defaultValue="">
                      <option value="">— Sans catégorie —</option>
                      {categories.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                    </Select>
                  </div>
                )}
                <div><Label htmlFor="thirdParty">{kind === "INCOME" ? "Payeur" : "Bénéficiaire"}</Label><Input id="thirdParty" name="thirdParty" placeholder="Nom du tiers (facultatif)" /></div>
                {kind === "INCOME" && (
                  <div>
                    <Label htmlFor="thirdPartyEmail">E-mail du payeur</Label>
                    <Input id="thirdPartyEmail" name="thirdPartyEmail" type="email" placeholder="adresse@exemple.ci (facultatif)" />
                    <p className="mt-1 text-xs text-muted-foreground">Si renseigné, le reçu (avec son numéro) lui est envoyé automatiquement par e-mail.</p>
                  </div>
                )}
                <div><Label htmlFor="reference">N° de pièce</Label><Input id="reference" name="reference" placeholder="Réf. justificatif (facultatif)" /></div>
                <div><Label htmlFor="note">Note</Label><Textarea id="note" name="note" rows={2} /></div>
                <Button type="submit" className="w-full"><Plus className="size-4" /> Enregistrer</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
