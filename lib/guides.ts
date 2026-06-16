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
    title: "Guide du super administrateur EduWeb",
    intro: "Supervisez la plateforme et les institutions abonnées.",
    can: [
      "Superviser l'ensemble des institutions, utilisateurs, ressources et réservations.",
      "Vérifier l'isolement des données entre institutions.",
      "Accompagner les administrateurs d'institution.",
    ],
    sections: [
      {
        title: "Superviser la plateforme",
        steps: [
          "Ouvrez « Supervision EduWeb » pour la vue globale : institutions, utilisateurs, ressources, réservations.",
          "Chaque institution gère son propre espace, ses rôles et sa hiérarchie de manière isolée.",
          "Appuyez les administrateurs d'institution dans leur configuration et leurs accès.",
        ],
      },
    ],
  },
};
