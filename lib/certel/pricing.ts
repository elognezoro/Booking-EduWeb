import "server-only";
import { prisma } from "@/lib/prisma";

export type CertelLevelKey = "N1" | "N2" | "N3";
export const CERTEL_LEVELS: CertelLevelKey[] = ["N1", "N2", "N3"];

export interface CertelLevelPrice { amount: number; discountPct: number }
export interface CertelPricing { currency: string; levels: Record<CertelLevelKey, CertelLevelPrice> }

const KEY = "certel_pricing";
export const CERTEL_PRICING_DEFAULTS: CertelPricing = {
  currency: "XOF",
  levels: { N1: { amount: 0, discountPct: 0 }, N2: { amount: 0, discountPct: 0 }, N3: { amount: 0, discountPct: 0 } },
};

const clampInt = (n: unknown, min: number, max: number, def: number) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.max(min, Math.min(max, Math.round(v))) : def;
};

/** "niveau-1" → "N1" ; "N2" → "N2". Renvoie null si inconnu. */
export function slugToLevel(slug: string): CertelLevelKey | null {
  const n = (slug || "").replace(/\D/g, "");
  return n === "1" ? "N1" : n === "2" ? "N2" : n === "3" ? "N3" : null;
}
/** "N1" → "niveau-1". */
export function levelToSlug(levelKey: CertelLevelKey): string {
  return `niveau-${levelKey.replace(/\D/g, "")}`;
}

export async function getCertelPricing(): Promise<CertelPricing> {
  const row = await prisma.platformSetting.findUnique({ where: { key: KEY } });
  if (!row) return CERTEL_PRICING_DEFAULTS;
  try {
    const v = JSON.parse(row.value);
    const lv = (k: CertelLevelKey): CertelLevelPrice => ({
      amount: clampInt(v?.levels?.[k]?.amount, 0, 100_000_000, 0),
      discountPct: clampInt(v?.levels?.[k]?.discountPct, 0, 100, 0),
    });
    return {
      currency: typeof v?.currency === "string" && v.currency ? v.currency.slice(0, 8) : "XOF",
      levels: { N1: lv("N1"), N2: lv("N2"), N3: lv("N3") },
    };
  } catch {
    return CERTEL_PRICING_DEFAULTS;
  }
}

export async function setCertelPricing(p: CertelPricing): Promise<void> {
  const lv = (x: CertelLevelPrice): CertelLevelPrice => ({
    amount: clampInt(x?.amount, 0, 100_000_000, 0),
    discountPct: clampInt(x?.discountPct, 0, 100, 0),
  });
  const clean: CertelPricing = {
    currency: (p.currency || "XOF").slice(0, 8),
    levels: { N1: lv(p.levels.N1), N2: lv(p.levels.N2), N3: lv(p.levels.N3) },
  };
  await prisma.platformSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, value: JSON.stringify(clean) },
    update: { value: JSON.stringify(clean) },
  });
}

/**
 * Prix net après remise. Pour XOF, arrondi au multiple de 5 (contrainte CinetPay).
 * 0 = niveau gratuit (aucun paiement requis).
 */
export function netAmount(price: CertelLevelPrice | undefined, currency = "XOF"): number {
  if (!price || price.amount <= 0) return 0;
  const net = price.amount * (1 - (price.discountPct || 0) / 100);
  if (net <= 0) return 0;
  return currency === "XOF" ? Math.max(0, Math.round(net / 5) * 5) : Math.max(0, Math.round(net));
}
