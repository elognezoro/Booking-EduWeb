import "server-only";
import { prisma } from "@/lib/prisma";
import { REVIEW_PENDING_STATUS } from "./enums";

export async function getLibraryOverview(organizationId: string) {
  const where = { organizationId };

  const [
    total, submitted, pending, validated, published, rejected, confidential, embargoed,
    docs, consultations, downloads, reservations, loans, openWarnings,
  ] = await Promise.all([
    prisma.documentResource.count({ where }),
    prisma.documentResource.count({ where: { ...where, status: "SUBMITTED" } }),
    prisma.documentResource.count({ where: { ...where, status: { in: REVIEW_PENDING_STATUS } } }),
    prisma.documentResource.count({ where: { ...where, status: "VALIDATED" } }),
    prisma.documentResource.count({ where: { ...where, status: "PUBLISHED" } }),
    prisma.documentResource.count({ where: { ...where, status: "REJECTED" } }),
    prisma.documentResource.count({ where: { ...where, accessLevel: "CONFIDENTIAL" } }),
    prisma.documentResource.count({ where: { ...where, status: "EMBARGOED" } }),
    prisma.documentResource.findMany({
      where,
      select: {
        id: true, title: true, codeShort: true, documentType: true, year: true, createdAt: true,
        consultationCount: true, downloadCount: true, fileKey: true, abstract: true, keywords: true,
        domain: { select: { name: true, code: true } },
      },
    }),
    prisma.documentConsultation.count({ where: { document: { organizationId } } }),
    prisma.documentDownload.count({ where: { document: { organizationId } } }),
    prisma.documentReservation.count({ where: { document: { organizationId } } }),
    prisma.documentLoan.count({ where: { document: { organizationId }, status: { in: ["BORROWED", "OVERDUE"] } } }),
    prisma.documentDuplicateWarning.count({ where: { resolved: false, document: { organizationId } } }),
  ]);

  // Répartitions
  const byType = aggregate(docs, (d) => d.documentType);
  const byDomain = aggregate(docs, (d) => d.domain.name);
  const byYear = aggregate(docs.filter((d) => d.year), (d) => String(d.year)).sort((a, b) => a.label.localeCompare(b.label));

  // Dépôts mensuels (6 derniers mois)
  const monthly: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const count = docs.filter((x) => x.createdAt >= d && x.createdAt < next).length;
    monthly.push({ label: d.toLocaleDateString("fr-FR", { month: "short" }), value: count });
  }

  const topConsulted = [...docs].sort((a, b) => b.consultationCount - a.consultationCount).filter((d) => d.consultationCount > 0).slice(0, 5);
  const topDownloaded = [...docs].sort((a, b) => b.downloadCount - a.downloadCount).filter((d) => d.downloadCount > 0).slice(0, 5);
  const latest = [...docs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6);

  const missingFile = docs.filter((d) => !d.fileKey).length;
  const incomplete = docs.filter((d) => !d.abstract || !d.keywords).length;

  return {
    total, submitted, pending, validated, published, rejected, confidential, embargoed,
    consultations, downloads, reservations, loans, openWarnings,
    byType, byDomain, byYear, monthly,
    topConsulted, topDownloaded, latest,
    alerts: { missingFile, incomplete, duplicates: openWarnings },
  };
}

function aggregate<T>(items: T[], key: (t: T) => string): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
