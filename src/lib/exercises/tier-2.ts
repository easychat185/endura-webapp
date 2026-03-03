import type { Exercise } from "./data";

export const tier2Exercises: Exercise[] = [
  // ─── Level 11: Arousal Architecture ────────────────────────────────

  {
    slug: "arousal-mapping",
    title: "Arousal Mapping Session",
    description:
      "Track arousal transition times mentally during self-stimulation. Learn to identify the unique shape of your personal arousal curve and the specific moments where acceleration occurs.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 11,
    xpReward: 50,
    trackTags: ["PE"],
    steps: [
      {
        title: "Warmup",
        instruction:
          "Begin with 2 minutes of slow, deep breathing. Relax your pelvic floor and soften your jaw. Let your body settle into a comfortable position.",
        durationSeconds: 120,
      },
      {
        title: "Stimulate & Note Transitions",
        instruction:
          "Begin gentle self-stimulation. Mentally note each time your arousal shifts — from 0 to 2, 2 to 4, 4 to 6, and so on. Pay attention to how long each transition takes.",
        durationSeconds: 600,
      },
      {
        title: "Identify Acceleration Curve",
        instruction:
          "Continue stimulation and notice where your arousal accelerates most quickly. Is it between 5-7? 6-8? Identify the 'danger zone' where arousal jumps fastest.",
        durationSeconds: 420,
      },
      {
        title: "Reflect on Timing",
        instruction:
          "Pause stimulation. Mentally review your arousal map: which transitions were slow and controllable, and which were rapid. This awareness is the foundation for future control techniques.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "deceleration-training",
    title: "Deceleration Training",
    description:
      "Practice bringing arousal DOWN from level 6 to level 3 without stopping stimulation completely. This builds the core skill of active deceleration rather than relying on full stops.",
    category: "physical",
    subcategory: "edging",
    duration: "15 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 11,
    xpReward: 55,
    trackTags: ["PE"],
    prerequisites: ["edging-introduction"],
    steps: [
      {
        title: "Warmup to Level 6",
        instruction:
          "Begin stimulation and gradually build arousal to level 6. Use steady, moderate stimulation. Take your time — there is no rush.",
        durationSeconds: 300,
      },
      {
        title: "Slow Stimulation",
        instruction:
          "Reduce speed and pressure significantly but do NOT stop completely. Maintain the lightest possible contact and the slowest rhythm you can.",
        durationSeconds: 120,
      },
      {
        title: "Breathe & Reverse Kegel",
        instruction:
          "While maintaining light stimulation, take slow 4-7-8 breaths (inhale 4 sec, hold 7, exhale 8). On each exhale, gently push the pelvic floor outward with a reverse Kegel.",
        durationSeconds: 120,
      },
      {
        title: "Descend to 3 Without Full Stop",
        instruction:
          "Continue the combination of light touch, slow breathing, and reverse Kegels until you feel your arousal settle at approximately level 3. You should never have fully stopped stimulation.",
        durationSeconds: 180,
      },
      {
        title: "Repeat Cycle",
        instruction:
          "Build back up to level 6 and repeat the deceleration process. Aim for 2-3 complete cycles. Notice if each descent becomes smoother and more controlled.",
        durationSeconds: 180,
      },
    ],
  },

  {
    slug: "kegel-tempo-variations",
    title: "Kegel Tempo Variations",
    description:
      "Train your pelvic floor at three different tempos — slow, medium, and fast — followed by slow reverse Kegels. This builds both strength and neuromuscular control across contraction speeds.",
    category: "physical",
    subcategory: "kegel",
    duration: "8 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 11,
    xpReward: 40,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Slow Tempo (3-3-3)",
        instruction:
          "Contract your PC muscle for 3 seconds, hold for 3 seconds, release for 3 seconds. Perform 10 repetitions at this slow pace. Focus on full contraction and full release.",
        durationSeconds: 90,
      },
      {
        title: "Medium Tempo (1-1-1)",
        instruction:
          "Contract for 1 second, hold for 1 second, release for 1 second. Perform 15 repetitions. Maintain clean, distinct contractions — avoid blurring them together.",
        durationSeconds: 60,
      },
      {
        title: "Fast Tempo (Rapid Flutters)",
        instruction:
          "Contract and release as rapidly as possible for 20 seconds. Rest 10 seconds. Repeat for a second set of 20 seconds. These rapid flutters build fast-twitch response.",
        durationSeconds: 70,
      },
      {
        title: "Slow Reverse Kegels",
        instruction:
          "Gently push outward on the pelvic floor as if releasing tension. Hold for 5 seconds, release for 5 seconds. Perform 10 repetitions. This counterbalances the contractions and prevents over-tightening.",
        durationSeconds: 120,
      },
    ],
  },

  // ─── Level 12: Breath as Control ───────────────────────────────────

  {
    slug: "breath-controlled-edging",
    title: "Breath-Controlled Edging",
    description:
      "Edge to arousal level 7-8 and use ONLY breath to descend — no stopping stimulation, no Kegels. Master the 4-7-8 pattern with puffed cheeks and relaxed jaw while maintaining very light touch.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 12,
    xpReward: 55,
    trackTags: ["PE"],
    prerequisites: ["edging-introduction"],
    steps: [
      {
        title: "Breathing Warmup",
        instruction:
          "Practice the 4-7-8 breath pattern without stimulation: inhale through the nose for 4 seconds, hold for 7 seconds, exhale slowly through the mouth for 8 seconds. Puff your cheeks slightly on the exhale and relax your jaw completely. Do 5 cycles.",
        durationSeconds: 120,
      },
      {
        title: "Build to Level 7-8",
        instruction:
          "Begin stimulation and gradually build arousal to level 7-8. Use a moderate, steady rhythm. Be honest with yourself about your number.",
        durationSeconds: 360,
      },
      {
        title: "Breath-Only Descent",
        instruction:
          "Reduce stimulation to very light touch but do NOT stop. Begin 4-7-8 breathing with puffed cheeks and relaxed jaw. Let the breath alone bring your arousal down. No Kegels — only breath.",
        durationSeconds: 240,
      },
      {
        title: "Repeat Cycles",
        instruction:
          "Build back to 7-8 and descend again using only breath. Aim for 3-4 cycles. Notice how each cycle teaches your nervous system that breath alone is a powerful control tool.",
        durationSeconds: 420,
      },
      {
        title: "Cool Down",
        instruction:
          "Reduce stimulation fully and take 5 slow breaths. Reflect on which breath cycles felt most effective. Notice any jaw or shoulder tension and release it.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "pelvic-floor-breathing",
    title: "Pelvic Floor Breathing",
    description:
      "Coordinate your diaphragm with your pelvic floor: gentle reverse Kegel on inhale (as the diaphragm descends) and gentle Kegel on exhale. This builds the breath-body connection critical for arousal control.",
    category: "breathwork",
    subcategory: "pranayama",
    duration: "8 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 12,
    xpReward: 40,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Establish Breath Rhythm",
        instruction:
          "Sit or lie comfortably. Begin slow diaphragmatic breathing — 4 seconds in, 6 seconds out. Place one hand on your belly to feel the diaphragm descend on inhale.",
        durationSeconds: 60,
      },
      {
        title: "Add Pelvic Floor Coordination",
        instruction:
          "On each inhale, as your diaphragm descends, perform a gentle reverse Kegel — let the pelvic floor relax and open slightly. On each exhale, perform a gentle Kegel — a light lift of the pelvic floor.",
        durationSeconds: 120,
      },
      {
        title: "20 Coordinated Cycles",
        instruction:
          "Perform 20 complete breath-pelvic floor cycles. Inhale = belly expands + reverse Kegel. Exhale = belly contracts + gentle Kegel. Keep contractions light — no more than 30% effort.",
        durationSeconds: 240,
      },
      {
        title: "Rest & Integrate",
        instruction:
          "Release all effort and breathe naturally for 1 minute. Notice if the coordination begins to feel automatic. This pairing will become your primary tool during arousal control.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "sustained-plateau-practice",
    title: "Sustained Plateau Practice",
    description:
      "Reach arousal level 6 and maintain it within a narrow band (6 +/- 0.5) for a full 3 minutes using breath and variable speed. This trains precise arousal stabilization.",
    category: "physical",
    subcategory: "edging",
    duration: "15 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 12,
    xpReward: 55,
    trackTags: ["PE"],
    prerequisites: ["deceleration-training"],
    steps: [
      {
        title: "Warmup & Build",
        instruction:
          "Begin with 2 minutes of breathing, then slowly build arousal to level 6. Take your time — accuracy matters more than speed.",
        durationSeconds: 300,
      },
      {
        title: "Stabilize at Level 6",
        instruction:
          "Once at level 6, begin micro-adjusting: slow down slightly if approaching 6.5, speed up gently if dropping below 5.5. Use breath to fine-tune. Aim to hold this plateau for 3 continuous minutes.",
        durationSeconds: 180,
      },
      {
        title: "Variable Speed Maintenance",
        instruction:
          "Continue holding level 6 but now alternate between two speeds — a slightly faster rhythm for 15 seconds, then a slower rhythm for 15 seconds. Maintain the plateau throughout.",
        durationSeconds: 180,
      },
      {
        title: "Rest & Repeat",
        instruction:
          "Allow arousal to drop to level 3. Then build back to 6 and attempt another 3-minute plateau. Notice if the second attempt is easier.",
        durationSeconds: 240,
      },
    ],
  },

  // ─── Level 13: Touch Intelligence ─────────────────────────────────

  {
    slug: "sensate-focus-solo-3",
    title: "Sensate Focus Solo Phase 3",
    description:
      "Mindful genital touch exploration with detailed sensitivity mapping. Rate different areas from 1-5 in sensitivity to build a personal map of your body's responsiveness.",
    category: "somatic",
    duration: "18 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 13,
    xpReward: 55,
    trackTags: ["PE", "Mindfulness"],
    prerequisites: ["sensate-focus-solo-2"],
    steps: [
      {
        title: "Body Scan Warmup",
        instruction:
          "Lie comfortably and perform a quick body scan from head to pelvis. Release any tension you find. Arrive fully in your body before beginning touch.",
        durationSeconds: 120,
      },
      {
        title: "Systematic Exploration",
        instruction:
          "Using a single fingertip, slowly explore different areas of the genitals. Move methodically — shaft, frenulum, glans, base, perineum. Use the same light pressure everywhere.",
        durationSeconds: 360,
      },
      {
        title: "Sensitivity Mapping",
        instruction:
          "Return to each area and rate its sensitivity from 1 (mild) to 5 (intense). Notice which areas trigger the fastest arousal response and which feel more neutral.",
        durationSeconds: 360,
      },
      {
        title: "Pressure Variation",
        instruction:
          "Choose the 2 most sensitive areas. Explore them with three pressures: featherlight, medium, and firm. Notice how pressure changes the arousal response.",
        durationSeconds: 180,
      },
      {
        title: "Integration Reflection",
        instruction:
          "Rest with hands at your sides. Mentally review your sensitivity map. This knowledge will guide future edging — you now know which areas to use for building and which for maintaining.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "minimal-stimulation-edging",
    title: "Minimal Stimulation Edging",
    description:
      "Edge to arousal level 7 using the lightest touch physically possible. Build arousal through presence, breath, and intention rather than friction. This develops sensitivity and mental arousal control.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 13,
    xpReward: 55,
    trackTags: ["PE", "Tantric"],
    prerequisites: ["breath-controlled-edging"],
    steps: [
      {
        title: "Breathing Foundation",
        instruction:
          "Spend 2 minutes with slow diaphragmatic breathing. Set the intention: today you will use the absolute minimum stimulation needed.",
        durationSeconds: 120,
      },
      {
        title: "Featherlight Touch",
        instruction:
          "Begin with the lightest possible touch — barely making contact with the skin. Resist the urge to increase pressure. Let arousal build slowly through presence and attention.",
        durationSeconds: 360,
      },
      {
        title: "Presence-Based Arousal",
        instruction:
          "As arousal builds, notice how much of it comes from physical touch versus mental focus. Continue featherlight stimulation and use breath to amplify sensation. Build toward level 7.",
        durationSeconds: 360,
      },
      {
        title: "Light-Touch Edge Cycles",
        instruction:
          "At level 7, reduce touch even further or pause for a breath cycle. Then resume featherlight contact. Complete 2-3 edge cycles while maintaining minimal stimulation throughout.",
        durationSeconds: 300,
      },
      {
        title: "Reflection",
        instruction:
          "Release stimulation. Notice that arousal is possible with far less friction than you may be habituated to. This recalibration is key for partnered experiences.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "perineum-awareness",
    title: "Perineum Awareness",
    description:
      "Apply gentle pressure to the perineum and feel PC/BC muscle contractions externally. This builds body literacy and locates the muscles you use during Kegel and Mula Bandha exercises.",
    category: "somatic",
    duration: "5 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 13,
    xpReward: 35,
    trackTags: ["PE", "ED", "Tantric"],
    steps: [
      {
        title: "Locate the Perineum",
        instruction:
          "Sit on a firm surface or use two fingers to locate the perineum — the area between the scrotum and anus. Apply gentle steady pressure.",
        durationSeconds: 30,
      },
      {
        title: "Feel PC Contractions",
        instruction:
          "While pressing gently on the perineum, perform a Kegel (as if stopping urine). Feel the muscle lift and tighten under your fingers. Repeat 10 times slowly.",
        durationSeconds: 90,
      },
      {
        title: "Feel Reverse Kegel",
        instruction:
          "Now perform a reverse Kegel — gently push outward. Feel the perineum soften and descend slightly under your fingers. Alternate between Kegel and reverse Kegel, 5 cycles.",
        durationSeconds: 60,
      },
      {
        title: "Integrate Awareness",
        instruction:
          "Remove pressure and perform the same contractions without touch. Can you still feel the movement internally? This kinesthetic awareness is critical for advanced techniques.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 14: The Observer Strengthened ───────────────────────────

  {
    slug: "observer-edging",
    title: "Observer Edging",
    description:
      "Edge with dual awareness: simultaneously feel the sensation AND monitor it from an observer perspective. Practice internal narration of your arousal state while stimulating.",
    category: "physical",
    subcategory: "edging",
    duration: "22 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 14,
    xpReward: 55,
    trackTags: ["PE", "Mindfulness"],
    prerequisites: ["minimal-stimulation-edging"],
    steps: [
      {
        title: "Establish Observer",
        instruction:
          "Before beginning stimulation, close your eyes and locate the 'observer' — the part of your mind that can watch thoughts and sensations without being consumed by them. Breathe and settle into this awareness.",
        durationSeconds: 120,
      },
      {
        title: "Begin with Narration",
        instruction:
          "Start stimulation slowly. Internally narrate: 'Arousal is at 3... now rising to 4... sensation is concentrated at the frenulum... breath is steady.' Keep this running commentary going.",
        durationSeconds: 300,
      },
      {
        title: "Dual Awareness Edging",
        instruction:
          "Build to level 7 while maintaining the observer narration. Notice the challenge: as arousal increases, the observer wants to merge with sensation. Keep both channels active.",
        durationSeconds: 360,
      },
      {
        title: "Observer-Guided Descent",
        instruction:
          "At level 7, let the observer guide your descent: 'Now applying breath control... arousal dropping to 6... 5...' Use the narration to stay conscious rather than reactive. Repeat 2-3 edge cycles.",
        durationSeconds: 360,
      },
      {
        title: "Integration",
        instruction:
          "Stop stimulation. Reflect: at what arousal level did the observer become hardest to maintain? This is your current 'awareness ceiling' — future practice will raise it.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "speed-variation-drill",
    title: "Speed Variation Drill",
    description:
      "Alternate between very slow strokes (30-second strokes) and medium strokes (2-second strokes). Monitor how arousal responds differently to each speed and practice maintaining control at both.",
    category: "physical",
    subcategory: "edging",
    duration: "15 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 14,
    xpReward: 50,
    trackTags: ["PE"],
    steps: [
      {
        title: "Warmup",
        instruction:
          "Begin with 2 minutes of breathing and light stimulation. Build arousal to level 4 at a comfortable pace.",
        durationSeconds: 120,
      },
      {
        title: "Slow Phase (30-Second Strokes)",
        instruction:
          "Perform extremely slow strokes — each full stroke takes approximately 30 seconds. Focus entirely on the sensation of each millimeter of movement. Do this for 3 minutes.",
        durationSeconds: 180,
      },
      {
        title: "Medium Phase (2-Second Strokes)",
        instruction:
          "Switch to medium speed — one complete stroke every 2 seconds. Notice how quickly arousal changes compared to the slow phase. Monitor your number closely. Continue for 2 minutes.",
        durationSeconds: 120,
      },
      {
        title: "Alternating Cycles",
        instruction:
          "Alternate: 90 seconds slow, 60 seconds medium, 90 seconds slow, 60 seconds medium. Keep arousal below 8. If approaching 8, switch to slow regardless of the schedule.",
        durationSeconds: 300,
      },
      {
        title: "Debrief",
        instruction:
          "Rest. Notice which speed felt more controllable and which generated faster arousal. Understanding your speed-arousal relationship is critical for partnered pacing.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "kegel-integration",
    title: "Kegel Integration",
    description:
      "During edging rest periods, practice coordinated breathing-Kegel sequences. Then during the next edge, deploy a strong Kegel at level 7 as an emergency reflex. Build the Kegel into your arousal control toolkit.",
    category: "physical",
    subcategory: "kegel",
    duration: "6 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 14,
    xpReward: 40,
    trackTags: ["PE", "ED"],
    steps: [
      {
        title: "Breathing-Kegel Coordination",
        instruction:
          "Without stimulation: inhale with reverse Kegel, exhale with gentle Kegel. Perform 10 coordinated cycles. This is your rest-period drill.",
        durationSeconds: 90,
      },
      {
        title: "Edge to Level 7",
        instruction:
          "Begin stimulation and build arousal to level 7. Use steady, moderate stimulation. Stay present with your arousal number.",
        durationSeconds: 120,
      },
      {
        title: "Emergency Kegel at Level 7",
        instruction:
          "At level 7, perform a strong, sustained Kegel hold (70% effort) for 5 seconds while simultaneously slowing stimulation. Feel how the Kegel creates a 'brake' on rising arousal.",
        durationSeconds: 30,
      },
      {
        title: "Rest & Repeat",
        instruction:
          "During the rest period, return to breathing-Kegel coordination for 30 seconds. Then edge to 7 again and deploy the emergency Kegel. Complete 2-3 total cycles.",
        durationSeconds: 120,
      },
    ],
  },

  // ─── Level 15: Emotional Ground ───────────────────────────────────

  {
    slug: "shame-inventory",
    title: "Shame Inventory",
    description:
      "List your top performance fears and practice cognitive defusion on each one. Defusion means seeing a thought as just a thought — not a fact — which loosens its grip on your nervous system.",
    category: "meditation",
    duration: "10 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 15,
    xpReward: 45,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Identify Fears",
        instruction:
          "Close your eyes and ask yourself: 'What am I most afraid will happen during sex?' Write down or mentally list 3-5 specific fears. Be honest — no one is watching. Examples: 'I will finish too fast,' 'She will be disappointed,' 'I am broken.'",
        durationSeconds: 180,
      },
      {
        title: "Practice Defusion",
        instruction:
          "Take your first fear and restate it: 'I am having the thought that I will finish too fast.' Then: 'I notice I am having the thought that I will finish too fast.' Feel how each reframe creates distance between you and the thought.",
        durationSeconds: 120,
      },
      {
        title: "Breathe Through Each Fear",
        instruction:
          "For each remaining fear, apply the defusion phrase and then take 3 slow breaths. On each exhale, imagine the thought floating away like a cloud. Spend about 60 seconds per fear.",
        durationSeconds: 180,
      },
      {
        title: "Reflect",
        instruction:
          "Sit quietly. Notice that these fears are thoughts your mind produces — they are not predictions of the future. Your nervous system responds to your beliefs. Changing the relationship to these thoughts changes the body's response.",
        durationSeconds: 120,
      },
    ],
  },

  {
    slug: "comfort-zone-edging",
    title: "Comfort Zone Edging",
    description:
      "Edge with a focus on enjoyment rather than performance. Set a 20-minute timer and let go of all goals — no target arousal level, no required number of edges. Just explore pleasure with curiosity.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 15,
    xpReward: 50,
    trackTags: ["PE", "Mindfulness"],
    prerequisites: ["observer-edging"],
    steps: [
      {
        title: "Set Intention",
        instruction:
          "Before beginning, set this intention: 'For the next 20 minutes, there is nothing to achieve. I am here to explore and enjoy.' Take 5 deep breaths to anchor this intention.",
        durationSeconds: 60,
      },
      {
        title: "Pleasure-Led Stimulation",
        instruction:
          "Begin stimulation guided entirely by what feels good. Vary speed, pressure, and location based on pleasure alone — not based on trying to reach or avoid any number.",
        durationSeconds: 480,
      },
      {
        title: "Release Performance Monitoring",
        instruction:
          "If you notice yourself tracking your arousal number or worrying about finishing, gently label it: 'Performance monitoring.' Then return attention to pure sensation. Continue exploring.",
        durationSeconds: 480,
      },
      {
        title: "Gratitude Close",
        instruction:
          "As the session ends, take a moment to appreciate your body and its capacity for pleasure. Notice that letting go of performance pressure often makes the experience richer, not riskier.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 16: Muscular Mastery ────────────────────────────────────

  {
    slug: "mula-bandha-introduction",
    title: "Mula Bandha Introduction",
    description:
      "Learn the yogic Mula Bandha — a precise lift of the perineal muscles that is subtler and deeper than a standard Kegel. Sit on a firm surface to feel the engagement clearly.",
    category: "physical",
    subcategory: "bandha",
    duration: "8 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 16,
    xpReward: 50,
    trackTags: ["PE", "Tantric"],
    steps: [
      {
        title: "Find the Point",
        instruction:
          "Sit on a firm, flat surface (floor or firm chair). Feel the point of contact between your perineum and the surface. This is your Mula Bandha activation point — deeper and more central than a standard Kegel.",
        durationSeconds: 60,
      },
      {
        title: "Isolate the Lift",
        instruction:
          "Without engaging the glutes or abdomen, gently lift only the perineal muscles upward. It should feel like drawing a small point inward and upward. The movement is subtle — less is more.",
        durationSeconds: 60,
      },
      {
        title: "10 Reps x 5 Seconds",
        instruction:
          "Perform 10 repetitions: lift and hold Mula Bandha for 5 seconds, release for 5 seconds. Keep your breathing smooth throughout — do not hold your breath during the contraction.",
        durationSeconds: 120,
      },
      {
        title: "5 Reps x 10 Seconds",
        instruction:
          "Perform 5 longer holds: lift for 10 seconds, release for 10 seconds. Maintain no more than 50% effort. Focus on precision of the lift point rather than strength.",
        durationSeconds: 120,
      },
      {
        title: "Release & Compare",
        instruction:
          "Fully release and sit quietly. Compare the sensation to a standard Kegel. Mula Bandha should feel deeper, more central, and more focused on the perineum specifically.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "isometric-pelvic-floor",
    title: "Isometric Pelvic Floor Endurance",
    description:
      "Build sustained endurance in the pelvic floor through low-effort, long-duration Mula Bandha holds. 30% effort for 60 seconds teaches the muscles to sustain engagement without fatigue.",
    category: "physical",
    subcategory: "bandha",
    duration: "10 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 16,
    xpReward: 50,
    trackTags: ["PE", "ED"],
    prerequisites: ["mula-bandha-introduction"],
    steps: [
      {
        title: "Activate at 30%",
        instruction:
          "Engage Mula Bandha at approximately 30% of your maximum effort. This should feel like a gentle background hum of engagement — not straining, not effortless.",
        durationSeconds: 30,
      },
      {
        title: "Sustained Hold Set (60s x 5)",
        instruction:
          "Hold the 30% Mula Bandha for 60 seconds. Breathe normally throughout. Then release for 30 seconds. Repeat for a total of 5 rounds. If the muscle fatigues, reduce effort slightly rather than stopping.",
        durationSeconds: 450,
      },
      {
        title: "Cool Down",
        instruction:
          "Fully release the pelvic floor. Perform 5 gentle reverse Kegels (push outward for 5 seconds each) to relax the muscles. Shake out your legs if needed.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "applied-mula-bandha-edging",
    title: "Applied Mula Bandha Edging",
    description:
      "During edging at level 7, apply Mula Bandha combined with 4-7-8 breathing. Compare the effect to a standard Kegel squeeze. Discover which tool works better for your body.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 16,
    xpReward: 55,
    trackTags: ["PE", "Tantric"],
    prerequisites: ["mula-bandha-introduction", "edging-introduction"],
    steps: [
      {
        title: "Warmup",
        instruction:
          "Begin with 2 minutes of breathing and 5 gentle Mula Bandha activations to prime the muscles. Then start stimulation.",
        durationSeconds: 120,
      },
      {
        title: "Edge to 7 — Standard Kegel",
        instruction:
          "Build arousal to level 7. Apply a strong standard Kegel (the squeeze you have been practicing) combined with slow breathing. Note how quickly arousal drops and what it feels like.",
        durationSeconds: 300,
      },
      {
        title: "Edge to 7 — Mula Bandha",
        instruction:
          "Build back to level 7. This time apply Mula Bandha (the deeper perineal lift) at 50% effort combined with 4-7-8 breathing. Note how this feels different from the standard Kegel.",
        durationSeconds: 300,
      },
      {
        title: "Compare & Experiment",
        instruction:
          "Build to 7 a third time. Experiment: try Mula Bandha first, then add a standard Kegel on top. Or try alternating. Find the combination that gives you the most reliable descent.",
        durationSeconds: 300,
      },
      {
        title: "Reflection",
        instruction:
          "Rest and reflect. Which technique produced a faster descent? Which felt more sustainable? Your answer will guide your personal toolkit going forward.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 17: Visualization Power ────────────────────────────────

  {
    slug: "arousal-dial-visualization",
    title: "Arousal Dial Visualization",
    description:
      "Visualize a 1-10 arousal dial in your mind's eye. Practice mentally turning it up and down: to 5, hold, back to 2, up to 6, back to 3. This builds the mental circuitry for intentional arousal regulation.",
    category: "meditation",
    duration: "10 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 17,
    xpReward: 45,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Create the Dial",
        instruction:
          "Close your eyes and visualize a numbered dial from 1 to 10. Give it a color, a shape, a texture. See it clearly. Your hand rests on it. It currently points to 1.",
        durationSeconds: 60,
      },
      {
        title: "Turn to 5 & Hold",
        instruction:
          "Slowly turn the dial to 5. Feel a corresponding warmth or energy build in your pelvis as the number increases. Hold at 5 for 60 seconds. Keep the image vivid.",
        durationSeconds: 90,
      },
      {
        title: "Descend to 2",
        instruction:
          "Slowly turn the dial back to 2. Feel the warmth recede, the energy calm. Use slow exhales to support the descent. Hold at 2 for 30 seconds.",
        durationSeconds: 60,
      },
      {
        title: "Climb to 6 & Descend to 3",
        instruction:
          "Turn the dial to 6. Hold for 60 seconds, maintaining the visualization. Then slowly descend to 3. Repeat this cycle: up to 6, down to 3, two more times.",
        durationSeconds: 300,
      },
      {
        title: "Integration",
        instruction:
          "Turn the dial to 1 and release the visualization. Take 3 deep breaths. This mental dial will become a tool you can overlay onto real arousal during edging sessions.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "visualization-enhanced-edging",
    title: "Visualization-Enhanced Edging",
    description:
      "Edge to level 7 and use a 'cool blue light' visualization — imagining calming energy flowing from crown to earth — combined with extended exhales to descend. Complete 4 full cycles.",
    category: "physical",
    subcategory: "edging",
    duration: "22 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 17,
    xpReward: 55,
    trackTags: ["PE", "Tantric"],
    prerequisites: ["applied-mula-bandha-edging"],
    steps: [
      {
        title: "Visualization Priming",
        instruction:
          "Close your eyes and imagine a cool blue light at the crown of your head. On each exhale, see it flow slowly down through your body — forehead, throat, chest, belly, pelvis, legs, into the earth. Practice 5 cycles.",
        durationSeconds: 120,
      },
      {
        title: "Build to Level 7",
        instruction:
          "Begin stimulation and build arousal to level 7. Maintain awareness but save the visualization for the descent phase.",
        durationSeconds: 300,
      },
      {
        title: "Blue Light Descent",
        instruction:
          "At level 7, slow stimulation to very light touch. Visualize the cool blue light flowing from your crown through your body and into the earth, carrying excess arousal energy with it. Combine with extended exhales (8-10 seconds). Feel arousal descend.",
        durationSeconds: 180,
      },
      {
        title: "Complete 4 Cycles",
        instruction:
          "Build back to 7 and descend using the blue light visualization again. Complete 4 total edge-descent cycles. With each cycle, the visualization should become more vivid and effective.",
        durationSeconds: 600,
      },
      {
        title: "Ground & Close",
        instruction:
          "After the final descent, let the blue light pool at your feet and dissolve into the ground. Take 3 deep breaths. Notice how visualization adds a powerful mental dimension to your toolkit.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 18: Rhythm and Flow ────────────────────────────────────

  {
    slug: "rhythmic-edging",
    title: "Rhythmic Edging",
    description:
      "Practice consistent rhythmic stimulation that mimics thrusting. Maintain arousal between 5-7 while keeping a steady rhythm. The goal is to find your sustainable rhythm — the speed you can maintain without losing control.",
    category: "physical",
    subcategory: "edging",
    duration: "22 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 18,
    xpReward: 55,
    trackTags: ["PE"],
    steps: [
      {
        title: "Warmup",
        instruction:
          "Begin with 2 minutes of breathing. Then start slow stimulation, building arousal to level 5.",
        durationSeconds: 180,
      },
      {
        title: "Establish Rhythm",
        instruction:
          "Find a consistent rhythmic pace that mimics intercourse — approximately 1 stroke per second. Lock into this rhythm and maintain it.",
        durationSeconds: 180,
      },
      {
        title: "Maintain the 5-7 Band",
        instruction:
          "Keep the rhythm steady while staying in the 5-7 arousal range. Use breath and pelvic floor adjustments to stay in the band WITHOUT changing your stroke rhythm. This is the core skill.",
        durationSeconds: 480,
      },
      {
        title: "Find Your Sustainable Rhythm",
        instruction:
          "Experiment with slightly faster and slightly slower rhythms. Find the fastest rhythm you can maintain while keeping arousal below 7. This is your current sustainable rhythm — it will improve with practice.",
        durationSeconds: 300,
      },
      {
        title: "Cool Down",
        instruction:
          "Gradually slow to a stop. Take 5 deep breaths. Note your sustainable rhythm — this baseline will be your reference point in future sessions.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "rhythm-variation-control",
    title: "Rhythm Variation Control",
    description:
      "Start with a slow rhythm (1 stroke per 2 seconds) for 2 minutes, then increase to 1 stroke per second for 1 minute. If arousal exceeds 7, return to slow. This trains rhythm-based arousal control.",
    category: "physical",
    subcategory: "edging",
    duration: "15 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 18,
    xpReward: 50,
    trackTags: ["PE"],
    prerequisites: ["rhythmic-edging"],
    steps: [
      {
        title: "Warmup",
        instruction:
          "Begin with breathing and light stimulation. Build arousal to level 4-5 at a comfortable pace.",
        durationSeconds: 120,
      },
      {
        title: "Slow Phase (1 Stroke / 2 Seconds)",
        instruction:
          "Set a slow, deliberate rhythm: one complete stroke every 2 seconds. Maintain this rhythm for 2 full minutes. Monitor your arousal level throughout.",
        durationSeconds: 120,
      },
      {
        title: "Faster Phase (1 Stroke / Second)",
        instruction:
          "Double the speed to 1 stroke per second for 1 minute. Watch your arousal closely. If you exceed level 7, immediately return to the slow rhythm — do not wait.",
        durationSeconds: 60,
      },
      {
        title: "Alternating Cycles",
        instruction:
          "Continue alternating: 2 minutes slow, 1 minute faster. Complete 3 full cycles. Each time you escalate, practice staying below 7 using breath and pelvic floor while maintaining the faster rhythm.",
        durationSeconds: 480,
      },
      {
        title: "Debrief",
        instruction:
          "Rest. Reflect on how many cycles you maintained the faster rhythm without exceeding 7. This ratio will improve as your control develops.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "multi-technique-integration",
    title: "Multi-Technique Integration",
    description:
      "Deploy your full toolkit in one session: edge to 7, then apply breath descent + Mula Bandha + visualization + brief stop if needed. Complete 3 cycles using every tool you have learned.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 18,
    xpReward: 60,
    trackTags: ["PE", "Tantric"],
    prerequisites: ["visualization-enhanced-edging"],
    steps: [
      {
        title: "Toolkit Review",
        instruction:
          "Before beginning, mentally review your tools: 4-7-8 breathing, Mula Bandha, blue light visualization, speed adjustment, reverse Kegel. You will use ALL of them in this session.",
        durationSeconds: 60,
      },
      {
        title: "Build to Level 7",
        instruction:
          "Begin stimulation and build to level 7 using rhythmic stimulation. Maintain observer awareness throughout the ascent.",
        durationSeconds: 300,
      },
      {
        title: "Full Toolkit Descent",
        instruction:
          "At level 7, deploy everything: slow stimulation to light touch, engage Mula Bandha at 50%, begin 4-7-8 breathing, visualize cool blue light descending from crown to earth. If needed, add a brief 5-second full stop. Descend to level 4.",
        durationSeconds: 180,
      },
      {
        title: "Cycle 2 & 3",
        instruction:
          "Build back to 7 and apply the full toolkit descent again. Complete 3 total cycles. Notice which tools activate first naturally — this reveals your body's preferred control sequence.",
        durationSeconds: 480,
      },
      {
        title: "Integration Reflection",
        instruction:
          "Rest. Reflect on your personal hierarchy: which tool had the most impact? Which activated first? This self-knowledge is the core outcome of Tier 2.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 19: Consolidation Week ─────────────────────────────────

  {
    slug: "flow-session",
    title: "Flow Session",
    description:
      "No structured script. Begin with breathing, move into stimulation, and use your toolkit naturally as needed. This unstructured session tests whether your skills have become embodied and automatic.",
    category: "physical",
    subcategory: "edging",
    duration: "25 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 19,
    xpReward: 55,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Open with Breath",
        instruction:
          "Begin with 2-3 minutes of natural diaphragmatic breathing. No specific pattern — just settle into your body and arrive in the present moment.",
        durationSeconds: 180,
      },
      {
        title: "Intuitive Stimulation",
        instruction:
          "Begin stimulation with no prescribed speed, pressure, or target level. Let your body guide the session. Move between light and firm touch, slow and medium speed, as feels natural.",
        durationSeconds: 480,
      },
      {
        title: "Natural Toolkit Use",
        instruction:
          "As arousal rises, notice which tools your body reaches for naturally — breath, Mula Bandha, speed change, visualization. Use them without forcing a sequence. Let the practice be intuitive.",
        durationSeconds: 480,
      },
      {
        title: "Observe Your Flow",
        instruction:
          "Continue for the remaining time, allowing the session to flow. Notice moments where you feel completely present and in control. These 'flow states' are the goal of all your training.",
        durationSeconds: 300,
      },
      {
        title: "Close & Reflect",
        instruction:
          "Wind down naturally. Reflect on how much of the session felt automatic versus effortful. The more automatic your control, the more ready you are for Tier 3.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "endurance-edge",
    title: "Endurance Edge",
    description:
      "Stay in the 5-8 arousal range for a full 20 minutes without dropping below 5 or exceeding 8. Use every technique in your toolkit to maintain this sustained high-arousal state.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 19,
    xpReward: 60,
    trackTags: ["PE"],
    prerequisites: ["multi-technique-integration"],
    steps: [
      {
        title: "Warmup",
        instruction:
          "Begin with breathing and build arousal to level 5. Take your time — you need to arrive at 5 feeling calm and in control, not rushed.",
        durationSeconds: 240,
      },
      {
        title: "Enter the Band",
        instruction:
          "Once at level 5, your goal is simple: stay between 5 and 8 for the remainder of the session. Use rhythmic stimulation as your baseline.",
        durationSeconds: 300,
      },
      {
        title: "Maintain with Toolkit",
        instruction:
          "Use breath, Mula Bandha, speed variation, and visualization to stay in the 5-8 band. If approaching 8, deploy your descent tools. If dropping toward 5, increase stimulation slightly.",
        durationSeconds: 420,
      },
      {
        title: "Final Push",
        instruction:
          "For the last 3 minutes, allow yourself to hover at 7-8 — the upper edge of the band. This is the ultimate test of sustained high-arousal control. Breathe steadily.",
        durationSeconds: 180,
      },
      {
        title: "Cool Down",
        instruction:
          "Slowly reduce stimulation and allow arousal to descend naturally. Take 5 deep breaths. If you maintained the band for 15+ minutes, you have demonstrated Tier 2 mastery.",
        durationSeconds: 60,
      },
    ],
  },

  {
    slug: "mula-bandha-endurance",
    title: "Mula Bandha Endurance",
    description:
      "Advanced pelvic floor endurance: 30% continuous hold for 90 seconds (3 sets), then 60% hold for 30 seconds (5 sets). This builds the sustained engagement capacity needed for extended sessions.",
    category: "physical",
    subcategory: "bandha",
    duration: "10 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 19,
    xpReward: 45,
    trackTags: ["PE", "ED", "Tantric"],
    prerequisites: ["isometric-pelvic-floor"],
    steps: [
      {
        title: "Activation Warmup",
        instruction:
          "Perform 5 gentle Mula Bandha lifts, holding each for 3 seconds. Breathe naturally. This primes the muscles for the endurance sets.",
        durationSeconds: 30,
      },
      {
        title: "30% Hold x 90 Seconds (3 Sets)",
        instruction:
          "Engage Mula Bandha at 30% effort and hold continuously for 90 seconds. Breathe normally throughout. Rest 30 seconds between sets. Complete 3 sets. If the muscle fatigues, soften slightly rather than releasing fully.",
        durationSeconds: 360,
      },
      {
        title: "60% Hold x 30 Seconds (5 Sets)",
        instruction:
          "Increase engagement to 60% effort and hold for 30 seconds. Rest 15 seconds between sets. Complete 5 sets. Maintain clean engagement — if you feel the glutes or abs engaging, reduce effort slightly.",
        durationSeconds: 225,
      },
      {
        title: "Release & Restore",
        instruction:
          "Fully release the pelvic floor. Perform 5 slow reverse Kegels (5 seconds each) to relax the muscles. Shake out your legs and take 3 deep breaths.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 20: Awakening Complete — Milestone ─────────────────────

  {
    slug: "tier-2-assessment",
    title: "Tier 2 Assessment",
    description:
      "Full comprehensive session integrating everything from Tier 2: Nadi Shodhana warmup, body scan, Mula Bandha activation, rhythmic edging with full toolkit deployment, and structured reflection. This is the gateway to Tier 3.",
    category: "physical",
    subcategory: "assessment",
    duration: "30 min",
    difficulty: "Intermediate",
    tier: 2,
    levelUnlock: 20,
    xpReward: 60,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Nadi Shodhana Warmup",
        instruction:
          "Begin with 3 minutes of alternate nostril breathing (Nadi Shodhana): close right nostril, inhale left for 4 seconds, close both and hold for 4 seconds, release right and exhale for 6 seconds, inhale right, hold, exhale left. This balances the nervous system.",
        durationSeconds: 180,
      },
      {
        title: "Body Scan",
        instruction:
          "Perform a thorough body scan from crown to toes. Release tension in the jaw, shoulders, belly, and pelvic floor. Arrive fully in your body with relaxed awareness.",
        durationSeconds: 180,
      },
      {
        title: "Mula Bandha Activation",
        instruction:
          "Perform 5 Mula Bandha holds at 50% for 10 seconds each. Then hold at 30% continuously for 60 seconds. Confirm your pelvic floor is awake and responsive.",
        durationSeconds: 150,
      },
      {
        title: "Rhythmic Edging with Full Toolkit",
        instruction:
          "Begin rhythmic stimulation and build to level 7. Maintain the 5-8 band using your complete toolkit: breath, Mula Bandha, visualization, speed variation. Complete 4 edge-descent cycles over 12 minutes. Use the observer narration to track each technique's effect.",
        durationSeconds: 720,
      },
      {
        title: "Sustained High-Arousal Hold",
        instruction:
          "For the final 5 minutes of stimulation, maintain arousal at 7-8 using only breath and Mula Bandha — no speed changes. This tests whether your internal tools alone can maintain control at high arousal.",
        durationSeconds: 300,
      },
      {
        title: "Reflection & Tier Review",
        instruction:
          "Stop stimulation and sit quietly. Reflect on your Tier 2 journey: What is your strongest tool? What needs more work? Rate your overall control confidence from 1-10. You are now ready for Tier 3: Mastery.",
        durationSeconds: 120,
      },
    ],
  },
];
