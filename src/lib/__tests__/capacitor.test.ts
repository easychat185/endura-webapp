import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Capacitor before importing
vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => false),
  },
}));

vi.mock("@capacitor/status-bar", () => ({
  StatusBar: {
    setStyle: vi.fn(),
    setBackgroundColor: vi.fn(),
  },
  Style: { Dark: "DARK" },
}));

vi.mock("@capacitor/haptics", () => ({
  Haptics: {
    impact: vi.fn(),
  },
  ImpactStyle: { Light: "LIGHT" },
}));

describe("Capacitor Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("isNative returns false on web", async () => {
    const { isNative } = await import("../capacitor");
    expect(isNative()).toBe(false);
  });

  it("initCapacitor does nothing on web", async () => {
    const { initCapacitor } = await import("../capacitor");
    const { StatusBar } = await import("@capacitor/status-bar");
    await initCapacitor();
    expect(StatusBar.setStyle).not.toHaveBeenCalled();
  });

  it("hapticLight does nothing on web", async () => {
    const { hapticLight } = await import("../capacitor");
    const { Haptics } = await import("@capacitor/haptics");
    await hapticLight();
    expect(Haptics.impact).not.toHaveBeenCalled();
  });
});
