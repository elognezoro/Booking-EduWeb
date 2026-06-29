import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getLmsAccess, canEditCourse, getCourseRole } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { detectMedia } from "@/lib/lms-media";
import { Card, CardContent } from "@/components/ui/card";
import { RichContent } from "@/components/lms/rich-content";
import { PageEditor } from "@/components/lms/page-editor";
import { UrlEditButton } from "@/components/lms/url-edit-button";
import { ConfirmActionButton } from "@/components/confirm-action";
import { deleteActivity } from "@/app/actions/lms";

export const dynamic = "force-dynamic";

function MediaBlock({ url, intro }: { url: string; intro: string | null }) {
  const m = detectMedia(url);
  return (
    <div className="space-y-3">
      {intro && <RichContent html={intro} />}
      {m.kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.src} alt="" className="max-w-full rounded-lg" />
      )}
      {(m.kind === "youtube" || m.kind === "vimeo") && (
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
          <iframe src={m.embed} className="size-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Vidéo" />
        </div>
      )}
      {m.kind === "video" && <video src={m.src} controls className="w-full rounded-lg" />}
      {m.kind === "audio" && <audio src={m.src} controls className="w-full" />}
      {m.kind === "pdf" && <iframe src={m.src} className="h-[70vh] w-full rounded-lg border border-border" title="Document PDF" />}
      {(m.kind === "link" || m.kind === "iframe") && (
        <a href={m.src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary underline">Ouvrir le lien ↗</a>
      )}
    </div>
  );
}

export default async function ActivityPage({ params }: { params: { slug: string; activityId: string } }) {
  const access = (await getLmsAccess())!;
  const activity = await prisma.lmsActivity.findUnique({
    where: { id: params.activityId },
    include: { section: { select: { title: true, course: { select: { id: true, slug: true, title: true, visible: true } } } } },
  });
  if (!activity || activity.section.course.slug !== params.slug) notFound();
  const course = activity.section.course;
  const canEdit = await canEditCourse(access, course.id);
  if (!course.visible && !canEdit) notFound();
  const role = await getCourseRole(access.userId, course.id);
  if (!canEdit && role === null) redirect(`/formation/cours/${course.slug}`); // inscription requise

  return (
    <div className="space-y-5">
      <Link href={`/formation/cours/${course.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> {course.title}</Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{activity.section.title}</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{activity.title}</h1>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2">
            {activity.type === "URL" && <UrlEditButton activity={{ id: activity.id, title: activity.title, externalUrl: activity.externalUrl ?? "", intro: activity.intro ?? "" }} />}
            <ConfirmActionButton
              action={deleteActivity}
              hidden={{ id: activity.id }}
              triggerLabel="Supprimer"
              triggerIcon={<Trash2 className="size-4" />}
              triggerVariant="ghost"
              triggerSize="sm"
              title={`Supprimer « ${activity.title} » ?`}
              description="Ce contenu sera supprimé définitivement."
              confirmLabel="Supprimer"
              confirmVariant="destructive"
            />
          </div>
        )}
      </div>

      <Card>
        <CardContent className="py-5">
          {activity.type === "PAGE" && <PageEditor activity={{ id: activity.id, title: activity.title, content: activity.content ?? "" }} canEdit={canEdit} />}
          {activity.type === "URL" && <MediaBlock url={activity.externalUrl ?? ""} intro={activity.intro} />}
          {activity.type === "QUIZ" && <p className="text-sm text-muted-foreground">Le module Quiz (exerciseurs) sera disponible à la prochaine étape.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
