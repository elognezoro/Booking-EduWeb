"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Check, X, FileText, Link2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmActionButton } from "@/components/confirm-action";
import { createSection, updateSection, deleteSection } from "@/app/actions/lms";

interface ActivityLite { id: string; type: string; title: string }
interface SectionLite { id: string; title: string; summary: string | null; activities: ActivityLite[] }

const ACT_ICON: Record<string, React.ReactNode> = {
  PAGE: <FileText className="size-3.5" />,
  URL: <Link2 className="size-3.5" />,
  QUIZ: <ListChecks className="size-3.5" />,
};

/** Gestion des sections d'un cours (réservé aux enseignants/gestionnaires). */
export function SectionManager({ courseId, sections }: { courseId: string; sections: SectionLite[] }) {
  return (
    <div className="space-y-3">
      {sections.map((s, i) => <SectionRow key={s.id} index={i} section={s} />)}
      <form action={createSection} className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 p-3">
        <input type="hidden" name="courseId" value={courseId} />
        <Input name="title" placeholder="Titre de la nouvelle section" className="w-full max-w-xs" />
        <Button type="submit" variant="outline"><Plus className="size-4" /> Ajouter une section</Button>
      </form>
    </div>
  );
}

function SectionRow({ index, section }: { index: number; section: SectionLite }) {
  const [editing, setEditing] = React.useState(false);
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        {editing ? (
          <form action={updateSection} onSubmit={() => setEditing(false)} className="flex flex-1 items-center gap-2">
            <input type="hidden" name="id" value={section.id} />
            <Input name="title" defaultValue={section.title} className="flex-1" autoFocus />
            <Button type="submit" size="icon-sm" aria-label="Enregistrer"><Check className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setEditing(false)} aria-label="Annuler"><X className="size-4" /></Button>
          </form>
        ) : (
          <>
            <h3 className="font-bold text-foreground">{index + 1}. {section.title}</h3>
            <div className="flex shrink-0 gap-1">
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setEditing(true)} aria-label="Renommer la section"><Pencil className="size-4" /></Button>
              <ConfirmActionButton
                action={deleteSection}
                hidden={{ id: section.id }}
                triggerLabel=""
                triggerIcon={<Trash2 className="size-4" />}
                triggerVariant="ghost"
                triggerSize="icon-sm"
                title={`Supprimer « ${section.title} » ?`}
                description="La section et tous ses contenus seront supprimés définitivement."
                confirmLabel="Supprimer"
                confirmVariant="destructive"
              />
            </div>
          </>
        )}
      </div>
      <div className="mt-2">
        {section.activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun contenu pour le moment.</p>
        ) : (
          <ul className="space-y-1">
            {section.activities.map((a) => (
              <li key={a.id} className="flex items-center gap-2 text-sm text-foreground">
                <span className="text-advanced-fg">{ACT_ICON[a.type] ?? <FileText className="size-3.5" />}</span> {a.title}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs italic text-muted-foreground">Ajout de contenus (page, média, quiz) — disponible à la prochaine étape.</p>
      </div>
    </div>
  );
}
