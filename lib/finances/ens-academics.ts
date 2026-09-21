// Référentiel académique OFFICIEL de l'ENS d'Abidjan — Centre de la Formation Initiale (CFI).
// Source : « Liste des filières diplômantes » (document Scolarité centrale, 2026) + listes
// officielles de TD 2026-2027. La formation dure deux années (Première / Deuxième année).
//
// Structure : FILIÈRE (ex. Professeurs de Lycée) → DISCIPLINE / SPÉCIALITÉ (ex. Anglais).
// Certaines filières n'ont pas de discipline (Éducateurs, Inspecteurs…) : sections = [].
// L'export `ENS_DEPARTMENTS` est conservé pour compatibilité (même forme {name, sections}).

export type FiliereGroup = "enseignement" | "encadrement";

export const FILIERE_GROUP_LABELS: Record<FiliereGroup, string> = {
  enseignement: "Filières d'enseignement",
  encadrement: "Filières d'encadrement",
};

export interface EnsFiliere {
  code: string; // code usuel des listes officielles (PL, PC, CAFOP, ED, CES, IE, IO…)
  name: string;
  group: FiliereGroup;
  sections: string[]; // disciplines / spécialités ; [] = filière sans subdivision
}

export const ENS_FILIERES: EnsFiliere[] = [
  // ——— Filières d'enseignement ———
  { code: "AGREG", name: "Agrégation du secondaire", group: "enseignement", sections: [] },
  {
    code: "PL",
    name: "Professeurs de Lycée",
    group: "enseignement",
    sections: ["Allemand", "Anglais", "Espagnol", "Histoire-Géographie", "Lettres Modernes", "Mathématiques", "Philosophie", "Sciences Physiques", "SVT"],
  },
  {
    code: "PC",
    name: "Professeurs de Collège",
    group: "enseignement",
    sections: ["Allemand", "Anglais-EPS", "Espagnol", "Histoire-Géographie-Lettres Modernes", "Lettres Modernes-EDHC", "Mathématiques-TICE", "SVT-Sciences Physiques"],
  },
  { code: "CAFOP", name: "Professeurs de CAFOP", group: "enseignement", sections: ["FS", "IAV"] },
  // ——— Filières d'encadrement ———
  { code: "ED", name: "Éducateurs", group: "encadrement", sections: [] },
  { code: "IP", name: "Inspecteurs pédagogiques", group: "encadrement", sections: [] },
  { code: "IO", name: "Inspecteurs d'Orientation", group: "encadrement", sections: [] },
  { code: "IE", name: "Inspecteurs d'Éducation", group: "encadrement", sections: [] },
  { code: "IEPP", name: "Inspecteurs de l'Enseignement Préscolaire et Primaire", group: "encadrement", sections: [] },
  { code: "CES", name: "Conseillers Extra-scolaires", group: "encadrement", sections: ["ALP", "CA", "COGES", "VS"] },
  { code: "CPPP", name: "Conseillers pédagogiques du préscolaire et du primaire", group: "encadrement", sections: [] },
];

export function filiereByCode(code: string): EnsFiliere | undefined {
  return ENS_FILIERES.find((f) => f.code === code.toUpperCase());
}

/** Compatibilité : ancien export (forme { name, sections }) — désormais les FILIÈRES réelles du CFI. */
export const ENS_DEPARTMENTS: { name: string; sections: string[] }[] = ENS_FILIERES.map(({ name, sections }) => ({ name, sections }));

/** La cascade Filière → Discipline s'affiche pour cette catégorie (comparaison insensible à la casse). */
export function isConsultationDocumentaire(label: string): boolean {
  return label.trim().toLowerCase() === "consultation documentaire";
}

/** Tarif proposé par défaut pour une consultation documentaire (FCFA) — modifiable à la saisie. */
export const CONSULTATION_DEFAULT_AMOUNT = 10_000;
