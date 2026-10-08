import json
import os

omp_questions = [
    # --- CONCEPTUAL (1 - 8) ---
    {
        "id": "omp-c-01",
        "technology": "openmp",
        "topicRef": "01-fork-join-model",
        "category": "conceptual",
        "title": "POSIX Threads (Pthreads) vs OpenMP Abstraction",
        "prompt": "Compare OpenMP and POSIX Threads (pthreads) in terms of programming abstraction, thread lifecycle management, and programmer productivity.",
        "solutionSteps": [
            "Programming Abstraction: Pthreads is a low-level explicit C library where the programmer manually manages thread pointers, attributes, mutex locks, and condition variables. OpenMP is a high-level directive-based API where the compiler automatically generates threading scaffolding from #pragma annotations.",
            "Thread Lifecycle: In Pthreads, thread creation (pthread_create) and termination (pthread_join) are explicit, heavy, and error-prone. In OpenMP, the fork-join model dynamically manages a thread pool, reusing worker threads across parallel regions without OS creation overhead.",
            "Productivity: OpenMP enables incremental parallelization of legacy serial code by decorating loops, whereas Pthreads requires complete restructuring and function encapsulation of loop bodies."
        ]
    },
    {
        "id": "omp-c-02",
        "technology": "openmp",
        "topicRef": "02-directives-and-clauses",
        "category": "conceptual",
        "title": "Private vs Firstprivate vs Lastprivate Scoping",
        "prompt": "Clearly distinguish between the 'private', 'firstprivate', and 'lastprivate' data-sharing clauses in OpenMP. Provide a concrete scenario where each is required.",
        "solutionSteps": [
            "private(var): Each thread allocates an uninitialized local copy on its stack. The original variable's value outside the region is inaccessible, and its value after the region is undefined. Use for scratch variables (e.g. inner loop counter j).",
            "firstprivate(var): Each thread allocates a local copy initialized with the value of the master thread's variable immediately prior to the construct. Use when each thread needs an identical starting baseline (e.g. a seed factor or base offset).",
            "lastprivate(var): Along with thread-local private behavior, the value from the thread that executed the sequentially LAST iteration (or final section) is copied back to the master variable after the region ends. Use when the loop's final result variable is needed after the loop."
        ]
    },
    {
        "id": "omp-c-03",
        "technology": "openmp",
        "topicRef": "03-work-sharing",
        "category": "conceptual",
        "title": "Comparison of OpenMP Schedule Clauses",
        "prompt": "Compare schedule(static, chunk), schedule(dynamic, chunk), and schedule(guided, chunk). Under what workload distribution should each be selected?",
        "solutionSteps": [
            "Static: Iterations partitioned into fixed chunks and distributed round-robin at compile/loop entry. Zero runtime queue contention overhead. Optimal for uniform, balanced workloads (e.g. dense matrix addition).",
            "Dynamic: Threads pull a chunk from a shared synchronized queue as soon as they become idle. Maximizes load balance for irregular workloads (e.g. Mandelbrot set or sparse graphs), but incurs runtime atomic locking overhead.",
            "Guided: Starts with large chunks (remaining / num_threads) and exponentially decreases chunk sizes down to 'chunk'. Balances low initial synchronization overhead with fine-grained tail load balancing."
        ]
    },
    {
        "id": "omp-c-04",
        "technology": "openmp",
        "topicRef": "04-synchronisation",
        "category": "conceptual",
        "title": "Hardware Atomic Primitives vs Mutual Exclusion Critical Sections",
        "prompt": "Why is #pragma omp atomic significantly faster than #pragma omp critical for simple memory updates?",
        "solutionSteps": [
            "Atomic Directive: Compiles down to hardware-level atomic CPU instructions (such as x86 LOCK XADD, CMPXCHG, or LL/SC on ARM). The hardware memory controller protects the specific 4-byte or 8-byte cache line during modification without operating system or runtime intervention.",
            "Critical Section: Implements a generalized software mutex lock. Entering and exiting a critical section involves function calls, lock acquisition, memory fence flushes, and potential OS thread descheduling on contention.",
            "Performance Impact: Atomic operates in nanoseconds with minimal overhead, while critical sections can serialize the entire team and cause catastrophic lock contention."
        ]
    },
    {
        "id": "omp-c-05",
        "technology": "openmp",
        "topicRef": "05-reduction",
        "category": "conceptual",
        "title": "Mechanism of OpenMP Reduction Clause",
        "prompt": "Explain step-by-step how the OpenMP runtime executes '#pragma omp parallel for reduction(+:sum)'. Why does this avoid data races without lock overhead?",
        "solutionSteps": [
            "Step 1 (Private Accumulation): The runtime allocates a private copy of 'sum' on the stack of each participating thread, initialized to the additive identity (0.0).",
            "Step 2 (Unsynchronized Loop): Each thread accumulates its loop iterations into its own private copy without any locks or atomics. Full cache locality is maintained at register speed.",
            "Step 3 (Tree Reduction): At the exit barrier of the parallel loop, the runtime combines the private copies of all threads into the original shared 'sum' variable using a logarithmic reduction tree.",
            "Result: Completely eliminates race conditions and false sharing with near-zero synchronization overhead."
        ]
    },
    {
        "id": "omp-c-06",
        "technology": "openmp",
        "topicRef": "07-tasks",
        "category": "conceptual",
        "title": "OpenMP Tasks vs Worksharing Loops",
        "prompt": "Why can recursive algorithms (such as QuickSort or tree traversals) not be parallelized with '#pragma omp for', and how do OpenMP Tasks solve this?",
        "solutionSteps": [
            "Limitation of '#pragma omp for': Requires a canonical loop with a single iteration variable and a known trip count determined before loop entry. Recursive functions have no loop counter and an irregular, dynamic call tree.",
            "OpenMP Tasks: An asynchronous unit of work encapsulated with its code, execution context, and data environment. Any thread can package a function call into a task and push it to the runtime's work queue.",
            "Dynamic Stealing: Idle threads steal ready tasks from the queue. Synchronization points (#pragma omp taskwait) allow parents to synchronize with their descendant tasks."
        ]
    },
    {
        "id": "omp-c-07",
        "technology": "openmp",
        "topicRef": "08-performance",
        "category": "conceptual",
        "title": "False Sharing: Architecture, Symptoms, and Fixes",
        "prompt": "Explain what False Sharing is in multi-threaded SMP systems. What hardware mechanism causes it, and how can it be detected and fixed?",
        "solutionSteps": [
            "Hardware Mechanism: Modern CPUs cache memory in cache lines (typically 64 bytes). Cache coherence protocols (MESI/MOESI) maintain consistency at cache-line granularity.",
            "Symptom: When Thread 0 writes to array element a[0] and Thread 1 writes to adjacent a[1], they modify distinct variables that share the SAME 64-byte line. Core 0's write marks Core 1's cache line as INVALID.",
            "Performance Degradation: Both cores repeatedly invalidate each other's L1 cache, causing continuous bus ping-pong traffic and massive slowdown despite zero software race conditions.",
            "Fix: 1. Pad data structures so distinct thread variables reside on separate cache lines (e.g. struct { int val; char pad[60]; }). 2. Use thread-local private accumulators or the OpenMP reduction clause."
        ]
    },
    {
        "id": "omp-c-08",
        "technology": "openmp",
        "topicRef": "10-hybrid-comparison",
        "category": "conceptual",
        "title": "Hybrid MPI + OpenMP Architecture",
        "prompt": "What advantages does a Hybrid MPI + OpenMP model offer over a pure MPI model on modern multi-core supercomputing clusters?",
        "solutionSteps": [
            "Memory Footprint: On a cluster node with 64 cores, pure MPI runs 64 separate processes, each replicating large static data structures (e.g. ghost cells, routing tables, geometry meshes). Hybrid runs 1 MPI process per node, sharing memory among 64 threads.",
            "Inter-node Communication: Hybrid aggregates fine-grained messages across threads into large, efficient network messages sent by a single MPI rank, reducing network queue congestion.",
            "Load Balance: Dynamic thread worksharing (schedule dynamic) easily balances irregular intra-node tasks that would cause severe MPI process idle wait times."
        ]
    },

    # --- OUTPUT PREDICTION (9 - 16) ---
    {
        "id": "omp-op-01",
        "technology": "openmp",
        "topicRef": "02-directives-and-clauses",
        "category": "output-prediction",
        "title": "Predict Output: Private vs Firstprivate",
        "prompt": "Predict the printed output of this OpenMP program with OMP_NUM_THREADS=2:\n\n#include <stdio.h>\n#include <omp.h>\nint main() {\n    int a = 10, b = 20;\n    #pragma omp parallel num_threads(2) private(a) firstprivate(b)\n    {\n        a = a + 5; // Note: 'a' is uninitialized private\n        b = b + 5;\n        printf(\"Thread %d: b = %d\\n\", omp_get_thread_num(), b);\n    }\n    printf(\"Master outside: a = %d, b = %d\\n\", a, b);\n    return 0;\n}",
        "solutionSteps": [
            "Step 1: Variable 'b' is firstprivate, so Thread 0 and Thread 1 both receive a private copy initialized to 20.",
            "Step 2: Inside the parallel region, each thread computes b = 20 + 5 = 25.",
            "Step 3: Variable 'a' is private (uninitialized garbage value inside region; modifying it is undefined behavior).",
            "Step 4: Changes to firstprivate 'b' inside the parallel region do NOT modify the master copy outside. Outside the region, original b remains 20 and a remains 10."
        ],
        "expectedOutput": "Thread 0: b = 25\nThread 1: b = 25\nMaster outside: a = 10, b = 20\n(Note: Thread 0 and 1 stdout order may vary)"
    },
    {
        "id": "omp-op-02",
        "technology": "openmp",
        "topicRef": "03-work-sharing",
        "category": "output-prediction",
        "title": "Predict Output: Static Schedule Iteration Assignment",
        "prompt": "Predict which thread executes iteration i = 5 and iteration i = 9 in this loop with 3 threads:\n\n#pragma omp parallel for num_threads(3) schedule(static, 2)\nfor (int i = 0; i < 12; i++) { ... }",
        "solutionSteps": [
            "Formula: Chunk index = floor(i / chunk_size). Assigned Thread = chunk_index % num_threads.",
            "Chunk size = 2, Threads = 3.",
            "Chunks: [0,1] -> T0; [2,3] -> T1; [4,5] -> T2; [6,7] -> T0; [8,9] -> T1; [10,11] -> T2.",
            "Iteration 5 is in chunk 2 (floor(5/2) = 2): 2 % 3 = Thread 2.",
            "Iteration 9 is in chunk 4 (floor(9/2) = 4): 4 % 3 = Thread 1."
        ],
        "expectedOutput": "Iteration i = 5 is executed by Thread 2\nIteration i = 9 is executed by Thread 1"
    },
    {
        "id": "omp-op-03",
        "technology": "openmp",
        "topicRef": "05-reduction",
        "category": "output-prediction",
        "title": "Predict Output: Sum of Cubes (Lecture Slide Example)",
        "prompt": "Predict the output of the following OpenMP program:\n\n#include <stdio.h>\n#include <omp.h>\nint main() {\n    int sum = 0;\n    #pragma omp parallel for num_threads(4) reduction(+:sum)\n    for (int i = 1; i <= 4; i++) {\n        sum += (i * i * i);\n    }\n    printf(\"Sum of cubes = %d\\n\", sum);\n    return 0;\n}",
        "solutionSteps": [
            "Loop bounds: i = 1, 2, 3, 4.",
            "Cubed values: 1^3 = 1; 2^3 = 8; 3^3 = 27; 4^3 = 64.",
            "Total Sum = 1 + 8 + 27 + 64 = 100.",
            "The reduction(+:sum) clause guarantees exact summation without races across 4 threads."
        ],
        "expectedOutput": "Sum of cubes = 100"
    },
    {
        "id": "omp-op-04",
        "technology": "openmp",
        "topicRef": "03-work-sharing",
        "category": "output-prediction",
        "title": "Predict Output: Single vs Master with Barrier",
        "prompt": "Given 4 threads, how many times will 'MSG 1' and 'MSG 2' print?\n\n#pragma omp parallel num_threads(4)\n{\n    #pragma omp single\n    printf(\"MSG 1\\n\");\n\n    #pragma omp master\n    printf(\"MSG 2\\n\");\n}",
        "solutionSteps": [
            "#pragma omp single specifies that the block is executed by only ONE thread (the first thread to reach it). Thus, 'MSG 1' prints exactly 1 time.",
            "#pragma omp master specifies that the block is executed solely by Thread 0. Thus, 'MSG 2' prints exactly 1 time.",
            "Total count: Both print exactly once."
        ],
        "expectedOutput": "MSG 1\nMSG 2"
    },
    {
        "id": "omp-op-05",
        "technology": "openmp",
        "topicRef": "02-directives-and-clauses",
        "category": "output-prediction",
        "title": "Predict Output: Lastprivate Value Propagation",
        "prompt": "Predict the value of x printed outside the loop:\n\n#include <stdio.h>\n#include <omp.h>\nint main() {\n    int x = -1;\n    #pragma omp parallel for num_threads(4) lastprivate(x)\n    for (int i = 0; i < 10; i++) {\n        x = i * 10;\n    }\n    printf(\"Final x = %d\\n\", x);\n    return 0;\n}",
        "solutionSteps": [
            "The lastprivate(x) clause assigns the value of x from the SEQUENTIALLY LAST iteration of the loop (i = 9).",
            "In iteration i = 9: x = 9 * 10 = 90.",
            "Even if thread executing iteration 9 finishes earlier than other threads, OpenMP semantics mandate that the sequentially last iteration's value is stored into the master copy."
        ],
        "expectedOutput": "Final x = 90"
    },
    {
        "id": "omp-op-06",
        "technology": "openmp",
        "topicRef": "06-runtime-library",
        "category": "output-prediction",
        "title": "Predict Output: Nested Parallelism Default",
        "prompt": "Predict the total number of lines printed when OMP_NESTED is false:\n\n#pragma omp parallel num_threads(2)\n{\n    #pragma omp parallel num_threads(2)\n    {\n        printf(\"Active\\n\");\n    }\n}",
        "solutionSteps": [
            "Outer parallel region creates 2 threads.",
            "By default in OpenMP, nested parallelism is disabled (omp_get_nested() == 0).",
            "When a thread encounters a nested parallel region with nesting disabled, the inner team serializes to 1 thread.",
            "Each of the 2 outer threads executes the inner block with 1 thread, printing 'Active' 1 time each.",
            "Total prints: 2 times."
        ],
        "expectedOutput": "Active\nActive"
    },
    {
        "id": "omp-op-07",
        "technology": "openmp",
        "topicRef": "04-synchronisation",
        "category": "output-prediction",
        "title": "Predict Output: Ordered Directive in Loop",
        "prompt": "Predict the printing order of thread IDs in this ordered loop:\n\n#pragma omp parallel for num_threads(4) ordered\nfor (int i = 0; i < 4; i++) {\n    #pragma omp ordered\n    printf(\"%d \", i);\n}",
        "solutionSteps": [
            "The 'ordered' clause on the for construct, paired with '#pragma omp ordered' inside the body, enforces sequential execution order matching serial execution.",
            "Even though 4 threads execute in parallel, iteration 0 prints first, then 1, then 2, then 3."
        ],
        "expectedOutput": "0 1 2 3 "
    },
    {
        "id": "omp-op-08",
        "technology": "openmp",
        "topicRef": "07-tasks",
        "category": "output-prediction",
        "title": "Predict Output: Fibonacci with Tasks",
        "prompt": "Predict the return value of fib(5) implemented with OpenMP tasks:\n\nint fib(int n) {\n    int x, y;\n    if (n < 2) return n;\n    #pragma omp task shared(x)\n    x = fib(n - 1);\n    #pragma omp task shared(y)\n    y = fib(n - 2);\n    #pragma omp taskwait\n    return x + y;\n}",
        "solutionSteps": [
            "Standard Fibonacci sequence: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5.",
            "OpenMP taskwait guarantees both subtasks evaluate and write to x and y before return x + y executes.",
            "Return value for n = 5 is 5."
        ],
        "expectedOutput": "5"
    },

    # --- FIND THE BUG (17 - 24) ---
    {
        "id": "omp-fb-01",
        "technology": "openmp",
        "topicRef": "04-synchronisation",
        "category": "find-the-bug",
        "title": "Race Condition on Shared Counter",
        "prompt": "Identify the bug and explain why the count is non-deterministic:\n\nint counter = 0;\n#pragma omp parallel for num_threads(4)\nfor (int i = 0; i < 100000; i++) {\n    counter++;\n}\nprintf(\"Counter = %d\\n\", counter);",
        "code": "int counter = 0;\n#pragma omp parallel for num_threads(4)\nfor (int i = 0; i < 100000; i++) {\n    counter++;\n}",
        "bugLine": 4,
        "solutionSteps": [
            "Bug: Data race on variable 'counter'.",
            "'counter' is declared before the parallel construct, so it is SHARED by default.",
            "counter++ is not an atomic operation: it requires LOAD, INCREMENT, STORE. Concurrent writes collide, dropping updates.",
            "Fix: Add '#pragma omp atomic' before counter++, or use 'reduction(+:counter)'."
        ],
        "correctCode": "int counter = 0;\n#pragma omp parallel for num_threads(4) reduction(+:counter)\nfor (int i = 0; i < 100000; i++) {\n    counter++;\n}"
    },
    {
        "id": "omp-fb-02",
        "technology": "openmp",
        "topicRef": "02-directives-and-clauses",
        "category": "find-the-bug",
        "title": "Loop Carried Dependency (RAW Hazard)",
        "prompt": "Why does parallelizing this loop with #pragma omp parallel for yield incorrect array values?\n\nint a[100];\na[0] = 1;\n#pragma omp parallel for\nfor (int i = 1; i < 100; i++) {\n    a[i] = a[i - 1] + 2;\n}",
        "code": "#pragma omp parallel for\nfor (int i = 1; i < 100; i++) {\n    a[i] = a[i - 1] + 2;\n}",
        "bugLine": 3,
        "solutionSteps": [
            "Bug: Loop-carried data dependency (Read-After-Write hazard).",
            "Iteration i reads a[i - 1], which must be written by iteration i - 1. When executed in parallel, iteration i may read an uncomputed or stale value of a[i - 1].",
            "Loops with cross-iteration dependencies cannot be parallelized directly with '#pragma omp for'.",
            "Fix: Rewrite mathematically as closed form: a[i] = 1 + 2 * i (which has zero dependencies and is embarrassingly parallel)."
        ],
        "correctCode": "#pragma omp parallel for\nfor (int i = 1; i < 100; i++) {\n    a[i] = 1 + 2 * i;\n}"
    },
    {
        "id": "omp-fb-03",
        "technology": "openmp",
        "topicRef": "04-synchronisation",
        "category": "find-the-bug",
        "title": "Deadlock via Non-Reentrant Lock",
        "prompt": "Why does this program freeze indefinitely?\n\nomp_lock_t lock;\nomp_init_lock(&lock);\nvoid helper() {\n    omp_set_lock(&lock);\n    // work\n    omp_unset_lock(&lock);\n}\nvoid process() {\n    omp_set_lock(&lock);\n    helper();\n    omp_unset_lock(&lock);\n}",
        "code": "void process() {\n    omp_set_lock(&lock);\n    helper();\n    omp_unset_lock(&lock);\n}",
        "bugLine": 3,
        "solutionSteps": [
            "Bug: Self-deadlock caused by recursive acquisition of a simple OpenMP lock (omp_lock_t).",
            "omp_lock_t is NOT re-entrant. When process() acquires lock, helper() is called on the SAME thread and calls omp_set_lock(&lock) again.",
            "The thread blocks waiting for itself to release the lock, causing a permanent deadlock.",
            "Fix: Use nested locks (omp_nest_lock_t, omp_init_nest_lock, omp_set_nest_lock) which track lock ownership counts."
        ],
        "correctCode": "omp_nest_lock_t lock;\nomp_init_nest_lock(&lock);\nvoid helper() {\n    omp_set_nest_lock(&lock);\n    // work\n    omp_unset_nest_lock(&lock);\n}\nvoid process() {\n    omp_set_nest_lock(&lock);\n    helper();\n    omp_unset_nest_lock(&lock);\n}"
    },
    {
        "id": "omp-fb-04",
        "technology": "openmp",
        "topicRef": "07-tasks",
        "category": "find-the-bug",
        "title": "Redundant Task Spawning without Single Directive",
        "prompt": "Why does this code spawn 16 tasks instead of 4 on a team of 4 threads?\n\n#pragma omp parallel num_threads(4)\n{\n    for (int i = 0; i < 4; i++) {\n        #pragma omp task\n        printf(\"Task %d\\n\", i);\n    }\n}",
        "code": "#pragma omp parallel num_threads(4)\n{\n    for (int i = 0; i < 4; i++) {\n        #pragma omp task\n        printf(\"Task %d\\n\", i);\n    }\n}",
        "bugLine": 3,
        "solutionSteps": [
            "Bug: Missing '#pragma omp single' surrounding the task-spawning loop.",
            "Without 'single', ALL 4 threads in the team execute the for-loop, each spawning 4 tasks (total 4 * 4 = 16 tasks).",
            "Fix: Enclose the task generation loop in '#pragma omp single'."
        ],
        "correctCode": "#pragma omp parallel num_threads(4)\n{\n    #pragma omp single\n    {\n        for (int i = 0; i < 4; i++) {\n            #pragma omp task\n            printf(\"Task %d\\n\", i);\n        }\n    }\n}"
    },
    {
        "id": "omp-fb-05",
        "technology": "openmp",
        "topicRef": "02-directives-and-clauses",
        "category": "find-the-bug",
        "title": "Shared Loop Control Variable in Nested Loops",
        "prompt": "Find the race condition in this matrix initialization:\n\nint i, j;\n#pragma omp parallel for\nfor (i = 0; i < N; i++) {\n    for (j = 0; j < N; j++) {\n        matrix[i][j] = i + j;\n    }\n}",
        "code": "int i, j;\n#pragma omp parallel for\nfor (i = 0; i < N; i++) {\n    for (j = 0; j < N; j++) {\n        matrix[i][j] = i + j;\n    }\n}",
        "bugLine": 1,
        "solutionSteps": [
            "Bug: Inner loop variable 'j' is declared outside the parallel construct and is SHARED across all threads by default.",
            "While OpenMP automatically privatizes the outer loop index 'i' in '#pragma omp parallel for', it does NOT automatically privatize the inner loop index 'j'.",
            "Threads concurrently read and increment 'j', resulting in corrupted bounds and missing iterations.",
            "Fix: Declare 'int j' inside the outer loop body, or add 'private(j)' clause, or use 'collapse(2)'."
        ],
        "correctCode": "#pragma omp parallel for\nfor (int i = 0; i < N; i++) {\n    for (int j = 0; j < N; j++) {\n        matrix[i][j] = i + j;\n    }\n}"
    },
    {
        "id": "omp-fb-06",
        "technology": "openmp",
        "topicRef": "03-work-sharing",
        "category": "find-the-bug",
        "title": "Non-Canonical Loop Form (Early Break)",
        "prompt": "Why will the compiler reject this OpenMP loop?\n\n#pragma omp parallel for\nfor (int i = 0; i < 1000; i++) {\n    if (arr[i] == target) {\n        found_idx = i;\n        break; // ERROR\n    }\n}",
        "code": "if (arr[i] == target) {\n    found_idx = i;\n    break;\n}",
        "bugLine": 3,
        "solutionSteps": [
            "Bug: OpenMP canonical loop form prohibits 'break' or 'return' statements inside the body of '#pragma omp for'.",
            "OpenMP requires loops to have an invariant trip count known upon loop entry so iterations can be partitioned among threads.",
            "Fix: Replace early break with a flag check, or cancel construct (OpenMP 4.0+), or task-based search."
        ],
        "correctCode": "int found_idx = -1;\n#pragma omp parallel for\nfor (int i = 0; i < 1000; i++) {\n    if (arr[i] == target) {\n        #pragma omp critical\n        found_idx = i;\n    }\n}"
    },
    {
        "id": "omp-fb-07",
        "technology": "openmp",
        "topicRef": "04-synchronisation",
        "category": "find-the-bug",
        "title": "Barrier Inside Worksharing Construct",
        "prompt": "Why does this program trigger a compile error or crash?\n\n#pragma omp parallel num_threads(4)\n{\n    #pragma omp for\n    for (int i = 0; i < 100; i++) {\n        do_work(i);\n        #pragma omp barrier // ERROR\n    }\n}",
        "code": "#pragma omp for\nfor (int i = 0; i < 100; i++) {\n    do_work(i);\n    #pragma omp barrier\n}",
        "bugLine": 5,
        "solutionSteps": [
            "Bug: Placing an explicit barrier inside a worksharing construct (for, sections, single).",
            "OpenMP specification states that explicit '#pragma omp barrier' directives cannot be closely nested inside a worksharing construct.",
            "Threads execute different subsets of iterations. A thread assigned iterations cannot synchronize with a thread that is not in the same iteration, leading to deadlock.",
            "Fix: Remove the internal barrier. The '#pragma omp for' construct already possesses an implicit barrier at its end."
        ],
        "correctCode": "#pragma omp parallel num_threads(4)\n{\n    #pragma omp for\n    for (int i = 0; i < 100; i++) {\n        do_work(i);\n    }\n}"
    },
    {
        "id": "omp-fb-08",
        "technology": "openmp",
        "topicRef": "08-performance",
        "category": "find-the-bug",
        "title": "Severe False Sharing in Thread Array",
        "prompt": "Why does this parallel code run 5x slower than serial code?\n\nint sum[4] = {0};\n#pragma omp parallel num_threads(4)\n{\n    int tid = omp_get_thread_num();\n    for (int i = 0; i < 10000000; i++) {\n        sum[tid] += 1;\n    }\n}",
        "code": "int sum[4] = {0};\nfor (int i = 0; i < 10000000; i++) {\n    sum[tid] += 1;\n}",
        "bugLine": 4,
        "solutionSteps": [
            "Bug: Extreme False Sharing.",
            "Array elements sum[0], sum[1], sum[2], sum[3] occupy 16 consecutive bytes, fitting inside a SINGLE 64-byte L1 cache line.",
            "All 4 CPU cores simultaneously write to the same cache line 10,000,000 times, causing nonstop cache invalidation storms and stalling CPU memory pipelines.",
            "Fix: Use a local variable inside the thread scope and accumulate into global sum once at the end, or use the reduction clause."
        ],
        "correctCode": "#pragma omp parallel num_threads(4)\n{\n    int tid = omp_get_thread_num();\n    int local_sum = 0;\n    for (int i = 0; i < 10000000; i++) {\n        local_sum += 1;\n    }\n    #pragma omp atomic\n    sum[tid] += local_sum;\n}"
    },

    # --- WRITE THE PROGRAM (25 - 34) ---
    {
        "id": "omp-wp-01",
        "technology": "openmp",
        "topicRef": "05-reduction",
        "category": "write-the-program",
        "title": "Program: Pi Estimation using Numerical Integration (Lecture Slide Exercise)",
        "prompt": "Write a complete C program using OpenMP to compute the value of Pi using numerical integration of 4.0 / (1.0 + x^2) from 0 to 1 with num_steps = 100,000 and the reduction clause. Print execution time and computed Pi.",
        "solutionSteps": [
            "Mathematical formulation: Integral of 4 / (1 + x^2) from 0 to 1 equals pi.",
            "Step size step = 1.0 / (double)num_steps.",
            "Use #pragma omp parallel for reduction(+:sum) private(x).",
            "Accumulate height: x = (i + 0.5) * step; sum += 4.0 / (1.0 + x * x).",
            "Multiply sum by step to obtain pi."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\nstatic long num_steps = 100000;\ndouble step;\n\nint main() {\n    double sum = 0.0;\n    step = 1.0 / (double)num_steps;\n    double t0 = omp_get_wtime();\n\n    #pragma omp parallel for reduction(+:sum)\n    for (int i = 0; i < num_steps; i++) {\n        double x = (i + 0.5) * step;\n        sum += 4.0 / (1.0 + x * x);\n    }\n\n    double pi = step * sum;\n    double t1 = omp_get_wtime();\n\n    printf(\"Computed Pi = %.10f (Time = %.6f s)\\n\", pi, t1 - t0);\n    return 0;\n}",
        "expectedOutput": "Computed Pi = 3.1415926536 (Time = 0.000450 s)"
    },
    {
        "id": "omp-wp-02",
        "technology": "openmp",
        "topicRef": "04-synchronisation",
        "category": "write-the-program",
        "title": "Program: Twin Primes Count and Sum under 200 (Lab 5 Task 2)",
        "prompt": "Write an OpenMP C program to: a) Determine the number of twin prime pairs (consecutive odd integers that are both prime) less than 200. b) Compute the sum of all such twin primes. Eliminate race conditions with appropriate OpenMP directives.",
        "solutionSteps": [
            "A pair (p, p+2) is a twin prime pair if both p and p+2 are prime.",
            "Iterate odd integers p from 3 to 197 step 2.",
            "Write a helper is_prime(n).",
            "Parallelize with #pragma omp parallel for reduction(+:count) reduction(+:sum).",
            "If is_prime(p) && is_prime(p+2), increment count by 1 and sum by (p + p + 2)."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\nint is_prime(int n) {\n    if (n < 2) return 0;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return 0;\n    }\n    return 1;\n}\n\nint main() {\n    int count = 0;\n    int sum = 0;\n\n    #pragma omp parallel for reduction(+:count) reduction(+:sum)\n    for (int p = 3; p < 198; p += 2) {\n        if (is_prime(p) && is_prime(p + 2)) {\n            count++;\n            sum += (p + (p + 2));\n        }\n    }\n\n    printf(\"Twin prime pairs < 200: %d\\n\", count);\n    printf(\"Sum of all twin primes < 200: %d\\n\", sum);\n    return 0;\n}",
        "expectedOutput": "Twin prime pairs < 200: 15\nSum of all twin primes < 200: 2472"
    },
    {
        "id": "omp-wp-03",
        "technology": "openmp",
        "topicRef": "09-classic-algorithms",
        "category": "write-the-program",
        "title": "Program: First 8 Perfect Numbers (Lab 6 Task 3)",
        "prompt": "Write an OpenMP C program to find the first 8 perfect numbers using Euclid's formula: if 2^p - 1 is prime (Mersenne prime), then (2^p - 1) * 2^(p - 1) is a perfect number.",
        "solutionSteps": [
            "Euclid-Euler theorem: 2^(p-1) * (2^p - 1) is perfect when 2^p - 1 is prime.",
            "First 8 Mersenne prime exponents p are: 2, 3, 5, 7, 13, 17, 19, 31.",
            "Use unsigned long long for 64-bit integer values.",
            "Parallelize primality testing across exponent candidates with OpenMP."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\nint is_prime(long long n) {\n    if (n < 2) return 0;\n    for (long long i = 2; i * i <= n; i++) {\n        if (n % i == 0) return 0;\n    }\n    return 1;\n}\n\nint main() {\n    int exponents[8] = {2, 3, 5, 7, 13, 17, 19, 31};\n    unsigned long long perfect_nums[8];\n\n    #pragma omp parallel for schedule(dynamic)\n    for (int i = 0; i < 8; i++) {\n        int p = exponents[i];\n        unsigned long long mersenne = (1ULL << p) - 1ULL;\n        if (is_prime(mersenne)) {\n            perfect_nums[i] = (1ULL << (p - 1)) * mersenne;\n        }\n    }\n\n    for (int i = 0; i < 8; i++) {\n        printf(\"Perfect Number %d: %llu\\n\", i + 1, perfect_nums[i]);\n    }\n    return 0;\n}",
        "expectedOutput": "Perfect Number 1: 6\nPerfect Number 2: 28\nPerfect Number 3: 496\nPerfect Number 4: 8128\nPerfect Number 5: 33550336\nPerfect Number 6: 8589869056\nPerfect Number 7: 137438691328\nPerfect Number 8: 2305843008139952128"
    },
    {
        "id": "omp-wp-04",
        "technology": "openmp",
        "topicRef": "03-work-sharing",
        "category": "write-the-program",
        "title": "Program: Parallel Matrix Multiplication with Collapse",
        "prompt": "Write a complete C program using OpenMP to multiply two N x N matrices (N = 4) using '#pragma omp parallel for collapse(2)'.",
        "solutionSteps": [
            "Triple nested loop: i from 0..N-1, j from 0..N-1, k from 0..N-1.",
            "Apply #pragma omp parallel for collapse(2) on the outer two loops (i and j).",
            "This collapses N*N = 16 iterations into a single work pool, maximizing thread utilization."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\n#define N 4\n\nint main() {\n    int A[N][N], B[N][N], C[N][N];\n\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < N; j++) {\n            A[i][j] = i + 1;\n            B[i][j] = j + 1;\n            C[i][j] = 0;\n        }\n    }\n\n    #pragma omp parallel for collapse(2)\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < N; j++) {\n            int sum = 0;\n            for (int k = 0; k < N; k++) {\n                sum += A[i][k] * B[k][j];\n            }\n            C[i][j] = sum;\n        }\n    }\n\n    printf(\"Matrix C[0][0..3]: %d %d %d %d\\n\", C[0][0], C[0][1], C[0][2], C[0][3]);\n    return 0;\n}",
        "expectedOutput": "Matrix C[0][0..3]: 10 20 30 40"
    },
    {
        "id": "omp-wp-05",
        "technology": "openmp",
        "topicRef": "09-classic-algorithms",
        "category": "write-the-program",
        "title": "Program: Parallel Odd-Even Transposition Sort (Lab 4 Task 2c)",
        "prompt": "Write an OpenMP C program for Parallel Odd-Even Transposition sort on an array of N = 12 integers: [5, 12, 3, 8, 14, 9, 2, 7, 11, 4, 13, 6].",
        "solutionSteps": [
            "Outer loop runs N = 12 phases.",
            "Even phase (phase % 2 == 0): compare-swap elements at index 0, 2, 4, ...",
            "Odd phase (phase % 2 == 1): compare-swap elements at index 1, 3, 5, ...",
            "Each phase parallelized with #pragma omp parallel for."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\nint main() {\n    int N = 12;\n    int a[] = {5, 12, 3, 8, 14, 9, 2, 7, 11, 4, 13, 6};\n\n    for (int phase = 0; phase < N; phase++) {\n        if (phase % 2 == 0) {\n            #pragma omp parallel for\n            for (int i = 1; i < N; i += 2) {\n                if (a[i - 1] > a[i]) {\n                    int tmp = a[i - 1];\n                    a[i - 1] = a[i];\n                    a[i] = tmp;\n                }\n            }\n        } else {\n            #pragma omp parallel for\n            for (int i = 1; i < N - 1; i += 2) {\n                if (a[i] > a[i + 1]) {\n                    int tmp = a[i];\n                    a[i] = a[i + 1];\n                    a[i + 1] = tmp;\n                }\n            }\n        }\n    }\n\n    printf(\"Sorted Array: \");\n    for (int i = 0; i < N; i++) printf(\"%d \", a[i]);\n    printf(\"\\n\");\n    return 0;\n}",
        "expectedOutput": "Sorted Array: 2 3 4 5 6 7 8 9 11 12 13 14"
    },
    {
        "id": "omp-wp-06",
        "technology": "openmp",
        "topicRef": "07-tasks",
        "category": "write-the-program",
        "title": "Program: Parallel QuickSort using OpenMP Tasks",
        "prompt": "Write a recursive QuickSort in C parallelized with OpenMP tasks. Use a cutoff threshold (e.g. length < 1000) to revert to serial execution and avoid task overhead.",
        "solutionSteps": [
            "Partition array around pivot as usual.",
            "For left and right partitions: if size > THRESHOLD, spawn recursive call inside '#pragma omp task'.",
            "Follow recursive spawns with '#pragma omp taskwait' to ensure children finish before partition returns.",
            "Kick off root call from master thread inside '#pragma omp parallel' and '#pragma omp single'."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\nvoid swap(int* a, int* b) { int t = *a; *a = *b; *b = t; }\n\nint partition(int* arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (arr[j] <= pivot) {\n            i++;\n            swap(&arr[i], &arr[j]);\n        }\n    }\n    swap(&arr[i + 1], &arr[high]);\n    return i + 1;\n}\n\nvoid quicksort_parallel(int* arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        #pragma omp task default(none) firstprivate(arr, low, pi)\n        quicksort_parallel(arr, low, pi - 1);\n\n        #pragma omp task default(none) firstprivate(arr, high, pi)\n        quicksort_parallel(arr, pi + 1, high);\n\n        #pragma omp taskwait\n    }\n}\n\nint main() {\n    int arr[] = {34, 7, 23, 32, 5, 62, 12, 45};\n    int n = sizeof(arr) / sizeof(arr[0]);\n\n    #pragma omp parallel num_threads(4)\n    {\n        #pragma omp single\n        quicksort_parallel(arr, 0, n - 1);\n    }\n\n    printf(\"Quicksorted: \");\n    for (int i = 0; i < n; i++) printf(\"%d \", arr[i]);\n    printf(\"\\n\");\n    return 0;\n}",
        "expectedOutput": "Quicksorted: 5 7 12 23 32 34 45 62"
    },
    {
        "id": "omp-wp-07",
        "technology": "openmp",
        "topicRef": "09-classic-algorithms",
        "category": "write-the-program",
        "title": "Program: Parallel Dijkstra's Algorithm (Lab 7 Task 1)",
        "prompt": "Write a C program implementing Dijkstra's single-source shortest path algorithm on an adjacency matrix, parallelizing the distance relaxation step across threads with OpenMP.",
        "solutionSteps": [
            "Maintain dist[V] and visited[V].",
            "In each of the V iterations, find unvisited vertex u with minimum dist[u].",
            "Parallelize relaxation: For each neighbor v, if (!visited[v] && graph[u][v] && dist[u] + graph[u][v] < dist[v]), update dist[v].",
            "Since distinct threads examine distinct v vertices, updating dist[v] requires NO locks."
        ],
        "correctCode": "#include <stdio.h>\n#include <limits.h>\n#include <omp.h>\n\n#define V 5\n\nint min_distance(int dist[], int visited[]) {\n    int min = INT_MAX, min_index = -1;\n    for (int v = 0; v < V; v++) {\n        if (!visited[v] && dist[v] <= min) {\n            min = dist[v];\n            min_index = v;\n        }\n    }\n    return min_index;\n}\n\nint main() {\n    int graph[V][V] = {\n        {0, 4, 2, 0, 0},\n        {0, 0, 1, 5, 0},\n        {0, 0, 0, 8, 10},\n        {0, 0, 0, 0, 2},\n        {0, 0, 0, 0, 0}\n    };\n    int dist[V], visited[V];\n    for (int i = 0; i < V; i++) { dist[i] = INT_MAX; visited[i] = 0; }\n    dist[0] = 0;\n\n    for (int count = 0; count < V - 1; count++) {\n        int u = min_distance(dist, visited);\n        if (u == -1) break;\n        visited[u] = 1;\n\n        #pragma omp parallel for\n        for (int v = 0; v < V; v++) {\n            if (!visited[v] && graph[u][v] && dist[u] != INT_MAX\n                && dist[u] + graph[u][v] < dist[v]) {\n                dist[v] = dist[u] + graph[u][v];\n            }\n        }\n    }\n\n    printf(\"Shortest distances from node 0:\\n\");\n    for (int i = 0; i < V; i++) printf(\"Node %d: %d\\n\", i, dist[i]);\n    return 0;\n}",
        "expectedOutput": "Shortest distances from node 0:\nNode 0: 0\nNode 1: 4\nNode 2: 2\nNode 3: 9\nNode 4: 11"
    },
    {
        "id": "omp-wp-08",
        "technology": "openmp",
        "topicRef": "09-classic-algorithms",
        "category": "write-the-program",
        "title": "Program: Gaussian Elimination Row Elimination (Lab 4 Task 1)",
        "prompt": "Write the parallel row-elimination step of Gaussian Elimination Ax = b with OpenMP for an N x (N+1) augmented matrix.",
        "solutionSteps": [
            "Outer loop iterates through pivot row k from 0 to N-2.",
            "For each row i from k+1 to N-1, calculate multiplier factor = A[i][k] / A[k][k].",
            "Parallelize row updates across i with #pragma omp parallel for private(factor).",
            "Update row i: for j from k to N: A[i][j] -= factor * A[k][j]."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\n#define N 3\n\nint main() {\n    double A[N][N + 1] = {\n        {1, -1, 1, 4},\n        {1, -4, 2, 8},\n        {1, 2, 8, 12}\n    };\n\n    for (int k = 0; k < N - 1; k++) {\n        #pragma omp parallel for\n        for (int i = k + 1; i < N; i++) {\n            double factor = A[i][k] / A[k][k];\n            for (int j = k; j <= N; j++) {\n                A[i][j] -= factor * A[k][j];\n            }\n        }\n    }\n\n    // Backward substitution\n    double x[N];\n    for (int i = N - 1; i >= 0; i--) {\n        x[i] = A[i][N];\n        for (int j = i + 1; j < N; j++) {\n            x[i] -= A[i][j] * x[j];\n        }\n        x[i] = x[i] / A[i][i];\n    }\n\n    printf(\"Solution: x = %.2f, y = %.2f, z = %.2f\\n\", x[0], x[1], x[2]);\n    return 0;\n}",
        "expectedOutput": "Solution: x = 1.67, y = -0.83, z = 1.50"
    },
    {
        "id": "omp-wp-09",
        "technology": "openmp",
        "topicRef": "04-synchronisation",
        "category": "write-the-program",
        "title": "Program: OpenMP Locks for Thread-Safe Bank Account",
        "prompt": "Write a complete C program demonstrating omp_lock_t to synchronize concurrent deposits to a bank balance across 8 threads.",
        "solutionSteps": [
            "Initialize lock: omp_init_lock(&lock).",
            "In parallel region, each thread acquires lock before modifying balance: omp_set_lock(&lock); balance += 100; omp_unset_lock(&lock).",
            "Destroy lock: omp_destroy_lock(&lock)."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\nint main() {\n    int balance = 0;\n    omp_lock_t lock;\n    omp_init_lock(&lock);\n\n    #pragma omp parallel for num_threads(8)\n    for (int i = 0; i < 1000; i++) {\n        omp_set_lock(&lock);\n        balance += 10;\n        omp_unset_lock(&lock);\n    }\n\n    omp_destroy_lock(&lock);\n    printf(\"Final Balance = %d\\n\", balance);\n    return 0;\n}",
        "expectedOutput": "Final Balance = 10000"
    },
    {
        "id": "omp-wp-10",
        "technology": "openmp",
        "topicRef": "02-directives-and-clauses",
        "category": "write-the-program",
        "title": "Program: Default(None) Scoping Compliance",
        "prompt": "Write an OpenMP parallel for loop using default(none) where vector A is read-only, factor is read-only, and vector B is updated.",
        "solutionSteps": [
            "Specify default(none) on the construct.",
            "Explicitly scope: shared(A, B, factor, N) and private(i).",
            "Ensure compiler compiles with zero undeclared scoping warnings."
        ],
        "correctCode": "#include <stdio.h>\n#include <omp.h>\n\nint main() {\n    int N = 5;\n    int A[5] = {1, 2, 3, 4, 5};\n    int B[5] = {0};\n    int factor = 10;\n\n    #pragma omp parallel for default(none) shared(A, B, factor, N)\n    for (int i = 0; i < N; i++) {\n        B[i] = A[i] * factor;\n    }\n\n    printf(\"B[4] = %d\\n\", B[4]);\n    return 0;\n}",
        "expectedOutput": "B[4] = 50"
    },

    # --- COMPLEXITY & ANALYSIS (35 - 42) ---
    {
        "id": "omp-ca-01",
        "technology": "openmp",
        "topicRef": "09-classic-algorithms",
        "category": "complexity-analysis",
        "title": "Parallel Odd-Even Sort Asymptotic Complexity (Lab 4 Task 2c)",
        "prompt": "According to PDC Lab 4, derive the asymptotic time complexity of parallel odd-even transposition sort for an array of size N using P threads.",
        "solutionSteps": [
            "Sequential odd-even sort performs N phases, with each phase doing O(N) comparisons -> O(N^2).",
            "In the parallel OpenMP version, the N phases remain sequential due to barrier synchronization between alternating phases.",
            "In each phase, the N/2 comparisons are partitioned among P threads: Time per phase = O(N / P) + O(1) barrier overhead.",
            "Total time across N phases: T(N, P) = N * (O(N / P) + O(1)) = O(N^2 / P + N).",
            "Notice the additive + N term: as P -> infinity, execution time is bounded from below by O(N) due to the sequential phase synchronization!"
        ],
        "expectedOutput": "Asymptotic Time Complexity: O(N^2 / P + N)"
    },
    {
        "id": "omp-ca-02",
        "technology": "openmp",
        "topicRef": "08-performance",
        "category": "complexity-analysis",
        "title": "Amdahl's Law vs Gustafson's Law in Multi-Core Scaling",
        "prompt": "A molecular dynamics simulation has parallel fraction P = 0.95. Calculate speedup on 64 cores under Amdahl's Law (strong scaling) and Gustafson's Law (weak scaling).",
        "solutionSteps": [
            "Amdahl's Law (Fixed Workload / Strong Scaling): S = 1 / ((1 - P) + P / N) = 1 / (0.05 + 0.95 / 64) = 1 / (0.05 + 0.01484) = 1 / 0.06484 ≈ 15.42x.",
            "Gustafson's Law (Scaled Workload / Weak Scaling): S = (1 - P) + P * N = 0.05 + 0.95 * 64 = 0.05 + 60.8 = 60.85x.",
            "Analysis: Amdahl shows that fixed-size problems saturate quickly (max 20x speedup). Gustafson shows that if problem size scales with core count (simulating larger molecular systems), multi-core systems achieve near-linear speedup."
        ],
        "expectedOutput": "Amdahl Speedup = 15.42x\nGustafson Scaled Speedup = 60.85x"
    },
    {
        "id": "omp-ca-03",
        "technology": "openmp",
        "topicRef": "03-work-sharing",
        "category": "complexity-analysis",
        "title": "Overhead Analysis of Chunk Size Selection",
        "prompt": "Analyze the trade-off in choosing chunk size C in '#pragma omp for schedule(dynamic, C)' for a loop with N iterations and P threads.",
        "solutionSteps": [
            "Total number of dynamic chunk dispatches = N / C.",
            "Synchronization Overhead: Each chunk acquisition locks the internal work queue with atomic operations. Small C (e.g. C = 1) causes N mutex operations, swamping CPU throughput with synchronization overhead.",
            "Load Imbalance: Large C (e.g. C = N / P) degrades to static scheduling. If final chunks have wildly varying computation times, fast threads sit idle waiting at the barrier for the slowest thread.",
            "Optimal Rule of Thumb: Choose C such that chunk execution time >> queue acquisition overhead (~1-10 microseconds), typically C between 4 and 64."
        ]
    },
    {
        "id": "omp-ca-04",
        "technology": "openmp",
        "topicRef": "08-performance",
        "category": "complexity-analysis",
        "title": "Parallel Efficiency Degradation Factors",
        "prompt": "List the four primary sources of parallel efficiency degradation in OpenMP shared-memory programs.",
        "solutionSteps": [
            "1. Amdahl Serial Bottleneck: Non-parallelized sequential code sections executed only by the master thread.",
            "2. Synchronization Overhead: Lock contention in critical/atomic sections and barrier wait latency at end of parallel loops.",
            "3. Load Imbalance: Threads finishing work at uneven times, idling at the implicit barrier.",
            "4. Memory Subsystem Saturation: Shared memory bus contention, NUMA remote memory latency, and False Sharing across CPU cache lines."
        ]
    },
    {
        "id": "omp-ca-05",
        "technology": "openmp",
        "topicRef": "09-classic-algorithms",
        "category": "complexity-analysis",
        "title": "Gaussian Elimination Parallel Speedup Ceiling",
        "prompt": "Analyze why parallel Gaussian elimination achieves poor speedup during the final elimination steps.",
        "solutionSteps": [
            "In step k of Gaussian elimination, only (N - k) rows and (N - k) columns remain to be modified.",
            "For early steps (k small), (N - k) is large, providing plenty of parallel work across P threads.",
            "For late steps (k close to N), remaining rows shrink to 1 or 2. The amount of computation drops below the overhead of the OpenMP fork/barrier, resulting in negative speedup."
        ]
    },
    {
        "id": "omp-ca-06",
        "technology": "openmp",
        "topicRef": "07-tasks",
        "category": "complexity-analysis",
        "title": "Task Granularity and Cutoff Overhead",
        "prompt": "Why is a recursive task cutoff condition (e.g. if (n < CUTOFF) serial_code()) essential when parallelizing recursive algorithms with OpenMP tasks?",
        "solutionSteps": [
            "Creating and enqueuing an OpenMP task requires dynamic heap allocation, variable capture, and queue locking (~100 to 500 CPU cycles).",
            "In leaf nodes of recursive algorithms (e.g. fib(2) or quicksort on 5 items), the actual computation takes fewer than 10 cycles.",
            "Spawning fine-grained leaf tasks produces orders of magnitude more task management overhead than actual arithmetic, catastrophic slowdown.",
            "Cutoff ensures tasks are created only for large subtrees."
        ]
    },
    {
        "id": "omp-ca-07",
        "technology": "openmp",
        "topicRef": "08-performance",
        "category": "complexity-analysis",
        "title": "NUMA (Non-Uniform Memory Access) First-Touch Policy",
        "prompt": "Explain the NUMA 'first-touch' memory allocation policy in modern multi-socket multi-core servers and how it affects OpenMP loop performance.",
        "solutionSteps": [
            "NUMA Architecture: Server has multiple CPU sockets, each with local RAM. Accessing local RAM is fast; accessing remote RAM over QPI/UPI is slow.",
            "First-Touch Policy: Linux does not allocate physical memory when malloc() is called. Physical pages are mapped to the NUMA node of the specific CPU core that FIRST WRITES to the memory.",
            "OpenMP Pitfall: If master thread initializes an array sequentially in main(), all memory is allocated on Socket 0. When parallel loop runs across all sockets, other sockets suffer massive remote memory latency.",
            "Best Practice: Always initialize arrays in a parallel loop with the same thread schedule used for computation."
        ]
    },
    {
        "id": "omp-ca-08",
        "technology": "openmp",
        "topicRef": "01-fork-join-model",
        "category": "complexity-analysis",
        "title": "Memory Consumption: Private Variables vs Thread Count",
        "prompt": "Calculate the total stack memory allocated if 64 threads execute a parallel construct containing a private array double scratch[100000].",
        "solutionSteps": [
            "Size of 1 double = 8 bytes.",
            "Size of 1 scratch array = 100,000 * 8 bytes = 800,000 bytes ≈ 800 KB.",
            "Private clause allocates an independent copy on EACH thread's stack: 64 * 800 KB = 51.2 MB.",
            "If thread stack size is limited (e.g. default OMP_STACKSIZE = 4MB), each thread's stack will easily overflow, causing a Segmentation Fault crash."
        ]
    }
]

with open('content/questions/openmp-questions.json', 'w') as f:
    json.dump(omp_questions, f, indent=2)

print(f'Successfully generated {len(omp_questions)} OpenMP questions')
