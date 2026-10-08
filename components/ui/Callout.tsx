import React, { ReactNode } from 'react';

type CalloutType = 'watch-out' | 'note' | 'tip' | 'exam-rule';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const getDefaultTitle = () => {
    switch (type) {
      case 'watch-out':
        return 'Watch Out: Common Exam Mistake';
      case 'tip':
        return 'Exam Tip: High-Yield Revision';
      case 'exam-rule':
        return 'Lab Requirement & Grading Criteria';
      case 'note':
      default:
        return 'Important Note';
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'watch-out':
        return {
          card: 'bg-amber-500/[0.06] dark:bg-amber-500/[0.1] border-amber-500/30 text-amber-950 dark:text-amber-100',
          badge: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30',
          icon: '⚠️',
        };
      case 'tip':
        return {
          card: 'bg-blue-500/[0.06] dark:bg-blue-500/[0.1] border-blue-500/30 text-blue-950 dark:text-blue-100',
          badge: 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/30',
          icon: '💡',
        };
      case 'exam-rule':
        return {
          card: 'bg-purple-500/[0.06] dark:bg-purple-500/[0.1] border-purple-500/30 text-purple-950 dark:text-purple-100',
          badge: 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/30',
          icon: '📋',
        };
      case 'note':
      default:
        return {
          card: 'bg-neutral-500/[0.06] dark:bg-neutral-500/[0.1] border-black/10 dark:border-white/10 text-neutral-900 dark:text-neutral-100',
          badge: 'bg-black/10 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border-black/10 dark:border-white/10',
          icon: 'ℹ️',
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`my-6 rounded-2xl p-5 border transition-all ${style.card}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{style.icon}</span>
          <span className="text-xs font-semibold tracking-tight">
            {title || getDefaultTitle()}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full border ${style.badge}`}>
          {type.toUpperCase()}
        </span>
      </div>
      <div className="text-xs sm:text-sm leading-relaxed space-y-2 opacity-95">
        {children}
      </div>
    </div>
  );
}
