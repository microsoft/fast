# Migrating from previous versions

## AOT fixture generation

`createSSRRenderer(options)` still returns `{ render }`, but `render(query)`
now returns `Promise<RenderResult>` instead of `RenderResult`:

```ts
const { render } = createSSRRenderer(options);
const result = await render(query);
```

The harness server already awaits fixture rendering; entry-server modules can
continue re-exporting `render`. Direct callers must await it.
Fixture generation compiles authored HTML to JavaScript and then imports and
executes that module. The build-time Rust/WASM parser/compiler remains required.
It no longer invokes request-time WASM rendering or injects shadow roots with
a post-render regular-expression pass.

This is development tooling for dynamically authored fixtures. Production SSR
should compile during the build and import generated modules, or load compiled
artifacts in the supported native Rust host, as described in
the [fast-build migration](../../../fast-build/docs/migration/aot-server-rendering.md).
The harness itself continues to use generated JavaScript; native Rust support
does not add a C ABI or working .NET binding.
