import React from 'react';
import { getVectorsQuestions } from '@/lib/content';
import { QuestionListView } from '@/components/practice/QuestionListView';

export const metadata = {
  title: 'Vector Processors Solved Questions (25) // Study Guide',
  description: '25 solved exam questions for vector processing covering pipelining derivations, VMIPS registers, strip-mining, and memory interleaving.',
};

export default function VectorsPracticePage() {
  const allQuestions = getVectorsQuestions();

  return (
    <QuestionListView
      technology="VECTORS"
      title="VECTOR PROCESSORS SOLVED QUESTIONS"
      description="25 exam-style questions covering Arithmetic Pipelining Speedup (k + n - 1), VMIPS vector registers, strip-mining algorithm, memory bank conflicts, and GCC SIMD vectorisation. Click 'Show answer' to inspect the step-by-step solutions."
      questions={allQuestions}
      mockExamHref="/practice/mock-theory/"
      mockExamLabel="TAKE THEORY MOCK EXAM"
    />
  );
}
