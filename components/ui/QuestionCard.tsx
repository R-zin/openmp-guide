'use client';

import React, { useState } from 'react';
import { SolvedQuestion } from '@/lib/types';
import { CodeBlock } from './CodeBlock';

interface QuestionCardProps {
  question: SolvedQuestion;
  index: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'conceptual':
        return 'CONCEPTUAL';
      case 'output-prediction':
        return 'OUTPUT PREDICTION';
      case 'find-the-bug':
        return 'FIND THE BUG';
      case 'write-the-program':
        return 'WRITE THE PROGRAM';
      case 'complexity-analysis':
        return 'COMPLEXITY ANALYSIS';
      default:
        return category.toUpperCase();
    }
  };

  return (
    <div
      id={`q-${question.id}`}
      className="my-6 border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000] p-5"
    >
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]">
            Q{index}
          </span>
          <span className="font-mono text-xs text-[#737373] uppercase tracking-wider">
            [{getCategoryLabel(question.category)}]
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#737373] uppercase">
          TOPIC: {question.topicRef}
        </span>
      </div>

      {/* Question Prompt */}
      <h3 className="text-base font-bold text-[#000000] dark:text-[#FFFFFF] mb-2 font-mono">
        {question.title}
      </h3>
      <p className="text-sm text-[#000000] dark:text-[#E5E5E5] whitespace-pre-line leading-relaxed mb-4">
        {question.prompt}
      </p>

      {/* Given Code Snippet if any */}
      {question.code && (
        <div className="mb-4">
          <div className="text-[11px] font-mono text-[#737373] uppercase mb-1">
            GIVEN CODE:
          </div>
          <CodeBlock code={question.code} language="c" />
        </div>
      )}

      {/* Answer Toggle Button */}
      <div className="pt-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-auto px-4 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#F5F5F5] dark:bg-[#121212] hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] text-xs font-mono font-bold tracking-widest uppercase transition-colors flex items-center justify-between sm:justify-start sm:space-x-3"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? '[-] HIDE ANSWER' : '[+] SHOW ANSWER'}</span>
          <span className="text-[#737373] text-[10px] font-normal">
            {isOpen ? '(CLICK TO COLLAPSE)' : '(STEP-BY-STEP SOLUTION)'}
          </span>
        </button>
      </div>

      {/* Collapsible Solution Block */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[#E5E5E5] dark:border-[#262626] space-y-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF] mb-2">
              STEP-BY-STEP SOLUTION:
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#000000] dark:text-[#E5E5E5] leading-relaxed">
              {question.solutionSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {question.expectedOutput && (
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF] mb-1">
                EXPECTED OUTPUT:
              </div>
              <pre className="p-3 bg-[#F5F5F5] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#262626] text-xs font-mono text-[#000000] dark:text-[#FFFFFF] overflow-x-auto whitespace-pre-wrap">
                {question.expectedOutput}
              </pre>
            </div>
          )}

          {question.correctCode && (
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF] mb-1">
                CORRECTED / REFERENCE IMPLEMENTATION:
              </div>
              <CodeBlock code={question.correctCode} language="c" />
            </div>
          )}

          {question.watchOutTip && (
            <div className="p-3 border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] text-xs font-mono leading-relaxed">
              <span className="font-bold text-[#000000] dark:text-[#FFFFFF] mr-2">
                [!] EXAM WATCH OUT:
              </span>
              <span className="text-[#737373] dark:text-[#A3A3A3]">
                {question.watchOutTip}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
