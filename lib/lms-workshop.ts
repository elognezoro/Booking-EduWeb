/** Atelier (workshop) : phases, critères d'évaluation, calcul des notes. Module neutre. */
export type WorkshopPhase = "SETUP" | "SUBMISSION" | "ASSESSMENT" | "CLOSED";

export interface WorkshopCriterion { id: string; description: string; maxScore: number }

export interface WorkshopConfig {
  phase: WorkshopPhase;
  instructions: string; // HTML (consignes)
  criteria: WorkshopCriterion[];
  reviewsPerStudent: number; // nombre d'évaluations attribuées à chaque apprenant
}

export const DEFAULT_WORKSHOP_CONFIG: WorkshopConfig = {
  phase: "SETUP",
  instructions: "",
  criteria: [
    { id: "c1", description: "Qualité du contenu", maxScore: 10 },
    { id: "c2", description: "Clarté et présentation", maxScore: 10 },
  ],
  reviewsPerStudent: 2,
};

export const PHASE_ORDER: WorkshopPhase[] = ["SETUP", "SUBMISSION", "ASSESSMENT", "CLOSED"];
export const PHASE_LABEL: Record<WorkshopPhase, string> = {
  SETUP: "Préparation", SUBMISSION: "Remise des travaux", ASSESSMENT: "Évaluation par les pairs", CLOSED: "Résultats",
};

export function parseWorkshopConfig(json: string | null | undefined): WorkshopConfig {
  try {
    const parsed = json ? (JSON.parse(json) as Partial<WorkshopConfig>) : {};
    return {
      ...DEFAULT_WORKSHOP_CONFIG,
      ...parsed,
      criteria: Array.isArray(parsed.criteria) && parsed.criteria.length ? parsed.criteria : DEFAULT_WORKSHOP_CONFIG.criteria,
    };
  } catch {
    return { ...DEFAULT_WORKSHOP_CONFIG };
  }
}

/** Note maximale possible (somme des barèmes des critères). */
export function maxTotal(criteria: WorkshopCriterion[]): number {
  return criteria.reduce((s, c) => s + (Number(c.maxScore) || 0), 0);
}

/** Total d'une évaluation (somme des notes par critère, bornées au barème). */
export function assessmentTotal(scores: Record<string, unknown>, criteria: WorkshopCriterion[]): number {
  return criteria.reduce((s, c) => {
    const v = Number(scores?.[c.id]);
    if (!Number.isFinite(v)) return s;
    return s + Math.max(0, Math.min(c.maxScore, v));
  }, 0);
}

/** Note finale d'une remise (%) = moyenne des évaluations validées reçues. null si aucune. */
export function submissionGradePct(assessments: { scores: string; submitted: boolean }[], criteria: WorkshopCriterion[]): number | null {
  const done = assessments.filter((a) => a.submitted);
  if (!done.length) return null;
  const mt = maxTotal(criteria);
  if (mt <= 0) return null; // barème nul : aucune note calculable
  const avg = done.reduce((s, a) => {
    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(a.scores) as Record<string, unknown>; } catch { parsed = {}; }
    return s + assessmentTotal(parsed, criteria) / mt;
  }, 0) / done.length;
  return Math.round(avg * 100);
}
