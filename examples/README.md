# FAST example apps

The `examples/` workspace hosts small, focused applications that show how to
build real UI with FAST using production-shaped tooling, app structure, and
styling. It is aimed at contributors, library consumers, and anyone evaluating
FAST patterns in a complete app context.

## Apps

| Folder | Package | Purpose |
| --- | --- | --- |
| `design-system` | `@microsoft/fast-examples-design-system` | Shared CSS design tokens (no JS) consumed by every example app. |
| `todo-app` | `@microsoft/fast-todo-app-example` | A To-Do app demonstrating `@microsoft/fast-element` patterns end to end, including a three-state light/dark/auto toggle. |

## Shared design system

Every example app must consume `@microsoft/fast-examples-design-system`. The
package is **CSS-only** — it ships three stylesheets and ships no JavaScript
or TypeScript. Apps wire theme switching themselves using the `data-theme`
attribute on `<html>`.

The available imports are:

| Import | When to use |
| --- | --- |
| `@microsoft/fast-examples-design-system/tokens.css` | Default. Supports a runtime light/dark toggle and `prefers-color-scheme`. |
| `@microsoft/fast-examples-design-system/tokens-light.css` | Light-only apps. |
| `@microsoft/fast-examples-design-system/tokens-dark.css` | Dark-only apps. |

Style components with semantic tokens such as
`--fast-background-layer-primary-solid`,
`--fast-foreground-ctrl-neutral-primary-rest`,
`--fast-background-ctrl-brand-rest`, `--fast-text-global-body3-font-size`,
`--fast-padding-content-medium`, and `--fast-corner-large`. Never hard-code
colors, font sizes, padding, gaps, corners, stroke widths, shadows,
durations, or curves.

See:

- [`examples/design-system/README.md`](./design-system/README.md) — quickstart,
  available imports, token catalog.
- [`examples/design-system/DESIGN.md`](./design-system/DESIGN.md) — naming
  grammar, role catalog, theme model, and rules for adding tokens (the
  canonical authoring guide for both humans and coding agents).
- [`examples/DESIGN.md`](./DESIGN.md) — workspace-level guidance for building
  new example apps on top of the design system.

## Creating a new example app

1. Scaffold a new folder under `examples/<your-app>/`.
2. Use [`examples/todo-app/`](./todo-app/) as a reference for `package.json`,
   `tsconfig.json`, `vite.config.ts`, and `index.html`.
3. Add `"@microsoft/fast-examples-design-system": "workspace:*"` to the new
   app's `dependencies` and run `npm install` from the repo root.
4. Import `@microsoft/fast-examples-design-system/tokens.css` exactly once at
   the app entry point (typically `src/main.ts`). Use `tokens-light.css` or
   `tokens-dark.css` instead if the app is intentionally single-theme.
5. Reference tokens via `var(--fast-...)` in component `css` template
   literals — do not hard-code design values.
6. If the app needs a theme toggle, set or remove the `data-theme` attribute
   on `<html>` from your app code:
   ```ts
   document.documentElement.setAttribute("data-theme", "dark");
   document.documentElement.removeAttribute("data-theme"); // restore system
   ```
   Do **not** import any JavaScript from the design-system package — it
   intentionally exposes none.
7. Add the new app to the table at the top of this file.

## Running an example

From the repository root:

```shell
npm install
npm start -w @microsoft/fast-<your-app>-example
```

For the existing example app:

```shell
npm start -w @microsoft/fast-todo-app-example
```

## Useful links

- [Examples design guide](./DESIGN.md)
- [Examples design-system package](./design-system/README.md)
- [FAST repository README](../README.md)
- [FAST documentation](https://fast.design/docs/2.x/introduction/)
