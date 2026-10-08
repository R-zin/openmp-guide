'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SolvedQuestion, QuestionCategory } from '@/lib/types';
import { QuestionCard } from '@/components/ui/QuestionCard';

interface QuestionListViewProps {
  technology: 'MPI' | 'OPENMP';
  title: string;
  description: string;
  questions: SolvedQuestion[];
  mockExamHref: string;
  mockExamLabel: string;
}

export function QuestionListView({
  technology,
  title,
  description,
  questions,
  mockExamHref,
  mockExamLabel,
}: QuestionListViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Problems', count: questions.length },
    { id: 'conceptual', label: 'Conceptual', count: questions.filter((q) => q.category === 'conceptual').length },
    { id: 'output-prediction', label: 'Output Traces', count: questions.filter((q) => q.category === 'output-prediction').length },
    { id: 'find-the-bug', label: 'Find Bug', count: questions.filter((q) => q.category === 'find-the-bug').length },
    { id: 'write-the-program', label: 'Write Code', count: questions.filter((q) => q.category === 'write-the-program').length },
    { id: 'complexity-analysis', label: 'Complexity', count: questions.filter((q) => q.category === 'complexity-analysis').length },
  ];

  const filteredQuestions =
    selectedCategory === 'all'
      ? questions
      : questions.filter((q) => q.category === (selectedCategory as QuestionCategory));

  return (
    <div className="max-w-[860px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
          <Link href="/practice/" className="hover:text-black dark:hover:text-white transition-colors">
            Practice
          </Link>
          <span>/</span>
          <span>{technology} Exam Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
          {title} ({questions.length})
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Apple-Style Pill Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
            }`}
          >
            <span>{cat.label}</span>{' '}
            <span className="text-[10px] opacity-60 ml-1">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index + 1}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-between text-xs">
        <Link
          href="/practice/"
          className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
        >
          &larr; Back to Practice Hub
        </Link>
        <Link
          href={mockExamHref}
          className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold transition-all shadow-sm"
        >
          {mockExamLabel} &rarr;
        </Link>
      </div>
    </div>
  );
}
