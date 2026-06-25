// CERTEL — tâches pratiques de diagnostic (/40). Source : onglet « Taches pratiques »
// de « Grille_diagnostic_CERTEL_EduWeb.xlsx ». Module sans secret (importable côté client).
// L'évaluation IA (corrigé, appel Claude) vit dans lib/certel/ai-eval.ts (server-only).

export interface PracticalTask {
  key: string;
  n: number;
  title: string;
  consigne: string;
  max: number;
  /** Indication de dépôt adaptée à la tâche (affichée sous le champ). */
  hint: string;
}

export const PRACTICAL_TASKS: PracticalTask[] = [
  {
    key: "fichiers",
    n: 1,
    title: "Gestion de fichiers",
    consigne: "Créer un dossier nommé Diagnostic_NomPrenom, y ranger trois fichiers renommés correctement.",
    max: 5,
    hint: "Déposez une capture d'écran du dossier ouvert montrant son nom et les trois fichiers renommés.",
  },
  {
    key: "word",
    n: 2,
    title: "Word",
    consigne: "Produire une note d'une page avec titre, sous-titre, tableau, image et pied de page.",
    max: 5,
    hint: "Enregistrez votre document en PDF (Fichier ▸ Enregistrer sous ▸ PDF) ou déposez une capture de la page.",
  },
  {
    key: "excel",
    n: 3,
    title: "Excel",
    consigne: "Créer un tableau de notes, calculer moyenne, rang ou appréciation avec une formule simple.",
    max: 7,
    hint: "Déposez une capture montrant le tableau et la barre de formule, ou exportez la feuille en PDF.",
  },
  {
    key: "powerpoint",
    n: 4,
    title: "PowerPoint",
    consigne: "Créer 3 diapositives propres : titre, contenu, conclusion.",
    max: 5,
    hint: "Exportez la présentation en PDF, ou déposez une capture des 3 diapositives (mode trieuse).",
  },
  {
    key: "internet",
    n: 5,
    title: "Internet",
    consigne: "Rechercher une information fiable et citer la source.",
    max: 4,
    hint: "Saisissez l'information trouvée et sa source ci-dessous, ou déposez une capture de la page source.",
  },
  {
    key: "email",
    n: 6,
    title: "E-mail",
    consigne: "Envoyer un e-mail professionnel avec objet, message clair et pièce jointe.",
    max: 4,
    hint: "Déposez une capture de l'e-mail envoyé (objet, message, pièce jointe visibles).",
  },
  {
    key: "ia",
    n: 7,
    title: "IA",
    consigne: "Demander à une IA de produire un texte, puis corriger ou améliorer le résultat.",
    max: 5,
    hint: "Saisissez le texte produit par l'IA puis votre version corrigée/améliorée, ou déposez une capture.",
  },
  {
    key: "securite",
    n: 8,
    title: "Sécurité",
    consigne: "Identifier 3 risques dans un faux e-mail frauduleux.",
    max: 5,
    hint: "Listez ci-dessous les 3 risques repérés (expéditeur, lien, pièce jointe…), ou déposez une capture annotée.",
  },
];

export const PRACTICAL_TOTAL = PRACTICAL_TASKS.reduce((s, t) => s + t.max, 0); // 40

/** Extensions et types acceptés au dépôt. Word/Excel/PowerPoint : exporter en PDF ou capture. */
export const ACCEPTED_EXT = ".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.csv,.md";
export const ACCEPTED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "text/plain",
  "text/csv",
  "text/markdown",
];
export const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 Mo / fichier

export type TaskVerdict = "reussi" | "partiel" | "insuffisant" | "illisible" | "pending";

export interface TaskEvaluation {
  key: string;
  title: string;
  max: number;
  score: number; // 0..max
  verdict: TaskVerdict;
  justification: string;
  strengths: string[];
  gaps: string[];
  evaluatedBy: "ai" | "pending";
  fileName?: string;
}

export const VERDICT_LABEL: Record<TaskVerdict, string> = {
  reussi: "Réussi",
  partiel: "Partiellement réussi",
  insuffisant: "Insuffisant",
  illisible: "Production illisible / hors sujet",
  pending: "À évaluer par un formateur",
};

/** Consolide le score /40 et le /100 à partir des évaluations effectuées. */
export function consolidatePractical(evaluations: TaskEvaluation[], online60: number) {
  const aiEvals = evaluations.filter((e) => e.evaluatedBy === "ai");
  const practicalScore = aiEvals.reduce((s, e) => s + clampScore(e.score, e.max), 0);
  const total100 = online60 + practicalScore;
  return { practicalScore, total100, tasksEvaluated: aiEvals.length, complete: aiEvals.length === PRACTICAL_TASKS.length };
}

export function clampScore(score: number, max: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(max, Math.round(score)));
}
