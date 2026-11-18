# Design - @microsoft/fast-build

**Dependency policy:** FAST packages must remain free of regular npm dependencies.
Development, peer and optional dependencies are separate.

## Build and execution ownership

`server.js` exposes build-time `compileServerArtifact` and
`writeServerArtifact`. Compiler WASM delegates HTML parsing, metadata validation,
expression lowering and artifact serialization to Rust. The resulting UTF-8 JSON
is `fast-server-native` semantic schema 2, normally persisted as `server.artifact.json`.
It contains literal writes, named templates, typed operands and symbolic component
references, not source to evaluate. There is one compiler and one native executor.

`native-host.mjs` loads only the caller-selected source-built Node-API addon.
The required Node execution backend delegates to the crate's fresh-JSON methods;
it has no compiler/WASM, browser or template-parser request dependency.
The npm package includes the facade, types and source-build script, not platform
binaries or crate sources. It performs no automatic download or install.
The repository package build builds WASM and the local addon. Rust-only/WASM
compilation does not enable the `node-host` Cargo transport feature.

The facade accepts only unshared Buffers, checking their intrinsic backing store
before native reads. Proxies and shared artifact/state bytes are rejected.
Constructor options are validated without invoking accessors and copied once.
The immutable program retains decoded native operations and fixed render policy.
Each request directly parses owned JSON state, validates the complete graph,
executes with fresh scopes/budgets, and returns independently owned UTF-8 bytes.
napi-rs transfers output ownership and handles finalization; no handwritten unsafe
buffer transfer or shared request scratch is used.
See the [host contract](./docs/native-node-host.md).

## Native plans and requests

The stable wire schema is independent of private execution layout and compiler
fingerprints. Components refer to complete DSD templates; optional host-default
metadata derives host wrappers without duplicating shared content. Loading
validates wire fields as it decodes them directly into typed execution operations,
resolves names to private body and component indices, and decodes operands and
paths. Even unreachable operations are validated. No intermediate JSON IR or
separate IR-validation traversal is constructed; the transient wire JSON is dropped.
Artifact storage is immutable and Rust `Send + Sync`.
After complete decoding and validation, preparation retains only bodies reachable
from the entry and every public component host/shadow root, including skipped control-flow
branches and directly referenced complete DSD templates. Private indices are
compacted without changing execution budgets or wire names.

Static lowering coalesces adjacent literal writes and invariant tags only when
hydration cannot change their bytes. Dynamic attributes, host defaults, DSD
selection and hydration counts retain executable boundaries. The standard
DSD serializer selects nonempty authored `shadowrootmode`, defaulting to
`"open"`; other forwarded attributes retain their serialization.

Request paths preserve lexical alias precedence, own-null masking, array lookup,
dataset replacement and parent fallback. Shadows/defaults reset repeat scope;
caller light DOM retains it. Borrowed native operands and copy-on-write dataset
overlays avoid cloning input graphs and immutable artifact literals. Conditions
short-circuit after complete state/artifact validation, without changing step
accounting. Elements reuse their resolved component's DSD opening tag.
Escaping writes spans directly to bounded output. Finite JSON numbers preserve
binary64 round trips and decimal output
spelling; negative zero normalizes to zero.
Hydration markers likewise append literals and stack-formatted indices directly.
Whole-marker byte-budget preflight preserves failure boundaries without a
per-marker temporary string or retained request scratch.

Native state is limited to depth 64 and one million values. Execution permits
128 nested body calls, with default one-million-step and 64 MiB output budgets.
Invalid state, missing definitions and budget failures return recoverable codes,
without partial output or changing later requests. Budgets reset per request.
Applications own ingress/concurrency limits, addon deployment, artifact activation
and in-flight lifetimes.

Rust hosts additionally expose typed `JsonValue` and immutable `PreparedState`
entry/template/host/shadow methods on the same executor. Typed calls validate and
normalize a copy; fresh JSON calls deserialize directly into owned request storage;
prepared calls borrow a validated `Arc` snapshot. Node uses the fresh JSON boundary.

## Persistent artifact writer

`writeServerArtifact` persists one envelope containing canonical `inputs` and a
compiled `program`, without a compiler hash or encoded output copy. Raw source
texts are sorted with duplicate texts retained; definitions are parsed only on
misses. Structured metadata excludes derived binding/source-location data.
Unchanged embedded inputs retain artifact bytes/timestamps without loading WASM.
Missing artifacts recompile. Changed inputs require overwrite permission; malformed
envelopes and unsupported versions fail closed. Input comparison is not an
independent check that a valid program was generated from those inputs.

Exclusive output locks and flushed sibling staging files protect publication
through one atomic rename. Failure before publication leaves the previous artifact
untouched. `includeBytes` returns owned bytes captured under the lock so callers
never reopen a path after another writer can replace it.

## CLI

`fast build` requires `--native-addon`, configured `native-addon`, or
`FAST_NATIVE_ADDON`. It compiles or reuses a native artifact, passes original
state-file bytes to native validation, renders complete HTML and writes the result.
Omitted state becomes UTF-8 `{}`; supplied state must exist. Unknown build options
fail. Config paths are relative to the config file and CLI paths to CWD.

`--server-artifact=generated/page.json` retains entry/registry preparation
independently of state, HTML output and rendering options. Managed artifact,
and lock paths must not overwrite authored input or output HTML.
Each build renders the writer-owned snapshot, not a reopened shared path.

`fast convert --syntax=server-native` compiles a named registry into one JSON
artifact, defaulting to `server.artifact.json`. Its entry is empty; consumers select a
named host or shadow. Empty/duplicate registries, wildcard output paths and
browser TypeScript options fail. Browser conversion remains in the independent
converter crate.

## Files and measurement

| File | Role |
|---|---|
| `server.js` / `server.d.ts` | Native artifact compilation, persistence and build-time types |
| `native-host.mjs` / `native-host.d.ts` | Explicit Node addon loading and Buffer-only request boundary |
| `build-native-host.mjs` | Source-build, Cargo receipt selection and standard `.node` addon copy |
| `bin/fast.js` | CLI/configuration, glob scanning and file I/O |
| `build-wasm.cjs` / `wasm/` | Build-time compiler/converter bindings |
| `test/` | Frozen HTML, CLI/cache, native ownership, worker and deployment contracts |
| `test/performance/` | Fresh-process native execution measurements and output checks |

Benchmark report version 3 separates compiler loading, compilation, input setup,
artifact reading, addon/program loading, first rendering, warmup and warm rendering.
Primary warm samples include JSON Buffer validation/parsing, native execution and
owned Buffer output. String-delivery samples include decoding inside each timed
request. Output verification and file writing are outside render timers.
Reports include CPU, observed warm-loop GC, memory and source artifact sizes.
Child compile caches are disabled; optional CPU profiles persist outside temporary
inputs. `--workloads` selects exact workload names without changing their definitions.
Reports identify the source checkout, addon hash and per-workload artifact hashes;
checkout identity alone is not proof of how an external addon was built.

The crate's shadow-output microbenchmark complements these Node measurements with
fresh-JSON and prepared-state complete-owned-String boundaries. Isolated source
comparisons alternate execution order and separate allocator diagnostics from
timing; requested live heap bytes do not measure RSS or bytes copied.

`profile:server` runs additional instrumented diagnostic passes after ordinary
measurements, with separate load, Buffer, string and fixed-buffer decode profiles.
V8 Inspector captures each phase independently. Optional macOS `sample` or Linux
`perf` subprocesses sample only the current worker PID and must exit successfully;
missing tools and permission failures propagate rather than silently falling back.
Load diagnostics repeat file reads and program construction, with explicit GC every
16 constructions to bound unreported native class allocations. They are not cold
filesystem-cache measurements. Phase reports include CPU, process memory, output
hashes and paths to retained profiles. Process RSS includes allocator-held pages,
and native samplers can include setup/tail activity. These are diagnostics, not
assumed universal performance guarantees; the [profiling guide](./docs/native-profiling.md)
defines their interpretation.

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
and continue accepting older records without them. Authored diagnostics require
metadata carrying spans.

Plugins compile native artifacts and call `renderShadowJson` on a loaded
program for resolved component-state JSON. The owned UTF-8 fragment includes
DSD but does not synthesize caller-owned host/light DOM.

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
Nested definitions and templates marked with `shadowrootmode`
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
- Authored `shadowroot`-prefixed attributes on `<f-template>` become `shadowrootAttributes` metadata applied to the emitted Declarative Shadow DOM `<template>`.
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
Runtime invalid state/options return native error codes; a present non-array repeat
throws `repeat-not-array`. Runtime value errors need not carry source coordinates.
Build-tool composition mappings remain independent of request execution.

Frozen output hashes provide regression contracts. Rust rendering assertions run
on typed, prepared and fresh-JSON native requests through test-only adapters,
retaining their original expected bytes.
Dedicated native tests cover immutable cross-thread reuse, all render APIs,
DSD/marker selection, recursive definitions, state and malformed-artifact failures. Vite integration builds and
relocates native JSON, then renders without authored inputs or compilation.
The benchmark reports addon/program loading, first rendering, warm CPU/wall time, process
memory/GC, source bytes and output hashes. Its unique-host workload varies static
instance attributes to exercise component plans. See server-modules.md for the current
benchmark command and measurement boundaries.
