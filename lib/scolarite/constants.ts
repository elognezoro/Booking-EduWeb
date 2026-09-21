import type { Tone } from "@/lib/enums";

// Constantes partagées (client-safe) du module Scolarité / Enrôlement.
// La formation à l'ENS d'Abidjan dure DEUX années : Première année et Deuxième année.

export const STUDENT_YEARS: { value: 1 | 2; label: string; short: string }[] = [
  { value: 1, label: "Première année", short: "1ʳᵉ année" },
  { value: 2, label: "Deuxième année", short: "2ᵉ année" },
];

export function yearLabel(year: number, short = false): string {
  const y = STUDENT_YEARS.find((x) => x.value === year);
  return y ? (short ? y.short : y.label) : `Année ${year}`;
}

export type StudentStatus = "ACTIVE" | "DIPLOME" | "ARCHIVE";

export const STUDENT_STATUS: Record<StudentStatus, { label: string; tone: Tone }> = {
  ACTIVE: { label: "Actif", tone: "available" },
  DIPLOME: { label: "Diplômé", tone: "info" },
  ARCHIVE: { label: "Archivé", tone: "neutral" },
};

export function normalizeStudentStatus(v: unknown): StudentStatus {
  return v === "DIPLOME" || v === "ARCHIVE" ? v : "ACTIVE";
}

/** Année académique courante (rentrée en septembre) : ex. le 21/09/2026 → « 2026-2027 ». */
export function currentAcademicYear(now: Date = new Date()): string {
  const y = now.getFullYear();
  return now.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

/** Année académique suivante : « 2026-2027 » → « 2027-2028 ». */
export function nextAcademicYear(ay: string): string {
  const m = ay.match(/^(\d{4})-(\d{4})$/);
  if (!m) return ay;
  return `${Number(m[1]) + 1}-${Number(m[2]) + 1}`;
}

/** Options proposées dans les formulaires (précédente, courante, suivante). */
export function academicYearOptions(now: Date = new Date()): string[] {
  const cur = currentAcademicYear(now);
  const [a, b] = cur.split("-").map(Number);
  return [`${a - 1}-${b - 1}`, cur, `${a + 1}-${b + 1}`];
}

/** Valide « AAAA-AAAA » consécutives ; repli sur l'année courante. */
export function normalizeAcademicYear(v: unknown, now: Date = new Date()): string {
  const s = String(v ?? "").trim();
  const m = s.match(/^(\d{4})-(\d{4})$/);
  return m && Number(m[2]) === Number(m[1]) + 1 ? s : currentAcademicYear(now);
}
