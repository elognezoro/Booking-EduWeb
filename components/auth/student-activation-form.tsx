"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { GraduationCap, Loader2, AlertCircle, MailCheck, ShieldCheck, Hash } from "lucide-react";
import { activateStudentAccount, type StudentActivationState } from "@/app/actions/scolarite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { ResendVerification } from "@/components/auth/resend-verification";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <GraduationCap className="size-4" />}
      Activer mon compte étudiant
    </Button>
  );
}

/**
 * Activation en libre-service du compte d'un étudiant enrôlé par la Scolarité :
 * identité prouvée par matricule + date de naissance (listes officielles), puis
 * choix de l'e-mail et du mot de passe personnels ; confirmation par e-mail.
 */
export function StudentActivationForm() {
  const [state, formAction] = useFormState<StudentActivationState, FormData>(activateStudentAccount, {});

  if (state.success) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-available-soft text-available-fg">
          <MailCheck className="size-8" />
        </span>
        <h1 className="text-2xl font-extrabold text-foreground">Fiche reconnue — confirmez votre e-mail 📩</h1>
        <p className="mt-3 text-muted-foreground">
          Un e-mail de confirmation {state.email ? <>a été envoyé à <strong className="text-foreground">{state.email}</strong></> : "vient de vous être envoyé"}.
          Cliquez sur le lien qu'il contient pour <strong className="text-foreground">activer votre compte</strong> ; vous serez alors connecté automatiquement. Le lien est valable 48 heures.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Pensez à vérifier votre dossier « indésirables / spam ».</p>
        <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-3 text-left">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Vous n'avez rien reçu ?</p>
          <ResendVerification defaultEmail={state.email} />
        </div>
        <Button asChild variant="ghost" className="mt-5"><a href="/login">Retour à la connexion</a></Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Activer mon compte étudiant</h1>
      <p className="mt-2 text-muted-foreground">
        Vous êtes enrôlé(e) à l'ENS d'Abidjan ? Identifiez-vous avec votre <strong className="text-foreground">matricule</strong> et
        votre <strong className="text-foreground">date de naissance</strong>, puis choisissez vos propres paramètres d'accès.
      </p>

      <form action={formAction} className="mt-7 space-y-4">
        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
            <AlertCircle className="size-4 shrink-0" /> {state.error}
          </div>
        )}

        <div>
          <Label htmlFor="sa-matricule" required>N° matricule</Label>
          <div className="relative">
            <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="sa-matricule" name="matricule" required maxLength={40} placeholder="Ex. 25-A-P10613PL/AN" className="pl-9 uppercase" autoComplete="off" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Tel qu'il figure sur les listes officielles de la Scolarité.</p>
        </div>
        <div><Label htmlFor="sa-birth" required>Date de naissance</Label><Input id="sa-birth" name="birthDate" type="date" required /></div>
        <div><Label htmlFor="sa-email" required>Votre adresse e-mail</Label><Input id="sa-email" name="email" type="email" required placeholder="vous@exemple.ci" /></div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="sa-password" required>Mot de passe</Label><PasswordInput id="sa-password" name="password" placeholder="6 caractères minimum" autoComplete="new-password" required /></div>
          <div><Label htmlFor="sa-confirm" required>Confirmer</Label><PasswordInput id="sa-confirm" name="confirm" autoComplete="new-password" required /></div>
        </div>

        <label className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/40 p-3">
          <input type="checkbox" name="accept" className="mt-0.5 size-4 rounded border-input text-primary focus:ring-ring" required />
          <span className="text-sm text-muted-foreground">
            <ShieldCheck className="mr-1 inline size-4 text-primary" />
            J'accepte les conditions d'utilisation et la réception d'un <strong className="text-foreground">e-mail de confirmation</strong> pour activer mon compte.
          </span>
        </label>

        <SubmitButton />
        <p className="text-center text-sm text-muted-foreground">
          Déjà activé ? <a href="/login" className="font-semibold text-primary hover:underline">Se connecter</a>
        </p>
      </form>
    </div>
  );
}
