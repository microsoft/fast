# Migrating from previous versions

## Strict CLI template registries

`fast build` rejects duplicate template names and explicit `--templates` selections
that contain no named templates. This applies to fresh and persistent builds.

Replace ordered overrides with one selected definition per name:

```sh
# Before: both files define my-card; the later definition wins.
fast build --entry=index.html --templates="default.html,custom.html"

# After: select the desired definition.
fast build --entry=index.html --templates="custom.html"
```

Remove `--templates` or the `templates` configuration entry when intentionally
rendering an entry without component definitions. Empty values, unmatched
selections and files containing only nameless
templates now error instead of rendering with an empty registry.

The draft `templateSourcePolicy: "overwrite"` option is removed. Reset both the
managed module and its `.inputs.json` sidecar before rebuilding retained pairs
created by earlier CLI-cache drafts. Existing strict writer/converter pairs remain
reusable. Raw-source order is canonicalized; repeated sources still count as
duplicate definitions rather than silently deduplicating.

## Direct runtime helper imports

The runtime no longer exports `child` or `composite`. Component assignments and
composite attributes use loader-prepared execution recipes.

Integrations that import these helpers directly should express component property
bindings and composite attributes in templates, compile with `compileServerModule`
and call the generated rendering methods. Supported semantic modules already use
`createServerRenderer` and need no regeneration for this cleanup. Object, JSON and
prepared rendering methods retain their input and output contracts.

## Opting into fresh JSON request methods

Newly emitted ESM additionally exports `renderEntryJson`, `renderTemplateJson`,
`renderHostJson` and `renderShadowJson`. Pass required JSON text instead of an
already-parsed object; there is no implicit object serialization or byte decoding.
The helper owns parsing and lighter **full-graph** validation, including unused
finite-number/Unicode checks and negative-zero normalization. Rendering, coercion,
ownership of ordinary/prepared inputs and hydration bytes remain unchanged.

Supported `fast-server-js` and `fast-server-native` semantic schema 1 assets remain
usable unchanged. Retain their decoders and exact managed bytes; do not add
compiler/version rebuild keys. Older ESM export lists lack the new JSON names,
even after upgrading the helper. `writeServerModule` continues reusing those assets
when templates are unchanged. To opt in, explicitly emit and activate a new
destination (with its own sidecar), such as `server-json.mjs`, using the updated
compiler. The additive `ServerModule` declaration describes newly emitted modules,
not historical cached export lists. Object/prepared callers and native hosts need
no API or output changes. Earlier numeric layouts still require the separate
semantic migration below.
See [the JSON contract](../server-modules.md#owned-fresh-json-requests).

## Generated rendering functions or numeric plans to semantic plans

Rebuild legacy JavaScript modules/native artifacts once. The generated module
now embeds semantic operation objects with named fields and template references
loaded by the helper instead of specialized rendering functions.
Published `renderEntry`, `renderTemplate`, `renderHost`, `renderShadow`,
`prepareState` and all four `render*Prepared` methods remain unchanged, as do
`ServerState`, `PreparedServerState`, validation and snapshot ownership.
No JSON-only request API or consumer serialization migration is required.
Native execution is unchanged; both new semantic formats start at schema 1.

The format names are `fast-server-js` (JavaScript semantic schema 1) and
`fast-server-native` (native semantic schema 1). The unpublished numeric JavaScript
and indexed native layouts, and experimental `fast-server-plan` and
`fast-server` names are not accepted. Regenerate those
assets before using the semantic loaders. For persistent writers, explicitly
remove the old generated asset and its `.inputs.json` sidecar together before
rebuilding; unchanged authored inputs otherwise reuse the old bytes. Deploy
regenerated assets with their matching helper/native loader. This is a one-time
semantic format transition. Future internal lowering/execution optimizations do
not change the wire schema. Only incompatible changes to semantic operations or
their meaning require a new version.
The reusable-operation map is `templates`; `{ type: "template", name }` invokes a
named template. Components map names to complete DSD templates; loaders derive
their host wrappers. Authored host defaults use optional `host-attributes`
metadata. Regenerate development artifacts from revisions using positional
operation arrays, separate shadow/host/tag references or the unpublished
`fragments` spelling; the initial semantic schema remains version 1.

Compiler fingerprints and literal helper-build equality checks are removed.
Native loading validates supported execution schemas rather than source/manifest
identity. Generated `compilerId` and Rust `SERVER_COMPILER_ID` are removed;
generated/helper `runtimeVersion`, the `ServerModule.runtimeVersion` type member,
Rust `SERVER_RUNTIME_VERSION` and the conversion target's `runtimeVersion`
metadata field are also removed. Remove consumer imports/reads of these fields;
use supported plan/artifact schemas for compatibility. Within the supported
format, a generated module that reads `$.runtimeVersion` still renders, but that
old export is now `undefined`. Newly compiled modules omit it. The metadata
removal itself does not invalidate persisted assets; the format rename above
requires explicit regeneration of earlier experimental assets.

For strict template-only updates, migrate file generation to `writeServerModule`
or `writeServerArtifact` and retain each asset with its `.inputs.json` manifest.
These writers compare authored inputs and reuse existing bytes before compiler
loading or raw-template parsing. The sidecar contains an exact output-byte copy,
not a fingerprint. This increases build-storage size, not runtime dependencies.
Pure `compileServerModule`/`compileServerArtifact` calls remain available, but
cannot reuse historical encodings without persisted assets.
To opt into retained preparation, add `--server-module=generated/page.mjs`
(or the `server-module` config key) and
cache both that file and its `.inputs.json` sidecar. Request state and render
options are not preparation inputs.
The plan/helper execution schema and rendered bytes do not change.
The earlier source-rendering migration below is separate.

## Request-time source rendering to compiled server targets

The earlier source-rendering prerelease made a breaking replacement of the previous renderer.
It is classified as a **minor prerelease release, not a drop-in upgrade**.
Updating the dependency alone is insufficient: migrate removed public APIs,
normalize accepted state, await harness rendering, and regenerate compiled output.
One compiler-owned representation now supports generated JavaScript and native
Rust artifact execution. The converter crate remains build-time tooling.
Rendered HTML, coercion, escaping,
whitespace, host attributes and hydration markers remain unchanged.

### Prepared snapshots

Rebuild outputs from the earlier source renderer once and deploy a helper/library
that supports their execution schema. Both generated JavaScript and native
artifacts use semantic schema 1. Ordinary render methods keep validating
supplied state on every call. Helper release versions are not asset rebuild keys.

For opt-in reuse, call generated `prepareState` once, then use the corresponding
`render*Prepared` method. Do not pass a handle to an ordinary method or serialize
it. Snapshots copy input rather than taking ownership or freezing caller data;
create a new snapshot after input changes. Artifacts sharing one helper instance
can share snapshots; separate helpers/workers cannot.

Rust callers can construct `PreparedState::new(&state)` or `from_json(json)` and
call `render_*_prepared`. Snapshots own immutable shared data; ordinary signatures,
execution budgets and output/error ownership remain intact. These snapshots are
not the retired prepared compiler/program APIs and cannot load their artifacts.
See the [complete ownership contract](../server-modules.md#prepared-state-snapshots).

### Choose the matching replacement

Compile authored inputs at build time, then select the matching render context:

| Previous API | Migration |
|---|---|
| WASM `render_entry_with_templates` | Compile the entry; call generated `renderEntry` for entry-host rules. |
| WASM `render` / `render_with_templates` | Call generated `renderTemplate` to preserve template-context root-host rules. |
| `render_shadow_root` | Call generated `renderShadow(name, componentState)` for a resolved-state DSD fragment. |
| Native Rust source rendering | Compile an artifact, load `CompiledArtifact`, and call its corresponding render method (`render_entry`, `render_template`, `render_host` or `render_shadow`). |
| Legacy prepared compiler/program APIs/artifacts | Rebuild authored sources into generated ESM or native artifacts; move lifecycle and activation responsibilities to the application. |

### Build once, render with request state

Use `renderEntry` for entry-host attribute handling and `renderTemplate`
for template-context root-host attributes. Both render complete synchronous HTML.
Use `ServerTemplateDefinition` for build-time metadata types. `fast build`
always executes server modules (compiling fresh unless persistence is selected);
remove `--aot`, `--stream` and `stream`
configuration from build scripts.

Earlier versions implicitly loaded `state.json` when no state path was supplied.
Pass `--state=state.json` or set `"state": "state.json"` in
`fast-build.config.json` to load that file explicitly. Omitting the state path uses
an empty object (`{}`).

```js
// Build pipeline: load/compose templates before compiling.
import { mkdir } from "node:fs/promises";
import { writeServerModule } from "@microsoft/fast-build/server.js";

await mkdir("./generated", { recursive: true });
writeServerModule(
    "./generated/server.mjs",
    {
        entry: "<my-card></my-card>",
        templates: { "my-card": "<h2>{{title}}</h2>" },
    },
    { overwrite: true },
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
2. Deploy the bytes and a `microsoft-fast-build` native library that supports their
   schema. Load once with `CompiledArtifact::load`.
3. Pass request `JsonValue` state and `NativeRenderOptions` to `render_entry`,
   `render_template`, `render_host` or `render_shadow`.
4. Share immutable artifact clones across worker threads. Keep retired program
   clones alive for in-flight requests during deployment activation.

The artifact schema must be supported by the deployed native library.
Compiler-only changes no longer invalidate supported artifacts.
Validate/load replacements before activating them;
an incompatible candidate must not replace the active program. For library
upgrades, let old workers finish with their loaded handles and deploy new workers
with supported retained artifacts. Do not patch artifact schema fields
or transfer Rust handles across library versions/processes.

Loading and rendering never reparse authored HTML or execute JavaScript. The
artifact contains shared compiler-owned executable operations. Reuse retained
artifacts until authored inputs change; pure Rust compilation requires
application-owned persistence for cross-compiler byte stability.
Options retain DSD and both marker formats. Errors are recoverable typed values,
with validation and recursion/step/output bounds; see the complete
[native contract](../server-modules.md#native-rust-artifact-target).
Native Rust is supported now. Stable C ABI/.NET hosting and its unmanaged
ownership/error contract are deferred, not claimed as working in this release;
no separate C# rendering semantic implementation is introduced.

Deploy generated modules and compatible `server-runtime.mjs` together; bundle
the helper or install a compatible package on the server. Retain supported
generated assets across compiler-only upgrades.
Applications own watching, dependency invalidation, module caching, atomic
activation, retention for in-flight requests and shutdown. Multiple entries can
be emitted as separate modules sharing the same helper.

### State and options

Pass JSON-shaped values directly, not serialized state strings. Explicitly
normalize dates, classes, accessors and `toJSON`-based models before rendering.
State must be acyclic, with finite numbers, well-formed Unicode, dense arrays
and plain/null-prototype objects containing enumerable own data properties.
Nested `undefined`, functions, symbols and non-enumerable properties are rejected.
No getter or `toJSON` is invoked. For generated JavaScript exports, omitted root
state becomes `{}`; native methods require an explicit `JsonValue`.

Native and JS targets share rendering semantics, not identical workload limits.
Native state is limited to depth 64 (root depth zero) and one million values
including the root; execution also bounds nested body calls, steps and UTF-8 output
bytes. JS flat plans expose no equivalent FAST budgets and remain subject to their host's
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
