# Ahead-of-time server modules

One Rust-owned lowering produces the executable representation for two supported
targets: generated JavaScript functions and native Rust compiled artifacts.
JavaScript AOT is a target, not a requirement for native request execution.

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
The entry is empty: use `renderHost` or `renderShadow` for registered components.
Compile page entry HTML through `compileServerModule` when `renderEntry` is needed.
Existing `fast-v3-ts` template/stylesheet conversion remains separate.
Stylesheet composition and source-provenance mapping remain build-tool concerns:
pass composed metadata into the compiler and map its structured coordinates
through the composition result.

Generated exports are described by `ServerModule` in `server.d.ts`:

- `renderEntry(state?, options?)`: renders the compiled entry.
- `renderTemplate(state?, options?)`: renders the compiled source with
  template-context root-host attribute rules.
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
codes, UTF-16 line/column/length and template names. Runtime repeat values must
still be arrays (or missing); a present non-array produces `repeat-not-array`.

## Compatibility and migration

This minor prerelease release contains an **API-breaking migration**: public
source-rendering/prepared APIs are removed, harness rendering becomes asynchronous,
and request state is restricted. Consumers must migrate and regenerate compiled
output, not only update package versions.

Deploy generated modules and compatible server helpers together. Generated code
checks the helper `runtimeVersion` on import and reports a clear incompatibility.
The compiler fingerprint is exported for build manifests; it does not require
loading WASM during a request. Increment the helper contract version for
incompatible compiler/helper changes and regenerate modules on upgrades to
maintain compiler/helper compatibility.

For a JavaScript server build:

1. Move template loading/composition and `compileServerModule` into the build.
2. Deploy/bundle the generated ESM plus its server helper.
3. Call `renderEntry(state)` for complete entries.
4. Call `renderShadow(name, componentState, options)` for DSD fragments.

Rendering is synchronous and produces complete strings. The application owns
rebuilds, module activation, asset delivery and in-flight deployment lifecycle.
Browser classes/registration and hydration configuration are unchanged.

Native hosts use the artifact target below. See
[the upgrade guide](./migration/aot-server-rendering.md).

## Native Rust artifact target

At build time, call Rust `compile_server_artifact(entry, &locator)` or Node
`compileServerArtifact(entry, templates)` from `server.js`. The latter loads
compiler WASM only during compilation and returns a `Uint8Array`. Persist the
bytes alongside the server build. The `fast convert --syntax=server-js` CLI
continues to emit JavaScript; artifact compilation is an explicit build API.

The compiler lowers HTML/directives/attributes/conditions once to executable
bodies shared with the JS emitter. The artifact contains literal output writes,
segmented paths, typed static values, condition opcodes, repeats, prelowered
attribute recipes and symbolic component/body references. It does not contain
authored template bodies for later compilation or source offsets used as executable
instructions. Repeat expression text is diagnostic-only; it is never evaluated.
Literal output markup is not reparsed. `CompiledArtifact::emit_server_module`
can generate the JavaScript target from the exact loaded IR at build time.

```rust
use microsoft_fast_build::{CompiledArtifact, NativeRenderOptions, parse_render_state};

// Server startup: compiled bytes, not authored templates.
let program = CompiledArtifact::load(&std::fs::read("generated/server.fast")?)?;
// Each request:
let state = parse_render_state(r#"{"title":"Native request"}"#)?;
let html = program.render_entry(&state, &NativeRenderOptions::default())?;
```

Native APIs are `render_entry(state, options)`, `render_template(state, options)`,
`render_host(name, state, options)` and `render_shadow(name, state, options)`.
Their state, root-host, fragment, DSD-selection and hydration semantics match the
generated-module APIs. `NativeRenderOptions` uses `markers_v2`,
`attribute_name_strategy: AttributeNameStrategy::{CamelCase,None}` and
`dsd: Option<Vec<String>>` (`None` all, `Some(vec![])` none).
There is no implicit state; pass an empty object when appropriate.
`parse_render_state` validates request JSON, or construct the public `JsonValue`
type directly. All calls reject nonfinite numbers even in unused state and
normalize negative zero without mutating caller data. Rust strings/maps/arrays
provide Unicode, own-key and dense-array guarantees without JavaScript objects.

### Compatibility, errors and memory

- The artifact envelope identifies `format: "fast-server"`, `version:
  SERVER_ARTIFACT_VERSION` (currently 1), `compilerId` and `runtimeVersion`.
  Load requires an **exact compiler fingerprint**, format/version and helper
  contract match. The artifact is an implementation format, not a stable ABI or
  cross-version interchange promise. Regenerate and deploy matching native
  library/artifacts together; package version alone is insufficient.
  The fingerprint includes authored Rust source, build script, manifest and
  lockfile paths/bytes. Cargo-packaged builds use the preserved `Cargo.toml.orig`
  as the manifest input, so packaging normalization alone does not change identity.
- Load validates every opcode, operand shape, static value, component reference,
  body index and envelope field, including unreachable bodies. It never parses
  HTML or expression text. Malformed JSON/deep JSON and artifacts over 64 MiB
  fail; condition/static-value trees have additional 64-level schema bounds.
  Artifacts accept at most one million bodies and one million total body operations.
  The compiler validates native output with the same loader before returning it.
- `CompiledArtifact` owns immutable reference-counted storage, is `Send + Sync`,
  and supports cheap clones across worker threads. Input artifact bytes, authored
  sources and locators can be released after load. The application owns atomic
  activation and keeps older clones alive for in-flight requests.
- Each render validates/normalizes and copies the request state (64 nesting
  levels, at most one million values), and owns transient overlays, loops,
  hydration counters and the returned `String`. State must not be mutated
  concurrently. This is not a zero-copy claim; peak memory includes the loaded
  JSON IR, request state/overlays, temporary escaped strings and full output.
  Caller input sizes and deployment concurrency still need application limits.
  Allocations use Rust's allocator; allocation exhaustion follows the host
  allocator's policy (which may abort), not a portable recoverable OOM guarantee.
- Native execution has a hard 128 nested-body-call limit. Defaults are one
  million execution steps (body operations, attribute recipes and repeat
  iterations) and 64 MiB output; `max_steps` and `max_output_bytes`
  can be configured per request. Finite conditional component cycles remain
  supported without compiler expansion. Unbounded recursive request graphs fail
  with `render-limit`, not stack overflow or silently truncated HTML.
- APIs return owned complete strings or `NativeRenderError { code, message }`.
  Codes include `incompatible-artifact`, `invalid-artifact`, `invalid-state`,
  `missing-template`, `repeat-not-array` and `render-limit`. Errors return no
  partial output and cannot mutate subsequent requests. Runtime errors do not
  promise authored coordinates; compiler errors retain existing diagnostics.
- Artifacts are trusted deployment inputs, not an authorization or sanitization
  boundary. Validation prevents invalid execution references/opcodes, not unsafe
  literal HTML. Trusted triple-brace HTML retains its original contract.

Only native Rust hosting is supported here. No stable C ABI, unmanaged
allocation/error ownership convention, .NET binding or working C# host is
provided. Those are follow-up integration work over this Rust executor, not a
separate C# implementation of HTML/expression semantics.

### Target resource contracts

Shared rendering semantics do not guarantee that both targets accept the same
workload. JS AOT exposes no FAST state-depth/node, body-depth, step or output
budgets; its JavaScript host still imposes stack, string and memory limits.
Native execution has these additional public bounds:

| Resource | Native contract |
|---|---|
| State nesting | Root depth is zero; depth 64 is accepted and depth 65 is rejected, including unused state |
| State values | At most 1,000,000 values, counting the root and every array item/object value, but not object keys |
| Body nesting | Root body depth is zero; 128 nested calls are accepted and the next fails |
| Execution steps | Default 1,000,000; `max_steps` counts body operations, attribute recipes and repeat iterations |
| Output | Default 64 MiB; `max_output_bytes` counts UTF-8 bytes, not characters |

Configured step/output limits are inclusive; exceeding a limit returns
`render-limit` without partial output. State-limit failures return `invalid-state`.
Budgets reset on each call, including after errors. Workload qualification when
switching targets must include these bounds, not only successful HTML parity.
Tightening defaults, rejecting previously accepted state, or changing normalization
or coercion is a consumer compatibility change even if ordinary snapshots match.

### Deployment and native API evolution

The exact compiler fingerprint is a fail-fast deployment contract, not just
informational metadata. Matching package versions do not establish artifact
compatibility. Every separately deployed build must supply artifacts matching
its own native library; future encodings may reject older artifacts but must
never silently reinterpret them. Do not edit identity/version fields to bypass
validation.

Load/validate replacement artifacts before application-owned atomic activation.
Reject incompatible candidates without replacing the active program, and keep
old `CompiledArtifact` clones for in-flight requests. With a native-library upgrade,
old workers finish using their existing library/handles while new workers load
newly generated matching artifacts. Rust handles are not transferable across
processes or native-library versions.

Native methods borrow `&JsonValue` and `&NativeRenderOptions` only for the call;
they do not retain caller-owned request data. The current state copies and
allocation strategy are implementation details, not a permanent copying
requirement. Optimization can reduce them while preserving borrowed input
signatures, independently owned output/error values, `Send + Sync` artifact
sharing, request isolation, error categories/no-partial-output behavior and
rendering semantics. Changing those public guarantees requires a Rust consumer
migration, independently of whether .NET bindings exist.

The first C ABI/.NET binding must specify handle lifetimes, allocation/free,
error transport and cancellation before publication. Adding that binding over
the native executor should be additive; it must not redefine rendering semantics
or introduce another renderer in C#.

## Qualification and measurements

`node --test packages/fast-build/test/server.test.js` checks frozen SHA-256 output
contracts, both marker formats, both naming strategies, mixed
DSD selection, state rejection, diagnostics, cyclic graphs and every authored
declarative fixture. Fresh-process execution disables WASM instantiation and
JSON parsing. Normal FAST Element fixture builds use AOT output, so the existing
browser suite exercises hydration and reactive updates against generated output.

`cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml` also executes
the original rendering assertion corpus through loaded native artifacts and
generated JavaScript, preserving its expected bytes. `native_artifacts.rs` adds
entry/template/host/shadow conformance, both marker formats, DSD all/none/subsets,
nested/repeated components, coercion/escaping, invalid state/artifacts, recursion
and concurrent reuse. `node --test packages/fast-build/test/native-artifact.test.js`
deploys actual Node/WASM-compiled bytes to workspace and verified Cargo-packaged
native examples with no JavaScript engine on their executable search path.
It also verifies that changing the packaged authored manifest rebuilds the host
and rejects the original artifact. Neither backend regenerates its own
expected-output oracle. Native performance is not claimed by the
JavaScript measurements below.

Run the AOT benchmark from the repository root after building:

```sh
npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200 --output=server-results.json
```

Each sample runs in a fresh Node child with Node's module compile cache disabled.
This isolates process-local first use, not a cold operating-system file cache.
Workload shapes are unchanged across samples. The compiler loads once in the
parent, and each workload compiles and writes its generated artifact once before
the child samples start.

The JSON report uses `reportVersion: 2` and separates these wall-clock phases:

| Field | Boundary |
|---|---|
| `compilerLoadMs`, `workloadSetupMs` | Parent compiler/WASM loading and construction of all benchmark fixtures |
| `inputWriteMs` | Per-workload fixture JSON serialization and file writing |
| `compileMs`, `artifactWriteMs` | Per-workload template compilation and UTF-8 generated-module file writing |
| `workerSetupMs` | Node process time origin to worker entry, including Node and benchmark-harness initialization; not the parent's OS spawn latency |
| `inputReadMs`, `inputParseMs` | Child fixture-file read and JSON parsing, outside rendering |
| `moduleImportMs` | Generated module and server-helper import |
| `firstRenderMs` | First synchronous render call only; includes any V8 lazy compilation on first use |
| `coldImportAndRenderMs` | Sum of module import and first render, not startup or request-fixture loading |
| `utf8EncodeMs`, `outputWriteMs` | First result's string materialization/UTF-8 Buffer conversion and local file open/write/close |
| `warmupMs`, `warmupIterations` | Explicit untimed-for-throughput warmup, default 20 calls; configure with `--warmup=N`, including zero |
| `warmMsPerRender`, `cpuMsPerRender` | Average wall/CPU time for `--iterations=N` warm synchronous render calls |
| `workerProcessMs` | Parent-observed full child lifecycle, including spawn, setup, phases, validation, GC, report transfer and optional profile flushing |

Version 1 reports had no version field and used `firstRenderMs` for **import plus
first render**. Compare that historical field with version 2's
`coldImportAndRenderMs`, not its isolated `firstRenderMs`. Build phases happen
once per workload, while child phases repeat per sample; do not add lifecycle or
aggregate fields to their constituent phases.

UTF-8 conversion and file delivery occur after the first render and before
warmup. File writing measures operating-system-cached local delivery, not
`fsync`, network latency or durable storage. Warm rendering includes complete
state validation and string construction, but excludes import, JSON parsing,
UTF-8 conversion, file delivery and output verification. The final warmup and
warm results are checked against the first result outside the render timers;
repeated samples must have the same SHA-256 hash of the delivered UTF-8 bytes.

The report retains process memory before/after forced GC, observed GC
events/duration, generated bytes and shared helper/compiler-WASM size. GC counts
include only observed events starting in the measured warm loop, not the
explicit collections around it. Memory snapshots retain the cold and latest
warm strings; they are not exact allocated-byte counts. Heap metrics do not
represent total WASM allocation; RSS includes native memory. Generated source
size is not a minified/bundled-size claim.

To collect optional Node CPU profiles for every child sample:

```sh
npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200 --warmup=20 --profile-directory=server-profiles --output=profiled-results.json
```

Profiles persist in a unique run subdirectory of `server-profiles`, with each
sample's `cpuProfile` path included in the report. They cover the child
load/render/delivery lifecycle, not parent compilation. Temporary input,
generated-module and rendered-output files are removed after the run.
Profiled runs have instrumentation and exit-time profile-writing overhead;
do not compare them as equivalent to unprofiled timing samples.
