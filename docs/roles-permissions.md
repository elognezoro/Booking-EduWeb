# Rôles & permissions — EduWeb Booking

L'accès est contrôlé par un système **RBAC** (Role-Based Access Control). Chaque rôle dispose d'un
ensemble de permissions ; l'interface masque automatiquement les éléments interdits, et chaque
action serveur vérifie la permission requise (`requirePermission`).

## Les 7 rôles

| Rôle | Description |
|---|---|
| **SUPER_ADMIN** | Super Administrateur EduWeb — supervise la plateforme et les organisations abonnées. |
| **ORG_ADMIN** | Administrateur d'organisation — gère utilisateurs, ressources, règles, paramètres. |
| **RESOURCE_MANAGER** | Responsable de ressource — gère ses ressources et valide les demandes. |
| **VALIDATOR** | Validateur hiérarchique — approuve ou refuse les demandes. |
| **REQUESTER** | Utilisateur demandeur — réserve et suit ses demandes. |
| **TECHNICIAN** | Technicien — incidents et maintenance. |
| **VISITOR** | Visiteur externe — consultation limitée. |

## Permissions

Catalogue (clé → libellé) défini dans `lib/permissions.ts` :

`organization.manage`, `users.manage`, `roles.manage`, `sites.manage`, `departments.manage`,
`resource_categories.manage`, `resources.create|read|update|delete`,
`bookings.create|read_all|read_own|validate|reject|cancel_own|cancel_all|reschedule`,
`calendar.read`, `statistics.read`, `reports.export`, `incidents.manage`, `maintenance.manage`,
`settings.manage`, `platform.manage`.

## Matrice

La matrice complète (rôle × permission) est consultable dans l'application :
**Administration › Rôles & permissions** (`/dashboard/admin/roles`).

Résumé :

| Permission | SUPER | ADMIN | MANAGER | VALIDATOR | REQUESTER | TECH | VISITOR |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Réserver | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Voir toutes les réservations | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| Valider / Refuser | ✅ | ✅ | ✅ | ✅ | — | — | — |
| Gérer ressources | ✅ | ✅ | ✅ (maj) | — | — | — | — |
| Gérer utilisateurs | ✅ | ✅ | — | — | — | — | — |
| Statistiques | ✅ | ✅ | ✅ | ✅ | — | — | — |
| Incidents / Maintenance | ✅ | ✅ | ✅ | — | — | ✅ | — |
| Superviser la plateforme | ✅ | — | — | — | — | — | — |

> La matrice détaillée fait foi : voir `ROLE_PERMISSIONS` dans `lib/permissions.ts`.
