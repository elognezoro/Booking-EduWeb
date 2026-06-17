import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { GAMES } from "./catalog";

export const COMPETITION_COOKIE = "eduweb_competition";

// Jeux éligibles aux compétitions (score comparable entre joueurs).
export const COMPETITION_SLUGS = ["calcul-mental", "logique", "attention", "culture-generale", "sudoku", "memoire"];
export const competitionGames = () => GAMES.filter((g) => COMPETITION_SLUGS.includes(g.slug));

/** Code de session lisible (sans caractères ambigus). */
export function genCompetitionCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

/** Participant courant (d'après le cookie de session), éventuellement filtré sur une compétition. */
export async function getMyParticipant(competitionId?: string) {
  const pid = cookies().get(COMPETITION_COOKIE)?.value;
  if (!pid) return null;
  const p = await prisma.competitionParticipant.findUnique({ where: { id: pid }, include: { competition: true } });
  if (!p) return null;
  if (competitionId && p.competitionId !== competitionId) return null;
  return p;
}

/**
 * Enregistre le résultat d'une partie pour le participant qui a rejoint une compétition (cookie).
 * Ne fait rien si pas de session, si la compétition est close, ou si le jeu ne correspond pas.
 * Conserve le MEILLEUR score.
 */
export async function recordCompetitionResult(gameSlug: string, score: number, durationSec: number, errors: number) {
  const pid = cookies().get(COMPETITION_COOKIE)?.value;
  if (!pid) return null;
  const p = await prisma.competitionParticipant.findUnique({ where: { id: pid }, include: { competition: true } });
  if (!p || p.competition.status === "CLOSED" || p.competition.gameSlug !== gameSlug) return null;
  const better = score > p.bestScore;
  await prisma.competitionParticipant.update({
    where: { id: pid },
    data: {
      attempts: { increment: 1 },
      finished: true,
      ...(better ? { bestScore: score, bestDuration: durationSec, errors } : {}),
    },
  });
  return { recorded: true, competitionId: p.competitionId };
}
