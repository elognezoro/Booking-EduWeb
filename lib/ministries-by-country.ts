// Listes de référence de ministères par pays (pour pré-remplir le modèle CSV).
// Extensible : ajoutez d'autres pays en important leur liste et en l'indexant par nom de pays.
import { CI_MINISTRIES, type RefMinistry } from "./ci-ministries";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const BY_COUNTRY: Record<string, RefMinistry[]> = {
  [norm("Côte d'Ivoire")]: CI_MINISTRIES,
};

/** Liste de ministères de référence pour un pays (par nom), ou null si non connue. */
export function ministriesForCountry(country?: string | null): RefMinistry[] | null {
  if (!country) return null;
  return BY_COUNTRY[norm(country)] ?? null;
}
