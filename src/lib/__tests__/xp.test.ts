import { describe, it, expect } from "vitest";
import { getLevelFromXP, getXPForNextLevel, getStreakMultiplier, LEVEL_THRESHOLDS } from "../gamification/levels";

describe("getLevelFromXP", () => {
  it("returns level 1 for 0 XP", () => {
    expect(getLevelFromXP(0).level).toBe(1);
    expect(getLevelFromXP(0).title).toBe("Newcomer");
  });

  it("returns level 2 at 100 XP", () => {
    expect(getLevelFromXP(100).level).toBe(2);
    expect(getLevelFromXP(100).title).toBe("Beginner");
  });

  it("stays level 2 at 249 XP", () => {
    expect(getLevelFromXP(249).level).toBe(2);
  });

  it("returns level 3 at 250 XP", () => {
    expect(getLevelFromXP(250).level).toBe(3);
  });

  it("returns max level at 9800+ XP", () => {
    expect(getLevelFromXP(9800).level).toBe(15);
    expect(getLevelFromXP(99999).level).toBe(15);
  });
});

describe("getXPForNextLevel", () => {
  it("returns XP needed for level 2 from level 1", () => {
    const result = getXPForNextLevel(1);
    expect(result).not.toBeNull();
    expect(result!.needed).toBe(100); // 100 - 0
  });

  it("returns null for max level", () => {
    expect(getXPForNextLevel(15)).toBeNull();
  });
});

describe("getStreakMultiplier", () => {
  it("returns 1.0x for 0 days", () => {
    expect(getStreakMultiplier(0).multiplier).toBe(1.0);
    expect(getStreakMultiplier(0).label).toBe("Starting");
  });

  it("returns 1.2x at 3 days", () => {
    expect(getStreakMultiplier(3).multiplier).toBe(1.2);
    expect(getStreakMultiplier(3).label).toBe("Building");
  });

  it("returns 1.5x at 7 days", () => {
    expect(getStreakMultiplier(7).multiplier).toBe(1.5);
    expect(getStreakMultiplier(7).label).toBe("On Fire");
  });

  it("returns 1.8x at 14 days", () => {
    expect(getStreakMultiplier(14).multiplier).toBe(1.8);
  });

  it("returns 2.0x at 30+ days", () => {
    expect(getStreakMultiplier(30).multiplier).toBe(2.0);
    expect(getStreakMultiplier(100).multiplier).toBe(2.0);
  });
});

describe("LEVEL_THRESHOLDS", () => {
  it("has 15 levels", () => {
    expect(LEVEL_THRESHOLDS).toHaveLength(15);
  });

  it("thresholds are in ascending order", () => {
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
      expect(LEVEL_THRESHOLDS[i].totalXP).toBeGreaterThan(LEVEL_THRESHOLDS[i - 1].totalXP);
    }
  });

  it("levels are sequential 1-15", () => {
    LEVEL_THRESHOLDS.forEach((def, i) => {
      expect(def.level).toBe(i + 1);
    });
  });
});
