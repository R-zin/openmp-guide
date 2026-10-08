import os

# --- 06: Runtime Library ---
omp_06 = """---
id: omp-06-runtime-library
title: OpenMP Runtime Library Functions
slug: 06-runtime-library
technology: openmp
order: 6
description: Complete reference to OpenMP runtime library functions (<omp.h>), querying threads, setting concurrency, timing benchmarks, dynamic thread adjustment, and nested execution.
readingTimeMinutes: 14
sections:
  - id: core-queries
    title: Core Query and Mutator Functions
    level: 2
  - id: timing-functions
    title: High-Precision Wall Clock Benchmarking
    level: 2
  - id: dynamic-nested
    title: Dynamic Threads and Nested Parallelism
    level: 2
  - id: complete-code
    title: Runtime Diagnostics & Verification Program
    level: 2
---

## Core Query and Mutator Functions

The OpenMP runtime library is accessed by including `<omp.h>`.

### 1. `omp_get_thread_num`
Returns the unique ID of the calling thread within the current team:
```c
int omp_get_thread_num(void);
```
- Thread IDs range from $0$ to $\\text{num\\_threads} - 1$.
- Thread $0$ is the master thread. Outside a parallel region, returns $0$.

### 2. `omp_get_num_threads`
Returns the total number of threads in the current executing team:
```c
int omp_get_num_threads(void);
```
- Outside a parallel construct, returns $1$.

### 3. `omp_set_num_threads`
Dynamically sets the number of threads to be used for subsequent parallel regions:
```c
void omp_set_num_threads(int num_threads);
```
- Must be called from a sequential context outside an active parallel region.

### 4. `omp_get_max_threads`
Returns the maximum number of threads that would be allocated for a parallel region without an explicit `num_threads` clause:
```c
int omp_get_max_threads(void);
```

### 5. `omp_get_num_procs`
Returns the total number of physical hardware processor cores available on the system:
```c
int omp_get_num_procs(void);
```

---

## High-Precision Wall Clock Benchmarking

### 1. `omp_get_wtime`
Returns a double-precision floating-point value representing elapsed wall-clock time in seconds from an arbitrary epoch:
```c
double omp_get_wtime(void);
```
```c
double start = omp_get_wtime();
/* Computation */
double elapsed = omp_get_wtime() - start;
```

### 2. `omp_get_wtick`
Returns the resolution (clock tick interval) of `omp_get_wtime` in seconds:
```c
double resolution = omp_get_wtick();
```

---

## Complete Runtime Diagnostics Program

```c
#include <stdio.h>
#include <omp.h>

int main() {
    printf("--- OpenMP Environment Diagnostics ---\\n");
    printf("Physical CPU Cores Detected: %d\\n", omp_get_num_procs());
    printf("Default Max Threads: %d\\n", omp_get_max_threads());
    printf("Timer Tick Resolution: %.9f seconds\\n", omp_get_wtick());

    /* Dynamically configure thread team size */
    omp_set_num_threads(4);

    #pragma omp parallel
    {
        #pragma omp single
        printf("Parallel Region Active! Team Size: %d\\n", omp_get_num_threads());

        printf("Thread %d executing on core\\n", omp_get_thread_num());
    }

    return 0;
}
```
- **Compile:** `clang -fopenmp -O2 runtime_demo.c -o runtime_demo`
- **Run:** `./runtime_demo`
"""

# --- 07: Tasks ---
omp_07 = """---
id: omp-07-tasks
title: OpenMP Tasking Model (Asynchronous Tasks)
slug: 07-tasks
technology: openmp
order: 7
description: Exploring dynamic task parallelism with #pragma omp task, taskwait, taskgroup, recursive Fibonacci, parallel tree traversal, and when tasks beat loops.
readingTimeMinutes: 16
sections:
  - id: task-concept
    title: The Tasking Abstraction
    level: 2
  - id: task-syntax
    title: Task Directives: task and taskwait
    level: 2
  - id: fibonacci
    title: Parallel Recursive Fibonacci Implementation
    level: 2
  - id: tree-traversal
    title: Parallel Tree Traversal
    level: 2
  - id: when-tasks-beat-loops
    title: When Tasks Beat Loop Parallelism
    level: 2
---

## The Tasking Abstraction

Introduced in OpenMP 3.0, the **Tasking Model** removes the restriction that parallel work must be structured as canonical for-loops with predetermined trip counts.

A **Task** is an independent unit of computation that consists of:
- Executable code block.
- Associated data environment (captured variables: `firstprivate`, `shared`).
- Internal control variables.

When a thread encounters `#pragma omp task`, it packages the block into a task packet and deposits it into the runtime's **work queue**. Any idle worker thread can asynchronously pop and execute the task!

---

## Task Directives: task and taskwait

### 1. `#pragma omp task`
Defines an asynchronous task.
```c
#pragma omp task [clause ...]
{
    /* Task payload */
}
```
- By default, variables in tasks are `firstprivate` unless declared `shared`.

### 2. `#pragma omp taskwait`
Suspends execution of the current thread until all immediate child tasks spawned by the current task have completed:
```c
#pragma omp taskwait
```

<Callout type="note" title="THE SINGLE DIRECTIVE PATTERN">
Task generation loops must almost always be enclosed in `#pragma omp single`! Otherwise, every thread in the parallel team would duplicate task creation, leading to $P \\times$ redundant work.
</Callout>

---

## Parallel Recursive Fibonacci Implementation

```c
#include <stdio.h>
#include <omp.h>

int fib_serial(int n) {
    if (n < 2) return n;
    return fib_serial(n - 1) + fib_serial(n - 2);
}

int fib_parallel(int n) {
    int x, y;
    if (n < 2) return n;

    /* Task Cutoff: Below n=20, execute serially to avoid task creation overhead */
    if (n < 20) return fib_serial(n);

    #pragma omp task shared(x)
    x = fib_parallel(n - 1);

    #pragma omp task shared(y)
    y = fib_parallel(n - 2);

    #pragma omp taskwait
    return x + y;
}

int main() {
    int n = 30;
    int result = 0;

    #pragma omp parallel num_threads(4)
    {
        #pragma omp single
        result = fib_parallel(n);
    }

    printf("Fibonacci(%d) = %d\\n", n, result);
    return 0;
}
```
- **Compile:** `clang -fopenmp -O2 fib_tasks.c -o fib_tasks`
- **Run:** `./fib_tasks`
- **Expected Output:** `Fibonacci(30) = 832040`

---

## When Tasks Beat Loop Parallelism

OpenMP Tasks outperform worksharing loops in four critical scenarios:

1. **Recursive Divide-and-Conquer:** Algorithms like QuickSort, MergeSort, and Barnes-Hut N-body simulation where tree depth is dynamic.
2. **Unbounded Linked Data Structures:** Traversing linked lists, binary trees, or pointers where total node count is unknown prior to traversal.
3. **Pipelined Workflows:** Asynchronous producer-consumer pipelines where tasks produce downstream jobs.
4. **Graph Searching:** Irregular branch-and-bound searches where branches are dynamically pruned.
"""

# --- 08: Performance ---
omp_08 = """---
id: omp-08-performance
title: OpenMP Performance, False Sharing & Scaling
slug: 08-performance
technology: openmp
order: 8
description: Hardware cache hierarchy, false sharing detection and remedies, load balancing, scheduling overheads, speedup measurements, and Amdahl vs Gustafson laws.
readingTimeMinutes: 16
sections:
  - id: false-sharing-deep
    title: Deep Dive: False Sharing in Multi-Core CPUs
    level: 2
  - id: padding-and-privatization
    title: Eliminating False Sharing via Cache Padding
    level: 2
  - id: overhead-breakdown
    title: Parallel Overhead Breakdown
    level: 2
  - id: scaling-analysis
    title: Strong Scaling vs Weak Scaling Analysis
    level: 2
---

## Deep Dive: False Sharing in Multi-Core CPUs

In modern symmetric multiprocessing (SMP) systems, CPU cores do not read individual 4-byte integers directly from main memory. They transfer memory in **Cache Lines** (typically $64$ bytes = 16 integers or 8 doubles).

**False Sharing** occurs when two distinct threads running on separate CPU cores read and write to distinct variables that happen to share the **same 64-byte hardware cache line**:

<Diagram type="false-sharing" caption="False Sharing: Writing to sum[0] on Core 0 invalidates the cache line holding sum[1] on Core 1." />

### The Hardware Ping-Pong Cycle:
1. Core 0 writes to `sum[0]`. The cache coherency protocol (MESI) marks Core 0's cache line as **Modified (M)**.
2. Simultaneously, it broadcasts a bus invalidation signal to Core 1, transitioning Core 1's cache line to **Invalid (I)**.
3. When Core 1 attempts to write to `sum[1]`, it experiences a cache miss. It must stall and fetch the line over the system bus.
4. When Core 1 writes `sum[1]`, it invalidates Core 0's cache line!
5. This continuous cache-line ping-pong destroys CPU memory throughput, causing multi-threaded code to run slower than serial code!

---

## Eliminating False Sharing via Cache Padding

### Remedy 1: Structure Padding
Add dummy padding bytes so that each thread's variable is aligned onto its own independent 64-byte cache line:

```c
#define CACHE_LINE_SIZE 64

struct ThreadData {
    int local_sum;
    char pad[CACHE_LINE_SIZE - sizeof(int)]; /* 60 bytes of padding */
};

struct ThreadData sums[4];
```

### Remedy 2: Local Accumulation (Best Practice)
Accumulate into a thread-private local variable allocated on the thread's call stack, and write to global memory only once at loop completion:

```c
#pragma omp parallel num_threads(4)
{
    int tid = omp_get_thread_num();
    int my_local_sum = 0; /* Allocated on thread stack: ZERO false sharing */

    #pragma omp for
    for (int i = 0; i < N; i++) {
        my_local_sum += compute(i);
    }

    #pragma omp atomic
    global_sum += my_local_sum;
}
```

---

## Parallel Overhead Breakdown

The total execution time of a parallel program $T_{\\text{par}}$ comprises five distinct components:
$$T_{\\text{par}} = T_{\\text{computation}} + T_{\\text{thread\\_mgmt}} + T_{\\text{sync}} + T_{\\text{imbalance}} + T_{\\text{memory}}$$

1. **Thread Management ($T_{\\text{thread\\_mgmt}}$):** Time to fork and join thread teams.
2. **Synchronization Overhead ($T_{\\text{sync}}$):** Atomic instructions, lock contention in critical sections, and barrier wait latency.
3. **Load Imbalance ($T_{\\text{imbalance}}$):** Idle time spent by fast threads waiting at barriers for slower threads.
4. **Memory Contention ($T_{\\text{memory}}$):** Bus saturation, NUMA remote memory penalties, and False Sharing cache misses.
"""

# --- 09: Classic Algorithms ---
omp_09 = """---
id: mpi-09-classic-algorithms
title: Classic Parallel Algorithms in OpenMP
slug: 09-classic-algorithms
technology: openmp
order: 9
description: OpenMP implementations of parallel vector addition, dense matrix multiplication, parallel odd-even transposition sort, and breadth-first search.
readingTimeMinutes: 18
sections:
  - id: vector-add
    title: Vector Addition in OpenMP
    level: 2
  - id: matmul
    title: Matrix Multiplication with Loop Collapse
    level: 2
  - id: odd-even-omp
    title: Parallel Odd-Even Transposition Sort in OpenMP
    level: 2
  - id: bfs-omp
    title: Parallel BFS Graph Search in OpenMP
    level: 2
---

## Vector Addition in OpenMP

Vector addition $Z = X + Y$ is completely independent across indices:

```c
#include <stdio.h>
#include <omp.h>

#define N 1000000

int main() {
    static double X[N], Y[N], Z[N];

    /* Initialize in parallel to respect NUMA first-touch policy */
    #pragma omp parallel for
    for (int i = 0; i < N; i++) {
        X[i] = 1.0;
        Y[i] = 2.0;
    }

    double t0 = omp_get_wtime();

    #pragma omp parallel for
    for (int i = 0; i < N; i++) {
        Z[i] = X[i] + Y[i];
    }

    double t1 = omp_get_wtime();
    printf("Vector addition completed in %f seconds (Z[0] = %.1f)\\n", t1 - t0, Z[0]);
    return 0;
}
```

---

## Matrix Multiplication with Loop Collapse

For dense matrix multiplication $C = A \\times B$:

```c
#include <stdio.h>
#include <omp.h>

#define N 256

int main() {
    static double A[N][N], B[N][N], C[N][N];

    #pragma omp parallel for collapse(2)
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            A[i][j] = 1.0;
            B[i][j] = 2.0;
            C[i][j] = 0.0;
        }
    }

    double t0 = omp_get_wtime();

    /* Collapse outer two loops for maximal parallelism */
    #pragma omp parallel for collapse(2) schedule(static)
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            double dot = 0.0;
            for (int k = 0; k < N; k++) {
                dot += A[i][k] * B[k][j];
            }
            C[i][j] = dot;
        }
    }

    double t1 = omp_get_wtime();
    printf("Matrix mult (%dx%d) completed in %f seconds (C[0][0] = %.1f)\\n", N, N, t1 - t0, C[0][0]);
    return 0;
}
```

---

## Parallel Odd-Even Transposition Sort in OpenMP

In OpenMP, the $N$ phases are executed sequentially in an outer loop, while the $N/2$ independent pair swaps within each phase are parallelized with `#pragma omp parallel for`:

```c
#include <stdio.h>
#include <omp.h>

void odd_even_sort(int* a, int n) {
    for (int phase = 0; phase < n; phase++) {
        if (phase % 2 == 0) {
            /* Even phase */
            #pragma omp parallel for
            for (int i = 1; i < n; i += 2) {
                if (a[i - 1] > a[i]) {
                    int tmp = a[i - 1]; a[i - 1] = a[i]; a[i] = tmp;
                }
            }
        } else {
            /* Odd phase */
            #pragma omp parallel for
            for (int i = 1; i < n - 1; i += 2) {
                if (a[i] > a[i + 1]) {
                    int tmp = a[i]; a[i] = a[i + 1]; a[i + 1] = tmp;
                }
            }
        }
    }
}

int main() {
    int arr[] = {34, 12, 5, 78, 1, 99, 23, 8};
    int n = sizeof(arr) / sizeof(arr[0]);

    odd_even_sort(arr, n);

    printf("Sorted by OpenMP: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}
```

---

## Parallel BFS Graph Search in OpenMP

In shared memory, level-synchronous BFS parallelizes neighbor expansion across all vertices currently in the frontier:

```c
#include <stdio.h>
#include <omp.h>

#define V 6

int main() {
    int adj[V][V] = {
        {0, 1, 1, 0, 0, 0},
        {1, 0, 0, 1, 1, 0},
        {1, 0, 0, 0, 0, 1},
        {0, 1, 0, 0, 0, 0},
        {0, 1, 0, 0, 0, 0},
        {0, 0, 1, 0, 0, 0}
    };

    int visited[V] = {0};
    int frontier[V] = {0};
    int next_frontier[V] = {0};

    visited[0] = 1;
    frontier[0] = 1;

    int level = 0;
    while (1) {
        int has_work = 0;

        #pragma omp parallel for reduction(|:has_work)
        for (int u = 0; u < V; u++) {
            if (frontier[u]) {
                for (int v = 0; v < V; v++) {
                    if (adj[u][v] && !visited[v]) {
                        #pragma omp critical
                        {
                            if (!visited[v]) {
                                visited[v] = 1;
                                next_frontier[v] = 1;
                                has_work = 1;
                            }
                        }
                    }
                }
            }
        }

        if (!has_work) break;

        for (int i = 0; i < V; i++) {
            frontier[i] = next_frontier[i];
            next_frontier[i] = 0;
        }
        level++;
    }

    printf("Parallel BFS finished in %d levels. All reachable vertices visited.\\n", level);
    return 0;
}
```
"""

# --- 10: Hybrid MPI + OpenMP ---
omp_10 = """---
id: mpi-10-hybrid-comparison
title: Hybrid MPI + OpenMP & Technology Comparison
slug: 10-hybrid-comparison
technology: openmp
order: 10
description: Architectural rationale for Hybrid MPI + OpenMP on cluster supercomputers, thread safety levels (MPI_Init_thread), and a definitive technology comparison table.
readingTimeMinutes: 14
sections:
  - id: hybrid-rationale
    title: Rationale for Hybrid Distributed-Shared Memory
    level: 2
  - id: thread-safety-levels
    title: The 4 MPI Thread Safety Levels
    level: 2
  - id: hybrid-code-structure
    title: Anatomy of a Hybrid Program
    level: 2
  - id: comparison-table
    title: Definitive Comparison Table: MPI vs OpenMP
    level: 2
---

## Rationale for Hybrid Distributed-Shared Memory

Modern supercomputers and compute clusters are hierarchical:
- **Inter-Node:** Thousands of independent compute nodes connected by a high-speed network (InfiniBand/Ethernet).
- **Intra-Node:** Each compute node contains multiple multi-core CPU sockets sharing node RAM (SMP).

### Why Pure MPI Struggles on Dense Multi-Core Nodes:
If a cluster node has 64 CPU cores, running 64 pure MPI processes creates 64 separate OS processes. This results in:
1. Massive memory waste replicating common data structures 64 times.
2. Overhead copying messages through internal operating system pipes/shared-memory emulators.
3. Network contention saturating the network card's message queues.

### The Hybrid Solution:
Run **1 MPI process per cluster node** (handling inter-node network communications) and spawn **64 OpenMP threads** inside that node (sharing intra-node RAM).

---

## The 4 MPI Thread Safety Levels

When combining MPI with multi-threading, you must initialize MPI using `MPI_Init_thread` instead of `MPI_Init`:

```c
int MPI_Init_thread(int *argc, char ***argv, int required, int *provided);
```

The `required` parameter specifies the required thread safety level:

1. **`MPI_THREAD_SINGLE`:** Pure single-threaded execution. Only one thread exists in the application.
2. **`MPI_THREAD_FUNNELED`:** Multi-threaded application, but **only the master thread** is permitted to invoke MPI communication routines.
3. **`MPI_THREAD_SERIALIZED`:** Multiple threads may make MPI calls, but **only one thread at a time** (the programmer must guard calls with mutex locks).
4. **`MPI_THREAD_MULTIPLE`:** Full concurrency. Any thread can make MPI calls at any time without restriction.

---

## Anatomy of a Hybrid Program

```c
#include <stdio.h>
#include <mpi.h>
#include <omp.h>

int main(int argc, char** argv) {
    int provided;
    MPI_Init_thread(&argc, &argv, MPI_THREAD_FUNNELED, &provided);

    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int local_sum = 0;

    /* Intra-node multi-threaded worksharing */
    #pragma omp parallel for reduction(+:local_sum)
    for (int i = 0; i < 1000; i++) {
        local_sum += (rank + 1);
    }

    /* Inter-node collective reduction across cluster */
    int global_sum = 0;
    MPI_Reduce(&local_sum, &global_sum, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        printf("Hybrid MPI + OpenMP Result: Global Sum = %d\\n", global_sum);
    }

    MPI_Finalize();
    return 0;
}
```

---

## Definitive Comparison Table: MPI vs OpenMP

| Architectural Criterion | Message Passing Interface (MPI) | Open Multi-Processing (OpenMP) |
| :--- | :--- | :--- |
| **Hardware Architecture** | Distributed-Memory Clusters & Networks | Shared-Memory Multi-Core SMP Systems |
| **Execution Entities** | Heavyweight Operating System Processes | Lightweight Threads within single process |
| **Memory Access** | Private, disjoint address space per rank | Unified shared global virtual memory |
| **Data Movement** | Explicit function calls (`MPI_Send`, `MPI_Bcast`) | Implicit shared memory load/store |
| **Programming Model** | SPMD (Single Program, Multiple Data) | Fork-Join Dynamic Multi-Threading |
| **Incremental Porting** | Difficult; requires complete data redistribution | Easy; decorate serial loops with `#pragma omp` |
| **Scalability** | Massively scalable ($10^5+$ cluster nodes) | Limited by node memory bus ($10^1 - 10^2$ cores) |
| **Hardware Cost** | Commodity interconnected PC clusters | High-end multi-socket servers |
| **Primary Pitfall** | Network deadlocks, truncation, desynchronization | Data races, false sharing, critical contention |
| **Compiler Support** | Wrapper scripts (`mpicc`, `mpicxx`) | Standard compiler flags (`-fopenmp`) |
"""

with open('content/openmp/06-runtime-library.mdx', 'w') as f:
    f.write(omp_06)

with open('content/openmp/07-tasks.mdx', 'w') as f:
    f.write(omp_07)

with open('content/openmp/08-performance.mdx', 'w') as f:
    f.write(omp_08)

with open('content/openmp/09-classic-algorithms.mdx', 'w') as f:
    f.write(omp_09)

with open('content/openmp/10-hybrid-comparison.mdx', 'w') as f:
    f.write(omp_10)

print('Generated OpenMP topics 06 to 10')
