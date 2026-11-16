# Migrating newly compiled DSD output

## Minor prerelease output migration

New compilation omits only a redundant legacy `shadowroot` alias:

```html
<!-- Previously -->
<template shadowrootmode="open" shadowroot="open">
<!-- Newly compiled -->
<template shadowrootmode="open">
```

Mode precedence is unchanged: non-empty `shadowrootmode`, then non-empty legacy
`shadowroot`, then `"open"`. Legacy-only authored definitions still work.
Explicit conflicting modes remain byte-preserved, for example
`shadowrootmode="closed" shadowroot="open"`. Other DSD attributes, their spelling
and order, host defaults, escaping, whitespace, comments, hydration markers,
raw/preformatted text and nested template scopes are unchanged.

This is an intentional breaking output-contract migration in the minor prerelease
line. There is one standard-oriented output policy, not an optional compact mode:
maintaining a second permanent serializer for an obsolete redundant alias would
add configuration and compatibility surface for a small delivery saving.

## Consumers and retained assets

- Use `shadowrootmode` in output selectors and standards-aware DSD polyfills.
  Browsers/polyfills recognizing only `shadowroot` no longer receive that alias
  in newly compiled equivalent-mode output. Upgrade those consumers, or keep
  previously generated assets/compiler output until the application can migrate.
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
CARGO_BUILD_JOBS=2 wasm-pack build --target nodejs crates/microsoft-fast-build --out-dir ../../packages/fast-build/wasm --dev
CARGO_BUILD_JOBS=2 cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml --test static_output --test custom_elements --test hydration --test native_artifacts -- --test-threads=1
npm run test:static-output -w @microsoft/fast-build
```

The browser fixture uses actual generated JS output, checks its exact native HTML
oracle, and delivers its unmodified UTF-8 bytes through an HTTP response.
Chromium, Firefox and WebKit independently parse both retained old output and new
output before client registration. Checks cover open/default/legacy-input/closed
and conflicting modes, focus/cloning/serialization flags, host defaults and
escaped attributes, nested components, ordinary template scopes, conditional and
repeat hydration, original element/text/repeat node identity, reactive updates,
preformatted/textarea text, inline separators and measured layout equality.
An inert-document `innerHTML` control and renderer `dsd: []` control remain separate.

Original `server-baseline.json`, `server-json-context-baseline.json` and benchmark
`expected-baseline.json` are retained untouched. Their independent modern
counterparts freeze the selected new contract; `legacy.fast`, `legacy.html` and
`modern.html` retain explicit compatibility/browser oracles. Browser assertions,
not regex normalization, establish the bounded semantic qualification.
The retained-output JS/native fixtures were mechanically transcribed from the
historical baseline's private IR to the current semantic schema; their provenance
records both historical and current hashes. They are not represented as unchanged
historical compiler output. The independently frozen HTML expectations remain
unchanged, and compiler-produced current assets must match the modern oracle.

The fixture reports raw rendered UTF-16/UTF-8 sizes and gzip/Brotli sizes, excluding
external scripts, initial state and page assembly. It verifies exact HTTP delivery
without measuring CPU or latency. This narrow saving does not explain an overall
renderer performance gap or establish whole-corpus browser equivalence.
