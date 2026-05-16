"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Pause, Play, Trophy } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { gamesConfig } from "@/data/games";

const CELL = 20;
const COLS = 20;
const ROWS = 20;

const config = gamesConfig.find((g) => g.id === "snake")!;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function randomFood(snake: Point[]): Point {
  let pos: Point;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export function GameSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Point[],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 15, y: 10 } as Point,
    score: 0,
    running: false,
    over: false,
    speed: 150,
  });
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage(config.highScoreKey, 0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const pausedRef = useRef(false);
  const loopRef = useRef<NodeJS.Timeout | null>(null);
  const touchStart = useRef<Point | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { snake, food } = stateRef.current;
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.fillStyle = "rgba(5,5,12,1)";
    ctx.fillRect(0, 0, W, H);

    // Subtle dot grid
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.beginPath();
        ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Food — pulsing orb
    const now = performance.now();
    const pulse = 0.8 + 0.2 * Math.sin(now / 300);
    const fx = food.x * CELL + CELL / 2;
    const fy = food.y * CELL + CELL / 2;
    const foodRadius = (CELL / 2 - 3) * pulse;

    // Outer glow ring
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 18 * pulse;
    const foodGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, foodRadius);
    foodGrad.addColorStop(0, "#e879f9");
    foodGrad.addColorStop(0.6, "#a855f7");
    foodGrad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = foodGrad;
    ctx.beginPath();
    ctx.arc(fx, fy, foodRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Specular highlight on food
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(fx - foodRadius * 0.25, fy - foodRadius * 0.3, foodRadius * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Snake — head to tail with color gradient and fading opacity
    snake.forEach((seg, i) => {
      const t = 1 - i / Math.max(snake.length, 1); // 1 at head, 0 at tail
      const sx = seg.x * CELL + 1;
      const sy = seg.y * CELL + 1;
      const sw = CELL - 2;
      const sh = CELL - 2;
      const r = i === 0 ? 7 : i === snake.length - 1 ? 4 : 5;

      // Glow on head and near-head segments
      if (i < 4) {
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 14 * (1 - i / 4);
      } else {
        ctx.shadowBlur = 0;
      }

      // Body color: bright cyan-blue head → deep blue tail
      const headR = 56, headG = 189, headB = 248;   // #38bdf8
      const tailR = 29, tailG = 78,  tailB = 216;    // #1d4ed8
      const segR = Math.round(tailR + (headR - tailR) * t);
      const segG = Math.round(tailG + (headG - tailG) * t);
      const segB = Math.round(tailB + (headB - tailB) * t);
      const alpha = 0.25 + t * 0.75;

      ctx.fillStyle = `rgba(${segR},${segG},${segB},${alpha})`;
      drawRoundRect(ctx, sx, sy, sw, sh, r);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner shimmer line on body
      if (t > 0.3) {
        ctx.fillStyle = `rgba(255,255,255,${0.06 * t})`;
        drawRoundRect(ctx, sx + 2, sy + 1, sw - 4, 3, 2);
        ctx.fill();
      }

      // Head details: eyes + nose highlight
      if (i === 0) {
        const dir = stateRef.current.dir;
        // Eye offsets by direction
        const eyePositions: Record<string, [number, number, number, number]> = {
          RIGHT: [sw - 6, 4, sw - 6, sh - 6],
          LEFT:  [3, 4, 3, sh - 6],
          UP:    [4, 3, sw - 6, 3],
          DOWN:  [4, sh - 6, sw - 6, sh - 6],
        };
        const [e1x, e1y, e2x, e2y] = eyePositions[dir] || eyePositions.RIGHT;

        // Eye whites
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(sx + e1x, sy + e1y, 2.5, 0, Math.PI * 2);
        ctx.arc(sx + e2x, sy + e2y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = "rgba(15,15,30,0.95)";
        ctx.beginPath();
        ctx.arc(sx + e1x + 0.5, sy + e1y + 0.5, 1.2, 0, Math.PI * 2);
        ctx.arc(sx + e2x + 0.5, sy + e2y + 0.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, []);

  const tick = useCallback(() => {
    if (pausedRef.current) return;
    const s = stateRef.current;
    s.dir = s.nextDir;
    const head = s.snake[0];
    const next: Point = {
      x: (head.x + (s.dir === "RIGHT" ? 1 : s.dir === "LEFT" ? -1 : 0) + COLS) % COLS,
      y: (head.y + (s.dir === "DOWN" ? 1 : s.dir === "UP" ? -1 : 0) + ROWS) % ROWS,
    };

    if (s.snake.slice(1).some((seg) => seg.x === next.x && seg.y === next.y)) {
      s.over = true;
      s.running = false;
      setGameOver(true);
      setHighScore((h) => Math.max(h, s.score));
      draw();
      return;
    }

    const ate = next.x === s.food.x && next.y === s.food.y;
    s.snake = [next, ...s.snake.slice(0, ate ? undefined : s.snake.length - 1)];
    if (ate) {
      s.score += 10;
      s.food = randomFood(s.snake);
      setDisplayScore(s.score);
      s.speed = Math.max(60, s.speed - 2);
    }

    draw();

    if (s.running && !s.over) {
      loopRef.current = setTimeout(tick, s.speed);
    }
  }, [draw, setHighScore]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }];
    s.dir = "RIGHT";
    s.nextDir = "RIGHT";
    s.food = randomFood(s.snake);
    s.score = 0;
    s.running = true;
    s.over = false;
    s.speed = 150;
    setDisplayScore(0);
    setGameOver(false);
    setStarted(true);
    pausedRef.current = false;
    setPaused(false);
    if (loopRef.current) clearTimeout(loopRef.current);
    loopRef.current = setTimeout(tick, s.speed);
  }, [tick]);

  const togglePause = useCallback(() => {
    if (gameOver) return;
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    if (!pausedRef.current) {
      loopRef.current = setTimeout(tick, stateRef.current.speed);
    }
  }, [gameOver, tick]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s.running) return;
      const dirs: Record<string, Dir> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
      };
      const d = dirs[e.key];
      if (!d) return;
      const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (d !== opp[s.dir]) s.nextDir = d;
      if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
      if (e.key === " ") togglePause();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  // Continuous RAF for food pulse animation
  useEffect(() => {
    let rafId: number;
    const animate = () => {
      draw();
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      if (loopRef.current) clearTimeout(loopRef.current);
    };
  }, [draw]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const s = stateRef.current;
    const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    let d: Dir | null = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      d = dx > 0 ? "RIGHT" : "LEFT";
    } else {
      d = dy > 0 ? "DOWN" : "UP";
    }
    if (d && d !== opp[s.dir]) s.nextDir = d;
    touchStart.current = null;
  };

  return (
    <div className="p-4 md:p-6 flex flex-col items-center gap-4 select-none">
      {/* Header */}
      <div className="w-full max-w-[420px] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold gradient-text">Snake</h2>
          <p className="text-xs text-white/30">Eat to grow, don&apos;t hit yourself</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center glass px-3 py-1.5 rounded-xl border border-white/10">
            <p className="text-xs text-white/30">Score</p>
            <p className="text-base font-bold text-white">{displayScore}</p>
          </div>
          <div className="text-center glass px-3 py-1.5 rounded-xl border border-white/10">
            <p className="text-xs text-white/30 flex items-center gap-1"><Trophy size={10} />Best</p>
            <p className="text-base font-bold gradient-text">{highScore}</p>
          </div>
          {started && !gameOver && (
            <button onClick={togglePause} className="p-2 rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-all">
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          )}
          <button onClick={startGame} className="p-2 rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-all">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.07]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="block"
          style={{ maxWidth: "100%", maxHeight: "60vw" }}
        />

        {/* Start overlay */}
        <AnimatePresence>
          {!started && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-2xl font-black gradient-text">Snake</p>
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white font-medium transition-all border border-blue-500/50"
              >
                Start Game
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paused overlay */}
        <AnimatePresence>
          {paused && !gameOver && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: "rgba(5,5,8,0.7)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-2xl font-black text-white/70">Paused</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game over overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-3xl font-black text-red-400">Game Over</p>
              <p className="text-white/50 text-sm">Score: {displayScore}</p>
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white text-sm font-medium transition-all border border-blue-500/50"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-white/20">Arrow keys / WASD • Space to pause • Swipe on mobile</p>
    </div>
  );
}
