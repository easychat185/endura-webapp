"use client";

import { motion } from "framer-motion";

interface ActivityDay {
  date: string;
  active: boolean;
  xp: number;
}

interface StreakCalendarProps {
  activities: ActivityDay[];
}

export default function StreakCalendar({ activities }: StreakCalendarProps) {
  // Build last 7 weeks (49 days) grid
  const today = new Date();
  const days: { date: string; active: boolean; xp: number }[] = [];
  const activityMap = new Map(activities.map((a) => [a.date, a]));

  for (let i = 48; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const activity = activityMap.get(dateStr);
    days.push({
      date: dateStr,
      active: activity?.active ?? false,
      xp: activity?.xp ?? 0,
    });
  }

  // Split into weeks (7 columns)
  const weeks: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="glass p-5 sm:p-6">
      <h3 className="text-sm font-normal text-white/50 mb-4">Activity</h3>
      <div className="flex gap-1 justify-center">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: wi * 0.05 }}
                className="h-4 w-4 rounded-sm"
                style={{
                  background: day.active
                    ? day.xp > 100
                      ? "rgba(245,158,11,0.5)"
                      : day.xp > 50
                        ? "rgba(245,158,11,0.3)"
                        : "rgba(245,158,11,0.15)"
                    : "rgba(255,255,255,0.03)",
                }}
                title={`${day.date}: ${day.active ? `${day.xp} XP` : "No activity"}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-3">
        <span className="text-xs font-light text-white/40">Less</span>
        {[0.03, 0.15, 0.3, 0.5].map((opacity, i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-sm"
            style={{
              background: i === 0 ? "rgba(255,255,255,0.03)" : `rgba(245,158,11,${opacity})`,
            }}
          />
        ))}
        <span className="text-xs font-light text-white/40">More</span>
      </div>
    </div>
  );
}
