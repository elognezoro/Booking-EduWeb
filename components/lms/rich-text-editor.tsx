"use client";

import * as React from "react";
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Link2, Image as ImageIcon, Quote, RemoveFormatting } from "lucide-react";
import { LMS_PROSE } from "@/components/lms/rich-content";

/** Éditeur de texte enrichi (contentEditable). Le HTML est synchronisé dans un champ caché `name`
 * puis nettoyé côté serveur (sanitizeRich) à l'enregistrement. */
export function RichTextEditor({ name, initialHtml }: { name: string; initialHtml?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [html, setHtml] = React.useState(initialHtml ?? "");

  React.useEffect(() => {
    if (ref.current && initialHtml && ref.current.innerHTML !== initialHtml) ref.current.innerHTML = initialHtml;
    // initialisation unique
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = () => { if (ref.current) setHtml(ref.current.innerHTML); };
  const cmd = (command: string, value?: string) => { ref.current?.focus(); document.execCommand(command, false, value); sync(); };
  const addLink = () => { const url = window.prompt("Adresse du lien (https://…) :"); if (url) cmd("createLink", url); };
  const addImage = () => { const url = window.prompt("Adresse de l'image (https://…) :"); if (url) cmd("insertImage", url); };

  const Btn = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClick} title={title} className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap gap-0.5 border-b border-border p-1.5">
        <Btn onClick={() => cmd("bold")} title="Gras"><Bold className="size-4" /></Btn>
        <Btn onClick={() => cmd("italic")} title="Italique"><Italic className="size-4" /></Btn>
        <Btn onClick={() => cmd("underline")} title="Souligné"><Underline className="size-4" /></Btn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <Btn onClick={() => cmd("formatBlock", "<h2>")} title="Titre"><Heading2 className="size-4" /></Btn>
        <Btn onClick={() => cmd("formatBlock", "<h3>")} title="Sous-titre"><Heading3 className="size-4" /></Btn>
        <Btn onClick={() => cmd("formatBlock", "<blockquote>")} title="Citation"><Quote className="size-4" /></Btn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <Btn onClick={() => cmd("insertUnorderedList")} title="Liste à puces"><List className="size-4" /></Btn>
        <Btn onClick={() => cmd("insertOrderedList")} title="Liste numérotée"><ListOrdered className="size-4" /></Btn>
        <span className="mx-1 w-px self-stretch bg-border" />
        <Btn onClick={addLink} title="Lien"><Link2 className="size-4" /></Btn>
        <Btn onClick={addImage} title="Image (URL)"><ImageIcon className="size-4" /></Btn>
        <Btn onClick={() => cmd("removeFormat")} title="Effacer la mise en forme"><RemoveFormatting className="size-4" /></Btn>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={sync}
        suppressContentEditableWarning
        className={`${LMS_PROSE} min-h-[220px] px-4 py-3 outline-none focus:ring-2 focus:ring-inset focus:ring-ring`}
        data-placeholder="Rédigez le contenu de la page…"
      />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
