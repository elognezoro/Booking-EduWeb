import type { N1Module } from "../niveau1/types";

/** Niveau 3 — Module 4 : Automatisation no-code / low-code des processus. */
export const MODULE_4: N1Module = {
  code: "N3-M4",
  slug: "module-4",
  num: 4,
  title: "Automatisation no-code / low-code des processus",
  subtitle: "Concevoir, piloter et documenter des flux automatisés fiables, sans programmation lourde.",
  duration: "18 heures · 2 semaines",
  finalite:
    "Automatiser des tâches et des flux de travail répétitifs sans programmation lourde, en modélisant un processus, en identifiant déclencheurs, conditions et actions, puis en orchestrant des automatisations fiables.",
  objectives: [
    "Analyser et modéliser un processus métier à automatiser.",
    "Identifier les déclencheurs, les conditions et les actions d'un flux automatisé.",
    "Construire des automatisations no-code/low-code multi-applications.",
    "Intégrer l'IA dans un flux automatisé avec prudence et contrôle humain.",
    "Tester, documenter et maintenir une automatisation.",
  ],
  competences: [
    { group: "Analyse & modélisation", text: "C30 — Cartographier un processus métier, repérer les tâches répétitives, les doubles saisies et les points de validation à conserver pour l'humain." },
    { group: "Conception no-code/low-code", text: "C29 — Automatiser des tâches et processus no-code/low-code en orchestrant déclencheurs, conditions et actions multi-applications." },
    { group: "IA responsable", text: "C25 — Intégrer l'IA dans l'ingénierie pédagogique et la production professionnelle avec contrôle humain, transparence et protection des données." },
    { group: "Qualité & transfert", text: "C30 — Tester, journaliser, documenter et maintenir un livrable numérique professionnel transférable à un successeur." },
  ],
  lessons: [
    {
      id: "seq-1",
      title: "Penser l'automatisation avant l'outil",
      icon: "Workflow",
      blocks: [
        { type: "text", html: "Automatiser ne signifie pas seulement <strong>connecter deux applications</strong>. Il faut d'abord comprendre le processus : qui fait quoi, avec quelle information, à quel moment, avec quel risque et quel résultat attendu. Une mauvaise procédure automatisée produit plus vite de mauvaises erreurs." },
        { type: "text", html: "La <strong>cartographie du processus</strong> permet de repérer les tâches répétitives, les doubles saisies, les notifications oubliées, les validations lentes et les erreurs humaines. Elle aide aussi à choisir ce qui doit <em>rester humain</em>." },
        { type: "infographic", kind: "steps", title: "Cartographier un processus avant d'automatiser", data: { steps: [
          { title: "Décrire", text: "qui fait quoi, avec quelle information" },
          { title: "Situer", text: "à quel moment et dans quel ordre" },
          { title: "Repérer", text: "les tâches répétitives et les doubles saisies" },
          { title: "Évaluer", text: "les risques et les erreurs possibles" },
          { title: "Décider", text: "ce qui s'automatise et ce qui reste humain" },
        ] } },
        { type: "callout", tone: "warn", title: "Le piège du niveau 3", text: "Automatiser un mauvais processus ne le corrige pas : cela accélère seulement les erreurs. L'analyse du processus est indispensable avant tout paramétrage." },
        { type: "callout", tone: "tip", title: "Point d'attention du formateur", text: "Faire verbaliser la logique de choix par les apprenants. Au niveau 3, la compétence ne se limite pas à appliquer une procédure : elle consiste à expliquer, ajuster et justifier une décision professionnelle." },
      ],
    },
    {
      id: "seq-2",
      title: "Déclencheurs, conditions et actions",
      icon: "GitBranch",
      blocks: [
        { type: "text", html: "Un flux automatisé repose sur trois notions : le <strong>déclencheur</strong>, qui lance le processus ; la <strong>condition</strong>, qui oriente la décision ; l'<strong>action</strong>, qui exécute la tâche." },
        { type: "callout", tone: "example", title: "Un flux simple", text: "Lorsqu'un formulaire est soumis, si le domaine est « formation », alors envoyer un accusé de réception et ajouter la ligne dans un tableau." },
        { type: "infographic", kind: "categories", title: "Les trois piliers d'un flux", data: { columns: [
          { title: "Déclencheur", accent: "#0891B2", items: [{ label: "Formulaire soumis" }, { label: "Nouveau fichier déposé" }, { label: "Heure planifiée" }, { label: "Score reçu" }] },
          { title: "Condition", accent: "#6D5DF5", items: [{ label: "Domaine = formation" }, { label: "Score < 60" }, { label: "Pièce jointe présente" }, { label: "Adresse valide" }] },
          { title: "Action", accent: "#16A34A", items: [{ label: "Envoyer un accusé" }, { label: "Ajouter une ligne au tableur" }, { label: "Classer dans le cloud" }, { label: "Notifier le responsable" }] },
        ] } },
        { type: "text", html: "La rigueur de conception exige de prévoir les <strong>cas normaux</strong>, les <strong>exceptions</strong> et les <strong>erreurs</strong>. Un flux professionnel doit gérer l'absence de fichier, les doublons, les adresses invalides et les droits d'accès." },
        { type: "keypoints", title: "Les trois familles de cas à prévoir", points: [
          "Cas normal : tout est conforme, le flux se déroule comme prévu.",
          "Cas exceptionnel : doublon, donnée manquante, score invalide — le flux doit dévier proprement.",
          "Cas d'erreur : fichier absent, adresse invalide, droits insuffisants — le flux doit alerter sans bloquer.",
        ] },
      ],
    },
    {
      id: "seq-3",
      title: "Outils no-code et low-code",
      icon: "Boxes",
      blocks: [
        { type: "text", html: "Les outils comme <strong>Power Automate</strong>, <strong>Zapier</strong>, <strong>Make</strong>, <strong>Google Apps Script</strong> ou les <strong>macros</strong> permettent de relier formulaires, tableurs, messageries, dossiers cloud et notifications. Le <em>no-code</em> privilégie l'assemblage visuel ; le <em>low-code</em> ajoute de petites expressions ou scripts." },
        { type: "infographic", kind: "two-columns", title: "No-code et low-code", data: { left: { title: "No-code", subtitle: "assemblage visuel, sans écrire de code", items: ["Connecteurs préconstruits", "Glisser-déposer des étapes", "Modèles de flux prêts à l'emploi", "Accessible aux non-développeurs"] }, right: { title: "Low-code", subtitle: "no-code + petites expressions / scripts", items: ["Expressions de calcul ou de format", "Scripts courts (Apps Script, macros)", "Logique conditionnelle avancée", "Plus de puissance, plus de maintenance"] } } },
        { type: "text", html: "Le choix de l'outil dépend des <strong>licences</strong>, de la <strong>confidentialité</strong>, des intégrations disponibles, de la facilité de maintenance et de la compétence des utilisateurs. Dans un contexte institutionnel, le flux doit rester compréhensible par un successeur." },
        { type: "infographic", kind: "rules", title: "Critères de choix d'un outil", data: { rules: [
          { icon: "FileKey", title: "Licences", text: "Disponibilité, coût et conditions d'usage dans l'institution." },
          { icon: "Lock", title: "Confidentialité", text: "Localisation et protection des données traitées." },
          { icon: "Plug", title: "Intégrations", text: "Connecteurs vers les applications réellement utilisées." },
          { icon: "Wrench", title: "Maintenance", text: "Un flux compréhensible et reprenable par un successeur." },
        ] } },
        { type: "callout", tone: "tip", title: "Point d'attention du formateur", text: "Faire verbaliser la logique de choix par les apprenants : pourquoi cet outil plutôt qu'un autre, dans ce contexte précis." },
      ],
    },
    {
      id: "seq-4",
      title: "L'IA dans un flux automatisé",
      icon: "BrainCircuit",
      blocks: [
        { type: "text", html: "L'IA peut <strong>résumer</strong> une demande, <strong>classer</strong> un message, <strong>proposer</strong> une réponse ou <strong>extraire</strong> des éléments d'un texte. Mais elle doit être encadrée par des règles : ne pas traiter de données sensibles sans autorisation, conserver une validation humaine pour les décisions importantes et journaliser les sorties." },
        { type: "text", html: "Le <strong>flux IA responsable</strong> combine automatisation et contrôle : l'IA propose, l'humain valide quand l'enjeu est significatif. Cette approche limite les erreurs et préserve la responsabilité professionnelle." },
        { type: "infographic", kind: "rules", title: "Encadrer l'IA dans un flux", data: { rules: [
          { icon: "ShieldCheck", title: "Protection des données", text: "Ne pas traiter de données sensibles sans autorisation explicite." },
          { icon: "UserCheck", title: "Contrôle humain", text: "Garder une validation humaine pour les décisions importantes." },
          { icon: "ScrollText", title: "Journalisation", text: "Conserver une trace des sorties produites par l'IA." },
          { icon: "Eye", title: "Transparence", text: "Rendre visible quand une étape repose sur une proposition de l'IA." },
        ] } },
        { type: "callout", tone: "info", title: "L'IA propose, l'humain valide", text: "Plus l'enjeu est significatif (certification, décision administrative, donnée personnelle), plus la validation humaine doit être systématique." },
      ],
    },
    {
      id: "seq-5",
      title: "Tests, journalisation et maintenance",
      icon: "ClipboardCheck",
      blocks: [
        { type: "text", html: "Un flux automatisé doit être <strong>testé</strong> avec des données normales, des données limites et des erreurs volontaires. Les tests permettent de vérifier que les notifications partent, que les fichiers sont rangés, que les droits sont corrects et que les doublons sont traités." },
        { type: "infographic", kind: "table", title: "Trois types de jeux de test", data: { columns: ["Type de test", "Exemple", "Ce qu'il révèle"], rows: [
          ["Données normales", "Formulaire complet et valide", "Le flux fonctionne dans le cas attendu"],
          ["Données limites", "Formulaire sans fichier joint", "Les failles et les oublis de conception"],
          ["Erreurs volontaires", "Adresse invalide, doublon", "La robustesse et la gestion d'erreur"],
        ] } },
        { type: "text", html: "La <strong>documentation</strong> indique le but du flux, ses déclencheurs, ses actions, les comptes utilisés, les droits, les erreurs connues et la procédure de dépannage. Sans documentation, l'automatisation devient fragile." },
        { type: "infographic", kind: "tree", title: "Une fiche de maintenance complète", data: { root: "Fiche_de_flux", nodes: [
          { label: "But du flux" },
          { label: "Déclencheurs et actions" },
          { label: "Comptes et droits utilisés" },
          { label: "Erreurs connues" },
          { label: "Procédure de dépannage" },
        ] } },
        { type: "callout", tone: "warn", title: "La journalisation au service de l'audit", text: "La journalisation permet de retracer les exécutions et les erreurs. Elle aide le dépannage et l'audit — elle ne sert jamais à cacher les problèmes ou à effacer les preuves." },
      ],
    },
    {
      id: "seq-6",
      title: "Repères, cadres et posture professionnelle",
      icon: "Compass",
      blocks: [
        { type: "text", html: "Ce module appartient au <strong>niveau avancé</strong> de la certification. Il vise la transformation d'un utilisateur autonome en <em>concepteur, pilote et responsable</em> d'un dispositif numérique. Les apprentissages attendus sont situés, documentés et transférables en contexte professionnel." },
        { type: "text", html: "La progression s'inscrit dans les repères de <strong>DigComp 2.2</strong>, qui structure les compétences numériques citoyennes, et de <strong>DigCompEdu</strong>, qui précise les compétences numériques professionnelles des éducateurs. Pour les usages d'IA, le module adopte une posture centrée sur l'humain, la vérification, la transparence et la protection des données." },
        { type: "keypoints", title: "Trace écrite à retenir", points: [
          "La compétence professionnelle se manifeste par une production utile, cohérente, testée, sécurisée et documentée.",
          "L'apprenant doit pouvoir justifier ses choix de conception.",
          "Il doit corriger les limites observées lors des tests.",
          "Il doit transférer la méthode vers une situation réelle.",
        ] },
        { type: "callout", tone: "tip", title: "Remédiation et approfondissement", text: "La remédiation s'appuie sur un livrable incomplet : identifier l'erreur, reformuler la décision attendue, corriger, expliquer. L'approfondissement consiste à adapter le livrable à un autre public, un autre contexte ou une contrainte supplémentaire." },
      ],
    },
  ],
  exercises: [
    {
      id: "f1", kind: "categorize", title: "Déclencheur, condition ou action ?",
      instruction: "Classez chaque élément d'un flux dans la bonne catégorie.",
      categories: ["Déclencheur", "Condition", "Action"],
      items: [
        { label: "Un formulaire est soumis", category: "Déclencheur" },
        { label: "Un nouveau fichier est déposé dans le cloud", category: "Déclencheur" },
        { label: "Le score est inférieur à 60", category: "Condition" },
        { label: "Le domaine est « formation »", category: "Condition" },
        { label: "Envoyer un accusé de réception", category: "Action" },
        { label: "Ajouter une ligne dans le tableur", category: "Action" },
      ],
      feedback: "Le déclencheur lance le flux, la condition oriente la décision selon une règle, l'action exécute la tâche.",
    },
    {
      id: "f2", kind: "order", title: "Cartographier avant d'automatiser",
      instruction: "Remettez dans l'ordre les étapes d'analyse d'un processus avant de l'automatiser.",
      items: ["Décrire qui fait quoi avec quelle information", "Situer chaque tâche dans le temps", "Repérer les tâches répétitives et les doubles saisies", "Évaluer les risques et les erreurs possibles", "Décider ce qui s'automatise et ce qui reste humain"],
      feedback: "On comprend d'abord le processus, on situe et repère les tâches, on évalue les risques, puis on décide seulement à la fin ce qui doit être automatisé.",
    },
    {
      id: "f3", kind: "categorize", title: "Cartographie d'une inscription",
      instruction: "Une bonne cartographie du processus d'inscription identifie plusieurs étapes. Classez chacune.",
      categories: ["Étape automatisable", "Validation humaine"],
      items: [
        { label: "Réception du formulaire", category: "Étape automatisable" },
        { label: "Enregistrement de la réponse", category: "Étape automatisable" },
        { label: "Accusé de réception", category: "Étape automatisable" },
        { label: "Classement du dossier", category: "Étape automatisable" },
        { label: "Vérification des pièces du dossier", category: "Validation humaine" },
        { label: "Approbation finale pour certification", category: "Validation humaine" },
      ],
      feedback: "La cartographie identifie formulaire, vérification, enregistrement, accusé, classement, notification et suivi — en signalant les points où une validation humaine doit être conservée.",
    },
    {
      id: "f4", kind: "order", title: "Logique d'un flux conditionnel",
      instruction: "« Si le score est inférieur à 60, envoyer une remédiation ; sinon envoyer une attestation provisoire. » Remettez la logique du flux dans l'ordre.",
      items: ["Déclencheur : réception du score", "Vérifier que le score est présent et valide", "Condition : score inférieur à 60 ?", "Si oui : envoyer le message de remédiation", "Si non : envoyer l'attestation provisoire"],
      feedback: "Déclencheur : réception du score. Condition : score < 60. Action A : message de remédiation ; Action B : message de validation. Il faut aussi prévoir les scores manquants ou invalides.",
    },
    {
      id: "f5", kind: "match", title: "Associer l'outil à sa nature",
      instruction: "Associez chaque outil ou notion à sa description.",
      pairs: [
        { left: "Power Automate / Zapier / Make", right: "Plateformes no-code de connexion d'applications" },
        { left: "Google Apps Script", right: "Low-code : petits scripts ajoutés au no-code" },
        { left: "Macro de tableur", right: "Automatisation de tâches répétitives dans un classeur" },
        { left: "Webhook", right: "Transmet un événement entre applications" },
      ],
      feedback: "Les plateformes no-code assemblent visuellement des connecteurs ; le low-code y ajoute des expressions ou scripts ; un webhook transmet un événement d'une application à une autre.",
    },
    {
      id: "f6", kind: "categorize", title: "IA responsable dans un flux",
      instruction: "Classez chaque pratique selon qu'elle est recommandée ou à proscrire pour l'IA dans un flux.",
      categories: ["Recommandé", "À proscrire"],
      items: [
        { label: "Garder une validation humaine pour les décisions importantes", category: "Recommandé" },
        { label: "Journaliser les sorties de l'IA", category: "Recommandé" },
        { label: "Demander une autorisation avant de traiter des données sensibles", category: "Recommandé" },
        { label: "Laisser l'IA prendre toutes les décisions", category: "À proscrire" },
        { label: "Exposer des secrets dans une requête", category: "À proscrire" },
        { label: "Utiliser l'IA sans aucune vérification", category: "À proscrire" },
      ],
      feedback: "L'IA propose, l'humain valide. Elle doit rester encadrée : contrôle humain, protection des données et journalisation.",
    },
    {
      id: "q1", kind: "qcm", title: "Un déclencheur", instruction: "Un déclencheur est :",
      options: [{ text: "L'événement qui lance un flux", correct: true }, { text: "Une couleur", correct: false }, { text: "Un dossier vide", correct: false }, { text: "Un mot de passe", correct: false }],
      feedback: "Réponse A. Le déclencheur démarre l'automatisation.",
    },
    {
      id: "q2", kind: "qcm", title: "Une condition", instruction: "Une condition sert à :",
      options: [{ text: "Orienter le flux selon une règle", correct: true }, { text: "Supprimer les données", correct: false }, { text: "Changer le clavier", correct: false }, { text: "Imprimer automatiquement tout", correct: false }],
      feedback: "Réponse A. La condition choisit une branche.",
    },
    {
      id: "q3", kind: "qcm", title: "Automatiser un mauvais processus", instruction: "Automatiser un mauvais processus conduit à :",
      options: [{ text: "Accélérer les erreurs", correct: true }, { text: "Garantir la qualité", correct: false }, { text: "Supprimer tout risque", correct: false }, { text: "Remplacer le besoin d'analyse", correct: false }],
      feedback: "Réponse A. L'analyse du processus est indispensable.",
    },
    {
      id: "q4", kind: "qcm", title: "Le no-code", instruction: "Le no-code permet principalement de :",
      options: [{ text: "Créer des flux sans programmation lourde", correct: true }, { text: "Éviter toute vérification", correct: false }, { text: "Contourner les droits", correct: false }, { text: "Supprimer le cloud", correct: false }],
      feedback: "Réponse A. Il facilite l'assemblage de processus.",
    },
    {
      id: "q5", kind: "qcm", title: "Un flux professionnel", instruction: "Un flux professionnel doit être :",
      options: [{ text: "Testé et documenté", correct: true }, { text: "Secret et incompréhensible", correct: false }, { text: "Sans contrôle", correct: false }, { text: "Sans gestion d'erreur", correct: false }],
      feedback: "Réponse A. Test et documentation assurent la maintenance.",
    },
    {
      id: "q6", kind: "qcm", title: "L'IA dans un flux", instruction: "L'IA dans un flux doit être utilisée :",
      options: [{ text: "Avec contrôle humain et protection des données", correct: true }, { text: "Pour exposer des secrets", correct: false }, { text: "Sans vérification", correct: false }, { text: "Pour prendre toutes les décisions", correct: false }],
      feedback: "Réponse A. L'IA doit rester encadrée.",
    },
    {
      id: "q7", kind: "qcm", title: "Un webhook", instruction: "Un webhook sert généralement à :",
      options: [{ text: "Transmettre un événement entre applications", correct: true }, { text: "Changer la police", correct: false }, { text: "Créer un mot de passe", correct: false }, { text: "Désinstaller un navigateur", correct: false }],
      feedback: "Réponse A. Il facilite l'intégration.",
    },
    {
      id: "q8", kind: "qcm", title: "La journalisation", instruction: "La journalisation permet de :",
      options: [{ text: "Retracer les exécutions et erreurs", correct: true }, { text: "Cacher les problèmes", correct: false }, { text: "Effacer les preuves", correct: false }, { text: "Réduire la lisibilité", correct: false }],
      feedback: "Réponse A. Elle aide le dépannage et l'audit.",
    },
    {
      id: "q9", kind: "qcm", title: "Respect des règles", instruction: "Une automatisation doit respecter :",
      options: [{ text: "Les droits d'accès et la confidentialité", correct: true }, { text: "Le partage sans limite", correct: false }, { text: "L'absence de consentement", correct: false }, { text: "La suppression des sauvegardes", correct: false }],
      feedback: "Réponse A. Les données et les droits restent essentiels.",
    },
    {
      id: "q10", kind: "qcm", title: "Un cas limite de test", instruction: "Un cas limite de test peut être :",
      options: [{ text: "Un formulaire sans fichier joint", correct: true }, { text: "Un cas parfait uniquement", correct: false }, { text: "Une couleur de logo", correct: false }, { text: "Une police d'écriture", correct: false }],
      feedback: "Réponse A. Les cas limites révèlent les failles.",
    },
    {
      id: "q11", kind: "truefalse", title: "No-code et programmation", instruction: "Vrai ou faux ?",
      statement: "Le no-code permet de créer des flux sans programmation lourde.", answer: true,
      feedback: "Vrai : le no-code repose sur l'assemblage visuel de connecteurs, sans écrire de code complexe.",
    },
    {
      id: "q12", kind: "truefalse", title: "Une seule sauvegarde", instruction: "Vrai ou faux ?",
      statement: "Pour les décisions importantes, l'IA peut décider seule sans aucune validation humaine.", answer: false,
      feedback: "Faux : plus l'enjeu est significatif, plus la validation humaine doit être conservée. L'IA propose, l'humain valide.",
    },
    {
      id: "q13", kind: "truefalse", title: "Tester un flux", instruction: "Vrai ou faux ?",
      statement: "Il suffit de tester un flux avec des données parfaites pour le considérer comme fiable.", answer: false,
      feedback: "Faux : il faut aussi tester des données limites et des erreurs volontaires pour révéler les failles.",
    },
  ],
  caseStudy: {
    title: "Étude de cas — Automatisation sans contrôle",
    scenario:
      "Un flux envoie automatiquement des attestations à tous les inscrits dès qu'un formulaire est rempli, sans vérifier la présence effective ni le score final.",
    questions: [
      "Pourquoi ce flux est-il dangereux ?",
      "Comment le corriger ?",
      "Quelle validation humaine faut-il garder ?",
    ],
    corrige: [
      "Danger : attribution injustifiée d'attestations, perte de crédibilité du dispositif et erreurs administratives, car aucune condition ne contrôle qui mérite réellement l'attestation.",
      "Correction : ajouter des conditions de présence et de score, vérifier les doublons, et n'envoyer qu'une attestation provisoire soumise à validation.",
      "Validation humaine : conserver une approbation finale par un responsable avant toute certification définitive.",
    ],
  },
};
