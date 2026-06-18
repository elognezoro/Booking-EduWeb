"use client";

import { useEffect, useRef } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

// Propose le bouton « Enregistrer en PDF ». Avec `auto` (par défaut), ouvre aussi
// automatiquement la boîte d'impression une fois la page chargée — pratique pour
// les guides courts ; on le désactive pour les documents longs lus aussi à l'écran.
export function GuidePrintActions({ auto = true }: { auto?: boolean }) {
  const printed = useRef(false);
  useEffect(() => {
    if (!auto || printed.current) return;
    printed.current = true;
    const t = setTimeout(() => window.print(), 700);
    return () => clearTimeout(t);
  }, [auto]);
  return (
    <Button onClick={() => window.print()} className="no-print">
      <Printer className="size-4" /> Enregistrer en PDF
    </Button>
  );
}
