'use client';

import React, { useEffect, useState } from 'react';
import { TocSection } from '@/lib/types';

interface TableOfContentsProps {
  sections: TocSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -60% 0%' }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav className="hidden xl:block w-64 shrink-0 text-xs text-neutral-800 dark:text-neutral-200 pl-6 border-l border-black/[0.06] dark:border-white/[0.08]">
      <div className="sticky top-20 space-y-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          On This Page
        </div>
        <ul className="space-y-1 relative">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`block py-1 rounded-lg transition-all text-xs ${
                    section.level === 3 ? 'pl-4' : 'pl-2'
                  } ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-500/[0.08]'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {section.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
