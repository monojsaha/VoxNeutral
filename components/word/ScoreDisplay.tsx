"use client";

import { ScoreRing } from "@/components/ui/ScoreRing";
import { Badge } from "@/components/ui/Badge";
import type { WordAttemptScore } from "@/types";
import type { PhonemeEntry } from "@/lib/phonemes/dictionary";

interface ScoreDisplayProps {
  result: WordAttemptScore;
  entry: PhonemeEntry;
}

const COMPONENT_LABELS: Record<keyof WordAttemptScore["components"], string> = {
  pronunciation: "Phoneme Accuracy",
  wordStress: "Word Stress",
  timing: "Timing",
  clarity: "Clarity",
};

function ComponentBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 80
      ? "bg-success-500"
      : score >= 70
      ? "bg-brand-500"
      : score >= 60
      ? "bg-warning-500"
      : "bg-error-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-neutral-400">{label}</span>
        <span className={`font-semibold ${score >= 80 ? "text-success-500" : score >= 70 ? "text-brand-400" : score >= 60 ? "text-warning-500" : "text-error-500"}`}>
          {score}
        </span>
      </div>
      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function ScoreDisplay({ result, entry }: ScoreDisplayProps) {
  return (
    <div className="space-y-5 border-t border-neutral-800 pt-5">
      {/* Overall score + components */}
      <div className="flex gap-6 items-start">
        <div className="shrink-0">
          <ScoreRing score={result.overallScore} size={90} isBeta />
        </div>
        <div className="flex-1 space-y-2.5">
          {(Object.entries(result.components) as [keyof typeof result.components, number][]).map(([key, value]) => (
            <ComponentBar key={key} label={COMPONENT_LABELS[key]} score={value} />
          ))}
        </div>
      </div>

      {/* Syllable breakdown */}
      {result.syllables.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-neutral-500 uppercase tracking-wider">Syllable Breakdown</p>
          <div className="flex flex-wrap gap-2">
            {result.syllables.map((syl, i) => (
              <div
                key={i}
                className={`flex flex-col items-center p-2 rounded-lg border min-w-[52px] ${
                  syl.isStressed
                    ? "border-brand-500/40 bg-brand-500/10"
                    : "border-neutral-800 bg-neutral-900"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    syl.isStressed ? "text-brand-400 uppercase" : "text-neutral-400"
                  }`}
                >
                  {entry.syllables[i] ?? syl.syllable}
                </span>
                <span
                  className={`text-xs mt-1 font-medium ${
                    syl.score >= 75 ? "text-success-500" : syl.score >= 60 ? "text-warning-500" : "text-error-500"
                  }`}
                >
                  {syl.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main issue + suggestion */}
      <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="warning">Issue</Badge>
          <p className="text-sm font-medium text-neutral-200">{result.mainIssue}</p>
        </div>
        <p className="text-sm text-neutral-400 leading-relaxed">{result.suggestion}</p>
      </div>

      {/* Transcript */}
      {result.transcript && result.transcript !== "[speech recognition unavailable]" && (
        <div className="text-xs text-neutral-600">
          <span className="text-neutral-500">Heard: </span>{result.transcript}
        </div>
      )}

      {/* Beta disclaimer */}
      <p className="text-xs text-neutral-700 text-center">
        Beta scoring — heuristic estimates, not ML-verified phoneme analysis
      </p>
    </div>
  );
}
