# Native composite path prefixes

Composite attributes often bind several sibling fields such as
`theme.palette.primary` and `theme.palette.background`. Validated native plans
prepare their common-prefix length. Requests resolve that prefix once, then borrow
it for suffix lookups alongside the existing four-slot operand cache.

Longer overlapping repeat aliases disable reuse: an alias can override one full
path without overriding its siblings. Prefixes longer than 255 segments also use
independent resolution. Neither case changes accepted artifacts, output, limits
or the public API.

## Measurement

Baseline: merged main at `33a157210925e9b2a70747ed408f95d2b759caa3`, including
object-root lookup fusion. Environment: Apple M3 Pro, macOS ARM64, Rust 1.93.1,
Node 22.22.1. Both revisions used identical fixtures and the default Cargo release
profile, without CPU-specific or profile overrides. Builds and tests finished
before serial measurements on a shared machine.

Rust covered 28 workloads at fresh-JSON and prepared-state boundaries in five
alternating process rounds. Each process warmed 20 requests; timed loops targeted
200 ms, bounded to 20-200,000 iterations. Values are medians of process-level render
medians, excluding output verification and destruction.

Node covered 19 workload/size/marker configurations in five alternating process
rounds. Buffer and string phases each warmed 30 requests, with 40-1,000 timed
iterations depending on workload and size. Values are medians of process-level
loop averages. Both include JSON parsing and owned Buffer delivery; string samples
also include UTF-8 decoding. Compilation, loading and first rendering are separate.

All comparisons checked exact output and artifact/state identities between
revisions. Global, row-scoped and alias-fallback style fixtures also produced
identical output across Rust and Node. Allocator diagnostics ran separately.
CPU measurements supported the targeted wall-time gains; Rust loop CPU includes
verification and destruction and is not an identical timing boundary.

## Results

The style fixture repeats 1,000 elements with one, four or five sibling bindings.
The row-scoped variant puts a palette on every row, increasing fresh-state parsing
cost. Times below are milliseconds per render; reductions are relative to main.

| Workload | Boundary | Main | Prefix reuse | Reduction |
| --- | --- | ---: | ---: | ---: |
| Four global bindings | Rust fresh JSON | 0.4324 | 0.3142 | 27.3% |
| Four global bindings | Rust prepared | 0.4273 | 0.3068 | 28.2% |
| Five global bindings | Rust fresh JSON | 0.5582 | 0.3648 | 34.6% |
| Five global bindings | Rust prepared | 0.5432 | 0.3481 | 35.9% |
| Four global bindings, markers v2 | Rust fresh JSON | 0.5096 | 0.3964 | 22.2% |
| Four global bindings, markers v2 | Rust prepared | 0.4932 | 0.3789 | 23.2% |
| Four row-scoped bindings | Rust fresh JSON | 0.9484 | 0.8848 | 6.7% |
| Four row-scoped bindings | Rust prepared | 0.3280 | 0.2645 | 19.3% |
| Four global bindings | Node JSON to Buffer | 0.4410 | 0.3356 | 23.9% |
| Four global bindings | Node JSON to string | 0.4708 | 0.3639 | 22.7% |
| Four global bindings, markers v2 | Node JSON to Buffer | 0.5260 | 0.4186 | 20.4% |
| Four global bindings, markers v2 | Node JSON to string | 0.5711 | 0.4636 | 18.8% |
| Four global bindings, 10,000 rows | Node JSON to Buffer | 4.2922 | 3.2359 | 24.6% |
| Four global bindings, 10,000 rows | Node JSON to string | 4.5752 | 3.4786 | 24.0% |

Row-scoped Node improvements were smaller: 3.4% for Buffer and 1.6% for string
delivery, or 2.2% and 3.8% with markers v2. This is a lookup optimization, not a
general rendering, parsing or throughput guarantee. Results do not establish
performance on other platforms.

### Controls and fallback cost

Other Rust five-round controls ranged from 2.2% faster to 1.9% slower. Node
optional-binding and component controls ranged from 3.4% faster to 3.3% slower.
Ten alternating confirmation rounds measured single-binding Rust changes of
0.6% slower for fresh JSON and 0.1% faster for prepared state. Absent optional-root
Rust requests were 2.2% slower fresh and 0.4% slower prepared; Node changes were
0.8% slower for Buffer and 0.3% faster for string delivery.
The apparent 3.3% Node optional-marker string slowdown did not persist:
confirmation measured 0.1% slower.

The overlapping-alias fixture intentionally overrides only the first style path,
forcing independent resolution. The guard has a small persistent cost. Ten-round
confirmation measured:

| Alias fallback boundary | Main | Candidate | Increase |
| --- | ---: | ---: | ---: |
| Rust fresh JSON | 0.4223 | 0.4286 | 1.5% |
| Rust prepared | 0.3963 | 0.4035 | 1.8% |
| Node JSON to Buffer | 0.4315 | 0.4387 | 1.7% |
| Node JSON to string | 0.4594 | 0.4691 | 2.1% |
| Node JSON to Buffer, markers v2 | 0.5195 | 0.5342 | 2.8% |
| Node JSON to string, markers v2 | 0.5615 | 0.5723 | 1.9% |

This tradeoff preserves segmented-alias precedence without heap caches or
unbounded per-attribute metadata.

### Memory and contracts

Request allocation diagnostics matched for all 56 Rust workload/boundary pairs,
with zero retained requested bytes after dropping each output. Prepared-state
diagnostics also matched. Artifact loading allocation calls, requested bytes and
retained bytes matched; one transient peak differed by 204 bytes, below 0.001%.
Six additional loader processes per revision measured the same peak.

The four-binding prepared fixture retained two request allocation calls,
14 reallocations, 510,460 requested allocation bytes and a 330,247-byte requested
heap peak. Its prepared state retained 58,825 requested bytes and its artifact
retained 3,661 requested bytes in both revisions. These are allocator-requested
heap metrics, not RSS or copied-byte measurements.

Regressions cover short and longer aliases, overlapping outer aliases inside an
unrelated inner loop, synthetic owned array lengths, the fifth operand, paths
longer than the prefix metadata range, late missing/null suppression, exact byte
limits, escaping, prepared-state parity and recovery. Existing native tests retain
validation, parent masking, step limits and independent output-ownership coverage.

## Reproducing the workloads

Copy only the benchmark fixture additions to the baseline, leaving its runtime
unchanged. Build separate source checkouts with the same compiler and settings:

```bash
cargo build --release --locked \
    --manifest-path crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark

crates/microsoft-fast-build/target/release/examples/native-shadow-benchmark \
    composite-styles-1000 prepared timing 1000 /tmp/composite-prefix.html

node packages/fast-build/test/performance/server-renderer.mjs \
    --native-addon /absolute/path/to/microsoft-fast-build.node \
    --workloads compositeStyles --instances 1000 \
    --samples 5 --warmup 30 --iterations 400
```

Rust also provides `composite-styles-one-1000`, `composite-styles-five-1000`,
`composite-styles-row-1000` and `composite-styles-alias-fallback-1000`.
Use `fresh-json` for parsing plus execution, `memory` for separate diagnostics
and the `-markers-v2` case suffix for marker comparisons.
The alias-fallback fixture rewrites the compiled repeat alias to
`["theme","palette","primary"]` and uses string rows; its binding paths stay
unchanged. The Node scoped/fallback measurements use the same template and state
shapes. Alternate fresh processes rather than comparing two consecutive complete
benchmark batches. See the [native profiling guide](native-profiling.md).

### Measured binary identities

SHA256 identities distinguish the release executables and Node addons used above.
Both benchmark fixture sources had SHA256
`0d341b9f41c131db8e13f2dcd329194eb0c71e7e3064a3629ab1dec011efcc9d`.

| Binary | SHA256 |
| --- | --- |
| Main Rust example | `cd8a19c4287b99403d63c1b464d35cb2a1724ab3443a1a9f78e08face1bbb615` |
| Candidate Rust example | `f2d432c79f600244e0198155171cf7463732e6ad265648efc983a2de3c4ee39d` |
| Main Node addon | `07af2d7b537da4d061693238cf000a4d3601464638e1e350e50852ea8ad5c8b8` |
| Candidate Node addon | `33ebfd91cbde1610162064f9f6739789f302c0b6b0340c3eb103c23c30460852` |
