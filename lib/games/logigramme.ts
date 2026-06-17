// Génération de logigrammes (énigmes de déduction) à solution unique garantie.
// Principe : N « sujets » (prénoms) à placer sur un axe ordonné de N positions (file, étage, arrivée…).
// On tire une solution au hasard, puis on sélectionne un jeu d'indices vrais qui la détermine de façon unique.
import type { Level } from "./catalog";

export interface Logigramme {
  level: Level;
  n: number;
  intro: string;
  slotName: string; // ex. « place », « étage »
  items: string[]; // libellés des sujets (index = sujet)
  slotLabels: string[]; // libellés des positions (index = position)
  clues: string[]; // indices, en français
  solution: number[]; // solution[sujet] = position
}

interface Scenario {
  context: string;
  slotName: string;
  itemNoun: string; // singulier
  names: string[];
}

const SCENARIOS: Scenario[] = [
  {
    context: "Des amis attendent les uns derrière les autres au guichet.",
    slotName: "place",
    itemNoun: "ami",
    names: ["Awa", "Koffi", "Mariam", "Yao", "Fatou", "Jean", "Adjoua", "Bakary"],
  },
  {
    context: "Des coureurs viennent de franchir la ligne d'arrivée.",
    slotName: "position",
    itemNoun: "coureur",
    names: ["Ali", "Sékou", "Léa", "Ngolo", "Rita", "Paul", "Aya", "Idriss"],
  },
  {
    context: "Des élèves passent au tableau l'un après l'autre.",
    slotName: "place",
    itemNoun: "élève",
    names: ["Kane", "Diane", "Moussa", "Sara", "Eric", "Nadia", "Hervé", "Lina"],
  },
];

const LEVEL_N: Record<Level, number> = { facile: 3, moyen: 4, difficile: 5 };

const rndInt = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ordinal(n: number): string {
  return n === 1 ? "1ʳᵉ" : `${n}ᵉ`;
}

function permutations(n: number): number[][] {
  const res: number[][] = [];
  const used = Array(n).fill(false);
  const cur: number[] = [];
  const rec = () => {
    if (cur.length === n) {
      res.push(cur.slice());
      return;
    }
    for (let i = 0; i < n; i++) {
      if (!used[i]) {
        used[i] = true;
        cur.push(i);
        rec();
        cur.pop();
        used[i] = false;
      }
    }
  };
  rec();
  return res;
}

interface Clue {
  text: string;
  pred: (p: number[]) => boolean; // p[item] = slot
}

export function genLogigramme(level: Level): Logigramme {
  const n = LEVEL_N[level] ?? 3;
  const scenario = SCENARIOS[rndInt(0, SCENARIOS.length - 1)];
  const items = shuffle(scenario.names).slice(0, n);
  const slotName = scenario.slotName;
  const slotLabels = Array.from({ length: n }, (_, i) => `${ordinal(i + 1)} ${slotName}`);

  // Solution : permutation aléatoire (solution[item] = slot).
  const solution = shuffle(Array.from({ length: n }, (_, i) => i));

  // --- Construction du vivier d'indices VRAIS pour la solution ---
  const relational: Clue[] = [];
  const negative: Clue[] = [];

  for (let a = 0; a < n; a++) {
    // extrémités
    if (solution[a] === 0)
      relational.push({ text: `${items[a]} est en première position.`, pred: (p) => p[a] === 0 });
    if (solution[a] === n - 1)
      relational.push({ text: `${items[a]} est en dernière position.`, pred: (p) => p[a] === n - 1 });
    // négatifs (item ≠ slot)
    for (let s = 0; s < n; s++) {
      if (solution[a] !== s)
        negative.push({ text: `${items[a]} n'est pas à la ${ordinal(s + 1)} ${slotName}.`, pred: (p) => p[a] !== s });
    }
  }
  for (let a = 0; a < n; a++) {
    for (let b = 0; b < n; b++) {
      if (a === b) continue;
      const da = solution[a];
      const db = solution[b];
      if (da < db)
        relational.push({ text: `${items[a]} est avant ${items[b]}.`, pred: (p) => p[a] < p[b] });
      if (da + 1 === db)
        relational.push({ text: `${items[a]} est juste avant ${items[b]}.`, pred: (p) => p[a] + 1 === p[b] });
      if (Math.abs(da - db) === 1)
        relational.push({ text: `${items[a]} et ${items[b]} sont côte à côte.`, pred: (p) => Math.abs(p[a] - p[b]) === 1 });
    }
  }

  // Vivier ordonné : indices « intéressants » d'abord, négatifs en dernier recours.
  const pool: Clue[] = [...shuffle(relational), ...shuffle(negative)];
  const perms = permutations(n);
  const countConsistent = (sel: Clue[]) => perms.filter((p) => sel.every((c) => c.pred(p))).length;

  const selected: Clue[] = [];
  let guard = 0;
  while (countConsistent(selected) > 1 && guard++ < 60) {
    let chosen: Clue | null = null;
    const base = countConsistent(selected);
    for (const c of pool) {
      if (selected.includes(c)) continue;
      if (countConsistent([...selected, c]) < base) {
        chosen = c;
        break;
      }
    }
    if (!chosen) break;
    selected.push(chosen);
  }

  // Élagage : retire les indices devenus redondants.
  for (let i = selected.length - 1; i >= 0; i--) {
    const without = selected.filter((_, k) => k !== i);
    if (countConsistent(without) === 1) selected.splice(i, 1);
  }

  return {
    level,
    n,
    intro: `${scenario.context} Déduisez l'ordre exact des ${n} ${scenario.itemNoun}s à partir des indices.`,
    slotName,
    items,
    slotLabels,
    clues: selected.map((c) => c.text),
    solution,
  };
}
