import type { CertelEvaluation } from "./types";

/** Évaluation certifiante du Niveau 3 — CERTEL / EduWeb. */
export const EVAL_N3: CertelEvaluation = {
  levelKey: "N3",
  title: "Évaluation certifiante du Niveau 3",
  intro:
    "Cette évaluation certifiante valide la capacité du candidat à <strong>concevoir, déployer, piloter et soutenir un dispositif numérique professionnel complet</strong> intégrant ingénierie pédagogique, LMS, intelligence artificielle, automatisation et analyse de données. Elle repose sur une <strong>logique de compétence intégrée</strong> : le candidat ne doit pas seulement montrer qu'il connaît les outils, il doit prouver qu'il peut concevoir une solution numérique cohérente, utile, sécurisée, documentée et <em>défendable devant un jury</em>. L'évaluation combine contrôle continu, projet capstone, soutenance orale et validation pratique. La finalité est de produire un support de formation complet, directement exploitable par le formateur et les apprenants, avec contenus narratifs, activités, évaluations et corrigés commentés.",
  competences: [
    "Concevoir un dossier de scénarisation pédagogique aligné (objectifs, activités, évaluation) selon la démarche ADDIE et l'alignement constructif.",
    "Structurer et paramétrer un espace LMS fonctionnel : ressources, activités, évaluation, suivi et conditions d'achèvement.",
    "Documenter un assistant IA ou une bibliothèque de prompts (rôle, limites, prompts, vérification) dans une logique d'usage responsable.",
    "Concevoir un flux automatisé fiable : utile, conditionnel, testé, documenté et maintenable.",
    "Construire un tableau de bord décisionnel à partir d'indicateurs pertinents et interpréter les données pour soutenir une décision.",
    "Intégrer dès la conception la protection des données, l'accessibilité et la transparence sur l'usage de l'IA.",
    "Soutenir et argumenter un dispositif devant un jury : démonstration, posture professionnelle, reconnaissance des limites.",
    "Produire une documentation d'usage garantissant la transmissibilité et la maintenance du dispositif.",
  ],
  notation: [
    {
      part: "Contrôle continu (N3-M1 à N3-M5)",
      weight: "30 %",
      description:
        "Évaluation des livrables intermédiaires : dossier de scénarisation, espace LMS, assistant IA, flux automatisé et tableau de bord.",
    },
    {
      part: "Projet capstone individuel",
      weight: "40 %",
      description:
        "Livrable numérique professionnel complet produit au module N3-M6 : un dispositif cohérent, sécurisé, documenté et exploitable.",
    },
    {
      part: "Soutenance orale devant jury",
      weight: "20 %",
      description:
        "Évalue la démonstration, l'argumentation, la posture professionnelle et la capacité de réponse aux questions du jury.",
    },
    {
      part: "QCM et contrôle pratique de validation",
      weight: "10 %",
      description:
        "Vérifient les connaissances essentielles en LMS, prompt engineering, automatisation, données et gouvernance.",
    },
  ],
  seuil:
    "Score global supérieur ou égal à 70/100, projet capstone jugé conforme par le jury, soutenance réalisée et documentée, portfolio complet des livrables N3-M1 à N3-M6, et respect explicite des règles de protection des données, de citation des sources et d'usage responsable de l'IA.",
  quiz: [
    {
      id: "n3-q1",
      kind: "qcm",
      title: "L'essentiel d'un capstone",
      instruction: "Dans une évaluation capstone, l'élément le plus important est :",
      options: [
        { text: "L'intégration cohérente des compétences", correct: true },
        { text: "La quantité de couleurs", correct: false },
        { text: "Le nombre de fichiers", correct: false },
        { text: "L'absence de documentation", correct: false },
      ],
      feedback:
        "Réponse : l'intégration cohérente des compétences. Le projet certifiant valide l'intégration professionnelle, pas l'accumulation d'éléments décoratifs ou de fichiers.",
    },
    {
      id: "n3-q2",
      kind: "qcm",
      title: "Dossier de scénarisation",
      instruction: "Un dossier de scénarisation doit montrer :",
      options: [
        { text: "L'alignement entre objectifs, activités et évaluation", correct: true },
        { text: "Uniquement une liste de fichiers", correct: false },
        { text: "Uniquement les noms des apprenants", correct: false },
        { text: "La marque du serveur", correct: false },
      ],
      feedback:
        "Réponse : l'alignement entre objectifs, activités et évaluation. L'alignement constructif est central dans un dossier de scénarisation.",
    },
    {
      id: "n3-q3",
      kind: "qcm",
      title: "Espace LMS fonctionnel",
      instruction: "Un espace LMS fonctionnel doit comporter :",
      options: [
        { text: "Structure, ressources, activités, évaluation et suivi", correct: true },
        { text: "Seulement un PDF", correct: false },
        { text: "Seulement une image", correct: false },
        { text: "Aucun objectif", correct: false },
      ],
      feedback:
        "Réponse : structure, ressources, activités, évaluation et suivi. Le LMS doit organiser le parcours, pas se réduire à un document isolé.",
    },
    {
      id: "n3-q4",
      kind: "qcm",
      title: "Assistant IA documenté",
      instruction: "Un assistant IA documenté doit inclure :",
      options: [
        { text: "Rôle, limites, prompts et vérification", correct: true },
        { text: "Des données sensibles", correct: false },
        { text: "Aucun critère", correct: false },
        { text: "Uniquement un logo", correct: false },
      ],
      feedback:
        "Réponse : rôle, limites, prompts et vérification. La documentation permet un usage responsable de l'assistant IA.",
    },
    {
      id: "n3-q5",
      kind: "qcm",
      title: "Automatisation certifiante",
      instruction: "Une automatisation certifiante doit être :",
      options: [
        { text: "Testée, documentée et maintenable", correct: true },
        { text: "Cachée et non vérifiée", correct: false },
        { text: "Sans condition", correct: false },
        { text: "Sans gestion des erreurs", correct: false },
      ],
      feedback:
        "Réponse : testée, documentée et maintenable. L'automatisation doit être fiable pour être professionnelle.",
    },
    {
      id: "n3-q6",
      kind: "qcm",
      title: "Tableau de bord décisionnel",
      instruction: "Un tableau de bord décisionnel doit :",
      options: [
        { text: "Soutenir une décision par des indicateurs pertinents", correct: true },
        { text: "Décorer le rapport", correct: false },
        { text: "Éviter toute source", correct: false },
        { text: "Afficher tous les chiffres sans hiérarchie", correct: false },
      ],
      feedback:
        "Réponse : soutenir une décision par des indicateurs pertinents. Le tableau de bord sert la décision, pas la décoration.",
    },
    {
      id: "n3-q7",
      kind: "qcm",
      title: "Priorité de la soutenance",
      instruction: "La soutenance doit prioritairement :",
      options: [
        { text: "Justifier les choix et démontrer le livrable", correct: true },
        { text: "Lire le rapport mot à mot", correct: false },
        { text: "Éviter les questions", correct: false },
        { text: "Masquer les limites", correct: false },
      ],
      feedback:
        "Réponse : justifier les choix et démontrer le livrable. Le jury attend une posture professionnelle, pas une lecture du rapport.",
    },
    {
      id: "n3-q8",
      kind: "qcm",
      title: "Quand traiter la protection des données ?",
      instruction: "La protection des données doit être traitée :",
      options: [
        { text: "Dès la conception du projet", correct: true },
        { text: "Après la publication uniquement", correct: false },
        { text: "Jamais", correct: false },
        { text: "Seulement si le jury demande", correct: false },
      ],
      feedback:
        "Réponse : dès la conception du projet. La protection des données se pense en amont (privacy by design).",
    },
    {
      id: "n3-q9",
      kind: "qcm",
      title: "Seuil de validation du Niveau 3",
      instruction: "Le score minimal de validation du Niveau 3 proposé est :",
      options: [
        { text: "70/100", correct: true },
        { text: "30/100", correct: false },
        { text: "40/100", correct: false },
        { text: "50/100", correct: false },
      ],
      feedback:
        "Réponse : 70/100. Le seuil avancé valorise la maîtrise professionnelle attendue à ce niveau.",
    },
    {
      id: "n3-q10",
      kind: "qcm",
      title: "Fragilité d'un projet non documenté",
      instruction: "Un projet non documenté est fragile car :",
      options: [
        { text: "Il est difficile à maintenir et à transférer", correct: true },
        { text: "Il est plus sécurisé", correct: false },
        { text: "Il est plus facile à auditer", correct: false },
        { text: "Il prouve la compétence", correct: false },
      ],
      feedback:
        "Réponse : il est difficile à maintenir et à transférer. La documentation garantit la transmissibilité du dispositif.",
    },
    {
      id: "n3-q11",
      kind: "truefalse",
      title: "Documenter mieux que multiplier",
      instruction: "Vrai ou faux ?",
      statement:
        "Lors de la mise en situation, un candidat qui produit moins mais documente et justifie bien ses choix peut être mieux évalué qu'un candidat qui multiplie les outils sans cohérence.",
      answer: true,
      feedback:
        "Vrai. La correction valorise la méthode, la cohérence, la sécurité, le respect du temps et la justification, et non la simple accumulation d'outils.",
    },
    {
      id: "n3-q12",
      kind: "truefalse",
      title: "Le rôle de la soutenance",
      instruction: "Vrai ou faux ?",
      statement:
        "Une soutenance excellente se réduit à parcourir page après page le contenu du rapport.",
      answer: false,
      feedback:
        "Faux. Une soutenance excellente suit un fil clair (besoin, architecture, démonstration ciblée, preuves de qualité, posture éthique, limites reconnues, réponses argumentées) ; elle ne se réduit pas à parcourir le rapport.",
    },
    {
      id: "n3-q13",
      kind: "categorize",
      title: "Composantes et pondération de la certification",
      instruction:
        "Associez chaque composante de l'évaluation à sa pondération dans le score global.",
      categories: ["30 %", "40 %", "20 %", "10 %"],
      items: [
        { label: "Contrôle continu sur les modules N3-M1 à N3-M5", category: "30 %" },
        { label: "Projet capstone individuel", category: "40 %" },
        { label: "Soutenance orale devant jury", category: "20 %" },
        { label: "QCM et contrôle pratique de validation", category: "10 %" },
      ],
      feedback:
        "Contrôle continu 30 %, projet capstone 40 % (composante la plus importante), soutenance 20 %, QCM et contrôle pratique 10 %. Le projet capstone reste le cœur de la certification.",
    },
    {
      id: "n3-q14",
      kind: "categorize",
      title: "Critères du barème du projet capstone",
      instruction:
        "Replacez chaque critère du projet capstone dans la bonne tranche de points du barème détaillé.",
      categories: ["8 points", "6 points", "5 points", "4 points", "2 points"],
      items: [
        { label: "Cadrage : besoin, public, objectifs SMART, périmètre, contraintes", category: "8 points" },
        { label: "Ingénierie pédagogique : ADDIE, storyboard, alignement constructif", category: "8 points" },
        { label: "LMS : structure, ressources, activités, évaluation, achèvement", category: "8 points" },
        { label: "IA : assistant/prompts, vérification, transparence, limites", category: "6 points" },
        { label: "Automatisation : flux utile, conditions, tests, maintenance", category: "5 points" },
        { label: "Données : indicateurs, tableau de bord, interprétation", category: "5 points" },
        { label: "Sécurité, protection des données et accessibilité", category: "4 points" },
        { label: "Documentation, cohérence graphique et qualité professionnelle", category: "4 points" },
        { label: "Test utilisateur et améliorations", category: "2 points" },
      ],
      feedback:
        "Le cadrage, l'ingénierie pédagogique et le LMS pèsent chacun 8 points ; l'IA 6 ; l'automatisation et les données 5 chacune ; la sécurité et la documentation 4 chacune ; le test utilisateur 2. Total : 50 points pour le projet capstone.",
    },
    {
      id: "n3-q15",
      kind: "order",
      title: "Le fil d'une soutenance réussie",
      instruction:
        "Remettez dans l'ordre les moments d'une soutenance excellente telle que décrite dans la solution de référence.",
      items: [
        "Présenter le besoin initial et le public cible",
        "Exposer l'architecture de la solution et les choix de conception",
        "Réaliser une démonstration ciblée du dispositif",
        "Présenter les preuves de qualité et les résultats du test",
        "Adopter une posture éthique et reconnaître les limites",
        "Répondre de façon argumentée aux questions du jury",
      ],
      feedback:
        "Une soutenance excellente suit un fil clair : besoin initial, architecture de solution, démonstration ciblée, preuves de qualité, posture éthique et limites reconnues, puis réponses argumentées aux questions.",
    },
    {
      id: "n3-q16",
      kind: "match",
      title: "Indicateurs du tableau de bord",
      instruction:
        "Associez chaque indicateur de suivi attendu à ce qu'il mesure dans le dispositif.",
      pairs: [
        { left: "Taux d'achèvement", right: "Part des apprenants ayant terminé le parcours ou l'activité" },
        { left: "Score moyen", right: "Niveau moyen de réussite aux évaluations" },
        { left: "Taux d'inactivité", right: "Part des apprenants ne s'étant pas connectés ou n'ayant pas progressé" },
        { left: "Taux de remédiation réalisée", right: "Part des actions de remédiation effectivement menées auprès des apprenants à risque" },
      ],
      feedback:
        "Les indicateurs attendus doivent être calculables et utiles : taux d'achèvement, score moyen, taux d'inactivité et taux de remédiation réalisée permettent de repérer les apprenants à risque et de piloter l'accompagnement.",
    },
  ],
  projet: {
    title: "Projet capstone individuel — Dispositif numérique professionnel complet",
    brief:
      "Le candidat choisit ou reçoit un thème professionnel et produit un <strong>dispositif numérique complet</strong>, cohérent, utile, sécurisé, documenté et défendable. Thème imposé possible : <em>concevoir un dispositif numérique de formation pour renforcer les compétences des enseignants dans l'usage responsable de l'IA et des outils collaboratifs</em>. Le projet capstone vaut <strong>40 % du score global</strong> et sa validation par le jury est obligatoire pour obtenir le certificat.",
    consignes: [
      "Rédiger une note de cadrage : besoin, public, objectifs SMART, périmètre et contraintes.",
      "Produire un cahier des charges pédagogique et un storyboard alignés selon la démarche ADDIE et l'alignement constructif.",
      "Construire un espace LMS fonctionnel : structure, ressources, activités, évaluation et conditions d'achèvement.",
      "Concevoir des activités et un quiz avec feedback, ainsi qu'un assistant IA ou une bibliothèque de prompts documentés (rôle, limites, prompts, vérification).",
      "Mettre en place un flux automatisé utile, conditionnel, testé et maintenable.",
      "Construire un tableau de bord décisionnel à partir d'indicateurs pertinents et interpréter les données.",
      "Joindre une note de transparence sur l'usage de l'IA, une politique de protection des données, une charte d'accessibilité minimale, une preuve de test utilisateur et une grille d'auto-évaluation.",
      "Fournir une documentation technique et d'usage ainsi qu'un support de soutenance.",
    ],
    bareme: [
      { critere: "Cadrage : besoin, public, objectifs SMART, périmètre, contraintes", points: "8 points" },
      { critere: "Ingénierie pédagogique : ADDIE, storyboard, alignement constructif", points: "8 points" },
      { critere: "LMS : structure, ressources, activités, évaluation, achèvement", points: "8 points" },
      { critere: "IA : assistant/prompts, vérification, transparence, limites", points: "6 points" },
      { critere: "Automatisation : flux utile, conditions, tests, maintenance", points: "5 points" },
      { critere: "Données : indicateurs, tableau de bord, interprétation", points: "5 points" },
      { critere: "Sécurité, protection des données et accessibilité", points: "4 points" },
      { critere: "Documentation, cohérence graphique et qualité professionnelle", points: "4 points" },
      { critere: "Test utilisateur et améliorations", points: "2 points" },
    ],
  },
  miseEnSituation: {
    title: "Mise en situation pratique chronométrée",
    brief:
      "Le candidat reçoit un <strong>besoin court</strong> et doit produire, dans le temps imparti, une mini-architecture de parcours, paramétrer ou décrire une activité LMS, rédiger un prompt expert, proposer un flux automatisé et construire deux indicateurs dans un tableur. Consigne type : <em>à partir du besoin « suivre et accompagner des apprenants adultes dans une formation hybride », proposez un mini-dispositif composé d'une séquence LMS, d'un quiz avec feedback, d'un prompt d'assistant tuteur, d'un flux d'alerte pour apprenant en difficulté et de deux indicateurs de tableau de bord</em>. La correction valorise la méthode, la cohérence, la sécurité, le respect du temps et la justification.",
    consignes: [
      "Concevoir un mini-scénario pédagogique cohérent répondant au besoin donné.",
      "Paramétrer ou décrire une activité LMS et un quiz avec un feedback pertinent.",
      "Rédiger un prompt d'assistant tuteur clair et responsable (rôle, limites, vérification).",
      "Proposer un flux automatisé logique signalant les apprenants à risque sur des critères explicites et déclenchant une remédiation.",
      "Construire deux indicateurs calculables et utiles dans un tableur (par exemple taux d'achèvement, score moyen, taux d'inactivité, taux de remédiation réalisée) et les interpréter.",
      "Documenter rapidement le rôle de l'IA et les mesures de protection des données, et respecter le temps imparti.",
    ],
    bareme: [
      { critere: "Mini-scénario pédagogique cohérent", points: "15 points" },
      { critere: "Activité LMS et quiz avec feedback pertinent", points: "15 points" },
      { critere: "Prompt expert clair et responsable", points: "10 points" },
      { critere: "Flux automatisé logique avec conditions", points: "10 points" },
      { critere: "Indicateurs et interprétation", points: "10 points" },
      { critere: "Respect du temps, clarté et documentation rapide", points: "10 points" },
    ],
    duree: "2 h 30 chronométrées",
  },
};
