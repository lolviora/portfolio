"use client";
import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";

/** Three.js animated particle field background for the hero */
export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!siteConfig.effects.threeJsBackground) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let THREE: typeof import("three");

    async function init() {
      THREE = await import("three");
      const renderer = new THREE.WebGLRenderer({ canvas: canvas!, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Particle geometry
      const count = 2000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        const t = Math.random();
        colors[i * 3] = t > 0.5 ? 0.23 : 0.55;
        colors[i * 3 + 1] = t > 0.5 ? 0.51 : 0.36;
        colors[i * 3 + 2] = t > 0.5 ? 0.96 : 0.96;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Mouse interaction
      let mouseX = 0;
      let mouseY = 0;
      const handleMouse = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", handleMouse, { passive: true });

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      let time = 0;
      function animate() {
        animId = requestAnimationFrame(animate);
        time += 0.0005;
        particles.rotation.y = time + mouseX * 0.1;
        particles.rotation.x = mouseY * 0.05;
        renderer.render(scene, camera);
      }
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", handleMouse);
        window.removeEventListener("resize", handleResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    }

    let cleanup: (() => void) | undefined;
    init().then((fn) => { cleanup = fn; });
    return () => { cleanup?.(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

/** Ambient glowing orbs used site-wide */
export function AmbientOrbs() {
  if (!siteConfig.effects.ambientOrbs) return null;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "-10%",
          left: "-10%",
          animation: "orb-drift 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "30%",
          right: "-5%",
          animation: "orb-drift 18s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          filter: "blur(60px)",
          bottom: "10%",
          left: "30%",
          animation: "orb-drift 12s ease-in-out infinite 3s",
        }}
      />
    </div>
  );
}

/** Mouse-follow radial glow */
export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteConfig.effects.mouseGlow) return;
    const el = glowRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = "1";
    };
    const handleLeave = () => { el.style.opacity = "0"; };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  if (!siteConfig.effects.mouseGlow) return null;

  return (
    <div
      ref={glowRef}
      className="fixed z-0 pointer-events-none opacity-0 transition-opacity duration-300"
      style={{
        width: 600,
        height: 600,
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
      }}
      aria-hidden="true"
    />
  );
}
