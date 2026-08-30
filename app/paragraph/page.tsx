"use client";

import { useState, useCallback } from "react";
import { ChevronRight, ChevronLeft, BookOpen, Mic, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AudioRecorderComponent } from "@/components/audio/AudioRecorder";
import { getAllParagraphs, getTopics, type ParagraphEntry } from "@/lib/phonemes/paragraphs";

const ALL_PARAGRAPHS = getAllParagraphs();
const TOPICS = getTopics();

const DIFFICULTY_COLOR: Record<ParagraphEntry["difficulty"], "brand" | "warning" | "error"> = {
  intermediate: "brand",
  advanced: "warning",
  executive: "error",
};

function highlightTargetWords(text: string, targetWords: string[]): React.ReactNode[] {
  const pattern = new RegExp(`\\b(${targetWords.map((w) => w.replace(/[-]/g, "[-]?")).join("|")})\\b`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const isTarget = targetWords.some((w) => w.toLowerCase() === part.toLowerCase());
    return isTarget ? (
      <mark key={i} className="bg-brand-500/20 text-brand-300 rounded px-0.5 not-italic font-semibold">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export default function ParagraphPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const filtered =
    selectedTopic === "All"
      ? ALL_PARAGRAPHS
      : ALL_PARAGRAPHS.filter((p) => p.topic === selectedTopic);

  const current = filtered[currentIndex] ?? filtered[0];

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentIndex(0);
    setRecorded(false);
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1));
    setRecorded(false);
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setRecorded(false);
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleRecordingComplete = useCallback((blob: Blob) => {
    setAudioBlob(blob);
    setAudioUrl(URL.createObjectURL(blob));
    setRecorded(true);
  }, []);

  const handleRetry = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setRecorded(false);
    setAudioBlob(null);
    setAudioUrl(null);
  };

  if (!current) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-400" />
          Paragraph Practice
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Read aloud — focus on the highlighted technical words
        </p>
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-2">
        {["All", ...TOPICS].map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicChange(topic)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedTopic === topic
                ? "bg-brand-500 border-brand-500 text-white"
                : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Paragraph list */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentIndex(idx);
                setRecorded(false);
                setAudioBlob(null);
                if (audioUrl) URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                idx === currentIndex
                  ? "bg-brand-500/10 border-brand-500/30 text-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium leading-snug">{p.title}</span>
                <Badge variant={DIFFICULTY_COLOR[p.difficulty]} className="shrink-0 text-[10px]">
                  {p.difficulty}
                </Badge>
              </div>
              <span className="text-xs text-neutral-500 mt-0.5 block">{p.wordCount} words</span>
            </button>
          ))}
        </div>

        {/* Practice area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Paragraph card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-brand-400 font-medium uppercase tracking-wider">
                  {current.topic}
                </p>
                <h2 className="text-lg font-semibold text-white mt-0.5">{current.title}</h2>
              </div>
              <Badge variant={DIFFICULTY_COLOR[current.difficulty]}>{current.difficulty}</Badge>
            </div>

            {/* Paragraph text with highlights */}
            <p className="text-neutral-200 text-base leading-relaxed tracking-wide">
              {highlightTargetWords(current.text, current.targetWords)}
            </p>

            {/* Key words */}
            <div className="border-t border-neutral-800 pt-3">
              <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wider font-medium">
                Focus words
              </p>
              <div className="flex flex-wrap gap-1.5">
                {current.targetWords.map((word) => (
                  <span
                    key={word}
                    className="px-2 py-0.5 bg-brand-500/10 border border-brand-500/20 rounded text-xs text-brand-300 font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Pronunciation tip */}
          <Card className="p-4 bg-neutral-900/50">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
              Speaking tip
            </p>
            <p className="text-sm text-neutral-300">
              Read at 80% of your normal pace. Stress the highlighted words — they carry the most
              meaning. Pause briefly at commas and fully at periods.
            </p>
          </Card>

          {/* Recorder */}
          {!recorded ? (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-4 h-4 text-brand-400" />
                <p className="text-sm font-medium text-white">Record yourself reading the paragraph</p>
              </div>
              <AudioRecorderComponent
                onComplete={handleRecordingComplete}
                maxDurationMs={90000}
              />
            </Card>
          ) : (
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">Your recording</p>
                <Button variant="ghost" size="sm" onClick={handleRetry}>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Re-record
                </Button>
              </div>
              {audioUrl && (
                <audio
                  controls
                  src={audioUrl}
                  className="w-full h-10 accent-brand-500"
                  style={{ colorScheme: "dark" }}
                />
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-800/60 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-500">Focus words</p>
                  <p className="text-lg font-bold text-brand-400 mt-0.5">
                    {current.targetWords.length}
                  </p>
                  <p className="text-xs text-neutral-500">to master</p>
                </div>
                <div className="bg-neutral-800/60 rounded-lg p-3 text-center">
                  <p className="text-xs text-neutral-500">Paragraph</p>
                  <p className="text-lg font-bold text-white mt-0.5">{current.wordCount}</p>
                  <p className="text-xs text-neutral-500">words</p>
                </div>
              </div>
              <p className="text-xs text-neutral-400 bg-neutral-800/40 rounded px-3 py-2">
                Listen back and compare your stress and pacing against the paragraph. Practice
                the highlighted words individually in Word Lab for targeted improvement.
              </p>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-1">
            <Button variant="secondary" size="sm" onClick={handlePrev} disabled={currentIndex === 0}>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-xs text-neutral-500">
              {currentIndex + 1} / {filtered.length}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === filtered.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
