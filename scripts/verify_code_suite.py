#!/usr/bin/env python3
import glob
import re
import os
import sys
import subprocess
import json

CLANG = '/opt/homebrew/opt/llvm/bin/clang'
MPICC = '/opt/homebrew/bin/mpicc'
MPIRUN = '/opt/homebrew/bin/mpirun'

os.makedirs('sandbox', exist_ok=True)

results = []

def run_program_test(name, title, category, code, technology='mpi', np='4'):
    src_file = f'sandbox/{name}.c'
    bin_file = f'sandbox/{name}.out'
    with open(src_file, 'w') as f:
        f.write(code)

    is_hybrid = ('<mpi.h>' in code or '"mpi.h"' in code) and ('#pragma omp' in code or '<omp.h>' in code or '"omp.h"' in code)
    is_mpi = technology == 'mpi' or '<mpi.h>' in code

    if is_hybrid:
        comp_cmd = [MPICC, '-fopenmp', '-O2', src_file, '-o', bin_file, '-lm']
    elif is_mpi:
        comp_cmd = [MPICC, '-O2', src_file, '-o', bin_file, '-lm']
    else:
        comp_cmd = [CLANG, '-fopenmp', '-O2', src_file, '-o', bin_file, '-lm']

    comp = subprocess.run(comp_cmd, capture_output=True, text=True)
    if comp.returncode != 0:
        return {
            'id': name,
            'title': title,
            'category': category,
            'technology': 'hybrid' if is_hybrid else ('mpi' if is_mpi else 'openmp'),
            'status': 'COMPILE_FAILED',
            'compile_cmd': ' '.join(comp_cmd),
            'run_cmd': '',
            'stdout': '',
            'stderr': comp.stderr.strip(),
            'code': code
        }

    if is_mpi or is_hybrid:
        run_cmd = [MPIRUN, '--oversubscribe', '-np', np, bin_file]
        try:
            run = subprocess.run(run_cmd, capture_output=True, text=True, timeout=12)
        except subprocess.TimeoutExpired:
            return {
                'id': name,
                'title': title,
                'category': category,
                'technology': 'hybrid' if is_hybrid else ('mpi' if is_mpi else 'openmp'),
                'status': 'TIMEOUT',
                'compile_cmd': ' '.join(comp_cmd),
                'run_cmd': ' '.join(run_cmd),
                'stdout': '',
                'stderr': 'Execution timed out after 12 seconds',
                'code': code
            }
    else:
        run_cmd = [bin_file]
        env = os.environ.copy()
        env['OMP_NUM_THREADS'] = np
        try:
            run = subprocess.run(run_cmd, env=env, capture_output=True, text=True, timeout=12)
        except subprocess.TimeoutExpired:
            return {
                'id': name,
                'title': title,
                'category': category,
                'technology': 'openmp',
                'status': 'TIMEOUT',
                'compile_cmd': ' '.join(comp_cmd),
                'run_cmd': ' '.join(run_cmd),
                'stdout': '',
                'stderr': 'Execution timed out after 12 seconds',
                'code': code
            }

    status = 'SUCCESS' if run.returncode == 0 else 'RUNTIME_FAILED'
    return {
        'id': name,
        'title': title,
        'category': category,
        'technology': 'hybrid' if is_hybrid else ('mpi' if is_mpi else 'openmp'),
        'status': status,
        'compile_cmd': ' '.join(comp_cmd),
        'run_cmd': ' '.join(run_cmd),
        'stdout': run.stdout.strip(),
        'stderr': run.stderr.strip(),
        'code': code
    }

print("=== 1. VERIFYING MOCK EXAM CODES ===")
mpi_exam = json.load(open('content/exams/mpi-mock.json'))
for t in mpi_exam['tasks']:
    res = run_program_test(t['id'], t['title'], 'Mock Exam (MPI)', t['referenceCode'], technology='mpi', np='4')
    print(f"Mock {t['id']}: {res['status']}")
    results.append(res)

omp_exam = json.load(open('content/exams/openmp-mock.json'))
for t in omp_exam['tasks']:
    res = run_program_test(t['id'], t['title'], 'Mock Exam (OpenMP)', t['referenceCode'], technology='openmp', np='4')
    print(f"Mock {t['id']}: {res['status']}")
    results.append(res)

print("\n=== 2. VERIFYING MDX TOPIC CODES ===")
all_mdx = sorted(glob.glob('content/mpi/*.mdx') + glob.glob('content/openmp/*.mdx'))

for mdx in all_mdx:
    is_mpi = 'mpi' in mdx
    base = os.path.basename(mdx).replace('.mdx', '')
    content = open(mdx).read()
    blocks = re.findall(r'```c\s*(.*?)\s*```', content, re.DOTALL)
    for idx, block in enumerate(blocks):
        if 'int main(' in block or 'void main(' in block:
            tag = f"{base}_prog{idx+1}"
            np = '4'
            if 'cannon' in tag.lower():
                np = '4'
            res = run_program_test(tag, f"{base} snippet #{idx+1}", 'Topic Tutorial', block, technology='mpi' if is_mpi else 'openmp', np=np)
            print(f"MDX {tag}: {res['status']}")
            results.append(res)

print("\n=== 3. VERIFYING MPI QUESTIONS (write-the-program & find-the-bug) ===")
mpi_q = json.load(open('content/questions/mpi-questions.json'))
for q in mpi_q:
    code = q.get('correctCode')
    if code and ('int main(' in code or 'void main(' in code):
        np = '4'
        if 'ping' in q['title'].lower() or 'ping' in q['prompt'].lower():
            np = '2'
        res = run_program_test(f"mpi_{q['id']}", q['title'], f"MPI Question ({q['category']})", code, technology='mpi', np=np)
        print(f"Question {q['id']}: {res['status']}")
        results.append(res)

print("\n=== 4. VERIFYING OPENMP QUESTIONS (write-the-program & find-the-bug) ===")
omp_q = json.load(open('content/questions/openmp-questions.json'))
for q in omp_q:
    code = q.get('correctCode')
    if code and ('int main(' in code or 'void main(' in code):
        res = run_program_test(f"omp_{q['id']}", q['title'], f"OpenMP Question ({q['category']})", code, technology='openmp', np='4')
        print(f"Question {q['id']}: {res['status']}")
        results.append(res)

passed = [r for r in results if r['status'] == 'SUCCESS']
failed = [r for r in results if r['status'] != 'SUCCESS']
print(f"\n==========================================")
print(f"TOTAL VERIFIED: {len(passed)}/{len(results)} SUCCESS")
print(f"==========================================")
if failed:
    print(f"FAILURES ({len(failed)}):")
    for f in failed:
        print(f"- {f['id']}: {f['status']}")
        print(f"  Compile: {f['compile_cmd']}")
        print(f"  Error: {f['stderr'][:250]}")

# Generate VERIFIED.md
with open('VERIFIED.md', 'w') as vf:
    vf.write("# Compilation and Execution Verification Log\n\n")
    vf.write("This document logs the automated sandbox compilation and execution verification for all standalone C programs in this study guide repository.\n\n")
    vf.write("## Test Environment\n\n")
    vf.write("- **MPI Compiler & Runtime:** OpenMPI 5.x (`/opt/homebrew/bin/mpicc`, `/opt/homebrew/bin/mpirun`)\n")
    vf.write("- **OpenMP Compiler:** Homebrew LLVM/Clang with OpenMP support (`/opt/homebrew/opt/llvm/bin/clang -fopenmp`)\n")
    vf.write("- **Architecture:** Apple Silicon (macOS Darwin arm64)\n")
    vf.write(f"- **Total Programs Tested:** {len(results)}\n")
    vf.write(f"- **Programs Passing:** {len(passed)}\n")
    vf.write(f"- **Programs Failing:** {len(failed)}\n\n")

    vf.write("## Summary Table\n\n")
    vf.write("| ID | Category | Title | Technology | Status |\n")
    vf.write("| :--- | :--- | :--- | :--- | :--- |\n")
    for r in results:
        status_badge = "PASS" if r['status'] == 'SUCCESS' else f"FAIL ({r['status']})"
        vf.write(f"| `{r['id']}` | {r['category']} | {r['title']} | {r['technology'].upper()} | **{status_badge}** |\n")

    vf.write("\n## Detailed Execution Logs\n\n")
    for r in results:
        vf.write(f"### `{r['id']}`: {r['title']}\n\n")
        vf.write(f"- **Category:** {r['category']}\n")
        vf.write(f"- **Status:** `{r['status']}`\n")
        vf.write(f"- **Compile Command:** `{r['compile_cmd']}`\n")
        vf.write(f"- **Run Command:** `{r['run_cmd']}`\n\n")
        vf.write("**Observed Output:**\n")
        vf.write("```text\n")
        if r['stdout']:
            vf.write(r['stdout'] + "\n")
        elif r['stderr']:
            vf.write("STDERR:\n" + r['stderr'] + "\n")
        else:
            vf.write("[Program exited normally with 0 output]\n")
        vf.write("```\n\n")
        vf.write("---\n\n")

print("VERIFIED.md generated successfully.")
