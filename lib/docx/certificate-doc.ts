import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { loadLogo } from "./common";
import type { CertificateView } from "@/components/certificates/certificate-document";

const GREEN = "0B5A45";
const INK = "111827";
const MUTED = "6B7280";

type ImgType = "png" | "jpg" | "gif" | "bmp";

function parseDataUrl(d?: string | null): { type: ImgType; data: Buffer } | null {
  if (!d || !d.startsWith("data:image/")) return null;
  const m = d.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.*)$/s);
  if (!m) return null;
  const map: Record<string, ImgType> = { png: "png", jpeg: "jpg", jpg: "jpg", gif: "gif", bmp: "bmp" };
  const type = map[m[1].toLowerCase()];
  if (!type) return null;
  try {
    return { type, data: Buffer.from(m[2], "base64") };
  } catch {
    return null;
  }
}

function imageSize(buf: Buffer, type: ImgType): { w: number; h: number } | null {
  try {
    if (type === "png") return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    if (type === "jpg") {
      let off = 2;
      while (off < buf.length - 8) {
        if (buf[off] !== 0xff) {
          off++;
          continue;
        }
        const marker = buf[off + 1];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { h: buf.readUInt16BE(off + 5), w: buf.readUInt16BE(off + 7) };
        }
        off += 2 + buf.readUInt16BE(off + 2);
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

function fit(size: { w: number; h: number } | null, maxW: number, maxH: number, fallback: { w: number; h: number }) {
  if (!size || !size.w || !size.h) return fallback;
  const ratio = Math.min(maxW / size.w, maxH / size.h);
  return { w: Math.round(size.w * ratio), h: Math.round(size.h * ratio) };
}

function imageRun(dataUrl: string | null | undefined, maxW: number, maxH: number, fallback: { w: number; h: number }) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  const dim = fit(imageSize(parsed.data, parsed.type), maxW, maxH, fallback);
  return new ImageRun({ type: parsed.type, data: parsed.data, transformation: { width: dim.w, height: dim.h } });
}

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER, insideHorizontal: NO_BORDER, insideVertical: NO_BORDER };

export async function buildCertificateDocx(
  cert: CertificateView,
  opts: { orgName: string; orgCity?: string | null; signatureImage?: string | null; stampImage?: string | null },
): Promise<Buffer> {
  const logo = loadLogo();
  const logoRatio = logo.width / logo.height || 4;

  const sig = imageRun(opts.signatureImage, 200, 80, { w: 0, h: 0 });
  const stamp = imageRun(opts.stampImage, 130, 130, { w: 0, h: 0 });

  const rightChildren: Paragraph[] = [];
  if (sig) rightChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [sig] }));
  rightChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: sig ? 0 : 600 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB", space: 2 } }, children: [new TextRun({ text: cert.signatoryName || "Le responsable", bold: true, size: 22 })] }));
  if (cert.signatoryTitle) rightChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: cert.signatoryTitle, color: MUTED, size: 18 })] }));
  if (stamp) rightChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 }, children: [stamp] }));

  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            borders: NO_BORDERS,
            verticalAlign: VerticalAlign.BOTTOM,
            children: [
              new Paragraph({ children: [new TextRun({ text: `Fait à ${opts.orgCity || "—"}, le ${cert.issuedOn}`, size: 20 })] }),
              new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: `N° ${cert.number}`, size: 18, color: MUTED })] }),
            ],
          }),
          new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, borders: NO_BORDERS, verticalAlign: VerticalAlign.BOTTOM, children: rightChildren }),
        ],
      }),
    ],
  });

  const children: (Paragraph | Table)[] = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 120 }, children: [new ImageRun({ type: "png", data: logo.data, transformation: { width: Math.round(46 * logoRatio), height: 46 } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: cert.title.toUpperCase(), bold: true, color: GREEN, size: 40, characterSpacing: 80 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GREEN, space: 6 } }, children: [] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: `L'établissement ${opts.orgName} atteste que`, size: 22, color: MUTED })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: cert.recipientName, bold: true, color: INK, size: 44 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: cert.mention, size: 24 })] }),
  ];

  const meta: string[] = [];
  if (cert.parcours) meta.push(`Parcours : ${cert.parcours}`);
  if (cert.hours) meta.push(`Durée : ${cert.hours}`);
  if (meta.length) children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: meta.join("     ·     "), size: 20, color: MUTED })] }));

  if (cert.status === "REVOKED")
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "— CERTIFICAT RÉVOQUÉ —", bold: true, color: "B91C1C", size: 24 })] }));

  children.push(new Paragraph({ spacing: { before: 240 }, children: [] }));
  children.push(footerTable);

  const doc = new Document({
    styles: { default: { document: { run: { font: "Calibri", color: INK } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 16838, height: 11906 }, // A4 paysage
            margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 },
            borders: {
              pageBorderLeft: { style: BorderStyle.SINGLE, size: 18, color: GREEN, space: 24 },
              pageBorderRight: { style: BorderStyle.SINGLE, size: 18, color: GREEN, space: 24 },
              pageBorderTop: { style: BorderStyle.SINGLE, size: 18, color: GREEN, space: 24 },
              pageBorderBottom: { style: BorderStyle.SINGLE, size: 18, color: GREEN, space: 24 },
            },
          },
        },
        children,
      },
    ],
  });
  return Packer.toBuffer(doc);
}
