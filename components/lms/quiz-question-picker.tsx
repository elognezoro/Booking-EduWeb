"use client";

import * as React from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmActionButton } from "@/components/confirm-action";
import { addQuizQuestions, removeQuizQuestion } from "@/app/actions/lms";
import { QUESTION_TYPE_LABEL } from "@/lib/lms-questions";

interface AvailableQ { id: string; name: string; type: string }
interface CurrentQ { linkId: string; name: string; type: string; mark: number }

export function QuizQuestionPicker({ activityId, available, current }: { activityId: string; available: AvailableQ[]; current: CurrentQ[] }) {
  const [sel, setSel] = React.useState<Set<string>>(new Set());
  const [pending, setPending] = React.useState(false);
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const add = async () => {
    if (!sel.size || pending) return;
    setPending(true);
    try { await addQuizQuestions({ activityId, questionIds: [...sel] }); setSel(new Set()); } finally { setPending(false); }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Questions du quiz ({current.length})</p>
        {current.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune question. Ajoutez-en depuis la banque ci-dessous.</p>
        ) : (
          <ul className="space-y-1">
            {current.map((q, i) => (
              <li key={q.linkId} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-1.5 text-sm">
                <span className="text-foreground">{i + 1}. {q.name} <span className="text-xs text-muted-foreground">· {QUESTION_TYPE_LABEL[q.type] ?? q.type} · {q.mark} pt</span></span>
                <ConfirmActionButton action={removeQuizQuestion} hidden={{ id: q.linkId }} triggerLabel="" triggerIcon={<Trash2 className="size-4" />} triggerVariant="ghost" triggerSize="icon-sm" title={`Retirer « ${q.name} » du quiz ?`} description="La question reste dans la banque." confirmLabel="Retirer" confirmVariant="destructive" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">Ajouter depuis la banque</p>
        {available.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune question auto-corrigeable disponible. Créez-en dans la banque (QCM, Vrai/Faux, Réponse courte, Numérique).</p>
        ) : (
          <>
            <div className="max-h-56 space-y-0.5 overflow-y-auto rounded-lg border border-border p-1">
              {available.map((q) => (
                <label key={q.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary/60">
                  <input type="checkbox" checked={sel.has(q.id)} onChange={() => toggle(q.id)} className="size-4 shrink-0" />
                  <span className="text-foreground">{q.name} <span className="text-xs text-muted-foreground">· {QUESTION_TYPE_LABEL[q.type] ?? q.type}</span></span>
                </label>
              ))}
            </div>
            <Button type="button" className="mt-2" size="sm" disabled={!sel.size || pending} onClick={add}>
              {pending ? <><Loader2 className="size-4 animate-spin" /> Ajout…</> : <><Plus className="size-4" /> Ajouter{sel.size ? ` (${sel.size})` : ""}</>}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
