# Native server artifacts

The build-time compiler produces UTF-8 JSON template data for the required shared
Rust executor. Node applications automatically load an installed platform Node-API
addon or explicitly select a custom addon; Rust applications load the same
artifact bytes directly.

## Compilation and execution

`compileServerArtifact(entry, templates?)` and
`writeServerArtifact(outputPath, inputs, options?)` are exported from
`@microsoft/fast-build/server.js`. They load compiler WASM only at build time.
Definitions accept strings or `ServerTemplateDefinition` metadata with content,
host/shadow attributes and optional format version 1.

`fast convert --syntax=server-native --templates="components/**/*.html"`
links a named registry into `server.artifact.json`, with an empty entry. Call named host
or shadow methods for that registry; compile entry HTML for complete pages.
Duplicate names, empty registries, wildcard output paths and browser TypeScript
conversion options are rejected.

## Node request contract

Call `loadNativeHost()` from `@microsoft/fast-build/native-host.mjs` to resolve the
installed platform package. Pass `loadNativeHost(addonPath)` for an explicit custom
addon. Construct a program with an artifact Buffer and optional `NativeHostOptions`.
Use `renderEntryJson(state)`, `renderTemplateJson(state)`,
`renderHostJson(name, state)` or `renderShadowJson(name, state)`.
All accept required unshared UTF-8 JSON Buffers and return independently owned
UTF-8 Buffers synchronously. Decode output explicitly for string consumers.

Options are copied/validated at construction: `markersV2` defaults false,
`attributeNameStrategy` defaults `"camelCase"`, omitted `dsd` selects all
registered definitions, and an empty list selects none. `maxOutputBytes` and
`maxSteps` select per-request limits. Mutating caller options does not change
the program. Unknown fields, accessors, proxies and invalid types fail without
running application getters or serializers.

Strict JSON parsing validates unused fields as well as accessed ones, rejects
nonfinite numbers and malformed Unicode, and normalizes negative zero.
Finite numbers preserve binary64 round trips and decimal output spelling.
Shared artifact/state backing stores and plain Uint8Arrays are rejected before
native reads. Each program owns decoded immutable data; each request owns its
transient state/output. Errors provide native codes, never partial Buffer output.
See the [complete host/deployment contract](./native-node-host.md).

### Stable semantic data

The emitter writes consolidated schema 2:

```json
{
    "format": "fast-server-native",
    "version": 2,
    "inputs": {
        "entry": "<p>{{label}}</p>",
        "templates": {}
    },
    "program": {
        "entry": [
            { "type": "literal", "html": "<p>" },
            { "type": "binding", "path": ["label"], "escape": true },
            { "type": "literal", "html": "</p>" }
        ],
        "templates": {},
        "components": {}
    }
}
```

The format name stays `fast-server-native`; the version identifies the envelope.
Published schema-1 programs remain loadable. Schema 2 embeds canonical build inputs
as `{ entry, templates }` or `{ entry, templateSources }`. The runtime validates
their envelope shape but never compiles them, and discards them before decoding
`program`. Authored source therefore ships with the artifact and increases loading
I/O, JSON parsing and peak memory, not request-time work.

Native hosts load serialized bytes through `CompiledArtifact::load` or the Node facade.

`program.entry` is an ordered list of operations. `templates` maps opaque names to other
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

## Persistent artifact ownership

`writeServerArtifact` accepts `{ entry, templates }` or
`{ entry, templateSources }`. Raw sources must contain unique named definitions.
Canonical registry names/source texts are sorted; duplicate source texts remain
significant. Exact whitespace, line endings and ordered attributes matter.
Derived binding/source-location data and file paths are not compilation keys.

One `fast-server-native` schema-2 file stores `inputs` and `program`. There is
no sidecar or Base64 output snapshot. Matching embedded inputs retain exact existing
bytes/timestamps without compiler loading. A missing artifact must be recompiled.

Changed inputs require overwrite permission. Malformed envelopes and unsupported
versions fail closed, even with overwrite permission; clean invalid files explicitly.
The native loader validates executable operations before use. Build reuse does not
recompile or independently prove that a valid edited program matches its inputs.
Treat the complete artifact as trusted build output, not an integrity certificate.
`includeBytes: true` returns owned bytes captured while the output lock is held,
including on hits. Render those bytes rather than reopening a replaceable path.

Exclusive locks and flushed sibling staging publish through a single atomic rename.
Caught staging/rename failures leave the old file untouched and remove owned temporary
files. A stale lock after process interruption requires application-owned recovery.
`--overwrite` grants replacement permission; it does not force regeneration.

`fast build --server-artifact=generated/page.artifact.json` uses that writer and renders
fresh original state-file bytes on every invocation. It automatically resolves the
platform package unless `--native-addon`, configured `native-addon`, or
`FAST_NATIVE_ADDON` overrides it. State, output paths and render
options do not change compilation identity. Artifact/lock paths cannot
replace authored files or output HTML. Omitted state is `{}`.

## Native Rust artifact target

At build time, call Rust `compile_server_artifact(entry, &locator)` or Node
`compileServerArtifact(entry, templates)`. Persist UTF-8 JSON bytes alongside the
deployment. The compiler eagerly validates semantic operations and references.
Loading is execution-only: it does not parse authored HTML, compile templates or
evaluate code.

```rust
use microsoft_fast_build::{CompiledArtifact, NativeRenderOptions, parse_render_state};

// Server startup: compiled bytes, not authored templates.
let program = CompiledArtifact::load(&std::fs::read("generated/server.artifact.json")?)?;
// Each request:
let state = parse_render_state(r#"{"title":"Native request"}"#)?;
let html = program.render_entry(&state, &NativeRenderOptions::default())?;
```

Native APIs are `render_entry(state, options)`, `render_template(state, options)`,
`render_host(name, state, options)` and `render_shadow(name, state, options)`.
They select entry, template-context, complete named-host and resolved-state DSD-fragment semantics. `NativeRenderOptions` uses `markers_v2`,
`attribute_name_strategy: AttributeNameStrategy::{CamelCase,None}` and
`dsd: Option<Vec<String>>` (`None` all, `Some(vec![])` none).
There is no implicit state; pass an empty object when appropriate.
`parse_render_state` validates request JSON, or construct the public `JsonValue`
type directly. Ordinary calls and snapshot construction reject nonfinite numbers even in unused state and
normalize negative zero without mutating caller data. Rust strings/maps/arrays
provide Unicode, own-key and dense-array guarantees without JavaScript objects.

### Compatibility, errors and memory

- The artifact envelope identifies `format: "fast-server-native"` and semantic schema
  version 2. Published schema-1 programs also remain supported. It contains no compiler
  fingerprint or backend build identifier. Native loading accepts supported schemas and validates
  their complete operations/references. Source and lockfile changes
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
  concurrently. This is not a zero-copy claim; request peak memory includes the
  typed artifact plan, request state/overlays, attribute intermediates and full output.
  Caller input sizes and deployment concurrency still need application limits.
  Allocations use Rust's allocator; allocation exhaustion follows the host
  allocator's policy (which may abort), not a portable recoverable OOM guarantee.
- After complete eager validation, loading replaces transient JSON with immutable
  typed operations, numeric component/body references, prepared path indices and
  decoded static operands. No second raw instruction graph or emission-only numeric
  spelling metadata is retained. Loading temporarily holds JSON plus the typed plan;
  include that peak in memory accounting, not just warmed rendering. Native plans retain no source-generation reconstruction path.
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

Rust and Node hosts use this executor. No stable C ABI, unmanaged
allocation/error ownership convention, .NET binding or working C# host is
provided. Those are follow-up integration work over this Rust executor, not a
separate C# implementation of HTML/expression semantics.

### Target resource contracts

Native hosts enforce these public resource bounds:

| Resource | Native contract |
|---|---|
| State nesting | Root depth is zero; depth 64 is accepted and depth 65 is rejected, including unused state |
| State values | At most 1,000,000 values, counting the root and every array item/object value, but not object keys |
| Body nesting | Root body depth is zero; 128 nested calls are accepted and the next fails |
| Execution steps | Default 1,000,000; `max_steps` counts body operations, attribute recipes and repeat iterations |
| Output | Default 64 MiB; `max_output_bytes` counts UTF-8 bytes, not characters |

Configured step/output limits are inclusive; exceeding a limit returns
`render-limit` without partial output. State-limit failures return `invalid-state`.
Budgets reset on each call, including after errors. Workload qualification must include these bounds, not only successful HTML snapshots.
Tightening defaults, rejecting previously accepted state, or changing normalization
or coercion is a consumer compatibility change even if ordinary snapshots match.

### Prepared-state snapshots

Rust hosts can reuse unchanged state through `PreparedState::new(&state)` or
`PreparedState::from_json(json)`. The four `render_*_prepared` methods borrow the
validated immutable snapshot. Handles are artifact-independent, `Send + Sync`,
cheaply cloned and freed after the last owner drops. Budgets remain request-local.

### Fresh native JSON requests

For fresh JSON state, use `render_entry_json(json, options)`. Matching
`render_template_json(json, options)`, `render_host_json(name, json, options)`
and `render_shadow_json(name, json, options)` methods use the same executor.
Typed methods validate/normalize a copy; prepared methods borrow immutable snapshots.

Fresh JSON is deserialized directly into owned request storage, with finite-number
and negative-zero normalization, rather than converting a generic serde value and
copying a normalized snapshot. The entire JSON document is still parsed and
validated, including unused values and overwritten duplicate keys. Depth/node
budgets count only the final retained tree (last duplicate key wins), using a
nonallocating validation traversal after parsing. Malformed JSON, invalid Unicode
and overflowing numbers precede state-budget/lookup/execution errors as before.

The single native executor borrows resolved values, repeat collections/items,
stack-linked lexical frames, parent bases and direct child properties. Synthetic
array lengths and transformed dataset merges can own values; merge mutation uses
copy-on-write. Alias precedence, own-null masking, DSD scope resets and caller
light-DOM scope are unchanged. References remain request-local and bounded by
existing recursion limits. No request-key cache, weak hashing, unsafe lifetime
extension, retained scratch storage or new public crate is involved. Outputs and
errors remain complete independently owned values. This is not a zero-allocation
claim. Node hosting delegates to these fresh-JSON methods.

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

From the repository root, build and run the actual native backend:

```sh
npm run build -w @microsoft/fast-build
npm run test:node -w @microsoft/fast-build
FAST_NATIVE_ADDON="$PWD/crates/microsoft-fast-build/target/node-host/fast-build.node" npm run bench:server -w @microsoft/fast-build -- --samples=3 --iterations=100 --instances=200
```

The benchmark runs fresh child processes with compile caches disabled. It measures
compiler load/compilation, input setup, artifact reading, addon/program loading,
first rendering, explicit warmup and warm JSON Buffer-to-owned-Buffer rendering.
String-consumer samples decode each output inside the timed boundary. Output
hash/structure checks and file writing are outside render timers. Report version
3 includes CPU, observed warm-loop GC, memory and artifact/addon/WASM sizes.
`--profile-directory` retains optional per-worker CPU profiles.

Keep authored fixtures, state, marker/naming policy, warmup and request/output
boundaries equal when comparing implementations. Include required encoding and
decoding, not just a faster inner loop. Report source revisions, toolchain,
platform, sample order and shared-machine uncertainty. Frozen bytes and browser
hydration/node-identity checks are independent of timing; do not normalize away
output differences. Constructor/load and warm costs answer different questions.

For release deployment/regeneration requirements, see the [migration index](./migration.md).
