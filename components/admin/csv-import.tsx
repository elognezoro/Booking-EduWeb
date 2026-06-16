"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Download, Upload, Loader2, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";
import { importUsersCsv, type ImportState } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { ROLES, ROLE_META, type RoleKey } from "@/lib/enums";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Importer
    </Button>
  );
}

export function CsvImport() {
  const [state, formAction] = useFormState<ImportState, FormData>(importUsersCsv, {});
  const [fileName, setFileName] = React.useState("");
  const roles = ROLES.filter((r) => r !== "SUPER_ADMIN") as RoleKey[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><FileSpreadsheet className="size-4 text-primary" /> Import par cohorte (CSV)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Créez plusieurs comptes d'un coup à partir d'un fichier CSV. Les comptes sont créés <strong>actifs</strong> avec le mot de passe par défaut <code className="rounded bg-secondary px-1 font-mono text-xs font-bold text-primary">password123</code>.
        </p>

        <Button asChild variant="outline" size="sm">
          <a href="/api/users/template"><Download className="size-4" /> Télécharger le modèle CSV</a>
        </Button>

        <form action={formAction} className="space-y-3">
          <FileDropzone
            name="file"
            accept=".csv,text/csv"
            required
            icon={Upload}
            iconClassName="size-6"
            className="gap-1.5 rounded-xl px-4 py-6"
            title="Glissez-déposez ou choisissez un fichier CSV"
            hint="Colonnes : prenom, nom, email, fonction, role, matricule"
            onFileName={setFileName}
          />
          <SubmitButton />
        </form>

        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
            <AlertTriangle className="size-4 shrink-0" /> {state.error}
          </div>
        )}

        {state.ok && (
          <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-3 text-sm">
            <p className="flex items-center gap-2 font-semibold text-available-fg">
              <CheckCircle2 className="size-4" /> {state.created} compte(s) créé(s){state.skipped ? `, ${state.skipped} ignoré(s)` : ""}.
            </p>
            {state.errors && state.errors.length > 0 && (
              <ul className="max-h-40 list-inside list-disc overflow-y-auto text-xs text-muted-foreground">
                {state.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-3">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Valeurs « role » acceptées</p>
          <div className="flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <span key={r} className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-foreground" title={ROLE_META[r].label}>{r}</span>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">Vide ou inconnu ⇒ « Demandeur ». Le libellé (ex. « Responsable de ressource ») est aussi accepté.</p>
        </div>
      </CardContent>
    </Card>
  );
}
