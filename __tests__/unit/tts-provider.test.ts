import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTTSProvider } from "@/lib/tts/provider";

describe("getTTSProvider", () => {
  it("returns a provider object", () => {
    const provider = getTTSProvider();
    expect(provider).toBeDefined();
    expect(typeof provider.speak).toBe("function");
    expect(typeof provider.cancel).toBe("function");
    expect(typeof provider.isAvailable).toBe("function");
    expect(typeof provider.name).toBe("string");
  });

  it("returns the same singleton instance on multiple calls", () => {
    const p1 = getTTSProvider();
    const p2 = getTTSProvider();
    expect(p1).toBe(p2);
  });

  it("provider name is non-empty", () => {
    expect(getTTSProvider().name.length).toBeGreaterThan(0);
  });
});

describe("BrowserTTSProvider.isAvailable", () => {
  it("returns true when speechSynthesis is mocked in window", () => {
    const provider = getTTSProvider();
    expect(provider.isAvailable()).toBe(true);
  });
});

describe("BrowserTTSProvider.speak", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls speechSynthesis.speak with an utterance", () => {
    const provider = getTTSProvider();
    provider.speak("orchestration");
    expect(window.speechSynthesis.speak).toHaveBeenCalledOnce();
  });

  it("calls speechSynthesis.cancel before speaking (clears queue)", () => {
    const provider = getTTSProvider();
    provider.speak("algorithm");
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it("does not throw with empty string", () => {
    const provider = getTTSProvider();
    expect(() => provider.speak("")).not.toThrow();
  });

  it("accepts custom rate option", () => {
    const provider = getTTSProvider();
    expect(() => provider.speak("governance", { rate: 0.75 })).not.toThrow();
  });

  it("accepts custom pitch option", () => {
    const provider = getTTSProvider();
    expect(() => provider.speak("resilience", { pitch: 1.2 })).not.toThrow();
  });
});

describe("BrowserTTSProvider.cancel", () => {
  it("calls speechSynthesis.cancel", () => {
    const provider = getTTSProvider();
    provider.cancel();
    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });

  it("does not throw when called multiple times", () => {
    const provider = getTTSProvider();
    expect(() => {
      provider.cancel();
      provider.cancel();
      provider.cancel();
    }).not.toThrow();
  });
});
