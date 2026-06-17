"use server";

import { getCurrentUser, requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeScore } from "@/lib/games/scoring";
import { earnedBadgeCodes } from "@/lib/games/badges";
import { getUserAttempts, badgeStatsFrom } from "@/lib/games/stats";
import { getEffectiveGames } from "@/lib/games/config";
import { recordCompetitionResult } from "@/lib/games/competition";
import { saveGameAudio, deleteGameAudio } from "@/lib/games/audio-storage";
import { parseCsv, findColumn, normalizeKey } from "@/lib/csv";
import type { Level } from "@/lib/games/catalog";

export interface RecordResult {
  recorded: boolean;
  score?: number;
  newBadges?: string[];
  competition?: { recorded: boolean; competitionId: string };
}

const LEVELS: Level[] = ["facile", "moyen", "difficile"];

/**
 * Enregistre une partie terminée pour l'utilisateur connecté, calcule le score et décerne les
 * badges nouvellement mérités. Sans utilisateur connecté (jeu public anonyme), ne fait rien.
 */
export async function recordBrainAttempt(input: {
  gameSlug: string;
  level: string;
  success: boolean;
  durationSec: number;
  errors: number;
  points?: number; // score fourni par le jeu (ex. jeux chronométrés) ; sinon calculé côté serveur
}): Promise<RecordResult> {
  const level = (LEVELS.includes(input.level as Level) ? input.level : "facile") as Level;
  const durationSec = Math.max(0, Math.min(86400, Math.round(input.durationSec) || 0));
  const errors = Math.max(0, Math.min(9999, Math.round(input.errors) || 0));
  const success = !!input.success;
  const score =
    typeof input.points === "number"
      ? Math.max(0, Math.min(100000, Math.round(input.points)))
      : computeScore(level, durationSec, errors, success);

  // Compétition : si le joueur a rejoint une session (cookie), enregistre son résultat (même non connecté).
  const comp = await recordCompetitionResult(String(input.gameSlug), score, durationSec, errors);
  const competition = comp ?? undefined;

  const user = await getCurrentUser();
  if (!user) return { recorded: false, score, competition };

  await prisma.brainSportAttempt.create({
    data: { userId: user.id, gameSlug: String(input.gameSlug).slice(0, 40), level, success, score, durationSec, errors },
  });

  // Décerne les badges nouvellement mérités.
  const attempts = await getUserAttempts(user.id);
  const want = earnedBadgeCodes(badgeStatsFrom(attempts));
  const existing = await prisma.brainSportBadge.findMany({ where: { userId: user.id }, select: { code: true } });
  const have = new Set(existing.map((e) => e.code));
  const toAward = want.filter((c) => !have.has(c));
  for (const code of toAward) {
    await prisma.brainSportBadge.create({ data: { userId: user.id, code } }).catch(() => {});
  }

  return { recorded: true, score, newBadges: toAward, competition };
}

/* ----------------------------- Admin : banque de questions (super admin) ----------------------------- */
const ADMIN_PATH = "/dashboard/sport-cerebral/admin";

export async function createBrainQuestion(formData: FormData) {
  const user = await requirePermission("platform.manage");
  const level = (LEVELS.includes(String(formData.get("level")) as Level) ? String(formData.get("level")) : "facile") as Level;
  const prompt = String(formData.get("prompt") || "").trim();
  const choices = [0, 1, 2, 3].map((i) => String(formData.get(`choice${i}`) || "").trim());
  const answerIndex = Math.max(0, Math.min(3, Number(formData.get("answerIndex")) || 0));
  const explanation = String(formData.get("explanation") || "").trim() || null;

  if (prompt.length >= 3 && choices.every(Boolean)) {
    await prisma.brainSportQuestion.create({
      data: { gameSlug: "culture-generale", level, prompt, choices: JSON.stringify(choices), answerIndex, explanation, createdById: user.id },
    });
  }
  revalidatePath(ADMIN_PATH);
  redirect(ADMIN_PATH);
}

export async function toggleBrainQuestion(formData: FormData) {
  await requirePermission("platform.manage");
  const id = String(formData.get("id"));
  const q = await prisma.brainSportQuestion.findUnique({ where: { id } });
  if (q) await prisma.brainSportQuestion.update({ where: { id }, data: { active: !q.active } });
  revalidatePath(ADMIN_PATH);
  redirect(ADMIN_PATH);
}

export async function deleteBrainQuestion(formData: FormData) {
  await requirePermission("platform.manage");
  const id = String(formData.get("id"));
  await prisma.brainSportQuestion.delete({ where: { id } }).catch(() => {});
  revalidatePath(ADMIN_PATH);
  redirect(ADMIN_PATH);
}

/* ----------------------------- Admin : gestion des jeux (super admin) ----------------------------- */
const GAMES_ADMIN_PATH = "/dashboard/sport-cerebral/admin/jeux";

export async function toggleGamePublished(formData: FormData) {
  await requirePermission("platform.manage");
  const slug = String(formData.get("slug"));
  const games = await getEffectiveGames({ includeHidden: true });
  const g = games.find((x) => x.slug === slug);
  if (g) {
    await prisma.brainSportGameConfig.upsert({
      where: { slug }, create: { slug, published: !g.published, sortOrder: g.sortOrder }, update: { published: !g.published },
    });
  }
  revalidatePath(GAMES_ADMIN_PATH);
  redirect(GAMES_ADMIN_PATH);
}

export async function saveGameConsigne(formData: FormData) {
  await requirePermission("platform.manage");
  const slug = String(formData.get("slug"));
  const consigne = String(formData.get("consigne") || "").trim() || null;
  await prisma.brainSportGameConfig.upsert({ where: { slug }, create: { slug, consigne }, update: { consigne } });
  revalidatePath(GAMES_ADMIN_PATH);
  redirect(GAMES_ADMIN_PATH);
}

export async function moveGameOrder(formData: FormData) {
  await requirePermission("platform.manage");
  const slug = String(formData.get("slug"));
  const dir = String(formData.get("dir"));
  const games = await getEffectiveGames({ includeHidden: true });
  const idx = games.findIndex((g) => g.slug === slug);
  const nIdx = dir === "up" ? idx - 1 : idx + 1;
  if (idx >= 0 && nIdx >= 0 && nIdx < games.length) {
    const a = games[idx], b = games[nIdx];
    await prisma.brainSportGameConfig.upsert({ where: { slug: a.slug }, create: { slug: a.slug, sortOrder: b.sortOrder }, update: { sortOrder: b.sortOrder } });
    await prisma.brainSportGameConfig.upsert({ where: { slug: b.slug }, create: { slug: b.slug, sortOrder: a.sortOrder }, update: { sortOrder: a.sortOrder } });
  }
  revalidatePath(GAMES_ADMIN_PATH);
  redirect(GAMES_ADMIN_PATH);
}

export async function uploadGameAudio(formData: FormData) {
  await requirePermission("platform.manage");
  const slug = String(formData.get("slug"));
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const ext = (file.name.split(".").pop() || "mp3").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp3";
    const buf = Buffer.from(await file.arrayBuffer());
    const rel = await saveGameAudio(slug, buf, ext);
    await prisma.brainSportGameConfig.upsert({ where: { slug }, create: { slug, audioPath: rel }, update: { audioPath: rel } });
  }
  revalidatePath(GAMES_ADMIN_PATH);
  redirect(GAMES_ADMIN_PATH);
}

export async function removeGameAudio(formData: FormData) {
  await requirePermission("platform.manage");
  const slug = String(formData.get("slug"));
  const cfg = await prisma.brainSportGameConfig.findUnique({ where: { slug } });
  if (cfg?.audioPath) {
    await deleteGameAudio(cfg.audioPath);
    await prisma.brainSportGameConfig.update({ where: { slug }, data: { audioPath: null } });
  }
  revalidatePath(GAMES_ADMIN_PATH);
  redirect(GAMES_ADMIN_PATH);
}

/* ----------------------------- Admin : import CSV de questions ----------------------------- */
export async function importBrainQuestionsCsv(formData: FormData) {
  await requirePermission("platform.manage");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect(ADMIN_PATH + "?error=csv");
  let rows: string[][];
  try { rows = parseCsv(await (file as File).text()); } catch { redirect(ADMIN_PATH + "?error=csv"); }
  rows = rows!;
  if (rows.length < 2) redirect(ADMIN_PATH + "?error=csv");
  const header = rows[0];
  const col = {
    niveau: findColumn(header, ["niveau", "level"]),
    question: findColumn(header, ["question", "énoncé", "enonce", "prompt"]),
    c1: findColumn(header, ["choix1", "choix 1", "reponse1"]),
    c2: findColumn(header, ["choix2", "choix 2", "reponse2"]),
    c3: findColumn(header, ["choix3", "choix 3", "reponse3"]),
    c4: findColumn(header, ["choix4", "choix 4", "reponse4"]),
    bonne: findColumn(header, ["bonne", "bonne reponse", "réponse", "answer", "correct"]),
    exp: findColumn(header, ["explication", "explanation"]),
  };
  const levelMap: Record<string, Level> = { facile: "facile", debutant: "facile", moyen: "moyen", intermediaire: "moyen", difficile: "difficile", avance: "difficile" };
  let created = 0;
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const get = (idx: number) => (idx >= 0 ? (cells[idx] ?? "").trim() : "");
    const prompt = get(col.question);
    const choices = [get(col.c1), get(col.c2), get(col.c3), get(col.c4)];
    if (prompt.length < 3 || !choices.every(Boolean)) continue;
    const lvl = levelMap[normalizeKey(get(col.niveau))] ?? "facile";
    const answerIndex = Math.max(0, Math.min(3, (Number(get(col.bonne)) || 1) - 1));
    await prisma.brainSportQuestion.create({
      data: { gameSlug: "culture-generale", level: lvl, prompt, choices: JSON.stringify(choices), answerIndex, explanation: get(col.exp) || null },
    });
    created++;
  }
  revalidatePath(ADMIN_PATH);
  redirect(ADMIN_PATH + `?imported=${created}`);
}
