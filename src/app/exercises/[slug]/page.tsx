"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import { getExerciseBySlug } from "@/lib/exercises/data";
import { createClient } from "@/lib/supabase/client";
import { fadeUp } from "@/lib/animations";
import { trackEvent } from "@/lib/analytics";
import { hapticLight } from "@/lib/capacitor";

/* ── Celebration particles ─────────────────────────────── */
function CelebrationParticles() {
  const particles = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360;
    const distance = 60 + Math.random() * 100;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    const size = 4 + Math.random() * 6;
    const delay = Math.random() * 0.3;
    const colors = [
      "rgba(196,149,106,0.8)",
      "rgba(212,180,140,0.7)",
      "rgba(74,222,128,0.6)",
      "rgba(255,255,255,0.5)",
      "rgba(196,149,106,0.5)",
    ];
    const color = colors[i % colors.length];

    return (
      <motion.span
        key={i}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          top: "50%",
          left: "50%",
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={{
          x,
          y: y - 30,
          opacity: 0,
          scale: 0,
        }}
        transition={{
          duration: 0.8 + Math.random() * 0.4,
          delay,
          ease: "easeOut",
        }}
      />
    );
  });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {particles}
    </div>
  );
}

/* ── Timer pulse flash ─────────────────────────────────── */
function TimerPulse() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 rounded-full"
      style={{ background: "rgba(196,149,106,0.15)" }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 0, scale: 1.6 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  );
}

export default function ExerciseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const exercise = getExerciseBySlug(slug);

  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = exercise?.steps[currentStep];
  const totalSteps = exercise?.steps.length ?? 0;
  const isLastStep = currentStep === totalSteps - 1;

  useEffect(() => {
    if (exercise) {
      trackEvent("exercise_viewed", { slug: exercise.slug, title: exercise.title });
    }
  }, [exercise]);

  const totalDuration = exercise?.steps.reduce(
    (sum, s) => sum + (s.durationSeconds ?? 0),
    0
  ) ?? 0;

  useEffect(() => {
    if (step?.durationSeconds) {
      setTimeLeft(step.durationSeconds);
    }
  }, [currentStep, step?.durationSeconds]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleNextStep = useCallback(() => {
    if (isLastStep) {
      setCompleted(true);
      setIsRunning(false);
      setShowCelebration(true);
      trackEvent("exercise_completed", { slug: exercise?.slug, title: exercise?.title });
      hapticLight();
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
      setIsRunning(false);
    }
  }, [isLastStep]);

  // Timer step complete: vibrate + pulse flash
  useEffect(() => {
    if (timeLeft === 0 && !isRunning && step?.durationSeconds && !completed) {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      // Visual pulse
      setShowPulse(true);
      const pulseTimeout = setTimeout(() => setShowPulse(false), 900);

      // Auto-advance after pulse
      const advanceTimeout = setTimeout(handleNextStep, 1500);
      return () => {
        clearTimeout(pulseTimeout);
        clearTimeout(advanceTimeout);
      };
    }
  }, [timeLeft, isRunning, step?.durationSeconds, completed, handleNextStep]);

  const [xpEarned, setXpEarned] = useState(0);

  const handleComplete = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("exercise_completions").insert({
          user_id: user.id,
          exercise_slug: slug,
        });

        // Award XP via API
        try {
          const xpRes = await fetch("/api/gamification/xp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: exercise?.xpReward ?? 50,
              source: "exercise",
              sourceId: `${slug}_${new Date().toISOString().split("T")[0]}`,
            }),
          });
          if (xpRes.ok) {
            const xpData = await xpRes.json();
            setXpEarned(xpData.xpEarned || 0);
          }
        } catch {
          // XP award failed silently
        }
      }
    } catch {
      // Save failed silently — completion still shown
    }
    setSaving(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!exercise) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans text-white">
        <div className="text-center">
          <p className="text-sm font-light text-white/40">
            Exercise not found
          </p>
          <button
            onClick={() => router.push("/exercises")}
            className="mt-4 text-sm font-light text-amber-200/50 hover:text-amber-200/70"
          >
            Back to Exercises
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentStep + (timeLeft === 0 ? 1 : 0)) / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col font-sans text-white">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/[0.03] backdrop-blur-2xl"
        style={{ background: "rgba(8,8,8,0.3)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/exercises")}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white/40 transition-all duration-350 hover:bg-white/[0.03]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-normal tracking-wide text-white/80">
                {exercise.title}
              </h1>
              <p className="text-xs font-light text-white/50">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-light text-white/50">
            <Clock className="h-3.5 w-3.5" />
            {exercise.duration}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full bg-white/[0.04]">
          <motion.div
            className="h-full bg-amber-400/50"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-8 sm:px-8">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex flex-col items-center text-center"
            >
              {showCelebration && <CelebrationParticles />}
              <div
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.12)",
                }}
              >
                <CheckCircle className="h-10 w-10 text-emerald-400/60" />
              </div>
              <h2 className="text-2xl font-light tracking-wide text-white/80">
                Exercise Complete
              </h2>
              {xpEarned > 0 && (
                <p className="mt-2 text-lg font-light" style={{ color: "rgba(250,204,21,0.7)" }}>
                  +{xpEarned} XP
                </p>
              )}
              <p className="mt-3 text-sm font-light text-white/40">
                Great work! Consistency is key — try to practice daily.
              </p>
              {!xpEarned && !saving ? (
                <button
                  onClick={handleComplete}
                  className="mt-8 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)]"
                  style={{
                    background: "rgba(196,149,106,0.1)",
                    border: "1px solid rgba(196,149,106,0.15)",
                  }}
                >
                  Save & Earn XP
                </button>
              ) : saving ? (
                <p className="mt-8 text-sm font-light text-white/40">Saving...</p>
              ) : (
                <button
                  onClick={() => router.push("/exercises")}
                  className="mt-8 flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)]"
                  style={{
                    background: "rgba(196,149,106,0.1)",
                    border: "1px solid rgba(196,149,106,0.15)",
                  }}
                >
                  Done
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-full max-w-md text-center"
            >
              {/* Step title */}
              <p className="text-xs font-normal uppercase tracking-[0.2em] text-amber-300/40">
                {step?.title}
              </p>

              {/* Timer circle */}
              {step?.durationSeconds ? (
                <div className="my-8 flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    {showPulse && <TimerPulse />}
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="72"
                        fill="none"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="72"
                        fill="none"
                        stroke="rgba(196,149,106,0.35)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 72}
                        strokeDashoffset={
                          2 * Math.PI * 72 * (1 - timeLeft / (step.durationSeconds ?? 1))
                        }
                        style={{ transition: "stroke-dashoffset 1s linear" }}
                      />
                    </svg>
                    <span className="text-3xl font-extralight tracking-tight text-white/70">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="my-8" />
              )}

              {/* Instruction */}
              <p className="text-sm font-light leading-relaxed text-white/50 px-2">
                {step?.instruction}
              </p>

              {/* Controls */}
              <div className="mt-10 flex items-center justify-center gap-4">
                {step?.durationSeconds ? (
                  <>
                    <button
                      onClick={() => {
                        setTimeLeft(step.durationSeconds ?? 0);
                        setIsRunning(false);
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.03] text-white/50 transition-all hover:bg-white/[0.06]"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="flex h-16 w-16 items-center justify-center rounded-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(196,149,106,0.1)]"
                      style={{
                        background: "rgba(196,149,106,0.12)",
                        border: "1px solid rgba(196,149,106,0.15)",
                      }}
                    >
                      {isRunning ? (
                        <Pause className="h-6 w-6 text-amber-200/80" />
                      ) : (
                        <Play className="ml-1 h-6 w-6 text-amber-200/80" />
                      )}
                    </button>

                    <button
                      onClick={handleNextStep}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.03] text-white/50 transition-all hover:bg-white/[0.06]"
                    >
                      <SkipForward className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-normal text-amber-200/70 transition-all duration-500 hover:shadow-[0_0_30px_rgba(196,149,106,0.08)]"
                    style={{
                      background: "rgba(196,149,106,0.1)",
                      border: "1px solid rgba(196,149,106,0.15)",
                    }}
                  >
                    Next Step
                    <SkipForward className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
