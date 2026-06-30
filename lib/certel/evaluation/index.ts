import type { CertelEvaluation } from "./types";
import { EVAL_N1 } from "./niveau1";
import { EVAL_N2 } from "./niveau2";
import { EVAL_N3 } from "./niveau3";

export * from "./types";

const REGISTRY: Record<string, CertelEvaluation> = { N1: EVAL_N1, N2: EVAL_N2, N3: EVAL_N3 };

export function getCertelEvaluation(levelKey: string): CertelEvaluation | undefined {
  return REGISTRY[(levelKey || "").toUpperCase()];
}
