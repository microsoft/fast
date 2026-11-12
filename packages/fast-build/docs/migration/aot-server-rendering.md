# Migrating from previous versions

## Request-time rendering to generated server JavaScript

This prerelease makes a breaking replacement of the previous renderer.
Both Rust crates remain build-time tools. Rendered HTML, coercion, escaping,
whitespace, host attributes and hydration markers remain unchanged.

| Removed API | Replacement |
|---|---|
| WASM `render_entry_with_templates` | Compile an entry and import its `renderEntry` |
| WASM `render`, `render_with_templates` | Generated `renderTemplate`, preserving template-context root host attributes |
| WASM `render_shadow_root` | Generated `renderShadow(name, componentState, options)` |
| Native Rust `render*` functions | Rust `compile_server_module`; execute generated ESM in JavaScript |
| Rust `RenderConfig`, `AttributeNameStrategy`, `DsdSelection` | Generated module's `ServerRenderOptions` |
| `PreparedCompiler`, `PreparedPiece`, `PreparedProgram` | Build-time `compileServerModule` or Rust `compile_server_module` |
| `prepared.js`, including preparation/loading/cache/watch/activation APIs | Application-owned build pipeline and generated ESM imports |
| Prepared manifest/piece formats and compiler identity exports | Recompile authored sources; generated `compilerId` and `runtimeVersion` |
| Stream/chunk-array APIs and `--stream`/`stream` config | Complete synchronous HTML strings |
| `fast build --aot` qualification flag | `fast build` always uses AOT; remove the flag |
| `PreparedTemplateDefinition` | `ServerTemplateDefinition` from `server.js` |

### Build once, render with request state

Use `renderEntry` for previous `render_entry*` functions and `renderTemplate`
for previous non-entry `render*` functions. Their different root-host attribute
contracts remain intact; both exports execute the same generated functions.

```js
// Build pipeline: load/compose templates before compiling.
import { writeFile } from "node:fs/promises";
import { compileServerModule } from "@microsoft/fast-build/server.js";

await writeFile(
    "./generated/server.mjs",
    compileServerModule("<my-card></my-card>", {
        "my-card": "<h2>{{title}}</h2>",
    }),
);
```

```js
// Server: no compiler or WASM import.
import { renderEntry, renderShadow } from "./generated/server.mjs";

const html = renderEntry({ title: "Request-specific state" });
const dsd = renderShadow("my-card", { title: "Component state" });
```

For named files, use `fast convert --syntax=server-js --templates="./components/**/*.html" --output="./generated/server.mjs"`.
For native compilation, build a `Locator` and call
`compile_server_module(entry, &locator, runtime_import)`. The crate does not embed
a JavaScript engine. Native-only applications must provide a JavaScript execution
environment or continue using their previous release until migrated.

Deploy generated modules and compatible `server-runtime.mjs` together; bundle
the helper or install the matching package on the server. Regenerate on upgrades.
Old prepared artifacts cannot be upgraded in place: rebuild from authored inputs.
Applications own watching, dependency invalidation, module caching, atomic
activation, retention for in-flight requests and shutdown. Multiple entries can
be emitted as separate modules sharing the same helper.

### State and options

Pass JSON-shaped values directly, not serialized state strings. Explicitly
normalize dates, classes, accessors and `toJSON`-based models before rendering.
State must be acyclic, with finite numbers, well-formed Unicode, dense arrays
and plain/null-prototype objects containing enumerable own data properties.
Nested `undefined`, functions, symbols and non-enumerable properties are rejected.
No getter or `toJSON` is invoked. Omitted root state becomes `{}`.

Options are `attributeNameStrategy: "camelCase" | "none"`, `markersV2: boolean`
and `dsd: string[]`. Omit `dsd` to select all components; `[]` selects none.
Replace the previous `"all"` sentinel with omission. Fragment callers provide
resolved component state; no synthetic host or caller-owned light DOM is added.

Malformed syntax now fails during compilation, including skipped bodies and
unused registered definitions. Compiler diagnostics retain structured source
coordinates. Runtime invalid state/options throw `TypeError`; non-array repeat
values retain `repeat-not-array` but do not imply authored source coordinates.
Browser authoring, conversion, explicit registration and hydration are unchanged.

### Test harness

The matching test-harness `createSSRRenderer().render(query)` now returns
`Promise<RenderResult>`: use `await render(query)`. Its arbitrary fixture HTML
is compiled on demand as development tooling, not as a production SSR pattern.
See the [server-module contract](../server-modules.md) for all execution details.
