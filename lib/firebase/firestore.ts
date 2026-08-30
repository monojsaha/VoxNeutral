"use client";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  serverTimestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { app } from "./config";
import type {
  UserProfile,
  UserSettings,
  WordMastery,
  MasteryLevel,
  StoredErrorPattern,
  ErrorPatternType,
  AttemptResult,
} from "@/types";

const db = getFirestore(app);

// ============================================================
// Profile
// ============================================================

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const ref = doc(db, "users", userId, "profile", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function setProfile(userId: string, profile: UserProfile): Promise<void> {
  const ref = doc(db, "users", userId, "profile", "data");
  await setDoc(ref, profile, { merge: true });
}

// ============================================================
// Settings
// ============================================================

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const ref = doc(db, "users", userId, "settings", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserSettings) : null;
}

export async function setUserSettings(userId: string, settings: UserSettings): Promise<void> {
  const ref = doc(db, "users", userId, "settings", "data");
  await setDoc(ref, settings, { merge: true });
}

// ============================================================
// Words (public collection)
// ============================================================

export async function getWords(constraints?: QueryConstraint[]): Promise<unknown[]> {
  const ref = collection(db, "words");
  const q = constraints ? query(ref, ...constraints) : ref;
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================================
// Sessions
// ============================================================

export async function createSession(userId: string, sessionType: string): Promise<string> {
  const ref = collection(db, "users", userId, "sessions");
  const docRef = await addDoc(ref, {
    userId,
    sessionType,
    startedAt: Date.now(),
    completedAt: null,
    wordCount: 0,
    averageScore: null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function completeSession(
  userId: string,
  sessionId: string,
  wordCount: number,
  averageScore: number
): Promise<void> {
  const ref = doc(db, "users", userId, "sessions", sessionId);
  await updateDoc(ref, {
    completedAt: Date.now(),
    wordCount,
    averageScore,
  });
}

// ============================================================
// Attempts
// ============================================================

export async function saveAttempt(userId: string, attempt: Omit<AttemptResult, "id">): Promise<string> {
  const ref = collection(db, "users", userId, "attempts");
  const docRef = await addDoc(ref, {
    ...attempt,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getRecentAttempts(userId: string, limitCount: number): Promise<AttemptResult[]> {
  const ref = collection(db, "users", userId, "attempts");
  const q = query(ref, orderBy("timestamp", "desc"), firestoreLimit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AttemptResult));
}

// ============================================================
// Error patterns
// ============================================================

export async function upsertErrorPattern(
  userId: string,
  patternType: ErrorPatternType,
  affectedWords: string[],
  confidence: number
): Promise<void> {
  const ref = doc(db, "users", userId, "error_patterns", patternType);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const existing = snap.data() as StoredErrorPattern;
    const mergedWords = Array.from(new Set([...existing.affectedWords, ...affectedWords]));
    await updateDoc(ref, {
      occurrenceCount: existing.occurrenceCount + 1,
      affectedWords: mergedWords,
      lastSeen: Date.now(),
      confidence: Math.max(existing.confidence, confidence),
      updatedAt: Date.now(),
    });
  } else {
    const pattern: StoredErrorPattern = {
      userId,
      patternType,
      occurrenceCount: 1,
      affectedWords,
      lastSeen: Date.now(),
      trend: "stable",
      confidence,
      updatedAt: Date.now(),
    };
    await setDoc(ref, pattern);
  }
}

export async function getUserErrorPatterns(userId: string): Promise<StoredErrorPattern[]> {
  const ref = collection(db, "users", userId, "error_patterns");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as StoredErrorPattern);
}

// ============================================================
// Word mastery (spaced repetition)
// ============================================================

const MASTERY_THRESHOLDS = {
  new: 0,
  learning: 60,
  improving: 70,
  boardroom_ready: 80,
  mastered: 90,
};

const EASE_INTERVALS: Record<string, number> = {
  new: 1,
  learning: 3,
  improving: 7,
  boardroom_ready: 14,
  mastered: 30,
};

function computeNextLevel(score: number, currentLevel: MasteryLevel): MasteryLevel {
  const { MasteryLevel } = require("@/types") as { MasteryLevel: typeof import("@/types").MasteryLevel };
  if (score >= MASTERY_THRESHOLDS.mastered) return MasteryLevel.Mastered;
  if (score >= MASTERY_THRESHOLDS.boardroom_ready) return MasteryLevel.BoardroomReady;
  if (score >= MASTERY_THRESHOLDS.improving) return MasteryLevel.Improving;
  if (score >= MASTERY_THRESHOLDS.learning) return MasteryLevel.Learning;
  return currentLevel;
}

export async function updateWordMastery(
  userId: string,
  wordId: string,
  word: string,
  score: number
): Promise<void> {
  const ref = doc(db, "users", userId, "mastery", wordId);
  const snap = await getDoc(ref);

  const now = Date.now();

  if (snap.exists()) {
    const existing = snap.data() as WordMastery;
    const newLevel = computeNextLevel(score, existing.level);
    const intervalDays = EASE_INTERVALS[newLevel] ?? 1;
    const nextReview = now + intervalDays * 86400000;

    await updateDoc(ref, {
      level: newLevel,
      lastScore: score,
      bestScore: Math.max(existing.bestScore, score),
      attemptCount: existing.attemptCount + 1,
      lastAttemptAt: now,
      nextReviewAt: nextReview,
    });
  } else {
    const { MasteryLevel } = await import("@/types");
    const newMastery: WordMastery = {
      userId,
      wordId,
      word,
      level: MasteryLevel.New,
      lastScore: score,
      bestScore: score,
      attemptCount: 1,
      lastAttemptAt: now,
      nextReviewAt: now + 86400000,
      easinessFactor: 2.5,
    };
    await setDoc(ref, newMastery);
  }
}

export async function getWordsDueForReview(userId: string, limitCount: number): Promise<WordMastery[]> {
  const ref = collection(db, "users", userId, "mastery");
  const now = Date.now();
  const q = query(
    ref,
    where("nextReviewAt", "<=", now),
    orderBy("nextReviewAt", "asc"),
    firestoreLimit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as WordMastery);
}
