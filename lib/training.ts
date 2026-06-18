import type { RoleKey } from "./enums";

/**
 * Modèle de données du SUPPORT DE FORMATION académique.
 *
 * Le contenu rédactionnel (syllabus, modules, QCM, glossaire, annexes) est
 * généré et vérifié contre le code, puis figé dans `lib/training-content.ts`
 * (constante `TRAINING_CONTENT`). Le détail pas à pas des modules métiers est
 * réutilisé depuis `ROLE_GUIDES` (lib/guides.ts) — aucune duplication.
 */

export interface PresentationBloc {
  titre: string;
  texte: string;
}
export interface GlossaireEntry {
  terme: string;
  definition: string;
}
export interface BloomObjective {
  objectif: string;
  niveauBloom: string;
}
export interface LabeledValue {
  label: string;
  valeur: string;
}
export interface EvaluationItem {
  type: string;
  description: string;
}

export interface Syllabus {
  intitule: string;
  publicCible: string[];
  prerequis: string[];
  finalite: string;
  objectifsGeneraux: BloomObjective[];
  competences: string[];
  duree: string;
  volumeHoraire: LabeledValue[];
  modalites: string[];
  methodes: string[];
  moyens: string[];
  evaluation: EvaluationItem[];
  criteresReussite: string[];
}

export interface DerouleBloc {
  titre: string;
  points: string[];
}
export interface TrainingModule {
  code: string;
  titre: string;
  public: string;
  duree: string;
  prerequis: string[];
  objectifs: string[];
  competences: string[];
  deroule: DerouleBloc[];
  atelier: string[];
  evaluation: string[];
}

export interface RoleWrapper {
  roleKey: RoleKey;
  duree: string;
  prerequis: string[];
  objectifs: string[];
  competences: string[];
  atelier: string[];
  evaluation: string[];
}

export interface QcmQuestion {
  enonce: string;
  options: string[];
  bonneReponse: number;
  justification: string;
}
export interface QcmBank {
  theme: string;
  questions: QcmQuestion[];
}

export interface CsvModel {
  fichier: string;
  colonnes: string[];
  etapes: string[];
}
export interface PwdProc {
  scenario: string;
  etapes: string[];
}
export interface FaqEntry {
  probleme: string;
  solution: string;
}
export interface FicheFormateur {
  deroule: { phase: string; duree: string; activite: string }[];
  conseils: string[];
  materiel: string[];
}
export interface Annexes {
  importCsv: CsvModel[];
  motDePasse: PwdProc[];
  depannage: FaqEntry[];
  ficheFormateur: FicheFormateur;
}

/** Forme exacte renvoyée par le workflow `training-manual-content`. */
export interface TrainingContent {
  apercu: { presentation: PresentationBloc[]; perimetre: string[]; glossaire: GlossaireEntry[] };
  syllabus: Syllabus;
  modulesCommuns: { modules: TrainingModule[] };
  rolesA: { wrappers: RoleWrapper[] };
  rolesB: { wrappers: RoleWrapper[] };
  rolesC: { wrappers: RoleWrapper[] };
  rolesD: { wrappers: RoleWrapper[] };
  qcm: { banques: QcmBank[] };
  annexes: Annexes;
}

/** Rassemble les enveloppes pédagogiques de tous les rôles en un index. */
export function roleWrappers(content: TrainingContent): Partial<Record<RoleKey, RoleWrapper>> {
  const out: Partial<Record<RoleKey, RoleWrapper>> = {};
  for (const slice of [content.rolesA, content.rolesB, content.rolesC, content.rolesD]) {
    for (const w of slice.wrappers) out[w.roleKey] = w;
  }
  return out;
}

/**
 * Ordre pédagogique des rôles dans le support (familles métiers) :
 * plateforme → établissement → réservation → appui → visiteur → bibliothèque.
 */
export const ROLE_TRAINING_ORDER: RoleKey[] = [
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "RESOURCE_MANAGER",
  "VALIDATOR",
  "REQUESTER",
  "TECHNICIAN",
  "VISITOR",
  "LIBRARIAN",
  "DEPOSITOR",
  "SCIENTIFIC_VALIDATOR",
  "READER",
];

/** Familles de parcours, pour le tableau d'architecture de la formation. */
export const ROLE_FAMILIES: { famille: string; roles: RoleKey[] }[] = [
  { famille: "Pilotage de la plateforme", roles: ["SUPER_ADMIN"] },
  { famille: "Administration d'établissement", roles: ["ORG_ADMIN"] },
  { famille: "Réservation de ressources", roles: ["RESOURCE_MANAGER", "VALIDATOR", "REQUESTER"] },
  { famille: "Appui & maintenance", roles: ["TECHNICIAN"] },
  { famille: "Accès public", roles: ["VISITOR"] },
  { famille: "Bibliothèque numérique", roles: ["LIBRARIAN", "DEPOSITOR", "SCIENTIFIC_VALIDATOR", "READER"] },
];
