'use client';

import React, { useState, useEffect } from 'react';

export function RingPingPongSimulator() {
  const [mode, setMode] = useState<'pingpong' | 'ring'>('ring');
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const maxSteps = mode === 'pingpong' ? 6 : 4;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => {
          if (prev >= maxSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, maxSteps]);

  const handleModeChange = (newMode: 'pingpong' | 'ring') => {
    setMode(newMode);
    setStep(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const handleStep = () => {
    if (step < maxSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const ringNodes = [
    { rank: 0, x: 80, y: 70 },
    { rank: 1, x: 280, y: 70 },
    { rank: 2, x: 280, y: 210 },
    { rank: 3, x: 80, y: 210 },
  ];

  const ppNodes = [
    { rank: 0, x: 100, y: 140 },
    { rank: 1, x: 260, y: 140 },
  ];

  return (
    <div className="my-8 apple-card p-6 sm:p-8 rounded-3xl font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Interactive Stepper // Network Topology
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-0.5">
            MPI Point-to-Point Token Transfer
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Follow message buffer transitions and token increments across ranks.
          </p>
        </div>
        <div className="flex p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] text-xs">
          <button
            onClick={() => handleModeChange('ring')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              mode === 'ring'
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Ring (4 Ranks)
          </button>
          <button
            onClick={() => handleModeChange('pingpong')}
            className={`px-3.5 py-1 rounded-full font-medium transition-all ${
              mode === 'pingpong'
                ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Ping-Pong (2 Ranks)
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex justify-center rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-4">
        {mode === 'ring' ? (
          <svg viewBox="0 0 360 280" className="w-full max-w-[420px] h-auto">
            {/* Ring connection lines */}
            <line x1="80" y1="70" x2="280" y2="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-neutral-300 dark:text-neutral-700" />
            <line x1="280" y1="70" x2="280" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-neutral-300 dark:text-neutral-700" />
            <line x1="280" y1="210" x2="80" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-neutral-300 dark:text-neutral-700" />
            <line x1="80" y1="210" x2="80" y2="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-neutral-300 dark:text-neutral-700" />

            {/* Active flight arrow */}
            {step === 1 && (
              <line x1="110" y1="70" x2="250" y2="70" stroke="#0071E3" strokeWidth="3" markerEnd="url(#arrow)" />
            )}
            {step === 2 && (
              <line x1="280" y1="100" x2="280" y2="180" stroke="#0071E3" strokeWidth="3" markerEnd="url(#arrow)" />
            )}
            {step === 3 && (
              <line x1="250" y1="210" x2="110" y2="210" stroke="#0071E3" strokeWidth="3" markerEnd="url(#arrow)" />
            )}
            {step === 4 && (
              <line x1="80" y1="180" x2="80" y2="100" stroke="#0071E3" strokeWidth="3" markerEnd="url(#arrow)" />
            )}

            {/* Ring Process Nodes */}
            {ringNodes.map((node) => {
              const isSender = (step === 0 && node.rank === 0) || (step === node.rank);
              const isReceiver = step === (node.rank + 1) % 4 && step > 0;
              return (
                <g key={node.rank}>
                  <rect
                    x={node.x - 30}
                    y={node.y - 30}
                    width="60"
                    height="60"
                    rx="16"
                    fill={isSender ? '#0071E3' : isReceiver ? '#34C759' : '#FFFFFF'}
                    stroke={isSender ? '#0071E3' : isReceiver ? '#34C759' : '#D1D1D6'}
                    strokeWidth="2"
                    className="transition-colors duration-300 shadow-sm"
                  />
                  <text
                    x={node.x}
                    y={node.y - 4}
                    textAnchor="middle"
                    fill={isSender || isReceiver ? '#FFFFFF' : '#1D1D1F'}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    Rank {node.rank}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 12}
                    textAnchor="middle"
                    fill={isSender || isReceiver ? '#EBF5FF' : '#8E8E93'}
                    fontSize="9"
                    fontWeight="500"
                    fontFamily="sans-serif"
                  >
                    {isSender ? 'SENDER' : isReceiver ? 'RECV' : 'WAIT'}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <svg viewBox="0 0 360 280" className="w-full max-w-[420px] h-auto">
            <line x1="100" y1="140" x2="260" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-neutral-300 dark:text-neutral-700" />
            {step % 2 === 1 ? (
              <line x1="135" y1="130" x2="225" y2="130" stroke="#0071E3" strokeWidth="3" />
            ) : step > 0 ? (
              <line x1="225" y1="150" x2="135" y2="150" stroke="#0071E3" strokeWidth="3" />
            ) : null}

            {ppNodes.map((node) => {
              const isSender = (step % 2 === 0 && node.rank === 0) || (step % 2 === 1 && node.rank === 1);
              return (
                <g key={node.rank}>
                  <rect
                    x={node.x - 35}
                    y={node.y - 35}
                    width="70"
                    height="70"
                    rx="18"
                    fill={isSender ? '#0071E3' : '#FFFFFF'}
                    stroke={isSender ? '#0071E3' : '#D1D1D6'}
                    strokeWidth="2"
                    className="transition-colors duration-300"
                  />
                  <text
                    x={node.x}
                    y={node.y - 4}
                    textAnchor="middle"
                    fill={isSender ? '#FFFFFF' : '#1D1D1F'}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    Rank {node.rank}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 12}
                    textAnchor="middle"
                    fill={isSender ? '#EBF5FF' : '#8E8E93'}
                    fontSize="9"
                    fontWeight="500"
                    fontFamily="sans-serif"
                  >
                    {isSender ? 'SENDING' : 'RECEIVING'}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* State & Controls */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 font-medium transition-all"
          >
            Reset
          </button>
          <button
            onClick={handleStep}
            disabled={step >= maxSteps}
            className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-semibold transition-all disabled:opacity-30 shadow-sm"
          >
            Step Forward &rarr;
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-medium transition-all"
          >
            {isPlaying ? 'Pause' : 'Auto Play ▶'}
          </button>
        </div>

        <div className="text-xs text-neutral-400 font-medium">
          Phase: <span className="font-semibold text-neutral-900 dark:text-white font-mono">{step} / {maxSteps}</span>
        </div>
      </div>

      {/* Description Box */}
      <div className="mt-5 p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-xs">
        {mode === 'ring' ? (
          <div className="space-y-1">
            <div className="font-semibold text-neutral-900 dark:text-white">
              {step === 0 && 'Step 0: Process 0 initializes token = 10 and sends to neighbor (rank + 1) % size.'}
              {step === 1 && 'Step 1: Process 1 receives token = 10, increments token to 11, and sends to Process 2.'}
              {step === 2 && 'Step 2: Process 2 receives token = 11, increments token to 12, and sends to Process 3.'}
              {step === 3 && 'Step 3: Process 3 receives token = 12, increments token to 13, and sends to Process 0.'}
              {step === 4 && 'Step 4: Process 0 receives token = 13. Cycle complete! Full ring traversed without deadlock.'}
            </div>
            <div className="text-neutral-500 font-mono text-[11px]">
              dest = (rank + 1) % comm_sz; source = (rank - 1 + comm_sz) % comm_sz;
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="font-semibold text-neutral-900 dark:text-white">
              {step === 0 && 'Step 0: Ready. Rank 0 prepares ping message.'}
              {step % 2 === 1 && `Step ${step}: PING sent from Rank 0 to Rank 1. (Tag: 0, Ping Count: ${Math.floor(step / 2) + 1})`}
              {step > 0 && step % 2 === 0 && `Step ${step}: PONG reply sent from Rank 1 back to Rank 0. (Tag: 1)`}
            </div>
            <div className="text-neutral-500 font-mono text-[11px]">
              Protocol: Synchronous handshake over blocking MPI_Send and MPI_Recv.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
