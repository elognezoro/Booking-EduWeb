"use client";

import * as React from "react";
import { MapPin, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Champs du périmètre géographique institutionnel : latitude/longitude du point de
 * référence (capturables en un clic depuis le campus) + rayon autorisé en mètres.
 * Ce périmètre rend le pointage d'ouverture/fermeture des salles infalsifiable :
 * hors zone, l'action est refusée.
 */
export function CampusPerimeterFields({ initial }: { initial: { lat: number | null; lng: number | null; radiusM: number | null } }) {
  const [lat, setLat] = React.useState(initial.lat != null ? String(initial.lat) : "");
  const [lng, setLng] = React.useState(initial.lng != null ? String(initial.lng) : "");
  const [locating, setLocating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const capture = () => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Géolocalisation indisponible sur cet appareil.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
      },
      (err) => {
        setLocating(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Autorisez la géolocalisation dans votre navigateur puis réessayez."
            : "Position introuvable pour le moment — réessayez."
        );
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  };

  const hasPoint = lat.trim() !== "" && lng.trim() !== "";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="campusLat">Latitude</Label>
          <Input id="campusLat" name="campusLat" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Ex. 5.3489" className="w-40" inputMode="decimal" />
        </div>
        <div>
          <Label htmlFor="campusLng">Longitude</Label>
          <Input id="campusLng" name="campusLng" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Ex. -3.9967" className="w-40" inputMode="decimal" />
        </div>
        <div>
          <Label htmlFor="campusRadiusM">Rayon autorisé (m)</Label>
          <Input id="campusRadiusM" name="campusRadiusM" type="number" min={50} max={5000} defaultValue={initial.radiusM ?? 300} className="w-36" />
        </div>
        <Button type="button" variant="outline" onClick={capture} disabled={locating}>
          {locating ? <><Loader2 className="size-4 animate-spin" /> Position…</> : <><MapPin className="size-4" /> Capturer ma position actuelle</>}
        </Button>
      </div>
      {error && (
        <p className="flex items-start gap-1 text-xs font-semibold text-unavailable-fg"><AlertCircle className="mt-0.5 size-3.5 shrink-0" /> {error}</p>
      )}
      <p className="text-xs text-muted-foreground">
        Placez-vous au centre du campus puis cliquez sur « Capturer ma position actuelle » (ou saisissez les coordonnées).
        Tant que le périmètre n'est pas défini, la position des surveillants est enregistrée mais la zone n'est pas contrôlée.
        Vider les deux champs désactive le périmètre.
        {hasPoint && (
          <>
            {" "}
            <a href={`https://www.google.com/maps?q=${encodeURIComponent(lat.replace(",", "."))},${encodeURIComponent(lng.replace(",", "."))}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold text-primary hover:underline">
              Vérifier sur la carte <ExternalLink className="size-3" />
            </a>
          </>
        )}
      </p>
    </div>
  );
}
