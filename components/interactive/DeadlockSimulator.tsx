'use client';

import React, { useState } from 'react';

type Scenario = 'symmetric-send' | 'odd-even' | 'sendrecv';
type MessageSize = 'small' | 'large';

export function DeadlockSimulator() {
  const [scenario, setScenario] = useState<Scenario>('symmetric-send');
  const [msgSize, setMsgSize] = useState<MessageSize>('large');

  const isDeadlocked = scenario === 'symmetric-send' && msgSize === 'large';
  const isUnsafeSuccess = scenario === 'symmetric-send' && msgSize === 'small';

  return (
    <div className="my-8 apple-card p-6 sm:p-8 rounded-3xl font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Interactive Simulator // Buffering & Protocols
          </span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-0.5">
            MPI Head-to-Head Deadlock Dynamics
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Understand blocking semantics, eager buffer thresholds vs rendezvous deadlocks.
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            isDeadlocked
              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse'
              : isUnsafeSuccess
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          }`}
        >
          {isDeadlocked ? '⚠️ DEADLOCK' : isUnsafeSuccess ? '⚡ UNSAFE (Eager Buffer)' : '✓ SAFE PROTOCOL'}
        </span>
      </div>

      {/* Control Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
        <div>
          <label className="block text-neutral-500 dark:text-neutral-400 font-medium mb-2 uppercase text-[10px] tracking-wider">
            Communication Pattern:
          </label>
          <div className="flex flex-col space-y-2">
            {[
              { id: 'symmetric-send', label: '1. Both Send First (MPI_Send → MPI_Recv)' },
              { id: 'odd-even', label: '2. Odd-Even Inversion (0 sends, 1 receives)' },
              { id: 'sendrecv', label: '3. MPI_Sendrecv (Atomic Single Routine)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setScenario(item.id as Scenario)}
                className={`text-left p-3 rounded-2xl border text-xs font-medium transition-all ${
                  scenario === item.id
                    ? 'border-blue-500 bg-blue-500/[0.08] text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                    : 'border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-neutral-500 dark:text-neutral-400 font-medium mb-2 uppercase text-[10px] tracking-wider">
            Message Payload Size:
          </label>
          <div className="flex p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.06] mb-3">
            <button
              onClick={() => setMsgSize('small')}
              className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${
                msgSize === 'small'
                  ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Small (&lt; Eager Buffer)
            </button>
            <button
              onClick={() => setMsgSize('large')}
              className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${
                msgSize === 'large'
                  ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Large (&gt; Threshold)
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {msgSize === 'small' ? (
              <p>
                <strong className="text-neutral-900 dark:text-white">Eager Protocol:</strong> Small messages copy directly into the MPI system buffer. <code>MPI_Send</code> returns immediately before receiver posts <code>MPI_Recv</code>.
              </p>
            ) : (
              <p>
                <strong className="text-neutral-900 dark:text-white">Rendezvous Protocol:</strong> Large messages require handshake acknowledgment before transmitting payload. <code>MPI_Send</code> blocks until receiver arrives.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Process State Visualizer */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Rank 0 */}
          <div className="rounded-2xl p-4 bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="font-semibold text-xs text-neutral-900 dark:text-white">Process Rank 0</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isDeadlocked
                    ? 'bg-red-500/10 text-red-600'
                    : 'bg-emerald-500/10 text-emerald-600'
                }`}
              >
                {isDeadlocked ? 'BLOCKED IN SEND' : 'COMPLETED'}
              </span>
            </div>
            <div className="text-xs font-mono space-y-1 text-neutral-600 dark:text-neutral-400">
              <div>
                Call 1: <code>{scenario === 'sendrecv' ? 'MPI_Sendrecv(send_0, recv_1)' : 'MPI_Send(&msg, dest=1)'}</code>
              </div>
              {scenario !== 'sendrecv' && (
                <div>
                  Call 2: <code>MPI_Recv(&msg, src=1)</code>
                </div>
              )}
            </div>
          </div>

          {/* Rank 1 */}
          <div className="rounded-2xl p-4 bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.08] shadow-sm">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="font-semibold text-xs text-neutral-900 dark:text-white">Process Rank 1</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isDeadlocked
                    ? 'bg-red-500/10 text-red-600'
                    : 'bg-emerald-500/10 text-emerald-600'
                }`}
              >
                {isDeadlocked ? 'BLOCKED IN SEND' : 'COMPLETED'}
              </span>
            </div>
            <div className="text-xs font-mono space-y-1 text-neutral-600 dark:text-neutral-400">
              <div>
                Call 1: <code>{scenario === 'sendrecv' ? 'MPI_Sendrecv(send_1, recv_0)' : scenario === 'odd-even' ? 'MPI_Recv(&msg, src=0)' : 'MPI_Send(&msg, dest=0)'}</code>
              </div>
              {scenario !== 'sendrecv' && (
                <div>
                  Call 2: <code>{scenario === 'odd-even' ? 'MPI_Send(&msg, dest=0)' : 'MPI_Recv(&msg, src=0)'}</code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
