"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glow?: boolean;
  glowColor?: "blue" | "violet" | "cyan";
  hover?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  glow = false,
  glowColor = "blue",
  hover = true,
  className,
  ...props
}: GlassCardProps) {
  const glowMap = {
    blue: "hover:shadow-glow-blue hover:border-blue-500/30",
    violet: "hover:shadow-glow-violet hover:border-violet-500/30",
    cyan: "hover:shadow-glow-cyan hover:border-cyan-500/30",
  };

  return (
    <motion.div
      className={cn(
        "glass rounded-2xl",
        hover && "glass-hover",
        hover && glowMap[glowColor],
        glow && glowColor === "blue" && "shadow-glow-blue border-blue-500/20",
        glow && glowColor === "violet" && "shadow-glow-violet border-violet-500/20",
        glow && glowColor === "cyan" && "shadow-glow-cyan border-cyan-500/20",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
