'use client';

import React, { useState } from 'react';

type ScheduleType = 'static' | 'dynamic' | 'guided';

export function OpenMPScheduleVisualizer() {
  const [schedule, setSchedule] = useState<ScheduleType>('static');
  const [threads, setThreads] = useState<number>(4);
  const [chunkSize, setChunkSize] = useState<number>(2);

  const totalIterations = 24;

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

  const getThreadColor = (t: number) => {
    switch (t) {
      case 0:
        return { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' };
      case 1:
        return { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' };
      case 2:
        return { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' };
      case 3:
      default:
        return { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' };
    }
  };

  return (
    <div className="my-8 apple-card p-6 sm:p-8 rounded-3xl font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Interactive Visualizer // Work-Sharing
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-0.5">
            OpenMP Loop Scheduling Policies
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Inspect how loop iterations map across thread pools under static, dynamic, and guided clauses.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          #pragma omp for schedule({schedule}, {chunkSize})
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-xs">
        <div>
          <label className="block text-neutral-500 dark:text-neutral-400 font-medium mb-1.5 uppercase text-[10px] tracking-wider">
            Schedule Clause:
          </label>
          <div className="flex p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06]">
            {(['static', 'dynamic', 'guided'] as ScheduleType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSchedule(type)}
                className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                  schedule === type
                    ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-neutral-500 dark:text-neutral-400 font-medium mb-1.5 uppercase text-[10px] tracking-wider">
            Chunk Size: <span className="font-semibold text-neutral-900 dark:text-white font-mono">{chunkSize}</span>
          </label>
          <div className="flex p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06]">
            {[1, 2, 4, 8].map((c) => (
              <button
                key={c}
                onClick={() => setChunkSize(c)}
                className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                  chunkSize === c
                    ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-neutral-500 dark:text-neutral-400 font-medium mb-1.5 uppercase text-[10px] tracking-wider">
            Thread Count: <span className="font-semibold text-neutral-900 dark:text-white font-mono">{threads}</span>
          </label>
          <div className="flex p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06]">
            {[2, 3, 4].map((t) => (
              <button
                key={t}
                onClick={() => setThreads(t)}
                className={`flex-1 py-1 rounded-lg text-xs font-medium transition-all ${
                  threads === t
                    ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
        {Array.from({ length: threads }).map((_, t) => {
          const col = getThreadColor(t);
          return (
            <div key={t} className="flex items-center space-x-2">
              <span className={`w-3.5 h-3.5 rounded-full ${col.bg} border ${col.border}`} />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Thread {t}</span>
            </div>
          );
        })}
      </div>

      {/* Iteration Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 mb-6">
        {assignments.map(({ iter, thread }) => {
          const col = getThreadColor(thread);
          return (
            <div
              key={iter}
              className={`p-2.5 rounded-xl border text-center transition-all ${col.bg} ${col.border}`}
            >
              <div className="text-[10px] text-neutral-400 font-mono">i={iter}</div>
              <div className={`text-xs font-bold font-mono mt-0.5 ${col.text}`}>
                T{thread}
              </div>
            </div>
          );
        })}
      </div>

      {/* Description Box */}
      <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-1.5 leading-relaxed">
        <div className="font-semibold text-neutral-900 dark:text-white">
          {schedule === 'static' && 'Static Policy: Low overhead. Round-robin assignment computed ahead-of-time at compile/launch time.'}
          {schedule === 'dynamic' && 'Dynamic Policy: Work-queue model. Idle threads request next chunk dynamically at runtime. Best for irregular workloads.'}
          {schedule === 'guided' && 'Guided Policy: Exponentially decaying chunks starting large and shrinking down to chunk_size to minimize scheduling overhead.'}
        </div>
        <div className="text-neutral-500 dark:text-neutral-400">
          Rule of thumb: Static has near-zero overhead; Dynamic excels when iteration execution times vary widely; Guided balances both.
        </div>
      </div>
    </div>
  );
}
