import type { Metadata } from "next";
import Link from "next/link";
import { LogIn, ArrowLeft, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getOrCreateCertelCertificate, certelRef } from "@/lib/certel/certificate";
import { getCertelCertConfig } from "@/lib/platform/settings";
import { CertificateView } from "@/components/certel/n1/certificate-view";

export const metadata: Metadata = { title: "Certificat de réussite · CERTEL Niveau 1" };
export const dynamic = "force-dynamic";

/** "AAAA-MM-JJ" → "JJ/MM/AAAA" (vide si non défini). */
function frDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

export default async function CertelN1CertificatPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <section className="formation-scope section py-16">
        <Link href="/certel/niveau-1" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-4" /> Niveau 1</Link>
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><ShieldCheck className="size-7" /></span>
          <h1 className="mt-4 text-xl font-extrabold text-foreground">Connexion requise</h1>
          <p className="mt-2 text-muted-foreground">Connectez-vous à votre compte pour générer votre certificat de réussite du Niveau 1 à votre nom.</p>
          <Button asChild className="mt-5"><Link href="/login?callbackUrl=/certel/niveau-1/certificat"><LogIn className="size-4" /> Se connecter</Link></Button>
        </div>
      </section>
    );
  }

  const cert = await getOrCreateCertelCertificate(user.id, user.fullName, "N1");
  const cfg = await getCertelCertConfig();

  return (
    <div className="formation-scope section py-8 sm:py-10">
      <CertificateView
        name={user.fullName || "—"}
        date={frDate(cfg.signatureDate)}
        lieu={cfg.lieu}
        formateur={cfg.formateur}
        responsable={cfg.responsable}
        directeur={cfg.directeur}
        reference={certelRef(cert.levelKey, cert.number)}
        signatureDataUrl={cfg.signatureDataUrl}
        cachetDataUrl={cfg.cachetDataUrl}
      />
    </div>
  );
}
