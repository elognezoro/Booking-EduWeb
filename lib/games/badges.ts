// Définitions des badges « Sport cérébral » (les badges obtenus sont stockés en base).

export interface BadgeDef {
  code: string;
  label: string;
  desc: string;
  icon: string; // clé d'icône lucide
  color: string;
}

export const BADGES: BadgeDef[] = [
  { code: "sudoku-10", label: "Maître du Sudoku", desc: "10 grilles de Sudoku terminées", icon: "Grid3x3", color: "#064B3A" },
  { code: "memoire-vive", label: "Mémoire vive", desc: "7 jours d'entraînement", icon: "CalendarCheck", color: "#6D5DF5" },
  { code: "sans-faute", label: "Concentration maximale", desc: "Un jeu réussi sans aucune erreur", icon: "Target", color: "#0D9488" },
  { code: "defi-avance", label: "Défi relevé", desc: "Réussite d'un niveau Avancé", icon: "Trophy", color: "#F97316" },
  { code: "perseverant", label: "Persévérant", desc: "20 parties jouées", icon: "Flame", color: "#DC2626" },
];

export function getBadge(code: string): BadgeDef | undefined {
  return BADGES.find((b) => b.code === code);
}

/** Statistiques minimales nécessaires à l'évaluation des badges. */
export interface BadgeStats {
  totalAttempts: number;
  sudokuSuccess: number;
  distinctDays: number;
  hasFlawlessSuccess: boolean;
  hasAdvancedSuccess: boolean;
}

/** Codes des badges mérités d'après les statistiques. */
export function earnedBadgeCodes(s: BadgeStats): string[] {
  const codes: string[] = [];
  if (s.sudokuSuccess >= 10) codes.push("sudoku-10");
  if (s.distinctDays >= 7) codes.push("memoire-vive");
  if (s.hasFlawlessSuccess) codes.push("sans-faute");
  if (s.hasAdvancedSuccess) codes.push("defi-avance");
  if (s.totalAttempts >= 20) codes.push("perseverant");
  return codes;
}
