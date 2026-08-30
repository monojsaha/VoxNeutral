import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge — rendering", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeDefined();
  });

  it("renders a <span> element", () => {
    render(<Badge>Label</Badge>);
    const el = screen.getByText("Label");
    expect(el.tagName.toLowerCase()).toBe("span");
  });

  it("applies default variant by default", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default").className).toContain("bg-neutral-800");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success").className).toContain("text-success-500");
  });

  it("applies error variant", () => {
    render(<Badge variant="error">Error</Badge>);
    expect(screen.getByText("Error").className).toContain("text-error-500");
  });

  it("applies excellent variant (green)", () => {
    render(<Badge variant="excellent">Excellent</Badge>);
    expect(screen.getByText("Excellent").className).toContain("text-success-500");
  });

  it("applies needs_work variant (red)", () => {
    render(<Badge variant="needs_work">Needs Work</Badge>);
    expect(screen.getByText("Needs Work").className).toContain("text-error-500");
  });

  it("applies fair variant (amber)", () => {
    render(<Badge variant="fair">Fair</Badge>);
    expect(screen.getByText("Fair").className).toContain("text-warning-500");
  });

  it("applies brand variant", () => {
    render(<Badge variant="brand">Brand</Badge>);
    expect(screen.getByText("Brand").className).toContain("text-brand-400");
  });

  it("merges custom className", () => {
    render(<Badge className="extra-class">Tag</Badge>);
    expect(screen.getByText("Tag").className).toContain("extra-class");
  });

  it("forwards extra HTML attributes", () => {
    render(<Badge data-testid="my-badge">Test</Badge>);
    expect(screen.getByTestId("my-badge")).toBeDefined();
  });
});
