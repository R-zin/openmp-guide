# Compilation and Execution Verification Log

This document logs the automated sandbox compilation and execution verification for all standalone C programs in this study guide repository.

## Test Environment

- **MPI Compiler & Runtime:** OpenMPI 5.x (`/opt/homebrew/bin/mpicc`, `/opt/homebrew/bin/mpirun`)
- **OpenMP Compiler:** Homebrew LLVM/Clang with OpenMP support (`/opt/homebrew/opt/llvm/bin/clang -fopenmp`)
- **Architecture:** Apple Silicon (macOS Darwin arm64)
- **Total Programs Tested:** 53
- **Programs Passing:** 53
- **Programs Failing:** 0

## Summary Table

| ID | Category | Title | Technology | Status |
| :--- | :--- | :--- | :--- | :--- |
| `mpi-task-1` | Mock Exam (MPI) | Task 1: Circular Token Ring with Boundary Modification | MPI | **PASS** |
| `mpi-task-2` | Mock Exam (MPI) | Task 2: Parallel Trapezoidal Rule Integration with MPI_Reduce | MPI | **PASS** |
| `mpi-task-3` | Mock Exam (MPI) | Task 3: Parallel Odd-Even Transposition Sort with MPI_Sendrecv | MPI | **PASS** |
| `omp-task-1` | Mock Exam (OpenMP) | Task 1: Numerical Pi Estimation with Reduction and False-Sharing Protection | OPENMP | **PASS** |
| `omp-task-2` | Mock Exam (OpenMP) | Task 2: Parallel Twin Primes Counter and Summation (PDC Lab 5) | OPENMP | **PASS** |
| `omp-task-3` | Mock Exam (OpenMP) | Task 3: Parallel Gaussian Elimination with Row Pivoting (PDC Lab 4) | OPENMP | **PASS** |
| `02-foundations_prog5` | Topic Tutorial | 02-foundations snippet #5 | MPI | **PASS** |
| `02-foundations_prog6` | Topic Tutorial | 02-foundations snippet #6 | MPI | **PASS** |
| `03-point-to-point_prog6` | Topic Tutorial | 03-point-to-point snippet #6 | MPI | **PASS** |
| `03-point-to-point_prog7` | Topic Tutorial | 03-point-to-point snippet #7 | MPI | **PASS** |
| `03-point-to-point_prog8` | Topic Tutorial | 03-point-to-point snippet #8 | MPI | **PASS** |
| `04-collectives_prog9` | Topic Tutorial | 04-collectives snippet #9 | MPI | **PASS** |
| `05-data-distributions_prog1` | Topic Tutorial | 05-data-distributions snippet #1 | MPI | **PASS** |
| `06-trapezoidal-rule_prog3` | Topic Tutorial | 06-trapezoidal-rule snippet #3 | MPI | **PASS** |
| `06-trapezoidal-rule_prog4` | Topic Tutorial | 06-trapezoidal-rule snippet #4 | MPI | **PASS** |
| `07-odd-even-sort_prog5` | Topic Tutorial | 07-odd-even-sort snippet #5 | MPI | **PASS** |
| `08-matrix-multiplication_prog1` | Topic Tutorial | 08-matrix-multiplication snippet #1 | MPI | **PASS** |
| `08-matrix-multiplication_prog2` | Topic Tutorial | 08-matrix-multiplication snippet #2 | MPI | **PASS** |
| `09-graph-search_prog2` | Topic Tutorial | 09-graph-search snippet #2 | MPI | **PASS** |
| `01-fork-join-model_prog2` | Topic Tutorial | 01-fork-join-model snippet #2 | OPENMP | **PASS** |
| `02-directives-and-clauses_prog6` | Topic Tutorial | 02-directives-and-clauses snippet #6 | OPENMP | **PASS** |
| `03-work-sharing_prog5` | Topic Tutorial | 03-work-sharing snippet #5 | OPENMP | **PASS** |
| `04-synchronisation_prog5` | Topic Tutorial | 04-synchronisation snippet #5 | OPENMP | **PASS** |
| `05-reduction_prog2` | Topic Tutorial | 05-reduction snippet #2 | OPENMP | **PASS** |
| `05-reduction_prog3` | Topic Tutorial | 05-reduction snippet #3 | OPENMP | **PASS** |
| `06-runtime-library_prog9` | Topic Tutorial | 06-runtime-library snippet #9 | OPENMP | **PASS** |
| `07-tasks_prog3` | Topic Tutorial | 07-tasks snippet #3 | OPENMP | **PASS** |
| `09-classic-algorithms_prog1` | Topic Tutorial | 09-classic-algorithms snippet #1 | OPENMP | **PASS** |
| `09-classic-algorithms_prog2` | Topic Tutorial | 09-classic-algorithms snippet #2 | OPENMP | **PASS** |
| `09-classic-algorithms_prog3` | Topic Tutorial | 09-classic-algorithms snippet #3 | OPENMP | **PASS** |
| `09-classic-algorithms_prog4` | Topic Tutorial | 09-classic-algorithms snippet #4 | OPENMP | **PASS** |
| `10-hybrid-comparison_prog2` | Topic Tutorial | 10-hybrid-comparison snippet #2 | HYBRID | **PASS** |
| `mpi_mpi-wp-01` | MPI Question (write-the-program) | Program: Barrier-Ordered Sequential Output | MPI | **PASS** |
| `mpi_mpi-wp-02` | MPI Question (write-the-program) | Program: Ping-Pong Communication | MPI | **PASS** |
| `mpi_mpi-wp-03` | MPI Question (write-the-program) | Program: Ring Topology Token Passing | MPI | **PASS** |
| `mpi_mpi-wp-04` | MPI Question (write-the-program) | Program: Trapezoidal Rule with MPI_Reduce (Lab 9 Task 1) | MPI | **PASS** |
| `mpi_mpi-wp-05` | MPI Question (write-the-program) | Program: Parallel Vector Addition using MPI_Scatter and MPI_Gather | MPI | **PASS** |
| `mpi_mpi-wp-06` | MPI Question (write-the-program) | Program: Parallel Odd-Even Transposition Sort (Lab 9 Task 2) | MPI | **PASS** |
| `mpi_mpi-wp-07` | MPI Question (write-the-program) | Program: Row-Striped Matrix-Vector Multiplication | MPI | **PASS** |
| `mpi_mpi-wp-08` | MPI Question (write-the-program) | Program: Parallel Level-Synchronous BFS Traversal (Lab 10) | MPI | **PASS** |
| `mpi_mpi-wp-09` | MPI Question (write-the-program) | Program: Text Print with Rank ID (Lab 8 Task 1) | MPI | **PASS** |
| `mpi_mpi-wp-10` | MPI Question (write-the-program) | Program: Non-Blocking Isend/Irecv with Waitall | MPI | **PASS** |
| `omp_omp-wp-01` | OpenMP Question (write-the-program) | Program: Pi Estimation using Numerical Integration (Lecture Slide Exercise) | OPENMP | **PASS** |
| `omp_omp-wp-02` | OpenMP Question (write-the-program) | Program: Twin Primes Count and Sum under 200 (Lab 5 Task 2) | OPENMP | **PASS** |
| `omp_omp-wp-03` | OpenMP Question (write-the-program) | Program: First 8 Perfect Numbers (Lab 6 Task 3) | OPENMP | **PASS** |
| `omp_omp-wp-04` | OpenMP Question (write-the-program) | Program: Parallel Matrix Multiplication with Collapse | OPENMP | **PASS** |
| `omp_omp-wp-05` | OpenMP Question (write-the-program) | Program: Parallel Odd-Even Transposition Sort (Lab 4 Task 2c) | OPENMP | **PASS** |
| `omp_omp-wp-06` | OpenMP Question (write-the-program) | Program: Parallel QuickSort using OpenMP Tasks | OPENMP | **PASS** |
| `omp_omp-wp-07` | OpenMP Question (write-the-program) | Program: Parallel Dijkstra's Algorithm (Lab 7 Task 1) | OPENMP | **PASS** |
| `omp_omp-wp-08` | OpenMP Question (write-the-program) | Program: Gaussian Elimination Row Elimination (Lab 4 Task 1) | OPENMP | **PASS** |
| `omp_omp-wp-09` | OpenMP Question (write-the-program) | Program: OpenMP Locks for Thread-Safe Bank Account | OPENMP | **PASS** |
| `omp_omp-wp-10` | OpenMP Question (write-the-program) | Program: Default(None) Scoping Compliance | OPENMP | **PASS** |
| `vector_add` | Topic Tutorial | Vector Addition with OpenMP SIMD & 64-byte Alignment | VECTORS | **PASS** |

## Detailed Execution Logs

### `mpi-task-1`: Task 1: Circular Token Ring with Boundary Modification

- **Category:** Mock Exam (MPI)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi-task-1.c -o sandbox/mpi-task-1.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi-task-1.out`

**Observed Output:**
```text
Rank 0 starting token = 50, sending to Rank 1
Rank 1 received 50, updated to 51, sending to Rank 2
Rank 2 received 51, updated to 53, sending to Rank 3
Rank 3 received 53, updated to 56, sending to Rank 0
Ring complete! Final token at Rank 0 = 56
```

---

### `mpi-task-2`: Task 2: Parallel Trapezoidal Rule Integration with MPI_Reduce

- **Category:** Mock Exam (MPI)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi-task-2.c -o sandbox/mpi-task-2.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi-task-2.out`

**Observed Output:**
```text
Root Rank 3 (MAX rank) Result: Estimated = 10.000000 (Exact = 10.000000)
Execution Time = 0.001688 seconds
```

---

### `mpi-task-3`: Task 3: Parallel Odd-Even Transposition Sort with MPI_Sendrecv

- **Category:** Mock Exam (MPI)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi-task-3.c -o sandbox/mpi-task-3.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi-task-3.out`

**Observed Output:**
```text
Initial Array: 15 29 100 23 -14 45 178 192 246 -118 0 7 1 10 25 34 
Sorted Array:  -118 -14 0 1 7 10 15 23 25 29 34 45 100 178 192 246
```

---

### `omp-task-1`: Task 1: Numerical Pi Estimation with Reduction and False-Sharing Protection

- **Category:** Mock Exam (OpenMP)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp-task-1.c -o sandbox/omp-task-1.out -lm`
- **Run Command:** `sandbox/omp-task-1.out`

**Observed Output:**
```text
Computed Pi = 3.1415926536 (Error = 0.0000000000)
Execution Time = 0.004460 seconds
```

---

### `omp-task-2`: Task 2: Parallel Twin Primes Counter and Summation (PDC Lab 5)

- **Category:** Mock Exam (OpenMP)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp-task-2.c -o sandbox/omp-task-2.out -lm`
- **Run Command:** `sandbox/omp-task-2.out`

**Observed Output:**
```text
Twin prime pairs < 200: 15
Sum of all twin primes < 200: 2624
```

---

### `omp-task-3`: Task 3: Parallel Gaussian Elimination with Row Pivoting (PDC Lab 4)

- **Category:** Mock Exam (OpenMP)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp-task-3.c -o sandbox/omp-task-3.out -lm`
- **Run Command:** `sandbox/omp-task-3.out`

**Observed Output:**
```text
Solution vector:
x = 1.666667 (5/3 = 1.666667)
y = -0.833333 (-5/6 = -0.833333)
z = 1.500000 (3/2 = 1.500000)
Elapsed Time = 0.000198 seconds
```

---

### `02-foundations_prog5`: 02-foundations snippet #5

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/02-foundations_prog5.c -o sandbox/02-foundations_prog5.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/02-foundations_prog5.out`

**Observed Output:**
```text
Greetings from process rank 1 of 4!
Greetings from process rank 0 of 4!
Greetings from process rank 2 of 4!
Greetings from process rank 3 of 4!
```

---

### `02-foundations_prog6`: 02-foundations snippet #6

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/02-foundations_prog6.c -o sandbox/02-foundations_prog6.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/02-foundations_prog6.out`

**Observed Output:**
```text
Rank 0 of 4 reporting in order
Rank 1 of 4 reporting in order
Rank 2 of 4 reporting in order
Rank 3 of 4 reporting in order
```

---

### `03-point-to-point_prog6`: 03-point-to-point snippet #6

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/03-point-to-point_prog6.c -o sandbox/03-point-to-point_prog6.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/03-point-to-point_prog6.out`

**Observed Output:**
```text
Rank 0 sending number 42 to Rank 1
Rank 1 received number 42 from Rank 0!
```

---

### `03-point-to-point_prog7`: 03-point-to-point snippet #7

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/03-point-to-point_prog7.c -o sandbox/03-point-to-point_prog7.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/03-point-to-point_prog7.out`

**Observed Output:**
```text
Rank 0 sent ping-pong count 1 to Rank 1
Rank 0 received ping-pong count 2 from Rank 1
Rank 0 sent ping-pong count 3 to Rank 1
Rank 1 received ping-pong count 1 from Rank 0
Rank 1 sent ping-pong count 2 to Rank 0
Rank 1 received ping-pong count 3 from Rank 0
Rank 1 sent ping-pong count 4 to Rank 0
Rank 1 received ping-pong count 5 from Rank 0
Rank 1 sent ping-pong count 6 to Rank 0
Rank 0 received ping-pong count 4 from Rank 1
Rank 0 sent ping-pong count 5 to Rank 1
Rank 0 received ping-pong count 6 from Rank 1
```

---

### `03-point-to-point_prog8`: 03-point-to-point snippet #8

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/03-point-to-point_prog8.c -o sandbox/03-point-to-point_prog8.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/03-point-to-point_prog8.out`

**Observed Output:**
```text
Rank 0 starts token = 10, sending to Rank 1
Rank 1 received token, updated to 11, forwarding to Rank 2
Rank 2 received token, updated to 13, forwarding to Rank 3
Rank 3 received token, updated to 16, forwarding to Rank 0
Rank 0 received token = 16 back. Ring traversed!
```

---

### `04-collectives_prog9`: 04-collectives snippet #9

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/04-collectives_prog9.c -o sandbox/04-collectives_prog9.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/04-collectives_prog9.out`

**Observed Output:**
```text
Process 0 scattering array of 12 elements across 4 ranks
Gathered Result at Process 0: 10 20 30 41 51 61 72 82 92 103 113 123
```

---

### `05-data-distributions_prog1`: 05-data-distributions snippet #1

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/05-data-distributions_prog1.c -o sandbox/05-data-distributions_prog1.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/05-data-distributions_prog1.out`

**Observed Output:**
```text
Process 0 initializing vector x (N = 8)...
Process 0 initializing vector y (N = 8)...
Vector Sum z = x + y: 2.0 4.0 6.0 8.0 10.0 12.0 14.0 16.0
```

---

### `06-trapezoidal-rule_prog3`: 06-trapezoidal-rule snippet #3

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/06-trapezoidal-rule_prog3.c -o sandbox/06-trapezoidal-rule_prog3.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/06-trapezoidal-rule_prog3.out`

**Observed Output:**
```text
Point-to-Point Result: Integral = 10.000000 (Exact = 10.000000)
```

---

### `06-trapezoidal-rule_prog4`: 06-trapezoidal-rule snippet #4

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/06-trapezoidal-rule_prog4.c -o sandbox/06-trapezoidal-rule_prog4.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/06-trapezoidal-rule_prog4.out`

**Observed Output:**
```text
MPI_Reduce Result at Max Rank 3: 10.000000 (Exact = 10.000000)
```

---

### `07-odd-even-sort_prog5`: 07-odd-even-sort snippet #5

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/07-odd-even-sort_prog5.c -o sandbox/07-odd-even-sort_prog5.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/07-odd-even-sort_prog5.out`

**Observed Output:**
```text
Sorted Array: -118 -14 0 1 7 10 15 23 25 29 34 45 100 178 192 246
```

---

### `08-matrix-multiplication_prog1`: 08-matrix-multiplication snippet #1

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/08-matrix-multiplication_prog1.c -o sandbox/08-matrix-multiplication_prog1.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/08-matrix-multiplication_prog1.out`

**Observed Output:**
```text
Result Vector y = A * x:
y[0] = 50.0
y[1] = 90.0
y[2] = 130.0
y[3] = 170.0
```

---

### `08-matrix-multiplication_prog2`: 08-matrix-multiplication snippet #2

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/08-matrix-multiplication_prog2.c -o sandbox/08-matrix-multiplication_prog2.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/08-matrix-multiplication_prog2.out`

**Observed Output:**
```text
Process (0, 0) [Rank 0] Result C = 11.0
Process (0, 1) [Rank 1] Result C = 12.0
Process (1, 1) [Rank 3] Result C = 22.0
Process (1, 0) [Rank 2] Result C = 21.0
```

---

### `09-graph-search_prog2`: 09-graph-search snippet #2

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/09-graph-search_prog2.c -o sandbox/09-graph-search_prog2.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/09-graph-search_prog2.out`

**Observed Output:**
```text
Parallel BFS Traversal Order (Starting from 0):
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
Execution Time = 0.004139 seconds
```

---

### `01-fork-join-model_prog2`: 01-fork-join-model snippet #2

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/01-fork-join-model_prog2.c -o sandbox/01-fork-join-model_prog2.out -lm`
- **Run Command:** `sandbox/01-fork-join-model_prog2.out`

**Observed Output:**
```text
Max available threads: 4
Hello from OpenMP thread 3 of 4
Hello from OpenMP thread 0 of 4
Hello from OpenMP thread 2 of 4
Hello from OpenMP thread 1 of 4
Back in sequential master thread execution
```

---

### `02-directives-and-clauses_prog6`: 02-directives-and-clauses snippet #6

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/02-directives-and-clauses_prog6.c -o sandbox/02-directives-and-clauses_prog6.out -lm`
- **Run Command:** `sandbox/02-directives-and-clauses_prog6.out`

**Observed Output:**
```text
Thread 0: shared=100, firstprivate=50, private=0
Thread 2: shared=100, firstprivate=52, private=20
Thread 1: shared=100, firstprivate=51, private=10
Master outside: shared=100, firstprivate=50, private=999
After loop lastprivate_var (from iteration 7) = 70
```

---

### `03-work-sharing_prog5`: 03-work-sharing snippet #5

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/03-work-sharing_prog5.c -o sandbox/03-work-sharing_prog5.out -lm`
- **Run Command:** `sandbox/03-work-sharing_prog5.out`

**Observed Output:**
```text
Thread 0 executed iteration 0
Thread 0 executed iteration 1
Thread 0 executed iteration 8
Thread 0 executed iteration 9
Thread 3 executed iteration 6
Thread 3 executed iteration 7
Thread 1 executed iteration 2
Thread 1 executed iteration 3
Thread 1 executed iteration 10
Thread 1 executed iteration 11
Thread 3 executed iteration 14
Thread 3 executed iteration 15
Thread 2 executed iteration 4
Thread 2 executed iteration 5
Thread 2 executed iteration 12
Thread 2 executed iteration 13
All 16 iterations completed by team!
```

---

### `04-synchronisation_prog5`: 04-synchronisation snippet #5

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/04-synchronisation_prog5.c -o sandbox/04-synchronisation_prog5.out -lm`
- **Run Command:** `sandbox/04-synchronisation_prog5.out`

**Observed Output:**
```text
Target Total Expected: 100000
Unsafe Count (Data Race): 100000 (Lost 0 updates)
Atomic Count (Protected): 100000
Reduction Count (Optimal): 100000
```

---

### `05-reduction_prog2`: 05-reduction snippet #2

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/05-reduction_prog2.c -o sandbox/05-reduction_prog2.out -lm`
- **Run Command:** `sandbox/05-reduction_prog2.out`

**Observed Output:**
```text
Computed Pi = 3.1415926536 (Elapsed Time = 0.000563 s)
```

---

### `05-reduction_prog3`: 05-reduction snippet #3

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/05-reduction_prog3.c -o sandbox/05-reduction_prog3.out -lm`
- **Run Command:** `sandbox/05-reduction_prog3.out`

**Observed Output:**
```text
OpenMP Trapezoidal Result = 10.000000 (Exact = 10.000000)
```

---

### `06-runtime-library_prog9`: 06-runtime-library snippet #9

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/06-runtime-library_prog9.c -o sandbox/06-runtime-library_prog9.out -lm`
- **Run Command:** `sandbox/06-runtime-library_prog9.out`

**Observed Output:**
```text
--- OpenMP Environment Diagnostics ---
Physical CPU Cores Detected: 8
Default Max Threads: 4
Timer Tick Resolution: 0.000001000 seconds
Parallel Region Active! Team Size: 4
Thread 3 executing on core
Thread 0 executing on core
Thread 2 executing on core
Thread 1 executing on core
```

---

### `07-tasks_prog3`: 07-tasks snippet #3

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/07-tasks_prog3.c -o sandbox/07-tasks_prog3.out -lm`
- **Run Command:** `sandbox/07-tasks_prog3.out`

**Observed Output:**
```text
Fibonacci(30) = 832040
```

---

### `09-classic-algorithms_prog1`: 09-classic-algorithms snippet #1

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/09-classic-algorithms_prog1.c -o sandbox/09-classic-algorithms_prog1.out -lm`
- **Run Command:** `sandbox/09-classic-algorithms_prog1.out`

**Observed Output:**
```text
Vector addition completed in 0.001018 seconds (Z[0] = 3.0)
```

---

### `09-classic-algorithms_prog2`: 09-classic-algorithms snippet #2

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/09-classic-algorithms_prog2.c -o sandbox/09-classic-algorithms_prog2.out -lm`
- **Run Command:** `sandbox/09-classic-algorithms_prog2.out`

**Observed Output:**
```text
Matrix mult (256x256) completed in 0.008670 seconds (C[0][0] = 512.0)
```

---

### `09-classic-algorithms_prog3`: 09-classic-algorithms snippet #3

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/09-classic-algorithms_prog3.c -o sandbox/09-classic-algorithms_prog3.out -lm`
- **Run Command:** `sandbox/09-classic-algorithms_prog3.out`

**Observed Output:**
```text
Sorted by OpenMP: 1 5 8 12 23 34 78 99
```

---

### `09-classic-algorithms_prog4`: 09-classic-algorithms snippet #4

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/09-classic-algorithms_prog4.c -o sandbox/09-classic-algorithms_prog4.out -lm`
- **Run Command:** `sandbox/09-classic-algorithms_prog4.out`

**Observed Output:**
```text
Parallel BFS finished in 2 levels. All reachable vertices visited.
```

---

### `10-hybrid-comparison_prog2`: 10-hybrid-comparison snippet #2

- **Category:** Topic Tutorial
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -fopenmp -O2 sandbox/10-hybrid-comparison_prog2.c -o sandbox/10-hybrid-comparison_prog2.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/10-hybrid-comparison_prog2.out`

**Observed Output:**
```text
Hybrid MPI + OpenMP Result: Global Sum = 10000
```

---

### `mpi_mpi-wp-01`: Program: Barrier-Ordered Sequential Output

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-01.c -o sandbox/mpi_mpi-wp-01.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-01.out`

**Observed Output:**
```text
Process 0 of 4 reporting
Process 1 of 4 reporting
Process 2 of 4 reporting
Process 3 of 4 reporting
```

---

### `mpi_mpi-wp-02`: Program: Ping-Pong Communication

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-02.c -o sandbox/mpi_mpi-wp-02.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 2 sandbox/mpi_mpi-wp-02.out`

**Observed Output:**
```text
Rank 0 sent ping_pong_count 1 to Rank 1
Rank 0 received ping_pong_count 2 from Rank 1
Rank 0 sent ping_pong_count 3 to Rank 1
Rank 1 received ping_pong_count 1 from Rank 0
Rank 1 sent ping_pong_count 2 to Rank 0
Rank 1 received ping_pong_count 3 from Rank 0
Rank 1 sent ping_pong_count 4 to Rank 0
Rank 1 received ping_pong_count 5 from Rank 0
Rank 1 sent ping_pong_count 6 to Rank 0
Rank 1 received ping_pong_count 7 from Rank 0
Rank 1 sent ping_pong_count 8 to Rank 0
Rank 0 received ping_pong_count 4 from Rank 1
Rank 0 sent ping_pong_count 5 to Rank 1
Rank 0 received ping_pong_count 6 from Rank 1
Rank 0 sent ping_pong_count 7 to Rank 1
Rank 0 received ping_pong_count 8 from Rank 1
Rank 0 sent ping_pong_count 9 to Rank 1
Rank 0 received ping_pong_count 10 from Rank 1
Rank 1 received ping_pong_count 9 from Rank 0
Rank 1 sent ping_pong_count 10 to Rank 0
```

---

### `mpi_mpi-wp-03`: Program: Ring Topology Token Passing

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-03.c -o sandbox/mpi_mpi-wp-03.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-03.out`

**Observed Output:**
```text
Rank 0 starting token with value 10
Rank 1 received token, added 1 -> now 11, forwarding to 2
Rank 2 received token, added 2 -> now 13, forwarding to 3
Rank 3 received token, added 3 -> now 16, forwarding to 0
Rank 0 received back completed token = 16
```

---

### `mpi_mpi-wp-04`: Program: Trapezoidal Rule with MPI_Reduce (Lab 9 Task 1)

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-04.c -o sandbox/mpi_mpi-wp-04.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-04.out`

**Observed Output:**
```text
Root Rank 3 (MAX rank) Result: Estimated = 10.000000 (Exact = 10.000000)
```

---

### `mpi_mpi-wp-05`: Program: Parallel Vector Addition using MPI_Scatter and MPI_Gather

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-05.c -o sandbox/mpi_mpi-wp-05.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-05.out`

**Observed Output:**
```text
Result Vector Z = X + Y:
Z[0] = 0.0 Z[1] = 3.0 Z[2] = 6.0 Z[3] = 9.0 Z[4] = 12.0 Z[5] = 15.0 Z[6] = 18.0 Z[7] = 21.0
```

---

### `mpi_mpi-wp-06`: Program: Parallel Odd-Even Transposition Sort (Lab 9 Task 2)

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-06.c -o sandbox/mpi_mpi-wp-06.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-06.out`

**Observed Output:**
```text
Sorted Array: -118 -14 0 1 7 10 15 23 25 29 34 45 100 178 192 246
```

---

### `mpi_mpi-wp-07`: Program: Row-Striped Matrix-Vector Multiplication

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-07.c -o sandbox/mpi_mpi-wp-07.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-07.out`

**Observed Output:**
```text
Result vector y = A * x:
y[0] = 50.0
y[1] = 90.0
y[2] = 130.0
y[3] = 170.0
```

---

### `mpi_mpi-wp-08`: Program: Parallel Level-Synchronous BFS Traversal (Lab 10)

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-08.c -o sandbox/mpi_mpi-wp-08.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-08.out`

**Observed Output:**
```text
BFS Level 1 discovered vertices: 1 3 
BFS Level 2 discovered vertices: 2
```

---

### `mpi_mpi-wp-09`: Program: Text Print with Rank ID (Lab 8 Task 1)

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-09.c -o sandbox/mpi_mpi-wp-09.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-09.out`

**Observed Output:**
```text
IIIT-Kottayam Process Rank: 2 of 4
IIIT-Kottayam Process Rank: 0 of 4
IIIT-Kottayam Process Rank: 1 of 4
IIIT-Kottayam Process Rank: 3 of 4
```

---

### `mpi_mpi-wp-10`: Program: Non-Blocking Isend/Irecv with Waitall

- **Category:** MPI Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/bin/mpicc -O2 sandbox/mpi_mpi-wp-10.c -o sandbox/mpi_mpi-wp-10.out -lm`
- **Run Command:** `/opt/homebrew/bin/mpirun --oversubscribe -np 4 sandbox/mpi_mpi-wp-10.out`

**Observed Output:**
```text
Rank 1 received 0 from partner 0
Rank 0 received 100 from partner 1
```

---

### `omp_omp-wp-01`: Program: Pi Estimation using Numerical Integration (Lecture Slide Exercise)

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-01.c -o sandbox/omp_omp-wp-01.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-01.out`

**Observed Output:**
```text
Computed Pi = 3.1415926536 (Time = 0.000294 s)
```

---

### `omp_omp-wp-02`: Program: Twin Primes Count and Sum under 200 (Lab 5 Task 2)

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-02.c -o sandbox/omp_omp-wp-02.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-02.out`

**Observed Output:**
```text
Twin prime pairs < 200: 15
Sum of all twin primes < 200: 2624
```

---

### `omp_omp-wp-03`: Program: First 8 Perfect Numbers (Lab 6 Task 3)

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-03.c -o sandbox/omp_omp-wp-03.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-03.out`

**Observed Output:**
```text
Perfect Number 1: 6
Perfect Number 2: 28
Perfect Number 3: 496
Perfect Number 4: 8128
Perfect Number 5: 33550336
Perfect Number 6: 8589869056
Perfect Number 7: 137438691328
Perfect Number 8: 2305843008139952128
```

---

### `omp_omp-wp-04`: Program: Parallel Matrix Multiplication with Collapse

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-04.c -o sandbox/omp_omp-wp-04.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-04.out`

**Observed Output:**
```text
Matrix C[0][0..3]: 4 8 12 16
```

---

### `omp_omp-wp-05`: Program: Parallel Odd-Even Transposition Sort (Lab 4 Task 2c)

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-05.c -o sandbox/omp_omp-wp-05.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-05.out`

**Observed Output:**
```text
Sorted Array: 2 3 4 5 6 7 8 9 11 12 13 14
```

---

### `omp_omp-wp-06`: Program: Parallel QuickSort using OpenMP Tasks

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-06.c -o sandbox/omp_omp-wp-06.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-06.out`

**Observed Output:**
```text
Quicksorted: 5 7 12 23 32 34 45 62
```

---

### `omp_omp-wp-07`: Program: Parallel Dijkstra's Algorithm (Lab 7 Task 1)

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-07.c -o sandbox/omp_omp-wp-07.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-07.out`

**Observed Output:**
```text
Shortest distances from node 0:
Node 0: 0
Node 1: 4
Node 2: 2
Node 3: 9
Node 4: 11
```

---

### `omp_omp-wp-08`: Program: Gaussian Elimination Row Elimination (Lab 4 Task 1)

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-08.c -o sandbox/omp_omp-wp-08.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-08.out`

**Observed Output:**
```text
Solution: x = 1.67, y = -0.83, z = 1.50
```

---

### `omp_omp-wp-09`: Program: OpenMP Locks for Thread-Safe Bank Account

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-09.c -o sandbox/omp_omp-wp-09.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-09.out`

**Observed Output:**
```text
Final Balance = 10000
```

---

### `omp_omp-wp-10`: Program: Default(None) Scoping Compliance

- **Category:** OpenMP Question (write-the-program)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O2 sandbox/omp_omp-wp-10.c -o sandbox/omp_omp-wp-10.out -lm`
- **Run Command:** `sandbox/omp_omp-wp-10.out`

**Observed Output:**
```text
B[4] = 50
```

---

### `vector_add`: Vector Addition with OpenMP SIMD & 64-byte Alignment

- **Category:** Topic Tutorial (Vectors)
- **Status:** `SUCCESS`
- **Compile Command:** `/opt/homebrew/opt/llvm/bin/clang -fopenmp -O3 sandbox/vector_add.c -o sandbox/vector_add_omp.out`
- **Run Command:** `sandbox/vector_add_omp.out`

**Observed Output:**
```text
Vector Add completed: SUCCESS (c[0] = 3.0, c[N-1] = 3.0)
```

---

## Mathematical Formula Verification Suite

In addition to compiled C code execution, all numerical examples and graph-theoretic formulas from the syllabus lecture slides are validated via the automated Python test suite `scripts/verify_formulas.py`.

### 1. Interconnection Network Graph Metrics
- **3-ary 3-cube ($k=3, d=3$):**
  - Processors $p = 3^3 = 27$
  - Switch degree $d = 2d = 6$
  - Diameter $D = d \cdot \lfloor k/2 \rfloor = 3 \cdot 1 = 3$
  - Bisection width $B_w = 2 \cdot k^{d-1} = 2 \cdot 9 = 18$
  - Channel links $|C| = d \cdot p = 3 \cdot 27 = 81$
  - *Status:* **PASS (All exact matches)**
- **8x8 2D Mesh without wraparound:**
  - Nodes $p = 64$
  - Diameter $D = 2(\sqrt{p}-1) = 2(7) = 14$
  - Bisection width $B_w = \sqrt{p} = 8$
  - Links $|C| = 2(p - \sqrt{p}) = 2(64 - 8) = 112$
  - Degree distribution: 4 corners (deg 2), 24 edges (deg 3), 36 interior (deg 4). Sum of degrees = $4(2) + 24(3) + 36(4) = 8 + 72 + 144 = 224 = 2 \times 112$ (Handshaking lemma verified).
  - *Status:* **PASS**
- **1024-node Hypercube ($d=10$):**
  - Processors $p = 2^{10} = 1024$
  - Diameter $D = 10$, Degree $d = 10$
  - Bisection width $B_w = p/2 = 512$
  - Links $|C| = (p \log_2 p)/2 = (1024 \times 10)/2 = 5120$
  - *Status:* **PASS**

### 2. E-Cube Hypercube XOR Routing
- **Slide Example ($010 \to 111$ in 3-cube):**
  - $010 \oplus 111 = 101_2$ (bits 0 and 2 differ).
  - LSB-first path: $010 \to 011 \to 111$ (2 hops = Hamming distance).
  - *Status:* **PASS**
- **Practice Example ($0110 \to 1011$ in 4-cube):**
  - $0110 \oplus 1011 = 1101_2$ (bits 3, 2, 0 differ).
  - Dimension order path: $0110 \to 1110 \to 1010 \to 1011$ (3 hops = Hamming distance).
  - *Status:* **PASS**

### 3. Gray Code Embeddings
- **Recursive Generation:** Generates valid $n$-bit binary reflected Gray code with strict 1-bit difference across all adjacent steps.
- **Ring into Hypercube:** $N$-node ring mapped along Gray code yields dilation = 1, congestion = 1, expansion = 1.
- **4x4 Mesh into 4-D Hypercube:** Coordinate $(1, 1)$ mapped to $\text{Gray}(1) \parallel \text{Gray}(1) = 0101_2$. All 4-neighbor distances equal 1 bit (dilation = 1).
- *Status:* **PASS**

### 4. Pipelining Speedup & Cycle Calculation
- **3-segment pipeline ($A_i \cdot B_i + C_i$):**
  - $k=3$ segments, $n=7$ tasks: pipelined cycles $= k + n - 1 = 9$ clock cycles.
  - Non-pipelined cycles $= n \times k = 21$ cycles.
  - Speedup $S = 21 / 9 \approx 2.33\times$.
  - *Status:* **PASS**
- **4-segment pipeline for 6 tasks:** $k+n-1 = 4 + 6 - 1 = 9$ cycles.
  - *Status:* **PASS**

### 5. Scaling Laws & Efficiency Metrics
- **Amdahl's Law:** Serial fraction $s=0.1$ asymptotic limit $= 1/s = 10\times$. For $p=64$, speedup $= 8.77\times$.
- **Gustafson's Law:** $s=0.1, p=64 \implies S = 64 - 0.1(63) = 57.7\times$.
- **Karp-Flatt Metric:** $p=8, S=4.0 \implies e = (1/4 - 1/8) / (7/8) = 1/7 \approx 0.1429$ (14.3% serial overhead).
- **Energy-Delay Product (EDP):** System A (100W, 10s $\implies$ 10,000 J$\cdot$s) vs System B (150W, 7s $\implies$ 7,350 J$\cdot$s) proves 26.5% superior EDP efficiency for System B.
- *Status:* **PASS**

### 6. Cannon's Matrix Multiplication
- Partitioning $1024 \times 1024$ on $4 \times 4$ processor grid: local sub-block $256 \times 256$ ($65,536$ elements).
- Initial alignment: Row $i$ shifted left by $i$, Column $j$ shifted up by $j$.
- Shift phases: $\sqrt{p} = 4$ iterations of block multiply and single circular shift.
- *Status:* **PASS**


