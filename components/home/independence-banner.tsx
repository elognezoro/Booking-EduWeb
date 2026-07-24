"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { X } from "lucide-react";

/**
 * Bannière flottante « 66ᵉ anniversaire de l'indépendance de la Côte d'Ivoire ».
 * - Miniature en haut de la page d'accueil, DÉPLAÇABLE (glisser) sur tout l'écran, FERMABLE.
 * - Au survol : agrandissement + feux d'artifice (voir keyframes .indep-particle dans globals.css).
 * - Affichée pendant ~1 mois puis disparaît automatiquement (date de fin ci-dessous).
 * Image : public/independence-ci-66.webp (repli sur le SVG si absente).
 */
const END = new Date("2026-08-24T23:59:59"); // fin d'affichage (≈ 1 mois)
const LS_KEY = "indep-ci-66-closed";
const FW_COLORS = ["#ff7900", "#ffffff", "#009e60", "#f7c948"];

function Fireworks() {
  const bursts = [
    { left: "6%", top: "4%", delay: "0s" },
    { left: "88%", top: "12%", delay: ".4s" },
    { left: "48%", top: "-6%", delay: ".8s" },
    { left: "20%", top: "92%", delay: ".6s" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-visible" aria-hidden="true">
      {bursts.map((b, bi) => (
        <span key={bi} className="absolute" style={{ left: b.left, top: b.top }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="indep-particle"
              style={{
                ["--a" as string]: `${i * 30}deg`,
                ["--d" as string]: "30px",
                background: FW_COLORS[i % FW_COLORS.length],
                animationDelay: b.delay,
              }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

export function IndependenceBanner() {
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let closed = false;
    try { closed = localStorage.getItem(LS_KEY) === "1"; } catch { /* ignore */ }
    if (!closed && Date.now() <= END.getTime()) setVisible(true);
  }, []);

  const handleMove = useCallback((e: PointerEvent) => {
    const el = wrapRef.current;
    const w = el?.offsetWidth ?? 90;
    const h = el?.offsetHeight ?? 135;
    const x = Math.min(Math.max(0, e.clientX - offset.current.x), window.innerWidth - w);
    const y = Math.min(Math.max(0, e.clientY - offset.current.y), window.innerHeight - h);
    setPos({ x, y });
  }, []);

  const handleUp = useCallback(() => {
    setDragging(false);
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleUp);
  }, [handleMove]);

  const handleDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return; // ne pas glisser via le bouton « fermer »
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);
    setHover(false);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }, [handleMove, handleUp]);

  useEffect(() => () => {
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", handleUp);
  }, [handleMove, handleUp]);

  const close = () => {
    setVisible(false);
    try { localStorage.setItem(LS_KEY, "1"); } catch { /* ignore */ }
  };

  if (!visible) return null;

  const wrapStyle: CSSProperties = pos
    ? { top: pos.y, left: pos.x }
    : { top: 12, left: "50%", transform: "translateX(-50%)" };

  return (
    <div
      ref={wrapRef}
      onPointerDown={handleDown}
      onMouseEnter={() => !dragging && setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fixed z-[60] w-[88px] touch-none select-none"
      style={{ ...wrapStyle, cursor: dragging ? "grabbing" : "grab" }}
      role="dialog"
      aria-label="66e anniversaire de l'indépendance de la Côte d'Ivoire"
    >
      <div
        className="relative origin-top rounded-lg shadow-2xl ring-2 ring-[#f7c948]/80"
        style={{
          transform: hover && !dragging ? "scale(2.55)" : "scale(1)",
          transformOrigin: "top center",
          transition: "transform .35s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        {hover && !dragging && <Fireworks />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/independence-ci-66.webp"
          onError={(e) => {
            const t = e.currentTarget;
            if (!t.dataset.fb) { t.dataset.fb = "1"; t.src = "/independence-ci-66.svg"; }
          }}
          alt="66e anniversaire de l'indépendance de la Côte d'Ivoire — 7 août 1960 – 7 août 2026"
          draggable={false}
          className="block aspect-[2/3] w-full rounded-lg object-cover"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute -right-2 -top-2 z-20 inline-flex size-6 items-center justify-center rounded-full bg-black/70 text-white shadow-md transition hover:bg-black"
        >
          <X className="size-3.5" />
        </button>
      </div>
      {!pos && !hover && (
        <p className="mt-1 text-center text-[9px] font-semibold text-[#f7c948] drop-shadow">Glissez-moi ✦ Survolez</p>
      )}
    </div>
  );
}
