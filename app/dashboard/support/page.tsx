import { LifeBuoy, Mail, Phone, MessageSquare, BookOpen } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const FAQ = [
  { q: "Comment réserver une ressource ?", a: "Cliquez sur « Nouvelle réservation », choisissez une catégorie puis une ressource, sélectionnez un créneau et soumettez votre demande." },
  { q: "Pourquoi ma demande est-elle « en attente » ?", a: "Certaines ressources nécessitent la validation d'un responsable. Vous serez notifié par e-mail dès qu'une décision est prise." },
  { q: "Puis-je annuler une réservation ?", a: "Oui, depuis le détail de la réservation tant qu'elle n'a pas eu lieu, via le bouton « Annuler la réservation »." },
  { q: "Que signifient les couleurs ?", a: "Vert = disponible/validé, Orange = en attente, Rouge = indisponible/refusé, Violet = en cours ou module avancé." },
  { q: "Comment confirmer ma présence ?", a: "Une fois la réservation validée et le créneau arrivé, utilisez le bouton « Je suis arrivé » puis « Activité terminée »." },
];

export default async function SupportPage() {
  await requireUser();
  return (
    <div className="space-y-5">
      <PageHeader
        title="Support"
        description="Une question ? Nous sommes là pour vous aider."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><LifeBuoy className="size-6" /></span>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Mail, t: "E-mail", d: "support@eduweb.ci", href: "mailto:support@eduweb.ci" },
          { icon: Phone, t: "Téléphone", d: "(+225) 07 0985 8042", href: "tel:+2250709858042" },
          { icon: BookOpen, t: "Centre d'aide", d: "Guides & tutoriels", href: "/dashboard/help" },
        ].map((c) => (
          <Card key={c.t} className="card-hover">
            <CardContent className="flex items-center gap-3 py-5">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary"><c.icon className="size-5" /></span>
              <div className="min-w-0">
                <p className="font-bold text-foreground">{c.t}</p>
                <Link href={c.href} className="truncate text-sm text-primary hover:underline">{c.d}</Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="size-5 text-primary" /> Questions fréquentes</CardTitle></CardHeader>
        <CardContent className="divide-y divide-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-foreground marker:content-['']">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <h3 className="text-xl font-bold">Besoin d'une assistance personnalisée ?</h3>
          <p className="max-w-md text-primary-foreground/80">Notre équipe vous accompagne dans la configuration et l'usage d'EduWeb Booking.</p>
          <Button asChild variant="white"><a href="mailto:support@eduweb.ci">Contacter le support</a></Button>
        </CardContent>
      </Card>
    </div>
  );
}
