# Migrating to execution-only typed native plans

This update replaces the native artifact's in-memory instruction layout and makes
loaded native artifacts execution-only. **Breaking Rust API change:**
`CompiledArtifact::emit_server_module` is removed. Native rendering APIs, Node APIs,
supported artifact schemas and the JavaScript helper contract are unchanged.

## Replace native-to-JavaScript conversion

Before, JavaScript could be generated from a loaded native artifact:

```rust
let bytes = compile_server_artifact(entry, &locator)?;
let artifact = CompiledArtifact::load(&bytes)?;
let javascript = artifact.emit_server_module(runtime_import);
```

After, generate JavaScript directly through the existing build-time compiler:

```rust
let javascript = compile_server_module(entry, &locator, runtime_import)?;
```

The replacement requires the original authored templates and locator; it does not
convert retained native artifact bytes. If your deployment needs both targets,
generate and persist both outputs during the application build. Consumers holding
only a native artifact must recover the authored build inputs to use the compiler.
The native loader and renderer do not retain a conversion fallback.

## Existing assets and application migration

- Keep existing `fast-server-native` and `fast-server-js` semantic schema-1 assets
  unchanged. Their decoders remain supported; do not recompile them merely because
  the compiler/library changed.
- Retain managed assets and their `.inputs.json` sidecars. No compiler key, hash
  or blanket regeneration requirement is introduced. Persistent writers still
  reuse exact old bytes before compiler loading.
- A loaded artifact retains typed operations, not both raw and typed graphs.
  IR-reconstruction code and original numeric spellings needed only by the removed
  JavaScript-generation method are eliminated.
- All ordinary/prepared entry, template, host and shadow APIs retain their state,
  output and error ownership. Immutable artifacts remain `Send + Sync`; cloned
  artifacts share storage and requests retain independent counters and overlays.
- No new generated named exports are introduced by this change. Do not rewrite
  cached modules to obtain exports added by other changes; newly compiled output
  at an explicitly selected destination is required when old modules lack them.
- Unsupported older schemas still fail explicitly; this does not require
  regenerating supported semantic schema-1 assets.

## Load, memory and dispatch qualification

Loading parses semantic named operations, templates and single component DSD
references, derives bounded private indexed IR, and eagerly validates all records,
unreachable references and static trees before preparing operations.
It resolves element names to numeric component
indices, predecodes array indices and static values, and drops parsed JSON.
Peak load memory includes semantic decoding/private IR expansion and the overlap
between private JSON IR and typed operations. Retained storage
includes typed vectors/boxes, path strings/index metadata, shared component names
and decoded static values. Original numeric-spelling metadata and JavaScript
emission are not properties of retained native storage.

This release includes the borrowed-state executor: ordinary typed input
still validates/copies, fresh JSON parses directly into owned validated state, and
prepared input borrows its snapshot. Lookups, repeat items and direct child
properties borrow request storage; dataset merges remain copy-on-write. Composite
attributes preflight immutable borrowed operands without retaining a scalar list.
The existing bounded output string and direct text/attribute/scalar writing remain
unchanged. Every body operation, attribute/default/property recipe and repeat
iteration retains its prior logical step charge, depth/output bounds and error
precedence.

Compare identical semantic schema-1 bytes/options and
frozen output hashes against pinned main.
Separate `CompiledArtifact::load`, retained/peak allocations, first render,
fresh JSON rendering, already-parsed ordinary render, reused prepared rendering and
preparing a new snapshot per render; use the same boundary on both sides and
account for JavaScript compilation separately.
The existing contributor workload names `largeStaticTemplates`, `deepPaths`,
`nestedRepeats`, `repeated`, `nested` and `static` describe suitable dispatch controls,
but `bench:server` measures JS, not native rendering. A native harness must call
the Rust APIs directly or use the existing `native-render` example for end-to-end
deployment checks; process-per-request timing is not warmed native execution.
No speedup or retained-memory improvement is claimed without those measurements.
