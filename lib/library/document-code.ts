// EduWeb Booking Library — codification automatique des ressources documentaires.
// Code long  : EBL-CI-ORG-UNIT-COL-TYPE-DOM-YYYY-00001
// Code court : TYPE-DOM-YYYY-001
// Code temp  : EBL-CI-ORG-UNIT-COL-TYPE-DOM-YYYY-TMP-004
import { prisma } from "@/lib/prisma";

export interface CodeInput {
  countryCode?: string | null;
  organizationCode?: string | null;
  unitCode?: string | null;
  collectionCode?: string | null;
  documentTypeCode: string;
  domainCode: string;
  year: number;
}

/** Normalise un fragment de code : majuscules, sans accents/espaces/caractères spéciaux. */
function sanitize(value: string | null | undefined, fallback: string, max = 8): string {
  const v = (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return v.slice(0, max) || fallback;
}

function pad(n: number, width: number) {
  return String(n).padStart(width, "0");
}

function normalizeCountry(country: string | null | undefined): string {
  if (!country) return "CI";
  if (country.toLowerCase().includes("ivoire") || country.toLowerCase().includes("ivory")) return "CI";
  return sanitize(country, "CI", 3);
}

/** Incrémente atomiquement un compteur et renvoie la nouvelle valeur. */
async function nextSeq(key: string): Promise<number> {
  const counter = await prisma.documentCodeCounter.upsert({
    where: { key },
    create: { key, count: 1 },
    update: { count: { increment: 1 } },
  });
  return counter.count;
}

function buildFragments(input: CodeInput) {
  return {
    country: normalizeCountry(input.countryCode),
    org: sanitize(input.organizationCode, "ORG"),
    unit: sanitize(input.unitCode, "GEN"),
    col: sanitize(input.collectionCode, "COL"),
    type: sanitize(input.documentTypeCode, "DOC", 4),
    dom: sanitize(input.domainCode, "GEN", 6),
    year: input.year,
  };
}

/** Génère un code provisoire (au dépôt). */
export async function generateTemporaryCode(input: CodeInput): Promise<string> {
  const f = buildFragments(input);
  const key = `TMP|${f.country}|${f.org}|${f.unit}|${f.col}|${f.type}|${f.dom}|${f.year}`;
  const seq = await nextSeq(key);
  return `EBL-${f.country}-${f.org}-${f.unit}-${f.col}-${f.type}-${f.dom}-${f.year}-TMP-${pad(seq, 3)}`;
}

/** Génère le code définitif (long + court) à la validation. Concurrence gérée par compteurs. */
export async function generateDocumentCode(input: CodeInput): Promise<{ codeLong: string; codeShort: string }> {
  const f = buildFragments(input);
  const longKey = `LONG|${f.country}|${f.org}|${f.unit}|${f.col}|${f.type}|${f.dom}|${f.year}`;
  const shortKey = `SHORT|${f.type}|${f.dom}|${f.year}`;

  // Quelques tentatives pour absorber une éventuelle collision (contrainte unique).
  for (let attempt = 0; attempt < 5; attempt++) {
    const longSeq = await nextSeq(longKey);
    const shortSeq = await nextSeq(shortKey);
    const codeLong = `EBL-${f.country}-${f.org}-${f.unit}-${f.col}-${f.type}-${f.dom}-${f.year}-${pad(longSeq, 5)}`;
    const codeShort = `${f.type}-${f.dom}-${f.year}-${pad(shortSeq, 3)}`;

    const exists = await prisma.documentResource.findFirst({ where: { codeLong }, select: { id: true } });
    if (!exists) return { codeLong, codeShort };
  }
  throw new Error("Impossible de générer un code documentaire unique.");
}
