# Native fixture deployment

SSR fixtures require a source-built FAST Node addon for the deployment platform.
Build it from matching reviewed FAST sources and configure `nativeAddonPath`
in `createSSRRenderer` or set the absolute `FAST_NATIVE_ADDON` environment path.
See the [source-build guide](../../../fast-build/docs/native-node-host.md).

Keep the build-time compiler package installed. Fixture rendering compiles dynamic
test HTML to native artifacts and passes JSON Buffers to the shared Rust executor.
Await `render(query)`; setup, compilation and execution failures propagate.
Qualify state depth/node and execution/output budgets with your fixture workload.
No native binary is downloaded automatically.
