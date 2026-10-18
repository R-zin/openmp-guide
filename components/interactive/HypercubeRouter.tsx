'use client';

import React, { useState, useEffect } from 'react';

export function HypercubeRouter() {
  const [dim, setDim] = useState<3 | 4>(3);
  const [source, setSource] = useState<string>('010');
  const [destination, setDestination] = useState<string>('111');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Synchronize when switching dimension
  const handleDimChange = (newDim: 3 | 4) => {
    setDim(newDim);
    if (newDim === 3) {
      setSource('010');
      setDestination('111');
    } else {
      setSource('0110');
      setDestination('1011');
    }
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // E-cube routing calculation
  // XOR source and destination
  const sInt = parseInt(source, 2);
  const dInt = parseInt(destination, 2);
  const xorVal = sInt ^ dInt;
  const xorBin = xorVal.toString(2).padStart(dim, '0');

  // Compute hops: bit 0 (LSB) to bit dim-1 (MSB)
  const path: { node: string; bitFlipped?: number; note: string }[] = [];
  path.push({ node: source, note: 'Source node (Initial hop)' });

  let curr = sInt;
  for (let b = 0; b < dim; b++) {
    // Check if bit b is set in XOR
    if ((xorVal & (1 << b)) !== 0) {
      curr = curr ^ (1 << b);
      path.push({
        node: curr.toString(2).padStart(dim, '0'),
        bitFlipped: b,
        note: `Flip bit ${b} (dimension ${b})`,
      });
    }
  }

  const totalHops = path.length - 1;

  // Auto-play animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalHops) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalHops]);

  // Quick preset buttons
  const applyPreset = (s: string, d: string, dimension: 3 | 4) => {
    setDim(dimension);
    setSource(s);
    setDestination(d);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="my-8 border border-black dark:border-white bg-white dark:bg-black p-4 sm:p-6 text-black dark:text-white font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black dark:border-white gap-3">
        <div>
          <span className="text-[10px] tracking-widest uppercase opacity-60">INTERACTIVE // ROUTING</span>
          <h3 className="text-base sm:text-lg font-bold">HYPERCUBE E-CUBE (DIMENSION-ORDER) ROUTER</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDimChange(3)}
            className={`px-3 py-1 text-xs font-bold border border-black dark:border-white transition-colors ${
              dim === 3
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            3-D (8 NODES)
          </button>
          <button
            onClick={() => handleDimChange(4)}
            className={`px-3 py-1 text-xs font-bold border border-black dark:border-white transition-colors ${
              dim === 4
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            4-D (16 NODES)
          </button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 my-4 text-xs">
        <span className="text-[11px] opacity-70">LECTURE PRESETS:</span>
        <button
          onClick={() => applyPreset('010', '111', 3)}
          className="px-2.5 py-1 border border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white text-[11px]"
        >
          Slide Ex: 010 &rarr; 111 (3-D)
        </button>
        <button
          onClick={() => applyPreset('0110', '1011', 4)}
          className="px-2.5 py-1 border border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white text-[11px]"
        >
          Practice Ex: 0110 &rarr; 1011 (4-D)
        </button>
        <button
          onClick={() => applyPreset('000', '111', 3)}
          className="px-2.5 py-1 border border-black/40 dark:border-white/40 hover:border-black dark:hover:border-white text-[11px]"
        >
          Max Distance: 000 &rarr; 111 (3-D)
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 p-4 border border-black/20 dark:border-white/20 bg-black/[0.02] dark:bg-white/[0.02]">
        <div>
          <label className="block text-xs font-bold uppercase mb-1">Source Node (Binary):</label>
          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="w-full bg-white dark:bg-black border border-black dark:border-white p-2 text-xs font-mono"
          >
            {Array.from({ length: Math.pow(2, dim) }).map((_, i) => {
              const bin = i.toString(2).padStart(dim, '0');
              return (
                <option key={bin} value={bin}>
                  {bin} (Node {i})
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1">Destination Node (Binary):</label>
          <select
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="w-full bg-white dark:bg-black border border-black dark:border-white p-2 text-xs font-mono"
          >
            {Array.from({ length: Math.pow(2, dim) }).map((_, i) => {
              const bin = i.toString(2).padStart(dim, '0');
              return (
                <option key={bin} value={bin}>
                  {bin} (Node {i})
                </option>
              );
            })}
          </select>
        </div>

        <div className="border border-black dark:border-white p-2.5">
          <span className="text-[10px] uppercase opacity-70 block">XOR DIFFERENCE VECTOR</span>
          <span className="text-sm font-bold block tracking-widest">{xorBin}</span>
          <span className="text-[10px] opacity-70">
            Hamming Dist = {totalHops} hops
          </span>
        </div>
      </div>

      {/* Animation & Stepper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 my-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
            disabled={currentStepIndex === 0}
            className="px-3 py-1 border border-black dark:border-white text-xs disabled:opacity-30 hover:bg-black/10 dark:hover:bg-white/10"
          >
            &larr; PREVIOUS
          </button>
          <button
            onClick={() => setCurrentStepIndex((p) => Math.min(totalHops, p + 1))}
            disabled={currentStepIndex >= totalHops}
            className="px-3 py-1 border border-black dark:border-white text-xs disabled:opacity-30 hover:bg-black/10 dark:hover:bg-white/10"
          >
            NEXT STEP &rarr;
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStepIndex >= totalHops && !isPlaying}
            className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-bold"
          >
            {isPlaying ? 'PAUSE' : 'ANIMATE PATH'}
          </button>
          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            className="px-2 py-1 border border-black dark:border-white text-xs hover:bg-black/10 dark:hover:bg-white/10"
          >
            RESET
          </button>
        </div>

        <div className="text-xs">
          PROGRESS: <strong className="font-bold">{currentStepIndex}</strong> OF {totalHops} HOPS
        </div>
      </div>

      {/* Visual Step-by-Step Hop Chain */}
      <div className="my-6 overflow-x-auto p-4 border border-black dark:border-white bg-white dark:bg-black">
        <div className="flex items-center gap-2 sm:gap-4 min-w-max">
          {path.map((hop, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            return (
              <React.Fragment key={idx}>
                <div
                  className={`border p-3 text-center transition-all ${
                    isCurrent
                      ? 'border-2 border-black dark:border-white bg-black/10 dark:bg-white/10 scale-105'
                      : isPassed
                      ? 'border-black/50 dark:border-white/50 bg-black/5 dark:bg-white/5'
                      : 'border-black/20 dark:border-white/20 opacity-40'
                  }`}
                  style={{ minWidth: '120px' }}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider mb-1">
                    {idx === 0 ? 'START' : idx === totalHops ? 'DEST' : `HOP ${idx}`}
                  </div>
                  <div className="text-base font-bold tracking-widest">{hop.node}</div>
                  <div className="text-[9px] mt-1 opacity-80">{hop.note}</div>
                </div>

                {idx < path.length - 1 && (
                  <div className="flex flex-col items-center px-1">
                    <span className="text-[9px] font-bold">flip bit {path[idx + 1].bitFlipped}</span>
                    <span className="text-lg">&rarr;</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Explanatory Rule Callout */}
      <div className="p-3 border border-black/40 dark:border-white/40 text-xs space-y-1">
        <strong className="block text-[11px] uppercase">E-Cube (Dimension-Order) Routing Invariant:</strong>
        <p className="opacity-80">
          The message compares source and destination coordinates via bitwise XOR ($S \oplus D$). Differing dimensions are traversed strictly in increasing order of bit position ($0, 1, 2, \dots$). Because bit differences are resolved monotonically, no circular dependency can arise, guaranteeing <strong>deadlock-free routing</strong> without virtual channels.
        </p>
      </div>
    </div>
  );
}
