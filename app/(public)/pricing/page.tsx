import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tarifs" };

const PLANS = [
  {
    name: "Pilote",
    price: "Offert",
    period: "phase pilote",
    desc: "Pour démarrer avec une unité comme la Sous-Direction APRID.",
    features: ["1 organisation", "Jusqu'à 200 utilisateurs", "Ressources illimitées", "Calendrier & validations", "Notifications e-mail", "Statistiques de base"],
    cta: "Démarrer",
    highlight: false,
  },
  {
    name: "Standard",
    price: "Sur devis",
    period: "par organisation",
    desc: "Pour les établissements et directions de taille moyenne.",
    features: ["Sites & services multiples", "Workflows hiérarchiques", "Rapports CSV & PDF", "Incidents & maintenance", "Export de données", "Support prioritaire"],
    cta: "Demander un devis",
    highlight: true,
  },
  {
    name: "National",
    price: "Sur mesure",
    period: "multi-organisations",
    desc: "Supervision nationale et déploiement à grande échelle.",
    features: ["Multi-organisations", "WhatsApp & SMS", "Mobile Money", "API publique", "Supervision nationale", "IA de recommandation"],
    cta: "Nous contacter",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="section py-16 text-center">
        <Badge tone="available" className="mb-4">Tarifs</Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Une formule pour chaque organisation
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Commencez gratuitement avec le pilote, évoluez par abonnement vers une solution nationale.
        </p>
      </section>
      <section className="section pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <Card
              key={p.name}
              className={cn("relative flex flex-col p-7", p.highlight && "border-primary shadow-glow ring-1 ring-primary")}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Le plus choisi
                </span>
              )}
              <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-foreground">{p.price}</span>
                <span className="text-sm text-muted-foreground">/ {p.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-foreground">
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-available-soft text-available-fg">
                      <Check className="size-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-7" variant={p.highlight ? "default" : "outline"}>
                <Link href="/contact">{p.cta} <ArrowRight className="size-4" /></Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
