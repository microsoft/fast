# Todo App Tutorial

A Todo app, written entirely with fast-element.

> Note: A step by step tutorial will be coming to the site soon. In the mean
> time, you can run `npm install` and then `npm start` to see the example.

> Note: This example uses an LSP, to enable this in VS Code try the following:
> - Open a javascript/typescript file and use the command palette to `Select
>   typescript version` and choose the local workspace version.

## Design system

This example consumes the shared `@microsoft/fast-examples-design-system`
workspace package. The app imports
`@microsoft/fast-examples-design-system/tokens.css` once in `src/main.ts`, then
uses the shared `--fast-*` design tokens throughout component styles.

For the shared package overview, token catalog, and theming helpers, see
[`examples/design-system/README.md`](../design-system/README.md).

## Theme toggle

The toolbar includes a theme toggle that reflects the current mode as
`☀️ Light`, `🌙 Dark`, or `🖥️ Auto`.

The default `🖥️ Auto` state leaves the `<html>` element without an explicit
`data-theme` attribute, so `prefers-color-scheme` determines whether the app
renders with light or dark tokens.

## Token usage

The todo app styles use shared tokens for layout, surfaces, typography, and
interaction states. For example, the app shell uses
`--fast-color-neutral-background-1`, the primary actions use
`--fast-color-brand-background`, and spacing is driven by
`--fast-spacing-horizontal-l`.
