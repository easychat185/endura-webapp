import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      const { initial, animate, transition, whileHover, ...rest } = props as Record<string, unknown>;
      void initial; void animate; void transition; void whileHover;
      return <div {...rest}>{children}</div>;
    },
  },
}));

import XPProgressBar from "../../gamification/XPProgressBar";

describe("XPProgressBar", () => {
  it("renders level and title", () => {
    render(
      <XPProgressBar level={5} levelTitle="Explorer" xpInLevel={100} xpNeeded={350} totalXP={850} />
    );
    expect(screen.getByText("Lv.5")).toBeInTheDocument();
    expect(screen.getByText("Explorer")).toBeInTheDocument();
  });

  it("displays total XP", () => {
    render(
      <XPProgressBar level={3} levelTitle="Learner" xpInLevel={50} xpNeeded={200} totalXP={300} />
    );
    expect(screen.getByText("300 XP")).toBeInTheDocument();
  });

  it("shows XP progress fraction", () => {
    render(
      <XPProgressBar level={2} levelTitle="Beginner" xpInLevel={75} xpNeeded={150} totalXP={175} />
    );
    expect(screen.getByText("75/150 XP")).toBeInTheDocument();
  });

  it("shows next level number", () => {
    render(
      <XPProgressBar level={7} levelTitle="Dedicated" xpInLevel={200} xpNeeded={500} totalXP={1700} />
    );
    expect(screen.getByText("Level 8")).toBeInTheDocument();
  });
});
