# Pronunciation Scoring — Beta Methodology

> **All scores are labelled `isBeta: true`. These are heuristic estimates, not ML-verified phoneme analysis.**

## Overview

VoicePresence MVP uses a multi-stage heuristic pipeline to score pronunciation attempts. The system is designed to provide directionally useful feedback while a proper phoneme-level ML model is developed.

## Scoring Pipeline

### Stage 1: Transcription (Web Speech API)
The browser's built-in `SpeechRecognition` API is used to transcribe the audio. This is English US (`lang: 'en-US'`) and works best in Chrome/Edge. If transcription is unavailable, a heuristic fallback score is generated.

**Limitation**: Web Speech API sends audio to Google's servers (in Chrome). Users who disable audio retention in Settings are informed of this. This will be replaced with on-device Whisper inference in a future version.

### Stage 2: Lexical Similarity
Levenshtein edit distance between the target word and the transcript produces a base similarity score (0–100):
```
similarity = (1 - editDistance(target, transcript) / max(len(target), len(transcript))) * 100
```

### Stage 3: Bengali Pattern Detection
The transcript is checked for common Bengali→English transfer errors:

| Pattern | Detection Method | Penalty |
|---------|-----------------|---------|
| V→W confusion | target starts with 'v', transcript starts with 'w' | -15 pts |
| TH→T voiceless | target contains 'th', transcript contains 't' in same position | -12 pts |

More patterns will be added as the system matures.

### Stage 4: Component Scoring

| Component | Method | Weight |
|-----------|--------|--------|
| Pronunciation | Similarity minus Bengali pattern penalties | 60% |
| Word Stress | Duration ratio vs expected syllable count × 200ms | 20% |
| Timing | Penalty if ratio <0.5 or >2.5 | 10% |
| Clarity | Pronunciation score ± small variance | 10% |

### Stage 5: Weighted Overall Score
```
overall = pronunciation × 0.60 + wordStress × 0.20 + timing × 0.10 + clarity × 0.10
```

## Score Bands

| Band | Range | Label |
|------|-------|-------|
| excellent | 90-100 | Boardroom-ready |
| good | 80-89 | Strong |
| fair | 70-79 | Developing |
| developing | 60-69 | Needs practice |
| needs_work | 0-59 | Focus area |

## Future ML Path

The heuristic scorer is a stepping stone. The roadmap:

1. **Phase 2**: Replace Web Speech API with on-device Whisper (via ONNX Runtime Web) for privacy and offline support
2. **Phase 3**: Phoneme-level alignment using wav2vec2 or similar model, running in a WebWorker
3. **Phase 4**: Personal voice model fine-tuning using retained audio (opt-in)
4. **Phase 5**: Prosody analysis (pitch contour, energy envelope) for intonation and rhythm scoring

## Data Stored Per Attempt

```typescript
WordAttemptScore {
  overallScore: number       // 0-100, weighted
  components: {
    pronunciation: number    // lexical similarity - pattern penalties
    wordStress: number       // duration heuristic
    timing: number           // pace heuristic
    clarity: number          // pronunciation ± variance
  }
  phonemes: PhonemeScore[]   // per-syllable heuristic
  syllables: SyllableScore[] // with stress flag
  mainIssue: string          // human-readable diagnosis
  suggestion: string         // actionable guidance
  transcript: string         // what SR heard
  isBeta: true               // ALWAYS true
}
```
