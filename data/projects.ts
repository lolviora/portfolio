/**
 * PROJECTS DATA
 * =============
 * Add projects here. Each card renders automatically in the Projects section.
 * Set github/demo to null to hide those buttons.
 */

export type ProjectCategory =
  | "Web Development"
  | "Automation"
  | "Game Development"
  | "Backend Infrastructure"
  | "AI Tools"
  | "System Utilities";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string; // Path in /public/assets/projects/
  tags: string[];
  category: ProjectCategory;
  github: string | null;
  demo: string | null;
  featured: boolean; // Featured projects appear larger in the grid
  year: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "API Gateway Framework",
    description:
      "High-performance API gateway built in Python with rate limiting, auth middleware, and real-time analytics dashboard.",
    longDescription:
      "A production-ready API gateway framework featuring JWT authentication, Redis-backed rate limiting, request routing, and a real-time metrics dashboard. Handles 50k+ requests/minute.",
    image: "/assets/projects/api-gateway.png",
    tags: ["Python", "FastAPI", "Redis", "PostgreSQL", "Docker"],
    category: "Backend Infrastructure",
    github: "https://github.com/lolviora",
    demo: null,
    featured: true,
    year: "2024",
  },
  {
    id: "project-2",
    title: "Automation Bot Suite",
    description:
      "Multi-platform automation toolkit supporting Discord bots, web scrapers, and workflow automation with a unified config system.",
    longDescription:
      "A comprehensive automation suite built in Python featuring modular bot architecture, headless browser automation, data pipeline tools, and a web dashboard for monitoring.",
    image: "/assets/projects/automation-suite.png",
    tags: ["Python", "Selenium", "Discord.py", "PostgreSQL"],
    category: "Automation",
    github: "https://github.com/lolviora",
    demo: null,
    featured: true,
    year: "2024",
  },
  {
    id: "project-3",
    title: "Full-Stack Web Platform",
    description:
      "Modern SaaS-style web application with authentication, real-time features, and a polished responsive UI.",
    longDescription:
      "A complete full-stack platform featuring Next.js frontend, Node.js backend, WebSocket real-time updates, Stripe payments integration, and role-based access control.",
    image: "/assets/projects/web-platform.png",
    tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Stripe"],
    category: "Web Development",
    github: "https://github.com/lolviora",
    demo: null,
    featured: true,
    year: "2023",
  },
  {
    id: "project-4",
    title: "Lua Game Framework",
    description:
      "Custom game framework for Roblox featuring advanced physics systems, UI library, and modular game logic.",
    longDescription:
      "A production-grade Lua framework for Roblox game development. Includes a component-entity system, custom physics interactions, animated UI components, and a data store abstraction layer.",
    image: "/assets/projects/lua-framework.png",
    tags: ["Lua", "Roblox Studio", "Game Development"],
    category: "Game Development",
    github: "https://github.com/lolviora",
    demo: null,
    featured: false,
    year: "2023",
  },
  {
    id: "project-5",
    title: "AI Content Tool",
    description:
      "AI-powered content generation and editing tool with a clean web interface and multiple model integrations.",
    longDescription:
      "A web application that integrates multiple AI models for content generation, editing, and summarization. Features a rich text editor, prompt history, and team collaboration tools.",
    image: "/assets/projects/ai-tool.png",
    tags: ["Python", "OpenAI API", "React", "TypeScript"],
    category: "AI Tools",
    github: "https://github.com/lolviora",
    demo: null,
    featured: false,
    year: "2024",
  },
  {
    id: "project-6",
    title: "System Monitor CLI",
    description:
      "Cross-platform CLI system monitoring tool with real-time metrics, alerting, and exportable reports.",
    longDescription:
      "A powerful command-line tool for system monitoring and performance analysis. Features real-time CPU/memory/disk metrics, customizable alerts, log aggregation, and HTML report export.",
    image: "/assets/projects/system-monitor.png",
    tags: ["Python", "C++", "CLI", "Cross-platform"],
    category: "System Utilities",
    github: "https://github.com/lolviora",
    demo: null,
    featured: false,
    year: "2023",
  },
];

export const projectCategories: ProjectCategory[] = [
  "Web Development",
  "Automation",
  "Game Development",
  "Backend Infrastructure",
  "AI Tools",
  "System Utilities",
];
