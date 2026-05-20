# @microsoft/fast-examples-design-system

A CSS-only design system for FAST example apps. The package ships three
hand-authored stylesheets that define a Fluent 2-aligned set of CSS custom
properties for color, typography, spacing, shape, elevation, and motion. There
is **no JavaScript or TypeScript implementation** — example apps wire themes
themselves by toggling the `data-theme` attribute on `<html>`.

This README and [`DESIGN.md`](./DESIGN.md) are the canonical guidance for both
humans and coding agents working in the `examples/*` workspace.

## What ships

| File | Contents | Use when |
| --- | --- | --- |
| `tokens.css` | All tokens, with light values on `:root` and dark overrides via `[data-theme="dark"]` and `prefers-color-scheme: dark`. | The app supports a runtime theme toggle, or wants automatic system-preference behavior. **Recommended default.** |
| `tokens-light.css` | All tokens on `:root` with light color values; sets `color-scheme: light`. | The app is light-only and will never switch themes. |
| `tokens-dark.css` | All tokens on `:root` with dark color values; sets `color-scheme: dark`. | The app is dark-only and will never switch themes. |

The package is `"private": true` and consumed via the workspace dependency
`"@microsoft/fast-examples-design-system": "workspace:*"`.

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

### Switchable light / dark (recommended)

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

### Light-only or dark-only app

```ts
// src/main.ts
import "@microsoft/fast-examples-design-system/tokens-light.css";
// or:
// import "@microsoft/fast-examples-design-system/tokens-dark.css";
```

### Referencing tokens from component CSS

Reference tokens through `var(--fast-...)` in FAST `css` template literals or
in any other CSS context. Never hard-code colors, font sizes, spacing, radii,
border widths, shadows, durations, or easings.

```ts
import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        padding: var(--fast-spacing-lg);
        background: var(--fast-color-background-default);
        color: var(--fast-color-foreground-default);
        border: var(--fast-border-width-sm) solid var(--fast-color-border-subtle);
        border-radius: var(--fast-radius-lg);
        box-shadow: var(--fast-shadow-md);
        font-family: var(--fast-font-family-base);
        font-size: var(--fast-font-size-body-1);
        line-height: var(--fast-line-height-body-1);
        transition: background var(--fast-duration-fast) var(--fast-easing-standard);
    }
`;
```

## Theme switching

When `tokens.css` is loaded, the active theme is selected by the `data-theme`
attribute on `<html>`:

| `data-theme` value | Effective theme |
| --- | --- |
| `"light"` | Forced light |
| `"dark"` | Forced dark |
| _absent_ | Follows `prefers-color-scheme` (dark if the system requests dark, light otherwise) |

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

See [`../todo-app/`](../todo-app/) for a working three-state (light, dark,
auto) toggle that uses only this DOM API.

## Token catalog

The complete list of tokens lives in the source CSS files. Categories at a
glance:

| Category | Examples |
| --- | --- |
| Color: background | `--fast-color-background-default`, `--fast-color-background-canvas`, `--fast-color-background-default-hover`, `--fast-color-background-emphasis`, `--fast-color-background-inverse`, `--fast-color-background-disabled` |
| Color: foreground | `--fast-color-foreground-default`, `--fast-color-foreground-muted`, `--fast-color-foreground-subtle`, `--fast-color-foreground-on-accent`, `--fast-color-foreground-inverse`, `--fast-color-foreground-disabled` |
| Color: border | `--fast-color-border-default`, `--fast-color-border-subtle`, `--fast-color-border-strong`, `--fast-color-border-divider`, `--fast-color-border-disabled` |
| Color: accent | `--fast-color-accent-default`, `--fast-color-accent-default-hover`, `--fast-color-accent-foreground`, `--fast-color-accent-link`, `--fast-color-accent-border` |
| Color: feedback | `--fast-color-feedback-danger-foreground`, `--fast-color-feedback-danger-background`, `--fast-color-feedback-success-foreground`, `--fast-color-feedback-success-background`, `--fast-color-feedback-warning-foreground`, `--fast-color-feedback-warning-background` |
| Font family | `--fast-font-family-base`, `--fast-font-family-monospace`, `--fast-font-family-numeric` |
| Font size (type ramp) | `--fast-font-size-caption-2`, `--fast-font-size-caption-1`, `--fast-font-size-body-1`, `--fast-font-size-body-2`, `--fast-font-size-subtitle-2`, `--fast-font-size-subtitle-1`, `--fast-font-size-title-3`, `--fast-font-size-title-2`, `--fast-font-size-title-1`, `--fast-font-size-display` |
| Line height | Same ramp names paired with each font size, e.g. `--fast-line-height-body-1` |
| Font weight | `--fast-font-weight-regular`, `--fast-font-weight-medium`, `--fast-font-weight-semibold`, `--fast-font-weight-bold` |
| Spacing | `--fast-spacing-none`, `--fast-spacing-2xs`, `--fast-spacing-xs`, `--fast-spacing-sm`, `--fast-spacing-md`, `--fast-spacing-lg`, `--fast-spacing-xl`, `--fast-spacing-2xl`, `--fast-spacing-3xl` |
| Radius | `--fast-radius-none`, `--fast-radius-sm`, `--fast-radius-md`, `--fast-radius-lg`, `--fast-radius-xl`, `--fast-radius-pill` |
| Border width | `--fast-border-width-sm`, `--fast-border-width-md`, `--fast-border-width-lg`, `--fast-border-width-xl` |
| Shadow | `--fast-shadow-xs`, `--fast-shadow-sm`, `--fast-shadow-md`, `--fast-shadow-lg`, `--fast-shadow-xl`, `--fast-shadow-2xl` |
| Duration | `--fast-duration-instant`, `--fast-duration-fastest`, `--fast-duration-fast`, `--fast-duration-normal`, `--fast-duration-slow`, `--fast-duration-slowest`, `--fast-duration-extra-slow` |
| Easing | `--fast-easing-standard`, `--fast-easing-emphasized`, `--fast-easing-accelerate`, `--fast-easing-accelerate-subtle`, `--fast-easing-accelerate-strong`, `--fast-easing-decelerate`, `--fast-easing-decelerate-subtle`, `--fast-easing-decelerate-strong`, `--fast-easing-linear` |

See [`DESIGN.md`](./DESIGN.md) for the full naming grammar, the rationale, and
the rules for adding new tokens.
