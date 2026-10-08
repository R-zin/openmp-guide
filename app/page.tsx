'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCompletedSlugs } from '@/lib/storage';

export default function HomePage() {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setCompletedSlugs(getCompletedSlugs());
    const handleProgress = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && custom.detail.all) {
        setCompletedSlugs(custom.detail.all);
      }
    };
    window.addEventListener('study-progress-updated', handleProgress);
    return () => window.removeEventListener('study-progress-updated', handleProgress);
  }, []);

  const totalTopics = 20;
  const mpiCompleted = completedSlugs.filter((s) => s.startsWith('mpi/')).length;
  const ompCompleted = completedSlugs.filter((s) => s.startsWith('openmp/')).length;
  const totalCompleted = mpiCompleted + ompCompleted;
  const percentComplete = Math.round((totalCompleted / totalTopics) * 100);

  return (
    <div className="max-w-[1040px] mx-auto space-y-16 sm:space-y-24 font-sans py-4 sm:py-8">
      {/* Apple Keynote Hero Section */}
      <section className="text-center space-y-6 pt-6 sm:pt-12">
        {/* Apple Pill Tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>IIIT Kottayam // CSS 311 Parallel Distributed Computing</span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.08] max-w-4xl mx-auto">
          Parallel Programming. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-500">
            Engineered for Peak Performance.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
          The definitive study guide covering <strong className="font-semibold text-neutral-900 dark:text-white">MPI</strong> distributed clusters and <strong className="font-semibold text-neutral-900 dark:text-white">OpenMP</strong> multi-core shared memory. Designed with the precision of Apple engineering for your lab exams.
        </p>

        {/* Apple Primary & Secondary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/mpi/"
            className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
          >
            Explore MPI (Distributed) &rarr;
          </Link>
          <Link
            href="/openmp/"
            className="px-6 py-3 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-neutral-900 dark:text-white hover:bg-black/[0.1] dark:hover:bg-white/[0.16] font-semibold text-sm transition-all border border-black/[0.06] dark:border-white/[0.08]"
          >
            Explore OpenMP (Shared) &rarr;
          </Link>
          <Link
            href="/practice/"
            className="px-6 py-3 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 font-semibold text-sm transition-all"
          >
            Practice & Mock Exams &rarr;
          </Link>
        </div>

        {/* Key Metrics Floating Ribbon */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span>20 Core Modules</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>84+ Solved Questions</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>8 Live Simulators</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>2 Full Mock Exams</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>100% Verified C Code</span>
          </div>
        </div>
      </section>

      {/* Progress Summary Card (Apple Activity Style) */}
      <section className="apple-card p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              {percentComplete}%
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Exam Preparation Tracker
              </div>
              <div className="text-base font-semibold text-neutral-900 dark:text-white">
                {totalCompleted} of {totalTopics} Topics Completed
              </div>
            </div>
          </div>
          <Link
            href={completedSlugs.length > 0 ? (completedSlugs[completedSlugs.length - 1].startsWith('mpi') ? '/mpi/' : '/openmp/') : '/mpi/'}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity"
          >
            {totalCompleted > 0 ? 'Continue Studying &rarr;' : 'Begin Day 1 Plan &rarr;'}
          </Link>
        </div>

        {/* Smooth Rounded Progress Bar Track */}
        <div className="w-full h-3 rounded-full bg-black/[0.04] dark:bg-white/[0.06] overflow-hidden my-6 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${Math.max(percentComplete, 2)}%` }}
          />
        </div>

        {/* Breakdown Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
            <div className="text-neutral-400 uppercase font-semibold text-[10px]">TOTAL SYLLABUS</div>
            <div className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">
              {totalCompleted} <span className="text-neutral-400 text-sm font-normal">/ {totalTopics} topics</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
            <div className="text-neutral-400 uppercase font-semibold text-[10px]">MPI DISTRIBUTED</div>
            <div className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">
              {mpiCompleted} <span className="text-neutral-400 text-sm font-normal">/ 10 modules</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
            <div className="text-neutral-400 uppercase font-semibold text-[10px]">OPENMP SHARED</div>
            <div className="text-xl font-bold mt-1 text-neutral-900 dark:text-white">
              {ompCompleted} <span className="text-neutral-400 text-sm font-normal">/ 10 modules</span>
            </div>
          </div>
        </div>
      </section>

      {/* Apple Bento Grid Showcase */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Two Architectures. Endless Scalability.
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Compare distributed-memory network clusters against shared-memory multi-core SMP nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bento Card 1: MPI */}
          <div className="apple-card p-8 rounded-3xl flex flex-col justify-between group hover:border-blue-500/30 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  PART A // DISTRIBUTED MEMORY
                </span>
                <span className="text-xs text-neutral-400">10 Modules</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                MPI Architecture
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Autonomous processes communicating via explicit message-passing over network interconnects. Master point-to-point buffers, collective tree operations, Cartesian process grids, and distributed graph search.
              </p>
              <ul className="text-xs space-y-2 text-neutral-600 dark:text-neutral-400 pt-2">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Foundations: MPI_Init, Rank, Size, Barrier prints</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Point-to-Point: Send, Recv, Sendrecv, Head-to-Head deadlocks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Collectives: Bcast, Scatter, Gather, Allreduce, Scan tree</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Cannon&apos;s Algorithm (2D Torus grid shifts & cost models)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Parallel BFS & DFS on the Lab 10 15-node binary tree</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/mpi/"
                className="w-full inline-flex items-center justify-center py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
              >
                Launch MPI Track (1..10) &rarr;
              </Link>
            </div>
          </div>

          {/* Bento Card 2: OpenMP */}
          <div className="apple-card p-8 rounded-3xl flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  PART B // SHARED MEMORY
                </span>
                <span className="text-xs text-neutral-400">10 Modules</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                OpenMP Architecture
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Lightweight threads sharing a unified virtual address space across multi-core processors. Master fork-join concurrency, loop scheduling policies, race condition locks, reduction trees, and explicit tasks.
              </p>
              <ul className="text-xs space-y-2 text-neutral-600 dark:text-neutral-400 pt-2">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Fork-Join model & -fopenmp compiler setup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Scoping: private, firstprivate, shared, default(none)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Schedules: static, dynamic, guided chunk mapping</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Critical, atomic, barrier, and lock synchronisation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>False sharing prevention & cache-line padding</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/openmp/"
                className="w-full inline-flex items-center justify-center py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
              >
                Launch OpenMP Track (1..10) &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Day Revision Roadmap (Apple Timeline Cards) */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Recommended 3-Day Lab Revision Plan
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            A battle-tested timeline to pass your parallel programming lab exam with full marks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Day 1 */}
          <div className="apple-card p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/[0.05] dark:bg-white/[0.1] text-neutral-900 dark:text-white">
                DAY 01
              </span>
              <span className="text-xs text-neutral-400 font-medium">Foundations</span>
            </div>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Basics & Core Primitives
            </h3>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>MPI 01: Amdahl&apos;s Law & Foster&apos;s PCAM</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>MPI 02: Init, Rank, Size, Barrier prints</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>MPI 03: Point-to-Point, Ping-Pong, Ring</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>OpenMP 01: Fork-Join Model & Threads</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>OpenMP 02: Scoping & default(none)</span>
              </li>
            </ul>
            <div className="pt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
              Goal: Compile & run 4 core programs without bugs.
            </div>
          </div>

          {/* Day 2 */}
          <div className="apple-card p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/[0.05] dark:bg-white/[0.1] text-neutral-900 dark:text-white">
                DAY 02
              </span>
              <span className="text-xs text-neutral-400 font-medium">Algorithms</span>
            </div>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Algorithms & Performance Traps
            </h3>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>MPI 06: Trapezoidal Rule (Fix int Trap bug)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>MPI 07: Odd-Even Transposition Sort</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>MPI 08: Cannon&apos;s 2D Matrix Multiplier</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>MPI 09: Parallel BFS & DFS (15-Node Tree)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>OpenMP 03 & 08: Schedules & False Sharing</span>
              </li>
            </ul>
            <div className="pt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
              Goal: Master partner calculation & circular shifts.
            </div>
          </div>

          {/* Day 3 */}
          <div className="apple-card p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/[0.05] dark:bg-white/[0.1] text-neutral-900 dark:text-white">
                DAY 03
              </span>
              <span className="text-xs text-neutral-400 font-medium">Drills & Mocks</span>
            </div>
            <h3 className="font-semibold text-base text-neutral-900 dark:text-white">
              Exam Drills & Timed Mocks
            </h3>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>Review all 42 MPI Solved Questions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>Review all 42 OpenMP Solved Questions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>Take Mock Exam 1: MPI (3 Tasks, 90 mins)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>Take Mock Exam 2: OpenMP (3 Tasks, 90 mins)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-neutral-400">&bull;</span>
                <span>Rapid review with 65 Flashcards</span>
              </li>
            </ul>
            <div className="pt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
              Goal: Score 100% on output prediction & bug spotting.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
