import Link from "next/link";
import { Trophy, Swords, LogOut, AlertTriangle, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { parseJson } from "@/lib/json";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Consigne } from "@/components/games/consigne";
import { CalculMental } from "@/components/games/calcul-mental";
import { SuitesLogiques } from "@/components/games/suites-logiques";
import { Attention } from "@/components/games/attention";
import { SudokuBoard } from "@/components/games/sudoku-board";
import { MemoryGame } from "@/components/games/memory-game";
import { Quiz, type QuizQuestion } from "@/components/games/quiz";
import { getGame, LEVELS } from "@/lib/games/catalog";
import { getMyParticipant } from "@/lib/games/competition";
import { joinCompetition, leaveCompetition } from "@/app/actions/competition";

export const dynamic = "force-dynamic";
export const metadata = { title: "Compétition — Sport cérébral" };

type Lvl = "facile" | "moyen" | "difficile";
const levelLabel = (k: string) => LEVELS.find((l) => l.key === k)?.label ?? k;

export default async function CompetitionPlayPage({ params, searchParams }: { params: { code: string }; searchParams: { error?: string } }) {
  const code = params.code.toUpperCase();
  const comp = await prisma.competition.findUnique({ where: { code } });
  const game = comp ? getGame(comp.gameSlug) : null;
  const user = await getCurrentUser();
  const participant = comp ? await getMyParticipant(comp.id) : null;

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <section className="section py-10">
      <Link href="/sport-cerebral" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Sport cérébral
      </Link>
      <div className="mx-auto mt-4 max-w-2xl">{children}</div>
    </section>
  );

  if (!comp || !game) {
    return (
      <Shell>
        <Card><CardContent className="py-10 text-center">
          <AlertTriangle className="mx-auto mb-3 size-8 text-pending-fg" />
          <p className="font-semibold text-foreground">Compétition introuvable.</p>
          <p className="mt-1 text-sm text-muted-foreground">Vérifiez le code de session communiqué par l'organisateur.</p>
        </CardContent></Card>
      </Shell>
    );
  }

  const level = (["facile", "moyen", "difficile"].includes(comp.level) ? comp.level : "facile") as Lvl;

  // --- Pas encore inscrit : formulaire pour rejoindre ---
  if (!participant) {
    const closed = comp.status === "CLOSED";
    return (
      <Shell>
        <Card>
          <CardContent className="space-y-4 py-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><Swords className="size-6" /></span>
              <div>
                <h1 className="text-xl font-extrabold text-foreground">{comp.title}</h1>
                <p className="text-sm text-muted-foreground">{game.title} · niveau {levelLabel(comp.level)} · code <span className="font-mono font-bold">{comp.code}</span></p>
              </div>
            </div>
            {closed ? (
              <p className="rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">Cette compétition est close. Les inscriptions ne sont plus possibles.</p>
            ) : (
              <>
                {searchParams.error === "ferme" && <p className="rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">Cette compétition est close.</p>}
                <form action={joinCompetition} className="space-y-3">
                  <input type="hidden" name="code" value={comp.code} />
                  {user ? (
                    <p className="text-sm text-muted-foreground">Vous participez en tant que <span className="font-semibold text-foreground">{user.fullName}</span>.</p>
                  ) : (
                    <div><Label htmlFor="displayName" required>Votre nom / pseudo</Label><Input id="displayName" name="displayName" required maxLength={40} placeholder="Ex. Awa K." /></div>
                  )}
                  <Button type="submit" className="w-full"><Trophy className="size-4" /> Rejoindre la compétition</Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </Shell>
    );
  }

  // --- Inscrit : jouer ---
  let questions: QuizQuestion[] = [];
  if (comp.gameSlug === "culture-generale") {
    const rows = await prisma.brainSportQuestion.findMany({ where: { gameSlug: "culture-generale", level, active: true } });
    questions = rows.sort(() => Math.random() - 0.5).slice(0, 8).map((r) => ({ id: r.id, prompt: r.prompt, choices: parseJson<string[]>(r.choices, []), answerIndex: r.answerIndex, explanation: r.explanation }));
  }

  return (
    <Shell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary-50/60 px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Compétition · {comp.status === "CLOSED" ? "close" : comp.status === "RUNNING" ? "en cours" : "ouverte"}</p>
          <p className="font-bold text-foreground">{comp.title}</p>
          <p className="text-sm text-muted-foreground">{participant.displayName} · meilleur score : <span className="font-bold text-foreground">{participant.bestScore}</span> · {participant.attempts} essai(s)</p>
        </div>
        <form action={leaveCompetition}><input type="hidden" name="code" value={comp.code} /><Button type="submit" variant="ghost" size="sm"><LogOut className="size-4" /> Quitter</Button></form>
      </div>

      {comp.status === "CLOSED" ? (
        <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">La compétition est terminée. Merci d'avoir participé !</CardContent></Card>
      ) : (
        <>
          <div className="mb-4"><Consigne text={game.consigne} /></div>
          <Card className="p-5 sm:p-6">
            {comp.gameSlug === "calcul-mental" && <CalculMental initialLevel={level} />}
            {comp.gameSlug === "logique" && <SuitesLogiques initialLevel={level} />}
            {comp.gameSlug === "attention" && <Attention initialLevel={level} />}
            {comp.gameSlug === "sudoku" && <SudokuBoard initialLevel={level} />}
            {comp.gameSlug === "memoire" && <MemoryGame initialLevel={level} />}
            {comp.gameSlug === "culture-generale" && <Quiz questions={questions} level={level} />}
          </Card>
          <p className="mt-3 text-center text-xs text-muted-foreground">Votre meilleur score est retenu. Rejouez pour l'améliorer ; l'organisateur suit le classement en direct.</p>
        </>
      )}
    </Shell>
  );
}
