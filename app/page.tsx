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

  const totalTopics = 46;
  const mpiCompleted = completedSlugs.filter((s) => s.startsWith('mpi/')).length;
  const ompCompleted = completedSlugs.filter((s) => s.startsWith('openmp/')).length;
  const netCompleted = completedSlugs.filter((s) => s.startsWith('networks/')).length;
  const vecCompleted = completedSlugs.filter((s) => s.startsWith('vectors/')).length;
  const perfCompleted = completedSlugs.filter((s) => s.startsWith('performance/')).length;

  const totalCompleted = mpiCompleted + ompCompleted + netCompleted + vecCompleted + perfCompleted;
  const percentComplete = Math.round((totalCompleted / totalTopics) * 100);

  return (
    <div className="max-w-[1040px] mx-auto space-y-14 sm:space-y-20 font-sans py-4 sm:py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>IIIT Kottayam // CSS 311 Parallel and Distributed Computing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.08] max-w-4xl mx-auto">
          Complete Study Guide for PDC. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-500">
            Theory & Lab Exam Mastery.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          The comprehensive curriculum guide covering <strong className="font-semibold text-neutral-900 dark:text-white">MPI</strong> (Distributed Memory), <strong className="font-semibold text-neutral-900 dark:text-white">OpenMP</strong> (Shared Memory), <strong className="font-semibold text-neutral-900 dark:text-white">Interconnection Networks</strong>, <strong className="font-semibold text-neutral-900 dark:text-white">Vector Processors</strong>, and <strong className="font-semibold text-neutral-900 dark:text-white">Performance Tools</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/mpi/"
            className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
          >
            Part A: MPI &rarr;
          </Link>
          <Link
            href="/openmp/"
            className="px-5 py-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-neutral-900 dark:text-white font-semibold text-xs uppercase tracking-wider hover:bg-black/[0.1] dark:hover:bg-white/[0.16] transition-all border border-black/10 dark:border-white/10"
          >
            Part B: OpenMP &rarr;
          </Link>
          <Link
            href="/networks/"
            className="px-5 py-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-neutral-900 dark:text-white font-semibold text-xs uppercase tracking-wider hover:bg-black/[0.1] dark:hover:bg-white/[0.16] transition-all border border-black/10 dark:border-white/10"
          >
            Part C: Networks &rarr;
          </Link>
          <Link
            href="/vectors/"
            className="px-5 py-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-neutral-900 dark:text-white font-semibold text-xs uppercase tracking-wider hover:bg-black/[0.1] dark:hover:bg-white/[0.16] transition-all border border-black/10 dark:border-white/10"
          >
            Part D: Vectors &rarr;
          </Link>
          <Link
            href="/performance/"
            className="px-5 py-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-neutral-900 dark:text-white font-semibold text-xs uppercase tracking-wider hover:bg-black/[0.1] dark:hover:bg-white/[0.16] transition-all border border-black/10 dark:border-white/10"
          >
            Part E: Tools &rarr;
          </Link>
        </div>

        {/* Floating Quick Stats */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
            <span>46 In-Depth Topics</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>159+ Solved Questions</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>14 Live Simulators & Visualizers</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>3 Mock Exams (2 Lab, 1 Theory)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>123 Flashcards</span>
          </div>
        </div>
      </section>

      {/* Course Progress Card */}
      <section className="apple-card p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 dark:text-neutral-400 block mb-1">
              LIVE PROGRESS TRACKER
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Course Revision Completion
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                {percentComplete}%
              </span>
              <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                {totalCompleted} of {totalTopics} Completed
              </span>
            </div>
          </div>
        </div>

        {/* Progress Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 text-xs font-mono">
          <div className="p-3 border border-black/10 dark:border-white/10 rounded-xl">
            <span className="text-[10px] text-neutral-500 block">PART A: MPI</span>
            <strong className="text-base">{mpiCompleted} / 10</strong>
          </div>
          <div className="p-3 border border-black/10 dark:border-white/10 rounded-xl">
            <span className="text-[10px] text-neutral-500 block">PART B: OPENMP</span>
            <strong className="text-base">{ompCompleted} / 10</strong>
          </div>
          <div className="p-3 border border-black/10 dark:border-white/10 rounded-xl">
            <span className="text-[10px] text-neutral-500 block">PART C: NETWORKS</span>
            <strong className="text-base">{netCompleted} / 7</strong>
          </div>
          <div className="p-3 border border-black/10 dark:border-white/10 rounded-xl">
            <span className="text-[10px] text-neutral-500 block">PART D: VECTORS</span>
            <strong className="text-base">{vecCompleted} / 9</strong>
          </div>
          <div className="p-3 border border-black/10 dark:border-white/10 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[10px] text-neutral-500 block">PART E: TOOLS</span>
            <strong className="text-base">{perfCompleted} / 10</strong>
          </div>
        </div>
      </section>

      {/* The Five-Part Bento Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
            CURRICULUM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
            The Five Core Course Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Part A MPI */}
          <Link
            href="/mpi/"
            className="apple-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono opacity-70">
                <span>PART A</span>
                <span>10 TOPICS</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:opacity-75 transition-opacity">
                MPI (Distributed Memory)
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                SPMD model, point-to-point communication semantics, blocking vs non-blocking, collectives tree chooser, Trapezoidal numerical integration, Cannon's matrix multiplication, and parallel graph search.
              </p>
            </div>
            <div className="pt-6 text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06] mt-4">
              <span>Explore Part A &rarr;</span>
              <span className="font-mono text-[10px] opacity-60">42 Questions</span>
            </div>
          </Link>

          {/* Card 2: Part B OpenMP */}
          <Link
            href="/openmp/"
            className="apple-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono opacity-70">
                <span>PART B</span>
                <span>10 TOPICS</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:opacity-75 transition-opacity">
                OpenMP (Shared Memory)
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Fork-join threading, private/firstprivate scoping clauses, loop scheduling (static, dynamic, guided), synchronization barriers & locks, reduction clauses, OpenMP tasks, and false sharing mitigation.
              </p>
            </div>
            <div className="pt-6 text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06] mt-4">
              <span>Explore Part B &rarr;</span>
              <span className="font-mono text-[10px] opacity-60">42 Questions</span>
            </div>
          </Link>

          {/* Card 3: Part C Networks */}
          <Link
            href="/networks/"
            className="apple-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono opacity-70">
                <span>PART C</span>
                <span>7 TOPICS</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:opacity-75 transition-opacity">
                Interconnection Networks
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Graph metrics (diameter, bisection width, degree, links), static vs dynamic topologies (torus, hypercube, fat tree, k-ary d-cube), E-cube dimension-order routing, and Reflected Gray Code embeddings.
              </p>
            </div>
            <div className="pt-6 text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06] mt-4">
              <span>Explore Part C &rarr;</span>
              <span className="font-mono text-[10px] opacity-60">25 Questions</span>
            </div>
          </Link>

          {/* Card 4: Part D Vectors */}
          <Link
            href="/vectors/"
            className="apple-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono opacity-70">
                <span>PART D</span>
                <span>9 TOPICS</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:opacity-75 transition-opacity">
                Vector Processors
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Historical evolution from Cray-1 to Fujitsu A64FX, pipelining speedup derivations ($k+n-1$), VMIPS architecture (64x64-bit registers), strip-mining when n &gt; MVL, and GCC SIMD vectorisation.
              </p>
            </div>
            <div className="pt-6 text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06] mt-4">
              <span>Explore Part D &rarr;</span>
              <span className="font-mono text-[10px] opacity-60">25 Questions</span>
            </div>
          </Link>

          {/* Card 5: Part E Performance Tools */}
          <Link
            href="/performance/"
            className="apple-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono opacity-70">
                <span>PART E</span>
                <span>10 TOPICS</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:opacity-75 transition-opacity">
                Performance Tools & Analysis
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Amdahl's strong scaling, Gustafson's weak scaling, Karp-Flatt metric, sampling vs instrumentation, Score-P CUBE profiling, Scalasca wait-state analysis (Late Sender), and Energy-Delay Product (EDP).
              </p>
            </div>
            <div className="pt-6 text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06] mt-4">
              <span>Explore Part E &rarr;</span>
              <span className="font-mono text-[10px] opacity-60">25 Questions</span>
            </div>
          </Link>

          {/* Card 6: Practice & Exams */}
          <Link
            href="/practice/"
            className="apple-card p-6 sm:p-7 rounded-3xl flex flex-col justify-between group border-2 border-black dark:border-white hover:border-black/50 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono opacity-70">
                <span>PART F</span>
                <span>EXAMS & DRILLS</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:opacity-75 transition-opacity">
                Practice, Mocks & Formula Sheet
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                159+ solved questions, Mock Lab 1 (MPI), Mock Lab 2 (OpenMP), End-Semester Theory Paper (Parts C, D, E) with rubrics, and printable 1-page formula sheet.
              </p>
            </div>
            <div className="pt-6 text-xs font-semibold text-neutral-900 dark:text-white flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06] mt-4">
              <span>Open Practice Hub &rarr;</span>
              <span className="font-mono text-[10px] opacity-60">3 Mocks + Formulas</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3-Day Revision Plan */}
      <section className="apple-card p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 dark:text-neutral-400 block mb-1">
            EXAM ACCELERATOR
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            The 3-Day Intensive Revision Roadmap
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Structured study schedule engineered for undergraduate students preparing for both the lab programming exam and the theory exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          {/* Day 1 */}
          <div className="p-4 border border-black/10 dark:border-white/10 rounded-2xl space-y-3 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="flex justify-between items-center font-bold pb-2 border-b border-black/10 dark:border-white/10">
              <span className="text-sm">DAY 1: DISTRIBUTED & SHARED MEMORY</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">LAB FOCUS</span>
            </div>
            <ul className="space-y-2 text-[11px] text-neutral-700 dark:text-neutral-300">
              <li>&bull; Morning: MPI Basics, Send/Recv, Ring & Ping-Pong token passing.</li>
              <li>&bull; Afternoon: Collectives, Trapezoidal rule (Reduce vs Sendrecv), Cannon's matrix mult.</li>
              <li>&bull; Evening: OpenMP Fork-Join, private/shared clauses, work sharing schedules.</li>
              <li className="pt-2 font-bold text-neutral-900 dark:text-white">&rarr; Milestone: Solve 20 MPI and 20 OpenMP practice problems.</li>
            </ul>
          </div>

          {/* Day 2 */}
          <div className="p-4 border border-black/10 dark:border-white/10 rounded-2xl space-y-3 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="flex justify-between items-center font-bold pb-2 border-b border-black/10 dark:border-white/10">
              <span className="text-sm">DAY 2: ADVANCED & NETWORKS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">MIXED FOCUS</span>
            </div>
            <ul className="space-y-2 text-[11px] text-neutral-700 dark:text-neutral-300">
              <li>&bull; Morning: OpenMP Synchronization, critical vs atomic, False Sharing demo, Tasks.</li>
              <li>&bull; Afternoon: Mock Lab Exam 1 (MPI) & Mock Lab Exam 2 (OpenMP) under timed conditions.</li>
              <li>&bull; Evening: Interconnection Networks (Diameter, Bisection, E-Cube Routing, Gray Code).</li>
              <li className="pt-2 font-bold text-neutral-900 dark:text-white">&rarr; Milestone: Complete both Mock Lab exams (50 marks each).</li>
            </ul>
          </div>

          {/* Day 3 */}
          <div className="p-4 border border-black/10 dark:border-white/10 rounded-2xl space-y-3 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="flex justify-between items-center font-bold pb-2 border-b border-black/10 dark:border-white/10">
              <span className="text-sm">DAY 3: ARCHITECTURE & THEORY</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">THEORY FOCUS</span>
            </div>
            <ul className="space-y-2 text-[11px] text-neutral-700 dark:text-neutral-300">
              <li>&bull; Morning: Vector Processors (VMIPS, Pipelining speedup k+n-1, Strip-mining).</li>
              <li>&bull; Afternoon: Performance Tools (Amdahl, Gustafson, Score-P, Scalasca wait-states).</li>
              <li>&bull; Evening: End-Semester Theory Mock Paper (50 Marks) & 123 Flashcards drill.</li>
              <li className="pt-2 font-bold text-neutral-900 dark:text-white">&rarr; Milestone: Review Course Formula Sheet and print for final revision.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
