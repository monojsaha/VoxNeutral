"use client";

import { useState } from "react";
import { Clock, CheckCircle, Circle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WordCard } from "@/components/word/WordCard";
import { lookupWord, getAllWords } from "@/lib/phonemes/dictionary";
import type { PhonemeEntry } from "@/lib/phonemes/dictionary";

interface Segment {
  id: string;
  title: string;
  duration: number;
  description: string;
  wordKeys: string[];
  color: string;
}

const SEGMENTS: Segment[] = [
  {
    id: "difficult-sounds",
    title: "Difficult Sounds",
    duration: 2,
    description: "Focus on phonemes that cause consistent errors",
    wordKeys: ["vulnerability", "algorithm", "artificial", "generative", "governance"],
    color: "text-error-500",
  },
  {
    id: "technical-stress",
    title: "Technical Word Stress",
    duration: 3,
    description: "Stress patterns in key tech vocabulary",
    wordKeys: ["orchestration", "authentication", "containerization", "microservices", "kubernetes", "infrastructure"],
    color: "text-brand-500",
  },
  {
    id: "sentence-stress",
    title: "Sentence Stress",
    duration: 2,
    description: "Stress content words, reduce function words",
    wordKeys: ["implementation", "transformation", "modernization", "observability"],
    color: "text-warning-500",
  },
  {
    id: "technical-paragraph",
    title: "Technical Paragraph",
    duration: 2,
    description: "Connected speech in executive context",
    wordKeys: ["scalability", "availability", "reliability", "resilience", "deterministic"],
    color: "text-success-500",
  },
  {
    id: "review",
    title: "Review",
    duration: 1,
    description: "Revisit today's most challenging words",
    wordKeys: ["interoperability", "idempotency", "asynchronous", "probabilistic"],
    color: "text-neutral-400",
  },
];

export default function PracticePage() {
  const [activeSegment, setActiveSegment] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<Set<number>>(new Set());

  const segment = SEGMENTS[activeSegment];
  const validWords = segment.wordKeys
    .map((k) => lookupWord(k))
    .filter((e): e is PhonemeEntry => e !== undefined);

  const allWords = getAllWords();
  const fallbackWords = allWords.slice(0, 3);
  const words = validWords.length > 0 ? validWords : fallbackWords;
  const currentWord = words[Math.min(wordIndex, words.length - 1)];

  const totalMinutes = SEGMENTS.reduce((s, seg) => s + seg.duration, 0);
  const completedMinutes = SEGMENTS.slice(0, activeSegment).reduce((s, seg) => s + seg.duration, 0);
  const progressPct = Math.round((completedMinutes / totalMinutes) * 100);

  function handleNext() {
    if (wordIndex < words.length - 1) {
      setWordIndex(wordIndex + 1);
    } else {
      setCompletedSegments((prev) => new Set(Array.from(prev).concat(activeSegment)));
      if (activeSegment < SEGMENTS.length - 1) {
        setActiveSegment(activeSegment + 1);
        setWordIndex(0);
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Daily Practice</h1>
        <p className="text-neutral-400 text-sm mt-1">10-minute structured session</p>
      </div>

      {/* Progress */}
      <Card variant="default" padding="md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Session Progress</span>
          <span className="text-sm font-medium text-neutral-300">{completedMinutes}/{totalMinutes} min</span>
        </div>
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment list */}
        <div className="space-y-2">
          {SEGMENTS.map((seg, i) => (
            <button
              key={seg.id}
              onClick={() => { setActiveSegment(i); setWordIndex(0); }}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                i === activeSegment
                  ? "bg-neutral-800 border-brand-500"
                  : completedSegments.has(i)
                  ? "bg-neutral-900/50 border-neutral-800 opacity-60"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {completedSegments.has(i) ? (
                  <CheckCircle className="w-5 h-5 text-success-500 shrink-0" />
                ) : (
                  <Circle className={`w-5 h-5 shrink-0 ${i === activeSegment ? "text-brand-500" : "text-neutral-600"}`} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200 truncate">{seg.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-neutral-600" />
                    <span className="text-xs text-neutral-500">{seg.duration} min</span>
                  </div>
                </div>
                {i === activeSegment && <ChevronRight className="w-4 h-4 text-brand-500 shrink-0" />}
              </div>
            </button>
          ))}
        </div>

        {/* Active segment */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-semibold ${segment.color}`}>{segment.title}</h2>
              <p className="text-neutral-400 text-sm">{segment.description}</p>
            </div>
            <Badge variant="default">
              {Math.min(wordIndex + 1, words.length)} / {words.length}
            </Badge>
          </div>

          {currentWord && (
            <WordCard
              entry={currentWord}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}
