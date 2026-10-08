import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { TopicMeta, SolvedQuestion, MockExam, Flashcard } from './types';
import { SearchItem } from './search';
import { highlightCode } from './shiki';

export interface TopicDetail extends TopicMeta {
  content: string;
  renderedHtml?: string;
}

export function getAllMpiTopics(): TopicMeta[] {
  const dir = path.join(process.cwd(), 'content/mpi');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

  const topics = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data } = matter(raw);
    return {
      id: data.id || file.replace('.mdx', ''),
      slug: data.slug || file.replace('.mdx', ''),
      technology: 'mpi' as const,
      order: data.order || 99,
      title: data.title || file,
      description: data.description || '',
      readingTimeMinutes: data.readingTimeMinutes || 10,
      sections: data.sections || [],
    };
  });

  return topics.sort((a, b) => a.order - b.order);
}

export function getAllOpenMpTopics(): TopicMeta[] {
  const dir = path.join(process.cwd(), 'content/openmp');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

  const topics = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data } = matter(raw);
    return {
      id: data.id || file.replace('.mdx', ''),
      slug: data.slug || file.replace('.mdx', ''),
      technology: 'openmp' as const,
      order: data.order || 99,
      title: data.title || file,
      description: data.description || '',
      readingTimeMinutes: data.readingTimeMinutes || 10,
      sections: data.sections || [],
    };
  });

  return topics.sort((a, b) => a.order - b.order);
}

export async function getTopicBySlug(
  technology: 'mpi' | 'openmp',
  slug: string
): Promise<TopicDetail | null> {
  const filePath = path.join(process.cwd(), `content/${technology}/${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    id: data.id || slug,
    slug: data.slug || slug,
    technology,
    order: data.order || 1,
    title: data.title || slug,
    description: data.description || '',
    readingTimeMinutes: data.readingTimeMinutes || 10,
    sections: data.sections || [],
    content,
  };
}

export function getMpiQuestions(): SolvedQuestion[] {
  const filePath = path.join(process.cwd(), 'content/questions/mpi-questions.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getOpenMpQuestions(): SolvedQuestion[] {
  const filePath = path.join(process.cwd(), 'content/questions/openmp-questions.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getMockExam(technology: 'mpi' | 'openmp'): MockExam | null {
  const filePath = path.join(process.cwd(), `content/exams/${technology}-mock.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getFlashcards(): Flashcard[] {
  const filePath = path.join(process.cwd(), 'content/flashcards.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getSearchIndex(): SearchItem[] {
  const filePath = path.join(process.cwd(), 'content/search-index.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
