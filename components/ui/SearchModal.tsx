'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchItem, searchIndex } from '@/lib/search';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchItem[];
}

export function SearchModal({ isOpen, onClose, items }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const matched = searchIndex(items, query);
    setResults(matched.slice(0, 10));
    setSelectedIndex(0);
  }, [query, items]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl apple-glass shadow-2xl border border-black/10 dark:border-white/10 p-4 sm:p-5 text-neutral-900 dark:text-white overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Apple Spotlight Search Input Bar */}
        <div className="flex items-center pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
          <svg className="w-5 h-5 text-neutral-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search MPI functions, OpenMP clauses, algorithms..."
            className="w-full bg-transparent outline-none text-base sm:text-lg font-medium placeholder:text-neutral-400"
            aria-label="Search study guide"
          />
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-black dark:hover:text-white px-2 py-1 rounded-md bg-black/[0.05] dark:bg-white/[0.08]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto mt-2 space-y-1">
          {query.trim() && results.length === 0 && (
            <div className="py-12 text-center text-xs text-neutral-400">
              No matching topics or questions for &quot;{query}&quot;
            </div>
          )}

          {!query.trim() && (
            <div className="py-4 px-2 text-xs text-neutral-400 flex flex-wrap gap-2 items-center">
              <span>Quick searches:</span>
              {['deadlock', 'cannon', 'trapezoidal', 'schedule', 'critical vs atomic', 'tasks'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {results.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-3 rounded-2xl cursor-pointer text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={`uppercase tracking-wider font-semibold ${isSelected ? 'text-blue-100' : 'text-neutral-400'}`}>
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-mono truncate max-w-[200px] ${isSelected ? 'text-blue-200' : 'text-neutral-400'}`}>
                    {item.path}
                  </span>
                </div>
                <div className="text-sm font-semibold truncate">{item.title}</div>
                <div className={`text-xs truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {item.snippet}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-black/[0.06] dark:border-white/[0.08] pt-3 mt-2 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Use &uarr; &darr; to navigate, &crarr; to select</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
