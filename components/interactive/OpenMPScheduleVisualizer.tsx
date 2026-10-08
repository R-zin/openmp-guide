'use client';

import React, { useState } from 'react';

type ScheduleType = 'static' | 'dynamic' | 'guided';

export function OpenMPScheduleVisualizer() {
  const [schedule, setSchedule] = useState<ScheduleType>('static');
  const [threads, setThreads] = useState<number>(4);
  const [chunkSize, setChunkSize] = useState<number>(2);

  const totalIterations = 24;

  // Calculate iteration assignment to thread
  const computeAssignments = (): { iter: number; thread: number }[] => {
    const list: { iter: number; thread: number }[] = [];

    if (schedule === 'static') {
      const c = chunkSize > 0 ? chunkSize : Math.ceil(totalIterations / threads);
      for (let i = 0; i < totalIterations; i++) {
        const chunkIndex = Math.floor(i / c);
        const assignedThread = chunkIndex % threads;
        list.push({ iter: i, thread: assignedThread });
      }
    } else if (schedule === 'dynamic') {
      const c = Math.max(1, chunkSize);
      let currThread = 0;
      for (let i = 0; i < totalIterations; i += c) {
        for (let j = 0; j < c && i + j < totalIterations; j++) {
          list.push({ iter: i + j, thread: currThread % threads });
        }
        currThread++;
      }
    } else {
      // guided schedule: chunk = max(chunk_size, ceil(remaining / threads))
      let remaining = totalIterations;
      let currIter = 0;
      let currThread = 0;
      const minChunk = Math.max(1, chunkSize);

      while (currIter < totalIterations) {
        const c = Math.max(minChunk, Math.ceil(remaining / threads));
        const actualChunk = Math.min(c, remaining);
        for (let j = 0; j < actualChunk; j++) {
          list.push({ iter: currIter + j, thread: currThread % threads });
        }
        currIter += actualChunk;
        remaining -= actualChunk;
        currThread++;
      }
    }

    return list;
  };

  const assignments = computeAssignments();

  // Pattern / style for each thread
  const getThreadStyle = (t: number) => {
    switch (t) {
      case 0:
        return 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] border-[#000000] dark:border-[#FFFFFF]';
      case 1:
        return 'bg-[#FFFFFF] text-[#000000] dark:bg-[#000000] dark:text-[#FFFFFF] border-[#000000] dark:border-[#FFFFFF]';
      case 2:
        return 'bg-[#E5E5E5] text-[#000000] dark:bg-[#262626] dark:text-[#FFFFFF] border-[#737373]';
      case 3:
      default:
        return 'bg-[#F5F5F5] text-[#000000] dark:bg-[#1A1A1A] dark:text-[#FFFFFF] border-dashed border-[#737373]';
    }
  };

  return (
    <div className="my-8 border border-[#000000] dark:border-[#FFFFFF] p-5 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            INTERACTIVE VISUALIZER // OPENMP LOOP SCHEDULING
          </span>
          <p className="text-xs text-[#737373] mt-1 font-sans">
            Inspect how iterations map across threads under static, dynamic, and guided policies.
          </p>
        </div>
        <span className="text-xs px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] uppercase">
          #pragma omp for schedule({schedule}, {chunkSize})
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
        <div>
          <label className="block text-[#737373] uppercase mb-1">SCHEDULE CLAUSE:</label>
          <div className="flex border border-[#000000] dark:border-[#FFFFFF]">
            {(['static', 'dynamic', 'guided'] as ScheduleType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSchedule(type)}
                className={`flex-1 py-1 uppercase text-center ${
                  schedule === type
                    ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                    : 'text-[#000000] dark:text-[#FFFFFF]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[#737373] uppercase mb-1">
            CHUNK SIZE: {chunkSize}
          </label>
          <div className="flex border border-[#E5E5E5] dark:border-[#262626]">
            {[1, 2, 4, 8].map((c) => (
              <button
                key={c}
                onClick={() => setChunkSize(c)}
                className={`flex-1 py-1 text-center ${
                  chunkSize === c
                    ? 'border border-[#000000] dark:border-[#FFFFFF] font-bold bg-[#F5F5F5] dark:bg-[#1A1A1A]'
                    : 'text-[#737373]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[#737373] uppercase mb-1">
            NUM THREADS: {threads}
          </label>
          <div className="flex border border-[#E5E5E5] dark:border-[#262626]">
            {[2, 3, 4].map((t) => (
              <button
                key={t}
                onClick={() => setThreads(t)}
                className={`flex-1 py-1 text-center ${
                  threads === t
                    ? 'border border-[#000000] dark:border-[#FFFFFF] font-bold bg-[#F5F5F5] dark:bg-[#1A1A1A]'
                    : 'text-[#737373]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 pb-3 border-b border-[#E5E5E5] dark:border-[#262626] text-xs">
        {Array.from({ length: threads }).map((_, t) => (
          <div key={t} className="flex items-center space-x-1.5">
            <span
              className={`w-4 h-4 border inline-block ${getThreadStyle(t)}`}
            />
            <span className="text-[#000000] dark:text-[#FFFFFF]">THREAD {t}</span>
          </div>
        ))}
      </div>

      {/* Iteration Grid Display */}
      <div className="mb-4">
        <div className="text-[11px] text-[#737373] uppercase mb-2">
          LOOP ITERATIONS (i = 0 .. {totalIterations - 1}):
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 text-center text-xs font-mono">
          {assignments.map(({ iter, thread }) => (
            <div
              key={iter}
              className={`p-2 border flex flex-col justify-between h-14 ${getThreadStyle(
                thread
              )}`}
            >
              <span className="text-[10px] opacity-75 font-normal">i={iter}</span>
              <span className="font-bold text-xs">T{thread}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Box */}
      <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212] text-xs space-y-1">
        <div className="font-bold text-[#000000] dark:text-[#FFFFFF]">
          {schedule === 'static' && 'STATIC POLICY (Compile-time / Lowest Overhead):'}
          {schedule === 'dynamic' && 'DYNAMIC POLICY (Work-Queue / Best for Unbalanced Workloads):'}
          {schedule === 'guided' && 'GUIDED POLICY (Decreasing Chunk Sizes / Adaptive Balance):'}
        </div>
        <p className="text-[#737373] leading-relaxed">
          {schedule === 'static' &&
            'Iterations are partitioned deterministically in round-robin chunks before loop execution begins. Zero runtime queue contention overhead. Ideal when every iteration takes approximately equal time.'}
          {schedule === 'dynamic' &&
            'Threads claim a chunk of iterations from a shared queue when idle. Minimizes idle time for non-uniform workloads (e.g. Mandelbrot set or sparse matrices) at the cost of atomic synchronization queue overhead.'}
          {schedule === 'guided' &&
            'Starts with large chunk sizes to minimize synchronization overhead, exponentially reducing chunk size towards chunk_size as loop completion approaches to smooth tail load imbalance.'}
        </p>
      </div>
    </div>
  );
}
