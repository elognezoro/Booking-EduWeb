import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canDownloadDocument, canViewDocument, isDownloadPrivileged } from "@/lib/library/access";
import { readDocumentFile } from "@/lib/library/storage";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const doc = await prisma.documentResource.findUnique({ where: { id: params.id } });
  if (!doc) return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  if (!doc.fileKey) return NextResponse.json({ error: "Aucun fichier disponible." }, { status: 404 });

  const wantsDownload = req.nextUrl.searchParams.get("dl") === "1";

  if (wantsDownload) {
    // Téléchargement : soumis aux conditions d'accès…
    const access = canDownloadDocument(user, doc);
    if (!access.ok) return NextResponse.json({ error: access.reason ?? "Accès refusé." }, { status: 403 });
    // …et au paiement si le document est payant (sauf bibliothécaire / déposant).
    if (doc.downloadPrice > 0 && !isDownloadPrivileged(user, doc)) {
      const paid = user?.id
        ? await prisma.documentPurchase.findFirst({ where: { documentId: doc.id, userId: user.id } })
        : null;
      if (!paid) return NextResponse.json({ error: "Paiement requis pour télécharger ce document." }, { status: 402 });
    }
  } else {
    // Consultation en ligne (lecture seule) : autorisée à qui peut voir la fiche.
    if (!canViewDocument(user, doc) || !doc.consultationAllowed) {
      return NextResponse.json({ error: "Consultation non autorisée." }, { status: 403 });
    }
  }

  let buffer: Buffer;
  try {
    buffer = await readDocumentFile(doc.fileKey);
  } catch {
    return NextResponse.json({ error: "Fichier indisponible sur le serveur." }, { status: 404 });
  }

  // Journalisation et compteurs selon le mode.
  const ip = req.headers.get("x-forwarded-for") ?? undefined;
  if (wantsDownload) {
    await prisma.$transaction([
      prisma.documentDownload.create({ data: { documentId: doc.id, userId: user?.id ?? null, ipAddress: ip } }),
      prisma.documentResource.update({ where: { id: doc.id }, data: { downloadCount: { increment: 1 } } }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.documentConsultation.create({ data: { documentId: doc.id, userId: user?.id ?? null, ipAddress: ip } }),
      prisma.documentResource.update({ where: { id: doc.id }, data: { consultationCount: { increment: 1 } } }),
    ]);
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": doc.fileMime ?? "application/octet-stream",
      "Content-Disposition": `${wantsDownload ? "attachment" : "inline"}; filename="${encodeURIComponent(doc.fileName ?? "document")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
