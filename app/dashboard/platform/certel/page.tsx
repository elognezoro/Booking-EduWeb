import { GraduationCap, Award, CalendarCheck, MapPin, CheckCircle2 } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CertelJournal, type CertelRow } from "@/components/dashboard/certel-journal";
import { CERTEL_LEVELS } from "@/lib/certel/diagnostic";
import { certelRef } from "@/lib/certel/certificate";
import { getCertelCertConfig } from "@/lib/platform/settings";
import { saveCertelCertConfig } from "@/app/actions/platform";
import { fromNow } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function CertelDiagnosticsPage({ searchParams }: { searchParams: { certsaved?: string } }) {
  await requirePermission("platform.manage");
  const [items, certs, cfg] = await Promise.all([
    prisma.certelDiagnostic.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.certelCertificate.findMany({ where: { levelKey: "N1" }, orderBy: { number: "desc" }, take: 200 }),
    getCertelCertConfig(),
  ]);

  const byLevel: Record<string, number> = { N1: 0, N2: 0, N3: 0 };
  for (const i of items) byLevel[i.levelKey] = (byLevel[i.levelKey] ?? 0) + 1;
  const levelMeta = (k: string) => CERTEL_LEVELS.find((l) => l.key === k);

  const rows: CertelRow[] = items.map((d) => ({
    id: d.id,
    fullName: d.fullName,
    contact: d.contact,
    functionTitle: d.functionTitle,
    structure: d.structure,
    levelKey: d.levelKey,
    levelAccent: levelMeta(d.levelKey)?.accent ?? "#6D5DF5",
    total100: d.total100,
    practicalScore: d.practicalScore,
    score100: d.score100,
    autoposScore: d.autoposScore,
    qcmScore: d.qcmScore,
    dateLabel: `${d.createdAt.toLocaleDateString("fr-FR")} · ${fromNow(d.createdAt.toISOString())}`,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Diagnostics CERTEL"
        description="Tests de niveau soumis depuis l'accueil — formation certifiante numérique & IA."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><GraduationCap className="size-6" /></span>}
      />

      {/* Paramètres du certificat de réussite Niveau 1 */}
      <Card>
        <CardContent className="py-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground"><Award className="size-5 text-advanced-fg" /> Certificat de réussite — Niveau 1</h2>
          <p className="mt-1 text-sm text-muted-foreground">Date de signature et lieu apposés automatiquement sur les certificats édités par les apprenants. Numérotation séquentielle automatique (CERTEL-N1-NNNN).</p>
          {searchParams?.certsaved && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-available-soft px-3 py-1 text-sm font-semibold text-available-fg"><CheckCircle2 className="size-4" /> Paramètres enregistrés.</p>
          )}
          <form action={saveCertelCertConfig} className="mt-4 flex flex-wrap items-end gap-4">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-foreground"><CalendarCheck className="size-4 text-advanced-fg" /> Date de signature</span>
              <input type="date" name="signatureDate" defaultValue={cfg.signatureDate} className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-advanced/40" />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-foreground"><MapPin className="size-4 text-advanced-fg" /> Lieu</span>
              <input type="text" name="lieu" defaultValue={cfg.lieu} placeholder="Ex. Abidjan" maxLength={120} className="w-56 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-advanced/40" />
            </label>
            <button type="submit" className="rounded-full bg-advanced px-5 py-2 text-sm font-bold text-white transition hover:bg-advanced/90">Enregistrer</button>
          </form>
          <p className="mt-3 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{certs.length}</span> certificat{certs.length > 1 ? "s" : ""} Niveau 1 délivré{certs.length > 1 ? "s" : ""} à ce jour.</p>
          {certs.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary/60 text-left"><th className="px-3 py-2 font-bold">Référence</th><th className="px-3 py-2 font-bold">Bénéficiaire</th><th className="px-3 py-2 font-bold">Émis le</th></tr></thead>
                <tbody>
                  {certs.slice(0, 25).map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-3 py-1.5 font-mono text-advanced-fg">{certelRef(c.levelKey, c.number)}</td>
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
