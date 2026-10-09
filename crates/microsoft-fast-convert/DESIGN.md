# Design — microsoft-fast-convert

`microsoft-fast-convert` converts from FAST declarative syntax only. It accepts one FAST `<f-template>` string, validates the supported subset, and emits WebUI prerelease HTML, WebUI Framework prerelease HTML, or FAST v3 TypeScript source. It also converts standalone CSS stylesheet strings into FAST v3 TypeScript `css` modules.

## Pipeline

```text
convert_template(template, syntax)
        │
        ├─ parse syntax (`webui-prerelease` | `fast-v3-ts` | `webui-framework-prerelease`)
        ├─ validate one outer `<f-template name="…">`
        ├─ extract exactly one inner `<template>` (plus other outer attributes,
        │  for `webui-framework-prerelease`)
        └─ target converter → `ConvertOutput { output, warnings }`

convert_stylesheet(stylesheet, syntax, export_name)
        │
        ├─ parse syntax — only `fast-v3-ts` supports CSS conversion
        ├─ validate `export_name` is a TypeScript/JavaScript identifier
        └─ escape stylesheet content into a `css` tagged template module
```

The implementation intentionally uses a small hand scanner instead of an HTML parser, matching the dependency style of `microsoft-fast-build`.

Every `convert_template`/`convert_template_with_options` call (for every syntax
target) returns `ConvertOutput { output: String, warnings: Vec<ConvertWarning> }`
rather than a bare string, so the shape is uniform at the API boundary. In
practice only `webui-framework-prerelease` ever produces a non-empty `warnings`
list — see below; `webui-prerelease` and `fast-v3-ts` always return an empty
list. `convert_stylesheet` is unaffected and still returns a plain `String`,
since it has no construct warnings apply to.

## Modules

| Module | Role |
| --- | --- |
| `lib.rs` | Public Rust API and crate exports |
| `wasm.rs` | `wasm-bindgen` exports for Node (`convert_template`, `convert_template_with_options`, `convert_stylesheet`, `convert_syntax_metadata`) |
| `warning.rs` | `ConvertOutput`/`ConvertWarning` — the non-fatal counterpart to `ConvertError` |
| `error.rs` | `ConvertError` variants and context helpers |
| `html.rs` | Tag, attribute, and `<f-template>` scanning utilities |
| `expression.rs` | Limited declarative expression conversion for TypeScript output |
| `converter.rs` | Syntax selection and dispatch after shared `<f-template>` validation |
| `syntax/mod.rs` | Shared syntax-target helpers and exported syntax metadata |
| `syntax/webui.rs` | `webui-prerelease` conversion pass |
| `syntax/webui_framework_prerelease.rs` | `webui-framework-prerelease` conversion pass |
| `syntax/fast_v3_ts.rs` | `fast-v3-ts` conversion pass (templates and stylesheets) |

Syntax-specific conversion logic lives under `syntax/` so new targets can be added
without growing `converter.rs`. To add a syntax target, create a new module under
`syntax/`, expose a `convert(...) -> Result<ConvertOutput, ConvertError>` function
(or a plain `Result<String, ConvertError>` wrapped with `ConvertOutput::without_warnings`
if the target never produces warnings), add the target's metadata (`name`, output
`extension`, and default `suffix`) in that module, add the accepted syntax value to
`converter.rs`, and route the new `Syntax` variant to the module. The
`@microsoft/fast-build` CLI reads the exported WASM metadata, so syntax names,
output extensions, and default suffixes should be defined in Rust only.

## WebUI prerelease conversion

The `webui-prerelease` target emits source accepted by WebUI's FAST parser
plugin. It unwraps the outer `<f-template>` and preserves the inner `<template>`
element, rewriting only structural FAST directives:

- `<f-repeat value="{{item in items}}">` → `<for each="item in items">`
- `<f-when value="{{condition}}">` → `<if condition="condition">`

Other supported FAST attributes such as `@click`, `:prop`, `?bool`, `f-ref`,
`f-children`, and `f-slotted` are preserved unchanged. Outer `<f-template>`
attributes other than `name` are ignored by this target (no Shadow/Light DOM
merge, no publisher-attribute validation) — see `webui-framework-prerelease`
below for that behavior.

Unknown `f-*` elements and attributes use `ConvertError::UnsupportedFElement`/
`ConvertError::UnsupportedFAttribute`, shared with the other targets.

## WebUI Framework prerelease conversion

The `webui-framework-prerelease` target converts FAST's declarative syntax into
the Microsoft WebUI Framework's own declarative runtime syntax — distinct from,
and independent of, `webui-prerelease`'s output for WebUI's FAST parser plugin.
Note that the target's name reflects the WebUI Framework *project's* own current
prerelease status, not the stability of this target's implementation. Because
the WebUI Framework runtime has no equivalent for some FAST directives, this
target rejects non-isomorphic constructs instead of preserving them — callers
are expected to adapt the FAST source to WebUI Framework idioms before
invoking this target. `webui-prerelease` and `fast-v3-ts` output are
unaffected by this target.

### Publisher wrapper and Shadow/Light DOM

`html::parse_template_document` captures every attribute on the outer
`<f-template>` other than `name` as `ParsedTemplate.publisher_attributes`
(`webui-prerelease` and `fast-v3-ts` ignore this field). The
`webui-framework-prerelease` target uses it to decide the inner `<template>`'s
Shadow/Light DOM policy:

- The outer `<f-template name="…">` wrapper is always removed; only the inner
  `<template>` element remains in the output.
- Any outer attribute whose name starts with `shadowroot` (case-insensitive, e.g.
  `shadowrootmode`, `shadowrootdelegatesfocus`) is moved onto the inner `<template>`.
- If the inner `<template>` already declares the same `shadowroot*` attribute with
  the same value, the outer copy is silently deduplicated. If the inner element
  declares a different value for the same attribute name, the conversion fails with
  `ConvertError::ConflictingShadowRootMode`.
- Any other outer attribute (not `name`, not `shadowroot`-prefixed) is rejected with
  `ConvertError::UnsupportedPublisherAttribute` — the target does not know how to
  transfer arbitrary publisher metadata onto the inner `<template>`.
- When no `shadowroot*` attribute is present at all, the output is a plain Light DOM
  `<template>` with no shadow-root attributes added.

### Directive mappings

Structural directives map the same way as `webui-prerelease`:

- `<f-repeat value="{{item in items}}">` → `<for each="item in items">`
- `<f-when value="{{condition}}">` → `<if condition="condition">`

### `f-ref` and events

- `f-ref="{input}"` → `w-ref="{input}"`. The value must be a single-braced
  expression (`{expr}`); a value that isn't wrapped in single braces is rejected
  with `ConvertError::InvalidAttributeValue`.
- Event handler values such as `@click="{select($e)}"` are preserved as handler
  calls, with FAST's `$e` event argument rewritten to bare `e` (WebUI Framework's
  event parameter name). Ordinary arguments — identifiers, dotted paths, and other
  literals — pass through unchanged.
- `$c` (and any other `$`-prefixed token, including traversals such as
  `$c.parent`) has no WebUI Framework equivalent, since WebUI Framework has no
  concept of FAST's repeat context chain. These are rejected with
  `ConvertError::UnsupportedEventContext`.

### `f-slotted` and `f-children`: stripped with a warning

Unlike every other unsupported construct in this target (unknown `f-*` elements
and attributes, non-braced `f-ref`, `$c` event context, conflicting shadow-root
modes, unsupported publisher attributes — all of which remain hard errors),
`f-slotted` and `f-children` are removed from the output and reported as a
`ConvertWarning::StrippedUnsupportedDirective` instead of aborting conversion.
WebUI Framework has no built-in lifecycle equivalent to FAST's slotted/children
observation, and FAST Convert does not invent lifecycle behavior to emulate one;
treating only these two directives as warnings (rather than every unsupported
construct) lets a batch conversion surface every directive a caller needs to
rewrite in one pass instead of stopping at the first one. A caller that needs
slotted/children behavior should rewrite the directive to a WebUI Framework
idiom — such as a `w-ref` combined with a `@slotchange` handler — in the FAST
source, either before or after conversion.

### Passthrough bindings

Already-native bindings such as `{{title}}`, `?disabled="{{disabled}}"`,
`:config="{{config}}"`, and `@click="{save()}"` pass through largely unchanged.
The target applies light grammar validation only — double-brace bindings must be
non-empty and properly closed — matching the validation already performed for
`webui-prerelease` and `fast-v3-ts`.

Unknown `f-*` elements and attributes continue to use the existing
`UnsupportedFElement`/`UnsupportedFAttribute` errors shared with
`webui-prerelease`.

### Suffix deviation

The target's default output suffix is `.webui-framework.html`, not
`.webui.html`. This deliberately differs from `webui-prerelease`'s
`.webui.html` suffix: if it reused that suffix, converting the same input to
both targets without an explicit `--output` would silently overwrite one
target's output file with the other's.

## FAST v3 TypeScript conversion

The TypeScript target always emits `export const template = html\`…\`;` and imports only helpers used by the converted template. It supports text and attribute bindings, `f-repeat`, `f-when`, `f-ref`, `f-children`, `f-slotted`, and event handler calls using `$e`/`$c`. This target never produces warnings; `fast-v3-ts` conversions always return an empty `ConvertOutput::warnings`.

Repeat bodies use the same local alias mapping as FAST declarative templates: `{{item.name}}` inside `item in items` becomes `x => x.name`. Event handlers inside repeats map root handlers through FAST's repeat context chain (`c.parent`, `c.parentContext.parent`, and so on).

Literal template content is escaped for TypeScript template literals by escaping backticks, literal `${` sequences, and backslashes.

## CSS stylesheet conversion

`convert_stylesheet(stylesheet, syntax, export_name)` is a separate, filesystem-free
entry point from `convert_template`: it takes a plain CSS string (not an
`<f-template>` document) and an `export_name` rather than reading a name from the
input. Only `fast-v3-ts` is supported — CSS has no equivalent concept in the
`webui-prerelease`/`webui-framework-prerelease` output, so any other syntax value
is rejected with `ConvertError::StylesheetUnsupportedForSyntax`.

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

## wasm boundary

`wasm.rs` mirrors the Rust API for Node consumers, with one adaptation:
`convert_template`/`convert_template_with_options` return a `#[wasm_bindgen]`
`ConvertResult` struct (`output: string`, `warnings: string[]` as JS getters)
rather than a bare string, so JS callers can read both the converted output and
any warning messages (each a pre-formatted `ConvertWarning::to_string()`) without
a JSON encode/decode round trip. `convert_stylesheet` and `convert_syntax_metadata`
are unaffected.
