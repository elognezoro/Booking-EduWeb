import Link from "next/link";
import { ArrowLeft, Plus, Power, Trash2, CheckCircle2, GraduationCap, Gamepad2, Upload, AlertTriangle } from "lucide-react";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/json";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { createBrainQuestion, toggleBrainQuestion, deleteBrainQuestion, importBrainQuestionsCsv } from "@/app/actions/brain-sport";

export const dynamic = "force-dynamic";

const LEVELS = [
  { key: "facile", label: "Débutant" },
  { key: "moyen", label: "Intermédiaire" },
  { key: "difficile", label: "Avancé" },
];
const levelLabel = (k: string) => LEVELS.find((l) => l.key === k)?.label ?? k;

export default async function BrainAdminPage({ searchParams }: { searchParams: { imported?: string; error?: string } }) {
  await requirePermission("platform.manage");
  const questions = await prisma.brainSportQuestion.findMany({
    where: { gameSlug: "culture-generale" },
    orderBy: [{ level: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <Link href="/dashboard/sport-cerebral" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Sport cérébral
      </Link>
      <PageHeader
        title="Banque de questions — Culture générale"
        description="Gérez les questions du quiz (réservé au super administrateur)."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><GraduationCap className="size-6" /></span>}
        actions={<Button asChild variant="outline"><Link href="/dashboard/sport-cerebral/admin/jeux"><Gamepad2 className="size-4" /> Gestion des jeux</Link></Button>}
      />

      {searchParams.imported && (
        <div className="flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft px-4 py-3 text-sm font-semibold text-available-fg">
          <CheckCircle2 className="size-5" /> {searchParams.imported} question(s) importée(s) depuis le fichier CSV.
        </div>
      )}
      {searchParams.error === "csv" && (
        <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-4 py-3 text-sm font-semibold text-unavailable-fg">
          <AlertTriangle className="size-5" /> Fichier CSV illisible ou vide.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Liste */}
        <Card className="overflow-hidden">
          <CardHeader><CardTitle>{questions.length} question(s)</CardTitle></CardHeader>
          <div className="divide-y divide-border">
            {questions.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">Aucune question. Ajoutez-en une avec le formulaire.</p>
            ) : (
              questions.map((q) => {
                const choices = parseJson<string[]>(q.choices, []);
                return (
                  <div key={q.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge tone="advanced">{levelLabel(q.level)}</Badge>
                        <Badge tone={q.active ? "available" : "neutral"}>{q.active ? "Active" : "Inactive"}</Badge>
                      </div>
                      <p className="font-semibold text-foreground">{q.prompt}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {choices.map((c, i) => (
                          <span key={i} className={i === q.answerIndex ? "font-semibold text-available-fg" : ""}>
                            {i === q.answerIndex ? "✓ " : ""}{c}{i < choices.length - 1 ? " · " : ""}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <form action={toggleBrainQuestion}>
                        <input type="hidden" name="id" value={q.id} />
                        <Button type="submit" variant="ghost" size="icon-sm" title={q.active ? "Désactiver" : "Activer"}><Power className={q.active ? "size-4 text-available" : "size-4 text-muted-foreground"} /></Button>
                      </form>
                      <form action={deleteBrainQuestion}>
                        <input type="hidden" name="id" value={q.id} />
                        <Button type="submit" variant="ghost" size="icon-sm" title="Supprimer"><Trash2 className="size-4 text-unavailable" /></Button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Ajout + import */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" /> Nouvelle question</CardTitle></CardHeader>
          <CardContent>
            <form action={createBrainQuestion} className="space-y-3">
              <div>
                <Label htmlFor="level" required>Niveau</Label>
                <Select id="level" name="level" defaultValue="facile">
                  {LEVELS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
                </Select>
              </div>
              <div><Label htmlFor="prompt" required>Question</Label><Input id="prompt" name="prompt" required placeholder="Énoncé de la question" /></div>
              {[0, 1, 2, 3].map((i) => (
                <div key={i}><Label htmlFor={`choice${i}`} required>Choix {i + 1}</Label><Input id={`choice${i}`} name={`choice${i}`} required /></div>
              ))}
              <div>
                <Label htmlFor="answerIndex" required>Bonne réponse</Label>
                <Select id="answerIndex" name="answerIndex" defaultValue="0">
                  {[0, 1, 2, 3].map((i) => <option key={i} value={i}>Choix {i + 1}</option>)}
                </Select>
              </div>
              <div><Label htmlFor="explanation">Explication (facultatif)</Label><Input id="explanation" name="explanation" placeholder="Pourquoi cette réponse…" /></div>
              <Button type="submit" className="w-full"><CheckCircle2 className="size-4" /> Ajouter la question</Button>
            </form>
          </CardContent>
        </Card>

        {/* Import CSV */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Upload className="size-4" /> Import CSV</CardTitle></CardHeader>
          <CardContent>
            <form action={importBrainQuestionsCsv} className="space-y-2.5">
              <FileDropzone
                name="file"
                accept=".csv,text/csv"
                required
                className="gap-1 rounded-xl px-3 py-5"
                title="Glissez-déposez ou choisissez un CSV"
                hint="niveau, question, choix1-4, bonne (1-4), explication"
              />
              <Button type="submit" size="sm" className="w-full"><Upload className="size-4" /> Importer les questions</Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
