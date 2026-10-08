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
      // Barrier ordered or rank ordered output
      scheduled = [...items].sort((a, b) => a - b);
    } else {
      // Shuffle with non-deterministic random latency
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
    <div className="my-8 border border-[#000000] dark:border-[#FFFFFF] p-5 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            INTERACTIVE SIMULATOR // NON-DETERMINISTIC EXECUTION
          </span>
          <p className="text-xs text-[#737373] mt-1 font-sans">
            Demonstrates race-free asynchronous stdout interleaving across concurrent workers.
          </p>
        </div>
        <span className="text-[11px] px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] uppercase">
          LIVE DEMO
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs">
        <div>
          <label className="block text-[#737373] uppercase mb-1">PARADIGM:</label>
          <div className="flex border border-[#000000] dark:border-[#FFFFFF]">
            <button
              onClick={() => setMode('mpi')}
              className={`flex-1 py-1 uppercase text-center ${
                mode === 'mpi'
                  ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                  : 'bg-transparent text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              MPI
            </button>
            <button
              onClick={() => setMode('openmp')}
              className={`flex-1 py-1 uppercase text-center ${
                mode === 'openmp'
                  ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                  : 'bg-transparent text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              OPENMP
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[#737373] uppercase mb-1">
            {mode === 'mpi' ? 'PROCESSES (np):' : 'THREADS (OMP_NUM_THREADS):'} {count}
          </label>
          <input
            type="range"
            min={2}
            max={8}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="w-full accent-black dark:accent-white"
          />
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center space-x-2 text-[#000000] dark:text-[#FFFFFF] cursor-pointer">
            <input
              type="checkbox"
              checked={withBarrier}
              onChange={(e) => setWithBarrier(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            <span className="text-[11px] uppercase">RANK-ORDER ENFORCED</span>
          </label>
        </div>

        <div className="flex items-end">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="w-full py-1.5 px-3 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] hover:bg-transparent hover:text-[#000000] dark:hover:bg-transparent dark:hover:text-[#FFFFFF] font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
          >
            {isRunning ? 'EXECUTING...' : 'RUN SIMULATION'}
          </button>
        </div>
      </div>

      {/* Visual Terminal Screen */}
      <div className="border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#0C0C0C] p-4 text-xs min-h-[160px] flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="text-[11px] text-[#737373] pb-1 border-b border-[#E5E5E5] dark:border-[#262626]">
            COMMAND: {mode === 'mpi' ? `mpirun -np ${count} ./hello` : `export OMP_NUM_THREADS=${count} && ./hello`}
          </div>
          {outputs.length === 0 && !isRunning && (
            <div className="text-[#737373] py-6 text-center">
              Click [RUN SIMULATION] to observe worker output order.
            </div>
          )}
          {outputs.map((line, idx) => (
            <div key={idx} className="text-[#000000] dark:text-[#FFFFFF]">
              {line}
            </div>
          ))}
        </div>
        {outputs.length === count && (
          <div className="mt-3 pt-2 border-t border-[#E5E5E5] dark:border-[#262626] text-[11px] text-[#737373]">
            {withBarrier
              ? 'Synchronized mode: Outputs arrive sequentially in strict order.'
              : 'Observation: Notice how rank arrival order changes on consecutive runs due to OS scheduling and hardware core preemption!'}
          </div>
        )}
      </div>
    </div>
  );
}
