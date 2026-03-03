import type { Exercise } from "./data";

export const tier1Exercises: Exercise[] = [
  // ─── Level 1: First Breath ───────────────────────────────────────────

  {
    slug: "basic-belly-breathing",
    title: "Basic Belly Breathing",
    description:
      "Learn the foundation of diaphragmatic breathing. By placing your hands on your belly and chest, you train your body to breathe deeply into the abdomen rather than shallowly into the chest. This activates your parasympathetic nervous system and is the single most important skill for arousal control.",
    category: "breathwork",
    subcategory: "diaphragmatic",
    duration: "5 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 1,
    xpReward: 30,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Get Into Position",
        instruction:
          "Lie on your back on a comfortable surface. Bend your knees with feet flat on the floor. Place your left hand on your upper chest and your right hand on your belly, just below your rib cage.",
        durationSeconds: 30,
      },
      {
        title: "Find Your Natural Breath",
        instruction:
          "Without changing anything, simply notice which hand rises when you breathe. Most people breathe into the chest. Your goal is to make the belly hand rise while the chest hand stays still.",
        durationSeconds: 30,
      },
      {
        title: "Belly Breathing Practice",
        instruction:
          "Inhale slowly through your nose for 3 seconds, directing the air down into your belly. Feel your right hand rise. Your left hand on your chest should barely move. Exhale slowly through pursed lips for 4 seconds, feeling your belly fall.",
        durationSeconds: 180,
      },
      {
        title: "Deepen the Rhythm",
        instruction:
          "Continue the 3-count inhale, 4-count exhale pattern. If your mind wanders, gently return focus to the sensation of your belly rising and falling. Try to make each breath smooth and continuous.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "pelvic-floor-discovery",
    title: "Pelvic Floor Discovery",
    description:
      "Locate and connect with your pelvic floor muscles for the first time. The PC (pubococcygeus) muscle is the key to ejaculatory control and stronger erections. This exercise teaches you to find and gently engage it.",
    category: "physical",
    subcategory: "kegel",
    duration: "3 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 1,
    xpReward: 30,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Locate the PC Muscle",
        instruction:
          "Sit or lie comfortably. Imagine you are urinating and then try to stop the flow mid-stream. The muscle you squeeze to do this is your PC muscle. You should feel a lifting sensation in the area between your scrotum and anus.",
        durationSeconds: 30,
      },
      {
        title: "Isolate the Contraction",
        instruction:
          "Try squeezing only the PC muscle without tightening your abs, glutes, or thighs. Place a hand on your lower belly to confirm it stays relaxed. Breathe normally throughout. This isolation is essential.",
        durationSeconds: 30,
      },
      {
        title: "Gentle Squeeze Series",
        instruction:
          "Perform 5 gentle squeezes. Squeeze for 2 seconds, then release for 3 seconds. Focus on the sensation of engaging and releasing. Use about 50% effort; this is about awareness, not strength.",
        durationSeconds: 25,
      },
      {
        title: "Rest and Reflect",
        instruction:
          "Relax completely. Notice any residual tension in the pelvic area and let it go. Take 3 slow breaths. You have just made your first connection with one of the most important muscles for sexual health.",
        durationSeconds: 30,
      },
    ],
  },

  {
    slug: "settling-meditation",
    title: "Settling Meditation",
    description:
      "A simple breath-counting meditation to calm the nervous system and develop the focused awareness you will need for every other exercise in this program. Think of this as training your attention muscle.",
    category: "meditation",
    duration: "5 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 1,
    xpReward: 30,
    trackTags: ["Mindfulness"],
    steps: [
      {
        title: "Settle In",
        instruction:
          "Sit comfortably or lie on your back. Close your eyes. Take 3 deep breaths, exhaling fully each time. Let your breathing return to its natural pace.",
        durationSeconds: 30,
      },
      {
        title: "Begin Counting",
        instruction:
          "Start counting each exhale: 1 on the first exhale, 2 on the second, and so on up to 10. When you reach 10, start over at 1. If you lose count, simply return to 1 without judgment.",
        durationSeconds: 120,
      },
      {
        title: "Deepen Your Focus",
        instruction:
          "Continue counting breaths from 1 to 10. Each time your mind wanders, notice what pulled your attention away, then gently return to the count. The noticing is the practice; wandering is not failure.",
        durationSeconds: 120,
      },
      {
        title: "Close the Session",
        instruction:
          "Release the counting. Sit with eyes closed for a few moments. Notice how your body feels compared to when you started. Gently open your eyes.",
        durationSeconds: 30,
      },
    ],
  },

  // ─── Level 2: Body Basics ────────────────────────────────────────────

  {
    slug: "diaphragmatic-breathing",
    title: "Diaphragmatic Breathing",
    description:
      "Build on belly breathing with the powerful 4-7-8 breathing pattern. This technique activates a strong parasympathetic response, slowing heart rate and reducing arousal. It is one of the most effective tools for delaying ejaculation during intimacy.",
    category: "breathwork",
    subcategory: "pranayama",
    duration: "8 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 2,
    xpReward: 35,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Settle and Center",
        instruction:
          "Lie down or sit comfortably. Place one hand on your belly. Take 3 natural breaths, letting your body settle. Release any tension in your jaw, shoulders, and hands.",
        durationSeconds: 40,
      },
      {
        title: "Learn the 4-7-8 Pattern",
        instruction:
          "Inhale through your nose for 4 seconds, filling your belly. Hold your breath gently for 7 seconds. Exhale slowly through your mouth for 8 seconds. Do one practice round to get the feel of the timing.",
        durationSeconds: 30,
      },
      {
        title: "Cycle 1-3",
        instruction:
          "Perform 3 full 4-7-8 cycles. Inhale (4s), hold (7s), exhale (8s). Keep your body relaxed during the hold; do not tense up. If 7 seconds feels too long, hold for 5 seconds instead.",
        durationSeconds: 180,
      },
      {
        title: "Cycle 4-6",
        instruction:
          "Continue for 3 more cycles. Try to make the exhale as smooth and slow as possible, like a thin stream of air. Notice how your body feels heavier and more relaxed with each cycle.",
        durationSeconds: 180,
      },
      {
        title: "Return to Natural Breath",
        instruction:
          "Release the pattern and breathe naturally for 30 seconds. Notice the calm that has settled into your body. This is the state you will learn to access during arousal.",
        durationSeconds: 50,
      },
    ],
  },

  {
    slug: "basic-kegel-routine",
    title: "Basic Kegel Routine",
    description:
      "Your first structured pelvic floor workout. This routine combines quick-pulse contractions to build responsiveness with sustained holds to build endurance. Together, these two types of contraction give you control when it matters most.",
    category: "physical",
    subcategory: "kegel",
    duration: "5 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 2,
    xpReward: 35,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Warm-Up",
        instruction:
          "Sit or lie comfortably. Take 3 deep breaths. Locate your PC muscle. Perform 3 very gentle contractions to warm up the area.",
        durationSeconds: 30,
      },
      {
        title: "Quick Pulses",
        instruction:
          "Perform 10 quick pulse contractions: squeeze for 1 second, release for 1 second. Keep the contractions sharp and distinct. Breathe normally throughout; do not hold your breath.",
        durationSeconds: 30,
      },
      {
        title: "Rest",
        instruction:
          "Relax completely for 15 seconds. Consciously release any residual tension in the pelvic floor.",
        durationSeconds: 15,
      },
      {
        title: "Sustained Holds",
        instruction:
          "Perform 5 sustained holds: squeeze and hold for 5 seconds, then release fully for 5 seconds. Maintain a steady squeeze; do not let the contraction fade partway through. Keep abs and glutes relaxed.",
        durationSeconds: 50,
      },
      {
        title: "Final Rest and Cool-Down",
        instruction:
          "Relax completely for 30 seconds. Take 3 slow breaths. Notice any sensations in the pelvic area. You are building the foundation of ejaculatory control.",
        durationSeconds: 30,
      },
    ],
  },

  {
    slug: "standing-body-check",
    title: "Standing Body Check",
    description:
      "A quick somatic check-in done while standing. Learning to sense your body in an upright position translates directly to awareness during intimacy. This exercise trains you to notice where you hold tension.",
    category: "somatic",
    duration: "3 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 2,
    xpReward: 30,
    trackTags: ["Mindfulness"],
    steps: [
      {
        title: "Ground Your Feet",
        instruction:
          "Stand with feet hip-width apart, arms at your sides. Close your eyes. Feel the contact between your feet and the floor. Notice the weight distribution: is it even left to right? Forward to back?",
        durationSeconds: 30,
      },
      {
        title: "Scan Upward",
        instruction:
          "Slowly move your attention up through your body: ankles, calves, knees, thighs, pelvis, belly, chest, shoulders, neck, face, and crown of the head. At each area, simply notice whatever is there without trying to change it.",
        durationSeconds: 90,
      },
      {
        title: "Release and Reset",
        instruction:
          "Take 3 slow breaths. On each exhale, consciously soften any tension you noticed. Drop your shoulders. Unclench your jaw. Let your belly be soft. Open your eyes slowly.",
        durationSeconds: 40,
      },
    ],
  },

  {
    slug: "guided-body-scan",
    title: "Guided Body Scan",
    description:
      "A thorough, systematic journey of attention through every region of your body. The body scan builds interoception, the ability to sense internal states, which is fundamental to recognizing and managing arousal levels.",
    category: "meditation",
    duration: "10 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 2,
    xpReward: 40,
    trackTags: ["Mindfulness"],
    steps: [
      {
        title: "Preparation",
        instruction:
          "Lie on your back with arms at your sides, palms up. Close your eyes. Take 5 slow, deep breaths. With each exhale, let your body sink a little deeper into the surface beneath you.",
        durationSeconds: 45,
      },
      {
        title: "Feet and Legs",
        instruction:
          "Bring your attention to the soles of your feet. Notice any tingling, warmth, pressure, or numbness. Move to your ankles, calves, shins, knees, and thighs. Spend about 15 seconds on each area, just noticing.",
        durationSeconds: 120,
      },
      {
        title: "Pelvis and Torso",
        instruction:
          "Move your attention to your pelvis and groin area. Notice any tension. Continue upward through your lower belly, upper belly, lower back, and chest. Notice your breathing as you scan the torso.",
        durationSeconds: 120,
      },
      {
        title: "Arms, Shoulders, and Neck",
        instruction:
          "Scan from your fingertips up through your hands, wrists, forearms, upper arms, and shoulders. Then move to your neck and throat. Let each area soften as you notice it.",
        durationSeconds: 120,
      },
      {
        title: "Head and Face",
        instruction:
          "Bring attention to your jaw, mouth, cheeks, nose, eyes, forehead, and the top of your head. The face often holds hidden tension. Let each area relax completely.",
        durationSeconds: 90,
      },
      {
        title: "Whole Body Integration",
        instruction:
          "Expand your awareness to hold your entire body at once. Feel yourself as a complete, breathing whole. Rest here for a few moments, then gently wiggle your fingers and toes and open your eyes.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 3: Tension Mapping ────────────────────────────────────────

  {
    slug: "progressive-muscle-relaxation",
    title: "Progressive Muscle Relaxation",
    description:
      "Systematically tense and release every major muscle group to teach your body the difference between tension and relaxation. This contrast training is essential for recognizing the subtle tension buildup that accelerates ejaculation.",
    category: "somatic",
    duration: "12 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 3,
    xpReward: 40,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Preparation",
        instruction:
          "Lie on your back in a comfortable position. Close your eyes. Take 3 deep breaths. You will tense each muscle group for 5 seconds, then release and rest for 10 seconds. Never tense to the point of pain.",
        durationSeconds: 30,
      },
      {
        title: "Feet, Calves, and Thighs",
        instruction:
          "Curl your toes tightly for 5 seconds, then release for 10 seconds. Next, flex your calves by pointing your toes toward your shins, hold 5 seconds, release 10 seconds. Finally, squeeze your thighs together hard for 5 seconds, release 10 seconds.",
        durationSeconds: 60,
      },
      {
        title: "Glutes and Pelvis",
        instruction:
          "Squeeze your glutes tightly for 5 seconds, then release for 10 seconds. Next, engage your pelvic floor (Kegel) for 5 seconds, then release for 10 seconds. Notice the contrast between tension and deep relaxation in this area.",
        durationSeconds: 40,
      },
      {
        title: "Abdomen, Chest, and Back",
        instruction:
          "Tighten your abdominal muscles as if bracing for a punch, hold 5 seconds, release 10 seconds. Squeeze your chest muscles by pressing your palms together in front of you, hold 5 seconds, release 10 seconds. Arch your back slightly, hold 5 seconds, release 10 seconds.",
        durationSeconds: 60,
      },
      {
        title: "Arms, Shoulders, and Hands",
        instruction:
          "Make tight fists, hold 5 seconds, release 10 seconds. Flex your biceps, hold 5 seconds, release 10 seconds. Raise your shoulders to your ears, hold 5 seconds, release 10 seconds.",
        durationSeconds: 60,
      },
      {
        title: "Face and Full Release",
        instruction:
          "Scrunch your entire face tightly, hold 5 seconds, release 10 seconds. Now scan your whole body. Notice the deep relaxation. Breathe slowly for 60 seconds, savoring this state. This is what full relaxation feels like.",
        durationSeconds: 90,
      },
    ],
  },

  {
    slug: "kegel-progression-a",
    title: "Kegel Progression A",
    description:
      "A step up from the basic routine, adding longer holds and introducing reverse Kegels. Reverse Kegels (bearing down gently) train the ability to deliberately relax the pelvic floor, which is critical for delaying ejaculation.",
    category: "physical",
    subcategory: "kegel",
    duration: "6 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 3,
    xpReward: 40,
    trackTags: ["PE", "ED"],
    prerequisites: ["basic-kegel-routine"],
    steps: [
      {
        title: "Warm-Up Pulses",
        instruction:
          "Take 3 deep breaths. Perform 10 quick pulse contractions: squeeze 1 second, release 1 second. These pulses warm up the muscle and improve fast-twitch responsiveness.",
        durationSeconds: 30,
      },
      {
        title: "Sustained Holds",
        instruction:
          "Perform 5 sustained holds: squeeze and hold for 7 seconds, then release fully for 5 seconds. Maintain steady pressure throughout the hold. Keep breathing normally.",
        durationSeconds: 60,
      },
      {
        title: "Rest",
        instruction:
          "Relax completely for 20 seconds. Let all tension drain from the pelvic floor.",
        durationSeconds: 20,
      },
      {
        title: "Reverse Kegel Introduction",
        instruction:
          "Instead of squeezing, gently bear down as if pushing air out. This is a reverse Kegel. It should feel like the opposite of a squeeze, a gentle opening and lengthening. Perform 5 reverse Kegels: push for 5 seconds, rest for 5 seconds.",
        durationSeconds: 50,
      },
      {
        title: "Cool-Down",
        instruction:
          "Relax fully for 20 seconds. Take 3 slow breaths. Notice the difference between the squeeze (Kegel) and the release (reverse Kegel). Both directions of control are essential.",
        durationSeconds: 30,
      },
    ],
  },

  // ─── Level 4: Breath Control ─────────────────────────────────────────

  {
    slug: "extended-breathing",
    title: "Extended Breathing Practice",
    description:
      "Combines the 4-7-8 pattern with box breathing (4-4-4-4) for a longer session. This builds your capacity to maintain controlled breathing for extended periods, which you will need during longer intimate sessions.",
    category: "breathwork",
    subcategory: "pranayama",
    duration: "10 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 4,
    xpReward: 40,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Settle In",
        instruction:
          "Lie down or sit comfortably. Place one hand on your belly. Take 5 natural breaths, letting each one get a little slower and deeper.",
        durationSeconds: 40,
      },
      {
        title: "4-7-8 Breathing (4 Cycles)",
        instruction:
          "Perform 4 full cycles of 4-7-8 breathing: inhale through your nose for 4 seconds, hold for 7 seconds, exhale through your mouth for 8 seconds. Keep your body relaxed during the holds.",
        durationSeconds: 180,
      },
      {
        title: "Transition Breaths",
        instruction:
          "Take 3 natural breaths to transition. Notice the calm state your body is in.",
        durationSeconds: 30,
      },
      {
        title: "Box Breathing (6 Cycles)",
        instruction:
          "Switch to box breathing: inhale 4 seconds, hold 4 seconds, exhale 4 seconds, hold empty 4 seconds. Repeat for 6 cycles. The equal timing creates a balanced, grounded state.",
        durationSeconds: 240,
      },
      {
        title: "Settle and Close",
        instruction:
          "Release all patterns. Breathe naturally for 30 seconds. Notice how your heart rate and breathing have settled. This extended calm is the foundation for arousal control.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "coordinated-kegel-breath",
    title: "Coordinated Kegel-Breath",
    description:
      "Synchronize your pelvic floor contractions with your breathing rhythm. This coordination is essential for using Kegels effectively during intimacy, where you cannot stop to think about technique.",
    category: "physical",
    subcategory: "kegel",
    duration: "6 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 4,
    xpReward: 40,
    trackTags: ["PE", "ED"],
    prerequisites: ["kegel-progression-a"],
    steps: [
      {
        title: "Warm-Up",
        instruction:
          "Take 5 deep breaths. Perform 5 gentle Kegel contractions to warm up. Then 3 gentle reverse Kegels. Get familiar with both directions.",
        durationSeconds: 40,
      },
      {
        title: "Squeeze on Inhale Pattern",
        instruction:
          "Inhale for 4 seconds while squeezing your PC muscle. Hold your breath and hold the squeeze for 4 seconds. Exhale for 4 seconds while releasing the Kegel. Repeat for 10 reps.",
        durationSeconds: 130,
      },
      {
        title: "Release on Exhale Pattern",
        instruction:
          "Now reverse the pattern: inhale for 4 seconds while relaxed. Hold your breath for 4 seconds while squeezing your PC muscle. Exhale for 4 seconds while performing a reverse Kegel (bearing down gently). Repeat for 10 reps.",
        durationSeconds: 130,
      },
      {
        title: "Cool-Down",
        instruction:
          "Relax everything. Breathe naturally for 30 seconds. Notice how much more control you have when breath and Kegel work together. This coordination will become automatic with practice.",
        durationSeconds: 40,
      },
    ],
  },

  {
    slug: "start-stop-introduction",
    title: "Start-Stop Technique Introduction",
    description:
      "The start-stop method is one of the most proven clinical techniques for premature ejaculation. You will learn to self-stimulate, recognize a moderate arousal level (5 out of 10), stop completely, let arousal drop, and resume. This builds awareness and control.",
    category: "physical",
    subcategory: "start-stop",
    duration: "15 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 4,
    xpReward: 50,
    trackTags: ["PE"],
    safetyNotes:
      "Perform in a private, comfortable setting. Use lubricant if desired. Stop immediately if you feel any pain. This is a clinical technique; focus on learning, not pleasure.",
    steps: [
      {
        title: "Preparation",
        instruction:
          "Find a private, comfortable space. Set a timer for 15 minutes. Lie or sit comfortably. Take 5 slow, deep breaths using the 4-7-8 pattern. Let your body settle into a calm, relaxed state.",
        durationSeconds: 60,
      },
      {
        title: "Learn the Arousal Scale",
        instruction:
          "Imagine a scale from 0 (no arousal) to 10 (orgasm). Level 1-3 is low arousal, 4-6 is moderate, 7-8 is high, and 9 is the point of no return. Today you will practice stopping at level 5, moderate arousal.",
        durationSeconds: 30,
      },
      {
        title: "Begin Slow Stimulation",
        instruction:
          "Begin self-stimulation with a slow, gentle pace. Focus entirely on the physical sensations. Keep breathing slowly and deeply. Continuously rate your arousal level on the 0-10 scale.",
        durationSeconds: 180,
      },
      {
        title: "First Stop",
        instruction:
          "When you reach arousal level 5, stop all stimulation completely. Remove your hand. Take 3 slow 4-7-8 breaths. Notice how arousal begins to subside. Wait until you drop to level 2-3.",
        durationSeconds: 120,
      },
      {
        title: "Resume and Repeat",
        instruction:
          "Resume stimulation. Again, approach level 5 and stop. Repeat this start-stop cycle 2-3 more times. Each cycle trains your brain to recognize the approach of arousal and apply the brakes.",
        durationSeconds: 360,
      },
      {
        title: "Close and Reflect",
        instruction:
          "After completing your cycles, stop and let arousal subside fully. Take 5 slow breaths. Reflect on how well you could identify arousal levels. Did stopping become easier with practice?",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 5: Pelvic Intelligence ────────────────────────────────────

  {
    slug: "pelvic-floor-differentiation",
    title: "Pelvic Floor Differentiation",
    description:
      "Move beyond basic Kegels to isolate the individual muscles of the pelvic floor. The PC (front), BC (bulbocavernosus, middle), and anal sphincter (back) all play different roles. Learning to engage each separately gives you precise control.",
    category: "physical",
    subcategory: "kegel",
    duration: "8 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 5,
    xpReward: 45,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Warm-Up",
        instruction:
          "Sit comfortably on a firm surface. Take 5 deep breaths. Perform 5 full Kegel contractions (squeezing everything) to warm up the area.",
        durationSeconds: 40,
      },
      {
        title: "Isolate the PC Muscle (Front)",
        instruction:
          "Focus on the muscle you would use to stop urine flow. This is the front portion of the pelvic floor. Try to squeeze only this area while keeping the anus relaxed. Perform 5 contractions, 5 seconds each, with 5 seconds rest between.",
        durationSeconds: 60,
      },
      {
        title: "Isolate the BC Muscle (Middle)",
        instruction:
          "The BC muscle wraps around the base of the penis. Try to squeeze as if pushing blood into the shaft. This is a subtle, deeper contraction. It may help to think of squeezing the base. Perform 5 contractions, 5 seconds each, with 5 seconds rest between.",
        durationSeconds: 60,
      },
      {
        title: "Isolate the Anal Sphincter (Back)",
        instruction:
          "Now squeeze only the anus while keeping the front muscles relaxed. This is the easiest to isolate. Perform 5 contractions, 5 seconds each, with 5 seconds rest between.",
        durationSeconds: 60,
      },
      {
        title: "Front-to-Back Wave",
        instruction:
          "Try to squeeze from front to back in a wave: PC first, then BC, then anus. Then reverse: anus, BC, PC. Do 5 waves in each direction. This is challenging but builds exceptional control.",
        durationSeconds: 120,
      },
      {
        title: "Cool-Down",
        instruction:
          "Relax fully. Perform 3 reverse Kegels to release all tension. Take 5 slow breaths. This differentiation work is advanced even though you are at an early stage. Be patient with yourself.",
        durationSeconds: 40,
      },
    ],
  },

  {
    slug: "kegel-pyramid",
    title: "Kegel Pyramid",
    description:
      "Build graded control over pelvic floor tension by squeezing at increasing and then decreasing percentages of maximum effort. This teaches you to engage your pelvic floor at exactly the right intensity rather than always using full force.",
    category: "physical",
    subcategory: "kegel",
    duration: "7 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 5,
    xpReward: 45,
    trackTags: ["PE", "ED"],
    prerequisites: ["coordinated-kegel-breath"],
    steps: [
      {
        title: "Warm-Up",
        instruction:
          "Take 5 deep breaths. Perform 5 quick Kegel pulses and 3 reverse Kegels to warm up. Find your maximum squeeze intensity for reference.",
        durationSeconds: 30,
      },
      {
        title: "Learn the Levels",
        instruction:
          "Squeeze at 25% effort for 3 seconds, then 50% for 3 seconds, then 75% for 3 seconds, then 100% for 3 seconds. Now descend: 75% for 3 seconds, 50% for 3 seconds, 25% for 3 seconds. Rest 10 seconds. That is one pyramid.",
        durationSeconds: 40,
      },
      {
        title: "Pyramids 1-3",
        instruction:
          "Perform 3 full pyramids: 25%, 50%, 75%, 100%, 75%, 50%, 25%. Hold each level for 3 seconds. Rest 10 seconds between pyramids. Breathe steadily throughout.",
        durationSeconds: 130,
      },
      {
        title: "Pyramids 4-5",
        instruction:
          "Perform 2 more pyramids. Try to make the transitions between levels smooth rather than abrupt. The goal is graded control, not on/off switching.",
        durationSeconds: 90,
      },
      {
        title: "Cool-Down",
        instruction:
          "Relax fully. Perform 3 slow reverse Kegels. Take 5 deep breaths. This graded control is what will allow you to apply just the right amount of squeeze during intimacy.",
        durationSeconds: 40,
      },
    ],
  },

  {
    slug: "start-stop-progressive",
    title: "Start-Stop Progressive",
    description:
      "Progress from the introductory start-stop by targeting higher arousal levels before stopping. You will now approach a 6 out of 10 before applying the brakes. This narrows your safety margin and sharpens your arousal awareness.",
    category: "physical",
    subcategory: "start-stop",
    duration: "15 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 5,
    xpReward: 50,
    trackTags: ["PE"],
    prerequisites: ["start-stop-introduction"],
    safetyNotes:
      "Perform in a private, comfortable setting. Stop immediately if you feel any discomfort. If you overshoot the target, that is normal; just note it and adjust next time.",
    steps: [
      {
        title: "Breathing Warm-Up",
        instruction:
          "Lie or sit comfortably. Perform 4 cycles of 4-7-8 breathing. Let your body enter a calm, parasympathetic state before beginning.",
        durationSeconds: 90,
      },
      {
        title: "Begin Stimulation",
        instruction:
          "Begin self-stimulation at a moderate pace. Focus on sensation and continuously rate your arousal on the 0-10 scale. Use slow, deliberate movements.",
        durationSeconds: 120,
      },
      {
        title: "Stop at Level 6",
        instruction:
          "When you reach arousal level 6, stop all stimulation. Take 3 deep breaths using the 4-7-8 pattern. Notice the sensations as arousal subsides. Wait until you drop to level 3.",
        durationSeconds: 120,
      },
      {
        title: "Repeat Cycles",
        instruction:
          "Resume stimulation. Approach level 6 again and stop. Complete 3-4 total cycles. Try to be more precise each time about exactly when you hit level 6. Precision is more important than speed.",
        durationSeconds: 360,
      },
      {
        title: "Close and Reflect",
        instruction:
          "Let arousal subside fully. Take 5 slow breaths. Compare this to the introductory session. Were you able to distinguish level 5 from level 6? Could you stop more confidently?",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 6: Sensation Literacy ─────────────────────────────────────

  {
    slug: "sensate-focus-solo-1",
    title: "Sensate Focus Solo Phase 1",
    description:
      "Adapted from Masters and Johnson's sensate focus therapy, this exercise develops your ability to attend to physical sensation without sexual pressure. You will explore non-genital touch to build a richer vocabulary of physical awareness.",
    category: "somatic",
    duration: "15 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 6,
    xpReward: 50,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Create a Comfortable Space",
        instruction:
          "Find a warm, private space. Undress to whatever level feels comfortable. Lie down. Take 5 slow breaths. Set an intention: this is about pure sensation, not arousal.",
        durationSeconds: 60,
      },
      {
        title: "Explore Arms and Hands",
        instruction:
          "Using one hand, slowly touch and explore the opposite arm. Vary the pressure from feather-light to firm. Try fingertips, the back of your hand, your palm. Notice temperature, texture, pressure differences.",
        durationSeconds: 180,
      },
      {
        title: "Explore Torso",
        instruction:
          "Move to your torso: chest, sides, belly, and back (where you can reach). Vary the pressure and speed. Notice which areas are more sensitive. Do not rush. Focus on what each sensation actually feels like.",
        durationSeconds: 180,
      },
      {
        title: "Explore Legs and Feet",
        instruction:
          "Touch and explore your legs and feet. The inner thigh is often highly sensitive. The feet may be ticklish. Notice how sensations differ across regions. Keep returning your attention to the physical feeling itself.",
        durationSeconds: 180,
      },
      {
        title: "Whole-Body Stillness",
        instruction:
          "Stop all touch. Lie still with your eyes closed for 2 minutes. Feel the echo of sensation across your skin. Notice warmth, tingling, or aliveness. This body awareness is the foundation of arousal literacy.",
        durationSeconds: 120,
      },
    ],
  },

  {
    slug: "squeeze-technique-intro",
    title: "Squeeze Technique Introduction",
    description:
      "Learn the squeeze technique, another clinically proven method for ejaculatory control. When arousal reaches level 6-7, you apply firm pressure to the frenulum or the base of the glans for 10-15 seconds. This temporarily reduces the ejaculatory urge.",
    category: "physical",
    subcategory: "squeeze",
    duration: "15 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 6,
    xpReward: 55,
    trackTags: ["PE"],
    prerequisites: ["start-stop-progressive"],
    safetyNotes:
      "The squeeze should be firm but never painful. Use the thumb on the frenulum and two fingers on the opposite side of the glans. Stop immediately if you feel any sharp pain.",
    steps: [
      {
        title: "Breathing Warm-Up",
        instruction:
          "Lie or sit comfortably. Perform 4 cycles of 4-7-8 breathing. Let your body settle into a relaxed state.",
        durationSeconds: 90,
      },
      {
        title: "Learn the Squeeze Grip",
        instruction:
          "Before beginning stimulation, practice the grip: place your thumb on the frenulum (the sensitive area on the underside of the glans) and your index and middle fingers on the top of the glans. Practice applying firm, steady pressure for 10 seconds.",
        durationSeconds: 30,
      },
      {
        title: "Stimulate to Level 6-7",
        instruction:
          "Begin self-stimulation at a moderate pace. Use your arousal scale. Allow yourself to rise to level 6-7, which is higher than previous start-stop exercises.",
        durationSeconds: 180,
      },
      {
        title: "Apply the Squeeze",
        instruction:
          "At level 6-7, stop stimulation and immediately apply the squeeze grip for 10-15 seconds. Maintain firm, steady pressure. Take slow breaths. You should feel arousal drop by 1-2 levels.",
        durationSeconds: 30,
      },
      {
        title: "Repeat Cycles",
        instruction:
          "Wait 30 seconds after the squeeze, then resume stimulation. Approach level 6-7 again and apply the squeeze. Complete 3-4 cycles total. Notice how the squeeze gives you an additional tool beyond simply stopping.",
        durationSeconds: 360,
      },
      {
        title: "Close and Reflect",
        instruction:
          "Let arousal subside. Take 5 slow breaths. Reflect: how effective was the squeeze compared to the stop alone? Could you apply the grip quickly and confidently?",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "reverse-kegel-focus",
    title: "Reverse Kegel Focus",
    description:
      "A dedicated session to master reverse Kegels, the ability to deliberately relax and lengthen the pelvic floor. This is arguably more important for PE control than the squeeze, because tension in the pelvic floor accelerates ejaculation.",
    category: "physical",
    subcategory: "kegel",
    duration: "5 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 6,
    xpReward: 40,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Find the Reverse Kegel",
        instruction:
          "Sit comfortably. Take 3 breaths. Instead of squeezing the pelvic floor, gently bear down as if trying to push air from the perineum. It may help to inhale deeply and push the belly out while gently opening the pelvic floor.",
        durationSeconds: 30,
      },
      {
        title: "Sustained Reverse Holds",
        instruction:
          "Perform 10 reverse Kegel holds: gently bear down for 7 seconds, then relax for 5 seconds. The effort should be mild, about 30-40% intensity. Never strain.",
        durationSeconds: 120,
      },
      {
        title: "Alternating Regular and Reverse",
        instruction:
          "Now alternate: regular Kegel squeeze for 5 seconds, relax 3 seconds, reverse Kegel for 5 seconds, relax 3 seconds. Repeat this cycle 5 times. Notice the distinct difference in sensation between the two.",
        durationSeconds: 80,
      },
      {
        title: "Cool-Down",
        instruction:
          "End with 3 gentle reverse Kegels. Let all pelvic tension go. Take 5 slow breaths. The reverse Kegel is your primary tool for slowing down the ejaculatory reflex in the moment.",
        durationSeconds: 30,
      },
    ],
  },

  // ─── Level 7: Awareness Deepening ────────────────────────────────────

  {
    slug: "integrated-start-stop-squeeze",
    title: "Integrated Start-Stop-Squeeze",
    description:
      "Combine the start-stop technique, the squeeze technique, and 4-7-8 breathing into a single integrated practice. This is your first multi-tool session and simulates the kind of control you will use during real intimacy.",
    category: "physical",
    subcategory: "edging",
    duration: "18 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 7,
    xpReward: 55,
    trackTags: ["PE"],
    prerequisites: ["squeeze-technique-intro"],
    safetyNotes:
      "Perform in a private, comfortable setting. Use lubricant if desired. If you overshoot and approach level 9, stop and apply the squeeze immediately.",
    steps: [
      {
        title: "Breathing Warm-Up",
        instruction:
          "Perform 4 cycles of 4-7-8 breathing. Let your heart rate and body settle. This calm baseline is your launching point.",
        durationSeconds: 90,
      },
      {
        title: "Cycle 1: Start-Stop with Breath",
        instruction:
          "Begin stimulation. Rise to arousal level 6. Stop. Take 3 breaths using 4-7-8 pattern while arousal subsides. Focus on the exhale pushing tension out of your body.",
        durationSeconds: 180,
      },
      {
        title: "Cycle 2: Start-Stop with Squeeze",
        instruction:
          "Resume stimulation. This time, rise to level 7. Stop and immediately apply the squeeze grip for 10-15 seconds. Then take 3 deep breaths. Wait until arousal drops to level 3.",
        durationSeconds: 180,
      },
      {
        title: "Cycle 3: Combined Approach",
        instruction:
          "Resume. Rise to level 7. Stop, apply the squeeze, AND begin 4-7-8 breathing simultaneously. Notice how combining tools gives you stronger control. Wait until you drop to level 3.",
        durationSeconds: 180,
      },
      {
        title: "Cycle 4: Free Practice",
        instruction:
          "Resume stimulation. Use whatever combination of stop, squeeze, and breathing feels most effective. Rise to level 7 and bring yourself back to 3. This is your toolkit in action.",
        durationSeconds: 240,
      },
      {
        title: "Close and Reflect",
        instruction:
          "Let arousal subside fully. Take 5 slow breaths. Reflect on which combination felt most effective. You now have 3 tools that work together. With practice, this becomes instinctive.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "kegel-endurance-set",
    title: "Kegel Endurance Set",
    description:
      "A comprehensive pelvic floor workout that builds endurance with longer holds, quick pulses, reverse Kegels, and the wave technique. This is the most complete Kegel routine you have done so far.",
    category: "physical",
    subcategory: "kegel",
    duration: "8 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 7,
    xpReward: 45,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Quick Pulses",
        instruction:
          "Perform 10 quick pulse Kegels: squeeze 1 second, release 1 second. These activate fast-twitch fibers and warm up the muscle.",
        durationSeconds: 25,
      },
      {
        title: "Sustained Holds",
        instruction:
          "Perform 5 sustained holds of 10 seconds each, with 5 seconds rest between. Maintain steady pressure throughout each hold. Do not let the intensity fade.",
        durationSeconds: 75,
      },
      {
        title: "Reverse Kegel Holds",
        instruction:
          "Perform 5 reverse Kegel holds of 7 seconds each, with 5 seconds rest between. Focus on the sensation of opening and lengthening the pelvic floor.",
        durationSeconds: 60,
      },
      {
        title: "Wave Kegels",
        instruction:
          "Perform 3 wave Kegels: slowly squeeze from front (PC) to back (anus) over 5 seconds, hold everything for 3 seconds, then release from front to back over 5 seconds. Rest 5 seconds between waves.",
        durationSeconds: 60,
      },
      {
        title: "Cool-Down",
        instruction:
          "Relax fully. Take 5 slow, deep breaths. Gently perform 3 reverse Kegels to ensure complete relaxation. Notice the strength and control you are building.",
        durationSeconds: 40,
      },
    ],
  },

  {
    slug: "sensate-focus-solo-2",
    title: "Sensate Focus Solo Phase 2",
    description:
      "The second phase of sensate focus includes genital touch in your exploration. The goal is still sensation awareness, not arousal. You are training yourself to experience genital touch with curious attention rather than automatic escalation.",
    category: "somatic",
    duration: "15 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 7,
    xpReward: 55,
    trackTags: ["PE", "Mindfulness"],
    prerequisites: ["sensate-focus-solo-1"],
    safetyNotes:
      "This is a clinical awareness exercise, not masturbation. If arousal rises above level 3, slow down or move to a non-genital area. The goal is sensation mapping, not stimulation.",
    steps: [
      {
        title: "Non-Genital Warm-Up",
        instruction:
          "Undress and lie comfortably. Spend 3 minutes touching non-genital areas: arms, chest, belly, thighs. Vary pressure and speed. Establish the mindset of curious observation.",
        durationSeconds: 180,
      },
      {
        title: "Approach the Genital Area",
        instruction:
          "Gradually move to the inner thighs, lower belly, and perineum. Notice the change in sensitivity as you approach the genital area. Keep your breathing slow and steady.",
        durationSeconds: 120,
      },
      {
        title: "Genital Exploration",
        instruction:
          "With the same curious, observational mindset, touch the genital area. Vary pressure from very light to moderate. Notice different sensations in different areas. If arousal rises above level 3, pause and breathe.",
        durationSeconds: 240,
      },
      {
        title: "Comparative Awareness",
        instruction:
          "Alternate between touching a non-genital area (like the forearm) and the genital area. Notice how sensation quality differs. This contrast training builds arousal literacy.",
        durationSeconds: 120,
      },
      {
        title: "Stillness and Integration",
        instruction:
          "Stop all touch. Lie still with your eyes closed. Notice the map of sensations across your body. Where do you feel the most? Where do you feel the least? Take 5 slow breaths and gently close the session.",
        durationSeconds: 120,
      },
    ],
  },

  // ─── Level 8: Endurance Building ─────────────────────────────────────

  {
    slug: "edging-introduction",
    title: "Edging Practice Introduction",
    description:
      "Edging takes start-stop to the next level by approaching arousal levels 7-8 and hovering there using breathing and reverse Kegels rather than stopping completely. This is the most direct training for lasting longer during intercourse.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 8,
    xpReward: 60,
    trackTags: ["PE"],
    prerequisites: ["integrated-start-stop-squeeze"],
    safetyNotes:
      "This exercise approaches high arousal levels. If you reach level 9, stop completely and apply the squeeze. Overshooting is normal when learning; do not be discouraged.",
    steps: [
      {
        title: "Extended Breathing Warm-Up",
        instruction:
          "Perform 6 cycles of 4-7-8 breathing. This longer warm-up is important because you will be working at higher arousal levels and need a strong parasympathetic foundation.",
        durationSeconds: 120,
      },
      {
        title: "Build to Level 5",
        instruction:
          "Begin stimulation at a slow pace. Let arousal build gradually to level 5. Stay here for a moment. This is your comfort zone from previous exercises.",
        durationSeconds: 180,
      },
      {
        title: "Approach Level 7-8",
        instruction:
          "Continue stimulation, letting arousal rise to 7, then 8. As you cross level 7, begin slow 4-7-8 breathing. This is the edge. The goal is to hover here without crossing to 9.",
        durationSeconds: 180,
      },
      {
        title: "Hover with Reverse Kegels",
        instruction:
          "At level 7-8, slow your stimulation pace and perform gentle reverse Kegels on each exhale. The reverse Kegel opens the pelvic floor and reduces the ejaculatory reflex. Try to maintain level 7-8 for 60-90 seconds.",
        durationSeconds: 120,
      },
      {
        title: "Drop and Repeat",
        instruction:
          "Stop stimulation and let arousal drop to level 4. Take several 4-7-8 breaths. Then approach 7-8 again and hover. Complete 2-3 total hover cycles. Each one trains your nervous system to tolerate high arousal.",
        durationSeconds: 360,
      },
      {
        title: "Close and Reflect",
        instruction:
          "Let arousal subside fully. Take 5 deep breaths. This was a major session. Reflect on how it felt to hover near the edge. Did the reverse Kegels help? Did you overshoot? All of this is valuable data.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "kegel-advanced-set",
    title: "Kegel Advanced Set",
    description:
      "An advanced pelvic floor routine with extended hold times and flutter (rapid pulse) sets. This builds the muscular endurance needed for sustained control during longer intimate sessions.",
    category: "physical",
    subcategory: "kegel",
    duration: "10 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 8,
    xpReward: 50,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Flutter Set 1",
        instruction:
          "Perform rapid flutter Kegels (squeeze-release as fast as possible) for 30 seconds. Then rest for 15 seconds. This builds the fast-twitch capacity you need for quick interventions during intimacy.",
        durationSeconds: 45,
      },
      {
        title: "Flutter Sets 2-3",
        instruction:
          "Repeat the 30-second flutter set two more times, with 15 seconds rest between. Try to maintain speed throughout each set. It is normal for the pulses to slow as you fatigue.",
        durationSeconds: 90,
      },
      {
        title: "Sustained Hold Set",
        instruction:
          "Perform 3 sustained Kegel holds of 15 seconds each, with 10 seconds rest between. Maintain full intensity for the entire 15 seconds. This builds the endurance for prolonged control.",
        durationSeconds: 75,
      },
      {
        title: "Reverse Kegel Sustained Set",
        instruction:
          "Perform 3 reverse Kegel holds of 15 seconds each, with 10 seconds rest between. Focus on a full, gentle opening of the pelvic floor. Breathe slowly throughout.",
        durationSeconds: 75,
      },
      {
        title: "Cool-Down",
        instruction:
          "Relax completely for 30 seconds. Take 5 slow breaths. Perform 3 gentle reverse Kegels to release all residual tension. Your pelvic floor is getting significantly stronger.",
        durationSeconds: 45,
      },
    ],
  },

  {
    slug: "mindful-stimulation-variation",
    title: "Mindful Stimulation Variation",
    description:
      "Explore how different types of stimulation affect arousal speed and intensity. By varying pressure, speed, grip, and area, you build a detailed map of your arousal responses and learn which approaches give you more control.",
    category: "somatic",
    duration: "10 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 8,
    xpReward: 50,
    trackTags: ["PE", "Mindfulness"],
    safetyNotes:
      "Keep arousal below level 6 throughout this exercise. The focus is on observation and learning, not building toward high arousal.",
    steps: [
      {
        title: "Breathing Warm-Up",
        instruction:
          "Take 5 slow, deep breaths. Set an intention: this session is about mapping your arousal responses. You will stay below level 6 and focus on observation.",
        durationSeconds: 30,
      },
      {
        title: "Vary Pressure",
        instruction:
          "Begin stimulation with very light pressure. After 60 seconds, switch to moderate pressure. After 60 seconds, firm pressure. Rate how quickly arousal accelerates with each. Which gives you the most control?",
        durationSeconds: 180,
      },
      {
        title: "Vary Speed",
        instruction:
          "Return to moderate pressure. Start with very slow movement. After 60 seconds, increase to moderate speed. After 60 seconds, faster. Rate the arousal acceleration at each speed. Slow down if you approach level 6.",
        durationSeconds: 180,
      },
      {
        title: "Vary Area and Grip",
        instruction:
          "Explore different areas and grip styles. The shaft, the base, and the glans all respond differently. Notice which areas accelerate arousal most. This is your personal arousal map.",
        durationSeconds: 120,
      },
      {
        title: "Reflect and Close",
        instruction:
          "Stop stimulation. Take 5 slow breaths. Mentally note your findings: which pressure, speed, and area combinations accelerate arousal most? Which give you the most room to control? This knowledge is power.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 9: Mental Strength ────────────────────────────────────────

  {
    slug: "cognitive-defusion",
    title: "Cognitive Defusion for Performance Anxiety",
    description:
      "Performance anxiety is one of the biggest contributors to PE and ED. This meditation teaches cognitive defusion, an ACT (Acceptance and Commitment Therapy) technique where you observe anxious thoughts without believing or fighting them.",
    category: "meditation",
    duration: "10 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 9,
    xpReward: 50,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Settle and Ground",
        instruction:
          "Sit comfortably with your eyes closed. Take 5 slow breaths. Feel the weight of your body in the chair or on the floor. Ground yourself in the present moment.",
        durationSeconds: 40,
      },
      {
        title: "Identify Your Top 3 Fears",
        instruction:
          "Think about intimacy. What are your top 3 fears or anxious thoughts? For example: 'I will finish too fast,' 'She will be disappointed,' 'Something is wrong with me.' Name each one clearly in your mind.",
        durationSeconds: 60,
      },
      {
        title: "Defusion Technique: 'I Notice...'",
        instruction:
          "Take the first fear. Instead of thinking 'I will finish too fast,' rephrase it as 'I notice I am having the thought that I will finish too fast.' Say this version in your mind 3 times. Notice how adding 'I notice I am having the thought that...' creates distance. Repeat with fears 2 and 3.",
        durationSeconds: 120,
      },
      {
        title: "Thought as Clouds",
        instruction:
          "Visualize a blue sky. Each anxious thought is a cloud floating across the sky. Watch each thought-cloud drift by without grabbing onto it. You are the sky, not the clouds. Practice for 3 minutes.",
        durationSeconds: 180,
      },
      {
        title: "Return to Body",
        instruction:
          "Bring your attention back to physical sensation: your breathing, the contact with the chair, the temperature of the air. Take 5 slow breaths. Open your eyes. You have just practiced the mental skill that separates anxiety from performance.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "edging-thought-interruption",
    title: "Edging with Thought Interruption",
    description:
      "Combine the edging technique with cognitive defusion. During high-arousal edging, anxious thoughts often arise ('I am going to lose it'). This exercise trains you to defuse those thoughts and ground your attention in your body, specifically your feet.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 9,
    xpReward: 60,
    trackTags: ["PE", "Mindfulness"],
    prerequisites: ["edging-introduction"],
    safetyNotes:
      "This exercise works at high arousal levels. Use the squeeze technique if needed. The goal is to practice mental skills under arousal, not to set endurance records.",
    steps: [
      {
        title: "Breathing and Grounding",
        instruction:
          "Perform 4 cycles of 4-7-8 breathing. Then spend 30 seconds feeling the sensation in your feet. Press your feet into the floor. This foot grounding will be your anchor during high arousal.",
        durationSeconds: 120,
      },
      {
        title: "Build to Level 6",
        instruction:
          "Begin stimulation. Let arousal build to level 6 at a moderate pace. Maintain slow, steady breathing throughout.",
        durationSeconds: 180,
      },
      {
        title: "Approach the Edge with Defusion",
        instruction:
          "Let arousal rise toward 7-8. As anxious thoughts arise ('I am going to lose control'), practice defusion: 'I notice I am having the thought that I will lose control.' Then shift your attention to the sensation in your feet. Ground there.",
        durationSeconds: 180,
      },
      {
        title: "Hover with Foot Grounding",
        instruction:
          "At level 7-8, use reverse Kegels and breathing to hover. Whenever a thought pulls you into anxiety, redirect attention to your feet. You can split your attention: 70% feet, 30% genital sensation. Try to hover for 60-90 seconds.",
        durationSeconds: 120,
      },
      {
        title: "Drop and Repeat",
        instruction:
          "Let arousal drop to level 4. Repeat the cycle: build to 7-8, defuse thoughts, ground in feet, hover. Complete 2-3 total cycles.",
        durationSeconds: 300,
      },
      {
        title: "Close and Reflect",
        instruction:
          "Let arousal subside. Take 5 deep breaths. Reflect: were you able to defuse anxious thoughts during high arousal? Did foot grounding help? This is the integration of mental and physical skills.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "kegel-consolidation",
    title: "Kegel Consolidation",
    description:
      "A comprehensive Kegel routine that combines everything you have learned: quick pulses, pyramids, reverse Kegels, and wave contractions. This is the full routine you should maintain going forward.",
    category: "physical",
    subcategory: "kegel",
    duration: "8 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 9,
    xpReward: 45,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Quick Pulses",
        instruction:
          "Perform 15 quick pulse Kegels: squeeze 1 second, release 1 second. Keep the contractions sharp and distinct. Breathe normally.",
        durationSeconds: 35,
      },
      {
        title: "Pyramid Set",
        instruction:
          "Perform 5 Kegel pyramids: squeeze at 25%, 50%, 75%, 100%, 75%, 50%, 25%, holding each level for 2 seconds. Rest 8 seconds between pyramids.",
        durationSeconds: 120,
      },
      {
        title: "Reverse Kegel Holds",
        instruction:
          "Perform 5 reverse Kegel holds of 8 seconds each, with 5 seconds rest between. Focus on a full, gentle opening. Breathe into the belly.",
        durationSeconds: 65,
      },
      {
        title: "Wave Contractions",
        instruction:
          "Perform 3 wave Kegels: squeeze front to back over 5 seconds, hold 3 seconds, release front to back over 5 seconds. Rest 5 seconds between waves.",
        durationSeconds: 55,
      },
      {
        title: "Cool-Down",
        instruction:
          "Relax fully. Take 5 slow breaths. Perform 3 gentle reverse Kegels. Congratulations: you now have a complete pelvic floor routine that covers strength, endurance, control, and relaxation.",
        durationSeconds: 40,
      },
    ],
  },

  // ─── Level 10: Foundation Complete (Milestone) ───────────────────────

  {
    slug: "foundation-assessment",
    title: "Foundation Assessment Session",
    description:
      "This is your Tier 1 graduation session. You will perform a complete sequence that integrates every skill you have learned: breathing, pelvic floor engagement, progressive muscle relaxation, start-stop, squeeze, and body awareness. Completing this session means you are ready for Tier 2.",
    category: "physical",
    subcategory: "assessment",
    duration: "25 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 10,
    xpReward: 60,
    trackTags: ["PE", "Mindfulness"],
    safetyNotes:
      "Take your time with this session. If any section feels overwhelming, pause and breathe. This is an assessment of your progress, not a test you can fail.",
    steps: [
      {
        title: "4-7-8 Breathing Warm-Up",
        instruction:
          "Perform 6 cycles of 4-7-8 breathing. This sets the calm, parasympathetic foundation for the entire session. Notice how much easier this is now compared to when you started.",
        durationSeconds: 120,
      },
      {
        title: "Pelvic Floor Check",
        instruction:
          "Perform a quick pelvic floor check: 5 quick pulses, 3 sustained 10-second holds, 3 reverse Kegel 10-second holds, and 2 wave contractions. Assess: do your muscles feel strong and responsive?",
        durationSeconds: 120,
      },
      {
        title: "Progressive Muscle Relaxation",
        instruction:
          "Do an abbreviated PMR: tense and release your thighs (5sec/10sec), glutes (5sec/10sec), abdomen (5sec/10sec), and shoulders (5sec/10sec). Let your entire body reach deep relaxation.",
        durationSeconds: 120,
      },
      {
        title: "Integrated Start-Stop with Squeeze",
        instruction:
          "Begin stimulation. Approach level 7-8 using slow, deliberate movement. At 7-8, stop and apply the squeeze while breathing with 4-7-8. Use reverse Kegels on the exhale. Let arousal drop to 4. Repeat for 3-4 cycles. Use all your tools.",
        durationSeconds: 600,
      },
      {
        title: "Body Scan Cool-Down",
        instruction:
          "Stop stimulation. Let arousal subside. Perform a quick body scan from feet to head. Notice how your body feels. Scan for any residual tension and breathe it out.",
        durationSeconds: 180,
      },
      {
        title: "Reflection",
        instruction:
          "Take 5 slow breaths. Reflect on your journey through Tier 1. You have built the foundation: breathing control, pelvic floor strength, arousal awareness, start-stop, squeeze, and mental defusion. You are ready for the next level.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "kegel-benchmark",
    title: "Kegel Benchmark",
    description:
      "Test your pelvic floor progress with two benchmarks: a maximum hold duration test (target 15+ seconds) and a quick pulse count in 60 seconds (target 40+). These numbers track your physical progress across the program.",
    category: "physical",
    subcategory: "kegel",
    duration: "5 min",
    difficulty: "Beginner",
    tier: 1,
    levelUnlock: 10,
    xpReward: 40,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Warm-Up",
        instruction:
          "Perform 10 quick Kegel pulses and 3 moderate 5-second holds. Take 3 deep breaths. You are preparing for maximum effort.",
        durationSeconds: 40,
      },
      {
        title: "Maximum Hold Test",
        instruction:
          "Squeeze your PC muscle as hard as you can and hold for as long as possible. Count the seconds. Do not hold your breath; breathe normally. When the contraction fades or you cannot maintain it, release. Your target is 15 seconds or more.",
        durationSeconds: 30,
      },
      {
        title: "Rest",
        instruction:
          "Rest for 30 seconds. Shake out any tension. Take 3 slow breaths. Prepare for the pulse test.",
        durationSeconds: 30,
      },
      {
        title: "60-Second Quick Pulse Test",
        instruction:
          "Perform as many quick, distinct Kegel pulses as you can in 60 seconds. Each pulse should be a clear squeeze-and-release. Count as you go. Your target is 40 or more pulses.",
        durationSeconds: 60,
      },
      {
        title: "Record and Reflect",
        instruction:
          "Rest and take 5 slow breaths. Mentally note your two scores: max hold duration and 60-second pulse count. These are your Tier 1 benchmarks. You will test again after Tier 2 to measure progress.",
        durationSeconds: 40,
      },
    ],
  },
];
