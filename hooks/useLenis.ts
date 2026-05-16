"use client";
import { useEffect } from "react";

/** Initialize Lenis smooth scrolling */
export function useLenis(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let rafId: number;

    async function init() {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      }) as unknown as { raf: (time: number) => void; destroy: () => void };

      function raf(time: number) {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }

    init();

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [enabled]);
}
