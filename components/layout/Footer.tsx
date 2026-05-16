"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t border-white/[0.06]">
      <div className="section-container">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold gradient-text">{siteConfig.name}</span>
            <span className="text-white/20">·</span>
            <span className="text-sm text-white/30">{siteConfig.domain}</span>
          </div>

          <p className="text-xs text-white/25 text-center">
            © {year} {siteConfig.name}. Built with Next.js & TypeScript.
          </p>

          <div className="flex items-center gap-4">
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white/70 transition-colors"
              >
                GitHub
              </a>
            )}
            {siteConfig.social.email && (
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="text-xs text-white/30 hover:text-white/70 transition-colors"
              >
                Email
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
