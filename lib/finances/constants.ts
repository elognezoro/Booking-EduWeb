import type { Tone } from "@/lib/enums";

// Constantes partagées (client-safe) du module Finances.

export type EntryKind = "INCOME" | "EXPENSE";

export const ENTRY_KINDS: Record<EntryKind, { label: string; tone: Tone; prefix: string }> = {
  INCOME: { label: "Encaissement", tone: "available", prefix: "REC" },
  EXPENSE: { label: "Dépense", tone: "unavailable", prefix: "DEP" },
};

export type PaymentMethod = "CASH" | "MOBILE_MONEY" | "CHEQUE" | "TRANSFER" | "CARD";

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  CASH: "Espèces",
  MOBILE_MONEY: "Mobile Money",
  CHEQUE: "Chèque",
  TRANSFER: "Virement",
  CARD: "Carte bancaire",
};

export const PAYMENT_METHOD_KEYS = Object.keys(PAYMENT_METHODS) as PaymentMethod[];

export function normalizeMethod(v: unknown): PaymentMethod {
  return typeof v === "string" && v in PAYMENT_METHODS ? (v as PaymentMethod) : "CASH";
}

export type CashboxKind = "CASH" | "BANK" | "MOBILE_MONEY";

export const CASHBOX_KINDS: Record<CashboxKind, string> = {
  CASH: "Caisse (espèces)",
  BANK: "Compte bancaire",
  MOBILE_MONEY: "Compte Mobile Money",
};

export function normalizeCashboxKind(v: unknown): CashboxKind {
  return typeof v === "string" && v in CASHBOX_KINDS ? (v as CashboxKind) : "CASH";
}

export type InvoiceStatus = "PENDING" | "PARTIAL" | "PAID" | "CANCELLED";

export const INVOICE_STATUS: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  PENDING: { label: "À recouvrer", tone: "pending" },
  PARTIAL: { label: "Partiellement réglée", tone: "info" },
  PAID: { label: "Soldée", tone: "available" },
  CANCELLED: { label: "Annulée", tone: "neutral" },
};

/** Sources d'écriture (traçabilité). */
export const ENTRY_SOURCES: Record<string, string> = {
  MANUAL: "Saisie manuelle",
  CERTEL: "Paiement CERTEL (CinetPay)",
  INVOICE: "Règlement de facture",
};
