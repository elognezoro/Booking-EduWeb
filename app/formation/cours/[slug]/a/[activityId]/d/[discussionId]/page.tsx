import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Pin, PinOff, Lock, LockOpen, Trash2 } from "lucide-react";
import { getLmsAccess, canEditCourse, getCourseRole, lmsDisplayNames } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichContent } from "@/components/lms/rich-content";
import { ForumReplyForm } from "@/components/lms/forum-reply-form";
import { ConfirmActionButton } from "@/components/confirm-action";
import { deleteDiscussion, deletePost, toggleDiscussionFlag } from "@/app/actions/lms";

export const dynamic = "force-dynamic";

function fmtDate(iso: string | Date): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Abidjan" });
}

export default async function DiscussionPage({ params }: { params: { slug: string; activityId: string; discussionId: string } }) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const discussion = await prisma.lmsForumDiscussion.findUnique({
    where: { id: params.discussionId },
    include: {
      posts: { orderBy: { createdAt: "asc" } },
      activity: { select: { id: true, title: true, type: true, section: { select: { courseId: true, course: { select: { slug: true, visible: true } } } } } },
    },
  });
  if (!discussion || discussion.activityId !== params.activityId || discussion.activity.section.course.slug !== params.slug) notFound();

  const courseId = discussion.activity.section.courseId;
  const canEdit = await canEditCourse(access, courseId);
  const role = await getCourseRole(access.userId, courseId);
  if (!canEdit && role === null) redirect(`/formation/cours/${params.slug}`);

  const names = await lmsDisplayNames([discussion.userId, ...discussion.posts.map((p) => p.userId)]);
  const nameOf = (uid: string) => names.get(uid)?.fullName || names.get(uid)?.email || "Utilisateur";
  const forumHref = `/formation/cours/${params.slug}/a/${discussion.activityId}`;
  const canReply = canEdit || (!discussion.locked && role !== null);

  return (
    <div className="space-y-5">
      <Link href={forumHref} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> {discussion.activity.title}</Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="flex min-w-0 items-center gap-2 break-words text-2xl font-extrabold tracking-tight text-foreground">
          {discussion.pinned && <Pin className="size-5 text-advanced-fg" />}
          {discussion.locked && <Lock className="size-5 text-muted-foreground" />}
          {discussion.title}
        </h1>
        {canEdit && (
          <div className="flex flex-wrap items-center gap-2">
            <form action={toggleDiscussionFlag}><input type="hidden" name="id" value={discussion.id} /><input type="hidden" name="flag" value="pinned" /><Button type="submit" variant="outline" size="sm">{discussion.pinned ? <><PinOff className="size-4" /> Désépingler</> : <><Pin className="size-4" /> Épingler</>}</Button></form>
            <form action={toggleDiscussionFlag}><input type="hidden" name="id" value={discussion.id} /><input type="hidden" name="flag" value="locked" /><Button type="submit" variant="outline" size="sm">{discussion.locked ? <><LockOpen className="size-4" /> Déverrouiller</> : <><Lock className="size-4" /> Verrouiller</>}</Button></form>
          </div>
        )}
      </div>

      {/* Message d'ouverture */}
      <Card><CardContent className="py-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{nameOf(discussion.userId)} <span className="font-normal text-muted-foreground">· {fmtDate(discussion.createdAt)}</span></p>
          {(canEdit || discussion.userId === access.userId) && (
            <ConfirmActionButton action={deleteDiscussion} hidden={{ id: discussion.id }} triggerLabel="Supprimer" triggerIcon={<Trash2 className="size-4" />} triggerVariant="ghost" triggerSize="sm" title="Supprimer cette discussion ?" description="La discussion et toutes ses réponses seront supprimées définitivement." confirmLabel="Supprimer" confirmVariant="destructive" />
          )}
        </div>
        <RichContent html={discussion.message} />
      </CardContent></Card>

      {/* Réponses */}
      <div className="space-y-2">
        <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{discussion.posts.length} réponse(s)</p>
        {discussion.posts.length === 0 && <p className="text-sm text-muted-foreground">Aucune réponse pour le moment.</p>}
        {discussion.posts.map((p) => (
          <Card key={p.id}><CardContent className="py-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{nameOf(p.userId)} <span className="font-normal text-muted-foreground">· {fmtDate(p.createdAt)}</span></p>
              {(canEdit || p.userId === access.userId) && (
                <ConfirmActionButton action={deletePost} hidden={{ id: p.id }} triggerLabel="" triggerIcon={<Trash2 className="size-4" />} triggerVariant="ghost" triggerSize="icon-sm" title="Supprimer cette réponse ?" confirmLabel="Supprimer" confirmVariant="destructive" />
              )}
            </div>
            <RichContent html={p.message} />
          </CardContent></Card>
        ))}
      </div>

      {/* Répondre */}
      {canReply ? (
        <Card><CardContent className="py-5"><h2 className="mb-3 font-bold text-foreground">Répondre</h2><ForumReplyForm discussionId={discussion.id} /></CardContent></Card>
      ) : (
        <Card><CardContent className="py-4 text-sm text-muted-foreground">Cette discussion est verrouillée : les réponses sont closes.</CardContent></Card>
      )}
    </div>
  );
}
