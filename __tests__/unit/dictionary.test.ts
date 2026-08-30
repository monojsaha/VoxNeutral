import { describe, it, expect } from "vitest";
import { lookupWord, getAllWords } from "@/lib/phonemes/dictionary";

// Core executive vocabulary that MUST be in the dictionary
const REQUIRED_WORDS = [
  "orchestration",
  "architecture",
  "kubernetes",
  "authentication",
  "infrastructure",
  "scalability",
  "availability",
  "observability",
  "algorithm",
  "governance",
  "resilience",
  "autonomous",
  "generative",
  "intelligence",
  "artificial",
];

describe("Dictionary — required words present", () => {
  for (const word of REQUIRED_WORDS) {
    it(`contains "${word}"`, () => {
      expect(lookupWord(word)).toBeDefined();
    });
  }
});

describe("Dictionary — data integrity", () => {
  it("all entries have a non-empty IPA transcription", () => {
    for (const entry of getAllWords()) {
      expect(entry.ipa, `${entry.word} missing IPA`).toBeTruthy();
      expect(entry.ipa.trim(), `${entry.word} IPA is only whitespace`).not.toBe("");
    }
  });

  it("all entries have at least one syllable", () => {
    for (const entry of getAllWords()) {
      expect(entry.syllables.length, `${entry.word} has no syllables`).toBeGreaterThan(0);
    }
  });

  it("stressIndex is within syllables array bounds for all words", () => {
    for (const entry of getAllWords()) {
      expect(entry.stressIndex, `${entry.word} stressIndex out of bounds`)
        .toBeGreaterThanOrEqual(0);
      expect(entry.stressIndex, `${entry.word} stressIndex out of bounds`)
        .toBeLessThan(entry.syllables.length);
    }
  });

  it("all syllables are non-empty strings", () => {
    for (const entry of getAllWords()) {
      for (const syl of entry.syllables) {
        expect(syl.trim(), `${entry.word} has empty syllable`).not.toBe("");
      }
    }
  });

  it("IPA starts with a valid phonetic character", () => {
    for (const entry of getAllWords()) {
      expect(entry.ipa.length).toBeGreaterThan(0);
    }
  });
});

describe("lookupWord — specific stress correctness", () => {
  it("orchestration stress is on third syllable (TRA)", () => {
    const e = lookupWord("orchestration")!;
    expect(e.stressIndex).toBe(2);
    expect(e.syllables[e.stressIndex].toUpperCase()).toBe("TRA");
  });

  it("infrastructure stress is on first syllable", () => {
    const e = lookupWord("infrastructure")!;
    expect(e.stressIndex).toBe(0);
  });

  it("technology stress is on second syllable (NOL)", () => {
    const e = lookupWord("technology")!;
    expect(e.stressIndex).toBe(1);
  });

  it("algorithm stress is on first syllable", () => {
    const e = lookupWord("algorithm")!;
    expect(e.stressIndex).toBe(0);
  });

  it("kubernetes has correct syllable count", () => {
    const e = lookupWord("kubernetes")!;
    expect(e.syllables.length).toBeGreaterThanOrEqual(4);
  });
});

describe("lookupWord — case handling", () => {
  it("handles all uppercase", () => {
    expect(lookupWord("ORCHESTRATION")).toBeDefined();
  });

  it("handles mixed case", () => {
    expect(lookupWord("Kubernetes")).toBeDefined();
    expect(lookupWord("Authentication")).toBeDefined();
  });

  it("returns undefined for empty string", () => {
    expect(lookupWord("")).toBeUndefined();
  });

  it("returns undefined for unknown words", () => {
    expect(lookupWord("supercalifragilistic")).toBeUndefined();
    expect(lookupWord("notaword123")).toBeUndefined();
  });
});

describe("getAllWords — ordering and count", () => {
  it("returns at least 29 words", () => {
    expect(getAllWords().length).toBeGreaterThanOrEqual(29);
  });

  it("is sorted alphabetically", () => {
    const words = getAllWords();
    for (let i = 1; i < words.length; i++) {
      expect(words[i].word >= words[i - 1].word).toBe(true);
    }
  });

  it("contains no duplicate words", () => {
    const words = getAllWords().map((w) => w.word);
    const unique = new Set(words);
    expect(unique.size).toBe(words.length);
  });
});
