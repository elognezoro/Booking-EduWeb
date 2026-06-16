"use client";

import { useEffect, useRef } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

// Ouvre automatiquement la boîte d'impression (« Enregistrer en PDF ») une fois la page chargée,
// et propose un bouton de repli.
export function GuidePrintActions() {
  const printed = useRef(false);
  useEffect(() => {
    if (printed.current) return;
    printed.current = true;
    const t = setTimeout(() => window.print(), 700);
    return () => clearTimeout(t);
  }, []);
  return (
    <Button onClick={() => window.print()} className="no-print">
      <Printer className="size-4" /> Enregistrer en PDF
    </Button>
  );
}
