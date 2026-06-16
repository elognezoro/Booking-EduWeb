"use client";

import * as React from "react";
import { Copy, Check, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CitationBox({ citation }: { citation: string }) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <Quote className="size-3.5" /> Citation (APA)
        </span>
        <Button variant="ghost" size="sm" onClick={copy}>
          {copied ? <Check className="size-4 text-available" /> : <Copy className="size-4" />}
          {copied ? "Copié" : "Copier"}
        </Button>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{citation}</p>
    </div>
  );
}
