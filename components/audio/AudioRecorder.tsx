"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, Square, AlertCircle } from "lucide-react";
import { AudioRecorder, type RecorderState } from "@/lib/audio/recorder";
import { isRecordingSupported } from "@/lib/audio/formats";

interface AudioRecorderComponentProps {
  onComplete: (blob: Blob, durationMs: number) => void;
  maxDurationMs?: number;
}

function formatTime(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioRecorderComponent({
  onComplete,
  maxDurationMs = 120000,
}: AudioRecorderComponentProps) {
  const recorderRef = useRef<AudioRecorder | null>(null);
  const [state, setState] = useState<RecorderState>("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const supported = isRecordingSupported();

  useEffect(() => {
    if (typeof window === "undefined") return;
    recorderRef.current = new AudioRecorder(
      {
        onStateChange: (s) => setState(s),
        onAudioLevel: (level) => setAudioLevel(level),
        onComplete: (blob, durationMs) => {
          setElapsed(0);
          onComplete(blob, durationMs);
        },
        onError: (err) => {
          setError(err.message);
        },
      },
      maxDurationMs
    );

    return () => {
      recorderRef.current?.destroy();
    };
  }, [onComplete, maxDurationMs]);

  useEffect(() => {
    if (state === "recording") {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state]);

  const handleToggle = useCallback(() => {
    setError(null);
    if (state === "idle" || state === "error") {
      recorderRef.current?.start();
    } else if (state === "recording") {
      recorderRef.current?.stop();
    }
  }, [state]);

  if (!supported) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
        <AlertCircle className="w-8 h-8 text-warning-500" />
        <p className="text-sm text-neutral-400 text-center">
          Audio recording is not supported in this browser. Try Chrome or Edge.
        </p>
      </div>
    );
  }

  const isRecording = state === "recording";
  const isProcessing = state === "processing";
  const isRequesting = state === "requesting";

  const progress = maxDurationMs > 0 ? Math.min(1, elapsed / maxDurationMs) : 0;
  const levelScale = 1 + audioLevel * 0.3;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mic button */}
      <div className="relative flex items-center justify-center">
        {/* Audio level ring */}
        {isRecording && (
          <div
            className="absolute inset-0 rounded-full bg-error-500/20 transition-transform duration-100"
            style={{ transform: `scale(${levelScale})` }}
          />
        )}
        <button
          onClick={handleToggle}
          disabled={isProcessing || isRequesting}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-error-500 hover:bg-red-600 animate-recording"
              : isProcessing || isRequesting
              ? "bg-neutral-700 cursor-not-allowed"
              : "bg-brand-500 hover:bg-brand-600"
          }`}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isRecording ? (
            <Square className="w-7 h-7 text-white fill-white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </button>
      </div>

      {/* Timer */}
      {isRecording && (
        <div className="text-center space-y-2">
          <p className="text-lg font-mono font-semibold text-white">{formatTime(elapsed)}</p>
          <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-error-500 rounded-full transition-all duration-250"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* State label */}
      <p className="text-xs text-neutral-500">
        {isRequesting
          ? "Requesting microphone..."
          : isRecording
          ? "Recording — tap to stop"
          : isProcessing
          ? "Processing..."
          : "Tap to record"}
      </p>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-error-500 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
