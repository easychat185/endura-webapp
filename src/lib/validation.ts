const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(id: string): boolean {
  return UUID_RE.test(id);
}

/** Strip control characters (except newlines/tabs) from user input */
export function sanitizeMessage(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

/** Parse a value as a positive integer, with default and max bounds. */
export function parsePositiveInt(
  value: unknown,
  defaultValue: number,
  max: number
): number {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0 || !Number.isInteger(num)) {
    return defaultValue;
  }
  return Math.min(num, max);
}

const VALID_AGENT_DEPTHS = ["quick", "standard", "deep"] as const;
type AgentDepth = (typeof VALID_AGENT_DEPTHS)[number];

/** Validate agent depth against allowed enum values. */
export function isValidAgentDepth(depth: unknown): depth is AgentDepth {
  return (
    typeof depth === "string" &&
    VALID_AGENT_DEPTHS.includes(depth as AgentDepth)
  );
}

/** Validate agent focus as a string with max length. */
export function isValidAgentFocus(focus: unknown): focus is string {
  return typeof focus === "string" && focus.length <= 500;
}
