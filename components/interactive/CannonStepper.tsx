'use client';

import React, { useState } from 'react';

export function CannonStepper() {
  const [step, setStep] = useState<number>(0);
  const maxSteps = 3;

  const getGridContent = (s: number) => {
    switch (s) {
      case 0:
        return [
          { proc: 'P(0,0)', a: 'A00', b: 'B00', c: '0', note: 'Initial placement' },
          { proc: 'P(0,1)', a: 'A01', b: 'B01', c: '0', note: 'Initial placement' },
          { proc: 'P(1,0)', a: 'A10', b: 'B10', c: '0', note: 'Initial placement' },
          { proc: 'P(1,1)', a: 'A11', b: 'B11', c: '0', note: 'Initial placement' },
        ];
      case 1:
        return [
          { proc: 'P(0,0)', a: 'A00', b: 'B00', c: '0', note: 'Row 0 shift 0, Col 0 shift 0' },
          { proc: 'P(0,1)', a: 'A01', b: 'B11', c: '0', note: 'Row 0 shift 0, Col 1 shift up 1' },
          { proc: 'P(1,0)', a: 'A11', b: 'B10', c: '0', note: 'Row 1 shift left 1, Col 0 shift 0' },
          { proc: 'P(1,1)', a: 'A10', b: 'B01', c: '0', note: 'Row 1 shift left 1, Col 1 shift up 1' },
        ];
      case 2:
        return [
          { proc: 'P(0,0)', a: 'A01', b: 'B10', c: 'A00·B00', note: 'Shifted A left 1, B up 1' },
          { proc: 'P(0,1)', a: 'A00', b: 'B01', c: 'A01·B11', note: 'Shifted A left 1, B up 1' },
          { proc: 'P(1,0)', a: 'A10', b: 'B00', c: 'A11·B10', note: 'Shifted A left 1, B up 1' },
          { proc: 'P(1,1)', a: 'A11', b: 'B11', c: 'A10·B01', note: 'Shifted A left 1, B up 1' },
        ];
      case 3:
        return [
          { proc: 'P(0,0)', a: 'A01', b: 'B10', c: 'A00·B00 + A01·B10', note: 'Exact block C00!' },
          { proc: 'P(0,1)', a: 'A00', b: 'B01', c: 'A01·B11 + A00·B01', note: 'Exact block C01!' },
          { proc: 'P(1,0)', a: 'A10', b: 'B00', c: 'A11·B10 + A10·B00', note: 'Exact block C10!' },
          { proc: 'P(1,1)', a: 'A11', b: 'B11', c: 'A10·B01 + A11·B11', note: 'Exact block C11!' },
        ];
      default:
        return [];
    }
  };

  const gridData = getGridContent(step);

  return (
    <div className="my-8 apple-card p-6 sm:p-8 rounded-3xl font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Interactive Stepper // Matrix Multiplication
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-0.5">
            Cannon&apos;s Algorithm 2D Process Torus Grid
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Visualizing 2D process Torus preskew alignment, circular roll shifts, and product accumulation.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          {step === 0 && 'Stage 0: Unaligned Placement'}
          {step === 1 && 'Stage 1: Preskew Alignment'}
          {step === 2 && 'Stage 2: Shift & Multiply Step 1'}
          {step === 3 && 'Stage 3: Completed Product'}
        </span>
      </div>

      {/* Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStep(0)}
            className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium transition-all"
          >
            Reset
          </button>
          <button
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium transition-all disabled:opacity-30"
          >
            &larr; Prev
          </button>
          <button
            onClick={() => setStep((prev) => Math.min(maxSteps, prev + 1))}
            disabled={step === maxSteps}
            className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold transition-all disabled:opacity-30 shadow-sm"
          >
            {step === 0 ? 'Run Initial Alignment &rarr;' : 'Shift & Multiply &rarr;'}
          </button>
        </div>

        <div className="text-neutral-400 text-xs font-medium">
          Step: <span className="font-semibold text-neutral-900 dark:text-white font-mono">{step} / {maxSteps}</span>
        </div>
      </div>

      {/* 2x2 Grid Visualization */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
        {gridData.map((cell, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-4 bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-sm flex flex-col justify-between min-h-[150px]"
          >
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
              <span className="font-bold text-neutral-900 dark:text-white">{cell.proc}</span>
              <span className="text-[10px] text-neutral-400 font-mono">NODE ({Math.floor(idx / 2)}, {idx % 2})</span>
            </div>

            <div className="my-2 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">A block:</span>
                <span className="font-mono font-semibold px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {cell.a}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">B block:</span>
                <span className="font-mono font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {cell.b}
                </span>
              </div>
              <div className="flex flex-col pt-1.5 border-t border-black/[0.06] dark:border-white/[0.08]">
                <span className="text-neutral-400 text-[10px]">Accumulated C:</span>
                <span className="text-xs font-mono font-semibold text-neutral-900 dark:text-white truncate">
                  {cell.c}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 pt-1.5 border-t border-black/[0.06] dark:border-white/[0.08]">
              {cell.note}
            </div>
          </div>
        ))}
      </div>

      {/* Algorithmic Cost & Reference Info */}
      <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1.5 leading-relaxed">
        <div className="font-semibold text-neutral-900 dark:text-white">
          Cannon&apos;s Algorithm Cost Model Summary (Lecture Part 5):
        </div>
        <div className="text-neutral-600 dark:text-neutral-400">
          &bull; <strong className="text-neutral-800 dark:text-neutral-200">Initial Alignment:</strong> Row i of A shifts left by i; Col j of B shifts up by j. Max shift distance is √p - 1.
        </div>
        <div className="text-neutral-600 dark:text-neutral-400">
          &bull; <strong className="text-neutral-800 dark:text-neutral-200">Main Loop:</strong> Exactly √p multiply-adds, with √p - 1 single-hop circular shifts.
        </div>
        <div className="text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
          &bull; Total Communication Time: {'T_comm = 2(√p - 1)(t_s + t_w · n²/p)'}.
        </div>
      </div>
    </div>
  );
}
