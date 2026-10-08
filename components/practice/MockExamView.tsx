'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MockExam } from '@/lib/types';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface MockExamViewProps {
  exam: MockExam;
  nextExamHref?: string;
  nextExamTitle?: string;
}

export function MockExamView({ exam, nextExamHref, nextExamTitle }: MockExamViewProps) {
  const [openSolutions, setOpenSolutions] = useState<{ [key: string]: boolean }>({});

  const toggleSolution = (taskId: string) => {
    setOpenSolutions((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="max-w-[860px] mx-auto space-y-10 font-sans">
      {/* Exam Header */}
      <div className="apple-card p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
            IIIT KOTTAYAM // LAB ASSESSMENT
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            ⏱ {exam.durationMinutes} MIN // {exam.totalMarks} MARKS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
          {exam.title}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Simulated undergraduate practical laboratory examination. Treat this as a closed-book examination: set a 90-minute timer and implement all 3 programming tasks independently before checking reference solutions.
        </p>

        {/* Instructions */}
        <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-xs">
          <div className="font-semibold text-neutral-900 dark:text-white mb-2 uppercase tracking-wider">
            Instructions:
          </div>
          <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
            {exam.instructions.map((inst, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-8">
        {exam.tasks.map((task, tIdx) => {
          const isOpen = !!openSolutions[task.id];

          return (
            <div
              key={task.id}
              className="apple-card p-6 sm:p-8 rounded-2xl"
            >
              {/* Task Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center space-x-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs">
                    TASK {tIdx + 1}
                  </span>
                  <span className="font-semibold text-base sm:text-lg text-neutral-900 dark:text-white">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-neutral-400">{task.suggestedMinutes} MINS</span>
                  <span className="text-neutral-300 dark:text-neutral-700">&bull;</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {task.marks} MARKS
                  </span>
                </div>
              </div>

              {/* Task Prompt */}
              <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-5">
                {task.description}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-xs">
                <div className="p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03]">
                  <div className="font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Input Specification:
                  </div>
                  <div className="text-neutral-800 dark:text-neutral-200">{task.inputSpecification}</div>
                </div>
                <div className="p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03]">
                  <div className="font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Output Specification:
                  </div>
                  <div className="text-neutral-800 dark:text-neutral-200">{task.outputSpecification}</div>
                </div>
              </div>

              {/* Sample Output */}
              <div className="mb-5">
                <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1.5 font-semibold">
                  Expected Sample Output:
                </div>
                <pre className="p-3.5 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-neutral-100 dark:bg-neutral-900 text-xs font-mono text-neutral-900 dark:text-white overflow-x-auto whitespace-pre-wrap">
                  {task.sampleOutput}
                </pre>
              </div>

              {/* Marking Scheme Rubric */}
              <div className="mb-6">
                <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-2 font-semibold">
                  Marking Scheme Rubric ({task.marks} Marks Total):
                </div>
                <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] divide-y divide-black/[0.06] dark:divide-white/[0.08] text-xs">
                  {task.rubric.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3 flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.02]"
                    >
                      <span className="text-neutral-700 dark:text-neutral-300">{r.criterion}</span>
                      <span className="font-semibold text-neutral-900 dark:text-white ml-4 shrink-0">
                        {r.marks} Marks
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution Toggle */}
              <div>
                <button
                  onClick={() => toggleSolution(task.id)}
                  className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-xs font-semibold tracking-wide transition-all shadow-sm"
                >
                  {isOpen ? 'Hide Reference Solution' : 'View Verified Reference Solution'}
                </button>
              </div>

              {/* Collapsible Reference Solution */}
              {isOpen && (
                <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] space-y-4 animate-in fade-in duration-200">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Verified Reference Implementation:
                  </div>

                  <CodeBlock
                    code={task.referenceCode}
                    language="c"
                    compileCmd={task.compileCommand}
                    runCmd={task.runCommand}
                  />

                  <div className="p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] text-xs leading-relaxed">
                    <span className="font-semibold text-neutral-900 dark:text-white mr-2">
                      Technical Explanation:
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {task.explanation}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-between text-xs">
        <Link
          href="/practice/"
          className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          &larr; Back to Practice Hub
        </Link>
        {nextExamHref && (
          <Link
            href={nextExamHref}
            className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold transition-all shadow-sm"
          >
            {nextExamTitle || 'Next Mock Exam &rarr;'}
          </Link>
        )}
      </div>
    </div>
  );
}
