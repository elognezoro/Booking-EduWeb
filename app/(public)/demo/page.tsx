import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/status-badges";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = { title: "Démo" };

// L'accès Super Administrateur (supervision plateforme) est réservé à l'Admin
// système et n'est pas proposé en démonstration publique.
const DEMO_ACCOUNTS = [
  { role: "ORG_ADMIN", email: "admin.aprid@ens.ci" },
  { role: "RESOURCE_MANAGER", email: "responsable.salles@ens.ci" },
  { role: "VALIDATOR", email: "validateur.aprid@ens.ci" },
  { role: "TECHNICIAN", email: "technicien.aprid@ens.ci" },
  { role: "REQUESTER", email: "enseignant.demo@ens.ci" },
];

export default function DemoPage() {
  return (
    <section className="section grid gap-10 py-16 lg:grid-cols-2">
      <div>
        <Badge tone="advanced" className="mb-4"><Sparkles className="size-3.5" /> Démonstration en ligne</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Testez EduWeb Booking</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Connectez-vous avec un compte de démonstration pour explorer chaque rôle et ses
          permissions. Le mot de passe est commun à tous les comptes.
        </p>

        <Card className="mt-8 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <KeyRound className="size-4 text-primary" /> Comptes de démonstration
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Mot de passe : <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs font-bold text-primary">password123</code>
          </p>
          <ul className="space-y-2">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2">
                <code className="font-mono text-sm text-foreground">{a.email}</code>
                <RoleBadge roleKey={a.role} />
              </li>
            ))}
          </ul>
          <Button asChild className="mt-5 w-full">
            <Link href="/login">Se connecter à la démo <ArrowRight className="size-4" /></Link>
          </Button>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-xl font-bold text-foreground">Préférez une démo guidée ?</h2>
        <p className="mb-5 text-sm text-muted-foreground">Laissez-nous vos coordonnées, nous organisons une présentation adaptée à votre organisation.</p>
        <ContactForm defaultSubject="Demande de démonstration" />
      </div>
    </section>
  );
}
