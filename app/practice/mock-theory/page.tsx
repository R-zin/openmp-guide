import React from 'react';
import { getTheoryMockExam } from '@/lib/content';
import { TheoryExamView } from '@/components/practice/TheoryExamView';

export const metadata = {
  title: 'CSS 311 Theory Mock Examination // Parallel and Distributed Computing',
  description: 'Comprehensive 50-mark, 120-minute end-semester theory mock examination covering Interconnection Networks, Vector Processors, and Performance Tools with full marking rubrics.',
};

export default function MockTheoryPage() {
  const exam = getTheoryMockExam();

  if (!exam) {
    return (
      <div className="max-w-[800px] mx-auto py-12 text-center font-mono">
        <h1 className="text-xl font-bold">Theory Mock Exam Not Found</h1>
      </div>
    );
  }

  return <TheoryExamView exam={exam} />;
}
