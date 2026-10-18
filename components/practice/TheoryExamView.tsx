'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TheoryExam } from '@/lib/types';

interface TheoryExamViewProps {
  exam: TheoryExam;
}

export function TheoryExamView({ exam }: TheoryExamViewProps) {
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});

  const toggleSolution = (id: string) => {
    setOpenSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAll = () => {
    const allOpen = Object.values(openSolutions).every(Boolean);
    const updated: Record<string, boolean> = {};
    exam.sections.forEach((s) => {
      s.questions.forEach((q) => {
        updated[q.id] = !allOpen;
      });
    });
    setOpenSolutions(updated);
  };

  return (
    <div className="max-w-[880px] mx-auto space-y-8 font-sans py-4">
      {/* Header */}
      <div className="border border-black dark:border-white p-6 bg-white dark:bg-black font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black dark:border-white pb-3">
          <span className="text-[10px] tracking-widest uppercase opacity-70">
            CSS 311 // THEORY EXAMINATION
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span>TOTAL MARKS: <strong>{exam.totalMarks}</strong></span>
            <span>TIME: <strong>{exam.durationMinutes} MINS</strong></span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mt-3 mb-2">
          {exam.title}
        </h1>
        <p className="text-xs opacity-75 mb-4">
          Covering Part C (Interconnection Networks), Part D (Vector Processors), and Part E (Performance Tools & Analysis). Designed to mirror the end-semester CSS 311 theory examination format.
        </p>

        {/* Instructions */}
        <div className="border-t border-black/20 dark:border-white/20 pt-3 text-xs space-y-1">
          <strong className="block uppercase text-[10px] tracking-wider">Instructions to Candidates:</strong>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            {exam.instructions.map((inst: string, idx: number) => (
              <li key={idx}>{inst}</li>
            ))}
          </ul>
        </div>

        {/* Global Controls */}
        <div className="mt-4 pt-3 border-t border-black/20 dark:border-white/20 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={toggleAll}
            className="px-3 py-1.5 border border-black dark:border-white text-xs font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            TOGGLE ALL MODEL SOLUTIONS
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black text-xs font-bold print-hide"
          >
            PRINT EXAM PAPER (PDF)
          </button>
        </div>
      </div>

      {/* Sections and Questions */}
      <div className="space-y-8">
        {exam.sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <div className="border-b-2 border-black dark:border-white pb-2">
              <h2 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                {section.title}
              </h2>
              <p className="text-xs font-mono opacity-70">
                {section.description}
              </p>
            </div>

            <div className="space-y-4">
              {section.questions.map((q) => {
                const isOpen = !!openSolutions[q.id];

                return (
                  <div
                    key={q.id}
                    className="border border-black dark:border-white p-5 bg-white dark:bg-black font-mono space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          QUESTION {q.number} // [{q.marks} MARKS]
                        </span>
                        <p className="text-sm font-sans font-semibold text-neutral-900 dark:text-white leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-xs font-bold border border-black dark:border-white whitespace-nowrap">
                        {q.marks} Marks
                      </span>
                    </div>

                    {/* Toggle Solution Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleSolution(q.id)}
                        className="px-3 py-1 text-xs border border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white text-neutral-800 dark:text-neutral-200 font-bold transition-colors print-hide"
                      >
                        {isOpen ? '▲ HIDE MODEL SOLUTION & RUBRIC' : '▼ SHOW MODEL SOLUTION & RUBRIC'}
                      </button>
                    </div>

                    {/* Collapsible Model Solution */}
                    {isOpen && (
                      <div className="pt-4 border-t border-black/20 dark:border-white/20 space-y-4 text-xs font-mono bg-black/[0.02] dark:bg-white/[0.02] p-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70 mb-2">
                            STEP-BY-STEP MODEL ANSWER:
                          </span>
                          <div className="space-y-1.5 text-xs font-sans leading-relaxed text-neutral-900 dark:text-neutral-100">
                            {q.solution.map((step: string, stepIdx: number) => (
                              <p key={stepIdx} className="pl-3 border-l-2 border-black/30 dark:border-white/30 font-mono text-[11px]">
                                {step}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Marking Scheme Rubric */}
                        <div className="border-t border-black/10 dark:border-white/10 pt-3">
                          <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70 mb-2">
                            OFFICIAL MARKING SCHEME & RUBRIC:
                          </span>
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-black/20 dark:border-white/20 text-[10px] uppercase opacity-70">
                                <th className="py-1">Grading Criterion</th>
                                <th className="py-1 text-right">Marks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {q.markingRubric.map((r, rIdx) => (
                                <tr key={rIdx} className="border-b border-black/10 dark:border-white/10 text-[11px]">
                                  <td className="py-1">{r.criterion}</td>
                                  <td className="py-1 text-right font-bold">{r.marks}m</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Nav */}
      <div className="border-t border-black/20 dark:border-white/20 pt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs print-hide">
        <Link
          href="/practice/"
          className="hover:underline underline-offset-4"
        >
          &larr; Back to Practice Hub
        </Link>
        <Link
          href="/practice/formulas/"
          className="px-4 py-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-bold transition-colors"
        >
          VIEW PRINTABLE FORMULA SHEET &rarr;
        </Link>
      </div>
    </div>
  );
}
