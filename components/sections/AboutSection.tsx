"use client";
import { motion } from "framer-motion";
import { Server, Zap, Layers, Globe, Gamepad2, TrendingUp, Code2, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { staggerContainerVariants, cardVariants, fadeUpVariants } from "@/utils/animations";

const iconMap: Record<string, LucideIcon> = {
  Server, Zap, Layers, Globe, Gamepad2, TrendingUp, Code2,
};

const techStack = [
  { name: "Python", color: "#3b82f6" },
  { name: "Lua", color: "#8b5cf6" },
  { name: "JavaScript", color: "#f59e0b" },
  { name: "TypeScript", color: "#3b82f6" },
  { name: "Java", color: "#ef4444" },
  { name: "C++", color: "#06b6d4" },
  { name: "HTML/CSS", color: "#f97316" },
  { name: "React", color: "#06b6d4" },
  { name: "Node.js", color: "#22c55e" },
];

export function AboutSection() {
  const { about } = siteConfig;

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="section-container">
        <SectionHeader
          label="About Me"
          title="Who I Am"
          description="A little about the person behind the code."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Bio */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainerVariants}
          >
            {/* Bio paragraphs */}
            <div className="space-y-5 mb-10">
              {about.bio.map((para, i) => (
                <motion.p
                  key={i}
                  variants={fadeUpVariants}
                  className="text-white/60 text-base leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Tech stack */}
            <motion.div variants={fadeUpVariants}>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <motion.span
                    key={tech.name}
                    className="px-3 py-1.5 text-sm font-mono rounded-lg glass border border-white/[0.07] text-white/60 hover:text-white transition-all duration-300 cursor-default"
                    whileHover={{ scale: 1.05, borderColor: tech.color + "60" }}
                    style={{ "--hover-color": tech.color } as React.CSSProperties}
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Highlights grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {about.highlights.map((item) => {
              const Icon = iconMap[item.icon] || Code2;
              return (
                <GlassCard
                  key={item.label}
                  variants={cardVariants}
                  className="p-5 group cursor-default"
                  glowColor="blue"
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                      <Icon size={18} className="text-blue-400" />
                    </div>
                    <p className="text-sm font-semibold text-white/80">{item.label}</p>
                  </div>
                </GlassCard>
              );
            })}
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {[
            { value: "5+", label: "Years Experience" },
            { value: "50+", label: "Projects Shipped" },
            { value: "6+", label: "Languages" },
            { value: "100%", label: "Precision Focus" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              className="glass rounded-2xl p-6 text-center border border-white/[0.06] hover:border-blue-500/20 transition-colors duration-300"
            >
              <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
              <p className="text-xs text-white/40 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
