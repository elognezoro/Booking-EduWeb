// Petit analyseur CSV robuste (détection du séparateur , ou ; , guillemets, BOM, CRLF).

export function normalizeKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function parseCsv(text: string): string[][] {
  const t = text.replace(/^﻿/, ""); // retire le BOM éventuel
  const firstLine = t.split(/\r?\n/)[0] ?? "";
  const semis = (firstLine.match(/;/g) ?? []).length;
  const commas = (firstLine.match(/,/g) ?? []).length;
  const delim = semis > commas ? ";" : ",";

  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inQuotes) {
      if (c === '"') {
        if (t[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delim) {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  // Ignore les lignes entièrement vides
  return rows.filter((r) => r.some((x) => x.trim() !== ""));
}

/** Index de la première colonne dont l'en-tête correspond à l'un des alias. */
export function findColumn(header: string[], aliases: string[]): number {
  const norm = header.map(normalizeKey);
  for (const a of aliases) {
    const i = norm.indexOf(normalizeKey(a));
    if (i >= 0) return i;
  }
  return -1;
}
