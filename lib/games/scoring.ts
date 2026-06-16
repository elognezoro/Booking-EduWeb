// Calcul du score d'une partie de Sport cérébral.
import type { Level } from "./catalog";

const BASE: Record<Level, number> = { facile: 600, moyen: 1000, difficile: 1600 };

/** Score d'une partie réussie : base par niveau, pénalisée par le temps et les erreurs/coups. */
export function computeScore(level: Level, durationSec: number, errors: number, success: boolean): number {
  if (!success) return 0;
  const base = BASE[level] ?? 600;
  return Math.max(50, Math.round(base - durationSec - errors * 20));
}

export const LEVEL_LABEL: Record<Level, string> = { facile: "Débutant", moyen: "Intermédiaire", difficile: "Avancé" };
