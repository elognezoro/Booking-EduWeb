import type { N1Module } from "../niveau1/types";

/** Niveau 3 — Module 1 : Ingénierie pédagogique numérique et scénarisation. */
export const MODULE_1: N1Module = {
  code: "N3-M1",
  slug: "module-1",
  num: 1,
  title: "Ingénierie pédagogique numérique et scénarisation",
  subtitle:
    "Concevoir un dispositif de formation en ligne complet : du besoin au scénario aligné, piloté par ADDIE.",
  duration: "20 heures · 2 semaines",
  finalite:
    "Concevoir des dispositifs de formation en ligne complets en mobilisant les méthodes d'ingénierie pédagogique, le modèle ADDIE, l'alignement constructif et la scénarisation d'activités interactives complexes.",
  objectives: [
    "Analyser un besoin de formation et formaliser un cahier des charges pédagogique.",
    "Appliquer le modèle ADDIE pour structurer un dispositif numérique.",
    "Formuler des objectifs pédagogiques opérationnels avec la taxonomie de Bloom révisée.",
    "Concevoir un scénario pédagogique aligné : objectifs, activités, ressources, évaluation.",
    "Évaluer la qualité d'un dispositif au regard de DigCompEdu et des exigences d'accessibilité.",
  ],
  competences: [
    { group: "Conception", text: "C18 — Concevoir des activités interactives complexes et scénarisées, en organisant la progression et la granularisation du parcours." },
    { group: "Intelligence artificielle", text: "C25 — Intégrer l'IA dans l'ingénierie pédagogique et la production professionnelle, avec une posture centrée sur l'humain, la vérification et la transparence." },
    { group: "Déploiement", text: "C27 — Concevoir et déployer un parcours de formation en ligne complet, de l'analyse du besoin à l'évaluation des effets." },
    { group: "Transversales", text: "Justifier, ajuster et documenter ses décisions professionnelles ; auditer un dispositif et proposer des améliorations prioritaires." },
  ],
  lessons: [
    {
      id: "seq-1",
      title: "Du contenu isolé au dispositif de formation",
      icon: "Layers",
      blocks: [
        { type: "text", html: "Un dispositif numérique ne se réduit pas à une <strong>collection de fichiers</strong> déposés en ligne. Il organise un parcours : un public cible, un besoin, des objectifs, des ressources, des activités, des interactions, des évaluations et un accompagnement. L'apprenant ne doit pas seulement consulter des contenus ; il doit <strong>progresser</strong>, s'exercer, recevoir des retours et prouver sa compétence." },
        { type: "text", html: "Le concepteur pédagogique agit comme un <strong>architecte</strong>. Il analyse le contexte, choisit les méthodes, prévoit les contraintes, organise la progression et vérifie que chaque élément sert l'apprentissage. Cette logique évite les plateformes remplies de documents sans parcours, sans consignes et sans indicateurs de réussite." },
        { type: "infographic", kind: "two-columns", title: "Tas de fichiers ou dispositif ?", data: { left: { title: "Tas de fichiers", subtitle: "ce qu'il faut éviter", items: ["PDF déposés en vrac", "Aucune consigne d'activité", "Pas d'objectifs annoncés", "Pas d'évaluation", "Aucun indicateur de progression", "Apprenant livré à lui-même"] }, right: { title: "Dispositif scénarisé", subtitle: "ce que l'on vise", items: ["Public et besoin identifiés", "Objectifs opérationnels", "Ressources contextualisées", "Activités et interactions", "Évaluations alignées", "Suivi et accompagnement"] } } },
        { type: "callout", tone: "info", title: "Point d'attention du formateur", text: "Faire verbaliser la logique de choix par les apprenants. Au niveau 3, la compétence ne se limite pas à appliquer une procédure ; elle consiste à expliquer, ajuster et justifier une décision professionnelle." },
      ],
    },
    {
      id: "seq-2",
      title: "Analyser le besoin et formaliser le cahier des charges",
      icon: "ClipboardList",
      blocks: [
        { type: "text", html: "L'analyse du besoin identifie le <strong>problème de départ</strong> : manque de compétence, nouvelle mission, obligation institutionnelle, transformation numérique, besoin d'autonomie ou préparation à une certification. Cette étape oblige à distinguer la <em>demande exprimée</em> du <em>besoin réel</em>." },
        { type: "text", html: "Le <strong>cahier des charges pédagogique</strong> précise le public, les prérequis, les objectifs, la durée, les modalités, les ressources disponibles, les contraintes techniques, les rôles et les indicateurs de succès. Il doit être assez clair pour guider la production, mais assez souple pour permettre les ajustements." },
        { type: "infographic", kind: "categories", title: "Les rubriques d'un cahier des charges", data: { columns: [
          { title: "Public & contexte", accent: "#0891B2", items: [{ label: "Public cible" }, { label: "Prérequis" }, { label: "Contexte institutionnel" }] },
          { title: "Conception", accent: "#6D5DF5", items: [{ label: "Objectifs" }, { label: "Durée et modalités" }, { label: "Ressources disponibles" }] },
          { title: "Pilotage", accent: "#16A34A", items: [{ label: "Contraintes techniques" }, { label: "Rôles" }, { label: "Indicateurs de succès" }] },
        ] } },
        { type: "callout", tone: "tip", title: "Demande ou besoin ?", text: "Une demande peut masquer un besoin différent. « Il faut une vidéo » est une demande ; le besoin réel peut être « les agents ne savent pas configurer un devoir en ligne ». L'analyse remonte au problème, pas à la solution proposée." },
      ],
    },
    {
      id: "seq-3",
      title: "Le modèle ADDIE comme fil conducteur",
      icon: "Workflow",
      blocks: [
        { type: "text", html: "ADDIE organise l'ingénierie en cinq moments : <strong>analyse</strong>, <strong>design</strong>, <strong>développement</strong>, <strong>implémentation</strong> et <strong>évaluation</strong>. L'analyse clarifie le besoin ; le design construit la solution ; le développement produit les ressources ; l'implémentation met le dispositif en service ; l'évaluation mesure la qualité et les effets." },
        { type: "infographic", kind: "steps", title: "Les cinq étapes d'ADDIE", data: { steps: [
          { title: "Analyse", text: "clarifier le besoin, le public et les contraintes" },
          { title: "Design", text: "construire la solution et le scénario" },
          { title: "Développement", text: "produire les ressources et activités" },
          { title: "Implémentation", text: "mettre le dispositif en service" },
          { title: "Évaluation", text: "mesurer la qualité et les effets" },
        ] } },
        { type: "text", html: "Dans un projet numérique, ADDIE n'est pas une suite rigide. Il fonctionne de manière <strong>itérative</strong> : une évaluation pilote peut conduire à reformuler un objectif, à simplifier une ressource ou à ajuster un quiz. L'important est de <em>documenter les choix</em> et de conserver la cohérence du parcours." },
        { type: "callout", tone: "info", title: "Point d'attention du formateur", text: "Faire verbaliser la logique de choix par les apprenants. Au niveau 3, la compétence consiste à expliquer, ajuster et justifier une décision professionnelle, pas seulement à dérouler une procédure." },
      ],
    },
    {
      id: "seq-4",
      title: "Objectifs opérationnels et alignement constructif",
      icon: "Target",
      blocks: [
        { type: "text", html: "Un <strong>objectif opérationnel</strong> précise ce que l'apprenant sera capable de faire, dans quelles conditions et avec quel niveau d'exigence. Les verbes vagues comme <em>comprendre</em> ou <em>connaître</em> doivent être traduits en actions observables : identifier, produire, configurer, analyser, argumenter, diagnostiquer, concevoir." },
        { type: "infographic", kind: "table", title: "Du verbe vague à l'objectif observable", data: { columns: ["Objectif vague", "Objectif opérationnel"], rows: [
          ["Connaître Moodle", "Configurer un devoir Moodle avec consigne, date limite et barème"],
          ["Comprendre l'IA", "Comparer deux réponses d'IA et signaler trois risques d'erreur"],
          ["Maîtriser Excel", "Construire un tableau Excel avec SOMME, MOYENNE, SI et un graphique commenté"],
        ] } },
        { type: "text", html: "L'<strong>alignement constructif</strong> exige que les objectifs, les activités et les évaluations soient cohérents. Si l'objectif est de concevoir un quiz numérique, l'évaluation ne peut pas se limiter à une définition : elle doit faire <strong>produire, tester et justifier</strong> un quiz." },
        { type: "infographic", kind: "tree", title: "Le trio aligné (exemple : créer un quiz)", data: { root: "Objectif : créer un quiz de 10 questions avec feedback", nodes: [
          { label: "Activité : atelier de paramétrage et test par pairs" },
          { label: "Évaluation : quiz fonctionnel évalué par grille" },
        ] } },
        { type: "callout", tone: "example", title: "Le bon réflexe", text: "L'apprenant fait, dans l'évaluation, exactement ce qui est annoncé dans l'objectif. Si l'objectif demande de produire, l'évaluation doit faire produire — pas réciter." },
      ],
    },
    {
      id: "seq-5",
      title: "Scénarisation, granularisation et storyboard",
      icon: "Film",
      blocks: [
        { type: "text", html: "La <strong>scénarisation</strong> transforme un objectif général en une suite de séquences. Chaque séquence comprend une intention, une ressource, une activité, un temps d'apprentissage, un mode d'interaction et une trace. La <strong>granularisation</strong> découpe le parcours en grains utiles, courts et réutilisables." },
        { type: "text", html: "Le <strong>storyboard</strong> de module est une matrice. Il décrit les écrans, les consignes, les ressources, les activités, les feedbacks, les livrables et les critères d'évaluation. Il permet de dialoguer avec les formateurs, les techniciens LMS, les graphistes et les responsables institutionnels." },
        { type: "infographic", kind: "table", title: "Une matrice de storyboard", data: { columns: ["Écran", "Intention", "Ressource", "Activité", "Feedback", "Trace / Livrable"], rows: [
          ["1", "Annoncer les objectifs", "Page de présentation", "Lecture guidée", "—", "Accusé de lecture"],
          ["2", "Faire manipuler", "Tutoriel + exemple", "Atelier dirigé", "Auto-correction", "Production partielle"],
          ["3", "Évaluer", "Consigne + grille", "Quiz / livrable", "Grille critériée", "Note + commentaire"],
        ] } },
        { type: "keypoints", title: "Ce qui définit un bon grain pédagogique", points: [
          "Court : il traite une intention claire à la fois.",
          "Réutilisable : il peut servir dans un autre parcours sans réécriture.",
          "Autonome : il se comprend avec sa consigne et sa trace.",
        ] },
        { type: "callout", tone: "info", title: "Point d'attention du formateur", text: "Faire verbaliser la logique de choix par les apprenants : pourquoi ce découpage, pourquoi cette interaction, pourquoi cette trace plutôt qu'une autre." },
      ],
    },
    {
      id: "seq-6",
      title: "Qualité, inclusion et évaluation d'un dispositif",
      icon: "ShieldCheck",
      blocks: [
        { type: "text", html: "Un bon dispositif numérique est <strong>utile, lisible, accessible, mesurable et soutenable</strong>. La qualité ne se limite pas au design visuel ; elle concerne la clarté des consignes, la progression, l'accessibilité, la cohérence des évaluations et la capacité du dispositif à être actualisé." },
        { type: "infographic", kind: "rules", title: "Cinq qualités d'un dispositif", data: { rules: [
          { icon: "CheckCircle", title: "Utile", text: "Répond à un besoin réel et à des objectifs explicites." },
          { icon: "Eye", title: "Lisible", text: "Consignes claires, progression visible." },
          { icon: "Accessibility", title: "Accessible", text: "Utilisable par tous, y compris en situation de handicap." },
          { icon: "BarChart3", title: "Mesurable", text: "Évaluations cohérentes et indicateurs de réussite." },
          { icon: "RefreshCw", title: "Soutenable", text: "Maintenable et actualisable dans le temps." },
        ] } },
        { type: "text", html: "<strong>DigCompEdu</strong> aide à situer les compétences de l'éducateur : engagement professionnel, ressources numériques, enseignement-apprentissage, évaluation, autonomisation des apprenants et développement des compétences numériques des apprenants. La progression du module s'inscrit aussi dans les repères de <strong>DigComp 2.2</strong> pour les compétences citoyennes." },
        { type: "infographic", kind: "categories", title: "Les six domaines de DigCompEdu", data: { columns: [
          { title: "Posture & ressources", accent: "#0891B2", items: [{ label: "Engagement professionnel" }, { label: "Ressources numériques" }] },
          { title: "Pratiques", accent: "#6D5DF5", items: [{ label: "Enseignement-apprentissage" }, { label: "Évaluation" }] },
          { title: "Apprenants", accent: "#16A34A", items: [{ label: "Autonomisation des apprenants" }, { label: "Compétences numériques des apprenants" }] },
        ] } },
        { type: "callout", tone: "warn", title: "Usage de l'IA", text: "Pour les usages d'IA, le module adopte une posture centrée sur l'humain : vérification systématique des productions, transparence sur le recours à l'IA et protection des données." },
      ],
    },
  ],
  exercises: [
    {
      id: "f1", kind: "order", title: "Ordonner les étapes d'ADDIE",
      instruction: "Remettez les cinq étapes du modèle ADDIE dans l'ordre.",
      items: ["Analyse", "Design", "Développement", "Implémentation", "Évaluation"],
      feedback: "ADDIE enchaîne analyse, design, développement, implémentation et évaluation — de façon itérative : une évaluation pilote peut faire revenir sur les étapes précédentes.",
    },
    {
      id: "f2", kind: "match", title: "Reformuler en objectifs observables",
      instruction: "Associez chaque objectif vague à sa reformulation opérationnelle.",
      pairs: [
        { left: "Connaître Moodle", right: "Configurer un devoir Moodle avec consigne, date limite et barème" },
        { left: "Comprendre l'IA", right: "Comparer deux réponses d'IA et signaler trois risques d'erreur" },
        { left: "Maîtriser Excel", right: "Construire un tableau Excel avec SOMME, MOYENNE, SI et un graphique commenté" },
      ],
      feedback: "Un objectif utile valorise un verbe observable, un contexte et un critère de réussite. Les exemples acceptables transforment un verbe vague en action mesurable.",
    },
    {
      id: "f3", kind: "categorize", title: "À quelle étape d'ADDIE ?",
      instruction: "Classez chaque action dans l'étape d'ADDIE correspondante.",
      categories: ["Analyse", "Design", "Développement", "Implémentation", "Évaluation"],
      items: [
        { label: "Identifier le public et les contraintes", category: "Analyse" },
        { label: "Construire le scénario et le storyboard", category: "Design" },
        { label: "Produire les ressources et les quiz", category: "Développement" },
        { label: "Mettre le dispositif en service sur le LMS", category: "Implémentation" },
        { label: "Mesurer la qualité et les effets", category: "Évaluation" },
      ],
      feedback: "Chaque action relève d'un moment précis d'ADDIE : on clarifie (analyse), on conçoit (design), on produit (développement), on déploie (implémentation), puis on mesure (évaluation).",
    },
    {
      id: "f4", kind: "qcm", multiple: true, title: "Un cahier des charges complet",
      instruction: "Quelles rubriques doivent figurer dans un cahier des charges pédagogique ?",
      options: [
        { text: "Le public et les prérequis", correct: true },
        { text: "Les objectifs et les modalités", correct: true },
        { text: "La couleur du logo du site", correct: false },
        { text: "Les contraintes techniques et les indicateurs de succès", correct: true },
        { text: "La marque de l'ordinateur du formateur", correct: false },
      ],
      feedback: "Le cahier des charges cadre le public, les objectifs, la durée, les modalités, les ressources, les contraintes, les rôles et les indicateurs de succès — pas des détails esthétiques sans valeur pédagogique.",
    },
    { id: "q1", kind: "qcm", title: "L'étape d'analyse dans ADDIE", instruction: "Dans ADDIE, l'étape d'analyse sert principalement à :", options: [{ text: "Produire les fichiers définitifs", correct: false }, { text: "Clarifier le besoin, le public et les contraintes", correct: true }, { text: "Imprimer le cours", correct: false }, { text: "Choisir une police", correct: false }], feedback: "Réponse B. L'analyse permet de comprendre le problème de formation avant toute production." },
    { id: "q2", kind: "qcm", title: "Un objectif opérationnel", instruction: "Un objectif opérationnel doit être :", options: [{ text: "Vague et ambitieux", correct: false }, { text: "Formulé uniquement avec « comprendre »", correct: false }, { text: "Observable et évaluable", correct: true }, { text: "Réservé au formateur", correct: false }], feedback: "Réponse C. Un objectif utile indique une action observable et un niveau attendu." },
    { id: "q3", kind: "qcm", title: "L'alignement constructif", instruction: "L'alignement constructif vérifie la cohérence entre :", options: [{ text: "Logo, couleur et photo", correct: false }, { text: "Objectifs, activités et évaluations", correct: true }, { text: "Ordinateur, projecteur et table", correct: false }, { text: "Mail, mot de passe et cloud", correct: false }], feedback: "Réponse B. Le principe central est la cohérence pédagogique entre objectifs, activités et évaluations." },
    { id: "q4", kind: "qcm", title: "Le storyboard pédagogique", instruction: "Un storyboard pédagogique décrit surtout :", options: [{ text: "La liste des absences", correct: false }, { text: "La progression détaillée des séquences et activités", correct: true }, { text: "Le budget de restauration", correct: false }, { text: "La marque de l'ordinateur", correct: false }], feedback: "Réponse B. Il sert à prévisualiser le parcours avant production." },
    { id: "q5", kind: "qcm", title: "La granularisation", instruction: "La granularisation consiste à :", options: [{ text: "Rendre les vidéos plus lourdes", correct: false }, { text: "Découper le cours en grains pédagogiques cohérents", correct: true }, { text: "Supprimer les évaluations", correct: false }, { text: "Remplacer le formateur", correct: false }], feedback: "Réponse B. Elle facilite la progression, la réutilisation et l'adaptation." },
    { id: "q6", kind: "qcm", title: "Un dispositif de qualité", instruction: "Un dispositif numérique de qualité doit être :", options: [{ text: "Uniquement beau", correct: false }, { text: "Cohérent, accessible et évaluable", correct: true }, { text: "Sans consignes", correct: false }, { text: "Réservé aux experts", correct: false }], feedback: "Réponse B. La qualité porte sur l'usage, la progression, l'accessibilité et l'évaluation." },
    { id: "q7", kind: "qcm", title: "La taxonomie de Bloom révisée", instruction: "La taxonomie de Bloom révisée aide à :", options: [{ text: "Classer les objectifs par niveaux cognitifs", correct: true }, { text: "Installer un LMS", correct: false }, { text: "Compresser un PDF", correct: false }, { text: "Dessiner un logo", correct: false }], feedback: "Réponse A. Elle aide à formuler des objectifs de niveaux différents." },
    { id: "q8", kind: "qcm", title: "Le cahier des charges", instruction: "Un cahier des charges pédagogique doit préciser :", options: [{ text: "Le besoin, le public, les objectifs et les contraintes", correct: true }, { text: "Uniquement la couleur du site", correct: false }, { text: "Uniquement la liste des enseignants", correct: false }, { text: "Uniquement le nom du fichier", correct: false }], feedback: "Réponse A. Il cadre la conception et les critères de qualité." },
    { id: "q9", kind: "qcm", title: "Une évaluation authentique", instruction: "Une évaluation authentique demande à l'apprenant de :", options: [{ text: "Réciter seulement une définition", correct: false }, { text: "Produire une action proche d'une situation réelle", correct: true }, { text: "Copier une correction", correct: false }, { text: "Ouvrir une fenêtre", correct: false }], feedback: "Réponse B. Elle évalue la compétence en contexte." },
    { id: "q10", kind: "qcm", title: "DigCompEdu", instruction: "DigCompEdu concerne principalement :", options: [{ text: "Les compétences numériques des éducateurs", correct: true }, { text: "La comptabilité nationale", correct: false }, { text: "Le dessin industriel", correct: false }, { text: "La maintenance automobile", correct: false }], feedback: "Réponse A. Le référentiel organise les compétences numériques professionnelles des enseignants et formateurs." },
    { id: "q11", kind: "truefalse", title: "ADDIE est-il rigide ?", instruction: "Vrai ou faux ?", statement: "Dans un projet numérique, ADDIE doit être appliqué comme une suite rigide, sans retour en arrière possible.", answer: false, feedback: "Faux : ADDIE fonctionne de manière itérative. Une évaluation pilote peut conduire à reformuler un objectif, simplifier une ressource ou ajuster un quiz." },
    { id: "q12", kind: "truefalse", title: "Déposer des PDF suffit-il ?", instruction: "Vrai ou faux ?", statement: "Déposer une collection de PDF en ligne suffit à constituer un dispositif de formation.", answer: false, feedback: "Faux : un dispositif organise un parcours (objectifs, activités, interactions, évaluations, accompagnement). Un simple tas de fichiers n'est pas un dispositif." },
    { id: "q13", kind: "qcm", title: "Demande et besoin", instruction: "Lors de l'analyse, il faut surtout :", options: [{ text: "Réaliser la première solution demandée", correct: false }, { text: "Distinguer la demande exprimée du besoin réel", correct: true }, { text: "Choisir tout de suite un outil", correct: false }, { text: "Reporter l'analyse après la production", correct: false }], feedback: "L'analyse remonte au problème de départ : elle distingue la demande exprimée du besoin réel avant de concevoir la solution." },
    { id: "q14", kind: "qcm", title: "Posture sur l'IA", instruction: "Pour les usages d'IA, le module adopte une posture :", options: [{ text: "Automatique et sans contrôle", correct: false }, { text: "Centrée sur l'humain, la vérification et la transparence", correct: true }, { text: "Opposée à tout usage de l'IA", correct: false }, { text: "Réservée aux seuls techniciens", correct: false }], feedback: "La posture attendue place l'humain au centre : vérification des productions, transparence du recours à l'IA et protection des données." },
  ],
  caseStudy: {
    title: "Étude de cas — Plateforme remplie de fichiers mais peu utilisée",
    scenario:
      "Un établissement a ouvert un espace de cours en ligne. Les formateurs y déposent des PDF, mais les apprenants ne savent pas quoi faire : les consignes sont absentes et aucun indicateur ne permet de suivre la progression.",
    questions: [
      "Identifiez les problèmes d'ingénierie pédagogique.",
      "Proposez trois améliorations prioritaires.",
      "Expliquez comment ADDIE aiderait à reconstruire le dispositif.",
    ],
    corrige: [
      "Problèmes : absence de scénario, ressources non contextualisées, consignes insuffisantes, évaluation faible et suivi inexistant.",
      "Améliorations : structurer le parcours en séquences ; ajouter des objectifs et des consignes claires ; intégrer des activités et des évaluations, et configurer l'achèvement pour suivre la progression.",
      "ADDIE permet de reprendre l'analyse du besoin, de redessiner (design) le parcours, de produire (développement) les ressources manquantes, de déployer (implémentation) puis d'évaluer la qualité et les effets — en documentant chaque choix.",
    ],
  },
};
