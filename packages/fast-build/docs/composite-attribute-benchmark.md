# Composite attribute operand reuse

Composite attributes resolve every binding before writing output so that a late
missing or null value suppresses the entire attribute. Native rendering keeps the
first four resolved operands on the stack and reuses them during output. Additional
operands retain the existing second lookup. This particularly benefits nested paths
such as `theme.palette.primary`.

## Measurement

Baseline: merged `main` at `0bbb7f04048f70926aa3cf978265fc634c50a539`.
Environment: Apple M3 Pro, macOS ARM64, Rust 1.93.1, Node 22.22.1.
Both versions used Cargo's default release profile and identical benchmark fixtures.
Measurements ran serially, after builds and tests, on a shared machine.

The Rust comparison covered 22 workloads with five alternating process rounds and
20 warmups per process. Each timed loop targeted approximately 200 ms. Results are
medians of process-level render medians. Fresh JSON includes state parsing; prepared
state measures execution with previously validated input. Both return owned strings.
Output verification and destruction are outside individual Rust render timings.

Node measurements used five alternating process rounds, 30 warmups for each output
boundary, and 40–100,000 iterations depending on row count. Results are medians of
process-level loop averages. Each call parses the same serialized state buffer and
returns an owned Buffer; the string boundary also includes UTF-8 decoding.

Every comparison checked exact output bytes and artifact identity. The four-binding
1,000-row Rust and Node fixtures also produced identical bytes: 150,091 without
markers v2 and 255,924 with markers v2. Rust allocator diagnostics ran separately
from latency measurements.

## Results

Each composite-style row renders an `<i>` with one, four, or five nested bindings
in its inline style. Times are milliseconds per render; reduction is relative to main.

| Workload | Boundary | Main | Operand reuse | Reduction |
| --- | --- | ---: | ---: | ---: |
| 1,000 rows, one binding | Rust fresh JSON | 0.272 | 0.214 | 21.6% |
| 1,000 rows, one binding | Rust prepared | 0.259 | 0.201 | 22.5% |
| 1,000 rows, four bindings | Rust fresh JSON | 0.695 | 0.433 | 37.7% |
| 1,000 rows, four bindings | Rust prepared | 0.692 | 0.419 | 39.4% |
| 1,000 rows, five bindings | Rust fresh JSON | 0.833 | 0.569 | 31.6% |
| 1,000 rows, five bindings | Rust prepared | 0.816 | 0.548 | 32.9% |
| 1,000 rows, four bindings, markers v2 | Rust fresh JSON | 0.779 | 0.513 | 34.2% |
| 1,000 rows, four bindings, markers v2 | Rust prepared | 0.764 | 0.501 | 34.4% |
| 1,000 rows, four bindings | Node JSON to Buffer | 0.696 | 0.442 | 36.6% |
| 1,000 rows, four bindings | Node JSON to string | 0.721 | 0.472 | 34.5% |
| 10,000 rows, four bindings | Node JSON to Buffer | 6.799 | 4.336 | 36.2% |
| 10,000 rows, four bindings | Node JSON to string | 7.212 | 4.533 | 37.1% |

At 1, 10, and 100 rows, Node Buffer reductions were 10.9%, 25.9%, and 35.3%.
For 1,000 rows with markers v2, Node Buffer and string reductions were 31.9% and
28.8%. The fifth-binding Rust case demonstrates the bounded fallback.

### Controls and memory

Gains concentrate on composite attributes. The original 18 Rust workloads ranged
from 4.8% faster to 2.4% slower. A ten-round confirmation measured the mostly-static
fresh-JSON case 1.9% slower and its prepared case 0.4% faster; process samples
overlapped. Plain-repeat controls were 0.3–0.4% slower in that confirmation.
The 10,000-component Node control was 1.7% slower for Buffer delivery and 0.8%
faster for string delivery. These small differences should accompany, rather than
be hidden by, the composite-style gains.

Request allocation diagnostics were identical across all 44 Rust workload/boundary
pairs, with zero retained requested bytes after each request. The prepared
four-binding, 1,000-row case used two allocation calls, 14 reallocations, 510,460
requested allocation bytes, and a 330,247-byte requested heap peak in both versions.
Artifact-load and prepared-state allocation diagnostics were also unchanged.
These are allocator-requested heap measurements, not RSS or copied-byte counts.
Operand storage is four request-local stack slots.

Release-profile alternatives were screened first: Thin LTO, Thin LTO with one
codegen unit, one codegen unit alone, optimization level 2 with and without one
codegen unit, and fat LTO. None provided a broadly useful improvement; some control
regressions reached approximately 8.7%. Bounded operand reuse was selected because
it removes measured repeated path lookups while preserving attribute suppression
and output-limit ordering.

## Reproducing the workloads

Build each revision with the same compiler and release settings, and apply the
benchmark fixture additions to the baseline without changing its runtime:

```bash
cargo build --release --locked \
    --manifest-path crates/microsoft-fast-build/Cargo.toml \
    --example native-shadow-benchmark

crates/microsoft-fast-build/target/release/examples/native-shadow-benchmark \
    composite-styles-1000 prepared timing 400 /tmp/composite-styles.html

node packages/fast-build/test/performance/server-renderer.mjs \
    --native-addon /absolute/path/to/microsoft-fast-build.node \
    --workloads compositeStyles --instances 1000 \
    --samples 5 --warmup 30 --iterations 400
```

The Rust workload selectors also include `composite-styles-one-1000`,
`composite-styles-five-1000`, and `composite-styles-1000-markers-v2`.
Use the existing [native profiling guide](native-profiling.md) for output boundaries,
allocator interpretation, and profiling setup.
