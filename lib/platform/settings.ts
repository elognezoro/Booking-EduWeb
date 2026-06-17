import "server-only";
import { prisma } from "@/lib/prisma";

export interface GamesGating {
  enabled: boolean; // le verrouillage par abonnement est-il actif ?
  freeCount: number; // nombre de jeux offerts (mode « rotation aléatoire »)
  mode: "random" | "fixed";
  freeSlugs: string[]; // jeux offerts (mode « fixe »)
}

const KEY = "games_gating";
export const GATING_DEFAULTS: GamesGating = { enabled: true, freeCount: 3, mode: "random", freeSlugs: [] };

export async function getGamesGating(): Promise<GamesGating> {
  const row = await prisma.platformSetting.findUnique({ where: { key: KEY } });
  if (!row) return GATING_DEFAULTS;
  try {
    const v = JSON.parse(row.value);
    return {
      enabled: typeof v.enabled === "boolean" ? v.enabled : GATING_DEFAULTS.enabled,
      freeCount: Number.isFinite(v.freeCount) ? Math.max(0, Math.min(20, Math.round(v.freeCount))) : GATING_DEFAULTS.freeCount,
      mode: v.mode === "fixed" ? "fixed" : "random",
      freeSlugs: Array.isArray(v.freeSlugs) ? v.freeSlugs.filter((s: unknown) => typeof s === "string") : [],
    };
  } catch {
    return GATING_DEFAULTS;
  }
}

export async function setGamesGating(g: GamesGating): Promise<void> {
  await prisma.platformSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, value: JSON.stringify(g) },
    update: { value: JSON.stringify(g) },
  });
}
