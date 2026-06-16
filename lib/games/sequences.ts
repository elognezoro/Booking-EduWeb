// Génération de suites logiques (numériques) avec règle connue + options plausibles.
export type SeqLevel = "facile" | "moyen" | "difficile";

export interface Suite {
  terms: number[]; // 5 termes visibles
  answer: number; // terme suivant
  options: number[]; // 4 choix (dont la bonne réponse), mélangés
}

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = <T,>(arr: T[]): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export function genSuite(level: SeqLevel): Suite {
  let seq: number[];

  if (level === "facile") {
    const start = rnd(1, 9);
    const step = rnd(1, 5);
    seq = Array.from({ length: 6 }, (_, i) => start + i * step);
  } else if (level === "moyen") {
    if (Math.random() < 0.5) {
      const start = rnd(2, 12);
      const step = rnd(2, 9) * (Math.random() < 0.35 ? -1 : 1);
      seq = Array.from({ length: 6 }, (_, i) => start + i * step);
    } else {
      const start = rnd(1, 4);
      const ratio = rnd(2, 3);
      seq = Array.from({ length: 6 }, (_, i) => start * Math.pow(ratio, i));
    }
  } else {
    const t = Math.random();
    if (t < 0.34) {
      // pas croissant : +1, +2, +3, …
      let v = rnd(1, 5);
      let step = rnd(1, 3);
      const arr = [v];
      for (let i = 1; i < 6; i++) { v += step; arr.push(v); step++; }
      seq = arr;
    } else if (t < 0.67) {
      // carrés décalés : (n+off)²
      const off = rnd(0, 3);
      seq = Array.from({ length: 6 }, (_, i) => (i + 1 + off) * (i + 1 + off));
    } else {
      // type Fibonacci : t(n) = t(n-1) + t(n-2)
      let a = rnd(1, 4);
      let b = rnd(2, 6);
      const arr = [a, b];
      for (let i = 2; i < 6; i++) { const c = a + b; arr.push(c); a = b; b = c; }
      seq = arr;
    }
  }

  const terms = seq.slice(0, 5);
  const answer = seq[5];
  const lastStep = terms[4] - terms[3];

  const opts = new Set<number>([answer]);
  for (const c of [answer + 1, answer - 1, answer + 2, answer - 2, answer + lastStep, answer - lastStep, answer + 3]) {
    if (opts.size >= 4) break;
    if (c !== answer && c > 0 && !opts.has(c)) opts.add(c);
  }
  let k = 4;
  while (opts.size < 4) { if (answer + k > 0) opts.add(answer + k); k++; }

  return { terms, answer, options: shuffle([...opts]) };
}
