import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, Plus, Users, ArrowRight, Swords } from "lucide-react";
import { requireUser, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LEVELS, getGame } from "@/lib/games/catalog";
import { competitionGames } from "@/lib/games/competition";
import { createCompetition } from "@/app/actions/competition";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; tone: "available" | "pending" | "neutral" }> = {
  OPEN: { label: "Ouverte", tone: "available" },
  RUNNING: { label: "En cours", tone: "pending" },
  CLOSED: { label: "Close", tone: "neutral" },
};

export default async function CompetitionsPage() {
  const user = await requireUser();
  const isPlatform = hasPermission(user, "platform.manage");
  if (!isPlatform && !hasPermission(user, "organization.manage")) redirect("/dashboard?denied=1");

  const competitions = await prisma.competition.findMany({
    where: isPlatform ? {} : { OR: [{ organizationId: user.organizationId }, { createdById: user.id }] },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { participants: true } } },
  });
  const games = competitionGames();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compétitions"
        description="Organisez une compétition sur un jeu, partagez le code, et suivez les performances en direct."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><Swords className="size-6" /></span>}
      />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" /> Nouvelle compétition</CardTitle></CardHeader>
        <CardContent>
          <form action={createCompetition} className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2"><Label htmlFor="title" required>Intitulé</Label><Input id="title" name="title" required placeholder="Tournoi de calcul mental — 3ᵉ A" /></div>
            <div>
              <Label htmlFor="gameSlug">Jeu</Label>
              <Select id="gameSlug" name="gameSlug" defaultValue={games[0]?.slug}>{games.map((g) => <option key={g.slug} value={g.slug}>{g.title}</option>)}</Select>
            </div>
            <div>
              <Label htmlFor="level">Niveau</Label>
              <Select id="level" name="level" defaultValue="facile">{LEVELS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}</Select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4"><Button type="submit"><Trophy className="size-4" /> Créer la compétition</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader><CardTitle>{competitions.length} compétition(s)</CardTitle></CardHeader>
        <div className="divide-y divide-border">
          {competitions.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">Aucune compétition. Créez-en une ci-dessus.</p>
          ) : (
            competitions.map((c) => {
              const st = STATUS[c.status] ?? STATUS.OPEN;
              return (
                <Link key={c.id} href={`/dashboard/competitions/${c.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/40">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{c.title}</span>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{getGame(c.gameSlug)?.title ?? c.gameSlug} · code <span className="font-mono font-bold text-foreground">{c.code}</span></p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Users className="size-4" /> {c._count.participants}</span>
                    <ArrowRight className="size-4" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
