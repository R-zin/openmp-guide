import React from 'react';
import { getFlashcards } from '@/lib/content';
import { FlashcardDeck } from '@/components/interactive/FlashcardDeck';

export const metadata = {
  title: 'Interactive Flashcards // Parallel Programming Study Guide',
  description: '65+ quick-fire revision flashcards covering MPI primitives, OpenMP clauses, runtime API functions, sync directives, and common exam pitfalls.',
};

export default function FlashcardsPage() {
  const cards = getFlashcards();

  return (
    <div className="max-w-[880px] mx-auto space-y-8 font-sans py-4">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <span>Rapid Revision Drills</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Interactive Flashcards ({cards.length})
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Test your recall on MPI function signatures, OpenMP directive scoping, communication complexities, and slide pitfalls. Use the spacebar or Enter to flip cards, and left/right arrow keys to navigate.
        </p>
      </div>

      {/* Keyboard Shortcuts Pill Bar */}
      <div className="p-4 rounded-2xl apple-card text-xs flex flex-wrap gap-4 justify-between items-center text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-neutral-900 dark:text-white">Shortcuts:</span>
          <span className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1] text-[10px] text-neutral-700 dark:text-neutral-300 font-mono">Space</kbd>
            <span>/</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1] text-[10px] text-neutral-700 dark:text-neutral-300 font-mono">Enter</kbd>
            <span>flip</span>
          </span>
          <span>&bull;</span>
          <span className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1] text-[10px] text-neutral-700 dark:text-neutral-300 font-mono">&larr;</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1] text-[10px] text-neutral-700 dark:text-neutral-300 font-mono">&rarr;</kbd>
            <span>navigate</span>
          </span>
        </div>
        <div className="font-semibold text-neutral-900 dark:text-white">
          {cards.length} Cards in Deck
        </div>
      </div>

      {/* Flashcard Component */}
      <FlashcardDeck cards={cards} />

      {/* Revision Strategy Cards */}
      <div className="apple-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Exam Revision Strategy with Flashcards
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] space-y-1">
            <div className="font-semibold text-neutral-900 dark:text-white">1. Signature Recall</div>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Verify you can write exact argument orders for <code className="text-neutral-900 dark:text-white font-mono">MPI_Sendrecv</code>, <code className="text-neutral-900 dark:text-white font-mono">MPI_Reduce</code>, and <code className="text-neutral-900 dark:text-white font-mono">MPI_Scatter</code> without consulting docs.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] space-y-1">
            <div className="font-semibold text-neutral-900 dark:text-white">2. Default Scoping</div>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Drill variable scoping rules: parallel loop index variables are always private; shared variables cause silent data races without atomic or reduction.
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] space-y-1">
            <div className="font-semibold text-neutral-900 dark:text-white">3. Complexities</div>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Memorize Cannon&apos;s algorithm communication cost and parallel odd-even transposition sort phase bounds for viva/theory questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
