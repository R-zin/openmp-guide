import json
import os
import glob
import re

search_items = []

modules = [
    ('mpi', 'MPI Topic', '/mpi'),
    ('openmp', 'OpenMP Topic', '/openmp'),
    ('networks', 'Interconnection Networks', '/networks'),
    ('vectors', 'Vector Processors', '/vectors'),
    ('performance', 'Performance Tools', '/performance')
]

for mod, category, base_path in modules:
    files = sorted(glob.glob(f'content/{mod}/*.mdx'))
    for f in files:
        content = open(f).read()
        slug = os.path.basename(f).replace('.mdx', '')
        title_match = re.search(r'title:\s*["\']?(.*?)["\']?$', content, re.MULTILINE)
        desc_match = re.search(r'description:\s*["\']?(.*?)["\']?$', content, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else slug
        desc = desc_match.group(1).strip() if desc_match else ''

        search_items.append({
            'id': f'{mod}-{slug}',
            'title': title,
            'category': category,
            'path': f'{base_path}/{slug}/',
            'keywords': f'{mod} {slug} {title.lower()} {desc.lower()}',
            'snippet': desc
        })

# Practice Questions
practice_modules = [
    ('mpi', 'MPI Solved Questions (40+ Problems)', '/practice/mpi/', 'mpi questions practice solved conceptual output bug code', '42+ solved questions with step-by-step answers across 5 question categories.'),
    ('openmp', 'OpenMP Solved Questions (40+ Problems)', '/practice/openmp/', 'openmp questions practice solved conceptual output bug code race condition', '42+ solved questions with step-by-step answers across 5 question categories.'),
    ('networks', 'Interconnection Networks Solved Questions (25+ Problems)', '/practice/networks/', 'networks topology routing e-cube hypercube mesh torus bisection diameter dilation congestion', '25+ solved questions covering network metrics, E-cube routing, and graph embeddings.'),
    ('vectors', 'Vector Processors Solved Questions (25+ Problems)', '/practice/vectors/', 'vector processors vmips pipelining strip-mining chaining convoy throughput speedup simd', '25+ solved questions covering VMIPS assembly, strip-mining, pipeline timing, and vector speedup.'),
    ('performance', 'Performance Analysis & Tools Solved Questions (25+ Problems)', '/practice/performance/', 'performance tools amdahl gustafson karp-flatt score-p scalasca mpiP pmpi tracing profiling otf2', '25+ solved questions on bottleneck diagnosis, scaling laws, metrics, and HPC tool ecosystems.')
]

for pid, title, path, keywords, snippet in practice_modules:
    search_items.append({
        'id': f'practice-{pid}',
        'title': title,
        'category': 'Practice',
        'path': path,
        'keywords': keywords,
        'snippet': snippet
    })

# Mock Exams
search_items.append({
    'id': 'mock-mpi',
    'title': 'Mock Lab Exam 1: MPI (3 Tasks, 50 Marks)',
    'category': 'Mock Exam',
    'path': '/practice/mock-mpi/',
    'keywords': 'mock exam mpi lab test tasks marking scheme ring trapezoidal odd-even',
    'snippet': '3 programming tasks with suggested time, marking scheme, and full solutions.'
})

search_items.append({
    'id': 'mock-openmp',
    'title': 'Mock Lab Exam 2: OpenMP (3 Tasks, 50 Marks)',
    'category': 'Mock Exam',
    'path': '/practice/mock-openmp/',
    'keywords': 'mock exam openmp lab test tasks pi twin primes gaussian elimination',
    'snippet': '3 programming tasks with suggested time, marking scheme, and full solutions.'
})

search_items.append({
    'id': 'mock-theory',
    'title': 'End-Semester Theory Mock Exam (5 Questions, 50 Marks, 120 Mins)',
    'category': 'Mock Exam',
    'path': '/practice/mock-theory/',
    'keywords': 'theory mock exam end-term css311 networks vectors mpi openmp performance 50 marks marking rubric model answer',
    'snippet': 'Comprehensive 5-question end-semester theory exam with detailed marking rubric covering all syllabus units.'
})

# Formula Sheet
search_items.append({
    'id': 'formula-sheet',
    'title': 'High-Yield Formula Sheet (Printable 1-Page Summary)',
    'category': 'Revision Tools',
    'path': '/practice/formulas/',
    'keywords': 'formula sheet cheat sheet formulas amdahl gustafson karp-flatt cannon pipeline speedup network metrics edp',
    'snippet': 'Complete reference cheat sheet for Amdahl, Gustafson, Karp-Flatt, Network Topologies, Pipeline speedup, and Cannon algorithm.'
})

# Flashcards
search_items.append({
    'id': 'flashcards',
    'title': 'Interactive Flashcard Revision Deck (120+ Cards)',
    'category': 'Revision Tools',
    'path': '/flashcards/',
    'keywords': 'flashcards revision terms definitions syntax pitfalls rules memory networks vectors performance mpi openmp',
    'snippet': 'Flip through 123 curated revision cards covering core definitions, topologies, vector concepts, and performance metrics.'
})

with open('content/search-index.json', 'w') as f:
    json.dump(search_items, f, indent=2)

print(f'Successfully generated content/search-index.json with {len(search_items)} indexed items')

