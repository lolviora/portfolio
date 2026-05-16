"use client";
import { motion } from "framer-motion";
import { experiences } from "@/data/experience";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { staggerContainerVariants, slideLeftVariants, fadeUpVariants } from "@/utils/animations";
import { cn } from "@/utils/cn";

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-32 overflow-hidden">
      <div className="section-container">
        <SectionHeader
          label="Career"
          title="Experience"
          description="My journey building systems and software across domains."
        />

        <motion.div
          className="relative max-w-3xl mx-auto"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-violet-500/40 to-transparent hidden md:block" />

          {experiences.map((exp) => (
            <motion.div
              key={exp.id}
              variants={slideLeftVariants}
              className="relative md:pl-20 mb-12 last:mb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-5 w-4 h-4 rounded-full border-2 border-blue-500 bg-[#050508] hidden md:flex items-center justify-center">
                {exp.current && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </div>

              {/* Card */}
              <div className="glass rounded-2xl p-6 border border-white/[0.07] hover:border-blue-500/20 transition-all duration-300 group">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        {exp.role}
                      </h3>
                      {exp.current && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/15 border border-green-500/30 text-green-400 font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-400/80 font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs text-white/30 font-mono mt-1">{exp.period}</span>
                </div>

                <p className="text-sm text-white/50 leading-relaxed mb-4">{exp.description}</p>

                {/* Highlights */}
                <ul className="space-y-1.5 mb-4">
                  {exp.highlights.map((h, hi) => (
                    <motion.li
                      key={hi}
                      variants={fadeUpVariants}
                      className="flex items-start gap-2 text-sm text-white/40"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500/60 flex-shrink-0" />
                      {h}
                    </motion.li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-md font-mono",
                        "bg-white/[0.04] border border-white/[0.07] text-white/35"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
