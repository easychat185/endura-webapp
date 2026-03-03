export interface ExerciseStep {
  title: string;
  instruction: string;
  durationSeconds?: number;
}

export interface Exercise {
  slug: string;
  title: string;
  description: string;
  category: "physical" | "somatic" | "breathwork" | "meditation" | "energy" | "partner";
  subcategory?: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Master";
  tier: number;
  levelUnlock: number;
  xpReward: number;
  trackTags: ("PE" | "ED" | "DE" | "Tantric" | "Partner" | "Mindfulness")[];
  prerequisites?: string[];
  safetyNotes?: string;
  steps: ExerciseStep[];
}

// Re-export all exercises from tier files
export { exercises, getExerciseBySlug, getExercisesForLevel, getExercisesForTier } from "./index";
