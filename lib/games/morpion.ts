// Moteur du Morpion (tic-tac-toe) pour le « Défi IA contre humain ».
// L'humain joue les X (premier), l'IA joue les O. La force de l'IA dépend du niveau.
import type { Level } from "./catalog";

export type Cell = "X" | "O" | null;
export type Board = Cell[]; // 9 cases (0..8)

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** Renvoie « X » / « O » si une ligne est complète, « draw » si plateau plein, sinon null. */
export function winner(board: Board): "X" | "O" | "draw" | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a] as "X" | "O";
  }
  return board.every((c) => c !== null) ? "draw" : null;
}

export function winningLine(board: Board): number[] | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

const emptyCells = (board: Board) => board.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);

// Minimax : score du point de vue de l'IA (« O »). +10 victoire IA, -10 victoire humain, 0 nul.
function minimax(board: Board, isAiTurn: boolean, depth: number): number {
  const w = winner(board);
  if (w === "O") return 10 - depth;
  if (w === "X") return depth - 10;
  if (w === "draw") return 0;

  const scores = emptyCells(board).map((i) => {
    const next = board.slice();
    next[i] = isAiTurn ? "O" : "X";
    return minimax(next, !isAiTurn, depth + 1);
  });
  return isAiTurn ? Math.max(...scores) : Math.min(...scores);
}

/** Meilleur coup pour l'IA (« O ») selon le minimax. */
export function bestMove(board: Board): number {
  const cells = emptyCells(board);
  let best = cells[0];
  let bestScore = -Infinity;
  for (const i of cells) {
    const next = board.slice();
    next[i] = "O";
    const score = minimax(next, false, 0);
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}

const randomMove = (board: Board) => {
  const cells = emptyCells(board);
  return cells[Math.floor(Math.random() * cells.length)];
};

/**
 * Coup de l'IA selon le niveau :
 * - facile : aléatoire (l'IA se laisse battre) ;
 * - moyen : optimal une fois sur deux, sinon aléatoire ;
 * - difficile : toujours optimal (imbattable, au mieux le nul).
 */
export function aiMove(board: Board, level: Level): number {
  if (emptyCells(board).length === 0) return -1;
  if (level === "facile") return randomMove(board);
  if (level === "moyen") return Math.random() < 0.55 ? bestMove(board) : randomMove(board);
  return bestMove(board);
}
