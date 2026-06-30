import Link from "next/link";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getCertelPricing, netAmount, levelToSlug, type CertelLevelKey } from "@/lib/certel/pricing";
import { canAccessCertelLevel } from "@/lib/certel/payment";

/**
 * Bandeau d'inscription affiché sur le hub d'un niveau CERTEL.
 * L'accès aux formations exige TOUJOURS une inscription (connexion + frais payés ou
 * inscription accordée par l'admin) : aucun accès libre, même sur un niveau gratuit.
 * - Inscrit (payé / gratuit accordé / admin) → confirmation.
 * - Sinon → invite à s'inscrire (payante si un prix est défini, sinon gratuite).
 * Composant serveur async : lit la session (cookies) → rend le hub dynamique.
 */
export async function CertelEnrollBanner({ levelKey, accent }: { levelKey: CertelLevelKey; accent: string }) {
  const pricing = await getCertelPricing();
  const price = pricing.levels[levelKey];
  const net = netAmount(price, pricing.currency);
  const user = await getCurrentUser();
  const access = await canAccessCertelLevel(user, levelKey);
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
          <p className="font-bold text-foreground">{net > 0 ? "Accès payant à ce niveau" : "Inscription requise pour accéder"}</p>
          {net > 0 ? (
            <p className="text-sm text-muted-foreground">
              Frais d'inscription : <span className="font-bold" style={{ color: accent }}>{net.toLocaleString("fr-FR")} {label}</span>
              {hasDiscount && <span className="ml-1.5 rounded-full bg-available-soft px-2 py-0.5 text-xs font-bold text-available-fg">−{price.discountPct}%</span>}
              {" "}· Orange, Moov, MTN Money, Wave ou CinetPay.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Ce niveau est gratuit, mais l'accès aux modules nécessite une inscription (connexion requise).</p>
          )}
        </div>
      </div>
      <Link href={`/certel/inscription/${slug}`} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: accent }}>
        {net > 0 ? "S'inscrire" : "S'inscrire gratuitement"} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
