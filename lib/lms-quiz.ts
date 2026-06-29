import type { McqData, TrueFalseData, ShortAnswerData, NumericalData } from "./lms-questions";

/** Réglages d'un quiz + correction automatique + conditions de visibilité du corrigé. Module neutre. */
export interface QuizConfig {
  attempts: number; // 0 = illimité
  gradeMethod: "highest" | "last" | "average";
  shuffle: boolean; // mélange l'ordre des questions
  timeLimitMin: number; // 0 = pas de limite
  corrige: "immediate" | "afterAttempts" | "manual" | "never"; // quand le corrigé devient visible
  released: boolean; // pour corrige="manual" : l'enseignant a libéré le corrigé
  passing: number; // note de réussite (%)
}

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  attempts: 0, gradeMethod: "highest", shuffle: false, timeLimitMin: 0, corrige: "afterAttempts", released: false, passing: 50,
};

export function parseQuizConfig(json: string | null | undefined): QuizConfig {
  try {
    return { ...DEFAULT_QUIZ_CONFIG, ...(json ? (JSON.parse(json) as Partial<QuizConfig>) : {}) };
  } catch {
    return { ...DEFAULT_QUIZ_CONFIG };
  }
}

export const CORRIGE_LABEL: Record<QuizConfig["corrige"], string> = {
  immediate: "Immédiatement après la soumission",
  afterAttempts: "Après épuisement des tentatives",
  manual: "Lorsque l'enseignant le libère",
  never: "Jamais",
};
export const GRADE_METHOD_LABEL: Record<QuizConfig["gradeMethod"], string> = {
  highest: "Meilleure note", last: "Dernière tentative", average: "Moyenne des tentatives",
};

/** Note (fraction 0..1) d'UNE question selon la réponse fournie. CLOZE non auto-corrigé (renvoie 0). */
export function gradeOne(type: string, dataJson: string, answer: unknown): number {
  let data: unknown;
  try { data = JSON.parse(dataJson); } catch { return 0; }
  switch (type) {
    case "MCQ": {
      const d = data as McqData;
      const correct = new Set(d.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0));
      const sel = new Set((Array.isArray(answer) ? answer : []).map(Number));
      if (!d.multiple) return sel.size === 1 && correct.has([...sel][0]) ? 1 : 0;
      const nC = correct.size || 1;
      const nI = d.options.length - correct.size || 1;
      let f = 0;
      sel.forEach((i) => { f += correct.has(i) ? 1 / nC : -1 / nI; });
      return Math.max(0, Math.min(1, f));
    }
    case "TRUEFALSE": {
      const d = data as TrueFalseData;
      return typeof answer === "boolean" && answer === d.correct ? 1 : 0;
    }
    case "SHORTANSWER": {
      const d = data as ShortAnswerData;
      const norm = (s: string) => (d.caseSensitive ? s.trim() : s.trim().toLowerCase());
      const a = norm(String(answer ?? ""));
      let best = 0;
      for (const ans of d.answers) if (a && a === norm(ans.text)) best = Math.max(best, ans.grade / 100);
      return best;
    }
    case "NUMERICAL": {
      const d = data as NumericalData;
      const a = Number(answer);
      if (!Number.isFinite(a)) return 0;
      let best = 0;
      for (const ans of d.answers) if (Math.abs(a - ans.value) <= Math.abs(ans.tolerance)) best = Math.max(best, ans.grade / 100);
      return best;
    }
    default:
      return 0; // CLOZE : correction automatique prévue ultérieurement
  }
}

export interface GradedItem { questionId: string; fraction: number; mark: number; earned: number }

export function gradeAttempt(
  items: { questionId: string; type: string; data: string; mark: number }[],
  answers: Record<string, unknown>,
): { score: number; maxScore: number; per: GradedItem[] } {
  let score = 0, maxScore = 0;
  const per: GradedItem[] = [];
  for (const it of items) {
    const fraction = gradeOne(it.type, it.data, answers[it.questionId]);
    const earned = fraction * it.mark;
    score += earned;
    maxScore += it.mark;
    per.push({ questionId: it.questionId, fraction, mark: it.mark, earned: Math.round(earned * 100) / 100 });
  }
  return { score: Math.round(score * 100) / 100, maxScore, per };
}

/** Résumé lisible de la bonne réponse (pour le corrigé). */
export function correctAnswerText(type: string, dataJson: string): string {
  let data: unknown;
  try { data = JSON.parse(dataJson); } catch { return ""; }
  switch (type) {
    case "MCQ": { const d = data as McqData; return d.options.filter((o) => o.correct).map((o) => o.text).join(" ; ") || "—"; }
    case "TRUEFALSE": return (data as TrueFalseData).correct ? "Vrai" : "Faux";
    case "SHORTANSWER": { const d = data as ShortAnswerData; const best = d.answers.filter((a) => a.grade >= 100).map((a) => a.text); return (best.length ? best : d.answers.map((a) => a.text)).join(" ; ") || "—"; }
    case "NUMERICAL": { const d = data as NumericalData; return d.answers.map((a) => (a.tolerance ? `${a.value} (± ${a.tolerance})` : `${a.value}`)).join(" ; ") || "—"; }
    default: return "(voir l'énoncé)";
  }
}

/** Le corrigé (bonnes réponses + feedback) est-il visible pour cet utilisateur ? */
export function canSeeCorrige(config: QuizConfig, opts: { isTeacher: boolean; finished: boolean; attemptsRemaining: number }): boolean {
  if (opts.isTeacher) return true;
  if (!opts.finished) return false;
  switch (config.corrige) {
    case "immediate": return true;
    case "afterAttempts": return opts.attemptsRemaining <= 0;
    case "manual": return config.released;
    case "never": return false;
    default: return false;
  }
}
