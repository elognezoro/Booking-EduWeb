"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mots vides ignorés pour proposer un code à partir du nom.
const STOP = new Set(["DE", "DES", "DU", "LA", "LE", "LES", "L", "ET", "EN", "D", "A", "AU", "AUX", "POUR", "SUR", "DANS", "PAR"]);

/** Propose un code court en majuscules d'après un libellé (ex. "Robotique" → "ROB", "Intelligence Artificielle" → "IA"). */
export function suggestCode(name: string): string {
  const clean = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, " ")
    .trim();
  if (!clean) return "";
  const words = clean.split(/\s+/).filter((w) => w && !STOP.has(w));
  if (words.length === 0) return clean.replace(/\s+/g, "").slice(0, 4);
  if (words.length >= 2) return words.map((w) => w[0]).join("").slice(0, 5); // initiales
  return words[0].slice(0, 3); // un seul mot → 3 premières lettres
}

/**
 * Formulaire « Nom + Code » : le code est proposé automatiquement d'après le nom,
 * tout en restant modifiable (la proposition se fige dès que l'utilisateur édite le code).
 */
export function CodeNameForm({
  action,
  namePlaceholder,
  codePlaceholder,
  submitLabel = "Ajouter",
}: {
  action: (formData: FormData) => void | Promise<void>;
  namePlaceholder: string;
  codePlaceholder: string;
  submitLabel?: string;
}) {
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [codeEdited, setCodeEdited] = React.useState(false);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    if (!codeEdited) setCode(suggestCode(v)); // proposition auto tant que non modifié
  };

  const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.toUpperCase());
    setCodeEdited(true);
  };

  // Si l'utilisateur vide le code, on réactive la proposition automatique.
  const onCodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === "") {
      setCodeEdited(false);
      setCode(suggestCode(name));
    }
  };

  return (
    <form action={action} className="space-y-3">
      <div>
        <Label htmlFor="name" required>Nom</Label>
        <Input id="name" name="name" placeholder={namePlaceholder} required autoComplete="off" value={name} onChange={onNameChange} />
      </div>
      <div>
        <Label htmlFor="code" required>Code</Label>
        <Input id="code" name="code" placeholder={codePlaceholder} required autoComplete="off" value={code} onChange={onCodeChange} onBlur={onCodeBlur} />
        <p className="mt-1 text-xs text-muted-foreground">Proposé automatiquement d'après le nom — modifiable.</p>
      </div>
      <Button type="submit" className="w-full"><Plus className="size-4" /> {submitLabel}</Button>
    </form>
  );
}
