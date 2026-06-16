// Codification des réservations (réf. spec §9.2)
// Format : EB-CI-ORG-SERVICE-CAT-YYYY-0001
// Exemple : EB-CI-ENS-APRID-SM-2026-0001

import { prisma } from "./prisma";

function sanitize(part: string | null | undefined, fallback: string) {
  const v = (part ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return v.slice(0, 6) || fallback;
}

export async function generateBookingCode(opts: {
  organizationId: string;
  orgAcronym?: string | null;
  departmentCode?: string | null;
  categoryCode?: string | null;
  country?: string | null;
}): Promise<string> {
  const year = new Date().getFullYear();
  const country = (opts.country ?? "CI").includes("Ivoire") ? "CI" : sanitize(opts.country, "CI");
  const org = sanitize(opts.orgAcronym, "ORG");
  const service = sanitize(opts.departmentCode, "GEN");
  const cat = sanitize(opts.categoryCode, "RES");

  // Compteur basé sur le nombre de réservations de l'organisation cette année.
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const count = await prisma.booking.count({
    where: { organizationId: opts.organizationId, createdAt: { gte: start, lt: end } },
  });
  const seq = String(count + 1).padStart(4, "0");

  return `EB-${country}-${org}-${service}-${cat}-${year}-${seq}`;
}
