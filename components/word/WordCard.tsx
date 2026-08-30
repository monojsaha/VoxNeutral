"use client";

import { useState } from "react";
import { Volume2, RotateCcw, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AudioRecorderComponent } from "@/components/audio/AudioRecorder";
import { ScoreDisplay } from "./ScoreDisplay";
import { getTTSProvider } from "@/lib/tts/provider";
import { scoreWordAttempt } from "@/lib/scoring/engine";
import type { PhonemeEntry } from "@/lib/phonemes/dictionary";
import type { WordAttemptScore } from "@/types";

interface WordCardProps {
  entry: PhonemeEntry;
  onNext?: () => void;
}

export function WordCard({ entry, onNext }: WordCardProps) {
  const [ttsRate, setTtsRate] = useState<0.75 | 1>(1);
  const [result, setResult] = useState<WordAttemptScore | null>(null);
  const [scoring, setScoring] = useState(false);

  function handleListen() {
    const tts = getTTSProvider();
    tts.speak(entry.word, { rate: ttsRate });
  }

  async function handleRecordingComplete(blob: Blob, durationMs: number) {
    setScoring(true);
    try {
      const score = await scoreWordAttempt(entry.word, blob, durationMs);
      setResult(score);
    } catch {
      // silently fail
    } finally {
      setScoring(false);
    }
  }

  function handleTryAgain() {
    setResult(null);
  }

  return (
    <Card variant="elevated" padding="lg" className="space-y-6">
      {/* Word header */}
      <div className="space-y-3">
        <p className="text-4xl font-bold text-white tracking-wide uppercase">
          {entry.word}
        </p>
        <p className="text-neutral-400 font-mono text-lg">{entry.ipa}</p>

        {/* Syllable breakdown */}
        <div className="flex flex-wrap gap-2 items-center">
          {entry.syllables.map((syl, i) => (
            <span key={i} className="flex items-center">
              <span
                className={`text-sm font-semibold px-2 py-0.5 rounded ${
                  i === entry.stressIndex
                    ? "text-brand-400 bg-brand-500/10 uppercase text-base"
                    : "text-neutral-400"
                }`}
              >
                {syl}
              </span>
              {i < entry.syllables.length - 1 && (
                <span className="text-neutral-700 text-xs mx-0.5">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Domain badge */}
        {entry.domain && (
          <Badge variant="brand" className="text-xs">
            {entry.domain}
          </Badge>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="md" onClick={handleListen} className="gap-2">
          <Volume2 className="w-4 h-4" />
          Listen
        </Button>
        <button
          onClick={() => setTtsRate((r) => (r === 1 ? 0.75 : 1))}
          className={`text-xs px-2 py-1 rounded border transition-colors ${
            ttsRate === 0.75
              ? "bg-brand-500/10 border-brand-500/30 text-brand-400"
              : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200"
          }`}
        >
          {ttsRate === 0.75 ? "0.75×" : "1×"}
        </button>
      </div>

      {/* Guidance */}
      <div className="bg-neutral-900 rounded-lg p-3 border border-neutral-800">
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Stress Guide</p>
        <p className="text-sm text-neutral-300">
          Stress the <span className="text-brand-400 font-semibold">{entry.syllables[entry.stressIndex]}</span> syllable — make it louder, longer, and slightly higher in pitch.
        </p>
        {entry.acceptedVariants && entry.acceptedVariants.length > 0 && (
          <p className="text-xs text-neutral-600 mt-1">
            Also accepted: {entry.acceptedVariants.join(", ")}
          </p>
        )}
      </div>

      {/* Recorder or result */}
      {!result && !scoring && (
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-sm text-neutral-400">Now you try:</p>
          <AudioRecorderComponent onComplete={handleRecordingComplete} maxDurationMs={10000} />
        </div>
      )}

      {scoring && (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            <p className="text-sm text-neutral-400">Analysing pronunciation...</p>
          </div>
        </div>
      )}

      {result && <ScoreDisplay result={result} entry={entry} />}

      {/* Action buttons */}
      {result && (
        <div className="flex gap-3">
          <Button variant="ghost" size="md" onClick={handleTryAgain} className="gap-2 flex-1">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          {onNext && (
            <Button variant="primary" size="md" onClick={onNext} className="gap-2 flex-1">
              Next Word
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
