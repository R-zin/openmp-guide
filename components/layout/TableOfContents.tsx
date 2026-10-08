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
    <nav className="hidden xl:block w-64 shrink-0 font-mono text-xs text-[#000000] dark:text-[#FFFFFF] pl-6 border-l border-[#E5E5E5] dark:border-[#262626]">
      <div className="sticky top-20 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#737373]">
          ON THIS PAGE
        </div>
        <ul className="space-y-1.5 border-l border-[#E5E5E5] dark:border-[#262626] -ml-[1px]">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`block border-l-2 py-0.5 transition-colors ${
                    section.level === 3 ? 'pl-4' : 'pl-2.5'
                  } ${
                    isActive
                      ? 'border-[#000000] dark:border-[#FFFFFF] font-bold text-[#000000] dark:text-[#FFFFFF]'
                      : 'border-transparent text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF]'
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
