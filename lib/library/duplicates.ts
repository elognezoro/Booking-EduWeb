// EduWeb Booking Library — détection de doublons avant validation.
import { prisma } from "@/lib/prisma";

function normalize(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface DuplicateCandidate {
  documentId: string;
  title: string;
  codeLong: string | null;
  reason: string;
  score: number;
}

export async function findPotentialDuplicates(input: {
  organizationId: string;
  excludeId?: string;
  title: string;
  mainAuthorName?: string | null;
  year?: number | null;
  doi?: string | null;
  fileHash?: string | null;
}): Promise<DuplicateCandidate[]> {
  const candidates = await prisma.documentResource.findMany({
    where: {
      organizationId: input.organizationId,
      id: input.excludeId ? { not: input.excludeId } : undefined,
      status: { notIn: ["REMOVED", "REJECTED"] },
    },
    select: { id: true, title: true, codeLong: true, mainAuthorName: true, year: true, doi: true, fileHash: true },
    take: 500,
  });

  const nTitle = normalize(input.title);
  const nAuthor = normalize(input.mainAuthorName);
  const results: DuplicateCandidate[] = [];

  for (const c of candidates) {
    let score = 0;
    const reasons: string[] = [];

    if (input.fileHash && c.fileHash && input.fileHash === c.fileHash) {
      score = 100;
      reasons.push("fichier identique");
    }
    if (input.doi && c.doi && input.doi.trim().toLowerCase() === c.doi.trim().toLowerCase()) {
      score = Math.max(score, 96);
      reasons.push("DOI identique");
    }

    const cTitle = normalize(c.title);
    if (cTitle && cTitle === nTitle) {
      let titleScore = 70;
      if (input.year && c.year && input.year === c.year) titleScore += 10;
      if (nAuthor && normalize(c.mainAuthorName) === nAuthor) titleScore += 15;
      score = Math.max(score, titleScore);
      reasons.push("titre identique");
    } else if (cTitle && nTitle && (cTitle.includes(nTitle) || nTitle.includes(cTitle)) && nTitle.length > 12) {
      score = Math.max(score, 55);
      reasons.push("titre très proche");
    }

    if (score >= 55) {
      results.push({ documentId: c.id, title: c.title, codeLong: c.codeLong, reason: reasons.join(", "), score: Math.min(100, score) });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}
