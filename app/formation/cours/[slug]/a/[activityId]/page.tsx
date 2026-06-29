import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Trash2, Play, Eye, Download, Clock, CheckCircle2, Pin, Lock, MessageSquare, NotebookText, Home } from "lucide-react";
import { getLmsAccess, canEditCourse, getCourseRole, lmsDisplayNames } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { detectMedia, geogebraEmbed } from "@/lib/lms-media";
import { parseQuizConfig, canSeeCorrige, correctAnswerText, gradeOne, CORRIGE_LABEL } from "@/lib/lms-quiz";
import { parseAssignConfig, isLate, type AssignConfig } from "@/lib/lms-assign";
import { parseForumConfig } from "@/lib/lms-forum";
import { parseWikiConfig } from "@/lib/lms-wiki";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichContent } from "@/components/lms/rich-content";
import { PageEditor } from "@/components/lms/page-editor";
import { UrlEditButton } from "@/components/lms/url-edit-button";
import { QuizConfigForm } from "@/components/lms/quiz-config";
import { QuizQuestionPicker } from "@/components/lms/quiz-question-picker";
import { AssignConfigForm } from "@/components/lms/assign-config";
import { SubmissionForm } from "@/components/lms/submission-form";
import { ForumDiscussionForm } from "@/components/lms/forum-discussion-form";
import { WikiNewPage } from "@/components/lms/wiki-new-page";
import { WorkshopSection } from "@/components/lms/workshop-section";
import { ConfirmActionButton } from "@/components/confirm-action";
import { deleteActivity, startAttempt, releaseCorrige, gradeSubmission, removeSubmission, configureForum, configureWiki } from "@/app/actions/lms";

function fmtDate(iso: string | Date): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Abidjan" });
}

export const dynamic = "force-dynamic";

const AUTO_TYPES = ["MCQ", "TRUEFALSE", "SHORTANSWER", "NUMERICAL", "CLOZE", "DRAGTEXT", "MATCHING", "ORDERING"];

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

interface AssignActivity { id: string; title: string; intro: string | null; assignConfig: string | null }

async function AssignSection({ activity, canEdit, userId }: { activity: AssignActivity; canEdit: boolean; userId: string }) {
  const config = parseAssignConfig(activity.assignConfig);
  const closed = !config.allowLate && !!config.dueAt && Date.now() > new Date(config.dueAt).getTime();

  if (canEdit) {
    const subs = await prisma.lmsSubmission.findMany({ where: { activityId: activity.id }, orderBy: { submittedAt: "desc" } });
    const names = await lmsDisplayNames(subs.map((s) => s.userId));
    const nameOf = (uid: string) => names.get(uid)?.fullName || names.get(uid)?.email || uid;
    const graded = subs.filter((s) => s.state === "graded").length;
    return (
      <div className="space-y-4">
        <Card><CardContent className="py-5"><h2 className="mb-3 font-bold text-foreground">Réglages</h2><AssignConfigForm activityId={activity.id} title={activity.title} intro={activity.intro ?? ""} config={config} /></CardContent></Card>
        <Card><CardContent className="py-5">
          <h2 className="mb-1 font-bold text-foreground">Remises ({subs.length})</h2>
          <p className="mb-3 text-sm text-muted-foreground">{graded} notée(s){config.dueAt ? ` · date limite : ${fmtDate(config.dueAt)}` : ""}.</p>
          {subs.length === 0 ? <p className="text-sm text-muted-foreground">Aucune remise pour le moment.</p> : (
            <div className="space-y-3">{subs.map((s) => (
              <div key={s.id} className="rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{nameOf(s.userId)}</p>
                  <p className="text-xs text-muted-foreground">Remis le {fmtDate(s.submittedAt)}{isLate(config, s.submittedAt) ? " · en retard" : ""}{s.state === "graded" ? ` · noté ${s.grade}/${config.maxGrade}` : ""}</p>
                </div>
                {s.text && <div className="mt-2 rounded-lg bg-secondary/40 p-2"><RichContent html={s.text} /></div>}
                {s.fileData && <a href={s.fileData} download={s.fileName ?? "fichier"} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> {s.fileName ?? "Télécharger le fichier"}</a>}
                <form action={gradeSubmission} className="mt-3 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <div><Label htmlFor={`g-${s.id}`}>Note /{config.maxGrade}</Label><Input id={`g-${s.id}`} name="grade" type="number" min={0} max={config.maxGrade} step="0.5" defaultValue={s.grade ?? ""} className="w-24" /></div>
                  <div className="min-w-[200px] flex-1"><Label htmlFor={`f-${s.id}`}>Retour (facultatif)</Label><Textarea id={`f-${s.id}`} name="feedback" rows={2} defaultValue={s.feedback ?? ""} /></div>
                  <Button type="submit" size="sm">{s.state === "graded" ? "Mettre à jour" : "Noter"}</Button>
                </form>
              </div>))}
            </div>
          )}
        </CardContent></Card>
      </div>
    );
  }

  // Vue apprenant
  const sub = await prisma.lmsSubmission.findUnique({ where: { activityId_userId: { activityId: activity.id, userId } } });
  return (
    <div className="space-y-4">
      {activity.intro && <Card><CardContent className="py-4"><RichContent html={activity.intro} /></CardContent></Card>}
      <Card><CardContent className="space-y-2 py-5">
        <p className="text-sm text-muted-foreground">
          Note maximale : {config.maxGrade}.{config.dueAt ? ` Date limite : ${fmtDate(config.dueAt)}.` : ""} Remise par {[config.allowText ? "texte en ligne" : null, config.allowFile ? "fichier joint" : null].filter(Boolean).join(" et/ou ")}.
        </p>
        {sub && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            {sub.state === "graded"
              ? <><CheckCircle2 className="size-4 text-available-fg" /> Noté : {sub.grade}/{config.maxGrade}</>
              : <><Clock className="size-4 text-advanced-fg" /> Remis{isLate(config, sub.submittedAt) ? " (en retard)" : ""} le {fmtDate(sub.submittedAt)}</>}
          </p>
        )}
      </CardContent></Card>

      {sub?.state === "graded" ? (
        <Card><CardContent className="py-5">
          <h2 className="mb-2 font-bold text-foreground">Votre remise</h2>
          {sub.text && <div className="rounded-lg bg-secondary/40 p-2"><RichContent html={sub.text} /></div>}
          {sub.fileData && <a href={sub.fileData} download={sub.fileName ?? "fichier"} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> {sub.fileName ?? "Votre fichier"}</a>}
          {sub.feedback && <div className="mt-3"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Retour de l'enseignant</p><div className="mt-1 rounded-lg border border-border p-2"><RichContent html={sub.feedback} /></div></div>}
        </CardContent></Card>
      ) : closed ? (
        <Card><CardContent className="py-5">
          {sub ? (
            <>
              <h2 className="mb-1 font-bold text-foreground">Votre remise</h2>
              <p className="mb-2 text-sm text-muted-foreground">La date limite est dépassée : la remise ne peut plus être modifiée (en attente de notation).</p>
              {sub.text && <div className="rounded-lg bg-secondary/40 p-2"><RichContent html={sub.text} /></div>}
              {sub.fileData && <a href={sub.fileData} download={sub.fileName ?? "fichier"} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> {sub.fileName ?? "Votre fichier"}</a>}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">La date limite est dépassée et les remises en retard ne sont pas autorisées.</p>
          )}
        </CardContent></Card>
      ) : (
        <Card><CardContent className="py-5">
          <h2 className="mb-3 font-bold text-foreground">{sub ? "Modifier ma remise" : "Remettre le devoir"}</h2>
          <SubmissionForm activityId={activity.id} config={config} current={sub ? { text: sub.text, fileName: sub.fileName } : null} />
          {sub && (
            <div className="mt-3"><ConfirmActionButton action={removeSubmission} hidden={{ id: sub.id }} triggerLabel="Retirer ma remise" triggerIcon={<Trash2 className="size-4" />} triggerVariant="ghost" triggerSize="sm" title="Retirer votre remise ?" description="Votre texte et votre fichier seront supprimés." confirmLabel="Retirer" confirmVariant="destructive" /></div>
          )}
        </CardContent></Card>
      )}
    </div>
  );
}

interface ForumActivity { id: string; title: string; intro: string | null; forumConfig: string | null }

async function ForumSection({ activity, courseSlug, canEdit, role }: { activity: ForumActivity; courseSlug: string; canEdit: boolean; role: "TEACHER" | "STUDENT" | null }) {
  const config = parseForumConfig(activity.forumConfig);
  const discussions = await prisma.lmsForumDiscussion.findMany({
    where: { activityId: activity.id },
    orderBy: [{ pinned: "desc" }, { lastPostAt: "desc" }],
    include: { _count: { select: { posts: true } } },
  });
  const names = await lmsDisplayNames(discussions.map((d) => d.userId));
  const canStart = canEdit || (role !== null && config.allowStudentDiscussions);

  return (
    <div className="space-y-4">
      {activity.intro && <Card><CardContent className="py-4"><RichContent html={activity.intro} /></CardContent></Card>}
      {canEdit && (
        <Card><CardContent className="py-5">
          <h2 className="mb-3 font-bold text-foreground">Réglages</h2>
          <form action={configureForum} className="space-y-3">
            <input type="hidden" name="activityId" value={activity.id} />
            <div><Label htmlFor="ff-title" required>Titre</Label><Input id="ff-title" name="title" defaultValue={activity.title} required /></div>
            <div><Label htmlFor="ff-intro">Consigne</Label><Textarea id="ff-intro" name="intro" rows={2} defaultValue={activity.intro ?? ""} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowStudentDiscussions" defaultChecked={config.allowStudentDiscussions} className="size-4" /> Autoriser les apprenants à ouvrir des discussions</label>
            <div className="flex justify-end"><SubmitButton pendingLabel="Enregistrement…">Enregistrer les réglages</SubmitButton></div>
          </form>
        </CardContent></Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{discussions.length} discussion(s)</p>
        {canStart && <ForumDiscussionForm activityId={activity.id} />}
      </div>

      {discussions.length === 0 ? (
        <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">Aucune discussion pour le moment.{canStart ? " Ouvrez la première !" : ""}</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {discussions.map((d) => (
            <Link key={d.id} href={`/formation/cours/${courseSlug}/a/${activity.id}/d/${d.id}`} className="block rounded-xl border border-border bg-card p-3 transition hover:border-advanced-fg/40 hover:bg-secondary/40">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-semibold text-foreground">
                    {d.pinned && <Pin className="size-3.5 shrink-0 text-advanced-fg" />}
                    {d.locked && <Lock className="size-3.5 shrink-0 text-muted-foreground" />}
                    <span className="truncate">{d.title}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Par {names.get(d.userId)?.fullName ?? "—"} · {d._count.posts} réponse(s) · dernière activité {fmtDate(d.lastPostAt)}</p>
                </div>
                <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface WikiActivity { id: string; title: string; intro: string | null; wikiConfig: string | null }

async function WikiSection({ activity, courseSlug, canEdit, role }: { activity: WikiActivity; courseSlug: string; canEdit: boolean; role: "TEACHER" | "STUDENT" | null }) {
  const config = parseWikiConfig(activity.wikiConfig);
  const pages = await prisma.lmsWikiPage.findMany({
    where: { activityId: activity.id },
    orderBy: [{ isHome: "desc" }, { title: "asc" }],
    select: { id: true, slug: true, title: true, isHome: true, updatedAt: true },
  });
  const canEditPages = canEdit || (role !== null && config.allowStudentEdit);

  return (
    <div className="space-y-4">
      {activity.intro && <Card><CardContent className="py-4"><RichContent html={activity.intro} /></CardContent></Card>}
      {canEdit && (
        <Card><CardContent className="py-5">
          <h2 className="mb-3 font-bold text-foreground">Réglages</h2>
          <form action={configureWiki} className="space-y-3">
            <input type="hidden" name="activityId" value={activity.id} />
            <div><Label htmlFor="fw-title" required>Titre</Label><Input id="fw-title" name="title" defaultValue={activity.title} required /></div>
            <div><Label htmlFor="fw-intro">Consigne</Label><Textarea id="fw-intro" name="intro" rows={2} defaultValue={activity.intro ?? ""} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="allowStudentEdit" defaultChecked={config.allowStudentEdit} className="size-4" /> Autoriser les apprenants à créer / modifier des pages</label>
            <div className="flex justify-end"><SubmitButton pendingLabel="Enregistrement…">Enregistrer les réglages</SubmitButton></div>
          </form>
        </CardContent></Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{pages.length} page(s)</p>
        {canEditPages && <WikiNewPage activityId={activity.id} />}
      </div>

      <div className="space-y-2">
        {pages.map((p) => (
          <Link key={p.id} href={`/formation/cours/${courseSlug}/a/${activity.id}/w/${p.slug}`} className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 transition hover:border-advanced-fg/40 hover:bg-secondary/40">
            <span className="flex min-w-0 items-center gap-1.5 font-semibold text-foreground">
              {p.isHome && <Home className="size-3.5 shrink-0 text-advanced-fg" />}
              <span className="truncate">{p.title}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">modifiée {fmtDate(p.updatedAt)}</span>
          </Link>
        ))}
      </div>
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
      {activity.type === "DEVOIR" && <AssignSection activity={{ id: activity.id, title: activity.title, intro: activity.intro, assignConfig: activity.assignConfig }} canEdit={canEdit} userId={access.userId} />}
      {activity.type === "FORUM" && <ForumSection activity={{ id: activity.id, title: activity.title, intro: activity.intro, forumConfig: activity.forumConfig }} courseSlug={course.slug} canEdit={canEdit} role={role} />}
      {activity.type === "WIKI" && <WikiSection activity={{ id: activity.id, title: activity.title, intro: activity.intro, wikiConfig: activity.wikiConfig }} courseSlug={course.slug} canEdit={canEdit} role={role} />}
      {activity.type === "WORKSHOP" && <WorkshopSection activity={{ id: activity.id, title: activity.title, intro: activity.intro, workshopConfig: activity.workshopConfig }} courseSlug={course.slug} canEdit={canEdit} userId={access.userId} role={role} />}
      {activity.type === "GEOGEBRA" && (() => {
        const src = geogebraEmbed(activity.externalUrl ?? "");
        return (
          <Card><CardContent className="py-5">
            {activity.intro && <div className="mb-3"><RichContent html={activity.intro} /></div>}
            {src ? (
              <div className="overflow-hidden rounded-xl border border-border"><iframe src={src} className="h-[600px] w-full" title="GeoGebra" allow="autoplay; fullscreen; clipboard-write" referrerPolicy="no-referrer-when-downgrade" /></div>
            ) : (
              <p className="text-sm text-unavailable-fg">Lien GeoGebra invalide. Indiquez un identifiant de matériel ou une URL <code>geogebra.org</code>.</p>
            )}
          </CardContent></Card>
        );
      })()}
    </div>
  );
}
