import {
  Cpu, Power, RotateCcw, Moon, LogOut, KeyRound, Save, ShieldAlert, EyeOff,
  Folder, FolderOpen, Check, CircleDot,
} from "lucide-react";
import type { InfographicKind, N1TreeNode } from "@/lib/certel/niveau1/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu, Power, RotateCcw, Moon, LogOut, KeyRound, Save, ShieldAlert, EyeOff,
};
function Icon({ name, className }: { name?: string; className?: string }) {
  const C = (name && ICONS[name]) || CircleDot;
  return <C className={className} />;
}

const N1 = "#0891B2"; // accent Niveau 1

/* eslint-disable @typescript-eslint/no-explicit-any */
export function Infographic({ kind, title, data }: { kind: InfographicKind; title?: string; data: any }) {
  return (
    <figure className="my-5 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/40 to-card p-5 shadow-soft">
      {title && (
        <figcaption className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
          <span className="inline-block size-2 rounded-full" style={{ backgroundColor: N1 }} />
          {title}
        </figcaption>
      )}
      {kind === "two-columns" && <TwoColumns data={data} />}
      {kind === "categories" && <Categories data={data} />}
      {kind === "tree" && <Tree data={data} />}
      {kind === "pattern" && <Pattern data={data} />}
      {kind === "table" && <Table data={data} />}
      {kind === "steps" && <Steps data={data} />}
      {kind === "rules" && <Rules data={data} />}
    </figure>
  );
}

function TwoColumns({ data }: { data: { left: Col; right: Col } }) {
  type LocalCol = Col;
  const Column = ({ c, accent }: { c: LocalCol; accent: string }) => (
    <div className="flex-1 rounded-xl border border-border bg-card p-4">
      <h4 className="font-bold text-foreground">{c.title}</h4>
      {c.subtitle && <p className="mt-0.5 text-xs italic text-muted-foreground">{c.subtitle}</p>}
      <ul className="mt-3 space-y-1.5">
        {c.items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="mt-0.5 size-3.5 shrink-0" style={{ color: accent }} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Column c={data.left} accent={N1} />
      <Column c={data.right} accent="#6D5DF5" />
    </div>
  );
}
interface Col { title: string; subtitle?: string; items: string[] }

function Categories({ data }: { data: { columns: { title: string; accent?: string; items: { label: string; hint?: string }[] }[] } }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.columns.map((col, i) => {
        const accent = col.accent || N1;
        return (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: accent }}>{col.title}</div>
            <ul className="space-y-1 p-3">
              {col.items.map((it, j) => (
                <li key={j} className="rounded-lg bg-secondary/60 px-2.5 py-1.5 text-sm text-foreground">{it.label}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function Tree({ data }: { data: { root: string; nodes: N1TreeNode[] } }) {
  const Node = ({ node, depth }: { node: N1TreeNode; depth: number }) => (
    <li>
      <div className="flex items-center gap-1.5 py-0.5 text-sm text-foreground" style={{ paddingLeft: depth * 18 }}>
        {node.children?.length ? <FolderOpen className="size-4 text-advanced-fg" /> : <Folder className="size-4" style={{ color: N1 }} />}
        <span className={depth === 0 ? "font-semibold" : ""}>{node.label}</span>
      </div>
      {node.children?.length ? (
        <ul>{node.children.map((c, i) => <Node key={i} node={c} depth={depth + 1} />)}</ul>
      ) : null}
    </li>
  );
  return (
    <div className="rounded-xl border border-border bg-card p-4 font-mono">
      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground"><FolderOpen className="size-4 text-advanced-fg" /> {data.root}</div>
      <ul className="mt-0.5">{data.nodes.map((n, i) => <Node key={i} node={n} depth={1} />)}</ul>
    </div>
  );
}

function Pattern({ data }: { data: { pattern: string; examples: string[] } }) {
  const tokens = data.pattern.split("_");
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-4">
        {tokens.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <span className="rounded-lg px-2.5 py-1 text-xs font-bold text-white" style={{ backgroundColor: i % 2 ? "#6D5DF5" : N1 }}>{t}</span>
            {i < tokens.length - 1 && <span className="font-mono text-muted-foreground">_</span>}
          </span>
        ))}
      </div>
      <ul className="space-y-1">
        {data.examples.map((ex, i) => (
          <li key={i} className="flex items-center gap-2 rounded-lg bg-available-soft/50 px-3 py-1.5 font-mono text-xs text-foreground"><Check className="size-3.5 text-available-fg" /> {ex}</li>
        ))}
      </ul>
    </div>
  );
}

function Table({ data }: { data: { columns: string[]; rows: string[][] } }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary/70 text-left">
            {data.columns.map((c, i) => <th key={i} className="px-4 py-2 font-bold text-foreground">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className="border-t border-border">
              {row.map((cell, j) => <td key={j} className={`px-4 py-2 ${j === 0 ? "font-mono font-semibold" : "text-muted-foreground"}`} style={j === 0 ? { color: N1 } : undefined}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Steps({ data }: { data: { steps: { title: string; text?: string }[] } }) {
  return (
    <ol className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {data.steps.map((s, i) => (
        <li key={i} className="relative rounded-xl border border-border bg-card p-3.5">
          <span className="absolute -top-2.5 -left-2.5 inline-flex size-6 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-soft" style={{ backgroundColor: N1 }}>{i + 1}</span>
          <p className="font-semibold text-foreground">{s.title}</p>
          {s.text && <p className="mt-0.5 text-xs text-muted-foreground">{s.text}</p>}
        </li>
      ))}
    </ol>
  );
}

function Rules({ data }: { data: { rules: { icon?: string; title: string; text: string }[] } }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data.rules.map((r, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3.5">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "#EDE9FE" }}>
            <Icon name={r.icon} className="size-4 text-advanced-fg" />
          </span>
          <div>
            <p className="font-bold text-foreground">{r.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{r.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
