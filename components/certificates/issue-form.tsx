"use client";

import * as React from "react";
import { Award } from "lucide-react";
import { issueCertificate } from "@/app/actions/certificates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";

interface UserOpt {
  id: string;
  name: string;
  functionTitle?: string | null;
}

export function CertificateIssueForm({
  users,
  roleLabels,
  defaults,
}: {
  users: UserOpt[];
  roleLabels: string[];
  defaults: { title: string; mention: string };
}) {
  const [name, setName] = React.useState("");
  const [recipientUserId, setRecipientUserId] = React.useState("");

  const onPickUser = (id: string) => {
    setRecipientUserId(id);
    const u = users.find((x) => x.id === id);
    if (u) setName(u.name);
  };

  return (
    <form action={issueCertificate} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="recipientUserId" value={recipientUserId} readOnly />

      {users.length > 0 && (
        <div className="sm:col-span-2">
          <Label htmlFor="userPick">Bénéficiaire (compte existant — facultatif)</Label>
          <select
            id="userPick"
            value={recipientUserId}
            onChange={(e) => onPickUser(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="">— Saisie manuelle —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
                {u.functionTitle ? ` · ${u.functionTitle}` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="recipientName" required>
          Nom du bénéficiaire
        </Label>
        <Input id="recipientName" name="recipientName" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Prénom NOM" />
      </div>

      <div>
        <Label htmlFor="parcours">Parcours / rôle suivi</Label>
        <Input id="parcours" name="parcours" list="role-parcours" placeholder="ex. Utilisateur demandeur" />
        <datalist id="role-parcours">
          {roleLabels.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </div>

      <div>
        <Label htmlFor="title">Intitulé du certificat</Label>
        <Input id="title" name="title" defaultValue={defaults.title} />
      </div>

      <div>
        <Label htmlFor="hours">Durée de la formation</Label>
        <Input id="hours" name="hours" placeholder="ex. 3 h 30 / 1 journée" />
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="mention">Mention</Label>
        <textarea
          id="mention"
          name="mention"
          rows={3}
          defaultValue={defaults.mention}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm leading-relaxed"
        />
        <p className="mt-1 text-xs text-muted-foreground">Texte personnalisable. Le numéro du certificat est attribué automatiquement (séquence propre à l'établissement).</p>
      </div>

      <div className="sm:col-span-2">
        <SubmitButton pendingLabel="Émission en cours…">
          <Award className="size-4" /> Délivrer le certificat
        </SubmitButton>
      </div>
    </form>
  );
}
