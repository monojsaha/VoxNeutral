import { describe, it, expect } from "vitest";
import {
  getScoreBand,
  getScoreBandLabel,
  getScoreBandColor,
  MasteryLevel,
} from "@/types";

describe("getScoreBand — boundary values", () => {
  const cases: Array<[number, string]> = [
    [100, "excellent"],
    [90,  "excellent"],
    [89,  "good"],
    [80,  "good"],
    [79,  "fair"],
    [70,  "fair"],
    [69,  "developing"],
    [60,  "developing"],
    [59,  "needs_work"],
    [1,   "needs_work"],
    [0,   "needs_work"],
  ];

  for (const [score, expected] of cases) {
    it(`score ${score} → "${expected}"`, () => {
      expect(getScoreBand(score)).toBe(expected);
    });
  }
});

describe("getScoreBandLabel", () => {
  it("returns Excellent for excellent", () => expect(getScoreBandLabel("excellent")).toBe("Excellent"));
  it("returns Good for good",           () => expect(getScoreBandLabel("good")).toBe("Good"));
  it("returns Fair for fair",           () => expect(getScoreBandLabel("fair")).toBe("Fair"));
  it("returns Developing for developing", () => expect(getScoreBandLabel("developing")).toBe("Developing"));
  it("returns Needs Work for needs_work", () => expect(getScoreBandLabel("needs_work")).toBe("Needs Work"));

  it("getScoreBandLabel covers all bands returned by getScoreBand", () => {
    const scores = [95, 85, 75, 65, 45];
    for (const s of scores) {
      const band = getScoreBand(s);
      expect(() => getScoreBandLabel(band)).not.toThrow();
      expect(getScoreBandLabel(band).length).toBeGreaterThan(0);
    }
  });
});

describe("getScoreBandColor", () => {
  it("returns a valid 6-digit hex color for every band", () => {
    const bands = ["excellent", "good", "fair", "developing", "needs_work"] as const;
    for (const band of bands) {
      const color = getScoreBandColor(band);
      expect(color, `${band} color should be hex`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("excellent is green (#22c55e)", () => {
    expect(getScoreBandColor("excellent")).toBe("#22c55e");
  });

  it("needs_work is red (#ef4444)", () => {
    expect(getScoreBandColor("needs_work")).toBe("#ef4444");
  });

  it("good is brand blue (#4a63f7)", () => {
    expect(getScoreBandColor("good")).toBe("#4a63f7");
  });

  it("all bands return distinct colors", () => {
    const bands = ["excellent", "good", "fair", "developing", "needs_work"] as const;
    const colors = bands.map(getScoreBandColor);
    const unique = new Set(colors);
    expect(unique.size).toBe(colors.length);
  });
});

describe("MasteryLevel enum", () => {
  it("New level value is 'new'", () => {
    expect(MasteryLevel.New).toBe("new");
  });

  it("Learning level value is 'learning'", () => {
    expect(MasteryLevel.Learning).toBe("learning");
  });

  it("Improving level value is 'improving'", () => {
    expect(MasteryLevel.Improving).toBe("improving");
  });

  it("BoardroomReady level value is 'boardroom_ready'", () => {
    expect(MasteryLevel.BoardroomReady).toBe("boardroom_ready");
  });

  it("Mastered level value is 'mastered'", () => {
    expect(MasteryLevel.Mastered).toBe("mastered");
  });

  it("has exactly 5 levels", () => {
    // TypeScript string enums only expose the key→value direction
    const values = Object.values(MasteryLevel);
    expect(values.length).toBe(5);
  });

  it("all levels have string values", () => {
    for (const v of Object.values(MasteryLevel)) {
      expect(typeof v).toBe("string");
    }
  });
});
