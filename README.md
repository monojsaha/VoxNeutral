# VoicePresence

Executive English Pronunciation & Boardroom Speech Coach for senior technology leaders.

## What It Is

VoicePresence is a targeted pronunciation coaching tool for technology executives who present to global boards, investors, and international teams. It focuses on the specific phonological challenges of Bengali-speaking leaders transitioning to International English — particularly v/w confusion, TH sounds, word stress, and connected speech.

## Key Features

- **Word Lab** — 29+ technical vocabulary words with IPA, syllable breakdown, and interactive recording
- **Daily Practice** — Structured 10-minute sessions across 5 segments (sounds, stress, sentences, paragraphs, review)
- **Boardroom Challenge** — 5 executive speaking scenarios with POINT→REASON→EVIDENCE→CONCLUSION framework
- **Progress Tracking** — Score trends, phoneme heatmap, difficult words, and recurring pattern analysis
- **AI Coach** — Personalised weekly reports with Bengali→International English transfer pattern guidance
- **Heuristic Beta Scoring** — Levenshtein-based similarity scoring with Bengali pattern detection (no phoneme ML)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router |
| Language | TypeScript 5 (strict) |
| UI | React 19, Tailwind CSS 3 (dark theme) |
| Auth + Database | Firebase Auth + Firestore |
| Audio | Browser MediaRecorder API |
| TTS | Web Speech Synthesis API |
| Charts | Recharts |
| Testing | Vitest + Testing Library |

## Quick Start

```bash
# 1. Clone and install
git clone <repo>
cd voxneutral
npm install

# 2. Configure Firebase
cp .env.example .env.local
# Edit .env.local with your Firebase project credentials

# 3. Run in development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home dashboard
│   ├── login/              # Authentication
│   ├── word-lab/           # Interactive word practice
│   ├── practice/           # Daily 10-minute sessions
│   ├── progress/           # Progress tracking & analytics
│   ├── boardroom/          # Executive scenario practice
│   ├── coach/              # AI coach & weekly report
│   └── settings/           # User preferences
├── components/
│   ├── ui/                 # Button, Card, Badge, ScoreRing, Spinner
│   ├── layout/             # Navigation, AuthGuard
│   ├── audio/              # AudioRecorder component
│   ├── word/               # WordCard, ScoreDisplay
│   └── progress/           # ScoreChart, PhonemeHeatmap
├── lib/
│   ├── firebase/           # Auth, Firestore, Admin SDK
│   ├── audio/              # MediaRecorder wrapper, format detection
│   ├── tts/                # Browser TTS provider
│   ├── phonemes/           # Dictionary, Bengali transfer patterns
│   └── scoring/            # Heuristic scoring engine, weights, mastery
├── types/                  # Shared TypeScript types
└── __tests__/              # Vitest unit tests
```

## Firebase Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full Firebase and Vercel setup instructions.

## Scoring Disclaimer

All pronunciation scores are heuristic Beta estimates. They use Levenshtein distance between the speech recognition transcript and target word, combined with duration-based stress heuristics and Bengali pattern detection. They are NOT phoneme-level ML analysis. See [PRONUNCIATION_SCORING.md](./PRONUNCIATION_SCORING.md) for full methodology.
