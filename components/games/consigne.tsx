"use client";

import * as React from "react";
import { Volume2, Pause, Play, RotateCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "playing" | "paused";

/**
 * Consigne d'un jeu : affichée en texte ET lisible en audio (synthèse vocale du navigateur, fr-FR).
 * Commandes : Écouter, Pause/Reprendre, Réécouter, réglage du volume. Aucun fichier audio requis
 * (la voix est générée côté client) — un fichier audio déposé par l'admin pourra s'ajouter plus tard.
 */
export function Consigne({ text, audioUrl, className }: { text: string; audioUrl?: string | null; className?: string }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [supported, setSupported] = React.useState(true);
  const volRef = React.useRef(1);

  React.useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const play = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = 0.98;
    u.volume = volRef.current;
    const fr = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith("fr"));
    if (fr) u.voice = fr;
    u.onend = () => setStatus("idle");
    u.onerror = () => setStatus("idle");
    synth.speak(u);
    setStatus("playing");
  };

  const togglePause = () => {
    const synth = window.speechSynthesis;
    if (status === "playing") {
      synth.pause();
      setStatus("paused");
    } else if (status === "paused") {
      synth.resume();
      setStatus("playing");
    }
  };

  return (
    <div className={cn("rounded-xl border border-border bg-secondary/40 p-3.5", className)}>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <Info className="size-4 text-primary" /> Consigne
        </p>
        {audioUrl ? (
          <audio controls preload="none" src={audioUrl} className="h-8 max-w-[230px]" />
        ) : supported && (
          <div className="flex items-center gap-1.5">
            {status === "idle" ? (
              <button type="button" onClick={play} aria-label="Écouter la consigne"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary-50/70">
                <Volume2 className="size-3.5" /> Écouter
              </button>
            ) : (
              <>
                <button type="button" onClick={togglePause} aria-label={status === "playing" ? "Mettre en pause" : "Reprendre"}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary-50/70">
                  {status === "playing" ? <><Pause className="size-3.5" /> Pause</> : <><Play className="size-3.5" /> Reprendre</>}
                </button>
                <button type="button" onClick={play} aria-label="Réécouter depuis le début"
                  className="inline-flex size-7 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground" title="Réécouter">
                  <RotateCcw className="size-3.5" />
                </button>
              </>
            )}
            <label className="ml-1 inline-flex items-center gap-1" title="Volume">
              <Volume2 className="size-3.5 text-muted-foreground" />
              <input
                type="range" min={0} max={1} step={0.1} defaultValue={1}
                onChange={(e) => { volRef.current = Number(e.target.value); }}
                aria-label="Volume de la consigne"
                className="h-1 w-16 cursor-pointer accent-primary"
              />
            </label>
          </div>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}
