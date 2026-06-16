# EduWeb Booking — Spécification de construction complète pour Claude Code

> **Objectif du document** : fournir à Claude Code un cahier de construction complet pour développer intégralement l’application web **EduWeb Booking** en Node.js, avec une interface moderne, attractive, professionnelle, responsive et ergonomique.  
> **Produit** : plateforme SaaS généraliste de réservation intelligente pour organisations.  
> **Premier pilote** : ENS d’Abidjan — Sous-Direction des APRID — réservation des salles multimédias.  
> **Ambition** : solution nationale ivoirienne extensible à tout type de ressource réservable.

---

## 0. Instruction principale pour Claude Code

Construire une application web complète, moderne et production-ready nommée **EduWeb Booking**.

L’application doit être développée en **Node.js**, avec une architecture claire, maintenable et évolutive. Elle doit permettre à des organisations abonnées de configurer librement leurs ressources réservables, leurs utilisateurs, leurs règles de réservation, leurs workflows de validation, leurs calendriers, leurs notifications, leurs rapports et leurs statistiques.

Le premier usage pilote concerne les **salles multimédias de la Sous-Direction des APRID de l’ENS d’Abidjan**, mais l’application ne doit jamais être limitée à ce seul cas d’usage. Toute la logique métier doit être générique autour de la notion de **ressource réservable**.

Claude Code doit produire :

- une application complète Next.js/Node.js ;
- une base de données PostgreSQL avec Prisma ;
- une interface moderne, très agréable et attractive ;
- une architecture multi-organisation ;
- un système d’authentification et de rôles ;
- un module de ressources configurables ;
- un module de réservation avec calendrier ;
- des tableaux de bord ;
- des statistiques ;
- des notifications e-mail ;
- une base prête pour WhatsApp, SMS, paiement, QR code, incidents et maintenance ;
- une documentation technique et utilisateur minimale.

---

## 1. Identité du produit

### 1.1 Nom

**EduWeb Booking**

### 1.2 Intitulé long

**EduWeb Booking — Plateforme intelligente de réservation des ressources pour organisations**

### 1.3 Positionnement

EduWeb Booking est une application web SaaS permettant de gérer tout type de réservation dans une organisation : salles, espaces, matériels, véhicules, services, rendez-vous, ressources documentaires, équipements, événements, postes informatiques, laboratoires, bureaux partagés ou toute autre ressource réservée dans une structure.

### 1.4 Premier contexte de déploiement

- Pays : Côte d’Ivoire
- Organisation pilote : ENS d’Abidjan
- Unité pilote : Sous-Direction des APRID
- Premier cas d’usage : réservation des salles multimédias
- Utilisateurs initiaux : enseignants, formateurs, étudiants, personnels administratifs, responsables de salles, techniciens, administrateurs APRID

### 1.5 Vision

Créer une solution nationale de référence en Côte d’Ivoire pour la réservation intelligente des ressources partagées, extensible par abonnement à toute organisation publique ou privée.

---

## 2. Charte graphique et expérience utilisateur

### 2.1 Logo

Utiliser le logo fourni :

```text
Logo EduWeb Booking.png
```

Dans le projet, prévoir l’emplacement suivant :

```text
/public/brand/logo-eduweb-booking.png
```

Le logo doit être visible sur :

- la page d’accueil publique ;
- la page de connexion ;
- la barre latérale du tableau de bord ;
- les e-mails de notification ;
- les rapports PDF ;
- les écrans d’administration ;
- les pages d’erreur.

### 2.2 Palette recommandée

Utiliser une palette sobre, institutionnelle, moderne et attractive.

```css
:root {
  --eduweb-bottle-green: #064B3A;
  --eduweb-bottle-green-700: #073F32;
  --eduweb-bottle-green-600: #0B5A45;
  --eduweb-bottle-green-50: #EAF6F1;

  --background-main: #FFFFFF;
  --background-soft: #F5F7F6;
  --background-card: #FFFFFF;
  --border-soft: #E2E8E5;

  --text-main: #10231E;
  --text-muted: #66736F;

  --available: #22C55E;
  --pending: #F97316;
  --unavailable: #DC2626;
  --advanced: #6D5DF5;
  --advanced-night: #172554;

  --success-soft: #DCFCE7;
  --warning-soft: #FFEDD5;
  --danger-soft: #FEE2E2;
  --advanced-soft: #EDE9FE;
}
```

### 2.3 Usage des couleurs

| Usage | Couleur | Rôle |
|---|---|---|
| Identité principale | Vert bouteille EduWeb | Logo, boutons principaux, menus, titres forts |
| Fond principal | Blanc | Lisibilité, sobriété |
| Fond secondaire | Gris clair | Cartes, sections, arrière-plans doux |
| Disponibilité | Vert | Ressource disponible, validation réussie |
| Attente | Orange | Demande en attente, action requise |
| Indisponibilité | Rouge | Ressource bloquée, conflit, refus |
| Modules avancés | Violet ou bleu nuit | IA, statistiques avancées, premium, administration |

### 2.4 Typographie

Utiliser une police légèrement arrondie, moderne et très lisible.

Recommandation prioritaire :

```text
Nunito Sans
```

Alternatives :

- Rubik
- Plus Jakarta Sans
- Manrope
- Poppins

Dans Next.js, utiliser `next/font/google`.

### 2.5 Style visuel

L’interface doit être :

- moderne ;
- claire ;
- très agréable ;
- professionnelle ;
- responsive ;
- attractive ;
- légère ;
- accessible ;
- dotée de cartes visuelles ;
- dotée d’icônes simples ;
- dotée de micro-interactions fluides ;
- compatible mobile, tablette et ordinateur.

Inspiration visuelle : SaaS premium, tableau de bord institutionnel moderne, cartes arrondies, espaces respirants, ombres légères, infographies propres.

### 2.6 Principes UX

- Toujours afficher clairement la disponibilité.
- Ne jamais laisser l’utilisateur réserver une ressource interdite ou indisponible.
- Toujours proposer une alternative quand une ressource n’est pas disponible.
- Limiter les formulaires longs par des étapes progressives.
- Mettre en avant les réservations du jour.
- Permettre à un responsable de valider rapidement depuis mobile.
- Donner des retours visuels clairs : succès, attente, refus, conflit, erreur.
- Prévoir une interface simple pour les non-techniciens.

---

## 3. Stack technique obligatoire

### 3.1 Application

Utiliser :

- **Next.js 14+** avec App Router ;
- **TypeScript** ;
- **Node.js** ;
- **Tailwind CSS** ;
- **shadcn/ui** ;
- **Prisma ORM** ;
- **PostgreSQL** ;
- **Auth.js / NextAuth** ou authentification JWT sécurisée ;
- **Zod** pour la validation ;
- **React Hook Form** pour les formulaires ;
- **TanStack Query** si nécessaire pour les états serveur ;
- **FullCalendar** ou équivalent pour le calendrier ;
- **Recharts** ou **ECharts** pour les graphiques ;
- **Lucide React** pour les icônes ;
- **date-fns** pour les dates ;
- **Nodemailer** pour l’e-mail ;
- **Docker** pour le déploiement.

### 3.2 Architecture recommandée

```text
eduweb-booking/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── brand/
│   ├── dashboard/
│   ├── resources/
│   ├── bookings/
│   ├── calendar/
│   ├── statistics/
│   └── forms/
├── config/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── permissions.ts
│   ├── mail.ts
│   ├── dates.ts
│   ├── booking-rules.ts
│   └── tenant.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── brand/
├── styles/
├── types/
├── tests/
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## 4. Concept central : ressource réservable

Ne jamais coder uniquement `Room` comme concept principal.

Créer un modèle générique :

```text
ResourceCategory
Resource
ResourceAttribute
Booking
```

Une ressource peut être :

- une salle multimédia ;
- une salle de réunion ;
- un amphithéâtre ;
- un véhicule ;
- un matériel ;
- un service ;
- une personne ;
- un rendez-vous ;
- un équipement ;
- une documentation ;
- un livre ;
- un mémoire ;
- une annale ;
- un rapport ;
- un espace événementiel ;
- une prestation.

### 4.1 Types de ressources à prévoir dans les données initiales

| Type | Exemples | Champs spécifiques possibles |
|---|---|---|
| Salle ou espace | Salle multimédia, amphithéâtre, salle de réunion | Capacité, équipements, localisation, horaires, règles d’usage |
| Documentation | Ressources papier, livres, mémoires, rapports, annales, revues | Cote, auteur, titre, année, exemplaires, disponibilité, durée de prêt |
| Matériel | Vidéoprojecteur, ordinateur portable, caméra | Quantité, état, caution, numéro d’inventaire, durée maximale |
| Véhicule | Véhicule administratif, minibus | Immatriculation, chauffeur, places, destination, ordre de mission |
| Service | Assistance informatique, reprographie, rendez-vous | Durée, agent, pièces à fournir, niveau d’urgence |
| Événement ou espace public | Auditorium, stand, terrain, exposition | Période, coût éventuel, configuration, invités |

---

## 5. Modules fonctionnels à construire

## 5.1 Module public

### Pages publiques

Créer les pages suivantes :

```text
/
/demo
/pricing
/features
/contact
/login
/register-organization
```

### Page d’accueil publique

La page d’accueil doit être très attractive.

Sections attendues :

1. Header avec logo, navigation, bouton connexion.
2. Hero section :
   - titre fort : “Réservez, organisez et valorisez toutes vos ressources.”
   - sous-titre : “EduWeb Booking centralise les réservations de salles, matériels, véhicules, services, documents et espaces pour les organisations modernes.”
   - boutons : “Demander une démo”, “Se connecter”.
   - illustration professionnelle : dashboard, calendrier, tuiles de ressources.
3. Section problèmes résolus : conflits, doublons, cahiers physiques, manque de statistiques.
4. Section ressources réservables : salles, documentation, matériel, véhicules, services.
5. Section fonctionnement en 4 étapes.
6. Section premier pilote APRID ENS d’Abidjan.
7. Section statistiques et pilotage.
8. Section plans d’abonnement.
9. Section CTA finale.
10. Footer avec contacts EduWeb.

### Ton visuel

- très moderne ;
- fond blanc/gris clair ;
- vert bouteille dominant ;
- cartes arrondies ;
- icônes colorées ;
- infographies simples ;
- mini-calendrier illustratif ;
- badges de statut : Disponible, En attente, Indisponible.

---

## 5.2 Authentification

Fonctionnalités :

- connexion e-mail/mot de passe ;
- inscription par invitation ;
- inscription organisationnelle optionnelle ;
- réinitialisation mot de passe ;
- vérification e-mail ;
- rôles et permissions ;
- session sécurisée ;
- limitation des tentatives de connexion ;
- journalisation des connexions ;
- 2FA optionnel dans l’architecture.

Pages :

```text
/login
/forgot-password
/reset-password
/invite/[token]
```

---

## 5.3 Multi-organisation SaaS

Chaque organisation doit avoir :

- son nom ;
- son sigle ;
- son logo ;
- son pays ;
- sa ville ;
- ses sites ;
- ses services ;
- ses utilisateurs ;
- ses catégories ;
- ses ressources ;
- ses règles ;
- ses rapports ;
- ses statistiques ;
- son abonnement ;
- sa terminologie ;
- ses couleurs personnalisées.

Important : les données doivent être isolées par organisation avec `organizationId` sur les principales tables.

---

## 5.4 Gestion des sites, départements et services

Une organisation peut avoir plusieurs niveaux :

```text
Organisation > Site > Département/Service > Ressources
```

Exemples :

- ENS d’Abidjan
  - Campus principal
    - Sous-Direction APRID
    - Bibliothèque
    - Laboratoire informatique

Fonctionnalités :

- créer/modifier/supprimer un site ;
- créer/modifier/supprimer un service ;
- rattacher des utilisateurs ;
- rattacher des ressources ;
- filtrer les statistiques par site ou service.

---

## 5.5 Gestion des utilisateurs

Profils à gérer :

- Super Administrateur EduWeb ;
- Administrateur d’organisation ;
- Responsable de ressource ;
- Validateur hiérarchique ;
- Utilisateur demandeur ;
- Technicien ou agent d’appui ;
- Visiteur externe optionnel.

Fonctionnalités :

- création d’utilisateur ;
- invitation par e-mail ;
- import CSV ;
- affectation à organisation/site/service ;
- affectation de rôles ;
- activation/désactivation ;
- recherche et filtres ;
- historique utilisateur ;
- statistiques personnelles.

---

## 5.6 Rôles et permissions

Prévoir une gestion fine des permissions.

Permissions minimales :

```text
organization.manage
users.manage
roles.manage
sites.manage
departments.manage
resource_categories.manage
resources.create
resources.read
resources.update
resources.delete
bookings.create
bookings.read_all
bookings.read_own
bookings.validate
bookings.reject
bookings.cancel_own
bookings.cancel_all
bookings.reschedule
calendar.read
statistics.read
reports.export
incidents.manage
maintenance.manage
settings.manage
```

L’interface doit masquer les éléments interdits selon les permissions.

---

## 5.7 Catégories de ressources

L’administrateur doit pouvoir créer librement des catégories.

Exemples de catégories initiales :

- Salles multimédias ;
- Salles de réunion ;
- Documentation ;
- Matériels ;
- Véhicules ;
- Services ;
- Espaces événementiels.

Chaque catégorie doit pouvoir avoir des champs dynamiques.

Exemples de champs dynamiques :

- texte court ;
- texte long ;
- nombre ;
- date ;
- heure ;
- liste déroulante ;
- case à cocher ;
- fichier ;
- URL ;
- montant ;
- booléen.

---

## 5.8 Ressources

Fiche ressource complète :

- nom ;
- code ;
- catégorie ;
- organisation ;
- site ;
- service ;
- responsable ;
- description ;
- photo ;
- capacité ;
- quantité ;
- statut ;
- disponibilité ;
- horaires ;
- règles d’usage ;
- consignes ;
- équipements associés ;
- QR code ;
- documents associés ;
- champs personnalisés.

Statuts :

```text
AVAILABLE
PARTIALLY_AVAILABLE
PENDING
RESERVED
UNAVAILABLE
MAINTENANCE
OUT_OF_SERVICE
ARCHIVED
```

Affichage :

- tuiles modernes ;
- code couleur ;
- icône selon la catégorie ;
- bouton “Réserver” ;
- bouton “Détails” ;
- prochaine disponibilité ;
- taux d’occupation.

---

## 5.9 Réservation

### Parcours de réservation

1. Choisir une catégorie.
2. Choisir une ressource.
3. Consulter le calendrier.
4. Sélectionner date et créneau.
5. Renseigner le motif.
6. Indiquer type d’usage.
7. Indiquer effectif ou quantité.
8. Ajouter besoins particuliers.
9. Joindre un document si nécessaire.
10. Soumettre.
11. Recevoir un accusé.
12. Suivre le statut.

### Types d’usage

```text
INDIVIDUAL
COLLECTIVE
PEDAGOGICAL
ADMINISTRATIVE
TECHNICAL
EVENT
TRAINING
MEETING
MAINTENANCE
EXAM
CONFERENCE
OTHER
```

### États de réservation

```text
DRAFT
SUBMITTED
PENDING_VALIDATION
APPROVED
REJECTED
CANCELLED_BY_USER
CANCELLED_BY_ADMIN
RESCHEDULED
IN_PROGRESS
COMPLETED
NO_SHOW
CLOSED_WITH_INCIDENT
CLOSED_WITHOUT_INCIDENT
```

### Règles obligatoires

- Empêcher les doubles réservations si la ressource est exclusive.
- Empêcher le dépassement de capacité.
- Empêcher la réservation hors horaires d’ouverture.
- Empêcher la réservation pendant une maintenance.
- Empêcher la réservation pendant un jour bloqué.
- Proposer une alternative si indisponible.
- Journaliser toute action.

---

## 5.10 Calendrier

Créer un calendrier professionnel avec vues :

- jour ;
- semaine ;
- mois ;
- ressource ;
- catégorie ;
- utilisateur ;
- site ;
- service.

Fonctionnalités :

- filtres ;
- couleurs selon statut ;
- détails au clic ;
- création rapide ;
- export iCal optionnel ;
- synchronisation Google/Outlook prévue dans l’architecture.

---

## 5.11 Validation

Modes de validation :

```text
AUTO
SIMPLE
HIERARCHICAL
MULTI_LEVEL
CONDITIONAL
```

Cas d’usage :

- validation automatique si ressource disponible ;
- validation par responsable ;
- validation hiérarchique ;
- validation multiple ;
- validation conditionnelle selon profil, durée, effectif, ressource ou sensibilité.

Actions du validateur :

- approuver ;
- refuser avec motif ;
- demander des précisions ;
- proposer un autre créneau ;
- déléguer ;
- ajouter observation interne.

---

## 5.12 Notifications

Canaux :

- e-mail dans le MVP ;
- WhatsApp Business API dans la version 2 ;
- SMS optionnel ;
- notification interne.

Notifications à envoyer :

- nouvelle demande ;
- demande reçue ;
- demande validée ;
- demande refusée ;
- demande annulée ;
- demande reportée ;
- rappel avant activité ;
- incident ;
- maintenance ;
- demande en attente trop longtemps ;
- évaluation après usage.

Créer un système de templates de notification.

Exemple e-mail :

```text
Objet : Confirmation de réservation - {{resourceName}}
Bonjour {{userName}},
Votre demande de réservation a été {{status}}.
Ressource : {{resourceName}}
Date : {{date}}
Heure : {{startTime}} - {{endTime}}
Motif : {{purpose}}
Code : {{bookingCode}}
EduWeb Booking
```

---

## 5.13 Tableaux de bord

### Tableau de bord utilisateur

Afficher :

- prochaine réservation ;
- demandes en attente ;
- réservations validées ;
- réservations passées ;
- historique ;
- statistiques personnelles ;
- favoris ;
- bouton “Nouvelle réservation”.

### Tableau de bord responsable

Afficher :

- demandes à valider ;
- ressources sous sa responsabilité ;
- planning du jour ;
- incidents ouverts ;
- ressources en maintenance ;
- temps moyen de validation.

### Tableau de bord administrateur

Afficher :

- réservations du jour ;
- demandes en attente ;
- ressources disponibles ;
- taux d’occupation ;
- utilisateurs actifs ;
- ressources les plus utilisées ;
- ressources sous-utilisées ;
- incidents ;
- graphiques.

### Tableau de bord Super Admin EduWeb

Afficher :

- organisations abonnées ;
- abonnements ;
- modules activés ;
- usage global ;
- incidents techniques ;
- statistiques commerciales.

---

## 5.14 Statistiques et infographies

Construire des graphiques modernes :

- cartes KPI ;
- courbes d’évolution ;
- histogrammes ;
- diagrammes circulaires ;
- heatmap des créneaux ;
- classement des ressources ;
- classement des utilisateurs ;
- taux de validation ;
- taux d’annulation ;
- no-show ;
- durée moyenne ;
- satisfaction.

Indicateurs :

```text
Total des réservations
Réservations du jour
Réservations de la semaine
Demandes en attente
Taux d’occupation
Ressources les plus utilisées
Ressources saturées
Ressources sous-utilisées
Temps moyen de validation
Taux de refus
Taux d’annulation
Taux de présence effective
Utilisateurs les plus réguliers
Services les plus organisés
```

---

## 5.15 Rapports

Prévoir génération/export :

- PDF ;
- Excel ;
- CSV.

Types de rapports :

- journalier ;
- hebdomadaire ;
- mensuel ;
- trimestriel ;
- annuel ;
- par ressource ;
- par catégorie ;
- par site ;
- par service ;
- par utilisateur ;
- par statut.

Dans le MVP, implémenter au minimum CSV et PDF simple.

---

## 5.16 Incidents et maintenance

Architecture à prévoir, même si non prioritaire dans le MVP.

Incident :

- ressource concernée ;
- auteur ;
- description ;
- photo ;
- urgence ;
- statut ;
- technicien assigné ;
- date de résolution.

Maintenance :

- ressource ;
- période ;
- motif ;
- technicien ;
- blocage automatique ;
- notification ;
- historique.

---

## 5.17 QR code

Prévoir un QR code par ressource.

Usages futurs :

- voir disponibilité ;
- réserver ;
- confirmer présence ;
- signaler incident ;
- lire consignes.

Dans le MVP, générer un QR code simple menant à la page publique/interne de la ressource.

---

## 5.18 Présence effective et no-show

Prévoir :

- bouton “Je suis arrivé” ;
- bouton “Activité terminée” ;
- confirmation par QR code ;
- détection des réservations non honorées ;
- statistiques no-show.

---

## 5.19 Évaluation après usage

Après activité, envoyer un formulaire court :

- ressource disponible à l’heure ?
- état satisfaisant ?
- matériel conforme ?
- problème rencontré ?
- note globale ;
- commentaire.

---

## 5.20 Badges et valorisation

Prévoir dans la feuille de route :

- utilisateur régulier ;
- utilisateur ponctuel ;
- service le plus organisé ;
- responsable réactif ;
- meilleur usage pédagogique ;
- prix de l’usager le plus régulier.

---

## 6. Pages internes à créer

### 6.1 Dashboard général

```text
/dashboard
```

Contenu :

- KPI ;
- réservations du jour ;
- demandes en attente ;
- calendrier miniature ;
- ressources populaires ;
- alertes ;
- bouton nouvelle réservation.

### 6.2 Ressources

```text
/dashboard/resources
/dashboard/resources/new
/dashboard/resources/[id]
/dashboard/resources/[id]/edit
```

### 6.3 Catégories

```text
/dashboard/resource-categories
/dashboard/resource-categories/new
/dashboard/resource-categories/[id]/edit
```

### 6.4 Réservations

```text
/dashboard/bookings
/dashboard/bookings/new
/dashboard/bookings/[id]
/dashboard/bookings/[id]/edit
/dashboard/bookings/pending
/dashboard/bookings/my
```

### 6.5 Calendrier

```text
/dashboard/calendar
```

### 6.6 Statistiques

```text
/dashboard/statistics
```

### 6.7 Rapports

```text
/dashboard/reports
```

### 6.8 Administration

```text
/dashboard/admin/organization
/dashboard/admin/sites
/dashboard/admin/departments
/dashboard/admin/users
/dashboard/admin/roles
/dashboard/admin/settings
/dashboard/admin/subscription
```

### 6.9 Support

```text
/dashboard/support
/dashboard/help
```

---

## 7. Composants UI essentiels

Créer les composants suivants :

```text
BrandLogo
PublicHeader
DashboardSidebar
DashboardTopbar
KpiCard
ResourceCard
ResourceStatusBadge
BookingStatusBadge
AvailabilityBadge
BookingTimeline
CalendarView
BookingForm
ResourceForm
CategoryForm
UserForm
ValidationPanel
NotificationList
StatsChartCard
ReportExportPanel
EmptyState
ConfirmDialog
SearchFilterBar
ResponsiveDataTable
```

### 7.1 ResourceCard

Doit afficher :

- icône de catégorie ;
- nom ;
- code ;
- statut ;
- capacité ;
- quantité disponible ;
- site/service ;
- prochaine disponibilité ;
- bouton détails ;
- bouton réserver.

### 7.2 BookingForm

Formulaire en étapes :

1. Type de ressource.
2. Ressource.
3. Date et créneau.
4. Motif et usage.
5. Besoins particuliers.
6. Confirmation.

### 7.3 Statuts visuels

Utiliser des badges :

- Disponible : fond vert doux, texte vert ;
- En attente : fond orange doux, texte orange ;
- Indisponible : fond rouge doux, texte rouge ;
- Maintenance : fond violet doux, texte violet ;
- Validée : vert ;
- Refusée : rouge ;
- Annulée : gris ;
- En cours : bleu nuit.

---

## 8. Modèle de données Prisma recommandé

Créer un fichier `prisma/schema.prisma` proche du modèle suivant.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  INVITED
}

enum ResourceStatus {
  AVAILABLE
  PARTIALLY_AVAILABLE
  RESERVED
  UNAVAILABLE
  MAINTENANCE
  OUT_OF_SERVICE
  ARCHIVED
}

enum BookingStatus {
  DRAFT
  SUBMITTED
  PENDING_VALIDATION
  APPROVED
  REJECTED
  CANCELLED_BY_USER
  CANCELLED_BY_ADMIN
  RESCHEDULED
  IN_PROGRESS
  COMPLETED
  NO_SHOW
  CLOSED_WITH_INCIDENT
  CLOSED_WITHOUT_INCIDENT
}

enum UsageType {
  INDIVIDUAL
  COLLECTIVE
  PEDAGOGICAL
  ADMINISTRATIVE
  TECHNICAL
  EVENT
  TRAINING
  MEETING
  MAINTENANCE
  EXAM
  CONFERENCE
  OTHER
}

enum ValidationMode {
  AUTO
  SIMPLE
  HIERARCHICAL
  MULTI_LEVEL
  CONDITIONAL
}

enum NotificationChannel {
  EMAIL
  WHATSAPP
  SMS
  INTERNAL
}

model Organization {
  id          String   @id @default(cuid())
  name        String
  acronym     String?
  country     String   @default("Côte d’Ivoire")
  city        String?
  address     String?
  logoUrl     String?
  primaryColor String? @default("#064B3A")
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users       User[]
  sites       Site[]
  departments Department[]
  categories  ResourceCategory[]
  resources   Resource[]
  bookings    Booking[]
  roles        Role[]
  settings     OrganizationSetting?
}

model OrganizationSetting {
  id             String @id @default(cuid())
  organizationId String @unique
  language       String @default("fr")
  timezone       String @default("Africa/Abidjan")
  allowAutoValidation Boolean @default(false)
  workingDays    Json?
  openingHours   Json?
  holidays       Json?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Site {
  id             String @id @default(cuid())
  organizationId String
  name           String
  code           String?
  city           String?
  address        String?
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  departments  Department[]
  resources    Resource[]
}

model Department {
  id             String @id @default(cuid())
  organizationId String
  siteId         String?
  name           String
  code           String?

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  site         Site? @relation(fields: [siteId], references: [id])
  users        User[]
  resources    Resource[]
}

model User {
  id             String @id @default(cuid())
  organizationId String?
  departmentId   String?
  email          String @unique
  passwordHash   String?
  firstName      String
  lastName       String
  phone          String?
  functionTitle  String?
  status         UserStatus @default(ACTIVE)
  imageUrl       String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization? @relation(fields: [organizationId], references: [id])
  department   Department? @relation(fields: [departmentId], references: [id])
  roles        UserRole[]
  bookings     Booking[] @relation("BookingRequester")
  validations  BookingValidation[]
  notifications Notification[]
  incidents    Incident[]
}

model Role {
  id             String @id @default(cuid())
  organizationId String?
  name           String
  description    String?
  isSystem       Boolean @default(false)

  organization Organization? @relation(fields: [organizationId], references: [id])
  users        UserRole[]
  permissions  RolePermission[]
}

model Permission {
  id          String @id @default(cuid())
  key         String @unique
  description String?
  roles       RolePermission[]
}

model UserRole {
  userId String
  roleId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId])
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  @@id([roleId, permissionId])
}

model ResourceCategory {
  id             String @id @default(cuid())
  organizationId String
  name           String
  code           String?
  description    String?
  icon           String?
  color          String?
  validationMode ValidationMode @default(SIMPLE)
  dynamicFields  Json?
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  resources    Resource[]
}

model Resource {
  id             String @id @default(cuid())
  organizationId String
  categoryId     String
  siteId         String?
  departmentId   String?
  managerId      String?
  name           String
  code           String
  description    String?
  imageUrl       String?
  status         ResourceStatus @default(AVAILABLE)
  capacity       Int?
  quantityTotal  Int?
  quantityAvailable Int?
  location       String?
  equipment      Json?
  customFields   Json?
  rules          Json?
  qrCodeUrl      String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  category     ResourceCategory @relation(fields: [categoryId], references: [id])
  site         Site? @relation(fields: [siteId], references: [id])
  department   Department? @relation(fields: [departmentId], references: [id])
  bookings     Booking[]
  incidents    Incident[]
  maintenances Maintenance[]
}

model Booking {
  id             String @id @default(cuid())
  organizationId String
  resourceId     String
  requesterId    String
  code           String @unique
  title          String?
  purpose        String
  usageType      UsageType @default(INDIVIDUAL)
  participantCount Int?
  quantityRequested Int?
  startAt        DateTime
  endAt          DateTime
  status         BookingStatus @default(SUBMITTED)
  needsSupport   Boolean @default(false)
  specialNeeds   String?
  attachments    Json?
  internalNote   String?
  requesterNote  String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  resource     Resource @relation(fields: [resourceId], references: [id])
  requester    User @relation("BookingRequester", fields: [requesterId], references: [id])
  validations  BookingValidation[]
  history      BookingStatusHistory[]
  participants BookingParticipant[]
  notifications Notification[]
}

model BookingValidation {
  id         String @id @default(cuid())
  bookingId  String
  validatorId String
  status     String
  comment    String?
  validatedAt DateTime?
  createdAt  DateTime @default(now())

  booking   Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  validator User @relation(fields: [validatorId], references: [id])
}

model BookingStatusHistory {
  id        String @id @default(cuid())
  bookingId String
  status    BookingStatus
  comment   String?
  changedBy String?
  createdAt DateTime @default(now())

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

model BookingParticipant {
  id        String @id @default(cuid())
  bookingId String
  name      String?
  email     String?
  phone     String?
  checkedIn Boolean @default(false)

  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
}

model Notification {
  id        String @id @default(cuid())
  bookingId String?
  userId    String?
  channel   NotificationChannel
  subject   String?
  content   String
  status    String @default("PENDING")
  sentAt    DateTime?
  createdAt DateTime @default(now())

  booking Booking? @relation(fields: [bookingId], references: [id])
  user    User? @relation(fields: [userId], references: [id])
}

model Incident {
  id          String @id @default(cuid())
  resourceId  String
  reporterId  String
  title       String
  description String
  urgency     String @default("NORMAL")
  status      String @default("OPEN")
  imageUrl    String?
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?

  resource Resource @relation(fields: [resourceId], references: [id])
  reporter User @relation(fields: [reporterId], references: [id])
}

model Maintenance {
  id          String @id @default(cuid())
  resourceId  String
  title       String
  description String?
  startAt     DateTime
  endAt       DateTime
  status      String @default("PLANNED")
  createdAt   DateTime @default(now())

  resource Resource @relation(fields: [resourceId], references: [id])
}

model AuditLog {
  id             String @id @default(cuid())
  organizationId String?
  userId         String?
  action         String
  entityType     String
  entityId       String?
  oldValue       Json?
  newValue       Json?
  ipAddress      String?
  createdAt      DateTime @default(now())
}
```

---

## 9. Règles métier essentielles

### 9.1 Détection de conflit

Avant toute validation, vérifier :

- même ressource ;
- créneau chevauchant ;
- statut déjà validé/en attente bloquante ;
- capacité restante ;
- maintenance ;
- indisponibilité ;
- règles d’ouverture ;
- jours fériés.

Pseudo-code :

```ts
function hasTimeOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}
```

### 9.2 Codification des réservations

Format :

```text
EB-CI-ORG-SERVICE-CAT-YYYY-0001
```

Exemple :

```text
EB-CI-ENS-APRID-SM-2026-0001
```

### 9.3 Disponibilité

Une ressource est réservable si :

- elle est active ;
- elle n’est pas en maintenance ;
- le créneau ne chevauche pas une réservation bloquante ;
- la capacité ou quantité demandée est disponible ;
- les règles du profil utilisateur l’autorisent.

### 9.4 Réservation partielle ou exclusive

Certaines ressources sont exclusives : une salle de réunion réservée bloque tout le créneau.

Certaines ressources sont partagées : salle multimédia avec 30 postes, possibilité de réserver 10 postes si l’organisation l’autorise.

Prévoir dans `Resource.rules` :

```json
{
  "bookingMode": "exclusive | partial | mixed",
  "maxDurationMinutes": 240,
  "minNoticeHours": 2,
  "requiresValidation": true
}
```

---

## 10. Données initiales de démonstration

Créer un seed Prisma avec :

### Organisation

```text
ENS d’Abidjan
Pays : Côte d’Ivoire
Ville : Abidjan
Unité : Sous-Direction APRID
```

### Sites/services

```text
Site principal ENS d’Abidjan
Sous-Direction APRID
Bibliothèque
Laboratoire informatique
```

### Catégories

```text
Salles multimédias
Documentation
Matériels
Véhicules
Services
```

### Ressources exemples

```text
Salle multimédia 1 — capacité 30 — 30 postes
Salle multimédia 2 — capacité 25 — 25 postes
Vidéoprojecteur APRID 01
Ordinateur portable APRID 01
Fonds documentaire APRID — mémoires
Assistance informatique
```

### Utilisateurs

```text
superadmin@eduweb.ci — Super Administrateur EduWeb
admin.aprid@ens.ci — Administrateur APRID
responsable.salles@ens.ci — Responsable de ressource
technicien.aprid@ens.ci — Technicien
enseignant.demo@ens.ci — Utilisateur demandeur
```

---

## 11. API routes recommandées

Créer des routes API sécurisées.

```text
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password

GET    /api/me

GET    /api/organizations
POST   /api/organizations
GET    /api/organizations/:id
PATCH  /api/organizations/:id

GET    /api/sites
POST   /api/sites
PATCH  /api/sites/:id
DELETE /api/sites/:id

GET    /api/departments
POST   /api/departments
PATCH  /api/departments/:id
DELETE /api/departments/:id

GET    /api/users
POST   /api/users
PATCH  /api/users/:id
DELETE /api/users/:id

GET    /api/resource-categories
POST   /api/resource-categories
PATCH  /api/resource-categories/:id
DELETE /api/resource-categories/:id

GET    /api/resources
POST   /api/resources
GET    /api/resources/:id
PATCH  /api/resources/:id
DELETE /api/resources/:id
GET    /api/resources/:id/availability

GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/:id
PATCH  /api/bookings/:id
POST   /api/bookings/:id/approve
POST   /api/bookings/:id/reject
POST   /api/bookings/:id/cancel
POST   /api/bookings/:id/check-in
POST   /api/bookings/:id/complete

GET    /api/calendar
GET    /api/statistics/overview
GET    /api/statistics/resources
GET    /api/statistics/users
GET    /api/reports/export

GET    /api/incidents
POST   /api/incidents
PATCH  /api/incidents/:id

GET    /api/maintenance
POST   /api/maintenance
PATCH  /api/maintenance/:id
```

---

## 12. Sécurité

Implémenter :

- HTTPS en production ;
- hachage mot de passe avec bcrypt ou argon2 ;
- RBAC ;
- isolation des données par `organizationId` ;
- validation Zod sur toutes les entrées ;
- protection CSRF si sessions cookies ;
- protection XSS ;
- contrôle d’accès côté API et UI ;
- logs d’audit ;
- limitation des tentatives de connexion ;
- `.env.example` sans secret réel ;
- sauvegarde quotidienne documentée.

---

## 13. Accessibilité et responsive

L’application doit fonctionner sur :

- ordinateur ;
- tablette ;
- smartphone.

Prévoir :

- contrastes suffisants ;
- boutons visibles ;
- textes lisibles ;
- navigation clavier ;
- labels de formulaire ;
- messages d’erreur explicites ;
- états vides utiles ;
- loaders ;
- skeletons ;
- mode sombre optionnel.

---

## 14. MVP à livrer en priorité

Le MVP doit contenir :

1. Page d’accueil publique moderne.
2. Connexion.
3. Tableau de bord.
4. Gestion organisation ENS/APRID.
5. Gestion utilisateurs basique.
6. Rôles simples.
7. Catégories de ressources.
8. Ressources réservables.
9. Fiches salles multimédias.
10. Affichage en tuiles.
11. Calendrier.
12. Formulaire de réservation.
13. Vérification de conflits.
14. Validation/refus.
15. Notifications e-mail.
16. Tableau de bord utilisateur.
17. Tableau de bord administrateur.
18. Statistiques simples.
19. Export CSV/PDF simple.
20. Seed de démonstration.

---

## 15. Fonctionnalités version 2

- WhatsApp Business API.
- QR code par ressource.
- Liste d’attente.
- Réservations récurrentes.
- Incidents avec photo.
- Maintenance planifiée.
- Évaluation après usage.
- Rapports automatiques.
- Import CSV utilisateurs.
- Export Excel.
- PWA installable.

---

## 16. Fonctionnalités version 3

- Paiement Mobile Money : Orange Money, MTN, Moov, Wave.
- IA de recommandation.
- Prévision des pics d’usage.
- API publique.
- Réservation inter-organisation.
- Cartographie des ressources.
- Supervision nationale.
- Application mobile native.
- Badges et gamification.

---

## 17. Critères d’acceptation

L’application est acceptable si :

- aucune double réservation impossible n’est acceptée ;
- une ressource indisponible est clairement signalée en rouge ;
- une demande en attente est signalée en orange ;
- une ressource disponible est signalée en vert ;
- le logo EduWeb Booking est bien intégré ;
- le vert bouteille EduWeb domine l’identité visuelle ;
- l’interface est belle, claire et responsive ;
- un utilisateur peut réserver une ressource ;
- un responsable peut valider ou refuser ;
- un administrateur peut créer des catégories et ressources ;
- les notifications e-mail fonctionnent ;
- les statistiques de base sont visibles ;
- les données sont isolées par organisation ;
- le code est propre, typé et maintenable ;
- le projet démarre avec `npm install`, `npx prisma migrate dev`, `npm run dev`.

---

## 18. Commandes attendues

Prévoir dans `package.json` :

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts",
    "test": "vitest"
  }
}
```

---

## 19. Variables d’environnement

Créer `.env.example` :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eduweb_booking"
NEXTAUTH_SECRET="change-me"
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASSWORD="password"
SMTP_FROM="EduWeb Booking <no-reply@eduweb.ci>"
WHATSAPP_API_URL=""
WHATSAPP_API_TOKEN=""
```

---

## 20. Docker

Prévoir :

- `Dockerfile` ;
- `docker-compose.yml` avec PostgreSQL ;
- volume de persistance ;
- instructions de déploiement.

---

## 21. Design détaillé des écrans importants

### 21.1 Page d’accueil

- Header blanc avec logo à gauche.
- Boutons : Fonctionnalités, Tarifs, Démo, Connexion.
- Hero avec fond vert bouteille très doux ou blanc.
- Grand titre en vert bouteille.
- Cartes flottantes : calendrier, statut, réservation confirmée.
- CTA principal vert bouteille.
- CTA secondaire contour vert.
- Illustration de calendrier avec points vert/orange/rouge/violet.

### 21.2 Dashboard

- Sidebar vert bouteille.
- Logo en haut.
- Icônes blanches.
- Contenu sur fond gris clair.
- Cartes blanches arrondies.
- KPIs en haut.
- Graphiques propres.
- Liste des réservations du jour.

### 21.3 Catalogue des ressources

- Filtres en haut : catégorie, site, statut, capacité.
- Grille de tuiles.
- Tuiles avec ombre légère.
- Badge de statut.
- Bouton rapide “Réserver”.

### 21.4 Formulaire de réservation

- Formulaire en stepper.
- Résumé à droite.
- Alerte si conflit.
- Proposition alternative si indisponible.
- Bouton final “Soumettre la demande”.

### 21.5 Calendrier

- Vue mensuelle par défaut.
- Code couleur statut.
- Tooltip au survol.
- Panneau latéral de détail.

---

## 22. Microcopy recommandée

Messages UX :

```text
Votre demande de réservation a été enregistrée.
Cette ressource est déjà réservée sur ce créneau.
Un autre créneau est disponible à proximité.
Votre réservation est en attente de validation.
La réservation a été validée avec succès.
La réservation a été refusée. Consultez le motif ci-dessous.
Cette ressource est momentanément indisponible.
Aucune ressource ne correspond aux filtres sélectionnés.
```

---

## 23. Documentation à générer

Claude Code doit créer :

- `README.md` avec installation ;
- guide de configuration `.env` ;
- guide seed ;
- guide rôles et permissions ;
- guide déploiement Docker ;
- brève documentation utilisateur dans `/docs`.

---

## 24. Tests

Prévoir tests unitaires sur :

- détection de chevauchement ;
- génération de code réservation ;
- permissions ;
- validation des formulaires ;
- logique de disponibilité.

Prévoir tests E2E optionnels :

- connexion ;
- création ressource ;
- réservation ;
- validation ;
- refus.

---

## 25. Priorité absolue de qualité

Ne pas produire une interface basique. L’application doit être réellement séduisante, moderne et professionnelle.

La première impression doit donner l’image d’un produit SaaS sérieux, national, extensible et commercialisable.

Points essentiels :

- logo bien intégré ;
- vert bouteille EduWeb dominant ;
- police arrondie ;
- cartes élégantes ;
- calendrier propre ;
- statistiques visuelles ;
- mobile impeccable ;
- zéro surcharge ;
- expérience fluide ;
- messages clairs ;
- cohérence graphique.

---

## 26. Résumé final pour Claude Code

Construis **EduWeb Booking** comme une application web SaaS Node.js/Next.js moderne permettant à des organisations de gérer toutes leurs ressources réservables. Commence par un seed ENS d’Abidjan/APRID pour les salles multimédias, mais rends toute la plateforme générique et extensible. Respecte la charte vert bouteille EduWeb, blanc, gris clair, vert/orange/rouge/violet pour les statuts. Utilise une police légèrement arrondie. Intègre le logo fourni. Fournis un produit complet, beau, ergonomique, professionnel, sécurisé, multi-tenant, responsive, avec réservations, validations, calendrier, notifications e-mail, tableaux de bord, statistiques et base prête pour WhatsApp, QR code, maintenance, incidents, paiement et IA.

