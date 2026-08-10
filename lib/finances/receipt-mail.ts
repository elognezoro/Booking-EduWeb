import "server-only";
import { prisma } from "@/lib/prisma";
import { sendNotification, renderEmail } from "@/lib/mail";
import { fmtMoney } from "@/lib/money";
import { amountToWordsFcfa } from "./amount-words";
import { PAYMENT_METHODS, type PaymentMethod } from "./constants";

/**
 * Envoie le reçu d'un encaissement par e-mail au payeur (adresse stockée sur l'écriture,
 * ou adresse explicite passée en paramètre). Contenu 100 % HTML/texte — pas d'images
 * base64 (bloquées par la plupart des messageries) : l'en-tête reprend les noms de
 * l'institution et de la sous-direction ; le reçu imprimable (avec logos) reste
 * disponible côté gestionnaire.
 */
export async function sendFinanceReceiptEmail(entryId: string, toOverride?: string): Promise<boolean> {
  const entry = await prisma.financeEntry.findUnique({ where: { id: entryId } });
  if (!entry || entry.kind !== "INCOME") return false;
  const to = (toOverride || entry.thirdPartyEmail || "").trim();
  if (!to) return false;

  const [org, dept, cashbox, category] = await Promise.all([
    prisma.organization.findUnique({ where: { id: entry.organizationId }, select: { name: true, acronym: true, city: true } }),
    entry.departmentId
      ? prisma.department.findUnique({ where: { id: entry.departmentId }, select: { name: true } })
      : Promise.resolve(null),
    entry.cashboxId ? prisma.financeCashbox.findUnique({ where: { id: entry.cashboxId }, select: { name: true } }) : Promise.resolve(null),
    entry.categoryId ? prisma.financeCategory.findUnique({ where: { id: entry.categoryId }, select: { name: true } }) : Promise.resolve(null),
  ]);
  if (!org) return false;

  const emitter = dept ? `${org.name} — ${dept.name}` : org.name;
  const date = entry.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const rows: [string, string][] = [
    ["N° du reçu", entry.number],
    ["Date", date],
    ["Reçu de", entry.thirdParty || "—"],
    ["Montant", `${fmtMoney(entry.amount, entry.currency)} (${amountToWordsFcfa(entry.amount)})`],
    ["Motif", entry.label + (category?.name ? ` — ${category.name}` : "")],
    ["Mode de règlement", PAYMENT_METHODS[entry.method as PaymentMethod] ?? entry.method],
  ];
  if (entry.reference) rows.push(["N° de pièce", entry.reference]);
  if (cashbox?.name) rows.push(["Caisse / compte", cashbox.name]);
  rows.push(["Émetteur", emitter]);

  const html = renderEmail({
    title: `Reçu de paiement N° ${entry.number}`,
    intro: `${emitter} accuse réception de votre paiement. Conservez ce reçu : son numéro d'identification (${entry.number}) fait foi.`,
    rows,
    footer: `Reçu émis par ${emitter} via EduWeb Booking.`,
  });
  const text = `Reçu N° ${entry.number} — ${emitter}\n${date}\nReçu de : ${entry.thirdParty || "—"}\nMontant : ${fmtMoney(entry.amount, entry.currency)} (${amountToWordsFcfa(entry.amount)})\nMotif : ${entry.label}`;

  await sendNotification({ to, subject: `Votre reçu de paiement N° ${entry.number} — ${org.acronym || org.name}`, html, text, type: "FINANCE_RECEIPT" });
  return true;
}
