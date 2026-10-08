'use client';

import React, { useState } from 'react';

export function AmdahlCalculator() {
  const [parallelFraction, setParallelFraction] = useState<number>(0.90);
  const [cores, setCores] = useState<number>(16);
  const [showGustafson, setShowGustafson] = useState<boolean>(true);

  const serialFraction = 1 - parallelFraction;
  const amdahlSpeedup = 1 / (serialFraction + parallelFraction / cores);
  const maxPossibleSpeedup = 1 / serialFraction;
  const parallelEfficiency = (amdahlSpeedup / cores) * 100;

  const gustafsonSpeedup = serialFraction + parallelFraction * cores;

  const maxN = 64;
  const chartWidth = 500;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };

  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const chartMaxY = Math.max(maxPossibleSpeedup * 1.15, showGustafson ? 40 : 20);

  const pointsAmdahl: { x: number; y: number; n: number; s: number }[] = [];
  const pointsGustafson: { x: number; y: number; n: number; s: number }[] = [];

  for (let n = 1; n <= maxN; n++) {
    const sA = 1 / (serialFraction + parallelFraction / n);
    const sG = serialFraction + parallelFraction * n;

    const px = padding.left + ((n - 1) / (maxN - 1)) * innerW;
    const pyA = padding.top + innerH - (sA / chartMaxY) * innerH;
    const pyG = padding.top + innerH - (Math.min(sG, chartMaxY) / chartMaxY) * innerH;

    pointsAmdahl.push({ x: px, y: pyA, n, s: sA });
    pointsGustafson.push({ x: px, y: pyG, n, s: sG });
  }

  const pathAmdahl = pointsAmdahl.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const pathGustafson = pointsGustafson.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const currentPx = padding.left + ((cores - 1) / (maxN - 1)) * innerW;
  const currentPy = padding.top + innerH - (amdahlSpeedup / chartMaxY) * innerH;

  const asymptoteY = padding.top + innerH - (maxPossibleSpeedup / chartMaxY) * innerH;

  return (
    <div className="my-8 apple-card p-6 sm:p-8 rounded-3xl font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Interactive Calculator // Performance Scaling
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-0.5">
            Amdahl&apos;s Law & Scaling Limits
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Evaluate parallel speedup, diminishing returns, and the serial execution bottleneck.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          S = 1 / ((1 - P) + P/N)
        </span>
      </div>

      {/* Sliders & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-xs">
        <div>
          <div className="flex justify-between text-neutral-500 mb-1.5 font-medium">
            <span className="uppercase text-[10px] tracking-wider">Parallel Fraction (P):</span>
            <span className="text-neutral-900 dark:text-white font-bold font-mono">
              {(parallelFraction * 100).toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.99"
            step="0.01"
            value={parallelFraction}
            onChange={(e) => setParallelFraction(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="text-[10px] text-neutral-400 mt-1">
            Serial Bottleneck: {(serialFraction * 100).toFixed(1)}%
          </div>
        </div>

        <div>
          <div className="flex justify-between text-neutral-500 mb-1.5 font-medium">
            <span className="uppercase text-[10px] tracking-wider">Cores (N):</span>
            <span className="text-neutral-900 dark:text-white font-bold font-mono">
              {cores}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="64"
            step="1"
            value={cores}
            onChange={(e) => setCores(parseInt(e.target.value, 10))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="text-[10px] text-neutral-400 mt-1">
            Range: 1 to 64 cores
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center space-x-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer p-2 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
            <input
              type="checkbox"
              checked={showGustafson}
              onChange={(e) => setShowGustafson(e.target.checked)}
              className="accent-blue-600 rounded"
            />
            <span className="font-medium text-xs">Compare Gustafson Weak Scaling</span>
          </label>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Amdahl Speedup</div>
          <div className="text-xl font-bold mt-1 text-blue-600 dark:text-blue-400 font-mono">
            {amdahlSpeedup.toFixed(2)}x
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Asymptotic Limit (N→∞)</div>
          <div className="text-xl font-bold mt-1 text-neutral-900 dark:text-white font-mono">
            {maxPossibleSpeedup.toFixed(2)}x
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Efficiency</div>
          <div className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400 font-mono">
            {parallelEfficiency.toFixed(1)}%
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]">
          <div className="text-[10px] text-neutral-400 uppercase font-semibold">Gustafson Speedup</div>
          <div className="text-xl font-bold mt-1 text-purple-600 dark:text-purple-400 font-mono">
            {gustafsonSpeedup.toFixed(2)}x
          </div>
        </div>
      </div>

      {/* Apple Curve Graph SVG */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-neutral-900 p-4 shadow-inner">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
          {/* Subtle Axes */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-300 dark:text-neutral-700"
          />
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom}
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-300 dark:text-neutral-700"
          />

          {/* Asymptote */}
          {asymptoteY >= padding.top && (
            <g>
              <line
                x1={padding.left}
                y1={asymptoteY}
                x2={chartWidth - padding.right}
                y2={asymptoteY}
                stroke="#FF9500"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="opacity-70"
              />
              <text
                x={chartWidth - padding.right}
                y={asymptoteY - 4}
                textAnchor="end"
                fontSize="9"
                fontFamily="sans-serif"
                fill="#FF9500"
              >
                Max Asymptote ({maxPossibleSpeedup.toFixed(1)}x)
              </text>
            </g>
          )}

          {/* Gustafson Curve */}
          {showGustafson && (
            <path
              d={pathGustafson}
              fill="none"
              stroke="#AF52DE"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              className="opacity-80"
            />
          )}

          {/* Amdahl Curve */}
          <path
            d={pathAmdahl}
            fill="none"
            stroke="#0071E3"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Current selected point marker */}
          <circle
            cx={currentPx}
            cy={currentPy}
            r="5"
            fill="#0071E3"
            stroke="#FFFFFF"
            strokeWidth="2"
            className="shadow-sm"
          />

          {/* Labels */}
          <text
            x={currentPx}
            y={Math.max(padding.top + 10, currentPy - 10)}
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#0071E3"
            fontFamily="sans-serif"
          >
            {amdahlSpeedup.toFixed(2)}x @ {cores} cores
          </text>

          <text
            x={padding.left}
            y={chartHeight - 8}
            fontSize="9"
            fill="#8E8E93"
            fontFamily="sans-serif"
          >
            N=1 core
          </text>
          <text
            x={chartWidth - padding.right}
            y={chartHeight - 8}
            textAnchor="end"
            fontSize="9"
            fill="#8E8E93"
            fontFamily="sans-serif"
          >
            N=64 cores
          </text>
        </svg>

        <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-2 px-1">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Amdahl (Strong Scaling)</span>
            </span>
            {showGustafson && (
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span>Gustafson (Weak Scaling)</span>
              </span>
            )}
          </div>
          <span>Diminishing returns limit: 1 / (1 - P)</span>
        </div>
      </div>
    </div>
  );
}
