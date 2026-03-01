import { describe, it, expect } from "vitest";
import { exercises } from "../exercises/data";

describe("Exercise Data", () => {
  it("has 7 exercises", () => {
    expect(exercises).toHaveLength(7);
  });

  it("all slugs are unique", () => {
    const slugs = exercises.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("all exercises have required fields", () => {
    exercises.forEach((ex) => {
      expect(ex.slug).toBeTruthy();
      expect(ex.title).toBeTruthy();
      expect(ex.description).toBeTruthy();
      expect(["physical", "somatic"]).toContain(ex.category);
      expect(ex.duration).toBeTruthy();
      expect(["Beginner", "Intermediate", "Advanced"]).toContain(ex.difficulty);
      expect(ex.xpReward).toBeGreaterThan(0);
      expect(ex.steps.length).toBeGreaterThan(0);
    });
  });

  it("all exercises have valid levelUnlock", () => {
    exercises.forEach((ex) => {
      expect(ex.levelUnlock).toBeGreaterThanOrEqual(1);
      expect(ex.levelUnlock).toBeLessThanOrEqual(15);
    });
  });

  it("each exercise has at least 3 steps", () => {
    exercises.forEach((ex) => {
      expect(ex.steps.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("steps have title and instruction", () => {
    exercises.forEach((ex) => {
      ex.steps.forEach((step) => {
        expect(step.title).toBeTruthy();
        expect(step.instruction).toBeTruthy();
      });
    });
  });
});
