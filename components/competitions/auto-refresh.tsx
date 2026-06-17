"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

/** Rafraîchit la page (re-rend les composants serveur) à intervalle régulier pour un suivi quasi temps réel. */
export function AutoRefresh({ seconds = 3 }: { seconds?: number }) {
  const router = useRouter();
  const [on, setOn] = React.useState(true);

  React.useEffect(() => {
    if (!on) return;
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds, on]);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      title={on ? "Mise à jour automatique active" : "Mise à jour en pause"}
    >
      <RefreshCw className={on ? "size-3.5 animate-spin" : "size-3.5"} /> {on ? "En direct" : "En pause"}
    </button>
  );
}
