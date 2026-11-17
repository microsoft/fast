# microsoft-fast-build

Compile FAST declarative HTML to native JSON artifacts, execute them in Rust or
Node.js, and analyze templates at build time.

```sh
cargo add microsoft-fast-build
```

Node hosting uses the same executor through the source-built `node-host`
transport feature. Applications configure the addon explicitly; see the
[Node deployment guide](../../packages/fast-build/docs/native-node-host.md).

## Usage

### Compile and deploy native Rust artifacts

```rust
use microsoft_fast_build::{
    compile_server_artifact, parse_render_state, CompiledArtifact, Locator,
    NativeRenderOptions,
};

// Build time: source parsing/lowering happens here, never in the request host.
let mut locator = Locator::from_templates(Default::default());
locator.add_template("my-card", "<h2>{{title}}</h2>");
let bytes = compile_server_artifact("<my-card></my-card>", &locator)?;
// Persist bytes in the application build/deployment pipeline.

// Server startup: compiled bytes and a schema-compatible Rust library.
let program = CompiledArtifact::load(&bytes)?;
let state = parse_render_state(r#"{"title":"Request-specific state"}"#)?;
let html = program.render_entry(&state, &NativeRenderOptions::default())?;
```

Use `render_entry` for entry-host rules and `render_template` for template-context
root-host attributes. `render_host` renders a complete named host;
`render_shadow` accepts resolved component state and emits its DSD fragment.
Configure hydration markers, attribute naming, DSD selection and resource budgets
through `NativeRenderOptions`.

Artifacts own immutable `Send + Sync` storage and can be cloned/shared across
threads. Input bytes and the build-time locator may be dropped after loading.
Each ordinary call validates, normalizes and copies state and returns an owned
UTF-8 `String`. Errors are recoverable `NativeRenderError { code, message }`;
failed calls return no partial HTML. Loading validates the artifact format, schema,
operations and references. See the [native contract](../../packages/fast-build/docs/server-modules.md#native-rust-artifact-target)
for state limits, execution budgets and deployment requirements.

For fresh JSON requests, use `render_entry_json(json, options)` instead of
`parse_render_state(json)` followed by `render_entry(&state, options)`. It builds
owned validated state directly and renders without a second normalized copy:

```rust
let html = program.render_entry_json(
    r#"{"title":"Request-specific state"}"#,
    &NativeRenderOptions::default(),
)?;
```

`render_template_json`, `render_host_json` and `render_shadow_json` follow the
same naming/argument order as their typed counterparts. JSON is parsed and fully
validated on each call.

For unchanged state reused across calls, validate and copy once:

```rust
use microsoft_fast_build::{PreparedState, NativeRenderOptions};

let snapshot = PreparedState::from_json(r#"{"title":"Shared immutable state"}"#)?;
let html = program.render_entry_prepared(&snapshot, &NativeRenderOptions::default())?;
```

`PreparedState::new(&state)` copies typed input instead. All four render methods
have `_prepared` counterparts. Snapshots are artifact-independent, `Send + Sync`
and cheaply cloneable; dropping the final clone releases their owned memory.
Execution limits reset per call. Use ordinary methods for changing request state;
preparation allocates a retained copy.
See [prepared-state ownership](../../packages/fast-build/docs/server-modules.md#prepared-state-snapshots).

The Node build-time `compileServerArtifact` API emits the same artifact bytes.
The compiler emits one `server.artifact.json` envelope with format
`fast-server-native`, schema 2, authored `inputs` and an executable `program`.
Loading discards the build metadata before preparing runtime operations; request
state is supplied separately. Published schema-1 programs remain loadable.
For persisted asset reuse, use the npm package's `writeServerArtifact`, or implement
application-owned persistence around Rust compilation. Matching embedded inputs
skip compilation; deleting the artifact requires recompilation. The build cache
does not independently verify a valid edited program against its authored source.

## Template tooling

`parse_f_templates` returns versioned bindings, source spans and host/shadow
attributes. Construct a `Locator` with `from_metadata`, `from_templates` or
`from_patterns` before compilation.
`compose_f_template_styles` and `compose_f_template_styles_with_options` compose
CSS in memory with original-source mapping. These APIs and authored slot analysis
remain build-time tools and require no browser classes.

### Authored slot declarations

```rust
use microsoft_fast_build::extract_template_slots;

let source = "<f-template name=\"my-card\">\n    <template>\n        <slot name=\"title\"></slot>\n        <slot></slot>\n    </template>\n</f-template>";
let slots = extract_template_slots(source, "my-card")?;
assert_eq!(slots[0].name, "title");
assert_eq!((slots[0].line, slots[0].column), (3, 9));
assert_eq!(slots[1].name, "");
```

The native API returns `Result<Vec<TemplateSlot>, RenderError>`; the WASM export
`extract_template_slots(html, templateName)` returns the same array as JSON.
`TemplateSlot` contains `name`, `line`, and `column`; the generated TypeScript
declarations expose the same interface.

Names are HTML-entity-decoded authored values, not evaluated bindings. Default
slots have the empty name `""`. Declarations retain source order and duplicates.
One-based lines/UTF-16 columns identify the opening `<` in the complete original
HTML argument. Tabs count as one code unit, non-BMP characters as two, and CRLF
as one line break (lone CR/LF also break). Extract from original source before
style composition, code escaping, or rendering; transformed input cannot recover
original-file coordinates.

Selection requires a nonempty, case-sensitive decoded definition name, exactly
one matching HTML `<f-template>`, and exactly one direct HTML `<template>` child.
Comments, escaped markup, and slot-like text in attributes, scripts, styles, or
RCDATA are not declarations.
Only HTML slots count, including those at SVG/MathML HTML integration points.

Nested ordinary templates and conditional/repeated bodies are inspected once
per authored declaration without state evaluation. Nested component definitions
and templates carrying `shadowrootmode` are separate
authored scopes and are excluded, as are siblings and publisher markup outside
the selected inner template. Declarative shadow roots are not attached.

A valid component with no slots returns an empty vector. Failures use
`invalid-template-metadata` (empty selector/duplicate matching definitions),
`missing-template`, `missing-inner-template`, or `multiple-inner-templates`.
Located failures include the selected name and authored definition/second
conflicting opening tag.

## Error handling

Compilation and template tooling return `RenderError`. Inspect `code()` instead
of parsing its message; `location()` supplies optional one-based UTF-16
line/column and highlight length, and `template_name()` identifies a separately
supplied definition. `source_kind()` distinguishes authored HTML from separate
CSS diagnostics. Use `kind()` when matching a source-annotated error variant.
Compilation diagnoses malformed syntax even in unused definitions or skipped bodies.

Artifact loading and native request execution return `NativeRenderError` with
`code` and `message` fields, not compiler source coordinates. See the
[native error and resource contract](../../packages/fast-build/docs/server-modules.md#compatibility-errors-and-memory).

## Contributing

From the monorepo root, run `cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml`.
Rust tests compare typed, prepared and fresh-JSON native execution with frozen expected bytes. Node package tests exercise the actual addon, ownership and deployment.

## Migration guidance

See the [migration index](../../packages/fast-build/docs/migration.md).
