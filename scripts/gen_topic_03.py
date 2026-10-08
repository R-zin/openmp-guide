import os

# --- 03: Point-to-Point ---
mpi_03 = """---
id: mpi-03-point-to-point
title: Point-to-Point Communication & Deadlock Dynamics
slug: 03-point-to-point
technology: mpi
order: 3
description: Detailed guide to MPI_Send, MPI_Recv, status structures, wildcards, blocking semantics, MPI_Sendrecv, MPI_PROC_NULL, deadlock prevention, and three complete programs.
readingTimeMinutes: 18
sections:
  - id: send-recv-syntax
    title: Signatures and Parameters of Send & Recv
    level: 2
  - id: datatypes-tags
    title: Datatypes, Message Tags, and Status
    level: 2
  - id: wildcards
    title: Wildcard Constants: MPI_ANY_SOURCE & MPI_ANY_TAG
    level: 2
  - id: blocking-protocols
    title: Blocking Semantics: Eager vs Rendezvous Protocol
    level: 2
  - id: sendrecv
    title: Deadlock Elimination with MPI_Sendrecv
    level: 2
  - id: proc-null
    title: The MPI_PROC_NULL Boundary Sentinel
    level: 2
  - id: programs
    title: Complete Programs: Send 42, Ping-Pong, Ring
    level: 2
---

## Signatures and Parameters of Send & Recv

Point-to-point communication allows two processes to exchange messages directly.

### 1. `MPI_Send` (Standard Blocking Send)
```c
int MPI_Send(
    const void*   buf,        /* Pointer to transmit buffer */
    int           count,      /* Number of elements to send */
    MPI_Datatype  datatype,   /* MPI Datatype */
    int           dest,       /* Destination process rank */
    int           tag,        /* Non-negative integer message tag */
    MPI_Comm      comm        /* Communicator handle */
);
```

### 2. `MPI_Recv` (Standard Blocking Receive)
```c
int MPI_Recv(
    void*         buf,        /* Pointer to receive storage buffer */
    int           count,      /* Maximum capacity (number of elements) */
    MPI_Datatype  datatype,   /* Expected MPI Datatype */
    int           source,     /* Origin process rank (or MPI_ANY_SOURCE) */
    int           tag,        /* Expected message tag (or MPI_ANY_TAG) */
    MPI_Comm      comm,       /* Communicator handle */
    MPI_Status*   status      /* Output status structure (or MPI_STATUS_IGNORE) */
);
```

<Diagram type="point-to-point" caption="Direct memory payload transfer from Process A user buffer to Process B receive buffer." />

## Datatypes, Message Tags, and Status

### Standard MPI Datatypes
| C Datatype | MPI Datatype Equivalent |
| :--- | :--- |
| `char` | `MPI_CHAR` |
| `signed int` | `MPI_INT` |
| `long` | `MPI_LONG` |
| `float` | `MPI_FLOAT` |
| `double` | `MPI_DOUBLE` |
| `unsigned int` | `MPI_UNSIGNED` |

### Message Tags
Tags are non-negative integer labels ($0 \\le \\text{tag} \\le \\text{MPI\\_TAG\\_UB}$) that distinguish different categories of messages between the same pair of processes (e.g., tag $0$ for data payload, tag $1$ for termination signals).

### The `MPI_Status` Structure
When receiving messages, the status structure captures transmission metadata:
```c
MPI_Status status;
MPI_Recv(buf, 100, MPI_INT, MPI_ANY_SOURCE, MPI_ANY_TAG, MPI_COMM_WORLD, &status);

int actual_sender = status.MPI_SOURCE;
int actual_tag    = status.MPI_TAG;

/* Query the exact count of received elements */
int received_count;
MPI_Get_count(&status, MPI_INT, &received_count);
```

## Wildcard Constants: MPI_ANY_SOURCE & MPI_ANY_TAG

A receiving process can receive from **any** incoming process or with **any** tag by passing:
- `source = MPI_ANY_SOURCE`
- `tag = MPI_ANY_TAG`

<Callout type="watch-out" title="WILDCARDS ARE RECEIVE-ONLY">
There is NO such thing as `MPI_ANY_DEST` in `MPI_Send`! You can never send to an arbitrary destination. Wildcards are strictly valid only in receive operations.
</Callout>

## Blocking Semantics: Eager vs Rendezvous Protocol

A routine is **blocking** if it does not return until the calling process is free to modify or reuse the buffer passed into the call:

1. **Eager Protocol (Small Payloads, e.g. $< 64\\text{ KB}$):**
   - The MPI library copies your data into an internal system buffer and returns from `MPI_Send` immediately.
   - The program appears non-blocking even if the receiver hasn't called `MPI_Recv`.

2. **Rendezvous Protocol (Large Payloads, e.g. $\\ge 64\\text{ KB}$):**
   - The sender transmits a small handshake envelope.
   - `MPI_Send` **blocks execution** until the destination process actually posts a matching `MPI_Recv` and returns an acknowledgment packet.

<DeadlockSimulator />

## Deadlock Elimination with MPI_Sendrecv

When two processes attempt to send to each other simultaneously, a symmetric send pattern causes permanent deadlock for large payloads:
```c
/* DEADLOCK ON LARGE PAYLOADS: Both block on Send waiting for the other's Recv */
if (rank == 0) {
    MPI_Send(send0, N, MPI_INT, 1, 0, comm);
    MPI_Recv(recv0, N, MPI_INT, 1, 0, comm, MPI_STATUS_IGNORE);
} else if (rank == 1) {
    MPI_Send(send1, N, MPI_INT, 0, 0, comm);
    MPI_Recv(recv1, N, MPI_INT, 0, 0, comm, MPI_STATUS_IGNORE);
}
```

### The Solution: `MPI_Sendrecv`
`MPI_Sendrecv` carries out both a send and receive operation atomically in a single routine:
```c
int MPI_Sendrecv(
    const void* sendbuf, int sendcount, MPI_Datatype sendtype, int dest, int sendtag,
    void* recvbuf, int recvcount, MPI_Datatype recvtype, int source, int recvtag,
    MPI_Comm comm, MPI_Status* status
);
```
The internal MPI engine automatically manages send and receive buffers to guarantee deadlock-free execution.

## The MPI_PROC_NULL Boundary Sentinel

`MPI_PROC_NULL` is a constant dummy rank representing an empty process:
- Calling `MPI_Send` to `MPI_PROC_NULL` returns immediately with `MPI_SUCCESS` without sending anything.
- Calling `MPI_Recv` from `MPI_PROC_NULL` returns immediately without modifying the buffer.
- In pipelines and linear topologies, boundary nodes can set `left = MPI_PROC_NULL` to execute the exact same communication statement as interior processes!

---

## Complete Programs

### Program 1: Send 42 (Point-to-Point Transmission)
```c
#include <stdio.h>
#include <mpi.h>

int main(int argc, char** argv) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    if (size < 2) {
        if (rank == 0) printf("Requires at least 2 processes\\n");
        MPI_Finalize();
        return 0;
    }

    if (rank == 0) {
        int number = 42;
        printf("Rank 0 sending number %d to Rank 1\\n", number);
        MPI_Send(&number, 1, MPI_INT, 1, 0, MPI_COMM_WORLD);
    } else if (rank == 1) {
        int received = 0;
        MPI_Recv(&received, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        printf("Rank 1 received number %d from Rank 0!\\n", received);
    }

    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 send42.c -o send42`
- **Run:** `mpirun -np 2 ./send42`
- **Expected Output:**
```text
Rank 0 sending number 42 to Rank 1
Rank 1 received number 42 from Rank 0!
```

### Program 2: Ping-Pong
```c
#include <stdio.h>
#include <mpi.h>

#define LIMIT 6

int main(int argc, char** argv) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int count = 0;
    int partner = (rank == 0) ? 1 : 0;

    while (count < LIMIT) {
        if (rank == count % 2) {
            count++;
            MPI_Send(&count, 1, MPI_INT, partner, 0, MPI_COMM_WORLD);
            printf("Rank %d sent ping-pong count %d to Rank %d\\n", rank, count, partner);
        } else {
            MPI_Recv(&count, 1, MPI_INT, partner, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
            printf("Rank %d received ping-pong count %d from Rank %d\\n", rank, count, partner);
        }
    }

    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 pingpong.c -o pingpong`
- **Run:** `mpirun -np 2 ./pingpong`

<RingPingPongSimulator />

### Program 3: Ring Topology Token Passing
```c
#include <stdio.h>
#include <mpi.h>

int main(int argc, char** argv) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    int token;
    int next = (rank + 1) % size;
    int prev = (rank - 1 + size) % size;

    if (rank == 0) {
        token = 10;
        printf("Rank 0 starts token = %d, sending to Rank %d\\n", token, next);
        MPI_Send(&token, 1, MPI_INT, next, 0, MPI_COMM_WORLD);
        MPI_Recv(&token, 1, MPI_INT, prev, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        printf("Rank 0 received token = %d back. Ring traversed!\\n", token);
    } else {
        MPI_Recv(&token, 1, MPI_INT, prev, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        token += rank;
        printf("Rank %d received token, updated to %d, forwarding to Rank %d\\n", rank, token, next);
        MPI_Send(&token, 1, MPI_INT, next, 0, MPI_COMM_WORLD);
    }

    MPI_Finalize();
    return 0;
}
```
- **Compile:** `mpicc -O2 ring.c -o ring`
- **Run:** `mpirun -np 4 ./ring`
"""

with open('content/mpi/03-point-to-point.mdx', 'w') as f:
    f.write(mpi_03)

print('Generated content/mpi/03-point-to-point.mdx')
