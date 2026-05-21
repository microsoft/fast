# FAST example apps

The `examples/` workspace hosts small, focused applications that show how to
build real UI with FAST using production-shaped tooling, app structure, and
styling. It is aimed at contributors, library consumers, and anyone evaluating
FAST patterns in a complete app context.

## Apps

| Folder | Package | Purpose |
| --- | --- | --- |
| `design-system` | `@microsoft/fast-examples-design-system` | Shared CSS design tokens (no JS) consumed by every example app. |
| `todo-app` | `@microsoft/fast-todo-app-example` | A To-Do app demonstrating `@microsoft/fast-element` patterns end to end, styled with the shared design-system tokens (light theme, no runtime toggle). |
| `ssr/chat-app` | `@microsoft/fast-chat-app-example` | A declarative FAST chat demo that pre-renders with `@microsoft/fast-build` and streams canned assistant replies into the transcript, styled with the shared design-system tokens (dark theme, no runtime toggle). |

Server-side-rendered (SSR) apps that pre-render with `@microsoft/fast-build`
live under [`examples/ssr/`](./ssr/). Other example apps live directly under
`examples/`.

## Shared design system

Every example app must consume `@microsoft/fast-examples-design-system`. The
package is **CSS-only** — it ships a single stylesheet (`tokens.css`) and no
JavaScript or TypeScript. Apps wire theme switching themselves using the
`data-theme` attribute on `<html>`.

The package exposes a single import:

| Import | What it does |
| --- | --- |
| `@microsoft/fast-examples-design-system/tokens.css` | Declares every token on `:root`. Color and elevation values use `light-dark()`; theme is controlled by `prefers-color-scheme` (default) or `<html data-theme="light"\|"dark">` (forced). |

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

1. Scaffold a new folder under `examples/<your-app>/`. SSR apps that
   pre-render with `@microsoft/fast-build` should instead live under
   `examples/ssr/<your-app>/`.
2. Use [`examples/todo-app/`](./todo-app/) as a reference for a typical
   client-rendered app, or [`examples/ssr/chat-app/`](./ssr/chat-app/) as a
   reference for an SSR app (`package.json`, `tsconfig.json`, build config,
   entry HTML).
3. Add `"@microsoft/fast-examples-design-system": "workspace:*"` to the new
   app's `dependencies` and run `npm install` from the repo root.
4. Import `@microsoft/fast-examples-design-system/tokens.css` exactly once at
   the app entry point (typically `src/main.ts` or `src/index.ts`). For an
   intentionally single-theme app, hard-code `<html data-theme="light">` (or
   `"dark"`) in the entry HTML and never touch it from JavaScript.
5. Reference tokens via `var(--fast-...)` in component `css` template
   literals or `.css` files — do not hard-code design values.
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
npm start -w @microsoft/fast-chat-app-example
```

## Useful links

- [Examples design guide](./DESIGN.md)
- [Examples design-system package](./design-system/README.md)
- [FAST repository README](../README.md)
- [FAST documentation](https://fast.design/docs/2.x/introduction/)
