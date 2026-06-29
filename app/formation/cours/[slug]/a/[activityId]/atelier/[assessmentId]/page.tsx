import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { getLmsAccess, getCourseRole } from "@/lib/lms";
import { prisma } from "@/lib/prisma";
import { parseWorkshopConfig } from "@/lib/lms-workshop";
import { Card, CardContent } from "@/components/ui/card";
import { RichContent } from "@/components/lms/rich-content";
import { WorkshopAssessmentForm } from "@/components/lms/workshop-assessment-form";

export const dynamic = "force-dynamic";

export default async function AssessmentPage({ params }: { params: { slug: string; activityId: string; assessmentId: string } }) {
  const access = await getLmsAccess();
  if (!access) redirect("/login?callbackUrl=/formation");
  const assessment = await prisma.lmsWorkshopAssessment.findUnique({
    where: { id: params.assessmentId },
    include: { submission: { select: { title: true, content: true, fileName: true, fileData: true, activityId: true, activity: { select: { title: true, type: true, workshopConfig: true, section: { select: { courseId: true, course: { select: { slug: true } } } } } } } } },
  });
  if (!assessment || assessment.submission.activityId !== params.activityId || assessment.submission.activity.type !== "WORKSHOP" || assessment.submission.activity.section.course.slug !== params.slug) notFound();
  if (assessment.reviewerId !== access.userId) redirect(`/formation/cours/${params.slug}/a/${params.activityId}`); // seul l'évaluateur attribué

  const cfg = parseWorkshopConfig(assessment.submission.activity.workshopConfig);
  const activityHref = `/formation/cours/${params.slug}/a/${params.activityId}`;
  if ((await getCourseRole(access.userId, assessment.submission.activity.section.courseId)) === null) redirect(activityHref); // doit rester inscrit
  if (cfg.phase !== "ASSESSMENT") redirect(activityHref);

  let scores: Record<string, number> = {};
  try { scores = JSON.parse(assessment.scores) as Record<string, number>; } catch { scores = {}; }

  const sub = assessment.submission;
  return (
    <div className="space-y-5">
      <Link href={activityHref} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:underline"><ArrowLeft className="size-3.5" /> {sub.activity.title}</Link>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Évaluation d'un travail</h1>

      {/* Travail à évaluer (anonyme) */}
      <Card><CardContent className="py-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Travail à évaluer (anonyme)</p>
        <p className="font-semibold text-foreground">{sub.title}</p>
        {sub.content && <div className="mt-2"><RichContent html={sub.content} /></div>}
        {sub.fileData && <a href={sub.fileData} download={sub.fileName ?? "fichier"} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><Download className="size-4" /> {sub.fileName ?? "Télécharger le fichier"}</a>}
        {!sub.content && !sub.fileData && <p className="text-sm italic text-muted-foreground">(remise vide)</p>}
      </CardContent></Card>

      {/* Grille d'évaluation */}
      <Card><CardContent className="py-5">
        <h2 className="mb-3 font-bold text-foreground">Votre évaluation</h2>
        <WorkshopAssessmentForm assessmentId={assessment.id} criteria={cfg.criteria} scores={scores} feedback={assessment.feedback ?? ""} />
      </CardContent></Card>
    </div>
  );
}
