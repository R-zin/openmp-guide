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
    { id: 'all', label: 'ALL QUESTIONS', count: questions.length },
    { id: 'conceptual', label: 'CONCEPTUAL', count: questions.filter((q) => q.category === 'conceptual').length },
    { id: 'output-prediction', label: 'OUTPUT PREDICTION', count: questions.filter((q) => q.category === 'output-prediction').length },
    { id: 'find-the-bug', label: 'FIND THE BUG', count: questions.filter((q) => q.category === 'find-the-bug').length },
    { id: 'write-the-program', label: 'WRITE THE PROGRAM', count: questions.filter((q) => q.category === 'write-the-program').length },
    { id: 'complexity-analysis', label: 'COMPLEXITY', count: questions.filter((q) => q.category === 'complexity-analysis').length },
  ];

  const filteredQuestions =
    selectedCategory === 'all'
      ? questions
      : questions.filter((q) => q.category === (selectedCategory as QuestionCategory));

  return (
    <div className="max-w-[860px] mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#000000] dark:border-[#FFFFFF] pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-[#737373] mb-2">
          <Link href="/practice/" className="hover:underline">
            PRACTICE
          </Link>
          <span>/</span>
          <span>{technology} QUESTIONS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#000000] dark:text-[#FFFFFF] mb-3">
          {title} ({questions.length})
        </h1>
        <p className="text-sm sm:text-base text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 border transition-colors ${
              selectedCategory === cat.id
                ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                : 'border-[#E5E5E5] dark:border-[#262626] text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <span>{cat.label}</span>{' '}
            <span className="text-[10px] opacity-70">({cat.count})</span>
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
      <div className="pt-6 border-t border-[#E5E5E5] dark:border-[#262626] flex justify-between font-mono text-xs">
        <Link
          href="/practice/"
          className="text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF]"
        >
          &larr; BACK TO PRACTICE HUB
        </Link>
        <Link
          href={mockExamHref}
          className="px-4 py-2 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold uppercase tracking-wider"
        >
          {mockExamLabel} &rarr;
        </Link>
      </div>
    </div>
  );
}
