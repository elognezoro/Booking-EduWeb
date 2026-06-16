"use client";

import * as React from "react";
import { UploadCloud, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Zone de dépôt de fichier : clic OU glisser-déposer. Le fichier déposé est injecté dans
 * l'<input type="file"> réel afin d'être soumis normalement avec le formulaire.
 */
export function FileDropzone({
  name,
  accept,
  required,
  title,
  hint,
  icon: Icon = UploadCloud,
  className,
  iconClassName,
  onFileName,
}: {
  name: string;
  accept?: string;
  required?: boolean;
  title: string;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
  iconClassName?: string;
  onFileName?: (name: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState("");
  const [dragOver, setDragOver] = React.useState(false);

  const apply = (file: File | null) => {
    const n = file?.name ?? "";
    setFileName(n);
    onFileName?.(n);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    // Injecte le fichier déposé dans l'input pour qu'il parte avec le formulaire.
    if (inputRef.current) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        inputRef.current.files = dt.files;
      } catch {
        /* DataTransfer non supporté : le clic reste disponible */
      }
    }
    apply(file);
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragOver) setDragOver(true);
      }}
      onDragEnter={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-secondary/40 px-6 py-10 text-center transition",
        dragOver ? "border-primary bg-primary-50" : "border-border hover:border-primary/40",
        className
      )}
    >
      <Icon className={cn("size-8 shrink-0 text-primary", iconClassName)} />
      <span className="text-sm font-semibold text-foreground">{fileName || title}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        required={required}
        className="hidden"
        onChange={(e) => apply(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
