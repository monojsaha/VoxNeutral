import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, Minus, BookOpen, Target, AlertCircle } from "lucide-react";

const WEEKLY_STATS = {
  sessionsCompleted: 6,
  totalMinutes: 58,
  scoreDelta: +4,
  fillersDelta: -3,
  wordsAttempted: 42,
  wordsMastered: 2,
};

const INSIGHTS = [
  {
    type: "improvement" as const,
    title: "V/W confusion is reducing",
    detail: "Your /v/ vs /w/ error rate dropped from 72% to 58% over the past two weeks. Keep using the 'lower lip on upper teeth' technique.",
  },
  {
    type: "focus" as const,
    title: "Voiceless TH still needs work",
    detail: "You substituted /t/ for /θ/ in 34 out of 38 attempts. Practice: 'I THINK THREE THINGS' — feel the airflow between your teeth.",
  },
  {
    type: "improvement" as const,
    title: "Sentence stress is improving",
    detail: "Your content/function word contrast improved from score 58 to 68 this week. 'The SYSTEM was DOWN for TWO hours' is a great example.",
  },
  {
    type: "focus" as const,
    title: "Word stress: -TION and -ATION endings",
    detail: "You consistently stress the second-to-last syllable in -ation words correctly, but earlier syllables are still flat. Focus on: or-ches-TRA-tion.",
  },
  {
    type: "milestone" as const,
    title: "Mastered: kubernetes, algorithm, resilience",
    detail: "These words now score above 85 consistently across 5+ attempts. They are boardroom-ready.",
  },
];

const BENGALI_GUIDANCE = [
  {
    sound: "/v/ vs /w/",
    issue: "Bengali has no /v/ — speakers often say 'w' for both",
    technique: "For /v/: rest upper front teeth on lower lip, then voice the sound. 'vvvvend-or' — feel the friction.",
    practiceWords: ["vendor", "value", "version", "volume", "virtual"],
  },
  {
    sound: "/θ/ (voiceless TH)",
    issue: "Bengali has no dental fricatives — /θ/ becomes /t/",
    technique: "Place your tongue tip lightly between your teeth and blow air out gently. Do NOT voice it. 'θ-θ-θ-three'",
    practiceWords: ["three", "think", "through", "threshold", "thought"],
  },
  {
    sound: "/ð/ (voiced TH)",
    issue: "Becomes /d/ in Bengali-influenced speech",
    technique: "Same tongue position as voiceless TH, but add voice. 'ð-ð-ð-the'. Feel vibration in your throat.",
    practiceWords: ["the", "this", "that", "though", "therefore"],
  },
  {
    sound: "Word Stress",
    issue: "Bengali syllable timing is more equal — English is stress-timed",
    technique: "English content words carry much more stress than function words. Stress the syllable indicated in IPA. Make it LOUD and LONG.",
    practiceWords: ["INfrastructure", "orCHEStration", "auTHENtication", "tecHNOLogy"],
  },
];

function InsightIcon({ type }: { type: "improvement" | "focus" | "milestone" }) {
  if (type === "improvement") return <TrendingUp className="w-5 h-5 text-success-500" />;
  if (type === "focus") return <AlertCircle className="w-5 h-5 text-warning-500" />;
  return <Target className="w-5 h-5 text-brand-500" />;
}

export default function CoachPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Coach</h1>
        <p className="text-neutral-400 text-sm mt-1">Weekly report & personalised guidance</p>
      </div>

      {/* Weekly report card */}
      <Card variant="elevated" padding="lg" className="space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">This Week</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <p className="text-xs text-neutral-500 mb-1">Sessions</p>
            <p className="text-3xl font-bold text-white">{WEEKLY_STATS.sessionsCompleted}</p>
            <p className="text-xs text-neutral-600">{WEEKLY_STATS.totalMinutes} minutes total</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <p className="text-xs text-neutral-500 mb-1">Score Change</p>
            <div className="flex items-center gap-1">
              {WEEKLY_STATS.scoreDelta > 0 ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error-500" />
              )}
              <p className={`text-3xl font-bold ${WEEKLY_STATS.scoreDelta > 0 ? "text-success-500" : "text-error-500"}`}>
                {WEEKLY_STATS.scoreDelta > 0 ? "+" : ""}{WEEKLY_STATS.scoreDelta}
              </p>
            </div>
            <p className="text-xs text-neutral-600">vs last week</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <p className="text-xs text-neutral-500 mb-1">Fillers</p>
            <div className="flex items-center gap-1">
              {WEEKLY_STATS.fillersDelta < 0 ? (
                <TrendingDown className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-error-500" />
              )}
              <p className={`text-3xl font-bold ${WEEKLY_STATS.fillersDelta < 0 ? "text-success-500" : "text-error-500"}`}>
                {WEEKLY_STATS.fillersDelta}
              </p>
            </div>
            <p className="text-xs text-neutral-600">fewer per minute</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <p className="text-xs text-neutral-500 mb-1">Words Attempted</p>
            <p className="text-3xl font-bold text-white">{WEEKLY_STATS.wordsAttempted}</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-4 md:col-span-2">
            <p className="text-xs text-neutral-500 mb-1">Newly Mastered</p>
            <p className="text-3xl font-bold text-brand-400">{WEEKLY_STATS.wordsMastered}</p>
            <p className="text-xs text-neutral-600">words boardroom-ready</p>
          </div>
        </div>
      </Card>

      {/* Personalised insights */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Personalised Insights</h2>
        {INSIGHTS.map((insight, i) => (
          <Card key={i} variant="default" padding="md">
            <div className="flex items-start gap-3">
              <InsightIcon type={insight.type} />
              <div>
                <p className="text-sm font-semibold text-neutral-200">{insight.title}</p>
                <p className="text-sm text-neutral-400 mt-1 leading-relaxed">{insight.detail}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bengali guidance */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
            Bengali → International English
          </h2>
        </div>
        <p className="text-sm text-neutral-500">
          Targeted guidance for common phonological transfer patterns from Bengali.
        </p>
        {BENGALI_GUIDANCE.map((item, i) => (
          <Card key={i} variant="default" padding="lg" className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="font-mono">{item.sound}</Badge>
            </div>
            <p className="text-sm text-neutral-300"><span className="text-neutral-500">Issue: </span>{item.issue}</p>
            <div className="bg-neutral-800/50 rounded-lg p-3">
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Technique</p>
              <p className="text-sm text-neutral-200">{item.technique}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Practice Words</p>
              <div className="flex flex-wrap gap-2">
                {item.practiceWords.map((w) => (
                  <Badge key={w} variant="default" className="font-mono text-xs">{w}</Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
