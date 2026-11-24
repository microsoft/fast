# Native shadow-assembly benchmark

## Decision and scope

Keep shadows larger than 4 KiB in the request's output String instead of splitting
them into a separate allocation and appending them again after the host opening.
Evaluate the shadow first, append the host/DSD opening, then reorder the spans.
This removes repeated large temporary copies in nested components without
changing shadow-before-host error ordering.

Shadows of at most 4 KiB keep the existing split/append path. An initial unbounded
reordering experiment regressed short-component prepared controls by 7-8%; the
bounded fallback avoids paying that reordering cost for small shadows.

Reordering copies the smaller of the shadow and opening. Moves up to 256 bytes
use fixed stack scratch; larger moves use a temporary owned String. This bounds
the fallback copy by the shadow size rather than allocating a huge opening for
a smaller shadow. Empty shadows require no move. The output remains a UTF-8
String throughout: a byte-vector rotation experiment's whole-output UTF-8
conversion was not retained.

A temporary physical output ceiling excludes the pending shadow from host
attribute/opening budget charges. The combined length is checked at the original
shadow-append point, then the ordinary ceiling is restored. Saturating ceiling
arithmetic handles unrestricted `usize` options without overflow. Intermediate
storage remains private; failures expose no partial HTML and later requests
receive fresh counters/buffers.

No artifact format, public API, input ownership, lookup, escaping, hydration
bytes, execution-step charges or release-profile change is introduced.
There is no unsafe code or cross-request output/scratch retention.

## Method

- Baseline: merged main `05a31f8b355a3f7e899397d6bda522706f6d055b`.
- Apple M3 Pro, macOS 27.2.1 ARM64; shared, nonexclusive machine.
- Rust 1.93.1 / LLVM 21.1.8; Node 22.22.1.
- Separate locked default Cargo release builds, two build jobs, identical fixture
  sources/options/dependencies. No `target-cpu=native` or profile overrides.
  The updated benchmark example is copied into an exact-main crate snapshot;
  its execution sources are unchanged.
- Rust tests and repository builds/tests complete before final qualification.
  Builds, profilers and allocator diagnostics do not overlap latency runs.
- Rust separately measures fresh JSON parsing/validation plus execution and
  prepared-state execution. Both return complete owned Strings. Each process
  has 20 warmups; iterations target 200 ms, bounded to 20-200,000.
  Compare medians of five process medians, alternating revision order.
- Node independently warms Buffer and complete
  `renderEntryJson(state).toString("utf8")` delivery for 30 requests and runs GC
  before each boundary. Five alternating rounds use 150 requests at 1,000 items,
  20 at 10,000, 10,000 for deep/static chains, and 500 for binding chains.
  The marker-free static control uses 15,000 requests.
- Qualification covers 89 Rust workloads at both boundaries and 48 Node
  configurations. Both marker formats cover the main targets, opening-size
  variants, small/large property scopes, grouped datasets, alias fallback,
  optional values and parser-heavy controls. Rust also covers small/wide/deep
  pages, empty shadows, light/shadow mixing, composites and large inline styles.
- Seven apparent Rust regressions and five headline targets receive ten-round
  confirmation. Node's three nested shapes and dataset controls receive ten
  rounds in both marker modes. Tables use confirmation results when available.
- Complete output bytes and artifact/state identities match between revisions.
  All 14 shared Node/Rust target outputs match across both Rust boundaries.
  Rust verifies every complete result outside its call timer; Node verifies
  output outside its timed loops.
- Separate three-request allocator passes measure calls, reallocations,
  requested bytes, peak live requested heap and post-request retention.
  Rust CPU-loop metrics include verification/output destruction; render-call
  wall times do not.

Percentages describe elapsed-time changes:
`100 * (candidate / baseline - 1)`, not throughput changes.
An absolute difference below 0.05% is rounded to unchanged, not proven equivalent.

## Nested shadows

The shared fixtures contain one component chain: 32 levels with 2 KiB sections,
12 mostly-static levels with 8 KiB sections, or 16 levels with 96 bound links
per level. They retain escaped UTF-8 labels and a bound URL. These target repeated
shadow assembly, not all application pages.

| Shape | Markers | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
|---|---|---|---|---|---|
| Deep, 32 levels | Legacy | 56.0% faster | 56.1% faster | 49.3% faster | 34.9% faster |
| Deep, 32 levels | v2 | 56.6% faster | 56.7% faster | 49.3% faster | 34.7% faster |
| Mostly static, 12 levels | Legacy | 62.3% faster | 62.9% faster | 50.1% faster | 32.0% faster |
| Mostly static, 12 levels | v2 | 62.1% faster | 63.1% faster | 50.0% faster | 31.3% faster |
| Binding-heavy, 16 levels | Legacy | 10.8% faster | 10.8% faster | 12.0% faster | 7.1% faster |
| Binding-heavy, 16 levels | v2 | 9.4% faster | 10.0% faster | 10.8% faster | 6.4% faster |

Legacy Rust rows and all Node nested rows use ten rounds; Rust v2 rows use five.
Absolute legacy medians, microseconds:

| Shape | Rust fresh baseline -> candidate | Rust prepared baseline -> candidate | Node Buffer baseline -> candidate | Node string baseline -> candidate |
|---|---:|---:|---:|---:|
| Deep | 45.333 -> 19.958 | 44.563 -> 19.563 | 56.327 -> 28.550 | 78.569 -> 51.148 |
| Mostly static | 34.021 -> 12.813 | 33.688 -> 12.500 | 47.149 -> 23.551 | 75.189 -> 51.105 |
| Binding-heavy | 412.896 -> 368.230 | 414.709 -> 369.876 | 448.860 -> 394.965 | 702.743 -> 653.103 |

String delivery includes decoding inside every timed request. Its smaller gains
are not estimated by subtracting a fixed-buffer decode microbenchmark.

## Opening size and fallback paths

The new opening fixtures render 1,000 repeated leaf components under one root.
Short/wide variants have an 8 KiB literal shadow. Their bound `title` padding is
8 or 1,024 ASCII bytes plus UTF-8/escaping content. The short opening uses stack
scratch; the wide opening exercises the larger temporary-copy path. Tiny/empty
variants use the wide title with a two-byte or empty leaf shadow, retaining the
bounded split/append path for those leaves.

| Opening case | Markers | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
|---|---|---|---|---|---|
| Short | Legacy | 17.2% faster | 17.0% faster | 15.3% faster | 2.5% faster |
| Short | v2 | 15.6% faster | 15.7% faster | 16.0% faster | 2.8% faster |
| Wide | Legacy | 11.0% faster | 10.6% faster | 8.5% faster | 3.5% faster |
| Wide | v2 | 9.3% faster | 9.1% faster | 10.2% faster | 4.2% faster |

Legacy Rust short/wide cases use ten rounds; other opening results use five.
Legacy fresh Rust is 1.214 -> 1.005 ms for short and 2.070 -> 1.842 ms for wide.
Node short Buffer is 1.319 -> 1.118 ms, while full strings are
6.732 -> 6.561 ms: large-output decoding dominates that latter boundary.
Tiny/empty controls vary around unchanged, with the enclosing large root still
benefiting from avoiding its full-shadow copy.

The existing 1,000-component large-inline-style case is 6.1% faster with fresh
JSON and 7.9% faster prepared in five rounds. Ordinary small components are not
claimed to receive the nested/static targets' gains.

## Controls and slowdowns

The final bounded implementation's largest measured Rust slowdown is the
one-property prepared component control: **1.5% slower** in ten rounds,
431.542 -> 437.875 microseconds. Its fresh-JSON boundary is 1.2% faster.

Other confirmations include:

| Rust control | Fresh JSON | Prepared |
|---|---|---|
| Ten repeated components, legacy | 0.2% faster | Unchanged |
| Ten repeated components, v2 | 1.8% faster | 0.6% faster |
| Empty shadows, v2 | 0.5% slower | 0.5% slower |
| Four-part composite styles, v2 | 1.7% faster | 0.8% faster |
| Thirty-two properties, v2 | 0.4% faster | 0.2% faster |
| Twelve row-local palette properties, v2 | 0.3% faster | 2.2% faster |

Initial 2.8% slower thirty-two-property and 3.8% slower row-palette fresh results
did not reproduce in those ten-round checks. The unbounded experimental
reordering variant is not used for these final results.

The largest Node control cost in the final five-/ten-round results is **0.9%
slower** legacy duplicate-key Buffer rendering. The confirmed legacy dataset
string boundary is 0.8% slower; dataset Buffer is 0.1% slower. No parser or
marker-free static-rendering gain is claimed from those controls.
These costs remain part of the tradeoff, not proof that every request is faster.

## Memory, loading and contracts

Request allocation calls, reallocations, total requested bytes, peaks and
retention are nonincreasing across all 89 Rust workloads at both boundaries.
Every measured completed request retains zero requested heap bytes.
Prepared-state and artifact-load allocation/retention metrics match between
revisions, including peak requested heap in the final qualification.

Representative fresh-JSON requests with legacy markers:

| Workload | Allocation calls baseline -> candidate | Requested bytes baseline -> candidate | Peak live requested heap baseline -> candidate |
|---|---:|---:|---:|
| Deep chain | 39 -> 8 | 1,393,756 -> 265,818 | 201,540 -> 133,055 |
| Mostly-static chain | 19 -> 7 | 901,174 -> 255,142 | 231,248 -> 131,855 |
| Binding-heavy chain | 23 -> 7 | 2,832,877 -> 655,751 | 584,196 -> 328,063 |
| 1,000 short-opening leaves | 1,007 -> 6 | 33,448,932 -> 16,928,909 | 16,796,857 -> 8,468,834 |
| 1,000 wide-opening leaves | 1,007 -> 1,006 | 51,288,220 -> 34,850,197 | 26,225,009 -> 16,882,084 |

The deep/static/binding cases request 80.9%, 71.7% and 76.9% fewer heap bytes,
respectively, with 34.0-43.8% lower peak live requested heap. Prepared static and
binding rendering each need one output allocation, down from 13 and 17.
Wide openings retain per-leaf heap copies, but the copied span is smaller.
Small leaf fallbacks may still allocate; the large enclosing root no longer
duplicates their combined shadow.

Requested heap bytes are not RSS, measured copied bytes or stack-memory usage.
The executor adds a request-local ceiling field and bounded 256-byte stack
scratch; no stack-memory reduction is claimed.

Compilation, addon/program loading and first rendering are outside warmed timers.
No loading or state-preparation speedup is claimed. Descriptive ten-process
legacy static-chain Node medians are 0.280 -> 0.274 ms for program loading and
0.078 -> 0.041 ms for first Buffer rendering; these are not independently
controlled cold-start measurements.

New tests cover UTF-8 reordering on either side of the scratch boundary, exact
and short byte budgets, unrestricted `usize` limits, ceiling restoration, and
short/large nested host openings in both marker modes. Integration coverage
straddles 4,095/4,096/4,097-byte shadows. Existing tests retain shadow-before-host
failure ordering, step/depth limits, escaping, ownership, recovery and isolation.
Both durable marker-mode CLI smoke runs cover all seven new Node workloads.

## Measured identities

| Identity | SHA-256 |
|---|---|
| Baseline `native.rs` | `68b7db2b740ebc6141ec1777d89075b8066ed036a2c6d6c3b313758f3171b985` |
| Candidate `native.rs` | `8b1a86f505bbc57ef1403fd016e869af2e8b3f8c5838235af7cae5d19b59d5d3` |
| Shared Rust benchmark | `a78b6ee82fde381e08b4d936da8ecea58c659eab6befd6433636e5472c261895` |
| Shared Node fixture module | `7608bd4fec02ecdae8da3be28d2b1fd1fb15d498c1bbbaded1b0ad5a3796649e` |
| Baseline Rust executable | `4d7da2504e3f54d10e740cb05dcdfaf794ca46265915e45a75a07d762bbf2791` |
| Candidate Rust executable | `5f3c3ea6508e9192d95874e9c81232594a4dcc575e461fedd9826eb75b9d27bf` |
| Baseline Node addon | `fbcbe614bdfffd28bf52ac6b08accb3d6aacb1f45c45ca5cde881daa795518a3` |
| Candidate Node addon | `9a01e4566a040662219e70cecc796bf857a1422afe6b569795fde16aa0bac476` |

## Reproduction

Use the [native profiling guide](./native-profiling.md). Copy this branch's
`examples/native-shadow-benchmark.rs` into an exact-main crate snapshot at the
baseline above, leaving execution sources untouched. From the monorepo root:

```sh
CARGO_BUILD_JOBS=2 cargo build --release --locked \
    --manifest-path <revision>/crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark --target-dir <revision-target>

<revision-target>/release/examples/native-shadow-benchmark \
    mostly-static fresh-json timing 5000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    mostly-static prepared timing 5000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    mostly-static fresh-json memory 3 <output.html>
```

Also select `deep-nested`, `binding-heavy`, `repeat-components-large-styles` and
`shadow-opening-{short,wide,tiny,empty}-1000`, with/without `-markers-v2`.
Calibrate iterations to 200 ms and alternate revisions for five rounds; use ten
for the confirmed targets/controls listed above.

Build separate platform addons with `build-native-host.mjs` or
`cargo build --release --locked --features node-host --lib`. Durable Node runs:

```sh
npm run bench:server -w @microsoft/fast-build -- \
    --native-addon=<revision.node> --instances=1000 \
    --workloads=deepShadows,staticShadows,bindingShadows \
    --samples=5 --iterations=500 --warmup=30 --output=<report.json>
```

Nested fixtures have fixed chain sizes, independent of `--instances`.
Run the four `shadowOpeningShort`, `shadowOpeningWide`, `shadowOpeningTiny` and
`shadowOpeningEmpty` workloads with 1,000 instances and 150 iterations.
Repeat both marker formats. For the recorded balanced protocol, import
`nestedShadowFixture` and `shadowOpeningFixture` from
`test/performance/fixtures.mjs`, compile/load once per process, independently
warm Buffer/string delivery and use the per-shape iteration counts above.
Alternate revision processes and verify complete output and artifact/state
identities outside latency loops. Run allocation diagnostics separately.
