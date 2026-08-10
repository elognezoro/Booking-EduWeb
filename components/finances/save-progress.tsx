"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Plus, Loader2, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EntryKind } from "@/lib/finances/constants";

/**
 * Bouton d'enregistrement d'une écriture avec visuel de progression :
 * pendant la soumission (état réel du formulaire via useFormStatus), une petite
 * animation « impression du reçu » + barre de progression + étape en cours
 * font patienter l'utilisateur. La progression s'achève à la redirection
 * (reçu produit → retour à la liste avec la bannière de confirmation).
 */
export function SaveEntryButton({ kind }: { kind: EntryKind }) {
  const { pending, data } = useFormStatus();
  const [pct, setPct] = React.useState(0);
  const emailing = pending && !!String(data?.get("thirdPartyEmail") ?? "").trim();
  const income = kind === "INCOME";

  React.useEffect(() => {
    if (!pending) {
      setPct(0);
      return;
    }
    // Progression simulée qui tend vers 94 % ; les 100 % = redirection (reçu produit).
    const id = setInterval(() => setPct((p) => Math.min(94, p + Math.max(0.8, (94 - p) * 0.07))), 110);
    return () => clearInterval(id);
  }, [pending]);

  const step =
    pct < 30
      ? "Enregistrement de l'écriture…"
      : pct < 55
        ? income ? "Attribution du numéro de reçu…" : "Numérotation de la pièce…"
        : pct < 80
          ? income ? "Production du reçu…" : "Finalisation…"
          : emailing
            ? "Envoi du reçu par e-mail au payeur…"
            : "Finalisation…";

  return (
    <div className="space-y-3">
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>

      {pending && (
        <div className="rounded-xl border border-primary/20 bg-primary-50/50 p-4" role="status" aria-live="polite">
          <style>{`@keyframes recu-print { 0% { transform: translateY(-85%); } 70% { transform: translateY(0); } 100% { transform: translateY(0); } }`}</style>

          {income && (
            <div className="mx-auto mb-3 w-24">
              {/* Fente de l'imprimante */}
              <div className="relative z-10 h-2 rounded-full bg-primary/80" />
              {/* Le reçu qui « sort » de l'imprimante */}
              <div className="overflow-hidden px-2 pt-0.5">
                <div
                  className="rounded-b-md border border-t-0 border-primary/30 bg-white px-2 py-1.5 shadow-sm"
                  style={{ animation: "recu-print 1.6s ease-in-out infinite" }}
                >
                  <ReceiptText className="mx-auto size-4 text-primary" />
                  <div className="mt-1 space-y-0.5">
                    <div className="h-0.5 rounded bg-primary/20" />
                    <div className="h-0.5 rounded bg-primary/20" />
                    <div className="h-0.5 w-2/3 rounded bg-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="h-2 overflow-hidden rounded-full bg-primary/10">
            <div className="h-full rounded-full bg-primary transition-all duration-200" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-center text-xs font-semibold text-primary-700">{step}</p>
        </div>
      )}
    </div>
  );
}
