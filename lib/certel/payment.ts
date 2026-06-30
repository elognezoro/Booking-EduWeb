import "server-only";
import { prisma } from "@/lib/prisma";
import { getCertelPricing, netAmount, type CertelLevelKey } from "./pricing";

const CINETPAY_API_KEY = process.env.CINETPAY_API_KEY;
const CINETPAY_SITE_ID = process.env.CINETPAY_SITE_ID;
const APP_URL = (process.env.APP_URL || (process.env.NODE_ENV === "production" ? "https://booking.eduweb.ci" : "http://localhost:3000")).replace(/\/$/, "");
const CINETPAY_BASE = "https://api-checkout.cinetpay.com/v2";

export function cinetpayConfigured(): boolean {
  return !!(CINETPAY_API_KEY && CINETPAY_SITE_ID);
}

/** Montant net (après remise) et devise pour un niveau. amount = 0 → gratuit. */
export async function certelLevelAmount(levelKey: CertelLevelKey): Promise<{ amount: number; currency: string }> {
  const pricing = await getCertelPricing();
  return { amount: netAmount(pricing.levels[levelKey], pricing.currency), currency: pricing.currency };
}

/** Accès accordé si le niveau est gratuit, ou si un paiement PAID existe pour (userId, levelKey). */
export async function hasCertelAccess(userId: string | undefined | null, levelKey: CertelLevelKey): Promise<boolean> {
  const { amount } = await certelLevelAmount(levelKey);
  if (amount <= 0) return true;
  if (!userId) return false;
  const paid = await prisma.certelPayment.findFirst({ where: { userId, levelKey, status: "PAID" }, select: { id: true } });
  return !!paid;
}

/** Référence de transaction unique (alphanumérique, acceptée par CinetPay). */
export function newTransactionId(levelKey: CertelLevelKey): string {
  const rnd = (globalThis.crypto?.randomUUID?.() || `${Date.now()}${Math.random()}`).replace(/[^a-zA-Z0-9]/g, "");
  return `CERTEL${levelKey}${rnd}`.slice(0, 60);
}

/** Canaux CinetPay supportés (validés côté serveur). ALL = laisse le choix sur la page CinetPay. */
export type CinetPayChannel = "ALL" | "MOBILE_MONEY" | "WALLET" | "CREDIT_CARD";
export const CINETPAY_CHANNELS: CinetPayChannel[] = ["ALL", "MOBILE_MONEY", "WALLET", "CREDIT_CARD"];
export function normalizeChannel(v: unknown): CinetPayChannel {
  return CINETPAY_CHANNELS.includes(v as CinetPayChannel) ? (v as CinetPayChannel) : "ALL";
}

/** Initialise un paiement CinetPay et renvoie l'URL de paiement (ou une erreur). */
export async function initCinetPayPayment(args: {
  transactionId: string;
  amount: number;
  currency: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  returnUrl: string;
  channels?: CinetPayChannel;
}): Promise<{ url: string } | { error: string }> {
  if (!cinetpayConfigured()) return { error: "Le paiement en ligne n'est pas encore configuré sur la plateforme." };
  try {
    const res = await fetch(`${CINETPAY_BASE}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id: args.transactionId,
        amount: args.amount,
        currency: args.currency,
        description: args.description.slice(0, 250),
        notify_url: `${APP_URL}/api/certel/payment/notify`,
        return_url: args.returnUrl,
        channels: args.channels || "ALL",
        lang: "fr",
        customer_name: (args.customerName || "Apprenant").slice(0, 100),
        ...(args.customerEmail ? { customer_email: args.customerEmail } : {}),
      }),
    });
    const json = await res.json().catch(() => null);
    if (json && (json.code === "201" || json.code === 201) && json.data?.payment_url) {
      return { url: json.data.payment_url as string };
    }
    return { error: (json && (json.description || json.message)) || "Échec de l'initialisation du paiement." };
  } catch {
    return { error: "Service de paiement injoignable. Réessayez dans un instant." };
  }
}

export type CinetPayStatus = "ACCEPTED" | "REFUSED" | "PENDING" | "ERROR";

/** Vérifie l'état d'une transaction auprès de CinetPay (source de vérité). */
export async function verifyCinetPayPayment(transactionId: string): Promise<CinetPayStatus> {
  if (!cinetpayConfigured()) return "ERROR";
  try {
    const res = await fetch(`${CINETPAY_BASE}/payment/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apikey: CINETPAY_API_KEY, site_id: CINETPAY_SITE_ID, transaction_id: transactionId }),
    });
    const json = await res.json().catch(() => null);
    const status = json?.data?.status;
    if (status === "ACCEPTED") return "ACCEPTED";
    if (status === "REFUSED") return "REFUSED";
    if (json) return "PENDING"; // ex. 662 WAITING_FOR_CUSTOMER / transaction en cours
    return "ERROR";
  } catch {
    return "ERROR";
  }
}

/** Applique le résultat CinetPay à notre enregistrement (idempotent). Renvoie le statut final. */
export async function reconcileCertelPayment(transactionId: string): Promise<"PAID" | "FAILED" | "PENDING" | "UNKNOWN"> {
  const payment = await prisma.certelPayment.findUnique({ where: { transactionId } });
  if (!payment) return "UNKNOWN";
  if (payment.status === "PAID") return "PAID";
  const status = await verifyCinetPayPayment(transactionId);
  if (status === "ACCEPTED") {
    await prisma.certelPayment.update({ where: { transactionId }, data: { status: "PAID", paidAt: new Date() } });
    return "PAID";
  }
  if (status === "REFUSED") {
    await prisma.certelPayment.update({ where: { transactionId }, data: { status: "FAILED" } });
    return "FAILED";
  }
  return "PENDING";
}
