"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, ExternalLink, Tag } from "lucide-react";
import { projects, projectCategories, type ProjectCategory } from "@/data/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { staggerContainerVariants, cardVariants, fadeUpVariants } from "@/utils/animations";
import { cn } from "@/utils/cn";

function ProjectCard({ project }: { project: typeof projects[0] }) {
  return (
    <GlassCard
      variants={cardVariants}
      className="group overflow-hidden flex flex-col"
      hover
      glowColor="blue"
    >
      {/* Banner */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-blue-900/20 to-violet-900/20 flex items-center justify-center border-b border-white/[0.06]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, #3b82f620 0%, #8b5cf620 100%)`,
          }}
        />
        <div className="relative z-10 text-center px-4">
          <p className="text-4xl font-black gradient-text opacity-30 tracking-widest">
            {project.title.slice(0, 2).toUpperCase()}
          </p>
        </div>
        {/* Category badge */}
        <span className="absolute top-3 right-3 px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/40 font-medium">
          {project.year}
        </span>
        {project.featured && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-xs rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <p className="text-xs text-white/30 font-medium mb-1 flex items-center gap-1">
            <Tag size={10} />
            {project.category}
          </p>
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-white/50 leading-relaxed flex-1">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-md bg-white/[0.04] border border-white/[0.07] text-white/40 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300"
            >
              <GitBranch size={13} />
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-300"
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="section-container">
        <SectionHeader
          label="Work"
          title="Projects"
          description="A selection of projects built across different domains and stacks."
        />

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-12"
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {(["All", ...projectCategories] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-300",
                activeCategory === cat
                  ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                  : "glass border-white/10 text-white/50 hover:text-white hover:border-white/20"
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.p
            className="text-center text-white/30 py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No projects in this category yet.
          </motion.p>
        )}
      </div>
    </section>
  );
}
