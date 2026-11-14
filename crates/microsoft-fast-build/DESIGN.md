# Design - microsoft-fast-build

## Compilation pipeline

Trusted authored HTML and a finite named `Locator` registry are build inputs.
`server_ir::lower` preprocesses code samples, scans structural instructions and
eagerly lowers every body to a compiler-owned executable IR. `compile_server_module`
emits named JavaScript functions from this IR; `compile_server_artifact` serializes
the same IR for the supported native Rust executor. There is one HTML/expression
lowering pipeline, not a second native template compiler.
The browser conversion crate remains independent.

## Modules

| Module | Responsibility |
|---|---|
| `server_ir.rs` | Shared lowering: executable bodies, resolved attributes, paths, condition opcodes and symbolic component references |
| `aot.rs` | Server ESM emission from the shared executable IR |
| `native.rs` | Validated immutable artifact loading, native request execution, typed options and errors |
| `plan.rs` | Structural cursor, source ranges, parsed tags/conditions/repeats |
| `directive.rs` | Forward event scanner, repeat grammar, static DSD serialization |
| `expression.rs` | Operator scanning for compile-time condition lowering |
| `attribute.rs` | HTML attribute parsing, stripping, binding counts and naming |
| `attribute_lookup.rs` | ARIA/global attribute-to-property mapping tables |
| `content.rs` | Compile-time HTML escaping |
| `locator.rs` | Authored/escaped definitions, metadata and glob scanning |
| `json.rs` | Build-time template metadata and static JSON literal parsing |
| `code_escape.rs` | Literal code-sample preprocessing and source rebasing |
| `binding_metadata.rs` | Descriptive bindings, scopes and UTF-16 source spans |
| `f_template.rs` | In-memory stylesheet composition and provenance |
| `template_slots.rs` | Standards-based authored slot discovery |
| `error.rs` | Structured compiler/tooling diagnostics |
| `wasm.rs` | Compiler, parsing, composition, escaping and slot tooling exports |
| `build.rs` | Deterministic `SERVER_COMPILER_ID` fingerprint |

## Emission and diagnostics

Definitions and light-DOM/directive bodies compile eagerly, even in skipped branches.
The IR contains executable literal writes, prelowered attribute recipes, segmented
paths, typed static values, condition opcodes, repeats and body/component references.
It contains no source ranges, authored body strings or runtime expression grammar.
Literal markup is output data, never reparsed. Repeat expression text is diagnostic
only.
Deferred scanner instructions reconstruct source errors directly during lowering;
they never invoke a renderer. Diagnostics are rebased through nested bodies and
code escaping to authored UTF-16 coordinates and definition names.
Compilation limits structural nesting to 128 levels. Symbolic registry references
permit finite cyclic component definitions without recursive code expansion.
Identical lowered bodies, including empty light DOM, share numeric references in
both targets. Bodies are interned only after lowering, so malformed source still
receives eager authored diagnostics.

Lowering folds ordinary tags with no bindings into literal writes only when
their plain and hydrated bytes are identical. Adjacent literal writes and static
attribute fragments are coalesced in place before interning. Whitespace or
client-attribute differences retain the tag operation; binding counts, nested
components, host defaults and DSD selection remain executable boundaries.
The JavaScript emitter returns literal-only and empty bodies directly, without
hydration branches or an output accumulator. Both targets use the same compacted
IR with unchanged opcodes. Native output, depth and step limits remain enforced;
compacted operations require fewer execution steps.

The JavaScript emitter additionally groups element operations by executable
shape: component identity, light-DOM body, attribute recipes, paths, defaults and
marker counts. Instance-specific literal attribute output and primitive property
operands live in generated constant records passed to shared functions. Shapes
used only once retain direct emission. Compound property literals remain
constructed per invocation because child dataset overlays can mutate local
objects. This factoring is compiler-owned, requires no new runtime helper, and
does not change the artifact schema or native execution semantics.

Conditions lower using the established server operator scanners; arbitrary
JavaScript expressions are never spliced into output. The shared lowering owns static
attributes, naming rules, body structure, literal CSS/markup and hydration binding
counts. State paths become segment arrays. The emitter turns repeats into JavaScript
loops; the native executor iterates the same body references.

## Request execution

Generated modules import only `@microsoft/fast-build/server-runtime.mjs`.
For this target the JavaScript helper owns complete JSON-shaped state validation,
own-property lookup, loop frames, borrowed child overlays, comparison/display,
escaping and fresh hydration scopes. It has no WASM, parser, JSON serialization,
eval or browser dependencies. Generated entry/template/host/shadow exports
synchronously return complete strings. Existing markup, whitespace, escaping and
markers remain byte-preserved.

The helper contract version is checked on import; deployments regenerate modules
and deploy compatible helpers together. The compiler fingerprint hashes source
paths/bytes, the authored manifest and lockfile, independently of package version.
Packaged crates hash Cargo's preserved `Cargo.toml.orig` under the same logical
`Cargo.toml` path, so manifest normalization does not change compiler identity.
Changes to authored inputs still invalidate artifacts.
Applications own watching, rebuilds, module activation and in-flight deployment
lifecycle; generated code retains no request state.

### Native artifact execution

`CompiledArtifact::load` parses the artifact envelope, not authored HTML. It
requires exact format/version, compiler fingerprint and helper contract identity,
then validates every opcode, operand shape, static value, component reference and
body index, including unreachable bodies. Unknown fields/opcodes and invalid
references fail. JSON nesting is bounded by the deserializer; schema validation
also bounds condition/static-value nesting. The compiler checks emitted native
artifacts through this loader before returning them.

Artifacts are immutable owned `Arc` storage (`Send + Sync`), independent of input
bytes and compiler/locator lifetime. Request-local native frames, repeat aliases,
DSD selection and hydration counters never enter the artifact. Typed `JsonValue`
input is validated/normalized and copied per request; this is not a zero-copy
memory claim. Parent overlays retain own-property masking, nulls and dataset
siblings. Comparison, display and marker semantics match the generated target.
All four APIs return owned complete strings or recoverable `NativeRenderError`.
No JavaScript engine or HTML/expression parsing is involved in loading/rendering.

The separate, nonpublished
[`microsoft-fast-build-node`](../microsoft-fast-build-node/DESIGN.md) crate
provides experimental source-built N-API hosting without changing this executor.
Its JSON/Buffer transport preserves native validation, copies, limits and
ownership; it is not a typed-IR or state-allocation optimization.

State is limited to 64 nesting levels and one million values. Execution has a
hard 128-body-call depth bound, with configurable default one-million-step and
64 MiB output limits. Finite conditional component cycles are supported through
symbolic references; unbounded request expansion returns `render-limit`, not
stack overflow or truncated success. Failed requests cannot mutate later calls.
See the [deployment/error contract](../../packages/fast-build/docs/server-modules.md#native-rust-artifact-target).
Artifacts are trusted build/deployment inputs, not executable-source sandboxes.
They must be rebuilt with the deployed native library on upgrades.

Minor prerelease release metadata does not waive API migration. Future native
allocation optimizations must preserve borrowed request inputs, independently
owned complete output/errors, artifact `Send + Sync`, request isolation and
rendering semantics, or explicitly introduce a consumer migration. Limits and
state normalization/rejection are also public contracts; JS has no equivalent
FAST budgets. Load replacements before application-owned activation and retain
old handles/workers for in-flight requests rather than reinterpreting artifacts
from another compiler/library build.

Native Rust is supported now. A stable C ABI, .NET bindings, cross-language memory
ownership and C# hosting are deferred; this change supplies none of those APIs.
There is no independent C# implementation of rendering semantics.

## Plugin integration boundaries

Generated `renderShadow` returns just the DSD `<template>` for a
named definition and resolved component state. Entry, host and fragment
exports share generated shadow functions and fresh hydration scopes. The fragment API does
not create host attributes or light DOM; nested hosts still follow normal rules.

`binding_metadata.rs` reuses render-event discovery, tag attributes, directive
body extraction, repeat parsing, and code escaping to describe bindings.
Metadata retains expressions and lexical repeat frames rather than inventing
root paths or state declarations. `name` is absent for compound expressions;
`paths` are lexical references, not a JavaScript type checker. `optional` is
unknown, and types are unknown except for repeat collections' array requirement.
The permissive template parser remains descriptive, not full syntax validation.

Each binding carries a half-open `SourceSpan` over its trimmed expression in the
complete original `parse_f_templates` input. Source positions use zero-based
UTF-16 offsets and one-based lines/UTF-16 columns; CRLF is a single line break,
as are lone CR and LF. Tabs count as one column and non-BMP characters as two.
Repeat spans cover only the iterable, matching existing expression metadata.
Attribute values remain raw rather than entity-decoded.

Extraction retains byte ranges before trimming. Attribute parsing records value
starts, and directive extraction exposes shared expression/body range helpers.
Metadata recursion borrows source windows instead of copying directive bodies.
Code-sample discovery shares the renderer's existing traversal but masks code
bodies with equal-byte-length spaces for metadata; it does not scan an expanded,
entity-escaped string. Thus bindings after code samples retain their authored
byte positions, while code-sample bindings remain excluded.

A single forward source cursor converts these internal byte positions to public
UTF-16 coordinates across all templates in one input. It advances in binding
source order, avoiding per-binding rescans of the document prefix or a per-byte
position map. This does not claim all existing metadata discovery is linear.
UTF-16 coordinate tracking runs only during metadata parsing, not rendering or
the FAST Element client runtime.
Bindings and directives inside HTML comments remain unsupported.

Public `FTemplate` records carry `TEMPLATE_FORMAT_VERSION` and binding metadata.
`Locator::from_metadata` validates native versions/names/duplicates; WASM compiler
exports validate explicit per-definition `formatVersion` before constructing
the locator. Unversioned string/metadata maps remain compatible. The CLI retains
metadata fields when mapping parsed definitions, and WASM custom declarations
describe the JSON interfaces without adding a runtime serialization dependency.
The new spans are additive under format version 1; rendering does not require or
validate them, so older version-1 records remain renderable.

### Authored slot analysis

`extract_template_slots` is additive and separate from `parse_f_templates`.
Only this analysis path constructs a DOM: `html5gum` tokenizes with byte-position
tracking, `html5ever` supplies HTML tree construction and tokenizer-state/namespace
feedback, and `markup5ever_rcdom` stores the result. This avoids a second
hand-written HTML parser and handles comments, raw text, RCDATA, decoded
attributes, and SVG/MathML integration points without running a browser.

`LocatedEmitter` forwards the tokenizer interface while retaining each opening
tag's byte offset. `LocatedDom` delegates tree operations to RcDom and associates
authored HTML definition/template/slot nodes with that offset. Declarative shadow
attachment is disabled so marked templates remain inspectable authored scope
boundaries. Scripting is enabled only as a parsing mode (`noscript` is raw text);
scripts are never executed. HTML parse-error recovery is allowed, not reported
as a separate document-validation API.

Selection matches decoded names case-sensitively, rejects empty/missing/duplicate
matches, and requires one direct inner HTML template. Iterative traversal includes
ordinary nested templates and conditional/repeated bodies once, but stops at
nested component definitions or templates marked `shadowrootmode`/`shadowroot`.
Only HTML slot elements count. The result is sorted by original byte position,
not DOM order, because HTML recovery can reparent nodes (for example, foster
parenting around tables).

The shared `SourceLocations` cursor converts sorted offsets in one forward pass
to one-based lines/UTF-16 columns at the opening `<`. Duplicate names retain
individual locations. Input is never trimmed, composed, or code-escaped. Callers
must supply original authored HTML before transformations; the API cannot map an
arbitrary transformed string back to its original source. Selection errors reuse
`RenderError` codes and authored opening-tag context; a valid no-slot component
alone returns an empty collection. Neither rendering nor existing binding
metadata is routed through the standards parser.


## In-memory `<f-template>` CSS composition — `f_template.rs`

`compose_f_template_styles_with_options` shares the existing selection checks and
insertion path, accepting `Stylesheet::Inline { css, style_id }` or
`Stylesheet::External { href }`. The string-only API is a convenience over the
same implementation, not a second composer. URLs/identities are static,
attribute-escaped values; control characters and braces are rejected to prevent
binding interpretation. An inline identity adds `data-fast-ssr-style`, with no
CSP nonce or runtime lifecycle semantics.

`ComposedTemplate` retains the original HTML, optional original CSS, composed
HTML, and insertion/CSS/content byte offsets. Its mapping helpers validate public
UTF-16 ranges, translate unchanged regions or CSS back to their original input,
and reuse `SourceLocations` for line/column conversion. Generated wrapper and
attribute text maps explicitly to `Generated` without an authored span. Ranges
crossing source boundaries error rather than synthesizing a location. Mapping
is opt-in: binding spans and converter/document errors use complete-document
coordinates; locator errors for this definition use trimmed-content coordinates.
Maps are not attached to the renderer metadata or serialized into HTML.

The WASM result owns a native composition and exposes `.html`, versioned
`.source_map` JSON, and JSON-returning mapping methods. Options are a typed
JavaScript discriminated union serialized at the boundary and validated in Rust.
No JavaScript parser or coordinate arithmetic duplicates native logic.

CSS bodies are skipped as raw text by shared plain-tag handling and metadata
discovery, wrapper tag lookup, directive-body matching, and code-sample
preprocessing. This prevents stylesheet strings from creating bindings, fake
definitions, or altered hydration counts. Converter scanners similarly retain
raw style elements; the TypeScript target escapes their literal representation,
including CR, without interpreting CSS as FAST syntax. CSS validation failures
now retain their separate CSS coordinates rather than claiming HTML positions.

`compose_f_template_styles(template_html, css)` inserts `<style>{css}</style>` as the first child of the inner `<template>` element of a single `<f-template>` definition, entirely in memory — no filesystem access, no `Locator` construction.

### Validation

1. `find_style_terminator(css)` rejects `css` containing a case-insensitive `</style` raw-text terminator sequence — the same HTML tag-name-boundary check used elsewhere in this crate (reusing `locator::is_html_tag_name_boundary` / `locator::starts_with_ascii_case_insensitive`), so that safe CSS content such as `content: "</stylesheet>"` is **not** falsely rejected. A match is only a real terminator when the byte after `style` is end-of-string, ASCII whitespace, `/`, or `>`.
2. `require_single_tag` (a small local helper built on `locator::find_html_start_tag`) verifies `template_html` contains exactly one `<f-template>` element — zero → `RenderError::MissingFTemplate`, more than one → `RenderError::MultipleFTemplates { count }`.
3. The same helper, bounded to the region between the outer tag's `>` and its matching `</f-template>` (found via `locator::find_html_end_tag`), verifies exactly one inner `<template>` element — zero → `RenderError::MissingInnerTemplate`, more than one → `RenderError::MultipleInnerTemplates { count }`.

### Composition

Once validated, the function locates the byte offset of the inner `<template>` tag's closing `>` (via `attribute::find_tag_end`) and builds the output by string concatenation: `template_html[..inner_tag_end]` + `"<style>"` + `css` + `"</style>"` + `template_html[inner_tag_end..]`. No re-serialization occurs, so the outer wrapper's attributes, the inner `<template>`'s attributes, any existing inner content, and any surrounding document content are preserved byte-for-byte.

The resulting string is valid `<f-template>` source: it can be written to a file and discovered by `Locator::from_patterns`, or fed directly to `locator::parse_f_templates`, and compiled through the shared lowering like any other template definition.

---


## Coverage and performance

Existing Rust rendering assertions compile and execute generated JavaScript and
load/render native artifacts, requiring byte-identical results before checking the
original literal assertions. Dedicated `native_artifacts.rs` tests qualify all
render targets, both marker formats, DSD selection, state/ownership/errors,
recursive graphs and malformed artifacts. These adapters are test-only.
Node tests enforce 438 distinct frozen output contracts and the shared
performance corpus baseline.
Browser fixtures hydrate AOT output. `bench:server` measures generated JavaScript;
its unique-host workload varies indexes, dataset values and inline styles to
exercise structural sharing rather than only byte-identical hosts;
its CPU, memory and size measurement boundaries are documented in the package's
server-modules.md.
