import Link from "next/link";
import { ClipboardCheck, CheckCircle2, Clock, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { lmsDisplayNames } from "@/lib/lms";
import { parseWorkshopConfig, submissionGradePct, assessmentTotal, maxTotal, PHASE_ORDER, PHASE_LABEL, type WorkshopPhase } from "@/lib/lms-workshop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichContent } from "@/components/lms/rich-content";
import { WorkshopConfigForm } from "@/components/lms/workshop-config";
import { WorkshopSubmissionForm } from "@/components/lms/workshop-submission-form";
import { setWorkshopPhase } from "@/app/actions/lms";

interface WorkshopActivity { id: string; title: string; intro: string | null; workshopConfig: string | null }

export async function WorkshopSection({ activity, courseSlug, canEdit, userId, role }: { activity: WorkshopActivity; courseSlug: string; canEdit: boolean; userId: string; role: "TEACHER" | "STUDENT" | null }) {
  const cfg = parseWorkshopConfig(activity.workshopConfig);

  const phaseBadge = (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-advanced/10 px-3 py-1 text-sm font-semibold text-advanced-fg">
      <ClipboardCheck className="size-4" /> Phase : {PHASE_LABEL[cfg.phase]}
    </span>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">{phaseBadge}</div>
      {cfg.instructions && <Card><CardContent className="py-4"><RichContent html={cfg.instructions} /></CardContent></Card>}

      {canEdit && (
        <Card><CardContent className="py-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Pilotage des phases (enseignant)</p>
          <div className="flex flex-wrap gap-2">
            {PHASE_ORDER.map((ph) => (
              <form key={ph} action={setWorkshopPhase}>
                <input type="hidden" name="activityId" value={activity.id} />
                <input type="hidden" name="phase" value={ph} />
                <Button type="submit" variant={cfg.phase === ph ? "default" : "outline"} size="sm" disabled={cfg.phase === ph}>{PHASE_LABEL[ph]}</Button>
              </form>
            ))}
          </div>
          {cfg.phase === "SETUP" && <p className="mt-2 text-xs text-muted-foreground">Passer en « Remise » ouvre le dépôt aux apprenants. Passer en « Évaluation » attribue automatiquement les travaux à évaluer.</p>}
        </CardContent></Card>
      )}

      {canEdit ? await TeacherView({ activity, cfg }) : await StudentView({ activity, cfg, courseSlug, userId, role })}
    </div>
  );
}

async function TeacherView({ activity, cfg }: { activity: WorkshopActivity; cfg: ReturnType<typeof parseWorkshopConfig> }) {
  if (cfg.phase === "SETUP") {
    return (
      <Card><CardContent className="py-5">
        <h2 className="mb-3 font-bold text-foreground">Configuration</h2>
        <WorkshopConfigForm activityId={activity.id} title={activity.title} intro={activity.intro ?? ""} instructions={cfg.instructions} criteria={cfg.criteria} reviewsPerStudent={cfg.reviewsPerStudent} />
      </CardContent></Card>
    );
  }
  const subs = await prisma.lmsWorkshopSubmission.findMany({ where: { activityId: activity.id }, include: { assessments: { select: { scores: true, submitted: true } } }, orderBy: { createdAt: "asc" } });
  const names = await lmsDisplayNames(subs.map((s) => s.userId));
  return (
    <Card><CardContent className="py-5">
      <h2 className="mb-1 font-bold text-foreground">Remises ({subs.length})</h2>
      <p className="mb-3 text-sm text-muted-foreground">{cfg.reviewsPerStudent} évaluation(s) par apprenant · barème total {maxTotal(cfg.criteria)} pts.</p>
      {subs.length === 0 ? <p className="text-sm text-muted-foreground">Aucune remise.</p> : (
        <div className="space-y-2">
          {subs.map((s) => {
            const done = s.assessments.filter((a) => a.submitted).length;
            const grade = submissionGradePct(s.assessments, cfg.criteria);
            return (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                <span className="font-semibold text-foreground">{names.get(s.userId)?.fullName ?? "—"} <span className="font-normal text-muted-foreground">· « {s.title} »</span></span>
                <span className="text-muted-foreground">{done}/{s.assessments.length} évaluation(s){grade !== null ? ` · note ${grade}%` : ""}</span>
              </div>
            );
          })}
        </div>
      )}
    </CardContent></Card>
  );
}

async function StudentView({ activity, cfg, courseSlug, userId, role }: { activity: WorkshopActivity; cfg: ReturnType<typeof parseWorkshopConfig>; courseSlug: string; userId: string; role: "TEACHER" | "STUDENT" | null }) {
  const base = `/formation/cours/${courseSlug}/a/${activity.id}`;
  const mySub = await prisma.lmsWorkshopSubmission.findUnique({ where: { activityId_userId: { activityId: activity.id, userId } } });

  if (cfg.phase === "SETUP") {
    return <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">L'atelier est en cours de préparation par l'enseignant.</CardContent></Card>;
  }

  if (cfg.phase === "SUBMISSION") {
    if (role !== "STUDENT") return <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">Phase de remise en cours.</CardContent></Card>;
    return (
      <Card><CardContent className="py-5">
        <h2 className="mb-3 font-bold text-foreground">{mySub ? "Modifier ma remise" : "Remettre mon travail"}</h2>
        <WorkshopSubmissionForm activityId={activity.id} current={mySub ? { title: mySub.title, content: mySub.content, fileName: mySub.fileName } : null} />
      </CardContent></Card>
    );
  }

  if (cfg.phase === "ASSESSMENT") {
    const allocations = await prisma.lmsWorkshopAssessment.findMany({
      where: { reviewerId: userId, submission: { activityId: activity.id } },
      select: { id: true, submitted: true },
      orderBy: { createdAt: "asc" },
    });
    return (
      <div className="space-y-4">
        <Card><CardContent className="py-5">
          <h2 className="mb-1 font-bold text-foreground">Travaux à évaluer ({allocations.length})</h2>
          <p className="mb-3 text-sm text-muted-foreground">Évaluez chaque travail attribué selon les critères. Les évaluations sont anonymes.</p>
          {allocations.length === 0 ? <p className="text-sm text-muted-foreground">Aucun travail ne vous a été attribué.</p> : (
            <ul className="space-y-2">
              {allocations.map((a, i) => (
                <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {a.submitted ? <CheckCircle2 className="size-4 text-available-fg" /> : <Clock className="size-4 text-muted-foreground" />}
                    Travail à évaluer N° {i + 1}
                  </span>
                  <Link href={`${base}/atelier/${a.id}`} className="text-sm font-semibold text-primary hover:underline">{a.submitted ? "Modifier" : "Évaluer"}</Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent></Card>
        {mySub && <Card><CardContent className="py-4"><p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Ma remise</p><p className="font-semibold text-foreground">{mySub.title}</p>{mySub.content && <div className="mt-2"><RichContent html={mySub.content} /></div>}</CardContent></Card>}
      </div>
    );
  }

  // CLOSED
  if (!mySub) return <Card><CardContent className="py-6 text-center text-sm text-muted-foreground">Vous n'avez pas remis de travail pour cet atelier.</CardContent></Card>;
  // Sélection explicite : on n'expose PAS reviewerId à l'auteur (anonymat des évaluateurs).
  const received = await prisma.lmsWorkshopAssessment.findMany({ where: { submissionId: mySub.id, submitted: true }, select: { id: true, scores: true, feedback: true, submitted: true }, orderBy: { createdAt: "asc" } });
  const grade = submissionGradePct(received, cfg.criteria);
  return (
    <div className="space-y-4">
      <Card><CardContent className="py-5">
        <h2 className="mb-2 font-bold text-foreground">Ma remise — « {mySub.title} »</h2>
        {grade !== null ? <p className="text-sm font-semibold text-foreground">Note finale : {grade}% <span className="font-normal text-muted-foreground">(moyenne de {received.length} évaluation(s))</span></p> : <p className="text-sm text-muted-foreground">Aucune évaluation reçue.</p>}
        {mySub.content && <div className="mt-3"><RichContent html={mySub.content} /></div>}
        {mySub.fileData && <a href={mySub.fileData} download={mySub.fileName ?? "fichier"} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> {mySub.fileName ?? "Mon fichier"}</a>}
      </CardContent></Card>
      {received.length > 0 && (
        <Card><CardContent className="py-5">
          <h2 className="mb-3 font-bold text-foreground">Évaluations reçues (anonymes)</h2>
          <div className="space-y-3">
            {received.map((a, i) => {
              let sc: Record<string, unknown> = {};
              try { sc = JSON.parse(a.scores) as Record<string, unknown>; } catch { sc = {}; }
              return (
                <div key={a.id} className="rounded-xl border border-border p-3">
                  <p className="mb-1 text-sm font-semibold text-foreground">Évaluation {i + 1} — {assessmentTotal(sc, cfg.criteria)}/{maxTotal(cfg.criteria)} pts</p>
                  <ul className="mb-1 text-xs text-muted-foreground">
                    {cfg.criteria.map((c) => <li key={c.id}>{c.description} : {Number(sc[c.id]) || 0}/{c.maxScore}</li>)}
                  </ul>
                  {a.feedback && <div className="mt-1 rounded-lg bg-secondary/40 p-2"><RichContent html={a.feedback} /></div>}
                </div>
              );
            })}
          </div>
        </CardContent></Card>
      )}
    </div>
  );
}
