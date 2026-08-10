// Formatage monétaire partagé (montants stockés en Int, unité entière FCFA).

/** Libellé de devise affiché ("XOF" → "FCFA"). */
export function currencyLabel(currency: string = "XOF"): string {
  return currency === "XOF" ? "FCFA" : currency;
}

/** Formate un montant : `12 500 FCFA`. */
export function fmtMoney(amount: number, currency: string = "XOF"): string {
  return `${Math.round(amount).toLocaleString("fr-FR")} ${currencyLabel(currency)}`;
}

/** Formate un montant sans devise : `12 500`. */
export function fmtAmount(amount: number): string {
  return Math.round(amount).toLocaleString("fr-FR");
}
