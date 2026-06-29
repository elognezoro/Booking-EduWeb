import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { getLmsAccess, canEditCourse, getCourseRole, lmsDisplayNames } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { RichContent } from "@/components/lms/rich-content";
import { ConfirmActionButton } from "@/components/confirm-action";
import { revertWikiPage } from "@/app/actions/lms";

export const dynamic = "force-dynamic";

function fmtDate(iso: string | Date): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Abidjan" });
}

export default async function WikiHistoryPage({ params }: { params: { slug: string; activityId: string; pageSlug: string } }) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const page = await prisma.lmsWikiPage.findUnique({
    where: { activityId_slug: { activityId: params.activityId, slug: params.pageSlug } },
    include: {
      revisions: { orderBy: { createdAt: "desc" } },
      activity: { select: { id: true, type: true, section: { select: { courseId: true, course: { select: { slug: true } } } } } },
    },
  });
  if (!page || page.activity.type !== "WIKI" || page.activity.section.course.slug !== params.slug) notFound();

  const courseId = page.activity.section.courseId;
  const canEdit = await canEditCourse(access, courseId);
  const role = await getCourseRole(access.userId, courseId);
  if (!canEdit && role === null) redirect(`/formation/cours/${params.slug}`);

  const names = await lmsDisplayNames(page.revisions.map((r) => r.userId));
  const nameOf = (uid: string) => names.get(uid)?.fullName || names.get(uid)?.email || "Utilisateur";
  const pageHref = `/formation/cours/${params.slug}/a/${page.activityId}/w/${page.slug}`;

  return (
    <div className="space-y-5">
      <Link href={pageHref} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> {page.title}</Link>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Historique — {page.title}</h1>

      {page.revisions.length === 0 ? (
        <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">Aucune version enregistrée pour le moment.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {page.revisions.map((r, i) => (
            <Card key={r.id}><CardContent className="py-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{i === 0 ? "Version actuelle" : `Version ${page.revisions.length - i}`} <span className="font-normal text-muted-foreground">· {nameOf(r.userId)} · {fmtDate(r.createdAt)}</span></p>
                {canEdit && i !== 0 && (
                  <ConfirmActionButton action={revertWikiPage} hidden={{ revisionId: r.id }} triggerLabel="Restaurer" triggerIcon={<RotateCcw className="size-4" />} triggerVariant="outline" triggerSize="sm" title="Restaurer cette version ?" description="Le contenu de la page sera remplacé par cette version (une nouvelle entrée d'historique est créée)." confirmLabel="Restaurer" />
                )}
              </div>
              {r.content ? <div className="rounded-lg border border-border bg-secondary/30 p-3"><RichContent html={r.content} /></div> : <p className="text-sm italic text-muted-foreground">(page vide)</p>}
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
}
