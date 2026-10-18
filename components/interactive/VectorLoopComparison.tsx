'use client';

import React, { useState } from 'react';

export function VectorLoopComparison() {
  const [arraySize, setArraySize] = useState<number>(100);
  const [mvl, setMvl] = useState<number>(64);
  const [currentStrip, setCurrentStrip] = useState<number>(0);

  // Strip-mining calculations
  // First strip handles remainder: N % MVL, then subsequent strips handle MVL
  const remainder = arraySize % mvl;
  const numStrips = Math.ceil(arraySize / mvl);

  const strips: { stripIdx: number; startIdx: number; length: number }[] = [];
  let currIdx = 0;

  if (remainder > 0) {
    strips.push({ stripIdx: 0, startIdx: 0, length: remainder });
    currIdx += remainder;
  }
  while (currIdx < arraySize) {
    const len = Math.min(mvl, arraySize - currIdx);
    strips.push({ stripIdx: strips.length, startIdx: currIdx, length: len });
    currIdx += len;
  }

  // Comparison metrics
  const scalarInstructions = arraySize * 6; // fetch, load A, load B, add, store C, branch
  const vectorInstructions = strips.length * 6; // VLEN set, LV A, LV B, ADDV, SV C, branch

  return (
    <div className="my-8 border border-black dark:border-white bg-white dark:bg-black p-4 sm:p-6 text-black dark:text-white font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black dark:border-white gap-3">
        <div>
          <span className="text-[10px] tracking-widest uppercase opacity-60">INTERACTIVE // VECTOR PROCESSING</span>
          <h3 className="text-base sm:text-lg font-bold">SCALAR LOOP VS VECTOR (STRIP-MINING)</h3>
        </div>
        <div className="text-xs px-2 py-1 bg-black text-white dark:bg-white dark:text-black font-bold">
          C[i] = A[i] + B[i]
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Array Length (N elements): <strong className="text-sm">{arraySize}</strong>
          </label>
          <div className="flex items-center gap-2">
            {[64, 100, 128, 200].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setArraySize(val);
                  setCurrentStrip(0);
                }}
                className={`px-3 py-1 text-xs border border-black dark:border-white transition-colors ${
                  arraySize === val
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                    : 'hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                N = {val}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Maximum Vector Length (MVL): <strong className="text-sm">{mvl}</strong>
          </label>
          <div className="flex items-center gap-2">
            {[16, 32, 64].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setMvl(val);
                  setCurrentStrip(0);
                }}
                className={`px-3 py-1 text-xs border border-black dark:border-white transition-colors ${
                  mvl === val
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                    : 'hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                MVL = {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">SCALAR INSTRUCTIONS</span>
          <span className="text-lg font-bold block">{scalarInstructions}</span>
          <span className="text-[9px] opacity-60">~6 instrs / element</span>
        </div>
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">VECTOR INSTRUCTIONS</span>
          <span className="text-lg font-bold block">{vectorInstructions}</span>
          <span className="text-[9px] opacity-60">{strips.length} strip(s) x 6 instrs</span>
        </div>
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">INSTRUCTION REDUCTION</span>
          <span className="text-lg font-bold block">
            {(scalarInstructions / vectorInstructions).toFixed(1)}x
          </span>
          <span className="text-[9px] opacity-60">Fewer fetches & decodes</span>
        </div>
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">STRIP-MINE PASSES</span>
          <span className="text-lg font-bold block">{strips.length}</span>
          <span className="text-[9px] opacity-60">ceil(N / MVL)</span>
        </div>
      </div>

      {/* Strip-Mining Visualizer */}
      <div className="my-6 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider">STRIP-MINING BREAKDOWN (N = {arraySize}, MVL = {mvl}):</span>
          <span className="text-[10px] opacity-70">Remainder {remainder} processed first</span>
        </div>

        <div className="space-y-2">
          {strips.map((s, idx) => {
            const isActive = idx === currentStrip;
            const pct = ((s.length / arraySize) * 100).toFixed(1);

            return (
              <div
                key={idx}
                onClick={() => setCurrentStrip(idx)}
                className={`p-3 border cursor-pointer transition-all ${
                  isActive
                    ? 'border-2 border-black dark:border-white bg-black/10 dark:bg-white/10'
                    : 'border-black/30 dark:border-white/30 hover:border-black dark:hover:border-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <strong className="font-bold">STRIP #{idx + 1}:</strong> Elements [{s.startIdx} .. {s.startIdx + s.length - 1}]
                    <span className="ml-2 opacity-70">({s.length} elements, {pct}%)</span>
                  </div>
                  <div className="text-[11px] font-mono">
                    Set VLEN = {s.length} &rarr; Execute ADDV
                  </div>
                </div>

                {/* Micro Visual Progress Bar */}
                <div className="w-full bg-black/10 dark:bg-white/10 h-2 mt-2 border border-black/20 dark:border-white/20">
                  <div
                    className="bg-black dark:bg-white h-full"
                    style={{ width: `${(s.length / mvl) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Code Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Scalar Code */}
        <div className="border border-black dark:border-white p-3 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
          <div className="font-bold uppercase border-b border-black/20 dark:border-white/20 pb-1 mb-2">
            SCALAR ASSEMBLY LOOP (600 INSTRUCTIONS)
          </div>
          <pre className="text-[11px] leading-relaxed overflow-x-auto">
{`    LI   R1, 0         ; i = 0
LOOP:
    LW   R2, 0(Ra)     ; Load A[i]
    LW   R3, 0(Rb)     ; Load B[i]
    ADD  R4, R2, R3    ; R4 = A[i] + B[i]
    SW   R4, 0(Rc)     ; Store to C[i]
    ADDI Ra, Ra, 8     ; increment ptr A
    ADDI Rb, Rb, 8     ; increment ptr B
    ADDI Rc, Rc, 8     ; increment ptr C
    ADDI R1, R1, 1     ; i++
    BNE  R1, 100, LOOP ; branch if i < 100
; Execution: 100 branches, stalls on cache misses`}
          </pre>
        </div>

        {/* Vector Code with Strip-Mining */}
        <div className="border border-black dark:border-white p-3 bg-black/[0.02] dark:bg-white/[0.02] text-xs">
          <div className="font-bold uppercase border-b border-black/20 dark:border-white/20 pb-1 mb-2">
            VMIPS VECTOR CODE WITH STRIP-MINING
          </div>
          <pre className="text-[11px] leading-relaxed overflow-x-auto">
{`    LI   R1, ${remainder || mvl}     ; VLEN = remainder first
    MTC1 VLEN, R1      ; Set VLEN register
STRIP_LOOP:
    LV   V1, Ra        ; Load vector A
    LV   V2, Rb        ; Load vector B
    ADDV V3, V1, V2    ; Vector FP Add
    SV   V3, Rc        ; Store vector C
    SLL  R2, R1, 3     ; byte offset = VLEN * 8
    DADDU Ra, Ra, R2   ; Bump pointers
    DADDU Rb, Rb, R2
    DADDU Rc, Rc, R2
    DSUBU R_rem, R_rem, R1 ; Decrement remaining
    LI   R1, ${mvl}        ; Subsequent strips = MVL
    MTC1 VLEN, R1
    BGTZ R_rem, STRIP_LOOP`}
          </pre>
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="p-3 border border-black/40 dark:border-white/40 text-xs opacity-90">
        <strong>Hardware Takeaway:</strong> In vector execution, a single instruction expresses data-parallel work for up to MVL elements. The control logic fetches and decodes only <em>one</em> vector instruction instead of 100 scalar instructions, eliminating 99% of loop branch overhead and instruction cache churn.
      </div>
    </div>
  );
}
