import { MODULE_1 } from "./module1";
import type { N1Module } from "./types";

export * from "./types";

/** Accent visuel du Niveau 1 (cohérent avec CERTEL_LEVELS). */
export const N1_ACCENT = "#0891B2";

export interface N1ModuleMeta {
  num: number;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  available: boolean;
}

/** Les 6 modules du Niveau 1 (M1 interactif ; M2–M6 à venir). */
export const N1_MODULES_META: N1ModuleMeta[] = [
  { num: 1, code: "N1-M1", slug: "module-1", title: MODULE_1.title, subtitle: MODULE_1.subtitle, duration: MODULE_1.duration, available: true },
  { num: 2, code: "N1-M2", slug: "module-2", title: "Traitement de texte professionnel avec Word", subtitle: "Rédiger, mettre en forme et structurer des documents lisibles et conformes.", duration: "18 heures · 2 semaines", available: false },
  { num: 3, code: "N1-M3", slug: "module-3", title: "Tableur Excel et calculs simples", subtitle: "Construire des tableaux, saisir des données et automatiser des calculs de base.", duration: "18 heures · 2 semaines", available: false },
  { num: 4, code: "N1-M4", slug: "module-4", title: "Présentations claires avec PowerPoint", subtitle: "Concevoir une présentation simple, lisible et efficace.", duration: "15 heures · 2 semaines", available: false },
  { num: 5, code: "N1-M5", slug: "module-5", title: "Internet, e-mail, cloud et collaboration en ligne", subtitle: "Naviguer, communiquer par e-mail et collaborer dans le cloud en toute sécurité.", duration: "18 heures · 2 semaines", available: false },
  { num: 6, code: "N1-M6", slug: "module-6", title: "Sécurité numérique et initiation à l'IA générative", subtitle: "Protéger ses données et utiliser l'IA générative avec prudence et esprit critique.", duration: "18 heures · 2 semaines", available: false },
];

const REGISTRY: Record<string, N1Module> = {
  [MODULE_1.slug]: MODULE_1,
};

export function getN1Module(slug: string): N1Module | undefined {
  return REGISTRY[slug];
}
