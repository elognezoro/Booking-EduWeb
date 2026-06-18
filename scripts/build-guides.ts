/**
 * One-shot générateur de lib/guides.ts à partir de la sortie du workflow
 * « refresh-role-guides-batched ». Fusionne les 10 guides régénérés,
 * décode les entités HTML qui auraient fui dans le texte, ajoute un guide
 * VISITOR rédigé dans le même style didactique, ordonne selon ROLES, puis
 * émet le fichier. JSON est un sous-ensemble valide de la syntaxe d'objet TS.
 *
 *   npx tsx scripts/build-guides.ts "<chemin du .output>"
 */
import fs from "node:fs";
import path from "node:path";
import { ROLES, type RoleKey } from "../lib/enums";

interface RoleGuide {
  title: string;
  intro: string;
  can: string[];
  sections: { title: string; steps: string[] }[];
}

const OUTPUT_PATH =
  process.argv[2] ??
  "C:\\Users\\elogn\\AppData\\Local\\Temp\\claude\\C--EduWeb-Booking\\717d4b95-d066-438d-9fba-bf74a50da7c5\\tasks\\waff0daoc.output";

/** Décode les entités HTML les plus courantes ayant pu fuir dans le contenu. */
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
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

// Guide VISITOR rédigé à la main (sa vérification a échoué côté workflow).
const VISITOR_GUIDE: RoleGuide = {
  title: "Guide du visiteur",
  intro:
    "Ce support de formation s'adresse aux visiteurs d'EduWeb Booking : personnes qui découvrent la plateforme sans compte complet, ou titulaires du rôle « Visiteur ». Son objectif pédagogique est de vous rendre autonome pour découvrir l'offre publique, vous exercer librement sur l'espace « Sport cérébral », rejoindre une compétition à l'aide d'un code de session, et savoir comment obtenir un compte donnant accès aux ressources, aux réservations et à la bibliothèque de votre établissement.",
  can: [
    "Découvrir la plateforme et ses fonctionnalités depuis le site public (accueil, présentation, contact).",
    "Accéder librement à l'espace « Sport cérébral » et jouer aux jeux ouverts aux visiteurs.",
    "Lire la consigne de chaque jeu (à l'écran et en audio) et relever le « Défi du jour ».",
    "Rejoindre une compétition organisée à l'aide d'un code de session, et jouer sur votre propre appareil.",
    "Demander la création d'un compte pour accéder aux ressources, aux réservations et à la bibliothèque de votre établissement.",
  ],
  sections: [
    {
      title: "Découvrir la plateforme",
      steps: [
        "Ouvrez la page d'accueil publique d'EduWeb Booking pour découvrir la présentation de la plateforme et de ses services.",
        "Parcourez les rubriques publiques (présentation, fonctionnalités, contact) pour comprendre ce que la plateforme propose à votre établissement.",
        "Pour accéder aux ressources, aux réservations et à la bibliothèque, un compte est nécessaire : voir la dernière étape pour en faire la demande.",
      ],
    },
    {
      title: "S'exercer sur l'espace « Sport cérébral »",
      steps: [
        "Ouvrez l'espace « Sport cérébral » : il est public et accessible sans connexion.",
        "Choisissez un jeu parmi ceux qui vous sont proposés, puis un niveau (Débutant, Intermédiaire ou Avancé).",
        "Lisez la consigne affichée à l'écran ; cliquez sur « Écouter » pour l'entendre en audio, puis jouez directement dans votre navigateur.",
        "Relevez le « Défi du jour », toujours jouable, pour vous mesurer à l'exercice quotidien.",
        "Selon la configuration de la plateforme, l'accès à certains jeux peut être réservé aux établissements abonnés ; les jeux ouverts aux visiteurs et le défi du jour restent toujours accessibles.",
      ],
    },
    {
      title: "Rejoindre une compétition",
      steps: [
        "Munissez-vous du code de session (ou du lien) communiqué par l'organisateur de la compétition.",
        "Sur l'accueil du « Sport cérébral », repérez l'encadré « Compétition » et saisissez le code dans le champ « CODE », puis cliquez sur « Rejoindre » (ou ouvrez directement le lien reçu).",
        "Jouez la partie sur votre appareil : votre score est automatiquement pris en compte dans le classement suivi par l'organisateur.",
      ],
    },
    {
      title: "Obtenir un compte complet",
      steps: [
        "Pour réserver des ressources, consulter la bibliothèque ou déposer des documents, demandez la création d'un compte auprès de l'administrateur de votre établissement.",
        "Une fois votre compte créé, vous recevez vos identifiants et un mot de passe initial à changer dès la première connexion.",
        "Connectez-vous : votre menu s'enrichit alors des fonctions correspondant au rôle qui vous a été attribué.",
      ],
    },
  ],
};

// --- Lecture + fusion -------------------------------------------------------
const raw = fs.readFileSync(OUTPUT_PATH, "utf8");
const parsed = JSON.parse(raw);
const guidesFromWorkflow = deepDecode(parsed.result.guides as Record<string, RoleGuide>);

const merged: Record<string, RoleGuide> = { ...guidesFromWorkflow, VISITOR: VISITOR_GUIDE };

// Validation : tous les rôles doivent être présents.
const missing = ROLES.filter((r) => !merged[r]);
if (missing.length) {
  console.error("Rôles manquants :", missing.join(", "));
  process.exit(1);
}

// Émission dans l'ordre canonique des rôles.
const ordered: Record<string, RoleGuide> = {};
for (const r of ROLES as readonly RoleKey[]) ordered[r] = merged[r];

const header = `import type { RoleKey } from "./enums";

export interface RoleGuide {
  title: string;
  intro: string;
  /** Ce qui est possible pour ce rôle (capacités). */
  can: string[];
  /** Comment procéder, étape par étape. */
  sections: { title: string; steps: string[] }[];
}

// Guide d'utilisation propre à chaque rôle (consultable dans le Centre d'aide + version PDF).
// Contenu rédigé de manière didactique et vérifié contre l'application.
export const ROLE_GUIDES: Record<RoleKey, RoleGuide> = `;

const body = JSON.stringify(ordered, null, 2);
fs.writeFileSync(path.join(process.cwd(), "lib", "guides.ts"), `${header}${body};\n`, "utf8");

const counts = (ROLES as readonly RoleKey[]).map(
  (r) => `${r}: ${ordered[r].sections.length} sections / ${ordered[r].can.length} capacités`,
);
console.log("lib/guides.ts régénéré.\n" + counts.join("\n"));
