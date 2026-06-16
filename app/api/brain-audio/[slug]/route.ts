import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readGameAudio, audioMime } from "@/lib/games/audio-storage";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const cfg = await prisma.brainSportGameConfig.findUnique({ where: { slug: params.slug } });
  if (!cfg?.audioPath) return new NextResponse("Aucun audio.", { status: 404 });
  try {
    const buf = await readGameAudio(cfg.audioPath);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: { "Content-Type": audioMime(cfg.audioPath), "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse("Fichier indisponible.", { status: 404 });
  }
}
