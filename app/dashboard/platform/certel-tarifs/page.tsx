import { CreditCard, CheckCircle2, Save, Tag, UserPlus, Receipt, AlertTriangle } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCertelPricing, netAmount, CERTEL_LEVELS } from "@/lib/certel/pricing";
import { cinetpayConfigured } from "@/lib/certel/payment";
import { saveCertelPricing, grantCertelAccess, revokeCertelAccess } from "@/app/actions/certel-payment";

export const dynamic = "force-dynamic";

const LEVEL_TITLE: Record<string, string> = { N1: "Niveau 1 — Fondamentaux", N2: "Niveau 2 — Intermédiaire", N3: "Niveau 3 — Avancé" };
const STATUS_BADGE: Record<string, string> = {
  PAID: "bg-available-soft text-available-fg", PENDING: "bg-pending-soft text-pending-fg",
  FAILED: "bg-unavailable-soft text-unavailable-fg", CANCELLED: "bg-secondary text-muted-foreground",
};

export default async function CertelTarifsPage({ searchParams }: { searchParams: { saved?: string; granted?: string; revoked?: string; error?: string } }) {
  await requirePermission("platform.manage");
  const pricing = await getCertelPricing();
  const payments = await prisma.certelPayment.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  const label = pricing.currency === "XOF" ? "FCFA" : pricing.currency;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title="Tarifs & inscriptions CERTEL"
        description="Conditionnez l'accès aux niveaux CERTEL par un paiement (Mobile Money / carte via CinetPay), avec remises paramétrables."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><CreditCard className="size-6" /></span>}
      />

      {searchParams.saved && <Flash ok>Tarifs enregistrés. Les niveaux reflètent les nouveaux prix.</Flash>}
      {searchParams.granted && <Flash ok>Accès accordé manuellement.</Flash>}
      {searchParams.revoked && <Flash ok>Accès révoqué.</Flash>}
      {searchParams.error === "user" && <Flash>Aucun utilisateur avec cet e-mail.</Flash>}
      {searchParams.error === "donnees" && <Flash>Renseignez un e-mail et un niveau valides.</Flash>}

      {!cinetpayConfigured() && (
        <div className="flex items-start gap-2 rounded-xl border border-pending/40 bg-pending-soft/40 px-4 py-3 text-sm text-pending-fg">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>Le paiement en ligne n'est pas encore actif : définissez <code className="font-mono font-bold">CINETPAY_API_KEY</code> et <code className="font-mono font-bold">CINETPAY_SITE_ID</code> dans les variables d'environnement (Vercel). En attendant, vous pouvez accorder les accès manuellement ci-dessous.</span>
        </div>
      )}

      {/* Tarifs */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Tag className="size-5 text-advanced-fg" /> Prix et remises par niveau</CardTitle></CardHeader>
        <CardContent>
          <form action={saveCertelPricing} className="space-y-4">
            <div className="max-w-[200px]">
              <Label htmlFor="currency">Devise</Label>
              <Input id="currency" name="currency" defaultValue={pricing.currency} maxLength={8} />
            </div>
            <div className="space-y-3">
              {CERTEL_LEVELS.map((lk) => {
                const p = pricing.levels[lk];
                const net = netAmount(p, pricing.currency);
                return (
                  <div key={lk} className="rounded-2xl border border-border bg-card p-4">
                    <p className="mb-2 font-bold text-foreground">{LEVEL_TITLE[lk]}</p>
                    <div className="flex flex-wrap items-end gap-4">
                      <div>
                        <Label htmlFor={`${lk}_amount`}>Prix ({label})</Label>
                        <Input id={`${lk}_amount`} name={`${lk}_amount`} type="number" min={0} step={pricing.currency === "XOF" ? 5 : 1} defaultValue={p.amount} className="max-w-[160px]" />
                      </div>
                      <div>
                        <Label htmlFor={`${lk}_discountPct`}>Remise (%)</Label>
                        <Input id={`${lk}_discountPct`} name={`${lk}_discountPct`} type="number" min={0} max={100} step={1} defaultValue={p.discountPct} className="max-w-[120px]" />
                      </div>
                      <p className="pb-2 text-sm text-muted-foreground">Net : <span className="font-bold text-foreground">{net > 0 ? `${net.toLocaleString("fr-FR")} ${label}` : "Gratuit"}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Un prix à <strong>0</strong> laisse le niveau <strong>gratuit</strong> (aucun paiement requis).</p>
            <Button type="submit" size="lg"><Save className="size-4" /> Enregistrer les tarifs</Button>
          </form>
        </CardContent>
      </Card>

      {/* Accès manuel */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="size-5 text-advanced-fg" /> Accorder un accès manuellement</CardTitle></CardHeader>
        <CardContent>
          <form action={grantCertelAccess} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <Label htmlFor="email">E-mail de l'apprenant</Label>
              <Input id="email" name="email" type="email" placeholder="apprenant@exemple.ci" required />
            </div>
            <div>
              <Label htmlFor="levelKey">Niveau</Label>
              <select id="levelKey" name="levelKey" className="block h-10 rounded-md border border-border bg-card px-3 text-sm">
                {CERTEL_LEVELS.map((lk) => <option key={lk} value={lk}>{lk}</option>)}
              </select>
            </div>
            <Button type="submit"><CheckCircle2 className="size-4" /> Accorder l'accès</Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">Utile pour un paiement hors-ligne (espèces, virement) ou une bourse. L'apprenant doit déjà avoir un compte.</p>
        </CardContent>
      </Card>

      {/* Journal */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="size-5 text-advanced-fg" /> Inscriptions & paiements (50 derniers)</CardTitle></CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune inscription pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3">Apprenant</th><th className="py-2 pr-3">Niveau</th><th className="py-2 pr-3">Montant</th><th className="py-2 pr-3">Statut</th><th className="py-2 pr-3">Date</th><th className="py-2"></th>
                </tr></thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-border/60">
                      <td className="py-2 pr-3 font-medium text-foreground">{p.fullName || "—"}{p.manual && <span className="ml-1.5 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">manuel</span>}</td>
                      <td className="py-2 pr-3">{p.levelKey}</td>
                      <td className="py-2 pr-3">{p.amount > 0 ? `${p.amount.toLocaleString("fr-FR")} ${p.currency === "XOF" ? "FCFA" : p.currency}` : "—"}</td>
                      <td className="py-2 pr-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_BADGE[p.status] || "bg-secondary"}`}>{p.status}</span></td>
                      <td className="py-2 pr-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td className="py-2">
                        {p.status === "PAID" && (
                          <form action={revokeCertelAccess}>
                            <input type="hidden" name="id" value={p.id} />
                            <button type="submit" className="text-xs font-semibold text-unavailable-fg hover:underline">Révoquer</button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Flash({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${ok ? "border-available/30 bg-available-soft text-available-fg" : "border-unavailable/40 bg-unavailable-soft text-unavailable-fg"}`}>
      {ok ? <CheckCircle2 className="size-5" /> : <AlertTriangle className="size-5" />} {children}
    </div>
  );
}
