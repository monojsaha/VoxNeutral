import { vi, beforeAll, afterEach } from "vitest";

// Mock window.speechSynthesis
beforeAll(() => {
  Object.defineProperty(window, "speechSynthesis", {
    value: {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
    writable: true,
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
    state: "inactive",
    mimeType: "audio/webm",
  };

  Object.defineProperty(window, "MediaRecorder", {
    value: vi.fn().mockImplementation(() => mockMediaRecorder),
    writable: true,
  });

  (window.MediaRecorder as unknown as { isTypeSupported: ReturnType<typeof vi.fn> }).isTypeSupported = vi
    .fn()
    .mockImplementation((mime: string) => mime === "audio/webm;codecs=opus" || mime === "audio/webm");

  // Mock navigator.mediaDevices
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
        getAudioTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
      }),
    },
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

// Mock all firebase modules
vi.mock("@/lib/firebase/config", () => ({
  app: {},
}));

vi.mock("@/lib/firebase/auth", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
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
