export interface TransferPattern {
  id: string;
  name: string;
  sourcePhoneme: string;
  targetPhoneme: string;
  description: string;
  articulationGuidance: string;
  exampleWords: string[];
  minimalPairs?: [string, string][];
}

export const BENGALI_TRANSFER_PATTERNS: TransferPattern[] = [
  {
    id: "v_w_confusion",
    name: "V / W Confusion",
    sourcePhoneme: "/w/",
    targetPhoneme: "/v/",
    description:
      "Bengali has no /v/ phoneme. Speakers often produce /w/ for both /v/ and /w/, or occasionally /b/. 'vendor' becomes 'wender', 'value' becomes 'walue'.",
    articulationGuidance:
      "For /v/: Rest your upper front teeth lightly on your lower lip. Add voice while pushing air through. Feel the vibration — 'vvvvv'. For /w/: Round your lips, no teeth contact. 'wwww'. Practice contrasting pairs: vine/wine, veil/wail.",
    exampleWords: ["vendor", "value", "version", "virtual", "volume", "valid", "valuable"],
    minimalPairs: [
      ["vine", "wine"],
      ["veil", "wail"],
      ["vent", "went"],
      ["vest", "west"],
    ],
  },
  {
    id: "th_voiceless",
    name: "Voiceless TH → T",
    sourcePhoneme: "/t/",
    targetPhoneme: "/θ/",
    description:
      "Bengali has no dental fricatives. The voiceless /θ/ (as in 'think') is typically replaced by /t/, making 'three' sound like 'tree', 'think' like 'tink'.",
    articulationGuidance:
      "Place your tongue tip lightly between your upper and lower front teeth. Blow air out gently — do NOT voice it. You should feel air flowing over your tongue. Practice: 'θ-θ-θ-think' — hold the /θ/ for 2 seconds before finishing the word.",
    exampleWords: ["think", "three", "through", "threshold", "thought", "thread", "theory"],
    minimalPairs: [
      ["think", "tink"],
      ["three", "tree"],
      ["thank", "tank"],
      ["thin", "tin"],
    ],
  },
  {
    id: "th_voiced",
    name: "Voiced TH → D",
    sourcePhoneme: "/d/",
    targetPhoneme: "/ð/",
    description:
      "The voiced /ð/ (as in 'the', 'this', 'that') is replaced by /d/ in Bengali-influenced English. 'The system' becomes 'de system'.",
    articulationGuidance:
      "Same tongue position as voiceless TH — tip between teeth — but now add voice. Feel your throat vibrate while air passes through. 'ð-ð-ð-the'. Practice: 'This is THE thing' — both TH sounds in one sentence.",
    exampleWords: ["the", "this", "that", "though", "therefore", "these", "those"],
    minimalPairs: [
      ["this", "dis"],
      ["that", "dat"],
      ["though", "dough"],
      ["thy", "die"],
    ],
  },
  {
    id: "short_long_vowel",
    name: "Short /ɪ/ vs Long /iː/",
    sourcePhoneme: "/ɪ/",
    targetPhoneme: "/iː/",
    description:
      "Bengali vowel length contrasts differ from English. The short /ɪ/ (as in 'ship') and long /iː/ (as in 'sheep') are often confused, making 'bit' sound like 'beat', 'live' like 'leave'.",
    articulationGuidance:
      "For /ɪ/ (ship): Mouth slightly open, tongue high but relaxed, lips spread. Short and lax. For /iː/ (sheep): Mouth nearly closed, tongue very high and front, lips spread wide. Hold it longer. Practice: ship/sheep, bit/beat, fill/feel.",
    exampleWords: ["implementation", "intelligence", "initiative", "integration", "iteration"],
    minimalPairs: [
      ["ship", "sheep"],
      ["bit", "beat"],
      ["fill", "feel"],
      ["live", "leave"],
    ],
  },
  {
    id: "final_consonant_weakening",
    name: "Weak / Deleted Final Consonants",
    sourcePhoneme: "∅",
    targetPhoneme: "/t/, /d/, /k/, /p/, /s/, /z/",
    description:
      "Bengali syllable structure permits limited final consonants. English final consonants — especially stops (/t/, /d/, /k/) — are weakened or deleted. 'Architect' becomes 'archite', 'cloud' becomes 'clou'.",
    articulationGuidance:
      "For final stops: Build up air pressure and release it cleanly. 'arcHITECT' — feel the /t/ pop. For final fricatives: Continue the airflow until the end. Practice word-final /t/ and /d/ with tapping: 'architecttt', 'clouddd'.",
    exampleWords: ["architect", "cloud", "architect", "impact", "concept", "object", "project"],
    minimalPairs: [
      ["seat", "sea"],
      ["food", "foo"],
      ["back", "ba"],
      ["make", "may"],
    ],
  },
  {
    id: "vowel_insertion",
    name: "Vowel Insertion in Consonant Clusters",
    sourcePhoneme: "/ə/ (inserted)",
    targetPhoneme: "∅",
    description:
      "Bengali phonology avoids complex consonant clusters. Speakers insert a schwa /ə/ between consonants: 'cloud' becomes 'cul-oud', 'world' becomes 'wur-uld', 'script' becomes 'uscript'.",
    articulationGuidance:
      "Identify the cluster and practise blending without a break. For 'scr-': 'sss...ccc...rrr' — no vowel between. Record yourself and compare to native pronunciation. Words to drill: script, strength, cloud, world, strict.",
    exampleWords: ["script", "strength", "cloud", "world", "strict", "stream", "screen"],
  },
  {
    id: "word_stress_equal_weighting",
    name: "Equal Syllable Stress (Mora-Timing)",
    sourcePhoneme: "equal stress",
    targetPhoneme: "stress-timed",
    description:
      "Bengali is more syllable-timed than English. Speakers give roughly equal weight to every syllable, reducing the prominence of stressed syllables and preventing reduction of unstressed ones. 'authentication' receives equal stress on all 5 syllables instead of primary stress on CA.",
    articulationGuidance:
      "In English, stressed syllables are LOUDER, LONGER, and HIGHER in pitch. Unstressed syllables are short, quiet, and often reduced to /ə/ (schwa). Practice: 'au-then-ti-CA-tion' — make CA three times as loud as the rest. Record and compare.",
    exampleWords: ["authentication", "orchestration", "infrastructure", "technology", "implementation"],
  },
];

export function getPatternById(id: string): TransferPattern | undefined {
  return BENGALI_TRANSFER_PATTERNS.find((p) => p.id === id);
}
