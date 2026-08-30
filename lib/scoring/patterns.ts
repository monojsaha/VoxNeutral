import type { DetectedErrorPattern, StoredErrorPattern, ErrorPatternType } from "@/types";
import { upsertErrorPattern, getUserErrorPatterns } from "@/lib/firebase/firestore";

export async function upsertErrorPatterns(
  userId: string,
  patterns: DetectedErrorPattern[]
): Promise<void> {
  const significant = patterns.filter((p) => p.confidence >= 0.5);
  await Promise.all(
    significant.map((p) =>
      upsertErrorPattern(userId, p.type, p.affectedWords, p.confidence)
    )
  );
}

export async function getUserPatternsForDisplay(userId: string): Promise<StoredErrorPattern[]> {
  return getUserErrorPatterns(userId);
}

export function describePatternType(type: ErrorPatternType): string {
  switch (type) {
    case "v_w_confusion":
      return "V / W Confusion";
    case "th_voiceless":
      return "Voiceless TH → T";
    case "th_voiced":
      return "Voiced TH → D";
    case "short_long_vowel":
      return "Short /ɪ/ vs Long /iː/";
    case "final_consonant_weakening":
      return "Weak Final Consonants";
    case "vowel_insertion":
      return "Vowel Insertion in Clusters";
    case "word_stress_equal_weighting":
      return "Equal Syllable Stress";
    case "other":
    default:
      return "Other Pattern";
  }
}
