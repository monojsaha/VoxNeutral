import { updateWordMastery, getWordsDueForReview } from "@/lib/firebase/firestore";
import type { WordMastery } from "@/types";

export async function recordAttemptMastery(
  userId: string,
  wordId: string,
  word: string,
  score: number
): Promise<void> {
  return updateWordMastery(userId, wordId, word, score);
}

export async function getDueWords(userId: string, limit: number): Promise<WordMastery[]> {
  return getWordsDueForReview(userId, limit);
}
