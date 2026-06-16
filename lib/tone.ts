import type { Tone } from "./enums";

/** Classes (fond doux + texte) selon l'intention visuelle EduWeb. */
export const TONE_CLASSES: Record<Tone, string> = {
  available: "bg-available-soft text-available-fg ring-1 ring-inset ring-available/20",
  pending: "bg-pending-soft text-pending-fg ring-1 ring-inset ring-pending/20",
  unavailable: "bg-unavailable-soft text-unavailable-fg ring-1 ring-inset ring-unavailable/20",
  advanced: "bg-advanced-soft text-advanced-fg ring-1 ring-inset ring-advanced/20",
  info: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  neutral: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
};

export const TONE_DOT: Record<Tone, string> = {
  available: "bg-available",
  pending: "bg-pending",
  unavailable: "bg-unavailable",
  advanced: "bg-advanced",
  info: "bg-sky-500",
  neutral: "bg-muted-foreground/50",
};

export const TONE_SOLID: Record<Tone, string> = {
  available: "bg-available text-white",
  pending: "bg-pending text-white",
  unavailable: "bg-unavailable text-white",
  advanced: "bg-advanced text-white",
  info: "bg-sky-500 text-white",
  neutral: "bg-muted-foreground text-white",
};
