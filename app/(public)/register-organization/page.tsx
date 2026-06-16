import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/public/contact-form";
import { Building2 } from "lucide-react";

export const metadata: Metadata = { title: "Inscrire une organisation" };

export default function RegisterOrganizationPage() {
  return (
    <section className="section grid gap-10 py-16 lg:grid-cols-2">
      <div>
        <Badge tone="available" className="mb-4"><Building2 className="size-3.5" /> Nouvelle organisation</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Inscrivez votre organisation</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          EduWeb Booking est une solution SaaS multi-organisation. Chaque structure dispose de ses
          propres sites, services, ressources, rôles et statistiques, isolés et sécurisés.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>• Configuration accompagnée de vos catégories et ressources</li>
          <li>• Import de vos utilisateurs et affectation des rôles</li>
          <li>• Charte graphique et terminologie personnalisables</li>
        </ul>
      </div>
      <ContactForm defaultSubject="Inscrire une organisation" />
    </section>
  );
}
