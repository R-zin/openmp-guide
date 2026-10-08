'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchModal } from '../ui/SearchModal';
import { SearchItem } from '@/lib/search';
import { getCompletedSlugs } from '@/lib/storage';

interface HeaderProps {
  searchItems?: SearchItem[];
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({
  searchItems = [],
  onToggleSidebar,
  isSidebarOpen,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    // Initialize completed count
    setCompletedCount(getCompletedSlugs().length);

    const handleProgress = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && custom.detail.all) {
        setCompletedCount(custom.detail.all.length);
      }
    };
    window.addEventListener('study-progress-updated', handleProgress);

    // Global keyboard listener for search '/' or Cmd+K
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('study-progress-updated', handleProgress);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000]">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 border border-[#E5E5E5] dark:border-[#262626] text-xs font-mono uppercase"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? '[CLOSE]' : '[MENU]'}
            </button>

            <Link
              href="/"
              className="font-mono font-bold text-sm tracking-wider uppercase text-[#000000] dark:text-[#FFFFFF] flex items-center space-x-2"
            >
              <span>PARALLEL PROGRAMMING</span>
              <span className="text-[#737373] hidden sm:inline text-xs font-normal">
                // LAB GUIDE
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <nav className="hidden md:flex items-center space-x-4 font-mono text-xs">
            <Link
              href="/mpi/"
              className="text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF] tracking-widest uppercase transition-colors"
            >
              MPI
            </Link>
            <span className="text-[#E5E5E5] dark:text-[#262626]">/</span>
            <Link
              href="/openmp/"
              className="text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF] tracking-widest uppercase transition-colors"
            >
              OPENMP
            </Link>
            <span className="text-[#E5E5E5] dark:text-[#262626]">/</span>
            <Link
              href="/practice/"
              className="text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF] tracking-widest uppercase transition-colors"
            >
              PRACTICE (80+)
            </Link>
            <span className="text-[#E5E5E5] dark:text-[#262626]">/</span>
            <Link
              href="/flashcards/"
              className="text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF] tracking-widest uppercase transition-colors"
            >
              FLASHCARDS
            </Link>
          </nav>

          {/* Right Controls: Progress, Search, Theme */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Progress counter */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center font-mono text-xs px-2 py-1 border border-[#E5E5E5] dark:border-[#262626] text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF]"
              title="Topics completed"
            >
              <span>PROGRESS: {completedCount}/20</span>
            </Link>

            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-2.5 py-1 border border-[#E5E5E5] dark:border-[#262626] text-xs font-mono text-[#000000] dark:text-[#FFFFFF] hover:border-[#000000] dark:hover:border-[#FFFFFF] transition-colors"
              aria-label="Open search dialog"
            >
              <span>SEARCH</span>
              <kbd className="hidden sm:inline text-[10px] text-[#737373] border border-[#E5E5E5] dark:border-[#262626] px-1">
                /
              </kbd>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="px-2.5 py-1 border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] text-xs font-mono uppercase tracking-wider hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? 'LIGHT' : 'DARK'}
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={searchItems}
      />
    </>
  );
}
