import { describe, it, expect } from "vitest";
import {
  getScoreBand,
  getScoreBandLabel,
  getScoreBandColor,
} from "@/types";
import { lookupWord, getAllWords } from "@/lib/phonemes/dictionary";

describe("getScoreBand", () => {
  it("returns excellent for score >= 90", () => {
    expect(getScoreBand(90)).toBe("excellent");
    expect(getScoreBand(100)).toBe("excellent");
    expect(getScoreBand(95)).toBe("excellent");
  });

  it("returns good for score 80-89", () => {
    expect(getScoreBand(80)).toBe("good");
    expect(getScoreBand(85)).toBe("good");
    expect(getScoreBand(89)).toBe("good");
  });

  it("returns fair for score 70-79", () => {
    expect(getScoreBand(70)).toBe("fair");
    expect(getScoreBand(75)).toBe("fair");
    expect(getScoreBand(79)).toBe("fair");
  });

  it("returns developing for score 60-69", () => {
    expect(getScoreBand(60)).toBe("developing");
    expect(getScoreBand(65)).toBe("developing");
    expect(getScoreBand(69)).toBe("developing");
  });

  it("returns needs_work for score below 60", () => {
    expect(getScoreBand(59)).toBe("needs_work");
    expect(getScoreBand(0)).toBe("needs_work");
    expect(getScoreBand(30)).toBe("needs_work");
  });
});

describe("getScoreBandLabel", () => {
  it("returns correct human-readable labels", () => {
    expect(getScoreBandLabel("excellent")).toBe("Excellent");
    expect(getScoreBandLabel("good")).toBe("Good");
    expect(getScoreBandLabel("fair")).toBe("Fair");
    expect(getScoreBandLabel("developing")).toBe("Developing");
    expect(getScoreBandLabel("needs_work")).toBe("Needs Work");
  });
});

describe("getScoreBandColor", () => {
  it("returns hex color strings", () => {
    const color = getScoreBandColor("excellent");
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("returns green for excellent", () => {
    expect(getScoreBandColor("excellent")).toBe("#22c55e");
  });

  it("returns red for needs_work", () => {
    expect(getScoreBandColor("needs_work")).toBe("#ef4444");
  });
});

describe("lookupWord", () => {
  it("returns a phoneme entry for a known word", () => {
    const entry = lookupWord("algorithm");
    expect(entry).toBeDefined();
    expect(entry?.word).toBe("algorithm");
    expect(entry?.ipa).toBeTruthy();
    expect(Array.isArray(entry?.syllables)).toBe(true);
    expect(entry?.syllables.length).toBeGreaterThan(0);
    expect(typeof entry?.stressIndex).toBe("number");
  });

  it("returns undefined for unknown words", () => {
    expect(lookupWord("notaword")).toBeUndefined();
    expect(lookupWord("")).toBeUndefined();
  });

  it("is case-insensitive", () => {
    expect(lookupWord("Algorithm")).toBeDefined();
    expect(lookupWord("KUBERNETES")).toBeDefined();
  });

  it("returns correct stress index for orchestration", () => {
    const entry = lookupWord("orchestration");
    expect(entry?.stressIndex).toBe(2);
    expect(entry?.syllables[entry.stressIndex]).toBe("TRA");
  });

  it("returns correct stress index for infrastructure", () => {
    const entry = lookupWord("infrastructure");
    expect(entry?.stressIndex).toBe(0);
  });
});

describe("getAllWords", () => {
  it("returns at least 29 words", () => {
    const words = getAllWords();
    expect(words.length).toBeGreaterThanOrEqual(29);
  });

  it("returns sorted alphabetically", () => {
    const words = getAllWords();
    for (let i = 1; i < words.length; i++) {
      expect(words[i].word >= words[i - 1].word).toBe(true);
    }
  });

  it("all entries have required fields", () => {
    const words = getAllWords();
    for (const entry of words) {
      expect(entry.word).toBeTruthy();
      expect(entry.ipa).toBeTruthy();
      expect(Array.isArray(entry.syllables)).toBe(true);
      expect(entry.syllables.length).toBeGreaterThan(0);
      expect(typeof entry.stressIndex).toBe("number");
      expect(entry.stressIndex).toBeGreaterThanOrEqual(0);
      expect(entry.stressIndex).toBeLessThan(entry.syllables.length);
    }
  });
});
