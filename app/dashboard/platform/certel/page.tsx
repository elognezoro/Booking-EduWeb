import Link from "next/link";
import { GraduationCap, Mail, Briefcase, Building2, Eye } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CERTEL_LEVELS } from "@/lib/certel/diagnostic";
import { fromNow } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function CertelDiagnosticsPage() {
  await requirePermission("platform.manage");
  const items = await prisma.certelDiagnostic.findMany({ orderBy: { createdAt: "desc" }, take: 500 });

  const byLevel: Record<string, number> = { N1: 0, N2: 0, N3: 0 };
  for (const i of items) byLevel[i.levelKey] = (byLevel[i.levelKey] ?? 0) + 1;
  const levelMeta = (k: string) => CERTEL_LEVELS.find((l) => l.key === k);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Diagnostics CERTEL"
        description="Tests de niveau soumis depuis l'accueil — formation certifiante numérique & IA."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><GraduationCap className="size-6" /></span>}
      />

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
          {items.length === 0 ? (
            <EmptyState icon={GraduationCap} title="Aucun diagnostic pour le moment" description="Les tests de niveau réalisés depuis la page d'accueil apparaîtront ici." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-semibold">Participant</th>
                    <th className="py-2 pr-3 font-semibold">Profil</th>
                    <th className="py-2 pr-3 font-semibold">Score</th>
                    <th className="py-2 pr-3 font-semibold">Niveau</th>
                    <th className="py-2 pr-3 font-semibold">Date</th>
                    <th className="py-2 font-semibold text-right">Réponses</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((d) => {
                    const m = levelMeta(d.levelKey);
                    return (
                      <tr key={d.id} className="border-b border-border/60 align-top">
                        <td className="py-2 pr-3">
                          <p className="font-semibold text-foreground">{d.fullName}</p>
                          {d.contact && <p className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Mail className="size-3" /> {d.contact}</p>}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">
                          {d.functionTitle && <span className="block"><Briefcase className="mr-1 inline size-3" />{d.functionTitle}</span>}
                          {d.structure && <span className="block"><Building2 className="mr-1 inline size-3" />{d.structure}</span>}
                          {!d.functionTitle && !d.structure && "—"}
                        </td>
                        <td className="py-2 pr-3">
                          <span className="font-bold text-foreground">{d.score100}</span>
                          <span className="text-xs text-muted-foreground">/100</span>
                          <span className="block text-[11px] text-muted-foreground">auto {d.autoposScore}/30 · QCM {d.qcmScore}/30</span>
                        </td>
                        <td className="py-2 pr-3">
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: m?.accent ?? "#6D5DF5" }}>{d.levelKey}</span>
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">{d.createdAt.toLocaleDateString("fr-FR")} · {fromNow(d.createdAt.toISOString())}</td>
                        <td className="py-2 text-right">
                          <Button asChild size="sm" variant="outline"><Link href={`/certel/resultats/${d.id}`} target="_blank"><Eye className="size-3.5" /> Voir</Link></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
