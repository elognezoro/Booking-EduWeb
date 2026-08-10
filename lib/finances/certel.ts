import "server-only";
import { prisma } from "@/lib/prisma";
import { nextFinanceNumber } from "./numbering";

/**
 * Pont CERTEL → Finances : chaque paiement CERTEL payé (CinetPay ou hors-ligne avec montant)
 * devient un encaissement de l'ESPACE PLATEFORME (institution EduWeb, espace global).
 * Idempotent via FinanceEntry.sourceId (= transactionId CinetPay, unique).
 */

function certelMethod(method: string | null): string {
  const m = (method || "").toUpperCase();
  if (m.includes("CARD") || m.includes("CARTE")) return "CARD";
  return "MOBILE_MONEY";
}

/** Enregistre le paiement comme encaissement s'il ne l'est pas déjà. Silencieux en cas d'échec. */
export async function recordCertelFinanceEntry(paymentId: string): Promise<boolean> {
  try {
    const payment = await prisma.certelPayment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.status !== "PAID" || payment.amount <= 0) return false;
    const sourceId = payment.transactionId || `certel:${payment.id}`;
    const existing = await prisma.financeEntry.findUnique({ where: { sourceId } });
    if (existing) return false;

    const platformOrg = await prisma.organization.findFirst({ where: { isPlatform: true }, select: { id: true } });
    if (!platformOrg) return false;

    const name =
      payment.fullName ||
      (await prisma.user
        .findUnique({ where: { id: payment.userId }, select: { firstName: true, lastName: true } })
        .then((u) => (u ? `${u.firstName} ${u.lastName}`.trim() : "")));

    const date = payment.paidAt ?? payment.createdAt;
    const number = await nextFinanceNumber(platformOrg.id, null, "REC", date);
    await prisma.financeEntry.create({
      data: {
        organizationId: platformOrg.id,
        departmentId: null,
        kind: "INCOME",
        number,
        label: `Inscription CERTEL ${payment.levelKey}${name ? ` — ${name}` : ""}`,
        amount: payment.amount,
        currency: payment.currency,
        method: certelMethod(payment.method),
        date,
        thirdParty: name || null,
        source: "CERTEL",
        sourceId,
      },
    });
    return true;
  } catch {
    // Le paiement CERTEL reste la source de vérité ; une écriture manquée sera rattrapée par l'import.
    return false;
  }
}

/** Import de rattrapage : tous les paiements payés non encore comptabilisés. Renvoie le nombre importé. */
export async function importCertelPayments(): Promise<number> {
  const paid = await prisma.certelPayment.findMany({
    where: { status: "PAID", amount: { gt: 0 } },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  let imported = 0;
  for (const p of paid) {
    if (await recordCertelFinanceEntry(p.id)) imported++;
  }
  return imported;
}
