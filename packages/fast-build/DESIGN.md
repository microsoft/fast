# Design — @microsoft/fast-build

This document describes the internal architecture of the `@microsoft/fast-build` package.

---

## High-level overview

Bindings and FAST directive markup inside HTML comments are unsupported by the
declarative rendering contract. The renderer and client use string scanning that
does not reliably exclude comment contents; authors must remove unused bound
markup rather than comment it out. No comment filtering or validation is implied.

`@microsoft/fast-build` is a Node.js CLI tool that server-side renders FAST declarative HTML templates and converts FAST declarative template files to other supported syntaxes. It delegates template rendering to a WebAssembly module compiled from the [`microsoft-fast-build`](../../crates/microsoft-fast-build) Rust crate and conversion to the `microsoft-fast-convert` WASM module generated under `wasm/convert/`. The Node.js layer is responsible only for:

1. Dispatching `fast build` and `fast convert`
2. Parsing CLI arguments and loading configuration
3. Locating and parsing template HTML files (glob scanning + `<f-template>` extraction)
4. Loading the entry HTML file and optional state JSON file
5. Calling the WASM renderer in HTML or stream mode
6. Validating converter paths and calling the converter WASM
7. Writing the rendered or converted output file, or raw stream chunks to stdout

```
fast build [options]
        │
        ▼
  parseArgs(argv)        ← --entry, --state, --output, --templates, --attribute-name-strategy, --markers_v2, --config, --stream
        │
        ├─ loadConfig(configPath)             ← load fast-build.config.json
        │       │
        │       ├─ explicit --config path     ← error if file missing
        │       └─ default CWD lookup         ← silent fallback if missing
        │
        ├─ resolveOption(args, config, …)     ← CLI args override config values
        ├─ resolveBooleanOption(args, config, "stream")
        │
        ├─ wasm = require(BUILD_WASM_MODULE)   ← load WASM first
        │
        ├─ resolvePattern(pattern, wasm)  ← for each comma-separated --templates glob
        │       │
        │       ├─ staticPrefixDir(pattern)  ← determine which dir to walk
        │       ├─ walkHtmlFiles(dir)        ← collect .html files
        │       ├─ globMatch(pattern, file)  ← filter by pattern
        │       └─ parseFTemplates(html, filePath, wasm)
        │                │
        │                └─ wasm.parse_f_templates(html)  ← Rust parses <f-template>
        │
        ├─ fs.readFileSync(entry)   ← entry HTML template
        ├─ fs.readFileSync(state)   ← state JSON, only when explicitly provided
        │       └─ omitted state → WASM receives no state and renders with {}
        │
        ▼
  stream?
     ├─ false
     │    ├─ templates loaded → wasm.render_entry_with_templates(entry, JSON.stringify(templatesMap), state?, strategy, false, markers_v2)
     │    └─ no templates     → wasm.render(entry, state?)
     │              ▼
     │        fs.writeFileSync(output, rendered)
     └─ true  → wasm.render_entry_with_templates(entry, JSON.stringify(templatesMap), state?, strategy, true, markers_v2)
                    ▼
              JSON.parse(chunksJson) → process.stdout.write(chunk)
```

`fast convert` uses the same CLI/config merge pattern but loads `fast-convert.config.json` by default:

```
fast convert [options]
        │
        ▼
  parseArgs(argv)        ← --syntax, --templates, --output, --overwrite,
        │                  --type-source, --type-source-import, --config
        │
        ├─ loadConfig(configPath)             ← load fast-convert.config.json
        ├─ resolveOption(args, config, …)     ← CLI args override config values
        ├─ resolvePresenceBooleanOption(args, config, "overwrite")
        ├─ error if --templates is missing
        ├─ wasm = require(CONVERT_WASM_MODULE) ← load wasm/convert/microsoft_fast_convert.js (once, even for a single file)
        │
        └─ runConvertBatch: resolveTemplateFiles(pattern) per comma-separated
                  pattern, dedupe matches, warn (not error) on zero matches, then for
                  each matched file: validate syntax/output paths and extensions,
                  wasm.convert_template_with_options(templateHtml, syntax, typeSource, typeSourceImport), write output
        ▼
  fs.writeFileSync(output, converted)   ← output parent directory is created (mkdir -p) if missing
```

---

## Module map

| File | Role |
|------|------|
| `bin/fast.js` | CLI entry point — argument parsing, config file loading, file I/O, template scanning, WASM dispatch |
| `build-wasm.cjs` | Package build helper that builds the renderer WASM and converter WASM into `wasm/convert/` |
| `wasm/microsoft_fast_build.js` | WASM-generated JS bindings for the Rust renderer |
| `wasm/microsoft_fast_build_bg.wasm` | Compiled Rust renderer binary |
| `wasm/convert/microsoft_fast_convert.js` | WASM-generated JS bindings for the Rust converter |
| `wasm/convert/microsoft_fast_convert_bg.wasm` | Compiled Rust converter binary |
| `test/performance/fixtures.mjs` | Generates WASM workloads from the shared Rust benchmark corpus |
| `test/performance/render-entry.mjs` | Fresh-child WASM timing, memory, hash comparison, and opt-in scaling checks |
| `test/performance/performance.test.mjs` | Byte/hash/marker parity against pre-optimization goldens in both marker modes |

---

## Configuration file — `loadConfig`

The CLI supports optional JSON configuration files that provide default values for command options. `fast build` loads `fast-build.config.json` by default. `fast convert` loads `fast-convert.config.json` by default. This avoids repeating long argument lists in scripts and CI pipelines.

### Resolution order

1. If `--config=<path>` is provided, that file is loaded. An error is raised if the file does not exist.
2. If `--config` is not provided, the command-specific default config in the current working directory is loaded if it exists. If it does not exist, no config is applied (silent fallback).

### Merge semantics

CLI arguments always take precedence over config file values. The merge uses **presence-based** checking (`hasOwnProperty`), not truthiness, so an explicit `--entry=` on the command line will override a config file's `entry` value even if the CLI value is an empty string.

When a value is not provided by either source, built-in defaults apply (`index.html`, `output.html`). State is optional: if neither CLI nor config provides `state`, the CLI does not look for a state file and calls WASM without a state value, which renders as `{}`. This is a breaking change from earlier CLI behavior that implicitly loaded `state.json` from the current working directory when present.

### Path resolution

File paths read from the config file (`entry`, `state`, `output`, and `templates`) are resolved relative to the **config file's directory**, not the current working directory. This ensures configs work correctly regardless of where the CLI is invoked from.

CLI-provided paths are resolved relative to the current working directory (the default Node.js behaviour).

### Validation

The config file must be a JSON object. Build config keys must be one of `entry`, `state`, `output`, `templates`, `attribute-name-strategy`, `markers_v2`, or `stream`; `markers_v2` and `stream` must be JSON booleans and other values must be strings. Convert config keys must be one of `syntax`, `templates`, `output`, `overwrite`, `type-source`, or `type-source-import`; `overwrite` must be a JSON boolean and other values must be strings. Unknown keys and invalid value types produce an error referencing the config file path.

### Helpers

| Function | Role |
|----------|------|
| `loadConfig(configPath)` | Reads, parses, and validates the config file. Returns `{ config, configDir }`. |
| `resolveOption(args, config, configDir, key, defaultValue)` | Returns the CLI arg if present, otherwise the config value (with path resolution), otherwise the default. The caller separately tracks whether `state` was explicitly provided so an explicit missing state file errors while omitted state is passed through to WASM as `{}`. |
| `resolveBooleanOption(args, config, key)` | Resolves boolean options such as `stream`, with CLI values taking precedence over config booleans. |
| `resolvePresenceBooleanOption(args, config, key)` | Resolves presence-only booleans such as converter `overwrite`, where CLI presence always means `true`. |

---

## Template loading — `parseFTemplates`

Parsed definitions now include versioned binding metadata. The JavaScript layer
retains these fields while removing only `name` to form the keyed render map;
binding discovery and version validation remain Rust-owned. Each generated
definition has `formatVersion: 1`; renderer entry points reject explicit
incompatible versions while accepting legacy unversioned definitions.
`bindings` describe syntax/lexical scopes with explicit unknown state types
and optionality, not an inferred application schema.

Every binding occurrence now includes an authored `span` with inclusive `start`
and exclusive `end` positions. Offsets are zero-based UTF-16 code units; lines
and UTF-16 columns are one-based. CRLF counts as one break, while lone CR and LF
also start a new line. Spans cover trimmed expressions (the iterable for repeats)
in the complete input to `parse_f_templates`, including document prefixes, rather
than the returned trimmed content. Existing lexical scopes and raw attribute
entity spelling are preserved.

Location discovery remains Rust-owned. The CLI retains spans with the rest of
the binding metadata; no expression search or JavaScript coordinate conversion
is needed. Format version 1 remains compatible: renderers do not consume spans
and continue accepting older records without them. Regenerate older metadata
when authored diagnostics need locations.

Plugins can call the exported `render_shadow_root` directly for a complete DSD
fragment using resolved component state, without creating a throwaway host or
slicing serialized HTML. Host/light-DOM ownership stays with the caller.
Normal/stream/fragment paths share native shadow rendering and marker scopes.

The additive `extract_template_slots(html, templateName)` export returns JSON
`TemplateSlot` records (`name`, `line`, `column`) from the original complete HTML,
without composing CSS, escaping code samples, or rendering. Rust owns HTML
tokenization, tree construction, namespaces, entity decoding, selection, and
coordinate conversion; JavaScript has no duplicate parser. Only this analysis
path uses the standards parser; `parse_f_templates` and rendering keep their
existing scanners and format-version behavior.

Selection requires one case-sensitive decoded definition name and one direct
HTML template child. Slots retain authored order/duplicates and one-based
line/UTF-16-column locations at `<`. Ordinary nested templates and FAST
conditional/repeated bodies are inspected once without state evaluation.
Nested definitions and templates marked with `shadowrootmode` or `shadowroot`
are excluded as separate authored scopes. HTML integration points are traversed,
but foreign-namespace slots are excluded. HTML error recovery is permitted;
scripts never run, and `noscript` uses scripting-enabled tokenization.

Invalid or ambiguous selection throws the existing structured errors rather
than returning `[]`; only a valid slot-free component returns an empty array.
Plugins pass original source before style composition or other transformations
and retain its file association. The API cannot infer original coordinates from
already-transformed input. See the package README for the complete discovery
and failure contract.

Template HTML files are scanned for `<f-template>` elements. Each `<f-template>` with a `name` attribute contributes one entry to the templates map:

```html
<f-template name="my-button">
    <template>
        <button>{{label}}</button>
    </template>
</f-template>
```

- The `name` attribute value becomes the element name key in the templates map.
- The inner content of the `<template>` child element becomes the raw template string sent to the WASM renderer.
- Any `shadowroot`-prefixed attributes on `<f-template>` become `shadowrootAttributes` metadata that the WASM renderer applies to the emitted Declarative Shadow DOM `<template>`.
- Any attributes declared on the inner `<template>` element become `hostAttributes` metadata (parallel to `shadowrootAttributes`). The WASM renderer merges these onto the rendered host element opening tag, with author host attributes winning on conflicts. See the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for the full propagation rules (client-only attrs are skipped, `{{expr}}` / `?name="{{expr}}"` are resolved against the element's child state, etc.).
- A file may contain multiple `<f-template>` elements (each becomes a separate entry).
- If an `<f-template>` has no `name` attribute, a warning is printed to stderr and it is skipped.
- The Rust parser follows browser tag boundaries for the `<f-template>` and inner `<template>` wrappers, including ASCII whitespace before `>` in opening and closing tags.

### Helpers

| Function | Role |
|----------|------|
| `parseFTemplates(html, filePath, wasm)` | Calls `wasm.parse_f_templates(html)` and emits warnings for nameless templates. Returns `{name, content, shadowrootAttributes, hostAttributes}` entries. |

The `<f-template>` parsing logic lives exclusively in the Rust crate (`locator::parse_f_templates`) and is exposed via the `wasm.parse_f_templates` WASM export. The JS layer only handles warnings and file I/O; it contains no duplicate parsing logic.

---

## Glob pattern scanning

Glob patterns support:

| Syntax | Meaning |
|--------|---------|
| `*` | Any characters within one path segment |
| `**` | Zero or more path segments |
| `?` | Any single character within a segment |
| exact path | A literal file path with no wildcards — matches exactly that file |

The scanner works in three steps:

1. **`staticPrefixDir(pattern)`** — extracts the longest static directory prefix before the first wildcard. For exact paths (no wildcards), returns the parent directory.
2. **`walkHtmlFiles(dir)`** — recursively collects all `.html` files under the prefix directory.
3. **`globMatch(pattern, filePath)`** — filters the collected files to those matching the full pattern.

This means exact file paths like `"./components/my-button.html"` are fully supported alongside glob patterns.

---

## Converter output rules

The opt-in `typed` CLI/config boolean is passed as the appended optional WASM
argument. It annotates template/style exports with FAST types for
`isolatedDeclarations`; default conversion is unchanged and unsupported target
syntaxes fail. Explicit CLI false overrides configured true.

`fast convert` accepts a required target `syntax` and a required `templates`
source: a comma-separated glob pattern list (an exact single file path is also
accepted, since it is just a pattern with no wildcard). The converter WASM
module is loaded once and every matched file is converted in the same process,
whether `templates` resolves to one file or many. `templates` is resolved with
`resolveTemplateFiles`, which reuses the same
`staticPrefixDir`/`walkHtmlFiles`/`globMatch` primitives as `fast build`'s
`resolvePattern`, but returns whole matched file paths without any
`<f-template>` parsing, since convert operates on entire files. Only `.html`
files are ever matched — non-`.html` files and directories are silently
excluded by `walkHtmlFiles`, not rejected with a validation error.

| Syntax | Output extension | Default suffix |
|--------|------------------|----------------|
| `webui-prerelease` | `.html` | `.webui.html` |
| `webui-framework-prerelease` | `.html` | `.webui-framework.html` |
| `fast-v3-ts` | `.ts` | `.template.ts` |

When `output` is omitted, the CLI writes next to each input template using the
default suffix. When `output` is provided, every `*` is replaced with each
input's basename without its `.html` extension, so the same `--output`
pattern can target a batch of files. CLI-provided `templates`/`output` paths
use normal current-working-directory resolution; config-provided paths are
resolved relative to the config file before the default suffix or `*`
replacement is applied.

Before loading converter WASM, the CLI validates that:

- The selected syntax is supported.
- `templates` is provided.
- The output extension matches the selected syntax.
- The output path is not a directory.
- An existing output file is only replaced when `--overwrite` is present or
  config contains `"overwrite": true`.

The output parent directory is created automatically (`mkdir -p` semantics) if
it does not exist; only an existing non-directory at that path is rejected. A
glob pattern that matches zero files produces a warning (not an error) naming
the pattern, and the command only fails if every pattern produces zero matches
across the whole invocation.

The converter WASM contract is `convert_template(template: string, syntax:
string): string` plus `convert_template_with_options(template: string, syntax:
string, typeSource?: string, typeSourceImport?: string): string` and
`convert_syntax_metadata(): string`. The CLI always calls
`convert_template_with_options`, passing through `--type-source` /
`--type-source-import` (or their config equivalents) as `typeSource` /
`typeSourceImport`, which are `undefined` when not provided. Rust owns FAST
declarative syntax validation, conversion semantics, accepted syntax names, output
extensions, default suffixes, and `type-source`/`type-source-import` validation
(only valid for `fast-v3-ts`; `type-source-import` requires `type-source`). The
JavaScript layer reads syntax metadata from WASM and only handles CLI/config
merging, path rules, file discovery, and file I/O — it does not duplicate that
validation, so converter errors surface through the WASM call and the
top-level `main().catch()` handler.

---

## Converter fixture validation

Converter fixture inputs live under `test/fixtures/convert/`. Each fixture
directory includes a committed `fast-convert.config.json`, and the fixture tests
run `fast convert` from those directories without `--config` to verify default
config discovery. The fixture configs write generated output to
`test/.fixture-output/`, which is created and removed by the fixture test so
converted `.html` and `.ts` outputs are not checked in. The
`test:fixtures:convert` package script runs the fixture-only validation, and
`test:node` includes it so CI validates both `webui-prerelease` and
`fast-v3-ts` through the real `fast convert` CLI, including a `--templates`
batch conversion against the real converter WASM. CLI-level coverage of
`webui-framework-prerelease` (including its strip-with-warning behavior for
`f-slotted`/`f-children`) lives in `test/config.test.js` rather than the shared
fixture, since it exercises a stricter grammar than `supported.html` is written
against.

`test/fixtures/convert/type-source.test.js` covers `--type-source` /
`--type-source-import` against `supported.html`, which combines multiple
differently-named `f-ref`/`f-children`/`f-slotted` directives — the exact shape
that broke standalone type-checking once a real `TSource` is supplied (see
[`microsoft-fast-convert` DESIGN.md](../../crates/microsoft-fast-convert/DESIGN.md#explicit-tsource-generic)).
It writes a companion `fixture-card.ts` element type and type-checks the
generated `.template.ts` output against it with the TypeScript compiler API
(`typescript.createProgram` / `getPreEmitDiagnostics`), asserting zero
diagnostics, plus a negative case asserting a mismatched directive property name
does fail to type-check. This test uses its own `test/.fixture-output-type-source/`
directory — separate from `test/.fixture-output/` — because Node's test runner
runs test files concurrently and `convert-fixtures.test.js` clears the shared
`.fixture-output/` directory between its own tests.

---

## WASM integration

Stylesheet delivery composition is native-owned. The renderer WASM's
`compose_f_template_styles_with_options(html, options)` accepts an inline/external
discriminated union and returns a handle retaining `.html` and source provenance.
Mapping methods accept UTF-16 document spans or document/selected-content
diagnostics and return JSON identifying HTML, CSS, or generated text. Generated
markup never receives authored coordinates; invalid/cross-source ranges fail.
The versioned `source_map` JSON exposes original inputs and insertion offsets.
Consumers retain the handle and file association until mapping is complete,
then free it. No parsing or coordinate conversion is duplicated in JavaScript.

Generated inline fallbacks use `data-fast-ssr-style`; external composition uses
caller-supplied public URLs. Both insert first without rewriting existing source.
Adoption, fallback removal, CSP nonce handling, and asset serving are not
implemented by this API. Conversion preserves raw CSS and link/marker attributes;
CSS-looking binding syntax is no longer interpreted in style bodies.

The build WASM module exposes rendering and metadata functions; the CLI uses the entry renderer when templates are loaded or streaming is requested:

| Function | Used when |
|----------|-----------|
| `wasm.render(entry, state?)` | No custom element templates. Omitted state renders as `{}`. |
| `wasm.render_with_templates(entry, templatesJson, state?, strategy, markers_v2?)` | JS consumers that need non-entry template rendering with custom elements. Omitted state renders as `{}`. `strategy` is `"camelCase"` or `"none"`. `markers_v2` emits FAST Element 2.x indexed hydration markers. |
| `wasm.render_entry_with_templates(entry, templatesJson, state?, strategy, stream?, markers_v2?)` | CLI entry HTML rendering when at least one template was loaded, and CLI `--stream` rendering when `stream` is `true`. Omitted state renders as `{}`. `strategy` is `"camelCase"` or `"none"`. With `stream: true`, returns a JSON array string of raw HTML chunks. `markers_v2` emits FAST Element 2.x indexed hydration markers. |
| `wasm.parse_f_templates(html)` | Parsing `<f-template>` elements from each matched HTML file |
| `wasm.extract_template_slots(html, name)` | Inspecting a selected definition's authored slot declarations and original line/UTF-16-column locations, without rendering |
| `wasm.render_shadow_root(name, templatesJson, state?, strategy?, markers_v2?)` | Plugins that own their host and light DOM, passing resolved component state |

`templatesJson` is a JSON-stringified object mapping element names to template metadata objects. Each object contains the raw inner template string extracted from `<template>` inside `<f-template>`, any forwarded `shadowrootAttributes`, and a `hostAttributes` array carrying the attributes declared on the inner `<template>` element. The WASM renderer uses this map to resolve custom element tags and inject Declarative Shadow DOM, copying `shadowroot*` attributes to the emitted `<template>` and merging `hostAttributes` onto the rendered host element opening tag (author host attributes win on conflicts; client-only attrs and `{{expr}}` / `?name="{{expr}}"` bindings are handled by the WASM renderer — see the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for details). It normalizes `shadowrootmode` and legacy `shadowroot` for compatibility: when neither has a non-empty value, it emits `shadowrootmode="open" shadowroot="open"`; when exactly one has a non-empty value, that value is mirrored to the other; when both have explicit non-empty values, both are preserved as authored, even if they conflict.

See the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for details on the Rust rendering pipeline.

Normal and compatibility-stream rendering share a forward Rust event scanner
and atomic plain-tag handler. Discovery stops at the next tag or binding instead
of performing independent searches over the remaining entry suffix for every
host. Existing WASM positional arguments remain compatible. This does not make
rendering asynchronous or introduce prepared/compiled template handles.

The converter WASM module is loaded from
`wasm/convert/microsoft_fast_convert.js` and must export `convert_template(template,
syntax)`, `convert_template_with_options(template, syntax, typeSource?,
typeSourceImport?, typed?)`, and `convert_syntax_metadata()`. `convert_template_with_options`
receives the source `.html` template contents, the selected syntax
(`webui-prerelease`, `webui-framework-prerelease`, or `fast-v3-ts`), and optional `typeSource` /
`typeSourceImport` strings, returning a `{ output, warnings }` object (`output` the
converted file contents, `warnings` an array of warning message strings — currently
only populated when `webui-framework-prerelease` strips an unsupported `f-slotted`/`f-children`
directive) and throwing on conversion or validation errors (including `type-source`
misuse). The CLI writes `output` to the resolved output file and prints each
`warnings` entry to stderr as `Warning: <message>` without failing the command.

### Structured diagnostics

Both WASM wrappers construct native JavaScript `Error` objects with unchanged
display messages, a stable `code`, and optional `line`, `column`, `length`, and
`templateName`. Generated declarations export `FastBuildError` from each module.
The CLI already prefers `error.message`, preserving its existing stderr format.
See the [public contract and code lists](./README.md#structured-errors).

Rust scanners capture source ranges on failure. Recursive slices rebase those
ranges explicitly; template-definition boundaries assign names and stop entry
rebasing. The renderer reverses only its known code-sample expansions on the
error path. Conversion preserves the extracted template offset and reverses the
publisher opening-tag rewrite. No integration searches snippets or reparses
messages. Non-HTML failures omit coordinates. Metadata discovery remains
permissive, successful output/warnings are unchanged, and fast-element's client
runtime is not modified.

---

## Stream output

`--stream`, `--stream=true`, and `--stream=false` are parsed as CLI boolean
forms. `fast-build.config.json` also accepts `"stream": true` or
`"stream": false`. CLI arguments take precedence, so `--stream=false` disables
streaming even when the config enables it.

When streaming is enabled, the CLI always calls
`wasm.render_entry_with_templates(..., true)`, passing `{}` for `templatesJson`
when no templates were loaded. With `stream` set to `true`, the WASM export
returns a JSON array string. The CLI validates that the parsed value is an array
of strings and writes each chunk to stdout without separators.

Streaming mode does not write `--output`, does not print `Built: ...`, and does
not warn when `--templates` is omitted. Non-streaming output remains unchanged.
Chunk construction happens in Rust before the WASM call returns, so this is
simulated streaming rather than a lazy Node.js `ReadableStream`.

## Performance validation

`bench:render` runs the packaged WASM export in fresh child processes. Each child
warms up with at most 1,000 instances by default, forces GC, measures one synchronous render, and reports wall/CPU time,
JSON stringify time, input/output sizes, and before/after memory. OS peak RSS
comes from `process.resourceUsage()`; the parent samples RSS every 100 ms on
macOS/Linux because a timer in the blocked child cannot observe the render.
Peak memory includes warmup and verification. Internal WASM phases and memory
pages are not exposed and are not claimed as measured.

Both the Rust and Node generators read
`crates/microsoft-fast-build/benches/fixtures/corpus.json`. Normal package tests
compare output hashes, byte counts, marker counts, and joined legacy chunks
against a shared pre-optimization golden at 0/1/2/1,000 instances in both marker
modes. Native tests verify the same golden, preventing fixture generators from
drifting unnoticed.

Benchmark reports are explicitly written to new files only. `--compare` checks
byte/hash parity and reports speedups; `--check-scaling` is opt-in for stable
hosts, not enabled in normal PR tests. See the crate's
[`benchmark baseline guide`](../../crates/microsoft-fast-build/benchmark-baselines/README.md)
for exact commands, workload sizes, measurement limitations, and later milestones.

Post-scanner profiling combines bounded measurements of the actual packaged
WASM with separate symbolized native render/locator phases. Repeat fixtures
and attribute-overlay controls expose the cost of copying child state; native
setup percentages are not treated as end-to-end WASM percentages. The recorded
outputs are checked against native rendering. Profiling does not alter this
package's production build, exports, or streaming behavior.

Native allocation baselines are collected by an opt-in Rust development example
and a fresh-process runner under the crate's `benches/` directory. The npm CLI
and shipped WASM do not use its allocator or feature. Shared output hashes
preserve cross-language parity; native current-thread allocation volume and
peak newly-live heap must not be presented as Node RSS or WASM memory usage.

---

## Error handling

| Condition | Behaviour |
|-----------|-----------|
| `--config` file not found (explicit) | Print error to stderr; exit code 1 |
| Default `fast-build.config.json` not found | Silent; no config applied |
| Config file is invalid JSON | Print error to stderr; exit code 1 |
| Config file is not a JSON object | Print error to stderr; exit code 1 |
| Config file has unknown key | Print error to stderr; exit code 1 |
| Config file has non-string value | Print error to stderr; exit code 1 |
| `--entry` file not found | Print error to stderr; exit code 1 |
| Explicit `--state` or config `state` file not found | Print error to stderr; exit code 1 |
| State omitted | Do not check `state.json`; render with an empty state object (`{}`); breaking change from earlier implicit `state.json` loading |
| `--templates` not provided | Warning to stderr in non-streaming mode; rendering continues without custom elements |
| `--attribute-name-strategy` invalid value | Print error to stderr; exit code 1 |
| `--stream` value is not `true`, `false`, or empty | Print error to stderr; exit code 1 |
| Convert `--syntax` omitted or unsupported | Print error with supported syntaxes to stderr; exit code 1 |
| Convert `--templates` omitted | Print error to stderr; exit code 1 |
| Convert `--templates` pattern matches no files | Warning to stderr; pattern is skipped, not an error |
| Convert output extension does not match syntax | Print error to stderr; exit code 1 |
| Convert output parent directory missing | Created automatically (`mkdir -p` semantics) |
| Convert output path is a directory | Print error to stderr; exit code 1 |
| Convert output exists without overwrite | Print error to stderr; exit code 1 |
| Convert `--type-source` used with a syntax other than `fast-v3-ts` | Converter WASM throws; printed to stderr; exit code 1 |
| Convert `--type-source-import` used without `--type-source` | Converter WASM throws; printed to stderr; exit code 1 |
| Convert `--type-source` is not a dotted identifier | Converter WASM throws; printed to stderr; exit code 1 |
| Converter WASM export missing | Print error to stderr; exit code 1 |
| Converter WASM throws | Print error to stderr; exit code 1 |
| Pattern matches no files | Warning to stderr; pattern is skipped |
| `<f-template>` without `name` | Warning to stderr; template is skipped |
| Duplicate template name across files | Warning to stderr; later entry overwrites earlier |
| Streaming WASM export missing | Print error to stderr; exit code 1 |
| Streaming WASM return is not a JSON string array | Print error to stderr; exit code 1 |
| WASM render error | Print error to stderr; exit code 1 |
