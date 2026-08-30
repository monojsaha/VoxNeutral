"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type ReferenceVoice = "neutral" | "american" | "british";

interface Settings {
  retainAudio: boolean;
  referenceVoice: ReferenceVoice;
  dailySessionLengthMinutes: number;
}

const DEFAULT_SETTINGS: Settings = {
  retainAudio: false,
  referenceVoice: "neutral",
  dailySessionLengthMinutes: 10,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const VOICE_OPTIONS: { value: ReferenceVoice; label: string; desc: string }[] = [
    { value: "neutral", label: "Neutral International", desc: "Standard broadcast English — no regional accent" },
    { value: "american", label: "American English", desc: "General American — common in US tech companies" },
    { value: "british", label: "British English", desc: "RP — common in UK/European boardrooms" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-neutral-400 text-sm mt-1">Personalise your coaching experience</p>
      </div>

      {/* Privacy */}
      <Card variant="default" padding="lg" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Privacy</h2>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-200">Retain Audio Recordings</p>
            <p className="text-xs text-neutral-500 mt-1">
              By default, audio is analysed locally and immediately discarded. Enable this only to improve scoring accuracy for your voice over time. Audio is stored encrypted and never shared.
            </p>
          </div>
          <button
            onClick={() => setSettings((s) => ({ ...s, retainAudio: !s.retainAudio }))}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
              settings.retainAudio ? "bg-brand-500" : "bg-neutral-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform m-0.5 ${
                settings.retainAudio ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        {!settings.retainAudio && (
          <div className="flex items-center gap-2 bg-success-500/10 border border-success-500/20 rounded-lg px-3 py-2">
            <div className="w-2 h-2 rounded-full bg-success-500 shrink-0" />
            <p className="text-xs text-success-500">Audio is deleted immediately after scoring</p>
          </div>
        )}
      </Card>

      {/* Reference voice */}
      <Card variant="default" padding="lg" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Reference Voice</h2>
        <p className="text-xs text-neutral-500">
          Target accent for pronunciation comparison. Does not change scoring weights — only affects the TTS model voice.
        </p>
        <div className="space-y-2">
          {VOICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSettings((s) => ({ ...s, referenceVoice: opt.value }))}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                settings.referenceVoice === opt.value
                  ? "bg-neutral-800 border-brand-500"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-200">{opt.label}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                </div>
                {settings.referenceVoice === opt.value && (
                  <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Daily session length */}
      <Card variant="default" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">Daily Session Length</h2>
          <Badge variant="brand">{settings.dailySessionLengthMinutes} minutes</Badge>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          step={5}
          value={settings.dailySessionLengthMinutes}
          onChange={(e) => setSettings((s) => ({ ...s, dailySessionLengthMinutes: Number(e.target.value) }))}
          className="w-full accent-brand-500"
        />
        <div className="flex justify-between text-xs text-neutral-600">
          <span>5 min</span>
          <span>10 min</span>
          <span>15 min</span>
          <span>20 min</span>
          <span>30 min</span>
        </div>
      </Card>

      {/* Save */}
      <Button
        variant={saved ? "secondary" : "primary"}
        size="lg"
        onClick={handleSave}
        className="w-full"
      >
        {saved ? "Saved" : "Save Settings"}
      </Button>

      <p className="text-center text-xs text-neutral-700">
        VoicePresence MVP · Settings stored locally
      </p>
    </div>
  );
}
