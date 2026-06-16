// EduWeb Booking Library — "enums" applicatifs (stockés en String, SQLite).
import type { LabelMeta, Tone } from "@/lib/enums";

/* ------------------------------------------------------------------ */
/* Types documentaires                                                 */
/* ------------------------------------------------------------------ */
export const DOCUMENT_TYPES = [
  "MEM", "ART", "THS", "RAP", "RST", "LIV", "CHO", "COM",
  "ACT", "ANN", "REV", "SUP", "GUI", "MAN", "ADM", "ARC",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  MEM: "Mémoire",
  ART: "Article scientifique",
  THS: "Thèse",
  RAP: "Rapport",
  RST: "Rapport de stage",
  LIV: "Livre",
  CHO: "Chapitre d'ouvrage",
  COM: "Communication",
  ACT: "Actes de colloque",
  ANN: "Annale",
  REV: "Revue",
  SUP: "Support pédagogique",
  GUI: "Guide",
  MAN: "Manuel",
  ADM: "Document administratif",
  ARC: "Archive",
};

/* ------------------------------------------------------------------ */
/* Statuts documentaires                                               */
/* ------------------------------------------------------------------ */
export const DOCUMENT_STATUS = [
  "DRAFT", "SUBMITTED", "UNDER_REVIEW", "NEEDS_CORRECTION", "VALIDATED",
  "PUBLISHED", "RESTRICTED", "CONFIDENTIAL", "EMBARGOED", "ARCHIVED",
  "REJECTED", "REMOVED",
] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUS)[number];

export const DOCUMENT_STATUS_META: Record<DocumentStatus, LabelMeta> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  SUBMITTED: { label: "Soumis", tone: "pending" },
  UNDER_REVIEW: { label: "En vérification", tone: "pending" },
  NEEDS_CORRECTION: { label: "À corriger", tone: "pending" },
  VALIDATED: { label: "Validé", tone: "available" },
  PUBLISHED: { label: "Publié", tone: "available" },
  RESTRICTED: { label: "Restreint", tone: "advanced" },
  CONFIDENTIAL: { label: "Confidentiel", tone: "unavailable" },
  EMBARGOED: { label: "Sous embargo", tone: "advanced" },
  ARCHIVED: { label: "Archivé", tone: "neutral" },
  REJECTED: { label: "Rejeté", tone: "unavailable" },
  REMOVED: { label: "Retiré", tone: "unavailable" },
};

// Statuts considérés comme "visibles dans le catalogue public/interne".
export const VISIBLE_DOCUMENT_STATUS: DocumentStatus[] = ["PUBLISHED", "VALIDATED", "RESTRICTED", "EMBARGOED"];
// Statuts en attente d'action documentaliste.
export const REVIEW_PENDING_STATUS: DocumentStatus[] = ["SUBMITTED", "UNDER_REVIEW", "NEEDS_CORRECTION"];

export function documentStatusMeta(s: string): LabelMeta {
  return DOCUMENT_STATUS_META[s as DocumentStatus] ?? { label: s, tone: "neutral" };
}

/* ------------------------------------------------------------------ */
/* Niveaux d'accès                                                     */
/* ------------------------------------------------------------------ */
export const ACCESS_LEVELS = [
  "PUBLIC", "INTERNAL", "RESTRICTED", "ON_SITE_ONLY", "PHYSICAL_LOAN", "CONFIDENTIAL", "EMBARGO",
] as const;
export type AccessLevel = (typeof ACCESS_LEVELS)[number];

export const ACCESS_LEVEL_META: Record<AccessLevel, LabelMeta> = {
  PUBLIC: { label: "Public", tone: "available", description: "Visible par tous." },
  INTERNAL: { label: "Interne", tone: "info", description: "Membres de l'organisation." },
  RESTRICTED: { label: "Restreint", tone: "pending", description: "Certains rôles ou services." },
  ON_SITE_ONLY: { label: "Consultation sur place", tone: "advanced", description: "Pas de téléchargement." },
  PHYSICAL_LOAN: { label: "Emprunt papier", tone: "advanced", description: "Exemplaire physique empruntable." },
  CONFIDENTIAL: { label: "Confidentiel", tone: "unavailable", description: "Administrateurs uniquement." },
  EMBARGO: { label: "Embargo", tone: "advanced", description: "Visible après une date définie." },
};

export function accessLevelMeta(a: string): LabelMeta {
  return ACCESS_LEVEL_META[a as AccessLevel] ?? { label: a, tone: "neutral" };
}

/* ------------------------------------------------------------------ */
/* Réservations & emprunts documentaires                               */
/* ------------------------------------------------------------------ */
export const RESERVATION_TYPES = ["ON_SITE", "LOAN", "ACCESS_REQUEST"] as const;
export type ReservationType = (typeof RESERVATION_TYPES)[number];
export const RESERVATION_TYPE_LABELS: Record<ReservationType, string> = {
  ON_SITE: "Consultation sur place",
  LOAN: "Emprunt physique",
  ACCESS_REQUEST: "Demande d'accès",
};

export const RESERVATION_STATUS = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "FULFILLED"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUS)[number];
export const RESERVATION_STATUS_META: Record<ReservationStatus, LabelMeta> = {
  PENDING: { label: "En attente", tone: "pending" },
  APPROVED: { label: "Approuvée", tone: "available" },
  REJECTED: { label: "Refusée", tone: "unavailable" },
  CANCELLED: { label: "Annulée", tone: "neutral" },
  FULFILLED: { label: "Honorée", tone: "available" },
};

export const LOAN_STATUS = ["BORROWED", "RETURNED", "OVERDUE", "LOST"] as const;
export type LoanStatus = (typeof LOAN_STATUS)[number];
export const LOAN_STATUS_META: Record<LoanStatus, LabelMeta> = {
  BORROWED: { label: "Emprunté", tone: "advanced" },
  RETURNED: { label: "Rendu", tone: "available" },
  OVERDUE: { label: "En retard", tone: "unavailable" },
  LOST: { label: "Perdu", tone: "unavailable" },
};

/* ------------------------------------------------------------------ */
/* Valeurs initiales configurables                                     */
/* ------------------------------------------------------------------ */
export const DEFAULT_COLLECTIONS: { code: string; name: string }[] = [
  { code: "MEM", name: "Mémoires" },
  { code: "ART", name: "Articles scientifiques" },
  { code: "RAP", name: "Rapports" },
  { code: "ANN", name: "Annales" },
  { code: "LIV", name: "Livres" },
  { code: "REV", name: "Revues" },
  { code: "ARC", name: "Archives" },
  { code: "SUP", name: "Supports pédagogiques" },
  { code: "PUB", name: "Publications institutionnelles" },
  { code: "ADM", name: "Documents administratifs" },
];

export const DEFAULT_DOMAINS: { code: string; name: string }[] = [
  { code: "TICE", name: "Technologies éducatives" },
  { code: "SED", name: "Sciences de l'éducation" },
  { code: "PED", name: "Pédagogie" },
  { code: "DID", name: "Didactique" },
  { code: "EVAL", name: "Évaluation" },
  { code: "GOUV", name: "Gouvernance" },
  { code: "ADS", name: "Administration scolaire" },
  { code: "CHIM", name: "Chimie" },
  { code: "PHYS", name: "Physique" },
  { code: "MATH", name: "Mathématiques" },
  { code: "SVT", name: "Sciences de la vie et de la Terre" },
  { code: "INFO", name: "Informatique" },
  { code: "IA", name: "Intelligence artificielle" },
  { code: "ENV", name: "Environnement" },
  { code: "SANT", name: "Santé" },
  { code: "DROIT", name: "Droit" },
  { code: "SOC", name: "Sciences sociales" },
  { code: "DOC", name: "Documentation" },
];

export const DOCUMENT_LANGUAGES = ["Français", "Anglais", "Espagnol", "Arabe", "Autre"] as const;
