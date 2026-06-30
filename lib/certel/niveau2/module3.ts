import type { N1Module } from "../niveau1/types";

/** Niveau 2 — Module 3 : Classes virtuelles et collaboration à distance. */
export const MODULE_3: N1Module = {
  code: "N2-M3",
  slug: "module-3",
  num: 3,
  title: "Classes virtuelles et collaboration à distance",
  subtitle:
    "Préparer, animer, sécuriser et évaluer une séance collaborative à distance.",
  duration: "13,5 heures · 1,5 semaine",
  finalite:
    "Développer la capacité à organiser, animer, sécuriser et évaluer une séance collaborative à distance.",
  objectives: [
    "Organiser et animer une réunion ou une classe virtuelle.",
    "Utiliser les fonctions avancées de visioconférence : partage, sous-groupes, sondages, enregistrement.",
    "Coproduire des documents en temps réel dans un espace cloud partagé.",
    "Gérer les droits d'accès et la sécurité d'un espace collaboratif.",
    "Évaluer la fiabilité des informations et ressources partagées en séance.",
    "Adopter une étiquette numérique et une animation inclusive à distance.",
  ],
  competences: [
    { group: "Techniques", text: "Utiliser le partage d'écran, le chat, les sondages et les sous-groupes à bon escient, et exploiter les fonctions avancées d'un outil de visioconférence." },
    { group: "Organisationnelles", text: "Créer un ordre du jour et une invitation claire, attribuer les rôles (animateur, rapporteur, gardien du temps, modérateur du chat) et organiser un dossier cloud d'équipe." },
    { group: "Sécurité", text: "Gérer les droits d'accès (lecture, commentaire, modification), sécuriser le partage, utiliser l'historique des versions et supprimer les accès temporaires après la séance." },
    { group: "Transversales", text: "Évaluer la fiabilité d'une source, adopter une étiquette numérique inclusive et produire un compte rendu collaboratif de qualité." },
  ],
  lessons: [
    {
      id: "seq-1",
      title: "Comprendre la classe virtuelle",
      icon: "Video",
      blocks: [
        { type: "text", html: "La classe virtuelle est un <strong>espace pédagogique et relationnel</strong>. Elle ne se limite pas à ouvrir un lien de visioconférence. Elle exige une planification, une distribution des rôles, une gestion du temps, des interactions, des supports, des droits d'accès et des traces de séance." },
        { type: "text", html: "Dans un contexte professionnel, l'animation à distance doit <strong>maintenir l'attention</strong>, <strong>inclure les participants</strong> et <strong>sécuriser les échanges</strong>. Les outils de visioconférence et de cloud ne remplacent pas la pédagogie : ils la rendent possible à distance lorsqu'ils sont utilisés avec méthode." },
        { type: "keypoints", title: "Ce qu'exige une séance à distance", points: [
          "Une planification claire (objectifs, horaire, durée, supports).",
          "Une distribution des rôles entre participants.",
          "Une gestion du temps et des interactions.",
          "Des droits d'accès adaptés et des traces de séance.",
        ] },
        { type: "callout", tone: "info", title: "Alignement de compétences", text: "Le module renforce DigComp 2 (communication et collaboration), DigComp 1 (évaluation de l'information) et DigCompEdu (collaboration professionnelle et engagement des apprenants)." },
      ],
    },
    {
      id: "seq-2",
      title: "Préparer une classe virtuelle",
      icon: "ClipboardList",
      blocks: [
        { type: "text", html: "Une séance à distance réussie se prépare comme une séance en présence, mais avec des contraintes particulières. Le <strong>lien de connexion</strong>, l'horaire, la durée, les objectifs, les supports et les règles de participation doivent être communiqués à l'avance." },
        { type: "text", html: "La préparation doit prévoir les <strong>risques</strong> : problème de micro, connexion instable, participants en retard, lien incorrect, absence de document partagé. Une check-list réduit ces difficultés. L'<strong>ordre du jour</strong> donne le rythme : il annonce les temps d'accueil, d'activité, d'échange, de synthèse et de clôture." },
        { type: "infographic", kind: "rules", title: "La check-list de préparation", data: { rules: [
          { icon: "Target", title: "Objectifs annoncés", text: "Les objectifs de la séance sont clairement énoncés." },
          { icon: "Link", title: "Lien testé", text: "Le lien de connexion est vérifié avant la séance." },
          { icon: "FileText", title: "Supports prêts", text: "Les supports sont prêts et accessibles." },
          { icon: "Users", title: "Rôles distribués", text: "Les rôles sont répartis entre les participants." },
        ] } },
        { type: "callout", tone: "example", title: "Une invitation professionnelle", text: "Elle contient le thème, la date, l'heure, le lien, les objectifs, les prérequis techniques et la consigne de connexion cinq minutes avant." },
      ],
    },
    {
      id: "seq-3",
      title: "Animer l'attention et l'interaction",
      icon: "Presentation",
      blocks: [
        { type: "text", html: "En visioconférence, l'attention baisse plus vite qu'en présence si le participant reste passif. L'animateur doit prévoir des <strong>interactions courtes</strong> : question dans le chat, sondage, prise de parole, partage d'écran ou travail en sous-groupe." },
        { type: "text", html: "Les <strong>sous-groupes</strong> permettent de faire travailler les participants en petits collectifs. Ils doivent être accompagnés d'une consigne précise, d'un temps limité et d'un livrable attendu. Le <strong>partage d'écran</strong> doit rester maîtrisé : seules les fenêtres utiles sont montrées, les notifications sont désactivées et les documents personnels ne doivent pas apparaître." },
        { type: "infographic", kind: "steps", title: "Le rythme d'une animation vivante", data: { steps: [
          { title: "Alterner exposé et activité", text: "Éviter les longues plages d'écoute passive." },
          { title: "Utiliser le chat avec intention", text: "Poser des questions, recueillir des réponses." },
          { title: "Donner des consignes claires", text: "Pour les sous-groupes : objectif, temps, livrable." },
          { title: "Faire une synthèse", text: "Après chaque activité." },
        ] } },
        { type: "callout", tone: "example", title: "Exemple pédagogique", text: "Après dix minutes d'explication, l'animateur lance un sondage de vérification, puis demande à deux participants de justifier leur choix." },
      ],
    },
    {
      id: "seq-4",
      title: "Distribuer les rôles",
      icon: "Users",
      blocks: [
        { type: "text", html: "Une animation à distance gagne en clarté lorsque chacun connaît sa fonction. La distribution des rôles soulage l'animateur et implique les participants dans la conduite de la séance." },
        { type: "infographic", kind: "categories", title: "Quatre rôles clés", data: { columns: [
          { title: "Conduite", accent: "#6D5DF5", items: [{ label: "Animateur", hint: "guide la séance et les activités" }, { label: "Gardien du temps", hint: "veille au respect du déroulement" }] },
          { title: "Traces", accent: "#0891B2", items: [{ label: "Rapporteur", hint: "rédige le compte rendu" }] },
          { title: "Échanges", accent: "#16A34A", items: [{ label: "Modérateur du chat", hint: "suit et relaie les messages" }] },
        ] } },
        { type: "callout", tone: "tip", title: "Le gardien du temps", text: "Son rôle est de gérer le respect du déroulement : il aide l'animateur à tenir les séquences prévues, sans contrôler les mots de passe ni décorer les supports." },
      ],
    },
    {
      id: "seq-5",
      title: "Collaborer dans le cloud",
      icon: "Cloud",
      blocks: [
        { type: "text", html: "La collaboration en ligne repose sur un <strong>espace commun organisé</strong>. Les participants doivent savoir où trouver les documents, qui peut modifier, qui peut commenter et comment nommer les versions." },
        { type: "text", html: "La <strong>coédition en temps réel</strong> peut être très efficace, mais elle devient confuse sans règles. Il faut répartir les sections, utiliser les commentaires, éviter les suppressions non expliquées et activer l'<strong>historique des versions</strong>." },
        { type: "infographic", kind: "tree", title: "Une arborescence d'équipe", data: { root: "Projet_Equipe", nodes: [
          { label: "01_Supports" },
          { label: "02_Production" },
          { label: "03_Compte_rendu" },
          { label: "04_Archives" },
        ] } },
        { type: "keypoints", title: "Les bons réflexes de coédition", points: [
          "Créer une arborescence d'équipe lisible.",
          "Attribuer les droits : lecture, commentaire, modification.",
          "Utiliser l'historique des versions.",
          "Restaurer une version antérieure si nécessaire.",
        ] },
      ],
    },
    {
      id: "seq-6",
      title: "Sécuriser le partage et les droits",
      icon: "ShieldCheck",
      blocks: [
        { type: "text", html: "La sécurité du partage est essentielle. Un <strong>lien public ouvert en modification</strong> expose le document à des erreurs ou des intrusions. Le droit d'accès doit correspondre au <strong>rôle de chacun</strong> et rester limité au besoin réel." },
        { type: "infographic", kind: "table", title: "Quel droit pour quel rôle ?", data: { columns: ["Rôle", "Droit d'accès"], rows: [
          ["Participant producteur", "Modification"],
          ["Relecteur", "Commentaire"],
          ["Public externe", "Lecture seule"],
        ] } },
        { type: "callout", tone: "warn", title: "Après la séance", text: "Supprimer les accès temporaires une fois la séance terminée, vérifier les liens, activer la salle d'attente si nécessaire et désactiver les notifications lors du partage d'écran." },
        { type: "callout", tone: "tip", title: "Le mode commentaire", text: "Il permet de suggérer sans modifier directement le document : c'est l'outil d'une relecture contrôlée." },
      ],
    },
    {
      id: "seq-7",
      title: "Évaluer les sources à distance",
      icon: "Search",
      blocks: [
        { type: "text", html: "Dans une séance en ligne, les participants partagent souvent des liens. L'animateur doit former à l'<strong>évaluation rapide</strong> : auteur, date, intention, source primaire ou secondaire, recoupement et cohérence." },
        { type: "text", html: "Une information fiable n'est pas seulement une information <em>bien présentée</em>. Les fausses informations peuvent avoir une mise en page professionnelle. La vérification doit porter sur l'<strong>origine</strong>, la <strong>preuve</strong> et le <strong>contexte</strong>." },
        { type: "infographic", kind: "steps", title: "Les quatre gestes du fact-checking", data: { steps: [
          { title: "Identifier l'auteur", text: "Qui publie ? Quelle organisation ?" },
          { title: "Vérifier la date", text: "L'information est-elle à jour ?" },
          { title: "Repérer l'intention", text: "But informatif, commercial ou militant ?" },
          { title: "Recouper", text: "Comparer avec une source reconnue." },
        ] } },
        { type: "callout", tone: "warn", title: "Signal d'alerte", text: "Un article sans auteur, sans date et diffusé par un site militant doit être traité avec prudence, surtout s'il affirme un fait chiffré sans source." },
      ],
    },
    {
      id: "seq-8",
      title: "Étiquette numérique et inclusion",
      icon: "Smile",
      blocks: [
        { type: "text", html: "Une <strong>étiquette numérique correcte</strong> soutient la qualité des échanges. Elle consiste à respecter les tours de parole, à couper son micro lorsque c'est nécessaire et à ne pas interrompre constamment." },
        { type: "infographic", kind: "two-columns", title: "Bonnes et mauvaises pratiques", data: { left: { title: "À adopter", subtitle: "animation inclusive", items: ["Respecter les tours de parole", "Couper son micro si nécessaire", "Donner la parole à chacun", "Prévenir avant d'enregistrer"] }, right: { title: "À éviter", subtitle: "ce qui dégrade l'échange", items: ["Interrompre constamment", "Partager des fichiers privés", "Enregistrer sans prévenir", "Monopoliser la parole"] } } },
        { type: "callout", tone: "tip", title: "Trace écrite à retenir", text: "Animer à distance demande de préparer, guider, faire participer, sécuriser et conclure. Les outils ne remplacent pas la pédagogie ; ils la rendent possible." },
      ],
    },
  ],
  exercises: [
    {
      id: "f1", kind: "categorize", title: "Attribuer les droits cloud",
      instruction: "Pour chaque profil, choisissez le droit d'accès adapté au besoin réel.",
      categories: ["Modification", "Commentaire", "Lecture seule"],
      items: [
        { label: "Participant producteur", category: "Modification" },
        { label: "Relecteur", category: "Commentaire" },
        { label: "Public externe", category: "Lecture seule" },
      ],
      feedback: "Le participant producteur reçoit le droit de modification, le relecteur le droit de commentaire, et le public externe la lecture seule. Les droits doivent être limités au besoin réel.",
    },
    {
      id: "f2", kind: "order", title: "Préparer puis animer une classe virtuelle",
      instruction: "Remettez les étapes dans le bon ordre, de la préparation à la clôture.",
      items: ["Définir le thème, l'objectif et le public", "Préparer une invitation et un ordre du jour", "Tester le lien et les supports avant la séance", "Animer la séance en prévoyant une interaction", "Clôturer par une synthèse et une consigne de suivi"],
      feedback: "On définit d'abord le cadre (thème, objectif, public), on prépare l'invitation et l'ordre du jour, on teste la technique, puis on anime avec une interaction et on clôture par une synthèse.",
    },
    {
      id: "f3", kind: "qcm", multiple: true, title: "Une invitation efficace",
      instruction: "Quels éléments une invitation de classe virtuelle complète doit-elle contenir ?",
      options: [
        { text: "Titre, objectif, date, heure et durée", correct: true },
        { text: "Lien de connexion et outil utilisé", correct: true },
        { text: "Consignes de connexion et documents à préparer", correct: true },
        { text: "Contact en cas de difficulté", correct: true },
        { text: "Le mot de passe personnel de l'animateur", correct: false },
      ],
      feedback: "L'invitation doit contenir titre, objectif, date, heure, durée, lien, outil utilisé, consignes de connexion, documents à préparer et contact en cas de difficulté. Un mot de passe personnel ne se partage jamais.",
    },
    {
      id: "f4", kind: "match", title: "Chaque rôle à sa fonction",
      instruction: "Associez chaque rôle à sa fonction principale dans la classe virtuelle.",
      pairs: [
        { left: "Animateur", right: "Guide la séance et les activités" },
        { left: "Gardien du temps", right: "Veille au respect du déroulement" },
        { left: "Rapporteur", right: "Rédige le compte rendu" },
        { left: "Modérateur du chat", right: "Suit et relaie les messages" },
      ],
      feedback: "Chaque rôle soulage l'animateur et implique les participants : conduite, gestion du temps, traces écrites et gestion des échanges.",
    },
    {
      id: "f5", kind: "categorize", title: "Étiquette numérique",
      instruction: "Classez chaque comportement : à adopter ou à éviter en visioconférence.",
      categories: ["À adopter", "À éviter"],
      items: [
        { label: "Respecter les tours de parole", category: "À adopter" },
        { label: "Couper son micro si nécessaire", category: "À adopter" },
        { label: "Prévenir avant d'enregistrer", category: "À adopter" },
        { label: "Interrompre constamment", category: "À éviter" },
        { label: "Partager des fichiers privés", category: "À éviter" },
        { label: "Enregistrer sans prévenir", category: "À éviter" },
      ],
      feedback: "La politesse numérique soutient la qualité des échanges : respecter la parole, gérer son micro et prévenir avant d'enregistrer ; à l'inverse, interrompre, exposer des fichiers privés ou enregistrer en cachette dégrade la séance.",
    },
    {
      id: "f6", kind: "order", title: "Les quatre gestes du fact-checking",
      instruction: "Remettez dans l'ordre la démarche d'évaluation rapide d'une source partagée.",
      items: ["Identifier l'auteur et l'organisation", "Vérifier la date", "Repérer l'intention du site", "Recouper avec une source reconnue"],
      feedback: "On identifie l'auteur, on vérifie la date, on repère l'intention puis on recoupe avec une source reconnue. La fiabilité repose sur l'origine, la preuve et le contexte.",
    },
    { id: "q1", kind: "qcm", title: "La priorité d'une classe virtuelle", instruction: "Une classe virtuelle réussie nécessite d'abord :", options: [{ text: "Une préparation claire", correct: true }, { text: "Un fond animé", correct: false }, { text: "Un micro très cher", correct: false }, { text: "Une musique permanente", correct: false }], feedback: "La technique ne remplace pas la planification pédagogique." },
    { id: "q2", kind: "qcm", title: "Le gardien du temps", instruction: "Le rôle du gardien du temps est de :", options: [{ text: "Gérer le respect du déroulement", correct: true }, { text: "Contrôler les mots de passe", correct: false }, { text: "Supprimer les documents", correct: false }, { text: "Décorer les slides", correct: false }], feedback: "Il aide l'animateur à respecter les séquences." },
    { id: "q3", kind: "qcm", title: "Un lien cloud public en modification", instruction: "Un lien cloud public en modification :", options: [{ text: "Peut être risqué", correct: true }, { text: "Est toujours obligatoire", correct: false }, { text: "Empêche toute erreur", correct: false }, { text: "Supprime les versions", correct: false }], feedback: "Il peut exposer le document à des modifications non maîtrisées." },
    { id: "q4", kind: "qcm", title: "Accompagner les sous-groupes", instruction: "Les sous-groupes doivent être accompagnés :", options: [{ text: "D'une consigne claire et d'un livrable attendu", correct: true }, { text: "D'un silence total", correct: false }, { text: "D'un lien non testé", correct: false }, { text: "D'un accès libre sans objectif", correct: false }], feedback: "Sans consigne, les sous-groupes perdent leur efficacité." },
    { id: "q5", kind: "qcm", title: "Vérifier une source", instruction: "Pour vérifier une source, on examine notamment :", options: [{ text: "Auteur, date, intention, recoupement", correct: true }, { text: "Uniquement la couleur du site", correct: false }, { text: "Le nombre d'images", correct: false }, { text: "La taille du logo", correct: false }], feedback: "La fiabilité repose sur des critères documentaires." },
    { id: "q6", kind: "qcm", title: "Le mode commentaire", instruction: "Le mode commentaire dans le cloud permet :", options: [{ text: "De suggérer sans modifier directement", correct: true }, { text: "De supprimer le fichier", correct: false }, { text: "De bloquer les participants", correct: false }, { text: "De changer le mot de passe", correct: false }], feedback: "Il est utile pour une relecture contrôlée." },
    { id: "q7", kind: "qcm", title: "Le partage d'écran", instruction: "Le partage d'écran doit être :", options: [{ text: "Préparé et limité aux contenus utiles", correct: true }, { text: "Totalement improvisé", correct: false }, { text: "Activé avec toutes les notifications visibles", correct: false }, { text: "Obligatoirement permanent", correct: false }], feedback: "Cela réduit les risques et améliore la clarté." },
    { id: "q8", kind: "qcm", title: "L'étiquette numérique", instruction: "Une étiquette numérique correcte consiste à :", options: [{ text: "Respecter les tours de parole et couper son micro si nécessaire", correct: true }, { text: "Interrompre constamment", correct: false }, { text: "Partager des fichiers privés", correct: false }, { text: "Enregistrer sans prévenir", correct: false }], feedback: "La politesse numérique soutient la qualité des échanges." },
    { id: "q9", kind: "qcm", title: "L'historique des versions", instruction: "L'historique des versions sert à :", options: [{ text: "Retrouver ou restaurer une version antérieure", correct: true }, { text: "Éteindre le cloud", correct: false }, { text: "Masquer les auteurs", correct: false }, { text: "Remplacer le document", correct: false }], feedback: "Il sécurise la coédition." },
    { id: "q10", kind: "truefalse", title: "Une ressource sans auteur ni date", instruction: "Vrai ou faux ?", statement: "Une ressource sans auteur ni date peut être acceptée automatiquement.", answer: false, feedback: "Faux : une ressource sans auteur ni date doit être vérifiée avec prudence ; l'absence d'informations d'identification affaiblit la fiabilité." },
    { id: "q11", kind: "truefalse", title: "Les outils suffisent-ils ?", instruction: "Vrai ou faux ?", statement: "Les outils de visioconférence et de cloud remplacent la pédagogie.", answer: false, feedback: "Faux : les outils ne remplacent pas la pédagogie ; ils la rendent possible à distance lorsqu'ils sont utilisés avec méthode." },
  ],
  caseStudy: {
    title: "Étude de cas — Une réunion mal préparée",
    scenario:
      "Un formateur lance une réunion en retard, partage tout son écran avec ses notifications visibles, oublie l'ordre du jour et donne un lien cloud ouvert à tous en modification.",
    questions: [
      "Identifiez les risques pédagogiques et numériques.",
      "Proposez une procédure corrigée.",
      "Indiquez les mesures de sécurité à appliquer.",
    ],
    corrige: [
      "Les risques sont la perte de temps, la confusion des participants, l'exposition de données personnelles (notifications, écran entier) et la modification non contrôlée des documents (lien ouvert en modification).",
      "La procédure corrigée prévoit un test technique, un ordre du jour, le partage d'une fenêtre précise (et non de tout l'écran), des règles de participation et des droits cloud limités au rôle de chacun.",
      "Les mesures de sécurité incluent des liens vérifiés, une salle d'attente si nécessaire, la désactivation des notifications, des droits adaptés et la suppression des accès temporaires après la séance.",
    ],
  },
};
