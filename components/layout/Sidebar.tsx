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
      { slug: 'flashcards', href: '/flashcards/', title: 'Flashcards Deck (65)' },
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
      { slug: 'practice/mpi', href: '/practice/mpi/', title: 'MPI Solved Questions (42)' },
      { slug: 'practice/openmp', href: '/practice/openmp/', title: 'OpenMP Solved Questions (42)' },
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
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-30 w-72 border-r border-black/[0.06] dark:border-white/[0.08] apple-glass overflow-y-auto transform transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {NAVIGATION_SECTIONS.map((section) => (
            <div key={section.number} className="space-y-1.5">
              <div className="px-2 flex items-center space-x-2 text-[10px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                <span>{section.number}.</span>
                <span>{section.title}</span>
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const isCompleted = completedSlugs.includes(item.slug);

                  return (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm font-semibold'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="truncate mr-2">{item.title}</span>
                        {item.slug.includes('/') && (
                          <span
                            className={`shrink-0 flex items-center justify-center w-4 h-4 rounded-full text-[9px] transition-all ${
                              isCompleted
                                ? isActive
                                  ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black font-bold'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                                : isActive
                                ? 'border border-white/30 text-white/40 dark:border-black/30 dark:text-black/40'
                                : 'border border-neutral-300 dark:border-neutral-700 text-transparent group-hover:border-neutral-400'
                            }`}
                          >
                            {isCompleted ? '✓' : ''}
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
