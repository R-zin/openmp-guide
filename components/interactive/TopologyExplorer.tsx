'use client';

import React, { useState } from 'react';

type TopologyKey =
  | 'completely-connected'
  | 'star'
  | 'linear-array'
  | 'ring'
  | 'mesh-2d'
  | 'torus-2d'
  | 'hypercube'
  | 'binary-tree'
  | 'k-ary-d-cube';

interface TopologyInfo {
  name: string;
  validateP: (p: number) => { valid: boolean; reason?: string };
  compute: (p: number, extra?: any) => {
    diameter: number | string;
    bisection: number | string;
    degree: number | string;
    links: number | string;
    notes: string;
  };
}

const TOPOLOGIES: Record<TopologyKey, TopologyInfo> = {
  'completely-connected': {
    name: 'Completely Connected',
    validateP: (p) => ({ valid: p >= 2, reason: 'p must be >= 2' }),
    compute: (p) => ({
      diameter: 1,
      bisection: Math.floor((p * p) / 4),
      degree: p - 1,
      links: (p * (p - 1)) / 2,
      notes: 'Links scale as O(p^2). Non-scalable for large p.',
    }),
  },
  star: {
    name: 'Star Network',
    validateP: (p) => ({ valid: p >= 3, reason: 'p must be >= 3' }),
    compute: (p) => ({
      diameter: 2,
      bisection: 1,
      degree: `Hub: ${p - 1}, Leafs: 1`,
      links: p - 1,
      notes: 'Central hub is a single-point-of-failure and bisection bottleneck.',
    }),
  },
  'linear-array': {
    name: 'Linear Array (1D)',
    validateP: (p) => ({ valid: p >= 2, reason: 'p must be >= 2' }),
    compute: (p) => ({
      diameter: p - 1,
      bisection: 1,
      degree: 'Interior: 2, Endpoints: 1',
      links: p - 1,
      notes: 'Simple wiring, but latency scales linearly with p.',
    }),
  },
  ring: {
    name: 'Ring (|C| = p)',
    validateP: (p) => ({ valid: p >= 3, reason: 'p must be >= 3' }),
    compute: (p) => ({
      diameter: Math.floor(p / 2),
      bisection: 2,
      degree: 2,
      links: p,
      notes: 'Wraparound link halves the linear array diameter.',
    }),
  },
  'mesh-2d': {
    name: '2-D Mesh (No Wraparound)',
    validateP: (p) => {
      const s = Math.round(Math.sqrt(p));
      return {
        valid: s * s === p && p >= 4,
        reason: 'p must be a perfect square (e.g., 4, 9, 16, 64)',
      };
    },
    compute: (p) => {
      const s = Math.round(Math.sqrt(p));
      return {
        diameter: 2 * (s - 1),
        bisection: s,
        degree: 'Interior: 4, Boundary: 3, Corners: 2',
        links: 2 * (p - s),
        notes: `For ${s}x${s} mesh: 2(sqrt(p)-1) hops between opposing corners.`,
      };
    },
  },
  'torus-2d': {
    name: '2-D Torus (Wraparound Mesh)',
    validateP: (p) => {
      const s = Math.round(Math.sqrt(p));
      return {
        valid: s * s === p && p >= 4,
        reason: 'p must be a perfect square (e.g., 4, 9, 16, 64)',
      };
    },
    compute: (p) => {
      const s = Math.round(Math.sqrt(p));
      return {
        diameter: 2 * Math.floor(s / 2),
        bisection: 2 * s,
        degree: 4,
        links: 2 * p,
        notes: 'Symmetric regular degree 4. Wraparound doubles bisection width.',
      };
    },
  },
  hypercube: {
    name: 'd-Dimensional Hypercube',
    validateP: (p) => {
      const d = Math.round(Math.log2(p));
      return {
        valid: Math.pow(2, d) === p && p >= 2,
        reason: 'p must be a power of 2 (e.g., 2, 4, 8, 16, 64, 1024)',
      };
    },
    compute: (p) => {
      const d = Math.round(Math.log2(p));
      return {
        diameter: d,
        bisection: p / 2,
        degree: d,
        links: (p * d) / 2,
        notes: `Dimension d = log2(p) = ${d}. Rich bisection width scales as O(p).`,
      };
    },
  },
  'binary-tree': {
    name: 'Complete Binary Tree',
    validateP: (p) => {
      // p = 2^k - 1 (processors at all nodes)
      const isFull = (p > 1) && ((p + 1) & p) === 0;
      return {
        valid: isFull,
        reason: 'p must be 2^k - 1 (e.g., 3, 7, 15, 31, 63)',
      };
    },
    compute: (p) => {
      const k = Math.round(Math.log2(p + 1));
      return {
        diameter: 2 * (k - 1),
        bisection: 1,
        degree: 'Root: 2, Internal: 3, Leaf: 1',
        links: p - 1,
        notes: 'Root link is a major bottleneck (bisection width = 1).',
      };
    },
  },
  'k-ary-d-cube': {
    name: 'k-ary d-cube (Wraparound)',
    validateP: (p) => ({ valid: p >= 4, reason: 'p must be k^d' }),
    compute: (p) => {
      // Default to d=3, k=cbrt(p) if cubic
      const k = Math.round(Math.cbrt(p));
      const d = 3;
      if (k * k * k === p) {
        return {
          diameter: d * Math.floor(k / 2),
          bisection: 2 * Math.pow(k, d - 1),
          degree: 2 * d,
          links: d * p,
          notes: `Evaluated as 3-cube with k=${k}: Diameter=${d * Math.floor(k / 2)}, Links=${d * p}`,
        };
      }
      return {
        diameter: 'd * floor(k/2)',
        bisection: '2 * k^(d-1)',
        degree: '2d',
        links: 'd * p',
        notes: 'General formula: diameter = d*floor(k/2), bisection = 2k^(d-1), degree = 2d, links = dp.',
      };
    },
  },
};

export function TopologyExplorer() {
  const [selectedTopology, setSelectedTopology] = useState<TopologyKey>('hypercube');
  const [pInput, setPInput] = useState<number>(8);

  const topo = TOPOLOGIES[selectedTopology];
  const validation = topo.validateP(pInput);
  const metrics = validation.valid ? topo.compute(pInput) : null;

  return (
    <div className="my-8 border border-black dark:border-white bg-white dark:bg-black p-4 sm:p-6 text-black dark:text-white font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black dark:border-white gap-3">
        <div>
          <span className="text-[10px] tracking-widest uppercase opacity-60">INTERACTIVE // ARCHITECTURE</span>
          <h3 className="text-base sm:text-lg font-bold">INTERCONNECTION TOPOLOGY EXPLORER</h3>
        </div>
        <div className="text-xs px-2 py-1 bg-black text-white dark:bg-white dark:text-black font-bold">
          LIVE METRICS CALC
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">
              Select Topology:
            </label>
            <select
              value={selectedTopology}
              onChange={(e) => {
                const key = e.target.value as TopologyKey;
                setSelectedTopology(key);
                if (key === 'hypercube') setPInput(8);
                else if (key === 'mesh-2d' || key === 'torus-2d') setPInput(16);
                else if (key === 'binary-tree') setPInput(7);
                else if (key === 'k-ary-d-cube') setPInput(27);
                else setPInput(8);
              }}
              className="w-full bg-white dark:bg-black border border-black dark:border-white p-2 text-xs font-mono text-black dark:text-white focus:outline-none"
            >
              {Object.entries(TOPOLOGIES).map(([k, val]) => (
                <option key={k} value={k}>
                  {val.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">
              Number of Processors / Nodes (p):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={2}
                max={4096}
                value={pInput}
                onChange={(e) => setPInput(parseInt(e.target.value) || 2)}
                className="w-32 bg-white dark:bg-black border border-black dark:border-white p-2 text-xs font-mono text-black dark:text-white focus:outline-none"
              />
              <div className="flex flex-wrap gap-1 text-[11px]">
                {selectedTopology === 'hypercube' && (
                  [4, 8, 16, 64, 1024].map((v) => (
                    <button
                      key={v}
                      onClick={() => setPInput(v)}
                      className="px-2 py-1 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      {v}
                    </button>
                  ))
                )}
                {(selectedTopology === 'mesh-2d' || selectedTopology === 'torus-2d') && (
                  [4, 9, 16, 64].map((v) => (
                    <button
                      key={v}
                      onClick={() => setPInput(v)}
                      className="px-2 py-1 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      {v}
                    </button>
                  ))
                )}
                {selectedTopology === 'binary-tree' && (
                  [3, 7, 15, 31, 63].map((v) => (
                    <button
                      key={v}
                      onClick={() => setPInput(v)}
                      className="px-2 py-1 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      {v}
                    </button>
                  ))
                )}
                {selectedTopology === 'k-ary-d-cube' && (
                  [8, 27, 64].map((v) => (
                    <button
                      key={v}
                      onClick={() => setPInput(v)}
                      className="px-2 py-1 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      {v}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {!validation.valid ? (
            <div className="p-3 border border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs">
              <strong>INVALID INPUT:</strong> {validation.reason}
            </div>
          ) : (
            <div className="p-3 border border-black dark:border-white bg-black/5 dark:bg-white/5 text-xs space-y-1">
              <div className="font-bold uppercase tracking-wider text-[10px]">ANALYSIS SUMMARY</div>
              <p className="text-xs">{metrics?.notes}</p>
            </div>
          )}
        </div>

        {/* Output Metrics Grid */}
        <div className="border border-black dark:border-white p-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider border-b border-black dark:border-white pb-2">
            CALCULATED NETWORK METRICS (p = {pInput})
          </div>

          {validation.valid && metrics ? (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="border border-black/20 dark:border-white/20 p-2.5">
                <span className="text-[10px] uppercase opacity-70 block">DIAMETER</span>
                <span className="text-lg font-bold block">{metrics.diameter}</span>
                <span className="text-[9px] opacity-60">Max shortest-path hops</span>
              </div>
              <div className="border border-black/20 dark:border-white/20 p-2.5">
                <span className="text-[10px] uppercase opacity-70 block">BISECTION WIDTH</span>
                <span className="text-lg font-bold block">{metrics.bisection}</span>
                <span className="text-[9px] opacity-60">Min cut to halve nodes</span>
              </div>
              <div className="border border-black/20 dark:border-white/20 p-2.5">
                <span className="text-[10px] uppercase opacity-70 block">NODE DEGREE</span>
                <span className="text-sm font-bold block">{metrics.degree}</span>
                <span className="text-[9px] opacity-60">Links per node (switch cost)</span>
              </div>
              <div className="border border-black/20 dark:border-white/20 p-2.5">
                <span className="text-[10px] uppercase opacity-70 block">NETWORK COST (LINKS)</span>
                <span className="text-lg font-bold block">{metrics.links}</span>
                <span className="text-[9px] opacity-60">Total physical links |C|</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs opacity-50">
              Provide valid parameters to display metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
