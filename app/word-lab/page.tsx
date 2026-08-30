"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { WordCard } from "@/components/word/WordCard";
import { getAllWords } from "@/lib/phonemes/dictionary";

export default function WordLabPage() {
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const allWords = useMemo(() => getAllWords(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return allWords;
    const q = search.toLowerCase();
    return allWords.filter((w) => w.word.toLowerCase().includes(q));
  }, [allWords, search]);

  const currentWord = selectedWord
    ? allWords.find((w) => w.word === selectedWord) ?? allWords[0]
    : allWords[0];

  const currentIndex = allWords.findIndex((w) => w.word === currentWord?.word);

  function handleNext() {
    if (currentIndex < allWords.length - 1) {
      setSelectedWord(allWords[currentIndex + 1].word);
    }
  }

  return (
    <div className="flex h-[calc(100vh-0px)] lg:h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-neutral-900 border-r border-neutral-800 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-neutral-800">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            Word Lab
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((entry) => (
            <button
              key={entry.word}
              onClick={() => setSelectedWord(entry.word)}
              className={`w-full text-left px-4 py-3 hover:bg-neutral-800 transition-colors border-b border-neutral-800/50 ${
                currentWord?.word === entry.word ? "bg-neutral-800 border-l-2 border-l-brand-500" : ""
              }`}
            >
              <p className="text-sm font-medium text-neutral-200 capitalize">{entry.word}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{entry.ipa}</p>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-neutral-800">
          <p className="text-xs text-neutral-600 text-center">{allWords.length} words in library</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Mobile search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          {filtered.length > 0 && search && (
            <div className="mt-2 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              {filtered.map((entry) => (
                <button
                  key={entry.word}
                  onClick={() => { setSelectedWord(entry.word); setSearch(""); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-800 text-sm text-neutral-200 capitalize border-b border-neutral-800/50"
                >
                  {entry.word}
                </button>
              ))}
            </div>
          )}
        </div>

        {currentWord && (
          <WordCard
            entry={currentWord}
            onNext={currentIndex < allWords.length - 1 ? handleNext : undefined}
          />
        )}
      </main>
    </div>
  );
}
