"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { saveQuestion } from "@/app/actions/lms";
import type { LmsQuestionType, McqData, TrueFalseData, ShortAnswerData, NumericalData, ClozeData } from "@/lib/lms-questions";

type AnyData = McqData | TrueFalseData | ShortAnswerData | NumericalData | ClozeData;
interface Initial { id?: string; name: string; questionText: string; generalFeedback: string; defaultMark: number; data: unknown }

export function QuestionEditor({ courseId, courseSlug, type, initial }: { courseId: string; courseSlug: string; type: LmsQuestionType; initial: Initial }) {
  const [data, setData] = React.useState<AnyData>(initial.data as AnyData);

  return (
    <form action={saveQuestion} className="space-y-5">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="type" value={type} />
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="data" value={JSON.stringify(data)} />

      <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
        <div><Label htmlFor="q-name" required>Nom de la question</Label><Input id="q-name" name="name" defaultValue={initial.name} required placeholder="Ex. Capitale de la Côte d'Ivoire" /></div>
        <div><Label htmlFor="q-mark">Note par défaut</Label><Input id="q-mark" name="defaultMark" type="number" min={0} step="0.5" defaultValue={initial.defaultMark} /></div>
      </div>

      <div><Label>Énoncé</Label><RichTextEditor name="questionText" initialHtml={initial.questionText} /></div>

      <div>
        <Label>Réponses & barème</Label>
        {type === "MCQ" && <McqFields data={data as McqData} setData={setData} />}
        {type === "TRUEFALSE" && <TrueFalseFields data={data as TrueFalseData} setData={setData} />}
        {type === "SHORTANSWER" && <ShortAnswerFields data={data as ShortAnswerData} setData={setData} />}
        {type === "NUMERICAL" && <NumericalFields data={data as NumericalData} setData={setData} />}
        {type === "CLOZE" && <ClozeFields data={data as ClozeData} setData={setData} />}
      </div>

      <div><Label>Feedback général (corrigé / explication)</Label><RichTextEditor name="generalFeedback" initialHtml={initial.generalFeedback} /></div>

      <div className="flex justify-end gap-2">
        <Button asChild type="button" variant="ghost"><a href={`/formation/cours/${courseSlug}/banque`}>Annuler</a></Button>
        <SubmitButton pendingLabel="Enregistrement…">Enregistrer la question</SubmitButton>
      </div>
    </form>
  );
}

const box = "space-y-2 rounded-xl border border-border p-3";
const gradeCol = "w-24";

function McqFields({ data, setData }: { data: McqData; setData: (d: McqData) => void }) {
  const setOpt = (i: number, patch: Partial<McqData["options"][number]>) => setData({ ...data, options: data.options.map((o, j) => (j === i ? { ...o, ...patch } : o)) });
  const setCorrect = (i: number, val: boolean) => {
    if (data.multiple) setOpt(i, { correct: val });
    else setData({ ...data, options: data.options.map((o, j) => ({ ...o, correct: j === i })) });
  };
  return (
    <div className={box}>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={data.multiple} onChange={(e) => setData({ ...data, multiple: e.target.checked })} className="size-4" /> Plusieurs bonnes réponses</label>
      {data.options.map((o, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type={data.multiple ? "checkbox" : "radio"} checked={o.correct} onChange={(e) => setCorrect(i, e.target.checked)} title="Bonne réponse" className="size-4 shrink-0" />
          <Input value={o.text} onChange={(e) => setOpt(i, { text: e.target.value })} placeholder={`Proposition ${i + 1}`} className="flex-1" />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setData({ ...data, options: data.options.filter((_, j) => j !== i) })} disabled={data.options.length <= 2} aria-label="Retirer"><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, options: [...data.options, { text: "", correct: false }] })}><Plus className="size-4" /> Ajouter une proposition</Button>
      <p className="text-xs text-muted-foreground">Cochez la (ou les) bonne(s) réponse(s).</p>
    </div>
  );
}

function TrueFalseFields({ data, setData }: { data: TrueFalseData; setData: (d: TrueFalseData) => void }) {
  return (
    <div className={`${box} flex gap-6`}>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="radio" checked={data.correct === true} onChange={() => setData({ correct: true })} className="size-4" /> Vrai</label>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="radio" checked={data.correct === false} onChange={() => setData({ correct: false })} className="size-4" /> Faux</label>
    </div>
  );
}

function ShortAnswerFields({ data, setData }: { data: ShortAnswerData; setData: (d: ShortAnswerData) => void }) {
  const setA = (i: number, patch: Partial<ShortAnswerData["answers"][number]>) => setData({ ...data, answers: data.answers.map((a, j) => (j === i ? { ...a, ...patch } : a)) });
  return (
    <div className={box}>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={data.caseSensitive} onChange={(e) => setData({ ...data, caseSensitive: e.target.checked })} className="size-4" /> Sensible à la casse</label>
      {data.answers.map((a, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={a.text} onChange={(e) => setA(i, { text: e.target.value })} placeholder={`Réponse acceptée ${i + 1}`} className="flex-1" />
          <Input type="number" min={0} max={100} value={a.grade} onChange={(e) => setA(i, { grade: Number(e.target.value) })} className={gradeCol} title="Note (%)" />
          <span className="text-xs text-muted-foreground">%</span>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setData({ ...data, answers: data.answers.filter((_, j) => j !== i) })} disabled={data.answers.length <= 1} aria-label="Retirer"><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, answers: [...data.answers, { text: "", grade: 100 }] })}><Plus className="size-4" /> Ajouter une réponse acceptée</Button>
      <p className="text-xs text-muted-foreground">Indiquez chaque formulation acceptée et le pourcentage de points attribué.</p>
    </div>
  );
}

function NumericalFields({ data, setData }: { data: NumericalData; setData: (d: NumericalData) => void }) {
  const setA = (i: number, patch: Partial<NumericalData["answers"][number]>) => setData({ ...data, answers: data.answers.map((a, j) => (j === i ? { ...a, ...patch } : a)) });
  return (
    <div className={box}>
      <div className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-2 text-xs font-semibold text-muted-foreground"><span>Valeur</span><span>Tolérance ±</span><span>Note %</span><span /></div>
      {data.answers.map((a, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-2">
          <Input type="number" step="any" value={a.value} onChange={(e) => setA(i, { value: Number(e.target.value) })} />
          <Input type="number" step="any" min={0} value={a.tolerance} onChange={(e) => setA(i, { tolerance: Number(e.target.value) })} />
          <Input type="number" min={0} max={100} value={a.grade} onChange={(e) => setA(i, { grade: Number(e.target.value) })} className={gradeCol} />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setData({ ...data, answers: data.answers.filter((_, j) => j !== i) })} disabled={data.answers.length <= 1} aria-label="Retirer"><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, answers: [...data.answers, { value: 0, tolerance: 0, grade: 100 }] })}><Plus className="size-4" /> Ajouter une valeur acceptée</Button>
      <p className="text-xs text-muted-foreground">Ex. valeur 3,14 avec tolérance 0,01 accepte de 3,13 à 3,15.</p>
    </div>
  );
}

function ClozeFields({ data, setData }: { data: ClozeData; setData: (d: ClozeData) => void }) {
  return (
    <div className={box}>
      <Textarea value={data.clozeText} onChange={(e) => setData({ clozeText: e.target.value })} rows={6} className="font-mono text-xs" placeholder={"La capitale de la Côte d'Ivoire est {1:SHORTANSWER:=Yamoussoukro}. 2 + 2 = {1:NUMERICAL:=4}."} />
      <p className="text-xs text-muted-foreground">Format Moodle « Cloze » : champs intégrés <code>{"{note:TYPE:=bonne réponse~mauvaise}"}</code> — types <code>SHORTANSWER</code>/<code>SHORTANSWER_C</code> (sensible à la casse), <code>NUMERICAL</code> (<code>{"=4:0.5"}</code> pour la tolérance), <code>MULTICHOICE</code> (liste déroulante). Crédit partiel avec <code>%50%</code>, retour avec <code>#…</code>. Auto‑corrigé dans le Quiz.</p>
    </div>
  );
}
