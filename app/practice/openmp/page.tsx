import React from 'react';
import { getOpenMpQuestions } from '@/lib/content';
import { QuestionListView } from '@/components/practice/QuestionListView';

export const metadata = {
  title: 'OpenMP Solved Questions (42) // Parallel Programming Study Guide',
  description: '42 solved OpenMP exam questions across conceptual short answer, output prediction, find-the-bug, write-the-program, and complexity analysis.',
};

export default function OpenMpPracticePage() {
  const allQuestions = getOpenMpQuestions();

  return (
    <QuestionListView
      technology="OPENMP"
      title="OPENMP SOLVED QUESTIONS"
      description="Comprehensive problem set covering shared memory scoping rules, thread scheduling, data race resolution, reduction trees, tasks, and false sharing. Click 'Show answer' on any card to view the step-by-step breakdown."
      questions={allQuestions}
      mockExamHref="/practice/mock-openmp/"
      mockExamLabel="TAKE OPENMP MOCK LAB EXAM"
    />
  );
}
