import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button — rendering", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("renders a <button> element", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("applies primary variant by default", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-brand-500");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-neutral-800");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-transparent");
  });

  it("applies danger variant classes", () => {
    render(<Button variant="danger">Danger</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-error-500");
  });

  it("applies sm size classes", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toContain("text-xs");
  });

  it("applies lg size classes", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("font-semibold");
  });
});

describe("Button — loading state", () => {
  it("is disabled when loading=true", () => {
    render(<Button loading>Saving…</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is NOT disabled when loading=false", () => {
    render(<Button loading={false}>Save</Button>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});

describe("Button — disabled prop", () => {
  it("is disabled when disabled=true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe("Button — interaction", () => {
  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("forwards extra HTML attributes", () => {
    render(<Button aria-label="practice">Speak</Button>);
    expect(screen.getByRole("button").getAttribute("aria-label")).toBe("practice");
  });

  it("merges custom className", () => {
    render(<Button className="my-custom-class">X</Button>);
    expect(screen.getByRole("button").className).toContain("my-custom-class");
  });
});
