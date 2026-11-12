# Design - @microsoft/fast-build

**Dependency policy:** FAST packages must remain free of regular npm dependencies.
Development, peer and optional dependencies are separate.

## Build and execution ownership

`server.js` loads compiler WASM only at build time and delegates all HTML
parsing/lowering to Rust. It returns ESM importing `server-runtime.mjs`.
The helper is the sole request execution engine. It has no imports or compiler,
WASM, parser, browser, serialization or source-evaluation dependency.
See [the full module/state contract](./docs/server-modules.md).

The native Rust evaluator, WASM render exports, prepared file/cache/watch host,
portable instruction artifacts and simulated stream APIs are removed, not hidden
behind compatibility exports.

## CLI

`fast build` loads entry/registry files, compiles AOT source, imports that source,
parses optional state JSON, executes `renderEntry` and writes complete HTML.
It is a build tool, not a request handler. The `--aot` and `--stream` flags
are rejected with migration errors; `stream` is no longer a configuration key.
Omitted state becomes an empty object, without implicitly loading state.json.
Config paths are relative to the config file, CLI paths to CWD. Explicit CLI
presence overrides config, including empty paths. Boolean options are validated.

`fast convert --syntax=server-js` links all named template inputs into one ESM
module. It rejects duplicate names, empty registries, wildcard output paths and
browser-only TypeScript options. Target metadata comes from compiler WASM.
Browser conversion and CSS conversion remain in the independent converter crate.

## Files

| File | Role |
|---|---|
| `server.js` / `server.d.ts` | Build-time compiler, ServerTemplateDefinition and generated-module types |
| `server-runtime.mjs` | The single server-only request helper implementation |
| `bin/fast.js` | CLI/configuration, glob scanning and file I/O |
| `build-wasm.cjs` | Builds the compiler and converter WASM wrappers |
| `wasm/` | Generated build-time bindings and binaries |
| `test/server.test.js` | Frozen byte contracts, state validation, syntax, deployment and hydration fixtures |
| `test/performance/` | Shared output-baseline tests and fresh-process AOT measurements |

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

Plugins compile server ESM and call its `renderShadow` for a complete DSD
fragment using resolved component state, without creating a throwaway host or
slicing serialized HTML. Host/light-DOM ownership stays with the caller.
Entry/host/fragment exports share generated shadow functions and fresh marker scopes.

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
- The inner content of the `<template>` child element becomes the raw template string sent to the compiler.
- Any `shadowroot`-prefixed attributes on `<f-template>` become `shadowrootAttributes` metadata that the compiler applies to the emitted Declarative Shadow DOM `<template>`.
- Any attributes declared on the inner `<template>` element become `hostAttributes` metadata (parallel to `shadowrootAttributes`). The compiler merges these onto the rendered host element opening tag, with author host attributes winning on conflicts. See the [`microsoft-fast-build` DESIGN.md](../../crates/microsoft-fast-build/DESIGN.md) for the full propagation rules (client-only attrs are skipped, `{{expr}}` / `?name="{{expr}}"` are resolved against the element's child state, etc.).
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


## Diagnostics and qualification

Compile failures preserve structured codes, authored UTF-16 coordinates and
template names. Malformed skipped bodies fail during compilation.
Runtime invalid state/options throw TypeError; a present non-array repeat
throws `repeat-not-array`. Runtime value errors need not carry source coordinates.
Build-tool composition mappings remain independent of request execution.

Historical prepared-renderer output hashes remain frozen test data, not a
retained execution backend. Existing native/Node rendering assertions run on
generated JavaScript through test-only adapters. Vite integration builds and
relocates generated ESM, then renders without authored inputs or compilation.
The benchmark reports AOT import/first render, warmed CPU/wall time, process
memory/GC, source bytes and output hashes. Historical direct/prepared comparisons
are recorded in server-modules.md and are no longer runnable shipping paths.
