"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Grid2X2, Worm, Bomb, Play, type LucideIcon } from "lucide-react";
import { gamesConfig, type GameConfig } from "@/data/games";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";
import { staggerContainerVariants, cardVariants } from "@/utils/animations";

const Game2048 = dynamic(() => import("@/components/games/Game2048").then((m) => ({ default: m.Game2048 })), { ssr: false });
const GameSnake = dynamic(() => import("@/components/games/GameSnake").then((m) => ({ default: m.GameSnake })), { ssr: false });
const GameMinesweeper = dynamic(() => import("@/components/games/GameMinesweeper").then((m) => ({ default: m.GameMinesweeper })), { ssr: false });

const iconMap: Record<string, LucideIcon> = {
  Grid2X2, Worm, Bomb,
};

const gameComponents: Record<string, React.ComponentType> = {
  "2048": Game2048,
  snake: GameSnake,
  minesweeper: GameMinesweeper,
};

function GameCard({ game, onPlay }: { game: GameConfig; onPlay: () => void }) {
  const Icon = iconMap[game.icon] || Grid2X2;
  return (
    <GlassCard
      variants={cardVariants}
      className="group overflow-hidden cursor-pointer"
      hover
      onClick={onPlay}
    >
      {/* Icon area */}
      <div
        className="relative h-36 flex items-center justify-center border-b border-white/[0.06] overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${game.color}18 0%, transparent 70%)`,
        }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            background: `${game.color}18`,
            border: `1px solid ${game.color}35`,
            boxShadow: `0 0 20px ${game.color}20`,
          }}
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon size={28} style={{ color: game.color }} />
        </motion.div>

        {/* Play on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `${game.color}10`, backdropFilter: "blur(2px)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: game.color, boxShadow: `0 0 20px ${game.color}60` }}
          >
            <Play size={20} className="text-white ml-0.5" />
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-blue-300 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-white/40 leading-relaxed mb-4">{game.description}</p>
        <button
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-300"
          style={{
            color: game.color,
            borderColor: `${game.color}40`,
            background: `${game.color}10`,
          }}
          onClick={onPlay}
        >
          <Play size={12} />
          Play Now
        </button>
      </div>
    </GlassCard>
  );
}

export function GamesSection() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const enabledGames = gamesConfig.filter((g) => g.enabled);
  const activeConfig = enabledGames.find((g) => g.id === activeGame);
  const GameComponent = activeGame ? gameComponents[activeGame] : null;

  return (
    <section id="games" className="relative py-32 overflow-hidden">
      <div className="section-container">
        <SectionHeader
          label="Play"
          title="Mini Games"
          description="Take a break — play a game, beat a high score, or just explore."
        />

        <motion.div
          className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {enabledGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={() => setActiveGame(game.id)}
            />
          ))}
        </motion.div>
      </div>

      {/* Game Modal */}
      <Modal
        isOpen={!!activeGame}
        onClose={() => setActiveGame(null)}
        title={activeConfig?.title}
        size="xl"
      >
        {GameComponent && <GameComponent />}
      </Modal>
    </section>
  );
}
