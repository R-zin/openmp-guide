#!/usr/bin/env python3
"""
Generate complete MDX content for Part D: Vector Processors (01 to 09).
Course: CSS 311 Parallel and Distributed Computing (IIIT Kottayam).
"""

import os

topics = {
    "01-history-and-evolution": {
        "title": "History and Evolution of Vector Processors",
        "description": "Chronological evolution from Cray-1 to Fujitsu A64FX, architectural breakthroughs, and high-performance applications.",
        "order": 1,
        "readingTimeMinutes": 14,
        "sections": [
            {"id": "supercomputing-origins", "title": "Origins of Vector Supercomputers", "level": 2},
            {"id": "evolution-table", "title": "Evolution Timeline (Cray-1 to Modern Era)", "level": 2},
            {"id": "application-domains", "title": "Scientific and Engineering Applications", "level": 2},
            {"id": "watch-out-vector-widths", "title": "Watch Out: Register Length vs Bit Width Ambiguity", "level": 2},
        ],
        "body": """## Origins of Vector Supercomputers

In the 1970s and 1980s, standard scalar processors struggled to satisfy the immense numerical demands of scientific computing. Scientific workloads are characterized by large linear algebra operations (dense vectors and matrices).

Seymour Cray pioneered the **Cray-1** (1976), introducing **vector register architecture**. Instead of executing scalar loops one element at a time through multiple instruction fetches, decodes, and register pointer increments, a single vector instruction orchestrated operations across dozens of data elements through deeply pipelined arithmetic execution units.

## Evolution Timeline (Cray-1 to Modern Era)

The table below traces the key milestones in vector architecture evolution:

| Era / Year | Representative System | Vector Architecture Type | Key Innovations & Architectural Features |
| :--- | :--- | :--- | :--- |
| **1974** | **ILLIAC IV** | SIMD Array Processor | 64 separate 64-bit PEs operating synchronously in lock-step under a single control unit. |
| **1976** | **Cray-1** | Pipelined Vector Registers | 8 vector registers (64 elements $\\times$ 64 bits), 80 MHz clock, vector chaining, 160 MFLOPS peak. |
| **1981** | **CDC Cyber 205** | Memory-to-Memory Vector | Streamed vectors directly from main memory without intermediate vector registers; high memory bandwidth. |
| **1990s** | **NEC SX-3 / SX-4** | Multi-pipe Vector SMP | Multiple parallel vector pipelines per CPU; dominated global meteorological centers. |
| **2002** | **Earth Simulator (NEC SX-6)** | Distributed Vector Supercomputer | 640 nodes (5,120 vector processors), 40 TFLOPS peak; #1 on TOP500 for global climate modeling. |
| **2020** | **Fujitsu A64FX (Fugaku)** | Armv8.2-A SVE (512-bit SIMD) | Scalable Vector Extension (SVE), High-Bandwidth Memory (HBM2), powers the world-record Fugaku supercomputer. |
| **Present** | **NEC SX-Aurora TSUBASA** | PCIe Vector Engine Card | Vector execution engine on a PCIe form factor; up to 3.07 TFLOPS FP64 per card with 1.53 TB/s memory bandwidth. |

## Scientific and Engineering Applications

Vector processors excel wherever the same arithmetic operation must be applied repeatedly across vast homogeneous datasets with zero data-dependent branching:
1. **Numerical Weather Forecasting & Climate Modeling**: Finite-difference and spectral PDE solvers discretizing atmospheric grids into billions of grid cells.
2. **Computational Fluid Dynamics (CFD)**: Simulating airflow over aircraft wings, turbulent flows in jet engines, and aerodynamic vehicle drag.
3. **Seismic Processing & Geophysics**: Reverse time migration (RTM) analyzing terabytes of acoustic reflection data for petroleum and earthquake fault analysis.
4. **Computational Chemistry & Molecular Dynamics**: Computing pairwise Coulomb and Van der Waals interactions across millions of atoms.
5. **Deep Learning & Matrix Workloads**: Modern GPU Tensor Cores and CPU SIMD extensions borrow directly from vector register and chaining principles to accelerate matrix multiplications ($C = A \\times B$).

## Watch Out: Register Length vs Bit Width Ambiguity

<Callout type="warning" title="Watch Out: Register Length vs Bit Width Ambiguity">
Historical lecture slides and early computer architecture tables often cite vector register sizes as small numbers (e.g., "64", "128", "256") without units, labeling the column ambiguously as "width in bits".
- In the **Cray-1 and VMIPS architectures**, a vector register holds **64 elements**, where each individual element is a **64-bit double-precision float**. Thus, the total physical capacity of each vector register is $64 \\times 64 = 4096 \\text{ bits}$ ($512 \\text{ bytes}$)!
- In contrast, modern commodity CPU SIMD registers (such as Intel SSE, AVX-2, and AVX-512) are named after their **aggregate bit width** (128-bit, 256-bit, and 512-bit registers, holding 2, 4, or 8 64-bit double-precision floats, respectively).

**Exam Rule**: When asked about the Cray-1 or VMIPS vector register specifications in CSS 311, clearly state: **8 vector registers, each storing 64 elements of 64 bits each**.
</Callout>
"""
    },
    "02-why-vector-processing": {
        "title": "Why Vector Processing? Motivation and Bottlenecks",
        "description": "Fundamental limitations of deep pipelines, ILP limits, cache thrashing, and energy efficiency advantages.",
        "order": 2,
        "readingTimeMinutes": 12,
        "sections": [
            {"id": "limits-of-deep-pipelines", "title": "Limitations of Deep Pipelines", "level": 2},
            {"id": "limits-of-ilp", "title": "Limits of Instruction-Level Parallelism (ILP)", "level": 2},
            {"id": "cache-locality-failure", "title": "Failure of Cache Locality for Bulk Scientific Data", "level": 2},
            {"id": "energy-efficiency", "title": "Energy Efficiency and Silicon Economy", "level": 2},
        ],
        "body": """## Limitations of Deep Pipelines

In conventional scalar architectures, designers attempted to increase throughput by deepening CPU pipelines (e.g. 20 to 30 stages in the Pentium 4 era) to achieve higher clock frequencies. However, deep scalar pipelines encounter severe physical barriers:
1. **Clock Rate Limits**: Beyond 3 to 4 GHz, power consumption and thermal dissipation increase exponentially ($P \\propto C V^2 f$).
2. **Branch Penalty**: Scientific code relies heavily on loops. In a 20-stage pipeline, a single branch misprediction flushes dozens of in-flight instructions, squandering valuable clock cycles.
3. **Pipeline Latch Overhead**: As stage delay shrinks, the fixed clock skew and latch propagation overhead consume an increasing percentage of the total clock period.

## Limits of Instruction-Level Parallelism (ILP)

Superscalar processors attempt to extract parallelism dynamically at runtime by fetching, decoding, renaming, and scheduling multiple independent scalar instructions per cycle (out-of-order execution):
- **Complex Dependency Checking**: Out-of-order logic requires reservation stations, reorder buffers (ROB), and large register alias tables. The hardware complexity and silicon area of associative hazard-checking logic scale as $O(w^2)$ where $w$ is issue width.
- **Diminishing Returns**: Real-world scalar programs rarely possess more than 2 to 3 independent instructions per cycle due to true data dependencies (RAW) and control dependencies.

## Failure of Cache Locality for Bulk Scientific Data

Scalar processors rely heavily on caches (L1, L2, L3) to bridge the processor-memory speed gap. Caches depend on **temporal locality** (reusing the same address) and **spatial locality** (accessing nearby addresses):
- In large-scale scientific simulations (e.g., streaming over a 10 GB 3-D mesh array), each array element is accessed only once or twice per time step.
- The working set drastically exceeds cache size, causing constant cache line evictions, cache pollution, and high miss penalties.
- Scalar load instructions stall the CPU execution pipeline waiting for DRAM latency.

## Energy Efficiency and Silicon Economy

Vector processing fundamentally solves these limitations by raising the level of abstraction from single data words to entire vectors:
1. **Single Instruction Replaces a Loop**: One vector instruction expresses 64 or more independent operations. The CPU executes only **one fetch and one decode**, amortizing control overhead across all elements.
2. **Guaranteed Independent Operations**: By ISA definition, elements within a vector instruction are mutually independent. The hardware needs no complex dynamic dependency checking or out-of-order scheduling logic.
3. **Structured Memory Access**: Because vector loads declare an explicit stride (e.g. unit stride), the memory system can initiate bulk, interleaved pipelined memory requests directly from DRAM banks without cache overhead.
4. **Energy Economy**: Eliminating loop branches, counter updates, and superscalar speculation saves tremendous amounts of power per computed floating-point operation.
"""
    },
    "03-pipelining": {
        "title": "Pipelining Principles and Space-Time Analysis",
        "description": "Pipeline segments, interface registers, the Ai * Bi + Ci three-segment derivation, clock-by-clock execution, and space-time diagrams.",
        "order": 3,
        "readingTimeMinutes": 16,
        "sections": [
            {"id": "pipelining-foundations", "title": "Pipelining Foundations: Segments and Registers", "level": 2},
            {"id": "three-segment-example", "title": "The Ai * Bi + Ci Three-Segment Example", "level": 2},
            {"id": "speedup-derivation", "title": "Speedup and Efficiency Derivation", "level": 2},
            {"id": "spacetime-diagram", "title": "Space-Time Diagram: Tasks T1 to T6 on a 4-Segment Pipeline", "level": 2},
            {"id": "interactive-pipeline", "title": "Interactive Pipeline Space-Time Simulator", "level": 2},
        ],
        "body": """## Pipelining Foundations: Segments and Registers

**Pipelining** is an implementation technique where multiple arithmetic operations are overlapped in execution across a partitioned sequential hardware circuit, analogous to an industrial manufacturing assembly line:
- The execution unit is divided into $k$ independent functional sub-operations called **segments** (or stages).
- Between adjacent segments, high-speed **interface registers (latches)** isolate the computational logic and synchronize data transfers on each clock pulse.
- All segments operate concurrently on different operands.

<Diagram type="pipeline-3seg" caption="Three-segment arithmetic pipeline for Ai * Bi + Ci with intermediate latches R1 and R2." />

## The Ai * Bi + Ci Three-Segment Example

Consider the evaluation of $n$ independent vector arithmetic operations:

$$
R_i = A_i \\times B_i + C_i \\quad \\text{for } i = 1, 2, \\dots, n
$$

We decompose the calculation into a **3-segment pipeline** ($k = 3$):
1. **Segment 1**: Multiply operands $A_i$ and $B_i$.
   - Output stored in latch register $R_1 \\leftarrow A_i \\times B_i$.
2. **Segment 2**: Add operand $C_i$ to intermediate product.
   - Output stored in latch register $R_2 \\leftarrow R_1 + C_i$.
3. **Segment 3**: Write the final result into destination register.
   - Output stored in register file $R_3 \\leftarrow R_2$.

### Clock-by-Clock Execution Table (for $n = 7$ tasks)

| Clock Pulse | Segment 1 ($A_i \\times B_i$) | Segment 2 ($R_1 + C_i$) | Segment 3 (Write $R_i$) | System Output Completed |
| :---: | :---: | :---: | :---: | :---: |
| **C1** | Task 1 ($A_1 \\times B_1$) | — | — | None |
| **C2** | Task 2 ($A_2 \\times B_2$) | Task 1 ($R_1 + C_1$) | — | None |
| **C3** | Task 3 ($A_3 \\times B_3$) | Task 2 ($R_1 + C_2$) | Task 1 (Write) | **$R_1$ Complete** |
| **C4** | Task 4 ($A_4 \\times B_4$) | Task 3 ($R_1 + C_3$) | Task 2 (Write) | **$R_2$ Complete** |
| **C5** | Task 5 ($A_5 \\times B_5$) | Task 4 ($R_1 + C_4$) | Task 3 (Write) | **$R_3$ Complete** |
| **C6** | Task 6 ($A_6 \\times B_6$) | Task 5 ($R_1 + C_5$) | Task 4 (Write) | **$R_4$ Complete** |
| **C7** | Task 7 ($A_7 \\times B_7$) | Task 6 ($R_1 + C_6$) | Task 5 (Write) | **$R_5$ Complete** |
| **C8** | — (Pipeline draining) | Task 7 ($R_1 + C_7$) | Task 6 (Write) | **$R_6$ Complete** |
| **C9** | — | — | Task 7 (Write) | **$R_7$ Complete** |

## Speedup and Efficiency Derivation

Let $k$ be the number of pipeline segments, and $n$ be the number of tasks.

1. **Pipelined Execution Time ($T_p$)**:
   - The first task $T_1$ requires $k$ clock cycles to fill the pipeline.
   - Each of the remaining $n - 1$ tasks exits at the rate of **1 task per clock cycle**.
   $$
   T_p = k + (n - 1) = k + n - 1 \\text{ clock cycles}
   $$

2. **Unpipelined (Non-pipelined) Sequential Execution Time ($T_n$)**:
   - Each task completes all $k$ steps sequentially before the next task begins:
   $$
   T_n = n \\times k \\text{ clock cycles}
   $$

3. **Speedup ($S_k$)**:
   $$
   S_k = \\frac{T_n}{T_p} = \\frac{n \\cdot k}{k + n - 1}
   $$
   - **Worked Case**: For $k = 3$ segments and $n = 7$ tasks:
     $$
     T_p = 3 + 7 - 1 = 9 \\text{ cycles} \\quad \\text{vs.} \\quad T_n = 7 \\times 3 = 21 \\text{ cycles}
     $$
     $$
     S_3 = \\frac{21}{9} = 2.33x
     $$
   - **Asymptotic Limit**: As $n \\to \\infty$, $\\lim_{n \\to \\infty} S_k = k$. The maximum theoretical speedup equals the number of pipeline segments!

4. **Pipeline Efficiency ($E_k$)**:
   $$
   E_k = \\frac{S_k}{k} = \\frac{n}{k + n - 1}
   $$

## Space-Time Diagram: Tasks T1 to T6 on a 4-Segment Pipeline

A **space-time diagram** plots segment utilization (vertical axis) against discrete clock cycles (horizontal axis):

<Diagram type="pipeline-spacetime" caption="Space-time diagram of 6 tasks on a 4-segment pipeline (9 total cycles)." />

- Segments $k = 4$, tasks $n = 6$.
- Total execution time: $T_p = 4 + 6 - 1 = 9$ clock cycles.
- Unpipelined time: $T_n = 6 \\times 4 = 24$ clock cycles.
- Speedup: $S_4 = 24 / 9 = 2.67x$.

## Interactive Pipeline Space-Time Simulator

Experiment with arbitrary segment and task counts using the live simulator below:

<PipelineSimulator />
"""
    },
    "04-pipeline-conflicts": {
        "title": "Pipeline Conflicts and Hazards",
        "description": "Classification of pipeline hazards: Structural/Resource conflicts, Data dependencies, and Control/Branch difficulties with hardware solutions.",
        "order": 4,
        "readingTimeMinutes": 12,
        "sections": [
            {"id": "three-major-difficulties", "title": "The Three Major Pipeline Difficulties", "level": 2},
            {"id": "resource-conflicts", "title": "1. Resource Conflicts (Structural Hazards)", "level": 2},
            {"id": "data-dependencies", "title": "2. Data Dependencies (Data Hazards)", "level": 2},
            {"id": "branch-difficulties", "title": "3. Branch Difficulties (Control Hazards)", "level": 2},
            {"id": "vector-solutions", "title": "How Vector Processors Mitigate Pipeline Conflicts", "level": 2},
        ],
        "body": """## The Three Major Pipeline Difficulties

In an ideal pipeline, exactly one instruction or task enters every cycle, and exactly one result departs. In real hardware, three primary conditions disrupt smooth pipeline flow, causing **pipeline stalls (bubbles)**:
1. **Resource Conflicts** (Structural Hazards)
2. **Data Dependencies** (Data Hazards)
3. **Branch Difficulties** (Control Hazards)

## 1. Resource Conflicts (Structural Hazards)

A **resource conflict** arises when the physical hardware cannot support all possible combinations of instructions in the same clock cycle because two or more segments demand simultaneous access to the same shared physical hardware resource:
- **Single-Ported Memory Contention**: Occurs if an instruction fetch stage and a data memory access stage attempt to read from the same memory bank simultaneously.
- **Shared Multipliers / Dividers**: In non-fully pipelined functional units, an operation requiring multiple cycles (e.g. division) blocks subsequent instructions from entering that execution segment.

### Hardware Solutions
- Separate Harvard memory architecture (separate Instruction Cache and Data Cache).
- Multi-ported register files with dedicated independent read and write ports.
- Interleaved, multi-bank memory systems.

## 2. Data Dependencies (Data Hazards)

A **data dependency** occurs when an instruction in the pipeline depends on the result of a preceding instruction that has not yet exited the execution unit:
- **Read-After-Write (RAW / True Data Dependency)**: Instruction $J$ attempts to read operand $R_1$ before instruction $I$ has written its result to $R_1$.
- **Write-After-Read (WAR / Anti-Dependency)**: Instruction $J$ writes to register $R_1$ before instruction $I$ reads its existing value.
- **Write-After-Write (WAW / Output Dependency)**: Instruction $J$ writes to $R_1$ before instruction $I$ writes to $R_1$, risking incorrect final state in out-of-order execution.

### Hardware Solutions
- **Operand Forwarding (Bypassing)**: Routing the computed result directly from the output of an ALU stage back into the input multiplexer of the next instruction's ALU stage, bypassing register file write latency.
- **Vector Chaining**: Allowing a second vector functional unit to begin processing the first output elements of a preceding vector unit as soon as they emerge, without waiting for the entire vector of 64 elements to complete.

## 3. Branch Difficulties (Control Hazards)

A **branch difficulty** arises from conditional and unconditional branch instructions that alter the Program Counter:
- In a pipelined CPU, subsequent instructions are fetched before the conditional branch outcome is evaluated in later execution stages.
- If the branch is taken, all speculatively fetched instructions in preceding stages must be purged (**pipeline flush**), wasting cycles.

### Hardware Solutions
- **Branch Target Buffers (BTB)** and dynamic branch predictors.
- **Delayed Branching**: Reorganizing code so instructions in the branch delay slot always execute safely.
- **Predicated Execution / Vector Masking**: In vector processors, conditional statements (`if-else`) inside loops are executed using **vector mask registers (`VMASK`)**. Instead of branching, all iterations execute, and the mask simply enables or disables write-back of results into the destination vector register.

## How Vector Processors Mitigate Pipeline Conflicts

| Pipeline Difficulty | Impact on Scalar CPU | Vector Processor Mitigation |
| :--- | :--- | :--- |
| **Control Hazards** | Constant branch flushes in loops | Entire loop replaced by 1 vector instruction; zero branches! |
| **Data Hazards** | Frequent RAW stalls between loop steps | Intra-vector elements are guaranteed independent by ISA definition |
| **Structural Hazards** | Register file port bottlenecks | Multi-ported vector registers with dedicated read/write reservation channels |
"""
    },
    "05-simd": {
        "title": "SIMD Processing: Array Processors vs. Vector Processors",
        "description": "Flynn's classification, SIMD in space (Array Processors) vs SIMD in time (Vector Processors), and trade-offs.",
        "order": 5,
        "readingTimeMinutes": 12,
        "sections": [
            {"id": "flynns-taxonomy", "title": "Flynn's Classical Computer Architecture Taxonomy", "level": 2},
            {"id": "simd-models", "title": "Two Paradigms of SIMD: Space vs. Time", "level": 2},
            {"id": "array-processors", "title": "1. Array Processors (Parallelism in Space)", "level": 2},
            {"id": "vector-processors-simd", "title": "2. Vector Processors (Parallelism in Time)", "level": 2},
            {"id": "space-vs-time-table", "title": "Array vs. Vector Comparison Table", "level": 2},
        ],
        "body": """## Flynn's Classical Computer Architecture Taxonomy

In 1966, Michael J. Flynn classified computer architectures into four categories based on the concurrency of instruction and data streams:

1. **SISD (Single Instruction, Single Data)**: Conventional sequential von Neumann uniprocessor (e.g. early microprocessors).
2. **SIMD (Single Instruction, Multiple Data)**: A single control unit broadcasts one machine instruction that executes simultaneously across multiple distinct data elements.
3. **MISD (Multiple Instruction, Single Data)**: Multiple instructions operate concurrently on a single data stream (primarily systolic arrays and redundant fault-tolerant systems).
4. **MIMD (Multiple Instruction, Multiple Data)**: Multiple independent processors asynchronously executing different programs on different data (e.g. multi-core CPUs, clusters running MPI).

Vector computing belongs squarely to the **SIMD** class.

## Two Paradigms of SIMD: Space vs. Time

Within the SIMD classification, computer architects exploit data parallelism using two distinct physical methodologies:
1. **Parallelism in Space**: Array Processors
2. **Parallelism in Time**: Pipelined Vector Processors

<Diagram type="simd-array-vs-vector" caption="Array Processor (SIMD in Space) vs Vector Processor (SIMD in Time)." />

## 1. Array Processors (Parallelism in Space)

An **Array Processor** consists of a single master Control Unit (CU) coupled to an array of $N$ identical, replicated Processing Elements (PEs):
- Each PE has its own Arithmetic Logic Unit (ALU), working registers, and local memory.
- The central Control Unit decodes the instruction stream and broadcasts the same operation to all $N$ PEs.
- All $N$ PEs execute the operation **at the exact same instant in time (clock cycle)** on their local data words.
- Inactive PEs can be masked out using an enable bit.
- *Historical Milestone*: **ILLIAC IV** (64 PEs), Thinking Machines **CM-2** (Connection Machine).

## 2. Vector Processors (Parallelism in Time)

A **Vector Processor** operates through a small number of deeply pipelined, high-speed execution units rather than dozens of replicated ALUs:
- A single vector instruction streams successive vector elements through the pipelined functional unit **in consecutive clock cycles**.
- At any instant in time, different segments of the pipeline are operating on different elements of the vector array.
- High throughput is achieved not by replicating ALUs across physical chip area, but by keeping the pipeline continuously full (producing 1 result per cycle).
- *Historical Milestone*: **Cray-1**, **NEC SX Series**.

## Array vs. Vector Comparison Table

| Architectural Dimension | Array Processors (SIMD in Space) | Vector Processors (SIMD in Time) |
| :--- | :--- | :--- |
| **Execution Domain** | Space (replicated parallel PEs) | Time (pipelined arithmetic stages) |
| **Hardware Repertoire** | $N$ complete physical ALUs | 1 (or few) deeply pipelined ALUs |
| **Silicon Area** | High area spent duplicating logic | Compact area; high clock optimization |
| **Clock Frequency** | Typically lower due to clock distribution | Very high due to simple, balanced stages |
| **Data Routing** | Inter-PE communication mesh | High-bandwidth interleaved memory |
| **Latency for Single Result** | 1 clock cycle (all PEs finish together) | $k$ cycles (filling pipeline latency) |
| **Modern Manifestation** | GPU compute units, TPU systolic arrays | CPU AVX-512, ARM SVE, RISC-V Vector |
"""
    },
    "06-vector-processor-concepts": {
        "title": "Core Vector Processor Concepts and Strip-Mining",
        "description": "Vector registers, VLEN, MVL, stride, strip-mining algorithm, memory interleaving, and scalar vs vector code.",
        "order": 6,
        "readingTimeMinutes": 16,
        "sections": [
            {"id": "vector-registers-mvl", "title": "Vector Registers, VLEN, and MVL", "level": 2},
            {"id": "vector-stride", "title": "Vector Stride and Non-Unit Memory Access", "level": 2},
            {"id": "strip-mining", "title": "Strip-Mining When n > MVL", "level": 2},
            {"id": "memory-interleaving", "title": "Memory Interleaving and Bank Conflicts", "level": 2},
            {"id": "scalar-vs-vector-code", "title": "100-Element Addition: Scalar vs. Vector Code", "level": 2},
            {"id": "matrix-mult-cost", "title": "Matrix Multiplication Vector Cost (n^3 Operations)", "level": 2},
            {"id": "interactive-stripmining", "title": "Interactive Vector Loop & Strip-Mining Simulator", "level": 2},
        ],
        "body": """## Vector Registers, VLEN, and MVL

Vector architectures structure data storage around specialized register sets:
- **Maximum Vector Length (MVL)**: The fixed physical hardware capacity of a vector register (e.g., in Cray-1 and VMIPS, $\\text{MVL} = 64$ elements).
- **Vector Length Register (VLEN)**: A dynamic special-purpose control register that specifies how many elements are to be processed by subsequent vector instructions ($0 \\le \\text{VLEN} \\le \\text{MVL}$).
- When an application loop processes a vector shorter than MVL (e.g. 25 elements), software sets $\\text{VLEN} = 25$. Subsequent vector operations execute only on elements $0$ through $24$, avoiding unnecessary computation.

## Vector Stride and Non-Unit Memory Access

In multi-dimensional array processing, consecutive vector elements in memory do not always reside in adjacent addresses:
- **Unit Stride (Stride = 1)**: Elements reside in contiguous adjacent memory words (e.g., iterating across rows in C row-major layout).
- **Non-Unit Stride (Stride > 1)**: Elements are separated by a constant interval (e.g., accessing a column of a matrix stored in row-major layout has stride equal to row width).
- **Vector Stride Register (VSTR)**: Holds the byte step size between consecutive vector elements.
- **Gather / Scatter (Indexed Stride)**: Non-constant addressing using an index vector for sparse matrices ($C[A[i]] = B[i]$).

## Strip-Mining When n > MVL

When a user program processes an array of size $n$ that exceeds the hardware limit ($n > \\text{MVL}$), the compiler generates a technique called **strip-mining**:
1. The long loop of $n$ iterations is partitioned into chunks (strips) of maximum size $\\text{MVL}$.
2. The first strip processes the **remainder elements**:
   $$
   \\text{first\\_len} = n \\pmod{\\text{MVL}}
   $$
   (If $n$ is an exact multiple of MVL, the first strip processes MVL elements).
3. All subsequent strips process exactly $\\text{MVL}$ elements.
4. Total strip-mining loop iterations:
   $$
   \\text{Passes} = \\left\\lceil \\frac{n}{\\text{MVL}} \\right\\rceil
   $$

### Worked Example: $n = 100$, $\\text{MVL} = 64$
- $\\text{Passes} = \\lceil 100 / 64 \\rceil = 2$ passes.
- **Pass 1**: $\\text{VLEN} = 100 \\pmod{64} = 36$ elements. Processes indices $0$ to $35$.
- **Pass 2**: $\\text{VLEN} = 64$ elements. Processes indices $36$ to $99$.

## Memory Interleaving and Bank Conflicts

To supply 1 or 2 64-bit words per cycle to high-speed vector functional units, main memory is organized into **interleaved memory banks**:
- **Address Mapping**: Address $A$ is routed to memory bank $B = A \\pmod M$, where $M$ is the number of banks.
- **Memory Bank Cycle Time ($t_{cycle}$)**: After a bank is accessed, it cannot service another request for $t_{cycle}$ clock cycles.
- **Bank Conflict**: If a strided vector access hits the same memory bank before $t_{cycle}$ has elapsed, the vector load stalls.
- **Golden Rule**: Bank conflicts occur whenever the stride and the number of banks share a common factor: $\\gcd(\\text{stride}, M) > 1$. Odd strides and prime bank counts prevent conflicts!

## 100-Element Addition: Scalar vs. Vector Code

Consider calculating $C[i] = A[i] + B[i]$ for $n = 100$ double-precision floats:

### 1. Scalar Assembly Loop (MIPS)
```assembly
    LI   R1, 0          ; i = 0
LOOP:
    LW   R2, 0(Ra)      ; Load A[i]
    LW   R3, 0(Rb)      ; Load B[i]
    ADD  R4, R2, R3     ; Add A[i] + B[i]
    SW   R4, 0(Rc)      ; Store C[i]
    ADDI Ra, Ra, 8      ; Advance ptr A
    ADDI Rb, Rb, 8      ; Advance ptr B
    ADDI Rc, Rc, 8      ; Advance ptr C
    ADDI R1, R1, 1      ; i++
    BNE  R1, 100, LOOP  ; Loop test
```
- **Total Instructions Executed**: $100 \\times 6 = 600$ instructions!
- High branch prediction traffic, instruction cache misses, and pipeline stalls.

### 2. VMIPS Vector Assembly (with Strip-Mining)
```assembly
    LI    R1, 36        ; 100 % 64 = 36 elements first
    MTC1  VLEN, R1      ; Set hardware VLEN = 36
STRIP:
    LV    V1, Ra        ; Vector Load array A
    LV    V2, Rb        ; Vector Load array B
    ADDV  V3, V1, V2    ; 1 instruction adds 36 (or 64) elements!
    SV    V3, Rc        ; Vector Store array C
    SLL   R2, R1, 3     ; byte offset = VLEN * 8
    DADDU Ra, Ra, R2    ; Advance pointers
    DADDU Rb, Rb, R2
    DADDU Rc, Rc, R2
    DSUBU R_rem, R_rem, R1 ; Decrement remaining
    LI    R1, 64        ; Set VLEN = 64 for next pass
    MTC1  VLEN, R1
    BGTZ  R_rem, STRIP  ; Loop only twice!
```
- **Total Instructions Executed**: Only 12 instructions executed across both passes!

## Matrix Multiplication Vector Cost (n^3 Operations)

Multiplying two $n \\times n$ matrices $C = A \\times B$:
- Standard scalar algorithm executes 3 nested loops:
  $$
  C_{i, j} = \\sum_{k=0}^{n-1} A_{i, k} \\times B_{k, j}
  $$
- Total floating-point operations: $n^3$ multiplications and $n^3$ additions $= 2n^3$ FLOPs.
- In vector processors, the innermost loop is replaced by an **accumulating vector inner product** (or vector-matrix row multiply-add). The number of instruction issues drops from $O(n^3)$ to $O(n^2)$.

## Interactive Vector Loop & Strip-Mining Simulator

Test different array sizes and hardware vector limits live:

<VectorLoopComparison />
"""
    },
    "07-vmips-architecture": {
        "title": "VMIPS Architecture and Instruction Set",
        "description": "VMIPS vector registers (64x64-bit), functional units, load/store unit, and comprehensive instruction set reference.",
        "order": 7,
        "readingTimeMinutes": 16,
        "sections": [
            {"id": "vmips-organization", "title": "VMIPS Architectural Block Diagram", "level": 2},
            {"id": "vector-registers-detail", "title": "Vector Register File & Port Reservation", "level": 2},
            {"id": "functional-units", "title": "Pipelined Vector Functional Units", "level": 2},
            {"id": "instruction-reference", "title": "VMIPS Instruction Set Reference Table", "level": 2},
            {"id": "chaining-and-hazards", "title": "Vector Chaining and Structural Hazards", "level": 2},
            {"id": "watch-out-vmips", "title": "Watch Out: Register Bit Capacity Clarification", "level": 2},
        ],
        "body": """## VMIPS Architectural Block Diagram

**VMIPS** is the prototypical vector instruction set architecture designed for academic study (Hennessy and Patterson), modeled closely after the Cray-1:
- Consists of a standard 32-bit scalar MIPS CPU augmented with a **Vector Processing Unit**.
- Features 8 primary vector registers ($V_0$ to $V_7$).
- Fully pipelined arithmetic execution units running concurrently.
- Dedicated vector load/store unit interfacing with multi-bank memory.

<Diagram type="vmips-architecture" caption="VMIPS architectural block diagram showing 8 vector registers, functional units, and memory banks." />

## Vector Register File & Port Reservation

The VMIPS vector register file contains:
- **8 Vector Registers ($V_0$ through $V_7$)**: Each register holds **64 elements of 64 bits each** (512 bytes).
- **Read / Write Ports**: To sustain concurrent operations (e.g. performing a vector multiply and a vector add at the same time), each vector register has multiple independent read ports and write ports.
- **Control Registers**:
  - `VLEN` (Vector Length): Holds the number of active elements ($1$ to $64$).
  - `VSTR` (Vector Stride): Holds memory stride in bytes.
  - `VMASK` (Vector Mask): 64-bit register used for conditional execution.

## Pipelined Vector Functional Units

All vector functional units in VMIPS are fully pipelined (they accept a new pair of operands every single clock cycle):
1. **FP Add / Subtract**: Pipelined into 6 stages (latency $= 6$ cycles).
2. **FP Multiply**: Pipelined into 7 stages (latency $= 7$ cycles).
3. **FP Divide**: Pipelined into 20 stages (latency $= 20$ cycles, typically non-pipelined or partially pipelined).
4. **Integer ALU / Logical**: Pipelined into 2 stages.
5. **Vector Load / Store Unit**: Pipelined unit with address generators.

## VMIPS Instruction Set Reference Table

| VMIPS Instruction | Operands | Operation Performed | Architectural Description |
| :--- | :--- | :--- | :--- |
| `ADDV.D` | `Vd, Vs1, Vs2` | $Vd[i] = Vs1[i] + Vs2[i]$ | Vector-Vector Double FP Addition for $0 \\le i < \\text{VLEN}$ |
| `SUBV.D` | `Vd, Vs1, Vs2` | $Vd[i] = Vs1[i] - Vs2[i]$ | Vector-Vector Double FP Subtraction |
| `MULV.D` | `Vd, Vs1, Vs2` | $Vd[i] = Vs1[i] \\times Vs2[i]$ | Vector-Vector Double FP Multiplication |
| `DIVV.D` | `Vd, Vs1, Vs2` | $Vd[i] = Vs1[i] / Vs2[i]$ | Vector-Vector Double FP Division |
| `ADDVS.D` | `Vd, Vs, Fs` | $Vd[i] = Vs[i] + Fs$ | Vector-Scalar Double FP Addition (broadcasts scalar $Fs$) |
| `MULVS.D` | `Vd, Vs, Fs` | $Vd[i] = Vs[i] \\times Fs$ | Vector-Scalar Double FP Multiplication |
| `LV` | `Vd, Ra` | $Vd[i] = \\text{Mem}[Ra + i \\times \\text{stride}]$ | Vector Load from base scalar address $Ra$ with stride |
| `SV` | `Vs, Ra` | $\\text{Mem}[Ra + i \\times \\text{stride}] = Vs[i]$ | Vector Store to base scalar address $Ra$ with stride |
| `LVI` | `Vd, Ra, Vindex` | $Vd[i] = \\text{Mem}[Ra + Vindex[i]]$ | Gather (Indexed Vector Load for sparse matrix) |
| `SVI` | `Vs, Ra, Vindex` | $\\text{Mem}[Ra + Vindex[i]] = Vs[i]$ | Scatter (Indexed Vector Store) |
| `MTC1` | `VLEN, Rs` | $\\text{VLEN} = Rs$ | Move from general-purpose register $Rs$ to control register |
| `MFC1` | `Rd, VLEN` | $Rd = \\text{VLEN}$ | Move from control register to general-purpose register |
| `C.LT.D` | `Vs1, Vs2` | $\\text{VMASK}[i] = (Vs1[i] < Vs2[i])$ | Vector Compare: sets corresponding bits in VMASK register |

## Vector Chaining and Structural Hazards

- **Without Chaining**: If instruction 2 depends on instruction 1 (`MULV.D V1, ...` followed by `ADDV.D V3, V1, V2`), instruction 2 must wait until all 64 elements of $V_1$ are written back into the register file.
- **With Chaining**: The output of the multiplier pipeline is routed directly into the adder pipeline as soon as element 0 emerges. Both pipelines run concurrently in lock-step, reducing total execution time from $64 + 64 = 128$ cycles to approximately $64 + \\text{latencies}$.

## Watch Out: Register Bit Capacity Clarification

<Callout type="warning" title="Watch Out: Register Bit Capacity Clarification">
Beware of slide statements asserting that a vector register "holds 64-bit information".
- In VMIPS, **each individual vector element is 64 bits** (standard IEEE 754 double precision).
- Each register stores **64 such elements**.
- Thus, the total capacity per register is **4,096 bits (512 bytes)**, and the entire 8-register bank stores $8 \\times 512 = 4,096 \\text{ bytes}$ of data!
</Callout>
"""
    },
    "08-performance-measures": {
        "title": "Performance Measures: MIPS, FLOPS, and Roofline Limits",
        "description": "Evaluating vector performance, peak vs sustained FLOPS, arithmetic intensity, and vector limits.",
        "order": 8,
        "readingTimeMinutes": 12,
        "sections": [
            {"id": "mips-vs-flops", "title": "MIPS vs. FLOPS in Vector Computing", "level": 2},
            {"id": "vector-advantages", "title": "Architectural Vector Advantages", "level": 2},
            {"id": "performance-limitations", "title": "Performance Limitations (Amdahl & Startup Overhead)", "level": 2},
            {"id": "arithmetic-intensity", "title": "Memory Bandwidth and Arithmetic Intensity", "level": 2},
        ],
        "body": """## MIPS vs. FLOPS in Vector Computing

In scalar computer evaluation, **MIPS (Million Instructions Per Second)** was historically used:

$$
\\text{MIPS} = \\frac{\\text{Instruction Count}}{\\text{Execution Time} \\times 10^6} = \\frac{f}{\\text{CPI} \\times 10^6}
$$

However, in vector computing, **MIPS is completely meaningless and misleading**:
- A single vector instruction (`ADDV`) performs 64 arithmetic operations while counting as **only one machine instruction**.
- A scalar processor executing 64 additions executes 600 instructions (yielding a high MIPS rating), whereas a vector processor executes 1 instruction (yielding a tiny MIPS rating) while completing the exact same math ten times faster!

Consequently, scientific computing measures throughput exclusively in **FLOPS (Floating-Point Operations Per Second)**:

$$
\\text{FLOPS} = \\frac{\\text{Floating-Point Operations Executed}}{\\text{Execution Time (seconds)}}
$$

Units: **MFLOPS** ($10^6$), **GFLOPS** ($10^9$), **TFLOPS** ($10^{12}$), **PFLOPS** ($10^{15}$), and **EFLOPS** ($10^{18}$).

## Architectural Vector Advantages

1. **Massive Loop Overhead Elimination**: Replaces hundreds of branch tests, loop counter increments, and pointer updates with a single instruction issue.
2. **Deterministic Memory Prefetching**: Memory controllers know the exact stride and sequence of addresses across 64 elements in advance, enabling optimal DRAM bank pre-charging.
3. **No Dynamic Branch Mispredictions**: Conditional loop code uses vector masking, eliminating pipeline stalls from mispredicted branches.
4. **Guaranteed Independent Parallelism**: The hardware pipeline runs at 100% capacity without needing complex hazard detection logic.

## Performance Limitations (Amdahl & Startup Overhead)

Vector supercomputers do not achieve ideal speedup across all applications due to three fundamental constraints:

1. **Amdahl's Law on Scalar Fraction ($f_s$)**:
   If an application spends a fraction $f_s$ of its operations in scalar code that cannot be vectorized, overall speedup is strictly capped:
   $$
   \\text{Speedup} \\le \\frac{1}{f_s + \\frac{1 - f_s}{\\text{Speedup}_{vector}}} \\le \\frac{1}{f_s}
   $$
   Even with infinite vector speed, if 10% of code is scalar, maximum speedup cannot exceed $1 / 0.10 = 10x$!

2. **Vector Startup Latency ($T_s$)**:
   Filling the functional unit and memory pipelines requires an initial latency $k$. For very short vector lengths ($n \\ll \\text{MVL}$), startup overhead dominates, making vector execution slower than scalar code.

3. **Memory Bandwidth Bottleneck**:
   If the memory bus cannot sustain 2 words of input and 1 word of output per cycle per functional unit, the execution pipelines starve.

## Memory Bandwidth and Arithmetic Intensity

A vector kernel's performance is governed by its **Arithmetic Intensity** ($I$):

$$
I = \\frac{\\text{Floating-Point Operations (FLOPs)}}{\\text{Bytes Transferred from Memory (Bytes)}}
$$

- Vector Addition ($C[i] = A[i] + B[i]$): Reads 16 bytes ($A, B$), writes 8 bytes ($C$), performs 1 FLOP. Arithmetic intensity $= 1 / 24 \\approx 0.042 \\text{ FLOP/Byte}$ (**Memory-bound**).
- Matrix Multiply ($C = A \\times B$): $2n^3$ FLOPs on $3n^2$ words. Arithmetic intensity $= O(n)$ (**Compute-bound**).
"""
    },
    "09-modern-practice": {
        "title": "Modern Practice: Auto-Vectorisation and SIMD Intrinsics",
        "description": "Translating vector concepts to modern GCC compiler auto-vectorisation (-O3, -fopt-info-vec) and OpenMP SIMD pragma with compilable code.",
        "order": 9,
        "readingTimeMinutes": 14,
        "sections": [
            {"id": "modern-simd-evolution", "title": "Evolution to Commodity SIMD (AVX & SVE)", "level": 2},
            {"id": "gcc-autovec-flags", "title": "GCC Auto-Vectorisation Flags", "level": 2},
            {"id": "compilable-vector-c", "title": "Compilable Vector Addition in C", "level": 2},
            {"id": "pragma-omp-simd", "title": "Explicit Vectorisation with #pragma omp simd", "level": 2},
            {"id": "verification-report", "title": "Analyzing GCC -fopt-info-vec Report", "level": 2},
        ],
        "body": """## Evolution to Commodity SIMD (AVX & SVE)

Modern general-purpose computing has internalized classical vector supercomputing principles into CPU Instruction Set Architectures:
- **x86 Extensions**: SSE (128-bit), AVX/AVX-2 (256-bit), AVX-512 (512-bit registers $ZMM_0..ZMM_{31}$).
- **ARM SVE / SVE2**: Scalable Vector Extension on ARMv8/v9 (variable vector register length from 128 to 2048 bits without recompilation, used in the Fugaku supercomputer).
- **RISC-V Vector Extension (RVV)**: Adopts true Cray-style vector length registers (`vsetvl`) and strip-mining hardware support!

## GCC Auto-Vectorisation Flags

Modern optimizing compilers (GCC, Clang) automatically transform scalar loops into hardware SIMD instructions when safe:
- `-O3`: Enables high-level loop transformations, loop unrolling, and tree auto-vectorisation.
- `-march=native`: Directs the compiler to emit the highest SIMD instructions supported by the host CPU (e.g. AVX-2, AVX-512).
- `-fopt-info-vec`: Instructs GCC to output diagnostic messages reporting which loops were successfully vectorized and which loops failed.
- `-fopt-info-vec-missed`: Explains *why* a loop could not be vectorized (e.g. data alignment, pointer aliasing, function calls).

## Compilable Vector Addition in C

The following complete C program demonstrates vector addition optimized for compiler vectorization:

```c
/* vector_add.c - Verifiable SIMD vector addition */
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define N 1000000

/* Use __restrict__ to inform the compiler that pointers do not alias */
void vec_add(const double * __restrict__ a, 
             const double * __restrict__ b, 
             double * __restrict__ c, 
             int n) {
    #pragma omp simd
    for (int i = 0; i < n; i++) {
        c[i] = a[i] + b[i];
    }
}

int main(void) {
    /* Allocate 64-byte aligned buffers for AVX-512 compatibility */
    double *a = (double *)aligned_alloc(64, N * sizeof(double));
    double *b = (double *)aligned_alloc(64, N * sizeof(double));
    double *c = (double *)aligned_alloc(64, N * sizeof(double));

    if (!a || !b || !c) {
        fprintf(stderr, "Memory allocation failed\\n");
        return 1;
    }

    for (int i = 0; i < N; i++) {
        a[i] = 1.0;
        b[i] = 2.0;
    }

    vec_add(a, b, c, N);

    /* Verify correctness */
    int correct = 1;
    for (int i = 0; i < N; i++) {
        if (c[i] != 3.0) {
            correct = 0;
            break;
        }
    }

    printf("Vector Add completed: %s (c[0] = %.1f, c[N-1] = %.1f)\\n", 
           correct ? "SUCCESS" : "FAILURE", c[0], c[N-1]);

    free(a);
    free(b);
    free(c);
    return 0;
}
```

### Compile and Run Commands
```bash
gcc -O3 -march=native -fopt-info-vec vector_add.c -o vector_add
./vector_add
```

### Expected Output
```text
vector_add.c:13:5: optimized: loop vectorized using 32 byte vectors
Vector Add completed: SUCCESS (c[0] = 3.0, c[N-1] = 3.0)
```

## Explicit Vectorisation with #pragma omp simd

While `-O3` attempts heuristic vectorisation, the OpenMP standard provides `#pragma omp simd` to give the programmer direct control:
- Informs the compiler that loop iterations are strictly data-independent.
- Ignores potential pointer aliasing warnings.
- Supports clauses such as `aligned(ptr: 64)` and `reduction(+: sum)`.

## Analyzing GCC -fopt-info-vec Report

When inspecting `-fopt-info-vec`:
1. `loop vectorized using 32 byte vectors`: Confirms that GCC emitted 256-bit AVX instructions (processing 4 64-bit doubles per cycle).
2. If GCC outputs `missed: couldn't vectorize loop: not enough data-refs`, check for:
   - Function calls inside the loop body (e.g. `printf` or non-inlined math functions).
   - Non-contiguous pointer references.
   - Loop-carried data dependencies (e.g., $A[i] = A[i-1] + B[i]$).
"""
    }
}

out_dir = os.path.join(os.getcwd(), 'content/vectors')
os.makedirs(out_dir, exist_ok=True)

for slug, data in topics.items():
    file_path = os.path.join(out_dir, f"{slug}.mdx")
    with open(file_path, "w") as f:
        f.write("---\n")
        f.write(f"id: {slug}\n")
        f.write(f"slug: {slug}\n")
        f.write(f"technology: vectors\n")
        f.write(f"order: {data['order']}\n")
        f.write(f"title: \"{data['title']}\"\n")
        f.write(f"description: \"{data['description']}\"\n")
        f.write(f"readingTimeMinutes: {data['readingTimeMinutes']}\n")
        f.write("sections:\n")
        for sec in data["sections"]:
            f.write(f"  - id: {sec['id']}\n")
            f.write(f"    title: \"{sec['title']}\"\n")
            f.write(f"    level: {sec['level']}\n")
        f.write("---\n\n")
        f.write(data["body"].strip())
        f.write("\n")
    print(f"Generated {file_path}")

print("All Part D MDX files generated successfully!")
