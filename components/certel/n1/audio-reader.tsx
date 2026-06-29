"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Pause, Play, Square } from "lucide-react";

/**
 * Lecteur audio (synthèse vocale du navigateur) pour lire à voix haute le narratif d'une leçon
 * ou la consigne d'un exercice. Web Speech API — aucune dépendance ni backend.
 * Le texte est découpé en phrases (file d'attente) pour éviter la coupure ~15 s de Chrome.
 */
export function AudioReader({ text, label = "Écouter", className = "" }: { text: string; label?: string; className?: string }) {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((v) => /^fr(-|_)/i.test(v.lang)) || voices.find((v) => v.lang.toLowerCase().startsWith("fr")) || null;
    };
    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Stoppe la lecture si le texte change (changement de leçon) ou au démontage.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [text]);

  const start = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const chunks = (text.match(/[^.!?:;]+[.!?:;]*/g) || [text]).map((s) => s.trim()).filter(Boolean);
    chunks.forEach((chunk, i) => {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = "fr-FR";
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 0.98;
      u.pitch = 1;
      if (i === chunks.length - 1) {
        u.onend = () => setState("idle");
        u.onerror = () => setState("idle");
      }
      synth.speak(u);
    });
    setState("playing");
  }, [text]);

  const toggle = useCallback(() => {
    const synth = window.speechSynthesis;
    if (state === "idle") return start();
    if (state === "playing") {
      synth.pause();
      setState("paused");
    } else if (state === "paused") {
      synth.resume();
      setState("playing");
    }
  }, [state, start]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState("idle");
  }, []);

  if (!supported) return null;

  const active = state !== "idle";
  return (
    <div className={`inline-flex items-center gap-1 rounded-full border border-advanced/30 bg-advanced-soft/60 p-1 pl-1.5 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        aria-label={state === "playing" ? "Mettre en pause" : state === "paused" ? "Reprendre" : label}
        className="inline-flex items-center gap-1.5 rounded-full bg-advanced px-2.5 py-1 text-xs font-bold text-white transition hover:bg-advanced/90"
      >
        {state === "playing" ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
        {state === "idle" ? (
          <span className="inline-flex items-center gap-1"><Volume2 className="size-3.5" /> {label}</span>
        ) : state === "paused" ? "Reprendre" : "Pause"}
      </button>
      {active && (
        <>
          <span aria-hidden className="flex items-end gap-0.5 px-1" title="Lecture en cours">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`w-0.5 rounded-full bg-advanced-fg ${state === "playing" ? "animate-pulse" : ""}`}
                style={{ height: state === "playing" ? `${6 + ((i % 3) + 1) * 3}px` : "6px", animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
          <button type="button" onClick={stop} aria-label="Arrêter la lecture" className="inline-flex size-6 items-center justify-center rounded-full text-advanced-fg transition hover:bg-advanced/15">
            <Square className="size-3" />
          </button>
        </>
      )}
    </div>
  );
}
