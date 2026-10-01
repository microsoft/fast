# Design — microsoft-fast-convert

`microsoft-fast-convert` converts from FAST declarative syntax only. It accepts one FAST `<f-template>` string, validates the supported subset, and emits either WebUI prerelease HTML or FAST v3 TypeScript source. It also converts standalone CSS stylesheet strings into FAST v3 TypeScript `css` modules.

## Pipeline

```text
convert_template(template, syntax)
        │
        ├─ parse syntax (`webui-prerelease` | `fast-v3-ts`)
        ├─ validate one outer `<f-template name="…">`
        ├─ extract exactly one inner `<template>`
        └─ target converter

convert_stylesheet(stylesheet, syntax, export_name)
        │
        ├─ parse syntax — only `fast-v3-ts` supports CSS conversion
        ├─ validate `export_name` is a TypeScript/JavaScript identifier
        └─ escape stylesheet content into a `css` tagged template module
```

The implementation intentionally uses a small hand scanner instead of an HTML parser, matching the dependency style of `microsoft-fast-build`.

## Modules

| Module | Role |
| --- | --- |
| `lib.rs` | Public Rust API and crate exports |
| `wasm.rs` | `wasm-bindgen` exports for Node (`convert_template`, `convert_template_with_options`, `convert_stylesheet`, `convert_syntax_metadata`) |
| `error.rs` | `ConvertError` variants and context helpers |
| `html.rs` | Tag, attribute, and `<f-template>` scanning utilities |
| `expression.rs` | Limited declarative expression conversion for TypeScript output |
| `converter.rs` | Syntax selection and dispatch after shared `<f-template>` validation |
| `syntax/mod.rs` | Shared syntax-target helpers and exported syntax metadata |
| `syntax/webui.rs` | `webui-prerelease` conversion pass |
| `syntax/fast_v3_ts.rs` | `fast-v3-ts` conversion pass (templates and stylesheets) |

Syntax-specific conversion logic lives under `syntax/` so new targets can be added
without growing `converter.rs`. To add a syntax target, create a new module under
`syntax/`, expose a `convert(&str) -> Result<String, ConvertError>` function, add the
target's metadata (`name`, output `extension`, and default `suffix`) in that module,
add the accepted syntax value to `converter.rs`, and route the new `Syntax` variant
to the module. The `@microsoft/fast-build` CLI reads the exported WASM metadata, so
syntax names, output extensions, and default suffixes should be defined in Rust only.

## WebUI prerelease conversion

The WebUI target unwraps the outer `<f-template>` and preserves the inner `<template>` element. It rewrites only structural FAST directives:

- `<f-repeat value="{{item in items}}">` → `<for each="item in items">`
- `<f-when value="{{condition}}">` → `<if condition="condition">`

Other supported FAST attributes such as `@click`, `:prop`, `?bool`, `f-ref`, `f-children`, and `f-slotted` are preserved.

## FAST v3 TypeScript conversion

The TypeScript target always emits `export const template = html\`…\`;` and imports only helpers used by the converted template. It supports text and attribute bindings, `f-repeat`, `f-when`, `f-ref`, `f-children`, `f-slotted`, and event handler calls using `$e`/`$c`.

Repeat bodies use the same local alias mapping as FAST declarative templates: `{{item.name}}` inside `item in items` becomes `x => x.name`. Event handlers inside repeats map root handlers through FAST's repeat context chain (`c.parent`, `c.parentContext.parent`, and so on).

Literal template content is escaped for TypeScript template literals by escaping backticks, literal `${` sequences, and backslashes.

## CSS stylesheet conversion

`convert_stylesheet(stylesheet, syntax, export_name)` is a separate, filesystem-free
entry point from `convert_template`: it takes a plain CSS string (not an
`<f-template>` document) and an `export_name` rather than reading a name from the
input. Only `fast-v3-ts` is supported — CSS has no equivalent concept in the
`webui-prerelease` output, so any other syntax value is rejected with
`ConvertError::StylesheetUnsupportedForSyntax`.

`export_name` is validated as a TypeScript/JavaScript identifier
(`syntax::is_valid_identifier`): it must start with an ASCII letter, `_`, or `$`,
followed by any number of ASCII alphanumeric characters, `_`, or `$`. Unlike the
`type_source` dotted-identifier grammar used elsewhere in FAST tooling, dotted
paths are not accepted here because `export_name` names a single `const`
binding, not a type reference.

The generated module is deterministic:

```ts
import { css } from "@microsoft/fast-element/css.js";

export const styles = css`:host { display: block; }`;
```

Stylesheet content is escaped for safe embedding in a TypeScript template
literal by escaping backticks, literal `${` sequences, backslashes, and
carriage returns (`\r`, which may be present from `\r\n` line endings read off
disk). This reuses the same escaping approach as `fast_v3_ts::convert`'s
literal-content escaping, with an added carriage-return case.

### Explicit `TSource` generic

`ConvertOptions` (`convert_template_with_options`) carries optional `type_source` and
`type_source_import` fields, honored only by `fast-v3-ts`:

- `type_source` emits `export const template = html<TypeSource>\`…\`;` instead of the
  untyped `html` call. It must be a dotted identifier (`MyElement`,
  `Namespace.MyElement`); other syntax targets or malformed values are rejected in
  `converter::validate_options` before the template is walked.
- `type_source_import`, when combined with `type_source`, additionally emits
  `import type { <type_source> } from "<type_source_import>";` immediately after the
  helper imports. It is rejected on its own, since there is no type name to import.

This exists so `fast convert` output for templates combining multiple
differently-named `ref`/`children`/`slotted` directives (e.g. `packages/fast-build/test/fixtures/convert/supported.html`)
type-checks standalone once a concrete element type is supplied, instead of requiring
callers to hand-add the generic parameter after every conversion.
