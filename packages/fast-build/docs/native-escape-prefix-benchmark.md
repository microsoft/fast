# Native escape-prefix benchmark

## Decision and scope

Skip long escape-free prefixes with portable eight-byte word tests before the
existing scalar HTML-escaping loop. Inputs shorter than 64 bytes retain scalar
scanning. The word filter conservatively recognizes the five escapable ASCII
characters; `#` can also stop it early. Scalar matching remains authoritative
from the first possible match through the rest of the input.

This targets long bound text and attribute values, not every rendered page.
Early escapes and early `#` characters retain scalar cost, even if a long
escape-free suffix follows. Dense escaping is not claimed to benefit from the
shortcut. There are small short-value/control costs, reported below.

Word loads use safe byte-array conversion, without alignment assumptions,
architecture-specific intrinsics, unsafe code, dependencies or retained scratch.
Only actual ASCII matches split string spans, so UTF-8 boundaries, entity
spellings, sink calls and first-error order are unchanged. The shared writer
also serves compiler escaping; no compiler speedup is claimed here.

## Method

- Baseline: merged main `76405ed045911e5cda11bbb80bbf12d771efea86`.
- Apple M3 Pro, macOS 27.2.1 ARM64; shared, nonexclusive machine.
- Rust 1.93.1 / LLVM 21.1.8; Node 22.22.1.
- Separate locked default Cargo release builds, two build jobs, identical fixture
  sources/options/dependencies. No profile overrides or `target-cpu=native`.
  The updated Rust example is copied into an exact-main crate snapshot;
  execution sources remain unchanged there.
- Builds/tests finish before timing; no own builds, tests, profilers or
  allocation diagnostics overlap latency runs.
- Rust measures fresh JSON parsing/validation plus execution and prepared-state
  execution separately, returning complete owned Strings. Each process has 20
  warmups; iterations target 200 ms, bounded to 20-200,000.
- Node independently warms Buffer and complete
  `renderEntryJson(state).toString("utf8")` delivery for 30 requests, collecting
  garbage before each boundary. Compilation/loading and output checks are
  outside warm timers. The same checkout's compiler prepares both addons' input.
- Five alternating process rounds cover 117 Rust workloads at both boundaries
  and 74 Node configurations. Comparisons use medians of process medians in
  Rust and medians of process averages in Node.
- All 27 Rust cases with an initial boundary over 1% slower, three legacy
  headline targets and the binding-heavy control receive ten rounds.
  Node's six 1 KiB headline configurations and six apparent fallback regressions
  receive ten rounds, as do nine ordinary controls initially over 1.5% slower.
  Tables replace a case's initial results with its confirmation results.
- Node uses 500 iterations for 1 KiB/128-row targets, 150 for 8 KiB/64-row
  targets, and 1,000 for the short-value targets. Ordinary controls use 150 at
  1,000 items or 20 at 10,000; nested deep/static chains use 10,000, binding
  chains 500, and marker-free static output 15,000.
- Separate three-request allocator passes measure calls, reallocations,
  requested bytes, peak live requested heap and post-request retention.
- Complete output and artifact/state identities match between revisions.
  All 28 shared Rust/Node target outputs match across both Rust boundaries.

Percentages describe elapsed-time changes,
`100 * (candidate / baseline - 1)`, not throughput changes.
An absolute difference below 0.05% is rounded to unchanged, not proven equivalent.
These measurements are not a cross-platform speed guarantee.

## Long bound values

One root component repeats a paragraph containing the same root value in a
bound `title` and text binding. State stores that value once; it is rendered
twice per row. ASCII uses repeated words, spaces, digits and punctuation;
Unicode uses repeated `café 😀 ` plus ASCII padding to the requested byte size.
Sparse cases append `&é<>'"` after that prefix.

The durable workloads use 1 KiB values and 128 rows for this comparison:

| Value | Markers | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
|---|---|---|---|---|---|
| ASCII | Legacy | 76.4% faster | 77.3% faster | 67.2% faster | 56.3% faster |
| ASCII | v2 | 73.8% faster | 75.1% faster | 65.3% faster | 54.6% faster |
| Unicode | Legacy | 76.7% faster | 77.4% faster | 67.6% faster | 19.5% faster |
| Unicode | v2 | 74.2% faster | 75.2% faster | 64.7% faster | 19.2% faster |
| Sparse escapes | Legacy | 73.8% faster | 74.5% faster | 64.6% faster | 35.8% faster |
| Sparse escapes | v2 | 71.2% faster | 72.3% faster | 63.3% faster | 34.0% faster |

Legacy Rust rows and all six Node rows use ten rounds; Rust v2 uses five.
Absolute legacy medians, microseconds:

| Value | Rust fresh baseline -> candidate | Rust prepared baseline -> candidate | Node Buffer baseline -> candidate | Node string baseline -> candidate |
|---|---:|---:|---:|---:|
| ASCII | 194.355 -> 45.917 | 191.792 -> 43.542 | 220.370 -> 72.214 | 258.510 -> 112.924 |
| Unicode | 194.646 -> 45.438 | 192.480 -> 43.480 | 217.328 -> 70.450 | 750.868 -> 604.085 |
| Sparse escapes | 202.313 -> 53.105 | 199.605 -> 50.834 | 225.736 -> 79.914 | 421.487 -> 270.627 |

Complete string delivery includes decoding on every timed request. Its
Unicode/sparse results are not inferred by subtracting a fixed-buffer decode
microbenchmark.

Five-round 8 KiB/64-row scaling checks:

| Value | Markers | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
|---|---|---|---|---|---|
| ASCII | Legacy | 81.2% faster | 81.5% faster | 73.7% faster | 63.0% faster |
| ASCII | v2 | 80.9% faster | 80.9% faster | 73.5% faster | 61.7% faster |
| Unicode | Legacy | 80.9% faster | 81.4% faster | 73.3% faster | 20.5% faster |
| Unicode | v2 | 80.9% faster | 81.0% faster | 73.1% faster | 19.9% faster |
| Sparse escapes | Legacy | 81.1% faster | 81.3% faster | 73.8% faster | 39.9% faster |
| Sparse escapes | v2 | 80.5% faster | 80.8% faster | 73.3% faster | 38.4% faster |

The existing wide-opening workload also benefits: legacy fresh Rust is 32.6%
faster, 1.875 -> 1.263 ms; Node Buffer is 32.7% faster and string delivery 8.2%
faster. Its 1,000 bound titles have long prefixes but retain the same large
static shadows. This is separate from changing shadow assembly.

## Fallbacks, thresholds and slowdowns

Early-escape values prepend `&<>'"` to 1 KiB ASCII; dense values repeat
`é&<>"'`; hash values prepend `#`. Short cases repeat the same value 1,000 times.

| Case | Markers | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
|---|---|---|---|---|---|
| Early escapes, 1 KiB | Legacy | 0.3% slower | 0.4% faster | 0.1% slower | 2.0% faster |
| Dense escapes, 1 KiB | Legacy | 2.1% faster | 0.8% faster | 1.0% faster | 0.4% faster |
| Early hash, 1 KiB | Legacy | 0.7% faster | 0.2% slower | 0.4% slower | 0.4% slower |
| Seven bytes | Legacy | 0.1% slower | 2.1% slower | 1.0% faster | 1.7% faster |
| Seven bytes | v2 | 0.4% faster | 1.1% slower | 2.3% slower | 3.4% slower |
| Sixty-three bytes | Legacy | 0.8% slower | 0.1% faster | 1.7% slower | 2.5% slower |
| Sixty-three bytes | v2 | 1.0% faster | 0.4% slower | 2.7% slower | 1.4% slower |
| Sixty-four bytes | Legacy | 38.2% faster | 41.5% faster | 34.8% faster | 30.1% faster |
| Sixty-four bytes | v2 | 30.7% faster | 32.8% faster | 27.4% faster | 24.5% faster |

The largest Rust cost is the seven-byte prepared case in ten rounds,
112.000 -> 114.396 microseconds: **2.1% slower**.
The largest Node cost is seven-byte v2 string delivery in ten rounds,
226.169 -> 233.931 microseconds: **3.4% slower**.
Short values are a real tradeoff, not claimed unchanged.

Outside these synthetic escape targets, the largest final Rust control cost is
the four-property row-prefix prepared case: **1.6% slower** in ten rounds,
359.959 -> 365.646 microseconds. The largest ordinary Node control cost is
**1.5% slower**, nested-state v2 Buffer delivery in five rounds.
Initial ordinary outliers up to 4.5% slower Rust and 4.3% slower Node did not
reproduce at those sizes in their ten-round confirmations.

A separate scalar-slice-iterator experiment reduced some seven-byte costs but
introduced 2.1% slower dense prepared and 3.0% slower row-composite prepared Rust
results in its five-round screen. It was rejected; none of those results are
substituted into the final tables.

## Memory and contracts

All 117 Rust workloads have identical request allocation calls, reallocations,
requested bytes, peaks and retention at both boundaries. Completed requests
retain zero requested heap bytes. Prepared-state metrics also match.
Artifact-load metrics match in the final five-/ten-round results. Two initial
binding-heavy load peaks differed by 24/204 bytes at about 21.6 MB; that variation
did not recur in the ten-round confirmation. No loading/preparation speedup is
claimed.

Representative fresh-JSON requests, identical between revisions:

| Legacy workload | Allocation calls | Reallocations | Requested bytes | Peak live requested heap |
|---|---:|---:|---:|---:|
| ASCII, 1 KiB / 128 rows | 6 | 17 | 1,095,842 | 549,205 |
| Unicode, 1 KiB / 128 rows | 6 | 17 | 1,095,842 | 549,205 |
| Sparse escapes, 1 KiB / 128 rows | 7 | 18 | 1,098,939 | 549,212 |
| ASCII, 8 KiB / 64 rows | 6 | 15 | 4,218,018 | 2,117,461 |

Requested heap bytes are not RSS, measured copied bytes, Node/V8 heap usage or
stack-memory measurements. No retained buffer, cache, input mutation or
artifact-layout change is introduced.

New tests cover every ASCII byte at different word/UTF-8 offsets, each fallible
sink boundary after a long prefix, exact/short output budgets, both marker modes,
and recovery across typed, fresh-JSON and prepared calls. Integration values
straddle 63/64/65 total bytes. Existing state/artifact validation, escaping,
execution limits, ownership and isolation tests still pass. Both marker-mode
durable CLI smoke runs cover all six new workloads.

## Measured identities

| Identity | SHA-256 |
|---|---|
| Baseline `content.rs` | `9401085728958dabd56e0e13cae87dfb8ba419d4e05993b9212e59b35a068386` |
| Candidate `content.rs` | `a878e73522225e3d021d2f0cc97c1364cbfa47ee36af378bf404662baa111b2a` |
| Shared Rust benchmark | `f88932dc42dacc478c346de5bbe0e704e6265ff74a33e1c4f683735cab20c708` |
| Shared Node fixture module | `ae1ef2f29e94557c3f88f08efd831ba592d89d7bb77ad93c07f40a4f5b9ef146` |
| Baseline Rust executable | `82e3fe145e6f77a64284e2227c996935ded7f3d12c3bbe5403e8d589f0c5497b` |
| Candidate Rust executable | `8805b49af285167868c160b7794e9dfda45b2f4cf6571a670a5f7096c6354996` |
| Baseline Node addon | `10e83eff7c4d42faa6041329433c1d8dff727ea5283234f218831787f9298f92` |
| Candidate Node addon | `32d35a5a7880f9a51201585024db14395de1b7ab6b7edc7f25a66f9874c47ce4` |

## Reproduction

Use the [native profiling guide](./native-profiling.md). Copy this branch's
`examples/native-shadow-benchmark.rs` into an exact-main crate snapshot at the
baseline above without modifying execution sources. From the monorepo root:

```sh
CARGO_BUILD_JOBS=2 cargo build --release --locked \
    --manifest-path <revision>/crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark --target-dir <revision-target>

<revision-target>/release/examples/native-shadow-benchmark \
    escaped-value-ascii-1024-128 fresh-json timing 1000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    escaped-value-ascii-1024-128 prepared timing 1000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    escaped-value-ascii-1024-128 fresh-json memory 3 <output.html>
```

Select `escaped-value-{ascii,unicode,sparse,early,dense,hash}-1024-128`,
`escaped-value-ascii-{0,7,63,64,65}-1000`, or
`escaped-value-{ascii,unicode,sparse}-8192-64`, with/without `-markers-v2`.
Calibrate iterations to 200 ms and alternate revisions for five rounds;
use ten for the confirmed cases described above.

Build separate addons using `build-native-host.mjs` or
`cargo build --release --locked --features node-host --lib`. Durable Node runs:

```sh
npm run bench:server -w @microsoft/fast-build -- \
    --native-addon=<revision.node> --instances=128 \
    --workloads=escapePrefixAscii,escapePrefixUnicode,escapePrefixSparse,escapePrefixEarly,escapePrefixDense,escapePrefixHash \
    --samples=5 --iterations=500 --warmup=30 --output=<report.json>
```

Repeat with `--markers-v2`. For scaling/threshold checks and the balanced
protocol, import `escapePrefixFixture(count, shape, length)` from
`test/performance/fixtures.mjs`, compile/load once per process, independently
warm Buffer/string delivery and use the per-shape iteration counts above.
Alternate revision processes and verify complete output and artifact/state
identities outside timers. Run allocation diagnostics separately.
