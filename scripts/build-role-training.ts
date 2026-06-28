/**
 * Génère lib/role-training.ts à partir de la sortie du workflow « role-training-content ».
 * Décode les entités HTML, valide la présence de tous les rôles, ordonne selon ROLES, émet le fichier.
 *
 *   npx tsx scripts/build-role-training.ts "<chemin du .output>"
 */
import fs from "node:fs";
import path from "node:path";
import { ROLES, type RoleKey } from "../lib/enums";

interface RoleTraining {
  title: string;
  intro: string;
  modules: { title: string; objective: string; content: string[] }[];
  quiz: { question: string; options: string[]; answer: number; explanation: string }[];
}

const OUTPUT_PATH = process.argv[2];
if (!OUTPUT_PATH) {
  console.error("Usage: npx tsx scripts/build-role-training.ts \"<output.json>\"");
  process.exit(1);
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}
function deepDecode<T>(value: T): T {
  if (typeof value === "string") return decodeEntities(value) as unknown as T;
  if (Array.isArray(value)) return value.map(deepDecode) as unknown as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepDecode(v);
    return out as T;
  }
  return value;
}

const raw = fs.readFileSync(OUTPUT_PATH, "utf8");
const parsed = JSON.parse(raw);
const fromWorkflow = deepDecode((parsed.result?.training ?? parsed.training) as Record<string, RoleTraining>);

// Validation : clamp les index de réponse + tous les rôles présents.
const missing = (ROLES as readonly RoleKey[]).filter((r) => !fromWorkflow[r]);
if (missing.length) {
  console.error("Rôles manquants :", missing.join(", "));
  process.exit(1);
}
for (const r of ROLES as readonly RoleKey[]) {
  for (const q of fromWorkflow[r].quiz) {
    if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) {
      console.error(`Index de réponse invalide (${r}) :`, q.question);
      process.exit(1);
    }
  }
}

const ordered: Record<string, RoleTraining> = {};
for (const r of ROLES as readonly RoleKey[]) ordered[r] = fromWorkflow[r];

const header = `import type { RoleKey } from "./enums";

export interface RoleTrainingModule {
  title: string;
  objective: string;
  content: string[];
}
export interface RoleTrainingQuestion {
  question: string;
  /** Propositions à choix unique. */
  options: string[];
  /** Indice (0-based) de la bonne réponse dans \`options\`. */
  answer: number;
  explanation: string;
}
export interface RoleTraining {
  title: string;
  intro: string;
  /** Modules de prise en main, progressifs. */
  modules: RoleTrainingModule[];
  /** Auto-évaluation (QCM) à correction immédiate. */
  quiz: RoleTrainingQuestion[];
}

// Parcours de formation à la prise en main + auto-évaluation, propre à chaque rôle.
// Contenu généré par le workflow « role-training-content » et vérifié contre l'application.
export const ROLE_TRAINING: Record<RoleKey, RoleTraining> = `;

fs.writeFileSync(path.join(process.cwd(), "lib", "role-training.ts"), `${header}${JSON.stringify(ordered, null, 2)};\n`, "utf8");

const counts = (ROLES as readonly RoleKey[]).map((r) => `${r}: ${ordered[r].modules.length} modules / ${ordered[r].quiz.length} questions`);
console.log("lib/role-training.ts généré.\n" + counts.join("\n"));
