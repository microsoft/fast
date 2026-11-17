# Profiling native rendering

These are repository development tools, not installed-package runtime APIs.
Run commands from the monorepo root. Use a source-built addon matching the source
being investigated; see the [native hosting guide](./native-node-host.md).
No renderer behavior, artifact format or request API changes are required.

## Capture focused profiles

Build the current compiler and addon:

```sh
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 npm run build -w @microsoft/fast-build
```

Capture the static workloads in fresh worker processes:

```sh
FAST_NATIVE_ADDON="$PWD/crates/microsoft-fast-build/target/node-host/fast-build.node" \
  npm run profile:server -w @microsoft/fast-build -- \
  --workloads=static,largeStaticTemplates \
  --samples=1 --instances=20 --iterations=100 --warmup=20 \
  --profile-duration-ms=1000 \
  --output=./profiles/static-report.json
```

`profile:server` defaults to all four phases and creates a unique
`packages/fast-build/profiles/fast-server-profile-*` directory. CPU profiles persist
after temporary compiler inputs are removed. Open the `.cpuprofile` files with a
compatible V8 CPU-profile viewer. Reports are written exclusively: choose a new
`--output` filename for each run, or omit it to print JSON to stdout.
Paths passed through npm workspace scripts are relative to the package directory.

| Phase | Included work |
|---|---|
| `load` | Repeated artifact reads and program validation/preparation, with the addon already loaded |
| `buffer` | JSON Buffer validation, NAPI, Rust parsing/rendering and owned Buffer output |
| `string` | The complete Buffer boundary plus UTF-8 output decoding |
| `decode` | Decoding one already-rendered Buffer, without another native render |

Use `--profile-phase=buffer` to select one phase. Each diagnostic phase runs for
approximately `--profile-duration-ms` (1–60000 ms); at least one operation completes.
Load passes explicitly collect garbage every 16 constructions to bound native
program allocations that V8 cannot otherwise size. This collection and event-loop
yields are part of diagnostic elapsed time, not an isolated loader benchmark.
Fixed-buffer decoding is a useful attribution probe, not an exact subtraction
estimate of string-delivery overhead: allocation, caching and GC differ.

The ordinary benchmark runs before profiling. Its existing report-version-3
timings still separate compilation, input setup, artifact reading, addon/program
loading, first rendering, warm Buffer rendering and complete string delivery.
The additional `profiles` records are explicitly instrumented diagnostics and must
not be treated as unprofiled benchmark comparisons. `workerProcessMs` includes
these additional passes when profiling is enabled; it is not a startup measurement.
Single-phase reports retain the existing `cpuProfile` path alongside `profiles`.

## Capture native Rust stacks

V8 CPU profiles identify JavaScript and facade overhead but do not resolve Rust
call stacks. Native stacks require an OS sampler and a symbolized addon.
For a separate diagnostic build, retain release debug information:

```sh
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 \
  CARGO_PROFILE_RELEASE_DEBUG=1 CARGO_PROFILE_RELEASE_STRIP=none \
  node packages/fast-build/build-native-host.mjs \
  crates/microsoft-fast-build/target/native-profile-symbols
```

On macOS, add `--native-profiler=sample`:

```sh
FAST_NATIVE_ADDON="$PWD/crates/microsoft-fast-build/target/native-profile-symbols/fast-build.node" \
  npm run profile:server -w @microsoft/fast-build -- \
  --workloads=static,largeStaticTemplates \
  --samples=1 --instances=20 --iterations=100 --warmup=20 \
  --profile-duration-ms=5000 --native-profiler=sample \
  --output=./profiles/native-stacks-report.json
```

Each phase retains a `.sample.txt` beside its V8 CPU profile. On Linux, use
`--native-profiler=perf` instead; this runs `perf record --call-graph dwarf` against
the current worker and produces `.perf.data` files readable with `perf report`.
`perf`, stack-unwinding support and sufficient process-profiling permissions must
already be available. The tool does not install profilers, elevate privileges,
attach to other workloads or change host security settings. Failure is explicit.
OS sampler startup and tail samples can include activity outside the hot loop.
Symbol availability and native profiling permissions depend on the platform.

## Record and interpret evidence

Reports include Node/platform/CPU identity, checkout commit and dirty status,
addon path/hash, artifact sizes/hashes, state hash, output hash and profile paths.
Each phase must reproduce the ordinary render's exact bytes. Keep the Cargo
receipt and symbols with profiles: a checkout commit or binary hash does not by
itself prove that the selected addon was built from those sources.

Start with `static` and `largeStaticTemplates` for literal-output, loading and
string-delivery costs; add `escapedBindings`, `bindings` or `largeState` for state
and escaping work. `--workloads` accepts comma-separated exact names; unknown,
empty or duplicate names fail. Omitting it selects the existing full workload set.
`--markers-v2` and `--attribute-name-strategy` apply consistently to all phases.

Compare unprofiled runs with `npm run bench:server -w @microsoft/fast-build`
using the same workload controls but without `--profile-directory`. Match request
boundaries and rendered bytes, alternate fresh-process samples, and report
regressions as well as improvements. These diagnostics are not HTTP throughput,
cold OS-cache, retained-native-allocation or leak measurements. Process RSS
includes shared mappings and allocator-held pages, and shared machines can have
unrelated workloads; no exclusive-hardware or speedup claim follows from a profile.
