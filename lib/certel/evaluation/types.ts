import type { N1Exercise } from "../niveau1/types";

/** Modèle d'une évaluation certifiante CERTEL (un niveau). Module neutre (client/serveur). */

export interface EvalNotation { part: string; weight: string; description?: string }
export interface EvalBareme { critere: string; points: string }

/** Un livrable évalué par un humain / jury (projet de synthèse, mise en situation…). */
export interface EvalDeliverable {
  title: string;
  brief: string; // contexte / consigne générale (HTML simple autorisé)
  consignes: string[]; // étapes / attendus
  bareme: EvalBareme[]; // grille de notation
  duree?: string; // ex. « 90 min chronométrées »
}

export interface CertelEvaluation {
  levelKey: string; // N1 | N2 | N3
  title: string;
  intro: string; // cadre général (HTML simple)
  competences: string[]; // compétences évaluées
  notation: EvalNotation[]; // architecture de notation (parts + pondérations)
  seuil: string; // conditions de certification
  quiz: N1Exercise[]; // QCM / exercices auto-corrigés (diversifiés)
  projet: EvalDeliverable; // projet de synthèse (livrable)
  miseEnSituation: EvalDeliverable; // mise en situation pratique
}
