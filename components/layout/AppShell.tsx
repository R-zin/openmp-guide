'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SearchItem } from '@/lib/search';

interface AppShellProps {
  children: React.ReactNode;
  searchItems: SearchItem[];
}

export function AppShell({ children, searchItems }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col font-sans transition-colors">
      <Header
        searchItems={searchItems}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex w-full">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full lg:pl-72 flex justify-center min-w-0">
          <div className="w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </div>
        </main>
      </div>

      {/* Apple-Style Sleek Footer */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-white/50 dark:bg-black/50 backdrop-blur-md lg:pl-72 py-8 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-neutral-900 dark:text-white">Parallel Programming Guide</span>
            <span>&bull;</span>
            <span>Designed for Laboratory & Viva Examinations</span>
          </div>
          <div className="flex items-center space-x-6 text-neutral-500">
            <Link href="/mpi/" className="hover:text-black dark:hover:text-white transition-colors">MPI Distributed</Link>
            <Link href="/openmp/" className="hover:text-black dark:hover:text-white transition-colors">OpenMP Shared</Link>
            <Link href="/practice/" className="hover:text-black dark:hover:text-white transition-colors">Solved Exams</Link>
            <Link href="/flashcards/" className="hover:text-black dark:hover:text-white transition-colors">Flashcards</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
