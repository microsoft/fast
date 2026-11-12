# microsoft-fast-build

Build-time Rust compiler and template tooling for FAST declarative HTML.
Both native Rust and WASM builds generate JavaScript; neither executes request rendering.

```sh
cargo add microsoft-fast-build
```

## Usage

### Compile server JavaScript ahead of time

`compile_server_module(entry, &locator, runtime_import)` emits synchronous ESM
with `renderEntry`, `renderHost` and `renderShadow` exports. Templates are trusted
build inputs; the generated module imports the FAST-owned server helper rather
than WASM, browser classes or a runtime template parser:

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

All native render/stream functions, `RenderConfig`, `DsdSelection`,
`AttributeNameStrategy` and prepared artifact/program APIs have been removed.
Compile ESM and invoke its `renderEntry`, `renderHost` or `renderShadow`
functions from JavaScript. For former non-entry render calls, use the generated
`renderTemplate` export to retain their distinct root-host attribute contract.
No JavaScript engine is embedded in the Rust crate.
Rendered markup and hydration markers are unchanged.
See [migration](../../packages/fast-build/docs/migration/aot-server-rendering.md).

## Contributing

From the monorepo root, run `cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml`.
Node.js is required for rendering assertions: tests execute generated modules
instead of maintaining a second Rust evaluator.
