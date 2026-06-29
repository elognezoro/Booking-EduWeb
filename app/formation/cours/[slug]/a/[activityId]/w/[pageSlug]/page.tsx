import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, History, Trash2, Home } from "lucide-react";
import { getLmsAccess, canEditCourse, getCourseRole } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { parseWikiConfig } from "@/lib/lms-wiki";
import { Card, CardContent } from "@/components/ui/card";
import { WikiPageEditor } from "@/components/lms/wiki-page-editor";
import { ConfirmActionButton } from "@/components/confirm-action";
import { deleteWikiPage } from "@/app/actions/lms";

export const dynamic = "force-dynamic";

export default async function WikiPageView({ params }: { params: { slug: string; activityId: string; pageSlug: string } }) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const page = await prisma.lmsWikiPage.findUnique({
    where: { activityId_slug: { activityId: params.activityId, slug: params.pageSlug } },
    include: { activity: { select: { id: true, title: true, type: true, wikiConfig: true, section: { select: { courseId: true, course: { select: { slug: true } } } } } } },
  });
  if (!page || page.activity.type !== "WIKI" || page.activity.section.course.slug !== params.slug) notFound();

  const courseId = page.activity.section.courseId;
  const canEdit = await canEditCourse(access, courseId);
  const role = await getCourseRole(access.userId, courseId);
  if (!canEdit && role === null) redirect(`/formation/cours/${params.slug}`);
  const config = parseWikiConfig(page.activity.wikiConfig);
  const canEditPages = canEdit || (role !== null && config.allowStudentEdit);

  const wikiHref = `/formation/cours/${params.slug}/a/${page.activityId}`;
  const pageBase = `${wikiHref}/w/${page.slug}`;
  const pages = await prisma.lmsWikiPage.findMany({ where: { activityId: page.activityId }, orderBy: [{ isHome: "desc" }, { title: "asc" }], select: { id: true, slug: true, title: true, isHome: true } });

  return (
    <div className="space-y-5">
      <Link href={wikiHref} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> {page.activity.title}</Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="flex min-w-0 items-center gap-2 break-words text-2xl font-extrabold tracking-tight text-foreground">
          {page.isHome && <Home className="size-5 shrink-0 text-advanced-fg" />}
          {page.title}
        </h1>
        <div className="flex items-center gap-2">
          <Link href={`${pageBase}/historique`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"><History className="size-4" /> Historique</Link>
          {canEdit && !page.isHome && (
            <ConfirmActionButton action={deleteWikiPage} hidden={{ pageId: page.id }} triggerLabel="Supprimer" triggerIcon={<Trash2 className="size-4" />} triggerVariant="ghost" triggerSize="sm" title={`Supprimer la page « ${page.title} » ?`} description="La page et tout son historique seront supprimés définitivement." confirmLabel="Supprimer" confirmVariant="destructive" />
          )}
        </div>
      </div>

      <Card><CardContent className="py-5"><WikiPageEditor page={{ id: page.id, content: page.content }} canEdit={canEditPages} /></CardContent></Card>

      {pages.length > 1 && (
        <Card><CardContent className="py-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Pages du wiki</p>
          <div className="flex flex-wrap gap-2">
            {pages.map((p) => (
              <Link key={p.id} href={`${wikiHref}/w/${p.slug}`} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm ${p.slug === page.slug ? "border-advanced-fg bg-advanced/10 font-semibold text-advanced-fg" : "border-border text-foreground hover:bg-secondary"}`}>
                {p.isHome && <Home className="size-3" />} {p.title}
              </Link>
            ))}
          </div>
        </CardContent></Card>
      )}
    </div>
  );
}
