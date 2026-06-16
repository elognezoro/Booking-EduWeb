"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  Check, ChevronLeft, ChevronRight, Loader2, CalendarClock, AlertTriangle, CheckCircle2,
  Lightbulb, Send, MapPin, Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/category-icon";
import { createBooking, checkSlotAction, type SlotCheck, type BookingFormState } from "@/app/actions/bookings";
import { USAGE_TYPES, USAGE_TYPE_LABELS } from "@/lib/enums";
import { SeatMap, SeatLegend } from "@/components/rooms/seat-map";
import { fmtRange, fmtDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

interface Cat { id: string; name: string; icon: string | null; color: string | null }
interface Res {
  id: string; name: string; code: string; categoryId: string;
  capacity: number | null; quantityTotal: number | null; status: string; bookingMode: string;
  location: string | null; seatBased?: boolean;
}

const STEPS = ["Catégorie", "Ressource", "Motif", "Créneau", "Détails", "Confirmation"];

function pad(n: number) { return String(n).padStart(2, "0"); }
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
      Soumettre la demande
    </Button>
  );
}

export function BookingForm({ categories, resources, defaultResourceId, defaultMode }: { categories: Cat[]; resources: Res[]; defaultResourceId?: string; defaultMode?: string }) {
  const preRes = defaultResourceId ? resources.find((r) => r.id === defaultResourceId) : undefined;

  const [step, setStep] = React.useState(preRes ? 2 : 0);
  const [roomMode, setRoomMode] = React.useState(defaultMode === "room"); // true = réserver toute la salle
  const [categoryId, setCategoryId] = React.useState(preRes?.categoryId ?? "");
  const [resourceId, setResourceId] = React.useState(preRes?.id ?? "");
  const [date, setDate] = React.useState(todayStr());
  const [endDate, setEndDate] = React.useState(todayStr());
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("11:00");
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSeats, setSelectedSeats] = React.useState<number[]>([]);
  const [purpose, setPurpose] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [usageType, setUsageType] = React.useState("PEDAGOGICAL");
  const [participants, setParticipants] = React.useState<string>("");
  const [specialNeeds, setSpecialNeeds] = React.useState("");
  const [needsSupport, setNeedsSupport] = React.useState(false);
  const [requesterNote, setRequesterNote] = React.useState("");

  const [checking, setChecking] = React.useState(false);
  const [slot, setSlot] = React.useState<SlotCheck | null>(null);

  const [state, formAction] = useFormState<BookingFormState, FormData>(createBooking, {});

  const resource = resources.find((r) => r.id === resourceId);
  const seatBased = !!resource?.seatBased;
  const isPartial = (resource?.bookingMode === "partial" || resource?.bookingMode === "mixed") && !seatBased;
  const catResources = resources.filter((r) => r.categoryId === categoryId);

  // Mode « toute la salle » (réserve l'ensemble des postes)
  const roomCapacity = slot?.capacity ?? resource?.capacity ?? resource?.quantityTotal ?? 0;
  const allSeatsFree = slot?.seats ? slot.seats.every((s) => !s.occupied) : false;
  const occupiedCount = slot?.seats ? slot.seats.filter((s) => s.occupied).length : 0;
  const seatsToSubmit = seatBased && roomMode ? Array.from({ length: roomCapacity }, (_, i) => i + 1) : selectedSeats;

  const startISO = `${date}T${startTime}`;
  const endISO = `${endDate}T${endTime}`;
  const multiDay = endDate !== date;

  function resetSlot() {
    setSlot(null);
    setSelectedSeats([]);
  }

  function toggleSeat(n: number) {
    setSelectedSeats((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  async function verify() {
    if (!resourceId) return;
    setChecking(true);
    resetSlot();
    try {
      const res = await checkSlotAction({ resourceId, start: startISO, end: endISO, quantityRequested: isPartial ? quantity : 1 });
      setSlot(res);
    } finally {
      setChecking(false);
    }
  }

  function applySuggestion(s: { start: string; end: string }) {
    const sd = new Date(s.start);
    const ed = new Date(s.end);
    setDate(`${sd.getFullYear()}-${pad(sd.getMonth() + 1)}-${pad(sd.getDate())}`);
    setEndDate(`${ed.getFullYear()}-${pad(ed.getMonth() + 1)}-${pad(ed.getDate())}`);
    setStartTime(`${pad(sd.getHours())}:${pad(sd.getMinutes())}`);
    setEndTime(`${pad(ed.getHours())}:${pad(ed.getMinutes())}`);
    resetSlot();
  }

  const canNext = () => {
    if (step === 0) return !!categoryId;
    if (step === 1) return !!resourceId;
    if (step === 2) return purpose.trim().length >= 3;
    if (step === 3) {
      if (!slot?.available) return false;
      if (!seatBased) return true;
      return roomMode ? allSeatsFree : selectedSeats.length > 0;
    }
    return true;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        {/* Stepper */}
        <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                  i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary-50 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
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
          <CardContent className="py-6">
            {/* Étape 1 — Catégorie */}
            {step === 0 && (
              <Step title="Choisissez une catégorie">
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setCategoryId(c.id); setResourceId(""); }}
                      className={cn("flex items-center gap-3 rounded-xl border p-3 text-left transition", categoryId === c.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40")}
                    >
                      <CategoryIcon icon={c.icon} color={c.color} />
                      <span className="font-semibold text-foreground">{c.name}</span>
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {/* Étape 2 — Ressource */}
            {step === 1 && (
              <Step title="Choisissez une ressource">
                {catResources.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune ressource réservable dans cette catégorie.</p>
                ) : (
                  <div className="grid gap-3">
                    {catResources.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { setResourceId(r.id); resetSlot(); }}
                        className={cn("flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition", resourceId === r.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40")}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{r.name}</p>
                          <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                            <span className="font-mono">{r.code}</span>
                            {r.capacity != null && <span className="inline-flex items-center gap-1"><Users className="size-3" /> {r.capacity}</span>}
                            {r.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {r.location}</span>}
                          </p>
                        </div>
                        {resourceId === r.id && <CheckCircle2 className="size-5 shrink-0 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </Step>
            )}

            {/* Étape 4 — Créneau */}
            {step === 3 && (
              <Step title="Date et créneau">
                {seatBased && (
                  <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl border border-border bg-secondary p-1">
                    <button type="button" onClick={() => { setRoomMode(false); }}
                      className={cn(
                        "rounded-lg px-3.5 py-2 text-sm font-bold transition-colors",
                        !roomMode ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-card hover:text-foreground"
                      )}>
                      Réserver des postes
                    </button>
                    <button type="button" onClick={() => { setRoomMode(true); setSelectedSeats([]); }}
                      className={cn(
                        "rounded-lg px-3.5 py-2 text-sm font-bold transition-colors",
                        roomMode ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-card hover:text-foreground"
                      )}>
                      Réserver toute la salle
                    </button>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="d" required>Date de début</Label>
                    <Input id="d" type="date" value={date} min={todayStr()} onChange={(e) => { const v = e.target.value; setDate(v); if (endDate < v) setEndDate(v); resetSlot(); }} />
                  </div>
                  <div>
                    <Label htmlFor="st" required>Heure de début</Label>
                    <Input id="st" type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); resetSlot(); }} />
                  </div>
                  <div>
                    <Label htmlFor="ed" required>Date de fin</Label>
                    <Input id="ed" type="date" value={endDate} min={date} onChange={(e) => { setEndDate(e.target.value); resetSlot(); }} />
                  </div>
                  <div>
                    <Label htmlFor="et" required>Heure de fin</Label>
                    <Input id="et" type="time" value={endTime} onChange={(e) => { setEndTime(e.target.value); resetSlot(); }} />
                  </div>
                  {isPartial && (
                    <div className="sm:col-span-2">
                      <Label htmlFor="qty">Quantité demandée</Label>
                      <Input id="qty" type="number" min={1} max={resource?.quantityTotal ?? undefined} value={quantity} onChange={(e) => { setQuantity(Number(e.target.value)); resetSlot(); }} />
                    </div>
                  )}
                </div>
                {multiDay && (
                  <p className="mt-2 text-xs font-medium text-primary">Réservation sur plusieurs jours : du {date.split("-").reverse().join("/")} au {endDate.split("-").reverse().join("/")}.</p>
                )}

                <div className="mt-4">
                  <Button type="button" variant="subtle" onClick={verify} disabled={checking}>
                    {checking ? <Loader2 className="size-4 animate-spin" /> : <CalendarClock className="size-4" />}
                    Vérifier la disponibilité
                  </Button>
                </div>

                {slot && !slot.seatBased && <SlotFeedback slot={slot} onApply={applySuggestion} />}

                {/* Plan de salle : sélection des postes */}
                {slot?.seatBased && slot.seats && !roomMode && (
                  <div className="mt-4 space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-foreground">Choisissez vos postes</p>
                      <span className="text-sm font-semibold text-primary">{selectedSeats.length} poste(s) sélectionné(s)</span>
                    </div>
                    <SeatLegend />
                    <div className="flex justify-center">
                      <SeatMap
                        seats={slot.seats}
                        capacity={slot.capacity}
                        label={resource?.name}
                        selectable
                        selected={selectedSeats}
                        onToggle={toggleSeat}
                      />
                    </div>
                    {selectedSeats.length === 0 && (
                      <p className="text-center text-xs text-muted-foreground">Cliquez sur les postes verts pour les réserver.</p>
                    )}
                  </div>
                )}

                {/* Réserver toute la salle */}
                {slot?.seatBased && slot.seats && roomMode && (
                  allSeatsFree ? (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft p-4 text-sm font-semibold text-available-fg">
                      <CheckCircle2 className="size-5" /> La salle entière est libre sur ce créneau — {roomCapacity} poste(s) réservé(s).
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-pending/30 bg-pending-soft p-4">
                      <p className="flex items-center gap-2 text-sm font-bold text-pending-fg">
                        <AlertTriangle className="size-4" /> La salle n'est pas entièrement libre ({occupiedCount} poste(s) occupé(s) sur ce créneau).
                      </p>
                      <button type="button" onClick={() => setRoomMode(false)} className="mt-2 text-sm font-semibold text-primary hover:underline">
                        Choisir un autre créneau, ou réserver seulement des postes →
                      </button>
                    </div>
                  )
                )}
              </Step>
            )}

            {/* Étape 3 — Motif */}
            {step === 2 && (
              <Step title="Motif et type d'usage">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Intitulé</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. TP Bureautique L1" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="usage">Type d'usage</Label>
                      <Select id="usage" value={usageType} onChange={(e) => setUsageType(e.target.value)}>
                        {USAGE_TYPES.map((u) => <option key={u} value={u}>{USAGE_TYPE_LABELS[u]}</option>)}
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="part">Effectif / participants</Label>
                      <Input id="part" type="number" min={1} value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="Ex. 28" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="purpose" required>Motif</Label>
                    <Textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Décrivez l'objet de la réservation…" required />
                  </div>
                </div>
              </Step>
            )}

            {/* Étape 5 — Détails */}
            {step === 4 && (
              <Step title="Besoins particuliers">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="needs">Besoins spécifiques</Label>
                    <Textarea id="needs" value={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.value)} placeholder="Disposition de la salle, logiciels, matériel additionnel…" />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={needsSupport} onChange={(e) => setNeedsSupport(e.target.checked)} className="size-4 rounded border-input text-primary focus:ring-ring" />
                    <span className="text-sm font-medium text-foreground">J'ai besoin d'une assistance technique</span>
                  </label>
                  <div>
                    <Label htmlFor="note">Note pour le validateur</Label>
                    <Textarea id="note" value={requesterNote} onChange={(e) => setRequesterNote(e.target.value)} placeholder="Information complémentaire (optionnel)" />
                  </div>
                </div>
              </Step>
            )}

            {/* Étape 6 — Confirmation */}
            {step === 5 && (
              <Step title="Confirmez votre demande">
                <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-4 text-sm">
                  <Row label="Ressource" value={resource?.name ?? "—"} />
                  <Row label="Créneau" value={fmtRange(startISO, endISO)} />
                  {isPartial && <Row label="Quantité" value={String(quantity)} />}
                  {seatBased && roomMode && <Row label="Réservation" value={`Toute la salle (${roomCapacity} postes)`} />}
                  {seatBased && !roomMode && <Row label="Postes" value={selectedSeats.length ? selectedSeats.slice().sort((a, b) => a - b).join(", ") : "—"} />}
                  <Row label="Motif" value={purpose || "—"} />
                  <Row label="Usage" value={USAGE_TYPE_LABELS[usageType as keyof typeof USAGE_TYPE_LABELS]} />
                  {participants && <Row label="Effectif" value={participants} />}
                </div>

                {state.error && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-unavailable/30 bg-unavailable-soft px-3.5 py-2.5 text-sm font-medium text-unavailable-fg">
                    <AlertTriangle className="size-4 shrink-0" /> {state.error}
                  </div>
                )}

                <form action={formAction} className="mt-5">
                  <input type="hidden" name="resourceId" value={resourceId} />
                  <input type="hidden" name="start" value={startISO} />
                  <input type="hidden" name="end" value={endISO} />
                  <input type="hidden" name="purpose" value={purpose} />
                  <input type="hidden" name="title" value={title} />
                  <input type="hidden" name="usageType" value={usageType} />
                  {participants && <input type="hidden" name="participantCount" value={participants} />}
                  {isPartial && <input type="hidden" name="quantityRequested" value={quantity} />}
                  {seatBased && <input type="hidden" name="seatNumbers" value={JSON.stringify(seatsToSubmit)} />}
                  <input type="hidden" name="specialNeeds" value={specialNeeds} />
                  {needsSupport && <input type="hidden" name="needsSupport" value="on" />}
                  <input type="hidden" name="requesterNote" value={requesterNote} />
                  <SubmitButton />
                </form>
              </Step>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        {step < 5 && (
          <div className="mt-4 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ChevronLeft className="size-4" /> Précédent
            </Button>
            <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Continuer <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Résumé latéral */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm font-bold text-foreground">Récapitulatif</p>
            <div className="mt-3 space-y-3 text-sm">
              <SummaryItem label="Catégorie" value={categories.find((c) => c.id === categoryId)?.name} />
              <SummaryItem label="Ressource" value={resource?.name} />
              <SummaryItem label="Début" value={resourceId ? fmtDateTime(startISO) : undefined} />
              <SummaryItem label="Fin" value={resourceId ? fmtDateTime(endISO) : undefined} />
              {seatBased && (
                <SummaryItem
                  label="Réservation"
                  value={roomMode ? "Toute la salle" : selectedSeats.length ? `${selectedSeats.length} poste(s)` : undefined}
                />
              )}
              {slot?.available && !seatBased && (
                <Badge tone="available" dot className="mt-1">Créneau disponible</Badge>
              )}
              {seatBased && roomMode && allSeatsFree && (
                <Badge tone="available" dot className="mt-1">Salle entière prête</Badge>
              )}
              {seatBased && !roomMode && selectedSeats.length > 0 && (
                <Badge tone="available" dot className="mt-1">{selectedSeats.length} poste(s) prêt(s)</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      <h3 className="mb-4 text-lg font-bold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right font-semibold", value ? "text-foreground" : "text-muted-foreground/50")}>{value ?? "—"}</span>
    </div>
  );
}

function SlotFeedback({ slot, onApply }: { slot: SlotCheck; onApply: (s: { start: string; end: string }) => void }) {
  if (!slot.ok || slot.errors.length > 0) {
    return (
      <div className="mt-4 rounded-xl border border-unavailable/30 bg-unavailable-soft p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-unavailable-fg"><AlertTriangle className="size-4" /> Créneau non valide</p>
        <ul className="mt-1 list-inside list-disc text-sm text-unavailable-fg/90">
          {slot.errors.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </div>
    );
  }
  if (slot.available) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-available/30 bg-available-soft p-4 text-sm font-semibold text-available-fg">
        <CheckCircle2 className="size-5" /> Ce créneau est disponible. Vous pouvez continuer.
      </div>
    );
  }
  return (
    <div className="mt-4 rounded-xl border border-pending/30 bg-pending-soft p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-pending-fg"><AlertTriangle className="size-4" /> {slot.reason ?? "Créneau indisponible."}</p>
      {slot.suggestion && (
        <button
          type="button"
          onClick={() => onApply(slot.suggestion!)}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-primary-50"
        >
          <Lightbulb className="size-4" />
          Créneau proposé : {new Date(slot.suggestion.start).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </button>
      )}
    </div>
  );
}
