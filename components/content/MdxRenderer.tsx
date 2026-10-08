'use client';

import React from 'react';
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

export function MdxRenderer({ content }: MdxRendererProps) {
  // Parse markdown content line by line or chunk by chunk
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  let keyIndex = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Interactive Simulators
    if (line.includes('<HelloSimulator />')) {
      elements.push(<HelloSimulator key={`hello-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (line.includes('<RingPingPongSimulator />')) {
      elements.push(<RingPingPongSimulator key={`ring-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (line.includes('<DeadlockSimulator />')) {
      elements.push(<DeadlockSimulator key={`deadlock-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (line.includes('<OddEvenSortStepper />')) {
      elements.push(<OddEvenSortStepper key={`oddeven-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (line.includes('<CannonStepper />')) {
      elements.push(<CannonStepper key={`cannon-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (line.includes('<OpenMPScheduleVisualizer />')) {
      elements.push(<OpenMPScheduleVisualizer key={`sched-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (line.includes('<RaceConditionDemo />')) {
      elements.push(<RaceConditionDemo key={`race-${keyIndex++}`} />);
      i++;
      continue;
    }
    if (line.includes('<AmdahlCalculator />')) {
      elements.push(<AmdahlCalculator key={`amdahl-${keyIndex++}`} />);
      i++;
      continue;
    }

    // 2. Diagram Tag: <Diagram type="..." caption="..." />
    if (line.includes('<Diagram')) {
      const typeMatch = line.match(/type="([^"]+)"/);
      const captionMatch = line.match(/caption="([^"]+)"/);
      const diagType = (typeMatch ? typeMatch[1] : 'memory-architecture') as any;
      const caption = captionMatch ? captionMatch[1] : undefined;
      elements.push(
        <Diagram key={`diag-${keyIndex++}`} type={diagType} caption={caption} />
      );
      i++;
      continue;
    }

    // 3. Callout Block: <Callout type="..." title="..."> ... </Callout>
    if (line.startsWith('<Callout')) {
      const typeMatch = line.match(/type="([^"]+)"/);
      const titleMatch = line.match(/title="([^"]+)"/);
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
          <div className="space-y-2 whitespace-pre-line">
            {calloutLines.join('\n').trim()}
          </div>
        </Callout>
      );
      continue;
    }

    // 4. Code Block: ```c ... ```
    if (line.startsWith('```')) {
      const lang = line.replace('```', '').trim() || 'c';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
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

    // 5. Headings: ## and ###
    if (line.startsWith('## ')) {
      const titleText = line.replace('## ', '').trim();
      const slugId = titleText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      elements.push(
        <h2
          key={`h2-${keyIndex++}`}
          id={slugId}
          className="text-xl sm:text-2xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mt-10 mb-4 pt-4 border-t border-[#E5E5E5] dark:border-[#262626] scroll-mt-20"
        >
          {titleText}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      const titleText = line.replace('### ', '').trim();
      const slugId = titleText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      elements.push(
        <h3
          key={`h3-${keyIndex++}`}
          id={slugId}
          className="text-base sm:text-lg font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mt-6 mb-2 scroll-mt-20"
        >
          {titleText}
        </h3>
      );
      i++;
      continue;
    }

    // 6. Markdown Tables
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|') && lines[i].endsWith('|')) {
        tableLines.push(lines[i]);
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
          <div key={`table-${keyIndex++}`} className="my-6 overflow-x-auto border border-[#E5E5E5] dark:border-[#262626]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-[#000000] dark:border-[#FFFFFF] bg-[#F5F5F5] dark:bg-[#121212]">
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="p-2.5 font-bold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#262626]">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#F5F5F5] dark:hover:bg-[#0C0C0C]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2.5 text-[#000000] dark:text-[#E5E5E5] whitespace-pre-wrap">
                        {cell}
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

    // 7. Unordered Lists (- item or * item)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        listItems.push(lines[i].trim().substring(2).trim());
        i++;
      }
      elements.push(
        <ul key={`ul-${keyIndex++}`} className="my-3 space-y-1.5 list-disc list-inside text-sm leading-relaxed text-[#000000] dark:text-[#E5E5E5]">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="pl-1">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Ordered Lists (1. item)
    if (/^\d+\.\s/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, '').trim());
        i++;
      }
      elements.push(
        <ol key={`ol-${keyIndex++}`} className="my-3 space-y-1.5 list-decimal list-inside text-sm leading-relaxed text-[#000000] dark:text-[#E5E5E5]">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="pl-1">
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 9. Empty Lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // 10. Regular Paragraphs
    elements.push(
      <p key={`p-${keyIndex++}`} className="my-3 text-sm leading-relaxed text-[#000000] dark:text-[#E5E5E5]">
        {line}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}
