"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus, Mic, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const SCORE_DIMENSIONS = [
  { label: "Pronunciation", score: 71 },
  { label: "Word Stress", score: 64 },
  { label: "Sentence Stress", score: 68 },
  { label: "Rhythm", score: 60 },
  { label: "Intonation", score: 72 },
  { label: "Pace", score: 78 },
  { label: "Fluency", score: 75 },
];

const RECURRING_ISSUES = [
  { pattern: "V → W substitution", examples: "version → wersion, vendor → wender", severity: "high" as const },
  { pattern: "Voiceless TH → T", examples: "three → tree, think → tink", severity: "high" as const },
  { pattern: "Word stress: ORchestration", examples: "orchestration, authentication", severity: "medium" as const },
];

const RECENTLY_MASTERED = ["kubernetes", "algorithm", "resilience", "governance"];

const TODAY_FOCUS = [
  "Practice /v/ vs /w/ minimal pairs (vendor, version, valuable)",
  "Stress pattern: au-THEN-ti-CA-tion not AU-then-ti-ca-tion",
  "Voiceless TH in: think, three, through, threshold",
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const overallScore = 71;
  const delta = +4;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-500 text-sm font-medium uppercase tracking-wider">
            {getGreeting()}
          </p>
          <h1 className="text-3xl font-bold text-white mt-1">
            Your Speech Dashboard
          </h1>
        </div>
      </div>

      {/* Score + CTA row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score ring */}
        <Card variant="elevated" padding="lg" className="flex flex-col items-center gap-4">
          <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
            Professional Speech Score
          </p>
          <ScoreRing score={overallScore} size={140} isBeta />
          <div className="flex items-center gap-1.5">
            {delta > 0 ? (
              <TrendingUp className="w-4 h-4 text-success-500" />
            ) : delta < 0 ? (
              <TrendingDown className="w-4 h-4 text-error-500" />
            ) : (
              <Minus className="w-4 h-4 text-neutral-500" />
            )}
            <span className={`text-sm font-medium ${delta > 0 ? "text-success-500" : delta < 0 ? "text-error-500" : "text-neutral-500"}`}>
              {delta > 0 ? "+" : ""}{delta} vs 30 days ago
            </span>
          </div>
        </Card>

        {/* Today's Focus */}
        <Card variant="default" padding="lg" className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Today&apos;s Focus
          </h2>
          <ul className="space-y-3">
            {TODAY_FOCUS.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-neutral-200">
                <span className="text-brand-500 font-bold mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/practice" className="flex-1">
              <Button variant="primary" size="md" className="w-full gap-2">
                <Mic className="w-4 h-4" />
                Start 10-Minute Practice
              </Button>
            </Link>
            <Link href="/boardroom" className="flex-1">
              <Button variant="secondary" size="md" className="w-full gap-2">
                <Briefcase className="w-4 h-4" />
                Boardroom Challenge
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Score breakdown */}
      <Card variant="default" padding="lg" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Score Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {SCORE_DIMENSIONS.map((dim) => (
            <div key={dim.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">{dim.label}</span>
                <span className={`font-semibold ${dim.score >= 80 ? "text-success-500" : dim.score >= 70 ? "text-brand-400" : dim.score >= 60 ? "text-warning-500" : "text-error-500"}`}>
                  {dim.score}
                </span>
              </div>
              <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${dim.score >= 80 ? "bg-success-500" : dim.score >= 70 ? "bg-brand-500" : dim.score >= 60 ? "bg-warning-500" : "bg-error-500"}`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recurring Issues */}
      <Card variant="default" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Recurring Issues
          </h2>
          <Link href="/progress">
            <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
              View all <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {RECURRING_ISSUES.map((issue, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-neutral-800/50 rounded-lg">
              <Badge variant={issue.severity === "high" ? "error" : "warning"} className="mt-0.5 shrink-0">
                {issue.severity}
              </Badge>
              <div>
                <p className="text-sm font-medium text-neutral-200">{issue.pattern}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{issue.examples}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recently Mastered */}
      <Card variant="default" padding="lg" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Recently Mastered
        </h2>
        <div className="flex flex-wrap gap-2">
          {RECENTLY_MASTERED.map((word) => (
            <Badge key={word} variant="success" className="text-sm py-1 px-3">
              {word}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
