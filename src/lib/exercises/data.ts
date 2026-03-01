export interface ExerciseStep {
  title: string;
  instruction: string;
  durationSeconds?: number;
}

export interface Exercise {
  slug: string;
  title: string;
  description: string;
  category: "physical" | "somatic";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  weekUnlock: number;
  levelUnlock: number;
  xpReward: number;
  steps: ExerciseStep[];
}

export const exercises: Exercise[] = [
  /* ── Track B: Somatic & Mindfulness ──────────────────────── */
  {
    slug: "diaphragmatic-breathing",
    title: "Diaphragmatic Breathing",
    description:
      "Build body awareness and learn to calm your nervous system through deep belly breathing. This foundational technique helps regulate arousal.",
    category: "somatic",
    duration: "8 min",
    difficulty: "Beginner",
    weekUnlock: 1,
    levelUnlock: 2,
    xpReward: 50,
    steps: [
      {
        title: "Find Your Position",
        instruction:
          "Sit comfortably or lie on your back. Place one hand on your chest and the other on your belly, just below your ribs.",
        durationSeconds: 30,
      },
      {
        title: "Inhale Deeply",
        instruction:
          "Breathe in slowly through your nose for 4 seconds. Feel your belly rise while your chest stays relatively still.",
        durationSeconds: 60,
      },
      {
        title: "Hold",
        instruction:
          "Hold your breath gently for 7 seconds. Stay relaxed — don't tense your body.",
        durationSeconds: 60,
      },
      {
        title: "Exhale Slowly",
        instruction:
          "Exhale through your mouth for 8 seconds, letting your belly fall. Feel the tension leaving your body.",
        durationSeconds: 60,
      },
      {
        title: "Repeat Cycle",
        instruction:
          "Continue the 4-7-8 pattern. Focus entirely on the sensation of breathing. If your mind wanders, gently return to the breath.",
        durationSeconds: 180,
      },
      {
        title: "Body Check",
        instruction:
          "Scan your body from head to toe. Notice where you hold tension. Breathe into those areas and consciously release.",
        durationSeconds: 90,
      },
    ],
  },
  {
    slug: "body-scan",
    title: "Body Scan Meditation",
    description:
      "Develop awareness of physical sensations throughout your body. This practice builds the mind-body connection essential for arousal awareness.",
    category: "somatic",
    duration: "10 min",
    difficulty: "Beginner",
    weekUnlock: 1,
    levelUnlock: 2,
    xpReward: 50,
    steps: [
      {
        title: "Settle In",
        instruction:
          "Lie down in a comfortable position. Close your eyes and take 3 deep breaths to settle.",
        durationSeconds: 30,
      },
      {
        title: "Feet & Legs",
        instruction:
          "Bring attention to your feet. Notice any tingling, warmth, or pressure. Slowly move your awareness up through your calves and thighs.",
        durationSeconds: 90,
      },
      {
        title: "Hips & Pelvis",
        instruction:
          "Notice sensations in your hips and pelvic floor. Don't judge — just observe. This area often holds tension without us realizing.",
        durationSeconds: 90,
      },
      {
        title: "Abdomen & Chest",
        instruction:
          "Move awareness to your belly and chest. Feel the rise and fall of your breathing. Notice your heartbeat.",
        durationSeconds: 90,
      },
      {
        title: "Arms & Hands",
        instruction:
          "Scan through your shoulders, arms, and fingertips. Release any tension you find with each exhale.",
        durationSeconds: 60,
      },
      {
        title: "Face & Head",
        instruction:
          "Notice your jaw, forehead, and scalp. These areas often hold stress. Let your face soften completely.",
        durationSeconds: 60,
      },
      {
        title: "Whole Body",
        instruction:
          "Expand awareness to your entire body as one unified field of sensation. Breathe naturally and rest in this full-body awareness.",
        durationSeconds: 120,
      },
    ],
  },
  {
    slug: "sensate-focus",
    title: "Sensate Focus (Solo)",
    description:
      "A classic technique from sex therapy. Train your nervous system to experience pleasure without pressure by exploring touch mindfully.",
    category: "somatic",
    duration: "15 min",
    difficulty: "Intermediate",
    weekUnlock: 3,
    levelUnlock: 6,
    xpReward: 50,
    steps: [
      {
        title: "Prepare",
        instruction:
          "Set aside 15 minutes in a private, comfortable space. This is about exploration, not performance. There is no goal except awareness.",
        durationSeconds: 30,
      },
      {
        title: "Non-Genital Touch",
        instruction:
          "Start by touching your arms, chest, legs, and face. Focus on the texture, temperature, and pressure of your touch. Notice what feels pleasant.",
        durationSeconds: 180,
      },
      {
        title: "Vary Your Touch",
        instruction:
          "Experiment with different types of touch — light fingertips, firm palms, circular motions. Pay attention to which sensations you enjoy most.",
        durationSeconds: 180,
      },
      {
        title: "Notice Without Judging",
        instruction:
          "If your mind wanders to performance thoughts, gently redirect it to the physical sensation. You're building a new relationship with your body.",
        durationSeconds: 120,
      },
      {
        title: "Gradual Expansion",
        instruction:
          "Slowly expand the areas you touch. Keep the same mindful awareness. The goal is to feel, not to achieve any particular response.",
        durationSeconds: 240,
      },
      {
        title: "Reflect",
        instruction:
          "Take a moment to notice how you feel. What did you discover? What felt good? This awareness carries into partnered experiences.",
        durationSeconds: 60,
      },
    ],
  },

  /* ── Track A: Physical Techniques ────────────────────────── */
  {
    slug: "kegel-exercises",
    title: "Kegel Exercises",
    description:
      "Strengthen your pelvic floor muscles to gain better ejaculatory control. Strong PC muscles are the foundation of lasting longer.",
    category: "physical",
    duration: "5 min",
    difficulty: "Beginner",
    weekUnlock: 1,
    levelUnlock: 2,
    xpReward: 50,
    steps: [
      {
        title: "Locate the Muscle",
        instruction:
          "Imagine you're trying to stop the flow of urine midstream. The muscle you squeeze is your PC (pubococcygeus) muscle. Practice finding it without tensing your abs or glutes.",
        durationSeconds: 30,
      },
      {
        title: "Quick Pulses",
        instruction:
          "Squeeze and release your PC muscle quickly — 1 second on, 1 second off. Do 10 repetitions. This builds fast-twitch control.",
        durationSeconds: 30,
      },
      {
        title: "Sustained Hold",
        instruction:
          "Squeeze and hold for 5 seconds, then fully release for 5 seconds. Repeat 10 times. Focus on a strong contraction and complete relaxation.",
        durationSeconds: 120,
      },
      {
        title: "Reverse Kegels",
        instruction:
          "Instead of squeezing, gently push out (as if trying to urinate faster). Hold for 5 seconds, then release. This relaxation skill is just as important. Repeat 10 times.",
        durationSeconds: 120,
      },
      {
        title: "Combination Set",
        instruction:
          "Alternate: 5 quick pulses, 1 sustained 10-second hold, 1 reverse Kegel hold. Repeat this cycle 3 times.",
        durationSeconds: 90,
      },
    ],
  },
  {
    slug: "start-stop-technique",
    title: "Start-Stop Technique",
    description:
      "The classic method for building ejaculatory control. Learn to recognize your arousal levels and pause before the point of no return.",
    category: "physical",
    duration: "15 min",
    difficulty: "Intermediate",
    weekUnlock: 2,
    levelUnlock: 4,
    xpReward: 50,
    steps: [
      {
        title: "Understand the Scale",
        instruction:
          "Arousal works on a 1-10 scale. 1 = no arousal, 10 = orgasm, 7-8 = point of no return. Your goal is to stay between 5-7 by pausing when you approach 7.",
        durationSeconds: 30,
      },
      {
        title: "Begin Stimulation",
        instruction:
          "Begin self-stimulation slowly. Focus on the physical sensations. Rate your arousal level mentally as you go.",
        durationSeconds: 180,
      },
      {
        title: "Stop at Level 7",
        instruction:
          "When you feel yourself approaching level 7, stop completely. Remove your hand. Take 3 deep belly breaths and let arousal drop to level 4-5.",
        durationSeconds: 60,
      },
      {
        title: "Resume",
        instruction:
          "Once arousal drops, resume stimulation. Pay attention to how quickly you climb back up. This awareness is the skill you're building.",
        durationSeconds: 180,
      },
      {
        title: "Repeat 3-4 Times",
        instruction:
          "Continue the start-stop cycle 3-4 times. Each time, try to get a little closer to 7 before stopping. You're training your nervous system to tolerate higher arousal.",
        durationSeconds: 240,
      },
      {
        title: "Cool Down",
        instruction:
          "After your final cycle, let arousal naturally subside. Practice your 4-7-8 breathing. Notice how much more control you have when you pay attention.",
        durationSeconds: 60,
      },
    ],
  },
  {
    slug: "squeeze-technique",
    title: "Squeeze Technique",
    description:
      "A physical intervention that helps delay ejaculation by applying pressure at the right moment. Best combined with the start-stop method.",
    category: "physical",
    duration: "15 min",
    difficulty: "Intermediate",
    weekUnlock: 3,
    levelUnlock: 6,
    xpReward: 50,
    steps: [
      {
        title: "Learn the Grip",
        instruction:
          "Place your thumb on the frenulum (underside, just below the head) and your index and middle fingers on the opposite side. You'll apply firm pressure here when needed.",
        durationSeconds: 30,
      },
      {
        title: "Begin Stimulation",
        instruction:
          "Start self-stimulation at a comfortable pace. Monitor your arousal level on the 1-10 scale.",
        durationSeconds: 180,
      },
      {
        title: "Apply the Squeeze",
        instruction:
          "At level 7, stop and apply firm pressure with the grip for 10-15 seconds. The urge to ejaculate should decrease. Breathe deeply during the squeeze.",
        durationSeconds: 30,
      },
      {
        title: "Wait & Resume",
        instruction:
          "Release the squeeze and wait 30 seconds. Let arousal drop to level 4-5, then resume stimulation.",
        durationSeconds: 60,
      },
      {
        title: "Repeat Cycles",
        instruction:
          "Practice 3-4 squeeze cycles. Over time, you'll need the squeeze less as your body learns to regulate arousal on its own.",
        durationSeconds: 360,
      },
      {
        title: "Reflect",
        instruction:
          "Note your experience. Did the squeeze effectively reduce urgency? With practice, your body will internalize this braking mechanism.",
        durationSeconds: 30,
      },
    ],
  },
  {
    slug: "edging-practice",
    title: "Edging Practice",
    description:
      "Advanced arousal control training. Spend extended time near the point of no return to build tolerance and confidence.",
    category: "physical",
    duration: "20 min",
    difficulty: "Advanced",
    weekUnlock: 5,
    levelUnlock: 8,
    xpReward: 50,
    steps: [
      {
        title: "Warm Up",
        instruction:
          "Spend a few minutes with slow, mindful stimulation. Use your breathing to stay relaxed. Build to level 5 gradually.",
        durationSeconds: 180,
      },
      {
        title: "Approach the Edge",
        instruction:
          "Gradually increase stimulation until you reach level 8 — very close to the point of no return. This requires careful attention.",
        durationSeconds: 180,
      },
      {
        title: "Hover at the Edge",
        instruction:
          "Reduce speed/pressure just enough to stay at level 7-8 without going over. Use breathing and PC muscle relaxation (reverse Kegels) to maintain control.",
        durationSeconds: 120,
      },
      {
        title: "Pull Back & Recover",
        instruction:
          "Stop completely and let arousal drop to level 5. Use 4-7-8 breathing. Notice how your body responds.",
        durationSeconds: 90,
      },
      {
        title: "Extended Edge Practice",
        instruction:
          "Approach level 8 again. This time, try to hover near the edge for longer — 60-90 seconds. Use every tool: breathing, reverse Kegels, mental focus.",
        durationSeconds: 180,
      },
      {
        title: "Final Cycle & Cool Down",
        instruction:
          "One more approach to the edge, then pull back completely. Practice body scanning to notice all the sensations. This is mastery-level control training.",
        durationSeconds: 120,
      },
    ],
  },
];

export function getExerciseBySlug(slug: string): Exercise | undefined {
  return exercises.find((e) => e.slug === slug);
}

export function getExercisesForWeek(week: number): Exercise[] {
  return exercises.filter((e) => e.weekUnlock <= week);
}

export function getExercisesForLevel(level: number): Exercise[] {
  return exercises.filter((e) => e.levelUnlock <= level);
}
