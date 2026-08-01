import "server-only";
import { prisma } from "@/lib/prisma";
import { GAMES, type GameDef } from "./catalog";
import { getGamesAvailability } from "@/lib/platform/settings";
import { type GameAvailability } from "./availability";

export interface EffectiveGame extends GameDef {
  published: boolean; // dérivé : disponible = availability !== "DISABLED"
  availability: GameAvailability;
  audioUrl: string | null;
  sortOrder: number;
}

/** Fusionne le catalogue (code) avec la configuration éditable (BDD) : disponibilité, ordre, consigne, audio. */
export async function getEffectiveGames(opts?: { includeHidden?: boolean }): Promise<EffectiveGame[]> {
  const [configs, availMap] = await Promise.all([
    prisma.brainSportGameConfig.findMany(),
    getGamesAvailability(),
  ]);
  const bySlug = new Map(configs.map((c) => [c.slug, c]));
  const list: EffectiveGame[] = GAMES.map((g, i) => {
    const c = bySlug.get(g.slug);
    // Rétro-compat : si aucune disponibilité n'a été réglée, on la déduit de l'ancien indicateur `published`
    // (jeu masqué → DISABLED, sinon on garde le comportement historique via le défaut SUBSCRIPTION).
    const availability: GameAvailability = availMap[g.slug] ?? (c && c.published === false ? "DISABLED" : "SUBSCRIPTION");
    return {
      ...g,
      consigne: c?.consigne?.trim() ? c.consigne : g.consigne,
      availability,
      published: availability !== "DISABLED",
      audioUrl: c?.audioPath ? `/api/brain-audio/${g.slug}` : null,
      sortOrder: c?.sortOrder ?? i,
    };
  });
  const filtered = opts?.includeHidden ? list : list.filter((g) => g.published);
  return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getEffectiveGame(slug: string): Promise<EffectiveGame | undefined> {
  return (await getEffectiveGames({ includeHidden: true })).find((g) => g.slug === slug);
}
