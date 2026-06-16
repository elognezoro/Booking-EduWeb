import Link from "next/link";
import {
  Brain, Trophy, Flame, Target, CalendarCheck, Grid3x3, Gamepad2, ArrowRight, Clock, CheckCircle2, Award, History,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserAttempts } from "@/lib/games/stats";
import { GAMES, getGame } from "@/lib/games/catalog";
import { BADGES, getBadge } from "@/lib/games/badges";
import { LEVEL_LABEL } from "@/lib/games/scoring";
import { getDailyChallenge } from "@/lib/games/daily";
import { fmtDateTime } from "@/lib/dates";

export const dynamic = "force-dynamic";

const ICONS: Record<string, typeof Brain> = { Grid3x3, CalendarCheck, Target, Trophy, Flame, Brain };

function fmtDur(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default async function BrainDashboardPage() {
  const user = await requireUser();
  const attempts = await getUserAttempts(user.id);
  const earned = await prisma.brainSportBadge.findMany({ where: { userId: user.id } });
  const earnedCodes = new Set(earned.map((e) => e.code));

  const successAttempts = attempts.filter((a) => a.success);
  const total = attempts.length;
  const bestScore = attempts.reduce((m, a) => Math.max(m, a.score), 0);
  const avgDuration = successAttempts.length ? Math.round(successAttempts.reduce((s, a) => s + a.durationSec, 0) / successAttempts.length) : 0;
  const days7 = new Set(attempts.filter((a) => Date.now() - a.createdAt.getTime() < 7 * 864e5).map((a) => a.createdAt.toISOString().slice(0, 10))).size;

  const perGame = GAMES.filter((g) => g.playable).map((g) => {
    const list = attempts.filter((a) => a.gameSlug === g.slug);
    return { game: g, played: list.length, best: list.reduce((m, a) => Math.max(m, a.score), 0) };
  });
  const recent = attempts.slice(0, 8);

  const daily = getDailyChallenge();
  const dailyDone = attempts.some((a) => a.success && a.gameSlug === daily.slug && a.level === daily.level && a.createdAt.toISOString().slice(0, 10) === daily.date);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sport cérébral"
        description="Vos scores, votre progression et vos badges."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><Brain className="size-6" /></span>}
        actions={
          <div className="flex flex-wrap gap-2">
            {user.permissions.has("platform.manage") && (
              <Button asChild variant="outline"><Link href="/dashboard/sport-cerebral/admin"><Award className="size-4" /> Banque de questions</Link></Button>
            )}
            <Button asChild><Link href="/sport-cerebral">Jouer <ArrowRight className="size-4" /></Link></Button>
          </div>
        }
      />

      {/* Défi du jour */}
      <Card className={dailyDone ? "border-available/40 bg-available-soft/40" : "border-primary/30 bg-primary-50/50"}>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Flame className="size-6" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Défi du jour</p>
              <p className="font-bold text-foreground">{daily.title} · {daily.levelLabel}</p>
            </div>
          </div>
          {dailyDone ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-available-soft px-3 py-2 text-sm font-bold text-available-fg"><CheckCircle2 className="size-4" /> Relevé aujourd'hui</span>
          ) : (
            <Button asChild><Link href={daily.href}>Relever le défi <ArrowRight className="size-4" /></Link></Button>
          )}
        </CardContent>
      </Card>

      {total === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">
          Vous n'avez pas encore joué. <Link href="/sport-cerebral" className="font-semibold text-primary hover:underline">Lancez votre première partie</Link> pour commencer à cumuler scores et badges.
        </CardContent></Card>
      ) : (
        <>
          {/* KPI */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi icon={Gamepad2} label="Parties jouées" value={String(total)} hint={`${successAttempts.length} réussie(s)`} tone="primary" />
            <Kpi icon={Trophy} label="Meilleur score" value={String(bestScore)} hint="points" tone="advanced" />
            <Kpi icon={Clock} label="Temps moyen" value={fmtDur(avgDuration)} hint="par réussite" tone="pending" />
            <Kpi icon={CalendarCheck} label="Régularité" value={`${days7}/7`} hint="jours actifs (7 j)" tone="available" />
          </div>

          {/* Badges */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Award className="size-4 text-primary" /> Badges ({earnedCodes.size}/{BADGES.length})</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {BADGES.map((b) => {
                const Icon = ICONS[b.icon] ?? Brain;
                const got = earnedCodes.has(b.code);
                return (
                  <div key={b.code} className={`flex items-center gap-3 rounded-xl border p-3 ${got ? "border-border bg-card" : "border-dashed border-border bg-secondary/40 opacity-60"}`}>
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: got ? `${b.color}1a` : "transparent", color: got ? b.color : "#94a3b8" }}><Icon className="size-5" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{b.label}</p>
                      <p className="text-xs text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Par jeu */}
            <Card>
              <CardHeader><CardTitle className="text-base">Par jeu</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {perGame.map(({ game, played, best }) => (
                  <div key={game.slug} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5">
                    <span className="font-semibold text-foreground">{game.title}</span>
                    <span className="text-sm text-muted-foreground">{played} partie(s) · meilleur <strong className="text-foreground">{best}</strong></span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Historique */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="size-4 text-primary" /> Dernières parties</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                {recent.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{getGame(a.gameSlug)?.title ?? a.gameSlug} <span className="font-normal text-muted-foreground">· {LEVEL_LABEL[a.level as keyof typeof LEVEL_LABEL] ?? a.level}</span></p>
                      <p className="text-xs text-muted-foreground">{fmtDateTime(a.createdAt)} · {fmtDur(a.durationSec)}</p>
                    </div>
                    <Badge tone={a.success ? "available" : "neutral"}>{a.success ? `${a.score} pts` : "Abandon"}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, hint, tone }: { icon: typeof Brain; label: string; value: string; hint: string; tone: string }) {
  const toneCls: Record<string, string> = {
    primary: "bg-primary-50 text-primary",
    advanced: "bg-advanced-soft text-advanced-fg",
    pending: "bg-pending-soft text-pending-fg",
    available: "bg-available-soft text-available-fg",
  };
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-extrabold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className={`inline-flex size-11 items-center justify-center rounded-2xl ${toneCls[tone] ?? toneCls.primary}`}><Icon className="size-6" /></span>
      </CardContent>
    </Card>
  );
}
