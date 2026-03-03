import type { Exercise } from "./data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const BUCKET = "exercise-media";

// ── 18 reusable anatomical diagram keys ──────────────────────────────

interface ImageEntry {
  path: string;
  alt: string;
}

export const IMAGE_MAP: Record<string, ImageEntry> = {
  "pelvic-floor":       { path: "anatomy/pelvic-floor.webp",       alt: "Pelvic floor muscles, male side view" },
  "kegel-exercise":     { path: "anatomy/kegel-exercise.webp",     alt: "PC muscle engagement diagram" },
  "edging-technique":   { path: "anatomy/edging-technique.webp",   alt: "Arousal wave graph for edging" },
  "arousal-scale":      { path: "anatomy/arousal-scale.webp",      alt: "1-10 arousal scale gradient" },
  "squeeze-technique":  { path: "anatomy/squeeze-technique.webp",  alt: "Squeeze technique hand position" },
  "start-stop":         { path: "anatomy/start-stop.webp",         alt: "Start-stop timing diagram" },
  "breathing-belly":    { path: "anatomy/breathing-belly.webp",    alt: "Diaphragm belly breathing diagram" },
  "breathing-box":      { path: "anatomy/breathing-box.webp",      alt: "Box breathing 4-4-4-4 pattern" },
  "breathing-nadi":     { path: "anatomy/breathing-nadi.webp",     alt: "Alternate nostril breathing position" },
  "body-scan":          { path: "anatomy/body-scan.webp",          alt: "Body outline with scan zones" },
  "meditation-posture": { path: "anatomy/meditation-posture.webp", alt: "Seated meditation posture" },
  "chakra-centers":     { path: "anatomy/chakra-centers.webp",     alt: "7 chakra points on body" },
  "energy-circuit":     { path: "anatomy/energy-circuit.webp",     alt: "Energy circulation pathway" },
  "mula-bandha":        { path: "anatomy/mula-bandha.webp",        alt: "Mula bandha anatomical detail" },
  "uddiyana-bandha":    { path: "anatomy/uddiyana-bandha.webp",    alt: "Uddiyana bandha detail" },
  "partner-sensate":    { path: "anatomy/partner-sensate.webp",    alt: "Two silhouettes with touch zones" },
  "partner-breathing":  { path: "anatomy/partner-breathing.webp",  alt: "Synchronized breathing visual" },
  "assessment-overview":{ path: "anatomy/assessment-overview.webp", alt: "Assessment checklist visual" },
};

// ── Category/subcategory → default image key mapping ─────────────────

const SUBCATEGORY_IMAGE: Record<string, string> = {
  kegel: "kegel-exercise",
  edging: "edging-technique",
  assessment: "assessment-overview",
  squeeze: "squeeze-technique",
  "start-stop": "start-stop",
  diaphragmatic: "breathing-belly",
  pranayama: "breathing-nadi",
  bandha: "mula-bandha",
};

const CATEGORY_IMAGE: Record<Exercise["category"], string> = {
  physical: "pelvic-floor",
  somatic: "body-scan",
  breathwork: "breathing-box",
  meditation: "meditation-posture",
  energy: "chakra-centers",
  partner: "partner-sensate",
};

/**
 * Derives the best image key for an exercise based on its explicit imageKey,
 * subcategory, or category — no need to edit every tier file.
 */
export function getDefaultImageKey(exercise: Exercise): string {
  if (exercise.imageKey) return exercise.imageKey;
  if (exercise.subcategory && SUBCATEGORY_IMAGE[exercise.subcategory]) {
    return SUBCATEGORY_IMAGE[exercise.subcategory];
  }
  return CATEGORY_IMAGE[exercise.category] ?? "pelvic-floor";
}

/**
 * Returns the full Supabase Storage public URL for an image key.
 */
export function getExerciseImageUrl(key: string): string | null {
  const entry = IMAGE_MAP[key];
  if (!entry) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${entry.path}`;
}

/**
 * Returns alt text for an image key.
 */
export function getExerciseImageAlt(key: string): string {
  return IMAGE_MAP[key]?.alt ?? "Exercise diagram";
}

/**
 * Resolves a relative audio path to a full Supabase Storage URL.
 */
export function getStepAudioUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}
