import "server-only";
import { getCurrentUser, isSuperAdmin, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GAMES } from "./catalog";
import { getDailyChallenge } from "./daily";
import { getGamesGating } from "@/lib/platform/settings";

export type AccessReason = "admin" | "subscribed" | "anonymous" | "unsubscribed";
export interface GamesAccess {
  full: boolean;
  reason: AccessReason;
  organizationName: string | null;
}

/** Nombre de jeux offerts par défaut (rotation quotidienne) aux visiteurs sans abonnement. */
export const FREE_GAME_COUNT = 3;

/**
 * Accès aux jeux « Sport cérébral » selon l'abonnement :
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
  openAll: boolean; // tous les jeux ouverts (abonné, admin, ou verrouillage désactivé)
  freeSet: Set<string>; // jeux jouables sans abonnement (si !openAll)
}

/** Combine l'accès de l'utilisateur et les réglages de verrouillage de la plateforme. */
export async function getGamesGate(): Promise<GamesGate> {
  const access = await getGamesAccess();
  const gating = await getGamesGating();
  if (access.full || !gating.enabled) return { access, openAll: true, freeSet: new Set() };
  const daily = getDailyChallenge();
  const freeSet =
    gating.mode === "fixed"
      ? new Set<string>([daily.slug, ...gating.freeSlugs])
      : getFreeGameSlugs(GAMES.map((g) => g.slug), [daily.slug], new Date(), gating.freeCount);
  return { access, openAll: false, freeSet };
}

/** Accès à un jeu précis (utilisé par le hub et par chaque page de jeu pour bloquer les URL directes). */
export async function getGameAccess(slug: string): Promise<{ allowed: boolean; access: GamesAccess }> {
  const gate = await getGamesGate();
  return { allowed: gate.openAll || gate.freeSet.has(slug), access: gate.access };
}
