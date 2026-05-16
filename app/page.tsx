"use client";
import { useLenis } from "@/hooks/useLenis";
import { siteConfig } from "@/config/site";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { BackToTop } from "@/components/layout/BackToTop";
import { AmbientOrbs, MouseGlow } from "@/components/layout/AmbientBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { GamesSection } from "@/components/sections/GamesSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  useLenis(siteConfig.effects.smoothScrolling);

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen />

      {/* Global effects */}
      {siteConfig.effects.ambientOrbs && <AmbientOrbs />}
      {siteConfig.effects.mouseGlow && <MouseGlow />}
      {siteConfig.effects.customCursor && <CustomCursor />}

      {/* Layout */}
      <Navbar />

      <main className="relative z-10">
        {siteConfig.sections.hero && <HeroSection />}
        {siteConfig.sections.about && <AboutSection />}
        {siteConfig.sections.skills && <SkillsSection />}
        {siteConfig.sections.projects && <ProjectsSection />}
        {siteConfig.sections.experience && <ExperienceSection />}
        {siteConfig.sections.games && <GamesSection />}
        {siteConfig.sections.contact && <ContactSection />}
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
