"use client";

import { motion } from "framer-motion";

interface LeaderboardEntry {
  display_name: string;
  level: number;
  xp_earned: number;
  streak: number;
  rank: number;
}

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
}

const podiumColors = [
  { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.15)", text: "rgba(234,179,8,0.7)" },
  { bg: "rgba(148,163,184,0.06)", border: "rgba(148,163,184,0.12)", text: "rgba(148,163,184,0.6)" },
  { bg: "rgba(180,120,60,0.06)", border: "rgba(180,120,60,0.12)", text: "rgba(180,120,60,0.6)" },
];

export default function LeaderboardPodium({ entries }: LeaderboardPodiumProps) {
  const top3 = entries.slice(0, 3);
  // Display order: 2nd, 1st, 3rd
  const displayOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const heights = ["h-24", "h-32", "h-20"];

  if (top3.length === 0) {
    return (
      <p className="text-center text-sm font-light text-white/40 py-8">
        No leaderboard data yet.
      </p>
    );
  }

  return (
    <div className="flex items-end justify-center gap-3 pt-6 pb-4">
      {displayOrder.map((entry, idx) => {
        const rank = entry.rank;
        const color = podiumColors[(rank - 1)] ?? podiumColors[2];
        const height = heights[idx] ?? "h-20";

        return (
          <motion.div
            key={entry.display_name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="flex flex-col items-center"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full mb-2"
              style={{ background: color.bg, border: `1px solid ${color.border}` }}
            >
              <span className="text-sm font-light" style={{ color: color.text }}>
                {rank}
              </span>
            </div>
            <p className="text-xs font-normal text-white/60 mb-1 truncate max-w-[80px] text-center">
              {entry.display_name}
            </p>
            <p className="text-xs font-light text-white/40">Lv.{entry.level}</p>
            <div
              className={`w-20 ${height} rounded-t-xl mt-2 flex items-end justify-center pb-2`}
              style={{ background: color.bg, border: `1px solid ${color.border}`, borderBottom: "none" }}
            >
              <span className="text-xs font-light" style={{ color: color.text }}>
                {entry.xp_earned.toLocaleString()} XP
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
