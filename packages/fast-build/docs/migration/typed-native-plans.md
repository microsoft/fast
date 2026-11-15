# Typed native plan upgrade

This minor prerelease update replaces only the native artifact's in-memory
instruction layout. No public Rust/Node API, native wire schema, JS flat-plan
schema or helper contract is removed or changed.

## Existing assets and application migration

- Keep existing `fast-server-native` and `fast-server-js` semantic schema-1 assets
  unchanged. Their decoders remain supported; do not recompile them merely because
  the compiler/library changed.
- Retain managed assets and their `.inputs.json` sidecars. No compiler key, hash
  or blanket regeneration requirement is introduced. Persistent writers still
  reuse exact old bytes before compiler loading.
- `CompiledArtifact::emit_server_module` remains supported. It reconstructs the
  compiler-owned serialized IR only for build-time emission, including original
  numeric spellings, then drops it. A loaded artifact retains typed operations,
  not both raw and typed graphs.
- All ordinary/prepared entry, template, host and shadow APIs retain their state,
  output and error ownership. Immutable artifacts remain `Send + Sync`; cloned
  artifacts share storage and requests retain independent counters and overlays.
- No new generated named exports are introduced by this change. Do not rewrite
  cached modules to obtain exports added by other changes; newly compiled output
  at an explicitly selected destination is required when old modules lack them.
- Unsupported older schemas still fail explicitly. Earlier source-renderer
  migrations in [the historical guide](./aot-server-rendering.md) are separate
  and are not instructions to regenerate supported semantic schema-1 assets.

## Load, memory and dispatch qualification

Loading parses semantic named operations, templates and single component DSD
references, derives bounded private indexed IR, and eagerly validates all records,
unreachable references and static trees before preparing operations.
It resolves element names to numeric component
indices, predecodes array indices and static values, and drops parsed JSON.
Peak load memory includes semantic decoding/private IR expansion and the overlap
between private JSON IR and typed operations. Retained storage
includes typed vectors/boxes, path strings/index metadata, shared component names,
decoded static values and their numeric-spelling leaf metadata. JS emission adds a
temporary reconstructed graph, emitter tables and source; it is not a free
property of retained native storage.

This candidate intentionally preserves full request validation/copying, cloned
lookup/repeat values, owned child overlays, composite attribute scalar lists and the
existing bounded output string. It keeps direct bounded text/attribute/scalar writing
from the merged output optimization. It does not adopt borrowed-state or output-planning
experiments. Every body operation, attribute/default/property recipe and repeat
iteration retains its prior logical step charge, depth/output bounds and error
precedence.

Performance measurement awaits the coordinator's serialized measurement slot on a
potentially shared machine. Compare identical semantic schema-1 bytes/options and
frozen output hashes against pinned main.
Separate `CompiledArtifact::load`, retained/peak allocations, first render,
`parse_render_state` plus ordinary render, already-parsed ordinary render and
prepared rendering; account for on-demand emission separately.
The existing contributor workload names `largeStaticTemplates`, `deepPaths`,
`nestedRepeats`, `repeated`, `nested` and `static` describe suitable dispatch controls,
but `bench:server` measures JS, not native rendering. A native harness must call
the Rust APIs directly or use the existing `native-render` example for end-to-end
deployment checks; process-per-request timing is not warmed native execution.
No speedup or retained-memory improvement is claimed without those measurements.
