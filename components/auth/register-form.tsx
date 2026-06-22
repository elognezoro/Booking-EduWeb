"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { UserPlus, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { registerAccount, type RegisterState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { formatGivenName, formatFamilyName } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
      Envoyer ma demande
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState<RegisterState, FormData>(registerAccount, {});

  if (state.success) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-available-soft text-available-fg">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="text-2xl font-extrabold text-foreground">Demande envoyée 🎉</h1>
        <p className="mt-3 text-muted-foreground">
          Votre compte a été créé et est <strong className="text-foreground">en attente de validation</strong> par un
          administrateur. Vous recevrez une notification dès qu'il sera activé.
        </p>
        <Button asChild className="mt-6"><a href="/login">Retour à la connexion</a></Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Créer un compte</h1>
      <p className="mt-2 text-muted-foreground">Renseignez vos informations ; votre compte sera activé après validation par un administrateur.</p>

      <form action={formAction} className="mt-7 space-y-4">
        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
            <AlertCircle className="size-4 shrink-0" /> {state.error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="firstName" required>Prénom</Label><Input id="firstName" name="firstName" required onBlur={(e) => { e.currentTarget.value = formatGivenName(e.currentTarget.value); }} /></div>
          <div><Label htmlFor="lastName" required>Nom</Label><Input id="lastName" name="lastName" required onBlur={(e) => { e.currentTarget.value = formatFamilyName(e.currentTarget.value); }} /></div>
        </div>
        <div><Label htmlFor="email" required>Adresse e-mail</Label><Input id="email" name="email" type="email" placeholder="vous@exemple.ci" required /></div>
        <div><Label htmlFor="functionTitle">Fonction</Label><Input id="functionTitle" name="functionTitle" placeholder="Ex. Enseignant, Étudiant…" /></div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="password" required>Mot de passe</Label><PasswordInput id="password" name="password" placeholder="6 caractères minimum" autoComplete="new-password" required /></div>
          <div><Label htmlFor="confirm" required>Confirmer</Label><PasswordInput id="confirm" name="confirm" autoComplete="new-password" required /></div>
        </div>

        <label className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 p-3">
          <input type="checkbox" name="accept" className="mt-0.5 size-4 rounded border-input text-primary focus:ring-ring" required />
          <span className="text-sm text-muted-foreground">
            <ShieldCheck className="mr-1 inline size-4 text-primary" />
            Je comprends que mon compte sera <strong className="text-foreground">soumis à la validation</strong> d'un administrateur avant de pouvoir être utilisé.
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
