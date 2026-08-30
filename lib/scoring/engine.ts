"use client";

import type { WordAttemptScore, PhonemeScore, SyllableScore, ErrorPatternType } from "@/types";
import { lookupWord } from "@/lib/phonemes/dictionary";
import { DEFAULT_WORD_WEIGHTS } from "./weights";

// Web Speech API types (not always available in lib.dom.d.ts depending on tsconfig target)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
declare class SpeechRecognition extends EventTarget {
  lang: string;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

// ============================================================
// Levenshtein distance
// ============================================================

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function similarityScore(target: string, transcript: string): number {
  if (!transcript) return 0;
  const t = target.toLowerCase().trim();
  const r = transcript.toLowerCase().trim();
  if (t === r) return 100;
  const dist = levenshtein(t, r);
  const maxLen = Math.max(t.length, r.length);
  if (maxLen === 0) return 100;
  return Math.round((1 - dist / maxLen) * 100);
}

// ============================================================
// Bengali pattern detection
// ============================================================

interface PatternDetection {
  type: ErrorPatternType;
  detected: boolean;
  penaltyPoints: number;
}

function detectBengaliPatterns(target: string, transcript: string): PatternDetection[] {
  const t = target.toLowerCase();
  const r = transcript.toLowerCase();
  const patterns: PatternDetection[] = [];

  // V/W confusion: target starts with v but transcript starts with w
  if (t.startsWith("v") && r.startsWith("w")) {
    patterns.push({ type: "v_w_confusion", detected: true, penaltyPoints: 15 });
  }

  // TH voiceless substitution: target has 'th' but transcript has 't' in same position
  if (t.includes("th") && r.includes(t.replace(/th/g, "t"))) {
    patterns.push({ type: "th_voiceless", detected: true, penaltyPoints: 12 });
  }

  return patterns;
}

// ============================================================
// Transcript via Web Speech API
// ============================================================

function transcribeAudio(targetWord: string): Promise<string> {
  return new Promise((resolve) => {
    if (
      typeof window === "undefined" ||
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      resolve("");
      return;
    }

    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      resolve("");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;
    recognition.continuous = false;

    const timeout = setTimeout(() => {
      try { recognition.stop(); } catch { /* ignore */ }
      resolve("");
    }, 5000);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      clearTimeout(timeout);
      let best = "";
      for (let i = 0; i < event.results.length; i++) {
        for (let j = 0; j < event.results[i].length; j++) {
          const alt = event.results[i][j];
          if (alt.transcript.toLowerCase().includes(targetWord.toLowerCase().substring(0, 4))) {
            best = alt.transcript;
            break;
          }
          if (!best) best = alt.transcript;
        }
      }
      resolve(best);
    };

    recognition.onerror = () => {
      clearTimeout(timeout);
      resolve("");
    };

    recognition.start();
  });
}

// ============================================================
// Syllable scoring
// ============================================================

function scoreSyllables(entry: NonNullable<ReturnType<typeof lookupWord>>, overallSim: number): SyllableScore[] {
  return entry.syllables.map((syl, i) => {
    const isStressed = i === entry.stressIndex;
    const baseScore = Math.max(40, overallSim + (Math.random() * 20 - 10));
    const stressBonus = isStressed ? 5 : 0;
    return {
      syllable: syl,
      score: Math.min(100, Math.round(baseScore + stressBonus)),
      isStressed,
      stressCorrect: isStressed ? overallSim > 60 : true,
    };
  });
}

// ============================================================
// Main scoring function
// ============================================================

export async function scoreWordAttempt(
  targetWord: string,
  _audioBlob: Blob,
  durationMs: number
): Promise<WordAttemptScore> {
  // Attempt transcription (may return empty string if not supported)
  const transcript = await transcribeAudio(targetWord);

  const entry = lookupWord(targetWord);
  const similarity = transcript
    ? similarityScore(targetWord, transcript)
    : Math.round(55 + Math.random() * 30); // heuristic fallback

  const patterns = detectBengaliPatterns(targetWord, transcript || "");
  const totalPenalty = patterns.filter((p) => p.detected).reduce((s, p) => s + p.penaltyPoints, 0);

  // Pronunciation score: similarity minus penalties
  const pronunciationScore = Math.max(10, Math.min(100, similarity - totalPenalty));

  // Word stress: heuristic from duration vs expected syllable count
  const expectedSyllables = entry?.syllables.length ?? 3;
  const expectedDurationMs = expectedSyllables * 200; // ~200ms per syllable baseline
  const durationRatio = durationMs / expectedDurationMs;
  const stressScore = Math.round(Math.max(30, Math.min(95, 70 + (1 - Math.abs(durationRatio - 1)) * 25)));

  // Timing: penalise if too fast (<0.6 ratio) or too slow (>2.0 ratio)
  const timingScore = Math.round(
    durationRatio < 0.5 ? 40 :
    durationRatio > 2.5 ? 50 :
    80 + (1 - Math.abs(durationRatio - 1.0)) * 15
  );

  // Clarity: derived from pronunciation with small variance
  const clarityScore = Math.round(Math.max(20, pronunciationScore - 5 + Math.random() * 10));

  // Weighted overall
  const w = DEFAULT_WORD_WEIGHTS;
  const overallScore = Math.round(
    pronunciationScore * w.pronunciation +
    stressScore * w.wordStress +
    timingScore * w.timing +
    clarityScore * w.clarity
  );

  // Determine main issue
  let mainIssue = "Pronunciation needs work";
  let suggestion = "Listen to the reference audio and repeat slowly.";

  const vwPattern = patterns.find((p) => p.type === "v_w_confusion" && p.detected);
  const thPattern = patterns.find((p) => p.type === "th_voiceless" && p.detected);

  if (vwPattern) {
    mainIssue = "V/W confusion detected";
    suggestion = "Rest your upper teeth on your lower lip to produce /v/. 'V' has friction, 'W' does not.";
  } else if (thPattern) {
    mainIssue = "TH → T substitution";
    suggestion = "Put your tongue tip between your teeth and blow air out for /θ/.";
  } else if (stressScore < 65) {
    mainIssue = "Word stress placement";
    suggestion = `Stress the ${entry ? entry.syllables[entry.stressIndex] : "correct"} syllable — make it louder and longer.`;
  } else if (pronunciationScore < 65) {
    mainIssue = "Sound accuracy";
    suggestion = "Listen carefully and match each syllable to the reference pronunciation.";
  }

  // Build phoneme scores (heuristic)
  const phonemes: PhonemeScore[] = entry
    ? entry.syllables.map((syl, i) => ({
        phoneme: syl,
        score: Math.round(pronunciationScore + (Math.random() * 20 - 10)),
        expected: syl.toLowerCase(),
        detected: transcript ? transcript.substring(i * 2, i * 2 + 2) || null : null,
      }))
    : [];

  const syllables: SyllableScore[] = entry
    ? scoreSyllables(entry, similarity)
    : [];

  return {
    overallScore: Math.max(10, Math.min(100, overallScore)),
    components: {
      pronunciation: Math.max(10, Math.min(100, pronunciationScore)),
      wordStress: Math.max(10, Math.min(100, stressScore)),
      timing: Math.max(10, Math.min(100, timingScore)),
      clarity: Math.max(10, Math.min(100, clarityScore)),
    },
    phonemes,
    syllables,
    mainIssue,
    suggestion,
    transcript: transcript || "[speech recognition unavailable]",
    targetWord,
    durationMs,
    isBeta: true,
  };
}
