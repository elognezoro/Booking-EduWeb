"use client";

import * as React from "react";
import { UploadCloud, X } from "lucide-react";

/**
 * Téléverse une image (cachet ou signature scanné) côté client : la lit en
 * data URL base64 et la place dans un champ caché. Valeur du champ :
 *  - "" : inchangé · "__REMOVE__" : à retirer · "data:image/..." : nouvelle image.
 */
export function CertificateImageUpload({ name, label, initial, hint }: { name: string; label: string; initial?: string | null; hint?: string }) {
  const [preview, setPreview] = React.useState<string | null>(initial ?? null);
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setPreview(url);
      setValue(url);
    };
    reader.readAsDataURL(file);
  };

  const remove = () => {
    setPreview(null);
    setValue("__REMOVE__");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-foreground">{label}</p>
      <input type="hidden" name={name} value={value} readOnly />
      {preview ? (
        <div className="relative inline-block rounded-xl border border-border bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={label} className="max-h-24 max-w-[220px] object-contain" />
          <button type="button" onClick={remove} className="absolute -right-2 -top-2 rounded-full bg-unavailable p-1 text-white shadow" aria-label="Retirer">
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-6 text-sm text-muted-foreground hover:bg-secondary/50"
        >
          <UploadCloud className="size-5" /> Choisir une image
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <div className="mt-1 flex items-center gap-3">
        {preview && (
          <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-semibold text-primary hover:underline">
            Remplacer
          </button>
        )}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
