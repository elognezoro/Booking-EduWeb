"use client";

import { Select } from "@/components/ui/input";
import { setGameAvailabilityAction } from "@/app/actions/brain-sport";
import { GAME_AVAILABILITIES, AVAILABILITY_META, type GameAvailability } from "@/lib/games/availability";

/**
 * Sélecteur de disponibilité d'un jeu (administrateur système).
 * Enregistre automatiquement au changement via l'action serveur.
 */
export function AvailabilitySelect({ slug, value }: { slug: string; value: GameAvailability }) {
  return (
    <form action={setGameAvailabilityAction} className="flex items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <label htmlFor={`avail-${slug}`} className="sr-only">Disponibilité de {slug}</label>
      <Select
        id={`avail-${slug}`}
        name="availability"
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-9 w-[190px] text-sm"
        aria-label="Disponibilité du jeu"
      >
        {GAME_AVAILABILITIES.map((mode) => (
          <option key={mode} value={mode}>
            {AVAILABILITY_META[mode].label}
          </option>
        ))}
      </Select>
      {/* Repli sans JavaScript : bouton d'enregistrement explicite. */}
      <noscript>
        <button type="submit" className="rounded-lg border border-border px-2 py-1 text-xs font-semibold">OK</button>
      </noscript>
    </form>
  );
}
