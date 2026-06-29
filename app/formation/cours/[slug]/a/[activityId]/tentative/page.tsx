import { notFound, redirect } from "next/navigation";
import { getLmsAccess } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { QuizRunner, type RunnerQuestion } from "@/components/lms/quiz-runner";
import type { McqData } from "@/lib/lms-questions";
import { clozeRenderSegments } from "@/lib/lms-cloze";

export const dynamic = "force-dynamic";

export default async function AttemptPage({ params }: { params: { slug: string; activityId: string } }) {
  const access = (await getLmsAccess())!;
  const activity = await prisma.lmsActivity.findUnique({
    where: { id: params.activityId },
    select: { id: true, type: true, title: true, section: { select: { course: { select: { slug: true } } } } },
  });
  if (!activity || activity.type !== "QUIZ" || activity.section.course.slug !== params.slug) notFound();

  const attempt = await prisma.lmsAttempt.findFirst({ where: { activityId: activity.id, userId: access.userId, state: "inprogress" }, select: { id: true } });
  if (!attempt) redirect(`/formation/cours/${params.slug}/a/${activity.id}`);

  const links = await prisma.lmsQuizQuestion.findMany({
    where: { activityId: activity.id },
    include: { question: { select: { id: true, type: true, name: true, questionText: true, data: true } } },
    orderBy: { position: "asc" },
  });
  const questions: RunnerQuestion[] = links.map((l) => {
    const base: RunnerQuestion = { id: l.question.id, type: l.question.type, name: l.question.name, questionText: l.question.questionText };
    if (l.question.type === "MCQ") {
      try { const d = JSON.parse(l.question.data) as McqData; return { ...base, multiple: d.multiple, options: d.options.map((o) => o.text) }; } catch { return base; }
    }
    if (l.question.type === "CLOZE") {
      try { const d = JSON.parse(l.question.data) as { clozeText?: string }; return { ...base, cloze: clozeRenderSegments(d.clozeText ?? "") }; } catch { return base; }
    }
    return base;
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{activity.title}</h1>
      {questions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Ce quiz ne contient pas encore de question.</p>
      ) : (
        <QuizRunner attemptId={attempt.id} questions={questions} />
      )}
    </div>
  );
}
