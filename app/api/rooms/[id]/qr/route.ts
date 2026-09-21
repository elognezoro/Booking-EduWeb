import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { APP_URL } from "@/lib/mail";

/** QR d'émargement d'une salle multimédia : pointe vers la page publique d'arrivée. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const salle = await prisma.resource.findFirst({
    where: { id: params.id, category: { code: "SM" } },
    select: { id: true },
  });
  if (!salle) return NextResponse.json({ error: "Salle introuvable." }, { status: 404 });

  const target = `${APP_URL}/salles/${salle.id}/emargement`;
  const png = await QRCode.toBuffer(target, {
    width: 480,
    margin: 1,
    color: { dark: "#064B3A", light: "#FFFFFF" },
  });

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
}
