# microsoft-fast-build

Build-time Rust compiler and template tooling for FAST declarative HTML.
One compiler-owned executable representation supports generated server JavaScript
and native Rust artifact rendering. Native requests need no JavaScript engine.

```sh
cargo add microsoft-fast-build
```

## Usage

### Compile server JavaScript ahead of time

`compile_server_module(entry, &locator, runtime_import)` emits synchronous ESM
with `renderEntry`, `renderTemplate`, `renderHost` and `renderShadow` exports.
Templates are trusted build inputs; the generated module imports the FAST-owned
server helper rather than WASM, browser classes or a runtime template parser:

```rust
use microsoft_fast_build::{compile_server_module, Locator};

let mut locator = Locator::from_templates(Default::default());
locator.add_template("my-card", "<h2>{{title}}</h2>");
let source = compile_server_module(
    "<my-card></my-card>",
    &locator,
    "@microsoft/fast-build/server-runtime.mjs",
)?;
```

Write `source` as a server `.mjs` build artifact. Requests pass JSON-shaped state
directly to the generated functions. Existing server markup/coercion is preserved;
generation eagerly diagnoses malformed skipped bodies.
See the [server module contract](../../packages/fast-build/docs/server-modules.md)
for helper compatibility, state validation and qualification.

Generated JavaScript uses module-level path accessors and reusable request-local
repeat frames. Helper contract version 2 requires regenerated modules/artifacts
and matching deployed helpers/libraries. The executable IR schema and native
render APIs remain unchanged.

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

// Server startup: only the compiled artifact and matching Rust library are needed.
let program = CompiledArtifact::load(&bytes)?;
let state = parse_render_state(r#"{"title":"Request-specific state"}"#)?;
let html = program.render_entry(&state, &NativeRenderOptions::default())?;
```

`render_template`, `render_host` and `render_shadow` preserve the corresponding
generated-module APIs. `render_shadow` accepts resolved component state and emits
only DSD. `CompiledArtifact::emit_server_module(runtime_import)` can emit the JS
target from the exact loaded IR as a build-time operation.

Artifacts own immutable `Send + Sync` storage and can be cloned/shared across
threads; each call validates/copies state and owns its counters, overlays and
returned `String`. Input bytes and the build-time locator may be dropped after
loading. Errors are recoverable `NativeRenderError { code, message }`; no partial
HTML is returned. Load validates all references/opcodes and requires the exact
compiler fingerprint, artifact version and runtime contract. Regenerate artifacts
and deploy the matching library together. State/execution/output limits and
deployment trust are specified in the [native contract](../../packages/fast-build/docs/server-modules.md#native-rust-artifact-target).

The Node build-time `compileServerArtifact` API emits the same artifact bytes.
No request-time WASM rendering, stable C ABI or working .NET bindings are provided.
.NET/C ABI hosting is a follow-up, not a separate C# semantic implementation.


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
The HTML tree builder supplies namespace handling, entity decoding, raw-text
contexts, and normal HTML error recovery without executing scripts. Scripting
is enabled for parsing `noscript` as raw text. Comments, escaped markup, and
slot-like text in attributes, scripts, styles, or RCDATA are not declarations.
Only HTML slots count, including those at SVG/MathML HTML integration points.

Nested ordinary templates and conditional/repeated bodies are inspected once
per authored declaration without state evaluation. Nested component definitions
and templates carrying `shadowrootmode` or legacy `shadowroot` are separate
authored scopes and are excluded, as are siblings and publisher markup outside
the selected inner template. Declarative shadow roots are not attached.

A valid component with no slots returns an empty vector. Failures use
`invalid-template-metadata` (empty selector/duplicate matching definitions),
`missing-template`, `missing-inner-template`, or `multiple-inner-templates`.
Located failures include the selected name and authored definition/second
conflicting opening tag. Rendering, `parse_f_templates`, binding metadata, and
format version 1 remain unchanged.


## Breaking migration

This minor prerelease update requires an API migration. JavaScript hosts compile
ESM and invoke its render exports. Native hosts compile artifacts and use
`CompiledArtifact` with `NativeRenderOptions` (including typed `AttributeNameStrategy`).
Use `renderTemplate`/`render_template` for template-context root-host attributes.
Native rendering does not require JavaScript.
Rendered markup and hydration markers are unchanged.
See [migration](../../packages/fast-build/docs/migration/aot-server-rendering.md).

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
Node.js is required for cross-backend assertions: tests execute real generated
modules alongside loaded native artifacts and retain the original expected bytes.
