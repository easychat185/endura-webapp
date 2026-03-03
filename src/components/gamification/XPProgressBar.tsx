"use client";

import { motion } from "framer-motion";

interface XPProgressBarProps {
  level: number;
  levelTitle: string;
  xpInLevel: number;
  xpNeeded: number;
  totalXP: number;
  tier?: number;
  tierName?: string;
}

export default function XPProgressBar({ level, levelTitle, xpInLevel, xpNeeded, totalXP, tier, tierName }: XPProgressBarProps) {
  const percent = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;
  const tierProgress = tier ? ((level - 1) % 10) + 1 : undefined;

  return (
    <div className="glass p-5 sm:p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-light"
            style={{ color: "rgba(245,158,11,0.8)" }}
          >
            Lv.{level}
          </span>
          <span className="text-sm font-light text-white/40">{levelTitle}</span>
        </div>
        <span className="text-xs font-light text-white/40">
          {totalXP.toLocaleString()} XP
        </span>
      </div>

      {tier && tierName && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-light" style={{ color: "rgba(196,149,106,0.5)" }}>
            Tier {tier}: {tierName}
          </span>
          <span className="text-xs font-light text-white/30">
            {tierProgress}/10 in tier
          </span>
        </div>
      )}

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(245,158,11,0.5), rgba(250,204,21,0.5))",
            boxShadow: "0 0 12px rgba(245,158,11,0.15)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs font-light" style={{ color: "rgba(250,204,21,0.4)" }}>
          {xpInLevel}/{xpNeeded} XP
        </span>
        {level < 100 ? (
          <span className="text-xs font-light text-white/40">
            Level {level + 1}
          </span>
        ) : (
          <span className="text-xs font-light" style={{ color: "rgba(250,204,21,0.5)" }}>
            Max Level
          </span>
        )}
      </div>
    </div>
  );
}
