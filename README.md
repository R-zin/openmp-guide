# PARALLEL PROGRAMMING STUDY GUIDE // MPI & OpenMP

A complete, high-performance study-guide and laboratory examination revision portal covering distributed-memory programming (**MPI**) and shared-memory programming (**OpenMP**). Designed specifically for undergraduate computer science students preparing for lab assessments and viva examinations (based on the IIIT Kottayam CSS 311 Parallel Distributed Computing curriculum and Peter Pacheco's *An Introduction to Parallel Programming*).

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Shiki** syntax highlighting. Fully static, keyboard-accessible, and deployable to GitHub Pages.

---

## Design System & Architecture

- **Strict Monochrome Minimalist Aesthetic:** Black (`#000000`) and pure white (`#FFFFFF`) with precision greys (`#F5F5F5`, `#E5E5E5`, `#737373`). Zero gradients, zero shadows, zero emojis, zero raster graphics.
- **Clean-Cut Geometry:** Sharp 90-degree corners (`border-radius: 0px` globally), 1px solid borders, strict 8px spacing grid, and visible geometric grid alignment.
- **Inverted Dark Mode:** Exact inversion toggle persisted in `localStorage`.
- **Inline Geometric SVGs:** All architectural diagrams, memory topologies, and process lattices are rendered via inline SVGs with black strokes and white fills.
- **Print Stylesheet:** Built-in `@media print` rules allowing any topic or mock exam to be cleanly printed or saved to PDF for offline laboratory revision.

---

## Content Structure

### 1. Part A: MPI (Distributed Memory)
1. **Basics & Amdahl's Law:** Shared vs Distributed memory, SPMD model, speedup, efficiency, Amdahl's and Gustafson's laws, Foster's PCAM methodology.
2. **MPI Foundations:** `MPI_Init`, `MPI_Comm_rank`, `MPI_Comm_size`, `MPI_Finalize`, compilation and run workflows, sequential token passing, barrier-ordered prints.
3. **Point-to-Point Communication:** Blocking semantics, `MPI_Send`, `MPI_Recv`, MPI Datatypes, tags, `MPI_Status`, wildcards, eager vs rendezvous buffering, `MPI_Sendrecv`, head-to-head deadlock prevention.
4. **Collective Communication:** Broadcast (`MPI_Bcast`), Scatter (`MPI_Scatter`), Gather (`MPI_Gather`), Allgather, All-to-all, Reductions (`MPI_Reduce`, `MPI_Allreduce`, `MPI_Scan`), and collective decision chooser table.
5. **Data Distributions:** 1D Block, Cyclic, and Block-Cyclic distributions; parallel vector addition, distributed I/O via `Read_vector`.
6. **Trapezoidal Numerical Integration:** Mathematical derivation, step size $h$, Send/Recv vs Reduce implementations, non-divisible $n$ handling, and the slide type bug fix (`double Trap` vs `int Trap`).
7. **Odd-Even Transposition Sort:** Parallel odd/even phases, neighbor partner calculation (`partner = rank ^ 1` vs `rank ± 1`), merge-low and merge-high subroutines, idle rank handling when `comm_sz` is odd.
8. **Matrix Multiplication & Cannon's Algorithm:** 1D Row-striped matrix-vector multiplication, 2D Torus process Cartesian topology (`MPI_Cart_create`), Cannon's algorithm preskew initial alignment, circular shifts, and communication cost formula $T_{\text{comm}} = 2(\sqrt{p}-1)(t_s + t_w \frac{n^2}{p})$.
9. **Parallel Graph Search:** Level-synchronous Breadth-First Search (BFS) and parallel Depth-First Search (DFS) on a 15-node binary tree baseline (IIITK Lab 10).
10. **Pitfalls & Debugging Checklist:** Type size mismatches, unbuffered deadlocks, wildcard non-determinism, missing collective participation, and defensive debugging best practices.

### 2. Part B: OpenMP (Shared Memory)
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

### 3. Part C: Solved Examination Questions & Mocks
- **84+ Curated Problems (42 MPI + 42 OpenMP):**
  - **Conceptual Short Answers:** Exact API rules, buffering invariants, memory topologies.
  - **Output Predictions:** Interleaving execution traces, token sequences, schedule mapping.
  - **Find-the-Bug:** Common student and slide errors with line-by-line solutions.
  - **Write-the-Program:** Complete, compilable programs with compile/run commands and expected outputs.
  - **Complexity & Cost Analysis:** Step-by-step mathematical derivations.
- **Two Complete Mock Lab Examinations (50 Marks, 90 Minutes each):**
  - **Mock Exam 1 (MPI):** Task 1: Circular Token Ring (15 M); Task 2: Trapezoidal Integration (15 M); Task 3: Odd-Even Transposition Sort (20 M).
  - **Mock Exam 2 (OpenMP):** Task 1: Numerical $\pi$ Estimation with False Sharing Elimination (15 M); Task 2: Twin Primes Counter & Sum (15 M); Task 3: Gaussian Elimination Row Pivoting (20 M).
  - Each task features problem descriptions, input/output specifications, sample outputs, detailed grading rubrics, and collapsible verified reference solutions.

---

## Interactive Client-Side Simulators

1. **Hello World Rank/Thread Simulator:** Interactive slider (1–16 processes/threads) simulating non-deterministic interleaving with barrier synchronization toggle.
2. **Ring & Ping-Pong Animator:** Visual token stepper illustrating point-to-point exchanges on 2-node ping-pong and 4-node circular rings.
3. **Deadlock Simulator:** Visualizes eager protocol safety vs rendezvous protocol deadlocks in symmetrical `MPI_Send` calls, alongside the `MPI_Sendrecv` fix.
4. **Odd-Even Transposition Sort Stepper:** 4-process step-by-step trace showing even phases, odd phases with idle ranks, and merge-low/merge-high memory operations on 16 keys.
5. **Cannon's Matrix Multiplication Stepper:** 2D process Torus grid visualizer showing initial preskew row/col shifts, multiply-accumulate phases, and circular step shifts.
6. **OpenMP Schedule Visualizer:** Dynamic grid visualizer comparing `static`, `dynamic`, and `guided` schedule policies across 4 threads with adjustable chunk sizes.
7. **Race Condition & Synchronization Visualizer:** Demonstrates unsynchronized memory collisions vs `#pragma omp atomic`, `critical`, and `reduction` protection.
8. **Amdahl's Law Scaling Calculator:** Interactive SVG chart plotting speedup curves against parallel fractions ($P$) and processor counts ($N$), with Gustafson weak-scaling comparison.
9. **Interactive Flashcards Deck (65 Cards):** Rapid revision deck with category filters, shuffle, and full keyboard navigation (`Space`/`Enter` to flip, `Arrow` keys to navigate).
10. **Client-Side Fuzzy Search:** Fast dialog search indexed over all 25 topics, accessible globally with `/` or `Cmd+K`.
11. **Progress Tracker:** LocalStorage-persisted checkbox on every topic with progress bars on the homepage and header.

---

## Code Quality & Sandbox Verification

Every standalone C program in this study guide has been compiled and executed in an automated test sandbox using OpenMPI and LLVM Clang with OpenMP support.

- **Total Verified Programs:** 52 standalone C programs
- **Verification Result:** **52 / 52 Passed (100% Success)**
- Full verification logs, compilation commands, and observed program outputs are recorded in [`VERIFIED.md`](./VERIFIED.md).

---

## Local Development & Build

### Prerequisites
- Node.js 18+ (Node 20 recommended)
- OpenMPI (optional, for running C code locally: `brew install open-mpi`)
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
This generates the static HTML/CSS/JS export in the `/out` directory.

### 4. Serve Static Export Locally
```bash
npx serve out
```

To test with a sub-path (matching GitHub Pages `https://<user>.github.io/<repo>/`):
```bash
NEXT_PUBLIC_BASE_PATH=/openmp_mpi npm run build
npx serve out
```

---

## Deploying to GitHub Pages

This repository is configured for automated, zero-configuration deployment to GitHub Pages via GitHub Actions.

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
   - On every push to `main` (or `master`), the workflow in `.github/workflows/deploy.yml` will automatically:
     - Check out the code.
     - Detect the repository sub-path using `actions/configure-pages`.
     - Build the static export with `NEXT_PUBLIC_BASE_PATH` configured.
     - Upload and deploy the `/out` directory to `https://<your-username>.github.io/<your-repo-name>/`.
   - The included `public/.nojekyll` file ensures that Next.js static asset directories (`_next`) are served correctly by GitHub Pages.

---

## License

MIT License. Designed for academic and educational preparation.
