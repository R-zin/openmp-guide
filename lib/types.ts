export type Technology = 'mpi' | 'openmp' | 'networks' | 'vectors' | 'performance';

export interface TocSection {
  id: string;
  title: string;
  level: number;
}

export interface TopicMeta {
  id: string;
  slug: string;
  technology: Technology;
  order: number;
  title: string;
  description: string;
  readingTimeMinutes: number;
  sections: TocSection[];
}

export type QuestionCategory = 
  | 'conceptual' 
  | 'numeric-calculation'
  | 'output-prediction' 
  | 'find-the-bug' 
  | 'write-the-program' 
  | 'compare-and-contrast'
  | 'complexity-analysis';

export interface SolvedQuestion {
  id: string;
  technology: Technology;
  topicRef: string;
  category: QuestionCategory;
  title: string;
  prompt: string;
  code?: string;
  bugLine?: number;
  solutionSteps: string[];
  expectedOutput?: string;
  correctCode?: string;
  watchOutTip?: string;
}

export interface Flashcard {
  id: string;
  technology: Technology | 'general';
  category: string;
  front: string;
  back: string;
  codeSnippet?: string;
}

export interface MockExamTask {
  id: string;
  title: string;
  marks: number;
  suggestedMinutes: number;
  description: string;
  inputSpecification: string;
  outputSpecification: string;
  sampleInput?: string;
  sampleOutput: string;
  rubric: { criterion: string; marks: number }[];
  referenceCode: string;
  compileCommand: string;
  runCommand: string;
  explanation: string;
}

export interface MockExam {
  id: string;
  technology: Technology;
  title: string;
  totalMarks: number;
  durationMinutes: number;
  instructions: string[];
  tasks: MockExamTask[];
}

export interface TheoryQuestion {
  id: string;
  number: string;
  part: 'Part C: Interconnection Networks' | 'Part D: Vector Processors' | 'Part E: Performance Tools';
  marks: number;
  question: string;
  solution: string[];
  markingRubric: { criterion: string; marks: number }[];
}

export interface TheoryExam {
  id: string;
  title: string;
  totalMarks: number;
  durationMinutes: number;
  instructions: string[];
  sections: {
    title: string;
    description: string;
    questions: TheoryQuestion[];
  }[];
}

