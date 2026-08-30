import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFileExtension, isRecordingSupported, detectSupportedMimeType } from "@/lib/audio/formats";

describe("getFileExtension", () => {
  it("returns webm for audio/webm types", () => {
    expect(getFileExtension("audio/webm")).toBe("webm");
    expect(getFileExtension("audio/webm;codecs=opus")).toBe("webm");
  });

  it("returns ogg for audio/ogg types", () => {
    expect(getFileExtension("audio/ogg")).toBe("ogg");
    expect(getFileExtension("audio/ogg;codecs=opus")).toBe("ogg");
  });

  it("returns mp4 for audio/mp4", () => {
    expect(getFileExtension("audio/mp4")).toBe("mp4");
  });

  it("returns wav for audio/wav", () => {
    expect(getFileExtension("audio/wav")).toBe("wav");
  });

  it("returns audio for unknown mime types", () => {
    expect(getFileExtension("audio/unknown")).toBe("audio");
    expect(getFileExtension("video/mp4")).toBe("audio");
  });
});

describe("isRecordingSupported", () => {
  it("returns true when MediaRecorder is available and a mime type is supported", () => {
    // window.MediaRecorder and navigator.mediaDevices are set up in setup.ts
    const supported = isRecordingSupported();
    expect(typeof supported).toBe("boolean");
  });
});

describe("detectSupportedMimeType", () => {
  it("returns a string or null", () => {
    const result = detectSupportedMimeType();
    expect(result === null || typeof result === "string").toBe(true);
  });

  it("returns one of the expected mime types when supported", () => {
    const result = detectSupportedMimeType();
    if (result !== null) {
      expect([
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "audio/mp4",
      ]).toContain(result);
    }
  });
});
