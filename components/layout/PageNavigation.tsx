import React from 'react';
import Link from 'next/link';

interface NavLink {
  href: string;
  title: string;
  label?: string;
}

interface PageNavigationProps {
  prev?: NavLink;
  next?: NavLink;
}

export function PageNavigation({ prev, next }: PageNavigationProps) {
  return (
    <div className="my-12 pt-8 border-t border-black/[0.06] dark:border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={prev.href}
          className="apple-card p-5 rounded-2xl group flex flex-col justify-between hover:border-black/20 dark:hover:border-white/20 transition-all"
        >
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-2">
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
            <span className="uppercase tracking-wider">Previous Topic</span>
          </div>
          <span className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="apple-card p-5 rounded-2xl group flex flex-col justify-between text-left sm:text-right hover:border-black/20 dark:hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-start sm:justify-end space-x-1.5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-2">
            <span className="uppercase tracking-wider">Next Topic</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>
          <span className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
