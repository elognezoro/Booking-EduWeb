"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Check, X, FileText, Link2, ListChecks, ClipboardList, MessageSquare, NotebookText, ClipboardCheck, Shapes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmActionButton } from "@/components/confirm-action";
import { createSection, updateSection, deleteSection, deleteActivity } from "@/app/actions/lms";
import { ActivityAddButtons } from "@/components/lms/activity-add-buttons";

interface ActivityLite { id: string; type: string; title: string }
interface SectionLite { id: string; title: string; summary: string | null; activities: ActivityLite[] }

const ACT_ICON: Record<string, React.ReactNode> = {
  PAGE: <FileText className="size-3.5" />,
  URL: <Link2 className="size-3.5" />,
  QUIZ: <ListChecks className="size-3.5" />,
  DEVOIR: <ClipboardList className="size-3.5" />,
  FORUM: <MessageSquare className="size-3.5" />,
  WIKI: <NotebookText className="size-3.5" />,
  WORKSHOP: <ClipboardCheck className="size-3.5" />,
  GEOGEBRA: <Shapes className="size-3.5" />,
};

/** Gestion des sections + contenus d'un cours (enseignants/gestionnaires). */
export function SectionManager({ courseId, courseSlug, sections }: { courseId: string; courseSlug: string; sections: SectionLite[] }) {
  return (
    <div className="space-y-3">
      {sections.map((s, i) => <SectionRow key={s.id} index={i} section={s} courseSlug={courseSlug} />)}
      <form action={createSection} className="flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 p-3">
        <input type="hidden" name="courseId" value={courseId} />
        <Input name="title" placeholder="Titre de la nouvelle section" className="w-full max-w-xs" />
        <Button type="submit" variant="outline"><Plus className="size-4" /> Ajouter une section</Button>
      </form>
    </div>
  );
}

function SectionRow({ index, section, courseSlug }: { index: number; section: SectionLite; courseSlug: string }) {
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

      {section.activities.length > 0 && (
        <ul className="mt-2 space-y-1">
          {section.activities.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-2.5 py-1.5">
              <Link href={`/formation/cours/${courseSlug}/a/${a.id}`} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-advanced-fg">
                <span className="text-advanced-fg">{ACT_ICON[a.type] ?? <FileText className="size-3.5" />}</span> {a.title}
              </Link>
              <ConfirmActionButton
                action={deleteActivity}
                hidden={{ id: a.id }}
                triggerLabel=""
                triggerIcon={<Trash2 className="size-4" />}
                triggerVariant="ghost"
                triggerSize="icon-sm"
                title={`Supprimer « ${a.title} » ?`}
                description="Ce contenu sera supprimé définitivement."
                confirmLabel="Supprimer"
                confirmVariant="destructive"
              />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3"><ActivityAddButtons sectionId={section.id} /></div>
    </div>
  );
}
