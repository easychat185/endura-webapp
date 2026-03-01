"use client";

import { Flame } from "lucide-react";

interface LeaderboardRowProps {
  rank: number;
  displayName: string;
  level: number;
  xpEarned: number;
  streak: number;
  badgeCount: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardRow({
  rank,
  displayName,
  level,
  xpEarned,
  streak,
  badgeCount,
  isCurrentUser,
}: LeaderboardRowProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
      style={{
        background: isCurrentUser ? "rgba(196,149,106,0.05)" : "transparent",
        border: isCurrentUser ? "1px solid rgba(196,149,106,0.1)" : "1px solid transparent",
      }}
    >
      <span className="w-8 text-center text-sm font-light text-white/40">
        #{rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-normal truncate ${isCurrentUser ? "text-amber-200/70" : "text-white/60"}`}>
          {displayName}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-light" style={{ color: "rgba(245,158,11,0.5)" }}>
            Lv.{level}
          </span>
          {streak > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-light text-orange-300/40">
              <Flame className="h-2.5 w-2.5" />
              {streak}
            </span>
          )}
          <span className="text-xs font-light text-white/40">
            {badgeCount} badges
          </span>
        </div>
      </div>
      <span className="text-sm font-light" style={{ color: "rgba(250,204,21,0.5)" }}>
        {xpEarned.toLocaleString()} XP
      </span>
    </div>
  );
}
