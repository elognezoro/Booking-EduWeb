"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { LogIn, Loader2, AlertCircle, Building2, ArrowLeftRight, UserPlus, MailWarning, Sparkles } from "lucide-react";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { ResendVerification } from "@/components/auth/resend-verification";

export interface Institution {
  name: string;
  acronym: string | null;
  primaryColor: string | null;
  slug: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
      Se connecter
    </Button>
  );
}

export function LoginForm({ callbackUrl, institution, verifyNotice }: { callbackUrl?: string; institution?: Institution | null; verifyNotice?: "expired" | "invalid" }) {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});
  const [email, setEmail] = React.useState("");

  const color = institution?.primaryColor ?? "#064B3A";
  const registerHref = "/register";

  return (
    <div>
      {institution && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold" style={{ backgroundColor: `${color}1a`, color }}>
              {institution.acronym ?? <Building2 className="size-5" />}
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Espace institution</p>
              <p className="truncate font-bold text-foreground">{institution.name}</p>
            </div>
          </div>
          <a href="/institutions" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <ArrowLeftRight className="size-3.5" /> Changer
          </a>
        </div>
      )}

      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Bon retour 👋</h1>
      <p className="mt-2 text-muted-foreground">
        {institution ? `Connectez-vous à l'espace ${institution.name}.` : "Connectez-vous à votre espace EduWeb Booking."}
      </p>

      {verifyNotice && (
        <div className="mt-5 rounded-xl border border-pending/30 bg-pending-soft p-3.5">
          <p className="flex items-center gap-2 text-sm font-semibold text-pending-fg">
            <MailWarning className="size-4 shrink-0" />
            {verifyNotice === "expired" ? "Le lien de confirmation a expiré." : "Lien de confirmation invalide ou déjà utilisé."}
          </p>
          <p className="mt-1 mb-2.5 text-xs text-muted-foreground">Saisissez votre adresse pour recevoir un nouveau lien de confirmation :</p>
          <ResendVerification />
        </div>
      )}

      <form action={formAction} className="mt-8 space-y-4">
        {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
        {institution && <input type="hidden" name="org" value={institution.slug} />}

        {state.error && (
          <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}

        <div>
          <Label htmlFor="email" required>Adresse e-mail</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="vous@organisation.ci" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" required>Mot de passe</Label>
            <a href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Mot de passe oublié ?</a>
          </div>
          <PasswordInput id="password" name="password" autoComplete="current-password" placeholder="••••••••" required />
        </div>

        <SubmitButton />

        {/* Création de compte mise en évidence, juste à côté de « Se connecter ». */}
        <div className="relative py-1 text-center">
          <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
          <span className="bg-background px-3 text-xs font-medium text-muted-foreground">ou</span>
        </div>
        {/* Bandeau scintillant : les étudiants enrôlés ACTIVENT leur compte (au lieu d'en créer un autre). */}
        <a
          href="/activation-etudiant"
          className="relative block overflow-hidden rounded-xl border-2 border-[#f7c948] bg-gradient-to-r from-primary via-primary-600 to-primary-700 px-4 py-3 text-white transition-transform hover:scale-[1.01] animate-[glow-pulse_2s_ease-in-out_infinite]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine-sweep_2.6s_linear_infinite]"
          />
          <span className="relative flex items-center justify-center gap-3">
            <Sparkles className="size-5 shrink-0 animate-pulse text-[#f7c948]" />
            <span className="text-center">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#f7c948]">Étudiant(e) de l'ENS d'Abidjan ?</span>
              <span className="block text-sm font-extrabold leading-tight">Activez votre compte étudiant — il existe déjà, ne créez pas un nouveau compte</span>
            </span>
            <Sparkles className="size-5 shrink-0 animate-pulse text-[#f7c948] [animation-delay:400ms]" />
          </span>
        </a>

        <Button asChild type="button" variant="outline" size="lg" className="w-full border-primary/40 text-primary hover:bg-primary-50">
          <a href={registerHref}>
            <UserPlus className="size-4" /> Créer un compte
          </a>
        </Button>
      </form>

      {!institution && (
        <a href="/institutions" className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <Building2 className="size-4" /> Accéder à l'espace d'une autre institution
        </a>
      )}
    </div>
  );
}
