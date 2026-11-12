# Ahead-of-time server modules

## Compilation and execution

`compileServerModule(entry, templates, runtimeImport?)` from
`@microsoft/fast-build/server.js` compiles trusted declarative HTML into ESM.
`templates` accepts the same string/metadata definitions as prepared sources,
including composed CSS, host attributes and shadow-root attributes.
The optional helper specifier defaults to
`@microsoft/fast-build/server-runtime.mjs`; bundlers can resolve or bundle that
server-only module. Do not import `server.js` into the request dependency graph.
It is a build-time API and loads the compiler WASM.

The `server-js` conversion target accepts a registry of named `<f-template>`
files and emits one `.mjs` file, defaulting to `server.mjs`. It rejects wildcard
output paths, duplicate names, empty registries and browser TypeScript options.
Existing `fast-v3-ts` template/stylesheet conversion remains separate.
Stylesheet composition and source-provenance mapping remain build-tool concerns:
pass composed metadata into the compiler and map its structured coordinates
through the composition result.

Generated exports are described by `ServerModule` in `server.d.ts`:

- `renderEntry(state?, options?)`: renders the compiled entry.
- `renderHost(name, state?, options?)`: renders a complete named component host.
- `renderShadow(name, state?, options?)`: renders only its DSD template, with no
  host attributes or caller-owned light DOM synthesized.
- `components`, `compilerId`, `runtimeVersion`: registry and compatibility metadata.

Options are `attributeNameStrategy: "camelCase" | "none"`, `markersV2: boolean`,
and `dsd: string[]`. Omitting `dsd` selects every component; `[]` selects none.
An excluded host retains its authored markup/caller-scoped children, without
template host defaults or shadow evaluation. Selected descendants in that light
DOM still render. An excluded known shadow fragment returns `""`; unknown names
fail. Each request owns its counters, loop frames, selection and child overlays.
Finite cyclic registries compile without expanding component references.
Rendering an actually unbounded recursive component tree is still an error in
the application, not an instruction to truncate output.

## State and byte-preserving semantics

State is acyclic JSON-shaped data: null, booleans, finite numbers, well-formed
Unicode strings, dense arrays and plain objects (including null-prototype
objects) with enumerable own data properties. Omitted root state becomes `{}`.
Negative zero renders as serialized JSON zero did previously.
Only branches requiring that normalization are copied; caller state is never mutated.
Functions, dates/class instances, inherited application properties, accessors,
non-enumerable/symbol properties, sparse/extended arrays and nested `undefined`
are rejected. Normalize these explicitly before rendering. Proxies and concurrent
state mutation are outside the contract; validation is not an untrusted-object
sandbox. Validation checks the complete supplied graph on every call, including
unused state; it has measurable CPU/allocation cost.

Expression compilation preserves the existing server grammar, lookup, alias
shadowing, comparison and display conversion. It does not evaluate arbitrary
JavaScript or adopt browser operator semantics. Arrays display as `[Array]`,
objects as `[Object]`, nullish content as empty text, and missing/null attribute
segments omit the entire attribute. Escaping, static attribute spelling,
whitespace, host-default precedence and hydration markers remain unchanged.
Trusted triple-brace content remains unescaped, as in the existing renderer.
Bindings/directives inside HTML comments remain unsupported.

Generation eagerly visits directive and light-DOM bodies, including skipped
branches and empty repeats, and rejects malformed syntax with existing error
codes, UTF-16 line/column/length and template names. This is intentionally earlier
than the lazy renderer's error timing. Runtime repeat values must still be arrays
(or missing); a present non-array produces `repeat-not-array`.

## Compatibility and migration

Deploy generated modules and compatible server helpers together. Generated code
checks the helper `runtimeVersion` on import and reports a clear incompatibility.
The compiler fingerprint is exported for build manifests; it does not require
loading WASM during a request. Increment the helper contract version for
incompatible compiler/helper changes and regenerate modules on upgrades rather
than promising compatibility with arbitrary historical generated code.

For an existing prepared-rendering application:

1. Move template loading/composition and `compileServerModule` into the build.
2. Deploy/bundle the generated ESM plus its server helper.
3. Replace request-time preparation/loading/rendering with `renderEntry(state)`.
4. Replace fragment calls with `renderShadow(name, componentState, options)`.

Rendering is synchronous and produces complete strings. There are no prepared
piece leases, filesystem watchers, stream-chunk arrays or asynchronous activation
APIs in the generated module. The application owns rebuilds, module activation,
asset delivery and in-flight deployment lifecycle. Browser classes/registration
and hydration configuration are unchanged.

The existing WASM/prepared APIs are retained as qualification/migration baselines
in this change. Their eventual removal is a separate prerelease migration
decision, not a permanent dual-backend compatibility promise.

## Qualification and measurements

`node --test packages/fast-build/test/server.test.js` checks exact output against
reused prepared rendering, both marker formats, both naming strategies, mixed
DSD selection, state rejection, diagnostics, cyclic graphs and every authored
declarative fixture. Fresh-process execution disables WASM instantiation and
JSON parsing. Normal FAST Element fixture builds use AOT output, so the existing
browser suite exercises hydration and reactive updates against generated output.

Run the comparative benchmark from the repository root after building:

```sh
npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200 --output=server-results.json
```

Each sample/mode runs in a fresh Node child; mode order rotates. Cold timings
include backend import, artifact loading and first render, but exclude process
launch and reading the common request fixture. Prepared artifacts are compiled
before timing, then loaded once per child. Warm timings include state
serialization for WASM and complete state validation for AOT, but exclude
compilation and module/artifact initialization. Prepared measurements use the
reused synchronous WASM program, not the asynchronous filesystem/cache host.
Every measured output must have the same SHA-256 hash.

The report includes CPU/wall time, process memory before/after forced GC, observed
GC events/duration, generated/prepared bytes and shared helper/WASM size.
Heap metrics do not represent total WASM allocation; RSS includes native memory.
Prepared byte counts include base64 artifact packaging used by this benchmark.
GC events are observational, not exact allocated-byte counts.
Generated source size is not a minified/bundled-size claim.

Local qualification on Node 22.22.1, macOS arm64, three samples, 200 instances and
100 timed renders per sample produced these medians (milliseconds):

| Workload | AOT cold | Direct cold | Prepared cold | AOT warm | Direct warm | Prepared warm |
|---|---:|---:|---:|---:|---:|---:|
| Static | 1.01 | 4.76 | 7.08 | 0.005 | 0.213 | 0.115 |
| Binding-heavy | 2.83 | 7.27 | 9.25 | 0.361 | 1.173 | 1.189 |
| Repeated components | 3.87 | 9.00 | 10.92 | 0.546 | 1.819 | 1.804 |
| Nested components | 2.30 | 6.31 | 8.84 | 0.151 | 0.766 | 0.659 |
| Large inherited state | 8.22 | 7.98 | 10.53 | 1.198 | 1.441 | 1.275 |

AOT source ranged from approximately 3.4 KB to 166 KB, plus a shared helper of
approximately 11 KB, versus a 954 KB compiler/renderer WASM binary. These are
uncompressed source/binary sizes, not equivalent whole-deployment bundles.
AOT observed more GC events on dynamic workloads; the repeated case retained
approximately 70 MiB RSS versus 60 MiB for prepared rendering. Large-state gains
were modest and validation dominated an earlier, slower implementation.
These are local observations, not universal speedups or regression thresholds;
repeat on target runtimes and application state sizes before backend retirement.
