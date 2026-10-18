#!/usr/bin/env python3
"""
Generate complete MDX content for Part C: Interconnection Networks (01 to 07).
Course: CSS 311 Parallel and Distributed Computing (IIIT Kottayam).
"""

import os

topics = {
    "01-introduction": {
        "title": "Introduction to Interconnection Networks",
        "description": "Classification of static and dynamic networks, switches, links, and network interfaces.",
        "order": 1,
        "readingTimeMinutes": 12,
        "sections": [
            {"id": "why-networks", "title": "Why Interconnection Networks Matter", "level": 2},
            {"id": "static-vs-dynamic", "title": "Static vs. Dynamic Networks", "level": 2},
            {"id": "switches-and-degree", "title": "Switches, Degree, and Switch Complexity", "level": 2},
            {"id": "links-and-interfaces", "title": "Communication Links and Network Interfaces", "level": 2},
            {"id": "watch-out-switches", "title": "Watch Out: Switch Port Quadratic Cost", "level": 2},
        ],
        "body": """## Why Interconnection Networks Matter

In modern parallel computing architectures, the performance of multi-core processors, distributed-memory clusters, and supercomputers is fundamentally bounded not merely by raw arithmetic computation speed, but by the speed and bandwidth at which data moves across the system. 

An **interconnection network** is the physical and logical communication fabric that carries messages, control signals, and raw data between processing elements (CPUs, GPUs, vector accelerators) and memory modules.

Parallel architectures trade off **performance** (low latency, high bisection bandwidth, high throughput) against **cost** (number of wires, physical links, switch complexity, and packaging area).

## Static vs. Dynamic Networks

Interconnection networks fall into two foundational architectural classes:

1. **Static (Direct) Networks**:
   - Consist of point-to-point physical communication links establishing permanent connections directly between processing nodes.
   - Nodes act as both computing units and message routers.
   - Topologies are fixed: nodes only communicate directly with immediate physical neighbors; all other communication requires multi-hop store-and-forward or wormhole routing through intermediate nodes.
   - Examples: Linear Array, Ring, 2-D/3-D Mesh, 2-D Torus, Hypercube, Tree networks.

2. **Dynamic (Indirect) Networks**:
   - Processors and memory banks connect to an active switching fabric composed of programmable switching elements.
   - Communication pathways are established dynamically on demand by configuring the internal state of the switches.
   - Intermediate elements are dedicated switches rather than computing processors.
   - Examples: Crossbar switches, Multistage Interconnection Networks (MINs) such as Omega networks, Butterfly networks, and dynamic Fat Trees.

| Architectural Feature | Static (Direct) Networks | Dynamic (Indirect) Networks |
| :--- | :--- | :--- |
| **Node Role** | Processors perform both compute & routing | Processors compute; switches route |
| **Connection Type** | Fixed point-to-point wiring | Reconfigurable switching paths |
| **Scalability** | High for meshes and hypercubes | Limited for crossbars ($O(p^2)$ switches) |
| **Typical Deployment** | Multicomputers, Beowulf clusters, MPPs | Shared-memory SMPs, switch fabrics |

<Diagram type="memory-architecture" caption="Direct point-to-point node cluster vs shared-bus switching network." />

## Switches, Degree, and Switch Complexity

A network **switch** is a hardware routing device that maps a set of input ports to a set of output ports:
- The total number of input and output ports on a switch is defined as the **degree of the switch** ($d_{sw}$).
- Internal switch architecture requires internal switching logic (crosspoints). The internal hardware complexity and physical silicon area of a crossbar switch grow as the **square of the switch degree**:

$$
\\text{Switch Internal Cost} = O(d_{sw}^2)
$$

Hence, constructing switches with very high degree (e.g., $d_{sw} > 64$) becomes physically and thermally prohibitive on a single silicon die. This fundamental physical limit necessitates multi-stage switching fabrics or bounded-degree topologies (such as 2-D meshes with switch degree 4 or 3-D meshes with degree 6).

## Communication Links and Network Interfaces

Processors communicate with the interconnection network through a dedicated **Network Interface Card (NIC)** or on-chip network interface unit:
- **I/O Bus Attached Interface**: The NIC sits on a standard peripheral bus (e.g., PCIe). Data transfers incur bus protocol conversion delays and higher OS kernel latency. Common in commodity clusters.
- **Memory Bus Attached Interface**: The network controller connects directly to the high-speed processor-memory bus or is integrated on-die (e.g., Cray Gemini, Intel Omni-Path, Fugaku Tofu). Bypasses peripheral bottlenecks, delivering sub-microsecond latency.

Communication channels can be unidirectional or bidirectional full-duplex links. Link capacity is characterized by:
- **Link Bandwidth ($b$)**: The maximum rate at which raw bits can be transmitted over the physical medium (measured in Gbps or GB/s).
- **Channel Latency ($t_{link}$)**: Time required for a bit to travel the physical wire between two endpoints.

<Callout type="warning" title="Watch Out: Switch Port Quadratic Cost">
When analyzing network topologies, beware of assuming switches are zero-cost. While a completely connected network offers a diameter of 1 hop, every single node requires a switch of degree $p-1$. Across $p$ nodes, the aggregate switch crosspoint complexity scales as $O(p^2)$, rendering direct crossbars unbuildable for $p > 1024$ nodes.
</Callout>
"""
    },
    "02-graph-theoretic-measures": {
        "title": "Graph-Theoretic Measures for Interconnection Networks",
        "description": "Rigorous definitions of Diameter, Bisection Width, Node Degree, and Network Cost.",
        "order": 2,
        "readingTimeMinutes": 14,
        "sections": [
            {"id": "network-as-graph", "title": "Representing Topologies as Graphs", "level": 2},
            {"id": "diameter", "title": "Network Diameter (Latency Bound)", "level": 2},
            {"id": "bisection-width", "title": "Bisection Width (Bandwidth Bottleneck)", "level": 2},
            {"id": "node-degree", "title": "Node Degree and Switch Complexity", "level": 2},
            {"id": "network-cost", "title": "Network Cost (Link Count)", "level": 2},
            {"id": "arc-connectivity", "title": "Arc Connectivity and Fault Tolerance", "level": 2},
        ],
        "body": """## Representing Topologies as Graphs

Any static direct interconnection network can be formally modeled as an undirected or directed graph $G = (V, E)$:
- The vertex set $V$ represents the processing nodes (with their associated local memory and routing switch). $|V| = p$.
- The edge set $E$ represents the bidirectional physical communication links. $|E| = |C|$.

Graph-theoretic metrics provide quantitative measures to evaluate the fundamental performance, latency, throughput, and financial cost of different network designs.

## Network Diameter (Latency Bound)

The **diameter** ($D$) of a network is the maximum shortest-path distance between any pair of nodes in the graph:

$$
D = \\max_{u, v \\in V} \\text{dist}(u, v)
$$

Where $\\text{dist}(u, v)$ is the number of links along the shortest route connecting node $u$ and node $v$.

### Architectural Significance
- Diameter determines the **worst-case communication latency** for a point-to-point message under store-and-forward or contention-free wormhole routing.
- A smaller diameter is universally desirable.
- A completely connected graph has $D = 1$. A linear array has $D = p - 1$. A hypercube has $D = \\log_2 p$.

## Bisection Width (Bandwidth Bottleneck)

The **bisection width** ($B_w$) of an interconnection network is the **minimum number of communication links that must be severed** to partition the network into two equal halves (subsets $V_1, V_2$ such that $|V_1| = |V_2| = p/2$):

$$
B_w = \\min_{|V_1| = |V_2| = p/2} |\\{ (u, v) \\in E \\mid u \\in V_1, v \\in V_2 \\}|
$$

If each physical channel has bandwidth $b$, the total **bisection bandwidth** is $B = B_w \\times b$.

### Architectural Significance
- Bisection width measures the **aggregate capacity for global communication** when all nodes in one half of the system simultaneously transmit data to nodes in the opposite half (e.g. in matrix transpose, FFT, or Alltoall collectives).
- **Scalability Criterion**: An interconnection network is deemed bandwidth-scalable if its bisection width scales at least as $\\Omega(p)$. 
- In a linear array or simple binary tree, $B_w = 1$. Thus, regardless of how many thousands of nodes are added, total cross-bisection traffic is throttled through a single link!

## Node Degree and Switch Complexity

The **degree of a node** ($d$) is the number of communication channels directly connected to that node.
- In a **regular topology**, all nodes have identical degree (e.g., Ring: $d = 2$; 2-D Torus: $d = 4$; $d$-dimensional Hypercube: $d = \\log_2 p$).
- In an **irregular topology**, degree varies (e.g., 2-D Mesh interior nodes have degree 4, edge nodes have degree 3, and corners have degree 2). We report maximum degree $d_{\\max}$ and average degree.

### Architectural Significance
- Node degree directly dictates the number of physical ports on each node's local network router.
- Switch area scales as $O(d^2)$. Topologies with fixed, constant degree ($O(1)$) such as 2-D and 3-D meshes have fixed-cost routers that do not change as the network grows. Topologies like hypercubes require routers with degree $d = \\log_2 p$, increasing router complexity whenever the cluster expands.

## Network Cost (Link Count)

The **network cost** $|C|$ is defined as the total number of physical communication links in the network:

$$
|C| = |E| = \\frac{1}{2} \\sum_{v \\in V} \\text{deg}(v)
$$

### Architectural Significance
- Reflects the total physical cabling, connector count, transceiver units, and PCB packaging expenses.
- For a completely connected network, $|C| = \\frac{p(p-1)}{2} = O(p^2)$.
- For a linear array, $|C| = p - 1 = O(p)$.
- For a hypercube, $|C| = \\frac{p \\log_2 p}{2} = O(p \\log p)$.

## Arc Connectivity and Fault Tolerance

The **arc connectivity** of a network is the minimum number of links that must be removed to disconnect the graph into two or more components. Higher arc connectivity signifies robust fault tolerance and the existence of multiple disjoint alternate paths to route around broken links.
"""
    },
    "03-topologies": {
        "title": "Network Topologies and Architectures",
        "description": "Exhaustive coverage of Completely Connected, Star, Linear Array, Ring, Meshes, Torus, Hypercubes, Trees, and k-ary d-cubes with SVG diagrams.",
        "order": 3,
        "readingTimeMinutes": 18,
        "sections": [
            {"id": "completely-connected-star", "title": "Completely Connected & Star Networks", "level": 2},
            {"id": "linear-ring", "title": "Linear Arrays and Rings", "level": 2},
            {"id": "meshes-torus", "title": "2-D / 3-D Meshes and Tori", "level": 2},
            {"id": "hypercube-family", "title": "Hypercube Architecture (0-D to 4-D)", "level": 2},
            {"id": "trees-fat-trees", "title": "Binary Trees and Fat Trees", "level": 2},
            {"id": "k-ary-d-cube", "title": "k-ary d-cube Generalization", "level": 2},
            {"id": "interactive-explorer", "title": "Interactive Topology Explorer", "level": 2},
        ],
        "body": """## Completely Connected & Star Networks

### 1. Completely Connected Network
In a completely connected topology, every node has a direct, dedicated physical link to every other node in the network:
- **Diameter**: $D = 1$
- **Bisection Width**: $B_w = \\frac{p^2}{4}$ (for even $p$)
- **Node Degree**: $d = p - 1$
- **Total Links**: $|C| = \\frac{p(p-1)}{2} = O(p^2)$

<Diagram type="completely-connected" caption="Completely connected topology for p = 8 nodes (28 links)." />

**Evaluation**: Ideal unit latency and maximum bisection bandwidth, but financially and physically impractical beyond small $p$ (e.g. for $p = 1024$, links $= 523,776$).

### 2. Star Network
A star network features one central routing hub node to which all remaining $p - 1$ peripheral processing nodes connect:
- **Diameter**: $D = 2$ (every node talks to any other node in 2 hops via the hub)
- **Bisection Width**: $B_w = 1$ (cutting any half of the periphery severs the hub link)
- **Node Degree**: Central hub $= p - 1$; Peripheral nodes $= 1$
- **Total Links**: $|C| = p - 1$

<Diagram type="star-network" caption="Star network for p = 8 nodes." />

**Evaluation**: The central hub forms a severe single point of failure and bandwidth bottleneck.

## Linear Arrays and Rings

### 1. Linear Array (1-D Mesh)
Nodes are arranged along a line. Each internal node connects to two neighbors; end nodes connect to one:
- **Diameter**: $D = p - 1$
- **Bisection Width**: $B_w = 1$
- **Node Degree**: 2 (interior), 1 (ends)
- **Total Links**: $|C| = p - 1$

### 2. Ring Topology ($|C| = p$)
A linear array with an added wraparound link connecting the first and last nodes:
- **Diameter**: $D = \\lfloor p / 2 \\rfloor$
- **Bisection Width**: $B_w = 2$ (two cuts sever the ring into two halves)
- **Node Degree**: $d = 2$ (strictly regular)
- **Total Links**: $|C| = p$

<Diagram type="linear-array-ring" caption="Linear Array (p = 4) vs Ring (p = 6)." />

## 2-D / 3-D Meshes and Tori

### 1. 2-Dimensional Mesh (No Wraparound)
Let $p = s \\times s$, so $s = \\sqrt{p}$:
- Nodes arranged in a rectangular grid of rows and columns.
- **Diameter**: $D = 2(\\sqrt{p} - 1)$
- **Bisection Width**: $B_w = \\sqrt{p}$
- **Node Degree**: 4 (interior), 3 (edges), 2 (corners)
- **Total Links**: $|C| = 2(p - \\sqrt{p})$

### 2. 2-Dimensional Torus (2-D Wraparound Mesh)
Formed by adding wraparound links along both rows and columns:
- **Diameter**: $D = 2 \\lfloor \\sqrt{p} / 2 \\rfloor$
- **Bisection Width**: $B_w = 2\\sqrt{p}$
- **Node Degree**: $d = 4$ (completely regular)
- **Total Links**: $|C| = 2p$

<Diagram type="mesh-2d-3d" caption="4x4 2D Mesh and Torus wraparound links." />

### 3. $d$-Dimensional Mesh ($p = k^d$)
- **Diameter**: $D = d \\cdot p^{1/d} = d(k - 1)$
- **Bisection Width**: $B_w = p^{1 - 1/d} = k^{d-1}$
- **Node Degree**: $2d$ for interior nodes

## Hypercube Architecture (0-D to 4-D)

A **$d$-dimensional hypercube** (or binary $n$-cube) is constructed recursively by taking two $(d-1)$-dimensional hypercubes and connecting corresponding nodes:
- Total nodes: $p = 2^d \\implies d = \\log_2 p$.
- **Node Labeling**: Each node is assigned a unique $d$-bit binary identifier: $b_{d-1} b_{d-2} \\dots b_1 b_0$.
- **Adjacency Rule**: Two nodes are directly connected by an edge if and only if their binary identifiers differ in **exactly one bit position** (Hamming distance $= 1$).
- **Distance Metric**: The shortest distance between nodes $u$ and $v$ is the **Hamming distance** $H(u, v)$ (number of 1s in $u \\oplus v$).
- **Diameter**: $D = d = \\log_2 p$ (at most $\\log_2 p$ hops between antipodal nodes).
- **Bisection Width**: $B_w = \\frac{p}{2}$
- **Node Degree**: $d = \\log_2 p$ (grows logarithmically with cluster size).
- **Total Links**: $|C| = \\frac{p \\log_2 p}{2}$

<Diagram type="hypercube-dimensions" caption="Hypercube family: 0-D point, 1-D line, 2-D square, 3-D cube with binary labels." />

## Binary Trees and Fat Trees

### 1. Complete Binary Tree
- Processors placed either at every node or only at leaves:
  - If processing nodes are placed at all nodes ($p = 2^{k+1} - 1$): Diameter $D = 2 \\log_2((p+1)/2)$.
  - **Bisection Width**: $B_w = 1$ (the root edges form a critical communication bottleneck).
- **Node Degree**: Root $= 2$, Internal $= 3$, Leaf $= 1$.
- **Total Links**: $|C| = p - 1$.

### 2. Fat Tree (Leiserson Architecture)
To eliminate the root bisection bottleneck, Charles Leiserson proposed the **fat tree**, where channel bandwidth increases geometrically toward the root:
- Channel capacity doubles at each ascending level.
- Bisection width scales as $B_w = \\Omega(p)$.
- Widely used in modern Infiniband and datacenter clos-network architectures.

<Diagram type="tree-fat-tree" caption="Complete binary tree vs Fat tree with increasing link capacity." />

## k-ary d-cube Generalization

A **$k$-ary $d$-cube** is a $d$-dimensional wraparound network with $k$ nodes in each dimension:
- Total processors: $p = k^d$
- **Diameter**: $D = d \\cdot \\lfloor k / 2 \\rfloor$
- **Bisection Width**: $B_w = 2k^{d-1}$
- **Node Degree**: $2d$
- **Total Links**: $|C| = d \\cdot p$
- **Special Cases**:
  - If $k = 2$: $2$-ary $d$-cube is a **hypercube** ($p = 2^d$).
  - If $d = 2$: $k$-ary $2$-cube is a **2-D torus** ($p = k^2$).
  - If $d = 3$: $k$-ary $3$-cube is a **3-D torus** (e.g. Cray XT, IBM Blue Gene/L).

## Interactive Topology Explorer

Use the interactive tool below to select any topology and evaluate its metrics live:

<TopologyExplorer />
"""
    },
    "04-metrics-reference-tables": {
        "title": "Interconnection Metrics Reference Tables",
        "description": "Comprehensive reference metrics for Static and Dynamic networks with exam ambiguity watch-outs.",
        "order": 4,
        "readingTimeMinutes": 10,
        "sections": [
            {"id": "static-metrics-table", "title": "Static Topologies Metrics Reference", "level": 2},
            {"id": "dynamic-metrics-table", "title": "Dynamic Networks Reference (Crossbar, Omega)", "level": 2},
            {"id": "watch-out-tree", "title": "Watch Out: Binary Tree Diameter Ambiguity", "level": 2},
        ],
        "body": """## Static Topologies Metrics Reference

The following master reference table compiles the fundamental graph-theoretic measures for all static networks in the CSS 311 syllabus. In this table, $p$ denotes the total number of processing nodes.

| Network Topology | Diameter | Bisection Width | Node Degree (Max) | Network Cost (Links) | Scalability Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Completely Connected** | $1$ | $\\frac{p^2}{4}$ | $p - 1$ | $\\frac{p(p-1)}{2}$ | Non-scalable ($O(p^2)$ links) |
| **Star Network** | $2$ | $1$ | $p - 1$ (hub) | $p - 1$ | Non-scalable ($B_w = 1$) |
| **Linear Array (1D)** | $p - 1$ | $1$ | $2$ | $p - 1$ | Poor latency & bandwidth |
| **Ring ($|C| = p$)** | $\\lfloor \\frac{p}{2} \\rfloor$ | $2$ | $2$ | $p$ | Constant degree, poor latency |
| **2-D Mesh (no wrap)** | $2(\\sqrt{p} - 1)$ | $\\sqrt{p}$ | $4$ | $2(p - \\sqrt{p})$ | Scalable cost, moderate latency |
| **2-D Torus (wraparound)** | $2 \\lfloor \\frac{\\sqrt{p}}{2} \\rfloor$ | $2\\sqrt{p}$ | $4$ | $2p$ | Regular degree 4, balanced |
| **$d$-dim Mesh ($p=k^d$)** | $d(k - 1) = d \\cdot p^{1/d}$ | $p^{1 - 1/d}$ | $2d$ | $d(p - p^{1 - 1/d})$ | High-dim scalability |
| **Hypercube ($p = 2^d$)** | $\\log_2 p$ | $\\frac{p}{2}$ | $\\log_2 p$ | $\\frac{p \\log_2 p}{2}$ | Logarithmic latency, $\\Omega(p)$ bandwidth |
| **Complete Binary Tree** | $2 \\log_2(\\frac{p+1}{2})$ | $1$ | $3$ | $p - 1$ | Log latency, severe bottleneck |
| **Wraparound $k$-ary $d$-cube** | $d \\lfloor \\frac{k}{2} \\rfloor$ | $2k^{d-1}$ | $2d$ | $d \\cdot p$ | Highly scalable general family |

## Dynamic Networks Reference (Crossbar, Omega, Tree)

Dynamic networks deploy dedicated switches between processors and memory. Cost is measured in number of switching elements or internal crosspoints.

| Dynamic Network Type | Diameter | Bisection Width | Switch Cost | Routing Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Crossbar Switch** | $1$ | $p$ | $p^2$ crosspoints | Non-blocking, single stage |
| **Omega Network** | $\\log_2 p$ | $\\frac{p}{2}$ | $\\frac{p}{2} \\log_2 p$ switches | Self-routing via destination bits |
| **Dynamic Binary Tree** | $2 \\log_2 p$ | $1$ | $p - 1$ switches | Simple hierarchical routing |

<Diagram type="crossbar-omega" caption="4x4 Single-stage crossbar vs 8-input 3-stage Omega multistage network." />

## Watch Out: Binary Tree Diameter Ambiguity

<Callout type="warning" title="Watch Out: Binary Tree Diameter Ambiguity">
Lecture slides and textbook sources occasionally cite two different formulas for the diameter of a binary tree:
1. **$D = 2 \\log_2 p$**: This formula assumes that **processing nodes reside only at the $p$ leaves** of the tree, and internal nodes are pure routing switches. To traverse from one leaf, up through the root, and down to another leaf takes $2 \\log_2 p$ hops.
2. **$D = 2 \\log_2(\\frac{p+1}{2})$**: This formula applies when **every node in the complete tree is a processor** (total nodes $p = 2^k - 1$). The height of the tree is $\\log_2(\\frac{p+1}{2})$, so the maximum path between two leaves via the root is $2 \\log_2(\\frac{p+1}{2})$.

**Exam Rule**: When asked in the CSS 311 exam, state the assumption clearly! If processors are at leaves, use $2 \\log_2 p$. If every tree node is a processor, use $2 \\log_2(\\frac{p+1}{2})$.
</Callout>
"""
    },
    "05-routing": {
        "title": "Routing in Interconnection Networks",
        "description": "Store-and-forward vs wormhole routing, and dimension-order E-cube routing in hypercubes with step-by-step worked traces.",
        "order": 5,
        "readingTimeMinutes": 14,
        "sections": [
            {"id": "routing-mechanisms", "title": "Store-and-Forward vs. Wormhole Routing", "level": 2},
            {"id": "ecube-algorithm", "title": "Dimension-Order (E-Cube) Algorithm", "level": 2},
            {"id": "worked-example-010-111", "title": "Worked Slide Example: 010 to 111 (3-D)", "level": 2},
            {"id": "practice-example-0110-1011", "title": "Practice Example: 0110 to 1011 (4-D)", "level": 2},
            {"id": "deadlock-freedom", "title": "Deadlock-Freedom and Virtual Channels", "level": 2},
            {"id": "interactive-router", "title": "Interactive E-Cube Router", "level": 2},
        ],
        "body": """## Store-and-Forward vs. Wormhole Routing

When a message traverses intermediate nodes, two primary routing techniques are used:

1. **Store-and-Forward Routing**:
   - Each intermediate switch buffers the **entire packet** before forwarding it to the next link.
   - Transmission time: $T = t_s + (t_w \\times m) \\times h$, where $h$ is the number of hops, $m$ is message length, $t_s$ is startup time, and $t_w$ is per-word transfer time.
   - Latency depends strongly on the distance $h$.

2. **Cut-Through and Wormhole Routing**:
   - The message is broken into tiny flow control units (**flits**).
   - As soon as the header flit arrives at a switch and its output port is determined, it is forwarded immediately without waiting for remaining data flits.
   - The message "worms" its way through multiple links simultaneously.
   - Transmission time: $T = t_s + t_w \\times m + t_h \\times h$. Since flit hop delay $t_h$ is very small, latency becomes virtually **independent of the number of hops** $h$!

## Dimension-Order (E-Cube) Algorithm

In a $d$-dimensional hypercube, **E-Cube routing** (also known as dimension-order routing) is a deterministic, minimal, deadlock-free routing algorithm:

### Algorithm Procedure
1. Let the source node binary address be $S = s_{d-1} s_{d-2} \\dots s_0$.
2. Let the destination node binary address be $D = d_{d-1} d_{d-2} \\dots d_0$.
3. Compute the **direction vector** by bitwise XOR:

$$
R = S \\oplus D = r_{d-1} r_{d-2} \\dots r_0
$$

4. Scan $R$ from the lowest-order bit (dimension 0) to the highest-order bit (dimension $d-1$).
5. For each bit position $i$ where $r_i = 1$:
   - Route the message across the physical link in dimension $i$.
   - The node's $i$-th bit flips, aligning that coordinate with the destination.
6. The total number of hops traversed is precisely equal to the **Hamming distance** $H(S, D)$ (the number of 1s in $R$).

<Diagram type="ecube-routing" caption="Dimension-order E-cube path from node 010 to node 111." />

## Worked Slide Example: 010 to 111 (3-D)

- **Source**: $S = 010_2$
- **Destination**: $D = 111_2$
- **Step 1: Compute XOR**:
  $$
  R = 010_2 \\oplus 111_2 = 101_2
  $$
  Bits set to 1 are bit 0 and bit 2. Bit 1 is 0.

- **Step 2: Correct differing bits in monotonic order**:
  1. **Hop 1 (correct bit 0)**:
     - Current node: $010_2$.
     - Flip bit 0: $010_2 \\to 011_2$.
     - Intermediate node reached: **011** (traverse dimension 0).
  2. **Hop 2 (correct bit 2)**:
     - Current node: $011_2$.
     - Flip bit 2: $011_2 \\to 111_2$.
     - Destination reached: **111** (traverse dimension 2).

- **Total Hops**: 2 hops ($010 \\to 011 \\to 111$).

## Practice Example: 0110 to 1011 (4-D)

- **Source**: $S = 0110_2$
- **Destination**: $D = 1011_2$
- **Step 1: Compute XOR**:
  $$
  R = 0110_2 \\oplus 1011_2 = 1101_2
  $$
  Bits set to 1 are at positions 0, 2, and 3. Bit 1 is 0.

- **Step 2: Traverse dimensions in ascending order (0, 2, 3)**:
  1. **Hop 1 (dimension 0)**:
     - Current: $0110_2$. Flip bit 0 $\\implies 0111_2$.
  2. **Hop 2 (dimension 2)**:
     - Current: $0111_2$. Flip bit 2 $\\implies 0011_2$.
  3. **Hop 3 (dimension 3)**:
     - Current: $0011_2$. Flip bit 3 $\\implies 1011_2$ (Destination!).

- **Path**: $0110 \\to 0111 \\to 0011 \\to 1011$. Total hops: 3.

## Deadlock-Freedom and Virtual Channels

A routing algorithm is **deadlock-free** if no cyclic dependencies can occur among message buffers:
- In E-cube routing, channels are requested in strictly monotonic dimension order ($0, 1, 2, \\dots, d-1$).
- Because no channel in dimension $i$ can ever wait for a channel in dimension $j < i$, the channel dependency graph is a **Directed Acyclic Graph (DAG)**.
- By Dally and Seitz's theorem, an acyclic channel dependency graph guarantees absolute freedom from deadlock!

## Interactive E-Cube Router

Step through any 3-D or 4-D routing path live with our interactive simulator:

<HypercubeRouter />
"""
    },
    "06-mapping-and-embedding": {
        "title": "Graph Mapping and Embedding into Hypercubes",
        "description": "Dilation, Congestion, Expansion, Binary Reflected Gray Codes, and embedding Rings and Meshes into Hypercubes.",
        "order": 6,
        "readingTimeMinutes": 16,
        "sections": [
            {"id": "embedding-metrics", "title": "Embedding Metrics: Dilation, Congestion, Expansion", "level": 2},
            {"id": "gray-code", "title": "Binary Reflected Gray Code (RGC)", "level": 2},
            {"id": "embedding-ring", "title": "Embedding a Linear Array or Ring into a Hypercube", "level": 2},
            {"id": "embedding-mesh", "title": "Embedding a 2-D Mesh into a Hypercube", "level": 2},
            {"id": "why-mesh-cannot-map-linear", "title": "Why a Mesh Cannot Map to a Linear Array Without Congestion", "level": 2},
            {"id": "interactive-visualizer", "title": "Interactive Gray Code Visualizer", "level": 2},
        ],
        "body": """## Embedding Metrics: Dilation, Congestion, Expansion

In parallel computing, algorithms are designed around natural logical communication graphs $G = (V, E)$ (called the **guest graph**, e.g., a 2D grid for PDEs). To execute this algorithm on a target parallel machine $G' = (V', E')$ (called the **host graph**, e.g., a hypercube), we must **embed** $G$ into $G'$:
- Mapping function $\\phi: V \\to V'$ maps guest processes to host processors.
- Mapping function $\\psi: E \\to \\text{paths in } G'$ maps guest communication edges to physical paths in the host network.

Three formal metrics quantify the efficiency of the embedding:

1. **Dilation**: The maximum length of any path in the host graph $G'$ that corresponds to a single communication edge in the guest graph $G$:
   $$
   \\text{Dilation} = \\max_{(u, v) \\in E} \\text{length}(\\psi(u, v))
   $$
   *Impact*: Dilation bounds the transmission delay of neighboring process communication.

2. **Congestion**: The maximum number of guest edges that are routed over any single physical link in the host graph $G'$:
   $$
   \\text{Congestion} = \\max_{e' \\in E'} |\\{ e \\in E \\mid e' \\in \\psi(e) \\}|
   $$
   *Impact*: Congestion causes link contention and slows down simultaneous transfers.

3. **Expansion**: The ratio of the number of nodes in the host graph to the number of nodes in the guest graph:
   $$
   \\text{Expansion} = \\frac{|V'|}{|V|}
   $$
   *Impact*: Measures processor utilization. If Expansion $= 1$, no processing nodes are wasted.

**Ideal Embedding**: Dilation $= 1$, Congestion $= 1$, Expansion $= 1$. In this case, the guest graph is a **subgraph** of the host graph ($G \\subseteq G'$).

## Binary Reflected Gray Code (RGC)

A Gray code is a binary numeral system where two successive values differ in **strictly one bit**. The **Binary Reflected Gray Code (RGC)** of $d$ bits is defined recursively:
- Base case ($1$ bit):
  $$
  G_1 = \\{0, 1\\}
  $$
- Recursive step: To construct $G_{x+1}$, take $G_x$, append $0$ as a prefix to each code, then reflect (reverse) the list $G_x$ and append $1$ as a prefix:
  $$
  G(i, x+1) = \\begin{cases} 0 \\parallel G(i, x) & \\text{if } i < 2^x \\\\ 1 \\parallel G(2^{x+1} - 1 - i, x) & \\text{if } i \\ge 2^x \\end{cases}
  $$

### 3-Bit Reflected Gray Code Master Table
| Ring / Array Index $i$ | Binary Value | 3-Bit Gray Code $G(i, 3)$ | Hamming Dist to $i+1$ |
| :---: | :---: | :---: | :---: |
| **0** | 000 | **000** | 1 (differs in bit 0) |
| **1** | 001 | **001** | 1 (differs in bit 1) |
| **2** | 010 | **011** | 1 (differs in bit 0) |
| **3** | 011 | **010** | 1 (differs in bit 2) |
| **4** | 100 | **110** | 1 (differs in bit 0) |
| **5** | 101 | **111** | 1 (differs in bit 1) |
| **6** | 110 | **101** | 1 (differs in bit 0) |
| **7** | 111 | **100** | 1 (differs in bit 2 to node 0) |

Notice that the wraparound between index 7 (`100`) and index 0 (`000`) differs in only bit 2, so the Gray code forms a **closed Hamiltonian cycle**!

<Diagram type="gray-code-embedding" caption="Embedding an 8-node ring into a 3-D hypercube using 3-bit Gray code." />

## Embedding a Linear Array or Ring into a Hypercube

To embed a ring of $p = 2^d$ nodes into a $d$-dimensional hypercube:
- Map node $i$ of the ring to hypercube node $G(i, d)$.
- Because $G(i, d)$ and $G(i+1, d)$ differ by exactly 1 bit, they are immediate adjacent neighbors in the hypercube.
- **Results**: Dilation $= 1$, Congestion $= 1$, Expansion $= 1$.
- Thus, any linear array or ring of $2^d$ nodes is a **direct subgraph** of a $d$-dimensional hypercube.

## Embedding a 2-D Mesh into a Hypercube

A $2^r \\times 2^s$ wraparound mesh ($p = 2^{r+s}$ nodes) can be embedded into a $(r+s)$-dimensional hypercube:
- A mesh node at coordinate $(i, j)$ has row index $0 \\le i < 2^r$ and column index $0 \\le j < 2^s$.
- **Mapping Function**: Concatenate the $r$-bit Gray code of $i$ with the $s$-bit Gray code of $j$:
  $$
  \\phi(i, j) = G(i, r) \\parallel G(j, s)
  $$

### Worked Example: $4 \\times 4$ Mesh into a 4-D Hypercube ($r=2, s=2$)
- Mesh node $(1, 1)$:
  - Row index 1 in 2-bit Gray code: $G(1, 2) = 01_2$
  - Column index 1 in 2-bit Gray code: $G(1, 2) = 01_2$
  - Concatenated address: **$0101_2$** (Node 5 in hypercube).
- Neighbors of $(1, 1)$:
  - North $(0, 1) \\implies G(0, 2) \\parallel G(1, 2) = 0001_2$ (Hamming dist from $0101$ is 1).
  - South $(2, 1) \\implies G(2, 2) \\parallel G(1, 2) = 1101_2$ (Hamming dist from $0101$ is 1).
  - West $(1, 0) \\implies G(1, 2) \\parallel G(0, 2) = 0100_2$ (Hamming dist from $0101$ is 1).
  - East $(1, 2) \\implies G(1, 2) \\parallel G(2, 2) = 0111_2$ (Hamming dist from $0101$ is 1).
- Every neighbor in the mesh maps to an immediate physical neighbor in the 4-D hypercube!
- **Results**: Dilation $= 1$, Congestion $= 1$, Expansion $= 1$.

## Why a Mesh Cannot Map to a Linear Array Without Congestion

Can a 2-D mesh be embedded into a linear array with Dilation 1 and Congestion 1? **No.**

### Mathematical Proof by Bisection Width
- Consider a $\\sqrt{p} \\times \\sqrt{p}$ 2-D mesh with bisection width $B_{mesh} = \\sqrt{p}$.
- The host linear array has bisection width $B_{linear} = 1$.
- When partitioning the $p$ nodes into two halves $V_1, V_2$ of $p/2$ nodes each, in the mesh there are at least $\\sqrt{p}$ edges passing between $V_1$ and $V_2$.
- In the linear array, there is only **one single physical link** crossing the bisection cut!
- By the Pigeonhole Principle, that single physical link must carry all $\\sqrt{p}$ crossing edges:

$$
\\text{Congestion} \\ge \\frac{B_{mesh}}{B_{linear}} = \\frac{\\sqrt{p}}{1} = \\sqrt{p}
$$

Alternatively, if we force Congestion $\\le 1$, then long edges must stretch over multiple intermediate links, resulting in average Dilation $\\ge \\Omega(\\sqrt{p})$.

## Interactive Gray Code Visualizer

Explore the mapping of rings and $4 \\times 4$ meshes into hypercubes:

<GrayCodeVisualizer />
"""
    },
    "07-worked-and-practice-problems": {
        "title": "Worked & Practice Problems: Interconnection Networks",
        "description": "Step-by-step solutions for 3-ary 3-cube, 8x8 mesh, 1024-node hypercube, plus 15 additional exam calculation problems.",
        "order": 7,
        "readingTimeMinutes": 20,
        "sections": [
            {"id": "problem-3ary-3cube", "title": "Problem 1: 3-ary 3-cube Full Evaluation", "level": 2},
            {"id": "problem-8x8-mesh", "title": "Problem 2: 8x8 2D Mesh Evaluation", "level": 2},
            {"id": "problem-1024-hypercube", "title": "Problem 3: 1024-Node Hypercube Evaluation", "level": 2},
            {"id": "fifteen-practice-problems", "title": "15 Comprehensive Practice Exam Problems", "level": 2},
        ],
        "body": """## Problem 1: 3-ary 3-cube Full Evaluation

### Question
A parallel computer interconnection network is organized as a **3-ary 3-cube** with wraparound connections. Calculate:
1. Total number of processors ($p$)
2. Network diameter ($D$)
3. Degree of each node ($d$)
4. Bisection width ($B_w$)
5. Total number of communication links ($|C|$)

### Step-by-Step Solution
For a wraparound $k$-ary $d$-cube, parameters are $k = 3$ and $d = 3$:
1. **Total Processors**:
   $$
   p = k^d = 3^3 = 27 \\text{ processors}
   $$
2. **Diameter**:
   $$
   D = d \\cdot \\lfloor k / 2 \\rfloor = 3 \\cdot \\lfloor 3 / 2 \\rfloor = 3 \\cdot 1 = 3 \\text{ hops}
   $$
3. **Node Degree**:
   $$
   d = 2 \\cdot d_{dim} = 2 \\times 3 = 6 \\text{ (regular across all nodes)}
   $$
4. **Bisection Width**:
   $$
   B_w = 2 \\cdot k^{d-1} = 2 \\cdot 3^{3-1} = 2 \\cdot 9 = 18 \\text{ links}
   $$
5. **Total Links**:
   $$
   |C| = d_{dim} \\cdot p = 3 \\times 27 = 81 \\text{ links}
   $$
   *(Verification: $\\frac{1}{2} \\sum \\text{deg} = \\frac{27 \\times 6}{2} = 81$)*.

---

## Problem 2: 8x8 2D Mesh Evaluation

### Question
An $8 \\times 8$ two-dimensional mesh without wraparound has $p = 64$ processing nodes. Calculate:
1. Network diameter ($D$)
2. Bisection width ($B_w$)
3. Total number of communication links ($|C|$)
4. Node degrees for interior, edge, and corner nodes

### Step-by-Step Solution
Here $\\sqrt{p} = s = 8$:
1. **Diameter**:
   $$
   D = 2(s - 1) = 2(8 - 1) = 2 \\times 7 = 14 \\text{ hops}
   $$
   *(Shortest path between opposing corners $(0,0)$ and $(7,7)$)*.
2. **Bisection Width**:
   Dividing the $8 \\times 8$ grid into two $4 \\times 8$ rectangles cuts $s$ horizontal links:
   $$
   B_w = \\sqrt{p} = 8 \\text{ links}
   $$
3. **Total Links**:
   $$
   |C| = 2(p - \\sqrt{p}) = 2(64 - 8) = 2 \\times 56 = 112 \\text{ links}
   $$
4. **Node Degrees**:
   - **Interior nodes** (total $(8-2)^2 = 36$ nodes): Degree $= 4$
   - **Boundary/Edge nodes** (total $4 \\times (8-2) = 24$ nodes): Degree $= 3$
   - **Corner nodes** (total 4 nodes): Degree $= 2$
   - *Verification*: $\\frac{36 \\times 4 + 24 \\times 3 + 4 \\times 2}{2} = \\frac{144 + 72 + 8}{2} = \\frac{224}{2} = 112$ links.

---

## Problem 3: 1024-Node Hypercube Evaluation

### Question
A large-scale multicomputer uses a hypercube topology with $p = 1024$ nodes. Determine:
1. Dimension of the hypercube ($d$)
2. Network diameter ($D$)
3. Degree of each node ($d$)
4. Bisection width ($B_w$)
5. Total number of physical communication links ($|C|$)

### Step-by-Step Solution
1. **Dimension**:
   $$
   p = 2^d = 1024 \\implies d = \\log_2(1024) = 10
   $$
2. **Diameter**:
   $$
   D = d = 10 \\text{ hops}
   $$
3. **Degree**:
   $$
   d = 10 \\text{ channels per node}
   $$
4. **Bisection Width**:
   $$
   B_w = \\frac{p}{2} = \\frac{1024}{2} = 512 \\text{ links}
   $$
5. **Total Links**:
   $$
   |C| = \\frac{p \\cdot d}{2} = \\frac{1024 \\times 10}{2} = 5120 \\text{ links}
   $$

---

## 15 Comprehensive Practice Exam Problems

### Practice 1: 4-ary 2-cube (Torus)
**Q**: A $4$-ary $2$-cube has $k = 4, d = 2$. Compute $p, D, d, B_w, |C|$.
**Ans**: $p = 4^2 = 16$. Diameter $D = 2 \\cdot \\lfloor 4/2 \\rfloor = 4$. Degree $d = 2(2) = 4$. Bisection $B_w = 2 \\cdot 4^{2-1} = 8$. Links $|C| = 2 \\times 16 = 32$.

### Practice 2: 2-D Torus vs 2-D Mesh
**Q**: For $p = 64$, what is the percentage reduction in diameter when adding wraparound links to a 2D mesh?
**Ans**: Mesh diameter $= 2(\\sqrt{64}-1) = 14$. Torus diameter $= 2\\lfloor 8/2 \\rfloor = 8$. Reduction $= \\frac{14 - 8}{14} \\times 100\\% = \\frac{6}{14} \\times 100\\% \\approx 42.86\\%$.

### Practice 3: E-Cube Route in 5-D Hypercube
**Q**: Using E-cube routing, find the complete path and hops from $S = 00101_2$ to $D = 10011_2$.
**Ans**: $S \\oplus D = 00101 \\oplus 10011 = 10110_2$. Bits differing are 1, 2, and 4.
Path: $00101 \\to 00111$ (flip bit 1) $\\to 00011$ (flip bit 2) $\\to 10011$ (flip bit 4). Total hops: 3.

### Practice 4: Complete Binary Tree with 63 Processors
**Q**: If every node in a complete binary tree is a processor and $p = 63$, find tree height $k$ and diameter $D$.
**Ans**: $p = 2^k - 1 = 63 \\implies 2^k = 64 \\implies k = 6$. Height is $k - 1 = 5$. Diameter $D = 2(k - 1) = 10$ hops.

### Practice 5: 3-D Mesh Without Wraparound
**Q**: A 3D mesh has dimensions $4 \\times 4 \\times 4$. Calculate $p$, diameter, and total links.
**Ans**: $p = 4^3 = 64$. Diameter $D = 3 \\times (4 - 1) = 9$. Total links: in each dimension there are $4^2 \\times (4 - 1) = 16 \\times 3 = 48$ links. For 3 dimensions, $|C| = 3 \\times 48 = 144$ links.

### Practice 6: Congestion in Ring to Linear Array Mapping
**Q**: If an 8-node ring is mapped onto an 8-node linear array, what is the minimum dilation of the wraparound edge?
**Ans**: The edge between node 0 and node 7 in the ring must traverse all intermediate links in the linear array: Dilation $= 7$.

### Practice 7: 4-Bit Gray Code Calculation
**Q**: What is the 4-bit Gray code for index 11?
**Ans**: Binary for 11 is $1011_2$. Formula $G(n) = n \\oplus (n >> 1)$: $1011_2 \\oplus 0101_2 = 1110_2$.

### Practice 8: Switch Crosspoints in 16x16 Crossbar
**Q**: How many internal crosspoint switches are required for a $16 \\times 16$ crossbar network?
**Ans**: $p^2 = 16^2 = 256$ crosspoint switches.

### Practice 9: 64-Node Omega Network
**Q**: For a 64-input Omega network, compute the number of stages and total $2 \\times 2$ switches.
**Ans**: Number of stages $= \\log_2(64) = 6$. Switches per stage $= 64 / 2 = 32$. Total switches $= 6 \\times 32 = 192$ switches.

### Practice 10: Scalability of Bisection Width
**Q**: Does a 2D mesh have a scalable bisection width under the definition $B_w = \\Omega(p)$?
**Ans**: No, for a 2D mesh $B_w = \\sqrt{p}$, which is asymptotically smaller than $\\Omega(p)$. Only hypercubes ($B_w = p/2$) and fat trees satisfy $\\Omega(p)$.

### Practice 11: Linear Array Bisection Bandwidth
**Q**: If each link in a 1000-node linear array has 100 Gbps bandwidth, what is the bisection bandwidth?
**Ans**: $B_w = 1 \\implies 1 \\times 100\\text{ Gbps} = 100\\text{ Gbps}$, regardless of 1000 nodes.

### Practice 12: Degree and Links in 6-D Hypercube
**Q**: Calculate node degree and total links for a 6-D hypercube ($p = 64$).
**Ans**: Degree $d = 6$. Links $|C| = (64 \\times 6) / 2 = 192$ links.

### Practice 13: 2-D Mesh Corner vs Interior Latency
**Q**: In a $10 \\times 10$ mesh without wraparound, what is the distance between node $(0,0)$ and node $(9,9)$?
**Ans**: Distance $= |0-9| + |0-9| = 9 + 9 = 18$ hops (equal to diameter $2(10-1)$).

### Practice 14: Star Network Hub Failure
**Q**: If the central hub fails in an 8-node star network, what is the resulting arc connectivity and number of isolated components?
**Ans**: Arc connectivity is 1. Upon hub failure, all 7 peripheral nodes become completely isolated disconnected components.

### Practice 15: Embedding $8 \\times 4$ Mesh into 5-D Hypercube
**Q**: What is the 5-bit hypercube coordinate of mesh node $(3, 2)$ where rows have 8 nodes ($r=3$) and columns have 4 nodes ($s=2$)?
**Ans**: Row 3 in 3-bit Gray code $= 010_2$. Col 2 in 2-bit Gray code $= 11_2$. Concatenated address: $01011_2$ (Node 11).
"""
    }
}

out_dir = os.path.join(os.getcwd(), 'content/networks')
os.makedirs(out_dir, exist_ok=True)

for slug, data in topics.items():
    file_path = os.path.join(out_dir, f"{slug}.mdx")
    with open(file_path, "w") as f:
        f.write("---\n")
        f.write(f"id: {slug}\n")
        f.write(f"slug: {slug}\n")
        f.write(f"technology: networks\n")
        f.write(f"order: {data['order']}\n")
        f.write(f"title: \"{data['title']}\"\n")
        f.write(f"description: \"{data['description']}\"\n")
        f.write(f"readingTimeMinutes: {data['readingTimeMinutes']}\n")
        f.write("sections:\n")
        for sec in data["sections"]:
            f.write(f"  - id: {sec['id']}\n")
            f.write(f"    title: \"{sec['title']}\"\n")
            f.write(f"    level: {sec['level']}\n")
        f.write("---\n\n")
        f.write(data["body"].strip())
        f.write("\n")
    print(f"Generated {file_path}")

print("All Part C MDX files generated successfully!")
