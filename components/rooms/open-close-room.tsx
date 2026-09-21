"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { DoorOpen, DoorClosed, Loader2, MapPin } from "lucide-react";
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
 * Bouton « Ouvrir la salle » / « Fermer la salle » du surveillant : au clic, la
 * position GPS est captée automatiquement par le navigateur (avec accord de
 * l'utilisateur), puis l'action est horodatée côté serveur. Si la géolocalisation
 * est refusée ou indisponible, l'action passe quand même (position « non fournie »).
 */
export function OpenCloseRoomButton({ roomId, isOpen }: { roomId: string; isOpen: boolean }) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [locating, setLocating] = React.useState(false);

  const submitWith = (coords: GeolocationCoordinates | null) => {
    const form = formRef.current;
    if (!form) return;
    (form.elements.namedItem("lat") as HTMLInputElement).value = coords ? String(coords.latitude) : "";
    (form.elements.namedItem("lng") as HTMLInputElement).value = coords ? String(coords.longitude) : "";
    (form.elements.namedItem("accuracy") as HTMLInputElement).value = coords ? String(coords.accuracy) : "";
    form.requestSubmit();
  };

  const onClick = () => {
    if (locating) return;
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLocating(false); submitWith(pos.coords); },
        () => { setLocating(false); submitWith(null); },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
      );
    } else {
      submitWith(null);
    }
  };

  return (
    <form ref={formRef} action={isOpen ? closeRoom : openRoom} className="inline-flex">
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="lat" defaultValue="" />
      <input type="hidden" name="lng" defaultValue="" />
      <input type="hidden" name="accuracy" defaultValue="" />
      <ActionButton isOpen={isOpen} locating={locating} onClick={onClick} />
    </form>
  );
}
