import type { CashboxKind, EntryKind } from "./constants";

/**
 * Suggestions de paramétrage (client-safe) : exemples concrets proposés en un clic
 * sur la page Paramètres financiers, adaptés aux institutions et sous-directions
 * (universités, ENS, directions, services). Simples propositions — chaque espace
 * reste libre de créer ses propres caisses et catégories.
 */

export interface CashboxPreset {
  name: string;
  kind: CashboxKind;
}

export const CASHBOX_PRESETS: CashboxPreset[] = [
  { name: "Caisse principale", kind: "CASH" },
  { name: "Caisse secrétariat", kind: "CASH" },
  { name: "Compte bancaire principal", kind: "BANK" },
  { name: "Orange Money", kind: "MOBILE_MONEY" },
  { name: "Wave", kind: "MOBILE_MONEY" },
  { name: "MTN MoMo", kind: "MOBILE_MONEY" },
];

export const CATEGORY_PRESETS: Record<EntryKind, string[]> = {
  INCOME: [
    "Scolarité & inscriptions",
    "Frais de dossiers",
    "Formations & séminaires",
    "Location de salles & équipements",
    "Prestations & expertises",
    "Vente de documents & supports",
    "Subventions & dotations",
    "Dons & partenariats",
  ],
  EXPENSE: [
    "Salaires & indemnités",
    "Fournitures de bureau",
    "Équipements & maintenance",
    "Eau & électricité",
    "Internet & téléphone",
    "Carburant & déplacements",
    "Missions & formations",
    "Entretien & réparations",
    "Frais bancaires",
  ],
};

/** Filtre les suggestions dont le nom existe déjà dans l'espace (insensible à la casse). */
export function remainingPresets<T extends { name: string } | string>(presets: T[], existingNames: string[]): T[] {
  const taken = new Set(existingNames.map((n) => n.trim().toLowerCase()));
  return presets.filter((p) => !taken.has((typeof p === "string" ? p : p.name).trim().toLowerCase()));
}
