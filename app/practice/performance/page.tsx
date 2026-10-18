import React from 'react';
import { getPerformanceQuestions } from '@/lib/content';
import { QuestionListView } from '@/components/practice/QuestionListView';

export const metadata = {
  title: 'Performance Tools Solved Questions (25) // Study Guide',
  description: '25 solved exam questions for Unit V Performance Tools covering Amdahl, Gustafson, Karp-Flatt, Score-P, Scalasca, and bottleneck diagnosis.',
};

export default function PerformancePracticePage() {
  const allQuestions = getPerformanceQuestions();

  return (
    <QuestionListView
      technology="PERFORMANCE"
      title="PERFORMANCE TOOLS SOLVED QUESTIONS"
      description="25 exam-style questions covering Amdahl's Law (strong scaling), Gustafson's Law (weak scaling), the Karp-Flatt metric, sampling vs instrumentation, Score-P CUBE profiling, Scalasca wait-state analysis, and Energy-Delay Product (EDP)."
      questions={allQuestions}
      mockExamHref="/practice/mock-theory/"
      mockExamLabel="TAKE THEORY MOCK EXAM"
    />
  );
}
