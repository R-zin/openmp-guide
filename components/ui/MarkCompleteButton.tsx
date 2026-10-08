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
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-xs font-medium text-neutral-400">
        <span className="w-2 h-2 rounded-full border border-neutral-400" />
        <span>Mark as Complete</span>
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
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
        completed
          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-sm'
          : 'bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/[0.08]'
      }`}
      aria-label={completed ? 'Mark topic as incomplete' : 'Mark topic as complete'}
    >
      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${completed ? 'bg-emerald-500 text-white font-bold' : 'border border-neutral-400'}`}>
        {completed ? '✓' : ''}
      </span>
      <span>{completed ? 'Topic Completed' : 'Mark as Complete'}</span>
    </button>
  );
}
