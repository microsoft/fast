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

An additional selection workload repeats an excluded-capable shell with a selected
leaf in its authored light DOM. The shell's shadow references a different component.
It measures all-DSD, no-DSD and mixed-allowlist entries, plus all-DSD, mixed and
excluded shell fragments. Entry size follows `--instances`; fragments have a fixed
one-shell/one-shadow-child size, not that many repeated instances. In both marker
modes, entries match legacy HTML/exact chunks with the corresponding selected
registry; selected fragments match the legacy fragment API. Excluded fragments
use the documented empty-output contract as their oracle. The prepared runtime
always receives the complete immutable registry, never a filtered manifest.

## Measurement boundaries

- **Process cold:** isolated fresh Node children. Child timing measures importing
  `prepared.js`, including its synchronous WASM initialization. A following WASM
  `require` is cached and is reported as such. Parent timing includes process
  launch through exit, the benchmark's own imports, and reporting overhead.
  Neither is described as pure engine startup or HTTP/server startup.
- **Preparation:** repeated synchronous compilation after untimed parity,
  measuring CPU and elapsed time without filesystem persistence. Artifact and
  manifest bytes/counts are reported independently. Compiler preparation is not
  included in warm render timings. `preparationReuse` separately measures the same
  complete inputs with validated previous-result reuse; identity scanning/hashing
  and complete candidate assembly remain inside that timer.
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
- **DSD policies and fragments:** fresh-runtime disk loads and warm rendering are
  separate lanes, with cold artifact counts/bytes and retained Rust estimates.
  All/no/mixed entries must load exactly four/one/two pieces; all/mixed/excluded
  fragments must load two/one/zero. Cold timing includes manifest I/O, validation,
  runtime creation and first execution. Warm timings exclude those operations and
  cache priming, include both marker modes, and include exact chunks for entries.
  These lanes use the default cache budget and assert no warm artifact reloads.

State is one unmodified object per workload, serialized/captured anew by each
request. Outputs are consumed but not retained between measured requests.
Requests are sequential: this harness does not measure concurrent active leases,
state mutation races, or manifest activation.
Handles are disposed and the uniquely named `.prepared-bench-*` directory under
the current working directory is removed even on failure. No system temporary
directory is used. Interruption with SIGKILL can leave that owned directory behind.

## JSON evidence and limitations

`schemaVersion: 2` includes `configuration`, machine/Node/git/WASM/compiler
`provenance`, explicit `boundaries`, per-entry `parity` hashes,
`policyParity`, `processColdInitialization`, workload `records` and `dsdPolicies`.
Workload records contain `preparation`, `preparationReuse`, artifact sizes,
`filesystemPersistence`, `diskLoadAndFirstRender`, `warmedRendering`, and
`retention`. Policy records contain cold load counts/bytes, timings and retention,
plus warm timings/retention. Timing summaries contain medians and all raw samples.
Even sample counts average the middle pair.

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

## Earlier integration observation

A 2026-11-10 run on Apple M3 Pro / Node 22.22.1 used 11 samples, five warmup
iterations, eight entries, 1,000 repeated instances or 128 distinct definitions
per entry, and seven startup samples. This measured the uncommitted integration
worktree based on `fe39569ad`, **not that commit alone**. Compiler fingerprint:
`75233e356ca8882ae2ab717d28bbdecba0e806d448d2f8b687af4c2dc3c18401`.
WASM was built with `npm run build -w @microsoft/fast-build` (release/wasm-opt).
All 64 HTML/exact-chunk parity comparisons passed.
This earlier run used schema version 1 and did not measure incremental preparation,
DSD policies or fragments; it is not evidence for the follow-up implementation.

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

## Incremental preparation and DSD-loading observation

A follow-up 2026-11-10 run used the same machine/configuration and a freshly built
release/wasm-opt module in the uncommitted follow-up worktree based on `9bb78e260`,
not that commit alone. Compiler fingerprint:
`46ea8d4cd763c38cd4c49f53e52880733794e6d58037639dd52b0ccb42f764f9`.
WASM SHA-256:
`8f80b4f477ecb8e5ef665dfc694bda87d4c39db0f2f979d5f15741f54a6d8a51`.
All 64 existing entry comparisons and 18 selection/fragment comparisons passed.
Build and benchmark commands are the same as above; schema version 2 records the
additional lanes.

| Median preparation, all eight entries | Repeated components | Distinct definitions |
|---|---:|---:|
| Full compilation | 0.148 ms | 11.466 ms |
| Validated unchanged previous-result reuse | 0.092 ms | 9.038 ms |

Reuse still scans/hashes complete inputs, validates and copies artifact bytes, and
assembles a manifest. Deterministic tests separately verify zero unchanged native
compilations; these timings do not imply zero preparation work.

| Selection workload | Cold loads | Artifact bytes read | Retained Rust bytes | Cold median | Warm v3 HTML median |
|---|---:|---:|---:|---:|---:|
| Entry, all DSD | 4 | 1,032,588 | 998,293 | 6.076 ms | 2.284 ms |
| Entry, no DSD | 1 | 1,029,981 | 995,352 | 4.926 ms | 0.213 ms |
| Entry, mixed | 2 | 1,030,618 | 996,256 | 5.740 ms | 1.017 ms |
| Fragment, all DSD | 2 | 1,970 | 2,037 | 0.276 ms | 0.007 ms |
| Fragment, mixed | 1 | 1,333 | 1,133 | 0.166 ms | 0.006 ms |
| Fragment, excluded | 0 | 0 | 0 | 0.089 ms | 0.002 ms |

Entry cases contain 1,000 authored shell/light-leaf instances; fragment cases are
fixed-size. The entry piece dominates bytes because the fixture authors those
instances explicitly, so fewer shadow loads do not imply proportional byte
savings. Different policies intentionally produce different output/work; this is
not an equal-work speedup comparison or a controlled before/after study. Cold
timings include manifest validation and runtime creation even for an excluded
fragment. Warm samples performed no artifact I/O. Retained estimates exclude
backing-store bytes and are not RSS or peaks. All other measurement limitations
above still apply.
