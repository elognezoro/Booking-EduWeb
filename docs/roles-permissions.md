# Rôles & permissions — EduWeb Booking

L'accès est contrôlé par un système **RBAC** (Role-Based Access Control). Chaque rôle dispose d'un
ensemble de permissions ; l'interface masque automatiquement les éléments interdits, et chaque
action serveur vérifie la permission requise (`requirePermission`).

## Les 12 rôles

| Rôle | Description |
|---|---|
| **SUPER_ADMIN** | Super Administrateur EduWeb — supervise la plateforme et les organisations abonnées. |
| **ORG_ADMIN** | Administrateur d'organisation — gère utilisateurs, ressources, règles, paramètres. |
| **RESOURCE_MANAGER** | Responsable de ressource — gère ses ressources et valide les demandes. |
| **VALIDATOR** | Validateur hiérarchique — approuve ou refuse les demandes. |
| **REQUESTER** | Utilisateur demandeur — réserve et suit ses demandes. |
| **ENSEIGNANT_CHERCHEUR** | Enseignant-chercheur — réserve les ressources pédagogiques, dépose des publications et émet des avis scientifiques. |
| **TECHNICIAN** | Technicien — incidents et maintenance. |
| **VISITOR** | Visiteur externe — consultation limitée. |
| **LIBRARIAN** | Bibliothécaire / Documentaliste — vérifie, valide, publie ou archive les dépôts documentaires. |
| **DEPOSITOR** | Déposant — dépose des ressources documentaires et suit leur statut. |
| **SCIENTIFIC_VALIDATOR** | Validateur scientifique — émet un avis scientifique sur un mémoire, article ou rapport. |
| **READER** | Lecteur interne — consulte les ressources documentaires autorisées de son organisation. |

## Permissions

Catalogue (clé → libellé) défini dans `lib/permissions.ts` :

`organization.manage`, `users.manage`, `roles.manage`, `sites.manage`, `departments.manage`,
`resource_categories.manage`, `resources.create|read|update|delete`,
`bookings.create|read_all|read_own|validate|reject|cancel_own|cancel_all|reschedule`,
`calendar.read`, `statistics.read`, `reports.export`, `incidents.manage`, `maintenance.manage`,
`settings.manage`, `platform.manage`,
`library.manage`, `documents.read|create|review|science_review|download|reserve`, `library.statistics`,
`finances.read|manage`, `scolarite.read|manage`.

## Matrice

La matrice complète (rôle × permission) est consultable et **modifiable** dans l'application :
**Administration › Rôles & permissions** (`/dashboard/admin/roles`) — réglage global par le
super administrateur, personnalisable par établissement par l'admin délégué.

> La matrice détaillée fait foi : voir `ROLE_PERMISSIONS` dans `lib/permissions.ts` (valeurs par
> défaut), surchargées le cas échéant par `RolePermissionSet` (global) puis `OrgRolePermissionSet`
> (par établissement).
