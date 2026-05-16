"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function GlowButton({
  variant = "primary",
  size = "md",
  href,
  children,
  className,
  ...props
}: GlowButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-violet-600 text-white border border-blue-500/30 hover:shadow-glow-blue hover:from-blue-500 hover:to-violet-500",
    secondary:
      "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-glass",
    outline:
      "bg-transparent text-white border border-blue-500/50 hover:bg-blue-500/10 hover:border-blue-500 hover:shadow-glow-blue",
  };

  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2 font-medium rounded-xl",
    "transition-all duration-300 cursor-pointer select-none",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const content = (
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="inline-flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {content}
    </button>
  );
}
