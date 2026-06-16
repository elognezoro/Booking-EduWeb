import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="section grid gap-10 py-16 lg:grid-cols-2">
      <div>
        <Badge tone="info" className="mb-4">Contact</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Parlons de votre projet</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Une question, un besoin spécifique, l'envie d'inscrire votre organisation ? Écrivez-nous,
          nous revenons vers vous rapidement.
        </p>
        <div className="mt-8 space-y-4">
          {[
            { icon: MapPin, t: "Adresse", d: "Abidjan, Côte d'Ivoire" },
            { icon: Mail, t: "E-mail", d: "info@eduweb.ci" },
            { icon: Phone, t: "Téléphone", d: "(+225) 07 0985 8042" },
            { icon: Clock, t: "Disponibilité", d: "Lun – Ven · 08h00 – 18h00" },
          ].map((c) => (
            <div key={c.t} className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary">
                <c.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{c.t}</p>
                <p className="text-sm text-muted-foreground">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ContactForm defaultSubject="Question commerciale" />
    </section>
  );
}
