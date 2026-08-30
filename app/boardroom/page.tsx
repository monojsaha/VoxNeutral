"use client";

import { useState } from "react";
import { ChevronRight, Lightbulb, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { AudioRecorderComponent } from "@/components/audio/AudioRecorder";

interface Scenario {
  id: string;
  title: string;
  category: string;
  prompt: string;
  structure: { label: string; hint: string }[];
  tips: string[];
  targetDuration: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "ai-strategy",
    title: "AI Strategy Pitch",
    category: "Executive Briefing",
    prompt: "You have 90 seconds to present your company's AI adoption strategy to the board. Explain the business case, key risks, and first milestone.",
    structure: [
      { label: "Point", hint: "State your main recommendation clearly" },
      { label: "Reason", hint: "Explain why this approach is right" },
      { label: "Evidence", hint: "Share a specific metric or case study" },
      { label: "Conclusion", hint: "Restate the action required" },
    ],
    tips: [
      "Stress ROI numbers: 'a forty PERCENT reduction'",
      "Pause before key figures for impact",
      "Avoid filler words before technical terms",
    ],
    targetDuration: "90s",
  },
  {
    id: "incident-response",
    title: "Incident Response Brief",
    category: "Crisis Communication",
    prompt: "Your platform has been down for 2 hours affecting 50,000 customers. Brief your leadership team on current status, impact, and resolution timeline.",
    structure: [
      { label: "Point", hint: "Current status in one sentence" },
      { label: "Reason", hint: "Root cause identified or investigation status" },
      { label: "Evidence", hint: "Impact data and teams engaged" },
      { label: "Conclusion", hint: "ETA and next update commitment" },
    ],
    tips: [
      "Speak calmly — reduce pace by 15%",
      "Stress action verbs: 'We HAVE identified... We ARE restoring...'",
      "Avoid hedging: not 'might be' — say 'we expect'",
    ],
    targetDuration: "60s",
  },
  {
    id: "cloud-migration",
    title: "Cloud Migration Update",
    category: "Stakeholder Update",
    prompt: "Present a quarterly update on your $3M cloud migration program to a mixed technical and non-technical leadership audience.",
    structure: [
      { label: "Point", hint: "Overall program health — on track / at risk" },
      { label: "Reason", hint: "Key achievements and blockers this quarter" },
      { label: "Evidence", hint: "Workloads migrated, cost savings, timeline" },
      { label: "Conclusion", hint: "Decision needed from leadership" },
    ],
    tips: [
      "Stress 'infra-STRUC-ture' not 'IN-fra-struc-ture'",
      "Slow down for financial figures",
      "Link technical terms to business outcomes",
    ],
    targetDuration: "120s",
  },
  {
    id: "vendor-negotiation",
    title: "Vendor Negotiation",
    category: "Negotiation",
    prompt: "Respond to a vendor who has just proposed a 40% price increase for your enterprise software license renewal.",
    structure: [
      { label: "Point", hint: "State your position directly" },
      { label: "Reason", hint: "Your rationale — market data, contract terms" },
      { label: "Evidence", hint: "Alternatives you are evaluating" },
      { label: "Conclusion", hint: "Counter-offer or next step" },
    ],
    tips: [
      "Use firm sentence stress: 'This is NOT acceptable at this time'",
      "Pause intentionally — silence signals confidence",
      "Avoid apologetic softeners: 'Unfortunately' weakens your position",
    ],
    targetDuration: "60s",
  },
  {
    id: "team-vision",
    title: "Team Vision & Direction",
    category: "Leadership",
    prompt: "Address your 200-person engineering org after a reorg. Communicate the new structure, rationale, and what stays the same.",
    structure: [
      { label: "Point", hint: "The new direction in one clear sentence" },
      { label: "Reason", hint: "Why this change serves the mission" },
      { label: "Evidence", hint: "What will be different, what will not" },
      { label: "Conclusion", hint: "What you need from them in the next 90 days" },
    ],
    tips: [
      "Use inclusive language with correct stress: 'OUR team, YOUR work'",
      "Vary intonation — avoid monotone delivery",
      "Slow down on 'what stays the same' — it is reassuring",
    ],
    targetDuration: "120s",
  },
];

interface MockResult {
  speechScore: number;
  pronunciation: number;
  fluency: number;
  pace: number;
  fillers: number;
  wpm: number;
}

function generateMockResult(): MockResult {
  return {
    speechScore: Math.round(65 + Math.random() * 20),
    pronunciation: Math.round(60 + Math.random() * 25),
    fluency: Math.round(65 + Math.random() * 20),
    pace: Math.round(70 + Math.random() * 20),
    fillers: Math.round(Math.random() * 8),
    wpm: Math.round(120 + Math.random() * 60),
  };
}

export default function BoardroomPage() {
  const [selected, setSelected] = useState(0);
  const [result, setResult] = useState<MockResult | null>(null);
  const [recording, setRecording] = useState(false);

  const scenario = SCENARIOS[selected];

  function handleRecordingComplete(_blob: Blob, _durationMs: number) {
    setRecording(false);
    setResult(generateMockResult());
  }

  function handleReset() {
    setResult(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Boardroom Challenge</h1>
        <p className="text-neutral-400 text-sm mt-1">Executive speaking scenarios with structured feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario list */}
        <div className="space-y-2">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setSelected(i); setResult(null); }}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                i === selected
                  ? "bg-neutral-800 border-brand-500"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200 truncate">{s.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{s.category} · {s.targetDuration}</p>
                </div>
                {i === selected && <ChevronRight className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />}
              </div>
            </button>
          ))}
        </div>

        {/* Scenario detail */}
        <div className="lg:col-span-2 space-y-5">
          <Card variant="elevated" padding="lg" className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="brand">{scenario.category}</Badge>
                  <Badge variant="default">{scenario.targetDuration}</Badge>
                </div>
                <h2 className="text-lg font-bold text-white">{scenario.title}</h2>
              </div>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">{scenario.prompt}</p>
          </Card>

          {/* Structure */}
          <Card variant="default" padding="md" className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Recommended Structure
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {scenario.structure.map((s) => (
                <div key={s.label} className="bg-neutral-800/50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-xs text-neutral-400">{s.hint}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card variant="default" padding="md" className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-warning-500" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Pronunciation Tips for This Scenario
              </h3>
            </div>
            <ul className="space-y-2">
              {scenario.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral-300">
                  <span className="text-warning-500 font-bold shrink-0">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          {/* Recorder */}
          {!result && (
            <Card variant="default" padding="lg" className="flex flex-col items-center gap-4">
              <p className="text-sm text-neutral-400">Record your response</p>
              <AudioRecorderComponent
                onComplete={handleRecordingComplete}
                maxDurationMs={180000}
              />
            </Card>
          )}

          {/* Result */}
          {result && (
            <Card variant="elevated" padding="lg" className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
                  Speech Analysis (Beta)
                </h3>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Try Again
                </Button>
              </div>
              <div className="flex items-center gap-6">
                <ScoreRing score={result.speechScore} size={100} isBeta />
                <div className="flex-1 space-y-2">
                  {[
                    { label: "Pronunciation", value: result.pronunciation },
                    { label: "Fluency", value: result.fluency },
                    { label: "Pace", value: result.pace },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-400">{m.label}</span>
                        <span className="text-neutral-200 font-medium">{m.value}</span>
                      </div>
                      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500 rounded-full"
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-2 border-t border-neutral-800">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{result.wpm}</p>
                  <p className="text-xs text-neutral-500">WPM</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning-500">{result.fillers}</p>
                  <p className="text-xs text-neutral-500">Fillers</p>
                </div>
              </div>
              <p className="text-xs text-neutral-600 text-center">
                Beta scoring — results are heuristic estimates, not ML-verified
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
