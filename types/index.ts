// ============================================================
// Core content types
// ============================================================

export interface Word {
  id: string;
  word: string;
  ipa: string;
  syllables: string[];
  stressIndex: number;
  domain: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  tags: string[];
}

export interface MinimalPair {
  id: string;
  word1: Word;
  word2: Word;
  contrastPhoneme1: string;
  contrastPhoneme2: string;
  exampleSentence1: string;
  exampleSentence2: string;
}

export interface Sentence {
  id: string;
  text: string;
  ipaTranscription: string;
  stressMarkedText: string;
  focusPattern: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Paragraph {
  id: string;
  title: string;
  text: string;
  context: string;
  targetPatterns: string[];
  wordCount: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
}

// ============================================================
// Scoring types
// ============================================================

export interface PhonemeScore {
  phoneme: string;
  score: number;
  expected: string;
  detected: string | null;
  issue?: string;
}

export interface SyllableScore {
  syllable: string;
  score: number;
  isStressed: boolean;
  stressCorrect?: boolean;
}

export interface WordAttemptScore {
  overallScore: number;
  components: {
    pronunciation: number;
    wordStress: number;
    timing: number;
    clarity: number;
  };
  phonemes: PhonemeScore[];
  syllables: SyllableScore[];
  mainIssue: string;
  suggestion: string;
  transcript: string;
  targetWord: string;
  durationMs: number;
  isBeta: true; // Always true — heuristic scoring only
}

export interface ProsodicMetrics {
  wordsPerMinute: number;
  pauseCount: number;
  fillerCount: number;
  pitchVariation: number | null;
  energyVariation: number | null;
}

export interface AttemptResult {
  id: string;
  userId: string;
  wordId: string;
  targetWord: string;
  score: WordAttemptScore;
  prosodics?: ProsodicMetrics;
  timestamp: number;
  sessionId: string;
}

// ============================================================
// Error patterns
// ============================================================

export type ErrorPatternType =
  | "v_w_confusion"
  | "th_voiceless"
  | "th_voiced"
  | "short_long_vowel"
  | "final_consonant_weakening"
  | "vowel_insertion"
  | "word_stress_equal_weighting"
  | "other";

export interface DetectedErrorPattern {
  type: ErrorPatternType;
  confidence: number; // 0-1
  affectedWords: string[];
}

export interface StoredErrorPattern {
  userId: string;
  patternType: ErrorPatternType;
  occurrenceCount: number;
  affectedWords: string[];
  lastSeen: number;
  trend: "improving" | "stable" | "worsening";
  confidence: number;
  updatedAt: number;
}

// ============================================================
// User types
// ============================================================

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: number;
  nativeLanguage: string;
  targetAccent: "neutral" | "american" | "british";
  avatarUrl?: string;
}

export interface UserSettings {
  retainAudio: boolean;
  referenceVoice: "neutral" | "american" | "british";
  dailySessionLengthMinutes: number;
  notificationsEnabled: boolean;
}

// ============================================================
// Mastery
// ============================================================

export enum MasteryLevel {
  New = "new",
  Learning = "learning",
  Improving = "improving",
  BoardroomReady = "boardroom_ready",
  Mastered = "mastered",
}

export interface WordMastery {
  userId: string;
  wordId: string;
  word: string;
  level: MasteryLevel;
  lastScore: number;
  bestScore: number;
  attemptCount: number;
  lastAttemptAt: number;
  nextReviewAt: number;
  easinessFactor: number;
}

// ============================================================
// Score band
// ============================================================

export type ScoreBand = "excellent" | "good" | "fair" | "developing" | "needs_work";

export function getScoreBand(score: number): ScoreBand {
  if (score >= 90) return "excellent";
  if (score >= 80) return "good";
  if (score >= 70) return "fair";
  if (score >= 60) return "developing";
  return "needs_work";
}

export function getScoreBandLabel(band: ScoreBand): string {
  switch (band) {
    case "excellent": return "Excellent";
    case "good": return "Good";
    case "fair": return "Fair";
    case "developing": return "Developing";
    case "needs_work": return "Needs Work";
  }
}

export function getScoreBandColor(band: ScoreBand): string {
  switch (band) {
    case "excellent": return "#22c55e";
    case "good": return "#4a63f7";
    case "fair": return "#f59e0b";
    case "developing": return "#f97316";
    case "needs_work": return "#ef4444";
  }
}
