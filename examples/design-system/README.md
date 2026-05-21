# @microsoft/fast-examples-design-system

A CSS-only design system for FAST example apps. The package ships three
hand-authored stylesheets that define a shared set of CSS custom properties
for color, typography, spacing, shape, elevation, and motion. There is **no
JavaScript or TypeScript implementation** — example apps wire themes
themselves by toggling the `data-theme` attribute on `<html>`.

This README and [`DESIGN.md`](./DESIGN.md) are the canonical guidance for both
humans and coding agents working in the `examples/*` workspace.

Token names are semantic and use-site-oriented, with the `--fast-` prefix
and coverage tuned for FAST example apps.

## What ships

The package ships exactly one stylesheet:

| File | Contents |
| --- | --- |
| `tokens.css` | Every token, declared once on `:root`. Color and elevation values use the CSS `light-dark()` function, so each declaration carries both its light and dark resolution side by side. `color-scheme: light dark` enables system-preference resolution; `<html data-theme="light">` or `<html data-theme="dark">` forces a theme. |

The package is `"private": true` and consumed via the workspace dependency
`"@microsoft/fast-examples-design-system": "workspace:*"`.

`tokens.css` uses the CSS `light-dark()` function, which requires
Chrome / Edge 123+, Firefox 120+, or Safari 17.5+ (all shipped in
2023–2024). These example apps target evergreen browsers; there is no
fallback for older versions.

## Install

Add the workspace dependency in the consuming example app's `package.json`,
then run `npm install` from the repository root.

```json
{
    "dependencies": {
        "@microsoft/fast-examples-design-system": "workspace:*"
    }
}
```

## Use

Import the stylesheet exactly once at the app entry point — typically the same
file that defines or bootstraps the root custom element. The bundler (Vite in
the existing examples) inlines the CSS into the document.

```ts
// src/main.ts
import "@microsoft/fast-examples-design-system/tokens.css";
```

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
    <!-- no data-theme attribute → follows prefers-color-scheme -->
    <body>
        <my-app></my-app>
    </body>
</html>
```

If the app is intentionally single-theme, hard-code the attribute and never
touch it from JavaScript:

```html
<html lang="en" data-theme="light"> <!-- or "dark" -->
```

### Referencing tokens from component CSS

Reference tokens through `var(--fast-...)` in FAST `css` template literals or
in any other CSS context. Never hard-code colors, font sizes, spacing, radii,
border widths, shadows, durations, or curves.

```ts
import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        padding: var(--fast-padding-content-medium);
        background: var(--fast-background-layer-primary-solid);
        color: var(--fast-foreground-ctrl-neutral-primary-rest);
        border: var(--fast-stroke-width-default) solid
            var(--fast-stroke-divider-subtle);
        border-radius: var(--fast-corner-large);
        box-shadow: var(--fast-shadow-card-rest);
        font-family: var(--fast-text-style-default-regular-font-family);
        font-size: var(--fast-text-global-body3-font-size);
        line-height: var(--fast-text-global-body3-line-height);
        transition: background var(--fast-duration-fast)
            var(--fast-curve-easy-ease);
    }
`;
```

## Theme switching

The active theme is selected by the `data-theme` attribute on `<html>`:

| `data-theme` value | Effective theme |
| --- | --- |
| `"light"` | Forced light |
| `"dark"` | Forced dark |
| _absent_ | Follows `prefers-color-scheme` (dark if the system requests dark, light otherwise) |

Under the hood, `tokens.css` declares `color-scheme: light dark` on `:root`
and uses the CSS `light-dark()` function in every color/elevation token.
The browser picks the matching value based on the inherited
`color-scheme`. Setting `data-theme="light"` or `data-theme="dark"`
overrides `color-scheme` to that single value, which flips every
`light-dark()` resolution. No media query is needed.

To wire a toggle, write the attribute directly from your application code. The
design system itself contains no JavaScript — toggles, persistence, and event
plumbing are intentionally left to the consuming app so the system stays
framework-neutral and dependency-free.

```ts
// Force light
document.documentElement.setAttribute("data-theme", "light");

// Force dark
document.documentElement.setAttribute("data-theme", "dark");

// Restore system preference
document.documentElement.removeAttribute("data-theme");
```

See [`../todo-app/`](../todo-app/) for a working consumer of the design
system. The example deliberately uses a single (light) theme set
statically in markup; it does not implement a runtime toggle.

## Token catalog

The complete list of tokens lives in [`tokens.css`](./tokens.css). Categories
at a glance:

| Category | Examples |
| --- | --- |
| Background: surfaces | `--fast-background-web-page-primary`, `--fast-background-layer-primary-solid`, `--fast-background-layer-secondary` |
| Background: subtle controls | `--fast-background-ctrl-subtle-rest`, `--fast-background-ctrl-subtle-hover`, `--fast-background-ctrl-subtle-pressed`, `--fast-background-ctrl-subtle-disabled` |
| Background: brand controls | `--fast-background-ctrl-brand-rest`, `--fast-background-ctrl-brand-hover`, `--fast-background-ctrl-brand-pressed`, `--fast-background-ctrl-brand-disabled` |
| Foreground | `--fast-foreground-ctrl-neutral-primary-rest`, `--fast-foreground-ctrl-neutral-primary-disabled`, `--fast-foreground-ctrl-neutral-secondary-rest`, `--fast-foreground-ctrl-hint-default`, `--fast-foreground-ctrl-on-brand-rest`, `--fast-foreground-ctrl-brand-rest` |
| Stroke: dividers | `--fast-stroke-divider-default`, `--fast-stroke-divider-subtle`, `--fast-stroke-divider-strong`, `--fast-stroke-divider-brand` |
| Stroke: control outlines | `--fast-stroke-ctrl-on-outline-rest`, `--fast-stroke-ctrl-on-outline-disabled` |
| Stroke widths | `--fast-stroke-width-default`, `--fast-stroke-width-divider-strong` |
| Control focus | `--fast-ctrl-focus-outer-stroke`, `--fast-ctrl-focus-outer-stroke-width` |
| Status: solid | `--fast-status-{danger, success, warning}-background`, `--fast-status-{danger, success, warning}-foreground` |
| Status: tinted | `--fast-status-{danger, success, warning}-tint-background`, `--fast-status-{danger, success, warning}-tint-foreground`, `--fast-status-{danger, success, warning}-tint-stroke` |
| Shadow | `--fast-shadow-card-rest-key`, `--fast-shadow-card-rest-ambient`, `--fast-shadow-card-rest`, `--fast-shadow-flyout-key`, `--fast-shadow-flyout-ambient`, `--fast-shadow-flyout` |
| Text: families | `--fast-text-style-default-regular-font-family`, `--fast-text-style-code-regular-font-family`, `--fast-text-style-data-viz-regular-font-family` |
| Text: weights | `--fast-text-style-default-regular-weight`, `--fast-text-style-default-header-weight`, `--fast-text-style-default-display-weight` |
| Text: global ramp (font size + line height pairs) | `--fast-text-global-caption2-*`, `--fast-text-global-caption1-*`, `--fast-text-global-body3-*`, `--fast-text-global-body2-*`, `--fast-text-global-body1-*`, `--fast-text-global-subtitle2-*`, `--fast-text-global-subtitle1-*`, `--fast-text-global-title2-*`, `--fast-text-global-title1-*`, `--fast-text-global-display2-*`, `--fast-text-global-display1-*` |
| Padding (inset) | `--fast-padding-content-none`, `--fast-padding-content-xx-small`, `-x-small`, `-small`, `-medium`, `-large`, `-x-large`, `-xx-large`, `-xxx-large` |
| Gap (between elements) | `--fast-gap-between-content-none`, `--fast-gap-between-content-xx-small`, `-x-small`, `-small`, `-medium`, `-large`, `-x-large`, `-xx-large` |
| Corner | `--fast-corner-none`, `--fast-corner-small`, `--fast-corner-medium`, `--fast-corner-large`, `--fast-corner-circular` |
| Duration | `--fast-duration-ultra-fast`, `--fast-duration-faster`, `--fast-duration-fast`, `--fast-duration-normal`, `--fast-duration-gentle`, `--fast-duration-slow`, `--fast-duration-slower`, `--fast-duration-ultra-slow` |
| Curve | `--fast-curve-accelerate-max`, `-mid`, `-min`, `--fast-curve-decelerate-max`, `-mid`, `-min`, `--fast-curve-easy-ease-max`, `--fast-curve-easy-ease`, `--fast-curve-linear` |

State vocabulary on interactive tokens: `rest`, `hover`, `pressed`,
`disabled`. Optionally prefixed with `selected-` for selectable controls.

See [`DESIGN.md`](./DESIGN.md) for the full naming grammar, the rationale, and
the rules for adding new tokens.
