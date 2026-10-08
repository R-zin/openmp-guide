'use client';

import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] flex flex-col font-sans">
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
          <div className="w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Minimalist Footer */}
      <footer className="border-t border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000] lg:pl-72 py-6 text-center text-xs font-mono text-[#737373]">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PARALLEL PROGRAMMING // MPI & OPENMP LAB REVISION GUIDE</span>
          <span className="uppercase">[PURE MONOCHROME // 90° GEOMETRY]</span>
        </div>
      </footer>
    </div>
  );
}
