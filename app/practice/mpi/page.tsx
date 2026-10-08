import React from 'react';
import { getMpiQuestions } from '@/lib/content';
import { QuestionListView } from '@/components/practice/QuestionListView';

export const metadata = {
  title: 'MPI Solved Questions (42) // Parallel Programming Study Guide',
  description: '42 solved MPI exam questions across conceptual short answer, output prediction, find-the-bug, write-the-program, and complexity analysis.',
};

export default function MpiPracticePage() {
  const allQuestions = getMpiQuestions();

  return (
    <QuestionListView
      technology="MPI"
      title="MPI SOLVED QUESTIONS"
      description="Comprehensive problem set covering distributed memory concepts, buffer protocol deadlocks, collective rules, Cannon matrix multiplication, and graph searches. Click 'Show answer' on any card to view the step-by-step breakdown."
      questions={allQuestions}
      mockExamHref="/practice/mock-mpi/"
      mockExamLabel="TAKE MPI MOCK LAB EXAM"
    />
  );
}
