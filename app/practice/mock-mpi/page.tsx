import React from 'react';
import { getMockExam } from '@/lib/content';
import { MockExamView } from '@/components/practice/MockExamView';

export const metadata = {
  title: 'Mock Exam 1: MPI // Parallel Programming Study Guide',
  description: 'Simulated 90-minute undergraduate MPI lab assessment covering Token Ring, Trapezoidal Rule, and Odd-Even Transposition Sort.',
};

export default function MockMpiExamPage() {
  const exam = getMockExam('mpi');

  if (!exam) {
    return <div>Mock exam data not found.</div>;
  }

  return (
    <MockExamView
      exam={exam}
      nextExamHref="/practice/mock-openmp/"
      nextExamTitle="MOCK EXAM 2: OPENMP &rarr;"
    />
  );
}
