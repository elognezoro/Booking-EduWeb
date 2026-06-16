import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { CheckCircle2, ShieldCheck, CalendarCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panneau marque */}
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
            {[
              { icon: CalendarCheck, t: "Calendrier & disponibilités en temps réel" },
              { icon: ShieldCheck, t: "Rôles et permissions adaptés à chaque usager" },
              { icon: CheckCircle2, t: "Validations rapides, zéro double réservation" },
            ].map((f) => (
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

      {/* Panneau formulaire */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <BrandLogo />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
