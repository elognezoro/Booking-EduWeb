import Link from "next/link";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCertelPricing, netAmount, levelToSlug, type CertelLevelKey } from "@/lib/certel/pricing";
import { hasCertelAccess } from "@/lib/certel/payment";

/**
 * Bandeau d'inscription affiché sur le hub d'un niveau CERTEL.
 * - Niveau gratuit (prix 0) → rien (les niveaux restent ouverts tant qu'aucun prix n'est défini).
 * - Inscrit (payé / gratuit déjà accordé) → confirmation.
 * - Sinon → prix + bouton « S'inscrire » vers la page de paiement.
 * Composant serveur async : lit la session (cookies) → rend le hub dynamique.
 */
export async function CertelEnrollBanner({ levelKey, accent }: { levelKey: CertelLevelKey; accent: string }) {
  const pricing = await getCertelPricing();
  const price = pricing.levels[levelKey];
  const net = netAmount(price, pricing.currency);
  if (net <= 0) return null;

  const user = await getCurrentUser();
  const access = await hasCertelAccess(user?.id, levelKey);
  const slug = levelToSlug(levelKey);
  const label = pricing.currency === "XOF" ? "FCFA" : pricing.currency;
  const hasDiscount = price.amount > 0 && price.discountPct > 0;

  if (access) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-available/40 bg-available-soft/50 px-5 py-4">
        <CheckCircle2 className="size-6 shrink-0 text-available-fg" />
        <p className="text-sm font-semibold text-foreground">Vous êtes inscrit à ce niveau — accès complet aux modules et à l'évaluation.</p>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}1a`, color: accent }}><Lock className="size-5" /></span>
        <div>
          <p className="font-bold text-foreground">Accès payant à ce niveau</p>
          <p className="text-sm text-muted-foreground">
            Frais d'inscription : <span className="font-bold" style={{ color: accent }}>{net.toLocaleString("fr-FR")} {label}</span>
            {hasDiscount && <span className="ml-1.5 rounded-full bg-available-soft px-2 py-0.5 text-xs font-bold text-available-fg">−{price.discountPct}%</span>}
            {" "}· Wave, Orange / MTN / Moov Money ou carte bancaire.
          </p>
        </div>
      </div>
      <Link href={`/certel/inscription/${slug}`} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: accent }}>
        S'inscrire <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
