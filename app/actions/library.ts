"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission, getCurrentUser } from "@/lib/auth";
import { stringifyJson } from "@/lib/json";
import { slugify } from "@/lib/utils";
import { audit } from "@/lib/audit";
import { sendNotification, renderEmail, APP_URL } from "@/lib/mail";
import { generateTemporaryCode, generateDocumentCode } from "@/lib/library/document-code";
import { findPotentialDuplicates } from "@/lib/library/duplicates";
import { saveDocumentFile } from "@/lib/library/storage";
import { DOCUMENT_TYPES, ACCESS_LEVELS } from "@/lib/library/enums";
import { canDownloadDocument, isDownloadPrivileged } from "@/lib/library/access";

/* ----------------------------- Téléchargement payant (cadre paiement simulé) ----------------------------- */
// Le bibliothécaire fixe un prix (FCFA). 0 = gratuit. Modifiable à tout moment.
export async function setDownloadPrice(formData: FormData) {
  const user = await requirePermission("documents.review");
  const id = String(formData.get("id"));
  const price = Math.max(0, Math.round(Number(formData.get("price")) || 0));
  const doc = await prisma.documentResource.findUnique({ where: { id } });
  if (doc && doc.organizationId === user.organizationId) {
    await prisma.documentResource.update({ where: { id }, data: { downloadPrice: price } });
    await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.set_price", entityType: "DocumentResource", entityId: id });
  }
  revalidatePath(`/dashboard/library/documents/${id}`);
  redirect(`/dashboard/library/documents/${id}`);
}

// Paiement simulé : enregistre le droit de téléchargement acquis par l'utilisateur.
// (Le vrai prestataire — mobile money / carte — se branchera ici, avant l'enregistrement du droit.)
export async function purchaseDownload(formData: FormData) {
  const user = await requirePermission("documents.download");
  const id = String(formData.get("id"));
  const doc = await prisma.documentResource.findUnique({ where: { id } });
  if (!doc) redirect("/dashboard/library");
  const access = canDownloadDocument(user, doc);
  if (access.ok && doc.downloadPrice > 0 && !isDownloadPrivileged(user, doc)) {
    const existing = await prisma.documentPurchase.findFirst({ where: { documentId: id, userId: user.id } });
    if (!existing) {
      await prisma.documentPurchase.create({ data: { documentId: id, userId: user.id, amount: doc.downloadPrice, method: "SIMULATED" } });
      await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.purchase", entityType: "DocumentResource", entityId: id });
    }
  }
  revalidatePath(`/dashboard/library/documents/${id}`);
  redirect(`/dashboard/library/documents/${id}`);
}

// Exemption étudiant ENS d'Abidjan : la saisie d'un matricule remplace le paiement.
// Le matricule est conservé (reference) pour vérification ; une validation contre le registre
// étudiant de l'ENS pourra se brancher ici.
export async function claimStudentExemption(formData: FormData) {
  const user = await requirePermission("documents.download");
  const id = String(formData.get("id"));
  const matricule = String(formData.get("matricule") || "").trim().toUpperCase();
  const doc = await prisma.documentResource.findUnique({ where: { id } });
  if (!doc) redirect("/dashboard/library");
  const [org, dbUser] = await Promise.all([
    prisma.organization.findUnique({ where: { id: doc.organizationId }, select: { slug: true } }),
    prisma.user.findUnique({ where: { id: user.id }, select: { matricule: true } }),
  ]);
  const eligible =
    canDownloadDocument(user, doc).ok && doc.downloadPrice > 0 && !isDownloadPrivileged(user, doc) && org?.slug === "ens-abidjan";
  // Vérification : le matricule saisi doit correspondre à celui enregistré sur le compte.
  const stored = (dbUser?.matricule ?? "").trim().toUpperCase();
  const verified = stored.length > 0 && stored === matricule;
  if (eligible && verified) {
    const existing = await prisma.documentPurchase.findFirst({ where: { documentId: id, userId: user.id } });
    if (!existing) {
      await prisma.documentPurchase.create({ data: { documentId: id, userId: user.id, amount: 0, method: "STUDENT_MATRICULE", reference: matricule } });
      await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.student_exemption", entityType: "DocumentResource", entityId: id });
    }
    redirect(`/dashboard/library/documents/${id}`);
  }
  redirect(`/dashboard/library/documents/${id}?exempt=invalid`);
}

/* ----------------------------- Helpers ----------------------------- */
async function notifyLibrarians(organizationId: string, subject: string, content: string, documentId?: string) {
  const librarians = await prisma.user.findMany({
    where: { organizationId, status: "ACTIVE", roles: { some: { role: { key: { in: ["LIBRARIAN", "ORG_ADMIN"] } } } } },
    select: { id: true, email: true },
  });
  for (const u of librarians) {
    await sendNotification({
      userId: u.id, to: u.email, type: "DOCUMENT_REVIEW", subject, text: content,
      html: renderEmail({ title: subject, intro: content, cta: documentId ? { label: "Ouvrir le document", href: `${APP_URL}/dashboard/library/documents/${documentId}` } : undefined }),
    });
  }
}

async function uniqueSlug(organizationId: string, title: string): Promise<string> {
  const base = slugify(title) || "document";
  let slug = base;
  for (let i = 0; i < 50; i++) {
    const exists = await prisma.documentResource.findFirst({ where: { organizationId, slug }, select: { id: true } });
    if (!exists) return slug;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${base}-${Date.now()}`;
}

/* ----------------------------- Dépôt ----------------------------- */
const depositSchema = z.object({
  title: z.string().min(3, "Le titre est requis."),
  documentType: z.enum(DOCUMENT_TYPES),
  collectionId: z.string().min(1, "Collection requise."),
  domainId: z.string().min(1, "Domaine requis."),
  abstract: z.string().optional(),
  mainAuthorName: z.string().min(2, "L'auteur principal est requis."),
  coAuthors: z.string().optional(),
  supervisorName: z.string().optional(),
  level: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  language: z.string().optional(),
  pageCount: z.coerce.number().int().positive().optional(),
  keywords: z.string().optional(),
  accessLevel: z.enum(ACCESS_LEVELS),
  downloadAllowed: z.string().optional(),
  downloadPrice: z.coerce.number().int().nonnegative().optional(),
  physicalCopyCount: z.coerce.number().int().nonnegative().optional(),
  doi: z.string().optional(),
  journalName: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
});

export interface DepositState {
  error?: string;
}

export async function createDeposit(_prev: DepositState, formData: FormData): Promise<DepositState> {
  const user = await requirePermission("documents.create");
  const organizationId = user.organizationId;
  if (!organizationId) return { error: "Aucune organisation associée." };

  const parsed = depositSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Données invalides." };
  const d = parsed.data;

  const [library, collection, domain, org, me] = await Promise.all([
    prisma.digitalLibrary.findFirst({ where: { organizationId } }),
    prisma.documentCollection.findFirst({ where: { id: d.collectionId, organizationId } }),
    prisma.documentDomain.findFirst({ where: { id: d.domainId, organizationId } }),
    prisma.organization.findUnique({ where: { id: organizationId } }),
    prisma.user.findUnique({ where: { id: user.id }, include: { department: true } }),
  ]);
  if (!library) return { error: "Aucune bibliothèque numérique n'est configurée pour votre organisation." };
  if (!collection || !domain) return { error: "Collection ou domaine introuvable." };

  const unitCode = me?.department?.code ?? library.code ?? "GEN";
  const departmentId = me?.departmentId ?? library.departmentId ?? null;
  const year = d.year ?? new Date().getFullYear();
  const temporaryCode = await generateTemporaryCode({
    countryCode: org?.country, organizationCode: org?.acronym, unitCode,
    collectionCode: collection.code, documentTypeCode: d.documentType, domainCode: domain.code, year,
  });

  const keywords = (d.keywords ?? "").split(",").map((k) => k.trim()).filter(Boolean);
  const slug = await uniqueSlug(organizationId, d.title);

  const doc = await prisma.documentResource.create({
    data: {
      organizationId, libraryId: library.id, collectionId: collection.id, domainId: domain.id, departmentId,
      temporaryCode, title: d.title, slug, abstract: d.abstract || null,
      documentType: d.documentType, year, language: d.language || "Français",
      mainAuthorName: d.mainAuthorName, supervisorName: d.supervisorName || null, level: d.level || null,
      pageCount: d.pageCount ?? null, keywords: stringifyJson(keywords),
      status: "SUBMITTED", accessLevel: d.accessLevel,
      downloadAllowed: d.downloadAllowed === "on",
      downloadPrice: d.downloadPrice ?? 0,
      physicalCopyAvailable: (d.physicalCopyCount ?? 0) > 0,
      physicalCopyCount: d.physicalCopyCount ?? 0, availablePhysicalCopyCount: d.physicalCopyCount ?? 0,
      doi: d.doi || null, journalName: d.journalName || null, volume: d.volume || null, issue: d.issue || null, pages: d.pages || null,
      createdById: user.id,
    },
  });

  // Co-auteurs
  const coAuthors = (d.coAuthors ?? "").split(",").map((c) => c.trim()).filter(Boolean);
  if (coAuthors.length) {
    await prisma.documentAuthor.createMany({ data: coAuthors.map((name, i) => ({ documentId: doc.id, name, role: "CO_AUTHOR", order: i + 1 })) });
  }

  // Fichier
  let fileHash: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const stored = await saveDocumentFile(doc.id, file);
    fileHash = stored.fileHash;
    await prisma.documentResource.update({
      where: { id: doc.id },
      data: { fileName: stored.fileName, fileKey: stored.fileKey, fileMime: stored.fileMime, fileSize: stored.fileSize, fileHash: stored.fileHash },
    });
  }

  // Détection de doublons
  const dups = await findPotentialDuplicates({ organizationId, excludeId: doc.id, title: d.title, mainAuthorName: d.mainAuthorName, year, doi: d.doi, fileHash });
  if (dups.length) {
    await prisma.documentDuplicateWarning.createMany({
      data: dups.map((x) => ({ documentId: doc.id, similarDocumentId: x.documentId, similarTitle: x.title, similarCode: x.codeLong, reason: x.reason, score: x.score })),
    });
  }

  await audit({ organizationId, userId: user.id, action: "document.deposit", entityType: "DocumentResource", entityId: doc.id, newValue: { temporaryCode } });
  await notifyLibrarians(organizationId, `Nouveau dépôt à vérifier — ${d.title}`, `${user.fullName} a déposé « ${d.title} » (${temporaryCode}).`, doc.id);

  revalidatePath("/dashboard/library/review");
  redirect(`/dashboard/library/documents/${doc.id}?deposited=1`);
}

/* ----------------------------- Validation documentaire ----------------------------- */
async function loadDocForReview(documentId: string, organizationId: string | null) {
  const doc = await prisma.documentResource.findUnique({
    where: { id: documentId },
    include: { collection: true, domain: true },
  });
  if (!doc || (organizationId && doc.organizationId !== organizationId)) return null;
  return doc;
}

export async function validateDocument(formData: FormData) {
  const user = await requirePermission("documents.review");
  const documentId = String(formData.get("documentId"));
  const comment = (formData.get("comment") as string) || undefined;
  const publish = formData.get("publish") === "on";
  const doc = await loadDocForReview(documentId, user.organizationId);
  if (!doc) redirect("/dashboard/library/review");

  const org = await prisma.organization.findUnique({ where: { id: doc.organizationId } });
  const dept = doc.departmentId ? await prisma.department.findUnique({ where: { id: doc.departmentId } }) : null;

  // Génère le code définitif s'il n'existe pas encore
  let codeLong = doc.codeLong;
  let codeShort = doc.codeShort;
  if (!codeLong) {
    const codes = await generateDocumentCode({
      countryCode: org?.country, organizationCode: org?.acronym, unitCode: dept?.code ?? "GEN",
      collectionCode: doc.collection.code, documentTypeCode: doc.documentType, domainCode: doc.domain.code, year: doc.year ?? new Date().getFullYear(),
    });
    codeLong = codes.codeLong;
    codeShort = codes.codeShort;
  }

  const status = publish ? "PUBLISHED" : doc.accessLevel === "CONFIDENTIAL" ? "CONFIDENTIAL" : doc.accessLevel === "RESTRICTED" ? "RESTRICTED" : doc.accessLevel === "EMBARGO" ? "EMBARGOED" : "VALIDATED";

  await prisma.documentResource.update({
    where: { id: documentId },
    data: {
      codeLong, codeShort, temporaryCode: null, status,
      validatedById: user.id, validatedAt: new Date(), publishedAt: publish ? new Date() : doc.publishedAt,
    },
  });
  await prisma.documentReview.create({ data: { documentId, reviewerId: user.id, decision: publish ? "PUBLISHED" : "VALIDATED", comment } });
  await prisma.documentDuplicateWarning.updateMany({ where: { documentId }, data: { resolved: true } });
  await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.validate", entityType: "DocumentResource", entityId: documentId, newValue: { codeLong, status } });

  if (doc.createdById) {
    const author = await prisma.user.findUnique({ where: { id: doc.createdById } });
    if (author) {
      await sendNotification({
        userId: author.id, to: author.email, type: "DOCUMENT_VALIDATED",
        subject: `Document ${publish ? "publié" : "validé"} — ${doc.title}`,
        text: `Votre dépôt « ${doc.title} » a été ${publish ? "publié" : "validé"}. Code : ${codeLong}.`,
        html: renderEmail({ title: publish ? "Document publié 🎉" : "Document validé ✅", intro: `Votre dépôt a été ${publish ? "publié" : "validé"}.`, rows: [["Titre", doc.title], ["Code", codeLong!]], cta: { label: "Voir le document", href: `${APP_URL}/dashboard/library/documents/${documentId}` } }),
      });
    }
  }

  revalidatePath(`/dashboard/library/documents/${documentId}`);
  revalidatePath("/dashboard/library/review");
  redirect(`/dashboard/library/documents/${documentId}`);
}

export async function requestCorrection(formData: FormData) {
  const user = await requirePermission("documents.review");
  const documentId = String(formData.get("documentId"));
  const comment = (formData.get("comment") as string) || "Des corrections sont nécessaires.";
  const doc = await loadDocForReview(documentId, user.organizationId);
  if (!doc) redirect("/dashboard/library/review");

  await prisma.documentResource.update({ where: { id: documentId }, data: { status: "NEEDS_CORRECTION" } });
  await prisma.documentReview.create({ data: { documentId, reviewerId: user.id, decision: "NEEDS_CORRECTION", comment } });
  await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.correction", entityType: "DocumentResource", entityId: documentId });

  if (doc.createdById) {
    const author = await prisma.user.findUnique({ where: { id: doc.createdById } });
    if (author) await sendNotification({ userId: author.id, to: author.email, type: "DOCUMENT_CORRECTION", subject: `Corrections demandées — ${doc.title}`, text: comment, html: renderEmail({ title: "Corrections demandées", intro: comment, rows: [["Document", doc.title]], cta: { label: "Voir le document", href: `${APP_URL}/dashboard/library/documents/${documentId}` } }) });
  }
  revalidatePath(`/dashboard/library/documents/${documentId}`);
  redirect(`/dashboard/library/documents/${documentId}`);
}

export async function rejectDocument(formData: FormData) {
  const user = await requirePermission("documents.review");
  const documentId = String(formData.get("documentId"));
  const comment = (formData.get("comment") as string) || "Dépôt rejeté.";
  const doc = await loadDocForReview(documentId, user.organizationId);
  if (!doc) redirect("/dashboard/library/review");

  await prisma.documentResource.update({ where: { id: documentId }, data: { status: "REJECTED", rejectedReason: comment } });
  await prisma.documentReview.create({ data: { documentId, reviewerId: user.id, decision: "REJECTED", comment } });
  await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.reject", entityType: "DocumentResource", entityId: documentId });

  if (doc.createdById) {
    const author = await prisma.user.findUnique({ where: { id: doc.createdById } });
    if (author) await sendNotification({ userId: author.id, to: author.email, type: "DOCUMENT_REJECTED", subject: `Dépôt refusé — ${doc.title}`, text: comment, html: renderEmail({ title: "Dépôt refusé", intro: "Votre dépôt n'a pas été retenu.", rows: [["Document", doc.title], ["Motif", comment]] }) });
  }
  revalidatePath(`/dashboard/library/documents/${documentId}`);
  redirect(`/dashboard/library/documents/${documentId}`);
}

export async function publishDocument(formData: FormData) {
  const user = await requirePermission("documents.review");
  const documentId = String(formData.get("documentId"));
  const doc = await loadDocForReview(documentId, user.organizationId);
  if (!doc) redirect("/dashboard/library/documents");
  await prisma.documentResource.update({ where: { id: documentId }, data: { status: "PUBLISHED", publishedAt: new Date() } });
  await prisma.documentReview.create({ data: { documentId, reviewerId: user.id, decision: "PUBLISHED" } });
  await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.publish", entityType: "DocumentResource", entityId: documentId });
  revalidatePath(`/dashboard/library/documents/${documentId}`);
  redirect(`/dashboard/library/documents/${documentId}`);
}

export async function archiveDocument(formData: FormData) {
  const user = await requirePermission("documents.review");
  const documentId = String(formData.get("documentId"));
  const doc = await loadDocForReview(documentId, user.organizationId);
  if (!doc) redirect("/dashboard/library/documents");
  await prisma.documentResource.update({ where: { id: documentId }, data: { status: "ARCHIVED" } });
  await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.archive", entityType: "DocumentResource", entityId: documentId });
  revalidatePath(`/dashboard/library/documents/${documentId}`);
  redirect(`/dashboard/library/documents/${documentId}`);
}

export async function scientificReview(formData: FormData) {
  const user = await requirePermission("documents.science_review");
  const documentId = String(formData.get("documentId"));
  const favorable = formData.get("decision") === "favorable";
  const comment = (formData.get("comment") as string) || undefined;
  const doc = await loadDocForReview(documentId, user.organizationId);
  if (!doc) redirect("/dashboard/library/documents");
  await prisma.documentReview.create({ data: { documentId, reviewerId: user.id, decision: favorable ? "SCIENCE_FAVORABLE" : "SCIENCE_RESERVED", comment, scientific: true } });
  await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.science_review", entityType: "DocumentResource", entityId: documentId });
  revalidatePath(`/dashboard/library/documents/${documentId}`);
  redirect(`/dashboard/library/documents/${documentId}`);
}

/* ----------------------------- Réservation / accès ----------------------------- */
export async function reserveDocument(formData: FormData) {
  const user = await requirePermission("documents.reserve");
  const documentId = String(formData.get("documentId"));
  const type = String(formData.get("type") || "ON_SITE");
  const note = (formData.get("note") as string) || null;
  const slotStartRaw = formData.get("slotStart") as string | null;
  const slotEndRaw = formData.get("slotEnd") as string | null;

  const doc = await prisma.documentResource.findUnique({ where: { id: documentId } });
  if (!doc) redirect("/dashboard/library/explore");

  await prisma.documentReservation.create({
    data: {
      documentId, requesterId: user.id, type, status: "PENDING", note,
      slotStart: slotStartRaw ? new Date(slotStartRaw) : null,
      slotEnd: slotEndRaw ? new Date(slotEndRaw) : null,
    },
  });
  await notifyLibrarians(doc.organizationId, `Demande documentaire — ${doc.title}`, `${user.fullName} a fait une demande (${type}) sur « ${doc.title} ».`, documentId);
  await audit({ organizationId: doc.organizationId, userId: user.id, action: "document.reserve", entityType: "DocumentReservation", entityId: documentId });
  revalidatePath(`/dashboard/library/documents/${documentId}`);
  redirect(`/dashboard/library/documents/${documentId}?reserved=1`);
}

export async function decideReservation(formData: FormData) {
  const user = await requirePermission("documents.review");
  const reservationId = String(formData.get("reservationId"));
  const approve = formData.get("decision") === "approve";
  const comment = (formData.get("comment") as string) || undefined;

  const reservation = await prisma.documentReservation.findUnique({ where: { id: reservationId }, include: { document: true } });
  if (!reservation) redirect("/dashboard/library/reservations");

  await prisma.documentReservation.update({ where: { id: reservationId }, data: { status: approve ? "APPROVED" : "REJECTED", decisionComment: comment } });

  if (approve && reservation.type === "LOAN") {
    const due = new Date();
    due.setDate(due.getDate() + 14);
    await prisma.documentLoan.create({ data: { documentId: reservation.documentId, userId: reservation.requesterId, status: "BORROWED", dueDate: due } });
    if ((reservation.document.availablePhysicalCopyCount ?? 0) > 0) {
      await prisma.documentResource.update({ where: { id: reservation.documentId }, data: { availablePhysicalCopyCount: { decrement: 1 } } });
    }
  }
  await sendNotification({ userId: reservation.requesterId, type: "RESERVATION_DECISION", subject: `Demande documentaire ${approve ? "approuvée" : "refusée"}`, text: `Votre demande sur « ${reservation.document.title} » a été ${approve ? "approuvée" : "refusée"}.`, html: renderEmail({ title: approve ? "Demande approuvée" : "Demande refusée", intro: `Votre demande sur « ${reservation.document.title} » a été ${approve ? "approuvée" : "refusée"}.` }) });
  revalidatePath("/dashboard/library/reservations");
  redirect("/dashboard/library/reservations");
}

export async function returnLoan(formData: FormData) {
  const user = await requirePermission("documents.review");
  const loanId = String(formData.get("loanId"));
  const loan = await prisma.documentLoan.findUnique({ where: { id: loanId } });
  if (!loan) redirect("/dashboard/library/loans");
  await prisma.documentLoan.update({ where: { id: loanId }, data: { status: "RETURNED", returnedAt: new Date() } });
  await prisma.documentResource.update({ where: { id: loan.documentId }, data: { availablePhysicalCopyCount: { increment: 1 } } });
  await audit({ organizationId: user.organizationId, userId: user.id, action: "document.loan_return", entityType: "DocumentLoan", entityId: loanId });
  revalidatePath("/dashboard/library/loans");
  redirect("/dashboard/library/loans");
}

/* ----------------------------- Collections & domaines ----------------------------- */
export async function createCollection(formData: FormData) {
  const user = await requirePermission("library.manage");
  const name = String(formData.get("name") || "").trim();
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (name && code) await prisma.documentCollection.create({ data: { organizationId: user.organizationId!, name, code } });
  revalidatePath("/dashboard/library/collections");
  redirect("/dashboard/library/collections");
}

export async function toggleCollection(formData: FormData) {
  await requirePermission("library.manage");
  const id = String(formData.get("id"));
  const c = await prisma.documentCollection.findUnique({ where: { id } });
  if (c) await prisma.documentCollection.update({ where: { id }, data: { active: !c.active } });
  revalidatePath("/dashboard/library/collections");
  redirect("/dashboard/library/collections");
}

export async function updateCollection(formData: FormData) {
  const user = await requirePermission("library.manage");
  const id = String(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const c = await prisma.documentCollection.findUnique({ where: { id } });
  if (c && c.organizationId === user.organizationId && name && code) {
    await prisma.documentCollection.update({ where: { id }, data: { name, code } });
  }
  revalidatePath("/dashboard/library/collections");
  redirect("/dashboard/library/collections");
}

export async function createDomain(formData: FormData) {
  const user = await requirePermission("library.manage");
  const name = String(formData.get("name") || "").trim();
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (name && code) await prisma.documentDomain.create({ data: { organizationId: user.organizationId!, name, code } });
  revalidatePath("/dashboard/library/domains");
  redirect("/dashboard/library/domains");
}

export async function toggleDomain(formData: FormData) {
  await requirePermission("library.manage");
  const id = String(formData.get("id"));
  const dmn = await prisma.documentDomain.findUnique({ where: { id } });
  if (dmn) await prisma.documentDomain.update({ where: { id }, data: { active: !dmn.active } });
  revalidatePath("/dashboard/library/domains");
  redirect("/dashboard/library/domains");
}

export async function updateDomain(formData: FormData) {
  const user = await requirePermission("library.manage");
  const id = String(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const dmn = await prisma.documentDomain.findUnique({ where: { id } });
  if (dmn && dmn.organizationId === user.organizationId && name && code) {
    await prisma.documentDomain.update({ where: { id }, data: { name, code } });
  }
  revalidatePath("/dashboard/library/domains");
  redirect("/dashboard/library/domains");
}
