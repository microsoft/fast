# FAST Example Apps – Design System

This document is a contributor-oriented guide to the shared design system for FAST example apps. The system lives in `@microsoft/fast-examples-design-system`, exposes `@microsoft/fast-examples-design-system/tokens.css`, and gives every example app the same visual language without introducing an opinionated component layer.

---

## Table of Contents

1. [Goals](#goals)
2. [Non-goals](#non-goals)
3. [Architecture](#architecture)
4. [Token taxonomy](#token-taxonomy)
5. [Naming grammar](#naming-grammar)
6. [Theme model](#theme-model)
7. [Type ramp rationale](#type-ramp-rationale)
8. [Extension guidelines](#extension-guidelines)
9. [Light vs dark color mapping](#light-vs-dark-color-mapping)
10. [Anti-patterns](#anti-patterns)
11. [Reference](#reference)

---

## Goals

- Align example apps with the Fluent 2 design language.
- Provide a single source of truth for shared visual tokens.
- Stay framework-free by exposing CSS custom properties instead of components.
- Keep example app styling portable across FAST templates and plain CSS usage.

## Non-goals

- This package is not a replacement for `@fluentui/web-components`.
- It is not a Theme Builder or token authoring tool.
- It is not a component library.
- It is not published to npm outside this monorepo.

## Architecture

Every example app imports the shared token stylesheet once and then consumes tokens directly in component styles.

```text
tokens.css ──▶ :root vars ──▶ var(--fast-*) in component css`...` ──▶ rendered UI
                     ▲
                     │
             applyTheme() sets data-theme attribute
```

The flow is intentionally simple:

- `@microsoft/fast-examples-design-system/tokens.css` defines the token contract.
- `:root` carries the default light theme values.
- Example app components read those values through `var(--fast-...)` inside FAST `css` template literals.
- `applyTheme()` or direct writes to `document.documentElement.dataset.theme` choose an explicit light or dark override.
- When no `data-theme` attribute is present, the CSS honors `prefers-color-scheme`.

## Token taxonomy

| Category | Variants | Purpose |
| --- | --- | --- |
| color | neutral, brand, status | Surfaces, text, borders, states |
| font-family | base, monospace, numeric | Typeface stacks |
| font-size & line-height | base-100…base-600, hero-700…hero-1000 | Type ramp |
| font-weight | regular, medium, semibold, bold | Weights |
| spacing-horizontal/vertical | none, xxs, xs, s-nudge, s, m-nudge, m, l, xl, xxl, xxxl | Padding, margin, and gap |
| border-radius | none, small, medium, large, xlarge, circular | Corners |
| stroke-width | thin, thick, thicker, thickest | Borders and outlines |
| shadow | 2, 4, 8, 16, 28, 64 | Elevation |
| duration | ultra-fast, faster, fast, normal, slow, slower, ultra-slow | Motion timing |
| curve | accelerate-{max,mid,min}, decelerate-{max,mid,min}, easy-ease[-max], linear | Motion easing |

Representative tokens include:

- Color: `--fast-color-neutral-background-1`, `--fast-color-neutral-foreground-1`, `--fast-color-brand-background`, `--fast-color-status-success-foreground`
- Type ramp: `--fast-font-size-base-100` through `--fast-font-size-base-600`, `--fast-font-size-hero-700` through `--fast-font-size-hero-1000`, paired with matching `--fast-line-height-*` names
- Spacing: `--fast-spacing-horizontal-xs` through `--fast-spacing-horizontal-xxxl`, mirrored by `--fast-spacing-vertical-*`
- Radius: `--fast-border-radius-none`, `--fast-border-radius-small`, `--fast-border-radius-medium`, `--fast-border-radius-large`, `--fast-border-radius-xlarge`, `--fast-border-radius-circular`
- Stroke: `--fast-stroke-width-thin`, `--fast-stroke-width-thick`, `--fast-stroke-width-thicker`, `--fast-stroke-width-thickest`
- Shadow: `--fast-shadow-2`, `--fast-shadow-4`, `--fast-shadow-8`, `--fast-shadow-16`, `--fast-shadow-28`, `--fast-shadow-64`
- Motion: `--fast-duration-ultra-fast`, `--fast-duration-normal`, `--fast-duration-ultra-slow`, `--fast-curve-accelerate-max`, `--fast-curve-decelerate-mid`, `--fast-curve-easy-ease`, `--fast-curve-linear`

## Naming grammar

```text
--fast-<category>[-<subcategory>][-<role>][-<variant>][-<state>]
```

| Placeholder | Meaning | Allowed values and notes |
| --- | --- | --- |
| `category` | The top-level token domain | `color`, `font-family`, `font-size`, `line-height`, `font-weight`, `spacing-horizontal`, `spacing-vertical`, `border-radius`, `stroke-width`, `shadow`, `duration`, `curve` |
| `subcategory` | The second classifier within a category | Examples include `neutral`, `brand`, `status`, `base`, `hero` |
| `role` | The semantic job the token performs | Examples include `background`, `foreground`, `success` |
| `variant` | The named step or scale value | Examples include `1`, `100`, `xs`, `medium`, `16`, `normal`, `mid` |
| `state` | An optional trailing qualifier | Used only when one more level of specificity is required, such as `foreground` or `max` |

Ordering rules:

1. Always start with the `--fast-` prefix.
2. Keep segments in category → subcategory → role → variant → state order.
3. Omit unused segments instead of inventing placeholder names.
4. Use lowercase kebab-case only.
5. Extend scales in a predictable direction: larger numbers or labels represent larger values, stronger elevation, or slower timing.
6. Keep paired systems aligned, such as `--fast-font-size-base-300` with `--fast-line-height-base-300`.

Examples by category:

| Category | Example tokens |
| --- | --- |
| color | `--fast-color-neutral-background-1`, `--fast-color-neutral-foreground-1`, `--fast-color-brand-background`, `--fast-color-status-success-foreground` |
| font-family | `--fast-font-family-base`, `--fast-font-family-monospace`, `--fast-font-family-numeric` |
| font-size | `--fast-font-size-base-100`, `--fast-font-size-base-600`, `--fast-font-size-hero-700`, `--fast-font-size-hero-1000` |
| line-height | `--fast-line-height-base-100`, `--fast-line-height-base-600`, `--fast-line-height-hero-700`, `--fast-line-height-hero-1000` |
| font-weight | `--fast-font-weight-regular`, `--fast-font-weight-medium`, `--fast-font-weight-semibold`, `--fast-font-weight-bold` |
| spacing-horizontal | `--fast-spacing-horizontal-none`, `--fast-spacing-horizontal-xs`, `--fast-spacing-horizontal-xxxl` |
| spacing-vertical | `--fast-spacing-vertical-none`, `--fast-spacing-vertical-xs`, `--fast-spacing-vertical-xxxl` |
| border-radius | `--fast-border-radius-none`, `--fast-border-radius-medium`, `--fast-border-radius-circular` |
| stroke-width | `--fast-stroke-width-thin`, `--fast-stroke-width-thickest` |
| shadow | `--fast-shadow-2`, `--fast-shadow-16`, `--fast-shadow-64` |
| duration | `--fast-duration-ultra-fast`, `--fast-duration-normal`, `--fast-duration-ultra-slow` |
| curve | `--fast-curve-accelerate-max`, `--fast-curve-accelerate-mid`, `--fast-curve-decelerate-min`, `--fast-curve-easy-ease`, `--fast-curve-easy-ease-max`, `--fast-curve-linear` |

## Theme model

`tokens.css` carries light theme defaults on `:root`, then layers explicit overrides through `html[data-theme="light"]` and `html[data-theme="dark"]`. If the document root has no `data-theme` attribute, the shared stylesheet falls back to `prefers-color-scheme` so the example app tracks the user's system preference.

```css
:root {
    color-scheme: light dark;
}

html[data-theme="light"] {
    /* explicit light token values */
}

html[data-theme="dark"] {
    /* explicit dark token values */
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme]) {
        /* dark overrides when no explicit theme is set */
    }
}
```

To wire a simple toggle, either set the attribute directly or use the shared utility helpers.

```ts
import {
    getTheme,
    onThemeChange,
    prefersDarkTheme,
    toggleTheme,
} from "@microsoft/fast-examples-design-system";

document
    .querySelector<HTMLButtonElement>("[data-theme-toggle]")
    ?.addEventListener("click", () => {
        toggleTheme();
    });

onThemeChange(() => {
    const explicitTheme = getTheme();
    const effectiveTheme = explicitTheme ?? (prefersDarkTheme() ? "dark" : "light");

    document
        .querySelector("[data-theme-toggle]")
        ?.setAttribute("aria-label", `Switch theme from ${effectiveTheme}`);
});
```

Use `applyTheme()` when you need to force `light` or `dark` on `<html>`. Remove the attribute to return to system-driven behavior.

## Type ramp rationale

The typography scale follows Fluent's split ramp model:

| Ramp | Tokens | Intended usage |
| --- | --- | --- |
| base | `--fast-font-size-base-100` through `--fast-font-size-base-600` with matching `--fast-line-height-base-*` | Body copy, labels, form text, dense UI, and local headings |
| hero | `--fast-font-size-hero-700` through `--fast-font-size-hero-1000` with matching `--fast-line-height-hero-*` | Page titles, large callouts, empty states, and display text |

The numeric scale is continuous from `100` through `1000`: smaller numbers represent smaller, denser UI text; larger numbers represent larger, more expressive display sizes. Every font-size token has a same-named line-height partner so example apps can scale typography without improvising vertical rhythm.

## Extension guidelines

### Add a new token or reuse an existing one?

```text
Need a value?
├─ Can an existing token express the same intent? → Reuse it.
├─ Is the value only local to one component? → Create a component-scoped custom property prefixed by the app name and back it with a FAST token.
├─ Will multiple example apps or features share it? → Add a token in the existing category.
└─ Does it describe a brand-new design domain? → Coordinate with maintainers before adding a category.
```

### Naming review checklist

- Keep the `--fast-` prefix and do not introduce extra prefixes, including `I`-style or app-specific shorthand.
- Use lowercase kebab-case for every segment.
- Fit the existing grammar and preserve category ordering.
- Keep scales increasing and easy to scan.
- For semantic colors, provide paired light and dark values.
- Document every addition in this file and update the token taxonomy table.

### When to add a new category

Rarely. Add a new category only when the new token family cannot fit an existing domain such as color, type, spacing, shape, elevation, or motion. Category additions change the shared vocabulary for every example app, so they should be proposed and reviewed with maintainers before implementation.

## Light vs dark color mapping

| Token | Light theme | Dark theme |
| --- | --- | --- |
| `--fast-color-neutral-background-1` | White or near-white primary surface | Near-black primary surface |
| `--fast-color-neutral-foreground-1` | Near-black default text | Near-white default text |
| `--fast-color-brand-background` | Fluent brand blue surface | Similar brand blue surface, tuned for dark-theme contrast |
| `--fast-color-status-success-foreground` | Success foreground tuned for light surfaces | Success foreground tuned for dark surfaces |

The important rule is semantic stability: token names stay the same across themes, while the mapped values change to preserve contrast and Fluent 2 intent.

## Anti-patterns

- Do not hard-code colors, spacing, radii, or font sizes in example app styles.
- Do not bypass `var(--fast-...)` when styling shared UI patterns.
- Do not define example-app-specific tokens at `:root`; keep them inside the app's own component styles and prefix them with the app name.
- Do not create one-off aliases when an existing shared token already communicates the right intent.

## Reference

- [Examples design-system package README](./design-system/README.md)
- [Fluent 2 design tokens](https://fluent2.microsoft.design/design-tokens)
