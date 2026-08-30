export type SupportedMimeType =
  | "audio/webm;codecs=opus"
  | "audio/webm"
  | "audio/ogg;codecs=opus"
  | "audio/ogg"
  | "audio/mp4";

const MIME_CANDIDATES: SupportedMimeType[] = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/mp4",
];

export function detectSupportedMimeType(): SupportedMimeType | null {
  if (typeof window === "undefined" || !window.MediaRecorder) {
    return null;
  }
  for (const mime of MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }
  return null;
}

export function getFileExtension(mimeType: string): string {
  if (mimeType.startsWith("audio/webm")) return "webm";
  if (mimeType.startsWith("audio/ogg")) return "ogg";
  if (mimeType.startsWith("audio/mp4")) return "mp4";
  if (mimeType.startsWith("audio/wav")) return "wav";
  return "webm";
}

export function isRecordingSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.MediaRecorder) return false;
  if (!navigator.mediaDevices?.getUserMedia) return false;
  return detectSupportedMimeType() !== null;
}
