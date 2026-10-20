# microsoft-fast-convert

`microsoft-fast-convert` converts one FAST declarative HTML template string into another supported syntax. It is written in Rust and exposes both a Rust API and a `wasm-bindgen` API for Node tooling.

## Supported targets

- `webui-prerelease` — unwraps the outer `<f-template>` and emits HTML for WebUI's FAST parser plugin, converting only `<f-repeat>` to `<for>` and `<f-when>` to `<if>`. Other supported FAST attributes (`@click`, `:prop`, `?bool`, `f-ref`, `f-children`, `f-slotted`) pass through unchanged.
- `webui-framework-prerelease` — converts FAST's declarative syntax into the Microsoft WebUI Framework's own declarative runtime syntax (transferring Shadow/Light DOM policy from the outer `<f-template>` onto the inner `<template>`). It converts `<f-repeat>` to `<for>`, `<f-when>` to `<if>`, `f-ref` to a braced `w-ref`, and FAST's `$e` event argument to bare `e`. `f-slotted`/`f-children` are stripped from the output with a warning, since WebUI Framework has no equivalent; every other unsupported construct (unknown `f-*`, `$c` event context, non-braced `f-ref`, conflicting shadow-root modes) remains a hard error. The target's name reflects the WebUI Framework project's own current prerelease status, not the stability of this target's implementation.
- `fast-v3-ts` — emits TypeScript source that imports FAST helpers and exports `template` as an `html` tagged template.

## Rust usage

```rust
use microsoft_fast_convert::{convert_template, convert_stylesheet};

let source = r#"<f-template name="my-element"><template>{{title}}</template></f-template>"#;
let result = convert_template(source, "fast-v3-ts")?;
let ts = result.output;

let css = ":host { display: block; }";
let styles = convert_stylesheet(css, "fast-v3-ts", "styles")?;
```

`convert_template`/`convert_template_with_options` return
`Result<ConvertOutput, ConvertError>`, where `ConvertOutput { output: String,
warnings: Vec<ConvertWarning> }`. `warnings` reports non-fatal issues — such as a
stripped `f-slotted`/`f-children` directive, produced only by
`webui-framework-prerelease` — that didn't stop conversion;
`webui-prerelease` and `fast-v3-ts` output always have an empty `warnings`
vector, since neither strips anything. `convert_stylesheet` is unaffected and
still returns `Result<String, ConvertError>`.

`convert_stylesheet(stylesheet, syntax, export_name)` converts a CSS source string
into a TypeScript module that imports `css` from `@microsoft/fast-element` and
exports `export_name` as a `css` tagged template. It has no filesystem
requirement and, like `convert_template`, is only supported for the
`fast-v3-ts` syntax. `export_name` must be a valid TypeScript/JavaScript
identifier (no dotted paths).

`fast-v3-ts` output can optionally include an explicit `TSource` generic parameter
(`html<TypeSource>` instead of bare `html`) via `convert_template_with_options` and
`ConvertOptions`:

```rust
use microsoft_fast_convert::{convert_template_with_options, ConvertOptions};

let options = ConvertOptions {
    type_source: Some("MyElement".to_string()),
    type_source_import: Some("./my-element.js".to_string()),
    ..ConvertOptions::default()
};
let ts = convert_template_with_options(source, "fast-v3-ts", &options)?.output;
```

`type_source` must be a dotted TypeScript identifier (e.g. `MyElement` or
`Namespace.MyElement`); `type_source_import`, when provided, also emits a matching
`import type { <root_identifier> } from "<type_source_import>";` statement. `type_source`
is only supported for `fast-v3-ts`; `type_source_import` requires `type_source`.

Syntax metadata is available through `syntax_metadata()`. The metadata includes each
supported syntax name, required output extension, and default output suffix so package
tooling can avoid duplicating target definitions.

### Explicit public export types

Set `ConvertOptions { typed: true, ..ConvertOptions::default() }` for
`fast-v3-ts` template conversion. It emits an `ElementViewTemplate<TSource>`
annotation (or `ElementViewTemplate` when no source type is supplied) and a
type-only FAST import. The default remains byte-compatible unannotated output.
Other syntax targets reject `typed: true`.

`convert_stylesheet_with_options(css, syntax, export_name, &options)` similarly
emits `export const styles: ElementStyles = css...` with a type-only import.
Stylesheet options reject `type_source`/`type_source_import`. Existing
`convert_stylesheet` calls keep their original output. Type imports use the
root of dotted source names; FAST type names are aliased when necessary to
avoid collisions with supplied names.

Typed exports support `isolatedDeclarations`; the converter does not infer a
state interface. Supply a concrete source type for strict property validation.
Native struct literals should use `..ConvertOptions::default()` for unset options.

## WASM usage

When built with `wasm-pack --target nodejs`, the crate exports:

```ts
interface ConvertResult {
    readonly output: string;
    readonly warnings: string[];
}

convert_template(template: string, syntax: string): ConvertResult
convert_template_with_options(
    template: string,
    syntax: string,
    typeSource?: string,
    typeSourceImport?: string,
    typed?: boolean,
): ConvertResult
convert_stylesheet(stylesheet: string, syntax: string, export_name: string, typed?: boolean): string
convert_syntax_metadata(): string
```

`convert_syntax_metadata()` returns JSON metadata for supported syntax targets.
Errors are JavaScript `Error` instances, retaining the `ConvertError` message and
adding `code` plus optional `line`, `column`, `length`, and `templateName`.
Generated declarations export the `FastBuildError extends Error` interface.
Coordinates refer to the complete original input, not the extracted inner
template or rewritten output. They use one-based UTF-16 columns/lines and a UTF-16
error-token highlight length; CRLF is one break and lone CR/LF also break lines.
Options/syntax failures have no HTML coordinates.

Native `ConvertError` provides `code()`, `location() -> Option<ErrorLocation>`,
`template_name()`, and `kind()`; use `kind()` when matching source-wrapped
validation errors. Context fields are now boxed `ErrorContext` values. See the
[migration guide](../../packages/fast-build/docs/migration/plugin-integrations.md#structured-errors).

## Error codes

| Code | Failure |
|---|---|
| `unsupported-syntax` | Unknown syntax target |
| `typed-unsupported-for-syntax` | Typed output requested for non-TypeScript syntax |
| `type-source-unsupported-for-stylesheet` | Source-type options supplied for CSS |
| `stylesheet-unsupported-for-syntax` | CSS requested for a target other than `fast-v3-ts` |
| `invalid-export-name` | Invalid stylesheet export identifier |
| `type-source-unsupported-for-syntax` | Source-type options supplied for a non-TypeScript target |
| `invalid-type-source` | Invalid dotted source-type identifier |
| `type-source-import-requires-type-source` | Import module supplied without a source type |
| `missing-f-template` | No outer wrapper |
| `multiple-f-templates` | Multiple outer wrappers |
| `missing-f-template-name` | Outer wrapper lacks a string name |
| `empty-f-template-name` | Outer wrapper name is blank |
| `missing-inner-template` | No inner template |
| `multiple-inner-templates` | Multiple inner templates |
| `unclosed-element` | No matching closing element |
| `unclosed-tag` | Opening tag has no terminating `>` |
| `missing-value-attribute` | Directive lacks its required value |
| `invalid-directive-value` | Directive value lacks double-brace delimiters |
| `invalid-repeat-expression` | Repeat value is not `item in items` |
| `unclosed-binding` | Binding lacks closing delimiters |
| `empty-binding` | Binding expression is blank |
| `unsupported-f-attribute` | Unsupported FAST attribute |
| `unsupported-f-element` | Unsupported FAST element |
| `unsupported-expression` | Expression is outside the converter grammar |
| `unsupported-event-handler` | Event handler cannot be converted |
| `unsupported-event-context` | FAST context token has no WebUI mapping |
| `conflicting-shadow-root-mode` | Outer and inner shadow-root declarations conflict |
| `unsupported-publisher-attribute` | Outer attribute cannot be transferred |
| `invalid-attribute-value` | Attribute lacks its required braced form |

## Validation

The converter validates that the input contains exactly one `<f-template name="…">` with a non-empty name and exactly one inner `<template>`. It validates supported syntax values, `<f-repeat>` and `<f-when>` `value="{{…}}"` expressions, supported `f-*` attributes, and the limited expression grammar used for `fast-v3-ts` output. It also validates that `type_source` is a dotted identifier, that `type_source` is only supplied for `fast-v3-ts`, and that `type_source_import` is only supplied alongside `type_source`.

The `webui-framework-prerelease` target additionally validates that outer `<f-template>` attributes (other than `name`) are `shadowroot`-prefixed (`ConvertError::UnsupportedPublisherAttribute` otherwise), that a `shadowroot`-prefixed outer attribute doesn't conflict with a differently-valued attribute already on the inner `<template>` (`ConvertError::ConflictingShadowRootMode`), that `f-ref` values are single-braced (`ConvertError::InvalidAttributeValue`), and that event arguments don't use FAST's repeat-context tokens such as `$c` (`ConvertError::UnsupportedEventContext`). `f-slotted` and `f-children` are the one exception to this target's otherwise strict validation: rather than erroring, they are stripped from the output and reported via `ConvertOutput::warnings` as a `ConvertWarning::StrippedUnsupportedDirective`.

`convert_stylesheet` validates that `syntax` is `fast-v3-ts` (CSS conversion is not supported for `webui-prerelease`/`webui-framework-prerelease`) and that `export_name` is a valid TypeScript/JavaScript identifier. Stylesheet content is escaped for safe embedding in a TypeScript template literal: backslashes, backticks, literal `${` sequences, and carriage returns are all escaped.
