'use client';

import React, { useState } from 'react';

// 4 processes, each with 4 elements initially
const INITIAL_DATA: number[][] = [
  [15, 23, 29, 100],     // Rank 0
  [-14, 45, 178, 192],   // Rank 1
  [-118, 0, 7, 246],     // Rank 2
  [1, 10, 25, 34],       // Rank 3
];

// Helper to merge-low or merge-high
function mergeLowHigh(arrA: number[], arrB: number[]): { low: number[]; high: number[] } {
  const merged = [...arrA, ...arrB].sort((a, b) => a - b);
  return {
    low: merged.slice(0, arrA.length),
    high: merged.slice(arrA.length),
  };
}

export function OddEvenSortStepper() {
  const [phase, setPhase] = useState<number>(0);

  // Compute array state for each phase from 0 to 4
  const computeStateForPhase = (targetPhase: number) => {
    let current = INITIAL_DATA.map((arr) => [...arr]);

    for (let p = 0; p < targetPhase; p++) {
      const next = current.map((arr) => [...arr]);
      if (p % 2 === 0) {
        // Even phase: (0, 1) and (2, 3)
        const pair01 = mergeLowHigh(current[0], current[1]);
        next[0] = pair01.low;
        next[1] = pair01.high;

        const pair23 = mergeLowHigh(current[2], current[3]);
        next[2] = pair23.low;
        next[3] = pair23.high;
      } else {
        // Odd phase: (1, 2). 0 and 3 idle
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
      // Even phase
      return rank % 2 === 0 ? rank + 1 : rank - 1;
    } else {
      // Odd phase
      if (rank === 0 || rank === 3) return -1; // Idle
      return rank === 1 ? 2 : 1;
    }
  };

  return (
    <div className="my-8 border border-[#000000] dark:border-[#FFFFFF] p-5 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            INTERACTIVE STEPPER // PARALLEL ODD-EVEN TRANSPOSITION SORT
          </span>
          <p className="text-xs text-[#737373] mt-1 font-sans">
            Observe block distribution, partner calculation, and Merge-Low / Merge-High across 4 processes.
          </p>
        </div>
        <span className="text-xs px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] uppercase">
          {phase === 0 ? 'INITIAL STATE' : phase === 4 ? 'SORT COMPLETE' : `PHASE ${phase - 1} APPLIED`}
        </span>
      </div>

      {/* Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPhase(0)}
            className="px-3 py-1 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF]"
          >
            RESET
          </button>
          <button
            onClick={() => setPhase((prev) => Math.max(0, prev - 1))}
            disabled={phase === 0}
            className="px-3 py-1 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF] disabled:opacity-40"
          >
            &larr; PREV
          </button>
          <button
            onClick={() => setPhase((prev) => Math.min(4, prev + 1))}
            disabled={phase === 4}
            className="px-3 py-1 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold disabled:opacity-40"
          >
            NEXT PHASE &rarr;
          </button>
        </div>

        <div className="text-[#737373]">
          PHASE: <span className="text-[#000000] dark:text-[#FFFFFF] font-bold">{phase} / 4</span> (p = comm_sz phases guaranteed)
        </div>
      </div>

      {/* 4 Processes Data Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {currentState.map((arr, rank) => {
          const nextPartner = phase < 4 ? getPartner(rank, phase) : -1;
          const isIdle = nextPartner === -1;
          const role = isIdle
            ? 'IDLE'
            : rank < nextPartner
            ? 'MERGE-LOW (KEEPS SMALLEST)'
            : 'MERGE-HIGH (KEEPS LARGEST)';

          return (
            <div
              key={rank}
              className={`border p-3 transition-colors ${
                !isIdle && phase < 4
                  ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000]'
                  : 'border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212]'
              }`}
            >
              <div className="flex justify-between items-center text-xs pb-1 mb-2 border-b border-[#E5E5E5] dark:border-[#262626]">
                <span className="font-bold">PROCESS {rank}</span>
                <span className="text-[10px] text-[#737373]">
                  {phase < 4 ? (isIdle ? 'IDLE' : `PARTNER: ${nextPartner}`) : 'DONE'}
                </span>
              </div>

              {/* Elements grid */}
              <div className="grid grid-cols-2 gap-1 text-center font-mono text-xs my-2">
                {arr.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-1 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#1A1A1A] font-bold truncate"
                  >
                    {val}
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-[#737373] mt-2 pt-1 border-t border-[#E5E5E5] dark:border-[#262626]">
                {role}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Box */}
      <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212] text-xs">
        <div className="font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
          {phase === 0 && 'INITIAL STATE: Each process has sorted its local block of 4 elements.'}
          {phase === 1 && 'PHASE 0 (EVEN PHASE): Pairs (0, 1) and (2, 3) communicate using MPI_Sendrecv. Rank 0/2 keep smaller 4 keys; Rank 1/3 keep larger 4 keys.'}
          {phase === 2 && 'PHASE 1 (ODD PHASE): Pair (1, 2) communicates. Processes 0 and 3 are IDLE (partner = -1 or comm_sz). Rank 1 keeps smaller 4; Rank 2 keeps larger 4.'}
          {phase === 3 && 'PHASE 2 (EVEN PHASE): Pairs (0, 1) and (2, 3) exchange again to bubble boundary elements into position.'}
          {phase === 4 && 'PHASE 3 (ODD PHASE): Pair (1, 2) completes final swap. The entire distributed array of 16 elements is now globally sorted!'}
        </div>
        <div className="text-[#737373]">
          Lecture theorem: After p phases (p = comm_sz), the keys are guaranteed sorted across all processes.
        </div>
      </div>
    </div>
  );
}
