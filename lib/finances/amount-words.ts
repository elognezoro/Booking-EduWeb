// Montant en toutes lettres (français) pour les reçus — francs CFA.
// Orthographe traditionnelle : « vingt et un », « quatre-vingts », « deux cents », « mille » invariable.

const UNITS = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
  "dix-sept", "dix-huit", "dix-neuf",
];
const TENS: Record<number, string> = { 2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante", 8: "quatre-vingt" };

/** 0..99 en lettres. */
function under100(n: number): string {
  if (n < 20) return UNITS[n];
  const t = Math.floor(n / 10);
  const r = n % 10;
  // 70-79 et 90-99 : base 60 / 80 + 10..19.
  if (t === 7 || t === 9) {
    const base = t === 7 ? TENS[6] : TENS[8];
    const rest = n - (t === 7 ? 60 : 80);
    if (t === 7 && rest === 11) return "soixante et onze";
    return `${base}-${UNITS[rest]}`;
  }
  const base = TENS[t];
  if (r === 0) return t === 8 ? "quatre-vingts" : base;
  if (r === 1 && t !== 8) return `${base} et un`;
  return `${base}-${UNITS[r]}`;
}

/** 0..999 en lettres. */
function under1000(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h === 0) return under100(n);
  const hundred = h === 1 ? "cent" : r === 0 ? `${UNITS[h]} cents` : `${UNITS[h]} cent`;
  return r === 0 ? hundred : `${hundred} ${under100(r)}`;
}

/** Entier positif en lettres (jusqu'aux milliards). */
export function numberToWordsFr(n: number): string {
  n = Math.max(0, Math.round(n));
  if (n === 0) return "zéro";
  const parts: string[] = [];
  const billions = Math.floor(n / 1_000_000_000);
  const millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1_000);
  const rest = n % 1_000;
  if (billions) parts.push(`${under1000(billions)} milliard${billions > 1 ? "s" : ""}`);
  if (millions) parts.push(`${under1000(millions)} million${millions > 1 ? "s" : ""}`);
  // Devant « mille » (adjectif numéral), « cent » et « vingt » restent invariables :
  // « cinq cent mille », « quatre-vingt mille » (mais « quatre-vingts millions »).
  if (thousands) parts.push(thousands === 1 ? "mille" : `${under1000(thousands).replace(/(cent|vingt)s$/, "$1")} mille`);
  if (rest) parts.push(under1000(rest));
  return parts.join(" ");
}

/** Montant FCFA en toutes lettres : « deux cent cinquante mille francs CFA ». */
export function amountToWordsFcfa(amount: number): string {
  const n = Math.max(0, Math.round(amount));
  const words = numberToWordsFr(n);
  // « … millions DE francs » quand le nombre se termine par million(s)/milliard(s).
  const de = /(million|milliard)s?$/.test(words) ? " de" : "";
  return `${words}${de} franc${n > 1 ? "s" : ""} CFA`;
}
