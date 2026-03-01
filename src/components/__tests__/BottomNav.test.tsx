import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

import BottomNav from "../BottomNav";

describe("BottomNav", () => {
  it("renders 5 navigation tabs", () => {
    render(<BottomNav activeTab="Home" />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
  });

  it("renders correct tab labels", () => {
    render(<BottomNav activeTab="Home" />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Practice")).toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("highlights the active tab", () => {
    const { container } = render(<BottomNav activeTab="Chat" />);
    const chatLink = screen.getByText("Chat").closest("a");
    expect(chatLink?.className).toContain("text-amber-300/60");
  });

  it("links to correct routes", () => {
    render(<BottomNav activeTab="Home" />);
    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/dashboard");
    expect(screen.getByText("Practice").closest("a")).toHaveAttribute("href", "/exercises");
    expect(screen.getByText("Chat").closest("a")).toHaveAttribute("href", "/chat");
    expect(screen.getByText("Progress").closest("a")).toHaveAttribute("href", "/progress");
    expect(screen.getByText("Profile").closest("a")).toHaveAttribute("href", "/settings");
  });
});
