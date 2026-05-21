# WebUI Todo App — design and architecture

This document describes the SSR todo example in
`examples/ssr/webui-todo-app/`. For the shared token catalog and naming rules,
see [`../../design-system/README.md`](../../design-system/README.md) and
[`../../design-system/DESIGN.md`](../../design-system/DESIGN.md).

## Purpose

This example demonstrates three pieces working together:

- FAST declarative templates stored as co-located `*.html` and `*.css` files.
- `@microsoft/webui` prerendering on the server, including Declarative Shadow
  DOM output.
- Client-side hydration through `@microsoft/fast-html`, so the prerendered UI
  becomes interactive without re-rendering from scratch.

The app stays intentionally small: a single todo list with add, toggle, and
delete behavior backed by a JSON state file.

## Folder structure

```text
examples/ssr/webui-todo-app/
├── DESIGN.md
├── README.md
├── data/
│   └── state.json
├── src/
│   ├── index.html
│   ├── index.ts
│   ├── todo-app/
│   │   ├── todo-app.css
│   │   ├── todo-app.html
│   │   └── todo-app.ts
│   └── todo-item/
│       ├── todo-item.css
│       ├── todo-item.html
│       └── todo-item.ts
├── package.json
└── tsconfig.json
```

### File roles

- `src/index.html` — document shell, page-level layout, and static
  `data-theme="light"` selection.
- `src/index.ts` — hydration entry; imports shared `tokens.css`, registers the
  custom elements, and defines `<f-template>`.
- `src/todo-app/` — root template, styles, and list management logic.
- `src/todo-item/` — per-row template, styles, and event dispatch for toggle
  and delete actions.
- `data/state.json` — initial server state consumed by `webui serve`.

## Build and serve flow

1. `npm run build -w @microsoft/fast-webui-todo-app-example` runs esbuild on
   `src/index.ts`.
2. Esbuild emits `dist/index.js` for hydration and bootstrap code.
3. Because `src/index.ts` imports
   `@microsoft/fast-examples-design-system/tokens.css`, esbuild also emits
   `dist/index.css`.
4. `webui serve ./src --state ./data/state.json --plugin=fast --servedir ./dist`
   uses `./src` as the source root for HTML templates and exposes the bundled
   assets from `./dist`.
5. On each request, `webui` reads `src/index.html`, resolves `{{}}` bindings
   from `data/state.json`, renders Declarative Shadow DOM, and returns
   prerendered HTML.
6. In the browser, `/index.js` defines the FAST custom elements and hydrates the
   prerendered DOM in place.
7. `/index.css` makes the shared `--fast-*` tokens available to both the page
   shell and shadow-root component styles.

## Component model

### `todo-app`

`todo-app` is the root custom element. It:

- reads the prerendered `<todo-item>` children during `prepare()`,
- converts them into an observable `items` array,
- tracks `remainingCount`,
- handles add, toggle, and delete operations, and
- re-renders the list through FAST bindings after hydration.

### `todo-item`

`todo-item` is a focused row component. It accepts `id`, `title`, and `state`
attributes, then emits `toggle-item` and `delete-item` events that the parent
handles.

## Design system wiring

This example consumes the shared
`@microsoft/fast-examples-design-system` workspace package.

- `src/index.ts` imports `@microsoft/fast-examples-design-system/tokens.css`
  exactly once.
- `src/index.html` links the generated `/index.css` bundle before its inline
  page-shell styles.
- `<html dir="{{textdirection}}" lang="en" data-theme="light">` hard-codes the
  light theme at document level.
- There is no runtime theme toggle, no theme persistence, and no JavaScript
  that mutates `data-theme`.

The design-system package is CSS-only. This example just consumes the
registered custom properties through `var(--fast-...)`.

## Representative tokens

The component styles rely on shared tokens rather than hard-coded design
values. Representative examples include:

- Page shell: `--fast-background-web-page-primary`,
  `--fast-foreground-ctrl-neutral-primary-rest`,
  `--fast-padding-content-xx-large`.
- Root card and section chrome: `--fast-background-layer-primary-solid`,
  `--fast-stroke-divider-subtle`, `--fast-corner-large`,
  `--fast-shadow-card-rest`.
- Typography: `--fast-text-style-default-regular-font-family`,
  `--fast-text-global-body3-font-size`,
  `--fast-text-global-body3-line-height`,
  `--fast-text-global-title1-font-size`,
  `--fast-text-global-title1-line-height`.
- Brand actions: `--fast-background-ctrl-brand-rest`,
  `--fast-background-ctrl-brand-hover`,
  `--fast-background-ctrl-brand-pressed`,
  `--fast-foreground-ctrl-on-brand-rest`.
- Focus and motion: `--fast-ctrl-focus-outer-stroke`,
  `--fast-ctrl-focus-outer-stroke-width`, `--fast-duration-fast`,
  `--fast-curve-easy-ease`.
- Status states: `--fast-status-success-tint-foreground`,
  `--fast-status-success-tint-background`,
  `--fast-status-danger-tint-foreground`,
  `--fast-status-danger-tint-background`.

## Why this example lives under `examples/ssr/`

Although the UI hydrates into client-side FAST components, the initial render is
produced through `@microsoft/webui` on the server. The important example
behavior is therefore SSR + prerendering + hydration, not a purely client-only
bootstrap.
