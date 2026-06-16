// EduWeb Booking Library — génération de citations bibliographiques (APA).
import { DOCUMENT_TYPE_LABELS, type DocumentType } from "./enums";

interface CitableDocument {
  title: string;
  mainAuthorName: string;
  year?: number | null;
  documentType: string;
  level?: string | null;
  journalName?: string | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  doi?: string | null;
  codeLong?: string | null;
  institution?: string | null;
}

/** Transforme « Prénom Nom » en « Nom, P. » (initiales). */
function formatAuthorApa(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName;
  const last = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map((p) => `${p.charAt(0).toUpperCase()}.`).join(" ");
  return `${last}, ${initials}`;
}

export function generateApaCitation(doc: CitableDocument, coAuthors: string[] = []): string {
  const authors = [doc.mainAuthorName, ...coAuthors].filter(Boolean).map(formatAuthorApa);
  const authorStr =
    authors.length > 1 ? `${authors.slice(0, -1).join(", ")}, & ${authors[authors.length - 1]}` : authors[0] ?? "Anonyme";
  const year = doc.year ?? "s.d.";
  const institution = doc.institution ?? "EduWeb Booking Library";

  // Article de revue
  if (doc.documentType === "ART" && doc.journalName) {
    const vol = doc.volume ? `${doc.volume}` : "";
    const iss = doc.issue ? `(${doc.issue})` : "";
    const pages = doc.pages ? `, ${doc.pages}` : "";
    const doi = doc.doi ? ` https://doi.org/${doc.doi}` : "";
    return `${authorStr} (${year}). ${doc.title}. ${doc.journalName}, ${vol}${iss}${pages}.${doi}`.replace(/\s+/g, " ").trim();
  }

  // Mémoire / thèse
  if (["MEM", "THS"].includes(doc.documentType)) {
    const kind = doc.documentType === "THS" ? "Thèse de doctorat" : `Mémoire${doc.level ? ` de ${doc.level}` : ""}`;
    const code = doc.codeLong ? ` Code : ${doc.codeLong}.` : "";
    return `${authorStr} (${year}). ${doc.title} [${kind}, ${institution}]. EduWeb Booking Library.${code}`.replace(/\s+/g, " ").trim();
  }

  // Générique (rapport, livre, support…)
  const typeLabel = DOCUMENT_TYPE_LABELS[doc.documentType as DocumentType] ?? "Document";
  const code = doc.codeLong ? ` Code : ${doc.codeLong}.` : "";
  return `${authorStr} (${year}). ${doc.title} [${typeLabel}]. ${institution}. EduWeb Booking Library.${code}`.replace(/\s+/g, " ").trim();
}
