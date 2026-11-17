# Migrating newly compiled DSD output

## Minor prerelease output migration

New compilation uses only standard `shadowrootmode` and never synthesizes a
legacy `shadowroot` alias:

```html
<!-- Previously -->
<template shadowrootmode="open" shadowroot="open">
<!-- Newly compiled -->
<template shadowrootmode="open">
```

Compilation now rejects authored `shadowroot` attributes with
`invalid-template-metadata`, including boolean/empty values, case variants and
conflicting or redundant pairs. This applies to HTML and shadow/host metadata,
including unused definitions and skipped branches. Slot discovery rejects them too.
Comments, attribute values and script/style/textarea text containing the word or
example markup are not treated as authored attributes.

Migrate definitions explicitly so closed roots do not silently become open:

```html
<!-- Before -->
<f-template name="my-card" shadowroot="closed">
<!-- After -->
<f-template name="my-card" shadowrootmode="closed">
```

In programmatic metadata, rename `{ name: "shadowroot", value: "closed" }` to
`{ name: "shadowrootmode", value: "closed" }`. If both attributes were authored,
remove `shadowroot` and choose the intended standard mode. Missing, boolean or empty
`shadowrootmode` defaults to `"open"`; there is no fallback to a legacy value.
Other DSD attributes, their spelling
and order, host defaults, escaping, whitespace, comments, hydration markers,
raw/preformatted text and nested template scopes are unchanged.

This is an intentional breaking output-contract migration in the minor prerelease
line. There is one standard-oriented output policy, not an optional compact mode:
maintaining a second permanent serializer for an obsolete redundant alias would
add configuration and compatibility surface for a small delivery saving.

## Browser compatibility

Legacy `shadowroot` was never supported across all major browser engines.
It first shipped in Chrome 90 in 2021; Firefox and Safari implemented only
standard `shadowrootmode`.

| Browser | Standard `shadowrootmode` | Legacy `shadowroot` |
|---|---|---|
| Chrome | 111+ (2023) | 90–110; removed in 111 |
| Edge | 111+ (2023) | 91–110 |
| Firefox | 123+ (2024) | Never supported |
| Safari, including iOS | 16.4+ (2023) | Never supported |

Standard `shadowrootmode` reached all three major browser engines on
February 20, 2024, when Firefox 123 shipped. Removing the alias drops native DSD
support for those older Chromium versions, rather than current Firefox or Safari.
Custom polyfills and tooling matching `[shadowroot]` must recognize
`[shadowrootmode]`.

Sources: [MDN compatibility data](https://github.com/mdn/browser-compat-data/blob/main/html/elements/template.json),
[Chrome's implementation history](https://web.dev/articles/declarative-shadow-dom),
and [Firefox 123 release notes](https://www.mozilla.org/en-US/firefox/123.0/releasenotes/).

## Consumers and retained assets

- Use `shadowrootmode` in output selectors and standards-aware DSD polyfills.
  Browsers/polyfills recognizing only `shadowroot` no longer receive that alias
  in newly compiled output. Upgrade those consumers before deploying new assets.
- Existing supported ESM/native artifacts still render their exact old bytes.
  No schema change, loader rewrite or client package release is required.
  Supported assets use the current `fast-server-js` / `fast-server-native`
  semantic operation-object schema 1, with required `entry`, named `templates`,
  component references to complete DSD templates and optional `host-attributes`.
  This does not restore the retired indexed JS plans or version-2 private native
  IR. Recompile those historical formats using the current compiler.
- `writeServerModule` and `writeServerArtifact` intentionally reuse unchanged
  managed assets even after a compiler upgrade. To explicitly migrate unchanged
  input, remove both the application-owned generated asset and its `.inputs.json`
  sidecar during a controlled clean build, then regenerate and deploy them together.
  `overwrite: true` alone does not bypass unchanged-input reuse.
- Update exact HTML snapshots only after reviewing this specific attribute change.
  Do not trim whitespace or strip markers to accommodate the migration.
- `innerHTML` remains a no-DSD parsing path; omitting the alias does not provide a
  fallback or change client-side rendering. Use navigation parsing or a
  standards-aware DSD insertion API.

## Qualification

From the monorepo root, build the compiler and use installed Playwright browsers:

```sh
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 npm run build -w @microsoft/fast-build
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml --test static_output --test custom_elements --test hydration --test native_artifacts -- --test-threads=1
npm run test:static-output -w @microsoft/fast-build
```

The browser fixture uses actual generated JS output, checks its exact native HTML
oracle, and delivers its unmodified UTF-8 bytes through an HTTP response.
Chromium, Firefox and WebKit independently parse both retained old output and new
output before client registration. Current fixture definitions use only standard
attributes; retained assets remain unchanged literal-byte loading controls.
Checks cover open/default/closed modes, focus/cloning/serialization flags, host defaults and
escaped attributes, nested components, ordinary template scopes, conditional and
repeat hydration, original element/text/repeat node identity, reactive updates,
preformatted/textarea text, inline separators and measured layout equality.
An inert-document `innerHTML` control and renderer `dsd: []` control remain separate.

Original `server-baseline.json`, `server-json-context-baseline.json` and benchmark
`expected-baseline.json` are retained untouched. Their independent modern
counterparts freeze the selected new contract; `legacy.fast`, `legacy.html` and
`modern.html` provide retained-byte/current-output browser oracles. Browser assertions,
not regex normalization, establish the bounded semantic qualification.
The retained-output JS/native fixtures were mechanically transcribed from the
historical baseline's private IR to the current semantic schema; their provenance
records both historical and current hashes. They are not represented as unchanged
historical compiler output. The retained HTML expectations remain unchanged; the modern oracle records
standard-only output, and compiler-produced current assets must match it exactly.

The fixture reports raw rendered UTF-16/UTF-8 sizes and gzip/Brotli sizes, excluding
external scripts, initial state and page assembly. It verifies exact HTTP delivery
without measuring CPU or latency. This narrow saving does not explain an overall
renderer performance gap or establish whole-corpus browser equivalence.
