# Migrating newly compiled DSD output

## Minor prerelease output migration

New compilation selects the mode from standard `shadowrootmode` and never synthesizes a
legacy `shadowroot` alias:

```html
<!-- Previously -->
<template shadowrootmode="open" shadowroot="open">
<!-- Newly compiled -->
<template shadowrootmode="open">
```

Only `shadowrootmode` selects the generated root's mode. Other authored attributes
follow normal forwarding and literal-output behavior; compilation does not
validate their presence.

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

## Regenerate all templates and assets

Regenerate all templates and generated ESM/native artifacts with the new version.
Deploy the regenerated assets with their matching helper/native library; do not
carry pre-upgrade generated output into this deployment.

- Use `shadowrootmode` in output selectors and standards-aware DSD polyfills.
  Browsers/polyfills recognizing only `shadowroot` no longer receive that alias
  in newly compiled output. Upgrade those consumers before deploying new assets.
- `writeServerModule` and `writeServerArtifact` intentionally reuse unchanged
  managed assets even after a compiler upgrade. For this migration, remove both
  the application-owned generated asset and its `.inputs.json`
  sidecar during a controlled clean build, then regenerate and deploy them together.
  `overwrite: true` alone does not bypass unchanged-input reuse.
- The `fast-server-js` / `fast-server-native` semantic schema remains version 1.
  No loader inspection, legacy-output adapter or compiler fingerprint is added.
  Ordinary unchanged-input caching can resume after the clean regeneration.
- Update exact HTML snapshots only after reviewing this specific attribute change.
  Do not trim whitespace or strip markers to accommodate the migration.
- `innerHTML` remains a no-DSD parsing path; omitting the alias does not provide a
  fallback or change client-side rendering. Use navigation parsing or a
  standards-aware DSD insertion API.

## Validation

From the monorepo root:

```sh
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 npm run build
CARGO_BUILD_JOBS=1 CARGO_INCREMENTAL=0 npm run test
```

Commit regenerated declarative `index.html` fixtures with the compiler change.
After committing, `npm run test:validation` must leave the worktree clean; do not
restore stale generated files after testing.

The canonical server, JSON-context and benchmark output baselines describe only
the regenerated contract. Existing Rust/Node parity and declarative browser tests
cover the new output without a parallel retained-output compatibility matrix.
