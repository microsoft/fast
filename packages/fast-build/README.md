# FAST Build

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-build.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-build)

The `fast-build` package renders the declarative HTML template syntax of [`@microsoft/fast-element`](https://www.npmjs.com/package/@microsoft/fast-element) for integration with existing backends. It is powered by a WebAssembly core with zero runtime npm dependencies.

The renderer borrows inherited component state and repeat values instead of
deep-cloning the root for each attributed child. Existing render APIs, JSON state
files, CLI options, and hydration output remain unchanged.

Template structure is compiled lazily into in-memory plans and reused between
component instances and repeat iterations within a render call. No extra server
file is required. Existing WASM APIs do not retain plans across separate calls.
One-shot entry templates use the same instruction cursor without building an
entry instruction vector.

For reuse across requests or deployments, the optional
[`prepared.js` API](#prepared-template-pieces) eagerly prepares individual templates,
exports portable instructions, and manages a bounded in-memory piece cache.
Build tools can supply their own storage and lifecycle; a filesystem host is
provided for standalone Node applications.

[`@microsoft/webui`](https://github.com/microsoft/webui) is a highly performant backend alternative that renders FASTElement using the `fast_v3` plugin.

## Installation

### From NPM

To install the latest `@microsoft/fast-build` package using `npm`:

```shell
npm install --save @microsoft/fast-build
```

Within your JavaScript or TypeScript code, you can then import library APIs like this:

```ts
import { render } from '@microsoft/fast-build';
```

## Prepared template pieces

The opt-in Node API separates preparation from request state. Existing WASM exports
and CLI commands keep their one-shot behavior.

```js
import { prepareRenderer } from "@microsoft/fast-build/prepared.js";

const renderer = await prepareRenderer({
    entryFile: "./entry.html",
    templateFiles: ["./components.html"],
    cacheDirectory: "./.fast-prepared",
    maxMemoryBytes: 32 * 1024 * 1024,
});

try {
    const html = await renderer.render({ title: "First request" });
    const chunks = await renderer.render(
        { title: "Another request" },
        { stream: true, markersV2: false, attributeNameStrategy: "camelCase" },
    );
} finally {
    await renderer.dispose();
}
```

Provide exactly one of `entry` (an HTML string) and `entryFile`. Definitions may
come from `templates`, a name-to-string/metadata map, and/or explicit `templateFiles`
containing `<f-template>` declarations. Duplicate names are rejected.
`refresh({ templates: replacementMap })` replaces the definition map, not individual
entries. In-memory source inputs are copied and retained for later refreshes;
use file inputs or `loadRenderer` to avoid retaining authored source maps.

### Build tools and multiple entries

Use the storage-neutral APIs when a bundler already owns transformation, watching,
asset emission, and server lifecycle. Compilation accepts transformed template
strings and produces a versioned manifest plus artifact bytes, without reading
or writing files:

```js
import {
    compileArtifacts,
    createPreparedRuntime,
} from "@microsoft/fast-build/prepared.js";

const prepared = compileArtifacts({
    entries: {
        home: "<site-card>{{title}}</site-card>",
        account: "<main><site-card></site-card></main>",
    },
    templates: { "site-card": "<h2>{{title}}</h2>" },
});
const store = new Map(prepared.artifacts);
const runtime = createPreparedRuntime({
    manifest: prepared.manifest,
    loadArtifact: async id => {
        const bytes = store.get(id);
        if (!bytes) {
            throw new Error(`Missing prepared artifact ${id}`);
        }
        return bytes;
    },
    maxMemoryBytes: 32 * 1024 * 1024,
});

try {
    const home = await runtime.render("home", { title: "Home" });
    const account = await runtime.render("account", { title: "Account" });
    const shadow = await runtime.renderShadowRoot("site-card", { title: "Fragment" });
} finally {
    await runtime.dispose();
}
```

`compileArtifacts` is synchronous CPU work. Its `artifacts` map is keyed by piece
ID; a storage adapter decides how those bytes are emitted and retrieved.
For subsequent transformed batches, pass the previous complete result:

```js
const next = compileArtifacts(
    { entries: transformedEntries, templates: transformedDefinitions },
    { previous: prepared },
);
```

FAST validates the prior manifest/artifact integrity and compatibility, calculates
registry-sensitive identities, reuses unchanged instructions, and assembles a
complete candidate. It does not mutate the previous result. Invalid reuse rejects
preparation; callers can deliberately retry without `previous` to rebuild from
source. Reuse avoids unchanged instruction compilation, not all input scanning,
hashing or manifest assembly. Keep only the preparation results needed by your
build lifecycle; this is not a process-global compiler cache or part of the render
cache budget. No watcher or bundler-specific API is involved.

`createPreparedRuntime` synchronously validates and copies the manifest, while
`render` and `renderShadowRoot` asynchronously load their dependency graphs before
synchronous WASM execution. FAST owns compatibility/checksum validation, load
deduplication, eviction, and handle leases; adapters must not reproduce them.

All entries in one runtime share one memory budget and cached component pieces.
Creating several runtimes creates several independent caches and budgets, not a
server-wide limit. Runtime ownership is explicit, never a process-global cache.
The filesystem convenience wrapper has one entry and one manifest owner per
directory; use a multi-entry runtime instead of pointing different entry wrappers
at the same `manifest.json`.

For HMR, compile a complete candidate, make **all** its artifact bytes available,
then call `runtime.activate(candidate.manifest)`. Activation validates and copies
the candidate before replacing the current snapshot. Requests already loading
retain their original snapshot; do not delete their artifacts. Invalid manifests
leave the active generation unchanged. An accepted manifest does not prove that
every backing object exists: missing/corrupt bytes still reject the request that
loads them. Adapters should finish emission before activation and retain the last
valid generation on transformation/build failures. Disposal rejects new work and
drains existing requests before freeing cached handles.

`runtime.snapshot` exposes a readonly `{ generation, drained }` handle for the
current activation. Capture it before replacement:

```js
const retired = runtime.snapshot;
// Publish every candidate artifact to the application store first.
runtime.activate(next.manifest); // Still returns the generation string.
await retired.drained;
```

`drained` resolves only after that activation is retired and all its accepted
requests finish, including requests blocked in artifact loading and failed
requests. Disposal retires the current snapshot and drains it too. Handles
identify activation instances: activating A, then B, then A creates three distinct
handles even when two generation hashes match. No per-request adapter wrapping
is needed.

The storage adapter still owns deletion policy. A drained handle permits removing
only artifacts **not referenced by the current or any other undrained snapshot**;
shared IDs must remain available. Register the new snapshot's references before
processing retirement cleanup. These signals cover one runtime, not other workers
or processes; coordinate deployment-wide collection separately. FAST never deletes
application backing objects.

### Selective DSD and shadow fragments

Pass `dsd: "all"` (the default) or an array of component names for request-local
DSD selection. An empty array disables all component shadow rendering:

```js
const html = await runtime.render("home", state, { dsd: ["site-card"] });
const chunks = await runtime.render("home", state, { stream: true, dsd: [] });
```

Excluded components behave like unregistered elements at execution: their authored
host attributes and light DOM render in the caller's state/scope, but template
host defaults are not applied and shadow content is not evaluated. Selected
components in their authored light DOM still render. Definitions remain registered
for plan classification; do not remove them, mutate a shared registry, refresh per
request, or prepare a registry variant for every selection.

Loading follows the same selection: `dsd: []` loads the entry piece only, and a
mixed allowlist omits excluded shadow pieces and their shadow-only dependencies.
Selected descendants in an excluded host's authored light DOM remain reachable
through their caller piece. The full registry remains available for immutable
classification validation independently of loaded definitions. Dependencies in
skipped state-dependent branches are still conservative; selection does not
evaluate conditions early or promise branch pruning.

`renderShadowRoot(name, resolvedComponentState, options)` returns the complete DSD
`<template>` fragment with its shadow metadata and fresh hydration scope. It does
not synthesize a host, apply host defaults, derive state from host attributes, or
render caller-owned light DOM. Nested components follow the same DSD selection.
A known but excluded root returns an empty string; an unknown name is an error.
Marker and attribute-strategy options match entry rendering. Fragments are not
implemented by slicing synthetic host output. The filesystem wrapper exposes the
same fragment operation.
Known excluded fragments return empty output without loading any artifact,
after request validation. Unknown roots and missing/corrupt pieces actually needed
by the selected execution still fail. Unused excluded artifacts are not read and
therefore do not cause backing-file errors; this intentionally replaces the
earlier prerelease conservative-loading behavior.

### Generated artifacts and deployment

Preparation writes content-addressed `<id>.fast-artifact.json` files and a `manifest.json`
into `cacheDirectory`. Files contain actual prepared instructions, source needed
for diagnostics, parsed attributes, body plans, and component references. They
contain no request state, hydration counters, or rendered HTML. Store this directory
as a trusted application build artifact, not as user-uploaded input.

Bundlers emit each `compileArtifacts().artifacts` map entry under
`<id>.fast-artifact.json` and serialize its manifest alongside the server output.
Keep the runtime and artifacts out of the client module graph. Resolve generated
files relative to the deployed server module/output directory, not the original
source tree or current working directory. A custom `loadArtifact` can instead use
bundler-managed objects or another asynchronous application store.

A build step can call `prepareRenderer`, then `dispose`, and deploy the resulting
directory without the authored template files. A separate process loads it with:

```js
import { loadRenderer } from "@microsoft/fast-build/prepared.js";

const renderer = await loadRenderer({
    manifestPath: "./.fast-prepared/manifest.json",
    maxMemoryBytes: 32 * 1024 * 1024,
});
const html = await renderer.render({ title: "Request-specific state" });
await renderer.dispose();
```

Artifacts must match the runtime's compiler fingerprint and instruction-format
version. The fingerprint covers Rust sources, the crate manifest, and lockfile;
use the same compiler build for generation and serving. Artifact checksums,
source ranges, identities, and dependency membership are validated. Missing,
corrupt, or incompatible generated files needed by a request reject it; `loadRenderer`
does not silently fall back to source compilation.

The multi-entry manifest is version 2; artifact instruction format and compiler
identity are separate checks. Regenerate artifacts made with earlier prerelease
manifest layouts or the old file extension rather than renaming files and
assuming compatibility. Generate and serve using the same installed compiler
build; independently compiled server and artifact pipelines must compare the
fingerprint explicitly, not just package versions.

See the [executable Vite integration](./test/fixtures/prepared-vite/README.md) for
transformed inputs, server-only asset emission, production relocation, shared
multi-entry caching, fingerprint failures and HMR/shutdown ownership.

### Changes and development watching

`await renderer.refresh()` rereads source files and regenerates changed pieces.
With `loadRenderer`, it instead reloads the generated manifest. Production
activation is explicit; files are not checked on every request.

Opt into automatic source-file updates during development:

```js
const renderer = await prepareRenderer({
    entryFile: "./entry.html",
    templateFiles: ["./components.html"],
    cacheDirectory: "./.fast-prepared",
    watch: true,
    onError: error => console.error("Template refresh failed:", error),
});
```

Watching parent directories also detects atomic file replacement by editors.
Watcher events trigger content hashing; timestamps are not cache identities.
Call `refresh()` explicitly if filesystem events are lost. Watch failures and
invalid updates call `onError`, or `process.emitWarning` when omitted. Failed
rebuilds retain the active snapshot. Syntax diagnostics inside skipped bodies
remain deferred until those bodies execute.

An identity includes authored content, host/shadow metadata, compiler/format
identity, and registry membership of custom element names present in the piece.
Changing a child's content regenerates that child without recompiling unchanged
callers: component calls remain references rather than inlined copies.
Adding/removing a registered name also regenerates pieces whose classification
depends on that name. Artifacts are completed before an atomic manifest replacement.
Requests capture a manifest snapshot before loading, so concurrent refreshes never
mix old and new pieces in one request. Old artifacts remain on disk for old snapshots;
remove obsolete generations only after all older readers/workers have finished.
Keep an active renderer's artifact directory stable; do not retarget or replace
that directory while requests still need its files.

### Memory and execution boundaries

File reads/writes are asynchronous. Before entering WASM, each request loads the
entry's DSD-policy-required referenced-template graph, including selected references
in skipped branches. Excluded shadow definitions and their shadow-only dependencies
are not loaded. Unreachable registered templates are not loaded. This is not a
state-dependent expanded component tree, and does not evaluate conditions twice.
Execution then uses the existing synchronous evaluator and fresh request state.
`stream: true` returns the existing precomputed chunks, not live network streaming.

Loaded pieces use a least-recently-used cache with a default estimated Rust-memory
budget of 32 MiB. Active requests pin pieces and may temporarily exceed that budget;
`maxMemoryBytes: 0` drops all unpinned pieces. Shared concurrent loads are deduplicated.
`renderer.memoryUsage` reports estimated piece bytes, piece count, and pending loads.
The budget excludes JavaScript objects, retained source inputs, preparation work,
temporary file buffers, allocator overhead, and output. It is not a process-RSS cap.
Artifact bytes retained by an adapter's backing store are also outside this budget.

Eviction drops the memory representation, not the durable artifact. A later request
can reload it without source preparation. `dispose()` stops watchers, waits for
active requests and refreshes, and releases cached WASM allocations; it leaves
generated files intact. Freed WASM allocations are reusable, but linear memory does
not necessarily shrink. Preparation and JSON artifact loading have costs; small
one-shot templates are not guaranteed to benefit.

From a FAST repository checkout, measure these stages separately with
`npm run bench:prepared -w @microsoft/fast-build`. The
[dedicated harness](./test/performance/PREPARED.md) distinguishes startup,
preparation, cold generated-file
loading, warm requests, many-entry retention, incremental preparation reuse and
selective DSD/fragment loads. Earlier one-shot cursor timings
are not prepared-path performance evidence.

## CLI usage

Once installed, the `fast` binary is available. Use the `build` subcommand to render an HTML template with an optional JSON state file, or `convert` to convert a FAST declarative HTML template to another supported syntax:

```shell
fast build [options]
fast convert [options]
```

### Build options

| Option | Default | Description |
|---|---|---|
| `--entry="<path>"` | `index.html` | Entry HTML template to render |
| `--state="<path>"` | `{}` when omitted | JSON file containing the template state. If omitted, no state file is loaded and rendering uses an empty state object. If `--state` is provided, the file must exist. |
| `--output="<path>"` | `output.html` | Where to write the rendered HTML |
| `--templates="<glob>"` | _(none)_ | Glob pattern(s) for custom element template HTML files. Separate multiple patterns with commas. A warning is printed if not provided in non-streaming mode or if no files match a pattern. |
| `--attribute-name-strategy="<strategy>"` | `camelCase` | Strategy for mapping HTML attribute names to state property names on custom elements. `"camelCase"` converts dashes to camelCase (e.g. `foo-bar` → `fooBar`). `"none"` preserves dashes (e.g. `foo-bar` → `foo-bar`). See [Attribute name strategy](#attribute-name-strategy). |
| `--markers_v2[=true/false]` | `false` | Emit FAST Element 2.x indexed hydration markers instead of the default FAST Element 3.x data-free markers. |
| `--config="<path>"` | `fast-build.config.json` | Path to a JSON configuration file. If omitted, `fast-build.config.json` in the current directory is used when present. CLI arguments take precedence over config values. See [Configuration file](#configuration-file). |
| `--stream[=true/false]` | `false` | Write rendered HTML chunks directly to stdout instead of writing `--output`. Valueless `--stream` is treated as `true`. |

### Example

Given an `index.html`:

```html
<html>
  <body>
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  </body>
</html>
```

And a `state.json`:

```json
{
  "title": "Hello FAST",
  "description": "Server-side rendered with WebAssembly."
}
```

Run:

```shell
fast build --entry=index.html --state=state.json --output=output.html
```

Produces `output.html`:

```html
<html>
  <body>
    <h1>Hello FAST</h1>
    <p>Server-side rendered with WebAssembly.</p>
  </body>
</html>
```

### Streaming output

Pass `--stream`, `--stream=true`, or `--stream=false`, or set
`"stream": true` in `fast-build.config.json`, to control stdout streaming. When
streaming is enabled, the CLI writes raw rendered HTML chunks to stdout, does
not write the `--output` file, and does not print the normal `Built: ...`
message.

```shell
fast build --entry=index.html --state=state.json --stream
```

Streaming is simulated by the WebAssembly renderer: chunks are prepared in
memory, returned to JavaScript as a JSON array, parsed by the CLI, and then
written to stdout. `--stream` uses the same entry renderer with its stream flag
enabled and passes an empty templates map when no `--templates` glob is
provided. Chunk boundaries are safe for HTML parsing:

- Attribute bindings stay within complete opening tag chunks.
- Custom element opening chunks include the complete Declarative Shadow DOM
  template.
- Streamed output uses the same renderer preprocessing and custom-element host
  attribute propagation as normal output.
- Empty chunks are omitted.
- Concatenating all chunks matches the normal non-streamed render.

### Performance benchmarks for contributors

The renderer discovers tags and bindings in a forward scan, eliminating repeated
remaining-suffix searches for adjacent custom elements and plain tags. Existing
WASM exports, rendered bytes, default markers, and `markers_v2` remain compatible.
Rendering is still synchronous, and `--stream` still buffers all chunks in WASM.

From a FAST repository checkout, not an installed npm package:

```shell
npm run build -w @microsoft/fast-build
npm run bench:render -w @microsoft/fast-build -- --case=url_sink_siblings --output=/tmp/fast-render.json
npm run bench:render -w @microsoft/fast-build -- --case=url_sink_siblings --check-scaling
```

The runner benchmarks the actual packaged WASM in fresh child processes in both
marker modes, recording timing, CPU, output hashes, throughput, and peak RSS.
Use `--case`, `--counts`, `--samples`, or `--compare=<baseline.json>` to narrow
or compare a run. Output files are never overwritten. Normal tests verify the
same fixtures against pre-optimization hashes without flaky timing thresholds.
See the [benchmark guide](../../crates/microsoft-fast-build/benchmark-baselines/README.md)
for native Criterion benchmarks, fixture sizes, methodology, and limitations.

The guide includes post-scanner repeat/state-heavy and many-definition profiles.
Start expensive repeat cases with `--counts=250,1000 --warmup-count=250`;
state-overlay controls and separate native phases help identify the next
optimization without running an unbounded matrix. Native CPU samples are not
WASM allocation measurements, and no production rendering behavior is changed.

The guide also includes an opt-in native allocation baseline and a fresh-process
matrix command: `node crates/microsoft-fast-build/benches/profile-allocations.mjs
--output=/tmp/fast-allocations.json` from the repository root. Its counters are
development-only Rust tooling, not part of the npm CLI or WASM; native peak
newly-live heap is not process RSS.

### Missing or omitted state

State is optional. When `--state` is omitted and no `state` path is provided by config, `fast build` does not look for `state.json`; rendering uses an empty object (`{}`). An explicit `--state` path, or a `state` path from config, must exist or the command exits with an error.

> **Breaking change:** Earlier versions implicitly loaded `state.json` from the current working directory when `--state` was omitted. To use a state file, pass `--state=state.json` or set `"state": "state.json"` in `fast-build.config.json`.

When a binding value is not present in state:

- Content bindings render nothing, including unresolved dot paths: `<p>{{foo.bar}}</p>` becomes `<p></p>`.
- Attribute bindings omit the entire attribute, including unresolved dot paths: `<div class="{{foo.bar}}"></div>` becomes `<div></div>`.
- `<f-repeat>` treats a missing list binding, including unresolved dot paths, as an empty array and renders zero iterations. If the binding is present but is not an array, rendering still errors.

Explicit `null` also omits an attribute, even in an interpolated attribute
value. Empty strings remain present. Known HTML boolean attributes bound to
JSON booleans use presence/absence; ordinary attributes (including ARIA)
retain textual booleans. Use `?name` for browser-side truthy/falsy bindings.
Author bindings resolving to absence still override template-host defaults.
These intentional output changes are described in the
[plugin migration guide](./docs/migration/plugin-integrations.md).

### Stylesheet delivery composition

Build-time plugins can compose separately authored HTML and CSS without filesystem
access or browser APIs:

```ts
import { compose_f_template_styles_with_options } from
    "@microsoft/fast-build/wasm/microsoft_fast_build.js";

const composed = compose_f_template_styles_with_options(templateHtml, {
    kind: "inline",
    css: cssText,
    styleId: "example-card-styles-v1", // Optional generated SSR fallback identity.
});
try {
    const definitionHtml = composed.html;
    // Pass definitionHtml to parse_f_templates or fast-convert.
    // Keep composed until diagnostics and binding spans have been mapped.
} finally {
    composed.free();
}
```

Use `{ kind: "external", href: "/assets/example-card.abc123.css" }` to insert
`<link rel="stylesheet">` instead. The caller owns the URL, asset serving, and
bundler processing. Both strategies insert exactly one element as the first child
of the single inner `<template>`, preserving every other authored byte. Existing
`compose_f_template_styles(templateHtml, css)` remains an inline string shorthand.

An inline `styleId` emits `data-fast-ssr-style="…"`. It is an opaque,
caller-controlled stylesheet/version identity, not an instance ID, hash, CSP
nonce, or instruction to remove styles. Reuse it across component instances that
share the same replacement CSS. Generated attributes are HTML-escaped. URLs and
identities must be nonblank static strings without control characters or braces;
FAST bindings in these values are deliberately rejected. Inline CSS retains the
case-insensitive `</style` terminator check.

For ordinary inline/external delivery, convert the same composed definition for
the client; do not also register duplicate runtime styles. For adopted delivery,
compose an identified SSR fallback, convert the original HTML for the client, and
convert/register the CSS separately. A runtime integration must attach replacement
styles successfully before removing only matching generated fallbacks in that
component's shadow root, coordinate removal with hydration, and leave unrelated
authored styles untouched. No runtime handoff is implemented here. Without
JavaScript, or if attachment fails, retain the fallback.

Placement is deterministic, not cascade equivalence: constructed stylesheets have
different ordering from ordinary shadow stylesheets. Applications must account
for that difference. Style identity does not provide CSP authorization; nonce
support remains a separate concern.

#### Mapping composed source locations

Keep the composition result alongside its original file association. Downstream
APIs receive composed text and therefore return composed coordinates; mapping is
explicit, not automatic:

- `JSON.parse(composed.map_span(start, end))` maps a half-open UTF-16 range from
  the complete composed document, including binding metadata offsets.
- `JSON.parse(composed.map_location(line, column, length, false))` maps converter
  or full-document render diagnostics.
- Use `true` only for locator/shadow-root errors referring to this definition's
  trimmed inner content. Check `templateName` first; do not use this map for a
  nested definition from another file.

The result is `{ source: "html" | "css" | "generated", span }`. Authored spans
contain zero-based UTF-16 offsets and one-based lines/UTF-16 columns. CRLF counts
as one break; lone CR/LF also break lines. Generated markup has `span: null`.
Invalid offsets, surrogate splits, and ranges crossing source boundaries throw
`invalid-composition` instead of reporting a fabricated location.

`JSON.parse(composed.source_map)` exposes a version-1 single-insertion map with
`originalHtml`, optional `css` (`null` for external links), `insertionOffset`,
`insertionLength`, optional `cssOffset`, `contentOffset`, and `contentLength`; all numeric offsets
and lengths are UTF-16 units. This is composition provenance, not a JavaScript
source map for generated TypeScript. Mapping ceases to apply after further
transformations unless the caller composes their maps.

Unsafe CSS errors now expose `sourceKind: "css"` and locations in the separately
supplied CSS. Stylesheet bodies are treated as literal HTML raw text throughout
build parsing, rendering, metadata discovery, and conversion, including
template-looking strings. See the
[migration notes](./docs/migration/stylesheet-composition.md).

### APIs for build-time plugins

Import the actual exported WASM subpath; do not slice rendered host HTML:

```js
import {
    parse_f_templates,
    render_shadow_root,
} from "@microsoft/fast-build/wasm/microsoft_fast_build.js";

const definitions = JSON.parse(parse_f_templates(templateHtml));
const templates = Object.fromEntries(
    definitions.filter(definition => definition.name !== null)
        .map(definition => [definition.name, definition]),
);
const shadowRootHtml = render_shadow_root(
    "my-card", JSON.stringify(templates), JSON.stringify(componentState),
);
```

The result is the complete DSD `<template>` fragment, with hydration markers
and nested components, but no host, host defaults, or light DOM. Pass resolved
component state; the API does not derive it from caller-owned host attributes.
It accepts the existing attribute-name strategy and v2 marker options.

Parsed records add `formatVersion: 1` and `bindings` without changing the array
shape. Binding records expose `name` (null for compound expressions),
`expression`, syntax `kind`, lexical `paths`, and outer-to-inner repeat
`scope` frames. `type` is null except for repeat collections (`"array"`);
`optional` is null because required state declarations are not inferable.
`$index` paths refer to the active repeat frame, not a root state key.
Client expressions are described lexically, not fully JavaScript-type-checked.
Code samples are excluded; metadata is not full syntax or state validation.
Generated WASM declarations expose these JSON interfaces.

#### Authored binding source spans

Each binding occurrence includes `span: { start, end }`. Both positions contain
`offset`, `line`, and `column`, relative to the **complete HTML string passed to
`parse_f_templates`**, not the extracted or trimmed template body. Duplicate
expressions have separate spans, including occurrences in host attributes,
interpolated attribute values, and nested directives.

- `offset` is a zero-based UTF-16 code-unit offset, compatible with JavaScript
  string slicing. It is not a UTF-8 byte offset.
- `line` and `column` are one-based. Columns count UTF-16 code units, not visual
  width or Unicode code points; a tab counts as one and a non-BMP character
  counts as two.
- Ranges are half-open: `start` is inclusive and `end` is exclusive. They cover
  the trimmed expression, excluding braces and surrounding whitespace.
- CRLF counts as one line break but two offset units. Lone CR and LF each count
  as one line break. Input line endings are not normalized.
- Repeat bindings locate the iterable expression, not the alias or `in` keyword,
  matching their existing `expression` field. Nested `scope` frames are unchanged.

```js
const [definition] = JSON.parse(parse_f_templates(templateHtml));
for (const binding of definition.bindings) {
    const { start, end } = binding.span;
    const authoredExpression = templateHtml.slice(start.offset, end.offset);
    console.log(`${start.line}:${start.column}`, authoredExpression);
}
```

Positions refer to the original, entity-encoded attribute text. No entity decoding
is introduced. Code samples remain excluded without shifting subsequent spans.
Callers associate the input with its file name and must regenerate metadata after
editing that input. Bindings and directives inside HTML comments remain unsupported.

Render exports reject unsupported/malformed explicit versions before rendering.
Legacy unversioned maps and string definitions remain supported. The CLI keeps
version/binding fields when assembling a map; persisted metadata should do the
same instead of discarding them.

#### Authored slot declarations

Inspect one component without rendering state or parsing HTML in your plugin:

```js
import { extract_template_slots } from "@microsoft/fast-build/wasm/microsoft_fast_build.js";

const source = `<f-template name="my-card">
    <template>
        <slot name="title"></slot>
        <slot></slot>
    </template>
</f-template>`;
const slots = JSON.parse(extract_template_slots(source, "my-card"));
// [{ name: "title", line: 3, column: 9 }, { name: "", line: 4, column: 9 }]
```

The export returns a JSON array described by the generated `TemplateSlot`
TypeScript interface: `{ name: string; line: number; column: number }`.
Names are HTML-entity-decoded authored attribute values, not evaluated bindings.
Missing, valueless, and empty `name` attributes all denote the default slot `""`.
Declaration order and duplicates are preserved; results are not deduplicated or
expanded into rendered instances.

Discovery uses an HTML tokenizer and tree builder, including HTML error recovery,
with scripting enabled but **no script execution**. Comments, escaped markup,
attribute text, and HTML raw-text/RCDATA contexts (including `script`, `style`,
`textarea`, and `noscript`) do not manufacture slot elements. Only HTML-namespace
slots count; SVG/MathML slots do not, while real HTML descendants at integration
points such as SVG `foreignObject` do.

Selection matches the decoded `<f-template name>` value case-sensitively and
requires exactly one matching HTML definition with exactly one direct HTML
`<template>` child. Discovery stays inside that child's contents. It includes
nested ordinary `<template>` contents and `<f-when>`/`<f-repeat>` bodies once
per authored declaration, without evaluating state. Nested `<f-template>`
definitions and templates carrying `shadowrootmode` or legacy `shadowroot`
are separate authored scopes and are excluded. Sibling definitions and markup
outside the selected shadow template are excluded too.

Locations identify the opening `<` in the **complete HTML argument**. Lines and
UTF-16 columns are one-based, tabs count as one code unit, and non-BMP characters
as two. CRLF is one break; lone CR and LF are breaks too. Pass the original source
**before** `compose_f_template_styles`, code-sample escaping, or other transforms;
coordinates from already-transformed input cannot recover the original file.
Associate the input with its file name and regenerate metadata after editing it.

A valid component with no slots returns `[]`. Invalid selection throws
`FastBuildError`: `invalid-template-metadata` for an empty selector or duplicate
matching definitions, `missing-template` for no match, and
`missing-inner-template`/`multiple-inner-templates` for ambiguous shadow-template
structure. Located failures identify the containing definition or second
conflicting declaration in the original input and include `templateName`.
This additive API does not change `parse_f_templates`, binding metadata,
rendering, or the template format version, and is not a slot-contract manifest.

#### Structured errors

Failing render, conversion, composition, and metadata-validation APIs throw actual
JavaScript `Error` objects, retaining the existing human-readable `message`.
Both WASM modules export this TypeScript interface (not a runtime constructor):

```ts
interface FastBuildError extends Error {
    code: string;
    line?: number;
    column?: number;
    length?: number;
    templateName?: string;
}
```

Use `code`, such as `unclosed-binding`, `repeat-not-array`, or `missing-template`,
instead of parsing messages. The complete code lists are documented with the
[renderer errors](../../crates/microsoft-fast-build/README.md#error-handling)
and [converter errors](../../crates/microsoft-fast-convert/README.md#error-codes).

Locations use one-based lines and UTF-16 columns, with a UTF-16 highlight `length`.
Tabs count as one unit, non-BMP characters as two; CRLF is one line break and lone
CR/LF are also line breaks. A highlight covers the offending opening tag or
binding including its delimiters; an unclosed binding highlights its opening
delimiters. Unlike successful binding metadata, these are error-token ranges,
not trimmed expression ranges.

Entry-render and conversion coordinates refer to the original HTML argument,
even after code-sample escaping, inner-template extraction, or publisher-attribute
rewriting. Light DOM remains in its caller's source. Errors in separately supplied
custom-element definitions include `templateName` and use coordinates within that
definition's supplied `content`, not the entry HTML or the full file it was
extracted from. Maintain a name-to-source mapping when presenting these locations.
For a missing inner template, the highlight identifies its containing
`<f-template>`; duplicate-wrapper errors identify the second wrapper.

Coordinates are absent when there is no meaningful HTML position: invalid state
JSON, malformed metadata/options, missing template definitions or outer wrappers,
filesystem errors, and unsafe separately supplied CSS. A known `templateName`
can still be present without coordinates. `parse_f_templates` remains permissive:
it does not gain strict syntax validation or new failures.

For a direct `render(html, stateJson)` call, an integration can report:

```js
try {
    render(html, stateJson);
} catch (error) {
    if (!(error instanceof Error)) throw error;
    const location = error.line === undefined
        ? inputPath
        : `${inputPath}:${error.line}:${error.column}`;
    console.error(`${location} [${error.code}]: ${error.message}`);
}
```

See the [migration guide](./docs/migration/plugin-integrations.md#structured-errors)
when updating consumers that previously caught strings.

### Custom element templates

Pass a glob pattern (or comma-separated list of patterns) to `--templates` to expand custom elements into [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom):

```shell
fast build \
  --templates="./components/**/*.html" \
  --entry=index.html \
  --state=state.json \
  --output=output.html
```

Each matched `.html` file is scanned for `<f-template>` elements. The `name` attribute of each `<f-template>` determines the custom element name. A single file may contain multiple templates.

Template files must use the following format:

```html
<f-template name="my-button">
    <template>
        <button>{{label}}</button>
    </template>
</f-template>
```

If an `<f-template>` element has no `name` attribute, a warning is printed and it is ignored. Exact file paths (no wildcards) are also accepted as patterns, making it possible to register a single template file. The parser follows browser tag boundaries for the `<f-template>` and inner `<template>` wrappers, including ASCII whitespace before `>` in opening and closing tags.

Any `shadowroot*` attributes on `<f-template>` are forwarded to the rendered Declarative Shadow DOM `<template>`. The CLI normalizes `shadowrootmode` and legacy `shadowroot` for compatibility: when neither has a non-empty value, it emits `shadowrootmode="open" shadowroot="open"`; when exactly one has a non-empty value, that value is mirrored to the other; when both have explicit non-empty values, both are preserved as authored, even if they conflict.

### Attribute name strategy

The `--attribute-name-strategy` option controls how HTML attribute names on custom elements are mapped to state property names in their shadow templates.

| Strategy | Behaviour | Template binding |
|---|---|---|
| `camelCase` (default) | Dashed attribute names converted to camelCase | `foo-bar` → `{{fooBar}}` |
| `none` | Attribute names lowercased as-is, dashes preserved | `foo-bar` → `{{foo-bar}}` |

The `camelCase` strategy only affects "plain" custom element attributes. It does **not** change:
- `data-*` attributes (always use `dataset.*` grouping)
- `aria-*` attributes (always use ARIA reflection lookup)
- HTML global attributes with known property names (e.g. `tabindex` → `tabIndex`)

```shell
fast build \
  --templates="./components/**/*.html" \
  --attribute-name-strategy=camelCase \
  --entry=index.html \
  --state=state.json \
  --output=output.html
```

### Configuration file

Instead of passing every option on the command line, you can place a `fast-build.config.json` file alongside your project files:

```json
{
    "entry": "index.html",
    "state": "state.json",
    "output": "output.html",
    "templates": "./components/**/*.html",
    "markers_v2": true
}
```

The CLI automatically loads `fast-build.config.json` from the current directory when it exists. To use a different file, pass `--config`:

```shell
fast build --config=configs/my-build.json
```

**Precedence:** CLI arguments always override config file values. For example, `--output=other.html` will override the `output` value in the config file.

**Path resolution:** File paths in the config file (`entry`, `state`, `output`, `templates`) are resolved relative to the config file's directory, not the current working directory. This ensures the config works correctly regardless of where the CLI is invoked.

All keys are optional. Only the following keys are allowed: `entry`, `state`, `output`, `templates`, `attribute-name-strategy`, `markers_v2`, and `stream`. Unknown keys produce an error. Values must be strings except `markers_v2` and `stream`, which must be JSON booleans (`true` or `false`). If `state` is omitted, rendering uses `{}`; if `state` is present, the referenced file must exist. CLI arguments always override config values, including `--stream=false` overriding `"stream": true`.

## Convert

`fast convert` converts FAST declarative template files using the converter WASM module in `wasm/convert/`. Supported syntax names, output extensions, and default output suffixes are read from the converter WASM metadata so the Rust converter remains the source of truth for syntax targets.

```shell
fast convert --syntax=webui-prerelease --templates=example.html
fast convert --syntax=fast-v3-ts --templates=example.html --output=../*.template.ts
fast convert --syntax=fast-v3-ts --templates="src/**/*.html" --output=generated/*.template.ts
fast convert --syntax=fast-v3-ts --templates=example.html \
    --type-source=MyElement --type-source-import=./my-element.js
```

### Convert options

| Option | Default | Description |
|---|---|---|
| `--syntax="<syntax>"` | _(required)_ | Target syntax: `webui-prerelease`, `webui-framework-prerelease`, or `fast-v3-ts` |
| `--templates="<glob>"` | _(required)_ | Comma-separated glob pattern(s) matching `.html` templates to convert. An exact single file path is also accepted. Loads the converter WASM module once for the whole batch. |
| `--output="<path>"` | Next to source | Output file path. `webui-prerelease` defaults to `*.webui.html`; `webui-framework-prerelease` defaults to `*.webui-framework.html`; `fast-v3-ts` defaults to `*.template.ts`. Any `*` in the output path is replaced with the input basename without extension. Every file matched by `--templates` is written under `--output`'s directory (or next to its source if `--output` is omitted). |
| `--overwrite` | `false` | Allow replacing an existing output file. CLI presence always means `true`. |
| `--typed[=true/false]` | `false` | Only for `fast-v3-ts`. Add an explicit `ElementViewTemplate<TSource>` export annotation and type-only import. Explicit false overrides configured true. |
| `--type-source="<Name>"` | _(none)_ | Only valid with `--syntax=fast-v3-ts`. Emits `export const template = html<Name>\`…\`;` instead of the untyped `html` call. Must be a dotted TypeScript identifier (e.g. `MyElement` or `Namespace.MyElement`). |
| `--type-source-import="<module>"` | _(none)_ | Requires `--type-source`. Also emits `import type { <Name> } from "<module>";` alongside the helper imports. |
| `--config="<path>"` | `fast-convert.config.json` | Path to a JSON configuration file. If omitted, `fast-convert.config.json` in the current directory is used when present. CLI arguments take precedence over config values. |

Only matched `.html` files are converted; non-`.html` files and directories are never matched. The output extension must match the selected syntax: `.html` for `webui-prerelease`/`webui-framework-prerelease` and `.ts` for `fast-v3-ts`. The output parent directory is created automatically if it doesn't exist (`mkdir -p` semantics), and an existing output file is rejected unless `--overwrite` or `"overwrite": true` is used. When a `--templates` pattern matches zero files, a warning is printed but the command does not fail unless every pattern matches zero files.

`webui-framework-prerelease` converts FAST's declarative syntax into the Microsoft WebUI Framework's own declarative runtime syntax (`webui-prerelease` remains unchanged — it emits HTML for WebUI's separate FAST parser plugin instead). When `webui-framework-prerelease` strips an unsupported `f-slotted`/`f-children` directive, the CLI prints `Warning: <message>` to stderr for each stripped directive without failing the command.

`--type-source` exists so templates that combine more than one differently-named
`ref`/`children`/`slotted` directive (which otherwise fail to type-check once a
real `TSource` is supplied, because `html<TSource, TParent>` infers a single
`TSource` for the whole tagged template) can be generated already type-checked
against a concrete element type. See
[`microsoft-fast-convert` DESIGN.md](../../crates/microsoft-fast-convert/DESIGN.md#explicit-tsource-generic).

### Convert configuration file

`fast-convert.config.json` follows the same precedence and path-resolution rules as `fast-build.config.json`: CLI arguments override config values, and `templates`/`output` paths from config are resolved relative to the config file directory.

```json
{
    "syntax": "fast-v3-ts",
    "templates": "src/**/*.html",
    "output": "generated/*.template.ts",
    "overwrite": false,
    "type-source": "MyElement",
    "type-source-import": "./my-element.js"
}
```

Only `syntax`, `templates`, `output`, `overwrite`, `type-source`,
`type-source-import`, and `typed` are allowed. Values must be strings except
`overwrite` and `typed`, which must be JSON booleans.

For declaration-emitting consumers, use `--typed --type-source=MyElement`.
The converter WASM's `convert_template_with_options` accepts an appended
optional `typed` boolean. `convert_stylesheet(css, "fast-v3-ts", "styles",
true)` emits an `ElementStyles` annotation. Existing calls remain untyped;
typed exports are tested with TypeScript `isolatedDeclarations`.

### Running converter fixtures locally

Build the package WASM, then run the fixture validation:

```shell
npm run build -w @microsoft/fast-build
npm run test:fixtures:convert -w @microsoft/fast-build
```

The fixture tests run `fast convert` from fixture directories that contain
`fast-convert.config.json`, so they verify the same default config discovery used
by `fast build`. Generated fixture output is written under
`packages/fast-build/test/.fixture-output/` and removed by the tests.
`test/fixtures/convert/type-source.test.js` additionally type-checks
`--type-source` output with the TypeScript compiler API against a companion
element type, using a separate `test/.fixture-output-type-source/` directory.

## Template syntax

Bindings and FAST directive markup inside HTML comments are unsupported.
Commenting out bound markup does not reliably disable its bindings and can cause
rendering errors or client hydration mismatches. Remove unused bound markup
instead, and keep explanatory comments free of binding syntax and FAST directive
tags.

Template syntax follows the FAST declarative HTML format. See the
[`@microsoft/fast-element` declarative documentation](../fast-element/docs/declarative/syntax.md)
for full documentation on bindings, conditionals, repeats, and directives.
