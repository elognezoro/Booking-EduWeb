"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { UserPlus, Loader2, AlertCircle, CheckCircle2, Building2, ShieldCheck, ArrowLeftRight } from "lucide-react";
import { registerAccount, type RegisterState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { formatGivenName, formatFamilyName, ENS_MATRICULE_EXAMPLE } from "@/lib/utils";

const ENS_ABIDJAN_SLUG = "ens-abidjan";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
      Envoyer ma demande
    </Button>
  );
}

// L'institution est déterminée par l'espace d'où l'on s'inscrit (pas de champ à choisir).
export function RegisterForm({ orgSlug, orgName }: { orgSlug: string; orgName: string }) {
  const [state, formAction] = useFormState<RegisterState, FormData>(registerAccount, {});
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
        <Button asChild className="mt-6"><a href={`/login?org=${orgSlug}`}>Retour à la connexion</a></Button>
      </div>
    );
  }

  return (
    <div>
      {/* Contexte institution (lecture seule) — l'inscription se fait dans cet espace. */}
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <Building2 className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Espace institution</p>
            <p className="truncate font-bold text-foreground">{orgName}</p>
          </div>
        </div>
        <a href="/institutions" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline">
          <ArrowLeftRight className="size-3.5" /> Changer
        </a>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Créer un compte</h1>
      <p className="mt-2 text-muted-foreground">Demandez l'accès à l'espace {orgName}.</p>

      <form action={formAction} className="mt-7 space-y-4">
        <input type="hidden" name="org" value={orgSlug} />

        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
            <AlertCircle className="size-4 shrink-0" /> {state.error}
          </div>
        )}

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
        Vous avez déjà un compte ? <a href={`/login?org=${orgSlug}`} className="font-semibold text-primary hover:underline">Se connecter</a>
      </p>
    </div>
  );
}
