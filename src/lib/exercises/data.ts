export interface ExerciseStep {
  title: string;
  instruction: string;
  durationSeconds?: number;
  audioUrl?: string; // pre-recorded audio file path in Supabase Storage
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
  imageKey?: string;       // maps to reusable diagram (e.g. "pelvic-floor")
  muscleGroups?: string[]; // e.g. ["pc-muscle", "diaphragm"]
}

// Re-export all exercises from tier files
export { exercises, getExerciseBySlug, getExercisesForLevel, getExercisesForTier } from "./index";
