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

## Profiling the remaining workloads

The `aarch64-apple-darwin-*-profile.json` reports were captured after the scanner
fix at `a58548a5cec9f4508fd46693f9ec63443e07b0b6`. Five reports contain 36
fresh-child packaged-WASM measurements in both marker modes; the native report
summarizes six symbolized CPU captures and separate Criterion quick estimates.
No renderer optimization was made during this investigation.

The WASM runs use three samples and a 250-instance warmup. Repeat and plain
controls use 250/1,000 instances, state cases use 1,000/5,000 hosts with 0/200
extra root keys, and definitions use 50/200/1,000 templates with payloads 1/20.
These bounded sizes avoid multiplying an already expensive state-cloning path
into an unhelpful full-matrix run. They do not establish 20k acceptance targets.

| Packaged-WASM workload | Instances | Extra root keys | v3 median (ms) | v2 median (ms) |
| --- | ---: | ---: | ---: | ---: |
| Repeated custom elements | 1,000 | 0 | 422.71 | 431.95 |
| Bound plain elements | 1,000 | 0 | 15.06 | 14.81 |
| Attribute overlays | 1,000 | 0 | 4.30 | 4.37 |
| Attribute overlays | 1,000 | 200 | 35.25 | 35.27 |
| No attribute overlays | 1,000 | 200 | 3.70 | 3.84 |
| Many definitions, payload 20 | 1,000 | 0 | 43.68 | 46.72 |

### Findings and next optimization

Child-state construction is the strongest measured next target. In native v3
profiles, `build_custom_element_child_root` occurs in 1,075/2,001 main-thread
samples (53.72%) for repeated custom elements and 1,205/2,049 (58.81%) for
attribute overlays with 200 root keys. Its descendant stacks include
`RawTable::clone`, `Vec::clone`, `String::clone`, and allocator/copy routines.
Separate destruction stacks and frequent free routines show additional cleanup
work outside those inclusive counts.

The repeat fixture's root contains the entire `items` array. Every attributed
child clones that root before overlaying host attributes; increasing the
number of items therefore increases both the number and size of those copies.
Packaged-WASM repeat times rise from 53.55 to 422.71 ms (v3) and 45.86 to
431.95 ms (v2) for a 4x instance increase. This is evidence for the remaining
state-copying hazard, not a fitted 1k/5k/20k scaling claim. Removing attributes
is not a valid optimization because it would change state semantics.

The overlay controls reinforce this finding: adding 200 unused root keys
increases v3 time from 4.30 to 35.25 ms at 1,000 attributed hosts, while the
no-overlay case changes only from 3.40 to 3.70 ms. Output hashes within each
overlay/no-overlay workload are unchanged by those extra unused keys.
Borrowed child-state overlays should be the next focused optimization, with
state precedence/inheritance parity preserved.

The many-definition case has a different profile. Native locator construction
takes about 0.243 ms for 1,000 definitions with payload 20, versus about
34.48 ms for rendering with an already prepared locator. Code-sample
preprocessing appears in 1,257/2,148 (58.52%) locator-phase samples, but that
phase is small here; its percentage must not be interpreted as 58.52% of
end-to-end rendering. The render profile instead contains string searching,
attribute parsing/binding resolution, escaping, and copying. Compiled
templates, parse-once attributes, and buffered sinks remain relevant follow-ons.

Native quick estimates are independent, low-sample diagnostic runs; do not
subtract them to infer isolated parsing costs. Native sampling percentages
are inclusive stack frequencies, not exclusive CPU time, allocation counts,
or WASM phase percentages. Zero observed frames do not prove zero work,
especially with inlining. Native allocator behavior does not establish WASM
memory behavior. Raw captures remain local; the compact report retains their
hashes, selected symbols/counts, compiler/build flags, and binary provenance.

### Reproducing the investigation

Use new output paths; these commands do not refresh the checked-in reports:

```sh
npm run bench:render -w @microsoft/fast-build -- --case=repeat_custom_elements --counts=250,1000 --samples=3 --warmup-count=250 --output=/tmp/fast-repeat-profile.json
npm run bench:render -w @microsoft/fast-build -- --case=plain_bound_elements --counts=250,1000 --samples=3 --warmup-count=250 --output=/tmp/fast-plain-profile.json
npm run bench:render -w @microsoft/fast-build -- --case=large_state_overlay --counts=1000,5000 --samples=3 --warmup-count=250 --output=/tmp/fast-overlay-profile.json
npm run bench:render -w @microsoft/fast-build -- --case=large_state_no_overlay --counts=1000,5000 --samples=3 --warmup-count=250 --output=/tmp/fast-no-overlay-profile.json
npm run bench:render -w @microsoft/fast-build -- --case=many_definitions --samples=3 --warmup-count=250 --output=/tmp/fast-definitions-profile.json
CARGO_PROFILE_BENCH_DEBUG=true RUSTFLAGS="-C force-frame-pointers=yes" cargo bench --manifest-path crates/microsoft-fast-build/Cargo.toml --bench render -- '^repeat_custom_elements/v3/render/1000/payload1/root0$' --profile-time 8 --noplot
```

For a native CPU capture, run the final command in one terminal. Once Criterion
prints `Profiling for`, attach macOS `sample <benchmark-pid> 3 1 -file <new-path>`
from another terminal. Sample the benchmark executable, not Cargo. Building
first with the same environment and `--no-run --message-format=json` reveals
its path in the `compiler-artifact` record. A direct invocation of that binary
must include `--bench`, otherwise Criterion performs a correctness run rather
than a profiling loop. The profiling environment is opt-in and does not change
production WASM build settings or add dependencies.

The six filters used for CPU captures were:

```text
^repeat_custom_elements/v3/render/1000/payload1/root0$
^plain_bound_elements/v3/render/1000/payload1/root0$
^large_state_overlay/v3/render/1000/payload1/root200$
^large_state_no_overlay/v3/render/1000/payload1/root200$
^many_definitions/v3/locator/1000/payload20/root0$
^many_definitions/v3/render/1000/payload20/root0$
```

Replace `--profile-time 8` with `--quick` for diagnostic timing estimates.
The compact native report sums counts across call-graph entries for each
named non-recursive function; recursive frame totals must not be summed as if
they represented distinct samples. Platform-specific Linux profiling remains
outstanding; native allocation baselines are described below.

## Native allocation baselines

`aarch64-apple-darwin-allocations.json` records 30 isolated release-build samples
using `allocation-counter` 0.8.1. Each request starts a fresh native process;
the feature-gated example and its integration test are the only executables
that use this development allocator. No library allocator, WASM export,
production build setting, or rendering behavior changes.

Run from the repository root, writing only to a new output path:

```sh
node crates/microsoft-fast-build/benches/profile-allocations.mjs --output=/tmp/fast-allocations.json
cargo run --manifest-path crates/microsoft-fast-build/Cargo.toml --release --features allocation-profiling --example profile-allocations -- --case=large_state_overlay --count=1000 --root-keys=200 --mode=v2 --phase=render --output=/tmp/fast-overlay-allocations.json
cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml --features allocation-profiling --test allocation-profiling
node --test crates/microsoft-fast-build/benches/profile-allocations.test.mjs
```

Single-request options are `--case`, `--count`, `--payload`, `--root-keys`,
`--mode=v3|v2`, `--phase=render|parse_state_and_render|locator`, and `--output`,
all in `--option=value` form. Defaults are repeat/250/payload 1/root 0/v3/render.
Counts/payloads must be positive; only definition workloads accept payload
changes, and only large-state workloads accept root-key changes. Unknown,
duplicate, or invalid options fail explicitly. Reports refuse overwrites,
including a second exclusive-create check at write time.

Runner matrix/provenance/output-safety tests also run through
`npm run test:node -w @microsoft/fast-build`; they do not invoke Cargo.
The feature-enabled Rust integration test above exercises the actual counter.

The matrix covers repeat/plain controls at 100/250/1,000 instances, overlays
with/without attributes and 0/200 extra root keys at 1,000 hosts, state parsing
plus rendering at 1,000 repeat/plain items, and all three phases for 1,000
definitions with payload 20. Every case runs in both marker modes. One sample
per request is recorded; these counters are not timing medians.

### Measurement boundaries and interpretation

Fixture generation, pre-parsed state, and prepared locators are outside the
measurement. `render` counts only rendering; `parse_state_and_render` also
counts parsing the state JSON; `locator` counts cloning/preprocessing templates
and building the new locator, not template-JSON parsing or rendering.
Locator output is validated by rendering afterward, outside the counter.
Output hashes and byte lengths are checked against ordinary native rendering
in default tests, without asserting platform-specific allocation thresholds.

The returned HTML string or locator stays alive at the counter boundary:
`retainedBytes` includes its capacity, not just logical HTML length, and does
not indicate a leak. `peakLiveBytes` excludes inputs allocated before the
phase; it is not total process heap, RSS, or WASM memory pages. Byte and block
peaks are independent maxima. Cumulative `totalBytes` and `totalBlocks` count
allocation events, including replacement allocations during reallocation,
not the number or size of currently live objects. This profiler captures the
current thread only; future threaded rendering would require another strategy.
The counter uses allocate/copy/free reallocation rather than in-place system
reallocation: event totals and temporary old/new-buffer overlap reflect that
instrumentation strategy, not necessarily the production allocator's peaks.
It does not collect allocation-site stacks or measure bytes copied/allocator
overhead, and should not be used for uninstrumented speed comparisons.

Provenance includes starting commit/dirty status, release executable SHA-256,
Cargo.lock SHA-256, compiler, target, and allocator identification. The matrix
rejects changed provenance or duplicate samples. The checked-in captures were
made with the new harness uncommitted against renderer source
`8b9c524f3a6a7544919588e708c4ad0c98a8197b`; their binary/lock hashes identify
the measured development artifact. Neither captured timing nor allocation
data is silently regenerated by tests.

### Findings

| Native v3 render workload | Instances | Extra root keys | Allocation events | Cumulative MiB | Peak newly-live MiB |
| --- | ---: | ---: | ---: | ---: | ---: |
| Repeated custom elements | 250 | 0 | 1,016,297 | 83.61 | 1.11 |
| Repeated custom elements | 1,000 | 0 | 15,315,047 | 1,265.75 | 4.45 |
| Bound plain elements | 1,000 | 0 | 147,047 | 11.02 | 2.73 |
| Attribute overlays | 1,000 | 0 | 62,913 | 3.02 | 0.48 |
| Attribute overlays | 1,000 | 200 | 1,462,913 | 122.14 | 0.48 |
| No attribute overlays | 1,000 | 200 | 41,012 | 1.54 | 0.28 |
| Definitions, payload 20 | 1,000 | 0 | 893,012 | 63.03 | 4.21 |

The 4x repeat increase produces about 15x more allocation events/bytes, while
plain controls remain approximately proportional to instance count. Adding
200 unused root keys multiplies attributed-host allocation volume by about
40x, yet leaves the no-attribute control unchanged. Within each state control,
unused keys do not change output hashes. Both marker modes show the same
state-copying pattern; native locator counters are identical across modes
because marker rendering is outside that phase.

This strengthens the case for borrowed child-state overlays as the next
runtime optimization. It is a baseline, not the proposed 50% allocation
reduction or any 20k/stable-host/Linux/WASM acceptance claim.

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

Rust parity tests also render every remaining-workload WASM report record and
verify its output hash, bytes, and marker counts, including the larger
definition payloads and state-overlay controls. They do not assert timing.

The completed optimization addresses directive discovery only. Compiled templates, buffered
recursive writes, state overlays, prepared WASM handles, and genuinely incremental
sessions remain separate work. `stream: true` still materializes all chunks.
