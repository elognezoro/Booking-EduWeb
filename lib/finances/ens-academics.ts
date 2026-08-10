// Référentiel académique de l'ENS d'Abidjan — utilisé par le formulaire d'encaissement
// (catégorie « Consultation documentaire » : rattachement du visiteur à un département
// et à une section/filière, par sélection en cascade).
// Source : site officiel ens-abidjan.ci (pages des départements). Liste éditable ici.

export interface AcademicDepartment {
  name: string;
  sections: string[];
}

export const ENS_DEPARTMENTS: AcademicDepartment[] = [
  {
    name: "Département des Arts et Lettres",
    sections: ["Arts", "Lettres Modernes", "Philosophie"],
  },
  {
    name: "Département des Langues",
    sections: ["Anglais", "Allemand", "Espagnol"],
  },
  {
    name: "Département Histoire et Géographie",
    sections: ["Histoire-Géographie"],
  },
  {
    name: "Département Sciences et Technologie",
    sections: ["Mathématiques", "Physique-Chimie", "Sciences de la Vie et de la Terre (SVT)"],
  },
  {
    name: "Département des Sciences de l'Éducation",
    sections: ["Sciences de l'Éducation"],
  },
];

/** La cascade Département → Section s'affiche pour cette catégorie (comparaison insensible à la casse). */
export function isConsultationDocumentaire(label: string): boolean {
  return label.trim().toLowerCase() === "consultation documentaire";
}

/** Tarif proposé par défaut pour une consultation documentaire (FCFA) — modifiable à la saisie. */
export const CONSULTATION_DEFAULT_AMOUNT = 10_000;
