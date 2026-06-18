import type { RoleKey } from "./enums";

export interface RoleGuide {
  title: string;
  intro: string;
  /** Ce qui est possible pour ce rôle (capacités). */
  can: string[];
  /** Comment procéder, étape par étape. */
  sections: { title: string; steps: string[] }[];
}

// Guide d'utilisation propre à chaque rôle (consultable dans le Centre d'aide + version PDF).
// Contenu rédigé de manière didactique et vérifié contre l'application.
export const ROLE_GUIDES: Record<RoleKey, RoleGuide> = {
  "SUPER_ADMIN": {
    "title": "Guide de l'Administrateur Système (super administrateur EduWeb)",
    "intro": "Ce support de formation s'adresse à l'Administrateur Système (clé SUPER_ADMIN), seul rôle disposant de l'ensemble des permissions de la plateforme EduWeb Booking. Il a pour objectif pédagogique de vous rendre autonome dans l'administration de toute la plateforme : gouvernement et ministères, établissements et abonnements, espace Sport cérébral, compétitions, ainsi que le travail dans le contexte d'un établissement donné via le sélecteur d'institution. À noter : votre compte est rattaché à l'espace plateforme « EduWeb », et vous êtes le seul à voir la section « Plateforme » et le sélecteur d'institution.",
    "can": [
      "Superviser l'ensemble de la plateforme (organisations, utilisateurs, ressources, réservations) depuis « Supervision EduWeb ».",
      "Enregistrer le gouvernement (l'État) et ses ministères de tutelle, ou pré-charger les « Ministères de Côte d'Ivoire », voire importer une liste par CSV.",
      "Inscrire des établissements un par un avec « Inscrire un établissement », ou en masse par dépôt d'un fichier CSV.",
      "Gérer l'abonnement de chaque établissement (Ministère de tutelle, Formule, Statut abonnement, Comptes autorisés, Renouvellement), « Suspendre » / « Réactiver » son accès, ou le supprimer définitivement.",
      "Basculer dans le contexte d'un établissement grâce au sélecteur d'institution (en haut de l'écran, sur ordinateur) pour y agir comme administrateur.",
      "Configurer l'espace Sport cérébral : verrouillage par abonnement, banque de questions, publication, ordre et consignes des jeux.",
      "Organiser des compétitions, partager le « Code de session » et suivre le classement en direct (arbitrage).",
      "Gérer votre propre compte, notamment « Changer mon mot de passe »."
    ],
    "sections": [
      {
        "title": "Superviser la plateforme dans son ensemble",
        "steps": [
          "Dans la barre latérale, dépliez la section « Plateforme » puis ouvrez « Supervision EduWeb ».",
          "Lisez les indicateurs globaux : « Organisations », « Utilisateurs », « Ressources », « Réservations », ainsi que le tableau « Organisations abonnées » (avec la formule de chacune).",
          "Utilisez les boutons d'en-tête pour accéder directement aux espaces clés : « Réglages des jeux », « Gouvernement » et « Gérer les établissements ».",
          "Retenez que chaque établissement gère son propre espace, ses rôles et sa hiérarchie de façon isolée ; votre rôle est de superviser l'ensemble."
        ]
      },
      {
        "title": "Enregistrer le gouvernement et ses ministères",
        "steps": [
          "Ouvrez « Plateforme » puis « Gouvernement & ministères ».",
          "Dans la carte « Gouvernement », renseignez le nom de l'État et choisissez le pays, puis cliquez « Enregistrer » (le bouton affiche « Mettre à jour » si un gouvernement existe déjà). Enregistrez le gouvernement avant de pouvoir ajouter des ministères.",
          "Pour ajouter un ministère, utilisez la carte « Nouveau ministère » : saisissez le « Nom du ministère » et son « Sigle », puis cliquez « Ajouter ».",
          "Pour gagner du temps, cliquez « Ministères de Côte d'Ivoire » afin de pré-remplir la liste du gouvernement actuel.",
          "Pour un import en masse, glissez-déposez un fichier CSV (colonnes : nom, sigle) dans la zone « Glissez-déposez un CSV », puis cliquez « Importer les ministères » ; téléchargez au besoin le « Modèle CSV » (pré-rempli selon le pays).",
          "Sur chaque ministère, modifiez le « Nom » ou le « Sigle » et enregistrez avec l'icône disquette, ou supprimez-le avec l'icône corbeille ; le badge indique le nombre d'établissements rattachés."
        ]
      },
      {
        "title": "Inscrire et administrer les établissements",
        "steps": [
          "Ouvrez « Plateforme » puis « Établissements ».",
          "Pour un établissement unique, remplissez la carte « Inscrire un établissement » (nom, sigle, identifiant — généré automatiquement —, ville, ministère de tutelle, formule, comptes autorisés, et prénom/nom/e-mail de l'administrateur), puis cliquez « Créer l'établissement » : un compte administrateur est créé avec le mot de passe initial « password123 », à changer.",
          "Pour une cohorte, dans « Import par CSV (cohorte d'établissements) », glissez-déposez votre fichier dans la zone « Glissez-déposez ou choisissez un fichier CSV » (le ministère est reconnu par sigle ou nom), puis cliquez « Importer » ; téléchargez d'abord « Télécharger le modèle CSV » si besoin.",
          "Vérifiez le bandeau de confirmation : il indique le nombre d'établissements importés et les doublons ignorés (nom, identifiant ou e-mail déjà existant).",
          "Pour couper ou rétablir l'accès complet d'un établissement, utilisez le bouton « Suspendre » ou « Réactiver » sur sa fiche.",
          "Pour retirer définitivement un établissement, cliquez « Supprimer » puis confirmez : action irréversible qui efface tous ses utilisateurs, rôles, ressources, réservations, documents et données."
        ]
      },
      {
        "title": "Gérer les abonnements des établissements",
        "steps": [
          "Sur la fiche d'un établissement (page « Établissements »), repérez le bloc d'abonnement encadré.",
          "Sélectionnez le « Ministère de tutelle », puis la « Formule » (Pilote, Standard, Premium ou National).",
          "Choisissez le « Statut abonnement » (Actif, Suspendu ou Résilié) ; l'accès complet, notamment à tous les jeux, est réservé aux abonnements « Actif ».",
          "Renseignez « Comptes autorisés » (nombre de comptes utilisateurs permis) et la date de « Renouvellement ».",
          "Cliquez « Enregistrer » : le bandeau « Modifications enregistrées » confirme la prise en compte, et la date de renouvellement prévue s'affiche sous le formulaire."
        ]
      },
      {
        "title": "Travailler dans une institution (sélecteur d'institution)",
        "steps": [
          "En haut de l'écran (sur ordinateur), ouvrez le menu déroulant des institutions à côté de l'icône bâtiment et choisissez l'établissement souhaité : tout votre contexte de travail bascule vers cet établissement.",
          "Vous agissez alors comme son administrateur (utilisateurs, ressources, bibliothèque, paramètres).",
          "Pour créer des comptes, ouvrez « Administration » puis « Utilisateurs » : créez un compte avec la carte « Nouvel utilisateur », ou importez une cohorte par CSV avec le bloc d'import et le modèle fourni.",
          "Lorsque vous avez terminé, rouvrez le sélecteur et choisissez « EduWeb · plateforme » pour retrouver le contexte plateforme."
        ]
      },
      {
        "title": "Configurer l'espace Sport cérébral",
        "steps": [
          "Ouvrez « Plateforme » puis « Réglages des jeux » : dans la carte « Accès des visiteurs non abonnés », cochez ou décochez « Activer le verrouillage par abonnement » (si désactivé, tous les jeux sont accessibles à tout le monde, y compris les visiteurs anonymes ; les abonnés ont toujours accès à tout).",
          "Réglez la « Sélection des jeux offerts » (Rotation aléatoire par jour ou Jeux fixes choisis) et, selon le mode, le « Nombre de jeux offerts (mode rotation) » ou les jeux cochés, puis cliquez « Enregistrer les réglages ». Le défi du jour reste toujours jouable.",
          "Depuis « Sport cérébral » (section « Principal »), cliquez sur « Banque de questions » (bouton réservé au super administrateur) pour ouvrir « Banque de questions — Culture générale ».",
          "Ajoutez une question via la carte « Nouvelle question », ou importez-en par CSV avec « Importer les questions » ; activez, désactivez ou supprimez chaque question depuis la liste.",
          "Cliquez « Gestion des jeux » : utilisez « Publier » / « Masquer », les flèches « Monter » / « Descendre » pour l'ordre, « Enregistrer la consigne » (laissée vide = consigne par défaut), et « Déposer » pour ajouter un audio de consigne (« Retirer l'audio » revient à la synthèse vocale)."
        ]
      },
      {
        "title": "Organiser une compétition et arbitrer",
        "steps": [
          "Ouvrez « Gestion » puis « Compétitions », et remplissez la carte « Nouvelle compétition » : « Intitulé », « Jeu » et « Niveau », puis cliquez « Créer la compétition ».",
          "Ouvrez la compétition créée pour afficher la vue arbitre, et communiquez le « Code de session » (ou le lien) : chaque compétiteur le saisit dans le champ « Rejoindre » de l'accueil du Sport cérébral, ou ouvre directement le lien ; vous pouvez aussi cliquer « Ouvrir la page joueur ».",
          "Pilotez l'état de la compétition avec les boutons « Ouvrir (inscriptions) », « Démarrer » puis « Clore » (un bouton « Supprimer » permet de retirer la compétition).",
          "Suivez le « Classement » qui se met à jour automatiquement (rafraîchissement toutes les quelques secondes), puis clôturez la compétition pour délibérer."
        ]
      },
      {
        "title": "Gérer votre compte et dépanner",
        "steps": [
          "Ouvrez « Mon compte » (section « Principal ») pour vérifier vos informations (nom, e-mail, établissement) et vos rôles.",
          "Dans « Changer mon mot de passe », saisissez le mot de passe actuel, le nouveau (au moins 8 caractères) et sa confirmation, puis cliquez « Mettre à jour le mot de passe ».",
          "Si une page affiche « Une erreur est survenue » ou qu'un « Enregistrer » reste sans effet, rechargez la page : la base de données (Neon) peut être momentanément en veille.",
          "Pour obtenir ce guide hors ligne, ouvrez le « Centre d'aide » (section « Aide ») et utilisez « Télécharger en PDF »."
        ]
      }
    ]
  },
  "ORG_ADMIN": {
    "title": "Guide de l'administrateur d'organisation",
    "intro": "Ce support de formation s'adresse à l'administrateur d'organisation d'EduWeb Booking — dans l'interface, votre rôle porte exactement le libellé « Administrateur d'organisation ». C'est la personne qui paramètre son établissement (désigné « institution » sur les pages publiques et « organisation » dans les écrans d'administration), gère ses comptes utilisateurs et supervise son activité. Son objectif pédagogique est de vous rendre autonome sur les tâches d'administration, depuis la configuration de l'organisation jusqu'au pilotage statistique, en suivant pas à pas les libellés réels de l'interface. Il couvre uniquement les actions effectivement permises à votre rôle, à l'exclusion de la section « Plateforme » (supervision EduWeb, gouvernement et ministères, établissements, réglages des jeux) réservée au super administrateur.",
    "can": [
      "Paramétrer votre organisation : identité (« Organisation »), sites et services (« Sites & services »), horaires et jours ouvrés (« Paramètres »).",
      "Créer et gérer les catégories de ressources et leur mode de validation, ainsi que les ressources elles-mêmes.",
      "Créer des comptes un par un (« Créer l'utilisateur ») ou importer une cohorte par fichier CSV en glisser-déposer.",
      "Valider ou refuser les demandes d'inscription (« Demandes de comptes »), réinitialiser un mot de passe, suspendre ou réactiver un compte.",
      "Consulter la matrice « Rôles & permissions » (lecture seule) et suivre votre abonnement (« Abonnement »).",
      "Valider les réservations en attente (« À valider »), suivre les « Statistiques » et exporter des « Rapports ».",
      "Organiser des compétitions sur l'espace Sport cérébral et arbitrer le classement en direct.",
      "Sécuriser votre propre accès en changeant votre mot de passe depuis « Mon compte »."
    ],
    "sections": [
      {
        "title": "Configurer l'identité et la structure de l'organisation",
        "steps": [
          "Dans la barre latérale, section « Administration », ouvrez « Organisation ».",
          "Renseignez le « Nom de l'organisation », le « Sigle », la « Ville », l'« Adresse » et, si besoin, la « Couleur principale » (sélecteur de couleur), puis cliquez sur « Enregistrer ».",
          "Ouvrez « Sites & services » : dans la carte « Nouveau site », saisissez le « Nom » (et, en option, le « Code » et la « Ville »), puis cliquez « Ajouter le site ».",
          "Dans la carte « Nouveau service », saisissez le « Nom » (et, en option, le « Code »), choisissez le « Site de rattachement », puis cliquez « Ajouter le service » (structure : Organisation › Site › Service › Ressources)."
        ]
      },
      {
        "title": "Régler les paramètres de réservation",
        "steps": [
          "Dans « Administration », ouvrez « Paramètres ».",
          "Sous « Général », choisissez la « Langue » (Français / Anglais) et le « Fuseau horaire ».",
          "Sous « Horaires d'ouverture », fixez l'heure d'« Ouverture » et de « Fermeture », puis cochez les « Jours ouvrés » (Lun à Dim).",
          "Sous « Validation », cochez si besoin « Autoriser la validation automatique lorsque la ressource est disponible », puis cliquez « Enregistrer les paramètres »."
        ]
      },
      {
        "title": "Créer et organiser les catégories de ressources",
        "steps": [
          "Dans la section « Gestion », ouvrez « Catégories », puis cliquez sur « Nouvelle catégorie ».",
          "Renseignez le « Nom » (et, en option, le « Code »), la « Description », le « Mode de validation », ainsi que l'« Icône » et la « Couleur ».",
          "Cliquez sur « Créer la catégorie » : elle apparaît avec son badge de mode de validation et son nombre de ressources.",
          "Pour ajuster une catégorie existante, utilisez « Modifier » ; une catégorie sans ressource peut être supprimée via l'icône de corbeille (la suppression est refusée tant qu'elle contient des ressources)."
        ]
      },
      {
        "title": "Créer des comptes utilisateurs un par un",
        "steps": [
          "Dans « Administration », ouvrez « Utilisateurs ».",
          "Dans la carte « Nouvel utilisateur », saisissez le « Prénom », le « Nom », l'« E-mail » et, en option, la « Fonction ».",
          "Choisissez le « Rôle » dans la liste déroulante (tous les rôles sauf Super Administrateur) et, si pertinent, le « Service ».",
          "Cliquez sur « Créer l'utilisateur » : le compte est créé actif et l'utilisateur se connecte avec le mot de passe par défaut « password123 » (à changer à la première connexion)."
        ]
      },
      {
        "title": "Importer une cohorte par fichier CSV (glisser-déposer)",
        "steps": [
          "Toujours dans « Utilisateurs », repérez la carte « Import par cohorte (CSV) ».",
          "Cliquez sur « Télécharger le modèle CSV » et complétez les colonnes : prenom, nom, email, fonction, role, matricule.",
          "Glissez-déposez votre fichier dans la zone « Glissez-déposez ou choisissez un fichier CSV » ; la colonne « role » accepte la clé du rôle (ex. RESOURCE_MANAGER) ou son libellé (ex. « Responsable de ressource »), tandis qu'une valeur vide ou inconnue donne « Demandeur ».",
          "Cliquez sur « Importer », puis vérifiez le compte-rendu : nombre de comptes créés, ignorés et la liste des erreurs éventuelles. Les comptes importés sont créés actifs avec le mot de passe « password123 »."
        ]
      },
      {
        "title": "Traiter les demandes de comptes et gérer les accès",
        "steps": [
          "Dans « Administration », ouvrez « Demandes de comptes » (un badge indique le nombre en attente).",
          "Examinez chaque fiche (identité, e-mail, fonction, rôle demandé, date de la demande).",
          "Cliquez sur « Valider » pour activer le compte (la personne est informée par e-mail qu'elle peut se connecter), ou sur « Refuser » puis « Refuser la demande » pour la supprimer (la personne est informée par e-mail).",
          "Depuis « Utilisateurs », réinitialisez un mot de passe (icône clé, retour à « password123 ») ou suspendez/réactivez un compte (icône d'alimentation) ; ces actions ne sont pas disponibles sur votre propre compte."
        ]
      },
      {
        "title": "Piloter l'activité : rôles, abonnement, validation, statistiques",
        "steps": [
          "Ouvrez « Rôles & permissions » pour consulter la matrice des droits en lecture seule : la page met en avant les 7 rôles de réservation, mais la matrice liste l'ensemble des rôles, y compris les 4 rôles de la Bibliothèque.",
          "Ouvrez « Abonnement » pour vérifier votre formule, le nombre de comptes autorisés, le statut et la date de renouvellement, ainsi que l'usage (utilisateurs, ressources, réservations).",
          "Dans « Gestion », ouvrez « À valider » pour approuver ou refuser les réservations en attente (un badge indique le nombre).",
          "Suivez l'usage dans « Statistiques », puis exportez vos données filtrées au format CSV ou PDF depuis « Rapports »."
        ]
      },
      {
        "title": "Organiser une compétition Sport cérébral",
        "steps": [
          "Dans « Gestion », ouvrez « Compétitions », puis dans « Nouvelle compétition » saisissez l'« Intitulé », choisissez le « Jeu » et le « Niveau », et cliquez « Créer la compétition ».",
          "Ouvrez la compétition pour afficher le « Code de session » et le lien à partager ; le bouton « Ouvrir la page joueur » donne accès à l'écran que chaque compétiteur rejoint en saisissant le code, puis joue sur son appareil.",
          "Pilotez l'état avec « Ouvrir (inscriptions) », « Démarrer », puis « Clore » (un bouton « Supprimer » permet de retirer la compétition) ; le « Classement » se rafraîchit automatiquement.",
          "Note : depuis « Sport cérébral », vous accédez à vos scores, badges et au bouton « Jouer » ; la « Banque de questions » et les « Réglages des jeux » relèvent du super administrateur et ne vous sont pas accessibles."
        ]
      },
      {
        "title": "Sécuriser votre propre compte",
        "steps": [
          "Dans la section « Principal », ouvrez « Mon compte ».",
          "Repérez la carte « Changer mon mot de passe ».",
          "Saisissez le « Mot de passe actuel », puis le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation.",
          "Cliquez sur « Mettre à jour le mot de passe » ; remplacez impérativement le mot de passe par défaut « password123 » dès votre première connexion."
        ]
      }
    ]
  },
  "RESOURCE_MANAGER": {
    "title": "Guide du responsable de ressource",
    "intro": "Ce support de formation s'adresse aux responsables de ressource d'EduWeb Booking, chargés du parc de salles, salles multimédias, matériels et services de leur établissement. À l'issue de ce guide, vous saurez créer et paramétrer vos ressources, gérer les postes des salles multimédias, traiter les demandes de réservation soumises à validation, et suivre l'activité grâce au calendrier, aux statistiques et aux rapports. Toutes les actions décrites s'appuient sur les libellés exacts de l'application. À noter : votre rôle vous autorise à créer et modifier des ressources, mais pas à les supprimer ni à gérer les catégories ; côté bibliothèque, vous pouvez consulter et télécharger les documents, mais pas en déposer.",
    "can": [
      "Créer et modifier des ressources (salles, matériels, services) et définir leurs règles de réservation via « Nouvelle ressource » (la suppression d'une ressource relève de l'administrateur).",
      "Gérer les salles multimédias : « Ajouter une salle » et ajuster le nombre de « Postes » sur le plan de salle.",
      "Rendre une ressource indisponible en réglant son « Statut » (« En maintenance », « Hors service » ou « Indisponible »).",
      "Traiter les demandes soumises à validation depuis « À valider » : « Approuver » ou « Refuser » avec motif.",
      "Suivre l'activité via « Calendrier », « Réservations » (« Toutes les réservations ») et « Statistiques » (« Statistiques & pilotage »).",
      "Exporter des rapports d'usage au format CSV ou PDF depuis « Rapports ».",
      "Consulter et télécharger les documents de la bibliothèque depuis « Explorer » (le dépôt de documents n'est pas accessible à ce rôle).",
      "Vous entraîner sur « Sport cérébral » et sécuriser votre accès via « Mon compte »."
    ],
    "sections": [
      {
        "title": "Créer et paramétrer une ressource",
        "steps": [
          "Dans le menu « Gestion », ouvrez « Ressources », puis cliquez sur « Nouvelle ressource ».",
          "Section « Informations générales » : renseignez le « Nom de la ressource », le « Code », la « Catégorie », et si besoin le « Site », le « Niveau » puis le « Service », ainsi qu'une « Description ».",
          "Section « Capacité & disponibilité » : choisissez le « Statut », désignez un « Responsable », indiquez la « Capacité (places) », la « Quantité totale », la « Localisation » et les « Équipements (séparés par des virgules) ».",
          "Section « Règles de réservation » : fixez le « Mode » (« Exclusive (créneau entier) », « Partagée (par quantité) » ou « Mixte »), la « Durée max. (minutes) » et le « Préavis min. (heures) ».",
          "Cochez « Soumettre les réservations à validation » pour que les demandes passent par votre approbation ; cochez « Réservation poste par poste (plan de salle) » pour une salle à postes.",
          "Cliquez sur « Créer la ressource ». Pour modifier une ressource existante, ouvrez sa fiche, cliquez sur « Modifier » et terminez par « Enregistrer les modifications »."
        ]
      },
      {
        "title": "Gérer les salles multimédias et leurs postes",
        "steps": [
          "Dans le menu « Principal », ouvrez « Salles multimédias » : la page « Salles multimédias — plan des postes » affiche la disponibilité en temps réel (postes libres et occupés).",
          "Pour ajouter une salle, cliquez sur « Ajouter une salle » : dans la fenêtre « Nouvelle salle multimédia », renseignez le « Nom de la salle » et la « Capacité (nombre de postes) », puis cliquez sur « Créer la salle ». La salle est créée avec un plan de postes et un code automatique, et le message « Salle ajoutée avec succès. » confirme l'opération.",
          "Pour modifier le nombre de postes d'une salle, utilisez le compteur « Postes » (boutons moins / plus ou saisie directe) au bas de la carte de la salle.",
          "Validez le nouveau nombre de postes en cliquant sur la coche (bouton « Enregistrer la capacité ») : le message « Capacité mise à jour. » confirme l'enregistrement.",
          "Note : la plateforme refuse de réduire la capacité en dessous d'un poste déjà réservé ; un message vous l'indique alors en précisant le nombre minimum de postes à conserver."
        ]
      },
      {
        "title": "Rendre une ressource indisponible (maintenance, panne)",
        "steps": [
          "Ouvrez la fiche de la ressource concernée depuis « Ressources », puis cliquez sur « Modifier ».",
          "Dans la section « Capacité & disponibilité », ouvrez la liste « Statut ».",
          "Sélectionnez « En maintenance » pour une intervention planifiée, « Hors service » en cas de panne, ou « Indisponible » pour un retrait temporaire.",
          "Cliquez sur « Enregistrer les modifications » : la ressource n'est plus réservable tant que son statut n'est pas remis sur « Disponible ».",
          "Pour la rouvrir, revenez sur « Modifier », repassez le « Statut » à « Disponible » et enregistrez."
        ]
      },
      {
        "title": "Traiter les demandes de réservation à valider",
        "steps": [
          "Dans le menu « Gestion », ouvrez « À valider » : la page « Demandes à valider » liste les demandes en attente (un badge dans le menu en indique le nombre, et un compteur « … demande(s) en attente » s'affiche en haut de la liste).",
          "Ouvrez une demande pour vérifier, dans les « Détails de la réservation », le « Créneau » et le « Type d'usage », ainsi que le « Motif » et le demandeur.",
          "Dans l'encart « Actions » (ou directement sur la carte de la demande), cliquez sur « Approuver » si la demande est conforme.",
          "Pour refuser, cliquez sur « Refuser » : dans la fenêtre « Refuser la demande », saisissez le « Motif du refus » puis cliquez sur « Confirmer le refus ».",
          "Le motif est communiqué au demandeur et la demande disparaît alors de la liste « À valider »."
        ]
      },
      {
        "title": "Suivre l'activité, les statistiques et les rapports",
        "steps": [
          "Ouvrez « Calendrier » pour visualiser les créneaux occupés et planifier la disponibilité des ressources.",
          "Ouvrez « Réservations » (« Toutes les réservations ») pour suivre l'ensemble des demandes ; filtrez par statut ou recherchez par code, motif ou ressource.",
          "Ouvrez « Statistiques » (« Statistiques & pilotage ») pour consulter les indicateurs clés : « Total réservations », « Taux d'occupation », « Taux de validation », « Taux d'annulation », ainsi que les graphiques « Répartition par statut », « Répartition par catégorie » et « Ressources les plus réservées ».",
          "Ouvrez « Rapports » pour produire un export : choisissez le périmètre (par période, par ressource, par catégorie, par site/service, par utilisateur ou par statut) puis exportez au format CSV ou PDF.",
          "Appuyez-vous sur ces indicateurs pour ajuster les règles et la capacité de vos ressources."
        ]
      },
      {
        "title": "Consulter la bibliothèque et l'espace Sport cérébral",
        "steps": [
          "Dans le menu « Bibliothèque », ouvrez « Explorer » : la page « Explorer la bibliothèque » permet de rechercher un document par titre, auteur, mot-clé ou code, et de filtrer par type, collection, domaine et niveau d'accès.",
          "Ouvrez la fiche d'un document pour le consulter, et téléchargez-le lorsque son niveau d'accès le permet (le dépôt de nouveaux documents n'est pas accessible à votre rôle).",
          "Dans le menu « Principal », ouvrez « Sport cérébral » pour suivre vos scores, votre progression et vos badges, puis cliquez sur « Jouer » pour vous entraîner.",
          "Relevez le « Défi du jour » proposé en haut de la page (bouton « Relever le défi ») pour cultiver votre régularité."
        ]
      },
      {
        "title": "Gérer mon compte et mon mot de passe",
        "steps": [
          "Dans le menu « Principal », ouvrez « Mon compte » : la page « Mon compte » affiche votre identité, votre établissement et votre rôle.",
          "Dans l'encart « Changer mon mot de passe », saisissez votre « Mot de passe actuel ».",
          "Renseignez le « Nouveau mot de passe » (au moins 8 caractères) puis « Confirmer le nouveau mot de passe ».",
          "Cliquez sur « Mettre à jour le mot de passe » : le message « Mot de passe modifié avec succès. » confirme l'opération."
        ]
      }
    ]
  },
  "VALIDATOR": {
    "title": "Guide du validateur hiérarchique",
    "intro": "Ce support de formation s'adresse aux validateurs hiérarchiques (responsables de service, chefs de département) chargés d'approuver ou de refuser les demandes de réservation soumises à validation dans EduWeb Booking. À l'issue de cette formation, vous saurez traiter les demandes en attente de manière conforme et tracée, suivre l'activité de réservation de votre organisation, et utiliser les fonctions personnelles du compte. Le rôle « Validateur hiérarchique » est centré sur la décision : il consulte les ressources, le calendrier et les statistiques, mais ne les administre pas. À noter : vous ne pouvez pas valider une demande que vous avez vous-même déposée — elle sera traitée par un autre validateur.",
    "can": [
      "Consulter les demandes de réservation en attente de validation dans « À valider » (un badge indique leur nombre).",
      "Approuver une demande conforme ou la refuser en justifiant la décision ; le demandeur est notifié automatiquement et votre décision est tracée.",
      "Consulter l'ensemble des réservations de l'organisation depuis « Réservations » (« Toutes les réservations ») et les rechercher par code, titre, motif ou ressource.",
      "Consulter le « Calendrier », les « Ressources » et les « Salles multimédias » en lecture seule, ainsi que les « Statistiques & pilotage » d'usage et de validation.",
      "Créer vos propres réservations et les suivre dans « Mes réservations » (confirmer votre présence, signaler la fin de l'activité, annuler).",
      "Consulter et télécharger les documents autorisés de la bibliothèque (« Explorer », « Documents »), selon leur niveau d'accès.",
      "Accéder à l'espace « Sport cérébral » pour jouer et suivre vos scores.",
      "Changer votre mot de passe depuis « Mon compte » et télécharger votre guide en PDF depuis le « Centre d'aide »."
    ],
    "sections": [
      {
        "title": "Accéder aux demandes à traiter",
        "steps": [
          "Dans la barre latérale, ouvrez la catégorie « Gestion » puis cliquez sur « À valider ».",
          "Le badge affiché à côté de « À valider » indique en permanence le nombre de demandes en attente.",
          "La page « Demandes à valider » liste chaque demande sous forme de carte, avec la ressource, le créneau, le demandeur, le type d'usage, l'effectif éventuel et le code de la demande.",
          "La mention « X demande(s) en attente » récapitule le volume à traiter ; lorsque tout est traité, le message « Tout est à jour » s'affiche."
        ]
      },
      {
        "title": "Examiner une demande avant décision",
        "steps": [
          "Sur la carte d'une demande, cliquez sur son intitulé pour ouvrir sa fiche détaillée.",
          "Lisez le bloc « Détails de la réservation » : créneau, durée, type d'usage, effectif, quantité ou postes réservés, et lieu le cas échéant.",
          "Consultez le bloc « Motif & besoins » pour vérifier le motif, les besoins particuliers, l'éventuelle demande d'assistance technique et la « Note du demandeur ».",
          "Identifiez le demandeur dans le bloc « Demandeur » (nom et fonction) et, si besoin, consultez le « Suivi de la demande » qui en retrace l'historique."
        ]
      },
      {
        "title": "Approuver ou refuser une demande",
        "steps": [
          "Vous pouvez décider directement depuis la carte dans « À valider », ou depuis le bloc « Actions » de la fiche détaillée.",
          "Si la demande est conforme, cliquez sur « Approuver » : la réservation passe au statut « Validée ».",
          "Si la demande doit être refusée, cliquez sur « Refuser » : la fenêtre « Refuser la demande » s'ouvre.",
          "Renseignez le champ obligatoire « Motif du refus » (il sera communiqué au demandeur), puis cliquez sur « Confirmer le refus » ; utilisez « Annuler » pour renoncer.",
          "Dans tous les cas, le demandeur reçoit automatiquement une notification de la décision, et votre validation est enregistrée dans le bloc « Validation » de la fiche."
        ]
      },
      {
        "title": "Suivre l'activité de réservation et les statistiques",
        "steps": [
          "Ouvrez « Réservations » (catégorie « Gestion ») pour consulter « Toutes les réservations » de votre organisation.",
          "Filtrez la liste avec le sélecteur « Tous les statuts » ou recherchez via « Rechercher par code, motif, ressource… ».",
          "Ouvrez « Calendrier » pour visualiser l'occupation, et « Ressources » ou « Salles multimédias » pour vérifier une ressource (consultation seule, sans possibilité de modification).",
          "Ouvrez « Statistiques » (« Statistiques & pilotage ») pour suivre les indicateurs : « Total réservations », « Cette semaine », « En attente », « Taux d'occupation », « Taux de validation », « Refusées », « Taux d'annulation » et « Non honorées », ainsi que les graphiques de répartition."
        ]
      },
      {
        "title": "Créer et gérer vos propres réservations",
        "steps": [
          "Cliquez sur « + Nouvelle réservation » en bas de la barre latérale pour soumettre une demande en votre nom.",
          "Suivez vos demandes dans « Mes réservations » (catégorie « Principal »), réparties entre « À venir » et « Historique », et ouvrez une fiche pour en voir le détail.",
          "Une fois votre réservation validée et le créneau venu, cliquez sur « Je suis arrivé », puis sur « Activité terminée » à la fin.",
          "Pour renoncer à l'une de vos réservations encore active, ouvrez sa fiche et cliquez sur « Annuler la réservation »."
        ]
      },
      {
        "title": "Consulter la bibliothèque numérique",
        "steps": [
          "Ouvrez « Explorer » (catégorie « Bibliothèque ») pour rechercher un document par titre, auteur, mot-clé ou code, et filtrer par type, collection, domaine ou niveau d'accès.",
          "Ouvrez la fiche d'un document autorisé pour consulter ses métadonnées et, si la consultation est permise, le lire en ligne via « Consulter ».",
          "Téléchargez le fichier via « Télécharger » lorsque le document l'autorise ; les documents restreints ou confidentiels nécessitent une demande d'accès, et certains téléchargements peuvent être payants.",
          "Parcourez « Documents » pour retrouver, sous forme de tableau, les ressources documentaires accessibles à votre profil."
        ]
      },
      {
        "title": "Utiliser le Sport cérébral et gérer votre compte",
        "steps": [
          "Ouvrez « Sport cérébral » (catégorie « Principal ») pour suivre vos scores et vos badges, puis lancez une partie.",
          "Ouvrez « Mon compte » pour vérifier vos informations et votre rôle, puis la section « Changer mon mot de passe ».",
          "Saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation, puis cliquez sur « Mettre à jour le mot de passe ».",
          "Dans « Centre d'aide » (catégorie « Aide »), retrouvez ce guide en ligne et cliquez sur « Télécharger en PDF » pour l'archiver ; en cas de difficulté, ouvrez « Support »."
        ]
      }
    ]
  },
  "REQUESTER": {
    "title": "Guide du demandeur",
    "intro": "Ce support de formation s'adresse aux membres d'un établissement (enseignants, personnels, étudiants) titulaires du rôle « Demandeur » dans EduWeb Booking. Il a pour objectif de vous rendre autonome pour réserver des ressources, choisir vos postes en salle multimédia, suivre vos demandes et exploiter la bibliothèque numérique. Vous y trouverez les libellés exacts du menu et des boutons, ainsi que l'ordre précis des actions à effectuer.",
    "can": [
      "Réserver une ressource (salle, salle multimédia à postes, matériel, service) à l'aide d'un assistant en six étapes.",
      "Choisir vos postes sur le plan de salle (postes verts libres, postes rouges occupés) ou réserver la salle entière.",
      "Suivre l'état de vos demandes (en attente, validée, refusée) depuis « Mes réservations » et recevoir les décisions via la cloche de notifications.",
      "Confirmer votre présence (« Je suis arrivé »), clôturer une activité (« Activité terminée ») et annuler une réservation à venir.",
      "Explorer la bibliothèque numérique, consulter et télécharger les documents autorisés (gratuitement ou via un paiement simulé de démonstration), puis réserver ou emprunter un exemplaire physique.",
      "Déposer un document dans la bibliothèque et le retrouver sur sa fiche dédiée après soumission.",
      "Vous entraîner sur l'espace « Sport cérébral » (scores, progression, badges, défi du jour) et rejoindre une compétition à l'aide d'un code de session.",
      "Changer votre mot de passe depuis « Mon compte » et télécharger ce guide en PDF depuis le « Centre d'aide »."
    ],
    "sections": [
      {
        "title": "Réserver une ressource",
        "steps": [
          "Dans la barre latérale, cliquez sur « + Nouvelle réservation », ou utilisez le bouton « Réserver » en haut de l'écran.",
          "Étape « Catégorie » : sélectionnez la catégorie de ressource, puis cliquez sur « Continuer ».",
          "Étape « Ressource » : choisissez la ressource souhaitée (le nom, le code et, le cas échéant, la capacité et le lieu sont affichés), puis « Continuer ».",
          "Étape « Motif » : renseignez l'« Intitulé », le « Type d'usage », l'« Effectif / participants » et le « Motif » (seul le « Motif » est obligatoire), puis « Continuer ».",
          "Étape « Créneau » : indiquez la « Date de début », l'« Heure de début », la « Date de fin » et l'« Heure de fin » (un même jour ou plusieurs jours consécutifs), puis cliquez sur « Vérifier la disponibilité ».",
          "Lisez le résultat : si « Ce créneau est disponible. Vous pouvez continuer. » s'affiche, cliquez sur « Continuer » ; sinon, appliquez le « Créneau proposé » suggéré, ou corrigez vos dates.",
          "Étape « Détails » : précisez les « Besoins spécifiques », cochez « J'ai besoin d'une assistance technique » si nécessaire, ajoutez une « Note pour le validateur » (facultative), puis « Continuer ».",
          "Étape « Confirmation » : vérifiez le récapitulatif, puis cliquez sur « Soumettre la demande ». Le message « Votre demande de réservation a été enregistrée. » confirme l'envoi."
        ]
      },
      {
        "title": "Réserver des postes en salle multimédia",
        "steps": [
          "Dans le menu « Principal », ouvrez « Salles multimédias » : le plan des postes de chaque salle s'affiche en temps réel (postes verts libres, postes rouges occupés), avec le nombre de postes libres et occupés.",
          "Pour réserver quelques postes, cliquez sur « Réserver des postes » ; pour mobiliser toute la salle, cliquez sur « Réserver la salle ».",
          "Dans l'assistant, à l'étape « Créneau », vous pouvez basculer entre « Réserver des postes » et « Réserver toute la salle » selon votre besoin.",
          "Cliquez sur « Vérifier la disponibilité », puis, sous « Choisissez vos postes », cliquez sur les postes verts pour les sélectionner (le compteur « poste(s) sélectionné(s) » se met à jour).",
          "En mode salle entière, vérifiez le message « La salle entière est libre sur ce créneau » avant de continuer ; si des postes sont occupés, choisissez un autre créneau ou revenez à la sélection de postes.",
          "Poursuivez jusqu'à l'étape « Confirmation », puis cliquez sur « Soumettre la demande »."
        ]
      },
      {
        "title": "Suivre et gérer mes réservations",
        "steps": [
          "Dans le menu « Principal », ouvrez « Mes réservations » : vos demandes sont classées en « À venir » et « Historique ».",
          "Utilisez la barre de recherche et le filtre « Tous les statuts » pour retrouver une demande précise.",
          "Cliquez sur une réservation pour ouvrir sa fiche (« Détails de la réservation », « Motif & besoins », « Suivi de la demande »).",
          "Une fois la demande validée et le créneau arrivé, cliquez sur « Je suis arrivé » dans le panneau « Actions ».",
          "À la fin de l'activité, cliquez sur « Activité terminée ».",
          "Pour renoncer à une réservation encore à venir (soumise, en attente ou validée), cliquez sur « Annuler la réservation », puis confirmez : le créneau est libéré."
        ]
      },
      {
        "title": "Consulter, télécharger et réserver des documents",
        "steps": [
          "Dans le menu « Bibliothèque », ouvrez « Explorer » et recherchez un document (titre, auteur, mot-clé, code) à l'aide de la barre de recherche et des filtres (« Tous les types », « Toutes collections », « Tous domaines », « Tout accès »).",
          "Ouvrez la fiche d'un document, puis dans « Accès au document » cliquez sur « Consulter » pour le lire en ligne lorsque la consultation est autorisée.",
          "Si le téléchargement est autorisé et gratuit, cliquez sur « Télécharger » ; s'il est payant, cliquez sur « Payer et débloquer » (paiement simulé de démonstration).",
          "Document payant d'un établissement éligible (p. ex. ENS d'Abidjan) : si le bloc « Étudiant de l'ENS d'Abidjan ? » s'affiche, saisissez votre matricule puis cliquez sur « Télécharger » pour un accès gratuit.",
          "Pour un exemplaire physique, cliquez sur « Réserver / Emprunter », choisissez « Consultation sur place » ou « Emprunt physique », précisez éventuellement le créneau et une note, puis « Envoyer la demande ».",
          "Si le document est restreint, le bouton devient « Demander l'accès » : renseignez votre motif et envoyez ; le message « Votre demande a été transmise au documentaliste. » confirme l'envoi."
        ]
      },
      {
        "title": "Déposer un document dans la bibliothèque",
        "steps": [
          "Dans le menu « Bibliothèque », cliquez sur « Déposer » (ou sur le bouton « Déposer » depuis « Explorer » ou « Documents »).",
          "L'assistant de dépôt comporte sept étapes : « Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits » et « Vérification ».",
          "Renseignez le type, la collection et le domaine (obligatoires), le titre (obligatoire) et l'auteur principal (obligatoire), puis le résumé et les mots-clés.",
          "À l'étape « Fichier », joignez le fichier si vous le souhaitez (le dépôt du fichier est facultatif et peut se faire plus tard) ; à l'étape « Droits », choisissez le niveau d'accès.",
          "À l'étape « Vérification », cliquez sur « Soumettre le dépôt » : le message « Votre dépôt a été enregistré et soumis à validation. » confirme l'envoi et un code provisoire est attribué.",
          "Vous êtes alors redirigé vers la fiche de votre document : conservez ce lien pour suivre son avancement. Le documentaliste valide, publie ou demande une correction ; vous êtes informé de sa décision par la cloche de notifications."
        ]
      },
      {
        "title": "S'entraîner au Sport cérébral et rejoindre une compétition",
        "steps": [
          "Dans le menu « Principal », ouvrez « Sport cérébral » pour consulter vos scores, votre progression et vos badges, et relever le « Défi du jour » via « Relever le défi ».",
          "Cliquez sur « Jouer » pour accéder à la banque de jeux publique (page « Sport cérébral »).",
          "Choisissez un jeu, un niveau (Débutant, Intermédiaire, Avancé), puis « Commencer » ; touchez « Écouter » pour entendre la consigne en audio.",
          "Pour participer à une compétition organisée, repérez l'encart « Compétition » de la banque de jeux (« Vous avez un code de session ? »), saisissez le code dans le champ « CODE », puis cliquez sur « Rejoindre ».",
          "Jouez sur votre appareil : votre score remonte automatiquement dans le classement de la compétition."
        ]
      },
      {
        "title": "Gérer mon compte et mon aide",
        "steps": [
          "Dans le menu « Principal », ouvrez « Mon compte » pour vérifier vos informations (nom, e-mail, fonction, établissement et rôle).",
          "Sous « Changer mon mot de passe », saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et « Confirmer le nouveau mot de passe », puis cliquez sur « Mettre à jour le mot de passe » ; le message « Mot de passe modifié avec succès. » confirme l'opération.",
          "Surveillez la cloche de notifications en haut à droite : elle signale les décisions de validation et autres messages, avec un badge indiquant le nombre de notifications « non lue(s) ».",
          "Dans le menu « Aide », ouvrez le « Centre d'aide » pour relire ce guide, ou cliquez sur « Télécharger en PDF » ; en cas de difficulté, ouvrez « Support »."
        ]
      }
    ]
  },
  "TECHNICIAN": {
    "title": "Guide du technicien / agent d'appui",
    "intro": "Ce support de formation s'adresse aux techniciens et agents d'appui d'EduWeb Booking, chargés de veiller au bon état de fonctionnement des ressources de leur établissement. Il vise à vous rendre autonome dans la surveillance de l'état des ressources, le suivi des maintenances planifiées et l'alerte sur les incidents, ainsi que la consultation du calendrier d'occupation, à partir des seuls écrans et libellés réellement disponibles pour votre rôle. Votre profil donne un accès en consultation étendu (toutes les réservations, le calendrier, les ressources, les salles multimédias et la bibliothèque). Important : la plateforme ne propose pas, pour votre rôle, d'écran dédié pour déclarer, prendre en charge ou clore un incident, ni pour créer ou modifier une maintenance ; vos interventions techniques se font sur le terrain, et c'est un responsable de ressource ou un administrateur qui enregistre maintenances et changements de statut dans l'outil. Votre rôle n'autorise donc ni la création de réservations, ni la modification de la configuration des ressources, ni l'administration de l'établissement.",
    "can": [
      "Consulter le « Tableau de bord » de l'organisation et repérer, sur l'indicateur « Ressources disponibles », le nombre de ressources « en maintenance ».",
      "Voir, quand des incidents sont ouverts, l'encart d'alerte « X incident(s) ouvert(s) » accompagné du message « Des ressources nécessitent une intervention. ».",
      "Parcourir la liste « Ressources » et ouvrir la fiche détaillée de chaque ressource pour vérifier son état (« Disponible maintenant », « Occupée actuellement » ou « Non réservable »).",
      "Consulter sur la fiche d'une ressource l'encart « Maintenance planifiée » (intitulé et période des opérations en cours ou à venir).",
      "Consulter le « Calendrier » et la page « Réservations » de tout l'établissement pour situer vos interventions sans gêner les usagers.",
      "Examiner les « Salles multimédias » et l'occupation des postes en temps réel avant une intervention technique.",
      "Consulter la « Bibliothèque » et « Explorer » le catalogue documentaire en lecture à l'écran.",
      "Vous détendre sur l'espace « Sport cérébral » (défi du jour, parties, badges).",
      "Gérer votre accès depuis « Mon compte » et retrouver votre guide dans le « Centre d'aide »."
    ],
    "sections": [
      {
        "title": "Démarrer et repérer les ressources à surveiller",
        "steps": [
          "Connectez-vous, puis ouvrez « Tableau de bord » dans le menu « Principal » de la barre latérale ; vous accédez à la vue d'organisation.",
          "Repérez l'indicateur « Ressources disponibles » : il affiche un rapport « disponibles / total » et, en mention complémentaire, le nombre de ressources « en maintenance ».",
          "Dans la colonne latérale, lorsqu'au moins un incident est ouvert, surveillez l'encart d'alerte « X incident(s) ouvert(s) », accompagné du message « Des ressources nécessitent une intervention. » (cet encart n'apparaît pas s'il n'y a aucun incident).",
          "Consultez le « Planning du jour » pour connaître les créneaux occupés avant de situer une intervention."
        ]
      },
      {
        "title": "Inspecter une ressource et lire son état",
        "steps": [
          "Ouvrez « Ressources » dans le menu « Gestion ».",
          "Affinez la recherche avec la barre « Rechercher par nom, code ou lieu… » et les filtres de catégorie, de statut et, si plusieurs sites existent, de site.",
          "Cliquez sur une ressource pour ouvrir sa fiche détaillée.",
          "Lisez l'encart de disponibilité à droite : « Occupée actuellement » (avec l'heure « Libre à partir de »), « Disponible maintenant », ou « Non réservable » (icône clé à molette) lorsque la ressource est hors service ou en maintenance.",
          "Vérifiez la section « Caractéristiques » (capacité, localisation, responsable, mode de réservation) et la liste « Équipements » pour préparer votre intervention."
        ]
      },
      {
        "title": "Suivre les maintenances et repérer les incidents",
        "steps": [
          "Sur la fiche d'une ressource, consultez l'encart « Maintenance planifiée » : il liste l'intitulé et la période de chaque opération en cours ou à venir.",
          "Notez qu'une ressource en maintenance s'affiche « Non réservable » et n'est donc plus proposée aux usagers sur la période concernée.",
          "Pour repérer la présence d'incidents à l'échelle de l'établissement, revenez au « Tableau de bord » : l'encart « X incident(s) ouvert(s) » signale qu'une intervention est nécessaire (la plateforme n'ouvre pas, pour votre rôle, d'écran listant chaque incident).",
          "Réalisez votre intervention sur le terrain. La déclaration, la planification ou la clôture d'une maintenance et la mise à jour du statut sont effectuées dans l'outil par un responsable de ressource ou un administrateur.",
          "Une fois la remise en service enregistrée par le responsable, vérifiez sur la fiche de la ressource que son état est bien repassé à « Disponible maintenant »."
        ]
      },
      {
        "title": "Situer une intervention grâce au calendrier",
        "steps": [
          "Ouvrez « Calendrier » dans le menu « Principal » : vous y voyez la « Vue d'ensemble des réservations de l'organisation ».",
          "Repérez un créneau libre sur la ressource visée afin d'intervenir sans gêner les usagers.",
          "Pour une vue en liste, ouvrez « Réservations » dans le menu « Gestion » : la page « Toutes les réservations » recense l'ensemble des réservations de l'établissement, avec recherche par code, motif ou ressource et filtre par statut.",
          "Sur la fiche d'une ressource, parcourez « Prochaines réservations » pour anticiper sa disponibilité avant l'intervention."
        ]
      },
      {
        "title": "Contrôler les salles multimédias et leurs postes",
        "steps": [
          "Ouvrez « Salles multimédias » dans le menu « Principal » : la page « plan des postes » présente toutes les salles, chacune avec son plan en temps réel.",
          "Pour chaque salle, lisez le compteur de postes libres / occupés et repérez les postes libres (verts) et occupés (rouges).",
          "Survolez un poste occupé (rouge) pour connaître sa période d'occupation, donc à partir de quand il redevient disponible.",
          "Servez-vous de cette vue pour situer une intervention technique sur les postes hors créneaux d'usage."
        ]
      },
      {
        "title": "Consulter la bibliothèque numérique",
        "steps": [
          "Ouvrez « Bibliothèque » dans le menu « Bibliothèque » : la page « Bibliothèque numérique » présente le fonds documentaire.",
          "Cliquez sur « Explorer » pour rechercher un document par titre, auteur ou domaine.",
          "Ouvrez « Documents » pour parcourir le catalogue accessible en consultation.",
          "Ouvrez la fiche d'un document autorisé pour le consulter à l'écran (votre rôle est limité à la lecture : il ne permet ni le téléchargement, ni la réservation de documents)."
        ]
      },
      {
        "title": "Gérer mon compte et mon mot de passe",
        "steps": [
          "Ouvrez « Mon compte » dans le menu « Principal » : vous y voyez votre nom, votre e-mail (et votre fonction), votre établissement et votre rôle.",
          "Dans l'encart « Changer mon mot de passe », saisissez votre « Mot de passe actuel ».",
          "Renseignez le « Nouveau mot de passe » (au moins 8 caractères), puis « Confirmer le nouveau mot de passe ».",
          "Cliquez sur « Mettre à jour le mot de passe » : le message « Mot de passe modifié avec succès. » confirme l'opération."
        ]
      },
      {
        "title": "Trouver de l'aide et se détendre (Sport cérébral)",
        "steps": [
          "Ouvrez « Centre d'aide » dans le menu « Aide » pour retrouver ce guide adapté à votre rôle.",
          "Cliquez sur « Télécharger en PDF » pour en conserver une version hors ligne.",
          "Pour une question, ouvrez « Support » : e-mail support@eduweb.ci, téléphone et « Questions fréquentes ».",
          "Pour une pause, ouvrez « Sport cérébral » dans le menu « Principal », relevez le « Défi du jour » via « Relever le défi » ou lancez une partie avec « Jouer »."
        ]
      }
    ]
  },
  "VISITOR": {
    "title": "Guide du visiteur",
    "intro": "Ce support de formation s'adresse aux visiteurs d'EduWeb Booking : personnes qui découvrent la plateforme sans compte complet, ou titulaires du rôle « Visiteur ». Son objectif pédagogique est de vous rendre autonome pour découvrir l'offre publique, vous exercer librement sur l'espace « Sport cérébral », rejoindre une compétition à l'aide d'un code de session, et savoir comment obtenir un compte donnant accès aux ressources, aux réservations et à la bibliothèque de votre établissement.",
    "can": [
      "Découvrir la plateforme et ses fonctionnalités depuis le site public (accueil, présentation, contact).",
      "Accéder librement à l'espace « Sport cérébral » et jouer aux jeux ouverts aux visiteurs.",
      "Lire la consigne de chaque jeu (à l'écran et en audio) et relever le « Défi du jour ».",
      "Rejoindre une compétition organisée à l'aide d'un code de session, et jouer sur votre propre appareil.",
      "Demander la création d'un compte pour accéder aux ressources, aux réservations et à la bibliothèque de votre établissement."
    ],
    "sections": [
      {
        "title": "Découvrir la plateforme",
        "steps": [
          "Ouvrez la page d'accueil publique d'EduWeb Booking pour découvrir la présentation de la plateforme et de ses services.",
          "Parcourez les rubriques publiques (présentation, fonctionnalités, contact) pour comprendre ce que la plateforme propose à votre établissement.",
          "Pour accéder aux ressources, aux réservations et à la bibliothèque, un compte est nécessaire : voir la dernière étape pour en faire la demande."
        ]
      },
      {
        "title": "S'exercer sur l'espace « Sport cérébral »",
        "steps": [
          "Ouvrez l'espace « Sport cérébral » : il est public et accessible sans connexion.",
          "Choisissez un jeu parmi ceux qui vous sont proposés, puis un niveau (Débutant, Intermédiaire ou Avancé).",
          "Lisez la consigne affichée à l'écran ; cliquez sur « Écouter » pour l'entendre en audio, puis jouez directement dans votre navigateur.",
          "Relevez le « Défi du jour », toujours jouable, pour vous mesurer à l'exercice quotidien.",
          "Selon la configuration de la plateforme, l'accès à certains jeux peut être réservé aux établissements abonnés ; les jeux ouverts aux visiteurs et le défi du jour restent toujours accessibles."
        ]
      },
      {
        "title": "Rejoindre une compétition",
        "steps": [
          "Munissez-vous du code de session (ou du lien) communiqué par l'organisateur de la compétition.",
          "Sur l'accueil du « Sport cérébral », repérez l'encadré « Compétition » et saisissez le code dans le champ « CODE », puis cliquez sur « Rejoindre » (ou ouvrez directement le lien reçu).",
          "Jouez la partie sur votre appareil : votre score est automatiquement pris en compte dans le classement suivi par l'organisateur."
        ]
      },
      {
        "title": "Obtenir un compte complet",
        "steps": [
          "Pour réserver des ressources, consulter la bibliothèque ou déposer des documents, demandez la création d'un compte auprès de l'administrateur de votre établissement.",
          "Une fois votre compte créé, vous recevez vos identifiants et un mot de passe initial à changer dès la première connexion.",
          "Connectez-vous : votre menu s'enrichit alors des fonctions correspondant au rôle qui vous a été attribué."
        ]
      }
    ]
  },
  "LIBRARIAN": {
    "title": "Guide du bibliothécaire / documentaliste",
    "intro": "Ce support de formation s'adresse aux bibliothécaires et documentalistes d'un établissement utilisant EduWeb Booking (rôle LIBRARIAN). Il a pour objectif de vous rendre autonome dans la chaîne de traitement documentaire : contrôle et validation des dépôts, codification, publication au catalogue, organisation du fonds, et suivi des réservations et emprunts. Toutes les manipulations décrites s'effectuent dans la section « Bibliothèque » de votre tableau de bord, dans le périmètre de votre établissement.",
    "can": [
      "Contrôler les dépôts en attente, examiner les métadonnées, le fichier et les doublons potentiels signalés, puis valider, demander une correction ou rejeter.",
      "Générer le code documentaire définitif à la validation, puis publier ou archiver le document dans le catalogue.",
      "Organiser le fonds en gérant les « Collections » et les « Domaines » (création, nom, code, activation/désactivation).",
      "Fixer le « Prix de téléchargement (FCFA · 0 = gratuit) » d'un document (cadre de paiement simulé).",
      "Traiter les « Réservations doc. » (consultation sur place, emprunt physique, demande d'accès) et suivre les « Emprunts » physiques jusqu'au retour.",
      "Explorer le catalogue, consulter et télécharger les documents, et déposer vous-même une ressource.",
      "Consulter les « Statistiques doc. » (dépôts, consultations, téléchargements, réservations, popularité) pour piloter l'activité.",
      "Changer votre mot de passe dans « Mon compte » et vous détendre sur l'espace « Sport cérébral »."
    ],
    "sections": [
      {
        "title": "Contrôler et valider les dépôts en attente",
        "steps": [
          "Dans la barre latérale, ouvrez la section « Bibliothèque », puis cliquez sur « À vérifier » (un badge indique le nombre de dépôts en attente).",
          "La page « Validation documentaire » liste les dépôts ; cliquez sur le titre d'un dépôt pour ouvrir sa fiche détaillée.",
          "Contrôlez le type de document, les métadonnées (auteur principal, co-auteurs, directeur, année, langue, niveau, domaine, collection), le résumé et le fichier joint.",
          "Examinez l'encadré « Doublons potentiels » lorsqu'il s'affiche (titre similaire, motif et score de similarité).",
          "Pour accepter : cliquez sur « Valider le document », ajoutez un « Commentaire (facultatif) », cochez au besoin « Publier directement », puis « Valider » — un code documentaire définitif est alors généré.",
          "Pour renvoyer au déposant : cliquez sur « Corriger », renseignez les « Précisions » attendues (champ obligatoire), puis « Demander correction ».",
          "Pour écarter le dépôt : cliquez sur « Rejeter », saisissez le « Motif du rejet » (obligatoire), puis « Confirmer le rejet ». Le déposant est notifié automatiquement de chaque décision."
        ]
      },
      {
        "title": "Publier et gérer le cycle de vie d'un document",
        "steps": [
          "Ouvrez la fiche d'un document validé via « Documents » (filtres par statut et par type, ou recherche par titre, code ou auteur) ou depuis « À vérifier ».",
          "Dans l'encadré « Validation documentaire » de la fiche, cliquez sur « Publier » pour rendre le document visible dans le catalogue.",
          "Cliquez sur « Archiver » pour retirer du catalogue un document qui ne doit plus être proposé.",
          "Vérifiez le suivi en bas de fiche : « Déposé par », « Validé par », « Validé le », « Publié le », ainsi que le code et le QR du document (encadré « Code & QR »)."
        ]
      },
      {
        "title": "Paramétrer le téléchargement et l'accès payant",
        "steps": [
          "Ouvrez la fiche d'un document et repérez l'encadré « Accès au document ».",
          "Dans le champ « Prix de téléchargement (FCFA · 0 = gratuit) », saisissez le montant souhaité (0 pour un accès libre), puis cliquez sur « Définir ».",
          "Le paiement présenté aux usagers est simulé (démo) : un usager clique sur « Payer et débloquer » pour obtenir le droit de téléchargement.",
          "À l'ENS d'Abidjan, un étudiant peut télécharger gratuitement en saisissant son matricule dans « Étudiant de l'ENS d'Abidjan ? » puis « Télécharger » ; le matricule saisi doit correspondre à celui enregistré sur son compte."
        ]
      },
      {
        "title": "Organiser le fonds : collections et domaines",
        "steps": [
          "Ouvrez « Collections » dans la section « Bibliothèque » pour structurer le fonds par grandes familles.",
          "Dans l'encadré « Nouvelle collection », renseignez le nom et le code (ex. nom « Thèses », code « THS »), puis enregistrez (le code est automatiquement mis en majuscules).",
          "Sur chaque ligne, basculez l'état « Active » / « Inactive » ou modifiez le nom et le code.",
          "Ouvrez « Domaines » pour classer les ressources par disciplines ; dans « Nouveau domaine », saisissez nom et code (ex. « Robotique » / « ROB »).",
          "Activez ou désactivez un domaine (« Actif » / « Inactif ») selon les besoins du catalogue. Seules les collections et domaines actifs sont proposés lors d'un dépôt."
        ]
      },
      {
        "title": "Traiter les réservations et les emprunts",
        "steps": [
          "Ouvrez « Réservations doc. » : la liste des demandes (consultation sur place, emprunt physique, demande d'accès) s'affiche avec le demandeur, le type et le statut.",
          "Sur une demande au statut « En attente », cliquez sur le bouton vert (validation) pour approuver ou sur le bouton de refus pour la rejeter ; le demandeur est notifié.",
          "Une demande d'emprunt approuvée crée automatiquement un prêt avec une échéance de retour fixée à 14 jours et décrémente la disponibilité physique.",
          "Ouvrez « Emprunts » pour suivre les exemplaires physiques sortis et repérer les retards (date « Retour prévu », statut « En retard »).",
          "À la restitution d'un exemplaire, cliquez sur « Marquer rendu » : la disponibilité physique est recréditée."
        ]
      },
      {
        "title": "Explorer, déposer et suivre l'activité documentaire",
        "steps": [
          "Ouvrez « Explorer » pour rechercher dans le catalogue par titre, auteur, mot-clé ou code, et filtrer par type, collection, domaine ou niveau d'accès.",
          "Ouvrez la fiche d'un document pour le « Consulter » ou le « Télécharger » (selon les autorisations) et récupérer sa citation au format APA dans « Citer ce document ».",
          "Pour ajouter une ressource, cliquez sur « Déposer », renseignez les métadonnées, joignez le fichier et soumettez : un code provisoire est attribué, le code définitif étant attribué à la validation.",
          "Ouvrez « Statistiques doc. » pour suivre les indicateurs : « Documents », « Publiés », « En attente », « Réservations », « Consultations », « Téléchargements », « Emprunts en cours » et « Domaines couverts », ainsi que les répartitions par type, domaine et année et les « Documents les plus consultés »."
        ]
      },
      {
        "title": "Gérer votre compte et l'espace Sport cérébral",
        "steps": [
          "Dans la section « Principal », ouvrez « Mon compte » pour vérifier vos informations (nom, e-mail, établissement) et votre rôle.",
          "Dans « Changer mon mot de passe », saisissez le « Mot de passe actuel », puis le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation, puis cliquez sur « Mettre à jour le mot de passe ».",
          "Ouvrez « Sport cérébral » pour consulter vos scores, votre progression et vos badges, et relever le « Défi du jour ».",
          "Cliquez sur « Jouer » pour accéder aux jeux ; la configuration des jeux et des compétitions relève de l'administration de la plateforme et n'est pas accessible à votre rôle.",
          "En cas de message « Une erreur est survenue » ou d'enregistrement sans effet, rechargez la page : la base de données peut être momentanément en veille."
        ]
      }
    ]
  },
  "DEPOSITOR": {
    "title": "Guide du déposant",
    "intro": "Ce support de formation s'adresse aux déposants d'EduWeb Booking — enseignants, chercheurs, étudiants ou personnels chargés d'alimenter la bibliothèque numérique de leur établissement. Il a pour objectif pédagogique de vous rendre autonome dans le dépôt d'une ressource documentaire, le suivi de sa validation et la consultation du fonds, en n'utilisant que les fonctions réellement ouvertes à votre rôle. Chaque procédure cite les libellés exacts des menus et des boutons de l'application. Votre rôle donne accès à quatre actions documentaires : consulter le catalogue autorisé, déposer une ressource, télécharger les documents permis et réserver ou emprunter un document. Les fonctions de réservation de salles, de calendrier ou de validation ne relèvent pas de votre rôle.",
    "can": [
      "Déposer une ressource documentaire (mémoire, article scientifique, thèse, rapport, support pédagogique, etc.) via l'assistant « Déposer ».",
      "Renseigner les métadonnées, les auteurs, le résumé et les droits d'accès, puis joindre un fichier (PDF recommandé, facultatif au dépôt).",
      "Suivre le statut de vos dépôts (« Soumis », « À corriger », « Validé », « Publié », « Rejeté ») et lire les avis du documentaliste.",
      "Explorer le catalogue, consulter en ligne les documents autorisés et les télécharger (ou régler un téléchargement payant simulé).",
      "Réserver un document : consultation sur place, emprunt physique, ou demander l'accès à un document restreint.",
      "Suivre vos demandes documentaires dans « Réservations doc. ».",
      "Accéder à l'espace public « Sport cérébral » pour jouer et suivre vos scores et badges.",
      "Changer votre mot de passe depuis « Mon compte »."
    ],
    "sections": [
      {
        "title": "Découvrir votre espace et repérer vos menus",
        "steps": [
          "Connectez-vous, puis ouvrez « Tableau de bord » dans la section « Principal » de la barre latérale ; cette section vous donne aussi accès à « Sport cérébral » et « Mon compte ».",
          "Dépliez la section « Bibliothèque » : vous y disposez de « Bibliothèque », « Explorer », « Déposer », « Documents » et « Réservations doc. ».",
          "Notez que les entrées de validation (« À vérifier », « Emprunts »), de pilotage (« Statistiques doc. ») et de gestion (« Collections », « Domaines ») ne vous sont pas accessibles : elles relèvent du bibliothécaire et de l'administrateur. De même, les menus de réservation de salles (« Calendrier », « Salles multimédias », « Mes réservations ») et la section « Administration » ne font pas partie de votre rôle.",
          "Pour une vue d'ensemble du fonds, ouvrez « Bibliothèque » : la page « Bibliothèque numérique » affiche les indicateurs « Documents », « En attente de validation », « Consultations » et « Téléchargements », ainsi que les derniers dépôts."
        ]
      },
      {
        "title": "Déposer une ressource documentaire",
        "steps": [
          "Dans la section « Bibliothèque », cliquez sur « Déposer » (ou sur le bouton « Déposer » présent en haut des pages « Bibliothèque » et « Documents », ou « Explorer »). La page « Déposer une ressource » s'ouvre.",
          "Étape « Type » : choisissez le type de document (Mémoire, Article scientifique, Thèse, Rapport, Support pédagogique, Guide, Manuel…), puis la « Collection » et le « Domaine » (obligatoires), et cliquez sur « Continuer ».",
          "Étape « Métadonnées » : saisissez le « Titre » (obligatoire, au moins 3 caractères), puis l'« Année », la « Langue », les « Pages » et le « Niveau / diplôme (mémoire, thèse…) » si besoin.",
          "Étape « Auteurs » : renseignez l'« Auteur principal » (obligatoire), les « Co-auteurs (séparés par des virgules) » et le « Directeur / encadreur ».",
          "Étape « Résumé » : rédigez le « Résumé » et les « Mots-clés (séparés par des virgules) ».",
          "Étape « Fichier » : glissez-déposez le fichier dans « Déposer un fichier (PDF recommandé) » — formats acceptés PDF, DOC, DOCX, ODT, PPT, PPTX, EPUB ; il est facultatif au dépôt et pourra être ajouté plus tard ; pour un article scientifique, complétez « Revue » et « DOI ».",
          "Étape « Droits » : choisissez le « Niveau d'accès » (Public, Interne, Restreint, Consultation sur place, Emprunt papier, Confidentiel, Embargo), cochez ou non « Autoriser le téléchargement du fichier », indiquez les « Exemplaires physiques disponibles » et le « Prix de téléchargement (FCFA) » (0 = gratuit ; le bibliothécaire et vous-même êtes exemptés du paiement).",
          "Étape « Vérification » : contrôlez le récapitulatif, puis cliquez sur « Soumettre le dépôt ». Un code provisoire est attribué, le documentaliste est notifié et le message « Votre dépôt a été enregistré et soumis à validation. » confirme l'envoi."
        ]
      },
      {
        "title": "Suivre vos dépôts et leurs avis",
        "steps": [
          "Ouvrez « Documents » : la liste affiche pour chaque ressource son « Statut » (« Soumis », « À corriger », « Validé », « Publié », « Rejeté »…), son code et son niveau d'accès. Vos propres dépôts y figurent toujours, aux côtés des documents du catalogue qui vous sont visibles.",
          "Filtrez au besoin avec le menu « Tous les statuts » ou « Tous les types », ou recherchez par « Titre, code, auteur… ».",
          "Cliquez sur une ligne pour ouvrir la fiche : la rubrique « Historique & avis » détaille les décisions et commentaires du documentaliste (validation, correction demandée, rejet, avis scientifique).",
          "Le bloc de suivi en bas de la fiche indique qui a déposé et, le cas échéant, qui a validé et quand ; en cas de rejet, le motif y est rappelé.",
          "Une fois le dépôt « Validé » ou « Publié », un code documentaire définitif remplace le code provisoire ; vous en êtes notifié par la cloche et par e-mail."
        ]
      },
      {
        "title": "Répondre à une demande de correction",
        "steps": [
          "Si le statut passe à « À corriger », ouvrez la fiche du document et lisez le commentaire du documentaliste dans « Historique & avis ».",
          "Votre rôle ne permet pas de modifier directement un dépôt déjà soumis : pour transmettre une version corrigée, retournez sur « Déposer » et déposez à nouveau la ressource corrigée, puis cliquez sur « Soumettre le dépôt ».",
          "Dans le résumé ou les mots-clés du nouveau dépôt, signalez qu'il s'agit d'une version corrigée afin que le documentaliste fasse le lien avec la demande initiale.",
          "Le documentaliste traite votre nouveau dépôt ; le document d'origine reste en l'état tant qu'il ne l'a pas mis à jour ou écarté."
        ]
      },
      {
        "title": "Explorer et consulter le catalogue",
        "steps": [
          "Ouvrez « Explorer » et recherchez un document par « Titre, auteur, mot-clé, code… » ou affinez avec les filtres « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès ».",
          "Ouvrez la fiche d'un document autorisé : dans l'encadré « Accès au document », cliquez sur « Consulter » pour le lire en ligne (lecture seule, filigrane à votre nom ; impression et copie désactivées) lorsque la consultation est permise.",
          "Pour récupérer le fichier, cliquez sur « Télécharger » s'il est en accès libre et autorisé au téléchargement.",
          "Si le document est en téléchargement payant, le bloc « Téléchargement payant » affiche le prix : cliquez sur « Payer et débloquer » (paiement simulé de démonstration). À l'ENS d'Abidjan, si vous êtes étudiant vous pouvez saisir votre matricule pour télécharger gratuitement — le matricule saisi doit correspondre à celui enregistré sur votre compte.",
          "Utilisez l'encadré « Citer ce document » pour copier la référence au format APA via le bouton « Copier »."
        ]
      },
      {
        "title": "Réserver, emprunter ou demander l'accès à un document",
        "steps": [
          "Sur la fiche d'un document, repérez l'encadré « Accès au document ».",
          "Si un exemplaire physique est disponible, cliquez sur « Réserver / Emprunter » : choisissez le « Type de demande » (Consultation sur place ou Emprunt physique), précisez le créneau « Début (sur place) » / « Fin » et un « Motif / note », puis « Envoyer la demande ».",
          "Pour un document restreint (ou confidentiel) auquel vous n'avez pas accès, cliquez sur « Demander l'accès », ajoutez votre motif et validez : le message « Votre demande a été transmise au documentaliste. » s'affiche.",
          "Suivez l'avancement dans « Réservations doc. » : le statut passe de « En attente » à « Approuvée » ou « Refusée », et vous êtes notifié de la décision (un emprunt approuvé ouvre un prêt avec date de retour)."
        ]
      },
      {
        "title": "Utiliser le Sport cérébral et gérer votre compte",
        "steps": [
          "Dans la section « Principal », ouvrez « Sport cérébral » pour consulter vos scores, votre progression, vos badges et le « Défi du jour », puis cliquez sur « Jouer » ou « Relever le défi » pour lancer une partie.",
          "Ouvrez « Mon compte » pour vérifier vos informations (nom, e-mail, fonction, établissement et rôle).",
          "Dans « Changer mon mot de passe », saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et la confirmation, puis cliquez sur « Mettre à jour le mot de passe ».",
          "En cas de difficulté, ouvrez « Support » ou « Centre d'aide » dans la section « Aide » ; le Centre d'aide affiche votre guide et propose « Télécharger en PDF »."
        ]
      }
    ]
  },
  "SCIENTIFIC_VALIDATOR": {
    "title": "Guide du validateur scientifique",
    "intro": "Ce support de formation s'adresse aux enseignants-chercheurs et experts disciplinaires dotés du rôle « Validateur scientifique » dans EduWeb Booking. Son objectif pédagogique est de vous rendre autonome pour consulter les dépôts de la bibliothèque numérique de votre institution et y porter un avis scientifique motivé (favorable ou réservé), en distinguant clairement votre mission d'expertise du contrôle documentaire assuré par le bibliothécaire.",
    "can": [
      "Rechercher et consulter les documents de la bibliothèque de votre institution depuis « Explorer » ou « Documents ».",
      "Lire le texte intégral d'un document via le bouton « Consulter » et examiner ses métadonnées.",
      "Télécharger les documents dont le téléchargement est autorisé, pour une lecture approfondie.",
      "Émettre un avis scientifique « Favorable » ou « Réservé » sur un document de votre institution, en y joignant un commentaire.",
      "Retrouver, dans l'« Historique & avis » de chaque document, votre avis et ceux des autres relecteurs.",
      "Changer votre mot de passe depuis « Mon compte » et vous détendre sur l'espace public « Sport cérébral »."
    ],
    "sections": [
      {
        "title": "Comprendre votre rôle et votre périmètre",
        "steps": [
          "Votre rôle est l'expertise scientifique : vous donnez un avis sur le fond d'un mémoire, d'un article ou d'un rapport, sans gérer son cycle documentaire.",
          "La validation documentaire proprement dite (vérification des métadonnées, génération du code définitif, publication, archivage ou rejet) relève du bibliothécaire / documentaliste, pas de vous.",
          "Dans la barre latérale, votre menu se limite à « Principal » (Accueil, Tableau de bord, Sport cérébral, Mon compte), à « Bibliothèque » (Bibliothèque, Explorer, Documents) et à « Aide » (Support, Centre d'aide) : c'est normal.",
          "Vous pouvez consulter et télécharger les documents autorisés et émettre un avis scientifique, mais vous ne pouvez ni déposer un document, ni valider une réservation de ressource, ni réserver ou emprunter un document.",
          "Votre avis scientifique ne peut porter que sur les documents de votre propre institution : c'est une exigence du contrôle d'accès de la plateforme."
        ]
      },
      {
        "title": "Trouver un document à expertiser",
        "steps": [
          "Dans la barre latérale, ouvrez la section « Bibliothèque » puis cliquez sur « Explorer ».",
          "Utilisez la barre de recherche (« Titre, auteur, mot-clé, code… ») pour retrouver un document précis.",
          "Affinez au besoin avec les filtres « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès ».",
          "Cliquez sur la fiche du document souhaité pour l'ouvrir ; vous pouvez aussi passer par l'entrée « Documents », qui présente la liste sous forme de tableau avec un filtre par statut."
        ]
      },
      {
        "title": "Examiner le document avant de vous prononcer",
        "steps": [
          "Sur la fiche, lisez le « Résumé » puis le bloc « Métadonnées » (auteur principal, co-auteurs, directeur, année, langue, niveau, domaine, institution, bibliothèque…).",
          "Dans la colonne « Accès au document », cliquez sur « Consulter » pour lire le texte intégral à l'écran (lorsque la consultation est autorisée).",
          "Si le téléchargement est autorisé, utilisez le bouton « Télécharger » pour étudier le document hors ligne.",
          "Parcourez l'encadré « Historique & avis » pour voir les décisions et avis déjà enregistrés sur ce dépôt (il n'apparaît que si au moins un avis ou une décision existe)."
        ]
      },
      {
        "title": "Émettre votre avis scientifique",
        "steps": [
          "Sur la fiche du document, repérez l'encadré « Validation documentaire » et cliquez sur le bouton « Avis scientifique ».",
          "Dans la fenêtre « Avis scientifique », choisissez la « Décision » en sélectionnant « Favorable » (coché par défaut) ou « Réservé » (champ obligatoire).",
          "Saisissez si vous le souhaitez votre appréciation dans le champ « Commentaire » afin de motiver et d'argumenter votre avis (ce commentaire est facultatif, mais vivement recommandé).",
          "Cliquez sur « Enregistrer l'avis » pour valider ; utilisez « Annuler » si vous souhaitez renoncer.",
          "Votre avis apparaît aussitôt dans l'« Historique & avis » sous la mention « Avis scientifique favorable » ou « Avis scientifique réservé », à votre nom et daté."
        ]
      },
      {
        "title": "Gérer votre compte (mot de passe)",
        "steps": [
          "Dans la section « Principal » de la barre latérale, cliquez sur « Mon compte ».",
          "Sous « Changer mon mot de passe », renseignez « Mot de passe actuel », « Nouveau mot de passe » puis « Confirmer le nouveau mot de passe » (au moins 8 caractères).",
          "Cliquez sur « Mettre à jour le mot de passe » : un bandeau confirme « Mot de passe modifié avec succès. »"
        ]
      },
      {
        "title": "Vous détendre avec l'espace « Sport cérébral »",
        "steps": [
          "Dans la section « Principal », cliquez sur « Sport cérébral » pour accéder à l'espace public de jeux d'entraînement cérébral.",
          "Choisissez un jeu et le niveau proposé, lisez la consigne (un audio peut l'accompagner), puis jouez directement dans votre navigateur.",
          "Cet espace est accessible à tous : il ne fait pas partie de votre mission de validation scientifique."
        ]
      },
      {
        "title": "Trouver de l'aide et ce guide",
        "steps": [
          "Dans la section « Aide » de la barre latérale, ouvrez « Centre d'aide » pour retrouver ce guide adapté à votre rôle.",
          "Utilisez « Télécharger en PDF » pour conserver une version imprimable de ce support de formation.",
          "Pour toute difficulté technique, passez par l'entrée « Support »."
        ]
      }
    ]
  },
  "READER": {
    "title": "Guide du lecteur",
    "intro": "Ce support de formation s'adresse aux utilisateurs dotés du rôle « Lecteur » d'EduWeb Booking : étudiants, enseignants-chercheurs et personnels qui consultent le fonds documentaire de leur établissement. Son objectif pédagogique est de vous rendre autonome pour explorer le catalogue, consulter et télécharger les documents autorisés, demander l'accès aux ressources restreintes, réserver un exemplaire physique, vous exercer sur l'espace « Sport cérébral », et gérer la sécurité de votre compte. Votre rôle vous donne accès, dans la barre latérale, à « Bibliothèque », « Explorer », « Documents » et « Réservations doc. », ainsi qu'à « Sport cérébral » et « Mon compte ».",
    "can": [
      "Explorer le catalogue de la bibliothèque numérique et filtrer les documents par type, collection, domaine et niveau d'accès.",
      "Consulter en ligne, en lecture seule et filigranée à votre nom et à votre e-mail, les documents dont la consultation est autorisée.",
      "Télécharger les documents en accès libre, ou régler un téléchargement payant (paiement simulé) lorsqu'un prix est fixé.",
      "Bénéficier, à l'ENS d'Abidjan, de la gratuité de téléchargement en saisissant votre matricule étudiant.",
      "Demander l'accès à un document restreint, votre demande étant transmise au documentaliste.",
      "Réserver un exemplaire physique (emprunt) ou une consultation sur place lorsque des exemplaires sont disponibles, et suivre l'état de vos demandes.",
      "Vous entraîner sur l'espace « Sport cérébral » et rejoindre une compétition à l'aide d'un code de session.",
      "Changer votre mot de passe depuis « Mon compte »."
    ],
    "sections": [
      {
        "title": "Explorer le catalogue documentaire",
        "steps": [
          "Dans la barre latérale, section « Bibliothèque », cliquez sur « Explorer ».",
          "Saisissez votre recherche dans la barre (titre, auteur, mot-clé ou code) ; l'indication « Titre, auteur, mot-clé, code… » vous guide.",
          "Affinez avec les filtres déroulants : « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès ».",
          "Parcourez les fiches affichées ; le compteur « N document(s) » indique le nombre de résultats.",
          "Cliquez sur une fiche pour ouvrir le détail du document.",
          "Vous pouvez aussi ouvrir « Bibliothèque » (page « Bibliothèque numérique ») pour suivre les indicateurs du fonds, puis, depuis l'encadré « Derniers dépôts », cliquer sur « Tout voir » pour parcourir la liste « Documents ». L'encadré « Documents » liste les ressources avec leur code, statut, niveau d'accès et nombre de vues."
        ]
      },
      {
        "title": "Consulter un document en ligne",
        "steps": [
          "Ouvrez la fiche du document depuis « Explorer » ou « Documents ».",
          "Vérifiez l'en-tête : type, collection, domaine, puis le statut, le niveau d'accès et le code documentaire ; lisez ensuite le « Résumé », les « Métadonnées », les « Mots-clés » et l'encadré « Citer ce document ».",
          "Dans l'encadré « Accès au document », cliquez sur « Consulter » lorsque la consultation est autorisée.",
          "Le document s'ouvre en « Consultation en lecture seule » : l'impression et la copie sont désactivées et un filigrane à votre nom et à votre e-mail est apposé.",
          "Pour revenir, utilisez « Retour à la fiche » depuis le lecteur, puis « Retour à la bibliothèque » depuis la fiche."
        ]
      },
      {
        "title": "Télécharger un document (gratuit ou payant)",
        "steps": [
          "Sur la fiche, repérez l'encadré « Accès au document ».",
          "Si le téléchargement est libre, cliquez sur « Télécharger ».",
          "Si un prix s'affiche sous « Téléchargement payant », cliquez sur « Payer et débloquer » ; le paiement est simulé (cadre de démonstration), puis le bouton « Télécharger · débloqué ✓ » apparaît.",
          "À l'ENS d'Abidjan, lorsqu'un document est payant, l'encadré « Étudiant de l'ENS d'Abidjan ? » s'affiche : saisissez votre matricule (par exemple « 23-B-P17498IPS/SP ») puis cliquez sur « Télécharger » pour obtenir la gratuité ; le matricule saisi doit correspondre à celui enregistré sur votre compte étudiant, sans quoi le message « Matricule invalide ou non éligible. » apparaît.",
          "Si le fichier est restreint, un message précise la raison (par exemple « Consultation sur place uniquement », « Document restreint — demandez l'accès » ou « Document sous embargo »)."
        ]
      },
      {
        "title": "Demander l'accès à un document restreint",
        "steps": [
          "Ouvrez la fiche d'un document dont le niveau d'accès est « Restreint » (les documents confidentiels n'apparaissent pas dans votre catalogue).",
          "Dans « Accès au document », cliquez sur « Demander l'accès ».",
          "Dans la fenêtre « Demander l'accès », renseignez le champ « Motif / note » pour préciser votre besoin.",
          "Cliquez sur « Demander l'accès » pour transmettre la demande au documentaliste ; le message « Votre demande a été transmise au documentaliste » confirme l'envoi.",
          "Suivez ensuite l'avancement de cette demande dans « Bibliothèque » → « Réservations doc. »."
        ]
      },
      {
        "title": "Réserver un exemplaire physique et suivre ses demandes",
        "steps": [
          "Sur la fiche d'un document disposant d'exemplaires physiques disponibles (le nombre « N/N exemplaire(s) physique(s) disponible(s) » s'affiche), cliquez sur « Réserver / Emprunter ».",
          "Dans la fenêtre « Réserver ce document », choisissez le « Type de demande » : « Consultation sur place » ou « Emprunt physique ».",
          "Pour une consultation sur place, indiquez le créneau dans « Début (sur place) » et « Fin », puis ajoutez un « Motif / note » si besoin.",
          "Cliquez sur « Envoyer la demande ».",
          "Suivez l'avancement dans « Bibliothèque » → « Réservations doc. » (page « Réservations documentaires ») : chaque demande affiche son type et son statut, et vous pouvez rouvrir la fiche du document en cliquant sur son titre."
        ]
      },
      {
        "title": "S'entraîner sur le Sport cérébral et rejoindre une compétition",
        "steps": [
          "Dans la section « Principal » de la barre latérale, ouvrez « Sport cérébral » pour consulter vos scores, votre progression, vos badges et le « Défi du jour ».",
          "Cliquez sur « Jouer » (ou « Relever le défi ») pour accéder à l'espace public des jeux.",
          "Choisissez un jeu et un niveau (Débutant, Intermédiaire ou Avancé), puis suivez la consigne affichée (lecture à l'écran et audio via le bouton « Écouter »).",
          "Pour rejoindre une compétition organisée, repérez l'encadré « Compétition », saisissez le code de session fourni dans le champ « CODE », puis cliquez sur « Rejoindre ».",
          "Jouez la compétition sur votre appareil ; votre score est pris en compte dans le classement de l'organisateur."
        ]
      },
      {
        "title": "Gérer son compte et obtenir de l'aide",
        "steps": [
          "Dans « Principal », ouvrez « Mon compte » pour vérifier vos informations (nom, e-mail, fonction, établissement et rôle).",
          "Dans l'encadré « Changer mon mot de passe », renseignez « Mot de passe actuel », « Nouveau mot de passe » (au moins 8 caractères) et « Confirmer le nouveau mot de passe ».",
          "Cliquez sur « Mettre à jour le mot de passe » ; le message « Mot de passe modifié avec succès » confirme l'opération (un message d'erreur s'affiche sinon).",
          "En cas de besoin, ouvrez « Centre d'aide » pour relire ce guide ou « Télécharger en PDF », et « Support » pour contacter l'assistance."
        ]
      }
    ]
  }
};
