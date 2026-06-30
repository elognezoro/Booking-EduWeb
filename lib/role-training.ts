import type { RoleKey } from "./enums";

export interface RoleTrainingModule {
  title: string;
  objective: string;
  content: string[];
}
export interface RoleTrainingQuestion {
  question: string;
  /** Propositions à choix unique. */
  options: string[];
  /** Indice (0-based) de la bonne réponse dans `options`. */
  answer: number;
  explanation: string;
}
export interface RoleTraining {
  title: string;
  intro: string;
  /** Modules de prise en main, progressifs. */
  modules: RoleTrainingModule[];
  /** Auto-évaluation (QCM) à correction immédiate. */
  quiz: RoleTrainingQuestion[];
}

// Parcours de formation à la prise en main + auto-évaluation, propre à chaque rôle.
// Contenu généré par le workflow « role-training-content » et vérifié contre l'application.
export const ROLE_TRAINING: Record<RoleKey, RoleTraining> = {
  "SUPER_ADMIN": {
    "title": "Formation à la prise en main — Administrateur Système (Super Administrateur EduWeb)",
    "intro": "Cette formation s'adresse à l'Administrateur Système d'EduWeb Booking (clé SUPER_ADMIN), le seul rôle disposant de l'ensemble des permissions de la plateforme. À l'issue de ce parcours, vous saurez superviser toute la plateforme, enregistrer le gouvernement et ses ministères, inscrire et administrer les établissements et leurs abonnements, affecter les comptes en attente, régler la sécurité et la matrice des permissions, configurer l'espace Sport cérébral et la formation certifiante CERTEL, et basculer dans le contexte de n'importe quel établissement pour y intervenir. Suivez les modules dans l'ordre : ils reproduisent fidèlement les menus et boutons réels de l'application. Pour le confort de lecture, les textes narratifs sont affichés dans une police d'au moins 13 px et dotés d'un lecteur audio « Écouter ».",
    "modules": [
      {
        "title": "Superviser la plateforme et son écosystème gouvernemental",
        "objective": "Prendre une vue d'ensemble de la plateforme puis enregistrer le gouvernement et ses ministères de tutelle.",
        "content": [
          "Dans la barre latérale, dépliez la section « Plateforme » puis ouvrez « Supervision EduWeb » : lisez les indicateurs globaux « Organisations », « Utilisateurs », « Ressources » et « Réservations », ainsi que le tableau « Organisations abonnées ».",
          "Servez-vous des boutons d'en-tête de la supervision pour rejoindre directement « Réglages des jeux », « Gouvernement » et « Gérer les établissements ».",
          "Ouvrez « Plateforme » › « Gouvernement & ministères » : dans la carte « Gouvernement », renseignez le nom de l'État, choisissez le pays et cliquez « Enregistrer » (le bouton affiche « Mettre à jour » si un gouvernement existe déjà) — il faut enregistrer le gouvernement AVANT de pouvoir ajouter des ministères.",
          "Ajoutez un ministère via la carte « Nouveau ministère » (« Nom du ministère » + « Sigle », puis « Ajouter »), ou gagnez du temps avec « Ministères de Côte d'Ivoire » pour pré-remplir la liste.",
          "Pour un import en masse, glissez-déposez un fichier CSV (colonnes nom, sigle) puis cliquez « Importer les ministères » ; le « Modèle CSV » est téléchargeable.",
          "Sur chaque ministère, modifiez le nom ou le sigle et validez avec l'icône disquette, ou supprimez avec l'icône corbeille ; le badge indique le nombre d'établissements rattachés."
        ]
      },
      {
        "title": "Inscrire les établissements et gérer leurs abonnements",
        "objective": "Créer des établissements (à l'unité ou en cohorte) et piloter leur abonnement, leur suspension et leur suppression.",
        "content": [
          "Ouvrez « Plateforme » › « Établissements ». Pour un établissement unique, remplissez « Inscrire un établissement » (nom, sigle, identifiant auto, ville, ministère de tutelle, formule, comptes autorisés, prénom/nom/e-mail de l'administrateur) puis cliquez « Créer l'établissement » : un compte admin est créé avec le mot de passe initial « password123 », à changer.",
          "Pour une cohorte, utilisez « Import par CSV (cohorte d'établissements) » : glissez votre fichier (le ministère est reconnu par sigle ou par nom) puis cliquez « Importer » ; vérifiez le bandeau qui indique les établissements importés et les doublons ignorés.",
          "Dans le bloc d'abonnement de chaque fiche, sélectionnez le « Ministère de tutelle » et la « Formule » (Pilote, Standard, Premium ou National).",
          "Choisissez le « Statut abonnement » (Actif, Suspendu ou Résilié) : l'accès complet, notamment à tous les jeux, est réservé aux abonnements « Actif ».",
          "Renseignez « Comptes autorisés » et la date de « Renouvellement », puis cliquez « Enregistrer » (bandeau « Modifications enregistrées »).",
          "Utilisez « Suspendre » / « Réactiver » pour couper ou rétablir l'accès, ou « Supprimer » puis confirmation pour un retrait définitif et irréversible (utilisateurs, rôles, ressources, réservations, documents et données effacés)."
        ]
      },
      {
        "title": "Affecter les comptes en attente et gérer les permissions par rôle",
        "objective": "Traiter les demandes de comptes de toutes les institutions et ajuster la matrice « Rôles & permissions ».",
        "content": [
          "Ouvrez « Administration » › « Demandes de comptes » : vous voyez TOUS les comptes en attente de la plateforme, y compris ceux inscrits sans institution.",
          "Sur chaque demande, lisez le nom, l'e-mail, la fonction et l'établissement éventuellement renseigné, puis choisissez l'« Établissement » de rattachement et le « Rôle » (le rôle Super Administrateur n'est jamais proposé).",
          "Cliquez « Valider et affecter » pour rattacher et activer la personne, ou « Refuser » puis confirmer pour supprimer la demande (la personne est informée par e-mail).",
          "Ouvrez « Administration » › « Rôles & permissions » : la matrice s'affiche en mode éditable ; les cartes du haut indiquent le nombre de permissions de chaque rôle.",
          "Cliquez une case à l'intersection d'un rôle et d'une permission pour l'attribuer ou la retirer ; le changement s'applique immédiatement.",
          "Retenez que le rôle « Super administrateur » conserve toujours tous les droits (non modifiable) et que la supervision plateforme lui reste réservée."
        ]
      },
      {
        "title": "Régler la sécurité, le Sport cérébral et les diagnostics CERTEL",
        "objective": "Paramétrer la déconnexion automatique, l'espace de jeux et le journal des diagnostics CERTEL.",
        "content": [
          "Ouvrez « Plateforme » › « Sécurité & sessions » : dans « Déconnexion automatique après inactivité », saisissez le « Délai d'inactivité (minutes) » (0 pour désactiver, jusqu'à 480 minutes / 8 h maximum) puis « Enregistrer ».",
          "Ouvrez « Plateforme » › « Réglages des jeux » : dans « Accès des visiteurs non abonnés », cochez ou décochez « Activer le verrouillage par abonnement » (désactivé = tous les jeux accessibles à tous, y compris visiteurs anonymes ; les abonnés ont toujours accès à tout).",
          "Réglez la « Sélection des jeux offerts » (Rotation aléatoire par jour ou Jeux fixes choisis) et, selon le mode, le « Nombre de jeux offerts » ou les jeux cochés, puis « Enregistrer les réglages » ; le défi du jour reste toujours jouable.",
          "Depuis « Sport cérébral » (section « Principal »), cliquez « Banque de questions » (réservé au super administrateur) pour ajouter des questions (« Nouvelle question » ou « Importer les questions » par CSV) et les activer/désactiver/supprimer ; via « Gestion des jeux », utilisez « Publier » / « Masquer », les flèches d'ordre, « Enregistrer la consigne » et « Déposer » un audio.",
          "Ouvrez « Plateforme » › « Diagnostics CERTEL » : lisez les cartes (total des tests et répartition N1/N2/N3) et parcourez le journal (participant, profil, score sur 100, niveau, date) ; cliquez « Voir » pour le détail.",
          "Pour purger, cochez une ou plusieurs lignes (ou « Tout sélectionner »), cliquez « Supprimer la sélection » et confirmez : la suppression est définitive."
        ]
      },
      {
        "title": "Piloter la formation certifiante CERTEL et ses tarifs",
        "objective": "Comprendre le parcours CERTEL ouvert à tout utilisateur connecté, accéder librement aux contenus en tant que super administrateur, et régler les tarifs et évaluations depuis la section « Plateforme ».",
        "content": [
          "CERTEL est la formation certifiante au numérique et à l'IA, accessible à tout utilisateur CONNECTÉ : depuis le tableau de bord via la section « Principal » › « Formation CERTEL », ou depuis le menu public « CERTEL ».",
          "Le parcours comprend un DIAGNOSTIC GRATUIT puis 3 niveaux interactifs ; chaque niveau réunit 6 modules avec leçons audio, exercices auto-corrigés à VÉRIFICATION IMMÉDIATE et une évaluation CHRONOMÉTRÉE.",
          "L'évaluation certifiante de fin de niveau ne dévoile les corrigés de l'examen qu'À LA FIN ; la réussite donne droit à un CERTIFICAT PDF au format paysage.",
          "L'inscription à CERTEL est PAYANTE par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte ; tant qu'aucun prix n'est défini, l'accès reste GRATUIT.",
          "En tant que super administrateur, vous bénéficiez d'un ACCÈS COMPLET à tous les niveaux et évaluations SANS PAIEMENT, ce qui vous permet de contrôler les contenus avant publication.",
          "Depuis la section « Plateforme », réglez les TARIFS d'inscription et les paramètres des ÉVALUATIONS CERTEL ; complétez ce suivi avec « Plateforme » › « Diagnostics CERTEL » pour consulter le journal des tests passés."
        ]
      },
      {
        "title": "Travailler dans un établissement via le sélecteur d'institution",
        "objective": "Basculer dans le contexte d'un établissement pour gérer son identité, ses utilisateurs, ses sites/services et ses certificats, puis revenir à la plateforme.",
        "content": [
          "En haut de l'écran (sur ordinateur), ouvrez le menu déroulant des institutions à côté de l'icône bâtiment et choisissez l'établissement : tout votre contexte bascule vers lui.",
          "Ouvrez « Administration » › « Organisation » pour ajuster l'identité et téléverser le logo (glisser-déposer ou clic, redimensionné et affiché à la place du sigle), puis « Enregistrer ».",
          "Ouvrez « Administration » › « Utilisateurs » pour créer un compte (« Nouvel utilisateur ») ou importer une cohorte par CSV, et « Demandes de comptes » pour valider les inscriptions de cet établissement.",
          "Ouvrez « Administration » › « Sites & services » : ajoutez un site, puis un service (site de rattachement, « Rattaché à », « Niveau hiérarchique »), réorganisez par glisser-déposer, et utilisez l'icône « Membres » pour désigner un responsable et ajouter des agents.",
          "Gérez au besoin les « Certificats » (numérotation automatique, cachet et signature scannés, journal, impression et export Word).",
          "Quand vous avez terminé, rouvrez le sélecteur et choisissez « EduWeb · plateforme » pour revenir au contexte plateforme ; pour votre propre compte, utilisez « Mon compte » et « Changer mon mot de passe »."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Quelle action devez-vous obligatoirement réaliser avant de pouvoir ajouter des ministères ?",
        "options": [
          "Importer une cohorte d'établissements par CSV",
          "Enregistrer le gouvernement (nom de l'État et pays) dans la carte « Gouvernement »",
          "Activer le verrouillage par abonnement dans « Réglages des jeux »",
          "Définir le délai de déconnexion automatique"
        ],
        "answer": 1,
        "explanation": "Dans « Gouvernement & ministères », il faut d'abord enregistrer le gouvernement (nom de l'État + pays) avant de pouvoir ajouter le moindre ministère de tutelle ; tant qu'il n'existe pas, l'application invite à « enregistrer d'abord le gouvernement »."
      },
      {
        "question": "Quel mot de passe initial est attribué au compte administrateur lors de la création d'un établissement unique ?",
        "options": [
          "« admin123 »",
          "Un mot de passe aléatoire envoyé par e-mail",
          "« password123 », à changer ensuite",
          "Aucun : l'administrateur le définit lui-même à la première connexion"
        ],
        "answer": 2,
        "explanation": "La création d'un établissement génère un compte administrateur avec le mot de passe initial « password123 », qui devra être changé."
      },
      {
        "question": "Où voyez-vous TOUS les comptes en attente, y compris ceux inscrits sans institution ?",
        "options": [
          "Dans « Administration » › « Demandes de comptes »",
          "Dans « Plateforme » › « Supervision EduWeb »",
          "Dans « Administration » › « Rôles & permissions »",
          "Dans « Plateforme » › « Diagnostics CERTEL »"
        ],
        "answer": 0,
        "explanation": "« Administration » › « Demandes de comptes » regroupe tous les comptes en attente de la plateforme, y compris les inscrits sans institution, que vous affectez à un établissement et un rôle."
      },
      {
        "question": "Dans la matrice « Rôles & permissions », que se passe-t-il pour le rôle « Super administrateur » ?",
        "options": [
          "Ses permissions peuvent être réduites comme pour les autres rôles",
          "Il n'apparaît pas du tout dans la matrice",
          "Il conserve toujours l'ensemble des droits et n'est pas modifiable",
          "Il peut être attribué à un compte en attente depuis cette page"
        ],
        "answer": 2,
        "explanation": "Le rôle « Super administrateur » conserve toujours l'ensemble des droits (non modifiable) et la supervision plateforme lui reste réservée ; il n'est par ailleurs jamais proposé lors de l'affectation des comptes."
      },
      {
        "question": "Quelle valeur de délai désactive complètement la déconnexion automatique après inactivité ?",
        "options": [
          "480",
          "La valeur 0",
          "Une case « Désactiver » distincte",
          "8, exprimé en heures"
        ],
        "answer": 1,
        "explanation": "Dans « Sécurité & sessions », saisir 0 désactive complètement la déconnexion automatique ; la valeur maximale est 480 minutes (8 h)."
      },
      {
        "question": "Quel statut d'abonnement ouvre l'accès complet d'un établissement, notamment à tous les jeux ?",
        "options": [
          "« Suspendu »",
          "« Résilié »",
          "« Actif »",
          "N'importe quelle formule, quel que soit le statut"
        ],
        "answer": 2,
        "explanation": "L'accès complet, notamment à tous les jeux, est réservé aux abonnements dont le « Statut abonnement » est « Actif »."
      },
      {
        "question": "En tant que super administrateur, comment accédez-vous à la formation CERTEL et à ses contenus ?",
        "options": [
          "Vous devez d'abord régler l'inscription par Mobile Money ou carte comme tout utilisateur",
          "Vous bénéficiez d'un accès complet à tous les niveaux et évaluations sans paiement, et vous réglez les tarifs et évaluations sous « Plateforme »",
          "CERTEL n'est accessible qu'aux visiteurs anonymes depuis le menu public",
          "Vous y accédez uniquement après avoir réussi le diagnostic gratuit"
        ],
        "answer": 1,
        "explanation": "Le super administrateur dispose d'un accès complet à CERTEL sans paiement et règle les tarifs d'inscription ainsi que les paramètres des évaluations depuis la section « Plateforme » ; l'inscription est sinon payante (Wave, Orange Money, MTN, Moov ou carte), et gratuite tant qu'aucun prix n'est défini."
      },
      {
        "question": "Comment se déroule l'évaluation certifiante d'un niveau CERTEL ?",
        "options": [
          "Les corrigés s'affichent après chaque question, sans limite de temps",
          "Il s'agit d'une évaluation chronométrée dont les corrigés de l'examen ne sont dévoilés qu'à la fin, avec un certificat PDF paysage à la clé",
          "Elle est facultative et ne donne lieu à aucun certificat",
          "Elle remplace le diagnostic gratuit d'entrée"
        ],
        "answer": 1,
        "explanation": "Chaque niveau CERTEL se conclut par une évaluation chronométrée dont les corrigés de l'examen ne sont dévoilés qu'à la fin ; la réussite donne droit à un certificat PDF au format paysage. À ne pas confondre avec les exercices des modules, eux à vérification immédiate."
      },
      {
        "question": "Comment basculez-vous dans le contexte d'un établissement pour agir comme son administrateur, puis revenez-vous à la plateforme ?",
        "options": [
          "En vous déconnectant puis en vous reconnectant avec le compte de l'établissement",
          "Via le menu déroulant des institutions en haut de l'écran, puis en choisissant « EduWeb · plateforme » pour revenir",
          "Depuis « Supervision EduWeb » uniquement, sans retour possible",
          "En créant un nouveau compte super administrateur par établissement"
        ],
        "answer": 1,
        "explanation": "Le sélecteur d'institution (à côté de l'icône bâtiment, en haut de l'écran) fait basculer tout votre contexte vers l'établissement ; pour revenir, vous rouvrez le sélecteur et choisissez « EduWeb · plateforme »."
      },
      {
        "question": "Comment purger des entrées du journal des « Diagnostics CERTEL » ?",
        "options": [
          "Cocher les lignes voulues (ou « Tout sélectionner »), cliquer « Supprimer la sélection » puis confirmer",
          "Cliquer « Voir » sur chaque ligne pour la supprimer individuellement",
          "La suppression est impossible : le journal est en lecture seule",
          "Suspendre l'établissement concerné depuis « Établissements »"
        ],
        "answer": 0,
        "explanation": "Dans « Diagnostics CERTEL », vous cochez une ou plusieurs lignes (ou la case « Tout sélectionner »), cliquez « Supprimer la sélection » et confirmez ; la suppression est définitive."
      }
    ]
  },
  "ORG_ADMIN": {
    "title": "Formation à la prise en main — Administrateur d'organisation",
    "intro": "Cette formation vous prépare à votre rôle d'« Administrateur d'organisation » dans EduWeb Booking. Vous pilotez votre établissement de bout en bout : son identité et son logo, sa structure en sites et services, ses comptes utilisateurs et leurs rôles, ses ressources et réservations, sa bibliothèque, ses certificats et ses paramètres. Le parcours est progressif et concret : chaque module vous renvoie aux menus et boutons réels de l'interface, depuis la configuration initiale de l'organisation jusqu'au pilotage statistique. À l'issue de cette formation, vous serez pleinement autonome sur les actions permises à votre rôle. Bon à savoir pour le confort de lecture : les textes narratifs des formations et des guides s'affichent avec une police d'au moins 13 px et offrent un lecteur audio « Écouter » pour suivre le contenu à l'oreille. Note : la section « Plateforme » (Supervision EduWeb, Gouvernement & ministères, Établissements, Réglages des jeux, Diagnostics CERTEL, Sécurité & sessions) reste réservée à l'administrateur système. Terminez par l'auto-évaluation (QCM) pour vérifier votre compréhension.",
    "modules": [
      {
        "title": "Configurer l'identité et la structure de l'organisation",
        "objective": "Vous saurez renseigner l'identité de votre établissement et bâtir son arborescence de sites et services.",
        "content": [
          "Dépliez la section « Administration » de la barre latérale, ouvrez « Organisation », puis renseignez sous « Informations générales » le « Nom de l'organisation », le « Sigle », la « Ville » et l'« Adresse ».",
          "Dans « Logo de l'institution », glissez-déposez une image (PNG, JPEG ou WebP) ou cliquez pour la sélectionner : elle remplacera le sigle dans le sélecteur d'institutions ; choisissez au besoin la « Couleur principale », puis cliquez « Enregistrer ».",
          "Ouvrez « Sites & services » : dans la carte « Nouveau site », saisissez le « Nom » (et au besoin « Code » et « Ville »), puis cliquez « Ajouter le site ».",
          "Dans « Nouveau service », saisissez le « Nom », choisissez le « Site de rattachement » et, pour un sous-service, le parent dans « Rattaché à (optionnel) » ; réglez le « Niveau hiérarchique (alignement) », puis cliquez « Ajouter le service ».",
          "Pour réorganiser, saisissez un service par sa poignée et faites-le glisser sur un autre pour l'y rattacher, ou déposez-le au niveau racine pour l'en sortir.",
          "Modifiez un service via l'icône crayon ; supprimez via l'icône corbeille uniquement un service entièrement vide (sans agent, ressource ni sous-service) ou un site sans ressource."
        ]
      },
      {
        "title": "Affecter les membres et créer les comptes utilisateurs",
        "objective": "Vous saurez désigner responsables et agents d'un service, puis créer des comptes un par un ou par cohorte CSV.",
        "content": [
          "Dans « Sites & services », cliquez sur l'icône représentant des personnes en regard d'un service pour ouvrir la fenêtre « Membres ».",
          "Sous « Ajouter des agents », recherchez et cochez les personnes (le bouton « Tout sélectionner » coche la liste filtrée), cliquez « Ajouter (N) », puis sous « Responsable » désignez l'agent responsable du service.",
          "Pour un compte individuel, ouvrez « Utilisateurs », remplissez dans « Nouvel utilisateur » le « Prénom », le « Nom », l'« E-mail » (et au besoin la « Fonction »), choisissez le « Rôle » (tous sauf Super Administrateur) et le « Service », puis cliquez « Créer l'utilisateur » (mot de passe par défaut « password123 »).",
          "Pour une cohorte, repérez « Import par cohorte (CSV) », cliquez « Télécharger le modèle CSV » et complétez les colonnes prenom, nom, email, fonction, role, matricule.",
          "Glissez-déposez le fichier dans la zone prévue puis cliquez « Importer » ; la colonne « role » accepte la clé (ex. RESOURCE_MANAGER) ou le libellé, une valeur vide ou inconnue donnant « Demandeur », et les comptes importés sont créés actifs avec « password123 ».",
          "Vérifiez le compte-rendu : nombre de comptes créés, ignorés et liste des erreurs éventuelles."
        ]
      },
      {
        "title": "Traiter les demandes de comptes et gérer les accès",
        "objective": "Vous saurez valider ou refuser les inscriptions et gérer le cycle de vie des comptes existants.",
        "content": [
          "Ouvrez « Demandes de comptes » dans « Administration » (un badge indique le nombre en attente) pour voir les inscriptions adressées à votre établissement.",
          "Examinez chaque fiche : identité, e-mail, fonction, rôle demandé et ancienneté de la demande.",
          "Cliquez « Valider » pour activer le compte (la personne est informée par e-mail), ou « Refuser » puis « Refuser la demande » pour le supprimer.",
          "Depuis « Utilisateurs », réinitialisez un mot de passe avec l'icône clé (retour à « password123 »).",
          "Suspendez ou réactivez un compte avec l'icône d'alimentation ; ces actions ne sont pas proposées sur votre propre compte."
        ]
      },
      {
        "title": "Gérer ressources, réservations et certificats",
        "objective": "Vous saurez créer catégories et ressources, valider les réservations en attente et délivrer des attestations.",
        "content": [
          "Dans la section « Gestion », ouvrez « Catégories », cliquez « Nouvelle catégorie » (nom, description, mode de validation, icône, couleur) puis validez ; une catégorie contenant des ressources ne peut pas être supprimée.",
          "Ouvrez « Ressources » pour créer ou ajuster salles, salles multimédias, matériels et services et fixer leurs règles de réservation.",
          "Ouvrez « À valider » pour approuver ou refuser les réservations en attente (un badge indique le nombre) ; un refus s'accompagne d'un motif communiqué au demandeur.",
          "Ouvrez « Certificats », puis sous « Configuration de l'établissement » renseignez le « Signataire (nom) » et sa « Qualité du signataire », téléversez « Signature scannée » et « Cachet scanné », ajustez le « Préfixe de numérotation » et cliquez « Enregistrer la configuration ».",
          "Sous « Délivrer une attestation », choisissez le bénéficiaire, le « Parcours / rôle suivi », l'« Intitulé du certificat », la « Durée de la formation » et la « Mention », puis cliquez « Délivrer le certificat » (numéro attribué automatiquement).",
          "Dans le « Journal des certificats délivrés », cliquez « Voir » pour imprimer, « Word » pour exporter, ou « Révoquer » pour annuler un certificat tout en le conservant marqué « Révoqué »."
        ]
      },
      {
        "title": "Paramétrer, piloter et administrer la bibliothèque",
        "objective": "Vous saurez régler les paramètres de réservation, personnaliser les droits de votre personnel, suivre l'activité et administrer la bibliothèque et le Sport cérébral.",
        "content": [
          "Dans « Paramètres », réglez sous « Général » la « Langue » et le « Fuseau horaire », sous « Horaires d'ouverture » l'« Ouverture », la « Fermeture » et les « Jours ouvrés », puis cochez si besoin « Autoriser la validation automatique lorsque la ressource est disponible » et cliquez « Enregistrer les paramètres ».",
          "Dans « Rôles & permissions », ajustez les droits des rôles de votre personnel en cliquant sur les cases de la matrice : vos changements ne concernent que votre établissement et vous ne pouvez ni modifier le rôle Super Administrateur, ni votre propre rôle, ni accorder un droit que vous ne détenez pas ; consultez aussi « Abonnement » pour vérifier formule, nombre de comptes, statut, renouvellement et usage.",
          "Suivez l'activité dans « Réservations » et « Statistiques », et produisez des exports filtrés CSV ou PDF depuis « Rapports ».",
          "Dans la section « Bibliothèque », utilisez « Explorer » pour rechercher, « Déposer » pour ajouter un document, et « À vérifier » pour contrôler et publier les dépôts en attente (un badge en signale le nombre).",
          "Organisez le fonds via « Collections » et « Domaines », suivez la circulation dans « Réservations doc. » et « Emprunts », et pilotez l'usage avec « Statistiques doc. ».",
          "Dans « Gestion » › « Compétitions », créez une compétition (« Intitulé », « Jeu », « Niveau »), partagez le « Code de session », pilotez son déroulé et suivez le « Classement » ; sécurisez enfin votre accès via « Mon compte »."
        ]
      },
      {
        "title": "Se former et certifier ses compétences avec CERTEL",
        "objective": "Vous saurez accéder à CERTEL, situer votre niveau, suivre les modules interactifs et obtenir un certificat ; vous saurez aussi orienter votre personnel vers ce parcours.",
        "content": [
          "CERTEL est la formation certifiante au numérique et à l'intelligence artificielle, accessible à tout utilisateur connecté : depuis votre tableau de bord, ouvrez la section « Principal » › « Formation CERTEL » (ou, hors connexion, le menu public « CERTEL »).",
          "Commencez par le « Diagnostic de niveau » : il est gratuit et corrigé automatiquement, et vous oriente vers le niveau adapté (N1, N2 ou N3).",
          "Suivez votre niveau parmi les 3 niveaux interactifs (6 modules chacun) : leçons illustrées avec lecture audio, exercices auto-corrigés à vérification immédiate et évaluation chronométrée.",
          "Passez l'évaluation certifiante : l'examen ne révèle les corrigés qu'à la fin ; en cas de réussite, vous obtenez un certificat PDF au format paysage.",
          "Concernant l'accès : l'inscription est payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte ; elle reste gratuite tant qu'aucun prix n'a été défini. La fixation des tarifs et le réglage des évaluations relèvent du seul administrateur système (super admin), sous la section « Plateforme », qui dispose par ailleurs d'un accès complet sans paiement.",
          "En tant qu'administrateur d'établissement, encouragez votre personnel à passer le diagnostic gratuit puis à monter en compétence sur CERTEL ; vous pouvez ensuite valoriser ces acquis via le module « Certificats » de votre établissement."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Où téléversez-vous le logo de votre établissement, qui remplacera le sigle dans le sélecteur d'institutions ?",
        "options": [
          "Dans « Paramètres », sous « Général »",
          "Dans « Administration » › « Organisation », rubrique « Logo de l'institution »",
          "Dans « Sites & services », via la fenêtre « Membres »",
          "Dans « Mon compte », section profil"
        ],
        "answer": 1,
        "explanation": "Le logo se téléverse dans « Administration » › « Organisation », sous « Logo de l'institution » (PNG, JPEG ou WebP) ; il s'affiche ensuite à la place du sigle dans le sélecteur d'institutions."
      },
      {
        "question": "Dans « Sites & services », quelle condition permet de supprimer un service via l'icône corbeille ?",
        "options": [
          "Le service doit être entièrement vide : sans agent, ni ressource, ni sous-service",
          "Le service doit avoir un responsable désigné",
          "Il suffit de confirmer deux fois la suppression",
          "N'importe quel service peut être supprimé à tout moment"
        ],
        "answer": 0,
        "explanation": "Seul un service entièrement vide (sans agent, ressource ni sous-service) peut être supprimé ; de même, un site ne peut être supprimé que s'il ne contient aucune ressource."
      },
      {
        "question": "Lors de la création d'un compte via « Créer l'utilisateur », quel est le mot de passe par défaut attribué ?",
        "options": [
          "Un mot de passe aléatoire envoyé par e-mail",
          "Aucun : l'utilisateur le définit lui-même avant la première connexion",
          "« password123 », à changer à la première connexion",
          "Le matricule de l'utilisateur"
        ],
        "answer": 2,
        "explanation": "Le compte est créé avec le mot de passe par défaut « password123 », que l'utilisateur doit changer à sa première connexion."
      },
      {
        "question": "Quel rôle ne pouvez-vous jamais attribuer lors de la création ou de l'import d'utilisateurs ?",
        "options": [
          "Responsable de ressource",
          "Super Administrateur",
          "Demandeur",
          "Administrateur d'organisation"
        ],
        "answer": 1,
        "explanation": "L'administrateur d'organisation peut attribuer tous les rôles sauf Super Administrateur, réservé à l'administrateur système."
      },
      {
        "question": "Dans l'import CSV par cohorte, que devient une ligne dont la colonne « role » est vide ou inconnue ?",
        "options": [
          "La ligne est rejetée et l'import échoue",
          "Le compte est créé avec le rôle « Demandeur »",
          "Le compte est créé en Super Administrateur par sécurité",
          "Le compte reste en attente de validation"
        ],
        "answer": 1,
        "explanation": "La colonne « role » accepte la clé (ex. RESOURCE_MANAGER) ou le libellé ; une valeur vide ou inconnue attribue le rôle « Demandeur ». Les comptes importés sont créés actifs avec « password123 »."
      },
      {
        "question": "Comment validez-vous une nouvelle inscription adressée à votre établissement ?",
        "options": [
          "Dans « Utilisateurs », en cliquant sur l'icône clé",
          "Dans « Paramètres », en cochant la validation automatique",
          "Dans « Demandes de comptes », en cliquant « Valider » sur la fiche",
          "Dans « Abonnement », en augmentant le nombre de comptes"
        ],
        "answer": 2,
        "explanation": "Les inscriptions se traitent dans « Demandes de comptes » : « Valider » active le compte (l'intéressé est informé par e-mail), « Refuser » puis « Refuser la demande » le supprime."
      },
      {
        "question": "Que se passe-t-il lorsque vous « Révoquez » un certificat depuis le journal ?",
        "options": [
          "Le certificat est définitivement supprimé du journal",
          "Le certificat est annulé mais conservé dans le journal, marqué « Révoqué »",
          "Le numéro est libéré et réattribué au prochain certificat",
          "Le bénéficiaire peut le réactiver lui-même"
        ],
        "answer": 1,
        "explanation": "La révocation annule le certificat tout en le conservant dans le « Journal des certificats délivrés », où il apparaît marqué « Révoqué » ; l'action reste tracée."
      },
      {
        "question": "Que pouvez-vous faire dans l'écran « Rôles & permissions » avec votre rôle d'administrateur d'organisation ?",
        "options": [
          "Personnaliser les droits des rôles de votre personnel, avec des garde-fous",
          "Modifier les droits du Super Administrateur",
          "Personnaliser les droits de tous les établissements de la plateforme",
          "Vous accorder à vous-même de nouveaux droits que vous ne possédez pas"
        ],
        "answer": 0,
        "explanation": "En tant qu'admin délégué, vous personnalisez la matrice pour le seul personnel de votre établissement ; vous ne pouvez pas modifier le rôle Super Administrateur ni votre propre rôle, ni accorder un droit que vous ne détenez pas vous-même, et vos changements n'affectent pas les autres institutions."
      },
      {
        "question": "Comment accédez-vous à la formation certifiante CERTEL une fois connecté au tableau de bord ?",
        "options": [
          "Dans la section « Plateforme », réservée à l'administrateur système",
          "Dans « Administration » › « Organisation »",
          "Dans la section « Principal », via « Formation CERTEL »",
          "Uniquement depuis le module « Certificats »"
        ],
        "answer": 2,
        "explanation": "CERTEL est accessible à tout utilisateur connecté depuis la section « Principal » › « Formation CERTEL » du tableau de bord (ou via le menu public « CERTEL » hors connexion). Le diagnostic de niveau y est gratuit."
      },
      {
        "question": "Concernant l'accès payant à CERTEL, quelle affirmation est exacte ?",
        "options": [
          "L'inscription est toujours payante, sans exception",
          "L'inscription est payante (Mobile Money ou carte) mais reste gratuite tant qu'aucun prix n'est défini ; le super admin fixe les tarifs",
          "Seul l'administrateur d'établissement peut fixer les tarifs CERTEL",
          "Le paiement se règle exclusivement par carte bancaire"
        ],
        "answer": 1,
        "explanation": "L'inscription est payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte, mais elle demeure gratuite tant qu'aucun prix n'a été défini. La fixation des tarifs et des évaluations relève du seul administrateur système (super admin), qui dispose en outre d'un accès complet sans paiement."
      }
    ]
  },
  "RESOURCE_MANAGER": {
    "title": "Formation à la prise en main — Responsable de ressource",
    "intro": "Cette formation vous prépare à tenir le rôle de « Responsable de ressource » (RESOURCE_MANAGER) dans EduWeb Booking. Vous êtes en charge du parc de ressources de votre établissement : salles, salles multimédias, matériels et services. À l'issue du parcours, vous saurez créer et paramétrer vos ressources, gérer les postes des salles multimédias, rendre une ressource indisponible puis la rouvrir, traiter les demandes de réservation soumises à validation, et suivre l'activité grâce au calendrier, aux statistiques et aux rapports. Vous découvrirez aussi CERTEL, la formation certifiante au numérique et à l'intelligence artificielle, ouverte à tout utilisateur connecté pour monter en compétences. Bon à savoir avant de commencer : votre rôle est centré sur la gestion de vos ressources et la décision sur les demandes associées. Vous pouvez créer et modifier des ressources mais pas les supprimer ni gérer les catégories (cela relève de l'administrateur) ; vous n'administrez pas l'établissement (organisation, sites, utilisateurs, rôles, abonnement) ; côté bibliothèque, vous pouvez consulter et télécharger les documents autorisés, mais pas en déposer. Chaque module renvoie aux menus et boutons exacts de l'application. Pour le confort de lecture, les textes des formations et des guides s'affichent dans une police d'au moins 13 px et disposent d'un lecteur audio « Écouter » qui vous permet d'en suivre la narration à l'oral.",
    "modules": [
      {
        "title": "Module 1 — Créer et paramétrer une ressource",
        "objective": "Vous saurez créer une nouvelle ressource et définir ses informations, sa disponibilité et ses règles de réservation.",
        "content": [
          "Dans le menu « Gestion », ouvrez « Ressources », puis cliquez sur « Nouvelle ressource ».",
          "Dans la section « Informations générales », renseignez le « Nom de la ressource », le « Code », la « Catégorie » et, si besoin, le « Site », le « Niveau », le « Service » et une « Description ».",
          "Dans la section « Capacité & disponibilité », choisissez le « Statut », désignez un « Responsable », puis indiquez la « Capacité (places) », la « Quantité totale », la « Localisation » et les « Équipements (séparés par des virgules) ».",
          "Dans la section « Règles de réservation », fixez le « Mode » (« Exclusive (créneau entier) », « Partagée (par quantité) » ou « Mixte »), la « Durée max. (minutes) » et le « Préavis min. (heures) ».",
          "Cochez « Soumettre les réservations à validation » pour que les demandes passent par votre approbation ; cochez « Réservation poste par poste (plan de salle) » si la capacité correspond à des postes réservables individuellement.",
          "Cliquez sur « Créer la ressource ». Pour modifier une ressource existante, ouvrez sa fiche, cliquez sur « Modifier », ajustez les champs, puis terminez par « Enregistrer les modifications »."
        ]
      },
      {
        "title": "Module 2 — Gérer les salles multimédias et leurs postes",
        "objective": "Vous saurez ajouter une salle multimédia et ajuster son nombre de postes sur le plan de salle.",
        "content": [
          "Dans le menu « Principal », ouvrez « Salles multimédias » : la page « Salles multimédias — plan des postes » affiche la disponibilité en temps réel (postes libres et occupés).",
          "Pour créer une salle, cliquez sur « Ajouter une salle », puis dans la fenêtre « Nouvelle salle multimédia » renseignez le « Nom de la salle » et la « Capacité (nombre de postes) ».",
          "Cliquez sur « Créer la salle » : la salle est créée avec un plan de postes et un code automatiques, et le message « Salle ajoutée avec succès. » confirme l'opération.",
          "Pour modifier le nombre de postes d'une salle, utilisez le compteur « Postes » au bas de sa carte (boutons moins / plus ou saisie directe du nombre).",
          "Validez le nouveau nombre en cliquant sur la coche (« Enregistrer la capacité ») : le message « Capacité mise à jour. » confirme l'enregistrement.",
          "Retenez que la plateforme refuse de réduire la capacité en dessous d'un poste déjà réservé : un message vous indique alors le nombre minimum de postes à conserver."
        ]
      },
      {
        "title": "Module 3 — Rendre une ressource indisponible, puis la rouvrir",
        "objective": "Vous saurez retirer temporairement une ressource de la réservation (maintenance, panne) et la remettre en service.",
        "content": [
          "Dans le menu « Gestion », ouvrez « Ressources », ouvrez la fiche de la ressource concernée, puis cliquez sur « Modifier ».",
          "Dans la section « Capacité & disponibilité », ouvrez la liste « Statut ».",
          "Sélectionnez « En maintenance » pour une intervention planifiée, « Hors service » en cas de panne, ou « Indisponible » pour un retrait temporaire.",
          "Cliquez sur « Enregistrer les modifications » : la ressource n'est plus réservable tant que son statut n'est pas remis sur « Disponible ».",
          "Pour la rouvrir, revenez sur « Modifier », repassez le « Statut » à « Disponible » et enregistrez."
        ]
      },
      {
        "title": "Module 4 — Traiter les demandes de réservation à valider",
        "objective": "Vous saurez examiner une demande en attente puis l'approuver ou la refuser avec un motif.",
        "content": [
          "Dans le menu « Gestion », ouvrez « À valider » : la page « Demandes à valider » liste les demandes en attente (un badge dans le menu en indique le nombre, et un compteur « … demande(s) en attente » s'affiche en haut de la liste).",
          "Ouvrez une demande pour vérifier, dans les « Détails de la réservation », le « Créneau », la « Durée », le « Type d'usage », l'« Effectif » et, le cas échéant, la « Quantité » ou les « Postes réservés ».",
          "Consultez « Motif & besoins » pour le motif, et l'encart « Demandeur » pour identifier la personne qui réserve.",
          "Si la demande est conforme, cliquez sur « Approuver ».",
          "Pour refuser, cliquez sur « Refuser » : dans la fenêtre « Refuser la demande », saisissez le « Motif du refus » puis cliquez sur « Confirmer le refus ».",
          "Le motif est communiqué au demandeur et la demande disparaît de la liste « À valider » ; lorsque tout est traité, le message « Tout est à jour » apparaît."
        ]
      },
      {
        "title": "Module 5 — Suivre l'activité, les statistiques et les rapports",
        "objective": "Vous saurez suivre les réservations, lire les indicateurs de pilotage et produire un export.",
        "content": [
          "Dans le menu « Principal », ouvrez « Calendrier » pour visualiser les créneaux occupés et planifier la disponibilité des ressources.",
          "Dans le menu « Gestion », ouvrez « Réservations » (« Toutes les réservations ») pour suivre l'ensemble des demandes ; filtrez par statut ou recherchez par code, motif ou ressource.",
          "Ouvrez « Statistiques » (« Statistiques & pilotage ») pour consulter les indicateurs clés (« Total réservations », « Taux d'occupation », « Taux de validation », « Taux d'annulation ») et les graphiques (« Répartition par statut », « Répartition par catégorie », « Ressources les plus réservées »).",
          "Ouvrez « Rapports » pour produire un export : choisissez le périmètre (par période, par ressource, par catégorie, par site / service, par utilisateur ou par statut), puis exportez au format CSV ou PDF.",
          "Appuyez-vous sur ces indicateurs pour ajuster les règles, le statut et la capacité de vos ressources.",
          "Pour sécuriser votre accès, ouvrez « Mon compte » et, dans l'encart « Changer mon mot de passe », saisissez votre mot de passe actuel puis un nouveau mot de passe (au moins 8 caractères) avant de cliquer sur « Mettre à jour le mot de passe »."
        ]
      },
      {
        "title": "Module 6 — Vous former et vous certifier avec CERTEL",
        "objective": "Vous saurez accéder à CERTEL, évaluer votre niveau, suivre les modules interactifs et obtenir votre certificat au numérique et à l'IA.",
        "content": [
          "CERTEL est la formation certifiante au numérique et à l'intelligence artificielle, ouverte à tout utilisateur connecté. Depuis votre tableau de bord, ouvrez la section « Principal » puis « Formation CERTEL » ; vous pouvez aussi y accéder par le menu public « CERTEL ».",
          "Commencez par le « Diagnostic de niveau », gratuit : il évalue automatiquement vos acquis et vous oriente vers le niveau adapté (Niveau 1, 2 ou 3).",
          "Le parcours compte 3 niveaux interactifs ; chaque niveau comprend 6 modules associant des leçons illustrées avec lecture audio, des exercices auto-corrigés à vérification immédiate, et une évaluation chronométrée pour vous entraîner en conditions réelles.",
          "Passez l'évaluation certifiante du niveau : à la différence des exercices d'entraînement, l'examen ne dévoile les corrigés qu'à la fin, pour garantir une évaluation fidèle de vos compétences.",
          "En cas de réussite, vous obtenez un certificat au format PDF paysage, attestant de votre niveau.",
          "L'inscription à CERTEL peut être payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte bancaire ; elle reste gratuite tant qu'aucun prix n'a été défini pour le niveau concerné.",
          "Le super administrateur dispose d'un accès complet sans paiement et règle les tarifs ainsi que les évaluations depuis la section « Plateforme »."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Où créez-vous une nouvelle ressource (salle, matériel, service) ?",
        "options": [
          "Dans le menu « Gestion » › « Ressources », via le bouton « Nouvelle ressource »",
          "Dans le menu « Principal » › « Calendrier », via « Ajouter un créneau »",
          "Dans le menu « Gestion » › « À valider », via « Approuver »"
        ],
        "answer": 0,
        "explanation": "La création d'une ressource se fait dans « Gestion » › « Ressources », en cliquant sur « Nouvelle ressource ». Le calendrier et la page « À valider » servent au suivi et au traitement des demandes, pas à la création de ressources."
      },
      {
        "question": "En tant que responsable de ressource, que pouvez-vous faire sur une ressource ?",
        "options": [
          "La supprimer définitivement et gérer les catégories",
          "La créer et la modifier, mais pas la supprimer ni gérer les catégories",
          "Uniquement la consulter, sans la modifier"
        ],
        "answer": 1,
        "explanation": "Vous pouvez créer et modifier vos ressources, mais la suppression d'une ressource et la gestion des catégories relèvent de l'administrateur."
      },
      {
        "question": "Après avoir saisi le nom et la capacité dans la fenêtre « Nouvelle salle multimédia », sur quel bouton cliquez-vous pour créer la salle ?",
        "options": [
          "« Enregistrer la capacité »",
          "« Ajouter une salle »",
          "« Créer la salle »"
        ],
        "answer": 2,
        "explanation": "Dans la fenêtre « Nouvelle salle multimédia », c'est le bouton « Créer la salle » qui valide la création ; le message « Salle ajoutée avec succès. » confirme l'opération. « Ajouter une salle » sert à ouvrir cette fenêtre, et « Enregistrer la capacité » valide un changement du nombre de postes."
      },
      {
        "question": "Que se passe-t-il si vous tentez de réduire le nombre de postes d'une salle en dessous d'un poste déjà réservé ?",
        "options": [
          "La plateforme refuse la réduction et indique le nombre minimum de postes à conserver",
          "La réduction est acceptée et la réservation existante est automatiquement annulée",
          "La salle passe automatiquement au statut « Hors service »"
        ],
        "answer": 0,
        "explanation": "La plateforme refuse de réduire la capacité en dessous d'un poste déjà réservé et affiche un message indiquant le nombre minimum de postes à conserver, ce qui protège les réservations en cours."
      },
      {
        "question": "Comment rendre une ressource temporairement non réservable pour cause de panne ?",
        "options": [
          "La supprimer puis la recréer une fois réparée",
          "Dans sa fiche, cliquer sur « Modifier », régler le « Statut » sur « Hors service » et enregistrer",
          "Réduire sa « Quantité totale » à zéro dans le calendrier"
        ],
        "answer": 1,
        "explanation": "Pour une panne, ouvrez la fiche, cliquez sur « Modifier », réglez le « Statut » sur « Hors service » (ou « En maintenance » / « Indisponible » selon le cas) puis « Enregistrer les modifications ». La ressource n'est plus réservable jusqu'au retour au statut « Disponible ». La suppression n'est pas accessible à votre rôle."
      },
      {
        "question": "Pour refuser une demande de réservation, quelle étape est obligatoire ?",
        "options": [
          "Joindre une pièce justificative à la demande",
          "Modifier d'abord le statut de la ressource concernée",
          "Saisir un « Motif du refus » puis cliquer sur « Confirmer le refus »"
        ],
        "answer": 2,
        "explanation": "Lors d'un refus, la fenêtre « Refuser la demande » exige un « Motif du refus » avant de cliquer sur « Confirmer le refus ». Ce motif est ensuite communiqué au demandeur."
      },
      {
        "question": "Où produisez-vous un export d'usage au format CSV ou PDF (par période, ressource, catégorie, etc.) ?",
        "options": [
          "Dans « Rapports »",
          "Dans « Salles multimédias »",
          "Dans « Mon compte »"
        ],
        "answer": 0,
        "explanation": "Les exports d'usage (par période, ressource, catégorie, site/service, utilisateur ou statut) au format CSV ou PDF se produisent depuis « Rapports ». « Statistiques » affiche les indicateurs à l'écran, mais l'export se fait dans « Rapports »."
      },
      {
        "question": "Concernant la bibliothèque numérique, que vous permet votre rôle ?",
        "options": [
          "Déposer de nouveaux documents et gérer les collections",
          "Consulter et télécharger les documents autorisés, sans pouvoir en déposer",
          "Aucun accès à la bibliothèque"
        ],
        "answer": 1,
        "explanation": "Depuis « Explorer » et « Documents », vous pouvez consulter et télécharger les documents dont le niveau d'accès le permet, mais le dépôt de nouveaux documents n'est pas accessible à votre rôle."
      },
      {
        "question": "Comment accédez-vous à la formation certifiante CERTEL et que vous permet-elle d'abord d'évaluer gratuitement ?",
        "options": [
          "Via « Plateforme » uniquement, réservée au super administrateur",
          "Via « Formation CERTEL » (section « Principal » du tableau de bord) ou le menu public « CERTEL », en commençant par le « Diagnostic de niveau » gratuit",
          "Via « Rapports », après avoir produit un export PDF"
        ],
        "answer": 1,
        "explanation": "CERTEL est ouverte à tout utilisateur connecté : on y accède par « Formation CERTEL » (section « Principal ») ou par le menu public « CERTEL ». Le « Diagnostic de niveau » est gratuit et vous oriente vers le niveau adapté. La section « Plateforme » sert au super administrateur pour régler tarifs et évaluations."
      },
      {
        "question": "Dans CERTEL, qu'est-ce qui distingue l'évaluation certifiante des exercices d'entraînement ?",
        "options": [
          "Elle ne révèle les corrigés qu'à la fin de l'examen, alors que les exercices d'entraînement sont à vérification immédiate",
          "Elle se fait sans limite de temps et sans certificat",
          "Elle est réservée aux ressources et salles multimédias"
        ],
        "answer": 0,
        "explanation": "Les exercices des modules sont auto-corrigés à vérification immédiate, tandis que l'évaluation certifiante ne dévoile les corrigés qu'à la fin pour mesurer fidèlement vos compétences. En cas de réussite, un certificat PDF paysage est délivré."
      }
    ]
  },
  "VALIDATOR": {
    "title": "Formation à la prise en main — Validateur hiérarchique",
    "intro": "Cette formation vous prépare à exercer le rôle de « Validateur hiérarchique » dans EduWeb Booking. En tant que responsable de service ou chef de département, vous êtes chargé d'approuver, de refuser ou de suivre les demandes de réservation soumises à validation. À l'issue de ce parcours, vous saurez accéder aux demandes en attente, les examiner en détail, vous prononcer de façon tracée et justifiée, suivre l'activité de réservation et les statistiques de pilotage, gérer vos propres réservations comme votre compte, et tirer parti de la formation certifiante CERTEL au numérique et à l'IA accessible à tout utilisateur connecté. Point essentiel à retenir dès maintenant : votre rôle est centré sur la décision (vous consultez ressources, calendrier et statistiques en lecture seule, sans les administrer), et vous ne pouvez jamais valider une demande que vous avez vous-même déposée — elle sera traitée par un autre validateur. Bon à savoir pour le confort de lecture : les contenus de formation et les guides s'affichent avec une police d'au moins 13 px et offrent un lecteur audio « Écouter » sur les textes narratifs. Suivez les modules dans l'ordre, puis validez vos acquis avec l'auto-évaluation finale.",
    "modules": [
      {
        "title": "Accéder aux demandes à traiter",
        "objective": "Vous saurez localiser et lire la file des demandes de réservation en attente de votre décision.",
        "content": [
          "Dans la barre latérale, ouvrez la catégorie « Gestion » puis cliquez sur « À valider ».",
          "Repérez le badge affiché à côté de « À valider » : il indique en permanence le nombre de demandes en attente.",
          "Sur la page « Demandes à valider », parcourez chaque demande présentée sous forme de carte (ressource concernée, créneau, nom du demandeur, type d'usage, effectif éventuel et code de la demande).",
          "Lisez la mention « X demande(s) en attente » qui récapitule le volume à traiter ; lorsque tout est traité, le message « Tout est à jour » s'affiche."
        ]
      },
      {
        "title": "Examiner une demande avant de décider",
        "objective": "Vous saurez ouvrir la fiche d'une demande et vérifier tous les éléments utiles à une décision éclairée.",
        "content": [
          "Sur la carte d'une demande, cliquez sur son intitulé pour ouvrir sa fiche détaillée.",
          "Lisez le bloc « Détails de la réservation » : créneau, durée, type d'usage, effectif, quantité ou postes réservés, et lieu le cas échéant.",
          "Consultez le bloc « Motif & besoins » pour vérifier le motif, les besoins particuliers, l'éventuelle mention « Assistance technique demandée » et la « Note du demandeur ».",
          "Identifiez le demandeur dans le bloc « Demandeur » (nom et fonction).",
          "Au besoin, parcourez le bloc « Suivi de la demande » qui retrace tout l'historique de la demande."
        ]
      },
      {
        "title": "Approuver ou refuser une demande",
        "objective": "Vous saurez vous prononcer sur une demande de façon conforme, justifiée et tracée.",
        "content": [
          "Prononcez-vous directement depuis la carte dans « À valider », ou depuis le bloc « Actions » de la fiche détaillée.",
          "Si la demande est conforme, cliquez sur « Approuver » : la réservation passe au statut « Validée ».",
          "Si la demande doit être refusée, cliquez sur « Refuser » : la fenêtre « Refuser la demande » s'ouvre.",
          "Renseignez le champ obligatoire « Motif du refus » (il sera communiqué au demandeur), puis cliquez sur « Confirmer le refus » ; utilisez « Annuler » pour renoncer.",
          "Retenez que, dans tous les cas, le demandeur reçoit automatiquement une notification de votre décision, enregistrée dans le bloc « Validation » de la fiche.",
          "Souvenez-vous que vous ne pouvez pas traiter une demande que vous avez déposée vous-même : elle est obligatoirement validée par un autre validateur."
        ]
      },
      {
        "title": "Suivre l'activité de réservation et les statistiques",
        "objective": "Vous saurez consulter l'ensemble des réservations de l'organisation et piloter l'activité via les indicateurs clés.",
        "content": [
          "Ouvrez « Réservations » (catégorie « Gestion ») pour consulter toutes les réservations de votre organisation.",
          "Filtrez la liste avec le sélecteur « Tous les statuts », ou retrouvez une demande précise grâce à la recherche par code, motif ou ressource.",
          "Ouvrez « Calendrier » pour visualiser l'occupation des ressources, et « Ressources » ou « Salles multimédias » pour vérifier une ressource — en consultation seule, sans modification possible.",
          "Ouvrez « Statistiques » (« Statistiques & pilotage ») pour suivre les indicateurs clés : « Total réservations », « Cette semaine », « En attente », « Taux d'occupation », « Taux de validation », « Refusées », « Taux d'annulation » et « Non honorées ».",
          "Appuyez-vous sur les graphiques « Répartition par statut » et « Répartition par catégorie » pour analyser l'activité."
        ]
      },
      {
        "title": "Gérer vos propres réservations et votre compte",
        "objective": "Vous saurez créer et suivre vos réservations personnelles, et administrer votre compte et vos guides.",
        "content": [
          "Cliquez sur « + Nouvelle réservation » en bas de la barre latérale pour soumettre une demande en votre nom (elle sera traitée par un autre validateur).",
          "Suivez vos demandes dans « Mes réservations » (catégorie « Principal »), réparties entre « À venir » et « Historique ».",
          "Une fois votre réservation validée et le créneau venu, ouvrez sa fiche et cliquez sur « Je suis arrivé », puis sur « Activité terminée » à la fin de l'activité ; pour renoncer, cliquez sur « Annuler la réservation » et confirmez.",
          "Ouvrez « Mon compte » pour vérifier vos informations, puis utilisez « Changer mon mot de passe » (mot de passe actuel, nouveau d'au moins 8 caractères, confirmation, puis « Mettre à jour le mot de passe »).",
          "Dans « Centre d'aide » (catégorie « Aide »), téléchargez ce guide via « Mon guide (PDF) » ou « Mon guide (Word) », et ouvrez « Support » en cas de difficulté ; les textes narratifs des guides s'affichent en police d'au moins 13 px avec un lecteur audio « Écouter ».",
          "Si un avertissement de déconnexion automatique apparaît, choisissez « Rester connecté » pour ne pas perdre une décision en cours."
        ]
      },
      {
        "title": "Vous former et vous certifier avec CERTEL",
        "objective": "Vous saurez accéder à la formation certifiante CERTEL au numérique et à l'IA, suivre les niveaux interactifs et obtenir votre certificat.",
        "content": [
          "Depuis votre tableau de bord, ouvrez « Formation CERTEL » dans la section « Principal » ; depuis le site public, passez par le menu « CERTEL ». La formation est accessible à tout utilisateur connecté, indépendamment de votre rôle de validateur.",
          "Commencez par le « Diagnostic de niveau » : il est GRATUIT, corrigé automatiquement, et vous oriente vers le niveau adapté (Niveau 1, 2 ou 3).",
          "Progressez dans les 3 niveaux interactifs, composés chacun de 6 modules : leçons illustrées avec LECTURE AUDIO, exercices auto-corrigés à VÉRIFICATION IMMÉDIATE, et évaluation CHRONOMÉTRÉE.",
          "Passez l'évaluation certifiante : à la différence des exercices d'entraînement, l'examen ne révèle les corrigés QU'À LA FIN. En cas de réussite, vous obtenez un CERTIFICAT PDF au format paysage.",
          "Notez le modèle d'accès : l'INSCRIPTION est PAYANTE par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte ; elle reste GRATUITE tant qu'aucun prix n'a été défini.",
          "Retenez que le SUPER ADMIN dispose d'un accès complet sans paiement et règle les tarifs et les évaluations depuis la section « Plateforme ».",
          "Profitez des mêmes facilités d'accessibilité que dans vos guides : police d'au moins 13 px et lecteur audio « Écouter » sur les textes narratifs des leçons."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Où accédez-vous aux demandes de réservation en attente de votre décision ?",
        "options": [
          "Dans « Réservations », catégorie « Gestion »",
          "Dans « À valider », catégorie « Gestion »",
          "Dans « Mes réservations », catégorie « Principal »",
          "Dans « Statistiques », catégorie « Statistiques & pilotage »"
        ],
        "answer": 1,
        "explanation": "Les demandes à traiter se trouvent dans « À valider » (catégorie « Gestion »), où un badge indique en permanence leur nombre. « Réservations » sert à consulter toutes les réservations, et « Mes réservations » concerne uniquement vos propres demandes."
      },
      {
        "question": "Que se passe-t-il lorsque vous cliquez sur « Refuser » une demande ?",
        "options": [
          "La demande est immédiatement refusée sans autre étape",
          "La fenêtre « Refuser la demande » s'ouvre et exige un « Motif du refus »",
          "La demande est reportée automatiquement à une date ultérieure",
          "Le demandeur doit confirmer le refus de son côté"
        ],
        "answer": 1,
        "explanation": "Le clic sur « Refuser » ouvre la fenêtre « Refuser la demande », dans laquelle le champ « Motif du refus » est obligatoire avant de cliquer sur « Confirmer le refus ». Ce motif est communiqué au demandeur."
      },
      {
        "question": "Pouvez-vous valider une demande de réservation que vous avez vous-même déposée ?",
        "options": [
          "Oui, à condition de justifier votre décision",
          "Oui, si vous êtes responsable du service concerné",
          "Non, elle est obligatoirement traitée par un autre validateur",
          "Oui, mais uniquement pour l'approuver, pas pour la refuser"
        ],
        "answer": 2,
        "explanation": "Le rôle interdit de valider sa propre demande : lorsque vous êtes le demandeur, les actions d'approbation et de refus n'apparaissent pas, et la demande est obligatoirement traitée par un autre validateur, afin de garantir l'impartialité de la décision."
      },
      {
        "question": "Après votre décision (approbation ou refus), qu'advient-il pour le demandeur ?",
        "options": [
          "Il doit consulter manuellement le statut, aucune alerte n'est envoyée",
          "Il reçoit automatiquement une notification, et la décision est tracée dans le bloc « Validation »",
          "Seuls les refus génèrent une notification",
          "Vous devez lui écrire vous-même pour l'informer"
        ],
        "answer": 1,
        "explanation": "Dans tous les cas, le demandeur reçoit automatiquement une notification de votre décision, qui est enregistrée dans le bloc « Validation » de la fiche : la traçabilité est garantie."
      },
      {
        "question": "Quel niveau d'accès avez-vous sur les ressources, le calendrier et les salles multimédias ?",
        "options": [
          "Lecture seule, sans pouvoir les modifier",
          "Lecture et modification complètes",
          "Aucun accès, ils sont réservés aux administrateurs",
          "Modification possible uniquement pour vos propres réservations"
        ],
        "answer": 0,
        "explanation": "Le validateur est centré sur la décision : il consulte « Calendrier », « Ressources » et « Salles multimédias » en lecture seule, sans pouvoir les administrer ni les modifier."
      },
      {
        "question": "Comment créez-vous une réservation en votre propre nom ?",
        "options": [
          "Depuis « À valider » en vous attribuant un créneau",
          "Via « + Nouvelle réservation » en bas de la barre latérale",
          "Ce n'est pas possible pour un validateur",
          "Depuis « Statistiques » en cliquant sur « En attente »"
        ],
        "answer": 1,
        "explanation": "Vous créez vos propres réservations via « + Nouvelle réservation » en bas de la barre latérale ; cette demande sera ensuite traitée par un autre validateur, et vous la suivez dans « Mes réservations »."
      },
      {
        "question": "Quel indicateur suivez-vous dans « Statistiques » pour mesurer la part de demandes approuvées ?",
        "options": [
          "Le « Taux d'occupation »",
          "Le « Taux d'annulation »",
          "Le « Taux de validation »",
          "Les « Non honorées »"
        ],
        "answer": 2,
        "explanation": "Le « Taux de validation » mesure la part des demandes approuvées. Le « Taux d'occupation » concerne l'usage des ressources, et le « Taux d'annulation » ou les « Non honorées » mesurent d'autres aspects de l'activité."
      },
      {
        "question": "Comment accédez-vous à la formation certifiante CERTEL et quel en est le point de départ gratuit ?",
        "options": [
          "Elle est réservée aux administrateurs ; aucun accès pour un validateur",
          "Via « Formation CERTEL » (section « Principal ») ou le menu public « CERTEL », en commençant par le diagnostic de niveau gratuit",
          "Uniquement depuis « Statistiques », après paiement obligatoire par carte",
          "En écrivant au support, qui ouvre l'accès manuellement"
        ],
        "answer": 1,
        "explanation": "CERTEL est accessible à tout utilisateur connecté : depuis le tableau de bord via « Formation CERTEL » (section « Principal ») ou via le menu public « CERTEL ». Le « Diagnostic de niveau » est gratuit, corrigé automatiquement, et oriente vers le niveau adapté."
      },
      {
        "question": "Concernant l'évaluation certifiante CERTEL et son modèle d'accès, quelle affirmation est exacte ?",
        "options": [
          "L'examen révèle les corrigés à la fin et donne un certificat PDF ; l'inscription est payante par Mobile Money ou carte, mais gratuite tant qu'aucun prix n'est défini",
          "L'examen affiche chaque corrigé immédiatement, comme les exercices d'entraînement",
          "La certification est toujours payante, sans aucune exception",
          "Le certificat est délivré au format portrait et envoyé par courrier"
        ],
        "answer": 0,
        "explanation": "À la différence des exercices à vérification immédiate, l'examen certifiant ne révèle les corrigés qu'à la fin et délivre un certificat PDF au format paysage. L'inscription est payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou carte, mais reste gratuite tant qu'aucun prix n'a été défini ; le super admin dispose d'un accès complet sans paiement."
      }
    ]
  },
  "REQUESTER": {
    "title": "Formation à la prise en main — Utilisateur demandeur",
    "intro": "Bienvenue dans la formation à la prise en main du rôle « Demandeur » d'EduWeb Booking. À l'issue de ce parcours, vous serez pleinement autonome au quotidien : parcourir les ressources et les salles multimédias, créer et suivre vos réservations, lire votre calendrier, exploiter la bibliothèque numérique (consulter, télécharger, réserver, déposer un document) et gérer votre compte. Vous découvrirez aussi CERTEL, la formation certifiante au numérique et à l'intelligence artificielle ouverte à tout utilisateur connecté. Les modules suivent l'ordre logique d'un usage réel et renvoient aux libellés exacts des menus et des boutons. Bon à savoir : on peut créer un compte sans indiquer d'institution ; c'est alors un administrateur qui vous rattache à votre établissement et à votre service, après quoi tout votre espace de travail s'active. Côté confort de lecture, les textes sont affichés dans une taille d'au moins 13 px et chaque contenu narratif propose un bouton « Écouter » pour une écoute audio. Prenez le temps de réaliser chaque action dans l'application au fur et à mesure, puis validez vos acquis avec l'auto-évaluation finale.",
    "modules": [
      {
        "title": "Module 1 — Découvrir les ressources disponibles",
        "objective": "Vous saurez parcourir le catalogue de l'établissement et repérer une ressource réservable ainsi que son état de disponibilité.",
        "content": [
          "Dans la barre latérale, section « Gestion », ouvrez « Ressources » pour parcourir le catalogue (salles, salles multimédias, matériels, services).",
          "Affinez votre recherche avec la barre « Rechercher par nom, code ou lieu… » et les filtres déroulants : « Toutes les catégories », « Tous les statuts » et « Tous les sites » (ce dernier n'apparaît que lorsque plusieurs sites existent).",
          "Ouvrez la fiche d'une ressource pour lire sa description, sa capacité, sa localisation et son état : « Disponible maintenant », « Occupée actuellement » ou « Non réservable ».",
          "Lancez directement une demande avec le bouton « Réserver » lorsque la ressource est réservable, depuis la fiche ou la liste.",
          "Pour une salle d'ordinateurs, préférez « Salles multimédias » dans le menu « Principal » : vous y verrez en plus le plan des postes en temps réel."
        ]
      },
      {
        "title": "Module 2 — Réserver une ressource avec l'assistant",
        "objective": "Vous saurez créer une demande de réservation complète à l'aide de l'assistant en six étapes et la soumettre.",
        "content": [
          "Cliquez sur « + Nouvelle réservation » dans la barre latérale, ou sur le bouton « Réserver » depuis une ressource.",
          "Étape « Catégorie » puis étape « Ressource » : sélectionnez d'abord la catégorie, puis la ressource souhaitée, en cliquant « Continuer » à chaque fois (ce sont deux étapes distinctes).",
          "Étape « Motif » : renseignez l'« Intitulé », le « Type d'usage », l'« Effectif / participants » et le « Motif » (seul le « Motif » est obligatoire), puis « Continuer ».",
          "Étape « Créneau » : indiquez les dates et heures de début et de fin, puis cliquez sur « Vérifier la disponibilité » ; si « Ce créneau est disponible. Vous pouvez continuer. » s'affiche, poursuivez, sinon appliquez le « Créneau proposé » ou corrigez vos dates.",
          "Étape « Détails » : précisez les « Besoins spécifiques », cochez « J'ai besoin d'une assistance technique » si nécessaire et ajoutez une « Note pour le validateur » (facultative).",
          "Étape « Confirmation » : vérifiez le récapitulatif puis cliquez sur « Soumettre la demande » ; le message « Votre demande de réservation a été enregistrée. » confirme l'envoi."
        ]
      },
      {
        "title": "Module 3 — Réserver des postes en salle multimédia",
        "objective": "Vous saurez choisir des postes précis sur le plan d'une salle multimédia ou réserver la salle entière.",
        "content": [
          "Dans le menu « Principal », ouvrez « Salles multimédias » : le plan des postes s'affiche en temps réel (postes verts libres, postes rouges occupés), avec le nombre de postes libres et occupés.",
          "Cliquez sur « Réserver des postes » pour quelques postes, ou sur « Réserver la salle » pour mobiliser toute la salle.",
          "Dans l'assistant, à l'étape « Créneau », vous pouvez basculer entre « Réserver des postes » et « Réserver toute la salle » selon votre besoin.",
          "Cliquez sur « Vérifier la disponibilité », puis sous « Choisissez vos postes », cliquez sur les postes verts pour les sélectionner (le compteur « poste(s) sélectionné(s) » se met à jour).",
          "En mode salle entière, vérifiez le message « La salle entière est libre sur ce créneau » avant de continuer ; sinon, choisissez un autre créneau ou revenez à la sélection de postes.",
          "Poursuivez jusqu'à l'étape « Confirmation », puis cliquez sur « Soumettre la demande »."
        ]
      },
      {
        "title": "Module 4 — Calendrier, suivi et gestion de mes réservations",
        "objective": "Vous saurez visualiser vos créneaux, suivre l'état de vos demandes et réaliser les actions clés (présence, clôture, annulation).",
        "content": [
          "Dans le menu « Principal », ouvrez « Calendrier » : la vue mensuelle affiche vos réservations jour par jour ; utilisez « Aujourd'hui » et les flèches pour naviguer, et cliquez sur une journée pour ouvrir son détail (le calendrier n'affiche que vos propres réservations).",
          "Ouvrez « Mes réservations » : vos demandes sont classées en « À venir » et « Historique » ; utilisez la recherche et le filtre « Tous les statuts » pour en retrouver une.",
          "Cliquez sur une réservation pour ouvrir sa fiche (« Détails de la réservation », « Motif & besoins », « Suivi de la demande »).",
          "Une fois la demande validée et le créneau arrivé, cliquez sur « Je suis arrivé » dans le panneau « Actions », puis sur « Activité terminée » à la fin.",
          "Pour renoncer à une réservation encore à venir, cliquez sur « Annuler la réservation » puis confirmez : le créneau est alors libéré.",
          "Surveillez la cloche de notifications en haut à droite : elle signale les décisions de validation (en attente, validée, refusée), avec un badge des notifications non lues."
        ]
      },
      {
        "title": "Module 5 — Exploiter la bibliothèque numérique",
        "objective": "Vous saurez consulter, télécharger, réserver et déposer un document, puis suivre vos demandes documentaires.",
        "content": [
          "Dans le menu « Bibliothèque », ouvrez « Explorer » et recherchez un document (titre, auteur, mot-clé, code) avec la barre de recherche et les filtres (« Tous les types », « Toutes collections », « Tous domaines », « Tout accès »).",
          "Sur la fiche d'un document, dans « Accès au document », cliquez sur « Consulter » pour le lire en ligne ; pour le récupérer, cliquez sur « Télécharger » s'il est gratuit, ou sur « Payer et débloquer » s'il est payant (paiement simulé de démonstration).",
          "Pour un exemplaire physique, cliquez sur « Réserver / Emprunter », choisissez « Consultation sur place » ou « Emprunt physique », puis « Envoyer la demande » ; si le document est restreint, le bouton devient « Demander l'accès » (renseignez votre motif).",
          "Pour déposer un document, ouvrez « Déposer » : suivez l'assistant en sept étapes (« Type », « Métadonnées », « Auteurs », « Résumé », « Fichier », « Droits », « Vérification »), le fichier étant facultatif à cette étape, puis cliquez sur « Soumettre le dépôt ».",
          "Suivez vos demandes documentaires (consultation, emprunt, accès) depuis « Réservations doc. » : le badge de couleur indique le statut de chaque demande, et la cloche de notifications vous prévient lorsqu'elle est acceptée, refusée ou prête.",
          "Astuce compte : depuis « Mon compte », vous pouvez changer votre mot de passe (au moins 8 caractères) ; depuis le « Centre d'aide » (menu « Aide »), téléchargez ce guide en PDF ou en Word."
        ]
      },
      {
        "title": "Module 6 — Se former avec CERTEL (numérique et IA)",
        "objective": "Vous saurez accéder à CERTEL, la formation certifiante au numérique et à l'intelligence artificielle, et comprendre son parcours et ses modalités.",
        "content": [
          "CERTEL est une formation certifiante au numérique et à l'IA, accessible à tout utilisateur connecté. Depuis votre tableau de bord, ouvrez la section « Principal » puis « Formation CERTEL » ; depuis le site public, passez par le menu « CERTEL ».",
          "Commencez par le diagnostic GRATUIT : il évalue votre niveau de départ et vous oriente vers le parcours adapté.",
          "Le parcours comporte 3 niveaux interactifs, chacun organisé en 6 modules : leçons avec audio « Écouter », exercices auto-corrigés à VÉRIFICATION IMMÉDIATE et évaluation CHRONOMÉTRÉE pour vous mettre en situation.",
          "Terminez par l'évaluation certifiante : les corrigés de l'examen sont communiqués À LA FIN, et la réussite donne droit à un CERTIFICAT au format PDF paysage.",
          "Modalités d'accès : l'inscription est PAYANTE par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte ; tant qu'aucun prix n'est défini, l'accès reste GRATUIT.",
          "Bon à savoir : le super administrateur dispose d'un accès complet sans paiement et règle les tarifs ainsi que les évaluations depuis la section « Plateforme ». De votre côté, les mêmes conforts d'accessibilité s'appliquent : taille de texte d'au moins 13 px et bouton « Écouter » sur les contenus narratifs."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Où ouvrez-vous le catalogue des ressources de l'établissement (salles, matériels, services) ?",
        "options": [
          "Dans le menu « Bibliothèque », via « Explorer »",
          "Dans la section « Gestion » de la barre latérale, via « Ressources »",
          "Dans le menu « Aide », via « Centre d'aide »",
          "Dans le menu « Principal », via « Mon compte »"
        ],
        "answer": 1,
        "explanation": "Le catalogue se trouve dans « Ressources », dans la section « Gestion » de la barre latérale. C'est là que figurent salles, salles multimédias, matériels et services, avec recherche et filtres."
      },
      {
        "question": "Lors de l'étape « Motif » de l'assistant de réservation, quel champ est le seul réellement obligatoire ?",
        "options": [
          "Le « Motif »",
          "L'« Intitulé »",
          "Le « Type d'usage »",
          "L'« Effectif / participants »"
        ],
        "answer": 0,
        "explanation": "À l'étape « Motif », vous pouvez renseigner l'intitulé, le type d'usage et l'effectif, mais seul le champ « Motif » est obligatoire pour continuer."
      },
      {
        "question": "À l'étape « Créneau », sur quel bouton cliquez-vous pour savoir si vos dates conviennent ?",
        "options": [
          "« Soumettre la demande »",
          "« Continuer »",
          "« Vérifier la disponibilité »",
          "« Réserver la salle »"
        ],
        "answer": 2,
        "explanation": "Le bouton « Vérifier la disponibilité » teste le créneau saisi. Si le message « Ce créneau est disponible. Vous pouvez continuer. » s'affiche, vous poursuivez ; sinon, vous appliquez le « Créneau proposé » ou corrigez vos dates."
      },
      {
        "question": "Dans une salle multimédia, que signifie un poste affiché en vert sur le plan ?",
        "options": [
          "Le poste est en maintenance",
          "Le poste est occupé",
          "Le poste est réservé par un administrateur",
          "Le poste est libre et sélectionnable"
        ],
        "answer": 3,
        "explanation": "Sur le plan en temps réel, les postes verts sont libres (et donc sélectionnables sous « Choisissez vos postes »), tandis que les postes rouges sont occupés."
      },
      {
        "question": "Votre réservation est validée et le créneau est arrivé : quelle action effectuez-vous d'abord dans le panneau « Actions » ?",
        "options": [
          "Cliquer sur « Je suis arrivé »",
          "Cliquer sur « Activité terminée »",
          "Cliquer sur « Annuler la réservation »",
          "Cliquer sur « Soumettre la demande »"
        ],
        "answer": 0,
        "explanation": "À l'arrivée, vous confirmez votre présence avec « Je suis arrivé ». « Activité terminée » se clique seulement à la fin de l'activité, et « Annuler la réservation » concerne une réservation encore à venir."
      },
      {
        "question": "Sur la fiche d'un document payant, quel bouton permet d'y accéder via le paiement simulé de démonstration ?",
        "options": [
          "« Consulter »",
          "« Demander l'accès »",
          "« Payer et débloquer »",
          "« Envoyer la demande »"
        ],
        "answer": 2,
        "explanation": "Si le téléchargement est payant, le bouton « Payer et débloquer » déclenche le paiement simulé de démonstration. « Télécharger » s'affiche pour un document gratuit, et « Demander l'accès » pour un document restreint."
      },
      {
        "question": "Où suivez-vous l'état de vos demandes documentaires (consultation, emprunt, accès) ?",
        "options": [
          "Dans « Mes réservations » du menu « Principal »",
          "Dans « Réservations doc. » du menu « Bibliothèque »",
          "Dans « Calendrier » du menu « Principal »",
          "Dans « Mon compte »"
        ],
        "answer": 1,
        "explanation": "Les demandes documentaires se suivent dans « Réservations doc. » (menu « Bibliothèque »), où un badge de couleur indique le statut de chaque demande. « Mes réservations » concerne les réservations de ressources."
      },
      {
        "question": "Comment accédez-vous à la formation CERTEL depuis votre tableau de bord ?",
        "options": [
          "Par la section « Gestion », via « Ressources »",
          "Par la section « Principal », via « Formation CERTEL »",
          "Par le menu « Bibliothèque », via « Explorer »",
          "CERTEL n'est accessible qu'au super administrateur"
        ],
        "answer": 1,
        "explanation": "CERTEL est ouverte à tout utilisateur connecté : depuis le tableau de bord, ouvrez la section « Principal » puis « Formation CERTEL » (ou le menu public « CERTEL »). Seul le super administrateur dispose en plus d'un accès complet sans paiement et du réglage des tarifs."
      },
      {
        "question": "Concernant le parcours CERTEL, quelle affirmation est exacte ?",
        "options": [
          "Le diagnostic initial est payant et les 3 niveaux sont gratuits",
          "Le diagnostic est gratuit, les exercices se corrigent à vérification immédiate et la réussite donne un certificat PDF paysage",
          "Il n'existe qu'un seul niveau sans évaluation",
          "Les corrigés de l'examen certifiant sont donnés avant de commencer"
        ],
        "answer": 1,
        "explanation": "Le diagnostic CERTEL est gratuit ; le parcours compte 3 niveaux de 6 modules avec leçons audio, exercices auto-corrigés à vérification immédiate et évaluation chronométrée. Les corrigés de l'examen sont fournis à la fin, et la réussite délivre un certificat PDF au format paysage. L'inscription est payante (Mobile Money ou carte), gratuite tant qu'aucun prix n'est défini."
      }
    ]
  },
  "TECHNICIAN": {
    "title": "Formation à la prise en main — Technicien / agent d'appui",
    "intro": "Cette formation vous rend autonome dans votre rôle de technicien / agent d'appui (clé TECHNICIAN) sur EduWeb Booking. Votre profil donne un accès en consultation étendu : vous surveillez l'état des ressources, suivez les maintenances planifiées, repérez les incidents, lisez le calendrier d'occupation et l'ensemble des réservations de tout l'établissement, et consultez les salles multimédias et la bibliothèque numérique en lecture, afin de planifier vos interventions au bon moment et sans gêner les usagers. Point important à garder en tête tout au long de la formation : la plateforme ne vous expose pas, à ce jour, d'écran pour saisir vous-même une déclaration, une prise en charge ou une clôture d'incident, ni pour créer ou modifier une fiche de maintenance. Ces enregistrements sont saisis dans l'outil par un responsable de ressource ou un administrateur, à partir de vos constats et comptes rendus de terrain. Vos écrans servent donc à diagnostiquer, repérer, préparer vos interventions, puis vérifier le retour en service. Vous ne pouvez ni créer de réservation, ni modifier la configuration des ressources, ni administrer l'établissement. Comme tout utilisateur connecté, vous avez aussi accès à CERTEL, la formation certifiante au numérique et à l'intelligence artificielle, pour monter en compétences. Enfin, pour le confort de lecture, les textes d'aide et de formation respectent une taille de police d'au moins 13 px et un lecteur audio « Écouter » accompagne les contenus narratifs. À la fin du parcours, une auto-évaluation (QCM) vous permettra de vérifier votre compréhension.",
    "modules": [
      {
        "title": "Lire l'état général des ressources depuis le Tableau de bord",
        "objective": "Vous saurez ouvrir le tableau de bord et y lire en un coup d'œil la disponibilité des ressources et les alertes d'incidents.",
        "content": [
          "Connectez-vous, puis ouvrez « Tableau de bord » dans le menu « Principal » de la barre latérale pour accéder à la vue d'ensemble de votre établissement.",
          "Repérez l'indicateur « Ressources disponibles » : il affiche un rapport « disponibles / total » et, en mention complémentaire, le nombre de ressources « en maintenance ».",
          "Surveillez l'encart d'alerte « X incident(s) ouvert(s) », accompagné du message « Des ressources nécessitent une intervention. » — situé dans la colonne latérale, il n'apparaît que lorsqu'au moins un incident est ouvert ou en cours.",
          "Consultez le « Planning du jour » pour connaître les créneaux déjà occupés et anticiper le meilleur moment pour intervenir.",
          "Sur smartphone ou tablette, retrouvez ces mêmes écrans via la barre d'onglets en bas, le bouton flottant et le menu latéral de l'application mobile."
        ]
      },
      {
        "title": "Diagnostiquer une ressource et lire sa fiche",
        "objective": "Vous saurez ouvrir la fiche d'une ressource et interpréter son état pour préparer une intervention.",
        "content": [
          "Ouvrez « Ressources » dans le menu « Gestion ».",
          "Affinez la recherche avec la barre « Rechercher par nom, code ou lieu… » et les filtres de catégorie, de statut et, si plusieurs sites existent, de site.",
          "Cliquez sur une ressource pour ouvrir sa fiche détaillée.",
          "Lisez l'encart de disponibilité : « Occupée actuellement » (avec l'heure « Libre à partir de »), « Disponible maintenant », ou « Non réservable » lorsque la ressource est hors service ou en maintenance.",
          "Vérifiez la section « Caractéristiques » (capacité, localisation, responsable, mode de réservation) et la liste « Équipements » afin de préparer le matériel et l'accès nécessaires à votre intervention."
        ]
      },
      {
        "title": "Suivre les maintenances et traiter les incidents",
        "objective": "Vous saurez repérer les maintenances planifiées et les incidents, et transmettre vos comptes rendus pour leur enregistrement.",
        "content": [
          "Sur la fiche d'une ressource, repérez l'encart « Maintenance planifiée » : il liste l'intitulé et la période de chaque opération en cours ou à venir ; une ressource concernée s'affiche « Non réservable ».",
          "Réalisez votre intervention technique sur le terrain durant le créneau réservé, puis vérifiez sur la fiche que l'état est bien repassé à « Disponible maintenant ».",
          "Depuis le « Tableau de bord », surveillez l'encart « X incident(s) ouvert(s) », puis croisez l'alerte avec la liste « Ressources » et le filtre de statut pour identifier les ressources « Non réservable ».",
          "Intervenez sur le terrain pour diagnostiquer et résoudre l'incident, puis transmettez votre constat au responsable de la ressource ou à l'administrateur, qui consigne la déclaration et la clôture dans l'outil.",
          "Retenez que la création, la mise à jour de statut ou la clôture des maintenances et incidents ne se saisissent pas depuis votre rôle : vérifiez seulement, après résolution, que le compteur d'incidents a diminué et que la ressource est de nouveau « Disponible maintenant »."
        ]
      },
      {
        "title": "Situer une intervention avec le calendrier, les réservations et les salles multimédias",
        "objective": "Vous saurez repérer un créneau libre et vérifier la disponibilité des postes pour intervenir sans gêner les usagers.",
        "content": [
          "Ouvrez « Calendrier » dans le menu « Principal » pour consulter la vue d'ensemble des réservations de l'établissement et repérer un créneau libre sur la ressource visée.",
          "Pour une vue en liste, ouvrez « Réservations » dans le menu « Gestion » : la page « Toutes les réservations » recense l'ensemble des réservations, avec recherche par code, motif ou ressource et filtre par statut.",
          "Sur la fiche d'une ressource, parcourez la section « Prochaines réservations » pour anticiper précisément sa disponibilité avant l'intervention.",
          "Ouvrez « Salles multimédias » dans le menu « Principal » : la page « plan des postes » présente chaque salle avec son plan, le compteur « libre(s) / occupé(s) » et les postes libres (verts) ou occupés (rouges).",
          "Survolez un poste occupé pour connaître sa période d'occupation, donc le moment où il redevient disponible, et planifiez votre intervention en dehors de ses créneaux d'usage."
        ]
      },
      {
        "title": "Monter en compétences avec CERTEL (numérique et IA)",
        "objective": "Vous saurez accéder à CERTEL, en parcourir les niveaux interactifs et comprendre le diagnostic, l'évaluation certifiante, le certificat et les modalités d'inscription.",
        "content": [
          "CERTEL est la formation certifiante au numérique et à l'intelligence artificielle, ouverte à tout utilisateur connecté. Depuis votre tableau de bord, ouvrez « Formation CERTEL » dans le menu « Principal » ; sans être connecté, vous y accédez aussi par l'entrée « CERTEL » du menu public.",
          "Commencez par le diagnostic CERTEL, GRATUIT : il positionne automatiquement votre résultat sur l'un des trois niveaux (N1, N2, N3) pour orienter votre parcours.",
          "Suivez les trois niveaux interactifs, chacun composé de six modules : leçons avec lecture audio, exercices auto-corrigés à VÉRIFICATION IMMÉDIATE, puis une évaluation CHRONOMÉTRÉE ; l'évaluation certifiante n'affiche les corrigés de l'examen qu'À LA FIN.",
          "À la réussite, obtenez votre CERTIFICAT au format PDF paysage, justificatif de vos compétences.",
          "L'inscription est PAYANTE par Mobile Money (Wave, Orange Money, MTN, Moov) ou carte bancaire ; elle reste GRATUITE tant qu'aucun prix n'a été défini. Le super administrateur dispose d'un accès complet sans paiement et règle les tarifs et les évaluations dans le menu « Plateforme ».",
          "Pour une pause active, ouvrez « Sport cérébral » dans le menu « Principal » et relevez le « Défi du jour » ou lancez une partie avec « Jouer »."
        ]
      },
      {
        "title": "Gérer son compte et trouver de l'aide",
        "objective": "Vous saurez changer votre mot de passe, retrouver votre guide et utiliser les espaces d'aide et de support.",
        "content": [
          "Ouvrez « Mon compte » dans le menu « Principal » pour voir vos informations, puis, dans l'encart « Changer mon mot de passe », saisissez votre « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation, avant de cliquer sur « Mettre à jour le mot de passe ».",
          "Si la déconnexion automatique après inactivité est activée, cliquez sur « Rester connecté » lorsque l'avertissement apparaît pour prolonger votre session.",
          "Ouvrez « Centre d'aide » dans le menu « Aide » pour retrouver ce guide, puis cliquez sur « Mon guide (PDF) » ou « Mon guide (Word) » pour l'obtenir en version imprimable ou modifiable.",
          "Ouvrez « Support » pour retrouver l'e-mail support@eduweb.ci, le téléphone et les « Questions fréquentes ».",
          "Pour le confort de lecture, les écrans d'aide et de formation respectent une taille de police d'au moins 13 px ; sur les contenus narratifs, utilisez le bouton « Écouter » pour en obtenir la lecture audio."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Où lisez-vous, en un coup d'œil, le rapport « disponibles / total » et le nombre de ressources « en maintenance » ?",
        "options": [
          "Sur la fiche détaillée de chaque ressource, une par une",
          "Sur l'indicateur « Ressources disponibles » du Tableau de bord",
          "Dans le menu « Salles multimédias »",
          "Dans le « Centre d'aide »"
        ],
        "answer": 1,
        "explanation": "L'indicateur « Ressources disponibles » du Tableau de bord affiche le rapport « disponibles / total » et, en mention complémentaire, le nombre de ressources « en maintenance »."
      },
      {
        "question": "Quand l'encart d'alerte « X incident(s) ouvert(s) » apparaît-il sur le Tableau de bord ?",
        "options": [
          "En permanence, même sans incident",
          "Uniquement lorsqu'au moins un incident est ouvert ou en cours",
          "Seulement le matin, au moment du Planning du jour",
          "Uniquement si vous l'activez dans Mon compte"
        ],
        "answer": 1,
        "explanation": "L'encart « X incident(s) ouvert(s) », avec le message « Des ressources nécessitent une intervention. », n'apparaît que lorsqu'au moins un incident est ouvert ou en cours ; sinon il reste masqué."
      },
      {
        "question": "Sur la fiche d'une ressource en maintenance ou hors service, quel état s'affiche ?",
        "options": [
          "« Disponible maintenant »",
          "« Occupée actuellement »",
          "« Non réservable »",
          "« Libre à partir de »"
        ],
        "answer": 2,
        "explanation": "Une ressource hors service ou en maintenance s'affiche « Non réservable » et n'est plus proposée aux usagers sur la période concernée."
      },
      {
        "question": "En tant que technicien, comment l'incident est-il officiellement déclaré puis clôturé dans l'outil ?",
        "options": [
          "Vous le saisissez vous-même depuis un écran « Incidents » dédié à votre rôle",
          "Vous transmettez votre constat au responsable de la ressource ou à l'administrateur, qui le consigne",
          "Il se clôt automatiquement dès que vous ouvrez la fiche de la ressource",
          "Vous le déclarez depuis la page « Réservations »"
        ],
        "answer": 1,
        "explanation": "La plateforme n'ouvre pas, pour votre rôle, d'écran de déclaration ou de clôture d'incident : vous transmettez votre compte rendu au responsable de la ressource ou à l'administrateur, qui consigne la déclaration et la clôture."
      },
      {
        "question": "Pour repérer un créneau libre sur une ressource avant d'intervenir, quel écran ouvrez-vous d'abord ?",
        "options": [
          "« Bibliothèque » dans le menu « Bibliothèque »",
          "« Calendrier » dans le menu « Principal »",
          "« Mon compte » dans le menu « Principal »",
          "« Support » dans le menu « Aide »"
        ],
        "answer": 1,
        "explanation": "Le « Calendrier » (menu « Principal ») donne la vue d'ensemble des réservations de l'établissement, ce qui permet de repérer un créneau libre pour intervenir sans perturber les usagers."
      },
      {
        "question": "Sur la page « Salles multimédias — plan des postes », que signifie un poste affiché en rouge ?",
        "options": [
          "Le poste est libre et disponible immédiatement",
          "Le poste est en panne et nécessite une intervention urgente",
          "Le poste est occupé",
          "Le poste est réservé à un autre site"
        ],
        "answer": 2,
        "explanation": "Sur le plan des postes, les postes libres apparaissent en vert et les postes occupés en rouge ; survoler un poste rouge indique sa période d'occupation, donc quand il redeviendra disponible."
      },
      {
        "question": "Où ouvrez-vous CERTEL, la formation certifiante au numérique et à l'IA, depuis votre tableau de bord ?",
        "options": [
          "Dans le menu « Gestion », via « Ressources »",
          "Dans le menu « Principal », via « Formation CERTEL »",
          "Dans le menu « Aide », via « Support »",
          "Uniquement depuis la fiche d'une ressource"
        ],
        "answer": 1,
        "explanation": "CERTEL est accessible à tout utilisateur connecté : depuis le tableau de bord, ouvrez « Formation CERTEL » dans le menu « Principal » ; le menu public « CERTEL » y mène également."
      },
      {
        "question": "Concernant CERTEL, quelle affirmation est exacte ?",
        "options": [
          "Le diagnostic est gratuit et l'évaluation certifiante n'affiche les corrigés qu'à la fin",
          "L'inscription est toujours gratuite, sans aucun paiement possible",
          "Les exercices ne sont corrigés qu'après plusieurs jours",
          "Le certificat est délivré au format portrait en image"
        ],
        "answer": 0,
        "explanation": "Le diagnostic CERTEL est gratuit ; les exercices des modules sont auto-corrigés à vérification immédiate, mais l'évaluation certifiante, chronométrée, n'affiche les corrigés de l'examen qu'à la fin. L'inscription peut être payante (Mobile Money ou carte) et reste gratuite tant qu'aucun prix n'est défini ; le certificat est un PDF paysage."
      }
    ]
  },
  "VISITOR": {
    "title": "Formation à la prise en main - Visiteur externe",
    "intro": "Bienvenue dans la formation de prise en main du rôle « Visiteur externe » d'EduWeb Booking. En tant que visiteur, vous découvrez la plateforme sans compte complet : vous pouvez explorer l'offre publique de votre établissement, vous exercer librement sur l'espace « Sport cérébral », rejoindre une compétition à l'aide d'un code de session, découvrir l'offre de formation certifiante CERTEL et tester gratuitement votre niveau, et savoir comment demander un compte pour accéder aux ressources, aux réservations et à la bibliothèque. À l'issue de ce parcours, vous serez autonome sur toutes les actions ouvertes à votre rôle. Une auto-évaluation (QCM) vous permettra ensuite de vérifier votre compréhension.",
    "modules": [
      {
        "title": "Découvrir la plateforme depuis le site public",
        "objective": "Vous saurez naviguer sur le site public d'EduWeb Booking et identifier ce qui est accessible sans compte.",
        "content": [
          "Ouvrez la page d'accueil publique d'EduWeb Booking pour découvrir la présentation de la plateforme et de ses services.",
          "Parcourez les rubriques publiques (présentation, fonctionnalités, contact) pour comprendre ce que la plateforme propose à votre établissement.",
          "Repérez que certaines fonctions (ressources, réservations, bibliothèque) ne sont pas accessibles sans compte : elles nécessitent une connexion.",
          "Retenez que, sans compte, plusieurs espaces vous restent ouverts : la découverte publique, l'espace « Sport cérébral » et la présentation de la formation certifiante « CERTEL »."
        ]
      },
      {
        "title": "S'exercer sur l'espace « Sport cérébral »",
        "objective": "Vous saurez choisir un jeu, régler son niveau, lire la consigne et jouer directement dans votre navigateur.",
        "content": [
          "Ouvrez l'espace « Sport cérébral » : il est public et accessible sans connexion.",
          "Choisissez un jeu parmi ceux qui vous sont proposés, puis sélectionnez un niveau parmi « Débutant », « Intermédiaire » ou « Avancé ».",
          "Lisez la consigne affichée à l'écran ; cliquez sur « Écouter » pour l'entendre en audio, puis jouez directement dans votre navigateur.",
          "Relevez le « Défi du jour », toujours jouable, pour vous mesurer à l'exercice quotidien.",
          "Sachez que, selon la configuration de la plateforme, l'accès à certains jeux et à tous les niveaux peut être réservé aux établissements abonnés ; les jeux ouverts aux visiteurs et le « Défi du jour » restent toujours accessibles."
        ]
      },
      {
        "title": "Rejoindre une compétition avec un code de session",
        "objective": "Vous saurez rejoindre une compétition organisée à partir d'un code et jouer pour contribuer au classement.",
        "content": [
          "Munissez-vous du code de session (ou du lien) communiqué par l'organisateur de la compétition.",
          "Sur l'accueil du « Sport cérébral », repérez l'encadré « Compétition ».",
          "Saisissez le code dans le champ « CODE » (il se met automatiquement en majuscules), puis cliquez sur « Rejoindre » ; vous pouvez aussi ouvrir directement le lien reçu.",
          "Sur la page de la compétition, indiquez votre nom ou pseudo (si vous n'êtes pas connecté), puis cliquez sur « Rejoindre la compétition ».",
          "Jouez la partie sur votre appareil : votre meilleur score est automatiquement retenu et pris en compte dans le classement suivi en direct par l'organisateur ; rejouez pour l'améliorer."
        ]
      },
      {
        "title": "Découvrir CERTEL et tester gratuitement votre niveau",
        "objective": "Vous saurez ce qu'est la formation certifiante CERTEL, où la trouver, et comment évaluer gratuitement votre niveau avant de vous inscrire.",
        "content": [
          "CERTEL est une formation certifiante au numérique et à l'intelligence artificielle. Depuis le site public, ouvrez le menu « CERTEL » pour découvrir son programme : trois niveaux progressifs, chacun composé de six modules.",
          "Lancez le diagnostic de niveau, entièrement GRATUIT : répondez aux questions, et la plateforme vous oriente automatiquement vers le niveau qui vous convient (N1, N2 ou N3).",
          "Chaque niveau est interactif : leçons illustrées avec LECTURE AUDIO (bouton « Écouter »), exercices auto-corrigés à VÉRIFICATION IMMÉDIATE, et une évaluation CHRONOMÉTRÉE ; l'examen certifiant ne révèle les corrigés qu'À LA FIN. La réussite donne droit à un CERTIFICAT au format PDF paysage.",
          "Pour suivre réellement la formation et passer la certification, il faut être CONNECTÉ : vous y accédez alors depuis votre tableau de bord, section « Principal » → « Formation CERTEL ». En tant que visiteur, demandez d'abord un compte (voir le module suivant).",
          "L'inscription à CERTEL est PAYANTE par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte bancaire ; tant qu'aucun prix n'est défini, l'accès reste gratuit. Le diagnostic de niveau, lui, est toujours gratuit."
        ]
      },
      {
        "title": "Demander un compte complet",
        "objective": "Vous saurez comment obtenir un compte donnant accès aux ressources, aux réservations, à la bibliothèque et à la formation CERTEL.",
        "content": [
          "Pour réserver des ressources, consulter la bibliothèque, déposer des documents ou suivre la formation CERTEL, demandez la création d'un compte auprès de l'administrateur de votre établissement.",
          "Une fois votre compte créé, vous recevez vos identifiants et un mot de passe initial à changer dès la première connexion.",
          "Connectez-vous : votre menu s'enrichit alors des fonctions correspondant au rôle qui vous a été attribué, dont l'accès à « Formation CERTEL » dans la section « Principal ».",
          "Retenez que c'est l'administrateur de l'établissement (et non vous) qui crée le compte et attribue le rôle."
        ]
      },
      {
        "title": "Accessibilité et confort de lecture",
        "objective": "Vous saurez profiter des aides à la lecture proposées sur les formations et les guides.",
        "content": [
          "Les textes des formations et des guides sont affichés dans une police d'au moins 13 px, pour un confort de lecture sur ordinateur comme sur mobile.",
          "Sur les contenus narratifs des formations et des guides, un lecteur audio « Écouter » vous permet d'entendre le texte au lieu de le lire.",
          "Utilisez ce bouton « Écouter » aussi bien sur les consignes du « Sport cérébral » que sur les leçons CERTEL : c'est la même aide à l'écoute, disponible partout où un narratif est proposé."
        ]
      }
    ],
    "quiz": [
      {
        "question": "En tant que visiteur externe, à quels espaces pouvez-vous accéder sans aucune connexion ?",
        "options": [
          "À la bibliothèque numérique et aux réservations de salles",
          "À la découverte publique, à l'espace « Sport cérébral » et à la présentation de CERTEL (dont le diagnostic gratuit)",
          "À tout le tableau de bord, comme un agent",
          "À rien : tout exige un compte"
        ],
        "answer": 1,
        "explanation": "Sans compte, le visiteur peut découvrir l'offre publique, accéder à l'espace « Sport cérébral » et au menu public « CERTEL » avec son diagnostic gratuit. Les ressources, les réservations, la bibliothèque et le suivi de la formation CERTEL nécessitent un compte."
      },
      {
        "question": "Comment écoutez-vous la consigne d'un jeu du « Sport cérébral » en audio ?",
        "options": [
          "En cliquant sur « Écouter »",
          "En activant un micro dans les paramètres du jeu",
          "En téléchargeant un fichier audio externe",
          "En appelant l'administrateur"
        ],
        "answer": 0,
        "explanation": "Chaque jeu affiche sa consigne à l'écran ; un bouton « Écouter » permet de l'entendre en audio avant de jouer. Ce même lecteur audio est aussi disponible sur les narratifs des formations et des guides."
      },
      {
        "question": "Combien de niveaux de difficulté sont proposés pour chaque jeu, et lesquels ?",
        "options": [
          "Deux niveaux : Facile et Difficile",
          "Quatre niveaux : Initiation, Standard, Expert, Maître",
          "Trois niveaux : Débutant, Intermédiaire et Avancé",
          "Un seul niveau, identique pour tous"
        ],
        "answer": 2,
        "explanation": "Chaque jeu se joue à trois niveaux : « Débutant », « Intermédiaire » et « Avancé », que vous choisissez avant de commencer."
      },
      {
        "question": "Pour rejoindre une compétition organisée, que devez-vous faire dans l'encadré « Compétition » ?",
        "options": [
          "Demander un compte complet à l'administrateur",
          "Saisir le code de session dans le champ « CODE », puis cliquer sur « Rejoindre »",
          "Créer vous-même la compétition",
          "Envoyer votre score par e-mail à l'organisateur"
        ],
        "answer": 1,
        "explanation": "Il faut saisir le code de session communiqué par l'organisateur dans le champ « CODE » de l'encadré « Compétition », puis cliquer sur « Rejoindre » (ou ouvrir directement le lien reçu)."
      },
      {
        "question": "Une fois la compétition rejointe, comment votre score est-il pris en compte ?",
        "options": [
          "Vous devez le saisir manuellement à la fin de la partie",
          "Il n'est pas pris en compte pour les visiteurs",
          "L'organisateur le calcule à partir d'une capture d'écran",
          "Votre meilleur score est automatiquement intégré au classement suivi par l'organisateur"
        ],
        "answer": 3,
        "explanation": "Vous jouez la partie sur votre appareil ; votre meilleur score est automatiquement retenu et intégré au classement que l'organisateur suit en direct."
      },
      {
        "question": "Concernant la formation CERTEL, qu'est-ce qui est GRATUIT pour un visiteur, et qu'est-ce qui exige une inscription ?",
        "options": [
          "Le diagnostic de niveau est gratuit ; suivre la formation et passer la certification demandent une inscription (payante par Mobile Money ou carte, sauf si aucun prix n'est défini)",
          "Tout est entièrement gratuit, y compris le certificat",
          "Tout est payant, même le diagnostic de niveau",
          "Seul le certificat PDF est payant, le reste est libre"
        ],
        "answer": 0,
        "explanation": "Le diagnostic de niveau CERTEL est toujours gratuit. Pour suivre la formation et obtenir la certification, il faut un compte et une inscription, payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte ; l'accès reste gratuit tant qu'aucun prix n'est défini."
      },
      {
        "question": "Comment se déroule l'examen certifiant de CERTEL pour ce qui est des corrigés ?",
        "options": [
          "Les corrigés s'affichent après chaque question",
          "Il n'y a jamais de corrigés",
          "L'examen est chronométré et les corrigés ne sont révélés qu'à la fin",
          "Les corrigés sont envoyés par e-mail une semaine plus tard"
        ],
        "answer": 2,
        "explanation": "À la différence des exercices d'entraînement (à vérification immédiate), l'évaluation certifiante est chronométrée et ne révèle les corrigés qu'à la fin de l'examen ; la réussite donne droit à un certificat PDF paysage."
      },
      {
        "question": "Pour réserver des ressources, consulter la bibliothèque, déposer des documents ou suivre la formation CERTEL, que devez-vous faire en tant que visiteur ?",
        "options": [
          "Activer ces fonctions depuis l'espace « Sport cérébral »",
          "Payer un abonnement directement en ligne",
          "Demander la création d'un compte auprès de l'administrateur de votre établissement",
          "Saisir un code de session de compétition"
        ],
        "answer": 2,
        "explanation": "Ces fonctions exigent un compte : il faut en demander la création à l'administrateur de votre établissement, qui crée le compte et attribue le rôle. La formation CERTEL devient alors accessible depuis « Principal » → « Formation CERTEL »."
      },
      {
        "question": "Après la création de votre compte, que devez-vous faire dès la première connexion ?",
        "options": [
          "Changer le mot de passe initial qui vous a été remis",
          "Recréer un nouveau compte vous-même",
          "Choisir votre propre rôle dans les paramètres",
          "Supprimer votre ancien profil de visiteur"
        ],
        "answer": 0,
        "explanation": "Vous recevez vos identifiants et un mot de passe initial qu'il faut changer dès la première connexion ; votre menu s'enrichit alors des fonctions liées au rôle attribué."
      }
    ]
  },
  "LIBRARIAN": {
    "title": "Formation à la prise en main — Bibliothécaire / Documentaliste",
    "intro": "Cette formation vous rend autonome dans la chaîne de traitement documentaire d'EduWeb Booking, pour le rôle « Bibliothécaire / Documentaliste » (clé LIBRARIAN), dans le périmètre de votre seul établissement. Vous apprendrez à contrôler et valider les dépôts en attente, à codifier et publier les documents au catalogue, à organiser le fonds (collections et domaines), à traiter les réservations et à suivre les emprunts physiques, et enfin à piloter l'activité par les statistiques. L'essentiel de votre travail se trouve dans la section « Bibliothèque » de votre tableau de bord ; la section « Principal » vous donne aussi accès au « Calendrier » (en consultation), au « Sport cérébral », à « Formation CERTEL » (la formation certifiante au numérique et à l'intelligence artificielle, ouverte à tout utilisateur connecté) et à « Mon compte ». Vous ne disposez pas des menus de réservation de salles (« Salles multimédias », « Mes réservations »), ni des sections « Administration » et « Plateforme » : ces espaces ne font pas partie du périmètre du bibliothécaire. Par souci d'accessibilité, les textes narratifs des formations et des guides s'affichent dans une police d'au moins 13 px et sont accompagnés d'un lecteur audio « Écouter ». Chaque étape ci-dessous cite les libellés exacts de l'application. Terminez par l'auto-évaluation pour vérifier votre compréhension.",
    "modules": [
      {
        "title": "Module 1 — Repérer votre espace et vos menus",
        "objective": "Vous saurez naviguer dans votre tableau de bord et lire la vue d'ensemble du fonds.",
        "content": [
          "Connectez-vous, puis repérez dans la barre latérale la section « Principal » (Accueil, Tableau de bord, Calendrier, Sport cérébral, Formation CERTEL, Mon compte) et surtout la section « Bibliothèque », qui regroupe l'essentiel de votre travail.",
          "Dans « Bibliothèque », identifiez les dix entrées : « Bibliothèque », « Explorer », « Déposer », « Documents », « À vérifier », « Réservations doc. », « Emprunts », « Statistiques doc. », « Collections » et « Domaines ».",
          "Ouvrez « Bibliothèque » pour la page « Bibliothèque numérique » : lisez les indicateurs clés (« Documents », « En attente de validation », « Consultations », « Téléchargements »), les « Dépôts mensuels », les répartitions par type et par domaine et les « Derniers dépôts ».",
          "Repérez sur cette page l'encadré « dépôt(s) à vérifier » et les « Alertes » (documents sans fichier, métadonnées incomplètes, doublons) qui signalent ce qui demande votre attention.",
          "Notez que les menus « Salles multimédias » et « Mes réservations », ainsi que les sections « Administration » et « Plateforme », n'apparaissent pas dans votre barre latérale : ils ne font pas partie du périmètre du bibliothécaire."
        ]
      },
      {
        "title": "Module 2 — Contrôler et valider les dépôts en attente",
        "objective": "Vous saurez examiner un dépôt et le valider, demander une correction ou le rejeter.",
        "content": [
          "Dans la section « Bibliothèque », cliquez sur « À vérifier » (le compteur indique le nombre de dépôts en attente) : la page « Validation documentaire » liste les dépôts à traiter.",
          "Cliquez sur le titre d'un dépôt pour ouvrir sa fiche, puis contrôlez le type, les métadonnées (auteur principal, co-auteurs, directeur, année, langue, niveau, pages, domaine, collection), le « Résumé », les « Mots-clés » et le fichier joint.",
          "Examinez l'encadré « Doublons potentiels » lorsqu'il apparaît : il indique le titre similaire, le motif et un score de similarité, pour éviter les redondances.",
          "Pour accepter, cliquez sur « Valider le document », ajoutez un « Commentaire (facultatif) », cochez au besoin « Publier directement », puis « Valider » : un code documentaire définitif est alors généré en remplacement du code provisoire.",
          "Pour renvoyer le dépôt à son auteur, cliquez sur « Corriger », renseignez les « Précisions » attendues (champ obligatoire), puis « Demander correction » ; pour l'écarter, cliquez sur « Rejeter », saisissez le « Motif du rejet » (obligatoire), puis « Confirmer le rejet ».",
          "Retenez que chaque décision (validation, correction, rejet) notifie automatiquement le déposant ; vous pouvez aussi valider directement depuis les boutons sous chaque dépôt de la liste « À vérifier »."
        ]
      },
      {
        "title": "Module 3 — Publier, archiver et suivre le cycle de vie d'un document",
        "objective": "Vous saurez publier ou archiver un document et lire son historique de traitement.",
        "content": [
          "Ouvrez la fiche d'un document validé depuis « Documents » (recherche par titre, code ou auteur, filtres par statut et par type) ou depuis « À vérifier ».",
          "Dans l'encadré « Validation documentaire » de la fiche, cliquez sur « Publier » pour rendre le document visible dans le catalogue.",
          "Cliquez sur « Archiver » pour retirer du catalogue un document qui ne doit plus être proposé.",
          "Consultez l'encadré « Code & QR » pour le code et le QR du document ainsi que ses compteurs de consultations et de téléchargements.",
          "Vérifiez le bloc de suivi en bas de fiche : « Déposé par », « Validé par », « Validé le », « Publié le » (et le motif en cas de rejet), ainsi que l'« Historique & avis » qui retrace les décisions successives."
        ]
      },
      {
        "title": "Module 4 — Organiser le fonds et paramétrer l'accès payant",
        "objective": "Vous saurez gérer les collections et les domaines et fixer le prix de téléchargement d'un document.",
        "content": [
          "Ouvrez « Collections » : dans l'encadré « Nouvelle collection », renseignez le nom et le code (par exemple « Thèses » / « THS ») puis enregistrez ; le code est automatiquement mis en majuscules.",
          "Sur chaque ligne, basculez l'état « Active » / « Inactive » ou modifiez le nom et le code ; le compteur indique le nombre de documents rattachés.",
          "Ouvrez « Domaines » pour classer les ressources par disciplines : dans « Nouveau domaine », saisissez nom et code (par exemple « Robotique » / « ROB »), puis activez ou désactivez selon les besoins.",
          "Retenez que seules les collections et les domaines actifs sont proposés au moment d'un dépôt.",
          "Pour l'accès payant, ouvrez la fiche d'un document, repérez l'encadré « Accès au document », saisissez le montant dans « Prix de téléchargement (FCFA · 0 = gratuit) » puis cliquez sur « Définir » ; le paiement présenté aux usagers (« Payer et débloquer ») est simulé pour la démonstration."
        ]
      },
      {
        "title": "Module 5 — Réservations, emprunts physiques et pilotage",
        "objective": "Vous saurez approuver les réservations, clôturer les emprunts et suivre l'activité documentaire.",
        "content": [
          "Ouvrez « Réservations doc. » : la page liste les demandes (consultation sur place, emprunt physique, demande d'accès) avec le document, le demandeur, le type et le statut.",
          "Sur une demande « En attente », cliquez sur le bouton vert pour l'approuver ou sur le bouton de refus (croix) pour la rejeter ; le demandeur est notifié ; une demande d'emprunt approuvée crée automatiquement un prêt avec échéance de retour à 14 jours et décrémente la disponibilité physique de l'exemplaire.",
          "Ouvrez « Emprunts » : la page présente les exemplaires physiques sortis avec l'emprunteur et la date de « Retour prévu » ; le statut « En retard » s'affiche quand la date de retour prévu est dépassée.",
          "À la restitution, cliquez sur « Marquer rendu » : la disponibilité physique du document est recréditée et la date de retour enregistrée.",
          "Pour piloter, ouvrez « Statistiques doc. » et suivez les indicateurs (« Documents », « Publiés », « En attente », « Réservations », « Consultations », « Téléchargements », « Emprunts en cours », « Domaines couverts ») ainsi que les répartitions et les « Documents les plus consultés ».",
          "Pour gérer votre compte, ouvrez « Mon compte » puis « Changer mon mot de passe » : saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation, puis cliquez sur « Mettre à jour le mot de passe »."
        ]
      },
      {
        "title": "Module 6 — Vous former et vous certifier avec CERTEL",
        "objective": "Vous saurez accéder à la formation certifiante CERTEL, évaluer votre niveau et suivre les parcours interactifs jusqu'au certificat.",
        "content": [
          "CERTEL est la formation certifiante au numérique et à l'intelligence artificielle, accessible à tout utilisateur connecté : depuis votre tableau de bord, ouvrez « Formation CERTEL » dans la section « Principal » ; depuis le site public, utilisez le menu « CERTEL ».",
          "Commencez par le « Diagnostic de niveau », gratuit : il vous situe sur l'un des trois niveaux interactifs et vous oriente vers le parcours adapté.",
          "Chaque niveau comporte six modules : des leçons illustrées avec « Lecture audio » (bouton « Écouter »), des exercices auto-corrigés à vérification immédiate et une évaluation chronométrée.",
          "Passez l'évaluation certifiante quand vous êtes prêt : c'est un examen dont les corrigés ne sont révélés qu'à la fin, et la réussite donne droit à un certificat PDF au format paysage.",
          "L'inscription peut être payante (Mobile Money — Wave, Orange Money, MTN, Moov — ou carte) ; tant qu'aucun prix n'est défini, l'accès reste gratuit. Le super administrateur dispose d'un accès complet sans paiement et règle les tarifs et les évaluations dans la section « Plateforme » ; ces réglages tarifaires ne relèvent pas du rôle de bibliothécaire."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Que se passe-t-il pour le code documentaire lorsque vous validez un dépôt depuis « À vérifier » ?",
        "options": [
          "Le code provisoire reste inchangé jusqu'à la publication",
          "Un code documentaire définitif est généré en remplacement du code provisoire",
          "Aucun code n'est attribué tant que l'administrateur n'intervient pas",
          "Le déposant doit lui-même saisir le code définitif"
        ],
        "answer": 1,
        "explanation": "Au moment de la validation (« Valider le document » puis « Valider »), un code documentaire définitif est généré et remplace le code provisoire attribué lors du dépôt."
      },
      {
        "question": "Pour renvoyer un dépôt à son auteur afin qu'il le corrige, quelle action effectuez-vous ?",
        "options": [
          "Vous cliquez sur « Rejeter » et saisissez le motif du rejet",
          "Vous archivez le document depuis sa fiche",
          "Vous cliquez sur « Corriger », renseignez les « Précisions » (obligatoires) puis « Demander correction »",
          "Vous publiez directement le document avec un commentaire"
        ],
        "answer": 2,
        "explanation": "« Corriger » ouvre le champ « Précisions » (obligatoire) ; après « Demander correction », le dépôt repart vers l'auteur et celui-ci est notifié automatiquement."
      },
      {
        "question": "Que provoque l'approbation d'une demande d'emprunt physique dans « Réservations doc. » ?",
        "options": [
          "Elle crée un prêt avec une échéance de retour à 14 jours et décrémente la disponibilité physique",
          "Elle archive immédiatement le document du catalogue",
          "Elle fixe automatiquement le prix de téléchargement à 0 FCFA",
          "Elle génère un nouveau code documentaire définitif"
        ],
        "answer": 0,
        "explanation": "Une demande d'emprunt approuvée crée automatiquement un prêt avec une échéance de retour fixée à 14 jours et décrémente la disponibilité physique de l'exemplaire."
      },
      {
        "question": "Comment rendre un document validé visible dans le catalogue ?",
        "options": [
          "En cliquant sur « Archiver » dans sa fiche",
          "En définissant un prix de téléchargement supérieur à 0",
          "En cliquant sur « Publier » dans l'encadré « Validation documentaire » de la fiche",
          "En l'ajoutant à une collection active"
        ],
        "answer": 2,
        "explanation": "Depuis l'encadré « Validation documentaire » de la fiche, le bouton « Publier » rend le document visible dans le catalogue ; « Archiver » fait l'inverse (le retire du catalogue)."
      },
      {
        "question": "Lors de la création d'une collection ou d'un domaine, qu'est-ce qui conditionne sa proposition au moment d'un dépôt ?",
        "options": [
          "La collection ou le domaine doit avoir au moins un document rattaché",
          "Seuls les collections et domaines actifs sont proposés au dépôt",
          "Le code doit comporter exactement trois lettres",
          "La collection doit avoir été validée par l'administrateur"
        ],
        "answer": 1,
        "explanation": "Vous pouvez basculer l'état « Active » / « Inactive » (collections) et « Actif » / « Inactif » (domaines) ; seules les collections et domaines actifs sont proposés au moment d'un dépôt."
      },
      {
        "question": "Pour enregistrer le retour d'un exemplaire physique emprunté, où agissez-vous ?",
        "options": [
          "Dans « Statistiques doc. », via l'indicateur « Emprunts en cours »",
          "Dans « Réservations doc. », en refusant la demande",
          "Dans « Emprunts », en cliquant sur « Marquer rendu »",
          "Dans la fiche du document, via « Archiver »"
        ],
        "answer": 2,
        "explanation": "Dans la page « Emprunts », « Marquer rendu » recrédite la disponibilité physique du document et enregistre la date de retour ; le statut « En retard » y signale les retards."
      },
      {
        "question": "Où fixez-vous le prix de téléchargement d'un document et que signifie la valeur 0 ?",
        "options": [
          "Dans « Statistiques doc. » ; 0 bloque tout téléchargement",
          "Dans l'encadré « Accès au document » de la fiche, champ « Prix de téléchargement (FCFA · 0 = gratuit) » puis « Définir » ; 0 = accès libre",
          "Dans « Collections » ; 0 désactive la collection",
          "Dans « Mon compte » ; 0 réinitialise le prix par défaut"
        ],
        "answer": 1,
        "explanation": "Le prix se règle dans l'encadré « Accès au document » de la fiche, via le champ « Prix de téléchargement (FCFA · 0 = gratuit) » puis « Définir » ; 0 correspond à un accès libre (gratuit). Le paiement usager est simulé pour la démonstration."
      },
      {
        "question": "Parmi ces menus, lequel ne fait PAS partie du rôle Bibliothécaire / Documentaliste ?",
        "options": [
          "« À vérifier » dans la section « Bibliothèque »",
          "« Salles multimédias », qui n'apparaît pas dans le périmètre du bibliothécaire",
          "« Statistiques doc. » dans la section « Bibliothèque »",
          "« Formation CERTEL » dans la section « Principal »"
        ],
        "answer": 1,
        "explanation": "« Salles multimédias » et « Mes réservations », comme les sections « Administration » et « Plateforme », ne font pas partie du périmètre du bibliothécaire et n'apparaissent pas dans sa barre latérale ; en revanche « À vérifier », « Statistiques doc. » (section « Bibliothèque ») et « Formation CERTEL » (section « Principal ») lui sont bien accessibles."
      },
      {
        "question": "Comment accédez-vous à la formation certifiante CERTEL et par quoi commencer ?",
        "options": [
          "Par la section « Administration » ; elle commence par un paiement obligatoire",
          "Par « Formation CERTEL » dans la section « Principal » (ou le menu public « CERTEL »), en commençant par le diagnostic de niveau gratuit",
          "Uniquement par la section « Bibliothèque », réservée au bibliothécaire",
          "Par « Statistiques doc. », après publication d'un document"
        ],
        "answer": 1,
        "explanation": "CERTEL est ouverte à tout utilisateur connecté : ouvrez « Formation CERTEL » dans la section « Principal » du tableau de bord, ou le menu public « CERTEL ». On débute par le diagnostic de niveau, qui est gratuit et oriente vers le parcours adapté."
      },
      {
        "question": "Concernant les évaluations CERTEL et l'accès à la formation, quelle affirmation est exacte ?",
        "options": [
          "L'évaluation certifiante révèle les corrigés à la fin et la réussite donne un certificat PDF paysage ; l'accès est gratuit tant qu'aucun prix n'est défini",
          "Les corrigés s'affichent après chaque question de l'examen certifiant",
          "L'inscription est toujours payante, sans aucune exception",
          "Seul le bibliothécaire peut délivrer le certificat CERTEL"
        ],
        "answer": 0,
        "explanation": "L'évaluation certifiante ne révèle ses corrigés qu'à la fin et la réussite donne droit à un certificat PDF au format paysage. L'inscription peut être payante (Mobile Money ou carte), mais l'accès reste gratuit tant qu'aucun prix n'est défini ; le super administrateur a un accès complet sans paiement et règle tarifs et évaluations sous « Plateforme »."
      }
    ]
  },
  "DEPOSITOR": {
    "title": "Formation à la prise en main — Déposant",
    "intro": "Bienvenue dans votre parcours de formation au rôle de « Déposant » sur EduWeb Booking. En tant que déposant — enseignant, chercheur, étudiant ou personnel chargé d'alimenter la bibliothèque numérique de votre établissement — vous disposez de quatre actions documentaires : consulter le catalogue autorisé, déposer une ressource, télécharger les documents permis, et réserver ou emprunter un document. Cette formation progressive vous rendra pleinement autonome, en n'utilisant que les fonctions réellement ouvertes à votre rôle. Les fonctions de validation documentaire, de pilotage de la bibliothèque, de gestion du fonds, de réservation de salles et d'administration ne relèvent pas de votre profil : il est normal que ces menus n'apparaissent pas dans votre barre latérale. Vous accédez en revanche, comme tout utilisateur connecté, à la formation certifiante au numérique et à l'IA « CERTEL ». Chaque module cite les libellés exacts des menus et boutons de l'application. Pour le confort de lecture, les textes des formations et des guides s'affichent dans une police d'au moins 13 pixels et sont accompagnés d'un lecteur audio « Écouter ». À la fin, une auto-évaluation à correction immédiate vous permettra de vérifier vos acquis.",
    "modules": [
      {
        "title": "Module 1 — Découvrir votre espace et repérer vos menus",
        "objective": "À la fin de ce module, vous saurez vous repérer dans votre barre latérale et identifier les cinq entrées de la section « Bibliothèque ».",
        "content": [
          "Connectez-vous, puis ouvrez « Tableau de bord » dans la section « Principal » de la barre latérale ; cette section vous donne aussi accès à « Accueil », « Sport cérébral », « Formation CERTEL » et « Mon compte ».",
          "Dépliez la section « Bibliothèque » : vous y disposez de cinq entrées — « Bibliothèque », « Explorer », « Déposer », « Documents » et « Réservations doc. ».",
          "Comprenez que les menus de validation (« À vérifier », « Emprunts »), de pilotage (« Statistiques doc. »), de gestion (« Collections », « Domaines »), de réservation de salles (« Calendrier », « Salles multimédias », « Mes réservations ») et la section « Administration » n'apparaissent pas chez vous : ils relèvent d'autres rôles.",
          "Pour une vue d'ensemble du fonds, ouvrez « Bibliothèque » : la page « Bibliothèque numérique » affiche les indicateurs « Documents », « En attente de validation », « Consultations » et « Téléchargements », ainsi que la liste « Derniers dépôts ».",
          "Pour plus de confort, repérez sur les pages de formation et les guides le bouton « Écouter » qui lit le texte à voix haute, la police étant toujours d'au moins 13 pixels.",
          "Sur téléphone, retrouvez ces mêmes accès via la barre d'onglets en bas de l'écran, le bouton flottant d'action et le menu latéral coulissant."
        ]
      },
      {
        "title": "Module 2 — Déposer une ressource documentaire",
        "objective": "À la fin de ce module, vous saurez déposer un document de bout en bout grâce à l'assistant « Déposer » en sept étapes.",
        "content": [
          "Dans la section « Bibliothèque », cliquez sur « Déposer » (ou sur le bouton « Déposer » présent en haut des pages « Bibliothèque », « Explorer » et « Documents ») pour ouvrir la page « Déposer une ressource ».",
          "Étape « Type » : choisissez le type de document (Mémoire, Article scientifique, Thèse, Rapport, Support pédagogique, Guide, Manuel…), sélectionnez la « Collection » et le « Domaine » (tous deux obligatoires), puis cliquez sur « Continuer ».",
          "Étapes « Métadonnées », « Auteurs » et « Résumé » : saisissez le « Titre » (obligatoire, au moins 3 caractères) et au besoin l'année, la langue, les pages et le niveau ; renseignez l'« Auteur principal » (obligatoire), les co-auteurs et le directeur ; rédigez le « Résumé » et les « Mots-clés (séparés par des virgules) ».",
          "Étape « Fichier » : glissez-déposez ou cliquez pour sélectionner votre fichier dans « Déposer un fichier (PDF recommandé) » — formats PDF, DOC, DOCX, ODT, PPT, PPTX, EPUB acceptés ; le fichier est facultatif au dépôt et pourra être ajouté plus tard ; pour un article scientifique, complétez les champs « Revue » et « DOI » qui apparaissent à cette étape.",
          "Étape « Droits » : choisissez le « Niveau d'accès » (Public, Interne, Restreint, Consultation sur place, Emprunt papier, Confidentiel, Embargo), cochez ou non « Autoriser le téléchargement du fichier », indiquez les exemplaires physiques et le « Prix de téléchargement (FCFA) » (0 = gratuit ; le bibliothécaire et vous-même êtes exemptés du paiement).",
          "Étape « Vérification » : contrôlez le récapitulatif, puis cliquez sur « Soumettre le dépôt » ; un code provisoire est généré, le documentaliste est notifié et le message « Votre dépôt a été enregistré et soumis à validation. » confirme l'envoi."
        ]
      },
      {
        "title": "Module 3 — Suivre vos dépôts et répondre à une correction",
        "objective": "À la fin de ce module, vous saurez suivre le statut de vos dépôts, lire les avis du documentaliste et transmettre une version corrigée.",
        "content": [
          "Ouvrez « Documents » : la liste affiche pour chaque ressource son « Statut » (« Soumis », « À corriger », « Validé », « Publié », « Rejeté »…), son code et son niveau d'accès ; filtrez avec « Tous les statuts » ou « Tous les types », ou cherchez avec « Titre, code, auteur… ».",
          "Cliquez sur une ligne pour ouvrir la fiche : la rubrique « Historique & avis » détaille les décisions et commentaires du documentaliste (validation, correction demandée, rejet, ou avis scientifique).",
          "Consultez le bloc de suivi en bas de la fiche : il indique « Déposé par » et, le cas échéant, « Validé par », « Validé le » ou « Publié le » ; en cas de rejet, le « Motif » y est rappelé.",
          "Une fois le dépôt « Validé » ou « Publié », un code documentaire définitif remplace le code provisoire ; vous en êtes informé par la cloche de notifications et par e-mail.",
          "Si votre dépôt passe à « À corriger », votre rôle ne permet pas de modifier directement un dépôt déjà soumis : retournez sur « Déposer » pour déposer à nouveau la ressource corrigée, puis cliquez sur « Soumettre le dépôt ».",
          "Dans le « Résumé » ou les « Mots-clés » du nouveau dépôt, signalez qu'il s'agit d'une version corrigée afin que le documentaliste fasse le lien avec la demande initiale."
        ]
      },
      {
        "title": "Module 4 — Explorer, consulter et citer le catalogue",
        "objective": "À la fin de ce module, vous saurez rechercher un document, le lire en ligne, le télécharger et copier sa référence bibliographique.",
        "content": [
          "Ouvrez « Explorer » et recherchez avec « Titre, auteur, mot-clé, code… », ou affinez avec les filtres « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès ».",
          "Ouvrez la fiche d'un document autorisé : dans l'encadré « Accès au document », cliquez sur « Consulter » pour le lire en ligne — la lecture est en lecture seule, avec un filigrane à votre nom, l'impression et la copie étant désactivées.",
          "Pour récupérer le fichier, cliquez sur « Télécharger » lorsqu'il est en accès libre et que son téléchargement est autorisé.",
          "Si le document est en téléchargement payant, le bloc « Téléchargement payant » affiche le prix : cliquez sur « Payer et débloquer » (paiement simulé de démonstration) ; à l'ENS d'Abidjan, un étudiant peut saisir son matricule pour télécharger gratuitement.",
          "Utilisez l'encadré « Citer ce document » et le bouton « Copier » pour récupérer la référence bibliographique au format APA."
        ]
      },
      {
        "title": "Module 5 — Réserver un document, s'évaluer et gérer son compte",
        "objective": "À la fin de ce module, vous saurez réserver ou emprunter un document, suivre votre demande, et gérer votre compte et votre mot de passe.",
        "content": [
          "Sur la fiche d'un document, si un exemplaire physique est disponible, cliquez sur « Réserver / Emprunter » : choisissez le « Type de demande » (Consultation sur place ou Emprunt physique), précisez le créneau « Début (sur place) » et « Fin » et un « Motif / note », puis cliquez sur « Envoyer la demande ».",
          "Pour un document restreint ou confidentiel auquel vous n'avez pas accès, cliquez sur « Demander l'accès », ajoutez votre motif et validez : le message « Votre demande a été transmise au documentaliste. » s'affiche.",
          "Suivez l'avancement dans « Réservations doc. » : votre demande passe de « En attente » à « Approuvée » ou « Refusée », et vous êtes notifié de la décision.",
          "Dans la section « Principal », ouvrez « Sport cérébral » pour suivre scores et badges et relever le « Défi du jour » ; pour situer et renforcer votre niveau numérique, ouvrez « Formation CERTEL » (voir le module suivant).",
          "Ouvrez « Mon compte » pour vérifier vos informations, puis dans « Changer mon mot de passe » saisissez le « Mot de passe actuel », le « Nouveau mot de passe » (au moins 8 caractères) et sa confirmation avant de cliquer sur « Mettre à jour le mot de passe ».",
          "En cas de difficulté, ouvrez « Support » ou « Centre d'aide » dans la section « Aide » ; le « Centre d'aide » affiche ce guide et permet de le télécharger en PDF ou en Word."
        ]
      },
      {
        "title": "Module 6 — Se former et se certifier avec CERTEL",
        "objective": "À la fin de ce module, vous saurez situer votre niveau, suivre les formations CERTEL et obtenir votre certificat, en connaissant les conditions d'accès et de paiement.",
        "content": [
          "CERTEL est la formation certifiante au numérique et à l'intelligence artificielle, ouverte à tout utilisateur connecté : depuis le tableau de bord, ouvrez « Formation CERTEL » dans la section « Principal » ; sinon, utilisez l'entrée « CERTEL » du menu public.",
          "Commencez par le diagnostic de niveau, gratuit : il situe votre profil sur l'un des trois niveaux, chacun étant un parcours interactif de six modules.",
          "Dans chaque module, suivez les leçons illustrées avec « lecture audio », puis entraînez-vous sur les exercices auto-corrigés à vérification immédiate qui vous indiquent aussitôt si votre réponse est juste.",
          "Terminez un niveau par son évaluation : l'entraînement est chronométré, et l'examen certifiant ne révèle les corrigés qu'à la fin pour préserver l'équité ; en cas de réussite, vous obtenez un certificat PDF au format paysage.",
          "L'inscription est payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte ; tant qu'aucun prix n'est défini, l'accès reste gratuit. Le super administrateur dispose d'un accès complet sans paiement et règle les tarifs et les évaluations dans la section « Plateforme »."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Combien d'étapes comporte l'assistant « Déposer » pour soumettre une ressource ?",
        "options": [
          "Trois étapes",
          "Cinq étapes",
          "Sept étapes",
          "Neuf étapes"
        ],
        "answer": 2,
        "explanation": "L'assistant « Déposer une ressource » se déroule en sept étapes : Type, Métadonnées, Auteurs, Résumé, Fichier, Droits et Vérification."
      },
      {
        "question": "Lors de l'étape « Type », quels champs sont obligatoires en plus du type de document ?",
        "options": [
          "La « Collection » et le « Domaine »",
          "Le « Résumé » et les « Mots-clés »",
          "L'« Année » et la « Langue »",
          "Le « DOI » et la « Revue »"
        ],
        "answer": 0,
        "explanation": "À l'étape « Type », vous devez sélectionner la « Collection » et le « Domaine », tous deux obligatoires, avant de cliquer sur « Continuer »."
      },
      {
        "question": "Le fichier joint au dépôt (PDF recommandé) est-il obligatoire pour soumettre ?",
        "options": [
          "Oui, sans fichier la soumission est impossible",
          "Non, il est facultatif au dépôt et peut être ajouté plus tard",
          "Oui, mais uniquement pour les thèses",
          "Non, le fichier n'est jamais accepté à ce stade"
        ],
        "answer": 1,
        "explanation": "À l'étape « Fichier », le document est facultatif au dépôt : vous pouvez soumettre sans fichier et l'ajouter ultérieurement."
      },
      {
        "question": "Votre dépôt passe au statut « À corriger ». Comment transmettez-vous une version corrigée ?",
        "options": [
          "En modifiant directement le dépôt depuis sa fiche",
          "En écrivant au documentaliste via « Statistiques doc. »",
          "En retournant sur « Déposer » pour déposer à nouveau la ressource corrigée",
          "En cliquant sur « Valider » dans la fiche du document"
        ],
        "answer": 2,
        "explanation": "Votre rôle ne permet pas de modifier un dépôt déjà soumis : vous devez retourner sur « Déposer », déposer la version corrigée et la soumettre à nouveau, en le signalant dans le résumé ou les mots-clés."
      },
      {
        "question": "Que se passe-t-il lorsque vous cliquez sur « Consulter » dans l'encadré « Accès au document » ?",
        "options": [
          "Le fichier est téléchargé immédiatement sur votre poste",
          "Le document s'ouvre en lecture seule, avec un filigrane à votre nom et l'impression désactivée",
          "Vous devenez propriétaire du document",
          "Une demande de réservation est automatiquement envoyée"
        ],
        "answer": 1,
        "explanation": "« Consulter » ouvre une lecture en ligne en lecture seule, avec un filigrane à votre nom ; l'impression et la copie sont désactivées."
      },
      {
        "question": "Où suivez-vous l'avancement d'une demande de réservation ou d'emprunt de document ?",
        "options": [
          "Dans « Mes réservations »",
          "Dans « Réservations doc. »",
          "Dans « Emprunts »",
          "Dans « Statistiques doc. »"
        ],
        "answer": 1,
        "explanation": "Vous suivez vos demandes dans « Réservations doc. » : le statut passe de « En attente » à « Approuvée » ou « Refusée ». Les menus « Mes réservations » et « Emprunts » ne relèvent pas de votre rôle."
      },
      {
        "question": "Comment récupérez-vous la référence bibliographique d'un document au format APA ?",
        "options": [
          "Via l'encadré « Citer ce document » et le bouton « Copier »",
          "Via le bouton « Télécharger »",
          "Via « Historique & avis »",
          "Via le bandeau « Récapitulatif » du dépôt"
        ],
        "answer": 0,
        "explanation": "L'encadré « Citer ce document » propose la référence au format APA, que vous copiez d'un clic grâce au bouton « Copier »."
      },
      {
        "question": "Quelle exigence s'applique au « Nouveau mot de passe » dans « Changer mon mot de passe » ?",
        "options": [
          "Au moins 4 caractères",
          "Au moins 6 caractères",
          "Au moins 8 caractères",
          "Aucune contrainte de longueur"
        ],
        "answer": 2,
        "explanation": "Le nouveau mot de passe doit comporter au moins 8 caractères ; vous saisissez aussi le mot de passe actuel et la confirmation avant de cliquer sur « Mettre à jour le mot de passe »."
      },
      {
        "question": "Comment accédez-vous à la formation certifiante « CERTEL » et que coûte le diagnostic de niveau ?",
        "options": [
          "Elle est réservée aux administrateurs ; le diagnostic est payant",
          "Par « Formation CERTEL » dans « Principal » (ou le menu public « CERTEL »), ouverte à tout utilisateur connecté ; le diagnostic de niveau est gratuit",
          "Uniquement via la page « Déposer » ; le diagnostic coûte un abonnement annuel",
          "Par la section « Bibliothèque » ; le diagnostic n'existe pas"
        ],
        "answer": 1,
        "explanation": "CERTEL est accessible à tout utilisateur connecté via « Formation CERTEL » dans la section « Principal », ou via l'entrée « CERTEL » du menu public. Le diagnostic de niveau y est gratuit."
      },
      {
        "question": "Comment fonctionnent l'inscription à CERTEL et l'examen certifiant ?",
        "options": [
          "L'inscription est toujours gratuite et l'examen affiche les corrigés question par question",
          "L'inscription est payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou carte — gratuite tant qu'aucun prix n'est défini — et l'examen certifiant ne révèle les corrigés qu'à la fin",
          "L'inscription se règle uniquement en espèces au guichet et l'examen n'est pas corrigé",
          "L'inscription est réservée au super administrateur et l'examen n'est pas chronométré"
        ],
        "answer": 1,
        "explanation": "L'inscription à CERTEL est payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte, et reste gratuite tant qu'aucun prix n'est défini. L'évaluation certifiante ne dévoile les corrigés qu'à la fin ; en cas de réussite, un certificat PDF paysage est délivré."
      }
    ]
  },
  "SCIENTIFIC_VALIDATOR": {
    "title": "Formation et auto-évaluation — Validateur scientifique",
    "intro": "Bienvenue dans le parcours de prise en main du rôle « Validateur scientifique » d'EduWeb Booking. En tant qu'enseignant-chercheur ou expert disciplinaire, votre mission est d'apporter un regard d'expert sur le FOND d'un mémoire, d'un article ou d'un rapport déposé dans la bibliothèque numérique de votre institution : vous le consultez, vous l'étudiez si besoin hors ligne, puis vous enregistrez un avis scientifique motivé (Favorable ou Réservé). Cette formation vous rend autonome dans cette tâche et clarifie la frontière entre votre expertise scientifique et le contrôle documentaire (vérification, codification, publication, archivage) qui relève du bibliothécaire / documentaliste. Comme tout utilisateur connecté, vous avez aussi accès à la formation certifiante CERTEL au numérique et à l'intelligence artificielle, utile pour consolider vos compétences d'expertise documentaire numérique. Suivez les modules dans l'ordre, puis validez vos acquis avec le QCM final.",
    "modules": [
      {
        "title": "Comprendre votre rôle et votre périmètre",
        "objective": "Situer précisément ce que vous pouvez faire et ce qui relève d'un autre rôle.",
        "content": [
          "Votre rôle est l'expertise scientifique : vous portez un avis sur le fond d'un document, sans gérer son cycle documentaire.",
          "La validation documentaire proprement dite (vérification des métadonnées, génération du code définitif, demande de correction, publication, archivage ou rejet) relève du bibliothécaire / documentaliste, pas de vous.",
          "Dans la barre latérale, votre menu se limite à « Principal » (Accueil, Tableau de bord, Formation CERTEL, Sport cérébral, Mon compte), à « Bibliothèque » (Bibliothèque, Explorer, Documents) et à « Aide » (Support, Centre d'aide) : c'est normal et conforme à votre mission.",
          "Vous pouvez consulter les documents et télécharger ceux qui l'autorisent, mais vous ne pouvez ni déposer un document, ni le réserver ou l'emprunter : les écrans Calendrier, Salles multimédias ou Mes réservations ne figurent pas dans votre menu.",
          "Votre avis ne peut porter que sur les documents de votre PROPRE institution : c'est une exigence du contrôle d'accès, et le bouton d'avis n'apparaît que dans ce cas."
        ]
      },
      {
        "title": "Trouver un document à expertiser",
        "objective": "Localiser rapidement le document à examiner dans le fonds de votre institution.",
        "content": [
          "Dans la barre latérale, ouvrez la section « Bibliothèque » puis cliquez sur « Explorer ».",
          "Utilisez la barre de recherche (« Titre, auteur, mot-clé, code… ») pour retrouver un document précis.",
          "Affinez les résultats avec les filtres « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès » ; le compteur « N document(s) » indique le nombre de résultats.",
          "Cliquez sur la fiche du document pour l'ouvrir.",
          "Vous pouvez aussi passer par l'entrée « Documents », qui présente le fonds sous forme de tableau (code, statut, niveau d'accès, nombre de vues) avec les filtres « Tous les statuts » et « Tous les types »."
        ]
      },
      {
        "title": "Examiner le document avant de vous prononcer",
        "objective": "Réunir tous les éléments d'appréciation, à l'écran ou hors ligne, avant de formuler votre avis.",
        "content": [
          "Sur la fiche, lisez d'abord le « Résumé », puis le bloc « Métadonnées » (auteur principal, co-auteurs, directeur, année, langue, niveau, institution, bibliothèque…) et les « Mots-clés ».",
          "Dans l'encadré « Accès au document », cliquez sur « Consulter » pour lire le texte intégral à l'écran lorsque la consultation est autorisée.",
          "Si le téléchargement est autorisé, utilisez le bouton « Télécharger » pour étudier le document hors ligne avant de formuler votre avis.",
          "Parcourez l'encadré « Historique & avis » pour voir les décisions et avis déjà enregistrés ; il n'apparaît que si au moins un avis ou une décision existe déjà.",
          "Pour votre confort de lecture, les textes narratifs de la plateforme sont affichés dans une police d'au moins 13 px et un lecteur audio « Écouter » permet d'en faire la lecture à voix haute, un appui appréciable lors de longues sessions d'expertise."
        ]
      },
      {
        "title": "Émettre votre avis scientifique",
        "objective": "Enregistrer un avis Favorable ou Réservé, motivé et tracé à votre nom.",
        "content": [
          "Sur la fiche du document, repérez l'encadré « Validation documentaire » et cliquez sur le bouton « Avis scientifique ».",
          "Dans la fenêtre « Avis scientifique », choisissez la « Décision » (champ obligatoire) en cochant « Favorable » (sélectionné par défaut) ou « Réservé ».",
          "Saisissez votre appréciation dans le champ « Commentaire » pour motiver et argumenter votre avis : ce commentaire est facultatif, mais vivement recommandé.",
          "Cliquez sur « Enregistrer l'avis » pour valider ; le bouton « Annuler » vous permet de renoncer sans rien enregistrer.",
          "Votre avis apparaît aussitôt dans l'« Historique & avis » sous la mention « Avis scientifique favorable » ou « Avis scientifique réservé », à votre nom et daté."
        ]
      },
      {
        "title": "Monter en compétences avec la formation CERTEL",
        "objective": "Découvrir la formation certifiante au numérique et à l'IA, ouverte à tout utilisateur connecté.",
        "content": [
          "CERTEL est une formation certifiante au numérique et à l'intelligence artificielle, accessible à tout utilisateur connecté : depuis le tableau de bord, ouvrez la section « Principal » puis « Formation CERTEL » ; le menu public « CERTEL » y conduit également.",
          "Commencez par le diagnostic GRATUIT, qui situe votre niveau ; le parcours comprend ensuite 3 niveaux interactifs (6 modules chacun) avec leçons audio, exercices auto-corrigés à VÉRIFICATION IMMÉDIATE et une évaluation CHRONOMÉTRÉE.",
          "L'évaluation certifiante de fin de niveau présente les corrigés de l'examen À LA FIN, puis délivre un CERTIFICAT au format PDF paysage.",
          "L'inscription est PAYANTE par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte bancaire ; tant qu'aucun prix n'a été défini, l'accès reste gratuit.",
          "Le Super administrateur dispose d'un accès complet sans paiement et règle les tarifs ainsi que les évaluations depuis la section « Plateforme »."
        ]
      },
      {
        "title": "Gérer votre compte et trouver de l'aide",
        "objective": "Sécuriser votre accès et retrouver le guide ainsi que le support de votre rôle.",
        "content": [
          "Dans la section « Principal », cliquez sur « Mon compte » puis, sous « Changer mon mot de passe », renseignez « Mot de passe actuel », « Nouveau mot de passe » et « Confirmer le nouveau mot de passe » (au moins 8 caractères).",
          "Cliquez sur « Mettre à jour le mot de passe » : le bandeau « Mot de passe modifié avec succès. » confirme l'opération.",
          "Si la déconnexion automatique après inactivité est activée par votre établissement, cliquez sur « Rester connecté » dans l'avertissement pour prolonger votre session.",
          "Dans la section « Aide », ouvrez « Centre d'aide » pour retrouver ce guide adapté à votre rôle, puis « Mon guide (PDF) » pour en conserver une version imprimable ; pour toute difficulté technique, passez par « Support ».",
          "L'espace « Sport cérébral » (section « Principal ») reste accessible pour vous détendre, mais il ne fait pas partie de votre mission de validation."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Sur quoi porte exactement la mission du Validateur scientifique ?",
        "options": [
          "Sur la vérification des métadonnées et la génération du code documentaire",
          "Sur le fond scientifique du document (avis d'expert)",
          "Sur la publication et l'archivage des documents"
        ],
        "answer": 1,
        "explanation": "Le validateur scientifique apporte un regard d'expert sur le fond du document ; la vérification, la codification, la publication et l'archivage relèvent du bibliothécaire / documentaliste."
      },
      {
        "question": "Quelles sont les deux décisions possibles lorsque vous enregistrez un avis scientifique ?",
        "options": [
          "« Publié » ou « Rejeté »",
          "« Validé » ou « À corriger »",
          "« Favorable » ou « Réservé »"
        ],
        "answer": 2,
        "explanation": "La fenêtre « Avis scientifique » propose le champ « Décision » avec deux choix : « Favorable » (sélectionné par défaut) ou « Réservé »."
      },
      {
        "question": "Pour quels documents le bouton « Avis scientifique » apparaît-il ?",
        "options": [
          "Pour les documents de votre propre institution uniquement",
          "Pour tous les documents de la plateforme, sans restriction",
          "Pour les seuls documents que vous avez vous-même déposés"
        ],
        "answer": 0,
        "explanation": "Votre avis ne peut porter que sur les documents de votre propre institution : c'est une exigence du contrôle d'accès, et le bouton n'apparaît que dans ce cas."
      },
      {
        "question": "Comment accédez-vous à un document à expertiser ?",
        "options": [
          "Via « Calendrier » puis « Salles multimédias »",
          "Via « Bibliothèque » › « Explorer » (ou l'entrée « Documents »)",
          "Via « Mes réservations »"
        ],
        "answer": 1,
        "explanation": "Vous trouvez les documents depuis « Explorer » ou via l'entrée « Documents » ; les écrans de réservation de ressources ne figurent pas dans votre menu."
      },
      {
        "question": "Que faut-il faire pour valider définitivement votre avis dans la fenêtre « Avis scientifique » ?",
        "options": [
          "Fermer la fenêtre, l'avis est enregistré automatiquement",
          "Cliquer sur « Annuler » après avoir choisi la décision",
          "Cliquer sur « Enregistrer l'avis »"
        ],
        "answer": 2,
        "explanation": "Le bouton « Enregistrer l'avis » valide l'opération ; « Annuler » permet au contraire de renoncer sans rien enregistrer."
      },
      {
        "question": "Le champ « Commentaire » de votre avis est-il obligatoire ?",
        "options": [
          "Non, il est facultatif mais vivement recommandé pour argumenter",
          "Oui, il est obligatoire pour enregistrer l'avis",
          "Non, et il est inutile car il n'est pas conservé"
        ],
        "answer": 0,
        "explanation": "Seule la « Décision » est obligatoire ; le commentaire est facultatif, mais vivement recommandé pour motiver et argumenter votre avis."
      },
      {
        "question": "Comment étudier un document hors ligne avant de vous prononcer ?",
        "options": [
          "En cliquant sur « Réserver / Emprunter » sur la fiche",
          "En cliquant sur « Télécharger » lorsque le téléchargement est autorisé",
          "En demandant au documentaliste de vous l'envoyer par e-mail"
        ],
        "answer": 1,
        "explanation": "Lorsque le téléchargement est autorisé, le bouton « Télécharger » de l'encadré « Accès au document » permet d'étudier le document hors ligne ; vous ne pouvez pas réserver ni emprunter."
      },
      {
        "question": "Où retrouvez-vous votre avis une fois enregistré ?",
        "options": [
          "Dans la page « Mes réservations »",
          "Dans le « Tableau de bord » général de l'institution",
          "Dans l'encadré « Historique & avis » de la fiche du document, à votre nom et daté"
        ],
        "answer": 2,
        "explanation": "L'avis apparaît aussitôt dans l'« Historique & avis » du document sous la mention « Avis scientifique favorable » ou « Avis scientifique réservé », à votre nom et daté."
      },
      {
        "question": "Comment accédez-vous à la formation CERTEL et que propose-t-elle d'abord gratuitement ?",
        "options": [
          "Uniquement sur invitation du documentaliste ; elle commence par l'examen certifiant",
          "Depuis « Principal » › « Formation CERTEL » (ou le menu public « CERTEL ») ; elle commence par un diagnostic gratuit",
          "Par la page « Mes réservations » ; tout y est payant dès le départ"
        ],
        "answer": 1,
        "explanation": "CERTEL est ouverte à tout utilisateur connecté via « Principal » › « Formation CERTEL » ou le menu public « CERTEL », et débute par un diagnostic GRATUIT avant les 3 niveaux interactifs."
      },
      {
        "question": "Comment se déroulent les exercices et l'examen certifiant de CERTEL ?",
        "options": [
          "Exercices auto-corrigés à vérification immédiate ; corrigés de l'examen certifiant affichés à la fin, avec un certificat PDF paysage",
          "Tous les corrigés, exercices comme examen, sont donnés immédiatement",
          "Aucune correction n'est fournie et aucun certificat n'est délivré"
        ],
        "answer": 0,
        "explanation": "Les exercices proposent une VÉRIFICATION IMMÉDIATE, l'évaluation est chronométrée, les corrigés de l'examen certifiant apparaissent À LA FIN, puis un CERTIFICAT PDF paysage est délivré."
      }
    ]
  },
  "READER": {
    "title": "Formation à la prise en main — Lecteur interne",
    "intro": "Cette formation vous prépare à utiliser EduWeb Booking avec le rôle « Lecteur interne » (clé READER). En tant que lecteur, vous consultez le fonds documentaire autorisé de votre établissement : vous explorez le catalogue, consultez et téléchargez les documents auxquels vous avez droit, demandez l'accès aux ressources restreintes, réservez un exemplaire physique ou une consultation sur place, et suivez l'état de vos demandes. Vous pouvez aussi vous entraîner sur l'espace « Sport cérébral », suivre la formation certifiante CERTEL (numérique et IA), situer votre niveau avec le diagnostic CERTEL et gérer la sécurité de votre compte. Important : vous consultez les ressources, vous ne déposez pas et ne validez pas de documents (ces actions relèvent du déposant et du documentaliste). Pour le confort de lecture, les contenus de formation et les guides s'affichent avec une police d'au moins 13 px et un bouton « Écouter » qui lit les passages narratifs à voix haute. À l'issue de cette formation, vous serez autonome sur l'ensemble de ces actions, puis vous validerez vos acquis avec une auto-évaluation.",
    "modules": [
      {
        "title": "Module 1 — Explorer le catalogue documentaire",
        "objective": "Vous saurez rechercher et filtrer les documents du fonds de votre établissement.",
        "content": [
          "Dans la barre latérale, section « Bibliothèque », cliquez sur « Explorer » pour ouvrir la page « Explorer la bibliothèque ».",
          "Saisissez votre recherche dans la barre, guidée par l'indication « Titre, auteur, mot-clé, code… ».",
          "Affinez les résultats avec les filtres déroulants : « Tous les types », « Toutes collections », « Tous domaines » et « Tout accès ».",
          "Lisez le compteur « N document(s) » pour connaître le nombre de résultats, puis cliquez sur une fiche pour ouvrir le détail du document.",
          "Ouvrez « Bibliothèque » (page « Bibliothèque numérique ») pour suivre les indicateurs du fonds (« Documents », « Consultations », « Téléchargements »).",
          "Depuis l'encadré « Derniers dépôts », cliquez sur « Tout voir » pour ouvrir la page « Documents », un tableau présentant chaque ressource avec son code, son statut, son niveau d'accès et son nombre de vues."
        ]
      },
      {
        "title": "Module 2 — Consulter et télécharger un document",
        "objective": "Vous saurez lire un document en ligne et le télécharger lorsqu'il est libre ou payant.",
        "content": [
          "Ouvrez la fiche d'un document depuis « Explorer » ou « Documents » et vérifiez l'en-tête : type, collection, domaine, statut, niveau d'accès et code documentaire.",
          "Dans l'encadré « Accès au document », cliquez sur « Consulter » : le document s'ouvre en « Consultation en lecture seule », avec impression et copie désactivées et un filigrane à votre nom et à votre e-mail.",
          "Pour revenir, utilisez « Retour à la fiche » depuis le lecteur, puis « Retour à la bibliothèque » depuis la fiche.",
          "Si le téléchargement est libre, cliquez sur « Télécharger » ; s'il est payant, cliquez sur « Payer et débloquer » (paiement simulé) puis sur « Télécharger · débloqué ✓ ».",
          "À l'ENS d'Abidjan, lorsqu'un document est payant, saisissez votre matricule étudiant dans l'encadré « Étudiant de l'ENS d'Abidjan ? » puis cliquez sur « Télécharger » pour bénéficier de la gratuité ; un matricule erroné affiche « Matricule invalide ou non éligible. »",
          "Si le fichier est restreint, lisez le message qui en précise la raison (« Consultation sur place uniquement », « Document restreint — demandez l'accès » ou « Document sous embargo »)."
        ]
      },
      {
        "title": "Module 3 — Demander l'accès et réserver un exemplaire",
        "objective": "Vous saurez demander l'accès à un document restreint, réserver un exemplaire physique et suivre vos demandes.",
        "content": [
          "Pour un document « Restreint », ouvrez sa fiche puis, dans « Accès au document », cliquez sur « Demander l'accès ».",
          "Dans la fenêtre « Demander l'accès », renseignez le champ « Motif / note », puis cliquez sur « Demander l'accès » ; le bandeau « Votre demande a été transmise au documentaliste. » confirme l'envoi.",
          "Sur la fiche d'un document disposant d'exemplaires physiques disponibles, cliquez sur « Réserver / Emprunter ».",
          "Dans « Réserver ce document », choisissez le « Type de demande » (« Consultation sur place » ou « Emprunt physique ») ; pour une consultation, renseignez « Début (sur place) » et « Fin », puis ajoutez un « Motif / note » si besoin, et cliquez sur « Envoyer la demande ».",
          "Suivez l'avancement dans « Bibliothèque » › « Réservations doc. » (page « Réservations documentaires ») : chaque demande affiche son type et son statut.",
          "Cliquez sur le titre d'une demande pour rouvrir la fiche du document concerné."
        ]
      },
      {
        "title": "Module 4 — Sport cérébral et compétitions",
        "objective": "Vous saurez vous entraîner sur le Sport cérébral et rejoindre une compétition.",
        "content": [
          "Dans la section « Principal », ouvrez « Sport cérébral » pour consulter vos scores, votre progression, vos badges et le « Défi du jour ».",
          "Cliquez sur « Jouer » (ou « Relever le défi ») pour accéder à l'espace des jeux, choisissez un jeu et un niveau (Débutant, Intermédiaire ou Avancé), puis suivez la consigne affichée à l'écran ou via le bouton « Écouter ».",
          "Pour rejoindre une compétition, repérez l'encadré « Compétition », saisissez le code de session dans le champ « CODE » puis cliquez sur « Rejoindre » ; votre score est pris en compte dans le classement de l'organisateur.",
          "Les consignes des jeux et les contenus de formation s'affichent en police d'au moins 13 px ; utilisez le bouton « Écouter » pour en obtenir la lecture audio."
        ]
      },
      {
        "title": "Module 5 — Se former et se certifier avec CERTEL",
        "objective": "Vous saurez situer votre niveau, suivre la formation certifiante CERTEL au numérique et à l'IA, et obtenir votre certificat.",
        "content": [
          "CERTEL est la formation certifiante au numérique et à l'intelligence artificielle, accessible à tout utilisateur connecté : depuis le tableau de bord, section « Principal », ouvrez « Formation CERTEL » ; sans connexion, le menu public « CERTEL » reste disponible.",
          "Commencez par le « Diagnostic de niveau » GRATUIT : renseignez votre profil, répondez aux questions sur le numérique et l'IA, puis validez pour lire votre niveau conseillé (N1, N2 ou N3), calculé automatiquement par la plateforme.",
          "Suivez ensuite le niveau adapté : chaque niveau comprend 6 modules de leçons illustrées avec lecture audio, des exercices auto-corrigés à vérification immédiate, et une évaluation chronométrée.",
          "Passez l'évaluation certifiante quand vous vous sentez prêt : c'est un examen chronométré qui ne révèle les corrigés qu'à la fin, afin d'attester votre niveau de façon fiable.",
          "En cas de réussite, téléchargez votre certificat au format PDF paysage, à votre nom.",
          "L'inscription à un niveau peut être payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte bancaire ; elle reste gratuite tant qu'aucun prix n'est défini pour ce niveau. Le super administrateur dispose d'un accès complet sans paiement et règle les tarifs et les évaluations dans la section « Plateforme »."
        ]
      },
      {
        "title": "Module 6 — Mobile, compte, sécurité et aide",
        "objective": "Vous saurez naviguer sur mobile, gérer votre mot de passe et obtenir de l'aide.",
        "content": [
          "Sur téléphone, utilisez la barre d'onglets en bas de l'écran : « Accueil » (votre tableau de bord) et « Biblio » (la bibliothèque), et touchez « Explorer » pour rechercher un document.",
          "Le bouton flottant central porte le libellé « Jouer » et ouvre l'espace Sport cérébral ; touchez « Menu » pour retrouver « Documents », « Réservations doc. », « Formation CERTEL » et « Mon compte ».",
          "Dans « Principal », ouvrez « Mon compte » pour vérifier vos informations : nom, e-mail (et fonction le cas échéant), établissement et rôle.",
          "Dans l'encadré « Changer mon mot de passe », renseignez « Mot de passe actuel », « Nouveau mot de passe » (au moins 8 caractères) et « Confirmer le nouveau mot de passe », puis cliquez sur « Mettre à jour le mot de passe ».",
          "Si la déconnexion automatique après inactivité est activée, la fenêtre « Toujours là ? » s'affiche : cliquez sur « Rester connecté » pour prolonger votre session.",
          "Ouvrez « Centre d'aide » pour relire ce guide ou le télécharger en PDF ou en Word, et « Support » pour contacter l'assistance ; les passages narratifs des guides peuvent être lus à voix haute grâce au bouton « Écouter »."
        ]
      }
    ],
    "quiz": [
      {
        "question": "Où cliquez-vous dans la barre latérale pour rechercher et filtrer les documents du fonds ?",
        "options": [
          "Section « Principal » › « Tableau de bord »",
          "Section « Bibliothèque » › « Explorer »",
          "Section « Bibliothèque » › « Réservations doc. »",
          "Section « Principal » › « Mon compte »"
        ],
        "answer": 1,
        "explanation": "La recherche et les filtres (type, collection, domaine, accès) se font sur la page « Explorer la bibliothèque », ouverte depuis « Bibliothèque » › « Explorer »."
      },
      {
        "question": "Lorsque vous consultez un document en ligne avec « Consulter », que se passe-t-il ?",
        "options": [
          "Le document s'ouvre en lecture seule, impression et copie désactivées, avec un filigrane à votre nom et e-mail",
          "Le document est automatiquement téléchargé sur votre appareil",
          "Vous pouvez modifier le document et le redéposer",
          "Le document s'imprime directement"
        ],
        "answer": 0,
        "explanation": "La « Consultation en lecture seule » désactive l'impression et la copie et appose un filigrane à votre nom et à votre e-mail ; le lecteur ne dépose ni ne modifie de document."
      },
      {
        "question": "Un document est payant et vous êtes étudiant à l'ENS d'Abidjan. Comment obtenir la gratuité du téléchargement ?",
        "options": [
          "En cliquant sur « Payer et débloquer » puis en demandant un remboursement",
          "En contactant le documentaliste par e-mail",
          "En saisissant votre matricule étudiant dans l'encadré « Étudiant de l'ENS d'Abidjan ? » puis en cliquant sur « Télécharger »",
          "La gratuité n'est pas possible pour les documents payants"
        ],
        "answer": 2,
        "explanation": "À l'ENS d'Abidjan, saisir dans l'encadré dédié un matricule valide (correspondant à celui enregistré sur votre compte étudiant) donne la gratuité ; un matricule erroné affiche « Matricule invalide ou non éligible. »"
      },
      {
        "question": "Comment demandez-vous l'accès à un document dont le niveau d'accès est « Restreint » ?",
        "options": [
          "Vous le téléchargez directement, l'accès étant automatique",
          "Dans « Accès au document », vous cliquez sur « Demander l'accès », renseignez le « Motif / note » et validez ; la demande part au documentaliste",
          "Vous déposez une nouvelle version du document",
          "Vous le réservez comme exemplaire physique"
        ],
        "answer": 1,
        "explanation": "Pour un document restreint, le bouton « Demander l'accès » ouvre une fenêtre où vous précisez le motif ; la demande est transmise au documentaliste, confirmée par un bandeau."
      },
      {
        "question": "Où suivez-vous l'état de vos demandes d'accès et de vos réservations d'exemplaires ?",
        "options": [
          "Dans « Mon compte »",
          "Dans « Sport cérébral »",
          "Dans « Bibliothèque » › « Réservations doc. »",
          "Dans le « Centre d'aide »"
        ],
        "answer": 2,
        "explanation": "La page « Réservations documentaires », ouverte via « Bibliothèque » › « Réservations doc. », affiche chaque demande avec son type et son statut ; vous pouvez rouvrir la fiche en cliquant sur le titre."
      },
      {
        "question": "Depuis le tableau de bord, comment accédez-vous à la formation certifiante CERTEL au numérique et à l'IA ?",
        "options": [
          "Par la section « Principal » › « Formation CERTEL »",
          "Par « Bibliothèque » › « Explorer »",
          "Par « Mon compte » › « Sécurité »",
          "La formation CERTEL n'est pas accessible aux lecteurs"
        ],
        "answer": 0,
        "explanation": "CERTEL est accessible à tout utilisateur connecté : depuis le tableau de bord, section « Principal » › « Formation CERTEL » (ou le menu public « CERTEL » sans connexion)."
      },
      {
        "question": "Comment se déroule l'évaluation certifiante de CERTEL ?",
        "options": [
          "Elle affiche la bonne réponse après chaque question",
          "C'est un examen chronométré qui ne révèle les corrigés qu'à la fin ; en cas de réussite, vous obtenez un certificat PDF paysage",
          "Elle est notée manuellement par le documentaliste",
          "Elle n'est accessible qu'au super administrateur"
        ],
        "answer": 1,
        "explanation": "L'examen certifiant est chronométré et ne dévoile les corrigés qu'à la fin, pour attester le niveau de façon fiable ; la réussite donne droit à un certificat au format PDF paysage."
      },
      {
        "question": "À propos de l'inscription à un niveau CERTEL, quelle affirmation est exacte ?",
        "options": [
          "Elle est toujours gratuite pour tout le monde",
          "Seul le paiement par carte bancaire est accepté",
          "Elle peut être payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou carte, et reste gratuite tant qu'aucun prix n'est défini",
          "Elle nécessite l'accord préalable du documentaliste"
        ],
        "answer": 2,
        "explanation": "L'inscription peut être payante par Mobile Money (Wave, Orange Money, MTN, Moov) ou par carte ; tant qu'aucun prix n'est fixé pour le niveau, l'accès reste gratuit. Le super administrateur règle les tarifs sous « Plateforme » et dispose d'un accès complet sans paiement."
      },
      {
        "question": "Quelle est la longueur minimale exigée pour un nouveau mot de passe dans « Mon compte » ?",
        "options": [
          "6 caractères",
          "8 caractères",
          "12 caractères",
          "Aucune contrainte de longueur"
        ],
        "answer": 1,
        "explanation": "L'encadré « Changer mon mot de passe » exige un « Nouveau mot de passe » d'au moins 8 caractères, à confirmer, avant de cliquer sur « Mettre à jour le mot de passe »."
      },
      {
        "question": "Sur mobile, que fait le bouton flottant central pour le rôle Lecteur interne ?",
        "options": [
          "Il ouvre la page « Documents »",
          "Il ouvre le menu latéral complet",
          "Il déconnecte votre session",
          "Il porte le libellé « Jouer » et ouvre l'espace Sport cérébral"
        ],
        "answer": 3,
        "explanation": "Pour le rôle Lecteur, le bouton flottant central est libellé « Jouer » et ouvre le Sport cérébral ; le menu latéral, lui, s'ouvre via « Menu »."
      }
    ]
  }
};
