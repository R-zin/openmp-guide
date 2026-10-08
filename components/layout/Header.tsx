'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const [isDark, setIsDark] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode unless explicitly saved as 'light'
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : true;

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    setCompletedCount(getCompletedSlugs().length);

    const handleProgress = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && custom.detail.all) {
        setCompletedCount(custom.detail.all.length);
      }
    };
    window.addEventListener('study-progress-updated', handleProgress);

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

  const navLinks = [
    { href: '/mpi/', label: 'MPI' },
    { href: '/openmp/', label: 'OpenMP' },
    { href: '/practice/', label: 'Practice & Mocks' },
    { href: '/flashcards/', label: 'Flashcards' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] dark:border-white/[0.08] apple-glass transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-neutral-600 dark:text-neutral-300 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <Link
              href="/"
              className="group flex items-center space-x-2.5 text-sm font-semibold tracking-tight text-neutral-900 dark:text-white"
            >
              <div className="w-6 h-6 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-mono text-xs font-bold shadow-sm transition-transform group-hover:scale-105">
                //
              </div>
              <span className="font-medium tracking-tight">Parallel Programming</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-neutral-500 dark:text-neutral-400">
                LAB GUIDE
              </span>
            </Link>
          </div>

          {/* Center: Apple-style pill segmented links */}
          <nav className="hidden md:flex items-center space-x-1 p-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Progress, Search, Theme */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Progress counter */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/[0.08] dark:bg-blue-400/[0.12] text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/[0.15] transition-all"
              title="Topics completed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>{completedCount}/20 Done</span>
            </Link>

            {/* Apple Spotlight Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-all border border-black/[0.04] dark:border-white/[0.06]"
              aria-label="Open search dialog"
            >
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
              <kbd className="hidden sm:inline text-[10px] text-neutral-400 dark:text-neutral-500 px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1]">
                ⌘K
              </kbd>
            </button>

            {/* Apple Smooth Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.14] text-neutral-700 dark:text-neutral-200 transition-all border border-black/[0.04] dark:border-white/[0.06]"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
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
