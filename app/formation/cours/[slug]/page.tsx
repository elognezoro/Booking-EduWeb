import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, UserPlus, ArrowLeft, FileText, Link2, ListChecks, HelpCircle, Download } from "lucide-react";
import { getLmsAccess, canEditCourse, getCourseRole } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionManager } from "@/components/lms/section-manager";
import { CourseEditButton } from "@/components/lms/course-edit-button";
import { enrolSelf } from "@/app/actions/lms";

export const dynamic = "force-dynamic";

const ACT_ICON: Record<string, React.ReactNode> = {
  PAGE: <FileText className="size-3.5 text-advanced-fg" />,
  URL: <Link2 className="size-3.5 text-advanced-fg" />,
  QUIZ: <ListChecks className="size-3.5 text-advanced-fg" />,
};

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const access = (await getLmsAccess())!;
  const course = await prisma.lmsCourse.findUnique({
    where: { slug: params.slug },
    include: {
      sections: {
        orderBy: { position: "asc" },
        include: { activities: { orderBy: { position: "asc" }, select: { id: true, type: true, title: true } } },
      },
    },
  });
  if (!course) notFound();
  const canEdit = await canEditCourse(access, course.id);
  if (!course.visible && !canEdit) notFound();
  const role = await getCourseRole(access.userId, course.id);
  const enrolled = role !== null;

  return (
    <div className="space-y-6">
      <Link href="/formation" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> Tous les cours</Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><BookOpen className="size-6" /></span>
          <div>
            {course.level && <p className="text-xs font-bold uppercase tracking-wide text-advanced-fg">{course.level}</p>}
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{course.title}</h1>
            {course.summary && <p className="mt-1 max-w-2xl text-muted-foreground">{course.summary}</p>}
          </div>
        </div>
        {canEdit && (
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="rounded-full bg-advanced-soft px-2.5 py-1 text-xs font-bold text-advanced-fg">Mode édition</span>
              <Button asChild variant="outline" size="sm"><Link href={`/formation/cours/${course.slug}/banque`}><HelpCircle className="size-4" /> Banque de questions</Link></Button>
              <Button asChild variant="outline" size="sm"><a href={`/api/formation/cours/${course.slug}/mbz`} download><Download className="size-4" /> Export Moodle (.mbz)</a></Button>
              <CourseEditButton course={{ id: course.id, title: course.title, level: course.level, summary: course.summary, visible: course.visible }} />
            </div>
            <p className="max-w-md text-right text-[11px] leading-snug text-muted-foreground">Export Moodle : pages, médias, quiz, devoirs, forums, wikis et ateliers. Questions converties : QCM, Vrai/Faux, réponse courte, numérique, Cloze, appariement ; les autres (glisser-déposer, ordonnancement, texte à trous) sont ignorées.</p>
          </div>
        )}
      </div>

      {!enrolled && !canEdit && (
        <Card className="border-advanced/30 bg-advanced-soft/30">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <p className="text-sm text-foreground">Inscrivez-vous pour suivre ce cours et accéder à ses contenus.</p>
            <form action={enrolSelf}>
              <input type="hidden" name="courseId" value={course.id} />
              <Button type="submit"><UserPlus className="size-4" /> S'inscrire</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {canEdit ? (
        <SectionManager courseId={course.id} courseSlug={course.slug} sections={course.sections} />
      ) : (
        <div className="space-y-3">
          {course.sections.length === 0 ? (
            <Card><CardContent className="py-6 text-sm text-muted-foreground">Ce cours n'a pas encore de contenu.</CardContent></Card>
          ) : (
            course.sections.map((s, i) => (
              <Card key={s.id}>
                <CardContent className="py-4">
                  <h3 className="font-bold text-foreground">{i + 1}. {s.title}</h3>
                  {s.summary && <p className="mt-1 text-sm text-muted-foreground">{s.summary}</p>}
                  {s.activities.length === 0 ? (
                    <p className="mt-1 text-sm text-muted-foreground">Contenu à venir.</p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {s.activities.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 text-sm text-foreground">{ACT_ICON[a.type] ?? null} {a.title}</li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
