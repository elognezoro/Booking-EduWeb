import type { LevelKey } from "./diagnostic";

// Programme CERTEL — thématiques & syllabus par niveau. Généré par le workflow
// « certel-program-content » et vérifié contre la grille de diagnostic.
// Ne pas éditer à la main : régénérer via scripts/build-certel.ts.

export interface CertelSyllabus {
  prerequis: string[];
  contenu: { titre: string; points: string[] }[];
  activites: string[];
  evaluation: string[];
}
export interface CertelTheme {
  code: string;
  titre: string;
  resume: string;
  volumeHoraire: string;
  objectifs: string[];
  competences: string[];
  syllabus: CertelSyllabus;
}
export interface CertelProgramLevel {
  levelKey: LevelKey;
  title: string;
  finalite: string;
  publicCible: string;
  prerequisNiveau: string;
  competencesVisees: string[];
  dureeTotale: string;
  themes: CertelTheme[];
  evaluationCertifiante: string[];
}

export const CERTEL_PROGRAM: CertelProgramLevel[] = [
  {
    "levelKey": "N1",
    "title": "Niveau 1 — Fondamentaux numériques et bureautiques",
    "finalite": "Rendre l'apprenant autonome dans l'usage quotidien d'un ordinateur et des outils bureautiques essentiels : produire des documents simples et corrects (texte, tableur, présentation), communiquer et collaborer en ligne de façon sûre (Internet, e-mail, cloud, visioconférence), adopter les réflexes de base de la sécurité numérique et découvrir l'intelligence artificielle générative comme assistant raisonné et critique. Ce niveau établit le socle de littératie numérique sur lequel s'appuieront les Niveaux 2 et 3. Il est aligné sur les domaines 1 (information et données), 2 (communication et collaboration), 3 (création de contenu) et 4 (sécurité) de DigComp 2.2, sur les premières aires de DigCompEdu pour les apprenants enseignants, et sur les fondements des cadres UNESCO de compétences en IA (posture « centrée sur l'humain » et esprit critique vis-à-vis de l'IA).",
    "publicCible": "Enseignants, personnels administratifs, étudiants et professionnels débutants ou peu autonomes sur le plan numérique, dont le diagnostic de positionnement CERTEL (/100) oriente vers le Niveau 1. Aucun prérequis informatique formel n'est exigé : seule une motivation à acquérir les fondamentaux est attendue.",
    "prerequisNiveau": "Savoir lire et écrire en français ; disposer d'un accès régulier à un ordinateur (salle équipée EduWeb ou matériel personnel) et à une connexion Internet ; avoir réalisé le diagnostic de positionnement CERTEL et obtenu un score orientant vers le Niveau 1 (généralement inférieur à 40/100). Aucune compétence informatique préalable n'est requise.",
    "competencesVisees": [
      "Exécuter les manipulations de base d'un ordinateur (démarrage, arrêt, redémarrage, gestion de session)",
      "Organiser et gérer ses fichiers et dossiers, y compris sur support amovible",
      "Installer et désinstaller une application en toute sécurité",
      "Produire et mettre en forme un document texte professionnel (Word)",
      "Construire un tableau et des calculs simples dans un tableur (Excel)",
      "Réaliser une présentation claire et structurée (PowerPoint)",
      "Rechercher une information et évaluer la fiabilité d'une source en ligne",
      "Communiquer par e-mail avec pièce jointe et utiliser un espace cloud",
      "Participer activement à une réunion en ligne (Zoom/Teams/Meet)",
      "Adopter les réflexes de base de la sécurité numérique (mots de passe, hameçonnage, données personnelles)",
      "Découvrir l'IA générative : produire un premier texte, formuler une consigne simple et vérifier la réponse de façon critique"
    ],
    "dureeTotale": "3 mois (~12 semaines, 108 h encadrées)",
    "themes": [
      {
        "code": "N1-M1",
        "titre": "Prise en main de l'ordinateur et gestion des fichiers",
        "resume": "Module d'amorçage qui installe l'autonomie matérielle et organisationnelle de l'apprenant : allumer, éteindre et redémarrer correctement une machine, découvrir l'environnement du système d'exploitation, organiser ses fichiers en dossiers, utiliser des supports amovibles et installer ou désinstaller des applications sans risque.",
        "volumeHoraire": "18 h (~2 semaines)",
        "objectifs": [
          "Exécuter le démarrage, l'arrêt et le redémarrage d'un ordinateur en respectant les procédures sûres",
          "Décrire les composants principaux et l'environnement du système d'exploitation (bureau, fenêtres, explorateur)",
          "Organiser ses documents dans une arborescence de dossiers cohérente",
          "Copier, déplacer, renommer et sauvegarder des fichiers sur un support amovible (clé USB, disque externe)",
          "Installer et désinstaller une application à partir d'une source fiable"
        ],
        "competences": [
          "1. Allumer/éteindre/redémarrer un ordinateur",
          "2. Organiser ses fichiers en dossiers",
          "3. Installer/désinstaller une application",
          "4. Utiliser une clé USB / disque externe"
        ],
        "syllabus": {
          "prerequis": [
            "Aucun prérequis informatique",
            "Disposer d'un poste de travail et d'une clé USB pour les travaux pratiques"
          ],
          "contenu": [
            {
              "titre": "Découverte du matériel et démarrage",
              "points": [
                "Composants d'un ordinateur : unité centrale, écran, clavier, souris, périphériques",
                "Allumer, mettre en veille, éteindre et redémarrer correctement",
                "Session : ouverture et fermeture du compte utilisateur",
                "Premiers gestes : souris (clic, double-clic, glisser-déposer) et raccourcis clavier essentiels"
              ]
            },
            {
              "titre": "Environnement du système d'exploitation",
              "points": [
                "Bureau, barre des tâches, menu Démarrer et zone de notification",
                "Fenêtres : ouvrir, fermer, réduire, agrandir, organiser",
                "Explorateur de fichiers : navigation et affichage",
                "Notion de fichier, d'extension et de format"
              ]
            },
            {
              "titre": "Organisation des fichiers et dossiers",
              "points": [
                "Créer, renommer, déplacer et supprimer dossiers et fichiers",
                "Concevoir une arborescence logique (nommage cohérent et datage)",
                "Rechercher un fichier ; corbeille et restauration",
                "Copier/coller, couper/coller et glisser-déposer"
              ]
            },
            {
              "titre": "Supports amovibles et installation d'applications",
              "points": [
                "Brancher et retirer en sécurité une clé USB ou un disque externe",
                "Copier et sauvegarder des données sur support amovible",
                "Installer une application depuis une source officielle ; notion de droits administrateur",
                "Désinstaller proprement une application et libérer de l'espace"
              ]
            }
          ],
          "activites": [
            "TP guidé : créer une arborescence de dossiers personnelle (Cours, Administratif, Personnel) et y ranger des fichiers fournis",
            "Exercice de manipulation : copier un dossier vers une clé USB puis le restaurer sur le poste",
            "Atelier : installer une application gratuite recommandée puis la désinstaller",
            "Mini-défi chronométré de navigation et de recherche de fichiers"
          ],
          "evaluation": [
            "Observation directe d'une procédure de démarrage/arrêt et de gestion de session (grille critériée sur 5)",
            "Tâche pratique notée : reconstituer une arborescence imposée et y classer 10 fichiers (sur 20)",
            "QCM de connaissances sur le matériel, le système d'exploitation et les supports amovibles (sur 10)"
          ]
        }
      },
      {
        "code": "N1-M2",
        "titre": "Traitement de texte professionnel avec Word",
        "resume": "Module dédié à la production de documents écrits soignés : saisie, mise en forme, structuration, insertion d'éléments (tableau, image, en-tête/pied de page) et préparation à l'impression ou à l'export PDF, dans le respect des usages professionnels et académiques.",
        "volumeHoraire": "21 h (~2 semaines)",
        "objectifs": [
          "Saisir et corriger un texte en utilisant les fonctions d'édition essentielles",
          "Appliquer une mise en forme professionnelle (police, paragraphe, listes, styles)",
          "Structurer un document long (titres hiérarchisés, styles, sommaire automatique)",
          "Insérer et positionner un tableau, une image, un en-tête et un pied de page",
          "Enregistrer, exporter en PDF et imprimer un document conforme"
        ],
        "competences": [
          "5. Créer et mettre en forme un document Word",
          "6. Insérer tableau/image/en-tête dans Word"
        ],
        "syllabus": {
          "prerequis": [
            "Module N1-M1 validé (gestion des fichiers)",
            "Savoir enregistrer et retrouver un fichier"
          ],
          "contenu": [
            {
              "titre": "Saisie et édition de texte",
              "points": [
                "Interface de Word : ruban, onglets, barre d'outils",
                "Saisie, sélection, copier/couper/coller, annuler/rétablir",
                "Correction orthographique et grammaticale",
                "Enregistrer, enregistrer sous, formats .docx et .pdf"
              ]
            },
            {
              "titre": "Mise en forme des caractères et paragraphes",
              "points": [
                "Police, taille, gras, italique, souligné, couleur",
                "Alignement, interligne, retraits et espacement",
                "Listes à puces et listes numérotées",
                "Application et personnalisation des styles rapides"
              ]
            },
            {
              "titre": "Structuration d'un document",
              "points": [
                "Hiérarchie de titres (Titre 1, Titre 2…)",
                "Sommaire (table des matières) automatique",
                "Sauts de page et de section",
                "Numérotation des pages"
              ]
            },
            {
              "titre": "Insertion d'objets et mise en page",
              "points": [
                "Insérer et mettre en forme un tableau",
                "Insérer une image et gérer l'habillage du texte",
                "En-tête et pied de page ; logo et coordonnées",
                "Marges, orientation, aperçu avant impression et export PDF"
              ]
            }
          ],
          "activites": [
            "TP progressif : rédiger une lettre administrative mise en forme (en-tête, corps, signature)",
            "Atelier : créer un rapport de 3 pages avec titres stylés et sommaire automatique",
            "Exercice d'insertion : intégrer un tableau de données et une image légendée",
            "Production guidée : préparer un document pour impression puis l'exporter en PDF"
          ],
          "evaluation": [
            "Livrable noté : rapport structuré de 3 à 4 pages (en-tête, titres, sommaire, tableau, image) — grille critériée sur 25",
            "QCM sur les fonctions de Word (sur 10)",
            "Auto-évaluation guidée par check-list de conformité du document"
          ]
        }
      },
      {
        "code": "N1-M3",
        "titre": "Tableur Excel et calculs simples",
        "resume": "Module d'initiation au tableur : construire un tableau lisible, saisir et formater des données, réaliser des calculs élémentaires avec les fonctions SOMME, MOYENNE et SI, et produire un premier graphique pour visualiser l'information.",
        "volumeHoraire": "21 h (~2 semaines)",
        "objectifs": [
          "Créer et mettre en forme un tableau de données structuré dans Excel",
          "Saisir, trier et formater des données numériques et textuelles",
          "Construire des formules simples avec SOMME, MOYENNE et SI",
          "Recopier une formule en utilisant des références de cellules",
          "Générer un graphique élémentaire pour illustrer des résultats"
        ],
        "competences": [
          "7. Créer un tableau Excel simple",
          "8. Formules simples (SOMME, MOYENNE, SI)"
        ],
        "syllabus": {
          "prerequis": [
            "Module N1-M1 validé (gestion des fichiers)",
            "Aisance avec la saisie au clavier"
          ],
          "contenu": [
            {
              "titre": "Découverte du tableur",
              "points": [
                "Interface : classeur, feuille, lignes, colonnes, cellules",
                "Saisie de données ; types (texte, nombre, date)",
                "Sélection, copier/coller, recopie incrémentée",
                "Enregistrement et format de fichier (.xlsx)"
              ]
            },
            {
              "titre": "Mise en forme d'un tableau",
              "points": [
                "Largeur des colonnes et hauteur des lignes",
                "Bordures, couleurs et fusion de cellules",
                "Format des nombres : monétaire, pourcentage, décimales",
                "Tri simple et figer les volets"
              ]
            },
            {
              "titre": "Calculs et formules de base",
              "points": [
                "Opérateurs arithmétiques et règle de saisie d'une formule (=)",
                "Fonctions SOMME et MOYENNE",
                "Fonction conditionnelle SI (cas simples)",
                "Références relatives et recopie de formules"
              ]
            },
            {
              "titre": "Première visualisation des données",
              "points": [
                "Sélectionner une plage à représenter",
                "Insérer un graphique (histogramme, secteurs)",
                "Titrer et légender un graphique",
                "Mise en page et impression d'une feuille de calcul"
              ]
            }
          ],
          "activites": [
            "TP : construire un tableau de suivi (notes, dépenses ou présences) avec mise en forme",
            "Exercice de formules : calculer totaux et moyennes, puis appliquer une condition SI (mention admis/refusé)",
            "Atelier graphique : produire un histogramme commenté à partir d'un jeu de données",
            "Étude de cas guidée : reconstituer un budget mensuel simple"
          ],
          "evaluation": [
            "Tâche pratique notée : créer un tableau avec calculs SOMME, MOYENNE et SI corrects (sur 25)",
            "Production d'un graphique légendé conforme à la consigne (sur 5)",
            "QCM sur les notions du tableur (sur 10)"
          ]
        }
      },
      {
        "code": "N1-M4",
        "titre": "Présentations claires avec PowerPoint",
        "resume": "Module consacré à la conception de supports de présentation efficaces : structurer un message, appliquer une mise en forme sobre et lisible, intégrer des éléments visuels et délivrer une présentation orale appuyée sur des diapositives bien conçues.",
        "volumeHoraire": "15 h (~1,5 semaine)",
        "objectifs": [
          "Structurer le message d'une présentation (plan, fil conducteur)",
          "Créer des diapositives lisibles en respectant les règles de sobriété visuelle",
          "Intégrer texte, images et formes de manière cohérente",
          "Appliquer un thème et des transitions mesurées",
          "Diffuser une présentation et la mettre à disposition (export PDF)"
        ],
        "competences": [
          "9. Créer une présentation PowerPoint claire",
          "30. Produire un livrable numérique professionnel complet (introduction)"
        ],
        "syllabus": {
          "prerequis": [
            "Modules N1-M1 et N1-M2 validés",
            "Savoir insérer une image et mettre en forme du texte"
          ],
          "contenu": [
            {
              "titre": "Concevoir le message",
              "points": [
                "Définir l'objectif et le public",
                "Construire un plan : diapositive de titre, sommaire, contenu, conclusion",
                "Règle du message essentiel par diapositive",
                "Hiérarchiser l'information (titres et puces concises)"
              ]
            },
            {
              "titre": "Création et mise en forme des diapositives",
              "points": [
                "Interface de PowerPoint et dispositions (layouts)",
                "Application d'un thème cohérent et choix des couleurs",
                "Lisibilité : taille de police, contraste, espace",
                "Insertion de texte, images, formes et icônes"
              ]
            },
            {
              "titre": "Dynamisme maîtrisé",
              "points": [
                "Transitions et animations simples et utiles",
                "Numérotation et pied de diapositive",
                "Notes de l'orateur",
                "Mode présentateur"
              ]
            },
            {
              "titre": "Diffusion du livrable",
              "points": [
                "Vérification finale (orthographe, alignements)",
                "Enregistrement et export en PDF",
                "Diffusion en mode plein écran",
                "Bonnes pratiques de présentation orale"
              ]
            }
          ],
          "activites": [
            "TP : créer une présentation de 6 à 8 diapositives sur un sujet professionnel ou pédagogique",
            "Atelier de relecture entre pairs avec grille de sobriété visuelle",
            "Exercice : appliquer un thème et harmoniser les diapositives",
            "Simulation : présenter oralement 3 minutes à partir des diapositives"
          ],
          "evaluation": [
            "Livrable noté : présentation de 6 à 8 diapositives claire et cohérente (sur 20)",
            "Présentation orale courte évaluée par grille (sur 10)",
            "Auto-évaluation par check-list de lisibilité"
          ]
        }
      },
      {
        "code": "N1-M5",
        "titre": "Internet, e-mail, cloud et collaboration en ligne",
        "resume": "Module orienté communication et collaboration : rechercher et évaluer l'information sur le Web, gérer une messagerie avec pièces jointes, utiliser un espace de stockage en ligne (Drive/OneDrive) et participer efficacement à une réunion en visioconférence.",
        "volumeHoraire": "18 h (~2 semaines)",
        "objectifs": [
          "Effectuer une recherche d'information pertinente sur Internet",
          "Évaluer la fiabilité et la pertinence d'une source en ligne",
          "Rédiger et envoyer un e-mail professionnel avec pièce jointe",
          "Stocker, partager et synchroniser des fichiers dans un espace cloud",
          "Rejoindre et participer activement à une réunion Zoom, Teams ou Meet"
        ],
        "competences": [
          "10. Rechercher une information sur Internet",
          "11. Vérifier la fiabilité d'une information en ligne",
          "12. Envoyer un e-mail avec pièce jointe",
          "13. Utiliser un espace cloud (Drive/OneDrive)",
          "14. Participer à une réunion Zoom/Teams/Meet"
        ],
        "syllabus": {
          "prerequis": [
            "Module N1-M1 validé",
            "Disposer d'une adresse e-mail (création accompagnée si besoin)"
          ],
          "contenu": [
            {
              "titre": "Recherche et évaluation de l'information",
              "points": [
                "Navigateur Web : onglets, favoris, historique",
                "Construire une requête efficace (mots-clés, opérateurs simples)",
                "Évaluer une source : auteur, date, intention, recoupement",
                "Repérer une information douteuse ou une fausse nouvelle"
              ]
            },
            {
              "titre": "Messagerie électronique",
              "points": [
                "Structure d'une adresse et d'un message (objet, destinataires, corps)",
                "À, Cc, Cci ; règles de politesse et de concision",
                "Joindre, recevoir et enregistrer une pièce jointe",
                "Organiser sa boîte : dossiers, recherche, signature"
              ]
            },
            {
              "titre": "Espace cloud et partage",
              "points": [
                "Principe du stockage en ligne (Drive, OneDrive)",
                "Téléverser et télécharger des fichiers",
                "Partager un fichier ou un dossier et gérer les droits",
                "Synchronisation et accès multi-appareils"
              ]
            },
            {
              "titre": "Réunions en visioconférence",
              "points": [
                "Rejoindre une réunion via un lien (Zoom/Teams/Meet)",
                "Gérer micro, caméra et arrière-plan",
                "Partage d'écran et messagerie instantanée de réunion",
                "Étiquette et bonnes pratiques de la réunion à distance"
              ]
            }
          ],
          "activites": [
            "Exercice de recherche : trouver et vérifier une information à l'aide d'une fiche d'évaluation de source",
            "TP messagerie : envoyer un e-mail professionnel avec deux pièces jointes au formateur",
            "Atelier cloud : déposer un fichier, le partager et gérer les droits d'accès",
            "Simulation de réunion en ligne avec partage d'écran et prise de parole"
          ],
          "evaluation": [
            "Tâche pratique : envoyer un e-mail conforme avec pièce jointe (sur 10)",
            "Fiche d'évaluation de la fiabilité d'une source remise et notée (sur 10)",
            "Mise en situation : participation effective à une réunion en ligne (grille sur 10)",
            "QCM Internet/cloud (sur 10)"
          ]
        }
      },
      {
        "code": "N1-M6",
        "titre": "Sécurité numérique de base et première découverte de l'IA générative",
        "resume": "Module de clôture qui ancre les réflexes essentiels de cybersécurité (mots de passe, hameçonnage, données personnelles) et ouvre à l'intelligence artificielle générative : produire un premier texte, formuler une consigne (prompt) claire et vérifier de façon critique la réponse obtenue, dans une perspective d'usage responsable et éthique.",
        "volumeHoraire": "15 h (~1,5 semaine)",
        "objectifs": [
          "Créer et gérer des mots de passe robustes",
          "Identifier un message frauduleux (hameçonnage, arnaque)",
          "Expliquer les risques liés aux données personnelles et adopter les bons réflexes",
          "Utiliser une IA générative pour produire un premier texte",
          "Rédiger une consigne (prompt) claire, puis vérifier et corriger la réponse de l'IA"
        ],
        "competences": [
          "19. Protéger ses mots de passe",
          "20. Identifier un message frauduleux",
          "21. Comprendre les risques liés aux données personnelles",
          "22. Utiliser une IA générative pour produire un texte",
          "23. Rédiger une consigne (prompt) claire pour une IA",
          "24. Vérifier/corriger une réponse d'IA"
        ],
        "syllabus": {
          "prerequis": [
            "Module N1-M5 validé (Internet, e-mail, cloud)",
            "Disposer d'un accès à un outil d'IA générative recommandé"
          ],
          "contenu": [
            {
              "titre": "Mots de passe et authentification",
              "points": [
                "Caractéristiques d'un mot de passe robuste",
                "Éviter la réutilisation ; principe d'un gestionnaire de mots de passe",
                "Authentification à deux facteurs (2FA)",
                "Verrouillage de session et confidentialité"
              ]
            },
            {
              "titre": "Reconnaître les menaces",
              "points": [
                "Hameçonnage (phishing) : signaux d'alerte dans un e-mail",
                "Liens et pièces jointes suspects",
                "Arnaques courantes et usurpation d'identité",
                "Réagir : ne pas cliquer, vérifier, signaler"
              ]
            },
            {
              "titre": "Données personnelles et vie privée",
              "points": [
                "Notion de donnée personnelle et de traçabilité",
                "Risques de surexposition sur le Web et les réseaux sociaux",
                "Paramètres de confidentialité de base",
                "Bonnes pratiques de protection au quotidien"
              ]
            },
            {
              "titre": "Première découverte de l'IA générative",
              "points": [
                "Qu'est-ce qu'une IA générative ? possibilités et limites",
                "Produire un premier texte avec une IA (résumé, courriel, idées)",
                "Anatomie d'un prompt clair : rôle, tâche, contexte, format",
                "Esprit critique : vérifier les faits, repérer les erreurs et corriger la réponse ; usage responsable et éthique (cadres UNESCO)"
              ]
            }
          ],
          "activites": [
            "Atelier mots de passe : créer et tester la robustesse d'un mot de passe",
            "Étude de cas : repérer les indices d'hameçonnage dans des e-mails fournis",
            "TP IA : rédiger un prompt clair pour produire un courriel puis l'améliorer",
            "Exercice critique : confronter une réponse d'IA à une source fiable et corriger les erreurs"
          ],
          "evaluation": [
            "QCM sécurité numérique : mots de passe, hameçonnage, données personnelles (sur 15)",
            "Tâche pratique IA : produire un texte à partir d'un prompt clair et fournir une vérification critique de la réponse (sur 15)",
            "Auto-positionnement final sur les réflexes de sécurité"
          ]
        }
      }
    ],
    "evaluationCertifiante": [
      "Contrôle continu (40 %) : tâches pratiques notées et livrables de chaque module (document Word structuré, tableau Excel avec formules, présentation PowerPoint, e-mail avec pièce jointe, fiche d'évaluation de source).",
      "Projet de synthèse / livrable numérique professionnel (30 %) : à partir d'un thème imposé, l'apprenant produit un dossier complet comprenant un rapport Word mis en forme avec sommaire, un tableau Excel avec calculs (SOMME, MOYENNE, SI) et graphique, et une présentation PowerPoint, déposés dans un espace cloud partagé.",
      "Examen final mixte (30 %) : QCM de connaissances (/30, domaines DigComp 1 à 4 et sécurité) et mise en situation pratique chronométrée sur poste (gestion de fichiers, bureautique, e-mail, réunion en ligne, prompt d'IA et vérification critique).",
      "Seuil de certification du Niveau 1 : moyenne générale supérieure ou égale à 60/100 avec validation obligatoire du projet de synthèse ; la réussite atteste de la maîtrise des fondamentaux numériques et conditionne l'accès au Niveau 2."
    ]
  },
  {
    "levelKey": "N2",
    "title": "Niveau 2 — Productivité numérique et IA appliquée",
    "finalite": "Conduire l'apprenant de l'usage de base des outils numériques à une production professionnelle autonome et de qualité : concevoir des documents et des contenus numériques aboutis, réaliser des supports visuels et interactifs, animer et participer efficacement à des classes virtuelles, déposer et exploiter des ressources sur une plateforme d'apprentissage (LMS), mobiliser l'intelligence artificielle générative de façon raisonnée et éthique (rédaction de consignes, vérification, usages pédagogiques et professionnels) et adopter de bonnes pratiques de protection des données. Le niveau s'inscrit explicitement dans les référentiels DigComp 2.2 (domaines 1 « Information et littératie des données », 2 « Communication et collaboration », 3 « Création de contenus numériques » et 4 « Sécurité »), DigCompEdu (compétences professionnelles relatives aux ressources numériques, à l'enseignement, à l'évaluation et à l'autonomisation des apprenants) et les cadres UNESCO de compétences en IA pour enseignants et apprenants (usage responsable, esprit critique et pédagogie de l'IA).",
    "publicCible": "Enseignants, personnels administratifs, étudiants et professionnels disposant déjà des fondamentaux numériques et bureautiques (Niveau 1 validé ou diagnostic équivalent) et souhaitant produire des livrables professionnels, créer des contenus numériques et intégrer l'intelligence artificielle générative dans leurs pratiques quotidiennes.",
    "prerequisNiveau": "Avoir validé le Niveau 1 « Fondamentaux numériques et bureautiques » ou obtenir au diagnostic de positionnement (auto-positionnement /30 + QCM /30 + tâches pratiques /40 = /100) un score situant l'apprenant au seuil du Niveau 2 : maîtrise des bases de l'ordinateur et du système de fichiers, de Word, Excel et PowerPoint élémentaires, de la navigation Internet, de l'e-mail, du cloud et des notions de sécurité de base, ainsi qu'une première découverte de l'IA générative.",
    "competencesVisees": [
      "15 — Créer un formulaire en ligne",
      "16 — Créer une affiche/visuel avec Canva",
      "17 — Déposer une ressource sur un LMS",
      "18 — Créer une activité interactive simple",
      "21 — Comprendre les risques liés aux données personnelles",
      "23 — Rédiger une consigne (prompt) claire pour une IA",
      "24 — Vérifier/corriger une réponse d'IA",
      "25 — Utiliser l'IA pour préparer un cours/rapport/activité",
      "26 — Créer un quiz numérique",
      "30 — Produire un livrable numérique professionnel complet",
      "Approfondissement et consolidation : 5 et 6 (Word avancé), 7 et 8 (tableur et formules), 9 (présentation), 11 (fiabilité de l'information), 13 (cloud collaboratif), 14 (classes virtuelles), 19 et 20 (sécurité), 22 (IA générative)"
    ],
    "dureeTotale": "3 mois (~12 semaines), soit environ 108 heures (≈ 9 h/semaine)",
    "themes": [
      {
        "code": "N2-M1",
        "titre": "Production bureautique avancée et documents professionnels",
        "resume": "Passer d'une bureautique fonctionnelle à une production professionnelle : documents Word structurés et normés, tableurs avec formules de gestion et mise en forme conditionnelle, présentations PowerPoint à fort impact. Ce module pose les standards de qualité (charte, modèles, accessibilité) réinvestis dans tous les livrables du niveau et ancre le domaine 3 de DigComp 2.2 (création de contenus numériques).",
        "volumeHoraire": "27 h (~3 semaines)",
        "objectifs": [
          "Structurer un document long à l'aide de styles, d'un sommaire automatique, d'en-têtes et de pieds de page et d'une numérotation cohérente",
          "Concevoir un modèle de document professionnel réutilisable intégrant une charte graphique et des règles d'accessibilité",
          "Construire un tableur de gestion combinant formules conditionnelles et fonctions de synthèse",
          "Appliquer une mise en forme conditionnelle et sélectionner des graphiques pertinents pour interpréter des données",
          "Réaliser une présentation PowerPoint à fort impact mobilisant le storytelling, la lisibilité et des transitions maîtrisées",
          "Exporter et diffuser un livrable bureautique aux formats professionnels (PDF/A, partage cloud)"
        ],
        "competences": [
          "5 — Créer et mettre en forme un document Word",
          "6 — Insérer tableau/image/en-tête dans Word",
          "7 — Créer un tableau Excel simple",
          "8 — Formules simples (SOMME, MOYENNE, SI)",
          "9 — Créer une présentation PowerPoint claire",
          "30 — Produire un livrable numérique professionnel complet"
        ],
        "syllabus": {
          "prerequis": [
            "Manipuler Word, Excel et PowerPoint au niveau de base (saisie et mise en forme simple)",
            "Maîtriser l'organisation des fichiers et l'enregistrement multi-formats",
            "Disposer des compétences de Niveau 1 en bureautique et en cloud"
          ],
          "contenu": [
            {
              "titre": "Word avancé : documents longs et normés",
              "points": [
                "Styles, modèles (.dotx) et charte graphique d'établissement",
                "Table des matières automatique, sections, en-têtes et pieds de page différenciés",
                "Insertion avancée : tableaux, images légendées, renvois, notes de bas de page",
                "Révision collaborative : commentaires, suivi des modifications, comparaison de versions",
                "Accessibilité du document : texte alternatif, hiérarchie des titres, contraste",
                "Export PDF/A et impression professionnelle"
              ]
            },
            {
              "titre": "Excel pour la gestion et l'analyse simple",
              "points": [
                "Mise en forme professionnelle des tableaux et formats de cellule",
                "Fonctions essentielles : SOMME, MOYENNE, SI, NB.SI, SOMME.SI",
                "Références relatives et absolues, nommage de plages",
                "Mise en forme conditionnelle : alertes, barres de données, jeux d'icônes",
                "Tri, filtres et graphiques adaptés (histogramme, secteurs, courbe)",
                "Lecture et interprétation des résultats au service de la décision"
              ]
            },
            {
              "titre": "PowerPoint à fort impact",
              "points": [
                "Principes de design : lisibilité, cohérence visuelle, hiérarchie de l'information",
                "Masque des diapositives et modèle de présentation réutilisable",
                "Storytelling et structuration du message (accroche, corps, conclusion)",
                "Intégration de visuels, de schémas et de données chiffrées",
                "Transitions et animations sobres au service du propos",
                "Mode présentateur, notes et export (PDF, vidéo)"
              ]
            }
          ],
          "activites": [
            "TP guidé : transformer un rapport brut en document Word normé doté d'un sommaire automatique et d'une charte",
            "Atelier Excel : construire un tableau de suivi (notes ou budget) avec formules conditionnelles et graphique de synthèse",
            "Studio PowerPoint : concevoir une présentation de 8 à 10 diapositives à partir d'un modèle personnalisé",
            "Revue par les pairs : appliquer une grille d'évaluation de la qualité et de l'accessibilité des productions"
          ],
          "evaluation": [
            "Livrable Word professionnel évalué sur grille (structure, mise en forme, accessibilité) — 40 %",
            "Fichier Excel de gestion fonctionnel (exactitude des formules, lisibilité, graphique) — 30 %",
            "Présentation PowerPoint soutenue en 5 minutes (impact, clarté, design) — 30 %"
          ]
        }
      },
      {
        "code": "N2-M2",
        "titre": "Création de contenus numériques et visuels",
        "resume": "Concevoir des supports de communication et des contenus interactifs attractifs : affiches et visuels avec Canva, formulaires en ligne pour collecter et traiter de l'information, première activité interactive. L'apprenant apprend à articuler message, identité visuelle et fonctionnalité numérique, en cohérence avec le domaine 3 de DigComp 2.2 et le respect du droit d'auteur.",
        "volumeHoraire": "18 h (~2 semaines)",
        "objectifs": [
          "Concevoir un visuel professionnel (affiche, infographie, carte) respectant une identité graphique",
          "Mobiliser les principes de design (composition, couleurs, typographie, hiérarchie visuelle)",
          "Créer un formulaire en ligne structuré pour collecter et organiser des informations",
          "Paramétrer la logique d'un formulaire (champs conditionnels, validation, notifications)",
          "Exploiter les réponses d'un formulaire par synthèse automatique et export vers un tableur",
          "Produire une première activité interactive simple à partir des contenus créés"
        ],
        "competences": [
          "15 — Créer un formulaire en ligne",
          "16 — Créer une affiche/visuel avec Canva",
          "18 — Créer une activité interactive simple"
        ],
        "syllabus": {
          "prerequis": [
            "Maîtriser les standards de qualité et la charte graphique abordés en N2-M1",
            "Utiliser le cloud et le partage de fichiers (Niveau 1)",
            "Connaître les notions de base sur les formats d'image et la résolution"
          ],
          "contenu": [
            {
              "titre": "Design et création visuelle avec Canva",
              "points": [
                "Prise en main de Canva : projets, modèles, éléments, kit de marque (Brand Kit)",
                "Principes de composition : grilles, alignement, espaces, point focal",
                "Théorie des couleurs et typographie au service de la lisibilité",
                "Création d'affiches, d'infographies et de visuels pour réseaux et impression",
                "Respect du droit d'auteur et usage de banques de ressources libres",
                "Export multi-format (PNG, PDF imprimable, formats réseaux sociaux)"
              ]
            },
            {
              "titre": "Formulaires en ligne",
              "points": [
                "Choisir l'outil (Google Forms, Microsoft Forms) selon le contexte",
                "Types de questions, sections, champs obligatoires et validation des réponses",
                "Logique conditionnelle et personnalisation du parcours répondant",
                "Collecte responsable : consentement, finalité, minimisation des données",
                "Synthèse automatique des réponses et export vers un tableur",
                "Diffusion : lien, QR code, intégration dans une page ou un e-mail"
              ]
            },
            {
              "titre": "Première activité interactive",
              "points": [
                "Panorama des outils simples (H5P, Genially, LearningApps, Wooclap)",
                "Conception d'une activité courte (association, glisser-déposer, image interactive)",
                "Articulation visuel et activité : cohérence pédagogique et graphique",
                "Test, partage et collecte de retours"
              ]
            }
          ],
          "activites": [
            "Atelier Canva : produire une affiche événementielle et une infographie respectant une charte",
            "TP formulaire : créer un formulaire d'inscription ou d'enquête avec logique conditionnelle et export tableur",
            "Mini-projet : concevoir une activité interactive simple reliée à un visuel créé en atelier",
            "Galerie critique : présenter les productions et formuler des retours constructifs entre pairs"
          ],
          "evaluation": [
            "Portfolio visuel (affiche et infographie) évalué sur critères de design et de message — 40 %",
            "Formulaire en ligne fonctionnel avec synthèse exploitable des réponses — 35 %",
            "Activité interactive simple testée et partagée — 25 %"
          ]
        }
      },
      {
        "code": "N2-M3",
        "titre": "Classes virtuelles et collaboration à distance",
        "resume": "Animer et participer efficacement à des réunions et des classes virtuelles, et collaborer en ligne de manière fluide et sécurisée. Le module approfondit l'usage de la visioconférence et du travail collaboratif dans le cloud, en intégrant l'évaluation de la fiabilité des sources mobilisées à distance ; il ancre le domaine 2 de DigComp 2.2 (communication et collaboration) et la dimension collaborative de DigCompEdu.",
        "volumeHoraire": "13,5 h (~1,5 semaine)",
        "objectifs": [
          "Organiser et animer une réunion ou une classe virtuelle (planification, invitations, attribution des rôles)",
          "Utiliser les fonctionnalités avancées de visioconférence (partage, sous-groupes, sondages, enregistrement)",
          "Coproduire des documents en temps réel dans un espace cloud partagé",
          "Gérer les droits d'accès et la sécurité d'un espace collaboratif",
          "Évaluer la fiabilité des informations et des ressources partagées en séance",
          "Adopter une étiquette numérique et une animation inclusive à distance"
        ],
        "competences": [
          "14 — Participer à une réunion Zoom/Teams/Meet",
          "13 — Utiliser un espace cloud (Drive/OneDrive)",
          "11 — Vérifier la fiabilité d'une information en ligne"
        ],
        "syllabus": {
          "prerequis": [
            "Participer à une visioconférence au niveau de base (Niveau 1)",
            "Utiliser le cloud pour stocker et partager des fichiers (Niveau 1)",
            "Maîtriser les notions de recherche d'information sur Internet"
          ],
          "contenu": [
            {
              "titre": "Animer une classe ou une réunion virtuelle",
              "points": [
                "Planification : ordre du jour, invitations, fuseau horaire, salle d'attente",
                "Rôles et permissions (organisateur, présentateur, participant)",
                "Partage d'écran, tableau blanc et annotations",
                "Sous-groupes (breakout rooms), sondages et questions en direct",
                "Enregistrement, transcription et diffusion responsable",
                "Bonnes pratiques d'animation et d'inclusion à distance"
              ]
            },
            {
              "titre": "Collaboration dans le cloud",
              "points": [
                "Coédition en temps réel (documents, tableurs, présentations partagés)",
                "Organisation d'un espace d'équipe (arborescence, conventions de nommage)",
                "Gestion fine des droits : lecture, commentaire, modification, partage externe",
                "Versionnage et restauration de fichiers",
                "Sécurité des partages : liens, expiration, mots de passe"
              ]
            },
            {
              "titre": "Fiabilité de l'information à distance",
              "points": [
                "Évaluer une source : auteur, date, intention, vérifiabilité",
                "Repérer les contenus douteux et la désinformation",
                "Recouper et citer les sources dans un travail collaboratif"
              ]
            }
          ],
          "activites": [
            "Simulation : animer une classe virtuelle de 20 minutes avec partage, sondage et sous-groupes",
            "TP cloud : coéditer un document d'équipe avec gestion des droits et versionnage",
            "Exercice de fact-checking : évaluer la fiabilité de trois ressources partagées en séance"
          ],
          "evaluation": [
            "Animation d'une séquence virtuelle évaluée sur grille (organisation, interactivité, inclusion) — 50 %",
            "Production collaborative cloud avec droits correctement paramétrés — 30 %",
            "Fiche d'évaluation de la fiabilité de sources argumentée — 20 %"
          ]
        }
      },
      {
        "code": "N2-M4",
        "titre": "LMS : déposer, organiser et animer un espace de cours",
        "resume": "Exploiter une plateforme d'apprentissage en ligne (Moodle, Google Classroom ou EduWeb) pour déposer des ressources, structurer un espace de cours et y intégrer des activités interactives et des quiz. Le module fait le pont entre la création de contenus (N2-M2) et leur diffusion organisée auprès des apprenants ; il mobilise les compétences DigCompEdu relatives aux ressources numériques et à l'évaluation.",
        "volumeHoraire": "13,5 h (~1,5 semaine)",
        "objectifs": [
          "Déposer et organiser des ressources sur un LMS (sections, étiquettes, formats)",
          "Structurer un espace de cours lisible et progressif",
          "Intégrer une activité interactive dans un parcours en ligne",
          "Créer un quiz numérique aligné sur des objectifs d'apprentissage",
          "Paramétrer le suivi des apprenants (échéances, restrictions d'accès, rétroaction automatique)",
          "Inscrire et accompagner des apprenants au sein de l'espace de cours"
        ],
        "competences": [
          "17 — Déposer une ressource sur un LMS",
          "18 — Créer une activité interactive simple",
          "26 — Créer un quiz numérique"
        ],
        "syllabus": {
          "prerequis": [
            "Disposer des contenus visuels et interactifs produits en N2-M2",
            "Maîtriser le cloud et les formats de fichiers (Niveau 1, N2-M3)",
            "Connaître les notions d'objectifs pédagogiques simples"
          ],
          "contenu": [
            {
              "titre": "Découverte et structuration d'un LMS",
              "points": [
                "Panorama des plateformes (Moodle, Google Classroom, EduWeb)",
                "Architecture d'un espace de cours : sections, thèmes, parcours",
                "Dépôt et organisation des ressources (documents, vidéos, liens)",
                "Étiquettes, descriptions et accessibilité des contenus",
                "Conventions de nommage et cohérence visuelle de l'espace"
              ]
            },
            {
              "titre": "Activités et quiz numériques",
              "points": [
                "Typologie des activités (devoir, forum, activité interactive importée)",
                "Création d'un quiz : types de questions, banque de questions",
                "Barème, rétroaction automatique et tentatives multiples",
                "Restrictions d'accès, achèvement d'activité et conditions",
                "Articulation contenu, activité et évaluation"
              ]
            },
            {
              "titre": "Inscription et accompagnement des apprenants",
              "points": [
                "Inscrire les participants (manuellement, par clé, par import)",
                "Communiquer : annonces, messagerie, calendrier",
                "Suivre la progression et lire les premiers indicateurs de complétion"
              ]
            }
          ],
          "activites": [
            "TP LMS : créer un espace de cours structuré comportant au moins cinq ressources organisées",
            "Intégrer dans le parcours une activité interactive créée en N2-M2",
            "Concevoir un quiz numérique noté avec rétroaction automatique",
            "Test croisé : un pair parcourt l'espace et restitue son expérience d'apprenant"
          ],
          "evaluation": [
            "Espace de cours LMS structuré et accessible évalué sur grille — 40 %",
            "Quiz numérique fonctionnel avec rétroaction pertinente — 35 %",
            "Activité interactive correctement intégrée au parcours — 25 %"
          ]
        }
      },
      {
        "code": "N2-M5",
        "titre": "Intelligence artificielle générative appliquée",
        "resume": "Mobiliser l'IA générative de façon raisonnée et professionnelle : rédiger des consignes (prompts) claires et structurées, vérifier et corriger les réponses produites, et utiliser l'IA pour préparer cours, rapports et activités. Le module ancre une posture critique et éthique conforme aux cadres UNESCO de compétences en IA pour enseignants et apprenants.",
        "volumeHoraire": "18 h (~2 semaines)",
        "objectifs": [
          "Distinguer les principaux outils d'IA générative et leurs usages appropriés",
          "Rédiger des prompts clairs, contextualisés et itératifs (rôle, tâche, format, contraintes, exemples)",
          "Évaluer la fiabilité d'une réponse d'IA et corriger erreurs, biais et hallucinations",
          "Utiliser l'IA pour produire et améliorer un support de cours, un rapport ou une activité",
          "Adopter une posture éthique et responsable (transparence, droits, données, citation)",
          "Documenter et justifier l'usage de l'IA dans une production professionnelle"
        ],
        "competences": [
          "22 — Utiliser une IA générative pour produire un texte",
          "23 — Rédiger une consigne (prompt) claire pour une IA",
          "24 — Vérifier/corriger une réponse d'IA",
          "25 — Utiliser l'IA pour préparer un cours/rapport/activité"
        ],
        "syllabus": {
          "prerequis": [
            "Avoir une première découverte de l'IA générative (Niveau 1)",
            "Maîtriser la vérification de l'information (N2-M3)",
            "Connaître les standards de production de livrables (N2-M1)"
          ],
          "contenu": [
            {
              "titre": "Comprendre et choisir un outil d'IA générative",
              "points": [
                "Panorama des outils (assistants conversationnels, génération de texte et d'images)",
                "Principes de fonctionnement et limites (probabilités, contexte, hallucinations)",
                "Cas d'usage professionnels et pédagogiques pertinents",
                "Cadre UNESCO : usage responsable, équité et esprit critique"
              ]
            },
            {
              "titre": "L'art du prompt (consignes claires)",
              "points": [
                "Anatomie d'un prompt efficace : rôle, contexte, tâche, format, contraintes, exemples",
                "Prompting itératif et raffinement progressif",
                "Techniques : décomposition de la tâche, gabarits réutilisables",
                "Adaptation du prompt au public et à l'objectif visé"
              ]
            },
            {
              "titre": "Vérifier, corriger et fiabiliser",
              "points": [
                "Repérer les erreurs factuelles, les biais et les invraisemblances",
                "Recouper avec des sources fiables et vérifier les faits",
                "Éditer et s'approprier la production : ne jamais livrer une sortie brute",
                "Confidentialité : ne pas exposer de données sensibles dans les requêtes"
              ]
            },
            {
              "titre": "L'IA au service de la préparation",
              "points": [
                "Préparer un plan de cours, une séquence ou une grille d'évaluation",
                "Générer et améliorer des supports (rapport, synthèse, activité)",
                "Créer, avec l'appui de l'IA, des quiz et des variantes d'exercices",
                "Transparence : signaler et documenter l'usage de l'IA"
              ]
            }
          ],
          "activites": [
            "Atelier prompting : concevoir et améliorer une bibliothèque de prompts réutilisables",
            "Exercice de vérification : détecter et corriger les erreurs d'une réponse d'IA, sources à l'appui",
            "Mini-projet : préparer un support de cours ou un rapport assisté par IA, accompagné d'une note de transparence",
            "Débat encadré : opportunités, risques et éthique de l'IA dans son métier"
          ],
          "evaluation": [
            "Bibliothèque de prompts documentée et justifiée — 30 %",
            "Étude de cas de vérification et de correction d'une réponse d'IA — 30 %",
            "Livrable préparé avec l'IA accompagné d'une note d'usage responsable — 40 %"
          ]
        }
      },
      {
        "code": "N2-M6",
        "titre": "Protection des données et livrable professionnel intégré",
        "resume": "Consolider une culture de la sécurité et de la protection des données personnelles, puis mobiliser l'ensemble des acquis du niveau dans un livrable professionnel intégré. Ce module de synthèse, aligné sur le domaine 4 de DigComp 2.2 (sécurité), sert de support à l'évaluation certifiante du Niveau 2.",
        "volumeHoraire": "18 h (~2 semaines)",
        "objectifs": [
          "Identifier les risques liés aux données personnelles et appliquer le principe de minimisation",
          "Sécuriser ses comptes et reconnaître les tentatives de fraude (hameçonnage, ingénierie sociale)",
          "Appliquer les bonnes pratiques de protection des données dans une production numérique",
          "Planifier et conduire un projet de livrable numérique professionnel intégré",
          "Mobiliser bureautique, contenus, LMS et IA dans une production cohérente et aboutie",
          "Présenter et défendre un livrable selon des critères professionnels"
        ],
        "competences": [
          "21 — Comprendre les risques liés aux données personnelles",
          "19 — Protéger ses mots de passe",
          "20 — Identifier un message frauduleux",
          "26 — Créer un quiz numérique",
          "30 — Produire un livrable numérique professionnel complet"
        ],
        "syllabus": {
          "prerequis": [
            "Maîtriser les notions de sécurité de base (Niveau 1)",
            "Avoir acquis l'ensemble des compétences des modules N2-M1 à N2-M5, dont la création de quiz (N2-M4)",
            "Maîtriser le cloud et les outils de production"
          ],
          "contenu": [
            {
              "titre": "Protection des données personnelles",
              "points": [
                "Notion de donnée personnelle et de donnée sensible",
                "Principes : finalité, minimisation, consentement, conservation limitée",
                "Risques : collecte abusive, fuite, traçage, partage non maîtrisé",
                "Bonnes pratiques dans les formulaires, le cloud et les requêtes IA",
                "Repères réglementaires et éthiques (sensibilisation)"
              ]
            },
            {
              "titre": "Sécurité numérique appliquée",
              "points": [
                "Gestion robuste des mots de passe et recours à un gestionnaire de mots de passe",
                "Authentification à deux facteurs (2FA)",
                "Reconnaître l'hameçonnage et l'ingénierie sociale",
                "Réagir face à un incident : signalement, changement d'accès"
              ]
            },
            {
              "titre": "Projet de livrable intégré",
              "points": [
                "Cadrage : besoin, public cible, objectifs, critères de qualité",
                "Mobilisation des outils du niveau (Word, Excel, PowerPoint, Canva, formulaire, LMS, IA)",
                "Intégration cohérente : contenu, visuel, interactivité, quiz",
                "Documentation : sources, usage de l'IA, respect des données",
                "Préparation de la soutenance et autoévaluation"
              ]
            }
          ],
          "activites": [
            "Étude de cas sécurité : analyser des messages et identifier les tentatives de fraude",
            "Audit de protection des données d'un formulaire ou d'un espace cloud",
            "Projet fil rouge : produire un livrable numérique intégré (par exemple dossier de formation, kit de communication, mini-cours en ligne)",
            "Soutenance blanche assortie de retours par les pairs et l'enseignant"
          ],
          "evaluation": [
            "Quiz de sécurité et de protection des données (QCM) — 20 %",
            "Livrable numérique professionnel intégré évalué sur grille multicritère — 50 %",
            "Soutenance et note de documentation (sources, IA, données) — 30 %"
          ]
        }
      }
    ],
    "evaluationCertifiante": [
      "Diagnostic d'entrée confirmant le positionnement au Niveau 2 (auto-positionnement /30 + QCM /30 + tâches pratiques /40)",
      "Contrôle continu sur les six modules : livrables bureautiques, contenus visuels, formulaire, espace de cours LMS, bibliothèque de prompts et études de cas IA (pondération par module)",
      "QCM certifiant transversal couvrant la sécurité, la protection des données, la fiabilité de l'information et l'usage responsable de l'IA",
      "Projet fil rouge : livrable numérique professionnel intégré mobilisant bureautique, contenus, LMS et IA, accompagné d'une note de documentation (sources, usage de l'IA, protection des données)",
      "Soutenance orale du livrable devant jury, évaluée sur grille multicritère (qualité, cohérence, impact, posture éthique)",
      "Validation du niveau si la moyenne générale est supérieure ou égale à 60/100 et le livrable final jugé conforme aux standards professionnels ; ouverture de l'accès au Niveau 3"
    ]
  },
  {
    "levelKey": "N3",
    "title": "Niveau 3 — Ingénierie numérique, automatisation et IA avancée",
    "finalite": "Former des professionnels capables de concevoir, de déployer et de piloter des dispositifs numériques complets : ingénierie pédagogique et administration d'un LMS, intégration responsable de l'intelligence artificielle avancée, automatisation no-code/low-code de processus, analyse de données et tableaux de bord décisionnels, conduite de projet aboutissant à un livrable numérique professionnel certifiant. À l'issue du niveau, l'apprenant agit en concepteur-référent numérique autonome au sein de son institution, en cohérence avec le niveau d'expertise visé par DigCompEdu (C2 — Leader, et amorce du niveau C2 Pionnier), le degré « expert » des cinq domaines de DigComp 2.2, et le niveau « Création » des cadres UNESCO de compétences en IA (pour les enseignants et pour les apprenants).",
    "publicCible": "Enseignants, formateurs, personnels administratifs, étudiants avancés et professionnels ayant validé le Niveau 2 (ou justifiant d'une maîtrise avérée de la production numérique et de l'IA appliquée), souhaitant accéder à un rôle de concepteur pédagogique, d'administrateur de plateforme, de référent IA ou de chef de projet numérique.",
    "prerequisNiveau": "Validation du Niveau 2 « Productivité numérique et IA appliquée » (ou diagnostic CERTEL orientant directement vers le N3, score global ≥ 70/100). Maîtrise opérationnelle exigée : production professionnelle de documents, création de contenus numériques (Canva, formulaires, quiz), animation de classes virtuelles, dépôt et usage d'un LMS, rédaction de prompts et vérification des réponses d'IA, bonnes pratiques de protection des données personnelles.",
    "competencesVisees": [
      "C17 — Déposer et structurer des ressources sur un LMS (niveau administration et conception)",
      "C18 — Concevoir des activités interactives complexes et scénarisées",
      "C21 — Gouverner les données personnelles et garantir un usage éthique et responsable du numérique et de l'IA",
      "C22 — Exploiter une IA générative avancée (multimodale, assistants, agents)",
      "C23 — Concevoir des prompts experts et des chaînes d'instructions (prompt engineering)",
      "C24 — Évaluer, auditer et fiabiliser de façon critique les productions d'IA",
      "C25 — Intégrer l'IA dans l'ingénierie pédagogique et la production professionnelle",
      "C26 — Créer des évaluations numériques avancées avec rétroaction automatisée",
      "C27 — Concevoir et déployer un parcours de formation en ligne complet",
      "C28 — Analyser des données et construire des tableaux de bord décisionnels",
      "C29 — Automatiser des tâches et des processus (no-code / low-code)",
      "C30 — Produire et soutenir un livrable numérique professionnel complet"
    ],
    "dureeTotale": "3 mois (~12 semaines), soit environ 108 heures encadrées",
    "evaluationCertifiante": [
      "Projet capstone individuel (module N3-M6) : conception, production et soutenance d'un livrable numérique professionnel complet intégrant ingénierie pédagogique, administration LMS, IA, automatisation et analyse de données — pièce maîtresse de la certification.",
      "Évaluation continue par livrables certifiants à chaque module : dossier de scénarisation pédagogique, espace de cours LMS fonctionnel, assistant IA documenté, automatisation opérationnelle, tableau de bord décisionnel.",
      "Soutenance orale devant un jury : démonstration en conditions réelles et argumentation critique des choix de conception.",
      "Mise en situation professionnelle authentique : production d'un dispositif transférable au contexte réel de l'apprenant.",
      "QCM et contrôles pratiques de validation des connaissances (administration LMS, prompt engineering, automatisation, analyse de données).",
      "Délivrance du certificat CERTEL Niveau 3 conditionnée à un score global ≥ 70/100, à la validation du projet capstone et de sa soutenance, ainsi qu'à la complétude du portfolio de livrables des modules."
    ],
    "themes": [
      {
        "code": "N3-M1",
        "titre": "Ingénierie pédagogique numérique et scénarisation",
        "resume": "Concevoir des dispositifs de formation en ligne complets en mobilisant les méthodes d'ingénierie pédagogique (ADDIE, alignement constructif) et la scénarisation d'activités interactives complexes. Cette thématique pose le socle conceptuel du niveau : passer de la production de ressources isolées à l'architecture d'un parcours cohérent, mesurable et centré sur l'apprenant.",
        "volumeHoraire": "20 h (~2 semaines)",
        "objectifs": [
          "Analyser un besoin de formation et formaliser un cahier des charges pédagogique",
          "Appliquer le modèle ADDIE pour structurer un dispositif numérique",
          "Formuler des objectifs pédagogiques opérationnels selon la taxonomie de Bloom révisée",
          "Concevoir un scénario pédagogique aligné (objectifs / activités / évaluation)",
          "Élaborer des activités interactives complexes et différenciées",
          "Évaluer la qualité d'un dispositif au regard du référentiel DigCompEdu"
        ],
        "competences": [
          "C18 — Concevoir des activités interactives complexes et scénarisées",
          "C25 — Intégrer l'IA dans l'ingénierie pédagogique et la production professionnelle",
          "C27 — Concevoir et déployer un parcours de formation en ligne complet"
        ],
        "syllabus": {
          "prerequis": [
            "Avoir conçu des activités interactives simples et un quiz numérique (Niveau 2)",
            "Maîtriser la production de ressources numériques (documents, visuels, formulaires)",
            "Savoir déposer une ressource et organiser un espace de cours sur un LMS"
          ],
          "contenu": [
            {
              "titre": "Fondements de l'ingénierie pédagogique",
              "points": [
                "Du contenu au dispositif : posture du concepteur pédagogique",
                "Analyse des besoins, du public et du contexte (référentiel DigCompEdu)",
                "Cahier des charges pédagogique et contraintes institutionnelles"
              ]
            },
            {
              "titre": "Le modèle ADDIE et l'alignement constructif",
              "points": [
                "Les cinq phases : Analyse, Design, Développement, Implémentation, Évaluation",
                "Alignement constructif : cohérence objectifs–activités–évaluation",
                "Formulation d'objectifs avec la taxonomie de Bloom révisée"
              ]
            },
            {
              "titre": "Scénarisation et granularisation",
              "points": [
                "Découpage en séquences, modules et grains pédagogiques",
                "Storyboard et synopsis d'un parcours en ligne",
                "Modalités : synchrone, asynchrone, hybride et classe inversée"
              ]
            },
            {
              "titre": "Conception d'activités interactives complexes",
              "points": [
                "Différenciation et personnalisation des parcours",
                "Activités collaboratives et productions situées",
                "Intégration de médias enrichis, de l'IA générative et de la rétroaction formative"
              ]
            }
          ],
          "activites": [
            "Atelier : rédiger un cahier des charges pédagogique à partir d'un besoin réel",
            "Travaux pratiques : produire un storyboard ADDIE d'un module de 4 séquences",
            "Exercice : formuler 6 objectifs opérationnels alignés avec leurs évaluations",
            "Étude de cas : analyser et améliorer un dispositif existant à l'aide d'une grille DigCompEdu"
          ],
          "evaluation": [
            "Livrable noté : dossier de scénarisation pédagogique (cahier des charges + storyboard ADDIE) — /50",
            "Évaluation par les pairs au moyen d'une grille critériée d'alignement constructif — /20",
            "QCM sur les fondements de l'ingénierie pédagogique et la taxonomie de Bloom — /30"
          ]
        }
      },
      {
        "code": "N3-M2",
        "titre": "Administration et conception avancée d'un LMS",
        "resume": "Passer du statut d'utilisateur à celui d'administrateur-concepteur d'une plateforme d'apprentissage (Moodle ou équivalent). Cette thématique couvre la configuration d'un environnement, la structuration de cours, la gestion des utilisateurs et des droits, le paramétrage d'activités évaluées avec rétroaction automatisée et le suivi des apprenants.",
        "volumeHoraire": "20 h (~2 semaines)",
        "objectifs": [
          "Configurer et paramétrer un espace de cours sur un LMS",
          "Gérer les utilisateurs, les rôles et les droits d'accès",
          "Structurer un cours en sections, ressources et activités scénarisées",
          "Paramétrer des évaluations numériques avancées avec rétroaction automatisée",
          "Exploiter les outils de suivi et d'achèvement pour piloter les apprenants"
        ],
        "competences": [
          "C17 — Déposer et structurer des ressources sur un LMS (niveau administration et conception)",
          "C26 — Créer des évaluations numériques avancées avec rétroaction automatisée",
          "C27 — Concevoir et déployer un parcours de formation en ligne complet"
        ],
        "syllabus": {
          "prerequis": [
            "Avoir déposé des ressources et utilisé un LMS comme apprenant ou enseignant (Niveau 2)",
            "Comprendre la scénarisation pédagogique (module N3-M1)",
            "Savoir créer un quiz numérique simple"
          ],
          "contenu": [
            {
              "titre": "Architecture et administration d'un LMS",
              "points": [
                "Panorama des plateformes (Moodle, Google Classroom, Chamilo)",
                "Configuration générale, thèmes et arborescence des catégories",
                "Gestion des utilisateurs, cohortes, rôles et permissions"
              ]
            },
            {
              "titre": "Conception structurée d'un cours",
              "points": [
                "Formats de cours et organisation par sections ou thèmes",
                "Dépôt et structuration des ressources (fichiers, pages, dossiers, liens)",
                "Conditions d'accès, restrictions et achèvement d'activité"
              ]
            },
            {
              "titre": "Activités et évaluations avancées",
              "points": [
                "Banque de questions et tests paramétrés (aléatoire, tentatives, barèmes)",
                "Rétroaction automatisée et rétroaction conditionnelle",
                "Devoirs, ateliers d'évaluation entre pairs, badges et certification"
              ]
            },
            {
              "titre": "Suivi, données et pilotage",
              "points": [
                "Rapports d'activité et tableaux d'achèvement",
                "Carnet de notes et grilles d'évaluation critériées",
                "Export des données de suivi en vue de leur analyse"
              ]
            }
          ],
          "activites": [
            "Travaux pratiques : créer et configurer un espace de cours complet",
            "Atelier : importer une cohorte et attribuer rôles et permissions",
            "TP évaluation : construire une banque de questions et un test à rétroaction automatisée",
            "Exercice : paramétrer l'achèvement de cours et délivrer un badge"
          ],
          "evaluation": [
            "Projet noté : espace de cours fonctionnel sur le LMS (structure + activités + évaluation) — /50",
            "Démonstration commentée de l'administration (gestion des utilisateurs et des droits) — /30",
            "Contrôle pratique : paramétrer un test avec rétroaction conditionnelle — /20"
          ]
        }
      },
      {
        "code": "N3-M3",
        "titre": "Intelligence artificielle avancée et intégration responsable",
        "resume": "Maîtriser l'IA générative avancée (modèles multimodaux, assistants et agents) au service de l'ingénierie professionnelle, par le prompt engineering expert et l'évaluation critique des productions. Cette thématique articule performance technique et gouvernance : éthique, fiabilité, droits d'auteur, protection des données et usage responsable selon les cadres UNESCO.",
        "volumeHoraire": "22 h (~2,5 semaines)",
        "objectifs": [
          "Distinguer les familles d'IA générative et leurs usages (texte, image, code, multimodal)",
          "Concevoir des prompts experts et des chaînes d'instructions structurées",
          "Construire un assistant ou un agent IA adapté à un besoin professionnel",
          "Auditer et fiabiliser de façon critique les productions d'IA (biais, hallucinations)",
          "Appliquer un cadre éthique, juridique et de protection des données à l'usage de l'IA"
        ],
        "competences": [
          "C21 — Gouverner les données personnelles et garantir un usage éthique et responsable du numérique et de l'IA",
          "C22 — Exploiter une IA générative avancée (multimodale, assistants, agents)",
          "C23 — Concevoir des prompts experts et des chaînes d'instructions (prompt engineering)",
          "C24 — Évaluer, auditer et fiabiliser de façon critique les productions d'IA",
          "C25 — Intégrer l'IA dans l'ingénierie pédagogique et la production professionnelle"
        ],
        "syllabus": {
          "prerequis": [
            "Savoir utiliser une IA générative et rédiger un prompt clair (Niveau 2)",
            "Savoir vérifier et corriger une réponse d'IA (Niveau 2)",
            "Comprendre les risques liés aux données personnelles"
          ],
          "contenu": [
            {
              "titre": "Panorama de l'IA générative avancée",
              "points": [
                "Fonctionnement des grands modèles de langage et limites intrinsèques",
                "IA multimodale : texte, image, audio, code et analyse de documents",
                "Assistants, agents et automatisations assistées par IA"
              ]
            },
            {
              "titre": "Prompt engineering expert",
              "points": [
                "Techniques avancées : rôle, contexte, format, few-shot, chaîne de raisonnement",
                "Décomposition de tâches et enchaînement d'instructions (prompt chaining)",
                "Bibliothèque de prompts réutilisables et personnalisation d'assistants"
              ]
            },
            {
              "titre": "Évaluation critique et fiabilisation",
              "points": [
                "Détection des hallucinations, des biais et des erreurs factuelles",
                "Méthodes de vérification croisée et de citation des sources",
                "Cadre d'audit qualité d'une production d'IA"
              ]
            },
            {
              "titre": "IA responsable et gouvernance",
              "points": [
                "Éthique, transparence et explicabilité (cadres UNESCO IA)",
                "Droits d'auteur, propriété intellectuelle et confidentialité des données",
                "Politique d'usage de l'IA en contexte éducatif et professionnel"
              ]
            }
          ],
          "activites": [
            "Atelier : concevoir une bibliothèque de prompts experts pour un métier ciblé",
            "TP : créer un assistant IA personnalisé pour une tâche professionnelle récurrente",
            "Étude de cas : auditer une production d'IA et rédiger un rapport de fiabilité",
            "Débat structuré : élaborer une charte d'usage responsable de l'IA"
          ],
          "evaluation": [
            "Livrable noté : assistant IA + bibliothèque de prompts documentée — /40",
            "Rapport d'audit critique d'une production d'IA — /30",
            "Charte d'usage responsable de l'IA appliquée à un contexte — /30"
          ]
        }
      },
      {
        "code": "N3-M4",
        "titre": "Automatisation no-code / low-code des processus",
        "resume": "Automatiser des tâches et des flux de travail répétitifs sans programmation lourde, à l'aide d'outils no-code/low-code (Power Automate, Zapier/Make, Google Apps Script, macros). Cette thématique développe la pensée procédurale : modéliser un processus, identifier les déclencheurs et les actions, puis orchestrer des automatisations fiables et maintenables.",
        "volumeHoraire": "18 h (~2 semaines)",
        "objectifs": [
          "Analyser et modéliser un processus métier à automatiser",
          "Identifier les déclencheurs, les conditions et les actions d'un flux automatisé",
          "Construire des automatisations no-code/low-code multi-applications",
          "Intégrer l'IA dans un flux automatisé (traitement de données, génération)",
          "Tester, documenter et maintenir une automatisation"
        ],
        "competences": [
          "C25 — Intégrer l'IA dans l'ingénierie pédagogique et la production professionnelle",
          "C29 — Automatiser des tâches et des processus (no-code / low-code)",
          "C30 — Produire et soutenir un livrable numérique professionnel complet"
        ],
        "syllabus": {
          "prerequis": [
            "Maîtriser le cloud et le partage de fichiers (Drive/OneDrive)",
            "Savoir créer un formulaire et un tableur structuré",
            "Comprendre la logique conditionnelle (formule SI, Niveau 1/2)"
          ],
          "contenu": [
            {
              "titre": "Penser l'automatisation",
              "points": [
                "Cartographie d'un processus et repérage des tâches automatisables",
                "Notion de déclencheur, de condition, d'action et de flux",
                "Retour sur investissement et limites de l'automatisation"
              ]
            },
            {
              "titre": "Outils no-code / low-code",
              "points": [
                "Plateformes de flux : Power Automate, Zapier, Make (Integromat)",
                "Connecteurs, webhooks et intégration multi-applications",
                "Scripts légers : Google Apps Script et macros bureautiques"
              ]
            },
            {
              "titre": "Automatisations appliquées",
              "points": [
                "Collecte et tri automatiques des réponses de formulaire",
                "Notifications, rappels et publipostage automatisés",
                "Génération de documents et synchronisation cloud"
              ]
            },
            {
              "titre": "IA et fiabilité des flux",
              "points": [
                "Insertion d'une brique IA dans un flux (résumé, classification)",
                "Tests, gestion des erreurs et journalisation",
                "Documentation et maintenabilité d'une automatisation"
              ]
            }
          ],
          "activites": [
            "TP : automatiser la collecte et le tri des réponses d'un formulaire",
            "Atelier : construire un flux multi-applications avec notification et stockage",
            "Exercice : intégrer une brique IA dans une chaîne d'automatisation",
            "Projet court : documenter un processus automatisé de bout en bout"
          ],
          "evaluation": [
            "Livrable noté : automatisation fonctionnelle documentée (schéma + flux opérationnel) — /50",
            "Démonstration en conditions réelles du flux automatisé — /30",
            "Fiche de maintenance et de gestion des erreurs — /20"
          ]
        }
      },
      {
        "code": "N3-M5",
        "titre": "Analyse de données et tableaux de bord décisionnels",
        "resume": "Transformer des données brutes en information exploitable pour la décision. Cette thématique couvre la collecte, le nettoyage et la structuration des données, l'analyse au moyen d'un tableur avancé et d'outils de visualisation, ainsi que la conception de tableaux de bord clairs, interactifs et fondés sur des indicateurs pertinents.",
        "volumeHoraire": "18 h (~2 semaines)",
        "objectifs": [
          "Collecter, nettoyer et structurer un jeu de données",
          "Réaliser des analyses avancées avec un tableur (TCD, fonctions, statistiques)",
          "Sélectionner des indicateurs et des représentations graphiques pertinents",
          "Concevoir un tableau de bord décisionnel clair et interactif",
          "Interpréter les résultats et formuler des recommandations argumentées"
        ],
        "competences": [
          "C21 — Gouverner les données personnelles et garantir un usage éthique et responsable du numérique et de l'IA",
          "C28 — Analyser des données et construire des tableaux de bord décisionnels",
          "C30 — Produire et soutenir un livrable numérique professionnel complet"
        ],
        "syllabus": {
          "prerequis": [
            "Maîtriser le tableur et les formules simples (SOMME, MOYENNE, SI) — Niveau 1",
            "Savoir analyser des données avec un tableur (initiation, Niveau 2)",
            "Comprendre les risques liés aux données personnelles"
          ],
          "contenu": [
            {
              "titre": "De la donnée à l'information",
              "points": [
                "Cycle de vie de la donnée et qualité des données",
                "Collecte, nettoyage et structuration (formats, doublons, valeurs manquantes)",
                "Éthique des données : anonymisation, consentement et protection des données personnelles"
              ]
            },
            {
              "titre": "Analyse avancée avec un tableur",
              "points": [
                "Tableaux croisés dynamiques et segmentation",
                "Fonctions avancées : RECHERCHEX, SI imbriqués, fonctions statistiques",
                "Mise en forme conditionnelle et indicateurs (KPI)"
              ]
            },
            {
              "titre": "Visualisation des données",
              "points": [
                "Choix du graphique adapté à l'objectif et aux données",
                "Principes de lisibilité et de sémiologie graphique",
                "Outils de visualisation (Looker Studio / Power BI, initiation)"
              ]
            },
            {
              "titre": "Tableaux de bord décisionnels",
              "points": [
                "Conception d'un tableau de bord interactif et filtrable",
                "Mise en récit des données (data storytelling) et synthèse pour la décision",
                "Recommandations argumentées à partir des résultats"
              ]
            }
          ],
          "activites": [
            "TP : nettoyer et structurer un jeu de données brut",
            "Atelier : construire des tableaux croisés dynamiques et des KPI",
            "Exercice : concevoir un tableau de bord interactif (tableur ou Looker Studio)",
            "Étude de cas : interpréter des données et présenter des recommandations"
          ],
          "evaluation": [
            "Projet noté : tableau de bord décisionnel commenté à partir de données réelles — /50",
            "Note d'analyse et de recommandations argumentées — /30",
            "Contrôle pratique : tableau croisé dynamique et indicateurs — /20"
          ]
        }
      },
      {
        "code": "N3-M6",
        "titre": "Conduite de projet numérique et livrable professionnel certifiant",
        "resume": "Mobiliser et intégrer l'ensemble des compétences du niveau dans la conduite d'un projet numérique de bout en bout, jusqu'à la production et la soutenance d'un livrable professionnel complet. Cette thématique capstone articule gestion de projet, qualité, communication professionnelle et évaluation certifiante du parcours CERTEL.",
        "volumeHoraire": "10 h (~1 semaine, accompagnement réparti)",
        "objectifs": [
          "Cadrer un projet numérique : objectifs, périmètre, parties prenantes et planning",
          "Piloter le projet avec des méthodes et des outils de gestion adaptés",
          "Intégrer ingénierie, LMS, IA, automatisation et données dans un livrable cohérent",
          "Produire un livrable numérique professionnel complet et documenté",
          "Soutenir et argumenter ses choix de conception devant un jury"
        ],
        "competences": [
          "C25 — Intégrer l'IA dans l'ingénierie pédagogique et la production professionnelle",
          "C27 — Concevoir et déployer un parcours de formation en ligne complet",
          "C28 — Analyser des données et construire des tableaux de bord décisionnels",
          "C29 — Automatiser des tâches et des processus (no-code / low-code)",
          "C30 — Produire et soutenir un livrable numérique professionnel complet"
        ],
        "syllabus": {
          "prerequis": [
            "Avoir validé les modules N3-M1 à N3-M5",
            "Maîtriser la production d'un livrable numérique professionnel (Niveau 2 consolidé)",
            "Savoir présenter et communiquer en contexte professionnel"
          ],
          "contenu": [
            {
              "titre": "Cadrage et planification de projet",
              "points": [
                "Note de cadrage : enjeux, objectifs SMART, périmètre et livrables",
                "Parties prenantes, rôles et communication de projet",
                "Planning, jalons et gestion des risques (outils Kanban/Gantt)"
              ]
            },
            {
              "titre": "Pilotage et qualité",
              "points": [
                "Méthodes de gestion (agile, itérations, points d'avancement)",
                "Suivi de l'avancement et ajustements",
                "Démarche qualité et critères d'acceptation du livrable"
              ]
            },
            {
              "titre": "Intégration et production du livrable",
              "points": [
                "Assemblage cohérent des briques (parcours LMS, IA, automatisation, données)",
                "Documentation technique et guide utilisateur",
                "Charte graphique, accessibilité et finalisation professionnelle"
              ]
            },
            {
              "titre": "Soutenance et valorisation",
              "points": [
                "Construction d'un support de soutenance convaincant",
                "Argumentation des choix de conception et démonstration",
                "Bilan réflexif et perspectives de transfert en milieu professionnel"
              ]
            }
          ],
          "activites": [
            "Atelier : rédiger une note de cadrage et un planning de projet",
            "Accompagnement : points d'avancement et revues qualité itératives",
            "Production : réaliser le livrable numérique intégré",
            "Répétition : préparer et simuler la soutenance devant les pairs"
          ],
          "evaluation": [
            "Livrable final intégré (projet numérique complet et documenté) — /60",
            "Soutenance orale devant jury (démonstration + argumentation) — /25",
            "Bilan réflexif individuel et qualité de la documentation — /15"
          ]
        }
      }
    ]
  }
];
