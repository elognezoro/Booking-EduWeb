import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/json";
import { Card } from "@/components/ui/card";
import { Consigne } from "@/components/games/consigne";
import { Quiz, type QuizQuestion } from "@/components/games/quiz";
import { GameLocked } from "@/components/games/game-locked";
import { getEffectiveGame } from "@/lib/games/config";
import { getGameAccess } from "@/lib/games/access";

export const dynamic = "force-dynamic";
export const metadata = { title: "Culture générale — Sport cérébral" };

type Level = "facile" | "moyen" | "difficile";
const VALID: Level[] = ["facile", "moyen", "difficile"];

export default async function CultureGeneralePage({ searchParams }: { searchParams: { niveau?: string } }) {
  const niveau = (VALID.includes(searchParams.niveau as Level) ? searchParams.niveau : "facile") as Level;
  const game = (await getEffectiveGame("culture-generale"))!;
  const { allowed, access } = await getGameAccess("culture-generale");

  const rows = allowed
    ? await prisma.brainSportQuestion.findMany({ where: { gameSlug: "culture-generale", level: niveau, active: true } })
    : [];
  // mélange + 8 max
  const shuffled = rows.sort(() => Math.random() - 0.5).slice(0, 8);
  const questions: QuizQuestion[] = shuffled.map((r) => ({
    id: r.id,
    prompt: r.prompt,
    choices: parseJson<string[]>(r.choices, []),
    answerIndex: r.answerIndex,
    explanation: r.explanation,
  }));

  return (
    <section className="section py-10">
      <Link href="/sport-cerebral" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Sport cérébral
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">{game.title}</h1>
      <p className="mt-1 text-muted-foreground">{game.short}</p>

      <div className="mt-5 max-w-3xl"><Consigne text={game.consigne} audioUrl={game.audioUrl} /></div>

      {allowed ? (
        <Card className="mt-5 p-5 sm:p-8">
          <Quiz questions={questions} level={niveau} />
        </Card>
      ) : (
        <GameLocked title={game.title} access={access} />
      )}
    </section>
  );
}
