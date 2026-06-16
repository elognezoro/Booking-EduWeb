// Banque de jeux « Sport cérébral » — catégories, niveaux, consignes, compétences.

export type Level = "facile" | "moyen" | "difficile"; // clés internes (URL/moteur) ; libellés ci-dessous

// Libellés affichés : Débutant / Intermédiaire / Avancé.
export const LEVELS: { key: Level; label: string }[] = [
  { key: "facile", label: "Débutant" },
  { key: "moyen", label: "Intermédiaire" },
  { key: "difficile", label: "Avancé" },
];

export interface GameDef {
  slug: string;
  title: string;
  category: string;
  icon: string; // clé d'icône lucide (résolue dans les composants)
  color: string;
  short: string;
  skills: string[]; // compétences travaillées
  duree: string; // durée estimée
  consigne: string; // consigne (texte + lue en audio)
  href?: string; // défini si jouable
  playable: boolean;
}

export const GAMES: GameDef[] = [
  {
    slug: "sudoku",
    title: "Sudoku",
    category: "Nombres",
    icon: "Grid3x3",
    color: "#064B3A",
    short: "Développez votre logique, votre patience et votre capacité de déduction.",
    skills: ["Logique", "Déduction", "Concentration"],
    duree: "5–15 min",
    consigne:
      "Remplissez la grille de manière que chaque ligne, chaque colonne et chaque zone de trois cases sur trois contiennent tous les chiffres sans répétition. Observez les chiffres déjà placés, procédez par déduction et évitez les essais au hasard.",
    href: "/sport-cerebral/sudoku",
    playable: true,
  },
  {
    slug: "logigrammes",
    title: "Logigrammes",
    category: "Déduction",
    icon: "Network",
    color: "#1D4ED8",
    short: "Résolvez une situation par croisements d'indices.",
    skills: ["Raisonnement", "Déduction", "Méthode"],
    duree: "10–20 min",
    consigne:
      "À partir d'une série d'indices, déduisez les associations correctes entre les éléments. Cochez les cases certaines et éliminez les impossibles, jusqu'à obtenir l'unique solution.",
    playable: false,
  },
  {
    slug: "mots-croises",
    title: "Mots croisés",
    category: "Lettres",
    icon: "Type",
    color: "#F97316",
    short: "Vocabulaire, culture générale, mémoire et précision linguistique.",
    skills: ["Vocabulaire", "Culture générale", "Mémoire"],
    duree: "10–20 min",
    consigne:
      "À partir des définitions proposées, trouvez les mots et placez-les dans la grille, horizontalement et verticalement. Les lettres communes aux mots qui se croisent doivent correspondre.",
    playable: false,
  },
  {
    slug: "logique",
    title: "Jeux de logique",
    category: "Logique",
    icon: "Puzzle",
    color: "#DC2626",
    short: "Énigmes, suites logiques, associations, classements et déductions.",
    skills: ["Raisonnement", "Suites", "Associations"],
    duree: "5–10 min",
    consigne:
      "Observez la suite de nombres proposée, identifiez la règle qui la régit, puis choisissez le nombre qui la complète logiquement. Six manches s'enchaînent : visez le maximum de bonnes réponses.",
    href: "/sport-cerebral/logique",
    playable: true,
  },
  {
    slug: "memoire",
    title: "Jeux de mémoire",
    category: "Mémoire",
    icon: "Brain",
    color: "#6D5DF5",
    short: "Mémorisez images, mots, nombres, positions ou séquences.",
    skills: ["Mémoire", "Concentration"],
    duree: "3–8 min",
    consigne:
      "Retournez les cartes deux par deux pour découvrir les symboles cachés. Lorsque deux cartes sont identiques, elles restent visibles. Mémorisez l'emplacement des cartes et associez toutes les paires en un minimum de coups.",
    href: "/sport-cerebral/memoire",
    playable: true,
  },
  {
    slug: "attention",
    title: "Jeux d'attention",
    category: "Attention",
    icon: "ScanSearch",
    color: "#0D9488",
    short: "Repérage d'intrus, différences, observation rapide.",
    skills: ["Observation", "Concentration visuelle", "Rapidité"],
    duree: "3–8 min",
    consigne:
      "Observez attentivement les éléments affichés et repérez l'intrus, les différences ou la cible demandée, le plus rapidement et le plus précisément possible.",
    playable: false,
  },
  {
    slug: "calcul-mental",
    title: "Calcul mental",
    category: "Calcul",
    icon: "Calculator",
    color: "#B45309",
    short: "Opérations rapides, suites numériques, défis chronométrés.",
    skills: ["Calcul", "Rapidité", "Arithmétique"],
    duree: "3–10 min",
    consigne:
      "Résolvez de tête les opérations proposées, le plus vite possible et sans calculatrice. Enchaînez les bonnes réponses pour augmenter votre score avant la fin du temps imparti.",
    href: "/sport-cerebral/calcul-mental",
    playable: true,
  },
  {
    slug: "culture-generale",
    title: "Culture générale",
    category: "Culture",
    icon: "GraduationCap",
    color: "#4338CA",
    short: "Questions-réponses et quiz thématiques.",
    skills: ["Connaissances", "Mémoire", "Réflexion"],
    duree: "5–10 min",
    consigne:
      "Répondez aux questions de culture générale en choisissant la bonne réponse. Lisez attentivement chaque question et faites appel à vos connaissances et à votre logique.",
    href: "/sport-cerebral/culture-generale",
    playable: true,
  },
  {
    slug: "defis-ia",
    title: "Défis IA contre humain",
    category: "Défi",
    icon: "Bot",
    color: "#172554",
    short: "Résolvez avant l'aide de l'IA, ou comparez votre raisonnement.",
    skills: ["Raisonnement", "Stratégie", "Persévérance"],
    duree: "5–15 min",
    consigne:
      "Tentez de résoudre le défi par vous-même avant de demander l'aide de l'intelligence artificielle. Comparez ensuite votre démarche à l'explication guidée proposée.",
    playable: false,
  },
];

export function getGame(slug: string): GameDef | undefined {
  return GAMES.find((g) => g.slug === slug);
}
