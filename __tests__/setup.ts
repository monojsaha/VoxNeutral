import { vi, beforeAll, afterEach } from "vitest";
import "@testing-library/jest-dom";

// Mock window.speechSynthesis
beforeAll(() => {
  Object.defineProperty(window, "speechSynthesis", {
    value: {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue([
        { name: "Google US English", lang: "en-US", localService: false, default: true, voiceURI: "Google US English" },
        { name: "Microsoft David", lang: "en-US", localService: true, default: false, voiceURI: "Microsoft David" },
      ]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      speaking: false,
      pending: false,
      paused: false,
    },
    writable: true,
    configurable: true,
  });

  // Mock SpeechSynthesisUtterance
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    value: vi.fn().mockImplementation((text: string) => ({
      text,
      lang: "",
      voice: null,
      rate: 1,
      pitch: 1,
      volume: 1,
      onend: null,
      onerror: null,
    })),
    writable: true,
    configurable: true,
  });

  // Mock MediaRecorder
  const mockMediaRecorder = {
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    ondataavailable: null,
    onstop: null,
    onerror: null,
    state: "inactive" as RecordingState,
    mimeType: "audio/webm",
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 0,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  const MockMediaRecorder = vi.fn().mockImplementation(() => mockMediaRecorder);
  (MockMediaRecorder as unknown as { isTypeSupported: (mime: string) => boolean }).isTypeSupported =
    vi.fn().mockImplementation((mime: string) =>
      ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"].includes(mime)
    );

  Object.defineProperty(window, "MediaRecorder", {
    value: MockMediaRecorder,
    writable: true,
    configurable: true,
  });

  // Mock navigator.mediaDevices
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: vi.fn().mockReturnValue([{ stop: vi.fn(), kind: "audio" }]),
        getAudioTracks: vi.fn().mockReturnValue([{ stop: vi.fn(), kind: "audio" }]),
        active: true,
      }),
      enumerateDevices: vi.fn().mockResolvedValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    writable: true,
    configurable: true,
  });

  // Mock AudioContext
  const mockAnalyserNode = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    getByteTimeDomainData: vi.fn(),
    fftSize: 256,
    frequencyBinCount: 128,
  };

  const mockAudioContext = {
    createAnalyser: vi.fn().mockReturnValue(mockAnalyserNode),
    createMediaStreamSource: vi.fn().mockReturnValue({ connect: vi.fn() }),
    close: vi.fn(),
    state: "running",
  };

  Object.defineProperty(window, "AudioContext", {
    value: vi.fn().mockImplementation(() => mockAudioContext),
    writable: true,
    configurable: true,
  });

  // Mock SpeechRecognition
  const mockRecognition = {
    lang: "",
    maxAlternatives: 1,
    continuous: false,
    onresult: null as null | ((e: unknown) => void),
    onerror: null as null | ((e: unknown) => void),
    onend: null as null | (() => void),
    start: vi.fn(),
    stop: vi.fn(),
  };

  const MockSpeechRecognition = vi.fn().mockImplementation(() => mockRecognition);

  Object.defineProperty(window, "SpeechRecognition", {
    value: MockSpeechRecognition,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, "webkitSpeechRecognition", {
    value: MockSpeechRecognition,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

// Mock all firebase modules
vi.mock("@/lib/firebase/config", () => ({ app: {} }));

vi.mock("@/lib/firebase/auth", () => ({
  signIn: vi.fn().mockResolvedValue({ uid: "test-uid", email: "test@test.com" }),
  signUp: vi.fn().mockResolvedValue({ uid: "test-uid", email: "test@test.com" }),
  signOut: vi.fn().mockResolvedValue(undefined),
  getCurrentUser: vi.fn().mockReturnValue(null),
  onAuthChange: vi.fn().mockReturnValue(() => {}),
}));

vi.mock("@/lib/firebase/firestore", () => ({
  getProfile: vi.fn().mockResolvedValue(null),
  setProfile: vi.fn().mockResolvedValue(undefined),
  getUserSettings: vi.fn().mockResolvedValue(null),
  setUserSettings: vi.fn().mockResolvedValue(undefined),
  getWords: vi.fn().mockResolvedValue([]),
  createSession: vi.fn().mockResolvedValue("mock-session-id"),
  completeSession: vi.fn().mockResolvedValue(undefined),
  saveAttempt: vi.fn().mockResolvedValue("mock-attempt-id"),
  getRecentAttempts: vi.fn().mockResolvedValue([]),
  upsertErrorPattern: vi.fn().mockResolvedValue(undefined),
  getUserErrorPatterns: vi.fn().mockResolvedValue([]),
  updateWordMastery: vi.fn().mockResolvedValue(undefined),
  getWordsDueForReview: vi.fn().mockResolvedValue([]),
}));
