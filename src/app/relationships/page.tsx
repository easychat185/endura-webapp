"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  BookOpen,
  Clock,
  ChevronRight,
  Crown,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { fadeUpIndexed, staggerContainer } from "@/lib/animations";
import { guides } from "@/lib/relationships/guides";

export default function RelationshipsPage() {
  const [filter, setFilter] = useState<
    "all" | "communication" | "intimacy" | "confidence"
  >("all");
  const [readSlugs, setReadSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("endura_read_guides");
      if (stored) setReadSlugs(new Set(JSON.parse(stored)));
    } catch {
      // Ignore
    }
  }, []);

  const filtered = guides.filter(
    (g) => filter === "all" || g.category === filter
  );

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case "communication":
        return <MessageCircle className="h-4 w-4 text-amber-300/40" />;
      case "intimacy":
        return <Heart className="h-4 w-4 text-amber-300/40" />;
      case "confidence":
        return <Crown className="h-4 w-4 text-amber-300/40" />;
      default:
        return <BookOpen className="h-4 w-4 text-amber-300/40" />;
    }
  };

  return (
    <div className="relative min-h-screen font-sans text-white pb-24">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/40 transition-all duration-350 hover:bg-white/[0.03]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-light tracking-wide text-white/80">
                Relationships
              </h1>
              <p className="text-xs font-light text-white/50">
                Guides &amp; coaching
              </p>
            </div>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/[0.06]">
            <Heart className="h-5 w-5 text-amber-300/35" />
          </div>
        </div>
      </header>

      <motion.main
        className="mx-auto max-w-2xl px-5 py-6 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Chat CTA */}
        <motion.div custom={0} variants={fadeUpIndexed}>
          <Link
            href="/relationships/chat"
            className="glass flex items-center gap-5 p-6 transition-all duration-500 hover:border-amber-300/[0.08]"
            style={{ borderColor: "rgba(196,149,106,0.08)" }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{
                background: "rgba(196,149,106,0.08)",
                border: "1px solid rgba(196,149,106,0.1)",
              }}
            >
              <span className="text-sm font-light text-amber-200/60">DM</span>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-normal tracking-wide text-white/75">
                Talk to Dr.&nbsp;Maya about Relationships
              </h2>
              <p className="mt-1 text-sm font-light text-white/35">
                Get personalized guidance on communication, intimacy, and
                partner dynamics
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-white/15" />
          </Link>
        </motion.div>

        {/* Section title */}
        <motion.div custom={1} variants={fadeUpIndexed} className="mt-8 mb-4">
          <h3 className="font-normal uppercase tracking-[0.2em] text-[11px] text-white/50">
            Guides &amp; Articles
          </h3>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div custom={2} variants={fadeUpIndexed} className="flex gap-2 mb-6">
          {(["all", "communication", "intimacy", "confidence"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-full px-4 py-2 text-xs font-normal capitalize transition-all duration-300"
                style={{
                  background:
                    filter === f
                      ? "rgba(196,149,106,0.1)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    filter === f
                      ? "1px solid rgba(196,149,106,0.15)"
                      : "1px solid rgba(255,255,255,0.04)",
                  color:
                    filter === f
                      ? "rgba(212,180,140,0.8)"
                      : "rgba(255,255,255,0.4)",
                }}
              >
                {f === "all" ? "All" : f}
              </button>
            )
          )}
        </motion.div>

        {/* Guide Cards */}
        <div className="space-y-4">
          {filtered.map((guide, idx) => (
            <motion.div
              key={guide.slug}
              custom={idx + 3}
              variants={fadeUpIndexed}
            >
              <Link href={`/relationships/${guide.slug}`}>
                <div className="glass p-6 transition-all duration-500 hover:border-amber-300/[0.08]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03]">
                      {categoryIcon(guide.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-normal tracking-wide text-white/75">
                          {guide.title}
                        </h3>
                        <ChevronRight className="h-4 w-4 shrink-0 text-white/15" />
                      </div>
                      <p className="mt-1 text-sm font-light text-white/35">
                        {guide.subtitle}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs font-light text-white/50">
                          <Clock className="h-3.5 w-3.5" />
                          {guide.readTime}
                        </span>
                        {readSlugs.has(guide.slug) ? (
                          <span className="rounded-full bg-emerald-400/[0.08] px-2 py-0.5 text-[10px] font-normal text-emerald-400/60">
                            Read
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-300/[0.08] px-2 py-0.5 text-[10px] font-normal text-amber-300/60">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.main>

      <BottomNav activeTab="Home" />
    </div>
  );
}
