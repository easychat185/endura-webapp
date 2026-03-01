import { describe, it, expect } from "vitest";
import { isValidUUID, sanitizeMessage } from "../validation";

describe("isValidUUID", () => {
  it("accepts valid v4 UUID", () => {
    expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("accepts uppercase UUID", () => {
    expect(isValidUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidUUID("")).toBe(false);
  });

  it("rejects malformed UUID", () => {
    expect(isValidUUID("not-a-uuid")).toBe(false);
    expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
    expect(isValidUUID("550e8400e29b41d4a716446655440000")).toBe(false);
  });
});

describe("sanitizeMessage", () => {
  it("preserves normal text", () => {
    expect(sanitizeMessage("Hello, world!")).toBe("Hello, world!");
  });

  it("preserves newlines and tabs", () => {
    expect(sanitizeMessage("line1\nline2\ttab")).toBe("line1\nline2\ttab");
  });

  it("removes control characters", () => {
    expect(sanitizeMessage("hello\x00world")).toBe("helloworld");
    expect(sanitizeMessage("test\x1Fdata")).toBe("testdata");
    expect(sanitizeMessage("a\x7Fb")).toBe("ab");
  });

  it("handles empty string", () => {
    expect(sanitizeMessage("")).toBe("");
  });

  it("preserves unicode characters", () => {
    expect(sanitizeMessage("שלום 🌍")).toBe("שלום 🌍");
  });
});
