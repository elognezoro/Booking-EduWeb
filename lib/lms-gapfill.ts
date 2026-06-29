import type { GapfillData } from "./lms-questions";

/** Texte à trous SIMPLE : l'enseignant marque les mots à cacher entre crochets ([Paris] ou [Paris|Lutèce]),
 * l'apprenant les saisit. Tolérance casse + accents par défaut. Module neutre (client/serveur). */
export interface GapfillGap { index: number; answers: string[] }
export type GapfillSegment = { type: "text"; text: string } | { type: "gap"; gap: GapfillGap };

const stripAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

export function parseGapfill(text: string): GapfillSegment[] {
  const segs: GapfillSegment[] = [];
  const re = /\[([^\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segs.push({ type: "text", text: text.slice(last, m.index) });
    i++;
    const answers = m[1].split("|").map((a) => a.trim()).filter(Boolean);
    segs.push({ type: "gap", gap: { index: i, answers } });
    last = m.index + m[0].length;
  }
  if (last < text.length) segs.push({ type: "text", text: text.slice(last) });
  return segs;
}

function normalizer(caseSensitive: boolean) {
  return (s: unknown) => {
    const t = String(s ?? "").trim();
    return caseSensitive ? t : stripAccents(t.toLowerCase());
  };
}

export function gradeGapfill(data: GapfillData, answer: unknown): number {
  const gaps = parseGapfill(data.text).flatMap((s) => (s.type === "gap" ? [s.gap] : []));
  const total = gaps.length;
  if (!total) return 0;
  const norm = normalizer(!!data.caseSensitive);
  const ans = (answer && typeof answer === "object" ? answer : {}) as Record<string, unknown>;
  let correct = 0;
  for (const g of gaps) {
    const v = norm(ans[String(g.index)]);
    if (v && g.answers.some((a) => norm(a) === v)) correct++;
  }
  return correct / total;
}

export function gapfillCorrect(data: GapfillData): string {
  const gaps = parseGapfill(data.text).flatMap((s) => (s.type === "gap" ? [s.gap] : []));
  if (!gaps.length) return "—";
  return gaps.map((g) => `Trou ${g.index} : ${g.answers.join(" / ") || "—"}`).join(" · ");
}

/* ---- Rendu côté apprenant (sans dévoiler les réponses) ---- */
export type GapfillRenderSegment = { type: "text"; text: string } | { type: "gap"; index: number };
export function gapfillRenderSegments(text: string): GapfillRenderSegment[] {
  return parseGapfill(text).map((s) => (s.type === "text" ? s : { type: "gap", index: s.gap.index }));
}
