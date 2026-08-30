import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ScoreRing } from "@/components/ui/ScoreRing";

function renderRing(props: Parameters<typeof ScoreRing>[0]) {
  const { container } = render(<ScoreRing {...props} />);
  return container;
}

describe("ScoreRing — structure", () => {
  it("renders an <svg> element", () => {
    const c = renderRing({ score: 85 });
    expect(c.querySelector("svg")).not.toBeNull();
  });

  it("renders two <circle> elements (track + progress)", () => {
    const c = renderRing({ score: 85 });
    const circles = c.querySelectorAll("circle");
    expect(circles.length).toBe(2);
  });

  it("displays the score as text", () => {
    const c = renderRing({ score: 78 });
    const textEls = c.querySelectorAll("text");
    const scoreText = Array.from(textEls).find((t) => t.textContent === "78");
    expect(scoreText).toBeDefined();
  });

  it("does NOT display BETA label when isBeta is false", () => {
    const c = renderRing({ score: 85, isBeta: false });
    const texts = Array.from(c.querySelectorAll("text")).map((t) => t.textContent);
    expect(texts).not.toContain("BETA");
  });

  it("displays BETA label when isBeta is true", () => {
    const c = renderRing({ score: 85, isBeta: true });
    const texts = Array.from(c.querySelectorAll("text")).map((t) => t.textContent);
    expect(texts).toContain("BETA");
  });
});

describe("ScoreRing — score colors", () => {
  it("score ≥90 uses green progress stroke", () => {
    const c = renderRing({ score: 92 });
    const circles = c.querySelectorAll("circle");
    const progressCircle = circles[1];
    expect(progressCircle.getAttribute("stroke")).toBe("#22c55e");
  });

  it("score ≥80 <90 uses brand blue progress stroke", () => {
    const c = renderRing({ score: 85 });
    const circles = c.querySelectorAll("circle");
    expect(circles[1].getAttribute("stroke")).toBe("#4a63f7");
  });

  it("score <60 uses red progress stroke", () => {
    const c = renderRing({ score: 45 });
    const circles = c.querySelectorAll("circle");
    expect(circles[1].getAttribute("stroke")).toBe("#ef4444");
  });
});

describe("ScoreRing — size and props", () => {
  it("applies custom size to svg width and height", () => {
    const c = renderRing({ score: 80, size: 200 });
    const svg = c.querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("200");
    expect(svg.getAttribute("height")).toBe("200");
  });

  it("clamps score above 100 to 100% fill", () => {
    const c = renderRing({ score: 150 });
    const circles = c.querySelectorAll("circle");
    const circumference = parseFloat(circles[1].getAttribute("stroke-dasharray") ?? "0");
    const offset = parseFloat(circles[1].getAttribute("stroke-dashoffset") ?? "1");
    expect(offset).toBe(0); // 100% fill → 0 offset
  });

  it("clamps score below 0 to 0% fill", () => {
    const c = renderRing({ score: -10 });
    const circles = c.querySelectorAll("circle");
    const dashArray = parseFloat(circles[1].getAttribute("stroke-dasharray") ?? "0");
    const offset = parseFloat(circles[1].getAttribute("stroke-dashoffset") ?? "0");
    // offset should equal circumference → 0% fill
    expect(Math.abs(offset - dashArray) < 0.01).toBe(true);
  });
});
