# Migrating plugin integration pipelines

## Attribute output changes

Missing and explicit `null` bindings now omit the entire attribute, including
mixed literal/binding values. To intentionally keep `href=""`, provide `""`
instead of null. JSON booleans on known HTML boolean attributes use presence:
false omits `disabled`, true emits it. ARIA/ordinary attribute booleans remain
textual. Use FAST's `?name` syntax for matching client-side truthy/falsy behavior.
Author bindings resolving to absence suppress matching template-host defaults.
Remove wrapper regular expressions that strip empty values: they would erase
intentional empty strings. Hydration slot counts remain unchanged.

## Typed converter output

The default output remains unchanged. Opt into `typed: true` (or `--typed`)
for explicit `ElementViewTemplate<TSource>` / `ElementStyles` annotations and
type-only imports, then remove wrapper string replacements. Supply
`type_source`/`--type-source` when strict source-property checking is required.
Rust `ConvertOptions` struct literals must include the new `typed` field or
use `..ConvertOptions::default()`.
The pre-1.0 native error enums also gain integration-related variants; update
exhaustive `RenderError` / `ConvertError` matches accordingly.

## Caller-owned host markup

Replace throwaway-host rendering and substring extraction with
`render_shadow_root` (WASM) or `render_shadow_root_*_with_locator` (Rust).
Pass resolved component state and insert the returned complete DSD `<template>`
into the host you own. The fragment does not include host/default attributes
or light-DOM children.

## Persisted template metadata

`parse_f_templates` keeps its JSON array shape and existing fields, adding
per-record `formatVersion: 1` and `bindings`. Preserve these fields when
persisting or constructing a keyed map. Unsupported/malformed explicit versions
now fail before rendering. Unversioned legacy maps remain supported, but cannot
receive stale-version protection. Regenerate metadata on format changes rather
than rewriting a version number onto incompatible data.

Bindings describe names, expression kinds, paths, and repeat scopes. Unknown
types and state optionality are explicitly null, not inferred declarations.
Repeat collections alone have a known array requirement. Complex/client
references are lexical descriptions; metadata is not a full state schema or
syntax-validation certificate. Use application declarations for definitive
type/requiredness checks.

Each newly parsed binding now includes an authored `span` with half-open `start`
and `end` positions in the complete input string. Offsets are zero-based UTF-16;
lines and UTF-16 columns are one-based. Use the original input, not the returned
trimmed `content`, when slicing or attaching diagnostics. The range covers the
trimmed expression without braces; repeat bindings locate only the iterable.
CRLF counts as one line break and two offset units; lone CR and LF each count
as a line break. Raw attribute entities are not decoded.

Format version 1 is unchanged, and renderers still accept older records without
spans. Regenerate persisted metadata to obtain authored locations; preserve spans
when mapping or serializing records. Native `BindingMetadata` struct literals
must now supply the public `span: SourceSpan` field; prefer `parse_f_templates`
to constructing descriptive metadata manually. Generated WASM declarations expose
`TemplateSourceSpan` and `TemplateSourcePosition`.
