// Registre de présence des salles multimédias — vocabulaire partagé (formulaire APRID).

export const VISIT_STATUTS = ["ETUDIANT", "ENSEIGNANT", "PAT"] as const;
export type VisitStatut = (typeof VISIT_STATUTS)[number];

export const VISIT_STATUT_LABELS: Record<VisitStatut, string> = {
  ETUDIANT: "Étudiant",
  ENSEIGNANT: "Enseignant",
  PAT: "Personnel administratif et technique",
};

export const VISIT_GENDERS = ["HOMME", "FEMME"] as const;

/** Formatage des heures du registre (fuseau de la plateforme). */
export const VISIT_TIME = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Abidjan" });
export const VISIT_DATE = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Africa/Abidjan" });
