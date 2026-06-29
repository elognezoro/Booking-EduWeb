import "server-only";
import { prisma } from "@/lib/prisma";

/** Référence officielle d'un certificat CERTEL : CERTEL-<niveau>-NNNN. */
export function certelRef(levelKey: string, num: number): string {
  return `CERTEL-${levelKey}-${String(num).padStart(4, "0")}`;
}

export interface CertelCertificate { id: string; userId: string; levelKey: string; number: number; fullName: string; issuedAt: Date }

/**
 * Émet (ou récupère) le certificat d'achèvement d'un utilisateur pour un niveau.
 * Un seul certificat par (utilisateur, niveau) ; numéro séquentiel par niveau, attribué une fois.
 * Robuste à la concurrence (réessaie en cas de collision de numéro).
 */
export async function getOrCreateCertelCertificate(userId: string, fullName: string, levelKey = "N1"): Promise<CertelCertificate> {
  const existing = await prisma.certelCertificate.findUnique({ where: { userId_levelKey: { userId, levelKey } } });
  if (existing) return existing;

  for (let attempt = 0; attempt < 6; attempt++) {
    const last = await prisma.certelCertificate.findFirst({ where: { levelKey }, orderBy: { number: "desc" }, select: { number: true } });
    const number = (last?.number ?? 0) + 1;
    try {
      return await prisma.certelCertificate.create({ data: { userId, levelKey, number, fullName } });
    } catch (e) {
      // Le certificat de l'utilisateur a-t-il été créé en concurrence entre-temps ?
      const again = await prisma.certelCertificate.findUnique({ where: { userId_levelKey: { userId, levelKey } } });
      if (again) return again;
      // Réessayer UNIQUEMENT sur une violation d'unicité (numéro déjà pris, P2002) ;
      // toute autre erreur (réseau, base) est remontée sans être masquée.
      if ((e as { code?: string })?.code !== "P2002") throw e;
    }
  }
  throw new Error("Émission du certificat impossible (conflit de numérotation)");
}
