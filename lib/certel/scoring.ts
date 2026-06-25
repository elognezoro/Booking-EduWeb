import "server-only";
import { AUTOPOS, QCM } from "./diagnostic";

// Corrigé QCM — index de la bonne réponse (0=A,1=B,2=C,3=D), par question.
// Source : onglet « Paramètres » de la grille CERTEL.
const QCM_ANSWERS = [1, 2, 0, 1, 2, 1, 0, 1, 1, 0, 2, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export interface CertelScores {
  autopos: number; // /30
  qcm: number; // /30
  online60: number; // /60 (partie en ligne : auto-positionnement + QCM)
  score100: number; // projeté /100 (provisoire, hors tâches pratiques évaluées par un formateur)
  correctCount: number;
}

/** Calcule les scores du diagnostic à partir des réponses (auto-positionnement 0–3 et choix QCM 0–3). */
export function computeScores(autoposValues: number[], qcmChoices: number[]): CertelScores {
  // Auto-positionnement : 30 items × 0–3 = /90, ramené à /30.
  const rawAuto = AUTOPOS.reduce((s, _item, i) => {
    const v = autoposValues[i];
    return s + (Number.isFinite(v) ? Math.max(0, Math.min(3, Math.round(v))) : 0);
  }, 0);
  const autopos = Math.round((rawAuto / (AUTOPOS.length * 3)) * 30);

  // QCM : 1 point par bonne réponse, /30.
  let correctCount = 0;
  for (let i = 0; i < QCM.length; i++) if (qcmChoices[i] === QCM_ANSWERS[i]) correctCount++;
  const qcm = correctCount;

  const online60 = autopos + qcm;
  const score100 = Math.round((online60 / 60) * 100);
  return { autopos, qcm, online60, score100, correctCount };
}

export interface QcmCorrection {
  index: number;
  chosen: number; // -1 si non répondu
  correct: number;
  ok: boolean;
}

/** Restitue, par question, le choix du répondant, la bonne réponse et la justesse. */
export function correctedQcm(choices: number[]): QcmCorrection[] {
  return QCM.map((_q, i) => {
    const chosen = Number.isInteger(choices?.[i]) ? choices[i] : -1;
    return { index: i, chosen, correct: QCM_ANSWERS[i], ok: chosen === QCM_ANSWERS[i] };
  });
}
