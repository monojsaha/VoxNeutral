# Privacy Policy — VoicePresence

## Audio Data

### Default Behaviour (retain_audio: false)
By default, all audio recordings are **processed locally in the browser and immediately discarded**. No audio file is uploaded to any server. The audio blob is passed to the heuristic scoring engine and then garbage collected.

**Exception**: The Web Speech API (used for transcription in Chrome/Edge) sends audio to Google's servers. This is a browser platform feature, not a VoicePresence server. Users who require full privacy should use Firefox (where SpeechRecognition may be unavailable) — the app falls back to heuristic scoring without transcription.

### Opt-in Audio Retention (retain_audio: true)
If the user explicitly enables "Retain Audio Recordings" in Settings, audio recordings are stored encrypted in Firebase Storage under the user's own authenticated path. This data is:
- Only accessible to the authenticated user
- Never shared with third parties
- Used only to improve personalised scoring for that user
- Deletable from the Settings page at any time

## Metrics Stored

The following is stored in Firestore for every pronunciation attempt:
- The target word (a string)
- Heuristic scores (numbers)
- Duration of the recording (milliseconds)
- Speech recognition transcript (a string)
- Timestamp

No biometric data, no voice fingerprint, no personally identifying audio is stored.

## Firestore Security

Firestore Security Rules ensure:
- Each user can only read and write their own data (`auth.uid == uid`)
- Content collections (words, sentences, paragraphs) are read-only for authenticated users
- No cross-user data access is possible at the database rules level

## Third-Party Services

| Service | Purpose | Privacy Policy |
|---------|---------|----------------|
| Firebase Auth | Authentication | [firebase.google.com/support/privacy](https://firebase.google.com/support/privacy) |
| Firestore | User data storage | [firebase.google.com/support/privacy](https://firebase.google.com/support/privacy) |
| Google Speech API | Transcription (via browser) | [policies.google.com/privacy](https://policies.google.com/privacy) |
| Vercel | Hosting | [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy) |

## Contact

For privacy questions, contact the project maintainer at the email address in the repository.
