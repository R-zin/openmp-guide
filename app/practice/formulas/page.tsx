'use client';

import React from 'react';
import Link from 'next/link';

export default function FormulaSheetPage() {
  return (
    <div className="max-w-[900px] mx-auto space-y-6 font-mono text-black dark:text-white py-4">
      {/* Header Bar */}
      <div className="border border-black dark:border-white p-5 bg-white dark:bg-black">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black dark:border-white pb-3">
          <div>
            <span className="text-[10px] tracking-widest uppercase opacity-70 block">
              IIIT KOTTAYAM // CSS 311 PARALLEL AND DISTRIBUTED COMPUTING
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">
              ONE-PAGE COURSE FORMULA SHEET
            </h1>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black text-xs font-bold print-hide hover:opacity-80 transition-opacity"
          >
            PRINT FORMULA SHEET (PDF)
          </button>
        </div>
        <p className="text-xs opacity-75 mt-2">
          Concise reference sheet covering all mathematical models, network metrics, pipelining speedups, and performance laws.
        </p>
      </div>

      {/* Grid of Formula Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. Amdahl, Gustafson & Scaling */}
        <div className="border border-black dark:border-white p-4 space-y-3 bg-white dark:bg-black">
          <h2 className="font-bold border-b border-black/40 dark:border-white/40 pb-1 text-sm uppercase">
            1. Scaling Laws & Speedup Metrics
          </h2>
          <div className="space-y-2 text-[11px] leading-relaxed">
            <div>
              <span className="font-bold block">Speedup & Efficiency:</span>
              <code>S(p) = T_s / T_p</code> | <code>E(p) = S(p) / p = T_s / (p * T_p)</code>
            </div>
            <div>
              <span className="font-bold block">Parallel Overhead:</span>
              <code>T_o = p * T_p - T_s</code>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Amdahl's Law (Strong Scaling - Fixed Size):</span>
              <code>S(N) = 1 / [ (1 - p) + p / N ] = 1 / [ s + (1 - s) / N ]</code>
              <span className="text-[10px] opacity-70 block">Asymptotic limit: S_inf = 1 / (1 - p) = 1 / s</span>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Gustafson's Law (Weak Scaling - Scaled Size):</span>
              <code>S(N) = s + p * N = N - s(N - 1)</code>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Karp-Flatt Metric (Experimental Serial Fraction):</span>
              <code>e = (1/S - 1/p) / (1 - 1/p)</code>
              <span className="text-[10px] opacity-70 block">Constant e =&gt; serial code; Increasing e =&gt; communication overhead.</span>
            </div>
          </div>
        </div>

        {/* 2. Pipelining & Vector Processing */}
        <div className="border border-black dark:border-white p-4 space-y-3 bg-white dark:bg-black">
          <h2 className="font-bold border-b border-black/40 dark:border-white/40 pb-1 text-sm uppercase">
            2. Pipelining & Vector Processing
          </h2>
          <div className="space-y-2 text-[11px] leading-relaxed">
            <div>
              <span className="font-bold block">Pipeline Execution Cycles (k stages, n tasks):</span>
              <code>T_p = k + n - 1</code> clock cycles
              <span className="text-[10px] opacity-70 block">Unpipelined (sequential): T_n = n * k cycles</span>
            </div>
            <div>
              <span className="font-bold block">Pipeline Speedup & Efficiency:</span>
              <code>S_k = (n * k) / (k + n - 1)</code> | <code>E_k = S_k / k = n / (k + n - 1)</code>
              <span className="text-[10px] opacity-70 block">Asymptotic speedup as n -&gt; inf: S_k -&gt; k</span>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Strip-Mining (n elements, MVL capacity):</span>
              <code>Total Passes = ceil(n / MVL)</code>
              <span className="block">First Pass: <code>VLEN = n % MVL</code> (or MVL if divisible)</span>
              <span className="block">Subsequent Passes: <code>VLEN = MVL</code></span>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Matrix Multiplication Floating-Point Operations:</span>
              <code>Total FLOPs = 2 * n^3</code> (n^3 multiplies + n^3 adds)
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Energy-Delay Product (EDP):</span>
              <code>EDP = Energy * Runtime = E * T = P_avg * T^2</code> (Joules * sec)
            </div>
          </div>
        </div>

        {/* 3. Static Topologies Master Table */}
        <div className="border border-black dark:border-white p-4 space-y-3 bg-white dark:bg-black md:col-span-2">
          <h2 className="font-bold border-b border-black/40 dark:border-white/40 pb-1 text-sm uppercase">
            3. Interconnection Networks Reference Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse font-mono">
              <thead>
                <tr className="border-b border-black dark:border-white text-[10px] uppercase opacity-75">
                  <th className="py-1">Topology</th>
                  <th className="py-1">Diameter (D)</th>
                  <th className="py-1">Bisection (B_w)</th>
                  <th className="py-1">Node Degree</th>
                  <th className="py-1">Total Links (|C|)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                <tr>
                  <td className="py-1 font-bold">Completely Connected</td>
                  <td className="py-1">1</td>
                  <td className="py-1">p^2 / 4</td>
                  <td className="py-1">p - 1</td>
                  <td className="py-1">p(p - 1) / 2</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Star Network</td>
                  <td className="py-1">2</td>
                  <td className="py-1">1</td>
                  <td className="py-1">Hub: p-1, Leaf: 1</td>
                  <td className="py-1">p - 1</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Linear Array</td>
                  <td className="py-1">p - 1</td>
                  <td className="py-1">1</td>
                  <td className="py-1">Interior: 2, End: 1</td>
                  <td className="py-1">p - 1</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Ring (|C| = p)</td>
                  <td className="py-1">floor(p / 2)</td>
                  <td className="py-1">2</td>
                  <td className="py-1">2 (regular)</td>
                  <td className="py-1">p</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">2-D Mesh (s x s)</td>
                  <td className="py-1">2(sqrt(p) - 1)</td>
                  <td className="py-1">sqrt(p)</td>
                  <td className="py-1">Int: 4, Edge: 3, Corn: 2</td>
                  <td className="py-1">2(p - sqrt(p))</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">2-D Torus (wraparound)</td>
                  <td className="py-1">2 * floor(sqrt(p)/2)</td>
                  <td className="py-1">2 * sqrt(p)</td>
                  <td className="py-1">4 (regular)</td>
                  <td className="py-1">2p</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">d-dim Hypercube (p=2^d)</td>
                  <td className="py-1">d = log2(p)</td>
                  <td className="py-1">p / 2</td>
                  <td className="py-1">d = log2(p)</td>
                  <td className="py-1">(p * log2(p)) / 2</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Complete Binary Tree</td>
                  <td className="py-1">2 * log2((p+1)/2)</td>
                  <td className="py-1">1</td>
                  <td className="py-1">Root: 2, Int: 3, Leaf: 1</td>
                  <td className="py-1">p - 1</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Wraparound k-ary d-cube</td>
                  <td className="py-1">d * floor(k / 2)</td>
                  <td className="py-1">2 * k^(d - 1)</td>
                  <td className="py-1">2d</td>
                  <td className="py-1">d * p</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Dynamic Crossbar</td>
                  <td className="py-1">1</td>
                  <td className="py-1">p</td>
                  <td className="py-1">p inputs, p outputs</td>
                  <td className="py-1">p^2 crosspoints</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">Dynamic Omega Network</td>
                  <td className="py-1">log2(p)</td>
                  <td className="py-1">p / 2</td>
                  <td className="py-1">Stages = log2(p)</td>
                  <td className="py-1">(p / 2) * log2(p) switches</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Routing & Mapping */}
        <div className="border border-black dark:border-white p-4 space-y-3 bg-white dark:bg-black">
          <h2 className="font-bold border-b border-black/40 dark:border-white/40 pb-1 text-sm uppercase">
            4. E-Cube Routing & Gray Code Embedding
          </h2>
          <div className="space-y-2 text-[11px] leading-relaxed">
            <div>
              <span className="font-bold block">Hypercube E-Cube Routing:</span>
              <code>R = S XOR D</code>; scan bits from 0 to d-1. Flip differing bits in increasing dimension order.
              <span className="text-[10px] opacity-70 block">Total hops = Hamming distance H(S, D)</span>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Reflected Gray Code Recursive Definition:</span>
              <code>G(i, x+1) = 0 || G(i, x)</code> for i &lt; 2^x
              <code>G(i, x+1) = 1 || G(2^(x+1) - 1 - i, x)</code> for i &gt;= 2^x
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Embedding Metrics:</span>
              <span>Dilation = max host hops per guest edge</span><br/>
              <span>Congestion = max guest edges per host link</span><br/>
              <span>Expansion = host node count / guest node count</span>
            </div>
          </div>
        </div>

        {/* 5. MPI & Numerical Algorithms */}
        <div className="border border-black dark:border-white p-4 space-y-3 bg-white dark:bg-black">
          <h2 className="font-bold border-b border-black/40 dark:border-white/40 pb-1 text-sm uppercase">
            5. MPI Communication & Cannon Algorithm
          </h2>
          <div className="space-y-2 text-[11px] leading-relaxed">
            <div>
              <span className="font-bold block">Point-to-Point Message Transfer Time:</span>
              <code>T = t_s + t_w * m</code>
              <span className="text-[10px] opacity-70 block">t_s: latency/startup; t_w: per-word transfer; m: message words</span>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Cannon's Matrix Multiplication Total Time:</span>
              <code>T_p = n^3/p + 2*sqrt(p)*(t_s + t_w*n^2/p) + 2*(t_s + t_w*n^2/p)</code>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Composite Trapezoidal Numerical Integration:</span>
              <code>h = (b - a) / n</code><br/>
              <code>Trap = (h / 2) * [ f(a) + f(b) + 2 * sum_{'{i=1}'}^{'{n-1}'} f(a + i*h) ]</code>
            </div>
            <div className="border-t border-black/10 dark:border-white/10 pt-1">
              <span className="font-bold block">Parallel Odd-Even Transposition Sort:</span>
              <span>Phases = n phases (alternating Even phase and Odd phase).</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="pt-4 border-t border-black/20 dark:border-white/20 flex justify-between text-xs font-mono print-hide">
        <Link href="/" className="hover:underline">&larr; Back to Home</Link>
        <Link href="/practice/" className="hover:underline">Practice & Mock Exams &rarr;</Link>
      </div>
    </div>
  );
}
