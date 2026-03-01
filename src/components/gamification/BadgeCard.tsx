"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface BadgeCardProps {
  id: string;
  label: string;
  description: string;
  rarity: string;
  earned: boolean;
  category: string;
}

const rarityStyles: Record<string, { border: string; glow: string; bg: string }> = {
  common: {
    border: "rgba(148,163,184,0.15)",
    glow: "none",
    bg: "rgba(148,163,184,0.04)",
  },
  uncommon: {
    border: "rgba(245,158,11,0.2)",
    glow: "0 0 20px rgba(245,158,11,0.06)",
    bg: "rgba(245,158,11,0.04)",
  },
  rare: {
    border: "rgba(52,211,153,0.2)",
    glow: "0 0 20px rgba(52,211,153,0.06)",
    bg: "rgba(52,211,153,0.04)",
  },
  legendary: {
    border: "rgba(250,204,21,0.3)",
    glow: "0 0 30px rgba(250,204,21,0.1)",
    bg: "linear-gradient(135deg, rgba(250,204,21,0.06), rgba(245,158,11,0.04))",
  },
};

const rarityLabel: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  legendary: "Legendary",
};

export default function BadgeCard({ label, description, rarity, earned }: BadgeCardProps) {
  const style = rarityStyles[rarity] ?? rarityStyles.common;

  return (
    <motion.div
      className={`relative rounded-2xl p-4 transition-all ${!earned ? "opacity-40 grayscale-[0.5]" : ""}`}
      style={{
        background: earned ? style.bg : "rgba(255,255,255,0.02)",
        border: `1px solid ${earned ? style.border : "rgba(255,255,255,0.04)"}`,
        boxShadow: earned ? style.glow : "none",
      }}
      whileHover={earned ? { scale: 1.02 } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: earned ? style.bg : "rgba(255,255,255,0.03)",
            border: `1px solid ${earned ? style.border : "rgba(255,255,255,0.04)"}`,
          }}
        >
          {earned ? (
            <span className="text-lg">
              {rarity === "legendary" ? "✨" : rarity === "rare" ? "💎" : rarity === "uncommon" ? "🔸" : "⚪"}
            </span>
          ) : (
            <Lock className="h-4 w-4 text-white/40" />
          )}
        </div>
        <span
          className="text-xs font-normal uppercase tracking-wider"
          style={{
            color: earned
              ? rarity === "legendary" ? "rgba(250,204,21,0.6)"
              : rarity === "rare" ? "rgba(52,211,153,0.5)"
              : rarity === "uncommon" ? "rgba(245,158,11,0.5)"
              : "rgba(148,163,184,0.4)"
              : "rgba(255,255,255,0.15)",
          }}
        >
          {rarityLabel[rarity]}
        </span>
      </div>

      <h4 className={`text-sm font-normal ${earned ? "text-white/70" : "text-white/40"}`}>
        {label}
      </h4>
      <p className={`mt-1 text-xs font-light leading-relaxed ${earned ? "text-white/35" : "text-white/40"}`}>
        {description}
      </p>
    </motion.div>
  );
}
