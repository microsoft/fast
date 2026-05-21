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

The app uses the **light** theme. `<html data-theme="light">` is set
statically in [`index.html`](./index.html); the app does not implement a
theme toggle. (The shared design-system package supports dark and
system-preference themes via the same `data-theme` attribute — see
[`examples/design-system/README.md`](../design-system/README.md) — but this
example deliberately keeps the surface area minimal and demonstrates only
token consumption.)

For the shared package overview, the token catalog, and authoring rules,
see [`examples/design-system/README.md`](../design-system/README.md) and
[`examples/design-system/DESIGN.md`](../design-system/DESIGN.md).

## Token usage

The todo app styles use shared tokens for layout, surfaces, typography, and
interaction states. For example:

- App shell surface: `--fast-background-layer-primary-solid`,
  `--fast-foreground-ctrl-neutral-primary-rest`,
  `--fast-stroke-divider-subtle`, `--fast-corner-large`,
  `--fast-shadow-card-rest`, `--fast-padding-content-medium`.
- Primary action (Add): `--fast-background-ctrl-brand-rest`,
  `--fast-foreground-ctrl-on-brand-rest`, `--fast-stroke-divider-brand`,
  `--fast-background-ctrl-brand-hover`, `--fast-background-ctrl-brand-pressed`.
- Typography: `--fast-text-style-default-regular-font-family`,
  `--fast-text-global-body3-font-size` paired with
  `--fast-text-global-body3-line-height`,
  `--fast-text-global-display2-font-size` paired with
  `--fast-text-global-display2-line-height`.
- Destructive action (per-row delete button):
  `--fast-status-danger-tint-foreground` (red text at rest),
  `--fast-status-danger-tint-background` (subtle red hover fill),
  `--fast-status-danger-tint-stroke` (focus outline).
- Focus rings: `--fast-ctrl-focus-outer-stroke` paired with
  `--fast-ctrl-focus-outer-stroke-width`.
- Motion: `--fast-duration-fast` and `--fast-curve-easy-ease` for hover and
  press transitions.

No design value (color, font size, line height, padding, gap, corner,
stroke width, shadow, duration, or curve) is hard-coded in the app's
component styles.
