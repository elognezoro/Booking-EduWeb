/** Types d'exerciseurs (banque de questions LMS) — module neutre (client/serveur). */
export type LmsQuestionType = "MCQ" | "TRUEFALSE" | "SHORTANSWER" | "NUMERICAL" | "CLOZE";

export const QUESTION_TYPES: { key: LmsQuestionType; label: string; desc: string }[] = [
  { key: "MCQ", label: "Choix multiple", desc: "Une ou plusieurs bonnes réponses parmi des propositions." },
  { key: "TRUEFALSE", label: "Vrai / Faux", desc: "Une affirmation à valider ou invalider." },
  { key: "SHORTANSWER", label: "Réponse courte", desc: "Un texte attendu (plusieurs formulations acceptées)." },
  { key: "NUMERICAL", label: "Numérique", desc: "Une valeur numérique avec tolérance." },
  { key: "CLOZE", label: "Texte à trous (Cloze)", desc: "Un texte avec champs intégrés (format Moodle)." },
];

export const QUESTION_TYPE_LABEL: Record<string, string> = Object.fromEntries(QUESTION_TYPES.map((t) => [t.key, t.label]));

export interface McqOption { text: string; correct: boolean; feedback?: string }
export interface McqData { multiple: boolean; options: McqOption[] }
export interface TrueFalseData { correct: boolean }
export interface ShortAnswerItem { text: string; grade: number; feedback?: string }
export interface ShortAnswerData { caseSensitive: boolean; answers: ShortAnswerItem[] }
export interface NumericalItem { value: number; tolerance: number; grade: number; feedback?: string }
export interface NumericalData { answers: NumericalItem[] }
export interface ClozeData { clozeText: string }

export function defaultData(type: LmsQuestionType): unknown {
  switch (type) {
    case "MCQ": return { multiple: false, options: [{ text: "", correct: true }, { text: "", correct: false }] } satisfies McqData;
    case "TRUEFALSE": return { correct: true } satisfies TrueFalseData;
    case "SHORTANSWER": return { caseSensitive: false, answers: [{ text: "", grade: 100 }] } satisfies ShortAnswerData;
    case "NUMERICAL": return { answers: [{ value: 0, tolerance: 0, grade: 100 }] } satisfies NumericalData;
    case "CLOZE": return { clozeText: "" } satisfies ClozeData;
  }
}

const num = (v: unknown, def = 0): number => { const n = Number(v); return Number.isFinite(n) ? n : def; };
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const clampGrade = (v: unknown): number => Math.max(0, Math.min(100, Math.round(num(v))));

/** Normalise/valide côté serveur les données d'une question (bornes, tailles). Renvoie un objet sûr. */
export function normalizeData(type: string, raw: unknown): unknown {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  switch (type) {
    case "MCQ": {
      const options = (Array.isArray(d.options) ? d.options : []).slice(0, 12).map((o) => {
        const oo = (o ?? {}) as Record<string, unknown>;
        return { text: str(oo.text).slice(0, 1000), correct: !!oo.correct, feedback: str(oo.feedback).slice(0, 1000) || undefined };
      }).filter((o) => o.text.trim());
      return { multiple: !!d.multiple, options } satisfies McqData;
    }
    case "TRUEFALSE":
      return { correct: !!d.correct } satisfies TrueFalseData;
    case "SHORTANSWER": {
      const answers = (Array.isArray(d.answers) ? d.answers : []).slice(0, 20).map((a) => {
        const aa = (a ?? {}) as Record<string, unknown>;
        return { text: str(aa.text).slice(0, 500), grade: clampGrade(aa.grade), feedback: str(aa.feedback).slice(0, 1000) || undefined };
      }).filter((a) => a.text.trim());
      return { caseSensitive: !!d.caseSensitive, answers } satisfies ShortAnswerData;
    }
    case "NUMERICAL": {
      const answers = (Array.isArray(d.answers) ? d.answers : []).slice(0, 20).map((a) => {
        const aa = (a ?? {}) as Record<string, unknown>;
        return { value: num(aa.value), tolerance: Math.abs(num(aa.tolerance)), grade: clampGrade(aa.grade), feedback: str(aa.feedback).slice(0, 1000) || undefined };
      });
      return { answers } satisfies NumericalData;
    }
    case "CLOZE":
      return { clozeText: str(d.clozeText).slice(0, 20000) } satisfies ClozeData;
    default:
      return {};
  }
}
