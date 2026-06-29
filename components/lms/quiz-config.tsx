"use client";

import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { configureQuiz } from "@/app/actions/lms";
import { CORRIGE_LABEL, GRADE_METHOD_LABEL, type QuizConfig } from "@/lib/lms-quiz";

export function QuizConfigForm({ activityId, title, intro, config }: { activityId: string; title: string; intro: string; config: QuizConfig }) {
  return (
    <form action={configureQuiz} className="space-y-4">
      <input type="hidden" name="activityId" value={activityId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label htmlFor="qc-title" required>Titre</Label><Input id="qc-title" name="title" defaultValue={title} required /></div>
        <div className="sm:col-span-2"><Label htmlFor="qc-intro">Consigne</Label><Textarea id="qc-intro" name="intro" rows={2} defaultValue={intro} /></div>
        <div><Label htmlFor="qc-att">Tentatives autorisées <span className="text-muted-foreground">(0 = illimité)</span></Label><Input id="qc-att" name="attempts" type="number" min={0} defaultValue={config.attempts} /></div>
        <div><Label htmlFor="qc-gm">Note retenue</Label><Select id="qc-gm" name="gradeMethod" defaultValue={config.gradeMethod}>{Object.entries(GRADE_METHOD_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></div>
        <div><Label htmlFor="qc-time">Limite de temps <span className="text-muted-foreground">(min, 0 = aucune)</span></Label><Input id="qc-time" name="timeLimitMin" type="number" min={0} defaultValue={config.timeLimitMin} /></div>
        <div><Label htmlFor="qc-pass">Note de réussite (%)</Label><Input id="qc-pass" name="passing" type="number" min={0} max={100} defaultValue={config.passing} /></div>
        <div className="sm:col-span-2">
          <Label htmlFor="qc-corr">Visibilité du corrigé (bonnes réponses + explications)</Label>
          <Select id="qc-corr" name="corrige" defaultValue={config.corrige}>{(Object.keys(CORRIGE_LABEL) as (keyof typeof CORRIGE_LABEL)[]).map((k) => <option key={k} value={k}>{CORRIGE_LABEL[k]}</option>)}</Select>
        </div>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="shuffle" defaultChecked={config.shuffle} className="size-4" /> Mélanger l'ordre des questions</label>
      </div>
      <div className="flex justify-end"><SubmitButton pendingLabel="Enregistrement…">Enregistrer les réglages</SubmitButton></div>
    </form>
  );
}
