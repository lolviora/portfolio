"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return prev + Math.random() * 12 + 3;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Ambient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
                filter: "blur(40px)",
                animation: "orb-drift 8s ease-in-out infinite",
              }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-20"
              style={{
                background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
                filter: "blur(40px)",
                animation: "orb-drift 10s ease-in-out infinite reverse",
              }}
            />
          </div>

          {/* Logo */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold gradient-text tracking-widest mb-3">
              {siteConfig.name}
            </h1>
            <p className="text-white/30 text-sm tracking-[0.3em] uppercase font-medium">
              {siteConfig.tagline}
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="w-48 h-px bg-white/10 relative overflow-hidden rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                width: `${Math.min(progress, 100)}%`,
              }}
              transition={{ duration: 0.15 }}
            />
          </motion.div>

          {/* Percentage */}
          <motion.p
            className="mt-3 text-xs text-white/25 font-mono tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
