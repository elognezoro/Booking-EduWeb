"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveFinanceScope, type FinanceScope } from "@/lib/finances/scope";
import { nextFinanceNumber } from "@/lib/finances/numbering";
import { normalizeMethod, normalizeCashboxKind, type EntryKind } from "@/lib/finances/constants";
import { importCertelPayments } from "@/lib/finances/certel";

/*
 * Toutes les actions du module Finances :
 * 1. exigent la permission `finances.manage` ;
 * 2. résolvent l'espace (institution / sous-direction) via resolveFinanceScope, qui VÉRIFIE
 *    que l'utilisateur a accès à cet espace — cloisonnement strict ;
 * 3. incluent le filtre { organizationId, departmentId } dans chaque écriture.
 */

const BASE = "/dashboard/finances";

/** Résout l'espace demandé par le formulaire, ou redirige si accès refusé. */
async function requireScope(formData: FormData): Promise<FinanceScope> {
  const user = await requirePermission("finances.manage");
  const scope = await resolveFinanceScope(user, String(formData.get("espace") || ""));
  if (!scope || !scope.canManage) redirect("/dashboard?denied=1");
  return scope;
}

/** Chemin de retour sûr (borné au module Finances). */
function backPath(formData: FormData, scope: FinanceScope, flag = "saved"): string {
  const raw = String(formData.get("back") || BASE);
  const path = raw.startsWith(BASE) ? raw.split("?")[0] : BASE;
  return `${path}?espace=${encodeURIComponent(scope.space.key)}&${flag}=1`;
}

const int = (v: unknown): number => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? n : 0;
};
const txt = (v: unknown, max = 200): string => String(v ?? "").trim().slice(0, max);
const parseDate = (v: unknown): Date => {
  const s = String(v ?? "");
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + "T12:00:00") : new Date(s);
  return Number.isNaN(d.getTime()) ? new Date() : d;
};

/* ----------------------------- Écritures (encaissements / dépenses) ----------------------------- */

export async function createFinanceEntry(formData: FormData) {
  const scope = await requireScope(formData);
  const kind: EntryKind = formData.get("kind") === "EXPENSE" ? "EXPENSE" : "INCOME";
  const amount = int(formData.get("amount"));
  const label = txt(formData.get("label"));
  const back = backPath(formData, scope);
  if (amount <= 0 || !label) redirect(back.replace("saved=1", "error=invalide"));

  // Caisse / catégorie : uniquement celles du MÊME espace (anti-fuite inter-espaces).
  const cashboxId = txt(formData.get("cashboxId")) || null;
  const categoryId = txt(formData.get("categoryId")) || null;
  if (cashboxId) {
    const c = await prisma.financeCashbox.findFirst({ where: { id: cashboxId, ...scope.filter } });
    if (!c) redirect(back.replace("saved=1", "error=caisse"));
  }
  if (categoryId) {
    const c = await prisma.financeCategory.findFirst({ where: { id: categoryId, ...scope.filter, kind } });
    if (!c) redirect(back.replace("saved=1", "error=categorie"));
  }

  const number = await nextFinanceNumber(scope.organizationId, scope.filter.departmentId, kind === "INCOME" ? "REC" : "DEP");
  const user = await requirePermission("finances.manage");
  await prisma.financeEntry.create({
    data: {
      ...scope.filter,
      kind,
      number,
      label,
      amount,
      method: normalizeMethod(formData.get("method")),
      date: parseDate(formData.get("date")),
      thirdParty: txt(formData.get("thirdParty")) || null,
      reference: txt(formData.get("reference"), 80) || null,
      note: txt(formData.get("note"), 500) || null,
      cashboxId,
      categoryId,
      createdById: user.id,
    },
  });
  revalidatePath(BASE);
  redirect(back);
}

export async function deleteFinanceEntry(formData: FormData) {
  const scope = await requireScope(formData);
  const id = txt(formData.get("id"));
  const back = backPath(formData, scope, "deleted");
  const entry = await prisma.financeEntry.findFirst({ where: { id, ...scope.filter } });
  if (!entry) redirect(back.replace("deleted=1", "error=introuvable"));
  // Les recettes CERTEL (synchronisées) ne sont pas supprimables ; un règlement de facture
  // supprimé restitue le montant sur la facture.
  if (entry.source === "CERTEL") redirect(back.replace("deleted=1", "error=certel"));
  await prisma.$transaction(async (tx) => {
    if (entry.source === "INVOICE" && entry.invoiceId) {
      const inv = await tx.financeInvoice.findFirst({ where: { id: entry.invoiceId, organizationId: scope.organizationId } });
      if (inv) {
        const paidAmount = Math.max(0, inv.paidAmount - entry.amount);
        const status = inv.status === "CANCELLED" ? "CANCELLED" : paidAmount <= 0 ? "PENDING" : paidAmount < inv.amount ? "PARTIAL" : "PAID";
        await tx.financeInvoice.update({ where: { id: inv.id }, data: { paidAmount, status } });
      }
    }
    await tx.financeEntry.delete({ where: { id: entry.id } });
  });
  revalidatePath(BASE);
  redirect(back);
}

/* ----------------------------- Caisses & catégories ----------------------------- */

export async function createFinanceCashbox(formData: FormData) {
  const scope = await requireScope(formData);
  const name = txt(formData.get("name"), 80);
  if (name) {
    await prisma.financeCashbox.create({
      data: { ...scope.filter, name, kind: normalizeCashboxKind(formData.get("cashboxKind")) },
    });
  }
  revalidatePath(BASE);
  redirect(backPath(formData, scope));
}

export async function toggleFinanceCashbox(formData: FormData) {
  const scope = await requireScope(formData);
  const id = txt(formData.get("id"));
  const box = await prisma.financeCashbox.findFirst({ where: { id, ...scope.filter } });
  if (box) await prisma.financeCashbox.update({ where: { id: box.id }, data: { active: !box.active } });
  revalidatePath(BASE);
  redirect(backPath(formData, scope));
}

export async function createFinanceCategory(formData: FormData) {
  const scope = await requireScope(formData);
  const name = txt(formData.get("name"), 80);
  const kind: EntryKind = formData.get("kind") === "EXPENSE" ? "EXPENSE" : "INCOME";
  if (name) await prisma.financeCategory.create({ data: { ...scope.filter, name, kind } });
  revalidatePath(BASE);
  redirect(backPath(formData, scope));
}

export async function toggleFinanceCategory(formData: FormData) {
  const scope = await requireScope(formData);
  const id = txt(formData.get("id"));
  const cat = await prisma.financeCategory.findFirst({ where: { id, ...scope.filter } });
  if (cat) await prisma.financeCategory.update({ where: { id: cat.id }, data: { active: !cat.active } });
  revalidatePath(BASE);
  redirect(backPath(formData, scope));
}

/* ----------------------------- Facturation interne ----------------------------- */

export async function createFinanceInvoice(formData: FormData) {
  const scope = await requireScope(formData);
  const amount = int(formData.get("amount"));
  const debtorName = txt(formData.get("debtorName"), 120);
  const label = txt(formData.get("label"));
  const back = backPath(formData, scope);
  if (amount <= 0 || !debtorName || !label) redirect(back.replace("saved=1", "error=invalide"));
  const dueRaw = String(formData.get("dueDate") || "");
  const user = await requirePermission("finances.manage");
  const number = await nextFinanceNumber(scope.organizationId, scope.filter.departmentId, "FAC");
  await prisma.financeInvoice.create({
    data: {
      ...scope.filter,
      number,
      debtorName,
      label,
      amount,
      dueDate: /^\d{4}-\d{2}-\d{2}$/.test(dueRaw) ? new Date(dueRaw + "T12:00:00") : null,
      note: txt(formData.get("note"), 500) || null,
      createdById: user.id,
    },
  });
  revalidatePath(BASE);
  redirect(back);
}

/** Règlement (total ou partiel) : crée l'encaissement lié et met à jour la facture. */
export async function settleFinanceInvoice(formData: FormData) {
  const scope = await requireScope(formData);
  const id = txt(formData.get("id"));
  const amount = int(formData.get("amount"));
  const back = backPath(formData, scope);
  const inv = await prisma.financeInvoice.findFirst({ where: { id, ...scope.filter } });
  if (!inv || inv.status === "CANCELLED" || inv.status === "PAID") redirect(back.replace("saved=1", "error=facture"));
  const remaining = Math.max(0, inv.amount - inv.paidAmount);
  const paid = Math.min(Math.max(1, amount), remaining);
  if (paid <= 0) redirect(back.replace("saved=1", "error=invalide"));

  const user = await requirePermission("finances.manage");
  const number = await nextFinanceNumber(scope.organizationId, scope.filter.departmentId, "REC");
  await prisma.$transaction(async (tx) => {
    await tx.financeEntry.create({
      data: {
        ...scope.filter,
        kind: "INCOME",
        number,
        label: `Règlement ${inv.number} — ${inv.label}`,
        amount: paid,
        method: normalizeMethod(formData.get("method")),
        thirdParty: inv.debtorName,
        source: "INVOICE",
        invoiceId: inv.id,
        createdById: user.id,
      },
    });
    const paidAmount = inv.paidAmount + paid;
    await tx.financeInvoice.update({
      where: { id: inv.id },
      data: { paidAmount, status: paidAmount >= inv.amount ? "PAID" : "PARTIAL" },
    });
  });
  revalidatePath(BASE);
  redirect(back);
}

export async function cancelFinanceInvoice(formData: FormData) {
  const scope = await requireScope(formData);
  const id = txt(formData.get("id"));
  const inv = await prisma.financeInvoice.findFirst({ where: { id, ...scope.filter } });
  if (inv && inv.status !== "PAID") {
    await prisma.financeInvoice.update({ where: { id: inv.id }, data: { status: "CANCELLED" } });
  }
  revalidatePath(BASE);
  redirect(backPath(formData, scope));
}

/* ----------------------------- Synchronisation des recettes CERTEL ----------------------------- */

/** Importe (idempotent) les paiements CERTEL payés comme encaissements de l'espace plateforme. */
export async function syncCertelFinance(formData: FormData) {
  const user = await requirePermission("platform.manage");
  const scope = await resolveFinanceScope(user, String(formData.get("espace") || ""));
  const imported = await importCertelPayments();
  revalidatePath(BASE);
  redirect(`${BASE}?espace=${encodeURIComponent(scope?.space.key ?? "org")}&certel=${imported}`);
}
