# Database — Firestore Structure

## Collections

### Public Content (authenticated read-only)
```
/words/{wordId}
/minimal_pairs/{pairId}
/sentences/{sentenceId}
/paragraphs/{paragraphId}
```

These collections hold the pronunciation curriculum content. In MVP, content is served from `lib/phonemes/dictionary.ts` (local). Firestore collections are reserved for future CMS-managed content.

### User Data
All user data lives under `/users/{uid}/` with sub-collections and documents.

```
/users/{uid}/
  profile/data          — UserProfile document
  settings/data         — UserSettings document
  sessions/{sessionId}  — PracticeSession documents
  attempts/{attemptId}  — WordAttemptScore + metadata
  mastery/{wordId}      — WordMastery with spaced repetition state
  error_patterns/{type} — StoredErrorPattern aggregates
```

## Document Schemas

### `users/{uid}/profile/data`
```typescript
{
  uid: string
  email: string
  displayName: string
  createdAt: number          // Unix ms
  nativeLanguage: string     // "Bengali"
  targetAccent: "neutral" | "american" | "british"
  avatarUrl?: string
}
```

### `users/{uid}/settings/data`
```typescript
{
  retainAudio: boolean       // default: false
  referenceVoice: "neutral" | "american" | "british"
  dailySessionLengthMinutes: number    // 5-30
  notificationsEnabled: boolean
}
```

### `users/{uid}/sessions/{sessionId}`
```typescript
{
  userId: string
  sessionType: string        // "daily" | "boardroom" | "word_lab"
  startedAt: number
  completedAt: number | null
  wordCount: number
  averageScore: number | null
}
```

### `users/{uid}/attempts/{attemptId}`
```typescript
{
  userId: string
  wordId: string
  targetWord: string
  score: WordAttemptScore    // see PRONUNCIATION_SCORING.md
  timestamp: number
  sessionId: string
}
```

### `users/{uid}/mastery/{wordId}`
```typescript
{
  userId: string
  wordId: string
  word: string
  level: "new" | "learning" | "improving" | "boardroom_ready" | "mastered"
  lastScore: number
  bestScore: number
  attemptCount: number
  lastAttemptAt: number
  nextReviewAt: number       // spaced repetition due date
  easinessFactor: number     // SM-2 ease factor, default 2.5
}
```

### `users/{uid}/error_patterns/{type}`
```typescript
{
  userId: string
  patternType: ErrorPatternType
  occurrenceCount: number
  affectedWords: string[]
  lastSeen: number
  trend: "improving" | "stable" | "worsening"
  confidence: number         // 0-1
  updatedAt: number
}
```

## Security Rules Summary

| Path | Rules |
|------|-------|
| `/words/**` | Auth read; no write |
| `/minimal_pairs/**` | Auth read; no write |
| `/sentences/**` | Auth read; no write |
| `/paragraphs/**` | Auth read; no write |
| `/users/{uid}/**` | Read & write only if `auth.uid == uid` |

Full rules: see `firestore.rules`.

## Spaced Repetition Intervals

| Mastery Level | Review Interval |
|--------------|----------------|
| new | 1 day |
| learning | 3 days |
| improving | 7 days |
| boardroom_ready | 14 days |
| mastered | 30 days |
