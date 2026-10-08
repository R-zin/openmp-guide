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
    <div className="my-12 pt-8 border-t border-[#E5E5E5] dark:border-[#262626] grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
      {prev ? (
        <Link
          href={prev.href}
          className="p-4 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] transition-colors group flex flex-col justify-between"
        >
          <span className="text-[#737373] uppercase tracking-wider text-[11px] mb-1">
            &larr; PREVIOUS TOPIC
          </span>
          <span className="font-bold text-sm text-[#000000] dark:text-[#FFFFFF] group-hover:underline">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="p-4 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] transition-colors group flex flex-col justify-between text-left sm:text-right"
        >
          <span className="text-[#737373] uppercase tracking-wider text-[11px] mb-1">
            NEXT TOPIC &rarr;
          </span>
          <span className="font-bold text-sm text-[#000000] dark:text-[#FFFFFF] group-hover:underline">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
