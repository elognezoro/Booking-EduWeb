"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/logo";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-6 text-center">
      <BrandLogo />
      <span className="mt-8 inline-flex size-16 items-center justify-center rounded-2xl bg-unavailable-soft text-unavailable-fg">
        <AlertTriangle className="size-8" />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold text-foreground">Une erreur est survenue</h1>
      <p className="mt-2 max-w-md text-muted-foreground">Quelque chose s'est mal passé. Vous pouvez réessayer.</p>
      <Button className="mt-6" onClick={reset}><RotateCcw className="size-4" /> Réessayer</Button>
    </div>
  );
}
