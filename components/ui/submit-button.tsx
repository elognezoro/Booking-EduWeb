"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

/** Bouton de soumission avec état « en cours » automatique (spinner + désactivé) via useFormStatus. */
export function SubmitButton({ children, pendingLabel, ...props }: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} type="submit" disabled={pending || props.disabled}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> {pendingLabel ?? "Veuillez patienter…"}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
