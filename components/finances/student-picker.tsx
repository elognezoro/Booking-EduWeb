"use client";

import * as React from "react";
import { Search, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { normalizeKey } from "@/lib/csv";

export interface StudentOption {
  fullName: string;
  matricule: string | null;
  department: string;
  section: string;
  demo: boolean;
}

/**
 * Sélecteur de payeur : champ de recherche rapide + liste déroulante d'étudiants,
 * filtrée en cascade par le Département et la Section/filière choisis dans le formulaire.
 * La saisie libre reste possible (payeur externe non répertorié).
 */
export function StudentPicker({
  students,
  department,
  section,
  value,
  onChange,
  onPick,
}: {
  students: StudentOption[];
  department: string;
  section: string;
  value: string;
  onChange: (v: string) => void;
  onPick: (s: StudentOption) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = React.useMemo(() => {
    const q = normalizeKey(value);
    return students
      .filter((s) => (!department || s.department === department) && (!section || s.section === section))
      .filter((s) => !q || normalizeKey(s.fullName).includes(q) || (s.matricule ? normalizeKey(s.matricule).includes(q) : false))
      .slice(0, 50);
  }, [students, department, section, value]);

  const pick = (s: StudentOption) => {
    onPick(s);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="thirdParty"
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => { closeTimer.current = setTimeout(() => setOpen(false), 150); }}
          placeholder="Rechercher un étudiant… (ou saisir un nom)"
          autoComplete="off"
          className="pl-9"
          aria-label="Payeur — recherche d'étudiant"
        />
      </div>

      {open && filtered.length > 0 && (
        <ul
          className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-soft"
          onMouseDown={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
        >
          {filtered.map((s, i) => (
            <li key={`${s.fullName}-${s.matricule ?? i}`}>
              <button
                type="button"
                onClick={() => pick(s)}
                className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-primary-50"
              >
                <GraduationCap className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground">
                    {s.fullName}
                    {s.demo && <span className="ml-1.5 rounded bg-pending-soft px-1.5 py-0.5 text-[10px] font-bold uppercase text-pending-fg">démo</span>}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {s.matricule ? `${s.matricule} · ` : ""}{s.section}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
