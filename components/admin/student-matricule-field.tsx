"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ENS_MATRICULE_EXAMPLE } from "@/lib/utils";

/** Case « Étudiant de l'ENS d'Abidjan » qui révèle le champ matricule (création de compte côté admin). */
export function StudentMatriculeField() {
  const [isStudent, setIsStudent] = React.useState(false);
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isStudent"
          checked={isStudent}
          onChange={(e) => setIsStudent(e.target.checked)}
          className="size-4 rounded border-input text-primary focus:ring-ring"
        />
        <span className="text-sm font-semibold text-foreground">Étudiant de l'ENS d'Abidjan</span>
      </label>
      {isStudent && (
        <div className="mt-3">
          <Label htmlFor="matricule" required>Matricule étudiant (n° d'inscription)</Label>
          <Input
            id="matricule"
            name="matricule"
            required
            placeholder={`Ex. ${ENS_MATRICULE_EXAMPLE}`}
            pattern="\d{2}-[A-Za-z0-9]+-[A-Za-z0-9]+/[A-Za-z0-9]+"
            title={`Format attendu : ${ENS_MATRICULE_EXAMPLE}`}
            onBlur={(e) => { e.currentTarget.value = e.currentTarget.value.trim().toUpperCase(); }}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Sert de paramètre de vérification (téléchargements réservés aux étudiants).</p>
        </div>
      )}
    </div>
  );
}
