import type { Metadata } from "next";
import { CertelDiagnosticForm } from "@/components/certel/diagnostic-form";

export const metadata: Metadata = { title: "Diagnostic de niveau CERTEL" };

export default function CertelDiagnosticPage() {
  return (
    <section className="section py-10 sm:py-14">
      <CertelDiagnosticForm />
    </section>
  );
}
