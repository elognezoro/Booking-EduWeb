"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Eye, EyeOff, LogIn, Loader2, AlertCircle, Zap, Building2, ArrowLeftRight, UserPlus } from "lucide-react";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const QUICK = [
  { label: "Admin", email: "admin.aprid@ens.ci" },
  { label: "Responsable", email: "responsable.salles@ens.ci" },
  { label: "Validateur", email: "validateur.aprid@ens.ci" },
  { label: "Enseignant", email: "enseignant.demo@ens.ci" },
];

export interface Institution {
  name: string;
  acronym: string | null;
  primaryColor: string | null;
  slug: string;
  demoEmail: string | null;
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

export function LoginForm({ callbackUrl, institution }: { callbackUrl?: string; institution?: Institution | null }) {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function quickFill(value: string) {
    setEmail(value);
    setPassword("password123");
  }

  const color = institution?.primaryColor ?? "#064B3A";
  const registerHref = institution ? `/register?org=${institution.slug}` : "/register";

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
          <div className="relative">
            <Input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" required />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground" aria-label={show ? "Masquer" : "Afficher"}>
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <SubmitButton />

        {/* Création de compte mise en évidence, juste à côté de « Se connecter ». */}
        <div className="relative py-1 text-center">
          <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
          <span className="bg-background px-3 text-xs font-medium text-muted-foreground">ou</span>
        </div>
        <Button asChild type="button" variant="outline" size="lg" className="w-full border-primary/40 text-primary hover:bg-primary-50">
          <a href={registerHref}>
            <UserPlus className="size-4" /> Créer un compte
          </a>
        </Button>
      </form>

      {institution ? (
        institution.demoEmail && (
          <div className="mt-7 rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Zap className="size-3.5 text-pending" /> Démo · password123
            </p>
            <button type="button" onClick={() => quickFill(institution.demoEmail!)} className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
              Administrateur ({institution.demoEmail})
            </button>
          </div>
        )
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <Zap className="size-3.5 text-pending" /> Connexion rapide (démo ENS · password123)
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button key={q.email} type="button" onClick={() => quickFill(q.email)} className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
                {q.label}
              </button>
            ))}
          </div>
          <a href="/institutions" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <Building2 className="size-3.5" /> Accéder à l'espace d'une autre institution
          </a>
        </div>
      )}

    </div>
  );
}
