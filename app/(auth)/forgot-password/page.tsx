import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <Link href="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour à la connexion
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Mot de passe oublié</h1>
      <p className="mt-2 text-muted-foreground">
        Saisissez votre e-mail : nous vous enverrons un lien de réinitialisation.
      </p>

      <form className="mt-8 space-y-4" action="/login">
        <div>
          <Label htmlFor="email" required>Adresse e-mail</Label>
          <Input id="email" name="email" type="email" placeholder="vous@organisation.ci" required />
        </div>
        <Button type="submit" size="lg" className="w-full">
          <Mail className="size-4" /> Envoyer le lien
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        En démonstration, la réinitialisation est simulée. Utilisez les comptes de démo et le mot de
        passe <code className="font-mono font-bold text-primary">password123</code>.
      </p>
    </div>
  );
}
