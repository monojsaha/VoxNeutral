"use client";

import { useState } from "react";

interface PhonemeCell {
  phoneme: string;
  score: number;
  guidance?: string;
}

type PhonemeCategory = {
  name: string;
  cells: PhonemeCell[];
};

const PHONEME_DATA: PhonemeCategory[] = [
  {
    name: "Consonants",
    cells: [
      { phoneme: "/p/", score: 88 },
      { phoneme: "/b/", score: 85 },
      { phoneme: "/t/", score: 82 },
      { phoneme: "/d/", score: 80 },
      { phoneme: "/k/", score: 84 },
      { phoneme: "/g/", score: 78 },
      { phoneme: "/f/", score: 76 },
      { phoneme: "/v/", score: 52, guidance: "V/W confusion — rest upper teeth on lower lip for /v/" },
      { phoneme: "/s/", score: 85 },
      { phoneme: "/z/", score: 80 },
      { phoneme: "/ʃ/", score: 79 },
      { phoneme: "/ʒ/", score: 72 },
      { phoneme: "/m/", score: 90 },
      { phoneme: "/n/", score: 88 },
      { phoneme: "/l/", score: 82 },
      { phoneme: "/r/", score: 74 },
      { phoneme: "/w/", score: 77 },
      { phoneme: "/j/", score: 85 },
    ],
  },
  {
    name: "TH Sounds",
    cells: [
      { phoneme: "/θ/", score: 45, guidance: "TH voiceless → T. Tongue between teeth, blow air out." },
      { phoneme: "/ð/", score: 48, guidance: "TH voiced → D. Same position as /θ/ but add voice." },
    ],
  },
  {
    name: "Vowels",
    cells: [
      { phoneme: "/iː/", score: 80 },
      { phoneme: "/ɪ/", score: 65, guidance: "Short /ɪ/ vs long /iː/ confusion. Relax the tongue." },
      { phoneme: "/ʊ/", score: 72 },
      { phoneme: "/uː/", score: 78 },
      { phoneme: "/e/", score: 82 },
      { phoneme: "/ə/", score: 70, guidance: "Schwa /ə/ in unstressed syllables — very short and neutral" },
      { phoneme: "/ɜː/", score: 68 },
      { phoneme: "/ɔː/", score: 74 },
      { phoneme: "/æ/", score: 76 },
      { phoneme: "/ɑː/", score: 75 },
      { phoneme: "/ʌ/", score: 72 },
    ],
  },
];

function getCellColor(score: number): string {
  if (score >= 85) return "bg-success-500/20 text-success-500 border-success-500/30";
  if (score >= 70) return "bg-brand-500/15 text-brand-400 border-brand-500/30";
  if (score >= 60) return "bg-warning-500/15 text-warning-500 border-warning-500/30";
  return "bg-error-500/15 text-error-500 border-error-500/30";
}

export function PhonemeHeatmap() {
  const [selected, setSelected] = useState<PhonemeCell | null>(null);

  return (
    <div className="space-y-5">
      {PHONEME_DATA.map((cat) => (
        <div key={cat.name} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{cat.name}</p>
          <div className="flex flex-wrap gap-2">
            {cat.cells.map((cell) => (
              <button
                key={cell.phoneme}
                onClick={() => setSelected(selected?.phoneme === cell.phoneme ? null : cell)}
                className={`flex flex-col items-center px-2 py-1.5 rounded-lg border text-xs font-medium transition-all hover:opacity-90 ${getCellColor(cell.score)} ${selected?.phoneme === cell.phoneme ? "ring-2 ring-white/30" : ""}`}
              >
                <span className="font-mono">{cell.phoneme}</span>
                <span className="text-[10px] mt-0.5 opacity-70">{cell.score}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {selected && selected.guidance && (
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 space-y-1">
          <p className="text-sm font-semibold text-neutral-200 font-mono">{selected.phoneme} — Score {selected.score}</p>
          <p className="text-sm text-neutral-400">{selected.guidance}</p>
        </div>
      )}
    </div>
  );
}
