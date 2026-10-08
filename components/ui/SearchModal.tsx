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
      className="fixed inset-0 z-50 bg-[#000000]/60 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] p-4 text-[#000000] dark:text-[#FFFFFF]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-[#E5E5E5] dark:border-[#262626] pb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#737373] mr-3">
            SEARCH:
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type MPI routine, OpenMP directive, algorithm..."
            className="w-full bg-transparent outline-none font-mono text-sm placeholder:text-[#737373]"
            aria-label="Search study guide"
          />
          <button
            onClick={onClose}
            className="font-mono text-xs text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF] ml-2 px-2 py-1 border border-[#E5E5E5] dark:border-[#262626]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto mt-3 divide-y divide-[#E5E5E5] dark:divide-[#262626]">
          {query.trim() && results.length === 0 && (
            <div className="py-8 text-center text-xs font-mono text-[#737373]">
              NO MATCHES FOUND FOR &quot;{query}&quot;
            </div>
          )}

          {!query.trim() && (
            <div className="py-4 text-xs font-mono text-[#737373]">
              Quick searches: <span className="underline cursor-pointer" onClick={() => setQuery('deadlock')}>deadlock</span>,{' '}
              <span className="underline cursor-pointer" onClick={() => setQuery('cannon')}>cannon</span>,{' '}
              <span className="underline cursor-pointer" onClick={() => setQuery('trapezoidal')}>trapezoidal</span>,{' '}
              <span className="underline cursor-pointer" onClick={() => setQuery('schedule')}>schedule</span>,{' '}
              <span className="underline cursor-pointer" onClick={() => setQuery('critical')}>critical vs atomic</span>
            </div>
          )}

          {results.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`p-3 cursor-pointer text-left font-mono transition-colors ${
                index === selectedIndex
                  ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]'
                  : 'hover:bg-[#F5F5F5] dark:hover:bg-[#141414]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="uppercase tracking-widest opacity-70">
                  [{item.category}]
                </span>
                <span className="text-[10px] opacity-60 truncate max-w-[200px]">
                  {item.path}
                </span>
              </div>
              <div className="text-sm font-bold truncate">{item.title}</div>
              <div className="text-xs opacity-80 truncate mt-1">
                {item.snippet}
              </div>
            </div>
          ))}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-[#E5E5E5] dark:border-[#262626] pt-3 mt-3 flex items-center justify-between text-[11px] font-mono text-[#737373]">
          <span>UP/DOWN to navigate, ENTER to open</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
