"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { DoorOpen, DoorClosed, Loader2, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openRoom, closeRoom } from "@/app/actions/room-attendance";

function ActionButton({ isOpen, locating, onClick }: { isOpen: boolean; locating: boolean; onClick: () => void }) {
  // useFormStatus : « pending » vrai pendant la server action uniquement, remis à
  // faux automatiquement après le redirect (le bouton ne reste jamais bloqué).
  const { pending } = useFormStatus();
  const busy = pending || locating;
  return (
    <Button type="button" size="sm" variant={isOpen ? "outline" : "default"} onClick={onClick} disabled={busy}>
      {busy ? (
        <><Loader2 className="size-4 animate-spin" /> {locating ? <><MapPin className="size-4" /> Position…</> : "Enregistrement…"}</>
      ) : isOpen ? (
        <><DoorClosed className="size-4" /> Fermer la salle</>
      ) : (
        <><DoorOpen className="size-4" /> Ouvrir la salle</>
      )}
    </Button>
  );
}

/**
 * Bouton « Ouvrir la salle » / « Fermer la salle » du surveillant. La position GPS
 * est OBLIGATOIRE (anti-fraude) : elle est captée automatiquement au clic et, si la
 * géolocalisation est refusée ou indisponible, l'action n'est PAS envoyée — un
 * message invite à l'activer puis à réessayer. Le serveur vérifie en plus que la
 * position tombe dans le périmètre institutionnel configuré.
 */
export function OpenCloseRoomButton({ roomId, isOpen }: { roomId: string; isOpen: boolean }) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [locating, setLocating] = React.useState(false);
  const [gpsError, setGpsError] = React.useState<string | null>(null);

  const submitWith = (coords: GeolocationCoordinates) => {
    const form = formRef.current;
    if (!form) return;
    (form.elements.namedItem("lat") as HTMLInputElement).value = String(coords.latitude);
    (form.elements.namedItem("lng") as HTMLInputElement).value = String(coords.longitude);
    (form.elements.namedItem("accuracy") as HTMLInputElement).value = String(coords.accuracy);
    form.requestSubmit();
  };

  const onClick = () => {
    if (locating) return;
    setGpsError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsError("Géolocalisation indisponible sur cet appareil : impossible d'enregistrer l'action.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocating(false); submitWith(pos.coords); },
      (err) => {
        setLocating(false);
        setGpsError(
          err.code === err.PERMISSION_DENIED
            ? "Position obligatoire : autorisez la géolocalisation dans votre navigateur, puis réessayez."
            : "Position introuvable pour le moment : rapprochez-vous d'une fenêtre ou activez le GPS, puis réessayez."
        );
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 }
    );
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <form ref={formRef} action={isOpen ? closeRoom : openRoom} className="inline-flex">
        <input type="hidden" name="roomId" value={roomId} />
        <input type="hidden" name="lat" defaultValue="" />
        <input type="hidden" name="lng" defaultValue="" />
        <input type="hidden" name="accuracy" defaultValue="" />
        <ActionButton isOpen={isOpen} locating={locating} onClick={onClick} />
      </form>
      {gpsError && (
        <p className="flex max-w-64 items-start gap-1 text-right text-xs font-semibold text-unavailable-fg">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" /> {gpsError}
        </p>
      )}
    </div>
  );
}
