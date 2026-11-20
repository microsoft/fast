# Native component scope sizing

Native plans prepare bounded distinct property-root counts for each attribute-name
strategy. Multiple dataset fields or colliding names share one root. Requests keep
up to four roots inline; larger scopes reserve a map lazily using a hint capped at
16 roots. Further roots grow the map normally. This removes unnecessary outer
dataset maps and repeated early growth of larger component scopes.

The hint is not an artifact acceptance limit or a cross-request cache.
All properties still validate, evaluate and consume their original execution steps.
Wire schemas, public APIs, hashing protections and output ownership are unchanged.

## Measurement

Baseline: merged main `7c8ba1dd0d3e10a9c1aef1e4a87e3086807a8d47`, including
composite-prefix reuse. Environment: Apple M3 Pro, macOS ARM64, Rust 1.93.1 and
Node 22.22.1. Both revisions used identical fixtures and the default Cargo release
profile, without CPU-specific or profile overrides. Builds and tests completed
before serial measurements on a shared machine.

Rust covered 50 cases at fresh-JSON and prepared-state boundaries in five
alternating process rounds. Each process warmed 20 requests and timed approximately
200 ms of rendering, bounded to 20-200,000 iterations. Values are medians of
process-level render medians. Verification and destruction are outside individual
Rust render timers; separately recorded loop CPU includes them.

Node covered 28 workload/size/marker/name-strategy configurations in five
alternating process rounds. Buffer and string phases each warmed 30 requests.
Timed loops used 150 iterations at 1,000 rows, 75 for 32-field dataset cases and
20 at 10,000 rows. Values are medians of process-level loop averages. Both phases
include JSON parsing and owned Buffer delivery; string delivery also includes
UTF-8 decoding. Compilation, program loading and first rendering are separate.

Every comparison verified exact output and artifact/state identities between
revisions. All corresponding new Rust and Node cases also matched output bytes.
Allocator diagnostics used separate three-request passes, not latency runs.
These results describe warmed rendering on this platform, not HTTP throughput
or performance on other operating systems.

## Results

The distinct-property fixture forwards `id`, `label`, `url`, `:active` and additional
`:extraN` properties into repeated components. The dataset fixture forwards
`data-itemN` fields, all sharing the `dataset` root. Both render complete component
hosts, shadows and repeat boundaries.

For 1,000 components with 12 distinct properties, milliseconds per render were:

| Boundary | Main | Sized scopes | Change |
| --- | ---: | ---: | --- |
| Rust fresh JSON | 1.5845 | 1.3815 | 12.8% faster |
| Rust prepared | 1.1571 | 0.9479 | 18.1% faster |
| Node JSON to Buffer | 1.5950 | 1.4046 | 11.9% faster |
| Node JSON to string | 1.6842 | 1.4517 | 13.8% faster |

Here and below, "faster" means lower elapsed time per render relative to main.

| Workload | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
| --- | ---: | ---: | ---: | ---: |
| 1,000 rows, 5 distinct properties | 6.3% faster | 9.5% faster | 5.7% faster | 5.9% faster |
| 1,000 rows, 8 distinct properties | 12.7% faster | 20.0% faster | 13.1% faster | 13.0% faster |
| 1,000 rows, 12 distinct properties | 12.8% faster | 18.1% faster | 11.9% faster | 13.8% faster |
| 1,000 rows, 16 distinct properties | 22.2% faster | 29.0% faster | 22.8% faster | 22.5% faster |
| 1,000 rows, 17 distinct properties | 22.9% faster | 29.2% faster | 22.3% faster | 21.8% faster |
| 1,000 rows, 32 distinct properties | 16.1% faster | 18.8% faster | 14.6% faster | 14.9% faster |
| 1,000 rows, 5 dataset fields | 10.4% faster | 11.9% faster | 10.4% faster | 11.2% faster |
| 1,000 rows, 12 dataset fields | 9.2% faster | 10.4% faster | 9.0% faster | 10.6% faster |
| 1,000 rows, 32 dataset fields | 6.6% faster | 7.0% faster | 7.4% faster | 6.1% faster |
| 10,000 rows, 12 distinct properties | 12.2% faster | 17.5% faster | 11.3% faster | 11.0% faster |
| 10,000 rows, 32 distinct properties | 16.1% faster | 18.8% faster | 14.9% faster | 14.3% faster |

The 32-property cases exercise growth beyond the bounded preparation hint.
Dataset gains are smaller because inner dataset construction and host attributes
still do their original work. Legacy fixture definitions remain unchanged.

### Markers v2

The same new cases were measured at all four boundaries with markers v2:

| Workload | Rust fresh JSON | Rust prepared | Node Buffer | Node string |
| --- | ---: | ---: | ---: | ---: |
| 1,000 rows, 5 distinct properties | 5.6% faster | 8.5% faster | 5.1% faster | 5.7% faster |
| 1,000 rows, 8 distinct properties | 11.3% faster | 17.2% faster | 12.5% faster | 12.0% faster |
| 1,000 rows, 12 distinct properties | 11.6% faster | 16.1% faster | 11.0% faster | 11.2% faster |
| 1,000 rows, 16 distinct properties | 21.3% faster | 27.1% faster | 20.9% faster | 20.8% faster |
| 1,000 rows, 17 distinct properties | 21.6% faster | 25.9% faster | 20.7% faster | 20.4% faster |
| 1,000 rows, 32 distinct properties | 15.9% faster | 18.1% faster | 14.8% faster | 17.0% faster |
| 1,000 rows, 5 dataset fields | 10.6% faster | 11.6% faster | 10.5% faster | 9.7% faster |
| 1,000 rows, 12 dataset fields | 9.1% faster | 9.3% faster | 8.7% faster | 8.9% faster |
| 1,000 rows, 32 dataset fields | 8.1% faster | 7.9% faster | 7.0% faster | 6.7% faster |
| 10,000 rows, 12 distinct properties | 12.8% faster | 15.6% faster | 9.9% faster | 8.6% faster |
| 10,000 rows, 32 distinct properties | 14.4% faster | 17.6% faster | 13.7% faster | 14.2% faster |

With unchanged attribute names, the 12-property Node case improved 11.6% for
Buffer and 11.7% for string delivery; the 12-field dataset case improved 8.1% and
9.5%. Regression tests additionally exercise different distinct-root counts
between naming strategies.

### Controls and preparation costs

The other 27 preexisting Rust control cases ranged from 7.0% faster to 2.7% slower
in the five-round matrix. Ten-round alternating confirmation measured:

| Control | Rust fresh JSON | Rust prepared |
| --- | ---: | ---: |
| Four global composite bindings | 0.2% slower | 1.1% slower |
| Binding-heavy | 1.7% slower | 1.5% slower |
| Empty shadows | 1.0% slower | 0.5% faster |
| Small page, markers v2 | Unchanged | Unchanged |

Node zero/four-property controls in both marker modes ranged from 1.2% faster to
0.4% slower. Small control differences accompany the targeted gains; this is not
a universal speedup.

Program construction was recorded separately. For the 1,000-row 12-property Node
case, process-median construction time was 0.2059 ms before and 0.2003 ms after;
the 32-property case measured 0.2349 ms for both. These are single constructors per
process, not an isolated loader or cold-filesystem benchmark, and establish no
startup-speed claim.

### Memory and contracts

Request peak live requested heap matched across all 100 Rust workload/boundary
pairs. Every completed request retained zero requested bytes after output drop.
Prepared-state diagnostics were unchanged.

| Prepared request, 1,000 rows | Allocation calls, main to candidate | Requested allocation bytes, main to candidate |
| --- | ---: | ---: |
| 12 distinct properties | 4,002 to 2,002 | 3,599,702 to 2,707,702 |
| 32 distinct properties | 6,002 to 3,002 | 10,623,702 to 8,555,702 |
| 12 dataset fields | 29,002 to 28,002 | 4,782,724 to 4,482,724 |

The distinct-property cases kept a requested heap peak of 855,157 bytes and
15 output reallocations; the dataset case kept 1,203,379 bytes and 16 reallocations.
These metrics describe allocator-requested heap, not RSS or copied bytes.

Private prepared metadata adds eight requested bytes per retained element record
on this build. The 12-property fixture's retained plan changed from 11,232 to
11,256 bytes; the deep-nested control changed from 95,199 to 95,463 bytes.
Artifact loading allocation-call counts are unchanged. Initial map reservation
is lazy and bounded, but normal capacity rounding and later growth still apply.
No request maps or output buffers persist between calls.

Coverage preserves duplicate replacement, own-null and missing-operand masking,
dataset overlays, parent fallback, name-strategy collisions, schema compatibility,
exact output/step limits, large-to-small requests and recovery. Existing native
suites retain immutable artifact ownership and concurrent prepared-state coverage.

## Reproducing

Copy only the benchmark fixture additions into a baseline checkout, leaving its
runtime untouched. Build both revisions with matching compilers and release
settings, and alternate fresh-process samples:

```bash
cargo build --release --locked \
    --manifest-path crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark

crates/microsoft-fast-build/target/release/examples/native-shadow-benchmark \
    repeat-components-twelve-props prepared timing 200 /tmp/scope-sizing.html

node packages/fast-build/test/performance/server-renderer.mjs \
    --native-addon /absolute/path/to/microsoft-fast-build.node \
    --workloads componentScope12,componentDataset12 --instances 1000 \
    --samples 5 --warmup 30 --iterations 150
```

Rust distinct-property cases use `repeat-components-five-props`,
`repeat-components-eight-props`, `repeat-components-twelve-props`,
`repeat-components-sixteen-props`, `repeat-components-seventeen-props` and
`repeat-components-thirty-two-props`. Dataset cases use `repeat-dataset-five-props`,
`repeat-dataset-many-props` and `repeat-dataset-thirty-two-props`.
Append `-10000` to the new 12/32-property cases for scaling, and `-markers-v2`
to any case for the second marker format. Use `fresh-json` or a separate `memory`
pass to select the corresponding boundary.

Node provides `componentScope0`, `componentScope4`, `componentScope5`,
`componentScope8`, `componentScope12`, `componentScope16`, `componentScope17`,
`componentScope32`, `componentDataset5`, `componentDataset12` and
`componentDataset32`. Select `--markers-v2` and
`--attribute-name-strategy none` as appropriate. The shared fixture builder
preserves the same template and state shapes across isolated addon comparisons.
See the [native profiling guide](native-profiling.md) for diagnostic boundaries.

### Measured identities

Both Rust benchmark fixture sources had SHA256
`d04c96d8ea5bfb89a58cb347e30be8028c2a80a0c6f85687786751429f66a200`.
Candidate runtime source SHA256 identities were
`25d1efcf3d62682be461b2ce404247acd5446495a519cdce5bb623f1f81df045`
for `src/native.rs` and
`73abcccdbed4281e032ff59eed4168ce7f51f4cb327316551720253aab4e9db8`
for `src/native/plan.rs`.

| Binary | SHA256 |
| --- | --- |
| Main Rust example | `5439e7e14df4df96de547c430b7f104422273cb7acdbe57f7889aa53e3f2b1fe` |
| Candidate Rust example | `aea1ba7065a507e2a19e81b37b24ab72c2f7de0da6f3b172c8cdd79a9390a6f2` |
| Main Node addon | `054bb99a4e1629c2b0e0aa092ddcfb2a37161f1f3dbd6bf972b311b1691ac34d` |
| Candidate Node addon | `2a7a90a6905b9c8ac14594ff85075fe75a976b0fe1f02eab332282d38bde8d0d` |
