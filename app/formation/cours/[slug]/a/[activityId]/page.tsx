import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Trash2, Play, Eye } from "lucide-react";
import { getLmsAccess, canEditCourse, getCourseRole } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { detectMedia } from "@/lib/lms-media";
import { parseQuizConfig, canSeeCorrige, correctAnswerText, gradeOne, CORRIGE_LABEL } from "@/lib/lms-quiz";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichContent } from "@/components/lms/rich-content";
import { PageEditor } from "@/components/lms/page-editor";
import { UrlEditButton } from "@/components/lms/url-edit-button";
import { QuizConfigForm } from "@/components/lms/quiz-config";
import { QuizQuestionPicker } from "@/components/lms/quiz-question-picker";
import { ConfirmActionButton } from "@/components/confirm-action";
import { deleteActivity, startAttempt, releaseCorrige } from "@/app/actions/lms";

export const dynamic = "force-dynamic";

const AUTO_TYPES = ["MCQ", "TRUEFALSE", "SHORTANSWER", "NUMERICAL"];

function MediaBlock({ url, intro }: { url: string; intro: string | null }) {
  const m = detectMedia(url);
  return (
    <div className="space-y-3">
      {intro && <RichContent html={intro} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {m.kind === "image" && <img src={m.src} alt="" className="max-w-full rounded-lg" />}
      {(m.kind === "youtube" || m.kind === "vimeo") && (
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-border"><iframe src={m.embed} className="size-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Vidéo" /></div>
      )}
      {m.kind === "video" && <video src={m.src} controls className="w-full rounded-lg" />}
      {m.kind === "audio" && <audio src={m.src} controls className="w-full" />}
      {m.kind === "pdf" && <iframe src={m.src} className="h-[70vh] w-full rounded-lg border border-border" title="Document PDF" />}
      {(m.kind === "link" || m.kind === "iframe") && <a href={m.src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary underline">Ouvrir le lien ↗</a>}
    </div>
  );
}

interface QuizActivity { id: string; title: string; intro: string | null; quizConfig: string | null }

async function QuizSection({ activity, courseId, courseSlug, canEdit, userId }: { activity: QuizActivity; courseId: string; courseSlug: string; canEdit: boolean; userId: string }) {
  const config = parseQuizConfig(activity.quizConfig);
  const links = await prisma.lmsQuizQuestion.findMany({
    where: { activityId: activity.id },
    include: { question: { select: { id: true, name: true, type: true, data: true, questionText: true, generalFeedback: true } } },
    orderBy: { position: "asc" },
  });

  if (canEdit) {
    const inQuiz = new Set(links.map((l) => l.questionId));
    const bank = await prisma.lmsQuestion.findMany({ where: { courseId, type: { in: AUTO_TYPES } }, select: { id: true, name: true, type: true }, orderBy: { createdAt: "desc" } });
    const available = bank.filter((q) => !inQuiz.has(q.id));
    const current = links.map((l) => ({ linkId: l.id, name: l.question.name, type: l.question.type, mark: l.mark ?? 1 }));
    return (
      <div className="space-y-4">
        <Card><CardContent className="py-5"><h2 className="mb-3 font-bold text-foreground">Réglages</h2><QuizConfigForm activityId={activity.id} title={activity.title} intro={activity.intro ?? ""} config={config} /></CardContent></Card>
        <Card><CardContent className="py-5"><h2 className="mb-3 font-bold text-foreground">Questions</h2><QuizQuestionPicker activityId={activity.id} available={available} current={current} /></CardContent></Card>
        <Card><CardContent className="py-4">
          <p className="text-sm text-foreground"><strong>Visibilité du corrigé :</strong> {CORRIGE_LABEL[config.corrige].toLowerCase()}.</p>
          {config.corrige === "manual" && (config.released
            ? <p className="mt-1 text-sm font-semibold text-available-fg">Corrigé libéré ✓</p>
            : <form action={releaseCorrige} className="mt-2"><input type="hidden" name="activityId" value={activity.id} /><Button type="submit" size="sm" variant="outline">Libérer le corrigé maintenant</Button></form>)}
        </CardContent></Card>
      </div>
    );
  }

  // Vue apprenant
  const attempts = await prisma.lmsAttempt.findMany({ where: { activityId: activity.id, userId, state: "finished" }, orderBy: { submittedAt: "desc" } });
  const used = attempts.length;
  const remaining = config.attempts === 0 ? Infinity : Math.max(0, config.attempts - used);
  const pct = (a: { score: number | null; maxScore: number | null }) => (a.maxScore && a.maxScore > 0 ? Math.round(((a.score ?? 0) / a.maxScore) * 100) : 0);
  let grade = 0;
  if (used) {
    const arr = attempts.map(pct);
    grade = config.gradeMethod === "last" ? pct(attempts[0]) : config.gradeMethod === "average" ? Math.round(arr.reduce((s, x) => s + x, 0) / arr.length) : Math.max(...arr);
  }
  const showCorrige = canSeeCorrige(config, { isTeacher: false, finished: used > 0, attemptsRemaining: remaining === Infinity ? 1 : remaining });
  const latest = attempts[0];
  let latestAnswers: Record<string, unknown> = {};
  if (latest?.answers) { try { latestAnswers = JSON.parse(latest.answers) as Record<string, unknown>; } catch { latestAnswers = {}; } }

  return (
    <div className="space-y-4">
      {activity.intro && <Card><CardContent className="py-4"><RichContent html={activity.intro} /></CardContent></Card>}
      <Card><CardContent className="space-y-3 py-5">
        <p className="text-sm text-muted-foreground">
          {links.length} question(s){config.attempts > 0 ? ` · ${config.attempts} tentative(s) autorisée(s)` : " · tentatives illimitées"}{config.timeLimitMin > 0 ? ` · ${config.timeLimitMin} min` : ""}. Réussite à {config.passing} %.
        </p>
        {used > 0 && <p className="text-sm font-semibold text-foreground">Votre note : {grade} % <span className="font-normal text-muted-foreground">({used} tentative(s))</span> — {grade >= config.passing ? "Réussi ✓" : "Non atteint"}</p>}
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ce quiz n'a pas encore de question.</p>
        ) : remaining > 0 ? (
          <form action={startAttempt}><input type="hidden" name="activityId" value={activity.id} /><Button type="submit"><Play className="size-4" /> {used > 0 ? "Refaire le quiz" : "Commencer le quiz"}</Button></form>
        ) : (
          <p className="text-sm text-muted-foreground">Vous avez utilisé toutes vos tentatives.</p>
        )}
      </CardContent></Card>

      {showCorrige && latest && (
        <Card><CardContent className="py-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-foreground"><Eye className="size-4 text-advanced-fg" /> Corrigé</h2>
          <div className="space-y-4">
            {links.map((l, i) => {
              const frac = gradeOne(l.question.type, l.question.data, latestAnswers[l.question.id]);
              return (
                <div key={l.id} className="rounded-xl border border-border p-3">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Question {i + 1} — {frac >= 1 ? "Correct ✓" : frac > 0 ? `Partiel (${Math.round(frac * 100)} %)` : "Incorrect ✗"}</p>
                  <RichContent html={l.question.questionText} />
                  <p className="mt-2 text-sm text-foreground"><strong>Bonne réponse :</strong> {correctAnswerText(l.question.type, l.question.data)}</p>
                  {l.question.generalFeedback && <div className="mt-1 rounded-lg bg-secondary/50 p-2"><RichContent html={l.question.generalFeedback} /></div>}
                </div>
              );
            })}
          </div>
        </CardContent></Card>
      )}
      {!showCorrige && used > 0 && <Card><CardContent className="py-4 text-sm text-muted-foreground">Le corrigé sera disponible : {CORRIGE_LABEL[config.corrige].toLowerCase()}.</CardContent></Card>}
    </div>
  );
}

export default async function ActivityPage({ params }: { params: { slug: string; activityId: string } }) {
  const access = (await getLmsAccess())!;
  const activity = await prisma.lmsActivity.findUnique({
    where: { id: params.activityId },
    include: { section: { select: { title: true, courseId: true, course: { select: { id: true, slug: true, title: true, visible: true } } } } },
  });
  if (!activity || activity.section.course.slug !== params.slug) notFound();
  const course = activity.section.course;
  const canEdit = await canEditCourse(access, course.id);
  if (!course.visible && !canEdit) notFound();
  const role = await getCourseRole(access.userId, course.id);
  if (!canEdit && role === null) redirect(`/formation/cours/${course.slug}`);

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
            <ConfirmActionButton action={deleteActivity} hidden={{ id: activity.id }} triggerLabel="Supprimer" triggerIcon={<Trash2 className="size-4" />} triggerVariant="ghost" triggerSize="sm" title={`Supprimer « ${activity.title} » ?`} description="Ce contenu sera supprimé définitivement." confirmLabel="Supprimer" confirmVariant="destructive" />
          </div>
        )}
      </div>

      {activity.type === "PAGE" && <Card><CardContent className="py-5"><PageEditor activity={{ id: activity.id, title: activity.title, content: activity.content ?? "" }} canEdit={canEdit} /></CardContent></Card>}
      {activity.type === "URL" && <Card><CardContent className="py-5"><MediaBlock url={activity.externalUrl ?? ""} intro={activity.intro} /></CardContent></Card>}
      {activity.type === "QUIZ" && <QuizSection activity={{ id: activity.id, title: activity.title, intro: activity.intro, quizConfig: activity.quizConfig }} courseId={course.id} courseSlug={course.slug} canEdit={canEdit} userId={access.userId} />}
    </div>
  );
}
