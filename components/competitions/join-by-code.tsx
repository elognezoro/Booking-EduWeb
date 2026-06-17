"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Saisie d'un code de session pour rejoindre une compétition. */
export function JoinByCode() {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const c = code.trim().toUpperCase();
        if (c) router.push(`/competition/${c}`);
      }}
      className="flex items-center gap-2"
    >
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="CODE"
        aria-label="Code de compétition"
        maxLength={6}
        className="h-10 w-36 text-center font-mono text-lg uppercase tracking-widest"
      />
      <Button type="submit"><Swords className="size-4" /> Rejoindre</Button>
    </form>
  );
}
