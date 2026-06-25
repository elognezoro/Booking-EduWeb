import Link from "next/link";
import { GraduationCap } from "lucide-react";

/**
 * Bouton flottant « Test de niveau CERTEL », mis en valeur (violet vif, distinct
 * du vert de la marque) sur la page d'accueil → mène au diagnostic gratuit.
 */
export function CertelFloatingCta() {
  return (
    <Link
      href="/certel/diagnostic"
      aria-label="Faire le test de niveau CERTEL (gratuit)"
      className="no-print group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-advanced px-5 py-3.5 font-bold text-white shadow-[0_10px_30px_-6px_rgba(109,93,245,0.6)] ring-4 ring-advanced/25 transition-all hover:-translate-y-0.5 hover:bg-advanced/90 hover:shadow-[0_14px_38px_-8px_rgba(109,93,245,0.7)] sm:bottom-6 sm:right-6"
    >
      <span className="relative flex size-6 items-center justify-center">
        <span className="absolute inline-flex size-6 animate-ping rounded-full bg-white/40" />
        <GraduationCap className="relative size-5" />
      </span>
      <span className="text-sm leading-tight">
        Test de niveau
        <span className="block text-[11px] font-semibold text-white/80">CERTEL · gratuit</span>
      </span>
    </Link>
  );
}
