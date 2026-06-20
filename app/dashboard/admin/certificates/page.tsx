import Link from "next/link";
import { Award, Stamp, FileText, Printer, CheckCircle2, AlertTriangle, Ban } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { ConfirmActionButton } from "@/components/confirm-action";
import { CertificateImageUpload } from "@/components/certificates/image-upload";
import { CertificateIssueForm } from "@/components/certificates/issue-form";
import { saveCertificateConfig, revokeCertificate } from "@/app/actions/certificates";
import { certPrefix, DEFAULT_CERT_TITLE, DEFAULT_CERT_MENTION } from "@/lib/certificates/number";
import { ROLES, ROLE_META, type RoleKey } from "@/lib/enums";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: "ok" | "err"; text: string }> = {
  savedConfig: { tone: "ok", text: "Configuration enregistrée." },
  revoked: { tone: "ok", text: "Certificat révoqué." },
  "error=org": { tone: "err", text: "Aucun établissement actif. Sélectionnez une institution pour gérer ses certificats." },
  "error=recipient": { tone: "err", text: "Le nom du bénéficiaire est obligatoire." },
  "error=notfound": { tone: "err", text: "Certificat introuvable." },
};

export default async function CertificatesPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await requirePermission("users.manage");
  const orgId = user.organizationId;

  const bannerKey = searchParams.savedConfig ? "savedConfig" : searchParams.revoked ? "revoked" : searchParams.error ? `error=${searchParams.error}` : null;
  const banner = bannerKey ? BANNERS[bannerKey] : null;

  if (!orgId) {
    return (
      <div className="space-y-6">
        <PageHeader title="Certificats & attestations" icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Award className="size-6" /></span>} />
        <Card><CardContent className="py-6 text-sm text-muted-foreground">Sélectionnez un établissement (sélecteur d'institution) pour gérer ses certificats.</CardContent></Card>
      </div>
    );
  }

  const [org, config, counter, certificates, users] = await Promise.all([
    prisma.organization.findUnique({ where: { id: orgId }, select: { name: true, acronym: true, city: true } }),
    prisma.certificateConfig.findUnique({ where: { organizationId: orgId } }),
    prisma.certificateCounter.findUnique({ where: { key: `${orgId}:${new Date().getFullYear()}` } }),
    prisma.certificate.findMany({ where: { organizationId: orgId }, orderBy: { issuedAt: "desc" }, take: 100 }),
    prisma.user.findMany({ where: { organizationId: orgId }, select: { id: true, firstName: true, lastName: true, functionTitle: true }, orderBy: [{ lastName: "asc" }], take: 300 }),
  ]);

  const year = new Date().getFullYear();
  const prefix = certPrefix(config?.prefix, org?.acronym, org?.name ?? "EduWeb");
  const nextNumber = `${prefix}-FORM-${year}-${String((counter?.count ?? 0) + 1).padStart(4, "0")}`;
  const roleLabels = (ROLES as readonly RoleKey[]).filter((r) => r !== "SUPER_ADMIN" && r !== "VISITOR").map((r) => ROLE_META[r].label);
  const userOpts = users.map((u) => ({ id: u.id, name: `${u.firstName} ${u.lastName}`.trim(), functionTitle: u.functionTitle }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificats & attestations"
        description="Configurez le cachet et la signature de l'établissement, délivrez des attestations numérotées et suivez le journal."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Award className="size-6" /></span>}
      />

      {banner && (
        <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${banner.tone === "ok" ? "border-available/30 bg-available-soft text-available-fg" : "border-unavailable/30 bg-unavailable-soft text-unavailable-fg"}`}>
          {banner.tone === "ok" ? <CheckCircle2 className="size-5 shrink-0" /> : <AlertTriangle className="size-5 shrink-0" />} {banner.text}
        </div>
      )}

      {/* Configuration de l'établissement */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Stamp className="size-5 text-primary" /> Configuration de l'établissement</CardTitle></CardHeader>
        <CardContent>
          <form action={saveCertificateConfig} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="signatoryName">Signataire (nom)</Label><Input id="signatoryName" name="signatoryName" defaultValue={config?.signatoryName ?? ""} placeholder="Pr. Prénom NOM" /></div>
              <div><Label htmlFor="signatoryTitle">Qualité du signataire</Label><Input id="signatoryTitle" name="signatoryTitle" defaultValue={config?.signatoryTitle ?? ""} placeholder="Directeur" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CertificateImageUpload name="signatureImage" label="Signature scannée" initial={config?.signatureImage} hint="PNG/JPG, fond transparent de préférence." />
              <CertificateImageUpload name="stampImage" label="Cachet scanné" initial={config?.stampImage} hint="PNG/JPG, image carrée conseillée." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="prefix">Préfixe de numérotation</Label>
                <Input id="prefix" name="prefix" defaultValue={config?.prefix ?? ""} placeholder={certPrefix(null, org?.acronym, org?.name ?? "EduWeb")} />
                <p className="mt-1 text-xs text-muted-foreground">Prochain numéro : <span className="font-mono font-semibold text-foreground">{nextNumber}</span></p>
              </div>
            </div>
            <SubmitButton pendingLabel="Enregistrement…"><Stamp className="size-4" /> Enregistrer la configuration</SubmitButton>
          </form>
        </CardContent>
      </Card>

      {/* Délivrer une attestation */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Award className="size-5 text-primary" /> Délivrer une attestation</CardTitle></CardHeader>
        <CardContent>
          <CertificateIssueForm users={userOpts} roleLabels={roleLabels} defaults={{ title: DEFAULT_CERT_TITLE, mention: DEFAULT_CERT_MENTION }} />
        </CardContent>
      </Card>

      {/* Journal des certificats délivrés */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-5 text-primary" /> Journal des certificats délivrés ({certificates.length})</CardTitle></CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">Aucun certificat délivré pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-semibold">Numéro</th>
                    <th className="py-2 pr-3 font-semibold">Bénéficiaire</th>
                    <th className="py-2 pr-3 font-semibold">Parcours</th>
                    <th className="py-2 pr-3 font-semibold">Délivré le</th>
                    <th className="py-2 pr-3 font-semibold">Par</th>
                    <th className="py-2 pr-3 font-semibold">Statut</th>
                    <th className="py-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((c) => (
                    <tr key={c.id} className="border-b border-border/60 align-middle">
                      <td className="py-2 pr-3 font-mono text-xs font-semibold text-foreground">{c.number}</td>
                      <td className="py-2 pr-3 text-foreground">{c.recipientName}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{c.parcours ?? "—"}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{c.issuedAt.toLocaleDateString("fr-FR")}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{c.issuedByName ?? "—"}</td>
                      <td className="py-2 pr-3">
                        {c.status === "REVOKED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-unavailable-soft px-2 py-0.5 text-xs font-bold text-unavailable-fg">Révoqué</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-available-soft px-2 py-0.5 text-xs font-bold text-available-fg">Délivré</span>
                        )}
                      </td>
                      <td className="py-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button asChild size="sm" variant="outline"><Link href={`/certificates/${c.id}`} target="_blank"><Printer className="size-3.5" /> Voir</Link></Button>
                          <Button asChild size="sm" variant="outline"><a href={`/api/certificates/${c.id}/word`}><FileText className="size-3.5" /> Word</a></Button>
                          {c.status !== "REVOKED" && (
                            <ConfirmActionButton
                              action={revokeCertificate}
                              hidden={{ id: c.id }}
                              triggerLabel="Révoquer"
                              triggerIcon={<Ban className="size-3.5" />}
                              triggerVariant="ghost"
                              triggerSize="sm"
                              title="Révoquer ce certificat ?"
                              description={`Le certificat ${c.number} sera marqué comme révoqué. Cette action reste tracée dans le journal.`}
                              confirmLabel="Révoquer"
                              confirmVariant="destructive"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
