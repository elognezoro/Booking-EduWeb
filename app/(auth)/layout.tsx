import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { CheckCircle2, ShieldCheck, CalendarCheck } from "lucide-react";

const FEATURES = [
  { icon: CalendarCheck, t: "Calendrier & disponibilités en temps réel", short: "Temps réel" },
  { icon: ShieldCheck, t: "Rôles et permissions adaptés à chaque usager", short: "Rôles & accès" },
  { icon: CheckCircle2, t: "Validations rapides, zéro double réservation", short: "Validation rapide" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-primary lg:grid lg:grid-cols-2 lg:bg-background">
      {/* ───────── Panneau marque — DESKTOP ───────── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid-soft bg-[size:32px_32px] opacity-[0.12]" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-available/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-advanced/20 blur-3xl" />

        <Link href="/" className="relative z-10">
          <BrandLogo theme="dark" />
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight">
            La réservation intelligente de vos ressources, enfin centralisée.
          </h2>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((f) => (
              <li key={f.t} className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10">
                  <f.icon className="size-5" />
                </span>
                <span className="text-primary-foreground/90">{f.t}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-primary-foreground/70">
          EduWeb Booking — plateforme intelligente de réservation des ressources.
        </p>
      </div>

      {/* ───────── En-tête marque — MOBILE (hero compact) ───────── */}
      <div className="relative overflow-hidden px-6 pb-12 pt-12 text-primary-foreground lg:hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-soft bg-[size:28px_28px] opacity-[0.12]" />
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-available/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 top-10 size-56 rounded-full bg-advanced/25 blur-3xl" />
        <div className="relative z-10">
          <Link href="/">
            <BrandLogo theme="dark" />
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold leading-tight">
            La réservation intelligente de vos ressources.
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <span key={f.t} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-primary-foreground/90 backdrop-blur">
                <f.icon className="size-3.5" /> {f.short}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── Panneau formulaire (feuille blanche app sur mobile) ───────── */}
      <div className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-[28px] bg-background px-5 pb-10 pt-8 shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.25)] lg:mt-0 lg:items-center lg:justify-center lg:rounded-none lg:px-10 lg:shadow-none">
        {/* poignée façon bottom-sheet (mobile) */}
        <div className="mx-auto mb-6 h-1.5 w-10 rounded-full bg-border lg:hidden" />
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
