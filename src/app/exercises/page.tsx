"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Dumbbell,
  Brain,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { fadeUpIndexed, staggerContainer } from "@/lib/animations";
import { exercises, type Exercise } from "@/lib/exercises/data";
import { createClient } from "@/lib/supabase/client";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function ExercisesPage() {
  const [userLevel, setUserLevel] = useState(1);
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "physical" | "somatic">("all");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Get gamification level
        const { data: gam } = await supabase
          .from("user_gamification")
          .select("level")
          .eq("user_id", user.id)
          .maybeSingle();

        if (gam?.level) setUserLevel(gam.level);

        const { data: completions } = await supabase
          .from("exercise_completions")
          .select("exercise_slug")
          .eq("user_id", user.id);

        if (completions) {
          setCompletedSlugs(new Set(completions.map((c) => c.exercise_slug)));
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = exercises.filter(
    (e) => filter === "all" || e.category === filter
  );

  const isLocked = (ex: Exercise) => ex.levelUnlock > userLevel;

  // Today's recommended: pick up to 2 unlocked exercises the user hasn't completed
  const recommended = exercises
    .filter((e) => !isLocked(e) && !completedSlugs.has(e.slug))
    .slice(0, 2);
  // Fallback: if user completed everything, show first 2 unlocked
  const dailyPicks =
    recommended.length > 0
      ? recommended
      : exercises.filter((e) => !isLocked(e)).slice(0, 2);

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
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/40 transition-all duration-350 hover:bg-white/[0.03] hover:text-white/60"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-light tracking-wide text-white/80">
                Exercises
              </h1>
              <p className="text-xs font-light text-white/50">
                {exercises.filter((e) => !isLocked(e)).length} unlocked
              </p>
            </div>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03]">
            <Dumbbell className="h-5 w-5 text-amber-300/40" />
          </div>
        </div>
      </header>

      <motion.main
        key={loading ? "loading" : "loaded"}
        className="mx-auto max-w-2xl px-5 py-6 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Filter Tabs */}
        <motion.div
          custom={0}
          variants={fadeUpIndexed}
          className="flex gap-2 mb-6"
        >
          {(["all", "physical", "somatic"] as const).map((f) => (
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
              {f === "all" ? "All" : f === "physical" ? "Techniques" : "Mindfulness"}
            </button>
          ))}
        </motion.div>

        {/* Today's Pick */}
        {!loading && dailyPicks.length > 0 && (
          <motion.div custom={1} variants={fadeUpIndexed} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-300/50" />
              <h3 className="text-xs font-normal uppercase tracking-[0.2em] text-white/45">
                Today&apos;s Pick
              </h3>
            </div>
            <div className="space-y-3">
              {dailyPicks.map((ex) => (
                <Link key={ex.slug} href={`/exercises/${ex.slug}`}>
                  <div
                    className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-500 active:scale-[0.98]"
                    style={{
                      background: "rgba(196,149,106,0.04)",
                      border: "1px solid rgba(196,149,106,0.1)",
                    }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "rgba(196,149,106,0.08)" }}
                    >
                      {ex.category === "somatic" ? (
                        <Brain className="h-4 w-4 text-amber-300/50" />
                      ) : (
                        <Dumbbell className="h-4 w-4 text-amber-300/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-normal text-white/70 truncate">{ex.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs font-light text-white/50">{ex.duration} · {ex.difficulty}</p>
                        <span className="text-xs font-light" style={{ color: "rgba(250,204,21,0.4)" }}>
                          +{ex.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-amber-300/30" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Exercise Cards */}
        <div className="space-y-4">
          {filtered.map((exercise, idx) => {
            const locked = isLocked(exercise);
            const completed = completedSlugs.has(exercise.slug);

            return (
              <motion.div key={exercise.slug} custom={idx + 2 + (dailyPicks.length > 0 ? 1 : 0)} variants={fadeUpIndexed}>
                {locked ? (
                  <div
                    className="glass p-6 opacity-40"
                    style={{ filter: "grayscale(0.5)" }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03]">
                        <Lock className="h-5 w-5 text-white/40" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-normal text-white/40">
                          {exercise.title}
                        </h3>
                        <p className="mt-1 text-xs font-light text-white/40">
                          Unlocks at Level {exercise.levelUnlock}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={`/exercises/${exercise.slug}`}>
                    <div className="glass p-6 transition-all duration-500 hover:border-amber-300/[0.08]">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                          style={{
                            background:
                              exercise.category === "somatic"
                                ? "rgba(196,149,106,0.06)"
                                : "rgba(255,255,255,0.03)",
                          }}
                        >
                          {exercise.category === "somatic" ? (
                            <Brain className="h-5 w-5 text-amber-300/40" />
                          ) : (
                            <Dumbbell className="h-5 w-5 text-amber-300/40" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-normal tracking-wide text-white/75">
                              {exercise.title}
                            </h3>
                            <ChevronRight className="h-4 w-4 text-white/50" />
                          </div>
                          <p className="mt-2 text-sm font-light leading-relaxed text-white/45">
                            {exercise.description}
                          </p>
                          <div className="mt-3 flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs font-light text-white/50">
                              <Clock className="h-3.5 w-3.5" />
                              {exercise.duration}
                            </span>
                            <span className="text-xs font-light text-white/40">
                              {exercise.difficulty}
                            </span>
                            <span className="text-xs font-light" style={{ color: "rgba(250,204,21,0.4)" }}>
                              +{exercise.xpReward} XP
                            </span>
                            {completed && (
                              <span className="rounded-full bg-emerald-400/[0.08] px-2 py-0.5 text-xs font-normal text-emerald-400/60">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.main>

      <BottomNav activeTab="Practice" />
    </div>
  );
}
