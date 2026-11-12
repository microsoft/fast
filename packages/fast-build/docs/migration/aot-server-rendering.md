# Migrating from previous versions

## Request-time source rendering to compiled server targets

This prerelease makes a breaking replacement of the previous renderer.
It is classified as a **minor prerelease release, not a drop-in upgrade**.
Updating the dependency alone is insufficient: migrate removed public APIs,
normalize accepted state, await harness rendering, and regenerate compiled output.
One compiler-owned representation now supports generated JavaScript and native
Rust artifact execution. The converter crate remains build-time tooling.
Rendered HTML, coercion, escaping,
whitespace, host attributes and hydration markers remain unchanged.

| Removed API | Replacement |
|---|---|
| WASM `render_entry_with_templates` | Compile an entry and import its `renderEntry` |
| WASM `render`, `render_with_templates` | Generated `renderTemplate`, preserving template-context root host attributes |
| WASM `render_shadow_root` | Generated `renderShadow(name, componentState, options)` |
| Native Rust source `render*` functions | Build `compile_server_artifact`, load `CompiledArtifact`, call its render methods |
| Rust `RenderConfig`, `DsdSelection` | `NativeRenderOptions`; `dsd: None` all / `Some(vec![])` none |
| Old Rust `AttributeNameStrategy` configuration | Typed `NativeRenderOptions::attribute_name_strategy` |
| `PreparedCompiler`, `PreparedPiece`, `PreparedProgram` | Build-time `compileServerModule` or Rust `compile_server_module` |
| `prepared.js`, including preparation/loading/cache/watch/activation APIs | Application-owned build pipeline and generated ESM imports |
| Prepared manifest/piece formats and compiler identity exports | Recompile authored sources to ESM or new executable artifacts; formats are not interchangeable |
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
For Rust build-time ESM generation, build a `Locator` and call
`compile_server_module(entry, &locator, runtime_import)`.

### Native-only migration

Native applications do **not** need a JavaScript execution environment:

1. Move source loading/composition into the build and call
   `compile_server_artifact(entry, &locator)` (Rust), or `compileServerArtifact`
   from `server.js` (Node/WASM build tooling).
2. Deploy the bytes and exact compiler-matching `microsoft-fast-build` native
   library together. Load once with `CompiledArtifact::load`.
3. Pass request `JsonValue` state and `NativeRenderOptions` to `render_entry`,
   `render_template`, `render_host` or `render_shadow`.
4. Share immutable artifact clones across worker threads. Keep retired program
   clones alive for in-flight requests during deployment activation.

The artifact fingerprint must match the deployed native library exactly, even
when package versions match. Validate/load replacements before activating them;
an incompatible candidate must not replace the active program. For library
upgrades, let old workers finish with their loaded handles and deploy new workers
with newly generated matching artifacts. Do not patch artifact identity fields
or transfer Rust handles across library versions/processes.

Loading and rendering never reparse authored HTML or execute JavaScript. The
new artifact contains shared compiler-owned executable operations, not the old
prepared source metadata. Old prepared artifacts must be rebuilt from source.
Options retain DSD and both marker formats. Errors are recoverable typed values,
with validation and recursion/step/output bounds; see the complete
[native contract](../server-modules.md#native-rust-artifact-target).
Native Rust is supported now. Stable C ABI/.NET hosting and its unmanaged
ownership/error contract are deferred, not claimed as working in this release;
no separate C# rendering semantic implementation is introduced.

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

Native and JS targets share rendering semantics, not identical workload limits.
Native state is limited to depth 64 (root depth zero) and one million values
including the root; execution also bounds nested body calls, steps and UTF-8 output
bytes. JS AOT exposes no equivalent FAST budgets and remains subject to its host's
stack/memory limits. Check workload acceptance when switching targets; see the
[target resource contracts](../server-modules.md#target-resource-contracts).
Future tighter defaults, state rejection or normalization/coercion changes can
require an API migration even when ordinary HTML snapshots remain identical.

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
