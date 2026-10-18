import React from 'react';

type DiagramType =
  | 'memory-architecture'
  | 'point-to-point'
  | 'collectives-chooser'
  | 'data-distribution'
  | 'trapezoidal-geometry'
  | 'fork-join'
  | 'false-sharing'
  | 'bfs-dfs-tree'
  | 'completely-connected'
  | 'star-network'
  | 'linear-array-ring'
  | 'mesh-2d-3d'
  | 'hypercube-dimensions'
  | 'tree-fat-tree'
  | 'crossbar-omega'
  | 'ecube-routing'
  | 'gray-code-embedding'
  | 'pipeline-3seg'
  | 'pipeline-spacetime'
  | 'simd-array-vs-vector'
  | 'vmips-architecture'
  | 'performance-workflow'
  | 'sampling-vs-instrumentation'
  | 'profiling-types'
  | 'timeline-tracing'
  | 'scaling-curves';


interface DiagramProps {
  type: DiagramType;
  caption?: string;
}

export function Diagram({ type, caption }: DiagramProps) {
  return (
    <figure className="my-8 border border-[#000000] dark:border-[#FFFFFF] bg-[#FFFFFF] dark:bg-[#000000] p-4 text-[#000000] dark:text-[#FFFFFF]">
      <div className="flex justify-center overflow-x-auto py-2">
        {type === 'memory-architecture' && (
          <svg viewBox="0 0 680 200" className="w-full max-w-[640px] h-auto font-mono text-xs">
            {/* Left: Shared Memory */}
            <g>
              <text x="160" y="24" textAnchor="middle" className="font-bold fill-current" fontSize="11">SHARED MEMORY (SMP / OPENMP)</text>
              {/* Cores */}
              <rect x="40" y="45" width="60" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="70" y="67" textAnchor="middle" className="fill-current" fontSize="10">CORE 0</text>
              <rect x="115" y="45" width="60" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="145" y="67" textAnchor="middle" className="fill-current" fontSize="10">CORE 1</text>
              <rect x="190" y="45" width="60" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="220" y="67" textAnchor="middle" className="fill-current" fontSize="10">CORE 2</text>
              {/* Bus */}
              <line x1="40" y1="110" x2="280" y2="110" stroke="currentColor" strokeWidth="2" />
              <line x1="70" y1="80" x2="70" y2="110" stroke="currentColor" strokeWidth="1.5" />
              <line x1="145" y1="80" x2="145" y2="110" stroke="currentColor" strokeWidth="1.5" />
              <line x1="220" y1="80" x2="220" y2="110" stroke="currentColor" strokeWidth="1.5" />
              <text x="160" y="105" textAnchor="middle" className="fill-current" fontSize="9">HIGH-SPEED SYSTEM BUS</text>
              {/* Shared RAM */}
              <rect x="60" y="130" width="200" height="45" fill="none" stroke="currentColor" strokeWidth="2" />
              <text x="160" y="157" textAnchor="middle" className="font-bold fill-current" fontSize="11">GLOBAL SHARED MEMORY</text>
              <line x1="160" y1="110" x2="160" y2="130" stroke="currentColor" strokeWidth="1.5" />
            </g>

            {/* Middle Divider */}
            <line x1="340" y1="15" x2="340" y2="185" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />

            {/* Right: Distributed Memory */}
            <g>
              <text x="510" y="24" textAnchor="middle" className="font-bold fill-current" fontSize="11">DISTRIBUTED MEMORY (CLUSTER / MPI)</text>
              {/* Node 0 */}
              <rect x="375" y="45" width="120" height="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="435" y="65" textAnchor="middle" className="font-bold fill-current" fontSize="10">NODE 0 (RANK 0)</text>
              <rect x="385" y="75" width="45" height="25" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="407" y="91" textAnchor="middle" className="fill-current" fontSize="8">CPU</text>
              <rect x="440" y="75" width="45" height="25" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="462" y="91" textAnchor="middle" className="fill-current" fontSize="8">RAM 0</text>

              {/* Node 1 */}
              <rect x="525" y="45" width="120" height="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="585" y="65" textAnchor="middle" className="font-bold fill-current" fontSize="10">NODE 1 (RANK 1)</text>
              <rect x="535" y="75" width="45" height="25" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="557" y="91" textAnchor="middle" className="fill-current" fontSize="8">CPU</text>
              <rect x="590" y="75" width="45" height="25" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="612" y="91" textAnchor="middle" className="fill-current" fontSize="8">RAM 1</text>

              {/* Interconnect Network */}
              <rect x="375" y="140" width="270" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="510" y="162" textAnchor="middle" className="font-bold fill-current" fontSize="10">COMMUNICATION NETWORK (INFINIBAND/ETH)</text>
              <line x1="435" y1="115" x2="435" y2="140" stroke="currentColor" strokeWidth="1.5" />
              <line x1="585" y1="115" x2="585" y2="140" stroke="currentColor" strokeWidth="1.5" />
            </g>
          </svg>
        )}

        {type === 'point-to-point' && (
          <svg viewBox="0 0 540 130" className="w-full max-w-[500px] h-auto font-mono text-xs">
            {/* Sender */}
            <rect x="20" y="25" width="140" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="90" y="50" textAnchor="middle" className="font-bold fill-current" fontSize="11">PROCESS A (SENDER)</text>
            <rect x="35" y="65" width="110" height="25" fill="none" stroke="currentColor" strokeWidth="1" />
            <text x="90" y="81" textAnchor="middle" className="fill-current" fontSize="9">User Buffer: [42]</text>

            {/* Receiver */}
            <rect x="380" y="25" width="140" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="450" y="50" textAnchor="middle" className="font-bold fill-current" fontSize="11">PROCESS B (RECV)</text>
            <rect x="395" y="65" width="110" height="25" fill="none" stroke="currentColor" strokeWidth="1" />
            <text x="450" y="81" textAnchor="middle" className="fill-current" fontSize="9">Recv Buffer: [  ]</text>

            {/* Network Channel Arrow */}
            <line x1="160" y1="65" x2="380" y2="65" stroke="currentColor" strokeWidth="2" />
            <polygon points="380,65 370,60 370,70" fill="currentColor" />
            <text x="270" y="55" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Send &rarr; MPI_Recv</text>
            <text x="270" y="85" textAnchor="middle" className="opacity-70 fill-current" fontSize="9">Payload + Tag + Comm</text>
          </svg>
        )}

        {type === 'collectives-chooser' && (
          <svg viewBox="0 0 620 220" className="w-full max-w-[600px] h-auto font-mono text-xs">
            {/* Grid of 4 operations */}
            {/* Broadcast */}
            <g>
              <rect x="20" y="15" width="130" height="85" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="85" y="32" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Bcast</text>
              <rect x="35" y="42" width="20" height="15" fill="currentColor" />
              <text x="45" y="53" textAnchor="middle" className="fill-white dark:fill-black font-bold" fontSize="8">D</text>
              <line x1="60" y1="50" x2="135" y2="50" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="135,50 128,47 128,53" fill="currentColor" />
              <text x="85" y="75" textAnchor="middle" className="opacity-75 fill-current" fontSize="9">One &rarr; All (Duplicate)</text>
            </g>

            {/* Scatter */}
            <g>
              <rect x="170" y="15" width="130" height="85" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="235" y="32" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Scatter</text>
              <text x="185" y="53" className="fill-current font-bold" fontSize="9">[A,B,C,D]</text>
              <line x1="240" y1="50" x2="285" y2="50" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="285,50 278,47 278,53" fill="currentColor" />
              <text x="235" y="75" textAnchor="middle" className="opacity-75 fill-current" fontSize="9">One &rarr; All (Partition)</text>
            </g>

            {/* Gather */}
            <g>
              <rect x="320" y="15" width="130" height="85" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="385" y="32" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Gather</text>
              <line x1="335" y1="50" x2="380" y2="50" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="380,50 373,47 373,53" fill="currentColor" />
              <text x="420" y="53" textAnchor="middle" className="fill-current font-bold" fontSize="9">[A,B,C,D]</text>
              <text x="385" y="75" textAnchor="middle" className="opacity-75 fill-current" fontSize="9">All &rarr; One (Collect)</text>
            </g>

            {/* Reduce */}
            <g>
              <rect x="470" y="15" width="130" height="85" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="535" y="32" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Reduce</text>
              <text x="485" y="53" className="fill-current" fontSize="9">v0,v1,v2</text>
              <line x1="530" y1="50" x2="560" y2="50" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="560,50 553,47 553,53" fill="currentColor" />
              <text x="580" y="53" textAnchor="middle" className="fill-current font-bold" fontSize="9">&sum;v</text>
              <text x="535" y="75" textAnchor="middle" className="opacity-75 fill-current" fontSize="9">All &rarr; One (Operate)</text>
            </g>

            {/* Row 2: Allgather, Alltoall, Allreduce, Scan */}
            <g>
              <rect x="20" y="115" width="130" height="85" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="85" y="132" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Allgather</text>
              <text x="85" y="155" textAnchor="middle" className="fill-current" fontSize="9">Gather + Bcast</text>
              <text x="85" y="175" textAnchor="middle" className="opacity-75 fill-current" fontSize="9">All &rarr; All (Full Array)</text>
            </g>

            <g>
              <rect x="170" y="115" width="130" height="85" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="235" y="132" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Alltoall</text>
              <text x="235" y="155" textAnchor="middle" className="fill-current" fontSize="9">Matrix Transpose</text>
              <text x="235" y="175" textAnchor="middle" className="opacity-75 fill-current" fontSize="9">All &rarr; All (Personal)</text>
            </g>

            <g>
              <rect x="320" y="115" width="130" height="85" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="385" y="132" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Allreduce</text>
              <text x="385" y="155" textAnchor="middle" className="fill-current" fontSize="9">Reduce + Bcast</text>
              <text x="385" y="175" textAnchor="middle" className="opacity-75 fill-current" fontSize="9">All &rarr; All (Result)</text>
            </g>

            <g>
              <rect x="470" y="115" width="130" height="85" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="535" y="132" textAnchor="middle" className="font-bold fill-current" fontSize="10">MPI_Scan</text>
              <text x="535" y="155" textAnchor="middle" className="fill-current" fontSize="9">Prefix Reductions</text>
              <text x="535" y="175" textAnchor="middle" className="opacity-75 fill-current" fontSize="9">Rank i gets &sum;0..i</text>
            </g>
          </svg>
        )}

        {type === 'data-distribution' && (
          <svg viewBox="0 0 600 180" className="w-full max-w-[580px] h-auto font-mono text-xs">
            {/* Block partition */}
            <g>
              <text x="15" y="25" className="font-bold fill-current" fontSize="10">BLOCK (n=12, p=3):</text>
              {/* Proc 0 */}
              <rect x="15" y="35" width="80" height="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="55" y="51" textAnchor="middle" className="fill-current" fontSize="9">P0: 0, 1, 2, 3</text>
              {/* Proc 1 */}
              <rect x="100" y="35" width="80" height="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="140" y="51" textAnchor="middle" className="fill-current" fontSize="9">P1: 4, 5, 6, 7</text>
              {/* Proc 2 */}
              <rect x="185" y="35" width="80" height="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <text x="225" y="51" textAnchor="middle" className="fill-current" fontSize="9">P2: 8, 9, 10, 11</text>
            </g>

            {/* Cyclic partition */}
            <g>
              <text x="15" y="85" className="font-bold fill-current" fontSize="10">CYCLIC (Round-Robin by 1):</text>
              <rect x="15" y="95" width="250" height="25" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="25" y="111" className="fill-current" fontSize="9">P0:0</text>
              <text x="65" y="111" className="fill-current" fontSize="9">P1:1</text>
              <text x="105" y="111" className="fill-current" fontSize="9">P2:2</text>
              <text x="145" y="111" className="fill-current" fontSize="9">P0:3</text>
              <text x="185" y="111" className="fill-current" fontSize="9">P1:4</text>
              <text x="225" y="111" className="fill-current" fontSize="9">P2:5...</text>
            </g>

            {/* Block Cyclic */}
            <g>
              <text x="320" y="25" className="font-bold fill-current" fontSize="10">BLOCK-CYCLIC (Block size b=2):</text>
              <rect x="320" y="35" width="260" height="30" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="330" y="54" className="fill-current" fontSize="9">P0:(0,1)</text>
              <text x="390" y="54" className="fill-current" fontSize="9">P1:(2,3)</text>
              <text x="450" y="54" className="fill-current" fontSize="9">P0:(4,5)</text>
              <text x="510" y="54" className="fill-current" fontSize="9">P1:(6,7)...</text>
              <text x="320" y="90" className="opacity-75 fill-current" fontSize="9">Formula: element i goes to rank floor(i / b) % p</text>
            </g>
          </svg>
        )}

        {type === 'trapezoidal-geometry' && (
          <svg viewBox="0 0 540 180" className="w-full max-w-[500px] h-auto font-mono text-xs">
            {/* Axis */}
            <line x1="50" y1="140" x2="480" y2="140" stroke="currentColor" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="50" y2="140" stroke="currentColor" strokeWidth="1.5" />
            <text x="490" y="144" className="fill-current" fontSize="10">x</text>
            <text x="40" y="25" className="fill-current" fontSize="10">y</text>

            {/* Trapezoid 1: x0 to x1 */}
            <polygon points="100,140 100,80 180,50 180,140" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Trapezoid 2: x1 to x2 */}
            <polygon points="180,140 180,50 260,35 260,140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Trapezoid 3: x2 to x3 */}
            <polygon points="260,140 260,35 340,30 340,140" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Trapezoid 4: x3 to x4 */}
            <polygon points="340,140 340,30 420,45 420,140" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* X Labels */}
            <text x="100" y="156" textAnchor="middle" className="font-bold fill-current" fontSize="9">a=x0</text>
            <text x="180" y="156" textAnchor="middle" className="fill-current" fontSize="9">x1</text>
            <text x="260" y="156" textAnchor="middle" className="fill-current" fontSize="9">x2</text>
            <text x="340" y="156" textAnchor="middle" className="fill-current" fontSize="9">x3</text>
            <text x="420" y="156" textAnchor="middle" className="font-bold fill-current" fontSize="9">b=xn</text>

            {/* Heights */}
            <text x="105" y="70" className="fill-current" fontSize="8">f(x0)</text>
            <text x="185" y="45" className="fill-current" fontSize="8">f(x1)</text>

            {/* Step size */}
            <line x1="100" y1="125" x2="180" y2="125" stroke="currentColor" strokeWidth="1" />
            <text x="140" y="120" textAnchor="middle" className="fill-current" fontSize="8">h = (b-a)/n</text>
          </svg>
        )}

        {type === 'fork-join' && (
          <svg viewBox="0 0 540 160" className="w-full max-w-[500px] h-auto font-mono text-xs">
            {/* Initial master thread */}
            <line x1="40" y1="80" x2="160" y2="80" stroke="currentColor" strokeWidth="2.5" />
            <text x="90" y="65" textAnchor="middle" className="font-bold fill-current" fontSize="10">MASTER THREAD</text>

            {/* Fork Point */}
            <line x1="160" y1="80" x2="220" y2="30" stroke="currentColor" strokeWidth="1.5" />
            <line x1="160" y1="80" x2="220" y2="65" stroke="currentColor" strokeWidth="1.5" />
            <line x1="160" y1="80" x2="220" y2="95" stroke="currentColor" strokeWidth="1.5" />
            <line x1="160" y1="80" x2="220" y2="130" stroke="currentColor" strokeWidth="1.5" />
            <text x="170" y="115" className="font-bold fill-current" fontSize="9">#pragma omp parallel (FORK)</text>

            {/* Parallel team lines */}
            <line x1="220" y1="30" x2="360" y2="30" stroke="currentColor" strokeWidth="1.5" />
            <text x="290" y="24" textAnchor="middle" className="fill-current" fontSize="9">THREAD 0</text>
            <line x1="220" y1="65" x2="360" y2="65" stroke="currentColor" strokeWidth="1.5" />
            <text x="290" y="59" textAnchor="middle" className="fill-current" fontSize="9">THREAD 1</text>
            <line x1="220" y1="95" x2="360" y2="95" stroke="currentColor" strokeWidth="1.5" />
            <text x="290" y="89" textAnchor="middle" className="fill-current" fontSize="9">THREAD 2</text>
            <line x1="220" y1="130" x2="360" y2="130" stroke="currentColor" strokeWidth="1.5" />
            <text x="290" y="124" textAnchor="middle" className="fill-current" fontSize="9">THREAD 3</text>

            {/* Join Point */}
            <line x1="360" y1="30" x2="420" y2="80" stroke="currentColor" strokeWidth="1.5" />
            <line x1="360" y1="65" x2="420" y2="80" stroke="currentColor" strokeWidth="1.5" />
            <line x1="360" y1="95" x2="420" y2="80" stroke="currentColor" strokeWidth="1.5" />
            <line x1="360" y1="130" x2="420" y2="80" stroke="currentColor" strokeWidth="1.5" />
            <text x="350" y="150" className="font-bold fill-current" fontSize="9">BARRIER / (JOIN)</text>

            {/* Master continues */}
            <line x1="420" y1="80" x2="510" y2="80" stroke="currentColor" strokeWidth="2.5" />
            <text x="465" y="65" textAnchor="middle" className="font-bold fill-current" fontSize="10">SEQUENTIAL</text>
          </svg>
        )}

        {type === 'false-sharing' && (
          <svg viewBox="0 0 540 160" className="w-full max-w-[500px] h-auto font-mono text-xs">
            {/* Cache line box */}
            <rect x="60" y="70" width="420" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="270" y="60" textAnchor="middle" className="font-bold fill-current" fontSize="11">SINGLE 64-BYTE HARDWARE CACHE LINE</text>

            {/* Word 0 */}
            <rect x="80" y="80" width="80" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="120" y="100" textAnchor="middle" className="fill-current" fontSize="9">sum[0]</text>

            {/* Word 1 */}
            <rect x="180" y="80" width="80" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <text x="220" y="100" textAnchor="middle" className="fill-current" fontSize="9">sum[1]</text>

            {/* Unused remainder */}
            <text x="370" y="100" textAnchor="middle" className="opacity-50 fill-current" fontSize="9">Remaining 48 Bytes in line...</text>

            {/* Core 0 writing to sum[0] */}
            <line x1="120" y1="20" x2="120" y2="70" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="120,70 116,62 124,62" fill="currentColor" />
            <text x="120" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="9">CORE 0: WRITING</text>

            {/* Core 1 writing to sum[1] */}
            <line x1="220" y1="20" x2="220" y2="70" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="220,70 216,62 224,62" fill="currentColor" />
            <text x="220" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="9">CORE 1: WRITING</text>

            {/* Invalidation wave */}
            <text x="270" y="145" textAnchor="middle" className="font-bold fill-current" fontSize="9">
              [!] Cache Coherency Ping-Pong: Writing sum[0] invalidates L1 cache of Core 1!
            </text>
          </svg>
        )}

        {type === 'bfs-dfs-tree' && (
          <svg viewBox="0 0 540 220" className="w-full max-w-[500px] h-auto font-mono text-xs">
            {/* Lab 10 tree: 15 nodes:
                0 (root)
                Level 1: 1, 2
                Level 2: 3, 4 (under 1); 5, 6 (under 2)
                Level 3: 7, 8 (under 3); 9 (under 4); 10 (under 5); 11 (under 6)
                Level 4: 12, 13 (under 7/8); 14 (under 9)
            */}
            {/* Edges */}
            <line x1="270" y1="25" x2="180" y2="65" stroke="currentColor" strokeWidth="1.5" />
            <line x1="270" y1="25" x2="360" y2="65" stroke="currentColor" strokeWidth="1.5" />

            <line x1="180" y1="65" x2="120" y2="105" stroke="currentColor" strokeWidth="1.5" />
            <line x1="180" y1="65" x2="220" y2="105" stroke="currentColor" strokeWidth="1.5" />
            <line x1="360" y1="65" x2="320" y2="105" stroke="currentColor" strokeWidth="1.5" />
            <line x1="360" y1="65" x2="400" y2="105" stroke="currentColor" strokeWidth="1.5" />

            <line x1="120" y1="105" x2="80" y2="145" stroke="currentColor" strokeWidth="1.5" />
            <line x1="120" y1="105" x2="130" y2="145" stroke="currentColor" strokeWidth="1.5" />
            <line x1="220" y1="105" x2="220" y2="145" stroke="currentColor" strokeWidth="1.5" />
            <line x1="320" y1="105" x2="320" y2="145" stroke="currentColor" strokeWidth="1.5" />
            <line x1="400" y1="105" x2="400" y2="145" stroke="currentColor" strokeWidth="1.5" />

            <line x1="80" y1="145" x2="70" y2="185" stroke="currentColor" strokeWidth="1.5" />
            <line x1="130" y1="145" x2="130" y2="185" stroke="currentColor" strokeWidth="1.5" />
            <line x1="220" y1="145" x2="220" y2="185" stroke="currentColor" strokeWidth="1.5" />

            {/* Nodes */}
            {[
              { id: 0, x: 270, y: 25 },
              { id: 1, x: 180, y: 65 },
              { id: 2, x: 360, y: 65 },
              { id: 3, x: 120, y: 105 },
              { id: 4, x: 220, y: 105 },
              { id: 5, x: 320, y: 105 },
              { id: 6, x: 400, y: 105 },
              { id: 7, x: 80, y: 145 },
              { id: 8, x: 130, y: 145 },
              { id: 9, x: 220, y: 145 },
              { id: 10, x: 320, y: 145 },
              { id: 11, x: 400, y: 145 },
              { id: 12, x: 70, y: 185 },
              { id: 13, x: 130, y: 185 },
              { id: 14, x: 220, y: 185 },
            ].map((node) => (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r="10" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x={node.x} y={node.y + 3.5} textAnchor="middle" className="font-bold fill-current" fontSize="9">
                  {node.id}
                </text>
              </g>
            ))}
          </svg>
        )}

        {/* 9. Completely Connected Network */}
        {type === 'completely-connected' && (
          <svg viewBox="0 0 400 240" className="w-full max-w-[420px] h-auto font-mono text-xs">
            <text x="200" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">COMPLETELY CONNECTED (p = 8)</text>
            <text x="200" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Diameter: 1 | Degree: p-1 (7) | Links: p(p-1)/2 = 28</text>
            {/* Edges */}
            {(() => {
              const nodes = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
                return { id: i, x: 200 + 80 * Math.cos(angle), y: 135 + 80 * Math.sin(angle) };
              });
              const edges: React.ReactNode[] = [];
              for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                  edges.push(
                    <line key={`e-${i}-${j}`} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y} stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                  );
                }
              }
              return (
                <g>
                  {edges}
                  {nodes.map((n) => (
                    <g key={n.id}>
                      <circle cx={n.x} cy={n.y} r="12" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                      <text x={n.x} y={n.y + 4} textAnchor="middle" className="font-bold fill-current" fontSize="10">{n.id}</text>
                    </g>
                  ))}
                </g>
              );
            })()}
          </svg>
        )}

        {/* 10. Star Network */}
        {type === 'star-network' && (
          <svg viewBox="0 0 400 220" className="w-full max-w-[420px] h-auto font-mono text-xs">
            <text x="200" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">STAR CONNECTED NETWORK (p = 8)</text>
            <text x="200" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Diameter: 2 | Center Degree: p-1 | Peripheral Degree: 1 | Links: p-1</text>
            {(() => {
              const cx = 200, cy = 130;
              const periph = [0, 1, 2, 3, 4, 5, 6].map((i) => {
                const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2;
                return { id: i, x: cx + 75 * Math.cos(angle), y: cy + 75 * Math.sin(angle) };
              });
              return (
                <g>
                  {periph.map((p) => (
                    <line key={`star-${p.id}`} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="currentColor" strokeWidth="1.5" />
                  ))}
                  {/* Center Node */}
                  <rect x={cx - 16} y={cy - 16} width="32" height="32" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-black" />
                  <text x={cx} y={cy + 4} textAnchor="middle" className="font-bold fill-current" fontSize="9">HUB</text>
                  {/* Peripheral Nodes */}
                  {periph.map((p) => (
                    <g key={p.id}>
                      <circle cx={p.x} cy={p.y} r="11" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                      <text x={p.x} y={p.y + 3.5} textAnchor="middle" className="font-bold fill-current" fontSize="9">{p.id}</text>
                    </g>
                  ))}
                </g>
              );
            })()}
          </svg>
        )}

        {/* 11. Linear Array & Ring */}
        {type === 'linear-array-ring' && (
          <svg viewBox="0 0 680 180" className="w-full max-w-[660px] h-auto font-mono text-xs">
            {/* Left: Linear Array */}
            <g>
              <text x="160" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">LINEAR ARRAY (p = 4)</text>
              <text x="160" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Diameter: p-1 (3) | Bisection: 1 | Links: p-1 (3)</text>
              {[0, 1, 2, 3].map((i) => (
                <React.Fragment key={`la-${i}`}>
                  {i < 3 && <line x1={50 + i * 70} y1={100} x2={50 + (i + 1) * 70} y2={100} stroke="currentColor" strokeWidth="1.5" />}
                  <circle cx={50 + i * 70} cy={100} r="14" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                  <text x={50 + i * 70} y={104} textAnchor="middle" className="font-bold fill-current" fontSize="10">{i}</text>
                </React.Fragment>
              ))}
            </g>

            {/* Divider */}
            <line x1="330" y1="15" x2="330" y2="165" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Right: Ring */}
            <g>
              <text x="500" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">RING TOPOLOGY (p = 6)</text>
              <text x="500" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Diameter: floor(p/2) (3) | Bisection: 2 | Links: p (6)</text>
              {(() => {
                const rx = 500, ry = 105;
                const ringNodes = [0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                  return { id: i, x: rx + 55 * Math.cos(angle), y: ry + 55 * Math.sin(angle) };
                });
                return (
                  <g>
                    {ringNodes.map((n, idx) => {
                      const next = ringNodes[(idx + 1) % 6];
                      return <line key={`re-${n.id}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y} stroke="currentColor" strokeWidth="1.5" />;
                    })}
                    {ringNodes.map((n) => (
                      <g key={`rn-${n.id}`}>
                        <circle cx={n.x} cy={n.y} r="12" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                        <text x={n.x} y={n.y + 3.5} textAnchor="middle" className="font-bold fill-current" fontSize="9">{n.id}</text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </g>
          </svg>
        )}

        {/* 12. 2D Mesh & 2D Torus */}
        {type === 'mesh-2d-3d' && (
          <svg viewBox="0 0 540 300" className="w-full max-w-[520px] h-auto font-mono text-xs">
            <text x="270" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">4x4 2D MESH / 2D TORUS (p = 16)</text>
            <text x="270" y="35" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Mesh: Diameter = 2(sqrt(p)-1) = 6 | Bisection = 4 | Links = 24</text>
            <text x="270" y="48" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Torus (wraparound): Diameter = 2*floor(sqrt(p)/2) = 4 | Links = 32</text>
            <g transform="translate(100, 70)">
              {/* Internal Mesh Lines */}
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <React.Fragment key={`m-${r}-${c}`}>
                    {c < 3 && <line x1={c * 75} y1={r * 45} x2={(c + 1) * 75} y2={r * 45} stroke="currentColor" strokeWidth="1.5" />}
                    {r < 3 && <line x1={c * 75} y1={r * 45} x2={c * 75} y2={(r + 1) * 45} stroke="currentColor" strokeWidth="1.5" />}
                  </React.Fragment>
                ))
              )}
              {/* Torus Wraparound Dotted Lines */}
              {[0, 1, 2, 3].map((r) => (
                <path key={`wrap-h-${r}`} d={`M 0,${r * 45} C -30,${r * 45 - 20} -30,${r * 45 + 20} 0,${r * 45}`} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              ))}
              {/* Nodes */}
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => {
                  const id = r * 4 + c;
                  return (
                    <g key={`node-${id}`}>
                      <rect x={c * 75 - 12} y={r * 45 - 10} width="24" height="20" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                      <text x={c * 75} y={r * 45 + 3.5} textAnchor="middle" className="font-bold fill-current" fontSize="9">{id}</text>
                    </g>
                  );
                })
              )}
            </g>
          </svg>
        )}

        {/* 13. Hypercube Construction 0-D to 4-D */}
        {type === 'hypercube-dimensions' && (
          <svg viewBox="0 0 720 200" className="w-full max-w-[700px] h-auto font-mono text-xs">
            <text x="360" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">HYPERCUBE FAMILY: 0-D, 1-D, 2-D, 3-D (RECURSIVE CONSTRUCTION)</text>
            <text x="360" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Distance = Hamming distance | Diameter = d = log2(p) | Degree = d | Links = (p*d)/2</text>

            {/* 0-D: Point */}
            <g transform="translate(40, 70)">
              <text x="20" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="10">0-D (p=1)</text>
              <circle cx="20" cy="55" r="8" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="20" y="78" textAnchor="middle" className="fill-current" fontSize="8">0</text>
            </g>

            {/* 1-D: Line */}
            <g transform="translate(130, 70)">
              <text x="35" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="10">1-D (p=2)</text>
              <line x1="10" y1="55" x2="60" y2="55" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="10" cy="55" r="8" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="10" y="78" textAnchor="middle" className="fill-current" fontSize="8">0</text>
              <circle cx="60" cy="55" r="8" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="60" y="78" textAnchor="middle" className="fill-current" fontSize="8">1</text>
            </g>

            {/* 2-D: Square */}
            <g transform="translate(260, 70)">
              <text x="45" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="10">2-D (p=4)</text>
              <rect x="15" y="35" width="60" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="15" cy="35" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="15" y="28" textAnchor="middle" className="fill-current" fontSize="8">00</text>
              <circle cx="75" cy="35" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="75" y="28" textAnchor="middle" className="fill-current" fontSize="8">01</text>
              <circle cx="15" cy="85" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="15" y="100" textAnchor="middle" className="fill-current" fontSize="8">10</text>
              <circle cx="75" cy="85" r="7" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="75" y="100" textAnchor="middle" className="fill-current" fontSize="8">11</text>
            </g>

            {/* 3-D: Cube */}
            <g transform="translate(420, 60)">
              <text x="100" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="10">3-D (p=8, d=3)</text>
              {/* Back Face */}
              <rect x="60" y="30" width="70" height="60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
              {/* Front Face */}
              <rect x="30" y="55" width="70" height="60" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {/* Cross edges */}
              <line x1="30" y1="55" x2="60" y2="30" stroke="currentColor" strokeWidth="1.2" />
              <line x1="100" y1="55" x2="130" y2="30" stroke="currentColor" strokeWidth="1.2" />
              <line x1="30" y1="115" x2="60" y2="90" stroke="currentColor" strokeWidth="1.2" />
              <line x1="100" y1="115" x2="130" y2="90" stroke="currentColor" strokeWidth="1.2" />
              {/* Labels */}
              <text x="20" y="55" textAnchor="end" className="fill-current font-bold" fontSize="8">000</text>
              <text x="110" y="55" textAnchor="start" className="fill-current font-bold" fontSize="8">001</text>
              <text x="20" y="120" textAnchor="end" className="fill-current font-bold" fontSize="8">010</text>
              <text x="110" y="120" textAnchor="start" className="fill-current font-bold" fontSize="8">011</text>
              <text x="55" y="25" textAnchor="end" className="fill-current opacity-70" fontSize="8">100</text>
              <text x="135" y="25" textAnchor="start" className="fill-current opacity-70" fontSize="8">101</text>
              <text x="55" y="90" textAnchor="end" className="fill-current opacity-70" fontSize="8">110</text>
              <text x="135" y="90" textAnchor="start" className="fill-current opacity-70" fontSize="8">111</text>
            </g>
          </svg>
        )}

        {/* 14. Binary Tree & Fat Tree */}
        {type === 'tree-fat-tree' && (
          <svg viewBox="0 0 680 200" className="w-full max-w-[660px] h-auto font-mono text-xs">
            {/* Standard Complete Binary Tree */}
            <g transform="translate(40, 20)">
              <text x="120" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">COMPLETE BINARY TREE</text>
              <text x="120" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Diameter: 2*log(p) | Bisection = 1 (Bottleneck)</text>
              <line x1="120" y1="50" x2="60" y2="90" stroke="currentColor" strokeWidth="1.5" />
              <line x1="120" y1="50" x2="180" y2="90" stroke="currentColor" strokeWidth="1.5" />
              <line x1="60" y1="90" x2="30" y2="130" stroke="currentColor" strokeWidth="1.5" />
              <line x1="60" y1="90" x2="90" y2="130" stroke="currentColor" strokeWidth="1.5" />
              <line x1="180" y1="90" x2="150" y2="130" stroke="currentColor" strokeWidth="1.5" />
              <line x1="180" y1="90" x2="210" y2="130" stroke="currentColor" strokeWidth="1.5" />

              {/* Switches & Nodes */}
              <circle cx="120" cy="50" r="10" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <circle cx="60" cy="90" r="10" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <circle cx="180" cy="90" r="10" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              {[30, 90, 150, 210].map((x, idx) => (
                <rect key={`c-leaf-${idx}`} x={x - 10} y={120} width="20" height="20" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              ))}
              <text x="120" y="165" textAnchor="middle" className="fill-current opacity-70" fontSize="8">Constant link capacity at all levels</text>
            </g>

            {/* Divider */}
            <line x1="340" y1="20" x2="340" y2="180" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Fat Tree */}
            <g transform="translate(380, 20)">
              <text x="130" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">FAT TREE (LEISERSON)</text>
              <text x="130" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Channel bandwidth increases towards root</text>
              {/* Thicker links higher up */}
              <line x1="130" y1="50" x2="70" y2="90" stroke="currentColor" strokeWidth="5" />
              <line x1="130" y1="50" x2="190" y2="90" stroke="currentColor" strokeWidth="5" />
              <line x1="70" y1="90" x2="35" y2="130" stroke="currentColor" strokeWidth="2.5" />
              <line x1="70" y1="90" x2="105" y2="130" stroke="currentColor" strokeWidth="2.5" />
              <line x1="190" y1="90" x2="155" y2="130" stroke="currentColor" strokeWidth="2.5" />
              <line x1="190" y1="90" x2="225" y2="130" stroke="currentColor" strokeWidth="2.5" />

              <rect x="115" y="35" width="30" height="25" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-black" />
              <text x="130" y="51" textAnchor="middle" className="font-bold fill-current" fontSize="9">ROOT</text>
              <rect x="55" y="78" width="30" height="22" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <rect x="175" y="78" width="30" height="22" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />

              {[35, 105, 155, 225].map((x, idx) => (
                <rect key={`ft-leaf-${idx}`} x={x - 10} y={120} width="20" height="20" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              ))}
              <text x="130" y="165" textAnchor="middle" className="fill-current opacity-70" fontSize="8">Prevents root bisection bottleneck: bisection = Omega(p)</text>
            </g>
          </svg>
        )}

        {/* 15. Crossbar & Omega Network */}
        {type === 'crossbar-omega' && (
          <svg viewBox="0 0 680 220" className="w-full max-w-[660px] h-auto font-mono text-xs">
            {/* Left: Crossbar */}
            <g transform="translate(30, 20)">
              <text x="130" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">4x4 CROSSBAR (NON-BLOCKING)</text>
              <text x="130" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Diameter: 1 | Cost (Switches): p^2 = 16</text>
              {/* Inputs */}
              {[0, 1, 2, 3].map((r) => (
                <text key={`in-${r}`} x="20" y={60 + r * 30 + 4} textAnchor="end" className="fill-current font-bold" fontSize="9">In {r}</text>
              ))}
              {/* Outputs */}
              {[0, 1, 2, 3].map((c) => (
                <text key={`out-${c}`} x={50 + c * 40} y="45" textAnchor="middle" className="fill-current font-bold" fontSize="9">Out {c}</text>
              ))}
              {/* Grid Lines */}
              {[0, 1, 2, 3].map((r) => (
                <line key={`ch-${r}`} x1="30" y1={60 + r * 30} x2="190" y2={60 + r * 30} stroke="currentColor" strokeWidth="1.5" />
              ))}
              {[0, 1, 2, 3].map((c) => (
                <line key={`cv-${c}`} x1={50 + c * 40} y1="50" x2={50 + c * 40} y2="160" stroke="currentColor" strokeWidth="1.5" />
              ))}
              {/* Crosspoint switches */}
              {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <circle key={`cp-${r}-${c}`} cx={50 + c * 40} cy={60 + r * 30} r="4" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                ))
              )}
            </g>

            {/* Divider */}
            <line x1="310" y1="20" x2="310" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Right: Omega Network */}
            <g transform="translate(340, 20)">
              <text x="160" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">OMEGA NETWORK (8 INPUTS, 3 STAGES)</text>
              <text x="160" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Stages = log2(p) = 3 | Switches = (p/2)*log2(p) = 12</text>
              {/* Stage labels */}
              {['Stage 0', 'Stage 1', 'Stage 2'].map((st, sIdx) => (
                <text key={`st-${sIdx}`} x={50 + sIdx * 80} y="50" textAnchor="middle" className="fill-current opacity-70" fontSize="8">{st}</text>
              ))}
              {/* 3 stages of 4 2x2 switches */}
              {[0, 1, 2].map((s) =>
                [0, 1, 2, 3].map((sw) => (
                  <rect key={`om-${s}-${sw}`} x={35 + s * 80} y={65 + sw * 28} width="30" height="20" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                ))
              )}
              {/* Connection shuffle links */}
              {[0, 1].map((s) =>
                [0, 1, 2, 3].map((sw) => (
                  <React.Fragment key={`shuf-${s}-${sw}`}>
                    <line x1={65 + s * 80} y1={75 + sw * 28} x2={115 + s * 80} y2={75 + ((sw * 2) % 4) * 28} stroke="currentColor" strokeWidth="1" opacity="0.6" />
                    <line x1={65 + s * 80} y1={75 + sw * 28} x2={115 + s * 80} y2={75 + (((sw * 2) + 1) % 4) * 28} stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  </React.Fragment>
                ))
              )}
            </g>
          </svg>
        )}

        {/* 16. E-Cube Routing in Hypercube */}
        {type === 'ecube-routing' && (
          <svg viewBox="0 0 560 220" className="w-full max-w-[540px] h-auto font-mono text-xs">
            <text x="280" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">DIMENSION-ORDER (E-CUBE) ROUTING: 010 &rarr; 111</text>
            <text x="280" y="36" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Source: 010 | Dest: 111 | XOR Diff: 101 (bits 0 and 2 differ) | Hops: 2</text>

            {/* Step sequence */}
            <g transform="translate(40, 70)">
              {/* Step 0: Source */}
              <rect x="0" y="20" width="100" height="60" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-black" />
              <text x="50" y="42" textAnchor="middle" className="font-bold fill-current" fontSize="11">HOP 0</text>
              <text x="50" y="62" textAnchor="middle" className="fill-current font-bold" fontSize="14">010</text>
              <text x="50" y="98" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Source</text>

              {/* Arrow 1 */}
              <line x1="100" y1="50" x2="190" y2="50" stroke="currentColor" strokeWidth="2" />
              <polygon points="190,50 180,45 180,55" fill="currentColor" />
              <text x="145" y="42" textAnchor="middle" className="fill-current font-bold" fontSize="9">Flip bit 0</text>
              <text x="145" y="68" textAnchor="middle" className="fill-current opacity-70" fontSize="8">(LSB)</text>

              {/* Step 1: Intermediate */}
              <rect x="190" y="20" width="100" height="60" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="240" y="42" textAnchor="middle" className="font-bold fill-current" fontSize="11">HOP 1</text>
              <text x="240" y="62" textAnchor="middle" className="fill-current font-bold" fontSize="14">011</text>
              <text x="240" y="98" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Intermediate</text>

              {/* Arrow 2 */}
              <line x1="290" y1="50" x2="380" y2="50" stroke="currentColor" strokeWidth="2" />
              <polygon points="380,50 370,45 370,55" fill="currentColor" />
              <text x="335" y="42" textAnchor="middle" className="fill-current font-bold" fontSize="9">Flip bit 2</text>
              <text x="335" y="68" textAnchor="middle" className="fill-current opacity-70" fontSize="8">(MSB)</text>

              {/* Step 2: Destination */}
              <rect x="380" y="20" width="100" height="60" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-black" />
              <text x="430" y="42" textAnchor="middle" className="font-bold fill-current" fontSize="11">HOP 2</text>
              <text x="430" y="62" textAnchor="middle" className="fill-current font-bold" fontSize="14">111</text>
              <text x="430" y="98" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Destination</text>
            </g>
          </svg>
        )}

        {/* 17. Gray Code Ring Embedding into Hypercube */}
        {type === 'gray-code-embedding' && (
          <svg viewBox="0 0 620 220" className="w-full max-w-[600px] h-auto font-mono text-xs">
            <text x="310" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">REFLECTED GRAY CODE (RGC) EMBEDDING: 8-NODE RING INTO 3-D HYPERCUBE</text>
            <text x="310" y="36" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Dilation = 1 | Congestion = 1 | Expansion = 1 (Ideal Subgraph Embedding)</text>
            <g transform="translate(70, 60)">
              {[
                { ringIdx: 0, gray: '000', x: 0 },
                { ringIdx: 1, gray: '001', x: 65 },
                { ringIdx: 2, gray: '011', x: 130 },
                { ringIdx: 3, gray: '010', x: 195 },
                { ringIdx: 4, gray: '110', x: 260 },
                { ringIdx: 5, gray: '111', x: 325 },
                { ringIdx: 6, gray: '101', x: 390 },
                { ringIdx: 7, gray: '100', x: 455 },
              ].map((item, idx, arr) => (
                <React.Fragment key={`gc-${item.ringIdx}`}>
                  {idx < arr.length - 1 && (
                    <line x1={item.x + 25} y1={30} x2={arr[idx + 1].x - 5} y2={30} stroke="currentColor" strokeWidth="1.5" />
                  )}
                  <rect x={item.x - 5} y={10} width="40" height="40" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                  <text x={item.x + 15} y={26} textAnchor="middle" className="font-bold fill-current" fontSize="9">R{item.ringIdx}</text>
                  <text x={item.x + 15} y={42} textAnchor="middle" className="fill-current font-bold" fontSize="9">{item.gray}</text>
                </React.Fragment>
              ))}
              {/* Wraparound from 100 back to 000 */}
              <path d="M 470,50 C 470,95 10,95 10,50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="240" y="90" textAnchor="middle" className="fill-current font-bold" fontSize="9">Wraparound: 100 &harr; 000 (Hamming Distance = 1)</text>
            </g>
          </svg>
        )}

        {/* 18. Pipelining: 3-Segment Example (Ai * Bi + Ci) */}
        {type === 'pipeline-3seg' && (
          <svg viewBox="0 0 680 160" className="w-full max-w-[660px] h-auto font-mono text-xs">
            <text x="340" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">THREE-SEGMENT ARITHMETIC PIPELINE FOR Ai * Bi + Ci</text>
            <text x="340" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Segment 1: Multiplier | Segment 2: Adder | Segment 3: Write Output</text>
            <g transform="translate(20, 60)">
              {/* Inputs */}
              <text x="30" y="25" textAnchor="end" className="fill-current font-bold" fontSize="10">Ai, Bi</text>
              <line x1="35" y1="20" x2="65" y2="20" stroke="currentColor" strokeWidth="1.5" />

              {/* Segment 1 */}
              <rect x="65" y="5" width="100" height="35" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="115" y="26" textAnchor="middle" className="font-bold fill-current" fontSize="9">SEG 1: MULT</text>

              {/* Latch 1 */}
              <line x1="165" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <rect x="200" y="2" width="30" height="40" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-black" />
              <text x="215" y="26" textAnchor="middle" className="font-bold fill-current" fontSize="9">R1</text>

              {/* Add input Ci */}
              <text x="270" y="-5" textAnchor="middle" className="fill-current font-bold" fontSize="10">Ci</text>
              <line x1="270" y1="5" x2="270" y2="20" stroke="currentColor" strokeWidth="1.5" />

              {/* Segment 2 */}
              <line x1="230" y1="20" x2="260" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <rect x="260" y="5" width="100" height="35" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="310" y="26" textAnchor="middle" className="font-bold fill-current" fontSize="9">SEG 2: ADD</text>

              {/* Latch 2 */}
              <line x1="360" y1="20" x2="395" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <rect x="395" y="2" width="30" height="40" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-black" />
              <text x="410" y="26" textAnchor="middle" className="font-bold fill-current" fontSize="9">R2</text>

              {/* Segment 3 */}
              <line x1="425" y1="20" x2="455" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <rect x="455" y="5" width="100" height="35" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="505" y="26" textAnchor="middle" className="font-bold fill-current" fontSize="9">SEG 3: WRITE</text>

              {/* Output */}
              <line x1="555" y1="20" x2="595" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <text x="605" y="25" textAnchor="start" className="fill-current font-bold" fontSize="10">Ri Output</text>
            </g>
          </svg>
        )}

        {/* 19. Space-Time Diagram */}
        {type === 'pipeline-spacetime' && (
          <svg viewBox="0 0 640 220" className="w-full max-w-[620px] h-auto font-mono text-xs">
            <text x="320" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">SPACE-TIME DIAGRAM: 6 TASKS (T1..T6) ON A 4-SEGMENT PIPELINE</text>
            <text x="320" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Total Cycles = k + n - 1 = 4 + 6 - 1 = 9 cycles | Speedup = (6 * 4) / 9 = 2.67x</text>
            <g transform="translate(80, 55)">
              {/* Header: Clock Cycles 1 to 9 */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((clk, cIdx) => (
                <text key={`clk-${clk}`} x={cIdx * 55 + 25} y="15" textAnchor="middle" className="font-bold fill-current" fontSize="10">C{clk}</text>
              ))}

              {/* 4 Segments along Y axis */}
              {[1, 2, 3, 4].map((seg, sIdx) => {
                return (
                  <g key={`st-seg-${seg}`} transform={`translate(0, ${sIdx * 30 + 25})`}>
                    <text x="-15" y="18" textAnchor="end" className="font-bold fill-current" fontSize="10">Seg {seg}</text>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((clk, cIdx) => {
                      // Task index = clk - sIdx (1-based)
                      const taskNum = clk - sIdx;
                      const hasTask = taskNum >= 1 && taskNum <= 6;
                      return (
                        <g key={`cell-${sIdx}-${cIdx}`}>
                          <rect x={cIdx * 55} y="0" width="50" height="24" fill={hasTask ? '#FFFFFF' : 'none'} stroke="currentColor" strokeWidth="1" className={hasTask ? 'fill-white dark:fill-black' : ''} />
                          {hasTask && (
                            <text x={cIdx * 55 + 25} y="16" textAnchor="middle" className="font-bold fill-current" fontSize="10">T{taskNum}</text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {/* 20. SIMD Array Processor vs Vector View */}
        {type === 'simd-array-vs-vector' && (
          <svg viewBox="0 0 680 200" className="w-full max-w-[660px] h-auto font-mono text-xs">
            {/* Left: Array Processor (Space Parallelism) */}
            <g transform="translate(30, 20)">
              <text x="135" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">ARRAY PROCESSOR (SIMD IN SPACE)</text>
              <text x="135" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">N duplicate PEs calculate elements simultaneously</text>
              {/* Single Control Unit */}
              <rect x="60" y="45" width="150" height="25" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="135" y="61" textAnchor="middle" className="font-bold fill-current" fontSize="9">SINGLE CONTROL UNIT</text>
              {/* Broadcast bus */}
              <line x1="135" y1="70" x2="135" y2="85" stroke="currentColor" strokeWidth="1.5" />
              <line x1="20" y1="85" x2="250" y2="85" stroke="currentColor" strokeWidth="1.5" />
              {/* Processing Elements in Parallel */}
              {[0, 1, 2, 3].map((pe) => (
                <g key={`pe-${pe}`} transform={`translate(${15 + pe * 62}, 95)`}>
                  <line x1="25" y1="-10" x2="25" y2="0" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="0" y="0" width="50" height="35" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                  <text x="25" y="16" textAnchor="middle" className="font-bold fill-current" fontSize="8">PE {pe}</text>
                  <text x="25" y="28" textAnchor="middle" className="fill-current opacity-70" fontSize="8">A[{pe}]+B[{pe}]</text>
                </g>
              ))}
            </g>

            {/* Divider */}
            <line x1="335" y1="20" x2="335" y2="180" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Right: Vector Processor (Pipelined in Time) */}
            <g transform="translate(370, 20)">
              <text x="135" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">VECTOR PROCESSOR (SIMD IN TIME)</text>
              <text x="135" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">1 deeply pipelined unit streams elements clock-by-clock</text>
              {/* Pipelined Vector Unit */}
              <rect x="20" y="55" width="230" height="70" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="135" y="75" textAnchor="middle" className="font-bold fill-current" fontSize="9">PIPELINED VECTOR FUNCTIONAL UNIT</text>
              {/* Segments flowing across */}
              {[0, 1, 2, 3].map((s) => (
                <rect key={`vec-seg-${s}`} x={35 + s * 55} y="85" width="45" height="28" fill="#FFFFFF" stroke="currentColor" strokeWidth="1" className="fill-white dark:fill-black" />
              ))}
              <text x="57" y="102" textAnchor="middle" className="fill-current font-bold" fontSize="8">Stage 1</text>
              <text x="112" y="102" textAnchor="middle" className="fill-current font-bold" fontSize="8">Stage 2</text>
              <text x="167" y="102" textAnchor="middle" className="fill-current font-bold" fontSize="8">Stage 3</text>
              <text x="222" y="102" textAnchor="middle" className="fill-current font-bold" fontSize="8">Stage 4</text>
              <text x="135" y="150" textAnchor="middle" className="fill-current opacity-70" fontSize="8">Produces 1 result per cycle after initial latency</text>
            </g>
          </svg>
        )}

        {/* 21. VMIPS Architecture */}
        {type === 'vmips-architecture' && (
          <svg viewBox="0 0 680 240" className="w-full max-w-[660px] h-auto font-mono text-xs">
            <text x="340" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">VMIPS VECTOR PROCESSOR ARCHITECTURE</text>
            <text x="340" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">8 Vector Registers (V0-V7, 64 elem x 64 bit) | Scalar Regs (R0-R31) | Pipelined Execution</text>

            <g transform="translate(30, 50)">
              {/* Vector Registers Bank */}
              <rect x="10" y="10" width="140" height="150" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="80" y="30" textAnchor="middle" className="font-bold fill-current" fontSize="10">VECTOR REGISTERS</text>
              <text x="80" y="44" textAnchor="middle" className="fill-current opacity-70" fontSize="8">V0 to V7 (8 Regs)</text>
              <text x="80" y="56" textAnchor="middle" className="fill-current opacity-70" fontSize="8">64 elements x 64-bit</text>
              <line x1="20" y1="65" x2="140" y2="65" stroke="currentColor" strokeWidth="1" />
              <text x="80" y="85" textAnchor="middle" className="font-bold fill-current" fontSize="9">CONTROL REGS:</text>
              <text x="80" y="102" textAnchor="middle" className="fill-current" fontSize="9">VLEN: Vector Length</text>
              <text x="80" y="118" textAnchor="middle" className="fill-current" fontSize="9">VSTR: Vector Stride</text>
              <text x="80" y="134" textAnchor="middle" className="fill-current" fontSize="9">VMASK: Mask Register</text>

              {/* Data buses */}
              <line x1="150" y1="50" x2="230" y2="50" stroke="currentColor" strokeWidth="1.5" />
              <line x1="150" y1="120" x2="230" y2="120" stroke="currentColor" strokeWidth="1.5" />

              {/* Functional Units */}
              <g transform="translate(230, 5)">
                <rect x="0" y="5" width="170" height="28" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="85" y="23" textAnchor="middle" className="font-bold fill-current" fontSize="9">FP ADD / SUB (Pipelined)</text>

                <rect x="0" y="42" width="170" height="28" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="85" y="60" textAnchor="middle" className="font-bold fill-current" fontSize="9">FP MULTIPLY (Pipelined)</text>

                <rect x="0" y="80" width="170" height="28" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="85" y="98" textAnchor="middle" className="font-bold fill-current" fontSize="9">FP DIVIDE (Pipelined)</text>

                <rect x="0" y="118" width="170" height="28" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="85" y="136" textAnchor="middle" className="font-bold fill-current" fontSize="9">INTEGER / LOGICAL UNIT</text>
              </g>

              {/* Vector Load / Store Unit */}
              <g transform="translate(450, 15)">
                <rect x="0" y="0" width="160" height="60" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="80" y="24" textAnchor="middle" className="font-bold fill-current" fontSize="10">VECTOR LOAD/STORE</text>
                <text x="80" y="40" textAnchor="middle" className="fill-current opacity-70" fontSize="8">Unit Stride / Strided / Gather-Scatter</text>

                <line x1="80" y1="60" x2="80" y2="90" stroke="currentColor" strokeWidth="1.5" />

                {/* Memory banks */}
                <rect x="0" y="90" width="160" height="55" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                <text x="80" y="112" textAnchor="middle" className="font-bold fill-current" fontSize="9">INTERLEAVED MEMORY</text>
                <text x="80" y="128" textAnchor="middle" className="fill-current opacity-70" fontSize="8">Multiple Banks (e.g. 16 or 64 banks)</text>
              </g>
            </g>
          </svg>
        )}

        {/* 22. Performance Engineering Cycle */}
        {type === 'performance-workflow' && (
          <svg viewBox="0 0 540 180" className="w-full max-w-[500px] h-auto font-mono text-xs">
            <text x="270" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">THE PERFORMANCE ENGINEERING CYCLE</text>
            <g transform="translate(40, 45)">
              {[
                { title: 'MEASURE', sub: 'Instrumentation & Sampling', x: 0 },
                { title: 'ANALYSE', sub: 'Profiles & Traces', x: 120 },
                { title: 'OPTIMISE', sub: 'Code & Balance', x: 240 },
                { title: 'VERIFY', sub: 'Correctness & Speedup', x: 360 },
              ].map((step, idx) => (
                <React.Fragment key={`cycle-${idx}`}>
                  <rect x={step.x} y="15" width="100" height="50" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
                  <text x={step.x + 50} y="36" textAnchor="middle" className="font-bold fill-current" fontSize="10">{step.title}</text>
                  <text x={step.x + 50} y="52" textAnchor="middle" className="fill-current opacity-70" fontSize="7">{step.sub}</text>
                  {idx < 3 && (
                    <g>
                      <line x1={step.x + 100} y1="40" x2={step.x + 120} y2="40" stroke="currentColor" strokeWidth="1.5" />
                      <polygon points={`${step.x + 120},40 ${step.x + 115},37 ${step.x + 115},43`} fill="currentColor" />
                    </g>
                  )}
                </React.Fragment>
              ))}
              {/* Feedback Loop Arrow from VERIFY back to MEASURE */}
              <path d="M 410,65 C 410,105 50,105 50,65" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <polygon points="50,65 47,72 53,72" fill="currentColor" />
              <text x="230" y="98" textAnchor="middle" className="fill-current font-bold" fontSize="8">Iterate until scalability and speedup targets are met</text>
            </g>
          </svg>
        )}

        {/* 23. Sampling vs Instrumentation */}
        {type === 'sampling-vs-instrumentation' && (
          <svg viewBox="0 0 680 180" className="w-full max-w-[660px] h-auto font-mono text-xs">
            {/* Sampling */}
            <g transform="translate(30, 20)">
              <text x="140" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">STATISTICAL SAMPLING (PERF, GPROF)</text>
              <text x="140" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Periodic timer interrupt inspects Program Counter (PC)</text>
              <line x1="20" y1="70" x2="260" y2="70" stroke="currentColor" strokeWidth="2" />
              <text x="140" y="62" textAnchor="middle" className="fill-current opacity-70" fontSize="8">Program Execution Time</text>
              {/* Sample ticks */}
              {[40, 80, 120, 160, 200, 240].map((tx) => (
                <g key={`sample-${tx}`}>
                  <line x1={tx} y1="45" x2={tx} y2="95" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx={tx} cy="70" r="4" fill="currentColor" />
                  <text x={tx} y="110" textAnchor="middle" className="fill-current font-bold" fontSize="7">Tick</text>
                </g>
              ))}
              <text x="140" y="135" textAnchor="middle" className="fill-current opacity-70" fontSize="8">Low overhead (~1-3%), no recompilation, but misses rare bursts</text>
            </g>

            {/* Divider */}
            <line x1="335" y1="20" x2="335" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Instrumentation */}
            <g transform="translate(370, 20)">
              <text x="140" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">SOURCE / BINARY INSTRUMENTATION (SCORE-P, TAU)</text>
              <text x="140" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Explicit probe hooks inserted at function entry and exit</text>
              <rect x="20" y="55" width="240" height="30" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="140" y="74" textAnchor="middle" className="font-bold fill-current" fontSize="9">USER FUNCTION BODY</text>
              {/* Probes */}
              <rect x="15" y="48" width="25" height="44" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-black" />
              <text x="27" y="73" textAnchor="middle" className="font-bold fill-current" fontSize="8">ENTRY</text>
              <rect x="240" y="48" width="25" height="44" fill="#FFFFFF" stroke="currentColor" strokeWidth="2" className="fill-white dark:fill-black" />
              <text x="252" y="73" textAnchor="middle" className="font-bold fill-current" fontSize="8">EXIT</text>
              <text x="140" y="135" textAnchor="middle" className="fill-current opacity-70" fontSize="8">Exact call counts & durations, but higher overhead & probe distortion</text>
            </g>
          </svg>
        )}

        {/* 24. Profiling Types */}
        {type === 'profiling-types' && (
          <svg viewBox="0 0 680 180" className="w-full max-w-[660px] h-auto font-mono text-xs">
            {/* Flat Profile */}
            <g transform="translate(30, 20)">
              <text x="135" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">FLAT PROFILING</text>
              <text x="135" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Aggregated total time per function (No context)</text>
              <rect x="10" y="45" width="250" height="90" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <line x1="10" y1="65" x2="260" y2="65" stroke="currentColor" strokeWidth="1" />
              <text x="20" y="58" className="font-bold fill-current" fontSize="8">FUNCTION</text>
              <text x="140" y="58" className="font-bold fill-current" fontSize="8">CALLS</text>
              <text x="210" y="58" className="font-bold fill-current" fontSize="8">EXCL TIME</text>
              <text x="20" y="80" className="fill-current" fontSize="8">matmul_kernel()</text>
              <text x="140" y="80" className="fill-current" fontSize="8">1,024</text>
              <text x="210" y="80" className="fill-current font-bold" fontSize="8">68.4%</text>
              <text x="20" y="100" className="fill-current" fontSize="8">MPI_Sendrecv()</text>
              <text x="140" y="100" className="fill-current" fontSize="8">4,096</text>
              <text x="210" y="100" className="fill-current font-bold" fontSize="8">18.2%</text>
              <text x="20" y="120" className="fill-current" fontSize="8">init_matrix()</text>
              <text x="140" y="120" className="fill-current" fontSize="8">1</text>
              <text x="210" y="120" className="fill-current" fontSize="8">4.1%</text>
            </g>

            {/* Divider */}
            <line x1="335" y1="20" x2="335" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Call-Path Tree */}
            <g transform="translate(370, 20)">
              <text x="140" y="15" textAnchor="middle" className="font-bold fill-current" fontSize="11">CALL-PATH PROFILING (CUBE)</text>
              <text x="140" y="30" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Preserves caller &rarr; callee hierarchy & context</text>
              <rect x="90" y="45" width="100" height="24" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="140" y="61" textAnchor="middle" className="font-bold fill-current" fontSize="9">main() [100%]</text>

              <line x1="140" y1="69" x2="70" y2="95" stroke="currentColor" strokeWidth="1" />
              <line x1="140" y1="69" x2="210" y2="95" stroke="currentColor" strokeWidth="1" />

              <rect x="20" y="95" width="100" height="24" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="70" y="111" textAnchor="middle" className="font-bold fill-current" fontSize="8">compute() [75%]</text>

              <rect x="160" y="95" width="100" height="24" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="210" y="111" textAnchor="middle" className="font-bold fill-current" fontSize="8">comm() [25%]</text>
            </g>
          </svg>
        )}

        {/* 25. Timeline Tracing View */}
        {type === 'timeline-tracing' && (
          <svg viewBox="0 0 680 190" className="w-full max-w-[660px] h-auto font-mono text-xs">
            <text x="340" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">MULTI-RANK TIMELINE TRACING (OTF2 / VAMPIR)</text>
            <text x="340" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Reveals wait-states, message latencies, and temporal load imbalances</text>

            <g transform="translate(60, 50)">
              {/* Ranks along Y */}
              {[0, 1, 2].map((rank) => (
                <text key={`r-lbl-${rank}`} x="-15" y={rank * 35 + 20} textAnchor="end" className="font-bold fill-current" fontSize="10">Rank {rank}</text>
              ))}

              {/* Time axis */}
              <line x1="0" y1="110" x2="560" y2="110" stroke="currentColor" strokeWidth="1.5" />
              <polygon points="560,110 550,105 550,115" fill="currentColor" />
              <text x="280" y="125" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Time &rarr;</text>

              {/* Rank 0 Activity */}
              <rect x="0" y="8" width="180" height="18" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="90" y="21" textAnchor="middle" className="font-bold fill-current" fontSize="8">COMPUTE (Heavy)</text>
              <rect x="180" y="8" width="40" height="18" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
              <text x="200" y="21" textAnchor="middle" className="fill-current font-bold" fontSize="7">SEND</text>

              {/* Message arrow from Rank 0 to Rank 1 */}
              <line x1="200" y1="26" x2="260" y2="43" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <polygon points="260,43 250,38 253,46" fill="currentColor" />

              {/* Rank 1 Activity */}
              <rect x="0" y="43" width="70" height="18" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="35" y="56" textAnchor="middle" className="fill-current font-bold" fontSize="7">COMPUTE</text>
              {/* Rank 1 Idle wait */}
              <rect x="70" y="43" width="190" height="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <text x="165" y="56" textAnchor="middle" className="fill-current font-bold" fontSize="8">IDLE WAIT FOR MPI_RECV (Bottleneck!)</text>
              <rect x="260" y="43" width="120" height="18" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="320" y="56" textAnchor="middle" className="fill-current font-bold" fontSize="8">COMPUTE PHASE 2</text>

              {/* Rank 2 Activity */}
              <rect x="0" y="78" width="110" height="18" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5" className="fill-white dark:fill-black" />
              <text x="55" y="91" textAnchor="middle" className="fill-current font-bold" fontSize="8">COMPUTE</text>
              <rect x="110" y="78" width="150" height="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <text x="185" y="91" textAnchor="middle" className="fill-current opacity-70" fontSize="8">MPI_BARRIER WAIT</text>
            </g>
          </svg>
        )}

        {/* 26. Amdahl vs Gustafson Scaling Curves */}
        {type === 'scaling-curves' && (
          <svg viewBox="0 0 620 220" className="w-full max-w-[600px] h-auto font-mono text-xs">
            <text x="310" y="20" textAnchor="middle" className="font-bold fill-current" fontSize="11">STRONG SCALING (AMDAHL) VS WEAK SCALING (GUSTAFSON)</text>
            <text x="310" y="34" textAnchor="middle" className="fill-current opacity-70" fontSize="9">Fixed Problem Size: Limit = 1/(1-p) | Scaled Problem Size: Linear S(N) = s + p*N</text>

            <g transform="translate(60, 50)">
              {/* Axes */}
              <line x1="30" y1="120" x2="480" y2="120" stroke="currentColor" strokeWidth="1.5" />
              <text x="250" y="138" textAnchor="middle" className="fill-current font-bold" fontSize="9">Processors / Cores (N) &rarr;</text>
              <line x1="30" y1="120" x2="30" y2="10" stroke="currentColor" strokeWidth="1.5" />
              <text x="15" y="65" textAnchor="middle" transform="rotate(-90, 15, 65)" className="fill-current font-bold" fontSize="9">Speedup S(N) &rarr;</text>

              {/* Ideal linear curve */}
              <line x1="30" y1="120" x2="450" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <text x="460" y="25" textAnchor="start" className="fill-current opacity-60" fontSize="8">Ideal Linear (S=N)</text>

              {/* Gustafson Weak Scaling Line (e.g. p=0.9, s=0.1) */}
              <line x1="30" y1="120" x2="450" y2="40" stroke="currentColor" strokeWidth="2" />
              <text x="460" y="45" textAnchor="start" className="fill-current font-bold" fontSize="8">Gustafson (p=0.9)</text>

              {/* Amdahl Strong Scaling Curve (p=0.9, max=10) */}
              <path d="M 30,120 Q 120,60 450,75" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="30" y1="75" x2="450" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
              <text x="460" y="78" textAnchor="start" className="fill-current font-bold" fontSize="8">Amdahl Limit = 1/(1-p) = 10x</text>
            </g>
          </svg>
        )}

      </div>

      {caption && (
        <figcaption className="border-t border-[#E5E5E5] dark:border-[#262626] pt-2 text-center text-[11px] font-mono text-[#737373]">
          FIGURE // {caption}
        </figcaption>
      )}
    </figure>
  );
}
