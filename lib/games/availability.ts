import type { Tone } from "@/lib/enums";

/**
 * Disponibilité d'un jeu « Sport cérébral », réglée par l'administrateur système.
 * - PUBLIC        : ouvert à tous (aucune condition), y compris les visiteurs anonymes ;
 * - AUTH          : réservé aux utilisateurs connectés (condition = être connecté) ;
 * - SUBSCRIPTION  : réservé aux abonnés (condition = abonnement), suit la sélection « découverte » ;
 * - DISABLED      : indisponible (masqué du hub et bloqué en accès direct).
 */
export type GameAvailability = "PUBLIC" | "AUTH" | "SUBSCRIPTION" | "DISABLED";

export const GAME_AVAILABILITIES: GameAvailability[] = ["PUBLIC", "AUTH", "SUBSCRIPTION", "DISABLED"];

/** Par défaut, un jeu suit le verrouillage par abonnement (comportement historique). */
export const DEFAULT_AVAILABILITY: GameAvailability = "SUBSCRIPTION";

export interface AvailabilityMeta {
  label: string; // libellé court (badge, option)
  hint: string; // explication pour l'administrateur
  tone: Tone; // couleur du badge d'état
}

export const AVAILABILITY_META: Record<GameAvailability, AvailabilityMeta> = {
  PUBLIC: {
    label: "Ouvert à tous",
    hint: "Jouable par tout le monde, sans condition (y compris les visiteurs non connectés).",
    tone: "available",
  },
  AUTH: {
    label: "Connexion requise",
    hint: "Réservé aux utilisateurs connectés (un compte suffit, sans abonnement).",
    tone: "info",
  },
  SUBSCRIPTION: {
    label: "Abonnement requis",
    hint: "Réservé aux établissements abonnés ; les non-abonnés y accèdent via la sélection « découverte ».",
    tone: "pending",
  },
  DISABLED: {
    label: "Indisponible",
    hint: "Masqué du hub et bloqué en accès direct.",
    tone: "unavailable",
  },
};

/** Normalise une valeur quelconque vers une disponibilité valide (repli sur le défaut). */
export function normalizeAvailability(v: unknown): GameAvailability {
  return typeof v === "string" && (GAME_AVAILABILITIES as string[]).includes(v)
    ? (v as GameAvailability)
    : DEFAULT_AVAILABILITY;
}
