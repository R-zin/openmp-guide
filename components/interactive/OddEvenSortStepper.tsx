'use client';

import React, { useState } from 'react';

const INITIAL_DATA: number[][] = [
  [15, 23, 29, 100],     // Rank 0
  [-14, 45, 178, 192],   // Rank 1
  [-118, 0, 7, 246],     // Rank 2
  [1, 10, 25, 34],       // Rank 3
];

function mergeLowHigh(arrA: number[], arrB: number[]): { low: number[]; high: number[] } {
  const merged = [...arrA, ...arrB].sort((a, b) => a - b);
  return {
    low: merged.slice(0, arrA.length),
    high: merged.slice(arrA.length),
  };
}

export function OddEvenSortStepper() {
  const [phase, setPhase] = useState<number>(0);

  const computeStateForPhase = (targetPhase: number) => {
    let current = INITIAL_DATA.map((arr) => [...arr]);

    for (let p = 0; p < targetPhase; p++) {
      const next = current.map((arr) => [...arr]);
      if (p % 2 === 0) {
        const pair01 = mergeLowHigh(current[0], current[1]);
        next[0] = pair01.low;
        next[1] = pair01.high;

        const pair23 = mergeLowHigh(current[2], current[3]);
        next[2] = pair23.low;
        next[3] = pair23.high;
      } else {
        const pair12 = mergeLowHigh(current[1], current[2]);
        next[1] = pair12.low;
        next[2] = pair12.high;
      }
      current = next;
    }
    return current;
  };

  const currentState = computeStateForPhase(phase);

  const getPartner = (rank: number, p: number) => {
    if (p % 2 === 0) {
      return rank % 2 === 0 ? rank + 1 : rank - 1;
    } else {
      if (rank === 0 || rank === 3) return -1;
      return rank === 1 ? 2 : 1;
    }
  };

  return (
    <div className="my-8 apple-card p-6 sm:p-8 rounded-3xl font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Interactive Stepper // Sorting Algorithm
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-0.5">
            Parallel Odd-Even Transposition Sort (4 Processes, 16 Keys)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Step through even and odd phases to observe Merge-Low and Merge-High key migration.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Phase {phase} of 4
          </span>
        </div>
      </div>

      {/* Process Key Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {currentState.map((arr, rank) => {
          const partner = phase > 0 ? getPartner(rank, phase - 1) : -1;
          const isIdle = phase > 0 && partner === -1;
          const isKeepLow = partner !== -1 && rank < partner;

          return (
            <div
              key={rank}
              className={`p-4 rounded-2xl border transition-all ${
                isIdle
                  ? 'border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02] opacity-70'
                  : 'border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-neutral-900 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
                <span className="font-bold text-neutral-900 dark:text-white">Rank {rank}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isIdle
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                    : isKeepLow
                    ? 'bg-blue-500/10 text-blue-600'
                    : 'bg-indigo-500/10 text-indigo-600'
                }`}>
                  {isIdle ? 'IDLE' : isKeepLow ? 'MERGE-LOW' : 'MERGE-HIGH'}
                </span>
              </div>

              {/* Elements */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                {arr.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06] text-neutral-800 dark:text-neutral-200 font-semibold"
                  >
                    {val}
                  </div>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-neutral-400">
                Partner: {partner === -1 ? 'None (Idle)' : `Rank ${partner}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-5">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPhase(0)}
            className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium transition-all"
          >
            Reset
          </button>
          <button
            onClick={() => setPhase((p) => Math.max(0, p - 1))}
            disabled={phase === 0}
            className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium transition-all disabled:opacity-30"
          >
            &larr; Prev Phase
          </button>
          <button
            onClick={() => setPhase((p) => Math.min(4, p + 1))}
            disabled={phase === 4}
            className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold transition-all disabled:opacity-30 shadow-sm"
          >
            Next Phase &rarr;
          </button>
        </div>

        <div className="text-neutral-400 text-xs font-medium">
          Total Array: 16 Elements Distributed Across 4 Ranks
        </div>
      </div>

      {/* Explanation Box */}
      <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-xs">
        <div className="font-semibold text-neutral-900 dark:text-white mb-1">
          {phase === 0 && 'Initial State: Each process has sorted its local block of 4 elements.'}
          {phase === 1 && 'Phase 0 (Even Phase): Pairs (0, 1) and (2, 3) communicate using MPI_Sendrecv. Rank 0/2 keep smaller 4 keys; Rank 1/3 keep larger 4 keys.'}
          {phase === 2 && 'Phase 1 (Odd Phase): Pair (1, 2) communicates. Processes 0 and 3 are IDLE. Rank 1 keeps smaller 4; Rank 2 keeps larger 4.'}
          {phase === 3 && 'Phase 2 (Even Phase): Pairs (0, 1) and (2, 3) exchange again to bubble boundary elements into position.'}
          {phase === 4 && 'Phase 3 (Odd Phase): Pair (1, 2) completes final swap. The entire distributed array of 16 elements is now globally sorted!'}
        </div>
        <div className="text-neutral-500 font-mono text-[11px] mt-1">
          Lecture theorem: After p phases (p = comm_sz), the keys are guaranteed sorted across all processes.
        </div>
      </div>
    </div>
  );
}
