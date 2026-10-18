'use client';

import React, { useState } from 'react';

const GRAY_3BIT = ['000', '001', '011', '010', '110', '111', '101', '100'];
const GRAY_2BIT = ['00', '01', '11', '10'];

export function GrayCodeVisualizer() {
  const [mode, setMode] = useState<'ring' | 'mesh'>('ring');
  const [selectedRingIdx, setSelectedRingIdx] = useState<number>(0);
  const [selectedMeshCoord, setSelectedMeshCoord] = useState<{ r: number; c: number }>({ r: 1, c: 1 });

  // Mesh calculations
  const meshRowGray = GRAY_2BIT[selectedMeshCoord.r];
  const meshColGray = GRAY_2BIT[selectedMeshCoord.c];
  const meshHostNode = `${meshRowGray}${meshColGray}`;

  // Neighbors of mesh node with wraparound
  const northCoord = { r: (selectedMeshCoord.r + 3) % 4, c: selectedMeshCoord.c };
  const southCoord = { r: (selectedMeshCoord.r + 1) % 4, c: selectedMeshCoord.c };
  const westCoord = { r: selectedMeshCoord.r, c: (selectedMeshCoord.c + 3) % 4 };
  const eastCoord = { r: selectedMeshCoord.r, c: (selectedMeshCoord.c + 1) % 4 };

  const getMeshNode = (r: number, c: number) => `${GRAY_2BIT[r]}${GRAY_2BIT[c]}`;

  return (
    <div className="my-8 border border-black dark:border-white bg-white dark:bg-black p-4 sm:p-6 text-black dark:text-white font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black dark:border-white gap-3">
        <div>
          <span className="text-[10px] tracking-widest uppercase opacity-60">INTERACTIVE // GRAPH EMBEDDING</span>
          <h3 className="text-base sm:text-lg font-bold">GRAY CODE TOPOLOGY EMBEDDING</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('ring')}
            className={`px-3 py-1 text-xs font-bold border border-black dark:border-white transition-colors ${
              mode === 'ring'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            RING &rarr; HYPERCUBE
          </button>
          <button
            onClick={() => setMode('mesh')}
            className={`px-3 py-1 text-xs font-bold border border-black dark:border-white transition-colors ${
              mode === 'mesh'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            4x4 MESH &rarr; 4-D HYPERCUBE
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">DILATION</span>
          <span className="text-xl font-bold block">1</span>
          <span className="text-[9px] opacity-60">Max host hops per guest edge</span>
        </div>
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">CONGESTION</span>
          <span className="text-xl font-bold block">1</span>
          <span className="text-[9px] opacity-60">Max guest edges per host link</span>
        </div>
        <div className="border border-black dark:border-white p-2.5 text-center">
          <span className="text-[10px] uppercase opacity-70 block">EXPANSION</span>
          <span className="text-xl font-bold block">1</span>
          <span className="text-[9px] opacity-60">Host nodes / Guest nodes</span>
        </div>
      </div>

      {mode === 'ring' ? (
        <div className="space-y-4 my-4">
          <p className="text-xs opacity-80">
            Click on any Ring Node below to inspect its Binary Reflected Gray Code mapping and verify that neighboring nodes differ by exactly 1 bit.
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {GRAY_3BIT.map((code, idx) => {
              const isSelected = idx === selectedRingIdx;
              const isPrev = (idx === (selectedRingIdx + 7) % 8);
              const isNext = (idx === (selectedRingIdx + 1) % 8);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedRingIdx(idx)}
                  className={`p-3 border text-center transition-all ${
                    isSelected
                      ? 'border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black'
                      : isPrev || isNext
                      ? 'border-black dark:border-white bg-black/10 dark:bg-white/10'
                      : 'border-black/30 dark:border-white/30 hover:border-black dark:hover:border-white'
                  }`}
                >
                  <div className="text-[9px] uppercase font-bold">Ring {idx}</div>
                  <div className="text-sm font-bold tracking-widest mt-1">{code}</div>
                  <div className="text-[8px] mt-1 opacity-70">
                    {isSelected ? 'SELECTED' : isPrev ? 'LEFT NBR' : isNext ? 'RIGHT NBR' : ''}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="border border-black dark:border-white p-4 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px]">
              NEIGHBOR HAMMING DISTANCE VERIFICATION:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2 border border-black/20 dark:border-white/20">
                <span className="text-[10px] opacity-70 block">Left Neighbor (Ring {(selectedRingIdx + 7) % 8})</span>
                <span className="font-bold">{GRAY_3BIT[(selectedRingIdx + 7) % 8]}</span>
                <span className="text-[9px] block text-green-600 dark:text-green-400 font-bold">Hamming Dist = 1</span>
              </div>
              <div className="p-2 border border-black dark:border-white bg-black/5 dark:bg-white/5">
                <span className="text-[10px] opacity-70 block">Selected Node (Ring {selectedRingIdx})</span>
                <span className="font-bold text-base">{GRAY_3BIT[selectedRingIdx]}</span>
                <span className="text-[9px] block opacity-70">Center Node</span>
              </div>
              <div className="p-2 border border-black/20 dark:border-white/20">
                <span className="text-[10px] opacity-70 block">Right Neighbor (Ring {(selectedRingIdx + 1) % 8})</span>
                <span className="font-bold">{GRAY_3BIT[(selectedRingIdx + 1) % 8]}</span>
                <span className="text-[9px] block text-green-600 dark:text-green-400 font-bold">Hamming Dist = 1</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 my-4">
          <p className="text-xs opacity-80">
            Mapping 4x4 mesh nodes $(r, c)$ to 4-D Hypercube nodes via concatenated 2-bit Gray codes: <strong>$G(r, 2) \parallel G(c, 2)$</strong>. Click any cell:
          </p>

          <div className="grid grid-cols-4 gap-2 max-w-[420px] mx-auto">
            {[0, 1, 2, 3].map((r) =>
              [0, 1, 2, 3].map((c) => {
                const isSelected = r === selectedMeshCoord.r && c === selectedMeshCoord.c;
                const isNorth = r === northCoord.r && c === northCoord.c;
                const isSouth = r === southCoord.r && c === southCoord.c;
                const isWest = r === westCoord.r && c === westCoord.c;
                const isEast = r === eastCoord.r && c === eastCoord.c;
                const isNeighbor = isNorth || isSouth || isWest || isEast;

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => setSelectedMeshCoord({ r, c })}
                    className={`p-2 border text-center transition-all ${
                      isSelected
                        ? 'border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black scale-105'
                        : isNeighbor
                        ? 'border-black dark:border-white bg-black/10 dark:bg-white/10'
                        : 'border-black/30 dark:border-white/30 hover:border-black dark:hover:border-white'
                    }`}
                  >
                    <div className="text-[9px]">({r},{c})</div>
                    <div className="text-xs font-bold tracking-widest">{getMeshNode(r, c)}</div>
                  </button>
                );
              })
            )}
          </div>

          <div className="border border-black dark:border-white p-4 bg-black/[0.02] dark:bg-white/[0.02] text-xs space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px]">
              COORDINATE MAPPING & NEIGHBOR ANALYSIS:
            </div>
            <div className="text-xs space-y-1">
              <div>
                Selected Mesh Node: <strong>({selectedMeshCoord.r}, {selectedMeshCoord.c})</strong>
              </div>
              <div>
                Row Gray Code $G({selectedMeshCoord.r}, 2) = $ <code>{meshRowGray}</code> | Col Gray Code $G({selectedMeshCoord.c}, 2) = $ <code>{meshColGray}</code>
              </div>
              <div>
                Concatenated 4-D Hypercube Address: <strong className="text-sm font-bold tracking-widest px-1 bg-black/10 dark:bg-white/10">{meshHostNode}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="border border-black/20 dark:border-white/20 p-2 text-center">
                <span className="text-[9px] opacity-70 block">North ({northCoord.r},{northCoord.c})</span>
                <span className="font-bold">{getMeshNode(northCoord.r, northCoord.c)}</span>
                <span className="text-[8px] block text-green-600 dark:text-green-400 font-bold">1-bit flip (Row)</span>
              </div>
              <div className="border border-black/20 dark:border-white/20 p-2 text-center">
                <span className="text-[9px] opacity-70 block">South ({southCoord.r},{southCoord.c})</span>
                <span className="font-bold">{getMeshNode(southCoord.r, southCoord.c)}</span>
                <span className="text-[8px] block text-green-600 dark:text-green-400 font-bold">1-bit flip (Row)</span>
              </div>
              <div className="border border-black/20 dark:border-white/20 p-2 text-center">
                <span className="text-[9px] opacity-70 block">West ({westCoord.r},{westCoord.c})</span>
                <span className="font-bold">{getMeshNode(westCoord.r, westCoord.c)}</span>
                <span className="text-[8px] block text-green-600 dark:text-green-400 font-bold">1-bit flip (Col)</span>
              </div>
              <div className="border border-black/20 dark:border-white/20 p-2 text-center">
                <span className="text-[9px] opacity-70 block">East ({eastCoord.r},{eastCoord.c})</span>
                <span className="font-bold">{getMeshNode(eastCoord.r, eastCoord.c)}</span>
                <span className="text-[8px] block text-green-600 dark:text-green-400 font-bold">1-bit flip (Col)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theorem Note */}
      <div className="p-3 border border-black/40 dark:border-white/40 text-xs opacity-90">
        <strong>Sub-graph Isomorphism Note:</strong> Because both Dilation = 1 and Congestion = 1, the guest graph (linear array, ring, or wraparound mesh) is an exact <em>subgraph</em> of the host hypercube. Conversely, embedding a 2D mesh into a linear array is impossible without dilation $\Omega(\sqrt{'{'}p{'}'})$ or congestion &gt; 1 due to bisection mismatch ($\sqrt{'{'}p{'}'}$ vs $1$).
      </div>
    </div>
  );
}
