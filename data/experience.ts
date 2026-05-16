/**
 * EXPERIENCE DATA
 * ===============
 * Add, remove, or reorder experience entries here.
 * Displayed as an animated vertical timeline.
 */

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  tags: string[];
  current: boolean;
}

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Senior Software Engineer",
    company: "Freelance",
    period: "2022 — Present",
    description:
      "Designing and building scalable backend systems, automation tools, and full-stack applications for clients across multiple industries.",
    highlights: [
      "Built high-throughput API gateways handling 50k+ req/min",
      "Developed custom automation pipelines reducing manual work by 90%",
      "Architected microservice systems with zero-downtime deployments",
      "Delivered full-stack platforms from design to production",
    ],
    tags: ["Python", "Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
    current: true,
  },
  {
    id: "exp-2",
    role: "Backend Engineer",
    company: "Contract Projects",
    period: "2021 — 2022",
    description:
      "Focused on backend infrastructure, REST API development, and system optimization for mid-scale web applications.",
    highlights: [
      "Optimized database queries achieving 3x performance improvements",
      "Implemented OAuth2 and JWT authentication systems",
      "Built real-time WebSocket notification systems",
      "Created automated testing suites with 95%+ coverage",
    ],
    tags: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    current: false,
  },
  {
    id: "exp-3",
    role: "Full-Stack Developer",
    company: "Independent Projects",
    period: "2020 — 2021",
    description:
      "Developed complete web applications and tools, spanning frontend UI to backend logic and database architecture.",
    highlights: [
      "Built multiple SaaS-style web platforms from scratch",
      "Integrated third-party APIs including Stripe, Discord, and OpenAI",
      "Developed responsive UI systems with modern design principles",
      "Maintained open-source tools with active community usage",
    ],
    tags: ["JavaScript", "React", "Node.js", "MongoDB", "CSS"],
    current: false,
  },
  {
    id: "exp-4",
    role: "Lua / Game Developer",
    company: "Game Studios (Contract)",
    period: "2019 — 2020",
    description:
      "Specialized in Lua-based game development, building custom game frameworks, UI systems, and game logic for Roblox titles.",
    highlights: [
      "Shipped multiple games with 100k+ collective player visits",
      "Built reusable Lua component frameworks adopted by teams",
      "Optimized game performance to stable 60fps on low-end devices",
      "Designed animated UI systems with custom tweening engines",
    ],
    tags: ["Lua", "Roblox", "Game Design", "UI Systems"],
    current: false,
  },
];
