import type { RoleKey } from "./enums";

// Catalogue complet des permissions (réf. spec §5.6).
export const PERMISSIONS = [
  "organization.manage",
  "users.manage",
  "roles.manage",
  "sites.manage",
  "departments.manage",
  "resource_categories.manage",
  "resources.create",
  "resources.read",
  "resources.update",
  "resources.delete",
  "bookings.create",
  "bookings.read_all",
  "bookings.read_own",
  "bookings.validate",
  "bookings.reject",
  "bookings.cancel_own",
  "bookings.cancel_all",
  "bookings.reschedule",
  "calendar.read",
  "statistics.read",
  "reports.export",
  "incidents.manage",
  "maintenance.manage",
  "settings.manage",
  "platform.manage", // Super Admin EduWeb uniquement
  // ---- EduWeb Booking Library ----
  "library.manage", // configurer bibliothèques, collections, domaines, règles d'accès
  "documents.read",
  "documents.create", // déposer
  "documents.review", // valider / corriger / rejeter / publier / archiver
  "documents.science_review", // avis scientifique
  "documents.download",
  "documents.reserve",
  "library.statistics",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_LABELS: Record<Permission, string> = {
  "organization.manage": "Gérer l'organisation",
  "users.manage": "Gérer les utilisateurs",
  "roles.manage": "Gérer les rôles",
  "sites.manage": "Gérer les sites",
  "departments.manage": "Gérer les services",
  "resource_categories.manage": "Gérer les catégories",
  "resources.create": "Créer des ressources",
  "resources.read": "Consulter les ressources",
  "resources.update": "Modifier des ressources",
  "resources.delete": "Supprimer des ressources",
  "bookings.create": "Créer des réservations",
  "bookings.read_all": "Voir toutes les réservations",
  "bookings.read_own": "Voir ses réservations",
  "bookings.validate": "Valider des réservations",
  "bookings.reject": "Refuser des réservations",
  "bookings.cancel_own": "Annuler ses réservations",
  "bookings.cancel_all": "Annuler toute réservation",
  "bookings.reschedule": "Reporter des réservations",
  "calendar.read": "Consulter le calendrier",
  "statistics.read": "Consulter les statistiques",
  "reports.export": "Exporter des rapports",
  "incidents.manage": "Gérer les incidents",
  "maintenance.manage": "Gérer la maintenance",
  "settings.manage": "Gérer les paramètres",
  "platform.manage": "Superviser la plateforme",
  "library.manage": "Gérer la bibliothèque (collections, domaines)",
  "documents.read": "Consulter les documents",
  "documents.create": "Déposer des documents",
  "documents.review": "Valider / publier des documents",
  "documents.science_review": "Émettre un avis scientifique",
  "documents.download": "Télécharger des documents",
  "documents.reserve": "Réserver / emprunter des documents",
  "library.statistics": "Consulter les statistiques de la bibliothèque",
};

// Matrice rôle -> permissions.
const ALL: Permission[] = [...PERMISSIONS];

export const ROLE_PERMISSIONS: Record<RoleKey, Permission[]> = {
  SUPER_ADMIN: ALL,
  ORG_ADMIN: [
    "organization.manage",
    "users.manage",
    "roles.manage",
    "sites.manage",
    "departments.manage",
    "resource_categories.manage",
    "resources.create",
    "resources.read",
    "resources.update",
    "resources.delete",
    "bookings.create",
    "bookings.read_all",
    "bookings.read_own",
    "bookings.validate",
    "bookings.reject",
    "bookings.cancel_own",
    "bookings.cancel_all",
    "bookings.reschedule",
    "calendar.read",
    "statistics.read",
    "reports.export",
    "incidents.manage",
    "maintenance.manage",
    "settings.manage",
    "library.manage",
    "documents.read",
    "documents.create",
    "documents.review",
    "documents.download",
    "documents.reserve",
    "library.statistics",
  ],
  RESOURCE_MANAGER: [
    "resources.create",
    "resources.read",
    "resources.update",
    "bookings.create",
    "bookings.read_all",
    "bookings.read_own",
    "bookings.validate",
    "bookings.reject",
    "bookings.reschedule",
    "bookings.cancel_own",
    "calendar.read",
    "statistics.read",
    "reports.export",
    "incidents.manage",
    "maintenance.manage",
    "documents.read",
    "documents.download",
  ],
  VALIDATOR: [
    "resources.read",
    "bookings.create",
    "bookings.read_all",
    "bookings.read_own",
    "bookings.validate",
    "bookings.reject",
    "bookings.reschedule",
    "bookings.cancel_own",
    "calendar.read",
    "statistics.read",
    "documents.read",
    "documents.download",
  ],
  REQUESTER: [
    "resources.read",
    "bookings.create",
    "bookings.read_own",
    "bookings.cancel_own",
    "calendar.read",
    "documents.read",
    "documents.create",
    "documents.download",
    "documents.reserve",
  ],
  TECHNICIAN: [
    "resources.read",
    "bookings.read_all",
    "calendar.read",
    "incidents.manage",
    "maintenance.manage",
    "documents.read",
  ],
  VISITOR: ["resources.read", "calendar.read", "documents.read"],
  // ---- EduWeb Booking Library ----
  LIBRARIAN: [
    "library.manage",
    "documents.read",
    "documents.create",
    "documents.review",
    "documents.download",
    "documents.reserve",
    "library.statistics",
    "calendar.read",
  ],
  DEPOSITOR: [
    "documents.read",
    "documents.create",
    "documents.download",
    "documents.reserve",
  ],
  SCIENTIFIC_VALIDATOR: [
    "documents.read",
    "documents.science_review",
    "documents.download",
  ],
  READER: ["documents.read", "documents.download", "documents.reserve"],
};

export function permissionsForRoles(roleKeys: string[]): Set<Permission> {
  const set = new Set<Permission>();
  for (const key of roleKeys) {
    const perms = ROLE_PERMISSIONS[key as RoleKey];
    if (perms) perms.forEach((p) => set.add(p));
  }
  return set;
}

export function can(roleKeys: string[], permission: Permission): boolean {
  return permissionsForRoles(roleKeys).has(permission);
}

export function canAny(roleKeys: string[], permissions: Permission[]): boolean {
  const set = permissionsForRoles(roleKeys);
  return permissions.some((p) => set.has(p));
}
