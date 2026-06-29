import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLmsAccess, canEditCourse } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { QUESTION_TYPES, defaultData, type LmsQuestionType } from "@/lib/lms-questions";
import { QuestionEditor } from "@/components/lms/question-editor";

export const dynamic = "force-dynamic";

export default async function NewQuestionPage({ params, searchParams }: { params: { slug: string }; searchParams: { type?: string } }) {
  const access = (await getLmsAccess())!;
  const course = await prisma.lmsCourse.findUnique({ where: { slug: params.slug }, select: { id: true, slug: true, title: true } });
  if (!course) notFound();
  if (!(await canEditCourse(access, course.id))) redirect(`/formation/cours/${course.slug}`);
  const meta = QUESTION_TYPES.find((t) => t.key === searchParams.type) ?? QUESTION_TYPES[0];
  const type = meta.key as LmsQuestionType;

  return (
    <div className="space-y-4">
      <Link href={`/formation/cours/${course.slug}/banque`} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> Banque de questions</Link>
      <h1 className="text-xl font-extrabold text-foreground">Nouvelle question — {meta.label}</h1>
      <QuestionEditor courseId={course.id} courseSlug={course.slug} type={type} initial={{ name: "", questionText: "", generalFeedback: "", defaultMark: 1, data: defaultData(type) }} />
    </div>
  );
}
