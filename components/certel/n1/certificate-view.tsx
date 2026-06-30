"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";

/**
 * Rendu imprimable du certificat CERTEL Niveau 1 : image de fond + champs superposés.
 * Tailles en cqw (unités de conteneur) → identiques à l'écran et à l'impression (A4 paysage).
 * Positions en % de l'image de fond (1491×1055 ≈ A4 paysage). Bouton « PDF » → window.print().
 */
const SERIF = "Georgia, 'Times New Roman', serif";
type Anchor = "center" | "left";
interface FieldPos { top: string; left: string; size: string; color: string; weight: number; anchor?: Anchor; maxw?: string }

// Positions calées sur l'image public/certel/certificat-niveau1.png.
const POS: Record<string, FieldPos> = {
  name: { top: "53.5%", left: "50%", size: "3.1cqw", color: "#0d4d38", weight: 700, anchor: "center" },
  date: { top: "70%", left: "36.5%", size: "1.6cqw", color: "#1f2937", weight: 600, anchor: "left" },
  lieu: { top: "70%", left: "64%", size: "1.6cqw", color: "#1f2937", weight: 600, anchor: "left" },
  // Noms des signataires : juste AU-DESSUS des lignes de signature (lignes à ~81.5 %), non barrés.
  formateur: { top: "80%", left: "20.5%", size: "1.3cqw", color: "#1f2937", weight: 600, anchor: "center", maxw: "24cqw" },
  responsable: { top: "80%", left: "50%", size: "1.3cqw", color: "#1f2937", weight: 600, anchor: "center", maxw: "24cqw" },
  directeur: { top: "80%", left: "78%", size: "1.3cqw", color: "#1f2937", weight: 600, anchor: "center", maxw: "24cqw" },
  // Référence : centrée dans l'encadré orange (cadre détecté ~72.3–90.7 % × 86.6–90.9 %).
  ref: { top: "88.8%", left: "81.5%", size: "1.35cqw", color: "#1f2937", weight: 700, anchor: "center", maxw: "17cqw" },
};

function Field({ text, p }: { text: string; p: FieldPos }) {
  if (!text) return null;
  const anchor = p.anchor ?? "center";
  return (
    <span
      style={{
        position: "absolute", top: p.top, left: p.left,
        transform: anchor === "center" ? "translate(-50%, -50%)" : "translateY(-50%)",
        fontFamily: SERIF, fontSize: p.size, color: p.color, fontWeight: p.weight,
        whiteSpace: "nowrap", textAlign: anchor === "center" ? "center" : "left", lineHeight: 1.1,
        maxWidth: p.maxw, overflow: "hidden", textOverflow: "ellipsis",
      }}
    >
      {text}
    </span>
  );
}

export interface CertificateData {
  levelKey: string; // "N1" | "N2" | "N3" → image /certel/certificat-niveau<N>.png (mêmes positions)
  name: string;
  date: string;
  lieu: string;
  formateur: string;
  responsable: string;
  directeur: string;
  reference: string;
  signatureDataUrl: string;
  cachetDataUrl: string;
}

export function CertificateView(props: CertificateData) {
  useEffect(() => {
    document.documentElement.classList.add("cert-print-mode");
    return () => document.documentElement.classList.remove("cert-print-mode");
  }, []);

  const levelNum = (props.levelKey || "N1").replace(/\D/g, "") || "1";
  const imageSrc = `/certel/certificat-niveau${levelNum}.png`;

  return (
    <div className="certificate-print-page">
      {/* Forçage paysage à l'impression, limité à la page certificat (le <style> n'existe
          que lorsque ce composant est monté ; les autres impressions ne sont pas affectées).
          Le @page nu garantit l'orientation même si les @page nommés ne sont pas honorés. */}
      <style>{`@media print { @page { size: A4 landscape; margin: 0; } }`}</style>

      <div className="no-print mx-auto mb-4 flex max-w-[1100px] items-center justify-between gap-3">
        <Link href={`/certel/niveau-${levelNum}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline">
          <ArrowLeft className="size-4" /> Niveau {levelNum}
        </Link>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full bg-advanced px-4 py-2 text-sm font-bold text-white transition hover:bg-advanced/90">
          <Printer className="size-4" /> Télécharger en PDF
        </button>
      </div>

      <div className="cert-sheet relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-lg shadow-card" style={{ aspectRatio: "1491 / 1055", containerType: "inline-size" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={`Certificat de réussite CERTEL — Niveau ${levelNum}`} className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain" />

        {/* Cachet + signature dans la zone à droite du nom du Directeur Général. */}
        {props.cachetDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={props.cachetDataUrl} alt="Cachet" className="pointer-events-none absolute select-none object-contain" style={{ top: "77%", left: "88%", transform: "translate(-50%, -50%)", width: "11cqw", opacity: 0.95 }} />
        )}
        {props.signatureDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={props.signatureDataUrl} alt="Signature" className="pointer-events-none absolute select-none object-contain" style={{ top: "81%", left: "87%", transform: "translate(-50%, -50%)", width: "13cqw" }} />
        )}

        <Field text={props.name} p={POS.name} />
        <Field text={props.date} p={POS.date} />
        <Field text={props.lieu} p={POS.lieu} />
        <Field text={props.formateur} p={POS.formateur} />
        <Field text={props.responsable} p={POS.responsable} />
        <Field text={props.directeur} p={POS.directeur} />
        <Field text={props.reference} p={POS.ref} />
      </div>

      <p className="no-print mx-auto mt-4 max-w-[1100px] text-center text-sm text-muted-foreground">
        Le certificat s'imprime automatiquement en paysage. Dans la fenêtre d'impression, choisissez « Enregistrer au format PDF » et marges « Aucune ».
      </p>
    </div>
  );
}
