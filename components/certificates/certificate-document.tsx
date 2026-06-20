import { BrandLogo } from "@/components/brand/logo";

export interface CertificateView {
  number: string;
  title: string;
  mention: string;
  parcours: string | null;
  hours: string | null;
  recipientName: string;
  issuedOn: string; // déjà formaté
  status: string;
  signatoryName: string | null;
  signatoryTitle: string | null;
}

/**
 * Rendu présentiel d'une attestation / d'un certificat (écran + impression PDF).
 * Le cachet et la signature sont des images (data URL) issues de la configuration
 * de l'établissement.
 */
export function CertificateDocument({
  cert,
  orgName,
  orgCity,
  signatureImage,
  stampImage,
}: {
  cert: CertificateView;
  orgName: string;
  orgCity?: string | null;
  signatureImage?: string | null;
  stampImage?: string | null;
}) {
  return (
    <article className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border-[3px] border-primary bg-card p-8 sm:p-12">
      {/* filet décoratif intérieur */}
      <div className="pointer-events-none absolute inset-3 rounded-xl border border-primary/30" />
      {cert.status === "REVOKED" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-18deg] rounded-lg border-4 border-unavailable px-6 py-2 text-4xl font-extrabold uppercase tracking-widest text-unavailable/70">Révoqué</span>
        </div>
      )}

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo />
          <div className="text-right text-xs text-muted-foreground">
            <p className="font-mono font-semibold text-foreground">{cert.number}</p>
            <p>{orgName}</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">{cert.title}</p>
          <div className="mx-auto mt-2 h-0.5 w-24 rounded bg-primary/40" />
        </div>

        <div className="mt-8 space-y-5 text-center">
          <p className="text-sm text-muted-foreground">L'établissement {orgName} atteste que</p>
          <p className="text-3xl font-extrabold tracking-tight text-foreground">{cert.recipientName}</p>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-foreground">{cert.mention}</p>
          {(cert.parcours || cert.hours) && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
              {cert.parcours && (
                <span>
                  Parcours : <span className="font-semibold text-foreground">{cert.parcours}</span>
                </span>
              )}
              {cert.hours && (
                <span>
                  Durée : <span className="font-semibold text-foreground">{cert.hours}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-12 flex items-end justify-between gap-6">
          <div className="text-sm text-muted-foreground">
            <p>
              Fait à {orgCity || "—"}, le <span className="font-semibold text-foreground">{cert.issuedOn}</span>
            </p>
            <p className="mt-1 text-xs">N° {cert.number}</p>
          </div>
          <div className="relative text-center">
            {/* cachet en filigrane derrière la signature */}
            {stampImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={stampImage} alt="Cachet" className="pointer-events-none absolute -right-2 bottom-6 size-28 object-contain opacity-80" />
            )}
            {signatureImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={signatureImage} alt="Signature" className="relative mx-auto mb-1 max-h-16 object-contain" />
            )}
            <div className="relative mt-1 border-t border-border pt-1">
              <p className="text-sm font-semibold text-foreground">{cert.signatoryName || "Le responsable"}</p>
              {cert.signatoryTitle && <p className="text-xs text-muted-foreground">{cert.signatoryTitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
