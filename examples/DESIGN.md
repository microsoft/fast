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
        │  (tokens.css / tokens-light.css / tokens-dark.css)
        ▼
  :root CSS custom properties
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
- Apps import one of its stylesheets at startup.
- Components style themselves through `var(--fast-...)` references.
- Theme switching is owned by the consuming app, which writes the
  `data-theme` attribute directly on `<html>`. Removing the attribute returns
  the app to `prefers-color-scheme` behavior.

## Token model

The shared token vocabulary uses **semantic, role-based names**. The grammar
is:

```text
--fast-<category>[-<role>][-<variant>][-<state>]
```

| Category | Role examples | Variant / scale examples |
| --- | --- | --- |
| `color` | `background`, `foreground`, `border`, `accent`, `feedback` | `default`, `canvas`, `subtle`, `muted`, `emphasis`, `inverse`, `disabled`, `on-accent`, `divider`, `strong`, `link`, `success-foreground`, `danger-background` |
| `font-family` | – | `base`, `monospace`, `numeric` |
| `font-size` / `line-height` | – | type-ramp names: `caption-2`, `caption-1`, `body-1`, `body-2`, `subtitle-2`, `subtitle-1`, `title-3`, `title-2`, `title-1`, `display` |
| `font-weight` | – | `regular`, `medium`, `semibold`, `bold` |
| `spacing`, `radius`, `border-width` | – | t-shirt sizing: `none`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, plus `pill` for radius |
| `shadow` | – | `xs`, `sm`, `md`, `lg`, `xl`, `2xl` |
| `duration` | – | `instant`, `fastest`, `fast`, `normal`, `slow`, `slowest`, `extra-slow` |
| `easing` | – | `standard`, `emphasized`, `accelerate[-subtle|-strong]`, `decelerate[-subtle|-strong]`, `linear` |

Interaction states (`hover`, `active`, `selected`, `disabled`, `focus`) are
always the final segment: `--fast-color-background-default-hover`,
`--fast-color-accent-default-active`,
`--fast-color-border-default-hover`.

A few representative tokens:

- Color: `--fast-color-background-default`, `--fast-color-foreground-default`,
  `--fast-color-accent-default`, `--fast-color-feedback-danger-foreground`.
- Type: `--fast-font-size-body-1` paired with `--fast-line-height-body-1`,
  `--fast-font-size-title-3` paired with `--fast-line-height-title-3`.
- Layout: `--fast-spacing-md`, `--fast-radius-lg`, `--fast-border-width-sm`.
- Elevation and motion: `--fast-shadow-md`, `--fast-duration-fast`,
  `--fast-easing-standard`.

For the full taxonomy and the rules for adding tokens, see
[`design-system/DESIGN.md`](./design-system/DESIGN.md).

## Theme model

Three theme states are supported:

| `<html data-theme="...">` | Active theme |
| --- | --- |
| `"light"` | Light, regardless of system preference. |
| `"dark"` | Dark, regardless of system preference. |
| _absent_ | Follows `prefers-color-scheme`. |

The package implements this via four CSS layers in `tokens.css`:

```css
:root { /* typography, spacing, radius, motion, etc. */ }
:root, :root[data-theme="light"] { /* light colors */ }
:root[data-theme="dark"] { /* dark colors */ }
@media (prefers-color-scheme: dark) {
    :root:not([data-theme]) { /* dark colors */ }
}
```

To switch themes from app code, write the attribute directly on the document
root. There is no shared API for this; the design-system package is CSS-only.

```ts
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.setAttribute("data-theme", "light");
document.documentElement.removeAttribute("data-theme"); // restore system
```

[`todo-app/src/todo-app.ts`](./todo-app/src/todo-app.ts) contains a working
three-state (light / dark / auto) toggle implemented this way.

## Authoring rules

### Choose tokens by intent

- Pick the token whose **role** matches the styled element, not the token
  whose current value matches a desired hex code. The value will change
  between themes; the role will not.
- Pair `--fast-font-size-*` and `--fast-line-height-*` tokens by the same
  ramp name so vertical rhythm stays consistent.

### Style components with tokens only

- Use `var(--fast-...)` for every color, font size, line height, spacing,
  radius, border width, shadow, duration, and easing.
- Layout primitives (`display`, `flex`, `grid`, `gap`, `align-items`, etc.)
  do not need tokens. Numeric scale values (font sizes, spacing, etc.) do.

### Scope app-local design decisions to the app

- If a value is meaningful inside only one component, define a local custom
  property inside that component's `css` block, ideally backed by a `--fast-*`
  token: `--my-card-elevation: var(--fast-shadow-md);`.
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
  spacing, radii, border widths, shadows, durations, easings) in component
  styles. Use a `var(--fast-...)` token.
- **Never invent shared tokens at `:root`** from inside an example app. Add
  them to `@microsoft/fast-examples-design-system` instead.
- **Map intent, not value, when refactoring.** An existing `#666666`
  foreground used as helper text should become
  `--fast-color-foreground-subtle`, not whichever foreground token happens to
  match `#666666` literally in the current theme.
- **Pair font-size and line-height** tokens by the same ramp name
  (`body-1` ↔ `body-1`, `title-3` ↔ `title-3`).
- **Theme toggling is two lines of DOM code.** Reach for
  `document.documentElement.setAttribute("data-theme", value)` or
  `removeAttribute("data-theme")` rather than introducing any shared helper.
- **Do not add a new theme name** (for example, a high-contrast theme)
  without first adding the matching `[data-theme="..."]` block to
  `tokens.css` and updating
  [`design-system/DESIGN.md`](./design-system/DESIGN.md).

## Anti-patterns

- Hard-coding colors, font sizes, line heights, spacing, radii, border
  widths, shadows, durations, or easings in component CSS.
- Importing JavaScript from `@microsoft/fast-examples-design-system`. No such
  exports exist.
- Bypassing `var(--fast-...)` when styling shared UI patterns.
- Adding example-app-specific tokens to `:root`.
- Creating one-off aliases when an existing semantic token already
  communicates the right intent.
- Using class names instead of the `data-theme` attribute to switch themes.
- Naming tokens or local custom properties after products, components, or
  hex values.

## Reference

- [Examples design-system package README](./design-system/README.md)
- [Examples design-system authoring guide](./design-system/DESIGN.md)
