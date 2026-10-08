import React from 'react';
import { notFound } from 'next/navigation';
import { getAllOpenMpTopics, getTopicBySlug } from '@/lib/content';
import { TableOfContents } from '@/components/layout/TableOfContents';
import { PageNavigation } from '@/components/layout/PageNavigation';
import { MarkCompleteButton } from '@/components/ui/MarkCompleteButton';
import { MdxRenderer } from '@/components/content/MdxRenderer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const topics = getAllOpenMpTopics();
  return topics.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug('openmp', slug);
  if (!topic) return { title: 'Topic Not Found' };
  return {
    title: `${topic.title} // OpenMP Study Guide`,
    description: topic.description,
  };
}

export default async function OpenMpTopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = await getTopicBySlug('openmp', slug);

  if (!topic) {
    notFound();
  }

  const allTopics = getAllOpenMpTopics();
  const currentIndex = allTopics.findIndex((t) => t.slug === slug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  return (
    <div className="flex justify-between gap-10">
      {/* Main Topic Content Container (max-width ~760px) */}
      <article className="w-full max-w-[760px] min-w-0 font-sans">
        {/* Header Breadcrumbs & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E5E5] dark:border-[#262626] font-mono text-xs">
          <div className="flex items-center space-x-2 text-[#737373]">
            <span>PART B: OPENMP</span>
            <span>/</span>
            <span className="font-bold text-[#000000] dark:text-[#FFFFFF] uppercase">
              TOPIC {String(topic.order).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[#737373]">
              {topic.readingTimeMinutes} MIN READ
            </span>
            <MarkCompleteButton slug={`openmp/${topic.slug}`} />
          </div>
        </div>

        {/* Title & Description */}
        <header className="my-6">
          <h1 className="text-2xl sm:text-4xl font-bold font-mono tracking-tight text-[#000000] dark:text-[#FFFFFF] mb-3 leading-tight">
            {topic.title}
          </h1>
          <p className="text-base text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
            {topic.description}
          </p>
        </header>

        {/* MDX Rendered Body */}
        <div className="prose-monochrome">
          <MdxRenderer content={topic.content} />
        </div>

        {/* Previous / Next Navigation */}
        <PageNavigation
          prev={
            prevTopic
              ? {
                  href: `/openmp/${prevTopic.slug}/`,
                  title: `${String(prevTopic.order).padStart(2, '0')}. ${prevTopic.title}`,
                }
              : {
                  href: '/mpi/',
                  title: 'PART A: MPI (DISTRIBUTED MEMORY)',
                }
          }
          next={
            nextTopic
              ? {
                  href: `/openmp/${nextTopic.slug}/`,
                  title: `${String(nextTopic.order).padStart(2, '0')}. ${nextTopic.title}`,
                }
              : {
                  href: '/practice/',
                  title: 'PRACTICE & SOLVED EXAM QUESTIONS (80+)',
                }
          }
        />
      </article>

      {/* Right-Hand On This Page Table of Contents Outline */}
      <TableOfContents sections={topic.sections} />
    </div>
  );
}
