# EduWeb Booking

**Plateforme intelligente de réservation des ressources pour organisations.**

EduWeb Booking centralise les réservations de salles, matériels, véhicules, services, documents
et espaces. Application web SaaS multi-organisation, généraliste et extensible — premier pilote :
**ENS d'Abidjan · Sous-Direction APRID** (salles multimédias).

![EduWeb Booking](public/brand/logo-eduweb-booking.png)

---

## ✨ Fonctionnalités (MVP)

- 🏠 **Site public** moderne : accueil, fonctionnalités, tarifs, démo, contact.
- 🔐 **Authentification** par e-mail/mot de passe (JWT sécurisé, sessions httpOnly).
- 🛡️ **7 rôles & 25 permissions** — l'interface masque ce qui n'est pas autorisé (RBAC).
- 🏛️ **Multi-organisation** : sites, services, isolation des données par `organizationId`.
- 📦 **Ressources génériques & configurables** : catégories, champs, règles de réservation.
- 📅 **Réservation en étapes** avec détection de conflits et suggestion de créneau alternatif.
- ✅ **Validation** : approbation/refus avec motif et notifications e-mail.
- 🗓️ **Calendrier** mensuel coloré par statut.
- 📊 **Statistiques** : KPI, courbes, répartitions (Recharts).
- 📄 **Rapports** : export CSV et aperçu imprimable (PDF via navigateur).
- 🔔 **Notifications** internes + e-mail (Nodemailer, journalisé en l'absence de SMTP).
- 🧱 Base prête pour : QR code, incidents, maintenance, évaluations, WhatsApp, Mobile Money.

### 📚 Module EduWeb Booking Library (bibliothèque numérique)

- Dépôt guidé (assistant en étapes) de mémoires, articles, thèses, rapports, annales, livres, supports…
- **Codification automatique** : code provisoire au dépôt, code long + court définitifs à la validation
  (`EBL-CI-ENS-APRID-MEM-MEM-TICE-2026-00001` / `MEM-TICE-2026-001`), compteurs anti-collision.
- Validation documentaire : vérifier, corriger, valider, publier, archiver, rejeter ; **avis scientifique**.
- **Détection de doublons** (titre/auteur/année/DOI/hash de fichier) avec alertes.
- Recherche & filtres (type, collection, domaine, accès), fiches complètes, **QR code par document**.
- **Niveaux d'accès** (public, interne, restreint, sur place, emprunt, confidentiel, embargo) appliqués
  côté serveur (fiche, fichier, téléchargement) ; demandes d'accès.
- Réservation documentaire (consultation sur place / emprunt physique) + suivi des emprunts.
- Citation **APA**, statistiques de consultation/téléchargement/dépôts, collections & domaines configurables.
- Rôles dédiés : Bibliothécaire/Documentaliste, Déposant, Validateur scientifique, Lecteur interne.

---

## 🧰 Stack technique

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · **SQLite** (dev) / PostgreSQL (prod) ·
Auth JWT (`jose` + `bcryptjs`) · Zod · React Hook Form · Recharts · Lucide · date-fns · Nodemailer.

---

## 🚀 Démarrage rapide (Windows / macOS / Linux)

> Prérequis : **Node.js 18+**. Aucune base de données à installer : le développement utilise SQLite.

```bash
npm install        # installe les dépendances
npm run setup      # prisma generate + db push + seed de démonstration
npm run dev        # démarre sur http://localhost:3000
```

Puis ouvrez **http://localhost:3000**.

> `npm run setup` est un raccourci pour `prisma generate && prisma db push && tsx prisma/seed.ts`.
> Pour réinitialiser les données de démo : `npm run db:reset`.

---

## 👥 Comptes de démonstration

Mot de passe commun : **`password123`**

| Rôle | E-mail |
|---|---|
| Super Administrateur EduWeb | `superadmin@eduweb.ci` |
| Administrateur d'organisation | `admin.aprid@ens.ci` |
| Responsable de ressource | `responsable.salles@ens.ci` |
| Validateur | `validateur.aprid@ens.ci` |
| Technicien | `technicien.aprid@ens.ci` |
| Utilisateur demandeur | `enseignant.demo@ens.ci` |
| Bibliothécaire / Documentaliste | `documentaliste.aprid@ens.ci` |
| Déposant (bibliothèque) | `deposant.demo@ens.ci` |
| Validateur scientifique | `validateur.scientifique@ens.ci` |
| Lecteur interne | `lecteur.demo@ens.ci` |

La page **/login** propose des boutons de connexion rapide.

---

## ⚙️ Variables d'environnement

Copier `.env.example` → `.env` puis ajuster si besoin. Variables clés :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | `file:./dev.db` (SQLite) ou URL PostgreSQL en prod. |
| `AUTH_SECRET` | Secret de signature des sessions JWT (≥ 32 caractères). |
| `APP_URL` | URL publique de l'application. |
| `SMTP_*` | Paramètres e-mail. **Si vides, les e-mails sont journalisés en console.** |

---

## 🗄️ Base de données

Le projet utilise **SQLite** par défaut pour un démarrage sans configuration.
SQLite ne supportant ni les enums Prisma natifs ni le type `Json`, ceux-ci sont modélisés en
`String` (validés par Zod côté applicatif — voir `lib/enums.ts`).

### Passer à PostgreSQL (production)

1. Modifier `prisma/schema.prisma` : `provider = "postgresql"`.
2. Définir `DATABASE_URL` (PostgreSQL).
3. `npx prisma migrate dev` puis `npm run prisma:seed`.

---

## 🐳 Docker (PostgreSQL)

```bash
docker compose up --build
```

Démarre PostgreSQL + l'application sur le port 3000. Voir `docker-compose.yml`.

---

## 🧪 Tests

```bash
npm run test       # tests unitaires (chevauchement, fenêtre de réservation, permissions)
npm run typecheck  # vérification TypeScript
```

---

## 📁 Structure

```
app/            Routes (public, auth, dashboard, api), server actions
components/     UI, brand, dashboard, resources, bookings, calendar, statistics
lib/            auth, prisma, permissions, booking-rules, mail, stats, dates, enums
prisma/         schema.prisma + seed.ts
docs/           documentation utilisateur & rôles
```

---

## 📚 Documentation

- [Guide utilisateur](docs/utilisateur.md)
- [Rôles & permissions](docs/roles-permissions.md)

---

## 🗺️ Feuille de route

- **V2** : WhatsApp Business, QR code par ressource, réservations récurrentes, incidents avec photo,
  maintenance planifiée, évaluations, export Excel, PWA.
- **V3** : paiement Mobile Money (Orange/MTN/Moov/Wave), IA de recommandation, API publique,
  réservation inter-organisation, supervision nationale, application mobile native.

---

© EduWeb Booking — plateforme intelligente de réservation des ressources, multi-institutions.
