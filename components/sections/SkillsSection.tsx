"use client";
import { motion } from "framer-motion";
import {
  Code2, FileCode, Braces, FileType, Coffee, Cpu, Layout,
  Atom, Triangle, Server, Globe, Database, Zap, HardDrive, Palette,
  type LucideIcon,
} from "lucide-react";
import { skills } from "@/data/skills";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { staggerContainerVariants, cardVariants } from "@/utils/animations";

const iconMap: Record<string, LucideIcon> = {
  Code2, FileCode, Braces, FileType, Coffee, Cpu, Layout,
  Atom, Triangle, Server, Globe, Database, Zap, HardDrive, Palette,
};

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      <div className="section-container">
        <SectionHeader
          label="Expertise"
          title="Skills & Technologies"
          description="The tools and languages I use to build exceptional software."
        />

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {skills.map((skill) => {
            const Icon = iconMap[skill.icon] || Code2;
            return (
              <GlassCard
                key={skill.name}
                variants={cardVariants}
                className="p-5 group cursor-default relative overflow-hidden"
                hover
              >
                {/* Glow bg on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${skill.color}15 0%, transparent 70%)`,
                  }}
                />

                <div className="relative flex flex-col gap-4">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: `${skill.color}15`,
                      border: `1px solid ${skill.color}30`,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: skill.color }}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <p className="text-sm font-semibold text-white/80 mb-1 group-hover:text-white transition-colors">
                      {skill.name}
                    </p>
                    <p className="text-xs text-white/35 leading-snug hidden sm:block">
                      {skill.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${skill.color}aa, ${skill.color})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                    />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
