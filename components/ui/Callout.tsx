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
        return 'WATCH OUT // COMMON MISTAKE';
      case 'tip':
        return 'EXAM TIP // LAB REVISION';
      case 'exam-rule':
        return 'LAB REQUIREMENT // EVALUATION RULE';
      case 'note':
      default:
        return 'NOTE';
    }
  };

  const getBadge = () => {
    switch (type) {
      case 'watch-out':
        return '[!] CAUTION';
      case 'tip':
        return '[*] TIP';
      case 'exam-rule':
        return '[#] RULE';
      case 'note':
      default:
        return '[i] NOTE';
    }
  };

  return (
    <div className="my-6 border border-[#000000] dark:border-[#FFFFFF] p-4 bg-[#FFFFFF] dark:bg-[#000000]">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-2 mb-3">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
          {title || getDefaultTitle()}
        </span>
        <span className="font-mono text-[11px] text-[#737373] tracking-widest">
          {getBadge()}
        </span>
      </div>
      <div className="text-sm text-[#000000] dark:text-[#E5E5E5] leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
