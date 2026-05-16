"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bomb, Flag, Clock, Trophy, RotateCcw } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { gamesConfig, minesweeperDifficulties, type MinesweeperDifficulty } from "@/data/games";
import { cn } from "@/utils/cn";

const config = gamesConfig.find((g) => g.id === "minesweeper")!;

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
};

function buildBoard(rows: number, cols: number, mines: number, firstR: number, firstC: number): Cell[][] {
  const board: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].mine) continue;
    if (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1) continue;
    board[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let adj = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr; const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) adj++;
        }
      }
      board[r][c].adjacent = adj;
    }
  }
  return board;
}

function revealFlood(board: Cell[][], r: number, c: number): Cell[][] {
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const queue: [number, number][] = [[r, c]];
  while (queue.length) {
    const [cr, cc] = queue.shift()!;
    const cell = next[cr][cc];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.adjacent === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = cr + dr; const nc = cc + dc;
          if (nr >= 0 && nr < next.length && nc >= 0 && nc < next[0].length && !next[nr][nc].revealed) {
            queue.push([nr, nc]);
          }
        }
      }
    }
  }
  return next;
}

const numColors: Record<number, string> = {
  1: "#60a5fa", 2: "#34d399", 3: "#f87171", 4: "#818cf8",
  5: "#f97316", 6: "#06b6d4", 7: "#c084fc", 8: "#94a3b8",
};

export function GameMinesweeper() {
  const [difficulty, setDifficulty] = useState<MinesweeperDifficulty>("easy");
  const [board, setBoard] = useState<Cell[][] | null>(null);
  const [firstClick, setFirstClick] = useState(true);
  const [status, setStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [bestTime, setBestTime] = useLocalStorage(config.highScoreKey, 9999);
  const timerRef = { current: null as NodeJS.Timeout | null };

  const diff = minesweeperDifficulties[difficulty];

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const newGame = (diff?: MinesweeperDifficulty) => {
    stopTimer();
    setBoard(null);
    setFirstClick(true);
    setStatus("idle");
    setElapsed(0);
    if (diff) setDifficulty(diff);
  };

  const flagCount = board?.flat().filter((c) => c.flagged).length ?? 0;
  const minesLeft = diff.mines - flagCount;

  const handleReveal = (r: number, c: number) => {
    if (status === "won" || status === "lost") return;
    let b = board;

    if (!b || firstClick) {
      b = buildBoard(diff.rows, diff.cols, diff.mines, r, c);
      setFirstClick(false);
      setStatus("playing");
      startTimer();
    }

    const cell = b[r][c];
    if (cell.revealed || cell.flagged) return;

    if (cell.mine) {
      const exploded = b.map((row) => row.map((c) => ({ ...c, revealed: c.mine ? true : c.revealed })));
      setBoard(exploded);
      setStatus("lost");
      stopTimer();
      return;
    }

    const next = revealFlood(b, r, c);
    const won = next.flat().every((c) => c.revealed || c.mine);
    setBoard(next);
    if (won) {
      setStatus("won");
      stopTimer();
      if (elapsed < bestTime) setBestTime(elapsed);
    }
  };

  const handleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === "won" || status === "lost" || !board) return;
    const cell = board[r][c];
    if (cell.revealed) return;
    const next = board.map((row) => row.map((c) => ({ ...c })));
    next[r][c].flagged = !next[r][c].flagged;
    setBoard(next);
  };

  const displayBoard = board ?? Array.from({ length: diff.rows }, () =>
    Array.from({ length: diff.cols }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );

  const cellSize = difficulty === "easy" ? 36 : difficulty === "medium" ? 28 : 22;

  return (
    <div className="p-4 md:p-6 flex flex-col items-center gap-4 select-none">
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold gradient-text">Minesweeper</h2>
          <p className="text-xs text-white/30">Clear the field without hitting a mine</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 text-sm">
            <Bomb size={13} className="text-red-400" />
            <span className="font-mono font-bold text-white">{minesLeft}</span>
          </div>
          <div className="glass px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 text-sm">
            <Clock size={13} className="text-blue-400" />
            <span className="font-mono font-bold text-white">{elapsed}s</span>
          </div>
          {bestTime < 9999 && (
            <div className="glass px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 text-sm">
              <Trophy size={13} className="text-yellow-400" />
              <span className="font-mono font-bold gradient-text">{bestTime}s</span>
            </div>
          )}
          <button onClick={() => newGame()} className="p-2 rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-all">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex gap-2">
        {(Object.keys(minesweeperDifficulties) as MinesweeperDifficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => newGame(d)}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-lg border transition-all",
              difficulty === d
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "glass border-white/10 text-white/50 hover:text-white"
            )}
          >
            {minesweeperDifficulties[d].label}
          </button>
        ))}
      </div>

      {/* Board */}
      <div className="relative overflow-auto max-w-full">
        <div
          className="inline-grid gap-[2px] p-3 glass rounded-2xl border border-white/[0.07]"
          style={{ gridTemplateColumns: `repeat(${diff.cols}, ${cellSize}px)` }}
        >
          {displayBoard.map((row, r) =>
            row.map((cell, c) => (
              <motion.button
                key={`${r}-${c}`}
                onClick={() => handleReveal(r, c)}
                onContextMenu={(e) => handleFlag(e, r, c)}
                className={cn(
                  "flex items-center justify-center rounded-md text-xs font-bold transition-all duration-150 border",
                  cell.revealed
                    ? cell.mine
                      ? "bg-red-500/30 border-red-500/50"
                      : "bg-white/[0.03] border-white/[0.05]"
                    : "bg-white/[0.06] border-white/[0.1] hover:bg-white/[0.1] hover:border-white/20 active:scale-95"
                )}
                style={{ width: cellSize, height: cellSize }}
                whileTap={{ scale: 0.9 }}
              >
                {cell.revealed && cell.mine && <Bomb size={cellSize * 0.45} className="text-red-400" />}
                {cell.revealed && !cell.mine && cell.adjacent > 0 && (
                  <span style={{ color: numColors[cell.adjacent], fontSize: cellSize * 0.45 }}>
                    {cell.adjacent}
                  </span>
                )}
                {!cell.revealed && cell.flagged && <Flag size={cellSize * 0.45} className="text-red-400" />}
              </motion.button>
            ))
          )}
        </div>

        {/* Overlay */}
        <AnimatePresence>
          {(status === "won" || status === "lost") && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl"
              style={{ background: "rgba(5,5,8,0.88)", backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className={`text-3xl font-black ${status === "won" ? "gradient-text" : "text-red-400"}`}>
                {status === "won" ? "You Win! 🎉" : "💥 Boom!"}
              </p>
              {status === "won" && <p className="text-white/50 text-sm">Time: {elapsed}s</p>}
              <button
                onClick={() => newGame()}
                className="px-6 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white text-sm font-medium transition-all border border-blue-500/50"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-white/20">Left click to reveal • Right click to flag</p>
    </div>
  );
}
