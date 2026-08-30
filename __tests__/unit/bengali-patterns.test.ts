import { describe, it, expect } from "vitest";
import {
  BENGALI_TRANSFER_PATTERNS,
  getPatternById,
} from "@/lib/phonemes/bengali-patterns";

describe("BENGALI_TRANSFER_PATTERNS", () => {
  it("has exactly 7 patterns", () => {
    expect(BENGALI_TRANSFER_PATTERNS).toHaveLength(7);
  });

  it("all patterns have required fields", () => {
    for (const pattern of BENGALI_TRANSFER_PATTERNS) {
      expect(pattern.id).toBeTruthy();
      expect(typeof pattern.id).toBe("string");
      expect(pattern.name).toBeTruthy();
      expect(pattern.sourcePhoneme).toBeTruthy();
      expect(pattern.targetPhoneme).toBeTruthy();
      expect(pattern.description).toBeTruthy();
      expect(pattern.articulationGuidance).toBeTruthy();
      expect(Array.isArray(pattern.exampleWords)).toBe(true);
      expect(pattern.exampleWords.length).toBeGreaterThan(0);
    }
  });

  it("includes the 7 required pattern IDs", () => {
    const ids = BENGALI_TRANSFER_PATTERNS.map((p) => p.id);
    expect(ids).toContain("v_w_confusion");
    expect(ids).toContain("th_voiceless");
    expect(ids).toContain("th_voiced");
    expect(ids).toContain("short_long_vowel");
    expect(ids).toContain("final_consonant_weakening");
    expect(ids).toContain("vowel_insertion");
    expect(ids).toContain("word_stress_equal_weighting");
  });

  it("v_w_confusion has minimal pairs", () => {
    const pattern = BENGALI_TRANSFER_PATTERNS.find((p) => p.id === "v_w_confusion");
    expect(pattern?.minimalPairs).toBeDefined();
    expect(pattern?.minimalPairs?.length).toBeGreaterThan(0);
  });

  it("th_voiceless has meaningful articulation guidance", () => {
    const pattern = BENGALI_TRANSFER_PATTERNS.find((p) => p.id === "th_voiceless");
    expect(pattern?.articulationGuidance.length).toBeGreaterThan(50);
  });
});

describe("getPatternById", () => {
  it("returns the correct pattern for a known id", () => {
    const pattern = getPatternById("v_w_confusion");
    expect(pattern).toBeDefined();
    expect(pattern?.id).toBe("v_w_confusion");
    expect(pattern?.name).toBe("V / W Confusion");
  });

  it("returns undefined for an unknown id", () => {
    expect(getPatternById("nonexistent_id")).toBeUndefined();
    expect(getPatternById("")).toBeUndefined();
  });

  it("returns correct pattern for th_voiced", () => {
    const pattern = getPatternById("th_voiced");
    expect(pattern?.id).toBe("th_voiced");
    expect(pattern?.targetPhoneme).toContain("/ð/");
  });
});
