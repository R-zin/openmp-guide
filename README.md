# PARALLEL AND DISTRIBUTED COMPUTING // CSS 311 STUDY GUIDE

A comprehensive, deployable study-guide and examination revision portal for **PARALLEL AND DISTRIBUTED COMPUTING (Course Code: CSS 311)** covering distributed-memory programming (**MPI**), shared-memory programming (**OpenMP**), parallel architectures (**Interconnection Networks**, **Vector Processors**), and **Performance Analysis Tools**. Designed specifically for undergraduate computer science students preparing for laboratory exams and the end-semester theory exam.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **KaTeX** math typesetting, and **Shiki** monochrome syntax highlighting. Fully static (`output: 'export'`), responsive, keyboard-accessible, and deployable to GitHub Pages.

---

## Design System & Architecture

- **Strict Monochrome Minimalist Aesthetic:** Black (`#000000`) and pure white (`#FFFFFF`) with precision greys (`#F5F5F5`, `#E5E5E5`, `#737373`). Zero gradients, zero shadows, zero emojis, zero raster graphics.
- **Clean-Cut Geometry:** Sharp 90-degree corners (`border-radius: 0px` globally), 1px solid borders, strict 8px spacing grid, and visible geometric grid alignment.
- **Inverted Dark Mode:** Exact inversion toggle persisted in `localStorage`.
- **Inline Geometric SVGs:** All architectural diagrams, topologies (mesh, hypercube, torus, tree, k-ary d-cube), pipeline space-time charts, and timelines are rendered via inline SVGs with black strokes and white fills.
- **Print Stylesheet:** Built-in `@media print` rules allowing any topic, formula sheet, or mock exam to be cleanly printed or saved to PDF for offline revision.

---

## Course Curriculum & Content Structure

The portal is organized into 5 comprehensive parts containing **46 detailed topics**:

### 1. Part A: MPI (Distributed Memory Programming) — 10 Topics
1. **Basics & PCAM:** Shared vs Distributed memory, SPMD model, speedup, efficiency, Amdahl's and Gustafson's laws, Foster's PCAM methodology.
2. **MPI Foundations:** `MPI_Init`, `MPI_Comm_rank`, `MPI_Comm_size`, `MPI_Finalize`, compilation and run workflows, sequential token passing, barrier-ordered prints.
3. **Point-to-Point Communication:** Blocking semantics, `MPI_Send`, `MPI_Recv`, MPI Datatypes, tags, `MPI_Status`, wildcards, eager vs rendezvous buffering, `MPI_Sendrecv`, head-to-head deadlock prevention.
4. **Collective Communication:** Broadcast (`MPI_Bcast`), Scatter (`MPI_Scatter`), Gather (`MPI_Gather`), Allgather, All-to-all, Reductions (`MPI_Reduce`, `MPI_Allreduce`, `MPI_Scan`), and collective decision chooser table.
5. **Data Distributions:** 1D Block, Cyclic, and Block-Cyclic distributions; parallel vector addition, distributed I/O via `Read_vector`.
6. **Trapezoidal Numerical Integration:** Mathematical derivation, step size $h$, Send/Recv vs Reduce implementations, non-divisible $n$ handling, and the slide type bug fix (`double Trap` vs `int Trap`).
7. **Odd-Even Transposition Sort:** Parallel odd/even phases, neighbor partner calculation (`partner = rank ^ 1` vs `rank ± 1`), merge-low and merge-high subroutines, idle rank handling when `comm_sz` is odd.
8. **Matrix Multiplication & Cannon's Algorithm:** 1D Row-striped matrix-vector multiplication, 2D Torus process Cartesian topology (`MPI_Cart_create`), Cannon's algorithm preskew initial alignment, circular shifts, and communication cost formula $T_{\text{comm}} = 2(\sqrt{p}-1)(t_s + t_w \frac{n^2}{p})$.
9. **Parallel Graph Search:** Level-synchronous Breadth-First Search (BFS) and parallel Depth-First Search (DFS) on a 15-node binary tree baseline (IIITK Lab 10).
10. **Pitfalls & Debugging Checklist:** Type size mismatches, unbuffered deadlocks, wildcard non-determinism, missing collective participation, and defensive debugging best practices.

### 2. Part B: OpenMP (Shared Memory Programming) — 10 Topics
1. **Fork-Join Model & Threads:** POSIX threads vs OpenMP fork-join, team of threads, compilation with `-fopenmp`, `OMP_NUM_THREADS`, runtime querying.
2. **Directives & Scoping Clauses:** `#pragma omp parallel`, `private`, `firstprivate`, `lastprivate`, `shared`, `default(none)` enforcement, `num_threads`, and conditional `if` clauses.
3. **Work-Sharing & Schedules:** `#pragma omp for`, loop collapse (`collapse(2)`), schedule policies (`static`, `dynamic`, `guided`, `runtime`, `auto`), iteration-to-thread block mapping, `sections`, `single`, `master`, and `nowait`.
4. **Synchronization & Locks:** `#pragma omp critical`, `#pragma omp atomic`, `#pragma omp barrier`, `#pragma omp ordered`, OpenMP lock API (`omp_set_lock`, `omp_unset_lock`), and data race fixes.
5. **Reduction Operations:** `reduction(+:sum)`, `min`/`max` operators, numerical integration for $\pi$ ($4/(1+x^2)$) and Trapezoidal Rule.
6. **Runtime Library:** `omp_get_thread_num`, `omp_get_num_threads`, `omp_get_wtime`, `omp_set_num_threads`, `omp_in_parallel`.
7. **Task Parallelism:** `#pragma omp task`, `#pragma omp taskwait`, recursive Fibonacci, irregular graph/tree traversal, task vs loop trade-offs.
8. **Performance, False Sharing & Scaling:** CPU cache line invalidation (64-byte false sharing), padding mitigation, load balancing, Amdahl vs Gustafson scaling.
9. **Classic Algorithms in OpenMP:** Parallel vector addition, dense matrix multiplication with cache-friendly access, parallel odd-even transposition sort, parallel BFS queue traversal.
10. **Hybrid MPI + OpenMP & Comparison:** Cluster-of-multicores model (`MPI_THREAD_FUNNELED`, `MPI_THREAD_MULTIPLE`), hybrid code example, and comprehensive MPI vs OpenMP chooser comparison matrix.

### 3. Part C: Parallel Architecture I (Interconnection Networks) — 7 Topics
1. **Introduction to Interconnection Networks:** Static (direct) vs dynamic (indirect) networks; switches, switch degree (quadratic cost growth), links, network interfaces (I/O bus vs memory bus, cluster vs tightly coupled multicomputer).
2. **Graph-Theoretic Metrics:** Rigorous definitions and physical significance: Diameter (latency upper bound), Bisection Width (throughput bottleneck; scalable $\Omega(p)$), Node Degree (switch hardware complexity), Network Cost (total wire/link count).
3. **Topologies & Inline SVGs:** Completely Connected, Star, Linear Array, Ring, 2-D Mesh, 3-D Mesh, 2-D Torus, d-dimensional Mesh, Hypercube (0-D to 4-D recursive construction, Hamming distance routing), Complete Binary Tree, Fat Tree, Wraparound $k$-ary $d$-cube.
4. **Metrics Reference Tables:** Comprehensive formulas for static topologies (completely connected, star, tree, linear array, 2D mesh, 2D torus, hypercube, $k$-ary $d$-cube) and dynamic networks (crossbar, multistage Omega, dynamic tree).
5. **Dimension-Order Routing (E-Cube):** Bit-order XOR routing in hypercubes ($s \oplus d$), formal proof of deadlock freedom, hop count equals Hamming distance; step-by-step worked traces ($010 \to 111$ and $0110 \to 1011$).
6. **Graph Mapping & Embedding:** Definitions of Dilation, Congestion, and Expansion; ideal embedding ($1, 1, 1$); recursive generation of Binary Reflected Gray Code $G(i, x+1)$; embedding Linear Array, Ring, and 2D Wraparound Mesh into Hypercubes with dilation 1; proof of topological impossibility for embedding mesh into linear array without congestion.
7. **Worked & Practice Problems:** Complete mathematical derivations for 3-ary 3-cube ($p=27, D=3, d=6, B_w=18, |C|=81$), 8x8 mesh ($D=14, B_w=8, |C|=112$), 1024-node hypercube ($d=10, D=10, B_w=512, |C|=5120$), and 15+ exam-style quantitative problems.

### 4. Part D: Parallel Architecture II (Vector Processors) — 9 Topics
1. **History & Evolution:** Chronological roadmap from Cray-1, CDC Cyber 205, ILLIAC IV to Earth Simulator, Fujitsu A64FX (Fugaku), and NEC SX-Aurora TSUBASA.
2. **Why Vector Processing:** Deep pipeline stalls, instruction-level parallelism ceilings, cache locality breakdown on long vectors, memory bandwidth advantages, and energy efficiency.
3. **Pipelining Principles:** Pipeline segments, registers, clock cycle time, three-segment $A_i \cdot B_i + C_i$ pipeline walkthrough (9 cycles pipelined vs 21 non-pipelined), speedup derivation $S_k = \frac{n \cdot k}{k + n - 1}$, space-time diagrams for $k=4, n=6$.
4. **Pipeline Conflicts:** Structural / resource hazards, RAW / WAR / WAW data dependencies, branch hazards, forwarding, delayed branching.
5. **SIMD & Architectural Classifications:** Array processors (parallel in space) vs Vector processors (pipelined in time); Flynn's taxonomy context.
6. **Vector Processor Concepts:** Vector registers, Vector Length Register (VLEN), Maximum Vector Length (MVL), Vector Stride Register (VSTR), memory interleaving, strip-mining when $n > \text{MVL}$, pipelined inner products, $n^3$ multiply-adds.
7. **VMIPS Architectural Reference:** 8 vector registers (64 elements $\times$ 64 bits each = 512 bytes per register), read/write ports, pipelined functional units, vector load/store unit, scalar registers, instruction set reference table (`LV`, `SV`, `ADDV`, `SUBV`, `MULV`, `DIVV`, `ADDVS`, `S--V`).
8. **Performance Measures:** MIPS vs FLOPS, vector execution time ($T = \text{startup} + n$), convoy grouping, chaining (forwarding intermediate results), throughput, speedup calculations.
9. **Modern Practice & Auto-Vectorisation:** Translating vector principles to modern GCC (`-O3 -march=native -fopt-info-vec`), `#pragma omp simd`, and compilable 64-byte aligned C benchmarks.

### 5. Part E: Performance Tools & Bottleneck Analysis — 10 Topics
1. **Why Performance Tools:** Parallel scaling overheads, Amdahl's law serial bottlenecks, communication latency, synchronisation stalls, load imbalance.
2. **Performance Engineering Cycle:** The 4-phase optimization loop (Measure $\to$ Analyze $\to$ Optimize $\to$ Verify).
3. **Key Concepts & Scaling Laws:** Amdahl's Law (strong scaling), Gustafson's Law (weak scaling), Karp-Flatt Metric ($e = \frac{1/S - 1/p}{1 - 1/p}$), Energy-Delay Product ($\text{EDP} = E \cdot T = P \cdot T^2$).
4. **Event Model of Parallel Execution:** State changes, enter/exit events, communication events, collective phases, timestamps, and monotonic clocks (`MPI_Wtime`).
5. **Sampling vs Instrumentation:** Statistical timer/hardware interrupt sampling vs direct code/binary rewriting; trade-offs in overhead, perturbation, and accuracy.
6. **Profiling (Flat & Call-Path):** Aggregated time summaries, call-path trees, exclusive vs inclusive metrics, identification of hotspots.
7. **Tracing & OTF2:** Timeline event reconstruction, timestamped event streams, Open Trace Format 2 (OTF2), wait-state visualization, message line matching.
8. **Profiling vs Tracing Comparison:** Systematic chooser table comparing data volume, runtime overhead, timeline fidelity, and recommended tool selection.
9. **HPC Tool Ecosystem:** Score-P unified measurement infrastructure, Scalasca automatic wait-state pattern detection, mpiP lightweight MPI profiling, PMPI standard profiling wrapper interface, Energy Analyzer.
10. **Worked Bottleneck Diagnosis:** Step-by-step case studies diagnosing Late Sender, Straggler / Barrier stalls, OpenMP 64-byte False Sharing, and Critical Lock Contention from profiles and timelines.

---

## Solved Practice Questions, Mock Exams & Revision Tools

- **159+ Curated Solved Questions across 5 modules:**
  - MPI: 42 Questions (Conceptual, Traces, Find-the-Bug, Write-the-Program, Complexity)
  - OpenMP: 42 Questions (Conceptual, Traces, Race Conditions, Write-the-Program, Schedules)
  - Interconnection Networks: 25 Questions (Topologies, E-Cube Routing, Gray Code Embeddings)
  - Vector Processors: 25 Questions (VMIPS Assembly, Strip-Mining, Pipeline Timing, Speedup)
  - Performance Analysis: 25 Questions (Bottleneck Diagnosis, Scaling Laws, HPC Tools)
- **3 Complete Mock Examinations:**
  - **Mock Exam 1 (MPI Lab):** 50 Marks, 90 Mins (Token Ring, Trapezoidal Integration, Odd-Even Sort)
  - **Mock Exam 2 (OpenMP Lab):** 50 Marks, 90 Mins ($\pi$ Estimation, Twin Primes, Gaussian Elimination)
  - **Mock Exam 3 (End-Semester Theory Exam):** 50 Marks, 120 Mins (5 Comprehensive questions covering Networks, Vectors, and Performance with full marking rubrics)
- **High-Yield Printable Formula Sheet:** 1-page printable summary for Amdahl, Gustafson, Karp-Flatt, Network Topologies, Pipeline speedup, and Cannon algorithm.
- **123 Flashcards Deck:** Interactive revision deck covering definitions, directives, topologies, and traps with keyboard navigation.
- **Client-Side Global Search:** Fuzzy instant search over all 46 topics and practice pages via `/` or `Cmd+K`.

---

## Interactive Client-Side Simulators

1. **Topology Explorer:** Dynamic node metric calculator ($p$, diameter, bisection width, degree, links) and live SVG graph generator.
2. **Hypercube E-Cube Router:** Animated 3D/4D hypercube visualizer showing dimension-order XOR routing step-by-step.
3. **Gray Code & Graph Embedding Visualizer:** Demonstrates ring and 2D torus embedding into hypercubes with dilation = 1 and congestion = 1.
4. **Pipeline Space-Time Simulator:** Interactive clock-by-clock stepper and space-time matrix demonstrating $k+n-1$ cycles and speedup.
5. **Vector vs Scalar Strip-Mining Stepper:** Visual comparison of scalar loop execution against vector strip-mined loops with configurable MVL.
6. **Profiling vs Tracing Wait-State Stepper:** Interactive comparison showing how Late Sender bottlenecks appear in flat profiles vs OTF2 timelines.
7. **Cannon's Matrix Multiplication Stepper:** 2D process Torus grid visualizer showing initial preskew row/col shifts and multiply-accumulate phases.
8. **Odd-Even Transposition Sort Stepper:** 4-process step-by-step trace showing even/odd phases, idle ranks, and merge-low/high operations.
9. **Deadlock Simulator:** Visualizes eager protocol safety vs rendezvous protocol deadlocks in symmetrical `MPI_Send` calls.
10. **Ring & Ping-Pong Animator:** Visual token stepper illustrating point-to-point exchanges on 2-node ping-pong and 4-node circular rings.
11. **OpenMP Schedule Visualizer:** Dynamic grid visualizer comparing `static`, `dynamic`, and `guided` schedule policies.
12. **Race Condition & Synchronization Visualizer:** Demonstrates unsynchronized memory collisions vs `#pragma omp atomic`, `critical`, and `reduction`.
13. **Amdahl's Law Scaling Calculator:** Interactive SVG chart plotting speedup curves against parallel fractions ($P$) and processor counts ($N$).

---

## Rigorous Verification

Every code snippet and mathematical formula has undergone automated sandbox validation:

- **53 Standalone C Programs Compiled & Executed:** 100% passing across MPI, OpenMP, and Vector SIMD. Full execution logs recorded in [`VERIFIED.md`](./VERIFIED.md).
- **Mathematical Formula Test Suite (`scripts/verify_formulas.py`):** Automatically validates 3-ary 3-cube, 8x8 mesh, 1024 hypercube, E-cube XOR routing, Gray code generation, pipeline cycle counts ($k+n-1$), Amdahl/Gustafson/Karp-Flatt metrics, and EDP.
- **Lecture Slide Ambiguities Clarified:** All 8 critical slide ambiguities/typos (Trap signature, partner formula, 1D matrix decomp costs, binary tree diameter definitions, PMPI vs mpiP, VMIPS register capacity, vector width definitions) are explicitly flagged with `Watch Out` callouts.

---

## Local Development & Static Build

### Prerequisites
- Node.js 18+ (Node 20 recommended)
- OpenMPI (optional, for compiling C code locally: `brew install open-mpi`)
- LLVM Clang with OpenMP (optional, for running OpenMP code: `brew install llvm`)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build Static Export
```bash
npm run build
```
This generates the static HTML/CSS/JS export in the `/out` directory (66 static pages generated).

### 4. Serve Static Export Locally
```bash
npx serve out
```

To test sub-path hosting (matching GitHub Pages `https://<user>.github.io/<repo>/`):
```bash
NEXT_PUBLIC_BASE_PATH=/openmp_mpi npm run build
npx serve out
```

---

## Deploying to GitHub Pages

This repository includes `.github/workflows/deploy.yml` for automated zero-configuration deployment to GitHub Pages via GitHub Actions.

### Step-by-Step GitHub Setup

1. **Create a GitHub Repository:**
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. **Configure GitHub Pages Source:**
   - In your GitHub repository, navigate to **Settings** &rarr; **Pages**.
   - Under **Build and deployment** &rarr; **Source**, select **"GitHub Actions"**.
   - Do NOT select "Deploy from a branch".

3. **Automatic Deployment:**
   - On every push to `main`, the workflow in `.github/workflows/deploy.yml` will automatically:
     - Check out the repository.
     - Configure Node.js 20 with npm caching.
     - Detect the repository sub-path using `actions/configure-pages`.
     - Build the static export with `NEXT_PUBLIC_BASE_PATH` configured.
     - Upload and deploy the `/out` directory using `upload-pages-artifact` and `deploy-pages`.
   - The included `public/.nojekyll` file ensures that Next.js static asset directories (`_next`) are served correctly without Jekyll processing.

---

## License

MIT License. Designed for academic and examination preparation in Parallel and Distributed Computing (CSS 311).
