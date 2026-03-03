import type { Exercise } from "./data";
import { tier1Exercises } from "./tier-1";
import { tier2Exercises } from "./tier-2";
import { tier3Exercises } from "./tier-3";
import { tier4Exercises } from "./tier-4";
import { tier5Exercises } from "./tier-5";
import { tier6Exercises } from "./tier-6";
import { tier7Exercises } from "./tier-7";
import { tier8Exercises } from "./tier-8";
import { tier9Exercises } from "./tier-9";
import { tier10Exercises } from "./tier-10";

export const exercises: Exercise[] = [
  ...tier1Exercises,
  ...tier2Exercises,
  ...tier3Exercises,
  ...tier4Exercises,
  ...tier5Exercises,
  ...tier6Exercises,
  ...tier7Exercises,
  ...tier8Exercises,
  ...tier9Exercises,
  ...tier10Exercises,
];

export function getExerciseBySlug(slug: string): Exercise | undefined {
  return exercises.find((e) => e.slug === slug);
}

export function getExercisesForLevel(level: number): Exercise[] {
  return exercises.filter((e) => e.levelUnlock <= level);
}

export function getExercisesForTier(tier: number): Exercise[] {
  return exercises.filter((e) => e.tier === tier);
}

export function getExercisesByCategory(category: Exercise["category"]): Exercise[] {
  return exercises.filter((e) => e.category === category);
}
