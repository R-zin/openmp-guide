import os

# --- 04: Collectives ---
mpi_04 = """---
id: mpi-04-collectives
title: Collective Communications & The Chooser Table
slug: 04-collectives
technology: mpi
order: 4
description: Comprehensive analysis of all MPI collective routines (Bcast, Scatter, Gather, Allgather, Alltoall, Reduce, Allreduce, Scan) with formal rules, syntax, and a chooser reference table.
readingTimeMinutes: 16
sections:
  - id: rules
    title: Rules of Collective Communications
    level: 2
  - id: data-movement
    title: Data Movement Collectives: Bcast, Scatter, Gather
    level: 2
  - id: all-collectives
    title: Symmetric Collectives: Allgather and Alltoall
    level: 2
  - id: reductions
    title: Computational Collectives: Reduce, Allreduce, and Scan
    level: 2
  - id: chooser-table
    title: Collective Operations Chooser Reference Table
    level: 2
  - id: complete-code
    title: Complete Program: Scatter, Compute, and Gather
    level: 2
---

## Rules of Collective Communications

Collective communication routines involve **all processes** within a specified communicator. Unlike point-to-point calls, collectives enforce three foundational rules:

1. **Unanimous Participation:** Every process in the communicator must call the collective routine. If one process skips a collective (e.g. inside a rank-specific `if` statement), all other processes will hang waiting at the collective, causing a global deadlock.
2. **Matching Call Order:** Collectives match based strictly on the sequence of calls made within the communicator. All processes must invoke identical collective routines in the exact same programmatic order.
3. **No Message Tags:** Collectives do not take message tags. The order of execution defines the matching context.

<Diagram type="collectives-chooser" caption="Visual taxonomy of the 8 standard MPI collective communication routines." />

## Data Movement Collectives: Bcast, Scatter, Gather

### 1. `MPI_Bcast` (One to All - Duplicate)
Broadcasts an identical data buffer from a designated root process to all other processes in the communicator.
```c
int MPI_Bcast(void* buffer, int count, MPI_Datatype datatype, int root, MPI_Comm comm);
```

### 2. `MPI_Scatter` (One to All - Partition)
Divides a contiguous array held by the root process into equal disjoint chunks and transmits the $i$-th chunk to process rank $i$.
```c
int MPI_Scatter(
    const void* sendbuf, int sendcount, MPI_Datatype sendtype,
    void* recvbuf, int recvcount, MPI_Datatype recvtype,
    int root, MPI_Comm comm
);
```
<Callout type="watch-out" title="SENDCOUNT IS PER-PROCESS">
In `MPI_Scatter`, `sendcount` is the number of elements sent to EACH individual process, NOT the total array size! If scattering an array of 16 elements across 4 processes, `sendcount` must be $4$.
</Callout>

### 3. `MPI_Gather` (All to One - Collect)
The exact inverse of `MPI_Scatter`. Collects equal-sized chunks from all processes and stores them sequentially in rank order inside the root process buffer.
```c
int MPI_Gather(
    const void* sendbuf, int sendcount, MPI_Datatype sendtype,
    void* recvbuf, int recvcount, MPI_Datatype recvtype,
    int root, MPI_Comm comm
);
```

## Symmetric Collectives: Allgather and Alltoall

### 1. `MPI_Allgather` (All to All - Full Array)
Performs an `MPI_Gather` followed immediately by an `MPI_Bcast`. Every process receives the concatenated elements of all processes. No `root` parameter is specified.
```c
int MPI_Allgather(
    const void* sendbuf, int sendcount, MPI_Datatype sendtype,
    void* recvbuf, int recvcount, MPI_Datatype recvtype,
    MPI_Comm comm
);
```

### 2. `MPI_Alltoall` (All to All - Transpose)
The most general data exchange pattern. Process $i$ sends its $j$-th chunk of data to Process $j$. Effectively performs a parallel matrix transposition.
```c
int MPI_Alltoall(
    const void* sendbuf, int sendcount, MPI_Datatype sendtype,
    void* recvbuf, int recvcount, MPI_Datatype recvtype,
    MPI_Comm comm
);
```

## Computational Collectives: Reduce, Allreduce, and Scan

### 1. `MPI_Reduce`
Combines values from all processes using an associative binary operator (e.g. `MPI_SUM`, `MPI_MAX`) and writes the final aggregated result to the `root` process.
```c
int MPI_Reduce(
    const void* sendbuf, void* recvbuf, int count,
    MPI_Datatype datatype, MPI_Op op, int root, MPI_Comm comm
);
```

### Predefined MPI Reduction Operators
| Operator | Function Description |
| :--- | :--- |
| `MPI_SUM` | Arithmetic sum |
| `MPI_PROD` | Arithmetic product |
| `MPI_MAX` | Maximum value |
| `MPI_MIN` | Minimum value |
| `MPI_LAND` | Logical AND |
| `MPI_LOR` | Logical OR |
| `MPI_BAND` | Bitwise AND |
| `MPI_BOR` | Bitwise OR |
| `MPI_MAXLOC` | Maximum value and its rank index |

### 2. `MPI_Allreduce`
Identical to `MPI_Reduce`, but every process in the communicator receives the final reduction result.
```c
int MPI_Allreduce(
    const void* sendbuf, void* recvbuf, int count,
    MPI_Datatype datatype, MPI_Op op, MPI_Comm comm
);
```

### 3. `MPI_Scan` (Prefix Reduction)
Computes an inclusive prefix reduction across processes. Process rank $i$ receives the reduction result of data contributed by processes $0, 1, \\dots, i$.
```c
int MPI_Scan(
    const void* sendbuf, void* recvbuf, int count,
    MPI_Datatype datatype, MPI_Op op, MPI_Comm comm
);
```

---

## Collective Operations Chooser Reference Table

Use this table during lab exams to pick the exact right collective routine for any problem:

| Requirement / Scenario | Input at Root | Output at Root | Output at Other Ranks | Correct MPI Routine |
| :--- | :--- | :--- | :--- | :--- |
| Send identical configuration / parameters to all ranks | Buffer with $M$ items | Unchanged | Exact copy of $M$ items | `MPI_Bcast` |
| Distribute equal slices of an array to each process | Array of $p \\times M$ items | Receives slice 0 | Receives slice $i$ ($M$ items) | `MPI_Scatter` |
| Collect computed slices back to root in order | Receives full array | Array of $p \\times M$ items | Only local slice sent | `MPI_Gather` |
| All processes need the full global array after local work | Array of $M$ items | Concatenated $p \\times M$ items | Concatenated $p \\times M$ items | `MPI_Allgather` |
| Sum / Max / Min reduction needed ONLY by master | Local values | Global scalar result | Unmodified | `MPI_Reduce` |
| Sum / Max / Min reduction needed by EVERY worker | Local values | Global scalar result | Global scalar result | `MPI_Allreduce` |
| Compute running prefix sums across ranks | Local value | Cumulative sum $0..\\text{rank}$ | Cumulative sum $0..\\text{rank}$ | `MPI_Scan` |
| Transpose distributed matrix blocks between all ranks | $p$ blocks of size $M$ | Transposed blocks | Transposed blocks | `MPI_Alltoall` |

---

## Complete Program: Scatter, Compute, and Gather

```c
#include <stdio.h>
#include <stdlib.h>
#include <mpi.h>

#define TOTAL_ELEMENTS 12

int main(int argc, char** argv) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int local_count = TOTAL_ELEMENTS / size;
    int* local_array = (int*)malloc(local_count * sizeof(int));
    int* global_array = NULL;

    if (rank == 0) {
        global_array = (int*)malloc(TOTAL_ELEMENTS * sizeof(int));
        for (int i = 0; i < TOTAL_ELEMENTS; i++) {
            global_array[i] = (i + 1) * 10;
        }
        printf("Process 0 scattering array of %d elements across %d ranks\\n", TOTAL_ELEMENTS, size);
    }

    /* Scatter chunks of local_count elements */
    MPI_Scatter(global_array, local_count, MPI_INT, local_array, local_count, MPI_INT, 0, MPI_COMM_WORLD);

    /* Each process squares its local elements */
    for (int i = 0; i < local_count; i++) {
        local_array[i] = local_array[i] + rank;
    }

    /* Gather modified chunks back to root */
    MPI_Gather(local_array, local_count, MPI_INT, global_array, local_count, MPI_INT, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        printf("Gathered Result at Process 0: ");
        for (int i = 0; i < TOTAL_ELEMENTS; i++) {
            printf("%d ", global_array[i]);
        }
        printf("\\n");
        free(global_array);
    }

    free(local_array);
    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 collectives_demo.c -o collectives_demo`
- **Run:** `mpirun -np 4 ./collectives_demo`
- **Expected Output:**
```text
Process 0 scattering array of 12 elements across 4 ranks
Gathered Result at Process 0: 10 20 30 41 51 61 72 82 92 103 113 123
```
"""

with open('content/mpi/04-collectives.mdx', 'w') as f:
    f.write(mpi_04)

print('Generated content/mpi/04-collectives.mdx')
