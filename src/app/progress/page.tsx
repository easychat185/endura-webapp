"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  CheckCircle,
  TrendingUp,
  Trophy,
  Calendar,
  BarChart3,
  Brain,
  Award,
  Users,
  Map,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { ProgressSkeleton } from "@/components/LoadingSkeleton";
import { fadeUpIndexed, staggerContainer } from "@/lib/animations";
import XPGainToast from "@/components/gamification/XPGainToast";
import XPProgressBar from "@/components/gamification/XPProgressBar";
import { useLevelUp } from "@/contexts/LevelUpContext";
import BadgeGrid from "@/components/gamification/BadgeGrid";
import LeaderboardPodium from "@/components/gamification/LeaderboardPodium";
import LeaderboardRow from "@/components/gamification/LeaderboardRow";
import LevelRoadmap from "@/components/gamification/LevelRoadmap";

/* ------------------------------------------------------------------ */
/*  Bar Chart Component                                                */
/* ------------------------------------------------------------------ */

function BarChart({
  data,
  title,
  icon,
}: {
  data: { week: string; score: number }[];
  title: string;
  icon: React.ReactNode;
}) {
  const maxScore = 10;
  const barMaxHeight = 160;

  return (
    <div className="glass p-7 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        {icon}
        <h3 className="text-base font-normal tracking-wide text-white/75 sm:text-lg">
          {title}
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-center text-sm font-light text-white/50 py-8">
          No data yet. Log your first scores below.
        </p>
      ) : (
        <>
          <div className="flex items-end justify-around gap-3">
            {data.map((point, idx) => {
              const isCurrent = idx === data.length - 1;
              const heightPercent = (point.score / maxScore) * 100;
              const barHeight = (heightPercent / 100) * barMaxHeight;

              return (
                <div key={point.week} className="flex flex-col items-center gap-2">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + idx * 0.15 }}
                    className={`text-sm font-light ${
                      isCurrent ? "text-amber-300/60" : "text-white/40"
                    }`}
                  >
                    {point.score}
                  </motion.span>

                  <div
                    className="relative w-12 sm:w-14 overflow-hidden"
                    style={{ height: barMaxHeight }}
                  >
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${
                        isCurrent
                          ? "bg-amber-400/50 shadow-[0_0_20px_rgba(196,149,106,0.08)]"
                          : "bg-amber-400/25"
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: barHeight }}
                      transition={{
                        duration: 0.8,
                        ease: "easeOut",
                        delay: 0.3 + idx * 0.15,
                      }}
                    />
                  </div>

                  <span
                    className={`text-xs font-light ${
                      isCurrent ? "text-amber-300/50" : "text-white/50"
                    }`}
                  >
                    {point.week}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between px-1">
            <span className="text-xs font-light text-white/40">0</span>
            <span className="text-xs font-light text-white/40">
              Score out of 10
            </span>
            <span className="text-xs font-light text-white/40">10</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Success Toast                                                      */
/* ------------------------------------------------------------------ */

function Toast({ show, isError }: { show: boolean; isError: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-6 left-1/2 z-[60] -translate-x-1/2 rounded-2xl px-5 py-3.5 backdrop-blur-xl shadow-lg"
          style={{
            background: "rgba(20,20,20,0.9)",
            border: isError
              ? "1px solid rgba(239,68,68,0.15)"
              : "1px solid rgba(74,222,128,0.1)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle
              className={`h-5 w-5 ${isError ? "text-red-400/60" : "text-emerald-400/60"}`}
            />
            <p className="text-sm font-light text-white/70">
              {isError
                ? "Failed to save scores. Please try again."
                : "Scores saved! Keep up the great work."}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProgressData {
  profile: { program_week: number; program_length: number } | null;
  scores: {
    control_score: number;
    confidence_score: number;
    awareness_score: number;
    logged_at: string;
  }[];
  milestones: {
    id: string;
    label: string;
    completed: boolean;
    completed_at: string | null;
  }[];
  sessionCount: number;
}

interface BadgeData {
  id: string;
  label: string;
  description: string;
  rarity: string;
  category: string;
  earned: boolean;
  earnedAt: string | null;
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  level: number;
  xp_earned: number;
  streak: number;
  badge_count: number;
  rank: number;
}

type Tab = "scores" | "badges" | "leaderboard" | "roadmap";

/* ------------------------------------------------------------------ */
/*  Main Progress Page                                                 */
/* ------------------------------------------------------------------ */

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<Tab>("scores");
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controlScore, setControlScore] = useState(5);
  const [confidenceScore, setConfidenceScore] = useState(5);
  const [awarenessScore, setAwarenessScore] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const [toastError, setToastError] = useState(false);
  const [saving, setSaving] = useState(false);

  // Gamification state
  const [gamData, setGamData] = useState<{ totalXP: number; level: number; levelTitle: string; tier?: number; tierName?: string; xpInLevel: number; xpNeeded: number } | null>(null);
  const [badges, setBadges] = useState<{ badges: BadgeData[]; earnedCount: number; totalCount: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ entries: LeaderboardEntry[]; myEntry: LeaderboardEntry | null; optedIn: boolean } | null>(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"weekly" | "monthly" | "alltime">("weekly");
  const [showXPToast, setShowXPToast] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const online = useOnlineStatus();
  const { triggerLevelUp } = useLevelUp();

  const fetchProgress = () => {
    if (!online) {
      setLoading(false);
      setError("Connect to the internet to see your progress.");
      return;
    }
    setLoading(true);
    setError(null);
    fetch("/api/progress")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load progress");
        return r.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        if (d.scores?.length > 0) {
          const latest = d.scores[d.scores.length - 1];
          setControlScore(latest.control_score ?? 5);
          setConfidenceScore(latest.confidence_score ?? 5);
          setAwarenessScore(latest.awareness_score ?? 5);
        }
      })
      .catch((err) => setError(err.message || "Something went wrong"))
      .finally(() => setLoading(false));
  };

  const fetchGamification = async () => {
    try {
      const res = await fetch("/api/gamification");
      if (res.ok) {
        const d = await res.json();
        setGamData(d);
      }
    } catch { /* ignore */ }
  };

  const fetchBadges = async () => {
    try {
      const res = await fetch("/api/gamification/badges");
      if (res.ok) {
        const d = await res.json();
        setBadges(d);
      }
    } catch { /* ignore */ }
  };

  const fetchLeaderboard = async (period: string) => {
    try {
      const res = await fetch(`/api/gamification/leaderboard?period=${period}`);
      if (res.ok) {
        const d = await res.json();
        setLeaderboard(d);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchProgress();
    fetchGamification();
  }, []);

  useEffect(() => {
    if (activeTab === "badges") fetchBadges();
    if (activeTab === "leaderboard") fetchLeaderboard(leaderboardPeriod);
  }, [activeTab, leaderboardPeriod]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/progress/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ controlScore, confidenceScore, awarenessScore }),
      });

      const result = await res.json();

      if (res.ok) {
        setToastError(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Show XP toast if XP was earned
        if (result.xp?.xpEarned > 0) {
          setXpGained(result.xp.xpEarned);
          setShowXPToast(true);
          setTimeout(() => setShowXPToast(false), 2500);
          fetchGamification();
          if (result.xp.levelUp) triggerLevelUp(result.xp.newLevel);
        }

        // Refresh data
        try {
          const refreshRes = await fetch("/api/progress");
          if (refreshRes.ok) {
            const refreshed = await refreshRes.json();
            setData(refreshed);
          }
        } catch { /* Refresh failed but save succeeded */ }
      } else {
        setToastError(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch {
      setToastError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Build chart data from scores
  const buildChartData = (key: "control_score" | "confidence_score" | "awareness_score") => {
    if (!data?.scores?.length) return [];
    const entries = data.scores.slice(-8);
    return entries.map((s, i) => ({
      week: `W${i + 1}`,
      score: s[key] ?? 0,
    }));
  };

  const week = data?.profile?.program_week ?? 1;
  const totalWeeks = data?.profile?.program_length ?? 8;
  const progressPercent = Math.round((week / totalWeeks) * 100);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "scores", label: "Scores", icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { key: "badges", label: "Badges", icon: <Award className="h-3.5 w-3.5" /> },
    { key: "leaderboard", label: "Leaderboard", icon: <Users className="h-3.5 w-3.5" /> },
    { key: "roadmap", label: "Roadmap", icon: <Map className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="relative min-h-screen font-sans text-white pb-24">
      <Toast show={showToast} isError={toastError} />
      <XPGainToast show={showXPToast} amount={xpGained} />

      {/* HEADER */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <h1 className="text-xl font-light tracking-wide text-white/80">
              Progress
            </h1>
            <p className="text-sm font-light text-white/50">
              Track your journey
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03]">
            <TrendingUp className="h-5 w-5 text-amber-300/40" />
          </div>
        </div>

        {/* Tab Bar */}
        <div className="mx-auto max-w-2xl px-5 sm:px-8 pb-2">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-normal transition-all duration-300"
                style={{
                  background: activeTab === tab.key ? "rgba(196,149,106,0.1)" : "transparent",
                  border: activeTab === tab.key ? "1px solid rgba(196,149,106,0.15)" : "1px solid transparent",
                  color: activeTab === tab.key ? "rgba(212,180,140,0.8)" : "rgba(255,255,255,0.35)",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <motion.main
        key={loading ? "loading" : `loaded-${activeTab}`}
        className="mx-auto max-w-2xl px-5 py-6 sm:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {loading ? (
          <ProgressSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-light text-red-400/60">{error}</p>
            <button
              onClick={fetchProgress}
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
            {/* XP PROGRESS BAR (always visible) */}
            {gamData && (
              <motion.section custom={0} variants={fadeUpIndexed} className="mb-5">
                <XPProgressBar
                  level={gamData.level}
                  levelTitle={gamData.levelTitle}
                  xpInLevel={gamData.xpInLevel}
                  xpNeeded={gamData.xpNeeded}
                  totalXP={gamData.totalXP}
                  tier={gamData.tier}
                  tierName={gamData.tierName}
                />
              </motion.section>
            )}

            {/* ── SCORES TAB ─────────────────────────── */}
            {activeTab === "scores" && (
              <>
                {/* OVERALL JOURNEY CARD */}
                <motion.section custom={1} variants={fadeUpIndexed} className="glass p-7 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-normal tracking-wide text-white/75 sm:text-xl">
                        Your Journey
                      </h2>
                      <p className="mt-1 text-sm font-light text-white/35">
                        Week {week} of {totalWeeks} &middot; {data?.sessionCount ?? 0} sessions completed
                      </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/[0.08]">
                      <Calendar className="h-5 w-5 text-amber-300/35" />
                    </div>
                  </div>

                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                    <motion.div
                      className="h-full rounded-full bg-amber-400/45"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-light text-amber-300/45">{progressPercent}%</span>
                    <span className="text-xs font-light text-white/50">
                      {totalWeeks} weeks total
                    </span>
                  </div>
                </motion.section>

                {/* INSIGHTS */}
                {data && data.scores.length >= 2 && (() => {
                  const latest = data.scores[data.scores.length - 1];
                  const prev = data.scores[data.scores.length - 2];
                  const controlChange = latest.control_score - prev.control_score;
                  const confChange = latest.confidence_score - prev.confidence_score;
                  const insights: string[] = [];

                  if (controlChange > 0) insights.push(`Control score up +${controlChange} this week`);
                  else if (controlChange < 0) insights.push(`Control dipped ${controlChange} — try the Start-Stop exercise`);

                  if (confChange > 0) insights.push(`Confidence improving (+${confChange})`);
                  else if (confChange < 0) insights.push(`Confidence dipped — revisit the Body Scan exercise`);

                  if (latest.awareness_score >= 7) insights.push("Great body awareness — you\u2019re building strong foundations");
                  else if (latest.awareness_score <= 4) insights.push("Awareness is low — try Diaphragmatic Breathing daily");

                  if (insights.length === 0) insights.push("Keep logging scores to unlock personalized insights");

                  return (
                    <motion.section custom={2} variants={fadeUpIndexed} className="mt-5">
                      <div className="glass-subtle p-5 sm:p-6">
                        <h3 className="text-xs font-normal uppercase tracking-[0.15em] text-amber-300/45 mb-3">
                          Insights
                        </h3>
                        <div className="space-y-2">
                          {insights.map((insight, i) => (
                            <p key={i} className="text-sm font-light text-white/45 flex items-start gap-2">
                              <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-amber-300/30" />
                              {insight}
                            </p>
                          ))}
                        </div>
                      </div>
                    </motion.section>
                  );
                })()}

                {/* CHARTS */}
                <motion.section custom={3} variants={fadeUpIndexed} className="mt-5">
                  <BarChart
                    data={buildChartData("control_score")}
                    title="Control Score"
                    icon={<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.03]"><BarChart3 className="h-4 w-4 text-amber-300/35" /></div>}
                  />
                </motion.section>

                <motion.section custom={4} variants={fadeUpIndexed} className="mt-5">
                  <BarChart
                    data={buildChartData("confidence_score")}
                    title="Confidence"
                    icon={<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.03]"><TrendingUp className="h-4 w-4 text-amber-200/35" /></div>}
                  />
                </motion.section>

                <motion.section custom={5} variants={fadeUpIndexed} className="mt-5">
                  <BarChart
                    data={buildChartData("awareness_score")}
                    title="Awareness"
                    icon={<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.03]"><Brain className="h-4 w-4 text-amber-200/35" /></div>}
                  />
                </motion.section>

                {/* LOG TODAY'S SCORES */}
                <motion.section custom={6} variants={fadeUpIndexed} className="mt-5">
                  <div className="glass p-7 sm:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.03]">
                        <Calendar className="h-4 w-4 text-amber-300/35" />
                      </div>
                      <div>
                        <h3 className="text-base font-normal tracking-wide text-white/70 sm:text-lg">
                          Log Today&apos;s Scores
                        </h3>
                        <p className="text-xs font-light" style={{ color: "rgba(250,204,21,0.4)" }}>
                          +25 XP
                        </p>
                      </div>
                    </div>

                    {/* Sliders */}
                    {[
                      { label: "Control Score", value: controlScore, setValue: setControlScore },
                      { label: "Confidence Level", value: confidenceScore, setValue: setConfidenceScore },
                      { label: "Body Awareness", value: awarenessScore, setValue: setAwarenessScore },
                    ].map(({ label, value, setValue }) => (
                      <div key={label} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-light text-white/50">{label}</label>
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-light text-amber-300/60"
                            style={{ background: "rgba(196,149,106,0.06)" }}
                          >
                            {value}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          step={1}
                          value={value}
                          onChange={(e) => setValue(Number(e.target.value))}
                          className="w-full cursor-pointer"
                        />
                        <div className="mt-1 flex items-center justify-between px-0.5">
                          <span className="text-xs font-light text-white/40">1</span>
                          <span className="text-xs font-light text-white/40">10</span>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)] active:scale-[0.98] disabled:opacity-50"
                      style={{
                        background: "rgba(196,149,106,0.1)",
                        border: "1px solid rgba(196,149,106,0.15)",
                      }}
                    >
                      {saving ? "Saving..." : "Save Today's Log"}
                    </button>
                  </div>
                </motion.section>
              </>
            )}

            {/* ── BADGES TAB ─────────────────────────── */}
            {activeTab === "badges" && (
              <motion.section custom={1} variants={fadeUpIndexed} className="glass p-6 sm:p-7">
                {badges ? (
                  <BadgeGrid
                    badges={badges.badges}
                    earnedCount={badges.earnedCount}
                    totalCount={badges.totalCount}
                  />
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-transparent" style={{ borderTopColor: "rgba(196,149,106,0.4)" }} />
                  </div>
                )}
              </motion.section>
            )}

            {/* ── LEADERBOARD TAB ────────────────────── */}
            {activeTab === "leaderboard" && (
              <motion.section custom={1} variants={fadeUpIndexed}>
                {/* Period selector */}
                <div className="flex gap-2 mb-5">
                  {(["weekly", "monthly", "alltime"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setLeaderboardPeriod(p)}
                      className="rounded-full px-3.5 py-1.5 text-xs font-normal capitalize transition-all duration-300"
                      style={{
                        background: leaderboardPeriod === p ? "rgba(196,149,106,0.1)" : "rgba(255,255,255,0.03)",
                        border: leaderboardPeriod === p ? "1px solid rgba(196,149,106,0.15)" : "1px solid rgba(255,255,255,0.04)",
                        color: leaderboardPeriod === p ? "rgba(212,180,140,0.8)" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {p === "alltime" ? "All Time" : p}
                    </button>
                  ))}
                </div>

                <div className="glass p-6 sm:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="h-5 w-5 text-amber-300/40" />
                    <h3 className="text-base font-normal tracking-wide text-white/70">
                      Rankings
                    </h3>
                  </div>

                  {leaderboard ? (
                    <>
                      {leaderboard.entries.length > 0 ? (
                        <>
                          <LeaderboardPodium entries={leaderboard.entries} />
                          <div className="mt-4 space-y-1">
                            {leaderboard.entries.slice(3).map((entry) => (
                              <LeaderboardRow
                                key={entry.user_id}
                                rank={entry.rank}
                                displayName={entry.display_name}
                                level={entry.level}
                                xpEarned={entry.xp_earned}
                                streak={entry.streak}
                                badgeCount={entry.badge_count}
                                isCurrentUser={entry.user_id === leaderboard.myEntry?.user_id}
                              />
                            ))}
                          </div>

                          {/* Current user pinned at bottom */}
                          {leaderboard.myEntry && leaderboard.myEntry.rank > 3 && (
                            <div className="mt-4 pt-3 border-t border-white/[0.04]">
                              <LeaderboardRow
                                rank={leaderboard.myEntry.rank}
                                displayName={leaderboard.myEntry.display_name}
                                level={leaderboard.myEntry.level}
                                xpEarned={leaderboard.myEntry.xp_earned}
                                streak={leaderboard.myEntry.streak}
                                badgeCount={leaderboard.myEntry.badge_count}
                                isCurrentUser
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-center text-sm font-light text-white/50 py-8">
                          No rankings yet. Opt in from Settings to appear on the leaderboard.
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-transparent" style={{ borderTopColor: "rgba(196,149,106,0.4)" }} />
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* ── ROADMAP TAB ─────────────────────────── */}
            {activeTab === "roadmap" && gamData && (
              <motion.section custom={1} variants={fadeUpIndexed}>
                <LevelRoadmap currentLevel={gamData.level} totalXP={gamData.totalXP} />
              </motion.section>
            )}
          </>
        )}
      </motion.main>

      <BottomNav activeTab="Progress" />
    </div>
  );
}
