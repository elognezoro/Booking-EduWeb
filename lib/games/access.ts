import "server-only";
import { getCurrentUser, isSuperAdmin, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GAMES } from "./catalog";
import { getDailyChallenge } from "./daily";
import { getEffectiveGame } from "./config";
import { getGamesGating } from "@/lib/platform/settings";
import { DEFAULT_AVAILABILITY, isWithinSchedule, describeSchedule, type GameAvailability, type GameSchedule } from "./availability";

export type AccessReason = "admin" | "subscribed" | "anonymous" | "unsubscribed";
/** Raison pour laquelle un jeu précis est verrouillé pour l'utilisateur courant. */
export type GameLockReason = "auth" | "subscription" | "disabled" | "schedule";
export interface GamesAccess {
  full: boolean;
  reason: AccessReason;
  organizationName: string | null;
  /** Renseigné uniquement pour un jeu verrouillé (voir getGameAccess). */
  lock?: GameLockReason;
  /** Précision affichée pour un blocage horaire (fenêtre de disponibilité). */
  lockNote?: string;
}

/** Nombre de jeux offerts par défaut (rotation quotidienne) aux visiteurs sans abonnement. */
export const FREE_GAME_COUNT = 3;

/**
 * Accès global de l'utilisateur aux jeux « Sport cérébral » selon l'abonnement :
 * - super administrateur / gestionnaire de plateforme → accès complet ;
 * - membre d'un établissement dont l'abonnement est ACTIF → accès complet ;
 * - visiteur anonyme ou établissement sans abonnement → sélection limitée.
 */
export async function getGamesAccess(): Promise<GamesAccess> {
  const user = await getCurrentUser();
  if (!user) return { full: false, reason: "anonymous", organizationName: null };
  if (isSuperAdmin(user) || hasPermission(user, "platform.manage"))
    return { full: true, reason: "admin", organizationName: user.organizationName };
  if (user.organizationId) {
    const sub = await prisma.subscription.findUnique({
      where: { organizationId: user.organizationId },
      select: { status: true },
    });
    if (sub?.status === "ACTIVE") return { full: true, reason: "subscribed", organizationName: user.organizationName };
  }
  return { full: false, reason: "unsubscribed", organizationName: user.organizationName };
}

/** Sélection déterministe (par date) des jeux offerts sans abonnement ; inclut toujours `forceInclude`. */
export function getFreeGameSlugs(
  allSlugs: string[],
  forceInclude: string[] = [],
  now: Date = new Date(),
  count: number = FREE_GAME_COUNT
): Set<string> {
  const date = now.toISOString().slice(0, 10);
  let s = (Number(date.replace(/-/g, "")) || 1) % 2147483647;
  if (s <= 0) s += 2147483646;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const arr = allSlugs.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const free = new Set<string>(forceInclude);
  for (const slug of arr) {
    if (free.size >= count) break;
    free.add(slug);
  }
  return free;
}

export interface GamesGate {
  access: GamesAccess;
  openAll: boolean; // tous les jeux « abonnement » ouverts (abonné, admin, ou verrouillage désactivé)
  freeSet: Set<string>; // jeux « abonnement » jouables sans abonnement (si !openAll)
}

/** Combine l'accès de l'utilisateur et les réglages de verrouillage par abonnement (pour les jeux SUBSCRIPTION). */
function computeGate(access: GamesAccess, gating: { enabled: boolean; mode: "random" | "fixed"; freeSlugs: string[]; freeCount: number }): GamesGate {
  if (access.full || !gating.enabled) return { access, openAll: true, freeSet: new Set() };
  const daily = getDailyChallenge();
  const freeSet =
    gating.mode === "fixed"
      ? new Set<string>([daily.slug, ...gating.freeSlugs])
      : getFreeGameSlugs(GAMES.map((g) => g.slug), [daily.slug], new Date(), gating.freeCount);
  return { access, openAll: false, freeSet };
}

export async function getGamesGate(): Promise<GamesGate> {
  const [access, gating] = await Promise.all([getGamesAccess(), getGamesGating()]);
  return computeGate(access, gating);
}

/**
 * Verrouillage d'un jeu selon SA disponibilité (réglée par l'admin) et l'état de l'utilisateur.
 * Retourne `null` si le jeu est jouable, sinon la raison du blocage.
 * (Les jeux DISABLED sont déjà exclus du hub ; ils renvoient tout de même "disabled" ici par sûreté.)
 */
export function gameLockReason(
  availability: GameAvailability,
  schedule: GameSchedule | null | undefined,
  gate: GamesGate,
  slug: string,
  now: Date = new Date()
): GameLockReason | null {
  if (availability === "DISABLED") return "disabled";
  // Fenêtre de temps : s'applique à tous, sauf à l'administrateur plateforme (qui peut prévisualiser).
  if (gate.access.reason !== "admin" && !isWithinSchedule(schedule, now)) return "schedule";
  if (availability === "PUBLIC") return null;
  if (availability === "AUTH") return gate.access.reason === "anonymous" ? "auth" : null;
  // SUBSCRIPTION : suit le verrouillage par abonnement + sélection découverte.
  return gate.openAll || gate.freeSet.has(slug) ? null : "subscription";
}

/** Accès à un jeu précis (utilisé par chaque page de jeu pour bloquer les URL directes). */
export async function getGameAccess(slug: string): Promise<{ allowed: boolean; access: GamesAccess }> {
  const game = await getEffectiveGame(slug);
  const availability: GameAvailability = game?.availability ?? DEFAULT_AVAILABILITY;
  const schedule = game?.schedule ?? null;
  const [access, gating] = await Promise.all([getGamesAccess(), getGamesGating()]);
  const gate = computeGate(access, gating);
  const lock = gameLockReason(availability, schedule, gate, slug);
  if (!lock) return { allowed: true, access };
  const lockNote = lock === "schedule" ? describeSchedule(schedule) : undefined;
  return { allowed: false, access: { ...access, lock, ...(lockNote ? { lockNote } : {}) } };
}
