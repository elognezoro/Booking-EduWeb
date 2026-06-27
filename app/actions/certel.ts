"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { computeScores } from "@/lib/certel/scoring";
import { levelForScore, type LevelKey } from "@/lib/certel/diagnostic";
import {
  PRACTICAL_TASKS,
  ACCEPTED_MIME,
  MAX_FILE_BYTES,
  consolidatePractical,
  type PracticalTask,
  type TaskEvaluation,
} from "@/lib/certel/practical";
import { evaluatePracticalTask, type PracticalSubmission } from "@/lib/certel/ai-eval";
import { stringifyJson } from "@/lib/json";

export interface CertelSubmitResult {
  ok: boolean;
  error?: string;
  id?: string; // identifiant de consultation des réponses
  scores?: { autopos: number; qcm: number; online60: number; score100: number };
  levelKey?: LevelKey;
}

/** Soumission publique du diagnostic de niveau CERTEL. Le score est calculé côté serveur. */
export async function submitCertelDiagnostic(input: {
  fullName: string;
  functionTitle?: string;
  structure?: string;
  contact?: string;
  autopos: number[];
  qcm: number[];
}): Promise<CertelSubmitResult> {
  const fullName = (input.fullName || "").trim();
  if (fullName.length < 2) return { ok: false, error: "Veuillez indiquer votre nom et prénom." };
  if (!Array.isArray(input.autopos) || !Array.isArray(input.qcm)) return { ok: false, error: "Réponses invalides." };

  const scores = computeScores(input.autopos, input.qcm);
  const level = levelForScore(scores.score100);

  let id: string | undefined;
  try {
    const row = await prisma.certelDiagnostic.create({
      data: {
        fullName,
        functionTitle: input.functionTitle?.trim() || null,
        structure: input.structure?.trim() || null,
        contact: input.contact?.trim() || null,
        autoposScore: scores.autopos,
        qcmScore: scores.qcm,
        online60: scores.online60,
        score100: scores.score100,
        levelKey: level.key,
        answers: stringifyJson({ autopos: input.autopos, qcm: input.qcm }),
      },
      select: { id: true },
    });
    id = row.id;
  } catch (e) {
    console.error("CERTEL diagnostic save failed", e);
    // On renvoie quand même le résultat à l'utilisateur même si l'enregistrement échoue.
  }

  return {
    ok: true,
    id,
    scores: { autopos: scores.autopos, qcm: scores.qcm, online60: scores.online60, score100: scores.score100 },
    levelKey: level.key,
  };
}

/** Supprime un ou plusieurs diagnostics CERTEL (réponses + évaluations) en une fois.
 * Réservé à l'administrateur système. */
export async function deleteCertelDiagnostics(input: { ids: string[] }) {
  await requirePermission("platform.manage");
  const ids = Array.isArray(input?.ids) ? input.ids.filter(Boolean) : [];
  if (ids.length === 0) return;
  await prisma.certelDiagnostic.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/dashboard/platform/certel");
}

// ——————————————————————————————————————————————————————————————
// Tâches pratiques (/40) — dépôt de fichiers + évaluation IA (Claude)
// ——————————————————————————————————————————————————————————————

const TEXT_MIME = new Set(["text/plain", "text/csv", "text/markdown"]);

function pendingEval(task: PracticalTask, justification: string, fileName?: string): TaskEvaluation {
  return { key: task.key, title: task.title, max: task.max, score: 0, verdict: "pending", justification, strengths: [], gaps: [], evaluatedBy: "pending", fileName };
}

function mimeFromName(name: string): string {
  const ext = name.toLowerCase().split(".").pop() || "";
  const map: Record<string, string> = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", txt: "text/plain", csv: "text/csv", md: "text/markdown" };
  return map[ext] || "";
}

/** Évalue UNE tâche pratique à partir du fichier déposé et/ou du texte saisi. */
export async function evaluateCertelTask(formData: FormData): Promise<TaskEvaluation> {
  const taskKey = String(formData.get("taskKey") || "");
  const task = PRACTICAL_TASKS.find((t) => t.key === taskKey);
  if (!task) return { key: taskKey, title: "Tâche inconnue", max: 0, score: 0, verdict: "pending", justification: "Tâche inconnue.", strengths: [], gaps: [], evaluatedBy: "pending" };

  const typedText = (formData.get("text") as string | null)?.trim() || "";
  const submission: PracticalSubmission = { text: typedText || undefined };

  const file = formData.get("file");
  if (file && typeof file !== "string" && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) return pendingEval(task, "Fichier trop volumineux (max 4 Mo). Compressez-le, exportez en PDF ou déposez une capture.", file.name);
    const mediaType = file.type && ACCEPTED_MIME.includes(file.type) ? file.type : mimeFromName(file.name);
    if (!ACCEPTED_MIME.includes(mediaType)) return pendingEval(task, "Format non pris en charge. Déposez un PDF, une image (capture) ou un fichier texte.", file.name);

    const buffer = Buffer.from(await file.arrayBuffer());
    if (TEXT_MIME.has(mediaType)) {
      const decoded = buffer.toString("utf-8").slice(0, 12000);
      submission.text = [typedText, decoded].filter(Boolean).join("\n\n");
    } else {
      submission.base64 = buffer.toString("base64");
      submission.mediaType = mediaType;
      submission.fileName = file.name;
    }
  }

  return evaluatePracticalTask(task, submission);
}

export interface FinalizePracticalResult {
  ok: boolean;
  error?: string;
  practicalScore?: number;
  total100?: number;
  tasksEvaluated?: number;
  complete?: boolean;
}

/** Enregistre les évaluations des tâches pratiques et consolide le score /100. */
export async function finalizeCertelPractical(input: { id: string; evaluations: TaskEvaluation[] }): Promise<FinalizePracticalResult> {
  const diag = await prisma.certelDiagnostic.findUnique({ where: { id: input.id }, select: { online60: true } });
  if (!diag) return { ok: false, error: "Diagnostic introuvable." };

  const evaluations = Array.isArray(input.evaluations) ? input.evaluations : [];
  const { practicalScore, total100, tasksEvaluated, complete } = consolidatePractical(evaluations, diag.online60);

  try {
    await prisma.certelDiagnostic.update({
      where: { id: input.id },
      data: {
        practicalScore,
        total100,
        practicalDetails: stringifyJson({ tasksEvaluated, complete, evaluations }),
        practicalEvaluatedAt: new Date(),
      },
    });
  } catch (e) {
    console.error("CERTEL practical finalize failed", e);
    return { ok: false, error: "Enregistrement impossible." };
  }

  return { ok: true, practicalScore, total100, tasksEvaluated, complete };
}
