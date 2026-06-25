/**
 * Génère lib/certel/program.ts à partir de la sortie du workflow
 * « certel-program-content ».
 *   npx tsx scripts/build-certel.ts "<chemin du .output>"
 */
import fs from "node:fs";
import path from "node:path";

const OUTPUT_PATH = process.argv[2];
if (!OUTPUT_PATH) {
  console.error('Usage: npx tsx scripts/build-certel.ts "<chemin .output>"');
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
const result = deepDecode(parsed.result ?? parsed);
const levels = result.levels ?? [];
if (!Array.isArray(levels) || levels.length === 0) {
  console.error("Aucun niveau dans la sortie du workflow.");
  process.exit(1);
}

const header = `import type { LevelKey } from "./diagnostic";

// Programme CERTEL — thématiques & syllabus par niveau. Généré par le workflow
// « certel-program-content » et vérifié contre la grille de diagnostic.
// Ne pas éditer à la main : régénérer via scripts/build-certel.ts.

export interface CertelSyllabus {
  prerequis: string[];
  contenu: { titre: string; points: string[] }[];
  activites: string[];
  evaluation: string[];
}
export interface CertelTheme {
  code: string;
  titre: string;
  resume: string;
  volumeHoraire: string;
  objectifs: string[];
  competences: string[];
  syllabus: CertelSyllabus;
}
export interface CertelProgramLevel {
  levelKey: LevelKey;
  title: string;
  finalite: string;
  publicCible: string;
  prerequisNiveau: string;
  competencesVisees: string[];
  dureeTotale: string;
  themes: CertelTheme[];
  evaluationCertifiante: string[];
}

export const CERTEL_PROGRAM: CertelProgramLevel[] = `;

fs.writeFileSync(path.join(process.cwd(), "lib", "certel", "program.ts"), `${header}${JSON.stringify(levels, null, 2)};\n`, "utf8");

console.log("lib/certel/program.ts généré.");
for (const l of levels) {
  console.log(`- ${l.levelKey} « ${l.title} » : ${l.themes?.length ?? 0} thématiques`);
}
