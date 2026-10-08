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

      {/* Grid of 4 Apple Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: MPI Questions */}
        <div className="apple-card p-8 rounded-3xl flex flex-col justify-between group hover:border-blue-500/30 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                42 PROBLEMS
              </span>
              <span className="text-xs text-neutral-400 font-medium">MPI Track</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              MPI Solved Questions
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Conceptual queries, token passing output predictions, slide bugs, Trapezoidal rule fixes, and Cannon algorithm complexity equations.
            </p>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 pt-2">
              <div>&bull; 8 Conceptual short answers</div>
              <div>&bull; 8 Output predictions</div>
              <div>&bull; 8 Find-the-bug questions</div>
              <div>&bull; 10 Write-the-program tasks</div>
              <div>&bull; 8 Complexity & cost derivations</div>
            </div>
          </div>
          <div className="pt-8">
            <Link
              href="/practice/mpi/"
              className="w-full inline-flex items-center justify-center py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
            >
              View MPI Questions (42) &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: OpenMP Questions */}
        <div className="apple-card p-8 rounded-3xl flex flex-col justify-between group hover:border-indigo-500/30 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                42 PROBLEMS
              </span>
              <span className="text-xs text-neutral-400 font-medium">OpenMP Track</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              OpenMP Solved Questions
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Scoping rules, loop scheduling visual predictions, data race fixes, twin primes, first 8 perfect numbers, and false sharing elimination.
            </p>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1.5 pt-2">
              <div>&bull; 8 Conceptual short answers</div>
              <div>&bull; 8 Output predictions</div>
              <div>&bull; 8 Find-the-bug questions</div>
              <div>&bull; 10 Write-the-program tasks</div>
              <div>&bull; 8 Complexity & overhead analysis</div>
            </div>
          </div>
          <div className="pt-8">
            <Link
              href="/practice/openmp/"
              className="w-full inline-flex items-center justify-center py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
            >
              View OpenMP Questions (42) &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3: Mock Exam 1 (MPI) */}
        <div className="apple-card p-8 rounded-3xl flex flex-col justify-between group hover:border-black/20 dark:hover:border-white/20 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                50 MARKS // 90 MIN
              </span>
              <span className="text-xs text-neutral-400 font-medium">Mock Exam 1</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Mock Exam 1: MPI
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Timed simulation of an undergraduate MPI lab exam:
            </p>
            <ul className="text-xs space-y-2 text-neutral-600 dark:text-neutral-400 pt-2">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>1. Circular Token Ring (15 Marks)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>2. Trapezoidal Integration with Reduce (15 Marks)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>3. Parallel Odd-Even Transposition Sort (20 Marks)</span>
              </li>
            </ul>
          </div>
          <div className="pt-8">
            <Link
              href="/practice/mock-mpi/"
              className="w-full inline-flex items-center justify-center py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Take MPI Mock Exam &rarr;
            </Link>
          </div>
        </div>

        {/* Card 4: Mock Exam 2 (OpenMP) */}
        <div className="apple-card p-8 rounded-3xl flex flex-col justify-between group hover:border-black/20 dark:hover:border-white/20 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                50 MARKS // 90 MIN
              </span>
              <span className="text-xs text-neutral-400 font-medium">Mock Exam 2</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Mock Exam 2: OpenMP
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Timed simulation of an undergraduate OpenMP lab exam:
            </p>
            <ul className="text-xs space-y-2 text-neutral-600 dark:text-neutral-400 pt-2">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>1. Pi Estimation & False Sharing (15 Marks)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>2. Twin Primes Counter & Sum (15 Marks)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>3. Gaussian Elimination Row Elimination (20 Marks)</span>
              </li>
            </ul>
          </div>
          <div className="pt-8">
            <Link
              href="/practice/mock-openmp/"
              className="w-full inline-flex items-center justify-center py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Take OpenMP Mock Exam &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
