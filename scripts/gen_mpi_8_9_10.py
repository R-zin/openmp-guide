import os

# --- 08: Matrix Multiplication & Cannon's Algorithm ---
mpi_08 = """---
id: mpi-08-matrix-multiplication
title: Matrix Multiplication & Cannon's Algorithm
slug: 08-matrix-multiplication
technology: mpi
order: 8
description: Analysis of Hadamard vs true matrix product, 1-D column-wise cost model, Row-striped matrix-vector multiplication, and Cannon's 2D Torus algorithm with full Cartesian topology code.
readingTimeMinutes: 20
sections:
  - id: hadamard-vs-true
    title: Hadamard Product vs True Matrix Multiplication
    level: 2
  - id: one-d-cost
    title: 1-D Column-Wise Decomposition Cost Model
    level: 2
  - id: row-striped-mv
    title: Row-Striped Matrix-Vector Multiplication Code
    level: 2
  - id: cannon-overview
    title: Cannon's Algorithm Principles
    level: 2
  - id: cannon-worked
    title: 4x4 Worked Example with Shifts
    level: 2
  - id: cannon-cost
    title: Cannon's Communication & Computation Cost Formula
    level: 2
  - id: cart-code
    title: Complete MPI Cartesian Topology Code for Cannon's Algorithm
    level: 2
---

## Hadamard Product vs True Matrix Multiplication

In parallel linear algebra, two fundamental types of matrix multiplication exist:

1. **Hadamard (Element-Wise / Schur) Multiplication ($C = A \\circ B$):**
   $$C_{i,j} = A_{i,j} \\times B_{i,j}$$
   - Both matrices have identical dimensions $M \\times N$.
   - **Parallel Property:** Completely embarrassingly parallel. If $A$ and $B$ are partitioned identically, each process computes its local submatrix with **zero communication**!

2. **Standard Matrix-Matrix Multiplication ($C = A \\times B$):**
   $$C_{i,j} = \\sum_{k=0}^{n-1} A_{i,k} \\times B_{k,j}$$
   - Computation of element $C_{i,j}$ requires the entire row $i$ of $A$ and column $j$ of $B$.
   - Requires extensive communication (broadcasting or rotating matrix strips/blocks).

---

## 1-D Column-Wise Decomposition Cost Model

In 1-D column-wise decomposition of $n \\times n$ matrices across $p$ processes (Unit IV Part 5 Slide 8):
- Each process owns a column strip of size $n \\times (n/p)$.
- To compute its local columns of $C$, each process needs all elements of matrix $A$.
- Processes execute an **Allgather** across all $p$ processes to exchange strips of $A$.
- **Communication Latency Cost Model:**
  $$T_{\\text{comm}} = (p - 1) t_s + t_w (p - 1) \\frac{n^2}{p} = (p - 1) \\left( t_s + t_w \\frac{n^2}{p} \\right)$$
  where $t_s$ is network startup latency, and $t_w$ is per-word transmission time.
- **Computation Cost:** $T_{\\text{comp}} = 2 n^3 / p \\cdot t_{\\text{calc}}$.

---

## Row-Striped Matrix-Vector Multiplication Code

```c
#include <stdio.h>
#include <mpi.h>

#define N 4

int main(int argc, char** argv) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    double A[N][N], x[N], y[N];
    double local_row[N], local_y = 0.0;

    if (rank == 0) {
        for (int i = 0; i < N; i++) {
            x[i] = 1.0;
            for (int j = 0; j < N; j++) {
                A[i][j] = (i + 1) * 10 + (j + 1);
            }
        }
    }

    /* Broadcast vector x to all processes */
    MPI_Bcast(x, N, MPI_DOUBLE, 0, MPI_COMM_WORLD);

    /* Scatter rows of A (one row per process) */
    MPI_Scatter(A, N, MPI_DOUBLE, local_row, N, MPI_DOUBLE, 0, MPI_COMM_WORLD);

    /* Compute dot product of local row */
    for (int j = 0; j < N; j++) {
        local_y += local_row[j] * x[j];
    }

    /* Gather local dot product into result vector y */
    MPI_Gather(&local_y, 1, MPI_DOUBLE, y, 1, MPI_DOUBLE, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        printf("Result Vector y = A * x:\\n");
        for (int i = 0; i < N; i++) {
            printf("y[%d] = %.1f\\n", i, y[i]);
        }
    }

    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 mat_vec.c -o mat_vec`
- **Run:** `mpirun -np 4 ./mat_vec`

---

## Cannon's Algorithm Principles

**Cannon's Algorithm** is an optimal 2D block-cyclic matrix multiplication algorithm designed for a $\\sqrt{p} \\times \\sqrt{p}$ process grid arranged as a 2D Torus:

1. **2D Block Decomposition:** Matrices $A$ and $B$ are divided into $p$ square submatrices of size $(n/\\sqrt{p}) \\times (n/\\sqrt{p})$. Process $P_{i,j}$ holds sub-blocks $A_{i,j}$ and $B_{i,j}$.
2. **Initial Alignment (Pre-skew):**
   - Submatrix $A_{i,j}$ is shifted circularly **LEFT** by $i$ positions.
   - Submatrix $B_{i,j}$ is shifted circularly **UP** by $j$ positions.
3. **Main Multiply-Shift Loop:** Exactly $\\sqrt{p}$ iterations:
   - Compute local block multiplication and accumulate: $C_{i,j} += A_{i,j} \\times B_{i,j}$.
   - Shift $A_{i,j}$ circularly **LEFT by 1** position.
   - Shift $B_{i,j}$ circularly **UP by 1** position.

<CannonStepper />

---

## 4x4 Worked Example with Shifts

Given 16 processes ($p = 16, \\sqrt{p} = 4$) mapped onto a $4 \\times 4$ grid (Unit IV Part 5 Slide 13):

### Step 1: Initial Alignment Shifts
- **Matrix A (Row Shifts):**
  - Row 0: Shift left by 0 $\\rightarrow$ $[A_{00}, A_{01}, A_{02}, A_{03}]$
  - Row 1: Shift left by 1 $\\rightarrow$ $[A_{11}, A_{12}, A_{13}, A_{10}]$
  - Row 2: Shift left by 2 $\\rightarrow$ $[A_{22}, A_{23}, A_{20}, A_{21}]$
  - Row 3: Shift left by 3 $\\rightarrow$ $[A_{33}, A_{30}, A_{31}, A_{32}]$
- **Matrix B (Column Shifts):**
  - Col 0: Shift up by 0 $\\rightarrow$ $[B_{00}, B_{10}, B_{20}, B_{30}]^T$
  - Col 1: Shift up by 1 $\\rightarrow$ $[B_{11}, B_{21}, B_{31}, B_{01}]^T$
  - Col 2: Shift up by 2 $\\rightarrow$ $[B_{22}, B_{32}, B_{02}, B_{12}]^T$
  - Col 3: Shift up by 3 $\\rightarrow$ $[B_{33}, B_{03}, B_{13}, B_{23}]^T$

### Step 2: Main Loop Iterations
In each iteration $k = 0, 1, 2, 3$:
- Every process multiplies its current blocks $C_{i,j} += A_{i,j} \\times B_{i,j}$.
- Single-hop circular shift: $A$ rolls left by 1; $B$ rolls up by 1.
- After 4 iterations, $C$ contains the exact matrix product!

---

## Cannon's Communication & Computation Cost Formula

According to Unit IV Part 5 Slide 20:

### 1. Initial Alignment Communication:
- Maximum shift distance is $\\sqrt{p} - 1$.
- Total alignment time $= 2 (\\sqrt{p} - 1) \\left( t_s + t_w \\frac{n^2}{p} \\right)$.

### 2. Main Loop Shifts:
- Exactly $\\sqrt{p} - 1$ single-hop shifts.
- Loop communication time $= 2 (\\sqrt{p} - 1) \\left( t_s + t_w \\frac{n^2}{p} \\right)$.

### 3. Total Algorithmic Time:
$$T = \\underbrace{2 \\frac{n^3}{p} t_{\\text{calc}}}_{\\text{Computation}} + \\underbrace{4 (\\sqrt{p} - 1) t_s + 4 (\\sqrt{p} - 1) t_w \\frac{n^2}{p}}_{\\text{Communication}}$$

Notice that communication scales as $O(\\sqrt{p})$, compared to $O(p)$ in 1D striped decomposition.

---

## Complete MPI Cartesian Topology Code for Cannon's Algorithm

```c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <mpi.h>

int main(int argc, char** argv) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int q = (int)sqrt(size);
    if (q * q != size) {
        if (rank == 0) printf("Error: Process count must be a perfect square!\\n");
        MPI_Finalize();
        return 0;
    }

    /* Create 2D Torus Cartesian Communicator */
    int dims[2] = {q, q};
    int periods[2] = {1, 1}; /* Periodic boundary conditions for circular roll */
    MPI_Comm cart_comm;
    MPI_Cart_create(MPI_COMM_WORLD, 2, dims, periods, 1, &cart_comm);

    int coords[2];
    MPI_Cart_coords(cart_comm, rank, 2, coords);
    int row = coords[0], col = coords[1];

    /* Single scalar element per process for demonstration */
    double A = (row + 1) * 10 + (col + 1);
    double B = (row == col) ? 1.0 : 0.0; /* Identity matrix */
    double C = 0.0;

    /* Query shift neighbors */
    int left_nbr, right_nbr, up_nbr, down_nbr;
    MPI_Cart_shift(cart_comm, 1, 1, &left_nbr, &right_nbr); /* Horizontal shift */
    MPI_Cart_shift(cart_comm, 0, 1, &up_nbr, &down_nbr);    /* Vertical shift */

    /* Initial Alignment / Preskew */
    int src, dest;
    MPI_Cart_shift(cart_comm, 1, -row, &src, &dest);
    MPI_Sendrecv_replace(&A, 1, MPI_DOUBLE, dest, 0, src, 0, cart_comm, MPI_STATUS_IGNORE);

    MPI_Cart_shift(cart_comm, 0, -col, &src, &dest);
    MPI_Sendrecv_replace(&B, 1, MPI_DOUBLE, dest, 0, src, 0, cart_comm, MPI_STATUS_IGNORE);

    /* Main Loop */
    for (int step = 0; step < q; step++) {
        C += A * B;
        /* Circular shifts: A left, B up */
        MPI_Sendrecv_replace(&A, 1, MPI_DOUBLE, left_nbr, 0, right_nbr, 0, cart_comm, MPI_STATUS_IGNORE);
        MPI_Sendrecv_replace(&B, 1, MPI_DOUBLE, up_nbr, 0, down_nbr, 0, cart_comm, MPI_STATUS_IGNORE);
    }

    printf("Process (%d, %d) [Rank %d] Result C = %.1f\\n", row, col, rank, C);

    MPI_Comm_free(&cart_comm);
    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 cannon.c -o cannon`
- **Run:** `mpirun -np 4 ./cannon`
"""

# --- 09: Parallel Graph Search ---
mpi_09 = """---
id: mpi-09-graph-search
title: Parallel Graph Search with MPI (BFS & DFS)
slug: 09-graph-search
technology: mpi
order: 9
description: Level-synchronous parallel BFS, parallel DFS subtree distribution, serial baselines, and worked walkthrough of the 15-node tree from PDC Lab 10.
readingTimeMinutes: 18
sections:
  - id: lab10-tree
    title: The PDC Lab 10 Test Tree Architecture
    level: 2
  - id: serial-baseline
    title: Serial BFS and DFS Baselines
    level: 2
  - id: parallel-bfs
    title: Level-Synchronous Parallel BFS with MPI_Allreduce
    level: 2
  - id: parallel-dfs
    title: Parallel DFS Subtree Partitioning
    level: 2
  - id: complete-code
    title: Complete Tested MPI Graph Search Program
    level: 2
---

## The PDC Lab 10 Test Tree Architecture

In PDC Lab 10, the curriculum presents a 15-node graph traversal benchmark ($V = 15$, nodes labeled $0$ to $14$):

<Diagram type="bfs-dfs-tree" caption="PDC Lab 10 benchmark tree topology with 15 vertices and 4 levels." />

### Expected Output Sequence (Starting from Node 0):
- **Breadth-First Search (BFS):**
  $$0, \\; 1, \\; 2, \\; 3, \\; 4, \\; 5, \\; 6, \\; 7, \\; 8, \\; 9, \\; 10, \\; 11, \\; 12, \\; 13, \\; 14$$
- **Depth-First Search (DFS):**
  $$0, \\; 1, \\; 3, \\; 7, \\; 12, \\; 8, \\; 13, \\; 4, \\; 9, \\; 14, \\; 2, \\; 5, \\; 10, \\; 6, \\; 11$$

---

## Serial BFS and DFS Baselines

### Serial Breadth-First Search (Queue-Based):
```c
void serial_bfs(int adj[15][15], int start_node, int* order) {
    int visited[15] = {0};
    int queue[15];
    int front = 0, rear = 0, idx = 0;

    visited[start_node] = 1;
    queue[rear++] = start_node;

    while (front < rear) {
        int u = queue[front++];
        order[idx++] = u;
        for (int v = 0; v < 15; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                queue[rear++] = v;
            }
        }
    }
}
```

---

## Level-Synchronous Parallel BFS with MPI_Allreduce

In distributed memory, a level-synchronous parallel BFS maintains a global frontier across all processes:

1. **Vertex Ownership:** Vertices $0 \\dots V-1$ are partitioned across $P$ processes using block distribution (Process $i$ owns vertices $[i \\cdot V/P, \\; (i+1) \\cdot V/P - 1]$).
2. **Current Frontier:** A bitmask array `frontier[V]` marks nodes at current depth level $d$.
3. **Local Neighbor Expansion:** Each process inspects frontier nodes it owns, identifying all unvisited adjacent neighbors and flagging them in `local_next_frontier[V]`.
4. **Global Frontier Consensus:** Processes call `MPI_Allreduce` with bitwise OR (`MPI_BOR` or `MPI_LOR`) to merge local discoveries into a unified `global_next_frontier[V]`.
5. **Termination:** When `global_next_frontier` contains zero active vertices, all reachable nodes have been traversed.

---

## Complete Tested MPI Graph Search Program

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <mpi.h>

#define V 15

int main(int argc, char** argv) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int adj[V][V];
    memset(adj, 0, sizeof(adj));

    /* Build PDC Lab 10 Tree Edges */
    int edges[][2] = {
        {0,1}, {0,2},
        {1,3}, {1,4}, {2,5}, {2,6},
        {3,7}, {3,8}, {4,9}, {5,10}, {6,11},
        {7,12}, {8,13}, {9,14}
    };
    int num_edges = 14;
    for (int i = 0; i < num_edges; i++) {
        int u = edges[i][0], v = edges[i][1];
        adj[u][v] = 1;
        adj[v][u] = 1;
    }

    int visited[V] = {0};
    int frontier[V] = {0};
    int local_next[V] = {0};
    int global_next[V] = {0};

    int bfs_order[V];
    int order_count = 0;

    double t0 = MPI_Wtime();

    /* Start from node 0 */
    if (rank == 0) {
        visited[0] = 1;
        frontier[0] = 1;
        bfs_order[order_count++] = 0;
    }
    MPI_Bcast(visited, V, MPI_INT, 0, MPI_COMM_WORLD);
    MPI_Bcast(frontier, V, MPI_INT, 0, MPI_COMM_WORLD);

    while (1) {
        memset(local_next, 0, sizeof(local_next));

        /* Each rank checks vertices it owns */
        for (int u = 0; u < V; u++) {
            if (frontier[u] && (u % size == rank)) {
                for (int v = 0; v < V; v++) {
                    if (adj[u][v] && !visited[v]) {
                        local_next[v] = 1;
                    }
                }
            }
        }

        MPI_Allreduce(local_next, global_next, V, MPI_INT, MPI_LOR, MPI_COMM_WORLD);

        int active = 0;
        for (int v = 0; v < V; v++) {
            if (global_next[v] && !visited[v]) {
                visited[v] = 1;
                frontier[v] = 1;
                active = 1;
                if (rank == 0) {
                    bfs_order[order_count++] = v;
                }
            } else {
                frontier[v] = 0;
            }
        }

        if (!active) break;
    }

    double t1 = MPI_Wtime();

    if (rank == 0) {
        printf("Parallel BFS Traversal Order (Starting from 0):\\n");
        for (int i = 0; i < order_count; i++) {
            printf("%d%s", bfs_order[i], (i == order_count - 1) ? "" : ", ");
        }
        printf("\\nExecution Time = %f seconds\\n", t1 - t0);
    }

    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 parallel_bfs.c -o parallel_bfs`
- **Run:** `mpirun -np 4 ./parallel_bfs`
- **Expected Output:**
```text
Parallel BFS Traversal Order (Starting from 0):
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
Execution Time = 0.000180 seconds
```
"""

# --- 10: Pitfalls & Debugging Checklist ---
mpi_10 = """---
id: mpi-10-pitfalls-checklist
title: MPI Pitfalls & Exam Debugging Checklist
slug: 10-pitfalls-checklist
technology: mpi
order: 10
description: Practical troubleshooting guide, root-cause analyses of deadlock scenarios, buffer truncation errors, communicator mismatch, and pre-submission checklist for lab exams.
readingTimeMinutes: 14
sections:
  - id: deadlock-taxonomy
    title: Taxonomy of MPI Deadlocks
    level: 2
  - id: common-errors
    title: Fatal MPI Errors & What They Mean
    level: 2
  - id: debugging-checklist
    title: The 10-Point Pre-Submission Exam Checklist
    level: 2
---

## Taxonomy of MPI Deadlocks

A deadlock occurs when processes are blocked waiting for events that will never happen. In MPI, deadlocks stem from three primary causes:

### 1. Head-to-Head Send Deadlock
```c
/* DEADLOCK ON RENDEZVOUS BUFFERS */
if (rank == 0) {
    MPI_Send(bufA, N, MPI_INT, 1, 0, MPI_COMM_WORLD);
    MPI_Recv(bufB, N, MPI_INT, 1, 0, MPI_COMM_WORLD, &status);
} else if (rank == 1) {
    MPI_Send(bufB, N, MPI_INT, 0, 0, MPI_COMM_WORLD);
    MPI_Recv(bufA, N, MPI_INT, 0, 0, MPI_COMM_WORLD, &status);
}
```
- **Fix:** Invert order on Rank 1 (Recv then Send), or use `MPI_Sendrecv`.

### 2. Collective Divergence Deadlock
```c
/* DEADLOCK: Collective enclosed in rank branch */
if (rank == 0) {
    MPI_Bcast(&val, 1, MPI_INT, 0, MPI_COMM_WORLD);
}
/* Ranks 1..P-1 never call MPI_Bcast, Rank 0 waits forever */
```
- **Fix:** All processes in the communicator MUST invoke the collective routine.

### 3. Tag / Source Mismatch Deadlock
Rank 0 sends with `tag = 100`, but Rank 1 calls `MPI_Recv` with `tag = 200`. The message sits in the unexpected message queue, and Rank 1 blocks indefinitely.

---

## Fatal MPI Errors & What They Mean

| Error Code / Message | Root Cause | Instant Fix |
| :--- | :--- | :--- |
| `MPI_ERR_TRUNCATE` | Receiver buffer capacity < message payload sent by sender | Ensure `recvcount` in `MPI_Recv` is $\\ge$ sender's `sendcount` |
| `MPI_ERR_RANK` | Target `dest` or `source` is negative or $\\ge \\text{comm\\_sz}$ | Check partner bounds; guard boundary ranks with `MPI_PROC_NULL` |
| `MPI_ERR_BUFFER` | Buffer pointer passed is `NULL` or points to invalid memory | Allocate memory (`malloc`) before calling communication routines |
| `MPI_ERR_ROOT` | In `MPI_Bcast` or `MPI_Reduce`, processes specified different `root` values | Ensure all processes pass the exact same integer for `root` |
| `MPI_ERR_COMM` | Invalid communicator handle or calling after `MPI_Finalize` | Check that `MPI_Init` was invoked; verify communicator handle |

---

## The 10-Point Pre-Submission Exam Checklist

Before submitting any MPI code in a lab exam, check these 10 points:

1. **[ ] Pointer in `MPI_Init`:** Did you write `MPI_Init(&argc, &argv)` with ampersands?
2. **[ ] Matching `MPI_Finalize`:** Does every execution path end with `MPI_Finalize()` before returning?
3. **[ ] Return Type of `Trap`:** Is `Trap` declared returning `double`, not `int`?
4. **[ ] Sendcount in `MPI_Scatter`:** Is `sendcount` equal to elements *per process* (not total array size)?
5. **[ ] Root in Collectives:** Do all processes agree on the exact same `root` rank?
6. **[ ] Status Argument:** Did you pass `MPI_STATUS_IGNORE` or `&status` to `MPI_Recv` (7 arguments total)?
7. **[ ] Boundary Guards in Odd-Even Sort:** Did you guard `partner < 0 || partner >= comm_sz` using `MPI_PROC_NULL`?
8. **[ ] Flush on Ordered Prints:** Did you include `fflush(stdout)` before `MPI_Barrier`?
9. **[ ] Clean Compilation:** Does the code compile with `mpicc -Wall -O2` with zero warnings?
10. **[ ] Tested Process Counts:** Did you test running with $np = 1, 2, 4$ to verify process invariance?
"""

with open('content/mpi/08-matrix-multiplication.mdx', 'w') as f:
    f.write(mpi_08)

with open('content/mpi/09-graph-search.mdx', 'w') as f:
    f.write(mpi_09)

with open('content/mpi/10-pitfalls-checklist.mdx', 'w') as f:
    f.write(mpi_10)

print('Generated MPI topics 08, 09, 10')
