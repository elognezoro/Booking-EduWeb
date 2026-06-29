import Link from "next/link";
import { GraduationCap, ArrowLeft, LibraryBig } from "lucide-react";
import { requireLms } from "@/lib/lms";

export const dynamic = "force-dynamic";

/** Coquille de l'espace de formation (LMS) — distincte d'EduWeb Booking (accent violet). */
export default async function FormationLayout({ children }: { children: React.ReactNode }) {
  const access = await requireLms();
  return (
    <div className="formation-scope min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/formation" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-advanced text-white"><GraduationCap className="size-5" /></span>
            EduWeb<span className="text-advanced-fg">Formation</span>
          </Link>
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/formation" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-muted-foreground hover:bg-secondary"><LibraryBig className="size-4" /> Cours</Link>
            <span className="hidden px-2 text-xs font-medium text-muted-foreground sm:inline">{access.fullName}</span>
            <Link href="/dashboard" className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary" title="Retour à EduWeb Booking">
              <ArrowLeft className="size-3.5" /> EduWeb Booking
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
