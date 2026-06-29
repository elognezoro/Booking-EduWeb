"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";

/**
 * Rendu imprimable du certificat CERTEL Niveau 1 : image de fond + champs superposés.
 * Tailles en cqw (unités de conteneur) → identiques à l'écran et à l'impression (A4 paysage).
 * Positions en % de l'image (ratio 1491×1055 ≈ A4 paysage). Bouton « Imprimer/PDF » → window.print().
 */
const SERIF = "Georgia, 'Times New Roman', serif";
interface FieldPos { top: string; left: string; size: string; color: string; weight: number }
// Positions des champs (centre du champ) — en % de l'image de fond ; ajustées visuellement.
const POS: Record<"name" | "date" | "lieu" | "ref", FieldPos> = {
  name: { top: "51%", left: "50%", size: "3.3cqw", color: "#0d4d38", weight: 700 },
  date: { top: "68%", left: "32%", size: "1.65cqw", color: "#1f2937", weight: 600 },
  lieu: { top: "68%", left: "55%", size: "1.65cqw", color: "#1f2937", weight: 600 },
  ref: { top: "90.5%", left: "85%", size: "1.4cqw", color: "#1f2937", weight: 700 },
};

function Field({ text, p, italic = false }: { text: string; p: FieldPos; italic?: boolean }) {
  return (
    <span
      style={{
        position: "absolute", top: p.top, left: p.left, transform: "translate(-50%, -50%)",
        fontFamily: SERIF, fontSize: p.size, color: p.color, fontWeight: p.weight,
        fontStyle: italic ? "italic" : "normal", whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.1,
      }}
    >
      {text}
    </span>
  );
}

export function CertificateView({ name, dateLabel, lieu, reference }: { name: string; dateLabel: string; lieu: string; reference: string }) {
  useEffect(() => {
    document.documentElement.classList.add("cert-print-mode");
    return () => document.documentElement.classList.remove("cert-print-mode");
  }, []);

  return (
    <div className="certificate-print-page">
      <div className="no-print mx-auto mb-4 flex max-w-[1100px] items-center justify-between gap-3">
        <Link href="/certel/niveau-1" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline">
          <ArrowLeft className="size-4" /> Niveau 1
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full bg-advanced px-4 py-2 text-sm font-bold text-white transition hover:bg-advanced/90"
        >
          <Printer className="size-4" /> Télécharger en PDF
        </button>
      </div>

      <div
        className="cert-sheet relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-lg shadow-card"
        style={{ aspectRatio: "1491 / 1055", containerType: "inline-size" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/certel/certificat-niveau1.jpg" alt="Certificat de réussite CERTEL — Niveau 1" className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain" />
        <Field text={name} p={POS.name} />
        <Field text={dateLabel} p={POS.date} />
        <Field text={lieu} p={POS.lieu} />
        <Field text={reference} p={POS.ref} />
      </div>

      <p className="no-print mx-auto mt-4 max-w-[1100px] text-center text-sm text-muted-foreground">
        Astuce : dans la fenêtre d'impression, choisissez « Enregistrer au format PDF », orientation paysage, marges « Aucune ».
      </p>
    </div>
  );
}
