"use client";
import { motion } from "framer-motion";
import { fadeUpVariants } from "@/utils/animations";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({ label, title, description, align = "center" }: SectionHeaderProps) {
  return (
    <motion.div
      className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUpVariants}
    >
      {/* Label */}
      <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-blue-400 mb-4">
        <span className="h-px w-8 bg-gradient-to-r from-blue-500 to-violet-500" />
        {label}
        <span className="h-px w-8 bg-gradient-to-r from-violet-500 to-blue-500" />
      </span>

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        <span className="gradient-text">{title}</span>
      </h2>

      {/* Description */}
      {description && (
        <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
