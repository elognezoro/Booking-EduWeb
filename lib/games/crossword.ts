// Génération de mots croisés : un générateur d'entrecroisement place des mots d'une banque
// thématique de sorte que toute lettre commune à deux mots coïncide (croisements valides garantis).
import type { Level } from "./catalog";

export interface CrosswordEntry {
  num: number;
  row: number;
  col: number;
  dir: "across" | "down";
  answer: string;
  clue: string;
}

export interface CrosswordPuzzle {
  level: Level;
  theme: string;
  rows: number;
  cols: number;
  entries: CrosswordEntry[];
  solution: Record<string, string>; // "r,c" -> lettre (cases blanches)
}

interface Word {
  answer: string;
  clue: string;
}

const BANKS: Record<Level, { theme: string; words: Word[] }> = {
  facile: {
    theme: "Mots du quotidien",
    words: [
      { answer: "CHAT", clue: "Petit félin domestique" },
      { answer: "CHIEN", clue: "Meilleur ami de l'homme" },
      { answer: "LION", clue: "Roi des animaux" },
      { answer: "ROSE", clue: "Fleur à épines" },
      { answer: "PAIN", clue: "On l'achète à la boulangerie" },
      { answer: "LUNE", clue: "Astre de la nuit" },
      { answer: "ECOLE", clue: "Lieu où l'on apprend" },
      { answer: "LIVRE", clue: "On le lit, page après page" },
      { answer: "ARBRE", clue: "Il a des branches et des feuilles" },
      { answer: "SOLEIL", clue: "Étoile du jour" },
      { answer: "AMI", clue: "Camarade proche" },
      { answer: "VELO", clue: "Deux roues à pédales" },
      { answer: "EAU", clue: "Liquide indispensable à la vie" },
      { answer: "MER", clue: "Grande étendue d'eau salée" },
    ],
  },
  moyen: {
    theme: "Côte d'Ivoire & savoirs",
    words: [
      { answer: "ABIDJAN", clue: "Capitale économique de la Côte d'Ivoire" },
      { answer: "AFRIQUE", clue: "Continent de la Côte d'Ivoire" },
      { answer: "CACAO", clue: "La Côte d'Ivoire en est le 1er producteur mondial" },
      { answer: "LAGUNE", clue: "Étendue d'eau bordant Abidjan" },
      { answer: "IGNAME", clue: "Tubercule très consommé en Côte d'Ivoire" },
      { answer: "ELEPHANT", clue: "Animal emblème de la Côte d'Ivoire" },
      { answer: "SCIENCE", clue: "Étude méthodique de la nature" },
      { answer: "NOMBRE", clue: "Objet de base des mathématiques" },
      { answer: "MEMOIRE", clue: "Faculté de se souvenir" },
      { answer: "LOGIQUE", clue: "Art du raisonnement juste" },
      { answer: "LECTURE", clue: "Action de lire" },
      { answer: "ECOLE", clue: "Établissement d'enseignement" },
    ],
  },
  difficile: {
    theme: "Études & numérique",
    words: [
      { answer: "ALGORITHME", clue: "Suite d'instructions pour résoudre un problème" },
      { answer: "ORDINATEUR", clue: "Machine à traiter l'information" },
      { answer: "NUMERIQUE", clue: "Qui traite l'information sous forme de nombres" },
      { answer: "UNIVERSITE", clue: "Établissement d'enseignement supérieur" },
      { answer: "PROFESSEUR", clue: "Celui qui enseigne" },
      { answer: "RECHERCHE", clue: "Investigation scientifique méthodique" },
      { answer: "MATRICULE", clue: "Numéro d'inscription de l'étudiant" },
      { answer: "ETUDIANT", clue: "Personne qui suit des études" },
      { answer: "DIPLOME", clue: "Titre délivré après réussite" },
      { answer: "SAVOIR", clue: "Ensemble des connaissances acquises" },
      { answer: "EXAMEN", clue: "Épreuve d'évaluation" },
      { answer: "LECTURE", clue: "Action de lire un texte" },
    ],
  },
};

const TARGET: Record<Level, number> = { facile: 5, moyen: 6, difficile: 7 };

type Dir = "across" | "down";
interface Placed {
  answer: string;
  clue: string;
  row: number;
  col: number;
  dir: Dir;
}

const key = (r: number, c: number) => `${r},${c}`;

function canPlace(grid: Map<string, string>, word: string, row: number, col: number, dir: Dir, first: boolean): boolean {
  const len = word.length;
  // case juste avant le début et juste après la fin doivent être vides
  const beforeR = row - (dir === "down" ? 1 : 0);
  const beforeC = col - (dir === "across" ? 1 : 0);
  if (grid.has(key(beforeR, beforeC))) return false;
  const afterR = row + (dir === "down" ? len : 0);
  const afterC = col + (dir === "across" ? len : 0);
  if (grid.has(key(afterR, afterC))) return false;

  let crossings = 0;
  let fresh = 0;
  for (let k = 0; k < len; k++) {
    const r = row + (dir === "down" ? k : 0);
    const c = col + (dir === "across" ? k : 0);
    const ex = grid.get(key(r, c));
    if (ex !== undefined) {
      if (ex !== word[k]) return false;
      crossings++;
    } else {
      fresh++;
      // les voisins perpendiculaires d'une nouvelle case doivent être vides (pas de mots collés)
      if (dir === "across") {
        if (grid.has(key(r - 1, c)) || grid.has(key(r + 1, c))) return false;
      } else {
        if (grid.has(key(r, c - 1)) || grid.has(key(r, c + 1))) return false;
      }
    }
  }
  if (!first && crossings < 1) return false;
  if (fresh < 1) return false;
  return true;
}

function place(grid: Map<string, string>, placed: Placed[], w: Word, row: number, col: number, dir: Dir) {
  for (let k = 0; k < w.answer.length; k++) {
    const r = row + (dir === "down" ? k : 0);
    const c = col + (dir === "across" ? k : 0);
    grid.set(key(r, c), w.answer[k]);
  }
  placed.push({ answer: w.answer, clue: w.clue, row, col, dir });
}

function attempt(words: Word[], target: number): Placed[] {
  const grid = new Map<string, string>();
  const placed: Placed[] = [];
  const pool = words.slice();
  place(grid, placed, pool.shift()!, 0, 0, "across");

  // plusieurs passes : un mot peut devenir plaçable après que d'autres aient été posés
  for (let pass = 0; pass < 4 && placed.length < target; pass++) {
    for (let i = 0; i < pool.length && placed.length < target; i++) {
      const w = pool[i];
      const word = w.answer;
      let done = false;
      for (const [k, letter] of grid) {
        if (done) break;
        const [pr, pc] = k.split(",").map(Number);
        for (let li = 0; li < word.length && !done; li++) {
          if (word[li] !== letter) continue;
          // croiser en descendant
          if (canPlace(grid, word, pr - li, pc, "down", false)) {
            place(grid, placed, w, pr - li, pc, "down");
            done = true;
          } else if (canPlace(grid, word, pr, pc - li, "across", false)) {
            // croiser à l'horizontale
            place(grid, placed, w, pr, pc - li, "across");
            done = true;
          }
        }
      }
      if (done) {
        pool.splice(i, 1);
        i--;
      }
    }
  }
  return placed;
}

export function generateCrossword(level: Level): CrosswordPuzzle {
  const { theme, words } = BANKS[level] ?? BANKS.facile;
  const target = TARGET[level] ?? 5;

  let best: Placed[] = [];
  for (let t = 0; t < 30; t++) {
    const shuffled = words
      .map((w) => ({ w, k: Math.random() }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.w);
    const res = attempt(shuffled, target);
    if (res.length > best.length) best = res;
    if (best.length >= target) break;
  }

  // normalise les coordonnées pour qu'elles commencent à (0,0)
  let minR = Infinity;
  let minC = Infinity;
  let maxR = -Infinity;
  let maxC = -Infinity;
  const solution: Record<string, string> = {};
  for (const p of best) {
    for (let k = 0; k < p.answer.length; k++) {
      const r = p.row + (p.dir === "down" ? k : 0);
      const c = p.col + (p.dir === "across" ? k : 0);
      minR = Math.min(minR, r);
      minC = Math.min(minC, c);
      maxR = Math.max(maxR, r);
      maxC = Math.max(maxC, c);
    }
  }
  const entriesRaw = best.map((p) => ({ ...p, row: p.row - minR, col: p.col - minC }));
  for (const p of entriesRaw) {
    for (let k = 0; k < p.answer.length; k++) {
      const r = p.row + (p.dir === "down" ? k : 0);
      const c = p.col + (p.dir === "across" ? k : 0);
      solution[key(r, c)] = p.answer[k];
    }
  }

  // numérotation : cases de départ uniques, en ordre de lecture
  const startKeys = Array.from(new Set(entriesRaw.map((p) => key(p.row, p.col))));
  startKeys.sort((a, b) => {
    const [ar, ac] = a.split(",").map(Number);
    const [br, bc] = b.split(",").map(Number);
    return ar - br || ac - bc;
  });
  const numOf = new Map<string, number>();
  startKeys.forEach((k, i) => numOf.set(k, i + 1));

  const entries: CrosswordEntry[] = entriesRaw
    .map((p) => ({ num: numOf.get(key(p.row, p.col))!, row: p.row, col: p.col, dir: p.dir, answer: p.answer, clue: p.clue }))
    .sort((a, b) => a.num - b.num);

  return {
    level,
    theme,
    rows: maxR - minR + 1,
    cols: maxC - minC + 1,
    entries,
    solution,
  };
}
