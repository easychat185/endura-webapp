import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FaqItem from "../FaqItem";

describe("FaqItem", () => {
  it("renders question text", () => {
    render(<FaqItem question="What is Endura?" answer="An AI coaching app." />);
    expect(screen.getByText("What is Endura?")).toBeInTheDocument();
  });

  it("starts collapsed", () => {
    render(<FaqItem question="Test?" answer="Answer text" />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("expands on click", () => {
    render(<FaqItem question="Test?" answer="Answer text" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("collapses on second click", () => {
    render(<FaqItem question="Test?" answer="Answer text" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("shows answer text", () => {
    render(<FaqItem question="Test?" answer="Detailed answer here" />);
    expect(screen.getByText("Detailed answer here")).toBeInTheDocument();
  });
});
