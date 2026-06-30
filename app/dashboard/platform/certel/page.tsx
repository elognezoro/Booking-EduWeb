import { GraduationCap, Award, CalendarCheck, MapPin, CheckCircle2 } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CertelJournal, type CertelRow } from "@/components/dashboard/certel-journal";
import { CERTEL_LEVELS } from "@/lib/certel/diagnostic";
import { certelRef } from "@/lib/certel/certificate";
import { getCertelCertConfig, type CertelCertConfig } from "@/lib/platform/settings";
import { saveCertelCertConfig } from "@/app/actions/platform";
import { CertificateImageUpload } from "@/components/certificates/image-upload";
import { fromNow } from "@/lib/dates";

export const dynamic = "force-dynamic";

const CERT_LEVELS = ["N1", "N2"] as const;

export default async function CertelDiagnosticsPage({ searchParams }: { searchParams: { certsaved?: string } }) {
  await requirePermission("platform.manage");
  const [items, certs, cfgN1, cfgN2] = await Promise.all([
    prisma.certelDiagnostic.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.certelCertificate.findMany({ orderBy: { issuedAt: "desc" }, take: 300 }),
    getCertelCertConfig("N1"),
    getCertelCertConfig("N2"),
  ]);
  const cfgByLevel: Record<string, CertelCertConfig> = { N1: cfgN1, N2: cfgN2 };

  const byLevel: Record<string, number> = { N1: 0, N2: 0, N3: 0 };
  for (const i of items) byLevel[i.levelKey] = (byLevel[i.levelKey] ?? 0) + 1;
  const levelMeta = (k: string) => CERTEL_LEVELS.find((l) => l.key === k);

  const rows: CertelRow[] = items.map((d) => ({
    id: d.id, fullName: d.fullName, contact: d.contact, functionTitle: d.functionTitle, structure: d.structure,
    levelKey: d.levelKey, levelAccent: levelMeta(d.levelKey)?.accent ?? "#6D5DF5",
    total100: d.total100, practicalScore: d.practicalScore, score100: d.score100, autoposScore: d.autoposScore, qcmScore: d.qcmScore,
    dateLabel: `${d.createdAt.toLocaleDateString("fr-FR")} · ${fromNow(d.createdAt.toISOString())}`,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Diagnostics CERTEL"
        description="Tests de niveau soumis depuis l'accueil — formation certifiante numérique & IA."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><GraduationCap className="size-6" /></span>}
      />

      {CERT_LEVELS.map((lvl) => (
        <CertConfigCard key={lvl} level={lvl} cfg={cfgByLevel[lvl]} saved={searchParams?.certsaved === lvl} certs={certs.filter((c) => c.levelKey === lvl)} accent={levelMeta(lvl)?.accent ?? "#6D5DF5"} />
      ))}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><CardContent className="py-4"><p className="text-2xl font-extrabold text-foreground">{items.length}</p><p className="text-xs text-muted-foreground">Diagnostics</p></CardContent></Card>
        {CERTEL_LEVELS.map((l) => (
          <Card key={l.key}><CardContent className="py-4">
            <p className="text-2xl font-extrabold" style={{ color: l.accent }}>{byLevel[l.key] ?? 0}</p>
            <p className="text-xs text-muted-foreground">{l.key} · {l.title.split(" ").slice(0, 2).join(" ")}…</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="py-5">
          <CertelJournal rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}

function CertConfigCard({ level, cfg, saved, certs, accent }: { level: string; cfg: CertelCertConfig; saved: boolean; certs: { id: string; levelKey: string; number: number; fullName: string; issuedAt: Date }[]; accent: string }) {
  return (
    <Card>
      <CardContent className="py-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground"><Award className="size-5" style={{ color: accent }} /> Certificat de réussite — {level === "N1" ? "Niveau 1" : level === "N2" ? "Niveau 2" : "Niveau 3"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Date de signature, lieu, signataires et signature/cachet apposés automatiquement. Numérotation séquentielle automatique (CERTEL-{level}-NNNN).</p>
        {saved && <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-available-soft px-3 py-1 text-sm font-semibold text-available-fg"><CheckCircle2 className="size-4" /> Paramètres enregistrés.</p>}
        <form action={saveCertelCertConfig} className="mt-4 space-y-4">
          <input type="hidden" name="level" value={level} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-foreground"><CalendarCheck className="size-4" style={{ color: accent }} /> Date de signature</span>
              <input type="date" name="signatureDate" defaultValue={cfg.signatureDate} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-advanced/40" />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-foreground"><MapPin className="size-4" style={{ color: accent }} /> Lieu</span>
              <input type="text" name="lieu" defaultValue={cfg.lieu} placeholder="Ex. Abidjan" maxLength={120} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-advanced/40" />
            </label>
            <TextField name="formateur" label="Nom du Formateur" value={cfg.formateur} placeholder="Ex. Mme Fatou Bamba" />
            <TextField name="responsable" label="Nom du Responsable" value={cfg.responsable} placeholder="Ex. M. Jean Brou" />
            <TextField name="directeur" label="Direction Générale" value={cfg.directeur} placeholder="Dr Elogne ZORO" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <CertificateImageUpload name="signatureDataUrl" label="Signature (scan)" initial={cfg.signatureDataUrl || null} hint="Apposée à droite du nom du Directeur Général." maxDim={700} />
            <CertificateImageUpload name="cachetDataUrl" label="Cachet (scan)" initial={cfg.cachetDataUrl || null} hint="Tampon de certification." maxDim={700} />
          </div>
          <button type="submit" className="rounded-full bg-advanced px-5 py-2 text-sm font-bold text-white transition hover:bg-advanced/90">Enregistrer</button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{certs.length}</span> certificat{certs.length > 1 ? "s" : ""} {level} délivré{certs.length > 1 ? "s" : ""} à ce jour.</p>
        {certs.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead><tr className="bg-secondary/60 text-left"><th className="px-3 py-2 font-bold">Référence</th><th className="px-3 py-2 font-bold">Bénéficiaire</th><th className="px-3 py-2 font-bold">Émis le</th></tr></thead>
              <tbody>
                {certs.slice(0, 15).map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-3 py-1.5 font-mono" style={{ color: accent }}>{certelRef(c.levelKey, c.number)}</td>
                    <td className="px-3 py-1.5 text-foreground">{c.fullName}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{c.issuedAt.toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TextField({ name, label, value, placeholder }: { name: string; label: string; value: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-foreground">{label}</span>
      <input type="text" name={name} defaultValue={value} placeholder={placeholder} maxLength={120} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-advanced/40" />
    </label>
  );
}
