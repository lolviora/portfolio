"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Copy, Check, ExternalLink, Send } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { staggerContainerVariants, cardVariants, fadeUpVariants } from "@/utils/animations";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-200"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

const socialCards = [
  {
    key: "github",
    label: "GitHub",
    value: siteConfig.social.github,
    display: "github.com/lolviora",
    icon: ExternalLink,
    color: "#8b5cf6",
    href: siteConfig.social.github,
    copyText: siteConfig.social.github || "",
  },
  {
    key: "discord",
    label: "Discord",
    value: siteConfig.social.discord,
    display: siteConfig.social.discord,
    icon: MessageCircle,
    color: "#5865f2",
    href: siteConfig.social.discordInvite,
    copyText: siteConfig.social.discord || "",
  },
  {
    key: "email",
    label: "Email",
    value: siteConfig.social.email,
    display: siteConfig.social.email,
    icon: Mail,
    color: "#3b82f6",
    href: `mailto:${siteConfig.social.email}`,
    copyText: siteConfig.social.email || "",
  },
].filter((s) => s.value);

export function ContactSection() {
  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="section-container">
        <SectionHeader
          label="Get in Touch"
          title="Contact"
          description="Have a project in mind or want to collaborate? Reach out."
        />

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* Left — social cards */}
          <motion.div
            className="flex flex-col gap-4"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.p variants={fadeUpVariants} className="text-white/50 leading-relaxed text-sm mb-2">
              I&apos;m open to freelance projects, collaborations, and interesting opportunities.
              The best way to reach me is via email or Discord.
            </motion.p>

            {socialCards.map((card) => {
              const Icon = card.icon;
              return (
                <GlassCard
                  key={card.key}
                  variants={cardVariants}
                  className="p-4 group"
                  hover
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: `${card.color}15`,
                        border: `1px solid ${card.color}30`,
                      }}
                    >
                      <Icon size={18} style={{ color: card.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/30 font-medium mb-0.5">{card.label}</p>
                      <p className="text-sm text-white/70 font-mono truncate">{card.display}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CopyButton text={card.copyText} />
                      {card.href && (
                        <a
                          href={card.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-all duration-200"
                          aria-label="Open link"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <GlassCard className="p-6" hover={false}>
              <form
                action={`mailto:${siteConfig.social.email}`}
                method="post"
                encType="text/plain"
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white/80 placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white/80 placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white/80 placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all duration-300 resize-none"
                  />
                </div>
                <GlowButton variant="primary" className="w-full justify-center">
                  <Send size={15} />
                  Send Message
                </GlowButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
