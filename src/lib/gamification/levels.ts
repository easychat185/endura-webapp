/* Level definitions & XP thresholds for the gamification system */

export interface LevelDefinition {
  level: number;
  title: string;
  totalXP: number;
  unlocks: string;
}

export const LEVEL_THRESHOLDS: LevelDefinition[] = [
  { level: 1, title: "Newcomer", totalXP: 0, unlocks: "Onboarding" },
  { level: 2, title: "Beginner", totalXP: 100, unlocks: "Breathing, Body Scan, Kegel" },
  { level: 3, title: "Learner", totalXP: 250, unlocks: "Daily challenges" },
  { level: 4, title: "Practitioner", totalXP: 450, unlocks: "Start-Stop, Squeeze" },
  { level: 5, title: "Explorer", totalXP: 750, unlocks: "Leaderboard access" },
  { level: 6, title: "Achiever", totalXP: 1100, unlocks: "Sensate Focus" },
  { level: 7, title: "Dedicated", totalXP: 1500, unlocks: "Streak Shield #1" },
  { level: 8, title: "Committed", totalXP: 2000, unlocks: "Edging Practice" },
  { level: 9, title: "Skilled", totalXP: 2600, unlocks: "Advanced challenges" },
  { level: 10, title: "Expert", totalXP: 3300, unlocks: "Weekly challenges" },
  { level: 11, title: "Advanced", totalXP: 4100, unlocks: "Streak Shield #2" },
  { level: 12, title: "Master", totalXP: 5100, unlocks: "Custom title" },
  { level: 13, title: "Elite", totalXP: 6300, unlocks: "All features" },
  { level: 14, title: "Legendary", totalXP: 7800, unlocks: "Gold profile frame" },
  { level: 15, title: "Transcendent", totalXP: 9800, unlocks: "Max level badge" },
];

export function getLevelFromXP(totalXP: number): LevelDefinition {
  let result = LEVEL_THRESHOLDS[0];
  for (const def of LEVEL_THRESHOLDS) {
    if (totalXP >= def.totalXP) {
      result = def;
    } else {
      break;
    }
  }
  return result;
}

export function getXPForNextLevel(currentLevel: number): { needed: number; current: number; total: number } | null {
  const nextIdx = LEVEL_THRESHOLDS.findIndex((l) => l.level === currentLevel + 1);
  if (nextIdx === -1) return null; // max level

  const currentDef = LEVEL_THRESHOLDS.find((l) => l.level === currentLevel)!;
  const nextDef = LEVEL_THRESHOLDS[nextIdx];
  return {
    needed: nextDef.totalXP - currentDef.totalXP,
    current: 0, // filled in by caller with (totalXP - currentDef.totalXP)
    total: nextDef.totalXP,
  };
}

export function getLevelTitle(level: number): string {
  return LEVEL_THRESHOLDS.find((l) => l.level === level)?.title ?? "Newcomer";
}

export function getStreakMultiplier(streak: number): { multiplier: number; label: string } {
  if (streak >= 30) return { multiplier: 2.0, label: "Legendary" };
  if (streak >= 14) return { multiplier: 1.8, label: "Unstoppable" };
  if (streak >= 7) return { multiplier: 1.5, label: "On Fire" };
  if (streak >= 3) return { multiplier: 1.2, label: "Building" };
  return { multiplier: 1.0, label: "Starting" };
}

/** Exercise level-unlock mapping (replaces weekUnlock) */
export const EXERCISE_LEVEL_UNLOCK: Record<string, number> = {
  "diaphragmatic-breathing": 2,
  "body-scan": 2,
  "kegel-exercises": 2,
  "start-stop-technique": 4,
  "squeeze-technique": 6,
  "sensate-focus": 6,
  "edging-practice": 8,
};
