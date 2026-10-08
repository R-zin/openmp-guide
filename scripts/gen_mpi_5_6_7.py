import os

# --- 05: Data Distributions ---
mpi_05 = """---
id: mpi-05-data-distributions
title: Data Distributions & Parallel Vector Addition
slug: 05-data-distributions
technology: mpi
order: 5
description: Mathematical partitioning schemes (Block, Cyclic, Block-Cyclic), parallel vector addition implementation, and I/O distribution with Read_vector.
readingTimeMinutes: 14
sections:
  - id: partition-types
    title: Block, Cyclic, and Block-Cyclic Distributions
    level: 2
  - id: vector-add-math
    title: Mathematics of Parallel Vector Addition
    level: 2
  - id: read-vector
    title: Centralized I/O & Read_vector Pattern
    level: 2
  - id: complete-vector-add
    title: Complete Parallel Vector Addition Code
    level: 2
---

## Block, Cyclic, and Block-Cyclic Distributions

When mapping arrays of size $N$ across $P$ distributed processes, three primary partitioning schemes exist:

### 1. Block Partition
Assigns continuous blocks of size $n = \\lceil N / P \\rceil$ to each process:
$$\\text{Process } i \\text{ holds indices: } [i \\times n, \\; (i + 1) \\times n - 1]$$
- **Advantages:** Excellent cache locality (unit stride), minimizes communication boundaries.
- **Disadvantages:** Severe load imbalance for triangular matrices where row size decreases monotonically.

### 2. Cyclic Partition (Round-Robin)
Distributes elements cyclically one by one across processes:
$$\\text{Element } k \\text{ is assigned to Process } (k \\pmod P)$$
- **Advantages:** Balances work evenly across processes for non-uniform or triangular data.
- **Disadvantages:** Poor cache locality (stride $P$), high communication message counts.

### 3. Block-Cyclic Partition
Partitions the array into fixed-sized blocks of size $b$, and assigns blocks in a round-robin cyclic order:
$$\\text{Element } k \\text{ is assigned to Process } \\left(\\lfloor k / b \\rfloor \\pmod P\\right)$$
- The foundation of high-performance distributed linear algebra libraries (ScaLAPACK).
- Strikes an optimal balance between cache spatial locality and load balance.

<Diagram type="data-distribution" caption="Visual comparison of Block, Cyclic, and Block-Cyclic partitioning of a 1D array." />

---

## Mathematics of Parallel Vector Addition

Given two vectors $\\mathbf{x} = (x_0, x_1, \\dots, x_{N-1})$ and $\\mathbf{y} = (y_0, y_1, \\dots, y_{N-1})$, the vector sum $\\mathbf{z} = \\mathbf{x} + \\mathbf{y}$ is:
$$z_i = x_i + y_i, \\quad 0 \\le i < N$$

Because each element $z_i$ depends strictly on $x_i$ and $y_i$, vector addition is **embarrassingly parallel**:
- Under block distribution with $N$ divisible by $P$, each process computes $n_{\\text{local}} = N / P$ elements independently without any inter-process communication during the computation loop!

---

## Centralized I/O & Read_vector Pattern

In standard cluster environments, worker nodes cannot safely prompt for input from `stdin`. The standard pattern is **Centralized I/O**:
1. Process 0 prompts the user or reads data files from disk.
2. Process 0 scatters local blocks to workers using `MPI_Scatter`.
3. Workers compute local operations.
4. Process 0 gathers final results using `MPI_Gather` and prints to `stdout`.

---

## Complete Parallel Vector Addition Code

```c
#include <stdio.h>
#include <stdlib.h>
#include <mpi.h>

void Read_vector(double local_a[], int local_n, int n, char* vec_name, int my_rank, MPI_Comm comm) {
    double* a = NULL;
    if (my_rank == 0) {
        a = (double*)malloc(n * sizeof(double));
        printf("Process 0 initializing vector %s (N = %d)...\\n", vec_name, n);
        for (int i = 0; i < n; i++) {
            a[i] = (double)(i + 1); /* Deterministic test data */
        }
    }

    MPI_Scatter(a, local_n, MPI_DOUBLE, local_a, local_n, MPI_DOUBLE, 0, comm);

    if (my_rank == 0) {
        free(a);
    }
}

void Print_vector(double local_b[], int local_n, int n, char* title, int my_rank, MPI_Comm comm) {
    double* b = NULL;
    if (my_rank == 0) {
        b = (double*)malloc(n * sizeof(double));
    }

    MPI_Gather(local_b, local_n, MPI_DOUBLE, b, local_n, MPI_DOUBLE, 0, comm);

    if (my_rank == 0) {
        printf("%s: ", title);
        for (int i = 0; i < n; i++) {
            printf("%.1f ", b[i]);
        }
        printf("\\n");
        free(b);
    }
}

int main(int argc, char** argv) {
    int my_rank, comm_sz;
    int n = 8; /* Total vector length */

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &my_rank);
    MPI_Comm_size(MPI_COMM_WORLD, &comm_sz);

    int local_n = n / comm_sz;
    double* local_x = (double*)malloc(local_n * sizeof(double));
    double* local_y = (double*)malloc(local_n * sizeof(double));
    double* local_z = (double*)malloc(local_n * sizeof(double));

    /* Centralized initialization and scattering */
    Read_vector(local_x, local_n, n, "x", my_rank, MPI_COMM_WORLD);
    Read_vector(local_y, local_n, n, "y", my_rank, MPI_COMM_WORLD);

    /* Local Vector Addition: O(local_n) with zero communication */
    for (int i = 0; i < local_n; i++) {
        local_z[i] = local_x[i] + local_y[i];
    }

    /* Gather and display result */
    Print_vector(local_z, local_n, n, "Vector Sum z = x + y", my_rank, MPI_COMM_WORLD);

    free(local_x);
    free(local_y);
    free(local_z);
    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 vec_add.c -o vec_add`
- **Run:** `mpirun -np 4 ./vec_add`
- **Expected Output:**
```text
Process 0 initializing vector x (N = 8)...
Process 0 initializing vector y (N = 8)...
Vector Sum z = x + y: 2.0 4.0 6.0 8.0 10.0 12.0 14.0 16.0 
```
"""

# --- 06: Trapezoidal Rule ---
mpi_06 = """---
id: mpi-06-trapezoidal-rule
title: Parallelizing the Trapezoidal Rule
slug: 06-trapezoidal-rule
technology: mpi
order: 6
description: Complete derivation of the composite trapezoidal rule, Point-to-Point Send/Recv implementation, Collective MPI_Reduce implementation, handling non-divisible intervals, and lecture-slide pitfalls.
readingTimeMinutes: 18
sections:
  - id: mathematical-derivation
    title: Mathematical Derivation of the Composite Trapezoidal Rule
    level: 2
  - id: worked-example
    title: Analytical Worked Example
    level: 2
  - id: slide-bug
    title: Watch Out: Lecture Slide Type Bug (int Trap)
    level: 2
  - id: p2p-version
    title: Point-to-Point Version (MPI_Send & MPI_Recv)
    level: 2
  - id: reduce-version
    title: Collective Version (MPI_Reduce)
    level: 2
  - id: non-divisible-n
    title: Handling Non-Divisible Number of Trapezoids
    level: 2
---

## Mathematical Derivation of the Composite Trapezoidal Rule

To numerically approximate the definite integral of a function $f(x)$ over an interval $[a, b]$:
$$\\text{Area} = \\int_{a}^{b} f(x) \\, dx$$

We divide $[a, b]$ into $n$ equal sub-intervals, each of width:
$$h = \\frac{b - a}{n}$$

The grid evaluation points are $x_i = a + i \\cdot h$ for $i = 0, 1, \\dots, n$.

The area of the $i$-th individual trapezoid bounded by $[x_i, x_{i+1}]$ is:
$$\\text{Area}_i = h \\cdot \\frac{f(x_i) + f(x_{i+1})}{2}$$

Summing over all $n$ trapezoids yields the **Composite Trapezoidal Rule**:
$$\\text{Area} = h \\left[ \\frac{f(x_0) + f(x_n)}{2} + \\sum_{i=1}^{n-1} f(x_i) \\right]$$

<Diagram type="trapezoidal-geometry" caption="Composite trapezoidal rule geometry discretizing a curve into n trapezoids of base width h." />

---

## Analytical Worked Example

Let $f(x) = 2x + 3$ on the interval $[a, b] = [0, 2]$ with $n = 4$ trapezoids:
- Base width: $h = \\frac{2 - 0}{4} = 0.5$.
- Grid points: $x_0 = 0.0, \\; x_1 = 0.5, \\; x_2 = 1.0, \\; x_3 = 1.5, \\; x_4 = 2.0$.
- Function values:
  - $f(x_0) = 2(0) + 3 = 3$
  - $f(x_1) = 2(0.5) + 3 = 4$
  - $f(x_2) = 2(1.0) + 3 = 5$
  - $f(x_3) = 2(1.5) + 3 = 6$
  - $f(x_4) = 2(2.0) + 3 = 7$
- Applying formula:
  $$\\text{Area} = 0.5 \\left[ \\frac{3 + 7}{2} + (4 + 5 + 6) \\right] = 0.5 \\times [5 + 15] = 0.5 \\times 20 = 10.0$$
- Exact analytical integral: $\\int_0^2 (2x + 3) \\, dx = [x^2 + 3x]_0^2 = (4 + 6) - 0 = 10.0$.

---

## Watch Out: Lecture Slide Type Bug (int Trap)

<Callout type="watch-out" title="CRITICAL SLIDE ERROR: INT TRAP()">
In Unit IV Part 3 Slide 20, the serial prototype is mistakenly declared as:
```c
/* BUG IN LECTURE SLIDE */
int Trap(double a, double b, int n, double h)
```
Because the return type is declared as `int`, any non-integer integral result (e.g. $10.456$) is truncated to an integer ($10$), introducing catastrophic error into numerical results! Always declare `Trap` returning `double`:
```c
/* CORRECT SIGNATURE */
double Trap(double a, double b, int n, double h)
```
</Callout>

---

## Point-to-Point Version (MPI_Send & MPI_Recv)

In this implementation, worker processes ($1 \\dots P-1$) transmit their local integral approximations to Process 0 using `MPI_Send`. Process 0 aggregates the total sum using `MPI_Recv`.

```c
#include <stdio.h>
#include <mpi.h>

double f(double x) {
    return 2.0 * x + 3.0;
}

double Trap(double left, double right, int count, double h) {
    double estimate = (f(left) + f(right)) / 2.0;
    for (int i = 1; i < count; i++) {
        double x = left + i * h;
        estimate += f(x);
    }
    return estimate * h;
}

int main(int argc, char** argv) {
    int my_rank, comm_sz;
    double a = 0.0, b = 2.0;
    int n = 1024;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &my_rank);
    MPI_Comm_size(MPI_COMM_WORLD, &comm_sz);

    double h = (b - a) / (double)n;
    int local_n = n / comm_sz;

    double local_a = a + my_rank * local_n * h;
    double local_b = local_a + local_n * h;
    double local_integral = Trap(local_a, local_b, local_n, h);

    if (my_rank != 0) {
        MPI_Send(&local_integral, 1, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD);
    } else {
        double total_integral = local_integral;
        for (int source = 1; source < comm_sz; source++) {
            double temp;
            MPI_Recv(&temp, 1, MPI_DOUBLE, source, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
            total_integral += temp;
        }
        printf("Point-to-Point Result: Integral = %f (Exact = 10.000000)\\n", total_integral);
    }

    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 trap_p2p.c -o trap_p2p`
- **Run:** `mpirun -np 4 ./trap_p2p`

---

## Collective Version (MPI_Reduce)

The collective version replaces the loop of point-to-point calls with `MPI_Reduce`, achieving logarithmic $O(\\log P)$ tree reduction. In accordance with PDC Lab 9, we configure `root = comm_sz - 1` (the maximum process rank):

```c
#include <stdio.h>
#include <mpi.h>

double f(double x) {
    return 2.0 * x + 3.0;
}

double Trap(double left, double right, int count, double h) {
    double estimate = (f(left) + f(right)) / 2.0;
    for (int i = 1; i < count; i++) {
        double x = left + i * h;
        estimate += f(x);
    }
    return estimate * h;
}

int main(int argc, char** argv) {
    int my_rank, comm_sz;
    double a = 0.0, b = 2.0;
    int n = 1024;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &my_rank);
    MPI_Comm_size(MPI_COMM_WORLD, &comm_sz);

    double h = (b - a) / (double)n;
    int local_n = n / comm_sz;
    double local_a = a + my_rank * local_n * h;
    double local_b = local_a + local_n * h;

    double local_integral = Trap(local_a, local_b, local_n, h);
    double total_integral = 0.0;
    int root = comm_sz - 1; /* Maximum rank as root */

    MPI_Reduce(&local_integral, &total_integral, 1, MPI_DOUBLE, MPI_SUM, root, MPI_COMM_WORLD);

    if (my_rank == root) {
        printf("MPI_Reduce Result at Max Rank %d: %f (Exact = 10.000000)\\n", root, total_integral);
    }

    MPI_Finalize();
    return 0;
}
```

---

## Handling Non-Divisible Number of Trapezoids

When the total number of trapezoids $n$ is not cleanly divisible by process count $p$ ($n \\pmod p \\neq 0$), naive division truncates remainder trapezoids.

### The Correct Uneven Partitioning Algorithm
Distribute the remainder $R = n \\pmod p$ by assigning $1$ extra trapezoid to each of the first $R$ ranks:

```c
int base_n = n / comm_sz;
int remainder = n % comm_sz;

int local_n;
double local_a, local_b;

if (my_rank < remainder) {
    local_n = base_n + 1;
    local_a = a + my_rank * local_n * h;
} else {
    local_n = base_n;
    local_a = a + (remainder * (base_n + 1) + (my_rank - remainder) * base_n) * h;
}
local_b = local_a + local_n * h;
```
This guarantees that $\\sum_{i=0}^{p-1} \\text{local\\_n}_i = n$ exactly!
"""

# --- 07: Odd-Even Transposition Sort ---
mpi_07 = """---
id: mpi-07-odd-even-sort
title: Parallel Odd-Even Transposition Sort
slug: 07-odd-even-sort
technology: mpi
order: 7
description: Parallel Odd-Even Transposition Sort algorithm, phase theorem, partner calculations, Merge-Low and Merge-High routines, and handling odd process counts and boundary idle ranks.
readingTimeMinutes: 16
sections:
  - id: serial-algorithm
    title: Serial Bubble Sort vs Odd-Even Sort
    level: 2
  - id: parallel-phases
    title: Parallel Phases and Convergence Theorem
    level: 2
  - id: partner-calculation
    title: Partner Computation Logic
    level: 2
  - id: merge-routines
    title: Compare-Split: Merge-Low and Merge-High
    level: 2
  - id: odd-procs
    title: Handling Odd Process Counts and Partner = -1
    level: 2
  - id: complete-code
    title: Complete Tested MPI Odd-Even Sort Program
    level: 2
---

## Serial Bubble Sort vs Odd-Even Sort

Standard bubble sort operates sequentially by comparing adjacent elements $(A[i], A[i+1])$ and swapping them if out of order. Because each swap depends directly on the result of the prior swap, bubble sort has little parallelism.

**Odd-Even Transposition Sort** reorganizes comparisons into alternating decoupled passes:
1. **Even Phase:** Compare and swap pairs $(A[0], A[1]), \\; (A[2], A[3]), \\; (A[4], A[5]), \\dots$
2. **Odd Phase:** Compare and swap pairs $(A[1], A[2]), \\; (A[3], A[4]), \\; (A[5], A[6]), \\dots$

Because pairs in the same phase are completely disjoint, all comparisons within a phase can execute **simultaneously in parallel**!

---

## Parallel Phases and Convergence Theorem

### The Fundamental Theorem (Unit IV Part 4 Slide 3)
> **Theorem:** Suppose $A$ is a list with $n$ keys distributed across $P$ processes, with each process holding a locally sorted block of $n/P$ keys. Then after **$P$ phases** of alternating even and odd compare-split steps, the distributed list $A$ is guaranteed to be globally sorted.

<OddEvenSortStepper />

---

## Partner Computation Logic

In each phase, processes determine their communication partner based on phase parity and process rank:

### 1. Even Phase (`phase % 2 == 0`)
Adjacent pairs are $(0, 1), (2, 3), (4, 5), \\dots$
```c
if (rank % 2 == 0) {
    partner = rank + 1;
} else {
    partner = rank - 1;
}
```

### 2. Odd Phase (`phase % 2 == 1`)
Adjacent pairs are $(1, 2), (3, 4), (5, 6), \\dots$
```c
if (rank % 2 == 1) {
    partner = rank + 1;
} else {
    partner = rank - 1;
}
```

<Callout type="note" title="BITWISE TRICK FOR EVEN PHASES">
Notice that in even phases, `partner = rank ^ 1` (bitwise XOR with 1) computes the exact partner for all ranks in a single instruction!
</Callout>

---

## Compare-Split: Merge-Low and Merge-High

When two partner processes exchange their local sorted arrays of size $k = n/P$:
1. They transmit their local array and receive the partner's array using `MPI_Sendrecv`.
2. **Merge-Low (Smaller Rank):** Merges the two arrays and retains the smallest $k$ keys.
3. **Merge-High (Larger Rank):** Merges the two arrays and retains the largest $k$ keys.

```c
void merge_low(int* my_keys, int* recv_keys, int n) {
    int* temp = (int*)malloc(n * sizeof(int));
    int i = 0, j = 0, k = 0;
    while (k < n) {
        if (my_keys[i] <= recv_keys[j]) temp[k++] = my_keys[i++];
        else temp[k++] = recv_keys[j++];
    }
    for (i = 0; i < n; i++) my_keys[i] = temp[i];
    free(temp);
}

void merge_high(int* my_keys, int* recv_keys, int n) {
    int* temp = (int*)malloc(n * sizeof(int));
    int i = n - 1, j = n - 1, k = n - 1;
    while (k >= 0) {
        if (my_keys[i] >= recv_keys[j]) temp[k--] = my_keys[i--];
        else temp[k--] = recv_keys[j--];
    }
    for (i = 0; i < n; i++) my_keys[i] = temp[i];
    free(temp);
}
```

---

## Handling Odd Process Counts and Partner = -1

In Unit IV Part 4 Slide 16, the lecture explicitly raises two questions:
1. *What happens when `comm_sz` is odd?*
2. *What does `partner = -1` or `partner = comm_sz` mean?*

### The Complete Answers:
- **Boundary Ranks in Odd Phases:** In an odd phase, Process 0 has partner $0 - 1 = -1$, and the highest odd rank has partner `comm_sz`. Since these partners do not exist, **Process 0 and the highest rank must remain IDLE** during that phase.
- **Odd Process Count (`comm_sz` is Odd):** In an even phase, the last process (rank `comm_sz - 1`) has no partner to pair with! It must also remain **IDLE** during even phases.
- **Implementation Safe Guard:**
```c
if (partner < 0 || partner >= comm_sz) {
    partner = MPI_PROC_NULL; /* Safe idle: Sendrecv returns immediately */
}
```

---

## Complete Tested MPI Odd-Even Sort Program

```c
#include <stdio.h>
#include <stdlib.h>
#include <mpi.h>

int cmp(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

void merge_low(int* my_keys, int* recv_keys, int n) {
    int* temp = (int*)malloc(n * sizeof(int));
    int i = 0, j = 0, k = 0;
    while (k < n) {
        if (my_keys[i] <= recv_keys[j]) temp[k++] = my_keys[i++];
        else temp[k++] = recv_keys[j++];
    }
    for (i = 0; i < n; i++) my_keys[i] = temp[i];
    free(temp);
}

void merge_high(int* my_keys, int* recv_keys, int n) {
    int* temp = (int*)malloc(n * sizeof(int));
    int i = n - 1, j = n - 1, k = n - 1;
    while (k >= 0) {
        if (my_keys[i] >= recv_keys[j]) temp[k--] = my_keys[i--];
        else temp[k--] = recv_keys[j--];
    }
    for (i = 0; i < n; i++) my_keys[i] = temp[i];
    free(temp);
}

int main(int argc, char** argv) {
    int rank, size;
    int N = 16;
    int A[16] = {15, 29, 100, 23, -14, 45, 178, 192, 246, -118, 0, 7, 1, 10, 25, 34};

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int n_local = N / size;
    int* local = (int*)malloc(n_local * sizeof(int));
    int* temp = (int*)malloc(n_local * sizeof(int));

    MPI_Scatter(A, n_local, MPI_INT, local, n_local, MPI_INT, 0, MPI_COMM_WORLD);
    qsort(local, n_local, sizeof(int), cmp);

    for (int phase = 0; phase < size; phase++) {
        int partner;
        if (phase % 2 == 0) {
            partner = (rank % 2 == 0) ? rank + 1 : rank - 1;
        } else {
            partner = (rank % 2 == 1) ? rank + 1 : rank - 1;
        }

        if (partner >= 0 && partner < size) {
            MPI_Sendrecv(local, n_local, MPI_INT, partner, 0,
                         temp, n_local, MPI_INT, partner, 0,
                         MPI_COMM_WORLD, MPI_STATUS_IGNORE);
            if (rank < partner) {
                merge_low(local, temp, n_local);
            } else {
                merge_high(local, temp, n_local);
            }
        }
    }

    MPI_Gather(local, n_local, MPI_INT, A, n_local, MPI_INT, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        printf("Sorted Array: ");
        for (int i = 0; i < N; i++) printf("%d ", A[i]);
        printf("\\n");
    }

    free(local);
    free(temp);
    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 odd_even.c -o odd_even`
- **Run:** `mpirun -np 4 ./odd_even`
- **Expected Output:**
```text
Sorted Array: -118 -14 0 1 7 10 15 23 25 29 34 45 100 178 192 246
```
"""

with open('content/mpi/05-data-distributions.mdx', 'w') as f:
    f.write(mpi_05)

with open('content/mpi/06-trapezoidal-rule.mdx', 'w') as f:
    f.write(mpi_06)

with open('content/mpi/07-odd-even-sort.mdx', 'w') as f:
    f.write(mpi_07)

print('Generated MPI topics 05, 06, 07')
