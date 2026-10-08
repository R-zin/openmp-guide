'use client';

import React, { useState, useEffect } from 'react';
import { Flashcard } from '@/lib/types';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [deck, setDeck] = useState<Flashcard[]>(cards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(cards.map((c) => c.category)))];

  const handleFilter = (cat: string) => {
    setSelectedCategory(cat);
    const filtered = cat === 'ALL' ? cards : cards.filter((c) => c.category === cat);
    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = deck[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length]);

  if (!currentCard) {
    return (
      <div className="p-8 text-center apple-card rounded-2xl text-xs text-neutral-400">
        No flashcards found.
      </div>
    );
  }

  return (
    <div className="my-8 font-sans">
      {/* Category Filter Toolbar */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Apple Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[340px] apple-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 select-none relative overflow-hidden group hover:border-black/20 dark:hover:border-white/20"
      >
        {/* Card Header */}
        <div className="flex justify-between items-center pb-4 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wide">
              {currentCard.technology}
            </span>
            <span className="text-neutral-400 text-xs font-medium">
              {currentCard.category}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            {isFlipped ? 'Answer Side' : 'Question Side'}
          </span>
        </div>

        {/* Card Body */}
        <div className="py-8 flex flex-col justify-center my-auto">
          {!isFlipped ? (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Question / Core Concept:
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white leading-snug tracking-tight">
                {currentCard.front}
              </h2>
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                Specification / Solution:
              </div>
              <div className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 whitespace-pre-line leading-relaxed">
                {currentCard.back}
              </div>
              {currentCard.codeSnippet && (
                <div className="mt-4 p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto">
                  <pre>
                    <code>{currentCard.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-xs text-neutral-400">
          <span className="flex items-center space-x-1.5">
            <span>Click card or press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1] text-[10px] text-neutral-600 dark:text-neutral-300 font-mono">Space</kbd>
            <span>to flip</span>
          </span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            Card {currentIndex + 1} of {deck.length}
          </span>
        </div>
      </div>

      {/* Navigation & Controls Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium transition-all disabled:opacity-30"
          >
            &larr; Previous
          </button>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold transition-all shadow-sm"
          >
            {isFlipped ? 'Show Question' : 'Flip Answer'}
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === deck.length - 1}
            className="px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium transition-all disabled:opacity-30"
          >
            Next &rarr;
          </button>
        </div>

        <button
          onClick={handleShuffle}
          className="px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-500 hover:text-black dark:hover:text-white font-medium transition-all"
        >
          Shuffle Cards ⟳
        </button>
      </div>
    </div>
  );
}
