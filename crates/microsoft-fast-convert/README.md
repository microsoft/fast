# microsoft-fast-convert

`microsoft-fast-convert` converts one FAST declarative HTML template string into another supported syntax. It is written in Rust and exposes both a Rust API and a `wasm-bindgen` API for Node tooling.

## Supported targets

- `webui-prerelease` — unwraps the outer `<f-template>` and emits a WebUI prerelease `<template>` string. It converts `<f-repeat>` to `<for>` and `<f-when>` to `<if>` while preserving other FAST attribute syntax that WebUI's FAST plugin expects.
- `fast-v3-ts` — emits TypeScript source that imports FAST helpers and exports `template` as an `html` tagged template.

## Rust usage

```rust
use microsoft_fast_convert::{convert_template, convert_stylesheet};

let source = r#"<f-template name="my-element"><template>{{title}}</template></f-template>"#;
let ts = convert_template(source, "fast-v3-ts")?;

let css = ":host { display: block; }";
let styles = convert_stylesheet(css, "fast-v3-ts", "styles")?;
```

The Rust API returns `Result<String, ConvertError>`.

`convert_stylesheet(stylesheet, syntax, export_name)` converts a CSS source string
into a TypeScript module that imports `css` from `@microsoft/fast-element` and
exports `export_name` as a `css` tagged template. It has no filesystem
requirement and, like `convert_template`, is only supported for the
`fast-v3-ts` syntax. `export_name` must be a valid TypeScript/JavaScript
identifier (no dotted paths).

Syntax metadata is available through `syntax_metadata()`. The metadata includes each
supported syntax name, required output extension, and default output suffix so package
tooling can avoid duplicating target definitions.

## WASM usage

When built with `wasm-pack --target nodejs`, the crate exports:

```ts
convert_template(template: string, syntax: string): string
convert_stylesheet(stylesheet: string, syntax: string, export_name: string): string
convert_syntax_metadata(): string
```

`convert_syntax_metadata()` returns JSON metadata for supported syntax targets.
Errors are raised as JavaScript exceptions with the `ConvertError` message.

## Validation

The converter validates that the input contains exactly one `<f-template name="…">` with a non-empty name and exactly one inner `<template>`. It validates supported syntax values, `<f-repeat>` and `<f-when>` `value="{{…}}"` expressions, supported `f-*` attributes, and the limited expression grammar used for `fast-v3-ts` output.

`convert_stylesheet` validates that `syntax` is `fast-v3-ts` (CSS conversion is not supported for `webui-prerelease`) and that `export_name` is a valid TypeScript/JavaScript identifier. Stylesheet content is escaped for safe embedding in a TypeScript template literal: backslashes, backticks, literal `${` sequences, and carriage returns are all escaped.
