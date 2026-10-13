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
SHA-256; dirty reports identify an uncommitted implementation via its artifact hash.

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
