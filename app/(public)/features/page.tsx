import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck, ShieldCheck, Bell, BarChart3, Boxes, Layers, Users, FileDown,
  QrCode, Wrench, Repeat, Building2, ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Fonctionnalités" };

const FEATURES = [
  { icon: Boxes, t: "Ressources configurables", d: "Catégories libres avec champs dynamiques : salles, matériels, véhicules, documents, services." },
  { icon: CalendarCheck, t: "Calendrier multi-vues", d: "Jour, semaine, mois, par ressource ou par service. Code couleur par statut." },
  { icon: ShieldCheck, t: "Rôles & permissions fines", d: "7 rôles prédéfinis, 24 permissions. L'interface masque ce qui n'est pas autorisé." },
  { icon: Layers, t: "Workflows de validation", d: "Automatique, simple, hiérarchique, multi-niveaux ou conditionnelle." },
  { icon: Bell, t: "Notifications e-mail", d: "Accusés de réception, validations, refus, rappels et alertes." },
  { icon: BarChart3, t: "Statistiques & KPI", d: "Taux d'occupation, ressources saturées, temps moyen de validation." },
  { icon: Users, t: "Multi-organisation", d: "Données isolées par organisation, sites et services hiérarchisés." },
  { icon: FileDown, t: "Rapports exportables", d: "Export CSV et PDF imprimable, par ressource, service ou période." },
  { icon: Wrench, t: "Incidents & maintenance", d: "Signalement d'incidents et blocage automatique pendant la maintenance." },
  { icon: QrCode, t: "QR code (V2)", d: "Un QR par ressource : disponibilité, réservation, présence, consignes." },
  { icon: Repeat, t: "Réservations récurrentes (V2)", d: "Cours hebdomadaires, réunions régulières, listes d'attente." },
  { icon: Building2, t: "Extensible & national", d: "Prête pour WhatsApp, Mobile Money et la supervision nationale." },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="section py-16 text-center">
        <Badge tone="advanced" className="mb-4">Fonctionnalités</Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Tout ce qu'il faut pour réserver intelligemment
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Une plateforme complète, du MVP aux modules avancés, pensée pour les organisations modernes.
        </p>
      </section>
      <section className="section pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.t} className="p-6 card-hover">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                <f.icon className="size-6" />
              </span>
              <h3 className="text-lg font-bold text-foreground">{f.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/login">Essayer la démo <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
