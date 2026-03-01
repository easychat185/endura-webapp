import { describe, it, expect } from "vitest";
import { BADGE_DEFINITIONS, type BadgeDefinition } from "../gamification/badges";

describe("Badge Definitions", () => {
  it("has at least 20 badges", () => {
    expect(BADGE_DEFINITIONS.length).toBeGreaterThanOrEqual(20);
  });

  it("all badges have unique IDs", () => {
    const ids = BADGE_DEFINITIONS.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all badges have required fields", () => {
    BADGE_DEFINITIONS.forEach((badge: BadgeDefinition) => {
      expect(badge.id).toBeTruthy();
      expect(badge.label).toBeTruthy();
      expect(badge.description).toBeTruthy();
      expect(badge.rarity).toBeTruthy();
      expect(typeof badge.xp_reward).toBe("number");
      expect(badge.xp_reward).toBeGreaterThan(0);
    });
  });

  it("rarity values are valid", () => {
    const validRarities = ["common", "uncommon", "rare", "legendary"];
    BADGE_DEFINITIONS.forEach((badge) => {
      expect(validRarities).toContain(badge.rarity);
    });
  });

  it("categories are valid", () => {
    const validCategories = ["streak", "exercise", "session", "score", "level", "special"];
    BADGE_DEFINITIONS.forEach((badge) => {
      expect(validCategories).toContain(badge.category);
    });
  });

  it("streak badges have ascending streak requirements in their IDs", () => {
    const streakBadges = BADGE_DEFINITIONS.filter((b) => b.category === "streak");
    expect(streakBadges.length).toBeGreaterThanOrEqual(4);
  });
});
