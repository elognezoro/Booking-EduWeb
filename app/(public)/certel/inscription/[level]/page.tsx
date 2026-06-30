import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, CreditCard, Smartphone, LogIn, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getCertelPricing, netAmount, slugToLevel, levelToSlug } from "@/lib/certel/pricing";
import { hasCertelAccess, reconcileCertelPayment, cinetpayConfigured } from "@/lib/certel/payment";
import { startCertelPayment } from "@/app/actions/certel-payment";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Inscription · CERTEL" };

const META: Record<string, { title: string; accent: string }> = {
  N1: { title: "Niveau 1 — Fondamentaux numériques, bureautiques & IA", accent: "#0891B2" },
  N2: { title: "Niveau 2 — Productivité numérique, contenus & IA appliquée", accent: "#6D5DF5" },
  N3: { title: "Niveau 3 — Ingénierie numérique, LMS avancé & IA", accent: "#0B5A45" },
};

function fmt(amount: number, currency: string): string {
  const label = currency === "XOF" ? "FCFA" : currency;
  return `${amount.toLocaleString("fr-FR")} ${label}`;
}

export default async function CertelInscriptionPage({ params, searchParams }: { params: { level: string }; searchParams: { tx?: string; error?: string } }) {
  const levelKey = slugToLevel(params.level);
  if (!levelKey) notFound();
  const slug = levelToSlug(levelKey);
  const meta = META[levelKey];

  const user = await getCurrentUser();
  const pricing = await getCertelPricing();
  const price = pricing.levels[levelKey];
  const net = netAmount(price, pricing.currency);
  const hasDiscount = price.amount > 0 && price.discountPct > 0;

  // Retour depuis CinetPay : on réconcilie le statut.
  let txStatus: "PAID" | "FAILED" | "PENDING" | "UNKNOWN" | null = null;
  if (searchParams.tx) txStatus = await reconcileCertelPayment(searchParams.tx);

  const access = await hasCertelAccess(user?.id, levelKey);

  return (
    <div className="formation-scope section py-10 sm:py-14" style={{ ["--certel-accent" as string]: meta.accent }}>
      <Link href={`/certel/${slug}`} className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-4" /> {meta.title.split(" — ")[0]}</Link>

      <div className="mx-auto max-w-xl">
        <header className="mb-6 text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl text-white shadow-soft" style={{ backgroundColor: meta.accent }}><ShieldCheck className="size-7" /></span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">Inscription au {meta.title.split(" — ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{meta.title.split(" — ")[1]}</p>
        </header>

        {searchParams.error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-unavailable/40 bg-unavailable-soft/50 px-4 py-3 text-sm font-medium text-unavailable-fg"><AlertTriangle className="mt-0.5 size-4 shrink-0" /> {searchParams.error}</div>
        )}
        {txStatus === "PENDING" && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-pending/40 bg-pending-soft/50 px-4 py-3 text-sm font-medium text-pending-fg"><Clock className="mt-0.5 size-4 shrink-0" /> Votre paiement est en cours de validation. Cette page se mettra à jour une fois la confirmation reçue.</div>
        )}
        {txStatus === "FAILED" && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-unavailable/40 bg-unavailable-soft/50 px-4 py-3 text-sm font-medium text-unavailable-fg"><AlertTriangle className="mt-0.5 size-4 shrink-0" /> Le paiement n'a pas abouti. Vous pouvez réessayer ci-dessous.</div>
        )}

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {/* Prix */}
          {net > 0 ? (
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Frais d'inscription</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight" style={{ color: meta.accent }}>{fmt(net, pricing.currency)}</p>
              {hasDiscount && (
                <p className="mt-1 text-sm text-muted-foreground"><span className="line-through">{fmt(price.amount, pricing.currency)}</span> <span className="ml-1 rounded-full bg-available-soft px-2 py-0.5 text-xs font-bold text-available-fg">−{price.discountPct}%</span></p>
              )}
            </div>
          ) : (
            <p className="text-center text-lg font-bold text-available-fg">Ce niveau est actuellement gratuit.</p>
          )}

          <div className="my-6 h-px bg-border" />

          {/* Actions selon l'état */}
          {access ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto size-9 text-available-fg" />
              <p className="mt-2 font-bold text-foreground">Vous êtes inscrit{net > 0 ? " et votre paiement est confirmé" : ""}.</p>
              <Button asChild className="mt-4" style={{ backgroundColor: meta.accent }}><Link href={`/certel/${slug}`}>Accéder aux modules</Link></Button>
            </div>
          ) : !user ? (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Connectez-vous pour vous inscrire et régler les frais.</p>
              <Button asChild className="mt-4"><Link href={`/login?callbackUrl=${encodeURIComponent(`/certel/inscription/${slug}`)}`}><LogIn className="size-4" /> Se connecter</Link></Button>
            </div>
          ) : (
            <form action={startCertelPayment} className="space-y-3">
              <input type="hidden" name="level" value={slug} />
              <p className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Smartphone className="size-4" style={{ color: meta.accent }} /> Mobile Money</span>
                <span className="inline-flex items-center gap-1.5"><CreditCard className="size-4" style={{ color: meta.accent }} /> Carte bancaire</span>
              </p>
              <Button type="submit" size="lg" className="w-full" style={{ backgroundColor: meta.accent }} disabled={!cinetpayConfigured()}>
                <CreditCard className="size-4" /> Payer {fmt(net, pricing.currency)} et m'inscrire
              </Button>
              {!cinetpayConfigured() && (
                <p className="text-center text-xs text-muted-foreground">Le paiement en ligne est en cours d'activation. Contactez l'administration pour finaliser votre inscription.</p>
              )}
              <p className="text-center text-xs text-muted-foreground">Paiement sécurisé via CinetPay. Vous serez redirigé puis ramené ici après confirmation.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
