import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ScrollText, ShieldCheck } from "lucide-react";
import { requirePermission, isSuperAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/json";
import { fmtMoney } from "@/lib/money";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tone } from "@/lib/enums";

export const dynamic = "force-dynamic";

// Journal de traçabilité du module Finances — consultation STRICTEMENT réservée
// à l'administrateur système (les gestionnaires ne voient pas cette page).
const ACTIONS: Record<string, { label: string; tone: Tone }> = {
  FINANCE_ENTRY_CREATE: { label: "Écriture créée", tone: "available" },
  FINANCE_ENTRY_DELETE: { label: "Écriture supprimée", tone: "unavailable" },
  FINANCE_INVOICE_CREATE: { label: "Facture créée", tone: "info" },
  FINANCE_INVOICE_SETTLE: { label: "Règlement encaissé", tone: "available" },
  FINANCE_INVOICE_CANCEL: { label: "Facture annulée", tone: "pending" },
  FINANCE_CASHBOX_DELETE: { label: "Caisse supprimée", tone: "unavailable" },
  FINANCE_CATEGORY_DELETE: { label: "Catégorie supprimée", tone: "unavailable" },
  FINANCE_STUDENTS_DELETE: { label: "Étudiants supprimés", tone: "unavailable" },
  FINANCE_STUDENTS_IMPORT: { label: "Étudiants importés", tone: "info" },
  FINANCE_STUDENTS_DEMO: { label: "Étudiants de démo créés", tone: "neutral" },
  FINANCE_RECEIPT_EMAIL: { label: "Reçu envoyé par e-mail", tone: "info" },
};

interface Details {
  kind?: string; number?: string; invoice?: string; entryNumber?: string; label?: string;
  name?: string; debtorName?: string; thirdParty?: string; to?: string; amount?: number;
  paidAmount?: number; mode?: string; count?: number; fichier?: string; espace?: string;
  source?: string; ok?: boolean;
}

/** Résumé lisible d'une entrée du journal (à partir du JSON old/new). */
function summarize(v: Details): string {
  const parts: string[] = [];
  if (v.kind === "INCOME") parts.push("Encaissement");
  if (v.kind === "EXPENSE") parts.push("Dépense");
  if (v.number) parts.push(`N° ${v.number}`);
  if (v.invoice) parts.push(`Facture ${v.invoice}${v.entryNumber ? ` → reçu ${v.entryNumber}` : ""}`);
  if (v.label) parts.push(v.label);
  if (v.name) parts.push(v.name);
  if (typeof v.amount === "number") parts.push(fmtMoney(v.amount));
  if (v.debtorName) parts.push(`Redevable : ${v.debtorName}`);
  if (v.thirdParty) parts.push(`Tiers : ${v.thirdParty}`);
  if (v.to) parts.push(`→ ${v.to}${v.ok === false ? " (échec)" : ""}`);
  if (v.mode) parts.push(v.mode === "all" ? "toute la liste" : "fiches de démonstration");
  if (typeof v.count === "number") parts.push(`${v.count} fiche(s)`);
  if (v.fichier) parts.push(`fichier ${v.fichier}`);
  if (v.source && v.source !== "MANUAL") parts.push(`source ${v.source}`);
  if (v.espace) parts.push(`· ${v.espace}`);
  return parts.join(" · ") || "—";
}

const DT = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

export default async function FinancesAuditPage({ searchParams }: { searchParams: { action?: string } }) {
  const user = await requirePermission("platform.manage");
  if (!isSuperAdmin(user)) redirect("/dashboard?denied=1"); // administrateur système uniquement

  const actionFilter = searchParams.action && searchParams.action in ACTIONS ? searchParams.action : null;
  const logs = await prisma.auditLog.findMany({
    where: { action: actionFilter ?? { startsWith: "FINANCE_" } },
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const [users, orgs] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: [...new Set(logs.map((l) => l.userId).filter((x): x is string => !!x))] } },
      select: { id: true, firstName: true, lastName: true, email: true },
    }),
    prisma.organization.findMany({
      where: { id: { in: [...new Set(logs.map((l) => l.organizationId).filter((x): x is string => !!x))] } },
      select: { id: true, name: true, acronym: true },
    }),
  ]);
  const userById = new Map(users.map((u) => [u.id, u]));
  const orgById = new Map(orgs.map((o) => [o.id, o]));

  return (
    <div className="space-y-6">
      <Link href="/dashboard/platform" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Supervision EduWeb
      </Link>
      <PageHeader
        title="Traçabilité finances"
        description="Journal rigoureux des encaissements, dépenses, règlements et suppressions — visible uniquement par l'administrateur système."
        icon={<span className="inline-flex size-11 items-center justify-center rounded-2xl bg-advanced-soft text-advanced-fg"><ScrollText className="size-6" /></span>}
      />

      <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary-50/50 px-4 py-3 text-sm text-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <span>
          Chaque opération est enregistrée avec son auteur, l'horodatage, l'établissement, l'espace financier et le détail
          de l'opération (y compris l'instantané complet des éléments supprimés). Ce journal n'est pas modifiable.
        </span>
      </div>

      {/* Filtres par type d'opération */}
      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/dashboard/platform/finances-audit"
          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${!actionFilter ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}
        >
          Tout ({logs.length}{logs.length === 300 ? "+" : ""})
        </Link>
        {Object.entries(ACTIONS).map(([key, meta]) => (
          <Link
            key={key}
            href={`/dashboard/platform/finances-audit?action=${key}`}
            className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${actionFilter === key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}
          >
            {meta.label}
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden">
        {logs.length === 0 ? (
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Aucune opération enregistrée pour ce filtre.
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2.5 font-bold">Date / heure</th>
                  <th className="px-4 py-2.5 font-bold">Auteur</th>
                  <th className="px-4 py-2.5 font-bold">Établissement</th>
                  <th className="px-4 py-2.5 font-bold">Opération</th>
                  <th className="px-4 py-2.5 font-bold">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const meta = ACTIONS[log.action] ?? { label: log.action, tone: "neutral" as Tone };
                  const details = summarize({
                    ...parseJson<Details>(log.oldValue ?? "", {}),
                    ...parseJson<Details>(log.newValue ?? "", {}),
                  });
                  const actor = log.userId ? userById.get(log.userId) : null;
                  const org = log.organizationId ? orgById.get(log.organizationId) : null;
                  return (
                    <tr key={log.id} className="align-top">
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">{DT.format(log.createdAt)}</td>
                      <td className="px-4 py-2.5">
                        {actor ? (
                          <>
                            <span className="font-semibold text-foreground">{actor.firstName} {actor.lastName}</span>
                            <span className="block text-xs text-muted-foreground">{actor.email}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-foreground">{org ? (org.acronym || org.name) : "—"}</td>
                      <td className="px-4 py-2.5"><Badge tone={meta.tone}>{meta.label}</Badge></td>
                      <td className="min-w-[280px] px-4 py-2.5 text-foreground">{details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">Les 300 opérations les plus récentes sont affichées.</p>
    </div>
  );
}
