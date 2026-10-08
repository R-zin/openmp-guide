import React from 'react';
import { getMockExam } from '@/lib/content';
import { MockExamView } from '@/components/practice/MockExamView';

export const metadata = {
  title: 'Mock Exam 2: OpenMP // Parallel Programming Study Guide',
  description: 'Simulated 90-minute undergraduate OpenMP lab assessment covering Pi Estimation with False-Sharing, Twin Primes, and Gaussian Elimination.',
};

export default function MockOpenMpExamPage() {
  const exam = getMockExam('openmp');

  if (!exam) {
    return <div>Mock exam data not found.</div>;
  }

  return (
    <MockExamView
      exam={exam}
      nextExamHref="/practice/mock-mpi/"
      nextExamTitle="MOCK EXAM 1: MPI &rarr;"
    />
  );
}
