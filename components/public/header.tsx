"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/features", label: "Fonctionnalités" },
  { href: "/institutions", label: "Institutions" },
  { href: "/sport-cerebral", label: "Sport cérébral" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // En-tête transparent par-dessus le hero foncé de l'accueil → texte en blanc.
  const overHero = pathname === "/" && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all",
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="section flex h-16 items-center justify-between">
        <Link href="/" className="focus-ring rounded-lg">
          <BrandLogo theme={overHero ? "dark" : "light"} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                overHero
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm" className={cn(overHero && "text-white hover:bg-white/15 hover:text-white")}>
            <Link href="/login">
              <LogIn className="size-4" /> Connexion
            </Link>
          </Button>
          <Button asChild size="sm" className={cn(overHero && "bg-white text-primary hover:bg-white/90")}>
            <Link href="/demo">Demander une démo</Link>
          </Button>
        </div>

        <button
          className={cn(
            "focus-ring inline-flex size-10 items-center justify-center rounded-xl md:hidden",
            overHero ? "text-white" : "text-foreground"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="section flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <LogIn className="size-4" /> Connexion
                </Link>
              </Button>
              <Button asChild>
                <Link href="/demo" onClick={() => setOpen(false)}>
                  Demander une démo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
