/**
 * Regression test suite — end-to-end scenario coverage.
 *
 * These tests verify complete user flows and cross-module interactions,
 * ensuring that individual unit fixes don't break the integrated behavior.
 */
import { describe, it, expect, vi } from "vitest";
import {
  getScoreBand,
  getScoreBandLabel,
  getScoreBandColor,
  MasteryLevel,
} from "@/types";
import { lookupWord, getAllWords } from "@/lib/phonemes/dictionary";
import { BENGALI_TRANSFER_PATTERNS, getPatternById } from "@/lib/phonemes/bengali-patterns";
import { DEFAULT_WORD_WEIGHTS, validateWeights } from "@/lib/scoring/weights";
import {
  getFileExtension,
  isRecordingSupported,
  detectSupportedMimeType,
} from "@/lib/audio/formats";
import { getTTSProvider } from "@/lib/tts/provider";
import { scoreWordAttempt } from "@/lib/scoring/engine";

// ============================================================
// SCENARIO 1: User pronounces a technical word — full score flow
// ============================================================
describe("SCENARIO: Full word pronunciation attempt flow", () => {
  it("orchestration attempt returns valid scored result", async () => {
    const blob = new Blob(["mock"], { type: "audio/webm" });
    const result = await scoreWordAttempt("orchestration", blob, 2100);

    // Contract: always beta
    expect(result.isBeta).toBe(true);

    // Contract: scores in range
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);

    // Contract: score band is derivable from the score
    const band = getScoreBand(result.overallScore);
    expect(getScoreBandLabel(band)).toBeTruthy();
    expect(getScoreBandColor(band)).toMatch(/^#[0-9a-fA-F]{6}$/);

    // Contract: 4 syllables for orchestration
    expect(result.syllables.length).toBe(4);

    // Contract: exactly one stressed syllable
    expect(result.syllables.filter((s) => s.isStressed).length).toBe(1);

    // Contract: weighted score is consistent with components
    const { pronunciation, wordStress, timing, clarity } = result.components;
    const manual = Math.round(pronunciation * 0.6 + wordStress * 0.2 + timing * 0.1 + clarity * 0.1);
    expect(Math.abs(result.overallScore - manual)).toBeLessThanOrEqual(2);
  });

  it("all 15 required words can be scored without throwing", async () => {
    const words = [
      "orchestration", "architecture", "kubernetes", "authentication",
      "infrastructure", "scalability", "availability", "observability",
      "algorithm", "governance", "resilience", "autonomous",
      "generative", "intelligence", "artificial",
    ];
    const blob = new Blob(["mock"], { type: "audio/webm" });
    for (const word of words) {
      await expect(scoreWordAttempt(word, blob, 1500)).resolves.toBeDefined();
    }
  });
});

// ============================================================
// SCENARIO 2: Score bands cover the entire 0-100 range
// ============================================================
describe("SCENARIO: Score band classification is exhaustive", () => {
  it("every integer 0–100 maps to a valid band with label and color", () => {
    for (let score = 0; score <= 100; score++) {
      const band = getScoreBand(score);
      expect(band, `score ${score} has no band`).toBeTruthy();
      expect(getScoreBandLabel(band), `band ${band} has no label`).toBeTruthy();
      expect(getScoreBandColor(band), `band ${band} has no color`).toMatch(/^#/);
    }
  });

  it("score bands cover exactly 5 distinct values", () => {
    const bands = new Set<string>();
    for (let s = 0; s <= 100; s++) bands.add(getScoreBand(s));
    expect(bands.size).toBe(5);
  });
});

// ============================================================
// SCENARIO 3: Bengali pattern engine covers all transfer patterns
// ============================================================
describe("SCENARIO: Bengali error pattern coverage", () => {
  it("all 7 transfer patterns have full articulation data", () => {
    expect(BENGALI_TRANSFER_PATTERNS.length).toBeGreaterThanOrEqual(7);
    for (const p of BENGALI_TRANSFER_PATTERNS) {
      expect(p.id).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.articulationGuidance.length).toBeGreaterThan(30);
      expect(p.exampleWords.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("V/W and both TH patterns are present and distinct", () => {
    const vw = getPatternById("v_w_confusion");
    const thV = getPatternById("th_voiceless");
    const thD = getPatternById("th_voiced");
    expect(vw).toBeDefined();
    expect(thV).toBeDefined();
    expect(thD).toBeDefined();
    expect(thV!.articulationGuidance).not.toBe(thD!.articulationGuidance);
  });
});

// ============================================================
// SCENARIO 4: Phoneme dictionary is internally consistent
// ============================================================
describe("SCENARIO: Dictionary integrity across all entries", () => {
  it("no word has a stressIndex out of its syllable bounds", () => {
    const issues: string[] = [];
    for (const entry of getAllWords()) {
      if (entry.stressIndex < 0 || entry.stressIndex >= entry.syllables.length) {
        issues.push(`${entry.word}: stressIndex=${entry.stressIndex}, syllables=${entry.syllables.length}`);
      }
    }
    expect(issues, `Stress index out of bounds: ${issues.join(", ")}`).toHaveLength(0);
  });

  it("no word has empty syllables array", () => {
    const issues = getAllWords().filter((e) => e.syllables.length === 0).map((e) => e.word);
    expect(issues, `Words with empty syllables: ${issues.join(", ")}`).toHaveLength(0);
  });

  it("no word has empty IPA", () => {
    const issues = getAllWords().filter((e) => !e.ipa.trim()).map((e) => e.word);
    expect(issues, `Words with empty IPA: ${issues.join(", ")}`).toHaveLength(0);
  });

  it("lookupWord and getAllWords are consistent", () => {
    for (const entry of getAllWords()) {
      const found = lookupWord(entry.word);
      expect(found, `getAllWords contains ${entry.word} but lookupWord can't find it`).toBeDefined();
      expect(found?.ipa).toBe(entry.ipa);
    }
  });
});

// ============================================================
// SCENARIO 5: Audio pipeline — format detection and recording
// ============================================================
describe("SCENARIO: Audio format detection pipeline", () => {
  it("detectSupportedMimeType returns a usable audio format", () => {
    const mime = detectSupportedMimeType();
    expect(mime).toMatch(/^audio\//);
    const ext = getFileExtension(mime);
    expect(["webm", "ogg", "mp4"]).toContain(ext);
  });

  it("isRecordingSupported reflects MediaRecorder availability", () => {
    expect(typeof isRecordingSupported()).toBe("boolean");
    // In test env, MediaRecorder is mocked → should be true
    expect(isRecordingSupported()).toBe(true);
  });

  it("all standard formats produce a valid extension", () => {
    const formats = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
      "audio/mp4",
    ];
    for (const f of formats) {
      const ext = getFileExtension(f);
      expect(["webm", "ogg", "mp4"]).toContain(ext);
    }
  });
});

// ============================================================
// SCENARIO 6: TTS provider is available and functional
// ============================================================
describe("SCENARIO: TTS provider integration", () => {
  it("provider is available and can speak without error", () => {
    const provider = getTTSProvider();
    expect(provider.isAvailable()).toBe(true);
    expect(() => provider.speak("orchestration")).not.toThrow();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it("provider can speak at 0.75x speed for learning mode", () => {
    const provider = getTTSProvider();
    expect(() => provider.speak("authentication", { rate: 0.75 })).not.toThrow();
  });

  it("cancel before speak clears any previous utterance", () => {
    const provider = getTTSProvider();
    provider.speak("first word");
    provider.speak("second word"); // cancel() is called internally before each speak
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(2);
  });
});

// ============================================================
// SCENARIO 7: Scoring weights are always valid
// ============================================================
describe("SCENARIO: Scoring weight validation", () => {
  it("default weights pass validation", () => {
    expect(validateWeights(DEFAULT_WORD_WEIGHTS)).toBe(true);
  });

  it("custom weights summing to 1.0 pass validation", () => {
    expect(validateWeights({ pronunciation: 0.5, wordStress: 0.3, timing: 0.1, clarity: 0.1 })).toBe(true);
    expect(validateWeights({ pronunciation: 0.4, wordStress: 0.3, timing: 0.2, clarity: 0.1 })).toBe(true);
  });

  it("weights not summing to 1.0 fail validation", () => {
    expect(validateWeights({ pronunciation: 0.5, wordStress: 0.3, timing: 0.1, clarity: 0.05 })).toBe(false);
  });

  it("pronunciation is the dominant weight (>= 0.5)", () => {
    expect(DEFAULT_WORD_WEIGHTS.pronunciation).toBeGreaterThanOrEqual(0.5);
  });
});

// ============================================================
// SCENARIO 8: MasteryLevel progression is ordered correctly
// ============================================================
describe("SCENARIO: MasteryLevel string values are correct", () => {
  it("levels form a sensible progression sequence", () => {
    const levels = [
      MasteryLevel.New,
      MasteryLevel.Learning,
      MasteryLevel.Improving,
      MasteryLevel.BoardroomReady,
      MasteryLevel.Mastered,
    ];
    // All levels are distinct strings
    const unique = new Set(levels);
    expect(unique.size).toBe(5);
  });

  it("New is the starting level", () => {
    expect(MasteryLevel.New).toBe("new");
  });

  it("Mastered is the terminal level", () => {
    expect(MasteryLevel.Mastered).toBe("mastered");
  });

  it("BoardroomReady is a distinct executive milestone", () => {
    expect(MasteryLevel.BoardroomReady).toBe("boardroom_ready");
  });
});

// ============================================================
// SCENARIO 9: Edge cases that must never crash the app
// ============================================================
describe("SCENARIO: Robustness / never-crash guarantees", () => {
  it("scoreWordAttempt with 0ms duration doesn't throw", async () => {
    const blob = new Blob(["x"], { type: "audio/webm" });
    await expect(scoreWordAttempt("algorithm", blob, 0)).resolves.toBeDefined();
  });

  it("scoreWordAttempt with unknown word doesn't throw", async () => {
    const blob = new Blob(["x"], { type: "audio/webm" });
    await expect(scoreWordAttempt("pneumonoultramicroscopicsilicovolcanoconiosis", blob, 1000))
      .resolves.toBeDefined();
  });

  it("lookupWord never throws regardless of input", () => {
    const inputs = ["", "   ", "123", "!@#", "A".repeat(100), "résumé"];
    for (const input of inputs) {
      expect(() => lookupWord(input)).not.toThrow();
    }
  });

  it("getScoreBand handles boundary integers without throwing", () => {
    for (const score of [-1, 0, 1, 59, 60, 69, 70, 79, 80, 89, 90, 100, 101]) {
      expect(() => getScoreBand(score)).not.toThrow();
    }
  });

  it("getFileExtension never throws", () => {
    const inputs = ["", "text/plain", "video/mp4", "audio/", "audio/webm;codecs=opus;extra=param"];
    for (const input of inputs) {
      expect(() => getFileExtension(input)).not.toThrow();
    }
  });

  it("getTTSProvider never returns null", () => {
    expect(getTTSProvider()).not.toBeNull();
    expect(getTTSProvider()).not.toBeUndefined();
  });
});
