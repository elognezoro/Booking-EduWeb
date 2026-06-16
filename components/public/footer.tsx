import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { Mail, MapPin, Phone } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="section grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandLogo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            La plateforme intelligente de réservation des ressources pour les organisations modernes.
            Salles, matériels, véhicules, services et documents — centralisés et valorisés.
          </p>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Abidjan, Côte d'Ivoire</p>
            <p className="flex items-center gap-2"><Mail className="size-4 text-primary" /> info@eduweb.ci</p>
            <p className="flex items-center gap-2"><Phone className="size-4 text-primary" /> (+225) 07 0985 8042</p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">Produit</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-primary" href="/features">Fonctionnalités</Link></li>
            <li><Link className="hover:text-primary" href="/pricing">Tarifs</Link></li>
            <li><Link className="hover:text-primary" href="/demo">Demander une démo</Link></li>
            <li><Link className="hover:text-primary" href="/login">Connexion</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">Organisation</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link className="hover:text-primary" href="/contact">Nous contacter</Link></li>
            <li><Link className="hover:text-primary" href="/register-organization">Inscrire une organisation</Link></li>
            <li><span className="text-muted-foreground/70">Pilote : ENS d'Abidjan · APRID</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} EduWeb Booking. Tous droits réservés.</p>
          <p>Fait en Côte d'Ivoire 🇨🇮 — une solution nationale extensible.</p>
        </div>
      </div>
    </footer>
  );
}
