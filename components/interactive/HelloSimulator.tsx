'use client';

import React, { useState } from 'react';

export function HelloSimulator() {
  const [mode, setMode] = useState<'mpi' | 'openmp'>('mpi');
  const [count, setCount] = useState<number>(4);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [withBarrier, setWithBarrier] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    setOutputs([]);

    const items = Array.from({ length: count }, (_, i) => i);

    let scheduled: number[];
    if (withBarrier) {
      scheduled = [...items].sort((a, b) => a - b);
    } else {
      scheduled = [...items].sort(() => Math.random() - 0.5);
    }

    const logs: string[] = [];
    scheduled.forEach((id, index) => {
      setTimeout(() => {
        if (mode === 'mpi') {
          logs.push(`[Process Rank ${id} / ${count}]: Greetings from MPI process ${id}!`);
        } else {
          logs.push(`[Thread ID ${id} / ${count}]: Hello from OpenMP thread ${id}!`);
        }
        setOutputs([...logs]);
        if (index === scheduled.length - 1) {
          setIsRunning(false);
        }
      }, (index + 1) * 120);
    });
  };

  return (
    <div className="my-8 apple-card p-6 sm:p-8 rounded-3xl font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Interactive Simulator // Concurrency
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-0.5">
            Non-Deterministic Execution Order
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Simulates asynchronous stdout interleaving across concurrent workers and cores.
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          ● LIVE
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
        <div>
          <label className="block text-neutral-500 dark:text-neutral-400 font-medium mb-1.5 uppercase text-[10px] tracking-wider">
            Paradigm:
          </label>
          <div className="flex p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06]">
            <button
              onClick={() => setMode('mpi')}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                mode === 'mpi'
                  ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              MPI
            </button>
            <button
              onClick={() => setMode('openmp')}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                mode === 'openmp'
                  ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              OpenMP
            </button>
          </div>
        </div>

        <div>
          <label className="block text-neutral-500 dark:text-neutral-400 font-medium mb-1.5 uppercase text-[10px] tracking-wider">
            {mode === 'mpi' ? 'Processes (np):' : 'Threads:'} <span className="font-semibold text-neutral-900 dark:text-white font-mono">{count}</span>
          </label>
          <input
            type="range"
            min={2}
            max={8}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 cursor-pointer p-2 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
            <input
              type="checkbox"
              checked={withBarrier}
              onChange={(e) => setWithBarrier(e.target.checked)}
              className="accent-blue-600 rounded"
            />
            <span className="text-xs font-medium">Rank-Order Enforced</span>
          </label>
        </div>

        <div className="flex items-end">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="w-full py-2 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wide transition-all shadow-sm hover:opacity-90 disabled:opacity-40"
          >
            {isRunning ? 'Executing...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Visual Terminal Screen */}
      <div className="rounded-2xl bg-[#1A1A20] dark:bg-[#0D0D10] border border-white/[0.08] p-4 text-xs font-mono min-h-[160px] flex flex-col justify-between text-neutral-200 shadow-inner">
        <div className="space-y-1.5">
          <div className="text-[11px] text-neutral-400 pb-2 border-b border-white/[0.08] flex items-center justify-between">
            <span>$ {mode === 'mpi' ? `mpirun -np ${count} ./hello` : `OMP_NUM_THREADS=${count} ./hello`}</span>
            <span className="text-[10px] text-neutral-500">zsh terminal</span>
          </div>
          {outputs.length === 0 && !isRunning && (
            <div className="text-neutral-500 py-6 text-center">
              Click [Run Simulation] above to observe worker arrival order.
            </div>
          )}
          {outputs.map((line, idx) => (
            <div key={idx} className="text-neutral-200">
              {line}
            </div>
          ))}
        </div>
        {outputs.length === count && (
          <div className="mt-3 pt-2 border-t border-white/[0.08] text-[11px] text-neutral-400">
            {withBarrier
              ? '✓ Synchronized mode: Outputs arrive sequentially in strict order.'
              : '⚡ Observation: Notice how worker output order changes between runs due to OS thread preemption and core scheduling!'}
          </div>
        )}
      </div>
    </div>
  );
}
