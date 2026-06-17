import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Users, Trophy, Clock, Play, Square, DoorOpen, Trash2, Medal } from "lucide-react";
import { requireUser, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LEVELS, getGame } from "@/lib/games/catalog";
import { AutoRefresh } from "@/components/competitions/auto-refresh";
import { setCompetitionStatus, deleteCompetition } from "@/app/actions/competition";

export const dynamic = "force-dynamic";

const fmtDur = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const levelLabel = (k: string) => LEVELS.find((l) => l.key === k)?.label ?? k;

export default async function CompetitionJudgePage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const isPlatform = hasPermission(user, "platform.manage");
  if (!isPlatform && !hasPermission(user, "organization.manage")) redirect("/dashboard?denied=1");

  const comp = await prisma.competition.findUnique({ where: { id: params.id }, include: { participants: true } });
  if (!comp) redirect("/dashboard/competitions");
  const canManage = isPlatform || comp.createdById === user.id || (!!comp.organizationId && comp.organizationId === user.organizationId);
  if (!canManage) redirect("/dashboard/competitions");

  const ranked = [...comp.participants].sort((a, b) => b.bestScore - a.bestScore || a.bestDuration - b.bestDuration);
  const joinUrl = `${process.env.APP_URL ?? ""}/competition/${comp.code}`;
  const closed = comp.status === "CLOSED";
  const medal = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-6">
      <Link href="/dashboard/competitions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Compétitions
      </Link>
      <PageHeader
        title={comp.title}
        description={`${getGame(comp.gameSlug)?.title ?? comp.gameSlug} · niveau ${levelLabel(comp.level)}`}
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><Trophy className="size-6" /></span>}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={closed ? "neutral" : comp.status === "RUNNING" ? "pending" : "available"}>{closed ? "Close" : comp.status === "RUNNING" ? "En cours" : "Ouverte"}</Badge>
            <AutoRefresh seconds={3} />
          </div>
        }
      />

      {/* Code de session à partager */}
      <Card className="border-primary/20 bg-primary-50/50">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Code de session</p>
            <p className="font-mono text-3xl font-extrabold tracking-widest text-foreground">{comp.code}</p>
            <p className="mt-1 text-sm text-muted-foreground">Lien : <span className="font-medium text-foreground">{joinUrl}</span></p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link href={`/competition/${comp.code}`} target="_blank">Ouvrir la page joueur</Link></Button>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles d'état */}
      <div className="flex flex-wrap gap-2">
        <form action={setCompetitionStatus}><input type="hidden" name="id" value={comp.id} /><input type="hidden" name="status" value="OPEN" /><Button type="submit" size="sm" variant={comp.status === "OPEN" ? "default" : "outline"}><DoorOpen className="size-4" /> Ouvrir (inscriptions)</Button></form>
        <form action={setCompetitionStatus}><input type="hidden" name="id" value={comp.id} /><input type="hidden" name="status" value="RUNNING" /><Button type="submit" size="sm" variant={comp.status === "RUNNING" ? "default" : "outline"}><Play className="size-4" /> Démarrer</Button></form>
        <form action={setCompetitionStatus}><input type="hidden" name="id" value={comp.id} /><input type="hidden" name="status" value="CLOSED" /><Button type="submit" size="sm" variant={closed ? "default" : "outline"}><Square className="size-4" /> Clore</Button></form>
        <form action={deleteCompetition} className="ml-auto"><input type="hidden" name="id" value={comp.id} /><Button type="submit" size="sm" variant="ghost"><Trash2 className="size-4 text-unavailable" /> Supprimer</Button></form>
      </div>

      {/* Classement en direct */}
      <Card className="overflow-hidden">
        <CardHeader><CardTitle className="flex items-center gap-2"><Medal className="size-4 text-primary" /> Classement · <span className="inline-flex items-center gap-1 text-sm font-normal text-muted-foreground"><Users className="size-4" />{ranked.length}</span></CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-border bg-secondary/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Compétiteur</th>
                <th className="px-4 py-2.5 text-center">Meilleur score</th>
                <th className="px-4 py-2.5 text-center">Temps</th>
                <th className="px-4 py-2.5 text-center">Essais</th>
                <th className="px-4 py-2.5 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {ranked.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">En attente de compétiteurs… Partagez le code <span className="font-mono font-bold text-foreground">{comp.code}</span>.</td></tr>
              ) : (
                ranked.map((p, i) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-lg font-bold">{i < 3 && p.bestScore > 0 ? medal[i] : i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{p.displayName}</td>
                    <td className="px-4 py-3 text-center font-extrabold text-primary">{p.bestScore}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground"><Clock className="mr-1 inline size-3.5" />{p.finished ? fmtDur(p.bestDuration) : "—"}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{p.attempts}</td>
                    <td className="px-4 py-3 text-center"><Badge tone={p.finished ? "available" : "pending"}>{p.finished ? "A joué" : "En attente"}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
