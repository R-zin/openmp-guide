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
    <div className="max-w-[860px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#000000] dark:border-[#FFFFFF] pb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#737373] mb-2">
          RAPID REVISION DRILLS
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#000000] dark:text-[#FFFFFF] mb-3">
          INTERACTIVE FLASHCARDS ({cards.length})
        </h1>
        <p className="text-sm sm:text-base text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
          Test your recall on MPI function signatures, OpenMP directive scoping, communication complexities, and slide pitfalls. Use the spacebar or Enter to flip cards, and left/right arrow keys to navigate.
        </p>
      </div>

      {/* Instructions Box */}
      <div className="p-4 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212] font-mono text-xs flex flex-wrap gap-4 justify-between items-center text-[#737373] dark:text-[#8C8C8C]">
        <div>
          <span className="font-bold text-[#000000] dark:text-[#FFFFFF]">KEYBOARD SHORTCUTS:</span>{' '}
          <code className="px-1.5 py-0.5 border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF]">Space</code> or <code className="px-1.5 py-0.5 border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF]">Enter</code> to flip &bull;{' '}
          <code className="px-1.5 py-0.5 border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF]">&larr;</code> / <code className="px-1.5 py-0.5 border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF]">&rarr;</code> to navigate
        </div>
        <div>
          Total: <span className="font-bold text-[#000000] dark:text-[#FFFFFF]">{cards.length} cards</span>
        </div>
      </div>

      {/* Flashcard Component */}
      <FlashcardDeck cards={cards} />

      {/* Study Tips for Flashcards */}
      <div className="border border-[#000000] dark:border-[#FFFFFF] p-6 space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF]">
          EXAM REVISION STRATEGY WITH FLASHCARDS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#737373] dark:text-[#8C8C8C]">
          <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#FFFFFF] dark:bg-[#000000]">
            <div className="font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">1. SIGNATURE RECALL</div>
            Verify you can write exact argument orders for <code className="text-[#000000] dark:text-[#FFFFFF]">MPI_Sendrecv</code>, <code className="text-[#000000] dark:text-[#FFFFFF]">MPI_Reduce</code>, and <code className="text-[#000000] dark:text-[#FFFFFF]">MPI_Scatter</code> without consulting docs.
          </div>
          <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#FFFFFF] dark:bg-[#000000]">
            <div className="font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">2. DEFAULT SCOPING</div>
            Drill variable scoping rules: parallel loop index variables are always private; shared variables cause silent data races without atomic or reduction.
          </div>
          <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#FFFFFF] dark:bg-[#000000]">
            <div className="font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">3. COMPLEXITIES</div>
            Memorize Cannon's algorithm communication cost and parallel odd-even transposition sort phase bounds for viva/theory questions.
          </div>
        </div>
      </div>
    </div>
  );
}
