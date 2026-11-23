# Native JSON state-validation benchmark

## Decision and scope

Count values and maximum depth while the existing JSON visitor constructs owned
request state. Unique-key requests can check this aggregate after complete parsing
instead of walking the retained tree again.

Counts saturate just beyond the existing limits: 1,000,001 values and depth 65.
They are temporary, fixed-size parser metadata, not additions to `JsonValue`,
prepared snapshots or immutable plans. Every value contributes one node; object
keys do not count as values.

Any duplicate decoded key anywhere in the input selects the existing final-tree
validator. The visitor detects replacement from the map insertion result, without
another lookup. This preserves budgets for overwritten subtrees, including
escaped duplicate keys and duplicates nested inside arrays. No limit is rejected
before complete JSON parsing, so malformed unused/overwritten input and trailing
syntax still take precedence over state-budget failures.

This is a parser-heavy workload improvement, not a general execution speedup.
Prepared-state execution skips parsing already and receives no targeted change.
Typed-state normalization, APIs, schemas, collision-protected hashing, escaping,
alias/null semantics and render limits are unchanged.

## Method

- Baseline: merged main `2e2d21e5d9c6bd71a6920ef8d50c831413e7acf5`.
- Apple M3 Pro, macOS 27.2.1 ARM64; shared, nonexclusive machine.
- Rust 1.93.1, LLVM 21.1.8; Node 22.22.1.
- Default locked Cargo release builds with two build jobs. No profile changes,
  `target-cpu=native`, profiler or competing agent build during timing.
- Both revisions use the same authored fixture sources, options and dependency
  lock. The new benchmark example is copied into an exact-main crate snapshot;
  baseline execution sources are not changed.
- All Rust tests, repository builds and repository tests completed before timing.
- Rust fresh JSON includes parsing, validation and complete owned-string rendering.
  Prepared execution borrows a previously created snapshot and returns the same
  owned output. Each process has 20 warmups. Iterations target 200 ms per loop,
  bounded to 20-200,000. Compare medians of five process medians, alternating
  baseline/candidate process order.
- Node Buffer and complete `renderEntryJson(state).toString("utf8")` delivery
  each receive 30 independent warmups and a GC before timing. Five alternating
  rounds use 150 requests at 1,000 items or 20 at 10,000; wide/scalar cases use
  ten times those iterations because their requests are shorter.
- Separate three-request allocator passes measure calls, requested bytes, peak
  live requested heap and retention. Allocation tracking is disabled during
  latency passes. Rust CPU loops include verification and output destruction;
  render-call wall times do not.
- Qualification covers 82 Rust workloads at both boundaries and 34 Node
  configurations: 16 new state workloads and 66 existing Rust rendering controls,
  plus 16 corresponding Node state targets and 18 rendering controls.
- Both marker formats cover all main targets. Exact output and artifact/state
  identities match across revisions; all 16 Node state targets also match output
  hashes from both Rust boundaries.
- All duplicate-key targets and apparent rendering regressions received ten-round
  confirmation. An inconsistent static-render result received an additional
  twenty-round check with small/wide controls.

Percentages mean elapsed-time reductions/increases:
`100 * (candidate / baseline - 1)`, not throughput percentages. "Unchanged" rounds
an absolute measured difference below 0.05%; it does not prove equivalence.

## State workloads

Each target renders only `<state-root>` with a small escaped label, while still
parsing and validating the full unused payload. This isolates the cost of state
ingress rather than assuming unused input can be skipped.

- **Nested:** array entries contain an ID, label, nested detail/extra objects and
  three tags. At 10,000 entries, the state contains 130,003 retained values.
- **Wide:** an object with `keyN` entries, each holding `[N, true, null]`.
- **Scalars:** an array of integer values.
- **Duplicate:** the nested workload with an earlier escaped `"\u006cabel"` key
  replaced by the final `"label"`. The native parser receives the original raw
  JSON, not a JavaScript parse/stringify result that would collapse duplicates.

| Shape | Items | Markers | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
|---|---:|---|---|---|---|---|
| Nested | 1,000 | Legacy | 10.2% faster | Unchanged | 7.0% faster | 7.3% faster |
| Nested | 1,000 | v2 | 9.5% faster | Unchanged | 8.2% faster | 6.8% faster |
| Nested | 10,000 | Legacy | 9.1% faster | Unchanged | 8.5% faster | 8.3% faster |
| Nested | 10,000 | v2 | 11.0% faster | Unchanged | 7.9% faster | 9.0% faster |
| Wide | 1,000 | Legacy | 8.5% faster | Unchanged | 7.2% faster | 6.8% faster |
| Wide | 1,000 | v2 | 9.5% faster | Unchanged | 8.1% faster | 8.1% faster |
| Wide | 10,000 | Legacy | 9.5% faster | Unchanged | 7.6% faster | 6.2% faster |
| Wide | 10,000 | v2 | 10.0% faster | Unchanged | 7.8% faster | 6.1% faster |
| Scalars | 1,000 | Legacy | 17.9% faster | Unchanged | 13.9% faster | 13.8% faster |
| Scalars | 1,000 | v2 | 15.9% faster | Unchanged | 13.6% faster | 14.1% faster |
| Scalars | 10,000 | Legacy | 19.1% faster | Unchanged | 6.9% faster | 11.0% faster |
| Scalars | 10,000 | v2 | 18.5% faster | Unchanged | 11.4% faster | 15.2% faster |
| Duplicate | 1,000 | Legacy | 2.6% faster | Unchanged | 0.7% slower | 0.4% slower |
| Duplicate | 1,000 | v2 | 1.8% faster | Unchanged | 0.8% slower | 0.8% slower |
| Duplicate | 10,000 | Legacy | 2.0% faster | Unchanged | 0.4% faster | Unchanged |
| Duplicate | 10,000 | v2 | 3.0% faster | Unchanged | 1.2% slower | 0.4% slower |

Duplicate rows use ten-round confirmations. They retain the second traversal and
should not be described as receiving the unique-key mechanism's gains. Their
smaller measured differences vary by boundary; the confirmed Node slowdowns are
reported rather than hidden as noise.

Absolute legacy-marker medians at 10,000 items:

| Shape | Rust fresh baseline -> candidate | Node Buffer baseline -> candidate | Node string baseline -> candidate |
|---|---:|---:|---:|
| Nested | 8.734 -> 7.939 ms | 8.571 -> 7.842 ms | 8.619 -> 7.907 ms |
| Wide | 1.371 -> 1.241 ms | 1.293 -> 1.194 ms | 1.283 -> 1.203 ms |
| Scalars | 0.136 -> 0.110 ms | 0.127 -> 0.118 ms | 0.126 -> 0.112 ms |

Prepared target execution is approximately 0.25 microseconds with legacy markers
and 0.29 microseconds with v2 in both revisions. These timings exclude snapshot
creation. `PreparedState::from_json` uses the changed parser; typed snapshot
construction remains unchanged. No separate snapshot-creation latency gain is
claimed here.

## Rendering controls and slowdowns

The 66 existing Rust controls include small/static/wide/deep pages, light/shadow
mixing, binding-heavy output, optional missing/null/present data, repeated
components through 10,000 rows, inline/map/capped property scopes, grouped
datasets, composite attributes and property-prefix/alias-fallback targets.

| Representative Rust control | Fresh JSON | Prepared |
|---|---|---|
| Small page | 0.2% faster | Unchanged |
| Wide siblings | 2.4% faster | 0.4% slower |
| Deep nesting | 0.6% faster | 3.2% faster |
| Mostly static | 1.9% faster | 0.1% faster |
| Binding-heavy | Unchanged | 0.6% slower |
| Empty shadows | 3.4% faster | 1.4% slower |
| Null optional bindings | 1.8% faster | 1.1% slower |
| One shallow row property | 3.2% faster | 0.9% slower |
| Eight shallow row properties | 1.3% faster | 0.3% faster |
| Thirty-two shallow row properties | 0.1% faster | 0.7% slower |
| Twelve dataset fields | 0.3% faster | Unchanged |
| Twelve row-local palette properties, 1,000 rows | 3.2% faster | 1.0% slower |
| Twelve row-local palette properties, 10,000 rows | 2.3% faster | 0.2% faster |
| Twelve global palette properties, 10,000 rows | 0.8% faster | 0.6% slower |

Small/wide/static rows use twenty-round results. Binding-heavy, empty shadows,
null optional bindings, eight-property and global 10,000-row cases use ten-round
confirmation. A 4.3% slower static prepared result in the ten-round pass did not
reproduce in the twenty-round pass: 32.102 vs 32.082 microseconds. It is not
treated as a static-rendering improvement.

Other apparent regressions were also checked, including one/four composite
bindings, row/overlapping composite aliases, seventeen shallow properties and
property-alias fallback. Confirmed prepared control costs reach 1.4% slower.
Prepared execution does not use the new parser; its positive/negative control
differences are not evidence of a targeted algorithmic gain.

Node controls include twelve global/row palette properties at 1,000/10,000 rows,
zero/five/twelve/thirty-two shallow properties and twelve grouped dataset fields,
all with both marker formats. Row-palette cases are 1.2-3.7% faster for Buffer and
1.6-5.2% faster for string delivery in the five-round runs. Global-palette
confirmation shows up to 1.3% slower Buffer and 2.0% slower string delivery.
Those costs and the duplicate target's up-to-1.2% Buffer slowdown are accepted
tradeoffs, not a promise that all fresh-JSON requests become faster.

## Loading, first request and memory

Fixture creation, compilation, addon/program loading and first render are outside
warmed timing. Representative cold five-process medians at 10,000 items with
legacy markers:

| Shape | Program loading baseline -> candidate | First Buffer render baseline -> candidate |
|---|---:|---:|
| Nested | 0.145 -> 0.148 ms | 10.183 -> 9.541 ms |
| Wide | 0.156 -> 0.148 ms | 1.680 -> 1.555 ms |
| Scalars | 0.142 -> 0.143 ms | 0.164 -> 0.143 ms |

These single cold samples per process are descriptive, not controlled load-time
speed claims. Compilation and artifact loading have no targeted change.

Request allocation calls, reallocations, requested bytes, peaks and retention
match across revisions for all 82 Rust workloads at both boundaries.
Prepared-state allocation/retention metrics also match throughout. All completed
requests retain zero requested heap bytes.

Artifact-load allocation totals and retained bytes match. One binding-heavy
diagnostic peak differs by 204 bytes out of about 21.6 MB: candidate peaks are
21,593,049 and 21,593,253 bytes in equivalent fresh/prepared diagnostic processes;
baseline peaks are 21,593,253 bytes. No load-memory saving is claimed from that
small within-candidate variation.

Representative fresh-JSON requests at 10,000 items, legacy markers; both revisions
have the same values:

| Shape | Allocation calls | Requested bytes | Peak requested live heap | Retained prepared state |
|---|---:|---:|---:|---:|
| Nested | 200,008 | 21,343,225 | 17,105,975 | 17,105,707 |
| Wide | 20,020 | 4,963,539 | 3,646,270 | 3,636,425 |
| Scalars | 8 | 1,835,445 | 918,037 | 917,927 |

Parser shape metadata lives on active visitor frames, not in per-node heap
storage. Requested bytes are not RSS, copied bytes or a stack-memory measurement.
No cross-request buffer retention, JSON key interning, alternate hasher or unsafe
code was introduced.

Focused tests exercise nested/escaped duplicate replacement of an over-depth
subtree, rejection when the deep replacement remains, fresh/prepared parity and
recovery. Existing tests retain exact depth/value boundaries, oversized
overwritten values, full unused-input validation, malformed overwritten
Unicode/numbers, parser-error precedence, numeric normalization, render limits
and concurrent request isolation.
A CLI regression also verifies the raw duplicate-key state's hash, so fixture
serialization and the worker's identity check cannot silently collapse it.

## Measured identities

| Identity | SHA-256 |
|---|---|
| Baseline `native.rs` | `b37d4cab7ae00e682fe875e6230cf682afbc95b2a3669752b1cb8d9fc9ab18d4` |
| Candidate `native.rs` | `0e24b93fe3cd4ac2e6f8d2b42c881947451530efdbb3fe75df0c1ebfea98ac49` |
| Shared Rust benchmark source | `3135106720becefcd3c34bf258c8bda1cdedc8d5af5d542c038be0b711e8b2e9` |
| Shared Node fixture source | `baadbdf3dacd6a6cc07348f8676d32b516df0b4ea5a244e1078764c77d909332` |
| Baseline Rust executable | `85e08fa0ace580c5cd6a3add6a3a170fc3f686baf11ea2150f14f2f3e87f8e9e` |
| Candidate Rust executable | `3b4457025b7885b0be2b6baed1d9db795e78cef1147740fcdc140ad36775cdc3` |
| Baseline Node addon | `98b9e44a440fa338f0de6b268767d7d78781a7a5464f66cf617214227a822c09` |
| Candidate Node addon | `5ee13ef7d775189e77067e32393f20cf123581e34b6e3b76a09d6d03a12e68bb` |

## Reproduction

Use the [native profiling guide](./native-profiling.md). Copy this branch's
`examples/native-shadow-benchmark.rs` into an exact-main crate snapshot at the
baseline above, leaving its execution sources untouched. Build each revision into
an independent target directory from the monorepo root:

```sh
CARGO_BUILD_JOBS=2 cargo build --release --locked \
    --manifest-path crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark --target-dir <revision-target>

<revision-target>/release/examples/native-shadow-benchmark \
    state-validation-nested-10000 fresh-json timing 30 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    state-validation-nested-10000 prepared timing 100000 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    state-validation-nested-10000 fresh-json memory 3 <output.html>
```

Replace `nested` with `wide`, `scalars` or `duplicate`, select 1,000/10,000 items,
and append `-markers-v2`. Calibrate iterations to the 200 ms target and alternate
revision order over five rounds; use ten for duplicate/regression confirmation
and twenty for the static outlier.

Build both platform addons using the existing `build:native-host` script or
`cargo build --release --locked --features node-host --lib`, keeping distinct
`.node` files. The durable Node workload command is:

```sh
npm run bench:server -w @microsoft/fast-build -- \
    --native-addon=<revision.node> --instances=10000 \
    --workloads=stateValidationNested,stateValidationWide,stateValidationScalars,stateValidationDuplicate \
    --samples=5 --iterations=20 --warmup=30 --output=<report.json>
```

Repeat at 1,000 items and with `--markers-v2`. For the recorded protocol, import
`stateValidationFixture` from `test/performance/fixtures.mjs`; build the state
Buffer from `fixture.stateJson ?? JSON.stringify(fixture.state)` so duplicate JSON
remains intact. Compile/load once per process, independently warm Buffer and
string delivery, alternate revision processes, collect CPU timing outside
verification, and use the iteration counts specified above. Compare complete
output bytes and artifact/state identities outside latency loops.
