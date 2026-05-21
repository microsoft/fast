# FAST example apps — design guidance

This document is the workspace-level guide for building UI in `examples/*`. It
explains how the apps share a visual language, the constraints every example
must follow, and the rules that humans and coding agents should apply when
making changes. The token vocabulary itself lives in
[`design-system/DESIGN.md`](./design-system/DESIGN.md); read that file
alongside this one.

---

## Table of contents

1. [Goals](#goals)
2. [Non-goals](#non-goals)
3. [Architecture](#architecture)
4. [Token model](#token-model)
5. [Theme model](#theme-model)
6. [Authoring rules](#authoring-rules)
7. [Guidance for coding agents](#guidance-for-coding-agents)
8. [Anti-patterns](#anti-patterns)
9. [Reference](#reference)

---

## Goals

- Give every app in `examples/*` a shared, consistent visual language.
- Provide a single source of truth for shared visual tokens.
- Stay framework-free and dependency-free by exposing CSS custom properties
  only. No theme runtime, no helper API, no component layer.
- Let example apps own their own behavior — including theme toggles — using
  ordinary DOM APIs.

## Non-goals

- It is not a theme-authoring or palette-generation tool.
- It is not a component library.
- It is not published outside this monorepo.
- It does **not** ship a JavaScript or TypeScript theme API.

## Architecture

```text
@microsoft/fast-examples-design-system
        │  (tokens.css)
        ▼
  :root CSS custom properties (color/elevation via light-dark())
        │
        ▼
  var(--fast-*) inside component css`...` blocks
        │
        ▼
  rendered UI
        ▲
        │  (app code sets or removes the attribute)
<html data-theme="light" | "dark" | absent>
```

- The design-system package is private and CSS-only.
- Apps import `tokens.css` at startup.
- Components style themselves through `var(--fast-...)` references.
- Theme switching is owned by the consuming app, which writes the
  `data-theme` attribute directly on `<html>`. Removing the attribute returns
  the app to `prefers-color-scheme` behavior.

## Token model

The shared token vocabulary uses a **semantic, use-site-oriented**
naming model with a `--fast-` prefix. Tokens are organized by
use-site (`background-web-page-*`, `background-ctrl-brand-*`,
`foreground-ctrl-neutral-primary-*`, `stroke-divider-*`,
`status-danger-tint-*`) rather than by abstract color role. The grammar:

```text
--fast-<category>[-<subcategory>][-<slot>][-<variant>][-<state>]
```

| Category | Subcategory / slot examples | Variant / state examples |
| --- | --- | --- |
| `text` | `style-default-regular-font-family`, `style-default-header-weight`, `global-body3-font-size`, `global-display2-line-height` | — |
| `padding` | `content-{none, xx-small, x-small, small, medium, large, x-large, xx-large, xxx-large}` | — |
| `gap` | `between-content-{none, xx-small, x-small, small, medium, large, x-large, xx-large}` | — |
| `corner` | `{none, small, medium, large, circular}` | — |
| `stroke` | `width-default`, `width-divider-strong`, `divider-{default, subtle, strong, brand}`, `ctrl-on-outline-{rest, disabled}` | — |
| `ctrl` | `focus-outer-stroke`, `focus-outer-stroke-width` | — |
| `background` | `web-page-primary`, `layer-{primary-solid, secondary}`, `ctrl-{subtle, brand}` | `rest`, `hover`, `pressed`, `disabled` |
| `foreground` | `ctrl-{neutral-primary, neutral-secondary, hint, on-brand, brand}` | `rest`, `hover`, `pressed`, `disabled`, `default` |
| `status` | `{danger, success, warning}-{background, foreground}` and `-tint-{background, foreground, stroke}` | — |
| `shadow` | `card-rest-{key, ambient}`, `card-rest`, `flyout-{key, ambient}`, `flyout` | — |
| `duration` | `{ultra-fast, faster, fast, normal, gentle, slow, slower, ultra-slow}` | — |
| `curve` | `{accelerate, decelerate}-{max, mid, min}`, `easy-ease-max`, `easy-ease`, `linear` | — |

Interaction state (`rest`, `hover`, `pressed`, `disabled`, optionally
prefixed with `selected-`) is always the final segment when present:
`--fast-background-ctrl-brand-hover`, `--fast-background-ctrl-subtle-pressed`,
`--fast-foreground-ctrl-neutral-primary-disabled`.

A few representative tokens:

- Background / foreground: `--fast-background-layer-primary-solid`,
  `--fast-foreground-ctrl-neutral-primary-rest`,
  `--fast-background-ctrl-brand-rest`, `--fast-foreground-ctrl-on-brand-rest`,
  `--fast-status-danger-tint-foreground`.
- Type: `--fast-text-global-body3-font-size` paired with
  `--fast-text-global-body3-line-height`,
  `--fast-text-global-display2-font-size` paired with
  `--fast-text-global-display2-line-height`.
- Layout: `--fast-padding-content-medium`,
  `--fast-gap-between-content-x-small`, `--fast-corner-large`,
  `--fast-stroke-width-default`.
- Elevation and motion: `--fast-shadow-card-rest`, `--fast-duration-fast`,
  `--fast-curve-easy-ease`.

For the full taxonomy and the rules for adding tokens, see
[`design-system/DESIGN.md`](./design-system/DESIGN.md).

## Theme model

Three theme states are supported:

| `<html data-theme="...">` | Active theme |
| --- | --- |
| `"light"` | Light, regardless of system preference. |
| `"dark"` | Dark, regardless of system preference. |
| _absent_ | Follows `prefers-color-scheme`. |

The package implements this in a single stylesheet using `color-scheme`
and the CSS `light-dark()` function:

```css
:root {
    color-scheme: light dark;
    /* typography, spacing, radius, motion, etc. */
    --fast-background-web-page-primary: light-dark(#fafafa, #1f1f1f);
    --fast-foreground-ctrl-neutral-primary-rest: light-dark(#242424, #ffffff);
    /* ... */
}

:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }
```

`light-dark()` requires Chrome / Edge 123+, Firefox 120+, or Safari 17.5+
(all shipped 2023–2024). The example apps target evergreen browsers and
ship no fallback.

To switch themes from app code, write the attribute directly on the document
root. There is no shared API for this; the design-system package is CSS-only.

```ts
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-theme", "light");
document.documentElement.removeAttribute("data-theme"); // restore system
```

For an intentionally single-theme app — like
[`todo-app`](./todo-app/) — hard-code the attribute in markup
(`<html data-theme="light">`) and never touch it from JavaScript.

## Authoring rules

### Choose tokens by intent

- Pick the token whose **use-site** matches the styled element, not the
  token whose current value matches a desired hex code. The value will
  change between themes; the name will not.
- Pair `--fast-text-global-<tier>-font-size` and
  `--fast-text-global-<tier>-line-height` tokens by the same ramp tier so
  vertical rhythm stays consistent.

### Style components with tokens only

- Use `var(--fast-...)` for every color, font size, line height, padding,
  gap, corner, stroke width, shadow, duration, and curve.
- Layout primitives (`display`, `flex`, `grid`, `gap`, `align-items`, etc.)
  do not need tokens. Numeric scale values (font sizes, padding, gap, etc.)
  do.

### Scope app-local design decisions to the app

- If a value is meaningful inside only one component, define a local custom
  property inside that component's `css` block, ideally backed by a `--fast-*`
  token: `--my-card-elevation: var(--fast-shadow-card-rest);`.
- Do **not** add app-specific tokens at `:root` from inside an example app.
- Do **not** add a new shared token unless multiple apps or patterns will
  reuse it (see the decision tree in
  [`design-system/DESIGN.md`](./design-system/DESIGN.md)).

### Theme switching is part of the app, not the package

- Theme toggles, persistence, and event listeners belong in the consuming
  app, not in the shared package. Implement them inline using DOM APIs.
- Use the `data-theme` attribute on `<html>` — not a class, not a JS theme
  object, and not localStorage-driven CSS injection.

## Guidance for coding agents

These constraints exist so automated edits keep the visual language coherent
across `examples/*`. When editing files in this workspace:

- **Never import JavaScript or TypeScript from
  `@microsoft/fast-examples-design-system`.** The package intentionally
  exports CSS only.
- **Never hard-code design values** (colors, font sizes, line heights,
  padding, gaps, corners, stroke widths, shadows, durations, curves) in
  component styles. Use a `var(--fast-...)` token.
- **Never invent shared tokens at `:root`** from inside an example app. Add
  them to `@microsoft/fast-examples-design-system` instead.
- **Map intent, not value, when refactoring.** An existing `#666666`
  foreground used as helper text should become
  `--fast-foreground-ctrl-neutral-secondary-rest`, not whichever foreground
  token happens to match `#666666` literally in the current theme. Reserve
  `--fast-foreground-ctrl-hint-default` for placeholder and helper text
  specifically.
- **Pair font-size and line-height** tokens by the same ramp tier
  (`body3` ↔ `body3`, `display2` ↔ `display2`).
- **Theme toggling is two lines of DOM code.** Reach for
  `document.documentElement.setAttribute("data-theme", value)` or
  `removeAttribute("data-theme")` rather than introducing any shared helper.
- **Do not add a new theme name** (for example, a high-contrast theme)
  without first adding the matching `[data-theme="..."]` block to
  `tokens.css` and updating
  [`design-system/DESIGN.md`](./design-system/DESIGN.md).

## Anti-patterns

- Hard-coding colors, font sizes, line heights, padding, gaps, corners,
  stroke widths, shadows, durations, or curves in component CSS.
- Importing JavaScript from `@microsoft/fast-examples-design-system`. No such
  exports exist.
- Bypassing `var(--fast-...)` when styling shared UI patterns.
- Adding example-app-specific tokens to `:root`.
- Creating one-off aliases when an existing semantic token already
  communicates the right intent.
- Using class names instead of the `data-theme` attribute to switch themes.
- Naming tokens or local custom properties after products, components, or
  hex values.
- Using the historical state vocabulary (`default`, `active`,
  `default-hover`) — the current package uses `rest`, `hover`, `pressed`,
  `disabled`.

## Reference

- [Examples design-system package README](./design-system/README.md)
- [Examples design-system authoring guide](./design-system/DESIGN.md)
