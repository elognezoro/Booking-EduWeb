"use client";

import * as React from "react";

/**
 * Lecteur protégé : lecture à l'écran uniquement.
 * - Impression désactivée (CSS @media print + interception Ctrl/Cmd+P).
 * - Clic droit, sélection, copie et glisser désactivés.
 * - Barre d'outils du visualiseur PDF masquée (#toolbar=0).
 * - Filigrane d'identité (dissuasion + traçabilité).
 * NB : aucune technologie web ne peut empêcher une capture d'écran ou une photo de l'écran ;
 * le filigrane sert à tracer toute fuite.
 */
export function ProtectedReader({ fileUrl, watermark }: { fileUrl: string; watermark: string }) {
  React.useEffect(() => {
    const blockPrint = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", blockPrint, true);
    return () => window.removeEventListener("keydown", blockPrint, true);
  }, []);

  // Filigrane répété en diagonale.
  const tiles = Array.from({ length: 60 });

  // Injecté via dangerouslySetInnerHTML pour éviter un écart d'hydratation (échappement des guillemets/apostrophes).
  const printCss = `@media print {
    body * { visibility: hidden !important; }
    body::before {
      content: "Impression desactivee — lecture a l'ecran uniquement.";
      visibility: visible; position: fixed; inset: 0; display: flex;
      align-items: center; justify-content: center; padding: 3rem;
      font-size: 1.1rem; font-weight: 700; text-align: center;
    }
  }`;

  return (
    <div
      className="relative h-[78vh] w-full select-none overflow-hidden rounded-2xl border border-border bg-secondary/40"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      {/* Désactive l'impression de toute la page tant que le lecteur est monté */}
      <style dangerouslySetInnerHTML={{ __html: printCss }} />

      <iframe
        title="Lecteur de document"
        src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&view=FitH`}
        className="absolute inset-0 h-full w-full"
      />

      {/* Filigrane d'identité, par-dessus le contenu, non cliquable */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex flex-wrap content-start gap-x-16 gap-y-20 overflow-hidden p-6 opacity-[0.10]">
        {tiles.map((_, i) => (
          <span key={i} className="-rotate-[24deg] whitespace-nowrap text-sm font-bold text-foreground">
            {watermark}
          </span>
        ))}
      </div>
    </div>
  );
}
