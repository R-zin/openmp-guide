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
    <div className="max-w-[960px] mx-auto space-y-12 font-sans">
      {/* Hero Header */}
      <section className="border-b border-[#000000] dark:border-[#FFFFFF] pb-8 pt-4">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-[#737373] mb-3">
          <span>IIIT KOTTAYAM // PDC LAB EXAM REVISION</span>
          <span>&bull;</span>
          <span>CSS 311</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-mono tracking-tight text-[#000000] dark:text-[#FFFFFF] mb-4">
          PARALLEL PROGRAMMING
        </h1>
        <p className="text-base sm:text-lg text-[#000000] dark:text-[#E5E5E5] max-w-2xl leading-relaxed">
          The definitive study guide covering <strong>MPI</strong> (distributed memory) and <strong>OpenMP</strong> (shared memory), engineered for undergraduate students preparing for practical lab exams, code predictions, and viva voce.
        </p>

        {/* Quick Jump Action Pills */}
        <div className="flex flex-wrap gap-2.5 mt-6 font-mono text-xs">
          <Link
            href="/mpi/"
            className="px-4 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
          >
            START MPI (10 TOPICS) &rarr;
          </Link>
          <Link
            href="/openmp/"
            className="px-4 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] font-bold uppercase tracking-wider hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] transition-colors"
          >
            START OPENMP (10 TOPICS) &rarr;
          </Link>
          <Link
            href="/practice/"
            className="px-4 py-2 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF] text-[#000000] dark:text-[#FFFFFF] uppercase tracking-wider transition-colors"
          >
            PRACTICE (80+ QUESTIONS)
          </Link>
          <Link
            href="/flashcards/"
            className="px-4 py-2 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF] text-[#000000] dark:text-[#FFFFFF] uppercase tracking-wider transition-colors"
          >
            FLASHCARDS (65)
          </Link>
        </div>
      </section>

      {/* Progress Summary Card */}
      <section className="border border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
        <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            YOUR LAB PREPARATION PROGRESS
          </span>
          <span className="text-xs px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] font-bold">
            {percentComplete}% COMPLETED
          </span>
        </div>

        {/* 1px Progress Bar Track */}
        <div className="w-full h-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#F5F5F5] dark:bg-[#121212] mb-4">
          <div
            className="h-full bg-[#000000] dark:bg-[#FFFFFF] transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F5F5F5] dark:bg-[#121212]">
            <div className="text-[#737373] text-[10px] uppercase">TOTAL TOPICS</div>
            <div className="text-lg font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">
              {totalCompleted} / {totalTopics}
            </div>
          </div>
          <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F5F5F5] dark:bg-[#121212]">
            <div className="text-[#737373] text-[10px] uppercase">PART A: MPI TOPICS</div>
            <div className="text-lg font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">
              {mpiCompleted} / 10
            </div>
          </div>
          <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F5F5F5] dark:bg-[#121212]">
            <div className="text-[#737373] text-[10px] uppercase">PART B: OPENMP TOPICS</div>
            <div className="text-lg font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">
              {ompCompleted} / 10
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Paradigm Choice */}
      <section className="space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#737373]">
          SELECT REVISION TRACK
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: MPI */}
          <div className="border-2 border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#FFFFFF] dark:bg-[#000000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#E5E5E5] dark:border-[#262626] mb-3">
                <span className="font-bold uppercase tracking-wider">PART A</span>
                <span className="text-[#737373]">DISTRIBUTED MEMORY</span>
              </div>
              <h2 className="text-2xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mb-3">
                MPI ARCHITECTURE
              </h2>
              <p className="text-sm text-[#000000] dark:text-[#E5E5E5] leading-relaxed mb-4">
                Autonomous processes communicating via explicit network messages over an interconnect. Covers point-to-point buffers, collective tree operations, Cartesian grids, and graph traversals.
              </p>

              <ul className="text-xs font-mono space-y-1.5 text-[#737373] mb-6">
                <li>&bull; Foundations: Init, Rank, Size, Finalize</li>
                <li>&bull; Point-to-Point: Send, Recv, Sendrecv, Deadlock</li>
                <li>&bull; Collectives: Bcast, Scatter, Gather, Reduce, Scan</li>
                <li>&bull; Trapezoidal rule & Odd-Even Transposition Sort</li>
                <li>&bull; Cannon&apos;s Algorithm (2D Torus Matrix Multiplication)</li>
                <li>&bull; Parallel Graph Search: Level-Synchronous BFS & DFS</li>
              </ul>
            </div>

            <Link
              href="/mpi/"
              className="w-full py-2.5 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] text-center font-mono text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
            >
              EXPLORE MPI TOPICS (1..10) &rarr;
            </Link>
          </div>

          {/* Column 2: OpenMP */}
          <div className="border-2 border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#FFFFFF] dark:bg-[#000000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#E5E5E5] dark:border-[#262626] mb-3">
                <span className="font-bold uppercase tracking-wider">PART B</span>
                <span className="text-[#737373]">SHARED MEMORY</span>
              </div>
              <h2 className="text-2xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mb-3">
                OPENMP ARCHITECTURE
              </h2>
              <p className="text-sm text-[#000000] dark:text-[#E5E5E5] leading-relaxed mb-4">
                Lightweight threads sharing a single global virtual address space on multi-core SMP CPUs. Covers directives, worksharing schedules, race synchronization, reduction, and tasking.
              </p>

              <ul className="text-xs font-mono space-y-1.5 text-[#737373] mb-6">
                <li>&bull; Fork-Join model & -fopenmp compiler setup</li>
                <li>&bull; Scoping: private, firstprivate, lastprivate, default(none)</li>
                <li>&bull; Worksharing: parallel for, collapse, static/dynamic/guided</li>
                <li>&bull; Synchronization: critical, atomic, barrier, locks</li>
                <li>&bull; Reductions: Pi estimation & Trapezoidal rule</li>
                <li>&bull; Tasks: Recursive Fibonacci & Tree Traversals</li>
              </ul>
            </div>

            <Link
              href="/openmp/"
              className="w-full py-2.5 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] text-center font-mono text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
            >
              EXPLORE OPENMP TOPICS (1..10) &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Day Revision Plan */}
      <section className="border border-[#E5E5E5] dark:border-[#262626] p-6 bg-[#F5F5F5] dark:bg-[#0A0A0A] font-mono">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            RECOMMENDED 3-DAY LAB REVISION PLAN
          </span>
          <span className="text-[11px] text-[#737373] uppercase">
            TARGET: FULL LAB EXAM MASTERY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Day 1 */}
          <div className="border border-[#000000] dark:border-[#FFFFFF] p-4 bg-[#FFFFFF] dark:bg-[#000000] space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5] dark:border-[#262626]">
              <span className="font-bold text-sm">DAY 1</span>
              <span className="text-[#737373]">FOUNDATIONS</span>
            </div>
            <div className="font-bold text-[#000000] dark:text-[#FFFFFF]">
              Basics & Core Syntax
            </div>
            <ul className="space-y-1.5 text-[#737373]">
              <li>&bull; MPI 01: Amdahl&apos;s Law & Foster&apos;s PCAM</li>
              <li>&bull; MPI 02: Init, Rank, Size, Barrier</li>
              <li>&bull; MPI 03: Point-to-Point, Ping-Pong, Ring</li>
              <li>&bull; MPI 04: Collectives Chooser Table</li>
              <li>&bull; OpenMP 01: Fork-Join Model & Threads</li>
              <li>&bull; OpenMP 02: Scoping & default(none)</li>
            </ul>
            <div className="pt-2 text-[11px] text-[#000000] dark:text-[#FFFFFF] font-bold">
              Goal: Compile and execute first 4 programs without syntax bugs.
            </div>
          </div>

          {/* Day 2 */}
          <div className="border border-[#000000] dark:border-[#FFFFFF] p-4 bg-[#FFFFFF] dark:bg-[#000000] space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5] dark:border-[#262626]">
              <span className="font-bold text-sm">DAY 2</span>
              <span className="text-[#737373]">ALGORITHMS</span>
            </div>
            <div className="font-bold text-[#000000] dark:text-[#FFFFFF]">
              Algorithms & Performance Traps
            </div>
            <ul className="space-y-1.5 text-[#737373]">
              <li>&bull; MPI 06: Trapezoidal Rule (Fix int Trap bug)</li>
              <li>&bull; MPI 07: Parallel Odd-Even Transposition Sort</li>
              <li>&bull; MPI 08: Cannon&apos;s 2D Matrix Multiplication</li>
              <li>&bull; MPI 09: Parallel BFS & DFS (15-Node Tree)</li>
              <li>&bull; OpenMP 03: Worksharing & Schedules</li>
              <li>&bull; OpenMP 04 & 05: Atomics, Reductions, Pi</li>
              <li>&bull; OpenMP 08: False Sharing Cache Alignment</li>
            </ul>
            <div className="pt-2 text-[11px] text-[#000000] dark:text-[#FFFFFF] font-bold">
              Goal: Master partner calculations, circular shifts, and reduction trees.
            </div>
          </div>

          {/* Day 3 */}
          <div className="border border-[#000000] dark:border-[#FFFFFF] p-4 bg-[#FFFFFF] dark:bg-[#000000] space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E5E5] dark:border-[#262626]">
              <span className="font-bold text-sm">DAY 3</span>
              <span className="text-[#737373]">DRILLS & MOCKS</span>
            </div>
            <div className="font-bold text-[#000000] dark:text-[#FFFFFF]">
              Exam Drills & Mock Tests
            </div>
            <ul className="space-y-1.5 text-[#737373]">
              <li>&bull; Review all 42 MPI Solved Questions</li>
              <li>&bull; Review all 42 OpenMP Solved Questions</li>
              <li>&bull; Take Mock Exam 1: MPI (3 Tasks, 90 mins)</li>
              <li>&bull; Take Mock Exam 2: OpenMP (3 Tasks, 90 mins)</li>
              <li>&bull; Rapid-fire review of 65 Flashcards</li>
              <li>&bull; MPI 10: Run the 10-Point Debug Checklist</li>
            </ul>
            <div className="pt-2 text-[11px] text-[#000000] dark:text-[#FFFFFF] font-bold">
              Goal: Achieve 100% score on output prediction and bug spotting.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
