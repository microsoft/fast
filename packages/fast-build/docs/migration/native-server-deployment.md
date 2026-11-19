# Native server deployment

This publish requires native server rendering and is intentionally breaking in the
minor prerelease line. Prepare a clean application build and regenerate every
template artifact with the new compiler version.

1. Install `@microsoft/fast-build` with optional dependencies enabled on the
   deployment target. Supported targets use an exact-version prebuilt platform
   package and need no Rust installation. For unsupported targets or custom
   toolchains, explicitly provision an addon from the matching reviewed source
   revision; see the hosting guide.
2. Clean the application-owned generated artifacts in the build output. Generate
   `server.artifact.json` with `writeServerArtifact` or `compileServerArtifact`;
   registry-only CLI conversion uses `server-native`. The compiler emits schema 2,
   consolidating authored `inputs` and compiled `program` in one file. No sidecar or
   Base64 snapshot is needed. Missing artifacts recompile; valid edited programs are
   not independently compared against their authored source. Overwrite permission
   alone does not force regeneration of matching embedded inputs.
3. Use `loadNativeHost()` for automatic platform-package resolution; the CLI also
   uses it when no override is configured. Existing explicit `loadNativeHost(path)`,
   CLI `--native-addon` and `FAST_NATIVE_ADDON` overrides remain available.
   Construct each program with artifact bytes and fixed marker/naming/DSD/output/step
   policies. No runtime download, source compilation or backend fallback occurs.
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
[native hosting guide](../native-node-host.md).
