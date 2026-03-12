import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { pdfToPng } from "pdf-to-png-converter";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const levels = [
  {
    number: 1,
    title: "First Breath",
    description:
      "Everything starts with awareness. Before you can control arousal, you need to feel your body — your breath, your pelvic floor, your nervous system. Level 1 introduces the three pillars you'll build on for the entire program: diaphragmatic breathing to activate your calm-down system, pelvic floor discovery to find the muscles that control ejaculation, and basic meditation to train the focused attention you'll need under pressure. None of these are difficult, but they must become second nature.",
    exercises: [
      {
        number: 1,
        name: "Basic Belly Breathing",
        duration: "5 min",
        xp: 30,
        why: "Activates the parasympathetic nervous system. Shallow chest breathing triggers fight-or-flight which accelerates arousal and kills control. This is the single most important skill.",
        steps: [
          "Get Into Position (30s) — Lie on your back on a comfortable surface. Bend your knees with feet flat on the floor. Place your left hand on your upper chest and your right hand on your belly, just below your rib cage.",
          "Find Your Natural Breath (30s) — Without changing anything, simply notice which hand rises when you breathe. Most people breathe into the chest. Your goal is to make the belly hand rise while the chest hand stays still.",
          "Belly Breathing Practice (3 min) — Inhale slowly through your nose for 3 seconds, directing the air down into your belly. Feel your right hand rise. Your left hand on your chest should barely move. Exhale slowly through pursed lips for 4 seconds, feeling your belly fall.",
          "Deepen the Rhythm (60s) — Continue the 3-count inhale, 4-count exhale pattern. If your mind wanders, gently return focus to the sensation of your belly rising and falling. Try to make each breath smooth and continuous.",
        ],
      },
      {
        number: 2,
        name: "Pelvic Floor Discovery",
        duration: "3 min",
        xp: 30,
        why: "You can't control muscles you can't feel. The PC muscle is the key to ejaculatory control and stronger erections — this is the prerequisite for everything that follows.",
        steps: [
          "Locate the PC Muscle (30s) — Sit or lie comfortably. Imagine you are urinating and then try to stop the flow mid-stream. The muscle you squeeze to do this is your PC muscle. You should feel a lifting sensation in the area between your scrotum and anus.",
          "Isolate the Contraction (30s) — Try squeezing only the PC muscle without tightening your abs, glutes, or thighs. Place a hand on your lower belly to confirm it stays relaxed. Breathe normally throughout. This isolation is essential.",
          "Gentle Squeeze Series (25s) — Perform 5 gentle squeezes. Squeeze for 2 seconds, then release for 3 seconds. Focus on the sensation of engaging and releasing. Use about 50% effort; this is about awareness, not strength.",
          "Rest and Reflect (30s) — Relax completely. Notice any residual tension in the pelvic area and let it go. Take 3 slow breaths. You have just made your first connection with one of the most important muscles for sexual health.",
        ],
      },
      {
        number: 3,
        name: "Settling Meditation",
        duration: "5 min",
        xp: 30,
        why: 'Trains the ability to shift from "doing" to "sensing" mode — essential for noticing arousal cues before they pass the point of no return.',
        steps: [
          "Settle In (30s) — Sit comfortably or lie on your back. Close your eyes. Take 3 deep breaths, exhaling fully each time. Let your breathing return to its natural pace.",
          "Begin Counting (2 min) — Start counting each exhale: 1 on the first exhale, 2 on the second, and so on up to 10. When you reach 10, start over at 1. If you lose count, simply return to 1 without judgment.",
          "Deepen Your Focus (2 min) — Continue counting breaths from 1 to 10. Each time your mind wanders, notice what pulled your attention away, then gently return to the count. The noticing is the practice; wandering is not failure.",
          "Close the Session (30s) — Release the counting. Sit with eyes closed for a few moments. Notice how your body feels compared to when you started. Gently open your eyes.",
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Body Basics",
    description:
      'Now that you can find your breath and your pelvic floor, Level 2 turns those discoveries into structured skills. You\'ll learn the 4-7-8 breathing pattern — your most powerful "brake pedal" during arousal — and your first real Kegel workout combining quick pulses and sustained holds. You\'ll also build body awareness in both lying and standing positions, because awareness that only works lying down won\'t help you during sex. This level is about making the basics reliable.',
    exercises: [
      {
        number: 4,
        name: "Diaphragmatic Breathing",
        duration: "8 min",
        xp: 35,
        why: 'The 4-7-8 pattern activates a strong parasympathetic response, directly slowing heart rate and arousal. This is your main "brake pedal" during intimacy.',
        steps: [
          "Settle and Center (40s) — Lie down or sit comfortably. Place one hand on your belly. Take 3 natural breaths, letting your body settle. Release any tension in your jaw, shoulders, and hands.",
          "Learn the 4-7-8 Pattern (30s) — Inhale through your nose for 4 seconds, filling your belly. Hold your breath gently for 7 seconds. Exhale slowly through your mouth for 8 seconds. Do one practice round to get the feel of the timing.",
          "Cycle 1–3 (3 min) — Perform 3 full 4-7-8 cycles. Inhale (4s), hold (7s), exhale (8s). Keep your body relaxed during the hold; do not tense up. If 7 seconds feels too long, hold for 5 seconds instead.",
          "Cycle 4–6 (3 min) — Continue for 3 more cycles. Try to make the exhale as smooth and slow as possible, like a thin stream of air. Notice how your body feels heavier and more relaxed with each cycle.",
          "Return to Natural Breath (50s) — Release the pattern and breathe naturally for 30 seconds. Notice the calm that has settled into your body. This is the state you will learn to access during arousal.",
        ],
      },
      {
        number: 5,
        name: "Basic Kegel Routine",
        duration: "5 min",
        xp: 35,
        why: 'Builds baseline pelvic floor strength. A strong PC muscle is what eventually lets you "lock" before ejaculation. Quick pulses build responsiveness, sustained holds build endurance.',
        steps: [
          "Warm-Up (30s) — Sit or lie comfortably. Take 3 deep breaths. Locate your PC muscle. Perform 3 very gentle contractions to warm up the area.",
          "Quick Pulses (30s) — Perform 10 quick pulse contractions: squeeze for 1 second, release for 1 second. Keep the contractions sharp and distinct. Breathe normally throughout; do not hold your breath.",
          "Rest (15s) — Relax completely for 15 seconds. Consciously release any residual tension in the pelvic floor.",
          "Sustained Holds (50s) — Perform 5 sustained holds: squeeze and hold for 5 seconds, then release fully for 5 seconds. Maintain a steady squeeze; do not let the contraction fade partway through. Keep abs and glutes relaxed.",
          "Final Rest and Cool-Down (30s) — Relax completely for 30 seconds. Take 3 slow breaths. Notice any sensations in the pelvic area. You are building the foundation of ejaculatory control.",
        ],
      },
      {
        number: 6,
        name: "Standing Body Check",
        duration: "3 min",
        xp: 30,
        why: "Body awareness while upright is closer to real sexual situations. Lying-down awareness alone doesn't transfer.",
        steps: [
          "Ground Your Feet (30s) — Stand with feet hip-width apart, arms at your sides. Close your eyes. Feel the contact between your feet and the floor. Notice the weight distribution: is it even left to right? Forward to back?",
          "Scan Upward (90s) — Slowly move your attention up through your body: ankles, calves, knees, thighs, pelvis, belly, chest, shoulders, neck, face, and crown of the head. At each area, simply notice whatever is there without trying to change it.",
          "Release and Reset (40s) — Take 3 slow breaths. On each exhale, consciously soften any tension you noticed. Drop your shoulders. Unclench your jaw. Let your belly be soft. Open your eyes slowly.",
        ],
      },
      {
        number: 7,
        name: "Guided Body Scan",
        duration: "10 min",
        xp: 40,
        why: "Builds interoception — the ability to sense internal states — which directly improves your ability to read arousal levels accurately.",
        steps: [
          "Preparation (45s) — Lie on your back with arms at your sides, palms up. Close your eyes. Take 5 slow, deep breaths. With each exhale, let your body sink a little deeper into the surface beneath you.",
          "Feet and Legs (2 min) — Bring your attention to the soles of your feet. Notice any tingling, warmth, pressure, or numbness. Move to your ankles, calves, shins, knees, and thighs. Spend about 15 seconds on each area, just noticing.",
          "Pelvis and Torso (2 min) — Move your attention to your pelvis and groin area. Notice any tension. Continue upward through your lower belly, upper belly, lower back, and chest. Notice your breathing as you scan the torso.",
          "Arms, Shoulders, and Neck (2 min) — Scan from your fingertips up through your hands, wrists, forearms, upper arms, and shoulders. Then move to your neck and throat. Let each area soften as you notice it.",
          "Head and Face (90s) — Bring attention to your jaw, mouth, cheeks, nose, eyes, forehead, and the top of your head. The face often holds hidden tension. Let each area relax completely.",
          "Whole Body Integration (60s) — Expand your awareness to hold your entire body at once. Feel yourself as a complete, breathing whole. Rest here for a few moments, then gently wiggle your fingers and toes and open your eyes.",
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Tension Mapping",
    description:
      "Most men don't realize they're tensing their legs, glutes, and abs during arousal — and that unconscious tension is one of the biggest accelerators of ejaculation. Level 3 teaches you to detect and release tension through Progressive Muscle Relaxation, where you deliberately tense and release every muscle group to learn the contrast. You'll also advance your Kegel work with longer holds and your first reverse Kegels — learning to relax the pelvic floor on command, which is just as important as learning to squeeze it.",
    exercises: [
      {
        number: 8,
        name: "Progressive Muscle Relaxation",
        duration: "12 min",
        xp: 40,
        why: "Most men unconsciously tense legs, glutes, and abs during arousal, which accelerates ejaculation. This teaches you to spot and release that tension by learning the contrast.",
        steps: [
          "Preparation (30s) — Lie on your back in a comfortable position. Close your eyes. Take 3 deep breaths. You will tense each muscle group for 5 seconds, then release and rest for 10 seconds. Never tense to the point of pain.",
          "Feet, Calves, and Thighs (60s) — Curl your toes tightly for 5 seconds, then release for 10 seconds. Next, flex your calves by pointing your toes toward your shins, hold 5 seconds, release 10 seconds. Finally, squeeze your thighs together hard for 5 seconds, release 10 seconds.",
          "Glutes and Pelvis (40s) — Squeeze your glutes tightly for 5 seconds, then release for 10 seconds. Next, engage your pelvic floor (Kegel) for 5 seconds, then release for 10 seconds. Notice the contrast between tension and deep relaxation in this area.",
          "Abdomen, Chest, and Back (60s) — Tighten your abdominal muscles as if bracing for a punch, hold 5 seconds, release 10 seconds. Squeeze your chest muscles by pressing your palms together in front of you, hold 5 seconds, release 10 seconds. Arch your back slightly, hold 5 seconds, release 10 seconds.",
          "Arms, Shoulders, and Hands (60s) — Make tight fists, hold 5 seconds, release 10 seconds. Flex your biceps, hold 5 seconds, release 10 seconds. Raise your shoulders to your ears, hold 5 seconds, release 10 seconds.",
          "Face and Full Release (90s) — Scrunch your entire face tightly, hold 5 seconds, release 10 seconds. Now scan your whole body. Notice the deep relaxation. Breathe slowly for 60 seconds, savoring this state. This is what full relaxation feels like.",
        ],
      },
      {
        number: 9,
        name: "Kegel Progression A",
        duration: "6 min",
        xp: 40,
        why: "Introduces reverse Kegels (bearing down) which train deliberate pelvic floor relaxation — critical for delaying ejaculation. Also adds longer holds for coordination.",
        steps: [
          "Warm-Up Pulses (30s) — Take 3 deep breaths. Perform 10 quick pulse contractions: squeeze 1 second, release 1 second. These pulses warm up the muscle and improve fast-twitch responsiveness.",
          "Sustained Holds (60s) — Perform 5 sustained holds: squeeze and hold for 7 seconds, then release fully for 5 seconds. Maintain steady pressure throughout the hold. Keep breathing normally.",
          "Rest (20s) — Relax completely for 20 seconds. Let all tension drain from the pelvic floor.",
          "Reverse Kegel Introduction (50s) — Instead of squeezing, gently bear down as if pushing air out. This is a reverse Kegel. It should feel like the opposite of a squeeze, a gentle opening and lengthening. Perform 5 reverse Kegels: push for 5 seconds, rest for 5 seconds.",
          "Cool-Down (30s) — Relax fully for 20 seconds. Take 3 slow breaths. Notice the difference between the squeeze (Kegel) and the release (reverse Kegel). Both directions of control are essential.",
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Breath Control",
    description:
      "Level 4 is where you start applying your skills to actual arousal. You'll extend your breathing capacity with combined 4-7-8 and box breathing sessions, synchronize your Kegel contractions with your breath rhythm so they work as one unit (critical under pressure), and learn the Start-Stop technique — the most evidence-backed clinical method for premature ejaculation. This is your first time deliberately stimulating yourself, recognizing a target arousal level, and choosing to stop. It's the beginning of real control.",
    exercises: [
      {
        number: 10,
        name: "Extended Breathing Practice",
        duration: "10 min",
        xp: 40,
        why: "Builds capacity to maintain controlled breathing for extended periods — necessary during longer intimate sessions. Combines 4-7-8 and box breathing.",
        steps: [
          "Settle In (40s) — Lie down or sit comfortably. Place one hand on your belly. Take 5 natural breaths, letting each one get a little slower and deeper.",
          "4-7-8 Breathing / 4 Cycles (3 min) — Perform 4 full cycles of 4-7-8 breathing: inhale through your nose for 4 seconds, hold for 7 seconds, exhale through your mouth for 8 seconds. Keep your body relaxed during the holds.",
          "Transition Breaths (30s) — Take 3 natural breaths to transition. Notice the calm state your body is in.",
          "Box Breathing / 6 Cycles (4 min) — Switch to box breathing: inhale 4 seconds, hold 4 seconds, exhale 4 seconds, hold empty 4 seconds. Repeat for 6 cycles. The equal timing creates a balanced, grounded state.",
          "Settle and Close (60s) — Release all patterns. Breathe naturally for 30 seconds. Notice how your heart rate and breathing have settled. This extended calm is the foundation for arousal control.",
        ],
      },
      {
        number: 11,
        name: "Coordinated Kegel-Breath",
        duration: "6 min",
        xp: 40,
        why: "Links breath and pelvic floor into one integrated skill. Trying to use them separately under arousal is too mentally taxing — they need to be automatic.",
        steps: [
          "Warm-Up (40s) — Take 5 deep breaths. Perform 5 gentle Kegel contractions to warm up. Then 3 gentle reverse Kegels. Get familiar with both directions.",
          "Squeeze on Inhale Pattern (130s) — Inhale for 4 seconds while squeezing your PC muscle. Hold your breath and hold the squeeze for 4 seconds. Exhale for 4 seconds while releasing the Kegel. Repeat for 10 reps.",
          "Release on Exhale Pattern (130s) — Now reverse the pattern: inhale for 4 seconds while relaxed. Hold your breath for 4 seconds while squeezing your PC muscle. Exhale for 4 seconds while performing a reverse Kegel (bearing down gently). Repeat for 10 reps.",
          "Cool-Down (40s) — Relax everything. Breathe naturally for 30 seconds. Notice how much more control you have when breath and Kegel work together. This coordination will become automatic with practice.",
        ],
      },
      {
        number: 12,
        name: "Start-Stop Technique Introduction",
        duration: "15 min",
        xp: 50,
        why: "The most evidence-backed behavioral technique for PE. Teaches you to recognize the approach to the point of no return and pause before crossing it.",
        steps: [
          "Preparation (60s) — Find a private, comfortable space. Set a timer for 15 minutes. Lie or sit comfortably. Take 5 slow, deep breaths using the 4-7-8 pattern. Let your body settle into a calm, relaxed state.",
          "Learn the Arousal Scale (30s) — Imagine a scale from 0 (no arousal) to 10 (orgasm). Level 1–3 is low arousal, 4–6 is moderate, 7–8 is high, and 9 is the point of no return. Today you will practice stopping at level 5, moderate arousal.",
          "Begin Slow Stimulation (3 min) — Begin self-stimulation with a slow, gentle pace. Focus entirely on the physical sensations. Keep breathing slowly and deeply. Continuously rate your arousal level on the 0–10 scale.",
          "First Stop (2 min) — When you reach arousal level 5, stop all stimulation completely. Remove your hand. Take 3 slow 4-7-8 breaths. Notice how arousal begins to subside. Wait until you drop to level 2–3.",
          "Resume and Repeat (6 min) — Resume stimulation. Again, approach level 5 and stop. Repeat this start-stop cycle 2–3 more times. Each cycle trains your brain to recognize the approach of arousal and apply the brakes.",
          "Close and Reflect (60s) — After completing your cycles, stop and let arousal subside fully. Take 5 slow breaths. Reflect on how well you could identify arousal levels. Did stopping become easier with practice?",
        ],
      },
    ],
  },
  {
    number: 5,
    title: "Pelvic Intelligence",
    description:
      "Your pelvic floor is not one muscle — it's a group of muscles that each play different roles. Level 5 teaches you to isolate and independently engage the PC (front), BC (middle), and anal sphincter (back), giving you surgical precision instead of a blunt squeeze. You'll also learn the Kegel Pyramid — graduated contractions at 25%, 50%, 75%, and 100% effort — because real control requires the right amount of force, not maximum force. Finally, you'll push your Start-Stop practice to higher arousal levels, narrowing your safety margin and sharpening your awareness.",
    exercises: [
      {
        number: 13,
        name: "Pelvic Floor Differentiation",
        duration: "8 min",
        xp: 45,
        why: "Isolates front (PC/urethral), middle (BC), and back (anal) pelvic floor. Over-gripping the wrong muscles increases tension and speeds up climax. Precise control is the goal.",
        steps: [
          "Warm-Up (40s) — Sit comfortably on a firm surface. Take 5 deep breaths. Perform 5 full Kegel contractions (squeezing everything) to warm up the area.",
          "Isolate the PC Muscle / Front (60s) — Focus on the muscle you would use to stop urine flow. This is the front portion of the pelvic floor. Try to squeeze only this area while keeping the anus relaxed. Perform 5 contractions, 5 seconds each, with 5 seconds rest between.",
          "Isolate the BC Muscle / Middle (60s) — The BC muscle wraps around the base of the penis. Try to squeeze as if pushing blood into the shaft. This is a subtle, deeper contraction. Perform 5 contractions, 5 seconds each, with 5 seconds rest between.",
          "Isolate the Anal Sphincter / Back (60s) — Now squeeze only the anus while keeping the front muscles relaxed. This is the easiest to isolate. Perform 5 contractions, 5 seconds each, with 5 seconds rest between.",
          "Front-to-Back Wave (2 min) — Try to squeeze from front to back in a wave: PC first, then BC, then anus. Then reverse: anus, BC, PC. Do 5 waves in each direction. This is challenging but builds exceptional control.",
          "Cool-Down (40s) — Relax fully. Perform 3 reverse Kegels to release all tension. Take 5 slow breaths. This differentiation work is advanced even though you are at an early stage. Be patient with yourself.",
        ],
      },
      {
        number: 14,
        name: "Kegel Pyramid",
        duration: "7 min",
        xp: 45,
        why: "Builds graduated control (25%/50%/75%/100%) rather than all-or-nothing clenching. During intercourse you need precisely the right amount of squeeze.",
        steps: [
          "Warm-Up (30s) — Take 5 deep breaths. Perform 5 quick Kegel pulses and 3 reverse Kegels to warm up. Find your maximum squeeze intensity for reference.",
          "Learn the Levels (40s) — Squeeze at 25% effort for 3 seconds, then 50% for 3 seconds, then 75% for 3 seconds, then 100% for 3 seconds. Now descend: 75% for 3 seconds, 50% for 3 seconds, 25% for 3 seconds. Rest 10 seconds. That is one pyramid.",
          "Pyramids 1–3 (130s) — Perform 3 full pyramids: 25%, 50%, 75%, 100%, 75%, 50%, 25%. Hold each level for 3 seconds. Rest 10 seconds between pyramids. Breathe steadily throughout.",
          "Pyramids 4–5 (90s) — Perform 2 more pyramids. Try to make the transitions between levels smooth rather than abrupt. The goal is graded control, not on/off switching.",
          "Cool-Down (40s) — Relax fully. Perform 3 slow reverse Kegels. Take 5 deep breaths. This graded control is what will allow you to apply just the right amount of squeeze during intimacy.",
        ],
      },
      {
        number: 15,
        name: "Start-Stop Progressive",
        duration: "15 min",
        xp: 50,
        why: "Targets higher arousal (level 6 instead of 5) before stopping. Practicing only at low arousal doesn't transfer to real situations — this narrows the safety margin.",
        steps: [
          "Breathing Warm-Up (90s) — Lie or sit comfortably. Perform 4 cycles of 4-7-8 breathing. Let your body enter a calm, parasympathetic state before beginning.",
          "Begin Stimulation (2 min) — Begin self-stimulation at a moderate pace. Focus on sensation and continuously rate your arousal on the 0–10 scale. Use slow, deliberate movements.",
          "Stop at Level 6 (2 min) — When you reach arousal level 6, stop all stimulation. Take 3 deep breaths using the 4-7-8 pattern. Notice the sensations as arousal subsides. Wait until you drop to level 3.",
          "Repeat Cycles (6 min) — Resume stimulation. Approach level 6 again and stop. Complete 3–4 total cycles. Try to be more precise each time about exactly when you hit level 6. Precision is more important than speed.",
          "Close and Reflect (60s) — Let arousal subside fully. Take 5 slow breaths. Compare this to the introductory session. Were you able to distinguish level 5 from level 6? Could you stop more confidently?",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  CSS (shared between measurement and final render)                  */
/* ------------------------------------------------------------------ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #080808;
    color: rgba(255,255,255,0.75);
    font-weight: 300;
    letter-spacing: 0.01em;
    -webkit-font-smoothing: antialiased;
    font-size: 13px;
    line-height: 1.7;
  }

  /* ---- Cover ---- */
  .cover-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .cover-label {
    text-transform: uppercase;
    letter-spacing: 0.35em;
    font-size: 9px;
    color: rgba(255,255,255,0.25);
    margin-bottom: 32px;
  }
  .cover-inner h1 {
    font-size: 42px;
    font-weight: 300;
    color: rgba(255,255,255,0.9);
    line-height: 1.15;
  }
  .cover-inner h1 span {
    color: rgba(196,149,106,0.85);
    font-weight: 400;
  }
  .cover-sub {
    margin-top: 20px;
    color: rgba(255,255,255,0.5);
    font-size: 12px;
  }
  .cover-badges {
    margin-top: 40px;
    display: flex;
    gap: 24px;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.4);
  }

  /* ---- TOC ---- */
  .toc-inner {
    max-width: 580px;
    margin: 0 auto;
  }
  .toc-heading {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.2);
    margin-bottom: 32px;
  }
  .toc-row {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 18px;
  }
  .toc-num {
    font-size: 14px;
    font-weight: 500;
    color: rgba(196,149,106,0.8);
    width: 20px;
    flex-shrink: 0;
  }
  .toc-title {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    font-weight: 300;
  }
  .toc-line {
    flex: 1;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 3px;
  }
  .toc-count {
    font-size: 11px;
    color: rgba(255,255,255,0.2);
  }

  /* ---- Level intro ---- */
  .level-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.2);
    margin-bottom: 12px;
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(196,149,106,0.7);
  }
  .level-title {
    font-size: 32px;
    font-weight: 300;
    color: rgba(196,149,106,0.8);
    margin-bottom: 16px;
  }
  .level-desc {
    font-size: 12px;
    line-height: 1.75;
    color: rgba(255,255,255,0.55);
    font-weight: 300;
  }

  /* ---- Exercise header ---- */
  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  .exercise-num {
    font-size: 10px;
    font-family: 'Courier New', monospace;
    color: rgba(255,255,255,0.35);
  }
  .exercise-name {
    font-size: 17px;
    font-weight: 400;
    color: rgba(255,255,255,0.92);
    margin-top: 3px;
  }
  .badges { display: flex; gap: 8px; flex-shrink: 0; }
  .badge {
    font-size: 10px;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(196,149,106,0.08);
    color: rgba(196,149,106,0.85);
  }

  /* ---- Why ---- */
  .why {
    border-left: 2px solid rgba(255,255,255,0.05);
    padding-left: 14px;
  }
  .why-label {
    display: block;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.2);
    margin-bottom: 4px;
  }
  .why p {
    font-size: 12px;
    line-height: 1.7;
    color: rgba(255,255,255,0.50);
    font-style: italic;
    font-weight: 300;
  }

  /* ---- Steps ---- */
  .step {
    display: flex;
    gap: 12px;
  }
  .step-num {
    font-size: 11px;
    font-family: 'Courier New', monospace;
    color: rgba(196,149,106,0.50);
    width: 16px;
    text-align: right;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .step-title {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.72);
    margin-right: 4px;
  }
  .step-body {
    font-size: 12px;
    line-height: 1.75;
    color: rgba(255,255,255,0.50);
    font-weight: 300;
  }

  /* ---- Footer ---- */
  .footer-inner {
    text-align: center;
  }
  .footer-message {
    font-size: 18px;
    line-height: 1.8;
    color: rgba(255,255,255,1);
    font-weight: 300;
    font-style: italic;
    margin-bottom: 40px;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }
  .footer-inner p {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.6);
  }
  .footer-inner .disclaimer {
    font-size: 9px;
    margin-top: 8px;
    color: rgba(255,255,255,0.4);
    text-transform: none;
    letter-spacing: normal;
  }

  /* ---- Page layout (final render only) ---- */
  .page {
    width: 430px;
    height: 932px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 28px 24px;
    background: #080808;
  }
  .page-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

/* ------------------------------------------------------------------ */
/*  Block builders                                                     */
/* ------------------------------------------------------------------ */

function buildBlocks() {
  const blocks = [];

  // Cover
  blocks.push({
    id: "cover",
    type: "cover",
    html: `
      <div class="cover-inner">
        <div class="cover-label">Endura Program Guide</div>
        <h1>First Steps to<br><span>Sexual Mastery</span></h1>
        <div class="cover-sub">5 progressive levels &middot; 15 guided exercises &middot; From first breath to full control</div>
        <div class="cover-badges">
          <span>Evidence-Based</span>
          <span>&middot;</span>
          <span>Completely Private</span>
          <span>&middot;</span>
          <span>Judgment-Free</span>
        </div>
      </div>`,
  });

  // TOC
  const tocRows = levels
    .map(
      (l) => `
      <div class="toc-row">
        <span class="toc-num">${l.number}</span>
        <span class="toc-title">${l.title}</span>
        <span class="toc-line"></span>
        <span class="toc-count">${l.exercises.length} exercises</span>
      </div>`
    )
    .join("");

  blocks.push({
    id: "toc",
    type: "toc",
    html: `
      <div class="toc-inner">
        <div class="toc-heading">Contents</div>
        ${tocRows}
      </div>`,
  });

  // Levels, exercises, steps
  for (const level of levels) {
    blocks.push({
      id: `level-${level.number}-intro`,
      type: "level-intro",
      levelNumber: level.number,
      html: `
        <div>
          <div class="level-label">
            <span class="dot"></span>
            <span>Level ${level.number}</span>
          </div>
          <h2 class="level-title">${level.title}</h2>
          <p class="level-desc">${level.description}</p>
        </div>`,
    });

    for (const ex of level.exercises) {
      blocks.push({
        id: `ex-${ex.number}-header`,
        type: "exercise-header",
        exerciseNumber: ex.number,
        html: `
          <div>
            <div class="exercise-header">
              <div>
                <span class="exercise-num">#${String(ex.number).padStart(2, "0")}</span>
                <div class="exercise-name">${ex.name}</div>
              </div>
              <div class="badges">
                <span class="badge">${ex.duration}</span>
                <span class="badge">${ex.xp} XP</span>
              </div>
            </div>
            <div class="why">
              <span class="why-label">Why</span>
              <p>${ex.why}</p>
            </div>
          </div>`,
      });

      for (let i = 0; i < ex.steps.length; i++) {
        const step = ex.steps[i];
        const dash = step.indexOf(" — ");
        const title = dash !== -1 ? step.slice(0, dash) : "";
        const body = dash !== -1 ? step.slice(dash + 3) : step;

        blocks.push({
          id: `ex-${ex.number}-step-${i}`,
          type: "step",
          exerciseNumber: ex.number,
          stepIndex: i,
          html: `
            <div class="step">
              <span class="step-num">${i + 1}</span>
              <div>
                ${title ? `<span class="step-title">${title}</span>` : ""}
                <span class="step-body">${body}</span>
              </div>
            </div>`,
        });
      }
    }
  }

  // Footer — gets its own page
  blocks.push({
    id: "footer",
    type: "closing",
    html: `
      <div class="footer-inner">
        <p class="footer-message">We hope this guide served you well. If you've made it this far, we'd genuinely love to hear how it went &mdash; what clicked, what helped, what you'd want more of. We'll reach out when the full app is live. Until then, stay with the practice.</p>
        <p>Endura &middot; Your Private AI Therapist</p>
        <p class="disclaimer">This content is for educational purposes. Not a substitute for medical advice.</p>
      </div>`,
  });

  return blocks;
}

/* ------------------------------------------------------------------ */
/*  Measurement HTML                                                   */
/* ------------------------------------------------------------------ */

function buildMeasurementHTML(blocks) {
  // 382px = 430px - 24px*2 (page padding)
  const blockDivs = blocks
    .map(
      (b) =>
        `<div data-block-id="${b.id}" style="width:382px; padding:0;">${b.html}</div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>${CSS}</style></head>
<body style="width:382px; padding:0;">
  ${blockDivs}
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Bin-packing                                                        */
/* ------------------------------------------------------------------ */

const PAGE_HEIGHT = 932;
const PAGE_PAD_Y = 28;
const USABLE = PAGE_HEIGHT - PAGE_PAD_Y * 2; // 876
const GAP = 16;

function packPages(blocks, heights) {
  const pages = [];
  let cur = [];
  let curH = 0;
  const multiPageExercises = []; // track exercises that span 2+ pages

  function flush() {
    if (cur.length > 0) {
      pages.push(cur);
      cur = [];
      curH = 0;
    }
  }

  function fits(h) {
    const needed = cur.length > 0 ? h + GAP : h;
    return curH + needed <= USABLE;
  }

  function add(block, h) {
    if (cur.length > 0) curH += GAP;
    cur.push(block);
    curH += h;
  }

  // Pre-compute total height for each exercise (header + all steps + gaps)
  function exerciseTotalHeight(startIdx) {
    let total = heights[blocks[startIdx].id]; // header
    for (let j = startIdx + 1; j < blocks.length; j++) {
      if (blocks[j].type !== "step" || blocks[j].exerciseNumber !== blocks[startIdx].exerciseNumber) break;
      total += GAP + heights[blocks[j].id];
    }
    return total;
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const h = heights[block.id];

    // Cover, TOC, and closing always get their own page
    if (block.type === "cover" || block.type === "toc" || block.type === "closing") {
      flush();
      pages.push([block]);
      continue;
    }

    // Level intro: always starts a new page
    if (block.type === "level-intro") {
      flush();
      add(block, h);
      continue;
    }

    // Exercise header: each exercise starts its own page
    // UNLESS the current page has room for the ENTIRE exercise
    if (block.type === "exercise-header") {
      const totalExH = exerciseTotalHeight(i);

      if (cur.length > 0) {
        // Check if entire exercise fits on current page
        const fitsEntirely = curH + GAP + totalExH <= USABLE;
        if (fitsEntirely) {
          // Add entire exercise inline
          add(block, h);
          continue;
        } else {
          // Doesn't fit entirely — give it its own page
          flush();
        }
      }

      const startPage = pages.length + 1; // page number this exercise starts on
      add(block, h);

      // Add steps for this exercise
      let j = i + 1;
      while (j < blocks.length && blocks[j].type === "step" && blocks[j].exerciseNumber === block.exerciseNumber) {
        const stepH = heights[blocks[j].id];
        if (fits(stepH)) {
          add(blocks[j], stepH);
        } else {
          flush();
          add(blocks[j], stepH);
        }
        j++;
      }

      const endPage = pages.length + 1; // current (not yet flushed) page
      if (endPage > startPage) {
        multiPageExercises.push({
          exerciseNumber: block.exerciseNumber,
          name: block.html.match(/class="exercise-name">(.*?)<\/div>/)?.[1] || `#${block.exerciseNumber}`,
          startPage,
          endPage,
        });
      }

      i = j - 1; // skip the steps we already processed
      continue;
    }

    // Footer
    if (fits(h)) {
      add(block, h);
    } else {
      flush();
      add(block, h);
    }
  }

  flush();

  // Report multi-page exercises
  if (multiPageExercises.length > 0) {
    console.log("\n  Exercises spanning multiple pages:");
    for (const ex of multiPageExercises) {
      console.log(`    #${String(ex.exerciseNumber).padStart(2, "0")} ${ex.name} — pages ${ex.startPage}–${ex.endPage}`);
    }
  }

  return pages;
}

/* ------------------------------------------------------------------ */
/*  Final HTML with fixed-height pages                                 */
/* ------------------------------------------------------------------ */

function buildFinalHTML(pages) {
  const pageDivs = pages
    .map((pageBlocks) => {
      const inner = pageBlocks.map((b) => b.html).join("");
      return `<div class="page"><div class="page-content">${inner}</div></div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  ${CSS}
  @page { margin: 0; }
</style>
</head>
<body>
  ${pageDivs}
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("Building blocks...");
  const blocks = buildBlocks();
  console.log(`  ${blocks.length} blocks created`);

  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Pass 1: Measure
  console.log("Pass 1: Measuring block heights...");
  await page.setViewport({ width: 430, height: 932 });
  const measureHTML = buildMeasurementHTML(blocks);
  await page.setContent(measureHTML, { waitUntil: "networkidle0" });

  const heights = await page.evaluate(() => {
    const results = {};
    document.querySelectorAll("[data-block-id]").forEach((el) => {
      results[el.dataset.blockId] = el.offsetHeight;
    });
    return results;
  });

  for (const b of blocks) {
    const h = heights[b.id];
    if (h > USABLE) {
      console.warn(
        `  WARNING: Block "${b.id}" is ${h}px tall (usable: ${USABLE}px)`
      );
    }
  }

  // Bin-pack
  console.log("Packing blocks into pages...");
  const pages = packPages(blocks, heights);
  console.log(`  ${pages.length} pages`);

  for (let i = 0; i < pages.length; i++) {
    const ph = pages[i].reduce(
      (sum, b, j) => sum + heights[b.id] + (j > 0 ? GAP : 0),
      0
    );
    const ids = pages[i].map((b) => b.id).join(", ");
    console.log(`  Page ${i + 1} (${ph}/${USABLE}px): ${ids}`);
  }

  // Pass 2: Render
  console.log("Pass 2: Rendering final PDF...");
  const finalHTML = buildFinalHTML(pages);
  await page.setContent(finalHTML, { waitUntil: "domcontentloaded" });
  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  const outPath = resolve(__dirname, "..", "endura-program-guide.pdf");
  await page.pdf({
    path: outPath,
    width: "430px",
    height: "932px",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  // Convert PDF pages to PNGs
  const previewDir = resolve(__dirname, "..", "guide-pages");
  mkdirSync(previewDir, { recursive: true });
  const pngPages = await pdfToPng(outPath, {
    outputFolder: "guide-pages",
    outputFileMaskFunc: (pageNum) =>
      `page-${String(pageNum).padStart(2, "0")}.png`,
  });
  console.log(`Preview: ${previewDir} (${pngPages.length} pages)`);

  await browser.close();
  console.log(`PDF saved to: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
