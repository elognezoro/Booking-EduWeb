import Link from "next/link";
import {
  Brain, Grid3x3, Type, Network, Puzzle, ScanSearch, Calculator, GraduationCap, Bot,
  Sparkles, ArrowRight, Gamepad2, Volume2, Clock, Target, Dumbbell, Flame, Lock, Swords,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Consigne } from "@/components/games/consigne";
import { LEVELS } from "@/lib/games/catalog";
import { getEffectiveGames } from "@/lib/games/config";
import { getDailyChallenge } from "@/lib/games/daily";
import { getGamesGate } from "@/lib/games/access";
import { JoinByCode } from "@/components/competitions/join-by-code";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sport cérébral — EduWeb Booking" };

const ICONS: Record<string, typeof Brain> = { Grid3x3, Brain, Type, Network, Puzzle, ScanSearch, Calculator, GraduationCap, Bot };

export default async function SportCerebralPage() {
  const daily = getDailyChallenge();
  const games = await getEffectiveGames();
  // Verrouillage par abonnement (réglages plateforme) : sélection limitée pour les non-abonnés.
  const { openAll, freeSet } = await getGamesGate();
  const isLocked = (slug: string) => !openAll && !freeSet.has(slug);
  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative isolate -mt-16 overflow-hidden bg-primary text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid-soft bg-[size:34px_34px] opacity-15" />
        <div className="section flex flex-col items-center py-20 pt-32 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur">
            <Sparkles className="size-4" /> Sport cérébral
          </span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Entraînez votre <span className="italic text-[#F0E2C0]">esprit</span> comme vous entraînez votre corps.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            Une banque de jeux de réflexion classés par catégorie, chacun avec trois niveaux — Débutant, Intermédiaire, Avancé.
            Les consignes sont disponibles en texte <span className="font-semibold text-white">et en audio</span>.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">
            <Volume2 className="size-3.5" /> Touchez « Écouter » pour entendre la consigne de chaque jeu.
          </p>
        </div>
      </section>

      {/* ===================== CHAPEAU INTRODUCTIF ===================== */}
      <section className="section py-12">
        <div className="mx-auto max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
          <p className="flex items-start gap-2">
            <Dumbbell className="mt-1 size-5 shrink-0 text-primary" />
            <span>
              Les progrès technologiques ont profondément transformé notre manière de vivre. De nombreux efforts autrefois
              indispensables sont aujourd'hui facilités par les machines et les outils numériques. Comme le sport physique
              entretient le corps lorsque l'effort musculaire diminue, le <strong className="text-foreground">sport cérébral</strong> entretient l'esprit.
            </span>
          </p>
          <p>
            À l'ère de l'intelligence artificielle, beaucoup de tâches de réflexion, de calcul, d'analyse ou de rédaction
            peuvent être assistées, voire automatisées. Cette avancée est précieuse, mais elle nous invite à préserver notre
            capacité personnelle à <strong className="text-foreground">penser, chercher, comparer, déduire et résoudre</strong>.
          </p>
          <p>
            Ici, chaque jeu devient un exercice d'entretien de l'esprit. Sudoku, logigrammes, mots croisés, énigmes et jeux de
            logique ne sont pas de simples divertissements : ce sont de véritables séances d'entraînement cérébral, pour
            apprendre à raisonner, à persévérer et à garder l'esprit actif.
          </p>
        </div>
      </section>

      {/* ===================== DÉFI DU JOUR ===================== */}
      <section className="section pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary-50/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Flame className="size-6" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Défi du jour</p>
              <p className="font-bold text-foreground">{daily.title} · niveau {daily.levelLabel}</p>
            </div>
          </div>
          <Button asChild><Link href={daily.href}>Relever le défi <ArrowRight className="size-4" /></Link></Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-advanced/20 bg-advanced-soft/40 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced text-white"><Swords className="size-6" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-advanced-fg">Compétition</p>
              <p className="text-sm text-foreground">Vous avez un code de session ? Rejoignez une compétition organisée.</p>
            </div>
          </div>
          <JoinByCode />
        </div>
      </section>

      {/* ===================== ACCÈS DÉCOUVERTE (sans abonnement) ===================== */}
      {!openAll && (
        <section className="section pb-2">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-pending/30 bg-pending-soft/50 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-pending text-white"><Lock className="size-6" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-pending-fg">Accès découverte</p>
                <p className="max-w-xl text-sm text-foreground">
                  Vous accédez à une sélection de jeux. La collection complète et tous les niveaux sont réservés aux établissements abonnés à EduWeb Booking.
                </p>
              </div>
            </div>
            <Button asChild><Link href="/pricing">Voir les formules <ArrowRight className="size-4" /></Link></Button>
          </div>
        </section>
      )}

      {/* ===================== BANQUE DE JEUX ===================== */}
      <section className="section pb-16">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-foreground">La banque de jeux</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {games.map((g) => {
            const Icon = ICONS[g.icon] ?? Gamepad2;
            const locked = isLocked(g.slug);
            const open = g.playable && g.href && !locked;
            return (
              <Card key={g.slug} className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${g.color}14`, color: g.color }}>
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{g.title}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">{g.short}</p>
                    </div>
                  </div>
                  <Badge tone={locked ? "pending" : g.playable ? "info" : "neutral"}>
                    {locked ? (<><Lock className="mr-1 inline size-3" />Abonnement</>) : g.playable ? g.category : "Bientôt"}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 font-medium text-muted-foreground"><Clock className="size-3.5" /> {g.duree}</span>
                  {g.skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 font-medium text-primary"><Target className="size-3" /> {s}</span>
                  ))}
                </div>

                <Consigne text={g.consigne} audioUrl={g.audioUrl} />

                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Niveau de difficulté</p>
                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map((l) =>
                      open ? (
                        <Button key={l.key} asChild size="sm" variant="outline">
                          <Link href={`${g.href}?niveau=${l.key}`}>{l.label}</Link>
                        </Button>
                      ) : (
                        <Button key={l.key} size="sm" variant="outline" disabled>{l.label}</Button>
                      )
                    )}
                  </div>
                </div>

                {open ? (
                  <Button asChild className="mt-auto w-full">
                    <Link href={g.href!}>Commencer <ArrowRight className="size-4" /></Link>
                  </Button>
                ) : locked ? (
                  <Link href="/pricing" className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-pending-soft px-3 py-2 text-center text-xs font-semibold text-pending-fg transition-colors hover:bg-pending-soft/70">
                    <Lock className="size-3.5" /> Disponible avec l'abonnement EduWeb Booking
                  </Link>
                ) : (
                  <p className="mt-auto rounded-lg bg-secondary/60 px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                    Bientôt disponible — consigne déjà accessible (texte &amp; audio).
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
