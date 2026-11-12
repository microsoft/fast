# Ahead-of-time server modules

## Compilation and execution

`compileServerModule(entry, templates, runtimeImport?)` from
`@microsoft/fast-build/server.js` compiles trusted declarative HTML into ESM.
`templates` accepts string or ServerTemplateDefinition metadata,
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
- `renderTemplate(state?, options?)`: renders that source with the former
  non-entry root-host attribute rules, for migrating `render_with_templates`.
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

The native Rust evaluator, request-time WASM exports and prepared lifecycle/artifact APIs are removed. Rust remains the build-time compiler. See [the breaking migration guide](./migration/aot-server-rendering.md).

## Qualification and measurements

`node --test packages/fast-build/test/server.test.js` checks frozen SHA-256 output contracts captured from passing
prepared-renderer differential tests before retirement, both marker formats, both naming strategies, mixed
DSD selection, state rejection, diagnostics, cyclic graphs and every authored
declarative fixture. Fresh-process execution disables WASM instantiation and
JSON parsing. Normal FAST Element fixture builds use AOT output, so the existing
browser suite exercises hydration and reactive updates against generated output.

Run the AOT benchmark from the repository root after building:

```sh
npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200 --output=server-results.json
```

Each sample runs in a fresh Node child. Cold timings
include module import and first render, but exclude process
launch and reading the common request fixture. Compilation occurs before timing. Warm rendering includes complete state validation, but excludes module initialization. Repeated samples must have the same SHA-256 output hash.

The report includes CPU/wall time, process memory before/after forced GC, observed
GC events/duration, generated bytes and shared helper/compiler-WASM size.
Heap metrics do not represent total WASM allocation; RSS includes native memory.
GC events are observational, not exact allocated-byte counts.
Generated source size is not a minified/bundled-size claim.

Historical pre-retirement qualification at commit `02396a2ef` on Node 22.22.1, macOS arm64, three samples, 200 instances and
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
repeat on target runtimes and application state sizes. The retired backends are no longer available in the benchmark.
