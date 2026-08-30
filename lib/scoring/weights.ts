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
  const total = weights.pronunciation + weights.wordStress + weights.timing + weights.clarity;
  return Math.abs(total - 1.0) < 0.001;
}
