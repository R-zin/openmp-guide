'use client';

import React, { useState } from 'react';

type SyncMode = 'none' | 'atomic' | 'critical' | 'reduction';

export function RaceConditionDemo() {
  const [mode, setMode] = useState<SyncMode>('none');
  const [observedSum, setObservedSum] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const TARGET_COUNT = 100000;
  const THREADS = 4;

  const runSimulation = () => {
    setIsRunning(true);
    setObservedSum(null);

    setTimeout(() => {
      if (mode === 'none') {
        // Model data race loss: 4 threads simultaneously reading and overwriting
        // Observed count typically drops to ~65% - 85% of target due to lost updates
        const lossFactor = 0.68 + Math.random() * 0.18;
        setObservedSum(Math.round(TARGET_COUNT * lossFactor));
      } else {
        // Fully synchronized modes produce 100% exact result
        setObservedSum(TARGET_COUNT);
      }
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="my-8 border border-[#000000] dark:border-[#FFFFFF] p-5 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            INTERACTIVE DEMO // SHARED MEMORY DATA RACES & FIXES
          </span>
          <p className="text-xs text-[#737373] mt-1 font-sans">
            Demonstrating unsynchronized read-modify-write collisions versus atomic, critical, and reduction clauses.
          </p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 border uppercase font-bold ${
            mode === 'none'
              ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]'
              : 'border-[#737373] text-[#737373]'
          }`}
        >
          {mode === 'none' ? '[!] DATA RACE ACTIVE' : '[OK] PROTECTED'}
        </span>
      </div>

      {/* Synchronization Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs">
        <button
          onClick={() => { setMode('none'); setObservedSum(null); }}
          className={`p-2 border text-center uppercase ${
            mode === 'none'
              ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
              : 'border-[#E5E5E5] dark:border-[#262626] text-[#000000] dark:text-[#FFFFFF]'
          }`}
        >
          1. NO SYNC (RACE)
        </button>
        <button
          onClick={() => { setMode('atomic'); setObservedSum(null); }}
          className={`p-2 border text-center uppercase ${
            mode === 'atomic'
              ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
              : 'border-[#E5E5E5] dark:border-[#262626] text-[#000000] dark:text-[#FFFFFF]'
          }`}
        >
          2. #pragma omp atomic
        </button>
        <button
          onClick={() => { setMode('critical'); setObservedSum(null); }}
          className={`p-2 border text-center uppercase ${
            mode === 'critical'
              ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
              : 'border-[#E5E5E5] dark:border-[#262626] text-[#000000] dark:text-[#FFFFFF]'
          }`}
        >
          3. #pragma omp critical
        </button>
        <button
          onClick={() => { setMode('reduction'); setObservedSum(null); }}
          className={`p-2 border text-center uppercase ${
            mode === 'reduction'
              ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
              : 'border-[#E5E5E5] dark:border-[#262626] text-[#000000] dark:text-[#FFFFFF]'
          }`}
        >
          4. reduction(+:sum)
        </button>
      </div>

      {/* Code Snippet for Selected Mode */}
      <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#0C0C0C] text-xs mb-4">
        <div className="text-[10px] text-[#737373] uppercase mb-1">LOOP CODE STATEMENT:</div>
        {mode === 'none' && (
          <code className="text-[#000000] dark:text-[#FFFFFF]">
            #pragma omp parallel for num_threads(4)<br />
            for (int i = 0; i &lt; 100000; i++) &#123;<br />
            &nbsp;&nbsp;sum++; // DATA RACE: Unsynchronized concurrent read/write<br />
            &#125;
          </code>
        )}
        {mode === 'atomic' && (
          <code className="text-[#000000] dark:text-[#FFFFFF]">
            #pragma omp parallel for num_threads(4)<br />
            for (int i = 0; i &lt; 100000; i++) &#123;<br />
            &nbsp;&nbsp;#pragma omp atomic<br />
            &nbsp;&nbsp;sum++; // Low overhead CPU bus-lock primitive<br />
            &#125;
          </code>
        )}
        {mode === 'critical' && (
          <code className="text-[#000000] dark:text-[#FFFFFF]">
            #pragma omp parallel for num_threads(4)<br />
            for (int i = 0; i &lt; 100000; i++) &#123;<br />
            &nbsp;&nbsp;#pragma omp critical<br />
            &nbsp;&nbsp;&#123; sum++; &#125; // High overhead mutual exclusion mutex lock<br />
            &#125;
          </code>
        )}
        {mode === 'reduction' && (
          <code className="text-[#000000] dark:text-[#FFFFFF]">
            #pragma omp parallel for num_threads(4) reduction(+:sum)<br />
            for (int i = 0; i &lt; 100000; i++) &#123;<br />
            &nbsp;&nbsp;sum++; // Zero synchronization during loop; local privates merged at end!<br />
            &#125;
          </code>
        )}
      </div>

      {/* Run Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="px-4 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-[#000000] dark:hover:bg-transparent dark:hover:text-[#FFFFFF] transition-colors disabled:opacity-40"
        >
          {isRunning ? 'RUNNING ON 4 THREADS...' : 'RUN PARALLEL EXECUTION'}
        </button>

        <div className="flex items-center space-x-6 text-xs">
          <div>
            <span className="text-[#737373]">EXPECTED SUM:</span>{' '}
            <span className="font-bold">{TARGET_COUNT.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[#737373]">OBSERVED SUM:</span>{' '}
            <span
              className={`font-bold ${
                observedSum === null
                  ? 'text-[#737373]'
                  : observedSum === TARGET_COUNT
                  ? 'text-[#000000] dark:text-[#FFFFFF]'
                  : 'underline text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              {observedSum !== null ? observedSum.toLocaleString() : '---'}
            </span>
          </div>
        </div>
      </div>

      {/* Analysis Output */}
      {observedSum !== null && (
        <div className="p-3 border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] text-xs">
          {mode === 'none' ? (
            <div>
              <div className="font-bold mb-1">
                [!] DATA RACE DETECTED: Lost updates = {(TARGET_COUNT - observedSum).toLocaleString()} ({(100 - (observedSum / TARGET_COUNT) * 100).toFixed(1)}% corrupted)!
              </div>
              <p className="text-[#737373]">
                Mechanism: <code>sum++</code> is not atomic; it expands to: 1. LOAD sum into CPU register, 2. INCREMENT register, 3. STORE register to memory. When Thread 0 and Thread 1 load the same value concurrently, both store the same result, dropping one increment.
              </p>
            </div>
          ) : (
            <div>
              <div className="font-bold mb-1">
                [OK] RACE CONDITION RESOLVED: Exact result 100,000 obtained.
              </div>
              <p className="text-[#737373]">
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
