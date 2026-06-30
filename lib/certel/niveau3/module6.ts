import type { N1Module } from "../niveau1/types";

/** Niveau 3 — Module 6 : Conduite de projet numérique et livrable professionnel. */
export const MODULE_6: N1Module = {
  code: "N3-M6",
  slug: "module-6",
  num: 6,
  title: "Conduite de projet numérique et livrable professionnel",
  subtitle:
    "Le capstone : cadrer, piloter, intégrer et soutenir un projet numérique complet, du besoin au livrable certifiant.",
  duration: "10 heures · 1 semaine",
  finalite:
    "Mobiliser toutes les compétences du niveau dans la conduite d'un projet numérique de bout en bout, jusqu'à la production, la documentation et la soutenance d'un livrable professionnel complet.",
  objectives: [
    "Cadrer un projet numérique : objectifs, périmètre, parties prenantes et planning.",
    "Piloter le projet avec des méthodes et outils de gestion adaptés.",
    "Intégrer ingénierie, LMS, IA, automatisation et données dans un livrable cohérent.",
    "Produire un livrable numérique professionnel complet et documenté.",
    "Soutenir et argumenter ses choix de conception devant un jury.",
  ],
  competences: [
    { group: "Cadrage et pilotage", text: "Rédiger une note de cadrage (problème, bénéficiaires, objectifs SMART, périmètre, livrables, contraintes, risques) et piloter le projet avec des jalons et des points d'avancement (Kanban, Gantt, tableaux de suivi)." },
    { group: "Intégration des briques", text: "Assembler de façon cohérente scénarisation, espace LMS, activités, assistant IA ou bibliothèque de prompts, automatisation, tableau de bord et documentation, chaque brique servant le besoin initial." },
    { group: "Qualité et responsabilité", text: "Documenter le dispositif pour le rendre transmissible et maintenable, vérifier la qualité par une grille (pertinence, accessibilité, sécurité, fiabilité des données) et intégrer l'IA de manière vérifiée et transparente." },
    { group: "Soutenance et transfert", text: "Présenter et argumenter le projet devant un jury (problème, solution, démonstration, résultats, limites, perspectives) et transférer la méthode vers une situation professionnelle réelle." },
  ],
  lessons: [
    {
      id: "seq-1",
      title: "Cadrer le projet",
      icon: "Target",
      blocks: [
        { type: "text", html: "Un projet numérique certifiant commence par une <strong>note de cadrage</strong>. Elle précise le problème, les bénéficiaires, les objectifs SMART, le périmètre, les livrables, les contraintes, les risques, les ressources et les critères de réussite." },
        { type: "text", html: "Le cadrage protège le projet contre la <strong>dispersion</strong>. Sans périmètre, l'apprenant veut tout faire et ne termine rien. Avec un périmètre clair, il peut produire un livrable cohérent, testable et soutenable." },
        { type: "infographic", kind: "categories", title: "Les rubriques d'une note de cadrage", data: { columns: [
          { title: "Pourquoi", accent: "#6D5DF5", items: [{ label: "Problème à résoudre" }, { label: "Bénéficiaires / public" }, { label: "Objectifs SMART" }] },
          { title: "Quoi", accent: "#0891B2", items: [{ label: "Périmètre" }, { label: "Livrables attendus" }, { label: "Critères de réussite" }] },
          { title: "Comment", accent: "#16A34A", items: [{ label: "Ressources" }, { label: "Contraintes" }, { label: "Risques" }] },
        ] } },
        { type: "callout", tone: "tip", title: "Point d'attention du formateur", text: "Faire verbaliser la logique de choix par les apprenants. Au niveau 3, la compétence ne se limite pas à appliquer une procédure ; elle consiste à expliquer, ajuster et justifier une décision professionnelle." },
        { type: "infographic", kind: "pattern", title: "La grille SMART d'un objectif", data: { pattern: "Spécifique · Mesurable · Atteignable · Réaliste · Temporel", examples: [
          "D'ici quatre semaines, concevoir et tester un module LMS de deux séquences sur la sécurité numérique.",
          "Le module comprend deux ressources, une activité interactive, un quiz noté et un tableau de suivi.",
        ] } },
      ],
    },
    {
      id: "seq-2",
      title: "Planifier et piloter",
      icon: "GanttChartSquare",
      blocks: [
        { type: "text", html: "Le pilotage exige un <strong>planning</strong>, des <strong>jalons</strong> et des points d'avancement. Les outils Kanban, Gantt ou de simples tableaux de suivi permettent de visualiser les tâches, les priorités, les retards et les dépendances." },
        { type: "infographic", kind: "two-columns", title: "Deux manières de visualiser le travail", data: { left: { title: "Kanban", subtitle: "flux des tâches", items: ["Colonne À faire", "Colonne En cours", "Colonne À vérifier", "Colonne Terminé", "Limite de tâches en cours"] }, right: { title: "Gantt", subtitle: "calendrier des jalons", items: ["Tâches dans le temps", "Jalons (points de contrôle)", "Dépendances entre tâches", "Durées et échéances", "Suivi des retards"] } } },
        { type: "text", html: "La <strong>gestion des risques</strong> consiste à anticiper les obstacles : accès au LMS, indisponibilité de données, problème de droits, qualité insuffisante des ressources, outil IA indisponible ou difficulté de soutenance." },
        { type: "callout", tone: "warn", title: "Un risque sans mitigation ne sert à rien", text: "Identifier un risque ne suffit pas : chaque risque doit être accompagné d'une mesure de mitigation (solution de repli, vérification, réduction du périmètre)." },
        { type: "infographic", kind: "table", title: "Quelques risques et leur mitigation", data: { columns: ["Risque", "Mesure de mitigation"], rows: [
          ["Données indisponibles", "Préparer un jeu de données de secours documenté"],
          ["Droits insuffisants", "Demander les accès en amont, prévoir une alternative"],
          ["Réponses IA non vérifiées", "Relire et valider chaque sortie avant usage"],
          ["Surcharge de fonctionnalités", "Réduire le périmètre au besoin essentiel"],
          ["Faible test utilisateur", "Planifier une relecture par pairs"],
        ] } },
      ],
    },
    {
      id: "seq-3",
      title: "Assembler les briques du livrable",
      icon: "Blocks",
      blocks: [
        { type: "text", html: "Le projet final doit intégrer plusieurs briques : dossier de scénarisation, espace LMS, activités, assistant IA ou bibliothèque de prompts, automatisation, tableau de bord et documentation. La <strong>cohérence</strong> entre les briques est plus importante que leur quantité." },
        { type: "infographic", kind: "tree", title: "Les briques d'un livrable intégré", data: { root: "Projet_Numerique_Capstone", nodes: [
          { label: "Conception", children: [{ label: "Note_de_cadrage" }, { label: "Scenario_pedagogique" }] },
          { label: "Dispositif", children: [{ label: "Espace_LMS_et_activites" }, { label: "Assistant_IA_ou_prompts" }, { label: "Automatisation" }, { label: "Tableau_de_bord" }] },
          { label: "Documentation", children: [{ label: "Doc_technique" }, { label: "Charte_responsable" }, { label: "Support_soutenance" }] },
        ] } },
        { type: "text", html: "Chaque brique doit <strong>servir le besoin initial</strong>. Un tableau de bord sans décision, une IA sans vérification, un LMS sans activité ou une automatisation sans utilité affaiblissent le projet." },
        { type: "callout", tone: "example", title: "Le fil rouge de la cohérence", text: "Le besoin initial doit se retrouver dans le scénario, les activités, le LMS, l'IA, l'automatisation et le tableau de bord : c'est ce fil rouge qui transforme un assemblage d'outils en un projet professionnel." },
      ],
    },
    {
      id: "seq-4",
      title: "Documenter et assurer la qualité",
      icon: "FileCheck",
      blocks: [
        { type: "text", html: "La <strong>documentation</strong> rend le projet transmissible. Elle explique l'objectif, les choix, les paramétrages, les sources, les droits, l'usage de l'IA, la protection des données, les tests et les limites. Elle permet à un autre professionnel de comprendre et de maintenir le dispositif." },
        { type: "keypoints", title: "Ce que doit expliciter la documentation", points: [
          "L'objectif et les choix de conception, avec leur justification.",
          "Les paramétrages, les sources et les droits utilisés.",
          "L'usage de l'IA et la protection des données.",
          "Les tests réalisés et les limites connues du dispositif.",
        ] },
        { type: "text", html: "La <strong>qualité finale</strong> se vérifie par une grille : pertinence, cohérence, accessibilité, sécurité, ergonomie, évaluation, fiabilité des données, soutenabilité et impact attendu." },
        { type: "infographic", kind: "rules", title: "Une grille de qualité du livrable", data: { rules: [
          { icon: "Compass", title: "Pertinence et cohérence", text: "Le dispositif répond au besoin et ses briques s'alignent entre elles." },
          { icon: "Accessibility", title: "Accessibilité et ergonomie", text: "Le parcours est lisible, navigable et utilisable par le public visé." },
          { icon: "ShieldCheck", title: "Sécurité et données", text: "Les droits, la protection des données et l'usage de l'IA sont maîtrisés." },
          { icon: "Repeat", title: "Soutenabilité et impact", text: "Le dispositif est testé, maintenable et produit l'effet attendu." },
        ] } },
      ],
    },
    {
      id: "seq-5",
      title: "Soutenance professionnelle",
      icon: "Presentation",
      blocks: [
        { type: "text", html: "La soutenance n'est <strong>pas une lecture du rapport</strong>. Elle doit présenter le problème, la solution, les choix de conception, une démonstration et les résultats. L'apprenant doit argumenter, reconnaître les limites et proposer des perspectives." },
        { type: "infographic", kind: "steps", title: "La trame d'une soutenance", data: { steps: [
          { title: "Problème", text: "le besoin et le public visé" },
          { title: "Solution", text: "le dispositif proposé" },
          { title: "Choix de conception", text: "justifiés par le besoin et les contraintes" },
          { title: "Démonstration", text: "le livrable en fonctionnement" },
          { title: "Résultats et limites", text: "ce qui marche, ce qui reste à améliorer" },
          { title: "Perspectives", text: "transfert et suites possibles" },
        ] } },
        { type: "text", html: "Le jury évalue <strong>autant le livrable que la capacité à justifier les décisions</strong>. Une bonne soutenance montre la maîtrise technique, pédagogique, éthique et stratégique du projet." },
        { type: "callout", tone: "tip", title: "Bilan réflexif", text: "Terminer par un bilan réflexif : analyser les acquis, les limites et les perspectives. Cette mise à distance soutient la professionnalisation et montre une posture mature." },
      ],
    },
    {
      id: "seq-6",
      title: "Audit, remédiation et trace écrite",
      icon: "ClipboardCheck",
      blocks: [
        { type: "text", html: "Avant la production finale, un temps de <strong>test et d'audit</strong> permet la relecture par pairs, l'application de la grille qualité, la correction et la stabilisation du livrable. Cette phase distingue un projet abouti d'un prototype fragile." },
        { type: "callout", tone: "info", title: "Remédiation", text: "La remédiation s'appuie sur un livrable incomplet ou fragile : le formateur fait identifier l'erreur, reformuler la décision attendue, corriger le livrable et expliquer la correction. L'approfondissement consiste à adapter le livrable à un autre public, contexte ou contrainte." },
        { type: "callout", tone: "tip", title: "Trace écrite à retenir", text: "Dans le module N3-M6, la compétence professionnelle se manifeste par une production utile, cohérente, testée, sécurisée et documentée. L'apprenant doit pouvoir justifier ses choix, corriger les limites observées et transférer la méthode vers une situation réelle." },
        { type: "keypoints", title: "Quatre travaux pratiques du module", points: [
          "Atelier : rédiger une note de cadrage et un planning de projet.",
          "Accompagnement : points d'avancement et revues qualité itératives.",
          "Production : réaliser le livrable numérique intégré.",
          "Répétition : préparer et simuler la soutenance devant les pairs.",
        ] },
      ],
    },
  ],
  exercises: [
    {
      id: "f1", kind: "match", title: "Risques et mitigations",
      instruction: "Associez chaque risque projet à sa mesure de mitigation adaptée.",
      pairs: [
        { left: "Données indisponibles", right: "Préparer un jeu de données de secours documenté" },
        { left: "Droits d'accès insuffisants", right: "Demander les accès en amont et prévoir une alternative" },
        { left: "Réponses IA non vérifiées", right: "Relire et valider chaque sortie avant usage" },
        { left: "Surcharge de fonctionnalités", right: "Réduire le périmètre au besoin essentiel" },
      ],
      feedback: "Identifier un risque ne suffit pas : chaque risque doit être accompagné d'une mesure de mitigation concrète.",
    },
    {
      id: "f2", kind: "order", title: "Conduire le projet de bout en bout",
      instruction: "Remettez les grandes phases du projet dans le bon ordre.",
      items: ["Cadrer le projet (note de cadrage)", "Planifier et piloter (jalons, suivi)", "Assembler les briques du livrable", "Documenter et auditer la qualité", "Soutenir et argumenter devant le jury"],
      feedback: "On cadre d'abord, on planifie, on produit en assemblant les briques, on documente et on teste, puis on soutient le livrable.",
    },
    {
      id: "f3", kind: "categorize", title: "Trier les rubriques de cadrage",
      instruction: "Classez chaque élément selon qu'il répond à « Pourquoi », « Quoi » ou « Comment » dans la note de cadrage.",
      categories: ["Pourquoi", "Quoi", "Comment"],
      items: [
        { label: "Problème à résoudre", category: "Pourquoi" },
        { label: "Bénéficiaires et public", category: "Pourquoi" },
        { label: "Livrables attendus", category: "Quoi" },
        { label: "Critères de réussite", category: "Quoi" },
        { label: "Ressources disponibles", category: "Comment" },
        { label: "Contraintes et risques", category: "Comment" },
      ],
      feedback: "La note de cadrage répond au pourquoi (besoin, objectifs), au quoi (périmètre, livrables) et au comment (ressources, contraintes, risques).",
    },
    {
      id: "f4", kind: "qcm", multiple: true, title: "Un objectif SMART",
      instruction: "Parmi ces formulations, lesquelles constituent un objectif SMART exploitable ?",
      options: [
        { text: "Améliorer la formation en ligne", correct: false },
        { text: "D'ici quatre semaines, concevoir et tester un module LMS de deux séquences sur la sécurité numérique", correct: true },
        { text: "Faire mieux qu'avant", correct: false },
        { text: "Produire un module avec deux ressources, une activité interactive, un quiz noté et un tableau de suivi", correct: true },
      ],
      feedback: "Un objectif SMART est spécifique, mesurable, atteignable, réaliste et temporel : il rend l'objectif pilotable, contrairement aux formulations vagues.",
    },
    {
      id: "q1", kind: "qcm", title: "Rôle de la note de cadrage",
      instruction: "Une note de cadrage sert à :",
      options: [
        { text: "Définir objectifs, périmètre, livrables et contraintes", correct: true },
        { text: "Choisir seulement les couleurs", correct: false },
        { text: "Supprimer le planning", correct: false },
        { text: "Éviter l'évaluation", correct: false },
      ],
      feedback: "Réponse A. Elle fixe le cadre du projet.",
    },
    {
      id: "q2", kind: "qcm", title: "Un objectif SMART",
      instruction: "Un objectif SMART doit être :",
      options: [
        { text: "Spécifique, mesurable, atteignable, réaliste et temporel", correct: true },
        { text: "Vague et illimité", correct: false },
        { text: "Secret", correct: false },
        { text: "Uniquement décoratif", correct: false },
      ],
      feedback: "Réponse A. SMART rend l'objectif pilotable.",
    },
    {
      id: "q3", kind: "qcm", title: "Qu'est-ce qu'un jalon ?",
      instruction: "Un jalon est :",
      options: [
        { text: "Un point de contrôle important", correct: true },
        { text: "Une police", correct: false },
        { text: "Un mot de passe", correct: false },
        { text: "Un type de souris", correct: false },
      ],
      feedback: "Réponse A. Il permet de suivre l'avancement.",
    },
    {
      id: "q4", kind: "qcm", title: "Le projet capstone",
      instruction: "Un projet capstone doit démontrer :",
      options: [
        { text: "L'intégration des compétences du niveau", correct: true },
        { text: "Une seule commande clavier", correct: false },
        { text: "L'absence de documentation", correct: false },
        { text: "Un contenu non testé", correct: false },
      ],
      feedback: "Réponse A. Il valide la capacité globale.",
    },
    {
      id: "q5", kind: "qcm", title: "La documentation technique",
      instruction: "La documentation technique sert à :",
      options: [
        { text: "Rendre le dispositif compréhensible et maintenable", correct: true },
        { text: "Masquer les choix", correct: false },
        { text: "Allonger inutilement", correct: false },
        { text: "Supprimer les sources", correct: false },
      ],
      feedback: "Réponse A. Elle facilite le transfert et la maintenance.",
    },
    {
      id: "q6", kind: "qcm", title: "La soutenance professionnelle",
      instruction: "Une soutenance professionnelle doit inclure :",
      options: [
        { text: "Problème, solution, démonstration et justification", correct: true },
        { text: "Lecture mot à mot uniquement", correct: false },
        { text: "Absence de limites", correct: false },
        { text: "Aucun support", correct: false },
      ],
      feedback: "Réponse A. Le jury attend une argumentation.",
    },
    {
      id: "q7", kind: "qcm", title: "Traiter un risque projet",
      instruction: "Un risque projet doit être accompagné :",
      options: [
        { text: "D'une mesure de mitigation", correct: true },
        { text: "D'un silence", correct: false },
        { text: "D'un effacement", correct: false },
        { text: "D'une couleur", correct: false },
      ],
      feedback: "Réponse A. Identifier sans traiter ne suffit pas.",
    },
    {
      id: "q8", kind: "qcm", title: "Le livrable final",
      instruction: "Le livrable final doit être :",
      options: [
        { text: "Cohérent, utile, testé et documenté", correct: true },
        { text: "Un assemblage aléatoire", correct: false },
        { text: "Sans évaluation", correct: false },
        { text: "Sans sources", correct: false },
      ],
      feedback: "Réponse A. La qualité vient de l'intégration.",
    },
    {
      id: "q9", kind: "qcm", title: "Le bilan réflexif",
      instruction: "Le bilan réflexif permet :",
      options: [
        { text: "D'analyser les acquis, limites et perspectives", correct: true },
        { text: "De remplacer le livrable", correct: false },
        { text: "D'ignorer les erreurs", correct: false },
        { text: "De supprimer la soutenance", correct: false },
      ],
      feedback: "Réponse A. Il soutient la professionnalisation.",
    },
    {
      id: "q10", kind: "qcm", title: "Un choix de conception",
      instruction: "Un choix de conception doit être :",
      options: [
        { text: "Justifié par le besoin et les contraintes", correct: true },
        { text: "Caché", correct: false },
        { text: "Imposé sans raison", correct: false },
        { text: "Sans rapport avec l'objectif", correct: false },
      ],
      feedback: "Réponse A. La justification montre la maîtrise professionnelle.",
    },
    {
      id: "q11", kind: "truefalse", title: "Cohérence avant quantité",
      instruction: "Vrai ou faux ?",
      statement: "La cohérence entre les briques du livrable est plus importante que leur quantité.",
      answer: true,
      feedback: "Vrai : un tableau de bord sans décision, une IA sans vérification ou une automatisation sans utilité affaiblissent le projet, même nombreux.",
    },
    {
      id: "q12", kind: "truefalse", title: "Soutenance et lecture",
      instruction: "Vrai ou faux ?",
      statement: "Une soutenance professionnelle consiste à lire le rapport mot à mot.",
      answer: false,
      feedback: "Faux : la soutenance présente le problème, la solution, les choix, une démonstration et les résultats, et argumente les décisions.",
    },
    {
      id: "q13", kind: "categorize", title: "Briques utiles ou affaiblissantes",
      instruction: "Classez chaque situation selon qu'elle renforce ou affaiblit le projet.",
      categories: ["Renforce", "Affaiblit"],
      items: [
        { label: "Un tableau de bord qui éclaire une décision", category: "Renforce" },
        { label: "Une IA dont les sorties sont vérifiées", category: "Renforce" },
        { label: "Un LMS sans aucune activité", category: "Affaiblit" },
        { label: "Une automatisation sans utilité réelle", category: "Affaiblit" },
      ],
      feedback: "Chaque brique doit servir le besoin initial : une brique sans usage ni vérification affaiblit l'ensemble du livrable.",
    },
  ],
  caseStudy: {
    title: "Étude de cas — Projet impressionnant mais incohérent",
    scenario:
      "Un apprenant présente un LMS, un chatbot, un tableau de bord et une automatisation. Mais les outils ne répondent pas au même besoin, les données sont fictives sans explication et le jury ne voit pas la progression pédagogique.",
    questions: [
      "Quels défauts majeurs observez-vous ?",
      "Comment recentrer le projet ?",
      "Quel message de soutenance devrait être clarifié ?",
    ],
    corrige: [
      "Défauts : manque de cadrage, absence de cohérence entre les briques, données non justifiées et progression pédagogique faible.",
      "Recentrage : repartir du besoin, réduire le périmètre, aligner les briques sur cet objectif, documenter les données et tester le parcours.",
      "Soutenance : expliquer clairement le problème, le public, la solution et les critères de réussite pour montrer le fil rouge du projet.",
    ],
  },
};
