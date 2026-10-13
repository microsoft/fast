# Renderer performance baselines

Run all commands from the repository root. These are explicit measurements,
not portable timing assertions or automatically refreshed golden files.

```sh
npm run build -w @microsoft/fast-build
npm run bench:render -w @microsoft/fast-build -- --case=url_sink_siblings --output=/tmp/fast-render.json
npm run bench:render -w @microsoft/fast-build -- --case=url_sink_siblings --check-scaling
cargo bench --manifest-path crates/microsoft-fast-build/Cargo.toml --bench render
```

The native Criterion groups separate rendering with parsed state, state parsing
plus rendering, and locator construction. The Node runner calls the packaged
WASM export in a fresh `--expose-gc` child for each sample, warms it once with up
to 1,000 instances (configurable with `--warmup-count`), forces
GC, and reports median/p95 wall time, CPU time, JSON stringify time, input/output
bytes, throughput, before/after memory, process peak RSS, and parent-sampled RSS
(100 ms on macOS/Linux). Peak RSS includes warmup and verification, not just the
measured call. No in-child timer is used to observe a blocked WASM call.
Sampled RSS is `null` if the child exits before a sample or the platform is not
macOS/Linux. Process peak RSS remains available independently of timer sampling.
Node throughput uses the requested rendered-instance count (not only custom
host count); Criterion reports instances/second for render phases and template
definitions/second for locator construction.

`--case`, `--counts`, and `--samples` narrow a run. Both marker modes always run.
Omit `--case` to run the full matrix; repeat/state-clone workloads can be very
expensive, so begin with the primary URL regression on a development machine.
Definitions use 50/200/1,000 definitions with payloads 1/20; other cases use
1,000/5,000/20,000 instances. State overlays run with 0/200 extra root keys, with
and without host attributes. `corpus.json` is the shared recipe used by native
benchmarks, Rust parity tests, and the Node fixture generator.

Use `--compare=<baseline.json>` to enforce output hash/length parity and report
speedups. `--check-scaling` explicitly checks the URL case's 20k/5k ratio <= 5
and fits `setup + coefficient * count^exponent` from all three sizes, requiring
exponent <= 1.15. Timing checks are opt-in: do not enable them on unpinned PR
runners. At least three samples on otherwise idle, stable hardware are recommended.
Output paths are created exclusively; a run never overwrites an existing baseline.
Reports snapshot the starting git revision, dirty-worktree flag, and WASM
SHA-256. A dirty worktree can include benchmark helpers, reports, or generated
files; it does not necessarily mean the renderer implementation is uncommitted.
Use the artifact hash and source provenance together.

## Local before/after measurements

The checked-in `aarch64-apple-darwin-before.json` and
`aarch64-apple-darwin-after.json` measure the URL sibling regression on an Apple
M3 Pro with Node 22.22.1, three fresh-child samples per size/mode, and a
1,000-instance warmup. These are local macOS measurements, not Linux/reference
machine results or full-corpus performance claims.

| Marker mode | Instances | Before median (ms) | After median (ms) | Speedup |
| --- | ---: | ---: | ---: | ---: |
| v3 | 1,000 | 299.682 | 7.999 | 37.47x |
| v3 | 5,000 | 7,091.213 | 32.416 | 218.75x |
| v3 | 20,000 | 116,906.540 | 122.098 | 957.48x |
| v2 | 1,000 | 287.428 | 8.046 | 35.72x |
| v2 | 5,000 | 7,037.736 | 33.219 | 211.86x |
| v2 | 20,000 | 115,477.367 | 122.144 | 945.42x |

All six before/after output hashes and byte lengths match. The optimized
20k/5k ratios are 3.77 (v3) and 3.68 (v2), with fitted exponents 0.99 and
0.96 respectively. Both pass the 1.15 exponent threshold. The original v3
ratio is 16.49 with exponent 2.02; its
`--check-scaling` run intentionally failed after writing the baseline report.

Process peak RSS at 20,000 instances was 106.06 -> 108.94 MiB (v3) and
99.17 -> 114.52 MiB (v2). This scanner change does not demonstrate a memory
reduction. Peak RSS includes warmup and hash verification; shorter optimized
calls also make 100 ms RSS samples sparse or unavailable.

The before artifact was built from `a38c2f1aea2840ea530de42d055f0a03cefe5872`
before renderer edits, with the new benchmark helpers present. Its WASM SHA-256 is
`c749f46306b561bb55e45700cf19f7ed3db8ad67d01cd8e9a3b7198943c4ca51`.
The after artifact was built from `3e9117770a8da29c369d3d31a04e37da25fa08fb`;
its WASM SHA-256 is
`c128e5d88ff457dedc0549438ec9e2d11450e0a89e997899b003898e587063bc`.
Both reports retain their starting provenance even if the worktree changes
during measurement.

To reproduce an optimized comparison after building the package:

```sh
node packages/fast-build/test/performance/render-entry.mjs --case=url_sink_siblings --compare=crates/microsoft-fast-build/benchmark-baselines/aarch64-apple-darwin-before.json --output=/tmp/fast-render-after.json --check-scaling
```

## Output compatibility and remaining work

Correctness runs in normal Rust/Node tests at 0/1/2/1,000 instances in both marker
modes. The shared `benches/fixtures/expected-baseline.json` records pre-optimization
SHA-256, byte length, host count, binding/repeat marker counts, and attribute marker
counts. It also verifies normal/legacy-stream byte parity. Regeneration is explicit:

```sh
node packages/fast-build/test/performance/render-entry.mjs --golden=/tmp/fast-golden.json
```

Review changes against the checked-in golden; do not replace it just to make a
regression pass. Profiles and output hashes must be compared with the same
toolchain and fixture recipe. The runner cannot isolate internal WASM phases,
WASM memory pages (not exported), native allocation counts, or file writes; those
require separate profiling. The schema does not invent measurements for them.

This milestone addresses directive discovery only. Compiled templates, buffered
recursive writes, state overlays, prepared WASM handles, and genuinely incremental
sessions remain separate work. `stream: true` still materializes all chunks.
