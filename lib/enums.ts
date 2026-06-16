// EduWeb Booking — "Enums" applicatifs (SQLite stocke des String).
// Chaque enum fournit ses valeurs, un libellé FR et une intention visuelle.

export type Tone = "available" | "pending" | "unavailable" | "advanced" | "neutral" | "info";

export interface LabelMeta {
  label: string;
  tone: Tone;
  description?: string;
}

/* ------------------------------------------------------------------ */
/* Rôles                                                               */
/* ------------------------------------------------------------------ */
export const ROLES = [
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "RESOURCE_MANAGER",
  "VALIDATOR",
  "REQUESTER",
  "TECHNICIAN",
  "VISITOR",
  // EduWeb Booking Library
  "LIBRARIAN",
  "DEPOSITOR",
  "SCIENTIFIC_VALIDATOR",
  "READER",
] as const;
export type RoleKey = (typeof ROLES)[number];

export const ROLE_META: Record<RoleKey, LabelMeta & { color: string }> = {
  SUPER_ADMIN: { label: "Super Administrateur EduWeb", tone: "advanced", color: "#172554", description: "Supervision de la plateforme et des organisations abonnées." },
  ORG_ADMIN: { label: "Administrateur d'organisation", tone: "advanced", color: "#6D5DF5", description: "Gère l'organisation : utilisateurs, ressources, règles, paramètres." },
  RESOURCE_MANAGER: { label: "Responsable de ressource", tone: "available", color: "#0B5A45", description: "Gère ses ressources et valide les demandes associées." },
  VALIDATOR: { label: "Validateur hiérarchique", tone: "pending", color: "#F97316", description: "Approuve ou refuse les demandes de réservation." },
  REQUESTER: { label: "Utilisateur demandeur", tone: "info", color: "#064B3A", description: "Réserve des ressources et suit ses demandes." },
  TECHNICIAN: { label: "Technicien / agent d'appui", tone: "neutral", color: "#475569", description: "Traite les incidents et la maintenance des ressources." },
  VISITOR: { label: "Visiteur externe", tone: "neutral", color: "#94A3B8", description: "Accès en consultation limité (ressources publiques)." },
  LIBRARIAN: { label: "Bibliothécaire / Documentaliste", tone: "info", color: "#0891B2", description: "Vérifie, complète, valide, publie ou archive les dépôts documentaires." },
  DEPOSITOR: { label: "Déposant", tone: "available", color: "#0B5A45", description: "Dépose des ressources documentaires et suit leur statut." },
  SCIENTIFIC_VALIDATOR: { label: "Validateur scientifique", tone: "advanced", color: "#6D5DF5", description: "Émet un avis scientifique sur un mémoire, article ou rapport." },
  READER: { label: "Lecteur interne", tone: "neutral", color: "#475569", description: "Consulte les ressources documentaires autorisées de son organisation." },
};

/* ------------------------------------------------------------------ */
/* Statut utilisateur                                                  */
/* ------------------------------------------------------------------ */
export const USER_STATUS = ["ACTIVE", "INACTIVE", "SUSPENDED", "INVITED", "PENDING"] as const;
export type UserStatus = (typeof USER_STATUS)[number];
export const USER_STATUS_META: Record<UserStatus, LabelMeta> = {
  ACTIVE: { label: "Actif", tone: "available" },
  INACTIVE: { label: "Inactif", tone: "neutral" },
  SUSPENDED: { label: "Suspendu", tone: "unavailable" },
  INVITED: { label: "Invité", tone: "pending" },
  PENDING: { label: "En attente de validation", tone: "pending" },
};

/* ------------------------------------------------------------------ */
/* Statut ressource                                                    */
/* ------------------------------------------------------------------ */
export const RESOURCE_STATUS = [
  "AVAILABLE",
  "PARTIALLY_AVAILABLE",
  "RESERVED",
  "UNAVAILABLE",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
  "ARCHIVED",
] as const;
export type ResourceStatus = (typeof RESOURCE_STATUS)[number];
export const RESOURCE_STATUS_META: Record<ResourceStatus, LabelMeta> = {
  AVAILABLE: { label: "Disponible", tone: "available" },
  PARTIALLY_AVAILABLE: { label: "Partiellement disponible", tone: "pending" },
  RESERVED: { label: "Réservée", tone: "info" },
  UNAVAILABLE: { label: "Indisponible", tone: "unavailable" },
  MAINTENANCE: { label: "En maintenance", tone: "advanced" },
  OUT_OF_SERVICE: { label: "Hors service", tone: "unavailable" },
  ARCHIVED: { label: "Archivée", tone: "neutral" },
};

/* ------------------------------------------------------------------ */
/* Statut réservation                                                  */
/* ------------------------------------------------------------------ */
export const BOOKING_STATUS = [
  "DRAFT",
  "SUBMITTED",
  "PENDING_VALIDATION",
  "APPROVED",
  "REJECTED",
  "CANCELLED_BY_USER",
  "CANCELLED_BY_ADMIN",
  "RESCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "NO_SHOW",
  "CLOSED_WITH_INCIDENT",
  "CLOSED_WITHOUT_INCIDENT",
] as const;
export type BookingStatus = (typeof BOOKING_STATUS)[number];
export const BOOKING_STATUS_META: Record<BookingStatus, LabelMeta> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  SUBMITTED: { label: "Soumise", tone: "pending" },
  PENDING_VALIDATION: { label: "En attente de validation", tone: "pending" },
  APPROVED: { label: "Validée", tone: "available" },
  REJECTED: { label: "Refusée", tone: "unavailable" },
  CANCELLED_BY_USER: { label: "Annulée (usager)", tone: "neutral" },
  CANCELLED_BY_ADMIN: { label: "Annulée (admin)", tone: "neutral" },
  RESCHEDULED: { label: "Reportée", tone: "info" },
  IN_PROGRESS: { label: "En cours", tone: "advanced" },
  COMPLETED: { label: "Terminée", tone: "available" },
  NO_SHOW: { label: "Non honorée", tone: "unavailable" },
  CLOSED_WITH_INCIDENT: { label: "Clôturée avec incident", tone: "unavailable" },
  CLOSED_WITHOUT_INCIDENT: { label: "Clôturée sans incident", tone: "available" },
};

// Statuts qui bloquent un créneau (conflit potentiel)
export const BLOCKING_BOOKING_STATUS: BookingStatus[] = [
  "SUBMITTED",
  "PENDING_VALIDATION",
  "APPROVED",
  "RESCHEDULED",
  "IN_PROGRESS",
];

/* ------------------------------------------------------------------ */
/* Type d'usage                                                        */
/* ------------------------------------------------------------------ */
export const USAGE_TYPES = [
  "INDIVIDUAL",
  "COLLECTIVE",
  "PEDAGOGICAL",
  "ADMINISTRATIVE",
  "TECHNICAL",
  "EVENT",
  "TRAINING",
  "MEETING",
  "MAINTENANCE",
  "EXAM",
  "CONFERENCE",
  "DEFENSE",
  "OTHER",
] as const;
export type UsageType = (typeof USAGE_TYPES)[number];
export const USAGE_TYPE_LABELS: Record<UsageType, string> = {
  INDIVIDUAL: "Individuel",
  COLLECTIVE: "Collectif",
  PEDAGOGICAL: "Pédagogique",
  ADMINISTRATIVE: "Administratif",
  TECHNICAL: "Technique",
  EVENT: "Événement",
  TRAINING: "Formation",
  MEETING: "Réunion",
  MAINTENANCE: "Maintenance",
  EXAM: "Examen",
  CONFERENCE: "Conférence",
  DEFENSE: "Soutenance",
  OTHER: "Autre",
};

/* ------------------------------------------------------------------ */
/* Mode de validation                                                  */
/* ------------------------------------------------------------------ */
export const VALIDATION_MODES = ["AUTO", "SIMPLE", "HIERARCHICAL", "MULTI_LEVEL", "CONDITIONAL"] as const;
export type ValidationMode = (typeof VALIDATION_MODES)[number];
export const VALIDATION_MODE_LABELS: Record<ValidationMode, string> = {
  AUTO: "Automatique",
  SIMPLE: "Validation simple",
  HIERARCHICAL: "Validation hiérarchique",
  MULTI_LEVEL: "Validation à plusieurs niveaux",
  CONDITIONAL: "Validation conditionnelle",
};

/* ------------------------------------------------------------------ */
/* Mode de réservation d'une ressource                                 */
/* ------------------------------------------------------------------ */
export type BookingMode = "exclusive" | "partial" | "mixed";

export interface ResourceRules {
  bookingMode: BookingMode;
  maxDurationMinutes?: number;
  minNoticeHours?: number;
  requiresValidation?: boolean;
  seatBased?: boolean; // réservation poste par poste (plan de salle)
}

export const DEFAULT_RESOURCE_RULES: ResourceRules = {
  bookingMode: "exclusive",
  maxDurationMinutes: 10080, // 7 jours — autorise les réservations sur plusieurs jours
  minNoticeHours: 1,
  requiresValidation: true,
};

/* ------------------------------------------------------------------ */
/* Plans d'abonnement                                                  */
/* ------------------------------------------------------------------ */
export const PLANS = ["PILOTE", "STANDARD", "PREMIUM", "NATIONAL"] as const;
export type Plan = (typeof PLANS)[number];
export const PLAN_LABELS: Record<Plan, string> = {
  PILOTE: "Pilote",
  STANDARD: "Standard",
  PREMIUM: "Premium",
  NATIONAL: "National",
};

/* ------------------------------------------------------------------ */
/* Champs dynamiques de catégorie                                      */
/* ------------------------------------------------------------------ */
export const DYNAMIC_FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "date",
  "time",
  "select",
  "checkbox",
  "file",
  "url",
  "amount",
  "boolean",
] as const;
export type DynamicFieldType = (typeof DYNAMIC_FIELD_TYPES)[number];

export interface DynamicField {
  key: string;
  label: string;
  type: DynamicFieldType;
  required?: boolean;
  options?: string[];
}

/* Helpers de présentation */
export function bookingStatusMeta(status: string): LabelMeta {
  return BOOKING_STATUS_META[status as BookingStatus] ?? { label: status, tone: "neutral" };
}
export function resourceStatusMeta(status: string): LabelMeta {
  return RESOURCE_STATUS_META[status as ResourceStatus] ?? { label: status, tone: "neutral" };
}
export function roleMeta(key: string) {
  return ROLE_META[key as RoleKey] ?? { label: key, tone: "neutral" as Tone, color: "#475569" };
}
