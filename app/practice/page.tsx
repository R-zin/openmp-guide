import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Practice & Mock Exams // Parallel Programming Study Guide',
  description: '84+ solved exam questions across conceptual, output prediction, find-the-bug, write-the-program, and complexity analysis, plus 2 mock lab exams.',
};

export default function PracticeHubPage() {
  return (
    <div className="max-w-[1040px] mx-auto space-y-10 font-sans py-4">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <span>Part C // Lab Exam Drills & Mocks</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Solved Questions & Mock Lab Exams
        </h1>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Over 84+ curated questions drawn directly from lecture slides, PDC lab problem sets, and past examination papers. Grouped into five distinct categories with collapsible step-by-step solutions and expected outputs.
        </p>
      </div>

      {/* Grid of 6 Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: MPI Questions */}
        <div className="apple-card p-6 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/[0.05] dark:bg-white/[0.08]">
                42 PROBLEMS
              </span>
              <span className="text-xs text-neutral-400 font-medium">Part A // MPI</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              MPI Solved Questions
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Point-to-point buffer deadlocks, ring communication, collectives chooser rules, Trapezoid rule, and Cannon matrix multiplication.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/practice/mpi/"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              View MPI (42) &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: OpenMP Questions */}
        <div className="apple-card p-6 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/[0.05] dark:bg-white/[0.08]">
                42 PROBLEMS
              </span>
              <span className="text-xs text-neutral-400 font-medium">Part B // OpenMP</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              OpenMP Solved Questions
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Thread scoping, loop schedules (static/dynamic/guided), critical vs atomic, reduction clauses, tasks, and false sharing fixes.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/practice/openmp/"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              View OpenMP (42) &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3: Networks Questions */}
        <div className="apple-card p-6 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/[0.05] dark:bg-white/[0.08]">
                25 PROBLEMS
              </span>
              <span className="text-xs text-neutral-400 font-medium">Part C // Networks</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Networks Solved Questions
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Diameter, bisection width, switch degrees, link costs, E-cube routing traces, and Reflected Gray Code embeddings.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/practice/networks/"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              View Networks (25) &rarr;
            </Link>
          </div>
        </div>

        {/* Card 4: Vectors Questions */}
        <div className="apple-card p-6 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/[0.05] dark:bg-white/[0.08]">
                25 PROBLEMS
              </span>
              <span className="text-xs text-neutral-400 font-medium">Part D // Vectors</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Vectors Solved Questions
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Pipeline speedup derivations (k+n-1), VMIPS registers, strip-mining passes, memory interleaving, and GCC SIMD vectorisation.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/practice/vectors/"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              View Vectors (25) &rarr;
            </Link>
          </div>
        </div>

        {/* Card 5: Performance Questions */}
        <div className="apple-card p-6 rounded-3xl flex flex-col justify-between group hover:border-black/30 dark:hover:border-white/30 transition-all">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/[0.05] dark:bg-white/[0.08]">
                25 PROBLEMS
              </span>
              <span className="text-xs text-neutral-400 font-medium">Part E // Tools</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Performance Solved Questions
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Amdahl strong scaling, Gustafson weak scaling, Karp-Flatt metric, Score-P CUBE profiling, and Scalasca wait-state diagnosis.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/practice/performance/"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              View Performance (25) &rarr;
            </Link>
          </div>
        </div>

        {/* Card 6: Mock Theory Exam */}
        <div className="apple-card p-6 rounded-3xl flex flex-col justify-between group border-2 border-black dark:border-white transition-all">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black text-white dark:bg-white dark:text-black">
                50 MARKS // 120 MIN
              </span>
              <span className="text-xs text-neutral-400 font-medium">Mock Exam 3</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              End-Sem Theory Mock Exam
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Comprehensive paper covering Parts C, D, and E with step-by-step model answers and official marking scheme rubrics.
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/practice/mock-theory/"
              className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Take Theory Mock &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Lab Mock Exams & Formula Sheet Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <Link
          href="/practice/mock-mpi/"
          className="apple-card p-5 rounded-2xl hover:border-black/30 dark:hover:border-white/30 transition-all text-center"
        >
          <div className="text-xs font-bold uppercase mb-1">MOCK LAB 1: MPI</div>
          <div className="text-xs text-neutral-500">3 Programming Tasks (50 Marks) &rarr;</div>
        </Link>
        <Link
          href="/practice/mock-openmp/"
          className="apple-card p-5 rounded-2xl hover:border-black/30 dark:hover:border-white/30 transition-all text-center"
        >
          <div className="text-xs font-bold uppercase mb-1">MOCK LAB 2: OPENMP</div>
          <div className="text-xs text-neutral-500">3 Programming Tasks (50 Marks) &rarr;</div>
        </Link>
        <Link
          href="/practice/formulas/"
          className="apple-card p-5 rounded-2xl hover:border-black/30 dark:hover:border-white/30 transition-all text-center bg-black/5 dark:bg-white/5"
        >
          <div className="text-xs font-bold uppercase mb-1">COURSE FORMULA SHEET</div>
          <div className="text-xs text-neutral-500">Printable 1-Page Revision Sheet &rarr;</div>
        </Link>
      </div>

    </div>
  );
}
