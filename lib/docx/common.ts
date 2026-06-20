import fs from "node:fs";
import path from "node:path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  PageNumber,
  Paragraph,
  SimpleField,
  Table,
  TableCell,
  TableRow,
  TabStopType,
  TextRun,
  WidthType,
} from "docx";

/** Charge le logo PNG de la marque et lit ses dimensions natives (entête IHDR). */
export function loadLogo() {
  const data = fs.readFileSync(path.join(process.cwd(), "public", "brand", "logo-eduweb-booking.png"));
  return { data, width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}
export type Logo = ReturnType<typeof loadLogo>;

function scaledTo(logo: Logo, targetHeight: number) {
  const ratio = logo.width / logo.height || 4;
  return { width: Math.round(targetHeight * ratio), height: targetHeight };
}

const GREEN = "0B5A45";
const INK = "111827";
const SLATE = "374151";
const MUTED = "6B7280";
const FAINT = "9CA3AF";

/* ----------------------------- Entête / pied ----------------------------- */

function brandHeader(logo: Logo, docLabel: string) {
  return new Header({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: 9600 }],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D8D8D8", space: 6 } },
        spacing: { after: 80 },
        children: [
          new ImageRun({ type: "png", data: logo.data, transformation: scaledTo(logo, 26) }),
          new TextRun({ text: `\t${docLabel}`, color: MUTED, size: 16 }),
        ],
      }),
    ],
  });
}

function numberedFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Page ", size: 16, color: MUTED }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED }),
          new TextRun({ text: " / ", size: 16, color: MUTED }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: MUTED }),
        ],
      }),
    ],
  });
}

function emptyFooter() {
  return new Footer({ children: [new Paragraph({})] });
}

/* ----------------------------- Page de garde ----------------------------- */

export function coverParagraphs(
  logo: Logo,
  opts: { kicker: string; title: string; subtitle: string; description?: string; meta?: string[] },
): Paragraph[] {
  const out: Paragraph[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1400, after: 240 }, children: [new ImageRun({ type: "png", data: logo.data, transformation: scaledTo(logo, 90) })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 80 }, children: [new TextRun({ text: opts.kicker.toUpperCase(), bold: true, color: GREEN, size: 24, characterSpacing: 60 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: opts.title, bold: true, color: INK, size: 56 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: opts.subtitle, color: SLATE, size: 30 })] }),
  ];
  if (opts.description) out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 80 }, children: [new TextRun({ text: opts.description, italics: true, color: MUTED, size: 21 })] }));
  for (const m of opts.meta ?? []) out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [new TextRun({ text: m, color: FAINT, size: 18 })] }));
  return out;
}

/* -------------------------- Table des matières --------------------------- */
// Champ TOC Word, mis à jour automatiquement à l'ouverture (features.updateFields)
// ou via la touche F9.

export function tableOfContents(): Paragraph[] {
  return [
    new Paragraph({ pageBreakBefore: true, spacing: { after: 160 }, children: [new TextRun({ text: "Sommaire", bold: true, color: GREEN, size: 40 })] }),
    new Paragraph({ children: [new SimpleField('TOC \\o "1-2" \\h \\z \\u', "Mettez à jour ce champ (clic droit › « Mettre à jour les champs », ou F9) pour générer le sommaire.")] }),
  ];
}

/* ------------------------------ Titres / texte --------------------------- */

export const h1 = (text: string) =>
  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun({ text })] });
export const h2 = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text })] });
export const h3 = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text })] });

export const body = (text: string) => new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, size: 21 })] });
export const callout = (text: string) =>
  new Paragraph({
    spacing: { before: 60, after: 120 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: GREEN, space: 12 } },
    indent: { left: 160 },
    children: [new TextRun({ text, size: 21, color: SLATE })],
  });
export const bullet = (text: string) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 30 }, children: [new TextRun({ text, size: 21 })] });
export const step = (i: number, text: string) =>
  new Paragraph({ indent: { left: 360 }, spacing: { after: 30 }, children: [new TextRun({ text: `${i}. `, bold: true, color: GREEN, size: 21 }), new TextRun({ text, size: 21 })] });
export const sub = (text: string) =>
  new Paragraph({ indent: { left: 540 }, spacing: { after: 24 }, children: [new TextRun({ text: "– ", color: MUTED, size: 21 }), new TextRun({ text, size: 21 })] });
export const label = (lab: string, value: string) =>
  new Paragraph({ spacing: { after: 30 }, children: [new TextRun({ text: `${lab} : `, bold: true, size: 21 }), new TextRun({ text: value, size: 21 })] });

/* -------------------------------- Tableau -------------------------------- */

export function simpleTable(headers: string[], rows: string[][]): Table {
  const b = { style: BorderStyle.SINGLE, size: 2, color: "D8D8D8" };
  const borders = { top: b, bottom: b, left: b, right: b, insideHorizontal: b, insideVertical: b };
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h) => new TableCell({ shading: { fill: "EEF2F0" }, children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 19 })] })] })),
  });
  const bodyRows = rows.map(
    (r) => new TableRow({ children: r.map((c) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c, size: 19 })] })] })) }),
  );
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders, rows: [headerRow, ...bodyRows] });
}

export const spacer = () => new Paragraph({ spacing: { after: 60 }, children: [] });

/* ------------------------------ Assemblage ------------------------------- */

export function buildDocument(opts: { docLabel: string; cover: Paragraph[]; body: (Paragraph | Table)[]; withToc?: boolean }): Document {
  const logo = loadLogo();
  const heading = (size: number, color: string) => ({ run: { size, bold: true, color }, paragraph: { spacing: { before: 220, after: 100 }, keepNext: true } });
  return new Document({
    features: { updateFields: true },
    styles: {
      default: { document: { run: { font: "Calibri", size: 21, color: INK } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, ...heading(32, GREEN) },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, ...heading(26, INK) },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, ...heading(23, SLATE) },
      ],
    },
    sections: [
      {
        properties: {
          page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1080, right: 1080, header: 600, footer: 600 } },
          titlePage: true,
        },
        headers: { first: brandHeader(logo, opts.docLabel), default: brandHeader(logo, opts.docLabel) },
        footers: { first: emptyFooter(), default: numberedFooter() },
        children: [...opts.cover, ...(opts.withToc === false ? [] : tableOfContents()), ...opts.body],
      },
    ],
  });
}
