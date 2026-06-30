import type { CertelEvaluation } from "./types";

/**
 * Contenu de l'évaluation certifiante CERTEL — Niveau 2.
 * Source : reference/certel-src-n2/Evaluation_certifiante_Niveau2_CERTEL_EduWeb.txt
 * Module neutre (client/serveur).
 */

export const EVAL_N2: CertelEvaluation = {
  levelKey: "N2",
  title: "Évaluation certifiante du Niveau 2",
  intro:
    "L'évaluation certifiante du <strong>Niveau 2</strong> mesure la capacité à passer d'une utilisation autonome des outils numériques à une <strong>production professionnelle intégrée</strong>. Elle ne vérifie pas seulement des connaissances isolées : elle observe la capacité à <em>organiser, produire, partager, sécuriser, vérifier et présenter</em> un livrable numérique complet. Elle est répartie entre un contrôle continu par modules, un QCM transversal, un projet fil rouge et une soutenance orale, complétés d'une mise en situation pratique chronométrée. La validation du Niveau 2 ouvre l'accès au Niveau 3.",
  competences: [
    "Produire un rapport Word professionnel structuré (page de garde, sommaire automatique, styles de titres, tableau, image, références, export PDF).",
    "Construire un tableau Excel exploitant des formules conditionnelles (SI), des indicateurs et un graphique.",
    "Concevoir des contenus visuels professionnels (affiche, infographie, carte de communication) lisibles et accessibles.",
    "Créer un formulaire en ligne avec une logique claire et une collecte limitée aux données nécessaires.",
    "Animer une classe virtuelle et collaborer sur un document partagé en gérant les droits cloud.",
    "Concevoir un mini-espace LMS aligné sur des objectifs : ressources, consignes, activité interactive, quiz et rétroaction.",
    "Mobiliser l'IA générative de façon critique et transparente : prompt, vérification, correction, sources et note de transparence.",
    "Appliquer les principes de protection des données : minimisation, finalité, droits de partage, conservation et mesures de sécurité.",
    "Évaluer la fiabilité de l'information en ligne (auteur, date, intention, recoupement).",
    "Présenter et défendre un livrable devant un jury en adoptant une posture professionnelle.",
  ],
  notation: [
    {
      part: "Diagnostic d'entrée confirmé",
      weight: "Positionnement",
      description:
        "Auto-positionnement /30, QCM /30 et tâches pratiques /40 pour confirmer les prérequis du Niveau 1 et l'entrée au Niveau 2. Non certificatif : il déclenche une remédiation ciblée si nécessaire.",
    },
    {
      part: "Contrôle continu par modules",
      weight: "30 %",
      description:
        "Livrables notés de chaque module conservés dans le portfolio : documents bureautiques, contenus visuels, formulaire, classe virtuelle, espace LMS, bibliothèque de prompts et audit de sécurité.",
    },
    {
      part: "QCM certificatif transversal",
      weight: "20 %",
      description:
        "Questions sur la sécurité, la protection des données, la fiabilité de l'information, le LMS, la collaboration et l'usage responsable de l'IA (auto-corrigé, /30).",
    },
    {
      part: "Projet fil rouge intégré",
      weight: "35 %",
      description:
        "Livrable professionnel mobilisant la bureautique, des contenus numériques, un formulaire, un espace LMS, l'IA, des sources et une note de protection des données (/100).",
    },
    {
      part: "Soutenance orale devant jury",
      weight: "15 %",
      description:
        "Présentation et défense du livrable devant jury selon une grille multicritère (clarté, démonstration, justification des choix, maîtrise sécurité/données/IA, qualité des réponses).",
    },
  ],
  seuil:
    "Moyenne générale ≥ 60/100 et projet fil rouge jugé conforme aux standards professionnels. 80–100 : certification avec mention ; 60–79 : certification validée ; 50–59 : ajournement avec remédiation ciblée ; moins de 50 : non validé (reprise ciblée). La validation ouvre l'accès au Niveau 3.",
  quiz: [
    {
      id: "n2q1",
      kind: "qcm",
      title: "Minimisation des données",
      instruction: "Quel principe impose de ne collecter que les informations nécessaires ?",
      options: [
        { text: "Minimisation des données", correct: true },
        { text: "Animation automatique", correct: false },
        { text: "Fusion de cellules", correct: false },
        { text: "Mode présentateur", correct: false },
      ],
      feedback:
        "La minimisation exige que chaque donnée collectée soit utile à la finalité annoncée : on ne demande pas plus que le strict nécessaire.",
    },
    {
      id: "n2q2",
      kind: "qcm",
      title: "Sommaire automatique dans Word",
      instruction: "Dans un document Word long, le sommaire automatique dépend principalement :",
      options: [
        { text: "Des styles de titres", correct: true },
        { text: "De la couleur du texte", correct: false },
        { text: "Du zoom", correct: false },
        { text: "Du correcteur seul", correct: false },
      ],
      feedback:
        "Les styles Titre 1, Titre 2, etc. donnent au document une structure exploitable, à partir de laquelle le sommaire automatique est généré.",
    },
    {
      id: "n2q3",
      kind: "qcm",
      title: "La fonction SI dans Excel",
      instruction: "Dans Excel, la fonction SI permet :",
      options: [
        { text: "D'afficher un résultat selon une condition", correct: true },
        { text: "D'insérer une image", correct: false },
        { text: "De créer un e-mail", correct: false },
        { text: "De changer la langue", correct: false },
      ],
      feedback:
        "SI est une fonction conditionnelle : si la condition est vraie, un résultat est affiché ; sinon un autre.",
    },
    {
      id: "n2q4",
      kind: "qcm",
      title: "Alignement d'une activité LMS",
      instruction: "Une activité interactive dans un LMS doit être alignée sur :",
      options: [
        { text: "Un objectif d'apprentissage", correct: true },
        { text: "La taille de l'écran uniquement", correct: false },
        { text: "Le hasard", correct: false },
        { text: "Le nombre de couleurs", correct: false },
      ],
      feedback: "L'interactivité n'est utile que si elle sert une compétence ou une vérification d'apprentissage.",
    },
    {
      id: "n2q5",
      kind: "qcm",
      title: "Rétroaction de quiz efficace",
      instruction: "Une rétroaction de quiz efficace doit :",
      options: [
        { text: "Expliquer la réponse", correct: true },
        { text: "Dire seulement « faux »", correct: false },
        { text: "Être absente", correct: false },
        { text: "Humilier l'apprenant", correct: false },
      ],
      feedback: "La rétroaction formative aide l'apprenant à comprendre son erreur et à progresser.",
    },
    {
      id: "n2q6",
      kind: "truefalse",
      title: "Partage cloud en modification",
      instruction: "Vrai ou faux ?",
      statement: "Un lien cloud partagé à tous en modification est potentiellement risqué.",
      answer: true,
      feedback:
        "Vrai : un tel lien peut exposer le document à des modifications non contrôlées. On préfère un partage restreint et le droit adapté (lecture ou commentaire).",
    },
    {
      id: "n2q7",
      kind: "qcm",
      title: "Fiabilité de l'information",
      instruction: "Avant de faire confiance à une information en ligne, il faut vérifier notamment :",
      options: [
        { text: "Auteur, date, intention et recoupement", correct: true },
        { text: "La couleur du site", correct: false },
        { text: "Le nombre de publicités", correct: false },
        { text: "Le fond d'écran", correct: false },
      ],
      feedback: "La fiabilité repose sur des critères documentaires : qui écrit, quand, dans quel but, et l'information est-elle confirmée ailleurs.",
    },
    {
      id: "n2q8",
      kind: "qcm",
      title: "Hallucination de l'IA",
      instruction: "Une hallucination de l'IA est :",
      options: [
        { text: "Une réponse fausse ou inventée mais plausible", correct: true },
        { text: "Une image très nette", correct: false },
        { text: "Un fichier PDF", correct: false },
        { text: "Une formule Excel", correct: false },
      ],
      feedback: "Une réponse de l'IA peut paraître convaincante tout en étant incorrecte : d'où la nécessité de vérifier systématiquement.",
    },
    {
      id: "n2q9",
      kind: "qcm",
      title: "Rôle de la note de transparence IA",
      instruction: "La note de transparence IA sert à :",
      options: [
        { text: "Documenter l'usage de l'IA dans la production", correct: true },
        { text: "Cacher le travail effectué", correct: false },
        { text: "Supprimer les sources", correct: false },
        { text: "Empêcher la correction", correct: false },
      ],
      feedback: "Elle précise le rôle de l'IA dans le livrable et rappelle la responsabilité humaine sur le résultat final.",
    },
    {
      id: "n2q10",
      kind: "match",
      title: "Droits de partage dans un document cloud",
      instruction: "Associez chaque droit cloud à ce qu'il autorise.",
      pairs: [
        { left: "Lecture", right: "Consulter le document sans le modifier" },
        { left: "Commentaire", right: "Suggérer sans modifier directement le contenu" },
        { left: "Modification", right: "Éditer directement le contenu du document" },
        { left: "Propriétaire", right: "Gérer le document et les droits des autres" },
      ],
      feedback:
        "Le droit « commentaire » est adapté à la relecture sans modification directe. On attribue toujours le droit minimal nécessaire à chaque personne.",
    },
    {
      id: "n2q11",
      kind: "truefalse",
      title: "QR code sur une affiche",
      instruction: "Vrai ou faux ?",
      statement: "Un QR code sur une affiche doit être accompagné d'une consigne claire.",
      answer: true,
      feedback: "Vrai : le lecteur doit savoir pourquoi il doit scanner et vers quoi le code mène. Un QR code sans explication est peu professionnel et suspect.",
    },
    {
      id: "n2q12",
      kind: "qcm",
      title: "Vérifier une capture d'écran",
      instruction: "Une capture d'écran avant diffusion doit être vérifiée pour éviter :",
      options: [
        { text: "L'exposition de données personnelles", correct: true },
        { text: "L'amélioration du contraste", correct: false },
        { text: "La mise en forme des titres", correct: false },
        { text: "Le classement des fichiers", correct: false },
      ],
      feedback: "Les captures peuvent contenir noms, e-mails, notifications ou données confidentielles : il faut les masquer avant diffusion.",
    },
    {
      id: "n2q13",
      kind: "qcm",
      title: "Mot de passe robuste",
      instruction: "Un mot de passe robuste doit être :",
      options: [
        { text: "Long, unique et difficile à deviner", correct: true },
        { text: "123456", correct: false },
        { text: "Le même partout", correct: false },
        { text: "Partagé avec le groupe", correct: false },
      ],
      feedback: "La longueur, l'unicité et l'imprévisibilité limitent fortement les risques de compromission.",
    },
    {
      id: "n2q14",
      kind: "qcm",
      title: "Test en rôle apprenant",
      instruction: "Le test en rôle apprenant dans un LMS sert à :",
      options: [
        { text: "Vérifier l'expérience réelle de l'apprenant", correct: true },
        { text: "Supprimer la plateforme", correct: false },
        { text: "Modifier les notes de tous", correct: false },
        { text: "Décorer le cours", correct: false },
      ],
      feedback: "En se mettant dans le rôle de l'apprenant, le formateur voit si les ressources et activités sont réellement accessibles.",
    },
    {
      id: "n2q15",
      kind: "qcm",
      title: "Sous-groupes en classe virtuelle",
      instruction: "Dans une classe virtuelle, les sous-groupes nécessitent :",
      options: [
        { text: "Une consigne et un livrable attendu", correct: true },
        { text: "Une absence d'objectif", correct: false },
        { text: "Une caméra obligatoire sans raison", correct: false },
        { text: "Aucun temps limité", correct: false },
      ],
      feedback: "Sans objectif ni livrable clair, le travail de sous-groupe se disperse et perd son efficacité.",
    },
    {
      id: "n2q16",
      kind: "qcm",
      title: "Pertinence du format PDF",
      instruction: "Le format PDF est pertinent pour :",
      options: [
        { text: "Diffuser un document en conservant sa mise en page", correct: true },
        { text: "Calculer une moyenne", correct: false },
        { text: "Remplacer un mot de passe", correct: false },
        { text: "Faire un sondage automatiquement", correct: false },
      ],
      feedback: "Le PDF stabilise le rendu à la diffusion : la mise en page reste identique d'un appareil à l'autre.",
    },
    {
      id: "n2q17",
      kind: "qcm",
      title: "Question obligatoire dans un formulaire",
      instruction: "Dans un formulaire, une question obligatoire doit être :",
      options: [
        { text: "Justifiée par l'objectif", correct: true },
        { text: "Toujours sensible", correct: false },
        { text: "Inutile", correct: false },
        { text: "Imposée sans raison", correct: false },
      ],
      feedback: "Le caractère obligatoire doit être proportionné au besoin : on n'oblige une réponse que si elle est indispensable à la finalité.",
    },
    {
      id: "n2q18",
      kind: "qcm",
      title: "Rôle d'une bibliographie APA",
      instruction: "Une bibliographie APA permet :",
      options: [
        { text: "D'identifier les sources utilisées", correct: true },
        { text: "De masquer les sources", correct: false },
        { text: "De supprimer les titres", correct: false },
        { text: "De créer un graphique", correct: false },
      ],
      feedback: "Elle soutient la traçabilité et la crédibilité du livrable en rendant les sources vérifiables.",
    },
    {
      id: "n2q19",
      kind: "qcm",
      multiple: true,
      title: "Usage responsable de l'IA",
      instruction: "Quelles exigences caractérisent un usage responsable de l'IA ? (plusieurs réponses)",
      options: [
        { text: "Vérification des réponses produites", correct: true },
        { text: "Transparence sur le rôle de l'IA", correct: true },
        { text: "Protection des données mobilisées", correct: true },
        { text: "Copie brute sans lecture", correct: false },
        { text: "Publication de données sensibles", correct: false },
      ],
      feedback:
        "Vérification, transparence et protection des données sont les trois critères essentiels d'un usage professionnel de l'IA. Copier sans lire ou exposer des données sensibles sont au contraire des pratiques à proscrire.",
    },
    {
      id: "n2q20",
      kind: "qcm",
      title: "Présentation PowerPoint professionnelle",
      instruction: "Une présentation PowerPoint professionnelle doit principalement :",
      options: [
        { text: "Soutenir un message oral clair", correct: true },
        { text: "Contenir tout le discours", correct: false },
        { text: "Multiplier les animations", correct: false },
        { text: "Remplacer toute explication", correct: false },
      ],
      feedback: "Les diapositives accompagnent l'orateur : elles soutiennent le message oral, elles ne le remplacent pas.",
    },
  ],
  projet: {
    title: "Projet fil rouge : livrable numérique professionnel intégré",
    brief:
      "Le projet fil rouge est l'<strong>épreuve centrale</strong> du Niveau 2. L'apprenant choisit ou reçoit un thème imposé, par exemple : sensibilisation à la sécurité numérique, organisation d'un atelier de formation, promotion d'un service éducatif, initiation à l'IA générative ou accompagnement des enseignants dans l'usage du LMS. Il doit produire un dossier numérique complet qui <em>articule les outils autour d'un besoin réel</em> : le rapport explique, Excel objectivise, le visuel communique, le formulaire collecte, le LMS organise, l'activité engage, le quiz évalue, l'IA soutient et la note de données sécurise.",
    consignes: [
      "Cadrer le besoin, le public cible et la cohérence globale du projet.",
      "Produire un rapport Word structuré : page de garde, sommaire automatique, titres, tableau, image, références et export PDF.",
      "Réaliser un fichier Excel avec données, formules, indicateurs et au moins un graphique.",
      "Concevoir un visuel professionnel : affiche, infographie ou carte de communication.",
      "Créer un formulaire en ligne à la logique claire, limité aux données nécessaires.",
      "Mettre en place un mini-espace LMS avec ressources, consignes, activité interactive et quiz.",
      "Documenter l'usage de l'IA : bibliothèque de prompts ou usage assisté (prompt, réponse brute, correction, sources et note de transparence).",
      "Rédiger une note de protection des données : finalité, données collectées, droits de partage, durée de conservation et mesures de sécurité.",
    ],
    bareme: [
      { critere: "Cadrage du besoin, public cible et cohérence globale", points: "10" },
      { critere: "Rapport Word professionnel et référencé", points: "15" },
      { critere: "Tableau Excel avec formules et graphique", points: "10" },
      { critere: "Visuel et formulaire en ligne", points: "15" },
      { critere: "Espace LMS, activité et quiz", points: "20" },
      { critere: "Usage critique et transparent de l'IA", points: "15" },
      { critere: "Protection des données, sécurité et droits de partage", points: "15" },
    ],
    duree:
      "Projet conduit en fil rouge tout au long du Niveau 2, défendu lors d'une soutenance orale de 10 à 15 minutes (7 min de présentation, 5 min de questions, puis délibération).",
  },
  miseEnSituation: {
    title: "Mise en situation pratique chronométrée",
    brief:
      "Cette épreuve vérifie l'<strong>autonomie sur poste</strong>. Elle peut être organisée en salle informatique ou à distance supervisée. Une erreur isolée n'est pas éliminatoire, mais l'incapacité à organiser les fichiers, à partager correctement ou à vérifier l'IA affecte fortement la certification.",
    consignes: [
      "Créer une arborescence de dossiers conforme au thème imposé.",
      "Mettre en forme une note Word avec deux niveaux de titres, puis l'exporter en PDF.",
      "Créer ou compléter un tableau Excel avec les fonctions SOMME, MOYENNE et SI.",
      "Envoyer un e-mail professionnel avec objet, message et pièce jointe.",
      "Déposer les fichiers dans un dossier cloud et configurer les droits de partage.",
      "Rejoindre une courte réunion en ligne, partager l'écran et présenter un fichier.",
      "Rédiger un prompt pour améliorer une introduction, puis vérifier et corriger la réponse produite par l'IA.",
    ],
    bareme: [
      { critere: "Gestion de fichiers et nommage", points: "10" },
      { critere: "Word et export PDF", points: "15" },
      { critere: "Excel et formules", points: "15" },
      { critere: "E-mail professionnel", points: "10" },
      { critere: "Cloud et droits de partage", points: "15" },
      { critere: "Réunion en ligne", points: "15" },
      { critere: "Prompt IA et vérification critique", points: "20" },
    ],
    duree: "2 heures chronométrées (durée indicative).",
  },
};
