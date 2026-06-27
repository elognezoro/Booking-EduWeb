"use client";

import * as React from "react";
import { UploadCloud, X } from "lucide-react";

/**
 * Téléverse une image (logo, cachet ou signature) côté client : la lit, la
 * redimensionne (pour limiter le poids) en data URL base64, et la place dans un
 * champ caché. Glisser-déposer + clic. Valeur du champ :
 *  - "" : inchangé · "__REMOVE__" : à retirer · "data:image/..." : nouvelle image.
 */
export function CertificateImageUpload({
  name,
  label,
  initial,
  hint,
  maxDim = 1024,
}: {
  name: string;
  label: string;
  initial?: string | null;
  hint?: string;
  maxDim?: number;
}) {
  const [preview, setPreview] = React.useState<string | null>(initial ?? null);
  const [value, setValue] = React.useState("");
  const [dragOver, setDragOver] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const url = await resizeToDataUrl(file, maxDim);
      setPreview(url);
      setValue(url);
    } finally {
      setBusy(false);
    }
  };

  const remove = () => {
    setPreview(null);
    setValue("__REMOVE__");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    void onFile(e.dataTransfer?.files?.[0]);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <p className="mb-1 text-sm font-medium text-foreground">{label}</p>
      <input type="hidden" name={name} value={value} readOnly />
      {preview ? (
        <div className={`relative inline-block rounded-xl border bg-white p-2 transition ${dragOver ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={label} className="max-h-24 max-w-[220px] object-contain" />
          <button type="button" onClick={remove} className="absolute -right-2 -top-2 rounded-full bg-unavailable p-1 text-white shadow" aria-label="Retirer">
            <X className="size-3.5" />
          </button>
          {dragOver && <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">Déposez pour remplacer</div>}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-6 text-sm transition ${dragOver ? "border-primary bg-primary/5 text-primary" : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary/50"}`}
        >
          <UploadCloud className="size-5" />
          {busy ? "Traitement…" : dragOver ? "Déposez l'image ici" : "Glissez une image ici ou cliquez"}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => void onFile(e.target.files?.[0])} />
      <div className="mt-1 flex items-center gap-3">
        {preview && (
          <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-semibold text-primary hover:underline">
            {busy ? "Traitement…" : "Remplacer"}
          </button>
        )}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

/** Lit un fichier image et le redimensionne (côté client) pour limiter le poids du base64. */
async function resizeToDataUrl(file: File, maxDim: number): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  try {
    const img = document.createElement("img");
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = dataUrl;
    });
    if (img.width <= maxDim && img.height <= maxDim) return dataUrl; // déjà assez petit
    const scale = Math.min(maxDim / img.width, maxDim / img.height);
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    const type = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
    return canvas.toDataURL(type, 0.9);
  } catch {
    return dataUrl; // en cas d'échec, on garde l'original
  }
}
