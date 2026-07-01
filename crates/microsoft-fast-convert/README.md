# microsoft-fast-convert

`microsoft-fast-convert` converts one FAST declarative HTML template string into another supported syntax. It is written in Rust and exposes both a Rust API and a `wasm-bindgen` API for Node tooling.

## Supported targets

- `webui-prerelease` — unwraps the outer `<f-template>` and emits a WebUI prerelease `<template>` string. It converts `<f-repeat>` to `<for>` and `<f-when>` to `<if>` while preserving other FAST attribute syntax that WebUI's FAST plugin expects.
- `fast-v3-ts` — emits TypeScript source that imports FAST helpers and exports `template` as an `html` tagged template.

## Rust usage

```rust
use microsoft_fast_convert::convert_template;

let source = r#"<f-template name="my-element"><template>{{title}}</template></f-template>"#;
let ts = convert_template(source, "fast-v3-ts")?;
```

The Rust API returns `Result<String, ConvertError>`.

## WASM usage

When built with `wasm-pack --target nodejs`, the crate exports:

```ts
convert_template(template: string, syntax: string): string
```

Errors are raised as JavaScript exceptions with the `ConvertError` message.

## Validation

The converter validates that the input contains exactly one `<f-template name="…">` with a non-empty name and exactly one inner `<template>`. It validates supported syntax values, `<f-repeat>` and `<f-when>` `value="{{…}}"` expressions, supported `f-*` attributes, and the limited expression grammar used for `fast-v3-ts` output.
