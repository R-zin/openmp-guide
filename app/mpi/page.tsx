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
    <div className="max-w-[860px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#000000] dark:border-[#FFFFFF] pb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#737373] mb-2">
          PART A // DISTRIBUTED MEMORY COMPUTING
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#000000] dark:text-[#FFFFFF] mb-3">
          MESSAGE PASSING INTERFACE (MPI)
        </h1>
        <p className="text-sm sm:text-base text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
          The primary programming model for distributed memory supercomputers and commodity clusters. Master process execution, point-to-point communication semantics, tree collectives, data distribution topologies, and classic parallel algorithms.
        </p>
      </div>

      {/* Topic List Grid */}
      <div className="divide-y divide-[#E5E5E5] dark:divide-[#262626] border-t border-b border-[#E5E5E5] dark:border-[#262626]">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/mpi/${topic.slug}/`}
            className="group block py-5 transition-colors hover:bg-[#F5F5F5] dark:hover:bg-[#101010] px-3 -mx-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-2">
              <span className="font-bold text-[#000000] dark:text-[#FFFFFF] tracking-widest uppercase">
                TOPIC {String(topic.order).padStart(2, '0')}
              </span>
              <span className="text-[#737373]">
                {topic.readingTimeMinutes} MIN READ
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] group-hover:underline mb-2">
              {topic.title}
            </h2>

            <p className="text-sm text-[#737373] dark:text-[#8C8C8C] leading-relaxed mb-3">
              {topic.description}
            </p>

            {/* Sub-sections Pills */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {topic.sections.map((sec) => (
                <span
                  key={sec.id}
                  className="px-2 py-0.5 border border-[#E5E5E5] dark:border-[#262626] text-[#737373]"
                >
                  {sec.title}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation to Practice */}
      <div className="pt-4 flex flex-wrap justify-between items-center gap-4 text-xs font-mono">
        <Link
          href="/"
          className="text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF]"
        >
          &larr; BACK TO OVERVIEW
        </Link>
        <Link
          href="/practice/mpi/"
          className="px-4 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold uppercase tracking-wider"
        >
          SOLVE MPI QUESTIONS (42+) &rarr;
        </Link>
      </div>
    </div>
  );
}
