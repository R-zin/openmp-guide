'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightedHtml?: string;
  compileCmd?: string;
  runCmd?: string;
}

export function CodeBlock({
  code,
  language = 'c',
  filename,
  highlightedHtml,
  compileCmd,
  runCmd,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyCmd = async (cmd: string, type: string) => {
    try {
      await navigator.clipboard.writeText(cmd.trim());
      setCopiedCmd(type);
      setTimeout(() => setCopiedCmd(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] bg-[#1E1E24] dark:bg-[#121214] shadow-md dark:shadow-2xl transition-all">
      {/* macOS Window Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#25252D] dark:bg-[#18181B] border-b border-white/[0.06] text-xs">
        {/* macOS Traffic Light Dots */}
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
          {filename ? (
            <span className="ml-2 font-mono text-[11px] text-neutral-300 font-medium">
              {filename}
            </span>
          ) : (
            <span className="ml-2 font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyCode}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-neutral-200 text-[11px] font-medium transition-all"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed bg-[#1E1E24] dark:bg-[#121214] text-neutral-200">
        {highlightedHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            className="[&_pre]:!bg-transparent [&_pre]:!border-0 [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!bg-transparent"
          />
        ) : (
          <pre className="text-neutral-200 whitespace-pre font-mono">
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>

      {/* Compile & Run Terminal Bar */}
      {(compileCmd || runCmd) && (
        <div className="border-t border-white/[0.08] p-3 sm:px-4 bg-[#18181E] dark:bg-[#0D0D0F] text-xs font-mono space-y-2">
          {compileCmd && (
            <div className="flex items-center justify-between gap-2">
              <div className="overflow-x-auto truncate flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">compile:</span>
                <code className="text-neutral-200">{compileCmd}</code>
              </div>
              <button
                onClick={() => handleCopyCmd(compileCmd, 'compile')}
                className="shrink-0 px-2.5 py-0.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-neutral-300 text-[10px] font-medium transition-colors"
              >
                {copiedCmd === 'compile' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}
          {runCmd && (
            <div className="flex items-center justify-between gap-2">
              <div className="overflow-x-auto truncate flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">run:</span>
                <code className="text-neutral-200">{runCmd}</code>
              </div>
              <button
                onClick={() => handleCopyCmd(runCmd, 'run')}
                className="shrink-0 px-2.5 py-0.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-neutral-300 text-[10px] font-medium transition-colors"
              >
                {copiedCmd === 'run' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
