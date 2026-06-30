import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { getCertelEvaluation } from "@/lib/certel/evaluation";
import { EvaluationPlayer } from "@/components/certel/n1/evaluation-player";
import { N2_ACCENT } from "@/lib/certel/niveau2";

export const metadata: Metadata = { title: "Évaluation certifiante · CERTEL Niveau 2" };

export default function CertelN2EvaluationPage() {
  const ev = getCertelEvaluation("N2")!;
  return (
    <div className="formation-scope section py-10 sm:py-12" style={{ ["--certel-accent" as string]: N2_ACCENT }}>
      <Link href="/certel/niveau-2" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-4" /> Niveau 2</Link>
      <header className="mb-8 flex items-start gap-4 rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6 shadow-soft sm:p-8">
        <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft" style={{ backgroundColor: N2_ACCENT }}><Award className="size-7" /></span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: N2_ACCENT }}>Niveau 2 · Certification</p>
          <h1 className="mt-0.5 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">{ev.title}</h1>
          <p className="mt-1.5 max-w-2xl text-muted-foreground">Projet fil rouge, examen de connaissances auto-corrigé et mise en situation pratique.</p>
        </div>
      </header>
      <EvaluationPlayer evaluation={ev} certHref="/certel/niveau-2/certificat" />
    </div>
  );
}
