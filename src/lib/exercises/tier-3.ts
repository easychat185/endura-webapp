import type { Exercise } from "./data";

export const tier3Exercises: Exercise[] = [
  // ─── Level 21: Multi-Edge Foundation ───────────────────────────────

  {
    slug: "multi-edge-session",
    title: "Multi-Edge Session",
    description:
      "Target 5 edges to arousal level 7-8, bringing yourself down to 4-5 between each edge. Track how successive edges feel and whether control improves or degrades across repetitions.",
    category: "physical",
    subcategory: "edging",
    duration: "25 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 21,
    xpReward: 65,
    trackTags: ["PE"],
    prerequisites: ["endurance-edge"],
    steps: [
      {
        title: "Warm-Up & Intention",
        instruction:
          "Begin with 2 minutes of diaphragmatic breathing. Set the intention to complete 5 full edge cycles. Have a mental or written scorecard ready to note each edge.",
        durationSeconds: 120,
      },
      {
        title: "Build to First Edge",
        instruction:
          "Gradually increase stimulation until you reach arousal level 7-8. Take your time — this first edge establishes your baseline. Note how long it took to arrive.",
        durationSeconds: 300,
      },
      {
        title: "Descend & Recover",
        instruction:
          "Reduce stimulation and use breath control to bring arousal back down to level 4-5. Maintain light contact throughout. Observe how your body downshifts.",
        durationSeconds: 120,
      },
      {
        title: "Repeat Edges 2-4",
        instruction:
          "Cycle through three more edge-and-descend rounds. For each edge, note whether you reach 7-8 faster or slower, and whether the descent feels easier or harder than the previous one.",
        durationSeconds: 900,
      },
      {
        title: "Final Edge & Extended Hold",
        instruction:
          "On the fifth edge, hold arousal at 7-8 for as long as comfortable — aim for 60 seconds. Use breath and Mula Bandha as needed to stay in the zone without tipping over.",
        durationSeconds: 180,
      },
      {
        title: "Cool-Down & Reflection",
        instruction:
          "Bring arousal down to 2-3. Reflect on how each successive edge compared. Were later edges harder to control? Did your recovery time change? Log your observations.",
        durationSeconds: 120,
      },
    ],
  },
  {
    slug: "speed-escalation-drill",
    title: "Speed Escalation Drill",
    description:
      "Start at 1 stroke per 2 seconds and increase speed by 20% every 2 minutes. Reset to baseline when you hit arousal level 7. Note your speed ceiling — the fastest pace you can sustain without losing control.",
    category: "physical",
    subcategory: "edging",
    duration: "15 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 21,
    xpReward: 60,
    trackTags: ["PE"],
    steps: [
      {
        title: "Establish Base Tempo",
        instruction:
          "Begin at a slow, deliberate pace: one stroke every 2 seconds. Use a mental count or metronome. Focus on full, consistent strokes and settle into the rhythm for 2 minutes.",
        durationSeconds: 120,
      },
      {
        title: "First Speed Increase",
        instruction:
          "Increase tempo by roughly 20%. You should feel a noticeable but manageable uptick in stimulation. Monitor your arousal level — stay aware of the 1-10 scale as you continue.",
        durationSeconds: 120,
      },
      {
        title: "Progressive Escalation",
        instruction:
          "Continue increasing speed by 20% every 2 minutes. Each bump should feel distinctly faster. The moment arousal reaches level 7, immediately reset to the original slow tempo.",
        durationSeconds: 360,
      },
      {
        title: "Reset & Observe",
        instruction:
          "After resetting, stay at base tempo until arousal returns to level 4. Note which speed tier triggered the level 7 threshold — that is your current speed ceiling.",
        durationSeconds: 120,
      },
      {
        title: "Second Escalation Run",
        instruction:
          "Repeat the escalation cycle. See if you can push one tier further before hitting 7. Apply breath control and relaxation techniques to extend your ceiling.",
        durationSeconds: 180,
      },
    ],
  },

  // ─── Level 22: Deceleration Mastery ────────────────────────────────

  {
    slug: "timed-deceleration",
    title: "Timed Deceleration Challenge",
    description:
      "Edge to arousal level 8, then use breath, Mula Bandha, and visualization simultaneously to bring arousal back to level 5 as fast as possible — while maintaining light stimulation. Time each descent. Target: under 60 seconds.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 22,
    xpReward: 70,
    trackTags: ["PE"],
    prerequisites: ["multi-edge-session"],
    steps: [
      {
        title: "Warm-Up Build",
        instruction:
          "Spend 3 minutes gradually building arousal using steady stimulation. Establish your breathing rhythm and engage awareness of your arousal scale.",
        durationSeconds: 180,
      },
      {
        title: "Edge to Level 8",
        instruction:
          "Increase stimulation until you clearly reach arousal level 8 — the point where climax feels close but not inevitable. Start your timer the moment you arrive.",
        durationSeconds: 180,
      },
      {
        title: "Triple-Tool Descent",
        instruction:
          "Immediately deploy all three tools: slow diaphragmatic exhale, firm Mula Bandha engagement, and a calming visualization (e.g., cool water). Keep light stimulation going — do NOT stop contact entirely. Time how long it takes to reach level 5.",
        durationSeconds: 120,
      },
      {
        title: "Repeat Cycles",
        instruction:
          "Re-build to level 8 and repeat the timed descent 3-4 more times. Record each descent time. Look for improvement across repetitions — your target is under 60 seconds.",
        durationSeconds: 600,
      },
      {
        title: "Final Attempt & Logging",
        instruction:
          "On your final attempt, give maximum effort to beat your fastest time. Log all descent times and note which tool combination felt most effective.",
        durationSeconds: 180,
      },
    ],
  },
  {
    slug: "single-tool-deceleration",
    title: "Single-Tool Deceleration Testing",
    description:
      "Test each deceleration tool in isolation at arousal level 7: breath only, Mula Bandha only, visualization only, and reverse Kegel only. Rank their individual effectiveness for your body.",
    category: "physical",
    subcategory: "edging",
    duration: "15 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 22,
    xpReward: 65,
    trackTags: ["PE"],
    steps: [
      {
        title: "Build to Level 7 — Breath Test",
        instruction:
          "Build arousal to level 7. Use ONLY slow diaphragmatic breathing to bring it down. No Kegels, no visualization. Note how many breaths and how many seconds it takes to reach level 5.",
        durationSeconds: 180,
      },
      {
        title: "Build to Level 7 — Mula Bandha Test",
        instruction:
          "Rebuild to level 7. This time use ONLY Mula Bandha engagement (pelvic floor squeeze and hold). Continue light stimulation. Time the descent to level 5.",
        durationSeconds: 180,
      },
      {
        title: "Build to Level 7 — Visualization Test",
        instruction:
          "Rebuild to level 7. Use ONLY a calming visualization — a non-sexual mental image that absorbs attention. Keep breathing natural. Time the descent.",
        durationSeconds: 180,
      },
      {
        title: "Build to Level 7 — Reverse Kegel Test",
        instruction:
          "Rebuild to level 7. Use ONLY a reverse Kegel (bearing down gently, relaxing the pelvic floor). This is the opposite of Mula Bandha. Time the descent to level 5.",
        durationSeconds: 180,
      },
      {
        title: "Rank & Record",
        instruction:
          "Compare all four descent times. Rank the tools from most to least effective for your body. This personal ranking will guide your technique stacking priorities in later exercises.",
        durationSeconds: 120,
      },
    ],
  },
  {
    slug: "arousal-acceptance",
    title: "Arousal Acceptance (ED Complementary)",
    description:
      "Practice non-reactive acceptance of erection fluctuations. When anxiety arises around erectile changes, use sigh breathing to stay present instead of grasping or forcing. Builds a relaxed, pressure-free relationship with arousal.",
    category: "somatic",
    duration: "10 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 22,
    xpReward: 50,
    trackTags: ["ED", "Mindfulness"],
    safetyNotes:
      "If erection difficulty is persistent, consult a physician.",
    steps: [
      {
        title: "Grounding & Body Scan",
        instruction:
          "Lie comfortably. Take 5 slow breaths. Scan from head to pelvis, noticing any tension or guarding — especially around the jaw, belly, and pelvic floor. Soften anything you find.",
        durationSeconds: 120,
      },
      {
        title: "Gentle Self-Touch",
        instruction:
          "Begin light, non-goal-oriented touch on the inner thighs and lower abdomen. There is no target — no erection required. Simply notice sensations without labeling them as good or bad.",
        durationSeconds: 120,
      },
      {
        title: "Observe Without Reacting",
        instruction:
          "If an erection arises, notice it without excitement or relief. If it fades, notice that too without disappointment. Practice treating both states as neutral physiological events.",
        durationSeconds: 120,
      },
      {
        title: "Sigh Breathing for Anxiety",
        instruction:
          "When you notice any anxiety, judgment, or frustration: inhale through the nose, then exhale with an audible sigh through the mouth. Let the sigh release the mental grip. Return to neutral observation.",
        durationSeconds: 120,
      },
      {
        title: "Integration",
        instruction:
          "Spend 2 minutes in stillness. Affirm that your body's arousal state is not a performance metric. Notice how your nervous system feels compared to the start of the exercise.",
        durationSeconds: 120,
      },
    ],
  },

  // ─── Level 23: Arousal Surfing ─────────────────────────────────────

  {
    slug: "plateau-surfing",
    title: "Plateau Surfing",
    description:
      "Reach arousal level 6 and maintain a narrow 6-7.5 band for 10 minutes using continuous micro-adjustments in grip, speed, and breath. No full stops allowed — this is about real-time modulation, not stop-start.",
    category: "physical",
    subcategory: "edging",
    duration: "25 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 23,
    xpReward: 70,
    trackTags: ["PE"],
    prerequisites: ["timed-deceleration"],
    steps: [
      {
        title: "Warm-Up & Calibration",
        instruction:
          "Build arousal gradually over 3 minutes. Calibrate your sense of the 1-10 scale, paying particular attention to the difference between 5, 6, and 7. Establish your breathing rhythm.",
        durationSeconds: 180,
      },
      {
        title: "Reach the Plateau Zone",
        instruction:
          "Continue building until you reach arousal level 6. This is your floor — you should not drop below it for the main phase. Adjust stimulation speed so you hover right at 6.",
        durationSeconds: 120,
      },
      {
        title: "Surf the 6-7.5 Band (First 5 Min)",
        instruction:
          "Maintain arousal between 6 and 7.5 using micro-adjustments only: slight speed changes, grip pressure shifts, breath depth. Do NOT stop stimulation. If you drift toward 7.5, ease off slightly; if you drift toward 6, speed up a fraction.",
        durationSeconds: 300,
      },
      {
        title: "Surf the 6-7.5 Band (Final 5 Min)",
        instruction:
          "Continue surfing for another 5 minutes. Fatigue and sensitization may make this harder. Stay focused. Use breath as your primary micro-adjustment lever.",
        durationSeconds: 300,
      },
      {
        title: "Controlled Descent",
        instruction:
          "Gradually bring arousal down to level 3-4 over 2 minutes. Do not rush. Reflect on how consistently you stayed within the band. Note any moments you drifted outside it.",
        durationSeconds: 120,
      },
      {
        title: "Debrief",
        instruction:
          "Log the session: estimated time within the 6-7.5 band, number of times you drifted out, and which micro-adjustment tool was most useful for real-time modulation.",
        durationSeconds: 60,
      },
    ],
  },
  {
    slug: "high-zone-surfing",
    title: "High Zone Surfing",
    description:
      "Reach arousal level 7 and maintain a tight 7-8 band for 5 minutes with continuous stimulation. The margin for error is very small — deploy all available tools simultaneously to stay in the zone without tipping over.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 23,
    xpReward: 75,
    trackTags: ["PE"],
    prerequisites: ["plateau-surfing"],
    steps: [
      {
        title: "Foundation Build",
        instruction:
          "Build arousal steadily to level 6 over 3-4 minutes. Establish your breath rhythm and lightly engage Mula Bandha. Activate your calming visualization in the background.",
        durationSeconds: 240,
      },
      {
        title: "Enter the High Zone",
        instruction:
          "Push carefully from 6 to 7. Move slowly — the jump from 7 to 8+ can happen fast. Once you feel solidly at 7, begin the 5-minute clock.",
        durationSeconds: 120,
      },
      {
        title: "High-Zone Surf (Minutes 1-3)",
        instruction:
          "Maintain 7-8 with all tools engaged: controlled exhales, Mula Bandha pulsing, calming visualization, and precise grip/speed micro-adjustments. If you touch 8, ease speed and deepen your exhale immediately.",
        durationSeconds: 180,
      },
      {
        title: "High-Zone Surf (Minutes 3-5)",
        instruction:
          "The final 2 minutes are the hardest as sensitization peaks. Stay hyper-aware. Use reverse Kegel if you sense the point of no return approaching. Keep stimulation continuous — no full stops.",
        durationSeconds: 120,
      },
      {
        title: "Descent & Recovery",
        instruction:
          "Bring arousal down to level 4 using your fastest deceleration combination. Take 2 minutes to breathe and let your nervous system settle.",
        durationSeconds: 180,
      },
      {
        title: "Assessment",
        instruction:
          "How long did you actually sustain the 7-8 range? Log the time. Note whether you slipped above 8 or dropped below 7, and what triggered it.",
        durationSeconds: 60,
      },
    ],
  },
  {
    slug: "mula-bandha-pulsing",
    title: "Mula Bandha Pulsing",
    description:
      "Rhythmic squeeze-and-release of the pelvic floor at 1 second each, synchronized with breath rate. Practice for 2 minutes, then reverse the pattern (release on inhale, squeeze on exhale) for 2 minutes.",
    category: "physical",
    subcategory: "bandha",
    duration: "6 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 23,
    xpReward: 50,
    trackTags: ["PE", "Tantric"],
    prerequisites: ["mula-bandha-endurance"],
    steps: [
      {
        title: "Centering Breath",
        instruction:
          "Sit comfortably with a straight spine. Take 30 seconds of slow, even breathing. Bring awareness to your pelvic floor — feel the space between sit bones without engaging yet.",
        durationSeconds: 30,
      },
      {
        title: "Standard Pattern (Squeeze on Exhale)",
        instruction:
          "Squeeze Mula Bandha for 1 second on each exhale, release for 1 second on each inhale. Match the pulsing exactly to your breath rate. Maintain steady rhythm for 2 minutes. Keep upper body relaxed.",
        durationSeconds: 120,
      },
      {
        title: "Transition Pause",
        instruction:
          "Take 3 natural breaths with no pelvic engagement. Shake out the hips gently if needed. Prepare to reverse the pattern.",
        durationSeconds: 20,
      },
      {
        title: "Reverse Pattern (Squeeze on Inhale)",
        instruction:
          "Now squeeze Mula Bandha on each inhale, release on each exhale — the opposite of the standard pattern. This requires more coordination. Maintain for 2 minutes. Notice how this feels different energetically.",
        durationSeconds: 120,
      },
      {
        title: "Integration & Rest",
        instruction:
          "Release all engagement. Sit quietly for 30 seconds. Notice any warmth, pulsing, or energy movement in the pelvic region. Compare the two patterns — which felt more natural, which was harder to coordinate.",
        durationSeconds: 30,
      },
    ],
  },

  // ─── Level 24: Control Under Pressure ──────────────────────────────

  {
    slug: "pressure-tested-edging",
    title: "Pressure-Tested Edging",
    description:
      "Edging against a structured timer with 5-minute interval targets: build to level 6, edge to 7, high-zone surf, then bring arousal down to 3. Time pressure adds a realistic performance dimension to your control practice.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 24,
    xpReward: 70,
    trackTags: ["PE"],
    prerequisites: ["high-zone-surfing"],
    steps: [
      {
        title: "Interval 1 — Build to 6",
        instruction:
          "Start your timer. You have exactly 5 minutes to build arousal from baseline to level 6. Pace yourself — arriving too early means waiting at 6 which wastes the interval; arriving late means you are behind schedule.",
        durationSeconds: 300,
      },
      {
        title: "Interval 2 — Edge to 7",
        instruction:
          "At the 5-minute mark, push from 6 to 7 and hold an edge. Touch 7-8 at least twice during this interval. Practice ascending and slightly descending within the high zone. Stay in the 6.5-8 range.",
        durationSeconds: 300,
      },
      {
        title: "Interval 3 — High-Zone Surf",
        instruction:
          "At 10 minutes, commit to surfing 7-8 for the full 5-minute interval. Use all tools. The timer adds psychological pressure — notice how the urgency affects your control and breathe through it.",
        durationSeconds: 300,
      },
      {
        title: "Interval 4 — Descend to 3",
        instruction:
          "At 15 minutes, bring arousal all the way down to level 3 within 5 minutes. Use your fastest deceleration tools. The goal is efficient, calm descent — not panic braking.",
        durationSeconds: 300,
      },
      {
        title: "Debrief",
        instruction:
          "Did you hit each interval target on time? Log which intervals were hardest. Note whether the time pressure helped focus you or made control harder. This mirrors real-world performance pressure.",
        durationSeconds: 60,
      },
    ],
  },
  {
    slug: "distraction-tolerance",
    title: "Distraction Tolerance",
    description:
      "Practice edging while introducing intentional distractions: position changes, ambient noise, and intrusive thought simulation. Builds the ability to maintain arousal control when conditions are not perfect.",
    category: "physical",
    subcategory: "edging",
    duration: "15 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 24,
    xpReward: 65,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Baseline Edging",
        instruction:
          "Build to arousal level 6-7 in your most comfortable position. Establish stable control. This is your baseline — note how much attention your control techniques require.",
        durationSeconds: 180,
      },
      {
        title: "Position Change Distraction",
        instruction:
          "While maintaining stimulation, change your position (sit to standing, or switch hands, or shift body angle). Notice how the disruption affects your arousal level and control. Re-stabilize.",
        durationSeconds: 180,
      },
      {
        title: "Auditory Distraction",
        instruction:
          "Play distracting audio — music, a podcast, or ambient noise. Continue edging in the 6-7.5 range. Practice splitting attention between the audio and your arousal monitoring without losing control.",
        durationSeconds: 180,
      },
      {
        title: "Intrusive Thought Simulation",
        instruction:
          "Deliberately think about a stressful scenario — a work deadline, an awkward conversation. Notice how your arousal responds to the mental shift. Practice returning focus to the body without fully losing the arousal thread.",
        durationSeconds: 180,
      },
      {
        title: "Combined Distractions",
        instruction:
          "Layer two or more distractions simultaneously while maintaining the 6-7.5 band. This simulates real partnered conditions where environment and thoughts are unpredictable.",
        durationSeconds: 120,
      },
      {
        title: "Cool-Down & Reflection",
        instruction:
          "Descend to level 3. Reflect on which distraction type was hardest to manage. Understanding your vulnerabilities helps you prepare for real-world scenarios.",
        durationSeconds: 60,
      },
    ],
  },
  {
    slug: "arousal-amplification",
    title: "Arousal Amplification (DE Complementary)",
    description:
      "Focus on the most pleasurable sensation, allow breath to quicken, and visualize an arousing scenario. Designed for those with delayed ejaculation patterns who need practice amplifying rather than dampening arousal signals.",
    category: "somatic",
    duration: "10 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 24,
    xpReward: 50,
    trackTags: ["DE", "Mindfulness"],
    safetyNotes: "For those with delayed ejaculation patterns.",
    steps: [
      {
        title: "Sensory Narrowing",
        instruction:
          "Begin with gentle self-touch. Instead of scanning broadly, narrow your attention to the single most pleasurable point of contact. Zoom your awareness into that exact spot.",
        durationSeconds: 120,
      },
      {
        title: "Breath Amplification",
        instruction:
          "Allow your breathing to quicken naturally. Do not force slow breaths — instead, let the breath match or slightly lead your arousal. Short, warm exhales through the mouth can intensify sensation.",
        durationSeconds: 120,
      },
      {
        title: "Mental Arousal Layering",
        instruction:
          "Add a vivid, arousing mental scenario. Engage as many imagined senses as possible — visual, auditory, tactile. Let the fantasy amplify what your body is feeling rather than replacing it.",
        durationSeconds: 120,
      },
      {
        title: "Pleasure Permission",
        instruction:
          "Actively give yourself permission to feel more. Notice any habitual braking — tension in the pelvic floor, breath holding, mental distancing. When you catch these patterns, consciously release them.",
        durationSeconds: 120,
      },
      {
        title: "Integration",
        instruction:
          "Return to calm breathing. Reflect on which amplification tool moved the needle most. Note any resistance patterns you discovered — these are targets for future sessions.",
        durationSeconds: 120,
      },
    ],
  },

  // ─── Level 25: Quarter Mark — Milestone ────────────────────────────

  {
    slug: "quarter-assessment",
    title: "Quarter Assessment",
    description:
      "Comprehensive mid-program assessment combining breathwork warmup, body scan, pelvic floor engagement, multi-edge edging, arousal surfing, and breath-only descent. Compare results against your Level 20 baselines.",
    category: "physical",
    subcategory: "assessment",
    duration: "35 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 25,
    xpReward: 80,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Nadi Shodhana Warm-Up",
        instruction:
          "Perform 3 minutes of alternate-nostril breathing (Nadi Shodhana). Left nostril inhale, right nostril exhale, right nostril inhale, left nostril exhale. This balances the nervous system and centers focus.",
        durationSeconds: 180,
      },
      {
        title: "Pelvic Focus Body Scan",
        instruction:
          "Scan from feet to crown, spending extra time on the pelvic region. Note tension, numbness, warmth, or pulsing. Rate your pelvic awareness on a 1-10 scale and compare to your earlier assessments.",
        durationSeconds: 180,
      },
      {
        title: "Mula Bandha & Kegel Sets",
        instruction:
          "Perform: 10 quick Kegel pulses (1sec each), 5 Mula Bandha holds (5sec each), 5 reverse Kegels (5sec each). Assess strength and coordination compared to your Level 20 benchmark.",
        durationSeconds: 240,
      },
      {
        title: "Multi-Edge Phase (5 Edges)",
        instruction:
          "Complete 5 edge cycles to level 7+. Time each ascent and descent. Log all times. Compare your average ascent and descent times to earlier multi-edge sessions.",
        durationSeconds: 600,
      },
      {
        title: "Arousal Surfing Phase",
        instruction:
          "Surf the 6-7.5 arousal band for 5 continuous minutes. No full stops. Log estimated time actually within the band. Compare to your first plateau surfing attempt.",
        durationSeconds: 300,
      },
      {
        title: "Breath-Only Descent & Final Assessment",
        instruction:
          "From level 7, descend using ONLY breath — no Kegels, no visualization. Time the descent to level 4. Log all benchmark numbers. Write a brief comparison to your Level 20 assessment noting improvements and areas to develop.",
        durationSeconds: 300,
      },
    ],
  },

  // ─── Level 26: Technique Stacking ──────────────────────────────────

  {
    slug: "technique-stacking",
    title: "Technique Stacking",
    description:
      "Layer breath control, Mula Bandha, and visualization simultaneously during active edging. The goal is to maintain all three techniques as a unified stack for 5+ continuous minutes while staying in the 6-8 arousal range.",
    category: "physical",
    subcategory: "edging",
    duration: "25 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 26,
    xpReward: 70,
    trackTags: ["PE", "Tantric"],
    prerequisites: ["quarter-assessment"],
    steps: [
      {
        title: "Individual Tool Activation",
        instruction:
          "Spend 1 minute on each tool separately: (1) slow diaphragmatic breathing, (2) Mula Bandha pulsing synced to breath, (3) calming visualization. Confirm each feels accessible before combining.",
        durationSeconds: 180,
      },
      {
        title: "Two-Tool Stacking",
        instruction:
          "Combine breath + Mula Bandha first while building arousal to level 5. Once stable, swap to breath + visualization. Then Mula Bandha + visualization. Each pair for 2 minutes. Notice which pair is easiest to maintain.",
        durationSeconds: 360,
      },
      {
        title: "Full Three-Tool Stack",
        instruction:
          "Activate all three tools simultaneously: rhythmic breath, Mula Bandha pulsing on exhale, calming visualization running in the background. Build to arousal level 6-7.",
        durationSeconds: 180,
      },
      {
        title: "Sustained Stacking Under Load",
        instruction:
          "Maintain the full 3-technique stack while edging in the 6-8 range for 5 minutes. If you drop a tool, re-engage it without stopping. Count how many times you lose and re-engage a tool.",
        durationSeconds: 300,
      },
      {
        title: "Stack Stress Test",
        instruction:
          "Push to arousal level 8 and attempt to hold the full stack while decelerating. The stack should function as your primary control mechanism. Note how quickly you can descend with all three engaged versus your single-tool times.",
        durationSeconds: 240,
      },
      {
        title: "Cool-Down & Logging",
        instruction:
          "Descend to level 3. Log: total time with all three tools active, number of tool drops, and your descent time from 8 to 5 with the full stack.",
        durationSeconds: 120,
      },
    ],
  },

  // ─── Level 27: Variable Intensity ──────────────────────────────────

  {
    slug: "variable-intensity-drill",
    title: "Variable Intensity Drill",
    description:
      "Practice arousal control across three grip/pressure levels: light (level 2), medium (level 5), and firm (level 7). Discover how intensity affects your arousal acceleration and which pressure zones challenge your control the most.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 27,
    xpReward: 65,
    trackTags: ["PE"],
    steps: [
      {
        title: "Light Pressure Phase",
        instruction:
          "Use very light grip/pressure (level 2 out of 10). Build arousal as high as you can within 4 minutes. Note your maximum arousal level at this pressure and how long it took to get there. This establishes your low-intensity baseline.",
        durationSeconds: 240,
      },
      {
        title: "Reset",
        instruction:
          "Bring arousal back to level 2-3 using breath. Take 1 minute to fully reset before the next phase.",
        durationSeconds: 60,
      },
      {
        title: "Medium Pressure Phase",
        instruction:
          "Use moderate grip/pressure (level 5). Build arousal and practice edging in the 6-7.5 range. Note how much faster arousal rises compared to light pressure. Maintain for 4 minutes.",
        durationSeconds: 240,
      },
      {
        title: "Reset & Transition",
        instruction:
          "Descend to level 2-3 again. Take a minute to prepare for firm pressure — engage your breath pattern and Mula Bandha preemptively.",
        durationSeconds: 60,
      },
      {
        title: "Firm Pressure Phase",
        instruction:
          "Use firm grip/pressure (level 7). Arousal will climb fast. Edge in the 6-8 range using all control tools. Note how much less reaction time you have compared to lighter pressures. Practice for 4 minutes.",
        durationSeconds: 240,
      },
      {
        title: "Comparison & Insights",
        instruction:
          "Descend and rest. Compare the three phases: arousal acceleration at each pressure, control difficulty, and which tools worked best at each level. Log your findings — this data informs your partnered practice strategy.",
        durationSeconds: 120,
      },
    ],
  },

  // ─── Level 28: Recovery Acceleration ───────────────────────────────

  {
    slug: "recovery-acceleration",
    title: "Recovery Acceleration",
    description:
      "Edge to arousal level 7, descend to 4 within 30 seconds, then return to 7 within 60 seconds. Repeat this yo-yo cycle 5 times. Trains rapid recovery and re-engagement — critical for real-world endurance.",
    category: "physical",
    subcategory: "edging",
    duration: "20 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 28,
    xpReward: 70,
    trackTags: ["PE"],
    prerequisites: ["technique-stacking"],
    steps: [
      {
        title: "Warm-Up Build",
        instruction:
          "Spend 3 minutes building to arousal level 6. Establish your breath and Mula Bandha rhythm. Prepare mentally for rapid alternations.",
        durationSeconds: 180,
      },
      {
        title: "First Yo-Yo Cycle",
        instruction:
          "Push to level 7. Start your timer and descend to level 4 in 30 seconds or less using full technique stack. Then rebuild to 7 within 60 seconds. This is one complete cycle.",
        durationSeconds: 120,
      },
      {
        title: "Cycles 2 & 3",
        instruction:
          "Immediately begin cycle 2: descend from 7 to 4 (30sec target), rebuild to 7 (60sec target). Repeat for cycle 3. Notice whether recovery gets harder with each repetition. Adjust technique application as needed.",
        durationSeconds: 240,
      },
      {
        title: "Cycles 4 & 5",
        instruction:
          "Final two cycles. Fatigue and sensitization may make the 30-second descent harder. Dig deep with breath and Mula Bandha. On the fifth cycle, attempt your fastest descent yet.",
        durationSeconds: 240,
      },
      {
        title: "Cool-Down",
        instruction:
          "After the fifth cycle, bring arousal down to level 2-3 and rest for 2 minutes. Relax the pelvic floor completely.",
        durationSeconds: 120,
      },
      {
        title: "Performance Log",
        instruction:
          "Record all 5 descent times and 5 rebuild times. Note trends across cycles. Were later cycles harder? Did your descent time increase with fatigue? This data tracks your recovery conditioning over weeks.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 29: Stamina Session ─────────────────────────────────────

  {
    slug: "stamina-session",
    title: "Stamina Session",
    description:
      "30 minutes of continuous edging in the 5-8 arousal range. Tests both physical and mental endurance. The challenge is maintaining focus, technique, and control over an extended period without losing engagement or tipping over.",
    category: "physical",
    subcategory: "edging",
    duration: "30 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 29,
    xpReward: 75,
    trackTags: ["PE"],
    prerequisites: ["recovery-acceleration"],
    steps: [
      {
        title: "Extended Warm-Up",
        instruction:
          "Spend 3 minutes with breath work and light touch. Set a timer for 30 minutes. Mentally commit to the full duration. Build arousal gradually to level 5.",
        durationSeconds: 180,
      },
      {
        title: "Phase 1: Cruising (Minutes 3-10)",
        instruction:
          "Maintain arousal in the 5-6.5 range for 7 minutes. This is your cruising altitude. Use moderate stimulation and stay relaxed. The goal is sustainable, enjoyable engagement without pushing too high too early.",
        durationSeconds: 420,
      },
      {
        title: "Phase 2: Challenging (Minutes 10-20)",
        instruction:
          "Shift into the 6-7.5 range for 10 minutes. This is the work zone. Use technique stacking as needed. You will likely experience waves of fatigue and re-sensitization — surf through them without stopping.",
        durationSeconds: 600,
      },
      {
        title: "Phase 3: Peak (Minutes 20-27)",
        instruction:
          "Push into the 7-8 range for 7 minutes. This is the mental endurance test. Your body and mind will want to either finish or quit. Use every tool in your arsenal to stay in the band without tipping.",
        durationSeconds: 420,
      },
      {
        title: "Controlled Descent (Minutes 27-30)",
        instruction:
          "Bring arousal smoothly from wherever you are down to level 3. Take the full 3 minutes. Practice the gentlest, most controlled descent you can manage.",
        durationSeconds: 180,
      },
      {
        title: "Endurance Debrief",
        instruction:
          "Record total session time, the range you actually maintained, any moments you nearly lost control, and your mental state throughout. How did minute 25 feel compared to minute 5? This reflection builds self-knowledge.",
        durationSeconds: 60,
      },
    ],
  },
  {
    slug: "uddiyana-bandha-intro",
    title: "Uddiyana Bandha Introduction",
    description:
      "Introduction to the abdominal lock (Uddiyana Bandha): exhale fully, draw the navel toward the spine, hold for 5 seconds, and release on the inhale. 10 repetitions. Builds core-pelvic coordination for advanced energy work.",
    category: "physical",
    subcategory: "bandha",
    duration: "8 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 29,
    xpReward: 50,
    trackTags: ["PE", "Tantric"],
    steps: [
      {
        title: "Posture Setup",
        instruction:
          "Stand with feet hip-width apart, knees slightly bent, hands on thighs. Alternatively, sit upright with a straight spine. Take 5 natural breaths to settle in.",
        durationSeconds: 30,
      },
      {
        title: "Empty Exhale Practice",
        instruction:
          "Exhale fully through the mouth until your lungs feel completely empty. Practice this empty exhale 3 times without adding the abdominal lock — just get comfortable with the full emptying sensation.",
        durationSeconds: 60,
      },
      {
        title: "Uddiyana Bandha — First 5 Reps",
        instruction:
          "Exhale completely. With lungs empty, draw your navel inward and upward toward the spine. You should feel the abdomen hollow and lift. Hold for 5 seconds. Release the lock and inhale slowly. Rest 2 breaths. Repeat 5 times.",
        durationSeconds: 150,
      },
      {
        title: "Uddiyana Bandha — Final 5 Reps",
        instruction:
          "Continue with 5 more repetitions. Focus on a smooth, controlled engagement rather than forcing the lock deeply. The sensation should be firm but not straining. Notice any connection to the pelvic floor.",
        durationSeconds: 150,
      },
      {
        title: "Integration & Rest",
        instruction:
          "Stand or sit quietly for 1 minute. Breathe naturally. Notice sensations in the abdomen and pelvic region. Some warmth or tingling is normal. This bandha will combine with Mula Bandha in later exercises.",
        durationSeconds: 60,
      },
    ],
  },

  // ─── Level 30: Development Complete — Milestone ────────────────────

  {
    slug: "tier-3-assessment",
    title: "Tier 3 Assessment",
    description:
      "Comprehensive end-of-tier assessment covering all skills developed in Levels 21-30. Update all benchmarks and compare directly to your Level 20 results. This assessment determines readiness for Tier 4 (Mastery).",
    category: "physical",
    subcategory: "assessment",
    duration: "30 min",
    difficulty: "Intermediate",
    tier: 3,
    levelUnlock: 30,
    xpReward: 80,
    trackTags: ["PE", "Mindfulness"],
    steps: [
      {
        title: "Breathwork & Bandha Warm-Up",
        instruction:
          "3 minutes of Nadi Shodhana, followed by 5 Mula Bandha holds (5sec each) and 3 Uddiyana Bandha holds (5sec each). Rate your pelvic floor strength and breath control on a 1-10 scale.",
        durationSeconds: 300,
      },
      {
        title: "Multi-Edge Benchmark",
        instruction:
          "Complete 5 edge cycles to level 7+. Time each ascent and each descent. Calculate your averages and compare to your Level 20 and Level 25 data. Note improvement trends.",
        durationSeconds: 420,
      },
      {
        title: "High-Zone Surfing Benchmark",
        instruction:
          "Surf the 7-8 zone for as long as possible with continuous stimulation. Time it precisely. Your target is 5+ minutes. Compare to your first high-zone surfing attempt.",
        durationSeconds: 360,
      },
      {
        title: "Recovery Acceleration Benchmark",
        instruction:
          "Perform 3 yo-yo cycles (7 to 4 in 30sec, rebuild to 7 in 60sec). Record all times. Compare to your Level 28 data. Faster recoveries indicate improved nervous system regulation.",
        durationSeconds: 300,
      },
      {
        title: "Technique Stack Assessment",
        instruction:
          "From level 7, descend using the full 3-tool stack (breath + Mula Bandha + visualization). Time the descent to level 4. Compare to your single-tool times from Level 22. The stack should be significantly faster.",
        durationSeconds: 180,
      },
      {
        title: "Final Benchmark Comparison & Tier Completion",
        instruction:
          "Log all results. Write a comparison summary: Level 20 vs Level 25 vs Level 30. Key metrics: edge count, average descent time, surfing duration, recovery speed. Celebrate your progress and note focus areas for Tier 4.",
        durationSeconds: 180,
      },
    ],
  },
];
