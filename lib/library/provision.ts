import type { PrismaClient } from "@prisma/client";
import { DEFAULT_COLLECTIONS, DEFAULT_DOMAINS } from "./enums";

/**
 * Active l'espace de dépôt d'une organisation : crée (si absent) une bibliothèque numérique
 * ainsi que les collections et domaines par défaut. Idempotent — n'ajoute que ce qui manque,
 * de sorte que les personnalisations existantes (collections/domaines ajoutés ou désactivés)
 * sont préservées.
 */
export async function provisionLibrary(
  prisma: PrismaClient,
  opts: { organizationId: string; departmentId?: string | null; acronym?: string | null; name?: string }
) {
  const acr = (opts.acronym || "ORG").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "ORG";

  let library = await prisma.digitalLibrary.findFirst({ where: { organizationId: opts.organizationId } });
  if (!library) {
    library = await prisma.digitalLibrary.create({
      data: {
        organizationId: opts.organizationId,
        departmentId: opts.departmentId ?? null,
        name: opts.name ?? `Bibliothèque numérique ${acr}`,
        code: `BIB-${acr}`,
        description: "Fonds documentaire scientifique et pédagogique de l'institution.",
      },
    });
  }

  for (const c of DEFAULT_COLLECTIONS) {
    const exists = await prisma.documentCollection.findFirst({ where: { organizationId: opts.organizationId, code: c.code } });
    if (!exists) await prisma.documentCollection.create({ data: { organizationId: opts.organizationId, code: c.code, name: c.name } });
  }
  for (const d of DEFAULT_DOMAINS) {
    const exists = await prisma.documentDomain.findFirst({ where: { organizationId: opts.organizationId, code: d.code } });
    if (!exists) await prisma.documentDomain.create({ data: { organizationId: opts.organizationId, code: d.code, name: d.name } });
  }

  return library;
}
