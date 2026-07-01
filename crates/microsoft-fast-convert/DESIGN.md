# Design — microsoft-fast-convert

`microsoft-fast-convert` converts from FAST declarative syntax only. It accepts one FAST `<f-template>` string, validates the supported subset, and emits either WebUI prerelease HTML or FAST v3 TypeScript source.

## Pipeline

```text
convert_template(template, syntax)
        │
        ├─ parse syntax (`webui-prerelease` | `fast-v3-ts`)
        ├─ validate one outer `<f-template name="…">`
        ├─ extract exactly one inner `<template>`
        └─ target converter
```

The implementation intentionally uses a small hand scanner instead of an HTML parser, matching the dependency style of `microsoft-fast-build`.

## Modules

| Module | Role |
| --- | --- |
| `lib.rs` | Public Rust API and crate exports |
| `wasm.rs` | `wasm-bindgen` export for Node (`convert_template`) |
| `error.rs` | `ConvertError` variants and context helpers |
| `html.rs` | Tag, attribute, and `<f-template>` scanning utilities |
| `expression.rs` | Limited declarative expression conversion for TypeScript output |
| `converter.rs` | Syntax selection and dispatch after shared `<f-template>` validation |
| `syntax/mod.rs` | Shared syntax-target helpers for directive values and attribute validation |
| `syntax/webui.rs` | `webui-prerelease` conversion pass |
| `syntax/fast_v3_ts.rs` | `fast-v3-ts` conversion pass |

Syntax-specific conversion logic lives under `syntax/` so new targets can be added
without growing `converter.rs`. To add a syntax target, create a new module under
`syntax/`, expose a `convert(&str) -> Result<String, ConvertError>` function, add the
accepted syntax value to `converter.rs`, and route the new `Syntax` variant to the
module.

## WebUI prerelease conversion

The WebUI target unwraps the outer `<f-template>` and preserves the inner `<template>` element. It rewrites only structural FAST directives:

- `<f-repeat value="{{item in items}}">` → `<for each="item in items">`
- `<f-when value="{{condition}}">` → `<if condition="condition">`

Other supported FAST attributes such as `@click`, `:prop`, `?bool`, `f-ref`, `f-children`, and `f-slotted` are preserved.

## FAST v3 TypeScript conversion

The TypeScript target always emits `export const template = html\`…\`;` and imports only helpers used by the converted template. It supports text and attribute bindings, `f-repeat`, `f-when`, `f-ref`, `f-children`, `f-slotted`, and event handler calls using `$e`/`$c`.

Repeat bodies use the same local alias mapping as FAST declarative templates: `{{item.name}}` inside `item in items` becomes `x => x.name`. Event handlers inside repeats map root handlers through FAST's repeat context chain (`c.parent`, `c.parentContext.parent`, and so on).

Literal template content is escaped for TypeScript template literals by escaping backticks, literal `${` sequences, and backslashes.
