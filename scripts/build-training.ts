/**
 * Génère lib/training-content.ts à partir de la sortie du workflow
 * « training-manual-content ». JSON étant un sous-ensemble valide de la
 * syntaxe d'objet TS, on émet directement la constante typée.
 *
 *   npx tsx scripts/build-training.ts "<chemin du .output>"
 */
import fs from "node:fs";
import path from "node:path";
import { ROLES, type RoleKey } from "../lib/enums";

const OUTPUT_PATH = process.argv[2];
if (!OUTPUT_PATH) {
  console.error("Usage: npx tsx scripts/build-training.ts \"<chemin .output>\"");
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

// --- Contrôles de cohérence ------------------------------------------------
const REQUIRED = ["apercu", "syllabus", "modulesCommuns", "rolesA", "rolesB", "rolesC", "rolesD", "qcm", "annexes"];
const missingKeys = REQUIRED.filter((k) => !result[k]);
if (missingKeys.length) {
  console.error("Clés manquantes dans la sortie du workflow :", missingKeys.join(", "));
  process.exit(1);
}

const wrapperRoles = new Set<string>();
for (const slice of ["rolesA", "rolesB", "rolesC", "rolesD"]) {
  for (const w of result[slice].wrappers ?? []) wrapperRoles.add(w.roleKey);
}
const missingRoles = (ROLES as readonly RoleKey[]).filter((r) => !wrapperRoles.has(r));
if (missingRoles.length) {
  console.warn("⚠ Enveloppes de rôle manquantes (à compléter) :", missingRoles.join(", "));
}

const header = `import type { TrainingContent } from "./training";

// Contenu rédactionnel du support de formation (syllabus, modules, QCM,
// glossaire, annexes), généré par le workflow « training-manual-content »
// et vérifié contre le code. Ne pas éditer à la main : régénérer via
// scripts/build-training.ts.
export const TRAINING_CONTENT: TrainingContent = `;

const body = JSON.stringify(result, null, 2);
fs.writeFileSync(path.join(process.cwd(), "lib", "training-content.ts"), `${header}${body};\n`, "utf8");

console.log("lib/training-content.ts généré.");
console.log(`- présentation : ${result.apercu.presentation.length} blocs · glossaire : ${result.apercu.glossaire.length} termes`);
console.log(`- objectifs généraux : ${result.syllabus.objectifsGeneraux.length} · compétences : ${result.syllabus.competences.length}`);
console.log(`- modules tronc commun : ${result.modulesCommuns.modules.length}`);
console.log(`- enveloppes de rôle : ${wrapperRoles.size}/${ROLES.length}`);
console.log(`- QCM : ${result.qcm.banques.reduce((n: number, b: { questions: unknown[] }) => n + b.questions.length, 0)} questions sur ${result.qcm.banques.length} thèmes`);
