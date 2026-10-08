import React from 'react';
import Link from 'next/link';
import { getAllMpiTopics } from '@/lib/content';

export const metadata = {
  title: 'Part A: MPI (Distributed Memory) // Study Guide',
  description: 'Complete 10-topic study guide for the Message Passing Interface (MPI) covering point-to-point, collectives, Cannon algorithm, and graph search.',
};

export default function MpiHubPage() {
  const topics = getAllMpiTopics();

  return (
    <div className="max-w-[960px] mx-auto space-y-10 font-sans py-4">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <span>Part A // Distributed Memory Computing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Message Passing Interface (MPI)
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          The primary programming model for distributed memory supercomputers and commodity clusters. Master process execution, point-to-point communication semantics, tree collectives, data distribution topologies, and classic parallel algorithms.
        </p>
      </div>

      {/* Topic List Cards */}
      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/mpi/${topic.slug}/`}
            className="apple-card p-6 sm:p-7 rounded-2xl group flex flex-col justify-between hover:border-blue-500/30 transition-all"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                  Topic {String(topic.order).padStart(2, '0')}
                </span>
                <span className="text-neutral-400 text-xs font-medium">
                  {topic.readingTimeMinutes} min read
                </span>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight mb-2">
                {topic.title}
              </h2>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                {topic.description}
              </p>

              {/* Sub-sections Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {topic.sections.map((sec) => (
                  <span
                    key={sec.id}
                    className="px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] text-neutral-600 dark:text-neutral-400 text-[11px]"
                  >
                    {sec.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Read Module &rarr;</span>
              <span className="text-neutral-400 text-[11px] font-normal">Includes code & interactive demo</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation to Practice */}
      <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-between items-center text-xs">
        <Link
          href="/"
          className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          &larr; Back to Overview
        </Link>
        <Link
          href="/practice/mpi/"
          className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold transition-all shadow-sm"
        >
          Solve MPI Questions (42+) &rarr;
        </Link>
      </div>
    </div>
  );
}
