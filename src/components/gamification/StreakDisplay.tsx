"use client";

import { Flame, Shield } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
  multiplier: number;
  label: string;
  shields: number;
}

export default function StreakDisplay({ streak, multiplier, label, shields }: StreakDisplayProps) {
  if (streak === 0) return null;

  return (
    <div className="glass p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          style={{
            background: streak >= 7
              ? "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(239,68,68,0.08))"
              : "rgba(251,146,60,0.08)",
            border: "1px solid rgba(251,146,60,0.12)",
          }}
        >
          <Flame
            className="h-6 w-6"
            style={{
              color: streak >= 7 ? "rgba(251,146,60,0.7)" : "rgba(251,146,60,0.5)",
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-extralight tracking-tight text-white/80">
              {streak} day{streak !== 1 ? "s" : ""}
            </p>
            {multiplier > 1 && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-normal"
                style={{
                  background: "rgba(251,146,60,0.1)",
                  color: "rgba(251,146,60,0.7)",
                }}
              >
                {multiplier}x
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs font-light text-orange-300/40">
              {label}
            </p>
            {shields > 0 && (
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" style={{ color: "rgba(56,189,248,0.5)" }} />
                <span className="text-xs font-light" style={{ color: "rgba(56,189,248,0.5)" }}>
                  {shields} shield{shields !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
