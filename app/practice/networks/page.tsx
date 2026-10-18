import React from 'react';
import { getNetworksQuestions } from '@/lib/content';
import { QuestionListView } from '@/components/practice/QuestionListView';

export const metadata = {
  title: 'Interconnection Networks Solved Questions (25) // Study Guide',
  description: '25 solved exam questions for interconnection networks covering graph metrics, E-cube routing, and Gray code embedding.',
};

export default function NetworksPracticePage() {
  const allQuestions = getNetworksQuestions();

  return (
    <QuestionListView
      technology="NETWORKS"
      title="INTERCONNECTION NETWORKS SOLVED QUESTIONS"
      description="25 exam-style questions covering Diameter, Bisection Width, Node Degree, Network Cost, E-Cube Hypercube Routing, and Reflected Gray Code embeddings. Click 'Show answer' on any card to view full step-by-step mathematical solutions."
      questions={allQuestions}
      mockExamHref="/practice/mock-theory/"
      mockExamLabel="TAKE THEORY MOCK EXAM"
    />
  );
}
