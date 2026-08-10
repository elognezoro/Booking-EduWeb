import "server-only";
import { prisma } from "@/lib/prisma";
import { fmtMoney } from "@/lib/money";
import { PAYMENT_METHOD_KEYS, type PaymentMethod } from "./constants";

/** Filtre STRICT d'un espace financier (voir lib/finances/scope.ts). */
export interface SpaceFilter {
  organizationId: string;
  departmentId: string | null;
}

export interface FinanceAlert {
  tone: "pending" | "unavailable";
  title: string;
  detail: string;
}

export interface MonthPoint {
  month: string; // "sept. 2025"
  income: number;
  expense: number;
}

export interface FinanceDashboard {
  totalIncome: number;
  totalExpense: number;
  net: number;
  unpaidTotal: number; // reste à recouvrer (factures PENDING/PARTIAL)
  invoiceCount: number;
  recoveryRate: number | null; // % recouvré (null si aucune facture)
  months: MonthPoint[]; // 12 derniers mois
  expenseByCategory: { name: string; count: number }[]; // count = montant (pour CategoryDonut/TopResourcesChart)
  byMethod: { method: PaymentMethod; income: number; expense: number }[];
  recentEntries: { id: string; kind: string; number: string; label: string; amount: number; date: Date; method: string }[];
  alerts: FinanceAlert[];
  health: number; // 0-100
}

const MONTH_FMT = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" });

/** Tableau de bord d'UN espace financier (cloisonné par le filtre passé). */
export async function getFinanceDashboard(filter: SpaceFilter): Promise<FinanceDashboard> {
  const where = { organizationId: filter.organizationId, departmentId: filter.departmentId };

  const [sums, invoices, categoryRows, methodRows, recentEntries] = await Promise.all([
    prisma.financeEntry.groupBy({ by: ["kind"], where, _sum: { amount: true } }),
    prisma.financeInvoice.findMany({
      where: { ...where, status: { in: ["PENDING", "PARTIAL", "PAID"] } },
      select: { amount: true, paidAmount: true, status: true },
    }),
    prisma.financeEntry.groupBy({ by: ["categoryId"], where: { ...where, kind: "EXPENSE" }, _sum: { amount: true } }),
    prisma.financeEntry.groupBy({ by: ["method", "kind"], where, _sum: { amount: true } }),
    prisma.financeEntry.findMany({
      where,
      orderBy: { date: "desc" },
      take: 6,
      select: { id: true, kind: true, number: true, label: true, amount: true, date: true, method: true },
    }),
  ]);

  const totalIncome = sums.find((s) => s.kind === "INCOME")?._sum.amount ?? 0;
  const totalExpense = sums.find((s) => s.kind === "EXPENSE")?._sum.amount ?? 0;

  // Recouvrement (factures actives + soldées ; les annulées sont exclues).
  const billed = invoices.reduce((s, i) => s + i.amount, 0);
  const recovered = invoices.reduce((s, i) => s + Math.min(i.paidAmount, i.amount), 0);
  const unpaidTotal = invoices
    .filter((i) => i.status === "PENDING" || i.status === "PARTIAL")
    .reduce((s, i) => s + Math.max(0, i.amount - i.paidAmount), 0);
  const recoveryRate = billed > 0 ? Math.round((recovered / billed) * 100) : null;

  // Série 12 mois (mois glissants, du plus ancien au plus récent).
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const monthly = await prisma.financeEntry.findMany({
    where: { ...where, date: { gte: start } },
    select: { kind: true, amount: true, date: true },
  });
  const months: MonthPoint[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    months.push({ month: MONTH_FMT.format(d), income: 0, expense: 0 });
  }
  for (const e of monthly) {
    const idx = (e.date.getFullYear() - start.getFullYear()) * 12 + (e.date.getMonth() - start.getMonth());
    if (idx >= 0 && idx < 12) {
      if (e.kind === "INCOME") months[idx].income += e.amount;
      else months[idx].expense += e.amount;
    }
  }

  // Répartition des dépenses par catégorie (libellés résolus en une requête).
  const catIds = categoryRows.map((c) => c.categoryId).filter((x): x is string => !!x);
  const cats = catIds.length
    ? await prisma.financeCategory.findMany({ where: { id: { in: catIds } }, select: { id: true, name: true } })
    : [];
  const catName = new Map(cats.map((c) => [c.id, c.name]));
  const expenseByCategory = categoryRows
    .map((c) => ({ name: c.categoryId ? catName.get(c.categoryId) ?? "Autre" : "Sans catégorie", count: c._sum.amount ?? 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  // Soldes par mode de paiement.
  const byMethod = PAYMENT_METHOD_KEYS.map((method) => ({
    method,
    income: methodRows.find((r) => r.method === method && r.kind === "INCOME")?._sum.amount ?? 0,
    expense: methodRows.find((r) => r.method === method && r.kind === "EXPENSE")?._sum.amount ?? 0,
  }));

  // Centre d'alertes + santé globale (simple et lisible).
  const alerts: FinanceAlert[] = [];
  if (recoveryRate !== null && recoveryRate < 50)
    alerts.push({ tone: "pending", title: "Recouvrement", detail: `Taux de recouvrement faible (${recoveryRate} %) — reste ${fmtMoney(unpaidTotal)}.` });
  const net = totalIncome - totalExpense;
  if (net < 0)
    alerts.push({ tone: "unavailable", title: "Trésorerie", detail: `Solde net négatif (${fmtMoney(net)}).` });
  const health = Math.max(0, 100 - alerts.length * 12 - (net < 0 ? 10 : 0));

  return {
    totalIncome,
    totalExpense,
    net,
    unpaidTotal,
    invoiceCount: invoices.length,
    recoveryRate,
    months,
    expenseByCategory,
    byMethod,
    recentEntries,
    alerts,
    health,
  };
}
