# Native object-root lookup

Native path resolution probes an object root's first key once, using that result
both to resolve the value and to decide whether parent fallback is allowed.
Previously, missing paths also checked root-key presence with a second lookup.
Present keys still mask fallback when their descendants are missing or null.

## Measurement

Baseline: merged main at `4c2d5007958161c950d8562596f43b5761c32bc7`, including
composite-attribute operand reuse.
Environment: Apple M3 Pro, macOS ARM64, Rust 1.93.1, Node 22.22.1.
Both revisions used the default Cargo release profile and identical fixture code.
Builds and tests completed before serial measurements on a shared machine.

The Rust comparison covered 26 workloads and both fresh-JSON and prepared-state
rendering. Five alternating process rounds used 20 warmups and approximately
200 ms of render work per timed loop. Reported values are medians of process-level
render medians. Rust timings exclude output verification and destruction.

Node covered 15 workload/size/marker configurations in five alternating process
rounds. Each Buffer and string phase had 30 warmups, with 40–1,000 iterations
depending on workload and size. Reported values are medians of process-level loop
averages. Both phases include JSON parsing and owned Buffer delivery; the string
phase also includes UTF-8 decoding.

Every comparison checked output bytes, serialized input identity, and artifact
identity. Rust allocator measurements ran separately from timings. The four
1,000-row optional-binding variants also matched output bytes across Rust and Node.

## Results

The optional-binding fixture repeats anchors with six paths under `optional`:
URL, composite title, hidden flag, description, detail, and caption.
Variants omit `optional`, provide an empty object, provide null, or populate every
field. Times below are milliseconds per render; reductions are relative to main.

| Workload | Boundary | Main | Single probe | Reduction |
| --- | --- | ---: | ---: | ---: |
| 1,000 rows, absent root | Rust fresh JSON | 0.2395 | 0.1928 | 19.5% |
| 1,000 rows, absent root | Rust prepared | 0.2290 | 0.1815 | 20.7% |
| 1,000 rows, missing descendants | Rust prepared | 0.2541 | 0.1958 | 22.9% |
| 1,000 rows, null root | Rust prepared | 0.2539 | 0.1965 | 22.6% |
| 1,000 rows, absent root | Node JSON to Buffer | 0.2613 | 0.2113 | 19.2% |
| 1,000 rows, absent root | Node JSON to string | 0.2704 | 0.2193 | 18.9% |
| 10,000 rows, absent root | Node JSON to Buffer | 2.5202 | 2.0172 | 20.0% |
| 10,000 rows, absent root | Node JSON to string | 2.7198 | 2.2157 | 18.5% |

Missing-descendant and null-root Node variants improved approximately 19–23% for
Buffer delivery and 20% for string delivery. Fully populated optional values
showed smaller reductions: 2.6–3.6% in Rust and 2.1–4.8% in Node. With markers v2,
the absent-root 1,000-row Node case improved 11.6% for Buffer delivery and 9.0% for
string delivery.

### Controls

The original 22 Rust workloads ranged from 2.8% faster to 3.6% slower in the
five-round matrix. The largest initial slowdown was the prepared empty-shadow
case. A ten-round alternating confirmation measured:

| Control | Fresh JSON change | Prepared change |
| --- | ---: | ---: |
| Empty shadows | 0.2% faster | 0.1% slower |
| Wide siblings | 0.3% slower | 0.4% faster |
| 10,000 components | 0.6% faster | 1.3% faster |

Existing Node component/style controls ranged from 5.3% faster to 0.6% slower.
These are supporting control measurements, not a general render-speed guarantee.
The main benefit is reduced lookup work for sparse optional bindings.

### Memory and contracts

Request allocation diagnostics were identical for all 52 Rust workload/boundary
pairs, with zero retained requested bytes after each output was dropped.
For the prepared absent-root fixture, both revisions used two allocation calls,
14 reallocations, 473,460 requested allocation bytes, and a 293,247-byte requested
heap peak. These metrics describe allocator-requested heap, not RSS.

Regression coverage preserves own-null and missing-descendant masking, parent
fallback, inline override masking, alias precedence, array indexing, and synthetic
array lengths. The existing native suites continue to cover validation, escaping,
budgets, independent output ownership, and error recovery.

## Reproducing the workloads

Apply the fixture additions to the baseline without changing its runtime, then
build both revisions with the same compiler and release settings:

```bash
cargo build --release --locked \
    --manifest-path crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark

crates/microsoft-fast-build/target/release/examples/native-shadow-benchmark \
    optional-bindings-missing-1000 prepared timing 1000 /tmp/optional-bindings.html

node packages/fast-build/test/performance/server-renderer.mjs \
    --native-addon /absolute/path/to/microsoft-fast-build.node \
    --workloads optionalBindings --instances 1000 \
    --samples 5 --warmup 30 --iterations 1000
```

Rust also provides `optional-bindings-nested-1000`, `optional-bindings-null-1000`,
and `optional-bindings-present-1000`; the `-markers-v2` suffix selects the second
marker format. See the [native profiling guide](native-profiling.md) for diagnostic
boundaries and allocator interpretation.
