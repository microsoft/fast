# FAST example design system

## Goals

- Provide a single Fluent 2-aligned token source for FAST example apps.
- Keep adoption opt-in: apps import the stylesheet once and consume variables.
- Support light, dark, and automatic theme selection through the `<html>`
  element.
- Make token names predictable enough that additional example apps can extend
  the system without inventing a new naming model.

## Non-goals

- This package is not a component library.
- This package does not ship FAST components, recipes, or layout primitives.
- This package does not enforce global element styling beyond exposing tokens.
- This package is not intended for publication outside the monorepo.

## Token taxonomy

| Category | Subcategories | Variants / states | Example |
| --- | --- | --- | --- |
| `color` | `neutral-background`, `neutral-foreground`, `neutral-stroke`, `brand`, `status-success`, `status-warning`, `status-danger` | roles and states such as `1`, `background`, `hover`, `pressed`, `selected`, `disabled`, `inverted` | `--fast-color-neutral-background-1-hover` |
| `font-family` | `base`, `monospace`, `numeric` | none | `--fast-font-family-base` |
| `font-size` | `base`, `hero` | numeric ramp values from `100` to `1000` | `--fast-font-size-hero-900` |
| `line-height` | `base`, `hero` | numeric ramp values from `100` to `1000` | `--fast-line-height-base-300` |
| `font-weight` | none | `regular`, `medium`, `semibold`, `bold` | `--fast-font-weight-semibold` |
| `spacing-horizontal` | none | `none`, `xxs`, `xs`, `s-nudge`, `s`, `m-nudge`, `m`, `l`, `xl`, `xxl`, `xxxl` | `--fast-spacing-horizontal-l` |
| `spacing-vertical` | none | `none`, `xxs`, `xs`, `s-nudge`, `s`, `m-nudge`, `m`, `l`, `xl`, `xxl`, `xxxl` | `--fast-spacing-vertical-m` |
| `border-radius` | none | `none`, `small`, `medium`, `large`, `xlarge`, `circular` | `--fast-border-radius-large` |
| `stroke-width` | none | `thin`, `thick`, `thicker`, `thickest` | `--fast-stroke-width-thick` |
| `shadow` | none | `2`, `4`, `8`, `16`, `28`, `64` | `--fast-shadow-16` |
| `duration` | none | `ultra-fast`, `faster`, `fast`, `normal`, `slow`, `slower`, `ultra-slow` | `--fast-duration-normal` |
| `curve` | none | `accelerate-max`, `accelerate-mid`, `accelerate-min`, `decelerate-max`, `decelerate-mid`, `decelerate-min`, `easy-ease`, `easy-ease-max`, `linear` | `--fast-curve-easy-ease` |

## Naming pattern

Every token follows the same kebab-case shape:

```text
token        = "--fast-" category [ "-" subcategory ] [ "-" role ]
               [ "-" variant ] [ "-" state ] ;
category     = "color" | "font-family" | "font-size" | "line-height" |
               "font-weight" | "spacing-horizontal" |
               "spacing-vertical" | "border-radius" | "stroke-width" |
               "shadow" | "duration" | "curve" ;
subcategory  = lowercase kebab-case semantic group ;
role         = lowercase kebab-case usage name ;
variant      = lowercase kebab-case size or emphasis value ;
state        = lowercase kebab-case interaction or status value ;
```

### Examples

- `--fast-color-neutral-background-1`
- `--fast-color-brand-background-hover`
- `--fast-font-size-base-300`
- `--fast-spacing-vertical-s-nudge`
- `--fast-curve-decelerate-max`

### Extension rules

1. Prefer existing categories before adding a new one.
2. Add a new category only when the token describes a new design dimension, not
   a one-off component need.
3. Keep names semantic and reusable; avoid component names such as
   `button-primary-blue`.
4. Reuse existing Fluent vocabulary where practical.
5. Do not encode implementation details, hex values, or product names in token
   names.
6. Add both light and dark values for any new color or shadow token.

## Theme model

The stylesheet applies light values on `:root` by default and mirrors those
values in `:root[data-theme="light"]` for explicit overrides. Dark values live in
`:root[data-theme="dark"]`. When no explicit attribute is set, the package falls
back to `@media (prefers-color-scheme: dark)` with `:root:not([data-theme])` so
apps automatically adapt to system preferences.

An attribute is used instead of a class because it is a single, explicit state
container on the `<html>` element. That makes SSR, hydration, testing, and DOM
inspection straightforward, and avoids mixing theme state with styling classes.

## Type ramp rationale

The type scale mirrors Fluent 2's base and hero ramps. Base sizes (`100`-`600`)
cover body copy, labels, and standard UI text. Hero sizes (`700`-`1000`) support
marketing or splash surfaces in example apps. The shared `100`-`1000` scale also
makes it easy to reason about line-height pairings and future additions.

## Color palette source

The color tokens are aligned to Fluent 2's communication palette, with
`#0F6CBD` as the primary brand blue. Neutral surfaces and state colors follow
Fluent 2 light and dark guidance closely while remaining intentionally compact
for example-app needs.

## Consumption pattern

1. Import `@microsoft/fast-examples-design-system/tokens.css` once from the app
   entry point.
2. Let the stylesheet register tokens on `:root`.
3. Reference tokens from component CSS with `var(--fast-...)`.
4. Optionally use `applyTheme()`, `toggleTheme()`, or `onThemeChange()` to
   control `data-theme` on `<html>`.

## Extension guidelines

When adding a token:

1. Check whether an existing token already captures the need.
2. Pick the smallest semantic name that works across multiple example apps.
3. Add the token to both theme branches if the value is color- or elevation-
   related.
4. Update `README.md` if the new token changes consumer-facing guidance.
5. Update this design doc when the taxonomy or extension rules change.

### Naming review checklist

- Is the token name semantic instead of component-specific?
- Does the token fit the `--fast-<category>-...` grammar?
- Is the name kebab-case and aligned to existing vocabulary?
- Does the token avoid synonyms for an existing concept?
- For colors and shadows, are both light and dark values defined?
- Would another example app understand how to consume it without extra docs?

## Token flow

```text
src/tokens.css
    |
    | copied during build
    v
 dist/tokens.css
    |
    | imported by app entry
    v
:root / :root[data-theme]
    |
    | CSS custom properties
    v
component styles -> var(--fast-...)
```

## References

- [Fluent 2 design tokens](https://fluent2.microsoft.design/design-tokens/)
- [Fluent 2 color guidance](https://fluent2.microsoft.design/color/)
- [Fluent UI React theme tokens](https://react.fluentui.dev/?path=/docs/concepts-developer-theming--docs)
