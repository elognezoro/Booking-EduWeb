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
    "intro": "Ce support de formation s'adresse à l'Administrateur Système (clé SUPER_ADMIN), le seul rôle qui dispose de l'ensemble des permissions de la plateforme EduWeb Booking. Son objectif pédagogique est de vous rendre pleinement autonome dans la supervision de toute la plateforme et de chaque organisation abonnée : enregistrement du gouvernement et des ministères, inscription et abonnements des établissements, réglages des jeux et des diagnostics CERTEL, sécurité des sessions, attribution des permissions par rôle et affectation des comptes en attente. Vous êtes aussi le seul à voir la section « Plateforme » et le sélecteur d'institution qui vous permet de basculer dans le contexte de n'importe quel établissement pour y agir comme administrateur. À noter : votre compte est rattaché à l'espace plateforme « EduWeb », et le mot de passe initial des comptes créés est « password123 », à changer à la première connexion.",
    "can": [
      "Superviser l'ensemble de la plateforme (organisations abonnées, utilisateurs, ressources, réservations) depuis « Supervision EduWeb ».",
      "Enregistrer le gouvernement (l'État) et ses ministères de tutelle, pré-charger les « Ministères de Côte d'Ivoire » ou importer une liste par CSV.",
      "Inscrire des établissements un par un avec leur compte administrateur, ou en masse par dépôt d'un fichier CSV (cohorte).",
      "Gérer l'abonnement de chaque établissement (ministère de tutelle, formule, statut, comptes autorisés, renouvellement), le suspendre, le réactiver ou le supprimer définitivement.",
      "Basculer dans le contexte de n'importe quel établissement grâce au sélecteur d'institution, puis revenir à « EduWeb · plateforme ».",
      "Voir TOUS les comptes en attente, quelle que soit leur institution (y compris ceux inscrits sans institution), et les affecter à un établissement et un rôle, ou les refuser.",
      "Attribuer ou retirer des permissions par rôle dans la matrice « Rôles & permissions » (le rôle Super administrateur et la supervision plateforme restant toujours réservés).",
      "Régler la sécurité des sessions : déconnexion automatique après inactivité (délai en minutes, 0 = désactivé, jusqu'à 480 minutes).",
      "Configurer l'espace Sport cérébral : verrouillage par abonnement, sélection des jeux offerts, banque de questions, publication, ordre et consignes des jeux.",
      "Consulter et purger le journal des diagnostics CERTEL, avec suppression en sélection multiple.",
      "Paramétrer chaque établissement via le sélecteur : identité et logo, sites et services (glisser-déposer, responsables, agents), utilisateurs, certificats.",
      "Organiser des compétitions sur le Sport cérébral, partager le « Code de session » et suivre le classement en direct.",
      "Gérer votre propre compte (informations et mot de passe) et télécharger les guides en PDF ou en Word."
    ],
    "sections": [
      {
        "title": "Superviser la plateforme dans son ensemble",
        "steps": [
          "Dans la barre latérale, dépliez la section « Plateforme » puis ouvrez « Supervision EduWeb ».",
          "Lisez les indicateurs globaux « Organisations », « Utilisateurs », « Ressources » et « Réservations », ainsi que le tableau « Organisations abonnées » qui affiche la formule et l'activité de chaque établissement.",
          "Utilisez les boutons d'en-tête pour rejoindre directement les espaces clés : « Réglages des jeux », « Gouvernement » et « Gérer les établissements ».",
          "Retenez que chaque établissement gère son propre espace, ses rôles et sa hiérarchie de façon isolée ; votre mission est de superviser l'ensemble et d'intervenir au besoin via le sélecteur d'institution."
        ]
      },
      {
        "title": "Enregistrer le gouvernement et ses ministères",
        "steps": [
          "Ouvrez « Plateforme » puis « Gouvernement & ministères ».",
          "Dans la carte « Gouvernement », renseignez le nom de l'État, choisissez le pays, puis cliquez « Enregistrer » (le bouton affiche « Mettre à jour » si un gouvernement existe déjà) — il faut enregistrer le gouvernement avant de pouvoir ajouter des ministères.",
          "Pour ajouter un ministère, utilisez la carte « Nouveau ministère » : saisissez le « Nom du ministère » et son « Sigle », puis cliquez « Ajouter ».",
          "Pour gagner du temps, cliquez « Ministères de Côte d'Ivoire » afin de pré-remplir la liste du gouvernement en place.",
          "Pour un import en masse, glissez-déposez un fichier CSV (colonnes nom, sigle) dans la zone prévue puis cliquez « Importer les ministères » ; téléchargez au besoin le « Modèle CSV ».",
          "Sur chaque ministère, modifiez le nom ou le sigle et validez avec l'icône disquette, ou supprimez-le avec l'icône corbeille ; le badge indique le nombre d'établissements rattachés."
        ]
      },
      {
        "title": "Inscrire et administrer les établissements",
        "steps": [
          "Ouvrez « Plateforme » puis « Établissements ».",
          "Pour un établissement unique, remplissez la carte « Inscrire un établissement » (nom, sigle, identifiant généré automatiquement, ville, ministère de tutelle, formule, comptes autorisés, et prénom/nom/e-mail de l'administrateur), puis cliquez « Créer l'établissement » : un compte administrateur est créé avec le mot de passe initial « password123 », à changer.",
          "Pour une cohorte, dans « Import par CSV (cohorte d'établissements) », glissez-déposez votre fichier (le ministère est reconnu par sigle ou par nom), puis cliquez « Importer » ; téléchargez d'abord le modèle CSV si besoin.",
          "Vérifiez le bandeau de confirmation : il indique le nombre d'établissements importés et les doublons ignorés (nom, identifiant ou e-mail déjà existant).",
          "Pour couper ou rétablir l'accès complet d'un établissement, utilisez le bouton « Suspendre » ou « Réactiver » sur sa fiche.",
          "Pour retirer définitivement un établissement, cliquez « Supprimer » puis confirmez : action irréversible qui efface tous ses utilisateurs, rôles, ressources, réservations, documents et données."
        ]
      },
      {
        "title": "Gérer les abonnements des établissements",
        "steps": [
          "Sur la page « Établissements », repérez le bloc d'abonnement encadré de la fiche concernée.",
          "Sélectionnez le « Ministère de tutelle », puis la « Formule » (Pilote, Standard, Premium ou National).",
          "Choisissez le « Statut abonnement » (Actif, Suspendu ou Résilié) ; l'accès complet, notamment à tous les jeux, est réservé aux abonnements « Actif ».",
          "Renseignez « Comptes autorisés » (nombre de comptes permis) et la date de « Renouvellement ».",
          "Cliquez « Enregistrer » : le bandeau « Modifications enregistrées » confirme la prise en compte, et la date de renouvellement s'affiche sous le formulaire."
        ]
      },
      {
        "title": "Affecter les comptes en attente (toutes institutions)",
        "steps": [
          "Ouvrez « Administration » puis « Demandes de comptes » : vous y voyez TOUS les comptes en attente de la plateforme, y compris ceux inscrits sans institution.",
          "Sur chaque demande, lisez le nom, l'e-mail, la fonction et, le cas échéant, l'établissement déjà renseigné par la personne.",
          "Choisissez l'« Établissement » de rattachement dans la liste, puis le « Rôle » à attribuer (le rôle Super Administrateur n'est jamais proposé).",
          "Cliquez « Valider et affecter » : la personne est rattachée à l'établissement, dotée du rôle choisi et peut désormais se connecter.",
          "Pour écarter une demande, cliquez « Refuser » puis confirmez : le compte en attente est supprimé et la personne en est informée par e-mail."
        ]
      },
      {
        "title": "Attribuer ou retirer des permissions par rôle",
        "steps": [
          "Ouvrez « Administration » puis « Rôles & permissions » : en tant que super administrateur, vous voyez la matrice en mode éditable.",
          "Parcourez les cartes de rôles en haut pour visualiser le nombre de permissions de chacun.",
          "Dans la matrice, cliquez sur une case à l'intersection d'un rôle et d'une permission pour l'attribuer ou la retirer ; le changement s'applique immédiatement.",
          "Gardez à l'esprit que le rôle « Super administrateur » conserve toujours l'ensemble des droits (non modifiable) et que la supervision plateforme reste réservée à ce rôle."
        ]
      },
      {
        "title": "Régler la sécurité et les sessions",
        "steps": [
          "Ouvrez « Plateforme » puis « Sécurité & sessions ».",
          "Dans « Déconnexion automatique après inactivité », saisissez le « Délai d'inactivité (minutes) » souhaité pour toutes les institutions.",
          "Indiquez 0 pour désactiver complètement la déconnexion automatique, ou une valeur jusqu'à 480 minutes (8 h) au maximum.",
          "Cliquez « Enregistrer » : le bandeau « Paramètres enregistrés » confirme la prise en compte ; un avertissement s'affichera désormais aux utilisateurs juste avant l'expiration de leur session."
        ]
      },
      {
        "title": "Configurer l'espace Sport cérébral",
        "steps": [
          "Ouvrez « Plateforme » puis « Réglages des jeux » : dans « Accès des visiteurs non abonnés », cochez ou décochez « Activer le verrouillage par abonnement » (si désactivé, tous les jeux sont accessibles à tout le monde, y compris les visiteurs anonymes ; les abonnés ont toujours accès à tout).",
          "Réglez la « Sélection des jeux offerts » (Rotation aléatoire par jour ou Jeux fixes choisis) et, selon le mode, le « Nombre de jeux offerts » ou les jeux cochés, puis cliquez « Enregistrer les réglages » ; le défi du jour reste toujours jouable.",
          "Depuis « Sport cérébral » (section « Principal »), cliquez « Banque de questions » (bouton réservé au super administrateur) pour ajouter des questions via « Nouvelle question » ou « Importer les questions » par CSV, et les activer, désactiver ou supprimer.",
          "Cliquez « Gestion des jeux » : utilisez « Publier » / « Masquer », les flèches « Monter » / « Descendre » pour l'ordre, « Enregistrer la consigne » (laissée vide = consigne par défaut) et « Déposer » pour ajouter un audio de consigne (« Retirer l'audio » revient à la synthèse vocale)."
        ]
      },
      {
        "title": "Consulter et purger les diagnostics CERTEL",
        "steps": [
          "Ouvrez « Plateforme » puis « Diagnostics CERTEL » : les cartes en haut résument le nombre total de tests et leur répartition par niveau (N1, N2, N3).",
          "Parcourez le journal : participant, profil (fonction, structure), score sur 100, niveau attribué et date.",
          "Cliquez « Voir » sur une ligne pour consulter le détail des réponses et de l'évaluation d'un participant.",
          "Pour faire le ménage, cochez une ou plusieurs lignes (ou utilisez la case « Tout sélectionner » de l'en-tête), cliquez « Supprimer la sélection », puis confirmez dans la fenêtre : la suppression est définitive."
        ]
      },
      {
        "title": "Travailler dans un établissement (sélecteur d'institution)",
        "steps": [
          "En haut de l'écran (sur ordinateur), ouvrez le menu déroulant des institutions à côté de l'icône bâtiment et choisissez l'établissement souhaité : tout votre contexte de travail bascule vers cet établissement.",
          "Vous agissez alors comme son administrateur : ouvrez « Administration » › « Organisation » pour ajuster l'identité et téléverser le logo (par glisser-déposer ou par clic, redimensionné automatiquement et affiché à la place du sigle), puis cliquez « Enregistrer ».",
          "Ouvrez « Administration » › « Utilisateurs » pour créer un compte avec « Nouvel utilisateur » ou importer une cohorte par CSV, et « Demandes de comptes » pour valider les inscriptions de cet établissement.",
          "Au besoin, gérez ses « Certificats » (numérotation automatique, cachet et signature scannés, journal, impression et export Word).",
          "Lorsque vous avez terminé, rouvrez le sélecteur et choisissez « EduWeb · plateforme » pour revenir au contexte plateforme."
        ]
      },
      {
        "title": "Structurer les sites et services d'un établissement",
        "steps": [
          "Après avoir basculé dans l'établissement via le sélecteur, ouvrez « Administration » puis « Sites & services ».",
          "Ajoutez un site avec la carte « Nouveau site », puis un service avec « Nouveau service » : choisissez son « Site de rattachement », son rattachement (« Rattaché à »), et son « Niveau hiérarchique (alignement) » (Automatique, Direction, Sous-Direction, Service ou Sous-service / Bureau) qui aligne visuellement le service à son rang.",
          "Réorganisez la hiérarchie par glisser-déposer : faites glisser un service sur un autre pour le rattacher (les cycles sont empêchés), ou déposez-le au niveau racine pour le détacher de tout parent.",
          "Cliquez l'icône « Membres » d'un service pour désigner un « Responsable » et ajouter des agents en sélection multiple (cases à cocher, champ de recherche, « Tout sélectionner », puis « Ajouter (N) ») ; vous pouvez y inscrire un membre de l'établissement ou un inscrit sans institution, qui sera alors rattaché.",
          "Pour retirer un agent, cliquez la croix en face de son nom ; pour supprimer un service, assurez-vous qu'il est vide (sans agent, ressource ni sous-service) puis utilisez l'icône corbeille et confirmez."
        ]
      },
      {
        "title": "Organiser une compétition et arbitrer",
        "steps": [
          "Ouvrez « Gestion » puis « Compétitions », remplissez la carte « Nouvelle compétition » (« Intitulé », « Jeu », « Niveau ») et cliquez « Créer la compétition ».",
          "Ouvrez la compétition pour afficher la vue arbitre, puis communiquez le « Code de session » (ou le lien) : chaque compétiteur le saisit dans le champ « Rejoindre » de l'accueil du Sport cérébral, ou ouvre directement le lien ; le bouton « Ouvrir la page joueur » donne accès à l'écran que chaque compétiteur rejoint.",
          "Pilotez l'état avec les boutons « Ouvrir (inscriptions) », « Démarrer » puis « Clore » (un bouton « Supprimer » permet de retirer la compétition).",
          "Suivez le « Classement » qui se met à jour automatiquement, puis clôturez la compétition pour délibérer."
        ]
      },
      {
        "title": "Gérer votre compte et dépanner",
        "steps": [
          "Ouvrez « Mon compte » (section « Principal ») pour vérifier vos informations (nom, e-mail, établissement) et vos rôles.",
          "Dans « Changer mon mot de passe », saisissez le mot de passe actuel, le nouveau (au moins 8 caractères) et sa confirmation, puis cliquez « Mettre à jour le mot de passe ».",
          "Si une page affiche une erreur ou qu'un « Enregistrer » reste sans effet, rechargez la page : la base de données peut être momentanément en veille.",
          "Pour disposer de ce guide hors ligne, ouvrez le « Centre d'aide » (section « Aide ») et utilisez « Mon guide (PDF) » ou « Mon guide (Word) »."
        ]
      }
    ]
  },
  "ORG_ADMIN": {
    "title": "Guide de l'administrateur d'organisation",
    "intro": "Ce support de formation s'adresse à l'administrateur d'organisation d'EduWeb Booking — dans l'interface, votre rôle porte exactement le libellé « Administrateur d'organisation ». C'est la personne qui pilote son établissement (désigné « institution » sur les pages publiques et « organisation » dans les écrans d'administration) : son identité et son logo, sa structure en sites et services, ses comptes utilisateurs et leurs rôles, ses ressources et réservations, sa bibliothèque, ses certificats et ses paramètres. Son objectif pédagogique est de vous rendre pleinement autonome, depuis la configuration initiale de l'organisation jusqu'au pilotage statistique, en suivant pas à pas les libellés réels de l'interface. Ce guide couvre uniquement les actions effectivement permises à votre rôle ; la section « Plateforme » (Supervision EduWeb, Gouvernement & ministères, Établissements, Réglages des jeux, Diagnostics CERTEL, Sécurité & sessions) reste réservée à l'administrateur système (super administrateur), qui peut toutefois intervenir dans votre établissement via le sélecteur d'institution.",
    "can": [
      "Paramétrer l'identité de votre organisation et téléverser son logo (« Administration › Organisation »), qui s'affiche ensuite à la place du sigle dans le sélecteur d'institutions.",
      "Structurer votre établissement en profondeur libre (Organisation › Site › Service › sous-services) et réorganiser l'arborescence par glisser-déposer dans « Sites & services ».",
      "Désigner un responsable et ajouter plusieurs agents par service via la fenêtre « Membres », y compris des personnes inscrites sans institution.",
      "Créer des comptes un par un (« Créer l'utilisateur ») ou importer une cohorte par fichier CSV en glisser-déposer, attribuer les rôles (sauf Super Administrateur) et le service de rattachement.",
      "Valider ou refuser les demandes d'inscription de votre établissement (« Demandes de comptes »), réinitialiser un mot de passe, suspendre ou réactiver un compte.",
      "Configurer et délivrer des attestations numérotées avec cachet et signature scannés, puis les imprimer, les exporter en Word ou les révoquer (« Certificats »).",
      "Régler les paramètres de réservation (langue, fuseau, horaires, jours ouvrés, validation automatique), consulter la matrice « Rôles & permissions » (en lecture seule) et suivre votre « Abonnement ».",
      "Gérer les catégories et les ressources, valider les réservations en attente (« À valider »), suivre les « Statistiques » et exporter des « Rapports ».",
      "Administrer la bibliothèque de bout en bout : déposer, vérifier les dépôts, gérer collections et domaines, suivre les emprunts et les statistiques documentaires.",
      "Organiser des compétitions sur l'espace Sport cérébral, jouer aux jeux cognitifs et sécuriser votre propre accès depuis « Mon compte »."
    ],
    "sections": [
      {
        "title": "Renseigner l'identité et le logo de l'organisation",
        "steps": [
          "Dans la barre latérale, dépliez la section « Administration » puis ouvrez « Organisation ».",
          "Sous « Informations générales », renseignez le « Nom de l'organisation », le « Sigle », la « Ville » et l'« Adresse ».",
          "Dans « Logo de l'institution », glissez-déposez une image (PNG, JPEG ou WebP) sur la zone prévue, ou cliquez pour la sélectionner : elle s'affichera à la place du sigle dans le sélecteur d'institutions.",
          "Choisissez au besoin la « Couleur principale » à l'aide du sélecteur de couleur, puis cliquez sur « Enregistrer » (le bouton affiche « Enregistrement… » le temps de la sauvegarde) ; le bandeau « Modifications enregistrées. » confirme l'opération."
        ]
      },
      {
        "title": "Construire la structure : sites et services",
        "steps": [
          "Dans « Administration », ouvrez « Sites & services » : la page rappelle la logique Organisation › Site › Service › Ressources.",
          "Dans la carte « Nouveau site », saisissez le « Nom » (et, en option, le « Code » et la « Ville »), puis cliquez « Ajouter le site ».",
          "Dans la carte « Nouveau service », saisissez le « Nom » (et, en option, le « Code »), choisissez le « Site de rattachement », et, si vous créez un sous-service, le parent dans « Rattaché à (optionnel) ».",
          "Réglez le « Niveau hiérarchique (alignement) » — Direction, Sous-Direction, Service, Sous-service / Bureau, ou « Automatique » — pour aligner visuellement le service à son rang, indépendamment de son rattachement, puis cliquez « Ajouter le service ».",
          "Pour réorganiser, saisissez un service par sa poignée et faites-le glisser sur un autre service pour l'y rattacher (les cycles sont empêchés), ou déposez-le au niveau racine pour le sortir de sa hiérarchie.",
          "Pour ajuster un service, utilisez l'icône crayon (« Modifier ») ; un service entièrement vide (sans agent, ressource ni sous-service) peut être supprimé via l'icône corbeille. Un site sans ressource peut lui aussi être supprimé via l'icône corbeille."
        ]
      },
      {
        "title": "Affecter les membres d'un service (responsable et agents)",
        "steps": [
          "Toujours dans « Sites & services », cliquez sur l'icône représentant des personnes en regard d'un service pour ouvrir la fenêtre « Membres ».",
          "Sous « Ajouter des agents », utilisez le champ de recherche puis cochez les personnes souhaitées ; le bouton « Tout sélectionner » coche d'un coup la liste filtrée.",
          "Cliquez sur « Ajouter (N) » pour rattacher en une fois tous les agents cochés ; vous pouvez choisir des membres de l'établissement comme des personnes inscrites « sans institution » (elles sont alors rattachées à votre établissement).",
          "Dans la liste « Agents », retirez une personne avec la croix en bout de ligne ; sous « Responsable », sélectionnez l'agent à désigner comme responsable du service (le changement est enregistré immédiatement)."
        ]
      },
      {
        "title": "Créer les comptes utilisateurs (un par un ou par cohorte)",
        "steps": [
          "Dans « Administration », ouvrez « Utilisateurs » : la liste de gauche présente tous les comptes, la colonne de droite permet d'en créer.",
          "Dans la carte « Nouvel utilisateur », saisissez le « Prénom », le « Nom », l'« E-mail » et, en option, la « Fonction ».",
          "Choisissez le « Rôle » dans la liste déroulante (tous les rôles sauf Super Administrateur) et, si pertinent, le « Service » de rattachement, puis cliquez « Créer l'utilisateur » : le compte est créé avec le mot de passe par défaut « password123 », à changer à la première connexion.",
          "Pour une cohorte, repérez la carte « Import par cohorte (CSV) », cliquez « Télécharger le modèle CSV » et complétez les colonnes prenom, nom, email, fonction, role, matricule.",
          "Glissez-déposez votre fichier dans la zone « Glissez-déposez ou choisissez un fichier CSV », puis cliquez « Importer » ; la colonne « role » accepte la clé (ex. RESOURCE_MANAGER) ou le libellé (ex. « Responsable de ressource »), une valeur vide ou inconnue donnant « Demandeur ». Les comptes importés sont créés actifs avec le mot de passe « password123 ».",
          "Vérifiez le compte-rendu : nombre de comptes créés et ignorés, et liste des erreurs éventuelles."
        ]
      },
      {
        "title": "Traiter les demandes de comptes et gérer les accès",
        "steps": [
          "Dans « Administration », ouvrez « Demandes de comptes » (un badge dans le menu indique le nombre en attente) : vous y voyez les inscriptions adressées à votre établissement.",
          "Examinez chaque fiche (identité, e-mail, fonction, rôle demandé et ancienneté de la demande).",
          "Cliquez sur « Valider » pour activer le compte — la personne est alors informée par e-mail qu'elle peut se connecter —, ou sur « Refuser » puis « Refuser la demande » pour le supprimer (la personne en est informée par e-mail).",
          "Depuis « Utilisateurs », réinitialisez un mot de passe avec l'icône clé (retour à « password123 ») ou suspendez / réactivez un compte avec l'icône d'alimentation ; ces actions ne sont pas proposées sur votre propre compte."
        ]
      },
      {
        "title": "Configurer et délivrer des certificats",
        "steps": [
          "Dans « Administration », ouvrez « Certificats » (page « Certificats & attestations »).",
          "Sous « Configuration de l'établissement », renseignez le « Signataire (nom) » et sa « Qualité du signataire », téléversez la « Signature scannée » et le « Cachet scanné » par glisser-déposer ou clic, ajustez le « Préfixe de numérotation » (le « Prochain numéro » s'affiche en aperçu), puis cliquez « Enregistrer la configuration ».",
          "Sous « Délivrer une attestation », choisissez un bénéficiaire parmi les comptes existants (ou saisissez son nom dans « Nom du bénéficiaire »), précisez le « Parcours / rôle suivi », l'« Intitulé du certificat », la « Durée de la formation » et la « Mention », puis cliquez « Délivrer le certificat » (le numéro est attribué automatiquement).",
          "Dans le « Journal des certificats délivrés », cliquez « Voir » pour l'imprimer, « Word » pour l'exporter en document modifiable, ou « Révoquer » (avec confirmation) pour annuler un certificat tout en le conservant, marqué « Révoqué », dans le journal."
        ]
      },
      {
        "title": "Régler les paramètres, consulter les rôles et l'abonnement",
        "steps": [
          "Dans « Administration », ouvrez « Paramètres » : sous « Général », choisissez la « Langue » (Français / Anglais) et le « Fuseau horaire » ; sous « Horaires d'ouverture », fixez l'« Ouverture », la « Fermeture » et cochez les « Jours ouvrés ».",
          "Sous « Validation », cochez si besoin « Autoriser la validation automatique lorsque la ressource est disponible », puis cliquez « Enregistrer les paramètres ».",
          "Ouvrez « Rôles & permissions » pour consulter la matrice des droits : à votre rôle elle s'affiche en lecture seule (la personnalisation des permissions est réservée à l'administrateur système).",
          "Ouvrez « Abonnement » pour vérifier votre formule, le nombre de comptes autorisés, le statut, la date de renouvellement et l'usage (utilisateurs, ressources, réservations) ; le bouton « Changer de formule » présente les offres."
        ]
      },
      {
        "title": "Gérer ressources, catégories et réservations",
        "steps": [
          "Dans la section « Gestion », ouvrez « Catégories » et cliquez « Nouvelle catégorie » pour définir un type de ressource (nom, description, mode de validation, icône et couleur), puis validez la création ; une catégorie qui contient des ressources ne peut pas être supprimée.",
          "Ouvrez « Ressources » pour créer ou ajuster vos salles, salles multimédias, matériels et services, et fixer leurs règles de réservation.",
          "Ouvrez « À valider » pour approuver ou refuser les réservations en attente (un badge indique le nombre) ; un refus s'accompagne d'un motif communiqué au demandeur.",
          "Suivez l'activité dans « Réservations » (toutes les réservations de l'établissement), puis dans « Statistiques », et produisez des exports filtrés au format CSV ou PDF depuis « Rapports »."
        ]
      },
      {
        "title": "Administrer la bibliothèque",
        "steps": [
          "Dans la section « Bibliothèque », ouvrez « Explorer » pour rechercher un document, et « Déposer » pour ajouter un nouveau document au fonds.",
          "Ouvrez « À vérifier » pour contrôler et publier les dépôts en attente de validation (un badge en signale le nombre).",
          "Organisez le fonds via « Collections » et « Domaines », et suivez la circulation dans « Réservations doc. » et « Emprunts ».",
          "Consultez « Statistiques doc. » pour piloter l'usage de la bibliothèque (consultations, téléchargements, emprunts)."
        ]
      },
      {
        "title": "Animer le Sport cérébral et sécuriser votre compte",
        "steps": [
          "Dans « Gestion », ouvrez « Compétitions », puis dans « Nouvelle compétition » saisissez l'« Intitulé », choisissez le « Jeu » et le « Niveau » et cliquez « Créer la compétition ».",
          "Ouvrez la compétition pour partager le « Code de session » (et le lien, via « Ouvrir la page joueur »), pilotez son déroulé (« Ouvrir (inscriptions) », « Démarrer », « Clore », « Supprimer ») et suivez le « Classement » qui se rafraîchit automatiquement ; chaque joueur rejoint depuis son appareil en saisissant le code.",
          "Depuis « Sport cérébral », entraînez-vous aux jeux cognitifs (9 jeux, 3 niveaux, consignes écrites et audio), suivez vos scores et badges et relevez le « Défi du jour » ; la « Banque de questions » et les « Réglages des jeux » relèvent du super administrateur et ne vous sont pas accessibles.",
          "Dans la section « Principal », ouvrez « Mon compte », saisissez votre « Mot de passe actuel » puis un « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation, et cliquez « Mettre à jour le mot de passe » ; pensez aussi à télécharger votre guide depuis le « Centre d'aide » en PDF ou en Word, et, si la déconnexion automatique après inactivité est activée, à cliquer « Rester connecté » sur l'avertissement pour ne pas être déconnecté."
        ]
      }
    ]
  },
  "RESOURCE_MANAGER": {
    "title": "Guide du responsable de ressource",
    "intro": "Ce support de formation s'adresse aux responsables de ressource d'EduWeb Booking (clé RESOURCE_MANAGER), chargés du parc de ressources de leur établissement : salles, salles multimédias, matériels et services. À l'issue de ce guide, vous saurez créer et paramétrer vos ressources, gérer les postes des salles multimédias, traiter les demandes de réservation soumises à validation, et suivre l'activité grâce au calendrier, aux statistiques et aux rapports. Toutes les actions décrites s'appuient sur les libellés exacts de l'application. Votre rôle est centré sur la gestion de vos ressources et la décision sur les demandes associées : vous n'administrez pas l'établissement (organisation, sites, utilisateurs, rôles, abonnement). À noter également : vous pouvez créer et modifier des ressources mais pas les supprimer ni gérer les catégories (cela relève de l'administrateur) ; côté bibliothèque, vous pouvez consulter et télécharger les documents autorisés, mais pas en déposer.",
    "can": [
      "Créer et modifier des ressources (salles, matériels, services) et définir leurs règles de réservation via « Nouvelle ressource » (la suppression d'une ressource relève de l'administrateur).",
      "Gérer les salles multimédias : « Ajouter une salle » et ajuster le nombre de « Postes » sur le plan de salle.",
      "Rendre une ressource indisponible en réglant son « Statut » (« En maintenance », « Hors service » ou « Indisponible ») et la rouvrir en le repassant à « Disponible ».",
      "Traiter les demandes soumises à validation depuis « À valider » : « Approuver » une demande conforme, ou la « Refuser » avec un motif communiqué au demandeur.",
      "Suivre l'activité via « Calendrier », « Réservations » (« Toutes les réservations ») et « Statistiques » (« Statistiques & pilotage »).",
      "Exporter des rapports d'usage au format CSV ou PDF depuis « Rapports » (par période, ressource, catégorie, site/service, utilisateur ou statut).",
      "Consulter et télécharger les documents autorisés de la bibliothèque depuis « Explorer » et « Documents » (le dépôt de documents n'est pas accessible à ce rôle).",
      "Vous entraîner sur « Sport cérébral » (jeux cognitifs, scores et « Défi du jour »), évaluer votre niveau numérique avec le diagnostic CERTEL depuis l'accueil, et sécuriser votre accès via « Mon compte »."
    ],
    "sections": [
      {
        "title": "Créer et paramétrer une ressource",
        "steps": [
          "Dans le menu « Gestion », ouvrez « Ressources », puis cliquez sur « Nouvelle ressource ».",
          "Section « Informations générales » : renseignez le « Nom de la ressource », le « Code », la « Catégorie », et si besoin le « Site », le « Niveau » puis le « Service », ainsi qu'une « Description ».",
          "Section « Capacité & disponibilité » : choisissez le « Statut », désignez un « Responsable », indiquez la « Capacité (places) », la « Quantité totale », la « Localisation » et les « Équipements (séparés par des virgules) ».",
          "Section « Règles de réservation » : fixez le « Mode » (« Exclusive (créneau entier) », « Partagée (par quantité) » ou « Mixte »), la « Durée max. (minutes) » et le « Préavis min. (heures) ».",
          "Cochez « Soumettre les réservations à validation » pour que les demandes passent par votre approbation ; cochez « Réservation poste par poste (plan de salle) » pour une salle dont la capacité correspond à un nombre de postes réservables individuellement.",
          "Cliquez sur « Créer la ressource ». Pour modifier une ressource existante, ouvrez sa fiche, cliquez sur « Modifier », ajustez les champs voulus, puis terminez par « Enregistrer les modifications »."
        ]
      },
      {
        "title": "Gérer les salles multimédias et leurs postes",
        "steps": [
          "Dans le menu « Principal », ouvrez « Salles multimédias » : la page « Salles multimédias — plan des postes » affiche la disponibilité en temps réel (postes libres et occupés).",
          "Pour ajouter une salle, cliquez sur « Ajouter une salle » : dans la fenêtre « Nouvelle salle multimédia », renseignez le « Nom de la salle » et la « Capacité (nombre de postes) », puis cliquez sur « Créer la salle ». La salle est créée avec un plan de postes et un code automatiques, et le message « Salle ajoutée avec succès. » confirme l'opération.",
          "Pour modifier le nombre de postes d'une salle, utilisez le compteur « Postes » au bas de sa carte (boutons moins / plus ou saisie directe du nombre).",
          "Validez le nouveau nombre de postes en cliquant sur la coche (« Enregistrer la capacité ») : le message « Capacité mise à jour. » confirme l'enregistrement.",
          "Note : la plateforme refuse de réduire la capacité en dessous d'un poste déjà réservé ; un message vous indique alors le nombre minimum de postes à conserver."
        ]
      },
      {
        "title": "Rendre une ressource indisponible (maintenance, panne)",
        "steps": [
          "Dans le menu « Gestion », ouvrez « Ressources », ouvrez la fiche de la ressource concernée, puis cliquez sur « Modifier ».",
          "Dans la section « Capacité & disponibilité », ouvrez la liste « Statut ».",
          "Sélectionnez « En maintenance » pour une intervention planifiée, « Hors service » en cas de panne, ou « Indisponible » pour un retrait temporaire.",
          "Cliquez sur « Enregistrer les modifications » : la ressource n'est plus réservable tant que son statut n'est pas remis sur « Disponible ».",
          "Pour la rouvrir, revenez sur « Modifier », repassez le « Statut » à « Disponible » et enregistrez."
        ]
      },
      {
        "title": "Traiter les demandes de réservation à valider",
        "steps": [
          "Dans le menu « Gestion », ouvrez « À valider » : la page « Demandes à valider » liste les demandes en attente (un badge dans le menu en indique le nombre, et un compteur « … demande(s) en attente » s'affiche en haut de la liste ; lorsque tout est traité, le message « Tout est à jour » apparaît).",
          "Ouvrez une demande pour vérifier, dans les « Détails de la réservation », le « Créneau », la « Durée », le « Type d'usage », l'« Effectif » et, le cas échéant, la « Quantité » ou les « Postes réservés », puis dans « Motif & besoins » le motif et, dans l'encart « Demandeur », son identité.",
          "Si la demande est conforme, cliquez sur « Approuver ».",
          "Pour refuser, cliquez sur « Refuser » : dans la fenêtre « Refuser la demande », saisissez le « Motif du refus » puis cliquez sur « Confirmer le refus ».",
          "Le motif est communiqué au demandeur et la demande disparaît alors de la liste « À valider »."
        ]
      },
      {
        "title": "Suivre l'activité, les statistiques et les rapports",
        "steps": [
          "Dans le menu « Principal », ouvrez « Calendrier » pour visualiser les créneaux occupés et planifier la disponibilité des ressources.",
          "Dans le menu « Gestion », ouvrez « Réservations » (« Toutes les réservations ») pour suivre l'ensemble des demandes ; filtrez par statut ou recherchez par code, motif ou ressource.",
          "Ouvrez « Statistiques » (« Statistiques & pilotage ») pour consulter les indicateurs clés (« Total réservations », « Taux d'occupation », « Taux de validation », « Taux d'annulation ») ainsi que les graphiques « Répartition par statut », « Répartition par catégorie » et « Ressources les plus réservées ».",
          "Ouvrez « Rapports » pour produire un export : choisissez le périmètre (par période, par ressource, par catégorie, par site / service, par utilisateur ou par statut) puis exportez au format CSV ou PDF.",
          "Appuyez-vous sur ces indicateurs pour ajuster les règles, le statut et la capacité de vos ressources."
        ]
      },
      {
        "title": "Consulter la bibliothèque, Sport cérébral et CERTEL",
        "steps": [
          "Dans le menu « Bibliothèque », ouvrez « Explorer » pour rechercher un document par titre, auteur, mot-clé ou code, et le filtrer par type, collection, domaine et niveau d'accès.",
          "Ouvrez la fiche d'un document pour le consulter, et téléchargez-le lorsque son niveau d'accès le permet (le dépôt de nouveaux documents n'est pas accessible à votre rôle).",
          "Dans le menu « Principal », ouvrez « Sport cérébral » pour suivre vos scores, votre progression et vos badges, puis cliquez sur « Jouer » pour vous entraîner ; relevez le « Défi du jour » proposé en haut de la page (bouton « Relever le défi ») pour cultiver votre régularité.",
          "Depuis la page d'accueil, vous pouvez aussi lancer le diagnostic CERTEL (test de niveau numérique et IA) pour situer vos compétences et découvrir le programme de formation associé."
        ]
      },
      {
        "title": "Gérer mon compte et obtenir de l'aide",
        "steps": [
          "Dans le menu « Principal », ouvrez « Mon compte » : la page affiche votre identité, votre établissement et votre rôle.",
          "Dans l'encart « Changer mon mot de passe », saisissez votre « Mot de passe actuel », puis le « Nouveau mot de passe » (au moins 8 caractères) et « Confirmer le nouveau mot de passe », et cliquez sur « Mettre à jour le mot de passe » (le message « Mot de passe modifié avec succès. » confirme l'opération).",
          "Si la déconnexion automatique après inactivité est activée par l'administrateur, un avertissement « Toujours là ? » s'affiche avant l'expiration : cliquez sur « Rester connecté » pour prolonger votre session.",
          "Dans le menu « Aide », ouvrez le « Centre d'aide » pour retrouver ce guide, le consulter en ligne et le télécharger en PDF ou en Word ; utilisez « Support » pour contacter l'assistance.",
          "Sur smartphone, retrouvez ces mêmes rubriques via la barre d'onglets en bas de l'écran, le bouton flottant d'action et le menu latéral."
        ]
      }
    ]
  },
  "VALIDATOR": {
    "title": "Guide du validateur hiérarchique",
    "intro": "Ce support de formation s'adresse aux validateurs hiérarchiques (responsables de service, chefs de département) chargés d'approuver, de refuser ou de reporter les demandes de réservation soumises à validation dans EduWeb Booking. À l'issue de cette formation, vous saurez traiter les demandes en attente de manière conforme et tracée, suivre l'activité de réservation de votre organisation et utiliser les fonctions personnelles de votre compte. Le rôle « Validateur hiérarchique » est centré sur la décision : vous consultez les ressources, le calendrier et les statistiques, mais vous ne les administrez pas, et vous ne gérez ni les comptes ni les paramètres de l'établissement. Point important à retenir : vous ne pouvez pas valider une demande que vous avez vous-même déposée — elle sera obligatoirement traitée par un autre validateur.",
    "can": [
      "Consulter les demandes de réservation en attente dans « À valider » : un badge affiché dans le menu indique en permanence leur nombre.",
      "Examiner chaque demande en détail (créneau, ressource, motif, besoins, demandeur, historique) avant de vous prononcer.",
      "Approuver une demande conforme, ou la refuser en justifiant votre décision par un motif obligatoire : le demandeur est notifié automatiquement et votre décision reste tracée.",
      "Consulter l'ensemble des réservations de l'organisation depuis « Réservations » et les rechercher ou les filtrer par statut, code, motif ou ressource.",
      "Consulter en lecture seule le « Calendrier », les « Ressources » et les « Salles multimédias », sans pouvoir les modifier.",
      "Suivre les indicateurs de pilotage dans « Statistiques » (taux de validation, taux d'occupation, demandes en attente, refus, annulations, réservations non honorées).",
      "Créer vos propres réservations et les suivre dans « Mes réservations » (confirmer votre présence, signaler la fin de l'activité, annuler).",
      "Consulter et télécharger les documents autorisés de la bibliothèque numérique, selon leur niveau d'accès.",
      "Vous entraîner sur l'espace « Sport cérébral » (scores, badges, défi du jour) en accédant à la banque de jeux publique.",
      "Gérer votre compte depuis « Mon compte » (informations, mot de passe) et télécharger ce guide en PDF ou en Word depuis le « Centre d'aide »."
    ],
    "sections": [
      {
        "title": "Accéder aux demandes à traiter",
        "steps": [
          "Dans la barre latérale, ouvrez la catégorie « Gestion » puis cliquez sur « À valider ».",
          "Le badge affiché à côté de « À valider » indique en permanence le nombre de demandes en attente.",
          "La page « Demandes à valider » présente chaque demande sous forme de carte, avec la ressource concernée, le créneau, le nom du demandeur, le type d'usage, l'effectif éventuel et le code de la demande.",
          "La mention « X demande(s) en attente » récapitule le volume à traiter ; lorsque tout est traité, le message « Tout est à jour » s'affiche."
        ]
      },
      {
        "title": "Examiner une demande avant de décider",
        "steps": [
          "Sur la carte d'une demande, cliquez sur son intitulé pour ouvrir sa fiche détaillée.",
          "Lisez le bloc « Détails de la réservation » : créneau, durée, type d'usage, effectif, quantité ou postes réservés, et lieu le cas échéant.",
          "Consultez le bloc « Motif & besoins » pour vérifier le motif, les besoins particuliers, l'éventuelle mention « Assistance technique demandée » et la « Note du demandeur ».",
          "Identifiez le demandeur dans le bloc « Demandeur » (nom et fonction) puis, au besoin, parcourez le bloc « Suivi de la demande » qui retrace tout l'historique de la demande."
        ]
      },
      {
        "title": "Approuver ou refuser une demande",
        "steps": [
          "Vous pouvez vous prononcer directement depuis la carte dans « À valider », ou depuis le bloc « Actions » de la fiche détaillée.",
          "Si la demande est conforme, cliquez sur « Approuver » : la réservation passe au statut « Validée ».",
          "Si la demande doit être refusée, cliquez sur « Refuser » : la fenêtre « Refuser la demande » s'ouvre.",
          "Renseignez le champ obligatoire « Motif du refus » — il sera communiqué au demandeur — puis cliquez sur « Confirmer le refus » ; utilisez « Annuler » pour renoncer.",
          "Dans tous les cas, le demandeur reçoit automatiquement une notification de votre décision, et celle-ci est enregistrée dans le bloc « Validation » de la fiche."
        ]
      },
      {
        "title": "Suivre l'activité de réservation et les statistiques",
        "steps": [
          "Ouvrez « Réservations » (catégorie « Gestion ») pour consulter toutes les réservations de votre organisation.",
          "Filtrez la liste avec le sélecteur « Tous les statuts », ou retrouvez une demande précise grâce à la recherche par code, motif ou ressource.",
          "Ouvrez « Calendrier » pour visualiser l'occupation des ressources, et « Ressources » ou « Salles multimédias » pour vérifier une ressource (consultation seule, sans modification possible).",
          "Ouvrez « Statistiques » (« Statistiques & pilotage ») pour suivre les indicateurs clés : « Total réservations », « Cette semaine », « En attente », « Taux d'occupation », « Taux de validation », « Refusées », « Taux d'annulation » et « Non honorées », ainsi que les graphiques « Répartition par statut » et « Répartition par catégorie »."
        ]
      },
      {
        "title": "Créer et gérer vos propres réservations",
        "steps": [
          "Cliquez sur « + Nouvelle réservation » en bas de la barre latérale pour soumettre une demande en votre nom (elle sera traitée par un autre validateur).",
          "Suivez vos demandes dans « Mes réservations » (catégorie « Principal »), réparties entre « À venir » et « Historique », et ouvrez une fiche pour en consulter le détail.",
          "Une fois votre réservation validée et le créneau venu, ouvrez sa fiche et cliquez sur « Je suis arrivé », puis sur « Activité terminée » à la fin de l'activité.",
          "Pour renoncer à l'une de vos réservations encore active, ouvrez sa fiche et cliquez sur « Annuler la réservation », puis confirmez : le créneau est libéré."
        ]
      },
      {
        "title": "Consulter la bibliothèque numérique",
        "steps": [
          "Ouvrez « Explorer » (catégorie « Bibliothèque ») pour rechercher un document par titre, auteur, mot-clé ou code, et le filtrer par type, collection, domaine ou niveau d'accès.",
          "Ouvrez la fiche d'un document autorisé pour consulter ses informations (résumé, métadonnées, mots-clés) et, si la consultation est permise, le lire en ligne via « Consulter ».",
          "Téléchargez le fichier via « Télécharger » lorsque le document l'autorise ; les documents restreints ou confidentiels nécessitent une demande d'accès, et certains téléchargements peuvent être payants.",
          "Parcourez « Documents » pour retrouver, sous forme de tableau, l'ensemble des ressources documentaires accessibles à votre profil."
        ]
      },
      {
        "title": "Utiliser le Sport cérébral et gérer votre compte",
        "steps": [
          "Ouvrez « Sport cérébral » (catégorie « Principal ») pour suivre vos scores, votre progression et vos badges, et relevez le « Défi du jour » via « Relever le défi » ; cliquez sur « Jouer » pour accéder à la banque de jeux publique (3 niveaux, consignes écrites et audio).",
          "Ouvrez « Mon compte » pour vérifier vos informations et votre rôle, puis ouvrez la section « Changer mon mot de passe ».",
          "Saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation, puis cliquez sur « Mettre à jour le mot de passe ».",
          "Dans « Centre d'aide » (catégorie « Aide »), retrouvez ce guide en ligne et téléchargez-le via « Mon guide (PDF) » ou « Mon guide (Word) » pour l'archiver ; en cas de difficulté, ouvrez « Support ».",
          "Si la déconnexion automatique après inactivité est activée pour votre établissement, un avertissement vous proposera de « Rester connecté » avant la fermeture de votre session : pensez à enregistrer vos décisions en cours."
        ]
      }
    ]
  },
  "REQUESTER": {
    "title": "Guide du demandeur",
    "intro": "Ce support de formation s'adresse aux membres d'un établissement (enseignants, personnels, étudiants) titulaires du rôle « Demandeur » dans EduWeb Booking. Il a pour objectif de vous rendre pleinement autonome au quotidien : parcourir les ressources et les salles multimédias, créer et suivre vos réservations, visualiser vos créneaux dans le calendrier, et exploiter la bibliothèque numérique (consulter, télécharger, réserver ou déposer des documents). Vous y trouverez les libellés exacts du menu et des boutons, ainsi que l'ordre précis des actions à effectuer. Bon à savoir : on peut créer un compte sans indiquer d'institution ; c'est alors un administrateur qui vous rattache ensuite à votre établissement et à votre service, après quoi tout votre espace de travail s'active.",
    "can": [
      "Parcourir le catalogue des ressources de l'établissement depuis « Ressources » (menu « Gestion »), avec recherche et filtres (catégorie, statut, site).",
      "Consulter les « Salles multimédias » et leur plan de postes en temps réel (postes verts libres, postes rouges occupés) avant de réserver.",
      "Réserver une ressource (salle, salle multimédia à postes, matériel, service) à l'aide d'un assistant en six étapes.",
      "Choisir vos postes sur le plan de salle, ou réserver la salle entière.",
      "Visualiser vos réservations dans le « Calendrier » (vue mensuelle), naviguer de mois en mois et ouvrir le détail d'une journée.",
      "Suivre l'état de vos demandes (en attente, validée, refusée) depuis « Mes réservations » et recevoir les décisions via la cloche de notifications.",
      "Confirmer votre présence (« Je suis arrivé »), clôturer une activité (« Activité terminée ») et annuler une réservation encore à venir.",
      "Explorer la bibliothèque numérique, consulter et télécharger les documents autorisés (gratuitement ou via un paiement simulé de démonstration), puis réserver ou emprunter un exemplaire physique.",
      "Déposer un document dans la bibliothèque et le retrouver sur sa fiche dédiée après soumission.",
      "Suivre vos demandes documentaires (consultation, emprunt, accès) depuis « Réservations doc. » (menu « Bibliothèque »).",
      "Vous entraîner sur l'espace « Sport cérébral » (scores, progression, badges, défi du jour) et rejoindre une compétition à l'aide d'un code de session.",
      "Évaluer gratuitement votre niveau numérique et IA grâce au diagnostic CERTEL accessible depuis la page d'accueil.",
      "Utiliser l'application sur mobile (barre d'onglets en bas, bouton flottant d'action, menu latéral) avec la même aisance que sur ordinateur.",
      "Consulter votre compte et changer votre mot de passe depuis « Mon compte », et télécharger ce guide en PDF ou en Word depuis le « Centre d'aide »."
    ],
    "sections": [
      {
        "title": "Découvrir les ressources disponibles",
        "steps": [
          "Dans la barre latérale, section « Gestion », ouvrez « Ressources » pour parcourir le catalogue de l'établissement (salles, salles multimédias, matériels, services).",
          "Utilisez la barre de recherche (« Rechercher par nom, code ou lieu… ») et les filtres déroulants (catégorie, statut, et site lorsque plusieurs sites existent) pour cibler ce dont vous avez besoin.",
          "Ouvrez la fiche d'une ressource pour consulter sa description, sa capacité, sa localisation et son état de disponibilité (« Disponible maintenant », « Occupée actuellement » ou « Non réservable »).",
          "Depuis la fiche ou la liste, lancez directement une demande avec le bouton « Réserver » lorsque la ressource est réservable.",
          "Pour les salles d'ordinateurs, préférez « Salles multimédias » (menu « Principal »), qui affiche en plus le plan des postes en temps réel."
        ]
      },
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
        "title": "Visualiser mes réservations dans le calendrier",
        "steps": [
          "Dans le menu « Principal », ouvrez « Calendrier » : la vue mensuelle affiche vos réservations positionnées jour par jour.",
          "Cliquez sur « Aujourd'hui » pour revenir au mois en cours, ou utilisez les flèches de navigation pour passer au mois précédent ou suivant.",
          "Repérez vos créneaux directement dans les cases du calendrier ; lorsqu'une journée comporte plusieurs réservations, une mention « + N autre(s) » l'indique.",
          "Cliquez sur une journée pour ouvrir le détail des réservations correspondantes.",
          "Retenez que, pour votre rôle, le calendrier n'affiche que vos propres réservations."
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
          "Pour renoncer à une réservation encore à venir, cliquez sur « Annuler la réservation », puis confirmez : le créneau est alors libéré."
        ]
      },
      {
        "title": "Consulter, télécharger et réserver des documents",
        "steps": [
          "Dans le menu « Bibliothèque », ouvrez « Explorer » et recherchez un document (titre, auteur, mot-clé, code) à l'aide de la barre de recherche et des filtres (« Tous les types », « Toutes collections », « Tous domaines », « Tout accès »).",
          "Ouvrez la fiche d'un document, puis dans « Accès au document » cliquez sur « Consulter » pour le lire en ligne lorsque la consultation est autorisée.",
          "Si le téléchargement est autorisé et gratuit, cliquez sur « Télécharger » ; s'il est payant, cliquez sur « Payer et débloquer » (paiement simulé de démonstration).",
          "Document payant réservé aux étudiants de l'ENS d'Abidjan : si le bloc « Étudiant de l'ENS d'Abidjan ? » s'affiche, saisissez votre matricule puis cliquez sur « Télécharger » pour un accès gratuit (le matricule doit correspondre à celui enregistré sur votre compte).",
          "Pour un exemplaire physique, cliquez sur « Réserver / Emprunter », choisissez « Consultation sur place » ou « Emprunt physique », précisez éventuellement le créneau et une note, puis « Envoyer la demande ».",
          "Si le document est restreint, le bouton devient « Demander l'accès » : renseignez votre motif et envoyez ; le message « Votre demande a été transmise au documentaliste. » confirme l'envoi."
        ]
      },
      {
        "title": "Déposer un document dans la bibliothèque",
        "steps": [
          "Dans le menu « Bibliothèque », cliquez sur « Déposer » (ou sur le bouton « Déposer » depuis « Explorer » ou « Documents »).",
          "L'assistant de dépôt comporte sept étapes : « Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits » et « Vérification ».",
          "Renseignez le type, la collection et le domaine, le titre et l'auteur principal (champs obligatoires), puis le résumé et les mots-clés.",
          "À l'étape « Fichier », joignez le fichier si vous le souhaitez (le dépôt du fichier est facultatif et peut se faire plus tard) ; à l'étape « Droits », choisissez le niveau d'accès.",
          "À l'étape « Vérification », cliquez sur « Soumettre le dépôt » : le message « Votre dépôt a été enregistré et soumis à validation. » confirme l'envoi et un code provisoire est attribué.",
          "Vous êtes redirigé vers la fiche de votre document ; le documentaliste le valide, le publie ou demande une correction, et vous êtes informé de sa décision par la cloche de notifications."
        ]
      },
      {
        "title": "Suivre mes demandes documentaires",
        "steps": [
          "Dans le menu « Bibliothèque », ouvrez « Réservations doc. » pour retrouver vos demandes documentaires (consultation, emprunt, accès).",
          "Lisez le statut de chaque demande grâce au badge de couleur affiché à côté du titre du document.",
          "Cliquez sur le titre d'un document pour revenir à sa fiche complète.",
          "Surveillez la cloche de notifications : elle vous prévient lorsqu'une demande est acceptée, refusée ou prête."
        ]
      },
      {
        "title": "S'entraîner au Sport cérébral et rejoindre une compétition",
        "steps": [
          "Dans le menu « Principal », ouvrez « Sport cérébral » pour consulter vos scores, votre progression et vos badges, et relever le « Défi du jour » via « Relever le défi ».",
          "Cliquez sur « Jouer » pour accéder à la banque de jeux publique.",
          "Choisissez un jeu, un niveau (Débutant, Intermédiaire, Avancé), puis « Commencer » ; touchez « Écouter » pour entendre la consigne en audio.",
          "Pour participer à une compétition organisée, repérez l'encart « Compétition » de la banque de jeux (« Vous avez un code de session ? »), saisissez le code dans le champ « CODE », puis cliquez sur « Rejoindre ».",
          "Jouez sur votre appareil : votre score remonte automatiquement dans le classement de la compétition."
        ]
      },
      {
        "title": "Évaluer son niveau avec le diagnostic CERTEL",
        "steps": [
          "Depuis la page d'accueil, repérez le bouton flottant CERTEL et ouvrez le diagnostic de niveau numérique et IA.",
          "Répondez aux questions du test : il est gratuit et ne demande pas de connaissances techniques préalables.",
          "Validez pour obtenir votre niveau (N1, N2 ou N3), calculé et restitué automatiquement.",
          "Consultez le programme CERTEL associé (thèmes et contenus par niveau) pour situer la suite de votre parcours de formation."
        ]
      },
      {
        "title": "Gérer mon compte, le mobile et mon aide",
        "steps": [
          "Dans le menu « Principal », ouvrez « Mon compte » pour vérifier vos informations (nom, e-mail, fonction, établissement et rôle).",
          "Sous « Changer mon mot de passe », saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et « Confirmer le nouveau mot de passe », puis cliquez sur « Mettre à jour le mot de passe » ; le message « Mot de passe modifié avec succès. » confirme l'opération.",
          "Sur smartphone, utilisez la barre d'onglets en bas de l'écran, le bouton flottant d'action et le menu latéral pour retrouver toutes ces fonctions de façon tactile.",
          "Si la déconnexion automatique après inactivité est activée par votre établissement, la fenêtre « Toujours là ? » s'affiche avant l'expiration : cliquez sur « Rester connecté » pour prolonger votre session.",
          "Surveillez la cloche de notifications en haut à droite : elle signale les décisions de validation et autres messages, avec un badge indiquant le nombre de notifications non lues.",
          "Dans le menu « Aide », ouvrez le « Centre d'aide » pour relire ce guide ou le télécharger en PDF (« Mon guide (PDF) ») ou en Word (« Mon guide (Word) ») ; en cas de difficulté, ouvrez « Support »."
        ]
      }
    ]
  },
  "TECHNICIAN": {
    "title": "Guide du technicien / agent d'appui",
    "intro": "Ce support de formation s'adresse aux techniciens et agents d'appui d'EduWeb Booking (clé TECHNICIAN), responsables du bon état de fonctionnement des ressources de leur établissement et du traitement des incidents et des maintenances. Son objectif pédagogique est de vous rendre autonome dans la surveillance de l'état des ressources, le suivi des maintenances planifiées, le repérage des incidents et la lecture du calendrier d'occupation, afin de planifier vos interventions au bon moment et sans gêner les usagers. Votre profil donne un accès en consultation étendu : vous voyez l'ensemble des réservations de l'établissement, le calendrier, les ressources, les salles multimédias et la bibliothèque numérique en lecture. Important : à ce jour, la plateforme n'expose pas, pour votre rôle, d'écran dédié vous permettant de saisir vous-même la déclaration, la prise en charge ou la clôture d'un incident, ni de créer ou modifier une fiche de maintenance ; ces enregistrements sont saisis dans l'outil par un responsable de ressource ou un administrateur, à partir de vos constats de terrain. Vos écrans servent donc à diagnostiquer, repérer et préparer vos interventions, puis à vérifier le retour en service. Votre rôle n'autorise ni la création de réservations, ni la modification de la configuration des ressources, ni l'administration de l'établissement.",
    "can": [
      "Consulter le « Tableau de bord » de l'établissement et repérer, sur l'indicateur « Ressources disponibles », le rapport « disponibles / total » et le nombre de ressources « en maintenance ».",
      "Voir, lorsqu'au moins un incident est ouvert ou en cours, l'encart d'alerte « X incident(s) ouvert(s) » accompagné du message « Des ressources nécessitent une intervention. ».",
      "Parcourir la liste « Ressources » (menu « Gestion ») et ouvrir la fiche détaillée de chaque ressource pour diagnostiquer son état (« Disponible maintenant », « Occupée actuellement » ou « Non réservable »).",
      "Lire sur la fiche d'une ressource l'encart « Maintenance planifiée » (intitulé et période des opérations en cours ou à venir) et la section « Prochaines réservations ».",
      "Consulter le « Calendrier » et la page « Réservations » de tout l'établissement pour placer vos interventions sur des créneaux libres.",
      "Examiner les « Salles multimédias » et la disponibilité des postes en temps réel avant une intervention technique.",
      "Consulter la « Bibliothèque » numérique et « Explorer » le catalogue documentaire en lecture à l'écran.",
      "Vous détendre et entraîner vos capacités cognitives sur l'espace « Sport cérébral » (9 jeux, 3 niveaux, consignes écrites et audio, scores, badges et « Défi du jour »).",
      "Évaluer votre niveau numérique et IA grâce au diagnostic CERTEL accessible depuis l'accueil, et découvrir le programme de formation.",
      "Gérer votre compte depuis « Mon compte » et retrouver votre guide dans le « Centre d'aide », téléchargeable en PDF et en Word."
    ],
    "sections": [
      {
        "title": "Se connecter et lire l'état général des ressources",
        "steps": [
          "Connectez-vous, puis ouvrez « Tableau de bord » dans le menu « Principal » de la barre latérale : vous accédez à la vue d'ensemble de votre établissement.",
          "Repérez l'indicateur « Ressources disponibles » : il affiche un rapport « disponibles / total » et, en mention complémentaire, le nombre de ressources « en maintenance ».",
          "Lorsqu'au moins un incident est ouvert ou en cours, surveillez l'encart d'alerte « X incident(s) ouvert(s) », accompagné du message « Des ressources nécessitent une intervention. » (cet encart, situé dans la colonne latérale, n'apparaît pas s'il n'y a aucun incident à traiter).",
          "Consultez le « Planning du jour » pour connaître les créneaux déjà occupés et anticiper le meilleur moment pour intervenir.",
          "Sur smartphone ou tablette, retrouvez ces mêmes écrans via la barre d'onglets en bas, le bouton flottant et le menu latéral de l'application mobile."
        ]
      },
      {
        "title": "Diagnostiquer une ressource et lire son état",
        "steps": [
          "Ouvrez « Ressources » dans le menu « Gestion ».",
          "Affinez la recherche avec la barre « Rechercher par nom, code ou lieu… » et les filtres de catégorie, de statut et, si plusieurs sites existent, de site.",
          "Cliquez sur une ressource pour ouvrir sa fiche détaillée.",
          "Lisez l'encart de disponibilité : « Occupée actuellement » (avec l'heure « Libre à partir de »), « Disponible maintenant », ou « Non réservable » lorsque la ressource est hors service ou en maintenance.",
          "Vérifiez la section « Caractéristiques » (capacité, localisation, responsable, mode de réservation) et la liste « Équipements » afin de préparer le matériel et l'accès nécessaires à votre intervention."
        ]
      },
      {
        "title": "Suivre les maintenances planifiées",
        "steps": [
          "Sur la fiche d'une ressource, repérez l'encart « Maintenance planifiée » : il liste l'intitulé et la période de chaque opération en cours ou à venir.",
          "Notez qu'une ressource concernée par une maintenance s'affiche « Non réservable » et n'est donc plus proposée aux usagers sur la période prévue.",
          "Réalisez votre intervention technique sur le terrain durant ce créneau réservé.",
          "La création, la planification, la mise à jour de statut ou la clôture d'une maintenance sont saisies dans l'outil par un responsable de ressource ou un administrateur, à partir de vos comptes rendus.",
          "Une fois la remise en service enregistrée, revenez sur la fiche de la ressource et vérifiez que son état est bien repassé à « Disponible maintenant »."
        ]
      },
      {
        "title": "Repérer et traiter les incidents",
        "steps": [
          "Depuis le « Tableau de bord », surveillez l'encart « X incident(s) ouvert(s) » : il signale qu'une ou plusieurs ressources nécessitent une intervention (la plateforme n'ouvre pas, pour votre rôle, d'écran listant chaque incident individuellement).",
          "Croisez cette alerte avec la liste « Ressources » et le filtre de statut pour identifier les ressources « Non réservable », signe probable d'un dysfonctionnement à traiter.",
          "Intervenez sur le terrain pour diagnostiquer et résoudre l'incident sur la ressource concernée.",
          "Transmettez votre constat et votre compte rendu au responsable de la ressource ou à l'administrateur, qui consigne la déclaration et la clôture de l'incident dans l'outil.",
          "Après résolution, vérifiez sur le « Tableau de bord » que le compteur d'incidents a diminué, et sur la fiche de la ressource qu'elle est de nouveau « Disponible maintenant »."
        ]
      },
      {
        "title": "Situer une intervention grâce au calendrier et aux réservations",
        "steps": [
          "Ouvrez « Calendrier » dans le menu « Principal » : vous y consultez la vue d'ensemble des réservations de l'établissement.",
          "Repérez un créneau libre sur la ressource visée afin d'intervenir sans perturber les usagers.",
          "Pour une vue en liste, ouvrez « Réservations » dans le menu « Gestion » : la page « Toutes les réservations » recense l'ensemble des réservations de l'établissement, avec recherche par code, motif ou ressource et filtre par statut.",
          "Sur la fiche d'une ressource, parcourez la section « Prochaines réservations » pour anticiper précisément sa disponibilité avant l'intervention."
        ]
      },
      {
        "title": "Contrôler les salles multimédias et leurs postes",
        "steps": [
          "Ouvrez « Salles multimédias » dans le menu « Principal » : la page « Salles multimédias — plan des postes » présente toutes les salles avec leur plan et la disponibilité des postes en temps réel.",
          "Pour chaque salle, lisez le compteur de postes « libre(s) / occupé(s) » et repérez visuellement les postes libres (verts) et occupés (rouges).",
          "Survolez un poste occupé pour connaître sa période d'occupation, donc le moment où il redevient disponible.",
          "Servez-vous de cette vue pour planifier une intervention technique sur un poste précis en dehors de ses créneaux d'usage."
        ]
      },
      {
        "title": "Consulter la bibliothèque numérique",
        "steps": [
          "Ouvrez « Bibliothèque » dans le menu « Bibliothèque » : la page « Bibliothèque numérique » présente le fonds documentaire de l'établissement.",
          "Cliquez sur « Explorer » pour rechercher un document par titre, auteur, mot-clé ou code.",
          "Ouvrez « Documents » pour parcourir le catalogue accessible en consultation.",
          "Ouvrez la fiche d'un document autorisé pour le consulter à l'écran ; votre rôle est limité à la lecture et ne permet ni le téléchargement, ni le dépôt, ni la réservation de documents."
        ]
      },
      {
        "title": "Gérer mon compte et mon mot de passe",
        "steps": [
          "Ouvrez « Mon compte » dans le menu « Principal » : vous y voyez votre nom, votre e-mail (et votre fonction), votre établissement et votre rôle.",
          "Dans l'encart « Changer mon mot de passe », saisissez votre « Mot de passe actuel ».",
          "Renseignez le « Nouveau mot de passe » (au moins 8 caractères), puis « Confirmer le nouveau mot de passe ».",
          "Cliquez sur « Mettre à jour le mot de passe » : le message « Mot de passe modifié avec succès. » confirme l'opération.",
          "Si la déconnexion automatique après inactivité est activée par votre établissement, un avertissement vous prévient avant l'expiration : cliquez sur « Rester connecté » pour prolonger votre session."
        ]
      },
      {
        "title": "Trouver de l'aide, s'évaluer et se détendre",
        "steps": [
          "Ouvrez « Centre d'aide » dans le menu « Aide » pour retrouver ce guide adapté à votre rôle.",
          "Cliquez sur « Mon guide (PDF) » pour l'ouvrir en version imprimable, ou sur « Mon guide (Word) » pour en obtenir une version modifiable hors ligne.",
          "Pour une question, ouvrez « Support » : vous y trouvez l'e-mail support@eduweb.ci, le téléphone et les « Questions fréquentes ».",
          "Pour évaluer votre niveau numérique et IA, lancez le diagnostic CERTEL depuis le bouton dédié de la page d'accueil, puis consultez le programme de formation proposé.",
          "Pour une pause, ouvrez « Sport cérébral » dans le menu « Principal », relevez le « Défi du jour » via « Relever le défi » ou lancez une partie avec « Jouer », en vous appuyant sur les consignes écrites et audio de chaque jeu."
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
    "intro": "Ce support de formation s'adresse aux bibliothécaires et documentalistes d'un établissement utilisant EduWeb Booking (rôle LIBRARIAN). Il a pour objectif pédagogique de vous rendre pleinement autonome dans la chaîne de traitement documentaire : contrôle et validation des dépôts, codification, publication au catalogue, organisation du fonds (collections et domaines), suivi des réservations et des emprunts physiques, et pilotage de l'activité par les statistiques. Toutes ces manipulations s'effectuent dans la section « Bibliothèque » de votre tableau de bord, dans le périmètre de votre seul établissement. Votre rôle vous donne aussi accès, dans la section « Principal », au « Calendrier » (en consultation), à l'espace « Sport cérébral » et à « Mon compte ». En revanche, vous ne disposez ni des menus de réservation de salles (« Salles multimédias », « Mes réservations »), ni de la section « Administration » ni de la section « Plateforme » : la gestion de l'établissement, des comptes, des rôles et des paramètres relève de l'administrateur. Chaque procédure ci-dessous cite les libellés exacts des menus et des boutons de l'application.",
    "can": [
      "Contrôler les dépôts en attente depuis « À vérifier », examiner le type, les métadonnées, le fichier et les doublons potentiels signalés, puis valider, demander une correction ou rejeter (chaque décision notifie automatiquement le déposant).",
      "Générer le code documentaire définitif au moment de la validation (il remplace le code provisoire), puis publier ou archiver le document dans le catalogue.",
      "Suivre le cycle de vie complet d'un document depuis sa fiche : statut, accès, code et QR, « Déposé par », « Validé par », « Validé le » et « Publié le », ainsi que l'« Historique & avis ».",
      "Organiser le fonds en gérant les « Collections » et les « Domaines » (création avec nom et code, modification, activation ou désactivation).",
      "Fixer le « Prix de téléchargement (FCFA · 0 = gratuit) » d'un document, dans le cadre d'un paiement simulé (démonstration).",
      "Traiter les « Réservations doc. » (consultation sur place, emprunt physique, demande d'accès) en approuvant ou en refusant chaque demande en attente.",
      "Suivre les « Emprunts » d'exemplaires physiques jusqu'au retour, repérer les retards et enregistrer une restitution avec « Marquer rendu ».",
      "Explorer le catalogue, consulter et télécharger les documents autorisés, récupérer une citation au format APA, et déposer vous-même une ressource via « Déposer ».",
      "Consulter les « Statistiques doc. » (documents, publiés, en attente, réservations, consultations, téléchargements, emprunts en cours, domaines couverts, répartitions et documents les plus consultés) pour piloter l'activité.",
      "Consulter le « Calendrier » des réservations, accéder à l'espace « Sport cérébral » et gérer votre compte et votre mot de passe dans « Mon compte »."
    ],
    "sections": [
      {
        "title": "Découvrir votre espace et repérer vos menus",
        "steps": [
          "Connectez-vous, puis repérez dans la barre latérale la section « Principal » (Accueil, Tableau de bord, Calendrier, Sport cérébral, Mon compte) et surtout la section « Bibliothèque », qui regroupe l'essentiel de votre travail.",
          "Dans « Bibliothèque », vous disposez de dix entrées : « Bibliothèque », « Explorer », « Déposer », « Documents », « À vérifier », « Réservations doc. », « Emprunts », « Statistiques doc. », « Collections » et « Domaines ».",
          "Ouvrez « Bibliothèque » pour une vue d'ensemble du fonds : la page « Bibliothèque numérique » affiche les indicateurs clés (« Documents », « En attente de validation », « Consultations », « Téléchargements »), les « Dépôts mensuels », les répartitions par type et par domaine, les « Derniers dépôts », l'« État du fonds » et, le cas échéant, un encadré « dépôt(s) à vérifier » et des « Alertes » (documents sans fichier, métadonnées incomplètes, doublons).",
          "Notez que les sections « Administration » et « Plateforme », ainsi que les menus « Salles multimédias » et « Mes réservations », ne font pas partie de votre rôle : ils relèvent de l'administrateur de l'établissement."
        ]
      },
      {
        "title": "Contrôler et valider les dépôts en attente",
        "steps": [
          "Dans la section « Bibliothèque », cliquez sur « À vérifier » (un compteur indique le nombre de dépôts en attente) ; la page « Validation documentaire » liste les dépôts à traiter.",
          "Cliquez sur le titre d'un dépôt pour ouvrir sa fiche détaillée et contrôlez le type de document, les métadonnées (auteur principal, co-auteurs, directeur, année, langue, niveau, pages, domaine, collection), le « Résumé », les « Mots-clés » et le fichier joint.",
          "Examinez l'encadré « Doublons potentiels » lorsqu'il apparaît : il indique le titre similaire, le motif et un score de similarité, pour vous aider à éviter les redondances.",
          "Pour accepter : cliquez sur « Valider le document », ajoutez un « Commentaire (facultatif) », cochez au besoin « Publier directement », puis « Valider » — un code documentaire définitif est alors généré en remplacement du code provisoire.",
          "Pour renvoyer le dépôt à son auteur : cliquez sur « Corriger », renseignez les « Précisions » attendues (champ obligatoire), puis « Demander correction ».",
          "Pour écarter le dépôt : cliquez sur « Rejeter », saisissez le « Motif du rejet » (obligatoire, communiqué au déposant), puis « Confirmer le rejet ».",
          "Retenez que chaque décision (validation, correction, rejet) notifie automatiquement le déposant ; vous pouvez aussi lancer la validation directement depuis les boutons présents sous chaque dépôt de la liste « À vérifier »."
        ]
      },
      {
        "title": "Publier, archiver et suivre le cycle de vie d'un document",
        "steps": [
          "Ouvrez la fiche d'un document validé depuis « Documents » (recherche par titre, code ou auteur et filtres par statut et par type) ou depuis « À vérifier ».",
          "Dans l'encadré « Validation documentaire » de la fiche, cliquez sur « Publier » pour rendre le document visible dans le catalogue.",
          "Cliquez sur « Archiver » pour retirer du catalogue un document qui ne doit plus être proposé.",
          "Consultez l'encadré « Code & QR » pour le code et le QR du document ainsi que ses compteurs de consultations et de téléchargements.",
          "Vérifiez le bloc de suivi en bas de fiche : « Déposé par », « Validé par », « Validé le », « Publié le » (et le motif en cas de rejet), ainsi que l'« Historique & avis » qui retrace les décisions successives."
        ]
      },
      {
        "title": "Paramétrer le téléchargement et l'accès payant",
        "steps": [
          "Ouvrez la fiche d'un document et repérez l'encadré « Accès au document ».",
          "Dans le champ « Prix de téléchargement (FCFA · 0 = gratuit) », saisissez le montant souhaité (0 pour un accès libre), puis cliquez sur « Définir ».",
          "Sachez que le paiement présenté aux usagers est simulé (démonstration) : un usager clique sur « Payer et débloquer » pour obtenir le droit de téléchargement ; un prestataire réel pourra être branché ultérieurement.",
          "À l'ENS d'Abidjan, un étudiant peut télécharger gratuitement en saisissant son matricule dans le bloc « Étudiant de l'ENS d'Abidjan ? » puis en cliquant « Télécharger » ; le matricule saisi doit correspondre à celui enregistré sur son compte."
        ]
      },
      {
        "title": "Organiser le fonds : collections et domaines",
        "steps": [
          "Ouvrez « Collections » dans la section « Bibliothèque » pour structurer le fonds par grandes familles documentaires.",
          "Dans l'encadré « Nouvelle collection », renseignez le nom et le code (par exemple nom « Thèses », code « THS »), puis enregistrez ; le code est automatiquement mis en majuscules et une proposition est faite d'après le nom.",
          "Sur chaque ligne, basculez l'état « Active » / « Inactive » ou modifiez le nom et le code ; le compteur indique le nombre de documents rattachés.",
          "Ouvrez « Domaines » pour classer les ressources par disciplines ; dans l'encadré « Nouveau domaine », saisissez nom et code (par exemple « Robotique » / « ROB »).",
          "Activez ou désactivez un domaine (« Actif » / « Inactif ») selon les besoins ; seules les collections et domaines actifs sont proposés au moment d'un dépôt."
        ]
      },
      {
        "title": "Traiter les réservations documentaires",
        "steps": [
          "Ouvrez « Réservations doc. » : la page « Réservations documentaires » liste les demandes (consultation sur place, emprunt physique, demande d'accès) avec le document concerné, le demandeur, le type et le statut.",
          "Sur une demande au statut « En attente », cliquez sur le bouton vert pour l'approuver ou sur le bouton de refus (croix) pour la rejeter ; le demandeur est notifié de la décision.",
          "Retenez qu'une demande d'emprunt approuvée crée automatiquement un prêt avec une échéance de retour fixée à 14 jours et décrémente la disponibilité physique de l'exemplaire.",
          "Cliquez sur le titre d'un document pour ouvrir sa fiche et vérifier le niveau d'accès, la disponibilité physique et l'historique avant de décider."
        ]
      },
      {
        "title": "Suivre et clôturer les emprunts physiques",
        "steps": [
          "Ouvrez « Emprunts » : la page « Emprunts » présente les exemplaires physiques sortis avec l'emprunteur et la date de « Retour prévu ».",
          "Repérez les retards grâce au statut « En retard » qui s'affiche lorsque la date de retour prévu est dépassée.",
          "À la restitution d'un exemplaire, cliquez sur « Marquer rendu » : la disponibilité physique du document est alors recréditée et la date de retour enregistrée.",
          "Au besoin, cliquez sur le titre du document pour revenir à sa fiche et vérifier le nombre d'exemplaires de nouveau disponibles."
        ]
      },
      {
        "title": "Explorer, déposer et suivre l'activité documentaire",
        "steps": [
          "Ouvrez « Explorer » pour rechercher dans le catalogue par titre, auteur, mot-clé ou code, et filtrer par type, collection, domaine ou niveau d'accès.",
          "Ouvrez la fiche d'un document pour le « Consulter » ou le « Télécharger » (selon les autorisations) et récupérer sa référence dans l'encadré « Citer ce document » (format APA).",
          "Pour ajouter une ressource, cliquez sur « Déposer » (depuis le menu ou le bouton « Déposer » présent en haut des pages « Bibliothèque », « Explorer » et « Documents »), parcourez les sept étapes (Type, Métadonnées, Auteurs, Résumé, Fichier, Droits, Vérification) puis « Soumettre le dépôt » ; un code provisoire est attribué, le code définitif l'étant à la validation.",
          "Ouvrez « Statistiques doc. » pour suivre les indicateurs : « Documents », « Publiés », « En attente », « Réservations », « Consultations », « Téléchargements », « Emprunts en cours » et « Domaines couverts », ainsi que les « Dépôts mensuels », les répartitions par type, par domaine et par année, et les « Documents les plus consultés »."
        ]
      },
      {
        "title": "Calendrier, compte et espace Sport cérébral",
        "steps": [
          "Dans la section « Principal », ouvrez « Calendrier » pour visualiser, en consultation, les réservations dans le temps.",
          "Ouvrez « Mon compte » pour vérifier vos informations (nom, e-mail, établissement, rôle) et, dans « Changer mon mot de passe », saisir le « Mot de passe actuel » puis le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation avant de cliquer sur « Mettre à jour le mot de passe ».",
          "Ouvrez « Sport cérébral » pour consulter vos scores, votre progression et vos badges, relever le « Défi du jour » et cliquer sur « Jouer » ; la configuration des jeux et des compétitions relève de l'administration de la plateforme et n'est pas accessible à votre rôle.",
          "Si la déconnexion automatique après inactivité est activée par l'administrateur, un avertissement s'affiche avant l'expiration de la session : cliquez sur « Rester connecté » pour la prolonger.",
          "En cas de message « Une erreur est survenue » ou d'enregistrement sans effet, rechargez la page : la base de données peut être momentanément en veille. Vous pouvez aussi télécharger l'aide en PDF et en Word depuis le « Centre d'aide »."
        ]
      }
    ]
  },
  "DEPOSITOR": {
    "title": "Guide du déposant",
    "intro": "Ce support de formation s'adresse aux déposants d'EduWeb Booking — enseignants, chercheurs, étudiants ou personnels chargés d'alimenter la bibliothèque numérique de leur établissement. Son objectif pédagogique est de vous rendre pleinement autonome dans le dépôt d'une ressource documentaire, le suivi de sa validation par le documentaliste, ainsi que la consultation et la réservation du fonds, en n'utilisant que les fonctions réellement ouvertes à votre rôle. Chaque procédure cite les libellés exacts des menus et des boutons de l'application. Votre rôle donne accès à quatre actions documentaires : consulter le catalogue autorisé, déposer une ressource, télécharger les documents permis, et réserver ou emprunter un document. Les fonctions de validation documentaire (« À vérifier », « Emprunts »), de pilotage de la bibliothèque (« Statistiques doc. »), de gestion du fonds (« Collections », « Domaines »), de réservation de salles (« Calendrier », « Salles multimédias », « Mes réservations ») et d'administration ne relèvent pas de votre rôle : il est normal que ces menus n'apparaissent pas dans votre barre latérale.",
    "can": [
      "Déposer une ressource documentaire (mémoire, article scientifique, thèse, rapport, support pédagogique, guide, manuel, etc.) à l'aide de l'assistant « Déposer » en sept étapes.",
      "Renseigner le type, la collection, le domaine, les métadonnées, les auteurs, le résumé et les mots-clés, puis joindre un fichier (PDF recommandé, facultatif au dépôt).",
      "Définir les droits d'accès de votre dépôt : niveau d'accès, autorisation de téléchargement, exemplaires physiques et prix de téléchargement.",
      "Suivre le statut de vos dépôts (« Soumis », « À corriger », « Validé », « Publié », « Rejeté ») et lire dans « Historique & avis » les décisions et commentaires du documentaliste.",
      "Explorer le catalogue autorisé, consulter les documents en ligne (lecture seule, filigrane à votre nom) et les télécharger lorsque c'est permis, y compris régler un téléchargement payant (paiement simulé de démonstration).",
      "Réserver un document pour une consultation sur place ou un emprunt physique, ou demander l'accès à un document restreint, puis suivre votre demande dans « Réservations doc. ».",
      "Copier la référence bibliographique d'un document au format APA depuis l'encadré « Citer ce document ».",
      "Vous détendre sur l'espace « Sport cérébral » (jeux cognitifs, scores, badges, « Défi du jour ») et évaluer votre niveau numérique avec le test CERTEL depuis la page d'accueil.",
      "Gérer votre profil et changer votre mot de passe depuis « Mon compte », et télécharger votre guide depuis le « Centre d'aide » (en PDF ou en Word)."
    ],
    "sections": [
      {
        "title": "Découvrir votre espace et repérer vos menus",
        "steps": [
          "Connectez-vous, puis ouvrez « Tableau de bord » dans la section « Principal » de la barre latérale ; cette section vous donne aussi accès à « Accueil », « Sport cérébral » et « Mon compte ».",
          "Dépliez la section « Bibliothèque » : vous y disposez de cinq entrées — « Bibliothèque », « Explorer », « Déposer », « Documents » et « Réservations doc. ».",
          "Notez que les entrées de validation (« À vérifier », « Emprunts »), de pilotage (« Statistiques doc. ») et de gestion (« Collections », « Domaines ») n'apparaissent pas chez vous : elles relèvent du bibliothécaire et de l'administrateur. De même, les menus de réservation de salles (« Calendrier », « Salles multimédias », « Mes réservations ») et la section « Administration » ne font pas partie de votre rôle.",
          "Pour une vue d'ensemble du fonds, ouvrez « Bibliothèque » : la page « Bibliothèque numérique » affiche les indicateurs « Documents », « En attente de validation », « Consultations » et « Téléchargements », ainsi que la liste « Derniers dépôts ».",
          "Sur téléphone, retrouvez ces mêmes accès via la barre d'onglets en bas de l'écran, le bouton flottant d'action et le menu latéral coulissant."
        ]
      },
      {
        "title": "Déposer une ressource documentaire",
        "steps": [
          "Dans la section « Bibliothèque », cliquez sur « Déposer » (ou sur le bouton « Déposer » présent en haut des pages « Bibliothèque », « Explorer » et « Documents ») : la page « Déposer une ressource » et son assistant en sept étapes s'ouvrent.",
          "Étape « Type » : choisissez le type de document (Mémoire, Article scientifique, Thèse, Rapport, Support pédagogique, Guide, Manuel…), puis sélectionnez la « Collection » et le « Domaine » (tous deux obligatoires) et cliquez sur « Continuer ».",
          "Étape « Métadonnées » : saisissez le « Titre » (obligatoire, au moins 3 caractères), puis si besoin l'« Année », la « Langue », les « Pages » et le « Niveau / diplôme (mémoire, thèse…) ».",
          "Étape « Auteurs » : renseignez l'« Auteur principal » (obligatoire), les « Co-auteurs (séparés par des virgules) » et le « Directeur / encadreur ».",
          "Étape « Résumé » : rédigez le « Résumé » et indiquez les « Mots-clés (séparés par des virgules) ».",
          "Étape « Fichier » : glissez-déposez ou cliquez pour sélectionner le fichier dans « Déposer un fichier (PDF recommandé) » — formats acceptés PDF, DOC, DOCX, ODT, PPT, PPTX, EPUB ; il est facultatif au dépôt et pourra être ajouté plus tard ; pour un article scientifique, complétez les champs « Revue » et « DOI » qui apparaissent.",
          "Étape « Droits » : choisissez le « Niveau d'accès » (Public, Interne, Restreint, Consultation sur place, Emprunt papier, Confidentiel, Embargo), cochez ou non « Autoriser le téléchargement du fichier », indiquez les « Exemplaires physiques disponibles » et le « Prix de téléchargement (FCFA) » (0 = gratuit ; le bibliothécaire et vous-même êtes exemptés du paiement).",
          "Étape « Vérification » : contrôlez le récapitulatif (type, titre, auteur, année, accès, fichier), puis cliquez sur « Soumettre le dépôt » ; un code provisoire est généré, le documentaliste est notifié et le message « Votre dépôt a été enregistré et soumis à validation. » confirme l'envoi.",
          "Astuce : le bandeau latéral « Récapitulatif » résume en continu le type, la collection, le domaine et le niveau d'accès choisis ; vous pouvez aussi cliquer sur une étape déjà validée du fil d'étapes pour y revenir."
        ]
      },
      {
        "title": "Suivre vos dépôts et leurs avis",
        "steps": [
          "Ouvrez « Documents » : la liste présente, pour chaque ressource, son « Statut » (« Soumis », « À corriger », « Validé », « Publié », « Rejeté »…), son code et son niveau d'accès ; vos propres dépôts y figurent toujours, aux côtés des documents du catalogue qui vous sont visibles.",
          "Filtrez au besoin avec les menus « Tous les statuts » ou « Tous les types », ou recherchez avec « Titre, code, auteur… ».",
          "Cliquez sur une ligne pour ouvrir la fiche : la rubrique « Historique & avis » détaille les décisions et commentaires du documentaliste (validation, correction demandée, rejet, ou avis scientifique).",
          "Consultez le bloc de suivi en bas de la fiche : il indique « Déposé par », et le cas échéant « Validé par », « Validé le » ou « Publié le » ; en cas de rejet, le « Motif » y est rappelé.",
          "Une fois le dépôt « Validé » ou « Publié », un code documentaire définitif remplace le code provisoire ; vous en êtes informé par la cloche de notifications et par e-mail."
        ]
      },
      {
        "title": "Répondre à une demande de correction",
        "steps": [
          "Si le statut de votre dépôt passe à « À corriger », ouvrez sa fiche depuis « Documents » et lisez le commentaire du documentaliste dans « Historique & avis ».",
          "Votre rôle ne permet pas de modifier directement un dépôt déjà soumis : pour transmettre une version corrigée, retournez sur « Déposer » et déposez à nouveau la ressource corrigée, puis cliquez sur « Soumettre le dépôt ».",
          "Dans le « Résumé » ou les « Mots-clés » de ce nouveau dépôt, signalez qu'il s'agit d'une version corrigée afin que le documentaliste fasse le lien avec la demande initiale.",
          "Le documentaliste traite votre nouveau dépôt ; le document d'origine reste en l'état tant qu'il ne l'a pas mis à jour ou écarté."
        ]
      },
      {
        "title": "Explorer et consulter le catalogue",
        "steps": [
          "Ouvrez « Explorer » et recherchez un document avec « Titre, auteur, mot-clé, code… », ou affinez à l'aide des filtres « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès ».",
          "Ouvrez la fiche d'un document autorisé : dans l'encadré « Accès au document », cliquez sur « Consulter » pour le lire en ligne lorsque la consultation est permise — la lecture se fait en lecture seule, avec un filigrane à votre nom, l'impression et la copie étant désactivées.",
          "Pour récupérer le fichier, cliquez sur « Télécharger » lorsqu'il est en accès libre et que son téléchargement est autorisé.",
          "Si le document est en téléchargement payant, le bloc « Téléchargement payant » affiche le prix : cliquez sur « Payer et débloquer » (paiement simulé de démonstration). À l'ENS d'Abidjan, un étudiant peut saisir son matricule pour télécharger gratuitement — le matricule saisi doit correspondre à celui enregistré sur son compte.",
          "Utilisez l'encadré « Citer ce document » et le bouton « Copier » pour récupérer la référence bibliographique au format APA."
        ]
      },
      {
        "title": "Réserver, emprunter ou demander l'accès à un document",
        "steps": [
          "Sur la fiche d'un document, repérez l'encadré « Accès au document ».",
          "Si un exemplaire physique est disponible, cliquez sur « Réserver / Emprunter » : la fenêtre « Réserver ce document » s'ouvre ; choisissez le « Type de demande » (Consultation sur place ou Emprunt physique), précisez le créneau « Début (sur place) » et « Fin » et un « Motif / note », puis cliquez sur « Envoyer la demande ».",
          "Pour un document restreint ou confidentiel auquel vous n'avez pas accès, cliquez sur « Demander l'accès », ajoutez votre motif et validez : le message « Votre demande a été transmise au documentaliste. » s'affiche.",
          "Suivez l'avancement dans « Réservations doc. » : votre demande passe de « En attente » à « Approuvée » ou « Refusée », et vous êtes notifié de la décision (un emprunt approuvé ouvre un prêt assorti d'une date de retour)."
        ]
      },
      {
        "title": "Se détendre, s'évaluer et gérer son compte",
        "steps": [
          "Dans la section « Principal », ouvrez « Sport cérébral » pour suivre vos scores, votre progression et vos badges, et relever le « Défi du jour » via « Relever le défi » ; cliquez sur « Jouer » pour accéder à la banque de jeux publique (consignes écrites et audio) et, depuis celle-ci, rejoindre une compétition en saisissant un code de session.",
          "Depuis la page d'accueil, lancez le test de niveau certifiant « CERTEL » (compétences numériques et IA) pour situer votre niveau et découvrir le programme proposé.",
          "Ouvrez « Mon compte » pour vérifier vos informations (nom, e-mail, fonction, établissement, rôle), puis dans « Changer mon mot de passe » saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation avant de cliquer sur « Mettre à jour le mot de passe ».",
          "Si une déconnexion automatique après inactivité est activée par votre établissement, un avertissement vous invite à rester connecté avant la fermeture de session : cliquez sur « Rester connecté » pour poursuivre votre travail.",
          "En cas de difficulté, ouvrez « Support » ou « Centre d'aide » dans la section « Aide » ; le « Centre d'aide » affiche ce guide et permet de le télécharger en PDF ou en Word."
        ]
      }
    ]
  },
  "SCIENTIFIC_VALIDATOR": {
    "title": "Guide du validateur scientifique",
    "intro": "Ce support de formation s'adresse aux enseignants-chercheurs et aux experts disciplinaires dotés du rôle « Validateur scientifique » dans EduWeb Booking. Votre mission est d'apporter un regard d'expert sur le fond d'un mémoire, d'un article ou d'un rapport déposé dans la bibliothèque numérique de votre institution : vous consultez le document, vous l'étudiez si besoin hors ligne, puis vous enregistrez un avis scientifique motivé (favorable ou réservé). L'objectif pédagogique de ce guide est de vous rendre pleinement autonome dans cette tâche, tout en clarifiant la frontière entre votre expertise scientifique et le contrôle documentaire (vérification, codification, publication, archivage) qui relève, lui, du bibliothécaire / documentaliste. Votre menu volontairement épuré reflète ce périmètre : « Principal » (Accueil, Tableau de bord, Sport cérébral, Mon compte), « Bibliothèque » (Bibliothèque, Explorer, Documents) et « Aide » (Support, Centre d'aide).",
    "can": [
      "Rechercher et consulter les documents de la bibliothèque de votre institution depuis « Explorer » ou « Documents ».",
      "Lire le texte intégral d'un document à l'écran via le bouton « Consulter », et examiner son résumé, ses métadonnées et ses mots-clés.",
      "Télécharger les documents dont le téléchargement est autorisé, afin de les étudier hors ligne.",
      "Émettre un avis scientifique « Favorable » ou « Réservé » sur un document de votre institution, en y joignant un commentaire argumenté.",
      "Retrouver, dans l'« Historique & avis » de chaque document, votre avis et ceux des autres relecteurs, datés et nominatifs.",
      "Vous exercer sur l'espace public « Sport cérébral » et passer le test de niveau CERTEL depuis l'accueil.",
      "Changer votre mot de passe depuis « Mon compte » et retrouver ce guide téléchargeable depuis le « Centre d'aide »."
    ],
    "sections": [
      {
        "title": "Comprendre votre rôle et votre périmètre",
        "steps": [
          "Votre rôle est l'expertise scientifique : vous portez un avis sur le fond d'un mémoire, d'un article ou d'un rapport, sans gérer son cycle documentaire.",
          "La validation documentaire proprement dite (vérification des métadonnées, génération du code définitif, demande de correction, publication, archivage ou rejet) relève du bibliothécaire / documentaliste, pas de vous.",
          "Dans la barre latérale, votre menu se limite donc à « Principal » (Accueil, Tableau de bord, Sport cérébral, Mon compte), à « Bibliothèque » (Bibliothèque, Explorer, Documents) et à « Aide » (Support, Centre d'aide) : c'est normal et conforme à votre mission.",
          "Vous pouvez consulter les documents, télécharger ceux qui l'autorisent et enregistrer un avis scientifique, mais vous ne pouvez ni déposer un document, ni réserver ou emprunter un document ; les écrans de réservation de ressources (Calendrier, Salles multimédias, Mes réservations) ne figurent pas dans votre menu.",
          "Votre avis scientifique ne peut porter que sur les documents de votre propre institution : c'est une exigence du contrôle d'accès de la plateforme, et le bouton d'avis n'apparaît que dans ce cas."
        ]
      },
      {
        "title": "Trouver un document à expertiser",
        "steps": [
          "Dans la barre latérale, ouvrez la section « Bibliothèque » puis cliquez sur « Explorer ».",
          "Utilisez la barre de recherche (« Titre, auteur, mot-clé, code… ») pour retrouver un document précis.",
          "Affinez au besoin les résultats avec les filtres « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès » ; le compteur « N document(s) » indique le nombre de résultats.",
          "Cliquez sur la fiche du document souhaité pour l'ouvrir ; vous pouvez aussi passer par l'entrée « Documents », qui présente le fonds sous forme de tableau avec le code, le statut, le niveau d'accès et le nombre de vues (filtres « Tous les statuts » et « Tous les types »)."
        ]
      },
      {
        "title": "Examiner le document avant de vous prononcer",
        "steps": [
          "Sur la fiche, lisez d'abord le « Résumé », puis le bloc « Métadonnées » (auteur principal, co-auteurs, directeur, année, langue, niveau, institution, bibliothèque…) et les « Mots-clés ».",
          "Dans l'encadré « Accès au document », cliquez sur « Consulter » pour lire le texte intégral à l'écran lorsque la consultation est autorisée.",
          "Si le téléchargement est autorisé, utilisez le bouton « Télécharger » pour étudier le document hors ligne avant de formuler votre avis.",
          "Parcourez l'encadré « Historique & avis » pour voir les décisions et avis déjà enregistrés sur ce dépôt ; il n'apparaît que si au moins un avis ou une décision existe déjà."
        ]
      },
      {
        "title": "Émettre votre avis scientifique",
        "steps": [
          "Sur la fiche du document, repérez l'encadré « Validation documentaire » et cliquez sur le bouton « Avis scientifique ».",
          "Dans la fenêtre « Avis scientifique », choisissez la « Décision » (champ obligatoire) en cochant « Favorable » (sélectionné par défaut) ou « Réservé ».",
          "Saisissez votre appréciation dans le champ « Commentaire » pour motiver et argumenter votre avis : ce commentaire est facultatif, mais vivement recommandé.",
          "Cliquez sur « Enregistrer l'avis » pour valider ; le bouton « Annuler » vous permet de renoncer sans rien enregistrer.",
          "Votre avis apparaît aussitôt dans l'« Historique & avis » sous la mention « Avis scientifique favorable » ou « Avis scientifique réservé », à votre nom et daté."
        ]
      },
      {
        "title": "Gérer votre compte (mot de passe)",
        "steps": [
          "Dans la section « Principal » de la barre latérale, cliquez sur « Mon compte ».",
          "Sous « Changer mon mot de passe », renseignez « Mot de passe actuel », « Nouveau mot de passe » puis « Confirmer le nouveau mot de passe » (au moins 8 caractères).",
          "Cliquez sur « Mettre à jour le mot de passe » : le bandeau « Mot de passe modifié avec succès. » confirme l'opération.",
          "Si la déconnexion automatique après inactivité est activée par votre établissement, un avertissement avec le bouton « Rester connecté » peut apparaître : cliquez dessus pour prolonger votre session."
        ]
      },
      {
        "title": "Vous détendre avec l'espace « Sport cérébral »",
        "steps": [
          "Dans la section « Principal », cliquez sur « Sport cérébral » pour accéder à l'espace public d'entraînement cérébral.",
          "Choisissez un jeu parmi les neuf proposés et un niveau (Débutant, Intermédiaire, Avancé), lisez la consigne (un audio l'accompagne, touchez « Écouter »), puis jouez directement dans votre navigateur.",
          "Suivez vos scores et vos badges, relevez le « Défi du jour » ou rejoignez une compétition en saisissant un code de session dans le champ « CODE » puis « Rejoindre ».",
          "Cet espace est accessible à tous les utilisateurs : il ne fait pas partie de votre mission de validation scientifique."
        ]
      },
      {
        "title": "Trouver de l'aide et ce guide",
        "steps": [
          "Dans la section « Aide » de la barre latérale, ouvrez « Centre d'aide » pour retrouver ce guide adapté à votre rôle, consultable en ligne.",
          "Cliquez sur « Mon guide (PDF) » pour ouvrir et conserver une version imprimable de ce support de formation.",
          "Pour toute difficulté technique, passez par l'entrée « Support »."
        ]
      }
    ]
  },
  "READER": {
    "title": "Guide du Lecteur interne",
    "intro": "Ce support de formation s'adresse aux utilisateurs dotés du rôle « Lecteur interne » (clé READER) d'EduWeb Booking : étudiants, enseignants-chercheurs et personnels qui consultent le fonds documentaire autorisé de leur établissement. Son objectif pédagogique est de vous rendre pleinement autonome pour explorer le catalogue, consulter et télécharger les documents auxquels vous avez droit, demander l'accès aux ressources restreintes, réserver un exemplaire physique ou une consultation sur place, suivre l'état de vos demandes, vous exercer sur l'espace « Sport cérébral », vous situer grâce au test de niveau CERTEL, et gérer la sécurité de votre compte. Dans la barre latérale, votre rôle vous donne accès, en section « Principal », à « Accueil », « Tableau de bord », « Sport cérébral » et « Mon compte », et en section « Bibliothèque » à « Bibliothèque », « Explorer », « Documents » et « Réservations doc. ». Vous consultez les ressources : vous ne déposez pas et ne validez pas de documents — ces actions relèvent du déposant et du documentaliste.",
    "can": [
      "Explorer le catalogue de la bibliothèque numérique et filtrer les documents par type, collection, domaine et niveau d'accès.",
      "Consulter en ligne, en lecture seule et avec un filigrane à votre nom et à votre e-mail, les documents dont la consultation est autorisée.",
      "Télécharger les documents en accès libre, ou régler un téléchargement payant (paiement simulé) lorsqu'un prix est fixé.",
      "Bénéficier, à l'ENS d'Abidjan, de la gratuité de téléchargement en saisissant votre matricule étudiant.",
      "Demander l'accès à un document restreint, votre demande étant transmise au documentaliste.",
      "Réserver un exemplaire physique (emprunt) ou une consultation sur place lorsque des exemplaires sont disponibles, et suivre l'état de vos demandes dans « Réservations doc. ».",
      "Vous entraîner sur l'espace « Sport cérébral », relever le « Défi du jour » et rejoindre une compétition à l'aide d'un code de session.",
      "Évaluer votre niveau en numérique et IA grâce au test de niveau CERTEL accessible depuis l'accueil, et consulter le programme.",
      "Utiliser l'application sur mobile grâce à la barre d'onglets en bas, au bouton flottant central et au menu.",
      "Mettre à jour votre mot de passe depuis « Mon compte » et télécharger ce guide en PDF ou en Word depuis le « Centre d'aide »."
    ],
    "sections": [
      {
        "title": "Explorer le catalogue documentaire",
        "steps": [
          "Dans la barre latérale, section « Bibliothèque », cliquez sur « Explorer » (page « Explorer la bibliothèque »).",
          "Saisissez votre recherche dans la barre ; l'indication « Titre, auteur, mot-clé, code… » vous guide.",
          "Affinez avec les filtres déroulants : « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès ».",
          "Parcourez les fiches affichées ; le compteur « N document(s) » indique le nombre de résultats.",
          "Cliquez sur une fiche pour ouvrir le détail du document.",
          "Vous pouvez aussi ouvrir « Bibliothèque » (page « Bibliothèque numérique ») pour suivre les indicateurs du fonds (« Documents », « Consultations », « Téléchargements »), puis, depuis l'encadré « Derniers dépôts », cliquer sur « Tout voir » pour ouvrir la page « Documents » : un tableau qui présente chaque ressource avec son code, son statut, son niveau d'accès et son nombre de vues."
        ]
      },
      {
        "title": "Consulter un document en ligne",
        "steps": [
          "Ouvrez la fiche du document depuis « Explorer » ou « Documents ».",
          "Vérifiez l'en-tête : type, collection et domaine, puis le statut, le niveau d'accès et le code documentaire ; lisez ensuite le « Résumé », les « Métadonnées », les « Mots-clés » et l'encadré « Citer ce document ».",
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
          "Dans l'encadré « Accès au document », cliquez sur « Demander l'accès ».",
          "Dans la fenêtre « Demander l'accès », renseignez le champ « Motif / note » pour préciser votre besoin.",
          "Cliquez sur « Demander l'accès » pour transmettre la demande au documentaliste ; le bandeau « Votre demande a été transmise au documentaliste. » confirme l'envoi.",
          "Suivez ensuite l'avancement de cette demande dans « Bibliothèque » › « Réservations doc. »."
        ]
      },
      {
        "title": "Réserver un exemplaire physique et suivre ses demandes",
        "steps": [
          "Sur la fiche d'un document disposant d'exemplaires physiques disponibles (le nombre « N/N exemplaire(s) physique(s) disponible(s) » s'affiche), cliquez sur « Réserver / Emprunter ».",
          "Dans la fenêtre « Réserver ce document », choisissez le « Type de demande » : « Consultation sur place » ou « Emprunt physique ».",
          "Pour une consultation sur place, indiquez le créneau dans « Début (sur place) » et « Fin », puis ajoutez un « Motif / note » si besoin.",
          "Cliquez sur « Envoyer la demande ».",
          "Suivez l'avancement dans « Bibliothèque » › « Réservations doc. » (page « Réservations documentaires ») : chaque demande affiche son type et son statut, et vous pouvez rouvrir la fiche du document en cliquant sur son titre."
        ]
      },
      {
        "title": "S'entraîner sur le Sport cérébral et rejoindre une compétition",
        "steps": [
          "Dans la section « Principal » de la barre latérale, ouvrez « Sport cérébral » pour consulter vos scores, votre progression, vos badges et le « Défi du jour ».",
          "Cliquez sur « Jouer » (ou « Relever le défi ») pour accéder à l'espace des jeux.",
          "Choisissez un jeu et un niveau (Débutant, Intermédiaire ou Avancé), puis suivez la consigne affichée (lecture à l'écran et version audio via le bouton « Écouter »).",
          "Pour rejoindre une compétition organisée, repérez l'encadré « Compétition », saisissez le code de session fourni dans le champ « CODE », puis cliquez sur « Rejoindre ».",
          "Jouez la compétition sur votre appareil ; votre score est pris en compte dans le classement de l'organisateur."
        ]
      },
      {
        "title": "Évaluer son niveau avec le test CERTEL",
        "steps": [
          "Depuis la page d'accueil publique, repérez le bouton flottant violet « Test de niveau · CERTEL · gratuit » et cliquez dessus.",
          "Renseignez d'abord votre profil, puis répondez aux questions du test de niveau en numérique et en intelligence artificielle, et validez.",
          "Lisez votre résultat (niveau conseillé N1, N2 ou N3) calculé automatiquement, ainsi que l'appréciation de votre niveau.",
          "Pour en savoir plus sur le parcours certifiant (thèmes et contenus par niveau), consultez la page du programme CERTEL accessible depuis l'accueil."
        ]
      },
      {
        "title": "Utiliser l'application sur mobile",
        "steps": [
          "Sur téléphone, ouvrez l'application : la navigation principale apparaît sous forme de barre d'onglets en bas de l'écran, avec l'onglet « Accueil » (qui ouvre votre tableau de bord) et l'onglet « Biblio ».",
          "Touchez « Biblio » pour accéder à la bibliothèque, puis « Explorer » pour rechercher un document.",
          "Utilisez le bouton flottant central — pour votre rôle, il porte le libellé « Jouer » et ouvre l'espace Sport cérébral.",
          "Touchez « Menu » pour ouvrir le menu latéral et retrouver l'ensemble des rubriques, dont « Documents », « Réservations doc. » et « Mon compte »."
        ]
      },
      {
        "title": "Gérer son compte, la sécurité et obtenir de l'aide",
        "steps": [
          "Dans « Principal », ouvrez « Mon compte » pour vérifier vos informations : nom, e-mail (et fonction le cas échéant), établissement et rôle.",
          "Dans l'encadré « Changer mon mot de passe », renseignez « Mot de passe actuel », « Nouveau mot de passe » (au moins 8 caractères) et « Confirmer le nouveau mot de passe », puis cliquez sur « Mettre à jour le mot de passe » ; le message « Mot de passe modifié avec succès. » confirme l'opération.",
          "Si votre établissement a activé la déconnexion automatique après inactivité, la fenêtre « Toujours là ? » s'affiche avant l'expiration : cliquez sur « Rester connecté » pour prolonger votre session, sinon vous serez déconnecté automatiquement.",
          "En cas de besoin, ouvrez « Centre d'aide » pour relire ce guide ou le télécharger en PDF ou en Word, et « Support » pour contacter l'assistance."
        ]
      }
    ]
  }
};
