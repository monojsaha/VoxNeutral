"use client";

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface TTSProvider {
  name: string;
  speak(text: string, options?: TTSOptions): void;
  cancel(): void;
  isAvailable(): boolean;
}

class BrowserTTSProvider implements TTSProvider {
  readonly name = "Browser TTS";
  private preferredVoice: SpeechSynthesisVoice | null = null;

  isAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  private findPreferredVoice(): SpeechSynthesisVoice | null {
    if (!this.isAvailable()) return null;
    const voices = window.speechSynthesis.getVoices();
    // Prefer Google/Natural/Microsoft voices in that order
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Premium"))
    );
    return preferred ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
  }

  speak(text: string, options: TTSOptions = {}): void {
    if (!this.isAvailable()) return;

    this.cancel();

    if (!this.preferredVoice) {
      this.preferredVoice = this.findPreferredVoice();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.preferredVoice) utterance.voice = this.preferredVoice;
    utterance.lang = "en-US";
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    window.speechSynthesis.speak(utterance);
  }

  cancel(): void {
    if (this.isAvailable()) {
      window.speechSynthesis.cancel();
    }
  }
}

let providerInstance: TTSProvider | null = null;

export function getTTSProvider(): TTSProvider {
  if (!providerInstance) {
    providerInstance = new BrowserTTSProvider();
  }
  return providerInstance;
}
