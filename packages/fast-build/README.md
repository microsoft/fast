# FAST Build

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40microsoft%2Ffast-build.svg)](https://badge.fury.io/js/%40microsoft%2Ffast-build)

Compile FAST declarative HTML into native JSON artifacts and execute them with
the shared Rust renderer in Node.js or Rust.

## Installation

```sh
npm install --save @microsoft/fast-build
```

Requires Node >=22.18.0. On supported targets, npm installs the matching prebuilt
native renderer as an exact-version optional dependency. Ordinary Node rendering
and CLI page builds need no Rust installation, source checkout or addon path.
Artifact compilation and browser conversion use build-time WASM.

## Native artifact compilation

Compile trusted templates during the application build. Source-based integrations
use the shared [component-source contract](./docs/component-sources/DESIGN.md);
the following lower-level API accepts already loaded strings:

```js
import { writeServerArtifact } from "@microsoft/fast-build/server.js";

writeServerArtifact(
    "./generated/server.artifact.json",
    {
        entry: "<my-card></my-card>",
        templates: { "my-card": "<h2>{{title}}</h2>" },
    },
    { overwrite: true },
);
```

`compileServerArtifact(entry, templates)` returns a fresh `Uint8Array` for
in-memory compilation. `writeServerArtifact` creates parent directories and
persists authored `inputs` and the compiled `program` together in one artifact.
Both are build-time JavaScript APIs backed by the Rust/WASM compiler.
Do not import the compiler into the request dependency graph.

## Native Node execution

`loadNativeHost()` resolves the installed platform package through Node package
resolution, independently of the working directory. See the
[hosting guide](./docs/native-node-host.md) for the supported platform/libc matrix,
deployment tracing, troubleshooting and explicit source provisioning.

```js
import { readFileSync } from "node:fs";
import { loadNativeHost } from "@microsoft/fast-build/native-host.mjs";

const Program = loadNativeHost();
const program = new Program(readFileSync("./generated/server.artifact.json"), {
    maxOutputBytes: 8 * 1024 * 1024,
    maxSteps: 1_000_000,
});
const bytes = program.renderEntryJson(
    Buffer.from('{"title":"Request-specific state"}', "utf8"),
);
const html = bytes.toString("utf8");
```

The shared Rust executor is required for server rendering. `.node` is Node.js's
standard native-addon extension; `.json` artifacts contain semantic template
data, not machine code. Loading validates the supported artifact schema once,
decoding wire operations directly into the typed native execution plan without
an intermediate JSON IR. Unreachable data is still validated before being discarded.

Custom provisioning remains available with
`loadNativeHost("/absolute/deployment/path/fast-build.node")`. The CLI accepts
`--native-addon`, configured `native-addon`, or `FAST_NATIVE_ADDON` overrides.
Loading never downloads a binary, invokes Cargo or falls back to JavaScript/WASM.
Keep the selected optional package and its `.node` file in server deployments;
this is not a browser or native-addon-free edge runtime.

The four synchronous methods are `renderEntryJson(state)`,
`renderTemplateJson(state)`, `renderHostJson(name, state)` and
`renderShadowJson(name, state)`. State must be an unshared Buffer containing
strict UTF-8 JSON. Each result is an independently owned UTF-8 Buffer.
Use entry-host rules for complete pages, template-context rules for root-host
attributes, named host rendering for a complete component, and shadow rendering
for a DSD fragment with resolved component state.

Options are validated and copied at construction:
`markersV2`, `dsd`, `attributeNameStrategy`, `maxOutputBytes` and `maxSteps`.
Use separate program instances for different policies. Budgets reset on each
request, including after a failure. Strings and arbitrary JavaScript objects
are not request inputs; object validation/serialization belongs to the application.
Every JSON field is validated, including unused values. Numbers must be finite,
Unicode must be well formed, and negative zero is normalized.

Hydration marker assembly uses bounded direct writes and stack-sized numeric
scratch, avoiding per-marker temporary strings while preserving marker bytes,
whole-marker output-limit checks and recoverable errors.

See the [artifact and request contract](./docs/server-modules.md) for wire data,
state/resource limits, errors, persistence and measurement boundaries.
Rust hosts load the same bytes with `CompiledArtifact::load`; see the
[Rust usage guide](../../crates/microsoft-fast-build/README.md).

## Profiling native rendering

From a repository checkout, `npm run profile:server -w @microsoft/fast-build`
adds focused artifact-load, Buffer-rendering, string-delivery and output-decoding
profiles to the native benchmark. Select workloads and explicitly configure the
source-built addon. Native stack sampling is optional and separate from V8 CPU
profiles; neither is a performance-improvement claim.
See the [native profiling guide](./docs/native-profiling.md) for commands, boundaries
and platform requirements.

The [shadow-output experiment](./docs/shadow-output-experiment.md) records a
rejected arena/range prototype and its reproducible Rust benchmark. Deeply nested
output improved, but sibling and small-page regressions ruled out adoption.

The [native marker benchmark report](./docs/native-marker-benchmarks/README.md)
records all 217 measured selectors, percentage timing changes, allocation and
memory results, and environment limitations for the marker-assembly optimization.

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
| `--native-addon="<path.node>"` | `FAST_NATIVE_ADDON`, then platform package | Optional custom Node addon path; overrides automatic package resolution. |
| `--server-artifact="<path.json>"` | _(none)_ | Retain authored inputs and the compiled entry/registry together for later builds. Matching inputs reuse compiled plans; state and rendering options remain fresh. |
| `--attribute-name-strategy="<strategy>"` | `camelCase` | Strategy for mapping HTML attribute names to state property names on custom elements. `"camelCase"` converts dashes to camelCase (e.g. `foo-bar` → `fooBar`). `"none"` preserves dashes (e.g. `foo-bar` → `foo-bar`). See [Attribute name strategy](#attribute-name-strategy). |
| `--markers_v2[=true/false]` | `false` | Emit FAST Element 2.x indexed hydration markers instead of the default FAST Element 3.x data-free markers. |
| `--config="<path>"` | `fast-build.config.json` | Path to a JSON configuration file. If omitted, `fast-build.config.json` in the current directory is used when present. CLI arguments take precedence over config values. See [Configuration file](#configuration-file). |

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
  "description": "Ahead-of-time server rendering."
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
    <p>Ahead-of-time server rendering.</p>
  </body>
</html>
```

### Reuse preparation independently of rendering

Retain a compiled entry and template registry across builds:

```sh
fast build --config=fast-build.config.json --server-artifact=generated/page.artifact.json
```

Every build validates current state and writes complete HTML. State, HTML output
paths and render options can vary while the same authored templates reuse their
compiled artifact.
Without `--server-artifact`, builds continue compiling fresh.

List each component in `components`. Duplicate tag names are errors. Omit
`components`, or use `[]`, for entry-only builds.

Keep `page.artifact.json` in a trusted local build cache. Matching embedded inputs
reuse its compiled bytes. Changed inputs compile a replacement and
publish it with one atomic rename. Missing artifacts recompile. Malformed envelopes
and unsupported versions fail closed; valid edited programs are not independently
checked against their inputs. Clean invalid files explicitly before rebuilding.

Set `"server-artifact": "generated/page.artifact.json"` in `fast-build.config.json` to configure
the same option. Config paths are relative to the config file; CLI paths are
relative to the working directory. Managed paths must be separate from authored
inputs and HTML output. See the [native artifact contract](./docs/server-modules.md)
for cache identity, diagnostics and file ownership.

### Missing or omitted state

State is optional. When `--state` is omitted and no `state` path is provided by config, `fast build` does not look for `state.json`; rendering uses an empty object (`{}`). An explicit `--state` path, or a `state` path from config, must exist or the command exits with an error.

When a binding value is not present in state:

- Content bindings render nothing, including unresolved dot paths: `<p>{{foo.bar}}</p>` becomes `<p></p>`.
- Attribute bindings omit the entire attribute, including unresolved dot paths: `<div class="{{foo.bar}}"></div>` becomes `<div></div>`.
- `<f-repeat>` treats a missing list binding, including unresolved dot paths, as an empty array and renders zero iterations. If the binding is present but is not an array, rendering still errors.

Explicit `null` also omits an attribute, even in an interpolated attribute
value. Empty strings remain present. Known HTML boolean attributes bound to
JSON booleans use presence/absence; ordinary attributes (including ARIA)
retain textual booleans. Use `?name` for browser-side truthy/falsy bindings.
Author bindings resolving to absence override template-host defaults.

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
of the single inner `<template>`, preserving every other authored byte. Use
`compose_f_template_styles(templateHtml, css)` for an inline string shorthand.

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

Unsafe CSS errors expose `sourceKind: "css"` and locations in the separately
supplied CSS. Stylesheet bodies are treated as literal HTML raw text throughout
build parsing, rendering, metadata discovery, and conversion, including
template-looking strings.

### APIs for build-time plugins

Parse definitions and compile the complete registry during the build:

```js
import { parse_f_templates } from "@microsoft/fast-build/wasm/microsoft_fast_build.js";
import { writeServerArtifact } from "@microsoft/fast-build/server.js";

const definitions = JSON.parse(parse_f_templates(templateHtml));
const templates = Object.fromEntries(
    definitions.filter(definition => definition.name !== null)
        .map(definition => [definition.name, definition]),
);
writeServerArtifact("./generated/components.json", { entry: "", templates }, {
    overwrite: true,
});
```

Load the artifact through `loadNativeHost()` or pass an explicit custom addon path.
`program.renderShadowJson("my-card", componentStateBytes)` returns the complete
DSD fragment, with hydration markers and nested components but without a
synthesized host or caller-owned light DOM. Pass resolved component JSON bytes.
Configure naming and marker policy when constructing the program.

`parse_f_templates` returns an array of records with `formatVersion: 1` and
`bindings`. Binding records expose `name` (null for compound expressions),
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
  matching their `expression` field.

```js
const [definition] = JSON.parse(parse_f_templates(templateHtml));
for (const binding of definition.bindings) {
    const { start, end } = binding.span;
    const authoredExpression = templateHtml.slice(start.offset, end.offset);
    console.log(`${start.line}:${start.column}`, authoredExpression);
}
```

Positions refer to the original, entity-encoded attribute text. Code samples are
excluded without shifting subsequent spans.
Callers associate the input with its file name and must regenerate metadata after
editing that input. Bindings and directives inside HTML comments remain unsupported.

Compilation rejects unsupported/malformed explicit metadata versions.
Unversioned maps and string definitions are accepted. The CLI keeps
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
definitions and templates carrying `shadowrootmode`
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

#### Structured errors

Failing compilation, conversion, composition, and metadata-validation APIs throw
actual JavaScript `Error` objects with a human-readable `message` and stable `code`.
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

The build WASM interface additionally exposes `sourceKind?: "css"` for errors
located in separately supplied CSS.

Use `code`, such as `unclosed-binding`, `repeat-not-array`, or `missing-template`,
instead of parsing messages. See the
[compiler and native error contracts](../../crates/microsoft-fast-build/README.md#error-handling)
and [converter errors](../../crates/microsoft-fast-convert/README.md#error-codes).

Locations use one-based lines and UTF-16 columns, with a UTF-16 highlight `length`.
Tabs count as one unit, non-BMP characters as two; CRLF is one line break and lone
CR/LF are also line breaks. A highlight covers the offending opening tag or
binding including its delimiters; an unclosed binding highlights its opening
delimiters. Unlike successful binding metadata, these are error-token ranges,
not trimmed expression ranges.

Entry-compilation and conversion coordinates refer to the original HTML argument,
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
can still be present without coordinates. `parse_f_templates` is a descriptive
parser; use compilation for template syntax validation.

A build integration can report compilation diagnostics:

```js
import { compileServerArtifact } from "@microsoft/fast-build/server.js";

try {
    compileServerArtifact(html, templates);
} catch (error) {
    if (!(error instanceof Error)) throw error;
    const location = error.line === undefined
        ? inputPath
        : `${inputPath}:${error.line}:${error.column}`;
    console.error(`${location} [${error.code}]: ${error.message}`);
}
```

Native loading and rendering fail with native `code` and `message` fields.
Runtime errors do not promise compiler source coordinates or partial HTML.

### Custom element templates

List exact component sources in the configuration file to expand custom elements
into [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom):

```shell
fast build --config=fast-build.config.json
```

Each listed HTML file must contain exactly one `<f-template>` definition whose
`name` matches the configured `tagName`. Unlisted files are ignored.

Template files must use the following format:

```html
<f-template name="my-button">
    <template>
        <button>{{label}}</button>
    </template>
</f-template>
```

The Rust parser follows browser tag boundaries for the `<f-template>` and inner
`<template>` wrappers, including ASCII whitespace before `>` in opening and closing tags.

The compiler resolves `shadowrootmode` from its non-empty authored value, then
`"open"`. It never synthesizes a `shadowroot` alias. Other `shadowroot*` attributes retain
their values and order. Whitespace, hydration markers, escaping, host defaults
and template content are preserved. Native DSD parsing requires Chrome/Edge 111+,
Firefox 123+ or Safari/iOS 16.4+. Upgrade guidance is in the
[migration index](./docs/migration.md).

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
  --config=fast-build.config.json \
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
    "components": [
        {
            "tagName": "my-button",
            "template": "./src/button/button.html"
        }
    ],
    "markers_v2": true
}
```

The CLI automatically loads `fast-build.config.json` from the current directory when it exists. To use a different file, pass `--config`:

```shell
fast build --config=configs/my-build.json
```

**Precedence:** CLI arguments always override config file values. For example, `--output=other.html` will override the `output` value in the config file.

**Path resolution:** Config paths, including component inputs, resolve relative
to the config file's directory, not the working directory. CLI paths use the
working directory.

All keys are optional. Keys are `entry`, `state`, `output`, `components`,
`native-addon`, `server-artifact`, `attribute-name-strategy`, and `markers_v2`.
Native rendering resolves the platform package unless `native-addon` or
`FAST_NATIVE_ADDON` selects a custom addon. Unknown keys
produce an error. `components` is an array and `markers_v2` is a JSON boolean;
other values are strings.
Omitted state uses `{}`; an explicitly supplied state file must exist.
CLI arguments override config values.

## Convert

`fast convert` generates browser modules or native artifacts from the same
explicit component records used by Build and Test Harness.

```shell
fast convert --config=fast-convert.config.json
fast convert --config=fast-convert.config.json --overwrite
fast convert --config=fast-convert.config.json --syntax=server-native --output=./generated/server.artifact.json
```

### Convert options

| Option | Default | Description |
|---|---|---|
| `--syntax="<syntax>"` | _(required)_ | Target syntax: `webui-prerelease`, `webui-framework-prerelease`, `fast-v3-ts`, or `server-native` |
| `--output="<path.json>"` | `server.artifact.json` | Native registry artifact path. Browser conversion uses each component's `generated` directory. |
| `--overwrite` | `false` | Allow replacing an existing output file. CLI presence always means `true`. |
| `--config="<path>"` | `fast-convert.config.json` | Path to a JSON configuration file. If omitted, `fast-convert.config.json` in the current directory is used when present. CLI arguments take precedence over config values. |

Only listed inputs are converted. Each HTML input must contain one definition
matching its `tagName`. Outputs use the tag name, not the input basename:
`<tagName>.template.ts` and optional `<tagName>.styles.ts` for `fast-v3-ts`,
or `<tagName>.webui.html` / `<tagName>.webui-framework.html` for HTML targets.
Missing output directories are created. Replacing files requires `--overwrite`
or `"overwrite": true`. Conversion and overwrite checks finish across the
whole batch before files are replaced; stale outputs are not removed.

`server-native` requires at least one named definition, rejects duplicate names and
TypeScript conversion flags, and emits an empty entry with the linked component
registry. `generated`, `clientModule`, and `className` remain unused metadata.
Use `renderHostJson` or `renderShadowJson` for those components; use
`compileServerArtifact(entry, templates)` to compile a complete page entry.

`webui-framework-prerelease` converts FAST's declarative syntax into the Microsoft WebUI Framework's declarative runtime syntax. `webui-prerelease` emits HTML for WebUI's FAST parser plugin. When `webui-framework-prerelease` strips an unsupported `f-slotted`/`f-children` directive, the CLI prints `Warning: <message>` to stderr for each stripped directive without failing the command.

For TypeScript generation, `clientModule` and `className` produce type-only
imports and explicit FAST export types. Normal TypeScript checking verifies
the named class and binding properties. Client code is not evaluated.

### Convert configuration file

`fast-convert.config.json` follows the same precedence and config-relative path
rules as `fast-build.config.json`:

```json
{
    "syntax": "fast-v3-ts",
    "components": [
        {
            "tagName": "m-fast-card",
            "template": "./src/components/card/card.html",
            "stylesheet": "./src/components/card/card.css",
            "clientModule": "./src/components/card/card.ts",
            "className": "FastCard",
            "generated": "./src/components/card/generated/"
        }
    ],
    "overwrite": false
}
```

Configuration keys are `syntax`, `components`, `output`, and `overwrite`.
`components` is an array, `overwrite` is a boolean, and other values are strings.
TypeScript generation requires the class/module/output fields; HTML targets
require only `tagName`, `template`, and `generated`; native artifacts require
only `tagName` and `template`. `stylesheet` is optional and converted separately
only for TypeScript generation. SSR preserves authored stylesheet markup.

Build uses the same `components` array but never generates client modules.
Additional Node integrations import `validateComponentSources` and
`resolveComponentSources` from `@microsoft/fast-build/component-sources.js`.
See the [canonical contract](./docs/component-sources/DESIGN.md) for base
directories, symlinks, collisions, output names, and operation boundaries.

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
Companion type-checking tests verify generated binding types with the TypeScript
compiler API.

## Template syntax

Bindings and FAST directive markup inside HTML comments are unsupported.
Commenting out bound markup does not reliably disable its bindings and can cause
rendering errors or client hydration mismatches. Remove unused bound markup
instead, and keep explanatory comments free of binding syntax and FAST directive
tags.

Template syntax follows the FAST declarative HTML format. See the
[`@microsoft/fast-element` declarative documentation](../fast-element/docs/declarative/syntax.md)
for full documentation on bindings, conditionals, repeats, and directives.

## Migration guidance

See the [migration index](./docs/migration.md).
