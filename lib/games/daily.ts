// Défi du jour : un jeu + un niveau choisis de façon déterministe selon la date.
import { GAMES, LEVELS, type Level } from "./catalog";

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  slug: string;
  title: string;
  href: string;
  level: Level;
  levelLabel: string;
}

export function getDailyChallenge(now: Date = new Date()): DailyChallenge {
  const date = now.toISOString().slice(0, 10);
  // graine déterministe à partir de la date
  const seed = Number(date.replace(/-/g, ""));
  const playable = GAMES.filter((g) => g.playable && g.href);
  const game = playable[seed % playable.length];
  const level = LEVELS[seed % LEVELS.length];
  return {
    date,
    slug: game.slug,
    title: game.title,
    href: `${game.href}?niveau=${level.key}`,
    level: level.key as Level,
    levelLabel: level.label,
  };
}
