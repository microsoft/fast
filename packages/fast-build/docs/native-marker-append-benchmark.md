# Native marker-append benchmark

## Decision and scope

Append hydration-marker spans directly after the existing whole-marker budget
check and reservation. Previously, every span repeated the output-budget check
that had already accepted their checked total.

The change is one executor line. Checked length summation, the initial byte-limit
check, capacity reservation, span ordering, marker bytes, hydration-index overflow
precedence and execution-step accounting stay unchanged. Other output writes
still check their individual limits. No buffer retention, new scratch storage,
unsafe code, dependency, API or artifact-format change is introduced.

The useful gains are in marker-v2 output, which emits more multipart boundaries.
This is not a general parser or static-rendering improvement. Legacy controls
include small measured slowdowns, reported below.

## Method

- Baseline: merged main `f12f520c2b4908b61237e047d596fa9fcc127c93`.
- Apple M3 Pro, macOS 27.2.1 ARM64; shared, nonexclusive machine.
- Rust 1.93.1 / LLVM 21.1.8; Node 22.22.1.
- Separate, locked default Cargo release builds with two build jobs, identical
  fixtures and options. No profile changes or `target-cpu=native`.
- Rust tests and repository builds/tests completed before qualification.
  Builds, allocation diagnostics and profilers do not overlap latency runs.
- Rust measures fresh JSON parsing/validation plus execution and prepared-state
  execution separately, both returning a complete owned String. Each process
  performs 20 warmups; iterations target 200 ms, bounded to 20-200,000.
  Results are medians of five process medians with alternating revision order.
- Node independently warms Buffer and complete
  `renderEntryJson(state).toString("utf8")` delivery for 30 requests and runs GC
  before each boundary. Five alternating rounds use 150 requests at 1,000 items
  or 20 at 10,000. Static controls use 15,000 requests after the initial short
  loops proved too variable.
- Qualification covers 81 Rust workloads at both boundaries and 34 Node
  configurations. Both marker formats cover component/property scopes,
  datasets, alias fallback, optional bindings and parser-heavy controls.
  Rust additionally covers small/wide/deep/static pages, empty shadows,
  light/shadow mixing, composites and large inline styles.
- Apparent regressions and selected targets receive ten alternating rounds.
  The three largest/inconsistent legacy Rust controls receive twenty rounds;
  static Node controls also receive twenty longer-loop rounds.
- Exact output bytes and artifact/state identities match between revisions.
  Rust verifies every complete result outside the render-call timer.
  Node verifies results outside the timed loops.
- Three-request allocator passes are separate from latency. They measure
  allocation/reallocation calls, requested bytes, peak live requested heap and
  post-request retention. CPU loop measurements include verification/output
  destruction in Rust, but not in Node's timed loops.

Percentages describe elapsed time: `100 * (candidate / baseline - 1)`, not
throughput. Results below use confirmation runs when available.

## Marker-v2 results

Rust medians, milliseconds:

| Workload | Items | Fresh JSON baseline -> candidate | Fresh JSON | Prepared baseline -> candidate | Prepared |
|---|---:|---:|---|---:|---|
| Plain repeated elements | 10,000 | 8.566 -> 8.316 | 2.9% faster | 4.474 -> 4.161 | 7.0% faster |
| Repeated components | 1,000 | 1.098 -> 1.067 | 2.8% faster | 0.700 -> 0.670 | 4.2% faster |
| Repeated components | 10,000 | 11.733 -> 11.400 | 2.8% faster | 7.604 -> 7.256 | 4.6% faster |
| Twelve global-palette properties | 1,000 | 1.687 -> 1.533 | 9.2% faster | 1.666 -> 1.528 | 8.3% faster |
| Missing optional bindings | 1,000 | 0.331 -> 0.291 | 12.3% faster | 0.322 -> 0.281 | 12.7% faster |
| Null optional root | 1,000 | 0.361 -> 0.319 | 11.7% faster | 0.344 -> 0.315 | 8.4% faster |

These are existing authored benchmark fixtures. Optional bindings still emit
hydration boundaries when values are absent; removing redundant marker work
therefore has a larger relative effect. Component results include unchanged
property lookup, shadow assembly and output ownership costs. The 10,000-component
row uses five rounds; the other rows use ten-round confirmation.

Node medians, milliseconds, also with v2 markers:

| Workload | Items | Buffer baseline -> candidate | Buffer | String baseline -> candidate | String |
|---|---:|---:|---|---:|---|
| Plain corpus elements | 10,000 | 11.871 -> 11.575 | 2.5% faster | 14.882 -> 14.639 | 1.6% faster |
| Repeated corpus components | 10,000 | 17.094 -> 16.464 | 3.7% faster | 23.838 -> 23.287 | 2.3% faster |
| Twelve global-palette properties | 1,000 | 1.704 -> 1.582 | 7.2% faster | 1.876 -> 1.748 | 6.8% faster |
| Missing optional bindings | 1,000 | 0.382 -> 0.342 | 10.5% faster | 0.442 -> 0.393 | 11.2% faster |

The corpus fixtures differ from the Rust plain/component fixtures, so their
absolute times are not cross-language comparisons. Palette and optional rows
use ten rounds; corpus rows use five. String delivery includes UTF-8 decoding
within each request, not decoding a fixed previously rendered Buffer.

## Controls and slowdowns

Representative legacy-marker Rust controls after confirmation:

| Workload | Fresh JSON | Prepared |
|---|---|---|
| Deep nesting | 0.5% slower | 0.7% slower |
| Binding-heavy | 0.5% faster | 0.5% slower |
| 100 repeated components | 1.3% slower | 0.6% slower |
| Large inline styles | 1.0% slower | 1.6% faster |
| One composite binding | 1.0% slower | 1.1% slower |
| Four composite bindings | 0.7% slower | 1.2% slower |
| Five composite bindings | 1.7% slower | 1.8% slower |
| Four global-palette properties | 1.9% slower | 0.5% faster |
| Twelve row-palette properties | Less than 0.1% faster | 1.1% slower |
| Mostly static | 0.3% faster | 0.2% slower |

The global-four-property fresh result was 4.7% slower in ten rounds, then 1.9%
slower in twenty: 390.729 -> 398.062 microseconds. The one-composite prepared
result moved from 2.9% slower to 1.1% slower, and binding-heavy fresh moved from
2.5% slower to 0.5% faster in their twenty-round checks. All three final controls
are reported rather than treating initial outliers as stable effects.
The initial 5.9% slower row-four-property prepared control did not reproduce:
ten rounds measured 0.5% faster.

Confirmed Node control costs include 1.3% slower Buffer for 32 shallow properties,
1.0% slower string delivery for twelve grouped dataset fields, and 2.4% slower
string delivery for legacy missing optional bindings. That last case measures
0.226 -> 0.231 ms; its Buffer boundary is 0.9% faster.

The short-loop static Node screen produced a 20.8% slower v2 Buffer outlier.
Twenty rounds with 15,000 requests instead of 150 measured 0.6% slower v2 Buffer
and 1.2% faster strings. Legacy static Buffer measured 1.5% slower
(3.700 -> 3.756 microseconds), with strings 1.0% faster.
This fixture emits no hydration markers; no static speedup is claimed.

These small control differences remain part of the tradeoff. The optimization
removes work rather than adding a fallback path, but native code generation,
process/allocator variation and the nonexclusive host still affect measured
latency. The selected marker-heavy gains do not imply every request is faster.

## Loading, memory and contracts

Compilation, addon/program loading and first rendering are outside warmed timers.
No loading or state-preparation speedup is claimed. For the ten-round v2
global-palette Node case, program-load medians are 0.213 -> 0.217 ms and first
Buffer render is 1.802 -> 1.691 ms. These single cold samples per process are
descriptive, not a separately controlled startup claim.

Request allocation calls, reallocations, requested bytes, peak live requested heap
and retention match across revisions for all 81 Rust workloads at both boundaries.
Prepared-state allocation/retention metrics also match. All measured completed
requests retain zero requested heap bytes.

Artifact-load totals and retention match. The initial binding-heavy fresh
diagnostic peak differs by 204 bytes out of about 21.6 MB:
21,593,049 baseline vs 21,593,253 candidate. Equivalent prepared and confirmation
processes match. No load-memory change is attributed to the marker append.

Representative fresh-JSON v2 requests, identical in both revisions:

| Workload | Allocation calls | Reallocations | Requested bytes | Peak live requested heap |
|---|---:|---:|---:|---:|
| 10,000 plain repeated elements | 100,012 | 29 | 25,819,464 | 16,470,083 |
| 1,000 repeated components | 11,012 | 22 | 3,176,320 | 1,918,261 |
| 1,000 global-palette components | 2,035 | 23 | 6,074,317 | 2,530,296 |
| 1,000 missing optional bindings | 5 | 22 | 1,719,569 | 1,023,512 |

Requested heap bytes are not RSS, copied bytes or stack-memory measurements.
The change adds no request/state/plan storage and retains no output capacity
between calls.

Existing focused Rust tests already exercise complete-marker preflight at every
output-byte boundary, failed-preflight storage, bulk-append capacity parity,
both marker modes, decimal-width/usize boundaries, hydration overflow precedence
and unchanged step counts. Existing integration and Node tests cover full output,
resource-limit recovery, ownership and concurrent isolation; no new behavior or
fixture is introduced.

## Measured identities

| Identity | SHA-256 |
|---|---|
| Baseline `native.rs` | `0e24b93fe3cd4ac2e6f8d2b42c881947451530efdbb3fe75df0c1ebfea98ac49` |
| Candidate `native.rs` | `68b7db2b740ebc6141ec1777d89075b8066ed036a2c6d6c3b313758f3171b985` |
| Shared Rust benchmark | `3135106720becefcd3c34bf258c8bda1cdedc8d5af5d542c038be0b711e8b2e9` |
| Shared Node fixture module | `baadbdf3dacd6a6cc07348f8676d32b516df0b4ea5a244e1078764c77d909332` |
| Baseline Rust executable | `3b4457025b7885b0be2b6baed1d9db795e78cef1147740fcdc140ad36775cdc3` |
| Candidate Rust executable | `c42ee7d7a9e33c60339ae1841c87e94a8cad8e9e3725b2e26f1036b6027f1b04` |
| Baseline Node addon | `9eb3ca03cccc9aabc149f72fc975cbc6c756f4c2028d2f5e914a31e189583559` |
| Candidate Node addon | `0a1159169ed6c2aca18264749e9027ecd4ecd154b7b415dd1519b461badc45d8` |

## Reproduction

Use the [native profiling guide](./native-profiling.md) and separate baseline and
candidate crate snapshots at the revision/source identities above. The existing
benchmark and fixture module are unchanged. From the monorepo root:

```sh
CARGO_BUILD_JOBS=2 cargo build --release --locked \
    --manifest-path <revision>/crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark --target-dir <revision-target>

<revision-target>/release/examples/native-shadow-benchmark \
    repeat-plain-10000-markers-v2 fresh-json timing 30 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    repeat-plain-10000-markers-v2 prepared timing 50 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    repeat-plain-10000-markers-v2 fresh-json memory 3 <output.html>
```

Also select `repeat-components-1000`, `repeat-components-10000`,
`property-prefix-global-12-1000`, `optional-bindings-missing-1000` and
`optional-bindings-null-1000`, with/without `-markers-v2`. Calibrate timing loops
to the 200 ms target and alternate revisions for five rounds; use ten for the
confirmed targets/controls and twenty for the inconsistent controls above.

Build separate platform addons with `build-native-host.mjs` or
`cargo build --release --locked --features node-host --lib`. Durable Node
workloads can be run with:

```sh
npm run bench:server -w @microsoft/fast-build -- \
    --native-addon=<revision.node> --instances=1000 \
    --workloads=bindings,repeated,propertyPrefixGlobal12,optionalBindings \
    --samples=5 --iterations=150 --warmup=30 --markers-v2 \
    --output=<report.json>
```

Repeat both marker modes and 10,000-instance corpus cases with 20 iterations.
For the recorded process-balanced protocol, import `fixture`,
`componentScopeFixture`, `componentPropertyPrefixFixture` and
`stateValidationFixture` from `test/performance/fixtures.mjs`. The optional case
uses the existing `optionalBindings` definition in `server-renderer.mjs`.
Compile/load once per process; independently warm and time Buffer and complete
string delivery, alternating revision processes. Preserve raw duplicate state
with `stateJson ?? JSON.stringify(state)`. Run the static control with
`"<p>Static &amp; unchanged</p>".repeat(1000)`, empty templates/state and 15,000
iterations. Verify output and state/artifact identities outside latency loops.
