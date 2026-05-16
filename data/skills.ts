/**
 * SKILLS DATA
 * ===========
 * Add, remove, or reorder skills here. Each skill card renders automatically.
 */

export interface Skill {
  name: string;
  level: number; // 0-100
  category: "language" | "framework" | "tool" | "specialty";
  icon: string; // Icon name from lucide-react or a custom SVG path
  color: string; // Tailwind color class for the glow
  description: string;
}

export const skills: Skill[] = [
  {
    name: "Python",
    level: 95,
    category: "language",
    icon: "Code2",
    color: "#3b82f6",
    description: "Backend systems, automation, scripting",
  },
  {
    name: "Lua",
    level: 90,
    category: "language",
    icon: "FileCode",
    color: "#8b5cf6",
    description: "Game scripting, Roblox development",
  },
  {
    name: "JavaScript",
    level: 88,
    category: "language",
    icon: "Braces",
    color: "#f59e0b",
    description: "Full-stack web, Node.js",
  },
  {
    name: "Java",
    level: 80,
    category: "language",
    icon: "Coffee",
    color: "#ef4444",
    description: "Enterprise apps, game plugins",
  },
  {
    name: "C++",
    level: 75,
    category: "language",
    icon: "Cpu",
    color: "#06b6d4",
    description: "Performance-critical systems",
  },
  {
    name: "HTML / CSS",
    level: 92,
    category: "language",
    icon: "Layout",
    color: "#f97316",
    description: "Markup, modern CSS, animations",
  },
  {
    name: "Automation",
    level: 96,
    category: "specialty",
    icon: "Zap",
    color: "#f59e0b",
    description: "Bots, scrapers, workflow tools",
  },
  {
    name: "Backend Systems",
    level: 92,
    category: "specialty",
    icon: "HardDrive",
    color: "#06b6d4",
    description: "Architecture, scalability, APIs",
  },
];
