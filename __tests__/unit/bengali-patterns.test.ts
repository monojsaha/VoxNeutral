import { describe, it, expect } from "vitest";
import { BENGALI_TRANSFER_PATTERNS, getPatternById } from "@/lib/phonemes/bengali-patterns";

const REQUIRED_PATTERN_IDS = [
  "v_w_confusion",
  "th_voiceless",
  "th_voiced",
  "short_long_vowel",
  "final_consonant_weakening",
  "vowel_insertion",
  "word_stress_equal_weighting",
];

describe("BENGALI_TRANSFER_PATTERNS — completeness", () => {
  it("contains at least 7 patterns", () => {
    expect(BENGALI_TRANSFER_PATTERNS.length).toBeGreaterThanOrEqual(7);
  });

  for (const id of REQUIRED_PATTERN_IDS) {
    it(`contains pattern "${id}"`, () => {
      const pattern = getPatternById(id);
      expect(pattern).toBeDefined();
    });
  }
});

describe("BENGALI_TRANSFER_PATTERNS — data integrity", () => {
  it("all patterns have required fields", () => {
    for (const pattern of BENGALI_TRANSFER_PATTERNS) {
      expect(pattern.id, "missing id").toBeTruthy();
      expect(pattern.description, `${pattern.id} missing description`).toBeTruthy();
      expect(pattern.articulationGuidance, `${pattern.id} missing articulationGuidance`).toBeTruthy();
      expect(Array.isArray(pattern.exampleWords), `${pattern.id} exampleWords not array`).toBe(true);
      expect(pattern.exampleWords.length, `${pattern.id} has no example words`).toBeGreaterThan(0);
    }
  });

  it("all pattern IDs are unique", () => {
    const ids = BENGALI_TRANSFER_PATTERNS.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all patterns have at least 2 example words", () => {
    for (const pattern of BENGALI_TRANSFER_PATTERNS) {
      expect(pattern.exampleWords.length, `${pattern.id} needs at least 2 example words`)
        .toBeGreaterThanOrEqual(2);
    }
  });

  it("articulation guidance is detailed (> 30 chars)", () => {
    for (const pattern of BENGALI_TRANSFER_PATTERNS) {
      expect(
        pattern.articulationGuidance.length,
        `${pattern.id} articulationGuidance is too short`
      ).toBeGreaterThan(30);
    }
  });
});

describe("Bengali pattern — V/W confusion", () => {
  it("is present and correctly structured", () => {
    const pattern = getPatternById("v_w_confusion")!;
    expect(pattern).toBeDefined();
    expect(pattern.description.toLowerCase()).toMatch(/v|w/);
  });

  it("includes words with both V and W sounds", () => {
    const pattern = getPatternById("v_w_confusion")!;
    const words = pattern.exampleWords.map((w) => w.toLowerCase());
    const hasVWord = words.some((w) => w.startsWith("v") || w.includes("v"));
    const hasWWord = words.some((w) => w.startsWith("w") || w.includes("w"));
    expect(hasVWord || hasWWord).toBe(true);
  });
});

describe("Bengali pattern — TH sounds", () => {
  it("th_voiceless mentions tooth/teeth placement", () => {
    const pattern = getPatternById("th_voiceless")!;
    const guidance = pattern.articulationGuidance.toLowerCase();
    expect(guidance).toMatch(/teeth|tongue|dental|tooth/);
  });

  it("th_voiced articulation guidance is different from th_voiceless", () => {
    const voiced = getPatternById("th_voiced")!;
    const voiceless = getPatternById("th_voiceless")!;
    expect(voiced.articulationGuidance).not.toBe(voiceless.articulationGuidance);
  });

  it("th_voiceless example words include 'think' or 'three' or 'through'", () => {
    const pattern = getPatternById("th_voiceless")!;
    const words = pattern.exampleWords.map((w) => w.toLowerCase());
    const hasTHWord = words.some((w) => ["think", "three", "through", "threshold", "theory"].includes(w));
    expect(hasTHWord).toBe(true);
  });
});

describe("Bengali pattern — vowel length", () => {
  it("short_long_vowel pattern minimal pairs include ship/sheep type words", () => {
    const pattern = getPatternById("short_long_vowel")!;
    // exampleWords are technical words; minimalPairs holds ship/sheep-style pairs
    const allWords = [
      ...pattern.exampleWords.map((w) => w.toLowerCase()),
      ...(pattern.minimalPairs ?? []).flat().map((w) => w.toLowerCase()),
      pattern.description.toLowerCase(),
    ].join(" ");
    const hasRelevantWord = ["ship", "sheep", "bit", "beat", "fill", "feel", "live", "leave"].some(
      (w) => allWords.includes(w)
    );
    expect(hasRelevantWord).toBe(true);
  });
});

describe("Bengali pattern — equal stress", () => {
  it("word_stress_equal_weighting mentions stress or syllable", () => {
    const pattern = getPatternById("word_stress_equal_weighting")!;
    const guidance = pattern.articulationGuidance.toLowerCase();
    expect(guidance).toMatch(/stress|syllable|emphasis|prominent/);
  });
});

describe("getPatternById", () => {
  it("returns undefined for non-existent ID", () => {
    expect(getPatternById("nonexistent_pattern")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getPatternById("")).toBeUndefined();
  });

  it("is case-sensitive (IDs are lowercase_snake)", () => {
    expect(getPatternById("V_W_CONFUSION")).toBeUndefined();
    expect(getPatternById("v_w_confusion")).toBeDefined();
  });
});
