"use server";

import { prisma } from "@/lib/prisma";
import { computeScores } from "@/lib/certel/scoring";
import { levelForScore, type LevelKey } from "@/lib/certel/diagnostic";
import { stringifyJson } from "@/lib/json";

export interface CertelSubmitResult {
  ok: boolean;
  error?: string;
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

  try {
    await prisma.certelDiagnostic.create({
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
    });
  } catch (e) {
    console.error("CERTEL diagnostic save failed", e);
    // On renvoie quand même le résultat à l'utilisateur même si l'enregistrement échoue.
  }

  return {
    ok: true,
    scores: { autopos: scores.autopos, qcm: scores.qcm, online60: scores.online60, score100: scores.score100 },
    levelKey: level.key,
  };
}
