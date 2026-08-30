"use client";

import { detectSupportedMimeType } from "./formats";

export type RecorderState =
  | "idle"
  | "requesting"
  | "recording"
  | "processing"
  | "error";

export interface RecorderCallbacks {
  onStateChange?: (state: RecorderState) => void;
  onAudioLevel?: (level: number) => void;
  onComplete?: (blob: Blob, durationMs: number) => void;
  onError?: (error: Error) => void;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private startTime = 0;
  private state: RecorderState = "idle";
  private callbacks: RecorderCallbacks;
  private maxDurationMs: number;
  private maxDurationTimer: ReturnType<typeof setTimeout> | null = null;

  // Audio level monitoring
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private levelRafId: number | null = null;

  constructor(callbacks: RecorderCallbacks = {}, maxDurationMs = 120000) {
    this.callbacks = callbacks;
    this.maxDurationMs = maxDurationMs;
  }

  private setState(state: RecorderState) {
    this.state = state;
    this.callbacks.onStateChange?.(state);
  }

  getState(): RecorderState {
    return this.state;
  }

  async start(): Promise<void> {
    if (this.state !== "idle" && this.state !== "error") return;

    this.setState("requesting");

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      const mimeType = detectSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.chunks = [];

      this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) this.chunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        this.setState("processing");
        const durationMs = Date.now() - this.startTime;
        const mimeT = this.mediaRecorder?.mimeType ?? "audio/webm";
        const blob = new Blob(this.chunks, { type: mimeT });
        this.cleanup();
        this.setState("idle");
        this.callbacks.onComplete?.(blob, durationMs);
      };

      this.mediaRecorder.onerror = () => {
        this.setState("error");
        this.cleanup();
        this.callbacks.onError?.(new Error("MediaRecorder error"));
      };

      // Audio level monitoring
      this.setupLevelMonitor();

      this.startTime = Date.now();
      this.mediaRecorder.start(250); // collect chunks every 250ms
      this.setState("recording");

      // Auto-stop at max duration
      this.maxDurationTimer = setTimeout(() => {
        if (this.state === "recording") this.stop();
      }, this.maxDurationMs);
    } catch (err) {
      this.setState("error");
      const error = err instanceof Error ? err : new Error("Failed to start recording");
      this.callbacks.onError?.(error);
    }
  }

  stop(): void {
    if (this.state !== "recording") return;
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }
    this.stopLevelMonitor();
    this.mediaRecorder?.stop();
  }

  private setupLevelMonitor() {
    if (!this.stream || !this.callbacks.onAudioLevel) return;
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const tick = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((s, v) => s + v, 0) / dataArray.length;
        const level = Math.min(1, avg / 128);
        this.callbacks.onAudioLevel?.(level);
        this.levelRafId = requestAnimationFrame(tick);
      };
      this.levelRafId = requestAnimationFrame(tick);
    } catch {
      // Level monitoring is optional
    }
  }

  private stopLevelMonitor() {
    if (this.levelRafId !== null) {
      cancelAnimationFrame(this.levelRafId);
      this.levelRafId = null;
    }
    this.analyser?.disconnect();
    this.analyser = null;
    this.audioContext?.close().catch(() => {});
    this.audioContext = null;
  }

  private cleanup() {
    this.stopLevelMonitor();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.mediaRecorder = null;
    this.chunks = [];
  }

  destroy() {
    if (this.state === "recording") this.stop();
    this.cleanup();
  }
}
