import { prisma } from "@/lib/prisma";

/** Préfixe de numérotation : valeur configurée, sinon sigle, sinon nom — normalisé. */
export function certPrefix(raw: string | null | undefined, acronym: string | null | undefined, name: string): string {
  const base = (raw || acronym || name || "EDUWEB").toString();
  const cleaned = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 12);
  return cleaned || "EDUWEB";
}

/**
 * Attribue le prochain numéro de certificat pour un établissement et une année,
 * via un compteur atomique propre à la structure (séquence par structure).
 * Format : <PREFIX>-FORM-<ANNÉE>-<SÉQUENCE sur 4 chiffres>.
 */
export async function nextCertificateNumber(organizationId: string, prefix: string, year: number) {
  const key = `${organizationId}:${year}`;
  const counter = await prisma.certificateCounter.upsert({
    where: { key },
    create: { key, count: 1 },
    update: { count: { increment: 1 } },
  });
  const seq = counter.count;
  const number = `${prefix}-FORM-${year}-${String(seq).padStart(4, "0")}`;
  return { seq, number, year };
}

export const DEFAULT_CERT_TITLE = "Attestation de formation";
export const DEFAULT_CERT_MENTION =
  "a suivi avec assiduité la formation à l'utilisation de la plateforme EduWeb Booking et en maîtrise les fonctionnalités correspondant à son rôle.";
