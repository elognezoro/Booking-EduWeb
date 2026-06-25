// CERTEL — données du diagnostic de niveau (formation certifiante Informatique,
// numérique & IA). Source : « Grille_diagnostic_CERTEL_EduWeb.xlsx ».
// Ce module est sans corrigé (importable côté client). Le corrigé QCM et le
// calcul du score vivent dans lib/certel/scoring.ts (server-only).

export const SELF_SCALE = [
  { value: 0, label: "Je ne sais pas faire" },
  { value: 1, label: "Je fais avec aide" },
  { value: 2, label: "Je fais seul" },
  { value: 3, label: "Je peux aider / former quelqu'un" },
] as const;

/** 30 compétences d'auto-positionnement (notées 0–3). */
export const AUTOPOS: string[] = [
  "Allumer, éteindre et redémarrer correctement un ordinateur",
  "Organiser mes fichiers dans des dossiers",
  "Installer ou désinstaller une application simple",
  "Utiliser une clé USB ou un disque externe",
  "Créer et mettre en forme un document Word",
  "Insérer un tableau, une image ou un en-tête dans Word",
  "Créer un tableau Excel simple",
  "Utiliser des formules simples : SOMME, MOYENNE, SI",
  "Créer une présentation PowerPoint claire",
  "Utiliser correctement Internet pour rechercher une information",
  "Vérifier la fiabilité d'une information trouvée en ligne",
  "Envoyer un e-mail avec pièce jointe",
  "Utiliser Google Drive, OneDrive ou un espace cloud",
  "Participer à une réunion Zoom, Teams ou Google Meet",
  "Créer un formulaire en ligne",
  "Créer une affiche ou un visuel simple avec Canva",
  "Déposer un devoir ou une ressource sur une plateforme LMS",
  "Créer une activité interactive simple",
  "Protéger mes mots de passe",
  "Identifier un message frauduleux ou suspect",
  "Comprendre les risques liés aux données personnelles",
  "Utiliser une IA générative pour produire un texte",
  "Rédiger une consigne claire pour interroger une IA",
  "Vérifier ou corriger une réponse produite par une IA",
  "Utiliser l'IA pour préparer un cours, un rapport ou une activité",
  "Créer un quiz numérique",
  "Concevoir un petit parcours de formation en ligne",
  "Utiliser un tableur pour analyser des données",
  "Automatiser une tâche simple ou répétitive",
  "Produire un livrable numérique professionnel complet",
];

export interface QcmQuestion {
  q: string;
  options: [string, string, string, string];
}

/** 30 questions à choix multiples (sans la bonne réponse). */
export const QCM: QcmQuestion[] = [
  { q: "Quel périphérique permet principalement de saisir du texte ?", options: ["Écran", "Clavier", "Imprimante", "Haut-parleur"] },
  { q: "Quelle extension correspond généralement à un document Word ?", options: [".xlsx", ".pptx", ".docx", ".mp3"] },
  { q: "Quelle extension correspond à un fichier Excel ?", options: [".xlsx", ".jpg", ".pdf", ".zip"] },
  { q: "Quelle commande permet de copier ?", options: ["Ctrl + X", "Ctrl + C", "Ctrl + V", "Ctrl + Z"] },
  { q: "Quelle commande permet d'annuler une action ?", options: ["Ctrl + A", "Ctrl + B", "Ctrl + Z", "Ctrl + P"] },
  { q: "Qu'est-ce qu'un navigateur web ?", options: ["Un antivirus", "Un logiciel pour accéder aux sites Internet", "Une imprimante", "Un tableur"] },
  { q: "Parmi ces éléments, lequel est un moteur de recherche ?", options: ["Google", "Word", "Excel", "Windows"] },
  { q: "Que signifie une pièce jointe dans un e-mail ?", options: ["Une image de profil", "Un fichier envoyé avec le message", "Un mot de passe", "Une signature"] },
  { q: "Quel outil sert principalement à faire des calculs et tableaux ?", options: ["Word", "Excel", "PowerPoint", "Paint"] },
  { q: "Dans Excel, que signifie la formule =SOMME(A1:A5) ?", options: ["Elle additionne les cellules A1 à A5", "Elle supprime les cellules", "Elle colore les cellules", "Elle trie les cellules"] },
  { q: "Quel outil sert principalement à créer un diaporama ?", options: ["Word", "Excel", "PowerPoint", "Access"] },
  { q: "Que signifie « cloud » ?", options: ["Un espace de stockage en ligne", "Un câble réseau", "Une imprimante", "Un antivirus"] },
  { q: "Quel mot de passe est le plus sécurisé ?", options: ["123456", "password", "Zoro2024", "K@mi!27_Bleu#"] },
  { q: "Que faut-il faire avant de cliquer sur un lien reçu par e-mail ?", options: ["Vérifier l'expéditeur et l'adresse du lien", "Cliquer vite", "Le transférer à tous", "Répondre avec son mot de passe"] },
  { q: "Qu'est-ce qu'un phishing ou hameçonnage ?", options: ["Un jeu", "Une tentative de vol d'informations", "Une mise à jour", "Une sauvegarde"] },
  { q: "Que signifie LMS ?", options: ["Learning Management System", "Logiciel Mobile Sécurisé", "Liste des Matières Scolaires", "Langage Machine Simple"] },
  { q: "Moodle est principalement :", options: ["Une plateforme d'apprentissage", "Un antivirus", "Un navigateur", "Un système d'exploitation"] },
  { q: "H5P sert surtout à :", options: ["Créer des contenus interactifs", "Formater un disque", "Écrire du code machine", "Installer Windows"] },
  { q: "Une classe virtuelle permet :", options: ["D'organiser une séance en ligne", "De supprimer les fichiers", "De remplacer l'ordinateur", "De bloquer Internet"] },
  { q: "Une IA générative peut :", options: ["Produire du texte, des images ou des idées", "Toujours dire la vérité", "Remplacer toute vérification humaine", "Garantir l'absence d'erreur"] },
  { q: "Un prompt est :", options: ["Une consigne donnée à l'IA", "Un virus", "Un câble", "Une police d'écriture"] },
  { q: "Une bonne pratique avec l'IA consiste à :", options: ["Vérifier les résultats", "Copier sans lire", "Publier sans contrôle", "Fournir toutes ses données privées"] },
  { q: "L'IA peut produire des erreurs appelées parfois :", options: ["Hallucinations", "Impressions", "Copies", "Licences"] },
  { q: "Une donnée personnelle est :", options: ["Une information permettant d'identifier une personne", "Une formule Excel", "Une couleur", "Un type de clavier"] },
  { q: "Quel outil peut servir à créer un formulaire en ligne ?", options: ["Google Forms", "Paint", "Bloc-notes", "Calculatrice"] },
  { q: "Que signifie collaborer en ligne ?", options: ["Travailler ensemble via des outils numériques", "Travailler sans Internet", "Supprimer les fichiers des autres", "Utiliser seulement une clé USB"] },
  { q: "Une sauvegarde sert à :", options: ["Protéger une copie de ses données", "Effacer ses fichiers", "Fermer Internet", "Réduire la taille de l'écran"] },
  { q: "Un tableau de bord sert à :", options: ["Visualiser des données importantes", "Démarrer un ordinateur", "Installer une souris", "Détruire un fichier"] },
  { q: "Le no-code permet :", options: ["De créer des solutions simples sans programmer lourdement", "De supprimer tous les logiciels", "De coder uniquement en Java", "De naviguer sans Internet"] },
  { q: "Une certification de compétences doit normalement évaluer :", options: ["Des savoirs, savoir-faire et productions observables", "Seulement la présence", "Seulement la mémoire", "Seulement la vitesse de frappe"] },
];

export type LevelKey = "N1" | "N2" | "N3";

export interface CertelLevel {
  key: LevelKey;
  title: string;
  range: string;
  min: number;
  max: number;
  description: string;
  accent: string; // couleur d'accent
  appreciation: string; // appréciation de la maturité diagnostiquée
  suggestion: string; // suggestion d'inscription
}

export const CERTEL_LEVELS: CertelLevel[] = [
  {
    key: "N1",
    title: "Fondamentaux numériques et bureautiques",
    range: "0 à 39 / 100",
    min: 0,
    max: 39,
    description: "Besoin de consolider les bases : ordinateur, bureautique, Internet, e-mail, sécurité de base.",
    accent: "#0891B2",
    appreciation: "Votre maturité numérique est en construction. Vous gagnerez beaucoup d'autonomie en consolidant les fondamentaux (ordinateur, bureautique, Internet, e-mail, sécurité) et en découvrant l'IA générative comme assistant.",
    suggestion: "Nous vous suggérons de débuter par le Niveau 1 — Fondamentaux numériques et bureautiques pour acquérir un socle solide.",
  },
  {
    key: "N2",
    title: "Productivité numérique et IA appliquée",
    range: "40 à 69 / 100",
    min: 40,
    max: 69,
    description: "Utilisateur autonome à renforcer : production professionnelle, contenus numériques, LMS, IA appliquée.",
    accent: "#6D5DF5",
    appreciation: "Vous disposez d'une bonne autonomie numérique. L'étape suivante consiste à professionnaliser vos productions, à créer des contenus numériques et à exploiter l'IA de façon raisonnée et efficace.",
    suggestion: "Nous vous suggérons de vous inscrire au Niveau 2 — Productivité numérique et IA appliquée pour passer à un usage avancé et professionnel.",
  },
  {
    key: "N3",
    title: "Ingénierie numérique, automatisation et IA avancée",
    range: "70 à 100 / 100",
    min: 70,
    max: 100,
    description: "Profil avancé : ingénierie numérique, administration LMS, IA avancée, automatisation, données.",
    accent: "#0B5A45",
    appreciation: "Votre maturité numérique est avancée. Vous êtes prêt(e) à viser l'expertise : ingénierie pédagogique numérique, administration de plateformes, IA avancée, automatisation et exploitation des données.",
    suggestion: "Nous vous suggérons de vous inscrire au Niveau 3 — Ingénierie numérique, automatisation et IA avancée pour viser l'expertise et la certification supérieure.",
  },
];

/** Niveau conseillé à partir d'un score /100. */
export function levelForScore(score100: number): CertelLevel {
  return CERTEL_LEVELS.find((l) => score100 >= l.min && score100 <= l.max) ?? CERTEL_LEVELS[0];
}

export const CERTEL_REFS = "Conçu d'après les référentiels DigComp 2.2, DigCompEdu et les cadres UNESCO de compétences en IA.";
