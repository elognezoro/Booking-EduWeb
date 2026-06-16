// EduWeb Booking Library — contrôle d'accès aux documents.
import { VISIBLE_DOCUMENT_STATUS, type AccessLevel } from "./enums";

export interface LibUser {
  id?: string;
  organizationId: string | null;
  permissions: Set<string>;
}

interface DocLike {
  organizationId: string;
  status: string;
  accessLevel: string;
  downloadAllowed: boolean;
  consultationAllowed: boolean;
  physicalCopyAvailable: boolean;
  availablePhysicalCopyCount?: number | null;
  embargoUntil?: Date | string | null;
  createdById?: string | null;
}

export function isLibrarian(user: LibUser | null): boolean {
  return !!user && (user.permissions.has("documents.review") || user.permissions.has("library.manage"));
}

function sameOrg(user: LibUser | null, doc: DocLike): boolean {
  return !!user?.organizationId && user.organizationId === doc.organizationId;
}

function embargoLifted(doc: DocLike): boolean {
  if (!doc.embargoUntil) return true;
  return new Date(doc.embargoUntil) <= new Date();
}

/** Peut voir la fiche (métadonnées) du document. */
export function canViewDocument(user: LibUser | null, doc: DocLike): boolean {
  if (isLibrarian(user) && sameOrg(user, doc)) return true;
  if (user?.id && doc.createdById === user.id) return true; // le déposant voit son dépôt

  const level = doc.accessLevel as AccessLevel;
  // Document public : visible par tous, s'il est publié/validé.
  if (level === "PUBLIC") return VISIBLE_DOCUMENT_STATUS.includes(doc.status as any);
  // Confidentiel : réservé aux gestionnaires (déjà couvert ci-dessus).
  if (level === "CONFIDENTIAL") return false;
  // Autres niveaux : membres de l'organisation, si le statut est visible.
  return sameOrg(user, doc) && VISIBLE_DOCUMENT_STATUS.includes(doc.status as any);
}

/** Exempté de la condition de paiement (bibliothécaire de l'organisation ou déposant du document). */
export function isDownloadPrivileged(user: LibUser | null, doc: DocLike): boolean {
  if (isLibrarian(user) && sameOrg(user, doc)) return true;
  if (user?.id && doc.createdById === user.id) return true;
  return false;
}

/** Peut consulter / télécharger le fichier numérique. */
export function canDownloadDocument(user: LibUser | null, doc: DocLike): { ok: boolean; reason?: string } {
  if (isLibrarian(user) && sameOrg(user, doc)) return { ok: true };
  if (!canViewDocument(user, doc)) return { ok: false, reason: "Accès non autorisé." };
  if (!doc.downloadAllowed || !doc.consultationAllowed) return { ok: false, reason: "Téléchargement non autorisé pour ce document." };

  const level = doc.accessLevel as AccessLevel;
  if (level === "ON_SITE_ONLY") return { ok: false, reason: "Consultation sur place uniquement." };
  if (level === "CONFIDENTIAL") return { ok: false, reason: "Document confidentiel." };
  if (level === "RESTRICTED") return { ok: false, reason: "Document restreint — demandez l'accès." };
  if (level === "EMBARGO" && !embargoLifted(doc)) return { ok: false, reason: "Document sous embargo." };

  if (!user?.permissions.has("documents.download")) return { ok: false, reason: "Permission de téléchargement requise." };
  return { ok: true };
}

/** Peut réserver / emprunter / consulter sur place le document physique. */
export function canReserveDocument(user: LibUser | null, doc: DocLike): boolean {
  if (!user?.permissions.has("documents.reserve")) return false;
  if (!sameOrg(user, doc) && doc.accessLevel !== "PUBLIC") return false;
  return doc.physicalCopyAvailable && (doc.availablePhysicalCopyCount ?? 0) > 0;
}

/** Doit passer par une demande d'accès (document restreint/confidentiel). */
export function needsAccessRequest(user: LibUser | null, doc: DocLike): boolean {
  if (isLibrarian(user) && sameOrg(user, doc)) return false;
  return ["RESTRICTED", "CONFIDENTIAL"].includes(doc.accessLevel);
}

/**
 * Fragment Prisma `where` pour le catalogue visible par l'utilisateur.
 * - Gestionnaire : tout ce qui appartient à son organisation.
 * - Membre interne : documents visibles de son organisation (hors confidentiels).
 * - Externe / visiteur : documents PUBLIC visibles uniquement.
 */
export function catalogWhere(user: LibUser | null): any {
  if (isLibrarian(user)) {
    return { organizationId: user!.organizationId ?? "" };
  }
  const visible = { status: { in: VISIBLE_DOCUMENT_STATUS } };
  if (user?.organizationId) {
    return {
      ...visible,
      OR: [
        { organizationId: user.organizationId, accessLevel: { not: "CONFIDENTIAL" } },
        { accessLevel: "PUBLIC" },
      ],
    };
  }
  return { ...visible, accessLevel: "PUBLIC" };
}
