import React from 'react';
import Link from 'next/link';
import { getAllPerformanceTopics } from '@/lib/content';

export const metadata = {
  title: 'Part E: Performance Tools & Analysis // Study Guide',
  description: 'Complete 10-topic guide covering the performance cycle, Amdahl & Gustafson scaling, sampling vs instrumentation, Score-P, Scalasca, PMPI, and trace analysis.',
};

export default function PerformanceHubPage() {
  const topics = getAllPerformanceTopics();

  return (
    <div className="max-w-[960px] mx-auto space-y-10 font-sans py-4">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 border border-black/10 dark:border-white/10">
          <span>Part E // Unit V Performance Tools</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Performance Tools & Analysis
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          The systematic engineering methodology to measure, diagnose, and optimize parallel software. Master Amdahl's Law (strong scaling), Gustafson's Law (weak scaling), the Karp-Flatt metric, sampling vs instrumentation, Score-P instrumentation, Scalasca automatic wait-state analysis, and Energy-Delay Product (EDP).
        </p>
      </div>

      {/* Topic List Cards */}
      <div className="grid grid-cols-1 gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/performance/${topic.slug}/`}
            className="apple-card p-6 sm:p-7 rounded-2xl group flex flex-col justify-between hover:border-black/30 dark:hover:border-white/30 transition-all"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] text-neutral-800 dark:text-neutral-200 border border-black/10 dark:border-white/10 uppercase tracking-wide">
                  Topic {String(topic.order).padStart(2, '0')}
                </span>
                <span className="text-neutral-400 text-xs font-medium">
                  {topic.readingTimeMinutes} min read
                </span>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors tracking-tight mb-2">
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

            <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              <span>Read Full Notes &rarr;</span>
              <span className="font-mono text-[11px] opacity-60">CSS 311 // PART E</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
