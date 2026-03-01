"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Clock,
  Loader2,
  User,
  Heart,
  Timer,
  Gauge,
  Brain,
  Users,
  AlertCircle,
  Search,
  Dumbbell,
  Zap,
  Moon,
  Target,
  Calendar,
  Flame,
} from "lucide-react";
import { slideVariants } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Answers {
  age: number | null;
  relationship: string;
  duration: string;
  control: number;
  confidence: number;
  relationships: string;
  anxiety: string;
  previousAttempts: string[];
  heldBack: string[];
  activity: string;
  stress: number;
  sleep: number;
  goals: string[];
  timeline: string;
  commitment: number;
}

/* ------------------------------------------------------------------ */
/*  Reusable components                                                */
/* ------------------------------------------------------------------ */

function ProgressBar({ step, total }: { step: number; total: number }) {
  const percentage = Math.round((step / total) * 100);
  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      <div className="h-1 w-full bg-white/[0.04]">
        <motion.div
          className="h-full bg-amber-400/40"
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div className="flex items-center justify-between px-5 py-2 sm:px-8">
        <span className="text-xs font-light text-white/25">
          {step <= 16
            ? `Question ${step} of 16`
            : step === 17
              ? "Analyzing..."
              : "Your Results"}
        </span>
        <span className="text-xs font-light text-white/25">{percentage}%</span>
      </div>
    </div>
  );
}

function SelectableCard({
  label,
  selected,
  onClick,
  autoAdvance,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  autoAdvance?: () => void;
}) {
  return (
    <button
      onClick={() => {
        onClick();
        if (autoAdvance) {
          setTimeout(autoAdvance, 400);
        }
      }}
      className={`w-full rounded-2xl px-5 py-4 text-left text-base transition-all duration-200 active:scale-[0.98] sm:text-lg ${
        selected
          ? "font-normal text-white/80"
          : "glass-subtle glow-hover font-light text-white/60"
      }`}
      style={
        selected
          ? {
              background: "rgba(196,149,106,0.06)",
              border: "1px solid rgba(196,149,106,0.12)",
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        {selected && <CheckCircle className="h-5 w-5 shrink-0 text-amber-300/50" />}
      </div>
    </button>
  );
}

function SliderQuestion({
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  value: number;
  onChange: (val: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <div className="mt-8 w-full">
      <div className="mb-6 flex justify-center">
        <span
          className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-extralight text-amber-200/60 sm:h-24 sm:w-24 sm:text-5xl"
          style={{
            background: "rgba(196,149,106,0.05)",
            border: "1px solid rgba(196,149,106,0.06)",
          }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
      <div className="mt-3 flex items-center justify-between text-sm font-light text-white/25">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main onboarding page                                               */
/* ------------------------------------------------------------------ */

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ageError, setAgeError] = useState("");
  const [processingPhase, setProcessingPhase] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const [answers, setAnswers] = useState<Answers>({
    age: null,
    relationship: "",
    duration: "",
    control: 5,
    confidence: 5,
    relationships: "",
    anxiety: "",
    previousAttempts: [],
    heldBack: [],
    activity: "",
    stress: 5,
    sleep: 5,
    goals: [],
    timeline: "",
    commitment: 7,
  });

  const TOTAL_SCREENS = 18;

  // Check auth status on mount
  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      if (user) setIsAuthenticated(true);
    });
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Navigation helpers                                               */
  /* ---------------------------------------------------------------- */

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => s + 1);
  }, []);

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const updateAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMulti = (key: "previousAttempts" | "heldBack" | "goals", value: string) => {
    setAnswers((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  /* ---------------------------------------------------------------- */
  /*  Validation: can we proceed?                                      */
  /* ---------------------------------------------------------------- */

  const canContinue = (): boolean => {
    switch (step) {
      case 1:
        return answers.age !== null && answers.age >= 18 && answers.age <= 100;
      case 2:
        return answers.relationship !== "";
      case 3:
        return answers.duration !== "";
      case 4:
        return true; // slider always has value
      case 5:
        return true;
      case 6:
        return answers.relationships !== "";
      case 7:
        return answers.anxiety !== "";
      case 8:
        return answers.previousAttempts.length > 0;
      case 9:
        return answers.heldBack.length > 0;
      case 10:
        return answers.activity !== "";
      case 11:
        return true;
      case 12:
        return true;
      case 13:
        return answers.goals.length > 0;
      case 14:
        return answers.timeline !== "";
      case 15:
        return true;
      default:
        return true;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Processing screen auto-advance (screen 17 = step 16)             */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    if (step !== 16) return;

    setProcessingPhase(0);
    const t1 = setTimeout(() => setProcessingPhase(1), 2000);
    const t2 = setTimeout(() => setProcessingPhase(2), 4000);
    const t3 = setTimeout(() => {
      setDirection(1);
      setStep(17);
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [step]);

  /* ---------------------------------------------------------------- */
  /*  Derive results from answers                                      */
  /* ---------------------------------------------------------------- */

  const getFocusAreas = (): string[] => {
    const areas: string[] = [];
    if (answers.goals.includes("Last longer")) areas.push("Ejaculatory Control Training");
    if (answers.goals.includes("Feel more confident")) areas.push("Confidence Building");
    if (answers.goals.includes("Reduce anxiety")) areas.push("Anxiety Reduction");
    if (answers.goals.includes("Improve my relationship")) areas.push("Intimacy & Communication");
    if (answers.goals.includes("Overall sexual wellness")) areas.push("Holistic Wellness Program");
    if (areas.length === 0) areas.push("Personalized Coaching", "Progressive Techniques");
    return areas.slice(0, 3);
  };

  const getTimeline = (): string => {
    switch (answers.timeline) {
      case "As soon as possible":
        return "2-3 weeks";
      case "Within a month":
        return "3-4 weeks";
      case "Within 3 months":
        return "4-8 weeks";
      case "No rush, I want lasting change":
        return "6-10 weeks";
      default:
        return "2-4 weeks";
    }
  };

  const getProgramLength = (): string => {
    if (answers.duration === "More than 3 years" || answers.control <= 3) return "10-Week";
    if (answers.duration === "1-3 years" || answers.control <= 5) return "8-Week";
    return "6-Week";
  };

  /* ---------------------------------------------------------------- */
  /*  Icon map for questions                                           */
  /* ---------------------------------------------------------------- */

  const stepIcons: Record<number, React.ReactNode> = {
    1: <User className="h-7 w-7 text-amber-300/35" />,
    2: <Heart className="h-7 w-7 text-amber-300/35" />,
    3: <Timer className="h-7 w-7 text-amber-300/35" />,
    4: <Gauge className="h-7 w-7 text-amber-300/35" />,
    5: <Brain className="h-7 w-7 text-amber-300/35" />,
    6: <Users className="h-7 w-7 text-amber-300/35" />,
    7: <AlertCircle className="h-7 w-7 text-amber-300/35" />,
    8: <Search className="h-7 w-7 text-amber-300/35" />,
    9: <Shield className="h-7 w-7 text-amber-300/35" />,
    10: <Dumbbell className="h-7 w-7 text-amber-300/35" />,
    11: <Zap className="h-7 w-7 text-amber-300/35" />,
    12: <Moon className="h-7 w-7 text-amber-300/35" />,
    13: <Target className="h-7 w-7 text-amber-300/35" />,
    14: <Calendar className="h-7 w-7 text-amber-300/35" />,
    15: <Flame className="h-7 w-7 text-amber-300/35" />,
  };

  /* ---------------------------------------------------------------- */
  /*  Screen renderers                                                 */
  /* ---------------------------------------------------------------- */

  const renderScreen = () => {
    switch (step) {
      /* -------------------------------------------------------------- */
      /*  Screen 0: Welcome                                              */
      /* -------------------------------------------------------------- */
      case 0:
        return (
          <div className="flex flex-col items-center text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.03]">
              <Shield className="h-10 w-10 text-amber-300/30" />
            </div>

            <h1 className="text-3xl font-extralight tracking-wide leading-relaxed text-white/80 sm:text-4xl">
              Let&apos;s Build Your Personal Program
            </h1>

            <p className="mx-auto mt-5 max-w-md text-lg font-light leading-relaxed text-white/40">
              Answer a few confidential questions so Dr.&nbsp;Maya can create a plan
              tailored to you.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-light text-white/30">
                <Clock className="h-4 w-4 text-amber-300/25" />
                <span>This takes about 3 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-light text-white/30">
                <Lock className="h-4 w-4 text-amber-300/25" />
                <span>Your answers are encrypted and never shared</span>
              </div>
            </div>

            <button
              onClick={goNext}
              className="mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)]"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              Let&apos;s Begin
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 1: Age Verification                                     */
      /* -------------------------------------------------------------- */
      case 1:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[1]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              How old are you?
            </h2>

            <div className="mt-8 w-full max-w-xs">
              <input
                type="number"
                min={18}
                max={100}
                value={answers.age ?? ""}
                placeholder="Enter your age"
                onChange={(e) => {
                  const val = e.target.value === "" ? null : Number(e.target.value);
                  updateAnswer("age", val);
                  if (val !== null && val < 18) {
                    setAgeError("You must be 18 or older to use Endura.");
                  } else {
                    setAgeError("");
                  }
                }}
                className="w-full rounded-2xl px-5 py-4 text-center text-2xl font-extralight text-white/80 placeholder:text-white/20 outline-none transition-colors focus:[border-color:rgba(196,149,106,0.15)]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              />
              {ageError && (
                <p className="mt-3 text-sm font-light text-red-400/60">{ageError}</p>
              )}
            </div>

            <p className="mt-6 font-light text-sm leading-relaxed text-white/40">
              We ask this to personalize your program.
            </p>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 2: Relationship Status                                  */
      /* -------------------------------------------------------------- */
      case 2:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[2]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              What&apos;s your current relationship status?
            </h2>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {["Single", "In a relationship", "Married", "It's complicated"].map(
                (option) => (
                  <SelectableCard
                    key={option}
                    label={option}
                    selected={answers.relationship === option}
                    onClick={() => updateAnswer("relationship", option)}
                    autoAdvance={goNext}
                  />
                )
              )}
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 3: Duration of Concern                                  */
      /* -------------------------------------------------------------- */
      case 3:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[3]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              How long has this been a concern for you?
            </h2>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {[
                "Less than 6 months",
                "6-12 months",
                "1-3 years",
                "More than 3 years",
              ].map((option) => (
                <SelectableCard
                  key={option}
                  label={option}
                  selected={answers.duration === option}
                  onClick={() => updateAnswer("duration", option)}
                  autoAdvance={goNext}
                />
              ))}
            </div>

            <p className="mt-6 font-light italic text-white/30 text-sm leading-relaxed">
              However long it&apos;s been, you&apos;re taking the right step.
            </p>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 4: Current Control Rating                               */
      /* -------------------------------------------------------------- */
      case 4:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[4]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              How would you rate your current level of control?
            </h2>

            <div className="w-full max-w-md">
              <SliderQuestion
                value={answers.control}
                onChange={(val) => updateAnswer("control", val)}
                minLabel="1 - Very low"
                maxLabel="10 - Full control"
              />
            </div>

            <p className="mt-6 font-light italic text-white/30 text-sm leading-relaxed">
              Be honest — this helps us set the right starting point.
            </p>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 5: Impact on Confidence                                 */
      /* -------------------------------------------------------------- */
      case 5:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[5]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              How much does this affect your overall confidence?
            </h2>

            <div className="w-full max-w-md">
              <SliderQuestion
                value={answers.confidence}
                onChange={(val) => updateAnswer("confidence", val)}
                minLabel="1 - Not at all"
                maxLabel="10 - Significantly"
              />
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 6: Impact on Relationships                              */
      /* -------------------------------------------------------------- */
      case 6:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[6]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              Has this affected your relationships or intimacy?
            </h2>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {["Yes, significantly", "Somewhat", "Not much", "Not applicable"].map(
                (option) => (
                  <SelectableCard
                    key={option}
                    label={option}
                    selected={answers.relationships === option}
                    onClick={() => updateAnswer("relationships", option)}
                    autoAdvance={goNext}
                  />
                )
              )}
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 7: Performance Anxiety                                  */
      /* -------------------------------------------------------------- */
      case 7:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[7]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              Do you experience performance anxiety?
            </h2>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {["Always", "Often", "Sometimes", "Rarely", "Never"].map((option) => (
                <SelectableCard
                  key={option}
                  label={option}
                  selected={answers.anxiety === option}
                  onClick={() => updateAnswer("anxiety", option)}
                  autoAdvance={goNext}
                />
              ))}
            </div>

            <p className="mt-6 font-light italic text-white/30 text-sm leading-relaxed">
              Performance anxiety is incredibly common — you&apos;re not alone.
            </p>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 8: Previous Attempts (multi-select)                     */
      /* -------------------------------------------------------------- */
      case 8:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[8]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              Have you tried anything to improve this before?
            </h2>
            <p className="mt-2 font-light text-white/40 leading-relaxed text-sm">Select all that apply</p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {[
                "Yes, techniques on my own",
                "Yes, with a professional",
                "Yes, medication",
                "No, this is my first step",
              ].map((option) => (
                <SelectableCard
                  key={option}
                  label={option}
                  selected={answers.previousAttempts.includes(option)}
                  onClick={() => toggleMulti("previousAttempts", option)}
                />
              ))}
            </div>

            <p className="mt-6 font-light italic text-white/30 text-sm leading-relaxed">
              Whatever you&apos;ve tried before, a structured approach can make all the
              difference.
            </p>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 9: What Held You Back (multi-select)                    */
      /* -------------------------------------------------------------- */
      case 9:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[9]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              What do you feel has held you back?
            </h2>
            <p className="mt-2 font-light text-white/40 leading-relaxed text-sm">Select all that apply</p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {[
                "Didn't know the right techniques",
                "Couldn't stay consistent",
                "Felt too embarrassed to seek help",
                "Didn't have proper guidance",
              ].map((option) => (
                <SelectableCard
                  key={option}
                  label={option}
                  selected={answers.heldBack.includes(option)}
                  onClick={() => toggleMulti("heldBack", option)}
                />
              ))}
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 10: Physical Activity                                   */
      /* -------------------------------------------------------------- */
      case 10:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[10]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              How physically active are you?
            </h2>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {[
                "Very active (4+ days/week)",
                "Moderately active (2-3 days/week)",
                "Lightly active (1 day/week)",
                "Sedentary",
              ].map((option) => (
                <SelectableCard
                  key={option}
                  label={option}
                  selected={answers.activity === option}
                  onClick={() => updateAnswer("activity", option)}
                  autoAdvance={goNext}
                />
              ))}
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 11: Stress Level                                        */
      /* -------------------------------------------------------------- */
      case 11:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[11]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              How would you rate your daily stress level?
            </h2>

            <div className="w-full max-w-md">
              <SliderQuestion
                value={answers.stress}
                onChange={(val) => updateAnswer("stress", val)}
                minLabel="1 - Very low"
                maxLabel="10 - Very high"
              />
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 12: Sleep Quality                                       */
      /* -------------------------------------------------------------- */
      case 12:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[12]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              How would you rate your sleep quality?
            </h2>

            <div className="w-full max-w-md">
              <SliderQuestion
                value={answers.sleep}
                onChange={(val) => updateAnswer("sleep", val)}
                minLabel="1 - Very poor"
                maxLabel="10 - Excellent"
              />
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 13: Goals (multi-select)                                */
      /* -------------------------------------------------------------- */
      case 13:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[13]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              What matters most to you?
            </h2>
            <p className="mt-2 font-light text-white/40 leading-relaxed text-sm">Select all that apply</p>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {[
                "Last longer",
                "Feel more confident",
                "Reduce anxiety",
                "Improve my relationship",
                "Overall sexual wellness",
              ].map((option) => (
                <SelectableCard
                  key={option}
                  label={option}
                  selected={answers.goals.includes(option)}
                  onClick={() => toggleMulti("goals", option)}
                />
              ))}
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 14: Timeline                                            */
      /* -------------------------------------------------------------- */
      case 14:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[14]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              When would you like to see improvement?
            </h2>

            <div className="mt-8 flex w-full max-w-md flex-col gap-3">
              {[
                "As soon as possible",
                "Within a month",
                "Within 3 months",
                "No rush, I want lasting change",
              ].map((option) => (
                <SelectableCard
                  key={option}
                  label={option}
                  selected={answers.timeline === option}
                  onClick={() => updateAnswer("timeline", option)}
                  autoAdvance={goNext}
                />
              ))}
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 15: Commitment                                          */
      /* -------------------------------------------------------------- */
      case 15:
        return (
          <div className="flex flex-col items-center text-center">
            {stepIcons[15]}
            <h2 className="mt-6 text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              How committed are you to making this change?
            </h2>

            <div className="w-full max-w-md">
              <SliderQuestion
                value={answers.commitment}
                onChange={(val) => updateAnswer("commitment", val)}
                minLabel="1 - Exploring"
                maxLabel="10 - Fully committed"
              />
            </div>

            <p className="mt-6 font-light italic text-white/30 text-sm leading-relaxed">
              The more you put in, the more you&apos;ll get out.
            </p>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 16 (step 16): Processing / Analysis                     */
      /* -------------------------------------------------------------- */
      case 16:
        return (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-amber-300/40" />

            <div className="mt-8 space-y-4">
              <motion.p
                key="phase-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: processingPhase >= 0 ? 1 : 0.3,
                  y: 0,
                }}
                className={`text-lg transition-colors duration-500 ${
                  processingPhase === 0 ? "font-light text-white/70" : "font-light text-white/30"
                }`}
              >
                Analyzing your responses
                {processingPhase === 0 && (
                  <span className="inline-block animate-pulse">...</span>
                )}
                {processingPhase > 0 && (
                  <CheckCircle className="ml-2 inline h-5 w-5 text-amber-300/40" />
                )}
              </motion.p>

              <motion.p
                key="phase-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: processingPhase >= 1 ? 1 : 0,
                  y: processingPhase >= 1 ? 0 : 10,
                }}
                transition={{ duration: 0.4 }}
                className={`text-lg ${
                  processingPhase === 1 ? "font-light text-white/70" : "font-light text-white/30"
                }`}
              >
                Creating your personalized program
                {processingPhase === 1 && (
                  <span className="inline-block animate-pulse">...</span>
                )}
                {processingPhase > 1 && (
                  <CheckCircle className="ml-2 inline h-5 w-5 text-amber-300/40" />
                )}
              </motion.p>

              <motion.p
                key="phase-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: processingPhase >= 2 ? 1 : 0,
                  y: processingPhase >= 2 ? 0 : 10,
                }}
                transition={{ duration: 0.4 }}
                className={`text-lg ${
                  processingPhase === 2 ? "font-light text-white/70" : "font-light text-white/30"
                }`}
              >
                Matching you with Dr.&nbsp;Maya
                {processingPhase === 2 && (
                  <span className="inline-block animate-pulse">...</span>
                )}
              </motion.p>
            </div>

            {/* Subtle progress bar for processing */}
            <div className="mt-10 h-1 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                className="h-full rounded-full bg-amber-400/40"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5.5, ease: "linear" }}
              />
            </div>
          </div>
        );

      /* -------------------------------------------------------------- */
      /*  Screen 17 (step 17): Results Summary                           */
      /* -------------------------------------------------------------- */
      case 17:
        return (
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03]"
            >
              <CheckCircle className="h-9 w-9 text-amber-300/40" />
            </motion.div>

            <h2 className="text-2xl font-light tracking-wide leading-relaxed text-white/80 sm:text-3xl">
              Your Personalized Program is Ready
            </h2>

            {/* Summary card */}
            <div className="glass mt-8 w-full max-w-md p-7 text-left sm:p-9">
              <div className="space-y-5">
                {/* Program length */}
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300/40" />
                  <div>
                    <p className="font-normal text-white/70">
                      {getProgramLength()} Customized Program
                    </p>
                    <p className="font-light text-sm text-white/35">
                      Tailored to your unique situation
                    </p>
                  </div>
                </div>

                {/* Coach */}
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300/40" />
                  <div>
                    <p className="font-normal text-white/70">Your Coach: Dr. Maya</p>
                    <p className="font-light text-sm text-white/35">
                      AI wellness expert, available 24/7
                    </p>
                  </div>
                </div>

                {/* Focus areas */}
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300/40" />
                  <div>
                    <p className="font-normal text-white/70">Focus Areas:</p>
                    <ul className="mt-1 space-y-1">
                      {getFocusAreas().map((area) => (
                        <li
                          key={area}
                          className="font-light text-sm text-white/35"
                        >
                          &bull; {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300/40" />
                  <div>
                    <p className="font-normal text-white/70">
                      Estimated improvement: {getTimeline()}
                    </p>
                    <p className="font-light text-sm text-white/35">
                      Based on your responses and commitment level
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={async () => {
                setSubmitting(true);
                // Check if user is authenticated
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                  // Save to API
                  try {
                    await fetch("/api/onboarding", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(answers),
                    });
                  } catch {
                    // Continue to pricing even if save fails
                  }
                } else {
                  // Store in localStorage for after signup
                  localStorage.setItem("endura_onboarding", JSON.stringify(answers));
                }
                trackEvent("onboarding_completed");
                router.push(isAuthenticated ? "/dashboard" : "/login");
              }}
              disabled={submitting}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-normal tracking-wide text-amber-200/80 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_40px_rgba(196,149,106,0.08)] disabled:opacity-50"
              style={{
                background: "rgba(196,149,106,0.1)",
                border: "1px solid rgba(196,149,106,0.15)",
              }}
            >
              {submitting ? "Saving..." : isAuthenticated ? "Go to Dashboard" : "Create My Account"}
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-light text-white/30">
                <Shield className="h-4 w-4 text-amber-300/25" />
                <span>Your data is encrypted and 100% private.</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Determine progress bar step for display                          */
  /* ---------------------------------------------------------------- */

  const getProgressStep = (): number => {
    if (step === 0) return 0;
    if (step <= 15) return step;
    if (step === 16) return 16;
    return 18;
  };

  /* ---------------------------------------------------------------- */
  /*  Show back / continue buttons?                                    */
  /* ---------------------------------------------------------------- */

  const showNavigation = step >= 1 && step <= 15;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex min-h-screen flex-col font-sans text-white">
      {/* Progress bar (hidden on welcome screen) */}
      {step > 0 && <ProgressBar step={getProgressStep()} total={TOTAL_SCREENS} />}

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-20 sm:px-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        {showNavigation && (
          <div className="mt-10 flex w-full max-w-md items-center justify-between gap-4">
            <button
              onClick={goBack}
              className="flex items-center gap-1 rounded-full px-5 py-3 text-sm font-light text-white/30 transition-colors hover:bg-white/[0.03] hover:text-white/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={goNext}
              disabled={!canContinue()}
              className={`flex items-center gap-2 rounded-full px-8 py-4 text-base transition-all duration-500 ${
                canContinue()
                  ? "font-normal tracking-wide text-amber-200/80 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(196,149,106,0.08)]"
                  : "cursor-not-allowed text-white/15"
              }`}
              style={
                canContinue()
                  ? {
                      background: "rgba(196,149,106,0.1)",
                      border: "1px solid rgba(196,149,106,0.15)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.03)",
                    }
              }
            >
              {step === 15 ? "See My Results" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
