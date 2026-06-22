"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { UserPlus, Loader2, AlertCircle, CheckCircle2, Building2, ShieldCheck } from "lucide-react";
import { registerAccount, type RegisterState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { formatGivenName, formatFamilyName, ENS_MATRICULE_EXAMPLE } from "@/lib/utils";

interface Inst { slug: string; name: string }

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
      Envoyer ma demande
    </Button>
  );
}

const ENS_ABIDJAN_SLUG = "ens-abidjan";

export function RegisterForm({ institutions, defaultOrg, lockedName }: { institutions: Inst[]; defaultOrg?: string; lockedName?: string }) {
  const [state, formAction] = useFormState<RegisterState, FormData>(registerAccount, {});
  const [orgSlug, setOrgSlug] = React.useState(defaultOrg ?? "");
  const [isStudent, setIsStudent] = React.useState(false);
  const isEns = orgSlug === ENS_ABIDJAN_SLUG;

  if (state.success) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-available-soft text-available-fg">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="text-2xl font-extrabold text-foreground">Demande envoyée 🎉</h1>
        <p className="mt-3 text-muted-foreground">
          Votre compte a été créé et est <strong className="text-foreground">en attente de validation</strong> par un
          administrateur de votre institution. Vous recevrez une notification dès qu'il sera activé.
        </p>
        <Button asChild className="mt-6"><a href="/login">Retour à la connexion</a></Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Créer un compte</h1>
      <p className="mt-2 text-muted-foreground">Demandez l'accès à l'espace de votre institution.</p>

      <form action={formAction} className="mt-7 space-y-4">
        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
            <AlertCircle className="size-4 shrink-0" /> {state.error}
          </div>
        )}

        <div>
          <Label htmlFor="org" required>Institution</Label>
          {lockedName ? (
            <>
              <input type="hidden" name="org" value={defaultOrg} />
              <div className="flex h-10 items-center gap-2 rounded-xl border border-input bg-secondary/40 px-3.5 text-sm font-semibold text-foreground">
                <Building2 className="size-4 text-primary" /> {lockedName}
              </div>
            </>
          ) : (
            <Select id="org" name="org" value={orgSlug} onChange={(e) => setOrgSlug(e.target.value)} required>
              <option value="">Sélectionnez votre institution…</option>
              {institutions.map((i) => <option key={i.slug} value={i.slug}>{i.name}</option>)}
            </Select>
          )}
          {!lockedName && !isEns && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Étudiant de l'ENS d'Abidjan ? Sélectionnez votre institution pour pouvoir saisir votre matricule.
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="firstName" required>Prénom</Label><Input id="firstName" name="firstName" required onBlur={(e) => { e.currentTarget.value = formatGivenName(e.currentTarget.value); }} /></div>
          <div><Label htmlFor="lastName" required>Nom</Label><Input id="lastName" name="lastName" required onBlur={(e) => { e.currentTarget.value = formatFamilyName(e.currentTarget.value); }} /></div>
        </div>
        <div><Label htmlFor="email" required>Adresse e-mail</Label><Input id="email" name="email" type="email" placeholder="vous@institution.ci" required /></div>
        <div><Label htmlFor="functionTitle">Fonction</Label><Input id="functionTitle" name="functionTitle" placeholder="Ex. Enseignant, Étudiant…" /></div>

        {isEns && (
          <div className="rounded-xl border border-border bg-secondary/40 p-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isStudent" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} className="size-4 rounded border-input text-primary focus:ring-ring" />
              <span className="text-sm font-semibold text-foreground">Je suis étudiant de l'ENS d'Abidjan</span>
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
                <p className="mt-1 text-xs text-muted-foreground">Format : {ENS_MATRICULE_EXAMPLE}. Servira à vérifier votre statut d'étudiant.</p>
              </div>
            )}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="password" required>Mot de passe</Label><PasswordInput id="password" name="password" placeholder="6 caractères minimum" autoComplete="new-password" required /></div>
          <div><Label htmlFor="confirm" required>Confirmer</Label><PasswordInput id="confirm" name="confirm" autoComplete="new-password" required /></div>
        </div>

        <label className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 p-3">
          <input type="checkbox" name="accept" className="mt-0.5 size-4 rounded border-input text-primary focus:ring-ring" required />
          <span className="text-sm text-muted-foreground">
            <ShieldCheck className="mr-1 inline size-4 text-primary" />
            Je comprends que mon compte sera <strong className="text-foreground">soumis à la validation</strong> d'un administrateur de l'institution avant de pouvoir être utilisé.
          </span>
        </label>

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Vous avez déjà un compte ? <a href="/login" className="font-semibold text-primary hover:underline">Se connecter</a>
      </p>
    </div>
  );
}
