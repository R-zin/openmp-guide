#!/usr/bin/env python3
"""
Generate complete MDX content for Part E: Performance Tools and Analysis (Unit V) (01 to 10).
Course: CSS 311 Parallel and Distributed Computing (IIIT Kottayam).
"""

import os

topics = {
    "01-why-performance-tools": {
        "title": "Why Performance Tools? Bottlenecks in Parallel Systems",
        "description": "Understanding why parallel programs rarely achieve linear speedup and identifying root causes of inefficiency.",
        "order": 1,
        "readingTimeMinutes": 14,
        "sections": [
            {"id": "the-parallel-performance-gap", "title": "The Parallel Performance Gap", "level": 2},
            {"id": "load-imbalance", "title": "1. Computational Load Imbalance", "level": 2},
            {"id": "communication-overhead", "title": "2. MPI Communication and Network Delays", "level": 2},
            {"id": "synchronisation-and-locks", "title": "3. OpenMP Synchronisation and Lock Contention", "level": 2},
            {"id": "cache-and-numa", "title": "4. Memory Hierarchy, Cache, and NUMA Effects", "level": 2},
            {"id": "serial-fractions", "title": "5. Amdahl's Law and Inherent Serial Bottlenecks", "level": 2},
        ],
        "body": """## The Parallel Performance Gap

When developing parallel applications with MPI and OpenMP, developers frequently observe a discouraging phenomenon: running on 16 or 64 cores fails to yield a 16x or 64x speedup. In fact, scaling beyond a certain thread count often causes total wall-clock execution time to **increase**.

Parallel programs rarely achieve ideal linear speedup because parallelisation introduces hardware contention, software synchronization, and coordination costs that do not exist in sequential code. 

**Performance tools** are specialized diagnostic software infrastructures designed to measure, attribute, and visualize where time and energy are squandered across thousands of processes and threads.

## 1. Computational Load Imbalance

**Load imbalance** occurs when computational work is distributed unevenly among processes or threads:
- In an MPI cluster running 100 ranks, if 99 ranks finish their computational partition in 2 seconds, but 1 rank requires 10 seconds (due to complex boundary geometry or irregular data), all 99 ranks must sit completely idle at the next collective barrier (`MPI_Barrier`, `MPI_Reduce`) for 8 seconds.
- The slowest thread or rank dictates the wall-clock speed of the entire system.
- *Visual Signature*: High idle wait time at barriers and receive calls.

## 2. MPI Communication and Network Delays

Inter-node communication across network fabrics (Ethernet, InfiniBand) is orders of magnitude slower than on-chip registers or L1 cache:
- **Transmission Latency ($t_s$)**: Startup cost to inject a packet into the network interface.
- **Network Contention**: When multiple ranks simultaneously send messages over the same switch link (e.g. in `MPI_Alltoall`), bisection bandwidth is saturated, causing packet queuing and jitter.
- **Late Sender / Late Receiver**: Blocking point-to-point calls (`MPI_Recv`) stall if the sender has not yet reached its corresponding `MPI_Send`.

## 3. OpenMP Synchronisation and Lock Contention

In shared-memory multi-core systems, threads must coordinate access to shared variables:
- **Critical Section Serialization**: When multiple threads contend for `#pragma omp critical` or explicit locks (`omp_set_lock`), all competing threads are serialized into a sequential queue.
- **Implicit Barrier Overhead**: Every OpenMP work-sharing loop (`#pragma omp for`) includes an implicit barrier at the end of the block unless suppressed by `nowait`.

## 4. Memory Hierarchy, Cache, and NUMA Effects

Multi-core performance is heavily constrained by the memory subsystem:
- **False Sharing**: Occurs when threads on different cores update independent variables that happen to reside on the **same 64-byte cache line**. Coherence protocols (MESI) invalidate the entire cache line across cores, causing continuous bus bouncing and drastic slowdowns.
- **Non-Uniform Memory Access (NUMA)**: On multi-socket motherboards, accessing RAM connected to a remote CPU socket incurs higher latency and lower bandwidth than accessing local RAM.

## 5. Amdahl's Law and Inherent Serial Bottlenecks

Every realistic program contains inherently serial portions (file I/O, initialization, command-line parsing, serial reductions). As demonstrated by Amdahl's Law, even a 5% serial fraction limits theoretical speedup to a maximum of 20x, regardless of whether 1,000 or 100,000 processors are allocated.

Performance analysis tools provide the empirical evidence required to locate and eliminate these bottlenecks systematically.
"""
    },
    "02-performance-engineering-cycle": {
        "title": "The Performance Engineering Workflow",
        "description": "The four iterative phases of HPC optimization: Measure, Analyse, Optimise, and Verify.",
        "order": 2,
        "readingTimeMinutes": 10,
        "sections": [
            {"id": "workflow-cycle", "title": "The 4-Phase Optimization Cycle", "level": 2},
            {"id": "phase-1-measure", "title": "Phase 1: Measure (Data Collection)", "level": 2},
            {"id": "phase-2-analyse", "title": "Phase 2: Analyse (Locating Bottlenecks)", "level": 2},
            {"id": "phase-3-optimise", "title": "Phase 3: Optimise (Targeted Transformations)", "level": 2},
            {"id": "phase-4-verify", "title": "Phase 4: Verify (Correctness and Speedup Validation)", "level": 2},
        ],
        "body": """## The 4-Phase Optimization Cycle

Performance optimization in High-Performance Computing is not guesswork or premature trial-and-error; it is a rigorous, hypothesis-driven engineering methodology structured as a continuous loop:

<Diagram type="performance-workflow" caption="The four phases of the performance engineering workflow: Measure, Analyse, Optimise, Verify." />

The four phases must be executed cyclically until performance and scalability targets are satisfied:

## Phase 1: Measure (Data Collection)
- **Objective**: Collect empirical runtime data without altering the fundamental behavior of the target application.
- **Techniques**:
  - Statistical sampling (using CPU hardware performance counters via `perf` or `gprof`).
  - Source or compiler instrumentation (inserting measurement probes via Score-P or TAU).
- **Deliverables**: Execution profiles (`.cubex`, `gmon.out`) and chronological event traces (`.otf2`).

## Phase 2: Analyse (Locating Bottlenecks)
- **Objective**: Process raw measurement data into actionable diagnostic insights.
- **Techniques**:
  - Identifying the "hotspot" functions consuming the largest fraction of exclusive wall-clock time.
  - Analyzing call trees to trace which parent functions invoked the expensive kernels.
  - Inspecting multi-rank timeline views (e.g. Vampir, Scalasca) to identify wait-states, load imbalances, and communication stalls.
- **Rule of Thumb**: Focus only on the top 1 or 2 dominant bottlenecks (Pareto principle: 80% of execution time is spent in 20% of the code).

## Phase 3: Optimise (Targeted Transformations)
- **Objective**: Apply targeted code and algorithmic modifications to eliminate the identified bottleneck.
- **Typical Remedies**:
  - *Compute Bottleneck*: Apply SIMD vectorisation (`#pragma omp simd`), loop unrolling, or cache tiling/blocking.
  - *Load Imbalance*: Change OpenMP scheduling from `static` to `dynamic` or `guided`; re-partition domain decomposition in MPI.
  - *Communication Latency*: Replace blocking `MPI_Send`/`MPI_Recv` with non-blocking `MPI_Isend`/`MPI_Irecv` to overlap communication with computation; replace point-to-point loops with collective trees (`MPI_Reduce`).
  - *False Sharing*: Pad data structures to 64-byte cache-line boundaries or accumulate into thread-local variables.

## Phase 4: Verify (Correctness and Speedup Validation)
- **Objective**: Confirm that the code produces bit-exact, mathematically correct results and delivers genuine speedup.
- **Checks**:
  - Run regression test suites to ensure numerical accuracy was not broken by compiler flags or reordering.
  - Re-measure wall-clock execution time and calculate speedup and efficiency curves.
  - Verify that eliminating one bottleneck did not shift the primary bottleneck elsewhere.
"""
    },
    "03-key-concepts": {
        "title": "Key Performance Concepts: Scalability, Amdahl, and Gustafson",
        "description": "Rigorous derivations of Speedup, Efficiency, Amdahl's Law (strong scaling), Gustafson's Law (weak scaling), and the Karp-Flatt metric.",
        "order": 3,
        "readingTimeMinutes": 18,
        "sections": [
            {"id": "fundamental-metrics", "title": "Fundamental Metrics: Latency, Overhead, Speedup, Efficiency", "level": 2},
            {"id": "amdahls-law", "title": "Amdahl's Law (Strong Scaling)", "level": 2},
            {"id": "gustafsons-law", "title": "Gustafson's Law (Weak Scaling)", "level": 2},
            {"id": "strong-vs-weak", "title": "Strong Scaling vs. Weak Scaling", "level": 2},
            {"id": "karp-flatt-metric", "title": "The Karp-Flatt Metric (Detecting Inefficiencies)", "level": 2},
            {"id": "interactive-amdahl", "title": "Interactive Scaling Calculator", "level": 2},
        ],
        "body": """## Fundamental Metrics: Latency, Overhead, Speedup, Efficiency

Let $T_s$ (or $T_1$) be the execution time of the best sequential algorithm on 1 processor, and $T_p$ be the parallel execution time on $p$ processors.

1. **Speedup ($S$)**: The ratio of sequential execution time to parallel execution time:
   $$
   S(p) = \\frac{T_s}{T_p}
   $$
   - Ideal linear speedup: $S(p) = p$.
   - Superlinear speedup ($S(p) > p$) occasionally occurs when aggregate cache memory across $p$ nodes suddenly fits the entire dataset, eliminating DRAM misses.

2. **Efficiency ($E$)**: The fraction of time that processors are spent in useful computational work:
   $$
   E(p) = \\frac{S(p)}{p} = \\frac{T_s}{p \\cdot T_p}
   $$
   - Ideal efficiency: $E = 1.0$ (or $100\\%$). In practice, $E < 1.0$ due to overhead.

3. **Total Parallel Overhead ($T_o$)**: The total excess processor-time squandered on non-computational tasks:
   $$
   T_o = p \\cdot T_p - T_s
   $$
   Overhead includes inter-process communication, synchronization barriers, idle wait-time, and OS system calls.

<Diagram type="scaling-curves" caption="Strong scaling (Amdahl asymptote) vs Weak scaling (Gustafson linear scaling)." />

## Amdahl's Law (Strong Scaling)

**Amdahl's Law** models speedup when the **problem size is fixed** and the number of processors increases (**strong scaling**).

### Derivation
Let the sequential runtime be normalized to $1$. Suppose a fraction $s$ ($0 \\le s \\le 1$) of the program is inherently sequential and cannot be parallelized. The remaining fraction $p_{par} = 1 - s$ can be accelerated across $N$ parallel processors.

The parallel execution time on $N$ processors is:

$$
T(N) = s + \\frac{1 - s}{N} = (1 - p_{par}) + \\frac{p_{par}}{N}
$$

The theoretical speedup $S(N)$ is given by:

$$
S(N) = \\frac{T(1)}{T(N)} = \\frac{1}{(1 - p_{par}) + \\frac{p_{par}}{N}}
$$

### Asymptotic Limit
As the processor count approaches infinity ($N \\to \\infty$):

$$
\\lim_{N \\to \\infty} S(N) = \\frac{1}{1 - p_{par}} = \\frac{1}{s}
$$

### Worked Example
Suppose a climate simulation spends $90\\%$ of its time in a parallel PDE solver and $10\\%$ in serial initialization and I/O ($s = 0.10, p_{par} = 0.90$):
- On $N = 4$ cores: $S(4) = \\frac{1}{0.10 + 0.90 / 4} = \\frac{1}{0.10 + 0.225} = \\frac{1}{0.325} \\approx 3.08x$.
- On $N = 16$ cores: $S(16) = \\frac{1}{0.10 + 0.90 / 16} = \\frac{1}{0.10 + 0.05625} \\approx 6.4x$.
- On $N = 1,000,000$ cores: $S(\\infty) = \\frac{1}{0.10} = 10x$. **Speedup can never exceed 10x!**

## Gustafson's Law (Weak Scaling)

In 1988, John Gustafson observed that in scientific computing, scientists do not run a fixed, tiny problem on 10,000 processors. Instead, as more processors become available, scientists **scale up the problem size** (e.g. refining 3-D grid resolution) to fill memory (**weak scaling**).

### Derivation
Let the parallel execution time on $N$ processors with an enlarged dataset be normalized to $1$:
- Let $s$ be the fraction of time spent in serial code on the parallel machine.
- Let $p_{par} = 1 - s$ be the fraction spent in parallel code.

On a single sequential processor, running that enlarged workload would require executing the serial portion once, plus executing all $N$ parallel shares sequentially:

$$
T_{seq} = s + p_{par} \\times N = s + (1 - s)N
$$

Thus, the **scaled speedup** (Gustafson's Law) is:

$$
S(N) = \\frac{T_{seq}}{T_{par}} = \\frac{s + (1 - s)N}{1} = N - s(N - 1)
$$

### Worked Example
For the same $s = 0.10$ serial fraction, on $N = 64$ cores under Gustafson's law:
$$
S(64) = 64 - 0.10(64 - 1) = 64 - 6.3 = 57.7x \\text{ speedup!}
$$

## Strong Scaling vs. Weak Scaling

| Feature | Strong Scaling (Amdahl) | Weak Scaling (Gustafson) |
| :--- | :--- | :--- |
| **Problem Size** | Fixed constant size | Grows proportionally with $N$ |
| **Work per Processor** | Decreases as $1/N$ | Remains constant |
| **Primary Goal** | Minimize time-to-solution for a fixed task | Maximize simulation resolution in constant time |
| **Limiting Factor** | Inherent serial fraction $s$ | Memory bandwidth and communication scale |

## The Karp-Flatt Metric (Detecting Inefficiencies)

When empirical speedup deviates from linear expectations, how can we determine whether the slowdown is caused by an inherently large serial code fraction or by parallel communication overhead?

Alan H. Karp and Horace P. Flatt defined the **experimentally determined serial fraction** ($e$):

$$
e = \\frac{\\frac{1}{S(p)} - \\frac{1}{p}}{1 - \\frac{1}{p}}
$$

Where $p$ is processor count and $S(p)$ is measured empirical speedup.

### Diagnostic Rule
- If the calculated value of $e$ **remains constant** as $p$ increases, the performance limitation is caused by the program's **inherent serial code fraction** $s$.
- If $e$ **increases monotonically** as $p$ increases, the performance degradation is caused by **parallel overheads** (communication latencies, barrier contention, load imbalance) scaling with cluster size!

## Interactive Scaling Calculator

<AmdahlCalculator />
"""
    },
    "04-event-model-execution": {
        "title": "Event-Model Execution and Representation",
        "description": "Modeling parallel execution as a discrete sequence of timestamped events across processes and threads.",
        "order": 4,
        "readingTimeMinutes": 10,
        "sections": [
            {"id": "discrete-event-model", "title": "Execution as a Discrete Event Stream", "level": 2},
            {"id": "event-tuple-structure", "title": "Structure of an Event Record", "level": 2},
            {"id": "event-types-in-hpc", "title": "Standard Event Types (MPI, OpenMP, Hardware)", "level": 2},
            {"id": "state-vs-event", "title": "Events vs. States (Transitions and Durations)", "level": 2},
        ],
        "body": """## Execution as a Discrete Event Stream

To monitor, profile, and trace a parallel application, modern performance tools model execution as a **chronological sequence of discrete events**:
- During execution, every process (in MPI) and every thread (in OpenMP) transitions continuously between computational and communicative phases.
- An **event** is an atomic, instantaneous occurrence at a specific point in time and physical location in the system that alters program state or marks a region boundary.

## Structure of an Event Record

Every measurement event recorded by an instrumentation system contains an immutable data record:

$$
\\text{Event} = \\langle t, \\text{loc}, \\text{type}, \\text{attrs} \\rangle
$$

1. **Timestamp ($t$)**: A high-precision timestamp obtained from high-resolution hardware timers (e.g., CPU Time-Stamp Counter `RDTSC` or `MPI_Wtime()`), typically with nanosecond resolution.
2. **Location ($\text{loc}$)**: The exact hierarchical execution context: $\\langle \\text{Host Node}, \\text{Process / Rank ID}, \\text{Thread ID} \\rangle$.
3. **Event Type ($\text{type}$)**: The semantic category of the event (e.g. Function Enter, Function Exit, Collective Begin).
4. **Attributes ($\text{attrs}$)**: Context-specific metadata:
   - For point-to-point MPI: partner rank, message size in bytes, tag, communicator.
   - For OpenMP: team size, parallel region ID.
   - For hardware counters: instantaneous cache misses, retired instructions.

## Standard Event Types in HPC

| Category | Typical Event Names | When Generated |
| :--- | :--- | :--- |
| **Function Regions** | `REGION_ENTER`, `REGION_EXIT` | At entry prologue and exit epilogue of user functions |
| **MPI Point-to-Point** | `MPI_SEND_START`, `MPI_RECV_COMPLETE` | When initiating or completing message transfers |
| **MPI Collectives** | `MPI_COLLECTIVE_BEGIN`, `MPI_COLLECTIVE_END` | Entry and exit of `MPI_Bcast`, `MPI_Reduce`, etc. |
| **OpenMP Parallel** | `OMP_FORK`, `OMP_JOIN`, `OMP_BARRIER_WAIT` | Thread team creation, destruction, synchronization |
| **Hardware Counters** | `PAPI_TOT_CYC`, `PAPI_L3_TCM` | Periodic hardware performance monitor overflows |

## Events vs. States (Transitions and Durations)

It is crucial to distinguish between an **event** and a **state**:
- An **event** has zero duration ($t_{\\text{duration}} = 0$). It is an instantaneous point transition (e.g., calling `MPI_Send`).
- A **state** has non-zero duration ($t_{\\text{duration}} = t_{\\text{exit}} - t_{\\text{enter}}$). A state is delimited by an enter event and an exit event.
- For example, the state `WAITING_FOR_MPI_RECV` begins at event `ENTER(MPI_Recv)` at $t_1 = 12.4\\text{ms}$ and ends at event `EXIT(MPI_Recv)` at $t_2 = 18.9\\text{ms}$, representing an idle state duration of $6.5\\text{ms}$.
"""
    },
    "05-sampling-vs-instrumentation": {
        "title": "Sampling vs. Instrumentation Measurement Techniques",
        "description": "Comparing statistical sampling (perf, gprof) against source/binary instrumentation (Score-P, TAU), probe overhead, and accuracy.",
        "order": 5,
        "readingTimeMinutes": 14,
        "sections": [
            {"id": "measurement-paradigms", "title": "Two Paradigms of Performance Data Collection", "level": 2},
            {"id": "statistical-sampling", "title": "1. Statistical Sampling (PC Sampling)", "level": 2},
            {"id": "instrumentation", "title": "2. Software Instrumentation (Probe Probing)", "level": 2},
            {"id": "instrumentation-levels", "title": "Levels of Instrumentation (Source, Compiler, Library, Binary)", "level": 2},
            {"id": "heisenberg-effect", "title": "Measurement Overhead and the Probe Effect (Heisenberg)", "level": 2},
            {"id": "comparison-table", "title": "Sampling vs. Instrumentation Comparison Table", "level": 2},
        ],
        "body": """## Two Paradigms of Performance Data Collection

To extract performance data from a running parallel application, measurement frameworks deploy two fundamentally distinct methodologies:
1. **Statistical Sampling** (Periodic Probing)
2. **Software Instrumentation** (Explicit Probes)

<Diagram type="sampling-vs-instrumentation" caption="Statistical sampling (periodic timer ticks) vs software instrumentation (entry/exit probe hooks)." />

## 1. Statistical Sampling (PC Sampling)

**Sampling** measures an unmodified executable by periodically interrupting execution using asynchronous timer interrupts or hardware counter overflow signals:
- **Operating Mechanism**: An OS timer or hardware performance monitoring unit (PMU) triggers an interrupt every $X$ milliseconds or every $N$ instructions.
- The signal handler inspects the CPU's **Program Counter (PC)** and call stack register, recording which function was currently active.
- Over time, functions that spend more execution time will accumulate a proportionally larger count of sample ticks.
- *Examples*: Linux `perf`, `gprof`, Intel VTune Profiler.
- *Advantages*: Extremely low overhead ($1\\% - 3\\%$), completely non-invasive, requires no source code modification or special recompilation.
- *Disadvantages*: Misses brief, infrequent performance spikes; does not record exact function call counts or message transfer parameters.

## 2. Software Instrumentation (Probe Probing)

**Instrumentation** modifies the program binary or source code by inserting explicit measurement hooks (**probes**) at the exact boundaries of functions and communication routines:
- **Operating Mechanism**: Whenever execution hits a probe, the measurement library records a timestamped enter or exit event.
- *Examples*: **Score-P**, **TAU**, Scalasca.
- *Advantages*: Provides **100% exact call counts**, exact execution times for every function invocation, and captures exact MPI message tags, sizes, and ranks.
- *Disadvantages*: Incurs measurable measurement overhead; can distort application timing.

## Levels of Instrumentation

1. **Source Code Instrumentation**: A preprocessor parses the C/C++ source code and inserts API calls (e.g. `SCOREP_USER_REGION_ENTER()`).
2. **Compiler-Assisted Instrumentation**: The compiler automatically inserts probe hooks at function entry and exit points (e.g. GCC's `-finstrument-functions`).
3. **Wrapper / Library Interposition**: Intercepting shared library function calls using `LD_PRELOAD` or the standard MPI **PMPI** interface without recompiling user code.
4. **Binary Rewriting**: Directly inserting probe instructions into compiled machine-code binaries (e.g. Dyninst).

## Measurement Overhead and the Probe Effect (Heisenberg)

Every instrumentation probe consumes CPU cycles (reading clock timers, updating data structures):
- If a tiny helper function (e.g., a 2-line inline vector getter called 100 million times in a tight loop) is instrumented, the probe overhead can dwarf the function itself, causing a 500% execution slowdown!
- **The Probe Effect (Heisenberg Effect)**: The very act of observing and measuring the system perturbs its execution timing. An artificial delay introduced on one rank can mask or induce false race conditions and alter communication interleavings.
- **Remedy**: Performance engineers use **Score-P filter files** to suppress instrumentation on lightweight, high-frequency functions.

## Sampling vs. Instrumentation Comparison Table

| Feature | Statistical Sampling | Software Instrumentation |
| :--- | :--- | :--- |
| **Typical Tools** | Linux `perf`, `gprof`, Intel VTune | **Score-P**, **TAU**, Scalasca |
| **Source Recompilation** | Not required (operates on standard binary) | Required (or dynamic binary rewriting) |
| **Runtime Overhead** | Minimal ($1\\% - 3\\%$) | Variable ($2\\% - 20\\%+$ if unfiltered) |
| **Call Count Accuracy** | Statistical estimate (approximate) | **Exact call counts** |
| **Short Function Capture** | Misses functions executed between ticks | Captures every single invocation |
| **MPI Parameter Capture** | None | Captures message bytes, tags, communicators |
| **Primary Use Case** | Initial broad hotspot discovery | Deep profiling, tracing, and root-cause analysis |
"""
    },
    "06-profiling": {
        "title": "Profiling Types: Flat, Call-Graph, and Call-Path",
        "description": "Aggregated performance measurement, flat profiles, call-graph profiles, CUBE call-path trees, and exclusive vs inclusive metrics.",
        "order": 6,
        "readingTimeMinutes": 14,
        "sections": [
            {"id": "what-is-profiling", "title": "Definition of Profiling", "level": 2},
            {"id": "exclusive-vs-inclusive", "title": "Exclusive Time vs. Inclusive Time", "level": 2},
            {"id": "types-of-profiling", "title": "The Hierarchy of Profiling Types", "level": 2},
            {"id": "flat-profiling", "title": "1. Flat Profiling", "level": 2},
            {"id": "call-graph-profiling", "title": "2. Call-Graph Profiling", "level": 2},
            {"id": "call-path-profiling", "title": "3. Call-Path Profiling (CUBE Trees)", "level": 2},
            {"id": "hardware-counter-profiling", "title": "4. Hardware Counter Profiling (PAPI)", "level": 2},
        ],
        "body": """## Definition of Profiling

**Profiling** is an aggregated performance measurement technique that summarizes performance data across the **entire program run**:
- Rather than recording individual events chronologically over time, profiling accumulates summary metrics (total execution time, total calls, total cache misses, average duration) into compact statistical tables.
- **Key Advantage**: Minimal storage footprint. Whether an application runs for 5 seconds or 5 days, the output profile size remains constant and compact (kilobytes to megabytes).
- **Key Limitation**: Profiling discards temporal dynamics. It cannot tell you *when* during the execution a bottleneck occurred or how load balance fluctuated from iteration to iteration.

## Exclusive Time vs. Inclusive Time

A foundational distinction in profiling analysis:

1. **Inclusive Time ($T_{incl}$)**: The total elapsed wall-clock time spent inside a function $F$, **including** all the time spent executing child functions called by $F$.
   - For example, `main()` almost always has an inclusive time of nearly $100\\%$.

2. **Exclusive Time ($T_{excl}$)**: The time spent strictly executing code within the body of function $F$ itself, **excluding** all time spent inside any subroutines called by $F$:
   $$
   T_{excl}(F) = T_{incl}(F) - \\sum_{C \\in \\text{Callees}(F)} T_{incl}(C)
   $$

### Worked Example
Suppose function `solver()` runs for 100 seconds total. Inside `solver()`, it calls `matrix_multiply()` which takes 85 seconds, and `vector_norm()` which takes 10 seconds.
- `solver()` **Inclusive Time** $= 100$ seconds.
- `solver()` **Exclusive Time** $= 100 - (85 + 10) = 5$ seconds.
- **Diagnostic Rule**: When optimizing code, engineers prioritize functions with the highest **exclusive time**, because that is where the CPU is actually executing arithmetic instructions!

## The Hierarchy of Profiling Types

<Diagram type="profiling-types" caption="Flat profile summary table vs contextual call-path tree." />

## 1. Flat Profiling
- Outputs a flat list of functions sorted by total exclusive time.
- Gives a rapid, immediate answer to: *"Which single function consumed the most CPU time?"*
- *Weakness*: Provides zero contextual information. If `MPI_Send` is at the top of the list, a flat profile cannot reveal which mathematical routines invoked `MPI_Send`.

## 2. Call-Graph Profiling
- Associates performance metrics with caller-callee pairs (e.g. `gprof`).
- Shows who called whom and how many times, reporting total time spent along each call edge.
- *Weakness*: Merges multiple call chains together into an aggregated graph, losing distinct context for recursive or multi-path invocations.

## 3. Call-Path Profiling (CUBE Trees)
- Preserves the **complete calling stack hierarchy** for every measured function invocation:
  $$\\text{main()} \\to \\text{timestep()} \\to \\text{solve()} \\to \\text{MPI\\_Recv()}$$
- Implemented in advanced HPC frameworks such as **Score-P** and viewed in **CUBE**.
- Enables performance engineers to distinguish whether `MPI_Recv()` was slow when invoked by the boundary exchange kernel or when invoked by the file I/O routine!

## 4. Hardware Counter Profiling (PAPI)
- Uses the **Performance Application Programming Interface (PAPI)** to read on-chip CPU hardware event counters:
  - `PAPI_L1_DCM`, `PAPI_L2_DCM`, `PAPI_L3_TCM`: L1, L2, and L3 data cache misses.
  - `PAPI_TOT_CYC`, `PAPI_TOT_INS`: Total CPU clock cycles and instructions retired.
  - Enables computation of **IPC (Instructions Per Cycle)** and memory stall ratios.
"""
    },
    "07-tracing": {
        "title": "Tracing: Event Logs, OTF2 Format, and Timeline Analysis",
        "description": "Chronological performance tracing, Open Trace Format 2 (OTF2), Gantt timeline visualizations, and data volume challenges.",
        "order": 7,
        "readingTimeMinutes": 14,
        "sections": [
            {"id": "what-is-tracing", "title": "Definition of Tracing", "level": 2},
            {"id": "what-tracing-reveals", "title": "What Tracing Reveals That Profiling Misses", "level": 2},
            {"id": "otf2-format", "title": "The Open Trace Format 2 (OTF2)", "level": 2},
            {"id": "timeline-visualization", "title": "Timeline Visualizations (Vampir, Paraver)", "level": 2},
            {"id": "tracing-drawbacks", "title": "The Data Volume Drawback and Trace Filtering", "level": 2},
        ],
        "body": """## Definition of Tracing

**Tracing** is a performance measurement technique that preserves the **exact chronological sequence of timestamped events** across all processes and threads throughout the entire duration of an application run:
- Whenever an event occurs (e.g., entering a function, sending an MPI message, waiting at a lock), an event record is written into a memory buffer.
- When the run completes, these event streams are consolidated into a coordinated multi-process trace file.
- The output represents an exact historical recording of the execution timeline.

<Diagram type="timeline-tracing" caption="Multi-rank OTF2 trace timeline showing Rank 0 compute, message send, and Rank 1 idle wait state." />

## What Tracing Reveals That Profiling Misses

While profiling summarizes totals, tracing reveals the **causal dynamics over time**:
1. **Temporal Load Imbalance**: Profiling shows that rank 0 spent 50% time computing and rank 1 spent 50% time computing. Tracing reveals that during the first 10 minutes rank 0 did 90% of the work while rank 1 sat idle, and then the reverse occurred!
2. **Idle Wait States & Message Latencies**: Tracing displays the physical flight time of individual messages across the network.
3. **Causal Chain Attribution**: When a thread stalls at a barrier, tracing points directly to the late thread that caused the stall.
4. **Transient Performance Spikes**: Tracing isolates brief micro-bursts of network congestion or memory thrashing that get averaged out and hidden in a flat profile.

## The Open Trace Format 2 (OTF2)

In high-performance computing, the standard open format for trace files is **OTF2 (Open Trace Format 2)**:
- Developed jointly by TU Dresden, Jülich Supercomputing Centre, and the University of Oregon.
- **Scalable Architecture**: Each rank and thread writes to its own independent binary event stream into thread-local RAM buffers during execution, eliminating inter-process disk contention.
- Uses compact binary encoding and delta-timestamp compression to minimize disk footprint.
- Supported universally by Score-P, Scalasca, and Vampir.

## Timeline Visualizations (Vampir, Paraver)

Specialized GUI trace visualizers render OTF2 traces as interactive **Gantt timeline charts**:
- **Horizontal Axis**: Exact continuous wall-clock time (zoomable from seconds down to nanoseconds).
- **Vertical Axis**: Parallel processes and threads organized hierarchically.
- **Color Coding**: Function execution states (e.g. green for computation, red for MPI communication, yellow for idle wait).
- **Message Arrows**: Explicit directed lines drawn between ranks representing point-to-point transfers (`MPI_Send` $\\to$ `MPI_Recv`).

## The Data Volume Drawback and Trace Filtering

The paramount disadvantage of tracing is its **explosive data volume**:
- A program running 10,000 ranks for 1 hour can easily generate **terabytes** or petabytes of trace data if every minor function call is logged!
- Writing massive trace logs to disk can overwhelm parallel file systems (Lustre, GPFS) and distort application runtime (severe Heisenberg probe effect).

### Mitigation Strategies
1. **Trace Buffering**: Events are stored in thread-local RAM buffers and written to disk in bulk blocks only at natural program boundaries.
2. **Selective Filtering**: Developers configure a `scorep.filt` filter file before running, suppressing tracing on small, high-frequency utility routines.
3. **Phase-Specific Tracing**: Tracing is programmatically turned ON only during the core simulation loop (e.g. iteration 10 to 12) using `SCOREP_RECORDING_ON()` and `SCOREP_RECORDING_OFF()`.
"""
    },
    "08-profiling-vs-tracing-comparison": {
        "title": "Profiling vs. Tracing: Architectural Comparison",
        "description": "Comprehensive comparative analysis of profiling vs tracing across overhead, data size, scalability, and diagnostic capability.",
        "order": 8,
        "readingTimeMinutes": 10,
        "sections": [
            {"id": "master-comparison-table", "title": "Profiling vs. Tracing Master Comparison Table", "level": 2},
            {"id": "when-to-profile", "title": "When to Use Profiling", "level": 2},
            {"id": "when-to-trace", "title": "When to Use Tracing", "level": 2},
        ],
        "body": """## Profiling vs. Tracing Master Comparison Table

The following master comparison table summarizes the critical trade-offs between profiling and tracing:

| Evaluation Aspect | Profiling (Summary Aggregation) | Tracing (Chronological Event Log) |
| :--- | :--- | :--- |
| **Fundamental Output** | Aggregated statistical summary tables | Exact time-ordered log of every event |
| **Temporal Dynamic** | Discarded (time is integrated over the entire run) | **Preserved completely** (full timeline) |
| **Output File Size** | Compact: Kilobytes to Megabytes (constant) | **Enormous**: Gigabytes to Terabytes |
| **Execution Overhead** | Low to moderate ($1\\% - 5\\%$) | Moderate to high ($5\\% - 30\\%+$) |
| **Storage Scalability** | Excellent ($O(p \\times \\text{functions})$) | Poor ($O(p \\times \\text{events} \\times \\text{time})$) |
| **Hardware Counters** | Aggregates PAPI event totals per function | Correlates PAPI bursts to exact moments |
| **Wait-State Diagnosis** | Indicates wait time occurred, but not why | **Proves causality** (e.g. Late Sender) |
| **Message Flight Path** | None (only total bytes and calls recorded) | Displays message arrows between ranks |
| **Typical Tools** | gprof, perf, Score-P CUBE, mpiP, PAPI | Vampir, Scalasca, Paraver, Intel ITAC |

## When to Use Profiling

Use profiling during the **initial diagnostic phase**:
1. When running production workloads for long execution times (hours or days).
2. When surveying a massive codebase to answer: *"Where are the top 3 functions consuming 80% of our CPU time?"*
3. When memory or disk space is constrained on compute nodes.
4. When measuring aggregate hardware counter rates (e.g. Cache Misses per Instruction, IPC).

## When to Use Tracing

Use tracing during the **deep investigation phase**:
1. When profiling indicates high communication overhead in `MPI_Recv` or `MPI_Barrier`, but you need to prove *which specific rank* arrived late.
2. To diagnose dynamic temporal imbalances that fluctuate between iterations.
3. When verifying message communication topologies and identifying network contention bottlenecks.
4. For short, focused execution runs (e.g., running 2 to 3 representative simulation iterations with a Score-P filter applied).
"""
    },
    "09-tools": {
        "title": "HPC Performance Tool Suite: Score-P, Scalasca, PMPI, and Energy Analyzer",
        "description": "In-depth guide to Score-P, Scalasca wait-state analysis, distinguishing PMPI from mpiP, Energy Analyzer (EDP), and practical manual timing.",
        "order": 9,
        "readingTimeMinutes": 18,
        "sections": [
            {"id": "scorep-framework", "title": "Score-P: Unified Instrumentation Framework", "level": 2},
            {"id": "scalasca-analysis", "title": "Scalasca: Automatic Wait-State Analysis", "level": 2},
            {"id": "watch-out-pmpi-mpip", "title": "Watch Out: PMPI Interface vs. mpiP Tool", "level": 2},
            {"id": "energy-analyzer", "title": "Energy Analyzer and Energy-Delay Product (EDP)", "level": 2},
            {"id": "other-tools", "title": "Visualization Tools: Vampir, Paraver, Intel ITAC", "level": 2},
            {"id": "practical-timing", "title": "Practical Manual Timing with MPI_Wtime and omp_get_wtime", "level": 2},
        ],
        "body": """## Score-P: Unified Instrumentation Framework

**Score-P (Scalable Performance Measurement Infrastructure for Parallel Codes)** is the premier open-source measurement infrastructure used by modern HPC centers:
- Acts as a unified instrumentation front-end that simultaneously supports multiple back-end analysis tools: **Scalasca** (automatic analysis), **CUBE** (profile visualization), and **Vampir** (trace visualization).
- Supports MPI, OpenMP, OpenACC, CUDA, and hybrid programming models.

### Standard Score-P Workflow
1. **Instrument and Compile**: Prepend compiler commands with `scorep`:
   ```bash
   scorep mpicc -O3 -fopenmp simulation.c -o simulation
   ```
2. **Execute**: Run the binary normally across cluster ranks:
   ```bash
   mpirun -np 16 ./simulation
   ```
3. **Generated Artifacts**:
   - `profile.cubex`: Compact hierarchical call-path profile viewed with the CUBE visualizer.
   - `traces.otf2`: Complete OTF2 event trace directory (when `SCOREP_ENABLE_TRACING=true`).

## Scalasca: Automatic Wait-State Analysis

**Scalasca** is an automated performance analysis tool built directly on top of Score-P:
- Rather than requiring a human engineer to manually inspect billions of timeline events in a GUI, Scalasca automatically scans the OTF2 trace using parallel search algorithms to detect known **wait-state patterns**:
  1. **Late Sender**: A receiving process posts `MPI_Recv` early and sits idle waiting because the sending process is delayed in a preceding computation.
  2. **Late Receiver**: The sending process is blocked in synchronous `MPI_Ssend` waiting for the receiver to post a receive buffer.
  3. **Wait at Barrier**: Processes arrive at `MPI_Barrier` at different times and idle waiting for the slowest rank.

## Watch Out: PMPI Interface vs. mpiP Tool

<Callout type="warning" title="Watch Out: PMPI Interface vs. mpiP Tool">
A ubiquitous source of confusion in student exams is conflating **PMPI** with **mpiP**:
1. **PMPI (MPI Profiling Interface)**:
   - PMPI is a **standard architectural mechanism** defined within the official MPI specification.
   - Every standard MPI function (e.g. `MPI_Send`) is internally aliased to a weak symbol duplicate (`PMPI_Send`).
   - This allows any tool developer to write a custom wrapper library that intercepts `MPI_Send`, records timestamps, and then calls `PMPI_Send` under the hood without needing access to MPI library source code.
2. **mpiP (Lightweight Profiling Tool)**:
   - `mpiP` is a specific, standalone **software tool** that uses the PMPI interface.
   - It is a lightweight profiling library that outputs a simple text report showing call counts, message bytes, and percentage time spent in each MPI routine per rank.

**Exam Rule**: PMPI is the **API interface mechanism**; mpiP is a **specific profiling tool** that utilizes PMPI!
</Callout>

## Energy Analyzer and Energy-Delay Product (EDP)

Modern supercomputing is bounded by electrical power and cooling budgets (megawatts), making **energy efficiency** as vital as raw speed:
- **Power ($P$)**: Rate of energy consumption, measured in Watts ($1\\text{ W} = 1\\text{ J/s}$).
- **Energy ($E$)**: Total energy consumed over the duration of the job:
  $$
  E = \\int_0^T P(t) \\, dt = P_{\\text{avg}} \\times T \\quad \\text{(Joules or Kilowatt-hours)}
  $$
- **Energy-to-Solution**: The total Joules required to complete a fixed computational task.
- **Energy-Delay Product (EDP)**: A unified figure of merit that penalizes systems that save energy at the expense of excessive runtime:
  $$
  \\text{EDP} = \\text{Energy} \\times \\text{Runtime} = E \\times T
  $$
  A lower EDP signifies superior energy-efficient computational performance.

## Visualization Tools: Vampir, Paraver, Intel ITAC

- **Vampir (Visualization of Applied Micro-architectures on Parallel Computers)**: Commercial high-end interactive GUI for visualizing massive OTF2 traces as multi-rank Gantt charts.
- **Paraver**: Flexible open-source trace visualizer from BSC (Barcelona Supercomputing Center) based on flexible mathematical matrix filters.
- **Intel Trace Analyzer and Collector (ITAC)**: Intel's dedicated tracing and timeline analysis suite for MPI on Intel architectures.

## Practical Manual Timing with MPI_Wtime and omp_get_wtime

Before deploying heavy instrumentation suites, developers routinely benchmark code using built-in high-resolution timers:

```c
/* manual_timing.c - Complete compilable benchmark demonstration */
#include <stdio.h>
#include <stdlib.h>
#include <mpi.h>
#include <omp.h>

int main(int argc, char *argv[]) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    /* 1. Synchronize ranks to establish clean starting baseline */
    MPI_Barrier(MPI_COMM_WORLD);
    double t_start = MPI_Wtime();

    /* 2. Execute computational workload */
    long long sum = 0;
    #pragma omp parallel for reduction(+:sum)
    for (int i = 0; i < 10000000; i++) {
        sum += (i * (rank + 1)) % 7;
    }

    /* 3. Record elapsed time */
    double t_end = MPI_Wtime();
    double local_elapsed = t_end - t_start;

    /* 4. Reduce to find max execution time across all ranks */
    double max_elapsed;
    MPI_Reduce(&local_elapsed, &max_elapsed, 1, MPI_DOUBLE, MPI_MAX, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        printf("Benchmark Finished: Max Wall Time across %d ranks = %.6f seconds\\n",
               size, max_elapsed);
    }

    MPI_Finalize();
    return 0;
}
```

### Compile and Run Commands
```bash
mpicc -O3 -fopenmp manual_timing.c -o manual_timing
mpirun -np 4 ./manual_timing
```

### Expected Output
```text
Benchmark Finished: Max Wall Time across 4 ranks = 0.012480 seconds
```
"""
    },
    "10-diagnose-bottlenecks": {
        "title": "Worked Performance Diagnosis Exercises",
        "description": "Practical scenarios diagnosing real-world parallel bottlenecks from profiles and timelines with corrective remedies.",
        "order": 10,
        "readingTimeMinutes": 16,
        "sections": [
            {"id": "diagnostic-methodology", "title": "Diagnostic Framework: Profile to Root Cause", "level": 2},
            {"id": "case-1-late-sender", "title": "Case 1: Severe MPI_Recv Idle Time (Late Sender)", "level": 2},
            {"id": "case-2-barrier-stall", "title": "Case 2: Catastrophic MPI_Barrier Wait (Tail Rank)", "level": 2},
            {"id": "case-3-false-sharing", "title": "Case 3: OpenMP Parallel Degradation (False Sharing)", "level": 2},
            {"id": "case-4-lock-contention", "title": "Case 4: Severe OpenMP Critical Contention", "level": 2},
            {"id": "interactive-demo", "title": "Interactive Profiling vs Tracing Stepper", "level": 2},
        ],
        "body": """## Diagnostic Framework: Profile to Root Cause

When analyzing parallel performance data, follow a structured 3-step diagnostic flow:
1. **Identify the Symptom**: Which function or synchronization primitive has an anomalously high percentage of exclusive wall-clock time?
2. **Inspect Context and Timeline**: Does the slowdown occur across all ranks equally (systemic), or does one rank lag behind (imbalance)?
3. **Formulate Corrective Action**: Apply the targeted architectural or algorithmic fix.

## Case 1: Severe MPI_Recv Idle Time (Late Sender)

### Symptom Profile
In a 64-rank finite-difference stencil simulation, an aggregated flat profile reports:
- `compute_stencil()`: 45.2% exclusive time
- `MPI_Recv()`: **48.6% exclusive time**
- `MPI_Send()`: 4.1% exclusive time

### Timeline Trace Inspection
When opening the OTF2 trace in Vampir, the timeline reveals:
- Rank 0 processes a boundary corner with irregular grid refinement and spends 80ms computing.
- Ranks 1 through 63 process regular interior blocks and finish computing in only 30ms.
- Ranks 1 through 63 immediately call blocking `MPI_Recv()` and sit **idle for 50ms** waiting for Rank 0 to finish computing and post `MPI_Send()`.

### Diagnosis
**Late Sender Bottleneck** caused by computational domain load imbalance on Rank 0.

### Corrective Remedy
1. **Dynamic / Weighted Domain Decomposition**: Allocate fewer grid cells to Rank 0 to compensate for its irregular boundary arithmetic.
2. **Asynchronous Non-blocking Overlap**: Restructure code using `MPI_Irecv` and `MPI_Isend`, allowing interior nodes to compute their independent local inner cells while messages are in-flight.

## Case 2: Catastrophic MPI_Barrier Wait (Tail Rank)

### Symptom Profile
A parallel graph analytics job on 128 ranks scales well up to 16 ranks, but on 128 ranks speedup collapses:
- `MPI_Barrier()` accounts for **68.4% of total runtime**.

### Timeline Trace Inspection
The trace shows that at the end of each iteration, 127 ranks reach `MPI_Barrier()` within 1 millisecond of each other. However, Rank 42 takes 150 milliseconds longer because it encountered a high-degree graph hub node (straggler / tail rank).

### Diagnosis
**Wait at Barrier Imbalance** caused by power-law degree distribution in the graph data.

### Corrective Remedy
1. **Remove Unnecessary Barriers**: In MPI, explicit `MPI_Barrier()` calls are rarely required before collective operations, as collectives inherently synchronize data.
2. **Dynamic Work-Stealing**: Use a distributed task queue where idle ranks steal sub-graphs from overloaded ranks.

## Case 3: OpenMP Parallel Degradation (False Sharing)

### Symptom Profile
An OpenMP loop calculating a histogram runs on 8 cores. Instead of achieving an expected 6x to 7x speedup over the serial version, the 8-thread code runs **4x slower than sequential execution**:
- PAPI counters report an astronomical surge in **L1 Data Cache Invalidation Requests** (`PAPI_L1_DCA` and coherence invalidations).

### Code Inspection
```c
int count[8]; // Array of 8 thread-local counters
#pragma omp parallel num_threads(8)
{
    int tid = omp_get_thread_num();
    for (int i = tid; i < N; i += 8) {
        if (data[i] > threshold) count[tid]++; // BUG!
    }
}
```

### Diagnosis
**False Sharing**. The 8 integers in `count[8]` occupy $8 \\times 4 = 32 \\text{ bytes}$, which fits entirely inside a **single 64-byte L1 cache line**. Every time any thread increments `count[tid]`, the hardware MESI protocol invalidates the cache line across all other 7 cores, causing intense bus contention and pipeline stalls.

### Corrective Remedy
Accumulate into a thread-local scalar variable and write to memory only once at the end:
```c
#pragma omp parallel num_threads(8)
{
    int tid = omp_get_thread_num();
    int local_count = 0; // Stored in thread-private CPU register!
    for (int i = tid; i < N; i += 8) {
        if (data[i] > threshold) local_count++;
    }
    count[tid] = local_count;
}
```

## Case 4: Severe OpenMP Critical Contention

### Symptom Profile
An OpenMP parallel image filter shows CPU utilization at nearly 800% (8 cores active), but wall-clock runtime does not improve. Profiling indicates that threads spend 75% of their time stalled in `GOMP_critical_start`.

### Diagnosis
**Lock Serialization**. All 8 threads are contending for a single global `#pragma omp critical` block, forcing execution to become completely sequential.

### Corrective Remedy
1. Replace critical section with `#pragma omp atomic` if the operation is a single scalar update.
2. Use `#pragma omp parallel for reduction(+: sum)` to allow independent lock-free thread accumulation.

## Interactive Profiling vs Tracing Stepper

Inspect how a multi-rank load imbalance manifests differently in flat profiling vs timeline tracing:

<ProfilingTracingDemo />
"""
    }
}

out_dir = os.path.join(os.getcwd(), 'content/performance')
os.makedirs(out_dir, exist_ok=True)

for slug, data in topics.items():
    file_path = os.path.join(out_dir, f"{slug}.mdx")
    with open(file_path, "w") as f:
        f.write("---\n")
        f.write(f"id: {slug}\n")
        f.write(f"slug: {slug}\n")
        f.write(f"technology: performance\n")
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

print("All Part E MDX files generated successfully!")
