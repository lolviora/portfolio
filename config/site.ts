/**
 * SITE CONFIGURATION
 * ==================
 * This is the single source of truth for all site content and settings.
 * Edit this file to customize the portfolio without touching components.
 */

export const siteConfig = {
  // ── Identity ─────────────────────────────────────────────────────────────
  name: "Viora",
  tagline: "Software Engineer",
  domain: "viora.name",
  description:
    "Full-stack software engineer specializing in backend systems, automation, APIs, and scalable software architecture.",

  // ── Profile picture ───────────────────────────────────────────────────────
  // Replace with your actual image path in /public/assets/
  avatar: "/assets/avatar.png",

  // ── Background ────────────────────────────────────────────────────────────
  // Set to a string path for a static image, or null to use Three.js background
  backgroundImage: null as string | null,

  // ── Accent colors ─────────────────────────────────────────────────────────
  // These inject directly into CSS variables
  colors: {
    accentBlue: "#3b82f6",
    accentViolet: "#8b5cf6",
    accentCyan: "#06b6d4",
  },

  // ── Contact / Social links ────────────────────────────────────────────────
  // Set to null to hide a social link
  social: {
    github: "https://github.com/lolviora",
    discord: "@devviora",
    discordInvite: null as string | null, // e.g. "https://discord.gg/..."
    email: "viora@viora.name",
    telegram: null as string | null, // e.g. "https://t.me/yourhandle"
  },

  // ── Hero section ──────────────────────────────────────────────────────────
  hero: {
    greeting: "Hello, I'm",
    title: "Viora",
    subtitle: "Building the future, one system at a time.",
    // Typing animation words — add or remove freely
    typingWords: [
      "Python Developer",
      "Full Stack Engineer",
      "Lua Scripter",
      "Backend Engineer",
      "Software Architect",
      "Systems Developer",
      "Automation Engineer",
    ],
    ctaPrimary: { label: "View Projects", href: "#projects" },
    ctaSecondary: { label: "Contact Me", href: "#contact" },
  },

  // ── About section ─────────────────────────────────────────────────────────
  about: {
    bio: [
      "I'm a software engineer with extensive experience building scalable backend systems, automation tools, and full-stack applications. My work spans from high-performance APIs and game systems to modern web applications and system architecture.",
      "I care deeply about code quality, performance, and crafting software that's not just functional but elegant. Whether it's a low-latency backend service or an interactive frontend experience — precision is always the standard.",
    ],
    highlights: [
      { label: "Backend Systems", icon: "Server" },
      { label: "Automation", icon: "Zap" },
      { label: "Full-Stack Dev", icon: "Layers" },
      { label: "APIs", icon: "Globe" },
      { label: "Game Systems", icon: "Gamepad2" },
      { label: "Optimization", icon: "TrendingUp" },
    ],
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  // Set enabled: false to hide a nav item
  navItems: [
    { label: "Home", href: "#home", enabled: true },
    { label: "About", href: "#about", enabled: true },
    { label: "Skills", href: "#skills", enabled: true },
    { label: "Projects", href: "#projects", enabled: true },
    { label: "Experience", href: "#experience", enabled: false },
    { label: "Games", href: "#games", enabled: true },
    { label: "Contact", href: "#contact", enabled: true },
  ],

  // ── Section visibility ────────────────────────────────────────────────────
  // Toggle entire sections on/off
  sections: {
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: false,
    games: true,
    contact: true,
  },

  // ── Effects & performance ─────────────────────────────────────────────────
  effects: {
    particles: true,
    // Particle count is automatically reduced on mobile
    particleCount: 80,
    particleCountMobile: 30,
    customCursor: true,
    mouseGlow: true,
    ambientOrbs: true,
    threeJsBackground: true,
    smoothScrolling: true,
  },

  // ── Music ─────────────────────────────────────────────────────────────────
  // Set musicSrc to a path in /public/assets/ to enable the music player
  music: {
    enabled: false,
    src: null as string | null, // e.g. "/assets/music/ambient.mp3"
    label: "Ambient",
  },

  // ── SEO ───────────────────────────────────────────────────────────────────
  seo: {
    title: "Viora — Software Engineer",
    description:
      "Full-stack software engineer specializing in backend systems, automation, APIs, and scalable software architecture.",
    url: "https://viora.name",
    ogImage: "/assets/og-image.svg",
    twitterHandle: null as string | null,
  },
};

export type SiteConfig = typeof siteConfig;
