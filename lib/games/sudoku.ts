// Génération et résolution de grilles de Sudoku (9×9). Grille = number[81], 0 = case vide.

export type SudokuLevel = "facile" | "moyen" | "difficile";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function isValidPlacement(grid: number[], index: number, val: number): boolean {
  const r = Math.floor(index / 9);
  const c = index % 9;
  for (let i = 0; i < 9; i++) {
    if (i !== c && grid[r * 9 + i] === val) return false; // ligne
    if (i !== r && grid[i * 9 + c] === val) return false; // colonne
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const idx = (br + i) * 9 + (bc + j);
      if (idx !== index && grid[idx] === val) return false; // région 3×3
    }
  }
  return true;
}

function solve(grid: number[]): boolean {
  const idx = grid.indexOf(0);
  if (idx === -1) return true;
  for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (isValidPlacement(grid, idx, n)) {
      grid[idx] = n;
      if (solve(grid)) return true;
      grid[idx] = 0;
    }
  }
  return false;
}

function generateSolved(): number[] {
  const g = new Array(81).fill(0);
  solve(g);
  return g;
}

// Nombre de cases pré-remplies par niveau.
const GIVENS: Record<SudokuLevel, number> = { facile: 44, moyen: 34, difficile: 27 };

export interface SudokuPuzzle {
  puzzle: number[]; // grille de départ (avec des 0)
  solution: number[]; // solution complète
}

/** Génère une grille jouable et sa solution pour le niveau demandé. */
export function generateSudoku(level: SudokuLevel): SudokuPuzzle {
  const solution = generateSolved();
  const puzzle = solution.slice();
  const toRemove = 81 - (GIVENS[level] ?? 36);
  let removed = 0;
  for (const pos of shuffle([...Array(81).keys()])) {
    if (removed >= toRemove) break;
    puzzle[pos] = 0;
    removed++;
  }
  return { puzzle, solution };
}
