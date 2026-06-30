import type { N1Module } from "../niveau1/types";
import { MODULE_1 } from "./module1";
import { MODULE_2 } from "./module2";
import { MODULE_3 } from "./module3";
import { MODULE_4 } from "./module4";
import { MODULE_5 } from "./module5";
import { MODULE_6 } from "./module6";

/** Accent visuel du Niveau 3 (cohérent avec CERTEL_LEVELS). */
export const N3_ACCENT = "#0B5A45";

export interface N3ModuleMeta {
  num: number;
  code: string;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  available: boolean;
}

const ALL: N1Module[] = [MODULE_1, MODULE_2, MODULE_3, MODULE_4, MODULE_5, MODULE_6];

export const N3_MODULES_META: N3ModuleMeta[] = ALL.map((m) => ({
  num: m.num, code: m.code, slug: m.slug, title: m.title, subtitle: m.subtitle, duration: m.duration, available: true,
}));

const REGISTRY: Record<string, N1Module> = Object.fromEntries(ALL.map((m) => [m.slug, m]));

export function getN3Module(slug: string): N1Module | undefined {
  return REGISTRY[slug];
}
