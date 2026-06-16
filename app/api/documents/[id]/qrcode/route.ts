import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const doc = await prisma.documentResource.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!doc) return NextResponse.json({ error: "Document introuvable." }, { status: 404 });

  const target = `${APP_URL}/dashboard/library/documents/${doc.id}`;
  const png = await QRCode.toBuffer(target, {
    width: 240,
    margin: 1,
    color: { dark: "#064B3A", light: "#FFFFFF" },
  });

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
}
