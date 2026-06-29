/** Analyse et correction du format « Cloze » (texte à trous façon Moodle). Module neutre (client/serveur). */
export interface ClozeAnswer { text: string; grade: number; feedback?: string; tolerance?: number }
export type ClozeGapKind = "SHORTANSWER" | "NUMERICAL" | "MULTICHOICE";
export interface ClozeGap { index: number; weight: number; kind: ClozeGapKind; caseSensitive: boolean; answers: ClozeAnswer[] }
export type ClozeSegment = { type: "text"; text: string } | { type: "gap"; gap: ClozeGap };

const TYPE_MAP: Record<string, { kind: ClozeGapKind; caseSensitive?: boolean }> = {
  SHORTANSWER: { kind: "SHORTANSWER" }, SA: { kind: "SHORTANSWER" }, MW: { kind: "SHORTANSWER" },
  SHORTANSWER_C: { kind: "SHORTANSWER", caseSensitive: true }, SAC: { kind: "SHORTANSWER", caseSensitive: true },
  NUMERICAL: { kind: "NUMERICAL" }, NM: { kind: "NUMERICAL" },
  MULTICHOICE: { kind: "MULTICHOICE" }, MC: { kind: "MULTICHOICE" },
  MULTICHOICE_V: { kind: "MULTICHOICE" }, MCV: { kind: "MULTICHOICE" },
  MULTICHOICE_H: { kind: "MULTICHOICE" }, MCH: { kind: "MULTICHOICE" },
  MULTIRESPONSE: { kind: "MULTICHOICE" }, MR: { kind: "MULTICHOICE" },
  MULTICHOICE_S: { kind: "MULTICHOICE" }, MCS: { kind: "MULTICHOICE" },
};

function parseAnswerToken(token: string, kind: ClozeGapKind): ClozeAnswer {
  let t = token;
  let grade = 0;
  if (t.startsWith("=")) { grade = 100; t = t.slice(1); }
  else { const pm = t.match(/^%(-?\d+(?:\.\d+)?)%/); if (pm) { grade = Math.max(0, Math.min(100, Number(pm[1]))); t = t.slice(pm[0].length); } } // crédit partiel borné à [0,100]
  let feedback: string | undefined;
  const hi = t.indexOf("#");
  if (hi >= 0) { feedback = t.slice(hi + 1).trim() || undefined; t = t.slice(0, hi); }
  t = t.replace(/\\(.)/g, "$1").trim(); // déséchappe \~ \} \# \= …
  if (kind === "NUMERICAL") {
    let tolerance = 0;
    const ci = t.indexOf(":");
    if (ci >= 0) { tolerance = Math.min(1e9, Math.abs(Number(t.slice(ci + 1)) || 0)); t = t.slice(0, ci).trim(); }
    return { text: t, grade, feedback, tolerance };
  }
  return { text: t, grade, feedback };
}

// Découpe la liste de réponses sur « ~ » non échappé.
function splitAnswers(s: string): string[] {
  const out: string[] = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "\\" && i + 1 < s.length) { cur += c + s[i + 1]; i++; continue; }
    if (c === "~") { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

/**
 * Découpe le texte en segments (texte + champs). Les champs invalides restent du texte.
 * Format `{poids:TYPE:réponses}` : `poids` (défaut 1) pondère le champ dans la note globale ;
 * le numéro de trou (`index`) est attribué séquentiellement dans l'ordre d'apparition (clé des réponses).
 */
export function parseCloze(clozeText: string): ClozeSegment[] {
  const segs: ClozeSegment[] = [];
  const re = /\{([^{}]*)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let gapIndex = 0;
  while ((m = re.exec(clozeText)) !== null) {
    const gm = m[1].match(/^\s*(\d*)\s*:\s*([A-Za-z_]+)\s*:\s*([\s\S]*)$/);
    if (!gm || !TYPE_MAP[gm[2].toUpperCase()]) continue; // pas un champ valide → laissé en texte
    if (m.index > last) segs.push({ type: "text", text: clozeText.slice(last, m.index) });
    const mapped = TYPE_MAP[gm[2].toUpperCase()];
    gapIndex++;
    const answers = splitAnswers(gm[3]).map((tok) => parseAnswerToken(tok, mapped.kind)).filter((a) => a.text !== "");
    segs.push({ type: "gap", gap: { index: gapIndex, weight: gm[1] ? Math.max(1, parseInt(gm[1], 10)) : 1, kind: mapped.kind, caseSensitive: !!mapped.caseSensitive, answers } });
    last = m.index + m[0].length;
  }
  if (last < clozeText.length) segs.push({ type: "text", text: clozeText.slice(last) });
  return segs;
}

/** Note (0..1) d'un champ selon la valeur fournie. */
export function gradeGap(gap: ClozeGap, value: unknown): number {
  if (gap.kind === "NUMERICAL") {
    const v = Number(value);
    if (!Number.isFinite(v)) return 0;
    let best = 0;
    for (const a of gap.answers) { const av = Number(a.text); if (Number.isFinite(av) && Math.abs(v - av) <= (a.tolerance || 0)) best = Math.max(best, a.grade / 100); }
    return best;
  }
  const norm = (s: unknown) => (gap.caseSensitive ? String(s ?? "").trim() : String(s ?? "").trim().toLowerCase());
  const val = norm(value);
  if (!val) return 0;
  let best = 0;
  for (const a of gap.answers) if (val === norm(a.text)) best = Math.max(best, a.grade / 100);
  return best;
}

/** Note globale (0..1) d'un texte à trous : moyenne pondérée des champs. `answers` indexé par numéro de trou. */
export function gradeCloze(clozeText: string, answers: unknown): number {
  const gaps = parseCloze(clozeText).flatMap((s) => (s.type === "gap" ? [s.gap] : []));
  if (!gaps.length) return 0;
  const ans = (answers && typeof answers === "object" ? answers : {}) as Record<string, unknown>;
  let totalW = 0, got = 0;
  for (const g of gaps) { totalW += g.weight; got += g.weight * Math.max(0, Math.min(1, gradeGap(g, ans[String(g.index)]))); }
  return totalW > 0 ? Math.max(0, Math.min(1, got / totalW)) : 0;
}

/* ---- Rendu côté apprenant (sans dévoiler les bonnes réponses) ---- */
export interface ClozeRenderGap { index: number; kind: ClozeGapKind; choices?: string[] }
export type ClozeRenderSegment = { type: "text"; text: string } | { type: "gap"; gap: ClozeRenderGap };

/**
 * Segments sûrs pour le client : grades et feedback TOUJOURS retirés. Pour un MULTICHOICE, seuls les
 * libellés des choix sont exposés (nécessaires au menu déroulant) ; pour SHORTANSWER/NUMERICAL, aucune
 * bonne réponse n'est envoyée au navigateur.
 */
export function clozeRenderSegments(clozeText: string): ClozeRenderSegment[] {
  return parseCloze(clozeText).map((s) =>
    s.type === "text"
      ? s
      : { type: "gap", gap: { index: s.gap.index, kind: s.gap.kind, choices: s.gap.kind === "MULTICHOICE" ? s.gap.answers.map((a) => a.text) : undefined } },
  );
}

/** Résumé des bonnes réponses par trou (pour le corrigé). */
export function clozeCorrectText(clozeText: string): string {
  const gaps = parseCloze(clozeText).flatMap((s) => (s.type === "gap" ? [s.gap] : []));
  if (!gaps.length) return "—";
  return gaps.map((g) => {
    const best = g.answers.filter((a) => a.grade >= 100).map((a) => a.text);
    const list = best.length ? best : g.answers.map((a) => a.text);
    return `Trou ${g.index} : ${list.join(" / ") || "—"}`;
  }).join(" · ");
}
