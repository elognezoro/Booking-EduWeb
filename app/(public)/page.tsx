import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  MonitorPlay,
  BookOpen,
  Projector,
  Car,
  Wrench,
  PartyPopper,
  ShieldCheck,
  BarChart3,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  MousePointerClick,
  FileSearch,
  CalendarRange,
  ThumbsUp,
  Building2,
  Brain,
  Grid3x3,
  Type,
  Puzzle,
  Headphones,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InstitutionPicker } from "@/components/public/institution-picker";
import { FloatingToc } from "@/components/ui/floating-toc";
import { CertelFloatingCta } from "@/components/certel/floating-cta";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const institutionsRaw = await prisma.organization.findMany({
    where: { isPlatform: false, status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { name: true, slug: true, acronym: true, city: true, primaryColor: true },
  });
  const institutions = institutionsRaw
    .filter((i): i is typeof i & { slug: string } => !!i.slug)
    .map((i) => ({ name: i.name, slug: i.slug, acronym: i.acronym, city: i.city, primaryColor: i.primaryColor }));

  return (
    <>
      {/* ===================== HERO (image plein cadre + dégradé vert) ===================== */}
      <section className="relative isolate -mt-16 overflow-hidden">
        {/* Image de fond — déposez l'image dans public/brand/eduweb-hero.png */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-primary bg-cover bg-center"
          style={{ backgroundImage: "url('/brand/eduweb-hero.png')" }}
        />
        {/* Dégradé vert par-dessus : identité de marque + lisibilité du texte */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/95 via-primary/85 to-primary-700/85" />

        <div className="section flex min-h-[88vh] flex-col items-center justify-center py-24 pt-32 text-center text-white">
          <span className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur">
            Réserver • Organiser • Optimiser
          </span>
          <h1 className="animate-fade-in-up max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Réservez, organisez et <span className="italic text-[#F0E2C0]">valorisez</span> toutes vos ressources.
          </h1>
          <p className="animate-fade-in-up mt-6 max-w-2xl text-lg text-white/85 [animation-delay:80ms]">
            EduWeb Booking centralise les réservations de salles, matériels, véhicules, services,
            documents et espaces — pour les institutions modernes de Côte d'Ivoire et au-delà.
          </p>
          <div className="animate-fade-in-up mt-9 flex flex-wrap items-center justify-center gap-3 [animation-delay:160ms]">
            <Button asChild size="lg" className="bg-white text-primary shadow-soft hover:bg-white/90">
              <Link href="#institutions">Accéder à mon institution <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
              <Link href="/register"><UserPlus className="size-4" /> Créer un compte</Link>
            </Button>
          </div>
          <div className="animate-fade-in-up mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/85 [animation-delay:240ms]">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4" /> Sans double réservation</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4" /> Rôles &amp; permissions</span>
            <span className="inline-flex items-center gap-1.5"><BarChart3 className="size-4" /> Statistiques en temps réel</span>
          </div>
        </div>
      </section>

      {/* ===================== ACCÈS INSTITUTIONS ===================== */}
      <section id="institutions" className="scroll-mt-20 bg-secondary/50 py-16">
        <div className="section">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="advanced" className="mb-3"><Building2 className="size-3.5" /> Espaces institutions</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Accédez à l'espace de votre institution</h2>
            <p className="mt-3 text-muted-foreground">
              Chaque institution dispose de son espace sécurisé et isolé. Recherchez la vôtre puis connectez-vous.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <InstitutionPicker institutions={institutions} />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Votre institution n'apparaît pas ?{" "}
              <Link href="/register-organization" className="font-semibold text-primary hover:underline">Inscrivez votre institution</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ===================== SPORT CÉRÉBRAL ===================== */}
      <section id="sport-cerebral" className="section scroll-mt-20 py-16">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-primary-600 to-primary-700 text-primary-foreground shadow-glow">
          <div className="grid items-center gap-8 p-8 lg:grid-cols-[1.15fr_1fr] lg:p-12">
            <div>
              <Badge className="mb-4 bg-white/15 text-white ring-0"><Brain className="size-3.5" /> Nouveau · Espace jeux</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Sport cérébral</h2>
              <p className="mt-1 text-lg font-semibold text-[#F0E2C0]">Entraînez votre esprit comme vous entraînez votre corps.</p>
              <p className="mt-3 max-w-lg text-primary-foreground/85">
                Les progrès technologiques facilitent notre quotidien, mais réduisent certains efforts naturels.
                À l'ère de l'intelligence artificielle, le sport cérébral devient essentiel : il nous aide à préserver
                notre capacité à <strong className="text-white">réfléchir, mémoriser, déduire, résoudre et persévérer</strong>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link href="/sport-cerebral">Entrer dans l'espace Sport cérébral <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Grid3x3, t: "Sudoku" },
                { icon: Brain, t: "Mémoire" },
                { icon: Puzzle, t: "Logique" },
                { icon: Headphones, t: "Consignes audio" },
              ].map((j) => (
                <div key={j.t} className="flex items-center gap-2.5 rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white/15"><j.icon className="size-5" /></span>
                  <span className="text-sm font-semibold">{j.t}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* ===================== PROBLÈMES RÉSOLUS ===================== */}
      <section id="problemes" className="section scroll-mt-20 py-16">
        <SectionTitle
          eyebrow="Fini le désordre"
          title="Les problèmes que nous résolvons"
          subtitle="Remplacez les cahiers physiques, les conflits de créneaux et le manque de visibilité par une plateforme claire et fiable."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: XCircle, tone: "unavailable" as const, t: "Conflits & doublons", d: "Deux demandes sur le même créneau ? Détection automatique des chevauchements." },
            { icon: BookOpen, tone: "pending" as const, t: "Cahiers physiques", d: "Plus de registres papier illisibles : tout est centralisé et traçable." },
            { icon: Clock, tone: "info" as const, t: "Validations lentes", d: "Workflows de validation clairs, du mobile, en quelques secondes." },
            { icon: BarChart3, tone: "advanced" as const, t: "Aucune statistique", d: "Taux d'occupation, ressources saturées, pilotage par les données." },
          ].map((p) => (
            <Card key={p.t} className="p-5 card-hover">
              <Badge tone={p.tone} className="mb-3 size-10 justify-center rounded-xl p-0">
                <p.icon className="size-5" />
              </Badge>
              <h3 className="font-bold text-foreground">{p.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================== RESSOURCES RÉSERVABLES ===================== */}
      <section id="ressources" className="scroll-mt-20 bg-secondary/50 py-16">
        <div className="section">
          <SectionTitle
            eyebrow="Une plateforme générique"
            title="Tout type de ressource réservable"
            subtitle="EduWeb Booking n'est pas limité aux salles. Réservez n'importe quelle ressource de votre organisation."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MonitorPlay, c: "#064B3A", t: "Salles & espaces", d: "Salles multimédias, amphithéâtres, salles de réunion." },
              { icon: BookOpen, c: "#6D5DF5", t: "Documentation", d: "Mémoires, annales, rapports, ouvrages empruntables." },
              { icon: Projector, c: "#F97316", t: "Matériels", d: "Vidéoprojecteurs, ordinateurs, caméras, équipements." },
              { icon: Car, c: "#172554", t: "Véhicules", d: "Véhicules administratifs, minibus, ordres de mission." },
              { icon: Wrench, c: "#22C55E", t: "Services", d: "Assistance, reprographie, rendez-vous, prestations." },
              { icon: PartyPopper, c: "#DC2626", t: "Événements", d: "Auditoriums, stands, terrains, expositions." },
            ].map((r) => (
              <Card key={r.t} className="flex items-start gap-4 p-5 card-hover">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${r.c}14`, color: r.c }}>
                  <r.icon className="size-6" />
                </span>
                <div>
                  <h3 className="font-bold text-foreground">{r.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.d}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FONCTIONNEMENT 4 ÉTAPES ===================== */}
      <section id="fonctionnement" className="section scroll-mt-20 py-16">
        <SectionTitle eyebrow="Simple & fluide" title="Comment ça marche ?" subtitle="Quatre étapes, du choix de la ressource à la confirmation." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { n: 1, icon: MousePointerClick, t: "Choisissez", d: "Sélectionnez une catégorie puis une ressource disponible." },
            { n: 2, icon: CalendarRange, t: "Planifiez", d: "Consultez le calendrier et réservez un créneau libre." },
            { n: 3, icon: FileSearch, t: "Faites valider", d: "Le responsable approuve ou refuse, vous êtes notifié." },
            { n: 4, icon: ThumbsUp, t: "Profitez", d: "Confirmez votre présence et évaluez l'usage." },
          ].map((s, i) => (
            <div key={s.n} className="relative">
              <Card className="h-full p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-base font-extrabold text-primary-foreground">{s.n}</span>
                  <s.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </Card>
              {i < 3 && <ArrowRight className="absolute -right-4 top-1/2 hidden size-5 -translate-y-1/2 text-border lg:block" />}
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PILOTE APRID ===================== */}
      <section id="pilote" className="section scroll-mt-20 py-16">
        <Card className="overflow-hidden border-0 bg-primary text-primary-foreground shadow-glow">
          <div className="grid items-center gap-8 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <Badge className="mb-4 bg-white/15 text-white ring-0">Premier déploiement</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight">ENS d'Abidjan — Sous-Direction APRID</h2>
              <p className="mt-3 max-w-lg text-primary-foreground/80">
                Le pilote démarre avec la réservation des salles multimédias et des matériels.
                Une base pensée pour s'étendre à toute organisation publique ou privée
                de Côte d'Ivoire.
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {["Réservation des salles multimédias (de 20 à 50 postes)", "Validation par les responsables de ressources", "Statistiques d'occupation et rapports exportables"].map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-available" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "9", l: "ressources pilotes" },
                { n: "7", l: "rôles configurés" },
                { n: "24", l: "permissions fines" },
                { n: "100%", l: "traçabilité" },
              ].map((k) => (
                <div key={k.l} className="rounded-2xl bg-white/10 p-5 text-center backdrop-blur">
                  <p className="text-3xl font-extrabold">{k.n}</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{k.l}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* ===================== FEATURES BAND ===================== */}
      <section id="fonctionnalites" className="scroll-mt-20 bg-secondary/50 py-16">
        <div className="section">
          <SectionTitle eyebrow="Tout-en-un" title="Pensé pour piloter au quotidien" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: CalendarCheck, t: "Calendrier intelligent", d: "Vues jour, semaine, mois. Couleurs par statut, détails au clic." },
              { icon: ShieldCheck, t: "Rôles & permissions", d: "Du super admin à l'usager : chacun voit ce qui le concerne." },
              { icon: Bell, t: "Notifications", d: "E-mail à chaque étape : demande, validation, refus, rappel." },
            ].map((f) => (
              <Card key={f.t} className="p-6 card-hover">
                <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                  <f.icon className="size-6" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{f.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/features">Voir toutes les fonctionnalités <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== CTA FINALE ===================== */}
      <section className="section py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-50 via-background to-accent px-6 py-14 text-center">
          <div className="pointer-events-none absolute inset-0 -z-0 bg-grid-soft bg-[size:32px_32px] opacity-40" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Prêt à moderniser la réservation de vos ressources ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Découvrez EduWeb Booking avec les comptes de démonstration ENS d'Abidjan / APRID.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/login">Essayer la démo <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Parler à l'équipe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TABLE DES MATIÈRES FLOTTANTE ===================== */}
      <FloatingToc
        items={[
          { id: "institutions", label: "Espaces institutions" },
          { id: "sport-cerebral", label: "Sport cérébral" },
          { id: "problemes", label: "Problèmes résolus" },
          { id: "ressources", label: "Ressources réservables" },
          { id: "fonctionnement", label: "Comment ça marche" },
          { id: "pilote", label: "Pilote ENS d'Abidjan" },
          { id: "fonctionnalites", label: "Fonctionnalités" },
        ]}
      />

      {/* ===================== BOUTON FLOTTANT — DIAGNOSTIC CERTEL ===================== */}
      <CertelFloatingCta />
    </>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
