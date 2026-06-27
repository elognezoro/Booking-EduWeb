"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { TimerReset } from "lucide-react";

/**
 * Déconnexion automatique après inactivité (réglée par l'administrateur système).
 * Surveille l'activité (souris, clavier, défilement, tactile) ; affiche un avertissement
 * avec compte à rebours, puis déconnecte via /api/auth/clear.
 */
export function IdleLogout({ minutes }: { minutes: number }) {
  const totalMs = Math.max(0, minutes) * 60_000;
  const enabled = totalMs > 0;
  const warnMs = Math.min(60_000, Math.floor(totalMs / 2)); // avertir jusqu'à 60 s avant
  const lastActivity = React.useRef<number>(Date.now());
  const [remaining, setRemaining] = React.useState<number | null>(null); // ms avant déconnexion (quand avertissement affiché)
  const loggedOut = React.useRef(false);

  const reset = React.useCallback(() => {
    lastActivity.current = Date.now();
    setRemaining((r) => (r !== null ? null : r));
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click", "wheel"] as const;
    let throttle = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - throttle < 1000) return; // throttle des resets
      throttle = now;
      lastActivity.current = now;
      setRemaining((r) => (r !== null ? null : r)); // masque l'avertissement si activité
    };
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    const tick = setInterval(() => {
      if (loggedOut.current) return;
      const elapsed = Date.now() - lastActivity.current;
      const left = totalMs - elapsed;
      if (left <= 0) {
        loggedOut.current = true;
        clearInterval(tick);
        window.location.href = "/api/auth/clear?reason=inactivity";
      } else if (left <= warnMs) {
        setRemaining(left);
      }
    }, 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      clearInterval(tick);
    };
  }, [enabled, totalMs, warnMs]);

  if (!enabled || remaining === null) return null;
  const secs = Math.max(0, Math.ceil(remaining / 1000));

  return (
    <Modal open onClose={reset} title="Toujours là ?" description="Vous allez être déconnecté pour inactivité.">
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          Par mesure de sécurité, votre session se fermera dans <strong>{secs}</strong> seconde{secs > 1 ? "s" : ""}.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { window.location.href = "/api/auth/clear?reason=inactivity"; }}>Se déconnecter</Button>
          <Button onClick={reset}><TimerReset className="size-4" /> Rester connecté</Button>
        </div>
      </div>
    </Modal>
  );
}
