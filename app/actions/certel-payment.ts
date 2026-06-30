"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser, requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { setCertelPricing, slugToLevel, levelToSlug, type CertelLevelKey, type CertelPricing } from "@/lib/certel/pricing";
import { certelLevelAmount, hasCertelAccess, initCinetPayPayment, newTransactionId, normalizeChannel } from "@/lib/certel/payment";

const TARIFS_PATH = "/dashboard/platform/certel-tarifs";

/** L'apprenant lance le paiement d'un niveau → CinetPay (Mobile Money / carte). */
export async function startCertelPayment(formData: FormData) {
  const slug = String(formData.get("level") || "");
  const levelKey = slugToLevel(slug);
  if (!levelKey) redirect("/certel");
  const insc = `/certel/inscription/${levelToSlug(levelKey)}`;

  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(insc)}`);

  if (await hasCertelAccess(user.id, levelKey)) redirect(`/certel/${levelToSlug(levelKey)}`);

  const { amount, currency } = await certelLevelAmount(levelKey);
  if (amount <= 0) redirect(`/certel/${levelToSlug(levelKey)}`); // gratuit

  const transactionId = newTransactionId(levelKey);
  await prisma.certelPayment.create({
    data: { userId: user.id, levelKey, amount, currency, transactionId, fullName: user.fullName },
  });

  const APP_URL = (process.env.APP_URL || (process.env.NODE_ENV === "production" ? "https://booking.eduweb.ci" : "http://localhost:3000")).replace(/\/$/, "");
  const init = await initCinetPayPayment({
    transactionId,
    amount,
    currency,
    description: `Inscription CERTEL ${levelKey}`,
    customerName: user.fullName,
    customerEmail: user.email,
    returnUrl: `${APP_URL}${insc}?tx=${transactionId}`,
    channels: normalizeChannel(formData.get("channels")),
  });

  if ("url" in init) redirect(init.url);
  redirect(`${insc}?error=${encodeURIComponent(init.error)}`);
}

/** Super admin : enregistre prix + remises par niveau. */
export async function saveCertelPricing(formData: FormData) {
  await requirePermission("platform.manage");
  const num = (k: string) => Number(formData.get(k)) || 0;
  const pricing: CertelPricing = {
    currency: String(formData.get("currency") || "XOF").slice(0, 8) || "XOF",
    levels: {
      N1: { amount: num("N1_amount"), discountPct: num("N1_discountPct") },
      N2: { amount: num("N2_amount"), discountPct: num("N2_discountPct") },
      N3: { amount: num("N3_amount"), discountPct: num("N3_discountPct") },
    },
  };
  await setCertelPricing(pricing);
  revalidatePath(TARIFS_PATH);
  revalidatePath("/certel", "layout");
  redirect(`${TARIFS_PATH}?saved=1`);
}

/** Super admin : accorde manuellement l'accès à un niveau (paiement hors-ligne). */
export async function grantCertelAccess(formData: FormData) {
  await requirePermission("platform.manage");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const levelKey = (String(formData.get("levelKey") || "") as CertelLevelKey);
  if (!email || !["N1", "N2", "N3"].includes(levelKey)) redirect(`${TARIFS_PATH}?error=donnees`);

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, firstName: true, lastName: true } });
  if (!user) redirect(`${TARIFS_PATH}?error=user`);
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const existing = await prisma.certelPayment.findFirst({ where: { userId: user.id, levelKey, status: "PAID" }, select: { id: true } });
  if (!existing) {
    await prisma.certelPayment.create({
      data: { userId: user.id, levelKey, amount: 0, currency: "XOF", status: "PAID", manual: true, transactionId: newTransactionId(levelKey), fullName, paidAt: new Date() },
    });
  }
  revalidatePath(TARIFS_PATH);
  redirect(`${TARIFS_PATH}?granted=1`);
}

/** Super admin : révoque un accès (annule le paiement). */
export async function revokeCertelAccess(formData: FormData) {
  await requirePermission("platform.manage");
  const id = String(formData.get("id") || "");
  if (id) await prisma.certelPayment.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath(TARIFS_PATH);
  redirect(`${TARIFS_PATH}?revoked=1`);
}
