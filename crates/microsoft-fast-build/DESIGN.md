# Design - microsoft-fast-build

## Compilation pipeline

Trusted authored HTML and a finite named `Locator` registry are build inputs.
`server_ir::lower` preprocesses code samples, scans structural instructions and
eagerly lowers every body to a compiler-owned executable IR. `compile_server_module`
emits semantic operation objects in ESM from this IR; `compile_server_artifact`
serializes the same semantic format for the supported native Rust executor.
The public wire representation is separate from private lowering/execution.
There is one HTML/expression
lowering pipeline, not a second native template compiler.
The browser conversion crate remains independent.

## Modules

| Module | Responsibility |
|---|---|
| `server_ir.rs` | Shared lowering: executable bodies, resolved attributes, paths, condition opcodes and symbolic component references |
| `aot.rs` | Semantic server ESM emission from the shared executable IR |
| `server_plan.rs` | Stable tagged wire encoding and native name-to-index decoding |
| `native.rs` | Validated immutable artifact loading, native request execution, typed options and errors |
| `native/plan.rs` | Execution-only typed native operations, numeric reference resolution and decoded operands |
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
Identical lowered bodies, including empty light DOM, share private numeric references.
The wire encoder gives templates deterministic opaque names in traversal order,
independent of private body numbering. It never expands shared bodies recursively:
encoding and decoding retain graph-sized storage. Bodies are interned only after lowering, so malformed source still
receives eager authored diagnostics.

Lowering folds ordinary tags with no bindings into literal writes only when
their plain and hydrated bytes are identical. Adjacent literal writes and static
attribute fragments are coalesced in place before interning. Whitespace or
client-attribute differences retain the tag operation; binding counts, nested
components, host defaults and DSD selection remain executable boundaries.
The JavaScript plan loader returns literal-only and empty bodies directly, without
hydration branches or an output accumulator. Both targets use the same compacted
IR with unchanged opcodes. Native output, depth and step limits remain enforced;
compacted operations require fewer execution steps.

The emitter serializes named-field operation objects, inline entry operations and
named template bodies. Components reference a single complete DSD template,
with optional `host-attributes` metadata for authored defaults. Loaders derive
host wrappers; generated host templates and separate shadow/host/tag descriptors
are not part of the wire format. Shared content remains shared even when
component defaults or shadow options differ. ESM embeds this semantic data and calls the
helper's loader; it does not expose numeric opcodes, string tables or offsets,
or emit rendering functions, accessors or loops. The helper validates all records
and references, detects template cycles and prepares execution closures once. Compound
property literals remain request-owned. Object validation and prepared snapshots
are unchanged; overlay/attribute specialization is not part of this baseline.
The native loader resolves semantic template names into
private body indices and derives the private host/shadow operations once, then
applies complete existing IR validation before preparing typed execution operations.
Reconstructed component metadata has a
64 MiB expansion budget so shared wire definitions cannot multiply without bound.

Conditions lower using the established server operator scanners; arbitrary
JavaScript expressions are never spliced into output. The shared lowering owns static
attributes, naming rules, body structure, literal CSS/markup and hydration binding
counts. State paths become segment arrays. The plan loader prepares repeat
closures; the native executor iterates the same body references.

### Compiled JavaScript access plans

The plan loader prepares path accessors at module load. Matching repeat
alias prefixes are resolved to numeric slots; slot zero is reserved for
`$index`. The helper prepares array-index decoding once at module import.
Single-key root access and single-candidate lexical access use specialized
functions; multiple matching prefixes select the newest active binding, not
the longest prefix. Missing/null nested values still mask parent fallback.

Each nonempty repeat invocation owns one frame with internal prototype-linked slot
storage and mutable alias/index cells reused across its iterations. This
replaces per-iteration loop-array copying. Only compiler-owned frame cells
change; caller state and module-level accessor metadata remain independent.
Shared bodies receive the active frame rather than capturing a lexical context,
so interning does not multiply functions for different repeat scopes.
Component shadows and host defaults start without caller repeat aliases;
light DOM retains its caller frame.

This is a JavaScript backend replacement, not a native executor rewrite.
Semantic plans preserve published object/prepared APIs. Artifact schemas are
versioned independently of compiler builds. Loaders validate the formats they
support; compiler source or helper implementation changes are not artifact
identity checks.
JavaScript plans use `fast-server-js` schema 1; native artifacts use
`fast-server-native` schema 1. Both new semantic formats start at version 1.
Format identifiers are target-specific and strict.
Only semantic-format changes require new schema versions, not changes to
private closure compilation, alias slots or native execution layout.

## Request execution

Generated modules import only `@microsoft/fast-build/server-runtime.mjs`.
For this target the JavaScript helper owns complete JSON-shaped state validation,
own-property lookup, loop frames, borrowed child overlays, comparison/display,
escaping and fresh hydration scopes. It has no WASM, parser, JSON serialization,
eval or browser dependencies. Generated entry/template/host/shadow exports
synchronously return complete strings. Existing markup, whitespace, escaping and
markers remain byte-preserved.

Generated JavaScript carries no compiler fingerprint or literal helper-build
version check or runtime release metadata. The helper validates the plan schema,
not a helper release number. Native artifacts likewise identify a
supported execution schema, not compiler source, manifest or lockfile bytes.
Applications own watching, rebuilds, module activation and in-flight deployment
lifecycle; ordinary calls retain no request state.

### Prepared-state snapshots

Generated modules export `prepareState` and four `render*Prepared` counterparts.
The helper reuses its validator with copy/freeze enabled: every container is
copied, negative zero is normalized, and the complete copy is recursively frozen.
A private `WeakMap` associates an opaque frozen handle with the snapshot.
Prepared requests check map membership, reject forged/foreign handles, and reuse
the same generated bodies with fresh options, overlays, loops and marker scopes.
Handles can cross artifacts sharing one helper instance, not helper instances or
processes. Dropping handles allows garbage collection; there is no native external
memory or explicit disposal API. Ordinary methods still validate on every call.
Dataset overlays copy borrowed objects before merging, including explicit
`:dataset` property bindings, so neither caller data nor snapshots are mutated.

### Native artifact execution

`CompiledArtifact::load` parses the artifact envelope, not authored HTML. It
requires a supported format/schema,
then validates every opcode, operand shape, static value, component reference and
body index, including unreachable bodies. Unknown fields/opcodes and invalid
references fail. JSON nesting is bounded by the deserializer; schema validation
also bounds condition/static-value nesting. The compiler checks emitted native
artifacts through this loader before returning them.

After complete eager validation, `native/plan.rs` prepares immutable enums for
operations, attributes, conditions and operands. Body references remain numeric;
symbolic element references resolve once to component vector indices. Public
named-host/shadow calls use a lookup map whose names share `Arc<str>` storage with
the component table. Paths retain their exact object keys plus predecoded optional
array indices; repeat aliases remain prepared string prefixes for the existing
request-local loop machinery. Request-time dispatch does not inspect JSON fields
or decode static values. Large enum variants are boxed to avoid inflating literal
and body records.

The parsed JSON graph is dropped after preparation. Decoded static `JsonValue`
operands are cloned per evaluation, preserving the previous ownership model.
Loaded native artifacts are execution-only: `CompiledArtifact::emit_server_module`
is removed. JavaScript generation uses `compile_server_module` directly from
authored templates and a locator at build time. Native plans retain neither
IR-reconstruction code nor original static numeric spellings needed only by that
removed conversion API.
Load peak memory includes both transient JSON and the prepared plan. Retained
memory includes vectors/boxes, prepared paths, static values and the component-name
lookup, not raw-plus-typed instruction graphs. These tradeoffs require measurement;
no dispatch speedup or memory saving is assumed. The Rust API removal requires
consumer migration, but existing `fast-server-native` semantic schema-1 assets
load unchanged with no compiler-build key.

Artifacts are immutable owned `Arc` storage (`Send + Sync`), independent of input
bytes and compiler/locator lifetime. Request-local native frames, repeat aliases,
DSD selection and hydration counters never enter the artifact. Typed `JsonValue`
input is validated/normalized and copied per ordinary request; this is not a zero-copy
memory claim. Parent overlays retain own-property masking, nulls and dataset
siblings. Comparison, display and marker semantics match the generated target.
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
only synthetic array lengths and decoded artifact literals need owned values.
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

Four `render_*_json` methods parse fresh owned request state and pass it directly
to that same executor. A serde visitor builds `JsonValue` directly, normalizing
finite numbers and negative zero, without an intermediate `serde_json::Value`,
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
Compiler-only upgrades do not require rebuilding supported artifacts.
Future loaders must retain supported published schema decoders to preserve
unchanged assets; unsupported formats fail rather than being reinterpreted.

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
Browser fixtures hydrate flat-plan output. `bench:server` measures loaded plans;
its unique-host workload varies indexes, dataset values and inline styles to
exercise component plans rather than only byte-identical hosts;
its CPU, memory and size measurement boundaries are documented in the package's
server-modules.md.
