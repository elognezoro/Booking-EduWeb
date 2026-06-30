import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award } from "lucide-react";
import { getCertelEvaluation } from "@/lib/certel/evaluation";
import { EvaluationPlayer } from "@/components/certel/n1/evaluation-player";
import { N3_ACCENT } from "@/lib/certel/niveau3";
import { getEvaluationConfig } from "@/lib/platform/settings";
import { getCurrentUser } from "@/lib/auth";
import { hasCertelAccess } from "@/lib/certel/payment";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Évaluation certifiante · CERTEL Niveau 3" };
export const dynamic = "force-dynamic";

export default async function CertelN3EvaluationPage() {
  const ev = getCertelEvaluation("N3")!;
  const user = await getCurrentUser();
  if (!(await hasCertelAccess(user?.id, "N3"))) redirect("/certel/inscription/niveau-3");
  const evalCfg = await getEvaluationConfig();
  return (
    <div className="formation-scope section py-10 sm:py-12" style={{ ["--certel-accent" as string]: N3_ACCENT }}>
      <Link href="/certel/niveau-3" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-4" /> Niveau 3</Link>
      <header className="mb-8 flex items-start gap-4 rounded-3xl border border-border bg-gradient-to-br from-card to-secondary/40 p-6 shadow-soft sm:p-8">
        <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft" style={{ backgroundColor: N3_ACCENT }}><Award className="size-7" /></span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: N3_ACCENT }}>Niveau 3 · Certification</p>
          <h1 className="mt-0.5 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">{ev.title}</h1>
          <p className="mt-1.5 max-w-2xl text-muted-foreground">Projet capstone, examen de connaissances auto-corrigé, mise en situation et soutenance.</p>
        </div>
      </header>
      <EvaluationPlayer evaluation={ev} certHref="/certel/niveau-3/certificat" summativeRevealAnswers={evalCfg.summativeRevealAnswers} />
    </div>
  );
}
