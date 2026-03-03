"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Diamond } from "lucide-react";
import { LEVEL_THRESHOLDS, type LevelDefinition } from "@/lib/gamification/levels";

interface LevelRoadmapProps {
  currentLevel: number;
  totalXP: number;
}

function TierSection({
  tier,
  tierName,
  levels,
  currentLevel,
  totalXP,
  defaultExpanded,
}: {
  tier: number;
  tierName: string;
  levels: LevelDefinition[];
  currentLevel: number;
  totalXP: number;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const currentRef = useRef<HTMLDivElement>(null);

  const completedCount = levels.filter((l) => l.level < currentLevel).length;
  const isCurrent = levels.some((l) => l.level === currentLevel);
  const adjustedCompleted = completedCount + (isCurrent ? 0 : levels.some((l) => l.level === currentLevel) ? 0 : 0);
  const progressText = `${completedCount}/${levels.length}`;

  useEffect(() => {
    if (defaultExpanded && currentRef.current) {
      setTimeout(() => {
        currentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  }, [defaultExpanded]);

  return (
    <div className="mb-3">
      {/* Tier header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300"
        style={{
          background: isCurrent ? "rgba(196,149,106,0.08)" : "rgba(255,255,255,0.02)",
          border: isCurrent ? "1px solid rgba(196,149,106,0.12)" : "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-normal"
            style={{
              background: isCurrent ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)",
              color: isCurrent ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.3)",
            }}
          >
            {tier}
          </span>
          <div className="text-left">
            <p className={`text-sm font-normal tracking-wide ${isCurrent ? "text-amber-200/80" : "text-white/50"}`}>
              Tier {tier}: {tierName}
            </p>
            <p className="text-xs font-light text-white/30">{progressText} completed</p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-white/30" />
        </motion.div>
      </button>

      {/* Level nodes */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-9 pt-2 pb-1">
              {levels.map((levelDef, idx) => {
                const isCompleted = levelDef.level < currentLevel;
                const isCurrentLevel = levelDef.level === currentLevel;
                const isLocked = levelDef.level > currentLevel;
                const isLast = idx === levels.length - 1;

                // XP progress for current level
                let xpProgress = 0;
                if (isCurrentLevel) {
                  const nextDef = LEVEL_THRESHOLDS.find((l) => l.level === currentLevel + 1);
                  if (nextDef) {
                    const xpIntoLevel = totalXP - levelDef.totalXP;
                    const xpNeeded = nextDef.totalXP - levelDef.totalXP;
                    xpProgress = xpNeeded > 0 ? Math.min(xpIntoLevel / xpNeeded, 1) : 1;
                  }
                }

                return (
                  <div
                    key={levelDef.level}
                    ref={isCurrentLevel ? currentRef : undefined}
                    className="relative flex gap-4"
                  >
                    {/* Connector line + node */}
                    <div className="flex flex-col items-center" style={{ width: 32 }}>
                      {/* Node */}
                      {levelDef.isMilestone ? (
                        <div
                          className={`relative flex items-center justify-center ${isCurrentLevel ? "h-10 w-10" : "h-8 w-8"}`}
                          style={{
                            transform: "rotate(45deg)",
                            background: isCompleted
                              ? "rgba(245,158,11,0.15)"
                              : isCurrentLevel
                                ? "rgba(245,158,11,0.12)"
                                : "rgba(255,255,255,0.03)",
                            border: isCompleted
                              ? "2px solid rgba(245,158,11,0.4)"
                              : isCurrentLevel
                                ? "2px solid rgba(245,158,11,0.35)"
                                : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 4,
                            boxShadow: isCurrentLevel
                              ? "0 0 20px rgba(245,158,11,0.15)"
                              : "none",
                          }}
                        >
                          <span style={{ transform: "rotate(-45deg)" }}>
                            {isCompleted ? (
                              <Check className="h-3.5 w-3.5 text-amber-400/70" />
                            ) : (
                              <Diamond className={`h-3 w-3 ${isCurrentLevel ? "text-amber-400/60" : "text-white/15"}`} />
                            )}
                          </span>
                          {isCurrentLevel && (
                            <motion.div
                              className="absolute inset-0 rounded-[4px]"
                              style={{ border: "2px solid rgba(245,158,11,0.3)" }}
                              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          )}
                        </div>
                      ) : (
                        <div
                          className={`relative flex items-center justify-center rounded-full ${isCurrentLevel ? "h-9 w-9" : "h-7 w-7"}`}
                          style={{
                            background: isCompleted
                              ? "rgba(245,158,11,0.12)"
                              : isCurrentLevel
                                ? "rgba(245,158,11,0.1)"
                                : "transparent",
                            border: isCompleted
                              ? "1.5px solid rgba(245,158,11,0.35)"
                              : isCurrentLevel
                                ? "1.5px solid rgba(245,158,11,0.3)"
                                : "1px solid rgba(255,255,255,0.08)",
                            boxShadow: isCurrentLevel
                              ? "0 0 16px rgba(245,158,11,0.12)"
                              : "none",
                          }}
                        >
                          {isCompleted ? (
                            <Check className="h-3 w-3 text-amber-400/60" />
                          ) : (
                            <span
                              className={`text-xs font-light ${isCurrentLevel ? "text-amber-300/70" : "text-white/20"}`}
                            >
                              {levelDef.level}
                            </span>
                          )}
                          {isCurrentLevel && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{ border: "1.5px solid rgba(245,158,11,0.25)" }}
                              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          )}
                        </div>
                      )}

                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className="flex-1"
                          style={{
                            width: 2,
                            minHeight: 16,
                            background: isCompleted
                              ? "rgba(245,158,11,0.2)"
                              : "rgba(255,255,255,0.04)",
                          }}
                        />
                      )}
                    </div>

                    {/* Level info */}
                    <div className={`flex-1 pb-5 ${isLast ? "pb-2" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-normal ${
                            isCompleted
                              ? "text-amber-200/60"
                              : isCurrentLevel
                                ? "text-amber-200/80"
                                : "text-white/25"
                          }`}
                        >
                          Lv. {levelDef.level}
                        </span>
                        {levelDef.isMilestone && (
                          <span
                            className="rounded-full px-1.5 py-0.5 text-[10px] font-normal"
                            style={{
                              background: isCompleted || isCurrentLevel
                                ? "rgba(245,158,11,0.1)"
                                : "rgba(255,255,255,0.03)",
                              color: isCompleted || isCurrentLevel
                                ? "rgba(245,158,11,0.6)"
                                : "rgba(255,255,255,0.2)",
                            }}
                          >
                            Milestone
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs font-light mt-0.5 ${
                          isCompleted
                            ? "text-white/40"
                            : isCurrentLevel
                              ? "text-white/50"
                              : "text-white/20"
                        }`}
                      >
                        {levelDef.title}
                      </p>
                      {levelDef.unlocks && (
                        <p className={`text-xs font-light mt-0.5 ${isLocked ? "text-white/10" : "text-white/25"}`}>
                          {levelDef.unlocks}
                        </p>
                      )}
                      {isCurrentLevel && (
                        <div className="mt-2">
                          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/[0.04]">
                            <motion.div
                              className="h-full rounded-full bg-amber-400/40"
                              initial={{ width: 0 }}
                              animate={{ width: `${xpProgress * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] font-light text-amber-300/40">
                            {Math.round(xpProgress * 100)}% to next level
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LevelRoadmap({ currentLevel, totalXP }: LevelRoadmapProps) {
  // Group levels by tier (1-10, 11-20, ...)
  const tiers: { tier: number; tierName: string; levels: LevelDefinition[] }[] = [];
  for (let t = 1; t <= 10; t++) {
    const tierLevels = LEVEL_THRESHOLDS.filter((l) => l.tier === t);
    if (tierLevels.length > 0) {
      tiers.push({ tier: t, tierName: tierLevels[0].tierName, levels: tierLevels });
    }
  }

  const currentTier = Math.min(Math.ceil(currentLevel / 10), 10);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-normal uppercase tracking-[0.15em] text-amber-300/45">
          100-Level Journey
        </h3>
        <span className="text-xs font-light text-white/30">
          Level {currentLevel}
        </span>
      </div>

      {tiers.map(({ tier, tierName, levels }) => (
        <TierSection
          key={tier}
          tier={tier}
          tierName={tierName}
          levels={levels}
          currentLevel={currentLevel}
          totalXP={totalXP}
          defaultExpanded={tier === currentTier}
        />
      ))}
    </div>
  );
}
