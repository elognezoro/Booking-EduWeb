import type { TrainingContent } from "./training";

// Contenu rédactionnel du support de formation (syllabus, modules, QCM,
// glossaire, annexes), généré par le workflow « training-manual-content »
// et vérifié contre le code. Ne pas éditer à la main : régénérer via
// scripts/build-training.ts.
export const TRAINING_CONTENT: TrainingContent = {
  "apercu": {
    "presentation": [
      {
        "titre": "Contexte et finalité",
        "texte": "EduWeb Booking est une plateforme SaaS (logiciel en ligne en mode service) conçue pour les établissements d'enseignement et de recherche. Elle réunit en un même espace trois grandes familles de services complémentaires : (1) la réservation de ressources — salles, équipements et « Salles multimédias » dotées d'un plan de postes ; (2) une bibliothèque numérique permettant le dépôt, la validation, la consultation et l'emprunt de documents ; (3) un espace public de jeux d'entraînement cognitif, le « Sport cérébral », ainsi que des « Compétitions ». La finalité de ce support de formation est de vous rendre autonome, à votre niveau de responsabilité, dans l'usage de ces trois services, en vous appuyant exclusivement sur les libellés réels des menus et des boutons de l'application. À l'issue de la formation, vous serez capable d'identifier les fonctions ouvertes à votre rôle, d'exécuter les procédures pas à pas et de situer votre action dans l'organisation d'ensemble de la plateforme. L'établissement pilote est l'ENS d'Abidjan (Côte d'Ivoire) ; la monnaie utilisée est le FCFA et les paiements sont simulés à des fins de démonstration."
      },
      {
        "titre": "Public visé",
        "texte": "Ce support s'adresse à l'ensemble des utilisateurs de la plateforme, du gestionnaire de la plateforme jusqu'au lecteur occasionnel. EduWeb Booking distingue onze rôles, chacun disposant d'un périmètre de permissions précis : « Super Administrateur EduWeb » (supervision de la plateforme et des organisations abonnées), « Administrateur d'organisation » (paramétrage et pilotage d'un établissement), « Responsable de ressource » (gestion de ses ressources et validation des demandes associées), « Validateur hiérarchique » (approbation des demandes de réservation), « Utilisateur demandeur » (réservation et suivi des demandes), « Technicien / agent d'appui » (traitement des incidents et de la maintenance des ressources), « Visiteur externe » (consultation limitée et accès public au Sport cérébral), puis quatre rôles propres à la bibliothèque : « Bibliothécaire / Documentaliste » (chaîne de traitement documentaire : vérification, validation, publication ou archivage des dépôts), « Déposant » (dépôt de ressources documentaires et suivi de leur statut), « Validateur scientifique » (avis scientifique sur un mémoire, un article ou un rapport) et « Lecteur interne » (consultation du fonds documentaire autorisé de son organisation). Chaque utilisateur ne voit, dans la barre latérale, que les menus correspondant aux permissions de son rôle."
      },
      {
        "titre": "Périmètre fonctionnel",
        "texte": "La barre latérale organise les fonctions en grandes catégories. La section « Principal » regroupe « Accueil », « Tableau de bord », « Calendrier », « Salles multimédias », « Mes réservations », « Sport cérébral », « Formation CERTEL » et « Mon compte ». La section « Gestion » couvre les « Ressources », les « Catégories », les « Réservations », l'écran « À valider », les « Statistiques », les « Rapports » et les « Compétitions » (ces dernières réservées au Super Administrateur et à l'Administrateur d'organisation). La section « Bibliothèque » réunit « Bibliothèque », « Explorer », « Déposer », « Documents », « À vérifier », « Réservations doc. », « Emprunts », « Statistiques doc. », « Collections » et « Domaines ». La section « Administration » permet de configurer l'« Organisation », les « Sites & services », les « Utilisateurs », les « Demandes de comptes », les « Rôles & permissions », les « Paramètres » et l'« Abonnement ». La section « Plateforme », réservée au Super Administrateur, donne accès à « Supervision EduWeb », « Gouvernement & ministères », « Établissements » et « Réglages des jeux ». Enfin, la section « Aide » propose « Support » et « Centre d'aide » (avec téléchargement du guide en PDF). Les jeux et compétitions du « Sport cérébral » sont accessibles à tous, y compris, selon le verrouillage par abonnement, à certains visiteurs anonymes."
      },
      {
        "titre": "Hiérarchie Gouvernement, ministères et établissements",
        "texte": "EduWeb Booking est une plateforme multi-établissements structurée selon la hiérarchie Gouvernement (l'État) → Ministères de tutelle → Établissements. Le Super Administrateur enregistre le gouvernement et ses ministères depuis « Gouvernement & ministères » (saisie unitaire, pré-chargement des « Ministères de Côte d'Ivoire » ou import par fichier CSV), puis inscrit les établissements depuis « Établissements » (un par un avec « Inscrire un établissement », ou en masse par import CSV depuis le bloc « Import par CSV (cohorte d'établissements) »). Chaque établissement gère son propre espace, ses utilisateurs, ses rôles et ses données de façon isolée. Le Super Administrateur peut basculer dans le contexte d'un établissement grâce au sélecteur d'institution situé en haut de l'écran, puis revenir au contexte « EduWeb · plateforme »."
      },
      {
        "titre": "Abonnements et accès",
        "texte": "L'accès de chaque établissement repose sur un abonnement géré par le Super Administrateur. Quatre formules existent : « Pilote », « Standard », « Premium » et « National ». Le « Statut abonnement » peut être « Actif », « Suspendu » ou « Résilié » ; l'accès complet — notamment à l'ensemble des jeux — est réservé aux abonnements « Actif ». L'abonnement précise également le « Ministère de tutelle », le nombre de « Comptes autorisés » (utilisateurs permis) et la date de « Renouvellement ». Du côté du Super Administrateur, le verrouillage de l'espace Sport cérébral par abonnement se règle dans « Réglages des jeux » (case « Activer le verrouillage par abonnement ») ; le « Défi du jour » reste toujours jouable. Côté établissement, l'« Administrateur d'organisation » suit sa formule, son statut, ses comptes autorisés et son usage dans le menu « Abonnement »."
      },
      {
        "titre": "Formation certifiante CERTEL",
        "texte": "EduWeb Booking intègre CERTEL, une formation certifiante au numérique et à l'intelligence artificielle accessible à tout utilisateur connecté, depuis le tableau de bord (section « Principal » → « Formation CERTEL ») ou depuis le menu public « CERTEL ». Le parcours débute par un diagnostic de niveau gratuit qui oriente l'apprenant vers l'un des trois niveaux. Chaque niveau se compose de six modules interactifs : leçons illustrées avec lecture audio des contenus narratifs, exercices auto-corrigés à vérification immédiate et évaluations chronométrées. Le niveau s'achève par une évaluation certifiante — projet de synthèse, examen dont les corrigés s'affichent à la fin et mise en situation — qui, en cas de réussite, donne lieu à un certificat au format PDF paysage. L'inscription est payante par niveau, via Mobile Money (Wave, Orange Money, MTN, Moov) ou carte bancaire ; elle reste gratuite tant qu'aucun prix n'a été défini. Le super administrateur règle les tarifs et les remises ainsi que le comportement des évaluations (mode formatif = vérification immédiate ; mode sommatif = corrigés affichés à la fin) et dispose d'un accès complet sans paiement. Sur le plan de l'accessibilité, les textes s'affichent dans une police d'au moins 13 px et un lecteur audio accompagne les contenus narratifs."
      }
    ],
    "perimetre": [
      "Réservation de ressources : « Ressources », « Catégories », « Calendrier », « Réservations », « À valider », « Mes réservations » et assistant « + Nouvelle réservation ».",
      "Salles multimédias avec « plan des postes » : réservation de postes (libres en vert, occupés en rouge) ou de la salle entière, et gestion de la capacité par le responsable de ressource.",
      "Bibliothèque numérique : « Explorer », « Déposer », « Documents », consultation en ligne (« Consulter ») et téléchargement (« Télécharger » / « Payer et débloquer »).",
      "Chaîne de traitement documentaire : « À vérifier » (page « Validation documentaire »), validation, publication, archivage, génération du code documentaire et avis scientifique.",
      "Réservation et emprunt de documents : « Réservations doc. », « Emprunts », consultation sur place, emprunt physique et demande d'accès aux documents restreints.",
      "Organisation du fonds : « Collections » et « Domaines » ; pilotage via « Statistiques doc. ».",
      "Espace public « Sport cérébral » : jeux à trois niveaux (Débutant, Intermédiaire, Avancé), consignes écrites et audio, scores, badges et « Défi du jour ».",
      "« Compétitions » : création, partage du « Code de session », pilotage de l'état (« Ouvrir (inscriptions) », « Démarrer », « Clore ») et suivi du classement en direct.",
      "Formation certifiante « CERTEL » : diagnostic de niveau gratuit, trois niveaux de six modules interactifs (leçons illustrées avec lecture audio, exercices auto-corrigés à vérification immédiate, évaluations chronométrées), évaluation certifiante (projet de synthèse, examen et mise en situation) et certificat de réussite en PDF ; inscription payante par niveau via Mobile Money ou carte bancaire (gratuite tant qu'aucun prix n'est défini).",
      "Statistiques et rapports de réservation : « Statistiques » et export « Rapports » (CSV ou PDF).",
      "Administration d'établissement : « Organisation », « Sites & services », « Utilisateurs », « Demandes de comptes », « Rôles & permissions », « Paramètres », « Abonnement ».",
      "Supervision de la plateforme (Super Administrateur) : « Supervision EduWeb », « Gouvernement & ministères », « Établissements », « Réglages des jeux » et sélecteur d'institution.",
      "Compte et aide : « Mon compte » (changement de mot de passe), « Support » et « Centre d'aide » (« Télécharger en PDF »)."
    ],
    "glossaire": [
      {
        "terme": "Plateforme (EduWeb Booking)",
        "definition": "Application SaaS multi-établissements réunissant la réservation de ressources, la bibliothèque numérique et l'espace de jeux « Sport cérébral ». Sa supervision globale relève du Super Administrateur, via la section « Plateforme »."
      },
      {
        "terme": "Gouvernement",
        "definition": "Sommet de la hiérarchie : l'État, enregistré par le Super Administrateur dans « Gouvernement & ministères » (nom de l'État et pays). Il doit être enregistré avant l'ajout de tout ministère."
      },
      {
        "terme": "Ministère de tutelle",
        "definition": "Niveau intermédiaire de la hiérarchie, rattaché au gouvernement, défini par un « Nom du ministère » et un « Sigle ». Chaque établissement est rattaché à un ministère de tutelle dans son abonnement."
      },
      {
        "terme": "Établissement (Organisation / Institution)",
        "definition": "Entité abonnée qui gère son propre espace, ses utilisateurs, ses ressources et sa bibliothèque de façon isolée. Désigné « institution » sur les pages publiques et « organisation » dans les écrans d'administration."
      },
      {
        "terme": "Abonnement",
        "definition": "Contrat d'accès d'un établissement, défini par un ministère de tutelle, une formule, un statut, un nombre de comptes autorisés et une date de renouvellement. Géré par le Super Administrateur et suivi par l'administrateur d'organisation via le menu « Abonnement »."
      },
      {
        "terme": "Formule (Pilote, Standard, Premium, National)",
        "definition": "Niveau d'abonnement choisi pour un établissement parmi « Pilote », « Standard », « Premium » et « National ». Elle conditionne le périmètre d'usage de la plateforme."
      },
      {
        "terme": "Statut abonnement (Actif, Suspendu, Résilié)",
        "definition": "État courant de l'abonnement d'un établissement. L'accès complet, notamment à tous les jeux, est réservé au statut « Actif » ; « Suspendu » et « Résilié » restreignent l'accès."
      },
      {
        "terme": "Comptes autorisés",
        "definition": "Nombre maximal de comptes utilisateurs permis par l'abonnement d'un établissement. Renseigné par le Super Administrateur et consultable dans « Abonnement »."
      },
      {
        "terme": "Sélecteur d'institution",
        "definition": "Menu déroulant situé en haut de l'écran (sur ordinateur), réservé au Super Administrateur, permettant de basculer dans le contexte d'un établissement pour y agir comme administrateur, puis de revenir au contexte « EduWeb · plateforme »."
      },
      {
        "terme": "Rôle",
        "definition": "Profil attribué à un utilisateur, déterminant ses permissions et les menus visibles. La plateforme compte onze rôles, du « Super Administrateur EduWeb » au « Lecteur interne ». La matrice des droits est consultable dans « Rôles & permissions »."
      },
      {
        "terme": "Permission",
        "definition": "Droit élémentaire associé à un ou plusieurs rôles (par exemple « Consulter les documents », « Valider des réservations » ou « Déposer des documents »). La matrice des droits est consultable en lecture seule dans « Rôles & permissions »."
      },
      {
        "terme": "Ressource",
        "definition": "Élément réservable d'un établissement : salle, salle multimédia à postes, matériel ou service. Créée et paramétrée via « Nouvelle ressource » par le responsable de ressource ou l'administrateur d'organisation."
      },
      {
        "terme": "Catégorie de ressource",
        "definition": "Regroupement de ressources de même nature, doté d'un mode de validation, d'une icône et d'une couleur. Gérée dans « Catégories » ; une catégorie contenant des ressources ne peut être supprimée."
      },
      {
        "terme": "Statut de ressource",
        "definition": "État de disponibilité d'une ressource : « Disponible », « En maintenance », « Hors service » ou « Indisponible », entre autres. Une ressource non disponible n'est pas réservable et apparaît « Non réservable »."
      },
      {
        "terme": "Salle multimédia (plan des postes)",
        "definition": "Ressource organisée en postes individuels, affichée sur la page « Salles multimédias — plan des postes ». Les postes libres apparaissent en vert et les postes occupés en rouge, en temps réel."
      },
      {
        "terme": "Réservation",
        "definition": "Demande d'usage d'une ressource sur un créneau, créée via l'assistant « + Nouvelle réservation ». Son statut évolue de « Soumise » / « En attente de validation » à « Validée », « Refusée », « Terminée », etc."
      },
      {
        "terme": "Validation (réservation)",
        "definition": "Décision d'« Approuver » ou de « Refuser » une demande de réservation soumise à validation, prise dans l'écran « À valider » par un validateur hiérarchique, un responsable de ressource ou un administrateur d'organisation. Un refus exige un « Motif du refus »."
      },
      {
        "terme": "Bibliothèque numérique",
        "definition": "Espace documentaire d'un établissement permettant de déposer, valider, consulter, télécharger, réserver et emprunter des documents. Accessible via la section « Bibliothèque »."
      },
      {
        "terme": "Dépôt (de document)",
        "definition": "Soumission d'une ressource documentaire via l'assistant « Déposer » (étapes « Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits », « Vérification »). Le dépôt obtient un code provisoire et passe en validation."
      },
      {
        "terme": "Code documentaire",
        "definition": "Identifiant d'un document. Un code provisoire est attribué au dépôt, puis un code documentaire définitif est généré lors de la validation par le bibliothécaire."
      },
      {
        "terme": "Niveau d'accès",
        "definition": "Régime de visibilité et de diffusion d'un document : « Public », « Interne », « Restreint », « Consultation sur place », « Emprunt papier », « Confidentiel » ou « Embargo ». Il conditionne la consultation, le téléchargement et la demande d'accès."
      },
      {
        "terme": "Validation documentaire",
        "definition": "Traitement d'un dépôt par le bibliothécaire dans « À vérifier » : « Valider le document », « Corriger » (demande de correction) ou « Rejeter », puis « Publier » ou « Archiver »."
      },
      {
        "terme": "Avis scientifique",
        "definition": "Appréciation portée par un « Validateur scientifique » sur le fond d'un document de son institution, « Favorable » ou « Réservé », assortie d'un commentaire facultatif. Enregistrée via « Enregistrer l'avis » et visible dans « Historique & avis »."
      },
      {
        "terme": "Emprunt / Réservation de document",
        "definition": "Demande portant sur un exemplaire physique : « Consultation sur place » ou « Emprunt physique », ou « Demander l'accès » pour un document restreint. Un emprunt approuvé ouvre un prêt avec une échéance de retour, suivi dans « Emprunts »."
      },
      {
        "terme": "Sport cérébral",
        "definition": "Espace public de jeux d'entraînement cognitif proposant plusieurs jeux à trois niveaux (Débutant, Intermédiaire, Avancé), avec consignes écrites et audio, scores et badges. Accessible sans connexion selon le verrouillage par abonnement."
      },
      {
        "terme": "Défi du jour",
        "definition": "Exercice quotidien proposé en haut de l'espace Sport cérébral (bouton « Relever le défi »), toujours jouable quelles que soient les restrictions d'abonnement."
      },
      {
        "terme": "Compétition",
        "definition": "Épreuve organisée sur le Sport cérébral, créée dans « Compétitions » avec un « Intitulé », un « Jeu » et un « Niveau ». Son état se pilote par « Ouvrir (inscriptions) », « Démarrer » et « Clore », et son classement se met à jour en direct."
      },
      {
        "terme": "Code de session",
        "definition": "Code (ou lien) communiqué par l'organisateur d'une compétition. Chaque compétiteur le saisit dans le champ « CODE » puis clique sur « Rejoindre » pour participer et faire remonter son score au classement."
      },
      {
        "terme": "CERTEL",
        "definition": "Formation certifiante au numérique et à l'intelligence artificielle, accessible à tout utilisateur connecté depuis « Formation CERTEL » (section « Principal » du tableau de bord) ou le menu public « CERTEL ». Elle comprend un diagnostic de niveau gratuit, trois niveaux de six modules interactifs (leçons illustrées avec lecture audio, exercices auto-corrigés à vérification immédiate, évaluations chronométrées), une évaluation certifiante (projet de synthèse, examen et mise en situation) et un certificat de réussite en PDF. L'inscription est payante par niveau (gratuite tant qu'aucun prix n'est défini) ; le super administrateur règle tarifs, remises et comportement des évaluations et dispose d'un accès complet sans paiement."
      },
      {
        "terme": "Mobile Money",
        "definition": "Moyen de paiement par téléphone mobile proposé pour l'inscription payante aux niveaux CERTEL : « Wave », « Orange Money », « MTN » et « Moov », en alternative à la carte bancaire. Le paiement n'est requis que lorsqu'un prix a été défini par le super administrateur."
      },
      {
        "terme": "FCFA (paiement simulé)",
        "definition": "Monnaie utilisée pour le « Prix de téléchargement (FCFA · 0 = gratuit) » des documents. Les paiements (« Payer et débloquer ») sont simulés dans un cadre de démonstration ; aucun flux financier réel n'a lieu."
      },
      {
        "terme": "Mot de passe initial (password123)",
        "definition": "Mot de passe par défaut attribué à un compte créé ou importé (« password123 »). Il doit impérativement être remplacé à la première connexion via « Mon compte » → « Changer mon mot de passe »."
      }
    ]
  },
  "syllabus": {
    "intitule": "Prise en main d'EduWeb Booking et accès à la formation certifiante CERTEL — Réserver des ressources, exploiter la bibliothèque numérique, animer l'espace « Sport cérébral » et se former au numérique et à l'intelligence artificielle",
    "publicCible": [
      "Famille « Demande & usage » : utilisateurs demandeurs (« Utilisateur demandeur »), validateurs hiérarchiques (« Validateur hiérarchique »), techniciens / agents d'appui (« Technicien / agent d'appui ») et visiteurs externes (« Visiteur externe »).",
      "Famille « Ressources & validation » : responsables de ressource (« Responsable de ressource ») chargés du parc de salles, salles multimédias, matériels et services.",
      "Famille « Bibliothèque numérique » : bibliothécaires / documentalistes (« Bibliothécaire / Documentaliste »), déposants (« Déposant »), validateurs scientifiques (« Validateur scientifique ») et lecteurs internes (« Lecteur interne »).",
      "Famille « Administration » : administrateurs d'organisation (« Administrateur d'organisation ») pilotant un établissement.",
      "Famille « Supervision plateforme » : super administrateurs EduWeb (« Super Administrateur EduWeb ») supervisant gouvernement, ministères, établissements et abonnements.",
      "Tout utilisateur connecté souhaitant suivre la formation certifiante CERTEL au numérique et à l'intelligence artificielle, quel que soit son rôle.",
      "Établissement pilote : personnels et étudiants de l'ENS d'Abidjan (Côte d'Ivoire)."
    ],
    "prerequis": [
      "Disposer d'un compte EduWeb Booking actif et de ses identifiants (l'espace public « Sport cérébral » étant, lui, accessible sans connexion).",
      "Savoir utiliser un navigateur web récent depuis un poste connecté à Internet.",
      "Maîtriser les manipulations de base : connexion, glisser-déposer de fichiers, saisie dans des formulaires.",
      "Connaître le rôle qui vous a été attribué dans votre établissement (parmi les 11 rôles de la plateforme).",
      "Pour les parcours « Administration » et « Supervision plateforme » : disposer respectivement des droits d'administrateur d'organisation ou de super administrateur.",
      "Avoir reçu le mot de passe initial « password123 » (à remplacer dès la première connexion).",
      "Pour la formation certifiante CERTEL : être connecté à la plateforme (aucun prérequis de niveau ; un diagnostic de niveau gratuit oriente vers le niveau adapté) et, lorsqu'un tarif est défini par le super administrateur, s'être acquitté de l'inscription au niveau visé par Mobile Money (Wave, Orange Money, MTN, Moov) ou carte bancaire."
    ],
    "finalite": "À l'issue de la formation, chaque participant est autonome dans l'usage d'EduWeb Booking pour les missions relevant de son rôle : réserver et gérer des ressources (salles, équipements, salles multimédias avec plan de postes), participer à la chaîne de validation des réservations, exploiter et alimenter la bibliothèque numérique (dépôt, validation documentaire, consultation, téléchargement, réservation et emprunt), s'exercer sur l'espace public « Sport cérébral », rejoindre ou — pour les profils habilités — organiser une compétition, et, pour les rôles concernés, administrer un établissement ou superviser l'ensemble de la plateforme multi-établissements (Gouvernement → Ministères → Établissements, abonnements et formules). Tout utilisateur connecté peut en outre accéder à la formation certifiante CERTEL au numérique et à l'intelligence artificielle (tableau de bord → « Principal » → « Formation CERTEL », ou menu public « CERTEL ») : après un diagnostic de niveau gratuit, il suit l'un des trois niveaux de six modules — leçons illustrées avec lecture audio, exercices auto-corrigés à vérification immédiate et évaluations chronométrées — puis présente l'évaluation certifiante (projet de synthèse, examen dont les corrigés s'affichent à la fin et mise en situation) pour obtenir, en cas de réussite, un certificat au format PDF paysage. La formation vise une utilisation conforme, tracée, sécurisée et accessible de l'application, ainsi que la montée en compétences numériques et en intelligence artificielle des utilisateurs.",
    "objectifsGeneraux": [
      {
        "objectif": "Identifier l'architecture multi-établissements (Gouvernement → Ministères → Établissements), les 11 rôles, la structure « Organisation › Site › Service › Ressources » et l'organisation de la barre latérale (« Principal », « Gestion », « Bibliothèque », « Administration », « Plateforme », « Aide »), y compris l'accès à la « Formation CERTEL » depuis la section « Principal ».",
        "niveauBloom": "Connaître"
      },
      {
        "objectif": "Expliquer le cycle de vie d'une réservation (de « Soumise » / « En attente de validation » à « Validée » ou « Refusée », jusqu'à « Terminée ») et celui d'un document (de « Soumis » à « Validé » puis « Publié », ou « À corriger » et « Rejeté »).",
        "niveauBloom": "Comprendre"
      },
      {
        "objectif": "Réaliser une réservation de ressource via l'assistant en six étapes (« Catégorie », « Ressource », « Motif », « Créneau », « Détails », « Confirmation ») et réserver des postes sur le plan de salle d'une salle multimédia.",
        "niveauBloom": "Appliquer"
      },
      {
        "objectif": "Appliquer la procédure de dépôt documentaire via l'assistant « Déposer » en sept étapes (« Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits », « Vérification ») et en suivre l'avancement jusqu'à la publication.",
        "niveauBloom": "Appliquer"
      },
      {
        "objectif": "Traiter une demande soumise à validation dans « À valider » en distinguant « Approuver » et « Refuser » (avec « Motif du refus »), et apprécier la conformité d'un dépôt documentaire (« Valider le document », « Corriger », « Rejeter », « Avis scientifique »).",
        "niveauBloom": "Analyser"
      },
      {
        "objectif": "Évaluer l'activité à l'aide des indicateurs de pilotage (« Statistiques », « Statistiques doc. », « Supervision EduWeb », « Abonnement ») et produire des exports via « Rapports ».",
        "niveauBloom": "Évaluer"
      },
      {
        "objectif": "Organiser et arbitrer une compétition « Sport cérébral » (création via « Nouvelle compétition », partage du « Code de session », états « Ouvrir (inscriptions) », « Démarrer », « Clore », suivi du « Classement »).",
        "niveauBloom": "Créer"
      },
      {
        "objectif": "S'orienter dans la formation certifiante CERTEL en passant le diagnostic de niveau gratuit, en s'inscrivant le cas échéant à un niveau (paiement par Mobile Money — Wave, Orange Money, MTN, Moov — ou carte bancaire, gratuit tant qu'aucun prix n'est défini) et en distinguant évaluations formatives (vérification immédiate) et sommatives (corrigés affichés à la fin).",
        "niveauBloom": "Comprendre"
      },
      {
        "objectif": "Suivre un niveau CERTEL de six modules en exploitant les leçons illustrées avec lecture audio, en réussissant les exercices auto-corrigés à vérification immédiate et les évaluations chronométrées au numérique et à l'intelligence artificielle.",
        "niveauBloom": "Appliquer"
      },
      {
        "objectif": "Réussir l'évaluation certifiante CERTEL d'un niveau (projet de synthèse, examen chronométré dont les corrigés s'affichent à la fin, mise en situation) afin d'obtenir le certificat de réussite au format PDF paysage.",
        "niveauBloom": "Créer"
      },
      {
        "objectif": "Sécuriser son accès en remplaçant le mot de passe initial « password123 » depuis « Mon compte » et mobiliser les ressources d'aide (« Centre d'aide », « Télécharger en PDF », « Support »).",
        "niveauBloom": "Appliquer"
      }
    ],
    "competences": [
      "Naviguer dans le tableau de bord et repérer, selon son rôle, les menus et fonctions accessibles, dont l'accès à la « Formation CERTEL ».",
      "Réserver une ressource et des postes en salle multimédia, puis suivre et gérer ses réservations (« Je suis arrivé », « Activité terminée », « Annuler la réservation »).",
      "Traiter les demandes de réservation soumises à validation de manière conforme, motivée et tracée.",
      "Créer et paramétrer des ressources et leurs règles (« Mode », « Durée max. (minutes) », « Préavis min. (heures) », validation, plan de postes) et gérer leur « Statut » (« En maintenance », « Hors service », « Indisponible »).",
      "Exploiter la bibliothèque numérique : explorer, consulter en ligne, télécharger (gratuit ou paiement simulé), réserver ou emprunter un document.",
      "Conduire la chaîne de traitement documentaire : dépôt, validation, codification, publication, archivage, gestion des « Collections » et « Domaines », « Réservations doc. » et « Emprunts ».",
      "Émettre un avis scientifique motivé (« Favorable » / « Réservé ») sur un dépôt de son institution.",
      "Administrer un établissement : organisation, sites et services, comptes utilisateurs (unitaires et import CSV), demandes de comptes, paramètres et abonnement.",
      "Superviser la plateforme : gouvernement et ministères, inscription et abonnements des établissements, réglages et banque de questions du Sport cérébral, sélecteur d'institution, et, pour CERTEL, réglage des tarifs, des remises et du comportement des évaluations (formatif / sommatif).",
      "Se former au numérique et à l'intelligence artificielle via CERTEL : passer le diagnostic de niveau, s'inscrire et payer (Mobile Money ou carte bancaire), suivre les leçons illustrées avec lecture audio, réussir les exercices auto-corrigés à vérification immédiate et les évaluations chronométrées.",
      "Présenter l'évaluation certifiante CERTEL (projet de synthèse, examen avec corrigés affichés à la fin, mise en situation) et obtenir son certificat de réussite au format PDF paysage.",
      "Organiser et arbitrer une compétition, ou la rejoindre via un code de session.",
      "Sécuriser son compte et mobiliser de façon autonome les ressources d'aide de la plateforme."
    ],
    "duree": "2 jours (14 heures) pour le tronc commun et les parcours par famille de rôles, complétés par la formation certifiante CERTEL suivie en autonomie (trois niveaux de six modules, à son rythme).",
    "volumeHoraire": [
      {
        "label": "Tronc commun (tous publics) : connexion, navigation, sécurisation du compte, Sport cérébral, aide et accès à la « Formation CERTEL »",
        "valeur": "3 h 30"
      },
      {
        "label": "Parcours « Demande & usage » (Demandeur, Validateur, Technicien, Visiteur) : réservations, validation, suivi, consultation documentaire",
        "valeur": "3 h 30"
      },
      {
        "label": "Parcours « Ressources & validation » (Responsable de ressource) : création/paramétrage de ressources, salles multimédias, traitement des demandes, statistiques et rapports",
        "valeur": "3 h 00"
      },
      {
        "label": "Parcours « Bibliothèque numérique » (Bibliothécaire, Déposant, Validateur scientifique, Lecteur) : dépôt, validation documentaire, collections/domaines, réservations et emprunts, avis scientifique",
        "valeur": "3 h 30"
      },
      {
        "label": "Parcours « Administration » (Administrateur d'organisation) : organisation, sites/services, utilisateurs et demandes de comptes, paramètres, abonnement, compétitions",
        "valeur": "3 h 00"
      },
      {
        "label": "Parcours « Supervision plateforme » (Super Administrateur EduWeb) : gouvernement/ministères, établissements et abonnements, sélecteur d'institution, réglages des jeux et banque de questions, tarifs et réglages des évaluations CERTEL",
        "valeur": "3 h 00"
      },
      {
        "label": "Évaluation sommative et bilan (mise en situation + quiz)",
        "valeur": "1 h 30"
      },
      {
        "label": "Formation certifiante CERTEL (en autonomie) : diagnostic de niveau + trois niveaux de six modules (leçons audio, exercices à vérification immédiate, évaluations chronométrées) + évaluation certifiante (projet de synthèse, examen, mise en situation)",
        "valeur": "À son rythme"
      }
    ],
    "modalites": [
      "Présentiel en salle équipée, distanciel synchrone ou format hybride.",
      "Tronc commun en groupe complet, puis parcours par famille de rôles (sous-groupes ou ateliers parallèles).",
      "Démonstration du formateur sur vidéoprojecteur à partir de l'application réelle.",
      "Ateliers pratiques individuels sur des comptes de démonstration (un rôle par stagiaire).",
      "Mises en situation collaboratives, notamment pour le couple demandeur / validateur et l'animation d'une compétition « Sport cérébral ».",
      "Formation certifiante CERTEL en autoformation tutorée : parcours interactifs en ligne accessibles à tout utilisateur connecté, à son rythme, avec lecture audio des contenus narratifs et évaluations chronométrées."
    ],
    "methodes": [
      "Méthode expositive : présentation de l'architecture, des rôles, des permissions et des parcours d'usage.",
      "Méthode démonstrative : le formateur exécute pas à pas une procédure (assistant de réservation, assistant de dépôt) que les stagiaires reproduisent.",
      "Méthode active : exercices guidés et résolution de cas concrets directement dans l'application.",
      "Pédagogie par les pairs : jeux de rôle demandeur / validateur / responsable de ressource, et compétition « Sport cérébral » entre stagiaires.",
      "Apprentissage par l'erreur : exploitation des messages de l'application (créneau indisponible, motif de refus obligatoire, doublons potentiels) comme supports d'apprentissage.",
      "Pour CERTEL : pédagogie interactive et multimodale (leçons illustrées avec lecture audio), apprentissage actif par exercices auto-corrigés à vérification immédiate, évaluation formative chronométrée et évaluation certifiante (projet de synthèse, examen avec corrigés affichés à la fin, mise en situation)."
    ],
    "moyens": [
      "Postes informatiques connectés à Internet (un par stagiaire) équipés d'un navigateur récent.",
      "Accès à l'environnement de démonstration d'EduWeb Booking et comptes de démo (mot de passe initial « password123 »).",
      "Comptes attribués couvrant les rôles cibles de chaque sous-groupe.",
      "Données de démonstration : ENS d'Abidjan (Côte d'Ivoire), monnaie FCFA, paiements simulés.",
      "Vidéoprojecteur et tableau pour la démonstration et la synthèse.",
      "Guides par rôle intégrés au « Centre d'aide » et téléchargeables via « Télécharger en PDF » (support de référence).",
      "Modèles CSV fournis par l'application (import d'utilisateurs, d'établissements, de ministères et de questions).",
      "Plateforme de formation certifiante CERTEL : diagnostic de niveau gratuit, parcours interactifs (leçons illustrées avec lecteur audio, exercices auto-corrigés, évaluations chronométrées), certificat de réussite au format PDF paysage, et inscription en ligne par Mobile Money (Wave, Orange Money, MTN, Moov) ou carte bancaire (gratuite tant qu'aucun prix n'est défini).",
      "Accessibilité des contenus : police d'au moins 13 px et lecteur audio sur les contenus narratifs.",
      "Assistance : « Support » (e-mail support@eduweb.ci, téléphone) et « Questions fréquentes »."
    ],
    "evaluation": [
      {
        "type": "Diagnostique",
        "description": "En ouverture : tour de table et court questionnaire de positionnement sur le rôle de chacun, son expérience des outils de réservation et de bibliothèque, et ses attentes, afin d'orienter vers le bon parcours et d'adapter le rythme. Pour la formation certifiante CERTEL : un diagnostic de niveau gratuit, corrigé automatiquement, situe l'utilisateur (N1, N2 ou N3) et l'oriente vers le niveau adapté."
      },
      {
        "type": "Formative",
        "description": "Tout au long des ateliers : observation du formateur lors des exercices guidés, vérification de la réussite de chaque procédure via les messages de confirmation de l'application (« Votre demande de réservation a été enregistrée. », « Votre dépôt a été enregistré et soumis à validation. », « Mot de passe modifié avec succès. », « Capacité mise à jour. »), questions-réponses et reformulation par les pairs. Dans CERTEL : exercices auto-corrigés à vérification immédiate intégrés aux leçons et évaluations formatives chronométrées, permettant à l'apprenant de mesurer sa progression en temps réel."
      },
      {
        "type": "Sommative",
        "description": "En clôture : mise en situation complète selon le rôle (par exemple, réaliser une réservation de postes en salle multimédia et la faire valider ; déposer puis valider et publier un document ; créer une ressource ou administrer un établissement ; organiser une compétition), complétée par un quiz portant sur les rôles, les statuts, les libellés clés des menus et les bonnes pratiques de sécurité. Pour CERTEL : évaluation certifiante d'un niveau associant un projet de synthèse, un examen chronométré dont les corrigés s'affichent à la fin et une mise en situation, conditionnant la délivrance du certificat de réussite (PDF paysage)."
      }
    ],
    "criteresReussite": [
      "Réaliser, sans aide, une réservation de bout en bout via l'assistant en six étapes et obtenir le message « Votre demande de réservation a été enregistrée. ».",
      "Sélectionner correctement des postes libres (verts) sur le plan d'une salle multimédia, ou réserver la salle entière.",
      "Pour les profils de validation : traiter une demande dans « À valider » en justifiant tout refus par un « Motif du refus », la décision étant correctement tracée et notifiée au demandeur.",
      "Pour les responsables de ressource : créer une ressource paramétrée (mode, durée, préavis, validation) et ajuster la capacité d'une salle multimédia jusqu'au message « Capacité mise à jour. ».",
      "Pour la bibliothèque : déposer un document via l'assistant en sept étapes, puis (selon le rôle) le valider et le publier, ou émettre un avis scientifique « Favorable » / « Réservé ».",
      "Pour les administrateurs : créer un compte utilisateur ou importer une cohorte par CSV, et traiter une demande de compte (« Valider » / « Refuser »).",
      "Pour le super administrateur : inscrire un établissement, paramétrer son abonnement (formule, statut, comptes autorisés), basculer de contexte via le sélecteur d'institution, et régler les tarifs, remises et le comportement des évaluations CERTEL.",
      "Avoir remplacé le mot de passe initial « password123 » depuis « Mon compte » (nouveau mot de passe d'au moins 8 caractères).",
      "Obtenir un score d'au moins 80 % au quiz sommatif portant sur les rôles, les statuts et les libellés de l'interface.",
      "Pour la formation certifiante CERTEL : passer le diagnostic de niveau, suivre un niveau complet (six modules avec leçons audio et exercices à vérification immédiate) et réussir l'évaluation certifiante (projet de synthèse, examen chronométré avec corrigés affichés à la fin, mise en situation) afin d'obtenir le certificat de réussite au format PDF paysage.",
      "Savoir localiser et télécharger son guide depuis le « Centre d'aide » et identifier le canal de « Support »."
    ]
  },
  "modulesCommuns": {
    "modules": [
      {
        "code": "T1",
        "titre": "Prise en main d'EduWeb Booking",
        "public": "Tous les utilisateurs disposant d'un compte, quel que soit leur rôle (de l'Administrateur d'organisation au Lecteur interne, en passant par le Demandeur, le Validateur hiérarchique, le Responsable de ressource, le Technicien, le Bibliothécaire, le Déposant et le Validateur scientifique).",
        "duree": "1 h 00",
        "prerequis": [
          "Disposer d'un compte créé par l'administrateur de votre établissement (vous avez reçu votre adresse e-mail et le mot de passe initial « password123 »).",
          "Disposer d'un navigateur web à jour et d'une connexion internet.",
          "Aucune connaissance technique préalable n'est requise."
        ],
        "objectifs": [
          "Se connecter à son espace EduWeb Booking à l'aide de son adresse e-mail et de son mot de passe.",
          "Remplacer le mot de passe initial « password123 » dès la première connexion depuis « Mon compte ».",
          "Naviguer dans la barre latérale et identifier les sections accessibles selon son rôle (« Principal », « Gestion », « Bibliothèque », « Administration », « Plateforme », « Aide »).",
          "Repérer les éléments de la barre supérieure : champ « Rechercher… », bouton « Réserver », cloche de notifications et menu utilisateur.",
          "Interpréter les indicateurs du « Tableau de bord ».",
          "Consulter la cloche de notifications et repérer le nombre de messages « non lue(s) ».",
          "Vérifier ses informations personnelles et son ou ses rôles dans « Mon compte ».",
          "Se déconnecter en toute sécurité via « Se déconnecter »."
        ],
        "competences": [
          "Authentification autonome sur la plateforme.",
          "Sécurisation de son compte par le changement du mot de passe initial.",
          "Orientation dans l'interface : barre latérale, barre supérieure et tableau de bord.",
          "Suivi de ses notifications et gestion de son profil personnel."
        ],
        "deroule": [
          {
            "titre": "Se connecter et comprendre la page de connexion",
            "points": [
              "Ouvrez la page de connexion : renseignez le champ « Adresse e-mail » puis le champ « Mot de passe » (avec votre mot de passe initial « password123 »), et cliquez sur « Se connecter ».",
              "Utilisez l'icône en forme d'œil pour afficher ou masquer le mot de passe saisi.",
              "En contexte de démonstration ENS, le bloc « Connexion rapide (démo ENS · password123) » propose des boutons (« Admin », « Responsable », « Validateur », « Enseignant ») qui préremplissent les identifiants.",
              "Le lien « Mot de passe oublié ? » figure au-dessus du champ de mot de passe et, sous le formulaire, la mention « Pas encore de compte ? » accompagne le lien « Créer un compte » ; après connexion, vous arrivez sur votre « Tableau de bord »."
            ]
          },
          {
            "titre": "Première connexion : changer le mot de passe initial",
            "points": [
              "Dès la première connexion, remplacez impérativement le mot de passe par défaut « password123 ».",
              "Dans la section « Principal » de la barre latérale, ouvrez « Mon compte », puis repérez l'encadré « Changer mon mot de passe ».",
              "Saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et « Confirmer le nouveau mot de passe ».",
              "Cliquez sur « Mettre à jour le mot de passe » : le message « Mot de passe modifié avec succès. » confirme l'opération."
            ]
          },
          {
            "titre": "Naviguer dans la barre latérale",
            "points": [
              "La barre latérale regroupe les menus par sections dépliables ; selon votre rôle, certaines sections n'apparaissent pas (la section « Plateforme » est réservée au super administrateur).",
              "Section « Principal » : « Accueil », « Tableau de bord », « Calendrier », « Salles multimédias », « Mes réservations », « Sport cérébral », « Mon compte ».",
              "Sections métier : « Gestion » (ressources, réservations, statistiques…), « Bibliothèque » (catalogue et documents), « Administration » (gestion de l'établissement) et « Aide ».",
              "Le bouton « + Nouvelle réservation », en bas de la barre latérale, permet de démarrer une demande ; un badge orange à côté d'un menu (par exemple « À valider ») signale des éléments en attente.",
              "Vous pouvez replier la barre latérale en rail d'icônes, puis la déplier, à l'aide des boutons « Replier le menu » / « Déplier le menu »."
            ]
          },
          {
            "titre": "Lire le tableau de bord et la barre supérieure",
            "points": [
              "Le « Tableau de bord » présente une vue de synthèse adaptée à votre rôle (indicateurs et activité récente de votre établissement).",
              "Dans la barre supérieure : le champ « Rechercher… », le bouton « Réserver » (raccourci vers une nouvelle réservation), la cloche de notifications et votre menu utilisateur.",
              "Le menu utilisateur (avec votre nom, votre e-mail et vos rôles) donne accès à « Support », « Centre d'aide » et « Se déconnecter »."
            ]
          },
          {
            "titre": "Consulter la cloche de notifications",
            "points": [
              "Cliquez sur la cloche en haut à droite : le panneau « Notifications » s'ouvre.",
              "Une pastille sur la cloche indique le nombre de messages non lus ; l'en-tête du panneau précise « X non lue(s) ».",
              "Les notifications signalent notamment les décisions de validation ; en l'absence de message, la mention « Aucune notification. » s'affiche."
            ]
          },
          {
            "titre": "Vérifier son compte et se déconnecter",
            "points": [
              "Ouvrez « Mon compte » pour vérifier votre nom, votre e-mail, votre fonction éventuelle, votre établissement et votre ou vos rôles.",
              "Adoptez un mot de passe fort et unique, distinct du mot de passe initial.",
              "Pour quitter votre session, ouvrez le menu utilisateur et cliquez sur « Se déconnecter » (recommandé sur un poste partagé)."
            ]
          }
        ],
        "atelier": [
          "Se connecter avec l'adresse e-mail fournie et le mot de passe « password123 », puis afficher puis masquer le mot de passe avec l'icône en forme d'œil.",
          "Changer son mot de passe depuis « Mon compte » › « Changer mon mot de passe » et obtenir le message « Mot de passe modifié avec succès. ».",
          "Parcourir chaque section visible de la barre latérale et nommer trois menus de la section « Principal ».",
          "Ouvrir la cloche de notifications, repérer le nombre « non lue(s) », puis ouvrir « Mon compte » pour relever son ou ses rôles exacts.",
          "Se déconnecter via « Se déconnecter », puis se reconnecter avec le nouveau mot de passe."
        ],
        "evaluation": [
          "QCM : quel est le mot de passe initial fourni à la création d'un compte, et où le change-t-on ? (Réponse attendue : « password123 », dans « Mon compte » › « Changer mon mot de passe ».)",
          "Question : quelle longueur minimale doit avoir le nouveau mot de passe ? (Réponse : au moins 8 caractères.)",
          "Mise en situation : citez les libellés exacts des trois actions du menu utilisateur (« Support », « Centre d'aide », « Se déconnecter »).",
          "Vérification pratique : l'apprenant se connecte, change son mot de passe (message de succès affiché), localise la cloche de notifications et se déconnecte sans aide."
        ]
      },
      {
        "code": "T2",
        "titre": "Sport cérébral & compétitions",
        "public": "Tous les utilisateurs connectés (tous rôles) ainsi que les visiteurs : l'espace public de jeux est accessible sans connexion.",
        "duree": "45 min",
        "prerequis": [
          "Disposer d'un navigateur web à jour ; un compte n'est pas obligatoire pour accéder à l'espace public.",
          "Pour rejoindre une compétition : disposer du code de session (ou du lien) communiqué par l'organisateur.",
          "Avoir suivi le module T1 « Prise en main » est recommandé pour les utilisateurs connectés (accès via le menu « Sport cérébral »)."
        ],
        "objectifs": [
          "Accéder à l'espace « Sport cérébral », depuis le menu « Principal » pour les utilisateurs connectés ou directement pour les visiteurs.",
          "Choisir un jeu dans « La banque de jeux » et sélectionner un niveau de difficulté (Débutant, Intermédiaire ou Avancé).",
          "Lire la consigne d'un jeu en texte et l'écouter en audio via le bouton « Écouter ».",
          "Relever le « Défi du jour » à l'aide du bouton « Relever le défi ».",
          "Rejoindre une compétition organisée en saisissant un code de session dans le champ « CODE » puis « Rejoindre ».",
          "Distinguer les jeux librement accessibles des jeux signalés par le badge « Abonnement » dans le cadre de l'« Accès découverte »."
        ],
        "competences": [
          "Navigation autonome dans l'espace public de jeux d'entraînement cérébral.",
          "Choix d'un jeu et d'un niveau adapté à son besoin.",
          "Utilisation de la consigne écrite et audio (lecture, pause, réécoute, réglage du volume).",
          "Participation à une compétition par code de session et compréhension du suivi du classement."
        ],
        "deroule": [
          {
            "titre": "Accéder à l'espace Sport cérébral",
            "points": [
              "Utilisateur connecté : dans la section « Principal » de la barre latérale, ouvrez « Sport cérébral » (votre tableau de bord personnel : scores, progression, badges), puis cliquez sur « Jouer » pour accéder à la banque de jeux publique.",
              "Visiteur : l'espace « Sport cérébral » est public et accessible sans connexion.",
              "La page d'accueil présente un bandeau de présentation, un chapeau introductif sur l'intérêt du « sport cérébral », puis « La banque de jeux »."
            ]
          },
          {
            "titre": "Choisir un jeu et un niveau",
            "points": [
              "Dans « La banque de jeux », chaque jeu est présenté sous forme de carte (titre, court descriptif, durée indicative et compétences sollicitées).",
              "Sous « Niveau de difficulté », sélectionnez un niveau parmi « Débutant », « Intermédiaire » ou « Avancé ».",
              "Cliquez sur « Commencer » pour lancer le jeu ; un jeu en préparation affiche le badge « Bientôt » et le message « Bientôt disponible — consigne déjà accessible (texte & audio). », sa consigne restant consultable en texte et en audio."
            ]
          },
          {
            "titre": "Lire et écouter la consigne",
            "points": [
              "Chaque carte de jeu comporte un encadré « Consigne » présentant le texte de l'exercice.",
              "Cliquez sur « Écouter » pour entendre la consigne en audio (la voix est générée par le navigateur en français).",
              "Pendant la lecture, utilisez « Pause » puis « Reprendre », ou réécoutez la consigne depuis le début ; un curseur permet de régler le volume."
            ]
          },
          {
            "titre": "Relever le Défi du jour",
            "points": [
              "En haut de la page, l'encadré « Défi du jour » indique le jeu et le niveau du jour.",
              "Cliquez sur « Relever le défi » pour lancer directement l'exercice quotidien.",
              "Le « Défi du jour » reste toujours jouable, même lorsque l'accès à certains jeux est réservé aux établissements abonnés."
            ]
          },
          {
            "titre": "Rejoindre une compétition par code de session",
            "points": [
              "Munissez-vous du code de session (ou du lien) communiqué par l'organisateur de la compétition.",
              "Sur l'accueil du « Sport cérébral », repérez l'encadré « Compétition » (« Vous avez un code de session ? Rejoignez une compétition organisée. »).",
              "Saisissez le code dans le champ « CODE » (saisie automatiquement mise en majuscules), puis cliquez sur « Rejoindre » — ou ouvrez directement le lien reçu.",
              "Jouez la partie sur votre appareil : votre score est automatiquement pris en compte dans le classement suivi par l'organisateur."
            ]
          },
          {
            "titre": "Comprendre l'Accès découverte",
            "points": [
              "Lorsque le verrouillage par abonnement est actif, l'encadré « Accès découverte » signale que seule une sélection de jeux est ouverte (« Vous accédez à une sélection de jeux. La collection complète et tous les niveaux sont réservés aux établissements abonnés à EduWeb Booking. »).",
              "Les jeux réservés portent le badge « Abonnement » et la mention « Disponible avec l'abonnement EduWeb Booking ».",
              "Les jeux ouverts aux visiteurs et le « Défi du jour » restent toujours accessibles ; les utilisateurs des établissements abonnés ont accès à l'ensemble de la banque de jeux."
            ]
          }
        ],
        "atelier": [
          "Accéder à l'espace « Sport cérébral », choisir un jeu, sélectionner le niveau « Débutant » et cliquer sur « Commencer ».",
          "Lire la consigne d'un jeu, l'écouter via « Écouter », puis utiliser « Pause » et « Reprendre ».",
          "Relever le « Défi du jour » via le bouton « Relever le défi ».",
          "Simuler la participation à une compétition : saisir un code dans le champ « CODE » de l'encadré « Compétition » puis cliquer sur « Rejoindre ».",
          "Repérer, le cas échéant, un jeu portant le badge « Abonnement » et expliquer la différence avec un jeu librement accessible."
        ],
        "evaluation": [
          "QCM : citez les trois niveaux de difficulté proposés pour chaque jeu. (Réponse : Débutant, Intermédiaire, Avancé.)",
          "Question : comment écoute-t-on la consigne d'un jeu ? (Réponse : via le bouton « Écouter » de l'encadré « Consigne ».)",
          "Mise en situation : décrivez les étapes pour rejoindre une compétition à partir d'un code (encadré « Compétition » › champ « CODE » › « Rejoindre »).",
          "Question : le « Défi du jour » est-il toujours accessible, même en « Accès découverte » ? (Réponse : oui.)"
        ]
      },
      {
        "code": "T3",
        "titre": "Aide & accompagnement",
        "public": "Tous les utilisateurs disposant d'un compte, quel que soit leur rôle.",
        "duree": "40 min",
        "prerequis": [
          "Être connecté à son espace EduWeb Booking (module T1 « Prise en main » conseillé au préalable).",
          "Disposer d'un navigateur web à jour pour ouvrir et télécharger le guide en PDF."
        ],
        "objectifs": [
          "Ouvrir le « Centre d'aide » et identifier le guide d'utilisation adapté à son rôle (« Votre guide »).",
          "Télécharger son guide au format imprimable via « Télécharger en PDF ».",
          "Consulter la rubrique « Les rôles en bref » pour situer son rôle parmi les autres.",
          "Ouvrir « Support » et mobiliser les canaux de contact ainsi que les « Questions fréquentes ».",
          "Réagir correctement au message « Une erreur est survenue » en rechargeant la page (base de données momentanément en veille)."
        ],
        "competences": [
          "Autonomie dans la recherche d'aide contextualisée selon son rôle.",
          "Archivage et impression de son guide d'utilisation.",
          "Mobilisation des canaux de support (e-mail, téléphone, FAQ).",
          "Diagnostic de premier niveau et bon réflexe en cas d'erreur passagère."
        ],
        "deroule": [
          {
            "titre": "Ouvrir le Centre d'aide",
            "points": [
              "Dans la section « Aide » de la barre latérale, ouvrez « Centre d'aide » (également accessible depuis le menu utilisateur, en haut à droite).",
              "La page présente votre guide d'utilisation, adapté à votre rôle, sous le titre « Votre guide ».",
              "Le guide est structuré par capacités (ce que votre rôle permet) puis par procédures pas à pas reprenant les libellés réels de l'application."
            ]
          },
          {
            "titre": "Télécharger son guide en PDF",
            "points": [
              "En haut du « Centre d'aide », cliquez sur « Télécharger en PDF » : la version imprimable de votre guide s'ouvre dans un nouvel onglet.",
              "Conservez ce document hors ligne pour vous y référer sans connexion.",
              "Le bouton « Support », à côté, renvoie vers la page d'assistance."
            ]
          },
          {
            "titre": "Situer son rôle : « Les rôles en bref »",
            "points": [
              "En bas du « Centre d'aide », la rubrique « Les rôles en bref » récapitule l'ensemble des rôles de la plateforme et leur description courte.",
              "Repérez votre rôle pour comprendre votre périmètre, et identifiez les rôles complémentaires (par exemple validateur, bibliothécaire) avec lesquels vous interagissez.",
              "Cette rubrique aide à comprendre pourquoi certains menus apparaissent ou non dans votre barre latérale."
            ]
          },
          {
            "titre": "Contacter le Support",
            "points": [
              "Dans la section « Aide », ouvrez « Support » : la page rassemble les canaux de contact et les questions fréquentes.",
              "Contacts disponibles : « E-mail » (support@eduweb.ci), « Téléphone » ((+225) 07 0985 8042) et un raccourci « Centre d'aide ».",
              "Dépliez la rubrique « Questions fréquentes » pour trouver une réponse immédiate (réserver une ressource, demande « en attente », annulation, signification des couleurs, confirmation de présence).",
              "Le bouton « Contacter le support » ouvre un message vers l'adresse e-mail d'assistance."
            ]
          },
          {
            "titre": "Bon réflexe en cas d'erreur",
            "points": [
              "Si une page affiche « Une erreur est survenue » (ou si un bouton « Enregistrer » reste sans effet), gardez votre calme : il s'agit le plus souvent d'un incident passager.",
              "La base de données (Neon) peut être momentanément en veille : rechargez simplement la page pour la réveiller, ou cliquez sur « Réessayer » lorsque le bouton est proposé.",
              "Si le problème persiste après plusieurs rechargements, contactez le « Support » en décrivant la page concernée et l'action tentée."
            ]
          }
        ],
        "atelier": [
          "Ouvrir le « Centre d'aide » et identifier le titre de son guide sous « Votre guide ».",
          "Cliquer sur « Télécharger en PDF » et vérifier l'ouverture du document.",
          "Repérer son rôle dans la rubrique « Les rôles en bref » et en lire la description.",
          "Ouvrir « Support », noter l'adresse e-mail et le téléphone, puis déplier une « Question fréquente ».",
          "Décrire à voix haute le réflexe à adopter face au message « Une erreur est survenue »."
        ],
        "evaluation": [
          "QCM : où télécharge-t-on son guide au format PDF ? (Réponse : dans le « Centre d'aide », via « Télécharger en PDF ».)",
          "Question : quels sont les canaux de contact proposés sur la page « Support » ? (Réponse : e-mail support@eduweb.ci, téléphone (+225) 07 0985 8042 et « Centre d'aide ».)",
          "Mise en situation : la page affiche « Une erreur est survenue » — quelle est la première action à effectuer ? (Réponse : recharger la page, la base pouvant être momentanément en veille.)",
          "Vérification pratique : l'apprenant ouvre son guide, le télécharge en PDF et localise une « Question fréquente » sans aide."
        ]
      },
      {
        "code": "T4",
        "titre": "Se former et se certifier avec CERTEL",
        "public": "Tous les utilisateurs connectés, quel que soit leur rôle, souhaitant développer et certifier leurs compétences en informatique, numérique et intelligence artificielle. Le diagnostic de niveau et le programme sont également consultables par les visiteurs depuis le menu public « CERTEL ».",
        "duree": "1 h 00",
        "prerequis": [
          "Être connecté à son espace EduWeb Booking (module T1 « Prise en main » conseillé au préalable) ; le diagnostic de niveau reste toutefois consultable sans connexion.",
          "Disposer d'un navigateur web à jour, avec le son activé pour profiter de la lecture audio des leçons, et d'une connexion internet.",
          "Pour une inscription payante : disposer d'un compte Mobile Money (Wave, Orange Money, MTN ou Moov) ou d'une carte bancaire. Aucun paiement n'est requis tant qu'aucun prix n'est défini par le super administrateur."
        ],
        "objectifs": [
          "Accéder à la formation certifiante CERTEL depuis le tableau de bord (section « Principal » › « Formation CERTEL ») ou depuis le menu public « CERTEL ».",
          "Réaliser le « diagnostic de niveau » gratuit (environ 10 min) pour se positionner sur le Niveau 1, 2 ou 3.",
          "S'inscrire à un niveau via le paiement par Mobile Money (Wave, Orange Money, MTN, Moov) ou carte bancaire, ou accéder gratuitement lorsque aucun prix n'est défini.",
          "Suivre les leçons illustrées d'un module en s'appuyant sur la « lecture audio » du contenu narratif.",
          "Réaliser les exercices auto-corrigés à « vérification immédiate » et les évaluations « chronométrées » de chaque module.",
          "Passer l'« évaluation certifiante » du niveau (projet de synthèse, examen et mise en situation) et générer son « certificat de réussite » au format PDF paysage."
        ],
        "competences": [
          "Auto-positionnement par le diagnostic et choix éclairé du niveau de formation adapté.",
          "Inscription autonome à un niveau par paiement Mobile Money ou carte bancaire (paiement sécurisé via CinetPay), ou accès libre lorsque le niveau est gratuit.",
          "Apprentissage en autonomie : lecture des leçons illustrées, écoute du contenu audio et auto-évaluation immédiate.",
          "Gestion d'une évaluation chronométrée et préparation à l'évaluation certifiante du niveau.",
          "Obtention et téléchargement de son certificat de réussite nominatif."
        ],
        "deroule": [
          {
            "titre": "Accéder à la formation CERTEL",
            "points": [
              "Utilisateur connecté : dans la section « Principal » de la barre latérale, ouvrez « Formation CERTEL » pour rejoindre la page « Formation certifiante CERTEL ».",
              "Visiteur : la même page est accessible depuis le menu public « CERTEL ».",
              "La page présente un parcours certifiant en 3 niveaux de 3 mois chacun (du socle bureautique à l'ingénierie numérique et l'IA), avec, pour chaque niveau, son public cible, ses prérequis, ses compétences visées et ses thématiques & syllabus.",
              "CERTEL est une formation certifiante au numérique et à l'intelligence artificielle, accessible à tout utilisateur connecté."
            ]
          },
          {
            "titre": "Se positionner avec le diagnostic de niveau",
            "points": [
              "Cliquez sur « Faire le test de niveau » (ou « Faire le test de niveau gratuit » en bas de page) pour ouvrir le diagnostic gratuit, d'une durée d'environ 10 minutes.",
              "Le diagnostic est corrigé automatiquement côté serveur et vous oriente vers le bon niveau (Niveau 1, 2 ou 3) et un programme adapté.",
              "Le diagnostic est gratuit et ne nécessite aucun paiement ; il peut être réalisé avant toute inscription à un niveau."
            ]
          },
          {
            "titre": "S'inscrire à un niveau (Mobile Money ou carte bancaire)",
            "points": [
              "Sur la fiche d'un niveau, cliquez sur « Accéder à la formation interactive du Niveau … » : si une inscription est requise, vous êtes dirigé vers la page « Inscription au Niveau … ».",
              "La page affiche les « Frais d'inscription » (ou la mention « Ce niveau est actuellement gratuit. » lorsque aucun prix n'est défini), une éventuelle remise étant indiquée par un pourcentage barré.",
              "Sous « Opérateurs acceptés », choisissez un « Moyen de paiement » parmi « Tous », « Mobile Money » (Wave, Orange Money, MTN, Moov), « Wave » ou « Carte », puis cliquez sur « Payer … et m'inscrire ».",
              "Le paiement est sécurisé via CinetPay : vous êtes redirigé puis ramené sur la page d'inscription après confirmation ; une fois l'accès accordé, le message « Vous êtes inscrit … » s'affiche avec le bouton « Accéder aux modules ».",
              "Lorsque le niveau est gratuit, aucun paiement n'est demandé et l'accès aux modules est immédiat. Le super administrateur dispose d'un accès complet sans paiement."
            ]
          },
          {
            "titre": "Suivre les leçons illustrées et écouter l'audio",
            "points": [
              "Chaque niveau comporte « 6 modules » interactifs à suivre dans l'ordre ; chaque module présente sa « Finalité », ses « Objectifs pédagogiques » et ses « Compétences visées ».",
              "Les leçons sont illustrées (infographies) et accompagnées d'une « lecture audio » du contenu narratif, pour une meilleure accessibilité.",
              "Pour le confort de lecture, le texte des contenus narratifs respecte une taille de police d'au moins 13 px et un lecteur audio est disponible sur les passages narratifs."
            ]
          },
          {
            "titre": "S'exercer : vérification immédiate et évaluations chronométrées",
            "points": [
              "Les exercices des modules sont auto-corrigés à « vérification immédiate » : la correction s'affiche dès votre réponse (comportement formatif réglé par le super administrateur).",
              "Chaque module se termine par une évaluation auto-corrigée ; les évaluations sont « chronométrées » afin de vous placer en conditions réelles.",
              "Le super administrateur règle le comportement des évaluations : « formatif » (vérification immédiate) ou « sommatif » (corrigés affichés uniquement à la fin)."
            ]
          },
          {
            "titre": "Passer l'évaluation certifiante et obtenir son certificat",
            "points": [
              "Au bas du niveau, ouvrez « Évaluation certifiante du Niveau … » : elle combine un projet de synthèse, un examen final mixte (QCM et questions) et une mise en situation pratique ; le seuil de certification est une moyenne ≥ 60/100 avec projet validé.",
              "En mode sommatif, les corrigés de l'examen s'affichent à la « fin » de l'épreuve.",
              "Une fois le niveau réussi, ouvrez « Mon certificat de réussite » : votre « certificat de réussite » nominatif est généré au format PDF paysage, avec sa référence, et peut être téléchargé."
            ]
          }
        ],
        "atelier": [
          "Ouvrir « Formation CERTEL » depuis le tableau de bord, puis réaliser le « diagnostic de niveau » gratuit et relever le niveau recommandé.",
          "Sur la fiche d'un niveau, ouvrir la page « Inscription au Niveau … », repérer les « Frais d'inscription » (ou la mention de gratuité) et identifier les moyens de paiement « Mobile Money » (Wave, Orange Money, MTN, Moov) et « Carte ».",
          "Ouvrir un module, lire une leçon illustrée et utiliser la « lecture audio » du contenu narratif.",
          "Réaliser un exercice auto-corrigé et constater la « vérification immédiate » de la réponse, puis lancer une évaluation « chronométrée ».",
          "Localiser « Évaluation certifiante du Niveau … » puis « Mon certificat de réussite » et décrire la procédure d'obtention du certificat PDF paysage."
        ],
        "evaluation": [
          "QCM : le diagnostic de niveau CERTEL est-il payant ? (Réponse : non, le diagnostic de niveau est gratuit.)",
          "Question : citez les moyens de paiement proposés pour s'inscrire à un niveau payant. (Réponse : Mobile Money — Wave, Orange Money, MTN, Moov — ou carte bancaire, via CinetPay.)",
          "Question : quelle est la différence entre une évaluation « formative » et « sommative » telle que réglée par le super administrateur ? (Réponse : formative = vérification immédiate des réponses ; sommative = corrigés affichés à la fin.)",
          "Mise en situation : décrivez le parcours complet, de l'accès à « Formation CERTEL » jusqu'à l'obtention du « certificat de réussite » en PDF paysage (diagnostic › inscription › modules avec audio et vérification immédiate › évaluation certifiante › certificat).",
          "Vérification pratique : l'apprenant accède à un niveau (gratuit ou après paiement), suit une leçon avec audio, réussit un exercice à vérification immédiate et localise son certificat sans aide."
        ]
      }
    ]
  },
  "rolesA": {
    "wrappers": [
      {
        "roleKey": "SUPER_ADMIN",
        "duree": "7 heures (1 journée), réparties en deux demi-journées : supervision et hiérarchie institutionnelle le matin, configuration des espaces transverses (Sport cérébral, compétitions) et exploitation l'après-midi.",
        "prerequis": [
          "Disposer d'un compte « Super Administrateur EduWeb » actif et avoir changé le mot de passe initial « password123 ».",
          "Maîtriser les notions de base d'un navigateur web et la navigation dans un tableau de bord SaaS.",
          "Comprendre l'organisation administrative ciblée : Gouvernement (l'État) → Ministères de tutelle → Établissements.",
          "Avoir préparé, le cas échéant, les fichiers CSV de ministères (colonnes : nom, sigle) et d'établissements (cohorte) selon les modèles téléchargeables dans l'application.",
          "Connaître les formules d'abonnement (Pilote, Standard, Premium, National) et les statuts d'abonnement (Actif, Suspendu, Résilié)."
        ],
        "objectifs": [
          "Superviser l'état global de la plateforme depuis « Supervision EduWeb » en interprétant les indicateurs « Organisations », « Utilisateurs », « Ressources » et « Réservations », ainsi que le tableau « Organisations abonnées ».",
          "Enregistrer le gouvernement et structurer ses ministères de tutelle, individuellement (carte « Nouveau ministère » : « Nom du ministère » et « Sigle »), par pré-chargement (« Ministères de Côte d'Ivoire ») ou par import CSV (« Importer les ministères »).",
          "Inscrire des établissements à l'unité (« Inscrire un établissement » puis « Créer l'établissement ») et en cohorte (import CSV), puis vérifier le bandeau de confirmation (importés / doublons ignorés).",
          "Administrer l'abonnement de chaque établissement (« Ministère de tutelle », « Formule », « Statut abonnement », « Comptes autorisés », « Renouvellement ») et arbitrer entre « Suspendre », « Réactiver » et la suppression définitive (« Supprimer »).",
          "Basculer dans le contexte d'un établissement via le sélecteur d'institution pour y agir comme administrateur, puis revenir au contexte « EduWeb · plateforme ».",
          "Configurer l'espace Sport cérébral (« Activer le verrouillage par abonnement », « Banque de questions », « Gestion des jeux », publication, ordre et consignes) et organiser une compétition de l'inscription à la clôture.",
          "Sécuriser son propre compte depuis « Mon compte » et diagnostiquer les anomalies courantes (mise en veille de la base Neon, échec d'enregistrement)."
        ],
        "competences": [
          "Gouvernance multi-établissements : modélisation et maintenance de la hiérarchie Gouvernement → Ministères → Établissements.",
          "Gestion du cycle de vie des abonnements et arbitrage des accès (suspension, réactivation, résiliation, suppression irréversible).",
          "Administration déléguée par changement de contexte institutionnel sans compromettre l'isolement des données entre établissements.",
          "Paramétrage des services transverses (Sport cérébral) et conduite opérationnelle d'une compétition en temps réel.",
          "Supervision et lecture analytique des indicateurs de plateforme.",
          "Prévention et résolution de premier niveau des incidents techniques courants."
        ],
        "atelier": [
          "Atelier 1 — Initialiser l'État : ouvrir « Gouvernement & ministères », enregistrer le gouvernement (Côte d'Ivoire) via « Enregistrer », pré-charger avec « Ministères de Côte d'Ivoire », puis ajouter manuellement un ministère dans la carte « Nouveau ministère » (« Nom du ministère » et « Sigle », bouton « Ajouter »).",
          "Atelier 2 — Déployer un établissement pilote : créer l'ENS d'Abidjan via « Inscrire un établissement » puis « Créer l'établissement », régler son abonnement (« Formule », « Statut abonnement » sur « Actif », « Comptes autorisés », « Renouvellement »), enregistrer, puis importer une cohorte de 3 établissements fictifs par CSV (« Importer ») et vérifier le bandeau de confirmation (importés / doublons ignorés).",
          "Atelier 3 — Administration contextuelle : à l'aide du sélecteur d'institution, basculer dans un établissement, créer un compte via « Administration » › « Utilisateurs » (« Nouvel utilisateur » puis « Créer l'utilisateur »), puis revenir à « EduWeb · plateforme ».",
          "Atelier 4 — Configurer le Sport cérébral : dans « Réglages des jeux », régler « Activer le verrouillage par abonnement » et la « Sélection des jeux offerts », puis « Enregistrer les réglages » ; ajouter une question dans la « Banque de questions » ; dans « Gestion des jeux », publier un jeu, le réordonner (« Monter » / « Descendre ») et utiliser « Enregistrer la consigne ».",
          "Atelier 5 — Conduire une compétition : créer une compétition (« Intitulé », « Jeu », « Niveau ») via « Créer la compétition », partager le « Code de session », piloter « Ouvrir (inscriptions) » → « Démarrer » → « Clore » et observer le « Classement » en direct."
        ],
        "evaluation": [
          "Évaluation pratique : l'apprenant déploie de bout en bout un établissement (inscription + abonnement au statut « Actif ») et crée un compte administrateur fonctionnel (critère : connexion possible avec « password123 »).",
          "Contrôle de conformité : vérification que la hiérarchie Gouvernement → Ministère → Établissement est correctement renseignée et que les badges de rattachement (nombre d'établissements par ministère) sont cohérents.",
          "Mise en situation : organisation complète d'une compétition jusqu'à l'affichage d'un classement actualisé, en respectant la séquence d'états « Ouvrir (inscriptions) » → « Démarrer » → « Clore ».",
          "Quiz de connaissances : distinguer les effets de « Suspendre », « Réactiver », du statut « Résilié » et de la suppression définitive ; identifier l'incidence du statut « Actif » sur l'accès complet aux jeux.",
          "Critère de réussite : exécuter chaque tâche en autonomie, en employant les libellés exacts de l'interface et sans solliciter d'assistance."
        ]
      },
      {
        "roleKey": "ORG_ADMIN",
        "duree": "6 heures (1 journée), structurées en trois séquences : configuration de l'organisation, gestion des comptes et des accès, puis pilotage de l'activité et animation (compétitions).",
        "prerequis": [
          "Disposer d'un compte « Administrateur d'organisation » actif, créé par le super administrateur, et avoir remplacé le mot de passe « password123 ».",
          "Avoir suivi une initiation à la navigation dans le tableau de bord EduWeb Booking.",
          "Connaître la structure organisationnelle de son établissement : Organisation › Site › Service › Ressources.",
          "Avoir préparé, si une cohorte doit être importée, le fichier CSV au format attendu (colonnes : prenom, nom, email, fonction, role, matricule) à partir du « Modèle CSV ».",
          "Avoir une vue d'ensemble des rôles de la plateforme afin d'attribuer le rôle adéquat à chaque compte (le rôle Super Administrateur étant exclu de la liste déroulante)."
        ],
        "objectifs": [
          "Paramétrer l'identité et la structure de l'organisation (« Organisation », « Sites & services ») ainsi que les règles de réservation (« Paramètres » : « Horaires d'ouverture », « Jours ouvrés », validation automatique).",
          "Créer et organiser les catégories de ressources et leur « Mode de validation » depuis « Catégories ».",
          "Créer des comptes utilisateurs à l'unité (« Nouvel utilisateur » puis « Créer l'utilisateur ») et importer une cohorte par CSV en attribuant les rôles appropriés.",
          "Instruire les « Demandes de comptes » (« Valider » / « Refuser ») et gérer le cycle de vie des accès (réinitialisation de mot de passe, suspension, réactivation).",
          "Piloter l'activité : valider les réservations en attente (« À valider »), consulter l'« Abonnement » et la matrice « Rôles & permissions » (lecture seule), suivre les « Statistiques » et produire des « Rapports » (CSV / PDF).",
          "Organiser et arbitrer une compétition Sport cérébral, en distinguant ce qui relève du super administrateur (« Banque de questions », « Réglages des jeux »).",
          "Sécuriser son propre accès via « Mon compte »."
        ],
        "competences": [
          "Administration d'un établissement : modélisation de la structure Organisation › Site › Service et définition des règles de réservation.",
          "Gestion du cycle de vie des comptes utilisateurs (création unitaire, import de cohorte, validation des demandes, suspension / réactivation, réinitialisation).",
          "Affectation rigoureuse des rôles et compréhension des permissions associées (matrice « Rôles & permissions » en lecture seule).",
          "Validation des réservations et pilotage statistique de l'usage des ressources (export de rapports).",
          "Suivi de l'abonnement (formule, comptes autorisés, statut, renouvellement) et de la consommation associée.",
          "Animation pédagogique par l'organisation de compétitions Sport cérébral."
        ],
        "atelier": [
          "Atelier 1 — Poser le socle organisationnel : dans « Organisation », renseigner l'identité et la « Couleur principale » puis « Enregistrer » ; dans « Sites & services », ajouter un site (« Ajouter le site ») puis un service rattaché (« Site de rattachement », « Ajouter le service ») ; dans « Paramètres », fixer les « Horaires d'ouverture », les « Jours ouvrés » et l'option de validation automatique, puis « Enregistrer les paramètres ».",
          "Atelier 2 — Structurer les ressources : depuis « Catégories », cliquer « Nouvelle catégorie », renseigner son « Mode de validation », son « Icône » et sa « Couleur », valider avec « Créer la catégorie », puis observer son badge de mode de validation et son compteur de ressources.",
          "Atelier 3 — Peupler les comptes : créer un utilisateur unitaire (« Nouvel utilisateur » puis « Créer l'utilisateur ») en lui attribuant un « Rôle » et un « Service », puis importer une cohorte via le « Modèle CSV » (bouton « Importer ») et analyser le compte-rendu (créés / ignorés / erreurs).",
          "Atelier 4 — Gérer les accès : traiter une « Demande de comptes » (« Valider » puis « Refuser » › « Refuser la demande » sur deux fiches distinctes), réinitialiser un mot de passe (retour à « password123 ») et suspendre / réactiver un compte tiers.",
          "Atelier 5 — Piloter et animer : valider une réservation dans « À valider », consulter une « Statistique » clé et exporter un « Rapport », puis créer une compétition (« Créer la compétition ») et la conduire de « Ouvrir (inscriptions) » à « Clore »."
        ],
        "evaluation": [
          "Évaluation pratique : configurer une organisation complète (identité, au moins un site et un service, paramètres de réservation) et la faire valider par le formateur.",
          "Mise en situation comptes : créer un utilisateur unitaire opérationnel et importer une cohorte sans erreur bloquante, avec attribution correcte des rôles.",
          "Contrôle de procédure : traiter correctement une demande de compte (validation et refus motivé) et justifier l'effet de chaque action sur l'accès de l'usager.",
          "Exercice de pilotage : interpréter un indicateur de « Statistiques » et produire un export « Rapports » conforme au périmètre demandé.",
          "Critère de réussite : situer avec exactitude la frontière entre ses prérogatives et la section « Plateforme » réservée au super administrateur, et réaliser chaque tâche en autonomie avec les libellés exacts."
        ]
      }
    ]
  },
  "rolesB": {
    "wrappers": [
      {
        "roleKey": "RESOURCE_MANAGER",
        "duree": "Module de 4 heures : 30 min de cadrage et prérequis, 2 h 30 d'atelier guidé dans l'application (création de ressources, salles multimédias, traitement des demandes), 1 h de pilotage (calendrier, statistiques, rapports) et d'évaluation.",
        "prerequis": [
          "Disposer d'un compte EduWeb Booking avec le rôle « Responsable de ressource » et avoir changé le mot de passe initial « password123 ».",
          "Savoir se connecter et naviguer dans la barre latérale (sections « Principal » et « Gestion »).",
          "Connaître le parc de ressources de son établissement (salles, salles multimédias, matériels, services) et leurs contraintes d'usage.",
          "Maîtriser les notions de base de réservation : créneau, capacité, mode exclusif/partagé, validation.",
          "Avoir suivi, ou consulté, le module d'introduction présentant la structure Organisation › Site › Service › Ressources."
        ],
        "objectifs": [
          "Créer une ressource complète via « Nouvelle ressource » en renseignant les sections « Informations générales », « Capacité & disponibilité » et « Règles de réservation ».",
          "Paramétrer les règles de réservation (« Mode » : « Exclusive (créneau entier) », « Partagée (par quantité) » ou « Mixte » ; « Durée max. (minutes) » ; « Préavis min. (heures) ») et activer « Soumettre les réservations à validation » ou « Réservation poste par poste (plan de salle) » selon le besoin.",
          "Gérer une salle multimédia : créer une salle via « Ajouter une salle » et ajuster le compteur « Postes » jusqu'à « Enregistrer la capacité ».",
          "Rendre une ressource indisponible en réglant son « Statut » sur « En maintenance », « Hors service » ou « Indisponible », puis la rouvrir en repassant à « Disponible ».",
          "Traiter une demande de réservation dans « À valider » en distinguant l'« Approuver » du « Refuser » avec « Motif du refus ».",
          "Analyser l'usage à partir des indicateurs de « Statistiques & pilotage » (« Taux d'occupation », « Taux de validation ») et produire un export depuis « Rapports ».",
          "Distinguer le périmètre de son rôle de celui de l'administrateur (pas de suppression de ressource, pas de gestion des catégories) et de la bibliothèque (consultation et téléchargement seuls, sans dépôt)."
        ],
        "competences": [
          "Concevoir et paramétrer un parc de ressources conforme aux contraintes pédagogiques et logistiques de l'établissement.",
          "Administrer la capacité des salles multimédias et garantir la cohérence du plan de postes en temps réel.",
          "Instruire et décider des demandes de réservation de façon équitable, motivée et tracée.",
          "Piloter l'occupation et la disponibilité des ressources à l'aide d'indicateurs et de rapports d'usage.",
          "Communiquer une décision de refus de manière claire et professionnelle auprès du demandeur."
        ],
        "atelier": [
          "Créer une salle de réunion via « Nouvelle ressource » : renseigner les « Informations générales », régler le « Statut », la « Capacité (places) » et le « Mode », puis cocher « Soumettre les réservations à validation » et terminer par « Créer la ressource ».",
          "Ouvrir « Salles multimédias », cliquer « Ajouter une salle », renseigner le « Nom de la salle » et la « Capacité (nombre de postes) » puis « Créer la salle » (observer le message « Salle ajoutée avec succès. ») ; ajuster ensuite le compteur « Postes » et valider avec « Enregistrer la capacité » (observer le message « Capacité mise à jour. »).",
          "Simuler une indisponibilité : ouvrir une ressource, cliquer « Modifier », passer le « Statut » à « En maintenance », « Enregistrer les modifications », puis la rouvrir en repassant à « Disponible ».",
          "Dans « À valider », ouvrir une demande, vérifier le « Créneau » et le « Type d'usage », l'« Approuver » ; sur une seconde demande, « Refuser » en saisissant un « Motif du refus » dans la fenêtre « Refuser la demande » puis « Confirmer le refus ».",
          "Consulter « Statistiques & pilotage », relever le « Taux d'occupation » et le graphique « Ressources les plus réservées », puis générer un export CSV ou PDF depuis « Rapports »."
        ],
        "evaluation": [
          "Création conforme d'une ressource (sections complètes, règles de réservation cohérentes) vérifiée sur la fiche enregistrée.",
          "Salle multimédia créée et capacité ajustée correctement, avec affichage des messages « Salle ajoutée avec succès. » puis « Capacité mise à jour. ».",
          "Changement de statut d'une ressource réalisé dans les deux sens (mise en maintenance puis remise en « Disponible »).",
          "Traitement correct d'au moins une demande approuvée et d'une demande refusée avec motif explicite et professionnel.",
          "Lecture exacte d'au moins trois indicateurs de « Statistiques & pilotage » et production réussie d'un export depuis « Rapports ».",
          "Énoncé sans erreur des limites du rôle (suppression de ressource et gestion des catégories réservées à l'administrateur ; dépôt de documents non autorisé)."
        ]
      },
      {
        "roleKey": "VALIDATOR",
        "duree": "Module de 3 heures : 30 min de cadrage et prérequis, 1 h 30 d'atelier de traitement des demandes (examen, approbation, refus motivé), 1 h de suivi d'activité (réservations, calendrier, statistiques) et d'évaluation.",
        "prerequis": [
          "Disposer d'un compte EduWeb Booking avec le rôle « Validateur hiérarchique » et avoir remplacé le mot de passe initial « password123 ».",
          "Savoir naviguer dans la barre latérale et identifier les sections « Gestion » et « Principal ».",
          "Comprendre le circuit d'une demande de réservation et les statuts associés (« Soumise », « En attente de validation », « Validée », « Refusée »).",
          "Connaître les règles internes de l'établissement encadrant l'attribution des ressources et les priorités d'usage.",
          "Avoir pris connaissance du principe d'impartialité : on ne valide pas une demande que l'on a soi-même déposée — elle est alors traitée par un autre validateur."
        ],
        "objectifs": [
          "Localiser les demandes à traiter dans « À valider » et interpréter le badge indiquant leur nombre.",
          "Examiner une demande en analysant les blocs « Détails de la réservation », « Motif & besoins », « Demandeur » et « Suivi de la demande ».",
          "Décider d'une demande en cliquant « Approuver » (statut « Validée ») ou « Refuser » en renseignant le « Motif du refus » obligatoire puis « Confirmer le refus ».",
          "Justifier une décision de refus de façon claire et constructive, en tenant compte de la notification automatique adressée au demandeur.",
          "Suivre l'activité de réservation via « Toutes les réservations », le « Calendrier » et les indicateurs de « Statistiques & pilotage » (« Taux de validation », « En attente », « Refusées »).",
          "Créer et gérer ses propres réservations dans « Mes réservations » (« Je suis arrivé », « Activité terminée », « Annuler la réservation »).",
          "Situer les limites du rôle : consultation seule des ressources et des salles multimédias, sans administration ni modification."
        ],
        "competences": [
          "Instruire une demande de réservation avec rigueur, en s'appuyant sur l'ensemble des informations fournies.",
          "Décider de manière impartiale, motivée et conforme aux règles de l'établissement.",
          "Rédiger un motif de refus pédagogique et respectueux à l'attention du demandeur.",
          "Exploiter les tableaux de bord et statistiques pour suivre la charge de validation et l'usage des ressources.",
          "Distinguer son rôle de décideur de celui de gestionnaire ou d'administrateur des ressources."
        ],
        "atelier": [
          "Ouvrir « À valider », lire le compteur « X demande(s) en attente » et identifier une demande à traiter en priorité.",
          "Ouvrir la fiche d'une demande et parcourir méthodiquement « Détails de la réservation », « Motif & besoins » et « Demandeur » avant toute décision.",
          "Approuver une demande conforme et vérifier qu'elle passe au statut « Validée », puis constater sa disparition de la liste « À valider ».",
          "Refuser une demande non conforme : ouvrir la fenêtre « Refuser la demande », rédiger un « Motif du refus » clair, cliquer « Confirmer le refus » et vérifier la trace dans le bloc « Validation ».",
          "Consulter « Toutes les réservations » en filtrant par statut (« Tous les statuts »), ouvrir le « Calendrier », puis relever dans « Statistiques & pilotage » le « Taux de validation » et le nombre « En attente ».",
          "Soumettre une réservation personnelle via « + Nouvelle réservation », puis la suivre dans « Mes réservations » et enchaîner « Je suis arrivé » puis « Activité terminée »."
        ],
        "evaluation": [
          "Accès correct aux demandes en attente et lecture exacte du badge et du compteur « X demande(s) en attente ».",
          "Examen complet d'une demande démontré par la restitution des informations clés (créneau, type d'usage, motif, demandeur).",
          "Approbation correctement exécutée, avec passage observé au statut « Validée ».",
          "Refus motivé réalisé conformément : « Motif du refus » renseigné, « Confirmer le refus » validé, décision tracée dans le bloc « Validation ».",
          "Lecture juste d'au moins trois indicateurs de « Statistiques & pilotage » et usage pertinent du filtre de statut dans « Toutes les réservations ».",
          "Énoncé sans erreur des limites du rôle (consultation seule des ressources, impossibilité de valider sa propre demande)."
        ]
      },
      {
        "roleKey": "REQUESTER",
        "duree": "Module de 2 h 30 : 20 min de cadrage et prérequis, 1 h 30 d'atelier guidé (assistant de réservation en six étapes, salles multimédias, suivi des demandes, bibliothèque), 40 min de mise en pratique en bibliothèque et d'évaluation.",
        "prerequis": [
          "Disposer d'un compte EduWeb Booking avec le rôle « Utilisateur demandeur » et avoir changé le mot de passe initial « password123 ».",
          "Savoir se connecter et repérer le bouton « + Nouvelle réservation » dans la barre latérale.",
          "Connaître la catégorie et la ressource correspondant à son besoin (salle, salle multimédia, matériel ou service).",
          "Disposer des informations de sa demande : intitulé, type d'usage, effectif, motif, dates et heures du créneau.",
          "Comprendre qu'une demande peut être soumise à validation et suivie via la cloche de notifications."
        ],
        "objectifs": [
          "Soumettre une demande de réservation en parcourant l'assistant en six étapes (« Catégorie », « Ressource », « Motif », « Créneau », « Détails », « Confirmation ») jusqu'à « Soumettre la demande ».",
          "Vérifier la disponibilité d'un créneau via « Vérifier la disponibilité » et exploiter le « Créneau proposé » en cas d'indisponibilité.",
          "Réserver des postes en salle multimédia en distinguant « Réserver des postes » (postes verts libres, postes rouges occupés) et « Réserver la salle ».",
          "Suivre l'état de ses demandes dans « Mes réservations » (« À venir », « Historique ») et utiliser « Je suis arrivé », « Activité terminée » et « Annuler la réservation ».",
          "Exploiter la bibliothèque numérique : « Consulter », « Télécharger » ou « Payer et débloquer » un document, et le « Réserver / Emprunter ».",
          "Déposer un document via l'assistant en sept étapes jusqu'à « Soumettre le dépôt » et suivre sa validation.",
          "Sécuriser son compte depuis « Mon compte » et surveiller la cloche de notifications pour les décisions de validation."
        ],
        "competences": [
          "Formuler une demande de réservation complète et recevable, adaptée à son besoin pédagogique ou professionnel.",
          "Gérer le cycle de vie d'une réservation, de la soumission à la clôture de l'activité.",
          "Optimiser l'usage des salles multimédias en sélectionnant les postes pertinents sur le plan de salle.",
          "Rechercher, consulter et obtenir des ressources documentaires selon leur niveau d'accès.",
          "Contribuer au fonds documentaire par un dépôt conforme et en assurer le suivi.",
          "Maintenir la sécurité de son accès et exploiter les notifications de la plateforme."
        ],
        "atelier": [
          "Réserver une salle via « + Nouvelle réservation » en parcourant les six étapes, renseigner le « Motif » obligatoire, cliquer « Vérifier la disponibilité » puis « Soumettre la demande » et observer le message « Votre demande de réservation a été enregistrée. ».",
          "Ouvrir « Salles multimédias », cliquer « Réserver des postes », sélectionner des postes verts (suivre le compteur « poste(s) sélectionné(s) ») puis soumettre la demande.",
          "Dans « Mes réservations », retrouver une demande à l'aide du filtre « Tous les statuts », ouvrir sa fiche, puis enchaîner « Je suis arrivé » et « Activité terminée » ; sur une autre, tester « Annuler la réservation ».",
          "Dans « Explorer », rechercher un document, ouvrir sa fiche, le « Consulter » depuis « Accès au document », puis le « Télécharger » (ou « Payer et débloquer » s'il est payant) et tester « Réserver / Emprunter ».",
          "Déposer un document via « Déposer » : parcourir les sept étapes (« Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits », « Vérification »), renseigner les champs obligatoires, cliquer « Soumettre le dépôt » et conserver le lien de la fiche.",
          "Changer son mot de passe depuis « Mon compte » et repérer le badge « non lue(s) » de la cloche de notifications."
        ],
        "evaluation": [
          "Soumission réussie d'une réservation complète, confirmée par le message « Votre demande de réservation a été enregistrée. ».",
          "Réservation de postes en salle multimédia exécutée correctement, avec sélection cohérente sur le plan de salle.",
          "Suivi maîtrisé d'une réservation : recherche, ouverture de fiche, et exécution de « Je suis arrivé », « Activité terminée » ou « Annuler la réservation ».",
          "Consultation et obtention d'un document conformes à son niveau d'accès (consultation, téléchargement gratuit ou payant, ou « Demander l'accès »).",
          "Dépôt d'un document mené à terme jusqu'à « Soumettre le dépôt », avec compréhension du circuit de validation par le documentaliste.",
          "Changement effectif du mot de passe et identification correcte du rôle des notifications dans le suivi des décisions."
        ]
      }
    ]
  },
  "rolesC": {
    "wrappers": [
      {
        "roleKey": "TECHNICIAN",
        "duree": "Demi-journée — 3 h 30 (3 h en présentiel + 30 min de prise en main guidée sur l'application)",
        "prerequis": [
          "Disposer d'un compte EduWeb Booking au rôle « Technicien / agent d'appui » et de ses identifiants (mot de passe initial « password123 », à changer à la première connexion).",
          "Savoir se connecter à l'application et naviguer dans la barre latérale (sections « Principal », « Gestion », « Bibliothèque » et « Aide »).",
          "Connaître le parc de ressources de son établissement (salles, équipements, salles multimédias) ainsi que l'organisation de ses sites et services.",
          "Comprendre que, pour ce rôle, l'enregistrement des maintenances et des changements de statut est réalisé dans l'outil par un responsable de ressource ou un administrateur, l'intervention technique se faisant sur le terrain (la plateforme n'ouvre pas, pour ce rôle, d'écran dédié pour déclarer ou clôturer un incident ou une maintenance)."
        ],
        "objectifs": [
          "Identifier, sur le « Tableau de bord », les ressources à surveiller à partir de l'indicateur « Ressources disponibles » (rapport « disponibles / total » et mention « X en maintenance ») et de l'encart d'alerte « X incident(s) ouvert(s) ».",
          "Inspecter une ressource via le menu « Ressources » et interpréter son état de disponibilité (« Disponible maintenant », « Occupée actuellement » ou « Non réservable »).",
          "Consulter l'encart « Maintenance planifiée » d'une fiche de ressource pour situer les opérations en cours ou à venir.",
          "Planifier une intervention sans gêner les usagers en exploitant le « Calendrier », la page « Réservations » (« Toutes les réservations ») et l'encart « Prochaines réservations » d'une fiche de ressource.",
          "Contrôler l'occupation des « Salles multimédias » en lisant le plan des postes en temps réel (postes libres / occupés) avant une intervention.",
          "Consulter le fonds documentaire en lecture seule via « Bibliothèque », « Explorer » et « Documents ».",
          "Gérer son accès depuis « Mon compte » et changer son mot de passe via « Mettre à jour le mot de passe »."
        ],
        "competences": [
          "Surveillance de l'état d'un parc de ressources à partir d'indicateurs de tableau de bord.",
          "Lecture et interprétation des statuts de disponibilité et de maintenance d'une ressource.",
          "Anticipation et planification d'interventions techniques au moyen d'un calendrier et d'une liste d'occupation.",
          "Contrôle de l'occupation des postes informatiques d'une salle multimédia en temps réel.",
          "Coordination avec les responsables de ressource et les administrateurs pour la traçabilité des maintenances dans l'outil.",
          "Gestion autonome de son compte et de la sécurité de son mot de passe."
        ],
        "atelier": [
          "Se connecter, ouvrir le « Tableau de bord » et relever le rapport « disponibles / total » de l'indicateur « Ressources disponibles », le nombre de ressources « en maintenance » et, le cas échéant, l'encart d'alerte « X incident(s) ouvert(s) » (message « Des ressources nécessitent une intervention. »).",
          "Dans « Ressources », filtrer par catégorie, par statut et, si plusieurs sites existent, par site ; ouvrir la fiche d'une ressource et énoncer son état de disponibilité (« Disponible maintenant », « Occupée actuellement » ou « Non réservable ») ainsi que le contenu de l'encart « Maintenance planifiée ».",
          "Ouvrir le « Calendrier » (« Vue d'ensemble des réservations de l'organisation »), puis la page « Réservations » (« Toutes les réservations ») pour repérer un créneau libre permettant une intervention, et lire « Prochaines réservations » sur une fiche de ressource.",
          "Ouvrir « Salles multimédias » (« Salles multimédias — plan des postes »), lire le compteur de postes libres / occupés et survoler un poste occupé (rouge) pour identifier le moment où il redevient disponible.",
          "Consulter un document en lecture seule via « Bibliothèque », « Explorer » puis « Documents » (le téléchargement et la réservation ne sont pas ouverts à ce rôle).",
          "Dans « Mon compte », réaliser un changement de mot de passe complet jusqu'au message « Mot de passe modifié avec succès. », puis retrouver son guide dans le « Centre d'aide » et le « Télécharger en PDF »."
        ],
        "evaluation": [
          "Mise en situation notée : à partir du « Tableau de bord », l'apprenant identifie correctement les ressources en maintenance et la présence éventuelle d'incidents ouverts.",
          "Vérification pratique : l'apprenant ouvre une fiche de ressource et qualifie sans erreur son état (« Disponible maintenant » / « Occupée actuellement » / « Non réservable ») et sa maintenance planifiée.",
          "Exercice de planification : l'apprenant localise un créneau libre dans le « Calendrier » ou la liste « Réservations » pour situer une intervention.",
          "Contrôle sur les salles multimédias : l'apprenant lit correctement le plan des postes (libres / occupés) et la période d'occupation d'un poste.",
          "Validation finale : l'apprenant effectue avec succès un changement de mot de passe depuis « Mon compte » et sait localiser le « Centre d'aide » et le « Support ».",
          "Critère transversal : l'apprenant distingue clairement les actions ouvertes à son rôle (consultation) de celles réservées aux responsables de ressource et aux administrateurs (enregistrement des maintenances et des changements de statut)."
        ]
      },
      {
        "roleKey": "VISITOR",
        "duree": "1 heure (45 min de découverte guidée + 15 min de pratique autonome sur l'espace « Sport cérébral »)",
        "prerequis": [
          "Disposer d'un appareil connecté à Internet et d'un navigateur web récent.",
          "Aucun compte n'est requis : l'espace « Sport cérébral » et le site public sont accessibles sans connexion.",
          "Pour rejoindre une compétition : disposer du code de session (ou du lien) communiqué par l'organisateur.",
          "Pour accéder ensuite aux ressources, aux réservations et à la bibliothèque : prévoir une demande de création de compte auprès de l'administrateur de son établissement."
        ],
        "objectifs": [
          "Découvrir l'offre publique d'EduWeb Booking en parcourant la page d'accueil et les rubriques de présentation, de fonctionnalités et de contact.",
          "Accéder librement à l'espace « Sport cérébral » et lancer un jeu en choisissant un niveau (Débutant, Intermédiaire ou Avancé).",
          "Exploiter la consigne de chaque jeu à l'écran et en audio (bouton « Écouter ») et relever le « Défi du jour ».",
          "Rejoindre une compétition en saisissant un code dans le champ « CODE » puis en cliquant sur « Rejoindre ».",
          "Formuler une demande de création de compte pour accéder aux fonctions réservées aux établissements (ressources, réservations, bibliothèque)."
        ],
        "competences": [
          "Navigation autonome sur la partie publique d'une plateforme web et repérage de son offre de services.",
          "Utilisation d'un espace de jeux éducatifs en ligne (choix du jeu, du niveau, lecture des consignes écrites et audio).",
          "Participation à une compétition en ligne au moyen d'un code de session, sur son propre appareil.",
          "Identification de la démarche à suivre pour obtenir un accès complet à la plateforme."
        ],
        "atelier": [
          "Ouvrir la page d'accueil publique et parcourir les rubriques (présentation, fonctionnalités, contact) pour décrire l'offre de la plateforme.",
          "Ouvrir « Sport cérébral », choisir un jeu, sélectionner un niveau, lire la consigne puis cliquer sur « Écouter » avant de jouer une partie dans le navigateur (selon la configuration, certains jeux et niveaux peuvent être réservés aux établissements abonnés ; les jeux ouverts aux visiteurs et le « Défi du jour » restent toujours accessibles).",
          "Relever le « Défi du jour » et réaliser l'exercice quotidien.",
          "Simuler l'arrivée en compétition : repérer l'encadré « Compétition » sur l'accueil du « Sport cérébral » (« Vous avez un code de session ? »), saisir un code dans le champ « CODE » et cliquer sur « Rejoindre ».",
          "Rédiger (à blanc) une demande de création de compte adressée à l'administrateur de l'établissement, en précisant l'usage souhaité (ressources, réservations ou bibliothèque)."
        ],
        "evaluation": [
          "Quiz de découverte : l'apprenant cite au moins trois services proposés par la plateforme à partir des rubriques publiques.",
          "Mise en pratique : l'apprenant lance un jeu, choisit un niveau, déclenche la consigne audio (« Écouter ») et termine une partie de manière autonome.",
          "Vérification : l'apprenant relève correctement le « Défi du jour ».",
          "Mise en situation : l'apprenant rejoint une compétition de démonstration en saisissant un code dans le champ « CODE » et en cliquant sur « Rejoindre ».",
          "Critère final : l'apprenant explique la procédure pour obtenir un compte complet et identifie l'interlocuteur (administrateur de l'établissement)."
        ]
      },
      {
        "roleKey": "LIBRARIAN",
        "duree": "1 journée — 7 h (4 h 30 d'apports et de démonstrations + 2 h 30 de travaux pratiques sur la chaîne documentaire)",
        "prerequis": [
          "Disposer d'un compte EduWeb Booking au rôle « Bibliothécaire / Documentaliste » et avoir changé le mot de passe initial.",
          "Maîtriser les fondamentaux du traitement documentaire : métadonnées (auteur principal, co-auteurs, directeur, année, langue, niveau), types de documents, notions de collection et de domaine.",
          "Savoir naviguer dans la barre latérale et déplier la section « Bibliothèque » du tableau de bord.",
          "Connaître le contexte de l'établissement : périmètre du fonds, règles d'accès et cadre de paiement simulé (démo) en FCFA (cas particulier de l'ENS d'Abidjan, où un étudiant peut télécharger gratuitement en saisissant son matricule)."
        ],
        "objectifs": [
          "Contrôler et qualifier un dépôt en attente depuis « À vérifier » (page « Validation documentaire ») : examiner les métadonnées, le fichier et l'encadré « Doublons potentiels ».",
          "Statuer sur un dépôt à l'aide des actions « Valider le document », « Corriger » (« Demander correction ») ou « Rejeter » (« Confirmer le rejet »), et déclencher la génération du code documentaire définitif.",
          "Gérer le cycle de vie d'un document validé via « Publier » et « Archiver », et vérifier le suivi (« Déposé par », « Validé par », « Publié le », encadré « Code & QR »).",
          "Paramétrer l'accès payant simulé en saisissant le « Prix de téléchargement (FCFA · 0 = gratuit) » puis en cliquant sur « Définir ».",
          "Organiser le fonds en créant des « Collections » et des « Domaines » et en gérant leur activation / désactivation.",
          "Traiter les « Réservations doc. » (consultation sur place, emprunt physique, demande d'accès) et suivre les « Emprunts » jusqu'au retour (« Marquer rendu »).",
          "Piloter l'activité documentaire à partir des indicateurs des « Statistiques doc. »."
        ],
        "competences": [
          "Conduite complète d'une chaîne de traitement documentaire numérique : contrôle, validation, codification, publication et archivage.",
          "Contrôle qualité des dépôts et détection des doublons à partir des métadonnées et du score de similarité.",
          "Structuration et maintenance d'un fonds documentaire par collections et domaines.",
          "Gestion des réservations et des emprunts de documents (consultation, emprunt physique, échéances et retours).",
          "Paramétrage de l'accès et de la tarification (simulée) des téléchargements.",
          "Pilotage de l'activité documentaire par l'analyse d'indicateurs (dépôts, consultations, téléchargements, réservations, popularité)."
        ],
        "atelier": [
          "Depuis « À vérifier », ouvrir la fiche d'un dépôt, contrôler ses métadonnées, son fichier et l'encadré « Doublons potentiels », puis le « Valider le document » en renseignant un « Commentaire (facultatif) » et en cochant au besoin « Publier directement », en observant la génération du code documentaire définitif.",
          "Sur un autre dépôt, exercer l'action « Corriger » (renseigner les « Précisions » puis « Demander correction ») et, sur un troisième, l'action « Rejeter » (saisir le « Motif du rejet » puis « Confirmer le rejet »).",
          "Sur un document validé, utiliser « Publier » puis « Archiver », et vérifier le suivi en bas de fiche ainsi que l'encadré « Code & QR ».",
          "Dans l'encadré « Accès au document », fixer un « Prix de téléchargement (FCFA · 0 = gratuit) » puis cliquer sur « Définir » ; décrire le parcours usager « Payer et débloquer » et le cas « Étudiant de l'ENS d'Abidjan ? ».",
          "Créer une « Collection » (ex. nom « Thèses », code « THS ») et un « Domaine » (ex. « Robotique », code « ROB »), puis basculer leur état « Active » / « Inactive » (collections) et « Actif » / « Inactif » (domaines).",
          "Dans « Réservations doc. », approuver puis refuser une demande en attente, puis dans « Emprunts » repérer un retard et cliquer sur « Marquer rendu » ; enfin, ouvrir « Statistiques doc. » et commenter les indicateurs « Documents », « Publiés », « Réservations », « Consultations » et « Téléchargements »."
        ],
        "evaluation": [
          "Étude de cas notée : à partir de trois dépôts, l'apprenant applique la décision adaptée (valider, demander correction ou rejeter) en respectant les champs obligatoires (« Précisions », « Motif du rejet »).",
          "Contrôle pratique : l'apprenant publie puis archive un document et localise les informations de suivi (« Validé par », « Publié le », encadré « Code & QR »).",
          "Vérification : l'apprenant fixe un « Prix de téléchargement (FCFA · 0 = gratuit) » et explique le mécanisme de paiement simulé, dont le cas du téléchargement étudiant gratuit à l'ENS d'Abidjan.",
          "Exercice d'organisation : l'apprenant crée une collection et un domaine cohérents et gère leur activation, en sachant que seules les collections et domaines actifs sont proposés au dépôt.",
          "Mise en situation : l'apprenant traite une réservation, suit un emprunt et le clôt via « Marquer rendu », en vérifiant le recréditement de la disponibilité physique (un emprunt approuvé crée un prêt avec une échéance de retour fixée à 14 jours).",
          "Critère final : l'apprenant interprète au moins quatre indicateurs des « Statistiques doc. » pour formuler une recommandation de pilotage du fonds."
        ]
      }
    ]
  },
  "rolesD": {
    "wrappers": [
      {
        "roleKey": "DEPOSITOR",
        "duree": "3 heures (demi-journée) : 1 h 30 de présentation guidée et 1 h 30 d'atelier pratique sur l'application.",
        "prerequis": [
          "Disposer d'un compte actif portant le rôle « Déposant » et avoir changé le mot de passe initial « password123 ».",
          "Savoir se connecter à l'application et naviguer dans la barre latérale (sections « Principal », « Bibliothèque », « Aide »).",
          "Avoir réuni au préalable une ressource documentaire à déposer (PDF recommandé) ainsi que ses métadonnées : titre, auteur principal, année, résumé, mots-clés.",
          "Comprendre la finalité d'une bibliothèque numérique d'établissement et la distinction entre niveaux d'accès (« Public », « Interne », « Restreint », « Consultation sur place », « Emprunt papier », « Confidentiel », « Embargo »).",
          "Maîtriser les notions de base de propriété intellectuelle et de droits de diffusion appliqués à un document académique."
        ],
        "objectifs": [
          "Identifier dans la barre latérale les cinq entrées de la section « Bibliothèque » accessibles au déposant (« Bibliothèque », « Explorer », « Déposer », « Documents », « Réservations doc. ») et distinguer les fonctions hors de votre périmètre.",
          "Réaliser le dépôt complet d'une ressource documentaire en parcourant les sept étapes de l'assistant « Déposer une ressource » (« Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits », « Vérification »).",
          "Renseigner correctement les métadonnées, les auteurs, le résumé et les droits d'accès, puis joindre, à l'étape « Fichier », un fichier aux formats acceptés (PDF, DOC, DOCX, ODT, PPT, PPTX, EPUB), le fichier étant facultatif au dépôt et pouvant être ajouté ultérieurement.",
          "Suivre le cycle de vie d'un dépôt à travers ses statuts successifs (« Soumis », « À corriger », « Validé », « Publié », « Rejeté ») et interpréter la rubrique « Historique & avis » de la fiche du document.",
          "Répondre à une demande de correction du documentaliste en redéposant, via « Déposer », une version corrigée de la ressource (le rôle ne permettant pas de modifier directement un dépôt déjà soumis).",
          "Consulter, télécharger et réserver un document du catalogue dans le respect de son niveau d'accès, et suivre vos demandes dans « Réservations doc. »."
        ],
        "competences": [
          "Maîtriser le dépôt normalisé d'une ressource documentaire dans une bibliothèque numérique académique.",
          "Décrire une ressource avec des métadonnées et des mots-clés de qualité, gages de sa visibilité et de sa réutilisation.",
          "Choisir et justifier le niveau d'accès et les conditions de diffusion (autorisation de téléchargement, exemplaires physiques, prix de téléchargement) d'un document.",
          "Assurer le suivi rigoureux d'un dépôt jusqu'à sa publication et dialoguer avec le documentaliste via les avis tracés dans « Historique & avis ».",
          "Exploiter le fonds documentaire de façon autonome : recherche, consultation en lecture seule filigranée, téléchargement, citation au format APA et emprunt."
        ],
        "atelier": [
          "Connexion à l'application puis repérage commenté des cinq entrées « Bibliothèque » ; ouvrir « Bibliothèque » et lire les indicateurs « Documents », « En attente de validation », « Consultations » et « Téléchargements », ainsi que l'encadré « Derniers dépôts ».",
          "Déposer une ressource fictive de bout en bout via « Déposer » : franchir les sept étapes (« Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits », « Vérification ») jusqu'au clic sur « Soumettre le dépôt » et à l'obtention du message « Votre dépôt a été enregistré et soumis à validation. ».",
          "Retrouver le dépôt dans « Documents », ouvrir sa fiche, repérer son « Statut » et son code provisoire, puis lire la rubrique « Historique & avis ».",
          "Simuler une réponse à une demande de correction : redéposer via « Déposer » une version corrigée en le signalant dans le « Résumé » ou les « Mots-clés ».",
          "Explorer le catalogue depuis « Explorer », ouvrir une fiche, cliquer sur « Consulter » (lecture seule filigranée), tester « Télécharger » ou « Payer et débloquer », puis copier la référence via l'encadré « Citer ce document ».",
          "Envoyer une demande d'emprunt via « Réserver / Emprunter » (« Consultation sur place » ou « Emprunt physique ») et suivre son statut dans « Réservations doc. »."
        ],
        "evaluation": [
          "Évaluation pratique : déposer sans assistance une ressource complète et conforme via l'assistant « Déposer » jusqu'au message de confirmation, métadonnées et niveau d'accès correctement renseignés (critère éliminatoire : dépôt soumis avec succès).",
          "Contrôle de compréhension : associer chaque statut (« Soumis », « À corriger », « Validé », « Publié », « Rejeté ») à sa signification et localiser l'information correspondante sur la fiche du document.",
          "Mise en situation : à partir d'un statut « À corriger », décrire la procédure de redépôt d'une version corrigée via « Déposer ».",
          "Démonstration : retrouver un document via « Explorer », le consulter, identifier son niveau d'accès, puis déposer une demande d'emprunt et la suivre dans « Réservations doc. ».",
          "Auto-évaluation : citer les fonctions qui ne relèvent PAS du rôle de déposant (validation et « À vérifier », « Emprunts », « Statistiques doc. », « Collections », « Domaines », réservation de salles et section « Administration »)."
        ]
      },
      {
        "roleKey": "SCIENTIFIC_VALIDATOR",
        "duree": "2 h 30 : 1 h de cadrage du rôle et du processus d'expertise, 1 h 30 d'atelier pratique de relecture et d'émission d'avis.",
        "prerequis": [
          "Disposer d'un compte actif portant le rôle « Validateur scientifique » et avoir changé le mot de passe initial « password123 ».",
          "Posséder une expertise disciplinaire (enseignant-chercheur ou expert) dans le domaine des documents à relire.",
          "Savoir se connecter et naviguer dans les sections « Principal », « Bibliothèque » et « Aide » de la barre latérale.",
          "Comprendre la différence entre l'expertise scientifique (avis sur le fond) et le contrôle documentaire (vérification des métadonnées, codification, publication, archivage ou rejet) assuré par le bibliothécaire / documentaliste.",
          "Connaître les critères d'une évaluation scientifique motivée (rigueur méthodologique, originalité, validité des résultats)."
        ],
        "objectifs": [
          "Délimiter votre périmètre : émettre un avis scientifique sur les documents de votre seule institution, sans intervenir dans le cycle documentaire (codification, publication, archivage, rejet).",
          "Localiser un document à expertiser via « Explorer » ou « Documents » en utilisant la recherche et les filtres (« Tous les types », « Toutes collections », « Tous domaines », « Tout accès »).",
          "Examiner un document en lisant son « Résumé » et ses « Métadonnées », en le consultant en texte intégral via « Consulter » et, si le téléchargement est autorisé, en le téléchargeant.",
          "Émettre un avis scientifique « Favorable » ou « Réservé » depuis l'encadré « Validation documentaire », via le bouton « Avis scientifique », assorti d'un « Commentaire » motivé, puis « Enregistrer l'avis ».",
          "Vérifier l'enregistrement de votre avis dans la rubrique « Historique & avis » du document et le situer parmi les avis des autres relecteurs.",
          "Distinguer les actions ouvertes à votre rôle de celles qui ne le sont pas (déposer un document, valider une réservation de ressource, réserver ou emprunter un document)."
        ],
        "competences": [
          "Conduire une expertise scientifique structurée d'un mémoire, d'un article ou d'un rapport au sein d'une bibliothèque numérique.",
          "Formuler un avis argumenté (« Favorable » ou « Réservé ») accompagné d'un « Commentaire » scientifique clair et utile aux auteurs.",
          "Exploiter les outils de consultation en ligne (lecture filigranée via « Consulter ») et de téléchargement pour une relecture approfondie.",
          "Situer son rôle d'expert dans la chaîne de validation et coopérer avec le documentaliste sans empiéter sur le contrôle documentaire.",
          "Assurer la traçabilité et la déontologie de l'avis émis (avis daté, nominatif, consultable dans l'« Historique & avis »)."
        ],
        "atelier": [
          "Cadrage du périmètre : repérer dans la barre latérale les seules sections accessibles (« Principal » ; « Bibliothèque » : « Bibliothèque », « Explorer », « Documents » ; « Aide ») et constater l'absence des menus de gestion documentaire.",
          "Rechercher un document à expertiser via « Explorer » à l'aide de la barre de recherche (« Titre, auteur, mot-clé, code… ») et des filtres, puis ouvrir sa fiche.",
          "Examiner le document : lire le « Résumé » et les « Métadonnées », cliquer sur « Consulter » pour le lire en texte intégral, puis « Télécharger » si le téléchargement est autorisé.",
          "Émettre un avis : dans l'encadré « Validation documentaire », cliquer sur « Avis scientifique », choisir « Favorable » ou « Réservé », rédiger un « Commentaire » motivé, puis cliquer sur « Enregistrer l'avis ».",
          "Vérifier que l'avis apparaît dans l'« Historique & avis » sous la mention « Avis scientifique favorable » ou « Avis scientifique réservé », à votre nom et daté.",
          "Sécuriser son compte via « Mon compte » (« Changer mon mot de passe ») et localiser son guide dans le « Centre d'aide » (« Télécharger en PDF »)."
        ],
        "evaluation": [
          "Mise en situation : sélectionner un document de son institution, l'examiner intégralement et émettre un avis scientifique motivé (« Favorable » ou « Réservé ») — critère : avis correctement enregistré et visible dans l'« Historique & avis ».",
          "Contrôle de compréhension : distinguer l'expertise scientifique du contrôle documentaire et énumérer les actions du cycle documentaire qui ne relèvent PAS du validateur scientifique (codification, publication, archivage, rejet).",
          "Évaluation de la qualité du commentaire : produire un « Commentaire » argumenté, précis et exploitable par les auteurs et le documentaliste.",
          "Démonstration : retrouver, dans l'« Historique & avis » d'un document, son propre avis parmi ceux d'autres relecteurs.",
          "Auto-évaluation : confirmer que l'avis ne peut porter que sur les documents de sa propre institution (règle du contrôle d'accès de la plateforme)."
        ]
      },
      {
        "roleKey": "READER",
        "duree": "2 heures : 45 min de présentation, 1 h 15 d'atelier pratique de consultation et de réservation.",
        "prerequis": [
          "Disposer d'un compte actif portant le rôle « Lecteur interne » et avoir changé le mot de passe initial « password123 ».",
          "Savoir se connecter à l'application et naviguer dans la barre latérale (sections « Principal », « Bibliothèque », « Aide »).",
          "Pour les étudiants de l'ENS d'Abidjan : connaître son matricule (par exemple « 23-B-P17498IPS/SP ») tel qu'enregistré sur son compte pour bénéficier de la gratuité de téléchargement.",
          "Disposer d'une connexion adaptée à la consultation en ligne des documents (lecture seule filigranée, impression et copie désactivées).",
          "Comprendre les niveaux d'accès d'un document (« Public », « Interne », « Restreint », etc.) et leurs conséquences sur la consultation et le téléchargement."
        ],
        "objectifs": [
          "Explorer le catalogue de la bibliothèque numérique depuis « Explorer » et filtrer les résultats par type, collection, domaine et niveau d'accès.",
          "Consulter un document en ligne via « Consulter », en « Consultation en lecture seule » filigranée à votre nom et à votre e-mail, lorsque la consultation est autorisée.",
          "Télécharger un document gratuit via « Télécharger », ou régler un téléchargement payant via « Payer et débloquer » (paiement simulé), et utiliser, à l'ENS d'Abidjan, la gratuité par saisie du matricule.",
          "Demander l'accès à un document « Restreint » via « Demander l'accès » en précisant un « Motif / note », la demande étant transmise au documentaliste.",
          "Réserver un exemplaire physique via « Réserver / Emprunter » (« Consultation sur place » ou « Emprunt physique ») et suivre l'état de vos demandes dans « Réservations doc. ».",
          "Sécuriser votre compte depuis « Mon compte » et vous entraîner sur l'espace « Sport cérébral », y compris rejoindre une compétition à l'aide d'un code de session."
        ],
        "competences": [
          "Rechercher efficacement un document dans un catalogue numérique à l'aide de la recherche plein texte et des filtres.",
          "Exploiter les modes d'accès d'un document (consultation en ligne filigranée, téléchargement libre ou payant, demande d'accès) dans le respect de ses droits.",
          "Gérer ses demandes documentaires (accès restreint, emprunt physique, consultation sur place) et en suivre l'avancement de façon autonome.",
          "Citer correctement un document à partir de l'encadré « Citer ce document » de sa fiche.",
          "Maintenir la sécurité de son compte et utiliser l'espace public « Sport cérébral »."
        ],
        "atelier": [
          "Explorer le catalogue depuis « Explorer » : lancer une recherche, appliquer les filtres (« Tous les types », « Toutes collections », « Tous domaines », « Tout accès ») et lire le compteur « N document(s) ».",
          "Ouvrir la fiche d'un document, parcourir son en-tête, son « Résumé », ses « Métadonnées », ses « Mots-clés » et l'encadré « Citer ce document », puis cliquer sur « Consulter » pour le lire en « Consultation en lecture seule » (filigrane).",
          "Télécharger un document : utiliser « Télécharger » pour un document libre, puis simuler un achat via « Payer et débloquer » et, à l'ENS d'Abidjan, saisir un matricule dans l'encadré « Étudiant de l'ENS d'Abidjan ? ».",
          "Demander l'accès à un document « Restreint » via « Demander l'accès », renseigner le « Motif / note » et obtenir le message « Votre demande a été transmise au documentaliste. ».",
          "Réserver un exemplaire physique via « Réserver / Emprunter » (« Consultation sur place » ou « Emprunt physique »), envoyer la demande via « Envoyer la demande » et la retrouver dans « Réservations doc. ».",
          "Sécuriser son compte via « Mon compte » (« Changer mon mot de passe ») et rejoindre une compétition « Sport cérébral » en saisissant un code de session dans le champ « CODE »."
        ],
        "evaluation": [
          "Évaluation pratique : retrouver un document précis via « Explorer » et ses filtres, ouvrir sa fiche et le consulter en ligne via « Consulter » (critère : document trouvé et lecture seule ouverte).",
          "Mise en situation : télécharger un document libre, puis décrire la procédure de téléchargement payant (« Payer et débloquer ») et de gratuité par matricule à l'ENS d'Abidjan.",
          "Démonstration : émettre une demande d'accès à un document « Restreint » avec un « Motif / note » pertinent, jusqu'au message « Votre demande a été transmise au documentaliste. ».",
          "Mise en situation : réserver un exemplaire physique (« Consultation sur place » ou « Emprunt physique ») et localiser la demande dans « Réservations doc. ».",
          "Contrôle de compréhension : expliquer les contraintes de la « Consultation en lecture seule » (filigrane au nom et à l'e-mail, impression et copie désactivées) et la différence entre un document « Restreint » (visible, accès sur demande) et un document « Confidentiel » (invisible au catalogue)."
        ]
      }
    ]
  },
  "qcm": {
    "banques": [
      {
        "theme": "Tronc commun & navigation",
        "questions": [
          {
            "enonce": "Quel est le mot de passe initial attribué à tout compte créé sur EduWeb Booking, qu'il soit créé un par un ou importé par CSV ?",
            "options": [
              "motdepasse",
              "password123",
              "eduweb2024",
              "admin123"
            ],
            "bonneReponse": 1,
            "justification": "Les guides indiquent que le compte se connecte avec le mot de passe par défaut « password123 », à changer à la première connexion (lib/guides.ts, ORG_ADMIN et SUPER_ADMIN)."
          },
          {
            "enonce": "Dans la barre latérale, à quelle section appartiennent les entrées « Tableau de bord », « Sport cérébral » et « Mon compte » ?",
            "options": [
              "« Gestion »",
              "« Administration »",
              "« Principal »",
              "« Aide »"
            ],
            "bonneReponse": 2,
            "justification": "La section « Principal » regroupe « Accueil », « Tableau de bord », « Calendrier », « Salles multimédias », « Mes réservations », « Sport cérébral » et « Mon compte » (components/dashboard/nav-config.tsx, NAV_SECTIONS « Principal »)."
          },
          {
            "enonce": "Pour changer son mot de passe, quelle longueur minimale le nouveau mot de passe doit-il respecter ?",
            "options": [
              "6 caractères",
              "8 caractères",
              "10 caractères",
              "12 caractères"
            ],
            "bonneReponse": 1,
            "justification": "Tous les guides précisent un « Nouveau mot de passe » d'au moins 8 caractères avant de cliquer sur « Mettre à jour le mot de passe » (lib/guides.ts)."
          },
          {
            "enonce": "Quelle section de la barre latérale est réservée au super administrateur et invisible pour un administrateur d'organisation ?",
            "options": [
              "« Bibliothèque »",
              "« Gestion »",
              "« Plateforme »",
              "« Administration »"
            ],
            "bonneReponse": 2,
            "justification": "La section « Plateforme » (« Supervision EduWeb », « Gouvernement & ministères », « Établissements », « Réglages des jeux ») exige la permission platform.manage, attribuée au seul SUPER_ADMIN (components/dashboard/nav-config.tsx ; lib/permissions.ts)."
          },
          {
            "enonce": "Où l'utilisateur retrouve-t-il les décisions de validation et autres messages, signalés par un badge indiquant le nombre de notifications « non lue(s) » ?",
            "options": [
              "Dans « Support »",
              "Dans la cloche de notifications en haut à droite",
              "Dans « Centre d'aide »",
              "Dans « Statistiques »"
            ],
            "bonneReponse": 1,
            "justification": "Le guide du demandeur invite à surveiller la cloche de notifications en haut à droite, qui signale les décisions de validation et autres messages avec un badge indiquant le nombre de notifications « non lue(s) » (lib/guides.ts, REQUESTER)."
          },
          {
            "enonce": "Où l'utilisateur peut-il relire le guide propre à son rôle et le « Télécharger en PDF » ?",
            "options": [
              "Dans « Mon compte »",
              "Dans le « Tableau de bord »",
              "Dans le « Centre d'aide » (section « Aide »)",
              "Dans « Paramètres »"
            ],
            "bonneReponse": 2,
            "justification": "Les guides renvoient au « Centre d'aide » de la section « Aide », qui affiche le guide du rôle et propose « Télécharger en PDF » (lib/guides.ts ; components/dashboard/nav-config.tsx, section « Aide »)."
          }
        ]
      },
      {
        "theme": "Réservation de ressources",
        "questions": [
          {
            "enonce": "Combien d'étapes comporte l'assistant de réservation d'une ressource pour le demandeur ?",
            "options": [
              "Quatre étapes",
              "Cinq étapes",
              "Six étapes",
              "Sept étapes"
            ],
            "bonneReponse": 2,
            "justification": "Le guide du demandeur décrit un assistant en six étapes : « Catégorie », « Ressource », « Motif », « Créneau », « Détails » et « Confirmation » (lib/guides.ts, REQUESTER)."
          },
          {
            "enonce": "À l'étape « Motif » de la demande de réservation, quel champ est le seul réellement obligatoire ?",
            "options": [
              "L'« Intitulé »",
              "Le « Type d'usage »",
              "L'« Effectif / participants »",
              "Le « Motif »"
            ],
            "bonneReponse": 3,
            "justification": "Le guide précise que, parmi « Intitulé », « Type d'usage », « Effectif / participants » et « Motif », « seul le Motif est obligatoire » (lib/guides.ts, REQUESTER)."
          },
          {
            "enonce": "Sur le plan d'une salle multimédia, que signale un poste affiché en rouge ?",
            "options": [
              "Un poste réservé au technicien",
              "Un poste libre, disponible à la réservation",
              "Un poste occupé",
              "Un poste en panne"
            ],
            "bonneReponse": 2,
            "justification": "Le plan des postes affiche en temps réel les postes verts (libres) et les postes rouges (occupés) (lib/guides.ts, REQUESTER et RESOURCE_MANAGER)."
          },
          {
            "enonce": "Lorsqu'un validateur refuse une demande, quelle action est requise dans la fenêtre « Refuser la demande » ?",
            "options": [
              "Renseigner le « Motif du refus » puis cliquer sur « Confirmer le refus »",
              "Cliquer directement sur « Approuver »",
              "Saisir un nouveau créneau",
              "Choisir une autre ressource"
            ],
            "bonneReponse": 0,
            "justification": "Le guide du validateur indique de renseigner le champ obligatoire « Motif du refus » puis de cliquer sur « Confirmer le refus » ; le motif est communiqué au demandeur (lib/guides.ts, VALIDATOR)."
          },
          {
            "enonce": "Quel rôle peut créer et modifier des ressources mais ne peut pas les supprimer ?",
            "options": [
              "Le « Validateur hiérarchique »",
              "Le « Responsable de ressource »",
              "Le « Technicien / agent d'appui »",
              "L'« Utilisateur demandeur »"
            ],
            "bonneReponse": 1,
            "justification": "Le RESOURCE_MANAGER détient resources.create, resources.read et resources.update, mais pas resources.delete (lib/permissions.ts) ; le guide confirme que la suppression d'une ressource relève de l'administrateur (lib/guides.ts, RESOURCE_MANAGER)."
          },
          {
            "enonce": "Pour rendre une ressource non réservable, quels statuts le responsable peut-il choisir dans la section « Capacité & disponibilité » ?",
            "options": [
              "« Réservée » ou « Archivée »",
              "« Disponible » ou « Partiellement disponible »",
              "« En maintenance », « Hors service » ou « Indisponible »",
              "« Soumise » ou « Validée »"
            ],
            "bonneReponse": 2,
            "justification": "Le guide du responsable indique de régler le « Statut » sur « En maintenance », « Hors service » ou « Indisponible » pour bloquer la réservation (lib/guides.ts, RESOURCE_MANAGER ; libellés dans lib/enums.ts, RESOURCE_STATUS_META)."
          }
        ]
      },
      {
        "theme": "Bibliothèque numérique",
        "questions": [
          {
            "enonce": "Combien d'étapes comporte l'assistant de dépôt d'un document dans la bibliothèque ?",
            "options": [
              "Cinq étapes",
              "Six étapes",
              "Sept étapes",
              "Huit étapes"
            ],
            "bonneReponse": 2,
            "justification": "L'assistant de dépôt comporte sept étapes : « Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits » et « Vérification » (lib/guides.ts, REQUESTER et DEPOSITOR)."
          },
          {
            "enonce": "À la validation d'un dépôt par le bibliothécaire, qu'advient-il du code provisoire ?",
            "options": [
              "Il est supprimé sans remplacement",
              "Un code documentaire définitif est généré",
              "Il reste inchangé jusqu'à l'archivage",
              "Le déposant doit le saisir manuellement"
            ],
            "bonneReponse": 1,
            "justification": "Le guide du bibliothécaire précise qu'à la validation « un code documentaire définitif est alors généré », remplaçant le code provisoire (lib/guides.ts, LIBRARIAN et DEPOSITOR)."
          },
          {
            "enonce": "Quel rôle peut émettre un avis scientifique « Favorable » ou « Réservé » sur un document de son institution ?",
            "options": [
              "Le « Bibliothécaire / Documentaliste »",
              "Le « Déposant »",
              "Le « Validateur scientifique »",
              "Le « Lecteur interne »"
            ],
            "bonneReponse": 2,
            "justification": "Le SCIENTIFIC_VALIDATOR détient documents.science_review et émet un avis « Favorable » ou « Réservé » via le bouton « Avis scientifique » (lib/permissions.ts ; lib/guides.ts, SCIENTIFIC_VALIDATOR)."
          },
          {
            "enonce": "Lorsqu'une demande d'emprunt physique est approuvée par le bibliothécaire, quelle échéance de retour est automatiquement fixée ?",
            "options": [
              "7 jours",
              "14 jours",
              "21 jours",
              "30 jours"
            ],
            "bonneReponse": 1,
            "justification": "Le guide du bibliothécaire indique qu'une demande d'emprunt approuvée crée un prêt avec une échéance de retour fixée à 14 jours (lib/guides.ts, LIBRARIAN)."
          },
          {
            "enonce": "Pour un document payant, quel bouton un usager active-t-il pour obtenir le droit de téléchargement (paiement simulé de démonstration) ?",
            "options": [
              "« Demander l'accès »",
              "« Payer et débloquer »",
              "« Réserver / Emprunter »",
              "« Consulter »"
            ],
            "bonneReponse": 1,
            "justification": "Les guides précisent que, pour un téléchargement payant, l'usager clique sur « Payer et débloquer » (paiement simulé de démonstration) (lib/guides.ts, REQUESTER, LIBRARIAN et READER)."
          },
          {
            "enonce": "À l'ENS d'Abidjan, comment un étudiant peut-il télécharger gratuitement un document payant ?",
            "options": [
              "En contactant le support par e-mail",
              "En saisissant son matricule dans le bloc « Étudiant de l'ENS d'Abidjan ? » puis en cliquant sur « Télécharger »",
              "En demandant l'accès au validateur scientifique",
              "En attendant la levée de l'embargo"
            ],
            "bonneReponse": 1,
            "justification": "Les guides indiquent de saisir son matricule dans le bloc « Étudiant de l'ENS d'Abidjan ? » puis de cliquer sur « Télécharger » pour un accès gratuit ; le matricule saisi doit correspondre à celui enregistré sur le compte (lib/guides.ts, REQUESTER, LIBRARIAN et READER)."
          }
        ]
      },
      {
        "theme": "Administration & plateforme",
        "questions": [
          {
            "enonce": "Dans la hiérarchie d'EduWeb Booking, quel est l'ordre correct de la structure institutionnelle ?",
            "options": [
              "Établissements → Ministères → Gouvernement",
              "Gouvernement → Ministères → Établissements",
              "Ministères → Gouvernement → Établissements",
              "Gouvernement → Établissements → Ministères"
            ],
            "bonneReponse": 1,
            "justification": "La plateforme est multi-établissements selon la hiérarchie Gouvernement → Ministères → Établissements, gérée depuis la section « Plateforme » (« Gouvernement & ministères », « Établissements ») (components/dashboard/nav-config.tsx ; lib/guides.ts, SUPER_ADMIN)."
          },
          {
            "enonce": "Quelles formules d'abonnement le super administrateur peut-il attribuer à un établissement ?",
            "options": [
              "Gratuit, Pro, Entreprise",
              "Bronze, Argent, Or, Platine",
              "Pilote, Standard, Premium, National",
              "Essai, Mensuel, Annuel"
            ],
            "bonneReponse": 2,
            "justification": "Les formules sont Pilote, Standard, Premium et National (lib/enums.ts, PLAN_LABELS ; lib/guides.ts, SUPER_ADMIN, gestion des abonnements)."
          },
          {
            "enonce": "Quels statuts d'abonnement un établissement peut-il prendre ?",
            "options": [
              "Actif, Suspendu ou Résilié",
              "Ouvert, Fermé ou En pause",
              "Validé, Refusé ou En attente",
              "Public, Privé ou Interne"
            ],
            "bonneReponse": 0,
            "justification": "Le « Statut abonnement » se règle sur Actif, Suspendu ou Résilié ; l'accès complet, notamment à tous les jeux, est réservé aux abonnements « Actif » (lib/guides.ts, SUPER_ADMIN)."
          },
          {
            "enonce": "Comment le super administrateur agit-il comme administrateur d'un établissement donné ?",
            "options": [
              "En se déconnectant puis en recréant un compte",
              "En utilisant le sélecteur d'institution en haut de l'écran (sur ordinateur)",
              "En modifiant le fichier CSV d'import",
              "En supprimant l'établissement puis en le recréant"
            ],
            "bonneReponse": 1,
            "justification": "Le guide indique d'ouvrir le menu déroulant des institutions (sélecteur d'institution, en haut de l'écran, sur ordinateur) pour basculer tout le contexte de travail vers l'établissement choisi (lib/guides.ts, SUPER_ADMIN)."
          },
          {
            "enonce": "Dans « Demandes de comptes », quelles décisions un administrateur d'organisation peut-il prendre sur une demande ?",
            "options": [
              "« Approuver » ou « Reporter »",
              "« Valider » ou « Refuser »",
              "« Publier » ou « Archiver »",
              "« Suspendre » ou « Réactiver »"
            ],
            "bonneReponse": 1,
            "justification": "Le guide ORG_ADMIN indique de cliquer sur « Valider » pour activer le compte, ou sur « Refuser » puis « Refuser la demande » pour la supprimer (lib/guides.ts, ORG_ADMIN)."
          },
          {
            "enonce": "Comment la page « Rôles & permissions » est-elle présentée à l'administrateur d'organisation ?",
            "options": [
              "En mode édition libre",
              "En lecture seule (matrice des droits)",
              "Uniquement pour le super administrateur",
              "Sous forme de fichier CSV à importer"
            ],
            "bonneReponse": 1,
            "justification": "Le guide ORG_ADMIN précise que « Rôles & permissions » affiche la matrice des droits en lecture seule ; l'entrée de menu correspondante exige la permission roles.manage (lib/guides.ts, ORG_ADMIN ; components/dashboard/nav-config.tsx)."
          }
        ]
      },
      {
        "theme": "Sport cérébral & compétitions",
        "questions": [
          {
            "enonce": "Quels sont les trois niveaux de difficulté proposés pour les jeux du Sport cérébral ?",
            "options": [
              "Facile, Normal, Difficile",
              "Débutant, Intermédiaire, Avancé",
              "Bronze, Argent, Or",
              "Junior, Senior, Expert"
            ],
            "bonneReponse": 1,
            "justification": "Les libellés affichés des niveaux sont Débutant, Intermédiaire et Avancé (lib/games/catalog.ts, LEVELS ; lib/guides.ts)."
          },
          {
            "enonce": "Sur quel jeu repose le « Défis IA contre humain » de l'espace Sport cérébral ?",
            "options": [
              "Les échecs",
              "Le Morpion (tic-tac-toe)",
              "Le Sudoku",
              "Les dames"
            ],
            "bonneReponse": 1,
            "justification": "La consigne du jeu indique d'affronter l'IA au Morpion (tic-tac-toe) : le joueur tient les X et commence, l'IA étant imbattable au niveau Avancé (lib/games/catalog.ts, slug defis-ia)."
          },
          {
            "enonce": "Pour rejoindre une compétition organisée, que doit faire le compétiteur sur l'accueil du Sport cérébral ?",
            "options": [
              "Saisir le code de session dans le champ « CODE » de l'encart « Compétition » puis cliquer sur « Rejoindre »",
              "Créer une nouvelle compétition",
              "Télécharger une application dédiée",
              "Demander l'accès au documentaliste"
            ],
            "bonneReponse": 0,
            "justification": "Les guides indiquent de repérer l'encadré « Compétition », de saisir le code dans le champ « CODE » puis de cliquer sur « Rejoindre » (lib/guides.ts, REQUESTER, VISITOR et READER)."
          },
          {
            "enonce": "Quels rôles peuvent organiser une compétition via le menu « Compétitions » ?",
            "options": [
              "Tous les utilisateurs connectés",
              "Le super administrateur et l'administrateur d'organisation",
              "Le validateur scientifique et le lecteur",
              "Le déposant et le bibliothécaire"
            ],
            "bonneReponse": 1,
            "justification": "L'entrée de menu « Compétitions » exige la permission platform.manage ou organization.manage, détenues respectivement par le SUPER_ADMIN et l'ORG_ADMIN (components/dashboard/nav-config.tsx ; lib/permissions.ts ; lib/guides.ts)."
          },
          {
            "enonce": "Quelle est la séquence de pilotage de l'état d'une compétition par l'organisateur ?",
            "options": [
              "« Démarrer », « Ouvrir (inscriptions) », « Clore »",
              "« Ouvrir (inscriptions) », « Démarrer », « Clore »",
              "« Clore », « Démarrer », « Ouvrir (inscriptions) »",
              "« Publier », « Masquer », « Archiver »"
            ],
            "bonneReponse": 1,
            "justification": "Le guide pilote l'état avec « Ouvrir (inscriptions) », « Démarrer » puis « Clore » (un bouton « Supprimer » permet de retirer la compétition) (lib/guides.ts, SUPER_ADMIN et ORG_ADMIN)."
          },
          {
            "enonce": "Qui peut accéder à la « Banque de questions » et aux « Réglages des jeux » du Sport cérébral ?",
            "options": [
              "Le super administrateur uniquement",
              "Tout administrateur d'organisation",
              "Le responsable de ressource",
              "Tout utilisateur demandeur"
            ],
            "bonneReponse": 0,
            "justification": "Le guide précise que la « Banque de questions » et les « Réglages des jeux » relèvent du super administrateur et ne sont pas accessibles à l'administrateur d'organisation ; « Réglages des jeux » exige d'ailleurs la permission platform.manage (lib/guides.ts, ORG_ADMIN et SUPER_ADMIN ; components/dashboard/nav-config.tsx)."
          }
        ]
      },
      {
        "theme": "CERTEL — formation certifiante",
        "questions": [
          {
            "enonce": "Comment un utilisateur connecté accède-t-il à la formation certifiante au numérique et à l'intelligence artificielle ?",
            "options": [
              "Uniquement sur invitation du super administrateur",
              "Par l'entrée « Formation CERTEL » de la section « Principal » du tableau de bord, ou par le menu public « CERTEL »",
              "Par la section « Plateforme », réservée à l'administration",
              "En important un fichier CSV depuis « Administration »"
            ],
            "bonneReponse": 1,
            "justification": "L'entrée « Formation CERTEL » (href /certel) figure dans la section « Principal » de la barre latérale ; la formation est également ouverte depuis le menu public « CERTEL » (components/dashboard/nav-config.tsx, NAV_SECTIONS « Principal »)."
          },
          {
            "enonce": "Comment est structuré le parcours interactif de CERTEL ?",
            "options": [
              "Un module unique commun à tous",
              "Trois niveaux comportant chacun six modules",
              "Six niveaux d'un module chacun",
              "Deux niveaux de douze modules"
            ],
            "bonneReponse": 1,
            "justification": "CERTEL propose trois niveaux interactifs (N1, N2, N3), chacun composé de six modules de leçons illustrées (lib/certel/pricing.ts, CERTEL_LEVELS ; lib/certel/niveau1 à niveau3, six modules par niveau)."
          },
          {
            "enonce": "Dans l'évaluation certifiante d'un niveau, à quel moment les corrigés de l'examen de connaissances s'affichent-ils ?",
            "options": [
              "Immédiatement après chaque question",
              "À la fin de l'examen (mode sommatif)",
              "Jamais, seul le score est communiqué",
              "Uniquement sur demande au super administrateur"
            ],
            "bonneReponse": 1,
            "justification": "Les examens des évaluations certifiantes sont sommatifs : à la fin de l'examen, le score et les bonnes réponses commentées sont affichés, tandis que les exercices de module sont formatifs, à vérification immédiate (app/dashboard/platform/evaluations/page.tsx ; lib/certel/evaluation)."
          },
          {
            "enonce": "Sous quelle forme est délivré le certificat de réussite CERTEL ?",
            "options": [
              "Un fichier PDF au format A4 paysage",
              "Une simple page web non imprimable",
              "Un fichier Excel",
              "Un badge affiché uniquement dans le profil"
            ],
            "bonneReponse": 0,
            "justification": "Le certificat de réussite s'imprime automatiquement en A4 paysage et s'enregistre au format PDF depuis la fenêtre d'impression (components/certel/n1/certificate-view.tsx)."
          },
          {
            "enonce": "Quels moyens de paiement sont proposés pour l'inscription payante à un niveau CERTEL ?",
            "options": [
              "Chèque ou virement bancaire uniquement",
              "Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money) ou carte bancaire (Visa / Mastercard)",
              "Espèces remises au formateur",
              "Aucun : l'accès est toujours payant en interne"
            ],
            "bonneReponse": 1,
            "justification": "L'inscription accepte le Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money) et la carte bancaire (Visa / Mastercard) via CinetPay (components/certel/payment-operators.tsx, PAYMENT_OPERATORS)."
          },
          {
            "enonce": "Qui règle les tarifs, les remises et le comportement des évaluations, et accède à toute la formation sans paiement ?",
            "options": [
              "Chaque utilisateur, pour son propre compte",
              "L'administrateur d'organisation, dans son établissement",
              "Le super administrateur",
              "Le responsable de ressource"
            ],
            "bonneReponse": 2,
            "justification": "Le super administrateur fixe les tarifs et remises (« Tarifs CERTEL ») et le comportement formatif/sommatif des évaluations (« Évaluations ») ; un niveau reste gratuit tant qu'aucun prix n'est défini (montant 0) et le super administrateur accède à tout sans paiement (lib/certel/pricing.ts ; app/dashboard/platform/certel-tarifs et evaluations)."
          }
        ]
      }
    ]
  },
  "annexes": {
    "importCsv": [
      {
        "fichier": "Établissements — modèle obtenu via le lien « Télécharger le modèle CSV » (carte « Import par CSV (cohorte d'établissements) », page « Plateforme » › « Établissements »). Nom de fichier généré : modele-import-etablissements-eduweb.csv. Encodage UTF-8 (avec BOM Excel), séparateur « , ».",
        "colonnes": [
          "nom — Nom complet de l'établissement (obligatoire). Ex. : « Université Félix Houphouët-Boigny ».",
          "sigle — Sigle / acronyme (obligatoire ; mis automatiquement en majuscules). Ex. : « UFHB ».",
          "slug — Identifiant technique (facultatif) ; s'il est laissé vide, il est généré automatiquement à partir du sigle ou du nom.",
          "ville — Ville de l'établissement. Ex. : « Abidjan ».",
          "ministere — Ministère de tutelle, reconnu par son sigle ou son nom (ex. « MESRS ») ; une valeur vide laisse l'établissement sans tutelle.",
          "formule — Formule d'abonnement : PILOTE, STANDARD, PREMIUM ou NATIONAL (une valeur vide ou inconnue donne STANDARD).",
          "sieges — Nombre de « Comptes autorisés » (entier ; valeur par défaut 100 si vide).",
          "admin_prenom — Prénom de l'administrateur de l'établissement (obligatoire).",
          "admin_nom — Nom de l'administrateur de l'établissement (obligatoire).",
          "admin_email — Adresse e-mail de l'administrateur (obligatoire ; sert d'identifiant de connexion et doit être unique)."
        ],
        "etapes": [
          "Ouvrez « Plateforme » › « Établissements » (action réservée au super administrateur).",
          "Dans la carte « Import par CSV (cohorte d'établissements) », cliquez sur « Télécharger le modèle CSV » et complétez les colonnes attendues (nom, sigle, slug, ville, ministere, formule, sieges, admin_prenom, admin_nom, admin_email).",
          "Glissez-déposez votre fichier dans la zone « Glissez-déposez ou choisissez un fichier CSV », ou cliquez pour le sélectionner.",
          "Cliquez sur « Importer ».",
          "Lisez le bandeau de confirmation « X établissement(s) importé(s) » ; les lignes en doublon (nom, identifiant ou e-mail déjà existant) ou à champ obligatoire manquant sont comptabilisées comme « ignoré(s) (doublon ou champ manquant) ».",
          "Chaque établissement importé est créé complet (compte administrateur, rôles et bibliothèque) ; l'administrateur se connecte avec le mot de passe initial « password123 », à changer à la première connexion."
        ]
      },
      {
        "fichier": "Ministères — modèle obtenu via le lien « Modèle CSV » de la carte « Nouveau ministère » (page « Plateforme » › « Gouvernement & ministères »). Le modèle est pré-rempli selon le pays du gouvernement enregistré lorsque sa liste est connue (le lien affiche alors la mention « pré-rempli » suivie du pays). Nom de fichier généré : modele-ministeres-<pays>-eduweb.csv. Encodage UTF-8 (avec BOM Excel), séparateur « , ».",
        "colonnes": [
          "nom — Intitulé complet du ministère (obligatoire ; au moins 2 caractères). Ex. : « Ministère de l'Enseignement Supérieur et de la Recherche Scientifique ». La valeur est entourée de guillemets dans le modèle, car elle contient souvent une virgule.",
          "sigle — Sigle du ministère (facultatif ; mis automatiquement en majuscules). Ex. : « MESRS »."
        ],
        "etapes": [
          "Enregistrez d'abord le gouvernement (carte « Gouvernement ») : les ministères ne peuvent être ajoutés qu'ensuite.",
          "Dans la carte « Nouveau ministère », cliquez sur le lien « Modèle CSV » (suivi de la mention « pré-rempli » et du pays lorsque la liste est connue) et complétez les colonnes nom et sigle.",
          "Glissez-déposez votre fichier dans la zone « Glissez-déposez un CSV » (indication « Colonnes : nom, sigle »).",
          "Cliquez sur « Importer les ministères ».",
          "Vérifiez le bandeau « X ministère(s) importé(s) » ; les doublons et les lignes vides sont comptabilisés comme « ignoré(s) (doublon ou vide) ».",
          "Astuce : pour la Côte d'Ivoire, le bouton « Ministères de Côte d'Ivoire » pré-remplit directement la liste sans passer par un fichier CSV."
        ]
      },
      {
        "fichier": "Utilisateurs (cohorte) — modèle obtenu via le bouton « Télécharger le modèle CSV » (carte « Import par cohorte (CSV) », page « Administration » › « Utilisateurs »). Nom de fichier généré : modele-import-comptes-eduweb.csv. Encodage UTF-8 (avec BOM Excel), séparateur « , ».",
        "colonnes": [
          "prenom — Prénom de l'utilisateur (obligatoire).",
          "nom — Nom de l'utilisateur (obligatoire).",
          "email — Adresse e-mail (obligatoire ; sert d'identifiant et doit être unique).",
          "fonction — Fonction ou poste (facultatif). Ex. : « Enseignante », « Responsable des salles ».",
          "role — Rôle attribué : clé du rôle (ex. RESOURCE_MANAGER) ou son libellé (ex. « Responsable de ressource ») ; une valeur vide ou inconnue donne le rôle « Demandeur », et la clé SUPER_ADMIN est refusée.",
          "matricule — Matricule étudiant (facultatif ; surtout pour le rôle « Lecteur »). Ex. : « 23-B-P17498IPS/SP »."
        ],
        "etapes": [
          "Ouvrez « Administration » › « Utilisateurs ».",
          "Dans la carte « Import par cohorte (CSV) », cliquez sur « Télécharger le modèle CSV » et complétez les colonnes prenom, nom, email, fonction, role, matricule.",
          "Glissez-déposez votre fichier dans la zone « Glissez-déposez ou choisissez un fichier CSV » (indication « Colonnes : prenom, nom, email, fonction, role, matricule ») ; l'encart « Valeurs « role » acceptées » rappelle les clés admises.",
          "Cliquez sur « Importer ».",
          "Lisez le compte-rendu : « X compte(s) créé(s) », le nombre de comptes « ignoré(s) » (e-mail manquant ou invalide, prénom/nom manquant, doublon dans le fichier ou compte déjà existant) et la liste des erreurs détaillées ligne par ligne.",
          "Les comptes importés sont créés actifs avec le mot de passe par défaut « password123 », à changer à la première connexion."
        ]
      }
    ],
    "motDePasse": [
      {
        "scenario": "Self-service : l'utilisateur change lui-même son mot de passe depuis « Mon compte » (procédure recommandée à la première connexion pour remplacer « password123 »).",
        "etapes": [
          "Dans la barre latérale, section « Principal », ouvrez « Mon compte ».",
          "Repérez la carte « Changer mon mot de passe ».",
          "Saisissez le « Mot de passe actuel » (à la première connexion : « password123 »).",
          "Saisissez le « Nouveau mot de passe » (au moins 8 caractères) puis « Confirmer le nouveau mot de passe ».",
          "Cliquez sur « Mettre à jour le mot de passe » ; le message « Mot de passe modifié avec succès. » confirme l'opération."
        ]
      },
      {
        "scenario": "Réinitialisation par un administrateur : l'administrateur d'organisation (ou le super administrateur travaillant dans le contexte d'un établissement) remet le mot de passe d'un compte à la valeur par défaut « password123 ».",
        "etapes": [
          "Ouvrez « Administration » › « Utilisateurs ».",
          "Repérez la ligne de l'utilisateur concerné dans la liste des comptes.",
          "Cliquez sur l'icône de réinitialisation (icône clé, infobulle « Réinitialiser le mot de passe (password123) ») sur cette ligne : le mot de passe est ramené à « password123 ».",
          "Lisez le bandeau de confirmation « Mot de passe de <e-mail> réinitialisé à password123 (à changer à la première connexion). », puis communiquez « password123 » à l'utilisateur et invitez-le à le changer immédiatement via « Mon compte ».",
          "Remarque : cette action (comme la suspension/réactivation) n'est pas proposée sur votre propre compte ni hors de votre établissement ; pour votre compte, utilisez « Mon compte » ou le script en ligne de commande."
        ]
      },
      {
        "scenario": "Script en ligne de commande « npm run set-password » : réservé à l'administration technique, en local, pour fixer le mot de passe de n'importe quel compte (utile en dépannage, ou pour le super administrateur). Agit sur la base définie par DATABASE_URL.",
        "etapes": [
          "Ouvrez un terminal à la racine du projet EduWeb Booking (le fichier .env doit contenir DATABASE_URL).",
          "Pour fixer un mot de passe précis : « npm run set-password -- <email> \"<nouveau-mot-de-passe>\" » (le mot de passe doit comporter au moins 8 caractères ; un avertissement s'affiche en dessous de 12).",
          "Pour générer un mot de passe fort automatiquement : « npm run set-password -- <email> » (sans mot de passe) ; le script affiche alors le mot de passe généré, à noter et à transmettre de façon sécurisée.",
          "Exemple : « npm run set-password -- elognezoro@gmail.com \"MonNouveauMotDePasse!2026\" ».",
          "Le script affiche « Mot de passe mis à jour avec succès. » suivi du nom et de l'e-mail du compte concerné ; il refuse l'opération (« Aucun utilisateur trouvé avec l'e-mail… ») si aucun compte ne correspond à l'e-mail."
        ]
      }
    ],
    "depannage": [
      {
        "probleme": "Une page affiche « Une erreur est survenue », ou un bouton « Enregistrer » reste sans effet.",
        "solution": "Rechargez la page : la base de données hébergée (Neon) peut être momentanément en veille et se réactive à la requête suivante. Si le problème persiste, reconnectez-vous, puis contactez le support à support@eduweb.ci."
      },
      {
        "probleme": "J'ai oublié mon mot de passe ou je n'arrive plus à me connecter.",
        "solution": "Demandez à un administrateur de votre établissement de réinitialiser votre mot de passe depuis « Administration » › « Utilisateurs » (icône clé) : il est remis à « password123 ». Connectez-vous avec « password123 », puis changez-le aussitôt via « Mon compte » › « Changer mon mot de passe »."
      },
      {
        "probleme": "Lors d'un import CSV d'utilisateurs, certains comptes sont « ignoré(s) ».",
        "solution": "Un compte est ignoré lorsque son e-mail est manquant ou invalide, lorsque le prénom ou le nom manque, lorsque l'e-mail apparaît en doublon dans le fichier, ou lorsqu'un compte existe déjà avec cet e-mail. Consultez la liste d'erreurs détaillée (ligne par ligne) affichée sous le compte-rendu « X compte(s) créé(s) », corrigez les lignes signalées, puis relancez l'import du fichier corrigé."
      },
      {
        "probleme": "À l'import d'établissements, le bandeau indique des établissements « ignoré(s) ».",
        "solution": "Les doublons (nom, identifiant ou e-mail d'administrateur déjà existants) et les lignes à champ obligatoire manquant (nom, sigle, admin_prenom, admin_nom ou admin_email) sont ignorés, comme l'indique la mention « ignoré(s) (doublon ou champ manquant) ». Vérifiez ces colonnes, ainsi que la valeur de ministere (reconnue par sigle ou nom), puis réimportez les lignes corrigées."
      },
      {
        "probleme": "Dans le CSV utilisateurs, le rôle attribué n'est pas celui attendu (tous les comptes deviennent « Demandeur »).",
        "solution": "La colonne role accepte soit la clé exacte (ex. RESOURCE_MANAGER), soit le libellé exact (ex. « Responsable de ressource »). Une valeur vide ou inconnue donne le rôle « Demandeur », et la clé SUPER_ADMIN est refusée. Vérifiez l'orthographe et utilisez de préférence la clé du rôle (rappelée dans l'encart « Valeurs « role » acceptées »)."
      },
      {
        "probleme": "Un nouvel établissement ne peut pas se voir ajouter de ministères, ou la liste des ministères est vide.",
        "solution": "Enregistrez d'abord le gouvernement (carte « Gouvernement », page « Gouvernement & ministères ») : tant qu'il n'existe pas, le message « Enregistrez d'abord le gouvernement ci-dessus pour pouvoir ajouter des ministères. » s'affiche. Vous pouvez ensuite utiliser « Ministères de Côte d'Ivoire » pour pré-remplir la liste, ou importer un CSV (colonnes nom, sigle)."
      },
      {
        "probleme": "Un établissement n'a plus accès à toutes les fonctionnalités (par ex. à tous les jeux du Sport cérébral).",
        "solution": "L'accès complet est réservé aux abonnements au statut « Actif ». Sur la fiche de l'établissement (« Plateforme » › « Établissements »), vérifiez le « Statut abonnement » : repassez-le à « Actif » (et non « Suspendu » ou « Résilié »), puis cliquez « Enregistrer ». Le bouton « Réactiver » rétablit également l'accès d'un établissement suspendu."
      },
      {
        "probleme": "Une réservation reste « En attente de validation ».",
        "solution": "Certaines ressources sont soumises à validation : la demande doit être approuvée par un responsable de ressource ou un validateur hiérarchique depuis « À valider ». Le demandeur est notifié de la décision par e-mail et via la cloche de notifications."
      },
      {
        "probleme": "Impossible de réduire le nombre de postes d'une salle multimédia.",
        "solution": "La plateforme refuse de descendre la capacité en dessous d'un poste déjà réservé. Un message précise alors le nombre minimum de postes à conserver ; attendez la libération des postes concernés ou choisissez une capacité supérieure ou égale à ce minimum."
      },
      {
        "probleme": "Je ne vois pas la section « Plateforme » (Supervision EduWeb, Gouvernement & ministères, Établissements, Réglages des jeux).",
        "solution": "Cette section et le sélecteur d'institution sont réservés au super administrateur (permission « platform.manage »). Les autres rôles n'y ont pas accès : adressez-vous au super administrateur EduWeb pour toute opération relevant de la plateforme."
      },
      {
        "probleme": "Le mot de passe « password123 » est-il sûr ?",
        "solution": "Non : il s'agit uniquement d'un mot de passe initial de démonstration. Tout utilisateur doit le remplacer dès la première connexion via « Mon compte » › « Changer mon mot de passe » (au moins 8 caractères). En administration technique, « npm run set-password » permet de générer un mot de passe fort."
      },
      {
        "probleme": "Comment s'inscrire à un niveau CERTEL, et que faire si le paiement échoue ou si l'accès n'est pas débloqué après avoir payé ?",
        "solution": "Ouvrez « Formation CERTEL » (tableau de bord › « Principal ») ou le menu public « CERTEL », puis la page d'inscription du niveau souhaité. Si un prix est défini, cliquez sur « Payer <montant> FCFA et m'inscrire » et réglez par Mobile Money (« Wave », « Orange Money », « MTN », « Moov ») ou « Carte » bancaire via CinetPay. L'accès aux modules s'ouvre dès le paiement confirmé (le bouton « Accéder aux modules » apparaît alors). Si le paiement n'aboutit pas, vérifiez votre solde/plafond et le numéro de l'opérateur, puis réessayez ; le compte n'est débité qu'en cas de confirmation. Si vous avez payé mais que l'accès reste bloqué, patientez quelques instants puis rechargez la page : le déblocage suit la notification de l'opérateur. Tant qu'aucun prix n'est fixé, le niveau est « actuellement gratuit » et accessible directement. Si le message « Le paiement en ligne est en cours d'activation » s'affiche (clés CinetPay non configurées), contactez l'administration : le super administrateur peut accorder l'accès manuellement depuis « Plateforme » › « Tarifs & inscriptions CERTEL »."
      },
      {
        "probleme": "Qui fixe les tarifs CERTEL, le comportement des évaluations, et le super administrateur doit-il payer pour accéder aux niveaux ?",
        "solution": "Le super administrateur règle tout depuis « Plateforme ». Sur « Tarifs & inscriptions CERTEL » (« Tarifs & inscriptions CERTEL »), il définit le prix et la remise de chaque niveau (un prix à « 0 » laisse le niveau gratuit), suit les inscriptions et paiements, et peut accorder un accès manuellement (paiement hors-ligne ou bourse). Sur « Évaluations » (« Comportement des évaluations »), il choisit le fonctionnement appliqué à toute la plateforme : évaluations formatives à « vérification immédiate » (le corrigé commenté s'affiche après chaque réponse) et évaluations sommatives dont les « corrigés à la fin » ne sont rendus visibles qu'au terme de la série. Le super administrateur dispose d'un accès complet à tous les niveaux CERTEL, sans aucun paiement."
      }
    ],
    "ficheFormateur": {
      "deroule": [
        {
          "phase": "Accueil et objectifs",
          "duree": "15 min",
          "activite": "Présenter EduWeb Booking et ses trois volets (réservation de ressources, bibliothèque numérique, espace « Sport cérébral »), situer la hiérarchie Gouvernement › Ministères › Établissements et les abonnements (Pilote / Standard / Premium / National). Énoncer les objectifs de la session avec des verbes d'action (se connecter, paramétrer, réserver, valider, importer). Identifier le rôle de chaque participant parmi les 11 rôles."
        },
        {
          "phase": "Première connexion et sécurisation du compte",
          "duree": "20 min",
          "activite": "Faire connecter chaque participant, puis appliquer la procédure « Mon compte » › « Changer mon mot de passe » pour remplacer le mot de passe initial « password123 ». Faire repérer la cloche de notifications et le « Centre d'aide » (guide par rôle + « Télécharger en PDF »)."
        },
        {
          "phase": "Démonstration guidée par rôle",
          "duree": "45 min",
          "activite": "Dérouler le parcours métier propre au rôle dominant du groupe : pour le demandeur, l'assistant de réservation en plusieurs étapes et le plan de postes des salles multimédias ; pour le responsable de ressource ou le validateur, le traitement des demandes « À valider » (« Approuver » ou « Refuser » avec « Motif du refus ») ; pour l'administrateur, « Organisation », « Sites & services », « Paramètres », « Utilisateurs »."
        },
        {
          "phase": "Atelier pratique : création de comptes et import CSV",
          "duree": "40 min",
          "activite": "Faire télécharger les modèles CSV, compléter un fichier d'exemple (utilisateurs, et selon le public ministères ou établissements), réaliser un import par glisser-déposer et lire le compte-rendu (créés / ignorés / erreurs). Faire créer un compte unitaire via « Créer l'utilisateur » et tester une réinitialisation de mot de passe (icône clé)."
        },
        {
          "phase": "Pilotage et bibliothèque",
          "duree": "30 min",
          "activite": "Parcourir « Statistiques », « Rapports » (export CSV ou PDF) et « Abonnement ». Explorer la bibliothèque numérique : dépôt d'un document (assistant en sept étapes), validation et publication, consultation et téléchargement selon le niveau d'accès."
        },
        {
          "phase": "Se former et se certifier avec CERTEL",
          "duree": "30 min",
          "activite": "Ouvrir « Formation CERTEL » (tableau de bord › « Principal ») ou le menu public « CERTEL ». Faire passer le diagnostic de niveau gratuit, puis parcourir un niveau interactif : leçons illustrées avec « Écouter » (lecture audio), exercices auto-corrigés à vérification immédiate, évaluations chronométrées. Présenter l'inscription payante par niveau (Mobile Money — Wave, Orange Money, MTN, Moov — ou carte bancaire via CinetPay ; gratuite tant qu'aucun prix n'est défini), l'évaluation certifiante (projet de synthèse + examen dont les corrigés s'affichent à la fin + mise en situation) et le certificat de réussite en PDF paysage. Montrer côté super administrateur le réglage des tarifs/remises (« Plateforme » › « Tarifs & inscriptions CERTEL ») et du comportement des évaluations (« Plateforme » › « Évaluations »)."
        },
        {
          "phase": "Détente et compétition : Sport cérébral",
          "duree": "20 min",
          "activite": "Faire jouer au « Défi du jour » et à un jeu au choix (consigne écrite + audio via « Écouter »). Démontrer une compétition : création (« Nouvelle compétition »), partage du « Code de session », pilotage du « Classement » en direct, et participation des joueurs via le champ « CODE » puis « Rejoindre »."
        },
        {
          "phase": "Questions, dépannage et clôture",
          "duree": "20 min",
          "activite": "Traiter la FAQ et les cas de dépannage (page Neon en veille, imports ignorés, statut d'abonnement, postes réservés, inscription et paiement CERTEL). Rappeler le « Support » (support@eduweb.ci) et le « Centre d'aide ». Faire formuler à chaque participant une action à mettre en œuvre dès le retour au poste."
        }
      ],
      "conseils": [
        "Vouvoyer et adopter une progression du simple (se connecter, sécuriser son compte) vers le complexe (import CSV, administration, compétitions).",
        "Constituer des groupes homogènes par rôle afin de dérouler le parcours métier réellement permis à chacun, en s'appuyant sur le guide par rôle du « Centre d'aide ».",
        "Faire manipuler en parallèle : annoncer un libellé exact (entre guillemets), le faire localiser à l'écran, puis exécuter l'action ensemble.",
        "Préparer en amont un jeu de données de démonstration (un petit CSV d'utilisateurs, un établissement test) pour des ateliers sans risque sur des données réelles.",
        "Insister sur la sécurité : remplacer « password123 » dès la première connexion ; rappeler que les paiements sont simulés et que l'environnement est une démonstration.",
        "Pour CERTEL, faire passer le diagnostic gratuit avant tout achat et démontrer l'inscription sur un niveau laissé gratuit (prix à « 0 ») afin d'éviter un paiement réel pendant la formation ; rappeler que le super administrateur dispose d'un accès complet sans paiement.",
        "Anticiper la latence de la base Neon : si une page renvoie une erreur, faire recharger plutôt que multiplier les clics.",
        "Clore par un temps de jeu « Sport cérébral » pour ancrer l'apprentissage dans une note positive et fédératrice."
      ],
      "materiel": [
        "Un poste connecté à Internet par participant (ou un poste pour deux) avec un navigateur récent.",
        "Un vidéoprojecteur ou un écran partagé pour la démonstration du formateur.",
        "Les identifiants de connexion de chaque participant (mot de passe initial « password123 »).",
        "Au moins un compte super administrateur et un compte administrateur d'organisation pour les ateliers d'administration.",
        "Les modèles CSV téléchargés au préalable (utilisateurs, et selon le public ministères et établissements) et un fichier d'exemple à importer.",
        "Des enceintes ou un casque pour écouter les consignes audio des jeux du « Sport cérébral » et la lecture audio des leçons CERTEL (« Écouter »).",
        "Pour la démonstration CERTEL, un niveau laissé gratuit (prix à « 0 ») ou un compte super administrateur, afin de présenter l'inscription sans paiement réel.",
        "Le guide par rôle imprimé ou disponible en PDF via le « Centre d'aide », et le présent support de formation.",
        "Une connexion d'appoint (partage 4G) en cas de coupure réseau, l'application étant hébergée en ligne."
      ]
    }
  }
};
