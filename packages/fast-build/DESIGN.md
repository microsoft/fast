# Design - @microsoft/fast-build

**Dependency policy:** FAST packages must remain free of regular npm dependencies.
Development, peer and optional dependencies are separate.

## Build and execution ownership

`server.js` loads compiler WASM only at build time and delegates all HTML
parsing/lowering to Rust. `compileServerModule` returns ESM importing
`server-runtime.mjs`; `compileServerArtifact` returns bytes for the supported
native Rust executor. Both use the same compiler-owned executable IR.
The helper is the JavaScript target's request engine. It has no imports or compiler,
WASM, parser, browser, serialization or source-evaluation dependency.
See [the full module/state contract](./docs/server-modules.md).

Rust interns identical executable bodies and factors repeated JavaScript element
shapes into shared functions with instance-specific constant records. Different
indexes, dataset values or inline styles do not require another executable
function when their recipes and light DOM match. Single-use shapes remain
directly emitted, and compound property literals retain per-call ownership.
This is an internal compiler optimization; exported APIs, helper contract,
artifact schema, rendering bytes and hydration behavior are unchanged. Existing
compiler fingerprint checks still require artifacts to be regenerated on upgrade.

Static markup is compacted in the shared Rust lowering pipeline: adjacent literal
writes and attribute fragments are joined, and ordinary tags become literal bytes
only when hydration cannot change their output. Literal-only JavaScript bodies
return constants directly. Tags with whitespace/stripping differences, markers,
bindings, nested components or host semantics retain the required execution.
The large-static-template benchmark covers distinct definitions with small bound
regions; this optimization does not change the public rendering or artifact APIs.

Native `CompiledArtifact` loading/rendering does not parse
authored HTML or execute JavaScript. Version/compiler/helper metadata and all
executable references/opcodes are validated on load; immutable `Send + Sync`
ownership and request-local state/error/resource limits are documented in the
[native contract](./docs/server-modules.md#native-rust-artifact-target).
There is no C ABI or working .NET binding yet; those are explicitly deferred.

Minor prerelease classification does not make removed APIs a drop-in upgrade.
State acceptance/normalization, native resource defaults, artifact fingerprint
checks, borrowed request inputs, owned results/errors and thread-safe artifact
reuse are compatibility contracts. Allocation reductions may remain internal;
changing those guarantees requires consumer migration. Native budgets do not
imply equivalent FAST budgets in the JS target.

### Compiled access and repeat frames

The Rust emitter interns path accessors and resolves potential lexical aliases
into numeric slots. The helper caches array-index decoding at module import,
specializes single-key root and single-alias lookups, and selects the newest
matching alias when dotted prefixes overlap. It preserves own-property masking,
nulls, array access and parent fallback without slicing paths per lookup.

A nonempty repeat owns a request-local prototype-linked slot frame with alias/index cells
reused across iterations, instead of copying loop arrays for every item.
Internal slot storage has no application prototype; caller state is not mutated
or retained by module accessors. Shared bodies accept the active frame.
Component shadows/defaults reset lexical scope while light DOM retains it.

The helper contract is now version 2; generated/native artifacts must be
regenerated and deployed with matching helpers/libraries. Rendering APIs and
IR opcodes/schema remain unchanged; native execution is not optimized here.
The benchmark adds deep-path and three-level-repeat workloads alongside the
unchanged existing workloads, reporting warm CPU, observed GC and memory.

## CLI

`fast build` loads entry/registry files, compiles AOT source, imports that source,
parses optional state JSON, executes `renderEntry` and writes complete HTML.
It is a build tool, not a request handler, and always produces complete HTML.
Omitted state becomes an empty object, without implicitly loading state.json.
Config paths are relative to the config file, CLI paths to CWD. Explicit CLI
presence overrides config, including empty paths. Boolean options are validated.

`fast convert --syntax=server-js` links all named template inputs into one ESM
module. It rejects duplicate names, empty registries, wildcard output paths and
browser-only TypeScript options. The default output is `server.mjs` in the current
directory. Its entry is empty; consumers call `renderHost`/`renderShadow`, or use
`compileServerModule` with entry HTML for complete pages.
Target metadata comes from compiler WASM.
Browser conversion and CSS conversion remain in the independent converter crate.

## Files

| File | Role |
|---|---|
| `server.js` / `server.d.ts` | Build-time JS/native-artifact compiler, ServerTemplateDefinition and generated-module types |
| `server-runtime.mjs` | JavaScript target's server-only request helper implementation |
| `bin/fast.js` | CLI/configuration, glob scanning and file I/O |
| `build-wasm.cjs` | Builds the compiler and converter WASM wrappers |
| `wasm/` | Generated build-time bindings and binaries |
| `test/server.test.js` | Frozen byte contracts, state validation, syntax, deployment and hydration fixtures |
| `test/native-artifact.test.js` | Node/WASM artifacts deployed to source-free workspace and Cargo-packaged native hosts; authored-manifest changes remain incompatible |
| `test/performance/` | Shared output-baseline tests and fresh-process AOT measurements |

### Benchmark phase ownership

The version-2 benchmark report measures compiler loading, fixture setup,
per-workload compilation/artifact writing, child setup/input loading, module
import, isolated first render, explicit warmup, warm rendering and UTF-8/file
delivery separately. Child samples disable Node's compile cache; optional CPU
profiles persist independently of temporary benchmark files. Warm GC events are
scoped to the measured loop, and output comparisons run outside render timers.
Historical combined cold timings use `coldImportAndRenderMs`, not the version-2
`firstRenderMs`. This is benchmark tooling, not a rendering API or runtime change.

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

## Browser converter output rules

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

Before conversion, the CLI validates that:

- The selected syntax is supported.
- `templates` is provided.
- The output extension matches the selected syntax.
- The output path is not a directory.
- An existing output file is only replaced when `--overwrite` is present or
  config contains `"overwrite": true`.

The output parent directory is created automatically (`mkdir -p` semantics) if
it does not exist; only an existing non-directory at that path is rejected. A
glob pattern that matches zero files produces a warning (not an error) naming
the pattern. If every pattern has zero matches, browser conversion completes
without writing any files. The server registry target instead rejects an empty
registry.

The converter WASM exposes `convert_template(template: string, syntax: string)`
and `convert_template_with_options(template: string, syntax: string,
typeSource?: string, typeSourceImport?: string, typed?: boolean)`. Both return
a `ConvertResult` with `output: string` and `warnings: string[]` getters.
`convert_syntax_metadata(): string` supplies target metadata. The CLI always calls
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

Frozen output hashes provide regression contracts. Rust rendering assertions run
on loaded native artifacts and generated JavaScript through test-only adapters,
retaining their original expected bytes.
Dedicated native tests cover immutable cross-thread reuse, all render APIs,
DSD/marker selection, recursive definitions, state and malformed-artifact failures. Vite integration builds and
relocates generated ESM, then renders without authored inputs or compilation.
The benchmark reports AOT import/first render, warmed CPU/wall time, process
memory/GC, source bytes and output hashes. Its unique-host workload varies static
instance attributes to exercise shared element code. See server-modules.md for the current
benchmark command and measurement boundaries.
