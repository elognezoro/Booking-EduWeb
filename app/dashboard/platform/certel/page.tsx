import { GraduationCap } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CertelJournal, type CertelRow } from "@/components/dashboard/certel-journal";
import { CERTEL_LEVELS } from "@/lib/certel/diagnostic";
import { fromNow } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function CertelDiagnosticsPage() {
  await requirePermission("platform.manage");
  const items = await prisma.certelDiagnostic.findMany({ orderBy: { createdAt: "desc" }, take: 500 });

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
