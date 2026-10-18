#!/usr/bin/env python3
"""
Expand content/flashcards.json to 140 cards across all five parts:
MPI, OpenMP, Interconnection Networks, Vector Processors, and Performance Tools.
"""

import json

with open('content/flashcards.json') as f:
    cards = json.load(f)

print(f"Original flashcard count: {len(cards)}")

extra_cards = [
    # --- NETWORKS (Part C) ---
    {
        "id": "fc-net-01",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What is the network diameter?",
        "back": "The maximum shortest-path distance (in number of links) between any pair of nodes in the network graph: D = max_{u,v} dist(u, v). It bounds worst-case point-to-point latency."
    },
    {
        "id": "fc-net-02",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What is bisection width, and what is the scalability condition?",
        "back": "The minimum number of communication links that must be cut to partition the network into two equal halves of p/2 nodes each. A network is bandwidth-scalable if B_w = Omega(p)."
    },
    {
        "id": "fc-net-03",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What are the metrics for a d-dimensional hypercube (p = 2^d)?",
        "back": "Diameter D = d = log2(p), Degree d = log2(p), Bisection width B_w = p / 2, Total links |C| = (p * log2(p)) / 2."
    },
    {
        "id": "fc-net-04",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What are the metrics for a 2-D mesh without wraparound (s x s, s = sqrt(p))?",
        "back": "Diameter D = 2(sqrt(p) - 1), Bisection width B_w = sqrt(p), Node degrees: Interior 4, Edge 3, Corner 2, Total links |C| = 2(p - sqrt(p))."
    },
    {
        "id": "fc-net-05",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What are the metrics for a 2-D torus (wraparound mesh)?",
        "back": "Diameter D = 2 * floor(sqrt(p)/2), Bisection width B_w = 2 * sqrt(p), Node degree d = 4 (regular), Total links |C| = 2p."
    },
    {
        "id": "fc-net-06",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What are the metrics for a wraparound k-ary d-cube (p = k^d)?",
        "back": "Diameter D = d * floor(k/2), Bisection width B_w = 2 * k^(d-1), Node degree d_node = 2d, Total links |C| = d * p."
    },
    {
        "id": "fc-net-07",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "How does E-cube routing route a message in a hypercube?",
        "back": "Computes R = S XOR D. Traverses dimensions in strictly increasing order (0, 1, ..., d-1), flipping differing bits. Total hops equals Hamming distance H(S, D)."
    },
    {
        "id": "fc-net-08",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "Why is E-cube routing guaranteed to be deadlock-free?",
        "back": "Because channels are acquired in strictly increasing dimension order, the channel dependency graph is a Directed Acyclic Graph (DAG), preventing circular wait."
    },
    {
        "id": "fc-net-09",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "Define Dilation, Congestion, and Expansion in graph embedding.",
        "back": "Dilation = maximum host hops per guest edge; Congestion = maximum guest edges sharing any host link; Expansion = host node count / guest node count. Ideal = 1, 1, 1."
    },
    {
        "id": "fc-net-10",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "How is a ring or linear array embedded into a hypercube with dilation 1?",
        "back": "By mapping ring index i to hypercube node G(i, d) using the Binary Reflected Gray Code. Consecutive Gray codes differ by exactly 1 bit (Hamming distance 1)."
    },
    {
        "id": "fc-net-11",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "How is a 2^r x 2^s mesh embedded into a hypercube?",
        "back": "By concatenating Gray codes: phi(r, c) = G(r, r_dim) || G(c, c_dim). Achieves Dilation = 1, Congestion = 1, Expansion = 1."
    },
    {
        "id": "fc-net-12",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "Why can a 2D mesh not map to a linear array without congestion?",
        "back": "A sqrt(p) x sqrt(p) mesh has bisection width sqrt(p), while a linear array has bisection width 1. By the Pigeonhole Principle, congestion >= sqrt(p) / 1 = sqrt(p)."
    },
    {
        "id": "fc-net-13",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What are the metrics for a completely connected network of p nodes?",
        "back": "Diameter D = 1, Bisection width B_w = p^2 / 4, Node degree d = p - 1, Total links |C| = p(p-1)/2 = O(p^2)."
    },
    {
        "id": "fc-net-14",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What are the metrics for a dynamic crossbar switch connecting p processors to p memories?",
        "back": "Diameter D = 1 (single-stage non-blocking), Bisection width B_w = p, Hardware cost = p^2 internal crosspoint switches."
    },
    {
        "id": "fc-net-15",
        "technology": "networks",
        "category": "Interconnection Networks",
        "front": "What are the metrics for an Omega network connecting p inputs to p outputs?",
        "back": "Stages = log2(p), Switches per stage = p/2, Total 2x2 switches = (p/2)*log2(p), Diameter D = log2(p), Bisection width = p/2."
    },

    # --- VECTOR PROCESSORS (Part D) ---
    {
        "id": "fc-vec-01",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "What are the vector register capacity specifications of the Cray-1 and VMIPS?",
        "back": "8 vector registers (V0 to V7). Each register holds 64 elements, and each element is 64 bits wide (IEEE 754 double precision), giving 512 bytes per register."
    },
    {
        "id": "fc-vec-02",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "What is the formula for execution time of n tasks on a k-segment pipeline?",
        "back": "T_p = k + n - 1 clock cycles. The first task takes k cycles to fill the pipeline, then each subsequent task completes in 1 cycle."
    },
    {
        "id": "fc-vec-03",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "What is the speedup formula for a k-segment pipeline with n tasks?",
        "back": "S_k = (n * k) / (k + n - 1). As n -> infinity, S_k approaches k (the number of stages)."
    },
    {
        "id": "fc-vec-04",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "What are the three major pipeline conflicts (hazards)?",
        "back": "1. Resource/Structural conflicts (hardware port sharing); 2. Data dependencies (RAW, WAR, WAW); 3. Branch difficulties (control hazards from loops/branches)."
    },
    {
        "id": "fc-vec-05",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "Contrast Array Processors vs Vector Processors within SIMD.",
        "back": "Array processors exploit parallelism in SPACE (replicated parallel ALUs executing simultaneously). Vector processors exploit parallelism in TIME (pipelined ALU streaming elements across cycles)."
    },
    {
        "id": "fc-vec-06",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "What are MVL and VLEN in vector architectures?",
        "back": "MVL (Maximum Vector Length) is the fixed physical hardware limit (e.g. 64). VLEN is the active software control register specifying how many elements to process (0 <= VLEN <= MVL)."
    },
    {
        "id": "fc-vec-07",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "How does strip-mining work when vector length n > MVL?",
        "back": "Loop is divided into passes of size <= MVL. The first pass handles the remainder n % MVL, and all subsequent passes process exactly MVL elements. Total passes = ceil(n / MVL)."
    },
    {
        "id": "fc-vec-08",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "When do memory bank conflicts occur in interleaved memory?",
        "back": "When a strided vector access hits the same memory bank before its busy recovery cycle t_cycle has elapsed, which happens whenever gcd(stride, M) > 1."
    },
    {
        "id": "fc-vec-09",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "How does vector execution eliminate loop branch overhead?",
        "back": "A single vector instruction (e.g. ADDV) processes up to 64 elements with 1 fetch and 1 decode, replacing 64 separate scalar branch and test instructions."
    },
    {
        "id": "fc-vec-10",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "What is vector chaining?",
        "back": "Routing the output of one vector functional unit directly into the input of a second unit as each element emerges, allowing dependent operations to execute concurrently."
    },
    {
        "id": "fc-vec-11",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "What is the purpose of the VMASK register?",
        "back": "Enables conditional execution (if-else) without branching. Hardware only writes back results for elements where VMASK[i] == 1, preserving other elements."
    },
    {
        "id": "fc-vec-12",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "Why is MIPS meaningless for vector machines? What metric is used instead?",
        "back": "One vector instruction executes 64 operations (reporting low MIPS despite high speed). FLOPS (Floating-Point Operations Per Second) is used instead."
    },
    {
        "id": "fc-vec-13",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "What are vector gather (LVI) and scatter (SVI) instructions?",
        "back": "Gather loads non-contiguous elements using an index vector: Vd[i] = Mem[Ra + Vindex[i]]. Scatter writes vector elements to indexed memory locations. Essential for sparse matrices."
    },
    {
        "id": "fc-vec-14",
        "technology": "vectors",
        "category": "Vector Processors",
        "front": "How do you tell GCC to output vectorization diagnostic reports?",
        "back": "Compile with flags: gcc -O3 -march=native -fopt-info-vec. Use #pragma omp simd to force vectorization."
    },

    # --- PERFORMANCE TOOLS (Part E) ---
    {
        "id": "fc-perf-01",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "What are the four phases of the HPC performance engineering cycle?",
        "back": "1. Measure (collect profiles/traces); 2. Analyse (locate bottlenecks); 3. Optimise (refactor code); 4. Verify (check correctness and speedup)."
    },
    {
        "id": "fc-perf-02",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "State Amdahl's Law and its asymptotic limit as N -> infinity.",
        "back": "S(N) = 1 / [s + (1 - s)/N], where s is the serial fraction. As N -> infinity, S(infinity) = 1 / s. Models strong scaling (fixed problem size)."
    },
    {
        "id": "fc-perf-03",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "State Gustafson's Law and what it models.",
        "back": "S(N) = N - s(N - 1) = s + (1 - s)N. Models weak scaling, where problem size grows proportionally with processor count to maintain constant time."
    },
    {
        "id": "fc-perf-04",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "What is the Karp-Flatt metric and how does it diagnose bottlenecks?",
        "back": "e = (1/S - 1/p) / (1 - 1/p). If e is constant as p grows, bottleneck is inherent serial code; if e increases with p, bottleneck is parallel communication/synchronization overhead."
    },
    {
        "id": "fc-perf-05",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "Contrast statistical sampling vs software instrumentation.",
        "back": "Sampling has low overhead (1-3%) and needs no recompilation but estimates counts statistically. Instrumentation records exact call counts and parameters but adds probe overhead."
    },
    {
        "id": "fc-perf-06",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "What is the Heisenberg (probe) effect in performance measurement?",
        "back": "The act of inserting measurement probes delays execution, perturbing execution timing and potentially creating or masking false race conditions or wait states."
    },
    {
        "id": "fc-perf-07",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "Define Exclusive Time vs Inclusive Time in profiling.",
        "back": "Inclusive time includes time spent in all child subroutines. Exclusive time includes only code within the function itself. Optimizers prioritize high exclusive time."
    },
    {
        "id": "fc-perf-08",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "Contrast Profiling vs Tracing in terms of temporal dynamics and storage size.",
        "back": "Profiling aggregates metrics into compact, constant-size summaries (KB-MB) but discards time. Tracing records timestamped logs of every event (GB-TB), preserving timeline causality."
    },
    {
        "id": "fc-perf-09",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "What is OTF2?",
        "back": "Open Trace Format 2: The standard high-performance binary trace format generated by Score-P and consumed by Scalasca and Vampir."
    },
    {
        "id": "fc-perf-10",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "What is Scalasca, and what wait-states does it analyze?",
        "back": "An automatic trace analysis tool that scans OTF2 traces for synchronization patterns such as Late Sender, Late Receiver, and Wait at Barrier."
    },
    {
        "id": "fc-perf-11",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "What is the difference between PMPI and mpiP?",
        "back": "PMPI is the standardized profiling interface mechanism built into MPI. mpiP is a specific lightweight profiling software library that uses PMPI."
    },
    {
        "id": "fc-perf-12",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "What is the Energy-Delay Product (EDP)?",
        "back": "EDP = Energy * Runtime = E * T (Joules * seconds). A unified figure of merit that penalizes energy savings achieved at the expense of slow runtime. Lower is better."
    },
    {
        "id": "fc-perf-13",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "What causes False Sharing in OpenMP and how is it resolved?",
        "back": "Multiple threads write to independent variables located on the same 64-byte cache line, causing constant cache invalidations. Fix: accumulate into thread-local variables in CPU registers."
    },
    {
        "id": "fc-perf-14",
        "technology": "performance",
        "category": "Performance Tools",
        "front": "How do you calculate parallel efficiency E(p)?",
        "back": "E(p) = S(p) / p = T_s / (p * T_p). Measures the fraction of time processors spend in useful computation vs overhead."
    }
]

cards.extend(extra_cards)

with open('content/flashcards.json', 'w') as f:
    json.dump(cards, f, indent=2)

print(f"Updated flashcard count: {len(cards)} cards total.")
