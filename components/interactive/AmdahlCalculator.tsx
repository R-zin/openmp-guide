'use client';

import React, { useState } from 'react';

export function AmdahlCalculator() {
  const [parallelFraction, setParallelFraction] = useState<number>(0.90); // 90%
  const [cores, setCores] = useState<number>(16);
  const [showGustafson, setShowGustafson] = useState<boolean>(true);

  // Amdahl calculation
  // S = 1 / ((1 - P) + P / N)
  const serialFraction = 1 - parallelFraction;
  const amdahlSpeedup = 1 / (serialFraction + parallelFraction / cores);
  const maxPossibleSpeedup = 1 / serialFraction;
  const parallelEfficiency = (amdahlSpeedup / cores) * 100;

  // Gustafson calculation
  // S = (1 - P) + P * N
  const gustafsonSpeedup = serialFraction + parallelFraction * cores;

  // Generate SVG curve points for N = 1 to 64
  const maxN = 64;
  const chartWidth = 500;
  const chartHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };

  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  // Maximum Y for chart scaling
  const chartMaxY = Math.max(maxPossibleSpeedup * 1.15, showGustafson ? 40 : 20);

  // Compute points
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

  // Current selected point coordinates
  const currentPx = padding.left + ((cores - 1) / (maxN - 1)) * innerW;
  const currentPy = padding.top + innerH - (amdahlSpeedup / chartMaxY) * innerH;

  // Asymptote Y line
  const asymptoteY = padding.top + innerH - (maxPossibleSpeedup / chartMaxY) * innerH;

  return (
    <div className="my-8 border border-[#000000] dark:border-[#FFFFFF] p-5 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            AMDAHL&apos;S LAW CALCULATOR & SCALING CURVES
          </span>
          <p className="text-xs text-[#737373] mt-1 font-sans">
            Evaluate parallel speedup, diminishing returns, and the asymptotic serial bottleneck.
          </p>
        </div>
        <span className="text-xs px-2 py-0.5 border border-[#000000] dark:border-[#FFFFFF] uppercase">
          FORMULA: 1 / ((1 - P) + P/N)
        </span>
      </div>

      {/* Sliders & Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-xs">
        <div>
          <div className="flex justify-between text-[#737373] mb-1">
            <span>PARALLEL PORTION (P):</span>
            <span className="text-[#000000] dark:text-[#FFFFFF] font-bold">
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
            className="w-full accent-black dark:accent-white"
          />
          <div className="text-[10px] text-[#737373] mt-1">
            Serial Bottleneck (1 - P): {(serialFraction * 100).toFixed(1)}%
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[#737373] mb-1">
            <span>PROCESSOR CORES (N):</span>
            <span className="text-[#000000] dark:text-[#FFFFFF] font-bold">
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
            className="w-full accent-black dark:accent-white"
          />
          <div className="text-[10px] text-[#737373] mt-1">
            Range: 1 to 64 cores
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center space-x-2 text-xs text-[#000000] dark:text-[#FFFFFF] cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={showGustafson}
              onChange={(e) => setShowGustafson(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            <span className="uppercase text-[11px]">COMPARE GUSTAFSON&apos;S LAW</span>
          </label>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F5F5F5] dark:bg-[#121212]">
          <div className="text-[10px] text-[#737373] uppercase">AMDAHL SPEEDUP</div>
          <div className="text-lg font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">
            {amdahlSpeedup.toFixed(2)}x
          </div>
        </div>
        <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F5F5F5] dark:bg-[#121212]">
          <div className="text-[10px] text-[#737373] uppercase">ASYMPTOTIC LIMIT (N&rarr;&infin;)</div>
          <div className="text-lg font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">
            {maxPossibleSpeedup.toFixed(2)}x
          </div>
        </div>
        <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F5F5F5] dark:bg-[#121212]">
          <div className="text-[10px] text-[#737373] uppercase">PARALLEL EFFICIENCY</div>
          <div className="text-lg font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">
            {parallelEfficiency.toFixed(1)}%
          </div>
        </div>
        <div className="border border-[#E5E5E5] dark:border-[#262626] p-3 bg-[#F5F5F5] dark:bg-[#121212]">
          <div className="text-[10px] text-[#737373] uppercase">GUSTAFSON SCALED SPEEDUP</div>
          <div className="text-lg font-bold mt-1 text-[#000000] dark:text-[#FFFFFF]">
            {gustafsonSpeedup.toFixed(2)}x
          </div>
        </div>
      </div>

      {/* Minimalist Monochrome SVG Chart */}
      <div className="border border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF] dark:bg-[#080808] p-3">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto text-[#000000] dark:text-[#FFFFFF]">
          {/* Grid lines and axes */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom}
            stroke="currentColor"
            strokeWidth="1.5"
          />

          {/* Theoretical Asymptote Line */}
          {asymptoteY >= padding.top && (
            <g>
              <line
                x1={padding.left}
                y1={asymptoteY}
                x2={chartWidth - padding.right}
                y2={asymptoteY}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="opacity-50"
              />
              <text
                x={chartWidth - padding.right}
                y={asymptoteY - 4}
                textAnchor="end"
                fontSize="9"
                fontFamily="monospace"
                fill="currentColor"
                className="opacity-75"
              >
                Max Limit = {maxPossibleSpeedup.toFixed(1)}x
              </text>
            </g>
          )}

          {/* Gustafson Curve if enabled */}
          {showGustafson && (
            <path
              d={pathGustafson}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              className="opacity-40"
            />
          )}

          {/* Amdahl Curve */}
          <path
            d={pathAmdahl}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* Current Selection Marker */}
          <rect
            x={currentPx - 4}
            y={currentPy - 4}
            width="8"
            height="8"
            fill="currentColor"
          />

          {/* X Axis labels */}
          <text x={padding.left} y={chartHeight - 10} fontSize="10" fontFamily="monospace" fill="currentColor">
            1
          </text>
          <text x={padding.left + innerW / 2} y={chartHeight - 10} fontSize="10" fontFamily="monospace" textAnchor="middle" fill="currentColor">
            N = 32 Cores
          </text>
          <text x={chartWidth - padding.right} y={chartHeight - 10} fontSize="10" fontFamily="monospace" textAnchor="end" fill="currentColor">
            64
          </text>

          {/* Y Axis labels */}
          <text x={padding.left - 8} y={chartHeight - padding.bottom} fontSize="10" fontFamily="monospace" textAnchor="end" fill="currentColor">
            1x
          </text>
          <text x={padding.left - 8} y={padding.top + 10} fontSize="10" fontFamily="monospace" textAnchor="end" fill="currentColor">
            {chartMaxY.toFixed(0)}x
          </text>
        </svg>

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-[#737373] mt-2 pt-2 border-t border-[#E5E5E5] dark:border-[#262626]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-4 h-0.5 bg-[#000000] dark:bg-[#FFFFFF] inline-block" />
              <span>Amdahl (Fixed Problem Size)</span>
            </span>
            {showGustafson && (
              <span className="flex items-center space-x-1">
                <span className="w-4 h-0.5 border-t border-dashed border-[#000000] dark:border-[#FFFFFF] inline-block" />
                <span>Gustafson (Scaled Problem Size)</span>
              </span>
            )}
          </div>
          <span>Point: ({cores} cores &rarr; {amdahlSpeedup.toFixed(2)}x)</span>
        </div>
      </div>
    </div>
  );
}
