"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { gamesConfig } from "@/data/games";

const SIZE = 4;

// Each cell carries a unique id so Framer Motion can track tiles across moves
type Cell = { value: number; id: number; isNew: boolean; isMerged: boolean } | null;
type Board = Cell[][];

let nextId = 1;
function uid() { return nextId++; }

const config = gamesConfig.find((g) => g.id === "2048")!;

function createEmpty(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

function addRandom(board: Board): Board {
  const empty: [number, number][] = [];
  board.forEach((row, r) => row.forEach((cell, c) => { if (!cell) empty.push([r, c]); }));
  if (!empty.length) return board;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = board.map((row) => [...row]) as Board;
  next[r][c] = { value: Math.random() < 0.9 ? 2 : 4, id: uid(), isNew: true, isMerged: false };
  return next;
}

function initBoard(): Board {
  return addRandom(addRandom(createEmpty()));
}

// Slide a row of Cell objects left, preserving IDs and marking merges
function slideRow(row: Cell[]): { result: Cell[]; score: number } {
  const filtered = row.filter(Boolean) as NonNullable<Cell>[];
  let score = 0;
  const merged: Cell[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i]!.value === filtered[i + 1]!.value) {
      const val = filtered[i]!.value * 2;
      score += val;
      merged.push({ value: val, id: uid(), isNew: false, isMerged: true });
      i += 2;
    } else {
      merged.push({ ...filtered[i]!, isNew: false, isMerged: false });
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(null);
  return { result: merged, score };
}

function moveBoard(board: Board, dir: "left" | "right" | "up" | "down"): { board: Board; score: number; moved: boolean } {
  let totalScore = 0;
  let moved = false;

  const applySlide = (rows: Cell[][]): Cell[][] =>
    rows.map((row) => {
      const { result, score } = slideRow(row);
      totalScore += score;
      if (result.some((v, i) => v?.value !== row[i]?.value || (v === null) !== (row[i] === null))) moved = true;
      return result;
    });

  const transpose = (b: Cell[][]): Cell[][] =>
    Array.from({ length: SIZE }, (_, c) => b.map((r) => r[c]));

  let next = board.map((r) => [...r]);

  if (dir === "left") {
    next = applySlide(next);
  } else if (dir === "right") {
    next = applySlide(next.map((r) => [...r].reverse())).map((r) => [...r].reverse());
  } else if (dir === "up") {
    next = transpose(applySlide(transpose(next)));
  } else {
    const t = transpose(next).map((r) => [...r].reverse());
    next = transpose(applySlide(t).map((r) => [...r].reverse()));
  }

  return { board: next, score: totalScore, moved };
}

const tileColors: Record<number, { bg: string; text: string; glow: string }> = {
  2:    { bg: "rgba(59,130,246,0.18)",  text: "#93c5fd", glow: "rgba(59,130,246,0.25)" },
  4:    { bg: "rgba(59,130,246,0.28)",  text: "#60a5fa", glow: "rgba(59,130,246,0.35)" },
  8:    { bg: "rgba(99,102,241,0.32)",  text: "#a5b4fc", glow: "rgba(99,102,241,0.4)" },
  16:   { bg: "rgba(139,92,246,0.36)",  text: "#c4b5fd", glow: "rgba(139,92,246,0.45)" },
  32:   { bg: "rgba(168,85,247,0.4)",   text: "#d8b4fe", glow: "rgba(168,85,247,0.5)" },
  64:   { bg: "rgba(192,38,211,0.44)",  text: "#f0abfc", glow: "rgba(192,38,211,0.55)" },
  128:  { bg: "rgba(236,72,153,0.42)",  text: "#f9a8d4", glow: "rgba(236,72,153,0.52)" },
  256:  { bg: "rgba(244,63,94,0.42)",   text: "#fda4af", glow: "rgba(244,63,94,0.52)" },
  512:  { bg: "rgba(249,115,22,0.46)",  text: "#fdba74", glow: "rgba(249,115,22,0.55)" },
  1024: { bg: "rgba(234,179,8,0.46)",   text: "#fde047", glow: "rgba(234,179,8,0.55)" },
  2048: { bg: "rgba(34,197,94,0.52)",   text: "#86efac", glow: "rgba(34,197,94,0.65)" },
};

function getColors(val: number) {
  return tileColors[val] ?? { bg: "rgba(34,197,94,0.6)", text: "#86efac", glow: "rgba(34,197,94,0.7)" };
}

function fontSize(val: number) {
  if (val >= 1024) return "text-xs md:text-sm";
  if (val >= 128) return "text-sm md:text-base";
  return "text-base md:text-lg";
}

export function Game2048() {
  const [board, setBoard] = useState<Board>(initBoard);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage(config.highScoreKey, 0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const isGameOver = useCallback((b: Board) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!b[r][c]) return false;
        if (c < SIZE - 1 && b[r][c]?.value === b[r][c + 1]?.value) return false;
        if (r < SIZE - 1 && b[r][c]?.value === b[r + 1][c]?.value) return false;
      }
    }
    return true;
  }, []);

  const move = useCallback((dir: "left" | "right" | "up" | "down") => {
    if (over) return;
    setBoard((prev) => {
      const { board: next, score: gained, moved } = moveBoard(prev, dir);
      if (!moved) return prev;
      const withNew = addRandom(next);
      if (gained > 0) {
        setScore((s) => {
          const updated = s + gained;
          setHighScore((h) => Math.max(h, updated));
          return updated;
        });
      }
      if (withNew.some((r) => r.some((c) => c?.value === 2048))) setWon(true);
      if (isGameOver(withNew)) setOver(true);
      return withNew;
    });
  }, [over, isGameOver, setHighScore]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
        a: "left", d: "right", w: "up", s: "down",
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); move(dir); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left");
    else move(dy > 0 ? "down" : "up");
    touchStart.current = null;
  };

  const restart = () => {
    setBoard(initBoard());
    setScore(0);
    setWon(false);
    setOver(false);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col items-center gap-4 select-none min-h-[500px]">
      {/* Header */}
      <div className="w-full max-w-[360px] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold gradient-text">2048</h2>
          <p className="text-xs text-white/30">Combine tiles to reach 2048</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center glass px-3 py-1.5 rounded-xl border border-white/10">
            <p className="text-xs text-white/30 font-medium">Score</p>
            <p className="text-base font-bold text-white tabular-nums">{score}</p>
          </div>
          <div className="text-center glass px-3 py-1.5 rounded-xl border border-white/10">
            <p className="text-xs text-white/30 font-medium flex items-center gap-1"><Trophy size={10} />Best</p>
            <p className="text-base font-bold gradient-text tabular-nums">{highScore}</p>
          </div>
          <button
            onClick={restart}
            className="p-2 rounded-xl glass border border-white/10 text-white/50 hover:text-white hover:border-blue-500/40 transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Board */}
      <div
        className="relative w-full max-w-[360px] aspect-square rounded-2xl border border-white/[0.07] p-2"
        style={{ background: "rgba(10,10,20,0.7)" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Empty cell grid */}
        <div className="grid gap-2 absolute inset-2" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {Array.from({ length: SIZE * SIZE }).map((_, i) => (
            <div key={i} className="rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }} />
          ))}
        </div>

        {/* Tile layer — flat list so AnimatePresence can track each id */}
        <div className="grid gap-2 relative" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {board.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) {
                return <div key={`empty-${r}-${c}`} className="aspect-square" />;
              }
              const col = getColors(cell.value);
              return (
                <motion.div
                  key={cell.id}
                  className={`aspect-square rounded-xl flex items-center justify-center font-black ${fontSize(cell.value)}`}
                  style={{
                    background: col.bg,
                    border: `1px solid ${col.text}25`,
                    color: col.text,
                    boxShadow: `0 0 16px ${col.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                  }}
                  initial={cell.isNew ? { scale: 0, opacity: 0 } : cell.isMerged ? { scale: 1.15 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={
                    cell.isMerged
                      ? { type: "spring", stiffness: 600, damping: 18 }
                      : { type: "spring", stiffness: 500, damping: 22 }
                  }
                >
                  {cell.value}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Win / Game Over overlay */}
        <AnimatePresence>
          {(won || over) && (
            <motion.div
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3"
              style={{ background: "rgba(5,5,8,0.88)", backdropFilter: "blur(10px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.p
                className={`text-3xl font-black ${won ? "gradient-text" : "text-red-400"}`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
              >
                {won ? "You Won! 🎉" : "Game Over"}
              </motion.p>
              <p className="text-white/50 text-sm">Score: {score}</p>
              <motion.button
                onClick={restart}
                className="px-6 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white text-sm font-medium transition-all border border-blue-500/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                Play Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-white/20 text-center">Arrow keys / WASD to move • Swipe on mobile</p>
    </div>
  );
}
