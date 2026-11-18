# Nested shadow-output experiment

## Decision

Retain the current shadow-first `split_off`/append executor. A request-local
append-only arena with ordered ranges reduced allocation traffic for nested
shadows, but wide siblings became **31.7% slower with fresh JSON and 130.6% slower
with prepared state**. Their peak live requested heap increased **44.8% and
60.9%**. Small-page latency also regressed. This prototype does not meet the
acceptance bar; this change ships measurement tooling and regression tests,
not a renderer speedup.

The prototype evaluated shadows before host attributes, recorded host insertion
positions, and flattened ranges into one owned UTF-8 `String` on success.
Empty/unreordered output avoided flattening. At most three range entries per
executed host plus one trailing range were needed; body-depth and step/output
budgets bounded request scratch. Byte-budget checks retained the existing
shadow/host evaluation order. The extra arena/output overlap and sibling
bookkeeping outweighed its nested-copy savings on important workloads.

## Method

Measured on 2026-11-18 against FAST commit
`4ad07a7e4dfc0447f566959b38ebd09ecfb112b3`, using Windows NT 10.0.26300.0,
16 logical processors (AMD64 Family 25 Model 1 Stepping 1, AuthenticAMD),
Rust/Cargo 1.100.0, LLVM 23.1.5, and release `x86_64-pc-windows-msvc` builds.
No custom Rust flags were set.

Five rounds alternate baseline/candidate order for each workload. Both binaries
use identical fixtures, harness and compiler. Each child warms up 20 calls.
The base iteration count is 300: small pages multiply it by 1000, mixed content
by 20, binding-heavy content by one, and other cases by four. Allocator
diagnostics use three requests in separate child processes.

Fresh JSON includes parsing/validation through complete owned output. Prepared
state borrows a previously validated snapshot through complete owned output.
Compilation, artifact loading, state preparation, output verification, hashing,
file I/O and output destruction are outside render-call wall timers. Final
flattening is inside. Every result is byte-checked; all workloads, boundaries,
passes and rounds matched baseline exactly. All post-output-drop request
retained-byte deltas were zero. Artifact/prepared-state ownership is measured
separately by the runner and was unchanged.

The corpus includes 32-level nested components, 256 repeated siblings, mixed
light/shadow trees, 12 levels of mostly static shadows, 16 binding-heavy levels,
256 empty shadows, and one small bound component. These are warm-cache local
microbenchmarks, not deployment-wide performance claims.

## Results

Wall time is the median of five process medians. CPU is the mean process-loop
CPU time per request. Percentages below are `(candidate / baseline - 1) * 100`:
negative means faster/less and positive means slower/more.

| Workload | Boundary | Wall time | Loop CPU | Requested allocation bytes | Peak live requested bytes |
|---|---|---:|---:|---:|---:|
| Deep nested | Fresh JSON | -24.71% | -22.92% | -75.78% | +1.04% |
| Deep nested | Prepared | -42.99% | -27.66% | -75.81% | +1.05% |
| Wide siblings | Fresh JSON | +31.68% | +20.93% | +5.24% | +44.82% |
| Wide siblings | Prepared | +130.62% | +86.73% | +6.00% | +60.92% |
| Mixed light/shadow | Fresh JSON | -2.46% | -6.78% | -39.55% | +15.94% |
| Mixed light/shadow | Prepared | -1.09% | -3.45% | -39.87% | +16.42% |
| Mostly static | Fresh JSON | -31.64% | -18.63% | -60.39% | +0.47% |
| Mostly static | Prepared | -17.50% | -21.00% | -60.42% | +0.47% |
| Binding-heavy | Fresh JSON | -29.10% | -36.68% | -64.87% | +0.19% |
| Binding-heavy | Prepared | -24.63% | -29.09% | -64.88% | +0.19% |
| Empty shadows | Fresh JSON | -4.07% | -7.04% | 0.00% | 0.00% |
| Empty shadows | Prepared | +1.46% | -2.33% | 0.00% | 0.00% |
| Small page | Fresh JSON | +6.67% | +15.13% | +14.04% | +16.51% |
| Small page | Prepared | +11.11% | +14.74% | +23.26% | +35.38% |

Absolute diagnostic values below are **baseline/candidate**. Bytes include
reallocation's full new requested capacity, not only growth.

| Workload | Boundary | Allocations | Reallocations | Requested bytes | Peak live bytes |
|---|---|---:|---:|---:|---:|
| Deep nested | Fresh JSON | 73/43 | 72/77 | 1395389/337921 | 201576/203681 |
| Deep nested | Prepared | 67/37 | 71/76 | 1394974/337506 | 201185/203290 |
| Wide siblings | Fresh JSON | 2057/1803 | 532/540 | 955649/1005761 | 403482/584332 |
| Wide siblings | Prepared | 1281/1027 | 525/533 | 834877/884989 | 296846/477696 |
| Mixed light/shadow | Fresh JSON | 167/146 | 68/73 | 51654/31225 | 13207/15312 |
| Mixed light/shadow | Prepared | 161/140 | 67/72 | 51239/30810 | 12816/14921 |
| Mostly static | Fresh JSON | 33/23 | 30/34 | 901787/357217 | 231284/232365 |
| Mostly static | Prepared | 27/17 | 29/33 | 901372/356802 | 230893/231974 |
| Binding-heavy | Fresh JSON | 6185/6171 | 3120/3124 | 2958110/1039186 | 584232/585313 |
| Binding-heavy | Prepared | 6179/6165 | 3119/3123 | 2957695/1038771 | 583841/584922 |
| Empty shadows | Fresh JSON | 1289/1289 | 530/530 | 255417/255417 | 129496/129496 |
| Empty shadows | Prepared | 513/513 | 523/523 | 134645/134645 | 22860/22860 |
| Small page | Fresh JSON | 11/12 | 8/8 | 1047/1194 | 733/854 |
| Small page | Prepared | 5/6 | 7/7 | 632/779 | 342/463 |

## Limitations

Requested live heap bytes are not RSS, allocator usable sizes, fragmentation,
stack usage, OS metadata, or transient overlap inside `realloc`. Copied bytes
and process RSS were not measured; allocation traffic must not be interpreted
as copy traffic. Instrumentation is disabled in timing passes, but the
allocator shim still adds one relaxed flag load per allocator call.

Windows process CPU includes verification, timers and result destruction, unlike
render-call wall time. CPU is OS-quantized; small-page wall medians are also
timer-quantized. There are no statistical confidence intervals. Deep fresh-JSON
process medians ranged from 121.3 to 303.8 microseconds for baseline and 123.3 to
194.4 for candidate. Deep prepared mean latency improved 27.00%, rather than
the 42.99% median improvement. Small differences should not be overinterpreted.
The wide prepared regression remains clear: baseline process medians ranged
174.4-325.3 microseconds versus candidate 407.6-471.5.

## Reproduction

The unapplied [rejected prototype patch](../../../crates/microsoft-fast-build/benches/rejected-shadow-arena.patch)
is an experiment artifact, not part of the production executor.
Create two isolated checkouts of the baseline commit, then copy the benchmark
example into their existing `examples` directories. Apply the patch **only**
to the candidate checkout. Do not patch the active development tree.

From the current repository root in PowerShell, with Git, Rust and MSVC build
tools available:

```powershell
$baseline = "C:\bench\fast-shadow-baseline"
$candidate = "C:\bench\fast-shadow-candidate"
git worktree add --detach $baseline 4ad07a7e4dfc0447f566959b38ebd09ecfb112b3
git worktree add --detach $candidate 4ad07a7e4dfc0447f566959b38ebd09ecfb112b3
$patch = (Resolve-Path .\crates\microsoft-fast-build\benches\rejected-shadow-arena.patch).Path
git -C $candidate apply --check --unidiff-zero --ignore-space-change $patch
git -C $candidate apply --unidiff-zero --ignore-space-change $patch
.\crates\microsoft-fast-build\benches\run-shadow-comparison.ps1 `
    -BaselineRoot $baseline -CandidateRoot $candidate `
    -OutputDirectory "C:\bench\shadow-results" -Iterations 300 -Rounds 5
```

The runner builds both binaries before measuring and writes machine/source/binary
identities, per-process results, exact output bytes, SHA256 hashes, allocation
diagnostics, and aggregate JSON/CSV comparisons. Keep the machine otherwise idle.
The harness comment may evolve without changing workload definitions; the
measured harness SHA256 was
`9895b1c9ddfd7dee129e05a38907bd9d3c169968234aa92fa08fe8e52f91bb52`.
Measured `native.rs` SHA256 values (CRLF snapshot bytes):

- Baseline: `3899422de2f8a9768565dc81dd5e514b43667895af8852514c8ce344027a4681`
- Candidate: `d2807960ce7b6cfaf5f9a286f7d158fecd0960368b7664d368400160a9bfda81`

Normalize line endings before comparing source hashes from other checkouts.
No renderer schema, public API, hydration marker version, or resource limit
changes are required by the retained tooling and tests.
