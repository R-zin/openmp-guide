'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCompletedSlugs } from '@/lib/storage';

interface NavItem {
  slug: string;
  href: string;
  title: string;
}

interface NavSection {
  number: string;
  title: string;
  items: NavItem[];
}

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    number: '00',
    title: 'OVERVIEW',
    items: [
      { slug: 'home', href: '/', title: 'Home & 3-Day Plan' },
      { slug: 'flashcards', href: '/flashcards/', title: 'Flashcard Deck (60+)' },
    ],
  },
  {
    number: '01',
    title: 'MPI (DISTRIBUTED MEMORY)',
    items: [
      { slug: 'mpi/01-basics', href: '/mpi/01-basics/', title: '1. Basics & Amdahl' },
      { slug: 'mpi/02-foundations', href: '/mpi/02-foundations/', title: '2. MPI Foundations' },
      { slug: 'mpi/03-point-to-point', href: '/mpi/03-point-to-point/', title: '3. Point-to-Point' },
      { slug: 'mpi/04-collectives', href: '/mpi/04-collectives/', title: '4. Collective Routines' },
      { slug: 'mpi/05-data-distributions', href: '/mpi/05-data-distributions/', title: '5. Data Distributions' },
      { slug: 'mpi/06-trapezoidal-rule', href: '/mpi/06-trapezoidal-rule/', title: '6. Trapezoidal Rule' },
      { slug: 'mpi/07-odd-even-sort', href: '/mpi/07-odd-even-sort/', title: '7. Odd-Even Transposition Sort' },
      { slug: 'mpi/08-matrix-multiplication', href: '/mpi/08-matrix-multiplication/', title: '8. Cannon & Matrix Mult' },
      { slug: 'mpi/09-graph-search', href: '/mpi/09-graph-search/', title: '9. Parallel BFS & DFS' },
      { slug: 'mpi/10-pitfalls-checklist', href: '/mpi/10-pitfalls-checklist/', title: '10. Pitfalls & Debugging' },
    ],
  },
  {
    number: '02',
    title: 'OPENMP (SHARED MEMORY)',
    items: [
      { slug: 'openmp/01-fork-join-model', href: '/openmp/01-fork-join-model/', title: '1. Fork-Join & Threads' },
      { slug: 'openmp/02-directives-and-clauses', href: '/openmp/02-directives-and-clauses/', title: '2. Directives & Clauses' },
      { slug: 'openmp/03-work-sharing', href: '/openmp/03-work-sharing/', title: '3. Work Sharing & Schedules' },
      { slug: 'openmp/04-synchronisation', href: '/openmp/04-synchronisation/', title: '4. Synchronisation & Locks' },
      { slug: 'openmp/05-reduction', href: '/openmp/05-reduction/', title: '5. Reduction & Pi Estimation' },
      { slug: 'openmp/06-runtime-library', href: '/openmp/06-runtime-library/', title: '6. Runtime Functions' },
      { slug: 'openmp/07-tasks', href: '/openmp/07-tasks/', title: '7. OpenMP Tasks' },
      { slug: 'openmp/08-performance', href: '/openmp/08-performance/', title: '8. False Sharing & Scaling' },
      { slug: 'openmp/09-classic-algorithms', href: '/openmp/09-classic-algorithms/', title: '9. Algorithms in OpenMP' },
      { slug: 'openmp/10-hybrid-comparison', href: '/openmp/10-hybrid-comparison/', title: '10. Hybrid MPI + OpenMP' },
    ],
  },
  {
    number: '03',
    title: 'PRACTICE & EXAMS',
    items: [
      { slug: 'practice/mpi', href: '/practice/mpi/', title: 'MPI Solved Questions (40+)' },
      { slug: 'practice/openmp', href: '/practice/openmp/', title: 'OpenMP Solved Questions (40+)' },
      { slug: 'practice/mock-mpi', href: '/practice/mock-mpi/', title: 'Mock Exam: MPI (3 Tasks)' },
      { slug: 'practice/mock-openmp', href: '/practice/mock-openmp/', title: 'Mock Exam: OpenMP (3 Tasks)' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  useEffect(() => {
    setCompletedSlugs(getCompletedSlugs());

    const handleProgress = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && custom.detail.all) {
        setCompletedSlugs(custom.detail.all);
      }
    };

    window.addEventListener('study-progress-updated', handleProgress);
    return () => window.removeEventListener('study-progress-updated', handleProgress);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-[#000000]/50 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-30 w-72 border-r border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000] overflow-y-auto transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {NAVIGATION_SECTIONS.map((section) => (
            <div key={section.number} className="space-y-2">
              <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest uppercase text-[#737373]">
                <span>{section.number}.</span>
                <span>{section.title}</span>
              </div>
              <ul className="space-y-1 font-mono text-xs">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const isCompleted = completedSlugs.includes(item.slug);

                  return (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center justify-between px-2.5 py-1.5 border transition-colors ${
                          isActive
                            ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] font-bold'
                            : 'border-transparent text-[#000000] dark:text-[#FFFFFF] hover:border-[#E5E5E5] dark:hover:border-[#262626] hover:bg-[#F5F5F5] dark:hover:bg-[#141414]'
                        }`}
                      >
                        <span className="truncate mr-2">{item.title}</span>
                        {item.slug.includes('/') && (
                          <span
                            className={`shrink-0 text-[10px] ${
                              isActive
                                ? 'text-[#FFFFFF] dark:text-[#000000]'
                                : isCompleted
                                ? 'text-[#000000] dark:text-[#FFFFFF] font-bold'
                                : 'text-[#737373] opacity-40 group-hover:opacity-100'
                            }`}
                          >
                            {isCompleted ? '[X]' : '[ ]'}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
