"use client";

import * as React from "react";
import { Plus, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { RichTextEditor } from "@/components/lms/rich-text-editor";
import { saveQuestion } from "@/app/actions/lms";
import { QUESTION_TYPE_LABEL, type LmsQuestionType, type McqData, type TrueFalseData, type ShortAnswerData, type NumericalData, type ClozeData, type DragTextData, type MatchingData, type OrderingData, type GapfillData } from "@/lib/lms-questions";

type AnyData = McqData | TrueFalseData | ShortAnswerData | NumericalData | ClozeData | DragTextData | MatchingData | OrderingData | GapfillData;
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
        <div className="mb-3 mt-1"><SyntaxHint type={type} /></div>
        {type === "MCQ" && <McqFields data={data as McqData} setData={setData} />}
        {type === "TRUEFALSE" && <TrueFalseFields data={data as TrueFalseData} setData={setData} />}
        {type === "SHORTANSWER" && <ShortAnswerFields data={data as ShortAnswerData} setData={setData} />}
        {type === "NUMERICAL" && <NumericalFields data={data as NumericalData} setData={setData} />}
        {type === "CLOZE" && <ClozeFields data={data as ClozeData} setData={setData} />}
        {type === "DRAGTEXT" && <DragTextFields data={data as DragTextData} setData={setData} />}
        {type === "MATCHING" && <MatchingFields data={data as MatchingData} setData={setData} />}
        {type === "ORDERING" && <OrderingFields data={data as OrderingData} setData={setData} />}
        {type === "GAPFILL" && <GapfillFields data={data as GapfillData} setData={setData} />}
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

/** Aide-mémoire de syntaxe/usage affiché dans la zone d'édition de chaque exerciseur. */
function SyntaxHint({ type }: { type: LmsQuestionType }) {
  const c = "rounded bg-secondary px-1 py-0.5 font-mono text-[0.8em]";
  const body: Record<LmsQuestionType, React.ReactNode> = {
    MCQ: <>Cochez la (ou les) bonne(s) réponse(s). Activez « Plusieurs bonnes réponses » pour en autoriser plusieurs.</>,
    TRUEFALSE: <>Indiquez si l'affirmation de l'énoncé est <strong>vraie</strong> ou <strong>fausse</strong>.</>,
    SHORTANSWER: <>Listez chaque formulation acceptée et son <strong>% de points</strong>. « Sensible à la casse » exige les majuscules exactes.</>,
    NUMERICAL: <>Valeur attendue + <strong>tolérance ±</strong>. Ex. <span className={c}>3,14</span> avec tolérance <span className={c}>0,01</span> accepte de 3,13 à 3,15.</>,
    CLOZE: <>Champs intégrés au texte : <span className={c}>{"{1:TYPE:=bonne~mauvaise}"}</span>. Types : <span className={c}>SHORTANSWER</span>, <span className={c}>SHORTANSWER_C</span> (casse), <span className={c}>NUMERICAL</span> (<span className={c}>{"=4:0.5"}</span> = valeur:tolérance), <span className={c}>MULTICHOICE</span>. Crédit partiel <span className={c}>%50%</span>, retour <span className={c}>#texte</span>.</>,
    DRAGTEXT: <>Placez les trous dans le texte avec <span className={c}>[[1]]</span>, <span className={c}>[[2]]</span>… La <strong>réponse n°k</strong> ci-dessous correspond au trou <span className={c}>[[k]]</span>. Les « intrus » sont des étiquettes en trop.</>,
    MATCHING: <>Une ligne = un <strong>élément</strong> + sa <strong>correspondance</strong>. Les correspondances (et les intrus) sont proposées mélangées dans une liste déroulante.</>,
    ORDERING: <>Saisissez les éléments dans le <strong>bon ordre</strong> ; ils seront <strong>mélangés</strong> pour l'apprenant, qui devra les réordonner (glisser ou flèches).</>,
    GAPFILL: <>Écrivez le texte et mettez les mots à cacher <strong>entre crochets</strong> : <span className={c}>[Paris]</span>. Réponses alternatives : <span className={c}>[Paris|Lutèce]</span>. Casse et accents tolérés sauf « réponse stricte ».</>,
  };
  return (
    <div className="flex gap-2 rounded-xl border border-advanced-fg/30 bg-advanced/5 p-3 text-sm text-foreground">
      <Info className="mt-0.5 size-4 shrink-0 text-advanced-fg" />
      <p><span className="font-semibold">Aide-mémoire — {QUESTION_TYPE_LABEL[type] ?? type}.</span> {body[type]}</p>
    </div>
  );
}

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
    </div>
  );
}

function ClozeFields({ data, setData }: { data: ClozeData; setData: (d: ClozeData) => void }) {
  return (
    <div className={box}>
      <Textarea value={data.clozeText} onChange={(e) => setData({ clozeText: e.target.value })} rows={6} className="font-mono text-xs" placeholder={"La capitale de la Côte d'Ivoire est {1:SHORTANSWER:=Yamoussoukro}. 2 + 2 = {1:NUMERICAL:=4}."} />
    </div>
  );
}

function DragTextFields({ data, setData }: { data: DragTextData; setData: (d: DragTextData) => void }) {
  const setAns = (i: number, v: string) => setData({ ...data, answers: data.answers.map((a, j) => (j === i ? v : a)) });
  const setDis = (i: number, v: string) => setData({ ...data, distractors: data.distractors.map((a, j) => (j === i ? v : a)) });
  return (
    <div className={box}>
      <Textarea value={data.text} onChange={(e) => setData({ ...data, text: e.target.value })} rows={4} className="font-mono text-xs" placeholder={"Le soleil est une [[1]] et la Terre une [[2]]."} />
      <p className="text-sm font-medium">Réponses (ordre des trous)</p>
      {data.answers.map((a, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-center text-xs font-bold text-muted-foreground">[{i + 1}]</span>
          <Input value={a} onChange={(e) => setAns(i, e.target.value)} placeholder={`Mot du trou ${i + 1}`} className="flex-1" />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setData({ ...data, answers: data.answers.filter((_, j) => j !== i) })} disabled={data.answers.length <= 1} aria-label="Retirer"><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, answers: [...data.answers, ""] })}><Plus className="size-4" /> Ajouter un trou</Button>
      <p className="mt-2 text-sm font-medium">Intrus (étiquettes en trop, facultatif)</p>
      {data.distractors.map((a, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={a} onChange={(e) => setDis(i, e.target.value)} placeholder={`Intrus ${i + 1}`} className="flex-1" />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setData({ ...data, distractors: data.distractors.filter((_, j) => j !== i) })} aria-label="Retirer"><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, distractors: [...data.distractors, ""] })}><Plus className="size-4" /> Ajouter un intrus</Button>
    </div>
  );
}

function MatchingFields({ data, setData }: { data: MatchingData; setData: (d: MatchingData) => void }) {
  const setPair = (i: number, patch: Partial<MatchingData["pairs"][number]>) => setData({ ...data, pairs: data.pairs.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  const setExtra = (i: number, v: string) => setData({ ...data, extraRights: data.extraRights.map((a, j) => (j === i ? v : a)) });
  return (
    <div className={box}>
      <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 text-xs font-semibold text-muted-foreground"><span>Élément</span><span>Correspondance</span><span /></div>
      {data.pairs.map((p, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
          <Input value={p.left} onChange={(e) => setPair(i, { left: e.target.value })} placeholder={`Élément ${i + 1}`} />
          <Input value={p.right} onChange={(e) => setPair(i, { right: e.target.value })} placeholder={`Réponse ${i + 1}`} />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setData({ ...data, pairs: data.pairs.filter((_, j) => j !== i) })} disabled={data.pairs.length <= 2} aria-label="Retirer"><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, pairs: [...data.pairs, { left: "", right: "" }] })}><Plus className="size-4" /> Ajouter une paire</Button>
      <p className="mt-2 text-sm font-medium">Correspondances intruses (facultatif)</p>
      {data.extraRights.map((a, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={a} onChange={(e) => setExtra(i, e.target.value)} placeholder={`Intrus ${i + 1}`} className="flex-1" />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setData({ ...data, extraRights: data.extraRights.filter((_, j) => j !== i) })} aria-label="Retirer"><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ ...data, extraRights: [...data.extraRights, ""] })}><Plus className="size-4" /> Ajouter un intrus</Button>
    </div>
  );
}

function GapfillFields({ data, setData }: { data: GapfillData; setData: (d: GapfillData) => void }) {
  return (
    <div className={box}>
      <Textarea value={data.text} onChange={(e) => setData({ ...data, text: e.target.value })} rows={4} placeholder={"La capitale de la Côte d'Ivoire est [Yamoussoukro]. Le fleuve est le [Bandama|fleuve Bandama]."} />
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={data.caseSensitive} onChange={(e) => setData({ ...data, caseSensitive: e.target.checked })} className="size-4" /> Réponse stricte (respecter la casse et les accents)</label>
    </div>
  );
}

function OrderingFields({ data, setData }: { data: OrderingData; setData: (d: OrderingData) => void }) {
  const setItem = (i: number, v: string) => setData({ items: data.items.map((a, j) => (j === i ? v : a)) });
  return (
    <div className={box}>
      {data.items.map((a, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-8 shrink-0 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
          <Input value={a} onChange={(e) => setItem(i, e.target.value)} placeholder={`Élément ${i + 1}`} className="flex-1" />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => setData({ items: data.items.filter((_, j) => j !== i) })} disabled={data.items.length <= 2} aria-label="Retirer"><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setData({ items: [...data.items, ""] })}><Plus className="size-4" /> Ajouter un élément</Button>
    </div>
  );
}
