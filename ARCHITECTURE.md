# Architecture — VoicePresence MVP

## System Architecture

```mermaid
graph TB
    subgraph Client["Browser (Client)"]
        UI[React 19 UI<br/>Tailwind Dark Theme]
        AR[AudioRecorder<br/>MediaRecorder API]
        TTS[Browser TTS<br/>SpeechSynthesis]
        SE[Scoring Engine<br/>Heuristic Beta]
        SR[Web Speech API<br/>Transcription]
    end

    subgraph Firebase["Firebase (Backend)"]
        AUTH[Firebase Auth<br/>Email/Password]
        FS[Firestore<br/>User Data + Content]
    end

    subgraph Vercel["Vercel (Hosting)"]
        NEXT[Next.js 15<br/>App Router]
    end

    UI --> AR
    UI --> TTS
    AR --> SE
    SE --> SR
    SE --> FS
    UI --> AUTH
    UI --> FS
    NEXT --> Firebase
```

## Audio Pipeline

```mermaid
sequenceDiagram
    participant U as User
    participant MIC as Microphone
    participant REC as AudioRecorder
    participant SR as Web Speech API
    participant ENG as Scoring Engine
    participant FS as Firestore

    U->>REC: tap mic button
    REC->>MIC: getUserMedia()
    MIC-->>REC: MediaStream
    REC->>REC: MediaRecorder.start()
    REC->>REC: AnalyserNode (audio level)
    U->>REC: tap stop
    REC->>REC: collect Blob chunks
    REC-->>ENG: Blob + durationMs
    ENG->>SR: SpeechRecognition.start()
    SR-->>ENG: transcript string
    ENG->>ENG: levenshtein(target, transcript)
    ENG->>ENG: detectBengaliPatterns()
    ENG->>ENG: scoreSyllables()
    ENG->>ENG: weightedScore()
    ENG-->>U: WordAttemptScore (isBeta:true)
    ENG->>FS: saveAttempt()
    ENG->>FS: upsertErrorPattern()
```

## Firestore Data Model

```mermaid
erDiagram
    USERS {
        string uid PK
    }
    PROFILE {
        string uid
        string email
        string displayName
        number createdAt
        string nativeLanguage
        string targetAccent
    }
    SETTINGS {
        boolean retainAudio
        string referenceVoice
        number dailySessionLengthMinutes
    }
    SESSIONS {
        string userId
        string sessionType
        number startedAt
        number completedAt
        number wordCount
        number averageScore
    }
    ATTEMPTS {
        string userId
        string wordId
        string targetWord
        object score
        number timestamp
        string sessionId
    }
    MASTERY {
        string userId
        string wordId
        string word
        string level
        number lastScore
        number bestScore
        number attemptCount
        number nextReviewAt
    }
    ERROR_PATTERNS {
        string userId
        string patternType
        number occurrenceCount
        array affectedWords
        string trend
        number confidence
    }

    USERS ||--o| PROFILE : "profile/data"
    USERS ||--o| SETTINGS : "settings/data"
    USERS ||--o{ SESSIONS : "sessions/*"
    USERS ||--o{ ATTEMPTS : "attempts/*"
    USERS ||--o{ MASTERY : "mastery/{wordId}"
    USERS ||--o{ ERROR_PATTERNS : "error_patterns/{type}"
```

## Deployment Flow

```mermaid
graph LR
    DEV[Local Dev<br/>npm run dev] --> GIT[Git Push<br/>GitHub]
    GIT --> VERCEL[Vercel Build<br/>next build]
    VERCEL --> PROD[Production<br/>voicepresence.vercel.app]
    FIREBASE[Firebase Console<br/>Firestore Rules] --> PROD
```

## Component Hierarchy

```
app/layout.tsx (server)
└── AuthGuard (client) — redirects /login if no session
    └── Navigation (client) — sidebar + mobile bottom bar
        └── [page content]

app/word-lab/page.tsx (client)
├── WordCard (client)
│   ├── AudioRecorderComponent (client)
│   └── ScoreDisplay (client)

app/boardroom/page.tsx (client)
└── AudioRecorderComponent (client)

app/progress/page.tsx (client)
├── ScoreChart (client, recharts)
└── PhonemeHeatmap (client)
```
