import * as React from "react";
import { cn } from "@/lib/utils";
import { TONE_CLASSES, TONE_DOT } from "@/lib/tone";
import type { Tone } from "@/lib/enums";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ className, tone = "neutral", dot = false, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("size-1.5 rounded-full", TONE_DOT[tone])} />}
      {children}
    </span>
  );
}
