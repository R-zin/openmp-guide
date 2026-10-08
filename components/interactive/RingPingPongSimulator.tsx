'use client';

import React, { useState, useEffect } from 'react';

export function RingPingPongSimulator() {
  const [mode, setMode] = useState<'pingpong' | 'ring'>('ring');
  const [step, setStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Ping-pong max steps: 6 (back and forth)
  // Ring max steps: 5 (Rank 0 -> 1 -> 2 -> 3 -> 0)
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

  // Node positions for ring (4 ranks: 0 top-left, 1 top-right, 2 bottom-right, 3 bottom-left)
  const ringNodes = [
    { rank: 0, x: 80, y: 70 },
    { rank: 1, x: 280, y: 70 },
    { rank: 2, x: 280, y: 210 },
    { rank: 3, x: 80, y: 210 },
  ];

  // Ping pong nodes (Rank 0 at left, Rank 1 at right)
  const ppNodes = [
    { rank: 0, x: 100, y: 140 },
    { rank: 1, x: 260, y: 140 },
  ];

  return (
    <div className="my-8 border border-[#000000] dark:border-[#FFFFFF] p-5 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            INTERACTIVE STEPPER // MPI PING-PONG & RING TOPOLOGY
          </span>
          <p className="text-xs text-[#737373] mt-1 font-sans">
            Follow point-to-point buffer transitions and token increment cycles.
          </p>
        </div>
        <div className="flex border border-[#000000] dark:border-[#FFFFFF] text-xs">
          <button
            onClick={() => handleModeChange('ring')}
            className={`px-3 py-1 uppercase ${
              mode === 'ring'
                ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                : 'text-[#000000] dark:text-[#FFFFFF]'
            }`}
          >
            RING (4 RANKS)
          </button>
          <button
            onClick={() => handleModeChange('pingpong')}
            className={`px-3 py-1 uppercase ${
              mode === 'pingpong'
                ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                : 'text-[#000000] dark:text-[#FFFFFF]'
            }`}
          >
            PING-PONG (2 RANKS)
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex justify-center border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#0C0C0C] py-4">
        {mode === 'ring' ? (
          <svg viewBox="0 0 360 280" className="w-full max-w-[420px] h-auto">
            {/* Ring connection lines */}
            <line x1="80" y1="70" x2="280" y2="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-[#737373]" />
            <line x1="280" y1="70" x2="280" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-[#737373]" />
            <line x1="280" y1="210" x2="80" y2="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-[#737373]" />
            <line x1="80" y1="210" x2="80" y2="70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-[#737373]" />

            {/* Active flight arrow */}
            {step === 1 && (
              <line x1="100" y1="70" x2="250" y2="70" stroke="currentColor" strokeWidth="2.5" className="text-[#000000] dark:text-[#FFFFFF]" />
            )}
            {step === 2 && (
              <line x1="280" y1="90" x2="280" y2="190" stroke="currentColor" strokeWidth="2.5" className="text-[#000000] dark:text-[#FFFFFF]" />
            )}
            {step === 3 && (
              <line x1="260" y1="210" x2="100" y2="210" stroke="currentColor" strokeWidth="2.5" className="text-[#000000] dark:text-[#FFFFFF]" />
            )}
            {step === 4 && (
              <line x1="80" y1="190" x2="80" y2="90" stroke="currentColor" strokeWidth="2.5" className="text-[#000000] dark:text-[#FFFFFF]" />
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
                    fill={isSender ? 'currentColor' : '#FFFFFF'}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={
                      isSender
                        ? 'text-[#000000] dark:text-[#FFFFFF]'
                        : 'text-[#000000] dark:text-[#FFFFFF] fill-white dark:fill-black'
                    }
                  />
                  <text
                    x={node.x}
                    y={node.y - 5}
                    textAnchor="middle"
                    fill={isSender ? '#FFFFFF' : '#000000'}
                    className={isSender ? 'fill-white dark:fill-black font-bold' : 'fill-black dark:fill-white font-bold'}
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    RANK {node.rank}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 12}
                    textAnchor="middle"
                    fill={isSender ? '#FFFFFF' : '#737373'}
                    className={isSender ? 'fill-white dark:fill-black' : 'fill-black dark:fill-white'}
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {isSender ? 'SENDER' : isReceiver ? 'RECEIVER' : 'WAITING'}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <svg viewBox="0 0 360 280" className="w-full max-w-[420px] h-auto">
            {/* Ping pong line */}
            <line x1="100" y1="140" x2="260" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-[#737373]" />
            {step % 2 === 1 ? (
              <line x1="125" y1="130" x2="235" y2="130" stroke="currentColor" strokeWidth="2.5" className="text-[#000000] dark:text-[#FFFFFF]" />
            ) : step > 0 ? (
              <line x1="235" y1="150" x2="125" y2="150" stroke="currentColor" strokeWidth="2.5" className="text-[#000000] dark:text-[#FFFFFF]" />
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
                    fill={isSender ? 'currentColor' : '#FFFFFF'}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={isSender ? 'text-[#000000] dark:text-[#FFFFFF]' : 'text-[#000000] dark:text-[#FFFFFF] fill-white dark:fill-black'}
                  />
                  <text
                    x={node.x}
                    y={node.y - 6}
                    textAnchor="middle"
                    className={isSender ? 'fill-white dark:fill-black font-bold' : 'fill-black dark:fill-white font-bold'}
                    fontSize="12"
                    fontFamily="monospace"
                  >
                    RANK {node.rank}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 12}
                    textAnchor="middle"
                    className={isSender ? 'fill-white dark:fill-black' : 'fill-black dark:fill-white'}
                    fontSize="9"
                    fontFamily="monospace"
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
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="px-3 py-1 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF]"
          >
            RESET
          </button>
          <button
            onClick={handleStep}
            disabled={step >= maxSteps}
            className="px-3 py-1 border border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] disabled:opacity-40"
          >
            STEP FORWARD
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 border border-[#E5E5E5] dark:border-[#262626] hover:border-[#000000] dark:hover:border-[#FFFFFF]"
          >
            {isPlaying ? 'PAUSE' : 'AUTO-PLAY'}
          </button>
        </div>

        <div className="text-[#737373]">
          PHASE: <span className="text-[#000000] dark:text-[#FFFFFF] font-bold">{step} / {maxSteps}</span>
        </div>
      </div>

      {/* Description Box */}
      <div className="mt-4 p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212] text-xs">
        {mode === 'ring' ? (
          <div>
            <div className="font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
              {step === 0 && 'STEP 0: Process 0 initializes token = 10 and sends to neighbor (rank + 1) % size.'}
              {step === 1 && 'STEP 1: Process 1 receives token = 10, increments token to 11, and sends to Process 2.'}
              {step === 2 && 'STEP 2: Process 2 receives token = 11, increments token to 12, and sends to Process 3.'}
              {step === 3 && 'STEP 3: Process 3 receives token = 12, increments token to 13, and sends to Process 0.'}
              {step === 4 && 'STEP 4: Process 0 receives token = 13. Cycle complete! Full ring traversed without deadlock.'}
            </div>
            <div className="text-[#737373]">
              Target logic: <code>dest = (my_rank + 1) % comm_sz; source = (my_rank - 1 + comm_sz) % comm_sz;</code>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-bold text-[#000000] dark:text-[#FFFFFF] mb-1">
              {step === 0 && 'STEP 0: Ready. Rank 0 prepares ping message.'}
              {step % 2 === 1 && `STEP ${step}: PING sent from Rank 0 to Rank 1. (Tag: 0, Ping Count: ${Math.floor(step / 2) + 1})`}
              {step > 0 && step % 2 === 0 && `STEP ${step}: PONG reply sent from Rank 1 back to Rank 0. (Tag: 1)`}
            </div>
            <div className="text-[#737373]">
              Protocol: Synchronous handshake over blocking <code>MPI_Send</code> and <code>MPI_Recv</code>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
