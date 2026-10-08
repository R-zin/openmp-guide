'use client';

import React, { useEffect, useState } from 'react';
import { isPageCompleted, togglePageCompleted } from '@/lib/storage';

interface MarkCompleteButtonProps {
  slug: string;
}

export function MarkCompleteButton({ slug }: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompleted(isPageCompleted(slug));

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && custom.detail.slug === slug) {
        setCompleted(custom.detail.completed);
      } else {
        setCompleted(isPageCompleted(slug));
      }
    };

    window.addEventListener('study-progress-updated', handleUpdate);
    return () => window.removeEventListener('study-progress-updated', handleUpdate);
  }, [slug]);

  if (!mounted) {
    return (
      <div className="inline-flex items-center space-x-2 px-3 py-1.5 border border-[#E5E5E5] text-xs font-mono text-[#737373]">
        <span>[ ]</span>
        <span>MARK AS COMPLETE</span>
      </div>
    );
  }

  const handleToggle = () => {
    const next = togglePageCompleted(slug);
    setCompleted(next);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center space-x-2 px-3 py-1.5 border font-mono text-xs uppercase tracking-wider transition-colors ${
        completed
          ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000]'
          : 'border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] hover:border-[#000000] dark:hover:border-[#FFFFFF]'
      }`}
      aria-label={completed ? 'Mark topic as incomplete' : 'Mark topic as complete'}
    >
      <span className="font-bold">{completed ? '[X]' : '[ ]'}</span>
      <span>{completed ? 'COMPLETED' : 'MARK AS COMPLETE'}</span>
    </button>
  );
}
