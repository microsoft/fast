# Native composite-literal benchmark

## Decision and scope

Classify composite-attribute literals once during native artifact loading.
Quote-free literals append directly instead of searching for quotes on every
render. Literals containing quotes retain the existing replacement loop and
fallible span boundaries. The wire schema, public APIs, dynamic escaping,
late-binding suppression and output/step budgets are unchanged.

This removes steady-state work without expanded literal copies, extra request
storage, dependencies, unsafe code or platform-specific instructions. It is not
the withdrawn build-metadata-loading experiment from #7867.

Existing four/five-binding style workloads improve about **5-7% in Rust**.
Five alternating standalone Node process rounds confirm **6.1% faster Buffer
delivery and 5.3% faster complete string delivery** for the existing style case.
A three-binding literal-focused case improves **7.9% / 6.0%** at those Node
boundaries. These are native-render costs, not end-to-end HTTP throughput.

The useful application shape is repeated formatted attributes: class/style
strings, labels or ARIA text combining invariant text with bound values.
Scalar-only bindings, plain repeats and pages without composite attributes should
not be expected to benefit. Fresh JSON can dilute gains when state parsing
dominates, as the row-specific style control demonstrates.

## Method and host interference

- Baseline: freshly pulled main `544a7306c5a5c93527a3c9398776ffb8aa654a73`,
  rechecked before delivery.
- Shared/nonexclusive Apple M3 Pro, macOS 27.2.1 ARM64, Rust 1.93.1 /
  LLVM 21.1.8, Node 22.22.1. Linux/Windows performance was not measured.
- Separate locked default-release builds with two Cargo jobs, identical
  dependencies, fixture sources and options. No profile or CPU-baseline changes.
  Copy the updated example into the exact-main crate snapshot without changing
  execution sources.
- Relevant builds/tests finish before timing; no own builds, tests, profiler or
  allocation diagnostics overlap latency passes.
- Rust: nine alternating process rounds for 28 fixtures at fresh-JSON and prepared
  boundaries, 20 warmups per process, baseline-calibrated approximately 200 ms
  samples bounded to 20-200,000 iterations. Report medians of process medians.
- Node: independently warm Buffer and complete string delivery. The durable
  benchmark now warms the string boundary explicitly as well as the Buffer
  boundary; setup, warmup, verification and explicit GC are outside call timers.
- A later full fresh-process Node run became severely unstable: some nominal
  controls exceeded twice their earlier time, and comparisons swung over 100%.
  Its raw results are retained as diagnostic evidence, not treated as optimization
  gains or regressions. We did not stop unrelated workloads or claim exclusive
  hardware.
- To qualify under the shared-host conditions, load both addons and independent
  programs in one process. For each boundary, warm both 100 times, then run
  40 alternating paired batches. Use 100 requests per batch at 1,000 rows,
  1,000 at ten rows and 10,000 at one row; collect garbage before each batch,
  outside its wall/CPU timer. Consume and byte-check each batch's complete result.
  Tables report ratios of median baseline/candidate batch costs.
- Identical-baseline-binary A/A pairs check three controls. Buffer wall variation
  is 0.3-1.2%; string wall variation is -0.2% to +1.6%. CPU variations are
  0.1-1.3% and -0.4% to +0.4%, respectively.
- Finally, five alternating standalone Node process rounds independently confirm
  the plain-literal and existing-style headlines, missing-binding suppression,
  and quoted v2 fallback. Use 4,000 requests for literal cases and 1,000 for the
  style case, with 30 warmups at each boundary.
- Allocator diagnostics are separate three-request passes. Artifact/state/output
  identities match between revisions; all nine shared literal outputs in the
  paired comparison match both Rust boundaries.

Changes are `100 * (candidate / baseline - 1)`, not throughput percentages.
Small control deltas are not equivalence proofs. No startup, compile, RSS or
copied-byte improvement is claimed; loading adds one literal quote check.

## Existing Rust workloads

Microseconds, baseline -> candidate:

| Workload | Fresh JSON | Prepared |
|---|---:|---:|
| One-binding styles, 1,000 rows | 209.29 -> 206.79 (-1.2%) | 196.33 -> 192.92 (-1.7%) |
| Four-binding styles, 1,000 rows | 318.83 -> 301.62 (-5.4%) | 308.38 -> 288.58 (-6.4%) |
| Four-binding styles, markers v2 | 367.33 -> 349.25 (-4.9%) | 355.21 -> 336.54 (-5.3%) |
| Five-binding styles, 1,000 rows | 356.58 -> 333.58 (-6.5%) | 346.38 -> 321.50 (-7.2%) |
| Row-specific styles, 1,000 rows | 864.00 -> 846.00 (-2.1%) | 270.50 -> 250.83 (-7.3%) |
| Longer-alias fallback styles | 427.46 -> 405.38 (-5.2%) | 399.38 -> 379.67 (-4.9%) |
| Binding-heavy component chain | 370.71 -> 360.54 (-2.7%) | 369.67 -> 360.46 (-2.5%) |

## Literal-focused Rust fixtures

One component repeats an attribute with three bound values and invariant text
between them. Quoted text uses a single-quoted authored attribute containing
literal double quotes. Entity text contains authored `&amp;` and `&quot;`;
Unicode text contains `é` and an emoji. The missing case suppresses the entire
attribute. Empty invariant text also exercises the quote-free classification.

| Shape / rows | Fresh JSON | Prepared |
|---|---:|---:|
| Plain / 1 | 0.62 -> 0.62 (+0.0%) | 0.42 -> 0.38 (-9.9%) |
| Plain / 1,000 | 152.29 -> 140.17 (-8.0%) | 137.08 -> 123.50 (-9.9%) |
| Plain / 10,000 | 1,462.58 -> 1,332.75 (-8.9%) | 1,365.21 -> 1,252.79 (-8.2%) |
| Plain / 1,000, markers v2 | 184.83 -> 173.71 (-6.0%) | 167.54 -> 157.12 (-6.2%) |
| Quoted / 1,000 | 160.71 -> 159.54 (-0.7%) | 150.25 -> 148.50 (-1.2%) |
| Quoted / 1,000, markers v2 | 195.79 -> 194.42 (-0.7%) | 184.67 -> 181.96 (-1.5%) |
| Entities / 1,000 | 153.79 -> 140.33 (-8.8%) | 151.75 -> 139.33 (-8.2%) |
| Unicode / 1,000 | 170.54 -> 151.21 (-11.3%) | 163.12 -> 140.92 (-13.6%) |
| Missing / 1,000 | 111.21 -> 111.21 (+0.0%) | 97.67 -> 96.54 (-1.2%) |
| Empty / 1,000 | 132.38 -> 127.08 (-4.0%) | 123.17 -> 118.29 (-4.0%) |

The one-row Rust numbers are near timer quantization. Do not interpret a
40-nanosecond change as a reliable application-level benefit.

## Node delivery

Five-round independent-process confirmations, microseconds:

| Workload, 1,000 rows | Buffer | Complete string |
|---|---:|---:|
| Existing four-binding styles | 321.90 -> 302.23 (-6.1%) | 349.30 -> 330.79 (-5.3%) |
| Plain invariant literals | 156.27 -> 143.88 (-7.9%) | 154.06 -> 144.80 (-6.0%) |
| Missing final binding | 110.54 -> 109.48 (-1.0%) | 110.27 -> 109.31 (-0.9%) |
| Quoted fallback, markers v2 | 213.22 -> 208.54 (-2.2%) | 229.66 -> 226.00 (-1.6%) |

The literal improvement saves about 12 microseconds of Buffer delivery per
1,000 rows; the existing style case saves about 20 microseconds. The benefit
recurs on warmed requests rather than only during initialization.

Paired wall timings, microseconds; the last column independently records
Buffer/string CPU-time changes:

| Workload | Buffer | Complete string | CPU change |
|---|---:|---:|---:|
| Plain, 1,000 rows | 164.25 -> 152.94 (-6.9%) | 165.14 -> 153.17 (-7.2%) | -6.4% / -7.3% |
| Quoted, 1,000 rows | 176.28 -> 175.47 (-0.5%) | 181.67 -> 179.27 (-1.3%) | -1.0% / -2.2% |
| Entities, 1,000 rows | 171.44 -> 155.01 (-9.6%) | 172.84 -> 161.32 (-6.7%) | -9.9% / -6.4% |
| Unicode, 1,000 rows | 168.79 -> 149.87 (-11.2%) | 293.60 -> 274.84 (-6.4%) | -10.8% / -6.7% |
| Missing, 1,000 rows | 113.18 -> 111.36 (-1.6%) | 116.40 -> 117.29 (+0.8%) | -1.6% / +0.5% |
| Empty, 1,000 rows | 139.96 -> 135.14 (-3.4%) | 142.37 -> 137.61 (-3.3%) | -3.6% / -3.2% |
| Styles, 1,000 rows | 340.31 -> 319.39 (-6.1%) | 357.49 -> 342.39 (-4.2%) | -6.1% / -5.0% |
| Components, 1,000 rows | 998.70 -> 994.85 (-0.4%) | 1,071.66 -> 1,092.84 (+2.0%) | -0.3% / +0.7% |
| Plain, 1,000 rows, markers v2 | 195.20 -> 181.07 (-7.2%) | 212.87 -> 197.83 (-7.1%) | -7.2% / -7.2% |
| Quoted, 1,000 rows, markers v2 | 219.45 -> 216.97 (-1.1%) | 241.12 -> 241.53 (+0.2%) | -1.1% / +0.2% |
| Styles, 1,000 rows, markers v2 | 399.39 -> 384.39 (-3.8%) | 427.54 -> 410.15 (-4.1%) | -3.5% / -4.1% |
| Components, 1,000 rows, markers v2 | 1,132.31 -> 1,137.54 (+0.5%) | 1,228.50 -> 1,246.79 (+1.5%) | -0.0% / +1.1% |
| Plain, 1 row | 1.48 -> 1.45 (-2.4%) | 1.54 -> 1.50 (-2.7%) | -1.9% / -2.1% |
| Components, 10 rows | 11.71 -> 11.71 (+0.0%) | 12.14 -> 12.15 (+0.0%) | +0.1% / -0.0% |

The larger unchanged-path deltas do not establish targeted improvements.
In particular, the component string control costs 2.0% in paired wall time
but 0.7% in CPU time. This is not claimed identical or a universal win.

## Ordinary controls and memory

Nine-round Rust control elapsed changes, fresh/prepared respectively:

| Control | Fresh JSON | Prepared |
|---|---:|---:|
| Component repeats, 10 rows | +0.4% | -0.7% |
| Component repeats, 1,000 rows | -0.2% | -0.4% |
| Component repeats, 10,000 rows | -0.2% | -1.1% |
| Component repeats, 1,000 rows, markers v2 | +0.8% | +0.0% |
| Plain repeats, 10,000 rows | -0.2% | +0.7% |
| Mostly static | -0.0% | +0.7% |
| Deep nesting | +0.2% | -0.2% |
| Wide siblings | -1.0% | -1.4% |
| Empty shadows | +2.3% | +0.2% |
| Small page, markers v2 | +0.0% | +0.0% |

The initial small-page fresh-JSON median changed 542 -> 583 ns (+7.6%), near
one timer tick. A ten-round confirmation measured 542 -> 543 ns (+0.2%);
prepared medians stayed 292 ns. Empty shadows were also repeated: ten rounds
measured 46.12 -> 46.58 microseconds fresh (+1.0%) and 17.90 -> 18.31 prepared
(+2.3%). Report this small control cost rather than claiming every path unchanged.

All 28 Rust fixtures have identical allocation calls, reallocations, requested
bytes, peaks, prepared-state storage and artifact-load allocation diagnostics at
both boundaries. Completed requests retain zero tracked requested heap bytes.
For four-binding styles, prepared rendering makes one allocation and 14
reallocations, requests 360,437 bytes and peaks at 180,224 bytes in either build.
The immutable plan retains 3,669 requested bytes in either build.

Requested bytes are allocator diagnostics, not measured copies, RSS or Node/V8
heap usage. No expanded escaped literal is retained, so quote-heavy artifacts
do not acquire a new expansion multiplier.

## Contracts and identities

The existing bounded-attribute test now mixes quote-containing and quote-free
composites with authored entities and Unicode. It checks exact output,
short/exact budgets, suppression precedence, ownership and recovery. Existing
semantic-schema, escaping, state-validation and Node ownership tests pass.
Both marker modes smoke-test all six new durable Node shapes.
The benchmark's clock-controlled test verifies warmup/setup stay outside its
measured rendering/string boundaries.

| Identity | SHA-256 |
|---|---|
| Candidate `native.rs` | `32b1f8ad0026a1549200bc1602189a9128ab10cfe0864740d46b5bfe84995990` |
| Candidate `native/plan.rs` | `e99eb22a7046ea4bd1bc15d56767b7da161052303139054ce0cb1eb271df6a5e` |
| Shared Rust example | `dc498f7939c5aaabc3a88b414a425ac1c1719605762e283cc9d964aa2942c217` |
| Shared Node fixtures | `565ea19c407a5d19d3fe3b839d94a8527a0600db4d804eef89c42ea492178b25` |
| Shared Node benchmark | `6642916c1aba18bae0e6850808295f265257386729001c43bd5902cef5f533d0` |
| Baseline Rust executable | `81c9374d041b43fd588351420fbfae7715a33211ce3ac7a78826e15bb929e4a0` |
| Candidate Rust executable | `e659d6b89878d9b93199abd4789ae43e7c3cdcd6514f228f7ea8bd8a3ea16686` |
| Baseline Node addon | `055472049e0954e760aa0039974ba6094fceb2ec8e5beeba36323e8747540c01` |
| Candidate Node addon | `37266c60f57734bff1c5d4d4749362e984a04f3b875d3aa35b068ae803558288` |

## Reproduction

From the monorepo root, copy the updated example into an exact baseline crate
snapshot, then build both revisions with the same release settings:

```sh
CARGO_BUILD_JOBS=2 cargo build --release --locked \
  --manifest-path <revision>/crates/microsoft-fast-build/Cargo.toml \
  --example native-shadow-benchmark --target-dir <revision-target>

<revision-target>/release/examples/native-shadow-benchmark \
  composite-styles-1000 fresh-json timing 1000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
  composite-styles-1000 prepared timing 1000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
  composite-literals-quoted-1000 prepared memory 3 <output.html>
```

Use `composite-literals-{plain,quoted,entities,unicode,missing,empty}-1000`,
with `-markers-v2` where applicable. Plain scaling cases accept 1 and 10,000.
The existing style and control fixture names remain unchanged.

Build isolated addons with `build-native-host.mjs` or locked Cargo
`--features node-host --lib` builds. Repeat alternating fresh-process runs with
both matching addons and exact output/artifact/state identities:

```sh
node --expose-gc packages/fast-build/test/performance/server-renderer.mjs \
  --native-addon=<revision-addon> \
  --workloads=compositeLiteralsPlain,compositeLiteralsQuoted,compositeStyles \
  --instances=1000 --samples=1 --iterations=1000 --warmup=30 \
  --output=<unique-report.json>
```

Other new names are `compositeLiteralsEntities`, `compositeLiteralsUnicode`,
`compositeLiteralsMissing` and `compositeLiteralsEmpty`. Add `--markers-v2` for
that mode. Distinguish instrumented allocator/profiler runs from timing;
the [native profiling guide](./native-profiling.md) describes those boundaries.
