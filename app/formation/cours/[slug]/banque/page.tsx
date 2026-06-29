import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Plus, Pencil, Trash2, HelpCircle } from "lucide-react";
import { getLmsAccess, canEditCourse } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { QUESTION_TYPES, QUESTION_TYPE_LABEL } from "@/lib/lms-questions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmActionButton } from "@/components/confirm-action";
import { deleteQuestion } from "@/app/actions/lms";

export const dynamic = "force-dynamic";

export default async function BankPage({ params }: { params: { slug: string } }) {
  const access = (await getLmsAccess())!;
  const course = await prisma.lmsCourse.findUnique({ where: { slug: params.slug }, select: { id: true, slug: true, title: true } });
  if (!course) notFound();
  if (!(await canEditCourse(access, course.id))) redirect(`/formation/cours/${course.slug}`);
  const questions = await prisma.lmsQuestion.findMany({ where: { courseId: course.id }, orderBy: { createdAt: "desc" }, select: { id: true, name: true, type: true, defaultMark: true } });

  return (
    <div className="space-y-5">
      <Link href={`/formation/cours/${course.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> {course.title}</Link>
      <div className="flex items-start gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><HelpCircle className="size-6" /></span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Banque de questions</h1>
          <p className="text-muted-foreground">Créez les exerciseurs réutilisables dans les quiz de ce cours.</p>
        </div>
      </div>

      <Card>
        <CardContent className="py-4">
          <p className="mb-2.5 text-sm font-bold uppercase tracking-wide text-muted-foreground">Nouvelle question</p>
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((t) => (
              <Button key={t.key} asChild variant="outline" size="sm" title={t.desc}>
                <Link href={`/formation/cours/${course.slug}/banque/nouveau?type=${t.key}`}><Plus className="size-4" /> {t.label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {questions.length === 0 ? (
        <Card><CardContent className="py-6 text-sm text-muted-foreground">Aucune question pour le moment. Choisissez un type ci-dessus pour en créer une.</CardContent></Card>
      ) : (
        <Card><CardContent className="divide-y divide-border py-1">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{q.name}</p>
                <p className="text-xs text-muted-foreground">{QUESTION_TYPE_LABEL[q.type] ?? q.type} · {q.defaultMark} pt</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button asChild variant="ghost" size="icon-sm" aria-label="Modifier"><Link href={`/formation/cours/${course.slug}/banque/${q.id}`}><Pencil className="size-4" /></Link></Button>
                <ConfirmActionButton action={deleteQuestion} hidden={{ id: q.id }} triggerLabel="" triggerIcon={<Trash2 className="size-4" />} triggerVariant="ghost" triggerSize="icon-sm" title={`Supprimer « ${q.name} » ?`} description="La question sera supprimée définitivement." confirmLabel="Supprimer" confirmVariant="destructive" />
              </div>
            </div>
          ))}
        </CardContent></Card>
      )}
    </div>
  );
}
