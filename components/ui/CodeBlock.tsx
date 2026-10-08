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
    <div className="my-6 border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#000000]">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#141414] text-xs font-mono">
        <div className="flex items-center space-x-2">
          {filename && <span className="font-bold text-[#000000] dark:text-[#FFFFFF]">{filename}</span>}
          <span className="text-[#737373] uppercase tracking-wider">[{language}]</span>
        </div>
        <button
          onClick={handleCopyCode}
          className="px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#000000] hover:text-[#FFFFFF] dark:hover:bg-[#FFFFFF] dark:hover:text-[#000000] transition-colors uppercase font-mono tracking-wider text-[11px]"
          aria-label="Copy code to clipboard"
        >
          {copied ? 'COPIED' : 'COPY CODE'}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed bg-[#F5F5F5] dark:bg-[#0C0C0C]">
        {highlightedHtml ? (
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            className="[&_pre]:!bg-transparent [&_pre]:!border-0 [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!bg-transparent"
          />
        ) : (
          <pre className="text-[#000000] dark:text-[#FFFFFF] whitespace-pre font-mono">
            <code>{code.trim()}</code>
          </pre>
        )}
      </div>

      {/* Compile & Run Helper Bar if available */}
      {(compileCmd || runCmd) && (
        <div className="border-t border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#FFFFFF] dark:bg-[#080808] text-xs font-mono space-y-2">
          {compileCmd && (
            <div className="flex items-center justify-between gap-2">
              <div className="overflow-x-auto truncate">
                <span className="text-[#737373] uppercase font-bold mr-2">COMPILE:</span>
                <code className="text-[#000000] dark:text-[#FFFFFF]">{compileCmd}</code>
              </div>
              <button
                onClick={() => handleCopyCmd(compileCmd, 'compile')}
                className="shrink-0 px-1.5 py-0.5 border border-[#E5E5E5] dark:border-[#262626] text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF] text-[10px] uppercase"
              >
                {copiedCmd === 'compile' ? 'COPIED' : 'COPY'}
              </button>
            </div>
          )}
          {runCmd && (
            <div className="flex items-center justify-between gap-2">
              <div className="overflow-x-auto truncate">
                <span className="text-[#737373] uppercase font-bold mr-2">RUN:</span>
                <code className="text-[#000000] dark:text-[#FFFFFF]">{runCmd}</code>
              </div>
              <button
                onClick={() => handleCopyCmd(runCmd, 'run')}
                className="shrink-0 px-1.5 py-0.5 border border-[#E5E5E5] dark:border-[#262626] text-[#737373] hover:text-[#000000] dark:hover:text-[#FFFFFF] text-[10px] uppercase"
              >
                {copiedCmd === 'run' ? 'COPIED' : 'COPY'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
