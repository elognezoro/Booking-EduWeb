import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLmsAccess, canEditCourse } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { QUESTION_TYPE_LABEL, type LmsQuestionType } from "@/lib/lms-questions";
import { QuestionEditor } from "@/components/lms/question-editor";

export const dynamic = "force-dynamic";

export default async function EditQuestionPage({ params }: { params: { slug: string; id: string } }) {
  const access = (await getLmsAccess())!;
  const q = await prisma.lmsQuestion.findUnique({ where: { id: params.id }, include: { course: { select: { id: true, slug: true } } } });
  if (!q || q.course.slug !== params.slug) notFound();
  if (!(await canEditCourse(access, q.courseId))) redirect(`/formation/cours/${q.course.slug}`);
  let data: unknown = {};
  try { data = JSON.parse(q.data); } catch { data = {}; }

  return (
    <div className="space-y-4">
      <Link href={`/formation/cours/${q.course.slug}/banque`} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> Banque de questions</Link>
      <h1 className="text-xl font-extrabold text-foreground">Modifier — {QUESTION_TYPE_LABEL[q.type] ?? q.type}</h1>
      <QuestionEditor
        courseId={q.courseId}
        courseSlug={q.course.slug}
        type={q.type as LmsQuestionType}
        initial={{ id: q.id, name: q.name, questionText: q.questionText, generalFeedback: q.generalFeedback ?? "", defaultMark: q.defaultMark, data }}
      />
    </div>
  );
}
