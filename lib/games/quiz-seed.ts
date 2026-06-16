// Jeu de questions initial pour « Culture générale » (banque éditable ensuite par le super admin).
export interface SeedQuestion {
  level: "facile" | "moyen" | "difficile";
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation?: string;
}

export const QUIZ_SEED: SeedQuestion[] = [
  // ---- Débutant ----
  { level: "facile", prompt: "Quelle est la capitale politique de la Côte d'Ivoire ?", choices: ["Abidjan", "Yamoussoukro", "Bouaké", "Korhogo"], answerIndex: 1, explanation: "Yamoussoukro est la capitale politique depuis 1983 ; Abidjan reste la capitale économique." },
  { level: "facile", prompt: "Autour de quel astre la Terre tourne-t-elle ?", choices: ["La Lune", "Le Soleil", "Mars", "Vénus"], answerIndex: 1, explanation: "La Terre orbite autour du Soleil en environ 365 jours." },
  { level: "facile", prompt: "Combien de jours compte une année bissextile ?", choices: ["365", "366", "367", "364"], answerIndex: 1, explanation: "Une année bissextile compte 366 jours (un 29 février)." },
  { level: "facile", prompt: "Quelle est la langue officielle de la Côte d'Ivoire ?", choices: ["L'anglais", "Le français", "Le portugais", "L'arabe"], answerIndex: 1 },

  // ---- Intermédiaire ----
  { level: "moyen", prompt: "Qui a écrit « Les Misérables » ?", choices: ["Victor Hugo", "Émile Zola", "Molière", "Voltaire"], answerIndex: 0, explanation: "Victor Hugo a publié « Les Misérables » en 1862." },
  { level: "moyen", prompt: "Quelle est la monnaie de la Côte d'Ivoire ?", choices: ["Le cédi", "Le naira", "Le franc CFA", "Le dirham"], answerIndex: 2 },
  { level: "moyen", prompt: "Combien de côtés possède un hexagone ?", choices: ["5", "6", "7", "8"], answerIndex: 1 },
  { level: "moyen", prompt: "Quel fleuve traverse l'Égypte ?", choices: ["Le Congo", "Le Nil", "Le Niger", "Le Sénégal"], answerIndex: 1 },

  // ---- Avancé ----
  { level: "difficile", prompt: "En quelle année la Côte d'Ivoire a-t-elle accédé à l'indépendance ?", choices: ["1958", "1960", "1962", "1957"], answerIndex: 1, explanation: "La Côte d'Ivoire est indépendante depuis le 7 août 1960." },
  { level: "difficile", prompt: "Quel est le symbole chimique de l'or ?", choices: ["Or", "Au", "Ag", "Go"], answerIndex: 1, explanation: "« Au », du latin aurum." },
  { level: "difficile", prompt: "Qui a formulé la théorie de la relativité ?", choices: ["Isaac Newton", "Albert Einstein", "Galilée", "Niels Bohr"], answerIndex: 1 },
  { level: "difficile", prompt: "Quel est le plus haut sommet d'Afrique ?", choices: ["Mont Cameroun", "Kilimandjaro", "Mont Kenya", "Toubkal"], answerIndex: 1, explanation: "Le Kilimandjaro culmine à 5 895 m (Tanzanie)." },
];
