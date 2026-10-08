import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Practice & Mock Exams // Parallel Programming Study Guide',
  description: '80+ solved exam questions across conceptual, output prediction, find-the-bug, write-the-program, and complexity analysis, plus 2 mock lab exams.',
};

export default function PracticeHubPage() {
  return (
    <div className="max-w-[860px] mx-auto space-y-10 font-sans">
      {/* Header */}
      <div className="border-b border-[#000000] dark:border-[#FFFFFF] pb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#737373] mb-2">
          PART C // LAB EXAM DRILLS & MOCKS
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#000000] dark:text-[#FFFFFF] mb-3">
          SOLVED QUESTIONS & MOCK LAB EXAMS
        </h1>
        <p className="text-sm sm:text-base text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
          Over 80+ curated questions drawn directly from lecture slides, PDC lab problem sets, and past examination papers. Grouped into five distinct categories with collapsible step-by-step solutions and expected outputs.
        </p>
      </div>

      {/* Grid of 4 Practice Portals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card 1: MPI Questions */}
        <div className="border-2 border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#FFFFFF] dark:bg-[#000000] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs font-mono pb-2 border-b border-[#E5E5E5] dark:border-[#262626] mb-3">
              <span className="font-bold uppercase tracking-widest">42 PROBLEMS</span>
              <span className="text-[#737373]">MPI</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mb-2">
              MPI SOLVED QUESTIONS
            </h2>
            <p className="text-sm text-[#737373] dark:text-[#8C8C8C] leading-relaxed mb-4">
              Conceptual queries, token passing output predictions, slide bugs, Trapezoidal rule fixes, and Cannon algorithm complexity equations.
            </p>
            <div className="text-xs font-mono text-[#737373] space-y-1 mb-6">
              <div>&bull; 8 Conceptual short answers</div>
              <div>&bull; 8 Output predictions</div>
              <div>&bull; 8 Find-the-bug questions</div>
              <div>&bull; 10 Write-the-program tasks</div>
              <div>&bull; 8 Complexity & cost derivations</div>
            </div>
          </div>
          <Link
            href="/practice/mpi/"
            className="w-full py-2.5 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] text-center font-mono text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
          >
            VIEW MPI QUESTIONS (42) &rarr;
          </Link>
        </div>

        {/* Card 2: OpenMP Questions */}
        <div className="border-2 border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#FFFFFF] dark:bg-[#000000] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs font-mono pb-2 border-b border-[#E5E5E5] dark:border-[#262626] mb-3">
              <span className="font-bold uppercase tracking-widest">42 PROBLEMS</span>
              <span className="text-[#737373]">OPENMP</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mb-2">
              OPENMP SOLVED QUESTIONS
            </h2>
            <p className="text-sm text-[#737373] dark:text-[#8C8C8C] leading-relaxed mb-4">
              Scoping rules, loop scheduling visual predictions, data race fixes, twin primes, first 8 perfect numbers, and false sharing elimination.
            </p>
            <div className="text-xs font-mono text-[#737373] space-y-1 mb-6">
              <div>&bull; 8 Conceptual short answers</div>
              <div>&bull; 8 Output predictions</div>
              <div>&bull; 8 Find-the-bug questions</div>
              <div>&bull; 10 Write-the-program tasks</div>
              <div>&bull; 8 Complexity & overhead analysis</div>
            </div>
          </div>
          <Link
            href="/practice/openmp/"
            className="w-full py-2.5 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] text-center font-mono text-xs font-bold uppercase tracking-widest hover:opacity-85 transition-opacity"
          >
            VIEW OPENMP QUESTIONS (42) &rarr;
          </Link>
        </div>

        {/* Card 3: Mock Exam 1 (MPI) */}
        <div className="border border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#F5F5F5] dark:bg-[#101010] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs font-mono pb-2 border-b border-[#E5E5E5] dark:border-[#262626] mb-3">
              <span className="font-bold uppercase tracking-widest">50 MARKS // 90 MIN</span>
              <span className="text-[#737373]">MOCK LAB EXAM</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mb-2">
              MOCK EXAM 1: MPI
            </h2>
            <p className="text-sm text-[#737373] dark:text-[#8C8C8C] leading-relaxed mb-4">
              Timed simulation of an undergraduate MPI lab exam:
            </p>
            <ul className="text-xs font-mono space-y-1.5 text-[#737373] mb-6">
              <li>1. Circular Token Ring (15 Marks)</li>
              <li>2. Trapezoidal Integration with Reduce (15 Marks)</li>
              <li>3. Parallel Odd-Even Transposition Sort (20 Marks)</li>
            </ul>
          </div>
          <Link
            href="/practice/mock-mpi/"
            className="w-full py-2.5 border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] text-center font-mono text-xs font-bold uppercase tracking-widest transition-colors"
          >
            TAKE MPI MOCK EXAM &rarr;
          </Link>
        </div>

        {/* Card 4: Mock Exam 2 (OpenMP) */}
        <div className="border border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#F5F5F5] dark:bg-[#101010] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs font-mono pb-2 border-b border-[#E5E5E5] dark:border-[#262626] mb-3">
              <span className="font-bold uppercase tracking-widest">50 MARKS // 90 MIN</span>
              <span className="text-[#737373]">MOCK LAB EXAM</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mb-2">
              MOCK EXAM 2: OPENMP
            </h2>
            <p className="text-sm text-[#737373] dark:text-[#8C8C8C] leading-relaxed mb-4">
              Timed simulation of an undergraduate OpenMP lab exam:
            </p>
            <ul className="text-xs font-mono space-y-1.5 text-[#737373] mb-6">
              <li>1. Pi Estimation & False Sharing (15 Marks)</li>
              <li>2. Twin Primes Counter & Sum (15 Marks)</li>
              <li>3. Gaussian Elimination Row Elimination (20 Marks)</li>
            </ul>
          </div>
          <Link
            href="/practice/mock-openmp/"
            className="w-full py-2.5 border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] text-center font-mono text-xs font-bold uppercase tracking-widest transition-colors"
          >
            TAKE OPENMP MOCK EXAM &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
