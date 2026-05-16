/**
 * GAMES DATA
 * ==========
 * Configure the games section here.
 * Set enabled: false to hide a game card without deleting code.
 */

export interface GameConfig {
  id: "2048" | "snake" | "minesweeper";
  title: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Accent color for glow
  enabled: boolean;
  highScoreKey: string; // localStorage key
}

export const gamesConfig: GameConfig[] = [
  {
    id: "2048",
    title: "2048",
    description: "Slide tiles to combine them and reach the 2048 tile. How high can you score?",
    icon: "Grid2X2",
    color: "#8b5cf6",
    enabled: true,
    highScoreKey: "viora_2048_highscore",
  },
  {
    id: "snake",
    title: "Snake",
    description: "Classic neon snake — eat, grow, avoid the walls. Speed increases as you score.",
    icon: "Worm",
    color: "#3b82f6",
    enabled: true,
    highScoreKey: "viora_snake_highscore",
  },
  {
    id: "minesweeper",
    title: "Minesweeper",
    description: "Clear the minefield using logic. Choose your difficulty and beat the clock.",
    icon: "Bomb",
    color: "#06b6d4",
    enabled: true,
    highScoreKey: "viora_minesweeper_bestscore",
  },
];

export const minesweeperDifficulties = {
  easy: { rows: 9, cols: 9, mines: 10, label: "Easy" },
  medium: { rows: 16, cols: 16, mines: 40, label: "Medium" },
  hard: { rows: 16, cols: 30, mines: 99, label: "Hard" },
} as const;

export type MinesweeperDifficulty = keyof typeof minesweeperDifficulties;
