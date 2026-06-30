"use client";

import { useEffect } from "react";

/**
 * Garantit le comportement « accordéon exclusif » des <details name="..."> même sur les
 * navigateurs qui n'implémentent pas encore l'attribut natif `name` (Chrome < 120, etc.) :
 * à l'ouverture d'un <details>, on ferme les autres du même groupe (même `name`).
 * Le repli/déroulé natif (clic sur le résumé) fonctionne partout ; ce script n'ajoute que
 * l'exclusivité. Aucun rendu visible (renvoie null).
 */
export function ExclusiveDetails() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLDetailsElement>("details[name]"));
    if (items.length === 0) return;
    const cleanups: Array<() => void> = [];
    for (const el of items) {
      const onToggle = () => {
        if (!el.open) return;
        const name = el.getAttribute("name");
        for (const other of items) {
          if (other !== el && other.open && other.getAttribute("name") === name) other.open = false;
        }
      };
      el.addEventListener("toggle", onToggle);
      cleanups.push(() => el.removeEventListener("toggle", onToggle));
    }
    return () => cleanups.forEach((fn) => fn());
  }, []);
  return null;
}
