import type { N1Module } from "./types";

/** Niveau 1 — Module 1 : Prise en main de l'ordinateur et gestion des fichiers. */
export const MODULE_1: N1Module = {
  code: "N1-M1",
  slug: "module-1",
  num: 1,
  title: "Prise en main de l'ordinateur et gestion des fichiers",
  subtitle: "Le socle : utiliser un poste de travail, organiser ses fichiers et travailler en sécurité.",
  duration: "18 heures · 2 semaines",
  finalite:
    "Acquérir les gestes de base pour utiliser un poste de travail, organiser ses fichiers, sauvegarder ses données et travailler en sécurité.",
  objectives: [
    "Identifier les composants essentiels d'un ordinateur.",
    "Démarrer, redémarrer, mettre en veille et éteindre correctement une machine.",
    "Distinguer les périphériques d'entrée, de sortie et de stockage.",
    "Utiliser les éléments de base du système d'exploitation.",
    "Créer, nommer, renommer, copier, déplacer, supprimer et restaurer des fichiers.",
    "Organiser des dossiers selon une logique claire.",
    "Reconnaître les extensions courantes (.docx, .xlsx, .pptx, .pdf, .jpg, .png, .zip).",
    "Utiliser correctement une clé USB ou un disque externe.",
    "Installer et désinstaller une application simple avec prudence.",
    "Appliquer les premières règles de sécurité : mot de passe, sauvegarde, prudence.",
  ],
  competences: [
    { group: "Techniques", text: "Utiliser l'ordinateur comme outil de travail : clavier, souris, sessions, bureau, barre des tâches, ouverture de logiciels, recherche de fichiers." },
    { group: "Organisationnelles", text: "Ranger ses documents dans une arborescence logique et adopter une méthode professionnelle de classement et de nommage." },
    { group: "Sécurité", text: "Protéger sa session, éviter les supports inconnus, ne pas ouvrir de fichiers suspects et sauvegarder régulièrement." },
    { group: "Transversales", text: "Développer autonomie, rigueur, capacité à suivre une procédure et à résoudre un petit problème technique sans paniquer." },
  ],
  lessons: [
    {
      id: "seq-1",
      title: "Comprendre ce qu'est un ordinateur",
      icon: "Cpu",
      blocks: [
        { type: "text", html: "Un ordinateur est une machine électronique capable de <strong>recevoir</strong> des informations, de les <strong>traiter</strong>, de les <strong>stocker</strong> et de <strong>produire</strong> des résultats. Il ne travaille pas seul : il exécute les actions demandées par l'utilisateur grâce à des logiciels. Pour bien l'utiliser, il faut distinguer le matériel du logiciel." },
        { type: "infographic", kind: "two-columns", title: "Matériel et logiciel", data: { left: { title: "Matériel", subtitle: "ce que l'on voit ou touche", items: ["Unité centrale", "Écran", "Clavier", "Souris", "Imprimante", "Clé USB", "Disque dur externe", "Haut-parleurs", "Webcam"] }, right: { title: "Logiciel", subtitle: "programmes installés", items: ["Système d'exploitation (Windows, macOS, Linux)", "Word, Excel, PowerPoint", "Navigateur web", "Lecteur PDF"] } } },
        { type: "text", html: "L'ordinateur n'est pas seulement un appareil technique : c'est un <strong>espace de travail</strong>. Comme un bureau physique, il doit rester propre, organisé et sécurisé. Un ordinateur désordonné, rempli de fichiers mal nommés et dispersés, ralentit le travail et augmente les risques de perte d'information." },
        { type: "callout", tone: "example", title: "Analogie utile", text: "L'ordinateur ressemble à un bureau administratif : les dossiers numériques sont des chemises, les fichiers sont des documents, la corbeille est une poubelle provisoire et la clé USB est une mallette de transport." },
      ],
    },
    {
      id: "seq-2",
      title: "Démarrer, ouvrir une session et arrêter correctement",
      icon: "Power",
      blocks: [
        { type: "text", html: "Le démarrage commence par l'appui sur le bouton d'alimentation. Après le chargement du système, un écran d'accueil ou de connexion apparaît. L'<strong>ouverture de session</strong> permet d'identifier l'utilisateur : dans une salle partagée, chaque session contient des fichiers, des paramètres et des préférences propres." },
        { type: "callout", tone: "warn", title: "À éviter absolument", text: "Ne jamais éteindre brutalement l'ordinateur en débranchant le câble d'alimentation : cela peut provoquer une perte de données ou endommager des fichiers. On enregistre son travail, on ferme les applications, puis on utilise la commande appropriée." },
        { type: "infographic", kind: "rules", title: "Les quatre commandes d'alimentation", data: { rules: [
          { icon: "Power", title: "Arrêter", text: "Éteint complètement l'ordinateur." },
          { icon: "RotateCcw", title: "Redémarrer", text: "Éteint puis rallume la machine, par exemple après une mise à jour." },
          { icon: "Moon", title: "Mettre en veille", text: "Conserve la session ouverte pour une courte pause." },
          { icon: "LogOut", title: "Fermer la session", text: "Quitte son espace sans éteindre l'ordinateur." },
        ] } },
      ],
    },
    {
      id: "seq-3",
      title: "Identifier les périphériques",
      icon: "Plug",
      blocks: [
        { type: "text", html: "Un <strong>périphérique</strong> est un équipement connecté à l'ordinateur pour recevoir, afficher, stocker ou échanger des informations. On distingue trois grandes familles, plus quelques périphériques mixtes (écran tactile, imprimante multifonction, smartphone)." },
        { type: "infographic", kind: "categories", title: "Trois familles de périphériques", data: { columns: [
          { title: "Entrée", accent: "#0891B2", items: [{ label: "Clavier" }, { label: "Souris" }, { label: "Scanner" }, { label: "Microphone" }, { label: "Webcam" }] },
          { title: "Sortie", accent: "#6D5DF5", items: [{ label: "Écran" }, { label: "Imprimante" }, { label: "Haut-parleurs" }, { label: "Vidéoprojecteur" }] },
          { title: "Stockage", accent: "#16A34A", items: [{ label: "Disque dur" }, { label: "SSD" }, { label: "Clé USB" }, { label: "Carte mémoire" }, { label: "Disque externe" }] },
        ] } },
        { type: "callout", tone: "warn", text: "Certains périphériques nécessitent une installation ou un pilote. Une clé USB inconnue peut contenir un fichier dangereux : ne jamais brancher n'importe quel support externe sur un ordinateur professionnel ou institutionnel." },
      ],
    },
    {
      id: "seq-4",
      title: "Découvrir l'environnement du système d'exploitation",
      icon: "Monitor",
      blocks: [
        { type: "text", html: "Après l'ouverture de session, l'apprenant découvre le <strong>bureau</strong> : icônes, raccourcis, barre des tâches, menu démarrer, zone de notification, horloge. L'<strong>explorateur de fichiers</strong> est l'outil central du module : il permet d'ouvrir les dossiers, de créer, déplacer ou copier des éléments, de rechercher un document et de vérifier son emplacement." },
        { type: "callout", tone: "tip", title: "Bonne habitude", text: "Éviter d'enregistrer tous ses fichiers sur le bureau : cela donne l'impression d'un accès rapide mais finit par créer du désordre. Préférer des dossiers bien nommés." },
        { type: "infographic", kind: "tree", title: "Une arborescence claire", data: { root: "Formation_CERTEL", nodes: [
          { label: "Niveau_1", children: [{ label: "Module_1_Ordinateur" }, { label: "Module_2_Word_Excel_PowerPoint" }, { label: "Module_3_Internet" }] },
          { label: "Evaluations" },
        ] } },
      ],
    },
    {
      id: "seq-5",
      title: "Créer, nommer et organiser les fichiers",
      icon: "FolderTree",
      blocks: [
        { type: "text", html: "Le <strong>nommage</strong> des fichiers est une compétence fondamentale. Un fichier nommé <em>document1.docx</em> ne donne aucune information utile. Un bon nom permet de comprendre rapidement le contenu, l'auteur, la date ou la version." },
        { type: "infographic", kind: "pattern", title: "Une convention de nommage simple", data: { pattern: "TypeDocument_Thème_Nom_Date_Version", examples: ["Rapport_Diagnostic_Kouassi_2026-06-29_V1.docx", "Liste_Presence_CERTEL_Niveau1_2026-06.xlsx", "Presentation_Module1_GestionFichiers_V2.pptx"] } },
        { type: "callout", tone: "warn", title: "Caractères à éviter dans les noms", text: "/  \\  :  *  ?  \"  <  >  |  — ils peuvent être interdits ou problématiques selon les systèmes." },
        { type: "keypoints", title: "Copier ou déplacer ?", points: [
          "Copier : créer un double du fichier dans un autre emplacement (l'original reste).",
          "Déplacer : retirer le fichier de son emplacement initial pour le placer ailleurs.",
        ] },
      ],
    },
    {
      id: "seq-6",
      title: "Comprendre les extensions de fichiers",
      icon: "FileType",
      blocks: [
        { type: "text", html: "L'<strong>extension</strong> est la partie située à la fin du nom du fichier. Elle indique le type de fichier et l'application capable de l'ouvrir." },
        { type: "infographic", kind: "table", title: "Extensions courantes", data: { columns: ["Extension", "Type de fichier"], rows: [
          [".docx", "Document Word"], [".xlsx", "Classeur Excel"], [".pptx", "Présentation PowerPoint"], [".pdf", "Document de lecture / impression"], [".jpg / .png", "Image"], [".mp3", "Audio"], [".mp4", "Vidéo"], [".zip", "Dossier compressé"], [".exe", "Programme exécutable"],
        ] } },
        { type: "callout", tone: "warn", title: "Attention aux exécutables", text: "Un fichier .exe peut installer une application, mais aussi contenir un programme malveillant si sa provenance n'est pas fiable. L'installation doit respecter les règles de l'établissement." },
      ],
    },
    {
      id: "seq-7",
      title: "Utiliser une clé USB ou un disque externe",
      icon: "Usb",
      blocks: [
        { type: "text", html: "La clé USB est très utilisée en formation, mais elle se manipule avec prudence. L'<strong>éjection correcte</strong> évite la perte ou la corruption de fichiers : lorsqu'un fichier est en cours de copie, l'ordinateur peut encore écrire des données ; retirer brutalement la clé interrompt l'opération." },
        { type: "keypoints", title: "Le bon geste, étape par étape", points: [
          "Brancher la clé puis l'ouvrir dans l'explorateur de fichiers.",
          "Copier le document, puis vérifier qu'il est bien présent.",
          "Éjecter correctement la clé avant de la retirer.",
        ] },
        { type: "callout", tone: "warn", title: "Règle d'or", text: "Ne jamais conserver l'unique copie importante d'un document sur une clé USB : elle peut se perdre, se casser ou être infectée. Avoir au moins deux emplacements de sauvegarde (ordinateur + support externe, ou ordinateur + cloud)." },
      ],
    },
    {
      id: "seq-8",
      title: "Installer et désinstaller une application",
      icon: "Download",
      blocks: [
        { type: "text", html: "Installer une application, c'est ajouter un programme à l'ordinateur ; désinstaller, c'est le retirer proprement. Toute installation doit provenir d'une <strong>source fiable</strong> : site officiel de l'éditeur, magasin d'applications reconnu ou support validé par l'institution." },
        { type: "infographic", kind: "steps", title: "Les étapes d'une installation", data: { steps: [
          { title: "Téléchargement", text: "depuis une source officielle" },
          { title: "Lancement", text: "du fichier d'installation" },
          { title: "Acceptation prudente", text: "des conditions" },
          { title: "Choix des options" },
          { title: "Finalisation", text: "et création éventuelle d'un raccourci" },
        ] } },
        { type: "callout", tone: "tip", title: "Désinstaller proprement", text: "Désinstaller via les paramètres du système, et non en supprimant l'icône du bureau : supprimer une icône ne retire qu'un raccourci, pas forcément le logiciel." },
      ],
    },
    {
      id: "seq-9",
      title: "Premières règles de sécurité numérique",
      icon: "ShieldCheck",
      blocks: [
        { type: "text", html: "L'objectif est de créer de <strong>bonnes habitudes</strong> dès le départ, sans entrer dans des détails trop techniques. Ces réflexes seront réinvestis dans tous les autres modules." },
        { type: "infographic", kind: "rules", title: "Quatre règles à retenir", data: { rules: [
          { icon: "KeyRound", title: "Mots de passe", text: "Robustes, difficiles à deviner, différents selon les services importants et jamais partagés." },
          { icon: "Save", title: "Sauvegarde", text: "Un document important est toujours sauvegardé à plusieurs endroits." },
          { icon: "ShieldAlert", title: "Prudence", text: "Ne pas ouvrir un fichier inconnu, ne pas installer un programme non vérifié, ne pas brancher une clé trouvée." },
          { icon: "EyeOff", title: "Confidentialité", text: "Fermer sa session après usage et ne pas enregistrer ses mots de passe sur un poste partagé." },
        ] } },
      ],
    },
  ],
  exercises: [
    {
      id: "f1", kind: "categorize", title: "Identifier les composants",
      instruction: "Glissez (ou cliquez) chaque élément vers sa catégorie : périphérique d'entrée, de sortie ou de stockage.",
      categories: ["Entrée", "Sortie", "Stockage"],
      items: [
        { label: "Clavier", category: "Entrée" }, { label: "Souris", category: "Entrée" }, { label: "Webcam", category: "Entrée" },
        { label: "Écran", category: "Sortie" }, { label: "Imprimante", category: "Sortie" }, { label: "Haut-parleurs", category: "Sortie" },
        { label: "Clé USB", category: "Stockage" }, { label: "Disque externe", category: "Stockage" },
      ],
      feedback: "Les périphériques d'entrée introduisent l'information (clavier, souris, webcam), ceux de sortie restituent un résultat (écran, imprimante, haut-parleurs), ceux de stockage conservent ou transportent les données (clé USB, disque externe).",
    },
    {
      id: "f2", kind: "order", title: "Arrêter correctement l'ordinateur",
      instruction: "Remettez les actions dans le bon ordre pour arrêter correctement un ordinateur.",
      items: ["Enregistrer son travail", "Fermer les applications ouvertes", "Cliquer sur le menu d'alimentation", "Choisir « Arrêter »", "Vérifier que l'ordinateur est éteint"],
      feedback: "On enregistre d'abord pour éviter la perte de données, puis on ferme les applications, et on utilise enfin la commande normale d'arrêt.",
    },
    {
      id: "f3", kind: "qcm", multiple: true, title: "Nommage de fichiers",
      instruction: "Parmi ces noms de fichiers, lesquels sont professionnels (clairs et exploitables) ?",
      options: [
        { text: "document1.docx", correct: false },
        { text: "Rapport_Diagnostic_CERTEL_Koffi_2026-06-29.docx", correct: true },
        { text: "mon truc final final vrai.docx", correct: false },
        { text: "Liste_Presence_Niveau1_Juin2026.xlsx", correct: true },
        { text: "????rapport////.docx", correct: false },
      ],
      feedback: "Un bon nom identifie rapidement le contenu (type, thème, auteur, date). Les noms vagues, confus ou contenant des caractères interdits sont à proscrire.",
    },
    {
      id: "f4", kind: "categorize", title: "Copier ou déplacer ?",
      instruction: "Pour chaque situation, choisissez l'action adaptée : copier (garder l'original) ou déplacer (changer d'emplacement).",
      categories: ["Copier", "Déplacer"],
      items: [
        { label: "Garder un fichier sur mon PC et en mettre une copie sur ma clé USB", category: "Copier" },
        { label: "Envoyer un double de mon rapport à un collègue", category: "Copier" },
        { label: "Ranger une image mise par erreur dans le mauvais dossier", category: "Déplacer" },
        { label: "Retirer un fichier du bureau pour le mettre dans Documents", category: "Déplacer" },
      ],
      feedback: "Copier crée un double en conservant l'original ; déplacer change l'emplacement du fichier (l'original ne reste pas).",
    },
    { id: "q1", kind: "qcm", title: "Saisir du texte", instruction: "Quel élément permet principalement de saisir du texte ?", options: [{ text: "Écran", correct: false }, { text: "Clavier", correct: true }, { text: "Imprimante", correct: false }, { text: "Haut-parleur", correct: false }], feedback: "Le clavier est un périphérique d'entrée utilisé pour saisir lettres, chiffres et symboles." },
    { id: "q2", kind: "qcm", title: "Afficher l'information", instruction: "Quel élément permet d'afficher les informations produites par l'ordinateur ?", options: [{ text: "Souris", correct: false }, { text: "Écran", correct: true }, { text: "Clé USB", correct: false }, { text: "Microphone", correct: false }], feedback: "L'écran est un périphérique de sortie." },
    { id: "q3", kind: "qcm", title: "Avant d'éteindre", instruction: "Que faut-il faire avant d'éteindre un ordinateur ?", options: [{ text: "Débrancher directement", correct: false }, { text: "Enregistrer son travail", correct: true }, { text: "Retirer la souris", correct: false }, { text: "Appuyer longtemps sur le bouton", correct: false }], feedback: "Enregistrer évite la perte de données." },
    { id: "q4", kind: "qcm", title: "Rôle d'un dossier", instruction: "Un dossier sert principalement à :", options: [{ text: "Afficher une vidéo", correct: false }, { text: "Ranger des fichiers", correct: true }, { text: "Imprimer", correct: false }, { text: "Créer un mot de passe", correct: false }], feedback: "Le dossier est un contenant numérique." },
    { id: "q5", kind: "qcm", title: "Le nom le plus clair", instruction: "Quel nom de fichier est le plus clair ?", options: [{ text: "doc1.docx", correct: false }, { text: "final.docx", correct: false }, { text: "Rapport_Stage_Amani_2026-06-29.docx", correct: true }, { text: "nouveau nouveau vrai.docx", correct: false }], feedback: "Ce nom indique la nature, le thème, l'auteur et la date." },
    { id: "q6", kind: "qcm", title: "L'extension .pdf", instruction: "Que signifie l'extension .pdf ?", options: [{ text: "Fichier audio", correct: false }, { text: "Document de lecture ou d'impression", correct: true }, { text: "Application dangereuse", correct: false }, { text: "Image animée", correct: false }], feedback: "Le PDF conserve généralement la mise en forme." },
    { id: "q7", kind: "qcm", title: "Extension d'image", instruction: "Quelle extension correspond à une image ?", options: [{ text: ".jpg", correct: true }, { text: ".xlsx", correct: false }, { text: ".docx", correct: false }, { text: ".exe", correct: false }], feedback: ".jpg est un format courant d'image." },
    { id: "q8", kind: "qcm", title: "Programme exécutable", instruction: "Quelle extension peut correspondre à un programme exécutable sous Windows ?", options: [{ text: ".docx", correct: false }, { text: ".png", correct: false }, { text: ".exe", correct: true }, { text: ".pdf", correct: false }], feedback: "Il faut être prudent avec les fichiers exécutables." },
    { id: "q9", kind: "qcm", title: "Copier un fichier", instruction: "Copier un fichier signifie :", options: [{ text: "Le supprimer", correct: false }, { text: "Créer un double", correct: true }, { text: "Le renommer", correct: false }, { text: "Le transformer en image", correct: false }], feedback: "Copier conserve l'original et crée une copie." },
    { id: "q10", kind: "qcm", title: "Déplacer un fichier", instruction: "Déplacer un fichier signifie :", options: [{ text: "Le mettre ailleurs en quittant l'ancien emplacement", correct: true }, { text: "Le dupliquer", correct: false }, { text: "Le compresser", correct: false }, { text: "Le convertir", correct: false }], feedback: "Déplacer change l'emplacement du fichier." },
    { id: "q11", kind: "qcm", title: "Éjecter une clé USB", instruction: "Pourquoi faut-il éjecter correctement une clé USB ?", options: [{ text: "Changer sa couleur", correct: false }, { text: "Éviter la corruption des fichiers", correct: true }, { text: "Augmenter Internet", correct: false }, { text: "Installer Word", correct: false }], feedback: "L'éjection termine proprement les opérations d'écriture." },
    { id: "q12", kind: "qcm", title: "Le comportement le plus sûr", instruction: "Quel comportement est le plus sûr ?", options: [{ text: "Brancher toute clé trouvée", correct: false }, { text: "Installer tout fichier reçu", correct: false }, { text: "Utiliser un mot de passe solide", correct: true }, { text: "Partager son mot de passe", correct: false }], feedback: "La sécurité commence par un mot de passe robuste, la prudence et la confidentialité." },
    { id: "q13", kind: "truefalse", title: "Icône et désinstallation", instruction: "Vrai ou faux ?", statement: "Supprimer une icône sur le bureau signifie toujours désinstaller le logiciel.", answer: false, feedback: "Faux : une icône peut être un simple raccourci ; le logiciel reste installé." },
    { id: "q14", kind: "qcm", title: "Fichiers importants", instruction: "Quelle pratique est recommandée pour les fichiers importants ?", options: [{ text: "Les garder uniquement sur clé USB", correct: false }, { text: "Les sauvegarder à plusieurs endroits", correct: true }, { text: "Les laisser sur le bureau", correct: false }, { text: "Les envoyer à tout le monde", correct: false }], feedback: "Une sauvegarde multiple réduit les risques de perte." },
    { id: "q15", kind: "qcm", title: "Fin de session partagée", instruction: "Dans une salle informatique partagée, que faut-il faire à la fin ?", options: [{ text: "Laisser sa session ouverte", correct: false }, { text: "Fermer sa session ou éteindre correctement", correct: true }, { text: "Laisser les fichiers ouverts", correct: false }, { text: "Enregistrer son mot de passe", correct: false }], feedback: "Fermer sa session protège ses données." },
  ],
  caseStudy: {
    title: "Étude de cas — Le bureau d'Awa",
    scenario:
      "Awa prépare une formation numérique dans un établissement scolaire. Elle enregistre tous ses fichiers sur le bureau : doc1.docx, nouveau.docx, image.jpg, final.pptx, notes.xlsx. Après quelques jours, elle ne retrouve plus la bonne version de sa présentation. Elle copie certains fichiers sur une clé USB, mais retire la clé sans l'éjecter. Le lendemain, un fichier ne s'ouvre plus.",
    questions: [
      "Identifiez trois erreurs commises par Awa.",
      "Proposez une meilleure organisation de ses fichiers.",
      "Proposez trois règles de sécurité ou de prudence à appliquer.",
      "Renommez correctement les cinq fichiers.",
    ],
    corrige: [
      "Trois erreurs : tout enregistrer sur le bureau, utiliser des noms trop vagues, et retirer la clé USB sans l'éjecter.",
      "Une arborescence claire : Formation_Numerique_Awa → Documents_Word, Presentations, Tableaux, Images, Sauvegardes.",
      "Trois règles : nommer les fichiers clairement, sauvegarder à au moins deux endroits, toujours éjecter la clé USB avant de la retirer.",
      "Renommage : Note_FormationNumerique_Awa_2026-06-29.docx · Plan_Module1_Awa_2026-06-29.docx · Image_Illustration_Ordinateur_Awa.jpg · Presentation_CERTEL_Niveau1_Awa_V1.pptx · Tableau_Notes_Diagnostic_Awa_2026-06.xlsx",
    ],
  },
};
