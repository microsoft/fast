# Design - microsoft-fast-build

## Compilation pipeline

Trusted authored HTML and a finite named `Locator` registry are build inputs.
`server_ir::lower` preprocesses code samples, scans structural instructions and
eagerly lowers every body. `compile_server_artifact` serializes UTF-8 JSON
`fast-server-native` semantic schema 2 and validates it through the native loader.
The wire representation is separate from private lowering and execution.
One compiler and one Rust executor serve native Rust and Node hosts.

`node.rs` is the synchronous Buffer-only JSON Node-API transport, enabled by
`node-host` on non-WASM targets. It delegates to fresh JSON methods without
re-converting state or duplicating execution. Programs own fixed constructor
options; counters reset per request and napi-rs owns output Buffer finalization.
Rust-only/WASM builds do not enable the feature. The npm repository build also
builds the required local Node addon. Deployment remains explicit and source-built.

## Modules

| Module | Responsibility |
|---|---|
| `server_ir.rs` | Shared lowering: executable bodies, resolved attributes, paths, condition opcodes and symbolic component references |
| `server_plan.rs` | Stable tagged wire encoding |
| `native.rs` | Validated immutable artifact loading, native request execution, typed options and errors |
| `native/plan.rs` | Validated wire-to-execution decoding, numeric reference resolution and typed native operations |
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
| `template_slots.rs` | Authored slot discovery |
| `error.rs` | Structured compiler/tooling diagnostics |
| `wasm.rs` | Compiler, parsing, composition, escaping and slot tooling exports |

## Lowering and emission

Definitions and all nested bodies compile eagerly, including unused definitions
and skipped branches. Errors retain authored UTF-16 locations and definition
names through nested lowering and code-sample preprocessing.
Structural nesting is limited to 128. Symbolic registry references permit finite
conditional cycles without recursive code expansion. Shared lowered bodies are
interned and encoded once with opaque deterministic names.
Lowering consumes structural cursor instructions directly. The locator owns its
private definitions directly and caches each definition's DSD markup in place.

The wire contains literal writes, segmented paths, typed values, conditions,
repeats and template/component references. Literal markup is output data, never
reparsed; repeat expression text is diagnostic-only.
Adjacent invariant tags/literals coalesce only when hydrated output is identical.
Dynamic attributes, whitespace differences, host semantics and marker counts
retain executable operations.

Components reference a complete DSD template with optional ordered host-default
metadata. The native loader derives host wrappers and resolves symbolic names
into private indices. Metadata expansion is bounded to 64 MiB.
The shared DSD serializer uses nonempty authored `shadowrootmode`, defaulting
to `"open"`; other attributes retain their original serialization.
Only semantic wire changes require a schema revision, not compiler builds or
private execution-layout changes.

### Native artifact execution

`CompiledArtifact::load` parses the artifact envelope, not authored HTML. It
requires a supported format/schema,
then decodes semantic wire fields directly into typed execution operations while
validating every opcode, operand shape, static value, component reference and
body index, including unreachable bodies. It does not reconstruct an intermediate
JSON IR or traverse that graph in a separate validation pass. Unknown fields/opcodes
and invalid references fail. JSON nesting is bounded by the deserializer; semantic
decoding also bounds condition/static-value nesting, derived bodies/operations and
metadata expansion. The compiler checks emitted native artifacts through this
loader before returning them.

After complete eager decoding and validation, `native/plan.rs` walks typed body
references iteratively from the entry and every publicly selectable component
host/shadow root. It retains only reachable bodies and compacts their numeric
indices. Calls, conditional/repeat bodies and element light DOM retain their
references regardless of request state or DSD selection. Complete component DSD
templates are retained only when executable references reach them; otherwise the
derived shadow interiors suffice. Malformed unreachable data still fails full
validation before pruning.

Prepared operations, attributes, conditions and operands use immutable enums.
Body references remain numeric;
symbolic element references resolve once to component vector indices. Public
named-host/shadow calls use a lookup map whose names share `Arc<str>` storage with
the component table. Paths retain their exact object keys plus predecoded optional
array indices; repeat aliases remain prepared string prefixes for the existing
request-local loop machinery. Request-time dispatch does not inspect JSON fields
or decode static values. Large enum variants are boxed to avoid inflating literal
and body records. Elements reuse their resolved component's DSD opening tag rather
than retaining a per-element copy.

The parsed JSON graph is dropped after preparation. Decoded static `JsonValue`
operands borrow immutable artifact storage during evaluation. Loaded native
artifacts are execution-only.
Native plans retain no emission-only static numeric spellings.
Load peak memory includes transient wire JSON and typed bodies before pruning. Retained
memory includes vectors/boxes, prepared paths, static values and the component-name
lookup, not raw-plus-typed instruction graphs. These tradeoffs require measurement;
no dispatch speedup or memory saving is assumed. Supported `fast-server-native`
semantic schemas 1 and 2 load with no compiler-build key. Schema 2 contains
canonical authored `inputs` plus a compiled `program`. Loading validates the build
metadata shape, discards it before program decoding and retains only execution data.
Build metadata increases artifact/read/parse size and peak loading memory, not
request-time dispatch. Schema 1 uses the same program decoder.

Artifacts are immutable owned `Arc` storage (`Send + Sync`), independent of input
bytes and compiler/locator lifetime. Request-local native frames, repeat aliases,
DSD selection and hydration counters never enter the artifact. Typed `JsonValue`
input is validated/normalized and copied per ordinary request; this is not a zero-copy
memory claim. Parent overlays retain own-property masking, nulls and dataset
siblings. Comparison, decimal number display and hydration-marker semantics preserve frozen output contracts.
All four APIs return owned complete strings or recoverable `NativeRenderError`.
No JavaScript engine or HTML/expression parsing is involved in loading/rendering.

`PreparedState::new` uses that same normalizer once; `from_json` reuses the bounded
JSON parser. Private `Arc<JsonValue>` storage owns the immutable result and is
`Send + Sync`, cloneable and artifact-independent. Four `render_*_prepared`
methods borrow its root through the existing executor. Normal calls still
normalize/copy before execution. State depth/node checks happen during
preparation; body depth, step and output budgets reset and apply on every render.
Dropping the last snapshot clone frees it; no serialization or cross-version
handle interchange is provided.

Native lookups return `Cow<JsonValue>`: existing values borrow request storage;
synthetic array lengths need owned values, while static operands borrow artifact storage.
String display borrows strings. Repeats borrow collections/items and link
stack-local alias/index frames to their enclosing frame, reusing the artifact's
alias path without copying names or outer loop payloads. Recursive scopes are
bounded by the existing body-depth limit; no reference escapes execution.
Component frames borrow their parent base and direct property operands, with a
small request-local override map. Own-null properties, including missing bound
operands, mask parent fallback.
Override names borrow immutable artifact metadata rather than copying per host.
Dataset transformations use copy-on-write for the merged object only; they never
mutate borrowed request values. Shadows/defaults reset loop scope; caller light
DOM keeps its original scope. Artifact storage is not changed by this mechanism.

Logical conditions short-circuit pure operand evaluation. Complete state/artifact
validation still precedes execution, and skipped condition operands do not alter
execution-step accounting or body evaluation/error ordering.

Four `render_*_json` methods parse fresh owned request state and pass it directly
to that same executor. A serde visitor builds `JsonValue` directly, normalizing
finite binary64 numbers with exact round trips and normalizing negative zero, without an intermediate `serde_json::Value`,
map conversion, normalized clone or `Arc` snapshot. A nonallocating traversal
then checks depth/value budgets on the final retained tree. Counting during
parsing would reject overwritten duplicate-key subtrees that the existing parser
accepts; complete parsing also preserves parse-error precedence, including invalid
unused/overwritten Unicode and numbers. Typed-input copying and prepared snapshot
ownership remain unchanged. JSON input and results/errors are independently
owned; no request-key hashing/cache, unsafe code or retained scope arena is used.

Escaping shares a fallible UTF-8 span writer with the infallible string helpers.
Text and attribute bindings append unchanged spans and exact entity spellings
directly to the executor's bounded output string, without display/escaped strings.
Finite numbers format through its fallible `fmt::Write` implementation; boolean,
null and container display values use fixed strings. Composite attributes resolve
their binding values first so a later missing/null value suppresses the entire
attribute before any output-budget check. This preflight retains no operand vector;
the output pass resolves immutable borrowed values again without cloning payloads.
Authored composite literals only replace
quotes, preserving their existing entities; dynamic parts use full HTML escaping.
Each span uses the existing output-byte check; escaping adds no execution steps.
Errors discard the private partial buffer rather than exposing truncated HTML.
Hydration markers append literal spans and stack-formatted integer fields directly
to bounded output without allocating a temporary string for each marker.
Checked whole-marker length preflight precedes its spans, preserving the existing
output-limit boundary and error order. Numeric scratch has a fixed stack bound
independent of marker count and is never retained between requests.
Component shadows still render
before host attributes and use the existing split/append assembly, preserving first
error order. No output buffer, capacity hint or request-sized scratch storage is
retained between calls.

State is limited to 64 nesting levels and one million values. Execution has a
hard 128-body-call depth bound, with configurable default one-million-step and
64 MiB output limits. Finite conditional component cycles are supported through
resolved numeric references; unbounded request expansion returns `render-limit`, not
stack overflow or truncated success. Failed requests cannot mutate later calls.
See the [deployment/error contract](../../packages/fast-build/docs/server-modules.md#native-rust-artifact-target).
Artifacts are trusted build/deployment inputs, not executable-source sandboxes.
Compiler build identity does not invalidate supported artifacts. Loading uses
explicitly supported schema decoders; unsupported formats fail rather than being
reinterpreted.

Native API contracts include borrowed request inputs, independently owned complete
output/errors, artifact `Send + Sync`, request isolation and rendering semantics.
Limits and state normalization/rejection are also public contracts. Load replacements before application-owned activation and
retain old handles/workers for in-flight requests rather than reinterpreting
artifacts from another compiler/library build.

Native Rust is supported now. A stable C ABI, .NET bindings, cross-language memory
ownership and C# hosting are deferred; this change supplies none of those APIs.
There is no independent C# implementation of rendering semantics.

## Plugin integration boundaries

Rust `render_shadow_json` and Node `renderShadowJson` render just the DSD
template for resolved component state. Host/light-DOM ownership stays with callers.
All contexts share native operations and request-local hydration scopes.

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
nested component definitions or templates marked `shadowrootmode`.
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

Existing Rust rendering assertions compare typed, prepared and fresh-JSON
native requests, requiring byte-identical results before checking the
original literal assertions. Dedicated `native_artifacts.rs` tests qualify all
render targets, both marker formats, DSD selection, state/ownership/errors,
recursive graphs and malformed artifacts. These adapters are test-only.
Node tests enforce compiled output contracts and the shared performance corpus
baseline. Loaders reject unsupported schemas.
Browser fixtures hydrate native output. `bench:server` measures the Node native host;
its unique-host workload varies indexes, dataset values and inline styles to
exercise component plans rather than only byte-identical hosts.
Its CPU, memory and size measurement boundaries are documented in the package's
server-modules.md.

The `native-shadow-benchmark` example separately measures complete owned Rust
results through fresh-JSON and prepared-state boundaries. Its PowerShell runners
compare isolated source snapshots, alternate execution order and keep allocation
diagnostics separate from latency samples. Allocation requests are not copied-byte
or process-RSS measurements.
