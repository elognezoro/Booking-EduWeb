import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Consigne } from "@/components/games/consigne";
import { SudokuBoard } from "@/components/games/sudoku-board";
import { getEffectiveGame } from "@/lib/games/config";
import type { SudokuLevel } from "@/lib/games/sudoku";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sudoku — Sport cérébral" };

const VALID: SudokuLevel[] = ["facile", "moyen", "difficile"];

export default async function SudokuPage({ searchParams }: { searchParams: { niveau?: string } }) {
  const niveau = (VALID.includes(searchParams.niveau as SudokuLevel) ? searchParams.niveau : "facile") as SudokuLevel;
  const game = (await getEffectiveGame("sudoku"))!;

  return (
    <section className="section py-10">
      <Link href="/sport-cerebral" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Sport cérébral
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">{game.title}</h1>
      <p className="mt-1 text-muted-foreground">{game.short}</p>

      <div className="mt-5 max-w-3xl"><Consigne text={game.consigne} audioUrl={game.audioUrl} /></div>

      <Card className="mt-5 p-5 sm:p-6">
        <SudokuBoard initialLevel={niveau} />
      </Card>
    </section>
  );
}
