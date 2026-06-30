import type { N1Module } from "./types";
import { MODULE_1 } from "./module1";
import { MODULE_2 } from "./module2";
import { MODULE_3 } from "./module3";
import { MODULE_4 } from "./module4";
import { MODULE_5 } from "./module5";
import { MODULE_6 } from "./module6";

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

/** Les 6 modules du Niveau 1 (tous interactifs). */
const ALL: N1Module[] = [MODULE_1, MODULE_2, MODULE_3, MODULE_4, MODULE_5, MODULE_6];

export const N1_MODULES_META: N1ModuleMeta[] = ALL.map((m) => ({
  num: m.num, code: m.code, slug: m.slug, title: m.title, subtitle: m.subtitle, duration: m.duration, available: true,
}));

const REGISTRY: Record<string, N1Module> = Object.fromEntries(ALL.map((m) => [m.slug, m]));

export function getN1Module(slug: string): N1Module | undefined {
  return REGISTRY[slug];
}
