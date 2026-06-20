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
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <>
      <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled || open ? "border-b border-border bg-background/95 backdrop-blur-xl" : "bg-transparent"
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
      </header>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[60] animate-fade-in bg-background md:hidden">
          <div className="section flex h-full flex-col py-6 pb-safe">
            <nav className="flex flex-col">
              {NAV.map((item, i) => {
                const isCurrent = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className={cn(
                      "animate-slide-up flex items-center justify-between border-b border-border/70 py-4 text-lg font-bold",
                      isCurrent ? "text-primary" : "text-foreground",
                    )}
                  >
                    {item.label}
                    <span aria-hidden className="text-muted-foreground">›</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto flex flex-col gap-2.5">
              <Button asChild size="lg" variant="outline">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <LogIn className="size-4" /> Connexion
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/demo" onClick={() => setOpen(false)}>
                  Demander une démo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
