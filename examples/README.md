# FAST Example Apps

The `examples/` workspace contains small, focused applications that show how to build real UI with FAST using production-shaped tooling, app structure, and styling. It is aimed at contributors, library consumers, and anyone evaluating FAST patterns in a complete app context.

## Apps

| Folder | Package | Purpose |
| --- | --- | --- |
| `todo-app` | `@microsoft/fast-todo-app-example` | A To-Do app demonstrating `@microsoft/fast-element` patterns in a complete application shell. |
| `design-system` | `@microsoft/fast-examples-design-system` | Shared design tokens and theme helpers consumed by every example app. |

## Shared design system

All example apps must consume `@microsoft/fast-examples-design-system` so they present a consistent look and feel aligned with Fluent 2. Import `@microsoft/fast-examples-design-system/tokens.css` once at app startup, style components with `var(--fast-...)`, and use semantic tokens such as `--fast-color-neutral-background-1`, `--fast-color-brand-background`, `--fast-font-size-base-300`, and `--fast-border-radius-medium` instead of hard-coded values.

See:

- [`examples/design-system/README.md`](./design-system/README.md) for package usage
- [`examples/DESIGN.md`](./DESIGN.md) for the token taxonomy, theme model, and extension rules

## Creating a new example app

1. Scaffold a new folder under `examples/<your-app>/`.
2. Use [`examples/todo-app/`](./todo-app/) as a reference for `package.json`, `tsconfig.json`, `vite.config.ts`, and `index.html`.
3. Add `@microsoft/fast-examples-design-system` as a workspace dependency.
4. Import `@microsoft/fast-examples-design-system/tokens.css` once at the app entry point.
5. Reference tokens via `var(--fast-...)` in component `css` template literals—do not hard-code colors, font sizes, spacing, or radii.
6. Set `data-theme` on `<html>` (or use `applyTheme`) and let the default behavior honor `prefers-color-scheme` when no theme is forced.
7. Update `examples/README.md` to add the new app to the table above.

## Running an example

From the repository root:

```shell
npm install
npm start -w @microsoft/fast-<your-app>-example
```

For the current example app:

```shell
npm start -w @microsoft/fast-todo-app-example
```

## Useful links

- [Example apps design system](./DESIGN.md)
- [Examples design-system package](./design-system/README.md)
- [FAST repository README](../README.md)
- [FAST documentation](https://fast.design/docs/2.x/introduction/)
