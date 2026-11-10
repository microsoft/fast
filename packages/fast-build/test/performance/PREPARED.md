# Prepared renderer lifecycle measurements

Build the package/WASM first using the exact compiler intended for deployment.
From the repository root, run:

```sh
npm run bench:prepared -w @microsoft/fast-build -- --output=prepared-results.json
```

The script requires the multi-entry `compileArtifacts` / `createPreparedRuntime`
API. It does not rebuild WASM or install dependencies. Use a new output filename;
existing files are never overwritten. Without `--output`, JSON goes to stdout
and progress goes to stderr.

## Workloads and controls

Defaults bound the workload to eight entries, 200 repeated component instances
per repeated entry, and 64 distinct definitions per low-reuse entry (512 total).
Repeated components use the existing shared Rust/JS benchmark corpus. Low-reuse
entries use disjoint definitions, each rendered once. Entry HTML identities differ
so the shared-cache case does not accidentally reuse a single entry piece.

Options: `--samples=5`, `--warmup=3`, `--instances=200`, `--definitions=64`
(per entry), `--entries=8`, `--cache-bytes=32768`, `--startup-samples=3`.
Warmup and cache bytes may be zero; other counts must be positive integers.
Each warm lane always primes its retained cache once, in addition to the stated
warmup count. Increase sample/workload sizes explicitly for longer runs.

Before any timing lanes, every entry must match legacy HTML and **exact stream
chunks**, separately in v2 and v3 marker modes. These modes are not expected to
produce identical HTML to each other. Failures abort without a performance report.
There are no timing pass/fail thresholds.

## Measurement boundaries

- **Process cold:** isolated fresh Node children. Child timing measures importing
  `prepared.js`, including its synchronous WASM initialization. A following WASM
  `require` is cached and is reported as such. Parent timing includes process
  launch through exit, the benchmark's own imports, and reporting overhead.
  Neither is described as pure engine startup or HTTP/server startup.
- **Preparation:** repeated synchronous compilation after untimed parity,
  measuring CPU and elapsed time without filesystem persistence. Artifact and
  manifest bytes/counts are reported independently. Compiler preparation is not
  included in warm render timings.
- **Persistence:** one separately timed async filesystem write pass. No `fsync`;
  this does not establish durable storage latency.
- **Cold generated-artifact load + first render:** initialized process/WASM,
  empty runtime cache, asynchronous manifest read/parse, full manifest validation
  and runtime creation, asynchronous artifact loading, and the first v3 HTML
  render all inside the timer. OS page caches are **not forcibly flushed**;
  artifacts were just written and may be cached. This is not process cold.
- **Warm retained rendering:** preparation, full-manifest runtime creation
  (reported separately for each mode), and cache priming are outside render
  timing. Both marker modes and HTML/chunk APIs are measured. Legacy one-shot
  WASM rendering is a separate comparison lane, not cold startup. Its template
  map is pre-serialized; state serialization happens per request in both APIs.
  Legacy stream results are JSON text while prepared stream results are decoded
  arrays: timings preserve those public API boundaries rather than pretending
  they return the same representation.
- **Shared retention:** sequential full-entry sweeps and first-entry revisits
  under the runtime's default 32 MiB estimated Rust-piece budget, zero budget,
  and configurable bounded budget. Loads/bytes and retained estimates are
  recorded. Zero budget must demonstrably reload artifacts on revisits.
  Other budgets may not evict: a revisit with no loads is a hit, not a reload
  measurement. The distinct-cache comparison constructs one runtime per entry,
  each validating the same full deployment manifest; its process deltas are not
  timing comparisons.

State is one unmodified object per workload, serialized/captured anew by each
request. Outputs are consumed but not retained between measured requests.
Requests are sequential: this harness does not measure concurrent active leases,
state mutation races, manifest activation, shadow fragments, or DSD policies.
Handles are disposed and the uniquely named `.prepared-bench-*` directory under
the current working directory is removed even on failure. No system temporary
directory is used. Interruption with SIGKILL can leave that owned directory behind.

## JSON evidence and limitations

`schemaVersion: 1` includes `configuration`, machine/Node/git/WASM/compiler
`provenance`, explicit `boundaries`, per-entry `parity` hashes,
`processColdInitialization`, and workload `records`. Records contain
`preparation`, artifact sizes, `filesystemPersistence`, `diskLoadAndFirstRender`,
`warmedRendering`, and `retention`. Timing summaries contain medians and all raw
samples. Even sample counts average the middle pair.

Memory records distinguish runtime-estimated retained Rust-piece bytes from
process RSS/heap/external/ArrayBuffer snapshots and their deltas. WASM linear
buffer size is `null` unless publicly exposed by the bindings; it is not inferred
from external memory. Freed allocations may remain in the linear buffer or
allocator. There is no forced GC, allocation tracing, or active-allocation peak
measurement; end snapshots are **not peaks**. Process deltas can be negative and
include allocator/JIT/GC effects and retained benchmark inputs.

Lanes run in a disclosed fixed order. They are descriptive medians, not claims of
statistical significance or a current speedup. Capture the build command/profile,
power/load conditions, and this JSON alongside any reported result. A dirty
worktree is identified but not reconstructed by its commit hash; preserve the
corresponding diff when saving prerelease evidence.

## Local development observation

A 2026-11-10 run on Apple M3 Pro / Node 22.22.1 used 11 samples, five warmup
iterations, eight entries, 1,000 repeated instances or 128 distinct definitions
per entry, and seven startup samples. This measured the uncommitted integration
worktree based on `fe39569ad`, **not that commit alone**. Compiler fingerprint:
`75233e356ca8882ae2ab717d28bbdecba0e806d448d2f8b687af4c2dc3c18401`.
WASM was built with `npm run build -w @microsoft/fast-build` (release/wasm-opt).
All 64 HTML/exact-chunk parity comparisons passed.

| Median elapsed time | Repeated components | Distinct definitions |
|---|---:|---:|
| Prepare all eight entries, no persistence | 0.137 ms | 11.809 ms |
| Cold disk load + first entry render | 15.623 ms | 7.536 ms |
| Warm prepared entry, v3 HTML | 17.313 ms | 0.282 ms |
| Legacy one-shot entry, v3 HTML | 16.618 ms | 0.957 ms |

These are fixed-order descriptive samples, not statistically established speedups.
Preparation covers the complete deployment, while render rows cover one entry.
The low-reuse warm case benefits from retaining definitions rather than rebuilding
the whole registry per call; the repeat-heavy case does **not** show a latency win.
Disk loading and full-manifest validation are substantial cold costs.

With the default budget, the repeated workload retained an estimated 17,538 Rust
bytes in one shared runtime versus 68,736 across eight separate caches. Distinct
definitions offered no sharing savings: both retained 1,565,904 estimated bytes.
A 256-KiB shared budget retained 261,332 bytes and reloaded all 129 pieces when
revisiting an evicted distinct-definition entry. Zero budget retained no unpinned
pieces and reloaded on every revisit. These are retained estimates, not RSS/peaks.

Median prepared-module import including WASM initialization was 4.761 ms; parent
launch-through-exit time was 40.775 ms. Neither represents application cold start.
The full JSON evidence includes all modes, raw timings, loads and memory snapshots.
Reproduce the configuration with:

```sh
npm run bench:prepared -w @microsoft/fast-build -- --samples=11 --warmup=5 --instances=1000 --definitions=128 --entries=8 --cache-bytes=262144 --startup-samples=7 --output=prepared-results.json
```
