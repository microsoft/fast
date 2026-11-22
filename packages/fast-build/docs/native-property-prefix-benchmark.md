# Native component-property prefix benchmark

## Decision and scope

Resolve shared component-property path prefixes once per element, extending the
existing composite-attribute mechanism. Preparation considers only path operands;
static values remain independent. The cached value belongs to the current
execution, not the loaded artifact, and any owned synthetic value stays alive
through child shadow/default rendering.

This eliminates repeated alias checks, enclosing-frame searches and object
traversals without cloning input graphs or retaining buffers. Every enclosing
loop participates in the overlap guard. Longer overlapping aliases and prefixes
longer than 255 segments use the original independent lookups. Missing values
still create own-null overrides; dataset target initialization and property step
charges are unchanged.

The measured common paths justify shipping. Overlapping-alias fallback does not
benefit and has a small measured cost, reported below. This is not a claim that
all components render faster: unrelated property roots have no shared prefix,
and shallow `row.field` forwarding has much smaller gains.

## Method

- Baseline: merged main `d6ee4695c8fb50830ca4f00c9d027ec71476e7d1`.
- Machine: Apple M3 Pro, macOS 27.2.1, ARM64; shared, nonexclusive environment.
- Rust 1.93.1, LLVM 21.1.8; Node 22.22.1.
- Default Cargo release settings, locked dependencies, two build jobs. No
  `target-cpu=native`, release-profile changes or competing agent builds/profilers
  during timing. All builds and tests completed before measurement.
- Baseline and candidate use identical authored fixture sources and options.
  Only the new benchmark example was copied into the baseline crate; its
  execution and plan sources remain exact main.
- Rust measures fresh-JSON parsing plus execution separately from prepared-state
  execution, both through complete independently owned output strings. Each
  process has 20 warmups. Iterations target 200 ms per timing loop, bounded to
  20-200,000 requests. Results are medians of five process medians, with alternating
  baseline/candidate order.
- Node measures fresh-JSON Buffer delivery and complete
  `renderEntryJson(state).toString("utf8")` delivery separately. Both boundaries
  receive 30 warmups and a GC before timing. Each process runs 150 iterations at
  1,000 components or 20 at 10,000 components; five process rounds alternate order.
- The complete qualification comprises 66 Rust workloads at both boundaries and
  30 Node configurations. Both hydration marker formats cover every main target,
  including four-property inline scopes, twelve-property map-backed scopes,
  row-local values and overlapping-alias fallback. Scaling covers global and
  row-local twelve-property cases at 10,000 components.
- Separate three-request Rust allocator diagnostics measure request, artifact-load
  and prepared-state allocation calls, requested bytes, peak live requested heap
  and retention. The allocator shim is disabled during latency measurements.
- Exact output bytes and artifact/state identities match across revisions.
  All 18 Node target configurations also match output SHA-256 hashes from both
  Rust boundaries. CPU-loop diagnostics are separate from render-call wall time;
  the Rust CPU loop includes verification and output destruction.
- Apparent control regressions and all alias-fallback cases were repeated in ten
  alternating rounds. Fallback rows below use those confirmation results, not the
  initial five-round values.

**Faster/slower percentages describe reductions/increases in elapsed render time**:
`100 * (candidate / baseline - 1)`. They are not throughput percentages.
Rounded "unchanged" means an absolute measured difference below 0.05%, not a
statistical proof of equivalence.

## Shared-prefix results

Each component forwards four or twelve distinct `:colorN` properties and renders
all of them. Global operands use `theme.palette.colorN`; row-local operands use
`row.palette.colorN`. The fallback alias is `theme.palette.color0`, which selects
the row's `"Alias color"` for just that full path while sibling paths still read
the global palette. Authored segmented aliases require no artifact mutation.

| Source | Components | Properties | Markers | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
|---|---:|---:|---|---|---|---|---|
| Global | 1,000 | 4 | Legacy | 21.3% faster | 22.2% faster | 19.9% faster | 17.4% faster |
| Global | 1,000 | 4 | v2 | 15.0% faster | 15.7% faster | 13.9% faster | 12.4% faster |
| Global | 1,000 | 12 | Legacy | 27.5% faster | 29.1% faster | 27.9% faster | 27.9% faster |
| Global | 1,000 | 12 | v2 | 22.0% faster | 21.2% faster | 20.8% faster | 18.9% faster |
| Row | 1,000 | 4 | Legacy | 7.1% faster | 15.5% faster | 7.4% faster | 5.7% faster |
| Row | 1,000 | 4 | v2 | 4.5% faster | 9.0% faster | 5.2% faster | 3.6% faster |
| Row | 1,000 | 12 | Legacy | 9.2% faster | 18.1% faster | 8.9% faster | 8.7% faster |
| Row | 1,000 | 12 | v2 | 8.9% faster | 13.7% faster | 8.2% faster | 8.7% faster |
| Alias fallback | 1,000 | 4 | Legacy | 0.5% slower | 0.5% faster | 4.1% slower | 1.5% slower |
| Alias fallback | 1,000 | 4 | v2 | 1.3% slower | 1.6% slower | 1.0% slower | 2.7% slower |
| Alias fallback | 1,000 | 12 | Legacy | 2.2% slower | 0.9% slower | 3.2% slower | 1.3% slower |
| Alias fallback | 1,000 | 12 | v2 | 0.8% slower | 0.3% slower | 1.2% slower | 2.2% slower |
| Global | 10,000 | 12 | Legacy | 27.5% faster | 28.1% faster | 30.1% faster | 27.6% faster |
| Global | 10,000 | 12 | v2 | 18.9% faster | 20.2% faster | 20.7% faster | 18.7% faster |
| Row | 10,000 | 12 | Legacy | 8.9% faster | 18.3% faster | 7.0% faster | 7.8% faster |
| Row | 10,000 | 12 | v2 | 8.0% faster | 11.4% faster | 8.6% faster | 8.1% faster |

At 1,000 global twelve-property components with legacy markers:

| Boundary | Baseline | Candidate |
|---|---:|---:|
| Rust fresh JSON | 1.659 ms | 1.203 ms |
| Rust prepared | 1.680 ms | 1.191 ms |
| Node Buffer | 1.642 ms | 1.185 ms |
| Node string | 1.734 ms | 1.251 ms |

Fresh JSON gains are smaller for row-local data because every request must still
parse the full collection of palette objects. Prepared-state reuse removes that
parsing cost but does not remove the retained snapshot's memory.

The unchanged-name strategy was also measured at 1,000 twelve-property components
with legacy markers: global Node Buffer/string were 28.7%/26.2% faster; row-local
Buffer/string were 10.0%/9.4% faster. These property names do not require case
conversion, so output remains identical between naming strategies.

## Controls and fallback costs

The Rust control corpus retains its 50 existing workloads, including small,
static, wide, deep, mixed light/shadow, binding-heavy, sparse/populated optional
data, one/four/five composite bindings, component counts through 10,000, property
counts through 32, both markers and grouped datasets.

| Representative Rust control | Fresh JSON | Prepared |
|---|---|---|
| Small page, legacy | Unchanged | Unchanged |
| Small page, v2 | Unchanged | Unchanged |
| Wide siblings | 0.1% slower | 0.9% slower |
| Deep nesting | 0.5% slower | 1.3% faster |
| Mostly static | 0.7% slower | 0.7% slower |
| Binding-heavy | 0.9% faster | 2.9% faster |
| Components without properties | 2.5% faster | 2.6% faster |
| Components with one property | 0.8% faster | 1.5% faster |
| Components with large inline styles | 0.6% slower | 0.7% slower |
| Five-binding composite styles | 0.1% slower | 1.8% faster |
| Twelve shallow row properties | 1.1% faster | 1.4% faster |
| Thirty-two shallow row properties | 1.9% faster | 1.9% faster |
| Twelve grouped dataset fields | 7.3% faster | 8.4% faster |

Small pages, wide siblings, large styles and five-binding composites use ten-round
confirmation values. The initial apparent 7.6% small-page/v2 and 3.4% composite
fresh-JSON regressions did not reproduce. Sixteen-property and 10,000-component
twelve-property controls were also confirmed; their fresh-JSON results were
1.0% faster and unchanged, respectively. Sub-percent differences are not evidence
of an improvement to an unrelated workload.

Node controls cover zero/four/five/twelve/thirty-two shallow properties and twelve
grouped dataset fields with both marker formats. The zero/four/five/twelve-property
controls range from 1.7% slower to 1.5% faster for Buffer delivery, and 0.4% slower
to 0.6% faster for strings. Thirty-two shallow properties are 2.0-2.9% faster for
Buffer and 2.1-3.8% faster for strings. Grouped datasets are 5.7-8.8% faster for
Buffer and 4.4-6.6% faster for strings.

The overlap guard preserves correctness but costs work on fallback paths. The
ten-round confirmations show up to 2.2% slower Rust rendering, 4.1% slower Node
Buffer delivery and 2.7% slower Node string delivery. These are accepted tradeoffs,
not hidden as noise or described as faster.

## Loading, first render and memory

Compilation, addon loading, program loading and first render are recorded outside
warmed request timing. Representative five-process medians for 1,000
twelve-property components with legacy markers:

| Node phase | Global baseline -> candidate | Row baseline -> candidate |
|---|---:|---:|
| Compilation | 8.994 -> 8.961 ms | 8.789 -> 9.010 ms |
| Program loading | 0.218 -> 0.217 ms | 0.206 -> 0.230 ms |
| First Buffer render | 1.702 -> 1.275 ms | 2.945 -> 2.779 ms |

These cold samples are descriptive, not controlled load-time speed claims. Shared
prefix discovery adds a bounded-by-input preparation scan; compilation is
unchanged. The optimization does not amortize state parsing unless the caller
explicitly uses Rust prepared state.

All request allocation calls, reallocations, requested bytes and peaks are
identical across revisions for all 66 Rust workloads at both boundaries.
Artifact-load and prepared-state memory are also identical throughout that
matrix. The new byte of element metadata fits existing layout padding on this
measured target; this is not a guarantee about every ABI. All post-request
retention is zero.

Representative prepared requests with legacy markers:

| Global fixture | Allocation calls | Requested bytes | Peak requested live heap |
|---|---:|---:|---:|
| 1,000 components, 4 properties | 1,002 -> 1,002 | 1,109,908 -> 1,109,908 | 607,471 -> 607,471 |
| 1,000 components, 12 properties | 2,002 -> 2,002 | 3,507,804 -> 3,507,804 | 1,218,919 -> 1,218,919 |
| 10,000 components, 12 properties | 20,002 -> 20,002 | 32,194,348 -> 32,194,348 | 10,747,191 -> 10,747,191 |

Allocator-requested bytes are not RSS or copied-byte measurements. This report
does not claim reduced Node process memory or cross-platform timing results.

Focused regressions cover equal/longer segmented aliases, outer overlap under an
unrelated inner loop, static values interleaved with paths, missing-prefix own-null
masking, valid 256-segment fallback and owned array lengths through spilled scopes.
They exercise fresh/prepared parity, escaping, output/step limits and recovery.
Existing suites retain dataset overlays, input immutability, full validation and
request/concurrency isolation.

## Measured identities

SHA-256 values identify the measured sources and release binaries. Benchmark
fixtures are shared between the main snapshot and candidate.

| Identity | SHA-256 |
|---|---|
| Baseline `native.rs` | `25d1efcf3d62682be461b2ce404247acd5446495a519cdce5bb623f1f81df045` |
| Candidate `native.rs` | `b37d4cab7ae00e682fe875e6230cf682afbc95b2a3669752b1cb8d9fc9ab18d4` |
| Baseline `native/plan.rs` | `73abcccdbed4281e032ff59eed4168ce7f51f4cb327316551720253aab4e9db8` |
| Candidate `native/plan.rs` | `e225dd262af5bb5d1b5c89839c1133e87872979647078aa8c8a445de24f874a5` |
| Rust benchmark source | `05c755ea957942d80084e632893650c1dd62a6e0d9fff0f3f5fc71c5fe399676` |
| Node fixture source | `86aa1c82eed46325bd7147a416b07e7f319fb3ef346603e750e921573098b04a` |
| Baseline Rust executable | `32cd32dfa31afa1a6215554f6912a197b9d9554410787ad2a733f7523c776fe8` |
| Candidate Rust executable | `83bbc2c22ee3a7a120c8d5f1572eb8210e8a62e4ab5deb53095b7c9c8c9a422b` |
| Baseline Node addon | `e716065469469eec3340b325156d5423fb3385d12f56cdb23a1624d7025f34f7` |
| Candidate Node addon | `d8a3ce3a18defa473d32ad3c45e685c7ca63f31e77dfcec742ffc51abafa9f41` |

## Reproduction

Follow the [native profiling guide](./native-profiling.md). Keep separate baseline
and candidate target directories. Copy this branch's
`examples/native-shadow-benchmark.rs` into a clean snapshot of the baseline crate
before compiling it; do not copy the changed execution or plan sources.

From the monorepo root, build and invoke each revision's Rust executable:

```sh
CARGO_BUILD_JOBS=2 cargo build --release --locked \
    --manifest-path crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark --target-dir <revision-target>

<revision-target>/release/examples/native-shadow-benchmark \
    property-prefix-global-12-1000 fresh-json timing 150 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    property-prefix-global-12-1000 prepared timing 150 <output.html>
<revision-target>/release/examples/native-shadow-benchmark \
    property-prefix-global-12-1000 prepared memory 3 <output.html>
```

Replace `global` with `row` or `alias-fallback`, use four or twelve properties,
append `-markers-v2`, and use `10000` for scaling. Run the existing control cases
too. Alternate executable order over five rounds, ten for fallback/control
confirmation; use the 200 ms iteration calibration described above.

Build each revision's Node addon with the existing `build:native-host` script or
`cargo build --release --locked --features node-host --lib` in a separate target
directory. Keep each addon's actual platform library under a distinct `.node`
path. The durable Node workload command is:

```sh
npm run bench:server -w @microsoft/fast-build -- \
    --native-addon=<revision.node> --instances=1000 \
    --workloads=propertyPrefixGlobal4,propertyPrefixGlobal12,propertyPrefixRow4,propertyPrefixRow12,propertyPrefixAliasFallback4,propertyPrefixAliasFallback12 \
    --samples=5 --iterations=150 --warmup=30 --output=<report.json>
```

Repeat with `--markers-v2`, the unchanged-name strategy and 10,000 instances.
The recorded comparison additionally warmed string delivery independently,
alternated revision processes and collected CPU time for both delivery loops.
For that protocol, import `componentPropertyPrefixFixture` from
`test/performance/fixtures.mjs`, compile once, load once, prepare the JSON Buffer
once, then run and verify the two independently warmed delivery loops. Compare
exact output bytes/hashes outside timing and run diagnostics separately.
