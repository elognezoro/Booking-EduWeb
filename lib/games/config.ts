import "server-only";
import { prisma } from "@/lib/prisma";
import { GAMES, type GameDef } from "./catalog";

export interface EffectiveGame extends GameDef {
  published: boolean;
  audioUrl: string | null;
  sortOrder: number;
}

/** Fusionne le catalogue (code) avec la configuration éditable (BDD) : publication, ordre, consigne, audio. */
export async function getEffectiveGames(opts?: { includeHidden?: boolean }): Promise<EffectiveGame[]> {
  const configs = await prisma.brainSportGameConfig.findMany();
  const bySlug = new Map(configs.map((c) => [c.slug, c]));
  const list: EffectiveGame[] = GAMES.map((g, i) => {
    const c = bySlug.get(g.slug);
    return {
      ...g,
      consigne: c?.consigne?.trim() ? c.consigne : g.consigne,
      published: c ? c.published : true,
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
