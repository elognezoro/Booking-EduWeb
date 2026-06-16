"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  Check, ChevronLeft, ChevronRight, Loader2, Send, AlertTriangle, FileUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { createDeposit, type DepositState } from "@/app/actions/library";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, ACCESS_LEVELS, ACCESS_LEVEL_META, DOCUMENT_LANGUAGES } from "@/lib/library/enums";
import { cn, formatGivenName } from "@/lib/utils";

interface Option { id: string; name: string; code?: string }

const STEPS = ["Type", "Métadonnées", "Auteurs", "Résumé", "Fichier", "Droits", "Vérification"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
      Soumettre le dépôt
    </Button>
  );
}

export function DepositWizard({ collections, domains }: { collections: Option[]; domains: Option[] }) {
  const [state, formAction] = useFormState<DepositState, FormData>(createDeposit, {});
  const [step, setStep] = React.useState(0);

  const [documentType, setDocumentType] = React.useState("MEM");
  const [collectionId, setCollectionId] = React.useState(collections[0]?.id ?? "");
  const [domainId, setDomainId] = React.useState(domains[0]?.id ?? "");
  const [title, setTitle] = React.useState("");
  const [year, setYear] = React.useState(String(new Date().getFullYear()));
  const [language, setLanguage] = React.useState("Français");
  const [level, setLevel] = React.useState("");
  const [pageCount, setPageCount] = React.useState("");
  const [mainAuthorName, setMainAuthorName] = React.useState("");
  const [coAuthors, setCoAuthors] = React.useState("");
  const [supervisorName, setSupervisorName] = React.useState("");
  const [abstract, setAbstract] = React.useState("");
  const [keywords, setKeywords] = React.useState("");
  const [accessLevel, setAccessLevel] = React.useState("INTERNAL");
  const [downloadAllowed, setDownloadAllowed] = React.useState(true);
  const [physicalCopyCount, setPhysicalCopyCount] = React.useState("0");
  const [downloadPrice, setDownloadPrice] = React.useState("0");
  const [doi, setDoi] = React.useState("");
  const [journalName, setJournalName] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const isArticle = documentType === "ART";

  const canNext = () => {
    if (step === 0) return !!documentType && !!collectionId && !!domainId;
    if (step === 1) return title.trim().length >= 3;
    if (step === 2) return mainAuthorName.trim().length >= 2;
    return true;
  };

  const show = (n: number) => (step === n ? "" : "hidden");

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        {/* Stepper */}
        <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button type="button" onClick={() => i < step && setStep(i)}
                className={cn("flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                  i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary-50 text-primary" : "bg-muted text-muted-foreground")}>
                <span className={cn("inline-flex size-5 items-center justify-center rounded-full text-[11px]", i === step ? "bg-white/20" : i < step ? "bg-primary text-white" : "bg-background")}>
                  {i < step ? <Check className="size-3" /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-3 shrink-0 bg-border" />}
            </React.Fragment>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4 py-6">
            {/* Étape 1 — Type */}
            <div className={cn("space-y-4", show(0))}>
              <h3 className="text-lg font-bold text-foreground">Type de document</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {DOCUMENT_TYPES.map((t) => (
                  <button key={t} type="button" onClick={() => setDocumentType(t)}
                    className={cn("rounded-xl border px-3 py-2 text-sm font-semibold transition", documentType === t ? "border-primary bg-primary-50 text-primary" : "border-border hover:border-primary/40")}>
                    {DOCUMENT_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="col" required>Collection</Label>
                  <Select id="col" value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
                    {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dom" required>Domaine</Label>
                  <Select id="dom" value={domainId} onChange={(e) => setDomainId(e.target.value)}>
                    {domains.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </Select>
                </div>
              </div>
            </div>

            {/* Étape 2 — Métadonnées */}
            <div className={cn("space-y-4", show(1))}>
              <h3 className="text-lg font-bold text-foreground">Métadonnées principales</h3>
              <div>
                <Label htmlFor="title" required>Titre</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre complet du document" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><Label htmlFor="year">Année</Label><Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} /></div>
                <div>
                  <Label htmlFor="lang">Langue</Label>
                  <Select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {DOCUMENT_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </Select>
                </div>
                <div><Label htmlFor="pages">Pages</Label><Input id="pages" type="number" value={pageCount} onChange={(e) => setPageCount(e.target.value)} /></div>
              </div>
              <div><Label htmlFor="level">Niveau / diplôme (mémoire, thèse…)</Label><Input id="level" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Ex. Master, Doctorat" /></div>
            </div>

            {/* Étape 3 — Auteurs */}
            <div className={cn("space-y-4", show(2))}>
              <h3 className="text-lg font-bold text-foreground">Auteurs et contributeurs</h3>
              <div><Label htmlFor="author" required>Auteur principal</Label><Input id="author" value={mainAuthorName} onChange={(e) => setMainAuthorName(e.target.value)} onBlur={(e) => setMainAuthorName(formatGivenName(e.target.value))} placeholder="Prénom Nom" /></div>
              <div><Label htmlFor="co">Co-auteurs (séparés par des virgules)</Label><Input id="co" value={coAuthors} onChange={(e) => setCoAuthors(e.target.value)} onBlur={(e) => setCoAuthors(formatGivenName(e.target.value))} placeholder="Ex. A. Koné, B. Yao" /></div>
              <div><Label htmlFor="sup">Directeur / encadreur</Label><Input id="sup" value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} onBlur={(e) => setSupervisorName(formatGivenName(e.target.value))} placeholder="Nom du directeur de mémoire" /></div>
            </div>

            {/* Étape 4 — Résumé */}
            <div className={cn("space-y-4", show(3))}>
              <h3 className="text-lg font-bold text-foreground">Résumé et mots-clés</h3>
              <div><Label htmlFor="abstract">Résumé</Label><Textarea id="abstract" rows={6} value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Résumé du document…" /></div>
              <div><Label htmlFor="kw">Mots-clés (séparés par des virgules)</Label><Input id="kw" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Ex. TICE, pédagogie, évaluation" /></div>
            </div>

            {/* Étape 5 — Fichier */}
            <div className={cn("space-y-4", show(4))}>
              <h3 className="text-lg font-bold text-foreground">Fichier et références</h3>
              <FileDropzone
                name="file"
                accept=".pdf,.doc,.docx,.odt,.ppt,.pptx,.epub"
                title="Déposer un fichier (PDF recommandé)"
                hint="Glissez-déposez ou cliquez pour sélectionner — facultatif au dépôt"
                onFileName={setFileName}
              />
              {isArticle && (
                <div className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 text-sm font-semibold text-foreground">Références (article)</div>
                  <div><Label htmlFor="journal">Revue</Label><Input id="journal" value={journalName} onChange={(e) => setJournalName(e.target.value)} /></div>
                  <div><Label htmlFor="doi">DOI</Label><Input id="doi" value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="10.xxxx/xxxx" /></div>
                </div>
              )}
            </div>

            {/* Étape 6 — Droits */}
            <div className={cn("space-y-4", show(5))}>
              <h3 className="text-lg font-bold text-foreground">Droits d'accès</h3>
              <div>
                <Label htmlFor="access">Niveau d'accès</Label>
                <Select id="access" value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
                  {ACCESS_LEVELS.map((a) => <option key={a} value={a}>{ACCESS_LEVEL_META[a].label} — {ACCESS_LEVEL_META[a].description}</option>)}
                </Select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={downloadAllowed} onChange={(e) => setDownloadAllowed(e.target.checked)} className="size-4 rounded border-input text-primary focus:ring-ring" />
                <span className="text-sm font-medium text-foreground">Autoriser le téléchargement du fichier</span>
              </label>
              <div className="max-w-xs"><Label htmlFor="phys">Exemplaires physiques disponibles</Label><Input id="phys" type="number" min={0} value={physicalCopyCount} onChange={(e) => setPhysicalCopyCount(e.target.value)} /></div>
              <div className="max-w-xs">
                <Label htmlFor="price">Prix de téléchargement (FCFA)</Label>
                <Input id="price" type="number" min={0} step={100} value={downloadPrice} onChange={(e) => setDownloadPrice(e.target.value)} />
                <p className="mt-1 text-xs text-muted-foreground">0 = gratuit. Au-delà, le téléchargement est payant (le bibliothécaire et vous-même en êtes exemptés).</p>
              </div>
            </div>

            {/* Étape 7 — Vérification */}
            <div className={cn("space-y-4", show(6))}>
              <h3 className="text-lg font-bold text-foreground">Vérification</h3>
              <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
                <Row k="Type" v={DOCUMENT_TYPE_LABELS[documentType as keyof typeof DOCUMENT_TYPE_LABELS]} />
                <Row k="Titre" v={title || "—"} />
                <Row k="Auteur" v={mainAuthorName || "—"} />
                <Row k="Année" v={year} />
                <Row k="Accès" v={ACCESS_LEVEL_META[accessLevel as keyof typeof ACCESS_LEVEL_META].label} />
                <Row k="Fichier" v={fileName || "Aucun (à ajouter plus tard)"} />
              </div>
              <p className="flex items-center gap-2 rounded-xl bg-primary-50 p-3 text-sm text-primary-700">
                <FileUp className="size-4" /> Un code provisoire sera généré. Le code définitif est attribué à la validation.
              </p>
              {state.error && (
                <div className="flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
                  <AlertTriangle className="size-4 shrink-0" /> {state.error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Champs masqués reflétant l'état (soumis avec le formulaire) */}
        <input type="hidden" name="documentType" value={documentType} />
        <input type="hidden" name="collectionId" value={collectionId} />
        <input type="hidden" name="domainId" value={domainId} />
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="year" value={year} />
        <input type="hidden" name="language" value={language} />
        <input type="hidden" name="level" value={level} />
        <input type="hidden" name="pageCount" value={pageCount} />
        <input type="hidden" name="mainAuthorName" value={mainAuthorName} />
        <input type="hidden" name="coAuthors" value={coAuthors} />
        <input type="hidden" name="supervisorName" value={supervisorName} />
        <input type="hidden" name="abstract" value={abstract} />
        <input type="hidden" name="keywords" value={keywords} />
        <input type="hidden" name="accessLevel" value={accessLevel} />
        {downloadAllowed && <input type="hidden" name="downloadAllowed" value="on" />}
        <input type="hidden" name="downloadPrice" value={downloadPrice} />
        <input type="hidden" name="physicalCopyCount" value={physicalCopyCount} />
        <input type="hidden" name="doi" value={doi} />
        <input type="hidden" name="journalName" value={journalName} />

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ChevronLeft className="size-4" /> Précédent
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Continuer <ChevronRight className="size-4" />
            </Button>
          ) : (
            <SubmitButton />
          )}
        </div>
      </div>

      {/* Résumé latéral */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm font-bold text-foreground">Récapitulatif</p>
            <div className="mt-3 space-y-2 text-sm">
              <Row k="Type" v={DOCUMENT_TYPE_LABELS[documentType as keyof typeof DOCUMENT_TYPE_LABELS]} muted />
              <Row k="Collection" v={collections.find((c) => c.id === collectionId)?.name} muted />
              <Row k="Domaine" v={domains.find((d) => d.id === domainId)?.name} muted />
              <Row k="Accès" v={ACCESS_LEVEL_META[accessLevel as keyof typeof ACCESS_LEVEL_META].label} muted />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}

function Row({ k, v, muted }: { k: string; v?: string; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className={cn("text-right font-semibold", v ? "text-foreground" : "text-muted-foreground/50")}>{v ?? "—"}</span>
    </div>
  );
}
