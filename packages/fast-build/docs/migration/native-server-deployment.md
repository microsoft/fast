# Native server deployment

This publish requires native server rendering and is intentionally breaking in the
minor prerelease line. Prepare a clean application build and regenerate every
template artifact with the new compiler version.

1. Source-build the Node addon for each deployment OS/architecture from matching
   reviewed FAST sources. Provision it explicitly; the npm package neither ships
   platform binaries nor downloads them during installation.
2. Clean the application-owned generated artifacts and their `.inputs.json`
   sidecars in the build output. Generate `server.json` with `writeServerArtifact`
   or `compileServerArtifact`; registry-only CLI conversion uses `server-native`.
   Overwrite permission alone does not force regeneration of unchanged inputs.
3. Configure an explicit addon path through `loadNativeHost`, CLI `--native-addon`
   or `FAST_NATIVE_ADDON`. Construct each program with artifact bytes and fixed
   marker/naming/DSD/output/step policies.
4. Supply unshared strict UTF-8 JSON Buffers for requests. Consume owned Buffer
   results directly, or explicitly decode them when the application needs strings.
   Validate arbitrary application objects before application-owned serialization.
5. Qualify state nesting/value counts, body nesting, step/output limits and error
   recovery. Keep exact HTML/hydration fixtures; do not strip markers or normalize
   byte differences. Compare application-matched input/output performance boundaries.
6. Load and validate replacement artifacts before activation. Retain running
   workers and owned results until in-flight requests finish.

Rust hosts use the same artifacts and shared executor through `CompiledArtifact`.
SSR test-harness consumers must configure `nativeAddonPath` or `FAST_NATIVE_ADDON`
and await fixture rendering; failures propagate rather than switching backends.

See the [current artifact contract](../server-modules.md) and
[source-built hosting guide](../native-node-host.md).
