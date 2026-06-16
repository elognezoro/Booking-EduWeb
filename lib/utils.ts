import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(firstName?: string | null, lastName?: string | null) {
  return `${(firstName ?? "").charAt(0)}${(lastName ?? "").charAt(0)}`.toUpperCase() || "?";
}

export function fullName(u?: { firstName?: string | null; lastName?: string | null } | null) {
  if (!u) return "";
  return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
}

/** Prénom : première lettre de chaque composante en majuscule (ex. "elogne guessan" → "Elogne Guessan"). */
export function formatGivenName(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|[\s'’-])(\p{L})/gu, (_m, sep, ch) => sep + ch.toUpperCase());
}

/** Nom : toutes les lettres en majuscules (ex. "zoro" → "ZORO"). */
export function formatFamilyName(value: string): string {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

/** Matricule (n° d'inscription) d'un étudiant de l'ENS d'Abidjan, ex. « 23-B-P17498IPS/SP ». */
export const ENS_MATRICULE_EXAMPLE = "23-B-P17498IPS/SP";
export const ENS_MATRICULE_REGEX = /^\d{2}-[A-Z0-9]+-[A-Z0-9]+\/[A-Z0-9]+$/;
export function isEnsMatricule(value: string): boolean {
  return ENS_MATRICULE_REGEX.test(value.trim().toUpperCase());
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count <= 1 ? singular : plural ?? `${singular}s`;
}

export function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(value: string, max = 120) {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}
