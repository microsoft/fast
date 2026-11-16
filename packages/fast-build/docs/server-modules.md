# Compiled semantic server modules

One Rust-owned lowering produces the executable representation for two supported
targets: semantic-plan JavaScript and native Rust compiled artifacts.
JavaScript is a target, not a requirement for native request execution.

## Compilation and execution

`compileServerModule(entry, templates, runtimeImport?)` from
`@microsoft/fast-build/server.js` compiles trusted declarative HTML into ESM.
`templates` accepts string or ServerTemplateDefinition metadata,
including composed CSS, host attributes and shadow-root attributes.
The optional helper specifier defaults to
`@microsoft/fast-build/server-runtime.mjs`; bundlers can resolve or bundle that
server-only module. Do not import `server.js` into the request dependency graph.
It is a build-time API and loads the compiler WASM.

Generated ESM embeds semantic operation objects and named templates rather
than rendering functions or numeric execution tables. The helper validates all rules/references and creates
execution closures once during module loading. Requests execute those closures;
they do not compile templates or evaluate source. The published object/prepared
APIs and state ownership contracts below are unchanged.

### Stable semantic data

The JavaScript and native targets share these semantic fields:

```json
{
    "format": "fast-server-js",
    "version": 1,
    "entry": [
        { "type": "literal", "html": "<p>" },
        { "type": "binding", "path": ["label"], "escape": true },
        { "type": "literal", "html": "</p>" }
    ],
    "templates": {},
    "components": {}
}
```

For native artifacts, only the envelope identity differs:
`format: "fast-server-native"`; both new formats start at `version: 1`. JavaScript modules pass their
plan to `createServerRenderer(plan)`; native hosts pass serialized bytes to
`CompiledArtifact::load`.

`entry` is an ordered list of operations. `templates` maps opaque names to other
operation lists, keeping reused bodies shared instead of recursively expanding
them. Names are references, not execution indices; consumers must not interpret
their spelling or order. Components map authored names directly to a complete
DSD template reference, such as `{ "my-card": "template0" }`. A component template
starts with a literal containing its opening DSD tag, has its content operations
in the middle, and ends with a separate `"</template>"` literal. Loaders derive
the host wrapper from the registered name instead of exposing generated host
templates or separate `shadow`, `host` and `tag` references.

An optional first `{ type: "host-attributes", attributes }` operation preserves
authored host defaults. Its ordered entries are `{ name, attribute }` objects.
It is metadata for deriving the host renderer, not shadow output, and is only
accepted at the beginning of a registered component template. Templates with
different defaults or shadow options can reference shared content bodies.
Unknown envelope fields, operations and references are rejected, including in
unreachable templates. Loaders own any string interning, offsets, numeric
instructions, native indices, accessors or execution closures they need.

| Operation | Meaning |
|---|---|
| `{ type: "literal", html }` | Output literal markup/text. |
| `{ type: "binding", path, escape }` | Output a state path; `escape` is a boolean controlling HTML escaping. |
| `{ type: "template", name }` | Execute a shared template in the current context. |
| `{ type: "component", name }` | Render a registered component's derived host wrapper and shadow content. |
| `{ type: "when", condition, template }` | Execute a template if a condition is true, preserving hydration boundaries. |
| `{ type: "repeat", alias, collection, diagnostic, template }` | Repeat a template with lexical alias/index scope; the diagnostic string identifies invalid collections. |
| `{ type: "tag", plain, hydrated, count, ending }` | Render ordinary or hydrated tag attributes. |
| `{ type: "element", ...descriptor }` | Render a component call site, its property overlays, host attributes, shadow and light DOM. |

Paths are nonempty string-segment arrays, not JavaScript expressions.
Conditions use `{ type: "truthy" | "not", path }`,
`{ type: "and" | "or", left, right }`, or
`{ type: "compare", operator, path, value: operand }`.
Operands are `{ type: "path", path }` or `{ type: "value", value: literal }`.
Typed literals use `{ type: "null" }` or
`{ type: "bool" | "number" | "string" | "array" | "object", value }`;
numbers are encoded as strings, and array/object entries are typed literals.
Compound literals remain fresh per request, not shared mutable state.

Tag descriptors have `{ plain, hydrated, count, ending }`. The first two are
attribute-operation lists, `count` is the hydration binding count, and `ending`
is the closing tag delimiter. Attribute operations are literal text,
`{ type: "attribute", name, path, boolean, primitive }`,
`{ type: "conditional", condition, html }`, or `{ type: "quoted", name, parts }`.
Quoted parts are literal operations or `{ type: "segment", path }`.

Element descriptors have `{ name, body, closing, opening, props, entry, normal,
count, defaults }`. `body` names the light-DOM template, `opening` is a
tag descriptor, `entry`/`normal` are host attribute-operation lists, and `count`
preserves host hydration markers. Ordered `props` entries are
`{ camelCase, unchanged, dataset, value: operand }`, with `dataset` null or a
dataset key; ordered `defaults` entries are `{ name, attribute }`.
These preserve naming, dataset merging, caller masking and host-default evaluation
semantics. `closing` retains exact authored closing markup; shadow-root options
come from the component's DSD template.

Schema versions describe these semantics, **not an execution backend or its
performance strategy**. Changing private lowering does not require regenerating
files or changing a version. An incompatible change to a tag's meaning or fields
still requires an explicit schema migration.
Benchmark tooling retains its existing `flatPlan` mode and
`flat-plan-javascript` target labels for report consumers; current compiler output
is semantic. Earlier numeric-plan measurements do not measure this replacement.

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
- `components`: registered component names.
- `prepareState(state?)` and `renderEntryPrepared`, `renderTemplatePrepared`,
  `renderHostPrepared`, `renderShadowPrepared`: explicit immutable snapshot reuse.

Options are `attributeNameStrategy: "camelCase" | "none"`, `markersV2: boolean`,
and `dsd: string[]`. Omitting `dsd` selects every component; `[]` selects none.
An excluded host retains its authored markup/caller-scoped children, without
template host defaults or shadow evaluation. Selected descendants in that light
DOM still render. An excluded known shadow fragment returns `""`; unknown names
fail. Each request owns its counters, loop frames, selection and child overlays.
Finite cyclic registries compile without expanding component references.
Rendering an actually unbounded recursive component tree is still an error in
the application, not an instruction to truncate output.

## Modular deployments

`compileServerAssets(entry, templates, runtimeImport?)` returns `{ entry, files }`.
`entry` is `"server.mjs"`; `files` maps relative semantic filenames to UTF-8
source. Every component owns semantic schema-1 operation objects and named
templates, not numeric instructions, string tables or offsets. Component names
reference one complete DSD template with optional `host-attributes` metadata.
The thin entry combines independently scoped, disjoint template maps and calls
the existing `createServerRenderer` once. `server.manifest.json` version 1 describes the entry,
runtime import, component filenames and sorted symbolic dependency names.
Component self-references and finite registry cycles are legal. Unknown external
custom elements remain render-time errors only when selected for DSD; they can
remain authored light DOM when excluded. Missing imported assets and malformed
templates fail during module import, including unreachable component plans.

Semantic filenames contain no hashes, compiler identity, absolute paths or state.
Escaping covers arbitrary registry keys; it does not validate HTML custom-element names.
Template naming is local, so unrelated registry edits leave existing plans
byte-identical. Changed shadow content changes that component; changed host or
shadow-root defaults can also change callers because those recipes are compiled
at host occurrences. The manifest describes those actual dependencies; it is
not an incremental-compilation API. Compiling a fresh deployment still eagerly
lowers the complete registry and diagnoses skipped/unreachable invalid templates.

```js
import { writeServerAssets } from "@microsoft/fast-build/server.js";

writeServerAssets(
    "./generated/release-1",
    { entry: "<my-card></my-card>", templates: { "my-card": "<h2>{{title}}</h2>" } },
);
// Request host:
// import { renderEntry } from "./generated/release-1/server.mjs";
```

The managed writer accepts `runtimeImport` and `onWarning`, not `overwrite`.
It holds a cooperating-writer lock, writes/fsyncs a complete staged directory
beside the destination, then publishes it with one directory rename. Failed
staging or publication leaves no partial destination. `server.inputs.json`
records exact authored inputs and every emitted file's exact bytes, not hashes
or compiler keys. An existing directory must have exactly the recorded regular
files, with identical bytes and configuration. Missing, changed, symlinked,
unmanaged or unsupported manifests fail closed; they are not repaired.
Manifest JSON must round-trip its exact UTF-8 bytes before input comparison.
Malformed bytes cannot authorize reuse through lossy replacement characters;
legitimate UTF-8 U+FFFD characters remain supported.
An identical managed deployment is reused without importing WASM or parsing raw
template sources. Changed authored inputs require a new explicit directory.

This contract deliberately avoids in-place incremental publication and does not
auto-recompile untouched assets on compiler upgrades. Publish the whole directory
under a release URL or swap an application-owned deployment pointer atomically.
Keep old directories available for active processes. Node caches every dependency
URL: cache-busting only the entry does not reload its already imported plans.
Do not apply immutable HTTP caching to mutable unversioned semantic URLs.
Directory rename ensures process-visible publication on one filesystem; it is not
a promise of crash-durable distributed storage or protection from noncooperating
writers. The manifest is integrity bookkeeping for trusted deployment bytes,
not a signature or a request-time file watcher.

The existing single-file writers and semantic JS/native schema-1 decoders remain
unchanged. Old cached modules expose the same ordinary/prepared methods as the new
modular entry; this addition requires no new generated named exports or blanket
recompilation. Adopt modular output only for newly compiled assets at a new
destination. Request/default/bootstrap-state precedence and hydration are unchanged.
This is an optional deployment layout, not a runtime speedup: it adds imports and
does not share prepared execution closures across entries. Unlike a single-file
plan, separate component files do not share identical shadow bodies with one
another, so a single deployment can be larger.
Repeated entries can reuse the same component source files, but callers using
`compileServerAssets` must publish a complete, consistently linked release.

For untimed many-definition/repeated-entry size and churn qualification:

```sh
npm run bench:assets -w @microsoft/fast-build -- --definitions=200 --entries=10
```

Add `--measure --samples=5 --iterations=100 --warmup=20` only on an isolated
measurement runner. The script compares the baseline single-file layout with
shared modular source, alternates fresh import/render workers, records separate
compiler loading, compilation, import, first render, UTF-8 encoding, warm string
rendering, process memory and managed reuse costs. `--order=modular-first` reverses
compiler pair order for repeated fresh-process samples. Shared ESM source does
not imply shared prepared execution closures across entries.

The browser conformance command is `npm run test:assets:hydration -w
@microsoft/fast-build`; build `@microsoft/fast-element` first and install Playwright
Chromium. It verifies both marker formats, retained shadow/text/light-DOM node
identity and reactive attribute updates against real modular output.

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
sandbox. Ordinary methods validate the complete supplied graph on every call, including
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

## Prepared-state snapshots

For unchanged state rendered repeatedly, generated modules expose a separate
opt-in path; ordinary methods retain their validation contract:

```js
import { prepareState, renderEntryPrepared } from "./generated/server.mjs";
const input = { title: "Reusable state" };
const snapshot = prepareState(input);
input.title = "A later request"; // Does not alter the snapshot.
const html = renderEntryPrepared(snapshot);
```

Preparation validates the complete graph using the same rules as ordinary
rendering, normalizes negative zero, copies all containers and recursively
freezes the copy, not the input. It never invokes getters or `toJSON`.
The result is an opaque `PreparedServerState` handle. All four render methods
have `Prepared`-suffixed counterparts with the same argument order, but a required
handle instead of optional ordinary state. Rendering still returns complete
owned strings; options, overlays, counters and loops are fresh per call.

Handles are associated with one **runtime helper instance**, not one artifact.
Modules sharing that instance may reuse a handle, even across entries.
Forged, proxied or other-helper handles fail with `TypeError`; ordinary render
methods do not accept handles. Handles cannot be serialized or sent to another
worker/process. There is no explicit disposal or native external-memory handle:
dropping references permits garbage collection. Applications control snapshot
retention, including shared use across requests. Never share user-specific state
with unrelated requests.

Native Rust provides `PreparedState::new(&JsonValue)` and
`PreparedState::from_json(&str)`. Both own a validated normalized copy; the JSON
constructor reuses `parse_render_state`. `render_entry_prepared`,
`render_template_prepared`, `render_host_prepared` and `render_shadow_prepared`
borrow the snapshot and otherwise retain the ordinary method signatures.
The private immutable `Arc` is `Send + Sync`, artifact-independent and cheaply
cloneable; dropping its final clone releases it. Native depth/node state limits
apply during construction. Body-depth, step and UTF-8 output budgets reset on
every prepared render, including after errors. No serialized snapshot or
cross-version handle interchange is provided. Lookups/overlays can still allocate.

Preparation has CPU and retained-memory costs. Prefer ordinary calls when state
changes every request. Measure preparation plus repeated renders, render-to-UTF-8
cost and snapshot retention before opting in; the benchmark modes below include
fresh preparation on every call as a control.

## Compatibility and migration

The semantic-plan replacement preserves published object-input and prepared-state
APIs, state acceptance and ownership. Rebuild legacy outputs once and deploy a
helper that supports the generated plan schema.
The upgrade guide separately describes the earlier API-breaking migration from
request-time source rendering and retired prepared compiler/program APIs.

Generated code no longer exports a compiler fingerprint or compares a literal
helper-build version on import. The helper validates the supported plan schema;
JavaScript plans use `format: "fast-server-js"` with semantic schema version 1.
no runtime release metadata is emitted or exported. Native loading also uses
explicit supported schemas rather than compiler-build identity.
Unknown schemas fail safely. Retain supported published decoders across runtime
upgrades instead of invalidating unchanged assets on every compiler change.

Flat plans replace generated rendering functions while preserving the existing
snapshot methods. The loader prepares path
accessors and numeric alias slots at module import, including array-index
decoding. Repeats reuse request-local alias/index cells rather than copying
loop arrays per iteration. The newest matching alias wins, including implicit
`$index` precedence; missing nested values do not fall through to older aliases
or parent state. Shared bodies do not capture a frame, and component shadows
reset caller lexical scope. Ordinary state/rendering contracts and IR schema
semantics remain unchanged. Legacy fingerprinted assets require a one-time
migration; compiler-only updates do not invalidate the new supported formats.

For a JavaScript server build:

1. Move template loading/composition and `writeServerModule` into the build.
2. Deploy/bundle the generated ESM plus its server helper.
3. Call `renderEntry(state)` for complete entries.
4. Call `renderShadow(name, componentState, options)` for DSD fragments.

Rendering is synchronous and produces complete strings. The application owns
rebuilds, module activation, asset delivery and in-flight deployment lifecycle.
Browser classes/registration and hydration configuration are unchanged.

### Generated asset stability

Flat plans contain no compiler fingerprint or literal helper-build version.
Identical inputs compile deterministically, but a pure compilation call cannot
recover an older output after the compiler changes its encoding. Strict
template-only stability therefore requires retaining the existing generated
assets and their authored-input manifests, in source control or a persistent
build cache. Unchanged authored inputs reuse those bytes rather than compiling
again. Compiler identity, package version and timestamps are not rebuild keys.

Use synchronous `writeServerModule(outputPath, inputs, options?)` for ESM or
`writeServerArtifact(outputPath, inputs, options?)` for native bytes. Create the
destination directory first. Both return `{ reused, manifestPath }`; the sidecar
is `${outputPath}.inputs.json`.

```js
import { mkdir } from "node:fs/promises";
import { writeServerModule } from "@microsoft/fast-build/server.js";

await mkdir("./generated", { recursive: true });
const result = writeServerModule(
    "./generated/server.mjs",
    {
        entry: "<my-card></my-card>",
        templates: { "my-card": "<h2>{{title}}</h2>" },
    },
    { overwrite: true },
);
```

Inputs accept an `entry` string and either a `templates` registry (strings or
`ServerTemplateDefinition` values), or `templateSources`, an array of complete
authored `<f-template>` source strings. Registry names and raw source texts are
sorted for comparison; duplicate source texts are retained. Exact content,
whitespace, line endings and attribute ordering matter. Optional attribute lists
and metadata format defaults are normalized; compiler-derived bindings and source
locations are excluded. Paths are not authored inputs.

The manifest records canonical authored inputs, asset kind, deployment
configuration and exact base64 output bytes. It contains no hashes or checksums.
The output snapshot costs approximately 133% of the asset's byte size, in addition
to the input copy; sidecars are build storage, not runtime dependencies.

Unchanged managed assets retain both files' bytes and timestamps without loading
WASM or parsing templates. If only the output is missing, its retained snapshot
restores the exact bytes. Losing both files loses the historical encoding:
a fresh compiler cannot reconstruct arbitrary previous output.

`overwrite` defaults to `false`. Unchanged managed reuse is idempotent; replacing
an existing asset after template edits, or adopting an unmanaged destination,
requires `overwrite: true`. JavaScript options also accept `runtimeImport`.
Changing the runtime import or target kind at a managed destination is rejected
even with overwrite; use a new destination or explicitly reset the retained pair.
Malformed manifests and output bytes that differ from their stored snapshots
also fail closed rather than silently recompiling.

The `server-js` conversion CLI uses raw source inputs so reuse precedes
compiler-dependent parsing. Existing CLI output files still require
`--overwrite`, including cache hits; that flag permits replacement, not forced
regeneration. Preserve sidecars when copying or caching build outputs.

Writers use exclusive output-specific locks and sibling staging files, compile
before replacement and roll back caught publication failures. Two filesystem
renames cannot publish the asset/manifest pair atomically. An interrupted writer
can leave a lock or mismatched pair; recover explicitly from retained known-good
files rather than deleting evidence and silently rebuilding unchanged inputs.

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
type directly. Ordinary calls and snapshot construction reject nonfinite numbers even in unused state and
normalize negative zero without mutating caller data. Rust strings/maps/arrays
provide Unicode, own-key and dense-array guarantees without JavaScript objects.

### Compatibility, errors and memory

- The artifact envelope identifies `format: "fast-server-native"` and semantic schema
  version 1. Experimental layouts require regeneration. It contains no compiler
  fingerprint or JavaScript helper-build version. Native loading accepts supported schemas and validates
  their complete operations/references. Source, manifest and lockfile changes
  do not invalidate an otherwise supported artifact.
- Load validates every opcode, operand shape, static value, component reference,
  template reference and envelope field, including unreachable bodies. It resolves
  names to private body indices once at load time and never parses
  HTML or expression text. Malformed JSON/deep JSON and artifacts over 64 MiB
  fail; condition/static-value trees have additional 64-level schema bounds.
  Artifacts accept at most one million bodies and one million total body operations.
  The compiler validates native output with the same loader before returning it.
- `CompiledArtifact` owns immutable reference-counted storage, is `Send + Sync`,
  and supports cheap clones across worker threads. Input artifact bytes, authored
  sources and locators can be released after load. The application owns atomic
  activation and keeps older clones alive for in-flight requests.
- Each ordinary render validates/normalizes and copies the request state (64 nesting
  levels, at most one million values), and owns transient overlays, loops,
  hydration counters and the returned `String`. State must not be mutated
  concurrently. This is not a zero-copy claim; peak memory includes the loaded
  JSON IR, request state/overlays, attribute intermediates and full output.
  Caller input sizes and deployment concurrency still need application limits.
  Allocations use Rust's allocator; allocation exhaustion follows the host
  allocator's policy (which may abort), not a portable recoverable OOM guarantee.
- Escaped text bindings append unchanged UTF-8 spans and entities directly to
  the bounded output string, without first allocating the full escaped value.
  Each write checks the byte budget; a failure discards private partial output.
  Entity spellings, execution-step counts and error categories are unchanged.
  No output buffer or request-sized scratch pool is retained across requests.
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
workload. JS flat plans expose no FAST state-depth/node, body-depth, step or output
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

Supported execution schemas establish artifact compatibility, not compiler
fingerprints or package versions. Libraries must retain supported published
decoders so existing assets survive compiler-only upgrades. Unknown versions
must fail rather than being silently reinterpreted. Do not edit schema fields
to bypass validation.

Load/validate replacement artifacts before application-owned atomic activation.
Reject incompatible candidates without replacing the active program, and keep
old `CompiledArtifact` clones for in-flight requests. With a native-library upgrade,
old workers finish using their existing library/handles while new workers load
supported artifacts, reusing unchanged assets. Rust handles are not transferable across
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
JSON parsing. Normal FAST Element fixture builds use flat-plan output, so the existing
browser suite exercises hydration and reactive updates against generated output.
The content-binding fixture additionally pauses component registration, checks
the browser-parsed server DOM, and verifies that hydration retains the same
shadow root, bound text node and unescaped-content element. Its reactive update
checks literal Unicode, HTML-significant characters and whitespace without
turning the text into elements.

`cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml` also executes
the original rendering assertion corpus through loaded native artifacts and
generated JavaScript, preserving its expected bytes. `native_artifacts.rs` adds
entry/template/host/shadow conformance, both marker formats, DSD all/none/subsets,
nested/repeated components, coercion/escaping, invalid state/artifacts, recursion
and concurrent reuse. `node --test packages/fast-build/test/native-artifact.test.js`
deploys actual Node/WASM-compiled bytes to workspace and verified Cargo-packaged
native examples with no JavaScript engine on their executable search path.
It also verifies that changing the packaged authored manifest rebuilds the host
and can still load the original supported artifact. Neither backend regenerates its own
expected-output oracle. Native performance is not claimed by the
JavaScript measurements below.

Run the flat-plan benchmark from the repository root after building:

```sh
npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200 --output=server-results.json
```

The `deepPaths` workload covers nested object paths, numeric array access and
array length. `nestedRepeats` covers three active lexical aliases, `$index` and
root lookup across nested iterations. These supplement the existing static,
host, binding, repeated-component, nested-component and large-state workloads.
In default `plain` mode, all supplied state is validated per render; these are
complete render measurements, not lookup-only microbenchmarks. GC observations and memory
snapshots are allocation indicators, not exact allocated-byte totals.
`escapedBindings` adds dense escaping of all five special characters in Unicode
text and attributes. It helps expose allocation and UTF-8 materialization costs.

### Comparable input/output boundaries

Reports identify `executionTarget: "flat-plan-javascript"`; these are synchronous
loaded-plan calls, not native Rust rendering. Parent and worker records
include `renderOptions`. Defaults remain v3 markers, `camelCase` attribute naming
and DSD for all components. Select the other supported marker/naming contracts
without changing renderer behavior:

```sh
npm run bench:server -w @microsoft/fast-build -- --markers-v2 --attribute-name-strategy=none
```

`--attribute-name-strategy` accepts `camelCase` or `none`; `--markers-v2` selects
indexed markers. Compare identical options, templates, parsed state and state
mode. Every worker reports `stateJsonBytes` and `stateJsonHash` for the state-only
JSON text; the parent verifies its hash against the fixture. The existing
`inputParseMs` instead parses the entire fixture file, including templates and
entry markup, and is **not** per-request state parsing.

| Request input -> result | Complete warm boundary |
|---|---|
| Already-parsed JSON-shaped object -> JS string | `warmMsPerRender`: validation and rendering |
| Already-parsed JSON-shaped object -> UTF-8 Buffer | `warmUtf8MsPerRender`: validation, rendering, string materialization and encoding |
| JSON text -> UTF-8 Buffer | `warmJsonUtf8MsPerRender`: state-only `JSON.parse`, validation, rendering, materialization and encoding |
| Reused prepared handle -> string/Buffer | Existing string/UTF-8 fields in `prepared` mode; preparation is paid separately |

JSON-to-UTF-8 measurements run after the object-input loops, with their own
`--warmup` calls and output checks outside timers. `jsonUtf8WarmupMs` reports that
warmup; `warmJsonUtf8CpuMsPerRender` reports measured-loop CPU. Fresh-preparation
mode includes preparation on every JSON request. Reused-prepared mode omits JSON
timings/throughput rather than pretending a cached handle represents fresh input.
All JSON inputs come from this benchmark's JSON fixture corpus; this is not a
recommendation to serialize arbitrary caller objects to bypass state rejection.

`stateSerializeMs` measures one state-only `JSON.stringify` outside these loops.
It is a setup observation, not a warm per-request serialization average. If
another object-input API serializes/parses internally, retain that work inside
its object-to-result timer; do not compare a string-returning call against a
Buffer-returning call or subtract that API's conversion work. File I/O, fixture
generation, compilation, import and browser bundling are not warm requests.

`warmStringBytesPerSecond`, `warmUtf8BytesPerSecond` and, when applicable,
`warmJsonUtf8BytesPerSecond` divide delivered output bytes by the matching mean
wall time in seconds. Zero-duration timers yield `null`, not infinite throughput.
String-only throughput uses the output's logical UTF-8 size but does not measure
encoding. Report latency **and** byte counts/rates: extra output can increase
bytes/second without improving equivalent application work.

`coldImportToUtf8Ms` sums import, one-time preparation (if reused), first rendering
and first encoding. It includes preparation exactly once in all modes. This is a
sum of isolated phases, not contiguous request latency, and excludes process/input
loading, fixture serialization, forced GC and file writing. Do not add it to its
constituent timings or to `coldImportAndRenderMs`.

### Qualifying output differences

Each sample retains its exact UTF-8 hash and byte count. `outputStructure`
contains lexical counts of benchmark custom-element hosts, binding/repeat
markers, attribute-marker attributes and DSD roots. These counts help locate
extra markup; they are not an HTML parser, general element counts or proof of
semantic/hydration equivalence. Text or raw HTML that resembles markup can
contribute matches. Cross-mode/sample hashes only establish byte consistency
within this backend; independent frozen baseline tests detect contract changes.

For comparisons with another renderer, retain both original outputs and their
backend-specific frozen byte contracts. Investigate DSD attributes/selection,
host defaults, binding/repeat marker placement, escaping, whitespace, missing
values and state coercion before interpreting a latency ratio. Do not strip
markers, reserialize HTML or change a public renderer's bytes to force equality.
Use browser-parsed attributes/text and actual FAST hydration/reactive updates to
qualify semantics independently. The server corpus covers both marker formats,
host/naming/DSD options and coercion; browser fixtures cover the active client
hydration contract. Passing those gates does not itself qualify another
renderer's output. No cross-renderer speedup is claimed by this benchmark.

### State reuse and phase reporting

To compare ordinary rendering, snapshot reuse and fresh preparation:

```sh
npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200 --state-mode=all
```

`--state-mode` defaults to `plain`; other values are `prepared`,
`prepare-per-render` and `all`. Reports retain version 2 and add `stateModes`.
Workload `modes` keys are `flatPlan`, `flatPlanPrepared` and `flatPlanPreparePerRender`.
Each sample/mode uses a separate fresh child; mode order alternates by sample.
Hashes match across modes and an untimed ordinary call verifies prepared output.
The original input remains live for that comparison.

Reused mode reports `prepareStateMs` before the first render, plus
`memoryBeforePrepare` and `memoryAfterPrepare` around forced GC outside that
timer. Its `firstRenderMs` and `coldImportAndRenderMs` exclude preparation:
add `prepareStateMs` when comparing total cold setup. Fresh-preparation mode
includes preparation in each render timer. Approximate warm-rate reuse crossover
is `ceil(prepareStateMs / (plainWarmMs - preparedWarmMs))` only if savings are
positive; it excludes cold-render differences and is not a latency guarantee.
Memory deltas include VM/GC effects and retained source plus snapshot, not exact
snapshot allocation counts. Small or render-dominated state may not benefit.

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
| `stateSerializeMs` | State-only JSON serialization, outside request loops |
| `moduleImportMs` | Generated module and server-helper import |
| `firstRenderMs` | First synchronous render call only; includes any V8 lazy compilation on first use |
| `coldImportAndRenderMs` | Sum of module import and first render, not startup or request-fixture loading |
| `coldImportToUtf8Ms` | Sum of import, one-time preparation if applicable, first render and encoding |
| `utf8EncodeMs`, `outputWriteMs` | First result's string materialization/UTF-8 Buffer conversion and local file open/write/close |
| `warmupMs`, `warmupIterations` | Explicit untimed-for-throughput warmup, default 20 calls; configure with `--warmup=N`, including zero |
| `warmMsPerRender`, `cpuMsPerRender` | Average wall/CPU time for `--iterations=N` warm synchronous render calls |
| `warmUtf8MsPerRender`, `warmUtf8CpuMsPerRender` | Average wall/CPU time for a subsequent `--iterations=N` loop rendering and converting each result into a UTF-8 Buffer; no file writing |
| `warmJsonUtf8MsPerRender`, `warmJsonUtf8CpuMsPerRender` | Average wall/CPU time for a separately warmed state-JSON-parse/render/UTF-8 loop; absent for reused snapshots |
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

The additional warm UTF-8 loop runs after string-only timing and its memory/GC
observations. Its time includes rendering, string flattening and Buffer creation;
do not add it to string-only render time. Its final UTF-8 output hash is checked
outside the timer. These additive fields retain report version 2. Compare the
same boundary on the same host/runtime; faster string assembly alone does not
establish faster UTF-8 delivery.

The report retains process memory before/after forced GC, observed GC
events/duration, generated bytes and shared helper/compiler-WASM size. GC counts
include only observed events starting in the measured warm loop, not the
explicit collections around it. Memory snapshots retain the cold and latest
warm strings; they are not exact allocated-byte counts. Heap metrics do not
represent total WASM allocation; RSS includes native memory. Generated source
size is not a minified/bundled-size claim.
State-only serialized JSON is now also retained across the measured loops; take
that additional live input into account when comparing historical memory reports.
The string-loop memory/GC observations do not cover the later UTF-8/JSON loops.

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
