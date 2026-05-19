# @microsoft/fast-examples-design-system

`@microsoft/fast-examples-design-system` is a private workspace package that
publishes Fluent 2-aligned CSS custom properties and small theme helpers for
FAST example apps. Import `tokens.css` once at the application root, then use
`--fast-*` tokens throughout component styles.

## Installation

This package is private and intended for other `examples/*` workspaces in this
monorepo. Add it as a workspace dependency in the consuming example app and run
`npm install` from the repository root.

```json
{
  "dependencies": {
    "@microsoft/fast-examples-design-system": "workspace:*"
  }
}
```

## Quickstart

```html
<html data-theme="light">
```

```ts
import "@microsoft/fast-examples-design-system/tokens.css";
import {
    applyTheme,
    toggleTheme,
} from "@microsoft/fast-examples-design-system";
```

## Using tokens in component styles

```ts
const styles = css`
    :host {
        color: var(--fast-color-neutral-foreground-1);
    }
`;
```

## Theme toggle example

```ts
import {
    applyTheme,
    getTheme,
    toggleTheme,
} from "@microsoft/fast-examples-design-system";

applyTheme("auto");

const button = document.querySelector("button[data-theme-toggle]");

button?.addEventListener("click", () => {
    const previousTheme = getTheme();
    const nextTheme = toggleTheme();
    console.log(`Theme changed from ${previousTheme} to ${nextTheme}.`);
});
```

For the full architecture, naming rules, and extension guidance, see
[DESIGN.md](./DESIGN.md).

## Condensed token reference

| Group | Variants |
| --- | --- |
| Colors: neutral background | `1`, `1-hover`, `1-pressed`, `1-selected`, `2`, `3`, `4`, `5`, `6`, `disabled`, `inverted` |
| Colors: neutral foreground | `1`, `2`, `3`, `4`, `disabled`, `on-brand`, `inverted` |
| Colors: neutral stroke | `1`, `1-hover`, `2`, `disabled`, `divider`, `accessible` |
| Colors: brand | `background`, `background-hover`, `background-pressed`, `background-selected`, `foreground-1`, `foreground-2`, `link`, `link-hover`, `stroke-1` |
| Colors: status | `success-background`, `success-foreground`, `warning-background`, `warning-foreground`, `danger-background`, `danger-foreground` |
| Font families | `base`, `monospace`, `numeric` |
| Font sizes | `base-100`, `base-200`, `base-300`, `base-400`, `base-500`, `base-600`, `hero-700`, `hero-800`, `hero-900`, `hero-1000` |
| Line heights | `base-100`, `base-200`, `base-300`, `base-400`, `base-500`, `base-600`, `hero-700`, `hero-800`, `hero-900`, `hero-1000` |
| Font weights | `regular`, `medium`, `semibold`, `bold` |
| Spacing: horizontal / vertical | `none`, `xxs`, `xs`, `s-nudge`, `s`, `m-nudge`, `m`, `l`, `xl`, `xxl`, `xxxl` |
| Border radius | `none`, `small`, `medium`, `large`, `xlarge`, `circular` |
| Stroke width | `thin`, `thick`, `thicker`, `thickest` |
| Shadows | `2`, `4`, `8`, `16`, `28`, `64` |
| Motion durations | `ultra-fast`, `faster`, `fast`, `normal`, `slow`, `slower`, `ultra-slow` |
| Motion curves | `accelerate-max`, `accelerate-mid`, `accelerate-min`, `decelerate-max`, `decelerate-mid`, `decelerate-min`, `easy-ease`, `easy-ease-max`, `linear` |
