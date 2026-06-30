import type { N1Module } from "../niveau1/types";

/** Niveau 3 — Module 5 : Analyse de données et tableaux de bord décisionnels. */
export const MODULE_5: N1Module = {
  code: "N3-M5",
  slug: "module-5",
  num: 5,
  title: "Analyse de données et tableaux de bord décisionnels",
  subtitle:
    "Transformer des données brutes en information exploitable pour la décision : collecte, nettoyage, structuration, analyse par tableur avancé et visualisation.",
  duration: "18 heures · 2 semaines",
  finalite:
    "Transformer des données brutes en information exploitable pour la décision : collecte, nettoyage, structuration, analyse par tableur avancé et visualisation sous forme de tableaux de bord.",
  objectives: [
    "Collecter, nettoyer et structurer un jeu de données.",
    "Réaliser des analyses avancées avec un tableur : TCD, fonctions, indicateurs.",
    "Sélectionner des indicateurs et des représentations graphiques pertinents.",
    "Concevoir un tableau de bord décisionnel clair et interactif.",
    "Interpréter les résultats et formuler des recommandations argumentées.",
  ],
  competences: [
    { group: "Gouvernance des données", text: "C21 — Gouverner les données personnelles et garantir un usage éthique du numérique et de l'IA : anonymisation, minimisation, sécurisation et prudence dans les interprétations individuelles." },
    { group: "Analyse", text: "C28 — Analyser des données et construire des tableaux de bord décisionnels : nettoyage, structuration, TCD, indicateurs et visualisations pertinentes." },
    { group: "Production professionnelle", text: "C30 — Produire et soutenir un livrable numérique professionnel complet, lisible, testé, sécurisé et documenté." },
    { group: "Transversales", text: "Expliquer, ajuster et justifier une décision professionnelle : interpréter des tendances et des écarts, et formuler des recommandations reliées à un résultat observé." },
  ],
  lessons: [
    {
      id: "seq-1",
      title: "De la donnée brute à l'information",
      icon: "Database",
      blocks: [
        { type: "text", html: "Une <strong>donnée brute</strong> n'est pas encore une information. Elle ne devient utile que lorsqu'elle est <strong>nettoyée</strong>, <strong>structurée</strong>, <strong>contextualisée</strong> et <strong>interprétée</strong>. Un tableau de bord ne doit pas seulement afficher des chiffres : il doit soutenir une <em>décision</em>." },
        { type: "text", html: "La <strong>qualité des données</strong> conditionne la qualité de l'analyse. Doublons, valeurs manquantes, formats incohérents, erreurs de saisie et catégories mal nommées peuvent fausser les résultats — et donc les décisions qui en découlent." },
        { type: "infographic", kind: "steps", title: "De la donnée à la décision", data: { steps: [
          { title: "Donnée brute", text: "valeurs collectées, non vérifiées" },
          { title: "Donnée propre", text: "nettoyée et harmonisée" },
          { title: "Donnée structurée", text: "organisée en variables claires" },
          { title: "Information", text: "contextualisée et interprétée" },
          { title: "Décision", text: "recommandation argumentée et action" },
        ] } },
        { type: "callout", tone: "tip", title: "Point d'attention du formateur", text: "Faire verbaliser la logique de choix par les apprenants. Au niveau 3, la compétence ne se limite pas à appliquer une procédure : elle consiste à expliquer, ajuster et justifier une décision professionnelle." },
      ],
    },
    {
      id: "seq-2",
      title: "Nettoyage et structuration des données",
      icon: "Eraser",
      blocks: [
        { type: "text", html: "Le <strong>nettoyage</strong> consiste à corriger les formats, harmoniser les catégories, supprimer les doublons, traiter les valeurs manquantes et documenter les transformations. L'apprenant doit toujours <strong>conserver une copie des données brutes</strong> avant toute modification, afin de pouvoir tracer ce qui a été changé." },
        { type: "text", html: "La <strong>structuration</strong> exige des colonnes claires, une ligne d'en-tête, un seul type de données par colonne, l'absence de cellules fusionnées dans la zone de données et une codification stable des variables." },
        { type: "infographic", kind: "two-columns", title: "Désordre vs structure exploitable", data: { left: { title: "À corriger", subtitle: "ce qui fausse l'analyse", items: ["Doublons de lignes", "Noms orthographiés différemment", "Dates au mauvais format", "Scores manquants", "Cellules fusionnées", "Catégories incohérentes"] }, right: { title: "Données structurées", subtitle: "ce qu'on vise", items: ["Une ligne d'en-tête claire", "Un type de données par colonne", "Pas de cellules fusionnées", "Codification stable des variables", "Copie des données brutes conservée", "Transformations documentées"] } } },
        { type: "callout", tone: "warn", title: "Règle d'or", text: "Avant de modifier un jeu de données brut, conserver une copie originale. Cela permet de revenir en arrière et de tracer chaque transformation appliquée." },
      ],
    },
    {
      id: "seq-3",
      title: "Analyse avancée avec le tableur",
      icon: "Table2",
      blocks: [
        { type: "text", html: "Les <strong>tableaux croisés dynamiques</strong> (TCD) permettent de regrouper, compter, sommer et comparer rapidement les données. Les <strong>fonctions avancées</strong> comme RECHERCHEX, les SI imbriqués, NB.SI.ENS ou SOMME.SI.ENS permettent de produire des indicateurs adaptés au besoin." },
        { type: "text", html: "Un <strong>indicateur</strong> doit être défini : nom, formule, source, périodicité, cible et interprétation. Par exemple, le <em>taux d'achèvement</em> d'un module ne se comprend que si l'on sait quels critères d'achèvement sont retenus." },
        { type: "infographic", kind: "table", title: "Fonctions avancées utiles", data: { columns: ["Fonction", "Usage principal"], rows: [
          ["RECHERCHEX", "Retrouver une valeur dans une autre table"],
          ["SI imbriqués", "Classer selon plusieurs conditions"],
          ["NB.SI.ENS", "Compter selon plusieurs critères"],
          ["SOMME.SI.ENS", "Sommer selon plusieurs critères"],
          ["TCD", "Regrouper, compter, sommer, comparer"],
        ] } },
        { type: "infographic", kind: "rules", title: "Définir un indicateur (KPI)", data: { rules: [
          { icon: "Tag", title: "Nom", text: "Intitulé clair et non ambigu." },
          { icon: "Sigma", title: "Formule", text: "Mode de calcul explicite et reproductible." },
          { icon: "Database", title: "Source", text: "Données utilisées et leur provenance." },
          { icon: "CalendarClock", title: "Périodicité", text: "Fréquence de mise à jour." },
          { icon: "Target", title: "Cible", text: "Valeur attendue ou seuil de référence." },
          { icon: "MessageSquare", title: "Interprétation", text: "Ce que l'indicateur signifie pour la décision." },
        ] } },
      ],
    },
    {
      id: "seq-4",
      title: "Visualisation et tableau de bord",
      icon: "LayoutDashboard",
      blocks: [
        { type: "text", html: "Un <strong>graphique efficace correspond à une question</strong>. Une courbe montre une évolution, un histogramme compare des catégories, un secteur montre une répartition simple — mais il devient difficile à lire avec trop de catégories." },
        { type: "text", html: "Le <strong>tableau de bord</strong> doit être lisible, hiérarchisé et orienté décision. Il combine quelques indicateurs essentiels, des filtres, des graphiques et un commentaire. L'<em>excès de chiffres nuit à l'action</em>." },
        { type: "infographic", kind: "categories", title: "Quel graphique pour quelle question ?", data: { columns: [
          { title: "Évolution", accent: "#0891B2", items: [{ label: "Courbe", hint: "tendance dans le temps" }, { label: "Histogramme chronologique", hint: "valeurs par période" }] },
          { title: "Comparaison", accent: "#6D5DF5", items: [{ label: "Histogramme", hint: "comparer des catégories" }, { label: "Barres", hint: "classer des valeurs" }] },
          { title: "Répartition", accent: "#16A34A", items: [{ label: "Secteur", hint: "part d'un tout, peu de catégories" }] },
        ] } },
        { type: "callout", tone: "warn", title: "Le piège du tableau de bord surchargé", text: "Un tableau de bord chargé de tous les chiffres possibles devient illisible et n'aide pas à décider. On sélectionne quelques indicateurs essentiels et on hiérarchise l'information." },
      ],
    },
    {
      id: "seq-5",
      title: "Interprétation et recommandations",
      icon: "Lightbulb",
      blocks: [
        { type: "text", html: "L'analyse ne s'arrête pas au graphique. L'apprenant doit <strong>expliquer les tendances, les écarts, les limites et les hypothèses</strong>. Une recommandation utile est reliée à un <em>résultat observé</em> et à une <em>action possible</em>." },
        { type: "text", html: "L'<strong>éthique des données</strong> impose l'anonymisation lorsque c'est nécessaire, la minimisation (ne collecter que le nécessaire), la sécurisation du fichier et la prudence dans les interprétations individuelles." },
        { type: "infographic", kind: "rules", title: "Gouvernance et éthique des données", data: { rules: [
          { icon: "EyeOff", title: "Anonymisation", text: "Lorsque les données permettent d'identifier des personnes." },
          { icon: "Minimize2", title: "Minimisation", text: "Ne collecter que les données réellement nécessaires." },
          { icon: "Lock", title: "Sécurisation", text: "Protéger l'accès au fichier et limiter sa diffusion." },
          { icon: "ShieldAlert", title: "Prudence", text: "Éviter les interprétations individuelles hâtives." },
        ] } },
        { type: "callout", tone: "info", title: "Une recommandation argumentée", text: "Elle s'appuie sur un résultat observé et une interprétation prudente — jamais sur une impression vague ou un hasard." },
      ],
    },
    {
      id: "seq-6",
      title: "Produire et soutenir le livrable",
      icon: "FileCheck2",
      blocks: [
        { type: "text", html: "Dans le module N3-M5, la compétence professionnelle se manifeste par une production <strong>utile, cohérente, testée, sécurisée et documentée</strong>. L'apprenant doit être capable de justifier ses choix, de corriger les limites observées et de transférer la méthode vers une situation réelle." },
        { type: "infographic", kind: "steps", title: "Construire le tableau de bord, étape par étape", data: { steps: [
          { title: "Nettoyer", text: "structurer le jeu de données" },
          { title: "Calculer les indicateurs", text: "trois KPI clairement nommés" },
          { title: "Construire les TCD", text: "deux tableaux croisés cohérents" },
          { title: "Créer les graphiques", text: "trois visualisations pertinentes" },
          { title: "Assembler le tableau de bord", text: "lisible, filtré, commenté" },
          { title: "Rédiger l'analyse", text: "recommandations citant les indicateurs" },
        ] } },
        { type: "keypoints", title: "Le livrable attendu", points: [
          "Une feuille de données propres avec une copie des données brutes conservée.",
          "Des indicateurs clairement nommés et définis.",
          "Des TCD cohérents et des graphiques adaptés aux questions.",
          "Un tableau de bord lisible accompagné d'une note d'analyse.",
          "Des recommandations qui citent les indicateurs observés.",
        ] },
      ],
    },
  ],
  exercises: [
    {
      id: "f1", kind: "categorize", title: "Qualité des données",
      instruction: "Classez chaque élément selon qu'il s'agit d'un problème à corriger dans un fichier de suivi, ou d'une bonne pratique de structuration.",
      categories: ["Problème à corriger", "Bonne pratique"],
      items: [
        { label: "Doublons de lignes", category: "Problème à corriger" },
        { label: "Dates au mauvais format", category: "Problème à corriger" },
        { label: "Cellules fusionnées dans les données", category: "Problème à corriger" },
        { label: "Catégories incohérentes", category: "Problème à corriger" },
        { label: "Une ligne d'en-tête claire", category: "Bonne pratique" },
        { label: "Un type de données par colonne", category: "Bonne pratique" },
        { label: "Conserver une copie des données brutes", category: "Bonne pratique" },
      ],
      feedback: "Doublons, dates mal formatées, cellules fusionnées et catégories incohérentes faussent l'analyse. À l'inverse, un en-tête clair, un type par colonne et une copie des données brutes garantissent une base exploitable.",
    },
    {
      id: "f2", kind: "order", title: "Construire un tableau de bord",
      instruction: "Remettez les étapes de production dans le bon ordre.",
      items: ["Nettoyer et structurer le jeu de données", "Calculer les indicateurs clés", "Construire les tableaux croisés dynamiques", "Créer les graphiques adaptés", "Assembler le tableau de bord", "Rédiger l'analyse et les recommandations"],
      feedback: "On part toujours de données propres, puis on calcule les indicateurs, on croise les données (TCD), on visualise, on assemble le tableau de bord et enfin on interprète pour recommander.",
    },
    {
      id: "f3", kind: "match", title: "Quel graphique pour quelle question ?",
      instruction: "Associez chaque question à la représentation graphique la plus pertinente.",
      pairs: [
        { left: "Suivre l'évolution mensuelle des inscriptions", right: "Courbe ou histogramme chronologique" },
        { left: "Comparer des catégories entre elles", right: "Histogramme" },
        { left: "Montrer une répartition simple (peu de catégories)", right: "Secteur" },
      ],
      feedback: "Une courbe ou un histogramme chronologique montre une évolution dans le temps ; l'histogramme compare des catégories ; le secteur convient à une répartition simple avec peu de catégories.",
    },
    {
      id: "f4", kind: "match", title: "Définir un indicateur",
      instruction: "Associez chaque composante de la définition d'un indicateur à son contenu.",
      pairs: [
        { left: "Nom", right: "Intitulé clair de l'indicateur" },
        { left: "Formule", right: "Mode de calcul reproductible" },
        { left: "Source", right: "Données utilisées et leur provenance" },
        { left: "Cible", right: "Valeur attendue ou seuil de référence" },
      ],
      feedback: "Un indicateur se définit par son nom, sa formule, sa source, sa périodicité, sa cible et son interprétation. Sans ces éléments, un même taux peut être compris de façons différentes.",
    },
    { id: "q1", kind: "qcm", title: "De la donnée à l'information", instruction: "Une donnée brute devient une information lorsque :", options: [{ text: "elle est contextualisée et interprétée", correct: true }, { text: "elle est cachée", correct: false }, { text: "elle est supprimée", correct: false }, { text: "elle est imprimée sans titre", correct: false }], feedback: "Réponse A. Le sens vient du traitement et du contexte." },
    { id: "q2", kind: "qcm", title: "Effet d'un doublon", instruction: "Un doublon peut :", options: [{ text: "fausser les totaux et les taux", correct: true }, { text: "améliorer la qualité", correct: false }, { text: "garantir l'exactitude", correct: false }, { text: "remplacer l'analyse", correct: false }], feedback: "Réponse A. Les doublons gonflent artificiellement les résultats." },
    { id: "q3", kind: "qcm", title: "Le tableau croisé dynamique", instruction: "Un tableau croisé dynamique sert à :", options: [{ text: "résumer et croiser des données", correct: true }, { text: "écrire un discours", correct: false }, { text: "générer un mot de passe", correct: false }, { text: "dessiner une affiche", correct: false }], feedback: "Réponse A. Il permet une analyse rapide par regroupements." },
    { id: "q4", kind: "qcm", title: "Qu'est-ce qu'un KPI ?", instruction: "Un KPI est :", options: [{ text: "un indicateur clé de performance", correct: true }, { text: "un format image", correct: false }, { text: "un type de mot de passe", correct: false }, { text: "un modèle de clavier", correct: false }], feedback: "Réponse A. Le KPI mesure un point important pour la décision." },
    { id: "q5", kind: "qcm", title: "Comparer des catégories", instruction: "Pour comparer des catégories, on utilise souvent :", options: [{ text: "un histogramme", correct: true }, { text: "un mot de passe", correct: false }, { text: "un fichier audio", correct: false }, { text: "un dossier zip", correct: false }], feedback: "Réponse A. L'histogramme compare visuellement des valeurs." },
    { id: "q6", kind: "qcm", title: "La minimisation des données", instruction: "La minimisation des données consiste à :", options: [{ text: "ne collecter que le nécessaire", correct: true }, { text: "collecter tout", correct: false }, { text: "publier les données", correct: false }, { text: "ignorer la confidentialité", correct: false }], feedback: "Réponse A. Principe fondamental de protection des données." },
    { id: "q7", kind: "qcm", title: "Un bon tableau de bord", instruction: "Un tableau de bord doit être :", options: [{ text: "clair, synthétique et orienté décision", correct: true }, { text: "chargé de tous les chiffres possibles", correct: false }, { text: "sans titre", correct: false }, { text: "illisible", correct: false }], feedback: "Réponse A. La lisibilité soutient l'action." },
    { id: "q8", kind: "qcm", title: "Avant de modifier les données", instruction: "Avant de modifier un jeu de données brut, il est recommandé de :", options: [{ text: "conserver une copie originale", correct: true }, { text: "tout effacer", correct: false }, { text: "fusionner toutes les cellules", correct: false }, { text: "supprimer les en-têtes", correct: false }], feedback: "Réponse A. La copie permet de tracer les transformations." },
    { id: "q9", kind: "qcm", title: "Une recommandation argumentée", instruction: "Une recommandation argumentée doit s'appuyer sur :", options: [{ text: "un résultat observé et une interprétation prudente", correct: true }, { text: "une impression vague", correct: false }, { text: "une couleur", correct: false }, { text: "un hasard", correct: false }], feedback: "Réponse A. La recommandation doit être fondée." },
    { id: "q10", kind: "qcm", title: "Quand anonymiser ?", instruction: "L'anonymisation est utile lorsque :", options: [{ text: "les données permettent d'identifier des personnes", correct: true }, { text: "les données sont des couleurs", correct: false }, { text: "le fichier est vide", correct: false }, { text: "on imprime un graphique", correct: false }], feedback: "Réponse A. Elle réduit les risques sur la vie privée." },
    { id: "q11", kind: "truefalse", title: "Le secteur surchargé", instruction: "Vrai ou faux ?", statement: "Un graphique en secteur reste facile à lire même avec un grand nombre de catégories.", answer: false, feedback: "Faux : le secteur montre une répartition simple, mais devient difficile à lire avec trop de catégories. On lui préfère alors un histogramme." },
    { id: "q12", kind: "truefalse", title: "Excès de chiffres", instruction: "Vrai ou faux ?", statement: "Plus un tableau de bord contient de chiffres, plus il aide à la décision.", answer: false, feedback: "Faux : l'excès de chiffres nuit à l'action. Un tableau de bord se limite à quelques indicateurs essentiels, hiérarchisés et commentés." },
    { id: "q13", kind: "truefalse", title: "La donnée brute", instruction: "Vrai ou faux ?", statement: "Une donnée brute est déjà une information directement exploitable pour décider.", answer: false, feedback: "Faux : la donnée brute doit d'abord être nettoyée, structurée, contextualisée et interprétée pour devenir une information utile." },
    { id: "q14", kind: "qcm", title: "Fonction de comptage conditionnel", instruction: "Quelle fonction permet de compter des valeurs selon plusieurs critères ?", options: [{ text: "NB.SI.ENS", correct: true }, { text: "MOYENNE", correct: false }, { text: "CONCATENER", correct: false }, { text: "MAJUSCULE", correct: false }], feedback: "NB.SI.ENS compte les cellules qui respectent plusieurs critères simultanément." },
    { id: "q15", kind: "qcm", title: "Le taux d'achèvement", instruction: "Pourquoi un taux d'achèvement de module doit-il être défini précisément ?", options: [{ text: "parce qu'il ne se comprend que si l'on sait quels critères d'achèvement sont retenus", correct: true }, { text: "parce qu'il faut une couleur particulière", correct: false }, { text: "parce qu'il doit être imprimé en grand format", correct: false }, { text: "parce qu'il remplace l'analyse", correct: false }], feedback: "Un indicateur n'a de sens que par sa définition : nom, formule, source, périodicité, cible et interprétation. Le taux d'achèvement dépend des critères d'achèvement retenus." },
  ],
  caseStudy: {
    title: "Étude de cas — Un taux de réussite trompeur",
    scenario:
      "Un responsable annonce 95 % de réussite à une formation. En vérifiant le fichier, on constate que plusieurs apprenants absents ont été supprimés de la base avant le calcul du taux.",
    questions: [
      "Quel est le problème méthodologique ?",
      "Comment recalculer correctement le taux ?",
      "Quelle recommandation de gouvernance proposer ?",
    ],
    corrige: [
      "Problème : biais de sélection et indicateur manipulé. En retirant les apprenants absents avant le calcul, on gonfle artificiellement le taux de réussite, qui ne reflète plus la réalité.",
      "Recalcul : définir la population de référence, réintégrer les inscrits (ou expliquer clairement les exclusions), puis calculer à la fois la réussite rapportée aux inscrits et la réussite rapportée aux présents.",
      "Gouvernance : documenter les formules, conserver les données brutes et faire valider les indicateurs avant publication, afin de garantir la traçabilité et l'honnêteté des résultats.",
    ],
  },
};
