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
export const ROLE_GUIDES: Record<RoleKey, RoleGuide> = {
  REQUESTER: {
    title: "Guide du demandeur",
    intro: "Réservez des ressources, choisissez vos postes en salle multimédia et suivez vos demandes.",
    can: [
      "Réserver une ressource (salle, équipement, poste informatique…).",
      "Choisir vos postes sur le plan de salle, ou réserver une salle entière.",
      "Suivre l'état de vos demandes (en attente, validée, refusée) et recevoir des notifications.",
      "Annuler une réservation à venir et clôturer une activité réalisée.",
      "Consulter la bibliothèque, télécharger ou réserver les documents autorisés.",
    ],
    sections: [
      {
        title: "Réserver une ressource",
        steps: [
          "Dans la barre latérale, cliquez sur « + Nouvelle réservation » (ou le bouton « + Réserver » en haut).",
          "Choisissez la catégorie de ressource, puis la ressource souhaitée.",
          "Indiquez le type d'usage, puis le motif de la réservation.",
          "Choisissez la date et le créneau horaire (sur un seul jour ou plusieurs jours consécutifs).",
          "Cliquez sur « Vérifier la disponibilité » : la plateforme contrôle qu'aucun conflit n'existe.",
          "Confirmez la demande. Vous recevez un accusé de réception et une notification.",
        ],
      },
      {
        title: "Réserver des postes en salle multimédia",
        steps: [
          "Ouvrez « Salles multimédias » ou choisissez une salle lors de la réservation.",
          "Sur le plan de salle, les postes verts sont libres, les rouges sont déjà occupés (survolez pour voir la période).",
          "Cliquez sur les postes voulus pour les sélectionner, ou utilisez « Réserver toute la salle ».",
          "Vérifiez la disponibilité puis confirmez.",
        ],
      },
      {
        title: "Suivre et gérer mes réservations",
        steps: [
          "Ouvrez « Mes réservations » pour voir vos demandes à venir et votre historique.",
          "Cliquez sur une réservation pour ouvrir sa fiche de détail.",
          "Pour annuler une réservation à venir, utilisez le bouton « Annuler » de la fiche.",
          "Une fois la réservation validée et le créneau arrivé : cliquez sur « Je suis arrivé », puis « Activité terminée » à la fin.",
        ],
      },
      {
        title: "Utiliser la bibliothèque",
        steps: [
          "Ouvrez « Explorer » dans la Bibliothèque pour rechercher un document (titre, auteur, domaine…).",
          "Ouvrez la fiche d'un document autorisé pour le consulter.",
          "Téléchargez-le s'il est en accès libre, ou demandez l'accès s'il est restreint.",
          "Pour un document physique, créez une réservation depuis sa fiche.",
        ],
      },
      {
        title: "Mon compte et mes notifications",
        steps: [
          "Cliquez sur votre nom en haut à droite pour accéder à votre profil.",
          "Consultez la cloche de notifications pour suivre les décisions et rappels.",
        ],
      },
    ],
  },
  RESOURCE_MANAGER: {
    title: "Guide du responsable de ressource",
    intro: "Gérez vos ressources, leurs règles, et validez les demandes qui les concernent.",
    can: [
      "Créer, modifier et retirer des ressources et définir leurs règles d'usage.",
      "Ajuster le nombre de postes des salles multimédias, ajouter ou retirer des salles.",
      "Valider ou refuser les demandes de réservation portant sur vos ressources.",
      "Déclarer des incidents et planifier la maintenance d'une ressource.",
      "Suivre le planning et les statistiques d'occupation.",
    ],
    sections: [
      {
        title: "Créer et configurer une ressource",
        steps: [
          "Ouvrez « Ressources », puis « Ajouter une ressource ».",
          "Renseignez le nom, la catégorie, le site et le service de rattachement.",
          "Définissez les règles : mode de réservation, durée min/max, délai, validation requise ou non.",
          "Enregistrez : la ressource devient réservable selon ses règles.",
        ],
      },
      {
        title: "Gérer les salles multimédias",
        steps: [
          "Ouvrez la fiche d'une salle multimédia.",
          "Ajustez le nombre de postes (capacité) selon la configuration réelle.",
          "Ajoutez une nouvelle salle ou retirez une salle qui n'est plus exploitée.",
        ],
      },
      {
        title: "Valider les demandes",
        steps: [
          "Ouvrez « À valider » : la liste des demandes en attente s'affiche (un badge indique le nombre).",
          "Ouvrez une demande pour en vérifier les détails.",
          "Approuvez-la, ou refusez-la en indiquant un motif clair.",
          "Le demandeur est notifié automatiquement de votre décision.",
        ],
      },
      {
        title: "Suivre l'activité et la maintenance",
        steps: [
          "Consultez le planning du jour et les statistiques d'occupation.",
          "Déclarez un incident sur une ressource depuis sa fiche.",
          "Planifiez une maintenance : la ressource est automatiquement bloquée sur la période choisie.",
        ],
      },
    ],
  },
  VALIDATOR: {
    title: "Guide du validateur",
    intro: "Traitez les demandes de réservation soumises à validation.",
    can: [
      "Consulter les demandes de réservation en attente.",
      "Approuver une demande conforme.",
      "Refuser une demande en justifiant la décision.",
    ],
    sections: [
      {
        title: "Traiter les demandes",
        steps: [
          "Ouvrez « À valider » : les demandes en attente sont listées (un badge indique leur nombre).",
          "Ouvrez une demande pour vérifier la ressource, le créneau, le motif et le demandeur.",
          "Cliquez sur « Approuver » si la demande est conforme.",
          "Sinon, cliquez sur « Refuser » et précisez le motif du refus.",
          "Le demandeur reçoit une notification de la décision.",
        ],
      },
    ],
  },
  ORG_ADMIN: {
    title: "Guide de l'administrateur d'institution",
    intro: "Configurez votre institution, ses accès et son fonctionnement.",
    can: [
      "Paramétrer l'organisation : sites, niveaux et services, horaires et jours ouvrés.",
      "Créer les catégories de ressources et leurs règles.",
      "Créer des comptes un par un ou importer une cohorte via un fichier CSV.",
      "Valider ou rejeter les demandes d'inscription, activer ou suspendre des comptes.",
      "Consulter la matrice des rôles et permissions.",
      "Suivre les statistiques et exporter des rapports (CSV / PDF).",
    ],
    sections: [
      {
        title: "Configurer l'institution",
        steps: [
          "Ouvrez « Organisation » et renseignez les informations de votre institution.",
          "Dans « Sites & services », créez les sites géographiques puis les niveaux et leurs services.",
          "Créez les catégories de ressources et définissez leurs règles par défaut.",
          "Dans « Paramètres », ajustez les horaires d'ouverture, les jours ouvrés et la validation automatique.",
        ],
      },
      {
        title: "Créer des comptes individuellement",
        steps: [
          "Ouvrez « Utilisateurs », puis « Ajouter un utilisateur ».",
          "Renseignez le prénom, le nom (mis en forme automatiquement), l'e-mail, la fonction et le rôle.",
          "Enregistrez : le compte est actif et l'utilisateur peut se connecter.",
        ],
      },
      {
        title: "Importer une cohorte par fichier CSV",
        steps: [
          "Dans « Utilisateurs », ouvrez l'outil d'import CSV.",
          "Téléchargez le modèle de fichier (colonnes : prenom, nom, email, fonction, role).",
          "Complétez le modèle avec votre cohorte, puis déposez le fichier.",
          "Vérifiez le compte-rendu ligne par ligne (créations, doublons ignorés, e-mails invalides).",
        ],
      },
      {
        title: "Valider les demandes de comptes",
        steps: [
          "Ouvrez « Demandes de comptes » (un badge indique le nombre en attente).",
          "Examinez chaque demande (identité, e-mail, fonction).",
          "Approuvez pour activer le compte, ou rejetez la demande : la personne est notifiée.",
          "Dans « Utilisateurs », vous pouvez aussi activer ou suspendre un compte existant.",
        ],
      },
      {
        title: "Piloter l'institution",
        steps: [
          "Consultez la matrice « Rôles & permissions » pour comprendre les droits de chaque rôle.",
          "Suivez les statistiques d'usage dans « Statistiques ».",
          "Exportez des rapports filtrés au format CSV ou PDF depuis « Rapports ».",
        ],
      },
    ],
  },
  TECHNICIAN: {
    title: "Guide du technicien",
    intro: "Assurez le bon état de fonctionnement des ressources.",
    can: [
      "Consulter et traiter les incidents déclarés sur les ressources.",
      "Planifier des opérations de maintenance.",
      "Bloquer une ressource pendant une intervention.",
    ],
    sections: [
      {
        title: "Traiter les incidents",
        steps: [
          "Ouvrez la liste des incidents déclarés sur les ressources.",
          "Ouvrez un incident pour en consulter le détail.",
          "Intervenez puis marquez l'incident comme résolu.",
        ],
      },
      {
        title: "Planifier la maintenance",
        steps: [
          "Ouvrez la fiche de la ressource concernée.",
          "Planifiez une maintenance en indiquant la période.",
          "La ressource est automatiquement rendue indisponible à la réservation sur cette période.",
        ],
      },
    ],
  },
  LIBRARIAN: {
    title: "Guide du bibliothécaire / documentaliste",
    intro: "Vérifiez, validez et organisez le fonds documentaire.",
    can: [
      "Vérifier les dépôts de documents et contrôler leurs métadonnées.",
      "Valider un dépôt (génération du code documentaire définitif), demander une correction ou rejeter.",
      "Publier les documents validés dans le catalogue.",
      "Organiser les collections et les domaines.",
      "Suivre les réservations et les emprunts physiques, consulter les statistiques documentaires.",
    ],
    sections: [
      {
        title: "Vérifier et valider les dépôts",
        steps: [
          "Ouvrez « À vérifier » dans la Bibliothèque (un badge indique le nombre en attente).",
          "Ouvrez un dépôt et contrôlez le type, les métadonnées, les auteurs et le fichier.",
          "Examinez les doublons potentiels signalés par la plateforme.",
          "Validez (un code documentaire définitif est généré), demandez une correction, ou rejetez.",
          "Publiez le document validé pour le rendre visible dans le catalogue.",
        ],
      },
      {
        title: "Organiser le fonds",
        steps: [
          "Gérez les « Collections » et les « Domaines » pour structurer le catalogue.",
          "Suivez les « Réservations doc. » et les « Emprunts » physiques.",
          "Consultez les « Statistiques doc. » pour suivre l'activité documentaire.",
        ],
      },
    ],
  },
  DEPOSITOR: {
    title: "Guide du déposant",
    intro: "Déposez vos ressources documentaires dans la bibliothèque.",
    can: [
      "Déposer un document (mémoire, article, support pédagogique…).",
      "Renseigner les métadonnées, les auteurs et les droits d'accès.",
      "Suivre le statut de vos dépôts et répondre aux corrections demandées.",
    ],
    sections: [
      {
        title: "Déposer un document",
        steps: [
          "Cliquez sur « Déposer » dans la Bibliothèque.",
          "Choisissez le type de document et renseignez les métadonnées (titre, domaine, année…).",
          "Ajoutez les auteurs, le résumé et téléversez le fichier.",
          "Définissez les droits d'accès (libre, restreint…).",
          "Soumettez : un code provisoire est attribué, en attente de validation documentaire.",
        ],
      },
      {
        title: "Suivre mes dépôts",
        steps: [
          "Consultez le statut de chacun de vos dépôts.",
          "Si une correction est demandée, modifiez le dépôt puis soumettez-le à nouveau.",
        ],
      },
    ],
  },
  SCIENTIFIC_VALIDATOR: {
    title: "Guide du validateur scientifique",
    intro: "Émettez un avis scientifique sur les dépôts documentaires.",
    can: [
      "Consulter les documents soumis à avis scientifique.",
      "Émettre un avis (favorable ou réservé) accompagné d'un commentaire.",
    ],
    sections: [
      {
        title: "Émettre un avis",
        steps: [
          "Ouvrez la fiche d'un document soumis à avis.",
          "Lisez le document et ses métadonnées.",
          "Donnez un avis scientifique (favorable ou réservé) et justifiez-le par un commentaire.",
        ],
      },
    ],
  },
  READER: {
    title: "Guide du lecteur",
    intro: "Consultez et empruntez les ressources documentaires.",
    can: [
      "Explorer le catalogue et consulter les documents autorisés.",
      "Télécharger les documents en accès libre ou demander l'accès aux documents restreints.",
      "Réserver un document physique ou une consultation sur place.",
    ],
    sections: [
      {
        title: "Consulter la bibliothèque",
        steps: [
          "Ouvrez « Explorer » et recherchez un document (titre, auteur, domaine…).",
          "Ouvrez la fiche d'un document autorisé pour le consulter.",
          "Téléchargez-le s'il est en accès libre, ou demandez l'accès s'il est restreint.",
          "Réservez un document physique ou une consultation sur place depuis sa fiche.",
        ],
      },
    ],
  },
  VISITOR: {
    title: "Guide du visiteur",
    intro: "Accès en consultation aux ressources publiques.",
    can: ["Consulter les ressources et documents publics de l'organisation."],
    sections: [
      {
        title: "Consulter",
        steps: [
          "Parcourez les ressources et documents publics de l'organisation.",
          "Pour aller plus loin, demandez la création d'un compte auprès de l'administrateur.",
        ],
      },
    ],
  },
  SUPER_ADMIN: {
    title: "Guide de l'Administrateur Système (super administrateur EduWeb)",
    intro:
      "Vous administrez toute la plateforme EduWeb Booking : gouvernement et ministères, établissements et abonnements, espace Sport cérébral et compétitions. Votre compte « Administrateur Système » dispose de toutes les permissions ; il n'y a pas de bouton « Modifier » séparé, les formulaires sont directement modifiables et l'on enregistre avec « Enregistrer ».",
    can: [
      "Superviser l'ensemble des institutions, utilisateurs, ressources et réservations.",
      "Enregistrer le gouvernement (l'État) et ses ministères de tutelle, ou les pré-charger pour la Côte d'Ivoire.",
      "Inscrire des établissements un par un ou en masse par fichier CSV, et les rattacher à un ministère.",
      "Gérer l'abonnement de chaque établissement (formule, statut, comptes autorisés, renouvellement) et l'activer ou le suspendre.",
      "Basculer dans le contexte d'un établissement pour y agir comme administrateur (sélecteur d'institution).",
      "Configurer l'espace Sport cérébral : verrouillage par abonnement, banque de questions, publication des jeux.",
      "Organiser des compétitions sur un jeu choisi et suivre les performances en direct (arbitrage).",
    ],
    sections: [
      {
        title: "Vue d'ensemble — superviser la plateforme",
        steps: [
          "Dans la barre latérale, ouvrez « Plateforme » → « Supervision EduWeb » : vue globale (institutions, utilisateurs, ressources, réservations).",
          "Chaque institution gère son propre espace, ses rôles et sa hiérarchie de manière isolée.",
          "Les boutons en haut de cette page mènent directement à la gestion des établissements, au gouvernement et aux réglages des jeux.",
        ],
      },
      {
        title: "1. Enregistrer le gouvernement et les ministères",
        steps: [
          "Ouvrez « Plateforme » → « Gouvernement & ministères ».",
          "Renseignez le nom de l'État et choisissez le pays dans la liste déroulante (recherche rapide + drapeaux) ; le nom officiel se remplit automatiquement. Cliquez « Enregistrer ».",
          "Ajoutez les ministères un par un, ou cliquez « Ministères de Côte d'Ivoire » pour pré-charger ceux du gouvernement actuel.",
          "Chaque ministère peut être renommé, doté d'un sigle ou supprimé.",
        ],
      },
      {
        title: "2. Inscrire et gérer les établissements",
        steps: [
          "Ouvrez « Plateforme » → « Établissements ».",
          "Un établissement : remplissez « Inscrire un établissement » (nom, sigle, ministère de tutelle, formule, administrateur) puis « Créer ». Un compte administrateur est créé (mot de passe initial : password123, à changer).",
          "Une cohorte : glissez-déposez un fichier CSV dans « Import par CSV » (téléchargez d'abord le modèle). Chaque ligne crée un établissement complet ; les doublons sont ignorés.",
          "Sur la fiche d'un établissement : ajustez le ministère de tutelle, la formule, le statut, les comptes autorisés et le renouvellement, puis « Enregistrer ».",
          "Utilisez « Suspendre » / « Réactiver » pour couper ou rétablir l'accès de tout un établissement.",
        ],
      },
      {
        title: "3. Gérer les abonnements (l'accès en dépend)",
        steps: [
          "L'accès complet (notamment à tous les jeux) est réservé aux établissements dont l'abonnement est « Actif ».",
          "Choisissez la formule (Pilote / Standard / Premium / National) et le statut, puis « Enregistrer ».",
          "« Comptes autorisés » = nombre de comptes utilisateurs permis par l'abonnement.",
        ],
      },
      {
        title: "4. Travailler dans une institution (sélecteur d'institution)",
        steps: [
          "En haut de l'écran, le menu déroulant des institutions fait basculer tout votre contexte de travail vers l'établissement choisi.",
          "Vous agissez alors comme son administrateur : utilisateurs, ressources, bibliothèque…",
          "Pour créer des comptes : « Administration » → « Utilisateurs » (création manuelle ou import CSV avec modèle).",
          "Revenez à « EduWeb · plateforme » dans le sélecteur pour retrouver le contexte plateforme.",
        ],
      },
      {
        title: "5. Configurer l'espace Sport cérébral",
        steps: [
          "« Plateforme » → « Réglages des jeux » : activez/désactivez le verrouillage par abonnement, fixez le nombre de jeux gratuits ou choisissez les jeux offerts aux visiteurs non abonnés.",
          "« Sport cérébral » (menu Principal) → bouton « Banque de questions » : créez ou importez les questions du quiz.",
          "Depuis la banque de questions, « Gestion des jeux » : publiez/masquez un jeu, changez l'ordre, modifiez la consigne, déposez un audio.",
        ],
      },
      {
        title: "6. Organiser une compétition",
        steps: [
          "« Gestion » → « Compétitions » → créez une compétition (intitulé, jeu, niveau).",
          "Partagez le code de session (ou le lien) : chaque compétiteur le saisit depuis l'accueil du Sport cérébral et joue sur son appareil.",
          "Sur la vue arbitre, suivez le classement en direct (mise à jour automatique) ; ouvrez, démarrez puis clôturez la compétition pour délibérer.",
        ],
      },
      {
        title: "Compte, droits et dépannage",
        steps: [
          "Votre compte possède toutes les permissions de la plateforme.",
          "Si une page affiche « Une erreur est survenue » ou qu'un « Enregistrer » semble sans effet, il s'agit le plus souvent de la base de données (Neon) momentanément en veille : rechargez la page.",
          "Téléchargez ce guide via « Télécharger en PDF » dans le Centre d'aide.",
        ],
      },
    ],
  },
};
