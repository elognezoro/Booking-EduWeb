import "server-only";
import { prisma } from "@/lib/prisma";
import { earnedBadgeCodes, type BadgeStats } from "./badges";

export type BrainAttempt = {
  id: string;
  userId: string;
  gameSlug: string;
  level: string;
  success: boolean;
  score: number;
  durationSec: number;
  errors: number;
  createdAt: Date;
};

export function getUserAttempts(userId: string) {
  return prisma.brainSportAttempt.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export function badgeStatsFrom(attempts: BrainAttempt[]): BadgeStats {
  return {
    totalAttempts: attempts.length,
    sudokuSuccess: attempts.filter((a) => a.gameSlug === "sudoku" && a.success).length,
    distinctDays: new Set(attempts.map((a) => dayKey(a.createdAt))).size,
    hasFlawlessSuccess: attempts.some((a) => a.success && a.errors === 0),
    hasAdvancedSuccess: attempts.some((a) => a.success && a.level === "difficile"),
  };
}

export { earnedBadgeCodes };
