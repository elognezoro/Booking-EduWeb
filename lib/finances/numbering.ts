import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Numérotation séquentielle des pièces financières, cloisonnée par espace
 * (institution ou sous-direction), par type et par année.
 * Même patron que CertificateCounter : upsert atomique (increment), sûr en concurrence.
 * Format : `REC-2026-0001`, `DEP-2026-0012`, `FAC-2026-0003`.
 */
export async function nextFinanceNumber(
  organizationId: string,
  departmentId: string | null,
  prefix: "REC" | "DEP" | "FAC",
  now: Date = new Date()
): Promise<string> {
  const year = now.getFullYear();
  const key = `${organizationId}:${departmentId ?? "org"}:${prefix}:${year}`;
  const counter = await prisma.financeCounter.upsert({
    where: { key },
    create: { key, count: 1 },
    update: { count: { increment: 1 } },
  });
  return `${prefix}-${year}-${String(counter.count).padStart(4, "0")}`;
}
