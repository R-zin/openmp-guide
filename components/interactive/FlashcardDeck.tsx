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

  // Extract unique categories
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
      <div className="p-8 text-center border border-[#E5E5E5] font-mono text-xs">
        No flashcards found.
      </div>
    );
  }

  return (
    <div className="my-8 font-mono">
      {/* Category Filter Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`px-2.5 py-1 text-xs uppercase border transition-colors ${
              selectedCategory === cat
                ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                : 'border-[#E5E5E5] dark:border-[#262626] text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[300px] border-2 border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] p-6 sm:p-8 flex flex-col justify-between transition-all select-none"
      >
        {/* Card Header */}
        <div className="flex justify-between items-center border-b border-[#E5E5E5] dark:border-[#262626] pb-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF]">
              [{currentCard.technology.toUpperCase()}]
            </span>
            <span className="text-[#737373] uppercase">
              {currentCard.category}
            </span>
          </div>
          <span className="text-[11px] text-[#737373]">
            {isFlipped ? '[ANSWER SIDE]' : '[QUESTION SIDE]'}
          </span>
        </div>

        {/* Card Body */}
        <div className="py-6 flex flex-col justify-center my-auto">
          {!isFlipped ? (
            <div>
              <div className="text-xs uppercase tracking-widest text-[#737373] mb-3">
                QUESTION / CONCEPT:
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#000000] dark:text-[#FFFFFF] leading-snug">
                {currentCard.front}
              </h2>
            </div>
          ) : (
            <div>
              <div className="text-xs uppercase tracking-widest text-[#737373] mb-3">
                ANSWER / SPECIFICATION:
              </div>
              <div className="text-sm sm:text-base text-[#000000] dark:text-[#FFFFFF] whitespace-pre-line leading-relaxed font-sans">
                {currentCard.back}
              </div>
              {currentCard.codeSnippet && (
                <div className="mt-4 p-3 bg-[#F5F5F5] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] font-mono text-xs">
                  <pre>
                    <code>{currentCard.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-[#E5E5E5] dark:border-[#262626] text-xs text-[#737373]">
          <span>CLICK CARD OR PRESS SPACE TO FLIP</span>
          <span>
            CARD {currentIndex + 1} OF {deck.length}
          </span>
        </div>
      </div>

      {/* Navigation & Controls Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF] disabled:opacity-30"
          >
            &larr; PREVIOUS
          </button>
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-5 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold uppercase tracking-wider"
          >
            {isFlipped ? 'SHOW QUESTION' : 'FLIP ANSWER'}
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === deck.length - 1}
            className="px-4 py-2 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF] disabled:opacity-30"
          >
            NEXT &rarr;
          </button>
        </div>

        <button
          onClick={handleShuffle}
          className="px-3 py-2 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF] text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF] uppercase"
        >
          SHUFFLE CARDS
        </button>
      </div>
    </div>
  );
}
