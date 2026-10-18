#!/usr/bin/env python3
"""
Generate 25+ solved questions each for Networks, Vectors, and Performance.
Course: CSS 311 Parallel and Distributed Computing (IIIT Kottayam).
"""

import json
import os

# 1. Networks Questions (27 questions)
networks_q = [
    {
        "id": "net-01",
        "technology": "networks",
        "topicRef": "01-introduction",
        "category": "conceptual",
        "title": "Static vs Dynamic Interconnection Networks",
        "prompt": "Define static (direct) and dynamic (indirect) interconnection networks. Give two distinct concrete examples of each and explain how their routing nodes differ.",
        "solutionSteps": [
            "Static (Direct) Networks: Processing nodes are connected directly via point-to-point physical links. Nodes serve dual functions: performing user computation and acting as packet routers for forwarding traffic (e.g. 2-D Mesh, Hypercube, Ring).",
            "Dynamic (Indirect) Networks: Processing nodes and memory modules are connected through an intermediate, active switching fabric composed of separate switching units. Paths are reconfigured dynamically by setting internal switch states (e.g. Crossbar, Multistage Omega Network, Dynamic Fat Tree).",
            "Difference in routing: In static networks, processors themselves forward intermediate messages; in dynamic networks, dedicated hardware switches handle routing while processors remain pure endpoints."
        ],
        "watchOutTip": "Do not confuse dynamic routing algorithms with dynamic network topologies; dynamic networks have separate switch hardware."
    },
    {
        "id": "net-02",
        "technology": "networks",
        "topicRef": "01-introduction",
        "category": "numeric-calculation",
        "title": "Switch Degree and Internal Crosspoint Cost",
        "prompt": "If a crossbar switch is designed with degree d_sw = 16 (16 input ports and 16 output ports), how many internal crosspoints are required? How does cost scale if port count doubles to 32?",
        "solutionSteps": [
            "Internal crosspoint complexity of a full crossbar switch scales as the square of the degree: Cost = d_sw^2.",
            "For d_sw = 16: Crosspoints = 16^2 = 256 crosspoint switches.",
            "If degree doubles to d_sw = 32: Crosspoints = 32^2 = 1024 crosspoints.",
            "Doubling the port count quadruples the hardware crosspoint complexity (4x increase)."
        ]
    },
    {
        "id": "net-03",
        "technology": "networks",
        "topicRef": "02-graph-theoretic-measures",
        "category": "conceptual",
        "title": "Network Diameter and Latency Implication",
        "prompt": "Define network diameter mathematically and explain its significance in relation to communication latency under store-and-forward and wormhole routing.",
        "solutionSteps": [
            "Definition: Network diameter D is the maximum length of the shortest path between any pair of nodes in the network graph: D = max_{u, v} dist(u, v).",
            "Store-and-forward routing latency: T = t_s + (t_w * m) * h. Here, message transmission time is directly proportional to hops h. Diameter defines the worst-case hop count, so low diameter is critical.",
            "Wormhole routing latency: T = t_s + t_w * m + t_h * h. Because flit forwarding delay t_h is tiny, latency is relatively insensitive to diameter, though low diameter still reduces network link contention and buffer occupancy."
        ]
    },
    {
        "id": "net-04",
        "technology": "networks",
        "topicRef": "02-graph-theoretic-measures",
        "category": "conceptual",
        "title": "Bisection Width and Scalability Definition",
        "prompt": "Define bisection width precisely. What mathematical condition must an interconnection network satisfy to be considered bandwidth-scalable?",
        "solutionSteps": [
            "Definition: Bisection width B_w is the minimum number of communication links that must be severed to partition the network into two equal halves of p/2 nodes each.",
            "Bisection bandwidth B = B_w * b (where b is link bandwidth in bytes/sec).",
            "Scalability criterion: An interconnection network is deemed bandwidth-scalable if its bisection width scales at least as Omega(p).",
            "Linear arrays and complete binary trees fail this criterion (B_w = 1), whereas hypercubes (B_w = p/2) and fat trees achieve scalable bisection bandwidth."
        ]
    },
    {
        "id": "net-05",
        "technology": "networks",
        "topicRef": "03-topologies",
        "category": "numeric-calculation",
        "title": "Completely Connected Network for p = 16",
        "prompt": "For a completely connected network with p = 16 nodes, calculate the diameter, bisection width, node degree, and total number of links.",
        "solutionSteps": [
            "Diameter D = 1 (every node connects directly to every other node).",
            "Bisection width B_w = p^2 / 4 = 16^2 / 4 = 256 / 4 = 64 links.",
            "Node degree d = p - 1 = 16 - 1 = 15 channels per node.",
            "Total links |C| = p(p - 1) / 2 = 16 * 15 / 2 = 120 physical communication links."
        ]
    },
    {
        "id": "net-06",
        "technology": "networks",
        "topicRef": "03-topologies",
        "category": "numeric-calculation",
        "title": "Linear Array vs Ring Metrics for p = 10",
        "prompt": "Compare a 10-node linear array and a 10-node ring in terms of diameter, bisection width, and total link count.",
        "solutionSteps": [
            "Linear array: Diameter D = p - 1 = 9 hops; Bisection width B_w = 1; Links |C| = p - 1 = 9 links.",
            "Ring: Diameter D = floor(p / 2) = floor(10 / 2) = 5 hops; Bisection width B_w = 2; Links |C| = p = 10 links.",
            "Adding a single wraparound link reduces diameter from 9 to 5 (nearly 45% reduction) and doubles bisection width from 1 to 2."
        ]
    },
    {
        "id": "net-07",
        "technology": "networks",
        "topicRef": "03-topologies",
        "category": "numeric-calculation",
        "title": "8x8 2-D Mesh Evaluation",
        "prompt": "An 8x8 mesh without wraparound has p = 64 nodes. Determine its diameter, bisection width, total links, and breakdown of node degrees.",
        "solutionSteps": [
            "s = sqrt(p) = 8.",
            "Diameter D = 2(s - 1) = 2(8 - 1) = 14 hops.",
            "Bisection width B_w = s = 8 links.",
            "Total links |C| = 2(p - sqrt(p)) = 2(64 - 8) = 2 * 56 = 112 links.",
            "Degrees: Interior nodes (36 nodes) have degree 4; Edge nodes (24 nodes) have degree 3; Corner nodes (4 nodes) have degree 2."
        ]
    },
    {
        "id": "net-08",
        "technology": "networks",
        "topicRef": "03-topologies",
        "category": "numeric-calculation",
        "title": "8x8 2-D Torus (Wraparound Mesh)",
        "prompt": "For an 8x8 2-D torus (wraparound mesh, p = 64), calculate diameter, bisection width, node degree, and total links.",
        "solutionSteps": [
            "s = sqrt(p) = 8.",
            "Diameter D = 2 * floor(s / 2) = 2 * floor(8 / 2) = 2 * 4 = 8 hops.",
            "Bisection width B_w = 2 * s = 2 * 8 = 16 links.",
            "Node degree d = 4 (symmetric regular graph; all 64 nodes have degree 4).",
            "Total links |C| = 2 * p = 2 * 64 = 128 links."
        ]
    },
    {
        "id": "net-09",
        "technology": "networks",
        "topicRef": "03-topologies",
        "category": "numeric-calculation",
        "title": "10-Dimensional Hypercube Evaluation",
        "prompt": "A cluster uses a 10-dimensional hypercube (d = 10). Calculate the number of processors p, diameter D, bisection width B_w, and total links |C|.",
        "solutionSteps": [
            "Total processors p = 2^d = 2^10 = 1024 nodes.",
            "Diameter D = d = 10 hops.",
            "Node degree = d = 10 links per node.",
            "Bisection width B_w = p / 2 = 1024 / 2 = 512 links.",
            "Total links |C| = (p * d) / 2 = (1024 * 10) / 2 = 5120 links."
        ]
    },
    {
        "id": "net-10",
        "technology": "networks",
        "topicRef": "03-topologies",
        "category": "numeric-calculation",
        "title": "3-ary 3-cube (Wraparound) Metrics",
        "prompt": "A parallel system is organized as a wraparound 3-ary 3-cube (k = 3, d = 3). Compute p, diameter, node degree, bisection width, and total links.",
        "solutionSteps": [
            "p = k^d = 3^3 = 27 nodes.",
            "Diameter D = d * floor(k / 2) = 3 * floor(3 / 2) = 3 * 1 = 3 hops.",
            "Node degree d_node = 2 * d = 2 * 3 = 6 (regular).",
            "Bisection width B_w = 2 * k^(d - 1) = 2 * 3^(3 - 1) = 2 * 9 = 18 links.",
            "Total links |C| = d * p = 3 * 27 = 81 links."
        ]
    },
    {
        "id": "net-11",
        "technology": "networks",
        "topicRef": "03-topologies",
        "category": "numeric-calculation",
        "title": "Complete Binary Tree Diameter Calculation",
        "prompt": "In a complete binary tree with 31 processing nodes placed at all vertices, calculate tree height and network diameter.",
        "solutionSteps": [
            "Total nodes p = 2^k - 1 = 31 => 2^k = 32 => k = 5 levels (depth 0 to 4).",
            "Height of the tree is k - 1 = 4.",
            "Diameter D = 2 * (k - 1) = 2 * 4 = 8 hops (from a leaf on the left subtree, up through the root, down to a leaf on the right subtree).",
            "Formula check: 2 * log2((31 + 1)/2) = 2 * log2(16) = 2 * 4 = 8 hops."
        ]
    },
    {
        "id": "net-12",
        "technology": "networks",
        "topicRef": "03-topologies",
        "category": "compare-and-contrast",
        "title": "Binary Tree vs. Fat Tree Bisection Bottleneck",
        "prompt": "Explain why a simple complete binary tree suffers from a bisection bottleneck and describe how Leiserson's Fat Tree solves it.",
        "solutionSteps": [
            "In a simple binary tree, cutting the two links connected to the root partitions the tree into equal left and right subtrees. The bisection width is B_w = 1 (or 2 depending on root placement).",
            "As node count p scales to thousands, all cross-tree communication traffic must pass through the top-level links, causing severe congestion.",
            "In Leiserson's Fat Tree, link bandwidth increases geometrically as channels ascend toward the root (e.g. doubling at each level or adding parallel switch paths).",
            "This ensures bisection width scales as Omega(p), preventing root saturation."
        ]
    },
    {
        "id": "net-13",
        "technology": "networks",
        "topicRef": "04-metrics-reference-tables",
        "category": "numeric-calculation",
        "title": "Omega Network Stages and Switch Count for p = 32",
        "prompt": "For an Omega multistage network connecting p = 32 inputs to 32 outputs using 2x2 switches, calculate the number of stages and total 2x2 switches required.",
        "solutionSteps": [
            "Number of stages = log2(p) = log2(32) = 5 stages.",
            "Number of switches per stage = p / 2 = 32 / 2 = 16 switches.",
            "Total 2x2 switches = (p / 2) * log2(p) = 16 * 5 = 80 switches."
        ]
    },
    {
        "id": "net-14",
        "technology": "networks",
        "topicRef": "05-routing",
        "category": "numeric-calculation",
        "title": "E-Cube Routing: 010 to 111 in 3-D Hypercube",
        "prompt": "Trace the dimension-order (E-cube) routing path from source node 010 to destination node 111 in a 3-D hypercube. List each intermediate node, bit flipped, and total hops.",
        "solutionSteps": [
            "Source S = 010, Destination D = 111.",
            "Direction vector R = S XOR D = 010 XOR 111 = 101.",
            "Bits set to 1 are bit 0 (dimension 0) and bit 2 (dimension 2). Bit 1 is 0.",
            "Hop 1 (correct dimension 0): Flip bit 0 of 010 -> 011.",
            "Hop 2 (correct dimension 2): Flip bit 2 of 011 -> 111 (destination reached!).",
            "Path: 010 -> 011 -> 111. Total hops = 2 (Hamming distance H(010, 111) = 2)."
        ]
    },
    {
        "id": "net-15",
        "technology": "networks",
        "topicRef": "05-routing",
        "category": "numeric-calculation",
        "title": "E-Cube Routing: 0110 to 1011 in 4-D Hypercube",
        "prompt": "Apply E-cube routing to send a packet from node 0110 to node 1011 in a 4-D hypercube. Provide the complete hop-by-hop node sequence.",
        "solutionSteps": [
            "Source S = 0110, Destination D = 1011.",
            "Direction vector R = 0110 XOR 1011 = 1101.",
            "Bits differing are bit 0, bit 2, and bit 3. Bit 1 is identical (1 in both).",
            "Hop 1 (dimension 0): Flip bit 0 of 0110 -> 0111.",
            "Hop 2 (dimension 2): Flip bit 2 of 0111 -> 0011.",
            "Hop 3 (dimension 3): Flip bit 3 of 0011 -> 1011 (destination reached!).",
            "Path: 0110 -> 0111 -> 0011 -> 1011. Total hops = 3."
        ]
    },
    {
        "id": "net-16",
        "technology": "networks",
        "topicRef": "05-routing",
        "category": "conceptual",
        "title": "Why E-Cube Routing is Deadlock-Free",
        "prompt": "State Dally and Seitz's condition for deadlock-free routing and explain why dimension-order (E-cube) routing is intrinsically immune to deadlock.",
        "solutionSteps": [
            "Dally-Seitz Theorem: A routing function is deadlock-free if and only if there are no cycles in its channel dependency graph (the graph must be a Directed Acyclic Graph - DAG).",
            "In E-cube routing, channels are requested in strictly increasing order of dimension: dimension 0, then 1, then 2, etc.",
            "A packet holding a channel in dimension i will never request a channel in dimension j < i.",
            "Because channel allocations are strictly monotonic, no circular wait can ever form, guaranteeing absolute freedom from deadlock."
        ]
    },
    {
        "id": "net-17",
        "technology": "networks",
        "topicRef": "06-mapping-and-embedding",
        "category": "conceptual",
        "title": "Definitions of Dilation, Congestion, and Expansion",
        "prompt": "Define Dilation, Congestion, and Expansion for graph embedding G(V, E) into G'(V', E'). What are the values for an ideal embedding?",
        "solutionSteps": [
            "Dilation: The maximum length of a path in host graph G' corresponding to any single edge in guest graph G.",
            "Congestion: The maximum number of guest edges in G that share any single physical link in host graph G'.",
            "Expansion: The ratio of the number of nodes in host graph G' to the number of nodes in guest graph G: |V'| / |V|.",
            "Ideal Embedding: Dilation = 1, Congestion = 1, Expansion = 1. In this case, G is an exact isomorphic subgraph of G'."
        ]
    },
    {
        "id": "net-18",
        "technology": "networks",
        "topicRef": "06-mapping-and-embedding",
        "category": "write-the-program",
        "title": "3-Bit Reflected Gray Code Table",
        "prompt": "Write down the 3-bit Binary Reflected Gray Code (RGC) for decimal indices 0 through 7 and verify that index 7 and index 0 differ by exactly 1 bit.",
        "solutionSteps": [
            "Index 0: 000",
            "Index 1: 001",
            "Index 2: 011",
            "Index 3: 010",
            "Index 4: 110",
            "Index 5: 111",
            "Index 6: 101",
            "Index 7: 100",
            "Wraparound check: Index 7 is 100 and Index 0 is 000. They differ in only bit 2 (Hamming distance = 1). Thus, RGC forms a closed Hamiltonian cycle."
        ]
    },
    {
        "id": "net-19",
        "technology": "networks",
        "topicRef": "06-mapping-and-embedding",
        "category": "numeric-calculation",
        "title": "4x4 Mesh into 4-D Hypercube Mapping of Node (1, 1)",
        "prompt": "Show how node (1, 1) in a 4x4 mesh is mapped to a 4-D hypercube using concatenated Gray codes. Verify that its eastern neighbor (1, 2) is at Hamming distance 1.",
        "solutionSteps": [
            "For a 4x4 mesh, r = 2 bits for rows and s = 2 bits for columns. Total dimension = 2 + 2 = 4 bits.",
            "2-bit Gray code sequence: G(0)=00, G(1)=01, G(2)=11, G(3)=10.",
            "Node (1, 1): Row 1 has Gray code 01; Col 1 has Gray code 01. Concatenated address = 0101 (node 5).",
            "East neighbor (1, 2): Row 1 has Gray code 01; Col 2 has Gray code 11. Concatenated address = 0111 (node 7).",
            "Hamming distance between 0101 and 0111: differs only in bit 1. Distance = 1. Host dilation = 1."
        ]
    },
    {
        "id": "net-20",
        "technology": "networks",
        "topicRef": "06-mapping-and-embedding",
        "category": "conceptual",
        "title": "Why 2-D Mesh Cannot Embed into Linear Array Without Congestion",
        "prompt": "Prove why a sqrt(p) x sqrt(p) 2-D mesh cannot be embedded into a p-node linear array with Congestion = 1 and Dilation = 1.",
        "solutionSteps": [
            "A sqrt(p) x sqrt(p) 2-D mesh has bisection width B_mesh = sqrt(p).",
            "A p-node linear array has bisection width B_linear = 1.",
            "Any bisection cut of the linear array cuts exactly 1 physical link.",
            "However, in the mesh, any balanced bisection cut must divide at least sqrt(p) independent communication edges.",
            "Therefore, that single physical link in the linear array must carry all sqrt(p) guest edges: Congestion >= sqrt(p) / 1 = sqrt(p) > 1. Congestion = 1 is impossible."
        ]
    },
    {
        "id": "net-21",
        "technology": "networks",
        "topicRef": "07-worked-and-practice-problems",
        "category": "numeric-calculation",
        "title": "4-ary 3-cube Total Nodes and Links",
        "prompt": "Calculate the total number of processors, degree, and links for a 4-ary 3-cube.",
        "solutionSteps": [
            "k = 4, d = 3.",
            "Processors p = k^d = 4^3 = 64 nodes.",
            "Degree d_node = 2 * d = 2 * 3 = 6 channels per node.",
            "Total links |C| = d * p = 3 * 64 = 192 links."
        ]
    },
    {
        "id": "net-22",
        "technology": "networks",
        "topicRef": "07-worked-and-practice-problems",
        "category": "numeric-calculation",
        "title": "3D Mesh Without Wraparound Links (5x5x5)",
        "prompt": "A 3-D mesh without wraparound has 5 nodes in each dimension (p = 125). Calculate diameter and total links.",
        "solutionSteps": [
            "p = 5^3 = 125 nodes, d = 3, k = 5.",
            "Diameter D = d * (k - 1) = 3 * (5 - 1) = 3 * 4 = 12 hops.",
            "In each dimension, there are k^(d-1) * (k - 1) links = 5^2 * 4 = 25 * 4 = 100 links.",
            "For all 3 dimensions: Total links = 3 * 100 = 300 links."
        ]
    },
    {
        "id": "net-23",
        "technology": "networks",
        "topicRef": "07-worked-and-practice-problems",
        "category": "numeric-calculation",
        "title": "Crossbar vs Hypercube Cost for p = 64",
        "prompt": "Compare the cost of connecting 64 nodes using a crossbar switch vs a 6-D hypercube.",
        "solutionSteps": [
            "Crossbar cost = p^2 = 64^2 = 4,096 crosspoint switches.",
            "Hypercube link cost = (p * log2(p)) / 2 = (64 * 6) / 2 = 192 physical links.",
            "The hypercube achieves scalable logarithmic degree (6) and diameter (6) with only 192 links, whereas a crossbar requires 4,096 switches."
        ]
    },
    {
        "id": "net-24",
        "technology": "networks",
        "topicRef": "07-worked-and-practice-problems",
        "category": "numeric-calculation",
        "title": "Hamming Distance in 6-D Hypercube",
        "prompt": "Calculate the distance between node 011010 and node 110111 in a 6-D hypercube.",
        "solutionSteps": [
            "Compute XOR: 011010 XOR 110111 = 101101.",
            "Count number of 1s in 101101: bits 0, 2, 3, and 5 are set to 1 (4 ones).",
            "Distance = Hamming distance = 4 hops."
        ]
    },
    {
        "id": "net-25",
        "technology": "networks",
        "topicRef": "07-worked-and-practice-problems",
        "category": "conceptual",
        "title": "Arc Connectivity of 2-D Mesh vs 2-D Torus",
        "prompt": "Compare the arc connectivity of a 2-D mesh without wraparound against a 2-D torus. What is the fault-tolerance impact?",
        "solutionSteps": [
            "In a 2-D mesh without wraparound, corner nodes have degree 2. Severing 2 links disconnects a corner node from the network. Arc connectivity = 2.",
            "In a 2-D torus, every node has degree 4. Severing at least 4 links is required to isolate any node. Arc connectivity = 4.",
            "The torus provides double the arc connectivity, offering superior fault tolerance and multiple alternate routes during link failures."
        ]
    }
]

# 2. Vectors Questions (26 questions)
vectors_q = [
    {
        "id": "vec-01",
        "technology": "vectors",
        "topicRef": "01-history-and-evolution",
        "category": "conceptual",
        "title": "Cray-1 Register Specifications",
        "prompt": "What are the exact specifications of the vector registers in the Cray-1 and VMIPS architectures? Clarify the distinction between element count and bit width.",
        "solutionSteps": [
            "The Cray-1 and VMIPS architectures feature exactly 8 vector registers (V0 through V7).",
            "Each register holds 64 elements, and each element is 64 bits wide (IEEE 754 double precision float).",
            "The total physical data capacity of each register is 64 * 64 = 4,096 bits (512 bytes).",
            "Total vector register file capacity is 8 * 512 = 4,096 bytes."
        ],
        "watchOutTip": "Do not state that the register holds only 64 bits; it holds 64 elements of 64 bits each!"
    },
    {
        "id": "vec-02",
        "technology": "vectors",
        "topicRef": "01-history-and-evolution",
        "category": "compare-and-contrast",
        "title": "Cray-1 vs. CDC Cyber 205 Vector Architecture",
        "prompt": "Contrast the vector storage architectures of the Cray-1 and the CDC Cyber 205 supercomputers.",
        "solutionSteps": [
            "Cray-1 is a Register-to-Register vector processor: all arithmetic operations operate strictly between vector registers (e.g. ADDV V3, V1, V2). Requires vector load and store instructions to move data between registers and memory.",
            "CDC Cyber 205 is a Memory-to-Memory vector processor: vector instructions stream operands directly from main memory into functional units and write results directly back to memory, without intermediate vector registers.",
            "Trade-off: Register-to-register allows fast register reuse and vector chaining; memory-to-memory eliminates register file capacity limits but suffers high memory latency startup costs."
        ]
    },
    {
        "id": "vec-03",
        "technology": "vectors",
        "topicRef": "02-why-vector-processing",
        "category": "conceptual",
        "title": "Why Deep Pipelines Fail for Scientific Code",
        "prompt": "Explain why increasing scalar pipeline depth fails to yield proportional speedup for large scientific numerical codes.",
        "solutionSteps": [
            "Diminishing clock returns: Beyond 3-4 GHz, thermal dissipation and dynamic power (P = C V^2 f) escalate exponentially.",
            "Branch misprediction penalties: Deep pipelines suffer severe penalties (15-30 cycles) whenever a loop branch mispredicts.",
            "Cache locality breakdown: Scientific codes iterate over gigabytes of dense arrays with low temporal reuse, causing continuous cache miss stalls.",
            "Instruction fetch/decode bottlenecks: Scalar CPUs must fetch and decode separate instructions for every single floating-point operation."
        ]
    },
    {
        "id": "vec-04",
        "technology": "vectors",
        "topicRef": "03-pipelining",
        "category": "numeric-calculation",
        "title": "Three-Segment Pipeline Execution for n = 7 Tasks",
        "prompt": "A 3-segment arithmetic pipeline evaluates R_i = A_i * B_i + C_i for n = 7 tasks. Calculate the total clock cycles with pipelining, without pipelining, and the speedup.",
        "solutionSteps": [
            "Pipelined clock cycles: T_p = k + n - 1 = 3 + 7 - 1 = 9 clock cycles.",
            "Unpipelined (sequential) cycles: T_n = n * k = 7 * 3 = 21 clock cycles.",
            "Speedup S_3 = T_n / T_p = 21 / 9 = 2.33x.",
            "Efficiency E_3 = S_3 / k = 2.33 / 3 = 77.8%."
        ]
    },
    {
        "id": "vec-05",
        "technology": "vectors",
        "topicRef": "03-pipelining",
        "category": "numeric-calculation",
        "title": "Asymptotic Speedup of a 6-Stage Pipeline",
        "prompt": "For a 6-stage pipeline (k = 6), calculate the speedup for n = 10, n = 100, and n = 1000 tasks. What is the theoretical limit as n approaches infinity?",
        "solutionSteps": [
            "For n = 10: S = (10 * 6) / (6 + 10 - 1) = 60 / 15 = 4.00x.",
            "For n = 100: S = (100 * 6) / (6 + 100 - 1) = 600 / 105 = 5.71x.",
            "For n = 1000: S = (1000 * 6) / (6 + 1000 - 1) = 6000 / 1005 = 5.97x.",
            "Theoretical limit: lim_{n -> inf} (n * k) / (k + n - 1) = k = 6.00x."
        ]
    },
    {
        "id": "vec-06",
        "technology": "vectors",
        "topicRef": "04-pipeline-conflicts",
        "category": "conceptual",
        "title": "Three Categories of Pipeline Conflicts",
        "prompt": "Identify and explain the three major pipeline conflicts (hazards) that stall an execution pipeline. Provide one hardware solution for each.",
        "solutionSteps": [
            "1. Resource Conflicts (Structural Hazards): Two instructions compete for the same physical hardware unit in the same cycle (e.g. single-ported memory). Solution: Separate instruction and data caches (Harvard architecture) or multi-ported register files.",
            "2. Data Dependencies (Data Hazards): An instruction depends on the result of an earlier uncompleted instruction (RAW, WAR, WAW). Solution: Internal forwarding / bypassing or vector chaining.",
            "3. Branch Difficulties (Control Hazards): Conditional branches alter the PC, requiring speculatively fetched instructions to be flushed. Solution: Branch prediction buffers or vector mask registers (predication)."
        ]
    },
    {
        "id": "vec-07",
        "technology": "vectors",
        "topicRef": "05-simd",
        "category": "compare-and-contrast",
        "title": "Array Processors vs. Vector Processors",
        "prompt": "Contrast Array Processors and Vector Processors within Flynn's SIMD classification. Explain 'parallelism in space' vs 'parallelism in time'.",
        "solutionSteps": [
            "Array Processors exploit parallelism in SPACE: N physical arithmetic processing elements (PEs) are replicated across silicon. All N PEs execute the same instruction on different data words simultaneously during the same clock cycle.",
            "Vector Processors exploit parallelism in TIME: Operates through a deeply pipelined arithmetic execution unit. Consecutive data elements stream through the pipeline stages in successive clock cycles.",
            "Trade-off: Array processors require large silicon area to duplicate ALUs; vector processors achieve compact silicon area by maximizing pipeline clock frequency and keeping stages continuously filled."
        ]
    },
    {
        "id": "vec-08",
        "technology": "vectors",
        "topicRef": "06-vector-processor-concepts",
        "category": "conceptual",
        "title": "Role of VLEN and MVL Registers",
        "prompt": "Define Maximum Vector Length (MVL) and Vector Length Register (VLEN). How do they interact when processing vectors of length n < MVL?",
        "solutionSteps": [
            "MVL (Maximum Vector Length) is the fixed physical hardware limit of elements in a vector register (e.g. MVL = 64).",
            "VLEN (Vector Length Register) is a dynamic software-programmable control register holding the active number of elements for current vector instructions (0 <= VLEN <= MVL).",
            "When n < MVL (e.g. n = 28): Software sets VLEN = 28 using MTC1 VLEN, R1. Subsequent vector instructions automatically execute only on elements 0 through 27, leaving remaining register slots untouched."
        ]
    },
    {
        "id": "vec-09",
        "technology": "vectors",
        "topicRef": "06-vector-processor-concepts",
        "category": "numeric-calculation",
        "title": "Strip-Mining Breakdown for n = 150, MVL = 64",
        "prompt": "An array of n = 150 elements is processed on a vector architecture with MVL = 64. Calculate the number of strip-mining passes and the VLEN assigned to each pass.",
        "solutionSteps": [
            "Total passes = ceil(n / MVL) = ceil(150 / 64) = 3 passes.",
            "Remainder calculation: 150 % 64 = 22 elements.",
            "Pass 1: VLEN = 22 elements (processes elements 0 through 21).",
            "Pass 2: VLEN = 64 elements (processes elements 22 through 85).",
            "Pass 3: VLEN = 64 elements (processes elements 86 through 149)."
        ]
    },
    {
        "id": "vec-10",
        "technology": "vectors",
        "topicRef": "06-vector-processor-concepts",
        "category": "numeric-calculation",
        "title": "Instruction Count: Scalar vs. Vector for n = 100 Add",
        "prompt": "Compare the number of dynamic machine instructions executed to add two 100-element arrays using a scalar loop vs VMIPS vector code (MVL = 64).",
        "solutionSteps": [
            "Scalar loop: Each iteration requires 6 instructions (load A, load B, add, store C, increment pointer, branch). For 100 elements: 100 * 6 = 600 dynamic instructions.",
            "VMIPS vector code with strip-mining: Requires 2 strip passes (first of 36, second of 64). Each pass executes 6 instructions (LV A, LV B, ADDV, SV C, pointer bump, branch).",
            "Total vector dynamic instructions = 2 passes * 6 = 12 instructions (plus 2 loop setup instructions = 14 total).",
            "Vector execution reduces dynamic instruction issue count by over 97%!"
        ]
    },
    {
        "id": "vec-11",
        "technology": "vectors",
        "topicRef": "06-vector-processor-concepts",
        "category": "conceptual",
        "title": "Memory Bank Conflicts and Stride",
        "prompt": "Explain memory interleaving and state the condition under which memory bank conflicts occur during strided vector memory accesses.",
        "solutionSteps": [
            "Memory interleaving divides main memory into M independent banks (e.g. M = 16) where address A maps to bank A % M.",
            "Each bank has a busy recovery cycle time t_cycle (e.g. 4 cycles).",
            "If a strided vector access accesses consecutive elements with stride s, memory bank conflict occurs whenever gcd(s, M) > 1 and the interval between accesses is less than t_cycle.",
            "When gcd(s, M) = 1 (e.g. odd stride with power-of-two banks), all M banks are accessed before repeating, preventing bank stall."
        ]
    },
    {
        "id": "vec-12",
        "technology": "vectors",
        "topicRef": "07-vmips-architecture",
        "category": "write-the-program",
        "title": "VMIPS Instruction Semantics for ADDV.D and ADDVS.D",
        "prompt": "Explain the difference in operands and hardware execution between VMIPS instructions ADDV.D and ADDVS.D.",
        "solutionSteps": [
            "ADDV.D Vd, Vs1, Vs2 is a Vector-Vector addition: for each element i from 0 to VLEN-1, Vd[i] = Vs1[i] + Vs2[i]. Both inputs are 64-element vector registers.",
            "ADDVS.D Vd, Vs, Fs is a Vector-Scalar addition: for each element i from 0 to VLEN-1, Vd[i] = Vs[i] + Fs. Operand Fs is a single scalar floating-point register whose value is broadcast to all vector stages.",
            "Hardware benefit: ADDVS.D avoids allocating an entire vector register just to hold a repeated constant scalar value."
        ]
    },
    {
        "id": "vec-13",
        "technology": "vectors",
        "topicRef": "07-vmips-architecture",
        "category": "conceptual",
        "title": "Vector Chaining Mechanism and Speedup",
        "prompt": "What is vector chaining? How does it improve the execution time of dependent vector operations?",
        "solutionSteps": [
            "Vector chaining allows the results of one vector functional unit to be forwarded directly as input operands to a second vector functional unit without waiting for the first vector register write-back to finish.",
            "Example: MULV.D V1, V2, V3 followed by ADDV.D V4, V1, V5.",
            "Without chaining: Multiplier takes 64 cycles to finish V1, then adder takes 64 cycles (total ~128 cycles).",
            "With chaining: As soon as element 0 exits the multiplier pipeline, it enters the adder pipeline. Both pipelines run concurrently, finishing in 64 + latencies (~75 cycles)."
        ]
    },
    {
        "id": "vec-14",
        "technology": "vectors",
        "topicRef": "08-performance-measures",
        "category": "conceptual",
        "title": "Why MIPS is Inadequate for Vector Machines",
        "prompt": "Why is Million Instructions Per Second (MIPS) an invalid metric for comparing scalar processors with vector supercomputers?",
        "solutionSteps": [
            "MIPS counts the number of instruction fetches and decodes completed per second.",
            "A scalar CPU adding 64 numbers executes 64 ADD instructions (high instruction count -> high MIPS).",
            "A vector CPU adding 64 numbers executes 1 ADDV instruction (low instruction count -> low MIPS), yet performs the exact same mathematical work in a fraction of the time.",
            "Because instruction granularity differs drastically between scalar and vector ISAs, MIPS is inversely related to efficiency. FLOPS (Floating-Point Operations Per Second) is the only valid metric."
        ]
    },
    {
        "id": "vec-15",
        "technology": "vectors",
        "topicRef": "08-performance-measures",
        "category": "numeric-calculation",
        "title": "Amdahl's Law on Vector Speedup",
        "prompt": "A program runs on a vector machine where vector mode is 10 times faster than scalar mode. If 20% of the program's operations are inherently scalar, calculate overall speedup.",
        "solutionSteps": [
            "Scalar fraction s = 0.20, Vectorizable fraction p_vec = 0.80.",
            "Vector acceleration factor S_vec = 10.",
            "Amdahl's Law: S_overall = 1 / (s + p_vec / S_vec).",
            "S_overall = 1 / (0.20 + 0.80 / 10) = 1 / (0.20 + 0.08) = 1 / 0.28 = 3.57x.",
            "Even though vector hardware is 10x faster, overall speedup is limited to 3.57x due to the 20% scalar bottleneck."
        ]
    },
    {
        "id": "vec-16",
        "technology": "vectors",
        "topicRef": "09-modern-practice",
        "category": "write-the-program",
        "title": "GCC Vectorization Flags and Pragmas",
        "prompt": "List the GCC compiler flags required to enable aggressive auto-vectorisation and output optimization reports. What OpenMP pragma enforces SIMD vectorisation?",
        "solutionSteps": [
            "Optimization level: -O3 (enables loop unrolling and tree vectorisation).",
            "Architecture targeting: -march=native (enables host SIMD instruction sets such as AVX-2, AVX-512).",
            "Diagnostic report flag: -fopt-info-vec (or -fopt-info-vec-optimized).",
            "OpenMP SIMD pragma: #pragma omp simd (informs the compiler that loop iterations have no data dependencies and can be packed into SIMD registers)."
        ]
    },
    {
        "id": "vec-17",
        "technology": "vectors",
        "topicRef": "06-vector-processor-concepts",
        "category": "numeric-calculation",
        "title": "Matrix Multiplication Operation Count",
        "prompt": "How many total floating-point operations are required to multiply two n x n matrices? If n = 1000, how many GFLOPs must be performed?",
        "solutionSteps": [
            "Formula: C_{i,j} = sum_{k=0}^{n-1} A_{i,k} * B_{k,j}.",
            "Each element requires n multiplications and n-1 additions (approximately n multiply-adds = 2n operations).",
            "For n^2 elements: Total operations = 2 * n^3 FLOPs.",
            "For n = 1000: Total operations = 2 * (1000)^3 = 2 * 10^9 FLOPs = 2.0 GFLOPs."
        ]
    },
    {
        "id": "vec-18",
        "technology": "vectors",
        "topicRef": "06-vector-processor-concepts",
        "category": "conceptual",
        "title": "Vector Gather and Scatter Operations",
        "prompt": "Describe the function and purpose of vector gather (LVI) and scatter (SVI) instructions. In what applications are they critical?",
        "solutionSteps": [
            "Gather (LVI Vd, Ra, Vindex): Uses an index vector Vindex containing memory offsets to load non-contiguous, irregularly spaced data elements into contiguous vector register slots: Vd[i] = Mem[Ra + Vindex[i]].",
            "Scatter (SVI Vs, Ra, Vindex): Writes contiguous vector register elements into irregular memory addresses determined by index vector Vindex: Mem[Ra + Vindex[i]] = Vs[i].",
            "Application: Critical for sparse matrix calculations, finite element unstructured meshes, and graph algorithms where non-zero entries are stored via pointer indirection."
        ]
    },
    {
        "id": "vec-19",
        "technology": "vectors",
        "topicRef": "07-vmips-architecture",
        "category": "conceptual",
        "title": "Vector Mask Register (VMASK) for Conditional Loops",
        "prompt": "Explain how the VMASK register implements conditional execution (if-else statements) inside vectorized loops without branching.",
        "solutionSteps": [
            "A comparison instruction (e.g. C.LT.D Vs1, Vs2) evaluates a condition on each vector element and writes 1 (true) or 0 (false) into corresponding bits of VMASK.",
            "Subsequent vector instructions execute on all elements, but hardware write-back into destination register Vd is enabled ONLY for elements where VMASK[i] == 1.",
            "Elements where VMASK[i] == 0 retain their previous values.",
            "Benefit: Completely eliminates branch misprediction penalties and pipeline flushes."
        ]
    },
    {
        "id": "vec-20",
        "technology": "vectors",
        "topicRef": "09-modern-practice",
        "category": "find-the-bug",
        "title": "Preventing Pointer Aliasing in Vector C Code",
        "prompt": "Why might a C compiler fail to auto-vectorize 'void add(double *a, double *b, double *c, int n)' even with -O3? How is this fixed?",
        "solutionSteps": [
            "Bug cause: Pointer Aliasing. In standard C, pointers a, b, and c could potentially point to overlapping memory regions (e.g. c == a + 1). If pointers alias, writing c[i] could alter a[i+1], creating a loop-carried dependency that forbids SIMD parallel execution.",
            "Fix: Declare pointers with the C99 __restrict__ keyword: 'void add(const double * __restrict__ a, const double * __restrict__ b, double * __restrict__ c, int n)'.",
            "This guarantees to the compiler that arrays do not overlap, enabling immediate SIMD vectorisation."
        ]
    },
    {
        "id": "vec-21",
        "technology": "vectors",
        "topicRef": "03-pipelining",
        "category": "numeric-calculation",
        "title": "Clock Period in Non-Pipelined vs. Pipelined ALU",
        "prompt": "A combinational circuit requires 12 ns to complete. If it is partitioned into a 4-segment pipeline with segment delays of 3 ns, 3 ns, 4 ns, and 2 ns, with a 0.5 ns latch delay, what is the maximum clock frequency?",
        "solutionSteps": [
            "The pipeline clock period is determined by the slowest segment delay plus the interface latch overhead: t_clock = max(delay_i) + t_latch.",
            "Max segment delay = 4 ns.",
            "Clock period t_clock = 4 ns + 0.5 ns = 4.5 ns.",
            "Maximum clock frequency f = 1 / t_clock = 1 / (4.5 * 10^-9 s) = 222.2 MHz.",
            "Unpipelined clock was 1 / 12 ns = 83.3 MHz."
        ]
    },
    {
        "id": "vec-22",
        "technology": "vectors",
        "topicRef": "08-performance-measures",
        "category": "numeric-calculation",
        "title": "Arithmetic Intensity of Vector Dot Product",
        "prompt": "Calculate the arithmetic intensity (FLOP/byte) of an inner product kernel computing s = sum_{i=0}^{N-1} A[i] * B[i] for double-precision floats.",
        "solutionSteps": [
            "Floating-point operations: N multiplications + (N - 1) additions = 2N - 1 FLOPs (approx 2N FLOPs).",
            "Memory transfers: Array A requires N * 8 bytes; Array B requires N * 8 bytes. Total bytes read = 16N bytes.",
            "Arithmetic Intensity I = (2N FLOPs) / (16N Bytes) = 2 / 16 = 0.125 FLOP/Byte.",
            "Because I is very low, the dot product is heavily memory-bandwidth bound."
        ]
    },
    {
        "id": "vec-23",
        "technology": "vectors",
        "topicRef": "07-vmips-architecture",
        "category": "conceptual",
        "title": "Structural Hazard on Vector Register Ports",
        "prompt": "What structural hazard occurs if two instructions simultaneously attempt to read from vector register V1 when V1 has only one read port?",
        "solutionSteps": [
            "If Instruction 1 (e.g. ADDV V3, V1, V2) and Instruction 2 (e.g. MULV V4, V1, V5) both require operand elements from V1 in the same clock cycle, a structural port hazard occurs.",
            "The second instruction is stalled until the first instruction finishes its 64-element read pass.",
            "Modern vector architectures provide multi-ported vector registers (e.g. 2 to 4 read ports per register) to eliminate this structural stall."
        ]
    },
    {
        "id": "vec-24",
        "technology": "vectors",
        "topicRef": "06-vector-processor-concepts",
        "category": "numeric-calculation",
        "title": "Strip-Mining Remainder: n = 200, MVL = 64",
        "prompt": "For an array of n = 200 elements on MVL = 64, what are the element counts processed across all passes?",
        "solutionSteps": [
            "Total passes = ceil(200 / 64) = 4 passes.",
            "Remainder = 200 % 64 = 8 elements.",
            "Pass 1: 8 elements (indices 0 to 7).",
            "Pass 2: 64 elements (indices 8 to 71).",
            "Pass 3: 64 elements (indices 72 to 135).",
            "Pass 4: 64 elements (indices 136 to 199)."
        ]
    },
    {
        "id": "vec-25",
        "technology": "vectors",
        "topicRef": "05-simd",
        "category": "conceptual",
        "title": "Flynn's Classification of Multi-Core CPUs with AVX-512",
        "prompt": "How does a modern multi-core cluster running AVX-512 map onto Flynn's taxonomy?",
        "solutionSteps": [
            "At the macro cluster/node level, multiple CPU cores execute independently on different data, making the system MIMD (Multiple Instruction, Multiple Data).",
            "At the micro core level, each core possesses 512-bit SIMD execution units executing vector instructions across packed 64-bit lanes.",
            "Hence, modern supercomputing architectures are hybrid MIMD-SIMD systems."
        ]
    }
]

# 3. Performance Questions (26 questions)
perf_q = [
    {
        "id": "perf-01",
        "technology": "performance",
        "topicRef": "01-why-performance-tools",
        "category": "conceptual",
        "title": "Sources of Parallel Performance Inefficiency",
        "prompt": "List the five primary sources of performance degradation in parallel computing systems and provide a one-sentence description for each.",
        "solutionSteps": [
            "1. Computational Load Imbalance: Unequal work distribution causing faster processes to idle waiting at barriers.",
            "2. Communication Overhead: Inter-node network latencies and message buffer contention.",
            "3. Synchronisation and Lock Contention: Thread serialization inside critical sections and barriers.",
            "4. Memory and Cache Inefficiencies: Cache misses, false sharing, and NUMA remote access penalties.",
            "5. Serial Code Fraction (Amdahl's Law): Non-parallelizable program sections limiting asymptotic speedup."
        ]
    },
    {
        "id": "perf-02",
        "technology": "performance",
        "topicRef": "02-performance-engineering-cycle",
        "category": "conceptual",
        "title": "The Four Phases of Performance Engineering",
        "prompt": "Describe the four iterative phases of the HPC performance engineering cycle and state the primary deliverable of each phase.",
        "solutionSteps": [
            "1. Measure: Collect runtime profiles and event traces using sampling or instrumentation. Deliverable: profile.cubex or trace.otf2.",
            "2. Analyse: Process measurement data to locate dominant hotspots, call-paths, and wait-states. Deliverable: Root-cause bottleneck diagnosis.",
            "3. Optimise: Apply targeted code modifications (load balancing, SIMD, non-blocking MPI). Deliverable: Refactored source code.",
            "4. Verify: Validate numerical correctness and confirm execution speedup. Deliverable: Verified benchmark scaling report."
        ]
    },
    {
        "id": "perf-03",
        "technology": "performance",
        "topicRef": "03-key-concepts",
        "category": "numeric-calculation",
        "title": "Amdahl's Law: 5% Serial Fraction on 64 Cores",
        "prompt": "A program has an inherent serial fraction s = 0.05 (5%). Calculate theoretical speedup on 64 cores and the maximum possible speedup with infinite cores.",
        "solutionSteps": [
            "s = 0.05, p_par = 0.95, N = 64.",
            "Amdahl's formula: S(N) = 1 / (s + p_par / N).",
            "S(64) = 1 / (0.05 + 0.95 / 64) = 1 / (0.05 + 0.01484) = 1 / 0.06484 = 15.42x.",
            "Infinite cores limit: S(inf) = 1 / s = 1 / 0.05 = 20.0x."
        ]
    },
    {
        "id": "perf-04",
        "technology": "performance",
        "topicRef": "03-key-concepts",
        "category": "numeric-calculation",
        "title": "Gustafson's Law: 5% Serial Fraction on 64 Cores",
        "prompt": "Apply Gustafson's Law to calculate scaled speedup on 64 cores for an enlarged dataset where the serial fraction on parallel hardware is s = 0.05.",
        "solutionSteps": [
            "Gustafson's formula: S(N) = N - s(N - 1).",
            "S(64) = 64 - 0.05 * (64 - 1) = 64 - 0.05 * 63 = 64 - 3.15 = 60.85x.",
            "Under weak scaling (enlarging workload), 64 cores achieve 60.85x speedup compared to only 15.42x under Amdahl's strong scaling."
        ]
    },
    {
        "id": "perf-05",
        "technology": "performance",
        "topicRef": "03-key-concepts",
        "category": "numeric-calculation",
        "title": "Karp-Flatt Metric Calculation",
        "prompt": "A parallel application achieves speedup S = 12 on p = 16 processors. Calculate the Karp-Flatt experimentally determined serial fraction e.",
        "solutionSteps": [
            "Formula: e = (1/S - 1/p) / (1 - 1/p).",
            "1/S = 1/12 = 0.08333; 1/p = 1/16 = 0.06250.",
            "Numerator = 0.08333 - 0.06250 = 0.02083.",
            "Denominator = 1 - 0.06250 = 0.93750.",
            "e = 0.02083 / 0.93750 = 0.0222 (2.22% experimental serial fraction)."
        ]
    },
    {
        "id": "perf-06",
        "technology": "performance",
        "topicRef": "04-event-model-execution",
        "category": "conceptual",
        "title": "Event Record Tuple Structure",
        "prompt": "List the four fundamental fields in an HPC event record tuple and explain what each field specifies.",
        "solutionSteps": [
            "Event = <timestamp, location, type, attributes>.",
            "1. Timestamp: High-resolution hardware time (nanoseconds) when the event fired.",
            "2. Location: Node, process/rank ID, and thread ID where the event occurred.",
            "3. Type: Semantic category (e.g. Region Enter, Region Exit, MPI Send, Lock Acquire).",
            "4. Attributes: Contextual parameters (message bytes, partner rank, communicator, hardware counter values)."
        ]
    },
    {
        "id": "perf-07",
        "technology": "performance",
        "topicRef": "05-sampling-vs-instrumentation",
        "category": "compare-and-contrast",
        "title": "Statistical Sampling vs. Software Instrumentation",
        "prompt": "Compare statistical sampling and software instrumentation across overhead, recompilation requirements, and accuracy of function call counts.",
        "solutionSteps": [
            "Overhead: Sampling has minimal overhead (1-3%); Instrumentation has higher overhead (5-20%+ if unfiltered).",
            "Recompilation: Sampling requires no source modification or recompilation (runs on native binary); Instrumentation typically requires recompiling with tool wrappers (e.g. scorep mpicc).",
            "Call count accuracy: Sampling estimates time statistically and cannot record exact call counts; Instrumentation logs every single entry/exit, providing 100% exact invocation counts."
        ]
    },
    {
        "id": "perf-08",
        "technology": "performance",
        "topicRef": "05-sampling-vs-instrumentation",
        "category": "conceptual",
        "title": "The Heisenberg (Probe) Effect in Instrumentation",
        "prompt": "What is the Heisenberg (probe) effect in parallel performance measurement? Give a concrete example of how probe overhead can alter program behavior.",
        "solutionSteps": [
            "The probe effect occurs when the physical overhead of measurement probes perturbs execution timing, altering the very performance characteristics being measured.",
            "Example: If rank 0 is instrumented with a heavy probe inside a tiny helper function, rank 0 is artificially delayed.",
            "This delay might cause rank 1 to sit idle at an MPI_Recv waiting for rank 0, fabricating a fake 'Late Sender' bottleneck that does not exist in production code."
        ]
    },
    {
        "id": "perf-09",
        "technology": "performance",
        "topicRef": "06-profiling",
        "category": "conceptual",
        "title": "Exclusive Time vs. Inclusive Time",
        "prompt": "Define exclusive time and inclusive time in profiling. Which metric should an engineer sort by when seeking optimization candidates?",
        "solutionSteps": [
            "Inclusive Time: Total elapsed time spent within a function, including all time spent in child subroutines called by it.",
            "Exclusive Time: Time spent strictly within the body of the function itself, excluding time in child callees.",
            "Optimization priority: Engineers sort by Exclusive Time, because it isolates where the CPU is actively executing arithmetic instructions rather than delegating work to children."
        ]
    },
    {
        "id": "perf-10",
        "technology": "performance",
        "topicRef": "06-profiling",
        "category": "conceptual",
        "title": "Flat Profile vs. Call-Path Profile",
        "prompt": "What critical diagnostic information is present in a call-path profile (CUBE) that is completely missing from a flat profile?",
        "solutionSteps": [
            "A flat profile lists functions in isolation without caller context.",
            "If MPI_Wait takes 40% of time, a flat profile cannot show which application module invoked it.",
            "A call-path profile preserves the full hierarchical call chain (e.g. main -> solver -> exchange_halo -> MPI_Wait vs main -> io -> flush -> MPI_Wait), pinpointing the exact algorithmic source of delays."
        ]
    },
    {
        "id": "perf-11",
        "technology": "performance",
        "topicRef": "07-tracing",
        "category": "conceptual",
        "title": "Why Tracing Reveals Idle Wait States",
        "prompt": "Explain why multi-rank timeline tracing is necessary to diagnose MPI wait-states such as 'Late Sender' that flat profiling cannot explain.",
        "solutionSteps": [
            "Flat profiling aggregates total time across the whole execution into a single number: e.g. MPI_Recv took 50 seconds.",
            "Profiling cannot show whether that 50s was spent transferring data or sitting idle waiting for the sender to transmit.",
            "Tracing records timestamps of individual events, revealing that the receiver posted MPI_Recv at t=10s, but the sender was busy computing until t=59s, proving a 49s idle wait state caused by sender delay."
        ]
    },
    {
        "id": "perf-12",
        "technology": "performance",
        "topicRef": "07-tracing",
        "category": "conceptual",
        "title": "The Data Volume Problem in Tracing",
        "prompt": "Why can tracing cause severe storage and I/O bottlenecks in large-scale HPC runs? What are two standard techniques used to mitigate trace file size?",
        "solutionSteps": [
            "Every event generates binary log records; across thousands of ranks running millions of function calls per second, trace logs rapidly reach gigabytes or terabytes, overwhelming parallel file systems.",
            "Mitigation 1: Selective Filtering (e.g. Score-P filter file) to exclude small, frequently called utility routines from being logged.",
            "Mitigation 2: Phase-Specific Tracing (turning tracing ON only for 2-3 representative simulation iterations via API calls)."
        ]
    },
    {
        "id": "perf-13",
        "technology": "performance",
        "topicRef": "08-profiling-vs-tracing-comparison",
        "category": "compare-and-contrast",
        "title": "Profiling vs Tracing File Size Scalability",
        "prompt": "Contrast the asymptotic file size growth of profiling versus tracing as run duration increases from 1 minute to 10 hours.",
        "solutionSteps": [
            "Profiling output file size remains CONSTANT regardless of duration, scaling as O(p * num_functions). Summary counters are updated in-place.",
            "Tracing output file size scales LINEARLY with time: O(p * event_frequency * duration).",
            "A 10-hour trace will be 600 times larger than a 1-minute trace, whereas profile size is identical."
        ]
    },
    {
        "id": "perf-14",
        "technology": "performance",
        "topicRef": "09-tools",
        "category": "conceptual",
        "title": "Score-P Unified Tool Ecosystem",
        "prompt": "What is Score-P? What analysis tools consume Score-P output files?",
        "solutionSteps": [
            "Score-P is a unified software measurement infrastructure that instruments and records performance data for HPC codes.",
            "Consumers of Score-P data:",
            "1. CUBE: Interactive visualizer for .cubex profile trees.",
            "2. Scalasca: Automatic wait-state pattern analysis engine.",
            "3. Vampir: Graphical timeline viewer for .otf2 trace files."
        ]
    },
    {
        "id": "perf-15",
        "technology": "performance",
        "topicRef": "09-tools",
        "category": "conceptual",
        "title": "Scalasca Automated Wait-State Analysis",
        "prompt": "Describe how Scalasca analyzes an OTF2 trace to detect 'Late Sender' and 'Wait at Barrier' bottlenecks.",
        "solutionSteps": [
            "Scalasca executes a parallel replay of the OTF2 trace across cluster ranks.",
            "Late Sender: Scalasca checks timestamp t_recv of MPI_Recv and timestamp t_send of matching MPI_Send. If t_recv < t_send, it quantifies idle time (t_send - t_recv) as a Late Sender wait-state.",
            "Wait at Barrier: Scalasca marks arrival times of all ranks at MPI_Barrier and calculates the idle penalty suffered by early ranks waiting for the slowest straggler rank."
        ]
    },
    {
        "id": "perf-16",
        "technology": "performance",
        "topicRef": "09-tools",
        "category": "conceptual",
        "title": "PMPI Mechanism vs mpiP Tool",
        "prompt": "Clearly differentiate between the MPI Profiling Interface (PMPI) and the mpiP profiling tool.",
        "solutionSteps": [
            "PMPI: A standardized profiling API specification built into all MPI implementations. Every routine (MPI_Send) has a weak symbol alias (PMPI_Send), allowing tool developers to intercept calls via wrapper libraries.",
            "mpiP: A specific, lightweight profiling software library that uses the PMPI interface to generate a concise summary report of communication time and bytes transferred per rank.",
            "PMPI is the underlying interface mechanism; mpiP is an end-user tool."
        ],
        "watchOutTip": "Do not treat PMPI and mpiP as synonyms!"
    },
    {
        "id": "perf-17",
        "technology": "performance",
        "topicRef": "09-tools",
        "category": "numeric-calculation",
        "title": "Energy-Delay Product (EDP) Calculation",
        "prompt": "System A completes a job in 100 seconds consuming 200 Watts average power. System B completes the job in 80 seconds consuming 280 Watts average power. Calculate energy and EDP for both. Which system is more energy-efficient by EDP?",
        "solutionSteps": [
            "System A: Energy E_A = Power * Time = 200 W * 100 s = 20,000 Joules. EDP_A = E * T = 20,000 * 100 = 2,000,000 J*s.",
            "System B: Energy E_B = Power * Time = 280 W * 80 s = 22,400 Joules. EDP_B = E * T = 22,400 * 80 = 1,792,000 J*s.",
            "Conclusion: System A uses less raw energy (20,000 J vs 22,400 J), but System B has a lower EDP (1.79M vs 2.00M) because its 20% runtime reduction outweighs the energy increase."
        ]
    },
    {
        "id": "perf-18",
        "technology": "performance",
        "topicRef": "09-tools",
        "category": "write-the-program",
        "title": "Timing an OpenMP Loop with omp_get_wtime()",
        "prompt": "Write a compilable C snippet using omp_get_wtime() to measure and print the wall-clock execution time of an OpenMP parallel loop.",
        "solutionSteps": [
            "Include <omp.h> and <stdio.h>.",
            "Record starting timestamp: double start = omp_get_wtime();",
            "Execute parallel loop: #pragma omp parallel for ...",
            "Record end timestamp: double end = omp_get_wtime();",
            "Print elapsed time: printf(\"Elapsed wall time: %.6f seconds\\n\", end - start);"
        ]
    },
    {
        "id": "perf-19",
        "technology": "performance",
        "topicRef": "10-diagnose-bottlenecks",
        "category": "find-the-bug",
        "title": "Diagnosing High MPI_Recv Time in Flat Profile",
        "prompt": "A flat profile shows that 60% of total application time is spent in MPI_Recv. What are the two primary possible root causes, and how do you differentiate between them?",
        "solutionSteps": [
            "Root Cause 1: Computational load imbalance (Late Sender) - the sending rank is delayed in heavy calculation, causing the receiver to idle.",
            "Root Cause 2: Physical network saturation / high transfer size - the message is enormous and takes long to transfer across the physical wire.",
            "Differentiation: Inspect a trace timeline or mpiP byte transfer statistics. If transfer size is small and receiver entered MPI_Recv long before the sender posted MPI_Send, it is load imbalance. If sender and receiver posted simultaneously and transfer duration is large, it is network bandwidth bottleneck."
        ]
    },
    {
        "id": "perf-20",
        "technology": "performance",
        "topicRef": "10-diagnose-bottlenecks",
        "category": "find-the-bug",
        "title": "Diagnosing OpenMP False Sharing from Hardware Counters",
        "prompt": "An OpenMP loop shows near 100% CPU utilization across 8 cores, but runs slower than serial code. PAPI reports excessive L1 data cache invalidations. Diagnose the problem and provide the fix.",
        "solutionSteps": [
            "Diagnosis: False Sharing. Multiple threads are concurrently writing to independent scalar variables that reside on the same 64-byte hardware cache line.",
            "Cache coherence (MESI) repeatedly invalidates the cache line across all CPU cores, causing bus lock contention.",
            "Fix: Accumulate intermediate results into thread-local variables (allocated in CPU registers), and write to the shared array only once when the loop completes."
        ]
    },
    {
        "id": "perf-21",
        "technology": "performance",
        "topicRef": "10-diagnose-bottlenecks",
        "category": "find-the-bug",
        "title": "Diagnosing Lock Serialization in OpenMP",
        "prompt": "A profiler reports that OpenMP threads spend 70% of execution time stalled in 'GOMP_critical_start'. What is the bottleneck, and what are two ways to eliminate it?",
        "solutionSteps": [
            "Bottleneck: Critical Section Contention / Lock Serialization. Threads are contending for a single #pragma omp critical block, turning parallel execution into sequential lock queues.",
            "Remedy 1: Replace #pragma omp critical with #pragma omp atomic if the operation is a simple scalar update (hardware atomic instructions avoid heavy OS locks).",
            "Remedy 2: Replace the critical block with a reduction clause: #pragma omp parallel for reduction(+: sum)."
        ]
    },
    {
        "id": "perf-22",
        "technology": "performance",
        "topicRef": "03-key-concepts",
        "category": "numeric-calculation",
        "title": "Parallel Efficiency for Speedup 24 on 32 Processors",
        "prompt": "If a code runs on 32 processors and achieves a speedup of 24x over the single-core baseline, calculate its parallel efficiency.",
        "solutionSteps": [
            "Speedup S = 24, Processors p = 32.",
            "Efficiency E = S / p = 24 / 32 = 0.75 (75.0% efficiency).",
            "Overhead: 25% of aggregate processor time is lost to communication, synchronization, and serial bottlenecks."
        ]
    },
    {
        "id": "perf-23",
        "technology": "performance",
        "topicRef": "03-key-concepts",
        "category": "conceptual",
        "title": "Superlinear Speedup Causes",
        "prompt": "Can parallel speedup ever exceed processor count (S(p) > p)? Explain the physical mechanism that causes superlinear speedup.",
        "solutionSteps": [
            "Yes, superlinear speedup can occur in empirical benchmarks.",
            "Primary cause: Memory Hierarchy / Cache Effects.",
            "When running on 1 processor, a large dataset (e.g. 100 MB) exceeds the single CPU's L3 cache (32 MB), forcing slow DRAM memory accesses.",
            "When distributed across 4 processors, each node holds only 25 MB, which fits entirely inside local high-speed L3 cache, eliminating DRAM latency and yielding speedup > 4x."
        ]
    },
    {
        "id": "perf-24",
        "technology": "performance",
        "topicRef": "09-tools",
        "category": "conceptual",
        "title": "Linux perf Tool for Performance Analysis",
        "prompt": "What is the Linux 'perf' tool? List two common commands used to record and report CPU hardware counter profiles.",
        "solutionSteps": [
            "Linux perf is a powerful statistical sampling profiler integrated into the Linux kernel that monitors CPU Performance Monitoring Units (PMU).",
            "Command 1: 'perf stat ./program' (counts aggregate hardware counters: cycles, instructions, cache misses, branch misses).",
            "Command 2: 'perf record -g ./program' followed by 'perf report' (records call-graph execution samples and displays an interactive browser of hotspot functions)."
        ]
    },
    {
        "id": "perf-25",
        "technology": "performance",
        "topicRef": "03-key-concepts",
        "category": "conceptual",
        "title": "Strong Scaling Limit vs Weak Scaling Limit",
        "prompt": "Contrast the asymptotic limits of Strong Scaling (Amdahl) and Weak Scaling (Gustafson) as processor count N -> infinity.",
        "solutionSteps": [
            "Strong Scaling: Problem size is fixed. As N -> infinity, speedup is strictly capped at S(infinity) = 1/s (where s is serial fraction). Efficiency approaches zero.",
            "Weak Scaling: Problem size scales proportionally with N. As N -> infinity, speedup scales linearly: S(N) = N - s(N - 1). Efficiency remains approximately 1 - s.",
            "Weak scaling enables massive supercomputing clusters to maintain high efficiency on grand-challenge scientific problems."
        ]
    }
]

out_dir = os.path.join(os.getcwd(), 'content/questions')
os.makedirs(out_dir, exist_ok=True)

files = [
    ("networks-questions.json", networks_q),
    ("vectors-questions.json", vectors_q),
    ("performance-questions.json", perf_q),
]

for filename, qlist in files:
    path = os.path.join(out_dir, filename)
    with open(path, "w") as f:
        json.dump(qlist, f, indent=2)
    print(f"Generated {path}: {len(qlist)} questions.")

print("All extra questions generated successfully!")
