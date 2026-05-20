# Todo app tutorial

A To-Do app, written entirely with `fast-element`.

> Note: A step by step tutorial will be coming to the site soon. In the mean
> time, you can run `npm install` and then `npm start` to see the example.

> Note: This example uses an LSP, to enable this in VS Code try the following:
> - Open a javascript/typescript file and use the command palette to `Select
>   typescript version` and choose the local workspace version.

## Design system

This example consumes the shared `@microsoft/fast-examples-design-system`
workspace package. The design-system package is **CSS-only** — there are no
JavaScript or TypeScript exports. `src/main.ts` imports
`@microsoft/fast-examples-design-system/tokens.css` once, and the rest of the
app references the registered `--fast-*` design tokens through `var(...)`.

For the shared package overview, available stylesheets, token catalog, and
authoring rules, see
[`examples/design-system/README.md`](../design-system/README.md) and
[`examples/design-system/DESIGN.md`](../design-system/DESIGN.md).

## Theme toggle

The toolbar includes a three-state toggle that displays as `☀️ Light`,
`🌙 Dark`, or `🖥️ Auto`. The toggle cycles in that order.

The toggle is implemented entirely inside the app, in
[`src/todo-app.ts`](./src/todo-app.ts), by reading and writing the
`data-theme` attribute on `<html>` with plain DOM APIs:

```ts
document.documentElement.setAttribute("data-theme", "light");
document.documentElement.setAttribute("data-theme", "dark");
document.documentElement.removeAttribute("data-theme"); // Auto
```

The shared `tokens.css` stylesheet responds to that attribute and falls back
to `prefers-color-scheme` while no explicit theme is set, so the default
`🖥️ Auto` state tracks the user's system preference automatically. This
pattern is what every example app is expected to use — the design-system
package intentionally exposes no JavaScript theme API.

## Token usage

The todo app styles use shared tokens for layout, surfaces, typography, and
interaction states. For example:

- App shell surface: `--fast-color-background-default`,
  `--fast-color-foreground-default`, `--fast-color-border-subtle`,
  `--fast-radius-lg`, `--fast-shadow-md`, `--fast-spacing-lg`.
- Primary action (theme toggle button): `--fast-color-accent-default`,
  `--fast-color-foreground-on-accent`, `--fast-color-accent-border`,
  `--fast-color-accent-default-hover`, `--fast-color-accent-default-active`.
- Typography: `--fast-font-family-base`, `--fast-font-size-body-1` paired
  with `--fast-line-height-body-1`, `--fast-font-size-title-3` paired with
  `--fast-line-height-title-3`.
- Feedback: `--fast-color-feedback-danger-foreground` and
  `--fast-color-feedback-danger-background` for the per-row remove action.
- Motion: `--fast-duration-fast` and `--fast-easing-standard` for hover and
  press transitions.

No design value (color, font size, line height, spacing, radius, border
width, shadow, duration, or easing) is hard-coded in the app's component
styles.
