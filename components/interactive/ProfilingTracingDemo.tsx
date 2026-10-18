'use client';

import React, { useState } from 'react';

export function ProfilingTracingDemo() {
  const [viewMode, setViewMode] = useState<'timeline' | 'profile'>('timeline');
  const [selectedEvent, setSelectedEvent] = useState<string | null>('rank1-recv');

  return (
    <div className="my-8 border border-black dark:border-white bg-white dark:bg-black p-4 sm:p-6 text-black dark:text-white font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black dark:border-white gap-3">
        <div>
          <span className="text-[10px] tracking-widest uppercase opacity-60">INTERACTIVE // PERFORMANCE TOOLS</span>
          <h3 className="text-base sm:text-lg font-bold">PROFILING VS TRACING COMPARISON DEMO</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 text-xs font-bold border border-black dark:border-white transition-colors ${
              viewMode === 'timeline'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            TIMELINE TRACE VIEW
          </button>
          <button
            onClick={() => setViewMode('profile')}
            className={`px-3 py-1 text-xs font-bold border border-black dark:border-white transition-colors ${
              viewMode === 'profile'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            FLAT PROFILE VIEW
          </button>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        /* Tracing View */
        <div className="space-y-6 my-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider">MULTI-RANK OTF2 TRACE TIMELINE (3 RANKS):</span>
            <span className="text-[11px] opacity-70">Click any block to diagnose wait-state</span>
          </div>

          {/* SVG Gantt Chart */}
          <div className="border border-black dark:border-white p-4 overflow-x-auto bg-black/[0.01] dark:bg-white/[0.01]">
            <svg viewBox="0 0 700 210" className="w-full min-w-[620px] font-mono text-xs">
              {/* Timeline Header */}
              <line x1="80" y1="30" x2="660" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              {[0, 20, 40, 60, 80, 100].map((t) => (
                <g key={`t-${t}`} transform={`translate(${80 + t * 5.6}, 25)`}>
                  <line x1="0" y1="0" x2="0" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
                  <text x="0" y="-8" textAnchor="middle" className="fill-current opacity-70" fontSize="8">{t} ms</text>
                </g>
              ))}

              {/* Rank 0 */}
              <text x="70" y="62" textAnchor="end" className="font-bold fill-current" fontSize="10">Rank 0</text>
              <g
                onClick={() => setSelectedEvent('rank0-compute')}
                className="cursor-pointer"
              >
                <rect x="80" y="48" width="336" height="22" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="248" y="62" textAnchor="middle" className="font-bold fill-current" fontSize="9">COMPUTE KERNEL (60ms - HEAVY LOAD)</text>
              </g>
              <g
                onClick={() => setSelectedEvent('rank0-send')}
                className="cursor-pointer"
              >
                <rect x="416" y="48" width="56" height="22" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1" />
                <text x="444" y="62" textAnchor="middle" className="font-bold fill-current" fontSize="8">MPI_Send</text>
              </g>

              {/* Message Arrows from Rank 0 to Rank 1 & Rank 2 */}
              <path d="M 444,70 L 444,102" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <polygon points="444,102 440,94 448,94" fill="currentColor" />

              <path d="M 454,70 L 454,156" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <polygon points="454,156 450,148 458,148" fill="currentColor" />

              {/* Rank 1 */}
              <text x="70" y="116" textAnchor="end" className="font-bold fill-current" fontSize="10">Rank 1</text>
              <g
                onClick={() => setSelectedEvent('rank1-compute')}
                className="cursor-pointer"
              >
                <rect x="80" y="102" width="112" height="22" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="136" y="116" textAnchor="middle" className="fill-current" fontSize="8">COMPUTE (20ms)</text>
              </g>
              {/* Rank 1 Idle wait */}
              <g
                onClick={() => setSelectedEvent('rank1-recv')}
                className="cursor-pointer"
              >
                <rect
                  x="192"
                  y="102"
                  width="252"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                <text x="318" y="116" textAnchor="middle" className="font-bold fill-current" fontSize="9">
                  IDLE WAIT (45ms) — MPI_Recv STALL
                </text>
              </g>
              <g onClick={() => setSelectedEvent('rank1-compute2')} className="cursor-pointer">
                <rect x="444" y="102" width="140" height="22" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="514" y="116" textAnchor="middle" className="fill-current" fontSize="8">COMPUTE (25ms)</text>
              </g>

              {/* Rank 2 */}
              <text x="70" y="170" textAnchor="end" className="font-bold fill-current" fontSize="10">Rank 2</text>
              <g onClick={() => setSelectedEvent('rank2-compute')} className="cursor-pointer">
                <rect x="80" y="156" width="196" height="22" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="178" y="170" textAnchor="middle" className="fill-current" fontSize="8">COMPUTE (35ms)</text>
              </g>
              {/* Rank 2 wait */}
              <g onClick={() => setSelectedEvent('rank2-recv')} className="cursor-pointer">
                <rect
                  x="276"
                  y="156"
                  width="178"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text x="365" y="170" textAnchor="middle" className="font-bold fill-current" fontSize="8">
                  MPI_Recv WAIT (32ms)
                </text>
              </g>
              <g onClick={() => setSelectedEvent('rank2-compute2')} className="cursor-pointer">
                <rect x="454" y="156" width="130" height="22" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="519" y="170" textAnchor="middle" className="fill-current" fontSize="8">COMPUTE (23ms)</text>
              </g>
            </svg>
          </div>

          {/* Diagnosis Box */}
          <div className="border border-black dark:border-white p-4 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-black/20 dark:border-white/20 pb-2">
              <span className="font-bold uppercase tracking-wider text-[11px]">AUTOMATIC WAIT-STATE ANALYSIS (SCALASCA DIAGNOSTIC):</span>
              <span className="px-2 py-0.5 border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-bold text-[10px]">
                BOTTLENECK DETECTED
              </span>
            </div>

            {selectedEvent === 'rank1-recv' || selectedEvent === 'rank2-recv' ? (
              <div className="space-y-1">
                <div className="text-sm font-bold">Pattern: Late Sender (Wait at Receive)</div>
                <p className="opacity-80">
                  Rank 1 and Rank 2 posted their blocking <code>MPI_Recv</code> calls at t = 20ms and t = 35ms, respectively. However, <strong>Rank 0 was still busy computing</strong> its heavy workload until t = 60ms and did not post <code>MPI_Send</code> until t = 60ms.
                </p>
                <div className="pt-2 text-[11px] font-bold">
                  Recommended Remedy: Rebalance domain decomposition so Rank 0 has a smaller partition, or use non-blocking <code>MPI_Irecv</code> to overlap communication with useful work.
                </div>
              </div>
            ) : selectedEvent === 'rank0-compute' ? (
              <div className="space-y-1">
                <div className="text-sm font-bold">Event: Rank 0 Computational Kernel</div>
                <p className="opacity-80">
                  Rank 0 executed 60ms of continuous computation. Because it processed more grid cells than Ranks 1 and 2, it delayed the subsequent point-to-point synchronization across the entire communicator.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm font-bold">Event: Point-to-Point Synchronization</div>
                <p className="opacity-80">
                  Select the dashed rectangles on Rank 1 or Rank 2 above to inspect why they are idling.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Profiling View */
        <div className="space-y-4 my-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider">AGGREGATED FLAT PROFILE (GPROF / SCORE-P SUMMARY):</span>
            <span className="text-[10px] opacity-70">Total Wall Time: 105 ms</span>
          </div>

          <div className="border border-black dark:border-white overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black dark:border-white bg-black/5 dark:bg-white/5 font-bold">
                  <th className="p-3 border-r border-black/20 dark:border-white/20">Function Name</th>
                  <th className="p-3 border-r border-black/20 dark:border-white/20">Calls</th>
                  <th className="p-3 border-r border-black/20 dark:border-white/20">Exclusive Time</th>
                  <th className="p-3 border-r border-black/20 dark:border-white/20">% Time</th>
                  <th className="p-3">What Flat Profiling Misses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10 font-mono text-[11px]">
                <tr>
                  <td className="p-3 border-r border-black/20 dark:border-white/20 font-bold">compute_kernel()</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20">5</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20">163 ms</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20 font-bold">66.5%</td>
                  <td className="p-3 font-sans opacity-70">Misses the extreme computational load imbalance on Rank 0</td>
                </tr>
                <tr className="bg-black/5 dark:bg-white/5">
                  <td className="p-3 border-r border-black/20 dark:border-white/20 font-bold">MPI_Recv()</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20">2</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20">77 ms</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20 font-bold">31.4%</td>
                  <td className="p-3 font-sans text-red-600 dark:text-red-400 font-bold">
                    Shows 77ms spent in receive, but cannot reveal WHEN or WHY ranks waited!
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r border-black/20 dark:border-white/20 font-bold">MPI_Send()</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20">2</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20">5 ms</td>
                  <td className="p-3 border-r border-black/20 dark:border-white/20 font-bold">2.1%</td>
                  <td className="p-3 font-sans opacity-70">Overhead is small, hiding the delay it caused to receivers</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 border border-black/40 dark:border-white/40 text-xs opacity-90">
            <strong>Key Insight for CSS 311 Exam:</strong> Flat profiling aggregates runtime over the entire execution into static numbers. It reveals <em>which functions took time</em>, but completely misses <em>temporal dynamics</em>, timeline ordering, and wait states. Tracing records timestamped logs of every event, allowing tools like Scalasca and Vampir to prove causality (e.g. Late Sender).
          </div>
        </div>
      )}
    </div>
  );
}
