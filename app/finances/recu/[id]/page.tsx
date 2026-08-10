import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, CheckCircle2, AlertTriangle } from "lucide-react";
import { requirePermission, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listFinanceSpaces } from "@/lib/finances/scope";
import { emailFinanceReceipt } from "@/app/actions/finances";
import { PAYMENT_METHODS, type PaymentMethod } from "@/lib/finances/constants";
import { amountToWordsFcfa } from "@/lib/finances/amount-words";
import { fmtMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GuidePrintActions } from "@/components/help/guide-print-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reçu de paiement · EduWeb Booking" };

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { sent?: string; error?: string };
}) {
  const user = await requirePermission("finances.read");
  const entry = await prisma.financeEntry.findUnique({ where: { id: params.id } });
  if (!entry || entry.kind !== "INCOME") notFound();

  // Cloisonnement : le reçu n'est visible que si l'espace de l'écriture fait partie
  // des espaces financiers accessibles à l'utilisateur.
  if (entry.organizationId !== user.organizationId) notFound();
  const spaces = await listFinanceSpaces(user);
  const spaceKey = entry.departmentId ?? "org";
  if (!spaces.some((s) => (s.departmentId ?? "org") === spaceKey)) notFound();
  const canManage = hasPermission(user, "finances.manage");

  const [org, dept, cashbox, category] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: entry.organizationId },
      select: { name: true, acronym: true, city: true, logoUrl: true },
    }),
    entry.departmentId
      ? prisma.department.findUnique({ where: { id: entry.departmentId }, select: { name: true, logoUrl: true } })
      : Promise.resolve(null),
    entry.cashboxId ? prisma.financeCashbox.findUnique({ where: { id: entry.cashboxId }, select: { name: true } }) : Promise.resolve(null),
    entry.categoryId ? prisma.financeCategory.findUnique({ where: { id: entry.categoryId }, select: { name: true } }) : Promise.resolve(null),
  ]);
  if (!org) notFound();

  const dateLong = entry.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const method = PAYMENT_METHODS[entry.method as PaymentMethod] ?? entry.method;
  const backHref = `/dashboard/finances/encaissements?espace=${encodeURIComponent(entry.departmentId ?? "org")}`;

  return (
    <div className="min-h-screen bg-secondary/20 p-6 sm:p-10">
      <style>{`@media print { @page { size: A4 portrait; margin: 14mm; } .no-print { display: none !important; } body { background: #fff; } }`}</style>

      {/* Barre d'actions (non imprimée) */}
      <div className="no-print mx-auto mb-4 flex max-w-3xl flex-wrap items-center justify-between gap-2">
        <Button asChild variant="ghost">
          <Link href={backHref}><ArrowLeft className="size-4" /> Encaissements</Link>
        </Button>
        <GuidePrintActions auto={false} />
      </div>

      {searchParams.sent && (
        <div className="no-print mx-auto mb-4 flex max-w-3xl items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> Reçu envoyé par e-mail.
        </div>
      )}
      {searchParams.error && (
        <div className="no-print mx-auto mb-4 flex max-w-3xl items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5" />
          {searchParams.error === "email" ? "Adresse e-mail invalide." : "L'envoi a échoué — vérifiez l'adresse et réessayez."}
        </div>
      )}

      {/* ===================== LE REÇU ===================== */}
      <div className="mx-auto max-w-3xl rounded-xl border-2 border-foreground/20 bg-white p-8 text-[#10231E] shadow-sm print:rounded-none print:border-black/40 print:shadow-none">
        {/* En-tête vertical centré : logo institution, nom, logo sous-direction, sous-direction + ville */}
        <div className="flex flex-col items-center gap-2 border-b-2 border-foreground/15 pb-5 text-center">
          {org.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.logoUrl} alt={org.name} className="size-20 rounded-lg border border-black/10 bg-white object-contain p-1" />
          )}
          <p className="text-lg font-extrabold uppercase leading-tight">{org.name}</p>
          {dept?.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dept.logoUrl} alt={dept.name} className="size-20 rounded-lg border border-black/10 bg-white object-contain p-1" />
          )}
          {dept && <p className="text-sm font-bold text-[#064B3A]">{dept.name}</p>}
          {org.city && <p className="text-xs text-black/60">{org.city}</p>}
        </div>

        {/* Titre + numéro d'identification */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-wide">REÇU</h1>
            <p className="mt-1 inline-block rounded-lg border border-[#064B3A]/30 bg-[#064B3A]/5 px-3 py-1 font-mono text-sm font-bold text-[#064B3A]">
              N° {entry.number}
            </p>
          </div>
          <p className="text-sm text-black/70">Date : <span className="font-semibold text-black">{dateLong}</span></p>
        </div>

        {/* Corps */}
        <dl className="mt-6 space-y-4 text-[15px]">
          <div className="flex flex-wrap gap-2 border-b border-dotted border-black/30 pb-2">
            <dt className="w-40 shrink-0 text-black/60">Reçu de</dt>
            <dd className="font-semibold">{entry.thirdParty || "—"}</dd>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-dotted border-black/30 pb-2">
            <dt className="w-40 shrink-0 text-black/60">La somme de</dt>
            <dd className="font-semibold">
              {amountToWordsFcfa(entry.amount)}{" "}
              <span className="whitespace-nowrap font-black">({fmtMoney(entry.amount, entry.currency)})</span>
            </dd>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-dotted border-black/30 pb-2">
            <dt className="w-40 shrink-0 text-black/60">Motif</dt>
            <dd className="font-semibold">
              {entry.label}
              {category?.name ? <span className="font-normal text-black/60"> — {category.name}</span> : null}
            </dd>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-dotted border-black/30 pb-2">
            <dt className="w-40 shrink-0 text-black/60">Mode de règlement</dt>
            <dd className="font-semibold">
              {method}
              {entry.reference ? <span className="font-normal text-black/60"> · pièce n° {entry.reference}</span> : null}
              {cashbox?.name ? <span className="font-normal text-black/60"> · {cashbox.name}</span> : null}
            </dd>
          </div>
        </dl>

        {/* Montant en évidence + signature */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div className="rounded-xl border-2 border-[#064B3A]/30 bg-[#064B3A]/5 px-5 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-black/60">Montant encaissé</p>
            <p className="text-2xl font-black text-[#064B3A]">{fmtMoney(entry.amount, entry.currency)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-black/70">
              Fait à {org.city || "—"}, le <span className="font-semibold text-black">{dateLong}</span>
            </p>
            <p className="mt-10 border-t border-black/40 px-8 pt-1 text-sm font-semibold">Le caissier / La caissière</p>
          </div>
        </div>

        <p className="mt-8 border-t border-black/10 pt-3 text-center text-[11px] text-black/50">
          Reçu N° {entry.number} — émis par {dept ? `${org.name} · ${dept.name}` : org.name} via EduWeb Booking.
          Ce numéro d'identification est unique et vérifiable dans le journal des encaissements.
        </p>
      </div>

      {/* Envoi par e-mail (non imprimé) */}
      {canManage && (
        <form
          action={emailFinanceReceipt}
          className="no-print mx-auto mt-5 flex max-w-3xl flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-4 py-3"
        >
          <input type="hidden" name="espace" value={entry.departmentId ?? "org"} />
          <input type="hidden" name="id" value={entry.id} />
          <Mail className="size-4 shrink-0 text-primary" />
          <span className="text-sm font-semibold text-foreground">Envoyer le reçu par e-mail :</span>
          <Input
            type="email"
            name="to"
            required
            defaultValue={entry.thirdPartyEmail ?? ""}
            placeholder="adresse@exemple.ci"
            className="h-9 w-64 flex-1"
            aria-label="Adresse e-mail du destinataire"
          />
          <Button type="submit" size="sm"><Mail className="size-4" /> Envoyer</Button>
          {entry.thirdPartyEmail && (
            <span className="w-full text-xs text-muted-foreground">
              Un reçu a déjà été adressé automatiquement à {entry.thirdPartyEmail} lors de l'enregistrement.
            </span>
          )}
        </form>
      )}
    </div>
  );
}
