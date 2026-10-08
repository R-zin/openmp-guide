import React from 'react';
import Link from 'next/link';
import katex from 'katex';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Callout } from '@/components/ui/Callout';
import { Diagram } from '@/components/ui/Diagram';
import { HelloSimulator } from '@/components/interactive/HelloSimulator';
import { RingPingPongSimulator } from '@/components/interactive/RingPingPongSimulator';
import { DeadlockSimulator } from '@/components/interactive/DeadlockSimulator';
import { OddEvenSortStepper } from '@/components/interactive/OddEvenSortStepper';
import { CannonStepper } from '@/components/interactive/CannonStepper';
import { OpenMPScheduleVisualizer } from '@/components/interactive/OpenMPScheduleVisualizer';
import { RaceConditionDemo } from '@/components/interactive/RaceConditionDemo';
import { AmdahlCalculator } from '@/components/interactive/AmdahlCalculator';

interface MdxRendererProps {
  content: string;
}

/**
 * Tokenize and render inline text, supporting:
 * - $...$ inline LaTeX math (via KaTeX)
 * - `...` inline code
 * - **...** bold text
 * - *...* italic text
 * - [label](href) links
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  // Regex matching inline tokens in order
  const pattern = /(\$(?!\$)[^\n$]+?\$)|(`[^`\n]+`)|(\*\*[^*\n]+?\*\*)|(\[[^\]]+\]\([^)]+\))|(\*[^*\n]+?\*)/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('$') && token.endsWith('$')) {
      const mathStr = token.slice(1, -1);
      try {
        const html = katex.renderToString(mathStr, {
          displayMode: false,
          throwOnError: false,
        });
        nodes.push(
          <span
            key={`math-${keyIdx++}`}
            className="inline-math px-0.5 text-neutral-900 dark:text-neutral-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        nodes.push(<code key={`m-err-${keyIdx++}`}>{token}</code>);
      }
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeStr = token.slice(1, -1);
      nodes.push(
        <code
          key={`code-${keyIdx++}`}
          className="px-1.5 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.08] text-xs font-mono text-neutral-900 dark:text-neutral-200 border border-black/[0.04] dark:border-white/[0.06]"
        >
          {codeStr}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const boldContent = token.slice(2, -2);
      nodes.push(
        <strong key={`bold-${keyIdx++}`} className="font-semibold text-neutral-900 dark:text-white">
          {renderInline(boldContent)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicContent = token.slice(1, -1);
      nodes.push(
        <em key={`em-${keyIdx++}`} className="italic text-neutral-800 dark:text-neutral-200">
          {renderInline(italicContent)}
        </em>
      );
    } else if (token.startsWith('[') && token.endsWith(')')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, linkText, linkHref] = linkMatch;
        nodes.push(
          <Link
            key={`link-${keyIdx++}`}
            href={linkHref}
            className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
          >
            {renderInline(linkText)}
          </Link>
        );
      } else {
        nodes.push(token);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length === 1 ? nodes[0] : <React.Fragment key={text}>{nodes}</React.Fragment>;
}

export function MdxRenderer({ content }: MdxRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  let keyIndex = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    // 1. Interactive Simulators
    if (trimmedLine.includes('<HelloSimulator />')) {
      elements.push(<HelloSimulator key={`hello-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (trimmedLine.includes('<RingPingPongSimulator />')) {
      elements.push(<RingPingPongSimulator key={`ring-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (trimmedLine.includes('<DeadlockSimulator />')) {
      elements.push(<DeadlockSimulator key={`deadlock-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (trimmedLine.includes('<OddEvenSortStepper />')) {
      elements.push(<OddEvenSortStepper key={`oddeven-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (trimmedLine.includes('<CannonStepper />')) {
      elements.push(<CannonStepper key={`cannon-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (trimmedLine.includes('<OpenMPScheduleVisualizer />')) {
      elements.push(<OpenMPScheduleVisualizer key={`sched-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (trimmedLine.includes('<RaceConditionDemo />')) {
      elements.push(<RaceConditionDemo key={`race-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (trimmedLine.includes('<AmdahlCalculator />')) {
      elements.push(<AmdahlCalculator key={`amdahl-${keyIndex++}`} />);
      i++;
      continue;
    }

    // 2. Diagram Tag: <Diagram type="..." caption="..." />
    if (trimmedLine.includes('<Diagram')) {
      const typeMatch = rawLine.match(/type="([^"]+)"/);
      const captionMatch = rawLine.match(/caption="([^"]+)"/);
      const diagType = (typeMatch ? typeMatch[1] : 'memory-architecture') as any;
      const caption = captionMatch ? captionMatch[1] : undefined;
      elements.push(
        <Diagram key={`diag-${keyIndex++}`} type={diagType} caption={caption} />
      );
      i++;
      continue;
    }

    // 3. Callout Block: <Callout type="..." title="..."> ... </Callout>
    if (trimmedLine.startsWith('<Callout')) {
      const typeMatch = rawLine.match(/type="([^"]+)"/);
      const titleMatch = rawLine.match(/title="([^"]+)"/);
      const calloutType = (typeMatch ? typeMatch[1] : 'note') as any;
      const title = titleMatch ? titleMatch[1] : undefined;

      const calloutLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].includes('</Callout>')) {
        calloutLines.push(lines[i]);
        i++;
      }
      i++; // Skip </Callout>

      elements.push(
        <Callout key={`callout-${keyIndex++}`} type={calloutType} title={title}>
          <div className="space-y-2 text-sm leading-relaxed">
            {calloutLines.map((cLine, cIdx) => {
              if (!cLine.trim()) return null;
              return <p key={cIdx}>{renderInline(cLine)}</p>;
            })}
          </div>
        </Callout>
      );
      continue;
    }

    // 4. Code Block: ```c ... ```
    if (trimmedLine.startsWith('```')) {
      const lang = trimmedLine.replace('```', '').trim() || 'c';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```

      const codeString = codeLines.join('\n');
      elements.push(
        <CodeBlock
          key={`code-${keyIndex++}`}
          code={codeString}
          language={lang}
        />
      );
      continue;
    }

    // 5. Display Math Formulas ($$...$$)
    // Case A: Single line $$...$$
    if (trimmedLine.startsWith('$$') && trimmedLine.endsWith('$$') && trimmedLine.length > 4) {
      const mathStr = trimmedLine.slice(2, -2).trim();
      try {
        const mathHtml = katex.renderToString(mathStr, {
          displayMode: true,
          throwOnError: false,
        });
        elements.push(
          <div
            key={`math-block-${keyIndex++}`}
            className="my-6 p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] overflow-x-auto overflow-y-hidden text-center text-neutral-900 dark:text-neutral-100 shadow-sm"
            dangerouslySetInnerHTML={{ __html: mathHtml }}
          />
        );
      } catch {
        elements.push(
          <div key={`math-err-${keyIndex++}`} className="my-4 font-mono text-xs text-red-500">
            $${mathStr}$$
          </div>
        );
      }
      i++;
      continue;
    }

    // Case B: Multi-line $$ ... $$
    if (trimmedLine === '$$') {
      const mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '$$') {
        mathLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing $$
      const mathStr = mathLines.join('\n').trim();
      try {
        const mathHtml = katex.renderToString(mathStr, {
          displayMode: true,
          throwOnError: false,
        });
        elements.push(
          <div
            key={`math-block-${keyIndex++}`}
            className="my-6 p-4 sm:p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] overflow-x-auto overflow-y-hidden text-center text-neutral-900 dark:text-neutral-100 shadow-sm"
            dangerouslySetInnerHTML={{ __html: mathHtml }}
          />
        );
      } catch {
        elements.push(
          <div key={`math-err-${keyIndex++}`} className="my-4 font-mono text-xs text-red-500">
            $${mathStr}$$
          </div>
        );
      }
      continue;
    }

    // 6. Headings: ## and ###
    if (trimmedLine.startsWith('## ')) {
      const titleText = trimmedLine.replace('## ', '').trim();
      const slugId = titleText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      elements.push(
        <h2
          key={`h2-${keyIndex++}`}
          id={slugId}
          className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mt-10 mb-4 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] scroll-mt-20"
        >
          {renderInline(titleText)}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmedLine.startsWith('### ')) {
      const titleText = trimmedLine.replace('### ', '').trim();
      const slugId = titleText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      elements.push(
        <h3
          key={`h3-${keyIndex++}`}
          id={slugId}
          className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900 dark:text-white mt-6 mb-2 scroll-mt-20"
        >
          {renderInline(titleText)}
        </h3>
      );
      i++;
      continue;
    }

    // 7. Markdown Tables
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        const bodyRows = tableLines.slice(2).map((r) =>
          r
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        );

        elements.push(
          <div
            key={`table-${keyIndex++}`}
            className="my-6 overflow-x-auto rounded-2xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-neutral-900/40 shadow-sm"
          >
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-black/[0.08] dark:border-white/[0.1] bg-black/[0.03] dark:bg-white/[0.04]">
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="p-3 font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200"
                    >
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="p-3 text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-sans text-xs"
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // 8. Blockquotes (> quote)
    if (trimmedLine.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2).trim());
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${keyIndex++}`}
          className="my-4 pl-4 border-l-2 border-neutral-300 dark:border-neutral-700 italic text-neutral-700 dark:text-neutral-300 text-sm space-y-1.5"
        >
          {quoteLines.map((q, qIdx) => (
            <p key={qIdx}>{renderInline(q)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 9. Unordered Lists (- item or * item)
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))
      ) {
        listItems.push(lines[i].trim().substring(2).trim());
        i++;
      }
      elements.push(
        <ul
          key={`ul-${keyIndex++}`}
          className="my-3 space-y-2 list-disc list-outside ml-5 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200"
        >
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="pl-1">
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 10. Ordered Lists (1. item)
    if (/^\d+\.\s/.test(trimmedLine)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, '').trim());
        i++;
      }
      elements.push(
        <ol
          key={`ol-${keyIndex++}`}
          className="my-3 space-y-2 list-decimal list-outside ml-5 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200"
        >
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="pl-1">
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 11. Empty Lines
    if (!trimmedLine) {
      i++;
      continue;
    }

    // 12. Regular Paragraphs
    elements.push(
      <p
        key={`p-${keyIndex++}`}
        className="my-3 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200"
      >
        {renderInline(trimmedLine)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}
