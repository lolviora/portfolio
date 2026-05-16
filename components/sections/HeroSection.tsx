"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ThreeBackground } from "@/components/layout/AmbientBackground";
import { GlowButton } from "@/components/ui/GlowButton";
import { fadeUpVariants, staggerContainerVariants } from "@/utils/animations";

function TypingAnimation({ words }: { words: string[] }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const word = words[currentWord];
    let timeout: NodeJS.Timeout;

    if (!deleting && charIndex < word.length) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, charIndex + 1));
        setCharIndex((i) => i + 1);
      }, 60);
    } else if (!deleting && charIndex === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(word.slice(0, charIndex - 1));
        setCharIndex((i) => i - 1);
      }, 35);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setCurrentWord((w) => (w + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, currentWord, deleting, words]);

  return (
    <span className="gradient-text">
      {displayed}
      <span className="animate-pulse text-blue-400">|</span>
    </span>
  );
}

export function HeroSection() {
  const { hero } = siteConfig;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js particle background */}
      <ThreeBackground />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting badge */}
        <motion.div variants={fadeUpVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs font-medium text-white/60 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Available for Projects
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div variants={fadeUpVariants}>
          <p className="text-white/40 text-lg md:text-xl font-light mb-2 tracking-wider">
            {hero.greeting}
          </p>
          <h1 className="text-7xl md:text-9xl font-black tracking-tight mb-4 leading-none">
            <span
              className="gradient-text"
              style={{
                textShadow: "0 0 80px rgba(59,130,246,0.3), 0 0 160px rgba(139,92,246,0.2)",
              }}
            >
              {hero.title}
            </span>
          </h1>
        </motion.div>

        {/* Typing animation */}
        <motion.div variants={fadeUpVariants} className="text-2xl md:text-3xl font-semibold mb-4 h-10">
          <TypingAnimation words={hero.typingWords} />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUpVariants}
          className="text-white/40 text-base md:text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed"
        >
          {hero.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <GlowButton variant="primary" size="lg" href={hero.ctaPrimary.href}>
            {hero.ctaPrimary.label}
            <ArrowRight size={18} />
          </GlowButton>
          <GlowButton variant="secondary" size="lg" href={hero.ctaSecondary.href}>
            <Mail size={16} />
            {hero.ctaSecondary.label}
          </GlowButton>
        </motion.div>

        {/* Tech stack pill row */}
        <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-2 justify-center">
          {["Python", "Lua", "JavaScript", "Java", "C++", "TypeScript"].map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 text-xs font-mono rounded-full glass border border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-300"
            >
              {lang}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
