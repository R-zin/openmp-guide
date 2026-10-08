import React from 'react';

type DiagramType =
  | 'memory-architecture'
  | 'point-to-point'
  | 'collectives-chooser'
  | 'data-distribution'
  | 'trapezoidal-geometry'
  | 'fork-join'
  | 'false-sharing'
  | 'bfs-dfs-tree';

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
      </div>

      {caption && (
        <figcaption className="border-t border-[#E5E5E5] dark:border-[#262626] pt-2 text-center text-[11px] font-mono text-[#737373]">
          FIGURE // {caption}
        </figcaption>
      )}
    </figure>
  );
}
