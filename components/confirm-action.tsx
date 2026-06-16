"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Modal } from "@/components/ui/modal";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function SubmitButton({ label, variant }: { label: string; variant: ButtonProps["variant"] }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {label}
    </Button>
  );
}

export function ConfirmActionButton({
  action,
  hidden,
  triggerLabel,
  triggerIcon,
  triggerVariant = "outline",
  triggerSize = "sm",
  title,
  description,
  confirmLabel = "Confirmer",
  confirmVariant = "default",
  fullWidthTrigger,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hidden?: Record<string, string>;
  triggerLabel: string;
  triggerIcon?: React.ReactNode;
  triggerVariant?: ButtonProps["variant"];
  triggerSize?: ButtonProps["size"];
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  fullWidthTrigger?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        onClick={() => setOpen(true)}
        className={fullWidthTrigger ? "w-full" : undefined}
      >
        {triggerIcon}
        {triggerLabel}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={title} description={description}>
        <form action={action} onSubmit={() => setOpen(false)} className="flex justify-end gap-2">
          {hidden &&
            Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <SubmitButton label={confirmLabel} variant={confirmVariant} />
        </form>
      </Modal>
    </>
  );
}
