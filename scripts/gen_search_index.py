import json
import os
import glob
import re

search_items = []

# 1. Parse MPI MDX files
mpi_files = sorted(glob.glob('content/mpi/*.mdx'))
for f in mpi_files:
    content = open(f).read()
    slug = os.path.basename(f).replace('.mdx', '')
    title_match = re.search(r'title:\s*(.*)', content)
    desc_match = re.search(r'description:\s*(.*)', content)
    title = title_match.group(1).strip() if title_match else slug
    desc = desc_match.group(1).strip() if desc_match else ''

    search_items.append({
        'id': f'mpi-{slug}',
        'title': title,
        'category': 'MPI Topic',
        'path': f'/mpi/{slug}/',
        'keywords': f'mpi {slug} {title.lower()} {desc.lower()}',
        'snippet': desc
    })

# 2. Parse OpenMP MDX files
omp_files = sorted(glob.glob('content/openmp/*.mdx'))
for f in omp_files:
    content = open(f).read()
    slug = os.path.basename(f).replace('.mdx', '')
    title_match = re.search(r'title:\s*(.*)', content)
    desc_match = re.search(r'description:\s*(.*)', content)
    title = title_match.group(1).strip() if title_match else slug
    desc = desc_match.group(1).strip() if desc_match else ''

    search_items.append({
        'id': f'openmp-{slug}',
        'title': title,
        'category': 'OpenMP Topic',
        'path': f'/openmp/{slug}/',
        'keywords': f'openmp omp {slug} {title.lower()} {desc.lower()}',
        'snippet': desc
    })

# 3. Add Practice & Mock Exams
search_items.append({
    'id': 'practice-mpi',
    'title': 'MPI Solved Questions (40+ Problems)',
    'category': 'Practice',
    'path': '/practice/mpi/',
    'keywords': 'mpi questions practice solved conceptual output bug code',
    'snippet': '42+ solved questions with step-by-step answers across 5 question categories.'
})

search_items.append({
    'id': 'practice-openmp',
    'title': 'OpenMP Solved Questions (40+ Problems)',
    'category': 'Practice',
    'path': '/practice/openmp/',
    'keywords': 'openmp questions practice solved conceptual output bug code race condition',
    'snippet': '42+ solved questions with step-by-step answers across 5 question categories.'
})

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
    'id': 'flashcards',
    'title': 'Interactive Flashcard Revision Deck (65 Cards)',
    'category': 'Revision Tools',
    'path': '/flashcards/',
    'keywords': 'flashcards revision terms definitions syntax pitfalls rules memory',
    'snippet': 'Flip through 65 curated revision cards covering core definitions, directives, and traps.'
})

with open('content/search-index.json', 'w') as f:
    json.dump(search_items, f, indent=2)

print(f'Successfully generated content/search-index.json with {len(search_items)} indexed items')
