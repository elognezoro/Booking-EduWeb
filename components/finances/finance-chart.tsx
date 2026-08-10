"use client";

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { fmtMoney } from "@/lib/money";

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  fontSize: 12,
  boxShadow: "0 12px 32px -16px rgba(6,75,58,0.18)",
};

const PALETTE = ["#064B3A", "#6D5DF5", "#F97316", "#0EA5E9", "#DC2626", "#22C55E", "#B45309", "#94A3B8"];

/** Courbe 12 mois : recettes (vert) vs dépenses (rouge), montants FCFA. */
export function FinanceMonthlyChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="finIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="finExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DC2626" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(v: number) => (v >= 1_000_000 ? `${Math.round(v / 1_000_000)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
        />
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ fontWeight: 700 }} formatter={(value: number | string) => fmtMoney(Number(value))} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="income" name="Recettes" stroke="#16A34A" strokeWidth={2.5} fill="url(#finIncome)" />
        <Area type="monotone" dataKey="expense" name="Dépenses" stroke="#DC2626" strokeWidth={2.5} fill="url(#finExpense)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Donut de répartition des dépenses par catégorie (montants FCFA). */
export function ExpenseDonut({ data }: { data: { name: string; count: number }[] }) {
  const chartData = data.map((d, i) => ({ ...d, color: PALETTE[i % PALETTE.length] }));
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number | string) => fmtMoney(Number(value))} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
