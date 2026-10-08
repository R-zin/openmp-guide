import json
import os

mpi_mock = {
    "id": "mock-mpi-exam",
    "technology": "mpi",
    "title": "MOCK LAB EXAM 1: MESSAGE PASSING INTERFACE (MPI)",
    "totalMarks": 50,
    "durationMinutes": 90,
    "instructions": [
        "All code must be written in standard C adhering to MPI-3 specifications.",
        "Include all required headers (<stdio.h>, <stdlib.h>, <mpi.h>).",
        "Every program must compile cleanly with 'mpicc -Wall -O2' without errors or warnings.",
        "Run your programs with 'mpirun -np 4 ./binary'.",
        "Marks will be deducted for race conditions, deadlock vulnerability, uninitialized buffers, or memory leaks."
    ],
    "tasks": [
        {
            "id": "mpi-task-1",
            "title": "Task 1: Circular Token Ring with Boundary Modification",
            "marks": 15,
            "suggestedMinutes": 25,
            "description": "Implement a parallel ring communication topology across P processes (np = 4). Rank 0 initializes a token with value 50. The token is passed sequentially around the ring: Rank 0 sends to Rank 1; Rank 1 adds its rank to the token and forwards to Rank 2; Rank 2 adds its rank and forwards to Rank 3; Rank 3 adds its rank and sends back to Rank 0. Rank 0 prints the final value. The implementation must be provably deadlock-free.",
            "inputSpecification": "No stdin input. Hardcoded initial token = 50.",
            "outputSpecification": "Each process prints: 'Rank <r> received token <val>, updated to <val+r>, forwarding to <next>'. Rank 0 finally prints: 'Ring complete! Final token at Rank 0 = <final>'.",
            "sampleOutput": "Rank 0 starting token = 50, sending to Rank 1\nRank 1 received 50, updated to 51, sending to Rank 2\nRank 2 received 51, updated to 53, sending to Rank 3\nRank 3 received 53, updated to 56, sending to Rank 0\nRing complete! Final token at Rank 0 = 56",
            "rubric": [
                { "criterion": "Correct MPI initialization, rank/size queries, and finalization", "marks": 3 },
                { "criterion": "Correct calculation of predecessor and successor ring neighbors", "marks": 3 },
                { "criterion": "Deadlock avoidance logic (Rank 0 sends first, then receives last)", "marks": 5 },
                { "criterion": "Correct token arithmetic and formatted console reporting", "marks": 4 }
            ],
            "compileCommand": "mpicc -O2 task1_ring.c -o task1_ring",
            "runCommand": "mpirun -np 4 ./task1_ring",
            "referenceCode": """#include <stdio.h>
#include <mpi.h>

int main(int argc, char** argv) {
    int rank, size;
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    if (size < 2) {
        if (rank == 0) printf("Error: Requires at least 2 processes.\\n");
        MPI_Finalize();
        return 1;
    }

    int token = 0;
    int next = (rank + 1) % size;
    int prev = (rank - 1 + size) % size;

    if (rank == 0) {
        token = 50;
        printf("Rank 0 starting token = %d, sending to Rank %d\\n", token, next);
        MPI_Send(&token, 1, MPI_INT, next, 0, MPI_COMM_WORLD);
        MPI_Recv(&token, 1, MPI_INT, prev, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        printf("Ring complete! Final token at Rank 0 = %d\\n", token);
    } else {
        MPI_Recv(&token, 1, MPI_INT, prev, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        int updated = token + rank;
        printf("Rank %d received %d, updated to %d, sending to Rank %d\\n", rank, token, updated, next);
        MPI_Send(&updated, 1, MPI_INT, next, 0, MPI_COMM_WORLD);
    }

    MPI_Finalize();
    return 0;
}""",
            "explanation": "Rank 0 must transmit first to seed the token into the pipeline before blocking on receive. If all processes called MPI_Recv first, circular deadlock occurs. If all called MPI_Send first with large buffers, rendezvous deadlock occurs."
        },
        {
            "id": "mpi-task-2",
            "title": "Task 2: Parallel Trapezoidal Rule Integration with MPI_Reduce",
            "marks": 15,
            "suggestedMinutes": 30,
            "description": "Write a parallel MPI program to approximate the definite integral of f(x) = 2x + 3 over the interval [a, b] = [0.0, 2.0] using the composite trapezoidal rule with n = 1024 trapezoids. Each process computes its local sub-interval integral. Use MPI_Reduce to aggregate results to the root process, where root = size - 1 (the maximum process rank, as required by PDC Lab 9). Measure and report parallel wall-clock execution time using MPI_Wtime().",
            "inputSpecification": "Interval a = 0.0, b = 2.0, n = 1024 trapezoids.",
            "outputSpecification": "Root process prints: Root Rank ID, total calculated integral, exact analytical value (10.000000), and elapsed execution time in seconds.",
            "sampleOutput": "Root Rank 3 (MAX rank) Result: Estimated = 10.000000 (Exact = 10.000000)\nExecution Time = 0.000125 seconds",
            "rubric": [
                { "criterion": "Correct Trapezoid function implementation with proper double return type", "marks": 4 },
                { "criterion": "Correct interval partitioning: local_a and local_b per rank", "marks": 4 },
                { "criterion": "Proper collective aggregation using MPI_Reduce to root = size - 1", "marks": 4 },
                { "criterion": "Accurate timing measurement with MPI_Wtime and output verification", "marks": 3 }
            ],
            "compileCommand": "mpicc -O2 task2_trap.c -o task2_trap",
            "runCommand": "mpirun -np 4 ./task2_trap",
            "referenceCode": """#include <stdio.h>
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
    int rank, size;
    double a = 0.0, b = 2.0;
    int n = 1024;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    double start_time = MPI_Wtime();

    double h = (b - a) / (double)n;
    int local_n = n / size;
    double local_a = a + rank * local_n * h;
    double local_b = local_a + local_n * h;

    double local_integral = Trap(local_a, local_b, local_n, h);
    double total_integral = 0.0;
    int root = size - 1;

    MPI_Reduce(&local_integral, &total_integral, 1, MPI_DOUBLE, MPI_SUM, root, MPI_COMM_WORLD);

    double end_time = MPI_Wtime();

    if (rank == root) {
        printf("Root Rank %d (MAX rank) Result: Estimated = %f (Exact = 10.000000)\\n", root, total_integral);
        printf("Execution Time = %f seconds\\n", end_time - start_time);
    }

    MPI_Finalize();
    return 0;
}""",
            "explanation": "Note the Trap function declaration returning double (not int). Partitioning calculates local_a = a + rank * local_n * h, guaranteeing disjoint coverage of the entire interval."
        },
        {
            "id": "mpi-task-3",
            "title": "Task 3: Parallel Odd-Even Transposition Sort with MPI_Sendrecv",
            "marks": 20,
            "suggestedMinutes": 35,
            "description": "Implement Parallel Odd-Even Transposition Sort on an unsorted array of N = 16 integers across 4 processes. Test array: A = [15, 29, 100, 23, -14, 45, 178, 192, 246, -118, 0, 7, 1, 10, 25, 34]. Process 0 scatters 4 elements to each process. Each process sorts its local array with qsort, executes size = 4 alternating even and odd communication phases using MPI_Sendrecv with Merge-Low and Merge-High, and Process 0 gathers and prints the final sorted array.",
            "inputSpecification": "Predefined 16-element array A distributed equally (4 keys per process).",
            "outputSpecification": "Process 0 prints the initial array and final sorted array.",
            "sampleOutput": "Initial Array: 15 29 100 23 -14 45 178 192 246 -118 0 7 1 10 25 34\nSorted Array:  -118 -14 0 1 7 10 15 23 25 29 34 45 100 178 192 246",
            "rubric": [
                { "criterion": "Correct initial scatter and local sorting via qsort", "marks": 4 },
                { "criterion": "Accurate partner index logic for even and odd phases with boundary checks", "marks": 5 },
                { "criterion": "Correct Merge-Low and Merge-High implementation", "marks": 6 },
                { "criterion": "Deadlock-free communication using MPI_Sendrecv and final gather verification", "marks": 5 }
            ],
            "compileCommand": "mpicc -O2 task3_sort.c -o task3_sort",
            "runCommand": "mpirun -np 4 ./task3_sort",
            "referenceCode": """#include <stdio.h>
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

    if (rank == 0) {
        printf("Initial Array: ");
        for (int i = 0; i < N; i++) printf("%d ", A[i]);
        printf("\\n");
    }

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
        printf("Sorted Array:  ");
        for (int i = 0; i < N; i++) printf("%d ", A[i]);
        printf("\\n");
    }

    free(local);
    free(temp);
    MPI_Finalize();
    return 0;
}""",
            "explanation": "Guarantees global sort in size = 4 phases. MPI_Sendrecv eliminates send-receive ordering race conditions. Partner checks ensure processes with partner < 0 or partner >= size safely idle."
        }
    ]
}

omp_mock = {
    "id": "mock-openmp-exam",
    "technology": "openmp",
    "title": "MOCK LAB EXAM 2: OPEN MULTI-PROCESSING (OPENMP)",
    "totalMarks": 50,
    "durationMinutes": 90,
    "instructions": [
        "All code must be written in standard C conforming to OpenMP 4.5/5.x specifications.",
        "Include <stdio.h>, <stdlib.h>, <omp.h>.",
        "Compile with '-fopenmp -O2 -Wall'.",
        "Verify thread count with OMP_NUM_THREADS (default 4 threads).",
        "All shared variables must be protected against data races using reduction, atomic, or critical directives."
    ],
    "tasks": [
        {
            "id": "omp-task-1",
            "title": "Task 1: Numerical Pi Estimation with Reduction and False-Sharing Protection",
            "marks": 15,
            "suggestedMinutes": 25,
            "description": "Implement parallel numerical integration of 4.0 / (1.0 + x^2) from 0 to 1 with num_steps = 10,000,000. Write two versions: (a) An efficient version using '#pragma omp parallel for reduction(+:sum)', and (b) An analysis comparing performance against a naive array accumulator showing how false sharing occurs if threads write to adjacent array elements.",
            "inputSpecification": "num_steps = 10000000.",
            "outputSpecification": "Display computed Pi, absolute error compared to M_PI, and wall-clock execution time.",
            "sampleOutput": "Computed Pi = 3.1415926536 (Error = 0.0000000000)\nExecution Time = 0.015200 seconds",
            "rubric": [
                { "criterion": "Correct mathematical discretization and step width formulation", "marks": 4 },
                { "criterion": "Correct use of reduction(+:sum) clause without data races", "marks": 5 },
                { "criterion": "Wall-clock timing with omp_get_wtime and precision reporting", "marks": 3 },
                { "criterion": "Code comments explaining false-sharing prevention mechanism", "marks": 3 }
            ],
            "compileCommand": "clang -fopenmp -O2 task1_pi.c -o task1_pi",
            "runCommand": "./task1_pi",
            "referenceCode": """#include <stdio.h>
#include <math.h>
#include <omp.h>

static long num_steps = 10000000;

int main() {
    double step = 1.0 / (double)num_steps;
    double sum = 0.0;

    double t0 = omp_get_wtime();

    #pragma omp parallel for reduction(+:sum)
    for (long i = 0; i < num_steps; i++) {
        double x = (i + 0.5) * step;
        sum += 4.0 / (1.0 + x * x);
    }

    double pi = step * sum;
    double t1 = omp_get_wtime();

    printf("Computed Pi = %.10f (Error = %.10f)\\n", pi, fabs(pi - 3.141592653589793));
    printf("Execution Time = %f seconds\\n", t1 - t0);
    return 0;
}""",
            "explanation": "The reduction clause allocates private accumulators on each thread's stack. Register-level local accumulation completely eliminates cache line bouncing (false sharing)."
        },
        {
            "id": "omp-task-2",
            "title": "Task 2: Parallel Twin Primes Counter and Summation (PDC Lab 5)",
            "marks": 15,
            "suggestedMinutes": 30,
            "description": "Write an OpenMP program to determine: (a) The number of twin prime pairs (consecutive odd integers that are both prime) less than 200, and (b) The sum of all integers comprising these twin prime pairs. You must explicitly identify where race conditions would occur without synchronization and resolve them using OpenMP reduction clauses.",
            "inputSpecification": "Upper bound N = 200.",
            "outputSpecification": "Prints total count of twin prime pairs and sum of all twin prime numbers.",
            "sampleOutput": "Twin prime pairs < 200: 15\nSum of all twin primes < 200: 2472",
            "rubric": [
                { "criterion": "Correct primality test helper function", "marks": 4 },
                { "criterion": "Correct loop bounds examining pairs (p, p+2) for odd p < 200", "marks": 4 },
                { "criterion": "Race condition identification and resolution via reduction clauses", "marks": 5 },
                { "criterion": "Exact matching output with analytical verification", "marks": 2 }
            ],
            "compileCommand": "clang -fopenmp -O2 task2_twin_primes.c -o task2_twin_primes",
            "runCommand": "./task2_twin_primes",
            "referenceCode": """#include <stdio.h>
#include <omp.h>

int is_prime(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}

int main() {
    int count = 0;
    int sum = 0;

    // Parallel loop over all odd candidate pairs
    #pragma omp parallel for schedule(dynamic) reduction(+:count) reduction(+:sum)
    for (int p = 3; p < 198; p += 2) {
        if (is_prime(p) && is_prime(p + 2)) {
            count++;
            sum += (p + (p + 2));
        }
    }

    printf("Twin prime pairs < 200: %d\\n", count);
    printf("Sum of all twin primes < 200: %d\\n", sum);
    return 0;
}""",
            "explanation": "If count and sum were shared without reduction, multiple threads finding twin primes simultaneously would execute unsynchronized read-modify-write cycles, dropping increments."
        },
        {
            "id": "omp-task-3",
            "title": "Task 3: Parallel Gaussian Elimination with Row Pivoting (PDC Lab 4)",
            "marks": 20,
            "suggestedMinutes": 35,
            "description": "Write an OpenMP program in C to solve a system of linear equations Ax = b using Gaussian elimination with row elimination followed by backward substitution. Solve the test case from PDC Lab 4: N = 3 equations: [x - y + z = 4; x - 4y + 2z = 8; x + 2y + 8z = 12]. Expected exact solution: (x, y, z) = (5/3, -5/6, 3/2) ≈ (1.67, -0.83, 1.50).",
            "inputSpecification": "Augmented 3x4 matrix representation.",
            "outputSpecification": "Print solution vector (x, y, z) and execution time.",
            "sampleOutput": "Solution vector:\\nx = 1.666667 (5/3)\\ny = -0.833333 (-5/6)\\nz = 1.500000 (3/2)",
            "rubric": [
                { "criterion": "Correct matrix data setup and augmented matrix initialization", "marks": 3 },
                { "criterion": "Correct parallelization of row multiplier elimination with proper variable scoping", "marks": 7 },
                { "criterion": "Correct backward substitution yielding exact fractions", "marks": 6 },
                { "criterion": "Timing reporting and race condition analysis", "marks": 4 }
            ],
            "compileCommand": "clang -fopenmp -O2 task3_gauss.c -o task3_gauss",
            "runCommand": "./task3_gauss",
            "referenceCode": """#include <stdio.h>
#include <omp.h>

#define N 3

int main() {
    // Augmented matrix [A | b]
    double A[N][N + 1] = {
        {1.0, -1.0, 1.0,  4.0},
        {1.0, -4.0, 2.0,  8.0},
        {1.0,  2.0, 8.0, 12.0}
    };

    double t0 = omp_get_wtime();

    // Gaussian Elimination Phase
    for (int k = 0; k < N - 1; k++) {
        #pragma omp parallel for
        for (int i = k + 1; i < N; i++) {
            double factor = A[i][k] / A[k][k];
            for (int j = k; j <= N; j++) {
                A[i][j] -= factor * A[k][j];
            }
        }
    }

    // Backward Substitution Phase (Sequential)
    double x[N];
    for (int i = N - 1; i >= 0; i--) {
        x[i] = A[i][N];
        for (int j = i + 1; j < N; j++) {
            x[i] -= A[i][j] * x[j];
        }
        x[i] = x[i] / A[i][i];
    }

    double t1 = omp_get_wtime();

    printf("Solution vector:\\n");
    printf("x = %f (5/3 = %.6f)\\n", x[0], 5.0 / 3.0);
    printf("y = %f (-5/6 = %.6f)\\n", x[1], -5.0 / 6.0);
    printf("z = %f (3/2 = %.6f)\\n", x[2], 3.0 / 2.0);
    printf("Elapsed Time = %f seconds\\n", t1 - t0);

    return 0;
}""",
            "explanation": "In row elimination, loop index i represents independent rows being eliminated below pivot row k. Each row i modifies only its own memory cells A[i][j], ensuring data race independence."
        }
    ]
}

with open('content/exams/mpi-mock.json', 'w') as f:
    json.dump(mpi_mock, f, indent=2)

with open('content/exams/openmp-mock.json', 'w') as f:
    json.dump(omp_mock, f, indent=2)

print('Successfully generated mock exams for MPI and OpenMP')
