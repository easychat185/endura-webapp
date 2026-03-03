"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  ArrowRight,
  ArrowUpRight,
  Dumbbell,
  Play,
  BarChart3,
  Settings,
  Shield,
  Heart,
  Bell,
  Sparkles,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { fadeUpIndexed, staggerContainer } from "@/lib/animations";
import LevelBadge from "@/components/gamification/LevelBadge";
import StreakDisplay from "@/components/gamification/StreakDisplay";
import XPProgressBar from "@/components/gamification/XPProgressBar";
import DailyChallenges from "@/components/gamification/DailyChallenges";
import EventBanner from "@/components/gamification/EventBanner";

interface DashboardData {
  profile: {
    display_name: string;
    tier: string;
    program_week: number;
    program_length: number;
    onboarding_completed: boolean;
  } | null;
  latestScores: {
    control_score: number;
    confidence_score: number;
    awareness_score: number;
  } | null;
  firstScores: {
    control_score: number;
    confidence_score: number;
  } | null;
  recentSessions: {
    id: string;
    session_number: number;
    summary: string;
    started_at: string;
  }[];
  sessionCount: number;
  gamification: {
    totalXP: number;
    level: number;
    levelTitle: string;
    tier: number;
    tierName: string;
    xpInLevel: number;
    xpNeeded: number;
    currentStreak: number;
    longestStreak: number;
    streakShields: number;
    streakMultiplier: number;
    streakLabel: string;
  } | null;
  challenges: {
    challenges: { id: string; title: string; xp: number; completed: boolean }[];
    allCompleted: boolean;
    bonusClaimed: boolean;
  } | null;
  activeEvents: {
    id: string;
    title: string;
    description: string;
    multiplier: number;
    ends_at: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const online = useOnlineStatus();

  const fetchDashboard = () => {
    setLoading(true);
    setError(null);

    // Try loading cached data first
    try {
      const cached = localStorage.getItem("endura_dashboard_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed.data);
        setCachedAt(parsed.cachedAt);
        setLoading(false);
      }
    } catch { /* ignore cache errors */ }

    if (!online) {
      setLoading(false);
      return;
    }

    fetch("/api/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load dashboard");
        return r.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setCachedAt(null);

        // Cache the dashboard data
        try {
          localStorage.setItem("endura_dashboard_cache", JSON.stringify({
            data: d,
            cachedAt: new Date().toISOString(),
          }));
        } catch { /* storage full */ }

        // Show weekly recap if it's a new week and there's data
        const lastRecapShown = localStorage.getItem("endura_last_recap_week");
        const currentWeek = d.profile?.program_week ?? 1;
        if (
          lastRecapShown !== String(currentWeek) &&
          currentWeek > 1 &&
          d.sessionCount > 0
        ) {
          setShowWeeklyRecap(true);
        }
      })
      .catch((err) => {
        // Only show error if we have no cached data
        if (!data) setError(err.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Flush onboarding data stored before signup
    try {
      const pending = localStorage.getItem("endura_onboarding");
      if (pending) {
        localStorage.removeItem("endura_onboarding");
        fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: pending,
        }).catch(() => { /* best-effort */ });
      }
    } catch { /* ignore */ }

    fetchDashboard();
  }, []);

  const dismissRecap = () => {
    setShowWeeklyRecap(false);
    const currentWeek = data?.profile?.program_week ?? 1;
    localStorage.setItem("endura_last_recap_week", String(currentWeek));
  };

  const profile = data?.profile;
  const week = profile?.program_week ?? 1;
  const totalWeeks = profile?.program_length ?? 8;
  const progressPercent = Math.round((week / totalWeeks) * 100);
  const gam = data?.gamification;

  const controlScore = data?.latestScores?.control_score ?? null;
  const confidenceScore = data?.latestScores?.confidence_score ?? null;
  const controlDelta =
    controlScore !== null && data?.firstScores?.control_score != null
      ? controlScore - data.firstScores.control_score
      : null;
  const confidenceDelta =
    confidenceScore !== null && data?.firstScores?.confidence_score != null
      ? confidenceScore - data.firstScores.confidence_score
      : null;

  const weekLabels = [
    "Foundation",
    "Breathing & Awareness",
    "Technique Building",
    "Body Connection",
    "Progressive Control",
    "Integration",
    "Advanced Practice",
    "Mastery & Beyond",
    "Deep Integration",
    "Completion",
  ];
  const weekTitle = weekLabels[week - 1] ?? "In Progress";

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  let sectionIdx = 0;

  return (
    <div className="relative min-h-screen font-sans text-white pb-28">
      {/* TOP BAR */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xl font-light tracking-widest text-white/70"
            >
              Endura
            </Link>
            {/* Level badge in header */}
            {!loading && gam && (
              <LevelBadge level={gam.level} title={gam.levelTitle} />
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-light text-white/50">
              {loading ? "Welcome back" : `Welcome back${profile?.display_name ? `, ${profile.display_name.split(" ")[0]}` : ""}`}
            </span>
            <Link
              href="/settings"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.03] transition-all duration-500 hover:bg-white/[0.06]"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4 text-white/50" />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <motion.main
        key={loading ? "loading" : "loaded"}
        className="mx-auto max-w-2xl px-5 py-8 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-light text-red-400/60">{error}</p>
            <button
              onClick={fetchDashboard}
              className="mt-4 rounded-full px-5 py-2.5 text-sm font-normal text-amber-200/70 transition-all duration-500 hover:text-amber-200/90"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* CACHED DATA INDICATOR */}
            {cachedAt && (
              <p className="text-center text-xs font-light text-white/50 mb-4">
                Showing data from {new Date(cachedAt).toLocaleTimeString()}
              </p>
            )}

            {/* EVENT BANNER */}
            {data?.activeEvents && data.activeEvents.length > 0 && (
              <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mb-5">
                <EventBanner event={data.activeEvents[0]} />
              </motion.section>
            )}

            {/* WEEKLY RECAP CARD */}
            {showWeeklyRecap && (
              <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mb-5">
                <div
                  className="glass p-6 sm:p-7"
                  style={{ borderColor: "rgba(74,222,128,0.1)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-emerald-400/50" />
                      <h3 className="text-base font-normal tracking-wide text-white/75">
                        Week {week - 1} Recap
                      </h3>
                    </div>
                    <button
                      onClick={dismissRecap}
                      className="text-xs font-light text-white/50 hover:text-white/60"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <p className="text-sm font-light text-white/45">
                      {data?.sessionCount ?? 0} sessions completed
                      {controlDelta !== null && controlDelta > 0 && (
                        <> &middot; Control score up <span className="text-emerald-400/60">+{controlDelta}</span></>
                      )}
                    </p>
                    <p className="text-sm font-light text-emerald-400/50">
                      You&apos;re now in Week {week}: {weekTitle}. Keep it up!
                    </p>
                  </div>
                </div>
              </motion.section>
            )}

            {/* XP PROGRESS BAR */}
            {gam && (
              <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mb-5">
                <XPProgressBar
                  level={gam.level}
                  levelTitle={gam.levelTitle}
                  xpInLevel={gam.xpInLevel}
                  xpNeeded={gam.xpNeeded}
                  totalXP={gam.totalXP}
                  tier={gam.tier}
                  tierName={gam.tierName}
                />
              </motion.section>
            )}

            {/* REAL STREAK CARD */}
            {gam && gam.currentStreak > 0 && (
              <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mb-5">
                <StreakDisplay
                  streak={gam.currentStreak}
                  multiplier={gam.streakMultiplier}
                  label={gam.streakLabel}
                  shields={gam.streakShields}
                />
              </motion.section>
            )}

            {/* DAILY CHALLENGES */}
            {data?.challenges && data.challenges.challenges.length > 0 && (
              <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mb-5">
                <DailyChallenges
                  challenges={data.challenges.challenges}
                  allCompleted={data.challenges.allCompleted}
                  bonusClaimed={data.challenges.bonusClaimed}
                />
              </motion.section>
            )}

            {/* PROGRAM PROGRESS CARD */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="glass p-7 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-light tracking-wide text-white/80 sm:text-xl">
                    Week {week} of {totalWeeks}: {weekTitle}
                  </h2>
                  <p className="mt-2 text-xs font-light text-amber-300/50">
                    {progressPercent}% complete
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03]">
                  <BarChart3 className="h-5 w-5 text-amber-300/40" />
                </div>
              </div>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                <motion.div
                  className="h-full rounded-full bg-amber-400/50"
                  style={{ boxShadow: "0 0 20px rgba(196,149,106,0.15)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                />
              </div>
            </motion.section>

            {/* WELCOME CARD FOR NEW USERS */}
            {data?.sessionCount === 0 && (
              <motion.section
                custom={sectionIdx++}
                variants={fadeUpIndexed}
                className="mt-5 rounded-3xl p-7 sm:p-8 text-center"
                style={{
                  background: "rgba(196,149,106,0.06)",
                  border: "1px solid rgba(196,149,106,0.12)",
                }}
              >
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(196,149,106,0.08)",
                    border: "1px solid rgba(196,149,106,0.1)",
                  }}
                >
                  <span className="text-xl font-light text-amber-200/60">DM</span>
                </div>
                <h2 className="text-lg font-light tracking-wide text-white/80">
                  Welcome to Endura
                </h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-white/50">
                  Your journey starts here. Meet Dr.&nbsp;Maya, your personal coach, and begin building confidence and control.
                </p>
                <Link
                  href="/chat"
                  className="mt-5 inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.12)] active:scale-[0.98]"
                  style={{
                    background: "rgba(196,149,106,0.12)",
                    border: "1px solid rgba(196,149,106,0.18)",
                  }}
                >
                  Start First Session
                  <ArrowRight className="h-4 w-4 text-amber-200/60" />
                </Link>
              </motion.section>
            )}

            {/* TALK TO DR. MAYA CARD */}
            <motion.section
              custom={sectionIdx++}
              variants={fadeUpIndexed}
              className="mt-5 rounded-3xl p-7 sm:p-8"
              style={{
                background: "rgba(196,149,106,0.04)",
                border: "1px solid rgba(196,149,106,0.1)",
                boxShadow: "0 0 60px rgba(196,149,106,0.04)",
              }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(196,149,106,0.08)",
                    border: "1px solid rgba(196,149,106,0.1)",
                  }}
                >
                  <span className="text-lg font-light text-amber-200/60">DM</span>
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-light tracking-wide text-white/80 sm:text-xl">
                    Talk to Dr.&nbsp;Maya
                  </h2>
                  <p className="mt-2 text-sm font-light leading-relaxed text-white/40">
                    Ready for today&apos;s session? Dr.&nbsp;Maya is here to guide
                    you through your next step.
                  </p>
                  <p className="mt-1 text-xs font-light" style={{ color: "rgba(250,204,21,0.4)" }}>
                    +40 XP per session
                  </p>
                </div>
              </div>

              <Link
                href="/chat"
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.12)] active:scale-[0.98]"
                style={{
                  background: "rgba(196,149,106,0.12)",
                  border: "1px solid rgba(196,149,106,0.18)",
                }}
              >
                Start Session
                <ArrowRight className="h-4 w-4 text-amber-200/60" />
              </Link>
            </motion.section>

            {/* EXERCISE LIBRARY CARD */}
            <motion.section
              custom={sectionIdx++}
              variants={fadeUpIndexed}
              className="glass mt-5 p-7 sm:p-8"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03]">
                  <Dumbbell className="h-5 w-5 text-amber-300/40" />
                </div>

                <div className="flex-1">
                  <h2 className="text-base font-normal tracking-wide text-white/75 sm:text-lg">
                    Today&apos;s Practice
                  </h2>

                  <p className="mt-2 text-sm font-light leading-relaxed text-white/35">
                    Build control and confidence with guided exercises — breathing,
                    techniques, and mindfulness practices.
                  </p>
                  <p className="mt-1 text-xs font-light" style={{ color: "rgba(250,204,21,0.4)" }}>
                    +50 XP per exercise
                  </p>

                  <Link
                    href="/exercises"
                    className="mt-5 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-normal text-white/50 transition-all duration-500 hover:text-white/60 active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Play className="h-4 w-4" />
                    Open Exercise Library
                  </Link>
                </div>
              </div>
            </motion.section>

            {/* RELATIONSHIPS CARD */}
            <motion.section
              custom={sectionIdx++}
              variants={fadeUpIndexed}
              className="glass mt-5 p-7 sm:p-8"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03]">
                  <Heart className="h-5 w-5 text-amber-300/40" />
                </div>

                <div className="flex-1">
                  <h2 className="text-base font-normal tracking-wide text-white/75 sm:text-lg">
                    Relationships
                  </h2>

                  <p className="mt-2 text-sm font-light leading-relaxed text-white/35">
                    Guides on communication, intimacy, and confidence — plus
                    chat with Dr.&nbsp;Maya about partner dynamics.
                  </p>

                  <Link
                    href="/relationships"
                    className="mt-5 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-normal text-white/50 transition-all duration-500 hover:text-white/60 active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Heart className="h-4 w-4" />
                    Explore Guides &amp; Chat
                  </Link>
                </div>
              </div>
            </motion.section>

            {/* YOUR PROGRESS */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mt-8">
              <h3 className="mb-4 font-normal uppercase tracking-[0.2em] text-xs text-white/40">
                Your Progress
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-6">
                  <p className="text-sm font-light text-white/35">Control Score</p>
                  {controlScore !== null ? (
                    <>
                      <p className="mt-2 text-3xl font-extralight tracking-tight text-white/80">
                        {controlScore}
                        <span className="text-lg font-light text-white/40">/10</span>
                      </p>
                      {controlDelta !== null && controlDelta !== 0 && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400/60" />
                          <span className="text-xs font-light text-emerald-400/60">
                            +{controlDelta} from start
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mt-3">
                      <p className="text-xs font-light text-white/50 leading-relaxed">
                        Start a session to unlock your score
                      </p>
                      <Link
                        href="/chat"
                        className="mt-2 inline-flex text-xs font-light text-amber-200/50 hover:text-amber-200/70"
                      >
                        Begin now &rarr;
                      </Link>
                    </div>
                  )}
                </div>

                <div className="glass p-6">
                  <p className="text-sm font-light text-white/35">Confidence</p>
                  {confidenceScore !== null ? (
                    <>
                      <p className="mt-2 text-3xl font-extralight tracking-tight text-white/80">
                        {confidenceScore}
                        <span className="text-lg font-light text-white/40">/10</span>
                      </p>
                      {confidenceDelta !== null && confidenceDelta !== 0 && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400/60" />
                          <span className="text-xs font-light text-emerald-400/60">
                            +{confidenceDelta} from start
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mt-3">
                      <p className="text-xs font-light text-white/50 leading-relaxed">
                        Log your progress to track confidence
                      </p>
                      <Link
                        href="/progress"
                        className="mt-2 inline-flex text-xs font-light text-amber-200/50 hover:text-amber-200/70"
                      >
                        Log scores &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            {/* DAILY REMINDER CARD */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mt-5">
              <div className="glass-subtle p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/[0.05]">
                    <Bell className="h-4 w-4 text-amber-300/35" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-normal text-white/50">Daily Reminder</p>
                    <p className="text-xs font-light text-white/50">
                      Practice daily for best results. Try to check in at the same time each day.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* PRIVACY SHIELD BADGE */}
            <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mt-6">
              <div className="flex items-center justify-center gap-2 text-xs font-light text-white/40">
                <Shield className="h-3.5 w-3.5 text-amber-300/20" />
                <span>Privacy Shield Active — Your data is encrypted & private</span>
              </div>
            </motion.section>

            {/* RECENT SESSIONS */}
            {data && data.recentSessions.length > 0 && (
              <motion.section custom={sectionIdx++} variants={fadeUpIndexed} className="mt-8">
                <h3 className="mb-4 font-normal uppercase tracking-[0.2em] text-xs text-white/40">
                  Recent Sessions
                </h3>

                <div className="space-y-3">
                  {data.recentSessions.map(({ id, summary, started_at }) => (
                    <div key={id} className="glass-subtle p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-xs font-normal uppercase tracking-[0.15em] text-amber-300/40">
                            {formatDate(started_at)}
                          </p>
                          <p className="mt-2 text-sm font-light leading-relaxed text-white/40">
                            {summary}
                          </p>
                        </div>
                        <Link
                          href="/chat"
                          className="shrink-0 text-xs font-light text-amber-200/50 transition-all duration-500 hover:text-amber-200/70"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </>
        )}
      </motion.main>

      <BottomNav activeTab="Home" />
    </div>
  );
}
