"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, Sparkles } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
}

interface DailyChallengesProps {
  challenges: Challenge[];
  allCompleted: boolean;
  bonusClaimed: boolean;
}

export default function DailyChallenges({ challenges, allCompleted, bonusClaimed }: DailyChallengesProps) {
  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div
      className="glass p-6 sm:p-7"
      style={{
        borderColor: allCompleted ? "rgba(74,222,128,0.1)" : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "rgba(168,85,247,0.08)" }}
          >
            <Sparkles className="h-4 w-4" style={{ color: "rgba(168,85,247,0.5)" }} />
          </div>
          <div>
            <h3 className="text-sm font-normal text-white/70">Daily Challenges</h3>
            <p className="text-xs font-light text-white/40">
              {completedCount}/{challenges.length} completed
            </p>
          </div>
        </div>
        {allCompleted && !bonusClaimed && (
          <span
            className="rounded-full px-2.5 py-1 text-xs font-normal"
            style={{
              background: "rgba(250,204,21,0.08)",
              color: "rgba(250,204,21,0.7)",
            }}
          >
            +50 XP Bonus!
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        {challenges.map((challenge, idx) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{
              background: challenge.completed ? "rgba(74,222,128,0.03)" : "transparent",
            }}
          >
            {challenge.completed ? (
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400/50" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-white/[0.12]" />
            )}
            <span
              className={`text-sm font-light flex-1 ${
                challenge.completed ? "text-emerald-300/50" : "text-white/40"
              }`}
            >
              {challenge.title}
            </span>
            <span
              className="text-xs font-light"
              style={{ color: "rgba(250,204,21,0.4)" }}
            >
              +{challenge.xp} XP
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
