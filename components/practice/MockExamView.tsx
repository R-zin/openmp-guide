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
      <div className="border-2 border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#FFFFFF] dark:bg-[#000000]">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pb-2 border-b border-[#E5E5E5] dark:border-[#262626] mb-3">
          <span className="font-bold uppercase tracking-widest text-[#737373]">
            IIIT KOTTAYAM // LAB ASSESSMENT
          </span>
          <span className="px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] font-bold">
            TIME: {exam.durationMinutes} MIN // TOTAL: {exam.totalMarks} MARKS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#000000] dark:text-[#FFFFFF] mb-3">
          {exam.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3] font-mono leading-relaxed">
          Simulated undergraduate practical laboratory examination. Treat this as a closed-book examination: set a 90-minute timer and implement all 3 programming tasks independently before checking reference solutions.
        </p>

        {/* Instructions */}
        <div className="mt-4 pt-4 border-t border-[#E5E5E5] dark:border-[#262626] text-xs font-mono">
          <div className="font-bold text-[#000000] dark:text-[#FFFFFF] mb-2 uppercase tracking-wider">
            EXAMINATION INSTRUCTIONS:
          </div>
          <ul className="space-y-1 text-[#737373]">
            {exam.instructions.map((inst, idx) => (
              <li key={idx}>&bull; {inst}</li>
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
              className="border border-[#000000] dark:border-[#FFFFFF] p-6 bg-[#FFFFFF] dark:bg-[#000000] font-mono"
            >
              {/* Task Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold text-xs">
                    TASK {tIdx + 1}
                  </span>
                  <span className="font-bold text-sm text-[#000000] dark:text-[#FFFFFF]">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-[#737373]">
                  <span>{task.suggestedMinutes} MINS</span>
                  <span>&bull;</span>
                  <span className="font-bold text-[#000000] dark:text-[#FFFFFF]">
                    {task.marks} MARKS
                  </span>
                </div>
              </div>

              {/* Task Prompt */}
              <div className="text-sm font-sans text-[#000000] dark:text-[#E5E5E5] leading-relaxed mb-4">
                {task.description}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212]">
                  <div className="font-bold text-[#737373] uppercase mb-1">
                    INPUT SPECIFICATION:
                  </div>
                  <div>{task.inputSpecification}</div>
                </div>
                <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212]">
                  <div className="font-bold text-[#737373] uppercase mb-1">
                    OUTPUT SPECIFICATION:
                  </div>
                  <div>{task.outputSpecification}</div>
                </div>
              </div>

              {/* Sample Output */}
              <div className="mb-4">
                <div className="text-[11px] text-[#737373] uppercase mb-1 font-bold">
                  EXPECTED SAMPLE OUTPUT:
                </div>
                <pre className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212] text-xs text-[#000000] dark:text-[#FFFFFF] overflow-x-auto whitespace-pre-wrap">
                  {task.sampleOutput}
                </pre>
              </div>

              {/* Marking Scheme Rubric */}
              <div className="mb-6">
                <div className="text-[11px] text-[#737373] uppercase mb-1 font-bold">
                  MARKING SCHEME RUBRIC ({task.marks} MARKS TOTAL):
                </div>
                <div className="border border-[#E5E5E5] dark:border-[#262626] divide-y divide-[#E5E5E5] dark:divide-[#262626] text-xs">
                  {task.rubric.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-2 flex justify-between items-center"
                    >
                      <span>{r.criterion}</span>
                      <span className="font-bold ml-4 shrink-0">
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
                  className="w-full sm:w-auto px-4 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#F5F5F5] dark:bg-[#141414] hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  {isOpen ? '[-] HIDE REFERENCE SOLUTION' : '[+] SHOW REFERENCE SOLUTION'}
                </button>
              </div>

              {/* Collapsible Reference Solution */}
              {isOpen && (
                <div className="mt-6 pt-4 border-t border-[#000000] dark:border-[#FFFFFF] space-y-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
                    VERIFIED REFERENCE IMPLEMENTATION:
                  </div>

                  <CodeBlock
                    code={task.referenceCode}
                    language="c"
                    compileCmd={task.compileCommand}
                    runCmd={task.runCommand}
                  />

                  <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212] text-xs leading-relaxed">
                    <span className="font-bold text-[#000000] dark:text-[#FFFFFF] mr-2">
                      TECHNICAL EXPLANATION:
                    </span>
                    <span className="text-[#737373] dark:text-[#A3A3A3] font-sans">
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
      <div className="pt-6 border-t border-[#E5E5E5] dark:border-[#262626] flex justify-between font-mono text-xs">
        <Link
          href="/practice/"
          className="text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF]"
        >
          &larr; BACK TO PRACTICE HUB
        </Link>
        {nextExamHref && (
          <Link
            href={nextExamHref}
            className="px-4 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold uppercase tracking-wider"
          >
            {nextExamTitle || 'NEXT MOCK EXAM &rarr;'}
          </Link>
        )}
      </div>
    </div>
  );
}
