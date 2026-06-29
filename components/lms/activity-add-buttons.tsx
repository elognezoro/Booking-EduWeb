"use client";

import * as React from "react";
import { FilePlus, Link2, ListChecks, ClipboardList, MessageSquare, NotebookText, ClipboardCheck, Shapes } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { createActivity } from "@/app/actions/lms";

/** Boutons d'ajout de contenu : Page, Média (URL), Quiz, Devoir, Forum, Wiki ou Atelier. */
export function ActivityAddButtons({ sectionId }: { sectionId: string }) {
  const [modal, setModal] = React.useState<null | "PAGE" | "URL" | "QUIZ" | "DEVOIR" | "FORUM" | "WIKI" | "WORKSHOP" | "GEOGEBRA">(null);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setModal("PAGE")}><FilePlus className="size-4" /> Page</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setModal("URL")}><Link2 className="size-4" /> Média (URL)</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setModal("QUIZ")}><ListChecks className="size-4" /> Quiz</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setModal("DEVOIR")}><ClipboardList className="size-4" /> Devoir</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setModal("FORUM")}><MessageSquare className="size-4" /> Forum</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setModal("WIKI")}><NotebookText className="size-4" /> Wiki</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setModal("WORKSHOP")}><ClipboardCheck className="size-4" /> Atelier</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setModal("GEOGEBRA")}><Shapes className="size-4" /> GeoGebra</Button>
      </div>

      <Modal open={modal === "GEOGEBRA"} onClose={() => setModal(null)} title="Nouvel applet GeoGebra" description="Intégrez un applet interactif depuis geogebra.org (géométrie, fonctions…).">
        <form action={createActivity} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="type" value="GEOGEBRA" />
          <div><Label htmlFor="gg-title" required>Titre</Label><Input id="gg-title" name="title" required placeholder="Ex. Cercle trigonométrique" /></div>
          <div><Label htmlFor="gg-url" required>Identifiant ou URL GeoGebra</Label><Input id="gg-url" name="externalUrl" required placeholder="Ex. abcd1234 ou https://www.geogebra.org/m/abcd1234" /></div>
          <div><Label htmlFor="gg-intro">Consigne (facultatif)</Label><Textarea id="gg-intro" name="intro" rows={2} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><SubmitButton pendingLabel="Création…">Intégrer</SubmitButton></div>
        </form>
      </Modal>

      <Modal open={modal === "WORKSHOP"} onClose={() => setModal(null)} title="Nouvel atelier (évaluation par les pairs)" description="Les apprenants remettent un travail, puis évaluent ceux de leurs pairs selon des critères.">
        <form action={createActivity} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="type" value="WORKSHOP" />
          <div><Label htmlFor="at-title" required>Titre de l'atelier</Label><Input id="at-title" name="title" required placeholder="Ex. Atelier d'écriture" /></div>
          <div><Label htmlFor="at-intro">Présentation (facultatif)</Label><Textarea id="at-intro" name="intro" rows={2} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><SubmitButton pendingLabel="Création…">Créer l'atelier</SubmitButton></div>
        </form>
      </Modal>

      <Modal open={modal === "WIKI"} onClose={() => setModal(null)} title="Nouveau wiki" description="Un espace de pages éditables collaborativement (une page d'accueil est créée automatiquement).">
        <form action={createActivity} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="type" value="WIKI" />
          <div><Label htmlFor="wi-title" required>Titre du wiki</Label><Input id="wi-title" name="title" required placeholder="Ex. Wiki du cours" /></div>
          <div><Label htmlFor="wi-intro">Consigne (facultatif)</Label><Textarea id="wi-intro" name="intro" rows={2} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><SubmitButton pendingLabel="Création…">Créer le wiki</SubmitButton></div>
        </form>
      </Modal>

      <Modal open={modal === "FORUM"} onClose={() => setModal(null)} title="Nouveau forum" description="Créez le forum, puis les apprenants pourront y ouvrir des discussions.">
        <form action={createActivity} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="type" value="FORUM" />
          <div><Label htmlFor="fo-title" required>Titre du forum</Label><Input id="fo-title" name="title" required placeholder="Ex. Forum des questions" /></div>
          <div><Label htmlFor="fo-intro">Consigne (facultatif)</Label><Textarea id="fo-intro" name="intro" rows={2} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><SubmitButton pendingLabel="Création…">Créer le forum</SubmitButton></div>
        </form>
      </Modal>

      <Modal open={modal === "DEVOIR"} onClose={() => setModal(null)} title="Nouveau devoir" description="Créez le devoir, puis réglez la remise (texte/fichier, date limite, note).">
        <form action={createActivity} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="type" value="DEVOIR" />
          <div><Label htmlFor="dv-title" required>Titre du devoir</Label><Input id="dv-title" name="title" required placeholder="Ex. Devoir 1 — Étude de cas" /></div>
          <div><Label htmlFor="dv-intro">Consigne (facultatif)</Label><Textarea id="dv-intro" name="intro" rows={2} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><SubmitButton pendingLabel="Création…">Créer le devoir</SubmitButton></div>
        </form>
      </Modal>

      <Modal open={modal === "QUIZ"} onClose={() => setModal(null)} title="Nouveau quiz" description="Créez le quiz, puis ajoutez-y des questions de la banque.">
        <form action={createActivity} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="type" value="QUIZ" />
          <div><Label htmlFor="qz-title" required>Titre du quiz</Label><Input id="qz-title" name="title" required placeholder="Ex. Évaluation — Module 1" /></div>
          <div><Label htmlFor="qz-intro">Consigne (facultatif)</Label><Textarea id="qz-intro" name="intro" rows={2} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><SubmitButton pendingLabel="Création…">Créer le quiz</SubmitButton></div>
        </form>
      </Modal>

      <Modal open={modal === "PAGE"} onClose={() => setModal(null)} title="Nouvelle page" description="Créez la page, puis rédigez son contenu.">
        <form action={createActivity} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="type" value="PAGE" />
          <div><Label htmlFor="pa-title" required>Titre de la page</Label><Input id="pa-title" name="title" required placeholder="Ex. Introduction au cours" /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><SubmitButton pendingLabel="Création…">Créer &amp; rédiger</SubmitButton></div>
        </form>
      </Modal>

      <Modal open={modal === "URL"} onClose={() => setModal(null)} title="Nouveau média (URL)" description="Image, vidéo (YouTube/Vimeo), audio, PDF ou lien externe.">
        <form action={createActivity} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="type" value="URL" />
          <div><Label htmlFor="u-title" required>Titre</Label><Input id="u-title" name="title" required placeholder="Ex. Vidéo de présentation" /></div>
          <div><Label htmlFor="u-url" required>Adresse (URL)</Label><Input id="u-url" name="externalUrl" type="url" required placeholder="https://…" /></div>
          <div><Label htmlFor="u-intro">Description (facultatif)</Label><Textarea id="u-intro" name="intro" rows={2} /></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setModal(null)}>Annuler</Button><SubmitButton pendingLabel="Ajout…">Ajouter</SubmitButton></div>
        </form>
      </Modal>
    </>
  );
}
