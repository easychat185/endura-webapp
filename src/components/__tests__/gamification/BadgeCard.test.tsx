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

vi.mock("lucide-react", () => ({
  Lock: () => <span data-testid="lock-icon">🔒</span>,
}));

import BadgeCard from "../../gamification/BadgeCard";

describe("BadgeCard", () => {
  it("renders earned badge with label", () => {
    render(
      <BadgeCard id="streak_3" label="Streak Starter" description="3-day streak" rarity="common" earned={true} category="streak" />
    );
    expect(screen.getByText("Streak Starter")).toBeInTheDocument();
    expect(screen.getByText("3-day streak")).toBeInTheDocument();
  });

  it("renders rarity label for earned badge", () => {
    render(
      <BadgeCard id="streak_30" label="Monthly Master" description="30 days" rarity="rare" earned={true} category="streak" />
    );
    expect(screen.getByText("Rare")).toBeInTheDocument();
  });

  it("shows lock icon for unearned badge", () => {
    render(
      <BadgeCard id="level_15" label="Level 15" description="Reach Level 15" rarity="legendary" earned={false} category="level" />
    );
    expect(screen.getByTestId("lock-icon")).toBeInTheDocument();
  });

  it("applies dimmed styling for unearned badges", () => {
    const { container } = render(
      <BadgeCard id="test" label="Test" description="Test" rarity="common" earned={false} category="special" />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("opacity-40");
  });

  it("does not dim earned badges", () => {
    const { container } = render(
      <BadgeCard id="test" label="Test" description="Test" rarity="uncommon" earned={true} category="special" />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain("opacity-40");
  });
});
