import type { DragTextData, MatchingData, OrderingData } from "./lms-questions";

/** Exerciseurs avancés (glisser-déposer dans un texte, appariement, ordonnancement). Module neutre. */
const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();
function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

/* ---------------- Glisser-déposer dans un texte (DRAGTEXT) ---------------- */
export type DragTextSegment = { type: "text"; text: string } | { type: "gap"; index: number };

export function parseDragText(text: string): DragTextSegment[] {
  const segs: DragTextSegment[] = [];
  const re = /\[\[(\d+)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segs.push({ type: "text", text: text.slice(last, m.index) });
    segs.push({ type: "gap", index: parseInt(m[1], 10) });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ type: "text", text: text.slice(last) });
  return segs;
}

export function gradeDragText(data: DragTextData, answer: unknown): number {
  // Note par TROU réellement présent dans le texte : le trou [[k]] attend answers[k-1]
  // (robuste aux indices non séquentiels ou à un nombre de trous ≠ du nombre de réponses).
  const gaps = parseDragText(data.text).flatMap((s) => (s.type === "gap" ? [s.index] : []));
  const total = gaps.length;
  if (!total) return 0;
  const ans = (answer && typeof answer === "object" ? answer : {}) as Record<string, unknown>;
  let correct = 0;
  for (const idx of gaps) { const exp = data.answers[idx - 1]; const v = norm(ans[String(idx)]); if (exp && v && v === norm(exp)) correct++; }
  return correct / total;
}

export function dragTextCorrect(data: DragTextData): string {
  return data.answers.map((a, i) => `[${i + 1}] ${a}`).join(" · ") || "—";
}

export interface DragTextRender { segments: DragTextSegment[]; words: string[]; gapCount: number }
/** Rendu côté apprenant : segments + banque de mots mélangée (sans révéler le placement correct). */
export function dragTextRender(data: DragTextData): DragTextRender {
  return { segments: parseDragText(data.text), words: shuffle([...new Set([...data.answers, ...data.distractors])]), gapCount: data.answers.length };
}

/* ---------------- Appariement (MATCHING) ---------------- */
export function gradeMatching(data: MatchingData, answer: unknown): number {
  const n = data.pairs.length;
  if (!n) return 0;
  const ans = (answer && typeof answer === "object" ? answer : {}) as Record<string, unknown>;
  let correct = 0;
  for (let i = 0; i < n; i++) { const r = norm(data.pairs[i].right); if (r && norm(ans[String(i)]) === r) correct++; }
  return correct / n;
}

export function matchingCorrect(data: MatchingData): string {
  return data.pairs.map((p) => `${p.left} → ${p.right}`).join(" · ") || "—";
}

export interface MatchingRender { lefts: string[]; rights: string[] }
/** Rendu : éléments de gauche + libellés de droite mélangés (sans révéler l'appariement). */
export function matchingRender(data: MatchingData): MatchingRender {
  return { lefts: data.pairs.map((p) => p.left), rights: shuffle([...new Set([...data.pairs.map((p) => p.right), ...data.extraRights])]) };
}

/* ---------------- Ordonnancement (ORDERING) ---------------- */
export function gradeOrdering(data: OrderingData, answer: unknown): number {
  const n = data.items.length;
  if (!n) return 0;
  const ans = Array.isArray(answer) ? answer : [];
  let correct = 0;
  for (let i = 0; i < n; i++) if (norm(ans[i]) === norm(data.items[i])) correct++;
  return correct / n;
}

export function orderingCorrect(data: OrderingData): string {
  return data.items.map((it, i) => `${i + 1}. ${it}`).join("   ") || "—";
}

/** Rendu : éléments mélangés (en évitant l'ordre correct si possible). */
export function orderingRender(data: OrderingData): { items: string[] } {
  if (data.items.length < 2) return { items: [...data.items] };
  let s = shuffle(data.items);
  for (let tries = 0; tries < 8 && s.every((v, i) => v === data.items[i]); tries++) s = shuffle(data.items);
  return { items: s }; // si tous les éléments sont identiques, l'ordre n'a pas d'importance
}
