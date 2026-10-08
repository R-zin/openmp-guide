'use client';

import React, { useState } from 'react';

type Scenario = 'symmetric-send' | 'odd-even' | 'sendrecv';
type MessageSize = 'small' | 'large';

export function DeadlockSimulator() {
  const [scenario, setScenario] = useState<Scenario>('symmetric-send');
  const [msgSize, setMsgSize] = useState<MessageSize>('large');

  // Determine state based on scenario and message size
  const isDeadlocked = scenario === 'symmetric-send' && msgSize === 'large';
  const isUnsafeSuccess = scenario === 'symmetric-send' && msgSize === 'small';

  return (
    <div className="my-8 border border-[#000000] dark:border-[#FFFFFF] p-5 bg-[#FFFFFF] dark:bg-[#000000] font-mono">
      <div className="flex flex-wrap items-center justify-between border-b border-[#E5E5E5] dark:border-[#262626] pb-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#000000] dark:text-[#FFFFFF]">
            INTERACTIVE SIMULATOR // MPI DEADLOCK & PROTOCOL DYNAMICS
          </span>
          <p className="text-xs text-[#737373] mt-1 font-sans">
            Understand blocking semantics, eager buffer thresholds vs rendezvous deadlocks.
          </p>
        </div>
        <span
          className={`text-[11px] px-2 py-0.5 border uppercase font-bold ${
            isDeadlocked
              ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]'
              : 'border-[#737373] text-[#737373]'
          }`}
        >
          {isDeadlocked ? '[!] DEADLOCK' : isUnsafeSuccess ? '[?] UNSAFE (EAGER BUFFER)' : '[OK] SAFE'}
        </span>
      </div>

      {/* Control selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
        <div>
          <label className="block text-[#737373] uppercase mb-1">
            COMMUNICATION PATTERN:
          </label>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setScenario('symmetric-send')}
              className={`text-left p-2 border uppercase ${
                scenario === 'symmetric-send'
                  ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]'
                  : 'border-[#E5E5E5] dark:border-[#262626] text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              1. Both Send First (MPI_Send &rarr; MPI_Recv)
            </button>
            <button
              onClick={() => setScenario('odd-even')}
              className={`text-left p-2 border uppercase ${
                scenario === 'odd-even'
                  ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]'
                  : 'border-[#E5E5E5] dark:border-[#262626] text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              2. Odd-Even Inversion (Rank 0 sends, Rank 1 receives)
            </button>
            <button
              onClick={() => setScenario('sendrecv')}
              className={`text-left p-2 border uppercase ${
                scenario === 'sendrecv'
                  ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]'
                  : 'border-[#E5E5E5] dark:border-[#262626] text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              3. MPI_Sendrecv (Atomic Single Routine)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[#737373] uppercase mb-1">
            MESSAGE PAYLOAD SIZE:
          </label>
          <div className="flex border border-[#000000] dark:border-[#FFFFFF] mb-3">
            <button
              onClick={() => setMsgSize('small')}
              className={`flex-1 py-2 text-center uppercase ${
                msgSize === 'small'
                  ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                  : 'text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              SMALL (&lt; Eager Buffer, e.g. 1 int)
            </button>
            <button
              onClick={() => setMsgSize('large')}
              className={`flex-1 py-2 text-center uppercase ${
                msgSize === 'large'
                  ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                  : 'text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              LARGE (&gt; Threshold, 1MB Array)
            </button>
          </div>

          <div className="p-3 border border-[#E5E5E5] dark:border-[#262626] bg-[#F5F5F5] dark:bg-[#121212] text-[11px] text-[#737373]">
            {msgSize === 'small' ? (
              <p>
                <strong>Eager Protocol:</strong> Small messages copy directly into the MPI system buffer. <code>MPI_Send</code> may return before receiver posts <code>MPI_Recv</code>.
              </p>
            ) : (
              <p>
                <strong>Rendezvous Protocol:</strong> Large messages require handshake acknowledgment before sending payload. <code>MPI_Send</code> blocks until receiver arrives.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Process State Visualizer */}
      <div className="border border-[#E5E5E5] dark:border-[#262626] p-4 bg-[#F5F5F5] dark:bg-[#0C0C0C]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Rank 0 */}
          <div className="border border-[#000000] dark:border-[#FFFFFF] p-3 bg-[#FFFFFF] dark:bg-[#000000]">
            <div className="flex justify-between items-center border-b border-[#E5E5E5] dark:border-[#262626] pb-2 mb-2">
              <span className="font-bold text-xs">PROCESS RANK 0</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 border ${
                  isDeadlocked
                    ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                    : 'border-[#737373] text-[#737373]'
                }`}
              >
                {isDeadlocked ? 'BLOCKED IN SEND' : 'COMPLETED'}
              </span>
            </div>
            <div className="text-xs space-y-1">
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
          <div className="border border-[#000000] dark:border-[#FFFFFF] p-3 bg-[#FFFFFF] dark:bg-[#000000]">
            <div className="flex justify-between items-center border-b border-[#E5E5E5] dark:border-[#262626] pb-2 mb-2">
              <span className="font-bold text-xs">PROCESS RANK 1</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 border ${
                  isDeadlocked
                    ? 'border-[#000000] dark:border-[#FFFFFF] bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold'
                    : 'border-[#737373] text-[#737373]'
                }`}
              >
                {isDeadlocked ? 'BLOCKED IN SEND' : 'COMPLETED'}
              </span>
            </div>
            <div className="text-xs space-y-1">
              <div>
                Call 1:{' '}
                <code>
                  {scenario === 'odd-even'
                    ? 'MPI_Recv(&msg, src=0)'
                    : scenario === 'sendrecv'
                    ? 'MPI_Sendrecv(send_1, recv_0)'
                    : 'MPI_Send(&msg, dest=0)'}
                </code>
              </div>
              {scenario !== 'sendrecv' && (
                <div>
                  Call 2:{' '}
                  <code>
                    {scenario === 'odd-even'
                      ? 'MPI_Send(&msg, dest=0)'
                      : 'MPI_Recv(&msg, src=0)'}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#262626] text-xs">
          {isDeadlocked && (
            <div className="text-[#000000] dark:text-[#FFFFFF]">
              <span className="font-bold mr-2">[!] SYSTEM STATE: DEADLOCKED!</span>
              Both ranks called blocking <code>MPI_Send</code> simultaneously for large payloads. Rank 0 waits for Rank 1 to post a matching receive, while Rank 1 waits for Rank 0. Neither can proceed to line 2. Program hangs forever.
            </div>
          )}
          {isUnsafeSuccess && (
            <div className="text-[#737373] dark:text-[#A3A3A3]">
              <span className="font-bold text-[#000000] dark:text-[#FFFFFF] mr-2">[?] OBSERVATION: APPARENT SUCCESS (UNSAFE CODE):</span>
              The small message fits in the internal eager buffer, so <code>MPI_Send</code> returned immediately. The program executed today, but <strong>this is an unsafe non-conforming program</strong>: increasing the array size in production or changing MPI implementations will deadlock immediately!
            </div>
          )}
          {(scenario === 'odd-even' || scenario === 'sendrecv') && (
            <div className="text-[#000000] dark:text-[#FFFFFF]">
              <span className="font-bold mr-2">[OK] SYSTEM STATE: PROVABLY DEADLOCK-FREE:</span>
              {scenario === 'odd-even'
                ? 'Odd/Even ordering ensures matching complementary pairs: Rank 0 sends while Rank 1 receives. Once matched, they alternate.'
                : 'MPI_Sendrecv internally handles simultaneous transmit and receive buffers without dependency cycles.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
