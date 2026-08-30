import { describe, it, expect } from "vitest";
import {
  getFileExtension,
  isRecordingSupported,
  detectSupportedMimeType,
} from "@/lib/audio/formats";

describe("getFileExtension", () => {
  it("returns webm for audio/webm", () => {
    expect(getFileExtension("audio/webm")).toBe("webm");
  });

  it("returns webm for audio/webm;codecs=opus", () => {
    expect(getFileExtension("audio/webm;codecs=opus")).toBe("webm");
  });

  it("returns ogg for audio/ogg", () => {
    expect(getFileExtension("audio/ogg")).toBe("ogg");
  });

  it("returns ogg for audio/ogg;codecs=opus", () => {
    expect(getFileExtension("audio/ogg;codecs=opus")).toBe("ogg");
  });

  it("returns mp4 for audio/mp4", () => {
    expect(getFileExtension("audio/mp4")).toBe("mp4");
  });

  it("returns webm as fallback for unknown types", () => {
    expect(getFileExtension("audio/unknown")).toBe("webm");
  });

  it("handles empty string without throwing", () => {
    expect(() => getFileExtension("")).not.toThrow();
  });
});

describe("isRecordingSupported", () => {
  it("returns a boolean", () => {
    expect(typeof isRecordingSupported()).toBe("boolean");
  });

  it("returns true when MediaRecorder is mocked in window", () => {
    expect(isRecordingSupported()).toBe(true);
  });
});

describe("detectSupportedMimeType", () => {
  it("returns a string when a supported format is found", () => {
    const mime = detectSupportedMimeType();
    expect(typeof mime).toBe("string");
  });

  it("returns a non-empty string", () => {
    const mime = detectSupportedMimeType();
    expect(mime.length).toBeGreaterThan(0);
  });

  it("returns a valid audio mime type", () => {
    const mime = detectSupportedMimeType();
    expect(mime).toMatch(/^audio\//);
  });

  it("prefers webm/opus when available (mock supports it)", () => {
    const mime = detectSupportedMimeType();
    // Our mock supports audio/webm;codecs=opus — it should be selected first
    expect(mime).toMatch(/webm/);
  });
});
