const DISTRESS_SIGNALS = [
  "suicid",
  "kill myself",
  "end it all",
  "hopeless",
  "can't go on",
  "depressed",
  "hate myself",
  "panic attack",
  "crying",
  "devastated",
  "broken",
  "worthless",
  "give up",
  "no point",
];

const TECHNIQUE_TRIGGERS = [
  "exercise",
  "technique",
  "how do i",
  "teach me",
  "show me",
  "what should i do",
  "new approach",
  "try something",
  "next step",
];

export function selectModel(
  sessionNumber: number,
  userMessage: string
): string {
  const lower = userMessage.toLowerCase();

  // Early sessions — use better model for first impressions
  if (sessionNumber <= 2) {
    return "claude-sonnet-4-6";
  }

  // Distress signals — upgrade for empathetic response
  if (DISTRESS_SIGNALS.some((signal) => lower.includes(signal))) {
    return "claude-sonnet-4-6";
  }

  // Technique prescriptions — upgrade for detailed guidance
  if (TECHNIQUE_TRIGGERS.some((trigger) => lower.includes(trigger))) {
    return "claude-sonnet-4-6";
  }

  // Default — cost-efficient model
  return "claude-haiku-4-5-20251001";
}
