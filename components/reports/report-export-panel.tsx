"use client";

import * as React from "react";
import { FileDown, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BOOKING_STATUS, BOOKING_STATUS_META } from "@/lib/enums";

export function ReportExportPanel() {
  const [status, setStatus] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  function query() {
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    return p.toString();
  }

  return (
    <Card>
      <CardHeader><CardTitle>Générer un rapport</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              {BOOKING_STATUS.map((s) => <option key={s} value={s}>{BOOKING_STATUS_META[s].label}</option>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="from">Du</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="to">Au</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { window.location.href = `/api/reports/export?${query()}`; }}>
            <FileDown className="size-4" /> Exporter en CSV
          </Button>
          <Button variant="outline" onClick={() => window.open(`/reports/print?${query()}`, "_blank")}>
            <Printer className="size-4" /> Aperçu imprimable (PDF)
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Le format CSV s'ouvre dans Excel/LibreOffice. L'aperçu imprimable permet d'enregistrer en PDF via l'impression du navigateur.</p>
      </CardContent>
    </Card>
  );
}
