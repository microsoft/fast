# Native build-metadata loading experiment

## Decision and scope

Validate schema-2 build inputs without constructing an owned JSON value tree that
the native loader immediately discards. Execution still owns the same typed plan;
program decoding, public APIs and artifact schemas do not change.

This is an **in-memory artifact-loading optimization**, not a warmed-rendering
optimization. Metadata-dominant synthetic artifacts load 10-64% faster here.
Ordinary small, deep and mostly-static cases improve modestly. The plan-heavy
binding case is 2-4% slower in repeated comparisons: this is a measured tradeoff,
not claimed unchanged. Peak savings depend on whether metadata or program
preparation dominates the load.

The private visitor decodes every metadata value, including unused and overwritten
values. It preserves shape validation, decoded last-duplicate-key semantics,
Unicode/number errors, nesting limits, complete parsing before schema errors,
schema-1 compatibility and independent artifact ownership. Escaped strings still
use Serde's temporary scratch buffer; source bytes must still be read and parsed.

## Method

- Baseline: freshly pulled main `544a7306c5a5c93527a3c9398776ffb8aa654a73`.
- Apple M3 Pro, macOS ARM64, shared/nonexclusive machine; Rust 1.93.1,
  LLVM 21.1.8, Node 22.22.1.
- Separate locked default-release builds with two Cargo jobs. No release-profile
  overrides, CPU-specific flags, dependency or allocator changes. Copy the
  candidate's benchmark example into the exact-main crate snapshot so both
  binaries have identical fixtures and instrumentation.
- All own builds/tests complete before timing. No own compilation, test runner,
  profiler or allocator diagnostic overlaps latency comparisons.
- Load timing excludes compilation, file I/O, addon loading, verification and
  artifact destruction. Each independently owned result is rendered and its
  exact bytes checked outside the timer, then dropped.
- Nine alternating baseline/candidate process rounds per load fixture, with
  20 warmups and iterations calibrated to about 250 ms of baseline load time,
  bounded to 50-200,000. Report medians of process medians.
- Seven alternating process rounds for fresh-JSON and prepared Rust rendering,
  independently warmed, targeting about 200 ms per process. Node Buffer and
  complete string delivery each warm 30 times and use seven process rounds,
  with GC before each timed boundary; report medians of process averages.
- Three-sample allocator diagnostics run separately. All artifact, state and
  complete output identities match across revisions.

Elapsed-time percentages are `100 * (candidate / baseline - 1)`, not throughput
changes. Small deltas on this shared machine are not equivalence guarantees.
Linux/Windows performance and cold disk/process startup were not measured.

## Artifact load latency

Microseconds per load:

| Workload | Artifact bytes | Baseline | Candidate | Change |
|---|---:|---:|---:|---:|
| small-page | 650 | 4.79 | 4.50 | -6.1% |
| wide-siblings | 2,402 | 10.17 | 10.08 | -0.8% |
| deep-nested | 143,985 | 128.12 | 118.96 | -7.2% |
| mixed-light-shadow | 16,951 | 117.79 | 114.29 | -3.0% |
| mostly-static | 201,841 | 91.46 | 87.00 | -4.9% |
| binding-heavy | 1,193,025 | 12,383.92 | 12,682.17 | **+2.4%** |
| empty-shadows | 1,235 | 8.38 | 8.29 | -1.0% |
| metadata-entry | 1,016,056 | 111.71 | 97.33 | -12.9% |
| metadata-plain | 1,032,353 | 293.04 | 137.21 | -53.2% |
| metadata-escaped | 1,294,497 | 1,614.17 | 1,446.21 | -10.4% |
| metadata-nested | 1,096,865 | 652.67 | 238.46 | -63.5% |
| metadata-sources | 1,019,133 | 177.38 | 123.79 | -30.2% |

The five `metadata-*` cases deliberately retain a tiny executable paragraph while
enlarging discarded inputs: one large entry string, 1,024 template strings,
escaped/Unicode template strings, nested component-definition metadata, or
1,024 `templateSources` strings. They isolate metadata cost, not representative
end-to-end application throughput.

The binding-heavy regression was investigated rather than discarded. Another
nine-round run with the label/process order reversed measured candidate
12,236.71 versus baseline 11,785.88 microseconds, **3.8% slower**.
An identical-baseline-binary A/A comparison differed by 0.8%. Its allocation
traffic is dominated by program decoding, not discarded metadata; the saved
111,803 requested bytes are only 0.4% of its total load allocations. The modest
plan-heavy cost is accepted in exchange for eliminating the discarded metadata
graph and the substantial metadata-heavy savings; no universal loading win is
claimed.

## Load allocation diagnostics

Counts exclude reallocations; byte totals include allocator-requested growth.

| Workload | Allocation calls, baseline -> candidate | Requested bytes, baseline -> candidate | Peak live requested bytes, baseline -> candidate |
|---|---:|---:|---:|
| small-page | 114 -> 102 | 14,310 -> 12,279 | 10,481 -> 10,139 |
| deep-nested | 1,816 -> 1,575 | 472,279 -> 377,524 | 351,334 -> 351,334 |
| mostly-static | 763 -> 665 | 478,187 -> 367,540 | 357,974 -> 357,974 |
| binding-heavy | 248,157 -> 248,031 | 26,705,660 -> 26,593,857 | 21,593,253 -> 21,593,253 |
| metadata-entry | 44 -> 40 | 1,020,652 -> 4,198 | 1,020,008 -> 3,554 |
| metadata-plain | 2,262 -> 40 | 1,141,278 -> 4,198 | 1,140,634 -> 3,554 |
| metadata-escaped | 2,263 -> 41 | 1,307,413 -> 6,493 | 1,305,619 -> 4,699 |
| metadata-nested | 11,478 -> 40 | 2,606,622 -> 4,198 | 2,605,978 -> 3,554 |
| metadata-sources | 1,068 -> 40 | 1,086,066 -> 4,198 | 1,052,782 -> 3,554 |

Unescaped metadata containers no longer allocate per key/value. Escaped metadata
still grows deserializer scratch: nine reallocations in both escaped runs,
versus two in both plain runs. This is not a zero-allocation loader.

Owned plan storage is identical between revisions, and dropping each loaded
artifact leaves zero tracked requested bytes. The ordinary binding-heavy case
retains 1,693,783 requested bytes in either plan. Unchanged ordinary peaks are
expected when typed-program preparation dominates after metadata was discarded
even in the baseline. Requested bytes are not RSS, copied bytes, stack usage or
Node/V8 heap measurements.

## Warm execution controls

Microseconds, baseline -> candidate:

| Workload | Rust fresh JSON | Rust prepared |
|---|---:|---:|
| small-page | 0.54 -> 0.54 (+0.2%) | 0.29 -> 0.29 (+0.0%) |
| small-page, markers v2 | 0.54 -> 0.54 (+0.0%) | 0.33 -> 0.33 (+0.0%) |
| repeat-components-1000 | 1,022.54 -> 1,032.25 (+0.9%) | 592.88 -> 592.83 (-0.0%) |
| repeat-components-1000, markers v2 | 1,143.67 -> 1,135.25 (-0.7%) | 688.04 -> 693.75 (+0.8%) |
| repeat-plain-10000 | 7,409.42 -> 7,389.25 (-0.3%) | 3,098.92 -> 3,119.54 (+0.7%) |
| deep-nested | 20.17 -> 20.21 (+0.2%) | 19.88 -> 19.96 (+0.4%) |
| mostly-static | 12.96 -> 12.96 (+0.0%) | 12.71 -> 12.62 (-0.7%) |
| binding-heavy | 380.96 -> 387.29 (+1.7%) | 386.17 -> 394.08 (+2.1%) |
| state-validation-wide-10000 | 1,241.42 -> 1,245.88 (+0.4%) | 0.25 -> 0.25 (+0.0%) |
| state-validation-nested-10000 | 8,345.96 -> 8,548.33 (+2.4%) | 0.25 -> 0.25 (+0.0%) |

Seven-round reversed-order confirmation measured binding-heavy fresh JSON 2.9%
slower and prepared 1.8% slower; nested-state fresh JSON was 1.0% slower.
An identical-baseline-binary A/A prepared binding comparison differed by 2.3%.
These controls do not establish warm-render improvement or exact equivalence.
All request allocation calls, reallocations, requested bytes, peaks, prepared-state
storage and zero post-request retention match across the ten fixtures at both
Rust boundaries.

Node controls repeat composite-style bindings or component rows with small/large
state. Buffer delivery includes fresh JSON parsing and rendering; string
delivery also decodes every output. Microseconds, baseline -> candidate:

| Workload | Node Buffer | Node complete string |
|---|---:|---:|
| Styles, 1 row | 2.34 -> 2.26 (-3.1%) | 2.45 -> 2.35 (-4.1%) |
| Styles, 1,000 rows | 330.57 -> 335.35 (+1.4%) | 364.69 -> 366.23 (+0.4%) |
| Styles, 1,000 rows, markers v2 | 400.80 -> 396.38 (-1.1%) | 451.80 -> 457.85 (+1.3%) |
| Components, 10 rows | 12.12 -> 11.98 (-1.2%) | 12.48 -> 12.73 (+2.0%) |
| Components, 1,000 rows | 1,027.72 -> 1,031.23 (+0.3%) | 1,080.21 -> 1,086.89 (+0.6%) |
| Components, 1,000 rows, markers v2 | 1,128.74 -> 1,122.45 (-0.6%) | 1,210.66 -> 1,207.63 (-0.3%) |

Node fixture compilation (using the same compiler for both addons), one program
construction and first render are recorded separately from these warmed timers.
Across the six configurations, baseline/candidate compile medians range
8.62-9.57/8.68-9.98 ms, program construction 0.172-0.215/0.166-0.215 ms,
and first render 0.025-1.247/0.027-1.212 ms. Single constructions in fresh workers
are not the repeated-load experiment above, and no compile/first-render speedup
is inferred from them.

## Rejected request-parser experiment

Before this change, a four-value inline JSON-array staging experiment was tested
against the same main revision. It regressed the wide-state fresh-JSON case by
9.7% in a three-round screen, despite improving scalar-heavy parsing. It was
completely removed before this metadata implementation. Neither the implementation
nor its selectively favorable timings are included in this PR's results.

## Contracts and measured identities

New tests exercise both metadata forms, field ordering, escaped keys, duplicates
and their final shapes, schema-1 rejection of extra metadata, malformed Unicode,
out-of-range numbers and excessive depth inside unused/overwritten values,
trailing JSON, and valid-but-unsupported root error categories. Existing full
native tests and Node artifact/ownership tests cover execution behavior. The
allocation regression fails on main (29 -> 12,330 allocations as discarded
metadata grows), then passes with the validation-only visitor.

| Identity | SHA-256 |
|---|---|
| Candidate `native.rs` | `18e66069ee0241a563fe699af439be364f511e3d240ec7fa29e1a8972df706f0` |
| Candidate `native/envelope.rs` | `4766126c59b18a859993cfac4a97bc2bddfc7b03f4988272cd40056eebc184da` |
| Shared Rust benchmark | `8ae7de28fb53c4400c71928342ed32425bbb6d1b31eacd5c7d61e6c4bd50a5d4` |
| Baseline Rust executable | `7e7a2ca529ec4d22c4c08a5f259388fb5f02d0177380989a21e99ab83a9a3000` |
| Candidate Rust executable | `f384dc529ce55619b264b379c05bb76e95b83933d58395354f94c11631fe983e` |
| Baseline Node addon | `90328c3ae0da88d487fda6d54d6bc0f728bfe6cc346d55e9f3c03f2853fb2c88` |
| Candidate Node addon | `8390762e81ec643bf5c63b9b82bff1d0c1671ca3d92109806d54dfa6ecb8e792` |

## Reproduction

Use the [native profiling guide](./native-profiling.md). Copy this branch's
`examples/native-shadow-benchmark.rs` into the exact baseline crate snapshot
without changing its execution sources. Build both separately:

```sh
CARGO_BUILD_JOBS=2 cargo build --release --locked \
  --manifest-path <revision>/crates/microsoft-fast-build/Cargo.toml \
  --example native-shadow-benchmark --target-dir <revision-target>

<revision-target>/release/examples/native-shadow-benchmark \
  metadata-nested load timing 2000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
  metadata-nested load memory 3 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
  binding-heavy fresh-json timing 1000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
  binding-heavy prepared timing 1000 <output.html>
```

Select each table's exact fixture name, using `-markers-v2` for that marker mode.
Repeat in alternating process order with the warmups/calibration above.
Never compare a tracked `memory` pass to an uninstrumented `timing` pass.

Build separate Node addons with `build-native-host.mjs` or
`cargo build --release --locked --features node-host --lib`. The standard
`bench:server` tooling also separates setup, load, first-render, Buffer and string
delivery; select `compositeStyles` or `componentRepeats` for the same control fixtures,
and `static,largeStaticTemplates` for application-shaped loading follow-ups.
Use identical fixture counts, options and output hashes for both addons. Do not
treat instrumented `profile:server` load times, which include GC, as these
in-memory load latencies.
