"use client";

import * as React from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { formatBytes } from "@/lib/lms-assign";

/**
 * Sélection d'un fichier (devoir) côté client : lecture en data URL base64 placée dans des champs
 * cachés `${name}Data` / `${name}Name` / `${name}Mime`. Glisser-déposer + clic, plafond de taille.
 */
export function FileUpload({ name, accept, maxMb, currentName }: { name: string; accept: string; maxMb: number; currentName?: string | null }) {
  const [picked, setPicked] = React.useState<{ name: string; mime: string; data: string; size: number } | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    setErr(null);
    if (file.size > maxMb * 1024 * 1024) { setErr(`Fichier trop volumineux (max ${maxMb} Mo).`); return; }
    const data = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    setPicked({ name: file.name, mime: file.type || "application/octet-stream", data, size: file.size });
  };

  const clear = () => { setPicked(null); setErr(null); if (inputRef.current) inputRef.current.value = ""; };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!dragOver) setDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); void onFile(e.dataTransfer?.files?.[0]); }}
    >
      <input type="hidden" name={`${name}Data`} value={picked?.data ?? ""} readOnly />
      <input type="hidden" name={`${name}Name`} value={picked?.name ?? ""} readOnly />
      <input type="hidden" name={`${name}Mime`} value={picked?.mime ?? ""} readOnly />

      {picked ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-2">
          <span className="flex min-w-0 items-center gap-2 text-sm text-foreground"><FileText className="size-4 shrink-0 text-advanced-fg" /> <span className="truncate">{picked.name}</span> <span className="shrink-0 text-xs text-muted-foreground">({formatBytes(picked.size)})</span></span>
          <button type="button" onClick={clear} className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Retirer le fichier"><X className="size-4" /></button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-5 text-sm transition ${dragOver ? "border-primary bg-primary/5 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50"}`}
        >
          <UploadCloud className="size-5" />
          {dragOver ? "Déposez le fichier ici" : "Glissez un fichier ici ou cliquez"}
          <span className="text-xs">max {maxMb} Mo</span>
        </button>
      )}
      {currentName && !picked && <p className="mt-1 text-xs text-muted-foreground">Fichier actuel : <span className="font-medium text-foreground">{currentName}</span> (conservé si vous n'en déposez pas un nouveau).</p>}
      {err && <p className="mt-1 text-xs font-medium text-unavailable-fg">{err}</p>}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => void onFile(e.target.files?.[0])} />
    </div>
  );
}
