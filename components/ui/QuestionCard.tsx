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

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'conceptual':
        return { label: 'Conceptual', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'output-prediction':
        return { label: 'Output Prediction', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
      case 'find-the-bug':
        return { label: 'Find The Bug', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'write-the-program':
        return { label: 'Write Code', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
      case 'complexity-analysis':
        return { label: 'Complexity', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' };
      default:
        return { label: category, color: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20' };
    }
  };

  const badge = getCategoryBadge(question.category);

  return (
    <div
      id={`q-${question.id}`}
      className="apple-card p-6 my-6 rounded-2xl"
    >
      {/* Question Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center space-x-2.5">
          <span className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center justify-center">
            {index}
          </span>
          <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
          Topic: {question.topicRef}
        </span>
      </div>

      {/* Question Prompt */}
      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-2 tracking-tight">
        {question.title}
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line leading-relaxed mb-4">
        {question.prompt}
      </p>

      {/* Given Code Snippet if any */}
      {question.code && (
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            Given Code Snippet:
          </div>
          <CodeBlock code={question.code} language="c" />
        </div>
      )}

      {/* Answer Toggle Button */}
      <div className="pt-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all border border-black/[0.04] dark:border-white/[0.06]"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'Hide Solution' : 'Show Verified Solution'}</span>
          <span className="text-neutral-400 font-normal">
            {isOpen ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {/* Collapsible Solution Block */}
      {isOpen && (
        <div className="mt-5 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] space-y-4 animate-in fade-in duration-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
              Step-by-Step Breakdown:
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {question.solutionSteps.map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {question.expectedOutput && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5">
                Expected Output:
              </div>
              <pre className="p-3.5 bg-neutral-100 dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.08] rounded-xl text-xs font-mono text-neutral-900 dark:text-white overflow-x-auto whitespace-pre-wrap">
                {question.expectedOutput}
              </pre>
            </div>
          )}

          {question.correctCode && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1.5">
                Corrected Reference Implementation:
              </div>
              <CodeBlock code={question.correctCode} language="c" />
            </div>
          )}

          {question.watchOutTip && (
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start space-x-2">
              <span className="text-base">⚠️</span>
              <div>
                <span className="font-semibold mr-1">Exam Watch Out:</span>
                <span>{question.watchOutTip}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
