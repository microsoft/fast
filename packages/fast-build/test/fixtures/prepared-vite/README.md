# Executable prepared Vite integration

Run from the repository root, after building `@microsoft/fast-build`:

```sh
node --test packages/fast-build/test/prepared-vite.test.js
```

`siteConfig(root)` configures an application-owned Vite plugin. `build(config)`
emits `output/server.mjs` and server-only `output/prepared/` assets. Deploy them
together, retaining the same installed `@microsoft/fast-build` compiler build:

```js
const { openSite } = await import("./output/server.mjs");
const { runtime } = await openSite();
try {
    const home = await runtime.render("home", { title: "Hello" });
    const account = await runtime.render("account", { title: "Account" });
    const shadow = await runtime.renderShadowRoot("demo-card", { title: "Fragment" });
} finally {
    await runtime.dispose();
}
```

The two entries share one runtime and cache. The preceding Vite transform replaces
`__BUILD_LABEL__` before compilation; artifacts do not accidentally compile raw
authored files. The server bundle resolves its assets relative to `import.meta.url`,
so the whole output directory can move without retaining HTML sources. The runtime
is externalized, never bundled into the minimal client entry, and never recompiles
missing, corrupt, or compiler-incompatible production artifacts.

In development, `await plugin.api.prepare()` initializes the shared runtime using
Vite's transform pipeline. Vite's `handleHotUpdate` lifecycle compiles replacements,
stores **all** content-addressed bytes, then atomically activates the new manifest.
Overlapping updates run in a single queue, and failed updates do not poison that
queue. Shutdown rejects new updates, drains accepted transforms and activations,
then disposes the runtime and clears retained bytes.
Failed preprocessing or compilation leaves the previous generation active. The
fixture preprocessing step rejects the explicit `__BUILD_ERROR__` token. Old bytes remain until
their snapshot handles report `drained`, including requests blocked in loading.
The application store removes only IDs not referenced by any current or undrained
snapshot; shared IDs and A-to-B-to-A activations remain safe. Repeated completed
edits therefore do not accumulate every old generation. `closeBundle`
awaits runtime disposal before releasing remaining bytes. There is no FAST watcher in
addition to Vite's watcher. Tests invoke that lifecycle directly with deferred
artifact loads, avoiding filesystem-watcher races.

This is deliberately a small integration example, not a general-purpose published
Vite plugin. Compilation uses generic `compileArtifacts(sources, { previous })`
reuse and the last successful complete result; FAST owns validation, identity
invalidation and candidate assembly. Retirement uses generic `runtime.snapshot`
handles, not Vite transform timing or duplicate per-request lifetime tracking.
The public APIs and native loading behavior contain no Vite-specific logic.
