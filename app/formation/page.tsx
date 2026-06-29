import Link from "next/link";
import { BookOpen, Layers, GraduationCap, ShieldCheck, UserPlus } from "lucide-react";
import { getLmsAccess } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourseFormButton } from "@/components/lms/course-form-button";
import { enrolSelf } from "@/app/actions/lms";

export const dynamic = "force-dynamic";

function CourseCard({ slug, title, level, sections, badge }: { slug: string; title: string; level: string | null; sections: number; badge?: string }) {
  return (
    <Link href={`/formation/cours/${slug}`} className="group block">
      <Card className="h-full transition hover:border-advanced/50 hover:shadow-card">
        <CardContent className="py-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-advanced-soft text-advanced-fg"><BookOpen className="size-5" /></span>
            {badge && <span className="rounded-full bg-advanced-soft px-2 py-0.5 text-[11px] font-bold text-advanced-fg">{badge}</span>}
          </div>
          <p className="font-bold text-foreground group-hover:text-advanced-fg">{title}</p>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {level && <span>{level}</span>}
            <span className="inline-flex items-center gap-1"><Layers className="size-3" /> {sections} section{sections > 1 ? "s" : ""}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function FormationHome() {
  const access = (await getLmsAccess())!; // garanti par le layout

  const enrolments = await prisma.lmsEnrolment.findMany({
    where: { userId: access.userId },
    include: { course: { include: { _count: { select: { sections: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  const myCourseIds = enrolments.map((e) => e.courseId);
  const catalogue = await prisma.lmsCourse.findMany({
    where: { visible: true, id: { notIn: myCourseIds.length ? myCourseIds : ["__none__"] } },
    include: { _count: { select: { sections: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const allCourses = access.isManager
    ? await prisma.lmsCourse.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { sections: true, enrolments: true } } } })
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><GraduationCap className="size-6" /></span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Espace de formation</h1>
            <p className="text-muted-foreground">Apprenez à votre rythme : cours, ressources et exercices interactifs.</p>
          </div>
        </div>
        {access.canCreateCourse && <CourseFormButton />}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Mes cours</h2>
        {enrolments.length === 0 ? (
          <Card><CardContent className="py-6 text-sm text-muted-foreground">Vous n'êtes inscrit à aucun cours pour le moment. Parcourez le catalogue ci-dessous.</CardContent></Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolments.map((e) => (
              <CourseCard key={e.id} slug={e.course.slug} title={e.course.title} level={e.course.level} sections={e.course._count.sections} badge={e.role === "TEACHER" ? "Enseignant" : "Étudiant"} />
            ))}
          </div>
        )}
      </section>

      {catalogue.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Catalogue</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogue.map((c) => (
              <Card key={c.id} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col py-4">
                  <span className="mb-2 inline-flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground"><BookOpen className="size-5" /></span>
                  <p className="font-bold text-foreground">{c.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.level ?? "—"} · {c._count.sections} section{c._count.sections > 1 ? "s" : ""}</p>
                  <form action={enrolSelf} className="mt-3">
                    <input type="hidden" name="courseId" value={c.id} />
                    <Button type="submit" size="sm" variant="outline" className="w-full"><UserPlus className="size-4" /> S'inscrire</Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {access.isManager && allCourses.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-muted-foreground"><ShieldCheck className="size-4 text-advanced-fg" /> Tous les cours (gestion)</h2>
          <Card><CardContent className="divide-y divide-border py-1">
            {allCourses.map((c) => (
              <Link key={c.id} href={`/formation/cours/${c.slug}`} className="flex items-center justify-between gap-3 py-2.5 hover:opacity-80">
                <span className="font-medium text-foreground">{c.title} {!c.visible && <span className="text-xs text-muted-foreground">(masqué)</span>}</span>
                <span className="text-xs text-muted-foreground">{c._count.sections} sect. · {c._count.enrolments} inscrit(s)</span>
              </Link>
            ))}
          </CardContent></Card>
        </section>
      )}
    </div>
  );
}
