"use client";

import * as React from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm({ defaultSubject = "Demande de démonstration" }: { defaultSubject?: string }) {
  const [sent, setSent] = React.useState(false);

  if (sent) {
    return (
      <Card className="flex flex-col items-center p-10 text-center">
        <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-available-soft text-available-fg">
          <CheckCircle2 className="size-7" />
        </span>
        <h3 className="text-xl font-bold text-foreground">Merci, votre message est bien parti&nbsp;!</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          L'équipe EduWeb Booking vous recontacte très vite. En attendant, vous pouvez explorer la
          plateforme avec les comptes de démonstration.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" required>Nom complet</Label>
            <Input id="name" name="name" placeholder="Ex. Koffi Yao" required />
          </div>
          <div>
            <Label htmlFor="org">Organisation</Label>
            <Input id="org" name="org" placeholder="Ex. ENS d'Abidjan" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email" required>E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="vous@organisation.ci" required />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" placeholder="+225 ..." />
          </div>
        </div>
        <div>
          <Label htmlFor="subject">Sujet</Label>
          <Select id="subject" name="subject" defaultValue={defaultSubject}>
            <option>Demande de démonstration</option>
            <option>Inscrire une organisation</option>
            <option>Question commerciale</option>
            <option>Support technique</option>
            <option>Autre</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="message" required>Message</Label>
          <Textarea id="message" name="message" rows={5} placeholder="Décrivez votre besoin (types de ressources, nombre d'utilisateurs, etc.)" required />
        </div>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Send className="size-4" /> Envoyer le message
        </Button>
      </form>
    </Card>
  );
}
