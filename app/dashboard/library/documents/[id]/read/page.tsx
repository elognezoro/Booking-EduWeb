import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canViewDocument } from "@/lib/library/access";
import { ProtectedReader } from "@/components/library/protected-reader";
import { fmtDateTime } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function DocumentReadPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const doc = await prisma.documentResource.findUnique({ where: { id: params.id } });
  if (!doc) notFound();
  if (!canViewDocument(user, doc) || !doc.consultationAllowed || !doc.fileKey) notFound();

  const watermark = `${user.fullName} · ${user.email} · ${fmtDateTime(new Date())}`;

  return (
    <div className="space-y-4">
      <Link href={`/dashboard/library/documents/${doc.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour à la fiche
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">{doc.title}</h1>
          <p className="text-sm text-muted-foreground">Consultation en lecture seule</p>
        </div>
        <p className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" /> Lecture à l'écran · impression et copie désactivées
        </p>
      </div>

      <ProtectedReader fileUrl={`/api/documents/${doc.id}/file`} watermark={watermark} />

      <p className="text-center text-xs text-muted-foreground">
        Ce document vous est présenté en lecture seule. Toute reproduction est tracée par le filigrane à votre nom.
      </p>
    </div>
  );
}
