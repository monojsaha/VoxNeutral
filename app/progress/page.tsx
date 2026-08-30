"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ScoreChart } from "@/components/progress/ScoreChart";
import { PhonemeHeatmap } from "@/components/progress/PhonemeHeatmap";

type TimeRange = "7d" | "30d" | "90d" | "all";

const MOCK_DATA_30 = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  overall: Math.round(60 + i * 0.4 + Math.random() * 5),
  pronunciation: Math.round(58 + i * 0.5 + Math.random() * 5),
  stress: Math.round(55 + i * 0.4 + Math.random() * 5),
  pace: Math.round(65 + i * 0.3 + Math.random() * 5),
}));

function getDataForRange(range: TimeRange) {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 120;
  return Array.from({ length: Math.min(days, 30) }, (_, i) => ({
    date: new Date(Date.now() - (Math.min(days, 30) - 1 - i) * 86400000)
      .toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    overall: Math.round(60 + i * 0.5 + Math.random() * 5),
    pronunciation: Math.round(58 + i * 0.6 + Math.random() * 5),
    stress: Math.round(55 + i * 0.4 + Math.random() * 5),
    pace: Math.round(65 + i * 0.3 + Math.random() * 5),
  }));
}

const DIFFICULT_WORDS: Array<{ word: string; attempts: number; bestScore: number; trend: "up" | "down" | "flat" }> = [
  { word: "orchestration", attempts: 12, bestScore: 68, trend: "up" },
  { word: "authentication", attempts: 8, bestScore: 72, trend: "up" },
  { word: "vulnerability", attempts: 6, bestScore: 60, trend: "flat" },
  { word: "interoperability", attempts: 4, bestScore: 55, trend: "up" },
  { word: "idempotency", attempts: 5, bestScore: 58, trend: "down" },
];

const RECURRING_PATTERNS: Array<{ pattern: string; count: number; trend: "up" | "down" | "flat"; description: string }> = [
  { pattern: "V → W substitution", count: 47, trend: "down", description: "Improving — keep practicing" },
  { pattern: "TH voiceless → T", count: 38, trend: "flat", description: "Consistent — needs focused work" },
  { pattern: "Equal syllable stress", count: 29, trend: "down", description: "Improving slowly" },
  { pattern: "Weak final consonants", count: 22, trend: "flat", description: "Consistent pattern" },
];

export default function ProgressPage() {
  const [range, setRange] = useState<TimeRange>("30d");

  const chartData = range === "30d" ? MOCK_DATA_30 : getDataForRange(range);
  const latestScore = chartData[chartData.length - 1]?.overall ?? 71;
  const firstScore = chartData[0]?.overall ?? 67;
  const delta = latestScore - firstScore;

  const RANGES: { key: TimeRange; label: string }[] = [
    { key: "7d", label: "7D" },
    { key: "30d", label: "30D" },
    { key: "90d", label: "90D" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-neutral-400 text-sm mt-1">Your pronunciation journey</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" padding="md" className="flex flex-col items-center gap-2">
          <ScoreRing score={latestScore} size={80} isBeta />
          <p className="text-xs text-neutral-500">Current Score</p>
        </Card>
        <Card variant="default" padding="md" className="flex flex-col justify-center">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Trend</p>
          <div className="flex items-center gap-1.5">
            {delta > 0 ? (
              <TrendingUp className="w-5 h-5 text-success-500" />
            ) : delta < 0 ? (
              <TrendingDown className="w-5 h-5 text-error-500" />
            ) : (
              <Minus className="w-5 h-5 text-neutral-500" />
            )}
            <span className={`text-2xl font-bold ${delta > 0 ? "text-success-500" : delta < 0 ? "text-error-500" : "text-neutral-400"}`}>
              {delta > 0 ? "+" : ""}{delta}
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">in selected period</p>
        </Card>
        <Card variant="default" padding="md" className="flex flex-col justify-center">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Sessions</p>
          <p className="text-2xl font-bold text-white">24</p>
          <p className="text-xs text-neutral-600 mt-1">this month</p>
        </Card>
        <Card variant="default" padding="md" className="flex flex-col justify-center">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Words Mastered</p>
          <p className="text-2xl font-bold text-success-500">8</p>
          <p className="text-xs text-neutral-600 mt-1">boardroom ready</p>
        </Card>
      </div>

      {/* Chart */}
      <Card variant="default" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Score Over Time</h2>
          <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  range === r.key ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <ScoreChart data={chartData} title="Overall & Components" showAll />
      </Card>

      {/* Phoneme Heatmap */}
      <Card variant="default" padding="lg" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Phoneme Performance</h2>
        <PhonemeHeatmap />
      </Card>

      {/* Difficult words */}
      <Card variant="default" padding="lg" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Difficult Words</h2>
        <div className="space-y-2">
          {DIFFICULT_WORDS.map((item) => (
            <div key={item.word} className="flex items-center gap-4 p-3 bg-neutral-800/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-200 capitalize">{item.word}</p>
                <p className="text-xs text-neutral-500">{item.attempts} attempts</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${item.bestScore >= 70 ? "text-brand-400" : "text-warning-500"}`}>
                  {item.bestScore}
                </span>
                {item.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-success-500" />
                ) : item.trend === "down" ? (
                  <TrendingDown className="w-4 h-4 text-error-500" />
                ) : (
                  <Minus className="w-4 h-4 text-neutral-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recurring patterns */}
      <Card variant="default" padding="lg" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Recurring Patterns</h2>
        <div className="space-y-2">
          {RECURRING_PATTERNS.map((p) => (
            <div key={p.pattern} className="flex items-center gap-4 p-3 bg-neutral-800/50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-200">{p.pattern}</p>
                <p className="text-xs text-neutral-500">{p.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-xs">{p.count}x</Badge>
                {p.trend === "down" ? (
                  <TrendingDown className="w-4 h-4 text-success-500" />
                ) : p.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-error-500" />
                ) : (
                  <Minus className="w-4 h-4 text-neutral-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
