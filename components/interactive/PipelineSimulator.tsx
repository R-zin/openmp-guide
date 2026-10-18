'use client';

import React, { useState } from 'react';

export function PipelineSimulator() {
  const [segments, setSegments] = useState<number>(4);
  const [tasks, setTasks] = useState<number>(6);
  const [activeCycle, setActiveCycle] = useState<number>(9);

  const totalCycles = segments + tasks - 1;
  const nonPipelinedCycles = tasks * segments;
  const speedup = (nonPipelinedCycles / totalCycles).toFixed(2);
  const efficiency = ((nonPipelinedCycles / totalCycles) / segments * 100).toFixed(1);

  return (
    <div className="my-8 border border-black dark:border-white bg-white dark:bg-black p-4 sm:p-6 text-black dark:text-white font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black dark:border-white gap-3">
        <div>
          <span className="text-[10px] tracking-widest uppercase opacity-60">INTERACTIVE // PIPELINING</span>
          <h3 className="text-base sm:text-lg font-bold">PIPELINE SPACE-TIME SIMULATOR</h3>
        </div>
        <div className="text-xs px-2 py-1 bg-black text-white dark:bg-white dark:text-black font-bold">
          CLOCK-BY-CLOCK
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Number of Segments (k): <strong className="text-sm">{segments}</strong>
          </label>
          <input
            type="range"
            min={2}
            max={6}
            value={segments}
            onChange={(e) => {
              const k = parseInt(e.target.value);
              setSegments(k);
              setActiveCycle(k + tasks - 1);
            }}
            className="w-full accent-black dark:accent-white cursor-pointer"
          />
          <div className="flex justify-between text-[10px] opacity-60 mt-1">
            <span>2 stages</span>
            <span>4 stages</span>
            <span>6 stages</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-2">
            Number of Independent Tasks (n): <strong className="text-sm">{tasks}</strong>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={tasks}
            onChange={(e) => {
              const n = parseInt(e.target.value);
              setTasks(n);
              setActiveCycle(segments + n - 1);
            }}
            className="w-full accent-black dark:accent-white cursor-pointer"
          />
          <div className="flex justify-between text-[10px] opacity-60 mt-1">
            <span>1 task</span>
            <span>5 tasks</span>
            <span>10 tasks</span>
          </div>
        </div>
      </div>

      {/* Metric Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">PIPELINED CYCLES</span>
          <span className="text-lg font-bold block">{totalCycles}</span>
          <span className="text-[9px] opacity-60">k + n - 1</span>
        </div>
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">UNPIPELINED CYCLES</span>
          <span className="text-lg font-bold block">{nonPipelinedCycles}</span>
          <span className="text-[9px] opacity-60">n * k</span>
        </div>
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">SPEEDUP S_k</span>
          <span className="text-lg font-bold block">{speedup}x</span>
          <span className="text-[9px] opacity-60">(n*k) / (k+n-1)</span>
        </div>
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">EFFICIENCY E_k</span>
          <span className="text-lg font-bold block">{efficiency}%</span>
          <span className="text-[9px] opacity-60">S_k / k</span>
        </div>
      </div>

      {/* Stepper scrubber */}
      <div className="my-4 flex items-center justify-between gap-3 text-xs">
        <span className="font-bold">SCRUB CLOCK CYCLE:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveCycle((c) => Math.max(1, c - 1))}
            disabled={activeCycle <= 1}
            className="px-2 py-1 border border-black dark:border-white text-xs disabled:opacity-30"
          >
            -1
          </button>
          <span className="px-3 py-1 font-bold border border-black dark:border-white bg-black/10 dark:bg-white/10">
            Clock {activeCycle} / {totalCycles}
          </span>
          <button
            onClick={() => setActiveCycle((c) => Math.min(totalCycles, c + 1))}
            disabled={activeCycle >= totalCycles}
            className="px-2 py-1 border border-black dark:border-white text-xs disabled:opacity-30"
          >
            +1
          </button>
        </div>
      </div>

      {/* Space-Time Matrix */}
      <div className="my-6 overflow-x-auto border border-black dark:border-white">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            <tr className="border-b border-black dark:border-white bg-black/5 dark:bg-white/5">
              <th className="p-2 border-r border-black dark:border-white font-bold text-left">Segment</th>
              {Array.from({ length: totalCycles }).map((_, cIdx) => {
                const clk = cIdx + 1;
                const isSelectedClk = clk === activeCycle;
                return (
                  <th
                    key={clk}
                    className={`p-2 border-r border-black/20 dark:border-white/20 font-bold min-w-[42px] ${
                      isSelectedClk ? 'bg-black text-white dark:bg-white dark:text-black' : ''
                    }`}
                  >
                    C{clk}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: segments }).map((_, sIdx) => {
              const segNum = sIdx + 1;
              return (
                <tr key={segNum} className="border-b border-black/20 dark:border-white/20">
                  <td className="p-2 border-r border-black dark:border-white font-bold text-left bg-black/5 dark:bg-white/5">
                    Seg {segNum}
                  </td>
                  {Array.from({ length: totalCycles }).map((_, cIdx) => {
                    const clk = cIdx + 1;
                    const taskNum = clk - sIdx;
                    const isOccupied = taskNum >= 1 && taskNum <= tasks;
                    const isSelectedClk = clk === activeCycle;

                    return (
                      <td
                        key={clk}
                        className={`p-2 border-r border-black/20 dark:border-white/20 transition-all ${
                          isSelectedClk && isOccupied
                            ? 'bg-black/20 dark:bg-white/20 font-bold scale-105'
                            : isOccupied
                            ? 'bg-black/5 dark:bg-white/5 font-semibold'
                            : 'opacity-20'
                        }`}
                      >
                        {isOccupied ? `T${taskNum}` : '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Analysis Callout */}
      <div className="p-3 border border-black/40 dark:border-white/40 text-xs space-y-1">
        <strong>Pipelining Formula Summary:</strong>
        <p className="opacity-80">
          The first task $T_1$ requires $k$ clock cycles to traverse the empty pipeline (pipeline latency / filling time). Thereafter, each subsequent task exits at the rate of <strong>1 task per clock cycle</strong>. Thus, $n$ tasks require $k + (n - 1) = k + n - 1$ cycles. As $n \to \infty$, speedup approaches the theoretical upper bound $S_k \to k$.
        </p>
      </div>
    </div>
  );
}
