import os

os.makedirs('content/openmp', exist_ok=True)

# --- 01: Fork-Join Model ---
omp_01 = """---
id: omp-01-fork-join-model
title: OpenMP Execution Model & Fork-Join Paradigm
slug: 01-fork-join-model
technology: openmp
order: 1
description: Principles of multi-threaded shared-memory programming, POSIX processes vs lightweight threads, compiler flags, OMP_NUM_THREADS, and thread non-determinism.
readingTimeMinutes: 14
sections:
  - id: fork-join
    title: The Fork-Join Execution Paradigm
    level: 2
  - id: threads-vs-processes
    title: Threads vs Processes in OS Architecture
    level: 2
  - id: compilation-flags
    title: Compiling with -fopenmp and Environment Variables
    level: 2
  - id: hello-world
    title: Complete OpenMP Hello World Implementation
    level: 2
  - id: nondeterminism
    title: Understanding Thread Scheduling Non-Determinism
    level: 2
---

## The Fork-Join Execution Paradigm

OpenMP (*Open Multi-Processing*) is the industry-standard Application Program Interface (API) for shared-memory multi-threaded parallelism in C, C++, and Fortran.

OpenMP programs execute under the **Fork-Join Model**:

1. **Master Thread:** Execution begins as a single sequential thread (designated **Thread 0** or the *master thread*).
2. **Fork:** When the master thread encounters a parallel construct (`#pragma omp parallel`), it **forks** a team of worker threads.
3. **Parallel Team Execution:** All threads in the team execute the enclosed code block concurrently across physical CPU cores.
4. **Join:** At the closing brace of the parallel region, an implicit synchronization barrier forces all worker threads to synchronize. The worker threads yield/sleep, and only the master thread continues sequentially.

<Diagram type="fork-join" caption="OpenMP Fork-Join execution lifecycle transitioning between serial and parallel phases." />

---

## Threads vs Processes in OS Architecture

Understanding the fundamental distinction between an operating system **process** (MPI) and a **thread** (OpenMP) is crucial for lab exams:

| Feature | OS Process (MPI) | POSIX / OpenMP Thread |
| :--- | :--- | :--- |
| **Address Space** | Disjoint, private address space per process | Shared virtual address space across all threads in process |
| **Creation Cost** | High (allocates page tables, file descriptors, heap) | Low (shares text, data, and heap segments) |
| **Communication** | Explicit network message passing (`MPI_Send`) | Implicit reading/writing of shared memory variables |
| **Synchronization** | Inter-process messages and barriers | Mutex locks, atomics, and lightweight barriers |
| **Failure Domain** | If process crashes, other processes can continue | If a thread crashes (segfault), the entire process terminates |

---

## Compiling with -fopenmp and Environment Variables

OpenMP directives are embedded as preprocessor pragmas:
```c
#pragma omp <directive> [clause[[,] clause] ...]
```
Because they use `#pragma`, if you compile without the OpenMP flag, the compiler simply ignores the pragmas and produces a valid sequential binary!

### Compiler Flags:
- **GCC / Clang:** `-fopenmp` (e.g. `gcc -fopenmp -O2 prog.c -o prog` or `clang -fopenmp prog.c -o prog`)

### Environment Variables:
- `OMP_NUM_THREADS`: Sets the default number of threads in parallel regions.
```bash
export OMP_NUM_THREADS=4
./prog
```
- `OMP_DYNAMIC`: When set to `TRUE`, allows the runtime to dynamically adjust thread count based on system load.

---

## Complete OpenMP Hello World Implementation

```c
#include <stdio.h>
#include <omp.h>

int main() {
    /* Query max threads available before parallel region */
    printf("Max available threads: %d\\n", omp_get_max_threads());

    #pragma omp parallel num_threads(4)
    {
        int tid = omp_get_thread_num();
        int nthreads = omp_get_num_threads();

        printf("Hello from OpenMP thread %d of %d\\n", tid, nthreads);
    }

    printf("Back in sequential master thread execution\\n");
    return 0;
}
```
- **Compile:** `clang -fopenmp -O2 hello_omp.c -o hello_omp`
- **Run:** `./hello_omp`
- **Expected Output:** (Arbitrary thread interleaving)
```text
Max available threads: 8
Hello from OpenMP thread 0 of 4
Hello from OpenMP thread 2 of 4
Hello from OpenMP thread 1 of 4
Hello from OpenMP thread 3 of 4
Back in sequential master thread execution
```

<HelloSimulator />

---

## Understanding Thread Scheduling Non-Determinism

Inside a parallel construct, the OS thread scheduler maps threads onto physical hardware cores asynchronously. Consequently:
- Thread execution arrival order is **inherently non-deterministic**.
- Consecutive runs will produce different line ordering in terminal output.
- Any unsynchronized concurrent write to a shared variable creates a catastrophic **Data Race**.
"""

# --- 02: Directives and Clauses ---
omp_02 = """---
id: omp-02-directives-and-clauses
title: OpenMP Directives & Scoping Clauses
slug: 02-directives-and-clauses
technology: mpi
order: 2
description: In-depth analysis of OpenMP scoping rules, private, firstprivate, lastprivate, shared, default(none), num_threads, and conditional if clauses.
readingTimeMinutes: 16
sections:
  - id: parallel-directive
    title: The Parallel Directive
    level: 2
  - id: scoping-clauses
    title: Data-Sharing Clauses: Private, Firstprivate, and Shared
    level: 2
  - id: lastprivate
    title: The Lastprivate Clause
    level: 2
  - id: default-none
    title: Best Practice: default(none)
    level: 2
  - id: conditional-clauses
    title: Runtime Control Clauses: num_threads and if
    level: 2
  - id: complete-code
    title: Complete Scoping Verification Program
    level: 2
---

## The Parallel Directive

The `#pragma omp parallel` directive defines a parallel region executed by a team of threads:
```c
#pragma omp parallel [clause[[,] clause] ...]
{
    /* Structured Block */
}
```

### Constraints on Structured Blocks:
- Must have a single point of entry and single point of exit.
- Cannot jump into or out of the block with `goto`, `break`, or `return`.

---

## Data-Sharing Clauses: Private, Firstprivate, and Shared

Variable scoping determines whether threads access shared global memory or allocate local private copies on their individual call stacks.

### 1. `shared(var_list)`
- All threads access the exact same memory location.
- Reads and writes are directly visible to other threads.
- Variables declared outside the parallel construct are **shared by default**.

### 2. `private(var_list)`
- Each thread allocates an **uninitialized** local copy of the variable on its private stack.
- The original value outside the construct is NOT accessible inside.
- The value of the variable after the parallel region is **undefined**.

### 3. `firstprivate(var_list)`
- Each thread allocates a private copy initialized with the value of the master thread's variable immediately before the construct was reached.
- Modifying the variable inside the parallel region modifies only the thread's local copy; the master variable outside remains unchanged.

---

## The Lastprivate Clause

Used in worksharing loop (`for`) and `sections` constructs:
- Along with private behavior, copies the value from the thread that executed the **sequentially last iteration** of the loop back to the master thread variable after the construct completes.

```c
int final_val = 0;
#pragma omp parallel for lastprivate(final_val)
for (int i = 0; i < 100; i++) {
    final_val = i * 2;
}
/* final_val is guaranteed to be 99 * 2 = 198 here! */
```

---

## Best Practice: default(none)

In production code and exam questions, always enforce `default(none)`:
```c
#pragma omp parallel default(none) shared(A, B) private(tid, local_sum)
```
- Disables default scoping rules.
- The compiler will fail with a compilation error if any variable used inside the region does not have an explicit data-sharing attribute.
- **Prevents subtle race conditions** caused by unintentional shared variable access.

---

## Runtime Control Clauses: num_threads and if

### 1. `num_threads(integer-expression)`
Overrides environment variables to dynamically specify the exact team size for this specific parallel construct:
```c
#pragma omp parallel num_threads(8)
```

### 2. `if(scalar-expression)`
Evaluates a runtime condition. If false, the construct executes **serially** with 1 thread, avoiding thread creation overhead for small datasets:
```c
#pragma omp parallel for if(N > 1000) num_threads(4)
for (int i = 0; i < N; i++) { ... }
```

---

## Complete Scoping Verification Program

```c
#include <stdio.h>
#include <omp.h>

int main() {
    int shared_var = 100;
    int firstprivate_var = 50;
    int private_var = 999;
    int lastprivate_var = -1;

    #pragma omp parallel num_threads(3) \\
        default(none) \\
        shared(shared_var) \\
        firstprivate(firstprivate_var) \\
        private(private_var)
    {
        int tid = omp_get_thread_num();

        /* firstprivate starts at 50 for every thread */
        firstprivate_var += tid;

        /* private starts uninitialized; must assign before read */
        private_var = tid * 10;

        #pragma omp critical
        {
            printf("Thread %d: shared=%d, firstprivate=%d, private=%d\\n",
                   tid, shared_var, firstprivate_var, private_var);
        }
    }

    printf("Master outside: shared=%d, firstprivate=%d, private=%d\\n",
           shared_var, firstprivate_var, private_var);

    /* Verify lastprivate */
    #pragma omp parallel for num_threads(4) lastprivate(lastprivate_var)
    for (int i = 0; i < 8; i++) {
        lastprivate_var = i * 10;
    }
    printf("After loop lastprivate_var (from iteration 7) = %d\\n", lastprivate_var);

    return 0;
}
```
- **Compile:** `clang -fopenmp -O2 scoping_demo.c -o scoping_demo`
- **Run:** `./scoping_demo`
- **Expected Output:**
```text
Thread 0: shared=100, firstprivate=50, private=0
Thread 1: shared=100, firstprivate=51, private=10
Thread 2: shared=100, firstprivate=52, private=20
Master outside: shared=100, firstprivate=50, private=999
After loop lastprivate_var (from iteration 7) = 70
```
"""

# --- 03: Work Sharing ---
omp_03 = """---
id: mpi-03-work-sharing
title: OpenMP Worksharing Constructs & Scheduling Policies
slug: 03-work-sharing
technology: openmp
order: 3
description: Detailed guide to #pragma omp for, loop collapse, static/dynamic/guided scheduling with iteration mapping visualizers, sections, single, and nowait.
readingTimeMinutes: 18
sections:
  - id: parallel-for
    title: The Parallel For Worksharing Construct
    level: 2
  - id: collapse
    title: Collapsing Nested Loops with collapse(N)
    level: 2
  - id: scheduling-policies
    title: Loop Scheduling Policies: Static, Dynamic, and Guided
    level: 2
  - id: visual-mapping
    title: Visualizing Iteration-to-Thread Mapping
    level: 2
  - id: sections-single
    title: Sections, Single, Master, and Nowait
    level: 2
  - id: complete-code
    title: Complete Worksharing Program
    level: 2
---

## The Parallel For Worksharing Construct

The `#pragma omp for` (or combined `#pragma omp parallel for`) directive distributes loop iterations across the current team of threads:

```c
#pragma omp parallel for
for (int i = 0; i < N; i++) {
    c[i] = a[i] + b[i];
}
```

### Canonical Loop Form Requirements:
OpenMP loop parallelization requires the loop to conform strictly to canonical form:
- Single loop control variable (e.g. `int i`).
- Trip count must be computable before loop execution begins.
- Step increment must be an invariant constant step (`i++`, `i += 2`).
- Loop body **cannot contain early exits** (`break` or `return`).

---

## Collapsing Nested Loops with collapse(N)

When parallelizing nested loops, placing `#pragma omp for` on the outer loop only parallelizes the outer iterations. If the outer loop bound is small (e.g. $N = 2$), only 2 threads will be utilized, leaving remaining cores idle!

The `collapse(N)` clause flattens $N$ tightly nested loops into a single linear iteration space:

```c
#pragma omp parallel for collapse(2) num_threads(8)
for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
        matrix[i][j] = i * j;
    }
}
```
Here, `collapse(2)` creates $4 \\times 4 = 16$ iterations partitioned evenly among all 8 threads!

---

## Loop Scheduling Policies: Static, Dynamic, and Guided

The `schedule` clause controls how loop iterations are assigned to threads:

```c
schedule(kind [, chunk_size])
```

1. **Static (`schedule(static, chunk)`):**
   - Iterations partitioned into fixed chunks of size `chunk_size` and assigned round-robin at compile/loop entry.
   - Lowest possible runtime overhead (zero queue locks). Best for uniform, balanced workloads.
2. **Dynamic (`schedule(dynamic, chunk)`):**
   - Threads dynamically grab a chunk from a shared synchronized work queue whenever they finish their previous chunk.
   - Ideal for unpredictable or non-uniform workloads, but incurs atomic queue synchronization overhead.
3. **Guided (`schedule(guided, chunk)`):**
   - Chunk size starts large and decreases exponentially: $\\text{size} = \\max(\\text{chunk}, \\; \\text{remaining} / \\text{num\\_threads})$.
   - Mitigates queue overhead initially while providing fine-grained tail load balancing at the end.

<OpenMPScheduleVisualizer />

---

## Sections, Single, Master, and Nowait

### 1. `#pragma omp sections`
Divides non-iterative tasks among threads (Functional Parallelism):
```c
#pragma omp parallel sections
{
    #pragma omp section
    task_A();
    #pragma omp section
    task_B();
}
```

### 2. `#pragma omp single` vs `#pragma omp master`
- `single`: Executed by the first thread that reaches it. Has an **implicit barrier** at the end.
- `master` (or `masked` in OpenMP 5.1): Executed strictly by Thread 0. Has **NO implicit barrier** at the end.

### 3. The `nowait` Clause
Removes the implicit barrier at the end of a worksharing construct (`for`, `sections`, `single`), allowing fast threads to continue executing subsequent statements immediately.

---

## Complete Worksharing Program

```c
#include <stdio.h>
#include <omp.h>

#define N 16

int main() {
    int arr[N];

    #pragma omp parallel num_threads(4)
    {
        /* Worksharing loop with static schedule */
        #pragma omp for schedule(static, 2)
        for (int i = 0; i < N; i++) {
            arr[i] = i * 10;
            printf("Thread %d executed iteration %d\\n", omp_get_thread_num(), i);
        }

        /* Single thread prints confirmation */
        #pragma omp single
        printf("All 16 iterations completed by team!\\n");
    }

    return 0;
}
```
- **Compile:** `clang -fopenmp -O2 workshare.c -o workshare`
- **Run:** `./workshare`
"""

# --- 04: Synchronisation ---
omp_04 = """---
id: mpi-04-synchronisation
title: OpenMP Synchronisation, Locks & Data Races
slug: 04-synchronisation
technology: openmp
order: 4
description: Critical sections, atomic operations, barriers, ordered directives, explicit locks (omp_set_lock), data race conditions, and race resolution techniques.
readingTimeMinutes: 18
sections:
  - id: race-conditions
    title: Anatomy of a Data Race
    level: 2
  - id: critical-vs-atomic
    title: Critical Sections vs Hardware Atomics
    level: 2
  - id: barrier-ordered
    title: Barrier and Ordered Synchronization
    level: 2
  - id: explicit-locks
    title: Explicit Locks with omp_lock_t
    level: 2
  - id: complete-code
    title: Complete Counter Race Resolution Program
    level: 2
---

## Anatomy of a Data Race

A **Data Race** occurs when:
1. Two or more concurrent threads access the same memory location simultaneously.
2. At least one access is a **write**.
3. The threads do not use any mutual exclusion or synchronization to coordinate accesses.

In C, an operation like `count++` is NOT atomic. It expands into three distinct machine instructions:
$$\\text{LOAD } \\text{reg} \\leftarrow [\\text{count}] \\quad \\longrightarrow \\quad \\text{ADD } \\text{reg}, 1 \\quad \\longrightarrow \\quad \\text{STORE } [\\text{count}] \\leftarrow \\text{reg}$$
When multiple cores interleave these instructions, updates are dropped, causing silent, non-deterministic data corruption.

<RaceConditionDemo />

---

## Critical Sections vs Hardware Atomics

OpenMP provides two primary directives to eliminate data races on memory writes:

### 1. `#pragma omp atomic`
Protects a single scalar memory update using hardware-level atomic CPU instructions:
```c
#pragma omp atomic
count++;
```
- **Supported Expressions:** `x++`, `x--`, `x += expr`, `x -= expr`, `x *= expr`, `x &= expr`, etc.
- **Overhead:** Extremely low. The hardware memory controller handles synchronization at cache-line speed.

### 2. `#pragma omp critical [(name)]`
Enforces mutual exclusion over an arbitrary structured block of code:
```c
#pragma omp critical (db_update)
{
    total += val;
    log_transaction(val);
}
```
- Only one thread can execute inside any critical section with the same name simultaneously.
- **Overhead:** High. Implements software lock acquisition, flushing memory caches.

<Callout type="watch-out" title="AVOID CRITICAL SECTIONS INSIDE LOOPS">
Placing `#pragma omp critical` inside an inner loop serializes all threads, causing massive lock contention that runs slower than single-threaded serial execution! Use `atomic` or the `reduction` clause instead.
</Callout>

---

## Barrier and Ordered Synchronization

### 1. `#pragma omp barrier`
Explicit synchronization point. No thread can proceed past the barrier until all threads in the current team have arrived.

### 2. `#pragma omp ordered`
Used inside a `#pragma omp for ordered` loop. Enforces that the enclosed block executes in strict sequential iteration order ($i = 0, 1, 2, \\dots, N-1$):
```c
#pragma omp parallel for ordered
for (int i = 0; i < N; i++) {
    #pragma omp ordered
    printf("Result %d: %f\\n", i, result[i]);
}
```

---

## Explicit Locks with omp_lock_t

For complex data structures (e.g. hash tables, graph adjacency lists) where directives are insufficient, OpenMP provides explicit low-level locks:

```c
#include <omp.h>

omp_lock_t my_lock;
omp_init_lock(&my_lock);

#pragma omp parallel
{
    omp_set_lock(&my_lock);
    /* Critical section accessing shared data */
    omp_unset_lock(&my_lock);
}

omp_destroy_lock(&my_lock);
```

<Callout type="watch-out" title="SIMPLE LOCKS ARE NOT RE-ENTRANT">
`omp_lock_t` is NOT re-entrant! Calling `omp_set_lock(&my_lock)` twice on the same thread without un-setting causes immediate self-deadlock. Use `omp_nest_lock_t` for recursive functions.
</Callout>

---

## Complete Counter Race Resolution Program

```c
#include <stdio.h>
#include <omp.h>

#define ITERATIONS 100000

int main() {
    int unsafe_count = 0;
    int atomic_count = 0;
    int reduction_count = 0;

    /* 1. Unsafe Race Condition */
    #pragma omp parallel for num_threads(4)
    for (int i = 0; i < ITERATIONS; i++) {
        unsafe_count++;
    }

    /* 2. Protected with Atomic */
    #pragma omp parallel for num_threads(4)
    for (int i = 0; i < ITERATIONS; i++) {
        #pragma omp atomic
        atomic_count++;
    }

    /* 3. Protected with Reduction */
    #pragma omp parallel for num_threads(4) reduction(+:reduction_count)
    for (int i = 0; i < ITERATIONS; i++) {
        reduction_count++;
    }

    printf("Target Total Expected: %d\\n", ITERATIONS);
    printf("Unsafe Count (Data Race): %d (Lost %d updates)\\n",
           unsafe_count, ITERATIONS - unsafe_count);
    printf("Atomic Count (Protected): %d\\n", atomic_count);
    printf("Reduction Count (Optimal): %d\\n", reduction_count);

    return 0;
}
```
- **Compile:** `clang -fopenmp -O2 race_fix.c -o race_fix`
- **Run:** `./race_fix`
"""

# --- 05: Reduction ---
omp_05 = """---
id: mpi-05-reduction
title: OpenMP Reduction Clause & Pi Estimation
slug: 05-reduction
technology: openmp
order: 5
description: Mathematical reduction semantics, predefined operators, custom reductions, and complete implementations of Numerical Pi Estimation and Trapezoidal Rule in OpenMP.
readingTimeMinutes: 16
sections:
  - id: reduction-clause
    title: Mechanics of the Reduction Clause
    level: 2
  - id: reduction-operators
    title: Predefined Reduction Operators & Identities
    level: 2
  - id: pi-estimation
    title: Numerical Pi Estimation (Rectangle Method)
    level: 2
  - id: trap-openmp
    title: Trapezoidal Rule in OpenMP
    level: 2
  - id: custom-reductions
    title: User-Defined Reductions (OpenMP 4.0+)
    level: 2
---

## Mechanics of the Reduction Clause

The `reduction(operator : variable_list)` clause provides the most scalable way to accumulate values across threads without lock overhead:

```c
reduction(+:sum)
```

### Execution Lifecycle:
1. **Thread-Private Copy:** The OpenMP runtime allocates a private copy of each variable for every thread on its local stack.
2. **Identity Initialization:** Each private copy is automatically initialized to the mathematical identity value corresponding to the operator (e.g. $0$ for `+`, $1$ for `*`).
3. **Local Accumulation:** Inside the loop, each thread modifies its private accumulator at full register speed without any locks or memory bus contention.
4. **Logarithmic Tree Combine:** At the end of the loop, private accumulators are merged into the original shared variable using a fast reduction tree.

---

## Predefined Reduction Operators & Identities

| Operator | Mathematical Identity Value | Example Clause |
| :--- | :--- | :--- |
| `+` | `0` | `reduction(+:sum)` |
| `*` | `1` | `reduction(*:prod)` |
| `-` | `0` | `reduction(-:diff)` |
| `&` | `~0` (all bits 1) | `reduction(&:mask)` |
| `|` | `0` | `reduction(|:flags)` |
| `^` | `0` | `reduction(^:checksum)` |
| `&&` | `1` | `reduction(&&:all_valid)` |
| `||` | `0` | `reduction(||:any_found)` |
| `min` | Most positive representable value | `reduction(min:min_val)` |
| `max` | Most negative representable value | `reduction(max:max_val)` |

---

## Numerical Pi Estimation (Rectangle Method)

Mathematical formulation:
$$\\pi = \\int_{0}^{1} \\frac{4}{1 + x^2} \\, dx$$

Discretizing using $N$ rectangles with midpoint evaluation:

```c
#include <stdio.h>
#include <omp.h>

static long num_steps = 1000000;
double step;

int main() {
    double sum = 0.0;
    step = 1.0 / (double)num_steps;

    double t0 = omp_get_wtime();

    #pragma omp parallel for reduction(+:sum)
    for (long i = 0; i < num_steps; i++) {
        double x = (i + 0.5) * step;
        sum += 4.0 / (1.0 + x * x);
    }

    double pi = step * sum;
    double t1 = omp_get_wtime();

    printf("Computed Pi = %.10f (Elapsed Time = %f s)\\n", pi, t1 - t0);
    return 0;
}
```
- **Compile:** `clang -fopenmp -O2 pi_omp.c -o pi_omp`
- **Run:** `./pi_omp`
- **Expected Output:**
```text
Computed Pi = 3.1415926536 (Elapsed Time = 0.001820 s)
```

---

## Trapezoidal Rule in OpenMP

We can also implement the composite trapezoidal rule in shared memory using the reduction clause:

```c
#include <stdio.h>
#include <omp.h>

double f(double x) {
    return 2.0 * x + 3.0;
}

int main() {
    double a = 0.0, b = 2.0;
    int n = 1024;
    double h = (b - a) / (double)n;

    double sum = (f(a) + f(b)) / 2.0;

    #pragma omp parallel for reduction(+:sum)
    for (int i = 1; i < n; i++) {
        double x = a + i * h;
        sum += f(x);
    }

    double integral = sum * h;
    printf("OpenMP Trapezoidal Result = %f (Exact = 10.000000)\\n", integral);
    return 0;
}
```
- **Compile:** `clang -fopenmp -O2 trap_omp.c -o trap_omp`
- **Run:** `./trap_omp`
"""

with open('content/openmp/01-fork-join-model.mdx', 'w') as f:
    f.write(omp_01)

with open('content/openmp/02-directives-and-clauses.mdx', 'w') as f:
    f.write(omp_02)

with open('content/openmp/03-work-sharing.mdx', 'w') as f:
    f.write(omp_03)

with open('content/openmp/04-synchronisation.mdx', 'w') as f:
    f.write(omp_04)

with open('content/openmp/05-reduction.mdx', 'w') as f:
    f.write(omp_05)

print('Generated OpenMP topics 01 to 05')
