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

// ————————————————————————————————————————————————————————————————
// Conditions de disponibilité liées au temps (période, plage horaire, jours)
// ————————————————————————————————————————————————————————————————

/**
 * Fenêtre de disponibilité d'un jeu. Toutes les bornes sont optionnelles ; une fenêtre vide
 * signifie « aucune restriction ». Les heures sont exprimées en **heure de Côte d'Ivoire (GMT)**.
 */
export interface GameSchedule {
  from?: string; // "AAAA-MM-JJTHH:mm" — début de la période (avant : « pas encore disponible »)
  to?: string; // "AAAA-MM-JJTHH:mm" — fin de la période (après : « terminé »)
  days?: number[]; // jours autorisés 0=dimanche … 6=samedi ; vide = tous les jours
  startTime?: string; // "HH:mm" — début de la plage horaire quotidienne
  endTime?: string; // "HH:mm" — fin de la plage horaire quotidienne
}

/** Jours de la semaine (lundi d'abord pour l'affichage ; valeurs = Date.getUTCDay). */
export const WEEKDAYS: { value: number; label: string; short: string }[] = [
  { value: 1, label: "Lundi", short: "Lun" },
  { value: 2, label: "Mardi", short: "Mar" },
  { value: 3, label: "Mercredi", short: "Mer" },
  { value: 4, label: "Jeudi", short: "Jeu" },
  { value: 5, label: "Vendredi", short: "Ven" },
  { value: 6, label: "Samedi", short: "Sam" },
  { value: 0, label: "Dimanche", short: "Dim" },
];

const DT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Nettoie/valide une fenêtre issue d'un formulaire ou du stockage. */
export function normalizeSchedule(raw: unknown): GameSchedule {
  const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: GameSchedule = {};
  if (typeof s.from === "string" && DT_RE.test(s.from)) out.from = s.from;
  if (typeof s.to === "string" && DT_RE.test(s.to)) out.to = s.to;
  if (typeof s.startTime === "string" && TIME_RE.test(s.startTime)) out.startTime = s.startTime;
  if (typeof s.endTime === "string" && TIME_RE.test(s.endTime)) out.endTime = s.endTime;
  if (Array.isArray(s.days)) {
    const days = [...new Set(s.days.map(Number).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort();
    if (days.length > 0 && days.length < 7) out.days = days; // 7 jours cochés = aucune restriction
  }
  return out;
}

export function scheduleIsEmpty(s: GameSchedule | null | undefined): boolean {
  return !s || (!s.from && !s.to && !s.startTime && !s.endTime && !(s.days && s.days.length));
}

const toUtc = (dtLocal: string): number => Date.parse(dtLocal + ":00Z"); // heure CI = UTC (GMT)
const toMins = (t: string): number => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

/**
 * Le jeu est-il ouvert à l'instant `now` ? (heure serveur = heure de Côte d'Ivoire, GMT).
 * Évalue en UTC pour être indépendant du fuseau du serveur.
 */
export function isWithinSchedule(s: GameSchedule | null | undefined, now: Date): boolean {
  if (scheduleIsEmpty(s)) return true;
  const sched = s as GameSchedule;
  const t = now.getTime();
  if (sched.from) { const f = toUtc(sched.from); if (!Number.isNaN(f) && t < f) return false; }
  if (sched.to) { const e = toUtc(sched.to); if (!Number.isNaN(e) && t > e) return false; }
  if (sched.days && sched.days.length && !sched.days.includes(now.getUTCDay())) return false;
  if (sched.startTime || sched.endTime) {
    const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
    const start = sched.startTime ? toMins(sched.startTime) : 0;
    const end = sched.endTime ? toMins(sched.endTime) : 24 * 60 - 1;
    if (start <= end) { if (mins < start || mins > end) return false; }
    else if (mins < start && mins > end) return false; // plage qui passe minuit
  }
  return true;
}

/** Description lisible d'une fenêtre (pour l'admin et les visiteurs). */
export function describeSchedule(s: GameSchedule | null | undefined): string {
  if (scheduleIsEmpty(s)) return "";
  const sched = s as GameSchedule;
  const fmt = (dt: string) => { const [d, tm] = dt.split("T"); const [y, mo, da] = d.split("-"); return `${da}/${mo}/${y} à ${tm}`; };
  const parts: string[] = [];
  if (sched.from && sched.to) parts.push(`du ${fmt(sched.from)} au ${fmt(sched.to)}`);
  else if (sched.from) parts.push(`à partir du ${fmt(sched.from)}`);
  else if (sched.to) parts.push(`jusqu'au ${fmt(sched.to)}`);
  if (sched.days && sched.days.length) parts.push(WEEKDAYS.filter((w) => sched.days!.includes(w.value)).map((w) => w.short).join(", "));
  if (sched.startTime || sched.endTime) parts.push(`de ${sched.startTime || "00:00"} à ${sched.endTime || "23:59"}`);
  return `${parts.join(" · ")} (heure de Côte d'Ivoire)`;
}
