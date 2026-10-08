'use client';

import React, { useState } from 'react';

export function CannonStepper() {
  // We model a 2x2 process grid on 2x2 block matrices (or 4 processes) for clean visual clarity,
  // with an option or toggle to see the full 4x4 indices from the lecture slides!
  const [step, setStep] = useState<number>(0);

  // States:
  // 0: Initial placement (A[i][j], B[i][j])
  // 1: Initial Alignment (A row i left-shifted by i; B col j up-shifted by j)
  // 2: Multiply 1 + Single Shift Left (A) & Up (B)
  // 3: Multiply 2 (Completed for 2x2 grid)
  const maxSteps = 3;

  // 2x2 Process Grid blocks:
  // Process (0,0), (0,1), (1,0), (1,1)
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
        // Row 0 shifted 0, Row 1 shifted 1 (A10 <-> A11)
        // Col 0 shifted 0, Col 1 shifted 1 (B01 <-> B11)
        return [
          { proc: 'P(0,0)', a: 'A00', b: 'B00', c: '0', note: 'Row 0 shift 0, Col 0 shift 0' },
          { proc: 'P(0,1)', a: 'A01', b: 'B11', c: '0', note: 'Row 0 shift 0, Col 1 shifted up 1' },
          { proc: 'P(1,0)', a: 'A11', b: 'B10', c: '0', note: 'Row 1 shifted left 1, Col 0 shift 0' },
          { proc: 'P(1,1)', a: 'A10', b: 'B01', c: '0', note: 'Row 1 shifted left 1, Col 1 shifted up 1' },
        ];
      case 2:
        // Multiply 1 accumulated, then shift A left 1, B up 1
        return [
          { proc: 'P(0,0)', a: 'A01', b: 'B10', c: 'A00·B00', note: 'Shifted A left 1, B up 1' },
          { proc: 'P(0,1)', a: 'A00', b: 'B01', c: 'A01·B11', note: 'Shifted A left 1, B up 1' },
          { proc: 'P(1,0)', a: 'A10', b: 'B00', c: 'A11·B10', note: 'Shifted A left 1, B up 1' },
          { proc: 'P(1,1)', a: 'A11', b: 'B11', c: 'A10·B01', note: 'Shifted A left 1, B up 1' },
        ];
      case 3:
        // Final Multiply 2 accumulated
        return [
          { proc: 'P(0,0)', a: 'A01', b: 'B10', c: 'A00·B00 + A01·B10', note: 'Exact C00!' },
          { proc: 'P(0,1)', a: 'A00', b: 'B01', c: 'A01·B11 + A00·B01', note: 'Exact C01!' },
          { proc: 'P(1,0)', a: 'A10', b: 'B00', c: 'A11·B10 + A10·B00', note: 'Exact C10!' },
          { proc: 'P(1,1)', a: 'A11', b: 'B11', c: 'A10·B01 + A11·B11', note: 'Exact C11!' },
        ];
      default:
        return [];
    }
  };

  const gridData = getGridContent(step);

  return (
    <div className="my-8 border border-[#000000] dark:border-[#FFFFFF] p-5 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            INTERACTIVE STEPPER // CANNON&apos;S ALGORITHM PROCESS GRID
          </span>
          <p className="text-xs text-[#737373] mt-1 font-sans">
            Visualizing 2D Torus grid preskew alignment, circular roll shifts, and product accumulation.
          </p>
        </div>
        <span className="text-xs px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] uppercase">
          {step === 0 && 'STAGE 0: UNALIGNED'}
          {step === 1 && 'STAGE 1: INITIAL ALIGNMENT'}
          {step === 2 && 'STAGE 2: STEP 1 MULTIPLY + SHIFT'}
          {step === 3 && 'STAGE 3: MULTIPLY 2 (DONE)'}
        </span>
      </div>

      {/* Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStep(0)}
            className="px-3 py-1 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF]"
          >
            RESET
          </button>
          <button
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="px-3 py-1 border border-[#E5E5E5] dark:border-[#262626] disabled:opacity-40"
          >
            &larr; PREV
          </button>
          <button
            onClick={() => setStep((prev) => Math.min(maxSteps, prev + 1))}
            disabled={step === maxSteps}
            className="px-3 py-1 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold disabled:opacity-40"
          >
            {step === 0 ? 'RUN INITIAL ALIGNMENT &rarr;' : 'SHIFT & MULTIPLY &rarr;'}
          </button>
        </div>

        <div className="text-[#737373]">
          STEP: <span className="text-[#000000] dark:text-[#FFFFFF] font-bold">{step} / {maxSteps}</span>
        </div>
      </div>

      {/* 2x2 Grid Visualization */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
        {gridData.map((cell, idx) => (
          <div
            key={idx}
            className="border-2 border-[#000000] dark:border-[#FFFFFF] p-4 bg-[#F5F5F5] dark:bg-[#121212] flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex justify-between items-center pb-1 border-b border-[#E5E5E5] dark:border-[#262626] text-xs">
              <span className="font-bold">{cell.proc}</span>
              <span className="text-[10px] text-[#737373]">NODE ({Math.floor(idx / 2)}, {idx % 2})</span>
            </div>

            <div className="my-2 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#737373]">A block:</span>
                <span className="font-bold border border-[#000000] dark:border-[#FFFFFF] px-1 bg-[#FFFFFF] dark:bg-[#000000]">
                  {cell.a}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">B block:</span>
                <span className="font-bold border border-[#000000] dark:border-[#FFFFFF] px-1 bg-[#FFFFFF] dark:bg-[#000000]">
                  {cell.b}
                </span>
              </div>
              <div className="flex flex-col pt-1 border-t border-[#E5E5E5] dark:border-[#262626]">
                <span className="text-[#737373] text-[10px]">Accumulated C:</span>
                <span className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF] truncate">
                  {cell.c}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-[#737373] pt-1 border-t border-[#E5E5E5] dark:border-[#262626]">
              {cell.note}
            </div>
          </div>
        ))}
      </div>

      {/* Algorithmic Cost & Reference Info */}
      <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F5F5F5] dark:bg-[#0C0C0C] text-xs space-y-1">
        <div className="font-bold text-[#000000] dark:text-[#FFFFFF]">
          CANNON&apos;S ALGORITHM FORMULA SUMMARY (Lecture Part 5):
        </div>
        <div className="text-[#737373]">
          &bull; <strong>Initial Alignment:</strong> Row i of A shifts left by i; Col j of B shifts up by j. Max shift distance is √p - 1.
        </div>
        <div className="text-[#737373]">
          &bull; <strong>Main Loop:</strong> Exactly √p multiply-adds, with √p - 1 single-hop circular shifts.
        </div>
        <div className="text-[#737373]">
          &bull; <strong>Total Communication Time:</strong> {'T_comm = 2(√p - 1)(t_s + t_w · n²/p)'}.
        </div>
      </div>
    </div>
  );
}
