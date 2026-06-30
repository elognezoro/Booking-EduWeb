import type { CertelEvaluation } from "./types";

/**
 * Contenu de l'évaluation certifiante du Niveau 1 — CERTEL / EduWeb.
 * Fidèle au document institutionnel « Évaluation certifiante du Niveau 1 ».
 * Module neutre (client/serveur).
 */

export const EVAL_N1: CertelEvaluation = {
  levelKey: "N1",
  title: "Évaluation certifiante du Niveau 1",
  intro:
    "L'évaluation certifiante du Niveau 1 — <strong>Fondamentaux numériques, bureautiques et intelligence artificielle</strong> — vérifie que l'apprenant possède les compétences indispensables pour travailler de manière autonome dans un environnement numérique courant. Elle ne se limite pas à un contrôle de connaissances : elle exige la production de <strong>livrables observables</strong>, la réalisation de <strong>gestes techniques</strong> et la capacité à <em>expliquer ses choix</em>. Le dispositif est construit autour de trois dimensions complémentaires : le <strong>contrôle continu</strong> (40 %), le <strong>projet de synthèse</strong> (30 %) et l'<strong>examen final mixte</strong> (30 %), ce dernier réunissant un QCM de connaissances et une mise en situation pratique chronométrée. Le dispositif insiste aussi sur la <strong>responsabilité numérique</strong> : protection des données personnelles, mots de passe robustes, vigilance face au phishing, vérification de l'information et usage prudent de l'IA générative. L'objectif est de former un utilisateur <em>autonome, rigoureux et responsable</em>, en cohérence avec le cadre DigComp 2.2 et les recommandations CNIL, ANSSI et UNESCO.",
  competences: [
    "Domaine 1 — Information et données : rechercher une information, sélectionner une source, évaluer sa fiabilité et citer une référence simple.",
    "Domaine 2 — Communication et collaboration : envoyer un e-mail professionnel, partager un fichier dans le cloud, participer à une réunion en ligne et respecter la politesse numérique.",
    "Domaine 3 — Création de contenus numériques : produire un document Word, un tableau Excel et une présentation PowerPoint selon des critères professionnels simples.",
    "Domaine 4 — Sécurité : protéger ses mots de passe, reconnaître une menace, limiter l'exposition des données personnelles et adopter des gestes de prudence.",
    "Compétence IA débutante : rédiger un prompt simple, analyser une réponse d'IA, vérifier une information et corriger les erreurs manifestes.",
    "Organiser un espace de travail numérique et sauvegarder ses fichiers de manière fiable.",
  ],
  notation: [
    {
      part: "Contrôle continu",
      weight: "40 %",
      description:
        "Tâches pratiques notées et livrables produits dans chaque module : gestion de fichiers, Word, Excel, PowerPoint, e-mail, cloud, sécurité et IA.",
    },
    {
      part: "Projet de synthèse",
      weight: "30 %",
      description:
        "Livrable numérique professionnel complet : rapport Word, tableau Excel avec formules et graphique, présentation PowerPoint et dépôt dans un espace cloud partagé. Validation obligatoire pour la certification.",
    },
    {
      part: "Examen final mixte",
      weight: "30 %",
      description:
        "Sur 60 points, converti en 30 % de la note finale. Partie A : QCM de connaissances sur 30 points (45 min). Partie B : mise en situation pratique chronométrée sur 30 points (90 min).",
    },
  ],
  seuil:
    "Moyenne générale ≥ 60/100 avec validation obligatoire du projet de synthèse (projet ≥ 15/30). Ajournement avec remédiation si moyenne entre 50 et 59, ou projet entre 12 et 14. Non certifié si moyenne < 50 ou absence de livrable de synthèse. L'obtention du certificat du Niveau 1 conditionne l'accès au Niveau 2.",
  quiz: [
    {
      id: "e1",
      kind: "qcm",
      title: "Recherche efficace (D1)",
      instruction: "Quel est le premier geste pour effectuer une recherche efficace sur Internet ?",
      options: [
        { text: "Ouvrir plusieurs pages au hasard", correct: false },
        { text: "Formuler des mots-clés précis", correct: true },
        { text: "Télécharger le premier fichier trouvé", correct: false },
        { text: "Copier le premier résultat", correct: false },
      ],
      feedback:
        "Bonne réponse : B. Une recherche efficace commence par des mots-clés clairs, précis et adaptés au besoin.",
    },
    {
      id: "e2",
      kind: "qcm",
      title: "Fiabilité d'une page web (D1)",
      instruction: "Quelle information aide le plus à évaluer la fiabilité d'une page web ?",
      options: [
        { text: "La couleur du site", correct: false },
        { text: "La présence d'animations", correct: false },
        { text: "L'auteur, la date et la source", correct: true },
        { text: "La taille du logo", correct: false },
      ],
      feedback:
        "Bonne réponse : C. L'auteur, la date, l'intention et la source permettent de juger la crédibilité d'une page.",
    },
    {
      id: "e3",
      kind: "qcm",
      title: "Sources contradictoires (D1)",
      instruction: "Que faut-il faire si deux sources donnent des informations contradictoires ?",
      options: [
        { text: "Choisir celle qui apparaît en premier", correct: false },
        { text: "Comparer avec d'autres sources fiables", correct: true },
        { text: "Ignorer le sujet", correct: false },
        { text: "Publier les deux sans vérification", correct: false },
      ],
      feedback: "Bonne réponse : B. Le recoupement avec d'autres sources fiables est une méthode de vérification essentielle.",
    },
    {
      id: "e4",
      kind: "truefalse",
      title: "Information sans date (D1)",
      instruction: "Vrai ou faux ?",
      statement: "Sur un sujet évolutif, une information sans date doit être considérée comme à vérifier.",
      answer: true,
      feedback:
        "Vrai. Pour les sujets évolutifs, l'absence de date limite la confiance : l'information doit être vérifiée avant d'être utilisée.",
    },
    {
      id: "e5",
      kind: "qcm",
      title: "Citer une source (D1)",
      instruction: "Citer une source sert principalement à :",
      options: [
        { text: "Allonger le document", correct: false },
        { text: "Donner une couleur au texte", correct: false },
        { text: "Permettre la vérification et reconnaître l'origine", correct: true },
        { text: "Remplacer la conclusion", correct: false },
      ],
      feedback:
        "Bonne réponse : C. La citation permet au lecteur de vérifier l'information et respecte l'origine de celle-ci.",
    },
    {
      id: "e6",
      kind: "qcm",
      title: "Objet d'un e-mail (D2)",
      instruction: "Dans un e-mail professionnel, l'objet doit être :",
      options: [
        { text: "Vide", correct: false },
        { text: "Clair et informatif", correct: true },
        { text: "Écrit uniquement en majuscules", correct: false },
        { text: "Très long", correct: false },
      ],
      feedback:
        "Bonne réponse : B. Un objet clair permet au destinataire de comprendre rapidement le but du message.",
    },
    {
      id: "e7",
      kind: "qcm",
      title: "Le champ Cci (D2)",
      instruction: "Le champ Cci (copie cachée) sert à :",
      options: [
        { text: "Envoyer un message sans afficher certains destinataires aux autres", correct: true },
        { text: "Supprimer les pièces jointes", correct: false },
        { text: "Changer la police", correct: false },
        { text: "Bloquer un compte", correct: false },
      ],
      feedback:
        "Bonne réponse : A. Le Cci protège la liste des destinataires lorsque cela est nécessaire.",
    },
    {
      id: "e8",
      kind: "qcm",
      title: "Partager un fichier cloud (D2)",
      instruction: "Avant de partager un fichier dans le cloud, il faut vérifier :",
      options: [
        { text: "La couleur du dossier", correct: false },
        { text: "Les droits d'accès", correct: true },
        { text: "La taille de l'écran", correct: false },
        { text: "Le nombre d'icônes", correct: false },
      ],
      feedback:
        "Bonne réponse : B. Les droits d'accès déterminent qui peut voir, commenter ou modifier le fichier partagé.",
    },
    {
      id: "e9",
      kind: "truefalse",
      title: "Étiquette de réunion en ligne (D2)",
      instruction: "Vrai ou faux ?",
      statement: "En réunion en ligne, il est recommandé de couper son micro lorsqu'on ne parle pas.",
      answer: true,
      feedback:
        "Vrai. Couper son micro hors prise de parole limite les bruits parasites et respecte les autres participants.",
    },
    {
      id: "e10",
      kind: "qcm",
      title: "Collaborer en ligne (D2)",
      instruction: "Collaborer en ligne signifie :",
      options: [
        { text: "Travailler ensemble avec des outils numériques", correct: true },
        { text: "Envoyer uniquement des fichiers par clé USB", correct: false },
        { text: "Travailler sans communiquer", correct: false },
        { text: "Supprimer les fichiers des autres", correct: false },
      ],
      feedback:
        "Bonne réponse : A. La collaboration en ligne repose sur le partage, la communication et la coordination.",
    },
    {
      id: "e11",
      kind: "match",
      title: "Extensions de fichiers (D3)",
      instruction: "Associez chaque type de fichier à son extension courante.",
      pairs: [
        { left: "Document Word moderne", right: ".docx" },
        { left: "Classeur Excel moderne", right: ".xlsx" },
        { left: "Présentation PowerPoint", right: ".pptx" },
        { left: "Document de lecture/impression à mise en page stable", right: ".pdf" },
      ],
      feedback:
        "Word = .docx, Excel = .xlsx, PowerPoint = .pptx, document de lecture/impression = .pdf. Reconnaître les extensions permet d'identifier le bon logiciel et de se méfier des fichiers inattendus.",
    },
    {
      id: "e12",
      kind: "qcm",
      title: "Début d'une formule Excel (D3)",
      instruction: "Dans Excel, une formule commence généralement par :",
      options: [
        { text: "#", correct: false },
        { text: "=", correct: true },
        { text: "@", correct: false },
        { text: "%", correct: false },
      ],
      feedback: "Bonne réponse : B. Le signe égal (=) indique au tableur qu'il doit effectuer un calcul.",
    },
    {
      id: "e13",
      kind: "qcm",
      title: "La formule SOMME (D3)",
      instruction: "La formule =SOMME(B2:B6) sert à :",
      options: [
        { text: "Additionner les cellules B2 à B6", correct: true },
        { text: "Trier les cellules", correct: false },
        { text: "Supprimer les cellules", correct: false },
        { text: "Mettre en gras", correct: false },
      ],
      feedback: "Bonne réponse : A. SOMME additionne toutes les valeurs de la plage indiquée.",
    },
    {
      id: "e14",
      kind: "qcm",
      title: "Une diapositive efficace (D3)",
      instruction: "Dans PowerPoint, une diapositive efficace contient de préférence :",
      options: [
        { text: "Des paragraphes très longs", correct: false },
        { text: "Un message clair et peu de texte", correct: true },
        { text: "Uniquement des animations", correct: false },
        { text: "Des textes illisibles", correct: false },
      ],
      feedback: "Bonne réponse : B. La diapositive doit soutenir l'oral et rester lisible.",
    },
    {
      id: "e15",
      kind: "qcm",
      title: "Sommaire automatique et PDF (D3)",
      instruction:
        "Deux affirmations sur Word. Cochez celles qui sont correctes (plusieurs réponses possibles).",
      multiple: true,
      options: [
        { text: "Un sommaire automatique dépend principalement des styles de titres (Titre 1, Titre 2…).", correct: true },
        { text: "Exporter en PDF permet de conserver une mise en page stable pour la lecture ou l'impression.", correct: true },
        { text: "Le sommaire automatique dépend de la couleur des textes.", correct: false },
        { text: "Exporter en PDF efface les données du document.", correct: false },
      ],
      feedback:
        "Bonnes réponses : 1 et 2. Les styles de titres permettent de générer un sommaire automatique ; le PDF conserve la mise en page pour diffuser ou imprimer un document.",
    },
    {
      id: "e16",
      kind: "qcm",
      title: "Titre d'un graphique (D3)",
      instruction: "Un graphique Excel doit toujours comporter au minimum :",
      options: [
        { text: "Un titre compréhensible", correct: true },
        { text: "Une vidéo", correct: false },
        { text: "Un mot de passe", correct: false },
        { text: "Un effet sonore", correct: false },
      ],
      feedback: "Bonne réponse : A. Le titre aide le lecteur à comprendre ce que le graphique représente.",
    },
    {
      id: "e17",
      kind: "qcm",
      title: "Mot de passe robuste (D4)",
      instruction: "Un mot de passe robuste doit être :",
      options: [
        { text: "Très court", correct: false },
        { text: "Facile à deviner", correct: false },
        { text: "Long et difficile à deviner", correct: true },
        { text: "Identique partout", correct: false },
      ],
      feedback:
        "Bonne réponse : C. La robustesse dépend notamment de la longueur, de l'imprévisibilité et de la non-réutilisation.",
    },
    {
      id: "e18",
      kind: "qcm",
      title: "Authentification à deux facteurs (D4)",
      instruction: "L'authentification à deux facteurs ajoute :",
      options: [
        { text: "Une deuxième vérification", correct: true },
        { text: "Une nouvelle couleur", correct: false },
        { text: "Une imprimante", correct: false },
        { text: "Une suppression automatique", correct: false },
      ],
      feedback:
        "Bonne réponse : A. Elle ajoute une couche de sécurité, par exemple un code à usage unique ou une confirmation.",
    },
    {
      id: "e19",
      kind: "categorize",
      title: "Reconnaître les menaces et notions de sécurité (D4)",
      instruction: "Classez chaque énoncé dans la bonne catégorie.",
      categories: ["Phishing", "Signal d'alerte d'un e-mail frauduleux", "Donnée personnelle"],
      items: [
        { label: "Une tentative de tromperie pour voler des informations", category: "Phishing" },
        { label: "Imiter un service connu pour faire cliquer sur un lien dangereux", category: "Phishing" },
        { label: "Une adresse expéditeur étrange ou approximative", category: "Signal d'alerte d'un e-mail frauduleux" },
        { label: "Un nom, un téléphone, un e-mail ou une photo", category: "Donnée personnelle" },
        { label: "Un identifiant permettant de reconnaître une personne", category: "Donnée personnelle" },
      ],
      feedback:
        "Le phishing imite un service connu pour voler des informations ou faire cliquer sur un lien dangereux. Une adresse expéditeur incohérente est un signal d'alerte. Une donnée personnelle est toute information permettant d'identifier une personne (nom, téléphone, e-mail, photo, identifiant).",
    },
    {
      id: "e20",
      kind: "qcm",
      title: "Poste partagé (D4)",
      instruction: "Sur un ordinateur partagé, il faut éviter de :",
      options: [
        { text: "Fermer sa session", correct: false },
        { text: "Effacer ses traces si nécessaire", correct: false },
        { text: "Enregistrer ses mots de passe dans le navigateur", correct: true },
        { text: "Vérifier ses fichiers", correct: false },
      ],
      feedback:
        "Bonne réponse : C. Enregistrer un mot de passe sur un poste partagé expose le compte aux autres utilisateurs.",
    },
    {
      id: "e21",
      kind: "match",
      title: "Notions d'IA générative (IA)",
      instruction: "Associez chaque terme à sa définition.",
      pairs: [
        { left: "Prompt", right: "Une consigne donnée à une IA" },
        { left: "Hallucination", right: "Une réponse plausible mais fausse ou inventée" },
        { left: "Bonne pratique face à une réponse d'IA", right: "La vérifier et l'adapter par l'humain" },
      ],
      feedback:
        "Le prompt formule la demande adressée à l'IA. Une hallucination est une réponse convaincante mais fausse. Une réponse d'IA doit toujours être vérifiée et adaptée par l'humain, qui reste responsable.",
    },
    {
      id: "e22",
      kind: "qcm",
      title: "Données à protéger face à l'IA (IA)",
      instruction: "Quelle information faut-il éviter de fournir à une IA publique ?",
      options: [
        { text: "Une consigne générale", correct: false },
        { text: "Une donnée personnelle sensible", correct: true },
        { text: "Un thème de rédaction banal", correct: false },
        { text: "Une question de grammaire", correct: false },
      ],
      feedback:
        "Bonne réponse : B. Les données personnelles sensibles doivent être protégées et ne pas être communiquées à une IA publique.",
    },
    {
      id: "e23",
      kind: "truefalse",
      title: "Sauvegarde d'un fichier important (Transversal)",
      instruction: "Vrai ou faux ?",
      statement: "Quand un fichier est important, il faut le sauvegarder dans au moins un autre emplacement.",
      answer: true,
      feedback: "Vrai. Conserver une copie dans un second emplacement réduit fortement les risques de perte.",
    },
    {
      id: "e24",
      kind: "qcm",
      title: "Preuve d'une compétence numérique (Transversal)",
      instruction: "La meilleure preuve d'une compétence numérique est :",
      options: [
        { text: "Une simple déclaration", correct: false },
        { text: "Une production conforme et vérifiable", correct: true },
        { text: "Une présence au cours", correct: false },
        { text: "Une mémorisation sans pratique", correct: false },
      ],
      feedback:
        "Bonne réponse : B. La certification repose sur des preuves observables : une production conforme et vérifiable.",
    },
  ],
  projet: {
    title: "Projet de synthèse — livrable numérique professionnel (30 %)",
    brief:
      "Le projet de synthèse est l'<strong>épreuve intégratrice</strong> du Niveau 1. Thème imposé : <em>« Organisation d'une journée de sensibilisation au numérique responsable dans un établissement »</em>. Le candidat doit préparer un dossier numérique complet pour présenter l'activité à la direction, aux collègues et aux participants. Le sujet est imposé afin de garantir l'équité, mais peut être contextualisé selon le public cible.",
    consignes: [
      "Rédiger un rapport Word de 3 à 4 pages, structuré et mis en forme : page de garde simplifiée, titres hiérarchisés, sommaire automatique ou semi-automatique, tableau, image ou pictogramme, en-tête/pied de page, puis export PDF.",
      "Construire un tableau Excel de planification : colonnes Activité, Participants prévus, Coût unitaire (FCFA), Coût total (=B2*C2), Score priorité /20, Décision (=SI(E2>=12;\"A retenir\";\"A renforcer\")), avec ligne Total (=SOMME(D2:D6)) et Moyenne (=MOYENNE(E2:E6)).",
      "Créer au moins un graphique lisible (histogramme des participants ou des coûts par activité), avec un titre clair et des étiquettes lisibles.",
      "Préparer une présentation PowerPoint de 6 à 8 diapositives, claire, sobre et cohérente (titre, contexte, objectifs, programme, budget/ressources, risques, résultats attendus, conclusion).",
      "Déposer l'ensemble dans un espace cloud partagé en accordant les droits de consultation au formateur ou au jury.",
      "Envoyer un court message d'accompagnement par e-mail au formateur, avec le lien cloud et la liste des fichiers remis.",
      "Respecter les conventions de nommage : dossier CERTEL_N1_ProjetSynthese_NomPrenom, Rapport_NumeriqueResponsable_NomPrenom.docx/.pdf, Budget_Activites_NumeriqueResponsable_NomPrenom.xlsx, Presentation_NumeriqueResponsable_NomPrenom.pptx.",
      "Veiller à la responsabilité numérique : aucune donnée personnelle inutile, sources citées, usage responsable de l'IA.",
    ],
    bareme: [
      { critere: "Rapport Word — structure, mise en forme, titres, sommaire, tableau, image, cohérence et export PDF", points: "10 pts" },
      { critere: "Tableau Excel — saisie correcte, mise en forme, SOMME, MOYENNE, SI, graphique lisible", points: "8 pts" },
      { critere: "Présentation PowerPoint — plan, lisibilité, cohérence visuelle, articulation avec le rapport et le tableau", points: "6 pts" },
      { critere: "Dépôt cloud et nommage — dossier bien nommé, fichiers complets, lien partagé fonctionnel", points: "3 pts" },
      { critere: "Message e-mail professionnel — objet clair, formule de politesse, lien cloud, liste des pièces", points: "2 pts" },
      { critere: "Respect des consignes et responsabilité numérique — pas de donnée personnelle inutile, sources citées, usage responsable de l'IA", points: "1 pt" },
    ],
  },
  miseEnSituation: {
    title: "Mise en situation pratique chronométrée (Partie B de l'examen final)",
    brief:
      "Épreuve réalisée <strong>sur poste en 90 minutes</strong>. Sujet : <em>préparer un mini-dossier numérique pour une réunion de lancement d'une formation CERTEL Niveau 1</em>. Le candidat doit organiser des fichiers, produire des mini-livrables (Word, Excel, PowerPoint), envoyer un e-mail avec lien cloud, rejoindre une courte réunion en ligne et utiliser l'IA avec un regard critique. Le correcteur observe à la fois le résultat et la méthode. Conditions matérielles : ordinateur fonctionnel, accès Internet, adresse e-mail, espace cloud et outil d'IA autorisé ; les fichiers de départ sont fournis par le formateur.",
    consignes: [
      "Gestion de fichiers : créer le dossier CERTEL_N1_Examen_NomPrenom avec les sous-dossiers 01_Word, 02_Excel, 03_PowerPoint, 04_Cloud, 05_IA.",
      "Word : produire une note d'une page avec titre, deux paragraphes, liste à puces, image, en-tête/pied de page, puis enregistrer en .docx et .pdf.",
      "Excel : créer un tableau de données (Activité, Participants, Score moyen /20), appliquer =SOMME(B2:B6), =MOYENNE(C2:C6) et =SI(C2>=12;\"Valide\";\"A renforcer\"), puis générer un graphique en colonnes des participants par activité.",
      "PowerPoint : produire 2 diapositives (1 : titre/contexte/public/objectif ; 2 : synthèse graphique issue d'Excel + recommandation courte).",
      "E-mail et cloud : déposer les fichiers dans le cloud, partager le lien en droits de lecture pour le formateur et envoyer un e-mail professionnel (objet clair, politesse, lien, liste des pièces).",
      "Réunion en ligne : rejoindre la réunion avec un nom identifiable, couper le micro hors prise de parole, répondre à l'appel et écrire un message bref dans le chat.",
      "IA et vérification critique : rédiger un prompt précisant rôle, tâche, public, ton et limites ; améliorer un paragraphe ; identifier une information à vérifier et proposer une correction prudente sans ajouter de données non vérifiées.",
    ],
    bareme: [
      { critere: "Gestion de fichiers — dossier principal, sous-dossiers, nommage, classement", points: "5 pts" },
      { critere: "Word — titre et structure, mise en forme, image, en-tête/pied, export PDF", points: "5 pts" },
      { critere: "Excel — saisie, mise en forme, SOMME, MOYENNE, SI, graphique", points: "6 pts" },
      { critere: "PowerPoint — deux diapositives, lisibilité, cohérence, graphique/recommandation", points: "4 pts" },
      { critere: "E-mail et cloud — dépôt, partage, e-mail, droits d'accès", points: "4 pts" },
      { critere: "Réunion en ligne — connexion, étiquette de réunion", points: "2 pts" },
      { critere: "IA critique — prompt, texte amélioré, vérification, prudence/confidentialité", points: "4 pts" },
    ],
    duree: "90 minutes chronométrées (sur 30 points)",
  },
};
