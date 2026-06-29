/**
 * Modèle de contenu de la formation interactive CERTEL — Niveau 1.
 * Module neutre (client/serveur). Le contenu est saisi dans les fichiers moduleN.ts.
 */

/** Blocs de contenu d'une leçon (séquence narrative). */
export type N1Block =
  | { type: "text"; html: string } // paragraphe(s) narratif(s) ; HTML simple autorisé (<strong>, <em>)
  | { type: "callout"; tone: "info" | "warn" | "tip" | "example"; title?: string; text: string }
  | { type: "keypoints"; title?: string; points: string[] }
  | { type: "infographic"; kind: InfographicKind; title?: string; data: unknown };

/** Types d'infographies disponibles (rendus par components/certel/n1/infographics.tsx). */
export type InfographicKind =
  | "two-columns" // { left:{title,items[]}, right:{title,items[]} } — ex. Matériel vs Logiciel
  | "categories" // { columns: {title, accent?, items:{label, hint?}[]}[] } — ex. Entrée/Sortie/Stockage
  | "tree" // { root:string, nodes: TreeNode[] } — arborescence de dossiers
  | "pattern" // { pattern:string, parts:{token,label}[], examples:string[] } — convention de nommage
  | "table" // { columns:string[], rows:string[][] } — ex. extensions
  | "steps" // { steps:{title, text?}[] } — étapes ordonnées
  | "rules"; // { rules:{icon?, title, text}[] } — grille de règles (sécurité)

export interface N1TreeNode { label: string; children?: N1TreeNode[] }

/** Leçon = une séquence narrative du module. */
export interface N1Lesson {
  id: string;
  title: string;
  icon?: string; // nom d'icône lucide (optionnel, sinon défaut)
  blocks: N1Block[];
}

/** Exerciseurs auto-corrigés (diversifiés). */
export type N1Exercise =
  | N1Qcm
  | N1TrueFalse
  | N1Categorize
  | N1Order
  | N1Match;

interface N1ExerciseBase { id: string; title: string; instruction: string; feedback: string }
export interface N1Qcm extends N1ExerciseBase { kind: "qcm"; multiple?: boolean; options: { text: string; correct: boolean }[] }
export interface N1TrueFalse extends N1ExerciseBase { kind: "truefalse"; statement: string; answer: boolean }
export interface N1Categorize extends N1ExerciseBase { kind: "categorize"; categories: string[]; items: { label: string; category: string }[] }
export interface N1Order extends N1ExerciseBase { kind: "order"; items: string[] /* dans le bon ordre */ }
export interface N1Match extends N1ExerciseBase { kind: "match"; pairs: { left: string; right: string }[] }

/** Étude de cas (réflexive, corrigé révélable — non noté). */
export interface N1CaseStudy { title: string; scenario: string; questions: string[]; corrige: string[] }

export interface N1Competence { group: string; text: string }

/** Un module du Niveau 1. */
export interface N1Module {
  code: string; // ex. "N1-M1"
  slug: string; // ex. "module-1"
  num: number;
  title: string;
  subtitle: string;
  duration: string;
  finalite: string;
  objectives: string[];
  competences: N1Competence[];
  lessons: N1Lesson[];
  exercises: N1Exercise[]; // exercices formatifs + QCM, regroupés dans l'évaluation du module
  caseStudy?: N1CaseStudy;
}

/** Concatène le texte lisible d'une leçon pour la synthèse vocale (audio). */
export function lessonSpeech(lesson: N1Lesson): string {
  const strip = (h: string) => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const parts: string[] = [lesson.title + "."];
  for (const b of lesson.blocks) {
    if (b.type === "text") parts.push(strip(b.html));
    else if (b.type === "callout") parts.push((b.title ? b.title + ". " : "") + b.text);
    else if (b.type === "keypoints") { if (b.title) parts.push(b.title + "."); parts.push(...b.points); }
    else if (b.type === "infographic" && b.title) parts.push(b.title + ".");
  }
  return parts.filter(Boolean).join(" ");
}
