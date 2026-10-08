'use client';

import React, { useState } from 'react';

type SyncMode = 'none' | 'atomic' | 'critical' | 'reduction';

export function RaceConditionDemo() {
  const [mode, setMode] = useState<SyncMode>('none');
  const [observedSum, setObservedSum] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const TARGET_COUNT = 100000;

  const runSimulation = () => {
    setIsRunning(true);
    setObservedSum(null);

    setTimeout(() => {
      if (mode === 'none') {
        const lossFactor = 0.68 + Math.random() * 0.18;
        setObservedSum(Math.round(TARGET_COUNT * lossFactor));
      } else {
        setObservedSum(TARGET_COUNT);
      }
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="my-8 apple-card p-6 sm:p-8 rounded-3xl font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Interactive Demo // Thread Synchronization
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-0.5">
            OpenMP Data Race & Collision Prevention
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Demonstrates unsynchronized read-modify-write collisions versus atomic, critical, and reduction clauses.
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            mode === 'none'
              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          }`}
        >
          {mode === 'none' ? '⚠️ DATA RACE ACTIVE' : '✓ SYNCHRONIZED'}
        </span>
      </div>

      {/* Synchronization Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
        {[
          { id: 'none', label: '1. No Sync (Race)' },
          { id: 'atomic', label: '2. #pragma omp atomic' },
          { id: 'critical', label: '3. #pragma omp critical' },
          { id: 'reduction', label: '4. reduction(+:sum)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setMode(item.id as SyncMode); setObservedSum(null); }}
            className={`p-3 rounded-2xl border text-center transition-all ${
              mode === item.id
                ? 'border-blue-500 bg-blue-500/[0.08] text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                : 'border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Code Snippet for Selected Mode */}
      <div className="p-4 rounded-2xl bg-neutral-900 text-neutral-200 font-mono text-xs mb-5">
        <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1.5 font-semibold">
          Loop Implementation Statement:
        </div>
        {mode === 'none' && (
          <code>
            #pragma omp parallel for num_threads(4)<br />
            for (int i = 0; i &lt; 100000; i++) &#123;<br />
            &nbsp;&nbsp;sum++; // DATA RACE: Concurrent unsynchronized read/write<br />
            &#125;
          </code>
        )}
        {mode === 'atomic' && (
          <code>
            #pragma omp parallel for num_threads(4)<br />
            for (int i = 0; i &lt; 100000; i++) &#123;<br />
            &nbsp;&nbsp;#pragma omp atomic<br />
            &nbsp;&nbsp;sum++; // Low overhead CPU hardware bus-lock primitive<br />
            &#125;
          </code>
        )}
        {mode === 'critical' && (
          <code>
            #pragma omp parallel for num_threads(4)<br />
            for (int i = 0; i &lt; 100000; i++) &#123;<br />
            &nbsp;&nbsp;#pragma omp critical<br />
            &nbsp;&nbsp;&#123; sum++; &#125; // High overhead mutual exclusion mutex lock<br />
            &#125;
          </code>
        )}
        {mode === 'reduction' && (
          <code>
            #pragma omp parallel for num_threads(4) reduction(+:sum)<br />
            for (int i = 0; i &lt; 100000; i++) &#123;<br />
            &nbsp;&nbsp;sum++; // Zero synchronization in loop; private L1 registers reduced at exit!<br />
            &#125;
          </code>
        )}
      </div>

      {/* Run Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-wide transition-all shadow-sm hover:opacity-90 disabled:opacity-40"
        >
          {isRunning ? 'Executing on 4 Threads...' : 'Run Parallel Execution'}
        </button>

        <div className="flex items-center space-x-6 text-xs">
          <div>
            <span className="text-neutral-400">Expected Sum:</span>{' '}
            <span className="font-bold text-neutral-900 dark:text-white font-mono">{TARGET_COUNT.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-neutral-400">Observed Sum:</span>{' '}
            <span
              className={`font-bold font-mono ${
                observedSum === null
                  ? 'text-neutral-400'
                  : observedSum === TARGET_COUNT
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {observedSum !== null ? observedSum.toLocaleString() : '---'}
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Output */}
      {observedSum !== null && (
        <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-xs">
          {mode === 'none' ? (
            <div className="space-y-1">
              <div className="font-semibold text-red-600 dark:text-red-400">
                ⚠️ Data Race Detected: Lost updates = {(TARGET_COUNT - observedSum).toLocaleString()} ({(100 - (observedSum / TARGET_COUNT) * 100).toFixed(1)}% corrupted)!
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Mechanism: <code>sum++</code> is not atomic; it expands to: 1. LOAD sum into CPU register, 2. INCREMENT register, 3. STORE register to memory. When multiple threads load the same value concurrently, both store the same result, dropping updates.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ Race Condition Resolved: Exact result {TARGET_COUNT.toLocaleString()} obtained.
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {mode === 'atomic' && 'Trade-off: Fast hardware-level memory lock, but causes cache coherency bus contention across cores.'}
                {mode === 'critical' && 'Trade-off: Serializes all 4 threads entirely at every increment. Correct, but runs much slower than serial code!'}
                {mode === 'reduction' && 'Best practice: Each thread maintains a private local accumulator in its own L1 register, combined into global sum with a tree reduce at loop exit. Maximum scalability and speed!'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
