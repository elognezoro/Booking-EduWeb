import "server-only";
import { prisma } from "@/lib/prisma";

export interface GamesGating {
  enabled: boolean; // le verrouillage par abonnement est-il actif ?
  freeCount: number; // nombre de jeux offerts (mode « rotation aléatoire »)
  mode: "random" | "fixed";
  freeSlugs: string[]; // jeux offerts (mode « fixe »)
}

const KEY = "games_gating";
export const GATING_DEFAULTS: GamesGating = { enabled: true, freeCount: 3, mode: "random", freeSlugs: [] };

export async function getGamesGating(): Promise<GamesGating> {
  const row = await prisma.platformSetting.findUnique({ where: { key: KEY } });
  if (!row) return GATING_DEFAULTS;
  try {
    const v = JSON.parse(row.value);
    return {
      enabled: typeof v.enabled === "boolean" ? v.enabled : GATING_DEFAULTS.enabled,
      freeCount: Number.isFinite(v.freeCount) ? Math.max(0, Math.min(20, Math.round(v.freeCount))) : GATING_DEFAULTS.freeCount,
      mode: v.mode === "fixed" ? "fixed" : "random",
      freeSlugs: Array.isArray(v.freeSlugs) ? v.freeSlugs.filter((s: unknown) => typeof s === "string") : [],
    };
  } catch {
    return GATING_DEFAULTS;
  }
}

export async function setGamesGating(g: GamesGating): Promise<void> {
  await prisma.platformSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, value: JSON.stringify(g) },
    update: { value: JSON.stringify(g) },
  });
}

// ——— Déconnexion automatique après inactivité (réglée par l'administrateur système) ———
const INACTIVITY_KEY = "inactivity_logout";
const INACTIVITY_MAX = 480; // 8 h max

/** Délai d'inactivité avant déconnexion automatique, en minutes (0 = désactivé). */
export async function getInactivityLogoutMinutes(): Promise<number> {
  const row = await prisma.platformSetting.findUnique({ where: { key: INACTIVITY_KEY } });
  if (!row) return 0;
  try {
    const v = JSON.parse(row.value);
    const m = Number(v?.minutes);
    return Number.isFinite(m) ? Math.max(0, Math.min(INACTIVITY_MAX, Math.round(m))) : 0;
  } catch {
    return 0;
  }
}

export async function setInactivityLogoutMinutes(minutes: number): Promise<void> {
  const m = Number.isFinite(minutes) ? Math.max(0, Math.min(INACTIVITY_MAX, Math.round(minutes))) : 0;
  await prisma.platformSetting.upsert({
    where: { key: INACTIVITY_KEY },
    create: { key: INACTIVITY_KEY, value: JSON.stringify({ minutes: m }) },
    update: { value: JSON.stringify({ minutes: m }) },
  });
}

// ——— Certificat CERTEL Niveau 1 : date de signature & lieu (réglés par le super admin) ———
export interface CertelCertConfig { signatureDate: string; lieu: string } // signatureDate : "AAAA-MM-JJ" ou ""
const CERTEL_CERT_KEY = "certel_cert_n1";
export const CERTEL_CERT_DEFAULTS: CertelCertConfig = { signatureDate: "", lieu: "" };

/** Valide une date calendaire réelle au format "AAAA-MM-JJ" (rejette 2026-02-30, 2026-13-01…). */
function validIsoDate(s: unknown): string {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return "";
  const d = new Date(s + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s ? s : "";
}

export async function getCertelCertConfig(): Promise<CertelCertConfig> {
  const row = await prisma.platformSetting.findUnique({ where: { key: CERTEL_CERT_KEY } });
  if (!row) return CERTEL_CERT_DEFAULTS;
  try {
    const v = JSON.parse(row.value);
    const lieu = typeof v?.lieu === "string" ? v.lieu.slice(0, 120) : "";
    return { signatureDate: validIsoDate(v?.signatureDate), lieu };
  } catch {
    return CERTEL_CERT_DEFAULTS;
  }
}

export async function setCertelCertConfig(c: CertelCertConfig): Promise<void> {
  const signatureDate = validIsoDate(c.signatureDate);
  const lieu = (c.lieu ?? "").trim().slice(0, 120);
  await prisma.platformSetting.upsert({
    where: { key: CERTEL_CERT_KEY },
    create: { key: CERTEL_CERT_KEY, value: JSON.stringify({ signatureDate, lieu }) },
    update: { value: JSON.stringify({ signatureDate, lieu }) },
  });
}
