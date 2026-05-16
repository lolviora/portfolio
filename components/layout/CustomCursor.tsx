"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 500, damping: 35, mass: 0.3 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const trailConfig = { stiffness: 150, damping: 25, mass: 0.5 };
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleEnter = (e: MouseEvent) => {
      const target = e.target as Element;
      const isInteractive =
        target.closest("a, button, [role=button], input, textarea, select, [data-cursor-hover]") !== null;
      setIsHovering(isInteractive);
    };

    const handleLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleEnter);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-2 h-2 rounded-full bg-white z-[9999] pointer-events-none mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Ring */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 rounded-full border border-blue-400/60 z-[9998] pointer-events-none"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovering ? 44 : 32,
          height: isHovering ? 44 : 32,
          borderColor: isHovering ? "rgba(139, 92, 246, 0.8)" : "rgba(59, 130, 246, 0.6)",
          boxShadow: isHovering
            ? "0 0 12px rgba(139, 92, 246, 0.4)"
            : "0 0 8px rgba(59, 130, 246, 0.3)",
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
