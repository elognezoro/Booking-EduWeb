import Link from "next/link";
import {
  ArrowLeft,
  Receipt,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  PlusCircle,
  HandCoins,
  CalendarClock,
  Ban,
} from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveFinanceScope } from "@/lib/finances/scope";
import { INVOICE_STATUS, PAYMENT_METHODS, type InvoiceStatus } from "@/lib/finances/constants";
import { fmtMoney } from "@/lib/money";
import { createFinanceInvoice, settleFinanceInvoice, cancelFinanceInvoice } from "@/app/actions/finances";
import { PageHeader } from "@/components/dashboard/page-header";
import { SpacePicker } from "@/components/finances/space-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

const BACK = "/dashboard/finances/facturation";
const DATE_FMT = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

export default async function Page({
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
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Aucun espace financier accessible. Votre compte n'est rattaché à aucune sous-direction disposant d'un
            espace financier.
          </CardContent>
        </Card>
      </div>
    );
  }

  const invoices = await prisma.financeInvoice.findMany({
    where: { ...scope.filter },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // KPI — les factures annulées sont exclues des totaux.
  const active = invoices.filter((i) => i.status !== "CANCELLED");
  const billed = active.reduce((s, i) => s + i.amount, 0);
  const recovered = active.reduce((s, i) => s + Math.min(i.paidAmount, i.amount), 0);
  const remaining = Math.max(0, billed - recovered);
  const now = new Date();

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/finances?espace=${encodeURIComponent(scope.space.key)}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Finances
      </Link>
      <PageHeader
        title="Facturation interne"
        description="Frais à recouvrer auprès des redevables (usagers, services, partenaires) — espace cloisonné."
        icon={
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <Receipt className="size-6" />
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
          <AlertTriangle className="size-5" /> L'opération n'a pas pu être effectuée. Vérifiez les informations saisies.
        </div>
      )}

      {/* ===================== KPI RECOUVREMENT ===================== */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Total facturé</p>
          <p className="mt-1 text-xl font-extrabold text-foreground">{fmtMoney(billed)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Recouvré</p>
          <p className="mt-1 text-xl font-extrabold text-available-fg">{fmtMoney(recovered)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Reste à recouvrer</p>
          <p className={`mt-1 text-xl font-extrabold ${remaining > 0 ? "text-pending-fg" : "text-foreground"}`}>
            {fmtMoney(remaining)}
          </p>
        </div>
      </div>

      {/* ===================== NOUVELLE FACTURE ===================== */}
      {scope.canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PlusCircle className="size-4" /> Nouvelle facture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createFinanceInvoice} className="space-y-4">
              <input type="hidden" name="espace" value={scope.space.key} />
              <input type="hidden" name="back" value={BACK} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="debtorName" required>Redevable</Label>
                  <Input id="debtorName" name="debtorName" required maxLength={120} placeholder="Nom de la personne ou de la structure" />
                </div>
                <div>
                  <Label htmlFor="label" required>Objet</Label>
                  <Input id="label" name="label" required maxLength={200} placeholder="Ex. : location de salle, frais de dossier…" />
                </div>
                <div>
                  <Label htmlFor="amount" required>Montant (FCFA)</Label>
                  <Input id="amount" type="number" min={1} required name="amount" placeholder="Ex. : 25000" />
                </div>
                <div>
                  <Label htmlFor="dueDate">Échéance</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea id="note" name="note" rows={2} maxLength={500} placeholder="Précisions éventuelles (facultatif)" />
              </div>
              <Button type="submit">
                <PlusCircle className="size-4" /> Créer la facture
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ===================== LISTE DES FACTURES ===================== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="size-4" /> Factures de l'espace ({invoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Aucune facture"
              description="Aucun frais à recouvrer n'a encore été enregistré dans cet espace financier."
            />
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border">
              {invoices.map((inv) => {
                const status = (INVOICE_STATUS[inv.status as InvoiceStatus] ?? INVOICE_STATUS.PENDING);
                const open = inv.status === "PENDING" || inv.status === "PARTIAL";
                const rest = Math.max(0, inv.amount - inv.paidAmount);
                const overdue = open && !!inv.dueDate && inv.dueDate < now;
                return (
                  <div key={inv.id} className="space-y-3 px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-muted-foreground">{inv.number}</span>
                          <Badge tone={status.tone} dot>{status.label}</Badge>
                          {overdue && (
                            <Badge tone="unavailable" className="inline-flex items-center gap-1">
                              <CalendarClock className="size-3" /> Échéance dépassée
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 font-semibold text-foreground">{inv.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Redevable : <span className="font-medium text-foreground">{inv.debtorName}</span>
                          {inv.dueDate && (
                            <>
                              {" · "}Échéance :{" "}
                              <span className={overdue ? "font-semibold text-unavailable-fg" : undefined}>
                                {DATE_FMT.format(inv.dueDate)}
                              </span>
                            </>
                          )}
                        </p>
                        {inv.note && <p className="mt-0.5 text-xs text-muted-foreground">{inv.note}</p>}
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-right sm:gap-5">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Facturé</p>
                          <p className="text-sm font-bold text-foreground">{fmtMoney(inv.amount)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Payé</p>
                          <p className="text-sm font-bold text-available-fg">{fmtMoney(inv.paidAmount)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Reste</p>
                          <p className={`text-sm font-bold ${open && rest > 0 ? "text-pending-fg" : "text-foreground"}`}>
                            {fmtMoney(inv.status === "CANCELLED" ? 0 : rest)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {open && scope.canManage && (
                      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-secondary/30 p-3">
                        <form action={settleFinanceInvoice} className="flex flex-wrap items-end gap-2">
                          <input type="hidden" name="espace" value={scope.space.key} />
                          <input type="hidden" name="back" value={BACK} />
                          <input type="hidden" name="id" value={inv.id} />
                          <div>
                            <Label htmlFor={`amount-${inv.id}`} className="text-xs">Montant encaissé (FCFA)</Label>
                            <Input
                              id={`amount-${inv.id}`}
                              type="number"
                              min={1}
                              max={rest}
                              required
                              name="amount"
                              defaultValue={rest}
                              className="h-9 w-36 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`method-${inv.id}`} className="text-xs">Mode</Label>
                            <Select id={`method-${inv.id}`} name="method" className="h-9 w-40 text-sm" defaultValue="CASH">
                              {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`payerEmail-${inv.id}`} className="text-xs">E-mail du redevable (reçu auto)</Label>
                            <Input
                              id={`payerEmail-${inv.id}`}
                              type="email"
                              name="payerEmail"
                              placeholder="facultatif"
                              className="h-9 w-52 text-sm"
                            />
                          </div>
                          <Button type="submit" size="sm">
                            <HandCoins className="size-4" /> Encaisser
                          </Button>
                        </form>
                        <form action={cancelFinanceInvoice}>
                          <input type="hidden" name="espace" value={scope.space.key} />
                          <input type="hidden" name="back" value={BACK} />
                          <input type="hidden" name="id" value={inv.id} />
                          <Button type="submit" variant="ghost" size="sm" className="text-unavailable-fg">
                            <Ban className="size-4" /> Annuler la facture
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {invoices.length >= 100 && (
            <p className="mt-3 text-xs text-muted-foreground">Seules les 100 factures les plus récentes sont affichées.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
