import { describe, it, expect } from "vitest";
import { DEFAULT_WORD_WEIGHTS, validateWeights } from "@/lib/scoring/weights";

describe("DEFAULT_WORD_WEIGHTS", () => {
  it("has pronunciation weight of 0.60", () => {
    expect(DEFAULT_WORD_WEIGHTS.pronunciation).toBe(0.60);
  });

  it("has wordStress weight of 0.20", () => {
    expect(DEFAULT_WORD_WEIGHTS.wordStress).toBe(0.20);
  });

  it("has timing weight of 0.10", () => {
    expect(DEFAULT_WORD_WEIGHTS.timing).toBe(0.10);
  });

  it("has clarity weight of 0.10", () => {
    expect(DEFAULT_WORD_WEIGHTS.clarity).toBe(0.10);
  });

  it("weights sum to exactly 1.0", () => {
    const sum =
      DEFAULT_WORD_WEIGHTS.pronunciation +
      DEFAULT_WORD_WEIGHTS.wordStress +
      DEFAULT_WORD_WEIGHTS.timing +
      DEFAULT_WORD_WEIGHTS.clarity;
    expect(sum).toBeCloseTo(1.0, 10);
  });

  it("all weights are between 0 and 1", () => {
    for (const [key, value] of Object.entries(DEFAULT_WORD_WEIGHTS)) {
      expect(value, `${key} should be between 0 and 1`).toBeGreaterThan(0);
      expect(value, `${key} should be between 0 and 1`).toBeLessThanOrEqual(1);
    }
  });
});

describe("validateWeights", () => {
  it("returns true for valid weights summing to 1.0", () => {
    expect(validateWeights({ pronunciation: 0.5, wordStress: 0.2, timing: 0.2, clarity: 0.1 })).toBe(true);
  });

  it("returns true for DEFAULT_WORD_WEIGHTS", () => {
    expect(validateWeights(DEFAULT_WORD_WEIGHTS)).toBe(true);
  });

  it("returns false for weights summing to more than 1.0", () => {
    expect(validateWeights({ pronunciation: 0.6, wordStress: 0.3, timing: 0.2, clarity: 0.1 })).toBe(false);
  });

  it("returns false for weights summing to less than 1.0", () => {
    expect(validateWeights({ pronunciation: 0.3, wordStress: 0.2, timing: 0.1, clarity: 0.1 })).toBe(false);
  });

  it("returns false for negative weights", () => {
    expect(validateWeights({ pronunciation: -0.1, wordStress: 0.7, timing: 0.3, clarity: 0.1 })).toBe(false);
  });
});
