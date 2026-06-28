"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { resendVerificationEmail, type ResendState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending} className="shrink-0">
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />} Renvoyer le lien
    </Button>
  );
}

/** Renvoie l'e-mail de confirmation (réponse uniforme, anti-énumération). */
export function ResendVerification({ defaultEmail }: { defaultEmail?: string }) {
  const [state, action] = useFormState<ResendState, FormData>(resendVerificationEmail, {});

  if (state.sent) {
    return (
      <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-available-fg">
        <CheckCircle2 className="size-4 shrink-0" /> Si un compte non confirmé existe pour cette adresse, un nouveau lien vient d'être envoyé.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input name="email" type="email" defaultValue={defaultEmail} placeholder="votre@email.ci" required className="flex-1" />
      <Submit />
      {state.error && <p className="text-xs font-medium text-unavailable-fg">{state.error}</p>}
    </form>
  );
}
