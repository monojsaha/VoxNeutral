export interface ScoringWeights {
  pronunciation: number;
  wordStress: number;
  timing: number;
  clarity: number;
}

export const DEFAULT_WORD_WEIGHTS: ScoringWeights = {
  pronunciation: 0.60,
  wordStress: 0.20,
  timing: 0.10,
  clarity: 0.10,
};

export function validateWeights(weights: ScoringWeights): boolean {
  const values = [weights.pronunciation, weights.wordStress, weights.timing, weights.clarity];
  if (values.some((v) => v < 0)) return false;
  const total = values.reduce((a, b) => a + b, 0);
  return Math.abs(total - 1.0) < 0.001;
}
