/* Level definitions & XP thresholds for the 100-level gamification system */

export interface LevelDefinition {
  level: number;
  title: string;
  totalXP: number;
  tier: number;
  tierName: string;
  unlocks: string;
  isMilestone: boolean;
  milestoneXPBonus?: number;
}

/** XP formula: floor(50 * level^1.45) cumulative */
function cumulativeXP(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += Math.floor(50 * Math.pow(i, 1.45));
  }
  return total;
}

const TIER_NAMES: Record<number, string> = {
  1: "Foundation",
  2: "Awakening",
  3: "Development",
  4: "Strengthening",
  5: "Integration",
  6: "Refinement",
  7: "Transformation",
  8: "Mastery Preparation",
  9: "Mastery",
  10: "Transcendence",
};

const LEVEL_TITLES: Record<number, string> = {
  1: "First Breath",
  2: "Body Basics",
  3: "Tension Mapping",
  4: "Breath Control",
  5: "Pelvic Intelligence",
  6: "Sensation Literacy",
  7: "Awareness Deepening",
  8: "Endurance Building",
  9: "Mental Strength",
  10: "Foundation Complete",
  11: "Arousal Architecture",
  12: "Breath as Control",
  13: "Touch Intelligence",
  14: "The Observer Strengthened",
  15: "Emotional Ground",
  16: "Muscular Mastery",
  17: "Visualization Power",
  18: "Rhythm and Flow",
  19: "Consolidation Week",
  20: "Awakening Complete",
  21: "Multi-Edge Foundation",
  22: "Deceleration Mastery",
  23: "Arousal Surfing",
  24: "Control Under Pressure",
  25: "Quarter Mark",
  26: "Technique Stacking",
  27: "Variable Intensity",
  28: "Recovery Acceleration",
  29: "Stamina Session",
  30: "Development Complete",
  31: "Bandha Combination",
  32: "Position Variation",
  33: "Extended Plateau",
  34: "Erection Quality Focus",
  35: "Sensation Amplification",
  36: "Emotional Integration",
  37: "Speed Ceiling Expansion",
  38: "Triple Lock Introduction",
  39: "Consolidation",
  40: "Strengthening Complete",
  41: "Energy Awareness",
  42: "Chakra Body Scan",
  43: "Energy Circulation Basics",
  44: "Partner Preparation",
  45: "Partner Sensate Focus",
  46: "Arousal Cycling",
  47: "Sound as Release",
  48: "Orgasmic Breathing Introduction",
  49: "Integration Flow",
  50: "Halfway Point",
  51: "Automatic Control",
  52: "Breath Retention Under Arousal",
  53: "Advanced Energy Circulation",
  54: "Sensitivity Refinement",
  55: "Partner Breathing Together",
  56: "Advanced Plateau",
  57: "Breath of Fire Integration",
  58: "DE Advanced Sensation",
  59: "Pre-NEO Preparation",
  60: "Refinement Complete",
  61: "Full Microcosmic Orbit",
  62: "Orgasmic Breathing Extended",
  63: "NEO Training Phase 1",
  64: "Partner Non-Sexual Touch",
  65: "Tantric Gaze",
  66: "NEO Training Phase 2",
  67: "Full Body Pleasure Map",
  68: "Partner Genital Sensate Focus",
  69: "Energy and Arousal Integration",
  70: "Transformation Complete",
  71: "Partner Rhythmic Practice",
  72: "Breath Synchronization",
  73: "NEO Training Phase 3",
  74: "Void Meditation",
  75: "Three-Quarter Mark",
  76: "Tantric Visualization",
  77: "Extended Containment",
  78: "Multiple Orgasmic Response",
  79: "Whole-Body Orgasmic Breathing",
  80: "Mastery Preparation Complete",
  81: "NEO Reliability",
  82: "Energy Mastery",
  83: "Partner Tantric Practice",
  84: "Kundalini Breathing",
  85: "Multi-Orgasmic Session",
  86: "Union Meditation",
  87: "Advanced DE Work",
  88: "Full-Body Orgasm Exploration",
  89: "Integration and Personal Style",
  90: "Mastery Achieved",
  91: "Effortless Control",
  92: "Tantric Presence",
  93: "Advanced Partner Union",
  94: "Kundalini Integration",
  95: "Teaching Capacity",
  96: "Sustainable Practice Design",
  97: "Gratitude and Legacy",
  98: "The Final Edge",
  99: "Complete Presence",
  100: "Transcendence",
};

const LEVEL_UNLOCKS: Record<number, string> = {
  1: "Onboarding & first exercises",
  2: "Belly Breathing, Kegel Discovery",
  3: "Progressive Muscle Relaxation, Reverse Kegels",
  4: "Start-Stop Technique, Box Breathing",
  5: "Pelvic Floor Differentiation, Kegel Pyramid",
  6: "Sensate Focus, Squeeze Technique",
  7: "Integrated Start-Stop-Squeeze",
  8: "Edging Practice, Kegel Flutter",
  9: "Cognitive Defusion, Thought Cloud Meditation",
  10: "Foundation Assessment, Tier 2 unlocked",
  11: "Arousal Mapping, Deceleration Training",
  12: "Breath-Controlled Edging, Nadi Shodhana",
  13: "Genital Sensate Focus, Minimal Stimulation",
  14: "Observer Edging, Speed Variation Drill",
  15: "Shame Inventory, Loving-Kindness Meditation",
  16: "Mula Bandha, Isometric Pelvic Floor",
  17: "Arousal Dial Visualization, Energy Visualization",
  18: "Rhythmic Edging, Movement Meditation",
  19: "Flow Session, Endurance Edge",
  20: "Tier 2 Assessment, Tier 3 unlocked",
  21: "Multi-Edge Sessions, Speed Escalation",
  22: "Timed Deceleration, Emergency Breathing",
  23: "Plateau Surfing, High Zone Surfing",
  24: "Pressure-Tested Edging, Distraction Tolerance",
  25: "Quarter Assessment, Tier 4 preview",
  26: "Technique Stacking exercises",
  27: "Variable Intensity drills",
  28: "Recovery Acceleration training",
  29: "Stamina Sessions, Uddiyana Bandha intro",
  30: "Tier 3 Assessment, Tier 4 unlocked",
  31: "Bandha Combination exercises",
  32: "Position Variation training",
  33: "Extended Plateau, Kapalabhati prep",
  34: "ED Complementary exercises",
  35: "Ultra-light touch edging",
  36: "Tantric breath introduction",
  37: "Speed Ceiling drills",
  38: "Triple Lock (Maha Bandha)",
  39: "Full integration practice",
  40: "Tier 4 Assessment, Tier 5 unlocked",
  41: "Energy direction exercises",
  42: "Chakra Body Scan meditation",
  43: "Energy Circulation basics",
  44: "Partner Communication prep",
  45: "Partner Sensate Focus solo prep",
  46: "Arousal Cycling drills",
  47: "Vocalization exercises",
  48: "Orgasmic Breathing intro",
  49: "Integration Flow sessions",
  50: "Halfway Assessment, Tier 6 unlocked",
  51: "Automatic Control sessions",
  52: "Kumbhaka under arousal",
  53: "Microcosmic Orbit basics",
  54: "0.5-scale sensitivity training",
  55: "Partner Breathing Together",
  56: "20-min high-zone plateau",
  57: "Breath of Fire + edging",
  58: "DE sensation variety",
  59: "NEO concept introduction",
  60: "Tier 6 Assessment, Tier 7 unlocked",
  61: "Full Microcosmic Orbit",
  62: "Extended Orgasmic Breathing",
  63: "NEO Lock Phase 1",
  64: "Partner Non-Sexual Touch",
  65: "Tantric Gaze (Tratak)",
  66: "NEO Lock Phase 2",
  67: "Full Body Pleasure Mapping",
  68: "Partner Genital Sensate Focus",
  69: "Energy-Arousal Integration",
  70: "Tier 7 Assessment, Tier 8 unlocked",
  71: "Partner Rhythmic Practice",
  72: "Breath Synchronization During Arousal",
  73: "NEO Training Phase 3",
  74: "Void Meditation",
  75: "Three-Quarter Assessment",
  76: "Tantric Visualization advanced",
  77: "Extended Containment practice",
  78: "Multiple Orgasmic Response",
  79: "Whole-Body Orgasmic Breathing",
  80: "Tier 8 Assessment, Tier 9 unlocked",
  81: "NEO Reliability training",
  82: "Autopilot Energy Mastery",
  83: "Partner Tantric Practice",
  84: "Kundalini Breathing kriya",
  85: "Multi-Orgasmic Sessions",
  86: "Union Meditation",
  87: "Advanced DE techniques",
  88: "Full-Body Orgasm Exploration",
  89: "Personal Practice Design",
  90: "Tier 9 Assessment, Tier 10 unlocked",
  91: "Effortless Control practice",
  92: "All-day Tantric Presence",
  93: "Advanced Partner Union",
  94: "Kundalini Integration",
  95: "Teaching Capacity development",
  96: "Sustainable Practice Design",
  97: "Gratitude and Legacy reflection",
  98: "The Final Edge capstone",
  99: "Complete Presence day",
  100: "Final Assessment, program complete",
};

const MILESTONE_LEVELS: Record<number, number> = {
  10: 200,
  20: 300,
  25: 500,
  30: 350,
  40: 400,
  50: 750,
  60: 500,
  70: 600,
  75: 850,
  80: 700,
  90: 900,
  100: 2000,
};

function buildLevelThresholds(): LevelDefinition[] {
  const levels: LevelDefinition[] = [];
  for (let i = 1; i <= 100; i++) {
    const tier = Math.min(Math.ceil(i / 10), 10);
    const isMilestone = i in MILESTONE_LEVELS;
    levels.push({
      level: i,
      title: LEVEL_TITLES[i] ?? `Level ${i}`,
      totalXP: cumulativeXP(i),
      tier,
      tierName: TIER_NAMES[tier],
      unlocks: LEVEL_UNLOCKS[i] ?? "",
      isMilestone,
      milestoneXPBonus: isMilestone ? MILESTONE_LEVELS[i] : undefined,
    });
  }
  return levels;
}

export const LEVEL_THRESHOLDS: LevelDefinition[] = buildLevelThresholds();

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

export function getTierForLevel(level: number): { tier: number; tierName: string } {
  const tier = Math.min(Math.ceil(level / 10), 10);
  return { tier, tierName: TIER_NAMES[tier] };
}

export function getStreakMultiplier(streak: number): { multiplier: number; label: string } {
  if (streak >= 30) return { multiplier: 2.0, label: "Legendary" };
  if (streak >= 14) return { multiplier: 1.8, label: "Unstoppable" };
  if (streak >= 7) return { multiplier: 1.5, label: "On Fire" };
  if (streak >= 3) return { multiplier: 1.2, label: "Building" };
  return { multiplier: 1.0, label: "Starting" };
}

/** Exercise level-unlock mapping */
export const EXERCISE_LEVEL_UNLOCK: Record<string, number> = {
  // Tier 1: Foundation (1-10)
  "basic-belly-breathing": 1,
  "pelvic-floor-discovery": 1,
  "settling-meditation": 1,
  "diaphragmatic-breathing": 2,
  "basic-kegel-routine": 2,
  "standing-body-check": 2,
  "guided-body-scan": 2,
  "progressive-muscle-relaxation": 3,
  "kegel-progression-a": 3,
  "extended-breathing": 4,
  "coordinated-kegel-breath": 4,
  "start-stop-introduction": 4,
  "pelvic-floor-differentiation": 5,
  "kegel-pyramid": 5,
  "start-stop-progressive": 5,
  "sensate-focus-solo-1": 6,
  "squeeze-technique-intro": 6,
  "reverse-kegel-focus": 6,
  "integrated-start-stop-squeeze": 7,
  "kegel-endurance-set": 7,
  "sensate-focus-solo-2": 7,
  "edging-introduction": 8,
  "kegel-advanced-set": 8,
  "mindful-stimulation-variation": 8,
  "cognitive-defusion": 9,
  "edging-thought-interruption": 9,
  "kegel-consolidation": 9,
  "foundation-assessment": 10,
  "kegel-benchmark": 10,

  // Tier 2: Awakening (11-20)
  "arousal-mapping": 11,
  "deceleration-training": 11,
  "kegel-tempo-variations": 11,
  "breath-controlled-edging": 12,
  "pelvic-floor-breathing": 12,
  "sustained-plateau-practice": 12,
  "sensate-focus-solo-3": 13,
  "minimal-stimulation-edging": 13,
  "perineum-awareness": 13,
  "observer-edging": 14,
  "speed-variation-drill": 14,
  "kegel-integration": 14,
  "shame-inventory": 15,
  "comfort-zone-edging": 15,
  "mula-bandha-introduction": 16,
  "isometric-pelvic-floor": 16,
  "applied-mula-bandha-edging": 16,
  "arousal-dial-visualization": 17,
  "visualization-enhanced-edging": 17,
  "rhythmic-edging": 18,
  "rhythm-variation-control": 18,
  "multi-technique-integration": 18,
  "flow-session": 19,
  "endurance-edge": 19,
  "mula-bandha-endurance": 19,
  "tier-2-assessment": 20,

  // Tier 3: Development (21-30)
  "multi-edge-session": 21,
  "speed-escalation-drill": 21,
  "timed-deceleration": 22,
  "single-tool-deceleration": 22,
  "arousal-acceptance": 22,
  "plateau-surfing": 23,
  "high-zone-surfing": 23,
  "mula-bandha-pulsing": 23,
  "pressure-tested-edging": 24,
  "distraction-tolerance": 24,
  "arousal-amplification": 24,
  "quarter-assessment": 25,
  "technique-stacking": 26,
  "variable-intensity-drill": 27,
  "recovery-acceleration": 28,
  "stamina-session": 29,
  "uddiyana-bandha-intro": 29,
  "tier-3-assessment": 30,

  // Tier 4: Strengthening (31-40)
  "bandha-combination": 31,
  "position-variation": 32,
  "extended-plateau-practice": 33,
  "kapalabhati-prep": 33,
  "erection-quality-focus": 34,
  "sensation-amplification": 35,
  "emotional-integration": 36,
  "tantric-breath-intro": 36,
  "speed-ceiling-expansion": 37,
  "triple-lock": 38,
  "tier-4-integration": 39,
  "tier-4-assessment": 40,

  // Tier 5: Integration (41-50)
  "energy-awareness": 41,
  "chakra-body-scan": 42,
  "energy-circulation-basics": 43,
  "partner-communication-prep": 44,
  "partner-sensate-solo-prep": 45,
  "arousal-cycling": 46,
  "sound-as-release": 47,
  "orgasmic-breathing-intro": 48,
  "integration-flow": 49,
  "halfway-assessment": 50,

  // Tier 6: Refinement (51-60)
  "automatic-control": 51,
  "kumbhaka-under-arousal": 52,
  "microcosmic-orbit-basics": 53,
  "sensitivity-refinement": 54,
  "partner-breathing-together": 55,
  "advanced-plateau": 56,
  "breath-of-fire-integration": 57,
  "de-sensation-variety": 58,
  "pre-neo-preparation": 59,
  "tier-6-assessment": 60,

  // Tier 7: Transformation (61-70)
  "full-microcosmic-orbit": 61,
  "orgasmic-breathing-extended": 62,
  "neo-training-phase-1": 63,
  "partner-non-sexual-touch": 64,
  "tantric-gaze": 65,
  "neo-training-phase-2": 66,
  "full-body-pleasure-map": 67,
  "partner-genital-sensate": 68,
  "energy-arousal-integration": 69,
  "tier-7-assessment": 70,

  // Tier 8: Mastery Preparation (71-80)
  "partner-rhythmic-practice": 71,
  "breath-sync-arousal": 72,
  "neo-training-phase-3": 73,
  "void-meditation": 74,
  "three-quarter-assessment": 75,
  "tantric-visualization": 76,
  "extended-containment": 77,
  "multiple-orgasmic-response": 78,
  "whole-body-orgasmic-breathing": 79,
  "tier-8-assessment": 80,

  // Tier 9: Mastery (81-90)
  "neo-reliability": 81,
  "energy-mastery": 82,
  "partner-tantric-practice": 83,
  "kundalini-breathing": 84,
  "multi-orgasmic-session": 85,
  "union-meditation": 86,
  "advanced-de-work": 87,
  "full-body-orgasm": 88,
  "personal-style-integration": 89,
  "tier-9-assessment": 90,

  // Tier 10: Transcendence (91-100)
  "effortless-control": 91,
  "tantric-presence": 92,
  "advanced-partner-union": 93,
  "kundalini-integration": 94,
  "teaching-capacity": 95,
  "sustainable-practice": 96,
  "gratitude-legacy": 97,
  "the-final-edge": 98,
  "complete-presence": 99,
  "transcendence-assessment": 100,
};
