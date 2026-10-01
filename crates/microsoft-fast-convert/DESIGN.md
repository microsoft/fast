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
| `wasm.rs` | `wasm-bindgen` exports for Node (`convert_template`, `convert_syntax_metadata`) |
| `error.rs` | `ConvertError` variants and context helpers |
| `html.rs` | Tag, attribute, and `<f-template>` scanning utilities |
| `expression.rs` | Limited declarative expression conversion for TypeScript output |
| `converter.rs` | Syntax selection and dispatch after shared `<f-template>` validation |
| `syntax/mod.rs` | Shared syntax-target helpers and exported syntax metadata |
| `syntax/webui.rs` | `webui-prerelease` conversion pass |
| `syntax/fast_v3_ts.rs` | `fast-v3-ts` conversion pass |

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
