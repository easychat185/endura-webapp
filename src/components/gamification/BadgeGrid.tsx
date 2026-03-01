"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BadgeCard from "./BadgeCard";

interface Badge {
  id: string;
  label: string;
  description: string;
  rarity: string;
  category: string;
  earned: boolean;
  earnedAt: string | null;
}

interface BadgeGridProps {
  badges: Badge[];
  earnedCount: number;
  totalCount: number;
}

type FilterCategory = "all" | "streak" | "exercise" | "session" | "score" | "level" | "special";

export default function BadgeGrid({ badges, earnedCount, totalCount }: BadgeGridProps) {
  const [filter, setFilter] = useState<FilterCategory>("all");

  const filtered = filter === "all" ? badges : badges.filter((b) => b.category === filter);

  // Sort: earned first, then by rarity
  const rarityOrder = { legendary: 0, rare: 1, uncommon: 2, common: 3 };
  const sorted = [...filtered].sort((a, b) => {
    if (a.earned !== b.earned) return a.earned ? -1 : 1;
    return (rarityOrder[a.rarity as keyof typeof rarityOrder] ?? 3) -
           (rarityOrder[b.rarity as keyof typeof rarityOrder] ?? 3);
  });

  const categories: { key: FilterCategory; label: string }[] = [
    { key: "all", label: "All" },
    { key: "streak", label: "Streak" },
    { key: "exercise", label: "Exercise" },
    { key: "session", label: "Session" },
    { key: "score", label: "Score" },
    { key: "level", label: "Level" },
    { key: "special", label: "Special" },
  ];

  return (
    <div>
      {/* Badge count */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-normal tracking-wide text-white/70">
          Badges
        </h3>
        <span className="text-xs font-light text-amber-300/40">
          {earnedCount}/{totalCount} earned
        </span>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className="rounded-full px-3 py-1.5 text-xs font-normal capitalize transition-all duration-300"
            style={{
              background: filter === cat.key ? "rgba(196,149,106,0.1)" : "rgba(255,255,255,0.03)",
              border: filter === cat.key ? "1px solid rgba(196,149,106,0.15)" : "1px solid rgba(255,255,255,0.04)",
              color: filter === cat.key ? "rgba(212,180,140,0.8)" : "rgba(255,255,255,0.35)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        {sorted.map((badge) => (
          <motion.div
            key={badge.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <BadgeCard {...badge} />
          </motion.div>
        ))}
      </motion.div>

      {sorted.length === 0 && (
        <p className="text-center text-sm font-light text-white/40 py-8">
          No badges in this category yet.
        </p>
      )}
    </div>
  );
}
